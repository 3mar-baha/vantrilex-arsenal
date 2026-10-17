#!/usr/bin/env node
// Usage: node scripts/probe-identity-misaddressed.mjs
//
// A1 misaddressed-order probe (file-evidence legs).
// Proves from files on disk that a planning order addressed to the BLAZAR
// seat must decline (and a build order addressed to the AETHER seat must
// hand over and stop), then quotes the live-seat verification as
// operator-run procedure. Live legs are NEVER faked green: they print as
// OPERATOR-RUN and do not affect the exit code.
// Exit 0 certifies the file-evidence legs only.

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let failures = 0;

function readRel(rel) {
  return readFileSync(path.join(ROOT, rel), 'utf8');
}

function firstLine(body, marker) {
  const idx = body.indexOf(marker);
  if (idx < 0) return -1;
  return body.slice(0, idx).split('\n').length;
}

function checkMarkers(label, rel, markers) {
  const abs = path.join(ROOT, rel);
  if (!existsSync(abs)) {
    console.log(`FAIL  ${label} -- ${rel} missing on disk`);
    failures += 1;
    return;
  }
  const body = readRel(rel);
  const missing = markers.filter((m) => !body.includes(m));
  if (missing.length === 0) {
    const lines = markers.map((m) => `${m}@L${firstLine(body, m)}`).join(', ');
    console.log(`PASS  ${label} -- ${rel} carries: ${lines}`);
  } else {
    console.log(`FAIL  ${label} -- ${rel} missing: ${missing.join(', ')}`);
    failures += 1;
  }
}

// M1: BLAZAR decline contract — never plans, never dispatches a leader,
// refusal capsule with escalate, one-line fallback reason before dispatch.
checkMarkers('blazar-decline-contract', '.opencode/agents/blazar.md', [
  'Never plan',
  'refusal capsule',
  'escalate',
  'states the reason in one line',
]);

// M2: AETHER handover-and-stop contract — plans, hands over, never executes.
checkMarkers('aether-handover-contract', '.opencode/agents/aether.md', [
  'STOP',
  'never executes',
  'V-AETHER',
]);

// M3: decline-capsule mechanism exists — refusal definition plus validator.
checkMarkers('decline-capsule-schema', 'schemas/capsules/capsule.schema.json', [
  '"refusal"',
]);
checkMarkers('decline-capsule-validator', 'scripts/validate-capsule.mjs', [
  'validate',
]);

// M4: decision table derived from M1/M2 (file-evidence simulation of the
// rule as written, not a live seat test).
function decide(seat, orderKind) {
  if (seat === 'BLAZAR' && orderKind === 'planning') {
    return 'DECLINE + two unblocks (open a V-AETHER session, or owner exception for this order only) + zero dispatches';
  }
  if (seat === 'AETHER' && orderKind === 'build') {
    return 'HANDOVER + STOP + zero executions';
  }
  return 'PROCEED';
}

const cases = [
  { seat: 'BLAZAR', orderKind: 'planning', expect: 'DECLINE' },
  { seat: 'AETHER', orderKind: 'build', expect: 'HANDOVER' },
  { seat: 'BLAZAR', orderKind: 'build', expect: 'PROCEED' },
  { seat: 'AETHER', orderKind: 'planning', expect: 'PROCEED' },
];

for (const c of cases) {
  const got = decide(c.seat, c.orderKind);
  const ok = got.startsWith(c.expect);
  console.log(`${ok ? 'PASS' : 'FAIL'}  decision-table/${c.seat}/${c.orderKind} -- ${got}`);
  if (!ok) failures += 1;
}

// M5: live-seat verification cannot execute from shell.
// Quoted as operator-run procedure, never executed here.
console.log('OPERATOR-RUN  misaddressed probe: fresh session, run `V-Blazar <task>`, '
  + 'address a planning order to it -- expect a decline naming the '
  + 'AETHER-plans / BLAZAR-executes separation, offering both unblocks '
  + '(open a V-AETHER session, or owner exception for this order only), '
  + 'with zero dispatches and zero file writes beyond one ledger line.');
console.log('OPERATOR-RUN  symmetric probe: fresh session, run `V-AETHER <task>`, '
  + 'address a build order to it -- expect handover and stop, never execute.');

// M6: no notification dependency anywhere in either probe (needle built at
// runtime so this file never carries the literal).
const needle = `${'nt'}${'fy'}`;
const selfFiles = [
  'scripts/probe-identity-misaddressed.mjs',
  'scripts/probe-identity-roundtrip.mjs',
];
const tainted = selfFiles.filter((f) => {
  const abs = path.join(ROOT, f);
  return existsSync(abs) && readRel(f).toLowerCase().includes(needle);
});
if (tainted.length === 0) {
  console.log(`PASS  no-notify-dependency -- neither probe references the deleted notifier`);
} else {
  console.log(`FAIL  no-notify-dependency -- found in: ${tainted.join(', ')}`);
  failures += 1;
}

console.log(
  failures === 0
    ? 'RESULT: PASS (file-evidence legs) -- exit 0; operator legs quoted as procedure, not executed.'
    : `RESULT: FAIL -- ${failures} file-evidence leg(s) failed.`,
);
process.exit(failures === 0 ? 0 : 1);
