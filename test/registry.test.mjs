import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const run = (args) => execFileSync('node', args, { cwd: root, encoding: 'utf8' });

test('registry generators are current', () => {
  const out = run(['scripts/generate-catalog-json.mjs', '--check']);
  assert.ok(typeof out === 'string');
});

test('registry verifier passes', () => {
  const out = run(['scripts/verify-registry.mjs']);
  assert.match(out, /VERDICT: PASS/);
});
