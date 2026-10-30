# LD-20 Workflow trials mechanism (0.9.20)

Lane: build-release (AUTO-0.9-FULL 0.9.20 ONLY, never 0.9.21).
Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:4672-4823`.
Status: mechanism definition. Nothing here judges far quality; see section 9.

## 1. What this mechanism is

A trial proves a defined workflow behaves, it does not argue that the
workflow reads well. For every accepted workflow the mechanism runs three
fixed scenarios on frozen fixtures, applies the anti-result gate to every
revision, pins the results beside the version, and refuses anything that
crosses the honest boundary. The probe
(`verify-workflow-trials-0920.mjs`) re-runs every claim below; a claim the
probe cannot recompute is not a claim, it is prose.

## 2. Fixed fixtures, frozen pre-release

Each accepted workflow carries exactly three fixtures, frozen before any
release that cites them:

| Fixture id | Scenario | Stated attempts | What it proves |
|---|---|---|---|
| `fx-happy` | happy path, clean inputs | 5 attempts | the workflow succeeds when nothing is wrong |
| `fx-degraded` | degraded inputs (slightly and heavily skewed) | 7 attempts | the workflow survives real-world skew |
| `fx-midcut` | mid-run cut, resume from traces | 4 pre-cut turns, then resume | the workflow resumes from traces, never restarts |

Rules:

- The fixture bytes are frozen before the release: the same bytes run for
  every version until a recorded revision replaces them. A fixture that
  changes with the version compares circumstances, not versions, and the
  comparison is void.
- Every fixture states its attempt count up front. A fixture without a
  stated count is refused before it runs.
- Results are recorded unbeautified: losses stay in the record. A record
  with the losses removed is not a good record, it is no record.
- The mid-cut fixture cuts for real: the run is interrupted mid-way and
  resumed from its traces. Re-running from the start under the name of
  resuming is refused.
- A fixture revision for a later version is a new recorded revision with
  its own hash, never a silent edit of the frozen bytes.

Reference fixture results for the mechanism's own acceptance (unbeautified):

- `fx-happy`: 5/5 pass.
- `fx-degraded`: 5/7 pass (2 losses kept in the record).
- `fx-midcut`: cut after 4 turns, resumed from traces, completed 1/1.

## 3. Anti-result gate (`wt-trial-gate`)

No revision is accepted unless both hold together:

1. No regression: every scenario that passed on the pinned baseline still
   passes on the same frozen fixtures. A revision that regresses anywhere
   is refused even if it improves elsewhere.
2. Evidence-named improvement: the revision names its evidence of
   improvement before judgement. Improvement that cannot name its evidence
   is taste, and taste is refused no matter who offers it.

Every refusal is logged with its reason. A refusal without a reason is
itself refused. The gate is proven only by refusing for real: the probe
submits one evidence-free revision and one regressing revision, and both
are refused and logged.

Regression means: any previously passing scenario now fails, or the
per-version success rate drops against the pinned prior rate on the same
fixtures. Tolerance for scenario loss is zero; the rate is compared on
equal attempts, never across different samples.

Improvement evidence may be quantitative (rate or count on the same
fixtures) or qualitative (a named observable check a non-author can
re-run). An unnamed feeling is not evidence of either kind.

## 4. Actor validity as an in-eval property

Every step names its required actor, and the evaluation checks the actor
on every step as part of the verdict, not as a side note and not as an
optional audit afterwards. A step executed by the wrong actor fails the
evaluation even when its output looks right, because the wrong actor may
produce an effect it has no right to produce under a right name. The probe
assigns one step to a wrong actor on purpose and the evaluation catches
it.

## 5. Results pinned beside the version

Every catalog entry for an accepted workflow carries its trial results
beside its version: version, per-scenario results, attempt counts, and the
per-version success rate computed from those attempts. A rate without its
attempt count is refused, because a rate without a sample hides its
sample. An old entry is readable after months without its original
examiner: version plus results plus rate, in the entry, not in a separate
document that versions can lose.

## 6. Prefixed level names

The two trial levels are always cited with their prefix, in every record,
every entry, and every reference:

- `wt-trial-result`: the outcome level (per-scenario passes, rates).
- `wt-trial-gate`: the gate level (regression check, evidence check, refusals).

A bare citation without the prefix is refused, because it can be confused
with another level and the confusion voids the value of the distinction.

## 7. What lands

- Trial results on fixed fixtures covering happy, degraded, and mid-cut
  with resume from traces.
- The anti-result gate: no regression plus evidence-named improvement, or
  the revision is refused and logged with its reason.
- Results pinned in the catalog entry beside the version, with a
  per-version success rate over stated attempts.
- Actor validity checked as an in-eval property: no step by a wrong actor.
- Prefixed level names (`wt-trial-result`, `wt-trial-gate`) in every citation.
- Every acceptance bound to its trial record: no acceptance without a
  record, no record without a bound acceptance.

## 8. Close rule

Closure needs all three together: three scenarios for every accepted
workflow, pinned results, and a gate that actually refused. Any one
missing keeps the slot open.

## 9. Honest boundary (mechanics only, no far judgement)

The trials prove mechanical reliability and non-regression. They do not
prove far-judgement quality: far quality accumulates from field signals
and review over time and is never claimed from a fixture. Any claim that
reaches past the boundary is refused. Every trial report states the
boundary: what the trials proved is mechanics and non-regression; what
they did not prove is far-judgement quality. A trial report without the
boundary claims more than it proved, even when its proof is sound.

## 10. Open questions V3:4781-4786 — all six DECIDED with evidence inside W1

- 4781 DECIDED: actor validity is a boolean per-step property evaluated
  inside the verdict (`wt-trial-gate` check `actor-valid-in-eval`; probe
  `q4781-actor-in-eval`). A side audit after the verdict is not enough.
- 4782 DECIDED: on conflict between field signals and fixture results, the
  fixture result stands and the field signal opens a recorded question
  about the fixture itself; the field never silently overrides the
  fixture (probe `q4782-fixture-stands`). A fixture a field can silently
  overrule proves nothing.
- 4783 DECIDED: stated attempts are happy 5, degraded 7 (graduated by
  skew), mid-cut 4 pre-cut turns plus one resume. The rule for later
  workflows: stated up front, at least 3, graduated by scenario, never a
  burden and never a thin sample (probe `q4783-attempt-counts`).
- 4784 DECIDED: the fixture is built in W1, hash-recorded, and frozen
  before release; a later revision is a new recorded revision, never a
  silent edit (probe `q4784-frozen`).
- 4785 DECIDED: regression is defined as any previously passing scenario
  failing, or the success rate dropping against the pinned prior rate on
  the same fixtures; scenario-loss tolerance is zero (probe
  `q4785-regression-defined`). The threshold holder is this definition,
  not a person.
- 4786 DECIDED: quantitative evidence (rate or count on the same fixtures)
  always counts; qualitative evidence counts only as a named observable
  check a non-author can re-run; an unnamed feeling never counts (probe
  `q4786-evidence-kinds`).

## 11. Fallback carried

FBLD-20 — Slot 0.9.20 — Conflict: V3 slot scope versus R3 learnings-journal pass proposal — Fallback: pass-through journal reference only, never SaaS — Matches LD-20 — Status FLAGGED, never resolved.

The journal is cited pass-through only. This slot builds no journal
service, adopts no journal SaaS, and sends nothing anywhere.

## 12. Install honesty

install_cmd: null. Verification: unverified — this mechanism cites no
registry component and proves no install path, so there is nothing to
install and no command to give. No fetched toolchain, no added package,
zero dependencies (node standard library only).
