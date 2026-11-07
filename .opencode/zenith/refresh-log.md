# Refresh Log

Periodic refresh log for the Zenith team records. Every session anchor
appends one entry; every guard run appends its task ids; the weekly T14
review writes one absorb-or-rule decision per item.

## R-001 — Seed (2026-10-28)

Register seeded from observed worktree state at base `c55bc7d`. Six fields
present. Seats A, B, and C landed with model plus variables each. Guard
skill and guard script landed; guard proven by the gate harness on a real
before and after, never a synthetic-only pair.

## R-002 — Weekly failure-absorption review (2026-10-28)

T14 written output. Items the records absorbed silently, with one decision
per item: becomes a rule, or stays absorbed.

| # | Absorbed item | Evidence | Decision |
| --- | --- | --- | --- |
| 1 | V3 slot text wins over any recalled V2 or memory slot number | Fallback FBLD-01 pattern, flagged never resolved | Stays absorbed; precedence already stated, no new rule |
| 2 | R2 9-id company-skill set carried verbatim, nothing installed | `.opencode/zenith/r2-overlap-carry.md`, fallback FBLD-02 | Becomes rule R-LEDGER-01: build nodes carry overlap verbatim and install nothing |
| 3 | Local `vs-*` skills ship without catalog rows | Precedent: zero `vs-` ids among 2889 catalog components at base | Becomes rule R-LEDGER-02: registration parked with owner, never written by build nodes |

Review rule from this week forward: no silent absorption without a dated
row in this table and a decision in the last column.

## R-003 — Guard run (2026-11-07)

Real-pair refresh-guard run for mission ARSENAL-AUDIT-EXEC-001 W5 node
`w5-repair`, by `scripts/zenith-refresh-guard.mjs` (Node 25, ESM, zero
dependencies). Before: `HEAD:.opencode/zenith/team-model-register.md`
(`264d3ff298cf4a0e95026061ef0c8cce35677413`, 78 lines). After:
`.opencode/zenith/team-model-register.md` worktree (240 lines). Both sides
are real on-disk texts, not a synthetic-only pair; the HEAD side was
materialized verbatim and the worktree side read live. Result: beforeLines
78, afterLines 240, hunks 3, tasks 3.

| Task | Kind | Before slice | After slice | Witness | Review verdict |
| --- | --- | --- | --- | --- | --- |
| T-01 | update | `before@7x6` | `after@7x8` | `- Anchor: w5-model-menu-2026-11-07` | Accepted: refreshes the `Anchor`/`Refreshed`/`Verification behind the dates` header (seed `2026-10-28`/`c55bc7d` → live `2026-11-07`/`264d3ff`); both sides non-empty so `update` is correct; hunk cited exactly. |
| T-02 | add | `before@-1x0` | `after@26x158` | `## Model-selection rule (owner ruling 5)` | Accepted: pure insertion of the 158-line Model-selection rule, Seat-season coverage, and Verified free list block; `add` correct (empty before side); witness is the first inserted line. |
| T-03 | add | `before@-1x0` | `after@188x2` | `- Owner ruling 5 (2026-11-07): models default, no pins, user picks per` | Accepted: 2-line insertion under `## 1. Live directives` recording Owner ruling 5 with the zero-hit pin-sweep enforcement note; `add` correct; witness is the first of the two lines. |

Every emitted task (T-01, T-02, T-03) was reviewed against the diff hunk it
cites: kind matches the before/after line counts, witness matches the first
line of the cited hunk, and no task is untraceable. The guard produced tasks
only; applying them is a separate dispatch and nothing is auto-applied here.

## R-004 — Guard run (2026-11-07)

Real-pair refresh-guard run for mission ARSENAL-AUDIT-EXEC-001 W5 node
`w5-review-fix`, by `scripts/zenith-refresh-guard.mjs` (Node 25, ESM, zero
dependencies). Before: `HEAD:.opencode/zenith/team-model-register.md`
(`264d3ff298cf4a0e95026061ef0c8cce35677413`, 78 lines). After:
`.opencode/zenith/team-model-register.md` worktree (240 lines). Both sides
are real on-disk texts, not a synthetic-only pair; the HEAD side was
materialized verbatim (`git show HEAD:...`) and the worktree side read live.
Result: beforeLines 78, afterLines 240, hunks 3, tasks 3.

| Task | Kind | Before slice | After slice | Witness | Review verdict |
| --- | --- | --- | --- | --- | --- |
| T-01 | update | `before@7x6` | `after@7x8` | `- Anchor: w5-model-menu-2026-11-07` | Accepted: refreshes the `Anchor`/`Refreshed`/`Verification behind the dates` header (seed `2026-10-28`/`c55bc7d` -> live `2026-11-07`/`264d3ff`); both sides non-empty so `update` is correct; witness is the first line of the after hunk, checked against `git diff` `@@ -4,12 +4,14 @@`. |
| T-02 | add | `before@-1x0` | `after@26x158` | `## Model-selection rule (owner ruling 5)` | Accepted: pure insertion of the 158-line Model-selection rule, Seat-season coverage, and Verified free list block after the Refresh rule; `add` correct (empty before side, `before@-1x0`); witness is the first inserted line. |
| T-03 | add | `before@-1x0` | `after@188x2` | `- Owner ruling 5 (2026-11-07): models default, no pins, user picks per` | Accepted: 2-line insertion under `## 1. Live directives` recording Owner ruling 5 with the zero-hit pin-sweep enforcement note; `add` correct (empty before side); witness is the first of the two lines, verified at worktree lines 188-189. |

Every emitted task (T-01, T-02, T-03) was reviewed against the diff hunk it
cites: kind matches the before/after line counts (update requires both sides
non-empty, add requires empty before side), witness matches the first line
of the cited hunk, and no task is untraceable. Re-run of the guard on the
same HEAD blob vs worktree reproduces the identical counts and task ids as
R-003, confirming determinism. The guard produced tasks only; applying them
is a separate dispatch and nothing is auto-applied here.

## R-005 — Guard run (2026-11-07)

Real-pair refresh-guard run for mission ARSENAL-AUDIT-EXEC-001 W5 node
`w5-review-fix-refresh`, by `scripts/zenith-refresh-guard.mjs` (Node 25, ESM, zero
dependencies). Before: `HEAD:.opencode/zenith/team-model-register.md`
(`264d3ff298cf4a0e95026061ef0c8cce35677413`, 78 lines). After:
`.opencode/zenith/team-model-register.md` worktree (240 lines). Both sides
are real on-disk texts, not a synthetic-only pair; the HEAD side was
materialized verbatim (`git show HEAD:...`) and the worktree side read live.
Result: beforeLines 78, afterLines 240, hunks 3, tasks 3 (T-01, T-02, T-03).

| Task | Kind | Before slice | After slice | Witness | Review verdict |
| --- | --- | --- | --- | --- | --- |
| T-01 | update | `before@7x6` | `after@7x8` | `- Anchor: w5-model-menu-2026-11-07` | Accepted: refreshes the `Anchor`/`Refreshed`/`Verification behind the dates` header (seed `2026-10-28`/`c55bc7d` -> live `2026-11-07`/`264d3ff`); both sides non-empty so `update` is correct; witness is the first line of the after hunk at worktree line 7, checked against `git diff` `@@ -4,12 +4,14 @@`. |
| T-02 | add | `before@-1x0` | `after@26x158` | `## Model-selection rule (owner ruling 5)` | Accepted: pure insertion of the 158-line Model-selection rule, Seat-season coverage, and Verified free list block after the Refresh rule; `add` correct (empty before side, `before@-1x0`); witness is the first inserted line at worktree line 26. |
| T-03 | add | `before@-1x0` | `after@188x2` | `- Owner ruling 5 (2026-11-07): models default, no pins, user picks per` | Accepted: 2-line insertion under `## 1. Live directives` recording Owner ruling 5 with the zero-hit pin-sweep enforcement note; `add` correct (empty before side); witness is the first of the two lines, verified at worktree lines 188-189. |

Every emitted task (T-01, T-02, T-03) was reviewed against the diff hunk it
cites: kind matches the before/after line counts (update requires both sides
non-empty, add requires empty before side), witness matches the first line
of the cited hunk, and no task is untraceable. `git diff` groups T-02/T-03
into one display hunk (`@@ -21,10 +23,170 @@`, 3 context lines bridging
the 4 equal lines between them), while the guard splits them by its
consecutive-non-equal rule; the guard's 3-hunk count governs. Re-run of the
guard on the same HEAD blob vs worktree reproduces the identical counts and
task ids as R-003 and R-004, confirming determinism. The guard produced
tasks only; applying them is a separate dispatch and nothing is auto-applied here.
