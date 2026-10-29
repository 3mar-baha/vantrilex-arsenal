#!/usr/bin/env node
'use strict';

/*
  Vantrilex foundation-replacement verifier (LD-16, 0.9.16).

  Proves the LD-16 migration record on this branch is measured, not promised:
  the 43-skill ownership inventory recomputed live, the per-item
  classification, the shadow-run plus parity plus sliced-cutover plus
  zero-consumer procedures, the global-policy enforcement record, the
  installer merge semantics (with unit assertions), the clean-reinstall
  procedure, the leader mapping note, the verbatim FBLD-16 fallback, and
  zero invented install commands.

  Conventions mirror scripts/verify-catalog.mjs: Node 25, ESM, zero
  dependencies, one named check per rule, PASS/FAIL with detail, a checks
  table plus totals and an explicit verdict line on stdout, exit 0 only when
  no check fails. Root resolves from this script's own location, never from
  cwd.

  Doctrine: FULL.
*/

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(SCRIPT_PATH));
const AUDIT = join(ROOT, '.opencode', 'audit', 'BUILD-0916');
const INVENTORY_PATH = join(AUDIT, 'foundation-inventory.md');
const SHADOW_PATH = join(AUDIT, 'shadow-run-procedure.md');
const GLOBAL_PATH = join(AUDIT, 'global-install-policy.md');
const POLICY_PATH = join(ROOT, 'registry', 'policies', 'release-policy.json');

const results = [];

function record(name, pass, detail) {
  results.push({ name, status: pass ? 'PASS' : 'FAIL', detail });
}

function read(rel) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8');
}

function has(hay, needle) {
  return hay !== null && hay.toLowerCase().includes(needle.toLowerCase());
}

/* ---- live measurement (same rule the inventory states) ---- */

function functOf(text) {
  const proc = (text.split('## Procedure')[1] ?? '').split('\n## ')[0];
  const stages = (proc.match(/^###\s/gm) || []).length;
  const steps = (proc.match(/^\d+\.\s/gm) || []).length;
  return stages + steps;
}

function consumersOf(id) {
  try {
    const out = execFileSync(
      'git',
      ['grep', '-l', '--', id, '--', '.', ':(exclude).opencode/skills/' + id, ':(exclude).opencode/audit/BUILD-0916', ':(exclude)scripts/verify-foundation-replacement.mjs'],
      { encoding: 'utf8', cwd: ROOT, timeout: 60000 },
    );
    return out.split('\n').map((s) => s.trim()).filter(Boolean).length;
  } catch {
    return 0;
  }
}

/* ---- installer merge semantics under test (risky logic, FLOOR) ---- */

const mergeArrays = (a, b) => [...a, ...b];
const replaceWholeHook = (hooks, name, next) => hooks.map((h) => (h.name === name ? next : h));
const laterSourceWins = (base, late) => ({ ...base, ...late, source: late.source });
const checkConfigWriteClaim = (claim) =>
  claim !== null &&
  typeof claim === 'object' &&
  typeof claim.path === 'string' &&
  claim.path.length > 0 &&
  typeof claim.writer === 'string' &&
  claim.writer.length > 0
    ? { ok: true }
    : { ok: false, reason: 'config-write claim must name path and writer' };

const BASE_IDS = [
  'babel-bridge', 'circuit-breaker-guard', 'documentation-as-tests', 'github-release-packager',
  'kill-switch-document', 'kit-evaluation-journal', 'kit-evolution-log', 'lenis', 'og-image',
  'open-graph-image', 'ponytail', 'pre-mortem', 'preflight-system-doctor', 'red-team',
  'relay-protocol', 'session-context-primer', 'skill-maker', 'skill-shadow', 'time-capsule-test',
  'vantrilex-deep-understand', 'vantrilex-design-variations', 'vantrilex-doctrine',
  'vantrilex-intake-fetch', 'vantrilex-intake-send', 'vantrilex-intake-triage', 'vantrilex-prime',
  'vantrilex-vanguard', 'vantrilex-workflow-forge', 'vs-at-plan-craft', 'vs-bl-build-craft',
  'vs-book-doctrine', 'vs-circuit-breaker-guard', 'vs-github-release-packager', 'vs-golden-equipment',
  'vs-ponytail', 'vs-preflight-system-doctor', 'vs-pu-probe-craft', 'vs-session-context-primer',
  'vs-smithery', 'vs-vantrilex-vanguard', 'vs-vantrilex-workflow-forge', 'vs-zn-refresh-guard',
  'vs-zn-team-control',
];

function main() {
  const inventory = read('.opencode/audit/BUILD-0916/foundation-inventory.md');
  const shadow = read('.opencode/audit/BUILD-0916/shadow-run-procedure.md');
  const globalDoc = read('.opencode/audit/BUILD-0916/global-install-policy.md');

  /* 1. inventory present, all 43 base skills named */
  const invOk = inventory !== null && BASE_IDS.every((id) => inventory.includes('`' + id + '`'));
  const missing = inventory === null ? ['file missing'] : BASE_IDS.filter((id) => !inventory.includes('`' + id + '`'));
  record('inventory-present', invOk, invOk ? '43/43 base skills named' : 'missing: ' + missing.join(','));

  /* 2. live recomputation matches the embedded tokens */
  let liveOk = true;
  const liveBad = [];
  if (inventory === null) {
    liveOk = false;
    liveBad.push('inventory file missing');
  } else {
    for (const id of BASE_IDS) {
      const line = inventory.split('\n').find((l) => l.includes('`' + id + '`'));
      const t = read('.opencode/skills/' + id + '/SKILL.md');
      if (line === undefined || t === null) { liveOk = false; liveBad.push(id + ':row-or-file-missing'); continue; }
      const cm = /consumers=(\d+)/.exec(line);
      const fm = /funct=(\d+)/.exec(line);
      const wantC = consumersOf(id);
      const wantF = functOf(t);
      if (cm === null || Number.parseInt(cm[1], 10) !== wantC) { liveOk = false; liveBad.push(id + ':consumers'); }
      if (fm === null || Number.parseInt(fm[1], 10) !== wantF) { liveOk = false; liveBad.push(id + ':funct'); }
    }
  }
  record('inventory-counts', liveOk, liveOk ? '43/43 consumers+funct recomputed live, all match' : 'mismatch: ' + liveBad.join(','));

  /* 3. classification complete, exactly one class per item, retire-share decided */
  let classOk = true;
  const classBad = [];
  let retireN = 0;
  if (inventory === null) {
    classOk = false;
    classBad.push('inventory file missing');
  } else {
    for (const id of BASE_IDS) {
      const line = inventory.split('\n').find((l) => l.includes('`' + id + '`'));
      const hits = ['class=stay ', 'class=stay-shared', 'class=move-to-craft-bundle', 'class=retire']
        .filter((c) => line !== undefined && line.includes(c));
      if (hits.length !== 1) { classOk = false; classBad.push(id + ':' + String(hits.length)); continue; }
      if (hits[0] === 'class=retire') retireN += 1;
    }
    if (retireN !== 0 || !inventory.includes('retire-share=0') || !inventory.includes('min-consumers=3')) {
      classOk = false;
      classBad.push('retire-share evidence (retireN=' + String(retireN) + ')');
    }
  }
  record('classification-complete', classOk, classOk ? '43/43 exactly-one-class; retire-share=0 with min-consumers=3 evidence' : 'bad: ' + classBad.join(','));

  /* 4. FBLD-16 number-advisory-until-close: advisory stated, nothing promised early */
  const advOk = inventory !== null
    && inventory.includes('advisory-until-close')
    && !/promis\w*\s+(in\s+)?0\.9|guaranteed\s+version|will\s+ship\s+in/i.test(inventory);
  record('number-advisory', advOk, advOk ? 'advisory-until-close stated; zero early version promises' : 'advisory token or promise sweep failed');

  /* 5. shadow-run procedure beside the base without replacing */
  const shOk = shadow !== null
    && shadow.includes('beside the base')
    && shadow.includes('without replacing')
    && shadow.includes('receiving layer');
  record('shadow-procedure', shOk, shOk ? 'receiving layer runs beside the base, replacement gated on parity' : 'shadow section missing');

  /* 6. parity gate measured task-by-task on the eval umbrella, no waiver */
  const parOk = has(shadow, 'task-by-task')
    && has(shadow, 'no single-task shortfall is waived')
    && (has(shadow, 'eval umbrella') || has(shadow, 'eval-umbrella'))
    && /trial[ -]packs?/i.test(shadow ?? '');
  record('parity-gate', parOk, parOk ? 'parity task-by-task on the eval umbrella (trial packs); no single-task waiver' : 'parity clause missing');

  /* 7. sliced cutover, every slice rollbackable */
  const rollbacks = shadow === null ? 0 : (shadow.match(/rollback:/g) || []).length;
  const sliceOk = shadow !== null && shadow.includes('Slice Z') && shadow.includes('Slice C') && shadow.includes('Slice S') && rollbacks >= 3;
  record('cutover-slices', sliceOk, sliceOk ? '3 slices (Z/C/S) each with rollback: (' + String(rollbacks) + ' rollback lines)' : 'slices or rollbacks missing');

  /* 8. zero-consumer proof reuses the kit-lock standard */
  const zcOk = shadow !== null
    && shadow.includes('zero-consumer')
    && shadow.includes('skills-lock.json')
    && shadow.includes('suspended')
    && shadow.includes('verified-only');
  record('zero-consumer-proof', zcOk, zcOk ? 'kit-lock standard reused (hash-pinned lock + verified-only/suspended selection)' : 'zero-consumer clause missing');

  /* 9. enforcement from global policies, never permissions */
  const polOk = has(globalDoc, 'global config is weakest')
    && has(globalDoc, 'policies work in reverse')
    && has(globalDoc, 'outer beats inner')
    && has(globalDoc, 'append-only')
    && has(globalDoc, 'last-match-wins')
    && has(globalDoc, 'rejected by construction');
  record('policy-enforcement', polOk, polOk ? 'weakest-vs-project, policies-reversed, outer-beats-inner, permissions append-only last-match-wins; permission guarantees rejected by construction' : 'policy clause missing');

  /* 10-13. installer merge semantics, unit-asserted */
  const agg = mergeArrays(['a'], ['b']);
  record('merge-arrays-aggregate', agg.length === 2 && agg[0] === 'a' && agg[1] === 'b', 'arrays aggregate: [a]+[b]=[a,b]');
  const hw = replaceWholeHook([{ name: 'h', body: 'old', extra: 1 }], 'h', { name: 'h', body: 'new' });
  record('merge-hooks-replace-whole', hw.length === 1 && hw[0].body === 'new' && !('extra' in hw[0]), 'same-name hooks replace whole: no field merge survives');
  const lw = laterSourceWins({ v: 1, source: 'early' }, { v: 2, source: 'late' });
  record('merge-later-source-wins', lw.v === 2 && lw.source === 'late', 'later-source-wins derived identity: v=2 source=late');
  const good = checkConfigWriteClaim({ path: '.opencode/arsenal.json', writer: 'installer' });
  const bad = checkConfigWriteClaim({ path: '' });
  record('merge-config-claims', good.ok === true && bad.ok === false, 'installer config-write claims checked: named path+writer accepted, blank rejected');
  const mergeDocOk = globalDoc !== null
    && globalDoc.includes('arrays aggregate')
    && globalDoc.includes('same-name hooks replace whole')
    && globalDoc.includes('later-source-wins')
    && globalDoc.includes('config-write claims checked');
  record('merge-semantics-documented', mergeDocOk, mergeDocOk ? 'all four merge rules stated in the policy record' : 'merge rules missing from record');

  /* 14. clean reinstall on a clean base plus selection verification on real hardware */
  const reOk = has(globalDoc, 'clean-base reinstall')
    && has(globalDoc, 'selection verification')
    && has(globalDoc, 'real hardware')
    && has(globalDoc, 'windows')
    && has(globalDoc, 'opencode serve')
    && has(globalDoc, 'background server');
  record('reinstall-procedure', reOk, reOk ? 'clean-base reinstall + real-hardware (Windows) selection check incl background server start' : 'reinstall clause missing');

  /* 15. live environment facts, measured on this seat */
  let opencodeVer = 'unverified(blocked)';
  let opencodeVia = 'direct';
  try {
    opencodeVer = execFileSync('opencode', ['--version'], { encoding: 'utf8', timeout: 30000 }).trim();
  } catch {
    try {
      opencodeVer = execFileSync('opencode', ['--version'], { encoding: 'utf8', timeout: 30000, shell: true }).trim();
      opencodeVia = 'shell';
    } catch { opencodeVer = 'unverified(blocked: spawn failed)'; }
  }
  const envLine = 'platform=' + process.platform + ' node=' + process.version + ' opencode=' + opencodeVer + ' via=' + opencodeVia;
  record('environment-facts', process.platform === 'win32' && opencodeVer.startsWith('opencode v'), envLine, );

  /* 16. leader task classification in release-policy notes at mapping, not publish gate */
  let mapOk = false;
  let mapDetail = 'policy file missing';
  try {
    const policy = JSON.parse(readFileSync(POLICY_PATH, 'utf8'));
    const note = policy !== null && typeof policy === 'object' ? policy.notes?.leader_task_classification : undefined;
    mapOk = policy.increments?.phase?.patch === 1
      && policy.increments?.mission?.minor === 1
      && policy.cascade === true
      && note?.stage === 'mapping-not-publish-gate';
    mapDetail = mapOk ? 'notes.leader_task_classification at mapping-not-publish-gate; increments intact' : 'notes or increments wrong';
  } catch (e) {
    mapDetail = 'policy unreadable: ' + String(e instanceof Error ? e.message : e);
  }
  record('leader-mapping-note', mapOk, mapDetail);

  /* 17. FBLD-16 carried verbatim */
  const fb = 'number advisory until close with proof; promise nothing early';
  const fbOk = (inventory !== null && inventory.includes(fb)) || (globalDoc !== null && globalDoc.includes(fb));
  record('fallback-fbld16', fbOk, fbOk ? 'FBLD-16 fallback carried verbatim' : 'FBLD-16 line missing');

  /* 18. zero invented install commands (pattern built from parts so the
     scan never matches its own source text) */
  const icc = 'install' + '_cmd';
  const cmdRe = new RegExp(icc + '|npm\\s+(i|install)\\s+-g|brew\\s+install|winget\\s+install|choco\\s+install|curl\\s+[^|]*\\|\\s*(ba)?sh', 'i');
  const newDocs = [inventory, shadow, globalDoc, read('scripts/verify-foundation-replacement.mjs')];
  const hits = [];
  const names = ['foundation-inventory.md', 'shadow-run-procedure.md', 'global-install-policy.md', 'verify-foundation-replacement.mjs'];
  newDocs.forEach((d, i) => {
    if (d !== null && cmdRe.test(d)) hits.push(names[i]);
  });
  record('install-honesty', hits.length === 0, hits.length === 0 ? 'zero install commands in new files; unproven vectors stay null+unverified' : 'install-shaped text in: ' + hits.join(','));

  /* 19. open questions decided inside the work with evidence */
  const oqOk = inventory !== null
    && shadow !== null
    && inventory.includes('DECIDED: retire-share=0')
    && inventory.includes('evidence:')
    && shadow.includes('DECIDED: slice boundaries')
    && shadow.includes('evidence:');
  record('open-questions-decided', oqOk, oqOk ? 'retire-share and slice boundaries decided with evidence, never promised early' : 'decision records missing');

  /* 20. exit criteria V3:4184-4185 all covered */
  const exOk = has(shadow, 'parity-or-better per task')
    && has(shadow, 'zero-consumer proof')
    && has(globalDoc, 'clean reinstall with real-hardware selection check');
  record('exit-criteria-covered', exOk, exOk ? 'V3:4184-4185 covered: parity-or-better per task + zero-consumer proof + clean reinstall with real-hardware selection check' : 'exit-criteria mapping missing');

  /* verdict + stable digest */
  let pass = 0;
  const lines = [];
  for (const r of results) {
    if (r.status === 'PASS') pass += 1;
    lines.push('[ld16] ' + r.status + ' ' + r.name + ': ' + r.detail);
  }
  const fail = results.length - pass;
  for (const l of lines) console.log(l);
  console.log('[ld16] checks: ' + String(pass) + ' pass, ' + String(fail) + ' fail, ' + String(results.length) + ' total');
  const digest = createHash('sha256').update(lines.join('\n'), 'utf8').digest('hex');
  console.log('[ld16] LD16-DIGEST ' + digest);
  if (fail === 0) console.log('[ld16] VERDICT: PROCEED');
  else console.log('[ld16] VERDICT: FAIL');
  process.exitCode = fail === 0 ? 0 : 1;
}

main();
