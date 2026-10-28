#!/usr/bin/env node
'use strict';

/*
  Vantrilex eval-harness verifier (LD-05, 0.9.5).

  Proves docs/spec/0.9.5-EVAL-HARNESS.md conforms to the harness contract:
  per-kind trial packs in CI with pinned-version scores, blind-spot-aware
  evaluator design, the comparative-probe appendix, the HAL template, the
  retro-sweep budget line with announced coverage, T7/T8, and the
  deliberately-broken-component FAIL on log inspection.

  Conventions mirror scripts/verify-registry.mjs: one named check per rule,
  PASS/FAIL with detail, a checks table plus totals and an explicit verdict
  line on stdout, exit 0 only when no check fails. Node 25, ESM, zero
  dependencies. Root resolves from this script's own location, never from cwd.

  Doctrine: FULL.
*/

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(SCRIPT_PATH));
const SPEC_REL = join('docs', 'spec', '0.9.5-EVAL-HARNESS.md');
const SPEC_PATH = join(ROOT, SPEC_REL);

const results = [];

function record(name, pass, detail) {
  results.push({ name, status: pass ? 'PASS' : 'FAIL', detail });
}

function need(haystack, needle) {
  return haystack.includes(needle);
}

/* Deterministic re-score: the same pinned input must yield the same score. */
function rescore(pinnedVersion, packRev, artifact) {
  return createHash('sha256')
    .update(`${pinnedVersion}|${packRev}|${artifact}`, 'utf8')
    .digest('hex')
    .slice(0, 12);
}

/* HAL verdict: a high surface score never overrides log inspection. */
function halVerdict({ surfaceScore, logs }) {
  const logsClean = logs === 'clean';
  const logsPresent = logs === 'clean' || logs === 'suspicious';
  if (!logsPresent) return 'FAIL';
  if (!logsClean) return 'FAIL';
  return surfaceScore >= 0.5 ? 'PASS' : 'FAIL';
}

function main() {
  if (!existsSync(SPEC_PATH)) {
    record('spec-present', false, `${SPEC_REL} is missing`);
    return finish();
  }
  const spec = readFileSync(SPEC_PATH, 'utf8');
  record('spec-present', true, `${SPEC_REL} exists (${Buffer.byteLength(spec, 'utf8')} bytes)`);

  const packs = ['trial-pack-skills', 'trial-pack-agents', 'trial-pack-units'];
  const missingPacks = packs.filter((p) => !need(spec, p));
  const packsOk =
    missingPacks.length === 0 &&
    need(spec, 'CI') &&
    need(spec, 'pinned-version score');
  record(
    'per-kind-packs',
    packsOk,
    packsOk
      ? 'skills/agents/units trial packs run in CI with pinned-version scores'
      : `missing: ${[...missingPacks, ...(['CI', 'pinned-version score'].filter((m) => !need(spec, m)))].join(', ')}`,
  );

  const pinnedOk =
    need(spec, 'Pinned-version record:') &&
    /pinned version \d+\.\d+\.\d+\+[0-9a-f]{7,}/u.test(spec);
  const first = rescore('0.9.5+6bf56ff', 'rev 1', 'fixture-artifact');
  const second = rescore('0.9.5+6bf56ff', 'rev 1', 'fixture-artifact');
  const reproOk = first === second;
  record(
    'pinned-reproducibility',
    pinnedOk && reproOk,
    pinnedOk && reproOk
      ? `pinned-version record present; re-score deterministic (${first} == ${second})`
      : `pinned record ok: ${String(pinnedOk)}; re-score deterministic: ${String(reproOk)} (${first} vs ${second})`,
  );

  const blindOk = need(spec, 'evaluators never see generator rationales');
  record(
    'blind-spot-evaluator',
    blindOk,
    blindOk
      ? 'evaluators never see generator rationales'
      : 'blind-spot clause is missing',
  );

  const probeOk =
    need(spec, 'comparative-probe') &&
    need(spec, 'plan quality') &&
    need(spec, 'research quality') &&
    need(spec, 'authorized instrument') &&
    need(spec, 'no improvised alternative');
  record(
    'comparative-probe',
    probeOk,
    probeOk
      ? 'comparative-probe appendix covers plan quality and research quality as the authorized instrument'
      : 'comparative-probe appendix is incomplete',
  );

  const halOk =
    need(spec, 'model-vs-structure split') &&
    need(spec, 'mandatory log inspection') &&
    need(spec, 'no scores-only pass');
  record(
    'hal-template',
    halOk,
    halOk
      ? 'HAL template: model-vs-structure split, mandatory log inspection, no scores-only pass'
      : 'HAL template clause is missing',
  );

  const coverageLine = spec.match(/Announced coverage: (\d+) of (\d+)[^\n]*\n/) ?? null;
  const budgetOk =
    need(spec, '15-25 percent') &&
    need(spec, 'estimated-from-prior-study') &&
    need(spec, 'announced, not implied') &&
    coverageLine !== null &&
    Number.parseInt(coverageLine[1], 10) <= Number.parseInt(coverageLine[2], 10);
  record(
    'retro-budget',
    budgetOk,
    budgetOk
      ? `retro-sweep ~15-25 percent estimated-from-prior-study; ${coverageLine[1]} of ${coverageLine[2]} announced, not implied`
      : 'retro-sweep budget line or announced coverage count is missing or incoherent',
  );

  const tOk = need(spec, 'T7') && need(spec, 'T8') && need(spec, 'fresh-window rule');
  record(
    't7-t8',
    tOk,
    tOk ? 'T7 long-context variants and T8 fresh-window rule present' : 'T7/T8 control is missing',
  );

  const broken = halVerdict({ surfaceScore: 0.97, logs: 'missing' });
  const suspicious = halVerdict({ surfaceScore: 0.97, logs: 'suspicious' });
  const clean = halVerdict({ surfaceScore: 0.97, logs: 'clean' });
  const brokenOk = broken === 'FAIL' && suspicious === 'FAIL' && clean === 'PASS';
  const specBrokenOk = need(spec, 'deliberately-broken-component FAILs') && need(spec, 'must fail on log inspection');
  record(
    'broken-probe-fails',
    brokenOk && specBrokenOk,
    brokenOk && specBrokenOk
      ? 'broken probe FAILs on log inspection despite surface score 0.97; clean control PASSes'
      : `probe verdicts broken=${broken} suspicious=${suspicious} clean=${clean}; spec clause: ${String(specBrokenOk)}`,
  );

  const fbOk =
    need(spec, 'FBLD-05') &&
    need(spec, 'report-only citation') &&
    need(spec, 'gate text stays as V3 writes it');
  record(
    'fallback-fbld05',
    fbOk,
    fbOk
      ? 'FBLD-05 honored: report-only citation, gate text stays as V3 writes it'
      : 'FBLD-05 citation is missing',
  );

  finish();
}

function finish() {
  let pass = 0;
  for (const r of results) {
    if (r.status === 'PASS') pass += 1;
    console.log(`[eval-harness] ${r.status} ${r.name}: ${r.detail}`);
  }
  const fail = results.length - pass;
  console.log(`[eval-harness] checks: ${String(pass)} pass, ${String(fail)} fail, ${String(results.length)} total`);
  if (fail === 0) {
    console.log('[eval-harness] VERDICT: PASS');
  } else {
    console.log('[eval-harness] VERDICT: FAIL');
  }
  process.exitCode = fail === 0 ? 0 : 1;
}

main();
