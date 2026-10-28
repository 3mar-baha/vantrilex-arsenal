#!/usr/bin/env node
'use strict';

// verify-smart-compact.mjs — LD-01 Smart compact gate harness (0.9.1).
//
// Usage:
//   node scripts/verify-smart-compact.mjs [--tsc <path-to-tsc.js>]
//
// What it does: compiles `.opencode/plugin/arsenal.ts` to a temp dir with the
// repo's own TypeScript, imports the emitted module, and runs the LD-01 exit
// gates as named checks with a PASS/FAIL/UNVERIFIED table:
//   T5-baseline — wrong turns are kept and tagged (V3 amendment dod)
//   T6-recover — every dropped span restores byte-exactly from its pointer
//   baseline   — smart compact beats the simple truncate baseline by measure
//   cost       — pre-digestion cost is measured and below what compact saves
//   prefix     — the stable-byte prefix survives byte-identical
//   limits     — hook respects fixed V1/V2 limits (no summarizer-prompt swap,
//                no separate compact-model pick, no V2 compaction registration)
//   input-safe — vendor+fingerprint at accept, MCP baselines at accept,
//                executable/credential held at candidate until gates prove
//
// Live-fire items that need a real host session (V2 compaction firing, real
// provider overflow) are reported UNVERIFIED with the exact blocker, never
// green-by-association.
//
// Node 25, ESM, zero dependencies. One named check per rule.

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(SCRIPT_PATH));
const PLUGIN_TS = join(ROOT, '.opencode', 'plugin', 'arsenal.ts');

const results = [];
const check = (name, status, detail) => {
  results.push({ name, status, detail });
};

const tscFromArgs = () => {
  const flag = process.argv.indexOf('--tsc');
  if (flag !== -1 && process.argv[flag + 1]) return resolve(process.argv[flag + 1]);
  const env = (process.env.SMART_COMPACT_TSC || '').trim();
  if (env) return env;
  return null;
};

const findTsc = () => {
  const direct = tscFromArgs();
  if (direct) return direct;
  for (const candidate of [
    join(ROOT, 'node_modules', 'typescript', 'lib', 'tsc.js'),
    join(ROOT, '.opencode', 'node_modules', 'typescript', 'lib', 'tsc.js'),
  ]) {
    try {
      readFileSync(candidate);
      return candidate;
    } catch {
      // keep searching
    }
  }
  return null;
};

/* ---------- check 1: compile the shipped TS to temp and import it ---------- */

const loadPluginModule = () => {
  const tsc = findTsc();
  if (!tsc) {
    check('compile', 'UNVERIFIED', 'no TypeScript compiler found (repo node_modules absent and no --tsc path); cannot execute the shipped module');
    return null;
  }
  let workdir = '';
  try {
    workdir = mkdtempSync(join(tmpdir(), 'smart-compact-'));
    execFileSync(process.execPath, [tsc, '-p', ROOT, '--noEmit', 'false', '--outDir', workdir], {
      cwd: ROOT,
      stdio: 'pipe',
      timeout: 180000,
    });
    // tsc infers rootDir from the tsconfig `files` list (here the plugin
    // dir), so the emit lands at the temp root; the nested path is kept as
    // a fallback if a future rootDir ever changes the layout.
    const direct = join(workdir, 'arsenal.js');
    const nested = join(workdir, 'plugin', 'arsenal.js');
    let emitted = '';
    for (const candidate of [direct, nested]) {
      try {
        readFileSync(candidate);
        emitted = candidate;
        break;
      } catch {
        // try the next layout
      }
    }
    if (!emitted) throw new Error(`emit not found (tried ${direct} and ${nested})`);
    return { workdir, emitted };
  } catch (error) {
    check('compile', 'FAIL', `tsc emit failed: ${(error && error.message ? error.message : String(error)).split('\n').slice(0, 5).join(' | ')}`);
    if (workdir) {
      try { rmSync(workdir, { recursive: true, force: true }); } catch { /* ignore */ }
    }
    return null;
  }
};

/* ---------- deterministic fixture (no clock, no randomness) ---------- */

const fixtureBody = () => {
  const lines = [];
  // ~1200 lines x ~90 chars ≈ 108k chars ≈ 27k tokens: larger than the
  // 60k-char survivor budget, so compacting genuinely drops spans and the
  // T6/baseline gates exercise real loss, never a vacuous empty drop.
  for (let i = 1; i <= 1200; i++) {
    lines.push(`log line ${String(i).padStart(4, '0')}: routine transcript filler for the compact window measurement`);
  }
  return lines.join('\n');
};

/* ---------- main ---------- */

const main = async () => {
  let source = '';
  try {
    source = readFileSync(PLUGIN_TS, 'utf8');
  } catch {
    check('source', 'FAIL', `cannot read ${PLUGIN_TS}`);
    report();
    return;
  }
  check('source', 'PASS', `read ${source.length} chars from .opencode/plugin/arsenal.ts`);

  const REQUIRED_EXPORTS = [
    'newDigestState',
    'estimateTokens',
    'shouldCompact',
    'synthesizeSummary',
    'selectSurvivors',
    'restoreFromPointers',
    'simpleBaseline',
    'compareWithBaseline',
    'digestionCostOf',
    'notePlan',
    'noteErrorTrace',
    'noteWrongTurn',
    'noteMcpBaseline',
    'admitComponent',
    'SMART_COMPACT_SURVIVOR_TOKENS',
    'SMART_COMPACT_MIN_TOKENS',
    'SMART_COMPACT_TRIGGER_MARGIN',
    'STABLE_PREFIX_BYTES',
  ];
  const missing = REQUIRED_EXPORTS.filter((name) => !source.includes(name));
  if (missing.length > 0) {
    for (const name of REQUIRED_EXPORTS) {
      check(`export:${name}`, missing.includes(name) ? 'FAIL' : 'PASS', missing.includes(name) ? 'absent from arsenal.ts' : 'present in arsenal.ts');
    }
    report();
    return;
  }
  for (const name of REQUIRED_EXPORTS) {
    check(`export:${name}`, 'PASS', 'present in arsenal.ts');
  }

  const loaded = loadPluginModule();
  if (!loaded) {
    report();
    return;
  }
  let mod = null;
  try {
    mod = await import(pathToFileURL(loaded.emitted).href);
    check('compile', 'PASS', `tsc emit + import ok (${loaded.emitted})`);
  } catch (error) {
    check('compile', 'FAIL', `emitted module import failed: ${error instanceof Error ? error.message : String(error)}`);
    report();
    return;
  } finally {
    try { rmSync(loaded.workdir, { recursive: true, force: true }); } catch { /* ignore */ }
  }

  const provenance = { vendor: 'test-vendor', fingerprint: 'fp-001' };

  // T5: wrong turns are kept and tagged, never silently dropped.
  try {
    const state = mod.newDigestState();
    mod.notePlan(state, 'ship feature X', provenance);
    mod.noteWrongTurn(state, 'tried sed -i on the catalog table', provenance);
    mod.noteErrorTrace(state, 'E1: truncate wiped the open plan', provenance);
    const summary = mod.synthesizeSummary(state);
    const kept = summary.includes('tried sed -i on the catalog table');
    const tagged = summary.includes('WRONG-TURN');
    check('T5-wrong-turns', kept && tagged ? 'PASS' : 'FAIL', kept && tagged ? 'wrong turn kept with WRONG-TURN tag in summary' : `kept=${kept} tagged=${tagged}`);
  } catch (error) {
    check('T5-wrong-turns', 'FAIL', error instanceof Error ? error.message : String(error));
  }

  // T6 + recovery: every dropped span restores byte-exactly from its pointer.
  try {
    const prefix = 'STABLE-PREFIX: session anchor v1\n';
    const body = `${prefix}${fixtureBody()}`;
    const state = mod.newDigestState();
    mod.notePlan(state, 'keep the plan across compact', provenance);
    mod.noteWrongTurn(state, 'blind cut lost error E1 before', provenance);
    mod.noteErrorTrace(state, 'E1: provider overflow at 200k', provenance);
    mod.noteMcpBaseline(state, 'mcp-docs', 'bl-9f2c');
    const summary = mod.synthesizeSummary(state);
    const compacted = mod.selectSurvivors(prefix, body, summary);
    const store = new Map(compacted.dropped.map((span) => [span.pointer.locator, span.text]));
    const restored = mod.restoreFromPointers(compacted.dropped.map((span) => span.pointer), store);
    const mismatches = restored.filter((entry, i) => entry.restored !== compacted.dropped[i].text);
    const allHavePointer = compacted.dropped.every((span) => span.pointer && span.pointer.locator.length > 0 && span.pointer.preview.length > 0);
    const allChecksumOk = restored.every((entry, i) => entry.checksumOk && entry.byteLengthOk && entry.restored === compacted.dropped[i].text);
    // Adversarial: a lost span must be reported missing, a tampered span must fail its checksum.
    const lostStore = new Map(store);
    const tamperStore = new Map(store);
    if (compacted.dropped.length > 0) {
      lostStore.delete(compacted.dropped[0].pointer.locator);
      tamperStore.set(compacted.dropped[0].pointer.locator, `${compacted.dropped[0].text} [tampered]`);
    }
    const lostReport = mod.restoreFromPointers(compacted.dropped.map((span) => span.pointer), lostStore);
    const tamperReport = mod.restoreFromPointers(compacted.dropped.map((span) => span.pointer), tamperStore);
    const lostDetected = compacted.dropped.length === 0 || lostReport[0].restored === null;
    const tamperDetected = compacted.dropped.length === 0 || tamperReport[0].checksumOk === false;
    const ok = mismatches.length === 0 && allHavePointer && allChecksumOk && lostDetected && tamperDetected;
    check('T6-recoverable', ok ? 'PASS' : 'FAIL', ok ? `${compacted.dropped.length} dropped span(s) each left a pointer and restored byte-exactly; lost=tamper paths detected` : `${mismatches.length} mismatch(es), pointers-complete=${allHavePointer} checksums-ok=${allChecksumOk} lost-detected=${lostDetected} tamper-detected=${tamperDetected}`);
  } catch (error) {
    check('T6-recoverable', 'FAIL', error instanceof Error ? error.message : String(error));
  }

  // Baseline law: smart wins only by measurement over simple truncation.
  try {
    const prefix = 'STABLE-PREFIX: session anchor v1\n';
    const body = `${prefix}${fixtureBody()}`;
    const state = mod.newDigestState();
    mod.notePlan(state, 'keep the plan across compact', provenance);
    mod.noteErrorTrace(state, 'E1: provider overflow at 200k', provenance);
    const summary = mod.synthesizeSummary(state);
    const smart = mod.selectSurvivors(prefix, body, summary);
    const baseline = mod.simpleBaseline(prefix, body);
    const verdict = mod.compareWithBaseline(
      { tokens: mod.estimateTokens(smart.survivors), recovered: smart.recoveredKinds },
      { tokens: mod.estimateTokens(baseline.survivors), recovered: baseline.recoveredKinds },
    );
    check('baseline-law', verdict.smartWins ? 'PASS' : 'FAIL', `smart=${verdict.smartTokens}t recovered=[${verdict.smartRecovered.join(',')}] baseline=${verdict.baselineTokens}t recovered=[${verdict.baselineRecovered.join(',')}]`);
  } catch (error) {
    check('baseline-law', 'FAIL', error instanceof Error ? error.message : String(error));
  }

  // Cost: pre-digestion cost is measured and below what compact saves.
  try {
    const prefix = 'STABLE-PREFIX: session anchor v1\n';
    const body = `${prefix}${fixtureBody()}`;
    const state = mod.newDigestState();
    mod.notePlan(state, 'keep the plan across compact', provenance);
    mod.noteErrorTrace(state, 'E1: provider overflow at 200k', provenance);
    const summary = mod.synthesizeSummary(state);
    const smart = mod.selectSurvivors(prefix, body, summary);
    const cost = mod.digestionCostOf(state);
    const saved = mod.estimateTokens(body) - mod.estimateTokens(smart.survivors);
    check('digestion-cost', cost.tokens > 0 && cost.tokens < saved ? 'PASS' : 'FAIL', `digest cost=${cost.tokens}t chars=${cost.chars} saved=${saved}t`);
  } catch (error) {
    check('digestion-cost', 'FAIL', error instanceof Error ? error.message : String(error));
  }

  // Prefix: stable-byte prefix survives byte-identical.
  try {
    const prefix = 'STABLE-PREFIX: session anchor v1\n';
    const body = `${prefix}${fixtureBody()}`;
    const state = mod.newDigestState();
    mod.notePlan(state, 'p', provenance);
    const smart = mod.selectSurvivors(prefix, body, mod.synthesizeSummary(state));
    const intact = smart.survivors.startsWith(prefix.slice(0, mod.STABLE_PREFIX_BYTES));
    check('stable-prefix', intact ? 'PASS' : 'FAIL', intact ? `first ${mod.STABLE_PREFIX_BYTES} byte(s) identical` : 'prefix altered by compact');
  } catch (error) {
    check('stable-prefix', 'FAIL', error instanceof Error ? error.message : String(error));
  }

  // Limits: hook stays inside the fixed V3 mechanism (static, on shipped source).
  try {
    const setupBlock = source.slice(source.indexOf('const setup:'));
    // Registered V2 session-hook names: only "prompt" may appear. The
    // registrar lookup (`ctx?.session?.hook`) is not a registration.
    const registered = [];
    const hookNameRe = /\.hook\s*\(\s*["']([^"']+)["']/g;
    let match = hookNameRe.exec(setupBlock);
    while (match) {
      registered.push(match[1]);
      match = hookNameRe.exec(setupBlock);
    }
    // The session registrar is invoked via `.call(ctx.session, "prompt", …)`.
    const callNameRe = /\.call\(ctx\.session,\s*["']([^"']+)["']/g;
    match = callNameRe.exec(setupBlock);
    while (match) {
      registered.push(match[1]);
      match = callNameRe.exec(setupBlock);
    }
    const registersCompaction = registered.some((name) => /compa|context/i.test(name));
    const ld01Block = source.slice(source.indexOf('LD-01'));
    const picksModel = /compactModel|selectCompactModel|modelID.*compact|compact.*modelID/i.test(ld01Block);
    const replacesPrompt = /attached summar|summarizerPrompt|replace.*prompt/i.test(ld01Block);
    const ok = !registersCompaction && !picksModel && !replacesPrompt;
    check('hook-limits', ok ? 'PASS' : 'FAIL', ok ? `session hooks=[${registered.join(',')}] only; no model pick, no summarizer-prompt swap` : `hooks=[${registered.join(',')}] model=${picksModel} prompt=${replacesPrompt}`);
  } catch (error) {
    check('hook-limits', 'FAIL', error instanceof Error ? error.message : String(error));
  }

  // shouldCompact trigger law: 15% margin, 16k-token minimum, one-time restore, manual.
  try {
    const min = mod.SMART_COMPACT_MIN_TOKENS;
    const margin = mod.SMART_COMPACT_TRIGGER_MARGIN;
    const limit = 100000;
    const nearLimit = Math.floor(limit * (1 - margin)) + 10;
    const auto = mod.shouldCompact({ windowTokens: nearLimit, limitTokens: limit, trigger: 'auto', overflowRestored: false });
    const belowMin = mod.shouldCompact({ windowTokens: min - 1, limitTokens: min - 1, trigger: 'auto', overflowRestored: false });
    const once = mod.shouldCompact({ windowTokens: limit * 2, limitTokens: limit, trigger: 'provider-overflow', overflowRestored: true });
    const first = mod.shouldCompact({ windowTokens: 10, limitTokens: limit, trigger: 'provider-overflow', overflowRestored: false });
    const manual = mod.shouldCompact({ windowTokens: 10, limitTokens: limit, trigger: 'manual', overflowRestored: false });
    const ok = auto === true && belowMin === false && once === false && first === true && manual === true;
    check('trigger-law', ok ? 'PASS' : 'FAIL', `auto@${nearLimit}=${auto} belowMin=${belowMin} overflowOnce=${once} overflowFirst=${first} manual=${manual}`);
  } catch (error) {
    check('trigger-law', 'FAIL', error instanceof Error ? error.message : String(error));
  }

  // Input-safety minimum: vendor+fingerprint at accept, MCP baselines at
  // accept, executable/credential held at candidate until gates prove.
  try {
    const state = mod.newDigestState();
    const noProv = mod.notePlan(state, 'no provenance here', null);
    const noFp = mod.notePlan(state, 'missing fingerprint', { vendor: 'v' });
    const withMcp = mod.noteErrorTrace(state, 'E9 from mcp-docs', provenance, { source: 'mcp-docs', baselineHash: 'bl-9f2c' });
    const held = mod.admitComponent({ kind: 'executable', locator: 'dist/run.sh' }, null);
    const proven = mod.admitComponent({ kind: 'executable', locator: 'dist/run.sh' }, { gate: 'security-review', proof: 'SR-12' });
    const cred = mod.admitComponent({ kind: 'credential', locator: 'env/KEY' }, null);
    const ok = noProv.accepted === false && noFp.accepted === false && withMcp.accepted === true && held.status === 'candidate' && proven.status === 'admitted' && cred.status === 'candidate';
    check('input-safety', ok ? 'PASS' : 'FAIL', `noProv=${noProv.accepted} noFp=${noFp.accepted} mcp=${withMcp.accepted} execHeld=${held.status} execProven=${proven.status} credHeld=${cred.status}`);
  } catch (error) {
    check('input-safety', 'FAIL', error instanceof Error ? error.message : String(error));
  }

  check('live-v2-firing', 'UNVERIFIED', 'blocker: V2 setup context exposes session "prompt" only on this host; no compaction registrar observed, so live V2 firing cannot be exercised');
  check('live-provider-overflow', 'UNVERIFIED', 'blocker: needs a real provider-overflow event; fixture overflow is simulated, never a live signal');

  report();
};

const report = () => {
  let pass = 0;
  let fail = 0;
  let unverified = 0;
  for (const entry of results) {
    if (entry.status === 'PASS') pass += 1;
    else if (entry.status === 'FAIL') fail += 1;
    else unverified += 1;
    console.log(`${entry.status}\t${entry.name}\t${entry.detail}`);
  }
  console.log(`summary: ${pass} PASS, ${fail} FAIL, ${unverified} UNVERIFIED of ${results.length} checks`);
  if (fail > 0) process.exitCode = 1;
};

main().catch((error) => {
  console.log(`FAIL\tharness\t${error instanceof Error ? error.message : String(error)}`);
  console.log('summary: 0 PASS, 1 FAIL, 0 UNVERIFIED of 1 checks');
  process.exitCode = 1;
});
