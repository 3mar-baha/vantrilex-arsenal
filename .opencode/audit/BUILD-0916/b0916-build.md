# b0916-build — LD-16 foundation-replacement migration plus easy-global-install (worker evidence)

1. Lane: build-release (AUTO-0.9-FULL 0.9.16 ONLY) · Node: b0916-build (wave 1 of 9, depends on b0916-branch VERIFIED PASS) · Owner: vantrilex-typescript (worker-only; never lead/dispatch/declare; verdict belongs to the LEADER).
2. Concern in one sentence: implement the LD-16 foundation-replacement migration plus easy-global-install work on the 0.9.16 branch in one commit, with measured gates and zero invented installs.
3. Date (UTC): 2026-10-29. Seat: worker-only side agent. No model pins. Effort HIGH.
4. Task-dispatcher: Scenario 1 NEW TASK for this seat (directed node `b0916-build` never dispatched to this seat before; no in-flight task). Vanguard playbook NOT run from this seat — worker seat denies the skill (worker-only: never lead, never dispatch, never equip); recorded here and rule applied: execute exactly the directed node, report back, stop. No second lane; no ambiguity.
5. Doctrine: FULL — core ponytail posture with FLOOR and CEILING below; every code-writing step ran under it.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

6. Base: `ed43781999ed062264a7297cd9b46b6d18dcf724` (live `origin/main` tip incl 0.9.15 merge), re-proven live in the holder worktree before any write (never assumed).
7. Holder worktree: `C:/Users/omarb/AppData/Local/Temp/opencode/b0916-build-holder` (primary checkout HEAD at `wt/0.9.0-zenith` never moved; no push, no merge, no tag).

## Base re-proof (real outputs, exit codes)

- `git rev-parse HEAD` (holder, pre-write) → `ed43781999ed062264a7297cd9b46b6d18dcf724` — exit 0.
- `git rev-parse refs/heads/wt/0.9.16-foundation-replacement` (pre-write) → `ed43781999ed062264a7297cd9b46b6d18dcf724` — exit 0 (branch at live tip, zero commits yet).
- `git status --porcelain=v1` (holder, pre-write) → empty — exit 0.
- `git log --oneline -1` (holder, pre-write) → `ed43781 Merge branch 'wt/0.9.15-portable-packaging' into main for v0.9.15` — exit 0.

## FAIL-first record (reproduce before fix, max 2 repair rounds)

- Reproduction: `node scripts/verify-foundation-replacement.mjs` pre-write → `Error: Cannot find module ... MODULE_NOT_FOUND`, exit 1 (probe absent — the failing check).
- Repair round 1 (one round, changed hypotheses, not weakened guards): 15/21 PASS, 6 FAIL (parity-gate, policy-enforcement, reinstall-procedure, environment-facts, install-honesty, exit-criteria-covered). Root causes all owned: hyphen-vs-space token, case-sensitive phrase match, win32 shim spawn path, self-scan pattern match, wrapped-line phrase. Fixes: case-insensitive concept matching, `trial[ -]pack` normalisation, shell-fallback spawn with path recorded, self-exclusion pattern construction, one-line doc wrap fix. No guard dropped: every concept still required.
- Repair round 2 (final): doc line-wrap fix only (phrase split across lines). Result: 21/21 PASS, exit 0.
- Post-commit verification cycle (new defect, new FAIL-first round): the first
  post-commit probe run failed `inventory-counts` on all 43 ids. Root cause
  owned: the committed probe script carries all 43 ids in its own `BASE_IDS`
  table, so once tracked it counted itself as a consumer (+1 each) — the
  stated rule ("outside this migration record") was right, the grep
  under-excluded one migration-record path. Fix: added
  `:(exclude)scripts/verify-foundation-replacement.mjs` to the probe grep and
  documented the test-data exclusion in the inventory rule; the 43 embedded
  tokens are byte-identical (they were measured under exactly this
  exclusion). The landed single commit is amended (same message, still ONE
  commit) to carry the fix; the amended digest run is quoted below.
- Circuit breaker: 0/3 strikes (each round carried a materially changed hypothesis); zero 429/5xx.

## Landed files (5 content files + this ledger; bytes + FULL SHA-256, post-edit pre-commit)

| File | Bytes | SHA-256 |
|---|---|---|
| `scripts/verify-foundation-replacement.mjs` | 15879 | `B56A7E0114774AE076B66B02D67C0EC18086992B603D2A6E2BF12F057DD68B8F` |
| `.opencode/audit/BUILD-0916/foundation-inventory.md` | 13768 | `D3436CB30CED6A86E5BEC63162B13755A4C2260B551CDE7D43C668C262B13BBB` |
| `.opencode/audit/BUILD-0916/shadow-run-procedure.md` | 4452 | `303312DB6F7A33E35A5139F6A41FD3E89089A2F2398FF24B1C56FE4E937DB56A` |
| `.opencode/audit/BUILD-0916/global-install-policy.md` | 4594 | `E43B1CA55A3134FB84E50A5F6AF69EAC121C9BB416FDCF3435C2CE4202A7AC0A` |
| `registry/policies/release-policy.json` | 1036 | `262930FD2BCCA4C613D233C2FE14C2C72063EAA26EBE1A10D184ADA13E713BD9` |
| `.opencode/audit/BUILD-0916/b0916-build.md` | this file (size at land time recorded in handoff return; hash self-referential by construction) | — |

## Coverage map (acceptance items 1–11, V3:4105-4191)

- (1) Ownership inventory: all 43 base skills, each with owner layer (equip-manifest phase or `kit`), counted consumers (`git grep -l`, own folder + this record excluded), task layer, counted functional tasks (`### ` stages + numbered steps under `## Procedure`), observable evidence (SKILL.md path + consumer samples) — `foundation-inventory.md` §1.
- (2) Classification per item with FBLD-16 number-advisory-until-close: stay 28 / move-to-craft-bundle 7 / stay-shared 8 / retire 0; promise nothing early (probe sweeps promise verbs) — inventory §2.
- (3) Shadow-run procedure for the receiving layer beside the base without replacing — `shadow-run-procedure.md` §3.
- (4) Parity gate measured task-by-task on the eval umbrella (0.9.5 trial packs, HAL log inspection), no single-task shortfall waived — shadow §4.
- (5) Sliced cutover, every slice rollbackable (Slice Z zenith pair, Slice C craft five, Slice S adapters stepwise; one slice at a time; revert-per-slice) — shadow §5.
- (6) Zero-consumer proof procedure reusing the kit-lock standard (hash-pinned `skills-lock.json` + verified-only/suspended selection) before any shutdown — shadow §6.
- (7) Enforcement from global policies never permissions (global config weakest vs project, policies reversed, outer-beats-inner, permissions append-only last-match-wins; permission guarantees rejected by construction) — `global-install-policy.md` §7.
- (8) Installer merge semantics (arrays aggregate, same-name hooks replace whole, later-source-wins derived identity, installer config-write claims checked) with unit assertions in the probe — global §8 + probe checks 10–14.
- (9) Clean full reinstall on a clean base + selection verification on real hardware (Windows, owner's common OS) incl background server start (`opencode serve`) — global §9; live facts measured per probe run (`platform=win32 node=v25.0.0 opencode=opencode v2.0.27`).
- (10) Vantrilex-leader task classification in release-policy notes at mapping not publish gate (`notes.leader_task_classification.stage = mapping-not-publish-gate`; increments untouched) — global §10 + `registry/policies/release-policy.json`.
- Open questions decided inside the work with evidence, never promised early: DECIDED retire-share=0 (evidence min-consumers=3: `vs-golden-equipment`, `vs-zn-refresh-guard` — the zero-consumer condition holds for no item) and DECIDED slice boundaries (evidence: destination-column grouping with no cross-layer consumers); FBLD-16 carried verbatim in the inventory.
- Zero invented install commands: no `install_cmd` and no install-shaped command in any new file (probe check 18); unproven vectors stay null + unverified (no new vectors introduced).
- Exit criteria V3:4184-4185 COVERED: parity-or-better per task (shadow §4) + zero-consumer proof (shadow §6) + clean reinstall with real-hardware selection check (global §9).

## Gates (verbatim outputs with exit codes)

- `node --check scripts/verify-foundation-replacement.mjs` → (no output) — exit 0.
- `node scripts/verify-foundation-replacement.mjs` (run 1) → exit 0, verbatim tail: `checks: 21 pass, 0 fail, 21 total` / `LD16-DIGEST 7ecb48768656fc86d62de7f730bbd3dfab9aef7301443e4e4cc2419b5742d975` / `VERDICT: PROCEED`.
- `node scripts/verify-foundation-replacement.mjs` (run 2) → exit 0, identical digest `7ecb48768656fc86d62de7f730bbd3dfab9aef7301443e4e4cc2419b5742d975` (two runs, identical digests).
- `node scripts/verify-skills.mjs` → exit 0: `totals: 10 checks — 10 passed, 0 failed, 0 skipped` / `VERDICT: PASS` (43 skill folders).
- `node scripts/verify-catalog.mjs` → exit 0: `VERDICT: PASS - catalog proven (20 passed, 0 skipped, 0 failed).`
- `node scripts/verify-registry.mjs` → exit 0: `totals: 7 checks — 7 passed, 0 failed, 0 skipped` / `VERDICT: PASS`.
- `node scripts/generate-catalog-json.mjs --check` → exit 0 (all 17 checks ok; policy-notes edit touches no catalog source).
- `tsc --noEmit` → N/A with reason: zero `.ts` files in this change (4 Markdown + 1 `.mjs` probe + 1 JSON note); nothing typeable was added. The repo ships zero dependencies so no local `tsc` binary exists to run (`npx --no-install tsc` refuses, exit 1 — quoted honestly, not as a pass).
- Relative-link resolution over the 3 new audit docs: 0 markdown links by construction (all cross-refs carried as backticked paths or plain source labels), so 0 to resolve and 0 broken.
- documentation-as-tests: every executed command in the new procedures ran for real — the probe recomputes all 43 consumer/funct counts live via `git grep` plus file reads, the environment facts (`platform/node/opencode`) are measured per run, and the repo gates above ran for real. No example trusted in prose.
- `any` audit: zero `any` in the new probe (all inputs narrowed: `asRecord`-style object checks, `typeof` guards, `Number.parseInt` on regex groups). Nothing to justify, nothing escalated.

## Anything unprovable (UNVERIFIED with exact blocker, never green)

- Live cutover execution: UNVERIFIED — blocker: slices Z/C/S are defined with rollback lines but no slice has executed on this node (this node lands procedures + gates, wave 1 of 9; execution belongs to later waves). Never faked as done.
- Live background-server drill on the clean base: UNVERIFIED as a completed drill — blocker: `opencode serve` start is specified as step 5 of the reinstall procedure for the clean-base run, which happens after this commit lands; the binary presence (`opencode v2.0.27`, exit 0) is measured, the drill itself is procedure, not proof.
- Arabic mirror: UNVERIFIED — blocker: repo hard rule AGENTS.md-5 (English only; sole on-disk exception is the README pair). All outputs English. Parked for owner ruling, never improvised.

## Commit record

- Message (exact): `feat(0.9.16): LD-16 foundation replacement with policy-enforced global install`.
- Landing commit: quoted in the handoff return (`git rev-parse HEAD` post-commit; this file predates the hash by construction, so the hash lives in the return, not in the file — one amend carrying the post-commit-cycle fix, still exactly ONE commit).
- Parent: `ed43781999ed062264a7297cd9b46b6d18dcf724` (branch tip at land time; `git merge-base --is-ancestor` proven post-commit).
- At-commit gates (quoted in handoff return with exit codes): `git rev-parse HEAD`, `git log --oneline -1`, `git status --porcelain=v1`.

## Zero other mutations

No push, no merge, no tag, no publish. Primary checkout HEAD (`wt/0.9.0-zenith`) unmoved. Untouched: `main`, every other version branch, tags, `AGENT.md`/`WORKFLOW.md`/state files, W2+ artifacts, `registry/catalog.json`, `registry/VANTRILEX_CATALOG.md`, `registry/data/*.jsonl`, kit lock. State files: neither (only BLAZAR writes AGENT.md/WORKFLOW.md). Scratch measure files (`scratch-count.mjs`, `scratch-rows.json`) deleted pre-commit; `git status` at commit shows only the 6 LD-16 paths.

Ponytail: FULL — 21/21 probe PASS twice with identical digests plus skills/catalog/registry/mirror gates green; risky merge logic unit-asserted in-probe (FLOOR); no abstraction, option, or wrapper added beyond the directed concern (CEILING).
