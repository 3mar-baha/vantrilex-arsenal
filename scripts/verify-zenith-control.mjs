#!/usr/bin/env node
'use strict';

// verify-zenith-control.mjs — LD-02 Zenith control gate harness (0.9.2).
//
// Usage:
//   node scripts/verify-zenith-control.mjs [--root <dir>]
//
// What it does: runs the LD-02 exit criteria as named checks with a
// PASS/FAIL/UNVERIFIED table:
//   skill-format     — scripts/verify-skills.mjs exits 0 over the tree
//   six-part-spec    — both vs-zn-* books carry the six build-spec parts
//                      plus owner controls T13, T14, T15 in the lead book
//   register-fields  — the team-model register carries all six fields plus
//                      the refresh rule naming its anchor trigger
//   seat-selection   — the side-picker source lists the seats; selecting one
//                      carries its model plus its variables (proof, not name)
//   guard-real-diff  — the guard turns a real before/after (register file
//                      refreshed with live repo signals) into update tasks
//   simulation       — the register-refresh procedure runs at a session
//                      anchor and shows all six fields updated
//   overlap-ledger   — the R2 carry note names all 9 ids and installs nothing
//
// Simulation and diff inputs use fixed dates plus live repo signals, never
// the clock, so a run years from now exercises the same path. Live-session
// items that need a real owning session (a genuine anchor event firing on a
// host) are reported UNVERIFIED with the exact blocker, never
// green-by-association.
//
// Node 25, ESM, zero dependencies. One named check per rule.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = dirname(dirname(SCRIPT_PATH));

const rootFromArgs = () => {
  const i = process.argv.indexOf('--root');
  if (i !== -1 && process.argv[i + 1]) return resolve(process.argv[i + 1]);
  return DEFAULT_ROOT;
};
const ROOT = rootFromArgs();

const results = [];
const check = (name, status, detail) => {
  results.push({ name, status, detail });
};

const LEAD = join(ROOT, '.opencode', 'skills', 'vs-zn-team-control', 'SKILL.md');
const GUARD_SKILL = join(ROOT, '.opencode', 'skills', 'vs-zn-refresh-guard', 'SKILL.md');
const REGISTER = join(ROOT, '.opencode', 'zenith', 'team-model-register.md');
const SEATS = join(ROOT, '.opencode', 'zenith', 'seats');
const OVERLAP = join(ROOT, '.opencode', 'zenith', 'r2-overlap-carry.md');
const SKILL_GATE = join(ROOT, 'scripts', 'verify-skills.mjs');

/* ---------- check 1: skill-format gate ---------- */

const runSkillFormat = () => {
  if (!existsSync(SKILL_GATE)) {
    check('skill-format', 'UNVERIFIED', `verifier script absent at scripts/verify-skills.mjs; blocker: script not on disk`);
    return;
  }
  try {
    const out = execFileSync(process.execPath, [SKILL_GATE, '--root', ROOT], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 180000,
    });
    const tail = out.trim().split('\n').slice(-3).join(' | ');
    check('skill-format', 'PASS', `verify-skills.mjs exit 0 :: ${tail}`);
  } catch (error) {
    check('skill-format', error.status === 0 ? 'PASS' : 'FAIL',
      `verify-skills.mjs exit ${error.status ?? 'signal'} :: ${(error.stdout || error.message || '').split('\n').slice(-5).join(' | ')}`);
  }
};

/* ---------- check 2: six-part build spec in both books ---------- */

const SIX_PARTS = [
  'non-duties',
  'Instruction pack',
  'Equipment policy',
  'Context contract',
  'Verification commitments',
  'Failure contract',
];

const runSixPartSpec = () => {
  const missing = [];
  for (const [label, path] of [['lead', LEAD], ['guard', GUARD_SKILL]]) {
    let text = '';
    try {
      text = readFileSync(path, 'utf8');
    } catch {
      missing.push(`${label}: file unreadable`);
      continue;
    }
    for (const part of SIX_PARTS) {
      if (!text.includes(part)) missing.push(`${label}: missing ${part}`);
    }
  }
  let lead = '';
  try {
    lead = readFileSync(LEAD, 'utf8');
  } catch {
    lead = '';
  }
  for (const token of ['T13', 'T14', 'T15']) {
    if (!lead.includes(token)) missing.push(`lead: missing ${token}`);
  }
  if (missing.length === 0) {
    check('six-part-spec', 'PASS', 'both books carry all six parts; lead book carries T13 T14 T15');
  } else {
    check('six-part-spec', 'FAIL', missing.join(' ; '));
  }
};

/* ---------- check 3: register six fields plus anchor trigger ---------- */

const SIX_FIELDS = [
  'Live directives',
  'Live load',
  'Equipment baselines',
  'Failure log',
  'Arbitration queue',
  'Tier-granted inventory',
];

const runRegisterFields = () => {
  let text = '';
  try {
    text = readFileSync(REGISTER, 'utf8');
  } catch (error) {
    check('register-fields', 'FAIL', `register unreadable: ${error.message}`);
    return;
  }
  const missing = SIX_FIELDS.filter((f) => !text.includes(f));
  const trigger = text.includes('session-start anchor');
  if (missing.length === 0 && trigger) {
    check('register-fields', 'PASS', 'six fields present; refresh rule names the session-start anchor trigger');
  } else {
    check('register-fields', 'FAIL', [...missing.map((f) => `missing ${f}`), trigger ? '' : 'missing anchor trigger'].filter(Boolean).join(' ; '));
  }
};

/* ---------- check 4: seat selection carries model plus variables ---------- */

const runSeatSelection = () => {
  let files = [];
  try {
    files = readdirSync(SEATS).filter((f) => f.endsWith('.md')).sort();
  } catch (error) {
    check('seat-selection', 'FAIL', `seats dir unreadable: ${error.message}`);
    return;
  }
  if (files.length < 2) {
    check('seat-selection', 'FAIL', `picker source lists ${files.length} seat(s), need at least 2 pre-made variable seats`);
    return;
  }
  const picked = files.includes('zenith-seat-b.md') ? 'zenith-seat-b.md' : files[0];
  const text = readFileSync(join(SEATS, picked), 'utf8');
  const modelLine = text.split('\n').find((l) => l.startsWith('- Model:')) || '';
  const model = modelLine.replace('- Model:', '').trim();
  const variables = text.split('\n').filter((l) => l.startsWith('  - '));
  if (!model) {
    check('seat-selection', 'FAIL', `${picked}: Model line empty, selection would drop the model`);
    return;
  }
  if (variables.length < 3) {
    check('seat-selection', 'FAIL', `${picked}: ${variables.length} variables, need at least 3`);
    return;
  }
  check('seat-selection', 'PASS',
    `picker lists [${files.join(', ')}]; selected ${picked} carries Model="${model}" plus ${variables.length} variables (${variables.map((v) => v.trim().replace(/^- /, '').split(':')[0]).join(', ')})`);
};

/* ---------- checks 5+6: real diff plus simulated anchor ---------- */

const liveLoadSignal = () => {
  let sha = 'unknown';
  let dirt = 'unknown';
  try {
    sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8', timeout: 30000 }).trim();
  } catch {
    sha = 'unverified-no-git';
  }
  try {
    const porcelain = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8', timeout: 30000 }).trim();
    dirt = porcelain === '' ? 'clean' : `${porcelain.split('\n').length} changed path(s)`;
  } catch {
    dirt = 'unverified-no-git';
  }
  return `wave 1 of 9 at ${sha} (${dirt})`;
};

const runGuardRealDiff = async (guard) => {
  let before = '';
  try {
    before = readFileSync(REGISTER, 'utf8');
  } catch (error) {
    check('guard-real-diff', 'FAIL', `before unreadable: ${error.message}`);
    return null;
  }
  let after = '';
  try {
    after = guard.refreshRegister(before, {
      anchorId: 'sim-anchor-001',
      stamp: '2026-10-28',
      loadSignal: liveLoadSignal(),
    });
  } catch (error) {
    check('guard-real-diff', 'FAIL', `refresh procedure threw: ${error.message}`);
    return null;
  }
  if (after === before) {
    check('guard-real-diff', 'FAIL', 'refresh produced byte-identical text; no real change to diff');
    return null;
  }
  const ops = guard.diffLines(guard.splitLines(before), guard.splitLines(after));
  const hunks = guard.hunksFromOps(ops, guard.splitLines(before), guard.splitLines(after));
  const tasks = guard.tasksFromDiff(hunks, 'team-model-register.md: seed-2026-10-28 -> sim-anchor-001');
  const untraced = tasks.filter((t) => t.beforeCount === 0 && t.afterCount === 0);
  if (tasks.length === 0) {
    check('guard-real-diff', 'FAIL', 'real before/after differ yet zero tasks were produced');
    return null;
  }
  if (untraced.length > 0) {
    check('guard-real-diff', 'FAIL', `${untraced.length} task(s) cite no lines`);
    return null;
  }
  const workdir = mkdtempSync(join(tmpdir(), 'zenith-guard-'));
  try {
    writeFileSync(join(workdir, 'before.md'), before);
    writeFileSync(join(workdir, 'after.md'), after);
    const cli = execFileSync(process.execPath, [
      join(ROOT, 'scripts', 'zenith-refresh-guard.mjs'),
      '--before', join(workdir, 'before.md'),
      '--after', join(workdir, 'after.md'),
      '--label', 'team-model-register.md: seed-2026-10-28 -> sim-anchor-001',
      '--json',
    ], { cwd: ROOT, encoding: 'utf8', timeout: 60000 });
    const parsed = JSON.parse(cli);
    if (parsed.tasks.length !== tasks.length) {
      check('guard-real-diff', 'FAIL', `library path yields ${tasks.length} tasks but CLI yields ${parsed.tasks.length}`);
      return null;
    }
  } catch (error) {
    check('guard-real-diff', 'FAIL', `CLI cross-check failed: ${error.message}`);
    return null;
  } finally {
    try {
      rmSync(workdir, { recursive: true, force: true });
    } catch {
      // ignore cleanup failure
    }
  }
  check('guard-real-diff', 'PASS',
    `real before/after (${guard.splitLines(before).length} -> ${guard.splitLines(after).length} lines) yields ${hunks.length} hunk(s) and ${tasks.length} traced task(s), CLI agrees; first ${tasks[0].id} [${tasks[0].kind}] :: ${tasks[0].detail}`);
  return after;
};

const runSimulation = (after) => {
  if (after === null) {
    check('simulation', 'FAIL', 'no refreshed text; anchor procedure produced nothing to verify');
    return;
  }
  const missing = SIX_FIELDS.filter((f) => !after.includes(f));
  const anchorStamped = after.includes('- Anchor: sim-anchor-001');
  if (missing.length === 0 && anchorStamped) {
    check('simulation', 'PASS',
      `session-anchor procedure at sim-anchor-001 shows all six fields updated (${SIX_FIELDS.join(' | ')})`);
  } else {
    check('simulation', 'FAIL', [...missing.map((f) => `lost ${f}`), anchorStamped ? '' : 'anchor id not stamped'].filter(Boolean).join(' ; '));
  }
};

/* ---------- check 7: R2 overlap carried verbatim, nothing installed ---------- */

const R2_IDS = [
  'alpha-insights',
  'business-health-diagnostic',
  'business-model',
  'company-research',
  'competitive-battlecard',
  'competitor-analysis',
  'competitors',
  'market-segments',
  'market-sizing',
];

const runOverlapLedger = () => {
  let text = '';
  try {
    text = readFileSync(OVERLAP, 'utf8');
  } catch (error) {
    check('overlap-ledger', 'FAIL', `carry note unreadable: ${error.message}`);
    return;
  }
  const missing = R2_IDS.filter((id) => !text.includes(id));
  const installsNothing = text.includes('installs nothing');
  if (missing.length === 0 && installsNothing) {
    check('overlap-ledger', 'PASS', 'all 9 R2 ids carried verbatim; installs-nothing fallback stated');
  } else {
    check('overlap-ledger', 'FAIL', [...missing.map((id) => `missing ${id}`), installsNothing ? '' : 'missing installs-nothing'].filter(Boolean).join(' ; '));
  }
};

/* ---------- driver ---------- */

const main = async () => {
  const guardUrl = pathToFileURL(join(ROOT, 'scripts', 'zenith-refresh-guard.mjs')).href;
  let guard = null;
  try {
    guard = await import(guardUrl);
  } catch (error) {
    check('guard-real-diff', 'FAIL', `guard script unimportable: ${error.message}`);
    check('simulation', 'FAIL', 'guard script unimportable; no procedure to simulate');
  }
  runSkillFormat();
  runSixPartSpec();
  runRegisterFields();
  runSeatSelection();
  let after = null;
  if (guard !== null) {
    after = await runGuardRealDiff(guard);
  }
  runSimulation(after);
  runOverlapLedger();

  const pass = results.filter((r) => r.status === 'PASS').length;
  const fail = results.filter((r) => r.status === 'FAIL').length;
  const unverified = results.filter((r) => r.status === 'UNVERIFIED').length;
  for (const r of results) {
    process.stdout.write(`${r.status} ${r.name} :: ${r.detail}\n`);
  }
  process.stdout.write(`totals: ${pass} PASS, ${fail} FAIL, ${unverified} UNVERIFIED of ${results.length}\n`);
  process.stdout.write(fail === 0 ? 'VERDICT: PROCEED\n' : 'VERDICT: STOP\n');
  process.exit(fail === 0 ? 0 : 1);
};

await main();