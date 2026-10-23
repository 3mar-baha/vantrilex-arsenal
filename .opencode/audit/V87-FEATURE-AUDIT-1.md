# V87-FEATURE-AUDIT-1 — Feature Audit SHARD A (surfaces class)

- **Lane:** V87-AETHER-EXECUTE (owner-commissioned execution of the amended AETHER MISSION-PLAN; all other lanes parked).
- **Node:** `v-features-1` (wave 1 of 3; `depends_on` `v-enum` — landed: `.opencode/audit/V87-ENUM.md`).
- **Owner:** vantrilex-verifier (worker-only seat; this node repairs nothing).
- **Classification:** DIRECTED node inside an already-planned lane. **Scenario 4 in substance — continuation with modification:** the amended AETHER MISSION-PLAN is fixed by the dispatcher, wave 0 (`v-enum`) is landed and locked, and this node re-plans nothing; it executes the briefed shard. **Scenario 2 is excluded by the brief** ("Scenario 2 does NOT apply"). No Vanguard re-dispatch is run from a verifier seat: phase-kit planning is the dispatcher's, and this seat holds no planning role. Lane is still V87-AETHER-EXECUTE.
- **Evidence basis:** live working tree, `HEAD = c7c762c21f12e2dccba32611d990ad8a0f059b80`, branch `wt/vta-factory-p0`, 57 uncommitted porcelain entries at read time; read 2026-10-18 between 15:2xZ and 15:30Z. Read-only git only (`rev-parse`, `status`, `ls-files`, `show`, `merge-base`): no `add`, no `commit`, no `push`, no tag.
- **Scope of write:** this file only. `docs/spec/v87/**` was not read for content and was not touched (it appears in `git status` as `?? docs/spec/v87/`, a pre-existing untracked directory).
- **Honesty labels:** `مثبت` = proven by a command quoted here or an exact `file:line` read. `~تقديري` = best-evidenced estimate, stated as such, never promoted to fact.

---

## 0. Verdict headline

**PARTIAL (3 surfaces skipped) — every EXECUTED check exited 0; no executed check FAILED.**

- **Gate checks executed: 9/9 PASS, 0 FAIL.** `verify-skills` 10/10 · `verify-kit` 22/22 · `verify-registry` 7/7 · catalog `--check` all-ok · repo `tsc --noEmit` exit 0 · guards strict `tsc` exit 0 · arsenal load smoke exit 0 · guards load smoke exit 0 · findings probe 45/45 exit 0.
- **Feature status census (shard A):** 28 features audited — **21 WORKING · 5 DEGRADED · 2 BROKEN · 0 unclassified-as-status** (the one unclassified item is a taxonomy label on a DEGRADED row, F-A7).
- **BROKEN (2):** the consult commands `V-Technical-Writer.md` and `V-Ai-Generated-Code-Security-Auditor.md` point at agent definition files that were deleted in the B2 supersession and do not exist on disk.
- **DEGRADED (5):** 3 role-switch commands whose theme file is an unbuilt lock-pending row; 7 agent files and 19 skill folders with no lock/catalog row; the `vs-*` skill class (5 twin pairs with byte-identical `description:` lines, 1 orphan, none declared); 3 untracked intake skill folders; the known-open `[arsenal] typescript-check` host-side emission.
- **Delta:** **not run.** This node audits feature state, not a change, so there is no new-vs-base failure headline to compute. The merge base was resolved read-only (`git merge-base HEAD main` → `772c693a5aa8e8ab4045d69ba46c745cef19bc85`, exit 0) so a later change-verification node can reuse it; no base checkout was made because the dispatch forbids writes outside this artifact. Every "pre-existing" label below is therefore evidenced against `HEAD`, which is stated in each such row.
- **Skipped surfaces (3):** `markdownlint` (`command not found`), command **runtime expansion** (no command-execution harness exists on this seat), and the delta run (see above). Three or more skips is why the headline says PARTIAL, never PASS.

---

## 1. Gate ledger — one row per command, all seven fields

Timestamps are UTC, captured immediately at execution. Rows 1–9 are re-runs of the same commands on the same tree as the exploratory reads earlier in the node: per the protocol a second run of the same command is confirmation, not a new opinion, and both runs agreed (same exit, same totals).

### Row G1 — verify-skills (battery item 3)

```text
Gate:      verify-skills.mjs
Command:   node scripts/verify-skills.mjs
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0
Time:      2026-10-18T15:29:14Z
Totals:    "totals: 10 checks — 10 passed, 0 failed, 0 skipped"
           "VERDICT: PASS — all 10 checks ran and passed. The skills are clean."
Verdict:   PASS
```

Per-check detail quoted verbatim (10 PASS rows): `skill-discovery` "37 skill folders, every name lowercase-hyphenated and every folder holds exactly SKILL.md" · `frontmatter-keys` "37 skills, every frontmatter holds exactly name and description" · `frontmatter-name` "37 skills, every name matches its folder and the hyphenated shape" · `frontmatter-description` "37 skills, every description is one third-person sentence with a front-loaded trigger" · `body-headings` "37 skills, all seven headings present in order exactly once" · `no-placeholders` "37 skills, zero TODO/FIXME/coming-soon/placeholder matches" · `no-excluded-toolchains` "37 skills, zero references to excluded toolchains and the prior project" · `file-hygiene` "37 skills, all LF, strict UTF-8 without BOM, single trailing newline, no trailing whitespace or tabs" · `mechanism-single-home` "halt block, incident template and context anchor each live in exactly one home skill" · `phase-map-cross-check` "13 phase-map names all resolve (3 local skill folders, 10 catalog ids)".

### Row G2 — verify-kit (agent + hook lock↔repo gate)

```text
Gate:      verify-kit.mjs
Command:   node scripts/verify-kit.mjs
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0
Time:      2026-10-18T15:29:14Z
Totals:    "VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed)."
Verdict:   PASS
```

Two rows of this gate are load-bearing for shard A, quoted verbatim:

- `per-kind/hooks` — "7 hooks map to registered functions in .opencode/plugin/arsenal.ts: session-start -> sessionStart; pre-compact -> preCompact; persist-session-state-on-end -> sessionEnd; long-running-process-guard -> longRunningProcessGuard; typescript-check-after-editing-ts-tsx-files -> typescriptCheck; auto-format-js-ts-files-with-prettier-after-edits -> prettierFormat; task-dispatcher -> taskDispatcher".
- `per-kind/agents` — "21 agents carry null install_cmd + unverified; 20 self-sourced lock agents resolve to .opencode/agents/<id>.md with byte-equal name, zero model pins (non-leaders mode subagent with zero color fields; named leaders aether, pulsar, blazar mode primary plus color per triumvirate design D1 + owner ruling (a) 2026-10-15); catalog agreement is proven by the catalog-agreement check".
- `agent-mode-explicit` — "27 agent files declare mode explicitly (24 subagent); 20 self-sourced lock agents resolve to files; 1 upstream agent (vantrilex-a11y-audit) carries no local file by design".

### Row G3 — verify-registry (context, named by V87-ENUM CMD10)

```text
Gate:      verify-registry.mjs
Command:   node scripts/verify-registry.mjs
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0
Time:      2026-10-18T15:29:31Z
Totals:    "totals: 7 checks — 7 passed, 0 failed, 0 skipped"
           "VERDICT: PASS — all 7 checks ran and passed. The registry is clean."
Verdict:   PASS
```

### Row G4 — catalog mirror check (context, named by V87-ENUM CMD10)

```text
Gate:      generate-catalog-json.mjs --check
Command:   node scripts/generate-catalog-json.mjs --check
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0
Time:      2026-10-18T15:29:31Z
Totals:    no totals line is emitted by this tool. Last four lines verbatim:
           "check: registry/policies/_index.md — ok"
           "check: registry/benchmarks/_index.md — ok"
           "check: registry/workflows/_index.md — ok"
           "check: registry/design/_index.md — ok"
           plus one "skip: registry/formatting/_index.md — hand-authored content is preserved, never generated"
Verdict:   PASS
```

Reading of the output is analysis, not the claim: the exit code 0 is the claim; every checked mirror (`catalog.json`, `VANTRILEX_CATALOG.md`, and the per-kind `_index.md` set) printed `ok`, and the single `skip:` is documented hand-authored content, not a failure.

### Row G5 — plugin typecheck (repo gate)

```text
Gate:      tsc --noEmit (plugin TypeScript)
Command:   node_modules/.bin/tsc.cmd --noEmit -p tsconfig.json
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0
Time:      2026-10-18T15:29:31Z
Totals:    no output — clean compile (tsconfig.json declares "strict": true, "noEmit": true, files: [".opencode/plugin/arsenal.ts"])
Verdict:   PASS
```

### Row G6 — guards strict typecheck

```text
Gate:      vantrilex-guards.ts strict check
Command:   node_modules/.bin/tsc.cmd --noEmit --strict --target es2022 --lib es2022 --module nodenext --moduleResolution nodenext --allowImportingTsExtensions .opencode/plugins/vantrilex-guards.ts
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0
Time:      2026-10-18T15:29:32Z
Totals:    no output — clean compile
Verdict:   PASS
```

Provenance of this exact flag set: `.opencode/plugins/vantrilex-guards.ts:68-72` states the file "sits outside the repo tsconfig `files` list, so the repo gate does not cover it; the equivalent strict check is run with that flag stated" and names `allowImportingTsExtensions`. The flag set above is that documented equivalent. `مثبت`.

### Row G7 — arsenal.ts load smoke

```text
Gate:      plugin load smoke (arsenal.ts)
Command:   node -e "import('./.opencode/plugin/arsenal.ts').then(m=>{const d=m.default;console.log('setup='+typeof d.setup+' server='+typeof d.server)}).catch(e=>{console.error(e);process.exit(1)})"
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0
Time:      2026-10-18T15:29:33Z
Totals:    "setup=function server=function" (first run, verbatim)
           first run also printed the export key set:
           "keys=DEFAULT_DOCS_GUARD,DEFAULT_TASK_DISPATCHER,bashMarkdownTargets,default,definePlugin,docsDisciplineGuard,findDispatcherAppendTarget,firstUsableRoot,isBareRoot,longRunningProcessGuard,preCompact,prettierFormat,sanitizeSessionId,sessionEnd,sessionStart,taskDispatcher,typescriptCheck,v2ToolBefore"
Verdict:   PASS
```

Observation (not a failure): both load smokes and the probe emit Node's `[MODULE_TYPELESS_PACKAGE_JSON]` warning because `.opencode/package.json` declares only a dependency and no `"type"`. Exit is still 0 in every case; the warning is a performance notice, quoted here so it is not discovered later as a surprise.

### Row G8 — vantrilex-guards.ts load smoke

```text
Gate:      plugin load smoke (vantrilex-guards.ts)
Command:   node -e "import('./.opencode/plugins/vantrilex-guards.ts').then(m=>{const d=m.default;console.log('id='+d.id+' setup='+typeof d.setup)}).catch(e=>{console.error(e);process.exit(1)})"
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0
Time:      2026-10-18T15:29:33Z
Totals:    "id=vantrilex-guards setup=function"
Verdict:   PASS
```

### Row G9 — adversarial probe battery (arsenal.ts)

```text
Gate:      findings probe
Command:   node .opencode/plugin/arsenal.findings-probe.mjs
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0
Time:      2026-10-18T15:29:33Z
Totals:    "probe: 45 checks passed"
Verdict:   PASS
```

Write scope, stated honestly (`مثبت`, read from the file): the probe's only write root is `PROBE_ROOT = path.join(os.tmpdir(), "opencode", "node-p1", "probe-run")` (`.opencode/plugin/arsenal.findings-probe.mjs:30`); it `rmSync`s and re-creates that root (`:139`), creates `probe-run/proj`, `probe-run/state`, `probe-run/proj-block`, `probe-run/proj-disabled`, `probe-run/fallback`, `probe-run/fallback-off` beneath it (`:141-147`, `:314-315`, `:467-489`), and points `VANTRILEX_STATE_DIR` at `probe-run/state` (`:144`). Every `fs.writeFileSync`/`mkdirSync` target in the file is a child of `PROBE_ROOT`. The repository is read-only in the probe. Running it therefore stayed inside the OS temp area, which the brief permits.

### Row G10 — hook census (kit lock hook rows ↔ registered functions)

```text
Gate:      hook census
Command:   node scripts/verify-kit.mjs  (row per-kind/hooks) + grep of registration call sites
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0
Time:      2026-10-18T15:29:14Z
Totals:    "7 hooks map to registered functions in .opencode/plugin/arsenal.ts: …" (quoted in full at Row G2)
Verdict:   PASS
```

### Row G11 — markdownlint over changed Markdown

```text
Gate:      markdownlint
Command:   Get-Command markdownlint ; node_modules/.bin/markdownlint.cmd --version
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: n/a — the command does not exist
Time:      2026-10-18T15:2xZ (tool-availability probe, pre-battery)
Totals:    "The term 'node_modules/.bin/markdownlint.cmd' is not recognized … CommandNotFoundException"; no global `markdownlint` on PATH either; `node_modules/.bin` holds only `tsc*`
Verdict:   SKIPPED — reason: command not found. Install hint: the tree's own prior runs used `npx --yes markdownlint-cli` (docs/99-archive/P3-SMITHERY-STARTER-LOG.md:155), so `npx --yes markdownlint-cli <files>` is the platform-documented enablement. Not run here: `npx` may fetch from the network, which is a write outside this node's remit.
```

### Row G12 — command runtime expansion

```text
Gate:      command expansion (run a command file and observe $ARGUMENTS substitution)
Command:   none runnable
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: n/a
Time:      n/a
Totals:    n/a
Verdict:   SKIPPED — reason: no command-execution harness exists on this seat (commands are host-invoked from the session prompt, `/name`); evaluating expansion would require driving the host UI, which is outside this node's surface. What WAS measured statically is in ledger C1/C2.
```

### Row G13 — delta at merge base

```text
Gate:      delta run vs merge base
Command:   git merge-base HEAD main  (resolution only, read-only)
Commit:    c7c762c21f12e2dccba32611d990ad8a0f059b80
Exit code: 0 (resolution); the delta run itself did not execute
Time:      2026-10-18T15:2xZ
Totals:    "772c693a5aa8e8ab4045d69ba46c745cef19bc85"
Verdict:   SKIPPED — reason: this node audits feature state, not a change; a base checkout would write outside this artifact, which the dispatch forbids. Classification evidence for pre-existing items was therefore taken against `HEAD` and is labelled as such in each row.
```

---

## 2. Feature ledger — shard A, one row per feature

Format: `feature | introduced (per V87-ENUM) | latest state | status | evidence (file:line + command + exit)`.
Status vocabulary is exactly WORKING / BROKEN / DEGRADED. `مثبت` = command or exact read; `~تقديري` = inference.

### A — Agent definitions (27 files, `.opencode/agents/`)

| # | Feature | Introduced (per V87-ENUM) | Latest state | Status | Evidence |
|---|---|---|---|---|---|
| A1 | Primary leaders `aether`, `blazar`, `pulsar` | ENUM §2 row 1: leaders at `v0.7.5`/`v0.7.6` (`CHANGELOG.md:377-389`, `:177-198`) | 3 files, `name`==stem, `mode: primary` on line 4 of each | **WORKING** `مثبت` | `aether.md:2-4`, `blazar.md:2-4`, `pulsar.md:2-4` (name/mode line dump); `node scripts/verify-kit.mjs` → `agent-mode-explicit` "27 agent files declare mode explicitly (24 subagent)", exit 0. **Missing check named:** no runtime load probe exists for primary-mode agents (they are not listable as subagents), and none was improvised. |
| A2 | Role agents `vantrilex-leader`, `vantrilex-guide`, `vantrilex-implementer` | ENUM §2 row 1: role agents at `v0.2.0` (`CHANGELOG.md:1246`) | 3 files, `name`==stem, `mode: subagent` line 4; all three modified in the dirty tree | **WORKING** `مثبت` | line dump (`vantrilex-leader.md:2,3,4` etc.); `verify-kit` `agent-mode-explicit` exit 0; these three names are also enumerated in this verifier session's own subagent roster (observation, `~تقديري` for the general claim that the host derived it from this tree). |
| A3 | Worker subagent roster (remaining 21 files, incl. `vantrilex-agent-maker`, `-architect`, `-code-reviewer`, `-kit-maintainer`, `-puller`, `-red-team`, `-uploader`) | ENUM §2 row 2: roster from `v0.7.0` (`CHANGELOG.md:517-532`); the 7 listed replacements are untracked and have **no** git addition, so their introduction version is ENUM `~تقديري` | 21 files on disk, all `mode: subagent`, all `name`==stem | **WORKING** `مثبت` | line dump (all 21); `verify-kit` `agent-mode-explicit` exit 0; `git status --porcelain -- .opencode/agents` shows 7 `??` new files and 7 ` D` deleted files. |
| A4 | Retired agent files removed (`agent-maker`, `ai-generated-code-security-auditor`, `architect`, `code-reviewer`, `kit-maintainer`, `red-team`, `technical-writer`) | ENUM §2 row 3: dual supersession at `v0.7.0` (`CHANGELOG.md:551-558`) | 7 files absent from the worktree, 7 replacements present | **WORKING** `مثبت` | `git status --porcelain -- .opencode/agents` → 7 ` D` rows. **Gap:** the supersession did not propagate to two command files — see C5 (BROKEN). |
| A5 | Agent frontmatter standard (`name`==stem, `mode` explicit, description present, no routing pin) | `CHANGELOG.md:698` "Agents moved to canonical `.opencode/agents/`" (v0.6.0 era, per ENUM §2 row 2 note) | 27/27 pass; 24 `mode: subagent`, 3 `mode: primary` | **WORKING** `مثبت` | node frontmatter dump over all 27 files: `count=27 BAD=0` (name==stem, mode present, description present, no `model` key); `verify-kit` `agent-mode-explicit` exit 0. The one repo-wide `model:`-shaped grep hit is a **type member** at `.opencode/plugin/arsenal.ts:143` (`model: unknown` inside `SystemTransformInput`), not a routing pin. |
| A6 | Agent registration coverage | ENUM §2 row 2 reports the roster and the lock `pending` block together | 7 of 27 agent files have **no** `kit.lock` row and **no** `registry/catalog.json` record: `vantrilex-agent-maker`, `vantrilex-guide`, `vantrilex-implementer`, `vantrilex-kit-maintainer`, `vantrilex-leader`, `vantrilex-puller`, `vantrilex-uploader` | **DEGRADED** `مثبت` | node set analysis (exit 0): `DISK AGENT FILES NOT IN LOCK (7)` and `DISK AGENTS NOT IN agents.jsonl (7)` — the same seven. `verify-kit` `per-kind/agents` covers only "20 self-sourced lock agents"; only `agent-mode-explicit` sees all 27. Pre-existing for the three role agents: `git show HEAD:kit/kit.lock` matched no agent row for `vantrilex-leader/guide/implementer` (only the double-prefixed **theme** pending rows), so the gap exists at `HEAD`, not introduced by this dirty tree. |
| A7 | Agent load convention | `CHANGELOG.md:698` "Agents moved to canonical `.opencode/agents/`" | Files live at `.opencode/agents/<stem>.md` with YAML frontmatter; no `.opencode/agent/` (singular) directory exists (`Test-Path .opencode/agent` → `False`) | **WORKING** `مثبت` for the static convention; `~تقديري` for runtime enumeration | static: 27/27 paths resolve at the canonical location; `verify-kit` `per-kind/agents` "20 self-sourced lock agents resolve to .opencode/agents/<id>.md with byte-equal name" exit 0. |

### B — Skills (37 folders, `.opencode/skills/`)

| # | Feature | Introduced (per V87-ENUM) | Latest state | Status | Evidence |
|---|---|---|---|---|---|
| B1 | Skill-file format standard, all 37 | ENUM §2 row 4: four mechanism skills at `v0.2.0` (`CHANGELOG.md:1227-1232`) | 37/37 folders pass all ten format checks | **WORKING** `مثبت` | `node scripts/verify-skills.mjs`, exit 0, "totals: 10 checks — 10 passed, 0 failed, 0 skipped". Every folder holds exactly `SKILL.md` except `ponytail` (`GUARDRAILS.md,SKILL.md`) and `relay-protocol` (9 files) — the gate accepts both and reported PASS, so the extra files are not a violation. |
| B2 | Mechanism skills (`vantrilex-atomic-switch`, `-deep-understand`, `-design-variations`, `-doctrine`, `-prime`, `-vanguard`, `-workflow-forge`) | ENUM §2 row 4: `v0.2.0` + `v0.5.0` (`CHANGELOG.md:691`) | 7 folders, each `SKILL.md` only, `name`==folder | **WORKING** `مثبت` | `name:` line dump (7/7 match); `verify-skills` exit 0. Note `vantrilex-prime`/`-doctrine`/`-vanguard` are lock components (verify-kit `pending-integrity` detail). |
| B3 | Library skills (18 non-`vantrilex`, non-`vs-`, non-intake folders) | ENUM §2 row 4 (`v0.2.0` mechanism set; library rows carry less evidence → `~تقديري`) | 18 folders, format-clean | **WORKING** (format) / **DEGRADED** (registration, see B7) `مثبت` for format | `verify-skills` exit 0 with "37 skill folders"; class split by node enumeration (`library (18)`). |
| B4 | `vs-*` variant skills (8) | **No** changelog declaration and **no** git addition — ENUM §2 summary calls the supersession `~تقديري` | 8 `??` untracked folders; 5 of them carry a `description:` line byte-identical to their base skill | **DEGRADED** `مثبت` for the byte measurement | node byte check: `vs-circuit-breaker-guard` (268 B = 268 B), `vs-github-release-packager` (342=342), `vs-preflight-system-doctor` (276=276), `vs-vantrilex-vanguard` (186=186), `vs-vantrilex-workflow-forge` (72=72) — all `descriptionEqual=true`; `vs-session-context-primer` (277≠247) and `vs-ponytail` (198≠143) differ. `vs-smithery` has **no** base folder on disk and **no** lock row or catalog record (node coverage check exit 0), i.e. an orphan. `git status` shows all eight as `??`. Effect on model selection is `~تقديري`; the byte equality is `مثبت`. |
| B5 | Intake skills (`vantrilex-intake-fetch`, `-send`, `-triage`) | ENUM §2 row 15: no changelog entry, untracked → `~تقديري` | 3 `??` folders, format-clean, no lock row, no catalog record | **DEGRADED** (registered-component view) / WORKING (file view) `مثبت` | `verify-skills` exit 0; node coverage check `skill catalog missing` includes all three; `git status` `?? .opencode/skills/vantrilex-intake-{fetch,send,triage}/`. Their consumers `vantrilex-uploader.md` and `vantrilex-puller.md` gate intake skill count at `:58` / `:60` ("between 1 and 4"). |
| B6 | `relay-protocol` skill | ENUM §2 row 15: `v0.7.7` (`CHANGELOG.md:38-57`) | 9 files on disk; deliberately unregistered (no lock row, no registry row, no `install_cmd`) | **WORKING** `مثبت` | file inventory: `MESSAGE-TYPES.md, POLL.md, RELAY-SCHEMA.md, SECURITY.md, SEND.md, SESSIONS.md, SKILL.md, TIMEOUTS.md, TRIAGE.md` = 9; `verify-skills` exit 0. **Census drift:** `CHANGELOG.md:38` says "8 files on disk" and lists 7 companions; the live set holds 8 companions (**`SESSIONS.md`** is the extra, `git ls-files --error-unmatch .opencode/skills/relay-protocol/SESSIONS.md` → tracked, exit 0). The deliberate non-registration is documented at `CHANGELOG.md:44` "Deliberately **unregistered**: no lock row, no registry row, no install_cmd". |
| B7 | Skill registration coverage | ENUM §2 row 4 and the lock/skill census | 19 of 37 folders have no `kit.lock` row; 16 of 37 have no `registry/catalog.json` record | **DEGRADED** `مثبت` | node set analysis exit 0: `DISK SKILL DIRS NOT IN LOCK (19)` and `skill catalog missing` list of 16 (`circuit-breaker-guard, github-release-packager, relay-protocol, skill-maker, vantrilex-deep-understand, vantrilex-intake-fetch/-send/-triage, vs-*×8`). Five of the 19 are **tracked** files (`git ls-files --error-unmatch` exit 0 for `circuit-breaker-guard`, `github-release-packager`, `relay-protocol`, `skill-maker`, `vantrilex-deep-understand`). Only `relay-protocol` has a written deliberate-unregistered statement; `vantrilex-deep-understand` shipped at `v0.5.0` ("skill count 21→22", `CHANGELOG.md:691-692`) with no lock row today. Pre-existing: `git show HEAD:registry/catalog.json` contains **none** of the five tracked ids (node check, exit 0). |

### C — Command surface (22 files: 18 in `.opencode/commands/`, 4 in `.opencode/command/`)

| # | Feature | Introduced (per V87-ENUM) | Latest state | Status | Evidence |
|---|---|---|---|---|---|
| C1 | Command file set: frontmatter `description`, exactly one `$ARGUMENTS`, no shell-exec line, unique stems, argument fallback | ENUM §2 row 5: `v0.6.0` "16 command files in total" (`CHANGELOG.md:627-634`); live 22 per `AGENT.md:228` | 22/22 have `description` on line 2, exactly one `$ARGUMENTS`, zero `!`-prefixed shell lines, 22 unique stems | **WORKING** `مثبت` | node command dump exit 0 (`count=22`, every row `desc=ok args=1 bangLines=none`); `$ARGUMENTS` line numbers captured per file (e.g. `V-AETHER.md:11`, `doctor.md:13`, `V-Ai-Generated-Code-Security-Auditor.md:17`). |
| C2 | Argument guard on every command (empty-argument behaviour stated) | same as C1 | 22/22 carry a fallback: 20 use "If that is empty…", `V-HTML_DESIGN.md:16-19` uses a `Usage:` clause, `V-PROFILE.md:15-17` uses "With no subcommand, print the usage summary and stop" | **WORKING** `مثبت` | exact reads: `V-PROFILE.md:15-17`, `V-HTML_DESIGN.md:16-19`, plus per-file "emptyGuard=true" in the node dump for the other 20. |
| C3 | Leader atomic-switch commands `V-AETHER`, `V-Blazar`, `V-PULSAR` | ENUM §2 row 5: `v0.7.5` adds `V-AETHER`/`V-PULSAR` (`CHANGELOG.md:388-389`) | 3 files; each resolves its agent file and a **real** theme (`vantrilex-aether`, `vantrilex-blazar`, `vantrilex-pulsar`) | **WORKING** `مثبت` | reference scan exit 0: `badAgentRefs=[]`, `unreferencedThemes=[]` for all three; theme ids exist in `registry/themes/` (`vantrilex-aether.json`, `vantrilex-blazar.json`, `vantrilex-pulsar.json`). |
| C4 | Role-switch commands `V-Vantrilex-Guide`, `V-Vantrilex-Implementer`, `V-Vantrilex-Leader` | `~تقديري` — no changelog line found for these three; they follow the `v0.7.5` leader-switch pattern | 3 files; agent file resolves, but the named theme is an unbuilt lock-pending row (`vantrilex-vantrilex-guide` / `-implementer` / `-leader`) | **DEGRADED** `مثبت` | `V-Vantrilex-Guide.md:2,21,23,42`; `V-Vantrilex-Implementer.md:2,21,23,42`; `V-Vantrilex-Leader.md:2,21,23,42` — each `Resolve the planned theme file registry/themes/vantrilex-vantrilex-*.json`. `registry/themes/` holds only 4 JSON files (none of these). `kit/kit.lock:171` (and the sibling pending rows) documents them: "Per-agent theme JSON not yet authored … once registry/themes/vantrilex-vantrilex-guide.json lands." Because the lock row declares the state, this is a *declared pending*, not a silent break — but the command's Step 2 cannot complete today. |
| C5 | Consult commands, already remediated (4): `V-Architect`, `V-Code-Reviewer`, `V-Kit-Maintainer`, `V-Red-Team` | ENUM §2 row 5 (`v0.6.0`); remediated in this dirty tree (`M` in `git status`) | 4 files; each references the existing `vantrilex-*` agent file | **WORKING** `مثبت` | reference scan exit 0: `badAgentRefs=[]` for all four; `git status` shows all four `M`; the agent files exist (`vantrilex-architect.md` etc.). |
| C6 | Consult commands, NOT remediated (2): `V-Technical-Writer`, `V-Ai-Generated-Code-Security-Auditor` | ENUM §2 row 5 (`v0.6.0`), superseded at `v0.7.0` (ENUM §2 row 3) | 2 files still instruct the model to read a **deleted** agent definition | **BROKEN** `مثبت` | `V-Technical-Writer.md:23` and `:51` → "`.opencode/agents/technical-writer.md`"; `V-Ai-Generated-Code-Security-Auditor.md:25` and `:55` → "`.opencode/agents/ai-generated-code-security-auditor.md`". Both paths are absent (reference scan `badAgentRefs=["technical-writer"]` / `["ai-generated-code-security-auditor"]`, exit 0; `git status` shows both files must be ` D` per A4). Neither command file is modified in the dirty tree, so the break is **pre-existing at HEAD** (`مثبت`), not introduced by this lane. |
| C7 | Operator + root commands (10): `V-CATALOG`, `V-DOCTOR`, `V-FULL-AUDIT`, `V-HTML_DESIGN`, `V-PROFILE`, `V-RAG`, `doctor`, `equip`, `prime`, `release` | ENUM §2 row 5 (`v0.6.0`); root four from the operator set | 10 files; frontmatter + `$ARGUMENTS` guard present; no agent/theme reference to resolve | **WORKING** `مثبت` | node dump exit 0 (all `desc=ok args=1 bangLines=none`); `V-CATALOG.md:13`, `V-RAG.md:13`, `release.md:12` etc.; `V-PROFILE.md:15-17` guard. **Missing check named:** runtime expansion (G12) is not evaluated; the static template is the strongest available evidence. |

### D — Plugin / hooks

| # | Feature | Introduced (per V87-ENUM) | Latest state | Status | Evidence |
|---|---|---|---|---|---|
| D1 | `arsenal.ts` typecheck | ENUM §2 row 6: plugin surface at `v0.2.0` (`CHANGELOG.md:1241-1245`) | `tsc --noEmit -p tsconfig.json` clean | **WORKING** `مثبت` | G5, exit 0, no output. |
| D2 | `arsenal.ts` load smoke | same | default export is an object carrying both `setup` and `server` | **WORKING** `مثبت` | G7, exit 0, `setup=function server=function`; export key set quoted in G7. |
| D3 | `vantrilex-guards.ts` strict typecheck | ENUM §2 row 6 (`v0.7.5` detective plan-guard, `CHANGELOG.md:397-403`) | strict check with the file's own documented flags, clean | **WORKING** `مثبت` | G6, exit 0. |
| D4 | `vantrilex-guards.ts` load smoke | same | plugin id `vantrilex-guards`, `setup` is a function | **WORKING** `مثبت` | G8, exit 0, `id=vantrilex-guards setup=function`. |
| D5 | 45-check probe battery | ENUM §2 row 10: probe battery grown 28→45 at `v0.4.1` (`CHANGELOG.md:743-744`) | 45/45 pass, temp-only writes | **WORKING** `مثبت` | G9, exit 0, "probe: 45 checks passed"; write scope proven at `arsenal.findings-probe.mjs:30,139,141-147,144,314-315,467-489`. |
| D6 | Lock hook rows ↔ registered functions (7) | ENUM §2 row 6 (`v0.2.0` six hooks + docs guard; `v0.3.0` seventh `task-dispatcher`, `CHANGELOG.md:892-903`) | 7 lock hook rows each map to a named registered function | **WORKING** `مثبت` | `verify-kit` `per-kind/hooks` row quoted at G2 (exit 0), plus my own call-site greps: V2 sites `arsenal.ts:2157` (`session "prompt"`), `:2182` (`tool "execute.before"`), `:2185` (`tool "execute.after"`), `:2192` (`shell "create.before"`); V1 sites `arsenal.ts:2282` (`chat.message` → dispatcher), `:2314` (`experimental.chat.system.transform` → `sessionStart`), `:2321` (`experimental.session.compacting` → `preCompact`), `:2254`/`:2272` (`event` → `sessionEnd`), `:2328` (`tool.execute.before` → `longRunningProcessGuard` + `docsDisciplineGuard`), `:2337` (`tool.execute.after` → `typescriptCheck` + `prettierFormat`). All 7 lock hook rows also carry `verification: "unverified"` with `install_cmd: null`, i.e. the lock honestly records that no install command exists — that field is about installability, not about the mapping. |
| D7 | Non-lock hooks: `docsDisciplineGuard`, guards' plan-guard, relay poll + watchdog | ENUM §2 row 6 (`v0.2.0` docs guard is explicitly "not a lock component", `CHANGELOG.md:1241-1245`); relay at `v0.7.7` (`CHANGELOG.md:38-57`) | docs guard registered on both `execute.before` sites; plan-guard registered by the carrier (`vantrilex-guards.ts:129,132`); relay pair registered **disabled** | **WORKING** `مثبت` | `vantrilex-guards.ts:129` delegates to `arsenalPlugin.setup(ctx)`, `:132` registers its own `session "prompt"` append; `.opencode/hooks/relay/relay-hooks.json:5,11,14,19` → `relay-poll`/`relay-watchdog` both `"enabled": false`. Neither relay hook is a lock row and neither is claimed as one. |
| D8 | `[arsenal] typescript-check` live emission | ENUM §2 row 6 (`v0.2.0`); the hook code is `arsenal.ts:1720-1786` | Direct invocation of the hook's exact resolved command is green; the live host emission has been recorded as FAIL | **DEGRADED — taxonomy unclassified** `مثبت` for the probe, `~تقديري` for the live fault | Re-confirming probe: the hook's own command shape is `node <root>/node_modules/typescript/lib/tsc.js --noEmit --pretty false -p <tsconfig>` (`arsenal.ts:1744-1756` resolves `typescript/lib/tsc.js` first, `:879`, and runs it through `rt.proc.execPath`). Run verbatim: `node node_modules/typescript/lib/tsc.js --noEmit --pretty false -p tsconfig.json` → exit **0**, no output. The file it resolves exists (`Test-Path node_modules/typescript/lib/tsc.js` → `True`), and no `tsc` exists on `PATH` (`Get-Command tsc` → not found), so the hook would take the JS-entry path, not the `.cmd` shim. Recorded host evidence, quoted from the lane's own state file: `AGENT.md:230` "`[arsenal] typescript-check` hook misfire (`--noEmit` handed to a non-tsc binary) = PRE-EXISTING env defect firing on every edit; catalogued, out of scope", and `AGENT.md:236` "FLAG CONFIRMED: live `[arsenal] typescript-check: FAIL` emission = command-resolution fault in the hook (tsc present; direct invocation exit 0) — **unclassified**, needs dedicated probe; out of ordered scope." Taxonomy label therefore stays **unclassified** — the wrong bucket would send the fix to the wrong owner (host command resolution vs plugin logic vs environment). No state file under `node_modules/.cache/vantrilex-arsenal/` carries a `typescript-check` line at read time (grep, no matches), so the emission could not be re-observed offline. |

---

## 3. Findings and dossiers (one per FAIL or DEGRADED that needs an owner)

No executed gate FAILED, so no gate dossier exists. The dossiers below are feature-state defects found by mechanical checks; each carries its reproduction and its bucket.

### F-A1 — Two consult commands point at deleted agent files

- **Reproduction:** `V-Technical-Writer.md:23,51` → `.opencode/agents/technical-writer.md`; `V-Ai-Generated-Code-Security-Auditor.md:25,55` → `.opencode/agents/ai-generated-code-security-auditor.md`; both paths do not exist. Command: reference scan over `.opencode/commands` + `.opencode/command` (exit 0) reporting `badAgentRefs`.
- **Bucket:** **kit-defect** (the kit content fails a sound check). Evidence that selects it: the four sibling consult commands were remediated in this same dirty tree (`M` in `git status`), the two broken ones were not (`git status` shows them unmodified), and the target files are deleted per ENUM §2 row 3.
- **New or pre-existing:** pre-existing at `HEAD` (both files identical to `HEAD`; neither appears in the dirty set). The delta run did not execute, so this is labelled against `HEAD`, not the merge base.
- **Unclassified?** No — bucket is supported by the four-sibling remediation evidence.
- **Routes to:** kit maintainer (component definitions). Not repaired here.

### F-A2 — Three role-switch commands target a theme file that has not landed

- **Reproduction:** `V-Vantrilex-Guide.md:23`, `V-Vantrilex-Implementer.md:23`, `V-Vantrilex-Leader.md:23` each instruct "Resolve the planned theme file `registry/themes/vantrilex-vantrilex-*.json`"; `Get-ChildItem registry/themes` lists exactly `vantrilex-aether.json, vantrilex-atomic-switch.json, vantrilex-blazar.json, vantrilex-pulsar.json, _index.md`.
- **Bucket:** **kit-defect** in effect; the state is *declared* — `kit/kit.lock:171` and its siblings carry pending rows whose reason names the exact missing file. Because the declaration exists, this is a known carry, not a silent break.
- **New or pre-existing:** pre-existing at `HEAD` (`git show HEAD:kit/kit.lock` carries the same three pending theme rows).
- **Routes to:** kit maintainer (author the three theme JSONs or re-point the commands at an existing theme). Not repaired here.

### F-A3 — Seven agent files carry no lock row and no catalog record

- **Reproduction:** node set analysis (exit 0) printing `DISK AGENT FILES NOT IN LOCK (7): vantrilex-agent-maker, vantrilex-guide, vantrilex-implementer, vantrilex-kit-maintainer, vantrilex-leader, vantrilex-puller, vantrilex-uploader` and the identical list for `registry/data/agents.jsonl`.
- **Bucket:** **kit-defect** (registration coverage), with the three role agents confirmed pre-existing at `HEAD` and the four new ones untracked-and-unregistered at introduction.
- **Effect:** `verify-kit`'s `catalog-agreement` and `per-kind/agents` cannot see them; only `agent-mode-explicit` covers all 27 files. A skill/agent that is not in the lock is not provisioned by the kit machinery.
- **Routes to:** kit maintainer (add lock + sidecar rows, or record them deliberately unregistered the way `relay-protocol` is).

### F-A4 — Nineteen skill folders carry no lock row; sixteen have no catalog record

- **Reproduction:** node set analysis (exit 0): `DISK SKILL DIRS NOT IN LOCK (19)` and `skill catalog missing` (16 ids). Five of the 19 are tracked (`git ls-files --error-unmatch` exit 0): `circuit-breaker-guard`, `github-release-packager`, `relay-protocol`, `skill-maker`, `vantrilex-deep-understand`.
- **Bucket:** **kit-defect** for the four tracked, undeclared ones; **deliberate** for `relay-protocol` (`CHANGELOG.md:44`); **pre-existing** for all five tracked ids against `HEAD` (`git show HEAD:registry/catalog.json` contains none of them, node exit 0).
- **Routes to:** kit maintainer, with `relay-protocol` excluded as documented-intentional.

### F-A5 — `vs-*` twin pairs share a byte-identical description line

- **Reproduction:** node byte check (exit 0) printing `descriptionEqual=true` for `vs-circuit-breaker-guard` / `circuit-breaker-guard` (268 B = 268 B), `vs-github-release-packager` / `github-release-packager` (342 = 342), `vs-preflight-system-doctor` / `preflight-system-doctor` (276 = 276), `vs-vantrilex-vanguard` / `vantrilex-vanguard` (186 = 186), `vs-vantrilex-workflow-forge` / `vantrilex-workflow-forge` (72 = 72). `vs-smithery` has no in-repo base and no lock row.
- **Bucket:** **kit-defect** (deterministic-selection defect measured by bytes, not by taste). `verify-skills` passes because it checks description *shape*, not uniqueness — that is a gate-scope fact, not a gate defect.
- **Routes to:** kit maintainer (differentiate the trigger sentences, or declare which twin supersedes which; ENUM §2's summary already calls the supersession `~تقديري`).

### F-A6 — `relay-protocol` census drift: 8 files documented, 9 on disk

- **Reproduction:** `CHANGELOG.md:38` "**`relay-protocol` skill: 8 files on disk" and its companion list (7 named); live file inventory shows 9 files with `SESSIONS.md` extra; `git ls-files --error-unmatch .opencode/skills/relay-protocol/SESSIONS.md` → tracked, exit 0.
- **Bucket:** **kit-defect** (stale doc census). Low severity; the skill itself works.
- **Routes to:** kit maintainer (docs/changelog census, not the skill).

### F-A7 — Known-open: `[arsenal] typescript-check` mis-resolution (unclassified)

- See row D8. Bucket: **unclassified — needs a dedicated probe**, matching the recorded flag at `AGENT.md:236`. Evidence for the label: the hook's exact resolved command exits 0 here, the resolved entry point exists, no `tsc` is on `PATH` to shadow it, and yet the recorded live emission is `FAIL` with the diagnostic "`--noEmit` handed to a non-tsc binary". A dedicated host-side probe (which this seat cannot run) must decide host-command-resolution vs plugin logic vs environment.
- **Routes to:** the dispatcher first (it decides which owner gets the dedicated probe), then host-runtime or kit maintainer per that probe.

---

## 4. Skipped surfaces and unclaimed work

1. `markdownlint` — SKIPPED, `command not found` (G11). This artifact is Markdown and therefore carries an unchecked docs-hygiene surface; the leader should know a lint pass over this file did not happen.
2. Command **runtime expansion** — SKIPPED (G12). Static evidence only: `$ARGUMENTS` present once per file, guard text present, stems unique, zero `!` shell lines.
3. **Delta at merge base** — SKIPPED (G13), with the base SHA recorded read-only.
4. **Shell + Node script hygiene** (`shellcheck`, `bash -n`, `node --check` over `scripts/*`) — **outside shard A**: these belong to the shell/filesystem class (ENUM §2 row 16) assigned to a sibling shard. Not run, not claimed. (`shellcheck 0.11.0` is present on this machine, so the sibling node can run it.)
5. **`docs/spec/v87/**`** — not read for content, not touched.
6. **Host-side hook emission** — cannot be triggered from this seat; only the direct-invocation probe (D8) was possible.

---

## 5. Bounds observed

- Zero edits outside `.opencode/audit/V87-FEATURE-AUDIT-1.md`. `docs/spec/v87/**` untouched (`git status --porcelain -- docs/spec/v87` → `?? docs/spec/v87/`, a pre-existing untracked directory).
- No `git add`, no `commit`, no `push`, no tag operation; only `rev-parse`, `status`, `ls-files`, `show`, `merge-base` were used, all read-only.
- Zero secrets; zero routing-identity pins (the single `model`-shaped grep hit is a TypeScript type member at `arsenal.ts:143`, quoted); zero `color` fields in this artifact.
- No file was repaired, created, or deleted except this artifact. No generated Markdown, `kit/kit.lock`, or `registry/catalog.json` was touched.
- No catalog id was emitted that does not resolve; every id named here was read from `kit/kit.lock`, `registry/data/*.jsonl`, `registry/catalog.json`, or a real `file:line`.
- Missing-tooling protocol applied once (`markdownlint`), with its install hint recorded and the network-fetch alternative deliberately not taken.
- Authored-code note: this node authored no parsing script as a file. The mechanical analyses were inline `node -e` and PowerShell expressions, run directly and not persisted; each is quoted with its output and exit in the ledger. No `ponytail` FLOOR/CEILING posture attaches, because no code artifact was produced.

Ponytail: code-writing nodes only; this node wrote no code (one Markdown artifact) — evidence: 9 executed checks all exit 0 (`verify-skills` 10/10, `verify-kit` 22/22, `verify-registry` 7/7, catalog `--check` ok, `tsc` ×2 exit 0, load smokes ×2 exit 0, probe 45/45 exit 0), 3 surfaces SKIPPED with reasons, 1 artifact written, zero drift repaired.
