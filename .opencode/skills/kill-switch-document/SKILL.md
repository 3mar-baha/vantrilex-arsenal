---
name: kill-switch-document
description: Use when a change could be stopped, paused, or rolled back unsafely, so the halt steps, their authority, and their verification are written down before the work starts.
---

# Kill-Switch Document

## Purpose

Write down, before the work starts, how to halt it safely: the named steps, who has the authority
to pull each one, and how anyone can tell the halt actually happened. Interpretation of the owner
idea (وثيقة مفتاح الإيقاف): a kill switch nobody can find under pressure is not a control, it is a
reassurance. So the document is a sequence of pre-decided, named steps with a named authority for
each, and each step carries the observation that proves it took effect.

Interpretation, and why this is a skill rather than a file: the catalog kind enum is
`skill | mcp | plugin | hook | agent | formatting` and has no document kind, so a loose document
would be an unregistrable orphan. This skill **owns** the document: it creates the file from
`assets/kill-switch-template.md`, and every pull of the switch is recorded as an amendment with
its date. The skeleton is copied into the consuming project on first use.

## When to Use

- A change deploys, migrates, or publishes, and can be stopped or undone.
- A change is hard to reverse: deletes, schema changes, permission changes, money, outward-facing
  messages.
- More than one person or process can act on the system, so the person who must stop it may not
  be the person who built it.
- An on-call rotation exists, and someone who did not write the change must be able to stop it.
- An incident revealed that the halt depended on knowing which of three similar commands was the
  real one.

## Do NOT use

- During an active incident as the first move. Restoring service comes first; this document
  describes the deliberate, pre-decided stop.
- For a change with no consequence to leaving it running. Every procedure needs a halt path; a
  document nobody needs is a document nobody reads.
- As a rollback plan. Rollback restores the previous state; a halt stops further change. This
  document covers stopping, and names whether rollback is available at each step.
- As a substitute for the circuit breaker's halt. Repeated failed fixes are governed by
  `circuit-breaker-guard`, which owns that halt. This document covers the operational stop of
  deployed or outward-facing work, and must not restate that mechanism.
- To grant the authority to pull. This document names who already has it, and changing who may
  stop the system is a governance decision taken outside it.

## Inputs

- The change, and every stage at which it can be stopped: queued, in progress, partially applied,
  published, live.
- What is irreversible at each stage, named concretely rather than described as data loss.
- Who holds the authority to pull each step, by role and by name.
- The observation that proves each step took effect, readable by someone who was not on the change.
- What the system looks like when fully stopped, so "stopped" is not a matter of opinion.

### The three questions

A kill-switch document exists to answer three questions under time pressure. If any one of them
has no answer, the document is not finished:

1. **What exactly do I run?** One named command per step, no choices, no alternatives.
2. **Who am I allowed to do it?** Authority named per step, by role and by name.
3. **How do I know it worked?** One observation per step, readable without domain knowledge.

## Procedure

1. **List the stoppable stages** in order, from earliest to latest. A stage with no halt is either
   not stoppable or not yet noticed; either way it is written down explicitly.
2. **Name one command per stage.** No alternatives, no "or". Two commands mean a decision at the
   worst moment, which is the moment this document exists to prevent. Each command is written so
   it can be pasted verbatim.
3. **Attach the authority** to each step: the role that may pull it and the named person holding
   that role. A step with authority `unassigned` is not ready, and this document does not
   pretend otherwise.
4. **Write the verification** for each step: the observation that proves the halt took effect, and
   the observation that proves work did not resume afterwards. Both, because a halt that silently
   reverts is worse than no halt.
5. **Mark reversibility per stage.** For each stage, state what rollback is available and what it
   does not undo. A stage marked irreversible must name who may authorise proceeding past it.
6. **Write the fully stopped state.** One description of the system at rest, so an observer can
   distinguish stopped from idle.
7. **Rehearse once, on a non-production target.** Run every command in order and record what
   actually happened. Steps whose real output differs from the documented one are corrected here,
   before they are needed for real.
8. **Record the amendment.** Any new step, changed command, or changed authority is appended with
   its date and the reason. The document is never edited to make it match a change that already
   happened without a trail.
9. **Keep it reachable.** One path, referenced from the change record and from the on-call material.
   A kill switch behind three indirections is not found under pressure.
10. **Review when the system changes.** A new stage, credential, or deploy mechanism invalidates
    steps that were previously rehearsed, and those steps must be re-rehearsed rather than assumed.

## Outputs

- `assets/kill-switch-template.md` copied into the consuming project on first use.
- One row per stoppable stage: command, authority, verification, stop-confirmed observation, and
  reversibility.
- The description of the fully stopped state.
- The rehearsal record: date, target, and what each command actually returned.
- An amendment trail: every later addition, change, or removal with its date and reason.

## Failure Modes

- **Vague commands.** A step that says halt the pipeline, when three pipelines exist, is the
  failure this whole document is designed to catch. One command, pasted verbatim, or the step does
  not count.
- **Unassigned authority.** Every pull becomes a negotiation with whoever happens to be online.
  An unassigned step is unready, and the rehearsal must show that.
- **No verification per step.** A halt is declared from the command's silence, and silence is also
  what a typo produces.
- **Halt without a stop-confirmed check.** Work resumes while everyone believes the switch was
  pulled. Every step carries both observations.
- **Stale after the system moves.** Commands naming a retired mechanism fail under pressure. The
  rehearsal record's date is the expiry date of that confidence.
- **Edits without amendments.** A document silently corrected to match what an operator typed last
  time loses the only record of what the operator was told.
- **Confused with rollback.** Stopping is not undoing. A document that blurs the two sends an
  operator looking for a restore that does not exist.
