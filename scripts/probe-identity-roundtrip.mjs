#!/usr/bin/env node
// Usage: node scripts/probe-identity-roundtrip.mjs
//
// A1 identity round-trip probe (file-evidence legs).
// Asserts the identity triple per seat from files on disk, states the
// per-response identity contract, names the explicit fallback, and quotes
// the live V-switch legs as operator-run procedure. Live legs are NEVER
// faked green: they print as OPERATOR-RUN and do not affect the exit code.
// Exit 0 certifies the file-evidence legs only.

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Identity triple table (sole source; exact match required).
const TRIPLE = {
  AETHER: { id: 'aether', file: '.opencode/agents/aether.md', accent: '#14B8A6' },
  BLAZAR: { id: 'blazar', file: '.opencode/agents/blazar.md', accent: '#4169E1' },
  PULSAR: { id: 'pulsar', file: '.opencode/agents/pulsar.md', accent: '#C026D3' },
};

const V_COMMANDS = {
  AETHER: { file: '.opencode/commands/V-AETHER.md', accent: '#14B8A6' },
  BLAZAR: { file: '.opencode/commands/V-Blazar.md', accent: '#4169E1' },
  PULSAR: { file: '.opencode/commands/V-PULSAR.md', accent: '#C026D3' },
};

let failures = 0;

function readRel(rel) {
  return readFileSync(path.join(ROOT, rel), 'utf8');
}

function check(label, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} -- ${detail}`);
  if (!ok) failures += 1;
}

// A1-1: single source of truth — id and accent in each definition file.
for (const seat of Object.keys(TRIPLE)) {
  const t = TRIPLE[seat];
  const abs = path.join(ROOT, t.file);
  if (!existsSync(abs)) {
    check(`triple/${seat}`, false, `${t.file} missing on disk`);
    continue;
  }
  const body = readRel(t.file);
  const nameMatch = body.match(/^name:\s*(\S+)/m);
  const colorMatch = body.match(/^color:\s*"([^"]+)"/m);
  const idOk = nameMatch !== null && nameMatch[1] === t.id;
  const accentOk = colorMatch !== null && colorMatch[1] === t.accent;
  check(
    `triple/${seat}`,
    idOk && accentOk,
    `${t.file} id=${nameMatch ? nameMatch[1] : 'ABSENT'} accent=${colorMatch ? colorMatch[1] : 'ABSENT'}`,
  );
}

// A1-2 (atomic switch or LOUD failure) + A1-3 (per-response identity):
// each V-command carries Step 1, Step 2 with the exact accent, the R0a
// WORKAROUND loud-failure note, and the four-item Final reply.
for (const seat of Object.keys(V_COMMANDS)) {
  const v = V_COMMANDS[seat];
  const abs = path.join(ROOT, v.file);
  if (!existsSync(abs)) {
    check(`v-command/${seat}`, false, `${v.file} missing on disk`);
    continue;
  }
  const body = readRel(v.file);
  const markers = [
    '## Step 1',
    '## Step 2',
    v.accent,
    'R0a WORKAROUND',
    'no agent-switch entry',
    '## Final reply',
    '**Agent**',
    '**Theme**',
    '**Mechanism**',
  ];
  const missing = markers.filter((m) => !body.includes(m));
  check(
    `v-command/${seat}`,
    missing.length === 0,
    missing.length === 0
      ? `${v.file} switch steps + accent ${v.accent} + R0a note + final-reply triple present`
      : `${v.file} missing: ${missing.join(', ')}`,
  );
}

// A1-5: explicit fallback named (standing law while the R0a note holds).
console.log(
  'FALLBACK-NAMED  session-restart-per-switch: one fresh session per leader, '
  + 'entered through exactly one V-command, with an identity probe before any '
  + 'work. Applies while the R0a note holds (no atomic primitive exists).',
);

// A1-4 round-trip legs: live V-switch cannot execute from shell.
// Quoted as operator-run procedure, never executed here.
console.log('OPERATOR-RUN  leg 1: fresh session, run `V-AETHER <task>`, then ask '
  + '`state agent id, definition file, and theme accent` -- expect '
  + '`aether | .opencode/agents/aether.md | #14B8A6`.');
console.log('OPERATOR-RUN  leg 2: fresh session, run `V-Blazar <task>`, then ask '
  + 'the identity question -- expect '
  + '`blazar | .opencode/agents/blazar.md | #4169E1`.');
console.log('OPERATOR-RUN  leg 3: fresh session, run `V-AETHER <task>` again, '
  + 'then ask the identity question -- expect the AETHER triple again. '
  + 'Any mismatch is STOP with the decline capsule.');

// A1-6: regression gate entry. No battery definition file exists on disk
// (implementer live search 2026-10-17: `*battery*` 0 hits, `**/*battery*` 0
// hits, `**/*regress*` 0 hits), so the entry is PENDING, reported here —
// never invented as new machinery by this probe.
console.log('GATE-ENTRY  PENDING -- no battery definition file on disk; when the '
  + 'owning lane authors one, register `node scripts/probe-identity-roundtrip.mjs '
  + '&& node scripts/probe-identity-misaddressed.mjs` exit 0 per '
  + 'VTA-FACTORY-PLAN-SURGICAL.md phase P0.');

console.log(
  failures === 0
    ? 'RESULT: PASS (file-evidence legs) -- exit 0; operator legs quoted as procedure, not executed.'
    : `RESULT: FAIL -- ${failures} file-evidence leg(s) failed.`,
);
process.exit(failures === 0 ? 0 : 1);
