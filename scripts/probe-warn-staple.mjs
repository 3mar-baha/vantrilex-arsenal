#!/usr/bin/env node
/*
 * probe-warn-staple — zero-dependency probe for the D64 warn staple line
 * (F-15; D64 residuals (b) and (c)).
 *
 * Exercises the exported warn-append path in .opencode/plugin/arsenal.ts:
 *
 *   musterWarnStaple(input)          — the pure decision: returns D64's staple
 *                                      line verbatim when a kind is below half
 *                                      the rank minimum, else null.
 *   appendMusterWarnStaple(sink, …)  — the append path: pushes the staple into
 *                                      the `pendingWarnings` channel that the
 *                                      V2 tool.execute.after adapter drains
 *                                      into the tool output.
 *
 * The half-minimum arithmetic is `count * 2 < min` (strictly below half,
 * integer-exact); the probe proves the boundary for every rank/kind minimum
 * (zenith 15/5, syzygy 10/4, asterism 5/2), the exact staple text, the drain
 * into a tool-output-shaped string, and the fail-open edges (unknown rank,
 * NaN counts, malformed sink).
 *
 * Exit status: 0 — every probe passed; 1 — at least one probe failed.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arsenalUrl = pathToFileURL(path.join(root, '.opencode', 'plugin', 'arsenal.ts')).href;

let passed = 0;
let failed = 0;
const ok = (label, condition) => {
  if (condition) {
    passed += 1;
    console.log(`PASS ${label}`);
  } else {
    failed += 1;
    console.log(`FAIL ${label}`);
  }
};
const eq = (label, actual, expected) =>
  ok(`${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`, actual === expected);

const arsenal = await import(arsenalUrl);
const { musterWarnStaple, appendMusterWarnStaple } = arsenal;

ok('musterWarnStaple is exported', typeof musterWarnStaple === 'function');
ok('appendMusterWarnStaple is exported', typeof appendMusterWarnStaple === 'function');

// --- Staple format (D64 decision 1, verbatim) -----------------------------
eq(
  'staple text is D64 verbatim',
  musterWarnStaple({ rank: 'asterism', skills: 2, mcps: 0 }),
  '[muster] rank asterism has used 2/5 required skills, 0/2 required MCPs',
);
eq(
  'staple text, zenith',
  musterWarnStaple({ rank: 'zenith', skills: 7, mcps: 5 }),
  '[muster] rank zenith has used 7/15 required skills, 5/5 required MCPs',
);
eq(
  'staple text, syzygy',
  musterWarnStaple({ rank: 'syzygy', skills: 10, mcps: 1 }),
  '[muster] rank syzygy has used 10/10 required skills, 1/4 required MCPs',
);

// --- Half-minimum arithmetic: count * 2 < min (boundary probes) -----------
// zenith skills 15: 7 warns (14<15), 8 does not (16>=15)
eq('zenith skills 7/15 fires', musterWarnStaple({ rank: 'zenith', skills: 7, mcps: 3 }) !== null, true);
eq('zenith skills 8/15 silent', musterWarnStaple({ rank: 'zenith', skills: 8, mcps: 3 }), null);
// zenith mcps 5: 2 warns (4<5), 3 does not (6>=5)
eq('zenith mcps 2/5 fires', musterWarnStaple({ rank: 'zenith', skills: 8, mcps: 2 }) !== null, true);
eq('zenith mcps 3/5 silent', musterWarnStaple({ rank: 'zenith', skills: 8, mcps: 3 }), null);
// syzygy skills 10: 4 warns (8<10), 5 does not (10>=10)
eq('syzygy skills 4/10 fires', musterWarnStaple({ rank: 'syzygy', skills: 4, mcps: 2 }) !== null, true);
eq('syzygy skills 5/10 silent', musterWarnStaple({ rank: 'syzygy', skills: 5, mcps: 2 }), null);
// syzygy mcps 4 (even minimum): 1 warns (2<4), 2 does not (4>=4)
eq('syzygy mcps 1/4 fires', musterWarnStaple({ rank: 'syzygy', skills: 5, mcps: 1 }) !== null, true);
eq('syzygy mcps 2/4 silent', musterWarnStaple({ rank: 'syzygy', skills: 5, mcps: 2 }), null);
// asterism skills 5: 2 warns (4<5), 3 does not (6>=5)
eq('asterism skills 2/5 fires', musterWarnStaple({ rank: 'asterism', skills: 2, mcps: 1 }) !== null, true);
eq('asterism skills 3/5 silent', musterWarnStaple({ rank: 'asterism', skills: 3, mcps: 1 }), null);
// asterism mcps 2 (even minimum): 0 warns (0<2), 1 does not (2>=2)
eq('asterism mcps 0/2 fires', musterWarnStaple({ rank: 'asterism', skills: 3, mcps: 0 }) !== null, true);
eq('asterism mcps 1/2 silent', musterWarnStaple({ rank: 'asterism', skills: 3, mcps: 1 }), null);

// --- Both kinds above half -> silent even at 0/undefined extremes ---------
eq('zenith at half/above stays silent', musterWarnStaple({ rank: 'zenith', skills: 8, mcps: 3 }), null);
eq('above minimum stays silent', musterWarnStaple({ rank: 'asterism', skills: 5, mcps: 2 }), null);

// --- Fail-open edges --------------------------------------------------------
eq('unknown rank returns null', musterWarnStaple({ rank: 'quartz', skills: 0, mcps: 0 }), null);
eq('NaN counts stay silent', musterWarnStaple({ rank: 'asterism', skills: Number.NaN, mcps: Number.NaN }), null);
eq('Infinity skills does not mask below-half mcps', musterWarnStaple({ rank: 'syzygy', skills: Number.POSITIVE_INFINITY, mcps: 0 }) !== null, true); // mcps 0*2<4 fires; Infinity skills leg does not
eq('append: malformed sink returns false', appendMusterWarnStaple({}, { rank: 'asterism', skills: 0, mcps: 0 }), false);
eq('append: null sink returns false', appendMusterWarnStaple(null, { rank: 'asterism', skills: 0, mcps: 0 }), false);

// --- Append path: the pendingWarnings channel --------------------------------
const sink = { pendingWarnings: [] };
eq('append: warn fires, returns true', appendMusterWarnStaple(sink, { rank: 'asterism', skills: 2, mcps: 0 }), true);
eq('append: exactly one staple queued', sink.pendingWarnings.length, 1);
eq(
  'append: queued staple is the D64 line',
  sink.pendingWarnings[0],
  '[muster] rank asterism has used 2/5 required skills, 0/2 required MCPs',
);

const sinkQuiet = { pendingWarnings: [] };
eq('append: silent case returns false', appendMusterWarnStaple(sinkQuiet, { rank: 'asterism', skills: 3, mcps: 1 }), false);
eq('append: silent case queues nothing', sinkQuiet.pendingWarnings.length, 0);

// --- Drain: the same join the V2 tool.execute.after adapter performs --------
const drained = [...sink.pendingWarnings, 'pre-existing warning'].join('\n');
ok('drain: tool output carries the staple line', drained.includes('[muster] rank asterism has used 2/5 required skills, 0/2 required MCPs'));
ok('drain: tool output keeps pre-existing warnings', drained.includes('pre-existing warning'));

// --- Greppability: the staple is stable and matchable -------------------------
ok('staple greps as [muster] rank <rank> has used', /^\[muster\] rank [a-z]+ has used \d+\/\d+ required skills, \d+\/\d+ required MCPs$/.test(musterWarnStaple({ rank: 'syzygy', skills: 4, mcps: 1 })));

console.log(`probe-warn-staple: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('PROBE: FAIL');
  process.exit(1);
}
console.log('PROBE: PASS');
