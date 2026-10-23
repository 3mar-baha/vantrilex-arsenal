# V87 — Color Audit: Agent Color Compliance

| Field | Value |
|---|---|
| Lane | `V87-AETHER-EXECUTE` (wave 2) |
| Node | `d-color` |
| Owner | `vantrilex-scribe` |
| Date (UTC) | 2026-10-18 |
| Evidence set (read-only input) | `.opencode/audit/V87-COLOR-FINDINGS.md` (341 lines; node `c-colors`) |
| Branch | `wt/vta-factory-p0` |
| Commit under test | `c7c762c21f12e2dccba32611d990ad8a0f059b80` (`git rev-parse HEAD`) |
| Tree state | DIRTY — the `vantrilex-*` rename is uncommitted. This audit measures the **live working tree**, not `HEAD`. |
| Artifact | `V87-COLOR-AUDIT.md` (repo root) |
| Write status | Drafted, **not written** by this node. `vantrilex-scribe` holds no edit permission by design; the owning land node applies this file at repo root. |

Honesty labels: **مثبت** = proven by a command quoted in §7 (or in the findings set); **~تقديري** = estimated group assignment where the agent's documented lane admits more than one reading. Every row cites `file:line`.

**Language deviation (recorded, not silently dropped):** `AGENTS.md` hard rule 5 makes this repository English-only, so this node drafts **no Arabic mirror**; the lane-mandated honesty labels (`مثبت` / `~تقديري`) are retained verbatim because the acceptance names them (same deviation recorded at `V87-PLAN-ZERO-TO-87.md:20`).

This audit introduces no claim that is not in `.opencode/audit/V87-COLOR-FINDINGS.md`. Where a finding's line number has drifted on disk, §8 states the drift and the live line.

---

## 0. Verdict on the owner-observed defect

**CONFIRMED in measurement. REFUTED as disobedience.**

**The measured state is real (مثبت):**

- **27** agent files exist (`.opencode/agents/*.md`), re-counted live (§7 SC-1).
- **3** carry a `color:` key — `aether`, `blazar`, `pulsar` — and all three match the Part-2 reserved hexes exactly (§7 SC-2).
- **24** carry **no** `color:` key.
- **0 of 27** carry a `group:` or `category:` field.
- The registry does carry a `category` field, but with a **5-value taxonomy** (`reserved`, `code`, `external`, `kit`, `research`) that is **not** the Part-2 seven-group taxonomy, and whose hexes do **not** match the palette.
- **9 of 12** registry rows are `pending`, and all **9** point at theme files that do not exist on disk (`.opencode/audit/V87-COLOR-FINDINGS.md:104-124`, re-run live §7 SC-5).

**The cause is a live spec conflict, not simple non-compliance (مثبت):**

- **12 of the 24** color-less subagent files **explicitly forbid** a `color` field (§1.1, all lines re-quoted live in §7 SC-3).
- **12** are silent: they carry neither a color nor a no-color rule (§1.2).
- Meanwhile `docs/18-THEMES.md:95` requires "a distinct static `color` per agent", and `AGENT.md:102` records the owner theme-color law: "every agent keeps its OWN theme, COLOR from palette by tag" (§1.3).

So the defect statement is: **the Part-2 color/group regime was never written to disk, and it contradicts the no-color rule that 12 subagent files already enforce.** The 24 absences are the expected output of the live rule, not 24 individual acts of disobedience.

---

## 1. Root cause — the live spec conflict

### 1.1 The forbidding side — 12 agent files, quoted lines

All 13 citations re-read live from disk in this node's run (§7 SC-3).

| Forbidding file | Line | Verbatim |
|---|---|---|
| `vantrilex-agent-maker.md` | 35-37 | "this file; the session runs free models only. No `color` field / appears in side-agent files; the one-theme-per-agent rule resolves / through the per-agent theme file, never through frontmatter." |
| `vantrilex-agent-maker.md` | 95 | "`mode: subagent`, no `model` pin, no `color` field, then body" |
| `vantrilex-fixer.md` | 199 | "- Never carry a pinned model, a color field, or any routing identity." |
| `vantrilex-github.md` | 149 | "- Never carry a pinned routing identity or a color field. You run on" |
| `vantrilex-harness.md` | 299 | "- Never pin a model, never carry a color field, never become primary." |
| `vantrilex-kit-maintainer.md` | 69 | "- `mode: subagent` is mandatory on agents. No `color` field, no `model` pin." |
| `vantrilex-librarian.md` | 275 | "- Never carry a pinned routing identity or a color field. You run on" |
| `vantrilex-releaser.md` | 267 | "- Never pin a model, never carry a color field, never become primary." |
| `vantrilex-reviewer.md` | 281 | "- Never pin a model, never carry a color field, never become primary." |
| `vantrilex-scribe.md` | 260 | "- Never pin a model, never carry a color field, never touch" |
| `vantrilex-security-auditor.md` | 388 | "- Never pin a model, never carry a color field, never" |
| `vantrilex-ui-designer.md` | 73-74 | "in the per-agent mapping in `docs/18-THEMES.md` and in `registry/themes/`; / this agent file carries no color field and claims no theme name. Selection is" |
| `vantrilex-verifier.md` | 292-293 | "You return the report and stop. No `model:` pin appears in this file, no / `color` field, and English only throughout." |

### 1.2 The silent side — 12 files

Neither a color nor a no-color rule: `vantrilex-architect`, `vantrilex-code-reviewer`, `vantrilex-guide`, `vantrilex-implementer`, `vantrilex-leader`, `vantrilex-puller`, `vantrilex-python`, `vantrilex-red-team`, `vantrilex-scout`, `vantrilex-typescript`, `vantrilex-uploader`, `vantrilex-ux-designer`.

### 1.3 The requiring side — two documents, quoted lines

| Requiring file | Line | Verbatim |
|---|---|---|
| `docs/18-THEMES.md` | 95 | "\| Automatic per-agent theme switching \| WORKAROUND \| No agent-switch, session-start, or theme hook exists, and the public CLI plugin API does not register themes. The achievable surface is a distinct static `color` per agent plus manual `/themes` switching. \|" |
| `AGENT.md` | 102 | "…owner theme-color law — COLORS chosen by OWNER by TAG/role family (one color per family; e.g. programmers/developers → blue, GitHub specialists → purple); … every agent keeps its OWN theme, COLOR from palette by tag." |

**Ruling required (owner, via Guide).** While `AGENT.md:102` and `docs/18-THEMES.md:95` require a per-agent color and 12 subagent files forbid one, no verifier can classify the 24 absences as worker error. One side must be amended before any rename or color row lands. This is finding **F-COLOR-06**.

---

## 2. The 27-agent table

`current color` for `ABSENT` rows cites the frontmatter `mode:` line (line 4 for every subagent); there is no color key in lines 1-8 of those files. Rows marked `~تقديري` are defensible readings, not owner-ratified ones.

| # | agent | mode | current color | correct family assignment | evidence (file:line) |
|---:|---|---|---|---|---|
| 1 | `aether` | primary | `#14B8A6` | reserved · `#14B8A6` | `color` `aether.md:5`; `description:2` "Produces a verified MISSION-PLAN…"; title `:88` `# AETHER` |
| 2 | `blazar` | primary | `#4169E1` | reserved · `#4169E1` | `color` `blazar.md:5`; `description:2` "Builds the verified outcome from an AETHER MISSION-PLAN…"; title `:183` `# BLAZAR` |
| 3 | `pulsar` | primary | `#C026D3` | reserved · `#C026D3` | `color` `pulsar.md:5`; `description:2` "Tests plan assumptions through hypothesis-first investigation…"; title `:76` `# PULSAR` |
| 4 | `vantrilex-agent-maker` | subagent | ABSENT (`:4`) | operate · `#8B5CF6` | `description:3` "forge one Arsenal-format agent…"; forbids color `:35-37`, `:95` |
| 5 | `vantrilex-architect` | subagent | ABSENT (`:4`) | dev · `#3B82F6` | `description:3` "Software architecture specialist for system design, scalability… refactoring" |
| 6 | `vantrilex-code-reviewer` | subagent | ABSENT (`:4`) | review · `#F59E0B` | `description:3` "Expert code review specialist… the standards review lane" |
| 7 | `vantrilex-fixer` | subagent | ABSENT (`:4`) | dev · `#3B82F6` | `description:3` "Diagnoses and repairs defects… a minimal verified fix"; forbids color `:199` |
| 8 | `vantrilex-github` | subagent | ABSENT (`:4`) | operate · `#8B5CF6` | `description:3` "Executes GitHub issue, branch, and pull-request work"; forbids color `:149` |
| 9 | `vantrilex-guide` | subagent | ABSENT (`:4`) | review `~تقديري` · `#F59E0B` | `description:3` "Owns the specification, the quality gates and phase-exit sign-off"; review/audit boundary is the reading (F-COLOR-08) |
| 10 | `vantrilex-harness` | subagent | ABSENT (`:4`) | audit · `#EF4444` | `description:3` "adversarial probe that proves exploitability… before any finding counts"; forbids color `:299` |
| 11 | `vantrilex-implementer` | subagent | ABSENT (`:4`) | dev · `#3B82F6` | `description:3` "Implements one specified concern… using TDD micro-cycles" |
| 12 | `vantrilex-kit-maintainer` | subagent | ABSENT (`:4`) | operate · `#8B5CF6` | `description:3` "Sole maintainer of the Vantrilex kit's agent and skill definitions, the kit lock…"; forbids color `:69` |
| 13 | `vantrilex-leader` | subagent | ABSENT (`:4`) | operate `~تقديري` · `#8B5CF6` | `description:3` "Routes, sequences and dispatches Vantrilex workstreams…" — a subagent router, not the reserved triumvirate |
| 14 | `vantrilex-librarian` | subagent | ABSENT (`:4`) | docs `~تقديري` · `#10B981` | `description:3` "catalog knowledge needs version-qualified curation, drift reporting"; forbids color `:275` |
| 15 | `vantrilex-puller` | subagent | ABSENT (`:4`) | operate · `#8B5CF6` | `description:3` "Crucible intake puller… stages vetted batches" |
| 16 | `vantrilex-python` | subagent | ABSENT (`:4`) | dev · `#3B82F6` | `description:3` "Builds type-safe production Python with ruff, uv, and pytest" |
| 17 | `vantrilex-red-team` | subagent | ABSENT (`:4`) | review `~تقديري` · `#F59E0B` | `description:3` "Adversarial attacker… returns ranked findings… never fixes" |
| 18 | `vantrilex-releaser` | subagent | ABSENT (`:4`) | operate · `#8B5CF6` | `description:3` "release needs terminal prep that stages a versioned handoff package"; forbids color `:267` |
| 19 | `vantrilex-reviewer` | subagent | ABSENT (`:4`) | review · `#F59E0B` | `description:3` "read-only kit-law review that returns JSONL findings"; forbids color `:281` |
| 20 | `vantrilex-scout` | subagent | ABSENT (`:4`) | exploration · `#22D3EE` | `description:3` "Read-only scout that surveys a target project into a fixed-schema brief" |
| 21 | `vantrilex-scribe` | subagent | ABSENT (`:4`) | docs · `#10B981` | `description:3` "project documentation must be drafted, mirrored into Arabic, or verified"; forbids color `:260` |
| 22 | `vantrilex-security-auditor` | subagent | ABSENT (`:4`) | audit · `#EF4444` | `description:3` "static security audit with JSONL findings"; forbids color `:388` |
| 23 | `vantrilex-typescript` | subagent | ABSENT (`:4`) | dev · `#3B82F6` | `description:3` "Strict TypeScript specialist… verified worker" |
| 24 | `vantrilex-ui-designer` | subagent | ABSENT (`:4`) | design · `#EC4899` | `description:3` "interface design, layout, component specs, or buildable HTML and CSS"; forbids color `:73-74` |
| 25 | `vantrilex-uploader` | subagent | ABSENT (`:4`) | operate · `#8B5CF6` | `description:3` "SEND-only Crucible intake uploader" |
| 26 | `vantrilex-ux-designer` | subagent | ABSENT (`:4`) | design · `#EC4899` | `description:3` "Translates user evidence into information architecture, user flows" |
| 27 | `vantrilex-verifier` | subagent | ABSENT (`:4`) | audit · `#EF4444` | `description:3` "Independent gate-runner… tri-state verdicts with an evidence ledger"; forbids color `:292-293` |

### 2.1 Verdict counts (مثبت from the table)

| Verdict | Count |
|---|---:|
| compliant | 3 |
| missing-color | 24 |
| wrong-color | 0 |
| **total** | **27** |

No row is `wrong-color`: no present value contradicts the palette. `aether` stores `#14B8A6` (exact), `blazar` `#4169E1` (exact), `pulsar` `#C026D3` (exact). Case-only differences appear in the registry/theme files (`#14b8a6`, `#4169e1`), not in agent frontmatter.

### 2.2 The four estimation proposals, kept labeled

| Row | Agent | Proposed | Why the reading is not owner-ratified |
|---:|---|---|---|
| 9 | `vantrilex-guide` | review `~تقديري` · `#F59E0B` | The lane straddles review (gate verdicts) and audit (phase-exit ruling); F-COLOR-08 names this boundary as the fourth estimation. |
| 13 | `vantrilex-leader` | operate `~تقديري` · `#8B5CF6` | A subagent router; could be read as reserved-adjacent, but it is not one of the three primary leaders. |
| 14 | `vantrilex-librarian` | docs `~تقديري` · `#10B981` | Catalog curation reads as docs; could be read as operate (registry maintenance). |
| 17 | `vantrilex-red-team` | review `~تقديري` · `#F59E0B` | Adversarial attack reads as review; could be read as audit (proof-of-exploit posture). |

---

## 3. Group assignment summary

| Group | Hex | Count | Compliant now |
|---|---|---:|---:|
| reserved | leader hues `#14B8A6` / `#4169E1` / `#C026D3` | 3 | 3 |
| dev | `#3B82F6` | 5 | 0 |
| design | `#EC4899` | 2 | 0 |
| review | `#F59E0B` | 4 | 0 |
| audit | `#EF4444` | 3 | 0 |
| docs | `#10B981` | 2 | 0 |
| operate | `#8B5CF6` | 7 | 0 |
| exploration | `#22D3EE` | 1 | 0 |
| **total** | | **27** | **3** |

Counts sum to 27. Members: reserved `aether`·`blazar`·`pulsar`; dev `architect`·`fixer`·`implementer`·`python`·`typescript`; design `ui-designer`·`ux-designer`; review `code-reviewer`·`guide`·`red-team`·`reviewer`; audit `harness`·`security-auditor`·`verifier`; docs `librarian`·`scribe`; operate `agent-maker`·`github`·`kit-maintainer`·`leader`·`puller`·`releaser`·`uploader`; exploration `scout`.

---

## 4. Registry / brand conflict

### 4.1 The three taxonomies side by side

| Source | Cardinality | Values |
|---|---|---|
| Part-2 palette (dispatch brief, authoritative per brief) | 7 groups + 3 reserved = 10 hexes | dev `#3B82F6` · design `#EC4899` · review `#F59E0B` · audit `#EF4444` · docs `#10B981` · operate `#8B5CF6` · exploration `#22D3EE` · blazar `#4169E1` · aether `#14B8A6` · pulsar `#C026D3` |
| `registry/themes/vantrilex-atomic-switch.json` (`category` key) | 5 | `reserved`, `code`, `external`, `kit`, `research` |
| `brand/IDENTITY.md:45-52` | 4 | `#4169E1` · `#ADD8E6` · `#FFFFFF` · `#000000` |

### 4.2 Registry `category` → hex map (from `registry/themes/vantrilex-atomic-switch.json`)

```text
reserved => #4169E1, #14b8a6, #C026D3
code     => #3A86FF, #2F6BFF, #5B8DEF
external => #8B5CF6
kit      => #E63E21, #FF4D2E, #C9331A, #A82A16
research => #22C55E
```

### 4.3 `brand/IDENTITY.md` palette lines (verbatim)

```text
:45  Exactly four values. There is no fifth colour in this identity.
:49  | Royal blue | `#4169E1` | The primary. …
:50  | Light blue | `#ADD8E6` | The secondary. …
:51  | White      | `#FFFFFF` | The ground and the reverse. …
:52  | Black      | `#000000` | Type, the bench line under the gavel, …
:56  - **No fifth colour.** Not a grey, not a tint, not a gradient stop. …
```

### 4.4 Conflicts, stated explicitly

- **C1 — cardinality.** Part-2 defines 7 groups + 3 reserved leader hues (10 values). `brand/IDENTITY.md` defines 4 values and says "there is no fifth colour" (`:45`, `:56`). A 10-hue agent palette cannot be derived from the brand palette without an owner ruling on the boundary between brand identity and agent UI accent.
- **C2 — taxonomy mismatch.** Part-2 has 7 groups; the registry has 5 categories (`reserved`, `code`, `external`, `kit`, `research`). There is no mapping row anywhere between the two.
- **C3 — hex mismatch by category.** Every category hex differs from its nearest Part-2 group:
  - `code` `#3A86FF` / `#2F6BFF` / `#5B8DEF` ≠ dev `#3B82F6`.
  - `research` `#22C55E` ≠ docs `#10B981`.
  - `kit` `#E63E21` / `#FF4D2E` / `#C9331A` / `#A82A16` ≠ any Part-2 group (no group is flame red).
  - `external` `#8B5CF6` **equals** operate `#8B5CF6` — the same hex is assigned to a different bucket, so a value match here is a collision, not compliance.
  - `reserved` `#4169E1` / `#14b8a6` / `#C026D3` **does** match the three leader hues (the only agreement).
- **C4 — exploration color is absent.** `#22D3EE` occurs **0** times in the substantive corpus (re-counted live §7 SC-4). The exploration group has no color anywhere, including `brand/IDENTITY.md`.
- **C5 — group hexes exist only in third-party catalogs.** Re-attributed live per file (§7 SC-4): `#3B82F6` (9) `registry/design/binance|cal|clickhouse|lovable|minimax/DESIGN.md`; `#EC4899` (2) `registry/design/cal/DESIGN.md`; `#F59E0B` (7) `registry/design/bmw|cal|clay|clickhouse/DESIGN.md`; `#EF4444` (7) `registry/design/cal|clay|clickhouse/DESIGN.md`; `#10B981` (4) `registry/design/cal|voltagent/DESIGN.md`; `#8B5CF6` (4) `registry/design/cal/DESIGN.md` (2) + `.opencode/commands/V-Ai-Generated-Code-Security-Auditor.md:41` (the `external` accent) + the atomic-switch row. None of these is a group definition.
- **C6 — the palette has no on-disk home.** Part-2 is not written in any repo file; `docs/spec/v87/**` (7 files: `instagram-v8.7-context.md`, `SYNTHESIS-v8.7.md`, `worker-1..5-*.md`) carries no palette or group line (checked live, zero matches). `docs/18-THEMES.md` (the doc `vantrilex-ui-designer.md:73` points to for "per-agent mapping") lists only `blazar` plus three `RESERVED` agents that do not exist (`plan-replacement`, `project-prep`, `exploration` — `docs/18-THEMES.md:23-26`) and omits `aether` and `pulsar`, which *are* installed and *do* carry colors.
- **C7 — doctrine conflict (the cause of the 24 absences).** 12 subagent files forbid a `color` field while `docs/18-THEMES.md:95` and `AGENT.md:102` require a per-agent color. Until one side is amended, no verifier can treat "24 missing colors" as worker error. Full quotes in §1.

---

## 5. Stale registry rows

All 12 rows were parsed from `registry/themes/vantrilex-atomic-switch.json`. **9 are `pending`; 3 are `installed` and correct** (`blazar`, `aether`, `pulsar`). Live re-run of the existence check in §7 SC-5 (`missing theme files: 9/12`).

### 5.1 Pending rows whose `agent` id does not match a live file stem (6)

Live stems are the 27 filenames in `.opencode/agents/`. Quoted verbatim:

```json
{"accentHex":"#3A86FF","agent":"architect","category":"code","status":"pending","themeFile":"registry/themes/vantrilex-architect.json","themeId":"vantrilex-architect"}
{"accentHex":"#2F6BFF","agent":"code-reviewer","category":"code","status":"pending","themeFile":"registry/themes/vantrilex-code-reviewer.json","themeId":"vantrilex-code-reviewer"}
{"accentHex":"#8B5CF6","agent":"ai-generated-code-security-auditor","category":"external","status":"pending","themeFile":"registry/themes/vantrilex-ai-generated-code-security-auditor.json","themeId":"vantrilex-ai-generated-code-security-auditor"}
{"accentHex":"#E63E21","agent":"kit-maintainer","category":"kit","status":"pending","themeFile":"registry/themes/vantrilex-kit-maintainer.json","themeId":"vantrilex-kit-maintainer"}
{"accentHex":"#FF4D2E","agent":"red-team","category":"kit","status":"pending","themeFile":"registry/themes/vantrilex-red-team.json","themeId":"vantrilex-red-team"}
{"accentHex":"#22C55E","agent":"technical-writer","category":"research","status":"pending","themeFile":"registry/themes/vantrilex-technical-writer.json","themeId":"vantrilex-technical-writer"}
```

| Stale `agent` | Live stem that should match | Defect |
|---|---|---|
| `architect` | `vantrilex-architect` | pre-rename stem |
| `code-reviewer` | `vantrilex-code-reviewer` | pre-rename stem |
| `ai-generated-code-security-auditor` | `vantrilex-security-auditor` | pre-rename **and** renamed role |
| `kit-maintainer` | `vantrilex-kit-maintainer` | pre-rename stem |
| `red-team` | `vantrilex-red-team` | pre-rename stem |
| `technical-writer` | *(none)* — nearest live role is `vantrilex-scribe` | no live file at all |

### 5.2 Pending rows with matching `agent` but double-prefix ids (3)

```json
{"accentHex":"#C9331A","agent":"vantrilex-guide","category":"kit","status":"pending","themeFile":"registry/themes/vantrilex-vantrilex-guide.json","themeId":"vantrilex-vantrilex-guide"}
{"accentHex":"#5B8DEF","agent":"vantrilex-implementer","category":"code","status":"pending","themeFile":"registry/themes/vantrilex-vantrilex-implementer.json","themeId":"vantrilex-vantrilex-implementer"}
{"accentHex":"#A82A16","agent":"vantrilex-leader","category":"kit","status":"pending","themeFile":"registry/themes/vantrilex-vantrilex-leader.json","themeId":"vantrilex-vantrilex-leader"}
```

The `agent` key matches a live stem, but `themeId` and `themeFile` carry `vantrilex-vantrilex-*`. There is no `registry/themes/vantrilex-vantrilex-*.json` on disk; `registry/themes` holds exactly `vantrilex-aether.json`, `vantrilex-atomic-switch.json`, `vantrilex-blazar.json`, `vantrilex-pulsar.json`, `_index.md` (listed live).

### 5.3 Dangling theme files (all 9 pending)

Every pending row's `themeFile` is `ABSENT`. This is a second, independent drift: even after the stem fix, the rows would point at files that do not exist.

---

## 6. Recommended fixes, severity-ranked

Owners are suggestions; the Guide sequences them.

| # | Severity | Fix | Owner suggestion | Evidence |
|---:|---|---|---|---|
| R1 | **P0 — blocker** | Owner ruling on the doctrine conflict: either amend the 12 forbidding agent files or amend the two requiring sources (`AGENT.md:102`, `docs/18-THEMES.md:95`). Nothing else can land colour rows coherently until this is decided. | Guide (owner ruling), then kit maintainer | F-COLOR-06; §1.1-§1.3 |
| R2 | **P0** | Give the Part-2 palette an on-disk home as a group definition. No repo file states it today; `registry/themes/vantrilex-atomic-switch.json` carries a different 5-value `categories` block, and `docs/spec/v87/**` carries none. | Kit maintainer | F-COLOR-02; §4.4 C6 |
| R3 | **P1** | Reconcile the registry taxonomy: map or replace the 5 `category` values with the 7 groups, and fix the hex mismatches. Resolve the `#8B5CF6` collision where `external` and operate share one hex. | Kit maintainer | F-COLOR-03; §4.2, §4.4 C2/C3 |
| R4 | **P1** | Repair the stale registry rows: 6 pre-rename stems (incl. `technical-writer` → no live file; nearest role `vantrilex-scribe`), 3 double-prefix `themeId`/`themeFile`, and 9 dangling `themeFile` paths. | Kit maintainer | F-COLOR-05; §5.1-§5.3 |
| R5 | **P1** | Supply the exploration color: `#22D3EE` occurs 0 times in the substantive corpus, so the exploration group has no rendering anywhere — neither in the registry nor in `brand/IDENTITY.md`. | Kit maintainer | F-COLOR-04; §4.4 C4 |
| R6 | **P2** | Refresh `docs/18-THEMES.md:23-26`: the mapping table lists only `blazar` plus three `RESERVED` agents whose definitions do not exist, and omits the installed `aether` and `pulsar`. | Scribe / kit maintainer | F-COLOR-07; §4.4 C6 |
| R7 | **P2** | Owner ruling on the brand boundary: `brand/IDENTITY.md:45,:56` states four values and "no fifth colour" while the agent regime needs 10. State explicitly whether agent UI accent sits outside brand identity. | Owner / Guide | §4.4 C1 |
| R8 | **P3** | After R1 lands, decide whether agents carry a `group:` field (0 of 27 do today) or whether the group lives only in the registry. Carrying it in both needs one writer. | Guide / kit maintainer | F-COLOR-01; §0, §2 |
| R9 | **P3** | Register this audit in `docs/00-INDEX.md` if the index is to cover root-level deliverables; today it covers `docs/` only, and root artifacts (`P4-DEFERRAL-LEDGER.md`, `P5-LOOP-DOSSIER.md`) are not listed. | Scribe | §8 |

---

## 7. Live spot-checks re-run in this node

Every quote below is this node's own re-measurement on the live working tree, with its exit code. The findings set's numbers reproduce exactly where the count excludes the audit dossier itself and the lane state files (§7 SC-4 note).

### SC-1 — agent file count: 27

```text
$ (Get-ChildItem .opencode\agents\*.md).Count
27
exit: 0
```

### SC-2 — frontmatter `color:` lines: 3 matches

```text
$ Select-String -Path .opencode\agents\*.md -Pattern '^color:'
aether.md:5:color: "#14B8A6"
blazar.md:5:color: "#4169E1"
pulsar.md:5:color: "#C026D3"
matches=3
exit: 0
```

### SC-3 — one forbidding-file line, and all 13 citations re-read

```text
$ (Get-Content .opencode\agents\vantrilex-scribe.md)[259]
- Never pin a model, never carry a color field, never touch

$ (Get-Content .opencode\agents\vantrilex-ui-designer.md)[72..73]
73: in the per-agent mapping in `docs/18-THEMES.md` and in `registry/themes/`;
74: this agent file carries no color field and claims no theme name. Selection is

$ (Get-Content .opencode\agents\vantrilex-verifier.md)[291..292]
292: You return the report and stop. No `model:` pin appears in this file, no
293: `color` field, and English only throughout.
exit: 0
```

All 13 citations in the findings set re-read line-exact, plus `vantrilex-agent-maker.md:35-37`, `:54`, `:95`, `:153`, `:187`; `vantrilex-fixer.md:199`; `vantrilex-github.md:149`; `vantrilex-harness.md:299`; `vantrilex-kit-maintainer.md:69`; `vantrilex-librarian.md:275`; `vantrilex-releaser.md:267`; `vantrilex-reviewer.md:281`; `vantrilex-security-auditor.md:388`. A full lowercase-insensitive `color` sweep over `.opencode/agents/*.md` returns **23 lines across 15 files** — the 3 `color:` frontmatter keys plus 20 prose mentions, all 20 inside the 12 forbidding files (the `ui-designer` file contributes 4 prose mentions, `agent-maker` 5).

### SC-4 — palette re-count, with per-file attribution

```text
$ node <per-file hex attribution over .md,.json,.jsonl,.ts,.mjs,.sh,.css,.svg,.yml,.txt; node_modules/.git excluded>
#3B82F6  all=19  excl-audit+state=9
#EC4899  all=8   excl-audit+state=2
#F59E0B  all=15  excl-audit+state=7
#EF4444  all=14  excl-audit+state=7
#10B981  all=11  excl-audit+state=4
#8B5CF6  all=22  excl-audit+state=4
#22D3EE  all=8   excl-audit+state=0
    #22D3EE files(all): .opencode/audit/V87-COLOR-FINDINGS.md x7, AGENT.md x1
    #22D3EE files(excl): NONE
exit: 0
```

`excl-audit+state` reproduces the findings set's command 1.4 column exactly (9 / 2 / 7 / 7 / 4 / 4 / 0), and its per-file table reproduces C5 exactly. The `all` column is larger only because the findings document (written after that count) and the lane state file `AGENT.md:254` now quote the same hexes. **This is a count drift, not a contradiction:** the exploration hex still has no color-group home.

### SC-5 — registry theme-file existence: 9/12 missing

```text
$ node -e "<fs.existsSync(row.themeFile) per row of registry/themes/vantrilex-atomic-switch.json>"
EXISTS installed | blazar | registry/themes/vantrilex-blazar.json
EXISTS installed | aether | registry/themes/vantrilex-aether.json
EXISTS installed | pulsar | registry/themes/vantrilex-pulsar.json
ABSENT pending | architect | registry/themes/vantrilex-architect.json
ABSENT pending | code-reviewer | registry/themes/vantrilex-code-reviewer.json
ABSENT pending | ai-generated-code-security-auditor | registry/themes/vantrilex-ai-generated-code-security-auditor.json
ABSENT pending | kit-maintainer | registry/themes/vantrilex-kit-maintainer.json
ABSENT pending | red-team | registry/themes/vantrilex-red-team.json
ABSENT pending | technical-writer | registry/themes/vantrilex-technical-writer.json
ABSENT pending | vantrilex-guide | registry/themes/vantrilex-vantrilex-guide.json
ABSENT pending | vantrilex-implementer | registry/themes/vantrilex-vantrilex-implementer.json
ABSENT pending | vantrilex-leader | registry/themes/vantrilex-vantrilex-leader.json
missing theme files: 9/12
exit: 0
```

### SC-6 — `docs/spec/v87/**` carries no palette line

```text
$ Select-String -Path docs\spec\v87\* -Pattern '#3B82F6|#EC4899|#F59E0B|#EF4444|#10B981|#8B5CF6|#22D3EE|group'
(no output)
exit: 1
```

### SC-7 — markdownlint on this artifact

Run by the authoring node on a temp copy outside the repo (the repo-root path is the land node's write). Verbatim result and exit code are carried in the returning report; the lint vehicle is not the deliverable.

---

## 8. Method limits and drift notes

- **The palette is a dispatch-brief input.** No repo file defines it, so its authority cannot be re-derived from disk; it is taken as authoritative per the brief (F-COLOR-02).
- **Group assignment is a reading of each agent's `description:` line.** Where the lane straddles two groups, the row is marked `~تقديري` rather than asserted. Four readings are estimations: `guide`, `leader`, `librarian`, `red-team` (`librarian` and `leader` do not log a writing agent; see below).
- **The working tree is dirty (rename in progress).** This audit measures the 27 live files, not `HEAD`; re-running against a clean checkout of `c7c762c` would measure 8 old stems, not these 27.
- **Occurrence counting excluded `.git` and `node_modules`;** third-party design catalogs were counted and attributed explicitly.
- **Line drift, stated honestly.** The findings set cites `AGENT.md:106` for the owner theme-color law; on disk today that line is `AGENT.md:102` (§7 evidence). The findings were measured earlier in the same dirty tree, so the citation has drifted by four lines; the quoted text is identical. Every other citation in the findings set re-read line-exact. This audit carries the live line number and names the drift rather than silently copying either one.
- **The findings set's command 1.4 no longer reproduces verbatim** for the same reason: the dossier and the lane state file now quote the palette hexes. SC-4 gives both the raw count and the comparable count, and marks which is which.
- **Count reconciliation is arithmetic, not a claim:** `3 + 5 + 2 + 4 + 3 + 2 + 7 + 1 = 27`.

---

Ponytail: FULL on code-writing nodes only — one helper script authored (`v87-count.mjs`, temp directory outside the repo, per-file hex attribution no named tool covers; discarded, never landed), so the code-writing posture binds and its guardrails are quoted verbatim from `docs/99-archive/RESEARCH-03-r0b-ponytail.md:96-97`:

- FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."
- CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

Evidence: helper is 30 lines, zero dependencies, Node stdlib only, no abstraction (CEILING held); every count it produced was cross-checked against a named-tool re-measurement (`Select-String`, `Get-Content`) and the two agree (FLOOR held); zero agent, registry, or state-file writes — prose and the temp lint vehicle only.
