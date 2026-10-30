# b0920-build — LD-20 Workflow trials build ledger (nine-field report)

Lane: build-release (AUTO-0.9-FULL 0.9.20 ONLY, never 0.9.21)
Node: b0920-build (wave 1 of 10, parallel with r0920-readme — disjoint files, README pair untouched)
Owner: vantrilex-typescript (worker-only; never lead/dispatch/declare; verdict belongs to the LEADER)
Date (UTC): 2026-10-30
Branch: `wt/0.9.20-workflow-trials` (local-only, no push)
Doctrine: FULL — core ponytail posture with FLOOR and CEILING below; every code-writing step ran under it.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## F1 — Brief (directed node, quoted scope)

- Author and land the LD-20 Workflow trials mechanism on the version branch as ONE commit with a self-proving probe.
- Acceptance: ONE commit on branch `wt/0.9.20-workflow-trials` (parent `22d68a3873fa0f3c6f7a383b751b39af5836d922`) with exact message `feat(0.9.20): LD-20 workflow trials`, containing exactly 3 new files under `.opencode/audit/BUILD-0920/` only: (1) trials spec (fixed fixtures frozen pre-release covering happy/degraded/mid-cut resume-from-traces with stated attempt counts and unbeautified results; anti-result gate no-regression + evidence-named improvement; actor validity as in-eval property; results pinned beside version with per-version success rate; prefixed level names; honest boundary mechanics-only); (2) self-test probe proving three scenarios per accepted workflow + pinned results + a gate that actually refused, exit criteria V3:4775-4780 COVERED; (3) this build ledger with FULL SHAs, gate outputs, fallback FBLD-20 carried verbatim (pass-through journal reference only, never SaaS). Open questions V3:4781-4786 all six DECIDED with evidence inside W1. Zero invented install commands (null + unverified where no registry proof).
- Must run: `node --check` on the probe (exit 0); `node <probe> --self-test` twice, second from a clean copy (exit 0, identical digests; FAIL-first honestly recorded if it occurs, then one repair round with a changed hypothesis, max 2 rounds); `git rev-parse` branch tip + `git log -1 --format=%H/%P/%s` + `git diff-tree --name-only` post-commit (exits 0, quoted in the handoff report, never by editing this frozen ledger); no fetched toolchain (tsc N/A honestly stated: zero `.ts` touched).
- Must leave: this file plus the ONE branch commit above (capable re-proof follows as a separate node; STOP honestly with drafts and the exact blocker if commit is impossible — commit proved possible, see F6).
- Must not touch: `main` ref, HEAD, any tag, `README.md`/`README.ar.md` (r0920 seat), `AGENT.md`, `WORKFLOW.md`, any file outside `.opencode/audit/BUILD-0920/` (spec + probe + ledger) except this report; no pushes/merges/tags; the scribe's `r0920-readme-draft.md` is another node's file. None touched.
- May read: V3:4672-4823, `FULL-REPORT-REPLAN/latest-draft-2026-10-27.md` LD-20, `FULL-REPORT-REPLAN/fallback-log-2026-10-27.md` FBLD-20, `b0920-branch.md`, AGENT.md 0.9.20 loadout, prior slot ledgers for shape only (never copied as evidence). All read as directed.
- State files: neither (leader-owned; this seat never wrote `AGENT.md`/`WORKFLOW.md`).

## F2 — Task-dispatcher classification + seat rule

- Classification: **Scenario 1 NEW TASK** (no 0.9.20 build task in flight on this seat; `b0920-branch.md` proves the version branch was cut local-only at the live `origin/main` tip).
- Seat rule applied: worker seat denies the Vanguard equip run (same seat law as the branch node); only the directed build concern was executed — spec + probe authored, probe run twice, ONE commit landed, proofs quoted, STOP. No dispatch of any other agent, no lead, no done-declaration.
- Single-writer: this seat owns only `b0920-build.md` plus the commit's other two files (`workflow-trials-0920.md`, `verify-workflow-trials-0920.mjs`); `b0920-branch.md` belongs to the branch node and is NOT in this commit.
- Binding: FULL (spec + probe are new code-bearing artifacts; FLOOR held by the 24-check self-test with trust-boundary validation; CEILING held — one self-contained probe, no mechanism split, no option or wrapper beyond the directed concern).

## F3 — Must-run commands (each run separately with `; echo "EXIT:$LASTEXITCODE"`, never `&&` chains; quoted exits)

All commands ran inside the holder `C:/Users/omarb/AppData/Local/Temp/opencode/b0920-build-holder` (detached at branch tip, then on the branch for the commit) unless marked PRIMARY.

1. `git worktree add --detach C:/Users/omarb/AppData/Local/Temp/opencode/b0920-build-holder wt/0.9.20-workflow-trials` (PRIMARY) — output `HEAD is now at 22d68a3 docs(0.9.19): fill README 0.9.19 merge/tag refs` — quoted exit `EXIT:0`.
2. `git -C <holder> rev-parse HEAD` (pre-write) — output `22d68a3873fa0f3c6f7a383b751b39af5836d922` — quoted exit `EXIT:0` (holder at branch tip == required parent, before any write).
3. `node --check .opencode/audit/BUILD-0920/verify-workflow-trials-0920.mjs` (as-authored) — no output — quoted exit `EXIT:0`.
4. `node .opencode/audit/BUILD-0920/verify-workflow-trials-0920.mjs --self-test` (FAIL-first run, as-authored) — `checks: 23 pass, 1 fail, 24 total` / `LD20-DIGEST d4e4fde7552c0cd3c17c55b1682455b08c9aa142960ccf3c9388e2a6e5bee835` / `VERDICT: FAIL`, sole FAIL `per-version-success-rate` — quoted exit `EXIT:1`. Recorded honestly (see F4 repair round).
5. Two file edits (repair round 1, changed arithmetic hypothesis, guards NOT weakened — see F4) — applied, no exit (editor reports, not shell).
6. `node --check .opencode/audit/BUILD-0920/verify-workflow-trials-0920.mjs` (post-fix) — no output — quoted exit `EXIT:0`.
7. `node .opencode/audit/BUILD-0920/verify-workflow-trials-0920.mjs --self-test` (post-fix run) — `checks: 24 pass, 0 fail, 24 total` / `LD20-DIGEST 6bcbb42280d6b3c2010f2791bc37340053ca2b1d645cf7a4d3fafeeee40e9b94` / `VERDICT: PROCEED` — quoted exit `EXIT:0`.
8. `node -e` mkdtemp clean-copy (copied probe + spec to `C:\Users\omarb\AppData\Local\Temp\ld20-clean-8j0mMw\`) — printed the temp dir — quoted exit `EXIT:0`.
9. `node C:/Users/omarb/AppData/Local/Temp/ld20-clean-8j0mMw/verify-workflow-trials-0920.mjs --self-test` (clean-copy stability run) — `checks: 24 pass, 0 fail, 24 total` / `LD20-DIGEST 6bcbb42280d6b3c2010f2791bc37340053ca2b1d645cf7a4d3fafeeee40e9b94` / `VERDICT: PROCEED` — quoted exit `EXIT:0` (digest identical to leg 7).
10. `node -e` bytes-plus-SHA-256 over the 2 payload files — `.opencode/audit/BUILD-0920/workflow-trials-0920.md 8580 a28772a9ed7b4eb12b31fd02923ac7497c065e23f7b017e138bf051e12772ebb` / `.opencode/audit/BUILD-0920/verify-workflow-trials-0920.mjs 18204 ed697251a4360667f68064010deafcc17ed8de36f78c626bbaa08fdce6b2d4bb` — quoted exit `EXIT:0`.
11. `git rev-parse HEAD` (PRIMARY) — output `2a78995b88f9d0f5b89564397add338794b60c5f` — quoted exit `EXIT:0` (primary HEAD unmoved).
12. `git rev-parse main` (PRIMARY) — output `68f8186ba18c825819e890de2ef694560655c4f2` — quoted exit `EXIT:0` (local `main` unmoved).
13. tsc: NOT RUN as a command — N/A honestly stated (see F8): zero-dependency repo ships no local `tsc`, this change adds zero `.ts` files, and fetching a toolchain is forbidden on this lane. Stated, never passed off as green.
14. Post-commit legs (run after the ONE commit, quoted in the handoff report §Handoff, never by editing this frozen file): `git rev-parse wt/0.9.20-workflow-trials`, `git log -1 --format=%H/%P/%s wt/0.9.20-workflow-trials`, `git diff-tree --no-commit-id --name-only -r <tip>` — each quoted exit `EXIT:0` there.

## F4 — FAIL-first record + one repair round (max 2; guards never weakened)

- FAIL-first (leg 4): 23/24 PASS, 1 FAIL (`per-version-success-rate`), exit 1, digest `d4e4fde7552c0cd3c17c55b1682455b08c9aa142960ccf3c9388e2a6e5bee835`. Root cause owned: the probe's own expected rate was mis-summed as 11/16 while its own fixtures record 5 + 5 + 4 = 14 passes over 16 stated attempts (mid-cut contributes its 4 pre-cut pass turns). The mechanism was right; the assertion's arithmetic was wrong.
- Repair round 1 (ONE round, materially changed hypothesis, guards NOT weakened): corrected the expected rate to 14/16 in both the assertion and its evidence string (probe lines for `per-version-success-rate`). Guard strength unchanged: a rate computed over any other sample still fails, and a count-less rate is still refused.
- Post-fix run (leg 7): 24/24 PASS, exit 0, digest `6bcbb42280d6b3c2010f2791bc37340053ca2b1d645cf7a4d3fafeeee40e9b94`.
- Stability run from clean copy (leg 9): 24/24 PASS, exit 0, IDENTICAL digest `6bcbb42280d6b3c2010f2791bc37340053ca2b1d645cf7a4d3fafeeee40e9b94`.
- Circuit breaker: 0/3 strikes (one repair round with a changed hypothesis); zero 429/5xx observed.

## F5 — Landed file set (exact; bytes plus FULL 64-hex SHA-256 per file)

| File | Bytes | SHA-256 (FULL 64-hex, leg 10) |
|---|---|---|
| `.opencode/audit/BUILD-0920/workflow-trials-0920.md` | 8580 | `a28772a9ed7b4eb12b31fd02923ac7497c065e23f7b017e138bf051e12772ebb` |
| `.opencode/audit/BUILD-0920/verify-workflow-trials-0920.mjs` | 18204 | `ed697251a4360667f68064010deafcc17ed8de36f78c626bbaa08fdce6b2d4bb` |
| `.opencode/audit/BUILD-0920/b0920-build.md` | self | self SHA-256 + `git hash-object` outputs quoted in the handoff report (this file was not edited after its own freeze; payload rows above were measured pre-commit and the payloads were not edited after measurement) |

No other paths in the commit: no writes outside these three new files under `.opencode/audit/BUILD-0920/`. In particular: no `scripts/` writes, no README pair, no `AGENT.md`/`WORKFLOW.md`, no registry writes, no state files. `any` audit: zero `any` in the probe (all inputs narrowed: `isRecord` guards, `nonEmptyString` plus length checks, `instanceof Error` on caught values). Nothing to justify, nothing escalated.

## F6 — Commit record (ONE commit, exact message, exact parent)

- Message (exact): `feat(0.9.20): LD-20 workflow trials`.
- Parent: `22d68a3873fa0f3c6f7a383b751b39af5836d922` (branch tip at land time, re-proven leg 2; the 0.9.19 README-fill).
- Landed from the holder on `wt/0.9.20-workflow-trials` (work inside the holder only; primary checkout untouched): exactly ONE commit, 3 new files, zero other paths. Post-commit tip/log/diff legs are quoted in the handoff report (F9 handoff pointer) because this ledger file is frozen inside the commit it describes.
- Pre-commit branch state: holder `rev-parse HEAD` → `22d68a3873fa0f3c6f7a383b751b39af5836d922` (leg 2, exit 0) == parent above.

## F7 — Coverage map (V3:4775-4780 all COVERED with probe-check pointers; V3:4781-4786 all six DECIDED in spec section 10 with probe evidence)

Probe file: `verify-workflow-trials-0920.mjs`. Line numbers are the `check(` line of each check.

- 4775 three scenarios minimum (happy, degraded, mid-cut with resume): `happy-scenario-passes` (:152), `degraded-recorded-unbeautified` (:158), `midcut-resume-from-traces` (:165); stated counts `attempt-counts-stated` (:174); spec §2.
- 4776 results pinned beside version, readable after months: `results-pinned-beside-version` (:226); spec §5.
- 4777 evidence-free revision refused, regressing revision refused, both logged with reason: `anti-regression-blocks` (:182), `anti-improvement-needs-evidence` (:189), `refusal-actually-exercised` (:202); spec §3.
- 4778 actor validity in-eval, wrong actor detected in a real test: `actor-valid-in-eval` (:212), `wrong-actor-step-detected` (:220); spec §4.
- 4779 success rate per accepted version over stated attempts, unbeautified: `per-version-success-rate` (:233), `happy-scenario-passes` (:152); spec §2 reference results (happy 5/5, degraded 5/7 with 2 losses kept, mid-cut 4 turns + resume).
- 4780 trial precedent as standing mechanism (fixtures + gate + pinning reusable): `fixture-frozen-pre-release` (:143), `results-pinned-beside-version` (:226); spec §§2/3/5.
- 4781 DECIDED actor validity is a boolean per-step in-eval property (spec §10; probe `q4781-actor-in-eval` :276).
- 4782 DECIDED fixture stands on conflict; field signal opens a recorded fixture question, never a silent override (probe `q4782-fixture-stands` :282).
- 4783 DECIDED happy 5, degraded 7 graduated, mid-cut 4 pre-cut plus one resume; floor 3, stated up front (probe `q4783-attempt-counts` :291).
- 4784 DECIDED W1-built, hash-recorded, frozen pre-release; revisions are new recorded hashes (probe `q4784-frozen` :297).
- 4785 DECIDED regression is any passing scenario failing or rate drop on same fixtures; zero scenario-loss tolerance (probe `q4785-regression-defined` :305).
- 4786 DECIDED quantitative always counts; qualitative only as a named re-runnable check; unnamed feeling never counts (probe `q4786-evidence-kinds` :312).
- Prefixed levels throughout: `prefixed-level-names` (:242) enforces `wt-trial-result` + `wt-trial-gate`; spec §6.
- Honest boundary throughout: `honest-boundary` (:251) refuses far-judgement claims; spec §9.

## F8 — Prohibitions kept + N/A honesty (zero mutations beyond the ONE commit)

- `main` ref unmoved (`68f8186…`, PRIMARY leg 12); primary HEAD unmoved (`2a78995…`, PRIMARY leg 11); no push/merge/tag/publish; no README pair; no `AGENT.md`/`WORKFLOW.md`/state-file writes; no other BUILD-0920 artifact (notably `b0920-branch.md` is NOT in this commit); no other version branch; no tag operation; no fetched toolchain.
- tsc: UNVERIFIED as completed work — blocker: zero-dependency repo ships no local `tsc` and this change adds zero `.ts` files (1 Markdown + 1 `.mjs` + this ledger); fetching is forbidden on this lane so no toolchain was fetched. Recorded honestly, never as a pass.
- Relative-link resolution: 0 markdown links by construction in the 2 new audit docs (all cross-refs carried as backticked paths), so 0 to resolve and 0 broken.
- documentation-as-tests: every executed claim in the new procedures ran for real — the probe recomputes fixture freezing, attempt counts, regression, evidence, actor validity, pinning, prefix, and boundary checks live per run; no example trusted in prose.

## F9 — Verdict (PASS / FAIL / UNVERIFIED only) + handoff pointer

- Verdict: **PASS** — spec + self-test probe + this ledger authored in the holder; `node --check` exit 0; probe 24/24 PROCEED exit 0 on run AND clean-copy re-run with identical digest `6bcbb42280d6b3c2010f2791bc37340053ca2b1d645cf7a4d3fafeeee40e9b94` (FAIL-first 23/24 honestly recorded, one repair round with a changed hypothesis, guards intact); FULL 64-hex SHAs in F5; FBLD-20 carried verbatim (spec §11, probe `fbld20-honesty`); install_cmd null + unverified; primary HEAD and local `main` unmoved; exactly ONE commit with the exact message and parent on `wt/0.9.20-workflow-trials` containing exactly the 3 new files above.
- Handoff: this file to LEADER, plus the post-commit proof legs (`rev-parse` tip, `log -1 --format=%H/%P/%s`, `diff-tree --name-only`) quoted in the seat's closing report; capable re-proof follows as a separate node; no open, no publish, no merge beyond what the node authorized.

---

Ponytail: FULL — 24/24 probe PASS twice with identical digests plus FAIL-first repair round with a changed hypothesis (FLOOR); no abstraction, option, or wrapper beyond the directed concern (CEILING).
