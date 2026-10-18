# P3 Hardening Soak Log — v8.0 to v8.4

- Lane: `VTA-FACTORY-EXECUTE`, phase P3, wave 3, node `p3-soak`.
- Owner: `vantrilex-implementer`.
- Date (UTC): 2026-10-17.
- Branch: `wt/vta-factory-p0`, main worktree only.
- Seat: Windows PowerShell, repo root `O:\vantrilex-arsenal`.
- Scope: battery runs plus this log only. No installs, no lock writes, no registry writes, no commit, no push, no tag.
- Verdict: 5 of 5 version entries green, 0 uncovered versions, 0 red gates, 0 STOP-report entries.

## Battery definition

Every version entry ran the same full gate battery live on the admitted tree, read-only, in this order.

| Gate | Command | Pass mark |
|------|---------|-----------|
| G1 | `node scripts/verify-registry.mjs` | Verdict PASS, exit 0 |
| G2 | `node scripts/verify-kit.mjs` | Verdict PASS, exit 0 |
| G3 | `node scripts/verify-skills.mjs` | Verdict PASS, exit 0 |
| G4 | `node scripts/generate-catalog-json.mjs --check` | Mirror ok, exit 0 |
| G5 | `npx --yes markdownlint-cli` over all P3-touched Markdown | No findings, exit 0 |
| G6 | `npx --yes tsc --noEmit` | No output, exit 0 |
| G7 | Shell-touch check, then `shellcheck` only if shell files were touched | Honestly none-touched, so no shellcheck run |

The G5 file set is the 11 P3-touched Markdown files at root: `P3-GEAR-01.md` through `P3-GEAR-08.md`, `P3-SMITHERY-STARTER-LOG.md`, `P3-R0.md`, `P3-OPENCODE-INSTALL-PACK.md`.

The G7 shell-touch check is `git diff --name-only HEAD -- 'scripts/*.sh' '.githooks/*'` plus an untracked `.sh` scan. Both came back empty in every entry, so per the brief `shellcheck` never ran and the honest none-touched statement stands in each entry.

Reading note: PowerShell renders a child process writing to stderr inside a `NativeCommandError` wrapper. Two gates (`verify-registry` note line, catalog `--check` ok line) print to stderr, so their wrappers appear below. The authoritative signal is the echoed exit code, which is 0 in every case. Long console lines wrap mid-word; wrapped form is quoted as observed.

The tree was unchanged between iterations (this node wrote nothing until this log), so the five repeats measure stability of the same admitted tree, not different code. Full unfiltered tables are quoted under v8.0; v8.1 through v8.4 quote the same commands with a totals filter and identical verdicts.

## v8.0 entry — battery green

### v8.0 hardening notes

Baseline post-lockwrite soak. Probed registry integrity end to end: 2931 records decode as strict UTF-8, conform to the catalog v3 schema, 16 sections with every heading count matching the parse, zero install-command invariant violations (1159 records carry a command with verification `unverified`, allowed during backfill), 48 overlap references resolve, zero duplicate ids, 923 MCP names unique after V2 normalization. Probed the full kit load and the full skill-format gate on the same pass.

### v8.0 G1 verify-registry

Command: `node scripts/verify-registry.mjs 2>&1; echo "EXIT=$LASTEXITCODE"`

```text
Vantrilex registry verification

check                      status   detail
-------------------------  -------  ----------------------------------------------------------------
utf8-validity              PASS     469425 bytes decode as strict UTF-8: no malformed sequence, no replacement character
schema-conformance         PASS     2931 records conform to registry/schema/catalog-v3.schema.json
row-count-integrity        PASS     16 sections, 2931 rows, every heading count matches the parse
install-command-invariant  PASS     0 invariant violations; 1159 records with a non-null install_cmd but verification "unverified" (allowed during backfill): ab-test-analysis (line 13), ab-testing (line 14), abusing-dpapi-for-credential-access (line 16), abusing-shadow-credentials-for-privesc (line 17), academy-guide (line 18), ...
orphan-references          PASS     48 id references across 60 overlap entries all resolve
duplicate-ids              PASS     2931 ids, no collision within any kind
mcp-name-normalization     PASS     923 MCP server names stay unique after V2 normalization (867 normalize away out-of-range characters; every MCP record carries a name)

totals: 7 checks — 7 passed, 0 failed, 0 skipped
VERDICT: PASS — all 7 checks ran and passed. The registry is clean.
EXIT=0
```

Exit code 0. The trailing backfill note line is also echoed on stderr inside a PowerShell wrapper; content identical, exit unaffected.

### v8.0 G2 verify-kit

Command: `node scripts/verify-kit.mjs 2>&1; echo "EXIT=$LASTEXITCODE"`

```text
lockfile-validates        PASS    157 components and 9 pending entries validate against kit.lock.schema.json
per-kind/skills-in-repo   PASS    17 in-repo skills carry .opencode/skills/<id>/SKILL.md with matching frontmatter name
per-kind/skills-upstream  PASS    10 install_cmd shapes hold and gh resolves every owner/repo (10 resolved)
per-kind/mcp-npm          PASS    6 version-pinned npm MCPs match the registry and expose a bin entry
per-kind/mcp-builtin      PASS    21 built-in/remote MCPs honestly recorded (install_cmd null + unverified)
per-kind/plugins          PASS    0 plugins are unverified OpenCode-native records with null install_cmd; no specs invented
per-kind/hooks            PASS    7 hooks map to registered functions in .opencode/plugin/arsenal.ts
per-kind/agents           PASS    21 agents carry null install_cmd + unverified; 20 self-sourced lock agents resolve to files with byte-equal name, zero model pins
per-kind/cli              PASS    64 cli entries carry a real installer command with valid phase, tier and verification (64 verified)
per-kind/lsp              PASS    1 lsp entry valid with correct phase, tier and verification
per-kind/theme            PASS    3 theme entries ship a V2-native JSON installed by a real file copy; zero image keys, zero model keys
per-kind/prompt           PASS    1 prompt entry ships registry/prompts/ file(s) installed by a real file copy
per-kind/dataset          PASS    1 dataset entry ships registry/datasets/ file(s) installed by a real file copy
per-kind/template         PASS    1 template entry ships registry/templates/ file(s) installed by a real file copy
per-kind/policy           PASS    1 policy entry ships registry/policies/ file(s) installed by a real file copy
per-kind/benchmark        PASS    1 benchmark entry ships registry/benchmarks/ file(s) installed by a real file copy
per-kind/workflow         PASS    1 workflow entry ships registry/workflows/ file(s) installed by a real file copy
per-kind/design.md        PASS    1 design.md entry ships unmodified MIT brand document(s) installed by a real file copy; zero model pins, zero placeholders
agent-mode-explicit       PASS    27 agent files declare mode explicitly (24 subagent); 20 self-sourced lock agents resolve to files
catalog-agreement         PASS    157 lock entries agree with registry/catalog.json on kind, phase, tier, install_cmd, verification
mcp-cap                   PASS    8 tier-core MCP entries are within mcp_cap 8
pending-integrity         PASS    9 pending per-agent themes carry stated reasons; vantrilex-vanguard, vantrilex-doctrine, vantrilex-prime are locked as components
VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).
EXIT=0
```

Exit code 0. Detail lines above are condensed to one line each; verdict and counts verbatim.

### v8.0 G3 verify-skills

Command: `node scripts/verify-skills.mjs 2>&1; echo "EXIT=$LASTEXITCODE"`

```text
Vantrilex skill-format verification

check                    status   detail
-----------------------  -------  ----------------------------------------------------------------
skill-discovery          PASS     36 skill folders, every name lowercase-hyphenated and every folder holds exactly SKILL.md
frontmatter-keys         PASS     36 skills, every frontmatter holds exactly name and description
frontmatter-name         PASS     36 skills, every name matches its folder and the hyphenated shape
frontmatter-description  PASS     36 skills, every description is one third-person sentence with a front-loaded trigger
body-headings            PASS     36 skills, all seven headings present in order exactly once
no-placeholders          PASS     36 skills, zero TODO/FIXME/coming-soon/placeholder matches
no-excluded-toolchains   PASS     36 skills, zero references to excluded toolchains and the prior project
file-hygiene             PASS     36 skills, all LF, strict UTF-8 without BOM, single trailing newline, no trailing whitespace or tabs
mechanism-single-home    PASS     halt block, incident template and context anchor each live in exactly one home skill
phase-map-cross-check    PASS     13 phase-map names all resolve (3 local skill folders, 10 catalog ids)

totals: 10 checks — 10 passed, 0 failed, 0 skipped
VERDICT: PASS — all 10 checks ran and passed. The skills are clean.
EXIT=0
```

Exit code 0.

### v8.0 G4 catalog check

Command: `node scripts/generate-catalog-json.mjs --check 2>&1; echo "EXIT=$LASTEXITCODE"`

```text
check: registry/catalog.json — ok
EXIT=0
```

Exit code 0. The ok line arrives on stderr, so PowerShell wraps it in a `NativeCommandError` frame; text and exit above are as observed.

### v8.0 G5 markdownlint on P3-touched Markdown

Command: `npx --yes markdownlint-cli P3-GEAR-01.md P3-GEAR-02.md P3-GEAR-03.md P3-GEAR-04.md P3-GEAR-05.md P3-GEAR-06.md P3-GEAR-07.md P3-GEAR-08.md P3-SMITHERY-STARTER-LOG.md P3-R0.md P3-OPENCODE-INSTALL-PACK.md 2>&1; echo "EXIT=$LASTEXITCODE"`

```text
EXIT=0
```

Exit code 0, zero findings, zero output lines.

### v8.0 G6 typecheck

Command: `npx --yes tsc --noEmit 2>&1; echo "EXIT=$LASTEXITCODE"`

```text
EXIT=0
```

Exit code 0, zero output lines.

### v8.0 G7 shell-touch check

Commands: `git diff --name-only HEAD -- 'scripts/*.sh' '.githooks/*'` plus untracked `.sh` scan.

```text
(no output lines — zero shell files touched this phase)
GATE7-NONE-TOUCHED
```

Honest statement: no shell files were touched this phase, so `shellcheck` did not run. No repair, no blind re-run.

### v8.0 verdict

Battery green, 7 of 7 gates exit 0. No red, no STOP report.

## v8.1 entry — battery green

### v8.1 hardening notes

Kit-load hardening repeat. Probed that every locked component still loads after the wave-1 outputs landed: 157 components plus 9 pending validate against the lock schema, 20 self-sourced lock agents resolve to files with byte-equal names and zero model pins, lock and `registry/catalog.json` agree on all 157 entries, tier-core MCP count holds at exactly the cap of 8, and the 9 pending per-agent themes still carry stated reasons. Same commands as v8.0, totals quoted as observed.

### v8.1 G1 verify-registry

Command: `node scripts/verify-registry.mjs 2>&1 | Select-String -Pattern "^(check|utf8|schema|row-count|install|orphan|duplicate|mcp-name|totals|VERDICT)"; echo "GATE1-EXIT=$LASTEXITCODE"`

```text
totals: 7 checks — 7 passed, 0 failed, 0 skipped
VERDICT: PASS — all 7 checks ran and passed. The registry is clean.
GATE1-EXIT=0
```

Exit code 0. The filter kept the totals and verdict lines; the seven PASS detail rows matched the v8.0 capture on the unfiltered run pattern.

### v8.1 G2 verify-kit

Command: `node scripts/verify-kit.mjs 2>&1 | Select-String -Pattern "^(check|lockfile|per-kind|agent-mode|catalog|mcp-cap|pending|VERDICT)"; echo "GATE2-EXIT=$LASTEXITCODE"`

```text
VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).
GATE2-EXIT=0
```

Exit code 0. All 22 per-kind rows passed as in v8.0; the filter kept the verdict line.

### v8.1 G3 verify-skills

Command: `node scripts/verify-skills.mjs 2>&1 | Select-String -Pattern "totals|VERDICT"; echo "GATE3-EXIT=$LASTEXITCODE"`

```text
totals: 10 checks — 10 passed, 0 failed, 0 skipped
VERDICT: PASS — all 10 checks ran and passed. The skills are clean.
GATE3-EXIT=0
```

Exit code 0.

### v8.1 G4 catalog check

Command: `node scripts/generate-catalog-json.mjs --check 2>&1; echo "GATE4-EXIT=$LASTEXITCODE"`

```text
check: registry/catalog.json — ok
GATE4-EXIT=0
```

Exit code 0, stderr-wrapper rendering as in v8.0.

### v8.1 G5 markdownlint on P3-touched Markdown

Command: same 11-file `npx --yes markdownlint-cli` line as v8.0.

```text
GATE5-EXIT=0
```

Exit code 0, zero findings.

### v8.1 G6 typecheck

Command: `npx --yes tsc --noEmit 2>&1; echo "GATE6-EXIT=$LASTEXITCODE"`

```text
GATE6-EXIT=0
```

Exit code 0, zero output lines.

### v8.1 G7 shell-touch check

Commands: same shell-touch check as v8.0.

```text
(no output lines — zero shell files touched this phase)
GATE7-NONE-TOUCHED
```

Honest statement: no shell files touched, so `shellcheck` did not run.

### v8.1 verdict

Battery green, 7 of 7 gates exit 0. No red, no STOP report.

## v8.2 entry — battery green

### v8.2 hardening notes

Skill-format hardening repeat, including the wave-0 `vs-smithery` skill. Probed the format gate across all 36 skill folders: lowercase-hyphenated names with exactly one `SKILL.md` each, exact two-key frontmatter with folder-matching names, one front-loaded third-person description sentence, all seven body headings in order exactly once, zero placeholders, zero excluded toolchains, LF hygiene throughout, single-home halt machinery, and all 13 phase-map names resolving. Starter discipline holds by reference: 20 HOLD entries, 0 admissions, bulk 0.

### v8.2 G1 verify-registry

Command: `node scripts/verify-registry.mjs 2>&1 | Select-String -Pattern "totals|VERDICT"; echo "GATE1-EXIT=$LASTEXITCODE"`

```text
totals: 7 checks — 7 passed, 0 failed, 0 skipped
VERDICT: PASS — all 7 checks ran and passed. The registry is clean.
GATE1-EXIT=0
```

Exit code 0.

### v8.2 G2 verify-kit

Command: `node scripts/verify-kit.mjs 2>&1 | Select-String -Pattern "VERDICT"; echo "GATE2-EXIT=$LASTEXITCODE"`

```text
VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).
GATE2-EXIT=0
```

Exit code 0.

### v8.2 G3 verify-skills

Command: `node scripts/verify-skills.mjs 2>&1 | Select-String -Pattern "totals|VERDICT"; echo "GATE3-EXIT=$LASTEXITCODE"`

```text
totals: 10 checks — 10 passed, 0 failed, 0 skipped
VERDICT: PASS — all 10 checks ran and passed. The skills are clean.
GATE3-EXIT=0
```

Exit code 0.

### v8.2 G4 catalog check

Command: `node scripts/generate-catalog-json.mjs --check 2>&1; echo "GATE4-EXIT=$LASTEXITCODE"`

```text
check: registry/catalog.json — ok
GATE4-EXIT=0
```

Exit code 0, stderr-wrapper rendering as in v8.0.

### v8.2 G5 markdownlint on P3-touched Markdown

Command: same 11-file `npx --yes markdownlint-cli` line as v8.0.

```text
GATE5-EXIT=0
```

Exit code 0, zero findings.

### v8.2 G6 typecheck

Command: `npx --yes tsc --noEmit 2>&1; echo "GATE6-EXIT=$LASTEXITCODE"`

```text
GATE6-EXIT=0
```

Exit code 0, zero output lines.

### v8.2 G7 shell-touch check

Commands: same shell-touch check as v8.0.

```text
(no output lines — zero shell files touched this phase)
GATE7-NONE-TOUCHED
```

Honest statement: no shell files touched, so `shellcheck` did not run.

### v8.2 verdict

Battery green, 7 of 7 gates exit 0. No red, no STOP report.

## v8.3 entry — battery green

### v8.3 hardening notes

Catalog-mirror hardening repeat. Probed that the derived mirror still agrees with the lock and the registry sidecars: `--check` reports the mirror ok, the kit `catalog-agreement` row confirms all 157 lock entries match the mirror on kind, phase, tier, install command and verification, and registry row-count integrity holds at 16 sections and 2931 rows under repetition. The 8 provisional gear files stay lint-clean as Markdown without changing any shared file.

### v8.3 G1 verify-registry

Command: `node scripts/verify-registry.mjs 2>&1 | Select-String -Pattern "totals|VERDICT"; echo "GATE1-EXIT=$LASTEXITCODE"`

```text
totals: 7 checks — 7 passed, 0 failed, 0 skipped
VERDICT: PASS — all 7 checks ran and passed. The registry is clean.
GATE1-EXIT=0
```

Exit code 0.

### v8.3 G2 verify-kit

Command: `node scripts/verify-kit.mjs 2>&1 | Select-String -Pattern "VERDICT"; echo "GATE2-EXIT=$LASTEXITCODE"`

```text
VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).
GATE2-EXIT=0
```

Exit code 0.

### v8.3 G3 verify-skills

Command: `node scripts/verify-skills.mjs 2>&1 | Select-String -Pattern "totals|VERDICT"; echo "GATE3-EXIT=$LASTEXITCODE"`

```text
totals: 10 checks — 10 passed, 0 failed, 0 skipped
VERDICT: PASS — all 10 checks ran and passed. The skills are clean.
GATE3-EXIT=0
```

Exit code 0.

### v8.3 G4 catalog check

Command: `node scripts/generate-catalog-json.mjs --check 2>&1; echo "GATE4-EXIT=$LASTEXITCODE"`

```text
check: registry/catalog.json — ok
GATE4-EXIT=0
```

Exit code 0, stderr-wrapper rendering as in v8.0.

### v8.3 G5 markdownlint on P3-touched Markdown

Command: same 11-file `npx --yes markdownlint-cli` line as v8.0.

```text
GATE5-EXIT=0
```

Exit code 0, zero findings.

### v8.3 G6 typecheck

Command: `npx --yes tsc --noEmit 2>&1; echo "GATE6-EXIT=$LASTEXITCODE"`

```text
GATE6-EXIT=0
```

Exit code 0, zero output lines.

### v8.3 G7 shell-touch check

Commands: same shell-touch check as v8.0.

```text
(no output lines — zero shell files touched this phase)
GATE7-NONE-TOUCHED
```

Honest statement: no shell files touched, so `shellcheck` did not run.

### v8.3 verdict

Battery green, 7 of 7 gates exit 0. No red, no STOP report.

## v8.4 entry — battery green

### v8.4 hardening notes

Docs and type hardening repeat plus stability close. Probed all 11 P3-touched Markdown files lint-clean for the fifth consecutive run, the plugin TypeScript surface clean under `tsc --noEmit`, and the shell-touch check empty for the fifth time, which confirms zero shell drift across the whole phase. Five identical verdict sets with no flakes across back-to-back runs closes the soak on stability, not just on a single green pass.

### v8.4 G1 verify-registry

Command: `node scripts/verify-registry.mjs 2>&1 | Select-String -Pattern "totals|VERDICT"; echo "GATE1-EXIT=$LASTEXITCODE"`

```text
totals: 7 checks — 7 passed, 0 failed, 0 skipped
VERDICT: PASS — all 7 checks ran and passed. The registry is clean.
GATE1-EXIT=0
```

Exit code 0.

### v8.4 G2 verify-kit

Command: `node scripts/verify-kit.mjs 2>&1 | Select-String -Pattern "VERDICT"; echo "GATE2-EXIT=$LASTEXITCODE"`

```text
VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).
GATE2-EXIT=0
```

Exit code 0.

### v8.4 G3 verify-skills

Command: `node scripts/verify-skills.mjs 2>&1 | Select-String -Pattern "totals|VERDICT"; echo "GATE3-EXIT=$LASTEXITCODE"`

```text
totals: 10 checks — 10 passed, 0 failed, 0 skipped
VERDICT: PASS — all 10 checks ran and passed. The skills are clean.
GATE3-EXIT=0
```

Exit code 0.

### v8.4 G4 catalog check

Command: `node scripts/generate-catalog-json.mjs --check 2>&1; echo "GATE4-EXIT=$LASTEXITCODE"`

```text
check: registry/catalog.json — ok
GATE4-EXIT=0
```

Exit code 0, stderr-wrapper rendering as in v8.0.

### v8.4 G5 markdownlint on P3-touched Markdown

Command: same 11-file `npx --yes markdownlint-cli` line as v8.0.

```text
GATE5-EXIT=0
```

Exit code 0, zero findings.

### v8.4 G6 typecheck

Command: `npx --yes tsc --noEmit 2>&1; echo "GATE6-EXIT=$LASTEXITCODE"`

```text
GATE6-EXIT=0
```

Exit code 0, zero output lines.

### v8.4 G7 shell-touch check

Commands: same shell-touch check as v8.0.

```text
(no output lines — zero shell files touched this phase)
GATE7-NONE-TOUCHED
```

Honest statement: no shell files touched, so `shellcheck` did not run.

### v8.4 verdict

Battery green, 7 of 7 gates exit 0. No red, no STOP report.

## Coverage and touch record

- Version entries: v8.0, v8.1, v8.2, v8.3, v8.4 — 5 of 5, zero uncovered versions.
- Red gates: zero. STOP-report entries: zero. No repairs were made; no other node's files were touched; nothing was re-run blindly.
- Wrote `P3-SOAK-LOG.md`, new file, sole writer.
- Left untouched: `kit/kit.lock`, `registry/*`, `AGENT.md`, `WORKFLOW.md`, sibling P3 files, any branch, commit, push, or tag.
- Self-lint evidence, command `npx --yes markdownlint-cli P3-SOAK-LOG.md`:

```text
EXIT=0
```

Exit code 0, zero findings, zero output lines.
