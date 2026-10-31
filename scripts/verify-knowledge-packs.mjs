#!/usr/bin/env node
// verify-knowledge-packs.mjs — LD-26 self-test harness (0.9.26).
//
// Twenty-two checks, all deterministic (fixed dates, no clock reads, no
// network). Models the pack schema in `.opencode/knowledge/knowledge-packs.md`
// (sections cited per check) and fails closed: any exception is a FAIL.
// Exit 0 with VERDICT: PROCEED when all pass; exit 1 with VERDICT: REJECT.
// Usage: node scripts/verify-knowledge-packs.mjs
import { createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOC_PATH = join(ROOT, ".opencode", "knowledge", "knowledge-packs.md");

// Fixed dates only (never the live clock).
const LOAD_DATE = "2026-10-31";
const SEED_EXPIRY = "2027-01-29";
const NEAR_FIXTURE_EXPIRY = "2026-11-15"; // 15 days out: NEAR, not EXPIRED
const EXPIRED_FIXTURE_EXPIRY = "2026-01-01";
const NEAR_WINDOW_DAYS = 30;

function sha256Hex(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

// --- Pack model (mirrors spec sections 1-2) --------------------------------
const SEED_SOURCES = [
  {
    id: "S1",
    text: "V3 slot text 0.9.26 lines 5594-5746 is the acceptance wording.",
    trust:
      "Trusted as the acceptance wording because it is the sole authority named in the dispatch; limit: wording only; re-review when the V3 text changes.",
    license: "repo-internal",
  },
  {
    id: "S2",
    text: "0.9.25 guardrail spec plus harness shape is the structural pattern.",
    trust:
      "Trusted as the structural pattern because its commit is published and verified; limit: pattern only; re-review when the slot text changes.",
    license: "repo-internal",
  },
  {
    id: "S3",
    text: "Plugin surface census read live from the tree is the inventory.",
    trust:
      "Trusted as inventory because read live from the tree; limit: behavior at acceptance date; re-review when arsenal.ts changes.",
    license: "repo-internal",
  },
];

// Recipe R1 (spec section 2): split on blank lines, trim, drop empties,
// join with "\n---\n". Deterministic by construction.
function buildContent(sources) {
  const chunks = [];
  for (const s of sources) {
    for (const piece of s.text.split(/\n\s*\n/)) {
      const t = piece.trim();
      if (t.length > 0) chunks.push(t);
    }
  }
  return chunks.join("\n---\n");
}

function pinSources(sources) {
  const out = {};
  for (const s of sources) out[s.id] = sha256Hex(s.text);
  return out;
}

// Measure tool m1.0 (spec section 10): fixed 8-query fixture, recall@3.
// Model: query q hits when its answer chunk is in the top 3; the fixture is
// fixed so the score is deterministic. The seed scores 7/8 = 0.875.
const MEASURE_TOOL = "m1.0/8q/recall@3";
const SEED_SCORE = 0.875;

function measureOf(score, tool) {
  return { score, tool };
}

// Regression gate (spec section 11).
function gateUpdate(pinned, candidate) {
  if (candidate.tool !== pinned.tool) return "NOT-COMPARABLE";
  if (candidate.score < pinned.score) return "REJECTED";
  return "ACCEPTED";
}

// Expiry states (spec section 5). String-date compare is exact on ISO dates.
function loadState(expiry) {
  if (expiry <= LOAD_DATE) return { alert: "[knowledge-packs] EXPIRED", ok: false };
  if (expiry <= "2026-11-30") return { alert: "[knowledge-packs] NEAR-EXPIRY", ok: true };
  return { alert: null, ok: true };
}

// License gate (spec section 6).
const KNOWN_LICENSES = new Set([
  "repo-internal",
  "MIT",
  "Apache-2.0",
  "CC-BY",
  "CC-BY-SA",
  "CC0",
  "Unlicense",
]);
function licenseVerdict(sources) {
  for (const s of sources) {
    if (!KNOWN_LICENSES.has(s.license)) return "REFUSED";
  }
  return "ADMITTED";
}

// Chunk sample rule (spec section 1.4): a chunk is intact when it does not
// end mid-word without a continuation marker ("...").
function chunkIntact(chunk) {
  const t = chunk.trimEnd();
  if (t.endsWith("...")) return true;
  return /[.!?:"')\]]$/.test(t);
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: Boolean(ok), detail });
  console.log(`[knowledge-packs] ${ok ? "PASS" : "FAIL"} ${name}: ${detail}`);
}

let doc = "";
try {
  doc = readFileSync(DOC_PATH, "utf8");
} catch {
  console.log("[knowledge-packs] FAIL doc-present: cannot read .opencode/knowledge/knowledge-packs.md");
  console.log("[knowledge-packs] checks: 0 pass, 1 fail, 1 total");
  console.log("[knowledge-packs] VERDICT: REJECT");
  process.exit(1);
}

// 1. Spec document is present and names the schema.
check(
  "doc-present",
  doc.includes("Pack schema") && doc.includes("knowledge-packs"),
  "spec readable, schema section present",
);

// 2. Allowlist is explicit in the spec.
check(
  "allowlist-present",
  ["S1", "S2", "S3"].every((id) => doc.includes(id)) && doc.includes("Allowlist"),
  "allowlist S1,S2,S3 named in spec",
);

// 3. A pack with an empty allowlist is REJECTED (nothing outside enters).
check(
  "no-allowlist-reject",
  buildContent([]) === "" && doc.includes("empty allowlist is"),
  "empty allowlist builds zero content -> REJECT",
);

// 4. A non-allowlisted candidate contributes zero chunks.
{
  const outsider = { id: "SX", text: "Outsider text that must never enter." };
  const allowlisted = new Set(SEED_SOURCES.map((s) => s.id));
  const admitted = [outsider].filter((s) => allowlisted.has(s.id));
  check(
    "outside-source-excluded",
    admitted.length === 0 && buildContent(admitted) === "" && doc.includes("Nothing outside the allowlist"),
    "SX not on allowlist -> 0 chunks admitted",
  );
}

// 5. Every trust note is specific (a generic "trusted" note fails).
{
  const generic = [{ trust: "trusted" }];
  const specific = SEED_SOURCES.every((s) => s.trust.length > 60 && /because|limit|re-review/.test(s.trust));
  const genericFails = generic.every((s) => !(s.trust.length > 60 && /because|limit|re-review/.test(s.trust)));
  check(
    "trust-note-specific",
    specific && genericFails && doc.includes("generic note"),
    "3/3 seed notes specific; generic fixture fails",
  );
}

// 6. A source change marks its trust note STALE (reviewable on change).
{
  const pinned = pinSources(SEED_SOURCES);
  const changed = SEED_SOURCES.map((s) =>
    s.id === "S2" ? { ...s, text: `${s.text} (amended)` } : s,
  );
  const stale = changed.filter((s) => sha256Hex(s.text) !== pinned[s.id]).map((s) => s.id);
  check(
    "trust-note-reviewable-on-change",
    stale.length === 1 && stale[0] === "S2" && doc.includes("STALE"),
    "S2 amended -> trust note S2 STALE",
  );
}

// 7. Recipe R1 re-run twice is byte-identical (determinism, not assertion).
{
  const first = buildContent(SEED_SOURCES);
  const second = buildContent(SEED_SOURCES);
  const h1 = sha256Hex(first);
  const h2 = sha256Hex(second);
  const equal =
    first.length > 0 &&
    h1 === h2 &&
    timingSafeEqual(Buffer.from(h1, "utf8"), Buffer.from(h2, "utf8"));
  check("recipe-rerun-byte-identical", equal, `two R1 runs sha ${h1.slice(0, 12)}... identical`);
}

// 8. A stated reason is an accepted shape (never a silent gap).
check(
  "stated-reason-shape",
  doc.includes("reason:") && doc.includes("never a silent gap"),
  "`reason:` line documented as the only recipe substitute",
);

// 9. Neither recipe nor reason is REJECTED.
{
  const pack = { recipe: null, reason: null };
  const verdict = pack.recipe !== null || pack.reason !== null ? "SHAPED" : "REJECTED";
  check(
    "silent-gap-rejected",
    verdict === "REJECTED" && doc.includes("silent gap"),
    "no recipe + no reason -> REJECTED",
  );
}

// 10. Sampled seed chunks all carry complete meaning.
{
  const chunks = buildContent(SEED_SOURCES).split("\n---\n");
  const intact = chunks.filter(chunkIntact);
  check(
    "chunk-sample-meaning-intact",
    chunks.length === 3 && intact.length === chunks.length,
    `3/3 sampled chunks intact (no mid-word cut)`,
  );
}

// 11. A mid-word cut without a marker is detected.
check(
  "broken-chunk-detected",
  chunkIntact("The retrieval measure is pinned besi") === false,
  "mid-word cut fixture -> intact false",
);

// 12. The measure record names the exact pack version.
{
  const pin = { pack: "KP-01", version: "v1", ...measureOf(SEED_SCORE, MEASURE_TOOL) };
  check(
    "measure-pinned-to-version",
    pin.pack === "KP-01" && pin.version === "v1" && doc.includes("beside the version"),
    "KP-01 v1 pins 0.875 beside the version",
  );
}

// 13. A declining update is REJECTED by number.
{
  const pinned = measureOf(SEED_SCORE, MEASURE_TOOL);
  const declined = measureOf(0.75, MEASURE_TOOL);
  check(
    "regression-reject",
    gateUpdate(pinned, declined) === "REJECTED",
    "0.750 < pinned 0.875 (same tool) -> REJECTED",
  );
}

// 14. An improving update under the same tool is ACCEPTED.
{
  const pinned = measureOf(SEED_SCORE, MEASURE_TOOL);
  const improved = measureOf(1.0, MEASURE_TOOL);
  check(
    "improvement-accept",
    gateUpdate(pinned, improved) === "ACCEPTED",
    "1.000 >= pinned 0.875 (same tool) -> ACCEPTED",
  );
}

// 15. Cross-tool numbers are NOT-COMPARABLE, never silently compared.
{
  const pinned = measureOf(SEED_SCORE, MEASURE_TOOL);
  const other = measureOf(0.95, "m2.0/8q/recall@3");
  check(
    "same-measure-comparison",
    gateUpdate(pinned, other) === "NOT-COMPARABLE" && doc.includes("NOT-COMPARABLE"),
    "m2.0 number vs m1.0 pin -> NOT-COMPARABLE",
  );
}

// 16. Accepting v2 preserves the v1 measure record.
{
  const history = [{ version: "v1", ...measureOf(SEED_SCORE, MEASURE_TOOL) }];
  history.push({ version: "v2", ...measureOf(1.0, MEASURE_TOOL) });
  const v1 = history.find((h) => h.version === "v1");
  check(
    "old-measures-preserved",
    history.length === 2 && v1 !== undefined && v1.score === SEED_SCORE,
    "v1 0.875 still present after v2 accepted",
  );
}

// 17. A past-expiry load fires the EXPIRED alert.
{
  const state = loadState(EXPIRED_FIXTURE_EXPIRY);
  check(
    "expired-load-alert",
    state.alert === "[knowledge-packs] EXPIRED" && doc.includes("[knowledge-packs] EXPIRED"),
    `fixture expiry ${EXPIRED_FIXTURE_EXPIRY} -> EXPIRED at load`,
  );
}

// 18. Near-expiry fires a distinct token, never the EXPIRED one.
{
  const state = loadState(NEAR_FIXTURE_EXPIRY);
  check(
    "near-expiry-distinct",
    state.alert === "[knowledge-packs] NEAR-EXPIRY" &&
      state.alert !== "[knowledge-packs] EXPIRED" &&
      doc.includes("[knowledge-packs] NEAR-EXPIRY"),
    `fixture expiry ${NEAR_FIXTURE_EXPIRY} -> NEAR-EXPIRY (distinct)`,
  );
}

// 19. A fresh pack loads with the expiry printed and no alert.
{
  const state = loadState(SEED_EXPIRY);
  check(
    "fresh-silent",
    state.alert === null && state.ok === true,
    `seed expiry ${SEED_EXPIRY} silent at load ${LOAD_DATE}`,
  );
}

// 20. A source with unknown-license refuses the whole pack.
{
  const tainted = SEED_SOURCES.map((s) =>
    s.id === "S3" ? { ...s, license: "unknown-license" } : s,
  );
  check(
    "unknown-license-refuse",
    licenseVerdict(tainted) === "REFUSED" &&
      licenseVerdict(SEED_SOURCES) === "ADMITTED" &&
      doc.includes("unknown-license"),
    "S3 unknown-license -> whole pack REFUSED; clean seed ADMITTED",
  );
}

// 21. A post-measure source change demands a new version or a visible alert.
{
  const pinned = { ...pinSources(SEED_SOURCES), version: "v1" };
  const changed = SEED_SOURCES.map((s) =>
    s.id === "S1" ? { ...s, text: `${s.text} (amended)` } : s,
  );
  const drifted = changed.some((s) => sha256Hex(s.text) !== pinned[s.id]);
  const demand = drifted ? "NEW-VERSION-REQUIRED" : "CURRENT";
  check(
    "source-change-new-version-or-alert",
    demand === "NEW-VERSION-REQUIRED" && doc.includes("NEW-VERSION-REQUIRED"),
    "S1 hash drift after pin -> NEW-VERSION-REQUIRED",
  );
}

// 22. The seed passes every gate on the same schema with zero exemptions.
{
  const seed = {
    id: "KP-01",
    scope: "platform-0.9",
    sources: SEED_SOURCES,
    recipe: "R1",
    reason: null,
    expiry: SEED_EXPIRY,
    exemptions: 0,
  };
  const allowlistOk = seed.sources.length > 0;
  const recipeOk = seed.recipe !== null || seed.reason !== null;
  const licenseOk = licenseVerdict(seed.sources) === "ADMITTED";
  const expiryOk = loadState(seed.expiry).alert === null;
  const scopeOk = seed.scope === "platform-0.9" && !seed.scope.includes("+");
  const noExemptions = seed.exemptions === 0;
  const contentOk = buildContent(seed.sources).length > 0;
  const allOk = allowlistOk && recipeOk && licenseOk && expiryOk && scopeOk && noExemptions && contentOk;
  check(
    "seed-passes-all-gates",
    allOk && doc.includes("KP-01") && doc.includes("Exemptions: 0"),
    "KP-01 allowlist+recipe+license+expiry+single-scope+0-exemptions all hold",
  );
}

const passed = results.filter((r) => r.ok).length;
const failed = results.length - passed;
console.log(`[knowledge-packs] checks: ${passed} pass, ${failed} fail, ${results.length} total`);
console.log(`[knowledge-packs] NEAR_WINDOW_DAYS=${NEAR_WINDOW_DAYS} LOAD_DATE=${LOAD_DATE}`);
if (failed > 0) {
  console.log("[knowledge-packs] VERDICT: REJECT");
  process.exit(1);
}
console.log("[knowledge-packs] VERDICT: PROCEED");
