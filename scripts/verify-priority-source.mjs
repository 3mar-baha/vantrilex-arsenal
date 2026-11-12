#!/usr/bin/env node
'use strict';

/*
  D60 decision 2 gate: a live record may not carry a non-null `priority`
  without the two fields that make the score auditable — `priority_source`
  (who set it) and `priority_set_at` (when). The v5 schema permits all three
  to be null in isolation, so this gate enforces the dependency the schema
  cannot: priority set => source and date present.

  Scope: the merged live records — the VANTRILEX_CATALOG.md rows enriched by
  registry/data/*.jsonl, exactly what generate-catalog-json.mjs emits to
  registry/catalog.json. Rows are counted from the load, never from a cached
  mirror, so the gate is honest on a fresh checkout.

  Usage: node scripts/verify-priority-source.mjs   (no arguments)

  Exit codes: 0 = every scored row carries priority_source and priority_set_at;
  1 = at least one scored row is missing either, or the check itself could
  not run (an unevaluable check is a failed check). Internal errors also
  exit 1 — this gate has no --task-style contract and takes no flags.
*/

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadCatalog } from './generate-catalog-json.mjs';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(SCRIPT_PATH));
const MAX_REPORTED = 20;

function main() {
  let loaded;
  try {
    loaded = loadCatalog();
  } catch (error) {
    process.stderr.write(`error: catalog could not be loaded, so the D60(2) gate evaluated nothing: ${error.message}\n`);
    process.exitCode = 1;
    return;
  }

  const { records } = loaded;
  const violations = [];
  let scored = 0;
  for (const record of records) {
    if (record.priority === null || record.priority === undefined) continue;
    scored += 1;
    const missing = [];
    if (record.priority_source === null || record.priority_source === undefined) missing.push('priority_source');
    if (record.priority_set_at === null || record.priority_set_at === undefined) missing.push('priority_set_at');
    if (missing.length > 0) violations.push({ id: record.id, kind: record.kind, missing });
  }

  console.log('D60(2) priority-source gate');
  console.log(`records: ${records.length} | scored (priority non-null): ${scored} | violations: ${violations.length}`);
  for (const violation of violations.slice(0, MAX_REPORTED)) {
    console.log(`  FAIL ${violation.kind}/${violation.id}: missing ${violation.missing.join(' + ')}`);
  }
  if (violations.length > MAX_REPORTED) {
    console.log(`  ... and ${violations.length - MAX_REPORTED} more`);
  }

  if (violations.length > 0) {
    console.log(`VERDICT: FAIL — ${violations.length} of ${scored} scored records lack priority_source or priority_set_at (missing count printed above; backfill via registry/data/*.jsonl, never by hand-editing the mirror).`);
    process.exitCode = 1;
    return;
  }
  console.log(`VERDICT: PASS — all ${scored} scored records carry priority_source and priority_set_at.`);
  process.exitCode = 0;
}

try {
  main();
} catch (error) {
  process.stderr.write(`error: D60(2) gate internal failure: ${error.stack ?? error.message}\n`);
  process.exitCode = 1;
}
