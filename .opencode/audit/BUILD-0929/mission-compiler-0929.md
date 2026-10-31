# LD-29 Mission compiler plus planning-quality loop (0.9.29)

Lane: build-release (AUTO-0.9-FULL 0.9.29 ONLY, never any other slot).
Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:6057` (slot heading
`0.9.29 — Mission compiler + planning-quality loop`), carried as data, with the
binding note at `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:61` through `:68`
(the output-spec requirement is binding, but its home is unruled: the planner
proposes placement with reasoning and no slot is presented as the decided
home).
Slot identity: LD-29 — Slot 0.9.29 — Mission compiler plus planning-quality
loop. The slot label is carried LD identity data, never a decided-home claim
(see §8).
Status: mechanism definition, working-copy-only. Nothing here edits the shipped
product and nothing here decides the output-spec home.

The probe (`verify-mission-compiler-0929.mjs`) re-runs every claim below; a
claim the probe cannot recompute is prose, not a claim.

## 1. What this mechanism is

An approved objective plus a gap register becomes a mission plan in the house
shape, checked by machine before any execution starts. The compiler writes no
free-form plan: it emits phases and gates and exit criteria and effort per
node, then checks the emission. The first check is completeness: every phase
has a gate, every gate has a check, every check has an owner. The second check
is historical calibration: estimated effort is measured against a past-task
record, never against the planner's feel.

The second loop is what makes planning improve by measure instead of by habit.
After execution the plan is graded: estimated against actual in effort, in gate
failures, in rework. The grades feed planner calibration, so a planner whose
estimates drift in one direction on a schedule shows up instead of staying
hidden.

A free-form plan looks like a plan while it is a wish, because it names no
gates and no checks and no owners. A house-shape plan is a contract: every
phase has a gate, every gate has a check, every check has an owner.

## 2. The three known inputs

The compiler takes exactly three known inputs, entered openly and on the
record so a reviewer sees what went in:

1. The approved objective — what was ruled, never what is wished. The compiler
   emits no plan without an approved objective, so no plan exists for an
   unapproved goal.
2. The gap register — the known weakness and staleness and defect, so the plan
   enters knowing what it faces.
3. The update log — the previously recorded commitments, so none is forgotten
   at planning time.

## 3. The house shape (one fixed shape across plans)

Every emitted plan carries the same fields, never one shape per planner:

- phases, each with exactly one gate;
- each gate with exactly one check that names how verification happens
  (a check name alone is not a check);
- each check with exactly one owner who bears a failed check and decides what
  follows;
- effort per node, never one whole-task number, so the weight lands where the
  work lands;
- exit criteria per phase.

Every emission is labeled a draft at emission. A planner edit to a draft keeps
its trace: what came from the compiler and what came from the ruling stay
separable, never merged silently.

## 4. The completeness checker (refusal, never silent repair)

The checker runs on the whole plan, because one gapped phase breaks the
contract of the full plan. It refuses a plan with any of: a phase without a
gate; a gate without a check; a check without an owner; a check that names no
verification act; a node without effort. Refusal is refusal of the gapped
plan, never silent repair of it: silent repair hides the gap from the planner.

A known-gapped plan must fail the checker whether the gap is a gate, a check,
or an owner. A known-complete plan must pass it; a checker that refuses the
complete plan is itself defective and is repaired before the compiler.

## 5. Historical calibration (deviation is a number)

Estimated effort is set against a real past-task record and the drift is
shown as a number, so the planner knows the size of the drift and not only
its direction. The record must be real: a made-up record that proves what is
wanted proved is refused as a baseline.

A task with no matching past record is marked calibration-deferred, never
calibrated by feel. A plan that passes the checker while its calibration
shows large drift carries a visible warning, never silent passage.

## 6. The quality loop (starts after execution, never before)

Planning quality is known only by estimated-against-actual, so grading starts
after execution. Grades are recorded complete — effort, gate failures,
rework — because an effort grade alone hides gate failure and rework. Grades
feed calibration by machine, so recorded grades are never left to be
remembered. A planner drifting on a schedule shows in the calibration grades
instead of staying hidden behind later estimates. How grades are weighted
(effort against gate failure against rework) stays an open question carried
from the slot treatment, never settled here.

## 7. Update consumption and the written recurring-commitment ruling

Every previously recorded update that touches a mission's scope enters its
plan, and the entry is proved. A touching update missing from the plan is
compiler failure, never planner oversight.

Where a mission creates a new recurring commitment, the ruling is written in
the plan, never left implicit for those present at the discussion only. The
compiler carries the planner's ruling and never rules on its own: a compiler
that rules on its own exceeds its bound.

## 8. Bounds (binding)

- Drafts are drafts: labeled at emission, never handled as approved planner
  plans.
- Naming of missions and redefinition of missions stay outside the compiler
  entirely and are never automated: automating them removes the ruling the
  planner exists to emit.
- No decided home: the output-spec placement question (V3:61-68) is bound by
  the placement rule below. This file proposes no placement and presents no
  slot as the decided home for the output-spec requirement.
  Placement rule (one unbroken line): planner proposes placement with reasoning; no slot is the decided home.
- FBLD-29 carried verbatim (one unbroken line):
  "FBLD-29 — Slot 0.9.29 — Conflict: any reading of 0.9.29 as the decided home versus the explicit no-decided-home rule — Fallback: planner proposes placement with reasoning; no slot is the decided home by this file — Matches LD-29 — Status FLAGGED, never resolved."
- Install honesty: install_cmd: null, verification: unverified. No shell
  provisioning line is claimed for this mechanism; a plausible-looking line
  would be worse than this admission.
