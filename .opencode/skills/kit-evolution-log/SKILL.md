---
name: kit-evolution-log
description: Use when a kit component is added, changed, retired, or re-scoped, so the reason for the change is appended to the evolution log and never rewritten.
---

# Kit Evolution Log

## Purpose

Keep one append-only record of how the kit itself changed and why. Interpretation of the owner
idea (سجل تطور العتاد): the log records decisions, not diffs. Git already holds what changed; the
log holds the reasoning that git cannot — why a component was added rather than the one that
looked equivalent, why a boundary moved, what was tried and rejected.

Interpretation, and why this is a skill rather than a file: the catalog kind enum is
`skill | mcp | plugin | hook | agent | formatting` and has no document kind, so a loose document
would be an unregistrable orphan. This skill **owns** the log: it creates the file from
`assets/evolution-log-template.md`, appends one entry per change in a fixed entry shape, and
refuses a kit change whose reason is not recorded. The skeleton is copied into the consuming
project on first use.

## When to Use

- A component is added to the kit, or proposed for addition.
- A component's procedure, boundary, or trigger changes.
- A component is retired, renamed, or re-scoped to a different phase.
- A rule that governed the kit changes, including a rule that stops applying.
- A conflict between two components is resolved by deciding which one owns what.

## Do NOT use

- As a substitute for the project changelog. This covers the kit only; the changelog covers the
  software the kit serves.
- As a place to describe what a component does. That is the component's own file. The log says
  what changed and why, and points at the component.
- To record routine edits. A typo fix or a rewording is not kit evolution.
- To capture history retroactively from git commits. A log written after the fact is a
  reconstruction, and it must be labelled as one.
- As approval. Recording that a change happened is not the same as agreeing it was right; the
  owning reviewer rules on the change itself.

## Inputs

- The change: component id, what it does now that it did not before.
- The problem that motivated it, stated as the failure or gap it removes.
- The alternatives considered, and the specific reason each was rejected.
- The evidence that justified the decision, and the condition that would reopen it.
- The date, and the person or session that owns the decision.

### Entry kinds

Four kinds, and every entry is exactly one:

| Kind | Used when |
| --- | --- |
| Added | A component enters the kit. |
| Changed | An existing component's boundary, procedure, or trigger moves. |
| Retired | A component leaves the kit, with the evidence that it was not earning its place. |
| Rule | A rule governing the kit itself changes, including a rule that stops applying. |

## Procedure

1. **Open the log** at `assets/evolution-log-template.md` in the consuming project. On first use,
   copy the template and fill the header: project, log owner, opened date.
2. **Classify the entry** as exactly one of Added, Changed, Retired, or Rule. An entry that fits
   two kinds is two entries; one entry that fits none is not kit evolution.
3. **Write the problem before the change.** The gap or failure that motivated this, stated so a
   reader in a year can recognise it even after the context is gone.
4. **Name the alternatives** and the specific reason each lost. "The other option was worse" is
   not a reason; name the property that made it worse.
5. **Point, do not copy.** Reference the component id and its path. The log never restates a
   component's contents, so a later correction to the component does not need a matching log edit.
6. **Record the evidence** and the reopen condition: what would prove this decision wrong, and who
   would notice.
7. **Append, never rewrite.** A superseded decision gets a later entry that cites the earlier one.
   Editing history turns the log into a narrative of what the author now believes.
8. **Mark reconstructions as reconstructions.** An entry written after the fact carries
   `Recorded from history:` and states what evidence was available. Never dress a guess as a
   contemporaneous reason.
9. **Reconcile before declaring currency.** Every entry must have a kind, a date, a component id,
   and a reopen condition; the index table must agree with the entries below it.

## Outputs

- `assets/evolution-log-template.md` copied into the consuming project on first use.
- One appended entry per kit change: kind, problem, change, alternatives rejected, evidence,
  reopen condition.
- A maintained index of components with their latest kind and date.
- Reconstruction markers on any entry not written contemporaneously.

## Failure Modes

- **The log records diffs instead of reasoning.** Restating what changed duplicates git and loses
  the only thing worth keeping. The problem and the rejected alternatives are the content.
- **History rewritten.** A flattering edit to a retired entry destroys the record of why the
  mistake was made, which is the part a future maintainer needs.
- **Retired components vanish quietly.** A retirement without evidence reads as a deletion and
  gets undone by the next person who does not know why it left.
- **Retroactive reasons presented as contemporaneous.** A guess written six weeks later reads with
  the authority of a decision that was actually made. Mark reconstructions.
- **Missing alternatives.** One option recorded implies there was only one option, and the next
  person redoes the whole evaluation.
- **The log grows and stops being read.** Entries that name no component id or no reopen condition
  are ungreppable and ignored. A log nobody reads is a log nobody maintains.
