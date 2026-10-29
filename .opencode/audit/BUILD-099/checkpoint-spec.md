# LD-09 checkpoint specification — session-branching time-travel deterministic-replay governance

Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3585-3657` (Arabic
original — carried, never re-derived). Slot 0.9.9. This file defines the
checkpoint format and the restore discipline. Branching rules live in
`branch-rules.md`; mechanical proofs live in `restore-probe.mjs` plus
`export-scrub.mjs` (same commit).

## 1. Definition

A checkpoint is a **position PLUS explicitly-recorded restorable
indicators**:

```text
checkpoint := position + indicators
```

- **Position**: where the work stopped (task index, phase exit, message
  reference). A position alone is an address, not a checkpoint.
- **Indicators**: the restorable state recorded explicitly at checkpoint
  time (trust tier, active grant, owner, ledger tip). Indicators recorded
  implicitly or reconstructed from memory do not count.
- **Never screenshot-only**: a frozen view with no restorable indicators
  is not a checkpoint and MUST be refused as one. The probe proves this
  refusal (`CHECKPOINT screenshot-only ... reason=missing-indicators`).

This is the owner-added standard (V3:3595): it is what makes branching
cheap instead of a heavy copy of everything.

## 2. Checkpoint frequency by task category

Frequency is documented BEFORE execution, never after:

| Category | Frequency |
|---|---|
| Short task (single phase) | One checkpoint at close. |
| Standard task (multi-phase) | One checkpoint at every phase exit. |
| Long-running task (background, scheduled) | Phase exits PLUS a periodic checkpoint at the interval stated in the task brief. |

A long-running task with no stated interval is malformed: the interval is
set before the task starts, not discovered during it.

## 3. Resume discipline

- A mid-task session death is an ordinary event, never a loss of work or
  responsibility: resume happens from the checkpoint, with the parentage
  tree plus ledger intact (staged-death proof in `restore-probe.mjs`).
- Resume WITHOUT a proven position plus indicators is **refused as an
  event**: the refusal is recorded (`refused:missing-indicators`), never
  silent. The probe proves the recorded refusal.
- No agent works ownerless across any session boundary: child state
  survives the boundary ONLY through a checkpoint or a handoff to the task
  ledger (doctrine of parentage, V3:3600, V3:3639).

## 4. Deterministic replay

- A deterministic rerun replays the SAME inputs and compares the result
  with the original LINE BY LINE. Equality is textual, not approximate.
- The probe's rerun section emits the replay lines and hashes them; two
  runs MUST be digest-identical, otherwise replay is not deterministic.

## 5. Exchange format

- The supported exchange is **export** in the declared format
  (`vantrilex-export/1`). Every shared export MUST carry the format
  declaration.
- **Local storage is an opaque box**: it is never a supported exchange
  path. An export that references the opaque box is unscrubbed.
- Every shared export is scrubbed BEFORE sharing and MUST prove clean:
  zero secret material, zero opaque-box references. The scrub proof lives
  in `export-scrub.mjs` and is consumed by `restore-probe.mjs`.

## 6. Exit criteria (slot 0.9.9)

1. A mid-task session death resumes from a checkpoint with a sound,
   ledger-recorded parentage tree.
2. A shared export proves in practice that it is free of any unscrubbed
   content before sharing.

## 7. Fallback FBLD-09 honored

FBLD-09 (slot 0.9.9, source
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:21`): V3
slot scope versus R4 `find-skills` trigger-widening pressure toward
session duties — fallback: keep the trigger verbatim; device stays
UNVERIFIED. Honored here:

- The discovery trigger is carried verbatim: "When the user asks how to
  do something and no installed skill covers it" (source
  `registry/data/skills.jsonl:540` via
  `.opencode/audit/FULL-REPORT-REPLAN/research-findskills-device-2026-10-27.md:14`).
  This build does NOT widen it to session or checkpoint duties.
- Device scope: this build makes zero device claims. Device stays
  UNVERIFIED, never widened by inference. No device `install_cmd`,
  source, origin, or evidence bundle is invented here.
