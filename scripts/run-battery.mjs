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
 * verify-minimums (section c) is the one verify script that cannot be
 * run with no arguments: it requires `--task <id>` and exits 2 on usage
 * error by design (D65). The battery therefore runs it against a fixture
 * trace it writes to `.opencode/dispatch-log/finalfix-fixture-2026-11-12.jsonl`
 * for the duration of the run — rank asterism, 5 skills + 2 MCPs, all
 * `source: "verifier-confirmed"`, a current RFC3339 timestamp — then
 * asserts exit 0 and DELETES the fixture and the scratch directory it
 * created. `.opencode/dispatch-log/` must never ship in the tree; the
 * battery leaves it absent afterwards (proved by `git status --short`).
 * A real-task invocation is documented separately:
 *   node scripts/verify-minimums.mjs --task <real-task-id>
 * where a real trace exists (see docs/dev/verifier-evaluation-path-2026-11-12.md).
 * No fixture trace is ever committed.
 *
 * Usage:
 *   node scripts/run-battery.mjs
 * Exit status:
 *   0 — every scoped section passed
 *   1 — at least one scoped section failed (failures are listed)
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
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
  // The npm cache is pointed at a fresh, writable scratch dir under the OS
  // temp dir for the duration of the step and removed afterwards: the
  // default cache has hit npm-cache EPERM on this machine, and a cold cache
  // dir sidesteps it without pinning or moving the version (no lockfile
  // exists, so none is invented). Glob and exit semantics are unchanged.
  const cacheDir = path.join(os.tmpdir(), `npm-cache-finalfix-${process.pid}`);
  fs.mkdirSync(cacheDir, { recursive: true });
  const prevCache = process.env.NPM_CONFIG_CACHE;
  process.env.NPM_CONFIG_CACHE = cacheDir;
  try {
    const { status, out } = run('npx', ['--yes', 'markdownlint-cli', 'docs/*.md']);
    if (status !== 0) {
      console.log('FAIL markdownlint-cli "docs/*.md"');
      console.log(out.split('\n').slice(0, 20).join('\n'));
      return 1;
    }
    console.log('markdownlint-cli "docs/*.md": PASS');
    return 0;
  } finally {
    if (prevCache === undefined) delete process.env.NPM_CONFIG_CACHE;
    else process.env.NPM_CONFIG_CACHE = prevCache;
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }
};

// verify-minimums cannot be run without arguments (D65: `--task` is required,
// usage errors exit 2), so the battery runs it against a fixture trace it
// writes for the duration of the run. The script resolves LOG_DIR from its
// own location (`<root>/.opencode/dispatch-log`), so the fixture lives there
// and not in the temp dir; it is deleted afterwards, along with the
// scratch `dispatch-log/` it created, so `.opencode/dispatch-log/` never
// ships in the tree. The fixture is a complete, valid trace: rank asterism,
// 5 verifier-confirmed skills + 2 verifier-confirmed MCPs, a current RFC3339
// timestamp, and a task id matching the script's TASK_RE.
const VERIFY_MINIMUMS_FIXTURE_TASK = 'finalfix-fixture-2026-11-12';
const VERIFY_MINIMUMS_FIXTURE_DIR = path.join(root, '.opencode', 'dispatch-log');
const VERIFY_MINIMUMS_FIXTURE_FILE = path.join(VERIFY_MINIMUMS_FIXTURE_DIR, `${VERIFY_MINIMUMS_FIXTURE_TASK}.jsonl`);

const writeVerifyMinimumsFixture = () => {
  const at = new Date().toISOString(); // RFC3339, e.g. 2026-11-12T15:34:00.000Z
  const tokens = [
    ['skill', 'ponytail'],
    ['skill', 'tdd-workflow'],
    ['skill', 'verification-loop'],
    ['skill', 'vs-asterism-muster'],
    ['skill', 'documentation-as-tests'],
    ['mcp', 'memory'],
    ['mcp', 'deepwiki'],
  ];
  const lines = tokens.map(([kind, token]) => JSON.stringify({
    task_id: VERIFY_MINIMUMS_FIXTURE_TASK,
    agent: 'vantrilex-implementer',
    rank: 'asterism',
    kind,
    token,
    source: 'verifier-confirmed',
    at,
  }));
  fs.mkdirSync(VERIFY_MINIMUMS_FIXTURE_DIR, { recursive: true });
  fs.writeFileSync(VERIFY_MINIMUMS_FIXTURE_FILE, lines.join('\n') + '\n');
};

const checkVerifyMinimums = () => {
  const dirExisted = fs.existsSync(VERIFY_MINIMUMS_FIXTURE_DIR);
  try {
    writeVerifyMinimumsFixture();
  } catch (e) {
    console.log(`FAIL node scripts/verify-minimums.mjs --task <fixture> (fixture write failed: ${e.message})`);
    return 1;
  }
  try {
    const { status, out } = run('node', ['scripts/verify-minimums.mjs', '--task', VERIFY_MINIMUMS_FIXTURE_TASK]);
    if (status !== 0) {
      console.log(`FAIL node scripts/verify-minimums.mjs --task ${VERIFY_MINIMUMS_FIXTURE_TASK} (exit ${status})`);
      console.log(out.split('\n').slice(0, 20).join('\n'));
      return 1;
    }
    console.log(`PASS node scripts/verify-minimums.mjs --task ${VERIFY_MINIMUMS_FIXTURE_TASK} (exit 0)`);
    return 0;
  } finally {
    // Leave the tree byte-clean: delete the fixture, then remove the scratch
    // dispatch-log/ directory if (and only if) this run created it and it is
    // now empty. Never leave the fixture behind; never commit it.
    try {
      fs.rmSync(VERIFY_MINIMUMS_FIXTURE_FILE, { force: true });
      if (!dirExisted && fs.existsSync(VERIFY_MINIMUMS_FIXTURE_DIR) && fs.readdirSync(VERIFY_MINIMUMS_FIXTURE_DIR).length === 0) {
        fs.rmdirSync(VERIFY_MINIMUMS_FIXTURE_DIR);
      }
    } catch (e) {
      console.log(`FAIL verify-minimums fixture cleanup (${e.message}) — .opencode/dispatch-log/ may be left dirty`);
      return 1;
    }
  }
};

const checkVerified = () => {
  const all = fs.readdirSync(path.join(root, 'scripts')).filter((f) => f.startsWith('verify-') && f.endsWith('.mjs')).sort();
  const knownFail = new Set(['verify-conformance-0917.mjs', 'verify-foundation-replacement.mjs']);
  // verify-minimums.mjs runs as a fixture check below, not as a no-arg call.
  const files = all.filter((f) => !knownFail.has(f) && f !== 'verify-minimums.mjs');
  console.log(`known-fail (pending re-baseline per D33, excluded): ${[...knownFail].join(', ')}`);
  let failed = 0;
  for (const f of files) {
    const { status } = run('node', [`scripts/${f}`]);
    console.log(`${status === 0 ? 'PASS' : 'FAIL'} node scripts/${f} (exit ${status})`);
    if (status !== 0) failed += 1;
  }
  const mins = checkVerifyMinimums();
  if (mins !== 0) failed += 1;
  console.log(`verify scripts: ${files.length + 1 - failed}/${files.length + 1} scoped passed (2 known-fail excluded; verify-minimums via fixture)`);
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
