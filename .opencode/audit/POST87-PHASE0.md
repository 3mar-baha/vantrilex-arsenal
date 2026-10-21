# POST87-PHASE0 — Phase 0 Reconciliation Report

- Mission lane: `POST87-APPLY` (all other lanes closed or parked; this is mission work)
- Node: `p87-phase0` (wave 2, Phase 0 reconciliation; depends on all seven wave-1 nodes)
- Concern: compose the Phase 0 reconciliation report — per-axis verdicts, findings register,
  owner-question register and dependency-ordered backlog (work order §2.2, §2.3, §3.1)
- Owner: `vantrilex-scribe` (worker-only; measures and lists, decides nothing)
- Classification: **DIRECTED** — Scenario 2 does not apply; the brief fixes the artifact and its
  section set
- Date: 2026-10-21
- Last verified: 2026-10-21 — basis: every cited line re-read from disk at HEAD `93f5b4e` on the
  dirty working tree described in §1.3; gates run and quoted in §6.6
- Blueprint: `docs/spec/post87/BLUEPRINT.md`, sha256
  `07B21147F9B2A0B30569872B57444EF4B6AD0A0A18C75705A32E68DA1839576D`

This document measures. It applies no change, resolves no ambiguity and chooses no side of a
conflict. Where the blueprint is ambiguous or conflicts with the live tree, the item stops and
appears in §4 as an owner question (work order §2.3).

---

## 1. Method and evidence

### 1.1 The seven wave-1 nodes

| Node | Axes reconciled | Landing record | Reported shape |
|---|---|---|---|
| `r1-hooks` | git-hook activation only (pre-gate, no axis) | `AGENT.md:299` | hooks activated, negative control exit 1 |
| `r1-runtime` | A1, A2, A3 | `AGENT.md:300` | PARTIALLY TRUE, PARTIALLY TRUE, CONTRADICTED |
| `r1-lock-catalog` | A4, A5, A7 | `AGENT.md:305` | CONTRADICTED, PARTIALLY TRUE, counts true with one conflict |
| `r1-provisioning-workflow` | A6, A10, A11 | `AGENT.md:302` | ABSENT, ABSENT, ABSENT with shard targets unstarted |
| `r1-color-taxonomy` | A8, A9 | `AGENT.md:303` | ABSENT, blocked by id collision |
| `r1-factory` | A12, A14 | `AGENT.md:304` | CONTRADICTED, all four pairs absent |
| `r1-global-context` | A13, A15, A16 | `AGENT.md:301` | partial/absent, split, all five absent |

All seven reports are on disk in `AGENT.md` as dated entries. This node re-read every cited line
rather than transcribing those summaries; the differences it found are listed in §1.5.

### 1.2 Instruments

| Instrument | Version or path | Used for |
|---|---|---|
| PowerShell | `5.1.26100.9444` | file reads, `Select-String` scans, `Get-FileHash` |
| Node | `v25.0.0` | JSON counts over `registry/catalog.json`, `kit/kit.lock`, sidecars |
| git | `2.55.0.windows.5` | HEAD reads, `git grep`, `git show`, `git status`, commit |
| OpenCode CLI | `v2.0.27` (`opencode --version`, exit 0) | runtime claim and plugin discovery |
| `markdownlint-cli` | `0.49.1` via `npx --no-install` | gate on this report (§6.6) |
| `Get-FileHash` | PowerShell cmdlet | replaces `sha256sum`, which this seat does not carry |

`r1-global-context` disclosed that `rg` was unavailable and used `grep`/`Select-String` instead
(`AGENT.md:301`); this node inherits the same instrument and repeats the disclosure. No count in
this report was transcribed from an older document; every number carries the command that
produced it in §1.6.

### 1.3 Tree-state caveats

- Branch `wt/vta-factory-p0`, HEAD `93f5b4e`, working tree dirty.
- `git status --short` shows 7 deleted agent files and 7 untracked `vantrilex-*` successors:
  `agent-maker`, `ai-generated-code-security-auditor`, `architect`, `code-reviewer`,
  `kit-maintainer`, `red-team`, `technical-writer` deleted; `vantrilex-agent-maker`,
  `vantrilex-architect`, `vantrilex-code-reviewer`, `vantrilex-kit-maintainer`,
  `vantrilex-puller`, `vantrilex-red-team`, `vantrilex-uploader` added.
- `kit/kit.lock` reads 157 components plus 9 pending in the working tree, and 138 components
  plus 9 pending at HEAD. Tier split: working tree 32 core + 125 conditional; HEAD 32 core +
  106 conditional.
- The audit set under `.opencode/audit/` is largely untracked (`V87-*`, `V-FULL-AUDIT.md`
  modified). Counts over "the repository" therefore name their scope explicitly.
- `docs/00-INDEX.md` carries no row for `.opencode/audit/` at all (0 matches for
  `.opencode/audit`, §1.6). Audit artifacts are not indexed documents in this repository; the
  intake at `.opencode/audit/POST87-INTAKE.md` is the precedent.
- `.opencode/kit.lock` begins with a UTF-8 BOM. All JSON reads below strip it before parsing;
  `verify-kit` accepts the file unchanged.

### 1.4 Evidence-base verification

`Get-FileHash docs\spec\post87\BLUEPRINT.md -Algorithm SHA256` returns
`07B21147F9B2A0B30569872B57444EF4B6AD0A0A18C75705A32E68DA1839576D`, matching the brief and the
filing record at `AGENT.md:298`. The file is 123,461 bytes and 290 lines.

The intake structure map `.opencode/audit/POST87-INTAKE.md` is 52,284 bytes; its §8 carries the
18 open items `O-1`…`O-18` at `:496`–`:513`, reproduced as questions in §4.

### 1.5 Reconciliation notes — where this re-read differs from the node summaries

Recorded so the difference is visible rather than smoothed over. Each correction is used
throughout the report.

| # | Recorded in the brief or node report | Re-read result | Resolution |
|---|---|---|---|
| N-a | lock referenced by "75 files / 372 refs" (`AGENT.md:305`) | 98 files / 424 matching lines across all working-tree text surfaces; 65 files / 183 lines excluding `.opencode/audit`, `docs/99-archive`, `docs/spec` | the figure is scope-dependent and not reproducible under either scope; the finding (lock is first-class and gate-critical) stands on the gate run and the code citations, and this report quotes its own count |
| N-b | "26 singular refs live" (brief) and "8 live singular refs" (`AGENT.md:301`) | 9 occurrences of `.opencode/agent/` in 5 files; 21 occurrences of `.opencode/command/` (singular root) | both figures are used as upper-bound context only; §3 M-18 quotes the measured 9 + 21 |
| N-c | "BLUEPRINT:257 vanguard census 36/52" (brief) | `BLUEPRINT.md:257` is a reference-list line; the 36/52 census is `vantrilex-vanguard/SKILL.md:257-258` | finding cites `SKILL.md:257-258` |
| N-d | "BLUEPRINT:87 no `.env.example`" (brief) | `BLUEPRINT.md:87` names "متغيرات البيئة" only; the `.env.example` requirement is at `BLUEPRINT.md:91` | finding cites `:87` and `:91` |
| N-e | "BLUEPRINT:86 no Playwright/SPEC.md" (brief) | Playwright is at `:86`; `SPEC.md` is at `:91` | finding cites both lines |
| N-f | "kit.lock first-class: 21 surface groups" (node) | the surface groups are real but were not enumerated in the node record; this report names the five it re-verified (`verify-kit`, `orchestrate-stage.sh`, `ci.yml`, `install-profiles.json`, schema `$comment`) | the node's remaining groups are recorded but not re-enumerated here, and no group is claimed without a citation |
| N-g | "9 pending themes carry `verification: pending`" (brief paraphrase) | the lock's `verification` enum has no `pending` value; the 9 live in the `pending[]` array | finding M-11 cites the field correctly |

### 1.6 Commands and exits (representative; every count in this report comes from one of these)

| Command | Exit | Result used |
|---|---|---|
| `opencode --version` | 0 | `opencode v2.0.27` |
| `opencode plugin list` | 0 | both `vantrilex-arsenal` and `vantrilex-guards` load |
| `node scripts/verify-kit.mjs` | 0 | 22 passed, 0 skipped, 0 failed; "157 components and 9 pending entries" |
| `node scripts/verify-skills.mjs` | 0 | 10 passed, 0 failed, 0 skipped; 37 skill folders |
| `(Get-ChildItem .opencode\agents -Filter *.md -File).Count` | 0 | 27 |
| `(Select-String -Path .opencode\agents\*.md -Pattern '^model:' -AllMatches).Count` | 0 | 0 |
| `(Select-String -Path .opencode\agents\*.md -Pattern '^color:').Count` | 0 | 3 |
| `(Select-String -Path .opencode\agents\*.md -Pattern '^category:').Count` | 0 | 0 |
| `node -e "…registry/catalog.json…"` | 0 | 2,931 components; 82 verified / 2,849 unverified; 0 pending; 1,690 null `install_cmd`; 16 kinds |
| `node -e "…registry/data/*.jsonl…"` | 0 | skills 1,505 (10 verified); mcp 923 (8); agents 301 (0); design.md 84 (0) |
| `git grep -- "kit\.lock"` | 0 | 83 files / 353 lines (tracked working tree); full text scan 98 / 424 |
| `git grep -- "kit\.lock" HEAD` | 0 | 84 files / 225 lines at HEAD |
| `Test-Path .opencode\agents\vantrilex.md` | 0 | `False` |
| `Test-Path .opencode\equip.manifest.json` | 0 | `False` |
| `Test-Path .opencode\crucible\quarantine` | 0 | `False` |
| `(Select-String -Path registry\data\overlaps.yaml -Pattern 'covers_gap').Count` | 0 | 0 |
| `(Select-String -Path .opencode\skills\red-team\SKILL.md -Pattern '\.opencode/agent/').Count` | 0 | 2 (`:15`, `:64`) |
| `(Get-Content .opencode\skills\vantrilex-vanguard\SKILL.md).Count` | 0 | 814 |
| `(Get-Content .opencode\skills\vantrilex-doctrine\SKILL.md).Count` | 0 | 782 |
| `Get-FileHash` on the two vanguard files | 0 | `1524EB4D…` and `CEC8E601…` (not byte-identical) |
| `(Select-String -Path .opencode\audit\V-FULL-AUDIT.md -Pattern '\bC-0[1-9]\b').Count` | 0 | 0 |
| `core.hooksPath` via `git config` | 0 | `.githooks` |

---

## 2. Per-axis reconciliation (16 axes)

Verdict tokens are the four in the brief. Where the brief used a qualifier ("conflicts",
"blocked by id collision", "split"), the qualifier is carried after the token in the same cell;
exactly one token appears per row.

| Axis | Blueprint anchors | Verdict | Key evidence (file:line) | Blocking Q-ids |
|---|---|---|---|---|
| A1 runtime truth | `:11`, `:16`, `:24`, `:229` | **PARTIALLY TRUE** — platform claims contradicted | `arsenal.ts:13-19`, `:2173`, `:2328-2335`; `docs/17:3-4`; `BLUEPRINT.md:16`; probe 0 code hits | Q-33, Q-12 |
| A2 harness ق-6/ق-7 | `:24`, `:25`, `:229` | **PARTIALLY TRUE** — dual registration persists | `vantrilex-guards.ts:76-78`, `:107-112`, `:128-129`; `opencode plugin list`; `dsh` 2 hits, both narrative | Q-12, Q-33 |
| A3 model law ق-1 | `:23`, `:66`, `:184`, `:224` | **CONTRADICTED** | `WORKFLOW.md:100-101`; `AGENT.md:226`; 27 files with 0 `model:` keys; no `vantrilex.md`; three `mode: primary` | Q-32, Q-08 |
| A4 lock abolition | `:33-38`, `:225`, `:238` | **CONTRADICTED** | `BLUEPRINT.md:35`; `verify-kit.mjs:5-6`, `:22`; `orchestrate-stage.sh:288-290`; `ci.yml:70-78`; `catalog-v3:4` item 4 | Q-17, Q-23, Q-27 |
| A5 catalog sole source | `:36`, `:128`, `:238` | **PARTIALLY TRUE** | 0 pending / 82 verified / 2,849 unverified; `generate-catalog-json.mjs:11`, `:468`; `AGENTS.md:32-33`; `equip.manifest.json` absent; `catalog-v3:6`, `:89`, `:96-106` | Q-24, Q-25, Q-26 |
| A6 provisioning | `:42-53`, `:206` | **ABSENT** | `SKILL.md:250-260` (five-step, 36/52); Goldilocks terms 0; `overlaps.yaml` `covers_gap` 0; third gate missing at `BLUEPRINT.md:42` | Q-03, Q-11, Q-20, Q-21, Q-01 |
| A7 inventory | `:99`, `:132`, `:149`, `:172` | **PARTIALLY TRUE** — inventory conflicts | 27 / 24 subagent / 37 / 18+4 / 9 pending true; 24+4=28 vs live 27; doubled ids 3 not 6 | Q-08, Q-16 |
| A8 color taxonomy | `:136-152` | **ABSENT** | 27 agents, 3 `color:`, 0 `category:`; `supreme-orchestrator` 0; live categories `code, design, external, kit, research, reserved`; `mcp-specialist` 0; brand hexes 4/6 unresolvable | Q-02, Q-28, Q-30, Q-31 |
| A9 C-01..07 | `:170-176` | **CONTRADICTED** — blocked by id collision | `BLUEPRINT.md:170-176` vs `V87-COMPAT-FINDINGS.md:269-277`, `V87-DEFECTS.md:48-56`; 7/7 differ; `V-FULL-AUDIT.md` C-ids 0 | Q-29 |
| A10 tiers and commit law | `:191-200` | **ABSENT** | `WORKFLOW.md` tiers 0; `workflow-forge/SKILL.md` tiers 0; `arsenal.ts:2328-2335` three calls; `AGENTS.md:130`, `WORKFLOW.md:105` vs `BLUEPRINT.md:200` | Q-19, Q-14 |
| A11 golden standard | `:204-207` | **ABSENT** | vanguard 814 → 380; twin 814, different sha; doctrine 782 → 410; `coverage-matrix.md` and `constitutional-annex.md` absent; `verify-skills.mjs:360-373`; `doctrine:86` passes | Q-15, Q-22 |
| A12 factory and Crucible | `:116-128` | **CONTRADICTED** | `BLUEPRINT.md:127` opens mid-sentence; no `Catalog Assimilator`; `crucible/*` absent; gate 1 contract differs; `P2-SCAN-FIRST.md` archive-only | Q-04 |
| A13 global install scope | `:95-110` | **ABSENT** | no `resolveGlobalOpenCodeDir`; theme-only home/XDG (`docs/18:13-15`, `:82`); no global loader; kill-switch signals 0 code hits; only `VANTRILEX_STATE_DIR` at `arsenal.ts:784` | Q-10, Q-18 |
| A14 new pairs | `:80-91` | **ABSENT** | all 8 names absent on agent, skill, `agents.jsonl` and lock surfaces; blockers: `mcp.jsonl:85`, no `SPEC.md`, no `.env.example`, preCompact premise | Q-16, Q-13, Q-06 |
| A15 path pluralization | `:172` | **PARTIALLY TRUE** — path split | commands 18 + 4, canonical declared `V-DOCTOR.md:24`; `plugin/` and `plugins/` both discovered; 9 singular agent refs; 21 singular command refs | none — fixable without a ruling |
| A16 context and state | `:85`, `:90`, `:198`, `:213`, `:216` | **ABSENT** | offload threshold 0; `<2,500` cap 0; `<200`-word capsule 0; HNSW 0 in code; spawn threshold 0; `preCompact` premise V1-only | Q-06, Q-13 |

Axis count: 0 ALREADY TRUE, 5 PARTIALLY TRUE, 7 ABSENT, 4 CONTRADICTED (§6.1).

---

## 3. Findings register

Every entry was re-read from disk. Severity is the W1 node's label unless the entry says
"severity assigned here", in which case the reason is stated. Duplicates are merged with both
citations and named in the merge note at §3.4.

### 3.1 CRITICAL

**C1 — F-COLOR id space is a private renumbering** · Axis A8, A9
Evidence: `BLUEPRINT.md:145-152` versus `V87-COLOR-FINDINGS.md:319-326` and
`V87-DEFECTS.md:66-78`.
Blueprint `:147` — "البادئة المزدوجة vantrilex-vantrilex-* في 6 صفوف داخل
vantrilex-atomic-switch.json لا تطابق أي ملف في .opencode/agents/ (red-team, a11y-audit,
typescript, python, fixer, github)".
Canonical `V87-COLOR-FINDINGS.md:321` — "F-COLOR-03 | Registry `category` is a 5-value
taxonomy with hexes that do not match the palette".
Only `F-COLOR-06` agrees in meaning across both registers (`BLUEPRINT.md:150` versus
`V87-COLOR-FINDINGS.md:324`). The other seven labels denote different defects under the same
identifiers. A builder told to "close F-COLOR-04" would close the wrong defect.

**C2 — C id space is a private renumbering** · Axis A9
Evidence: `BLUEPRINT.md:170-176` versus `V87-COMPAT-FINDINGS.md:269-277` and
`V87-DEFECTS.md:48-56`.
Blueprint `:170` — "C-01 | AGENT.md:106 وvantrilex-doctrine: يفرضان أن يحتفظ كل وكيل بلونه
الخاص من اللوحة".
Canonical `V87-COMPAT-FINDINGS.md:269` — "C-01 | MEDIUM | No named agent can load any `vs-*`
skill by allow-list".
All 7 blueprint C-ids differ from all 7 canonical C-ids. The work order's premise that the
canonical register lives at `V-FULL-AUDIT.md` §12 is false: that file holds 0 matches for
`C-0[1-9]` (§1.6).

### 3.2 HIGH

**H-01 — The blueprint's "session.prompt (Throw)" claim is false on V2** · A1
`BLUEPRINT.md:16` — "صلبة برمجياً داخل العملية عبر session.prompt (Throw) وPreToolUse
وPreCompact".
Live: `arsenal.ts:2173` — "draft.text = `${userText}\n\n${instruction}`". The prompt hook
rewrites the draft and returns; there is no throw path. `vantrilex-guards.ts:122-126` states
"the session prompt hook exposes no typed rejection API for prompt admission … the turn always
proceeds". The blueprint builds a blocking-teeth comparison row on a capability that does not
exist.

**H-02 — Model names are standing law in two live documents** · A3
`WORKFLOW.md:100` — "Model routing (owner law 2026-10-18): side agents/workers dispatch on
DeepSeek V4.1 FLASH (explicit dispatch parameter `opencode-go/deepseek-v4.1-flash`); leaders
(Blazar/Aether/Pulsar seats) remain on Muse Spark 1.3 Contributor; zero `model:` file pins."
`AGENT.md:226` — "(2) MODEL LAW: side agents/workers → DeepSeek V4.1 FLASH … leaders unchanged
(Muse Spark 1.3 Contributor)."
ق-1 (`BLUEPRINT.md:23`) requires that no model is fixed for leaders or subagents as system law
and that every phase begins with a free/paid choice. The file-pin half is true (0 keys across
27 agent files); the standing-law half contradicts the decision.

**H-03 — The Zenith entry point does not exist and the three leaders are primaries** · A3
`BLUEPRINT.md:63` names "`.opencode/agents/vantrilex.md` — `mode: primary`"; `:64` requires the
leaders to be "`mode: subagent`".
Live: `Test-Path .opencode\agents\vantrilex.md` → `False`; `aether.md:4`, `blazar.md:4`,
`pulsar.md:4` are all `mode: primary`; 24 files are `mode: subagent`. The top layer the whole
model law hangs on is absent.

**H-04 — Hook Capability Probe absent** · A1, A2
`BLUEPRINT.md:11` — "يُبنى فاحص توافر حي (Hook Capability Probe) مع بوابة بديلة حتمية عند أول
استدعاء أداة".
Search for `Hook Capability Probe` / `hookCapabilityProbe` across `*.ts`, `*.mjs`, `*.json`,
`*.md`: 5 hits, all prose (`BLUEPRINT.md:11`, `BLUEPRINT.md:245`, `POST87-INTAKE.md:250`,
`POST87-INTAKE.md:256`, `AGENT.md:300`). Zero code. The six-hook availability question is
therefore unmeasured, not merely unimplemented.

**H-05 — Dual plugin registration persists** · A2
`vantrilex-guards.ts:76-78` — "V2 discovers local plugins from both `.opencode/plugin/` and
`.opencode/plugins/`, so a host that loads arsenal.ts and this carrier registers the same five
hooks twice, in plugin order."
`opencode plugin list` returns two rows on the live host: `vantrilex-arsenal` and
`vantrilex-guards`. The merge ق-6 requires (`BLUEPRINT.md:24`) has not happened; the carrier
still imports and delegates (`:107-112`, `:128-129`).

**H-06 — The context offloader is bound to a hook that is inert on V2** · A16, A12
`BLUEPRINT.md:90` — "يرتبط هذا الوكيل بخطاف preCompact وبعداد التوكنز في arsenal.ts عند عتبة
28,000 توكن"; `:85` pairs the same agent with the "حدث preCompact".
Live: `docs/17:3-4` — "Seven callbacks in `.opencode/plugin/arsenal.ts` still run on OpenCode V1
and are inert on OpenCode V2."; `arsenal.ts:35` — the three session-lifecycle callbacks "are
INERT under V2." The offload as designed would never fire on the live runtime. Merged: the
`BLUEPRINT.md:85` pair premise and the `BLUEPRINT.md:90` binding are one defect.

**H-07 — `red-team/SKILL.md` dispatches a role path that does not exist** · A15
`.opencode/skills/red-team/SKILL.md:15` — "`.opencode/agent/red-team.md` is the adversarial
**role**"; `:64` — "**Dispatch the red-team subagent** (`.opencode/agent/red-team.md`)."
Neither `.opencode/agent/` nor `.opencode/agents/red-team.md` exists; the live role is
`.opencode/agents/vantrilex-red-team.md`. The skill's procedure stops at step 5.

**H-08 — The vanguard skill's kit census is wrong by 105 components** · A6
`.opencode/skills/vantrilex-vanguard/SKILL.md:257-258` — "Tier 0 is pre-approved for every
project: it is the thirty-six core components of the fifty-two locked in `kit/kit.lock`, with an
empty pending list."
Live `verify-kit`: "157 components and 9 pending entries"; tiers 32 core + 125 conditional. Any
selection run from this text under-selects by 105 and believes the pending list is empty.

**H-09 — The Goldilocks provisioning algorithm does not exist in the skill it is assigned to** · A6
`BLUEPRINT.md:42` assigns "خوارزمية حتمية من ثلاث بوابات متتالية" to `vantrilex-vanguard`.
Live `SKILL.md:252` — "Run the five-step algorithm without reordering it." Occurrences in that
file: `L_min` 0, `U_max` 0, `Stage_Floor` 0, `Stage_Ceiling` 0, `D_proj` 0,
`coverage-matrix` 0, `Zero-Starvation` 0, `starv` 0, `48` 0. The limits table at
`BLUEPRINT.md:45-51` has no implementation anywhere in the tree.

**H-10 — The commit law contradicts standing repository law** · A10
`BLUEPRINT.md:200` requires "Commit-per-Improvement & Pre-Refactor Snapshot Law" enforced inside
`arsenal.ts` and `WORKFLOW.md`.
`AGENTS.md:130` — "**No commit, no push.** This lane makes no commit and pushes nothing.";
`WORKFLOW.md:105` — "no commits/pushes/tags." The mission commits under the new order
(`c7c762c` and `93f5b4e` are the two most recent commits, §1.3), so the on-disk law and the
executed practice disagree.

**H-11 — No Diff Size Guard in `tool.execute.before`** · A10
`BLUEPRINT.md:200` — "إذا تجاوزت التعديلات غير المثبتة في شجرة العمل عتبة 120 سطراً أو 4 ملفات
دون إجراء commit ذري".
Live `arsenal.ts:2328-2335` runs exactly three calls: `recordTouchedFiles`,
`longRunningProcessGuard`, `docsDisciplineGuard`. Occurrences of `Diff Size` 0, `120 lines` 0,
`pre-refactor` 0, `Commit-per-Improvement` 0 in `*.ts`/`*.mjs`/`*.sh`.

**H-12 — `covers_gap` has no data, so Gate 2 can never admit a pair** · A6
`BLUEPRINT.md:53` — "`pairs_with(c_i, c_j) AND covers_gap(c_j, D_proj) ==\> Include_Pair`".
`registry/data/overlaps.yaml` holds `supersedes` and `pairs_with` groups only; `covers_gap`
occurs 0 times. The second predicate has no field to read.

**H-13 — `verify-skills` cannot certify the seven-heading shape** · A11
`scripts/verify-skills.mjs:360-373` checks that each required heading appears exactly once and in
order; it never rejects an additional `##`. `docs/17`-style extra headings pass, and
`vantrilex-doctrine/SKILL.md:86` ("## Parallel execution first", the 5th H2) is accepted by the
green run (10/10, exit 0). The blueprint's "seven exact H2" claim (`BLUEPRINT.md:122`, `:204`)
is not enforced by the tool it names.

**H-14 — Brand-color provenance is invented for four of six platforms** · A8
`BLUEPRINT.md:137` asserts, as "ألوان شعارات منصاتهم الرسمية الموثقة في ملفات
registry/design/<brand>/DESIGN.md", the hexes `#24292F` (GitHub), `#635BFF` (Stripe),
`#F38020` (Cloudflare), `#F24E1E` (Figma).
Live: `registry/design/github/` and `registry/design/cloudflare/` do not exist; `#24292F`,
`#635BFF`, `#F38020`, `#F24E1E` each occur 0 times under `registry/design/`; `#3ECF8E` occurs 4
times (Supabase) and `#FFFFFF` is generic (393 occurrences). Two of six are sourcable as
claimed, not six.

**H-15 — Zenith and its category do not exist** · A8
`BLUEPRINT.md:136` — "فئة قيادة الجلسة الأساسية لـ **Zenith (الزيث — supreme-orchestrator)**".
Live: `supreme-orchestrator` 1 hit, in `AGENT.md:303` (the audit record itself); no agent file,
no catalog row, no theme row. The rank name appears only as narrative in
`aether.md:222`, `blazar.md:576`, `pulsar.md:275`.

**H-16 — F-COLOR-03 names six doubled ids that do not exist** · A8
`BLUEPRINT.md:147` names "red-team, a11y-audit, typescript, python, fixer, github".
Live doubled ids in `registry/themes/vantrilex-atomic-switch.json:1`: exactly 3 —
`vantrilex-vantrilex-guide`, `vantrilex-vantrilex-implementer`,
`vantrilex-vantrilex-leader`. The six named ids are single-prefixed and correct already.

**H-17 — C-01 cites the wrong AGENT.md line** · A9
`BLUEPRINT.md:170` — "AGENT.md:106 وvantrilex-doctrine". The color law is `AGENT.md:102` —
"every agent keeps its OWN theme, COLOR from palette by tag". `AGENT.md:106` is a 2026-10-16
lane-history entry with no color law in it.

**H-18 — C-03 cites a path that is already plural** · A9, A15
`BLUEPRINT.md:172` — ".opencode/command/equip.md:96 و.opencode/skills/red-team/SKILL.md: يشيران
للمسار المفرد".
`equip.md:96` reads "agents under `.opencode/agents/`" — already plural. The real offenders are
`red-team/SKILL.md:15`, `:64`, `doctrine:251`, `:259`, `:268`, `prime:132`,
`docs/10-ROLE-MODEL.md:5-7`. The citation is half-stale, which is why the axis reads as a split
rather than a single defect.

**H-19 — C-07 miscounts the doctrine's extra heading** · A9, A11
`BLUEPRINT.md:176` — "vantrilex-doctrine/SKILL.md (782 سطراً، وعنوان H2 ثامن في :86".
Live H2 ordinals in that file: 1 `:8`, 2 `:24`, 3 `:38`, 4 `:74`, 5 `:86`, 6 `:187`, 7 `:537`,
8 `:674`, 9 `:742`. Heading `:86` is the 5th, not the 8th; there are two extras (`:86` and
`:537`), not one.

**H-20 — The scan authority cited by triage exists only in the archive** · A12
`.opencode/skills/vantrilex-intake-triage/SKILL.md:48` — "The `P2-SCAN-FIRST.md` procedure as the
governing scan authority."
The only file by that name is `docs/99-archive/P2-SCAN-FIRST.md`. 13 live files cite it without a
path (`vantrilex-puller.md:122`, `vantrilex-uploader.md:73`, `:104`, `:119`,
`intake-fetch/SKILL.md:32`, `intake-send/SKILL.md:32`, `intake-triage/SKILL.md:48`, `:64`, `:79`,
`:96`, `vs-smithery/SKILL.md:34`, `:52`, `:74`). The governing procedure is not at a resolvable
live path.

**H-21 — Gate 1's contract differs from the live verifier, and the 500-line cap is unenforced** · A12, A11
`BLUEPRINT.md:122` requires the seven headings to end in "Verification" and a "سقف 500 سطر
إرشادي".
`scripts/verify-skills.mjs:38-46` defines `REQUIRED_HEADINGS` ending in `'Failure Modes'`; the
file contains no line-count check, so the 814-line vanguard passes. A component polished to the
blueprint's contract would fail the live gate, and one polished to the live gate would fail the
blueprint.

**H-22 — `kit/kit.lock` is first-class and gate-critical, not abolished** · A4
`BLUEPRINT.md:35` — "فلا وجود لـ kit.lock ولا core lock".
Live: `verify-kit.mjs:5-6` — "Proves the pinned Tier-0 kit (kit/kit.lock) against its schema";
`:22` `LOCK_PATH`; `orchestrate-stage.sh:288-290` exits 1 when the lock is missing; `ci.yml:70-78`
runs the kit gate; `kit/kit.lock.schema.json:4` item 4 makes a new kind require "one kit/kit.lock
component"; `manifests/install-profiles.json` declares `"generated_from":"kit/kit.lock"`. The
lock is the input to injection, not a removable artifact.

**H-23 — The catalog is not 100% verified** · A5
`BLUEPRINT.md:36` — "verification: "verified" حصراً — لا عناصر unverified ولا pending".
Live `registry/catalog.json`: 2,849 `unverified`, 82 `verified`, 0 `pending`; skills 1,495
unverified / 10 verified; mcp 915 / 8; agents 301 / 0; design.md 84 / 0; hooks 20 / 0.

**H-24 — Stage three of the Crucible has no text** · A12
`BLUEPRINT.md:125` heads the section "المرحلة الثالثة والرابعة"; `:127` opens with a dangling
clause — "وسجل التباين السلوكي L لبوابة الصقل الذاتية وتقرير Ponytail)، وينقل الحزمة…" — and
jumps straight to the upload. No stage-three content exists between them.

**H-25 — The catalog's generator input is the Markdown catalog, not the sidecars** · A5
`scripts/generate-catalog-json.mjs:11` — `const CATALOG_MD = join(ROOT, 'registry',
'VANTRILEX_CATALOG.md')`; `:468` — "id "${entry.id}" does not match any ${kind} row in
registry/VANTRILEX_CATALOG.md"; `AGENTS.md:32-33` — "`registry/VANTRILEX_CATALOG.md` is the
source of truth. Edit the generator or the JSONL sidecars, never the generated table by hand."
`BLUEPRINT.md:36` names `registry/catalog.json` plus the sidecars as the sole source;
`catalog.json` is the mirror.

**H-26 — Zero-unverified is structurally incompatible with catalog v3** · A5
`registry/schema/catalog-v3.schema.json:89` — "Any record with a null install_cmd MUST be
'unverified'."; `:96-106` enforces it via `allOf`. `registry/catalog.json` holds 1,690 records
with a null `install_cmd`. Reaching 100% verified therefore requires inventing 1,690 install
commands or publishing a new schema, which the schema itself forbids in place (`:4`).

**H-27 — `.opencode/equip.manifest.json` is asserted, not filed** · A5
`BLUEPRINT.md:37` treats the manifest as the project selection record. `Test-Path
.opencode\equip.manifest.json` → `False`; no loader reads it.

**H-28 — `WORKFLOW.md` declares the lock abolished while the mission depends on it** · A4
`WORKFLOW.md:71` — "kit.lock abolished". The same working tree passes `verify-kit` only because
the lock exists (`157 components and 9 pending entries`), and `orchestrate-stage.sh:288-290`
refuses to run without it. The state file asserts the opposite of the gate.

**H-29 — The new-kind protocol conflicts with the lock-free claim** · A5, A4
`registry/schema/catalog-v3.schema.json:4` — "extended by publishing a NEW schema version file,
never by editing a published version in place."
`BLUEPRINT.md:128` requires four atomic steps "بدون أي ملف قفل" that include adding the new kind
to the `kind` enum and `$defs` of `catalog-v3.schema.json` — an in-place edit of a published
schema, plus a lock component per the schema's own step 4.

**H-30 — The Catalog Assimilator does not exist and stage four rests on false premises** · A12
`BLUEPRINT.md:128` — "تشغّل محرك الاستيعاب (Catalog Assimilator)".
Search: `Catalog Assimilator` 0, `catalogAssimilator` 0. The stage also presumes a live catalog
that is 100% verified (H-23) and a lock-free tree (H-22); both premises are false, so the stage
cannot be built as written.

**H-31 — Crucible gates 2, 3 and 4 have no implementation** · A12
`BLUEPRINT.md:123` requires a ponytail-review filter, "آليتنا الذاتية الخاصة للصقل التبايني" with
`.opencode/crucible/EXPERIENCE.md`, and Zod/TypeScript verification schemas.
Live: no `ponytail-review` skill folder (`ponytail` and `vs-ponytail` only); `EXPERIENCE.md` 0
hits; no `.opencode/crucible/` directory; `zod` appears only as a transitive dependency in
`.opencode/package-lock.json:110`, with no schema code.

**H-32 — The per-project kill switch is absent** · A13 (severity assigned here: م-4 is stated
law and the gate has no implementation)
`BLUEPRINT.md:109` names four signals: `"vantrilex": { "enabled": false }`,
`.opencode/.vantrilex-disable`, `VANTRILEX_DISABLED=1`, `excludedProjects`.
Code search across `*.ts`, `*.mjs`, `*.sh`: each signal 0 hits. The only environment read in the
plugin is `VANTRILEX_STATE_DIR` at `arsenal.ts:784`.

### 3.3 MEDIUM

**M-01 — README census is stale** · A7
`README.md:252` — "`kit/kit.lock` pins **112 components with an empty `pending` list**: 31 tier
`core` and 81 tier `conditional`."; `:257` — "By verification: **80 `verified`** and **32
`unverified`**"; `:349` — "The pinned 112-component kit".
Live: 157 components (32 core + 125 conditional) and 9 pending.

**M-02 — Five install-profile module ids resolve to nothing** · A7
`manifests/install-profiles.json` module ids not present in the lock: `architect`, `code-reviewer`,
`ai-generated-code-security-auditor`, `technical-writer`, `a11y-audit` (5). The file's own note
claims "Every module id below is a live kit/kit.lock component id".

**M-03 — The reuse-before-generate name collides with an MCP row** · A14
`registry/data/mcp.jsonl:85` — `{"id":"aradar46-reuse-before-generate",…}`. The proposed skill id
`reuse-before-generate` would sit beside an existing MCP id on the same slug, and the catalog's
id resolution rule already needs `slug-row-N` for one such collision.

**M-04 — `vantrilex-journey-verifier` has no SPEC.md and no Playwright** · A14
`BLUEPRINT.md:91` requires the verifier to read "وثيقة المتطلبات SPEC.md". `Get-ChildItem
-Recurse -Filter 'SPEC.md'` → 0 files. `.opencode/package.json` declares only
`@opencode-ai/plugin`; Playwright is not installed and `node_modules/playwright` is absent.

**M-05 — `vantrilex-prod-parity` has no `.env.example` surface** · A14
`BLUEPRINT.md:91` requires "ملف .env.example". `Get-ChildItem -Recurse -Filter '.env.example'` →
0 files; `BLUEPRINT.md:87` itself names only "متغيرات البيئة".

**M-06 — The new-pair arithmetic reaches 31, not 28** · A7
`BLUEPRINT.md:80` adds "4 وكلاء جانبين جدد" to `.opencode/agents/`; `:149` says "24 ملفاً + الـ 4
الجدد". Live 27 + 4 = 31, while 24 + 4 = 28. The blueprint's own count is internally split.

**M-07 — The third provisioning gate is announced and missing** · A6
`BLUEPRINT.md:42` — "خوارزمية حتمية من ثلاث بوابات متتالية"; only "البوابة الأولى" (`:52`) and
"البوابة الثانية" (`:53`) follow. No third gate text exists (O-3).

**M-08 — The developer roster names six deleted agents** · A7
`docs/dev/07*.md:62-67` lists `architect`, `code-reviewer`,
`ai-generated-code-security-auditor`, `technical-writer`, `red-team`, `kit-maintainer`; all six
files are deleted from `.opencode/agents/` (see `git status`), replaced by `vantrilex-*`
successors.

**M-09 — The offload trigger is stated three ways** · A16
`BLUEPRINT.md:85` — "28k–30k توكن"; `:90` — "28,000 توكن"; `:198` — "28k توكن". Whether 28,000
is the trigger and 30,000 the ceiling is not stated (O-13).

**M-10 — The global-scope row leaves its component cell empty** · A13
`BLUEPRINT.md:103` — the `--global` row's third cell is empty, while `:99` says "27 وكيلاً والـ
37 مهارة" live there. The table cannot answer what the global layer holds (O-10).

**M-11 — F-COLOR-04 names the wrong field** · A8
`BLUEPRINT.md:148` — "بقاء 9 سمات معلقة (verification: "pending") في kit/kit.lock".
`kit/kit.lock` has no `verification: "pending"` value; its 9 pending entries live in the
`pending[]` array, and the schema enum is `["verified","unverified"]` (`catalog-v3:88`).

**M-12 — The taxonomy citation points at line 117 of a one-line file** · A8
`BLUEPRINT.md:136` cites `registry/themes/vantrilex-atomic-switch.json:117`;
`(Get-Content …).Count` → 1. The citation cannot be followed.

**M-13 — ق-3 has no governing-decision entry** · A8
`BLUEPRINT.md:21` enumerates "ق-1، ق-4، ق-5، ق-6، ق-7"; ق-3 appears only at `:137` and `:226`.
Its authority is a paragraph, not a decision block (O-2).

**M-14 — The whole context/state machinery is absent** · A16
`BLUEPRINT.md:213` (<200-word capsule), `:216` (HNSW at N ≥ 1,000), `:218` (spawn floor).
Live: offload threshold 0, `<2,500` cap 0, 200-word capsule 0, HNSW 0 in code, `N_nodes` 0,
spawn threshold 0.

**M-15 — Global path resolution, global loader and overlay are absent** · A13
No `resolveGlobalOpenCodeDir` implementation (1 hit, `AGENT.md:301`, the audit record). Home/XDG
appears only for themes (`docs/18:13-15`, `:82`). All 27 agents and 37 skills load project-scope.
Overlay precedence exists only for native themes.

**M-16 — The quarantine path does not exist and triage uses different vocabulary** · A12
`BLUEPRINT.md:118` — ".opencode/crucible/quarantine/<intake-id>/". `Test-Path
.opencode\crucible` → `False`. Triage routes by its own verdict vocabulary and the send skill
writes "intake staging or admit-ready staging" (`intake-send/SKILL.md:18-19`), not
`crucible/staging/<batch-id>` (`BLUEPRINT.md:127`).

**M-17 — Gate 2 is flat pair application, not DAG pruning** · A6
`SKILL.md:291-296` — "Apply `supersedes` and `pairs_with` … as hard constraints … Members of a
`pairs_with` group travel together when both apply." There is no DAG, no `covers_gap`, no
project-dimension argument.

**M-18 — Singular-path references survive outside red-team** · A15
9 occurrences of `.opencode/agent/` in 5 live files: `red-team/SKILL.md:15`, `:64`,
`doctrine:251`, `:259`, `:268`, `prime:132`, `docs/10-ROLE-MODEL.md:5`, `:6`, `:7`. Separately
21 occurrences of the singular `.opencode/command/` root remain, declared non-canonical by
`V-DOCTOR.md:24`.

**M-19 — The vanguard twins are equal in size but not byte-identical** · A11
`BLUEPRINT.md:162` calls them "توأمه المطابق". Both are 814 lines;
`Get-FileHash` gives `1524EB4D5BEE93B50E843042F9D4E34D8E260A8C07D8D91268952B2485CCC8C0` and
`CEC8E60156A58E36D448A0FC5021ED1CD0F15D3ABD713035EE07109CBE9D7FBB`. The merge/delete order in
O-15 therefore matters more than "delete the twin" implies.

**M-20 — `dsh` exists only in narrative documents** · A2
`dsh` appears twice outside the blueprint and intake: `AGENT.md:298` and `AGENT.md:300`, both
audit records. No runtime artifact, adapter or configuration mentions it.

### 3.4 LOW

**L-01 — The uppercase color rule conflicts with the live lowercase values** · A8
`BLUEPRINT.md:145` requires "صيغة الأحرف الكبيرة الصارمة ^\#\[0-9A-F\]{6}\$" and would rewrite
`#14b8a6` to `#14B8A6`; the live registry is mixed — the aether row carries lowercase
`#14b8a6` while the other eleven `accentHex` rows and the three agent files carry uppercase. A
schema pattern fixed to uppercase would reject the registry as it stands today unless the aether
row is migrated in the same change.

### 3.5 Merge notes

- The second `F-COLOR-03` row in the brief (double-prefix, listed twice) is H-16 only.
- The brief's `BLUEPRINT.md:85` "preCompact pair premise" and `:90` "offloader bound to
  preCompact" are one defect, H-06, with both anchors.
- `M-09` (C-03 half-stale) in the brief is H-18; kept once with both the wrong citation and the
  real offenders.
- "six-hook probe absent" appears in both A1 and A2; it is H-04, cited on both axes.

---

## 4. Owner-question register

The work order is not a repository file; its § references are to the dispatch brief, and its
on-disk summary is `WORKFLOW.md:71`. Every row below stops rather than guesses (work order §2.3).
No row is answered here.

| Q | Question | Why it blocks | Axes | Work-order section |
|---|---|---|---|---|
| Q-01 | What is م-1? The artifact names it but never defines it. | four ledger rows apply it; no text exists to apply | A6, A11 | §2.3 |
| Q-02 | Does ق-3 carry decision authority without a governing-decision entry? | the eighth category has no enumerated authority | A8 | §2.3 |
| Q-03 | What is the third provisioning gate? | the algorithm is announced as three gates, two exist | A6 | §2.3 |
| Q-04 | What is Crucible stage three? | the heading promises it; the body has no text | A12 | §2.3 |
| Q-05 | What belongs in the empty closing-ledger item? | the ledger opens with an orphan item | none | §2.3 |
| Q-06 | Where are executive-summary items 1–6? | the list starts at 7 | A14, A16 | §2.3 |
| Q-07 | Where is reference entry 1, and what fills entry 18? | citations resolve to missing entries | none | §2.3 |
| Q-08 | Which agent count is normative: 27, 24, or 24 + 4? | the roster arithmetic and every downstream count depend on it | A3, A7 | §2.3 |
| Q-09 | How should the malformed four-way table be read? | three rows carry shifted cells | A1 | §2.3 |
| Q-10 | What does the global scope hold? | the cell is empty while the prose says 27 + 37 | A13 | §2.3 |
| Q-11 | Is the `design.md` floor 0 or 1? | a deterministic algorithm cannot carry "0 or 1" | A6 | §2.3 |
| Q-12 | Is `dsh` the second adopted stage, a future base, or both? | adoption order and the ق-7 deferral depend on it | A1, A2 | §2.3 |
| Q-13 | Is the offload trigger 28,000 with a 30,000 ceiling, or a 28k–30k band? | the trigger is stated three ways | A14, A16 | §2.3 |
| Q-14 | How do the 80% reuse block and the 0.92 cosine cut relate? | two similarity scales gate different actions | A10 | §2.3 |
| Q-15 | In what order are the `vs-*` twins deleted and the two skills sharded? | three overlapping instructions, no owner or order | A11 | §2.3 |
| Q-16 | Are there six gaps or four? | the remediation set and the new-pair count follow from it | A7, A14 | §2.3 |
| Q-17 | Is the lock's historical composition the abolished past or the live state? | the same 9 pending themes are both "past" and "live defect" | A4, A5 | §2.3 |
| Q-18 | Are documentation examples exempt from the absolute-path ban? | the blueprint illustrates with absolute paths while banning them | A13 | §2.3 |
| Q-19 | Which commit law governs: `AGENTS.md:130` "no commit, no push" or `BLUEPRINT.md:200` commit-per-improvement? | the mission is already committing | A10 | §3.1 |
| Q-20 | Who may correct the vanguard census, and to which numbers? | the skill is the selection surface; its 36/52 drives every equip run | A6 | §3.1 |
| Q-21 | Does `covers_gap` get data, or does the formula lose the predicate? | Gate 2 cannot evaluate either way without a ruling | A6 | §3.1 |
| Q-22 | Is a structural gate required to prove the seven-heading shape? | `verify-skills` cannot certify it today | A11 | §3.1 |
| Q-23 | What replaces `verify-kit`'s lock proofs and the CI path if the lock is abolished? | removing the lock removes the only proof that components load | A4 | §3.1 |
| Q-24 | Is the Markdown catalog or the sidecar set the acknowledged source? | the generator reads one, the blueprint names the other | A5 | §3.1 |
| Q-25 | Is `.opencode/equip.manifest.json` created in Phase 1, or struck from the design? | three artifacts reference it; none exists | A5 | §3.1 |
| Q-26 | What is the lawful path to 100% verified: invent 1,690 commands, or publish a catalog v4? | the schema forbids in-place change and forbids verified-with-null | A5 | §3.1 |
| Q-27 | What is `kit.core.lock`? | the blueprint abolishes it; it never existed | A4 | §3.1 |
| Q-28 | Re-key the blueprint's F-COLOR ids or rename the canonical register? | every remediation ticket depends on which id space wins | A8, A9 | §2.3 |
| Q-29 | Re-key the blueprint's C-ids or rename the canonical C register? | same, for cross-surface contradictions | A9 | §2.3 |
| Q-30 | Which official sources establish the six platform brand hexes? | four of six have no on-disk source | A8 | §3.1 |
| Q-31 | When does the Zenith category exist, given Zenith ships in v0.8? | taxonomy cannot bind a category with no agent | A8 | §3.1 |
| Q-32 | Who owns the per-phase model-choice mechanism, and where does it live? | the protocol has no implementation and the law is prose | A3 | §3.1 |
| Q-33 | Which platform claims are true on v2.0.27 — throwing prompt, six hooks, probe? | three blueprint claims are contradicted or unmeasured | A1, A2 | §3.1 |

---

## 5. Backlog ordered by dependency

### 5.1 UNBLOCKED — proceed when the owner opens Phase 1, subject to the ق-1 per-phase model choice

| U | Work | What verifies it |
|---|---|---|
| U1 | ق-6 hook merge: fold `vantrilex-guards.ts` into `arsenal.ts` and add the six-hook capability probe with its fallback gate | `node scripts/verify-kit.mjs` per-kind/hooks row maps 7 hooks to functions; `tsc --noEmit` clean; `opencode plugin list` returns one plugin; the probe exits non-zero when a named hook is absent |
| U2 | م-4 kill switch: four signals, checked at the head of every hook | a probe asserting each of `vantrilex.enabled`, `.opencode/.vantrilex-disable`, `VANTRILEX_DISABLED`, `excludedProjects` suppresses a hook; today all four are 0 code hits |
| U3 | ق-1 standing-law cleanup: remove named model routings from `WORKFLOW.md:100-101` and `AGENT.md:226`, keep zero pins | `Select-String -Path WORKFLOW.md,AGENT.md -Pattern 'DeepSeek'` → 0 and `-Pattern 'Muse Spark'` → 0; `^model:` across 27 agent files stays 0 |
| U4 | Path pluralization: 9 singular agent refs and 21 singular command refs; start at `red-team/SKILL.md:15`, `:64` | `Select-String -Path .opencode\skills\red-team\SKILL.md -Pattern '\.opencode/agent/'` → 0; full-tree sweep → 0; `verify-skills` stays 10/10 |
| U5 | Diff Size Guard in `tool.execute.before` at 120 lines / 4 files | a fixture with 121 changed lines and no commit trips the guard; `arsenal.findings-probe.mjs` gains the case and stays green |
| U6 | Vanguard census correction from 36/52 to the live 32/125 + 157 + 9 | `verify-kit` `lockfile-validates` (157 / 9) and a recount of tiers 32 / 125 agree with the skill text |

### 5.2 BLOCKED ON Q — listed, not built

| Blocked work | Q-ids |
|---|---|
| Lock abolition and replacement of its proofs | Q-17, Q-23, Q-27 |
| Verified-only invariant | Q-26, Q-24 |
| Goldilocks provisioning algorithm and the third gate | Q-03, Q-11, Q-20, Q-21, Q-01 |
| Factory gates 1–4 contract | Q-04, Q-22 |
| Stage-three authoring | Q-04 |
| Id-space re-keying (F-COLOR and C) | Q-28, Q-29 |
| Brand provenance and Zenith taxonomy | Q-30, Q-31, Q-02 |
| New pairs (reuse-guard, offloader, journey-verifier, prod-parity) | Q-16, Q-13, Q-06, Q-03 |
| Shard decisions for vanguard and doctrine | Q-15, Q-22 |
| Model protocol mechanism | Q-32 |
| Platform-claim repairs beyond U1 | Q-33 |
| Global install: resolver, loader and overlay | Q-10, Q-18 |
| Context machinery, including offload re-binding | Q-06, Q-13 |
| Commit law reconciliation | Q-19 |
| Agent-count normalization | Q-08 |

### 5.3 DEPENDENCY GRAPH

- Wave U (unblocked): `U4 ∥ U6 → U3 → U1 → {U5, U2}` — U5 touches the same `tool.execute.before`
  block U1 rewrites, so it follows U1; U2 also edits `arsenal.ts` and follows U1 for single-writer
  order.
- Wave Q (blocked): every row in §5.2 waits for its named Q-ids; nothing in this wave may start
  from a builder's reading of the blueprint alone.
- Wave P (later phases): `§4.2` factory verification skill and agent, then catalog admission —
  depends on Q-04, Q-22, Q-26 and does not start in Phase 1.

---

## 6. Phase 0 outcome

### 6.1 Counts

- 16 axes measured: **0 ALREADY TRUE, 5 PARTIALLY TRUE, 7 ABSENT, 4 CONTRADICTED**.
- 55 findings: **2 CRITICAL, 32 HIGH, 20 MEDIUM, 1 LOW**.
- 33 owner questions: 18 from the intake, 15 found by the wave-1 nodes.
- 3 citation corrections to the brief's anchor set (§1.5 N-c, N-d, N-e) and 2 counts that did
  not reproduce (§1.5 N-a, N-b).

### 6.2 STOP list

Every question in §4 is a stop, not a task: Q-01, Q-02, Q-03, Q-04, Q-05, Q-06, Q-07, Q-08,
Q-09, Q-10, Q-11, Q-12, Q-13, Q-14, Q-15, Q-16, Q-17, Q-18, Q-19, Q-20, Q-21, Q-22, Q-23, Q-24,
Q-25, Q-26, Q-27, Q-28, Q-29, Q-30, Q-31, Q-32, Q-33.

The two CRITICAL id collisions stop A8 and A9 entirely until Q-28 and Q-29 are ruled. The lock
axis (A4) stops until Q-23 and Q-27 are ruled, because abolishing the lock without a replacement
removes the only proof that components load.

### 6.3 What Phase 1 can start on

U1…U6, in the order in §5.3, once the owner opens Phase 1 and makes the ق-1 per-phase model
choice. Nothing else in Phase 1 may proceed: every remaining workstream in §5.2 has a named
blocking question.

### 6.4 Completion contract (work order §6.1–§6.6)

1. **Applied per axis:** NONE. Phase 0 is measurement; no file outside this report was changed
   and no axis was moved from its measured verdict.
2. **Verification evidence:** the commands and exits in §1.6, the gate run in §6.6, and the
   quoted `verify-kit` / `verify-skills` output.
3. **Side-agent findings:** the seven wave-1 nodes in §1.1, all landed and re-read.
4. **New skills or agents:** NONE in this phase. The §4.2 factory-verification skill and agent
   belong to a later phase and depend on Q-04, Q-22, Q-26.
5. **Housekeeping:** none this phase. The 7 deletions and 7 untracked successors are recorded in
   §1.3 and left untouched; no canonical, parked, referenced or unclear file was deleted.
6. **Owner questions:** the 33-row register in §4.

### 6.5 Staleness

- This report: `last_verified` 2026-10-21. Verification behind the date: every citation re-read
  from disk at HEAD `93f5b4e` on the dirty working tree in §1.3, plus the gate run below.
- The intake `.opencode/audit/POST87-INTAKE.md` carries no `last_verified` field; its filing
  record at `AGENT.md:298` is dated 2026-10-21 and its hash still matches (§1.4). Its date is
  reported, not bumped.

### 6.6 Gates on this artifact

| Gate | Command | Result |
|---|---|---|
| Markdown lint | `npx --no-install markdownlint-cli .opencode/audit/POST87-PHASE0.md` | exit 0, zero findings |
| Relative links | count of relative links in this file | 0 counted, 0 unresolved |
| Placeholder tokens | three-token scan over this file (the two stub markers plus the two-word deferred-work phrase) | 0 |
| Secrets | key-shaped scan over this file | 0 |
| Model pins | `^model:` across `.opencode/agents/*.md` | 0 (unchanged by this node) |
| Line count | `(Get-Content …).Count` | 681 lines |

The line count above was measured on the file as committed, after every edit in this node; the
commit that carries this report is scoped to this path only, and no other path is staged.

Ponytail: EXEMPT — pure prose and translation; no code was authored, so no FLOOR/CEILING posture
binds this node.
