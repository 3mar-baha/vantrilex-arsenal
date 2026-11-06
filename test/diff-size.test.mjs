import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('diff-size thresholds are documented in the plugin', () => {
  const text = fs.readFileSync(path.join(root, '.opencode/plugin/arsenal.ts'), 'utf8');
  assert.match(text, /DIFF_LINE_LIMIT/);
  assert.match(text, /DIFF_FILE_LIMIT/);
});

test('publish queue entries are valid JSON with queue fields', () => {
  const queuePath = path.join(root, '.opencode/release-queue.jsonl');
  if (!fs.existsSync(queuePath)) {
    assert.fail('release-queue.jsonl is missing');
  }
  const lines = fs.readFileSync(queuePath, 'utf8').split('\n').filter((l) => l.trim().length > 0);
  for (const line of lines) {
    const entry = JSON.parse(line);
    assert.ok(typeof entry.unit_type === 'string');
    assert.ok(typeof entry.base_commit === 'string');
    assert.ok(typeof entry.status === 'string');
  }
});

test('git diff stat is readable for the diff-size guard', () => {
  const out = execFileSync('git', ['diff', '--stat', 'HEAD'], { cwd: root, encoding: 'utf8' });
  assert.ok(typeof out === 'string');
});
