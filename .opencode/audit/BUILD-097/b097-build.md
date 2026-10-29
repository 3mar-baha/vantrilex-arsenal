# b097-build — LD-07 supply-chain security for components (ledger)

Lane: build-release (AUTO-0.9-FULL 0.9.7) · Node: b097-build (wave 1 of 9) · Owner: vantrilex-typescript
Doctrine: FULL — core ponytail posture with FLOOR and CEILING below.
Date (UTC): 2026-10-29 · Seat: worker-only side agent (no lead/dispatch/declare-done; report is evidence)

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 0. Task-dispatcher classification (one scenario only)

Observed: **Scenario 1 NEW TASK** — this directed node (`b097-build`) was
never dispatched to this seat before (W0 `b097-branch` closed separately;
AGENT.md:911). Vanguard playbook NOT run from this seat: worker-only agent,
seat denies `vantrilex-vanguard` (no dispatch authority; brief orders "No
Vanguard equip", "No model pins", "No merge/tag/publish/activation"). Rule
applied: execute exactly one directed node and report back.

## 1. Scope (from V3:3471–3522, Arabic original — implemented, never re-derived)

LD-07 makes component change a declared event, never a silent surprise: every
accepted tool description plus its data shape is pinned by secure hash at
acceptance; CI diff-checks snapshots on every upstream change including
tool-list-change notices; scanners run at accept and at update; full call
media is displayed before the human reviewer; the description audit expands
agents → all kinds; the input-license gate is formally constituted here
(T0-sort since 0.9.1, posture enforcement this slot); the retro-scan carries
a ~15–25 percent budget line sighted by 0.9.1 baselines; the T9 bar (working
examples, output-schema docs, actionable error text) is shared with the eval
slot; the wild rates 26.1 percent / 5.2 percent / 2.12x are carried as
reported figures. Full treatment lives in `supply-chain-spec.md` (sibling
file, same commit).

## 2. Fallback FBLD-07 honored

FBLD-07 (slot 0.9.7, source
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:19`): V3 slot
scope versus the R3 cloud-learning proposal — fallback is local-only; secrets
never enter the repo. Honored here: this build ships local-only measurement
and gating only. No cloud-learning adoption, no SaaS, no secret value in any
committed file (probe fixtures carry the literal `redacted` placeholder
only, never a credential). Finding (text only, no change applied): no
cloud-learning pressure was introduced by this node; the spec carries the
fallback verbatim in §7 and the probe runs on Node stdlib with zero
dependencies and zero network calls.

## 3. Holder pattern (primary HEAD never moves)

All branch work ran in the holder
`C:/Users/omarb/AppData/Local/Temp/opencode/b097-build-holder` checked out at
`wt/0.9.7-supply-chain`. Primary worktree (`O:/vantrilex-arsenal`) stayed on
`wt/0.9.0-zenith`; local `main` untouched.

Pre-proofs (before any mutation):

- Primary `git rev-parse HEAD` → `2a78995b88f9d0f5b89564397add338794b60c5f`
- Primary `git branch --show-current` → `wt/0.9.0-zenith`
- `git rev-parse refs/heads/main` → `68f8186ba18c825819e890de2ef694560655c4f2`
- `git rev-parse wt/0.9.7-supply-chain` → `ec935da449582c17387ef27bfef0dc59f0b0283d`
- Holder `git rev-parse HEAD` → `ec935da449582c17387ef27bfef0dc59f0b0283d` (detached, then `git checkout wt/0.9.7-supply-chain`, same SHA)
- Holder `git branch --show-current` → `wt/0.9.7-supply-chain`
- Holder `git status --porcelain=v1` → clean (empty)
- `git ls-tree -r --name-only wt/0.9.7-supply-chain -- .opencode/audit/BUILD-097/` → empty (0 committed paths before)

## 4. Before/after counts (committed paths under `.opencode/audit/BUILD-097/`)

- Before: 0 committed paths (ls-tree empty on branch tip `ec935da`).
- After: exactly 3 new files, one commit, no other paths touched:
  1. `.opencode/audit/BUILD-097/supply-chain-spec.md` (spec)
  2. `.opencode/audit/BUILD-097/pin-probe.mjs` (measurement script)
  3. `.opencode/audit/BUILD-097/b097-build.md` (this ledger)
- No `.ts` product file touched. No file owned by another node touched
  (`b097-branch.md` is a prior node's untracked path in the primary worktree;
  it is absent from the holder and absent from this commit).

## 5. FAIL-first reproduction (measurement script, first run FAILS)

First run FAILED on a genuine defect, then one repair round fixed it:

- Defect (as first written): `verifyPin` recomputed the hash over
  `{description, name}` only, dropping `dataShape` — while `pinTool` pins
  the full canonical `{dataShape, description, name}`. Even the anchored
  check failed.
- `node --check .opencode/audit/BUILD-097/pin-probe.mjs` → (no output) / `CHECK_EXIT:0`
- `node .opencode/audit/BUILD-097/pin-probe.mjs` → `RUN_EXIT:1`, output quoted:

```text
self-test FAIL: pin.anchored: expected true, got false
```

- Repair (one round): `verifyPin` recomputes over `canonicalTool(live)` —
  the same full canonical form `pinTool` pins. One line changed, nothing
  else. A shape-tamper case (`diff.shape-tamper-stops`) guards the exact
  defect class so it cannot return silently.

## 6. Must-run exits (all exit 0 post-repair, outputs quoted)

Run in the holder unless noted:

- `node --check .opencode/audit/BUILD-097/pin-probe.mjs` → (no output) / `CHECK_EXIT:0`
- `node .opencode/audit/BUILD-097/pin-probe.mjs` → `RUN_EXIT:0` (run 1 + run 2, twice digest-identical), output quoted:

```text
PIN-anchored read=452b948d30abae77025f55b5113a78635c99f76a5e250d5ab9019e03bc7281b0
DIFF-stops-on-tamper DIFF tool-list-change=false changed=[read] action=stop-pending-reapproval
DIFF-stops-on-shape-tamper shape-change action=stop-pending-reapproval
CALL read args={"id":"registry/rag/08"} — reviewer display, not log-only
LICENSE-gate allow=pass review=hold deny=blocked
SBOM-present registry-reader@0.9.7 pins=1
SELFTEST PASS
```

- Twice digest-identical: run 1 SHA-256 `963AED63383E4C8E962921D9034419128F20A8C0A6617972246E571A177E30C0`, run 2 SHA-256 `963AED63383E4C8E962921D9034419128F20A8C0A6617972246E571A177E30C0` (equal); `Compare-Object` over both outputs → empty (no difference).
- Self-test proves, from a fixture component: pin anchored at acceptance
  (64-hex SHA-256); a genuinely tampered upstream description stops the tool
  pending re-approval; a data-shape tamper stops it too; an unchanged re-read
  continues; a tool-list addition raises the list-change notice and stops;
  scanners pass at accept and at update; full call media renders for the
  reviewer; the license gate holds all three postures; the SBOM is present.
- Commit-shape proofs (post-commit, holder):
  - `git log -1 --format=%H` → new commit SHA (quoted in the node report §8; parent is exactly `ec935da449582c17387ef27bfef0dc59f0b0283d`)
  - `git log -1 --format=%P` → `ec935da449582c17387ef27bfef0dc59f0b0283d` (exactly one parent)
  - `git log -1 --format=%s` → `feat(0.9.7): supply-chain security for components (LD-07)` (exact message)
  - `git show --name-only --format=` → exactly the 3 paths listed in §4
- Unmoved proofs (post-commit, primary worktree `O:/vantrilex-arsenal`):
  - `git rev-parse HEAD` → `2a78995b88f9d0f5b89564397add338794b60c5f` (identical to pre-proof)
  - `git branch --show-current` → `wt/0.9.0-zenith` (identical to pre-proof)
  - `git rev-parse refs/heads/main` → `68f8186ba18c825819e890de2ef694560655c4f2` (identical to pre-proof)

## 7. File SHAs (FULL, pre-commit content)

- `supply-chain-spec.md` SHA-256 `4E3B634212184A1058A5DC02D1E0827E318E02DD84D59C2C819A02720491B97E` (5,328 bytes)
- `pin-probe.mjs` SHA-256 `8769ABD71495595E8BA1C5BF0D9696604ED30B16E28AAD5DB5649EBAEC9F63FF` (8,755 bytes)
- `b097-build.md` (this ledger) SHA-256 recorded post-commit in the node
  report §8 (content frozen before commit; hash quoted there verbatim).
- Parent FULL SHA `ec935da449582c17387ef27bfef0dc59f0b0283d` (0.9.6 merge,
  ls-remote re-proved by W0, never assumed).

## 8. Handoff summary (for the LEADER — not a ruling)

One commit on `wt/0.9.7-supply-chain` with exactly the 3 new files above,
parent exactly `ec935da449582c17387ef27bfef0dc59f0b0283d`, exact message
`feat(0.9.7): supply-chain security for components (LD-07)`. Must-runs exit
0 with outputs quoted in §6. FAIL-first reproduced then repaired in §5.
Primary HEAD and local main proven unmoved. Commit FULL SHA quoted in the
node report handoff (a ledger cannot embed its own commit's SHA in a single
commit; the branch log is the source of truth). Verdict belongs to the
LEADER.

Ponytail: FULL — FAIL-first exit 1 with defect named and one-line repair, then CHECK_EXIT:0 and twice digest-identical RUN_EXIT:0 with outputs quoted.
