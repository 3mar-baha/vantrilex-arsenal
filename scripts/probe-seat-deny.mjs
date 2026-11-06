#!/usr/bin/env node
// Usage: node scripts/probe-seat-deny.mjs
//
// Fixture-based probe for the seat-deny overlay (RUN-0.9.0-FIX, MFT-035/MFT-037).
// Builds four throwaway seat files under the OS temp area, drives
// seatDenyOverlay against each, and asserts deny / allow / fail-closed outcomes
// plus "no mutation on an explicit configured deny". The repository is only read.
// Exit 0 when every probe passes, 1 otherwise.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seatDenyOverlay } from "../.opencode/plugin/arsenal.ts";

const ROOT_TMP = path.join(os.tmpdir(), "probe-seat-deny");
fs.rmSync(ROOT_TMP, { recursive: true, force: true });
fs.mkdirSync(path.join(ROOT_TMP, ".opencode", "agents"), { recursive: true });

const makeCtx = (root) => ({
  rt: { fs, path, execFile: null, os, proc: process, loadErrors: [] },
  root,
  client: undefined,
  sessions: new Map(),
  anchors: new Map(),
  config: {
    docsGuard: { mode: "off", enabled: false },
    taskDispatcher: { enabled: true },
    vantrilex: { enabled: true, excludedProjects: [] },
  },
  tscChain: Promise.resolve(),
  pendingWarnings: [],
  lastLogTarget: null,
  capabilityLines: [],
  capabilitiesFlushed: false,
});

const writeSeat = (name, body) => {
  fs.writeFileSync(path.join(ROOT_TMP, ".opencode", "agents", name + ".md"), body, "utf8");
};

const seatEvent = (agent, action, resources, overrides) => ({
  sessionID: "ses_probe",
  agent,
  action,
  resources,
  effect: "allow",
  ...(overrides ?? {}),
});

const ctx = makeCtx(ROOT_TMP);

let denyPass = 0;
let denyTotal = 1;
let allowPass = 0;
let allowTotal = 1;
let malformedPass = 0;
let malformedTotal = 1;

// --- Fixture 1: fake seat file with a deny rule -> deny outcome ---
writeSeat(
  "deny-seat",
  [
    "---",
    "name: deny-seat",
    "permissions:",
    "  - action: subagent",
    "    resource: '*'",
    "    effect: deny",
    "  - action: subagent",
    "    resource: 'vantrilex-fixer'",
    "    effect: allow",
    "---",
    "",
    "# deny seat",
    "",
  ].join("\n"),
);

try {
  const ev = seatEvent("deny-seat", "subagent", ["vantrilex-scribe"]);
  await seatDenyOverlay(ctx, ev);
  if (ev.effect === "deny" && typeof ev.message === "string" && ev.message.includes("seat-deny")) {
    denyPass += 1;
  } else {
    console.error("FAIL - DENY: " + JSON.stringify(ev));
  }
} catch (error) {
  console.error("FAIL - DENY: " + (error && error.message ? error.message : String(error)));
}

// --- Fixture 2: fake allow -> allow outcome (no mutation) ---
writeSeat(
  "allow-seat",
  [
    "---",
    "name: allow-seat",
    "permissions:",
    "  - action: subagent",
    "    resource: '*'",
    "    effect: allow",
    "---",
    "",
    "# allow seat",
    "",
  ].join("\n"),
);

try {
  const ev = seatEvent("allow-seat", "subagent", ["vantrilex-scribe"]);
  const before = ev.effect;
  await seatDenyOverlay(ctx, ev);
  if (ev.effect === "allow" && ev.effect === before) {
    allowPass += 1;
  } else {
    console.error("FAIL - ALLOW: " + JSON.stringify(ev));
  }
} catch (error) {
  console.error("FAIL - ALLOW: " + (error && error.message ? error.message : String(error)));
}

// --- Fixture 3: malformed block -> fail-closed deny ---
writeSeat(
  "malformed-seat",
  [
    "---",
    "name: malformed-seat",
    "permissions:",
    "  - action: read",
    "    resource: '*'",
    "    effect: perhaps",
    "---",
    "",
    "# malformed seat",
    "",
  ].join("\n"),
);

try {
  const ev = seatEvent("malformed-seat", "read", ["docs/dev/01-PLUGIN.md"]);
  await seatDenyOverlay(ctx, ev);
  if (
    ev.effect === "deny" &&
    typeof ev.message === "string" &&
    ev.message.includes("malformed") &&
    ev.message.includes("failing closed")
  ) {
    malformedPass += 1;
  } else {
    console.error("FAIL - MALFORMED-DENY: " + JSON.stringify(ev));
  }
} catch (error) {
  console.error("FAIL - MALFORMED-DENY: " + (error && error.message ? error.message : String(error)));
}

// --- Fixture 4: explicit configured deny (effect: "deny") -> no mutation ---
writeSeat(
  "deny-seat2",
  [
    "---",
    "name: deny-seat2",
    "permissions:",
    "  - action: subagent",
    "    resource: '*'",
    "    effect: deny",
    "---",
    "",
    "# deny seat 2",
    "",
  ].join("\n"),
);

try {
  const ev = seatEvent("deny-seat2", "subagent", ["vantrilex-scribe"], {
    effect: "deny",
    message: "host denied",
  });
  await seatDenyOverlay(ctx, ev);
  if (ev.effect === "deny" && ev.message === "host denied") {
    // no mutation on deny: counted as part of the deny outcome above
  } else {
    console.error("FAIL - NO-MUTATION-ON-DENY: " + JSON.stringify(ev));
    process.exitCode = 1;
  }
} catch (error) {
  console.error("FAIL - NO-MUTATION-ON-DENY: " + (error && error.message ? error.message : String(error)));
  process.exitCode = 1;
}

console.log(`DENY ${denyPass}/${denyTotal}, ALLOW ${allowPass}/${allowTotal}, MALFORMED-DENY ${malformedPass}/${malformedTotal}`);

if (denyPass !== denyTotal || allowPass !== allowTotal || malformedPass !== malformedTotal) {
  process.exitCode = 1;
}
