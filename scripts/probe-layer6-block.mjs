#!/usr/bin/env node
/*
 * probe-layer6-block — unit probe for the Layer 6 block-rung decision
 * (F-38/WS8; D64 decision 3; shipped DISABLED).
 *
 * Feeds below-minimum, at-minimum and malformed count sets into the pure
 * decision exported by .opencode/plugin/arsenal.ts and prints PASS/FAIL:
 *
 *   ladderBlockEnabled(env, measured)  — the owner gate: BOTH the
 *                                         VANTRILEX_LADDER_BLOCK flag AND the
 *                                         recorded >=10-measured-tasks promotion
 *                                         are required. As shipped, the
 *                                         promotion ledger LADDER_BLOCK_MEASURED_TASKS
 *                                         is 0, so the rung cannot engage.
 *   ladderBlockDecision(input)         — the pure decision: below the rank
 *                                         minimum -> would-block with a
 *                                         `[vantrilex-ladder] BLOCK:` reason
 *                                         naming rank/kind/count/minimum;
 *                                         at/above -> silence; malformed
 *                                         (NaN/negative/unknown rank) ->
 *                                         fail-open per the ladder law.
 *   appendLadderBlockNotice(sink, n)   — the `pendingBlocks` queue, same
 *                                         semantics as `pendingWarnings`.
 *   enforceLadderBlock(arsenal, ev)    — the wired entry: fail-open by default,
 *                                         no counts provider -> no block, a
 *                                         throwing provider -> no block. As
 *                                         shipped it can NEVER throw, because
 *                                         the promotion ledger is 0; the
 *                                         decision path with enabled=true is
 *                                         demonstrated through the pure
 *                                         decision and the live host probe.
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
const {
  ladderBlockEnabled,
  ladderBlockDecision,
  appendLadderBlockNotice,
  enforceLadderBlock,
  LADDER_BLOCK_ENV,
  LADDER_BLOCK_MEASURED_TASKS,
  LADDER_BLOCK_REQUIRED_MEASURED,
  LADDER_BLOCK_MESSAGE_PREFIX,
} = arsenal;

// --- The as-shipped state ---------------------------------------------------
eq('promotion ledger ships at 0', LADDER_BLOCK_MEASURED_TASKS, 0);
eq('D64 decision 3 threshold is 10', LADDER_BLOCK_REQUIRED_MEASURED, 10);
eq('env flag name is VANTRILEX_LADDER_BLOCK', LADDER_BLOCK_ENV, 'VANTRILEX_LADDER_BLOCK');

// --- The owner gate: BOTH conditions, neither alone -------------------------
eq('gate: env unset, promotion 0 -> disabled', ladderBlockEnabled(undefined), false);
eq('gate: env=1, promotion unrecorded (0) -> disabled', ladderBlockEnabled('1'), false);
eq('gate: env=1, promotion 9 -> disabled', ladderBlockEnabled('1', 9), false);
eq('gate: env=1, promotion 10 -> enabled (owner path)', ladderBlockEnabled('1', 10), true);
eq('gate: env=TRUE, promotion 10 -> enabled (case-insensitive)', ladderBlockEnabled('TRUE', 10), true);
eq('gate: env=true, promotion 10 -> enabled', ladderBlockEnabled('true', 10), true);
eq('gate: env=false, promotion 10 -> disabled', ladderBlockEnabled('false', 10), false);
eq('gate: env=yes, promotion 10 -> disabled (not a truthy spelling)', ladderBlockEnabled('yes', 10), false);

// --- Pure decision: the block fires strictly BELOW the rank minimum ----------
eq('decision: disabled gate stays silent even at 0/5 skills', ladderBlockDecision({ rank: 'asterism', skills: 0, mcps: 0, enabled: false }).block, false);
{
  const d = ladderBlockDecision({ rank: 'asterism', skills: 4, mcps: 2, enabled: true });
  ok('below-min skills -> would-block', d.block === true);
  ok('reason begins with [vantrilex-ladder] BLOCK:', d.reason !== null && d.reason.startsWith(LADDER_BLOCK_MESSAGE_PREFIX));
  ok('reason names rank, kind, count and minimum', d.reason !== null && d.reason.includes('rank asterism skills 4/5') && d.reason.includes('deficit 1'));
}
{
  const d = ladderBlockDecision({ rank: 'zenith', skills: 14, mcps: 4, enabled: true });
  ok('below-min BOTH kinds -> would-block', d.block === true);
  ok('reason carries both deficits', d.reason !== null && d.reason.includes('skills 14/15') && d.reason.includes('MCPs 4/5'));
}
eq('at-minimum (asterism 5/5 skills, 2/2 MCPs) -> silence', ladderBlockDecision({ rank: 'asterism', skills: 5, mcps: 2, enabled: true }).block, false);
eq('above-minimum (asterism 9/5, 3/2) -> silence', ladderBlockDecision({ rank: 'asterism', skills: 9, mcps: 3, enabled: true }).block, false);
eq('block owns the line: zenith 14/15 skills -> would-block (warn owns half)', ladderBlockDecision({ rank: 'zenith', skills: 14, mcps: 5, enabled: true }).block, true);
eq('at the line: zenith 15/15, 5/5 -> silence', ladderBlockDecision({ rank: 'zenith', skills: 15, mcps: 5, enabled: true }).block, false);
eq('syzygy boundary: 4/4 MCPs at-minimum -> silence', ladderBlockDecision({ rank: 'syzygy', skills: 10, mcps: 4, enabled: true }).block, false);
eq('syzygy boundary: 3/4 MCPs below -> would-block', ladderBlockDecision({ rank: 'syzygy', skills: 10, mcps: 3, enabled: true }).block, true);

// --- Malformed inputs: fail-open, never a block on bad evidence -------------
eq('unknown rank -> silence', ladderBlockDecision({ rank: 'quartz', skills: 0, mcps: 0, enabled: true }).block, false);
eq('NaN skills, at-min MCPs -> silence', ladderBlockDecision({ rank: 'asterism', skills: Number.NaN, mcps: 2, enabled: true }).block, false);
eq('negative skills, at-min MCPs -> silence (malformed fails open)', ladderBlockDecision({ rank: 'asterism', skills: -1, mcps: 2, enabled: true }).block, false);
{
  const d = ladderBlockDecision({ rank: 'asterism', skills: 4, mcps: Number.NaN, enabled: true });
  ok('NaN MCPs do not block the MCPs leg', d.reason !== null && !d.reason.includes('MCPs'));
  ok('NaN MCPs do not mask a below-min skills deficit', d.block === true && d.reason !== null && d.reason.includes('skills 4/5'));
}

// --- The pendingBlocks queue: same semantics as pendingWarnings -------------
{
  const sink = { pendingBlocks: [] };
  eq('queue: append returns true', appendLadderBlockNotice(sink, '[vantrilex-ladder] BLOCK: demo'), true);
  eq('queue: exactly one notice', sink.pendingBlocks.length, 1);
  const drained = [...sink.pendingBlocks, 'pre-existing warning'].join('\n');
  ok('drain: tool output carries the notice', drained.includes(LADDER_BLOCK_MESSAGE_PREFIX));
  ok('drain: pre-existing warnings kept', drained.includes('pre-existing warning'));
}
eq('queue: malformed sink ({}) returns false', appendLadderBlockNotice({}, '[vantrilex-ladder] BLOCK: demo'), false);
eq('queue: null sink returns false', appendLadderBlockNotice(null, '[vantrilex-ladder] BLOCK: demo'), false);
eq('queue: empty notice returns false', appendLadderBlockNotice({ pendingBlocks: [] }, ''), false);

// --- The wired entry: fail-open as shipped -----------------------------------
const makeArsenal = (env, provider) => ({
  rt: { proc: { env } },
  pendingBlocks: [],
  ladderCountsProvider: provider ?? null,
});
const belowMin = { rank: 'asterism', confirmedSkills: 0, confirmedMcps: 0 };
const atMin = { rank: 'asterism', confirmedSkills: 5, confirmedMcps: 2 };
{
  const a = makeArsenal({}, () => belowMin);
  let threw = false;
  try { await enforceLadderBlock(a, { sessionID: 'ses_probe', tool: 'shell' }); } catch { threw = true; }
  ok('wired: default (env unset) + below-min provider -> no throw', !threw);
  eq('wired: default queues nothing', a.pendingBlocks.length, 0);
}
{
  const a = makeArsenal({ [LADDER_BLOCK_ENV]: '1' }, () => belowMin);
  let threw = false;
  try { await enforceLadderBlock(a, { sessionID: 'ses_probe', tool: 'shell' }); } catch { threw = true; }
  ok('wired: env=1 but promotion unrecorded -> STILL no throw (D64 decision 3)', !threw);
  eq('wired: env=1 unpromoted queues nothing', a.pendingBlocks.length, 0);
}
{
  const a = makeArsenal({}, undefined);
  let threw = false;
  try { await enforceLadderBlock(a, { sessionID: 'ses_probe', tool: 'shell' }); } catch { threw = true; }
  ok('wired: no counts provider -> no throw (fail-open, D63 decision 4)', !threw);
}
{
  const a = makeArsenal({ [LADDER_BLOCK_ENV]: '1' }, () => { throw new Error('provider boom'); });
  let threw = false;
  try { await enforceLadderBlock(a, { sessionID: 'ses_probe', tool: 'shell' }); } catch { threw = true; }
  ok('wired: provider that throws -> no throw (fail-open)', !threw);
}
{
  const a = makeArsenal({ [LADDER_BLOCK_ENV]: '1' }, () => atMin);
  let threw = false;
  try { await enforceLadderBlock(a, { sessionID: 'ses_probe', tool: 'shell' }); } catch { threw = true; }
  ok('wired: at-minimum provider -> no throw', !threw);
}
{
  const a = makeArsenal({}, () => null);
  let threw = false;
  try { await enforceLadderBlock(a, { sessionID: 'ses_probe', tool: 'shell' }); } catch { threw = true; }
  ok('wired: provider resolves null -> no throw', !threw);
}

console.log(`probe-layer6-block: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('PROBE: FAIL');
  process.exit(1);
}
console.log('PROBE: PASS');
