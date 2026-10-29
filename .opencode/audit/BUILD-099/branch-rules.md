# LD-09 branch rules — session branching on known message-ids

Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3585-3657` (Arabic
original — carried, never re-derived). Slot 0.9.9. Companion to
`checkpoint-spec.md` (same commit). Branching here is governance around
the native message-id branching mechanism, never a newly invented
mechanism.

## 1. Branch creation

- A branch builds on a KNOWN message-id already present in the task
  ledger. An unknown message-id is refused (probe: `BRANCH
  unknown-message-id refused=true`).
- The new branch is recorded in the task ledger with three fields, all
  mandatory:
  1. **origin**: always `ledger` (where the parent message-id was found);
  2. **reason**: why the alternative trial exists;
  3. **branch-id**: derived from the parent message-id
     (`branch-of-<message-id>`).
- An alternative trial MUST grow on its own branch. It MUST NOT disturb
  the original line until an explicit decision resolves its fate.

## 2. Time travel (read-only inspection)

- Time travel is inspection of a prior state plus comparison with the
  current state, never a silent merge of the two.
- Inspecting a prior state MUST NOT rebind the current position or the
  current indicators. The current checkpoint stays authoritative until a
  resume or an explicit branch decision replaces it.

## 3. Retention policy

- No branch accumulates without an owner and a close decision. Every open
  branch names its owner at creation.
- Retention windows, counted from the last checkpoint that references the
  branch:
  - Trial branch (alternative experiment): closes at the decision that
    resolves it — merge the decision, then close. Maximum 7 days without
    a referencing checkpoint.
  - Resume branch (post-death continuation): closes when the resumed task
    closes. It inherits the task's lifetime, never longer.
- A branch with no referencing checkpoint past its window is orphaned. An
  orphaned branch is closed by its owner, recorded in the ledger. If the
  owner is gone, the task owner closes it. No branch lives ownerless.

## 4. Owner of close

- The branch owner owns the close decision: merge-back, abandon, or
  keep-as-record. The decision is recorded in the task ledger with the
  branch-id and the reason.
- Abandoning a branch NEVER deletes its ledger record. The record (origin
  plus reason plus decision) is the audit trail that the trial happened.

## 5. Open questions from V3 (answered here as policy)

- Checkpoint frequency per task category: answered in
  `checkpoint-spec.md` §2 (close-only / phase-exit / phase-exit plus
  stated interval).
- Branch retention policy: §3 above.
- When a branch closes finally and who owns the close: §3 plus §4 — at
  the resolving decision or at window expiry, owned by the branch owner
  (task owner as fallback).
