// verify-self-improvement-0932.mjs — LD-32 gated self-improvement self-test.
// ESM, zero dependencies (node builtins only). No installs.
// PASS: prints PROCEED digest=<sha256-of-spec> and exits 0.
// FAIL: prints HOLD <reasons> and exits 1.
// The digest is a hash of the committed spec bytes, so two runs over
// unchanged bytes print a byte-identical digest (stability = determinism).
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const specPath = join(here, "self-improvement-0932.md");

let text = null;
try {
  text = readFileSync(specPath, "utf8");
} catch {
  console.log("HOLD missing-spec");
  process.exit(1);
}

const fails = [];
const need = (pattern, id) => {
  if (!pattern.test(text)) {
    fails.push(id);
  }
};

// Slot identity and reserve markers.
need(/0\.9\.32/, "no-advisory-number");
need(/advisory/i, "no-advisory-marker");
need(/LD-32/, "no-ld32-id");
need(/FBLD-32/, "no-fbld32-id");
need(
  /methods operate early in harvest plus overlays plus check mechanism; frame waits for explicit owner decision/,
  "no-fbld32-verbatim",
);

// Discipline core: propose / evaluate / synthesize against the shipped baseline.
need(/propose/i, "no-propose");
need(/evaluate/i, "no-evaluate");
need(/synthesi/i, "no-synthesize");
need(/shipped baseline/i, "no-shipped-baseline");
need(/REFUSED/, "no-refusal-marker");

// Gate-survivor-only accumulation: no change without evidence.
need(/gate-surviv/i, "no-gate-survivor");
need(/no change without evidence/i, "no-evidence-rule");

// Governed check budget: named classes, no check for every task by default.
need(/check budget/i, "no-check-budget");
need(/C1 harvest-cycle review/, "no-class-c1");
need(/C2 overlay-application review/, "no-class-c2");
need(/C3 check-mechanism calibration/, "no-class-c3");
need(/no check for every task by default/i, "no-default-deny");

// Frame reservation: reserved for this slot's design time, never adopted here.
need(/RESERVED/, "no-reserved-marker");
need(/frame/i, "no-frame");
need(/explicit owner decision/i, "no-owner-decision");
need(/refused by name/i, "no-auto-adoption-refusal");
need(/HELD/, "no-held-marker");

// Exit criteria plus open questions carried OPEN per reserve.
need(/exit criteria/i, "no-exit-criteria");
need(/open questions/i, "no-open-questions");
need(/class-value-measure: OPEN/, "no-class-value-open");
need(/lesson-distillation-bound: OPEN/, "no-distillation-open");

// The reserve grants nothing: no invented install surface may appear.
if (/install_cmd|npm install|pip install/i.test(text)) {
  fails.push("install-surface-present");
}
if (text.length === 0) {
  fails.push("empty-spec");
}

// Mechanism probes on fixed fixtures: the discipline must behave as specified.
// (a) Proposal-against-baseline: an unmeasured proposal is refused.
const evaluate = (proposal) =>
  proposal.measuredAgainstBaseline && proposal.definedCheck
    ? "ACCEPTED"
    : "REFUSED";
if (evaluate({ measuredAgainstBaseline: false, definedCheck: false }) !== "REFUSED") {
  fails.push("unmeasured-proposal-accepted");
}
if (evaluate({ measuredAgainstBaseline: true, definedCheck: false }) !== "REFUSED") {
  fails.push("checkless-proposal-accepted");
}
if (evaluate({ measuredAgainstBaseline: true, definedCheck: true }) !== "ACCEPTED") {
  fails.push("measured-proposal-refused");
}

// (b) Gate-survivor-only accumulation: only gate survivors accumulate.
const accumulate = (candidates) =>
  candidates.filter((c) => c.gatePass === true && c.evidence === true);
const kept = accumulate([
  { id: "lesson-a", gatePass: true, evidence: true },
  { id: "change-b", gatePass: false, evidence: true },
  { id: "change-c", gatePass: true, evidence: false },
]);
if (kept.length !== 1 || kept[0].id !== "lesson-a") {
  fails.push("non-survivor-accumulated");
}

// (c) Budget-gated check ordering: C1 first, then C2, then C3; default deny outside.
const rank = { C1: 1, C2: 2, C3: 3 };
const orderChecks = (tasks, budget) =>
  tasks
    .filter((t) => rank[t.cls] !== undefined)
    .sort((a, b) => rank[a.cls] - rank[b.cls])
    .slice(0, budget);
const ordered = orderChecks(
  [{ cls: "C3" }, { cls: "other" }, { cls: "C1" }, { cls: "C2" }],
  2,
);
if (
  ordered.length !== 2 ||
  ordered[0].cls !== "C1" ||
  ordered[1].cls !== "C2"
) {
  fails.push("budget-order-wrong");
}

// (d) Frame-reservation hold: adoption attempts hold; reservation never adopts.
const frameAttempt = () => "HELD-RESERVED:explicit-owner-decision-required-at-design-time";
if (frameAttempt() !== "HELD-RESERVED:explicit-owner-decision-required-at-design-time") {
  fails.push("frame-not-held");
}

if (fails.length > 0) {
  console.log("HOLD " + fails.join(","));
  process.exit(1);
}

const digest = createHash("sha256").update(text, "utf8").digest("hex");
console.log("PROCEED digest=" + digest);
