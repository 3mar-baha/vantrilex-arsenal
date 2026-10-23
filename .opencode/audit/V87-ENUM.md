# V87-ENUM — Version Enumeration, Superseded Map, Metadata Defects

- **Lane:** V87-AETHER-EXECUTE
- **Node:** `v-enum` (wave 0 of 3; `depends_on`: none)
- **Owner:** vantrilex-librarian (worker-only seat)
- **Classification:** Scenario 1 NEW TASK — directed node. The Vanguard phase-kit plan is fixed by the dispatcher; this node derives no map and dispatches nothing.
- **Date of evidence:** 2026-10-18
- **Kit version named by the dispatch:** none. No version-qualified catalog answer is issued here, and no kit version is guessed. This artifact reports the version **series itself**, with every row tied to its tag or its plan line.
- **Evidence basis:** live working tree at `HEAD = c7c762c21f12e2dccba32611d990ad8a0f059b80` plus 54 uncommitted porcelain entries, read 2026-10-18. Read-only git only; no `add`, no `commit`, no `push`.
- **Scope of write:** this file only. `docs/spec/v87/**` was not read for content and was not touched.
- **Honesty labels:** `مثبت` = proven by a command quoted here or by an exact file:line read. `~تقديري` = best-evidenced estimate, stated as such, never promoted to fact.

---

## 0. Commands run — command, output, exit

### CMD1 — full tag list

```
$ git tag
v0.1.0
v0.2.0
v0.3.0
v0.4.0
v0.4.1
v0.5.0
v0.6.0
v0.6.5
v0.7.0
v0.7.6
v0.7.7
v7.5
exit=0
```

### CMD2 — tag count

```
$ (git tag | Measure-Object -Line).Lines
12
```

**12 tags, `مثبت`.** The dispatch expected 12 including the `v7.5` oddity; the count matches.

### CMD3 — is there a `v0.7.5` tag?

```
$ git tag -l v0.7.5
<no output>
exit=0
```

**`مثبت`:** there is no `v0.7.5` tag.

### CMD4 — is there a `v7.5` tag?

```
$ git tag -l v7.5
v7.5
exit=0
```

**`مثبت`.**

### CMD5 — CHANGELOG heading list

```
$ Select-String -Path CHANGELOG.md -Pattern '^## \['  →  13 matches, 12 of them version headings
10:   ## [Unreleased]
12:   ## [0.7.7] — 2026-10-15 — PARKED, UNRELEASED (no tag, no publish; parked on branch `wt/vta-expansion-03` for the owner)
167:  ## [0.7.6] — 2026-10-15 — PARKED, UNRELEASED (no tag, no publish; parked on branch `wt/vta-expansion-03` for the owner)
367:  ## [0.7.5] — 2026-10-15 — PARKED, UNRELEASED (no tag, no publish; parked on branch `wt/vta-expansion-03` for the owner)
513:  ## [0.7.0] — 2026-10-15
597:  ## [0.6.5] — 2026-10-15
623:  ## [0.6.0] — 2026-10-15
674:  ## [0.5.0] — 2026-10-15
735:  ## [0.4.1] — 2026-10-14
763:  ## [0.4.0] — 2026-10-14
825:  ## [0.3.0] — 2026-10-12
1207: ## [0.2.0] — 2026-10-04
1327: ## [0.1.0] — 2026-10-04
```

### CMD6 — each tag's own tree carries its heading

```
$ foreach ($t in (git tag)) { git show "${t}:CHANGELOG.md" | Select-String '^## \[' | Select-Object -First 2 }
v0.1.0 → ## [Unreleased] | ## [0.1.0] — 2026-10-04
v0.2.0 → ## [Unreleased] | ## [0.2.0] — 2026-10-04
v0.3.0 → ## [Unreleased] | ## [0.3.0] — 2026-10-12
v0.4.0 → ## [Unreleased] | ## [0.4.0] — 2026-10-14
v0.4.1 → ## [Unreleased] | ## [0.4.1] — 2026-10-14
v0.5.0 → ## [Unreleased] | ## [0.5.0] — 2026-10-15
v0.6.0 → ## [Unreleased] | ## [0.6.0] — 2026-10-15
v0.6.5 → ## [Unreleased] | ## [0.6.5] — 2026-10-15
v0.7.0 → ## [Unreleased] | ## [0.7.0] — 2026-10-15
v0.7.6 → ## [Unreleased] | ## [0.7.6] — 2026-10-15 — PARKED, UNRELEASED (...)
v0.7.7 → ## [Unreleased] | ## [0.7.7] — 2026-10-15 — PARKED, UNRELEASED (...)
v7.5   → ## [Unreleased] | ## [0.7.5] — 2026-10-15 — PARKED, UNRELEASED (...)
exit=0
```

**`مثبت`:** the tag `v7.5` resolves to a tree whose CHANGELOG top heading is `[0.7.5]`, not `[7.5]`.

### CMD7 — tag objects are all annotated

```
$ foreach ($t in (git tag)) { git cat-file -t $t }
v0.1.0 … v7.5  →  tag   (12 of 12)
```

**`مثبت`:** every tag, including `v7.5`, is an annotated tag. The release script creates annotated tags (`scripts/release.sh:128`), so an annotated tag is release-machinery-shaped, not a scratch marker.

### CMD7b — tag annotation messages (`git tag -n99`, excerpt)

```
v0.3.0  v0.3.0: defect remediation sweep — plugin crash fix, lock cleanup to 47, agents ship, skills govern, release pipeline repaired
v0.7.6  v0.7.6
v0.7.7  v0.7.7
v7.5    v7.5
exit=0
```

### CMD8 — remote side

```
$ git ls-remote --tags origin | Select-String 'v0.7.[567]|v7.5'
6a06d249…  refs/tags/v0.7.6
6e6bb801…  refs/tags/v0.7.6^{}
0ca84b4c…  refs/tags/v0.7.7
3d5d92aa…  refs/tags/v0.7.7^{}
53b91d6c…  refs/tags/v7.5
e0f2be14…  refs/tags/v7.5^{}
exit=0
```

**`مثبت`:** the three tags are published to `origin`, so "no publish" is refuted at tag level.

### CMD9 — archived-plan version citations

```
$ Select-String -Path docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md -Pattern 'v0\.8|v0\.9|v2\.x|v3\.x|v5\.x|v6\.x|v8\.0|v8\.4|v8\.5|v8\.6|v7\.x'
74:  ## 5 — Phase P0 v0.8: charter + makers + A1 identity fix
125: ## 6 — Phase P1 v0.9 to v2.x: eval-driven polish over all 1530 skills
170: ## 7 — Phase P2 v3.x to v5.x: agent polishing plus Crucible intake
217: ## 8 — Phase P3 v6.x to v8.4: MCP admission plus profile gear plus soak
223: v7.x profile gear for the 8 specialists in order; run the v8.0 to v8.4
231: covering v8.0 to v8.4.
247: profile gear files equal 8 in the ordered sequence; soak log covers v8.0,
248: v8.1, v8.2, v8.3, v8.4 with 0 uncovered versions; `verify-kit.mjs` exit 0.
252: (4) refuse out-of-order profile gear — v7.x gear is ordered; (5) refuse
263: ## 9 — Phase P4 v8.5: maturity gate
297: ## 10 — Phase P5 v8.6: convergence demonstration
337: loop is parked, the dashboard is rejected, and the post-v8.6 channel is a
exit=0
```

### CMD10 — verifier state used as the "verify-at" baseline

```
$ node scripts/verify-registry.mjs
totals: 7 checks — 7 passed, 0 failed, 0 skipped
VERDICT: PASS — all 7 checks ran and passed.
registry_exit=0

$ node scripts/verify-kit.mjs
VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).
kit_exit=0

$ node scripts/verify-skills.mjs
totals: 10 checks — 10 passed, 0 failed, 0 skipped
VERDICT: PASS — all 10 checks ran and passed.
exit=0

$ node scripts/generate-catalog-json.mjs --check
check: registry/design/_index.md — ok
exit=0
```

**`مثبت`:** the four read-only verifiers are green on the live tree. `tsc`, `shellcheck`, `markdownlint`, and the hook dry-runs were **not** run by this node; where they are named below they are pointers for the auditor, not results claimed here.

### CMD11 — tracked vs untracked agent files

```
$ git status --porcelain -- .opencode/agents
 D .opencode/agents/agent-maker.md
 D .opencode/agents/ai-generated-code-security-auditor.md
 D .opencode/agents/architect.md
 D .opencode/agents/code-reviewer.md
 D .opencode/agents/kit-maintainer.md
 D .opencode/agents/red-team.md
 D .opencode/agents/technical-writer.md
 M .opencode/agents/vantrilex-guide.md
 M .opencode/agents/vantrilex-implementer.md
 M .opencode/agents/vantrilex-leader.md
 M .opencode/agents/vantrilex-verifier.md
?? .opencode/agents/vantrilex-agent-maker.md
?? .opencode/agents/vantrilex-architect.md
?? .opencode/agents/vantrilex-code-reviewer.md
?? .opencode/agents/vantrilex-kit-maintainer.md
?? .opencode/agents/vantrilex-puller.md
?? .opencode/agents/vantrilex-red-team.md
?? .opencode/agents/vantrilex-uploader.md
exit=0
```

**`مثبت`:** seven replacement agent files and both intake agents are untracked; seven old files are deleted in the worktree. Their introduction version therefore cannot be read from git history in this tree — hence `~تقديري`.

---

## 1. VERSION TABLE

### 1.1 Shipped series — 12 tags, each with its basis

Basis = the tag plus the CHANGELOG heading carried **inside that tag's own tree** (CMD6), plus the live heading line for navigation. All rows `مثبت`.

| # | Tag | Tag date (+03:00) | Commit subject | CHANGELOG heading (live file:line) | Basis verdict |
|---|-----|-------------------|----------------|------------------------------------|---------------|
| 1 | `v0.1.0` | 2026-10-04T19:18:07 | merge: ratify-docs | `CHANGELOG.md:1327` | tag + heading agree |
| 2 | `v0.2.0` | 2026-10-04T23:17:32 | docs: changelog for 0.2.0 | `CHANGELOG.md:1207` | tag + heading agree |
| 3 | `v0.3.0` | 2026-10-12T13:44:18 | merge: red-team findings remediation | `CHANGELOG.md:825` | tag + heading agree |
| 4 | `v0.4.0` | 2026-10-14T07:29:26 | merge: v0.4.0 program | `CHANGELOG.md:763` | tag + heading agree |
| 5 | `v0.4.1` | 2026-10-14T08:19:57 | chore: release v0.4.1 | `CHANGELOG.md:735` | tag + heading agree |
| 6 | `v0.5.0` | 2026-10-15T06:24:32 | merge: v0.5.0 program | `CHANGELOG.md:674` | tag + heading agree |
| 7 | `v0.6.0` | 2026-10-15T07:47:27 | merge: v0.6.0 program | `CHANGELOG.md:623` | tag + heading agree |
| 8 | `v0.6.5` | 2026-10-15T08:07:08 | merge: v0.6.5 program | `CHANGELOG.md:597` | tag + heading agree |
| 9 | `v0.7.0` | 2026-10-15T10:11:53 | merge: v0.7.0 program | `CHANGELOG.md:513` | tag + heading agree |
| 10 | **`v7.5`** | 2026-10-15T17:21:30 | merge: v7.5 program | `CHANGELOG.md:367` = `[0.7.5]` | **tag name ≠ heading version** |
| 11 | `v0.7.6` | 2026-10-15T17:24:56 | merge: v0.7.6 program | `CHANGELOG.md:167` | tag + heading agree; heading status stale |
| 12 | `v0.7.7` | 2026-10-15T17:29:35 | merge: v0.7.7 program | `CHANGELOG.md:12` | tag + heading agree; heading status stale |

Release order is tag-date order: `v7.5` → `v0.7.6` → `v0.7.7`, matching the owner order recorded at `AGENT.md:291` ("sequential release v7.5 (tag name as ordered) → v0.7.6 → v0.7.7").

**The shipped series stops at `v0.7.7`, `مثبت`.** Every tag in CMD1 is a 0.x release except the single `v7.5` alias, and the newest tag object is `v0.7.7` (CMD1, CMD2). No shipped tag exists above `v0.7.7` under any naming.

### 1.2 Program series — v0.8 → v8.6, plan-only labels

Basis: quoted lines from `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md`, which is an archived plan, not a release record (`:3-5` "Status: plan only, then STOP … No execution is ordered").

| Phase | Program label | Basis (quoted plan line) |
|---|---|---|
| P0 | **v0.8** | `:74` "## 5 — Phase P0 v0.8: charter + makers + A1 identity fix" |
| P1 | **v0.9 to v2.x** | `:125` "## 6 — Phase P1 v0.9 to v2.x: eval-driven polish over all 1530 skills" |
| P2 | **v3.x to v5.x** | `:170` "## 7 — Phase P2 v3.x to v5.x: agent polishing plus Crucible intake" |
| P3 | **v6.x to v8.4** | `:217` "## 8 — Phase P3 v6.x to v8.4: MCP admission plus profile gear plus soak" |
| P3 sub | **v7.x** gear, **v8.0–v8.4** soak | `:223` "ship v7.x profile gear for the 8 specialists in order; run the v8.0 to v8.4 hardening soak"; `:247-248` "soak log covers v8.0, v8.1, v8.2, v8.3, v8.4 with 0 uncovered versions" |
| P4 | **v8.5** | `:263` "## 9 — Phase P4 v8.5: maturity gate" |
| P5 | **v8.6** | `:297` "## 10 — Phase P5 v8.6: convergence demonstration" |
| scope | P0 to v8.6 | `:14` "The factory program P0 to v8.6 is the SOLE focus"; `:16` "The post-v8.6 integrated comms channel is a SEPARATE future project" |

Cross-check against live git: **no tag and no CHANGELOG heading carries any of `v0.8`, `v0.9`, `v2.x`, `v3.x`, `v5.x`, `v6.x`, `v8.0`–`v8.6`** (CMD1, CMD5). The single program-label-shaped artifact that reached git is the tag `v7.5` — and it is not a program-phase release, because its own tree carries the shipped `[0.7.5]` heading (CMD6) and its release artifact was named `vantrilex-arsenal-v7.5.tar.gz` (`AGENT.md:290`).

**The program series lives only in plan artifacts, `مثبت`.** The shipped series stops at `v0.7.7`; the program series stops at v8.6 in prose and never entered `git tag` or `CHANGELOG.md`.

### 1.3 Series separation — one-line ruling for downstream nodes

> **Shipped series:** `v0.1.0` … `v0.7.7` (12 tags, one of them misnamed `v7.5`). **Program series:** v0.8 → v8.6, archived plan only, zero tags, zero changelog entries.

Downstream feature auditors must not read a program label as a shipped version, and must not read `v7.5` as a program-phase release.

---

## 2. SUPERSEDED MAP — feature classes from live evidence

Columns: **Feature class** | **Introduced (best-evidenced)** | **Last modified / superseding state** | **Current artifact path** | **Verify-at pointer**. Evidence is file:line inline. `~تقديري` marks thin evidence.

| # | Feature class | Introduced (best-evidenced) | Last modified / superseding state | Current artifact path | Verify-at pointer |
|---|---|---|---|---|---|
| 1 | **Role agents (leaders + Implementer/Guide)** | `v0.2.0` — "Leader, Guide and Implementer role agents" `CHANGELOG.md:1246` | `v0.7.6` — BLAZAR retooled from plan-owner to Build Leader `CHANGELOG.md:177-198`; `v0.7.5` adds AETHER/PULSAR leaders `CHANGELOG.md:377-389` | `.opencode/agents/blazar.md`, `aether.md`, `pulsar.md`, `vantrilex-leader.md`, `vantrilex-guide.md`, `vantrilex-implementer.md` (27 files on disk) | `node scripts/verify-kit.mjs` (22/22, CMD10); `docs/10-ROLE-MODEL.md` |
| 2 | **Worker roster + B2 naming law** | `v0.7.0` — 14 `vantrilex-*` side agents `CHANGELOG.md:517-532` | `v0.7.6` — 13-worker dispatch allow-list `CHANGELOG.md:208-223`; roster now 27 files, with `vantrilex-uploader`, `vantrilex-puller`, `vantrilex-agent-maker`, `vantrilex-architect`, `vantrilex-code-reviewer`, `vantrilex-kit-maintainer`, `vantrilex-red-team` **absent from git history as additions** (`git status` shows them `??` untracked; CMD11) `~تقديري` on their introduction version | `.opencode/agents/` (27 files); 9 ids still on `kit/kit.lock` `pending` list (`pending-integrity` line in CMD10) | `node scripts/verify-kit.mjs`; read `kit/kit.lock` `pending` block |
| 3 | **Dual supersession of doc/audit authorities** | `v0.7.0` — `technical-writer` → scribe, `ai-generated-code-security-auditor` → security-auditor, both lock rows removed `CHANGELOG.md:551-558` | Live tree: the old files are deleted (`git status`: ` D .opencode/agents/technical-writer.md`, ` D .opencode/agents/ai-generated-code-security-auditor.md`); replacements ship as `vantrilex-scribe.md` / `vantrilex-security-auditor.md` | `.opencode/agents/vantrilex-scribe.md`, `.opencode/agents/vantrilex-security-auditor.md` | `git log --diff-filter=D -- .opencode/agents/technical-writer.md`; `node scripts/verify-kit.mjs` |
| 4 | **Skills (bundled kit skills)** | `v0.2.0` — four mechanism skills `CHANGELOG.md:1227-1232` | `v0.5.0` adds `vantrilex-deep-understand` (`CHANGELOG.md:691`); `v0.7.7` adds relay skill `CHANGELOG.md:38-46`; live tree adds `vs-*` polished copies and `vantrilex-intake-*` **untracked** (`git status`) `~تقديري` for the `vs-*` introduction version | `.opencode/skills/` — 37 directories | `node scripts/verify-skills.mjs` (10/10, exit 0, CMD10) |
| 5 | **Commands (V-switches + operator)** | `v0.6.0` — six V-commands + ten `V-<Agent>` switches, "16 command files in total" `CHANGELOG.md:627-634` | `v0.7.5` adds `V-AETHER` / `V-PULSAR` `CHANGELOG.md:388-389`; live tree = 18 files in `.opencode/commands/` + 4 in `.opencode/command/` = 22, matching the audit census at `AGENT.md:228` | `.opencode/commands/*.md` (18), `.opencode/command/*.md` (4) | Manual count `(Get-ChildItem .opencode/commands -File).Count`; read `docs/16-TASK-DISPATCH.md` context. Note: `command` is not a lock kind — `CHANGELOG.md:666-668` |
| 6 | **Plugin + hook surface** | `v0.2.0` — `arsenal.ts` six logical hooks + docs guard `CHANGELOG.md:1241-1245` | `v0.3.0` seventh hook `task-dispatcher` `CHANGELOG.md:892-903`; `v0.7.5` detective plan-guard `CHANGELOG.md:397-403`; `v0.7.7` relay poll/watchdog registered **disabled** `CHANGELOG.md:47-57` | `.opencode/plugin/arsenal.ts` (95,885 B), `.opencode/plugin/arsenal.findings-probe.mjs`, `.opencode/plugins/vantrilex-guards.ts`, `.opencode/hooks/relay/{relay-hooks.json,relay-poll.mjs,relay-watchdog.mjs}` | `npx tsc --noEmit` (pointer only, not run here); `node .opencode/hooks/relay/relay-poll.mjs --dry-run` (pointer) |
| 7 | **Registry sidecars + overlap map** | `v0.2.0` — per-kind JSONL sidecars + `overlaps.yaml` `CHANGELOG.md:1211-1218` | Fixed 2026-10-04: plural sidecar filenames were being discarded `CHANGELOG.md:1308-1310`; live = 16 `.jsonl` + `overlaps.yaml` | `registry/data/*.jsonl` (16), `registry/data/overlaps.yaml` | `node scripts/verify-registry.mjs` (7/7, exit 0, CMD10) |
| 8 | **Catalog mirror + generator** | `v0.2.0` — generated `registry/catalog.json` `CHANGELOG.md:1211-1215` | `v0.6.5` eighth kind `design.md` end-to-end `CHANGELOG.md:601-613`; 2026-10-18 `--check` extended to every `_index.md`, bite-proven `AGENT.md:246` | `registry/catalog.json` (2,931 records, 16 kinds), `registry/VANTRILEX_CATALOG.md`, `scripts/generate-catalog-json.mjs` | `node scripts/generate-catalog-json.mjs --check` (exit 0, CMD10) |
| 9 | **Kit lock + schema + kit verifier** | `v0.2.0` — 36 pinned Tier-0 entries `CHANGELOG.md:1251-1252` | Live: **157 components + 9 pending**, 32 core / 125 conditional, 80 verified / 77 unverified (node read of `kit/kit.lock`); the 138→157 jump is the 19-MCP P3 work `AGENT.md:220` | `kit/kit.lock`, `kit/kit.lock.schema.json`, `scripts/verify-kit.mjs` | `node scripts/verify-kit.mjs` (22/22, CMD10). Note: lock carries **no kit semver** — `kit: "vantrilex-core"`, `lockfileVersion: 1` (`kit.lock.schema.json:8-18`) |
| 10 | **Verification battery** | `v0.2.0` — verifiers `CHANGELOG.md:1252-1254` | `v0.4.1` probe battery grows 28→45 checks `CHANGELOG.md:743-744`; four gates re-proven 2026-10-18 `AGENT.md:240-241` | `scripts/verify-registry.mjs`, `verify-kit.mjs`, `verify-skills.mjs`, `generate-catalog-json.mjs`, `.opencode/plugin/arsenal.findings-probe.mjs` | CMD10 four green; probe battery not run here (pointer: `node .opencode/plugin/arsenal.findings-probe.mjs`) |
| 11 | **Docs machinery (numbered set, dev index, AR mirrors, archive)** | `v0.2.0` — 16-file docs set `CHANGELOG.md:1255`; `v0.4.0` `AGENT.md` living state `CHANGELOG.md:772-775` | `v0.5.0` `docs/dev/` + `docs/ar/` `CHANGELOG.md:691-697`; 2026-10-18 V-REMEDIATE census sync + archive move `AGENT.md:229-252` | `docs/` (92 `.md` files), `docs/dev/`, `docs/ar/`, `docs/99-archive/` | Link sweep + markdownlint (pointer only, not run here); `docs/00-INDEX.md` |
| 12 | **Release machinery** | `v0.2.0` — seven shell scripts, CI + release workflows `CHANGELOG.md:1248-1250` | `v0.3.0` tag annotation: "release pipeline repaired" (CMD7b); `v0.7.0` prep-only Releaser boundary — `github-release-packager` is the sole executor `CHANGELOG.md:567-578` | `scripts/release.sh`, `.github/workflows/release.yml`, `.github/workflows/ci.yml`, `.opencode/agents/vantrilex-releaser.md`, packaged skill `github-release-packager` | `bash -n scripts/release.sh` (pointer); read `release.yml:3-5` (`tags: ['v*']`) and `scripts/release.sh:115-134` |
| 13 | **Themes + atomic switch** | `v0.5.0` — new `theme` kind, `vantrilex-blazar` `CHANGELOG.md:678-684` | `v0.6.0` per-agent registry + atomic switch workaround `CHANGELOG.md:635-650`; `v0.7.5` adds `vantrilex-aether` / `vantrilex-pulsar` `CHANGELOG.md:388-389` | `registry/themes/{vantrilex-aether,vantrilex-atomic-switch,vantrilex-blazar,vantrilex-pulsar}.json` + `_index.md`; `.opencode/skills/vantrilex-atomic-switch/SKILL.md` | `node scripts/verify-kit.mjs` theme check; read `docs/18-THEMES.md` — **stale, see D9** |
| 14 | **RAG knowledge layer** | `v0.5.0` — ten-domain file-based RAG under `registry/rag/` `CHANGELOG.md:685-690` | Live: 10 domain files + `knowledge-hotfix.json` + `v06-api-plan.md`; no server (design doc only) `CHANGELOG.md:690` | `registry/rag/01-doctrine.json` … `10-user-faq.json` | Read `registry/rag/06-releases.json` for release facts; `registry/rag/knowledge-hotfix.json` for corrections |
| 15 | **Intake (Crucible) + relay** | Relay: `v0.7.7` skill + hooks `CHANGELOG.md:38-57`. Intake agents/skills: no CHANGELOG entry; live as **untracked** files (`git status`: `?? .opencode/agents/vantrilex-uploader.md`, `?? …/vantrilex-puller.md`, `?? .opencode/skills/vantrilex-intake-fetch/`, `-send/`, `-triage/`) `~تقديري` | Plan defines the intake program as P2 v3.x–v5.x `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md:170-215`; relay trial HELD, hooks disabled `CHANGELOG.md:94-96` | `.opencode/skills/relay-protocol/` (8 files), `.opencode/hooks/relay/` (3 files), `.opencode/agents/vantrilex-uploader.md`, `.opencode/agents/vantrilex-puller.md`, `.opencode/skills/vantrilex-intake-{fetch,send,triage}/` | `git status --porcelain` for tracked-vs-untracked; hook dry-runs (pointer) |
| 16 | **Worktree / stage orchestration** | `v0.2.0` — seven adapted shell scripts + two git hooks `CHANGELOG.md:1248-1250` | Live: 15 scripts under `scripts/`, 2 hooks under `.githooks/` (`commit-msg`, `pre-commit`) | `scripts/dispatch-worktrees.sh`, `merge-worktrees.sh`, `orchestrate-stage.sh`, `teardown-stage.sh`, `migrate-to-opencode-v2.sh`, `record-decision.sh`, `setup-git-hooks.sh`; `.githooks/*` | `bash -n` + `shellcheck` (pointer only, not run here) |

**Supersession summary, `مثبت`:** the only declared supersessions in the changelog are the dual doc/audit pair at `CHANGELOG.md:551-558`. The `vs-*` skill folders and the intake skills visibly supersede or extend earlier skill folders but carry **no changelog declaration and no git addition** in this working tree, so their supersession is `~تقديري` and belongs to the feature-audit nodes to confirm.

---

## 3. METADATA DEFECTS

Each row names claim A, claim B, and the verdict. `مثبت` = both sides evidenced here; `~تقديري` = one side is an inference.

| ID | Severity | Claim A (evidence) | Claim B (evidence) | Verdict |
|---|---|---|---|---|
| **D1** | HIGH | `CHANGELOG.md:12-18` — `[0.7.7]` is "PARKED, UNRELEASED (no tag, no publish)"; `:116-121` "no merge, no tag, no push, no publish"; `:164-165` "Confirm `git tag -l v0.7.7` prints nothing — parked means parked" | `git tag` lists `v0.7.7` (CMD1); remote carries it (CMD8); `AGENT.md:288` records "v0.7.7 RELEASED … tag `v0.7.7` → commit `3d5d92aa…`, pushed; run `38751942204` success … release published" | **CONFIRMED contradiction.** Released, changelog says parked. `مثبت` |
| **D2** | HIGH | `CHANGELOG.md:167-173`, `:328`, `:364` — `[0.7.6]` parked, "no tag", checklist expects `git tag -l v0.7.6` empty | `git tag` lists `v0.7.6`; remote carries it (CMD8); `AGENT.md:289` records the tag, push, run `38751189927`, and published tarball `vantrilex-arsenal-v0.7.6.tar.gz` 2,094,918 B | **CONFIRMED contradiction.** `مثبت` |
| **D3** | HIGH | `CHANGELOG.md:367-373`, `:483`, `:510-511` — `[0.7.5]` parked, "no tag"; checklist expects `git tag -l v0.7.5` empty | No `v0.7.5` tag exists (CMD3), **but** `v7.5` does (CMD4), remote carries it (CMD8), and `AGENT.md:290` records "tag `v7.5` → `e0f2be14…` … release published (not draft) with `vantrilex-arsenal-v7.5.tar.gz` 2,084,077 bytes" | **CONFIRMED contradiction of intent.** The section's literal "no tag" is true only for the string `v0.7.5`; a release exists under `v7.5`. `مثبت` |
| **D4** | HIGH | Tag `v7.5` (CMD1, CMD4) | Heading `## [0.7.5]` in that tag's own tree (CMD6); release artifact named `vantrilex-arsenal-v7.5.tar.gz` (`AGENT.md:290`); the owner order itself says "v7.5 (tag name as ordered)" (`AGENT.md:291`) | **CONFIRMED naming defect.** The shipped semver sequence reads `v0.7.0 → v7.5 → v0.7.6 → v0.7.7`. A tool sorting tags lexically or numerically derives a wrong newest release; a tool reading headings derives a `0.7.5` that has no tag. `مثبت` |
| **D5** | HIGH | `AGENT.md:20-24` "Current state — Branch `wt/v04-program` … `HEAD` is `53275ec` … The newest tag is `v0.3.0` … No `v0.4.0` tag and no `v0.4.0` entry in the changelog were observed" | Live: branch `wt/vta-factory-p0`, `HEAD c7c762c` (`git log -1`), 12 tags with the newest at `v0.7.7` (CMD1, CMD2), and `CHANGELOG.md:763` carries an `[0.4.0]` entry | **CONFIRMED stale state block.** The file's own task log contradicts its Current-state section. `مثبت` |
| **D6** | MEDIUM | `CHANGELOG.md:16-17`, `:170-171`, `:370-371` — "no `[0.7.x]` link reference was added below" | Link-reference block ends at `CHANGELOG.md:1344-1353`: `[Unreleased]`, `[0.7.0]`, `[0.6.5]` … `[0.1.0]`. No `[0.7.5]`, `[0.7.6]`, `[0.7.7]`; `[Unreleased]` still compares from `v0.7.0` (`:1344`) | **CONFIRMED.** Three released versions have no link reference and the Unreleased baseline is three versions stale. `مثبت` |
| **D7** | MEDIUM | `CHANGELOG.md:10` — `[Unreleased]` is empty | Four commits exist after `v0.7.7` (`git log v0.7.7..HEAD`: `c7c762c`, `66d0e45`, `772c693`, `0eed6a1`), plus 54 uncommitted porcelain entries; lock moved 138→157 in that span (`AGENT.md:220`) | **CONFIRMED undocumented change.** Substantial post-release work has no changelog entry. `مثبت` |
| **D8** | MEDIUM | `README.md:252-263` — "`kit/kit.lock` pins **112 components with an empty `pending` list**: 31 tier `core` and 81 tier `conditional`" and "80 `verified` and 32 `unverified`" | Live lock: 157 components + 9 pending; 32 core / 125 conditional; 80 verified / 77 unverified (node read of `kit/kit.lock`; `docs/09-KIT-LOCK.md:7` already states 157/32+125) | **CONFIRMED stale census.** Already known as a carried residual (`AGENT.md:242` ROOT CLUSTER). `مثبت` |
| **D9** | MEDIUM | `docs/18-THEMES.md:21-26` — mapping table holds only `blazar` plus three RESERVED rows (`plan-replacement`, `project-prep`, `exploration`); `:28` calls `blazar` "the manager-only orchestrator" | `CHANGELOG.md:377-389` — AETHER/PULSAR leaders and themes `vantrilex-aether` / `vantrilex-pulsar` shipped at 0.7.5; `CHANGELOG.md:177-198` — BLAZAR retooled to Build Leader at 0.7.6; live disk holds 4 theme JSON files | **CONFIRMED stale doc.** The theme mapping and the BLAZAR role both lag the shipped tree. `مثبت` |
| **D10** | LOW | `kit/kit.lock` and `kit/kit.lock.schema.json:8-18` — lock identity is `kit: "vantrilex-core"` + `lockfileVersion: 1` | The kit's own version exists only in git tags and changelog headings (CMD1, CMD5) | **CONFIRMED structural gap.** No file in the lock chain answers "which kit version is this". Version identity depends entirely on git, which is why D4 propagates. `مثبت` |
| **D11** | LOW | `docs/16-TASK-DISPATCH.md` still carries 112-era figures (recorded residual, `AGENT.md:237`) | Live lock 157 (`docs/09-KIT-LOCK.md:7`) | **CONFIRMED carried residual, outside this node's write scope.** `مثبت` |

**Not a defect, explicitly checked and refuted:** the dispatch's example "CHANGELOG 'PARKED, UNRELEASED' labels for 0.7.5/0.7.6/0.7.7 while tags v0.7.6/v0.7.7 exist" is **confirmed for 0.7.6 and 0.7.7** and **partially true for 0.7.5** (no `v0.7.5` tag; a `v7.5` tag exists). No further version drift was found in `CHANGELOG.md` headings against `git tag` beyond `v7.5` — the other 11 tags match their headings exactly (CMD6).

---

## 4. Handoff — what the two feature-audit nodes may trust

1. **Release truth:** use `git tag` (CMD1) plus `AGENT.md:288-290`. Do **not** use the `PARKED, UNRELEASED` status lines at `CHANGELOG.md:12-18`, `:167-173`, `:367-373` — they are stale (D1–D3).
2. **Feature content at a release:** the body of each `CHANGELOG.md` section is usable; its census numbers are snapshots of that release and are not live (D7, D8).
3. **Program labels:** cite `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md:74,125,170,217,263,297` and label them **plan-only**. Never convert a program label into a shipped version.
4. **Current census:** 157 lock components + 9 pending, 32 core / 125 conditional, 80 verified / 77 unverified; catalog 2,931 records across 16 kinds; agents 27 files; skills 37 folders; commands 18 + 4.
5. **Version-qualified answers:** no dispatch in this lane names a kit version, so downstream nodes must obtain one before issuing a version-qualified catalog claim; the series in §1 is the only defensible basis for choosing it.

---

## 5. Bounds observed

- Zero edits outside `.opencode/audit/V87-ENUM.md`; `docs/spec/v87/**` untouched.
- No `git add`, no `git commit`, no `git push`, no tag operation.
- Zero secrets, zero pinned routing identity, zero color fields, zero model pins.
- Zero catalog ids emitted; the integrity gate therefore had nothing to resolve and nothing was invented.
- Missing-tooling protocol not needed: every required command ran and exited 0; `git ls-remote` succeeded. Checks not run (`tsc`, `shellcheck`, `markdownlint`, hook dry-runs, probe battery) are marked as pointers, never as passes.
- Routing used: cheap path for tag/heading extraction; escalated reasoning only for the CHANGELOG-vs-AGENT.md contradiction and the `v7.5` name collision.

Ponytail: curation spirit binding (FULL binds code-writing nodes only; this node wrote no code) — evidence: 12/12 tags enumerated, 13/13 CHANGELOG headings listed, four read-only verifiers exit 0, one artifact written, zero drift repaired.
