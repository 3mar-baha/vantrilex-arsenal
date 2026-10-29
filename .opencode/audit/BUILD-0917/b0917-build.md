# b0917-build — LD-17 OpenCode 2.0-native conformance & hardening (worker evidence)

Lane: build-release (AUTO-0.9-FULL 0.9.17 ONLY) · Node: b0917-build (wave 1 of 9, depends_on b0917-branch) · Owner: vantrilex-typescript (worker-only; never lead/dispatch/declare; verdict belongs to the LEADER). No second-agent dispatch. STOP after commit + proofs. No smoke.

Task-dispatcher: Scenario 1 NEW TASK for this seat (directed node `b0917-build` never dispatched here before; no in-flight task). Vanguard playbook NOT run from this seat — worker seat denies the skill (worker-only law); rule applied: execute exactly the directed node, report back, stop.

Doctrine: FULL — core ponytail posture with FLOOR and CEILING below; every code-writing step ran under it.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

Base: `acd4f5aff261f594fb963530cea791f6be542c55` (live `origin/main` tip incl 0.9.16 merge), re-proven in the holder worktree before any write (never assumed).

Holder worktree: `C:/Users/omarb/AppData/Local/Temp/opencode/b0917-build-holder` (primary checkout HEAD at `wt/0.9.0-zenith` never moved; no push, no merge, no tag).

## Base re-proof (real outputs, exit codes)

- `git rev-parse HEAD` (holder, pre-write) → `acd4f5aff261f594fb963530cea791f6be542c55` — exit 0.
- `git status --porcelain=v1` (holder, pre-write) → empty — exit 0.
- `git log --oneline -1` (holder, pre-write) → `acd4f5a Merge branch 'wt/0.9.16-foundation-replacement' into main for v0.9.16` — exit 0.
- `git rev-parse refs/heads/wt/0.9.17-conformance-hardening` (pre-commit) → `acd4f5aff261f594fb963530cea791f6be542c55` — exit 0 (branch at live tip, zero commits yet).

## FAIL-first record (reproduce before fix, max 2 repair rounds)

- Reproduction: `node scripts/verify-conformance-0917.mjs` first run → 16/18 PASS, 2 FAIL (`version-stamps`, `environment-facts`: `opencode --version` direct-spawn failed on win32, `unverified(blocked: spawn failed)`), exit 1 (the failing check).
- Repair round 1 (one round, changed hypothesis, not weakened guard): root cause owned — `opencode` on win32 is a shell shim, direct `execFileSync` cannot spawn it; added shell fallback with the spawn path recorded (`via=shell`), same rule LD-16 used. No guard dropped: version match still required. Result: 18/18 PASS, exit 0.
- Circuit breaker: 0/3 strikes (one round with a materially changed hypothesis); zero 429/5xx.

## Landed files (3 content files + this ledger; probe enforces all tokens)

| File | Role |
|---|---|
| `.opencode/audit/BUILD-0917/operational-inventory.md` | 14-file operational layer, line-by-line spans classified by source stamp (`lines=N` + 12-char hash + date + subject per row) |
| `.opencode/audit/BUILD-0917/conformance-ledger.md` | 14 assumption verdicts (proven 14 / fixed 0 / deleted 0) + version stamps + P-9/P-10 independent sections + permanent surface list tied to gap register (G-17-1, G-17-2) + real-hardware gate + 4324-4329 coverage + DECIDED 4330-4336 |
| `scripts/verify-conformance-0917.mjs` | 18-check runnable suite: inventory live-recompute, hooks, pre-write gate, in-session factory tools, interface/server split, failure-side unit + docs, FBLD-17 verbatim, install honesty, exit criteria, open questions, stamps, P-9/P-10, surface list, hardware gate, env facts |
| `.opencode/audit/BUILD-0917/b0917-build.md` | this file |

FBLD-17 carried verbatim in every artifact: report-only citation, never installed by this lane.

## Coverage map (acceptance items)

- Inventory: 14-file operational layer line-by-line classified by source+date — inventory §§1-5 (probe checks 1-3 recompute live).
- Conformance probe runnable suite (hooks + pre-write gate + in-session factory tools + interface/server split + failure-side probes) — probe checks 4-9, 18/18 green.
- Ledger per-assumption verdicts + version stamps + P-9/P-10 + permanent surface list tied to gap register + real-hardware gate — ledger §§above (probe checks 12-17).
- FBLD-17 verbatim in every artifact — probe check 10 (inventory + ledger + probe).
- Zero invented install commands, null + unverified where unproven — probe check 11; no new vectors introduced.
- V3 exit criteria 4324-4329 COVERED with evidence — ledger §Exit criteria (probe check 12).
- Open questions 4330-4336 DECIDED inside the ledger with evidence — ledger §Open questions (probe check 13).

## Gates (verbatim outputs with exit codes)

- `node --check scripts/verify-conformance-0917.mjs` → (no output) — exit 0.
- `node scripts/verify-conformance-0917.mjs` (run 1 post-fix) → exit 0, verbatim tail: `checks: 18 pass, 0 fail, 18 total` / `LD17-DIGEST 4550a8ea61dbdd986a549f9af20568691646ee0a3f46734b8169c6b23618da3f` / `VERDICT: PROCEED`.
- `node scripts/verify-conformance-0917.mjs` (run 2) → exit 0, identical digest `4550a8ea61dbdd986a549f9af20568691646ee0a3f46734b8169c6b23618da3f` (two runs, identical digests).
- `node scripts/verify-skills.mjs` → exit 0: `totals: 10 checks — 10 passed, 0 failed, 0 skipped` / `VERDICT: PASS` (43 skill folders).
- `node scripts/verify-registry.mjs` → exit 0: `totals: 7 checks — 7 passed, 0 failed, 0 skipped` / `VERDICT: PASS`.
- `node scripts/generate-catalog-json.mjs --check` → exit 0 (all 17 checks ok; this change touches no catalog source).
- `node scripts/verify-catalog.mjs` → exit 1: `VERDICT: FAIL - catalog not proven (19 passed, 0 skipped, 1 failed)` — sole failure `command-shape/skills-upstream`: live `gh repo view` TLS handshake timeouts to `api.github.com` (different repo names on retry 1 vs retry 2: first 5 repos, then 5 other repos — rotating network failures). NOT repaired in-build: my change touches no catalog data (4 new files only, none under `registry/`), so no in-build repair exists except weakening the network check, which is refused. One retry round run (cap: initial + 1); recorded FAIL-first-honest, never weakened, never re-scoped. Escalated to the LEADER: catalog gate needs a network-clean re-run, not a code fix.
- `tsc --noEmit` → N/A with reason: zero `.ts` files in this change (3 Markdown + 1 `.mjs` probe); nothing typeable was added. The repo ships zero dependencies so no local `tsc` binary exists to run (`npx --no-install tsc` refuses, exit 1 — quoted honestly, not as a pass).
- Relative-link resolution over the 3 new audit docs: 0 markdown links by construction (all cross-refs carried as backticked paths or plain source labels), so 0 to resolve and 0 broken.
- documentation-as-tests: every executed command in the new procedures ran for real — the probe recomputes all 14 line-totals plus source stamps live via file reads plus `git log`, the environment facts (`platform/node/opencode`) are measured per run, and the repo gates above ran for real. No example trusted in prose.
- `any` audit: zero `any` in the new probe (all inputs narrowed: `typeof` guards, `Number.parseInt` on regex groups, `instanceof Error` on caught values). Nothing to justify, nothing escalated.

## Anything unprovable (UNVERIFIED with exact blocker, never green)

- Live platform-move drill: UNVERIFIED — blocker: no platform move occurred on this node; the suite's re-run rule (ledger DECIDED: 4331/4336) is procedure, not proof. Never faked as done.
- Host 2.0.32 parity: UNVERIFIED — blocker: V3 names 2.0.32 as the live surface; this seat measured 2.0.27. Recorded as gap G-17-1 with an owning slot, never rounded away.
- V1 lifecycle-callback port: UNVERIFIED as completed work — blocker: inert-by-design carry, recorded as gap G-17-2 for the porting slot. Never faked as done.
- Arabic mirror: UNVERIFIED — blocker: repo hard rule AGENTS.md-5 (English only; sole on-disk exception is the README pair). All outputs English. Parked for owner ruling, never improvised.

## Commit record

- Message (exact): `feat(0.9.17): LD-17 OpenCode 2.0-native conformance and hardening`.
- Parent: `acd4f5aff261f594fb963530cea791f6be542c55` (branch tip at land time).
- Landed from the holder on `wt/0.9.17-conformance-hardening` (checkout inside the holder only; primary checkout untouched): exactly ONE commit, 4 new files, zero other paths touched.

## Zero other mutations

No push, no merge, no tag, no publish. Primary checkout HEAD (`wt/0.9.0-zenith`) unmoved. Untouched: `main`, every other version branch, tags, `AGENT.md`/`WORKFLOW.md`/state files, W2+ artifacts, `registry/catalog.json`, `registry/VANTRILEX_CATALOG.md`, `registry/data/*.jsonl`, kit lock. State files: neither (only BLAZAR writes AGENT.md/WORKFLOW.md). Holder worktree removed post-commit; `git status --porcelain` in the primary checkout shows only the pre-existing dirty tree owned by other lanes.

Ponytail: FULL — 18/18 probe PASS twice with identical digests plus skills/registry/mirror gates green plus catalog-FAIL honestly recorded and escalated; failure-side degrade logic unit-asserted in-probe (FLOOR); no abstraction, option, or wrapper added beyond the directed concern (CEILING).
