# Kit Evaluation Journal

Project:
Rubric version:
Journal owner:
Opened:

## Rubric in force

Score every axis on this scale, and record the evidence beside the score.

| Score | Meaning |
| --- | --- |
| 0 | Not exercised on this task |
| 1 | Exercised and failed |
| 2 | Exercised with heavy improvisation |
| 3 | Exercised as written |
| 4 | Exercised and nothing left over |

| Axis | Question it answers |
| --- | --- |
| Fit | Did it solve the task it was tried on, without adaptation? |
| Cost | Tokens, wall time, and tool calls relative to doing it by hand. |
| Friction | How many steps were skipped, inverted, or improvised? |
| Reach | Does it still work on the next task, or only this one? |
| Evidentiary basis | Which command or observation proved each score? |

Verdict is one of **keep**, **drop**, or **trial**. A trial carries a named next task and a
decision date. A drop carries the condition that would reopen it.

## Summary

| Component | Registry id | Verdict | Date | Owner |
| --- | --- | --- | --- | --- |
| | | | | |

## Entries

Append entries below in date order. A component evaluated more than once gets one entry with
revisions inside it, never a second entry for the same component.

### Entry template

```
Component:      <display name>
Registry id:    <id as the catalog spells it>
Evaluated at:   <commit, tag, or version the evaluation saw>
Rubric version: <the version in force above>
Attempted by:   <person or session>

Task
  <the real task it was tried on, specific enough to repeat>

Scores
  Fit          <0-4>  evidence: <command run, or observation made>
  Cost         <0-4>  evidence: <tokens, wall time, tool calls>
  Friction     <0-4>  evidence: <which steps were skipped or improvised>
  Reach        <0-4>  evidence: <what generalises beyond this task>
  Basis        <0-4>  evidence: <what proves the four scores above>

Verdict:        keep | drop | trial
If keep:        <what the component now owns>
If drop:        <the condition that would reopen this verdict>
If trial:       <named next task> by <decision date>

Revisions
  <date> — <what changed in the assessment, and what new evidence caused it>
```

## Worked entry

```
Component:      Pre-Mortem
Registry id:    pre-mortem
Evaluated at:   v0.9.0
Rubric version: 1
Attempted by:   migration-planning session

Task
  Plan the reversible part of a public API migration before any edit landed.

Scores
  Fit          3  evidence: three causes named, two converted into red-first guards
  Cost         4  evidence: one sitting, no tool calls
  Friction     2  evidence: the guard-conversion step had to be improvised for schema work
  Reach        3  evidence: reused unchanged on the storage migration, not on UI work
  Basis        3  evidence: guard for cause 2 watched fail when reintroduced

Verdict:        keep
If keep:        owns failure-cause enumeration before implementation starts

Revisions
  none
```

## Reconciliation

Before declaring this journal current, re-derive the summary table from the entries: every entry
must appear exactly once, every verdict must match its entry, and every keep and drop count must
match the table. A summary that disagrees with its entries is a broken journal.
