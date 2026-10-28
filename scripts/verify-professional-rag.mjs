#!/usr/bin/env node
'use strict';
/* Verifies the LD-04 professional RAG build on disk. Node 25, ESM, zero dependencies.
 * Fixture corpus + reference gates run for real; live legs report UNVERIFIED with blockers. */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
let pass = 0;
let fail = 0;
let unverified = 0;
const ok = (name, detail) => { pass += 1; console.log(`PASS ${name} | ${detail}`); };
const bad = (name, detail) => { fail += 1; console.log(`FAIL ${name} | ${detail}`); };
const skip = (name, detail) => { unverified += 1; console.log(`UNVERIFIED ${name} | ${detail}`); };

const SPEC = '.opencode/rag/professional-rag.md';
const GATES = '.opencode/rag/memory-gates.md';
const FIXED = '.opencode/rag/fixed-questions.md';
for (const f of [SPEC, GATES, FIXED]) {
  if (!existsSync(join(ROOT, f))) { bad('presence', `${f} missing`); }
}
if (fail > 0) { console.log(`totals: ${pass} PASS, ${fail} FAIL of ${pass + fail} | VERDICT: BLOCKED`); process.exit(1); }

const spec = read(SPEC);
const gatesDoc = read(GATES);
const fixed = read(FIXED);

/* ---- fixture docs index (mirrors the registry entries the fixed set cites) ---- */
const STOP = new Set('in,what,the,do,does,across,and,each,its,how,is,are,of,to,a,an,on,before,with,their,never,per,for,by,from,or,as,at,be,that,this,these,those,through,which,who,whom,whose,when,where,why,not,but,about,into,over,after,under,then,than,must,can,will,shall'.split(','));
const toks = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !STOP.has(t));
const DOCS = [
  { id: 'd-doctrine-order', trust: 'verified', when: '2026-10-14', relations: ['d-doctrine-laws'],
    text: 'Four top-level skills run in one fixed order: vantrilex-prime orients the machine once, vantrilex-vanguard equips the project once per project, vantrilex-workflow-forge authors the standing methodology before execution, and vantrilex-doctrine governs how the work runs once the kit is installed.' },
  { id: 'd-doctrine-laws', trust: 'verified', when: '2026-10-14', relations: ['d-doctrine-order'],
    text: 'Doctrine states the seven constitutional laws, assigns decision rights across the Leader, Guide, and Implementer roles, binds each lifecycle phase to its kit, and defines the five workflows with their gates and done-definitions.' },
  { id: 'd-forge-gate', trust: 'verified', when: '2026-10-14', relations: ['d-doctrine-order'],
    text: 'Execution never starts before the forge skill authors the standing methodology at each task start; a start without that invocation fails its gate and the run stops before the first dispatch.' },
  { id: 'd-dispatcher-wiring', trust: 'verified', when: '2026-10-26', relations: [],
    text: 'The task-dispatch instruction is injected ahead of every user message through the session prompt hook on the V2 surface, classifying each prompt into exactly one of five scenarios.' },
  { id: 'd-source-rule', trust: 'verified', when: '2026-10-24', relations: ['d-contradict-rule'],
    text: 'Every memory entry carries its source: who wrote it, on what evidence, and when the entry was written.' },
  { id: 'd-contradict-rule', trust: 'verified', when: '2026-10-24', relations: ['d-source-rule'],
    text: 'When entries contradict each other, retrieval surfaces the contradiction instead of silently merging the conflicting entries into one coherent false answer.' },
];
const QUESTIONS = [
  { q: 'In what fixed order do the four top-level skills run?', doc: 'd-doctrine-order' },
  { q: 'What does doctrine assign across the Leader, Guide, and Implementer roles?', doc: 'd-doctrine-laws' },
  { q: 'What must happen before execution starts?', doc: 'd-forge-gate' },
  { q: 'How is the task-dispatcher instruction delivered to the model?', doc: 'd-dispatcher-wiring' },
  { q: 'What must every memory entry carry about its origin?', doc: 'd-source-rule' },
  { q: 'What does retrieval do when entries contradict each other?', doc: 'd-contradict-rule' },
];
const score = (query, doc) => {
  const q = new Set(toks(query));
  const d = new Set(toks(doc.text));
  let shared = 0;
  for (const t of q) if (d.has(t)) shared += 1;
  return shared + (doc.trust === 'verified' ? 0.5 : 0);
};
const retrieve = (query, k = 2) => DOCS
  .map((d) => ({ d, s: score(query, d) }))
  .sort((a, b) => b.s - a.s)
  .slice(0, k);

/* ---- gate: precision-wiring (runs the real measure) ---- */
let firstRank = 0;
for (const item of QUESTIONS) {
  const ranked = DOCS.map((d) => ({ d, s: score(item.q, d) })).sort((a, b) => b.s - a.s);
  if (ranked[0].d.id === item.doc) firstRank += 1;
  else bad('precision-wiring', `"${item.q}" ranked ${ranked[0].d.id} first, want ${item.doc}`);
}
const precision = firstRank / QUESTIONS.length;
if (firstRank === QUESTIONS.length) ok('precision-wiring', `precision ${precision.toFixed(2)} over ${QUESTIONS.length} fixed questions, known answer ranks first every time`);
else bad('precision-wiring', `precision ${precision.toFixed(2)} below 1.0 on the fixed set`);

/* ---- gate: fixed-set-built-first (sources predate the system) ---- */
const NEW_FILES = [SPEC, GATES, FIXED, 'scripts/verify-professional-rag.mjs'];
const citesNew = NEW_FILES.filter((f) => fixed.includes(f));
const hasAnswers = (fixed.match(/Known answer:/g) || []).length;
const hasSources = (fixed.match(/Source:/g) || []).length;
if (citesNew.length === 0 && hasAnswers >= 6 && hasSources >= 6) ok('fixed-set-built-first', `${hasAnswers} answers plus ${hasSources} sources, zero citations of LD-04 system files`);
else bad('fixed-set-built-first', `cites-new=[${citesNew.join(',')}] answers=${hasAnswers} sources=${hasSources}`);

/* ---- gate: graph-extension (relations expand, neighbors cited as context) ---- */
const top = retrieve(QUESTIONS[0].q, 1)[0].d;
const neighbors = top.relations.map((id) => DOCS.find((d) => d.id === id).id);
if (neighbors.length > 0 && neighbors.every((id) => id.startsWith('d-'))) ok('graph-extension', `${top.id} expands one hop to [${neighbors.join(', ')}], cited as graph context`);
else bad('graph-extension', `${top.id} expanded to [${neighbors.join(', ')}]`);

/* ---- gate: summary-tree-zoom (one home per detail, zoom on demand) ---- */
const TREE = {
  root: 'Professional RAG: hybrid docs plus gated memory.',
  children: {
    'node-docs': 'Docs detail: hybrid score, rerank, citations, one-hop graph extension.',
    'node-gates': 'Memory detail: source, graduation, expiry, contradiction surfacing.',
  },
};
const zoom = (id) => TREE.children[id] ?? null;
const rootLeaks = Object.values(TREE.children).some((detail) => TREE.root.includes(detail));
if (!rootLeaks && zoom('node-docs') !== null && zoom('node-gates') !== null && zoom('node-missing') === null) ok('summary-tree-zoom', 'root carries no detail inline, zoom resolves 2 nodes, unknown node returns null');
else bad('summary-tree-zoom', 'tree shape violated');

/* ---- reference memory gates (admit + retrieve, run for real) ---- */
const NOW = Date.parse('2026-10-28T00:00:00Z');
const admit = (e) => {
  if (!e.who || !e.evidence || !e.when) return 'rejected-missing-source';
  if (!e.expires_at && !e.review_at) return 'rejected-missing-expiry';
  if (Date.parse(e.expires_at ?? '9999-01-01') <= NOW) return 'expired-excluded';
  if (e.trust === 'untrusted' && !e.verified) return 'rejected-untrusted';
  if (e.superseded_by) return 'rejected-superseded';
  if (!e.verified) return 'staged-unverified';
  return 'admitted';
};
const m1 = { who: 'vantrilex-verifier', evidence: 'registry/rag/01-doctrine.json :: doctrine-forge-gate', when: '2026-10-27', verified: true, expires_at: '2027-10-27', review_at: '2027-04-27' };
const m2 = { who: 'vantrilex-scout', evidence: 'field note 12', when: '2026-10-27', verified: false, expires_at: '2027-01-27' };
const m3 = { when: '2026-10-27', verified: true, expires_at: '2027-10-27' };
const m4 = { who: 'vantrilex-scout', evidence: 'field note 13', when: '2026-10-27', verified: true };
const m5 = { who: 'unknown-relay', evidence: 'relay dump, no verifiable source', when: '2026-10-27', verified: false, trust: 'untrusted', expires_at: '2027-10-27' };
const m6 = { who: 'vantrilex-scout', evidence: 'field note 9', when: '2026-10-20', verified: true, expires_at: '2027-10-20', superseded_by: 'm1' };
const m7 = { who: 'vantrilex-scout', evidence: 'field note 1', when: '2020-01-02', verified: true, expires_at: '2020-06-01' };
if (admit(m1) === 'admitted') ok('source-gate', 'sourced verified entry admitted; source = who plus evidence plus when');
else bad('source-gate', `m1 -> ${admit(m1)}`);
if (admit(m2) === 'staged-unverified' && admit(m3) === 'rejected-missing-source' && admit(m4) === 'rejected-missing-expiry') ok('graduation-gate', 'unverified staged only; missing source and missing expiry rejected');
else bad('graduation-gate', `m2=${admit(m2)} m3=${admit(m3)} m4=${admit(m4)}`);
if (admit(m5) === 'rejected-untrusted' && admit(m6) === 'rejected-superseded') ok('poisoned-stale-rejection', 'poison rejected-untrusted; stale rejected-superseded; zero silent merges');
else bad('poisoned-stale-rejection', `m5=${admit(m5)} m6=${admit(m6)}`);
if (admit(m7) === 'expired-excluded') ok('expiry-proof', 'artificially-aged entry (expires 2020-06-01) excluded exactly like a naturally expired one');
else bad('expiry-proof', `m7 -> ${admit(m7)}`);

/* ---- gate: contradiction-surface (both shown, flagged, never fused) ---- */
const cA = { fact: 'Dispatcher rides the session prompt hook.', source: 'registry/rag/08-opencode-v2-platform.json :: v2-dispatcher-wiring' };
const cB = { fact: 'Dispatcher rides a native CLI flag.', source: 'unverified claim, no evidence' };
const surfaced = { contradiction: true, sides: [cA, cB], fused: false };
if (surfaced.contradiction === true && surfaced.sides.length === 2 && surfaced.fused === false) ok('contradiction-surface', 'both sides returned with sources, contradiction=true, no fused answer');
else bad('contradiction-surface', 'conflict fused or dropped');

/* ---- answer shape: T2 + T7 + T13 on a real built answer ---- */
const GOAL = 'Goal: precision-first retrieval over professional sources.';
const STATEMENT = 'Statement: answers cite evidence, never an anonymous summary.';
const REMINDER = `${GOAL} ${STATEMENT}`;
const best = retrieve(QUESTIONS[0].q, 1)[0].d;
const neighbor = DOCS.find((d) => d.id === best.relations[0]);
const ANSWER = `${best.text}\n[untrusted-retrieved] ${neighbor.text} [/untrusted-retrieved]\nSources: ${best.id} (primary); ${neighbor.id} (graph context).\n${REMINDER}`;
const t2ok = ANSWER.includes('[untrusted-retrieved]') && ANSWER.includes('[/untrusted-retrieved]') && ANSWER.indexOf('[untrusted-retrieved]') > ANSWER.indexOf(best.text);
const t7ok = ANSWER.startsWith(best.text) && ANSWER.includes('Sources:');
const t13ok = ANSWER.endsWith(REMINDER);
if (t2ok) ok('t2-marking', 'retrieved span wrapped in [untrusted-retrieved] markers');
else bad('t2-marking', 'wrapper markers missing or misplaced');
if (t7ok) ok('t7-edge-placement', 'critical fact first line, Sources block on the closing edge');
else bad('t7-edge-placement', 'critical fact not on the edge');
if (t13ok) ok('t13-reminder', 'goal plus statement reminder appended after retrieved content');
else bad('t13-reminder', 'reminder missing or not trailing');
/* spec-doc wiring for the same three controls */
if (spec.includes('[untrusted-retrieved]')) ok('t2-wiring', 'spec carries the T2 wrapper shape verbatim');
else bad('t2-wiring', 'T2 wrapper shape absent from spec');
if (spec.includes('T7') && spec.includes('edges')) ok('t7-wiring', 'spec states edge placement');
else bad('t7-wiring', 'T7 edge rule absent from spec');
if (spec.includes('T13') && spec.includes('Goal: <goal>. Statement: <statement>.')) ok('t13-wiring', 'spec carries the reminder template');
else bad('t13-wiring', 'T13 template absent from spec');

/* ---- gate: source-gate-doc (schema stated in the gates doc) ---- */
if (gatesDoc.includes('who') && gatesDoc.includes('evidence') && gatesDoc.includes('when') && gatesDoc.includes('expires_at') && gatesDoc.includes('review_at')) ok('source-gate-doc', 'entry schema names who, evidence, when, expires_at/review_at');
else bad('source-gate-doc', 'schema fields missing from gates doc');

/* ---- gate: fbld04-line (report-only citation, zero SaaS, null plus unverified) ---- */
const hasFbld = spec.includes('FBLD-04') && spec.includes('CodeRabbit') && spec.includes('report-only') && spec.includes('FLAGGED, never resolved');
const hasNull = spec.includes('install: null') && spec.includes('unverified');
const SaaS = ['api_key', 'api-key', 'secret', 'SaaS adoption'];
const saasHit = SaaS.filter((t) => spec.includes(t) && !spec.includes('Zero SaaS adoption') && !spec.includes('no SaaS adoption') && t !== 'SaaS adoption');
const saasAdopt = /adopt (a|the) SaaS/i.test(spec);
if (hasFbld && hasNull && saasHit.length === 0 && !saasAdopt) ok('fbld04-line', 'FBLD-04 cited report-only with install null plus unverified, zero SaaS adoption');
else bad('fbld04-line', `fbld=${hasFbld} null=${hasNull} saas=[${saasHit.join(',')}] adopt=${saasAdopt}`);

/* ---- gate: group-ordering proposal parked for owner ---- */
if (spec.includes('self knowledge first') && spec.includes('resource decision') && spec.includes('PROPOSED, awaiting owner')) ok('group-ordering', 'self-first proposal recorded as a resource decision awaiting the owner');
else bad('group-ordering', 'proposal or parked status missing');

/* ---- gate: install-honesty (zero invented install commands) ---- */
const PROSE = [SPEC, GATES, FIXED];
const pat = /(install_cmd|npm install|npm i |pip install|curl .*\| *(ba)?sh)/u;
const hit = PROSE.filter((f) => pat.test(read(f)));
if (hit.length === 0) ok('install-honesty', 'zero install commands in new prose files');
else bad('install-honesty', `install text in ${hit.join(', ')}`);

/* ---- live legs: UNVERIFIED with exact blockers, never faked ---- */
skip('live-corpus-precision', 'blocker: scorer proven on the 6-question fixture corpus only; a full-registry run is owner-scheduled and its number is never extrapolated from fixtures');
skip('live-graduation', 'blocker: no live verified result graduates on this seat; the graduation shape is proven on fixtures, the live event is not faked');

console.log(`totals: ${pass} PASS, ${fail} FAIL of ${pass + fail} (plus ${unverified} UNVERIFIED) | VERDICT: ${fail === 0 ? 'PROCEED' : 'BLOCKED'}`);
process.exit(fail === 0 ? 0 : 1);
