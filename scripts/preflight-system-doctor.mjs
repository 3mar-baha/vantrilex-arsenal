#!/usr/bin/env node
/*
 * One-command doctor preflight (MFT-152, S40) — fresh-clone health check.
 *
 * A fresh clone runs this one command and gets a PASS/FAIL/SKIPPED row
 * per check, with a remediation command for every failure. Read-only
 * apart from the report; installs and fixes nothing.
 *
 * Usage:
 *   node scripts/preflight-system-doctor.mjs
 * Exit status:
 *   0 — every check passed or skipped
 *   1 — at least one check failed
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const run = (cmd, args) => {
  try {
    const out = execFileSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { status: 0, out };
  } catch (e) {
    return { status: e.status ?? 1, out: (e.stdout ?? '').toString() + (e.stderr ?? '').toString() };
  }
};

const rows = [];
const record = (id, status, detail, remediation) => rows.push({ id, status, detail, remediation });

// Environment
const nodeVer = process.version;
const major = Number((nodeVer.match(/v(\d+)/) ?? [])[1] ?? 0);
record('A1', major >= 22 ? 'PASS' : 'FAIL', `node ${nodeVer}`, 'install Node 22+');
record('A2', fs.existsSync(path.join(root, '.opencode/plugin/arsenal.ts')) ? 'PASS' : 'FAIL', 'plugin present', 'clone the full repository');
record('A3', fs.existsSync(path.join(root, 'tsconfig.json')) ? 'PASS' : 'FAIL', 'tsconfig.json present', 'clone the full repository');
record('A4', fs.existsSync(path.join(root, 'registry/catalog.json')) ? 'PASS' : 'FAIL', 'catalog mirror present', 'run node scripts/generate-catalog-json.mjs --markdown --indexes');

// Workspace verifiers (each is a subsystem check; a missing script is a FAIL, never a pass)
const check = (id, label, args, remediation) => {
  const { status } = run('node', args);
  record(id, status === 0 ? 'PASS' : 'FAIL', `${label} (exit ${status})`, status === 0 ? '—' : remediation);
};
check('D1', 'verify-registry', ['scripts/verify-registry.mjs'], 'run node scripts/verify-registry.mjs and fix the named check');
check('D2', 'verify-catalog', ['scripts/verify-catalog.mjs'], 'run node scripts/verify-catalog.mjs and fix the named check');
check('D3', 'verify-skills', ['scripts/verify-skills.mjs'], 'run node scripts/verify-skills.mjs and fix the named check');
check('D4', 'forvanzen freshness', ['scripts/check-forvanzen.mjs'], 'run node scripts/check-forvanzen.mjs and close each flagged note');

// Tests
const { status: testStatus } = run('node', ['--test']);
record('D5', testStatus === 0 ? 'PASS' : 'FAIL', `node --test (exit ${testStatus})`, 'run node --test and fix the named test');

let failures = 0;
for (const r of rows) {
  if (r.status === 'FAIL') failures += 1;
  console.log(`${r.id} | ${r.status.padEnd(6)} | ${r.detail} | ${r.remediation}`);
}
console.log(failures === 0 ? 'DOCTOR: PASS — fresh clone is healthy.' : `DOCTOR: FAIL — ${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
