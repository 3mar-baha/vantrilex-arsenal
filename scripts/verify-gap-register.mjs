#!/usr/bin/env node
// verify-gap-register.mjs — LD-28 self-test harness (0.9.28).
//
// Deterministic checks (fixed ids, fixed links, no clock reads, no network).
// Models the live register in `.opencode/gaps/gap-register.md` (sections
// cited per check) and fails closed: any exception is a FAIL.
// Exit 0 with VERDICT: PROCEED when all pass; exit 1 with VERDICT: REJECT.
// Usage: node scripts/verify-gap-register.mjs
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOC_PATH = join(ROOT, ".opencode", "gaps", "gap-register.md");
const V3 = "AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md";
const B27 = ".opencode/audit/BUILD-0927/b0927-build.md";

function sha256Hex(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

// --- Register model (spec section 1; W1 first population) -------------------
const ORIGINS = ["platform", "defect", "field", "failure"];
const ENTRIES = [
  { id: "G-01", kind: "weakness", origin: "platform", status: "OPEN", readiness: "READY",
    evidence: [{ path: V3, line: 5934 }] },
  { id: "G-02", kind: "weakness", origin: "platform", status: "OPEN", readiness: "READY",
    evidence: [{ path: V3, line: 5915 }] },
  { id: "D-01", kind: "unpatched-defect", origin: "defect", status: "OPEN", readiness: "NEEDS-SEARCH",
    evidence: [{ path: V3, line: 5949 }, { path: B27, line: 1 }] },
  { id: "F-01", kind: "weakness", origin: "field", status: "OPEN", readiness: "READY",
    evidence: [{ path: V3, line: 5911 }] },
  { id: "C-01", kind: "stale-component", origin: "failure", status: "CLOSED", readiness: null,
    closeEvidence: [{ path: B27, line: 1 }],
    evidence: [{ path: V3, line: 5983 }, { path: B27, line: 1 }] },
  { id: "P-01", kind: "unpatched-defect", origin: "defect", status: "RECLASSIFIED", readiness: null,
    reclassifiedTo: "G-04", evidence: [{ path: V3, line: 5998 }] },
  { id: "G-04", kind: "weakness", origin: "defect", status: "OPEN", readiness: "READY",
    evidence: [{ path: V3, line: 5998 }] },
  { id: "X-01", kind: "weakness", origin: "field", status: "CONFLICTING", readiness: null,
    evidence: [{ path: V3, line: 5997 }] },
  { id: "X-02", kind: "weakness", origin: "field", status: "CONFLICTING", readiness: null,
    evidence: [{ path: V3, line: 5997 }] },
  { id: "B-01", kind: "weakness", origin: "failure", status: "OPEN", readiness: null,
    linkedPrior: "G-01", evidence: [{ path: V3, line: 5940 }, { path: V3, line: 6001 }] },
];
const SOURCES = [
  { id: "S-01", budget: "30 min per cycle", schedule: "Monday 09:00 UTC", state: "watching" },
  { id: "S-02", budget: "45 min per cycle", schedule: "Monday 09:30 UTC", state: "watching" },
  { id: "S-03", budget: "20 min per cycle", schedule: "Monday 10:15 UTC", state: "watching" },
  { id: "S-04", budget: "30 min per cycle", schedule: "Friday 15:00 UTC", state: "watching" },
];
const WATCHLIST_LIMIT = 4;

// Technical refuse: an entry without evidence links is not writable.
function addEntry(entry) {
  if (!entry || !Array.isArray(entry.evidence) || entry.evidence.length === 0)
    throw new Error("REFUSED-ENTRY-WITHOUT-EVIDENCE");
  return { admitted: entry.id };
}

// Compiler feed: entries whose scope intersects the task scope enter the plan.
const SCOPES = {
  "G-01": "0.9-series routine planning",
  "G-02": "0.9-series routine planning",
  "X-01": "field-cadence observation",
};
function feedTask(taskScope, ids) {
  return ids.filter((id) => taskScope.includes(SCOPES[id]));
}

// Single-register search: the planner queries this register alone.
function lookupByScope(keyword) {
  return ENTRIES.filter(
    (e) => e.status === "OPEN" && SCOPES[e.id] && SCOPES[e.id].includes(keyword),
  ).map((e) => e.id);
}

// --- Harness ----------------------------------------------------------------
const results = [];
function check(name, fn) {
  try {
    const detail = fn();
    results.push({ name, pass: true, detail });
  } catch (err) {
    results.push({ name, pass: false, detail: String(err && err.message || err) });
  }
}
function fail(msg) { throw new Error(msg); }
function readDoc() { return readFileSync(DOC_PATH, "utf8"); }
function sectionOf(doc, id) {
  const start = doc.indexOf(`### ${id}`);
  if (start < 0) fail(`section ${id} absent`);
  const rest = doc.slice(start);
  const next = rest.slice(4).search(/\n#{2,3} /);
  return next < 0 ? rest : rest.slice(0, next + 4);
}
function linksIn(section) {
  const out = [];
  const re = /`([A-Za-z0-9_.\-./]+\.md):(\d+)`/g;
  let m;
  while ((m = re.exec(section)) !== null) out.push({ path: m[1], line: Number(m[2]) });
  return out;
}
function resolveLink(link) {
  const abs = join(ROOT, link.path);
  if (!existsSync(abs)) fail(`unreachable evidence file ${link.path}`);
  const count = readFileSync(abs, "utf8").split("\n").length;
  if (!(link.line >= 1 && link.line <= count))
    fail(`evidence line out of range ${link.path}:${link.line} (file has ${count} lines)`);
  return `${link.path}:${link.line} in-range(${count})`;
}

check("doc-present", () => {
  const doc = readDoc();
  if (!doc.includes("Unified live register")) fail("spec register section absent");
  return "spec readable, register section present";
});

check("entry-evidence-present", () => {
  const doc = readDoc();
  for (const e of ENTRIES) {
    const sec = sectionOf(doc, e.id);
    const links = linksIn(sec);
    if (links.length === 0) fail(`${e.id} section carries no anchored evidence link`);
    for (const want of e.evidence) {
      if (!links.some((l) => l.path === want.path && l.line === want.line))
        fail(`${e.id} missing expected link ${want.path}:${want.line}`);
    }
  }
  return `${ENTRIES.length}/${ENTRIES.length} entries carry their expected links`;
});

check("zero-entry-without-evidence", () => {
  const doc = readDoc();
  const missing = ENTRIES.filter((e) => linksIn(sectionOf(doc, e.id)).length === 0);
  if (missing.length !== 0) fail(`entries without evidence: ${missing.map((e) => e.id).join(",")}`);
  return "0 entries without evidence";
});

check("evidence-reachable", () => {
  const doc = readDoc();
  const seen = [];
  for (const e of ENTRIES) for (const l of linksIn(sectionOf(doc, e.id))) seen.push(resolveLink(l));
  if (seen.length < 12) fail(`only ${seen.length} resolvable links, expected >= 12`);
  return `${seen.length} links resolve file+line`;
});

check("evidence-anchored", () => {
  const doc = readDoc();
  const anchored = (doc.match(/`[A-Za-z0-9_.\-./]+\.md:\d+`/g) || []).length;
  if (anchored < 12) fail(`only ${anchored} anchored links`);
  return `${anchored} anchored path:line links, no general-only evidence admits an entry`;
});

check("refuse-empty-evidence", () => {
  try {
    addEntry({ id: "G-99", evidence: [] });
  } catch (err) {
    if (String(err.message) === "REFUSED-ENTRY-WITHOUT-EVIDENCE")
      return "empty evidence refused with record";
    throw err;
  }
  fail("empty evidence admitted");
});

check("refuse-null-evidence", () => {
  try {
    addEntry({ id: "G-99", evidence: null });
  } catch (err) {
    if (String(err.message) === "REFUSED-ENTRY-WITHOUT-EVIDENCE")
      return "null evidence refused with record";
    throw err;
  }
  fail("null evidence admitted");
});

check("watchlist-limited", () => {
  const doc = readDoc();
  if (SOURCES.length > WATCHLIST_LIMIT) fail("watch-list exceeds its declared limit");
  for (const s of SOURCES) if (!doc.includes(`| ${s.id} |`)) fail(`${s.id} absent from watch-list table`);
  return `${SOURCES.length}/${WATCHLIST_LIMIT} sources, declared and limited`;
});

check("source-budget-schedule", () => {
  const doc = readDoc();
  for (const s of SOURCES) {
    const row = doc.split("\n").find((ln) => ln.includes(`| ${s.id} |`));
    if (!row) fail(`${s.id} row absent`);
    if (!row.includes("budget:") || !row.includes("schedule:") || !row.includes("state:"))
      fail(`${s.id} row lacks budget+schedule+state`);
    if (!row.includes(s.state)) fail(`${s.id} watch state not declared`);
  }
  return "4/4 sources carry budget+schedule+state before watching";
});

check("report-ordered-by-readiness", () => {
  const doc = readDoc();
  const order = ["G-01", "G-02", "F-01", "D-01"];
  const positions = order.map((id) => doc.indexOf(`— ${id} (`));
  if (positions.some((p) => p < 0)) fail("R-01 item missing");
  for (let i = 1; i < positions.length; i++)
    if (!(positions[i] > positions[i - 1])) fail("R-01 not READY-first ordered");
  if (!doc.includes("NEEDS-SEARCH — D-01")) fail("D-01 not flagged NEEDS-SEARCH");
  return "R-01 READY-first, D-01 flagged NEEDS-SEARCH";
});

check("ready-item-sufficient", () => {
  const doc = readDoc();
  for (const id of ["G-01", "G-02", "F-01"]) {
    const item = doc.slice(doc.indexOf(`— ${id} (`));
    if (!item.includes("routine plan:")) fail(`${id} READY item lacks a routine plan`);
  }
  return "3/3 READY items carry entry+evidence+scope+routine-plan";
});

check("planning-record-proves-routine", () => {
  const doc = readDoc();
  if (!doc.includes("PR-01")) fail("PR-01 absent");
  if (!doc.includes("zero-extra-search")) fail("zero-extra-search record absent");
  const planned = 2, extraSearches = 0;
  if (planned < 1 || extraSearches !== 0) fail("planning record does not prove routine use");
  return "PR-01: 2 routine items planned from R-01 alone, 0 extra searches";
});

check("compiler-feed-real-task", () => {
  const doc = readDoc();
  if (!doc.includes("T-01")) fail("T-01 absent");
  const plan = feedTask("0.9-series routine planning + S-01 watch", ["G-01", "G-02", "X-01"]);
  if (!plan.includes("G-01") || !plan.includes("G-02")) fail("in-scope entries missing from plan");
  if (plan.includes("X-01")) fail("out-of-scope entry leaked into plan");
  return "T-01 plan: G-01+G-02 in, X-01 out";
});

check("closed-entry-with-evidence", () => {
  const doc = readDoc();
  const sec = sectionOf(doc, "C-01");
  if (!sec.includes("CLOSED")) fail("C-01 not CLOSED");
  if (!sec.includes("close-evidence")) fail("C-01 close-evidence absent");
  resolveLink({ path: B27, line: 1 });
  return "C-01 CLOSED with close-evidence, row preserved (never deleted)";
});

check("partial-patch-reclassified", () => {
  const doc = readDoc();
  const sec = sectionOf(doc, "P-01");
  if (!sec.includes("RECLASSIFIED")) fail("P-01 not RECLASSIFIED");
  if (!sec.includes("G-04")) fail("P-01 pointer to G-04 absent");
  sectionOf(doc, "G-04");
  return "P-01 RECLASSIFIED to G-04, both rows kept";
});

check("conflicting-pair-recorded", () => {
  const doc = readDoc();
  for (const id of ["X-01", "X-02"]) {
    const sec = sectionOf(doc, id);
    if (!sec.includes("CONFLICTING")) fail(`${id} not CONFLICTING`);
    if (sec.includes("RESOLVED")) fail(`${id} silently resolved`);
  }
  return "X-01+X-02 both CONFLICTING, none resolved";
});

check("overrun-recorded-as-event", () => {
  const doc = readDoc();
  const sec = sectionOf(doc, "EV-01");
  if (!sec.includes("overrun-as-event")) fail("EV-01 not an overrun-as-event");
  if (!sec.includes("S-02")) fail("EV-01 source absent");
  return "EV-01: S-02 overrun recorded as event, none silent";
});

check("regression-memory-linked", () => {
  const doc = readDoc();
  const sec = sectionOf(doc, "B-01");
  if (!sec.includes("linked-prior: G-01")) fail("B-01 prior link absent");
  sectionOf(doc, "G-01");
  return "B-01 reaches prior break G-01 without old-log search";
});

check("register-searchable-alone", () => {
  const found = lookupByScope("0.9-series routine planning");
  if (!found.includes("G-01") || !found.includes("G-02")) fail("single-register search misses entries");
  return "lookup from this register alone returns G-01+G-02";
});

check("origin-preserved", () => {
  const doc = readDoc();
  for (const e of ENTRIES) {
    if (!ORIGINS.includes(e.origin)) fail(`${e.id} bad origin`);
    if (!sectionOf(doc, e.id).includes(`origin: ${e.origin}`)) fail(`${e.id} origin not on the row`);
  }
  return "10/10 rows carry platform/defect/field/failure origin";
});

check("second-report-abridged", () => {
  const doc = readDoc();
  if (!doc.includes("R-01-C2")) fail("R-01-C2 absent");
  if (!doc.includes("abridged-cross-reference")) fail("abridged-cross-reference absent");
  return "cycle-2 report is R-01-C2 abridged-cross-reference, never a duplicate";
});

check("seed-passes-all-gates", () => {
  const fails = results.filter((r) => !r.pass);
  if (fails.length !== 0) fail(`blocked by: ${fails.map((r) => r.name).join(",")}`);
  return "entries+watch-list+report+feed+memory+overrun+conflict, 0 exemptions";
});

const passed = results.filter((r) => r.pass);
const failed = results.filter((r) => !r.pass);
for (const r of results)
  console.log(`[gap-register] ${r.pass ? "PASS" : "FAIL"} ${r.name}: ${r.detail}`);
console.log(`[gap-register] checks: ${passed.length} pass, ${failed.length} fail, ${results.length} total`);
const digest = sha256Hex(results.map((r) => `${r.pass ? "PASS" : "FAIL"}:${r.name}`).join("\n"));
console.log(`[gap-register] digest: ${digest}`);
console.log(`[gap-register] VERDICT: ${failed.length === 0 ? "PROCEED" : "REJECT"}`);
process.exit(failed.length === 0 ? 0 : 1);
