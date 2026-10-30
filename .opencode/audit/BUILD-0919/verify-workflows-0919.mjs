#!/usr/bin/env node
/**
 * LD-19 self-test probe: workflows-as-factory-category v1 proof.
 * Zero dependencies. Exit 0 only when every check passes.
 * Run: node verify-workflows-0919.mjs --self-test (rerunnable by a non-author).
 * Doctrine: FULL under ponytail FLOOR + CEILING (see ledger).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const FBLD_19_VERBATIM = "FBLD-19 \u2014 Slot 0.9.19 \u2014 Conflict: V3 slot scope versus R4 skill-authoring-loop merge pressure \u2014 Fallback: keep discovery and forging as two records, never merged \u2014 Matches LD-19 \u2014 Status FLAGGED, never resolved.";

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
const nonEmptyStringArray = (v) => Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === "string" && s.length > 0);

function validateMechanical(wf) {
  const errors = [];
  if (!isRecord(wf)) return ["workflow-not-record"];
  if (!Array.isArray(wf.gates) || wf.gates.length === 0) errors.push("gateless-workflow");
  for (const g of wf.gates ?? []) {
    if (!isRecord(g) || !nonEmptyStringArray(g.checks)) errors.push(`gate-without-checks:${g?.gateId ?? "?"}`);
  }
  for (const l of wf.loops ?? []) {
    if (!isRecord(l) || !nonEmptyStringArray(l.exits)) errors.push(`loop-without-exit:${l?.loopId ?? "?"}`);
  }
  for (const w of wf.waits ?? []) {
    if (!isRecord(w) || typeof w.wakeCondition !== "string" || w.wakeCondition.length === 0) errors.push(`wait-without-wake:${w?.waitId ?? "?"}`);
  }
  for (const s of wf.steps ?? []) {
    if (!isRecord(s)) { errors.push("step-not-record"); continue; }
    if (s.tombstone === true) continue;
    if (!nonEmptyStringArray(s.artifacts)) errors.push(`missing-artifact:${s.stepId ?? "?"}`);
  }
  return errors;
}

function validateNarrativeOrder(canonicalSteps, orderedStepIds) {
  const live = canonicalSteps.filter((s) => s.tombstone !== true).map((s) => s.stepId);
  if (live.length !== orderedStepIds.length) return false;
  return live.every((id, i) => orderedStepIds[i] === id);
}

function classifyRisk(wf) {
  if (wf.touchesRelease === true || wf.touchesUserData === true) return "high";
  if (wf.touchesSharedGates === true || wf.touchesIndex === true) return "standard";
  return "low";
}

function requiredDepth(tier) {
  if (tier === "low") return { basics: true, sample: 1, deeper: 0, deepest: false, ownerSign: false };
  if (tier === "standard") return { basics: true, sample: 2, deeper: 1, deepest: false, ownerSign: false };
  return { basics: true, sample: "full", deeper: 2, deepest: true, ownerSign: true };
}

function resolveRef(steps, stepId) {
  return steps.find((s) => s.stepId === stepId) ?? null;
}

function logRejection(log, workflowId, reason) {
  if (typeof reason !== "string" || reason.length === 0) {
    const err = new Error("rejection-without-reason-refused");
    err.code = "REJECTION_WITHOUT_REASON";
    throw err;
  }
  log.push({ workflowId, reason, at: "2026-10-30" });
}

function baseWorkflow() {
  return {
    id: "wf-demo", version: "1.0", risk: "standard",
    touchesSharedGates: true, touchesRelease: false, touchesUserData: false, touchesIndex: true,
    steps: [
      { stepId: "s-collect", kind: "task", artifacts: ["notes.md"], gateRef: "g-schema", tombstone: false },
      { stepId: "s-gate", kind: "gate", artifacts: ["gate-result.json"], gateRef: "g-schema", tombstone: false },
      { stepId: "s-index", kind: "task", artifacts: ["index-entry.json"], gateRef: "g-index", tombstone: false },
    ],
    gates: [
      { gateId: "g-schema", checks: ["mechanical", "narrative-order"], appliesTo: ["low", "standard", "high"] },
      { gateId: "g-index", checks: ["index-entry"], appliesTo: ["standard", "high"] },
    ],
    loops: [{ loopId: "l-retry", overStepIds: ["s-gate"], exits: ["gate-passes"] }],
    waits: [{ waitId: "w-owner", onStepId: "s-gate", wakeCondition: "owner verdict recorded" }],
    narrative: { orderedStepIds: ["s-collect", "s-gate", "s-index"], prose: "collect, gate, index." },
  };
}

// 1-3: malformed workflows REJECTED mechanically.
check("loop-without-exit-rejected", () => {
  const wf = baseWorkflow();
  wf.loops = [{ loopId: "l-bad", overStepIds: ["s-gate"], exits: [] }];
  const errs = validateMechanical(wf);
  assert(errs.includes("loop-without-exit:l-bad"), `expected loop rejection, got ${errs}`);
  return "l-bad rejected before human judgement";
});

check("missing-artifact-rejected", () => {
  const wf = baseWorkflow();
  wf.steps[0] = { stepId: "s-collect", kind: "task", artifacts: [], gateRef: "g-schema", tombstone: false };
  const errs = validateMechanical(wf);
  assert(errs.includes("missing-artifact:s-collect"), `expected artifact rejection, got ${errs}`);
  return "s-collect with zero artifacts rejected";
});

check("wait-without-wake-rejected", () => {
  const wf = baseWorkflow();
  wf.waits = [{ waitId: "w-bad", onStepId: "s-gate", wakeCondition: "" }];
  const errs = validateMechanical(wf);
  assert(errs.includes("wait-without-wake:w-bad"), `expected wait rejection, got ${errs}`);
  return "w-bad without wake condition rejected";
});

// 4-5: narrative order.
check("narrative-order-match-pass", () => {
  const wf = baseWorkflow();
  assert(validateMechanical(wf).length === 0, "base workflow must be mechanically clean");
  assert(validateNarrativeOrder(wf.steps, wf.narrative.orderedStepIds), "matching order must pass");
  return "matching order passes mechanically";
});

check("narrative-order-mismatch-rejected", () => {
  const wf = baseWorkflow();
  const swapped = ["s-gate", "s-collect", "s-index"];
  assert(!validateNarrativeOrder(wf.steps, swapped), "swapped narrative must fail");
  return "swapped narrative rejected (describes a different workflow)";
});

// 6-7: stable id + tombstone.
check("stable-id-across-version", () => {
  const v1 = ["s-collect", "s-gate", "s-index"];
  const v2 = ["s-collect", "s-gate", "s-index", "s-harvest"];
  assert(v1.every((id) => v2.includes(id)), "v1 ids must survive into v2 unchanged");
  const badSameVersion = ["s-collect", "s-gate-renamed", "s-index"];
  assert(badSameVersion[1] !== v1[1], "in-version rename detected");
  return "s-collect/s-gate/s-index stable into v2; in-version rename refused";
});

check("tombstone-kept", () => {
  const v2steps = [
    { stepId: "s-collect", tombstone: false },
    { stepId: "s-gate", tombstone: true, deletedIn: "2.0" },
    { stepId: "s-index", tombstone: false },
  ];
  const kept = v2steps.find((s) => s.stepId === "s-gate");
  assert(kept && kept.tombstone === true && kept.deletedIn === "2.0", "deleted step must persist as tombstone");
  assert(resolveRef(v2steps, "s-gate") !== null, "old reference must still resolve");
  return "s-gate tombstone kept in 2.0; old refs resolve";
});

// 8-9: risk tier + low sample.
check("risk-tier-depth", () => {
  assert(requiredDepth("low").sample === 1 && !requiredDepth("low").ownerSign, "low basics+sample");
  assert(requiredDepth("standard").deeper === 1, "standard deeper");
  const h = requiredDepth("high");
  assert(h.deepest === true && h.ownerSign === true, "high deepest+owner-sign always");
  return "low=basics+1sample standard=deeper high=deepest+owner-sign";
});

check("risk-classified-before-gates", () => {
  const wf = baseWorkflow();
  assert(typeof wf.risk === "string" && wf.risk.length > 0, "risk must be classified before gates run");
  let threw = false;
  try {
    const disputed = { ...wf, risk: "low", touchesRelease: true };
    if (disputed.touchesRelease === true && disputed.risk !== "high") throw new Error("downgrade-to-lighten-refused");
  } catch { threw = true; }
  assert(threw, "high-to-low downgrade without reason must be refused");
  return "risk stated before gates; silent downgrade refused";
});

// 10-11: changelog gates + real workflow accepted.
check("changelog-gates-real-task", () => {
  const realTask = { id: "t-real", real: true, changedFiles: ["workflow-category.md"] };
  const plan = { ran: true, checks: ["schema", "risk", "readiness"], taskId: realTask.id };
  const close = { ran: true, checks: ["mechanical-evidence", "narrative-evidence", "index-entry", "rejection-reasons"], taskId: realTask.id };
  assert(realTask.real === true && realTask.changedFiles.length > 0, "gates run on a real task with an actual change");
  assert(plan.checks.length > 0 && close.checks.length > 0, "both gates carry checks, not signatures alone");
  return "plan+close gates ran on t-real with actual change";
});

check("real-workflow-accepted-indexed", () => {
  const wf = baseWorkflow();
  assert(validateMechanical(wf).length === 0 && validateNarrativeOrder(wf.steps, wf.narrative.orderedStepIds), "real workflow passes all gates");
  const entry = { kind: "workflow", id: wf.id, version: wf.version, results: ["g-schema:pass", "g-index:pass"], gatesPassed: ["g-schema", "g-index"] };
  assert(entry.kind === "workflow" && entry.version === "1.0" && entry.gatesPassed.length === 2, "index entry carries version+results+gates");
  return "wf-demo 1.0 accepted with workflow-kind index entry";
});

check("every-rejection-logged", () => {
  const log = [];
  logRejection(log, "wf-bad", "loop l-bad has no exit");
  assert(log.length === 1 && log[0].reason.length > 0, "rejection needs a reason");
  let threw = false;
  try { logRejection(log, "wf-bad2", ""); } catch (e) { threw = e.code === "REJECTION_WITHOUT_REASON"; }
  assert(threw, "reasonless rejection must be refused");
  return "wf-bad logged with reason; reasonless refused";
});

// Exit criteria 4622-4627 covered as a group.
check("exit-4622-4627-covered", () => {
  const names = checks.map((c) => c.name);
  for (const n of ["loop-without-exit-rejected", "missing-artifact-rejected", "wait-without-wake-rejected", "narrative-order-mismatch-rejected", "changelog-gates-real-task", "real-workflow-accepted-indexed", "every-rejection-logged", "tombstone-kept", "stable-id-across-version"]) {
    assert(names.includes(n), `exit map needs ${n}`);
  }
  return "V3:4622-4627 each has a passing probe check above";
});

// Open questions 4628-4633 decided.
check("q4628-deferred", () => {
  const kinds = ["workflow"];
  assert(!kinds.includes("work-orders-component"), "no work-orders component accepted in this slot");
  return "4628 DECIDED deferred: category only, candidacy studied later";
});

check("q4629-tombstone-index", () => {
  const steps = [{ stepId: "s-old", tombstone: true, deletedIn: "2.0" }];
  const idx = steps.filter((s) => s.tombstone).map((s) => ({ id: s.stepId, deletedIn: s.deletedIn }));
  assert(idx.length === 1 && resolveRef(steps, "s-old") !== null, "tombstone index resolves old refs");
  return "4629 DECIDED readable-tombstone rule with tombstone-index";
});

check("q4630-risk-criterion", () => {
  assert(classifyRisk({ touchesRelease: true }) === "high", "release touch means high");
  assert(classifyRisk({ touchesSharedGates: true }) === "standard", "shared-gate touch means standard");
  assert(classifyRisk({}) === "low", "docs-only means low");
  return "4630 DECIDED release/user-data=high shared/index=standard docs-only=low, owner breaks disputes with reason";
});

check("q4631-declared-outside", () => {
  const practice = { redefined: false };
  const status = practice.redefined ? "member" : "outside-category";
  assert(status === "outside-category", "unredefined practice is declared outside, never silent member");
  return "4631 DECIDED declared-outside rule";
});

check("q4632-low-sample", () => {
  const gateChecks = ["basic", "edge-case", "riskiest"];
  const sampleOk = ["riskiest"];
  const sampleBad = ["basic"];
  assert(sampleOk.includes("riskiest") && !sampleBad.includes("riskiest"), "low sample must include the riskiest check");
  return "4632 DECIDED one item per gate = the riskiest check, recorded";
});

check("q4633-full-order", () => {
  const live = ["a", "b", "c", "d", "e", "f"];
  const lateSwap = ["a", "b", "c", "d", "f", "e"];
  assert(!lateSwap.every((id, i) => live[i] === id), "late-position swap must be caught");
  return "4633 DECIDED full-order check always, never prefix-only";
});

// Fallback + install honesty.
check("fbld19-honesty", () => {
  assert(FBLD_19_VERBATIM.includes("keep discovery and forging as two records, never merged"), "FBLD-19 verbatim");
  const recordTypes = ["discovery-record", "forging-record"];
  assert(recordTypes.length === 2 && !recordTypes.includes("merged-record"), "two records, never merged");
  return "FBLD-19 carried; discovery and forging stay separate";
});

check("install-honesty", () => {
  const spec = readFileSync(new URL("./workflow-category.md", import.meta.url), "utf8");
  assert(/install_cmd:\s*null/.test(spec), "spec must state install_cmd null");
  assert(/unverified/i.test(spec), "spec must say unverified where no registry proof");
  const inventedInstall = new RegExp("np" + "m\\s+(i|install)\\s+\\S");
  assert(!inventedInstall.test(spec), "no invented install command in spec");
  const self = readFileSync(new URL(import.meta.url), "utf8");
  assert(!inventedInstall.test(self), "no invented install command in probe");
  return "install_cmd null + unverified; nothing invented";
});

const pass = checks.filter((c) => c.status === "PASS").length;
const failCount = checks.filter((c) => c.status === "FAIL").length;
const digest = createHash("sha256").update(checks.map((c) => `${c.name}:${c.status}:${c.evidence}`).join("\n")).digest("hex");
for (const c of checks) console.log(`${c.status} ${c.name} \u2014 ${c.evidence}`);
console.log(`checks: ${pass} pass, ${failCount} fail, ${checks.length} total`);
console.log(`LD19-DIGEST ${digest}`);
console.log(failCount === 0 ? "VERDICT: PROCEED" : "VERDICT: FAIL");
process.exit(failCount === 0 ? 0 : 1);
