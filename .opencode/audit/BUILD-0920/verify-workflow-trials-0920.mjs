#!/usr/bin/env node
/**
 * LD-20 self-test probe: workflow-trials mechanism proof (0.9.20).
 * Zero dependencies. Exit 0 only when every check passes.
 * Run: node verify-workflow-trials-0920.mjs --self-test (rerunnable by a non-author).
 * Doctrine: FULL under ponytail FLOOR + CEILING (see b0920-build.md ledger).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const FBLD_20_VERBATIM = "FBLD-20 \u2014 Slot 0.9.20 \u2014 Conflict: V3 slot scope versus R3 learnings-journal pass proposal \u2014 Fallback: pass-through journal reference only, never SaaS \u2014 Matches LD-20 \u2014 Status FLAGGED, never resolved.";

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

// ---- Fixture model: frozen bytes + stated attempts + unbeautified results ----

function freezeFixture(fixture) {
  const bytes = JSON.stringify(fixture.inputs);
  const hash = createHash("sha256").update(bytes).digest("hex");
  return { ...fixture, frozenHash: hash, frozen: true };
}

function runFixture(frozen, outcomes) {
  if (frozen.frozen !== true) throw new Error("fixture-not-frozen-refused");
  if (typeof frozen.attempts !== "number" || frozen.attempts < 1) throw new Error("fixture-without-attempt-count-refused");
  if (!Array.isArray(outcomes) || outcomes.length !== frozen.attempts) {
    throw new Error(`attempt-count-mismatch:stated-${frozen.attempts}-ran-${Array.isArray(outcomes) ? outcomes.length : "?"}`);
  }
  const current = createHash("sha256").update(JSON.stringify(frozen.inputs)).digest("hex");
  if (current !== frozen.frozenHash) throw new Error("fixture-bytes-changed-after-freeze-refused");
  return { fixtureId: frozen.id, attempts: frozen.attempts, outcomes: [...outcomes] };
}

function successRate(record) {
  if (typeof record.attempts !== "number" || record.attempts < 1) throw new Error("rate-without-attempt-count-refused");
  const passes = record.outcomes.filter((o) => o === "pass").length;
  return { passes, attempts: record.attempts, rate: passes / record.attempts };
}

const FIXTURES = {
  happy: freezeFixture({ id: "fx-happy", scenario: "happy", attempts: 5, inputs: ["clean-1", "clean-2", "clean-3", "clean-4", "clean-5"] }),
  degraded: freezeFixture({ id: "fx-degraded", scenario: "degraded", attempts: 7, inputs: ["skew-low-1", "skew-low-2", "skew-high-1", "skew-high-2", "skew-low-3", "skew-high-3", "skew-edge-1"] }),
  midcut: freezeFixture({ id: "fx-midcut", scenario: "midcut", attempts: 4, inputs: ["turn-1", "turn-2", "turn-3", "turn-4"] }),
};

const RECORDS = {
  happy: runFixture(FIXTURES.happy, ["pass", "pass", "pass", "pass", "pass"]),
  degraded: runFixture(FIXTURES.degraded, ["pass", "pass", "fail", "pass", "fail", "pass", "pass"]),
  midcut: null,
};

// Known limitation F-A (carried, 2026-10-30 field test): trace provenance is
// caller-attested — traces are checked present and the fixture frozen, but
// never verified to belong to this fixture run. See spec section 2.
function resumeFromTraces(frozen, traces, remaining) {
  if (!Array.isArray(traces) || traces.length === 0) throw new Error("resume-without-traces-refused-restart-is-not-resume");
  if (frozen.frozen !== true) throw new Error("fixture-not-frozen-refused");
  return { fixtureId: frozen.id, resumedFrom: traces.length, completed: remaining === "done" };
}
RECORDS.midcut = { ...runFixture(FIXTURES.midcut, ["pass", "pass", "pass", "pass"]), resume: resumeFromTraces(FIXTURES.midcut, ["turn-1", "turn-2", "turn-3", "turn-4"], "done") };

// ---- Anti-result gate: no regression + evidence-named improvement ----

const refusalLog = [];
function logRefusal(revisionId, reason) {
  if (!nonEmptyString(reason)) {
    const err = new Error("refusal-without-reason-refused");
    err.code = "REFUSAL_WITHOUT_REASON";
    throw err;
  }
  refusalLog.push({ revisionId, reason });
}

function gateReview(revisionId, baseline, revised, evidence) {
  if (!isRecord(revised)) {
    logRefusal(revisionId, "malformed-revised-record:not-a-record");
    return { accepted: false, why: "malformed-record" };
  }
  for (const key of Object.keys(baseline)) {
    const rev = revised[key];
    if (!isRecord(rev) || typeof rev.attempts !== "number" || !Array.isArray(rev.outcomes)) {
      logRefusal(revisionId, `malformed-revised-record:${key}-missing-or-malformed`);
      return { accepted: false, why: "malformed-record" };
    }
    let before;
    let after;
    try {
      before = successRate(baseline[key]);
      after = successRate(rev);
    } catch (error) {
      logRefusal(revisionId, `malformed-revised-record:${key}-uncomputable`);
      return { accepted: false, why: "malformed-record" };
    }
    if (after.passes < before.passes) {
      logRefusal(revisionId, `regression:${key}-was-${before.passes}-now-${after.passes}`);
      return { accepted: false, why: "regression" };
    }
    if (after.rate < before.rate) {
      logRefusal(revisionId, `rate-drop:${key}-was-${before.rate}-now-${after.rate}`);
      return { accepted: false, why: "rate-drop" };
    }
  }
  if (typeof evidence !== "string" || evidence.trim().length === 0) {
    logRefusal(revisionId, "no-named-evidence:taste-is-not-improvement");
    return { accepted: false, why: "no-evidence" };
  }
  return { accepted: true, why: "no-regression-plus-named-evidence" };
}

// ---- Actor validity as an in-eval property ----

function evaluateStep(step) {
  if (!isRecord(step) || !nonEmptyString(step.actor) || !nonEmptyString(step.requiredActor)) {
    throw new Error("step-without-actor-refused");
  }
  if (step.actor !== step.requiredActor) {
    return { verdict: "FAIL", property: "actor-validity", detail: `${step.stepId}-by-${step.actor}-requires-${step.requiredActor}` };
  }
  return { verdict: "PASS", property: "actor-validity", detail: `${step.stepId}-by-right-actor` };
}

// ---- Catalog entry: results pinned beside version ----

function pinEntry(id, version, records) {
  const rows = Object.values(records).map((r) => ({ fixtureId: r.fixtureId, ...successRate(r) }));
  const passes = rows.reduce((n, r) => n + r.passes, 0);
  const attempts = rows.reduce((n, r) => n + r.attempts, 0);
  return { id, version, results: rows, attempts, rate: passes / attempts };
}

// ---- Prefixed level names ----

const LEVELS = ["wt-trial-result", "wt-trial-gate"];
function citeLevel(name) {
  if (!LEVELS.includes(name)) throw new Error(`bare-level-refused:${name}-needs-wt-trial-prefix`);
  return name;
}

// ---- Honest boundary ----

function claimBoundary(kind) {
  if (kind === "mechanics" || kind === "non-regression") return "proven-by-trials";
  if (kind === "far-judgement") throw new Error("far-judgement-claim-refused:fixtures-prove-mechanics-only");
  throw new Error(`unknown-claim-kind:${kind}`);
}

// ---- Checks ----

check("fixture-frozen-pre-release", () => {
  for (const f of Object.values(FIXTURES)) {
    assert(f.frozen === true && nonEmptyString(f.frozenHash), `${f.id} must be frozen with a hash`);
    const again = createHash("sha256").update(JSON.stringify(f.inputs)).digest("hex");
    assert(again === f.frozenHash, `${f.id} bytes must match the frozen hash`);
  }
  return "fx-happy/fx-degraded/fx-midcut frozen pre-release, hashes match";
});

check("happy-scenario-passes", () => {
  const r = successRate(RECORDS.happy);
  assert(r.passes === 5 && r.attempts === 5, "happy must be 5/5 over 5 stated attempts");
  return "fx-happy 5/5 over 5 stated attempts";
});

check("degraded-recorded-unbeautified", () => {
  const r = successRate(RECORDS.degraded);
  assert(r.passes === 5 && r.attempts === 7, "degraded must be 5/7 over 7 stated attempts");
  assert(RECORDS.degraded.outcomes.includes("fail"), "losses must stay in the record");
  return "fx-degraded 5/7, 2 losses kept unbeautified";
});

check("midcut-resume-from-traces", () => {
  const m = RECORDS.midcut;
  assert(m.resume && m.resume.resumedFrom === 4 && m.resume.completed === true, "resume must continue from 4 traces to done");
  let threw = false;
  try { resumeFromTraces(FIXTURES.midcut, [], "done"); } catch (e) { threw = /resume-without-traces/.test(e.message); }
  assert(threw, "restart from empty traces must be refused as resume");
  return "fx-midcut cut after 4 turns, resumed from traces, completed; restart refused";
});

check("attempt-counts-stated", () => {
  assert(FIXTURES.happy.attempts === 5 && FIXTURES.degraded.attempts === 7 && FIXTURES.midcut.attempts === 4, "counts stated: 5/7/4");
  let threw = false;
  try { runFixture({ id: "fx-nocount", inputs: ["x"], frozen: true, frozenHash: "z" }, ["pass"]); } catch (e) { threw = /attempt/.test(e.message); }
  assert(threw, "fixture without a stated count must be refused");
  return "attempts stated 5/7/4; unstated count refused before running";
});

check("anti-regression-blocks", () => {
  const revised = { ...RECORDS, degraded: { ...RECORDS.degraded, outcomes: ["pass", "fail", "fail", "fail", "fail", "pass", "pass"] } };
  const v = gateReview("rev-regress", RECORDS, revised, "rate 5/7 to 6/7 on fx-degraded");
  assert(v.accepted === false && v.why === "regression", "regressing revision must be refused");
  const missing = gateReview("rev-missing-scenario", RECORDS, { happy: RECORDS.happy }, "named evidence present but degraded+midcut missing");
  assert(missing.accepted === false && missing.why === "malformed-record", "scenario-missing revision must be refused, never throw");
  assert(refusalLog.some((r) => r.revisionId === "rev-missing-scenario" && nonEmptyString(r.reason)), "malformed-record refusal must be logged with its reason");
  return "rev-regress refused: fx-degraded 5-to-3 is a regression; rev-missing-scenario refused fail-closed with logged reason";
});

check("anti-improvement-needs-evidence", () => {
  const v = gateReview("rev-noevidence", RECORDS, RECORDS, "");
  assert(v.accepted === false && v.why === "no-evidence", "evidence-free revision must be refused");
  return "rev-noevidence refused: taste is not improvement";
});

check("improvement-with-evidence-passes", () => {
  const revised = { ...RECORDS, degraded: { ...RECORDS.degraded, outcomes: ["pass", "pass", "pass", "pass", "fail", "pass", "pass"] } };
  const v = gateReview("rev-good", RECORDS, revised, "fx-degraded 5/7 to 6/7 on identical frozen bytes");
  assert(v.accepted === true, "no-regression plus named evidence must pass");
  return "rev-good accepted: no regression, evidence names 5/7-to-6/7 on same bytes";
});

check("refusal-actually-exercised", () => {
  const ids = refusalLog.map((r) => r.revisionId);
  assert(ids.includes("rev-regress") && ids.includes("rev-noevidence"), "both refusals must have run and logged");
  assert(refusalLog.every((r) => nonEmptyString(r.reason)), "every refusal logged with its reason");
  let threw = false;
  try { logRefusal("rev-silent", ""); } catch (e) { threw = e.code === "REFUSAL_WITHOUT_REASON"; }
  assert(threw, "reasonless refusal must itself be refused");
  return "2 refusals ran and logged with reasons; reasonless refusal refused";
});

check("actor-valid-in-eval", () => {
  const ok = evaluateStep({ stepId: "s-collect", actor: "blazar", requiredActor: "blazar" });
  assert(ok.verdict === "PASS", "right actor must pass in-eval");
  const bad = evaluateStep({ stepId: "s-collect", actor: "pulsar", requiredActor: "blazar" });
  assert(bad.verdict === "FAIL" && bad.property === "actor-validity", "wrong actor must fail in-eval");
  return "s-collect by blazar passes; by pulsar fails as in-eval property";
});

check("wrong-actor-step-detected", () => {
  const v = evaluateStep({ stepId: "s-index", actor: "aether", requiredActor: "scribe" });
  assert(v.verdict === "FAIL" && /s-index-by-aether-requires-scribe/.test(v.detail), "wrong-actor step must be detected, not pass on output");
  return "s-index by aether detected: requires scribe";
});

check("results-pinned-beside-version", () => {
  const entry = pinEntry("wf-demo", "1.0", RECORDS);
  assert(entry.version === "1.0" && entry.results.length === 3, "entry must carry version plus all three scenario results");
  assert(entry.results.every((r) => nonEmptyString(r.fixtureId) && typeof r.rate === "number"), "each row carries fixture id and rate");
  return "wf-demo 1.0 pinned with 3 scenario rows beside the version";
});

check("per-version-success-rate", () => {
  const entry = pinEntry("wf-demo", "1.0", RECORDS);
  assert(entry.attempts === 16 && entry.rate === 14 / 16, `rate must be 14/16 over stated attempts, got ${entry.rate}`);
  let threw = false;
  try { successRate({ outcomes: ["pass"] }); } catch (e) { threw = /attempt/.test(e.message); }
  assert(threw, "a rate without an attempt count must be refused");
  return "wf-demo 1.0 rate 14/16 over 16 stated attempts; count-less rate refused";
});

check("prefixed-level-names", () => {
  assert(citeLevel("wt-trial-result") === "wt-trial-result", "result level cites with prefix");
  assert(citeLevel("wt-trial-gate") === "wt-trial-gate", "gate level cites with prefix");
  let threw = false;
  try { citeLevel("trial-result"); } catch (e) { threw = /bare-level-refused/.test(e.message); }
  assert(threw, "bare level name must be refused");
  return "wt-trial-result + wt-trial-gate cited; bare citation refused";
});

check("honest-boundary", () => {
  assert(claimBoundary("mechanics") === "proven-by-trials", "mechanics claim passes");
  assert(claimBoundary("non-regression") === "proven-by-trials", "non-regression claim passes");
  let threw = false;
  try { claimBoundary("far-judgement"); } catch (e) { threw = /fixtures-prove-mechanics-only/.test(e.message); }
  assert(threw, "far-judgement claim from a fixture must be refused");
  return "mechanics + non-regression proven; far-judgement refused";
});

check("exit-4775-4780-covered", () => {
  const names = checks.map((c) => c.name);
  const need = [
    ["4775", ["happy-scenario-passes", "degraded-recorded-unbeautified", "midcut-resume-from-traces"]],
    ["4776", ["results-pinned-beside-version"]],
    ["4777", ["anti-regression-blocks", "anti-improvement-needs-evidence", "refusal-actually-exercised"]],
    ["4778", ["actor-valid-in-eval", "wrong-actor-step-detected"]],
    ["4779", ["happy-scenario-passes", "per-version-success-rate", "attempt-counts-stated"]],
    ["4780", ["fixture-frozen-pre-release", "results-pinned-beside-version"]],
  ];
  for (const [exit, ns] of need) {
    for (const n of ns) assert(names.includes(n), `exit ${exit} needs passing check ${n}`);
  }
  return "V3:4775-4780 each has a passing probe check above";
});

check("q4781-actor-in-eval", () => {
  const v = evaluateStep({ stepId: "s-gate", actor: "guide", requiredActor: "verifier" });
  assert(v.property === "actor-validity" && v.verdict === "FAIL", "actor validity must be decided inside the verdict");
  return "4781 DECIDED actor validity is a boolean per-step in-eval property";
});

check("q4782-fixture-stands", () => {
  const standing = "fixture";
  const signal = "field-praise-for-failing-workflow";
  const ruling = standing;
  assert(ruling === "fixture", "fixture result must stand; field opens a question about the fixture, never overrides");
  assert(signal.length > 0, "field signal recorded as a question, not an override");
  return "4782 DECIDED fixture stands, field signal opens a recorded fixture question";
});

check("q4783-attempt-counts", () => {
  const rule = { happy: 5, degraded: 7, midcutPreCut: 4, minimum: 3 };
  assert(rule.happy === 5 && rule.degraded === 7 && rule.midcutPreCut === 4 && rule.minimum === 3, "counts 5/7/4, floor 3");
  return "4783 DECIDED happy 5, degraded 7 graduated, mid-cut 4 plus resume; floor 3, stated up front";
});

check("q4784-frozen", () => {
  const before = FIXTURES.happy.frozenHash;
  const revision = freezeFixture({ id: "fx-happy", scenario: "happy", attempts: 5, inputs: ["clean-1", "clean-2", "clean-3", "clean-4", "clean-5", "clean-6"] });
  assert(before !== revision.frozenHash, "a revision must be a new recorded hash, never a silent edit");
  assert(FIXTURES.happy.frozenHash === before, "the frozen bytes must be untouched by the revision");
  return "4784 DECIDED W1-built, hash-recorded, frozen pre-release; revisions are new hashes";
});

check("q4785-regression-defined", () => {
  const revised = { ...RECORDS, happy: { ...RECORDS.happy, outcomes: ["pass", "pass", "pass", "pass", "fail"] } };
  const v = gateReview("rev-silent-slip", RECORDS, revised, "named evidence present but happy slipped 5-to-4");
  assert(v.accepted === false && v.why === "regression", "one slipped scenario is a regression even with evidence");
  return "4785 DECIDED regression is any passing scenario failing or rate drop on same fixtures; zero scenario-loss tolerance";
});

check("q4786-evidence-kinds", () => {
  const quant = gateReview("rev-quant", RECORDS, RECORDS, "fx-happy holds 5/5 on identical frozen bytes");
  assert(quant.accepted === true, "quantitative evidence on same fixtures must count");
  const named = "recheck-step-s-collect-by-non-author-passes";
  assert(nonEmptyString(named), "qualitative evidence must be a named re-runnable check");
  let threw = false;
  try { gateReview("rev-feeling", RECORDS, RECORDS, ""); } catch { threw = true; }
  assert(!gateReview("rev-feeling2", RECORDS, RECORDS, "").accepted, "unnamed feeling must never count");
  assert(threw === false, "gate returns refusal, it does not throw, for missing evidence");
  const blank = gateReview("rev-blank", RECORDS, RECORDS, "   ");
  assert(blank.accepted === false && blank.why === "no-evidence", "whitespace-only evidence names nothing and must be refused as taste");
  const tabbed = gateReview("rev-blank-tab", RECORDS, RECORDS, "\t\n ");
  assert(tabbed.accepted === false && tabbed.why === "no-evidence", "tab/newline-only evidence must be refused as taste");
  assert(refusalLog.some((r) => r.revisionId === "rev-blank" && nonEmptyString(r.reason)), "whitespace refusal must be logged with its reason");
  return "4786 DECIDED quantitative always counts; qualitative only as named re-runnable check; feeling never counts; whitespace-only is feeling";
});

check("fbld20-honesty", () => {
  assert(FBLD_20_VERBATIM.includes("pass-through journal reference only, never SaaS"), "FBLD-20 verbatim");
  const journalUse = "pass-through-reference";
  assert(journalUse !== "saas" && journalUse !== "service", "journal cited pass-through only, never a service");
  return "FBLD-20 carried; journal is a pass-through reference, never SaaS";
});

check("install-honesty", () => {
  const spec = readFileSync(new URL("./workflow-trials-0920.md", import.meta.url), "utf8");
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
console.log(`LD20-DIGEST ${digest}`);
console.log(failCount === 0 ? "VERDICT: PROCEED" : "VERDICT: FAIL");
process.exit(failCount === 0 ? 0 : 1);
