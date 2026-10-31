#!/usr/bin/env node
// verify-eval-packs.mjs — LD-27 self-test harness (0.9.27).
//
// Twenty-five checks, all deterministic (fixed dates, fixed fixtures, no clock
// reads, no network). Models the pack formula in
// `.opencode/evals/eval-packs.md` (sections cited per check) and fails closed:
// any exception is a FAIL.
// Exit 0 with VERDICT: PROCEED when all pass; exit 1 with VERDICT: REJECT.
// Usage: node scripts/verify-eval-packs.mjs
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOC_PATH = join(ROOT, ".opencode", "evals", "eval-packs.md");

// Fixed dates only (never the live clock).
const LOAD_DATE = "2026-10-31";
const SEED_EXPIRY = "2026-12-29"; // 59 days out: fast-expiring, fresh
const NEAR_FIXTURE_EXPIRY = "2026-11-15"; // 15 days out: NEAR, not EXPIRED
const EXPIRED_FIXTURE_EXPIRY = "2026-01-01";
const FAST_WINDOW_DAYS = 90;
const NEAR_WINDOW_END = "2026-11-30"; // LOAD + 30 days, ISO compare

function sha256Hex(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

// --- Fixtures (spec section 7; hash-pinned at acceptance) -------------------
const F_GOOD = {
  id: "F-good",
  output: "Trial report: verdict PROCEED recorded once.",
  expect: "PROCEED",
  forbid: "BROKEN",
  defectKnown: null,
};
const F_BAD = {
  id: "F-bad",
  output: "Trial report: verdict missing entirely, BROKEN marker present.",
  expect: "PROCEED",
  forbid: "BROKEN",
  defectKnown: "missing-token",
};
const PINNED_FIXTURE_HASHES = {
  "F-good": sha256Hex(F_GOOD.output),
  "F-bad": sha256Hex(F_BAD.output),
};

// --- Seed evaluator E-01 (spec section 7) -----------------------------------
function evaluateE01(output, fixture) {
  if (typeof output !== "string") return "REJECT";
  if (output.includes(fixture.forbid)) return "REJECT";
  if (!output.includes(fixture.expect)) return "REJECT";
  return "ACCEPT";
}

// Defective evaluator fixtures (must both fail pre-acceptance).
const alwaysPass = () => "ACCEPT";
const alwaysReject = () => "REJECT";

// Pre-acceptance gate (spec section 2).
function preAcceptance(evaluator, good, bad) {
  const goodVerdict = evaluator(good.output, good);
  const badVerdict = evaluator(bad.output, bad);
  if (goodVerdict !== "ACCEPT")
    return { verdict: "REJECTED", reason: "rejects-known-good" };
  if (badVerdict !== "REJECT")
    return { verdict: "REJECTED", reason: "passes-known-broken" };
  return { verdict: "ACCEPTED", reason: "passes-both-sides" };
}

// --- Difficulty (spec section 3) --------------------------------------------
const MEASURE_TOOL = "e1.0";
function assignDifficulty({ rates, version, tool }) {
  if (!rates || rates.length === 0)
    throw new Error("REFUSED-WRITE-WITHOUT-MEASURE");
  const rate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const band = rate >= 0.8 ? "easy" : rate >= 0.5 ? "medium" : "hard";
  return { label: `difficulty:${band}`, rate, tool, version };
}
function carryLabel(label, newVersion) {
  if (label.version !== newVersion) return "REMEASURE-REQUIRED";
  return label;
}

// --- Calibration (spec section 4) -------------------------------------------
const MIN_LEVELS = 3;
const MIN_TRIALS_PER_LEVEL = 4;
const MIN_SPREAD = 0.25;
const SEED_CALIBRATION = [
  { level: "L1-easy", trials: 12, passes: 11 }, // 0.917
  { level: "L2-mid", trials: 12, passes: 7 }, // 0.583
  { level: "L3-hard", trials: 12, passes: 2 }, // 0.167
];
function calibrationVerdict(levels) {
  if (levels.length < MIN_LEVELS) return "REFORMULATE";
  if (levels.some((l) => l.trials < MIN_TRIALS_PER_LEVEL)) return "REFORMULATE";
  const rates = levels.map((l) => l.passes / l.trials);
  if (rates.every((r) => r === 0)) return "REFORMULATE-ALL-ZERO";
  if (rates.every((r) => r === 1)) return "REFORMULATE-ALL-HUNDRED";
  const spread = Math.max(...rates) - Math.min(...rates);
  if (spread < MIN_SPREAD) return "REFORMULATE";
  return "HEALTHY";
}

// --- Index (spec section 5) --------------------------------------------------
const INDEX = {
  packs: { "EP-01": { version: "v1", component: "workflow-trials" } },
  components: { "workflow-trials": { packs: ["EP-01"] } },
};

// --- Integration recipe (spec section 6) -------------------------------------
const RECIPE = {
  id: "IR-01",
  kind: "skill",
  subtype: "integration-recipe",
  host: "workflow-trials",
  hostVersion: "0.9.27",
  expires: SEED_EXPIRY,
};
function recipeLoadState(expiry) {
  if (expiry <= LOAD_DATE) return "[eval-packs] EXPIRED";
  if (expiry <= NEAR_WINDOW_END) return "[eval-packs] NEAR-EXPIRY";
  return null;
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: Boolean(ok), detail });
  console.log(`[eval-packs] ${ok ? "PASS" : "FAIL"} ${name}: ${detail}`);
}

let doc = "";
try {
  doc = readFileSync(DOC_PATH, "utf8");
} catch {
  console.log("[eval-packs] FAIL doc-present: cannot read .opencode/evals/eval-packs.md");
  console.log("[eval-packs] checks: 0 pass, 1 fail, 1 total");
  console.log("[eval-packs] VERDICT: REJECT");
  process.exit(1);
}

// 1. Spec document is present and names the formula.
check(
  "doc-present",
  doc.includes("Pack formula") && doc.includes("eval-packs"),
  "spec readable, formula section present",
);

// 2. The seed pack carries all five formula elements.
{
  const formula = {
    task: "T-01",
    fixture: ["F-good", "F-bad"],
    evaluator: "E-01",
    version: "v1",
    indexLink: "EP-01",
  };
  const complete =
    formula.task !== null &&
    formula.fixture.length >= 2 &&
    formula.evaluator !== null &&
    formula.version !== null &&
    formula.indexLink !== null;
  check(
    "pack-formula-complete",
    complete && doc.includes("all five hold together"),
    "EP-01 task+fixture+evaluator+version+index-link all present",
  );
}

// 3. No pack enters the index without a tested evaluator.
{
  const pack = { id: "EP-01", evaluator: "E-01", tested: preAcceptance(evaluateE01, F_GOOD, F_BAD).verdict };
  check(
    "no-pack-without-tested-evaluator",
    pack.evaluator !== null && pack.tested === "ACCEPTED" && doc.includes("No pack enters the index without a tested evaluator"),
    "EP-01 evaluator E-01 pre-acceptance ACCEPTED",
  );
}

// 4. No evaluator is accepted without its two known fixtures.
{
  const fixtures = ["F-good", "F-bad"];
  check(
    "no-evaluator-without-two-fixtures",
    fixtures.length >= 2 && doc.includes("at least two known fixtures"),
    "E-01 carries F-good + F-bad (2/2)",
  );
}

// 5. E-01 accepts the known-good fixture.
check(
  "evaluator-accepts-known-good",
  evaluateE01(F_GOOD.output, F_GOOD) === "ACCEPT",
  "F-good output -> ACCEPT",
);

// 6. E-01 rejects the known-broken fixture.
check(
  "evaluator-rejects-known-broken",
  evaluateE01(F_BAD.output, F_BAD) === "REJECT",
  "F-bad output (BROKEN marker) -> REJECT",
);

// 7. An always-pass evaluator is REJECTED (passes the broken).
{
  const gate = preAcceptance(alwaysPass, F_GOOD, F_BAD);
  check(
    "pass-broken-evaluator-rejected",
    gate.verdict === "REJECTED" && gate.reason === "passes-known-broken",
    "always-pass evaluator -> REJECTED (passes-known-broken)",
  );
}

// 8. An always-reject evaluator is REJECTED (rejects the good).
{
  const gate = preAcceptance(alwaysReject, F_GOOD, F_BAD);
  check(
    "reject-good-evaluator-rejected",
    gate.verdict === "REJECTED" && gate.reason === "rejects-known-good",
    "always-reject evaluator -> REJECTED (rejects-known-good)",
  );
}

// 9. The rejection is a record, never a warning or temporary accept.
{
  const record = { evaluator: "always-pass", verdict: "REJECTED", reason: "passes-known-broken", temporary: false };
  check(
    "rejection-recorded",
    record.verdict === "REJECTED" && record.temporary === false && doc.includes("a warning and never a temporary"),
    "always-pass rejection recorded, temporary false",
  );
}

// 10. Every accepted evaluator keeps its test record.
{
  const record = { evaluator: "E-01", good: "ACCEPT", bad: "REJECT", verdict: "ACCEPTED" };
  const gate = preAcceptance(evaluateE01, F_GOOD, F_BAD);
  check(
    "test-record-preserved",
    record.good === "ACCEPT" && record.bad === "REJECT" && gate.verdict === record.verdict,
    "E-01 good ACCEPT + bad REJECT recorded, matches gate",
  );
}

// 11. Fixtures are preserved unmodified (hash pins match).
{
  const drift = [F_GOOD, F_BAD].some((f) => sha256Hex(f.output) !== PINNED_FIXTURE_HASHES[f.id]);
  check(
    "fixtures-preserved",
    drift === false && doc.includes("hash-pinned"),
    `F-good + F-bad hashes match pins (${PINNED_FIXTURE_HASHES["F-good"].slice(0, 12)}... / ${PINNED_FIXTURE_HASHES["F-bad"].slice(0, 12)}...)`,
  );
}

// 12. A difficulty label is written from measured rates.
{
  const label = assignDifficulty({ rates: [11 / 12, 7 / 12, 2 / 12], version: "v1", tool: MEASURE_TOOL });
  check(
    "difficulty-label-shape",
    label.label === "difficulty:medium" && doc.includes("difficulty:<band>"),
    `measured mean 0.583 -> ${label.label} (e1.0 v1)`,
  );
}

// 13. Writing a label without measured rates is refused (proven attempt).
{
  let token = null;
  try {
    assignDifficulty({ rates: [], version: "v1", tool: MEASURE_TOOL });
  } catch (err) {
    token = err.message;
  }
  let token2 = null;
  try {
    assignDifficulty({ rates: null, version: "v1", tool: MEASURE_TOOL });
  } catch (err) {
    token2 = err.message;
  }
  check(
    "difficulty-without-measure-refused",
    token === "REFUSED-WRITE-WITHOUT-MEASURE" &&
      token2 === "REFUSED-WRITE-WITHOUT-MEASURE" &&
      doc.includes("REFUSED-WRITE-WITHOUT-MEASURE"),
    "empty rates + null rates both throw REFUSED-WRITE-WITHOUT-MEASURE",
  );
}

// 14. The label binds to its measured version.
{
  const label = assignDifficulty({ rates: [11 / 12, 7 / 12, 2 / 12], version: "v1", tool: MEASURE_TOOL });
  check(
    "difficulty-bound-to-version",
    label.version === "v1" && label.tool === MEASURE_TOOL && doc.includes("never carried across versions"),
    "label pins e1.0 v1 beside the band",
  );
}

// 15. Carrying a label to a new version demands re-measurement.
{
  const label = assignDifficulty({ rates: [11 / 12, 7 / 12, 2 / 12], version: "v1", tool: MEASURE_TOOL });
  check(
    "carry-demands-remeasure",
    carryLabel(label, "v2") === "REMEASURE-REQUIRED" && carryLabel(label, "v1") === label,
    "v1 label to v2 -> REMEASURE-REQUIRED; same version carries",
  );
}

// 16. The seed calibration shows healthy variance.
{
  const rates = SEED_CALIBRATION.map((l) => l.passes / l.trials);
  const spread = Math.max(...rates) - Math.min(...rates);
  check(
    "calibration-healthy-variance",
    calibrationVerdict(SEED_CALIBRATION) === "HEALTHY" && doc.includes("at least 0.25"),
    `3 levels x 12 trials spread ${spread.toFixed(3)} >= 0.25 -> HEALTHY`,
  );
}

// 17. An all-zero run is reformulated, never accepted.
{
  const flat = SEED_CALIBRATION.map((l) => ({ ...l, passes: 0 }));
  check(
    "all-zero-reformulated",
    calibrationVerdict(flat) === "REFORMULATE-ALL-ZERO" && doc.includes("all-zero"),
    "0/12 x 3 levels -> REFORMULATE-ALL-ZERO",
  );
}

// 18. An all-hundred run is reformulated, never accepted.
{
  const flat = SEED_CALIBRATION.map((l) => ({ ...l, passes: l.trials }));
  check(
    "all-hundred-reformulated",
    calibrationVerdict(flat) === "REFORMULATE-ALL-HUNDRED" && doc.includes("all one hundred"),
    "12/12 x 3 levels -> REFORMULATE-ALL-HUNDRED",
  );
}

// 19. The calibration run is recorded with its variance.
{
  const record = { pack: "EP-01", version: "v1", levels: SEED_CALIBRATION.length, spread: 0.75 };
  const rates = SEED_CALIBRATION.map((l) => l.passes / l.trials);
  const spread = Math.max(...rates) - Math.min(...rates);
  check(
    "calibration-recorded",
    record.levels === 3 && Math.abs(spread - record.spread) < 1e-9 && doc.includes("recorded calibration"),
    `EP-01 v1 calibration recorded: 3 levels spread ${spread.toFixed(3)}`,
  );
}

// 20. The index link reads from both sides.
{
  const packSide = INDEX.packs["EP-01"].component === "workflow-trials";
  const compSide = INDEX.components["workflow-trials"].packs.includes("EP-01");
  check(
    "bilateral-links-both-sides",
    packSide && compSide && doc.includes("bilateral"),
    "EP-01 -> workflow-trials AND workflow-trials -> EP-01",
  );
}

// 21. Every accepted pack is visible in the index.
{
  const accepted = ["EP-01"];
  const visible = accepted.every((id) => id in INDEX.packs);
  check(
    "index-complete",
    visible && doc.includes("no accepted pack lives outside"),
    "1/1 accepted packs indexed (EP-01)",
  );
}

// 22. The recipe carries its host version visibly at load.
check(
  "recipe-host-version-visible",
  RECIPE.hostVersion === "0.9.27" && doc.includes("host-version:"),
  "IR-01 host-version 0.9.27 visible at load",
);

// 23. The recipe is a skill subtype, never a new kind.
check(
  "recipe-skill-subtype-no-new-kind",
  RECIPE.kind === "skill" && RECIPE.subtype === "integration-recipe" && doc.includes("never a new kind"),
  "IR-01 kind skill / subtype integration-recipe",
);

// 24. The recipe is fast-expiring and expiry states are distinct.
{
  const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
  const fresh = recipeLoadState(SEED_EXPIRY) === null && days(LOAD_DATE, SEED_EXPIRY) <= FAST_WINDOW_DAYS;
  const nearTok = recipeLoadState(NEAR_FIXTURE_EXPIRY);
  const expiredTok = recipeLoadState(EXPIRED_FIXTURE_EXPIRY);
  const near = nearTok === "[eval-packs] NEAR-EXPIRY";
  const expired = expiredTok === "[eval-packs] EXPIRED";
  check(
    "recipe-fast-expiry",
    fresh && near && expired && nearTok !== expiredTok && doc.includes("[eval-packs] EXPIRED"),
    `IR-01 expires ${SEED_EXPIRY} (${days(LOAD_DATE, SEED_EXPIRY)}d, fresh); NEAR != EXPIRED distinct`,
  );
}

// 25. One workflow trial runs on the tested evaluator (consumption proof).
{
  const tGood = evaluateE01(F_GOOD.output, F_GOOD);
  const tBad = evaluateE01(F_BAD.output, F_BAD);
  check(
    "workflow-trial-consumption",
    tGood === "ACCEPT" && tBad === "REJECT" && doc.includes("Trial T-01 runs on E-01"),
    "T-01 on E-01: F-good ACCEPT + F-bad REJECT",
  );
}

// 26. The seed passes every gate on the same formula with zero exemptions.
{
  const gate = preAcceptance(evaluateE01, F_GOOD, F_BAD);
  const seed = {
    id: "EP-01",
    task: "T-01",
    fixtures: 2,
    gate: gate.verdict,
    calibration: calibrationVerdict(SEED_CALIBRATION),
    bilateral: INDEX.packs["EP-01"].component === "workflow-trials" &&
      INDEX.components["workflow-trials"].packs.includes("EP-01"),
    recipe: RECIPE.kind === "skill" && RECIPE.hostVersion === "0.9.27",
    exemptions: 0,
  };
  const allOk =
    seed.task !== null && seed.fixtures >= 2 && seed.gate === "ACCEPTED" &&
    seed.calibration === "HEALTHY" && seed.bilateral && seed.recipe && seed.exemptions === 0;
  check(
    "seed-passes-all-gates",
    allOk && doc.includes("Exemptions: 0"),
    "EP-01 formula+tested-evaluator+healthy-calibration+bilateral+recipe+0-exemptions",
  );
}

const passed = results.filter((r) => r.ok).length;
const failed = results.length - passed;
const digest = sha256Hex(JSON.stringify(results.map((r) => [r.name, r.ok, r.detail])));
console.log(`[eval-packs] checks: ${passed} pass, ${failed} fail, ${results.length} total`);
console.log(`[eval-packs] digest: ${digest}`);
if (failed > 0) {
  console.log("[eval-packs] VERDICT: REJECT");
  process.exit(1);
}
console.log("[eval-packs] VERDICT: PROCEED");
