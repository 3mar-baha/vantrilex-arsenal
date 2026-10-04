---
description: Run the session-context primer and print only the CONTEXT ANCHOR block, with unread slots marked unknown, and nothing else.
---

# Prime the Session

Load the prior context for this session and emit it as a single block.

Operator intent for this run:

$ARGUMENTS

If that is empty, prime from the repository root. If it names a file, directory,
branch, or session, use it as the source for the corresponding anchor slot.

## Output contract — read this twice

Your entire reply is the anchor block and nothing else.

- The first line is exactly `CONTEXT ANCHOR`.
- Then exactly seven field lines, in this order, each `Label: value`:
  `Mission`, `Phase`, `Branch`, `Worktrees`, `Next`, `Guards`, `Circuit`.
- Then one `Read budget:` line.
- Then, only if the long-running process guard recorded one, one
  `Last guard log:` line.

No preamble. No "here is the anchor". No follow-up questions. No summary of what
you read. No code fence around the block. If the block is the only thing you
print, you are correct.

## Read budget — approximately ten seconds

An approximate anchor now beats a perfect anchor late. Enforce a hard budget of
about ten seconds of wall clock across every read below.

Before each read, ask whether its estimated cost still fits in the remaining
budget. If it does not, **do not start it**. Mark that slot `unknown`, record
the slot name in the `Read budget:` line, and move on. Never exceed the budget
to fill a slot.

Work through these slots in this order and stop the moment the budget is gone:

1. `docs/25-AI-CONSTITUTION.md` — Mission, and any stated laws or phase.
2. `docs/00-PROJECT-SUMMARY.md` — Mission, Phase, Next.
3. The persisted session state — Next, Circuit, carried-forward intent.
4. `git rev-parse --abbrev-ref HEAD`, `git worktree list --porcelain`,
   `git status --short`.

Everything is optional. A missing file is `unknown`, not an error. Never create
a missing document to fill a slot. **Never write to disk in this command.**

## Slot definitions

**Mission** — the one-sentence purpose of the work. Prefer an explicit
`Mission:` label, then the constitution's opening statement, then the first
prose line of the project summary. Trim to a single sentence.

**Phase** — where the work sits in the lifecycle. Prefer an explicit `Phase:`
label in the summary or constitution, then the phase recorded in the persisted
state. Legal values are `scout`, `docs`, `plan`, `build`, `review`, `operate`.

**Branch** — the current branch from git. Include `detached` when
`rev-parse --abbrev-ref HEAD` reports `HEAD`.

**Worktrees** — every path from `git worktree list --porcelain`, plus the dirty
count from `git status --short` on the current worktree. If git is not
executable, report `unknown`.

**Next** — the single next action. Prefer an explicit `Next:` label, then the
`## Next` section of the summary, then the last intent carried in the persisted
state.

**Guards** — the Tier-0 guards that are live right now, and the state of the two
conditional ones. Always list `session-start`, `pre-compact`, `session-end`,
`long-running-process-guard`, and `docs-discipline-guard`. Then report
`typescript-check(on)` or `typescript-check(skipped)` based on whether a
`tsconfig.json` and a resolvable local `tsc` both exist, and the same for
`prettier-format` against a Prettier configuration or dependency. A conditional
guard that cannot run is `skipped`, never `on`.

**Circuit** — the breaker state. `closed` when no consecutive guard failure is
recorded. `open (N consecutive guard failures)` when there are. Read `N` from the
persisted state; with no state on disk, report `closed (no state on disk)`.

## After the block

Stop. Do not offer next steps, do not ask what to work on, and do not begin any
task, even if the anchor makes one obvious. Priming is a read-only operation and
this reply is its whole output.
