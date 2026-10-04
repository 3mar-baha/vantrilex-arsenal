# Worktrees

One concern per worktree. Implementers work in isolated worktrees so parallel
subagents never trample each other's files; merges return through reviewed,
signed-off integrations. The contract is section 6.3 of the kit spec and
section B.7 of the skills spec. The scripts that implement it are
`scripts/dispatch-worktrees.sh`, `scripts/merge-worktrees.sh`,
`scripts/orchestrate-stage.sh`, and `scripts/teardown-stage.sh`.

## Naming: one concern per worktree, one branch per concern

Branch name: `wt/<concern-slug>`, where the slug is kebab-case (for example,
`wt/registry-phase-backfill`). A worktree carries exactly one concern on
exactly one such branch. This is repository law from [AGENTS.md](../AGENTS.md),
restated in [13-CONTRIBUTING-WORKFLOW.md](13-CONTRIBUTING-WORKFLOW.md): one
concern per branch, never two branches writing one sidecar, never
force-pushes, never rewritten published history, never direct commits to
`main`.

## The dispatch and merge scripts

Provision a worktree for one concern, injecting that lifecycle phase's kit:

```bash
./scripts/dispatch-worktrees.sh <CONCERN_SLUG> [PHASE]
```

`CONCERN_SLUG` defaults to the checkpoint's `Concern` field and `PHASE` to
its `Phase` field; the valid phases are `scout`, `docs`, `plan`, `build`,
`review`, and `operate`. Dispatch reads the checkpoint's labeled state lines
(`Status`, `Phase`, `Concern`) and refuses to run when the status is BLOCKED
(the circuit breaker owns the session), when the slug is unsafe or already
dispatched, or when the index has staged changes — uncommitted state must
never cross a worktree boundary.

Merges return through `scripts/merge-worktrees.sh`: reviewed, signed-off
integrations back to the main line, one concern at a time. Stage setup and
teardown (kit injection per phase, worktree removal) run through
`scripts/orchestrate-stage.sh` and `scripts/teardown-stage.sh`.

## Reviewed, signed-off merges

A worktree's work lands only as a reviewed integration with sign-off. The
review lane is the two-axis review (standards against spec) from
[05-DOCTRINE.md](05-DOCTRINE.md); the merge itself is sequential per concern
even when the work ran in parallel. Parallel fan-out applies to independent
graph nodes; the merge order is a chain, not a fan.

## Shared-resource single-writer

Anything two worktrees could both touch has exactly one writer at a time.
The registry sidecars are the sharpest instance: each
`registry/data/*.jsonl` file has one owning branch, so two concerns never
enrich the same kind concurrently — parallelize across kinds, sequence within
one. The same rule covers the checkpoint file, the decision log, and the
changelog: concurrent editors serialize through review, they do not interleave
writes.
