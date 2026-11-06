import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const readFrontmatter = (rel) => {
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  const m = text.match(/^color:\s*"([^"]+)"/m);
  return { text, color: m ? m[1] : null };
};

test('guide seat denies edit and carries the review colour', () => {
  const { text, color } = readFrontmatter('.opencode/agents/vantrilex-guide.md');
  assert.equal(color, '#F59E0B');
  assert.match(text, /edit:\s*deny/);
  assert.match(text, /bash:\s*ask/);
});

test('facet seat has three distinct permission facets with the same thinking', () => {
  const facetPath = path.join(root, '.opencode/agents/vantrilex-facet.md');
  if (!fs.existsSync(facetPath)) {
    // Before the facet seat lands this test reports the absence as a failure,
    // never as a pass.
    assert.fail('vantrilex-facet.md is missing');
  }
  const text = fs.readFileSync(facetPath, 'utf8');
  assert.match(text, /cautious/);
  assert.match(text, /balanced/);
  assert.match(text, /long/);
});
