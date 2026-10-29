// LD-08 trust-plane verify script — Node stdlib only, ESM, zero dependencies.
//
// Self-test for the V3:3524-3576 exit criteria that are mechanically
// checkable: subset-rule enforcement by mechanism, lethal-triad full-path
// data check, and confined-tier escape / self-promotion as release-blocking
// tests, all behind the permission-evaluation veto (fail-closed).
//
// Usage:
//   node .opencode/audit/BUILD-098/trust-probe.mjs   (self-test, exit 0 on PASS)

import { createHash } from "node:crypto";
import {
  enforceSpawnGrant,
  evaluatePermission,
  lethalTriadPathCheck,
  requestLevelChange,
} from "./policy-hooks.mjs";

const lines = [];
function emit(line) {
  lines.push(line);
  console.log(line);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`self-test FAIL: ${label}: expected ${expected}, got ${actual}`);
  }
}

function runSelfTest() {
  // 1. Veto point: deny-default, fail-closed.
  const vetoRead = evaluatePermission({ level: "collaborator", action: "read", resource: "registry" });
  assertEqual(vetoRead.effect, "allow", "veto.granted-read");
  emit(`VETO granted-read effect=${vetoRead.effect} reason=${vetoRead.reason}`);

  const vetoUnknown = evaluatePermission({ level: "operator", action: "launch", resource: "missiles" });
  assertEqual(vetoUnknown.effect, "deny", "veto.unknown-denied");
  emit(`VETO unknown-action effect=${vetoUnknown.effect} reason=${vetoUnknown.reason}`);

  const vetoMalformed = evaluatePermission(null);
  assertEqual(vetoMalformed.effect, "deny", "veto.malformed-denied");
  emit(`VETO malformed effect=${vetoMalformed.effect} reason=${vetoMalformed.reason}`);

  // 2. Subset rule by mechanism: narrower child allowed, wider child fails.
  const parent = {
    level: "operator",
    grant: [
      { action: "read", resource: "registry" },
      { action: "verdict", resource: "approval-queue" },
    ],
  };
  const narrowChild = { level: "collaborator", grant: [{ action: "read", resource: "registry" }] };
  const narrow = enforceSpawnGrant(parent, narrowChild);
  assertEqual(narrow.effect, "allow", "subset.narrow-allowed");
  emit(`SUBSET narrow-child effect=${narrow.effect} reason=${narrow.reason}`);

  const wideChild = {
    level: "collaborator",
    grant: [
      { action: "read", resource: "registry" },
      { action: "write", resource: "registry" },
    ],
  };
  const wide = enforceSpawnGrant(parent, wideChild);
  assertEqual(wide.effect, "deny", "subset.wide-denied");
  emit(`SUBSET wide-child effect=${wide.effect} reason=${wide.reason}`);

  const rankUp = {
    level: "operator",
    grant: [{ action: "read", resource: "registry" }],
  };
  const rankEscalation = enforceSpawnGrant({ level: "collaborator", grant: parent.grant }, rankUp);
  assertEqual(rankEscalation.effect, "deny", "subset.rank-denied");
  emit(`SUBSET rank-escalation effect=${rankEscalation.effect} reason=${rankEscalation.reason}`);

  // 3. Lethal-triad full-path data check: a complete triad-loaded path
  // cannot be sent; a path missing one leg is not triad-loaded.
  const triadPath = [
    { untrustedInput: true, externalEgress: false, consequentialAct: false },
    { untrustedInput: false, externalEgress: true, consequentialAct: false },
    { untrustedInput: false, externalEgress: false, consequentialAct: true },
  ];
  const triad = lethalTriadPathCheck(triadPath);
  assertEqual(triad.send, false, "triad.loaded-blocked");
  emit(`TRIAD full-path send=${triad.send} reason=${triad.reason}`);

  const partialPath = [
    { untrustedInput: true, externalEgress: false, consequentialAct: false },
    { untrustedInput: false, externalEgress: false, consequentialAct: true },
  ];
  const partial = lethalTriadPathCheck(partialPath);
  assertEqual(partial.send, true, "triad.partial-sent");
  emit(`TRIAD partial-path send=${partial.send} reason=${partial.reason}`);

  // 4. Escape from the confined (observer) tier: genuine write attempt.
  const escape = evaluatePermission({ level: "observer", action: "write", resource: "registry" });
  assertEqual(escape.effect, "deny", "escape.write-denied");
  emit(`ESCAPE observer-write effect=${escape.effect} reason=${escape.reason}`);

  // 5. Self-promotion from the confined tier without an owner act.
  const promote = requestLevelChange({ from: "observer", to: "operator", ownerAct: null });
  assertEqual(promote.effect, "deny", "promote.self-denied");
  emit(`PROMOTE self-promotion effect=${promote.effect} reason=${promote.reason}`);

  const forged = requestLevelChange({
    from: "observer",
    to: "operator",
    ownerAct: { by: "observer", outOfBand: true },
  });
  assertEqual(forged.effect, "deny", "promote.forged-denied");
  emit(`PROMOTE forged-owner-act effect=${forged.effect} reason=${forged.reason}`);

  const owned = requestLevelChange({
    from: "observer",
    to: "collaborator",
    ownerAct: { by: "owner", outOfBand: true },
  });
  assertEqual(owned.effect, "allow", "promote.owner-allowed");
  emit(`PROMOTE owner-act effect=${owned.effect} reason=${owned.reason}`);

  emit("SELFTEST PASS");
  const digest = createHash("sha256").update(lines.join("\n"), "utf8").digest("hex");
  emit(`DIGEST ${digest}`);
}

const invokedAsMain =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").endsWith("trust-probe.mjs");

if (invokedAsMain) {
  try {
    runSelfTest();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
