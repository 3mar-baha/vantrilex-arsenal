#!/usr/bin/env node
'use strict';

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  byteOffsetToLine,
  findMalformedUtf8,
  lineOf,
  loadCatalog,
  validateRecord,
} from './generate-catalog-json.mjs';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(SCRIPT_PATH));
const CATALOG_MD = join(ROOT, 'registry', 'VANTRILEX_CATALOG.md');
const OVERLAPS_YAML = join(ROOT, 'registry', 'data', 'overlaps.yaml');

const MAX_REPORTED = 20;
const CONTEXT_RADIUS = 32;

const REFERENCE_FIELDS = new Set([
  'id',
  'ids',
  'into',
  'from',
  'keep',
  'drop',
  'merge',
  'merge_with',
  'canonical',
  'winner',
  'loser',
  'replace',
  'supersedes',
]);

const ID_TOKEN_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

/* ---------- check 1: UTF-8 validity ---------- */

function checkUtf8(buffer) {
  const defects = findMalformedUtf8(buffer);
  if (defects.length === 0) {
    return {
      status: 'PASS',
      detail: `${buffer.length} bytes decode as strict UTF-8: no malformed sequence, no replacement character`,
    };
  }

  const lines = [];
  for (const defect of defects) {
    const from = Math.max(0, defect.offset - CONTEXT_RADIUS);
    const to = Math.min(buffer.length, defect.offset + defect.length + CONTEXT_RADIUS);
    const context = buffer
      .subarray(from, to)
      .toString('utf8')
      .replace(/\uFFFD/gu, '<U+FFFD>')
      .replace(/[\r\n]+/gu, ' ');
    lines.push(
      `line ${byteOffsetToLine(buffer, defect.offset)}, byte ${defect.offset}: bytes [${defect.bytes.join(' ')}] are not a valid UTF-8 sequence; context "${context}"`,
    );
  }

  const plural = defects.length === 1 ? '' : 's';
  return {
    status: 'FAIL',
    detail: `${defects.length} malformed UTF-8 sequence${plural} (first at line ${byteOffsetToLine(buffer, defects[0].offset)}, byte ${defects[0].offset})`,
    lines: [`${defects.length} malformed UTF-8 sequence${plural} found:`, ...lines],
  };
}

/* ---------- check 2: schema conformance ---------- */

function checkSchema(records, schema) {
  let total = 0;
  const shown = [];
  for (const record of records) {
    for (const problem of validateRecord(record, schema)) {
      total += 1;
      if (shown.length < MAX_REPORTED) shown.push(problem);
    }
  }

  if (total === 0) {
    return { status: 'PASS', detail: `${records.length} records conform to registry/schema/catalog-v2.schema.json` };
  }
  return {
    status: 'FAIL',
    detail: `${total} schema violation${total === 1 ? '' : 's'} across ${records.length} records`,
    lines: shown,
  };
}

/* ---------- check 3: row-count integrity ---------- */

function checkRowCounts(parsed) {
  const lines = [];
  let failed = 0;
  for (const section of parsed.sections) {
    const parsedCount = section.records.length;
    const parsedDefaults = section.records.filter((r) => r.default_selected).length;
    if (parsedCount !== section.declaredCount) {
      failed += 1;
      lines.push(`${section.title}: heading at line ${section.headingLine} declares ${section.declaredCount} rows, parsed ${parsedCount}`);
    }
    if (parsedDefaults !== section.declaredDefaultCount) {
      failed += 1;
      lines.push(`${section.title}: heading at line ${section.headingLine} declares ${section.declaredDefaultCount} default-selected, parsed ${parsedDefaults}`);
    }
  }
  if (failed === 0) {
    const total = parsed.sections.reduce((sum, section) => sum + section.records.length, 0);
    return { status: 'PASS', detail: `${parsed.sections.length} sections, ${total} rows, every heading count matches the parse` };
  }
  return {
    status: 'FAIL',
    detail: `${failed} count mismatch${failed === 1 ? '' : 'es'} between section headings and parsed rows`,
    lines,
  };
}

/* ---------- check 4: install-command invariant ---------- */

function checkInstallInvariant(records) {
  const errors = [];
  const unverifiedSamples = [];
  let unverifiedWithCommand = 0;

  for (const record of records) {
    if (record.verification === 'verified' && record.install_cmd === null) {
      errors.push(
        `id "${record.id}" (line ${lineOf(record)}): verification "verified" but install_cmd is null — the schema invariant forbids this`,
      );
    }
    if (record.install_cmd !== null && record.verification === 'unverified') {
      unverifiedWithCommand += 1;
      if (unverifiedSamples.length < 5) unverifiedSamples.push(`${record.id} (line ${lineOf(record)})`);
    }
  }

  const warning =
    unverifiedWithCommand === 0
      ? null
      : `${unverifiedWithCommand} record${unverifiedWithCommand === 1 ? '' : 's'} with a non-null install_cmd but verification "unverified" (allowed during backfill): ${unverifiedSamples.join(', ')}${unverifiedWithCommand > unverifiedSamples.length ? ', ...' : ''}`;

  const summary = warning ?? 'no record has a non-null install_cmd while unverified';
  if (errors.length > 0) {
    return {
      status: 'FAIL',
      detail: `${errors.length} invariant violation${errors.length === 1 ? '' : 's'}; ${summary}`,
      lines: errors.slice(0, MAX_REPORTED),
      warning,
    };
  }
  return { status: 'PASS', detail: `0 invariant violations; ${summary}`, warning };
}

/* ---------- check 5: orphan references ---------- */

/*
  Recognised registry/data/overlaps.yaml shape:

    supersedes:            (or pairs_with:, or overlaps:)
      - group: <label>
        winner: <id>
        members:
          - id: <id>
            kind: <kind>

  Only scalars under a reference field (id, ids, winner, canonical, keep, drop, ...)
  are treated as id references; free-text fields such as group, note and reason are not.
*/
function readSimpleYaml(text) {
  const entries = [];
  const lines = text.split('\n');
  let inOverlaps = false;
  let current = null;
  let pendingKey = null;

  for (let i = 0; i < lines.length; i += 1) {
    const withoutComment = lines[i].replace(/(^|\s)#.*$/u, '$1');
    if (withoutComment.trim() === '') continue;
    const indent = withoutComment.length - withoutComment.trimStart().length;
    const body = withoutComment.trim();

    if (indent === 0) {
      inOverlaps = /^(overlaps|supersedes|pairs_with)\s*:/.test(body);
      current = null;
      pendingKey = null;
      continue;
    }
    if (!inOverlaps) continue;

    const startOfItem = body === '-' ? '' : body.startsWith('- ') ? body.slice(2).trim() : null;
    if (startOfItem !== null) {
      current = { line: i + 1, fields: new Map(), inline: [] };
      entries.push(current);
      pendingKey = null;
      if (startOfItem === '') continue;
      const asField = /^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/u.exec(startOfItem);
      if (asField) {
        pushField(current, asField[1], asField[2]);
        if (asField[2].trim() === '') pendingKey = asField[1];
      } else {
        current.inline.push(startOfItem);
      }
      continue;
    }

    if (!current) continue;
    const asField = /^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/u.exec(body);
    if (asField) {
      pushField(current, asField[1], asField[2]);
      pendingKey = asField[2].trim() === '' ? asField[1] : null;
      continue;
    }
    if (pendingKey) {
      pushField(current, pendingKey, body);
      continue;
    }
    current.inline.push(body);
  }

  return entries;
}

function pushField(entry, key, value) {
  const unquoted = value
    .trim()
    .replace(/^\[(.*)\]$/u, '$1')
    .replace(/^(['"])(.*)\1$/u, '$2');
  const values = unquoted === '' ? [] : unquoted.split(',').map((part) => part.trim().replace(/^(['"])(.*)\1$/u, '$2')).filter((part) => part !== '');
  entry.fields.set(key, [...(entry.fields.get(key) ?? []), ...values]);
}

function referencesFrom(entry) {
  const references = [];
  for (const [key, values] of entry.fields) {
    if (!REFERENCE_FIELDS.has(key)) continue;
    references.push(...values.map((value) => ({ value, key, line: entry.line })));
  }
  references.push(...entry.inline.map((value) => ({ value, key: 'bare list item', line: entry.line })));
  return references;
}

function checkOrphans(records) {
  if (!existsSync(OVERLAPS_YAML)) {
    return {
      status: 'SKIPPED',
      detail: 'registry/data/overlaps.yaml does not exist, so no cross-reference could be checked. A skipped check is not a passing check.',
    };
  }

  const known = new Set(records.map((record) => record.id));
  let entries;
  try {
    entries = readSimpleYaml(readFileSync(OVERLAPS_YAML, 'utf8'));
  } catch (error) {
    return { status: 'FAIL', detail: `could not read registry/data/overlaps.yaml: ${error.message}` };
  }

  if (entries.length === 0) {
    return {
      status: 'FAIL',
      detail: 'registry/data/overlaps.yaml has no entries under a "supersedes:", "pairs_with:" or "overlaps:" key, so the check evaluated nothing',
    };
  }

  let referenceCount = 0;
  const orphans = [];
  for (const entry of entries) {
    for (const reference of referencesFrom(entry)) {
      if (!ID_TOKEN_RE.test(reference.value)) continue;
      referenceCount += 1;
      if (!known.has(reference.value)) {
        orphans.push(`overlaps.yaml:${reference.line}: "${reference.value}" (${reference.key}) is not an id in the catalog`);
      }
    }
  }

  if (referenceCount === 0) {
    return {
      status: 'FAIL',
      detail: `registry/data/overlaps.yaml has ${entries.length} entries but the recognised shape yielded 0 id references, so the check evaluated nothing`,
    };
  }
  if (orphans.length > 0) {
    return {
      status: 'FAIL',
      detail: `${orphans.length} orphan reference${orphans.length === 1 ? '' : 's'} out of ${referenceCount} checked`,
      lines: orphans.slice(0, MAX_REPORTED),
    };
  }
  return { status: 'PASS', detail: `${referenceCount} id references across ${entries.length} overlap entries all resolve` };
}

/* ---------- check 6: duplicate ids ---------- */

function checkDuplicateIds(records) {
  const seen = new Map();
  const collisions = [];
  for (const record of records) {
    const key = `${record.kind}/${record.id}`;
    const previous = seen.get(key);
    if (previous) {
      collisions.push(
        `${record.kind} id "${record.id}" at lines ${previous.line} and ${lineOf(record)}: names "${previous.name}" and "${record.name}"`,
      );
    } else {
      seen.set(key, { name: record.name, line: lineOf(record) });
    }
  }
  if (collisions.length === 0) {
    return { status: 'PASS', detail: `${seen.size} ids, no collision within any kind` };
  }
  return {
    status: 'FAIL',
    detail: `${collisions.length} duplicate id${collisions.length === 1 ? '' : 's'} within a kind`,
    lines: collisions,
  };
}

/* ---------- report ---------- */

function report(results) {
  const out = process.stdout;
  const err = process.stderr;

  for (const result of results) {
    for (const line of result.lines ?? []) err.write(`  ! ${line}\n`);
    if (result.warning) err.write(`  * ${result.warning}\n`);
  }

  const nameWidth = Math.max(...results.map((r) => r.name.length));
  out.write('Vantrilex registry verification\n\n');
  out.write(`${'check'.padEnd(nameWidth)}  ${'status'.padEnd(7)}  detail\n`);
  out.write(`${'-'.repeat(nameWidth)}  ${'-'.repeat(7)}  ${'-'.repeat(64)}\n`);
  for (const result of results) {
    out.write(`${result.name.padEnd(nameWidth)}  ${result.status.padEnd(7)}  ${result.detail}\n`);
  }

  const failed = results.filter((r) => r.status === 'FAIL').length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const skipped = results.filter((r) => r.status === 'SKIPPED').length;
  out.write(`\ntotals: ${results.length} checks — ${passed} passed, ${failed} failed, ${skipped} skipped\n`);

  if (failed > 0) {
    out.write(`VERDICT: FAIL — ${failed} of ${results.length} checks did not pass. The registry is NOT clean.\n`);
    return 1;
  }
  if (skipped > 0) {
    out.write(`VERDICT: PASS WITH SKIPS — ${skipped} of ${results.length} checks skipped. A skipped check is not a passing check.\n`);
    return 0;
  }
  out.write(`VERDICT: PASS — all ${results.length} checks ran and passed. The registry is clean.\n`);
  return 0;
}

function main() {
  const buffer = readFileSync(CATALOG_MD);
  const results = [{ name: 'utf8-validity', ...checkUtf8(buffer) }];

  let loaded = null;
  let parseFailure = null;
  try {
    loaded = loadCatalog();
  } catch (error) {
    parseFailure = error;
  }

  if (parseFailure) {
    const reason = `catalog could not be parsed, so this check evaluated nothing: ${parseFailure.message}`;
    results.push({ name: 'schema-conformance', status: 'FAIL', detail: reason });
    for (const name of ['row-count-integrity', 'install-command-invariant', 'orphan-references', 'duplicate-ids']) {
      results.push({ name, status: 'SKIPPED', detail: reason });
    }
  } else {
    const { parsed, records, schema } = loaded;
    results.push({ name: 'schema-conformance', ...checkSchema(records, schema) });
    results.push({ name: 'row-count-integrity', ...checkRowCounts(parsed) });
    results.push({ name: 'install-command-invariant', ...checkInstallInvariant(records) });
    results.push({ name: 'orphan-references', ...checkOrphans(records) });
    results.push({ name: 'duplicate-ids', ...checkDuplicateIds(records) });
  }

  process.exitCode = report(results);
}

main();