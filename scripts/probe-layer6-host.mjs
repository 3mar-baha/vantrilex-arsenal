#!/usr/bin/env node
/*
 * probe-layer6-host — V2 HOST repro for the Layer 6 gate question (F-38/WS8).
 *
 * THE QUESTION, verbatim from the lane brief:
 *   Does a `tool.execute.before` hook that THROWS abort the tool call on a
 *   live OpenCode V2 host, or does the call proceed anyway?
 *
 * Why a plain `node …` cannot answer it: the V2 host owns plugin loading,
 * hook dispatch and tool execution. This script therefore builds a
 * LAYER6-PROOF SCRATCH PROJECT under the OS temp directory
 * (<tmp>/opencode/layer6-proof-2026-11-12 on this host; override with
 * LAYER6_PROOF_ROOT) and runs two real `opencode run` sessions against it:
 *
 *   leg A (positive)  — the before-hook throws unconditionally for `bash`.
 *                       Hypothesis: the bash call aborts (no file effect).
 *   leg B (negative)  — the before-hook throws unconditionally for `grep`,
 *                       a tool the session is never asked to use. The bash
 *                       call must PROCEED (file effect present).
 *
 * Plugin load convention mirrored from the live tree (docs/02-INSTALLATION.md
 * and the V2 plugins documentation): discovered `.opencode/plugins/*.ts`
 * single-file plugins, default-exported `{ id, setup }`, registered through
 * `ctx.tool.hook("execute.before", cb)` — the same shape `.opencode/plugin/
 * arsenal.ts` uses for V2 (see `v2ToolBefore` there).
 *
 * Each leg writes an ARMED marker at setup() time (absolute path baked into
 * the generated source) so the outcome can be split into:
 *   (1) plugin never loaded        → marker absent  → proof BLOCKED, not falsified
 *   (2) loaded, call aborted       → marker + no file effect  → hypothesis HOLDS
 *   (3) loaded, call proceeded     → marker + file effect     → hypothesis FALSIFIED
 *
 * Both legs are run with `--auto` (approve permissions not explicitly denied)
 * so the variable under test is the before-hook throw, never the permission
 * layer. `--model` is pinned to a free model for reproducibility.
 *
 * Exit status: 0 — both legs observed exactly as the hypothesis expects;
 *              1 — at least one leg did NOT (recorded, never hidden);
 *              2 — infra blocker (opencode binary unreachable, spawn failure).
 * This probe writes NOTHING inside the repository; everything lands under the
 * scratch root. It never claims what it did not observe.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SCRATCH_ROOT = process.env.LAYER6_PROOF_ROOT
  ? path.resolve(process.env.LAYER6_PROOF_ROOT)
  : path.join(os.tmpdir(), 'opencode', 'layer6-proof-2026-11-12');

// The opencode background service keeps handles on project directories, so a
// previous run's legs cannot be deleted (EPERM observed 2026-11-12). Every run
// therefore lands in a fresh timestamped child of the scratch root and nothing
// is ever removed; the directory accumulates one subdirectory per run.
const RUN_STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const RUN_ROOT = path.join(SCRATCH_ROOT, `run-${RUN_STAMP}`);

const MODEL = 'opencode/inkling-2-small-free';
const RUN_TIMEOUT_MS = 240_000;
const LEGS = [
  {
    leg: 'a',
    // The V2 host on 2026-11-12 names the shell tool `shell` in the
    // execute.before event (observed twice in the before-fired jsonl:
    // {"tool":"shell",...}), not `bash`. Targeting the observed name.
    target: 'shell',
    canary: 'layer6-canary-a-2026-11-12',
    prompt:
      'Use the bash tool (NOT any other tool) to create a file named layer6-canary-a.txt in the current directory containing exactly: layer6-canary-a-2026-11-12 . Command: echo layer6-canary-a-2026-11-12 > layer6-canary-a.txt . Do not explain; just do it.',
  },
  {
    leg: 'b',
    target: 'grep',
    canary: 'layer6-canary-b-2026-11-12',
    prompt:
      'Use the bash tool (NOT any other tool) to create a file named layer6-canary-b.txt in the current directory containing exactly: layer6-canary-b-2026-11-12 . Command: echo layer6-canary-b-2026-11-12 > layer6-canary-b.txt . Do not explain; just do it.',
  },
];

const pluginSource = (leg) => `// layer6-proof leg ${leg.leg} — throwaway minimal V2 plugin (Layer 6 host proof, 2026-11-12).
// NOT part of the Arsenal kit. Written by scripts/probe-layer6-host.mjs.
import { appendFileSync, writeFileSync } from 'node:fs';

export default {
  id: 'layer6-proof-leg-${leg.leg}',
  setup: async (ctx) => {
    writeFileSync(${JSON.stringify(path.join(RUN_ROOT, `leg-${leg.leg}`, 'layer6-proof-armed.txt'))}, 'armed\\n', 'utf8');
    const toolDomain = ctx?.tool;
    const register = toolDomain?.hook;
    if (typeof register !== 'function') {
      console.log('[layer6-proof] ctx.tool.hook unavailable — plugin stays inert');
      return;
    }
    await register.call(toolDomain, 'execute.before', async (event) => {
      appendFileSync(
        ${JSON.stringify(path.join(RUN_ROOT, `leg-${leg.leg}`, 'layer6-proof-beforefired.jsonl'))},
        JSON.stringify({ tool: typeof event?.tool === 'string' ? event.tool : null, at: new Date().toISOString() }) + '\\n',
        'utf8',
      );
      if (typeof event?.tool === 'string' && event.tool === '${leg.target}') {
        throw new Error('[layer6-proof] BLOCK: unconditional execute.before throw for tool=${leg.target} (layer6 host proof)');
      }
    });
    console.log('[layer6-proof] armed: before-hook throws for tool=${leg.target}');
  },
};
`;

const runLeg = (leg) => {
  const dir = path.join(RUN_ROOT, `leg-${leg.leg}`);
  const pluginDir = path.join(dir, '.opencode', 'plugins');
  fs.mkdirSync(pluginDir, { recursive: true });
  fs.writeFileSync(path.join(pluginDir, 'layer6-proof.ts'), pluginSource(leg), 'utf8');

  const version = spawnSync('opencode --version', { shell: true, encoding: 'utf8' });
  console.log(`[probe-layer6-host] opencode --version (exit ${version.status}): ${(version.stdout ?? '').trim()}${version.stderr ? ` | stderr: ${version.stderr.trim()}` : ''}`);

  console.log(`\n=== leg ${leg.leg} (hook throws for tool=${leg.target}) ===`);
  console.log(`--- plugin source (${path.join(pluginDir, 'layer6-proof.ts')}) ---`);
  console.log(pluginSource(leg));
  console.log('--- opencode run ---');
  const run = spawnSync(
    `opencode run --model ${MODEL} --auto "${leg.prompt.replace(/"/g, '\\"')}"`,
    { shell: true, cwd: dir, timeout: RUN_TIMEOUT_MS, encoding: 'utf8', env: { ...process.env } },
  );
  if (run.error) {
    console.log(`[probe-layer6-host] spawn error: ${run.error.message}`);
  }
  console.log(`--- exit code: ${run.status} signal: ${run.signal ?? 'none'}${run.error ? ` (${run.error.message})` : ''} ---`);
  console.log('--- stdout ---');
  console.log(run.stdout ?? '(empty)');
  console.log('--- stderr ---');
  console.log(run.stderr ?? '(empty)');

  const canaryFile = path.join(dir, `layer6-canary-${leg.leg}.txt`);
  const armed = fs.existsSync(path.join(dir, 'layer6-proof-armed.txt'));
  const beforeFiredPath = path.join(dir, 'layer6-proof-beforefired.jsonl');
  const beforeFired = fs.existsSync(beforeFiredPath) ? fs.readFileSync(beforeFiredPath, 'utf8').trim() : null;
  const canaryExists = fs.existsSync(canaryFile);
  const canaryContent = canaryExists ? fs.readFileSync(canaryFile, 'utf8').trim() : null;
  const canaryInOutput = (run.stdout ?? '').includes(leg.canary) || (run.stderr ?? '').includes(leg.canary);

  console.log('--- leg outcome ---');
  console.log(`armed marker present:            ${armed}`);
  console.log(`before-hook fired (jsonl):       ${beforeFired === null ? 'ABSENT — hook never invoked' : beforeFired}`);
  console.log(`canary file present:             ${canaryExists}${canaryContent !== null ? ` (content: ${JSON.stringify(canaryContent)})` : ''}`);
  console.log(`canary string in run output:     ${canaryInOutput}`);
  return { leg: leg.leg, target: leg.target, dir, armed, beforeFired, canaryExists, canaryContent, canaryInOutput, status: run.status, timedOut: run.signal === 'SIGTERM' || run.status === null, spawnError: run.error ? run.error.message : null };
};

console.log(`[probe-layer6-host] scratch root: ${SCRATCH_ROOT}`);
console.log(`[probe-layer6-host] this run:     ${RUN_ROOT}`);
fs.mkdirSync(RUN_ROOT, { recursive: true });

const versionProbe = spawnSync('opencode --version', { shell: true, encoding: 'utf8' });
if (versionProbe.error || versionProbe.status !== 0) {
  console.log(`[probe-layer6-host] INFRA BLOCKER: opencode binary unreachable (exit ${versionProbe.status}): ${versionProbe.error?.message ?? versionProbe.stderr}`);
  console.log('PROBE: BLOCKED (infra)');
  process.exit(2);
}

const [legA, legB] = LEGS.map(runLeg);

console.log('\n=== verdict ===');
let ok = true;
const expect = (label, condition) => {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${label}`);
  if (!condition) ok = false;
};
expect('leg A: plugin armed (else setup failed or plugin never loaded)', legA.armed);
expect('leg A: before-hook actually fired (else the throw path is untested)', legA.beforeFired !== null);
expect('leg A: tool call ABORTED — no canary file effect', !legA.canaryExists);
expect('leg B: plugin armed (else setup failed or plugin never loaded)', legB.armed);
expect('leg B: before-hook actually fired (else the negative control is untested)', legB.beforeFired !== null);
expect('leg B: shell tool call PROCEEDED — canary file effect present', legB.canaryExists);
if (legB.canaryExists) {
  expect('leg B: canary content matches', legB.canaryContent === LEGS[1].canary);
}
console.log(ok ? 'PROBE: PASS' : 'PROBE: FAIL');
process.exit(ok ? 0 : 1);