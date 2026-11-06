#!/usr/bin/env node
/*
 * Canonical verification battery (MFT-151, IMP-S22/S34/S35).
 *
 * One command that runs every shipped `.mjs` through `node --check`
 * (S34) and the pinned markdownlint invocation (S35), plus the
 * `scripts/verify-*.mjs` suite. The two LD16/LD17 verifiers are
 * known-fail scoped pending re-baseline per D33 (history byte-identical;
 * excluded, never read as passes). CI runs this command; a fresh clone
 * runs it by name and gets a pass/fail per section.
 *
 * Usage:
 *   node scripts/run-battery.mjs
 * Exit status:
 *   0 — every scoped section passed
 *   1 — at least one scoped section failed (failures are listed)
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const run = (cmd, args) => {
  const bin = cmd === 'npx' && process.platform === 'win32' ? 'npx.cmd' : cmd;
  const opts = { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] };
  if (bin.endsWith('.cmd')) opts.shell = true;
  try {
    const out = execFileSync(bin, args, opts);
    return { status: 0, out };
  } catch (e) {
    return { status: e.status ?? 1, out: (e.stdout ?? '').toString() + (e.stderr ?? '').toString() };
  }
};

const checkMjs = () => {
  const found = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.worktrees') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.mjs')) found.push(path.relative(root, full));
    }
  };
  walk(root);
  found.sort();
  let failed = 0;
  for (const f of found) {
    const { status } = run('node', ['--check', f]);
    if (status !== 0) {
      console.log(`FAIL node --check ${f}`);
      failed += 1;
    }
  }
  console.log(`node --check: ${found.length - failed}/${found.length} passed`);
  return failed === 0 ? 0 : 1;
};

const checkMarkdownlint = () => {
  // Pinned invocation (S35): markdownlint-cli over the live documentation
  // set (`docs/*.md`). Version records under `for-vanzen/` and the
  // `docs/99-archive` / `docs/spec` history are not battery-linted.
  const { status, out } = run('npx', ['--yes', 'markdownlint-cli', 'docs/*.md']);
  if (status !== 0) {
    console.log('FAIL markdownlint-cli "docs/*.md"');
    console.log(out.split('\n').slice(0, 20).join('\n'));
    return 1;
  }
  console.log('markdownlint-cli "docs/*.md": PASS');
  return 0;
};

const checkVerified = () => {
  const all = fs.readdirSync(path.join(root, 'scripts')).filter((f) => f.startsWith('verify-') && f.endsWith('.mjs')).sort();
  const knownFail = new Set(['verify-conformance-0917.mjs', 'verify-foundation-replacement.mjs']);
  const files = all.filter((f) => !knownFail.has(f));
  console.log(`known-fail (pending re-baseline per D33, excluded): ${[...knownFail].join(', ')}`);
  let failed = 0;
  for (const f of files) {
    const { status } = run('node', [`scripts/${f}`]);
    console.log(`${status === 0 ? 'PASS' : 'FAIL'} node scripts/${f} (exit ${status})`);
    if (status !== 0) failed += 1;
  }
  console.log(`verify scripts: ${files.length - failed}/${files.length} scoped passed (2 known-fail excluded)`);
  return failed === 0 ? 0 : 1;
};

console.log('verify-battery: canonical battery (MFT-151)');
const a = checkMjs();
const b = checkMarkdownlint();
const c = checkVerified();
const failed = [a, b, c].filter((s) => s !== 0).length;
if (failed > 0) {
  console.log(`BATTERY: FAIL — ${failed}/3 sections failed.`);
  process.exit(1);
}
console.log('BATTERY: PASS — all 3 sections passed.');
