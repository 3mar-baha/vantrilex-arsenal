# LD-19 Workflow Category v1 — factory-category spec

Lane: build-release (AUTO-0.9-FULL 0.9.19 ONLY, never 0.9.20)
Node: b0919-build (wave 1 of 10, parallel with r0919-readme-draft)
Owner: vantrilex-typescript (worker-only; never lead/dispatch/declare)
Date (UTC): 2026-10-30
Status: v1 (sole treatment source V3:4519-4670; fallback FBLD-19 carried verbatim in section 11)
English only.

## 0. Claim

Workflows become a factory category equal to skills and agents: a defined
schema, acceptance gates, and index representation. Anything without a schema,
gates, and an index entry is a practice, not a category member. The current
index holds a single row, which proves the category is unbuilt, not complete.

## 1. Canonical schema (what must be)

A workflow record is a JSON object with exactly these top-level fields:

- `id` (string, kebab-case, immutable across versions)
- `version` (string `major.minor`, e.g. `1.0`)
- `risk` (`low` | `standard` | `high`, classified BEFORE gates, section 5)
- `steps` (ordered array of step records, at least 1)
- `gates` (array of gate records, at least 1)
- `loops` (array, possibly empty; each entry needs an exit, section 4)
- `waits` (array, possibly empty; each entry needs a wake condition, section 4)
- `narrative` (narrative record, section 2)
- `changelog` (record with `plan` and `close` gate results, section 6)
- `index` (index record, section 7)
- `rejections` (array of rejection records, section 8; empty until a rejection occurs)

Step record fields: `stepId` (stable, section 3), `kind`
(`task` | `gate` | `loop` | `wait`), `artifacts` (non-empty string array of
produced artifact names; a tombstoned step is exempt because it produces
nothing anymore), `gateRef` ( gate id that must pass for this step, or empty
for a pure narrative step), `tombstone` (boolean, default false).

Gate record fields: `gateId`, `checks` (non-empty string array; a gate with
zero checks is malformed), `appliesTo` (risk tiers it runs for).

Loop record fields: `loopId`, `overStepIds` (non-empty), `exits`
(non-empty string array; an empty exit list is malformed and rejected).

Wait record fields: `waitId`, `onStepId`, `wakeCondition` (non-empty string;
an empty or missing wake condition is malformed and rejected).

## 2. Narrative schema (what happens)

The narrative record carries `orderedStepIds` (string array) plus `prose`
(human sentences in execution order). Rule N1: `orderedStepIds` must equal
the canonical `steps` order restricted to non-tombstone steps, element for
element. Any order mismatch means the narrative describes a different
workflow and both are refused together. The check is mechanical string-array
equality, never eyeballing.

## 3. Stable step-id rule + no in-version renumber + tombstone

- S1 stable: a `stepId` once published never changes meaning. Later versions
  may append new steps but never reuse or rename an existing id.
- S2 no in-version renumber: within one `version` value the ordered id list
  is frozen. A revision that renames, reorders, or drops an id without
  bumping the version is rejected.
- S3 deleted-becomes-tombstone: deleting a step sets `tombstone: true`,
  records `deletedIn` (the version that removed it), and keeps the record in
  every later version. Tombstones are never purged for tidiness. Old
  references resolve against the tombstone, so feedback and repair loops keep
  working instead of dangling.

## 4. Mechanical gates (per-gate checks, per-loop exits, per-wait wakes)

- G1: every gate lists at least one check; a gateless workflow or a checkless
  gate is REJECTED before any human judgement.
- G2: every loop lists at least one exit; a loop without an exit is REJECTED
  (it may never terminate).
- G3: every wait lists a wake condition; a wait without one is REJECTED (an
  unbounded wait).
- G4: every non-tombstone step lists at least one artifact; a missing
  artifact is REJECTED (an unprovable step).
- G5: narrative-vs-spec order is checked mechanically per section 2; a
  mismatch is REJECTED.

## 5. Risk-tiered depth (owner-decided, depth only rises)

Classification happens BEFORE gates with a stated criterion (section 10,
Q3). Depth:

- `low`: basics (G1-G5) plus a declared sample of one evidence item per gate.
- `standard`: everything in `low`, plus deeper checks (two evidence items per
  gate plus a dry-run on a miniature model carrying the workflow essence).
- `high`: everything in `standard`, plus the deepest check always (full
  evidence per gate plus dry-run plus index integration) AND the owner sign
  at acceptance. The sign is acceptance-after-inspection, never a substitute
  for inspection. Reclassifying a `high` workflow as `low` to lighten a gate
  is rejected unless a new written reason is recorded and re-gated.

This tiering is an owner correction: depth rises with risk and never falls
below the basics. Any reading of the tiers as a general lightening is wrong.

## 6. Changelog plan + close gates (on a real task)

- Plan gate runs BEFORE work on a real task carrying an actual change (never
  a synthetic task built to pass): it checks schema validity, risk
  classification, and gate readiness.
- Close gate runs AFTER work on the same real task: it checks mechanical
  rejection evidence, narrative match evidence, index entry presence, and
  that every rejection carries a reason.
- Both gates carry their own checks, not signatures alone. A missing gate
  result blocks acceptance.

## 7. New index-kind entries

Accepted workflows appear in the index under kind `workflow`. Each entry
carries `id`, `version`, `results` (gate outcomes), and `gatesPassed` (gate
ids that passed). An accepted workflow without an index entry does not exist
administratively. The entry is a copy of outcomes, not a copy of the name.

## 8. Every rejection logged

Every rejection appends `{ workflowId, reason, at }` with a non-empty
`reason`. A rejection without a reason is itself a defect and is refused as
incomplete. The log is the learning record for later workflows.

## 9. Exit criteria V3:4622-4627 (COVERED; probe section maps each)

- 4622 malformed rejected mechanically (loop without exit or missing
  artifact): probe `loop-without-exit-rejected`, `missing-artifact-rejected`,
  `wait-without-wake-rejected`.
- 4623 narrative-vs-spec order checked automatically and rerunnably: probe
  `narrative-order-match-pass` plus `narrative-order-mismatch-rejected`.
- 4624 plan and close changelog gates work on a real task: probe
  `changelog-gates-real-task`.
- 4625 a real workflow accepted through all gates with an index entry
  carrying its version: probe `real-workflow-accepted-indexed`.
- 4626 every rejection logged with its reason, every tombstone kept in later
  versions, every risk classification stated before its gates: probe
  `every-rejection-logged`, `tombstone-kept`, `risk-classified-before-gates`.
- 4627 at least one id stable across a version and one deleted step kept as a
  tombstone: probe `stable-id-across-version`, `tombstone-kept`.

## 10. Open questions V3:4628-4633 (all six DECIDED here with evidence)

- 4628 work-orders schema as a workflow component: DECIDED deferred, not in
  this slot. This slot builds the category only; candidacy is studied against
  the finished category later. Evidence: probe `q4628-deferred` asserts the
  spec carries no `work-orders-component` acceptance and the index kind list
  contains only `workflow`.
- 4629 tombstone management over long version runs without a graveyard:
  DECIDED readable-tombstone rule — tombstones stay queryable via a
  `tombstone-index` (id plus deletedIn) and every review must resolve at
  least one old reference against it; nothing is purged. Evidence: probe
  `q4629-tombstone-index` (old reference resolves to the tombstone).
- 4630 exact risk-classification criterion and who classifies on dispute:
  DECIDED criterion — touches a release or user data means `high`; touches
  shared gates or the index means `standard`; documentation-only means
  `low`; on dispute the owner classifies and records the reason before
  gates run. Evidence: probe `q4630-risk-criterion` (three sample workflows
  classify high/standard/low; a disputed reclassification without a reason
  is refused).
- 4631 handling of existing unclassified practices: DECIDED declared-outside
  rule — every existing practice is either redefined per this schema before
  close or declared `outside-category` in the open; silence never implies
  membership. Evidence: probe `q4631-declared-outside` (an unredefined
  practice resolves to `outside-category`, never to silent membership).
- 4632 exact low-tier sample size and selection so it is not a hole:
  DECIDED one evidence item per gate, selected as the riskiest check of that
  gate, recorded with the acceptance; a sample that skips the riskiest check
  is rejected. Evidence: probe `q4632-low-sample` (low acceptance without the
  riskiest check fails; with it passes).
- 4633 narrative-vs-spec check scope on long workflows: DECIDED
  full-order check always — the whole `orderedStepIds` array is compared,
  not a prefix; limits are on prose length, never on order coverage.
  Evidence: probe `q4633-full-order` (a late-position swap is rejected).

## 11. Fallback FBLD-19 carried verbatim

FBLD-19 — Slot 0.9.19 — Conflict: V3 slot scope versus R4 skill-authoring-loop merge pressure — Fallback: keep discovery and forging as two records, never merged — Matches LD-19 — Status FLAGGED, never resolved.

Discovery and forging stay two records in this category: a discovery record
(survey output) and a forging record (built artifact) are never merged into
one entry. The probe check `fbld19-honesty` asserts the verbatim string is
carried and that no merged record type exists.

## 12. Install honesty

install_cmd: null. Verification: unverified — no registry proof exists for a
workflow-category installer, so no install command is stated and none is
invented. The probe check `install-honesty` asserts no invented package-install
command appears in this spec or the probe.
