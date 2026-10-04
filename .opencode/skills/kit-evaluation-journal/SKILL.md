---
name: kit-evaluation-journal
description: Use when a kit component is being tried, adopted, kept, or dropped, so the attempt and its score are recorded in the evaluation journal instead of being lost to memory.
---

# Kit Evaluation Journal

## Purpose

Keep one durable record of every kit component that has been evaluated: what was tried, against
what task, how it scored, and whether it was kept or dropped. The owner idea (دفتر تقييم العتاد)
is a ledger, not a review. Reviews are written once about one component; a ledger is consulted
before every adoption decision so the same component is not re-evaluated from scratch every
quarter, and so a component that failed once cannot be silently re-adopted.

Interpretation, and why this is a skill rather than a file: the catalog kind enum is
`skill | mcp | plugin | hook | agent | formatting` and has no document kind, so a bare document
would be an unregistrable orphan. This skill therefore **owns** the journal: it creates the file,
appends one entry per evaluation in a fixed entry shape, and refuses a decision that has no entry.
The skeleton ships as `assets/journal-template.md` and is copied into the consuming project on
first use.

## When to Use

- A candidate component has been identified and is about to be tried on real work.
- A component in the kit has not been exercised for months and its value is now in question.
- Someone proposes adopting a component the journal already has an entry for.
- A component is being dropped, and the reason needs to outlive the session that dropped it.
- A repeated failure suggests the kit carries a component that was never actually evaluated.

## Do NOT use

- Deciding whether to adopt a component. The journal records the decision and its evidence; it
  never makes the call. That judgement belongs to the owner of the consuming project.
- Recording progress on ordinary work. This is not a task log and not a status report.
- Evaluating upstream capability in the abstract, with no real task to try it on. An evaluation
  with no task produces a score with no meaning.
- Storing component source, install commands, or version pins. The registry holds those; the
  journal holds judgements, and the entry cites the registry id rather than restating it.

## Inputs

- Registry id of the candidate component, exactly as the catalog spells it.
- The real task the component was tried on, specific enough that a reader could repeat it.
- The rubric used to score it. A journal mixing two rubrics cannot be read as a sequence.
- The verdict: keep, drop, or trial again, with the condition attached to a trial.
- The date, and the person or session that owns the verdict.

### Rubric

Score each axis on the same scale every time, or the sequence of entries is unreadable:

| Axis | The question it answers |
| --- | --- |
| Fit | Did it solve the task it was tried on, without adaptation? |
| Cost | Tokens, wall time, and tool calls spent relative to doing it by hand. |
| Friction | How many steps of the procedure were skipped, inverted, or improvised? |
| Reach | Does it still work on the *next* task, or only this one? |
| Evidentiary basis | Which command or observation proved each score? |

The last axis is the one that makes the journal worth keeping. A score with no proof of how it
was reached is an opinion wearing a number.

## Procedure

1. **Open the journal** at `assets/journal-template.md` in the consuming project. If it does not
   exist, copy the template and fill the header fields: project name, rubric version, owner.
2. **Check for a prior entry** on this registry id. A component with one existing entry gets a
   *revision* under that entry, never a second top-level entry.
3. **Write the attempt first, verdict last.** Attempt, task, rubric version, per-axis score with
   the evidence beside it. Filling the verdict before the evidence is how journals become
   advocacy.
4. **Record the verdict in one of three forms.** Keep: adopted, with what it now owns. Drop:
   retired, with the condition that would justify reopening it. Trial: a named next task and a
   date by which the trial is decided.
5. **Name the condition.** Every drop states the specific thing that would change the verdict.
   "Not useful" is not a condition; "never reaches the second phase of a three-phase migration"
   is.
6. **Append, never rewrite.** History is the value. A wrong score is corrected by a later entry
   that cites the earlier one; editing a past verdict destroys the record of the decision.
7. **Cite the registry id** for the component and the commit or version at which it was
   evaluated, so a reader can tell whether an old verdict still describes the current component.
8. **Keep and drop counts live.** Maintain the summary table at the top from the entries below
   it, and reconcile it before declaring the journal current.

## Outputs

- `assets/journal-template.md` copied into the consuming project on first use.
- One entry per evaluation: attempt, task, rubric, per-axis score with evidence, verdict, and the
  reopen condition.
- A maintained summary table: component, verdict, date, owner.
- A trail of revisions under any component evaluated more than once.

## Failure Modes

- **Rubric drift.** Scores arrive on different scales and the sequence means nothing. The rubric
  version is part of the header and part of every entry; changing it starts a new journal.
- **Verdict without evidence.** A component scored on vibes ends up on the keep list for years.
  If no axis carries the command or observation behind it, the entry is incomplete and the
  evaluation did not happen.
- **The journal becomes an adoption registry.** Storing install commands and version pins here
  forks the catalog. The entry cites the registry id and stops.
- **Silent re-adoption.** A dropped component returns because nobody read the journal. The prior
  entry check in step 2 is the whole point of the ledger.
- **Silent rewriting.** A flattering edit to a past drop destroys the only reason the ledger was
  worth keeping. Append always.
- **Entries with no task.** "Evaluated, seems good" is not an evaluation; there was no evidence
  to score.
