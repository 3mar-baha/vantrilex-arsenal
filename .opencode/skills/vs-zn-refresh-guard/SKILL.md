---
name: vs-zn-refresh-guard
description: Use when the periodic refresh log needs guarding — turns a real document diff into written update tasks through the line-diff procedure, so silent drift becomes assigned work instead of an unnoticed failure.
---

# Zenith Refresh Guard

## Purpose

Keep the team records honest between sessions. The guard watches the
periodic refresh log and the team-model register, takes a real before and
after of a changed document, and produces the update tasks the change
requires. Drift that nobody names accumulates silently until it breaks the
records; the guard names it as work.

## When to Use

- After any real documentary change to the register, the constitution
  material, a seat, or the refresh log itself.
- At the weekly cadence, to convert the failure-absorption review into
  update tasks.
- Whenever a session anchor carries a register whose fields disagree with
  the records on disk.

## Do NOT use

- As a synthetic demo. A diff both of whose sides were typed for the demo
  proves nothing; the guard requires a real before and after, and marks a
  synthetic-only run unverified with its blocker.
- As an auto-applier. The guard produces tasks; applying them is a second
  dispatch under its own authority.
- As a replacement for the team-control book. The guard serves the
  register; direction stays with Zenith under `vs-zn-team-control`.
- To resolve flagged conflicts. Carried conflicts stay flagged; the guard
  cites them, never reconciles them.

## Inputs

- A real before text and a real after text of one changed document, with
  the source label of each side.
- The refresh log at `.opencode/zenith/refresh-log.md` as the task sink.
- The executable procedure at `scripts/zenith-refresh-guard.mjs`, run for
  real, never trusted in prose.

## Procedure

Work the six parts in order. Steps 2 through 4 execute the script; reading
about the script is never a substitute for running it.

1. **Identity, including non-duties.** The guard is the honesty keeper of
   the records: it diffs, it tasks, it logs. Non-duties, stated
   explicitly: the guard does not apply the tasks it produces, does not
   invent a change where the diff is empty, does not run on synthetic-only
   pairs, and does not touch the catalog, the lock, or any registry file.

2. **Instruction pack.** Collect the real before and after. Run the guard
   script with both sides labelled. Review every emitted task against the
   diff hunk it cites. Append the run to the refresh log with the task
   ids. At guidance altitude per control T13: the pack states how to judge
   a task, never a per-line script for judging it.

3. **Equipment policy.** One tool: `scripts/zenith-refresh-guard.mjs`, run
   with the machine Node against real files. No install command ships with
   this skill; the script carries zero dependencies beyond the standard
   library. A guard binary that cannot report its own behavior on the real
   pair is not a guard the records can rely on.

4. **Context contract.** Reads: the before text, the after text, and the
   current refresh log. Writes: the new update tasks into the refresh log
   run entry. Reads the task list back after writing and confirms every
   task cites its hunk.

5. **Verification commitments.** Every run quotes the line counts on both
   sides, the hunk count, and the task count. An empty diff yields zero
   tasks and a logged no-op, never padded work. The weekly T14 review
   consumes guard output: each absorbed item under review maps to the
   hunks that evidence it, and the absorb-or-rule decision is written
   beside the task id.

6. **Failure contract.** No real after: stop and mark the run unverified
   with the exact blocker. Script failure: record the exit code and the
   failing command verbatim, produce no tasks, and escalate. Task without
   a cited hunk: rejected before logging, because untraceable work cannot
   be verified later.

## Outputs

- Numbered update tasks, each citing its diff hunk and source label.
- A refresh-log run entry with before and after labels, hunk count, task
  count, and task ids.
- A no-op record when the diff is genuinely empty.

## Failure Modes

- Synthetic-only pair: no tasks, run marked unverified with its blocker.
- Missing before or after file: stop before diffing; a half-read change
  is how records become confidently wrong.
- Empty diff presented as work: logged as a no-op, never inflated.
- Untraceable task: rejected at the gate, never logged.
