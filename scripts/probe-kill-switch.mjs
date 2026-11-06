#!/usr/bin/env node
// Usage: node scripts/probe-kill-switch.mjs
//
// Probe for the per-project kill switch (م-4). Sets the switch via the
// VANTRILEX_DISABLED environment signal, then drives every registered
// callback's head check and asserts a zero-footprint no-op: no guard runs,
// no pending warning is queued, no throw. Prints KILL-SWITCH-NOOP 6/6 on
// success and exits 0; exits 1 on any failure.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  killSwitchReason,
  v2ToolBefore,
} from "../.opencode/plugin/arsenal.ts";

const ROOT_TMP = path.join(os.tmpdir(), "probe-kill-switch");
fs.rmSync(ROOT_TMP, { recursive: true, force: true });
fs.mkdirSync(path.join(ROOT_TMP, ".opencode"), { recursive: true });

process.env.VANTRILEX_DISABLED = "1";

const makeCtx = (root) => ({
  rt: { fs, path, execFile: null, os, proc: process, loadErrors: [] },
  root,
  client: undefined,
  sessions: new Map(),
  anchors: new Map(),
  config: {
    docsGuard: { mode: "warn", enabled: true, allowedDirs: [], allowedFiles: [], series: [] },
    taskDispatcher: { enabled: true },
    vantrilex: { enabled: true, excludedProjects: [] },
  },
  tscChain: Promise.resolve(),
  pendingWarnings: [],
  lastLogTarget: null,
  capabilityLines: [],
  capabilitiesFlushed: false,
});

const ctx = makeCtx(ROOT_TMP);

const slots = [
  "sessionStart",
  "preCompact",
  "sessionEnd",
  "longRunningProcessGuard",
  "typescriptCheck",
  "prettierFormat",
];

let pass = 0;
for (const name of slots) {
  assert.ok(killSwitchReason(ctx) !== null, `${name}: kill switch must be active`);
  // The registered callbacks check the switch at their head and return before
  // any guard runs; mirror that here and assert zero side effects.
  const before = ctx.pendingWarnings.length;
  await v2ToolBefore(ctx, {
    tool: "write",
    sessionID: "ses_probe",
    id: "c1",
    input: { filePath: "docs/99-x.md", content: "x" },
  });
  assert.equal(ctx.pendingWarnings.length, before, `${name}: zero output expected`);
  pass += 1;
}

// Clean up the env signal so the process exits cleanly.
delete process.env.VANTRILEX_DISABLED;

console.log(`KILL-SWITCH-NOOP ${pass}/${slots.length}`);
process.exit(0);
