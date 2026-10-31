#!/usr/bin/env node
// scripts/d33-depth-proof.mjs
// Depth-3 apply-time proof probe for the 0.9.33-depth3 raise hunk.
// Usage: node scripts/d33-depth-proof.mjs
// Spec: docs/0.9.33-depth3-spec.md ([N2]-[N6], gates G1-G3).
// Target: .opencode/plugin/arsenal.ts raise hunk, read-only (never modified by this probe).
// Zero dependencies (node stdlib only). No arguments, no options, no framework.
// Exit 0 only when every case passes; exit 1 on any case failure; exit 2 on
// infra doubt (fail-closed per [N6]: a doubt is a refusal, never a pass).
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE);
const ARSENAL = join(ROOT, '.opencode', 'plugin', 'arsenal.ts');
const SPEC = 'docs/0.9.33-depth3-spec.md';
function sha256(s) { return createHash('sha256').update(s, 'utf8').digest('hex'); }
function snap(v) { return JSON.stringify(v); }
function clone(v) { return JSON.parse(JSON.stringify(v)); }
function deepFreeze(o) {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) {
    Object.freeze(o);
    const ks = Object.keys(o);
    for (let i = 0; i < ks.length; i++) deepFreeze(o[ks[i]]);
  }
  return o;
}
function getPath(o, p) {
  let c = o;
  for (let i = 0; i < p.length; i++) {
    if (c === null || c === undefined) return undefined;
    c = c[p[i]];
  }
  return c;
}
function listKeys(o, base) {
  base = base || '';
  let out = [];
  if (o && typeof o === 'object') {
    const ks = Object.keys(o);
    for (let i = 0; i < ks.length; i++) {
      const p = base ? base + '.' + ks[i] : ks[i];
      out.push(p);
      out = out.concat(listKeys(o[ks[i]], p));
    }
  }
  return out;
}
let passed = 0;
let failed = 0;
function ok(name, before, after) {
  passed++;
  console.log('PASS ' + name + ' before=' + snap(before) + ' after=' + snap(after));
}
function bad(name, detail) {
  failed++;
  console.log('FAIL ' + name + ' detail=' + detail);
}
let src;
try {
  src = readFileSync(ARSENAL, 'utf8');
} catch (e) {
  console.log('FAIL infra reason=cannot read target: ' + String(e));
  process.exit(2);
}
console.log('INFO arsenal sha256(FULL-file)=' + sha256(src) + ' spec=' + SPEC);
const GUARD = 'if (!cfg || typeof cfg !== "object") return';
if (src.indexOf(GUARD) === -1) {
  console.log('FAIL infra reason=entry guard missing in source, refusing');
  process.exit(2);
}
const HOLDER = 'const holder = cfg as { experimental?: unknown }';
const TAIL = 'if (depthRecord.subagent_depth < 3) depthRecord.subagent_depth = 3';
const si = src.indexOf(HOLDER);
const ei = src.indexOf(TAIL);
if (si === -1 || ei === -1 || ei <= si) {
  console.log('FAIL infra reason=raise hunk markers not found, refusing');
  process.exit(2);
}
let hunk = src.slice(si, ei + TAIL.length);
const CAST1 = ' as { experimental?: unknown }';
const CAST2 = ' as { subagent_depth?: unknown }';
let stripped = 0;
while (hunk.indexOf(CAST1) !== -1) { hunk = hunk.replace(CAST1, ''); stripped++; }
while (hunk.indexOf(CAST2) !== -1) { hunk = hunk.replace(CAST2, ''); stripped++; }
if (stripped !== 2) {
  console.log('FAIL infra reason=expected exactly 2 TS casts, found ' + stripped + ', refusing');
  process.exit(2);
}
console.log('INFO hunk sha256(HUNK-PARTIAL, casts-stripped-x2)=' + sha256(hunk));
const returns = (hunk.match(/return/g) || []).length;
if (returns < 4) {
  console.log('FAIL infra reason=expected >=4 fail-closed returns, found ' + returns);
  process.exit(2);
}
let raise;
try {
  raise = new Function('cfg', GUARD + '\n' + hunk);
} catch (e) {
  console.log('FAIL infra reason=extracted hunk does not parse: ' + String(e));
  process.exit(2);
}
console.log('INFO harness=entry-guard(quoted-verbatim)+extracted-hunk composition(PARTIAL)');
console.log('INFO static-scan raise.arity=' + raise.length + ' globalThis-absent=' + (raise.toString().indexOf('globalThis') === -1) + ' process-absent=' + (raise.toString().indexOf('process') === -1) + ' (string-scan PARTIAL, not containment proof)');
(function t1() {
  const before = {};
  const cfg = clone(before);
  raise(cfg);
  if (getPath(cfg, ['experimental', 'subagent_depth']) === 3) ok('T1 missing-experimental->3 [N2]', before, cfg);
  else bad('T1 missing-experimental->3 [N2]', 'after=' + snap(cfg));
})();
(function t2() {
  const before = { experimental: { keep: 'yes' } };
  const cfg = clone(before);
  raise(cfg);
  const v = getPath(cfg, ['experimental', 'subagent_depth']);
  const keepOk = getPath(cfg, ['experimental', 'keep']) === 'yes';
  const keys = listKeys(cfg).sort();
  const allowed = ['experimental', 'experimental.keep', 'experimental.subagent_depth'].sort();
  if (v === 3 && keepOk && snap(keys) === snap(allowed)) ok('T2 missing-depth->3+sibling-kept [N2+N4]', before, cfg);
  else bad('T2 missing-depth->3+sibling-kept [N2+N4]', 'after=' + snap(cfg) + ' keys=' + snap(keys));
})();
(function t3() {
  const vals = [1, 0, 2];
  let allOk = true;
  for (let i = 0; i < vals.length; i++) {
    const cfg = { experimental: { subagent_depth: vals[i] } };
    raise(cfg);
    if (cfg.experimental.subagent_depth !== 3) { allOk = false; bad('T3 below-' + vals[i] + '->3 [N2]', snap({ experimental: { subagent_depth: vals[i] } }), snap(cfg)); }
  }
  if (allOk) ok('T3 below->3 (1,0,2) [N2]', { experimental: { subagent_depth: '1|0|2' } }, { experimental: { subagent_depth: 3 } });
})();
(function t4() {
  const before = { experimental: { subagent_depth: 3 } };
  const cfg = clone(before);
  raise(cfg);
  const first = snap(cfg);
  raise(cfg);
  const second = snap(cfg);
  if (cfg.experimental.subagent_depth === 3 && first === snap(before) && second === first) ok('T4 equal-3->3 idempotent-noop [N5/G1+G2]', before, cfg);
  else bad('T4 equal-3->3 idempotent-noop [N5/G1+G2]', 'first=' + first + ' second=' + second);
})();
(function t5() {
  const vals = [4, 5, 99];
  let allOk = true;
  for (let i = 0; i < vals.length; i++) {
    const before = { experimental: { subagent_depth: vals[i], other: 1 } };
    const cfg = clone(before);
    raise(cfg);
    if (snap(cfg) !== snap(before)) { allOk = false; bad('T5 above-' + vals[i] + '-untouched [N3/G3]', snap(before), snap(cfg)); }
  }
  if (allOk) ok('T5 above-untouched (4,5,99) [N3/G3]', { experimental: { subagent_depth: '4|5|99' } }, { experimental: { subagent_depth: '4|5|99 unchanged' } });
})();
(function t6() {
  const cases = [
    ['string-depth', function () { return { experimental: { subagent_depth: '3' } }; }, 'non-number type', false],
    ['float-depth', function () { return { experimental: { subagent_depth: 2.5 } }; }, 'non-integer', false],
    ['nan-depth', function () { const o = { experimental: {} }; o.experimental.subagent_depth = NaN; return o; }, 'non-integer NaN', true],
    ['null-depth', function () { return { experimental: { subagent_depth: null } }; }, 'non-number type', false],
    ['bool-depth', function () { return { experimental: { subagent_depth: true } }; }, 'non-number type', false],
    ['string-experimental', function () { return { experimental: 'x' }; }, 'experimental not an object', false],
    ['array-experimental', function () { return { experimental: [] }; }, 'experimental is array', false],
    ['null-experimental', function () { return { experimental: null }; }, 'experimental falsy', false],
    ['null-cfg', function () { return null; }, 'cfg not an object', false],
    ['number-cfg', function () { return 42; }, 'cfg not an object', false]
  ];
  let allOk = true;
  for (let i = 0; i < cases.length; i++) {
    const name = cases[i][0];
    const build = cases[i][1];
    const reason = cases[i][2];
    const isNaN = cases[i][3];
    const cfg = build();
    const snapBefore = isNaN ? 'NaN-input' : snap(cfg);
    let threw = null;
    try { raise(cfg); } catch (e) { threw = String(e); }
    let kept;
    if (isNaN) kept = (threw === null && Number.isNaN(getPath(cfg, ['experimental', 'subagent_depth'])) && Object.keys(cfg.experimental).length === 1);
    else kept = (threw === null && snap(cfg) === snapBefore);
    if (kept) { passed++; console.log('PASS T6 malformed-' + name + '-untouched [N6] reason=' + reason + ' before=' + snapBefore + ' after=' + (isNaN ? 'NaN-input' : snap(cfg))); }
    else { allOk = false; bad('T6 malformed-' + name + '-untouched [N6] reason=' + reason, 'before=' + snapBefore + ' after=' + snap(cfg) + ' threw=' + threw); }
  }
  if (allOk) console.log('PASS T6 suite malformed-all-untouched count=10 [N6]');
  else bad('T6 suite', 'one or more malformed inputs mutated or threw');
})();
(function t7() {
  const template = deepFreeze({ experimental: { subagent_depth: 1, keep: 'k' } });
  const templateSnap = snap({ experimental: { subagent_depth: 1, keep: 'k' } });
  const outs = [];
  let stable = true;
  for (let turn = 1; turn <= 3; turn++) {
    const cfg = { experimental: { subagent_depth: 1, keep: 'k' } };
    raise(cfg);
    outs.push(cfg);
    if (cfg.experimental.subagent_depth !== 3) stable = false;
    if (snap(cfg) !== snap(outs[0])) stable = false;
  }
  const templateNow = snap({ experimental: { subagent_depth: template.experimental.subagent_depth, keep: template.experimental.keep } });
  const frozen = Object.isFrozen(template) && Object.isFrozen(template.experimental);
  const firstIntact = outs[0].experimental.subagent_depth === 3 && outs[0].experimental.keep === 'k';
  if (stable && templateNow === templateSnap && frozen && firstIntact) ok('T7 static-no-mutate per-turn x3 (outputs-identical, template-frozen-unchanged)', { turns: 3, template: 'frozen' }, { outputs: '3,3,3 identical', templateUnchanged: true });
  else bad('T7 static-no-mutate per-turn x3', 'stable=' + stable + ' frozen=' + frozen + ' firstIntact=' + firstIntact + ' template=' + templateNow);
})();
console.log('INFO gates G1-readback covered=T1-T4 G2-no-extra-diff covered=T2+T4-keyscan G3-no-lower covered=T5');
if (failed > 0) {
  console.log('RESULT pass=' + passed + ' fail=' + failed + ' exit=1');
  process.exit(1);
}
console.log('RESULT all-pass pass=' + passed + ' fail=0 exit=0');
process.exit(0);
