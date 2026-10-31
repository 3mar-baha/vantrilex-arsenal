#!/usr/bin/env node
/**
 * LD-29 self-test harness: mission compiler plus planning-quality loop (0.9.29).
 * Zero dependencies. Node 25, ESM. Deterministic: fixed fixtures only, no clock
 * reads, no network, no shell provisioning.
 * Usage: node .opencode/audit/BUILD-0929/verify-mission-compiler-0929.mjs
 * Exit 0 with VERDICT: PROCEED only when every check passes; exit 1 with
 * VERDICT: REJECT otherwise. Rerunnable by a non-author; two consecutive runs
 * print an identical LD29-DIGEST.
 * Doctrine: FULL under ponytail FLOOR + CEILING (see b0929-build.md ledger).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FBLD_29_VERBATIM =
  "FBLD-29 — Slot 0.9.29 — Conflict: any reading of 0.9.29 as the decided home versus the explicit no-decided-home rule — Fallback: planner proposes placement with reasoning; no slot is the decided home by this file — Matches LD-29 — Status FLAGGED, never resolved.";
const PLACEMENT_RULE = "planner proposes placement with reasoning; no slot is the decided home";
const DECIDED_HOME_ASSERTIONS = [
  /decided home is 0\.9\.29/,
  /0\.9\.29 is the decided home/,
  /decided home:\s*0\.9\.29/,
  /home for the output-spec requirement is 0\.9\.29/,
];
const INSTALLER_TOKENS = [
  "npm install",
  "npm i ",
  "pip install",
  "brew install",
  "apt install",
  "apt-get install",
  "choco install",
  "winget install",
];

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
const isFiniteNumber = (v) => typeof v === "number" && Number.isFinite(v);

const here = dirname(fileURLToPath(import.meta.url));
const spec = readFileSync(join(here, "mission-compiler-0929.md"), "utf8");

// ---- Mission-compiler model (mirrors spec sections 2-7) ----

function compilePlan(inputs) {
  if (!isRecord(inputs)) throw new Error("inputs-not-a-record");
  if (!isRecord(inputs.objective) || inputs.objective.approved !== true) {
    throw new Error("no-approved-objective-no-plan");
  }
  if (!Array.isArray(inputs.gaps)) throw new Error("gaps-not-a-list");
  if (!Array.isArray(inputs.updates)) throw new Error("updates-not-a-list");
  return {
    label: "draft",
    objective: inputs.objective,
    gaps: inputs.gaps,
    phases: [],
    updateEntries: [],
    recurringRuling: null,
    trace: [{ origin: "compiler", note: "emission" }],
  };
}

function addPhase(plan, phase) {
  if (!isRecord(plan) || !Array.isArray(plan.phases)) throw new Error("plan-not-a-record");
  if (!isRecord(phase) || !nonEmptyString(phase.name)) throw new Error("phase-without-name-refused");
  plan.phases.push(phase);
  return plan;
}

// Completeness checker (spec section 4): returns defect list; empty means pass.
// Refusal is reported, never silently repaired by this function.
function checkCompleteness(plan) {
  const defects = [];
  if (!isRecord(plan) || !Array.isArray(plan.phases) || plan.phases.length === 0) {
    return ["plan-without-phases"];
  }
  for (const phase of plan.phases) {
    if (!isRecord(phase) || !nonEmptyString(phase.name)) {
      defects.push("phase-without-name");
      continue;
    }
    if (!isRecord(phase.gate)) {
      defects.push(`phase-without-gate:${phase.name}`);
      continue;
    }
    if (!isRecord(phase.gate.check)) {
      defects.push(`gate-without-check:${phase.name}`);
      continue;
    }
    if (!nonEmptyString(phase.gate.check.act)) {
      defects.push(`check-without-verification-act:${phase.name}`);
    }
    if (!nonEmptyString(phase.gate.check.owner)) {
      defects.push(`check-without-owner:${phase.name}`);
    }
    if (!isFiniteNumber(phase.effort)) {
      defects.push(`node-without-effort:${phase.name}`);
    }
  }
  return defects;
}

// Historical calibration (spec section 5): deviation is a number; no matching
// past record marks calibration deferred, never calibrated by feel.
function calibrate(estimate, history) {
  if (!isFiniteNumber(estimate)) throw new Error("estimate-not-a-number");
  if (history === null || history === undefined) return { status: "DEFERRED" };
  if (!Array.isArray(history) || history.length === 0 || !history.every(isFiniteNumber)) {
    throw new Error("baseline-not-a-real-record");
  }
  const baseline = history.reduce((sum, effort) => sum + effort, 0) / history.length;
  return { status: "CALIBRATED", baseline, deviation: estimate - baseline };
}

function calibrationWarning(plan, calibration) {
  if (calibration.status !== "CALIBRATED") return null;
  if (Math.abs(calibration.deviation) > 5) return "large-deviation-warning";
  return null;
}

// Quality loop (spec section 6): grades recorded complete and fed to the
// calibration store by machine; systematic drift surfaces the planner.
function gradePlan(store, plannerId, estimated, actual) {
  if (!isRecord(store) || !Array.isArray(store.grades)) throw new Error("store-not-a-record");
  if (!nonEmptyString(plannerId)) throw new Error("planner-without-id-refused");
  for (const field of ["effort", "gateFailures", "rework"]) {
    if (!isRecord(actual) || !isFiniteNumber(actual[field])) {
      throw new Error(`grade-incomplete-missing:${field}`);
    }
  }
  if (!isFiniteNumber(estimated)) throw new Error("grade-without-estimate-refused");
  const grade = {
    planner: plannerId,
    effortDeviation: actual.effort - estimated,
    gateFailures: actual.gateFailures,
    rework: actual.rework,
  };
  store.grades.push(grade);
  return grade;
}

function driftingPlanners(store) {
  const byPlanner = new Map();
  for (const grade of store.grades) {
    if (!byPlanner.has(grade.planner)) byPlanner.set(grade.planner, []);
    byPlanner.get(grade.planner).push(grade.effortDeviation);
  }
  const drifters = [];
  for (const [planner, deviations] of byPlanner) {
    if (deviations.length < 3) continue;
    const recent = deviations.slice(-3);
    const sign = Math.sign(recent[0]);
    if (sign !== 0 && recent.every((d) => Math.sign(d) === sign)) drifters.push(planner);
  }
  return drifters;
}

// Update consumption (spec section 7): in-scope recorded updates enter with
// proof; a touching update missing from the plan is compiler failure.
function consumeUpdates(plan, updateLog, scope) {
  if (!isRecord(plan) || !Array.isArray(plan.updateEntries)) throw new Error("plan-not-a-record");
  if (!Array.isArray(updateLog)) throw new Error("update-log-not-a-list");
  if (!nonEmptyString(scope)) throw new Error("scope-not-named");
  const missing = [];
  for (const update of updateLog) {
    if (!isRecord(update) || !nonEmptyString(update.id)) throw new Error("update-without-id-refused");
    if (update.scope === scope) {
      plan.updateEntries.push({ id: update.id, proof: `entered-from-update-log:${update.id}` });
    }
  }
  for (const update of updateLog) {
    if (
      update.scope === scope &&
      !plan.updateEntries.some((entry) => entry.id === update.id)
    ) {
      missing.push(update.id);
    }
  }
  if (missing.length > 0) throw new Error(`in-scope-update-missing:${missing.join(",")}`);
  return plan.updateEntries;
}

function editDraft(plan, plannerNote) {
  if (!isRecord(plan) || plan.label !== "draft") throw new Error("edit-target-not-a-draft");
  if (!nonEmptyString(plannerNote)) throw new Error("planner-note-missing");
  plan.trace.push({ origin: "planner", note: plannerNote });
  return plan;
}

function requestNaming() {
  throw new Error("naming-and-redefinition-outside-compiler");
}

// ---- Checks ----

check("spec-readable", () => {
  assert(spec.length > 1000, "spec too short to carry the treatment");
  return `spec bytes: ${spec.length}`;
});

check("ld29-source-refs", () => {
  assert(spec.includes(":6057"), "missing V3 slot heading ref :6057");
  assert(spec.includes(":61") && spec.includes(":68"), "missing binding-note refs :61 through :68");
  return "refs :6057 + :61/:68 present";
});

check("fbld29-verbatim", () => {
  assert(spec.includes(FBLD_29_VERBATIM), "FBLD-29 not carried verbatim");
  return "FBLD-29 verbatim present";
});

check("no-decided-home", () => {
  assert(spec.includes(PLACEMENT_RULE), "placement rule missing");
  for (const assertion of DECIDED_HOME_ASSERTIONS) {
    assert(!assertion.test(spec), `decided-home assertion present: ${assertion.source}`);
  }
  return "placement rule present; zero decided-home assertions";
});

check("three-inputs", () => {
  let threw = "";
  try {
    compilePlan({ gaps: [], updates: [] });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "no-approved-objective-no-plan", `unapproved objective not refused: ${threw}`);
  const plan = compilePlan({ objective: { approved: true, text: "fix" }, gaps: ["g1"], updates: [] });
  assert(plan.label === "draft", "emission not labeled draft");
  return "unapproved refused; approved emits draft";
});

check("incomplete-refused", () => {
  const cases = [
    [{ name: "p1" }, "phase-without-gate:p1"],
    [{ name: "p1", gate: {} }, "gate-without-check:p1"],
    [{ name: "p1", gate: { check: {} }, effort: 3 }, "check-without-verification-act:p1"],
    [{ name: "p1", gate: { check: { act: "run probe" } }, effort: 3 }, "check-without-owner:p1"],
    [{ name: "p1", gate: { check: { act: "run probe", owner: "planner" } } }, "node-without-effort:p1"],
  ];
  for (const [phase, want] of cases) {
    const defects = checkCompleteness({ phases: [phase] });
    assert(defects.includes(want), `gap not refused, want ${want}, got ${defects.join(",")}`);
  }
  return "5 gap classes refused with named defects";
});

check("complete-passes", () => {
  const plan = { phases: [{ name: "p1", gate: { check: { act: "run probe", owner: "planner" } }, effort: 3 }] };
  assert(checkCompleteness(plan).length === 0, "complete plan refused: checker defective");
  return "complete plan passes";
});

check("deviation-surfaced", () => {
  const calibration = calibrate(13, [5, 7, 6]);
  assert(calibration.status === "CALIBRATED", "calibration status wrong");
  assert(calibration.deviation === 7, `deviation not numeric-exact: ${calibration.deviation}`);
  assert(calibrationWarning({}, calibration) === "large-deviation-warning", "large drift passes silently");
  return "deviation 7 shown with visible warning";
});

check("no-baseline-deferred", () => {
  const calibration = calibrate(13, null);
  assert(calibration.status === "DEFERRED", "missing baseline calibrated by feel");
  return "no record marks DEFERRED";
});

check("grades-complete", () => {
  const store = { grades: [] };
  let threw = "";
  try {
    gradePlan(store, "planner-a", 10, { effort: 12, gateFailures: 1 });
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "grade-incomplete-missing:rework", `partial grade accepted: ${threw}`);
  gradePlan(store, "planner-a", 10, { effort: 12, gateFailures: 1, rework: 0 });
  gradePlan(store, "planner-a", 10, { effort: 13, gateFailures: 0, rework: 1 });
  gradePlan(store, "planner-a", 10, { effort: 14, gateFailures: 2, rework: 0 });
  assert(driftingPlanners(store).includes("planner-a"), "systematic drift stays hidden");
  return "partial grade refused; drift planner-a surfaced";
});

check("update-consumed", () => {
  const plan = compilePlan({ objective: { approved: true, text: "fix" }, gaps: [], updates: [] });
  const entries = consumeUpdates(
    plan,
    [
      { id: "u1", scope: "mission" },
      { id: "u2", scope: "elsewhere" },
    ],
    "mission",
  );
  assert(entries.some((entry) => entry.id === "u1" && nonEmptyString(entry.proof)), "in-scope update entry unproved");
  assert(!entries.some((entry) => entry.id === "u2"), "out-of-scope update entered");
  return "u1 entered with proof; u2 stays out";
});

check("draft-labeled", () => {
  const plan = compilePlan({ objective: { approved: true, text: "fix" }, gaps: [], updates: [] });
  editDraft(plan, "planner ruling note");
  assert(plan.trace.length === 2, "planner edit trace lost");
  assert(plan.trace[0].origin === "compiler" && plan.trace[1].origin === "planner", "origins merged");
  return "draft trace keeps compiler/planner origins";
});

check("naming-outside", () => {
  let threw = "";
  try {
    requestNaming();
  } catch (error) {
    threw = error instanceof Error ? error.message : String(error);
  }
  assert(threw === "naming-and-redefinition-outside-compiler", `naming automated: ${threw}`);
  return "naming request refused";
});

check("install-honesty", () => {
  assert(spec.includes("install_cmd: null"), "install_cmd null admission missing");
  assert(spec.includes("unverified"), "unverified admission missing");
  for (const token of INSTALLER_TOKENS) {
    assert(!spec.includes(token), `invented provisioning line present: ${token}`);
  }
  return "null + unverified; zero provisioning lines";
});

// ---- Verdict (deterministic digest over check name/status pairs) ----

const digest = createHash("sha256")
  .update(JSON.stringify(checks.map((c) => [c.name, c.status])), "utf8")
  .digest("hex");
for (const c of checks) {
  console.log(`${c.status} ${c.name} — ${c.evidence}`);
}
const passed = checks.filter((c) => c.status === "PASS").length;
const failed = checks.length - passed;
console.log(`checks: ${passed} pass, ${failed} fail, ${checks.length} total`);
console.log(`LD29-DIGEST ${digest}`);
if (failed > 0) {
  console.log("VERDICT: REJECT");
  process.exit(1);
} else {
  console.log("VERDICT: PROCEED");
}
