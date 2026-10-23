# V87-FEATURE-AUDIT-2 — Feature Audit SHARD B (data/process class)

- **Lane:** V87-AETHER-EXECUTE (owner-commissioned execution of the amended AETHER MISSION-PLAN)
- **Node:** `v-features-2` (wave 1 of 3; `depends_on` `v-enum` — landed: `.opencode/audit/V87-ENUM.md`)
- **Owner:** vantrilex-verifier (worker-only seat; runs gates, records the ledger, returns verdicts, stops)
- **Classification:** DIRECTED node — Scenario 2 does not apply; executed exactly as briefed. No re-dispatch, no repair, no plan change.
- **Date of evidence:** 2026-10-18
- **Evidence basis:** live working tree at `HEAD = c7c762c21f12e2dccba32611d990ad8a0f059b80`, branch `wt/vta-factory-p0`, with **57 uncommitted porcelain entries when the run opened (60 by report time — sibling wave-1 nodes are writing into the same worktree)**. HEAD is 2 commits ahead of `main` (`772c693a5aa8e8ab4045d69ba46c745cef19bc85`). Commands ran read-only; no `git add`, no `git commit`, no `git push`, no tag operation.
- **Merge base:** `git merge-base HEAD main` → `772c693a5aa8e8ab4045d69ba46c745cef19bc85` (resolved, so a delta headline is issued below).
- **Scope of write:** this file only. `docs/spec/v87/**` was read for presence and provenance only and was not modified. Registry sources read-only. No state file touched.
- **Honesty labels:** `مثبت` = proven by a command quoted here or by an exact file:line read. `~تقديري` = best-evidenced estimate, stated as such, never promoted to fact.

---

## 0. Headline and delta

**Battery result: FAIL on gate 9 (markdownlint), 7 PASS, 1 SKIPPED.** The shard-B must-run set (kit, catalog, registry, counts, link sweep, `bash -n` + `shellcheck`, CI trigger) is **all green**; the failure is a docs-hygiene gate over the changed Markdown and is new with this working-tree change.

```text
new failures vs 772c693a5aa8e8ab4045d69ba46c745cef19bc85: gate 9 markdownlint — 3 issues / 2 files
  (AGENT.md:108:280 MD037, AGENT.md:203:302 MD037, WORKFLOW.md:76 MD032)
pre-existing (also failing at base): none among the gates that ran; the single broken generated link
  (registry/VANTRILEX_CATALOG.md:1593 -> htt…) is present in base content (that file is unchanged main..HEAD)
introduced by HEAD commit c7c762c, not by the uncommitted change: the 10 archive-internal link breaks in
  docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md (file absent at 772c693, added by c7c762c); the permanently
  SKIPPED checkpoint step in .github/workflows/ci.yml:141 (present at 772c693)
```

**Delta method, stated honestly.** The base gate re-run was **not** performed in a clean checkout: this node holds no write permission outside the artifact and issues no git writes, so no second worktree could be created. Instead the delta was taken at content level: the two offending `AGENT.md` fragments and the offending `WORKFLOW.md` line are **absent from `HEAD`** (`git show HEAD:AGENT.md | Select-String …` → no match), and `AGENT.md` / `WORKFLOW.md` are **unchanged between `main` and `HEAD`** (`git diff --name-only main..HEAD -- AGENT.md WORKFLOW.md` → empty), so they are introduced by the uncommitted working-tree edits. Exit codes are the claim; the delta labels are analysis.

---

## 1. Gate ledger — one row per battery gate, seven fields

Battery order is the fixed order from the verifier charter. `Commit` = the full SHA under test for every row; the tree is dirty (57 porcelain entries when the run opened) and every command ran against that dirty working tree.

### Gate 1 — verify-kit.mjs

```text
Gate:      1 — verify-kit.mjs
Command:   node scripts/verify-kit.mjs
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80 (working tree, dirty)
Exit code: 0
Time:      2026-10-18T15:29:49Z (start) → 2026-10-18T15:30:05Z (end)
Totals:    "VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed)."
Verdict:   PASS
Note:      key row — "lockfile-validates  PASS  157 components and 9 pending entries validate against kit.lock.schema.json" (مثبت)
```

### Gate 2 — verify-registry.mjs

```text
Gate:      2 — verify-registry.mjs
Command:   node scripts/verify-registry.mjs
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80 (working tree, dirty)
Exit code: 0
Time:      2026-10-18T15:30:05Z → 2026-10-18T15:30:06Z
Totals:    "totals: 7 checks — 7 passed, 0 failed, 0 skipped"
           "VERDICT: PASS — all 7 checks ran and passed. The registry is clean."
Verdict:   PASS
Note:      row-count-integrity "16 sections, 2931 rows"; orphan-references "48 id references across 60 overlap entries all resolve" (مثبت)
```

### Gate 3 — verify-skills.mjs

```text
Gate:      3 — verify-skills.mjs
Command:   node scripts/verify-skills.mjs
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80 (working tree, dirty)
Exit code: 0
Time:      2026-10-18T15:30:06Z → 2026-10-18T15:30:06Z
Totals:    "totals: 10 checks — 10 passed, 0 failed, 0 skipped"
           "VERDICT: PASS — all 10 checks ran and passed. The skills are clean."
Verdict:   PASS
```

### Gate 4 — generate-catalog-json.mjs --check

```text
Gate:      4 — generate-catalog-json.mjs --check
Command:   node scripts/generate-catalog-json.mjs --check
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80 (working tree, dirty)
Exit code: 0
Time:      2026-10-18T15:30:06Z → 2026-10-18T15:30:06Z
Totals:    no totals line is emitted by this tool; its own per-surface lines are quoted verbatim, 17 of them:
           "skip: registry/formatting/_index.md — hand-authored content is preserved, never generated"
           "check: registry/catalog.json — ok" … "check: registry/design/_index.md — ok"
           (16 × "check: … — ok": catalog.json, VANTRILEX_CATALOG.md, skills, mcp, plugins, hooks, agents, lsp,
            cli, themes, prompts, datasets, templates, policies, benchmarks, workflows, design)
Verdict:   PASS — exit 0 and every surface reports ok; the one skip names its reason (مثبت)
```

### Gate 5 — tsc --noEmit (plugin TypeScript)

```text
Gate:      5 — tsc --noEmit (plugin TypeScript)
Command:   npx --yes --package typescript@5 tsc --noEmit -p tsconfig.json
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80 (working tree, dirty)
Exit code: 0
Time:      2026-10-18T15:30:11Z → 2026-10-18T15:30:13Z
Totals:    no totals line; the tool printed 0 lines on stdout and stderr (clean typecheck)
Verdict:   PASS
Note:      tsc is not installed globally on this host; it was resolved through npx exactly as
           .github/workflows/ci.yml:103-104 does ("npm --yes install --no-save … typescript@5"; "npx --yes tsc").
           tsconfig.json exists and names exactly [".opencode/plugin/arsenal.ts"] (مثبت)
```

### Gate 6 — shellcheck plus bash -n over scripts/*.sh

```text
Gate:      6 — shellcheck + bash -n over scripts/*.sh and .githooks/*
Command:   bash -n <10 files, enumerated>  and  shellcheck <same 10 files>
           files: scripts/{dispatch-worktrees,merge-worktrees,migrate-to-opencode-v2,orchestrate-stage,
                  record-decision,release,setup-git-hooks,teardown-stage}.sh ; .githooks/{commit-msg,pre-commit}
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80 (working tree, dirty)
Exit code: 0 (bash -n: 10 files, 0 failures — 2026-10-18T15:30:13Z)
           0 (shellcheck: 10 files, 0 failures — 2026-10-18T15:30:23Z)
Totals:    "bash_n files=10 failures=0"; "shellcheck files=10 failures=0"
Verdict:   PASS
Note:      git-bash 5.2.21 and ShellCheck 0.11.0 (WinGet) were used; CI uses an apt shellcheck on
           ubuntu-latest, so the linter version differs from CI's (environment note, not a failure).
           The first pass of this gate failed with `bash -n` under Windows-style absolute paths
           ("/bin/bash: O:vantrilex-arsenalscriptsrelease.sh: No such file or directory", exit 127) — that was
           my invocation error, corrected to repo-relative POSIX paths; the recorded verdict is from the corrected run (مثبت)
```

### Gate 7 — node --check over each scripts/*.mjs

```text
Gate:      7 — node --check over every *.mjs
Command:   node --check <11 files found by find-equivalent: **/*.mjs excluding node_modules and .worktrees>
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80 (working tree, dirty)
Exit code: 0
Time:      2026-10-18T15:30:11Z → 2026-10-18T15:30:11Z
Totals:    "node_check files=11 failures=0 exit_last=0"
Verdict:   PASS
Note:      scope matches the CI step at .github/workflows/ci.yml:40-50 (same exclusion set, sorted) (مثبت)
```

### Gate 8 — probe battery

```text
Gate:      8 — probe battery
Command:   (none)
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80 (working tree, dirty)
Exit code: n/a
Time:      2026-10-18T15:30:00Z (recorded, not run)
Totals:    n/a
Verdict:   SKIPPED — reason: no adversarial probe is named by the shard-B dispatch, and the repo's probe entry
           point `.opencode/plugin/arsenal.findings-probe.mjs` is a findings-writing harness that would author
           files outside this node's single-write scope. Not a pass.
```

### Gate 9 — markdownlint over changed Markdown

```text
Gate:      9 — markdownlint over changed Markdown
Command:   npx --yes markdownlint-cli2 "AGENT.md" "WORKFLOW.md" ".opencode/agents/*.md" ".opencode/commands/V-*.md"
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80 (working tree, dirty)
Exit code: 1
Time:      2026-10-18T15:30:12Z → 2026-10-18T15:30:16Z
Totals:    "Summary: 3 issues in 2 files"  (markdownlint-cli2 v0.23.3 / markdownlint v0.41.1; Linting: 47 files)
           "AGENT.md:108:280 error MD037/no-space-in-emphasis Spaces inside emphasis markers [Context: "* a"]"
           "AGENT.md:203:302 error MD037/no-space-in-emphasis Spaces inside emphasis markers [Context: "* a"]"
           "WORKFLOW.md:76 error MD032/blanks-around-lists Lists should be surrounded by blank lines [Context: "- W0 (4 parallel, disjoint art..."]"
Verdict:   FAIL
```

**Battery-level consequences.** One SKIPPED gate, so the battery is **not** claimable as a clean PASS (and it is FAIL anyway on gate 9). The skipped gate never reads as passed. Fewer than three gates are skipped, so the headline is FAIL rather than PARTIAL.

---

## 2. Feature audit — shard B (data/process class)

Format per row: `feature | introduced (per V87-ENUM) | latest state | status | evidence (file:line + command + exit)`.

### B1 — Kit lock (157 components / 32+125 / 9 pending) + lock schema

| Field | Value |
|---|---|
| Introduced | `v0.2.0` — 36 pinned Tier-0 entries (`CHANGELOG.md:1251-1252`, per V87-ENUM §2 row 9) |
| Latest state | `kit/kit.lock` carries `lockfileVersion: 1`, `kit: "vantrilex-core"`, `mcp_cap: 8` (`kit/kit.lock:1-5`); the live census is **157 components / 9 pending**, **32 core / 125 conditional**, **80 verified / 77 unverified**; the schema requires `["lockfileVersion","kit","mcp_cap","components","pending"]` and pins the kit selector to `vantrilex-core` (`kit/kit.lock.schema.json:8`, `:17`) |
| Status | **WORKING** |
| Evidence | `node scripts/verify-kit.mjs` exit 0 — "lockfile-validates PASS 157 components and 9 pending entries validate against kit.lock.schema.json"; node read of the lock → `{"components":157,"pending":9,"core":32,"conditional":125,"verified":80,"unverified":77,"kit":"vantrilex-core","lockfileVersion":1}`; `docs/09-KIT-LOCK.md:7` (157 = 32 + 125) agrees; the 9 pending rows each state a reason (`kit/kit.lock:164-173`) and `pending-integrity` PASSes (مثبت) |
| Carried gap | Lock identity is `vantrilex-core` + `lockfileVersion: 1` only — **no kit semver** (V87-ENUM D10). Structural, not a gate failure; belongs to the kit maintainer/Guide. |

### B2 — Registry sidecars (16 JSONL) + overlap map

| Field | Value |
|---|---|
| Introduced | `v0.2.0` — per-kind JSONL sidecars + `overlaps.yaml` (`CHANGELOG.md:1211-1218`, per V87-ENUM §2 row 7) |
| Latest state | **16** `registry/data/*.jsonl` files plus `registry/data/overlaps.yaml` (13,375 B); the generator maps exactly the 16 kinds to those 16 files, 1:1 (`scripts/generate-catalog-json.mjs:367-384`), and merges them as an enrichment layer over the Markdown base (`:445-472`) |
| Status | **WORKING** |
| Evidence | `(Get-ChildItem registry/data -Filter *.jsonl -File).Count` → `16`; `node scripts/verify-registry.mjs` exit 0 — "orphan-references PASS 48 id references across 60 overlap entries all resolve"; "469425 bytes decode as strict UTF-8" for `registry/VANTRILEX_CATALOG.md` and `duplicate-ids PASS 2931 ids, no collision within any kind` (مثبت) |

### B3 — Catalog mirror (2931 records / 16 kinds) + 16 per-kind indexes

| Field | Value |
|---|---|
| Introduced | `v0.2.0` — generated `registry/catalog.json` (`CHANGELOG.md:1211-1215`, per V87-ENUM §2 row 8); `--check` extended to every `_index.md` on 2026-10-18 (`AGENT.md:246`) |
| Latest state | `registry/catalog.json` `counts.total = 2931` over **16** kinds (`registry/catalog.json:5-22`); **16** per-kind `_index.md` files under `registry/<dir>/_index.md`; `registry/VANTRILEX_CATALOG.md` is 469,425 B and parses as 16 sections / 2931 rows; `registry/formatting/_index.md` is hand-authored and reported skipped, never regenerated (`scripts/generate-catalog-json.mjs:851`) |
| Status | **WORKING** (generated-surface *text* integrity is separately DEGRADED — see F3) |
| Evidence | `node scripts/generate-catalog-json.mjs --check` exit 0 — 16 × "check: … — ok" + 1 named skip; `node scripts/verify-registry.mjs` exit 0 — "schema-conformance PASS 2931 records conform to … catalog-v3.schema.json", "row-count-integrity PASS 16 sections, 2931 rows"; kind sums from the mirror reproduce 2931 exactly (1505 skill + 923 mcp + 301 agent + 84 design.md + 64 cli + 20 hook + 13 formatting + 11 plugin + 3 theme + 7 × 1 single-record kinds) (مثبت) |

### B4 — Docs machinery (numbering + link health)

| Field | Value |
|---|---|
| Introduced | `v0.2.0` — 16-file docs set (`CHANGELOG.md:1255`); `v0.4.0` `AGENT.md` living state (`CHANGELOG.md:772-775`); `v0.5.0` `docs/dev/` + `docs/ar/` (`CHANGELOG.md:691-697`); 2026-10-18 archive move + census sync (`AGENT.md:229-252`) |
| Latest state | **22** root docs `docs/00-INDEX.md` … `docs/21-PONYTAIL-COMPLIANCE.md`, numbering **00–21 with zero gaps and zero duplicates**, and every one of the 22 is linked from the index (`docs/00-INDEX.md:30-51`); **92** Markdown files under `docs/`; repo-wide Markdown = **3081** files |
| Status | **DEGRADED** |
| Evidence | numbering probe → `rootDocs=22 first=00-INDEX.md last=21-PONYTAIL-COMPLIANCE.md numberingGaps=[] notLinkedFromIndex=[]`; link sweep (inline links only, anchors and external URLs excluded), run before this artifact existed → `files=3081 totalLinks=619 external=295 anchorOnly=1 relative=323 resolved=312 broken=11`, i.e. **312 of 323 relative links resolve (96.6%)**, exit 0 |
| Census is timestamp-bounded | The working tree is **live**: sibling wave-1 nodes are writing into it while this node reads (porcelain grew 57 → 60 during this run). A re-run of the identical sweep minutes later returned `files=3085 … relative=325 resolved=312 broken=13` — the new Markdown (sibling artifacts plus this file's own quoted link shapes) moved the counts. The quoted census is therefore the pre-artifact observation at its timestamp and is **not** claimed as a stable number. What is stable is the classification of the 11 breaks below. |
| Known breaks, classified (not rediscovered) | **10 of the 11** are inside the archived plan `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md` (`:34`, `:35` ×2, `:88`, `:134`, `:180`, `:227`, `:269`, `:305` — root-relative targets such as `AGENTS.md`, `WORKFLOW.md`, `kit/kit.lock`, `registry/catalog.json`, `SECURITY.md` written for the repo root, now read from `docs/99-archive/`). That file does not exist at the merge base and was added by **c7c762c** — so these 10 are new versus `main` but pre-date the uncommitted working-tree change. **1** is the generated-mirror link `registry/VANTRILEX_CATALOG.md:1593` → `htt…` (pre-existing; that file is unchanged `main..HEAD`). |
| Additional docs defect (pre-existing, from V87-ENUM D6, re-read here) | the CHANGELOG link-reference block stops at `[0.7.0]` (`CHANGELOG.md:1344-1345`), so `[0.7.5]`, `[0.7.6]`, `[0.7.7]` headings have no link reference and `[Unreleased]` compares from `v0.7.0` — three released versions stale. Live heading lines carry `PARKED, UNRELEASED` while the tags exist (V87-ENUM D1–D3). |

### B5 — CI surface (`.github/workflows/ci.yml` triggers + steps vs documented gates)

| Field | Value |
|---|---|
| Introduced | `v0.2.0` — seven shell scripts + CI and release workflows (`CHANGELOG.md:1248-1250`, per V87-ENUM §2 row 12) |
| Latest state — trigger (quoted) | `.github/workflows/ci.yml:3-6` → `on:` / `push:` / `branches: [main]` / `pull_request:` ; `.github/workflows/release.yml:3-5` → `on:` / `push:` / `tags: ['v*']` plus the job guard `if: startsWith(github.ref, 'refs/tags/v')` |
| Latest state — steps | `lint` (`ci.yml:12-50`): `bash -n` over `scripts/*.sh` + `.githooks/*` (`:30-33`), `shellcheck` over the same (`:35-38`), `node --check` over every `.mjs` (`:40-50`, asserts count > 0). `verify` (`:52-78`): `generate-catalog-json.mjs --check` (`:65`), `verify-registry.mjs` (`:68`), `verify-kit.mjs` with an honest NOTICE passthrough when the script is absent (`:71-78`). `types` (`:80-105`): pinned `tsc --noEmit` when `tsconfig.json` exists, SKIPPED with a reason when it does not. `build` (`:107-175`): bash shebang + mode 100755 for the **seven** orchestration scripts (`:118-134`), checkpoint labeled-field contract (`:136-147`), tarball smoke packaging, artifact upload. |
| Documented-gate agreement | `docs/14-CI-RELEASE.md:12-15` describes exactly these four jobs and their steps; `docs/08-VERIFICATION.md:78-80` (shell + node syntax, shebang + exec bit), `:88-91` (tsc SKIPPED-never-PASS), `:99-100` ("CI does not run it" — markdownlint) all match the workflow as read. **مثبت** |
| Status | **DEGRADED** — see F4 for the two named gaps (dead checkpoint step; no CI step for `verify-skills.mjs` and no mode assertion for the eighth script). |
| Evidence | workflow quoted above (`ci.yml` 175 lines, 5,904 B; `release.yml` 2,009 B); independent `bash -n`/`shellcheck`/`node --check`/`tsc` re-runs of the same four lint/verify/type surfaces all exit 0 (gates 5–7) |

### B6 — Release machinery (`scripts/release.sh`) + tag discipline

| Field | Value |
|---|---|
| Introduced | `v0.2.0` (`CHANGELOG.md:1248-1250`); `v0.3.0` tag annotation states "release pipeline repaired"; `v0.7.0` prep-only Releaser boundary — `github-release-packager` is the sole executor (`CHANGELOG.md:567-578`) |
| Latest state | `scripts/release.sh` is 150 lines, mode 100755, `#!/usr/bin/env bash`, carries a `Usage:` block (`:14-17`, `:34-45`); refuses a dirty tree (`:105`), creates the **annotated** tag (`git tag -a …` `:128`), pushes, then `gh release create` (`:140`) and reports the one unrecoverable partial state explicitly (`:134`) |
| Status | **WORKING for the script, DEGRADED for tag discipline** |
| Evidence — script | `bash -n scripts/release.sh` exit 0; `shellcheck scripts/release.sh` exit 0; `bash -c './scripts/release.sh --help >/dev/null 2>&1; echo rc=$?'` → `rc=0`; `git ls-files -s scripts/release.sh` → `100755` (مثبت). The end-to-end publish path was **not** run: on a dirty tree it would refuse at `:105`, and any state past that point writes to git and to the remote, which is outside this node's scope. |
| Evidence — tag discipline | `git tag` → **12** tags; `git cat-file -t` over all 12 → **12 × `tag`** (annotated), matching `release.sh:128`; newest by creator date `v0.7.7, v0.7.6, v7.5`; **defect:** `v7.5` breaks the semver sequence `v0.7.0 → v7.5 → v0.7.6 → v0.7.7` and there is **no `v0.7.5` tag** (`git tag -l v0.7.5` → empty), while the shipped artifact was named `vantrilex-arsenal-v7.5.tar.gz` (V87-ENUM D3/D4). Release order is semantically 0.7.5 → 0.7.6 → 0.7.7 but lexically/numerically unsortable. **DEGRADED.** |

### B7 — `docs/spec/v87` provenance set presence

| Field | Value |
|---|---|
| Introduced | 2026-10-18, this lane's research hand-off; carries no CHANGELOG entry (`~تقديري` on any version label — there is none) |
| Latest state | **7** files present, 101,690 B total: `instagram-v8.7-context.md` (1,869), `SYNTHESIS-v8.7.md` (28,369), `worker-1-plan-handoff.md` (16,224), `worker-2-verification.md` (11,705), `worker-3-memory.md` (15,909), `worker-4-decomposition.md` (14,510), `worker-5-human-gates.md` (13,104). Each header names its date (2026-10-18) and its corpus/method, e.g. `SYNTHESIS-v8.7.md:3-5`, `worker-2-verification.md:3-5` |
| Status | **DEGRADED — present on disk, absent from version control.** `git ls-files docs/spec/v87` → **0** entries; `git status --porcelain` reports the directory as `?? docs/spec/v87/`; `git check-ignore -v docs/spec/v87/SYNTHESIS-v8.7.md` exits 1 (not ignored, just untracked). The set therefore exists in no commit, so it is provenance for this session only. |
| Evidence | directory listing with byte sizes; digest/line-count agreement for three of the seven recorded at `.opencode/audit/V87-INPUT-DIGESTS.md:16` (`worker-1-plan-handoff.md` 104/104 match), `:21` (`SYNTHESIS-v8.7.md` 420/420 match), `:22` (`instagram-v8.7-context.md` no declared target / 24 lines) (مثبت) |

### Shard-B summary table

| # | Feature | Introduced (V87-ENUM) | Latest state | Status | Primary evidence |
|---|---|---|---|---|---|
| B1 | Kit lock (157 / 32+125 / 9 pending) + schema | v0.2.0 | 157 + 9, 32 core / 125 conditional, 80 verified / 77 unverified; schema-valid | **WORKING** | `kit/kit.lock:1-5,164-173`; `kit/kit.lock.schema.json:8,17`; `verify-kit.mjs` exit 0 (22/22) |
| B2 | Registry sidecars (16) + overlaps | v0.2.0 | 16 JSONL + `overlaps.yaml`; 16-kind 1:1 generator map | **WORKING** | `registry/data/*`; `generate-catalog-json.mjs:367-384,445-472`; `verify-registry.mjs` exit 0 |
| B3 | Catalog mirror (2931) + 16 indexes | v0.2.0 (v0.6.5 8th kind) | `counts.total=2931`, 16 kinds, 16 `_index.md` | **WORKING** | `registry/catalog.json:5-22`; `--check` exit 0 |
| B4 | Docs machinery (numbering + links) | v0.2.0 | 22 docs 00–21, zero gaps, all indexed; 312/323 relative links resolve | **DEGRADED** | `docs/00-INDEX.md:30-51`; link sweep above; `CHANGELOG.md:1344-1353` |
| B5 | CI surface | v0.2.0 | 4 jobs; trigger `push main` + `pull_request`; one permanently skipped step; skills gate absent | **DEGRADED** | `.github/workflows/ci.yml:3-6,12-175`; `docs/14-CI-RELEASE.md:12-15` |
| B6 | Release machinery + tag discipline | v0.2.0 | script sound; 12/12 annotated tags; `v7.5` breaks the sequence | **DEGRADED** | `scripts/release.sh:105,128,140`; `git tag` / `git cat-file -t` |
| B7 | `docs/spec/v87` provenance set | 2026-10-18 (no version) | 7 files, 101,690 B, dated and sourced; **untracked** | **DEGRADED** | directory listing; `git ls-files docs/spec/v87` → 0; `V87-INPUT-DIGESTS.md:16,21,22` |

---

## 3. Findings, taxonomy, and dossiers

Every FAIL is classified into exactly one bucket, with the reproduction and the owner it routes to. Dossiers route; they never repair.

### F1 — FAIL, gate 9: markdownlint over changed Markdown

- **Ledger row:** gate 9 above (exit 1; "Summary: 3 issues in 2 files").
- **Failing output, quoted:** `AGENT.md:108:280 error MD037/no-space-in-emphasis`; `AGENT.md:203:302 error MD037/no-space-in-emphasis`; `WORKFLOW.md:76 error MD032/blanks-around-lists`.
- **Minimal reproduction:** `npx --yes markdownlint-cli2 "AGENT.md" "WORKFLOW.md" ".opencode/agents/*.md" ".opencode/commands/V-*.md"` → exit 1; lint `AGENT.md` alone → the two MD037 lines; lint `WORKFLOW.md` alone → line 76.
- **Taxonomy bucket: kit-defect.** Evidence selecting it: the offending text is authored Markdown in this working tree — `git show HEAD:AGENT.md | Select-String -SimpleMatch 'capsule validator usage'` and `… 'no rewrites needed'` both return nothing, and `git show HEAD:WORKFLOW.md | Select-String -SimpleMatch 'W0 (4 parallel'` returns nothing, while `AGENT.md` and `WORKFLOW.md` are unchanged between `main` and `HEAD` (`git diff --name-only main..HEAD -- AGENT.md WORKFLOW.md` → empty). The gate is sound: the same invocation over 45 unchanged agent/command files reports zero issues.
- **Context the Guide should weigh (analysis, not a softening of the verdict):** `docs/08-VERIFICATION.md:99-100` classifies markdownlint as "an additional lint step, not one of the six enforced gates: CI does not run it". Exit code 1 is the claim; the enforcement weight is the Guide's call.
- **Routes to:** change author (docs prose owner in this lane). Not a gate-defect (the linter behaved correctly), not environment.

### F2 — DEGRADED, docs link health: 11 known breaks + stale CHANGELOG link references

- **Reproduction:** the read-only link sweep quoted in B4 (`files=3081 … relative=323 resolved=312 broken=11`, exit 0), run before this artifact was written. The tree is live (see B4 "Census is timestamp-bounded"): a later re-run returned 13 breaks, so the *count* is bounded but the *classification* below is not.
- **Classification of the 11 (per the brief: classify, do not rediscover):** 10 archive-internal, 1 generated mirror.
  - `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md:34,35,35,88,134,180,227,269,305` — root-relative targets read from inside `docs/99-archive/`. This file **does not exist at `772c693`** (`git show 772c693:docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md` → "exists on disk, but not in '772c693'") and was added by **c7c762c** — new vs `main`, pre-existing relative to the uncommitted change. Bucket: **kit-defect**, owner = the commit's docs author (V-REMEDIATE archive move).
  - `registry/VANTRILEX_CATALOG.md:1593` → `[Pepys](htt…)`. Bucket: **pre-existing** (file unchanged `main..HEAD`, link present in base content) and generated — the same truncation pattern appears as prose in two further cells (`:1005`, `:2418`), so the defect originates upstream of the mirror. Owner = registry curator (sidecar/table text), not the link sweep.
- **Stale references (same family, already raised by V87-ENUM D6):** `CHANGELOG.md:1344-1353` has no `[0.7.5]`, `[0.7.6]`, `[0.7.7]` reference and `[Unreleased]` compares from `v0.7.0`. Owner = release/docs author.
- **Routes to:** docs/release author for the archive links and the CHANGELOG references; registry curator for the truncated `htt…` cells.

### F3 — DEGRADED, generated mirror text integrity

- `registry/VANTRILEX_CATALOG.md:1005` (`requests/aiohtt…`), `:1593` (`[Pepys](htt…)`), `:2418` (`pay HTT…`) carry truncated URLs. The mirror itself is current (`--check` exit 0), so this is a **content** defect in a generated surface, not drift. Bucket: **pre-existing** (present in base content). Owner = registry curator; the Guide may treat it as a carried residual.

### F4 — DEGRADED, CI surface: a permanently skipped step and two missing assertions

1. **Dead checkpoint step.** `ci.yml:141` tests `docs/17-CHECKPOINT.md`; that path does not exist anywhere in this repository (recursive search → no match; `Test-Path docs/17-CHECKPOINT.md` → `False`; the file is `docs/17-V2-HOOK-GAP.md`). The step is present in base too (`git show 772c693:.github/workflows/ci.yml` matches `17-CHECKPOINT` at lines 141, 142, 146, 147), so bucket **pre-existing**. It prints SKIPPED by design and never evaluates the contract it claims to check — honest, but dead. `docs/14-CI-RELEASE.md:23-24` describes it as the *target-project* checkpoint, which is why a repo-local path can never satisfy it. Owner = CI author (decide: point it at the target project, or drop the step).
2. **No CI step for `verify-skills.mjs`.** `docs/08-VERIFICATION.md:58-70` documents the skill-format check as a gate (`node scripts/verify-skills.mjs`, 10/10, 37 folders) while `docs/14-CI-RELEASE.md:12-13` and `ci.yml`'s `verify` job do not run it. The gate is green locally (gate 3, exit 0) but is not wired into CI. Bucket: **kit-defect (wiring gap)**, owner = CI author / kit maintainer. `~تقديري` on intent — the docs do not explicitly claim CI runs it.
3. **Mode assertion covers seven of eight shell scripts.** `ci.yml:118-134` asserts shebang + 100755 for the seven orchestration scripts; `git ls-files -s scripts/*.sh` shows `scripts/migrate-to-opencode-v2.sh` at **100644** while `AGENTS.md` states scripts carry mode 100755. Pre-existing at base (`git ls-tree HEAD scripts/` → 100644). Bucket: **kit-defect**, owner = kit maintainer (add the mode or amend the rule). Also note `.githooks/*` are 100644 and are not asserted by any gate.

### F5 — DEGRADED, provenance set untracked

- `docs/spec/v87/` holds the 7-file research provenance set but is untracked (`git ls-files docs/spec/v87` → 0; `git status --porcelain` → `?? docs/spec/v87/`), so no commit pins it. Bucket: **kit-defect (process)** — the mission brief marks the set read-only and forbids touching it, so this is a routing item, not a repair. Owner = Guide (decide whether the set is versioned or intentionally session-local).

---

## 4. Missing checks — named, never silent

| Check | State | Reason |
|---|---|---|
| Probe battery (gate 8) | SKIPPED | No probe named by the shard-B dispatch; the repo probe harness writes findings files, outside this node's single-write scope. |
| `docs/spec/v87/**` content verification | Not performed | Out of shard B scope and explicitly read-only; only presence and provenance headers were read. |
| Release end-to-end (`release.sh <VERSION>`) | Not run | It would write a tag and push to the remote; the tree is dirty, so the script would refuse at `release.sh:105` anyway. `--help` (rc=0) and both syntax linters were run instead. |
| Remote tag verification (`git ls-remote`) | Not run | Not required by the shard-B brief; V87-ENUM CMD8 already recorded it, and re-running would add no local evidence. |
| Docs-discipline guard / hooks dry-run | Not run | Outside this node's scope; the guard emitted a WARN banner during an incidental npx invocation, which was ignored as untrusted tool noise. |
| Base gate re-run in a clean checkout | Not performed | No write permission outside the artifact and no git writes permitted, so no second worktree could be created; the delta was taken at content level (see §0). |
| markdownlint over **all** Markdown | Partial by design | The charter says "changed Markdown"; 47 files (all agent, command and the two changed root docs) were linted. Unchanged docs were not swept for pre-existing lint debt. |
| `.githooks/*` executable bit | Not asserted by any gate | Reported as a named gap in F4.3 rather than silently passed. |
| Markdown in other `.opencode/audit/*.md` artifacts | Not in gate 9's scope | Gate 9 covers changed project Markdown (`AGENT.md`, `WORKFLOW.md`, agents, commands). An incidental lint of the audit folder returned "Linting: 8 files / Summary: 6 issues in 3 files" — all MD038, at `V-FULL-AUDIT.md:968:33`, `V87-ENUM.md:271:254`, `:271:297`, `V87-FEATURE-AUDIT-1.md:224:573`, `:225:374`, `:251:633`. **This artifact is not among the three files with issues.** Pre-existing sibling-artifact content, named here rather than silently passed; routing item for those authors. |

---

## 5. Bounds observed

- **One write:** `.opencode/audit/V87-FEATURE-AUDIT-2.md`. Zero edits to `docs/spec/v87/**`, registry sources, state files, or any generated surface. No `kit/kit.lock`, no `registry/catalog.json`, no generated Markdown was touched.
- **No git writes:** zero `add`, `commit`, `push`, tag, stash, or worktree operations. Git was used read-only throughout (`rev-parse`, `status`, `show`, `ls-files`, `ls-tree`, `diff`, `log`, `merge-base`, `cat-file`, `tag`, `for-each-ref`).
- **No secrets, no `model:` pins, no color fields, no invented catalog ids.**
- **Temporary scratch:** a few HEAD/base copies were briefly written under `$env:TEMP` for one markdownlint comparison; the comparison was rejected as unusable (redirect encoding) and **all scratch files were deleted** (`temp_scratch_removed=True`). Every result quoted here comes from a command run against the repository tree.
- **Authored code:** no parsing script was written to file. The link sweep and the census reads were inline Node/inline PowerShell invocations; the link sweep's output is quoted in full (counts + every broken row) and its re-run result is reported honestly as *different* (live tree), never as a confirmation it was not. No `node --check` applies to an inline one-liner, so its verification is the quoted runs themselves.
- **Exit codes are the claim; the delta labels, the status column, and the taxonomy buckets are analysis and are labelled as such.**

Ponytail: no code authored to file (curation/verification posture only) — evidence: 9-row gate ledger with exit codes and verbatim totals, 7 shard-B feature rows each with file:line, one artifact written, zero repairs, zero git writes, scratch files deleted.
