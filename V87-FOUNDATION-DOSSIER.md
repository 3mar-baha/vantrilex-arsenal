# V87-FOUNDATION-DOSSIER — Version Series, Feature Verification, Metadata Defects (v0 to v8.6, Phase 0A)

- **Lane:** V87-AETHER-EXECUTE (owner-commissioned execution of the amended AETHER MISSION-PLAN; all other lanes parked).
- **Node:** `d-found` (wave 2 of 3; `depends_on` `v-enum` + `v-features-1` + `v-features-2` — all landed and locked). Deliverable author.
- **Owner:** vantrilex-scribe (worker-only seat).
- **Classification:** DIRECTED node — Scenario 2 does NOT apply. No plan change, no re-dispatch, no repair.
- **Package position:** output #1 of the owner package (v0 to v8.6 verification, Phase 0A). Siblings, not consolidated here: `V87-COLOR-AUDIT.md` (`d-color`), `V87-DEFECTS.md` (`d-defects`), `V87-PLAN-ZERO-TO-87.md` (`d-plan`) — the package order is set at `WORKFLOW.md:71` and `:79`.
- **Date of evidence:** 2026-10-18.
- **Evidence basis:** live working tree, `HEAD = c7c762c21f12e2dccba32611d990ad8a0f059b80`, branch `wt/vta-factory-p0`; the four read-only inputs (`.opencode/audit/V87-ENUM.md`, `.opencode/audit/V87-FEATURE-AUDIT-1.md`, `.opencode/audit/V87-FEATURE-AUDIT-2.md`, `.opencode/audit/V87-INPUT-RECEIPT.md`); plus this node re-derivation set in section 5. Read-only git only: no `add`, no `commit`, no `push`, no tag.
- **Consolidation rule (binding on this artifact):** one row per feature; every row cites the owning audit plus a `file:line` or a quoted command with its exit; **statuses are quoted from the shards and never re-graded**; no new claim is introduced. Where this node observed something the shards did not, it carries its own command and is labelled an observation, never a verdict.
- **Honesty labels:** `مثبت` = proven by a command quoted here or an exact `file:line` read. `~تقديري` = best-evidenced estimate, stated as such, never promoted to fact. **Language deviation (recorded, not silently dropped):** `AGENTS.md` hard rule 5 makes this repository English-only, so this node drafts **no Arabic mirror**; the lane-mandated honesty labels (`مثبت` / `~تقديري`) are retained verbatim because the acceptance names them (same deviation recorded at `V87-PLAN-ZERO-TO-87.md:20`).
- **Scope of write:** this file only (`V87-FOUNDATION-DOSSIER.md`, repo root). Audit artifacts read-only; `kit/kit.lock`, `registry/**` and generated surfaces untouched; state files neither; no git writes.

## 0. Method and honesty header

### 0.1 Version-series basis (what "v0 to v8.6" means here)

- **Shipped series:** `v0.1.0` to `v0.7.7` — **12 annotated tags**, one of them named `v7.5` (V87-ENUM CMD1/CMD2/CMD7; re-counted by this node, section 5 SC-1). The shipped series stops at `v0.7.7`; no shipped tag exists above it under any naming (V87-ENUM section 1.1).
- **Program series:** `v0.8` to `v8.6` — **plan prose only.** Every label is a quoted line of `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md`, an archived plan whose own header says "plan only, then STOP ... No execution is ordered" (`:3-5`, per V87-ENUM section 1.2). Zero tags and zero CHANGELOG headings carry a program label.
- **Supersession rule (this dossier selection rule):** each feature is reported at its **latest superseding state only**. The audit trail (introduced version, intermediate states) stays in `CHANGELOG.md` and in the two shard audits, which this dossier cites rather than restates; nothing is silently dropped, because a row whose latest state supersedes an earlier one names both.
- **Status vocabulary:** exactly `WORKING` / `DEGRADED` / `BROKEN`, as the shards use them. `مثبت` marks a command- or `file:line`-backed cell; `~تقديري` marks a thin-evidence cell.
- **Series separation ruling (quoted from V87-ENUM section 1.3, and binding on every table below):** "**Shipped series:** `v0.1.0` ... `v0.7.7` (12 tags, one of them misnamed `v7.5`). **Program series:** v0.8 to v8.6, archived plan only, zero tags, zero changelog entries."

### 0.2 Verdict headline — PARTIAL (carried from the shards, not recomputed)

- **Consolidation verdict: PARTIAL.** Neither shard is silently promoted here.
- **Shard A (surfaces) — PARTIAL (3 surfaces skipped), every executed check exit 0:** nine executed gates 9/9 PASS and 0 FAIL (`verify-skills` 10/10, `verify-kit` 22/22, `verify-registry` 7/7, catalog `--check` all-ok, repo `tsc --noEmit` exit 0, guards strict `tsc` exit 0, arsenal load smoke exit 0, guards load smoke exit 0, findings probe 45/45 exit 0) [V87-FEATURE-AUDIT-1 section 0 and section 1].
- **Shard B (data/process) — FAIL on gate 9 (markdownlint), 7 PASS, 1 SKIPPED:** the shard-B must-run set (kit, catalog, registry, counts, link sweep, `bash -n` + `shellcheck`, CI trigger) is all green; the failure is docs hygiene over the changed Markdown [V87-FEATURE-AUDIT-2 section 0 and section 1].
- **This dossier own executed re-derivation is green** (four verifiers exit 0, section 6 G1 to G4) **and its own file-level lint ran on the written file**: the first pass returned exit 1 with 10 findings, all inside table cells; the minimal cell fixes were applied and the re-run returns **exit 0** (section 6 G6 records both passes and the earlier false-green trap). A check that could not run is recorded as not-run, never as a pass.

**Honest note — skipped surfaces, named once.** They will still be skipped in the W3 pass unless someone sequences them:

| Skipped surface | Where recorded | Exact reason |
|---|---|---|
| `markdownlint` (seat level) | V87-FEATURE-AUDIT-1 G11 | `command not found` on that seat; the tree own prior runs used `npx --yes markdownlint-cli`; not run because `npx` may fetch from the network |
| `markdownlint` (changed Markdown) | V87-FEATURE-AUDIT-2 gate 9 | **ran and FAILED** — exit 1, "Summary: 3 issues in 2 files" (`AGENT.md:108:280` MD037, `AGENT.md:203:302` MD037, `WORKFLOW.md:76` MD032) |
| Command **runtime expansion** | V87-FEATURE-AUDIT-1 G12 | no command-execution harness exists on the seat; static template only |
| **Delta** (new versus base) | V87-FEATURE-AUDIT-1 G13 (not run); V87-FEATURE-AUDIT-2 section 0 (content level only) | no clean-checkout base re-run was possible without writes outside the artifact; the merge base was resolved read-only at `772c693a5aa8e8ab4045d69ba46c745cef19bc85` |
| Probe battery | V87-FEATURE-AUDIT-2 gate 8 | no probe named by the shard-B dispatch; the harness writes findings files outside that node single-write scope |

Consequence, stated plainly: the same tool (`markdownlint`) is "unavailable" in one shard and "exit 1" in the other in the same lane on the same day, and the delta was never computed against a clean base. Nothing in this dossier may be read as having passed those surfaces.

### 0.3 Census basis — the numbers, and how the shards own counts reconcile

`مثبت` (arithmetic over the audit rows, each quoted in section 2; no status is changed by this reconciliation):

- **Shard A ledger rows = 29** (A1 to A7 = 7, B1 to B7 = 7, C1 to C7 = 7, D1 to D8 = 8). Row-by-row first-listed statuses: **22 WORKING, 6 DEGRADED, 1 BROKEN** (the BROKEN row C6 covers **two** command files).
- **Shard A headline = 28 features — "21 WORKING, 5 DEGRADED, 2 BROKEN"** [V87-FEATURE-AUDIT-1 section 0]. Reconciliation, exactly: row **B3** folds into the registration-coverage bullet (its own status line reads "DEGRADED (registration, see B7)"), taking 29 rows to 28; the **A6 + B7** pair is one headline bullet, minus 1; the BROKEN **C6** is counted as its **two** files, plus 1. Result: 28 counted features = 21 W (22 rows minus B3) + 5 D (6 rows minus the A6/B7 merge) + 2 B (the two broken command files).
- **Shard B ledger rows = 7** (printed `B1` to `B7` in the audit; `SB1` to `SB7` in the disambiguated column of section 2.5). The shard own summary table labels **3 WORKING** (B1 kit lock, B2 sidecars, B3 catalog mirror) and **4 DEGRADED** (B4 docs machinery, B5 CI surface, B6 release/tag discipline, B7 spec provenance set) [V87-FEATURE-AUDIT-2 section 2 summary table].
- **Consolidated rows in section 2 = 36** (29 + 7), statuses as the shards wrote them. The brief "2 BROKEN and 7 DEGRADED" describes shard A: **2** broken command *files* (row C6) and **7** rows carrying a DEGRADED label (A6, B3, B4, B5, B7, C4, D8). Shard B adds **4** DEGRADED rows. Dossier totals: **1 BROKEN row (2 files)** and **11 DEGRADED rows**.

### 0.4 Downstream reading rules (quoted from V87-ENUM section 4, binding on any consumer)

1. **Release truth:** use `git tag` (V87-ENUM CMD1) plus `AGENT.md:306-308` (line drift: ENUM measured `AGENT.md:288-290`; live file +18 → `:306-308` — re-verified at write time). Do **not** use the `PARKED, UNRELEASED` status lines at `CHANGELOG.md:12-18`, `:167-173`, `:367-373` — they are stale (D1 to D3).
2. **Feature content at a release:** the body of each `CHANGELOG.md` section is usable; its census numbers are snapshots of that release and are not live (D7, D8).
3. **Program labels:** cite `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md:74,125,170,217,263,297` and label them **plan-only**. Never convert a program label into a shipped version.
4. **Current census:** 157 lock components + 9 pending, 32 core / 125 conditional, 80 verified / 77 unverified; catalog 2,931 records across 16 kinds; agents 27 files; skills 37 folders; commands 18 + 4.
5. **Version-qualified answers:** no dispatch in this lane names a kit version, so downstream nodes must obtain one before issuing a version-qualified catalog claim; section 1 is the only defensible basis for choosing it.

## 1. VERSION TABLE (compact, from V87-ENUM)

### 1.1 Shipped series — 12 tags

Basis per V87-ENUM section 1.1: the tag plus the CHANGELOG heading carried **inside that tag own tree** (CMD6), plus the live heading line for navigation. All rows `مثبت` in V87-ENUM.

| # | Tag | Tag date (+03:00) | CHANGELOG heading (live `file:line`) | Basis verdict |
|---|---|---|---|---|
| 1 | `v0.1.0` | 2026-10-04T19:18:07 | `CHANGELOG.md:1327` | tag and heading agree |
| 2 | `v0.2.0` | 2026-10-04T23:17:32 | `CHANGELOG.md:1207` | tag and heading agree |
| 3 | `v0.3.0` | 2026-10-12T13:44:18 | `CHANGELOG.md:825` | tag and heading agree |
| 4 | `v0.4.0` | 2026-10-14T07:29:26 | `CHANGELOG.md:763` | tag and heading agree |
| 5 | `v0.4.1` | 2026-10-14T08:19:57 | `CHANGELOG.md:735` | tag and heading agree |
| 6 | `v0.5.0` | 2026-10-15T06:24:32 | `CHANGELOG.md:674` | tag and heading agree |
| 7 | `v0.6.0` | 2026-10-15T07:47:27 | `CHANGELOG.md:623` | tag and heading agree |
| 8 | `v0.6.5` | 2026-10-15T08:07:08 | `CHANGELOG.md:597` | tag and heading agree |
| 9 | `v0.7.0` | 2026-10-15T10:11:53 | `CHANGELOG.md:513` | tag and heading agree |
| 10 | **`v7.5`** | 2026-10-15T17:21:30 | `CHANGELOG.md:367` = `[0.7.5]` | **tag name differs from heading version** |
| 11 | `v0.7.6` | 2026-10-15T17:24:56 | `CHANGELOG.md:167` | agree; heading status stale |
| 12 | `v0.7.7` | 2026-10-15T17:29:35 | `CHANGELOG.md:12` | agree; heading status stale |

- Release order is tag-date order: `v7.5`, then `v0.7.6`, then `v0.7.7`, matching the owner order at `AGENT.md:291` ("sequential release v7.5 (tag name as ordered) to v0.7.6 to v0.7.7") [V87-ENUM section 1.1].
- The shipped series **stops at `v0.7.7`**, all 12 tags are annotated (V87-ENUM CMD7), and the three newest tags are published to `origin` (CMD8) [V87-ENUM section 1.1].

### 1.2 Program series — plan-prose-only labels

| Phase | Program label | Basis (quoted plan line, `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md`) |
|---|---|---|
| P0 | `v0.8` | `:74` "## 5 — Phase P0 v0.8: charter + makers + A1 identity fix" |
| P1 | `v0.9 to v2.x` | `:125` "## 6 — Phase P1 v0.9 to v2.x: eval-driven polish over all 1530 skills" |
| P2 | `v3.x to v5.x` | `:170` "## 7 — Phase P2 v3.x to v5.x: agent polishing plus Crucible intake" |
| P3 | `v6.x to v8.4` | `:217` "## 8 — Phase P3 v6.x to v8.4: MCP admission plus profile gear plus soak" |
| P3 sub | `v7.x` gear, `v8.0` to `v8.4` soak | `:223`, `:247-248` (quoted in V87-ENUM section 1.2) |
| P4 | `v8.5` | `:263` "## 9 — Phase P4 v8.5: maturity gate" |
| P5 | `v8.6` | `:297` "## 10 — Phase P5 v8.6: convergence demonstration" |
| scope | P0 to v8.6 | `:14` "The factory program P0 to v8.6 is the SOLE focus" |

**Ruling:** the program series lives only in plan artifacts and never entered `git tag` or `CHANGELOG.md`; the single program-label-shaped artifact that reached git is the tag `v7.5`, and it is **not** a program-phase release (its own tree carries the shipped `[0.7.5]` heading) [V87-ENUM section 1.2, re-verified in section 5 SC-4].

## 2. FEATURE VERIFICATION TABLE — every feature from both shards

Basis: this table consolidates **all** rows of `V87-FEATURE-AUDIT-1.md` (section 2, groups A to D) and `V87-FEATURE-AUDIT-2.md` (section 2). Statuses are quoted, never re-graded; evidence cells carry the shard `file:line`, command and exit. Long cells are compressed but never added to.

| # | Shard row | Feature | Introduced | Latest / superseding state | Status | Evidence (file:line, command, exit) |
|---|---|---|---|---|---|---|
| 1 | A · A1 | Primary leaders `aether`, `blazar`, `pulsar` | ENUM row 1: leaders at `v0.7.5` and `v0.7.6` (`CHANGELOG.md:377-389`, `:177-198`) | 3 files, `name` equals stem, `mode: primary` on line 4 of each | **WORKING** `مثبت` | `aether.md:2-4`, `blazar.md:2-4`, `pulsar.md:2-4`; `node scripts/verify-kit.mjs` row `agent-mode-explicit` "27 agent files declare mode explicitly (24 subagent)", exit 0. Missing check named: no runtime load probe exists for primary-mode agents |
| 2 | A · A2 | Role agents `vantrilex-leader`, `vantrilex-guide`, `vantrilex-implementer` | ENUM row 1: role agents at `v0.2.0` (`CHANGELOG.md:1246`) | 3 files, `name` equals stem, `mode: subagent` line 4; all three modified in the dirty tree | **WORKING** `مثبت` | line dump (`vantrilex-leader.md:2,3,4` etc.); `verify-kit` row `agent-mode-explicit` exit 0 |
| 3 | A · A3 | Worker subagent roster (remaining 21 files, including the 7 untracked replacements) | ENUM row 2: roster from `v0.7.0` (`CHANGELOG.md:517-532`); the 7 replacements have no git addition, so the introduction version is ENUM `~تقديري` | 21 files, all `mode: subagent`, `name` equals stem | **WORKING** `مثبت` | line dump (all 21); `verify-kit` `agent-mode-explicit` exit 0; `git status --porcelain -- .opencode/agents` shows 7 `??` new and 7 deleted (`D`) files |
| 4 | A · A4 | Retired agent files removed (7) | ENUM row 3: dual supersession at `v0.7.0` (`CHANGELOG.md:551-558`) | 7 files absent from the worktree, 7 replacements present | **WORKING** `مثبت` | `git status --porcelain -- .opencode/agents` returns 7 deleted (`D`) rows; the supersession did not propagate to row 20 (C6, BROKEN) |
| 5 | A · A5 | Agent frontmatter standard (`name` equals stem, `mode` explicit, description present, no routing pin) | `CHANGELOG.md:698` "Agents moved to canonical `.opencode/agents/`" (v0.6.0 era) | 27/27 pass; 24 `mode: subagent`, 3 `mode: primary` | **WORKING** `مثبت` | node frontmatter dump `count=27 BAD=0`; `verify-kit` `agent-mode-explicit` exit 0; the one repo-wide `model:`-shaped grep hit is a type member at `.opencode/plugin/arsenal.ts:143`, not a routing pin |
| 6 | A · A6 | Agent registration coverage | ENUM row 2 (roster and lock `pending` block reported together) | 7 of 27 agent files have **no** `kit.lock` row and **no** `registry/catalog.json` record: `vantrilex-agent-maker`, `-guide`, `-implementer`, `-kit-maintainer`, `-leader`, `-puller`, `-uploader` | **DEGRADED** `مثبت` | node set analysis exit 0: `DISK AGENT FILES NOT IN LOCK (7)` and `DISK AGENTS NOT IN agents.jsonl (7)`; pre-existing for the three role agents (`git show HEAD:kit/kit.lock` matched no agent row) |
| 7 | A · A7 | Agent load convention | `CHANGELOG.md:698` | Files live at `.opencode/agents/<stem>.md` with YAML frontmatter; no `.opencode/agent/` singular directory exists (`Test-Path` returns False) | **WORKING** `مثبت` static; `~تقديري` runtime | 27/27 paths resolve; `verify-kit` `per-kind/agents` "20 self-sourced lock agents resolve to .opencode/agents/<id>.md", exit 0 |
| 8 | A · B1 | Skill-file format standard, all 37 | ENUM row 4: four mechanism skills at `v0.2.0` (`CHANGELOG.md:1227-1232`) | 37/37 folders pass all ten format checks | **WORKING** `مثبت` | `node scripts/verify-skills.mjs`, exit 0, "totals: 10 checks — 10 passed, 0 failed, 0 skipped"; `ponytail` and `relay-protocol` carry extra files the gate accepts |
| 9 | A · B2 | Mechanism skills (`vantrilex-atomic-switch`, `-deep-understand`, `-design-variations`, `-doctrine`, `-prime`, `-vanguard`, `-workflow-forge`) | ENUM row 4: `v0.2.0` plus `v0.5.0` (`CHANGELOG.md:691`) | 7 folders, each `SKILL.md` only, `name` equals folder | **WORKING** `مثبت` | `name:` line dump 7/7; `verify-skills` exit 0 |
| 10 | A · B3 | Library skills (18 non-`vantrilex`, non-`vs-`, non-intake folders) | ENUM row 4 (`~تقديري` on library rows, less evidence) | 18 folders, format-clean; registration gap routed to row 14 | **WORKING** (format) / **DEGRADED** (registration, see B7) `مثبت` for format | `verify-skills` exit 0 with "37 skill folders"; class split by node enumeration (`library (18)`) |
| 11 | A · B4 | `vs-*` variant skills (8) | No changelog declaration and no git addition, so ENUM summary calls the supersession `~تقديري` | 8 `??` untracked folders; 5 of them carry a `description:` line byte-identical to their base skill | **DEGRADED** `مثبت` for the byte measurement | node byte check: `vs-circuit-breaker-guard` 268 = 268, `vs-github-release-packager` 342 = 342, `vs-preflight-system-doctor` 276 = 276, `vs-vantrilex-vanguard` 186 = 186, `vs-vantrilex-workflow-forge` 72 = 72; `vs-session-context-primer` 277 not 247 and `vs-ponytail` 198 not 143 differ; `vs-smithery` is an orphan; `git status` shows all eight `??`. Effect on model selection `~تقديري` |
| 12 | A · B5 | Intake skills (`vantrilex-intake-fetch`, `-send`, `-triage`) | ENUM row 15: no changelog entry, untracked, so `~تقديري` | 3 `??` folders, format-clean, no lock row, no catalog record | **DEGRADED** (registered-component view) / **WORKING** (file view) `مثبت` | `verify-skills` exit 0; node coverage check `skill catalog missing` includes all three; consumers gate intake skill count at `vantrilex-uploader.md:58` and `vantrilex-puller.md:60` ("between 1 and 4") |
| 13 | A · B6 | `relay-protocol` skill | ENUM row 15: `v0.7.7` (`CHANGELOG.md:38-57`) | 9 files on disk; deliberately unregistered (no lock row, no registry row, no `install_cmd`) | **WORKING** `مثبت` | file inventory 9 files with `SESSIONS.md` extra; `git ls-files --error-unmatch .opencode/skills/relay-protocol/SESSIONS.md` tracked, exit 0; `verify-skills` exit 0. Census drift: `CHANGELOG.md:38` says "8 files on disk"; deliberate non-registration documented at `CHANGELOG.md:44` |
| 14 | A · B7 | Skill registration coverage | ENUM row 4 and the lock/skill census | 19 of 37 folders have no `kit.lock` row; 16 of 37 have no `registry/catalog.json` record | **DEGRADED** `مثبت` | node set analysis exit 0: `DISK SKILL DIRS NOT IN LOCK (19)`, `skill catalog missing` (16 ids); five of the 19 are tracked (`git ls-files --error-unmatch` exit 0); only `relay-protocol` has a written deliberate-unregistered statement; pre-existing at `HEAD` |
| 15 | A · C1 | Command file set (22 files: 18 in `.opencode/commands/`, 4 in `.opencode/command/`) | ENUM row 5: `v0.6.0` "16 command files in total" (`CHANGELOG.md:627-634`); live 22 per `AGENT.md:228` | 22/22 have `description` on line 2, exactly one `$ARGUMENTS`, zero shell-exec lines, 22 unique stems | **WORKING** `مثبت` | node command dump exit 0 (`count=22`); `$ARGUMENTS` line numbers captured per file (for example `V-AETHER.md:11`, `V-Ai-Generated-Code-Security-Auditor.md:17`) |
| 16 | A · C2 | Argument guard on every command | same as C1 | 22/22 carry a fallback: 20 use "If that is empty", `V-HTML_DESIGN.md:16-19` uses a `Usage:` clause, `V-PROFILE.md:15-17` uses "With no subcommand, print the usage summary and stop" | **WORKING** `مثبت` | exact reads `V-PROFILE.md:15-17`, `V-HTML_DESIGN.md:16-19`, plus per-file `emptyGuard=true` in the node dump for the other 20 |
| 17 | A · C3 | Leader atomic-switch commands `V-AETHER`, `V-Blazar`, `V-PULSAR` | ENUM row 5: `v0.7.5` adds `V-AETHER` and `V-PULSAR` (`CHANGELOG.md:388-389`) | 3 files; each resolves its agent file and a real theme (`vantrilex-aether`, `vantrilex-blazar`, `vantrilex-pulsar`) | **WORKING** `مثبت` | reference scan exit 0: `badAgentRefs=[]`, `unreferencedThemes=[]` for all three; theme ids exist in `registry/themes/` |
| 18 | A · C4 | Role-switch commands `V-Vantrilex-Guide`, `V-Vantrilex-Implementer`, `V-Vantrilex-Leader` | `~تقديري` — no changelog line found; they follow the `v0.7.5` leader-switch pattern | 3 files; the agent file resolves, but the named theme is an unbuilt lock-pending row (`vantrilex-vantrilex-guide` / `-implementer` / `-leader`) | **DEGRADED** `مثبت` | `V-Vantrilex-Guide.md:2,21,23,42` and siblings — "Resolve the planned theme file `registry/themes/vantrilex-vantrilex-*.json`"; `registry/themes/` holds only 4 JSON files; `kit/kit.lock:171` documents the pending state, so it is a declared pending, not a silent break, but the command Step 2 cannot complete today |
| 19 | A · C5 | Consult commands, already remediated (4): `V-Architect`, `V-Code-Reviewer`, `V-Kit-Maintainer`, `V-Red-Team` | ENUM row 5 (`v0.6.0`); remediated in this dirty tree | 4 files; each references the existing `vantrilex-*` agent file | **WORKING** `مثبت` | reference scan exit 0: `badAgentRefs=[]` for all four; `git status` shows all four `M` |
| 20 | A · C6 | Consult commands, NOT remediated (2): `V-Technical-Writer`, `V-Ai-Generated-Code-Security-Auditor` | ENUM row 5 (`v0.6.0`), superseded at `v0.7.0` (ENUM row 3) | 2 files still instruct the model to read a **deleted** agent definition | **BROKEN** `مثبت` | `V-Technical-Writer.md:23,51` point at `.opencode/agents/technical-writer.md`; `V-Ai-Generated-Code-Security-Auditor.md:25,55` point at `.opencode/agents/ai-generated-code-security-auditor.md`; reference scan `badAgentRefs` non-empty, exit 0; neither file is modified in the dirty tree, so the break is pre-existing at `HEAD` |
| 21 | A · C7 | Operator and root commands (10): `V-CATALOG`, `V-DOCTOR`, `V-FULL-AUDIT`, `V-HTML_DESIGN`, `V-PROFILE`, `V-RAG`, `doctor`, `equip`, `prime`, `release` | ENUM row 5 (`v0.6.0`); root four from the operator set | 10 files; frontmatter and `$ARGUMENTS` guard present; no agent or theme reference to resolve | **WORKING** `مثبت` | node dump exit 0 (all `desc=ok args=1 bangLines=none`); `V-CATALOG.md:13`, `V-RAG.md:13`, `.opencode/command/release.md:12`; `V-PROFILE.md:15-17` guard. Missing check named: runtime expansion (G12) is not evaluated |
| 22 | A · D1 | `arsenal.ts` typecheck | ENUM row 6: plugin surface at `v0.2.0` (`CHANGELOG.md:1241-1245`) | `tsc --noEmit -p tsconfig.json` clean | **WORKING** `مثبت` | G5, exit 0, no output |
| 23 | A · D2 | `arsenal.ts` load smoke | same | default export is an object carrying both `setup` and `server` | **WORKING** `مثبت` | G7, exit 0, `setup=function server=function` |
| 24 | A · D3 | `vantrilex-guards.ts` strict typecheck | ENUM row 6 (`v0.7.5` detective plan-guard, `CHANGELOG.md:397-403`) | strict check with the file own documented flags, clean | **WORKING** `مثبت` | G6, exit 0 |
| 25 | A · D4 | `vantrilex-guards.ts` load smoke | same | plugin id `vantrilex-guards`, `setup` is a function | **WORKING** `مثبت` | G8, exit 0, `id=vantrilex-guards setup=function` |
| 26 | A · D5 | 45-check probe battery | ENUM row 10: probe battery grown 28 to 45 at `v0.4.1` (`CHANGELOG.md:743-744`) | 45/45 pass, temp-only writes | **WORKING** `مثبت` | G9, exit 0, "probe: 45 checks passed"; write scope proven at `arsenal.findings-probe.mjs:30,139,141-147,314-315,467-489` |
| 27 | A · D6 | Lock hook rows mapped to registered functions (7) | ENUM row 6 (`v0.2.0` six hooks plus docs guard; `v0.3.0` seventh `task-dispatcher`, `CHANGELOG.md:892-903`) | 7 lock hook rows each map to a named registered function | **WORKING** `مثبت` | `verify-kit` row `per-kind/hooks` quoted at G2, exit 0, plus call-site greps `arsenal.ts:2157,2182,2185,2192,2282,2314,2321,2254,2272,2328,2337`; all 7 rows also carry `verification: "unverified"` with `install_cmd: null`, which is about installability, not the mapping |
| 28 | A · D7 | Non-lock hooks: `docsDisciplineGuard`, the guards plan-guard, relay poll and watchdog | ENUM row 6 (docs guard explicitly "not a lock component"); relay at `v0.7.7` | docs guard registered on both `execute.before` sites; plan-guard registered by the carrier (`vantrilex-guards.ts:129,132`); relay pair registered **disabled** | **WORKING** `مثبت` | `vantrilex-guards.ts:129` delegates to `arsenalPlugin.setup(ctx)`; `.opencode/hooks/relay/relay-hooks.json:5,11,14,19` maps `relay-poll` and `relay-watchdog` both `"enabled": false` |
| 29 | A · D8 | `[arsenal] typescript-check` live emission | ENUM row 6 (`v0.2.0`); hook code at `arsenal.ts:1720-1786` | Direct invocation of the hook exact resolved command is green; the live host emission is recorded as FAIL | **DEGRADED — taxonomy unclassified** `مثبت` for the probe, `~تقديري` for the live fault | `node node_modules/typescript/lib/tsc.js --noEmit --pretty false -p tsconfig.json` returns exit **0**, no output; `Test-Path node_modules/typescript/lib/tsc.js` True; no `tsc` on `PATH`; recorded emission quoted from the lane state file at `AGENT.md:230` and `AGENT.md:236` ("unclassified, needs dedicated probe"); no state-file `typescript-check` line found offline |
| 30 | SB · B1 | Kit lock (157 components, 32 core / 125 conditional, 9 pending) plus lock schema | `v0.2.0` — 36 pinned Tier-0 entries (`CHANGELOG.md:1251-1252`; ENUM row 9) | `kit/kit.lock` carries `lockfileVersion: 1`, `kit: "vantrilex-core"`, `mcp_cap: 8` (`kit/kit.lock:1-5`); census 157 components and 9 pending, 32 core / 125 conditional, 80 verified / 77 unverified | **WORKING** | `node scripts/verify-kit.mjs` exit 0 — "lockfile-validates PASS 157 components and 9 pending entries validate against kit.lock.schema.json"; node read of the lock returns `{"components":157,"pending":9,"core":32,"conditional":125,"verified":80,"unverified":77}`; `docs/09-KIT-LOCK.md:7` agrees; the 9 pending rows each state a reason (`kit/kit.lock:164-173`). Carried gap: no kit semver (ENUM D10) |
| 31 | SB · B2 | Registry sidecars (16 JSONL) plus overlap map | `v0.2.0` (`CHANGELOG.md:1211-1218`; ENUM row 7) | 16 `registry/data/*.jsonl` files plus `registry/data/overlaps.yaml` (13,375 B); the generator maps the 16 kinds 1:1 (`scripts/generate-catalog-json.mjs:367-384`, merges at `:445-472`) | **WORKING** | `(Get-ChildItem registry/data -Filter *.jsonl -File).Count` returns 16; `node scripts/verify-registry.mjs` exit 0 — "orphan-references PASS 48 id references across 60 overlap entries all resolve"; "469425 bytes decode as strict UTF-8"; "duplicate-ids PASS 2931 ids, no collision within any kind" |
| 32 | SB · B3 | Catalog mirror (2931 records, 16 kinds) plus 16 per-kind indexes | `v0.2.0` (`CHANGELOG.md:1211-1215`; ENUM row 8); `--check` extended to every `_index.md` on 2026-10-18 (`AGENT.md:246`) | `registry/catalog.json` `counts.total = 2931` over 16 kinds (`registry/catalog.json:5-22`); 16 `registry/<dir>/_index.md`; `registry/VANTRILEX_CATALOG.md` 469,425 B parsing as 16 sections and 2931 rows; `registry/formatting/_index.md` is hand-authored and reported skipped, never regenerated | **WORKING** (generated-surface text integrity separately DEGRADED — see F3) | `node scripts/generate-catalog-json.mjs --check` exit 0 (17 check lines (registry/catalog.json + registry/VANTRILEX_CATALOG.md + 15 generated per-kind indexes) plus 1 named skip); `verify-registry.mjs` exit 0 — "schema-conformance PASS 2931 records", "row-count-integrity PASS 16 sections, 2931 rows" |
| 33 | SB · B4 | Docs machinery (numbering plus link health) | `v0.2.0` 16-file docs set (`CHANGELOG.md:1255`); `v0.4.0` `AGENT.md` living state (`:772-775`); `v0.5.0` `docs/dev/` and `docs/ar/` (`:691-697`); 2026-10-18 archive move and census sync (`AGENT.md:229-252`) | 22 root docs `docs/00-INDEX.md` to `docs/21-PONYTAIL-COMPLIANCE.md`, numbering 00 to 21 with zero gaps and zero duplicates, every one linked from the index (`docs/00-INDEX.md:30-51`); 92 Markdown files under `docs/`; repo-wide Markdown 3081 files | **DEGRADED** | numbering probe returns `rootDocs=22 first=00-INDEX.md last=21-PONYTAIL-COMPLIANCE.md numberingGaps=[] notLinkedFromIndex=[]`; link sweep exit 0 returns `files=3081 totalLinks=619 external=295 anchorOnly=1 relative=323 resolved=312 broken=11` (312 of 323 relative links resolve); census is timestamp-bounded (a later re-run returned 13 breaks on the live tree); 10 breaks are archive-internal in `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md`, 1 is the generated mirror link `registry/VANTRILEX_CATALOG.md:1593`; plus the stale CHANGELOG link references (ENUM D6) |
| 34 | SB · B5 | CI surface (`.github/workflows/ci.yml` triggers and steps versus documented gates) | `v0.2.0` — seven shell scripts plus CI and release workflows (`CHANGELOG.md:1248-1250`; ENUM row 12) | `ci.yml:3-6` "push: branches [main]" plus `pull_request`; `release.yml:3-5` "tags: ['v*']" plus the job guard; four jobs lint (`ci.yml:12-50`), verify (`:52-78`), types (`:80-105`), build (`:107-175`) | **DEGRADED** — see F4 (dead checkpoint step; no CI step for `verify-skills.mjs`; mode assertion covers seven of eight scripts) | workflows quoted (`ci.yml` 175 lines, 5,904 B; `release.yml` 2,009 B); documented-gate agreement `docs/14-CI-RELEASE.md:12-15`, `docs/08-VERIFICATION.md:78-80,88-91,99-100`; independent re-runs of the same lint, verify and type surfaces (gates 5 to 7) all exit 0 |
| 35 | SB · B6 | Release machinery (`scripts/release.sh`) plus tag discipline | `v0.2.0` (`CHANGELOG.md:1248-1250`); `v0.3.0` tag annotation states "release pipeline repaired"; `v0.7.0` prep-only Releaser boundary (`:567-578`) | `scripts/release.sh` is 150 lines, mode 100755, `#!/usr/bin/env bash`, carries a `Usage:` block (`:14-17`, `:34-45`); refuses a dirty tree (`:105`); creates the annotated tag (`:128`); pushes then `gh release create` (`:140`); reports the one unrecoverable partial state (`:134`). Tag discipline: 12 tags all annotated; `v7.5` breaks the semver sequence and there is no `v0.7.5` tag | **WORKING for the script, DEGRADED for tag discipline** (the shard own section 2 summary table renders this row **DEGRADED** — carried note 4.5) | `bash -n scripts/release.sh` exit 0; `shellcheck scripts/release.sh` exit 0; `bash -c './scripts/release.sh --help >/dev/null 2>&1; echo rc=$?'` returns `rc=0`; `git ls-files -s scripts/release.sh` returns `100755`; `git tag` returns 12; `git cat-file -t` over all 12 returns `tag`; `git tag -l v0.7.5` returns empty. The end-to-end publish path was not run |
| 36 | SB · B7 | `docs/spec/v87` provenance set presence | 2026-10-18, this lane research hand-off; carries no CHANGELOG entry (`~تقديري` on any version label, because there is none) | 7 files present, 101,690 B total (`instagram-v8.7-context.md` 1,869 B to `worker-5-human-gates.md` 13,104 B); each header names its date (2026-10-18) and its corpus or method | **DEGRADED — present on disk, absent from version control** | `git ls-files docs/spec/v87` returns 0 entries; `git status --porcelain` reports `?? docs/spec/v87/`; `git check-ignore -v docs/spec/v87/SYNTHESIS-v8.7.md` exits 1 (not ignored, just untracked); digest and line-count agreement recorded at `V87-INPUT-DIGESTS.md:16,21,22` |

**Namespace note.** Shard A uses `A`/`B`/`C`/`D` groups (rows `A1` to `D8`); shard B prints its seven rows as `B1` to `B7`. The `Shard row` column disambiguates (`A · B1` is the skills format row; `SB · B1` is the kit-lock row). V87-ENUM `D1` to `D11` in section 3 are a **different namespace**: metadata defects, not feature rows.

### 2.6 Flag index — BROKEN and DEGRADED rows, explicitly

**BROKEN — 1 row, 2 files:**

- `A · C6` — `V-Technical-Writer.md:23,51` and `V-Ai-Generated-Code-Security-Auditor.md:25,55` point at deleted agent definitions. Bucket **kit-defect**; pre-existing at `HEAD`; routes to kit maintainer; repaired by no node [V87-FEATURE-AUDIT-1 F-A1].

**DEGRADED — shard A, 7 rows:**

- `A · A6` — 7 agent files with no lock row and no catalog record (F-A3).
- `A · B3` — 18 library skill folders: format WORKING, registration DEGRADED (defers to B7).
- `A · B4` — `vs-*` class: 5 byte-identical descriptions, 1 orphan, none declared (F-A5).
- `A · B5` — 3 untracked intake skill folders, unregistered.
- `A · B7` — 19 skill folders without lock rows, 16 without catalog records (F-A4).
- `A · C4` — 3 role-switch commands whose theme file is a lock-pending row (F-A2).
- `A · D8` — `[arsenal] typescript-check` live emission; taxonomy **unclassified** (F-A7).

**DEGRADED — shard B, 4 rows:**

- `SB · B4` — docs link health: 312 of 323 relative links resolve, 11 broken, plus stale CHANGELOG link references (F2).
- `SB · B5` — CI surface: permanently skipped checkpoint step, no `verify-skills` step, mode assertion covers 7 of 8 scripts (F4).
- `SB · B6` — `v7.5` breaks the semver sequence; no `v0.7.5` tag (ENUM D3, D4).
- `SB · B7` — provenance set untracked, pinned by no commit (F5).

Carried in shard B as degradations of a surface rather than feature rows: **F3** (truncated URLs in the generated mirror at `registry/VANTRILEX_CATALOG.md:1005`, `:1593`, `:2418`; pre-existing) and **F1** (the markdownlint FAIL recorded in section 0.2).

Verbatim gate-9 failure lines, as the shard recorded them:

```text
AGENT.md:108:280 error MD037/no-space-in-emphasis Spaces inside emphasis markers [Context: "* a"]
AGENT.md:203:302 error MD037/no-space-in-emphasis Spaces inside emphasis markers [Context: "* a"]
WORKFLOW.md:76 error MD032/blanks-around-lists Lists should be surrounded by blank lines [Context: "- W0 (4 parallel, disjoint art..."]
Summary: 3 issues in 2 files  (markdownlint-cli2 v0.23.3 / markdownlint v0.41.1; Linting: 47 files)
```

## 3. METADATA DEFECTS (D1 to D11, quoted from V87-ENUM section 3)

`D1` to `D5` are the HIGH-severity set; `D6` to `D11` follow. Each row restates the ENUM verdict with both evidence sides. Nothing is downgraded, and no severity is raised.

| ID | Severity | Claim A (evidence) | Claim B (evidence) | Verdict (V87-ENUM) |
|---|---|---|---|---|
| **D1** | HIGH | `CHANGELOG.md:12-18` — `[0.7.7]` is "PARKED, UNRELEASED (no tag, no publish)"; `:116-121` "no merge, no tag, no push, no publish"; `:164-165` "Confirm `git tag -l v0.7.7` prints nothing — parked means parked" | `git tag` lists `v0.7.7` (CMD1); remote carries it (CMD8); `AGENT.md:306` records "v0.7.7 RELEASED ... tag `v0.7.7` to commit `3d5d92aa...`, pushed; run `38751942204` success ... release published" | **CONFIRMED contradiction.** Released, changelog says parked. `مثبت` |
| **D2** | HIGH | `CHANGELOG.md:167-173`, `:328`, `:364` — `[0.7.6]` parked, "no tag", checklist expects `git tag -l v0.7.6` empty | `git tag` lists `v0.7.6`; remote carries it (CMD8); `AGENT.md:307` records the tag, the push, run `38751189927`, and published tarball `vantrilex-arsenal-v0.7.6.tar.gz` 2,094,918 B | **CONFIRMED contradiction.** `مثبت` |
| **D3** | HIGH | `CHANGELOG.md:367-373`, `:483`, `:510-511` — `[0.7.5]` parked, "no tag"; checklist expects `git tag -l v0.7.5` empty | No `v0.7.5` tag exists (CMD3), **but** `v7.5` does (CMD4), remote carries it (CMD8), and `AGENT.md:308` records tag `v7.5` to `e0f2be14...`, release published with `vantrilex-arsenal-v7.5.tar.gz` 2,084,077 bytes | **CONFIRMED contradiction of intent.** The section literal "no tag" is true only for the string `v0.7.5`; a release exists under `v7.5`. `مثبت` |
| **D4** | HIGH | Tag `v7.5` (CMD1, CMD4) | Heading `## [0.7.5]` in that tag own tree (CMD6); release artifact named `vantrilex-arsenal-v7.5.tar.gz` (`AGENT.md:308`); the owner order itself says "v7.5 (tag name as ordered)" (`AGENT.md:309`) | **CONFIRMED naming defect.** The shipped semver sequence reads `v0.7.0` then `v7.5` then `v0.7.6` then `v0.7.7`; a lexical or numerical sort derives a wrong newest release, and a tool reading headings derives a `0.7.5` that has no tag. `مثبت` |
| **D5** | HIGH | `AGENT.md:20-24` states "Current state — Branch `wt/v04-program` ... `HEAD` is `53275ec` ... The newest tag is `v0.3.0` ... No `v0.4.0` tag and no `v0.4.0` entry in the changelog were observed" | Live: branch `wt/vta-factory-p0`, `HEAD c7c762c`, 12 tags newest `v0.7.7` (CMD1, CMD2), and `CHANGELOG.md:763` carries an `[0.4.0]` entry | **CONFIRMED stale state block.** The file own task log contradicts its Current-state section. `مثبت`. See carried note 4.4: the quoted text is no longer present in the live file |
| D6 | MEDIUM | `CHANGELOG.md:16-17`, `:170-171`, `:370-371` — "no `[0.7.x]` link reference was added below" | Link-reference block ends at `CHANGELOG.md:1344-1353`: `[Unreleased]`, `[0.7.0]`, `[0.6.5]` to `[0.1.0]`; no `[0.7.5]`, `[0.7.6]`, `[0.7.7]`; `[Unreleased]` still compares from `v0.7.0` (`:1344`) | **CONFIRMED.** Three released versions have no link reference and the Unreleased baseline is three versions stale. `مثبت` |
| D7 | MEDIUM | `CHANGELOG.md:10` — `[Unreleased]` is empty | Four commits exist after `v0.7.7` (`c7c762c`, `66d0e45`, `772c693`, `0eed6a1`) plus uncommitted working-tree entries; lock moved 138 to 157 in that span (`AGENT.md:220`) | **CONFIRMED undocumented change.** Substantial post-release work has no changelog entry. `مثبت` |
| D8 | MEDIUM | `README.md:252-263` — "`kit/kit.lock` pins **112 components with an empty `pending` list**: 31 tier `core` and 81 tier `conditional`" and "80 `verified` and 32 `unverified`" | Live lock: 157 components and 9 pending; 32 core / 125 conditional; 80 verified / 77 unverified; `docs/09-KIT-LOCK.md:7` already states 157 (32 + 125) | **CONFIRMED stale census.** Already known as a carried residual (`AGENT.md:242` ROOT CLUSTER). `مثبت` |
| D9 | MEDIUM | `docs/18-THEMES.md:21-26` — mapping table holds only `blazar` plus three RESERVED rows; `:28` calls `blazar` "the manager-only orchestrator" | `CHANGELOG.md:377-389` — AETHER/PULSAR leaders and themes shipped at 0.7.5; `:177-198` — BLAZAR retooled to Build Leader at 0.7.6; live disk holds 4 theme JSON files | **CONFIRMED stale doc.** The theme mapping and the BLAZAR role both lag the shipped tree. `مثبت` |
| D10 | LOW | `kit/kit.lock` and `kit/kit.lock.schema.json:8-18` — lock identity is `kit: "vantrilex-core"` plus `lockfileVersion: 1` | The kit own version exists only in git tags and changelog headings (CMD1, CMD5) | **CONFIRMED structural gap.** No file in the lock chain answers "which kit version is this"; version identity depends entirely on git, which is why D4 propagates. `مثبت` |
| D11 | LOW | `docs/16-TASK-DISPATCH.md` still carries 112-era figures (recorded residual, `AGENT.md:237`) | Live lock 157 (`docs/09-KIT-LOCK.md:7`) | **CONFIRMED carried residual, outside the originating node write scope.** `مثبت` |

**Explicitly checked and refuted — not a defect** (quoted from V87-ENUM section 3): the dispatch example is "confirmed for 0.7.6 and 0.7.7 and partially true for 0.7.5 (no `v0.7.5` tag; a `v7.5` tag exists). No further version drift was found in `CHANGELOG.md` headings against `git tag` beyond `v7.5` — the other 11 tags match their headings exactly (CMD6)."

## 4. Carried notes (each recorded once, unsmoothed)

### 4.1 worker-5 declared versus actual line-count mismatch — carried, unresolved

Source: `.opencode/audit/V87-INPUT-RECEIPT.md` sections 1 and 4 (`:21`, `:163-178`).

- **Declared: 131 lines** (dispatch, `w5=131`). **Actual: 172 lines** (newline count 172, final line terminated; 13,104 bytes). **Delta: plus 41.**
- Recorded verdict: **mismatch**, unexplained by evidence in the input set. Five of the seven inputs match their declared counts; `instagram-v8.7-context.md` has no declared count.
- Refutations reproduced (facts, not inference): (1) not a counting-basis difference — non-blank lines in the file = 135, which is not 131, and no other file declared number aligns with its non-blank count either; (2) no in-set note explains it — a literal search for `131` across `docs/spec/v87/` returns 0 matches; (3) the file is structurally complete — section 5 opens at line 141 and section 6 at line 165, both past line 131.
- Consequence, unmoved: "Whether `worker-5` was amended after the dispatch declaration, or the declaration carried a stale number, is a dispatcher/owner decision." No node has reconciled it, and this dossier does not either. Re-confirmed by this node at section 5 SC-8. It is recorded once, here, and is not smoothed.

### 4.2 Shard-A census reconciliation (28 versus 29)

Recorded in section 0.3. Nothing was re-graded; the arithmetic is stated so the W3 re-derivation node does not rediscover it as a defect. The "2 BROKEN" count is **files**, the "5 DEGRADED" count is **headline bullets**, and the rows in section 2 preserve the shard own labels.

### 4.3 The same tool, two availability verdicts

`markdownlint` is `command not found` on the shard-A seat (G11) and `exit 1, 3 issues in 2 files` on the shard-B seat (gate 9) in the same lane on the same day. Neither shard artifact set is lint-clean by measurement: V87-FEATURE-AUDIT-2 section 4 records an incidental lint of `.opencode/audit/*.md` returning "Linting: 8 files / Summary: 6 issues in 3 files" (all MD038, at `V-FULL-AUDIT.md:968:33`, `V87-ENUM.md:271:254`, `V87-ENUM.md:271:297`, `V87-FEATURE-AUDIT-1.md:224:573`, `:225:374`, `:251:633`). Carried as an environment fact, not as a gate verdict.

### 4.4 ENUM D5 quoted text is no longer on disk (this node observation)

`مثبت` by scan on this node: `Select-String -Path AGENT.md -Pattern 'wt/v04-program|53275ec|The newest tag is'` returns **no** row for the D5-quoted phrases; the live block at `AGENT.md:20` reads: "Branch `wt/vta-factory-p0`, observed 2026-10-18. `HEAD` is `c7c762c` (the V-REMEDIATE park; parent `66d0e45`), pushed and remote-confirmed. The newest tag is `v0.7.7` ... The factory program P0 to P5 (`v0.8` to `v8.6` labels) lives only in plan prose, not as tags." `AGENT.md` shows as modified (`M`) in `git status`. Observation only: the working tree amended the stale block after V87-ENUM read it, so D5 quote survives inside V87-ENUM but not verbatim in the live file. Whether D5 is closed is the Guide call, not this node: the row is recorded so D5 is neither reported closed nor re-reported open without evidence.

### 4.5 Shard-B B6 status is composite in the audit

Shard B detailed row says "**WORKING for the script, DEGRADED for tag discipline**"; the shard own section 2 summary table renders the same row "**DEGRADED**". Both are quoted in section 2 row 35; no third label is invented and neither is dropped.

### 4.6 Provenance, index and staleness status of this artifact

- **Index:** `docs/00-INDEX.md` indexes the 22 root docs under `docs/` (`docs/00-INDEX.md:30-51`) and names no root-level artifact (`Select-String -Path docs/00-INDEX.md -Pattern 'V87|DOSSIER|root'` returns no rows, exit 0). This dossier is a repo-root deliverable like its three siblings, so no index entry is proposed and none is missing; indexing root artifacts is a dispatcher decision outside this node.
- **Staleness:** this artifact carries no `last_verified` field — the lane convention is `Date of evidence` (2026-10-18), matching the four inputs. No date was bumped or invented. Any future edit must re-run the section 5 checks rather than move the date.
- **Links:** no inline Markdown link is used anywhere in this dossier; every file reference is a code span, so the relative-link count for this file is 0 by construction — nothing to resolve, nothing broken. The lane 108/108 baseline is neither transcribed nor claimed here.

## 5. Spot-check ledger — this node re-derivation

Every row is a command this node ran on the live tree on 2026-10-18 (read-only). The quoted output and the exit are the claim; the source column names the artifact the fact was checked against.

| # | Fact checked | Source checked against | Command (verbatim) | Quoted output | Exit |
|---|---|---|---|---|---|
| SC-1 | 12 tags, newest `v0.7.7`, no `v0.7.5` | V87-ENUM CMD1, CMD2, CMD3 | `git tag` / `(git tag \| Measure-Object -Line).Lines` / `git tag -l v0.7.5` | 12 tag lines `v0.1.0` through `v0.7.7` plus `v7.5`; `count=12`; `git tag -l v0.7.5` returns no output | 0 |
| SC-2 | `PARKED, UNRELEASED` headings | V87-ENUM D1 to D3 | `Select-String -Path CHANGELOG.md -Pattern '^## \['` | `10: ## [Unreleased]`; `12: ## [0.7.7] — 2026-10-15 — PARKED, UNRELEASED (no tag, no publish; parked on branch wt/vta-expansion-03)`; `167: ## [0.7.6] ...`; `367: ## [0.7.5] ...` | 0 |
| SC-3 | No `[0.7.5]` / `[0.7.6]` / `[0.7.7]` link references | V87-ENUM D6 | `Select-String -Path CHANGELOG.md -Pattern '^\[0\.7\.[567]\]'` | no rows (0 matches); the reference block tail reads `[Unreleased]: .../compare/v0.7.0...HEAD`, `[0.7.0]: ...`, `[0.6.5]: ...` | 0 |
| SC-4 | Program labels are plan prose only | V87-ENUM section 1.2 | `(Get-Content docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md)[n-1]` for n in 74, 125, 170, 217, 263, 297 | `74: ## 5 — Phase P0 v0.8: charter + makers + A1 identity fix`; `125: ## 6 — Phase P1 v0.9 to v2.x: ...`; `170: ## 7 — Phase P2 v3.x to v5.x: ...`; `217: ## 8 — Phase P3 v6.x to v8.4: ...`; `263: ## 9 — Phase P4 v8.5: maturity gate`; `297: ## 10 — Phase P5 v8.6: convergence demonstration` | 0 |
| SC-5 | Two broken command references and their absent targets | V87-FEATURE-AUDIT-1 C6 and F-A1 | `Select-String -Path .opencode/commands/V-Technical-Writer.md -Pattern 'technical-writer\.md'` and the sibling scan | `23: Answer only from .opencode/agents/technical-writer.md, quoted —`; `51: 2. Source — .opencode/agents/technical-writer.md ...`; `25:` and `55:` for the security-auditor command; `targetA exists=False targetB exists=False` | 0 |
| SC-6 | Lock census 157 and 9, 32 and 125, 80 and 77 | V87-FEATURE-AUDIT-2 B1 (and section 3 D8) | `node -e` read of `kit/kit.lock` | `{"components":157,"pending":9,"core":32,"conditional":125,"verified":80,"unverified":77,"kit":"vantrilex-core","lockfileVersion":1}` | 0 |
| SC-7 | `relay-protocol` holds 9 files on disk | V87-FEATURE-AUDIT-1 B6 and F-A6 | `(Get-ChildItem .opencode/skills/relay-protocol -File).Count` | `9` | 0 |
| SC-8 | worker-5 declared 131 versus actual 172 | V87-INPUT-RECEIPT sections 1 and 4 | `node -e` newline count over `docs/spec/v87/worker-5-human-gates.md` | `newlines=172 bytes=13104` | 0 |
| SC-9 | Role-switch theme file absent from disk | V87-FEATURE-AUDIT-1 C4 and F-A2 | `(Get-Content .opencode/commands/V-Vantrilex-Guide.md)[22]` and `Get-ChildItem registry/themes -File` | output (quote): 1. Resolve the planned theme file `registry/themes/vantrilex-vantrilex-guide.json` through the atomic-switch install skill; themes directory holds `vantrilex-aether.json, vantrilex-atomic-switch.json, vantrilex-blazar.json, vantrilex-pulsar.json, _index.md` | 0 |
| SC-10 | `kit/kit.lock:171` pending theme reason | V87-FEATURE-AUDIT-1 C4 | `(Get-Content kit/kit.lock)[169..172]` | `{ "id": "vantrilex-vantrilex-guide", "kind": "theme", "reason": "Per-agent theme JSON not yet authored; ... once registry/themes/vantrilex-vantrilex-guide.json lands." }` | 0 |
| SC-11 | Stale README census (112 components, 31 core and 81 conditional) | V87-ENUM D8 | `(Get-Content README.md)[251..252]` | output (quote, inner markup stripped): kit/kit.lock pins 112 components with an empty pending list: 31 tier core and 81 tier conditional. | 0 |
| SC-12 | Stale theme mapping and BLAZAR role | V87-ENUM D9 | `(Get-Content docs/18-THEMES.md)[20..27]` | table rows `blazar / vantrilex-blazar / ACTIVE NOW` plus `plan-replacement`, `project-prep`, `exploration` all `none yet / RESERVED`; then "`blazar` is the manager-only orchestrator in `.opencode/agents/blazar.md`" | 0 |
| SC-13 | `docs/09-KIT-LOCK.md:7` states 157 as 32 plus 125 | V87-ENUM D8 and D11 | `(Get-Content docs/09-KIT-LOCK.md)[6]` | `157 components (32 tier core plus 125 tier conditional) with a pending list of` | 0 |
| SC-14 | D5 quoted stale block absent from live `AGENT.md` | V87-ENUM D5 | `Select-String -Path AGENT.md -Pattern 'wt/v04-program\|53275ec\|The newest tag is'` | one row only: 24: - Red-team findings remediation (53275ec, 1a03c09).; none of the three D5-quoted phrases; the live `AGENT.md:20` carries the corrected block | 0 |
| SC-15 | Tree state cited by all four inputs | V87-ENUM, AUDIT-1, AUDIT-2 headers | `git rev-parse HEAD` and `git branch --show-current` | `c7c762c21f12e2dccba32611d990ad8a0f059b80` and `wt/vta-factory-p0` | 0 |

## 6. Gate and lint status of this artifact

- **G1 — `node scripts/verify-registry.mjs`** returns `totals: 7 checks — 7 passed, 0 failed, 0 skipped` and `VERDICT: PASS — all 7 checks ran and passed. The registry is clean.` **exit 0** (this node run, 2026-10-18).
- **G2 — `node scripts/verify-kit.mjs`** returns `VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).` **exit 0**.
- **G3 — `node scripts/verify-skills.mjs`** returns `totals: 10 checks — 10 passed, 0 failed, 0 skipped` and `VERDICT: PASS — all 10 checks ran and passed. The skills are clean.` **exit 0**.
- **G4 — `node scripts/generate-catalog-json.mjs --check`** returns 17 check lines (registry/catalog.json + registry/VANTRILEX_CATALOG.md + 15 generated per-kind indexes) plus 1 named skip — `skip: registry/formatting/_index.md — hand-authored content is preserved, never generated`; **exit 0**.
- **G5 — path existence for the repository paths named here:** 73 paths enumerated, **73 present, 0 absent, exit 0** (re-run after the write, so the enumeration now includes this deliverable); a separate control confirms the two deleted supersession targets (`.opencode/agents/technical-writer.md`, `.opencode/agents/ai-generated-code-security-auditor.md`) are **absent as required by rows 4 and 20** (2 of 2 confirmed absent).
- **G6 — file-level `npx --no-install markdownlint-cli V87-FOUNDATION-DOSSIER.md`: exit 1 on the first pass, exit 0 on the second.** Pre-write the same command was a **false green** — the tool prints its usage text and exits 0 for a path that does not exist (proven on a bogus filename, `NO-SUCH-FILE-xyz.md`, usage text and exit 0), which is why it was recorded as not-run until the file existed. After the authorized write the real lint ran on the real file: **first pass exit 1 with 10 findings** — `MD038` at `107:456`, `108:255`, `219:480`, `245:224`, `245:273`, `247:179`, `247:189`, `250:224` (spaces inside code spans, three of them nested-backtick cells) plus `MD056/table-column-count` at `237:257` and `250:160` (unescaped `|` inside code spans in the SC-1 and SC-14 rows). The fixes were cell-local and mechanical — de-nested code spans, escaped the two cell pipes, removed the leading spaces inside the `D` and `M` code spans — and **no claim, status, count or quoted output was changed**. Re-run after the fixes: no output, **exit 0**. Control re-quoted: `Test-Path V87-FOUNDATION-DOSSIER.md` returned `True` immediately before the second run, so that 0 is a real lint result and not the usage-text trap.
- **G7 — `documentation-as-tests`:** every command this dossier prints as its own evidence (section 5 SC-1 to SC-15, section 6 G1 to G5) was executed with its exit quoted. Commands **quoted from the shards** (the reference scan, the link sweep, the byte checks, the probe battery, the tag/heading reads) were **not** re-run here and are labelled as the shard evidence with the shard named; they are not re-claimed and must not be cited as this node results. The file-level markdownlint ran twice on the written file and both exits (1, then 0) are recorded in G6.
- **G8 — link resolution:** this artifact contains **zero** inline Markdown links (all references are code spans), so its counted relative-link total is 0 and its resolved total is 0 — nothing to resolve and nothing broken. The lane 108/108 baseline is neither transcribed nor claimed.

## 7. Sources used by this dossier

- `.opencode/audit/V87-ENUM.md` — version table (section 1), superseded map (section 2), metadata defects (section 3), handoff (section 4), commands CMD1 to CMD11 (read-only).
- `.opencode/audit/V87-FEATURE-AUDIT-1.md` — shard A rows (section 2), findings F-A1 to F-A7, gate ledger (section 1), skipped surfaces (section 4) (read-only).
- `.opencode/audit/V87-FEATURE-AUDIT-2.md` — shard B rows (section 2), findings F1 to F5, gate ledger (section 1), missing checks (section 4) (read-only).
- `.opencode/audit/V87-INPUT-RECEIPT.md` — acceptance table (section 1), mismatch (section 4) (read-only).
- `WORKFLOW.md:71`, `:79`, `:86-98`, `:109-111` — lane task, package position, node table, single-writer law.
- Live working tree at `HEAD = c7c762c21f12e2dccba32611d990ad8a0f059b80` — every `file:line` and every command in sections 5 and 6.
- **Not used, and deliberately:** `V87-COLOR-FINDINGS.md` and `V87-COMPAT-FINDINGS.md` (sibling wave-1 evidence owned by `d-color` and `d-defects`), the `docs/spec/v87/` input contents beyond the receipt quoted in note 4.1, and any source not reachable from this seat. No claim in this dossier originates outside the four inputs and the live tree.

## 8. Bounds observed

- One artifact at repo root: `V87-FOUNDATION-DOSSIER.md`, authored by the deliverable node `d-found` (see the authoring note in the node report).
- Zero edits to `.opencode/audit/**`, `docs/spec/v87/**`, `kit/kit.lock`, `registry/**`, generated Markdown, or any state file.
- No `git add`, no `commit`, no `push`, no tag, no worktree operation; git was used read-only.
- No secrets; no `model:` pins (the single `model`-shaped hit quoted in section 2 row 5 is a TypeScript type member at `.opencode/plugin/arsenal.ts:143`); no `color` fields; no invented catalog ids.
- Statuses, severities and verdicts are quoted from the shards; this node consolidated, re-derived spot facts, and re-graded nothing.
- Exit codes are the claim; readings, reconciliations and observations are labelled as analysis.

Ponytail: prose and consolidation posture — no code authored (FULL binds code-writing nodes only) — evidence: 36 feature rows consolidated with zero status change, 15 spot-checks re-derived with quoted exits, 4 verifiers exit 0, 2 carried discrepancies recorded unsmoothed, zero repairs.
