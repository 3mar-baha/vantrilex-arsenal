# LD-10 merge-arbitration procedure (slot 0.9.10, V3:3659-3730)

Source slot: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3659-3730`
(Arabic original; implemented here, never re-derived).
Fallback: FBLD-10
(`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:22`):
no deletion, no restructure, no split of vs-duplicate material under
this file. This procedure adds three new paths under
`.opencode/audit/BUILD-0910/` only and touches zero existing paths.

## 1. Isolation rule

Each write path gets exactly one isolated workstream. A workstream owns a
frozen list of draft paths. A write to any path outside the writer's own
list is refused as a recorded event (`refused:cross-write:<ws>-><path>`),
never applied, never silent. Two workstreams editing the "same file" each
hold a private draft; the conflict surfaces only at merge time, never as
a direct overwrite.

## 2. Arbitration ladder (decided before any merge, V3:3685)

- **Rule A — claim check.** The required capability claim is read from the
  trust level (LD-10 depends on the trust level, V3:3719). An edit whose
  writer does not hold the claim is rejected with reason
  `unclaimed-capability`. No arbitration above an undocumented claim.
- **Rule B — disjoint.** Edits on disjoint logical paths all apply; winner
  `both`, reason `disjoint-paths`.
- **Rule C — same-path conflict.** Higher trust-tier rank wins, reason
  `higher-trust-tier`. A rank tie breaks on the earlier sequence number,
  reason `earlier-sequence-tiebreak`. The coordinator records the
  decision; impression and save-order never decide.

## 3. Decision ledger

Every conflict appends one frozen entry per loser:
`{ logicalPath, winner, loser, rule, reason, loserContentPreserved }`.
The entry names the winner plus the reason (V3:3688) and keeps the loser
content verbatim, so a later dispute is re-read from the written record
(V3:3673), never re-judged from memory. Disjoint merges append a
`both` entry for the same auditability.

## 4. Disposal rule

Disposing a workstream removes it entirely. Safety is proven, not
assumed: every surviving workstream's bytes hash identical before and
after, and the disposal record carries `sideEffects: 0`. Disposal by
design cannot touch another path (V3:3670) because isolation boundaries
are real (separate ownership lists), not nominal.

## 5. Container-vs-worktree per-path decision (V3:3690, decided per path)

The platform provides no sufficient native cage for this purpose
(V3:3671), so external isolation is proven with git worktrees, and the
container question is decided per path below — documented, not left
implicit. No container image, install command, or runtime is provisioned
here (nothing of the kind is verified; per kit law no install command is
invented — there is no `install_cmd` in this commit, verified or
otherwise).

| Write path kind | Decision | Reason |
|---|---|---|
| Audit ledger paths (`BUILD-*/b*.md`, this file) | git worktree holder | Filesystem-level isolation with single-writer per branch; proven by this very node (holder `b0910-build-holder`, primary HEAD unmoved) |
| Probe scripts (`.mjs` self-tests) | git worktree holder | Deterministic stdlib-only execution needs file isolation, not process caging |
| Parallel leader drafts (future multi-leader lanes) | git worktree per leader | Same proven mechanism; one branch plus one holder per leader, merged only through §2 |
| Untrusted or intake execution (future) | container, NOT provisioned | A worktree isolates files, not processes; when a path kind needs process isolation the container decision is already recorded here, but no image is built until a later slot verifies one |

## 6. Spawn-width ceiling (V3:3691, V3:3711)

Ceilings stay conservative until the isolation-plus-arbitration proof runs
green. Enforced constants: at most one writer per write path; at most
`CONSERVATIVE_CEILING = 2` live workstreams. Spawning above the ceiling
is refused as an event (`refused:ceiling-exceeded:<id>`). Raising the
ceiling without a recorded green proof digest is refused as an event
(`refused:proof-not-green`). This node ran single-writer (one commit, one
author seat) under a ceiling of 2 with 1 active — inside the ceiling.
