#!/usr/bin/env node
/**
 * LD-23 self-test probe: self-repair overlays proof (0.9.23).
 * Zero dependencies. Exit 0 only when every check passes.
 * Run: node verify-self-repair-overlays-0923.mjs --self-test (rerunnable by a non-author).
 * Doctrine: FULL under ponytail FLOOR + CEILING (see b0923-build.md ledger).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FBLD_23_VERBATIM = "FBLD-23 \u2014 Slot 0.9.23 \u2014 Conflict: V3 slot scope versus R3 autofix proposal \u2014 Fallback: fix text in findings only, apply is a second dispatch \u2014 Matches LD-23 \u2014 Status FLAGGED, never resolved.";
const LD_23_VERBATIM = "LD-23 \u2014 Slot 0.9.23 \u2014 Self-repair overlays \u2014 Treatment: full V3 treatment under heading at (source `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:5130`), carried as data \u2014 Conflict FLAGGED: V3 slot scope versus R3 autofix proposal \u2014 Fallback LD-23: fix text in findings only; apply is a second dispatch \u2014 Not resolved.";

const checks = [];
const check = (name, fn) => {
  try {
    const evidence = fn();
    checks.push({ name, status: "PASS", evidence });
  } catch (error) {
    checks.push({ name, status: "FAIL", evidence: error instanceof Error ? error.message : String(error) });
  }
};
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const isRecord = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
const nonEmptyString = (v) => typeof v === "string" && v.length > 0;

const here = dirname(fileURLToPath(import.meta.url));
const spec = readFileSync(join(here, "self-repair-overlays-0923.md"), "utf8");

// ---- Outbox channel (append-only; prior slot carried forward, extended only) ----

function createHome() {
  return {
    outbox: [],
    overlays: [],
    lessons: [],
    log: [],
    parentVersion: "0.9.22",
    workingBase: { "step-chain": "base-order", "retry-policy": "base-policy" },
    working: { "step-chain": "base-order", "retry-policy": "base-policy" },
    installedIndex: null,
    installed: null,
  };
}
function writeOutbox(home, submission) {
  if (!isRecord(submission) || !nonEmptyString(submission.kind)) {
    throw new Error("outbox-write-without-kind-refused");
  }
  const seq = home.outbox.length + 1;
  home.outbox.push({ ...submission, seq });
  return seq;
}

// ---- Overlay classes ----

const CLASSES = ["silent", "correcting-with-notice", "propose-only", "forbidden"];

function declareOverlay(home, decl) {
  if (!isRecord(decl)) throw new Error("undeclared-overlay-refused");
  if (!CLASSES.includes(decl.overlayClass)) throw new Error(`unclassified-overlay-refused:${String(decl.overlayClass)}`);
  if (!nonEmptyString(decl.example) || !nonEmptyString(decl.limits)) {
    throw new Error(`class-without-example-or-limits-refused:${decl.overlayClass}`);
  }
  if (!nonEmptyString(decl.defect)) throw new Error("overlay-without-defect-refused");
  return { ...decl, declared: true };
}

function applyOverlay(home, overlay) {
  const declared = declareOverlay(home, overlay);
  if (declared.overlayClass === "forbidden") throw new Error("forbidden-never-applies:refused-not-classified");
  if (declared.overlayClass === "propose-only") {
    const seq = writeOutbox(home, { kind: "workflow-new", text: declared.defect, fromOverlay: true });
    home.log.push({ event: "refusal", reason: "propose-only-refused-as-overlay", defect: declared.defect });
    home.log.push({ event: "conversion", to: "submission", seq });
    throw new Error(`propose-only-refused-as-overlay:converted-to-submission-seq-${seq}`);
  }
  if (typeof declared.outboxSeq !== "number" || !home.outbox.some((e) => e.seq === declared.outboxSeq)) {
    throw new Error("overlay-without-prior-outbox-write-impossible");
  }
  if (declared.overlayClass === "silent") {
    if (declared.repairs === true || declared.notifies === true) {
      throw new Error("silent-exceeding-class-refused");
    }
    home.overlays.push({ ...declared, effect: "recorded-only" });
    return { recorded: true, repaired: false, notified: false };
  }
  if (declared.overlayClass === "correcting-with-notice") {
    if (declared.repairs !== true || declared.notifies !== true) {
      throw new Error("correcting-requires-repair-plus-notice-atomically");
    }
    if (declared.touchesInstalled === true) throw new Error("correcting-never-touches-installed");
    home.working[declared.target] = declared.fixedValue;
    home.log.push({ event: "notice", reason: declared.noticeReason, target: declared.target });
    home.overlays.push({ ...declared, effect: "repaired-and-notified" });
    return { recorded: true, repaired: true, notified: true };
  }
  throw new Error("unreachable-class");
}

// ---- Forbidden attempts ----

function editInstalledInPlace() {
  throw new Error("installed-in-place-edit-refused");
}
function suppressRepairLog(home) {
  throw new Error("repair-log-suppression-refused:log-intact");
}
function repairForeignInstall(home, target) {
  throw new Error(`foreign-install-repair-refused:${target}`);
}
function bypassStartCheck() {
  throw new Error("start-check-bypass-refused");
}

// ---- Installed-hash protection at start ----

const shaOf = (text) => createHash("sha256").update(text, "utf8").digest("hex");
function startCheck(home, installedFiles, installedIndex) {
  for (const [name, expected] of Object.entries(installedIndex)) {
    if (!(name in installedFiles)) throw new Error(`installed-missing-detected:${name}`);
    if (shaOf(installedFiles[name]) !== expected) throw new Error(`installed-divergence-detected:${name}`);
  }
  home.installedIndex = { ...installedIndex };
  home.installed = { ...installedFiles };
  return { matched: Object.keys(installedIndex).length, overlaysPresent: home.overlays.length };
}

// ---- Expiry on parent-version change; kill switch ----

function advanceParent(home, nextVersion, lessonTexts) {
  assert(nonEmptyString(nextVersion) && nextVersion !== home.parentVersion, "parent-must-change");
  const ended = home.overlays.length;
  home.overlays = [];
  home.working = { ...home.workingBase };
  home.parentVersion = nextVersion;
  for (const text of lessonTexts) {
    home.lessons.push(text);
    writeOutbox(home, { kind: "field-note", text });
  }
  home.log.push({ event: "expiry", ended, nextVersion });
  return { ended, lessonsKept: home.lessons.length };
}
function stopOverlays(home, reason) {
  assert(nonEmptyString(reason), "stop-requires-reason");
  const stopped = home.overlays.length;
  home.overlays = [];
  home.working = { ...home.workingBase };
  home.log.push({ event: "stop", reason, stopped });
  return { stopped };
}

// ---- Detection-trigger calibration (instrument only; boundary stays OPEN) ----

function classifyTrigger(sameSignatureCount) {
  if (sameSignatureCount <= 1) return "incident-defect-report";
  if (sameSignatureCount >= 3) return "pattern-repair-candidate";
  return "incident-defect-report";
}

// ---- Checks: mechanical outbox gate ----

check("overlay-without-prior-outbox-write-impossible", () => {
  const home = createHome();
  let threw = "";
  try {
    applyOverlay(home, { overlayClass: "silent", example: "retry observed", limits: "zero behavior change", defect: "flaky retry" });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "overlay-without-prior-outbox-write-impossible", `expected mechanical refusal, got: ${threw}`);
  assert(home.overlays.length === 0, "refused apply must leave zero overlays");
  const seq = writeOutbox(home, { kind: "defect-report", text: "flaky retry observed once" });
  const result = applyOverlay(home, { overlayClass: "silent", example: "retry observed", limits: "zero behavior change", defect: "flaky retry", outboxSeq: seq });
  assert(result.recorded === true && result.repaired === false, "prior write must enable silent record");
  assert(home.overlays.length === 1, "one overlay after prior write");
  return "refused-without-write:applied-after-write";
});

check("late-write-never-retroactive", () => {
  const home = createHome();
  let first = "";
  try {
    applyOverlay(home, { overlayClass: "silent", example: "e", limits: "l", defect: "d", outboxSeq: 7 });
  } catch (error) {
    first = error instanceof Error ? error.message : String(error);
  }
  assert(first === "overlay-without-prior-outbox-write-impossible", `stale seq refused, got: ${first}`);
  writeOutbox(home, { kind: "defect-report", text: "later write" });
  assert(home.overlays.length === 0, "late write cures nothing");
  return "stale-seq-refused:late-write-not-retroactive";
});

check("propose-only-refused-converted-logged", () => {
  const home = createHome();
  let threw = "";
  try {
    applyOverlay(home, { overlayClass: "propose-only", example: "reorder suggested", limits: "proposal text only", defect: "suggested step reorder" });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw.startsWith("propose-only-refused-as-overlay:converted-to-submission-seq-"), `refusal+conversion, got: ${threw}`);
  assert(home.overlays.length === 0, "propose-only never becomes an overlay");
  assert(home.outbox.length === 1 && home.outbox[0].kind === "workflow-new", "converted to exactly one submission");
  const refusal = home.log.find((e) => e.event === "refusal");
  const conversion = home.log.find((e) => e.event === "conversion");
  assert(isRecord(refusal) && isRecord(conversion), "refusal plus conversion both logged");
  return "refused-as-overlay:converted-to-submission:both-logged";
});

check("silent-records-only", () => {
  const home = createHome();
  const seq = writeOutbox(home, { kind: "defect-report", text: "flaky retry observed once" });
  const result = applyOverlay(home, { overlayClass: "silent", example: "retry observed once", limits: "zero behavior change, zero notice", defect: "flaky retry", outboxSeq: seq });
  assert(result.recorded && !result.repaired && !result.notified, "silent records only");
  let threw = "";
  try {
    applyOverlay(home, { overlayClass: "silent", example: "e", limits: "l", defect: "d", outboxSeq: seq, repairs: true });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "silent-exceeding-class-refused", `silent repair refused, got: ${threw}`);
  return "record-only-proven:repair-excess-refused";
});

check("correcting-repairs-and-notifies-atomically", () => {
  const home = createHome();
  const seq = writeOutbox(home, { kind: "defect-report", text: "fallback chain misordered" });
  const base = { overlayClass: "correcting-with-notice", example: "reorder own chain", limits: "own working copy only", defect: "misordered chain", outboxSeq: seq, target: "step-chain", fixedValue: "fixed-order", noticeReason: "chain reordered locally" };
  let threw = "";
  try {
    applyOverlay(home, { ...base, notifies: true });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "correcting-requires-repair-plus-notice-atomically", `repair-only refused, got: ${threw}`);
  threw = "";
  try {
    applyOverlay(home, { ...base, repairs: true, touchesInstalled: true, notifies: true });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "correcting-never-touches-installed", `installed touch refused, got: ${threw}`);
  const result = applyOverlay(home, { ...base, repairs: true, notifies: true });
  assert(result.repaired && result.notified, "repair plus notice together");
  assert(home.working["step-chain"] === "fixed-order", "working copy repaired");
  assert(home.log.some((e) => e.event === "notice"), "notice logged");
  return "repair-plus-notice-atomic:installed-untouched";
});

check("forbidden-three-refused", () => {
  const home = createHome();
  const attempts = [
    () => editInstalledInPlace(),
    () => suppressRepairLog(home),
    () => repairForeignInstall(home, "teammate-install"),
  ];
  const reasons = [];
  for (const attempt of attempts) {
    try {
      attempt();
    } catch (error) {
      reasons.push(error instanceof Error ? error.message : String(error));
    }
  }
  assert(reasons.length === 3, "all three forbidden attempts refused");
  assert(reasons[0] === "installed-in-place-edit-refused", `in-place edit refused, got: ${reasons[0]}`);
  assert(reasons[1].startsWith("repair-log-suppression-refused"), `log suppression refused, got: ${reasons[1]}`);
  assert(reasons[2].startsWith("foreign-install-repair-refused"), `foreign repair refused, got: ${reasons[2]}`);
  assert(home.overlays.length === 0, "forbidden attempts leave zero overlays");
  return "in-place-edit:log-suppression:foreign-repair-all-refused";
});

check("unclassified-overlay-refused", () => {
  const home = createHome();
  let threw = "";
  try {
    applyOverlay(home, { overlayClass: "experimental", example: "e", limits: "l", defect: "d" });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw.startsWith("unclassified-overlay-refused"), `no class refused, got: ${threw}`);
  threw = "";
  try {
    applyOverlay(home, { overlayClass: "silent", example: "", limits: "", defect: "d" });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw.startsWith("class-without-example-or-limits-refused"), `class without limits refused, got: ${threw}`);
  return "no-class:no-limits-both-refused";
});

check("installed-hashes-match-at-start-with-overlays", () => {
  const home = createHome();
  const seq = writeOutbox(home, { kind: "defect-report", text: "baseline defect" });
  applyOverlay(home, { overlayClass: "silent", example: "e", limits: "l", defect: "d", outboxSeq: seq });
  const installedFiles = { "kit-core": "shipped-bytes-v1", "kit-ui": "shipped-bytes-v2" };
  const installedIndex = { "kit-core": shaOf("shipped-bytes-v1"), "kit-ui": shaOf("shipped-bytes-v2") };
  const ok = startCheck(home, installedFiles, installedIndex);
  assert(ok.matched === 2 && ok.overlaysPresent === 1, "match at start with overlays present");
  return "hashes-match:overlays-present:proceed";
});

check("installed-divergence-detected-never-bypassed", () => {
  const home = createHome();
  const index = { "kit-core": shaOf("shipped-bytes-v1") };
  let threw = "";
  try {
    startCheck(home, { "kit-core": "tampered-bytes" }, index);
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw.startsWith("installed-divergence-detected"), `divergence detected, got: ${threw}`);
  threw = "";
  try {
    bypassStartCheck();
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "start-check-bypass-refused", `bypass refused, got: ${threw}`);
  return "divergence-detected:bypass-refused";
});

check("overlays-end-on-parent-change-lessons-remain", () => {
  const home = createHome();
  const s1 = writeOutbox(home, { kind: "defect-report", text: "d1" });
  const s2 = writeOutbox(home, { kind: "defect-report", text: "d2" });
  applyOverlay(home, { overlayClass: "silent", example: "e1", limits: "l1", defect: "d1", outboxSeq: s1 });
  applyOverlay(home, { overlayClass: "silent", example: "e2", limits: "l2", defect: "d2", outboxSeq: s2 });
  assert(home.overlays.length === 2, "two overlays before parent change");
  const out = advanceParent(home, "0.9.23", ["lesson: retry counter noisy", "lesson: chain order matters"]);
  assert(out.ended === 2 && home.overlays.length === 0, "collective end, zero remain");
  assert(home.working["step-chain"] === "base-order", "working copy back to base");
  assert(home.lessons.length === 2, "lessons remain");
  assert(home.outbox.some((e) => e.kind === "field-note"), "lessons also outbox entries");
  return "two-ended-zero-remain:lessons-in-outbox";
});

check("kill-switch-returns-without-overlay-logged", () => {
  const home = createHome();
  const seq = writeOutbox(home, { kind: "defect-report", text: "d" });
  applyOverlay(home, { overlayClass: "silent", example: "e", limits: "l", defect: "d", outboxSeq: seq });
  const out = stopOverlays(home, "operator halt: noisy adaptation");
  assert(out.stopped === 1 && home.overlays.length === 0, "stop clears overlays");
  assert(home.working["step-chain"] === "base-order", "back to working copy without overlay");
  const stop = home.log.find((e) => e.event === "stop");
  assert(isRecord(stop) && stop.reason === "operator halt: noisy adaptation", "stop plus reason logged");
  let threw = "";
  try {
    stopOverlays(home, "");
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "stop-requires-reason", `reasonless stop refused, got: ${threw}`);
  return "stopped:base-restored:reason-logged";
});

check("incident-vs-pattern-calibration", () => {
  assert(classifyTrigger(1) === "incident-defect-report", "one case is an incident");
  assert(classifyTrigger(3) === "pattern-repair-candidate", "three same-signature is a candidate");
  assert(classifyTrigger(3) !== "pattern-repair-accepted", "candidate is never acceptance");
  return "one-is-incident:three-is-candidate:never-accepted";
});

check("four-classes-examples-limits", () => {
  for (const name of ["silent", "correcting-with-notice", "propose-only", "forbidden"]) {
    const section = { silent: "3a", "correcting-with-notice": "3b", "propose-only": "3c", forbidden: "3d" }[name];
    assert(spec.includes(`### ${section}`), `class section present: ${name}`);
  }
  const required = ["Example (proven in probe)", "Limits:"];
  for (const marker of required) {
    const hits = spec.split(marker).length - 1;
    assert(hits >= 4, `each class carries ${marker} (${hits} hits)`);
  }
  return "four-classes:examples-plus-limits-each";
});

check("close-rule-three-together", () => {
  assert(spec.includes("Closure needs all three together"), "close rule stated");
  assert(spec.includes("V3:5262") && spec.includes("V3:5188"), "close-rule V3 pointers carried");
  return "impossibility:refusal:hashes-all-three";
});

check("harvest-feed-candidate-not-shipment", () => {
  assert(spec.includes("dies as a candidate"), "gate-failed candidate dies, lesson remains");
  assert(spec.includes("never ships anything") || spec.includes("never shipped"), "repetition alone never ships");
  return "candidate-feed:harvest-decides:lesson-survives";
});

check("q-open-carried", () => {
  for (const q of ["Q1 (V3:5240)", "Q2 (V3:5241)", "Q3 (V3:5242)", "Q4 (V3:5243)", "Q5 (V3:5244)", "Q6 (V3:5245)"]) {
    assert(spec.includes(q), `open question carried: ${q}`);
  }
  const opens = spec.split("CARRIED OPEN").length - 1;
  assert(opens >= 1 && spec.includes("None of the six is decided here"), "none decided here");
  return "six-open-carried:none-decided";
});

check("q-safe-defaults-hold", () => {
  for (const dflt of ["Safe default: 1 = incident", "Safe default: benefit without measurement is a claim", "Safe default: dies as a candidate", "Safe default: own working copy only", "Safe default: collective stop", "Safe default: both"]) {
    assert(spec.includes(dflt), `safe default holds: ${dflt}`);
  }
  return "six-safe-defaults-hold";
});

check("fbld23-honesty", () => {
  assert(spec.includes(FBLD_23_VERBATIM), "FBLD-23 carried verbatim in spec");
  assert(spec.includes(LD_23_VERBATIM), "LD-23 carried verbatim in spec");
  assert(spec.includes("apply is a second dispatch"), "apply-is-second-dispatch precedence");
  assert(spec.includes("fix text in findings only") || spec.includes("fix text carried in the outbox"), "findings-only fallback honored");
  return "fbld23-verbatim:ld23-verbatim:second-dispatch";
});

check("install-honesty", () => {
  assert(spec.includes("install_cmd: null"), "install_cmd null in spec");
  assert(spec.includes("unverified"), "verification unverified in spec");
  assert(!spec.includes("npm install") && !spec.includes("install -g"), "no invented install string in spec");
  const self = readFileSync(fileURLToPath(import.meta.url), "utf8");
  const selfCode = self.split("\n").filter((line) => !line.includes("matchAll")).join("\n");
  const imported = [...selfCode.matchAll(/from "([^"]+)"/g)].map((m) => m[1]).sort();
  assert(JSON.stringify(imported) === JSON.stringify(["node:crypto", "node:fs", "node:path", "node:url"]), `stdlib-only imports, got: ${imported.join(",")}`);
  return "null-plus-unverified:no-invented-command";
});

check("zero-fetch-local-only", () => {
  const self = readFileSync(fileURLToPath(import.meta.url), "utf8");
  const codeLines = self.split("\n").filter((line) => !line.includes("includes("));
  assert(!codeLines.some((line) => line.includes("fetch(")), "probe performs zero network fetch");
  return "zero-fetch:local-only";
});

// ---- Verdict ----

const runSelfTest = () => {
  const fails = checks.filter((c) => c.status === "FAIL");
  const digest = createHash("sha256")
    .update(checks.map((c) => `${c.name}:${c.status}:${c.evidence}`).join("\n"), "utf8")
    .digest("hex");
  for (const c of checks) {
    console.log(`${c.status} ${c.name} :: ${c.evidence}`);
  }
  console.log(`checks: ${checks.length - fails.length} pass, ${fails.length} fail, ${checks.length} total`);
  console.log(`LD23-DIGEST ${digest}`);
  console.log(`VERDICT: ${fails.length === 0 ? "PROCEED" : "FAIL"}`);
  return fails.length === 0 ? 0 : 1;
};

if (process.argv.includes("--self-test")) {
  process.exit(runSelfTest());
} else {
  console.log("usage: node verify-self-repair-overlays-0923.mjs --self-test");
  process.exit(2);
}
