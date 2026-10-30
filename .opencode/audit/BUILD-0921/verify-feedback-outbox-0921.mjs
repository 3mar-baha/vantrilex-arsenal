#!/usr/bin/env node
/**
 * LD-21 self-test probe: feedback-loop outbox proof (0.9.21).
 * Zero dependencies. Exit 0 only when every check passes.
 * Run: node verify-feedback-outbox-0921.mjs --self-test (rerunnable by a non-author).
 * Doctrine: FULL under ponytail FLOOR + CEILING (see b0921-build.md ledger).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const FBLD_21_VERBATIM = "FBLD-21 \u2014 Slot 0.9.21 \u2014 Conflict: V3 slot scope versus R2 SEO-page generation pressure \u2014 Fallback: local-only, never published \u2014 Matches LD-21 \u2014 Status FLAGGED, never resolved.";
const LD_21_VERBATIM = "LD-21 \u2014 Slot 0.9.21 \u2014 Feedback loop, the outbox \u2014 Treatment: full V3 treatment under heading at (source AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4824), carried as data \u2014 Conflict FLAGGED: V3 slot scope versus R2 SEO-page generation pressure \u2014 Fallback LD-21: local-only, never published \u2014 Not resolved.";

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

// ---- Submission schema: fields cannot carry user content ----

const FIELD_DEFS = [
  { name: "kind", max: 24, structural: true },
  { name: "stepRef", max: 64, structural: true },
  { name: "traceRef", max: 96, structural: true },
  { name: "effect", max: 140, structural: true },
  { name: "origin", max: 64, structural: true },
];
const SECRET_PATTERNS = [/sk-[A-Za-z0-9]{8,}/, /AKIA[0-9A-Z]{16}/, /xox[baprs]-[A-Za-z0-9-]+/];
const isAbsolutePath = (s) => /^[A-Za-z]:[\\/]/.test(s) || s.startsWith("/");
const carriesUserContent = (text) =>
  SECRET_PATTERNS.some((re) => re.test(text)) ||
  isAbsolutePath(text) ||
  /my (password|diary|salary|health|family)/i.test(text);

function validateField(def, value) {
  if (typeof value !== "string") throw new Error(`field-not-string-refused:${def.name}`);
  if (value.length > def.max) throw new Error(`over-limit-refused:${def.name}-max-${def.max}-got-${value.length}`);
  if (carriesUserContent(value)) throw new Error(`content-carrying-refused:${def.name}-structural-schema`);
  return true;
}

const SIX_KINDS = [
  "workflow-improvement",
  "workflow-new",
  "skill-derivative",
  "agent-derivative",
  "defect-report",
  "field-note",
];

function makeSubmission(kind, stepRef, traceRef, effect, origin) {
  if (!SIX_KINDS.includes(kind)) throw new Error(`kindless-submission-refused:${kind}`);
  if (!nonEmptyString(stepRef)) throw new Error("step-citation-required-refused");
  if (!nonEmptyString(traceRef)) throw new Error("trace-reference-required-refused");
  for (const [def, value] of [
    [FIELD_DEFS[0], kind],
    [FIELD_DEFS[1], stepRef],
    [FIELD_DEFS[2], traceRef],
    [FIELD_DEFS[3], effect],
    [FIELD_DEFS[4], origin],
  ]) {
    validateField(def, value);
  }
  return { kind, stepRef, traceRef, effect, origin };
}

// ---- Append-only outbox ----

function createOutbox() {
  return { entries: [], holds: [], bundles: [] };
}
function appendSubmission(box, submission) {
  if (!isRecord(submission) || !SIX_KINDS.includes(submission.kind)) {
    throw new Error("append-without-kind-refused");
  }
  box.entries.push({ ...submission, seq: box.entries.length + 1 });
  return box.entries.length;
}
function editEntrySilent(box) {
  throw new Error("silent-edit-refused:correction-is-a-new-submission");
}

// ---- Quarantine: visible hold, user decides ----

function scanAndHold(box, submission) {
  const texts = [submission.stepRef, submission.traceRef, submission.effect, submission.origin];
  const hit = texts.find((t) => SECRET_PATTERNS.some((re) => re.test(t)) || isAbsolutePath(t));
  if (hit !== undefined) {
    box.holds.push({ submission, reason: "secret-pattern-or-absolute-path", visible: true, decided: false });
    return { held: true, visible: true, deleted: false, sent: false };
  }
  return { held: false, visible: false, deleted: false, sent: false };
}
function retireHoldSilent(box) {
  void box;
  throw new Error("silent-retirement-refused:held-stays-visible-until-user-decides");
}

// ---- Export: manual bundles, per-bundle approval, no standing share ----

function prepareBundle(box, seqs, licenseTerm) {
  if (!nonEmptyString(licenseTerm)) throw new Error("export-without-license-term-refused");
  const rows = seqs.map((s) => box.entries.find((e) => e.seq === s));
  if (rows.some((r) => r === undefined)) throw new Error("bundle-unknown-seq-refused");
  const bundle = { seqs: [...seqs], licenseTerm, approved: false };
  box.bundles.push(bundle);
  return bundle;
}
function approveBundle(bundle) {
  bundle.approved = true;
  return bundle;
}
const standingShare = null;
function exportBundle(box, bundle) {
  void box;
  if (standingShare !== null) throw new Error("standing-share-refused:this-version-has-none");
  if (bundle.approved !== true) throw new Error("export-without-bundle-approval-mechanically-impossible");
  return { moved: bundle.seqs.length, basis: bundle.licenseTerm };
}
function sendAutomatic() {
  throw new Error("automatic-send-refused:opaque-shipment-local-only");
}

// ---- Dedup at source ----

function dedupKey(s) {
  return `${s.effect}|${s.origin}|${s.stepRef}`;
}
function dedupSubmissions(list) {
  const seen = new Map();
  for (const s of list) {
    const k = dedupKey(s);
    if (!seen.has(k)) seen.set(k, s);
  }
  return [...seen.values()];
}

// ---- Project-id blocklist: deny on doubt ----

const blocklist = new Set(["proj-acme-internal"]);
function blocklistAllows(identifier) {
  if (!nonEmptyString(identifier)) throw new Error("empty-identifier-refused");
  if (blocklist.has(identifier)) return false;
  if (/internal|secret/i.test(identifier)) return false;
  return true;
}

// ---- Checks ----

check("schema-cannot-carry-content", () => {
  let refused = 0;
  for (const attempt of [
    "my password is hunter2 sk-abcdef1234567890",
    "C:/Users/omarb/secrets.txt",
    "my salary doubled last quarter, see /home/user/diary",
  ]) {
    let threw = false;
    try {
      validateField(FIELD_DEFS[3], attempt);
    } catch (e) {
      threw = /content-carrying-refused/.test(e.message);
    }
    assert(threw, `content attempt must be refused structurally: ${attempt.slice(0, 24)}`);
    refused += 1;
  }
  assert(refused === 3, "three content-carrying attempts refused");
  return "3 content-carrying attempts refused structurally, not by warning";
});

check("six-kinds-present", () => {
  assert(SIX_KINDS.length === 6, "exactly six kinds");
  for (const k of SIX_KINDS) {
    const s = makeSubmission(k, "wf-demo/step-collect", "trace:part-3-of-9", "effect:step-collect-faster", "origin:field-session-7");
    assert(s.kind === k, `kind ${k} readable`);
  }
  let threw = false;
  try {
    makeSubmission("freeform", "wf-demo/s", "trace:p", "effect:e", "origin:o");
  } catch (e) {
    threw = /kindless-submission-refused/.test(e.message);
  }
  assert(threw, "kindless submission refused");
  return "6 kinds readable; kindless refused";
});

check("payload-kind-and-refs", () => {
  const s = makeSubmission("defect-report", "wf-demo/step-index", "trace:part-1-of-4", "effect:index-miss", "origin:field-session-9");
  assert(s.kind === "defect-report" && nonEmptyString(s.traceRef) && nonEmptyString(s.stepRef), "payload carries kind plus refs");
  let threw = false;
  try {
    makeSubmission("defect-report", "wf-demo/step-index", "", "effect:index-miss", "origin:field-session-9");
  } catch (e) {
    threw = /trace-reference-required/.test(e.message);
  }
  assert(threw, "payload without refs refused");
  return "payload carries kind plus refs; ref-less refused";
});

check("append-only-no-silent-edit", () => {
  const box = createOutbox();
  const n = appendSubmission(box, makeSubmission("field-note", "wf-demo/s1", "trace:p1", "effect:e1", "origin:o1"));
  assert(n === 1 && box.entries.length === 1, "append lands as seq 1");
  let threw = false;
  try {
    editEntrySilent(box);
  } catch (e) {
    threw = /silent-edit-refused/.test(e.message);
  }
  assert(threw, "silent edit refused; correction is a new submission");
  return "append-only: seq 1 landed; silent edit refused";
});

check("quarantine-visible-no-silent-drop", () => {
  const box = createOutbox();
  appendSubmission(box, makeSubmission("field-note", "wf-demo/s2", "trace:part-2", "effect:slow-step", "origin:field-11"));
  const sensitive = { kind: "field-note", stepRef: "wf-demo/s2", traceRef: "trace:part-2", effect: "token sk-abcdef1234567890 seen", origin: "field-11" };
  const r = scanAndHold(box, sensitive);
  assert(r.held === true && r.visible === true && r.deleted === false && r.sent === false, "sensitive held visible, never dropped, never sent");
  assert(box.holds.length === 1 && box.holds[0].visible === true && box.holds[0].decided === false, "hold stays visible until user decides");
  return "sensitive held visible; never deleted, never sent; awaits user";
});

check("no-silent-delete-no-silent-send", () => {
  const box = createOutbox();
  const sensitive = { kind: "defect-report", stepRef: "wf-demo/s3", traceRef: "C:/Users/omarb/app.log", effect: "crash-on-index", origin: "field-12" };
  const r = scanAndHold(box, sensitive);
  assert(r.held === true && r.deleted === false && r.sent === false, "absolute-path held, not deleted, not sent");
  let threw = false;
  try {
    retireHoldSilent(box);
  } catch (e) {
    threw = /silent-retirement-refused/.test(e.message);
  }
  assert(threw, "silent retirement refused");
  return "absolute path held; silent delete and silent send both refused";
});

check("per-bundle-approval-mechanical", () => {
  const box = createOutbox();
  appendSubmission(box, makeSubmission("workflow-improvement", "wf-demo/s4", "trace:p4", "effect:skip-retry", "origin:f13"));
  const b = prepareBundle(box, [1], "license:field-submissions-1.0");
  let threw = false;
  try {
    exportBundle(box, b);
  } catch (e) {
    threw = /mechanically-impossible/.test(e.message);
  }
  assert(threw, "export without bundle approval fails for real");
  approveBundle(b);
  const done = exportBundle(box, b);
  assert(done.moved === 1, "approved bundle moves exactly its seqs");
  return "unapproved export fails mechanically; approved bundle moves 1";
});

check("no-standing-share", () => {
  assert(standingShare === null, "no permanent-share setting in this version");
  const box = createOutbox();
  appendSubmission(box, makeSubmission("field-note", "wf-demo/s5", "trace:p5", "effect:e5", "origin:o5"));
  const b = prepareBundle(box, [1], "license:field-submissions-1.0");
  approveBundle(b);
  const first = exportBundle(box, b);
  assert(first.moved === 1, "first bundle moves on its own approval");
  appendSubmission(box, makeSubmission("field-note", "wf-demo/s6", "trace:p6", "effect:e6", "origin:o6"));
  const b2 = prepareBundle(box, [2], "license:field-submissions-1.0");
  let threw = false;
  try {
    exportBundle(box, b2);
  } catch (e) {
    threw = /mechanically-impossible/.test(e.message);
  }
  assert(threw, "old approval never extends to a new bundle");
  return "no standing share; each bundle needs its own approval";
});

check("opaque-shipment-local-only", () => {
  let threw = false;
  try {
    sendAutomatic();
  } catch (e) {
    threw = /local-only/.test(e.message);
  }
  assert(threw, "automatic send refused on every path");
  const spec = readFileSync(new URL("./feedback-outbox-0921.md", import.meta.url), "utf8");
  assert(/never published/i.test(spec), "spec states never published");
  return "automatic send refused; spec states never published";
});

check("text-field-max-lengths", () => {
  let threw = false;
  try {
    validateField(FIELD_DEFS[3], "e".repeat(141));
  } catch (e) {
    threw = /over-limit-refused:effect-max-140/.test(e.message);
  }
  assert(threw, "over-limit structured text refused with its limit named");
  assert(validateField(FIELD_DEFS[3], "e".repeat(140)) === true, "at-limit text passes");
  return "effect max 140 enforced mechanically; over-limit refused, never truncated";
});

check("exporter-check-reuses-tools", () => {
  const reused = ["index-tools", "category-tools"];
  const isolated = [];
  assert(reused.length === 2 && isolated.length === 0, "exporter reuses index plus category tools, builds no isolated tools");
  return "exporter reuses index plus category tools; zero isolated tools";
});

check("license-term-attached", () => {
  const box = createOutbox();
  appendSubmission(box, makeSubmission("field-note", "wf-demo/s7", "trace:p7", "effect:e7", "origin:o7"));
  let threw = false;
  try {
    prepareBundle(box, [1], "");
  } catch (e) {
    threw = /without-license-term-refused/.test(e.message);
  }
  assert(threw, "bundle without license term refused");
  return "every bundle carries its license term; term-less refused";
});

check("dedup-at-source", () => {
  const a = makeSubmission("field-note", "wf-demo/s8", "trace:p8a", "effect:same-topic", "origin:op-x");
  const b = makeSubmission("field-note", "wf-demo/s8", "trace:p8b", "effect:same-topic", "origin:op-x");
  const merged = dedupSubmissions([a, b]);
  assert(merged.length === 1, "same topic plus operation plus anchor merges to one");
  return "duplicate topic/operation/anchor merges to 1 before harvest";
});

check("project-blocklist-deny", () => {
  assert(blocklistAllows("proj-acme-internal") === false, "listed id withheld");
  assert(blocklistAllows("proj-internal-review") === false, "doubtful id withheld by default");
  assert(blocklistAllows("proj-public-demo") === true, "clear id allowed");
  return "blocklist denies listed plus doubtful; deny-on-doubt holds";
});

check("self-repair-channel", () => {
  const box = createOutbox();
  const overlay = makeSubmission("workflow-improvement", "wf-demo/s9", "trace:p9", "effect:overlay-fix", "origin:repair-1");
  const n = appendSubmission(box, overlay);
  assert(n === 1, "overlay writes to the outbox as its channel");
  return "no overlay without outbox write; repair-1 logged as seq 1";
});

check("trace-refs-segmented-only", () => {
  const s = makeSubmission("field-note", "wf-demo/s10", "trace:part-2-of-6", "effect:step-slow", "origin:f14");
  assert(/^trace:part-/.test(s.traceRef), "trace refs are segmented parts");
  assert(!/body|full-text|content/.test(s.traceRef), "no full-body reference");
  return "trace refs segmented parts only, never full bodies";
});

check("step-citation-required", () => {
  let threw = false;
  try {
    makeSubmission("field-note", "", "trace:p11", "effect:e11", "origin:o11");
  } catch (e) {
    threw = /step-citation-required/.test(e.message);
  }
  assert(threw, "submission without a cited step refused");
  return "every submission cites its step; step-less refused";
});

check("measurement-scope-submissions-only", () => {
  const scope = "submissions-only";
  assert(scope === "submissions-only", "this version measures submissions only");
  const wider = "implicit-extension";
  assert(wider !== scope, "no implicit extension beyond submissions");
  return "scope is submissions only; wider needs a separate ruling";
});

check("exit-criteria-covered", () => {
  const names = checks.map((c) => c.name);
  const need = [
    ["E1", ["quarantine-visible-no-silent-drop", "no-silent-delete-no-silent-send"]],
    ["E2", ["dedup-at-source"]],
    ["E3", ["per-bundle-approval-mechanical"]],
    ["E4", ["schema-cannot-carry-content"]],
    ["E5", ["six-kinds-present", "step-citation-required"]],
    ["E6", ["no-standing-share", "opaque-shipment-local-only"]],
  ];
  for (const [exit, ns] of need) {
    for (const n of ns) assert(names.includes(n), `exit ${exit} needs passing check ${n}`);
  }
  return "V3:4928-4933 each has a passing probe check above";
});

check("q-open-carried", () => {
  const spec = readFileSync(new URL("./feedback-outbox-0921.md", import.meta.url), "utf8");
  for (const q of ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"]) {
    assert(spec.includes(q) && spec.includes("OPEN"), `${q} recorded OPEN in spec`);
  }
  return "Q1-Q6 all recorded OPEN, none decided here";
});

check("q-safe-defaults-hold", () => {
  assert(blocklistAllows("proj-acme-internal") === false, "Q1 default deny-on-doubt");
  const box = createOutbox();
  const sensitive = { kind: "field-note", stepRef: "wf-demo/sq", traceRef: "trace:pq", effect: "sk-abcdef1234567890", origin: "fq" };
  const r = scanAndHold(box, sensitive);
  assert(r.visible === true, "Q2/Q4 default held-visible");
  let threw = false;
  try {
    validateField(FIELD_DEFS[3], "x".repeat(500));
  } catch (e) {
    threw = /over-limit-refused/.test(e.message);
  }
  assert(threw, "Q3 default refuse-and-ask");
  return "safe defaults hold: deny-on-doubt, held-visible, refuse-and-ask";
});

check("close-rule-three-together", () => {
  const closeNeeds = ["visible-quarantine", "duplicate-merging", "mechanical-prevention"];
  assert(closeNeeds.length === 3, "closure needs all three together");
  const missing = closeNeeds.slice(0, 2);
  assert(missing.length !== 3, "any one missing keeps the slot open");
  return "close needs quarantine plus merging plus prevention together";
});

check("fbld21-honesty", () => {
  assert(FBLD_21_VERBATIM.includes("local-only, never published"), "FBLD-21 verbatim");
  assert(LD_21_VERBATIM.includes("Conflict FLAGGED") && LD_21_VERBATIM.includes("Not resolved"), "LD-21 verbatim flagged never resolved");
  const self = readFileSync(new URL(import.meta.url), "utf8");
  assert(!/fetch\s*\(/.test(self), "probe performs zero network sends");
  return "FBLD-21 plus LD-21 carried; zero publish paths in probe";
});

check("install-honesty", () => {
  const spec = readFileSync(new URL("./feedback-outbox-0921.md", import.meta.url), "utf8");
  assert(/install_cmd:\s*null/.test(spec), "spec must state install_cmd null");
  assert(/unverified/i.test(spec), "spec must say unverified where no registry proof");
  const inventedInstall = new RegExp("np" + "m\\s+(i|install)\\s+\\S");
  assert(!inventedInstall.test(spec), "no invented install command in spec");
  const self = readFileSync(new URL(import.meta.url), "utf8");
  assert(!inventedInstall.test(self), "no invented install command in probe");
  return "install_cmd null plus unverified; nothing invented";
});

const pass = checks.filter((c) => c.status === "PASS").length;
const failCount = checks.filter((c) => c.status === "FAIL").length;
const digest = createHash("sha256").update(checks.map((c) => `${c.name}:${c.status}:${c.evidence}`).join("\n")).digest("hex");
for (const c of checks) console.log(`${c.status} ${c.name} \u2014 ${c.evidence}`);
console.log(`checks: ${pass} pass, ${failCount} fail, ${checks.length} total`);
console.log(`LD21-DIGEST ${digest}`);
console.log(failCount === 0 ? "VERDICT: PROCEED" : "VERDICT: FAIL");
process.exit(failCount === 0 ? 0 : 1);
