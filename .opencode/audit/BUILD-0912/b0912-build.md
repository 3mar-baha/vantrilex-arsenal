# b0912-build — LD-12 gradual tool disclosure and code-pattern composition

Lane: build-release (AUTO-0.9-FULL 0.9.12) · Node: b0912-build (wave 1 of 9) · Owner: vantrilex-typescript
Doctrine: FULL — core ponytail posture with FLOOR and CEILING below.
Date (UTC): 2026-10-29 · Seat: worker-only side agent (no lead/dispatch/declare-done; report is evidence)

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 0. Task-dispatcher classification (one scenario only)

Observed: **Scenario 1 NEW TASK** — this directed node (`b0912-build`)
was never dispatched to this seat before (W0 `b0912-branch.md` closed
separately by another node; no in-flight task exists on this seat, so
there is nothing to continue or modify). Vanguard playbook NOT run from
this seat: worker-only side agent, seat denies `vantrilex-vanguard` (no
dispatch authority; brief orders no push, no merge, no tag, no publish).
Denial recorded here; rule applied: execute exactly one directed node and
report back.

## 1. Scope (from V3:3805-3878, Arabic original — implemented, never re-derived)

LD-12 lands code-pattern governance plus kit-side disclosure with measured
context economy: the three-set model (resident / deferred / forbidden, no
per-agent tool groups — the platform has none, V3:3811); the hot set of 4
pinned resident tools with the rest deferred against the 30-to-50
selection-slope constraint; discovery at role boundaries with stable index
prefixes; per-agent declaration cost measured and fed to cost governance
(LD-06); the file-tree/search/isolated-compose/shape-at-bridge mechanism;
a multi-server composite task proven with schemas out-of-context and the
hot set resident; a forbidden-server deny proven BOTH unreachable AND
instructions-absent; tool descriptions audited (misleading/poisoned
rejected); and files-and-code documented as the discovery interface, not
schemas alone. Full treatment lives in `gradual-disclosure.md` plus
`disclosure-probe.mjs` (sibling files, same commit).

## 2. Fallback FBLD-12 honored

FBLD-12 (slot 0.9.12, source
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:24`): V3
slot scope versus R4 discovery-trigger breadth with zero on-disk combined
record — fallback: keep the trigger verbatim; device stays UNVERIFIED —
Matches LD-12 — Status FLAGGED, never resolved. Honored here: the
discovery trigger is kept verbatim as cited (R4 `find-skills`
trigger-widening pressure toward session duties, per BUILD-099 record) —
this commit neither widens it toward session duties nor narrows it. Device
stays UNVERIFIED: no device claim appears in this commit, none widened by
inference (probe asserts the device slot is null). The conflict stays
FLAGGED, never resolved here. Zero invented installs: every registry row
carries `install_cmd: null` with `verification: unverified` (probe asserts
19/19, none present elsewhere in this commit).

## 3. Holder pattern (primary HEAD never moves)

All branch work ran in the holder
`C:/Users/omarb/AppData/Local/Temp/opencode/wt0912` checked out at
`wt/0.9.12-gradual-disclosure`. Primary worktree (`O:/vantrilex-arsenal`)
stayed on `wt/0.9.0-zenith` (dirty pre-existing state untouched, never
entered); local `main` untouched.

Pre-proofs (holder unless noted):

- Holder `git rev-parse HEAD` → `2d5d9d026b1a766dea3b872ccc469b896d20b188`
- Holder `git branch --show-current` → `wt/0.9.12-gradual-disclosure`
- Holder `git status --porcelain` → clean (empty)
- `git rev-parse wt/0.9.12-gradual-disclosure` (primary) → `2d5d9d026b1a766dea3b872ccc469b896d20b188`
- `git ls-tree -r --name-only wt/0.9.12-gradual-disclosure -- .opencode/audit/BUILD-0912/` → empty (0 committed paths before)
- `node --check .opencode/audit/BUILD-0912/disclosure-probe.mjs` → `MODULE_NOT_FOUND`, exit `1` (FAIL-first reproduced)

## 4. Before/after counts (committed paths under `.opencode/audit/BUILD-0912/`)

- Before: 0 committed paths (ls-tree empty on branch tip `2d5d9d026b1a766dea3b872ccc469b896d20b188`).
- After: exactly 3 new files, one commit, no other paths touched:
  1. `.opencode/audit/BUILD-0912/gradual-disclosure.md` (spec: code-pattern governance, kit-side disclosure, FBLD-12 carried, non-goals)
  2. `.opencode/audit/BUILD-0912/disclosure-probe.mjs` (executable proof, self-test)
  3. `.opencode/audit/BUILD-0912/b0912-build.md` (this ledger)
- Zero `.ts` files shipped (proof in §6: `git diff --name-only HEAD^ HEAD` lists only the 3 paths above, none ending `.ts`). No file owned by another node touched (no smoke/field/rollback/verify/sign/publish artifact created; `b0912-branch.md` lives only in the primary working dir, uncommitted, never read into this commit).

## 5. FAIL-first plus one repair round (changed hypothesis, within cap)

FAIL-first failure reproduced BEFORE authoring:

- `git ls-tree -r --name-only wt/0.9.12-gradual-disclosure -- .opencode/audit/BUILD-0912/` → empty output (no proof paths exist)
- `node --check .opencode/audit/BUILD-0912/disclosure-probe.mjs` → `MODULE_NOT_FOUND`, exit `1`

First gate run after authoring FAILED genuinely (not a typo): the
11-tool toy registry could not exhibit the measured economy — 4 hot of 11
schemas is a 0.36 ratio, so `economy.gradual-le-25pct` refused with a
real assertion error, exit `1`. Repair round 1 (materially changed
hypothesis, same mechanism): the registry was too small to exhibit the
economy a hundreds-of-tools index provides, so 8 honest deferred tools
were added instead of moving the threshold — weakening the gate to fit
the toy was refused. A consequential count assertion moved 3 → 11 in the
same round. Second gate run PASSED clean: `CHECK:0`, twice
digest-identical `SELFTEST:0`. Repair rounds used: 1 of max 2. Nothing
further failed, so nothing further was repaired.

## 6. Must-run exits (every exit quoted, outputs quoted)

Run in the holder unless noted:

- `node --check .opencode/audit/BUILD-0912/disclosure-probe.mjs` → (no output) / `CHECK_EXIT:0`
- `node .opencode/audit/BUILD-0912/disclosure-probe.mjs` → `RUN1_EXIT:0` and `RUN2_EXIT:0` (twice digest-identical), output quoted:

```text
AUDIT quarantined=2 misleading=fs.write poisoned=search.fetch
HOT resident=fs.read,fs.tree,search.code,git.status deferred=11
INSTALLS invented=0 null+unverified=19/19
TREE entries=6 uncopied-unserved=git.log
DISCOVERY lines=2 prefixes-stable=true non-boundary-refused=true
ECONOMY full=76707 gradual=16238 ratio=0.212
COST agent=implementer declared=8060 budget=20000 within=true
COST agent=reviewer declared=8074 budget=20000 within=true
COMPOSITE steps=3 deferred-schemas-out=true hot-resident=true
ISOLATION forbidden-unreachable=true
DENY unreachable=true instructions-absent=true
BRIDGE redacted=true secret-absent=true
FBLD-12 trigger=verbatim device=UNVERIFIED
DIGEST 4e425fadd2b03b9f046bc8a08d22c2363b97b5818a8fe8e4e22071703bd7995a
```

- Twice digest-identical: run 1 `DIGEST 4e425fadd2b03b9f046bc8a08d22c2363b97b5818a8fe8e4e22071703bd7995a`, run 2 identical (equal).
- Self-test proves: (a) the description audit quarantines exactly the misleading (`fs.write` claims read-only yet mutates) and poisoned (`search.fetch` carries an instruction override) tools with reasons, and neither enters any set; (b) the hot set is exactly 4 pinned resident (within 3–5) with 11 honest tools deferred; (c) zero invented installs (19/19 null+unverified); (d) the file tree is generated over copied content only and uncopied content (`git.log` plus uncopied deferred tools) is absent from tree and index alike; (e) discovery fires at role boundaries only (non-boundary refused as event) with prefix-map digest identical across roles; (f) context economy is measured in characters (76707 → 16238, ratio 0.212 ≤ 0.25); (g) per-agent declaration costs (8060, 8074 chars) sit under the 20000 budget and feed cost governance as `{ agent, declaredChars, budgetChars, withinBudget }` rows; (h) the 3-step multi-server composite task verifies with deferred schemas provably out of context while the hot set stays resident; (i) isolated compose cannot reach the forbidden server even when named; (j) the `exfil` deny holds BOTH halves — invocation unreachable AND no `exfil` instruction text in context; (k) sensitive payloads are redacted at the bridge (`secret=[REDACTED]`, raw absent); (l) FBLD-12 is carried (trigger verbatim, device null/UNVERIFIED).
- `tsc --noEmit`: N/A — zero `.ts` files shipped (see §4 and the name-only diff below); no pass claimed. Carried to Guide ruling or capable re-run before merge per brief.
- Commit-shape proofs (post-commit, holder):
  - `git rev-parse wt/0.9.12-gradual-disclosure` → new commit SHA (quoted in the node report handoff; parent is exactly `2d5d9d026b1a766dea3b872ccc469b896d20b188`)
  - `git log -1 --format=%P` → `2d5d9d026b1a766dea3b872ccc469b896d20b188` (exactly one parent)
  - `git log -1 --format=%s` → `feat(0.9.12): LD-12 gradual tool disclosure and code-pattern composition` (exact message)
  - `git diff --name-only HEAD^ HEAD` → exactly the 3 paths listed in §4
- Unmoved proofs (post-commit, primary worktree `O:/vantrilex-arsenal`):
  - `git rev-parse HEAD` → unchanged from pre-proof (`wt/0.9.0-zenith` tip)
  - `git branch --show-current` → `wt/0.9.0-zenith`
  - `git rev-parse refs/heads/main` → unchanged (local main never moved)

## 7. File SHAs (FULL 64-hex, pre-commit bytes)

- `disclosure-probe.mjs` SHA-256 `d7b85901b1a34e2386657bb1cca721bcf6af95217cc9a5d6193fa60a6587538f` (16190 bytes)
- `gradual-disclosure.md` SHA-256 `b8113ca018c955666b179c661cbd6fd0cfb218fa7110e66164225fad2f2c22c3` (5049 bytes)
- `b0912-build.md` (this ledger) SHA-256 recorded pre-commit in the node report handoff (content frozen before commit; hash quoted there verbatim).
- Parent FULL SHA `2d5d9d026b1a766dea3b872ccc469b896d20b188` (0.9.11 merge, W0 live-proved, never assumed).

## 8. Handoff summary (for the LEADER — not a ruling)

One commit on `wt/0.9.12-gradual-disclosure` with exactly the 3 new files
above, parent exactly `2d5d9d026b1a766dea3b872ccc469b896d20b188`, exact
message `feat(0.9.12): LD-12 gradual tool disclosure and code-pattern
composition`. Must-runs exit 0 with outputs quoted in §6. FAIL-first
honestly failure-reproduced, then one genuine repair round with a
materially changed hypothesis (registry scale, never a weakened gate).
Primary HEAD and local main proven unmoved. Commit FULL SHA quoted in the
node report handoff (a ledger cannot embed its own commit's SHA in a
single commit; the branch log is the source of truth). Verdict belongs to
the LEADER.

Ponytail: FULL — failure reproduced pre-authoring (empty ls-tree plus MODULE_NOT_FOUND), one genuine gate failure repaired without weakening (CHECK:0, twice digest-identical SELFTEST:0 with outputs and DIGEST quoted), no `any`, `tsc` N/A with reason (zero `.ts`).
