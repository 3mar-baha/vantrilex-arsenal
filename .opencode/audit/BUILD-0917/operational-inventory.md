# Operational inventory — LD-17 (0.9.17)

Lane: build-release (AUTO-0.9-FULL 0.9.17 ONLY). Measured on branch
`wt/0.9.17-conformance-hardening` at base `acd4f5a`. Every row names the
live file, its live line total (`lines=N`, recomputed by the probe), and
its source stamp (last commit hash + date + subject from `git log -1`).
Line spans name the section each line range belongs to, so the layer is
classified line-by-line, not file-by-file.

FBLD-17: report-only citation, never installed by this lane.

## Method

- Counts: lines of the file on disk at base (newline-split length).
- Stamps: `git log --format="%H %ad %s" --date=short -1 -- <path>`.
- Rule: a row is wrong if its `lines=` token or its 12-char stamp prefix
  disagrees with a live recomputation. The probe enforces both.

## 1. Hook surface (Tier-0 plugin)

- `.opencode/plugin/arsenal.ts` — lines=3721 — stamp `7a1d3efe8a34` 2026-10-28 `feat(0.9.1): LD-01 smart compact synthesis plus pre-digestion with measured gates`.
  - Lines 1-72: module contract (V2 `setup()` + V1 `server()` split, zero-dependency law, SKIPPED-degrade law, no part synthesis, state-dir confinement).
  - Lines 74-~200: optional-peer type surface (mirrored plugin shapes, no import).
  - Remainder: eight logical Tier-0 hooks (taskDispatcher + plan-guard append on session prompt; seatDenyOverlay on permission evaluate; longRunningProcessGuard + diffSizeGuard on execute.before/shell create.before; docsDisciplineGuard on execute.before; typescriptCheck + prettierFormat on execute.after) plus the V1 `server()` carry.

## 2. Session relay hooks (local-only)

- `.opencode/hooks/relay/relay-hooks.json` — lines=23 — stamp `47882634a803` 2026-10-15 `P3 (7.7) park — unreleased, for verification only`.
  - Lines 1-23: relay hook registration (parked, verification only).
- `.opencode/hooks/relay/relay-poll.mjs` — lines=544 — stamp `0eed6a151800` 2026-10-15 `relay skill v2 — quota-proof polling, sessions, hardening (parked, unreleased)`.
  - Lines 1-544: quota-proof polling loop, session handling, hardening (parked).
- `.opencode/hooks/relay/relay-watchdog.mjs` — lines=527 — stamp `0eed6a151800` 2026-10-15 `relay skill v2 — quota-proof polling, sessions, hardening (parked, unreleased)`.
  - Lines 1-527: watchdog supervision for the parked relay loop.

## 3. Pre-commit / pre-write gates

- `.githooks/pre-commit` — lines=88 — stamp `941d6025b44f` 2026-10-23 `fix(hooks): stop reading a registry token as a credential`.
  - Lines 1-88: secret scanner + `.env` guard + AI-attribution gate.
- `.githooks/commit-msg` — lines=38 — stamp `4b6052eaed19` 2026-10-04 `feat: transplant worktree orchestration, release and CI from the prior repo`.
  - Lines 1-38: commit-message shape gate.
- `scripts/setup-git-hooks.sh` — lines=61 — stamp `4b6052eaed19` 2026-10-04 `feat: transplant worktree orchestration, release and CI from the prior repo`.
  - Lines 1-61: hook activation (wiring only, no policy of its own).

## 4. Verification gates (runnable suites)

- `scripts/verify-catalog.mjs` — lines=1977 — stamp `0dfdeebd443b` 2026-10-24 `refactor(agents): update vantrilex identifiers`.
  - Lines 1-1977: catalog honesty + selection gate.
- `scripts/verify-skills.mjs` — lines=694 — stamp `ea0eef838af0` 2026-10-11 `feat: full defect remediation sweep — plugin crash fix, lock cleanup, agents, skills, release, V2 research`.
  - Lines 1-694: skill-format gate.
- `scripts/verify-registry.mjs` — lines=456 — stamp `727a1e4f2d12` 2026-10-22 `feat(catalog): migrate the registry to v4 — generator, evidence, candidates`.
  - Lines 1-456: registry-data gate.
- `scripts/generate-catalog-json.mjs` — lines=986 — stamp `84ed91f7a46d` 2026-10-22 `feat(catalog): F-P6-1 — kind on every sidecar line (post-sign-off)`.
  - Lines 1-986: catalog-mirror generator + `--check` gate.

## 5. In-session factory surface

- `.opencode/arsenal.json` — lines=29 — stamp `c7c762c21f12` 2026-10-18 `fix: V-REMEDIATE — sync census to live counts, archive root files, AR mirrors, index gate`.
  - Lines 1-29: arsenal index read by sessions.
- `.opencode/equip.manifest.json` — lines=166 — stamp `fc4c9f121bfb` 2026-10-24 `chore: remove switch commands and switching-only skill`.
  - Lines 1-166: equip manifest (phases + kit selection surface).
- `.opencode/craft/build-spec.md` — lines=84 — stamp `672effd0fe54` 2026-10-28 `feat(0.9.3): LD-03 per-leader craft skills with doctrines and outfitter vanguard`.
  - Lines 1-84: factory build specification read in-session, plus `craft/seats/` and `craft/payloads/` beside it.

## Coverage

14/14 files above are the whole operational layer for this slot: hook
surface (1) + relay hooks (3) + commit/write gates (3) + runnable
verification gates (4) + in-session factory surface (3). Generated mirrors
(`registry/catalog.json`) are excluded by rule: they are derived, never
a source. Anything outside this list is UNVERIFIED with blocker: no path
resolves to a live operational file.

Install honesty: zero install commands in this record. Unproven vectors
stay null with unverified, never invented.
