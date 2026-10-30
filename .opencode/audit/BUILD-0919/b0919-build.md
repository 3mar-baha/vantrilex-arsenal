# b0919-build — LD-19 Workflows-as-factory-category v1 build ledger (nine-field report)

Lane: build-release (AUTO-0.9-FULL 0.9.19 ONLY, never 0.9.20)
Node: b0919-build (wave 1 of 10, parallel with r0919-readme-draft — disjoint files, README pair untouched)
Owner: vantrilex-typescript (worker-only; never lead/dispatch/declare; verdict belongs to the LEADER)
Date (UTC): 2026-10-30
Branch: `wt/0.9.19-workflows-factory` (local-only, no push)
Doctrine: FULL — core ponytail posture with FLOOR and CEILING below; every code-writing step ran under it.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## F1 — Brief (directed node, quoted scope)

- Author and land the LD-19 Workflows-as-factory-category v1 build on the version branch as ONE commit with a self-proving probe.
- Acceptance: ONE commit on branch `wt/0.9.19-workflows-factory` (parent `763019ea23ba2fe47c98069c73944c1614a3f430`) with exact message `feat(0.9.19): LD-19 workflows as factory category v1`, containing exactly new files under `.opencode/audit/BUILD-0919/` only: (1) workflow-category spec (canonical schema + narrative schema, stable step-id rule, no in-version renumber, deleted-becomes-tombstone, per-gate checks + per-loop exits + per-wait wake conditions, risk-tiered depth low-basics+sample/standard-deeper/high-deepest+owner-sign, changelog plan+close gates, new index-kind entries, every-rejection-logged); (2) self-test probe `.mjs` proving malformed workflow REJECTED mechanically, narrative-vs-spec order mismatch REJECTED mechanically, stable-id + tombstone + risk-tier + changelog-gate checks PASS, exit criteria V3:4622-4627 COVERED; (3) this build ledger with FULL SHAs, gate outputs, fallback FBLD-19 carried verbatim (discovery and forging as two records, never merged). Open questions V3:4628-4633 all six DECIDED inside the spec with evidence. Zero invented install commands (null + unverified where no registry proof).
- Must run: `node --check` on every `.mjs` (exit 0 each); `node <probe> --self-test` twice, second from a clean copy (exit 0, identical digests; FAIL-first honestly recorded if it occurs, then one repair round with a changed hypothesis); `git rev-parse` branch tip + `git log -1 --format=%H/%P/%s` + `git diff --name-only HEAD^ HEAD` (exits 0, quoted — post-commit legs quoted in the handoff report, never by editing this frozen ledger); no npx installs (tsc N/A honestly stated: zero `.ts` touched).
- Must leave: this file plus the ONE branch commit above (capable re-proof follows as a separate node; STOP honestly with drafts and the exact blocker if commit is impossible — commit proved possible, see F6).
- Must not touch: `main` ref, any tag, `README.md`/`README.ar.md` (r0919 seat), `AGENT.md`, `WORKFLOW.md`, any file outside `.opencode/audit/BUILD-0919/` and the branch commit, any other version branch. None touched.
- May read: V3:4519-4670, fallback-log line 31 (FBLD-19), `b0919-branch.md`, prior slot ledgers for shape only (never copied as evidence). All read as directed.
- State files: neither (leader-owned; this seat never wrote `AGENT.md`/`WORKFLOW.md`).

## F2 — Task-dispatcher classification + seat rule

- Classification: **Scenario 1 NEW TASK** (no 0.9.19 build task in flight on this seat; `b0919-branch.md` proves the version branch was cut local-only at the live `origin/main` tip).
- Seat rule applied: worker seat denies the Vanguard equip run (same seat law as the branch node); only the directed build concern was executed — spec + probe + ledger authored in the holder, one commit landed, proofs quoted, STOP. No dispatch of any other agent, no lead, no done-declaration.
- Single-writer: this seat owns only `b0919-build.md` plus the one branch commit's other two files (`workflow-category.md`, `verify-workflows-0919.mjs`); `b0919-branch.md` belongs to the branch node and is NOT in this commit.
- Binding: FULL (spec + probe are new code-bearing artifacts; FLOOR held by the 21-check self-test with trust-boundary validation; CEILING held — one self-contained probe, no mechanism split, no option or wrapper beyond the directed concern).

## F3 — Must-run commands (each run separately with `; echo "EXIT:$LASTEXITCODE"`, never `&&` chains; quoted exits)

All commands ran inside the holder `C:/Users/omarb/AppData/Local/Temp/opencode/b0919-build-holder` (on branch `wt/0.9.19-workflows-factory`) unless marked PRIMARY.

1. `git worktree add --detach C:/Users/omarb/AppData/Local/Temp/opencode/b0919-build-holder wt/0.9.19-workflows-factory` (PRIMARY) — output `HEAD is now at 763019e Merge branch 'wt/0.9.18-spawning-constitution' into main for v0.9.18` — quoted exit `EXIT:0`.
2. `git -C <holder> rev-parse HEAD` — output `763019ea23ba2fe47c98069c73944c1614a3f430` — quoted exit `EXIT:0` (holder at branch tip == parent, pre-write).
3. `git -C <holder> switch wt/0.9.19-workflows-factory` — output `Switched to branch 'wt/0.9.19-workflows-factory'` / `Your branch is up to date with 'origin/main'.` — quoted exit `EXIT:0`.
4. `node --check .opencode/audit/BUILD-0919/verify-workflows-0919.mjs` (as-authored) — no output — quoted exit `EXIT:0`.
5. `node .opencode/audit/BUILD-0919/verify-workflows-0919.mjs --self-test` (FAIL-first run, as-authored) — `checks: 20 pass, 1 fail, 21 total` / `LD19-DIGEST b3cdcdbd44f5eb821873b1b6f2c500fb4fccf01df3a4b261458ca5b8bd17b986` / `VERDICT: FAIL`, sole FAIL `install-honesty` — quoted exit `EXIT:1`. Recorded honestly (see F4 repair round).
6. `node -e` spec-regex debug (why the FAIL tripped) — `has-null true` / `has-unv true` / `npm-hits ["npm install <"]` at index 9991 (spec's own `npm install <name>` example tripped its own audit) — quoted exit `EXIT:0`.
7. `node -e` probe-self-hits debug — `probe-self-hits null` (probe source clean; only the spec example tripped) — quoted exit `EXIT:0`.
8. Two file edits (repair round 1, changed hypothesis, guards NOT weakened — see F4) — applied, no exit (editor reports, not shell).
9. `node --check .opencode/audit/BUILD-0919/verify-workflows-0919.mjs` (post-fix) — no output — quoted exit `EXIT:0`.
10. `node .opencode/audit/BUILD-0919/verify-workflows-0919.mjs --self-test` (post-fix run) — `checks: 21 pass, 0 fail, 21 total` / `LD19-DIGEST b544f236369b7d77067ad7cb130deab9afd11aa02308115870679886f407819f` / `VERDICT: PROCEED` — quoted exit `EXIT:0`.
11. `node -e` mkdtemp clean-copy (copied probe + spec to `C:\Users\omarb\AppData\Local\Temp\ld19-clean-dUXrKY\`) — printed the temp dir — quoted exit `EXIT:0`.
12. `node C:/Users/omarb/AppData/Local/Temp/ld19-clean-dUXrKY/verify-workflows-0919.mjs --self-test` (clean-copy stability run) — `checks: 21 pass, 0 fail, 21 total` / `LD19-DIGEST b544f236369b7d77067ad7cb130deab9afd11aa02308115870679886f407819f` / `VERDICT: PROCEED` — quoted exit `EXIT:0` (digest identical to leg 10).
13. `node -e` bytes-plus-SHA-256 over the 2 payload files — `.opencode/audit/BUILD-0919/workflow-category.md 10080 8649bc24de5e5d40f2ee48ff6dffe4ba015521e7b109c45c145163280e5d2327` / `.opencode/audit/BUILD-0919/verify-workflows-0919.mjs 14130 869123cfba3b89a37d8215ecb9f46330a371654db55995ef337b76687a1eae4d` — quoted exit `EXIT:0`.
14. `git rev-parse HEAD` (PRIMARY) — output `2a78995b88f9d0f5b89564397add338794b60c5f` — quoted exit `EXIT:0` (primary HEAD unmoved).
15. `git rev-parse main` (PRIMARY) — output `68f8186ba18c825819e890de2ef694560655c4f2` — quoted exit `EXIT:0` (local `main` unmoved).
16. tsc: NOT RUN as a command — N/A honestly stated (see F8): zero-dependency repo ships no local `tsc`, this change adds zero `.ts` files, and installs are forbidden on this lane. Stated, never passed off as green.
17. Post-commit legs (run after the ONE commit, quoted in the handoff report §Handoff, never by editing this frozen file): `git rev-parse wt/0.9.19-workflows-factory`, `git log -1 --format=%H/%P/%s wt/0.9.19-workflows-factory`, `git diff-tree --no-commit-id --name-only -r <tip>` — each quoted exit `EXIT:0` there.

## F4 — FAIL-first record + one repair round (max 2; guards never weakened)

- FAIL-first (leg 5): 20/21 PASS, 1 FAIL (`install-honesty`), exit 1, digest `b3cdcdbd44f5eb821873b1b6f2c500fb4fccf01df3a4b261458ca5b8bd17b986`. Root cause owned: the spec's own prose example `` `npm install <name>` `` (written to illustrate what is NOT invented) tripped the probe's own invented-install regex — the audit machinery matched its own pattern definition, exactly the LD-18 failure shape.
- Repair round 1 (ONE round, materially changed hypothesis, guards NOT weakened): (a) spec reworded to `no invented package-install command` so the forbidden contiguous text no longer appears in the spec; (b) probe builds the detection pattern from string parts (`new RegExp("np" + "m\\s+(i|install)\\s+\\S")`, runtime-identical pattern) so the machinery cannot match its own definition. Guard strength unchanged: any future prose carrying a real invented install command still fails.
- Post-fix run (leg 10): 21/21 PASS, exit 0, digest `b544f236369b7d77067ad7cb130deab9afd11aa02308115870679886f407819f`.
- Stability run from clean copy (leg 12): 21/21 PASS, exit 0, IDENTICAL digest `b544f236369b7d77067ad7cb130deab9afd11aa02308115870679886f407819f`.
- Circuit breaker: 0/3 strikes (one repair round with a changed hypothesis); zero 429/5xx observed.

## F5 — Landed file set (exact; bytes plus FULL 64-hex SHA-256 per file)

| File | Bytes | SHA-256 (FULL 64-hex, leg 13) |
|---|---|---|
| `.opencode/audit/BUILD-0919/workflow-category.md` | 10080 | `8649bc24de5e5d40f2ee48ff6dffe4ba015521e7b109c45c145163280e5d2327` |
| `.opencode/audit/BUILD-0919/verify-workflows-0919.mjs` | 14130 | `869123cfba3b89a37d8215ecb9f46330a371654db55995ef337b76687a1eae4d` |
| `.opencode/audit/BUILD-0919/b0919-build.md` | self | self SHA-256 + `git hash-object` outputs quoted in the handoff report (this file was not edited after its own freeze; payload rows above were measured pre-commit and the payloads were not edited after measurement) |

No other paths in the commit: no writes outside these three new files under `.opencode/audit/BUILD-0919/`. In particular: no `scripts/` writes, no README pair, no `AGENT.md`/`WORKFLOW.md`, no registry writes, no state files. `any` audit: zero `any` in the probe (all inputs narrowed: `isRecord` guards, `typeof` plus length checks, `instanceof Error` on caught values). Nothing to justify, nothing escalated.

## F6 — Commit record (ONE commit, exact message, exact parent)

- Message (exact): `feat(0.9.19): LD-19 workflows as factory category v1`.
- Parent: `763019ea23ba2fe47c98069c73944c1614a3f430` (branch tip at land time, re-proven leg 2; the 0.9.18 merge).
- Landed from the holder on `wt/0.9.19-workflows-factory` (work inside the holder only; primary checkout untouched): exactly ONE commit, 3 new files, zero other paths. Post-commit tip/log/diff legs are quoted in the handoff report (F9 handoff pointer) because this ledger file is frozen inside the commit it describes.
- Pre-commit branch state: `git -C <holder> rev-parse HEAD` → `763019ea23ba2fe47c98069c73944c1614a3f430` (leg 2, exit 0) == parent above.

## F7 — Coverage map (V3:4622-4627 all COVERED with probe-check pointers; V3:4628-4633 all six DECIDED in spec section 10 with probe evidence)

- 4622 malformed rejected mechanically: `loop-without-exit-rejected`, `missing-artifact-rejected`, `wait-without-wake-rejected` (mechanical validators, pre-human-judgement).
- 4623 narrative-vs-spec order checked automatically and rerunnably: `narrative-order-match-pass` + `narrative-order-mismatch-rejected` (string-array equality, non-author re-runnable via `--self-test`).
- 4624 plan + close changelog gates on a real task: `changelog-gates-real-task` (real task `t-real` with an actual change; both gates carry checks).
- 4625 real workflow accepted with an index entry carrying its version: `real-workflow-accepted-indexed` (kind `workflow`, version `1.0`, results + gatesPassed).
- 4626 every rejection logged, tombstones kept, risk classified before gates: `every-rejection-logged`, `tombstone-kept`, `risk-classified-before-gates`.
- 4627 one id stable across a version + one deleted step kept as tombstone: `stable-id-across-version`, `tombstone-kept`.
- 4628 DECIDED deferred (spec §10; probe `q4628-deferred`). 4629 DECIDED readable-tombstone rule with tombstone-index (probe `q4629-tombstone-index`). 4630 DECIDED release/user-data=high, shared/index=standard, docs-only=low, owner breaks disputes with recorded reason (probe `q4630-risk-criterion`). 4631 DECIDED declared-outside rule (probe `q4631-declared-outside`). 4632 DECIDED one evidence item per gate = the riskiest check, recorded (probe `q4632-low-sample`). 4633 DECIDED full-order check always (probe `q4633-full-order`).

## F8 — Prohibitions kept + N/A honesty (zero mutations beyond the ONE commit)

- `main` ref unmoved (`68f8186…`, legs PRIMARY 14-15 context); primary HEAD unmoved (`2a78995…`); no push/merge/tag/publish; no README pair; no `AGENT.md`/`WORKFLOW.md`/state-file writes; no other BUILD-0919 artifact (notably `b0919-branch.md` is NOT in this commit); no other version branch; no tag operation; no npx installs.
- tsc: UNVERIFIED as completed work — blocker: zero-dependency repo ships no local `tsc` and this change adds zero `.ts` files (2 Markdown + 1 `.mjs`); installs forbidden on this lane so no toolchain was fetched. Recorded honestly, never as a pass.
- Relative-link resolution: 0 markdown links by construction in the 2 new audit docs (all cross-refs carried as backticked paths), so 0 to resolve and 0 broken.
- documentation-as-tests: every executed claim in the new procedures ran for real — the probe recomputes mechanical rejection, narrative order, stable-id, tombstone, risk-tier, and changelog-gate checks live per run; no example trusted in prose.

## F9 — Verdict (PASS / FAIL / UNVERIFIED only) + handoff pointer

- Verdict: **PASS** — spec + self-test probe + this ledger authored in the holder; `node --check` exit 0; probe 21/21 PROCEED exit 0 on run AND clean-copy re-run with identical digest `b544f236369b7d77067ad7cb130deab9afd11aa02308115870679886f407819f` (FAIL-first 20/21 honestly recorded, one repair round with a changed hypothesis, guards intact); FULL 64-hex SHAs in F5; FBLD-19 carried verbatim (spec §11, probe `fbld19-honesty`); install_cmd null + unverified; primary HEAD and local `main` unmoved; exactly ONE commit with the exact message and parent on `wt/0.9.19-workflows-factory` containing exactly the 3 new files above.
- Handoff: this file to LEADER, plus the post-commit proof legs (`rev-parse` tip, `log -1 --format=%H/%P/%s`, `diff-tree --name-only`) quoted in the seat's closing report; capable re-proof follows as a separate node; no open, no publish, no merge beyond what the node authorized.

---

Ponytail: FULL — 21/21 probe PASS twice with identical digests plus FAIL-first repair round with a changed hypothesis (FLOOR); no abstraction, option, or wrapper beyond the directed concern (CEILING).
