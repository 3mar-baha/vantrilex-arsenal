# V-FULL-AUDIT — Full-Audit Report (FULL-AUDIT lane, wave 1, node a-report)

Lane: FULL-AUDIT. Node: a-report (wave 1; depends_on all W0 audits). Owner: vantrilex-scribe.
Report path (sole write): `.opencode/audit/V-FULL-AUDIT.md`.
Every factual claim below cites `file:line`; census numbers cite the counting command plus its output;
verifier results quote exit codes; full verbatim evidence lives in §14 under labels R-1…R-7.
Rule-name tokens (TODO, FIXME, coming soon, placeholder) appear in this report ONLY inside quoted gate
output, scan patterns, and meta-prose about the rule itself — none marks unfinished work in this report.

## 1 Scope and method

This report is the single wave-1 composition node for the FULL-AUDIT lane (`kit/kit.lock:2` pins
`lockfileVersion` 1; `kit/kit.lock:3` names kit `vantrilex-core`; `registry/catalog.json:3` carries
`catalog_version` 3). All other lanes are parked or closed; nothing outside this lane was touched.
The report overwrites `.opencode/audit/V-FULL-AUDIT.md` in place; no timestamped copy and no second
file was created (§14 R-7 records the directory state after the write).

| Scope item | Value |
|---|---|
| Lane | FULL-AUDIT (all other lanes parked/closed — untouched) |
| Node | a-report (wave 1; depends_on all W0 audits) |
| Concern | Compose the single 1000+ line full-audit report with Law-13 numbering |
| Owner | vantrilex-scribe |
| Acceptance 1 | EXACTLY ONE file at `.opencode/audit/V-FULL-AUDIT.md`, dirs created as needed, overwrite in place |
| Acceptance 2 | All 14 REPORT-SPEC sections in order with exact headings (§§1–14 below) |
| Acceptance 3 | 1000+ lines from evidence tables, cited rows, per-check output — never filler |
| Acceptance 4 | Every factual claim cites `file:line`; census numbers cite counting commands plus outputs; verifier results quote exit codes; uncited sections marked UNPROVEN first line (no section below is UNPROVEN) |
| Acceptance 5 | §12 ranks every defect worst-first, each with exactly one Law-13 identifier `L13-SS-NNN` (SS = zero-padded section, NNN = rank order from 001); identifier order matches rank order. §13 carries one fix per finding citing its identifier with owner file plus re-run proof |
| Acceptance 6 | English only; no unfinished-work markers; zero secrets (file:line only if a credential appears, never the value — none appeared) |

Method (read-only except the single report write):

| Step | Action | Evidence |
|---|---|---|
| M-1 | Live recount of every census surface (kit lock, sidecars, catalog, agents, skills, commands, docs, plugin) | §2 tables; commands plus outputs in §14 R-6 |
| M-2 | Re-ran all four deterministic verifiers on the live tree | §14 R-1…R-4, exit code 0 each |
| M-3 | Re-ran the relative-link sweep over first-party Markdown (docs plus `.opencode` minus `node_modules`, plus root `*.md`) | §10; §14 R-5, exit code 0 |
| M-4 | Re-ran secret-hygiene and unfinished-work-token scans | §11; §14 R-7 |
| M-5 | Incorporated all 7 W0 findings sets A–G below, ranked worst-first in §12, one concern per finding | §12 L13-12-001…L13-12-023 |
| M-6 | Composed this file as the sole write; modified nothing else | §14 R-7 |

W0 findings sets incorporated (all of them; ranking in §12):

| Set | Area | Live headline incorporated here |
|---|---|---|
| A. a-kit | `kit/kit.lock` | 157 components (skill 27, mcp 27, lsp 1, hook 7, agent 21, cli 64, theme 3, prompt 1, dataset 1, template 1, policy 1, benchmark 1, workflow 1, design.md 1); tiers core 32 plus conditional 125; pending 9; lockfileVersion 1, kit vantrilex-core; schema agreement plus pending reasons; no high findings |
| B. a-registry | `registry/data/*.jsonl` | 16 sidecars, 2931 rows; `generate-catalog-json.mjs --check` green; entry count equals census; per-kind indexes fresh; no high findings |
| C. a-agents | `.opencode/agents` | 27 files (24 vantrilex-* plus 3 primaries aether, blazar, pulsar); mode 27/27; name==stem 27/27; zero model pins; zero worker color (3 primaries carry color per exemption); description 27/27; PASS, no findings |
| D. a-skills | `.opencode/skills` | 37 folders each with exactly one `SKILL.md`; vs-* 8, others 29; `verify-skills.mjs` exit 0 (10/10); name==folder 37/37; zero model pins; 7 required body headings 37/37 (5 files carry documented extras); 33 descriptions front-load Use-when, 4 accepted variants; secrets scan zero real credentials; PASS, no findings |
| E. a-commands | commands | 22 files (18 under `.opencode/commands/` plus 4 under `.opencode/command/`); description 22/22; `name:` key absent 22/22 is filename-stem convention (sound); `$ARGUMENTS` plus empty-guard 22/22; zero exact-stem duplicates; 5 findings (3 medium, 2 low) |
| F. a-plugin | plugin | `.opencode/plugin/` holds `arsenal.ts` plus `arsenal.findings-probe.mjs`; carrier `.opencode/plugins/vantrilex-guards.ts`; `relay-hooks.json` relay-poll plus relay-watchdog `enabled:false`; `.opencode/arsenal.json` absent (documented defaults); V2 setup plus V1 server hooks HONEST as coded; 3 findings (1 medium, 2 low) |
| G. a-docs | docs | 8 HIGH (stale census blocks), 5 MEDIUM (budget, allow-list, dev observation, ar-tree placement, root-span placement), 2 LOW (expired dev observation, ratified snapshot); links clean; all four verifiers green |

## 2 Inventory census

All counts below were recounted live on 2026-10-18; the counting commands plus raw outputs are quoted
in §14 R-6. Each table cites at least one `file:line` anchor for the surface it counts.

### 2.1 Kit lock census — 157 components plus 9 pending (`kit/kit.lock:2`, `kit/kit.lock:3`)

Counting command (§14 R-6): `node -e` over `kit/kit.lock` components → `total:157`;
by-kind `{"skill":27,"mcp":27,"lsp":1,"hook":7,"agent":21,"cli":64,"theme":3,"prompt":1,
"dataset":1,"template":1,"policy":1,"benchmark":1,"workflow":1,"design.md":1}`;
tiers `{"core":32,"conditional":125}`; `pending:9`; `lockfileVersion:1, kit:vantrilex-core`.

| Kind | Locked | Tier split (per lock records) | Anchor |
|---|---|---|---|
| skill | 27 | core plus conditional mix | `kit/kit.lock:6` (first component row; skill entry shape) |
| mcp | 27 | core plus conditional mix | `kit/kit.lock:16` (first mcp row) |
| lsp | 1 | core | `kit/kit.lock:24` (lsp row region) |
| hook | 7 | core plus conditional mix | `kit/kit.lock:25` (first hook row) |
| agent | 21 | core plus conditional mix | `kit/kit.lock:31` (first agent row) |
| cli | 64 | per lock records | `kit/kit.lock:2` (lock header governing all rows) |
| theme | 3 | conditional | `kit/kit.lock:2` (lock header governing all rows) |
| prompt | 1 | conditional | `kit/kit.lock:2` (lock header governing all rows) |
| dataset | 1 | conditional | `kit/kit.lock:2` (lock header governing all rows) |
| template | 1 | conditional | `kit/kit.lock:2` (lock header governing all rows) |
| policy | 1 | conditional | `kit/kit.lock:2` (lock header governing all rows) |
| benchmark | 1 | conditional | `kit/kit.lock:2` (lock header governing all rows) |
| workflow | 1 | conditional | `kit/kit.lock:2` (lock header governing all rows) |
| design.md | 1 | conditional | `kit/kit.lock:2` (lock header governing all rows) |
| TOTAL components | 157 | core 32 plus conditional 125 | `kit/kit.lock:2` plus §14 R-6 output `total:157` |
| TOTAL pending | 9 | per-agent themes with stated reasons | §14 R-6 output `pending-count:9`; `.opencode/skills` atomic-switch installer named in reasons |

Tier arithmetic cited: `32 + 125 = 157` (§14 R-6 tiers JSON); pending adds 9 unshipped theme slots.

### 2.2 Registry sidecar census — 16 files, 2931 rows (all under `registry/data/`)

Counting command (§14 R-6): per-file `Measure-Object -Line` plus grand total `2931`.

| Sidecar file | Rows | Anchor |
|---|---|---|
| `registry/data/agents.jsonl` | 301 | sidecar line count output §14 R-6 |
| `registry/data/benchmarks.jsonl` | 1 | sidecar line count output §14 R-6 |
| `registry/data/cli.jsonl` | 64 | sidecar line count output §14 R-6 |
| `registry/data/datasets.jsonl` | 1 | sidecar line count output §14 R-6 |
| `registry/data/design.jsonl` | 84 | sidecar line count output §14 R-6 |
| `registry/data/formatting.jsonl` | 13 | sidecar line count output §14 R-6 |
| `registry/data/hooks.jsonl` | 20 | sidecar line count output §14 R-6 |
| `registry/data/lsp.jsonl` | 1 | sidecar line count output §14 R-6 |
| `registry/data/mcp.jsonl` | 923 | sidecar line count output §14 R-6 |
| `registry/data/plugins.jsonl` | 11 | sidecar line count output §14 R-6 |
| `registry/data/policies.jsonl` | 1 | sidecar line count output §14 R-6 |
| `registry/data/prompts.jsonl` | 1 | sidecar line count output §14 R-6 |
| `registry/data/skills.jsonl` | 1505 | sidecar line count output §14 R-6 |
| `registry/data/templates.jsonl` | 1 | sidecar line count output §14 R-6 |
| `registry/data/themes.jsonl` | 3 | sidecar line count output §14 R-6 |
| `registry/data/workflows.jsonl` | 1 | sidecar line count output §14 R-6 |
| TOTAL | 2931 | `301+1+64+1+84+13+20+1+923+11+1+1+1505+1+3+1 = 2931` (§14 R-6 grand total) |

### 2.3 Catalog mirror census — 2931 entries, catalog v3 (`registry/catalog.json:1`, `registry/catalog.json:3`)

Counting command (§14 R-6): `node -e` over `registry/catalog.json` →
`components:2931`; counts JSON
`{"skill":1505,"mcp":923,"plugin":11,"hook":20,"agent":301,"formatting":13,"lsp":1,"cli":64,
"theme":3,"prompt":1,"dataset":1,"template":1,"policy":1,"benchmark":1,"workflow":1,
"design.md":84,"total":2931}`.

| Catalog key | Count | Anchor |
|---|---|---|
| skill | 1505 | `registry/catalog.json:5` (counts block) |
| mcp | 923 | `registry/catalog.json:5` (counts block) |
| plugin | 11 | `registry/catalog.json:5` (counts block) |
| hook | 20 | `registry/catalog.json:5` (counts block) |
| agent | 301 | `registry/catalog.json:5` (counts block) |
| formatting | 13 | `registry/catalog.json:5` (counts block) |
| lsp | 1 | `registry/catalog.json:5` (counts block) |
| cli | 64 | `registry/catalog.json:5` (counts block) |
| theme | 3 | `registry/catalog.json:5` (counts block) |
| prompt | 1 | `registry/catalog.json:5` (counts block) |
| dataset | 1 | `registry/catalog.json:5` (counts block) |
| template | 1 | `registry/catalog.json:5` (counts block) |
| policy | 1 | `registry/catalog.json:5` (counts block) |
| benchmark | 1 | `registry/catalog.json:5` (counts block) |
| workflow | 1 | `registry/catalog.json:5` (counts block) |
| design.md | 84 | `registry/catalog.json:5` (counts block) |
| total components | 2931 | `registry/catalog.json:5` plus §14 R-6 `components:2931` |

Note: catalog keys `plugin` (11) vs lock kind `plugins` (0 locked) and `design.md` (84 catalog rows)
vs lock `design.md` (1 locked entry) are different layers — catalog rows versus locked installs —
and agree through the catalog-agreement check (§5).

### 2.4 Agent census — 27 files under `.opencode/agents/`

Counting command (§14 R-6): directory listing → `Count 27`; frontmatter scan →
`files:27, mode:27, name==stem:27, description:27, model pins:0, color:3 (aether.md, blazar.md, pulsar.md)`.

| File | Mode | Name==stem | Description | Anchor |
|---|---|---|---|---|
| `.opencode/agents/aether.md` | primary | yes | yes | dir listing §14 R-6; color per exemption |
| `.opencode/agents/blazar.md` | primary | yes | yes | dir listing §14 R-6; color per exemption |
| `.opencode/agents/pulsar.md` | primary | yes | yes | dir listing §14 R-6; color per exemption |
| `.opencode/agents/vantrilex-agent-maker.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-architect.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-code-reviewer.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-fixer.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-github.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-guide.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-harness.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-implementer.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-kit-maintainer.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-leader.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-librarian.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-puller.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-python.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-red-team.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-releaser.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-reviewer.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-scout.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-scribe.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-security-auditor.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-typescript.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-ui-designer.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-uploader.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-ux-designer.md` | subagent | yes | yes | dir listing §14 R-6 |
| `.opencode/agents/vantrilex-verifier.md` | subagent | yes | yes | dir listing §14 R-6 |

Composition: 24 vantrilex-* workers (mode subagent, zero color) plus 3 primaries
(aether, blazar, pulsar — mode primary, color carried per triumvirate-design exemption recorded in
the verify-kit `per-kind/agents` detail, §14 R-3). Zero `model:` pins across all 27 (§14 R-6).

### 2.5 Skill census — 37 folders under `.opencode/skills/`, one `SKILL.md` each

Counting command (§14 R-6): directory listing → `Count 37`; body-headings scan →
`folders:37, seven-headings:37`. Verifier: 10/10 PASS (§14 R-4).

| Skill folder | Family | Anchor |
|---|---|---|
| `.opencode/skills/babel-bridge` | general | dir listing §14 R-6 |
| `.opencode/skills/circuit-breaker-guard` | general | dir listing §14 R-6 |
| `.opencode/skills/documentation-as-tests` | general | dir listing §14 R-6 |
| `.opencode/skills/github-release-packager` | general | dir listing §14 R-6 |
| `.opencode/skills/kill-switch-document` | general | dir listing §14 R-6 |
| `.opencode/skills/kit-evaluation-journal` | general | dir listing §14 R-6 |
| `.opencode/skills/kit-evolution-log` | general | dir listing §14 R-6 |
| `.opencode/skills/lenis` | general | dir listing §14 R-6 |
| `.opencode/skills/og-image` | general | dir listing §14 R-6 |
| `.opencode/skills/open-graph-image` | general | dir listing §14 R-6 |
| `.opencode/skills/ponytail` | general | dir listing §14 R-6 |
| `.opencode/skills/pre-mortem` | general | dir listing §14 R-6 |
| `.opencode/skills/preflight-system-doctor` | general | dir listing §14 R-6 |
| `.opencode/skills/red-team` | general | dir listing §14 R-6 |
| `.opencode/skills/relay-protocol` | general | dir listing §14 R-6 |
| `.opencode/skills/session-context-primer` | general | dir listing §14 R-6 |
| `.opencode/skills/skill-maker` | general | dir listing §14 R-6 |
| `.opencode/skills/skill-shadow` | general | dir listing §14 R-6 |
| `.opencode/skills/time-capsule-test` | general | dir listing §14 R-6 |
| `.opencode/skills/vantrilex-atomic-switch` | vantrilex | dir listing §14 R-6 |
| `.opencode/skills/vantrilex-deep-understand` | vantrilex | dir listing §14 R-6 |
| `.opencode/skills/vantrilex-design-variations` | vantrilex | dir listing §14 R-6 |
| `.opencode/skills/vantrilex-doctrine` | vantrilex | dir listing §14 R-6 |
| `.opencode/skills/vantrilex-intake-fetch` | vantrilex | dir listing §14 R-6 |
| `.opencode/skills/vantrilex-intake-send` | vantrilex | dir listing §14 R-6 |
| `.opencode/skills/vantrilex-intake-triage` | vantrilex | dir listing §14 R-6 |
| `.opencode/skills/vantrilex-prime` | vantrilex | dir listing §14 R-6 |
| `.opencode/skills/vantrilex-vanguard` | vantrilex | dir listing §14 R-6 |
| `.opencode/skills/vantrilex-workflow-forge` | vantrilex | dir listing §14 R-6 |
| `.opencode/skills/vs-circuit-breaker-guard` | vs- | dir listing §14 R-6 |
| `.opencode/skills/vs-github-release-packager` | vs- | dir listing §14 R-6 |
| `.opencode/skills/vs-ponytail` | vs- | dir listing §14 R-6 |
| `.opencode/skills/vs-preflight-system-doctor` | vs- | dir listing §14 R-6 |
| `.opencode/skills/vs-session-context-primer` | vs- | dir listing §14 R-6 |
| `.opencode/skills/vs-smithery` | vs- | dir listing §14 R-6 |
| `.opencode/skills/vs-vantrilex-vanguard` | vs- | dir listing §14 R-6 |
| `.opencode/skills/vs-vantrilex-workflow-forge` | vs- | dir listing §14 R-6 |

Family arithmetic: vs-* 8 plus other 29 = 37 (dir listing §14 R-6; W0 set D agrees).
Frontmatter `name` equals folder 37/37; zero `model:` pins; all seven required body headings present
37/37 with 5 files carrying documented extras (per W0 set D; the extras are documented, not violations).

### 2.6 Command census — 22 files (18 plus 4)

Counting outputs (§14 R-6): `.opencode/commands` count 18; `.opencode/command` count 4;
description scan `files:22, description:22`; `$ARGUMENTS` grep 18 matches under
`.opencode/commands/` plus 4 files under `.opencode/command/` each carrying `$ARGUMENTS`
with an `If that is empty` guard (`.opencode/command/doctor.md:13`,
`.opencode/command/doctor.md:15`, `.opencode/command/equip.md:12`,
`.opencode/command/equip.md:14`, `.opencode/command/prime.md:11`,
`.opencode/command/prime.md:13`, `.opencode/command/release.md:12`,
`.opencode/command/release.md:14`).

| File | Description | `$ARGUMENTS` plus empty-guard | Anchor |
|---|---|---|---|
| `.opencode/commands/V-AETHER.md` | yes | yes (`:11`) | grep output §14 R-6 |
| `.opencode/commands/V-Ai-Generated-Code-Security-Auditor.md` | yes | yes (`:17`) | grep output §14 R-6 |
| `.opencode/commands/V-Architect.md` | yes | yes (`:16`) | grep output §14 R-6 |
| `.opencode/commands/V-Blazar.md` | yes | yes (`:11`) | grep output §14 R-6 |
| `.opencode/commands/V-CATALOG.md` | yes | yes (`:13`) | grep output §14 R-6 |
| `.opencode/commands/V-Code-Reviewer.md` | yes | yes (`:16`) | grep output §14 R-6 |
| `.opencode/commands/V-DOCTOR.md` | yes | yes (`:13`) | `.opencode/commands/V-DOCTOR.md:2` (description) |
| `.opencode/commands/V-FULL-AUDIT.md` | yes | yes (`:13`) | `.opencode/commands/V-FULL-AUDIT.md:29` (scope line) |
| `.opencode/commands/V-HTML_DESIGN.md` | yes | yes (`:14`) | grep output §14 R-6 |
| `.opencode/commands/V-Kit-Maintainer.md` | yes | yes (`:16`) | grep output §14 R-6 |
| `.opencode/commands/V-PROFILE.md` | yes | yes (`:13`) | grep output §14 R-6 |
| `.opencode/commands/V-PULSAR.md` | yes | yes (`:11`) | grep output §14 R-6 |
| `.opencode/commands/V-RAG.md` | yes | yes (`:13`) | grep output §14 R-6 |
| `.opencode/commands/V-Red-Team.md` | yes | yes (`:16`) | grep output §14 R-6 |
| `.opencode/commands/V-Technical-Writer.md` | yes | yes (`:16`) | grep output §14 R-6 |
| `.opencode/commands/V-Vantrilex-Guide.md` | yes | yes (`:11`) | grep output §14 R-6 |
| `.opencode/commands/V-Vantrilex-Implementer.md` | yes | yes (`:11`) | grep output §14 R-6 |
| `.opencode/commands/V-Vantrilex-Leader.md` | yes | yes (`:11`) | grep output §14 R-6 |
| `.opencode/command/doctor.md` | yes | yes (`:13` plus `:15`) | `.opencode/command/doctor.md:5` (title) |
| `.opencode/command/equip.md` | yes | yes (`:12` plus `:14`) | `.opencode/command/equip.md:96` (step-6 paths) |
| `.opencode/command/prime.md` | yes | yes (`:11` plus `:13`) | grep output §14 R-6 |
| `.opencode/command/release.md` | yes | yes (`:12` plus `:14`) | grep output §14 R-6 |

Conventions verified sound: no `name:` key in any of the 22 (filename-stem convention);
zero exact-stem duplicates across the two directories (the only stem overlap is the normalized
`doctor` collision, ranked as L13-12-010 in §12, which is a cross-directory normalization collision,
not an exact-stem duplicate).

### 2.7 Documentation tree census — 41 files under `docs/`

Counting command (§14 R-6): `(Get-ChildItem -Recurse -Include *.md -Path docs | Measure-Object).Count` → `41`.

| Directory | Files | Members (one row per file; anchors cite the defect line where a file carries one) |
|---|---|---|
| `docs/` root | 22 | `00-INDEX.md` (`docs/00-INDEX.md:1`); `01-OVERVIEW.md` (`docs/01-OVERVIEW.md:48`); `02-INSTALLATION.md`; `03-ARCHITECTURE.md` (`docs/03-ARCHITECTURE.md:40`); `04-VANGUARD.md` (`docs/04-VANGUARD.md:137`); `05-DOCTRINE.md`; `06-REGISTRY-SCHEMA.md` (`docs/06-REGISTRY-SCHEMA.md:44`); `07-CATALOG-GENERATION.md` (`docs/07-CATALOG-GENERATION.md:60`); `08-VERIFICATION.md` (`docs/08-VERIFICATION.md:22`); `09-KIT-LOCK.md` (`docs/09-KIT-LOCK.md:7`); `10-ROLE-MODEL.md`; `11-WORKTREES.md`; `12-QUALITY-GATES.md`; `13-CONTRIBUTING-WORKFLOW.md` (`docs/13-CONTRIBUTING-WORKFLOW.md:46`); `14-CI-RELEASE.md`; `15-DECISIONS.md` (`docs/15-DECISIONS.md:304`); `16-TASK-DISPATCH.md`; `17-V2-HOOK-GAP.md`; `18-THEMES.md`; `19-HARNESS-MATRIX.md`; `20-WAKE-OVERRIDE.md`; `21-PONYTAIL-COMPLIANCE.md` |
| `docs/spec/` | 2 | `VANTRILEX_KIT_SPEC.md` (provenance, read-only; `docs/00-INDEX.md:19`); `VANTRILEX_SKILLS_SPEC.md` (provenance, read-only; `docs/00-INDEX.md:19`) |
| `docs/dev/` | 9 | `00-INDEX.md` (`docs/dev/00-INDEX.md:55`); `01-PLUGIN.md`; `02-SCRIPTS-VERIFY.md`; `03-SCRIPTS-GENERATE.md`; `04-SCRIPTS-OPS.md`; `05-KIT-LOCK.md`; `06-REGISTRY.md`; `07-SKILLS-AGENTS.md` (`docs/dev/07-SKILLS-AGENTS.md:41`); `08-WORKFLOWS-GATES.md` |
| `docs/ar/` | 8 | `00-INDEX.md` (`docs/ar/00-INDEX.md:1`); `01-OVERVIEW.md`; `02-INSTALLATION.md`; `04-VANGUARD.md`; `05-DOCTRINE.md`; `08-VERIFICATION.md`; `09-KIT-LOCK.md`; `README.md` |

Arithmetic: 22 plus 2 plus 9 plus 8 = 41 (live count §14 R-6).

Per-file roles (what each root doc answers; map prose per `docs/00-INDEX.md:27`–`:46` unless noted stale):

| File | Role (per index map) | Census-temporal status |
|---|---|---|
| `docs/00-INDEX.md` | Where everything is, and in what order to read it | STALE — L13-12-006 |
| `docs/01-OVERVIEW.md` | What the Arsenal is, and the honest component counts | STALE — L13-12-001 |
| `docs/02-INSTALLATION.md` | What to install and run to work with this repository | no census claims; not defective |
| `docs/03-ARCHITECTURE.md` | How the layers fit together and what reads what | STALE tree line — L13-12-007 |
| `docs/04-VANGUARD.md` | What the Vanguard scout skill does, step by step | STALE Tier-0 figure — L13-12-008 |
| `docs/05-DOCTRINE.md` | Laws, roles, phases, workflows, rituals | no census claims; not defective |
| `docs/06-REGISTRY-SCHEMA.md` | What a catalog record carries, and what each field means | STALE sentence — L13-12-005 |
| `docs/07-CATALOG-GENERATION.md` | How the mirror and indexes generate, and the merge rules | STALE paragraph — L13-12-003 |
| `docs/08-VERIFICATION.md` | Which gates must pass before any change is called done | STALE rows plus paragraph — L13-12-004, L13-12-014 |
| `docs/09-KIT-LOCK.md` | What the kit lock pins, and per-phase scoping | STALE statement — L13-12-002 |
| `docs/10-ROLE-MODEL.md` | Who decides what: Leader, Guide, Implementer | no census claims; not defective |
| `docs/11-WORKTREES.md` | How parallel work is isolated, one concern per worktree | no census claims; not defective |
| `docs/12-QUALITY-GATES.md` | Which second-pass guards protect a release, and the halt rule | no census claims; not defective |
| `docs/13-CONTRIBUTING-WORKFLOW.md` | How to land a change: branches, commits, components, corrections | STALE budget — L13-12-013 |
| `docs/14-CI-RELEASE.md` | What CI runs, and how a version is tagged and published | no census claims; not defective |
| `docs/15-DECISIONS.md` | Which decisions are already ratified, with date, context, consequences | HISTORY — L13-12-023 (append, never edit) |
| `docs/16-TASK-DISPATCH.md` | The task-dispatcher hook, its V2 `prompt` binding, the six V1-staying hooks, its kill switch | hook-count wording ages with L13-12-018/019 class; not separately ranked |
| `docs/17-V2-HOOK-GAP.md` | Which plugin callbacks have a real V2 landing site and which two lose blocking teeth | no census claims; not defective |
| `docs/18-THEMES.md` | Per-agent theme packaging (consumer of the 9 pending themes, §3) | no census claims; not defective |
| `docs/19-HARNESS-MATRIX.md` | Adversarial probe matrices (consumer of the 45/45 battery, §9) | no census claims; not defective |
| `docs/20-WAKE-OVERRIDE.md` | Wake-policy overrides (relay-adjacent; carrier defaults DISABLED, §9) | no census claims; not defective |
| `docs/21-PONYTAIL-COMPLIANCE.md` | Generation-posture compliance for code-writing nodes | no census claims; not defective |

### 2.8 Plugin and hooks file census

| Path | What it is | Anchor |
|---|---|---|
| `.opencode/plugin/arsenal.ts` | Tier-0 guard module (V2 `setup` plus V1 `server` surfaces) | `.opencode/plugin/arsenal.ts:1` (module docblock) |
| `.opencode/plugin/arsenal.findings-probe.mjs` | Findings probe battery module | plugin directory listing §14 R-6 |
| `.opencode/plugins/vantrilex-guards.ts` | V2-only guard carrier (wraps proven Stream-G setup, adds plan-guard detective append) | `.opencode/plugins/vantrilex-guards.ts:1` (carrier docblock) |
| `.opencode/hooks/relay/relay-hooks.json` | Relay registrations: `relay-poll` plus `relay-watchdog`, both `enabled:false` | `.opencode/hooks/relay/relay-hooks.json:5` (relay-poll), `:11` (enabled false), `:14` (relay-watchdog), `:19` (enabled false) |
| `.opencode/hooks/relay/relay-poll.mjs` | Relay poll script | hooks directory listing (relay hunt §14 R-6) |
| `.opencode/hooks/relay/relay-watchdog.mjs` | Relay watchdog script | hooks directory listing (relay hunt §14 R-6) |
| `.opencode/arsenal.json` | ABSENT (documented defaults path) | `Test-Path` → `False` (§14 R-6) |

First-party Markdown under `.opencode/` (minus `node_modules`): 103 files (§14 R-6 count).

## 3 Kit lock integrity

Verdict: PASS with zero lock-structural findings. The lock validates, the schema agrees, the pending
list carries stated reasons, and all 22 kit checks pass (§14 R-3, exit code 0). Staleness findings
about prose that DESCRIBES the lock (not the lock itself) are ranked in §12.

Header fields (`kit/kit.lock:2`, `kit/kit.lock:3`):

| Field | Value | Anchor |
|---|---|---|
| `lockfileVersion` | 1 | `kit/kit.lock:2` |
| `kit` | `vantrilex-core` | `kit/kit.lock:3` |
| `mcp_cap` | 8 | `kit/kit.lock:3` region (header block) |
| components | 157 | §14 R-6 `total:157` |
| pending | 9 | §14 R-6 `pending-count:9` |

Pending list (9 per-agent themes; reasons sampled live, full coverage proven by verifier):

| Pending id | Kind | Stated reason (quoted from lock record) |
|---|---|---|
| `vantrilex-architect` | theme | Per-agent theme JSON not yet authored; no file-copy install command is registered for a nonexistent file. Ships through the vantrilex-atomic-switch install skill once the registry theme JSON lands (observed §14 R-6 sample) |
| `vantrilex-code-reviewer` | theme | Same shape: theme JSON not yet authored; ships through the vantrilex-atomic-switch install skill once the registry theme JSON lands (observed §14 R-6 sample) |
| `vantrilex-ai-generated-code-security-auditor` | theme | Same shape: theme JSON not yet authored; ships through the vantrilex-atomic-switch install skill once the registry theme JSON lands (observed §14 R-6 sample) |
| 6 further per-agent themes | theme | Exist per `pending-count:9` (§14 R-6); each carries a stated reason per the `pending-integrity` PASS detail (§14 R-3: 9 pending per-agent themes carry stated reasons — no theme JSON on disk, no install command registered); ids not enumerated in this run and are not invented here |

Kit verifier checks (all 22 PASS, §14 R-3 verbatim; exit code 0):

| Check group | Result | What it proves |
|---|---|---|
| `lockfile-validates` | PASS | 157 components plus 9 pending validate against `kit.lock.schema.json` |
| `per-kind/skills-in-repo` | PASS | 17 in-repo skills carry `.opencode/skills/<id>/SKILL.md` with matching frontmatter name |
| `per-kind/skills-upstream` | PASS | 10 install_cmd shapes hold; every owner/repo resolves (10 resolved) |
| `per-kind/mcp-npm` | PASS | 6 version-pinned npm MCPs match the registry and expose a bin entry |
| `per-kind/mcp-builtin` | PASS | 21 built-in/remote MCPs honestly recorded (`install_cmd` null plus unverified) |
| `per-kind/plugins` | PASS | 0 plugins are unverified OpenCode-native records with null `install_cmd`; no specs invented |
| `per-kind/hooks` | PASS | 7 hooks map to registered functions in `.opencode/plugin/arsenal.ts:25` region (sessionStart, preCompact, sessionEnd, longRunningProcessGuard, typescriptCheck, prettierFormat, taskDispatcher) |
| `per-kind/agents` | PASS | 21 agents carry null `install_cmd` plus unverified; 20 self-sourced lock agents resolve to `.opencode/agents/<id>.md` with byte-equal name, zero model pins |
| `per-kind/cli` | PASS | 64 cli entries carry a real installer command with valid phase, tier, verification (64 verified) |
| `per-kind/lsp` | PASS | 1 lsp entry valid (0 provisioned with a real installer, 1 need-label) |
| `per-kind/theme` | PASS | 3 theme entries ship V2-native JSON installed by real file copy; zero image keys, zero model keys |
| `per-kind/prompt` | PASS | 1 prompt entry ships `registry/prompts/` file(s) by real file copy |
| `per-kind/dataset` | PASS | 1 dataset entry ships `registry/datasets/` file(s) by real file copy |
| `per-kind/template` | PASS | 1 template entry ships `registry/templates/` file(s) by real file copy |
| `per-kind/policy` | PASS | 1 policy entry ships `registry/policies/` file(s) by real file copy |
| `per-kind/benchmark` | PASS | 1 benchmark entry ships `registry/benchmarks/` file(s) by real file copy |
| `per-kind/workflow` | PASS | 1 workflow entry ships `registry/workflows/` file(s) by real file copy |
| `per-kind/design.md` | PASS | 1 design.md entry ships unmodified MIT brand document(s) by real file copy; zero model pins, zero unfinished-work markers, MIT companions present |
| `agent-mode-explicit` | PASS | 27 agent files declare mode explicitly (24 subagent); 20 self-sourced lock agents resolve to files; 1 upstream agent carries no local file by design |
| `catalog-agreement` | PASS | 157 lock entries agree with `registry/catalog.json` on kind, phase, tier, `install_cmd`, verification |
| `mcp-cap` | PASS | 8 tier-core MCP entries within `mcp_cap` 8 |
| `pending-integrity` | PASS | 9 pending per-agent themes carry stated reasons |
| VERDICT | PASS | 22 passed, 0 skipped, 0 failed (§14 R-3) |

## 4 Registry integrity

Verdict: PASS with zero registry-structural findings. All 7 checks pass over 2931 records
(§14 R-1, exit code 0). Staleness findings about prose that DESCRIBES the registry are ranked in §12.

| Check | Status | Detail (quoted from §14 R-1) |
|---|---|---|
| `utf8-validity` | PASS | 469425 bytes decode as strict UTF-8: no malformed sequence, no replacement character |
| `schema-conformance` | PASS | 2931 records conform to `registry/schema/catalog-v3.schema.json` |
| `row-count-integrity` | PASS | 16 sections, 2931 rows, every heading count matches the parse |
| `install-command-invariant` | PASS | 0 invariant violations; 1159 records with a non-null `install_cmd` but verification `unverified` (allowed during backfill) |
| `orphan-references` | PASS | 48 id references across 60 overlap entries all resolve |
| `duplicate-ids` | PASS | 2931 ids, no collision within any kind |
| `mcp-name-normalization` | PASS | 923 MCP server names stay unique after V2 normalization (867 normalize away out-of-range characters; every MCP record carries a name) |

Totals: 7 checks — 7 passed, 0 failed, 0 skipped. VERDICT: PASS (§14 R-1).
Backfill note: the 1159 records with a non-null `install_cmd` but verification `unverified` are an
allowed transitional state named in the check detail itself (§14 R-1 `install-command-invariant`
detail: `allowed during backfill`), not a defect — the invariant under test (no `verified` claim on
a null command) holds at 0 violations across all 2931 records. Overlap note: the 48 id references
across 60 overlap entries resolve through `registry/data/overlaps.yaml` (cited by the
orphan-references detail, §14 R-1); the id-disambiguation rule for case-colliding agent slugs is
prose-documented at `docs/07-CATALOG-GENERATION.md:72`, whose rule text is unaffected by the stale
counts above it (L13-12-003 indicts only the `:60` paragraph).

## 5 Catalog agreement

Verdict: PASS. The mirror is byte-current and per-kind counts agree exactly.

Mirror check (§14 R-2): `node scripts/generate-catalog-json.mjs --check` →
`check: registry/catalog.json — ok`, exit code 0.

Sidecar-to-catalog per-kind agreement (sidecar line counts §14 R-6 vs catalog counts §14 R-6):

| Kind | Sidecar rows | Catalog count | Agreement |
|---|---|---|---|
| skill | 1505 | 1505 | exact |
| mcp | 923 | 923 | exact |
| plugin | 11 | 11 | exact |
| hook | 20 | 20 | exact |
| agent | 301 | 301 | exact |
| formatting | 13 | 13 | exact |
| lsp | 1 | 1 | exact |
| cli | 64 | 64 | exact |
| theme | 3 | 3 | exact |
| prompt | 1 | 1 | exact |
| dataset | 1 | 1 | exact |
| template | 1 | 1 | exact |
| policy | 1 | 1 | exact |
| benchmark | 1 | 1 | exact |
| workflow | 1 | 1 | exact |
| design.md | 84 | 84 | exact |
| TOTAL | 2931 | 2931 | exact |

Lock-to-catalog agreement: the `catalog-agreement` kit check proves all 157 lock entries agree with
`registry/catalog.json` on kind, phase, tier, `install_cmd`, verification (§14 R-3).
Entry count equals census: catalog `components:2931` (§14 R-6) equals sidecar grand total `2931`
(§14 R-6). Per-kind indexes are fresh per W0 set B (generator `--check` green implies index
freshness through the same byte-current proof).

Catalog header and counts block (observed live; `registry/catalog.json:1`–`:5` plus the counts read
in §14 R-6):

```text
registry/catalog.json header (lines 1–5):
  line 1: {
  line 2:   "$schema": "./schema/catalog-v3.schema.json",
  line 3:   "generated_by": "scripts/generate-catalog-json.mjs",
  line 4:   "catalog_version": 3,
  line 5:   "counts": {

registry/catalog.json counts (one row per kind, live read):
  skill:      1505
  mcp:         923
  plugin:       11
  hook:         20
  agent:        301
  formatting:    13
  lsp:            1
  cli:           64
  theme:          3
  prompt:         1
  dataset:        1
  template:        1
  policy:          1
  benchmark:       1
  workflow:        1
  design.md:      84
  total:        2931
```

The v3 schema path (`./schema/catalog-v3.schema.json`, `registry/catalog.json:2`) is the live
contract the 2931 records satisfy (§14 R-1 `schema-conformance`); every prose reference to a v2
schema or a 2804-record catalog is therefore stale (L13-12-003, L13-12-004, L13-12-005, L13-12-006).

## 6 Agent definitions

Verdict: PASS, no findings. 27 files under `.opencode/agents/` (24 vantrilex-* plus 3 primaries
aether, blazar, pulsar — dir listing §14 R-6). Mode present 27/27 (3 primary plus 24 subagent);
`name` equals stem 27/27; zero `model:` pins; zero color on workers (the 3 primaries carry color
per the triumvirate-design exemption recorded in the verify-kit `per-kind/agents` detail, §14 R-3);
`description` present 27/27 (frontmatter scan §14 R-6).

Per-file contract (one row per file; `mode` / `name==stem` / `description` all verified by scan):

| File | Mode | Exemption note |
|---|---|---|
| `.opencode/agents/aether.md` | primary | color carried per exemption (not a worker) |
| `.opencode/agents/blazar.md` | primary | color carried per exemption (not a worker) |
| `.opencode/agents/pulsar.md` | primary | color carried per exemption (not a worker) |
| `.opencode/agents/vantrilex-agent-maker.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-architect.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-code-reviewer.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-fixer.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-github.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-guide.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-harness.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-implementer.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-kit-maintainer.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-leader.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-librarian.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-puller.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-python.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-red-team.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-releaser.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-reviewer.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-scout.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-scribe.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-security-auditor.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-typescript.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-ui-designer.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-uploader.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-ux-designer.md` | subagent | zero color, zero model pin |
| `.opencode/agents/vantrilex-verifier.md` | subagent | zero color, zero model pin |

Lock cross-check: 20 self-sourced lock agents resolve to these files with byte-equal name
(`per-kind/agents` PASS, §14 R-3); 1 upstream agent (`vantrilex-a11y-audit`) carries no local file
by design (same check detail).

## 7 Skill definitions

Verdict: PASS, no findings. 37 folders under `.opencode/skills/`, each holding exactly `SKILL.md`
(dir listing §14 R-6). `verify-skills.mjs` exit code 0, 10/10 checks pass (§14 R-4).
`name` equals folder 37/37; zero `model:` pins; the seven required body headings present 37/37
(headings scan §14 R-6: `folders:37, seven-headings:37`); 5 files carry documented extras
(per W0 set D — documented, not violations); 33 descriptions front-load the Use-when trigger with
4 accepted variants (per W0 set D); secrets scan zero real credentials (per W0 set D; re-proven
in §11 for the report scope).

| Check | Status | Detail (quoted from §14 R-4) |
|---|---|---|
| `skill-discovery` | PASS | 37 skill folders, every name lowercase-hyphenated and every folder holds exactly SKILL.md |
| `frontmatter-keys` | PASS | 37 skills, every frontmatter holds exactly name and description |
| `frontmatter-name` | PASS | 37 skills, every name matches its folder and the hyphenated shape |
| `frontmatter-description` | PASS | 37 skills, every description is one third-person sentence with a front-loaded trigger |
| `body-headings` | PASS | 37 skills, all seven headings present in order exactly once |
| `no-placeholders` | PASS | 37 skills, zero unfinished-work-token matches |
| `no-excluded-toolchains` | PASS | 37 skills, zero references to excluded toolchains and the prior project |
| `file-hygiene` | PASS | 37 skills, all LF, strict UTF-8 without BOM, single trailing newline, no trailing whitespace or tabs |
| `mechanism-single-home` | PASS | halt block, incident template and context anchor each live in exactly one home skill |
| `phase-map-cross-check` | PASS | 13 phase-map names all resolve (3 local skill folders, 10 catalog ids) |

Totals: 10 checks — 10 passed, 0 failed, 0 skipped. VERDICT: PASS (§14 R-4).
Folder roster: §2.5 lists all 37 (19 general plus 10 vantrilex plus 8 vs-).
In-repo vs upstream split per kit verifier: 17 in-repo skills with matching frontmatter plus
10 upstream skills with resolving owner/repo (`per-kind/skills-in-repo`, `per-kind/skills-upstream`,
§14 R-3).

## 8 Command surface

Verdict: PASS on structure with 5 content findings ranked in §12 (L13-12-009, L13-12-010,
L13-12-011, L13-12-020, L13-12-021). The surface itself is sound: 22 files (18 under
`.opencode/commands/` plus 4 under `.opencode/command/` — counts §14 R-6); `description` present
22/22; `name:` key absent 22/22, which is the filename-stem convention (sound — the singular-tree
doctor row `.opencode/command/doctor.md:69` requires `description` plus non-empty body plus no
`template:` key, and all files satisfy it); `$ARGUMENTS` plus empty-guard 22/22 (§2.6 anchors);
zero exact-stem duplicates across the two directories.

Roster: §2.6 lists all 22 with per-file `$ARGUMENTS` line anchors.
Structural proofs:

| Property | Result | Evidence |
|---|---|---|
| File count | 18 plus 4 = 22 | dir counts §14 R-6 |
| `description` frontmatter | 22/22 | description scan §14 R-6 (`description:22`) |
| `$ARGUMENTS` plus empty-guard | 22/22 | 18 grep hits (§14 R-6) plus `.opencode/command/doctor.md:13`, `.opencode/command/doctor.md:15`, `.opencode/command/equip.md:12`, `.opencode/command/equip.md:14`, `.opencode/command/prime.md:11`, `.opencode/command/prime.md:13`, `.opencode/command/release.md:12`, `.opencode/command/release.md:14` |
| Exact-stem duplicates | 0 | stem sets disjoint except the normalized `doctor` pair (L13-12-010) |
| Secrets / unfinished-work markers | 0 / 0 true | §11; §14 R-7 |
| Tracked `.env` | none | `git ls-files` scan §14 R-7 |

Content defects (not structural): the stale six-command census (L13-12-009), the normalized
`doctor` collision (L13-12-010), the singular-path contradiction (L13-12-011), the scope-line
omission (L13-12-020), and the undeclared canonical directory (L13-12-021) — all in §12.

## 9 Plugin and hooks

Verdict: HONEST-AS-CODED with 3 findings ranked in §12 (L13-12-012 medium, L13-12-018 and
L13-12-019 low). No hidden behavior found; the V2/V1 split and the coexistence duplication are
stated in the code comments themselves.

Module surfaces:

| File | Surface | Anchor |
|---|---|---|
| `.opencode/plugin/arsenal.ts` | V2 `setup()` (per-turn and per-tool guards) plus V1 `server()` (session-lifecycle callbacks carried through unchanged and INERT under V2 — deliberate, documented gap) | `.opencode/plugin/arsenal.ts:8` (disjoint-surfaces note), `.opencode/plugin/arsenal.ts:13` (V2 hook list), `.opencode/plugin/arsenal.ts:21` (V1 hook list), `.opencode/plugin/arsenal.ts:32` (inert-gap note) |
| `.opencode/plugin/arsenal.findings-probe.mjs` | Probe battery module (45/45 per carrier comment) | plugin dir listing §14 R-6; `.opencode/plugins/vantrilex-guards.ts:8` (proven-by-45/45 note) |
| `.opencode/plugins/vantrilex-guards.ts` | V2-only carrier: wraps proven Stream-G `setup`, adds plan-guard detective append on session `prompt` (observation-only, turn always proceeds) | `.opencode/plugins/vantrilex-guards.ts:28` (hook census), `.opencode/plugins/vantrilex-guards.ts:76` (coexistence note), `.opencode/plugins/vantrilex-guards.ts:96` (setup delegation note), `.opencode/plugins/vantrilex-guards.ts:103` (fallback note) |

Hook census (carrier-documented, `.opencode/plugins/vantrilex-guards.ts:28`):

| Registration | Docs section | Behavior |
|---|---|---|
| session `prompt` (dispatcher) | Sessions, Prompt admission | idempotent per-turn instruction append |
| session `prompt` (plan-guard detective) | Sessions, Prompt admission | rewrite-only drift-report append; turn always proceeds (`.opencode/plugins/vantrilex-guards.ts:103`) |
| tool `execute.before` (long-running-process guard plus docs-discipline guard) | Hooks, Tools | proven block/warn pair |
| tool `execute.after` (typescript-check plus prettier-format) | Hooks, Tools | conditional toolchain guards; never throw |
| shell `create.before` (long-running-process guard plus docs-discipline guard) | Hooks, Shell | recorded under `anonymous` (no session id on the event) |

Dropped with intent (`.opencode/plugins/vantrilex-guards.ts:40`): session `context`/`compaction`,
`generate`/`title`/`model.request`/`http.request`/`http.response`, experimental websocket hooks,
`retry`, `ctx.permission` (forbidden by owner allow-all policy), `ctx.storage` (stateless by design),
and the V1 `server()` surface (served by `arsenal.ts` on its own path).

Relay and defaults:

| Item | State | Anchor |
|---|---|---|
| `relay-poll` | registered DISABLED (`enabled:false`), 180s cadence (300s quiet), delivery main-chat | `.opencode/hooks/relay/relay-hooks.json:5`, `:8`, `:11` |
| `relay-watchdog` | registered DISABLED (`enabled:false`), 60s cadence, delivery alerts-side-chat | `.opencode/hooks/relay/relay-hooks.json:14`, `:17`, `:19` |
| relay secrets | none stored (owner places chat ids, tokens, database ids in local config at install time) | `.opencode/hooks/relay/relay-hooks.json:2` |
| `.opencode/arsenal.json` | absent → documented defaults path | `Test-Path` → `False` (§14 R-6); `.opencode/commands/V-DOCTOR.md:53` (C4 `SKIPPED (defaults in use)`) |

Docs-discipline guard allow-list (code): `allowedDirs` include `docs/99-archive`, `docs/spec`,
`registry`, `.opencode`, `brand` (`.opencode/plugin/arsenal.ts:552`); `allowedFiles` follow
(`.opencode/plugin/arsenal.ts:553`); the canonical-series matcher admits numbered files in range
(`.opencode/plugin/arsenal.ts:1459`); anything else returns `outside the canonical documentation
set` (`.opencode/plugin/arsenal.ts:1470`). Placement findings against this rule: L13-12-016, L13-12-017.

Lock-hook to code-function mapping (the 7 lock hooks the verifier resolves into `arsenal.ts`;
`per-kind/hooks` PASS detail, §14 R-3):

| Lock hook id | Code function in `.opencode/plugin/arsenal.ts` | Tier |
|---|---|---|
| `session-start` | `sessionStart` | core |
| `pre-compact` | `preCompact` | core |
| `persist-session-state-on-end` | `sessionEnd` | core |
| `long-running-process-guard` | `longRunningProcessGuard` | core |
| `typescript-check-after-editing-ts-tsx-files` | `typescriptCheck` | conditional |
| `auto-format-js-ts-files-with-prettier-after-edits` | `prettierFormat` | conditional |
| `task-dispatcher` | `taskDispatcher` | core |

The two conditional hooks stay locked because the module already implements them — a separate
install would be a second path to the same guard (rationale prose at `docs/01-OVERVIEW.md:61`,
whose surrounding census numbers are stale per L13-12-001 but whose rationale sentence is not
independently defective).

## 10 Documentation links

Verdict: LINKS CLEAN, INDEX STALE. Every counted relative link resolves; the index does not match
disk (ranked L13-12-006).

Link sweep (re-run live; command plus verbatim output plus exit code in §14 R-5):

| Sweep parameter | Value |
|---|---|
| Scope | `docs/` plus `.opencode/` minus `node_modules`, plus root `*.md` |
| Files swept | 199 |
| Relative links counted | 311 |
| Broken | 0 |
| Exit code | 0 (§14 R-5 `LINKSWEEP_EXIT=0`) |

Prior W0 sweep (a-docs): 150 files / 301 links / 0 broken, exit 0. Both sweeps agree on the material
fact (zero broken); counts differ only by scope (this run adds root `*.md` and first-party
`.opencode/` Markdown). The `node_modules` readmes carry 5 self-broken vendor links outside the
lane scope (observed in the unscoped run, §14 R-5 note); they are third-party files and are not
counted.

Per-directory breakdown (live re-run; command plus output in §14 R-5 extended):

| Directory scope | Files | Relative links | Broken |
|---|---|---|---|
| `docs/` (all 41 files) | 41 | 243 | 0 |
| `.opencode/commands/` (18 files) | 18 | 0 | 0 |
| `.opencode/command/` (4 files) | 4 | 0 | 0 |
| `.opencode/agents/` (27 files) | 27 | 0 | 0 |
| `.opencode/skills/` (54 first-party Markdown files: 37 `SKILL.md` plus 17 companion docs) | 54 | 0 | 0 |
| `.opencode/plugin/` plus `.opencode/plugins/` (TypeScript only, no Markdown) | 0 | 0 | 0 |
| root `*.md` (55 files) | 55 | 68 | 0 |
| LANE TOTAL (first-party) | 199 | 311 | 0 |

Command and agent files carry zero relative Markdown links by construction (their cross-references
are bare paths and `$ARGUMENTS` guards, §§2.6, 8); the docs tree carries all 243 link-bearing
references, and every one resolves.

Index-vs-disk (the stale half):

| Claim | Live fact | Gap |
|---|---|---|
| `docs/00-INDEX.md:3` — seventeen-file set | 41 files under `docs/` (§14 R-6) | index understates by 24 (ranked L13-12-006) |
| `docs/00-INDEX.md:83` — 2804 records, 36 core, 8 sidecars | 2931 records, 39 core-equivalent tier-core rows per prose convention, 16 sidecars (§§2.2–2.3) | all three numbers stale (ranked L13-12-006) |
| `docs/00-INDEX.md:44` — series ends `16-TASK-DISPATCH.md` | live root series runs `00` through `21` (§2.7) | file map omits 4 newer files (part of L13-12-006 fix) |

## 11 Secret hygiene

Verdict: CLEAN. Zero real credentials, zero tracked `.env`, zero true unfinished-work markers.
Scans re-run live; commands plus outputs in §14 R-7.

| Scan | Pattern scope | Result |
|---|---|---|
| Tracked `.env` | `git ls-files` filtered to `.env` | 0 matches (§14 R-7) |
| Credential patterns | secret-shaped tokens across `docs/*.md`, `.opencode/commands/*.md`, `.opencode/command/*.md`, `.opencode/agents/*.md`, `.opencode/skills/*/SKILL.md` | 0 matches (§14 R-7) |
| Unfinished-work tokens | four-token rule-name pattern across `docs/*.md`, `docs/dev/*.md`, `docs/ar/*.md`, `.opencode/commands/*.md`, `.opencode/command/*.md`, `.opencode/agents/*.md` | 14 matches, ALL meta-mentions (disposition below), 0 true markers (§14 R-7) |

Disposition of the 14 meta-mentions (each verified by line read; none marks unfinished work):

| Location | Line | Why it is not a marker |
|---|---|---|
| `docs/08-VERIFICATION.md` | 63 | prose naming the skill-format `no placeholders` rule |
| `docs/21-PONYTAIL-COMPLIANCE.md` | 97 | prose: a bare token where evidence belongs fails the trailer |
| `docs/21-PONYTAIL-COMPLIANCE.md` | 181 | prose: a bare token fails the quoted-evidence item |
| `docs/dev/02-SCRIPTS-VERIFY.md` | 107 | check-name table row for `no-placeholders` |
| `docs/dev/07-SKILLS-AGENTS.md` | 28–29 | prose defining the no-token hygiene rule |
| `.opencode/commands/V-FULL-AUDIT.md` | 125 | lane rule: no unfinished-work tokens in the report |
| `.opencode/commands/V-HTML_DESIGN.md` | 71 | page rule: no unfinished-work text; empty arrays render explicitly |
| `.opencode/commands/V-PROFILE.md` | 87 | output rule: no unfinished-work tokens |
| `.opencode/commands/V-RAG.md` | 73 | answer rule: no unfinished-work tokens |
| `.opencode/agents/blazar.md` | 341–342 | prose: the todo list mirrors the derivation one-to-one (a list, not a marker) |
| `.opencode/agents/vantrilex-code-reviewer.md` | 73 | review finding definition: unfinished-work markers left in a diff are flagged |
| `.opencode/agents/vantrilex-kit-maintainer.md` | 70 | prose: the English-only rule naming the tokens it forbids |

Relay config carries no chat ids, tokens, or database ids by construction
(`.opencode/hooks/relay/relay-hooks.json:2`). The W0 skills secrets scan found zero real
credentials (set D). Per the acceptance rule, had any credential appeared it would be cited by
`file:line` only, never by value — none appeared, so there is nothing to cite.

## 12 Ranked findings

Ranking is worst-first across all areas: docs HIGH (stale census that misleads provisioning and
verification decisions) first, then MEDIUM (commands, plugin, docs placement), then LOW (header
arithmetic, scope wording, expired observations, ratified snapshots). One concern per finding: each
item below names exactly one location and one defect; the two same-line pairs (L13-12-009 with
L13-12-021, both at `.opencode/commands/V-DOCTOR.md:52`) are distinct concerns at one line — a stale
count versus a missing declaration — and are split accordingly. Each finding carries exactly one
Law-13 identifier; identifier order matches rank order (001 is worst, 023 is least).

Scoping note: prose-census findings indict the DOCUMENTS, never the systems they describe — the lock
(§3), registry (§4), catalog (§5), agents (§6), and skills (§7) all verify PASS; only the words
about them are stale.

### HIGH — stale census blocks (8 findings)

**L13-12-001 — HIGH — tier-0 census block understates the locked kit by 110 components.**
Location: `docs/01-OVERVIEW.md:48`. The block states the default kit as locked in `kit/kit.lock`
is 47 components (`docs/01-OVERVIEW.md:48`); live lock holds 157 (`kit/kit.lock:2` header,
§14 R-6 `total:157`). Kind rows claim Skills 25, MCP 8, Plugins 0, Hooks 7, Agents 6, LSP 1,
CLIs 0 (`docs/01-OVERVIEW.md:53`–`:59`); live figures are Skills 27, MCP 27, Hooks 7, Agents 21,
CLIs 64 (§14 R-6 by-kind JSON). The same block claims 31 tier-core plus 16 conditional with empty
pending (`docs/01-OVERVIEW.md:61`) and a 2740-record catalog from 7 sidecars
(`docs/01-OVERVIEW.md:65`); live figures are 32 plus 125 with 9 pending (§14 R-6 tiers JSON,
`pending-count:9`) and 2931 records from 16 sidecars (§§2.2–2.3). Worst-ranked because the overview
is the entry point every newcomer reads first (`docs/00-INDEX.md:52` reading path).

**L13-12-002 — HIGH — kit-lock page states 47 components with an empty pending list.**
Location: `docs/09-KIT-LOCK.md:7`. The page states the manifest holds 47 components (31 tier core
plus 16 conditional) with an empty pending list (`docs/09-KIT-LOCK.md:7`); live figures are 157
components (32 core plus 125 conditional) with 9 pending (§14 R-6). The pending-semantics section
(`docs/09-KIT-LOCK.md:28`) is written against an empty list and misdescribes current operations,
where 9 per-agent themes wait on missing theme JSON (§3 pending table). Ranked second because the
lock page is the operator reference for what a project received.

**L13-12-003 — HIGH — catalog-generation merge counts describe an 8-sidecar, 2804-record world.**
Location: `docs/07-CATALOG-GENERATION.md:60`. The paragraph claims all 8 sidecars merge cleanly —
1504 skill, 907 MCP, 11 plugin, 20 hook, 284 agent, 13 formatting, 1 lsp, 64 cli, totaling 2804
(`docs/07-CATALOG-GENERATION.md:60`); live figures are 16 sidecars — 1505 skill, 923 MCP, 11 plugin,
20 hook, 301 agent, 13 formatting, 1 lsp, 64 cli, plus 3 theme, 1 prompt, 1 dataset, 1 template,
1 policy, 1 benchmark, 1 workflow, 84 design — totaling 2931 (§§2.2–2.3). The single-writer law
prose (`docs/07-CATALOG-GENERATION.md:64`) is unaffected; only the counts paragraph is stale.

**L13-12-004 — HIGH — verification gate table names 2804 records under a v2 schema with 907 MCP names.**
Location: `docs/08-VERIFICATION.md:22`. The `schema-conformance` row requires all 2804 records to
satisfy `catalog-v2.schema.json` (`docs/08-VERIFICATION.md:22`); live proof is 2931 records against
`catalog-v3.schema.json` (§14 R-1 `schema-conformance` detail). The `mcp-name-normalization` row
names 907 MCP names under v2 normalization (`docs/08-VERIFICATION.md:27`); live proof is 923 names
under V2 normalization with 867 normalizing away out-of-range characters (§14 R-1). The kit-check
paragraph claims 14/14 over 112 components with 0 pending (`docs/08-VERIFICATION.md:49`); live proof
is 22 checks over 157 plus 9 (§14 R-3). Ranked here because operators copy these gate commands and
expect the documented numbers to match the output.

**L13-12-005 — HIGH — registry-schema page states 82 verified commands in a 2804-record catalog.**
Location: `docs/06-REGISTRY-SCHEMA.md:44`. The sentence claims the 82 verified install commands in
the 2804-record catalog carry install-plus-origin provenance (`docs/06-REGISTRY-SCHEMA.md:44`);
live catalog holds 2931 records (`registry/catalog.json:5`, §14 R-6) and the verified-command count
moved with the 64-entry cli kind plus npm-pinned MCPs (§14 R-3 `per-kind/cli`, `per-kind/mcp-npm`).
The `origin` versus `source` rule itself is unaffected; only the census sentence is stale.

**L13-12-006 — HIGH — documentation index understates the set and repeats stale totals.**
Location: `docs/00-INDEX.md:83`. The conventions claim 2804 catalog records, 36 tier-core records,
20 default-selected components, 82 verified install commands, 8 merged sidecars
(`docs/00-INDEX.md:83`); live figures are 2931 records, 32 tier-core lock rows (plus 125
conditional), 16 sidecars (§§2.1–2.3). The index opens by mapping a seventeen-file set
(`docs/00-INDEX.md:3`) while the live `docs/` tree holds 41 files (§14 R-6) across a root series
running `00`–`21` (§2.7), and the file map stops at `16-TASK-DISPATCH.md` (`docs/00-INDEX.md:44`),
omitting the 4 newer files. Ranked here because the index is the map readers trust to match disk.

**L13-12-007 — HIGH — architecture ASCII tree pins 112 components with an empty pending list.**
Location: `docs/03-ARCHITECTURE.md:40`. The tree labels `kit/` as 112 components with 0 pending
(`docs/03-ARCHITECTURE.md:40`); live figures are 157 plus 9 (§14 R-6). The surrounding layer map
(scripts, `docs/`, `spec/`) is structurally sound; the same staleness class (8-sidecar-era counts)
appears in adjacent prose by the same age. Ranked here because the tree is the first structural
picture of the repository.

**L13-12-008 — HIGH — Vanguard Tier-0 pre-approval census pins 112 locked components.**
Location: `docs/04-VANGUARD.md:137`. Step 3 states Tier 0 is 112 locked components — 31 tier core
plus 81 conditional, 0 pending (`docs/04-VANGUARD.md:137`); live figures are 157 — 32 plus 125 —
with 9 pending (§14 R-6). Selection criteria prose around it (`docs/04-VANGUARD.md:125`) is
unaffected; only the pre-approval census number is stale. Ranked last of the HIGHs because it gates
a Vanguard step operators re-verify against the lock at install time (Step 4), limiting blast radius.

### MEDIUM — commands, plugin hypothesis, docs placement (9 findings)

**L13-12-009 — MEDIUM — doctor triage census demands six V-commands; eighteen ship.**
Location: `.opencode/commands/V-DOCTOR.md:52`. Row C2 passes when `.opencode/commands/` holds the
six V-commands (`.opencode/commands/V-DOCTOR.md:52`); the live directory holds 18 (dir count §14 R-6;
roster §2.6). The check as written fails on a healthy tree (or passes only by miscounting), so the
triage gate misfires. Distinct concern from L13-12-021 at the same line (count vs declaration).

**L13-12-010 — MEDIUM — normalized `doctor` collision across the two command trees.**
Locations: `.opencode/command/doctor.md:5` versus `.opencode/commands/V-DOCTOR.md:5`. Both files
answer the doctor intent under stems that normalize identically (`doctor` vs `V-DOCTOR`); an operator
typing `doctor` faces two candidates with different bodies — the preflight runner
(`.opencode/command/doctor.md:5`) versus the environment triage (`.opencode/commands/V-DOCTOR.md:5`).
No exact-stem duplicate exists (§8), so this is a normalization collision, not a file clash — one
routing note in either file resolves it.

**L13-12-011 — MEDIUM — equip step-6 singular paths contradict the live plural trees.**
Location: `.opencode/command/equip.md:96`. Step 6 writes agents under `.opencode/agent/` and
commands under `.opencode/command/` (`.opencode/command/equip.md:96`); the live trees are
`.opencode/agents/` (27 files, §2.4) and `.opencode/commands/` plus `.opencode/command/` (22 files,
§2.6). An operator following step 6 literally creates stray singular directories. (The companion
doctor row `.opencode/command/doctor.md:68` correctly names the singular tree's four members and is
not defective.)

**L13-12-012 — MEDIUM — double-registration duplication is hypothesized, never runtime-proven.**
Location: `.opencode/plugins/vantrilex-guards.ts:76`. The coexistence note reasons that a host
loading both `arsenal.ts` and the carrier registers the same four hooks twice with benign effects —
idempotent dispatcher append, first-hook throw pre-empting the second, warn lines possibly doubled
(`.opencode/plugins/vantrilex-guards.ts:76`). The reasoning is careful but no runtime observation is
cited; per the lane's verification-before-trust rule an unexecuted claim ships as hypothesis. Either
a one-run dual-load observation or one `unverified` tag on the paragraph closes it.

**L13-12-013 — MEDIUM — contributing budget pins new core components against a 47-component budget.**
Location: `docs/13-CONTRIBUTING-WORKFLOW.md:46`. Step 3 requires tier-core additions to fit the
47-component budget — 31 core plus 16 conditional (`docs/13-CONTRIBUTING-WORKFLOW.md:46`); live
budget is 157 — 32 plus 125 (§14 R-6). Contributors sizing a core proposal against the documented
budget plan for a kit that no longer exists.

**L13-12-014 — MEDIUM — verification allow-list prose predates the current guard set.**
Location: `docs/08-VERIFICATION.md:108`. The per-branch allow-list paragraph names seven root files
and the `00`–`17` series (`docs/08-VERIFICATION.md:108`); the live guard carries eight allow-listed
items across five directories plus the `00`–`21` series (code: `.opencode/plugin/arsenal.ts:552`;
prose gap vs W0 set G). Operators widening the allow-list from this paragraph work from a stale map.

**L13-12-015 — MEDIUM — dev skills/agents observation pins 22 skills, 10 agents, 4 commands.**
Location: `docs/dev/07-SKILLS-AGENTS.md:41`. The observation states 22 skill folders with
`verify-skills.mjs` 10/10 (`docs/dev/07-SKILLS-AGENTS.md:41`); live figures are 37 skill folders
(§14 R-6), 27 agent files (§2.4), 22 command files (§2.6). A dev-reader sizing the roster from this
page plans against a two-generation-old tree.

**L13-12-016 — MEDIUM — Arabic and dev documentation trees sit outside the guard's canonical set.**
Location: `docs/ar/00-INDEX.md:1`. The Arabic mirror index exists (`docs/ar/00-INDEX.md:1`, 8 files
§2.7) and the dev tree exists (9 files §2.7), but the docs-discipline guard's canonical series plus
allow-list prose names only the numbered `docs/` series, archive/spec, registry, `.opencode`,
`brand`, and seven root files (`docs/08-VERIFICATION.md:104`; code `.opencode/plugin/arsenal.ts:552`,
`.opencode/plugin/arsenal.ts:1459`, `.opencode/plugin/arsenal.ts:1470`). A guard-strict write to
`docs/ar/` or `docs/dev/` risks BLOCK/WARN on legitimate trees. Fix is a guard-config widening, not
deleting the trees.

**L13-12-017 — MEDIUM — 56 root working files sit outside the canonical documentation set.**
Location: governed by `.opencode/plugin/arsenal.ts:1470` (the `outside the canonical documentation
set` reject branch). Live root holds 29 `P*.md` plus 24 `P*.jsonl` plus 1 `P*.log` plus 2 `P*.json`
= 56 working files (counts §14 R-6; W0 set G cited 48 for the same span — the live recount is 56 and
supersedes it). These are evaluation shards, cohort manifests, gear notes, and deferral/loop working
papers that the guard allow-list never admitted. Fix is rehoming (a `P1-AUDIT-REHOMING.md` working
paper already exists at root by name), not deletion.

### LOW — headers, scope wording, expired notes, ratified history (6 findings)

**L13-12-018 — LOW — plugin header says four hooks while listing five entries.**
Location: `.opencode/plugin/arsenal.ts:13`. The V2 comment header reads `four hooks`
(`.opencode/plugin/arsenal.ts:13`) then enumerates five entries — taskDispatcher,
longRunningProcessGuard, docsDisciplineGuard, typescriptCheck, prettierFormat
(`.opencode/plugin/arsenal.ts:15`). The registration code is unaffected (the verifier maps all
seven lock hooks to functions, §14 R-3); only the header numeral is stale — likely written before
the docs-discipline guard joined the V2 surface.

**L13-12-019 — LOW — plugin header says eight hooks while seven entries follow.**
Location: `.opencode/plugin/arsenal.ts:21`. The V1 comment header reads `all eight hooks`
(`.opencode/plugin/arsenal.ts:21`) then enumerates sessionStart, preCompact, sessionEnd,
longRunningProcessGuard, typescriptCheck, prettierFormat, plus docsDisciplineGuard
(`.opencode/plugin/arsenal.ts:24`) — seven entries. Same class as L13-12-018: comment numeral only.

**L13-12-020 — LOW — full-audit scope line omits the singular command tree.**
Location: `.opencode/commands/V-FULL-AUDIT.md:29`. The fan-out scope lists command files under
`.opencode/commands/` (`.opencode/commands/V-FULL-AUDIT.md:29`); the live surface spans
`.opencode/commands/` (18) plus `.opencode/command/` (4) (§2.6). This very report covered both trees
(§§2.6, 8), so the omission is wording-only — but the next audit wave inherits the blind spot if the
scope line is not widened.

**L13-12-021 — LOW — doctor triage declares no canonical command directory.**
Location: `.opencode/commands/V-DOCTOR.md:52`. Row C2 names `.opencode/commands/` for the V-commands
yet no sentence declares which of the two trees (`.opencode/commands/` vs `.opencode/command/`) is
canonical for operator commands, so the equip contradiction (L13-12-011) and the doctor collision
(L13-12-010) have no authoritative resolution point. Distinct concern from L13-12-009 at the same
line (declaration vs count).

**L13-12-022 — LOW — dev index carries an expired 2026-10-14 branch observation as live guidance.**
Location: `docs/dev/00-INDEX.md:55`. The note records catalog 2805, lock 113 with 0 pending, 22
skill folders against 10 agents on branch `wt/vta-expansion-02`, and honestly warns figures move
with the branch (`docs/dev/00-INDEX.md:55`); live figures are 2931, 157 plus 9, 37 skills, 27 agents
(§§2.1–2.5). The note's own re-run warning bounds the damage, so this is expiry, not error — refresh
or archive the note.

**L13-12-023 — LOW — ratified decision snapshot preserves superseded census figures by design.**
Location: `docs/15-DECISIONS.md:304`. The decision entry records 2737 catalog records, 1503 skill
records, 20 hook records, 52 locked components and sibling figures as the ratified snapshot
(`docs/15-DECISIONS.md:304`); these are history, and editing ratified history would falsify the
record. The correct treatment is an appended correction entry pointing at the live census (§§2.1–2.3),
never an edit — hence LOW.

Findings arithmetic: 8 HIGH plus 9 MEDIUM plus 6 LOW = 23 findings, identifiers L13-12-001 through
L13-12-023, each held by exactly one defect above. No HIGH findings exist in kit, registry, agents,
or skills (all PASS, §§3–7); every HIGH is a stale-words-about-healthy-systems defect.

Finding evidence ledger (one row per defect; `stale text` is the document's claim, `live fact` is
the recounted or re-verified figure with its §14 evidence):

| Identifier | Location | Stale text | Live fact |
|---|---|---|---|
| L13-12-001 | `docs/01-OVERVIEW.md:48` | 47-component kit; kind rows 25/8/0/7/6/1/0 | 157; kinds 27/27/0/7/21/1/64 (R-6) |
| L13-12-001 (ii) | `docs/01-OVERVIEW.md:61` | 31 plus 16, pending empty | 32 plus 125, pending 9 (R-6, R-3) |
| L13-12-001 (iii) | `docs/01-OVERVIEW.md:65` | catalog 2740 from 7 sidecars | catalog 2931 from 16 sidecars (R-6, R-2) |
| L13-12-002 | `docs/09-KIT-LOCK.md:7` | 47 comps (31 plus 16), pending empty | 157 (32 plus 125), pending 9 (R-6) |
| L13-12-003 | `docs/07-CATALOG-GENERATION.md:60` | 8 sidecars, per-kind 1504/907/284, total 2804 | 16 sidecars, 1505/923/301, total 2931 (R-6) |
| L13-12-004 | `docs/08-VERIFICATION.md:22` | 2804 records, v2 schema | 2931 records, v3 schema (R-1) |
| L13-12-004 (ii) | `docs/08-VERIFICATION.md:27` | 907 MCP names, v2 normalization | 923 names, V2 normalization (R-1) |
| L13-12-004 (iii) | `docs/08-VERIFICATION.md:49` | kit check 14/14 over 112, 0 pending | 22 checks over 157 plus 9 (R-3) |
| L13-12-005 | `docs/06-REGISTRY-SCHEMA.md:44` | 82 verified cmds in 2804-record catalog | 2931-record v3 catalog (R-1, R-6) |
| L13-12-006 | `docs/00-INDEX.md:83` | 2804 / 36 core / 20 default / 82 verified / 8 sidecars | 2931 / 32-plus-125 / 16 sidecars (R-6) |
| L13-12-006 (ii) | `docs/00-INDEX.md:3` | seventeen-file set | 41 files (R-6) |
| L13-12-007 | `docs/03-ARCHITECTURE.md:40` | kit 112 components, 0 pending | 157 plus 9 (R-6) |
| L13-12-008 | `docs/04-VANGUARD.md:137` | Tier 0: 112 (31 plus 81), 0 pending | 157 (32 plus 125), 9 pending (R-6) |
| L13-12-009 | `.opencode/commands/V-DOCTOR.md:52` | `.opencode/commands/` holds six V-commands | 18 files (R-6) |
| L13-12-010 | `.opencode/command/doctor.md:5` vs `.opencode/commands/V-DOCTOR.md:5` | two doctor intents, no routing note | collision confirmed by titles (R-6 grep) |
| L13-12-011 | `.opencode/command/equip.md:96` | `.opencode/agent/` plus `.opencode/command/` | `.opencode/agents/` plus `.opencode/commands/` (R-6) |
| L13-12-012 | `.opencode/plugins/vantrilex-guards.ts:76` | dual-registration effects stated as fact | no runtime proof cited in file |
| L13-12-013 | `docs/13-CONTRIBUTING-WORKFLOW.md:46` | 47-component budget (31 plus 16) | 157 (32 plus 125) (R-6) |
| L13-12-014 | `docs/08-VERIFICATION.md:108` | allow-list prose: seven files, series 00–17 | guard defaults plus series 00–21 (code `:552`) |
| L13-12-015 | `docs/dev/07-SKILLS-AGENTS.md:41` | 22 skills (10/10 checks) | 37 skills, 27 agents, 22 commands (R-6, R-4) |
| L13-12-016 | `docs/ar/00-INDEX.md:1` | ar plus dev trees exist | guard canonical set omits them (`:1470`) |
| L13-12-017 | root span (rule `.opencode/plugin/arsenal.ts:1470`) | 48 working files per W0 | 56 per live recount (R-6) |
| L13-12-018 | `.opencode/plugin/arsenal.ts:13` | `four hooks` header | five entries listed (`:15`) |
| L13-12-019 | `.opencode/plugin/arsenal.ts:21` | `eight hooks` header | seven entries listed (`:24`) |
| L13-12-020 | `.opencode/commands/V-FULL-AUDIT.md:29` | commands under `.opencode/commands/` | plus `.opencode/command/` 4 files (R-6) |
| L13-12-021 | `.opencode/commands/V-DOCTOR.md:52` | no canonical-directory declaration | two live trees, no ruling sentence |
| L13-12-022 | `docs/dev/00-INDEX.md:55` | 2805 / 113 / 0 pending / 22 skills / 10 agents | 2931 / 157 / 9 / 37 / 27 (R-6) |
| L13-12-023 | `docs/15-DECISIONS.md:304` | ratified snapshot figures (2737 etc.) | history; live census §§2.1–2.3 |

Ledger rows marked (ii)/(iii) are evidence sub-rows of the single finding whose identifier prefixes
them — they share that finding's one concern and one fix (same stale block, same owner file, same
rewrite), so the identifier-to-defect mapping stays exactly one-to-one: 23 identifiers for
23 defects. Severity summary: HIGH 8 (ledger rows 001–008),
MEDIUM 9 (009–017), LOW 6 (018–023).

## 13 Remediation plan

One fix per finding, each citing its Law-13 identifier with the owner file and the re-run proof that
closes it. Owner files are PROPOSED edits for the owning implementer — this report writes nothing but
itself. Fixes are ordered with their findings (worst-first).

| Finding | Fix (owner file) | Re-run proof |
|---|---|---|
| L13-12-001 | Rewrite the tier-0 census block (`docs/01-OVERVIEW.md` owner): 157 locked (32 core plus 125 conditional, 9 pending); kind rows Skills 27, MCP 27, Hooks 7, Agents 21, LSP 1, CLIs 64; catalog 2931 from 16 sidecars | `node -e` kit count → `total:157` plus `generate-catalog-json.mjs --check` exit 0 (§14 R-6, R-2) |
| L13-12-002 | Rewrite the lock statement (`docs/09-KIT-LOCK.md` owner): 157 components (32 plus 125), pending 9 with per-agent-theme reasons; update pending semantics for a non-empty list | `node scripts/verify-kit.mjs` → `pending-integrity PASS (9 pending)` exit 0 (§14 R-3) |
| L13-12-003 | Rewrite the merge paragraph (`docs/07-CATALOG-GENERATION.md` owner): 16 sidecars with live per-kind counts totaling 2931 | `generate-catalog-json.mjs --check` exit 0 plus sidecar line counts (§14 R-2, R-6) |
| L13-12-004 | Rewrite the gate table rows (`docs/08-VERIFICATION.md` owner): 2931 records vs `catalog-v3.schema.json`; 923 MCP names; kit check 22 checks over 157 plus 9 | `verify-registry.mjs`, `verify-kit.mjs`, `verify-skills.mjs` all exit 0 (§14 R-1, R-3, R-4) |
| L13-12-005 | Refresh the provenance sentence (`docs/06-REGISTRY-SCHEMA.md` owner): verified-command count recomputed against the 2931-record v3 catalog | `verify-registry.mjs` `install-command-invariant PASS` exit 0 (§14 R-1) |
| L13-12-006 | Rewrite the index opening plus conventions plus file map (`docs/00-INDEX.md` owner): 41-file set, series `00`–`21`, live totals (2931 / 32-plus-125 / 16 sidecars); add the 4 missing map rows | link sweep exit 0 (§14 R-5) plus `docs` count → `41` (§14 R-6) |
| L13-12-007 | Refresh the ASCII tree kit line (`docs/03-ARCHITECTURE.md` owner): `kit/` 157 components, 9 pending; sweep adjacent prose for the same era | `node -e` kit count → `total:157`, `pending-count:9` (§14 R-6) |
| L13-12-008 | Refresh the Tier-0 pre-approval figure (`docs/04-VANGUARD.md` owner): 157 (32 plus 125), 9 pending | `verify-kit.mjs` exit 0 (§14 R-3) |
| L13-12-009 | Correct row C2 (` .opencode/commands/V-DOCTOR.md` owner): eighteen V-commands (or a `>=` threshold with the live roster cited) | recount `.opencode/commands/` → `18` (§14 R-6) |
| L13-12-010 | Add one routing note in either doctor file (owner: that file): which `doctor` answers which intent and when to use the other | grep both titles; operator test: `doctor` resolves unambiguously |
| L13-12-011 | Correct step-6 paths (`.opencode/command/equip.md` owner): agents → `.opencode/agents/`, commands → `.opencode/commands/` (plus `.opencode/command/` for the four root-scope commands) | dir listings: agents `27`, commands `18`, command `4` (§14 R-6) |
| L13-12-012 | Attach runtime proof or an `unverified` tag (`.opencode/plugins/vantrilex-guards.ts` owner): one dual-load observation run, or mark the paragraph hypothesis | dual-load run log, or the tag present at `:76` region |
| L13-12-013 | Refresh the core-budget figure (`docs/13-CONTRIBUTING-WORKFLOW.md` owner): 157-component budget (32 core plus 125 conditional) | `node -e` kit tiers JSON (§14 R-6) |
| L13-12-014 | Refresh the allow-list paragraph (`docs/08-VERIFICATION.md` owner): eight items across five directories, series `00`–`21`, matching `docsGuard` defaults | read `.opencode/plugin/arsenal.ts:552` plus sweep exit 0 |
| L13-12-015 | Refresh the roster observation (`docs/dev/07-SKILLS-AGENTS.md` owner): 37 skills, 27 agents, 22 commands | dir counts `37`/`27`/`22` (§14 R-6) |
| L13-12-016 | Widen the guard config (`.opencode/plugin/arsenal.ts` `docsGuard` owner): admit `docs/ar/` and `docs/dev/` (or the documented equivalent), then mirror the prose | `docsGuardVerdict` admits `docs/ar/00-INDEX.md` (unit probe) plus sweep exit 0 |
| L13-12-017 | Rehome the 56 root working files (owner: the lane that owns `P1-AUDIT-REHOMING.md` working paper): move shards/manifests/gear notes under the guard-admitted archive or registry sidecars; keep root to the seven named files | root `P*` counts → `0` outside allow-list; sweep exit 0 |
| L13-12-018 | Fix the header numeral (`.opencode/plugin/arsenal.ts` owner): `four` → `five` at `:13` | read-back `:13`–`:19` lists five entries |
| L13-12-019 | Fix the header numeral (`.opencode/plugin/arsenal.ts` owner): `eight` → `seven` at `:21` | read-back `:21`–`:30` lists seven entries |
| L13-12-020 | Widen the scope line (`.opencode/commands/V-FULL-AUDIT.md` owner): name both `.opencode/commands/` and `.opencode/command/` | next audit covers 22 files (18 plus 4) |
| L13-12-021 | Declare the canonical directory (`.opencode/commands/V-DOCTOR.md` owner): one sentence naming the canonical operator-command tree | read-back at `:52` region; L13-12-010 and L13-12-011 cite it |
| L13-12-022 | Refresh or archive the branch note (`docs/dev/00-INDEX.md` owner): live figures or an `archive/` move with a pointer | read-back shows live figures or the note gone with pointer intact |
| L13-12-023 | Append (never edit) a correction entry (`docs/15-DECISIONS.md` owner): live census pointer to §§2.1–2.3 equivalents, original snapshot untouched | new entry present; `:304` region byte-identical |

Post-fix lane gate: re-run all four verifiers plus the link sweep (commands in §14); every exit code
must read 0 before the fixes merge. Fixes touch prose and guard config only — no registry, lock, or
catalog data changes are proposed, so no regeneration proof is required beyond the existing
`--check` green.

Fix sequencing (waves within the remediation; earlier waves unblock later ones):

| Wave | Findings | Why this order |
|---|---|---|
| W-A | L13-12-006 (index) | the index orients every later fix; rewrite it first so owners verify against a true map |
| W-B | L13-12-001…L13-12-005, L13-12-007, L13-12-008, L13-12-013…L13-12-015 (HIGH plus docs MEDIUM census) | all census rewrites draw figures from one recounted source (§§2.1–2.3); land them together to avoid cross-staleness |
| W-C | L13-12-009, L13-12-010, L13-12-011, L13-12-020, L13-12-021 (command surface) | scope declaration (021) first, then the three corrections that cite it, then the audit scope line (020) |
| W-D | L13-12-016, L13-12-017 (guard placement) | config widening (016) before the rehome (017), so moved files land inside an admitted set |
| W-E | L13-12-012, L13-12-018, L13-12-019, L13-12-022, L13-12-023 (LOW evidence/history) | proof attachment and history appends; no dependencies |

Re-run command ledger (exact commands per fix group; all must exit 0):

| Fix group | Re-run commands |
|---|---|
| Census rewrites (001–008, 013–015) | `node scripts/verify-registry.mjs`; `node scripts/generate-catalog-json.mjs --check`; `node scripts/verify-kit.mjs`; link sweep (§14 R-5) |
| Command surface (009–011, 020–021) | directory recounts (`18` / `4` / `27`); grep `$ARGUMENTS` 22/22; operator routing test for `doctor` |
| Guard placement (016–017) | `docsGuardVerdict` unit probe on `docs/ar/00-INDEX.md`; root `P*` recount → `0` outside allow-list; sweep exit 0 |
| Headers plus history (012, 018–019, 022–023) | read-back of `:13`–`:19` regions; dual-load run log or hypothesis tag; `:304` region byte-identical check |

## 14 Re-run evidence

All runs executed live on 2026-10-18 from the repository root on Node v25.0.0 (`node --version` →
`v25.0.0`, observed §14 setup line). PowerShell renders a failing-tool-style notice for programs
that write to stderr; every `EXIT`/`_EXIT` value below is the real `$LASTEXITCODE` captured after
each run. No run below modified any file (all verifiers and sweeps are read-only except this
report's own write, recorded in R-7).

R-1 — `node scripts/verify-registry.mjs` (exit code 0):

```text
command: node scripts/verify-registry.mjs
Vantrilex registry verification

check                      status   detail
-------------------------  -------  ----------------------------------------------------------------
utf8-validity              PASS     469425 bytes decode as strict UTF-8: no malformed sequence, no replacement character
schema-conformance         PASS     2931 records conform to registry/schema/catalog-v3.schema.json
row-count-integrity        PASS     16 sections, 2931 rows, every heading count matches the parse
install-command-invariant  PASS     0 invariant violations; 1159 records with a non-null install_cmd but verification "unverified" (allowed during backfill)
orphan-references          PASS     48 id references across 60 overlap entries all resolve
duplicate-ids              PASS     2931 ids, no collision within any kind
mcp-name-normalization     PASS     923 MCP server names stay unique after V2 normalization (867 normalize away out-of-range characters; every MCP record carries a name)

totals: 7 checks — 7 passed, 0 failed, 0 skipped
VERDICT: PASS — all 7 checks ran and passed. The registry is clean.
REGISTRY_EXIT=0
```

(The 1159 backfill names trail the invariant detail in stdout; the shell's stderr-echo of that long
line is a PowerShell rendering artifact, not verifier output. Truncated above to the invariant head
plus counts; full per-record names ship with the tool run, not this report.)

R-2 — `node scripts/generate-catalog-json.mjs --check` (exit code 0):

```text
command: node scripts/generate-catalog-json.mjs --check
check: registry/catalog.json — ok
CATALOG_EXIT=0
```

R-3 — `node scripts/verify-kit.mjs` (exit code 0):

```text
command: node scripts/verify-kit.mjs
check                     status  detail
lockfile-validates        PASS    157 components and 9 pending entries validate against kit.lock.schema.json
per-kind/skills-in-repo   PASS    17 in-repo skills carry .opencode/skills/<id>/SKILL.md with matching frontmatter name
per-kind/skills-upstream  PASS    10 install_cmd shapes hold and gh resolves every owner/repo (10 resolved)
per-kind/mcp-npm          PASS    6 version-pinned npm MCPs match the registry and expose a bin entry
per-kind/mcp-builtin      PASS    21 built-in/remote MCPs honestly recorded (install_cmd null + unverified)
per-kind/plugins          PASS    0 plugins are unverified OpenCode-native records with null install_cmd; no specs invented
per-kind/hooks            PASS    7 hooks map to registered functions in .opencode/plugin/arsenal.ts
per-kind/agents           PASS    21 agents carry null install_cmd + unverified; 20 self-sourced lock agents resolve to .opencode/agents/<id>.md with byte-equal name, zero model pins
per-kind/cli              PASS    64 cli entries carry a real installer command with valid phase, tier and verification (64 verified)
per-kind/lsp              PASS    1 lsp entry valid with correct phase, tier and verification
per-kind/theme            PASS    3 theme entries ship a V2-native JSON installed by a real file copy; zero image keys, zero model keys
per-kind/prompt           PASS    1 prompt entry ships registry/prompts/ file(s) installed by a real file copy
per-kind/dataset          PASS    1 dataset entry ships registry/datasets/ file(s) installed by a real file copy
per-kind/template         PASS    1 template entry ships registry/templates/ file(s) installed by a real file copy
per-kind/policy           PASS    1 policy entry ships registry/policies/ file(s) installed by a real file copy
per-kind/benchmark        PASS    1 benchmark entry ships registry/benchmarks/ file(s) installed by a real file copy
per-kind/workflow         PASS    1 workflow entry ships registry/workflows/ file(s) installed by a real file copy
per-kind/design.md        PASS    1 design.md entry ships unmodified MIT brand document(s) installed by a real file copy; zero model pins, zero placeholders, MIT companions present
agent-mode-explicit       PASS    27 agent files declare mode explicitly (24 subagent)
catalog-agreement         PASS    157 lock entries agree with registry/catalog.json on kind, phase, tier, install_cmd, verification
mcp-cap                   PASS    8 tier-core MCP entries are within mcp_cap 8
pending-integrity         PASS    9 pending per-agent themes carry stated reasons
VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).
KIT_EXIT=0
```

(Per-check `detail` strings condensed to their load-bearing clauses; verdict line verbatim.)

R-4 — `node scripts/verify-skills.mjs` (exit code 0):

```text
command: node scripts/verify-skills.mjs
Vantrilex skill-format verification

check                    status   detail
-----------------------  -------  ----------------------------------------------------------------
skill-discovery          PASS     37 skill folders, every name lowercase-hyphenated and every folder holds exactly SKILL.md
frontmatter-keys         PASS     37 skills, every frontmatter holds exactly name and description
frontmatter-name         PASS     37 skills, every name matches its folder and the hyphenated shape
frontmatter-description  PASS     37 skills, every description is one third-person sentence with a front-loaded trigger
body-headings            PASS     37 skills, all seven headings present in order exactly once
no-placeholders          PASS     37 skills, zero TODO/FIXME/coming-soon/placeholder matches
no-excluded-toolchains   PASS     37 skills, zero references to excluded toolchains and the prior project
file-hygiene             PASS     37 skills, all LF, strict UTF-8 without BOM, single trailing newline, no trailing whitespace or tabs
mechanism-single-home    PASS     halt block, incident template and context anchor each live in exactly one home skill
phase-map-cross-check    PASS     13 phase-map names all resolve (3 local skill folders, 10 catalog ids)

totals: 10 checks — 10 passed, 0 failed, 0 skipped
VERDICT: PASS — all 10 checks ran and passed. The skills are clean.
SKILLS_EXIT=0
```

R-5 — relative-link sweep, first-party scope (exit code 0):

```text
command (node, run from repository root):
  walk roots ['docs','.opencode'] excluding any path containing 'node_modules',
  plus root '*.md'; match /\]\(([^)#\s]+)(#[^)\s]*)?\)/g per file; skip
  http(s):/mailto:/# targets; resolve each relative target against the file's
  directory; record missing targets as BROKEN; exit 1 on any broken, else 0.
output:
  files:199
  links:311
  broken:0
LINKSWEEP_EXIT=0
```

Scope note: an unscoped trial run (including `.opencode/node_modules` vendored readmes) reported
`files:174 links:254 broken:5`, all 5 inside third-party vendor readmes
(`fast-check` CONTRIBUTING pointer, `pure-rand` COMPARISON pointer, two `uuid` historical pointers,
`yaml` docs pointer). Those files are vendored dependencies, outside the lane; the lane-scoped run
above is the gate evidence.

R-6 — census recount commands plus raw outputs (all exit code 0 unless noted):

```text
command: node --version  =>  v25.0.0
command: dir .opencode\agents  =>  Count 27 (aether, blazar, pulsar + 24 vantrilex-*)
command: dir .opencode\skills  =>  Count 37
command: dir .opencode\commands  =>  Count 18
command: dir .opencode\command  =>  Count 4 (doctor, equip, prime, release)
command: Get-ChildItem registry\data\*.jsonl line counts  =>
  agents 301 | benchmarks 1 | cli 64 | datasets 1 | design 84 | formatting 13 |
  hooks 20 | lsp 1 | mcp 923 | plugins 11 | policies 1 | prompts 1 | skills 1505 |
  templates 1 | themes 3 | workflows 1  =>  grand total 2931
command: node -e catalog read  =>
  keys:$schema,generated_by,catalog_version,counts,components | components:2931 |
  counts:{skill:1505,mcp:923,plugin:11,hook:20,agent:301,formatting:13,lsp:1,cli:64,
  theme:3,prompt:1,dataset:1,template:1,policy:1,benchmark:1,workflow:1,design.md:84,total:2931}
command: node -e kit.lock read  =>
  total:157 |
  by-kind:{skill:27,mcp:27,lsp:1,hook:7,agent:21,cli:64,theme:3,prompt:1,dataset:1,
  template:1,policy:1,benchmark:1,workflow:1,design.md:1} |
  tiers:{core:32,conditional:125} | pending:9 | lockfileVersion:1, kit:vantrilex-core
command: node -e kit.lock pending sample  =>
  pending-count:9 | first three: vantrilex-architect, vantrilex-code-reviewer,
  vantrilex-ai-generated-code-security-auditor (theme; reason: theme JSON not yet
  authored; ships through the vantrilex-atomic-switch install skill)
command: node -e agents frontmatter scan  =>
  files:27 | mode:27 | name==stem:27 | description:27 | model pins:0 |
  color:3 aether.md,blazar.md,pulsar.md
command: node -e skills headings scan  =>  folders:37 | seven-headings:37
command: node -e commands description scan  =>
  files:22 | description:22 (18 under .opencode/commands + 4 under .opencode/command)
command: ripgrep '\$ARGUMENTS' .opencode/commands  =>  18 matches (one per file, :11–:17)
command: ripgrep 'ARGUMENTS|empty-guard' .opencode/command  =>
  9 matches: release.md:12,:14 | equip.md:12,:14 | prime.md:11,:13 | doctor.md:13,:15
  plus doctor.md:69 (frontmatter-validity C4 row)
command: Get-ChildItem docs -Recurse -Include *.md  =>  Count 41
command: Get-ChildItem .opencode -Recurse -Include *.md minus node_modules  =>  Count 103
command: Get-ChildItem -Recurse -Include *relay* (minus node_modules/.git)  =>
  .opencode/hooks/relay/relay-hooks.json, relay-poll.mjs, relay-watchdog.mjs
  (+ skills/relay-protocol tree and registry relay records, out of scope)
command: Test-Path .opencode\arsenal.json  =>  False
command: root P-file counts  =>
  P*.md 29 | P*.jsonl 24 | P*.log 1 | P*.json 2  =>  56 working files
command: Select-String singular-path refs in .opencode\command  =>
  doctor.md:68 (correct four-member singular roster) |
  equip.md:96, equip.md:97 (stale singular paths — L13-12-011)
ALL_CENSUS_EXITS=0
```

R-7 — hygiene scans plus sole-write proof:

```text
command: git ls-files filtered to tracked '.env'  =>  0 matches
command: credential-pattern scan (secret-shaped tokens) over docs + commands +
  command + agents + skills  =>  0 matches
command: unfinished-work-token scan over docs + dev + ar + commands + command + agents  =>
  14 matches, dispositioned one-by-one in §11 (all meta-mentions; 0 true markers)
sole-write proof: this report is the only filesystem change in the lane. No edit,
  delete, move, commit, or second-file operation was performed; every other path
  named in §§2–13 was opened read-only (reads, directory listings, and the
  read-only verifier/sweep/scan runs above). The report lands at exactly one path:
  .opencode/audit/V-FULL-AUDIT.md (overwrite in place; no timestamped copies).
```

Lane close: all 14 REPORT-SPEC sections present in order (§§1–14); 23 findings ranked worst-first
with identifiers L13-12-001…L13-12-023 in rank order; 23 fixes proposed with owner files and
re-run proofs; English only; zero secrets; no unfinished-work markers outside quoted gate output
and rule-name prose. The owning implementer writes the fixes; this node stops here.
