#!/usr/bin/env node
'use strict';

/*
  score-priority.mjs — W-19 priority backfill for registry/data/skills.jsonl.

  Scores every skill row with the w19-v1 formula and writes the four v5
  priority fields back to the sidecar. Nothing else in the row is touched.

  Formula (w19-v1), per row:
    base                     = 5
    signals.class            = +1 if class === 'loadable'
                               OR (class === 'installable' AND install_cmd != null)
                               else 0        (never stacks; one point total)
    signals.when_to_use      = +2 if when_to_use is set, else 0
    signals.version_pin      = +1 if version_pin is set, else 0
    signals.install_cmd_null = -1 if class === 'installable' AND install_cmd == null
                               (a claim of installability with no command — contradiction)
                               else 0
    clamp(base + sum, 1, 10)

  Unscored decision (honest null): a row whose signals are ALL zero carries no
  discriminating information — a flat 5 would mean "no signal" disguised as a
  score. Such a row is emitted as priority null with priority_source
  "unscored" and a filled reason, NOT as 5 — with one carve-out: tier "core"
  is registry curation and is itself a signal, so a core row is always scored;
  and the four top-level ids below are always 10.

  Tier overrides (applied after the clamp, recorded in usage_signals.overrides):
    tier === 'core'                    -> priority at least 8
    id in TOP_LEVEL_10                 -> priority 10
      (vantrilex-prime, vantrilex-vanguard, vantrilex-doctrine,
       vantrilex-workflow-forge)

  Usage:
    node scripts/score-priority.mjs            compute, print report, WRITE skills.jsonl
    node scripts/score-priority.mjs --dry-run  compute, print report, write nothing
*/

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SKILLS_JSONL = join(ROOT, 'registry', 'data', 'skills.jsonl');

const FORMULA = 'w19-v1';
const PINNED_AT = '2026-11-11';
const BASE = 5;
const TOP_LEVEL_10 = new Set([
  'vantrilex-prime',
  'vantrilex-vanguard',
  'vantrilex-doctrine',
  'vantrilex-workflow-forge',
]);

const dryRun = process.argv.includes('--dry-run');
const unknownArgs = process.argv.slice(2).filter((arg) => arg !== '--dry-run');
if (unknownArgs.length > 0) {
  console.error(`unknown argument(s): ${unknownArgs.join(' ')} (only --dry-run is supported)`);
  process.exit(2);
}

const clamp = (value) => Math.max(1, Math.min(10, value));
const signed = (value, zeroSign) => (value > 0 ? `+${value}` : value < 0 ? `-${-value}` : `${zeroSign}0`);

function scoreRow(row) {
  const signals = {
    class: (row.class === 'loadable' || (row.class === 'installable' && row.install_cmd != null)) ? 1 : 0,
    when_to_use: row.when_to_use ? 2 : 0,
    version_pin: row.version_pin != null ? 1 : 0,
    install_cmd_null: row.class === 'installable' && row.install_cmd == null ? -1 : 0,
  };
  const zeroSignals =
    signals.class === 0 && signals.when_to_use === 0 && signals.version_pin === 0 && signals.install_cmd_null === 0;
  const isTopLevel = TOP_LEVEL_10.has(row.id);
  const isCore = row.tier === 'core';

  const usageSignals = {
    formula: FORMULA,
    signals: {
      class: signed(signals.class, "+"),
      when_to_use: signed(signals.when_to_use, "+"),
      version_pin: signed(signals.version_pin, "+"),
      install_cmd_null: signed(signals.install_cmd_null, "-"),
    },
    pinned_at: PINNED_AT,
  };

  if (zeroSignals && !isCore && !isTopLevel) {
    return {
      priority: null,
      priority_source: 'unscored',
      priority_set_at: PINNED_AT,
      usage_signals: {
        ...usageSignals,
        reason:
          'no discriminating signal: not loadable, no install_cmd metadata, when_to_use absent, ' +
          'version_pin absent, no installability contradiction; tier is not core; id is not a top-level skill',
      },
      overrides: [],
    };
  }

  let priority = clamp(BASE + signals.class + signals.when_to_use + signals.version_pin + signals.install_cmd_null);
  const raw = priority;
  const overrides = [];
  if (isCore && priority < 8) {
    priority = 8;
    overrides.push('core_min_8');
  }
  if (isTopLevel && priority < 10) {
    priority = 10;
    overrides.push('top_level_10');
  }
  if (overrides.length > 0) usageSignals.overrides = overrides;
  return {
    priority,
    priority_source: 'derived',
    priority_set_at: PINNED_AT,
    usage_signals: usageSignals,
    overrides: overrides.map((name) => ({ id: row.id, from: raw, to: priority, override: name })),
  };
}

const raw = readFileSync(SKILLS_JSONL, 'utf8');
const lines = raw.split('\n');
if (lines[lines.length - 1] === '') lines.pop();
const rows = lines.map((line, index) => {
  if (!line.trim()) throw new Error(`${SKILLS_JSONL}:${index + 1}: blank line`);
  const parsed = JSON.parse(line);
  if (parsed.kind !== 'skill') {
    throw new Error(`${SKILLS_JSONL}:${index + 1}: row kind is ${JSON.stringify(parsed.kind)}, expected "skill"`);
  }
  return parsed;
});

const scored = [];
const overridden = [];
for (const row of rows) {
  const result = scoreRow(row);
  row.priority = result.priority;
  row.priority_source = result.priority_source;
  row.priority_set_at = result.priority_set_at;
  row.usage_signals = result.usage_signals;
  if (result.priority !== null) scored.push(result.priority);
  overridden.push(...result.overrides);
}

const histogram = new Map();
for (const value of scored) histogram.set(value, (histogram.get(value) ?? 0) + 1);
const unscored = rows.length - scored.length;

console.log(`score-priority: formula ${FORMULA}, pinned_at ${PINNED_AT}`);
console.log(`mode: ${dryRun ? 'DRY-RUN (no files written)' : 'WRITE'}`);
console.log(`rows read: ${rows.length}`);
console.log('histogram (priority: count)');
for (let value = 1; value <= 10; value += 1) {
  console.log(`  ${value}: ${histogram.get(value) ?? 0}`);
}
console.log(`  null (unscored): ${unscored}`);
console.log(`scored: ${scored.length}, unscored: ${unscored}, accounted: ${scored.length + unscored}`);
console.log(`overrides applied: ${overridden.length}`);
for (const entry of overridden) {
  console.log(`  ${entry.id}: ${entry.from} -> ${entry.to} (${entry.override})`);
}

if (!dryRun) {
  writeFileSync(SKILLS_JSONL, rows.map((row) => JSON.stringify(row)).join('\n') + '\n', 'utf8');
  console.log(`written: ${SKILLS_JSONL}`);
}
