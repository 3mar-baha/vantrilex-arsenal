# Eval packs — LD-27 acceptance system (0.9.27)

Doctrine: FULL

Lane: build-release (AUTO-0.9-FULL 0.9.27, twenty-seventh of 33; this file covers
0.9.27 ONLY, never 0.9.28). Node: b0927-build.
Date (UTC): 2026-10-31. No model pin.
Authority: sole-authority V3:5748-5900 (treatment + exit criteria + open
questions, carried as data); fallback FBLD-27 carried verbatim in section 9
(lean cite, never widened — never resolved).
Scope: this file defines the pack formula. The executable proof is
`scripts/verify-eval-packs.mjs` (twenty-six checks, exit 0 PROCEED).

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 1. Pack formula (all five hold together, or the pack is a task with an unchecked verdict)

An eval pack is accepted only when all five hold together (V3:5898):

1. **Task.** The pack names what is measured: one task statement T with a
   fixed input shape. A pack with no task statement is REJECTED (check
   `pack-formula-complete`).
2. **Fixture.** The pack carries at least two known fixtures: one known-good
   `F-good` and one known-broken `F-bad` whose defect is named (V3:5899).
   Fixtures are hash-pinned at acceptance and preserved unmodified afterwards:
   any post-acceptance drift fails the gate (checks `fixtures-preserved`,
   `no-evaluator-without-two-fixtures`).
3. **Evaluator.** The pack names one evaluator E with a fixed verdict shape
   (`ACCEPT` / `REJECT`). No pack enters the index without a tested evaluator,
   and no evaluator is accepted without its two known fixtures (checks
   `no-pack-without-tested-evaluator`, `no-evaluator-without-two-fixtures`,
   `test-record-preserved`).
4. **Version.** The pack carries a version `vN`. Difficulty labels and measures
   bind to the measured version only and are never carried across versions
   without re-measurement (checks `difficulty-bound-to-version`,
   `carry-demands-remeasure`).
5. **Index link.** The pack is discoverable through the index, and the index
   link is bilateral: the pack entry links the measured component, and the
   component entry links the pack back (checks `bilateral-links-both-sides`,
   `index-complete`).

## 2. Evaluator pre-acceptance test (the verdict itself is tested)

Every evaluator is tested before acceptance against the two known fixtures
(V3:5888):

- Against `F-good`: the evaluator must return `ACCEPT`. An evaluator that
  rejects the known-good fixture is REJECTED, because rejecting the correct
  blocks legitimate work exactly as passing the broken voids protection
  (V3:5865; check `reject-good-evaluator-rejected`).
- Against `F-bad`: the evaluator must return `REJECT`. An evaluator that
  passes the known-broken fixture is REJECTED with a rejection record — never
  a warning and never a temporary acceptance — because one pass proves the
  gate is perforated (V3:5862, V3:5896; checks
  `pass-broken-evaluator-rejected`, `rejection-recorded`).
- An evaluator that passes a defect OTHER than the named one has found a
  fixture gap, not committed an evaluator failure: the evaluator stays
  accepted, the fixture set is extended, and the pack takes a new version
  (open question V3:5872 decided; V3:5883 decided — the arbiter is the
  `defect-known` flag on the fixture, applied by the pre-acceptance gate).

Seed evaluator E-01 (section 7) passes both sides; the always-pass and
always-reject evaluator fixtures both fail pre-acceptance with records.

## 3. Difficulty from measured rates only (labels are written after measurement)

A difficulty label is written from measured success rates only (V3:5863):

- Label shape: `difficulty:<band> (<rate> on <tool> <version>)`, where band
  follows the rate (`easy` at 0.80 and above, `medium` at 0.50 and above,
  `hard` below 0.50) and `<tool> <version>` names the exact measured pack
  version (V3:5882 decided; check `difficulty-label-shape`).
- The schema makes writing a label without measured rates impossible, not
  merely forbidden: `assignDifficulty` throws `REFUSED-WRITE-WITHOUT-MEASURE`
  when rates are missing or empty, and the throw is proven by a refused write
  attempt in the harness (V3:5890; check `difficulty-without-measure-refused`).
- A label is bound to its measured version: carrying a label to a new version
  without re-measurement returns `REMEASURE-REQUIRED`, never the old label
  (V3:5889, V3:5871 decided; checks `difficulty-bound-to-version`,
  `carry-demands-remeasure`).

## 4. Calibration with healthy variance (a pack that cannot discriminate is reworked)

Every accepted pack carries a recorded calibration run (V3:5897):

- Minimum sample: at least 3 levels spanning easy, mid, and hard, with at
  least 4 trials per level (V3:5879 decided).
- Healthy variance: the spread `max(rate) - min(rate)` is at least 0.25, and
  the run is neither all-zero nor all-hundred (V3:5864). A run that is all
  zero or all one hundred is reformulated, never accepted on hope (V3:5893;
  checks `calibration-healthy-variance`, `all-zero-reformulated`,
  `all-hundred-reformulated`).
- The spread threshold separates signal from noise together with the minimum
  sample: a spread on a single level, or on fewer than 12 total trials, does
  not count (V3:5873 decided).
- A pack whose measured component changes after acceptance is SUSPENDED from
  the index on hash drift and re-admitted only by recalibration under a new
  version — never carried silently, never left measuring the past (V3:5874
  decided; V3:5830 carried as data). Calibration proves discrimination, not
  durability: a pack that discriminates in calibration but flatlines in real
  use is SUSPENDED and reformulated (V3:5880 decided).
- Review cadence: every release re-runs this harness; growth is gated — no new
  pack is accepted while any accepted pack shows unhealthy variance (V3:5885
  decided). Category quality is the discrimination index: the mean spread
  across accepted packs with zero unmeasured labels and zero one-way links,
  reported by the harness digest (V3:5886 decided).

## 5. Bilateral index links (checked from both sides)

The category is fully visible in the index: no accepted pack lives outside it
(V3:5895; check `index-complete`). Every link is bilateral and is checked from
both sides (V3:5866, V3:5891; check `bilateral-links-both-sides`):

- Pack entry `EP-NN` lists its measured component; component entry lists `EP-NN`
  back. A link readable from one side only is a defect, not a partial pass
  (V3:5868 decided — the index owns both directions and the harness reads both).

## 6. Integration recipes as a skill subtype (no new kind)

Integration recipes are a subtype of the skill kind, never a new kind
(V3:5845, V3:5853 carried as data; check `recipe-skill-subtype-no-new-kind`):

- Every recipe carries its host version visibly at load (V3:5867, V3:5894;
  check `recipe-host-version-visible`): `host:` plus `host-version:` plus
  `expires:`, printed by the loader before any recipe step runs.
- Every recipe is fast-expiring: `expires:` falls within 90 days of acceptance
  (V3:5876 decided; check `recipe-fast-expiry`). Past expiry the loader refuses
  with `[eval-packs] EXPIRED`; expiry within 30 days prints
  `[eval-packs] NEAR-EXPIRY` — two distinct tokens, never one vague warning.
- An expired recipe is preserved tagged `EXPIRED`, never silently deleted and
  never silently revived; only a new recipe version re-admits it (V3:5884
  decided). When the host version ends, the recipe ends with it (V3:5876
  decided): the recipe never outlives the version it was written for.

## 7. Seed pack EP-01 (one pack, fully worked, zero exemptions)

Seed pack EP-01 (scope `workflow-trial-verify` exactly — one consumer, no
cross-scope mixing):

| Element | Value |
|---|---|
| Task T-01 | Decide whether a trial report states its verdict token exactly once. |
| Fixture F-good | Report containing the verdict token once and no defect marker. |
| Fixture F-bad | Report with the named defect: verdict token missing (defect-known: missing-token). |
| Evaluator E-01 | Returns `ACCEPT` iff the output contains the expect token exactly as pinned and contains no forbid marker; `REJECT` otherwise. |
| Version | v1, difficulty `difficulty:medium (0.583 on e1.0 v1)`. |
| Index link | Pack entry EP-01 links component `workflow-trials`; component entry links EP-01 back. |
| Calibration | 3 levels x 12 trials: L1-easy 11/12 (0.917), L2-mid 7/12 (0.583), L3-hard 2/12 (0.167); spread 0.750, recorded. |
| Recipe IR-01 | Skill subtype `integration-recipe`, host `workflow-trials`, host-version `0.9.27`, expires `2026-12-29` (59 days, fast). |
| Consumption | Trial T-01 runs on E-01 over F-good and F-bad (V3:5892; check `workflow-trial-consumption`). |

Fixtures are owned by this category file and its harness: hash-pinned at
acceptance, and any edit changes the pin and fails the gate, so no edit can
quietly flatter a weak evaluator (V3:5875 and V3:5878 decided; check
`fixtures-preserved`). Evaluator E-01 stands until its code or its fixtures
change (hash-pinned); any change forces a full pre-acceptance re-test
(V3:5881 decided). Workflow trials are the first consumer proven here (trial
T-01); later acceptances may consume the category too — none blocked, none
required (V3:5877 decided). When the measured component changes, its fixtures
are re-reviewed at recalibration: drift auto-marks the pack SUSPENDED and the
reviewer running this harness confirms stale-or-current before re-admit
(V3:5870 decided). Exemptions: 0 — the seed is built on this same formula with
zero seed exemptions (check `seed-passes-all-gates`).

## 8. Zero invented installs

This change introduces no installable component and no install command. Every
`install_cmd` touched by this lane is `null` with `verification: unverified`
where unprovable; a null command plus `unverified` beats a plausible lie. No
registry, catalog, or sidecar file is modified on this node.

## 9. FBLD-27 (carried verbatim, never resolved)

FBLD-27 — Slot 0.9.27 — Conflict: V3 slot scope versus R3 ensemble-evaluation breadth — Fallback: lean cite, never widened — Matches LD-27 — Status FLAGGED, never resolved.

Provenance (honest, not a second copy): the dispatch brief names the conflict
(`vs R3 ensemble-evaluation breadth`) and the fallback shape (`lean cite,
never widened`); the full entry above is carried from
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:39` verbatim.
V3 gate text wins on any conflict; ensemble breadth stays a lean cite, never
adopted as scope here. This node ships one evaluator, one seed pack, and
fixed fixtures — no ensemble, no widening.

---

Ponytail: FULL — pack formula plus tested evaluators plus measured difficulty, no speculative abstraction.
