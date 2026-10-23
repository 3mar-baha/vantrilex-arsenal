# V87 — Defects Register

| Field | Value |
|---|---|
| Lane | `V87-AETHER-EXECUTE` (wave 2) |
| Node | `d-defects` (wave 2 of 3) |
| Owner | `vantrilex-scribe` |
| Concern | Output #4 of the owner package: the compatibility set plus the general defect set, consolidated once, ranked worst-first, never re-graded |
| Date (UTC) | 2026-10-18 |
| Evidence basis | The five read-only audit artifacts named below, plus the dispatch-supplied spec conflict (`V87-SPEC-01`), plus this node's own spot-check reads (§6.5) |
| Inputs consolidated | `.opencode/audit/V87-ENUM.md` (D1–D11) · `.opencode/audit/V87-COLOR-FINDINGS.md` (F-COLOR-01..08) · `.opencode/audit/V87-COMPAT-FINDINGS.md` (C-01..C-11) · `.opencode/audit/V87-FEATURE-AUDIT-1.md` (F-A1..A7) · `.opencode/audit/V87-FEATURE-AUDIT-2.md` (F1..F5) |
| Artifact | `V87-DEFECTS.md` (repo root) |
| Write status | Written by this node under the dispatch's sole-write grant. The five audit artifacts, both state files, and git are untouched (§7). |
| Last verified | 2026-10-18 — verification: the six spot-check reads in §6.5 and the `markdownlint-cli` run in §6.6 |
| Index status | No `docs/00-INDEX.md` entry. That index covers the `docs/` tree only; repo-root deliverables (`P4-DEFERRAL-LEDGER.md`, `P5-LOOP-DOSSIER.md`, `V87-COLOR-AUDIT.md`) carry none either (§6.6). |

Honesty labels carried from the sources: **مثبت** = proven by a command or an exact `file:line` read in the named source; **~تقديري** = best-evidenced estimate, never promoted to fact. Every row below cites the source that owns it; this register measures nothing new except the spot-checks it names as its own.

**Language deviation (recorded, not silently dropped):** `AGENTS.md` hard rule 5 makes this repository English-only, so this node drafts **no Arabic mirror**; the lane-mandated honesty labels (`مثبت` / `~تقديري`) are retained verbatim because the acceptance names them (same deviation recorded at `V87-PLAN-ZERO-TO-87.md:20`).

---

## 0. Reading guide

**Row schema.** `id | severity | statement | evidence (file:line) | status | suggested owner` — one concern per row, ranked worst-first inside each section.

**Severity basis (no re-grade).** Rows sourced from `V87-ENUM.md` and `V87-COMPAT-FINDINGS.md` carry the source's own severity verbatim (`HIGH` / `MEDIUM` / `LOW` / `INFO`). Rows sourced from `V87-COLOR-FINDINGS.md`, which publishes no severity column, carry the priority rank published for the same finding in `V87-COLOR-AUDIT.md` §6, mapped `P0→HIGH`, `P1→MEDIUM`, `P2→LOW`, `P3→INFO`; the one unranked finding (F-COLOR-08) is labelled `INFO`. Rows sourced from the two feature shards and `V87-SPEC-01` carry a **derived** severity, marked `ᵈ`, by this rule: `HIGH` = a documented contract is broken, a required artifact is absent, or work is blocked; `MEDIUM` = a live contradiction or a measured gap with a named owner; `LOW` = stale census or document text that blocks no work; `INFO` = disclosure only. No source severity was altered and no finding was re-measured.

**Status vocabulary.** `open` = the owning audit's live defect, unrepaired. `known-parked` = the state is declared somewhere durable (a lock or catalog row, a recorded residual, an explicit out-of-scope decision) and is carried, not silent. `fixed` = a repair is on disk and verified; exactly one row qualifies, and its re-lint is owed to W3.

**Package shorthand.** The dispatch calls the package "compatibility 4C + general 5C". This register reads `4C` as the compatibility audit's four checks — vs-*, routing, triumvirate, agreement (§A.0) — and the general set as the remaining sections. The binding check is not the shorthand but the arithmetic in §6.1: every source finding lands in exactly one row.

---

## A. Compatibility — the 4C set (9 rows)

### A.0 The four checks, accounted for

- **Check 1 — `vs-*` interop:** rows C-01, C-02, C-03, C-10. Probe `probe-1 vs-* skills: 8 checked, failures: 0`, exit 0; all 8 folder names match their frontmatter names and carry the 7 required headings in order (`V87-COMPAT-FINDINGS.md:65-119`).
- **Check 2 — routing state:** **no defect row issued.** The check's verdict, quoted from the source: "the Spark/DeepSeek split is implemented **in dispatch convention only, not in config** — no OpenCode config file exists anywhere in the repository, zero agent frontmatter carries a model pin, and the only durable record is prose in `WORKFLOW.md:105` and `AGENT.md:226`" (`V87-COMPAT-FINDINGS.md:121-168`). A convention with zero pins is the state the owner law asks for; nothing is defective on disk. *(W3 correction note: the embedded pointers inside this quote were corrected on disk — `WORKFLOW.md:104`→`:105` and `AGENT.md:230`→`:226`; the source artifact retains the original values.)*
- **Check 3 — triumvirate integrity:** rows C-04, C-05. Probe `probe-3 triumvirate failures: 0`, exit 0; stems equal names 3/3, all `mode: primary`, all three colors match the reserved palette (`V87-COMPAT-FINDINGS.md:170-211`).
- **Check 4 — lock/registry/catalog agreement:** rows C-08, C-09, C-10, C-11. Probe `probe-4 agreement mismatches: 0`, exit 0; lock 157 = 32 + 125, pending 9, catalog 2931, sidecars 16, agents 27, skills 37, commands 18 + 4 (`V87-COMPAT-FINDINGS.md:213-260`). C-10 and C-11 are the two scope-boundary rows that check exposed.

### A.1 Defects, worst-first

| id | severity | statement | evidence (file:line) | status | suggested owner |
|---|---|---|---|---|---|
| C-01 | MEDIUM | No named agent can load any `vs-*` skill: 0 of 27 agent files grant one, while the three leaders deny `skill "*"` and allow only unprefixed names. | `aether.md:14-28` (deny `*`, allow `vantrilex-workflow-forge`); `blazar.md:59,65,86,92,98,116`; count of `vs-` across `.opencode/agents/*.md` = 0, re-run by this node (§6.5 SC-5a); `V87-COMPAT-FINDINGS.md:269`; مثبت count / ~تقديري runtime effect | open | kit maintainer + Guide |
| C-02 | MEDIUM | Duplicate trigger surface: twin pairs carry byte-identical `description:` lines, so skill selection between `X` and `vs-X` cannot be deterministic. | `SKILL.md:3` of `preflight-system-doctor`, `vs-preflight-system-doctor`, `vantrilex-vanguard`, `vs-vantrilex-vanguard`, `circuit-breaker-guard`, `vs-circuit-breaker-guard`, `github-release-packager`, `vs-github-release-packager`; `V87-COMPAT-FINDINGS.md:270`; مثبت bytes / ~تقديري effect | open | kit maintainer |
| C-03 | MEDIUM | No command entry point names a `vs-*` skill: 0 hits across all 22 command files; the four canonical commands describe the unprefixed flows in prose. | `.opencode/command/doctor.md:2`, `equip.md:2`, `prime.md:2`, `release.md:2`; scan of both command roots for any `vs-` id = 0; `V87-COMPAT-FINDINGS.md:271`; مثبت count | open | Guide |
| C-04 | LOW | Leader frontmatter uses two different temperature shapes — nested `request.body` on blazar, top level on aether and pulsar; if V2 honours only one shape, the other is inert. | `blazar.md:6-8` vs `aether.md:6`, `pulsar.md:6`; `V87-COMPAT-FINDINGS.md:272`; مثبت shapes / ~تقديري which is honoured | open | kit maintainer |
| C-05 | LOW | Aether accent case mismatch (`#14B8A6` in the agent vs `#14b8a6` in the registry) and reserved-category semantics conflict: `categories.reserved` says "BLAZAR only" while the aether and pulsar rows carry `"category":"reserved"`. | `aether.md:5`; `registry/themes/vantrilex-atomic-switch.json` (`agents[1].accentHex`, `categories.reserved`); `V87-COMPAT-FINDINGS.md:273`; مثبت bytes / ~تقديري checker sensitivity | open | kit maintainer |
| C-08 | LOW | markdownlint MD034 ×8 bare URLs plus MD032 ×1 in the generated mirror; the identical content exists at HEAD, so the defect is pre-existing and generator-caused. | `registry/VANTRILEX_CATALOG.md:1604,1712,1855,1887,2014,2031,2117,2139,3026`; re-run by this node → 8×MD034 + 1×MD032, exit 1 (§6.5 SC-6); `V87-COMPAT-FINDINGS.md:276`; مثبت pre-existing / ~تقديري fix path | open | kit maintainer (generator) |
| C-09 | LOW | Two command roots coexist — `.opencode/command` (4 files) and `.opencode/commands` (18); the `V-*` set is documented as parked to v0.8 and the installation doc names only the singular path, and no gate asserts which root V2 loads. | `.opencode/command/` vs `.opencode/commands/`; `docs/99-archive/P1-RENAME-CHECKLIST.md:41`; `docs/ar/02-INSTALLATION.md:61-63`; `V87-COMPAT-FINDINGS.md:277`; مثبت roots / ~تقديري loading | open | Guide |
| C-10 | INFO | 19 of 37 skill folders have no `kit.lock` row and all 8 `vs-*` ids have no `registry/catalog.json` record; registration is explicitly parked. **Merged: F-A4** (the shard-A statement adds that 16 folders have no catalog record, that the four tracked undeclared ones are kit-defects, and that `relay-protocol` is deliberate). | unlocked list at `V87-COMPAT-FINDINGS.md:278`; `AGENT.md:158` items 5–6; F-A4 at `V87-FEATURE-AUDIT-1.md:295-299` (`git ls-files --error-unmatch` exit 0 for the five tracked ids); مثبت | known-parked | owner (registration parked) |
| C-11 | INFO | 7 of 27 agent files have no `kit.lock` row. **Merged: F-A3** (same seven ids; the shard-A statement adds that the same seven are also absent from `registry/data/agents.jsonl`). | `vantrilex-agent-maker`, `vantrilex-guide`, `vantrilex-implementer`, `vantrilex-kit-maintainer`, `vantrilex-leader`, `vantrilex-puller`, `vantrilex-uploader`; `AGENT.md:158` item 6; F-A3 at `V87-FEATURE-AUDIT-1.md:288-293`; مثبت | known-parked | owner (registration parked) |

---

## B. Project and agents (13 rows)

**27-agent coverage.** The color audit measured all 27 files: 3 compliant (`aether`, `blazar`, `pulsar`, each on its reserved hue), 24 with no `color:` key, 0 with a wrong color, 0 carrying a `group:` or `category:` field. Of the 24 color-less files, 12 **forbid** a color field in their own text and 12 are silent (`V87-COLOR-FINDINGS.md:23-36,:42-62`; re-count of the `color:` keys by this node, §6.5 SC-2). The table below ranks the two **named merges away** from this section: F-A3 lives as C-11 and F-A4 lives as C-10, both in §A.1 (§6.2).

| id | severity | statement | evidence (file:line) | status | suggested owner |
|---|---|---|---|---|---|
| F-COLOR-06 | HIGH | Live doctrine conflict: 12 subagent files explicitly forbid a `color` field while `docs/18-THEMES.md:95` and `AGENT.md:102` require a per-agent color, so the 24 absences are the expected output of the live rule, not worker error. | `vantrilex-agent-maker.md:35-37,:95`, `vantrilex-fixer.md:199`, `vantrilex-github.md:149`, `vantrilex-harness.md:299`, `vantrilex-kit-maintainer.md:69`, `vantrilex-librarian.md:275`, `vantrilex-releaser.md:267`, `vantrilex-reviewer.md:281`, `vantrilex-scribe.md:260`, `vantrilex-security-auditor.md:388`, `vantrilex-ui-designer.md:73-74`, `vantrilex-verifier.md:292-293`; `docs/18-THEMES.md:95`; `AGENT.md:102`; `V87-COLOR-FINDINGS.md:30-36,:269,:324`; مثبت | open | Guide (owner ruling), then kit maintainer |
| F-COLOR-02 | HIGH | The Part-2 palette has no on-disk definition; the seven-group taxonomy exists only in the dispatch brief, and no repo file states it as a group definition. | `V87-COLOR-FINDINGS.md:218-233,:268,:320`; `#22D3EE` and the other group hexes occur only in third-party `registry/design/*/DESIGN.md` and leader plumbing (`:74-88`); `docs/spec/v87/**` carries no palette line (`V87-COLOR-AUDIT.md` SC-6, exit 1); مثبت | open | kit maintainer (author the group definition) / Guide |
| F-A1 | HIGH ᵈ | Two consult commands instruct the model to read agent definition files that were deleted in the B2 supersession and do not exist on disk — the owning audit's only BROKEN feature pair. | `V-Technical-Writer.md:23,:51` → `.opencode/agents/technical-writer.md`; `V-Ai-Generated-Code-Security-Auditor.md:25,:55` → `.opencode/agents/ai-generated-code-security-auditor.md`; both paths absent, re-run by this node (§6.5 SC-5b); `V87-FEATURE-AUDIT-1.md:251,:273-279`; pre-existing at HEAD; مثبت | open | kit maintainer (component definitions) |
| F-COLOR-03 | MEDIUM | The registry `category` is a five-value taxonomy (`reserved`, `code`, `external`, `kit`, `research`) whose hexes do not match the seven-group palette, `#8B5CF6` collides across `external` and operate, and no mapping row exists anywhere between the two taxonomies. | `V87-COLOR-FINDINGS.md:90-102,:235-243,:260-265,:321`; `registry/themes/vantrilex-atomic-switch.json`; مثبت | open | kit maintainer |
| F-COLOR-05 | MEDIUM | 9 of 12 registry rows are `pending` and dangle on absent theme files: 6 carry pre-rename stems (one, `technical-writer`, has no live file — nearest role `vantrilex-scribe`) and 3 carry double-prefix `themeId`/`themeFile`. | `V87-COLOR-FINDINGS.md:104-124,:277-311,:323`; live re-run `missing theme files: 9/12` (`V87-COLOR-AUDIT.md` SC-5); `registry/themes/` holds exactly 4 JSON files plus `_index.md`; مثبت | known-parked | kit maintainer |
| F-COLOR-04 | MEDIUM | `#22D3EE` (exploration) occurs zero times outside the V87 deliverables, the audit set, and AGENT.md (the SC-4 exclusion set), so the exploration group has no rendering anywhere — not in the registry and not in `brand/IDENTITY.md`. | `V87-COLOR-FINDINGS.md:74-88,:266,:322`; the non-audit re-count reproduces 0 (`V87-COLOR-AUDIT.md` SC-4); مثبت | open | kit maintainer |
| F-A2 | MEDIUM ᵈ | Three role-switch commands instruct resolving `registry/themes/vantrilex-vantrilex-*.json`, which does not exist; the state is declared in the lock, so it is a known carry rather than a silent break, but the command's Step 2 cannot complete today. | `V-Vantrilex-Guide.md:23`, `V-Vantrilex-Implementer.md:23`, `V-Vantrilex-Leader.md:23`; `kit/kit.lock:171` and sibling pending rows; `V87-FEATURE-AUDIT-1.md:249,:281-286`; مثبت | known-parked | kit maintainer (author the three theme JSONs or re-point the commands) |
| F-A5 | MEDIUM ᵈ | `vs-*` twin pairs share a byte-identical `description:` line, so trigger selection between `X` and `vs-X` cannot be deterministic; `vs-smithery` has no in-repo base and no lock row. | five pairs measured equal — `vs-circuit-breaker-guard` 268 B = 268 B, `vs-github-release-packager` 342 = 342, `vs-preflight-system-doctor` 276 = 276, `vs-vantrilex-vanguard` 186 = 186, `vs-vantrilex-workflow-forge` 72 = 72 — each at `SKILL.md:3`; `V87-FEATURE-AUDIT-1.md:237,:301-305`; مثبت bytes / ~تقديري effect | open | kit maintainer |
| F-A7 | MEDIUM ᵈ | Known-open: the `[arsenal] typescript-check` hook mis-resolves — its exact resolved command exits 0 here, the entry point exists, no `tsc` shadows it, yet the recorded live emission is FAIL; the taxonomy bucket is unclassified and needs a dedicated host-side probe. | `arsenal.ts:1720-1786,:1744-1756,:879`; `AGENT.md:230,:236`; direct run of the hook's own command → exit 0; `V87-FEATURE-AUDIT-1.md:265,:313-316`; مثبت for the probe / ~تقديري for the live fault | known-parked | dispatcher (names the probe owner), then host-runtime or kit maintainer |
| F-COLOR-07 | LOW | The per-agent theme mapping in `docs/18-THEMES.md` is stale: it lists only `blazar` plus three `RESERVED` agents that do not exist (`plan-replacement`, `project-prep`, `exploration`), omits the installed `aether` and `pulsar`, and still calls blazar "the manager-only orchestrator". | `docs/18-THEMES.md:21-28`; `registry/themes/` holds `vantrilex-aether.json`, `vantrilex-blazar.json`, `vantrilex-pulsar.json`; `V87-COLOR-FINDINGS.md:268,:325`; مثبت | open | scribe / kit maintainer |
| F-A6 | LOW ᵈ | `relay-protocol` census drift: the changelog says "8 files on disk" and lists 7 companions, while the live folder holds 9 — `SESSIONS.md` is the extra and it is tracked. | `CHANGELOG.md:38`; `git ls-files --error-unmatch .opencode/skills/relay-protocol/SESSIONS.md` → exit 0; `V87-FEATURE-AUDIT-1.md:239,:307-311`; مثبت | open | kit maintainer (changelog census, not the skill) |
| F-COLOR-01 | INFO | 24 of 27 agent files carry no `color:` key and 0 of 27 carry a `group:`/`category:` field; the measurement is real, but it is the expected output of the live rule at F-COLOR-06, not 24 acts of disobedience. | `V87-COLOR-FINDINGS.md:23-36,:42-62,:141-169,:319`; re-count of the `color:` keys by this node → 3 (`aether.md:5`, `blazar.md:5`, `pulsar.md:5`), §6.5 SC-2; مثبت | open | Guide (owner ruling via F-COLOR-06) |
| F-COLOR-08 | INFO | Four of the seven proposed group assignments are estimations, not owner-ratified readings: `leader`, `librarian`, `red-team`, and the `guide` review/audit boundary. | `V87-COLOR-FINDINGS.md:151,:155,:156,:159,:326,:334-336`; ~تقديري | open | Guide |

---

## C. Version and metadata — the ENUM D-set (11 rows)

The source's severity column is carried verbatim. The source publishes no owner column for these rows, so `suggested owner` is this consolidator's reading of the row's own content and of ENUM §4's handoff; it is a routing suggestion, not a measured fact.

| id | severity | statement | evidence (file:line) | status | suggested owner |
|---|---|---|---|---|---|
| D1 | HIGH | `[0.7.7]` is labelled "PARKED, UNRELEASED (no tag, no publish)" and its checklist says `git tag -l v0.7.7` must print nothing, yet the tag exists locally, is published to `origin`, and the state file records the release as published. | `CHANGELOG.md:12-18,:116-121,:164-165`; `git tag` lists it (12 tags total, re-run §6.5 SC-1); remote carries `refs/tags/v0.7.7` (ENUM CMD8); `AGENT.md:301`; `V87-ENUM.md:296`; مثبت | open | release/docs author (CHANGELOG status lines) |
| D2 | HIGH | `[0.7.6]` is labelled parked with "no tag" while the tag exists locally and remotely; the state file records the tag, the push, run `38751189927` and the published tarball. | `CHANGELOG.md:167-173,:328,:364`; `AGENT.md:302`; `V87-ENUM.md:297`; مثبت | open | release/docs author |
| D3 | HIGH | `[0.7.5]` is labelled parked with "no tag"; no `v0.7.5` tag exists, but `v7.5` does, is pushed, and carries the `vantrilex-arsenal-v7.5.tar.gz` release — so the section's literal "no tag" is true only for the string `v0.7.5`. | `CHANGELOG.md:367-373,:483,:510-511`; `git tag -l v0.7.5` empty vs `git tag -l v7.5` match (ENUM CMD3/CMD4); `AGENT.md:303`; `V87-ENUM.md:298`; مثبت | open | release/docs author + owner |
| D4 | HIGH | Tag `v7.5` against the heading `[0.7.5]` in that tag's own tree: the shipped sequence reads `v0.7.0 → v7.5 → v0.7.6 → v0.7.7`, so a tool sorting tags lexically or numerically derives a wrong newest release, and a tool reading headings derives a `0.7.5` that has no tag. | `git show v7.5:CHANGELOG.md` top heading `[0.7.5]` (ENUM CMD6); `AGENT.md:303-304` ("v7.5 (tag name as ordered)"); `V87-ENUM.md:299`; مثبت | open | owner (published history is immutable; a ruling is needed) |
| D5 | HIGH | The `AGENT.md` "Current state" block (branch `wt/v04-program`, `HEAD 53275ec`, newest tag `v0.3.0`, "no `v0.4.0` entry observed") contradicts the live tree (branch `wt/vta-factory-p0`, `HEAD c7c762c`, 12 tags to `v0.7.7`, `[0.4.0]` present); the file's own task log contradicts its own header. | `AGENT.md:20-24` vs live `git log -1`, `git tag`, `CHANGELOG.md:763`; `V87-ENUM.md:300`; مثبت. Note, not a status change: `AGENT.md:252` records the header refreshed by orchestrator bookkeeping on 2026-10-18; W3 to confirm. | open | scribe / orchestrator (state-file bookkeeping) |
| D6 | MEDIUM | Three released versions have no CHANGELOG link reference and `[Unreleased]` still compares from `v0.7.0`, so the diff links are three versions stale. | `CHANGELOG.md:16-17,:170-171,:370-371`; the link-reference block ends at `:1344-1353`; `V87-ENUM.md:301`; مثبت | open | release/docs author |
| D7 | MEDIUM | `[Unreleased]` is empty while four commits and the uncommitted lane work exist after `v0.7.7`, and the lock moved 138 → 157 in that span — substantial post-release work has no changelog entry. | `CHANGELOG.md:10`; `git log v0.7.7..HEAD` → `c7c762c, 66d0e45, 772c693, 0eed6a1`; `AGENT.md:220`; `V87-ENUM.md:302`; مثبت | open | release/docs author |
| D8 | MEDIUM | The README lock census is stale: it states "112 components with an empty `pending` list: 31 tier `core` and 81 tier `conditional`" and "80 `verified` and 32 `unverified`", while the live lock carries 157 components + 9 pending, 32 core / 125 conditional, 80 verified / 77 unverified. | `README.md:252-263` vs `docs/09-KIT-LOCK.md:7` and the live lock; known carried residual `AGENT.md:242`; `V87-ENUM.md:303`; مثبت | known-parked | docs author (README) |
| D9 | MEDIUM | The theme mapping in `docs/18-THEMES.md` lags the shipped tree — only `blazar` plus three `RESERVED` rows, and blazar still called "the manager-only orchestrator" — while AETHER/PULSAR leaders and themes shipped at 0.7.5 and BLAZAR was retooled to Build Leader at 0.7.6; four theme JSONs are on disk. | `docs/18-THEMES.md:21-28`; `CHANGELOG.md:377-389,:177-198`; `V87-ENUM.md:304`; مثبت | open | scribe / kit maintainer |
| D10 | LOW | No file in the lock chain answers "which kit version is this": lock identity is `kit: "vantrilex-core"` plus `lockfileVersion: 1`, and the version exists only in git tags and changelog headings — which is why D4 propagates. | `kit/kit.lock.schema.json:8-18`; `kit/kit.lock:1-5`; `V87-ENUM.md:305`; مثبت | open | kit maintainer (lock schema) |
| D11 | LOW | `docs/16-TASK-DISPATCH.md` still carries 112-era figures. | recorded residual `AGENT.md:237`; live lock 157 (`docs/09-KIT-LOCK.md:7`); `V87-ENUM.md:306`; مثبت | known-parked | docs author |

---

## D. CI, docs and link machinery (5 rows)

| id | severity | statement | evidence (file:line) | status | suggested owner |
|---|---|---|---|---|---|
| F4 | MEDIUM ᵈ | The CI surface carries a permanently skipped step and two missing assertions: `ci.yml:141` tests `docs/17-CHECKPOINT.md`, a path that exists nowhere (the file is `docs/17-V2-HOOK-GAP.md`), so the contract step prints SKIPPED by design; no CI step runs `verify-skills.mjs` although the skill-format gate is documented; and the shebang-plus-100755 assertion covers seven of eight shell scripts, leaving `scripts/migrate-to-opencode-v2.sh` at 100644 and `.githooks/*` at 100644 and unasserted. | `.github/workflows/ci.yml:118-147`; `docs/14-CI-RELEASE.md:12-15,:23-24`; `docs/08-VERIFICATION.md:58-70`; `git ls-files -s scripts/*.sh` → `migrate-to-opencode-v2.sh` 100644; present at base `772c693`; `V87-FEATURE-AUDIT-2.md:223-226,:287-291`; مثبت for items 1 and 3 / ~تقديري on item 2's intent | open | CI author / kit maintainer |
| F2 | MEDIUM ᵈ | Docs link health: 11 relative links break in the pre-artifact sweep (312 of 323 resolve), 10 of them inside `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md` where root-relative targets are read from inside `docs/99-archive/`, and 1 in the generated mirror (`registry/VANTRILEX_CATALOG.md:1593` → `htt…`); the CHANGELOG link references are three versions stale (D6's family). | `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md:34,35,35,88,134,180,227,269,305`; sweep `files=3081 … relative=323 resolved=312 broken=11`, exit 0 (`V87-FEATURE-AUDIT-2.md:212-215,:274-281`); a later identical re-run returned 13 breaks on the live tree, so the count is timestamp-bounded and the classification is the stable part | open | docs/release author (archive links), registry curator (the `htt…` cell) |
| F1 | MEDIUM ᵈ | markdownlint gate 9 failed with 3 errors across 2 state files — `AGENT.md` MD037 ×2 from unescaped literal asterisks and `WORKFLOW.md` MD032 from a list not surrounded by blank lines — new with the working-tree change when audited. **Fixed by the orchestrator on 2026-10-18** (asterisks back-ticked, blank line added). **Merged: C-06 + C-07** (the same three errors, earlier line numbers). **W3 re-lint episode:** W3 caught a new MD038 at `AGENT.md:265` (introduced after this register's measurement, in the `d-found-lint` log bullet); repaired by the orchestrator; re-lint exit 0. | audit: `AGENT.md:108:280`, `:203:302` MD037; `WORKFLOW.md:76` MD032, exit 1 (`V87-FEATURE-AUDIT-2.md:154-167`). Fix verified by this node: `npx --no-install markdownlint-cli AGENT.md WORKFLOW.md` → exit 0, and `AGENT.md:108`, `:203`, `WORKFLOW.md:76-77` read clean (§6.5 SC-4); W3 re-lint (2026-10-18): `npx --no-install markdownlint-cli AGENT.md WORKFLOW.md` → exit 0, no output; مثبت | fixed (W3 re-lint PASS, 2026-10-18) | docs author (this lane) — closed; W3 re-lint satisfied |
| F3 | LOW | The generated mirror carries truncated URL text in three cells (`requests/aiohtt…`, the `Pepys` link whose target is `htt…`, `pay HTT…`); the mirror itself is current (`--check` exit 0), so this is a content defect in a generated surface, not drift. | `registry/VANTRILEX_CATALOG.md:1005,:1593,:2418`; `--check` exit 0 (`V87-FEATURE-AUDIT-2.md` gate 4); pre-existing in base content; `V87-FEATURE-AUDIT-2.md:283-285`; مثبت | open | registry curator |
| F5 | LOW | The 7-file `docs/spec/v87/` provenance set (101,690 B, dated 2026-10-18) is untracked: `git ls-files docs/spec/v87` returns 0, so no commit pins it and it is provenance for this session only. | `git ls-files docs/spec/v87` → 0; `git status --porcelain` → `?? docs/spec/v87/`; `V87-INPUT-DIGESTS.md:16,21,22`; `V87-FEATURE-AUDIT-2.md:238-245,:293-295`; مثبت | open | Guide (version it, or declare it session-local) |

---

## E. Spec conflicts (1 row)

| id | severity | statement | evidence (file:line) | status | suggested owner |
|---|---|---|---|---|---|
| V87-SPEC-01 | HIGH | Spec conflict at the AETHER→BLAZAR handoff: `aether.md` §2 defines six plan sections and a role-section field set — `role`, the one concern, `owner`, `inputs`, `acceptance`, `verification`, `artifact`, `must-not-touch` — with **no** `section_leader` label and **no** per-role `State files` field, while `blazar.md` §3 requires all ten intake fields per role section (field 10 is `State files`) and §4 derives waves "only from role sections carrying the label `section_leader: blazar`". Every AETHER plan therefore formally fails BLAZAR intake; this lane proceeded only under the owner's explicit `execute` order, with the D5 verdict kept on record. One of the two specs must be amended. | `aether.md:128-147` (§2) vs `blazar.md:277-305` (§3 ten-field checklist, field 10 at `:305`) and `blazar.md:317` (§4); `section_leader` appears in no aether line — grep returns `blazar.md:187,:317` only; D5 record at `AGENT.md:250`; re-read by this node (§6.5 SC-3); مثبت | open | owner + Guide (choose which spec is amended), then kit maintainer applies |

**Recorded as dispatched.** This defect is not contained in any of the five audit sets; it was supplied with the dispatch and is recorded here verbatim-adjacent. The lane's progression is a recorded risk acceptance, not a suppression: `AGENT.md:250` carries the D5 RECORD in full and routes the defect to this file.

---

## 6. Coverage cross-check

### 6.1 Count reconciliation (quoted arithmetic)

> **ENUM 11 + COLOR 8 + COMPAT 11 + A 7 + B 5 + SPEC 1 = 43 source findings.**
> **4 of the 43 are the same concern that two audits each measured; each merge is named in §6.2 → 43 − 4 = 39 unique rows.**
> **39 = A 9 + B 13 + C 11 + D 5 + E 1.**

Per-section derivation, so any reader can re-add it:

| Section | Rows | Derivation |
|---|---:|---|
| A — Compatibility | 9 | COMPAT 11 − C-06 − C-07 (both merged into F1, §D) |
| B — Project and agents | 13 | COLOR 8 + shard-A 7 − F-A3 − F-A4 (merged into C-11 and C-10, §A) |
| C — Version and metadata | 11 | ENUM 11, unmerged |
| D — CI, docs and links | 5 | shard-B 5 (F1..F5), unmerged |
| E — Spec conflicts | 1 | SPEC 1 |
| **Total** | **39** | 43 source findings − 4 named merges |

**Status tally, counted from this register** (re-counted by command in §6.6): `open` 31 · `known-parked` 7 · `fixed` 1 = 39.

### 6.2 Merge register (4 merges, each named)

| Source finding | Merged into | Why it is one concern, not two | Surviving row |
|---|---|---|---|
| F-A3 (shard A) | C-11 (COMPAT) | Both name the same seven agent ids absent from `kit.lock`; F-A3 adds only that the same seven are absent from `registry/data/agents.jsonl`. | §A.1 C-11 |
| F-A4 (shard A) | C-10 (COMPAT) | Both measure the same 19 skill folders absent from `kit.lock`; F-A4 adds the 16-id catalog list and the tracked/untracked split. | §A.1 C-10 |
| C-06 (COMPAT) | F1 (shard B) | Both describe the same two `AGENT.md` MD037 errors from unescaped literal asterisks; only the line numbers differ (the file moved between audits). | §D F1 |
| C-07 (COMPAT) | F1 (shard B) | Both describe the same `WORKFLOW.md:76` MD032 error. | §D F1 |

### 6.3 Overlaps that are **not** merges (named so the counts stay honest)

- **F2 ↔ F3.** F2's single generated-mirror break is the same cell as F3's `:1593` truncation. F2 counts link resolution; F3 counts text truncation in three cells. The shared cell is named; both rows stand.
- **F-A2 ↔ F-COLOR-05.** Same root cause (theme JSONs not authored), different surfaces: F-A2 is the command reference, F-COLOR-05 is the registry row. Both rows stand.
- **D6 ↔ F2.** D6 is the ENUM row for the stale CHANGELOG link references; F2 points at it as the same family. D6 stands alone as the source owning the finding.
- **C-05 ↔ F-COLOR-05.** C-05 measures accent case and reserved-category semantics; F-COLOR-05 measures dangling pending rows. Distinct measurements; both stand.
- **F-COLOR-07 ↔ D9.** The same document (`docs/18-THEMES.md`) is cited by both, but C's D9 measures version/leader drift from the changelog and B's F-COLOR-07 measures the theme-mapping table. Kept as two source rows rather than merged, because each audit's own row is retained; a fix to the file closes both.

### 6.4 Nothing invented, nothing re-graded

Every statement in §A–§E is the owning source's statement, condensed without changing a measured value, a count, or a verdict. Where this register added a field the source does not publish — severity for the color set, severity for the shards, owner for the ENUM rows — the basis is stated in §0 and re-stated in the section note. `V87-SPEC-01` is the only row whose content is not in a source audit set, and it is labelled as dispatched and independently re-read.

### 6.5 Spot-check reads (six, quoted; each re-read on disk by this node)

**SC-1 — tag count (ENUM §1.1).**

```text
$ git tag | Measure-Object -Line
12
exit: 0
```

**SC-2 — frontmatter `color:` keys (COLOR §1.1).**

```text
$ Select-String -Path .opencode/agents/*.md -Pattern '^color:'
.opencode\agents\aether.md : 5 : color: "#14B8A6"
.opencode\agents\blazar.md : 5 : color: "#4169E1"
.opencode\agents\pulsar.md : 5 : color: "#C026D3"
matches=3
exit: 0
```

**SC-3 — `V87-SPEC-01`, all four citations re-read (aether §2, blazar §3/§4).**

```text
$ (Get-Content .opencode/agents/aether.md)[127..146]
128: ## 2 MISSION-PLAN anatomy
132: 1. **Objective.** One sentence naming the finished outcome.
133: 2. **Role sections.** One section per role, each holding `role`, the one
134:    concern it owns, its `owner` (a named roster specialist), its
135:    `inputs`, its `acceptance`, its `verification` (the exact command or
136:    check), its `artifact` (the file that must exist), and its
137:    `must-not-touch` list.
...
$ (Get-Content .opencode/agents/blazar.md)[276..304]
277: 2. Receive the AETHER MISSION-PLAN and validate it against the 10-field
279:    intake checklist below (the H7–H16 fields per `P2-R0.md`). Every role
279:    section the waves will derive must carry all ten.
305: | 10 | `State files` | Whether this node updates `AGENT.md` / `WORKFLOW.md`, or neither |
$ Select-String -Path .opencode/agents/aether.md,.opencode/agents/blazar.md -Pattern 'section_leader'
blazar.md:187: sections labeled `section_leader: blazar`, dispatches every node to a named
blazar.md:317: and only from role sections carrying the label `section_leader: blazar`.
exit: 0
```

Reading, not a claim: aether §2 defines no `section_leader` label and no per-role `State files` field; blazar §3 requires the ten fields and §4 requires the label. The conflict is on disk as dispatched.

**SC-4 — the F1 repair is on disk (shard B gate 9).**

```text
$ npx --no-install markdownlint-cli AGENT.md WORKFLOW.md
exit: 0

$ (Get-Content AGENT.md)[107]
... (`RELAY_*` all False + zero `COMMS_HUB*`/`GITHUB*` env names; capsule validator usage confirmed ...
$ (Get-Content AGENT.md)[202]
... `vs-*` admissions = 6 (installed greens only); registry yields zero ...
$ (Get-Content WORKFLOW.md)[75..76]
(blank line 76, list begins at 77)
exit: 0
```

**SC-5a — C-01: no agent file mentions `vs-`.**

```text
$ (Select-String -Path .opencode/agents/*.md -Pattern 'vs-').Count
0
exit: 0
```

**SC-5b — F-A1: both referenced agent files are absent and both commands still name them.**

```text
$ Test-Path .opencode/agents/technical-writer.md
False
$ Test-Path .opencode/agents/ai-generated-code-security-auditor.md
False
$ Select-String ... -Pattern 'agents/technical-writer\.md|agents/ai-generated-code-security-auditor\.md'
V-Technical-Writer.md:23
V-Technical-Writer.md:51
V-Ai-Generated-Code-Security-Auditor.md:25
V-Ai-Generated-Code-Security-Auditor.md:55
exit: 0
```

**SC-6 — C-08 reproduces exactly (generated mirror).**

```text
$ npx --no-install markdownlint-cli registry/VANTRILEX_CATALOG.md
registry/VANTRILEX_CATALOG.md:1604:82 error MD034/no-bare-urls ...
registry/VANTRILEX_CATALOG.md:1712:45 error MD034/no-bare-urls ...
registry/VANTRILEX_CATALOG.md:1855:111 error MD034/no-bare-urls ...
registry/VANTRILEX_CATALOG.md:1887:98 error MD034/no-bare-urls ...
registry/VANTRILEX_CATALOG.md:2014:105 error MD034/no-bare-urls ...
registry/VANTRILEX_CATALOG.md:2031:101 error MD034/no-bare-urls ...
registry/VANTRILEX_CATALOG.md:2117:96 error MD034/no-bare-urls ...
registry/VANTRILEX_CATALOG.md:2139:70 error MD034/no-bare-urls ...
registry/VANTRILEX_CATALOG.md:3026 error MD032/blanks-around-lists ...
exit: 1
```

### 6.6 Gates run on this artifact

**markdownlint (the must-run gate).**

```text
$ npx --no-install markdownlint-cli V87-DEFECTS.md
exit: 0
```

**Row counts (the counting gate).** Counted by command from this file, not transcribed. Every one of the 39 expected ids is asserted to occur exactly once as a row start:

```text
$ $ids = @('C-01','C-02','C-03','C-04','C-05','C-08','C-09','C-10','C-11','F-COLOR-01','F-COLOR-02',
    'F-COLOR-03','F-COLOR-04','F-COLOR-05','F-COLOR-06','F-COLOR-07','F-COLOR-08','F-A1','F-A2',
    'F-A5','F-A6','F-A7','D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','F1','F2','F3',
    'F4','F5','V87-SPEC-01')
$ foreach ($i in $ids) { (Select-String -Path V87-DEFECTS.md -Pattern ("^\| " + [regex]::Escape($i) + " \|")).Count }
expected_ids=39
row_start_matches=39
not_exactly_once=
exit: 0

$ (Select-String -Path V87-DEFECTS.md -Pattern '\| open \|').Count                        → 31
$ (Select-String -Path V87-DEFECTS.md -Pattern '\| known-parked \|').Count                 → 7
$ (Select-String -Path V87-DEFECTS.md -Pattern '\| fixed \(pending W3 re-lint\) \|').Count → 1
exit: 0
```

**Relative-link gate.** This artifact contains **0** relative Markdown links: every file reference is a code span or a citation, deliberately, so it cannot rot into a broken link. Counted, not assumed: `(Select-String -Path V87-DEFECTS.md -Pattern '\]\(').Count` → 0. The repo-wide link sweep belongs to the W3 verifier (and F2 above carries its last measured state).

**Index gate.** `docs/00-INDEX.md` is unchanged and no entry is owed: the index documents the `docs/` tree (22 numbered docs, all linked), and repo-root deliverables carry no entry today (`Select-String -Path docs/00-INDEX.md -Pattern 'P4-DEFERRAL-LEDGER|P5-LOOP-DOSSIER|V87-'` → no output, exit 1).

---

## 7. Method limits, drift and what this register does not do

- **Live tree.** The audits ran against a dirty working tree (`HEAD c7c762c` plus uncommitted lane work) while sibling wave-2 nodes were writing into it. Counts in this register are the sources' counts at their timestamps; the one count whose instability the source documented (F2's link sweep) is quoted with both readings.
- **Line drift, named not smoothed.** The color findings cite `AGENT.md:106` for the owner theme-color law; on disk today that law is at `AGENT.md:102` (verified by read). C-06 cites `AGENT.md:112/:207` and shard-B F1 cites `AGENT.md:108/:203` for the same two errors before and after the same edit; the register uses the shard-B numbers because the repair was verified there.
- **No repair, no re-run of the audit gates.** Beyond the six spot-check reads in §6.5 and the gate runs in §6.6, nothing was re-executed. No audit artifact, no state file, no generated surface and no git object was written; the one write is this file.
- **Landing note, not a row (it does not enter the 39).** Writing this file raised the repo's own docs-discipline guard: `[arsenal] docs-discipline-guard: WARN — V87-DEFECTS.md — allowed set: …` (mode `warn`, so non-blocking; the allow-list names `docs/00-` … `docs/27-`, the `docs/` subtrees and ten root files, and repo-root V87 artifacts are not among them). The same guard is expected on the sibling root deliverables (`V87-COLOR-AUDIT.md`), so this is a lane-level routing item for the Guide and the guard's owner — the `docsGuard` block in `.opencode/arsenal.json` — not a defect this register may grade.
- **What W3 owes.** (1) Re-lint `AGENT.md`, `WORKFLOW.md` and this file after the lane's remaining edits (F1's status is now `fixed (W3 re-lint PASS, 2026-10-18)`; the re-lint this bullet anticipated has passed). (2) Confirm whether `AGENT.md:252`'s "header refreshed" closes D5. (3) Re-count the 39 rows against the merge register if any source is amended before the package lands.
- **Out of scope by design.** `docs/spec/v87/**` content, the `kit/kit.lock` and `registry/catalog.json` registrations, the spec amendment itself (V87-SPEC-01 routes to the owner and the Guide), and every repair named in the owner column.

---

Ponytail: EXEMPT — pure prose consolidation, no code written and no `ponytail`-derived wording in the text; the only tools used were named ones (`markdownlint-cli`, `Select-String`, `git tag`, `Test-Path`), no helper script was authored, and the evidence is the six spot-check reads plus the two gate runs quoted in §6.
