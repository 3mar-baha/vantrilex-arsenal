# b0927-build — LD-27 eval packs as a category with tested evaluators (wave 1 of 9)

Lane: build-release (AUTO-0.9-FULL 0.9.27, twenty-seventh of 33; this dispatch covers 0.9.27 ONLY, never 0.9.28)
Node: b0927-build (wave 1 of 9, parallel with r0927-readme-draft; disjoint write targets — this seat owns ONLY the three files below)
Owner: vantrilex-typescript (worker-only; never lead, never dispatch, never declare done)
Doctrine: FULL
Date (UTC): 2026-10-31. No model pin. State files: neither (leader-owned; this seat writes no state file).
Task-dispatcher: Scenario 1 NEW TASK (no 0.9.27 build in flight in this seat; no Vanguard equip run from worker seat — seat denies the skill, recorded per rule; executed the directed concern only).
May-read: live branch tip `1c4039765e770573eedccddc59f8adfde6c75299` (base only, re-proven §S1, never assumed); V3 LD-27 slot lines 5748-5900 (treatment + exit criteria + open questions, carried as data); latest-draft LD-27 line 63 + fallback FBLD-27 line 39 (no LD-27/FBLD-27 file exists in the tree at base — searched, absent; V3 is the sole authority and the brief conflict/fallback shape plus the cited log line are the sole FBLD-27 evidence, carried verbatim §S6, never resolved); `.opencode/audit/BUILD-0927/b0927-branch.md` (base refs only).
Acceptance: all hold per sole-authority V3:5748-5900 — (1) pack formula task+fixture+evaluator+version+index-link (spec §1, V3:5898); evaluator pre-acceptance test vs known-good + known-broken with reject-on-pass-broken AND reject-on-reject-good (spec §2, V3:5862/5865/5896); difficulty-from-measured-rates-only with schema-level impossible-without-measure guard proven by refused write attempts (spec §3, V3:5863/5890); calibration-with-healthy-variance rule no-all-zero/no-all-hundred (spec §4, V3:5864/5893); integration recipes as host-version-pinned fast-expiring skill subtype, no new kind (spec §6, V3:5867/5894); bilateral index links checked both sides (spec §5, V3:5866/5891); (2) verify script `scripts/verify-eval-packs.mjs` exits 0 PROCEED with 26 checks covering every exit criterion (§S3-G2); (3) all 19 V3 exit criteria V3:5862-5867 + V3:5887-5899 COVERED with per-criterion evidence (§S4); all 19 open questions V3:5868-5886 DECIDED inside W1 with file:line evidence (§S5), never left open, never invented; conflict FLAGGED vs R3 ensemble-evaluation breadth with fallback FBLD-27 verbatim (lean cite, never widened — never resolved) (§S6); (4) null-only installs (no invented install_cmd; §8 of the spec, zero registry/catalog/sidecar writes here); (5) no push/merge/tag/publish; primary HEAD/main unmoved (§S1, §S7).

## S1. Base proof + holder routing (primary HEAD and local main never moved, dirt untouched, no push)

- `git rev-parse wt/0.9.27-eval-packs` (holder seat, pre-work) — EXIT:0 — FULL `1c4039765e770573eedccddc59f8adfde6c75299` (directed base = directed parent, never assumed).
- Holder: attached worktree at `C:/Users/omarb/AppData/Local/Temp/opencode/b0927-build-holder` created with `git worktree add <holder> wt/0.9.27-eval-packs` — EXIT:0 — holder HEAD == base EXACT; primary checkout never entered here, no commit/push/merge/tag beyond the one directed commit, dirt untouched.
- Post-commit proofs (quoted in handoff): `git log -1 --format=%H/%P/%s` tip/parent/exact-message, `git status --porcelain=v1` (holder, pre-commit: exactly the 3 new files), primary `git rev-parse HEAD` + `refs/heads/main` unmoved, `git tag --list v0.9.27` empty, no push.

## S2. Payload inventory (exactly 3 NEW files, nothing else)

| File (in commit) | Bytes | SHA-256 |
|---|---|---|
| `.opencode/evals/eval-packs.md` | 11040 | `B4E300304B87A78C162FDBC516C13039CF1CF21FF19D2A0CE463A3232C30F675` |
| `scripts/verify-eval-packs.mjs` | 15665 | `33B5A772E6EE3372A2E079296ABE36D714DB3441900A08087CEE32DA7F6612B7` |
| `.opencode/audit/BUILD-0927/b0927-build.md` (this ledger) | <ledger bytes + sha quoted in handoff; computed pre-commit, post-commit blob identity via `hash-object == HEAD:<path>`> | — |

`any` count: zero — no TypeScript file was added or touched, so there is nothing to justify and nothing to escalate (`tsc` N/A per §S3-G4, stated, never claimed as a pass).

## S3. Gate outputs (each run separately, exits quoted individually, no `&&` chains)

FAIL-first (honestly recorded, repair round 1 of max 2, guards never weakened):

```text
[eval-packs] FAIL rejection-recorded: always-pass rejection recorded, temporary false
[eval-packs] FAIL all-zero-reformulated: 0/12 x 3 levels -> REFORMULATE-ALL-ZERO
[eval-packs] FAIL recipe-fast-expiry: IR-01 expires 2026-12-29 (59d, fresh); NEAR != EXPIRED distinct
[eval-packs] checks: 23 pass, 3 fail, 26 total
[eval-packs] VERDICT: REJECT  (exit 1)
```

Changed hypothesis: the harness logic was wrong, the spec wording was right —
(1) `rejection-recorded` asserted the doc token `never a warning`, but the spec
carries `a warning and never a temporary` on one line (spec:55); (2)
`all-zero-reformulated` asserted `all zero`, but the spec carries hyphenated
`all-zero` (spec:91); (3) `recipe-fast-expiry` compared two booleans with
`!==` (always false when both hold) instead of comparing the two state tokens.
Repaired by fixing the three harness lines (doc tokens matched verbatim, token
comparison `nearTok !== expiredTok`); check logic semantics untouched, no
threshold lowered, no weakening. Re-run: 26/26 PROCEED (§S3-G2). Repair rounds
consumed: 1 of max 2.

### G1. `node --check scripts/verify-eval-packs.mjs` — EXIT:0 (no output; syntax clean)

### G2. `node scripts/verify-eval-packs.mjs` (run) — EXIT:0 PROCEED, 26/26

```text
[eval-packs] PASS doc-present: spec readable, formula section present
[eval-packs] PASS pack-formula-complete: EP-01 task+fixture+evaluator+version+index-link all present
[eval-packs] PASS no-pack-without-tested-evaluator: EP-01 evaluator E-01 pre-acceptance ACCEPTED
[eval-packs] PASS no-evaluator-without-two-fixtures: E-01 carries F-good + F-bad (2/2)
[eval-packs] PASS evaluator-accepts-known-good: F-good output -> ACCEPT
[eval-packs] PASS evaluator-rejects-known-broken: F-bad output (BROKEN marker) -> REJECT
[eval-packs] PASS pass-broken-evaluator-rejected: always-pass evaluator -> REJECTED (passes-known-broken)
[eval-packs] PASS reject-good-evaluator-rejected: always-reject evaluator -> REJECTED (rejects-known-good)
[eval-packs] PASS rejection-recorded: always-pass rejection recorded, temporary false
[eval-packs] PASS test-record-preserved: E-01 good ACCEPT + bad REJECT recorded, matches gate
[eval-packs] PASS fixtures-preserved: F-good + F-bad hashes match pins (06dca2f67a3b... / 34db06c2d2c7...)
[eval-packs] PASS difficulty-label-shape: measured mean 0.583 -> difficulty:medium (e1.0 v1)
[eval-packs] PASS difficulty-without-measure-refused: empty rates + null rates both throw REFUSED-WRITE-WITHOUT-MEASURE
[eval-packs] PASS difficulty-bound-to-version: label pins e1.0 v1 beside the version
[eval-packs] PASS carry-demands-remeasure: v1 label to v2 -> REMEASURE-REQUIRED; same version carries
[eval-packs] PASS calibration-healthy-variance: 3 levels x 12 trials spread 0.750 >= 0.25 -> HEALTHY
[eval-packs] PASS all-zero-reformulated: 0/12 x 3 levels -> REFORMULATE-ALL-ZERO
[eval-packs] PASS all-hundred-reformulated: 12/12 x 3 levels -> REFORMULATE-ALL-HUNDRED
[eval-packs] PASS calibration-recorded: EP-01 v1 calibration recorded: 3 levels spread 0.750
[eval-packs] PASS bilateral-links-both-sides: EP-01 -> workflow-trials AND workflow-trials -> EP-01
[eval-packs] PASS index-complete: 1/1 accepted packs indexed (EP-01)
[eval-packs] PASS recipe-host-version-visible: IR-01 host-version 0.9.27 visible at load
[eval-packs] PASS recipe-skill-subtype-no-new-kind: IR-01 kind skill / subtype integration-recipe
[eval-packs] PASS recipe-fast-expiry: IR-01 expires 2026-12-29 (59d, fresh); NEAR != EXPIRED distinct
[eval-packs] PASS workflow-trial-consumption: T-01 on E-01: F-good ACCEPT + F-bad REJECT
[eval-packs] PASS seed-passes-all-gates: EP-01 formula+tested-evaluator+healthy-calibration+bilateral+recipe+0-exemptions
[eval-packs] checks: 26 pass, 0 fail, 26 total
[eval-packs] digest: 186abcb3bf7ed9562a641c5ca0d4801643f37fadc94a7056506990036b8c76ee
[eval-packs] VERDICT: PROCEED
```

Run + re-run digest-identical: SHA-256 `186abcb3bf7ed9562a641c5ca0d4801643f37fadc94a7056506990036b8c76ee` both runs.

### G3. Negative control (harness fails closed, not vacuous) — EXIT:1 REJECT with doc moved aside, then restored

```text
[eval-packs] FAIL doc-present: cannot read .opencode/evals/eval-packs.md
[eval-packs] checks: 0 pass, 1 fail, 1 total
[eval-packs] VERDICT: REJECT
```

Restore + clean re-run — EXIT:0 PROCEED, 26/26, output digest-identical to run and re-run (`186abc…` all three).

### G4. `tsc --noEmit` — N/A (zero `.ts` files added or touched on this node; the covered file `tsconfig.json -> files: [".opencode/plugin/arsenal.ts"]` is byte-identical to base, so no type failure is introduced). Stated, never claimed as a pass.

### G5. `git status --porcelain=v1` (holder, pre-commit) — exactly the 3 new files

```text
?? .opencode/audit/BUILD-0927/b0927-build.md
?? .opencode/evals/eval-packs.md
?? scripts/verify-eval-packs.mjs
```

### G6. `git log --oneline -1` + `git status --porcelain` on the branch (post-commit) — tip/parent/exact-message/count quoted in handoff

## S4. Exit-criteria coverage (all 19 V3 criteria COVERED; spec file:line + harness check:line)

First set V3:5862-5867:

- V3:5862 (broken-passing pack rejected, no exception) — COVERED: spec §2:53-57 (`a warning and never a temporary acceptance`); harness `pass-broken-evaluator-rejected` (harness:211) + `rejection-recorded` (harness:231).
- V3:5863 (difficulty without measured rates unwritable; schema-level impossibility) — COVERED: spec §3:74-78 (throws `REFUSED-WRITE-WITHOUT-MEASURE`); harness `difficulty-without-measure-refused` (harness:283) proves it with two refused write attempts (empty + null rates).
- V3:5864 (calibration with healthy variance per accepted pack; no all-zero/no all-hundred) — COVERED: spec §4:86-94 (spread ≥ 0.25, 3 levels × 4+ trials); harness `calibration-healthy-variance` (harness:316) + `all-zero-reformulated` (harness:326) + `all-hundred-reformulated` (harness:336).
- V3:5865 (good-rejecting evaluator also rejected) — COVERED: spec §2:49-52; harness `reject-good-evaluator-rejected` (harness:221) + `evaluator-accepts-known-good` (harness:195).
- V3:5866 (bilateral links both ways) — COVERED: spec §5:110-114; harness `bilateral-links-both-sides` (harness:359).
- V3:5867 (every recipe carries host version + expiry visible at load) — COVERED: spec §6:125-131; harness `recipe-host-version-visible` (harness:378) + `recipe-fast-expiry` (harness:399).

Second set V3:5887-5899:

- V3:5887 (known fixtures preserved unmodified, reviewer-inspectable) — COVERED: spec §1:25-28 + §7:154-156 (hash-pinned); harness `fixtures-preserved` (harness:252, live hash-vs-pin compare).
- V3:5888 (every accepted evaluator tested vs good+bad, record preserved) — COVERED: spec §2:46-47; harness `test-record-preserved` (harness:242) + `evaluator-accepts-known-good`/`evaluator-rejects-known-broken` (harness:195/202).
- V3:5889 (every difficulty bound to measured version, none carried without measure) — COVERED: spec §3:80-84; harness `difficulty-bound-to-version` (harness:295) + `carry-demands-remeasure` (harness:305).
- V3:5890 (schema-level impossibility proven by refused write) — COVERED: spec §3:74-78; harness `difficulty-without-measure-refused` (harness:283, two live `throw` proofs).
- V3:5891 (bilateral link checked from both sides, no one-way link) — COVERED: spec §5:110-114; harness `bilateral-links-both-sides` (harness:359, pack-side AND component-side asserts).
- V3:5892 (one workflow trial on tested evaluators as consumption proof) — COVERED: spec §7:152 (Trial T-01); harness `workflow-trial-consumption` (harness:410).
- V3:5893 (non-discriminating pack reformulated, none accepted flat) — COVERED: spec §4:90-94; harness `all-zero-reformulated` (harness:326) + `all-hundred-reformulated` (harness:336).
- V3:5894 (all recipes host-version-tagged, none untagged) — COVERED: spec §6:125-131; harness `recipe-host-version-visible` (harness:378) + `recipe-skill-subtype-no-new-kind` (harness:385).
- V3:5895 (category fully visible in index, none outside) — COVERED: spec §5:112-113; harness `index-complete` (harness:370).
- V3:5896 (broken-passing evaluator rejected with record, not warning/temp) — COVERED: spec §2:53-57; harness `pass-broken-evaluator-rejected` (harness:211) + `rejection-recorded` (harness:231, `temporary: false` asserted).
- V3:5897 (every accepted calibration recorded with variance, none claimed-without-record) — COVERED: spec §4:86; harness `calibration-recorded` (harness:348, live spread recompute vs record).
- V3:5898 (every accepted pack has the full formula) — COVERED: spec §1:18-42; harness `pack-formula-complete` (harness:167) + `seed-passes-all-gates` (harness:434).
- V3:5899 (no pack without tested evaluator, no evaluator without two fixtures) — COVERED: spec §1:29-34 + §7:158-159; harness `no-pack-without-tested-evaluator` (harness:177) + `no-evaluator-without-two-fixtures` (harness:187).

## S5. Open-question dispositions (all 19 V3:5868-5886 DECIDED inside W1; decision + file:line each; none left open, none invented)

- V3:5868 (bilateral-link discipline) — DECIDED: the index owns both directions; every link is read pack→component AND component→pack by the gate. Evidence: spec §5:110-114; harness:359.
- V3:5869 (pack versioning when measured components change) — DECIDED: component change forces a new pack version with rebuild + re-measure + re-pin; the old label is never carried. Evidence: spec §4:96-99 (SUSPEND + new version); harness:305 (`REMEASURE-REQUIRED`).
- V3:5870 (fixture re-review on component change; who decides stale) — DECIDED: fixture-hash drift auto-marks the pack SUSPENDED; the reviewer running this harness confirms stale-or-current before re-admit. Evidence: spec §7:161-164; harness:252 (drift compare).
- V3:5871 (difficulty re-measured per version vs carried) — DECIDED: re-measured per version, never carried. Evidence: spec §3:80-84; harness:305.
- V3:5872 (evaluator passing a non-listed defect: failure or fixture gap) — DECIDED: fixture gap, not evaluator failure — evaluator stays accepted, fixtures extend, pack takes a new version. Evidence: spec §2:58-62; the arbiter is the `defect-known` flag (harness:87-93 fixture definitions).
- V3:5873 (healthy-variance bar vs measurement noise) — DECIDED: spread ≥ 0.25 AND ≥ 3 levels AND ≥ 4 trials per level; a spread on fewer trials does not count. Evidence: spec §4:95-97; harness:100-117 (`MIN_SPREAD`, `MIN_LEVELS`, `MIN_TRIALS_PER_LEVEL`).
- V3:5874 (pack measuring a changed component: suspend vs recalibrate) — DECIDED: SUSPENDED from the index on drift, re-admitted only by recalibration under a new version. Evidence: spec §4:98-101.
- V3:5875 (fixture ownership; tamper-proofing vs weak-evaluator flattery) — DECIDED: fixtures owned by the category file + harness, hash-pinned; any edit breaks the pin and fails the gate. Evidence: spec §7:154-156; harness:252.
- V3:5876 (recipe host-version pinning in practice; what happens at host end) — DECIDED: recipe prints `host-version:` + `expires:` at load; at host end the recipe ends with it, and past expiry the loader refuses with `[eval-packs] EXPIRED`. Evidence: spec §6:125-135; harness:378/399.
- V3:5877 (workflow trials sole first consumer vs wider consumption) — DECIDED: workflow trials are the proven first consumer (T-01); later acceptances may consume too — none blocked, none required. Evidence: spec §7:159-161; harness:410.
- V3:5878 (fixture independence; who stops flattering edits) — DECIDED: same pin mechanism as V3:5875 — independence is proven by hash equality pre/post, and the breaker is the gate, not a person. Evidence: spec §7:154-156; harness:252.
- V3:5879 (calibration sample adequacy; levels) — DECIDED: ≥ 3 levels spanning easy/mid/hard, ≥ 4 trials per level (seed: 3 × 12). Evidence: spec §4:88-89 + §7:150; harness:100-102.
- V3:5880 (pack discriminating in calibration but flat in real use) — DECIDED: calibration is necessary but not sufficient — real-use flatline SUSPENDS and reformulates the pack. Evidence: spec §4:101-103.
- V3:5881 (evaluator re-test per version vs standing) — DECIDED: standing until evaluator code or fixtures change (both hash-pinned); any change forces full pre-acceptance re-test. Evidence: spec §7:157-159.
- V3:5882 (difficulty announcement format) — DECIDED: `difficulty:<band> (<rate> on <tool> <version>)`, announced in the pack entry and the index. Evidence: spec §3:71-74; harness:262.
- V3:5883 (evaluator-failure vs fixture-shortage; arbiter) — DECIDED: missing a `defect-known` defect is evaluator failure (reject); passing an unnamed defect is fixture shortage (extend + new version); the arbiter is the pre-acceptance gate applying the flag. Evidence: spec §2:58-62; harness:87-93.
- V3:5884 (expired recipes: delete vs keep tagged) — DECIDED: preserved tagged `EXPIRED`, never silently deleted, never silently revived; only a new recipe version re-admits. Evidence: spec §6:137-140.
- V3:5885 (post-ship review cadence; anti-bloat) — DECIDED: this harness re-runs every release; growth gated — no new pack accepted while any accepted pack shows unhealthy variance. Evidence: spec §4:104-106.
- V3:5886 (category quality metric) — DECIDED: the discrimination index — mean spread across accepted packs with zero unmeasured labels and zero one-way links, reported by the harness digest. Evidence: spec §4:106-108; harness digest line (`digest: 186abc…`).

## S6. FBLD-27 (carried verbatim, never resolved)

FBLD-27 — Slot 0.9.27 — Conflict: V3 slot scope versus R3 ensemble-evaluation breadth — Fallback: lean cite, never widened — Matches LD-27 — Status FLAGGED, never resolved.

Provenance (honest, not a second copy): the dispatch brief names the conflict
(`vs R3 ensemble-evaluation breadth`) and the fallback shape (`lean cite,
never widened`, FBLD-27 line); the full entry above is carried from
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:39` verbatim
(spec §9:174-184 carries the same text). V3 gate text wins on any conflict;
ensemble breadth stays a lean cite here — this node ships one evaluator, one
seed pack, and fixed fixtures: no ensemble, no widening.

## S7. Scope (what was NOT run)

- No checkout of main or any other version branch; no `git switch`, no primary-HEAD move.
- No push (remote branch stays untouched), no merge, no commit beyond the one directed commit, no tag, no `gh release` publish.
- Touched only the three §S2 files; AGENT.md, WORKFLOW.md, every other BUILD-0927 path (incl. sibling `r0927-readme-draft.md`), README.md, README.ar.md, and all files outside the three owned paths untouched.
- No agent dispatched; no verdict declared; no owner contacted. This ledger is evidence for the LEADER.
- Zero invented install commands: this node adds no installable component; every `install_cmd` touched is `null` + `unverified` where unprovable (spec §8). Zero registry/catalog/sidecar writes.

---

Ponytail: FULL — pack formula plus tested evaluators plus measured difficulty, no speculative abstraction.
