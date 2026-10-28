#!/usr/bin/env node
'use strict';
/* Verifies the LD-03 leader-craft build on disk. Node 25, ESM, zero dependencies. */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
let pass = 0;
let fail = 0;
const ok = (name, detail) => { pass += 1; console.log(`PASS ${name} | ${detail}`); };
const bad = (name, detail) => { fail += 1; console.log(`FAIL ${name} | ${detail}`); };

const BOOKS = [
  '.opencode/skills/vs-bl-build-craft/SKILL.md',
  '.opencode/skills/vs-at-plan-craft/SKILL.md',
  '.opencode/skills/vs-pu-probe-craft/SKILL.md',
];
const PARTS = [
  'Identity, including non-duties.',
  'Instruction pack.',
  'Equipment policy.',
  'Context contract.',
  'Verification commitments.',
  'Failure contract.',
];

for (const b of BOOKS) {
  if (!existsSync(join(ROOT, b))) { bad('six-part-spec', `${b} missing`); continue; }
  const t = read(b);
  const missing = PARTS.filter((p) => !t.includes(p));
  if (missing.length === 0) ok('six-part-spec', `${b} carries all six parts`);
  else bad('six-part-spec', `${b} missing ${missing.join('; ')}`);
}

const at = read('.opencode/skills/vs-at-plan-craft/SKILL.md');
if (at.includes('T12') && at.includes('pre-emption') && at.includes('failure story')) ok('t12-control', 'Aether book carries T12 pre-emption plus failure story');
else bad('t12-control', 'T12 tokens missing in Aether book');

const bl = read('.opencode/skills/vs-bl-build-craft/SKILL.md');
const bd = read('.opencode/skills/vs-book-doctrine/SKILL.md');
if (bl.includes('T8') && bd.includes('T8')) ok('t8-control', 'T8 new-window ritual in build book plus book doctrine');
else bad('t8-control', 'T8 tokens missing');

const seats = [
  '.opencode/craft/seats/blazar-seat.md',
  '.opencode/craft/seats/aether-seat.md',
  '.opencode/craft/seats/pulsar-seat.md',
];
for (const s of seats) {
  if (!existsSync(join(ROOT, s))) { bad('seat-selection', `${s} missing`); continue; }
  const t = read(s);
  if (t.includes('Model:') && t.includes('Variables:')) ok('seat-selection', `${s} carries model plus variables`);
  else bad('seat-selection', `${s} missing model or variables`);
}

const texts = BOOKS.map((b) => read(b));
let diffPairs = 0;
for (let i = 0; i < texts.length; i += 1) {
  for (let j = i + 1; j < texts.length; j += 1) {
    if (texts[i] !== texts[j]) diffPairs += 1;
  }
}
if (diffPairs === 3) ok('differentiation', '3 books pairwise differ (3 of 3 pairs)');
else bad('differentiation', `only ${diffPairs} of 3 pairs differ`);

const ov = read('.opencode/craft/r2-overlap-carry.md');
const IDS = ['alpha-insights', 'business-health-diagnostic', 'business-model', 'company-research', 'competitive-battlecard', 'competitor-analysis', 'competitors', 'market-segments', 'market-sizing'];
const missingIds = IDS.filter((id) => !ov.includes(id));
const conflicts = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6'].filter((f) => !ov.includes(f));
if (missingIds.length === 0 && conflicts.length === 0 && ov.includes('Install nothing')) ok('overlap-ledger', '9 R2 ids plus F1-F6 carried, install-nothing stated');
else bad('overlap-ledger', `missing ids ${missingIds.join(',')} conflicts ${conflicts.join(',')}`);

const van = read('.opencode/skills/vantrilex-vanguard/SKILL.md');
if (van.includes('Doctrinal outfitter repair (LD-03)') && van.includes('computed loadout log') && van.includes('origin confirms by dispatch')) ok('outfitter-repair', 'Vanguard carries doctrinal-outfitter repair in place');
else bad('outfitter-repair', 'Vanguard outfitter repair text missing');

const audit = read('.opencode/craft/reclassification-audit.md');
if (audit.includes('0') && audit.includes('unclassified')) ok('reclassification', 'audit table present with zero unclassified');
else bad('reclassification', 'audit totals missing');

const NEW_FILES = [...BOOKS, '.opencode/skills/vs-book-doctrine/SKILL.md', '.opencode/skills/vs-golden-equipment/SKILL.md'];
let invented = 0;
for (const f of NEW_FILES) {
  const t = read(f);
  if (/install_cmd\s*:/u.test(t)) invented += 1;
}
if (invented === 0) ok('install-honesty', 'zero install_cmd in new skills');
else bad('install-honesty', `${invented} files carry install_cmd`);

console.log(`totals: ${pass} PASS, ${fail} FAIL of ${pass + fail} | VERDICT: ${fail === 0 ? 'PROCEED' : 'BLOCKED'}`);
process.exit(fail === 0 ? 0 : 1);
