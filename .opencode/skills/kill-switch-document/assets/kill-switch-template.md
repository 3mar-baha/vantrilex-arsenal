# Kill-Switch Document

Change:
Owner:
Rehearsed on target:
Last amendment:

## The three questions

Under time pressure, this document is read to answer exactly three things. If any row below
cannot answer one of them, the document is not ready and the change does not ship on this basis.

1. **What exactly do I run?** One named command, pasted verbatim. No alternatives.
2. **Who am I allowed to run it?** Authority named by role and by person, per row.
3. **How do I know it worked?** One observation per row, readable without domain knowledge.

## Fully stopped state

Describe the system at rest, so an observer can tell stopped from idle:

-

## Stoppable stages

Ordered earliest to latest. One row per stage. A stage with no halt is written down as not
stoppable rather than left blank.

| Stage | Command to run | Authority (role and name) | Observation that the halt took effect | Observation that work did not resume | Reversible | Rollback and what it does not undo |
| --- | --- | --- | --- | --- | --- | --- |
| Queued, not started | | | | | | |
| In progress | | | | | | |
| Partially applied | | | | | | |
| Published | | | | | | |
| Live | | | | | | |

Rules for filling this table:

- One command per stage. A stage listing two commands hands the decision to the reader at the
  worst possible moment.
- `Authority` is `unassigned` until a role and a name are both written. An unassigned stage is not
  ready, and this document does not pretend otherwise.
- `Reversible` is yes or no. A `no` row must name who authorised proceeding past that stage.
- `Rollback and what it does not undo` is never blank. Stopping is not undoing, and an operator
  looking for a restore that does not exist loses the time the halt was meant to save.

## Rehearsal record

Every command above, run in order against a non-production target. The expected column is written
before the run; the observed column is filled from real output. A mismatch is a document defect,
fixed here and never during a real halt.

| Date | Stage | Expected | Observed | Command run unchanged |
| --- | --- | --- | --- | --- |
| | | | | |

## Amendments

Append only. Every addition, command change, authority change, or removal, with the date and the
reason it was needed. The history of this document is how a reader knows which steps were trusted
and when they stopped being trusted.

| Date | Stage | Change | Reason | Changed by |
| --- | --- | --- | --- | --- |
| | | | | |

## Invariants of this document

- Rows are never edited to match an action that already happened. The action is recorded as an
  amendment, and the change that required it is named.
- A step whose mechanism no longer exists is removed only by amendment, with the date it was found
  broken.
- A row that has not been rehearsed since its last amendment is treated as unproven, exactly like a
  test that has never been seen red.
- This document covers the operational stop of deployed or outward-facing work. It does not cover
  halting a repeated failed fix attempt; that halt belongs to the circuit breaker and is owned by
  its own component.
