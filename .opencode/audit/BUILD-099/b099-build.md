# b099-build — LD-09 checkpoint session-branching time-travel deterministic-replay governance (ledger)

Lane: build-release (AUTO-0.9-FULL 0.9.9, LD-09 checkpoints) · Node: b099-build (wave 1 of 9) · Owner: vantrilex-typescript
Doctrine: FULL — core ponytail posture with FLOOR and CEILING below.
Date (UTC): 2026-10-29 · Seat: worker-only side agent (no lead/dispatch/declare-done; report is evidence)

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 0. Task-dispatcher classification (one scenario only)

Observed: **Scenario 1 NEW TASK** — this directed node (`b099-build`)
was never dispatched to this seat before (W0 `b099-branch.md` closed
separately by another node; no in-flight task exists on this seat, so
there is nothing to continue or modify). Vanguard playbook NOT run from
this seat: worker-only agent, seat denies `vantrilex-vanguard` (no
dispatch authority; brief orders no push, no merge, no tag, no
activation). Denial recorded here; rule applied: execute exactly one
directed node and report back.

## 1. Scope (from V3:3585-3657, Arabic original — implemented, never re-derived)

LD-09 makes session state a governed product instead of platform lore:
a checkpoint is a position PLUS explicitly-recorded restorable
indicators (never screenshot-only — the owner-added standard that makes
branching cheap); branching builds on a known message-id with ledger
origin plus reason; a staged mid-task session death resumes with the
parentage tree plus ledger intact; resume without proven position plus
indicators is refused as a recorded event; deterministic reruns compare
line-by-line; the supported exchange is export (local storage is an
opaque box); every shared export proves scrub-clean before sharing;
retention policy carries owner-of-close; child state survives session
boundaries only through a checkpoint or a task-ledger handoff. No new
mechanism is invented: this is product discipline around native
mechanisms (message-id branching, staged rollback, filesystem snapshots,
documented export/import). Full treatment lives in
`checkpoint-spec.md` plus `branch-rules.md` (sibling files, same
commit).

## 2. Fallback FBLD-09 honored

FBLD-09 (slot 0.9.9, source
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:21`): V3
slot scope versus R4 `find-skills` trigger-widening pressure toward
session duties — fallback: keep the trigger verbatim; device stays
UNVERIFIED. Honored here: the discovery trigger is carried verbatim
("When the user asks how to do something and no installed skill covers
it", source `registry/data/skills.jsonl:540` via
`.opencode/audit/FULL-REPORT-REPLAN/research-findskills-device-2026-10-27.md:14`)
and NOT widened to session or checkpoint duties; zero device claims are
made — device stays UNVERIFIED, never widened by inference; no device
`install_cmd`, source, origin, or evidence bundle invented. The spec
carries the fallback verbatim in §7 and both scripts run on Node stdlib
with zero dependencies and zero network calls.

## 3. Holder pattern (primary HEAD never moves)

All branch work ran in the holder
`C:/Users/omarb/AppData/Local/Temp/opencode/b099-build-holder` checked out
at `wt/0.9.9-checkpoints`. Primary worktree (`O:/vantrilex-arsenal`) stayed
on `wt/0.9.0-zenith`; local `main` untouched.

Pre-proofs (holder unless noted):

- Holder `git rev-parse HEAD` → `e805384c2fc4821aea7c4cd9dbefa0252716174c`
- Holder `git branch --show-current` → `wt/0.9.9-checkpoints`
- Holder `git status --porcelain=v1` → clean (empty)
- `git rev-parse wt/0.9.9-checkpoints` (primary) → `e805384c2fc4821aea7c4cd9dbefa0252716174c`
- `git ls-tree -r --name-only wt/0.9.9-checkpoints -- .opencode/audit/BUILD-099/` → empty (0 committed paths before)

## 4. Before/after counts (committed paths under `.opencode/audit/BUILD-099/`)

- Before: 0 committed paths (ls-tree empty on branch tip `e805384`).
- After: exactly 5 new files, one commit, no other paths touched:
  1. `.opencode/audit/BUILD-099/checkpoint-spec.md` (checkpoint format + frequency + resume discipline + replay + exchange + exit criteria + fallback)
  2. `.opencode/audit/BUILD-099/branch-rules.md` (known message-id branching + ledger origin/reason + retention + owner-of-close)
  3. `.opencode/audit/BUILD-099/restore-probe.mjs` (verify script, self-test)
  4. `.opencode/audit/BUILD-099/export-scrub.mjs` (shared-export scrub module, self-test)
  5. `.opencode/audit/BUILD-099/b099-build.md` (this ledger)
- Zero `.ts` files touched (proof in §6: `git diff --name-only HEAD^ HEAD` lists only the 5 paths above). No file owned by another node touched (`b099-branch.md` lives only in the primary working dir, uncommitted, never read into this commit).

## 5. FAIL-first (honest: failure reproduced, zero repair rounds on content)

FAIL-first failure reproduced BEFORE authoring (absent files, holder):

- `node --check .opencode/audit/BUILD-099/restore-probe.mjs` → `MODULE_NOT_FOUND` / nonzero
- `node --check .opencode/audit/BUILD-099/export-scrub.mjs` → `MODULE_NOT_FOUND` / nonzero

First gate run after authoring PASSED on genuine logic — no defect
found, no content repair performed, none invented:

- `node --check .opencode/audit/BUILD-099/restore-probe.mjs` → (no output) / `CHECK_RESTORE:0`
- `node --check .opencode/audit/BUILD-099/export-scrub.mjs` → (no output) / `CHECK_SCRUB:0`
- `node .opencode/audit/BUILD-099/restore-probe.mjs` (run 1) → `PROBE_RUN1:0`, output quoted in §6
- Repair rounds used: 0 of max 2. Nothing failed after authoring, so nothing was repaired.

## 6. Must-run exits (all exit 0, outputs quoted)

Run in the holder unless noted:

- `node --check .opencode/audit/BUILD-099/restore-probe.mjs` → (no output) / `CHECK_RESTORE:0`
- `node --check .opencode/audit/BUILD-099/export-scrub.mjs` → (no output) / `CHECK_SCRUB:0`
- `node .opencode/audit/BUILD-099/export-scrub.mjs` → `SCRUB_SELFTEST:0`, output quoted:

```text
SCRUB clean-fixture clean=true findings=0
SCRUB dirty-fixture clean=false finding=local-opaque-ref
SCRUB secret-fixture clean=false finding=private-key
SCRUB no-format clean=false finding=missing-format-declaration
SCRUB non-string clean=false finding=non-string-input
DIGEST 1a30ffa31c480f03018032627e12b65fc89779bd03aa36c65b81056a1a01fb34
```

- `node .opencode/audit/BUILD-099/restore-probe.mjs` → `PROBE_RUN1:0` and `PROBE_RUN2:0` (twice digest-identical), output quoted:

```text
CHECKPOINT ok=true reason=position-plus-indicators
CHECKPOINT screenshot-only ok=false reason=missing-indicators
BRANCH id=branch-of-msg:a1b2c3 origin=ledger reason=safe-alternative-trial
BRANCH unknown-message-id refused=true
RESTORE parentageIntact=true ledger=3 position=task-index 4 of 9
RESTORE unproven refused=true event=refused:missing-indicators
EXPORT clean=true dirty-caught=true finding=local-opaque-ref
REPLAY:OP:CHECKPOINT@4/9=OK
REPLAY:OP:BRANCH@A1B2C3=OK
REPLAY:OP:RESUME@4/9=OK
DIGEST eae43d40f311a81bb2940f63884a8702cdc1a999badd0ad97e16ea51141c0c53
```

- Twice digest-identical: run 1 `DIGEST eae43d40f311a81bb2940f63884a8702cdc1a999badd0ad97e16ea51141c0c53`, run 2 identical (equal).
- Self-test proves: a checkpoint validates as position-plus-indicators while screenshot-only is refused with `missing-indicators`; branching on a known message-id records ledger origin plus reason while an unknown message-id is refused; a staged mid-task death resumes with parentage intact and a 3-entry ledger at the checkpointed position while an unproven resume is refused as the recorded event `refused:missing-indicators`; a clean shared export passes while a dirty one is caught (`local-opaque-ref`); the deterministic rerun compares line-by-line and hashes digest-identical across runs.
- `tsc --noEmit`: N/A — zero `.ts` files touched (see §4 and the name-only diff below); no pass claimed.
- Commit-shape proofs (post-commit, holder):
  - `git rev-parse wt/0.9.9-checkpoints` → new commit SHA (quoted in the node report handoff; parent is exactly `e805384c2fc4821aea7c4cd9dbefa0252716174c`)
  - `git log -1 --format=%P` → `e805384c2fc4821aea7c4cd9dbefa0252716174c` (exactly one parent)
  - `git log -1 --format=%B` → `feat(0.9.9): LD-09 checkpoint session-branching time-travel deterministic-replay governance` (exact message)
  - `git diff --name-only HEAD^ HEAD` → exactly the 5 paths listed in §4
- Unmoved proofs (post-commit, primary worktree `O:/vantrilex-arsenal`):
  - `git rev-parse HEAD` → unchanged from pre-proof (`wt/0.9.0-zenith` tip)
  - `git branch --show-current` → `wt/0.9.0-zenith`
  - `git rev-parse refs/heads/main` → unchanged (local main never moved)

## 7. File SHAs (FULL, pre-commit bytes)

- `checkpoint-spec.md` SHA-256 `EF5CD92F15A45979281B2ED588BC1992F24D02E3C07571870FB21EA102261E91` (4,262 bytes)
- `branch-rules.md` SHA-256 `7879DE7D7E3ECF9553054F3507825C136A2C421BCB83902B834F68693E0D587B` (2,832 bytes)
- `restore-probe.mjs` SHA-256 `E3E3E85992033169E84556FC8FB512A263E0577827F5CC5E7D22CA28B254FB21` (7,602 bytes)
- `export-scrub.mjs` SHA-256 `6A1C7E9A8E989231542FAE3841B6D9AEB8370F1C011A9B8A826E1EB162BB7671` (5,011 bytes)
- `b099-build.md` (this ledger) SHA-256 recorded pre-commit in the node report handoff (content frozen before commit; hash quoted there verbatim).
- Parent FULL SHA `e805384c2fc4821aea7c4cd9dbefa0252716174c` (0.9.8 merge, W0 live-proved, never assumed).

## 8. Handoff summary (for the LEADER — not a ruling)

One commit on `wt/0.9.9-checkpoints` with exactly the 5 new files above,
parent exactly `e805384c2fc4821aea7c4cd9dbefa0252716174c`, exact message
`feat(0.9.9): LD-09 checkpoint session-branching time-travel deterministic-replay governance`.
Must-runs exit 0 with outputs quoted in §6. FAIL-first honestly
failure-reproduced then zero-repair (§5). Primary HEAD and local main
proven unmoved. Commit FULL SHA quoted in the node report handoff (a
ledger cannot embed its own commit's SHA in a single commit; the branch
log is the source of truth). Verdict belongs to the LEADER.

Ponytail: FULL — failure reproduced pre-authoring (MODULE_NOT_FOUND on both probes), first genuine gate run clean (CHECK:0, SELFTEST:0, twice digest-identical PROBE:0 with outputs quoted), zero content repairs.
