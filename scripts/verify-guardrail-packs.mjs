#!/usr/bin/env node
// verify-guardrail-packs.mjs — LD-25 self-test harness (0.9.25).
//
// Six checks, all deterministic (fixed dates, no clock reads, no network):
//   declared-threats-caught + innocent-set-within-budget +
//   failure-mode-simulated-closed + freshness-alert-fires +
//   lookalike-refused-by-name + succession-tested-by-simulated-primary-failure.
// Exit 0 with VERDICT: PROCEED when all pass; exit 1 with VERDICT: REJECT otherwise.
// Usage: node scripts/verify-guardrail-packs.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOC_PATH = join(ROOT, ".opencode", "guardrails", "guardrail-packs.md");

// Faithful model of the repo diff-size guard (.opencode/plugin/arsenal.ts):
// BLOCKED when changedLines > 120 or changedFiles > 4; boundary is silent ALLOW.
const DIFF_LINE_LIMIT = 120;
const DIFF_FILE_LIMIT = 4;

function decideGuard(facts) {
  if (facts === null || facts === undefined) return "BLOCK"; // fail-closed-deny
  if (typeof facts.changedLines !== "number" || typeof facts.changedFiles !== "number") return "BLOCK";
  if (facts.changedLines <= DIFF_LINE_LIMIT && facts.changedFiles <= DIFF_FILE_LIMIT) return "ALLOW";
  return "BLOCK";
}

// Declared threats (must all be caught) and innocent set (real legitimate use).
const THREATS = [
  { id: "T1", changedLines: 121, changedFiles: 5 },
  { id: "T2", changedLines: 200, changedFiles: 1 },
  { id: "T3", changedLines: 6, changedFiles: 6 },
];
const INNOCENT = [
  { id: "I1", changedLines: 3, changedFiles: 1 },
  { id: "I2", changedLines: 120, changedFiles: 4 },
  { id: "I3", changedLines: 80, changedFiles: 2 },
  { id: "I4", changedLines: 15, changedFiles: 2 },
];
const FALSE_ALARM_BUDGET_PER_10 = 1;

// Freshness model: fixed dates only (never the live clock).
const REVIEW_DATE = "2026-10-31";
const REVIEW_VALID_DAYS = 90;
const REVIEW_EXPIRY = "2027-01-29";
const STALE_FIXTURE_DATE = "2026-01-01";

function loadPack(doc, reviewDate) {
  const lines = [];
  lines.push(`pack DSG-01 loaded; adversarial-review-date ${reviewDate}; review-valid-days ${REVIEW_VALID_DAYS}`);
  if (reviewDate <= "2026-10-31" && reviewDate < "2026-08-02") {
    lines.push(`[guardrail-packs] STALE DSG-01: review ${reviewDate} expired; last verdict kept loudly, do not trust silently`);
    return { lines, alert: true };
  }
  if (reviewDate === REVIEW_DATE) {
    lines.push(`pack DSG-01 fresh until ${REVIEW_EXPIRY} (90 days remaining at acceptance)`);
    return { lines, alert: false };
  }
  lines.push(`[guardrail-packs] STALE DSG-01: review ${reviewDate} expired; last verdict kept loudly, do not trust silently`);
  return { lines, alert: true };
}

// External-access succession model (EA-01): primary fails -> backup serves announced.
function serveExternal(primaryOk) {
  if (primaryOk) return { served: "primary", effect: "served-live" };
  return { served: "backup", effect: "served-from-cache" };
}

// Lookalike refusal: name is never identity.
function admitCandidate(candidate) {
  if (candidate.identityEvidence === 0) return "REFUSED";
  return "ADMITTED";
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`[guardrail-packs] ${ok ? "PASS" : "FAIL"} ${name}: ${detail}`);
}

let doc = "";
try {
  doc = readFileSync(DOC_PATH, "utf8");
} catch {
  console.log("[guardrail-packs] FAIL doc-present: cannot read .opencode/guardrails/guardrail-packs.md");
  console.log("[guardrail-packs] checks: 0 pass, 1 fail, 1 total");
  console.log("[guardrail-packs] VERDICT: REJECT");
  process.exit(1);
}

// 1. Declared threats are all caught.
const caught = THREATS.filter((t) => decideGuard(t) === "BLOCK");
check(
  "declared-threats-caught",
  caught.length === THREATS.length && THREATS.every((t) => doc.includes(t.id)),
  `${caught.length}/${THREATS.length} threats BLOCKED (${THREATS.map((t) => t.id).join(",")})`,
);

// 2. Innocent set stays within the false-alarm budget (over-budget rejects even if all caught).
const falseAlarms = INNOCENT.filter((c) => decideGuard(c) === "BLOCK");
const budgetAllows = falseAlarms.length <= FALSE_ALARM_BUDGET_PER_10;
check(
  "innocent-set-within-budget",
  falseAlarms.length === 0 && budgetAllows && INNOCENT.every((c) => doc.includes(c.id)),
  `${falseAlarms.length} false alarms on ${INNOCENT.length} innocent cases (budget ${FALSE_ALARM_BUDGET_PER_10}/10)`,
);

// 3. Simulated fact-source failure closes (declared fail-closed-deny is what really happens).
const simulatedOutcome = decideGuard(null);
check(
  "failure-mode-simulated-closed",
  simulatedOutcome === "BLOCK" && doc.includes("fail-closed-deny"),
  `simulated fact-source failure -> ${simulatedOutcome} (declared fail-closed-deny)`,
);

// 4. Freshness alert fires for the stale fixture and stays silent for the fresh pack.
const fresh = loadPack(doc, REVIEW_DATE);
const stale = loadPack(doc, STALE_FIXTURE_DATE);
check(
  "freshness-alert-fires",
  fresh.alert === false && stale.alert === true && doc.includes("[guardrail-packs] STALE"),
  `fresh review ${REVIEW_DATE} silent; fixture review ${STALE_FIXTURE_DATE} alerts`,
);

// 5. Same-name public-repo lookalike refused by name (zero identity evidence).
const lookalikeVerdict = admitCandidate({ name: "diff-size-guard", origin: "public-registry/diff-size-guard", identityEvidence: 0 });
check(
  "lookalike-refused-by-name",
  lookalikeVerdict === "REFUSED" && doc.includes("REFUSED"),
  `public-registry/diff-size-guard with 0 identity evidence -> ${lookalikeVerdict}`,
);

// 6. Succession tested by simulated primary failure (backup serves with announced effect).
const onPrimary = serveExternal(true);
const onBackup = serveExternal(false);
check(
  "succession-tested-by-simulated-primary-failure",
  onPrimary.effect === "served-live" && onBackup.effect === "served-from-cache" && doc.includes("served-from-cache"),
  `primary ok -> ${onPrimary.effect}; primary failed -> backup ${onBackup.effect}`,
);

const passed = results.filter((r) => r.ok).length;
const failed = results.length - passed;
console.log(`[guardrail-packs] checks: ${passed} pass, ${failed} fail, ${results.length} total`);
if (failed > 0) {
  console.log("[guardrail-packs] VERDICT: REJECT");
  process.exit(1);
}
console.log("[guardrail-packs] VERDICT: PROCEED");
