---
name: pre-mortem
description: Use when a change is about to be implemented or released and its failure modes should be named before any code is written, so the cheap guards are installed first.
---

# Pre-Mortem

## Purpose

Run one round of honest failure analysis **before** the work starts. The owner idea is a single
sentence: imagine the work already failed, then enumerate why. This skill reads that as a
forward-running ceremony, not a document: the analysis happens in one sitting, produces a
short ranked list of concrete failure causes, and each surviving cause is converted into a
check that fires *during* the work. The list itself is disposable; the guards it produces are
the durable output.

Interpretation, stated plainly: the value is not in predicting the future, it is in forcing the
"already failed" frame early enough that each named cause becomes a cheap, specific preventive
test rather than a vague intention to be careful.

## When to Use

- A feature, migration, or release is scoped and about to enter implementation.
- The change touches something that was previously wrong, or that broke silently before.
- The plan is a single sentence long, which usually means it has not been failed yet.
- A reversal would be expensive: schema changes, deletes, permission changes, public interfaces.

## Do NOT use

- After the work shipped and broke. That is a post-mortem: it explains a failure that exists,
  this one guards a failure that has not happened yet.
- While a system is down or mid-incident. Stopping to speculate about a live failure costs more
  than it saves; run `circuit-breaker-guard` and restore service first.
- On mechanical work whose failure mode is already proven by an existing guard, such as a
  two-line rename covered by a passing test. Name the guard, skip the ceremony.
- As a substitute for a written specification. A list of failure causes does not say what the
  work must do.

## Inputs

- The change, stated in one sentence, and the boundary it does not cross.
- The plan or approach, if one exists; if none exists, that is itself a failure cause to record.
- The two or three existing guards that currently cover this area.
- Who reviews the change, and who owns the decision to ship it.

## Procedure

1. **State the change in one sentence.** If this takes more than a sentence, the change is not
   scoped yet; stop and scope it.
2. **Commit to the outcome.** Write the date line a future reviewer would write: `Status: failed`
   followed by the release name and the symptom they would report. Do not soften it.
3. **Narrate the failure, past tense.** For each of three to six numbered causes, write it the way
   the future reviewer would have found it: what was true, and what broke as a result. Reject any
   cause phrased as "someone was not careful" — it names no cause and produces no guard.
4. **Attach the earliest symptom.** For each cause, name the observable that appears first, not
   the final damage. Late symptoms make late guards.
5. **Choose the guard.** For each cause, write the one check that would have caught it before
   the work landed, and name the command that proves it. A cause with no cheap check is either
   not worth guarding or needs a guard built first; say which.
6. **Rank and keep.** Order by likelihood times cost of detection. Keep the top three to five.
   Delete the rest, and record what was deleted so the reasoning is not re-run from scratch.
7. **Install the guards.** Each retained cause becomes one of: a test that must be red before the
   change and green after, a guard that must fail when the cause is reintroduced, or a named
   verification step added to the phase gates.
8. **Close the round.** Restate the change sentence and list the guards now in force. This is the
   whole artifact; there is nothing to maintain afterwards.

### What this skill does not claim

The list is a hypothesis about the future, and it can be wrong. Its correctness is proven
differently: each retained cause must fail its guard when the cause is deliberately
reintroduced. A cause whose guard cannot be made to fail is not retired, it is unverified, and
it stays on the list.

## Outputs

- A dated failure list, three to six causes, each past-tense with its earliest symptom.
- One named guard per retained cause, with the exact command that proves it fires.
- The deletion note: which causes were dropped and why.
- No standing artifact. Nothing in this skill is a file that must be updated later.

## Failure Modes

- **Causes are generic** ("not enough testing"). Symptom and guard are forced onto the same line,
  so a vague cause shows up as a symptom nobody can observe.
- **The ceremony becomes a ritual** on routine work. The reversal-cost test in When to Use is the
  guard against this; a change that fails cheaply does not need a pre-mortem.
- **The list is treated as a prediction.** It is a hypothesis set. Only the guards are carried
  forward, and their value is proven by failure, never by their presence.
- **Guards are written but never broken.** A guard that has never been observed to fail is
  unproven; deliberately reintroduce one cause per guard and watch it fail before shipping.
- **Drift into a full post-mortem.** Cause, symptom, guard. Any attempt to analyse an existing
  failure belongs to a different session.
