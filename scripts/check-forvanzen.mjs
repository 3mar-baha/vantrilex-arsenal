#!/usr/bin/env node
/*
 * FOR-VANZEN freshness check (MFT-152, S37) — version notes vs tree.
 *
 * Each `for-vanzen/0.9.NN.md` and `for-vanzen/build-0.9.NN.md` note is
 * checked for a non-empty body, an H1, a `last_verified` line, and cited
 * paths that no longer match the tree. A note whose claim no longer
 * matches is flagged FAIL with the file named; notes with honest
 * `unverified` status are reported as NOTED, not failed.
 *
 * Usage:
 *   node scripts/check-forvanzen.mjs
 * Exit status:
 *   0 — every note matches the tree (or is reported NOTED)
 *   1 — at least one note is stale (FAIL)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'for-vanzen');

const files = fs.readdirSync(dir).filter((f) => /^0\.9\.\d+\.md$/.test(f) || /^build-0\.9\.\d+\.md$/.test(f)).sort();

let failures = 0;
let noted = 0;
for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  const hasH1 = /^# .+/m.test(text);
  const hasLastVerified = /last_verified/.test(text);
  const unverified = /unverified/.test(text);
  // A claim no longer matching the tree is a cited path that does not exist.
  // Only flag clear staleness: a `registry/...` or `docs/...` path cited in
  // backticks that is absent on disk.
  const cited = [...text.matchAll(/`(registry\/[^`\s]+|docs\/[^`\s]+)`/g)].map((m) => m[1]);
  const missing = cited.filter((p) => !fs.existsSync(path.join(root, p)));
  if (!hasH1 || !hasLastVerified || missing.length > 0) {
    failures += 1;
    console.log(`FAIL ${f}: ${!hasH1 ? 'no H1; ' : ''}${!hasLastVerified ? 'no last_verified; ' : ''}${missing.length > 0 ? `cited path(s) missing: ${missing.slice(0, 3).join(', ')}` : ''}`);
  } else if (unverified) {
    noted += 1;
    console.log(`NOTED ${f}: last_verified is unverified`);
  } else {
    console.log(`PASS ${f}`);
  }
}
console.log(failures === 0 ? `FOR-VANZEN: PASS — ${files.length} notes checked, ${noted} noted.` : `FOR-VANZEN: FAIL — ${failures}/${files.length} notes are stale.`);
process.exit(failures === 0 ? 0 : 1);
