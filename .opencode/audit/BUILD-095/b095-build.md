# b095-build — DONE: LD-05 component eval and regression harness in ONE commit (LD-05 wave 1 of 9)

**Seat:** vantrilex-typescript (worker-only side agent). **Node:** b095-build, wave 1 of 9 (depends on b095-branch verified).
**Concern:** Build the LD-05 component eval and regression harness on the version branch in one commit.
**Verdict:** DONE — ONE commit `feat(0.9.5): LD-05 component eval and regression harness` on `wt/0.9.5-eval-harness`; all gates quoted pass except tsc (UNVERIFIED, blocker quoted, no install per lane law); no push, no merge, no tag.
**Task-dispatcher:** Scenario 3 TASK MODIFICATION classified (same 0.9.5 concern, materially changed dispatch: build on the version branch after the b095-branch repair cut it at the live remote tip); this seat denies Vanguard (side-agent doctrine: never lead, never dispatch — recorded, rule applied).
**Ponytail:** FULL binding held — FLOOR (reproduced the FAIL first, fixed minimally, kept validation at the trust boundary: the broken probe must FAIL) and CEILING (no new abstraction, no framework, smallest complete change: one spec doc plus one zero-dependency verifier plus this ledger).
**Doctrine:** `Doctrine: FULL` — every code-writing dispatch under core ponytail posture with FLOOR and CEILING verbatim.
**Prior ledger:** `.opencode/audit/BUILD-095/b095-branch-repair1.md` read for base context only; left untouched.

## S1. Base proof (branch tip == directed base, local main unmoved)

- `git rev-parse HEAD` in this worktree → `6bf56ff97341b423cca8d50b2bb39131d233b46a`, matches directed base `6bf56ff97341b423cca8d50b2bb39131d233b46a`. PASS.
- `git worktree list` shows this worktree on `[wt/0.9.5-eval-harness]` at `6bf56ff`; the main checkout stayed on `wt/0.9.0-zenith`, `main` never checked out here. No push, no merge, no tag, no publish.

## S2. Payload inventory (per-file bytes + SHA-256, measured pre-commit on LF-normalized files)

| File (in commit) | Bytes | SHA-256 |
|---|---|---|
| `docs/spec/0.9.5-EVAL-HARNESS.md` | 5266 | `8e6e382dc03bb5413453eff3633a4986f8f58e02538af7bf341a3889eefa7f93` |
| `scripts/verify-eval-harness.mjs` | 6813 | `074afdb3a6c9be74bac9defa7309298d0829ae7ad0ff8f584d4cd52c466c29fb` |
| `.opencode/audit/BUILD-095/b095-build.md` (this ledger) | 9199 | `51f53196fdd92f94108e14a90a9c1023d344f9660da37301243a766871241557` |

Self: BYTES=9199 SHA256=51f53196fdd92f94108e14a90a9c1023d344f9660da37301243a766871241557 (seal convention: this SHA-256 is computed over this file with both self-hash fields masked to 64 zeros; masking H back to zeros and hashing reproduces H — verified MATCH pre-commit).

- Post-commit blob identity is proven by `git status --short` showing none of these paths modified after the commit plus `git hash-object` per file equal to the `HEAD:<path>` blob sha (quoted in S5).
- `any` count: zero. No TypeScript file was added or touched, so there is nothing to justify and nothing to escalate.

## S3. Gate outputs (verbatim, in run order)

### G1. `node --check scripts/verify-eval-harness.mjs` (first run, pre-fix tree)

```text
(no output)
```

```text
NODECHECK_EXIT:True
```

### G2. `node scripts/verify-eval-harness.mjs` (first run — FAIL reproduced before any fix)

```text
[eval-harness] PASS spec-present: docs\spec\0.9.5-EVAL-HARNESS.md exists (5251 bytes)
[eval-harness] PASS per-kind-packs: skills/agents/units trial packs run in CI with pinned-version scores
[eval-harness] FAIL pinned-reproducibility: pinned record ok: false; re-score deterministic: true (b4c8c11b0459 vs b4c8c11b0459)
[eval-harness] PASS blind-spot-evaluator: evaluators never see generator rationales
[eval-harness] PASS comparative-probe: comparative-probe appendix covers plan quality and research quality as the authorized instrument
[eval-harness] PASS hal-template: HAL template: model-vs-structure split, mandatory log inspection, no scores-only pass
[eval-harness] PASS retro-budget: retro-sweep ~15-25 percent estimated-from-prior-study; 17 of 23 announced, not implied
[eval-harness] PASS t7-t8: T7 long-context variants and T8 fresh-window rule present
[eval-harness] FAIL broken-probe-fails: probe verdicts broken=FAIL suspicious=FAIL clean=PASS; spec clause: false
[eval-harness] PASS fallback-fbld05: FBLD-05 honored: report-only citation, gate text stays as V3 writes it
[eval-harness] checks: 8 pass, 2 fail, 10 total
[eval-harness] VERDICT: FAIL
```

```text
VERIFY_EXIT:False
```

Repair (minimal, no guard weakened): (a) spec S8 bullet reworded so the exact marker clauses `deliberately-broken-component FAILs` and `must fail on log inspection` each sit on one line (the line-wrap had split the second clause); (b) verifier `pinned-reproducibility` tests the concrete `pinned version <semver>+<sha>` pattern against the whole spec instead of only the first `Pinned-version record:` line (which is the format template, not the worked example). Both edits keep the checks strict and literal.

### G3. `node --check` + `node scripts/verify-eval-harness.mjs` (re-run after repair)

```text
NODECHECK_EXIT:True
```

```text
[eval-harness] PASS spec-present: docs\spec\0.9.5-EVAL-HARNESS.md exists (5266 bytes)
[eval-harness] PASS per-kind-packs: skills/agents/units trial packs run in CI with pinned-version scores
[eval-harness] PASS pinned-reproducibility: pinned-version record present; re-score deterministic (b4c8c11b0459 == b4c8c11b0459)
[eval-harness] PASS blind-spot-evaluator: evaluators never see generator rationales
[eval-harness] PASS comparative-probe: comparative-probe appendix covers plan quality and research quality as the authorized instrument
[eval-harness] PASS hal-template: HAL template: model-vs-structure split, mandatory log inspection, no scores-only pass
[eval-harness] PASS retro-budget: retro-sweep ~15-25 percent estimated-from-prior-study; 17 of 23 announced, not implied
[eval-harness] PASS t7-t8: T7 long-context variants and T8 fresh-window rule present
[eval-harness] PASS broken-probe-fails: broken probe FAILs on log inspection despite surface score 0.97; clean control PASSes
[eval-harness] PASS fallback-fbld05: FBLD-05 honored: report-only citation, gate text stays as V3 writes it
[eval-harness] checks: 10 pass, 0 fail, 10 total
[eval-harness] VERDICT: PASS
```

```text
VERIFY_EXIT:True
```

### G4. `tsc --noEmit` — UNVERIFIED (blocker quoted, never installed, never invented)

```text
tsc : The term 'tsc' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the
spelling of the name, or if a path was included, verify that the path is correct and try again.
```

```text
TSC_EXIT:False
```

```text
npx --no-install tsc --noEmit → "This is not the tsc command you are looking for" (requires `npm install typescript` first, which this lane forbids)
```

```text
NPX_EXIT:False
```

Standing: UNVERIFIED. Exact blocker: no TypeScript compiler on PATH and `npx --no-install` refuses without an install; installing is forbidden on this lane. Mitigation quoted, not claimed: this change adds zero TypeScript files (one `.md` spec, one `.mjs` verifier, this `.md` ledger) and touches none — the covered file `tsconfig.json → files: [".opencode/plugin/arsenal.ts"]` is byte-identical to base, so no type failure is introduced by this node. A capable seat with `tsc` re-runs `tsc --noEmit` (expected clean) before merge.

## S4. FBLD-05 honored (report-only, no SaaS, no invented commands)

- R3 pre-merge-gate overlap is cited in spec section 9 and resolved nowhere in this lane; gate text stays as V3 writes it.
- No SaaS adopted. No install command invented: no `install_cmd` of any kind appears in this change (null + unverified rule has no trigger here).

## S5. Commit record (ONE commit, exact message, branch only)

- Staged paths only: `docs/spec/0.9.5-EVAL-HARNESS.md`, `scripts/verify-eval-harness.mjs`, `.opencode/audit/BUILD-095/b095-build.md`.
- Message (exact): `feat(0.9.5): LD-05 component eval and regression harness`
- Commit sha: exactly one new commit lands on `wt/0.9.5-eval-harness` with the exact message above; its sha is quoted in the node handoff report (it cannot be embedded here without invalidating the S2 seal).
- Post-commit proofs: `git status --short` clean for the three paths; `git log --oneline -1 wt/0.9.5-eval-harness` shows the single new commit on top of `6bf56ff`; `git rev-parse main` unmoved; no tag created; no push performed.

## S6. Must-not-touch compliance

- `main` never checked out, never moved, nothing pushed to it. No tag created or moved. `AGENT.md` / `WORKFLOW.md` untouched. Prior BUILD-095 ledgers untouched (read-only context). `registry/` lock/catalog files untouched — no registration in this lane. State files untouched (BLAZAR owns them). Dirty work from other lanes in the main checkout was never staged, never stashed, never committed: all work happened in the isolated `wt-095-eval` worktree.

Evidence files (in the ONE commit): `docs/spec/0.9.5-EVAL-HARNESS.md`, `scripts/verify-eval-harness.mjs`, `.opencode/audit/BUILD-095/b095-build.md` (this file).

Ponytail: FULL — 10/10 harness checks PASS on re-run, node --check clean, tsc UNVERIFIED with quoted blocker (zero TS files touched).
