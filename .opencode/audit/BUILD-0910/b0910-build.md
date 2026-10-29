# b0910-build — LD-10 workstream isolation plus merge arbitration with decision ledger

Lane: build-release (AUTO-0.9-FULL 0.9.10, tenth of 33) · Node: b0910-build (wave W1, 2 of 10) · Owner: vantrilex-typescript
Doctrine: FULL — core ponytail posture with FLOOR and CEILING below.
Date (UTC): 2026-10-29 · Seat: worker-only side agent (no lead/dispatch/declare-done; report is evidence)

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 0. Task-dispatcher classification (one scenario only)

Observed: **Scenario 1 NEW TASK** — this directed node (`b0910-build`)
was never dispatched to this seat before (W0 `b0910-branch.md` closed
separately by another node; no in-flight task exists on this seat, so
there is nothing to continue or modify). Vanguard playbook NOT run from
this seat: worker-only side agent, seat denies `vantrilex-vanguard` (no
dispatch authority; brief orders no push, no merge, no tag, no publish).
Denial recorded here; rule applied: execute exactly one directed node and
report back.

## 1. Scope (from V3:3659-3730, Arabic original — implemented, never re-derived)

LD-10 makes parallel leaders safe writers instead of conflict
generators: one isolated workstream per write path with no direct
cross-writes; a merge-arbitration procedure written before any merge,
with a decision ledger naming winner plus reason per conflict; a real
conflicting-edit scenario proving the result is an arbitration record,
never a silent overwrite; full workstream disposal proven with zero side
effects on other paths; a container-vs-worktree decision documented per
path (the platform provides no sufficient native cage, V3:3671); and
spawn-width ceilings kept conservative until the proof runs green. Full
treatment lives in `merge-arbitration.md` plus `workstream-probe.mjs`
(sibling files, same commit).

## 2. Fallback FBLD-10 honored

FBLD-10 (slot 0.9.10, source
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:22`): V3
slot scope versus R4 vs-duplicate triple ordering and ownership
(unstated) — fallback: no deletion, no restructure, no split under this
file. Honored here: the commit adds exactly 3 new paths under
`.opencode/audit/BUILD-0910/` and touches zero existing paths — no
vs-duplicate material deleted, restructured, or split (name-only diff in
§6 lists only the 3 new paths; no `vs-*` skill path appears in it). No
device claims are made and no `install_cmd` is invented — none is
present in this commit, verified or otherwise. The container row in the
per-path table (§5 of `merge-arbitration.md`) is a documented decision
for a future slot, never a provisioned runtime.

## 3. Holder pattern (primary HEAD never moves)

All branch work ran in the holder
`C:/Users/omarb/AppData/Local/Temp/opencode/b0910-build-holder` checked out
at `wt/0.9.10-workstream-isolation`. Primary worktree (`O:/vantrilex-arsenal`) stayed
on `wt/0.9.0-zenith`; local `main` untouched.

Pre-proofs (holder unless noted):

- Holder `git rev-parse HEAD` → `4d2f204b9ffc015c31b8282ec6f20c5fbf611454`
- Holder `git branch --show-current` → `wt/0.9.10-workstream-isolation`
- Holder `git status --porcelain=v1` → clean (empty)
- `git rev-parse wt/0.9.10-workstream-isolation` (primary) → `4d2f204b9ffc015c31b8282ec6f20c5fbf611454`
- `git ls-tree -r --name-only wt/0.9.10-workstream-isolation -- .opencode/audit/BUILD-0910/` → empty (0 committed paths before)
- `tsc` lookup (`Get-Command tsc`) → absent from PATH (supports the §6 N/A; the binding proof is the zero-`.ts` name-only diff)

## 4. Before/after counts (committed paths under `.opencode/audit/BUILD-0910/`)

- Before: 0 committed paths (ls-tree empty on branch tip `4d2f204b9ffc015c31b8282ec6f20c5fbf611454`).
- After: exactly 3 new files, one commit, no other paths touched:
  1. `.opencode/audit/BUILD-0910/merge-arbitration.md` (written arbitration procedure: isolation rule, ladder Rules A/B/C, decision-ledger format, disposal rule, container-vs-worktree per-path table, spawn-width ceiling)
  2. `.opencode/audit/BUILD-0910/workstream-probe.mjs` (executable proof, self-test)
  3. `.opencode/audit/BUILD-0910/b0910-build.md` (this ledger)
- Zero `.ts` files shipped (proof in §6: `git diff --name-only HEAD^ HEAD` lists only the 3 paths above, none ending `.ts`). No file owned by another node touched (`b0910-branch.md` lives only in the primary working dir, uncommitted, never read into this commit; no smoke/field/rollback/verify/sign/publish artifact created).

## 5. FAIL-first (honest: failure reproduced, zero repair rounds on content)

FAIL-first failure reproduced BEFORE authoring:

- `git ls-tree -r --name-only wt/0.9.10-workstream-isolation -- .opencode/audit/BUILD-0910/` → empty output (no proof paths exist)
- `node --check .opencode/audit/BUILD-0910/workstream-probe.mjs` → `MODULE_NOT_FOUND` / nonzero

First gate run after authoring PASSED on genuine logic — no defect
found, no content repair performed, none invented:

- `node --check .opencode/audit/BUILD-0910/workstream-probe.mjs` → (no output) / `CHECK_EXIT:0`
- `node .opencode/audit/BUILD-0910/workstream-probe.mjs` (run 1) → `RUN1_EXIT:0`, output quoted in §6
- Repair rounds used: 0 of max 2. Nothing failed after authoring, so nothing was repaired.

## 6. Must-run exits (all exit 0, outputs quoted)

Run in the holder unless noted:

- `node --check .opencode/audit/BUILD-0910/workstream-probe.mjs` → (no output) / `CHECK_EXIT:0`
- `node .opencode/audit/BUILD-0910/workstream-probe.mjs` → `RUN1_EXIT:0` and `RUN2_EXIT:0` (twice digest-identical), output quoted:

```text
ISOLATION cross-write refused=true event=refused:cross-write:alpha->draft/beta/plan.md
ARBITRATION winner=beta loser=alpha rule=C reason=higher-trust-tier
ARBITRATION tie winner=alpha reason=earlier-sequence-tiebreak
ARBITRATION unclaimed rejected=true reason=unclaimed-capability
DISPOSAL removed=alpha survivors=1 sideEffects=0
CEILING third-refused=true raise-before-green-refused=true ceiling=2
DIGEST b95376f55f3e3427db867b45bc944f896be9a2907d06d0a2142e463b497f70ca
CEILING raised=3 after-green-spawn=delta
```

- Twice digest-identical: run 1 `DIGEST b95376f55f3e3427db867b45bc944f896be9a2907d06d0a2142e463b497f70ca`, run 2 identical (equal).
- Self-test proves: (a) each workstream writes only its own draft paths while a direct cross-write is refused as the recorded event `refused:cross-write:alpha->draft/beta/plan.md` with beta's bytes untouched; (b) the arbitration ladder is written before the merge and every conflict lands in the decision ledger with winner plus reason; (c) the real conflicting-edit scenario (alpha-reviewer vs beta-operator on `shared/plan.md`) merges the winner's content while the loser content survives verbatim in the ledger entry — no silent overwrite; tier ties break on earlier sequence and unclaimed capabilities are rejected; (d) disposing alpha leaves beta's bytes digest-identical with `sideEffects=0`; (e) the container-vs-worktree decision is documented per path in `merge-arbitration.md` §5; (f) the third spawn and the pre-green ceiling raise are both refused, and the ceiling rises only after the green digest is recorded.
- `tsc --noEmit`: N/A — zero `.ts` files shipped (see §4 and the name-only diff below); `tsc` absent from PATH; no pass claimed.
- Commit-shape proofs (post-commit, holder):
  - `git rev-parse wt/0.9.10-workstream-isolation` → new commit SHA (quoted in the node report handoff; parent is exactly `4d2f204b9ffc015c31b8282ec6f20c5fbf611454`)
  - `git log -1 --format=%P` → `4d2f204b9ffc015c31b8282ec6f20c5fbf611454` (exactly one parent)
  - `git log -1 --format=%B` → `feat(0.9.10): LD-10 workstream isolation plus merge arbitration with decision ledger` (exact message)
  - `git diff --name-only HEAD^ HEAD` → exactly the 3 paths listed in §4
- Unmoved proofs (post-commit, primary worktree `O:/vantrilex-arsenal`):
  - `git rev-parse HEAD` → unchanged from pre-proof (`wt/0.9.0-zenith` tip)
  - `git branch --show-current` → `wt/0.9.0-zenith`
  - `git rev-parse refs/heads/main` → unchanged (local main never moved)

## 7. File SHAs (FULL, pre-commit bytes)

- `workstream-probe.mjs` SHA-256 `0A1523492FE5902E2E43B4A6C1F73FA529797F6A4E8940DB10A4B3CCEF5B1891` (13,629 bytes)
- `merge-arbitration.md` SHA-256 `711B0D959C264256D24DE9806D0DB399769AF74EC527B7C60066B8135490D91D` (4,228 bytes)
- `b0910-build.md` (this ledger) SHA-256 recorded pre-commit in the node report handoff (content frozen before commit; hash quoted there verbatim).
- Parent FULL SHA `4d2f204b9ffc015c31b8282ec6f20c5fbf611454` (0.9.9 merge, W0 live-proved, never assumed).

## 8. Handoff summary (for the LEADER — not a ruling)

One commit on `wt/0.9.10-workstream-isolation` with exactly the 3 new files above,
parent exactly `4d2f204b9ffc015c31b8282ec6f20c5fbf611454`, exact message
`feat(0.9.10): LD-10 workstream isolation plus merge arbitration with decision ledger`.
Must-runs exit 0 with outputs quoted in §6. FAIL-first honestly
failure-reproduced then zero-repair (§5). Primary HEAD and local main
proven unmoved. Commit FULL SHA quoted in the node report handoff (a
ledger cannot embed its own commit's SHA in a single commit; the branch
log is the source of truth). Verdict belongs to the LEADER.

Ponytail: FULL — failure reproduced pre-authoring (empty ls-tree plus MODULE_NOT_FOUND on the probe), first genuine gate run clean (CHECK:0, twice digest-identical SELFTEST:0 with outputs quoted), zero content repairs.
