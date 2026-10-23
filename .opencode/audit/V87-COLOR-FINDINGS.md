# V87 — c-colors: 27-Agent Color Compliance Findings

| Field | Value |
|---|---|
| Lane | V87-AETHER-EXECUTE (wave 0) |
| Node | `c-colors` |
| Owner | `vantrilex-verifier` |
| Date (UTC) | 2026-10-18T15:27:53Z |
| Commit under test | `c7c762c21f12e2dccba32611d990ad8a0f059b80` (`git rev-parse HEAD`) |
| Branch | `wt/vta-factory-p0` |
| Tree state | DIRTY — the `vantrilex-*` rename is uncommitted (8 old agent files deleted, 7 new stems untracked). This audit measures the **live working tree**, not `HEAD`. |
| Artifact | `.opencode/audit/V87-COLOR-FINDINGS.md` (only write) |
| Write scope | This file only. No agent, registry, `docs/spec/v87/**`, or state file was written. |

Honesty labels: **مثبت** = proven by a command quoted below; **~تقديري** = estimated group assignment where the agent's documented lane admits more than one reading. Every row cites `file:line`.

---

## 0. Headline — owner defect: CONFIRMED in measurement, REFUTED as "agents disobeying a live rule"

**The measured state is real (مثبت):**

- **27** agent files exist.
- **3** carry a `color:` key (`aether`, `blazar`, `pulsar`), and all three match the Part-2 reserved hexes exactly.
- **24** carry **no** `color:` key.
- **0** carry a `group:` or `category:` field.
- The registry does carry a `category` field, but with a **5-value taxonomy** (`reserved`, `code`, `external`, `kit`, `research`) that is **not** the Part-2 seven-group taxonomy, and whose hexes do **not** match the palette.
- **9 of 12** registry rows are `pending`, and all **9** point at theme files that do not exist on disk.

**But the cause is a specification conflict, not simple non-compliance (مثبت):**

- **12 of the 24** color-less subagent files *explicitly forbid* a `color` field: `vantrilex-agent-maker.md:35-37`, `:95`, `vantrilex-fixer.md:199`, `vantrilex-github.md:149`, `vantrilex-harness.md:299`, `vantrilex-kit-maintainer.md:69`, `vantrilex-librarian.md:275`, `vantrilex-releaser.md:267`, `vantrilex-reviewer.md:281`, `vantrilex-scribe.md:260`, `vantrilex-security-auditor.md:388`, `vantrilex-ui-designer.md:73-74`, `vantrilex-verifier.md:292-293`.
- **12** are silent: they carry neither a color nor a no-color rule.
- Meanwhile `docs/18-THEMES.md:95` states the achievable surface is "a distinct static `color` per agent plus manual `/themes` switching", and `AGENT.md:106` records the owner theme-color law: "every agent keeps its OWN theme, COLOR from palette by tag."

So the correct defect statement is: **the Part-2 color/group regime was never written to disk, and it contradicts the no-color rule that 12 subagent files already enforce.** The 24 absences are the expected output of the live rule, not 24 individual acts of disobedience.

---

## 1. Commands run (quoted, with exits)

### 1.1 `^color:` across the 27 agent files

```text
$ cmd --% /c findstr /b /n /c:"color:" .opencode\agents\*.md
.opencode\agents\aether.md:5:color: "#14B8A6"
.opencode\agents\blazar.md:5:color: "#4169E1"
.opencode\agents\pulsar.md:5:color: "#C026D3"
exit: 0
```

**مثبت** — 3 matches, 24 files with no match.

### 1.2 Group / category field in agent files

```text
$ cmd --% /c findstr /b /n /c:"group:" /c:"category:" .opencode\agents\*.md
(no output)
exit: 1
```

**مثبت** — zero group/category fields in any of the 27 agent files.

### 1.3 Group / category across `.opencode` (excluding `node_modules`)

```text
$ node -e "... /^\s*(group|category)\s*:/ over .opencode excluding node_modules ..."
NO MATCHES
exit: 1
```

**مثبت** — no `group:`/`category:` field anywhere in kit surfaces (agents, skills, commands, plugin), with `node_modules` excluded. The only `group:` hits in `.opencode` are inside `node_modules/effect` and `node_modules/kubernetes-types` (unrelated dependency source).

### 1.4 Palette occurrence count (case-insensitive, repo-wide, `node_modules`/`.git` excluded)

```text
$ node -e "... count each hex across .md,.json,.jsonl,.ts,.mjs,.sh,.css,.svg,.yml,.txt ..."
#3B82F6 => 9
#EC4899 => 2
#F59E0B => 7
#EF4444 => 7
#10B981 => 4
#8B5CF6 => 4
#22D3EE => 0
exit: 0
```

**مثبت** — `#22D3EE` occurs **0** times repo-wide. The other group hexes occur **only** in third-party design reference catalogs under `registry/design/*/DESIGN.md` (plus one command/registry use of `#8B5CF6`), never in a kit color-group definition.

### 1.5 Registry category → hex map

```text
$ node -e "... group atomic-switch rows by category ..."
reserved => #4169E1, #14b8a6, #C026D3
code => #3A86FF, #2F6BFF, #5B8DEF
external => #8B5CF6
kit => #E63E21, #FF4D2E, #C9331A, #A82A16
research => #22C55E
exit: 0
```

**مثبت** — five categories, none of which is one of the Part-2 seven groups.

### 1.6 Registry theme-file existence

```text
$ node -e "... fs.existsSync(row.themeFile) per row ..."
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

**مثبت** — every `pending` row is a dangling theme-file reference.

### 1.7 Counts

```text
$ Get-ChildItem .opencode/agents/*.md | Measure-Object
Count: 27
$ ... with ^color: ...  -> 3
$ ... without ^color: ... -> 24
```

---

## 2. The 27-row table

`current color` for `ABSENT` rows cites the frontmatter `mode:` line, the last routing key before a color would sit; there is no color key in lines 1–8 of those files. Group assignments marked `~تقديري` are defensible readings, not owner-ratified ones.

| # | stem | mode | current color (file:line) | verdict | proposed group | proposed hex | evidence |
|---:|---|---|---|---|---|---|---|
| 1 | `aether` | primary | `#14B8A6` (`aether.md:5`) | compliant | reserved | `#14B8A6` | `description:2` "Produces a verified MISSION-PLAN…"; title `:88` `# AETHER` |
| 2 | `blazar` | primary | `#4169E1` (`blazar.md:5`) | compliant | reserved | `#4169E1` | `description:2` "Builds the verified outcome from an AETHER MISSION-PLAN…"; title `:183` `# BLAZAR` |
| 3 | `pulsar` | primary | `#C026D3` (`pulsar.md:5`) | compliant | reserved | `#C026D3` | `description:2` "Tests plan assumptions through hypothesis-first investigation…"; title `:76` `# PULSAR` |
| 4 | `vantrilex-agent-maker` | subagent | ABSENT (`:4`) | missing-color | operate | `#8B5CF6` | `description:3` "forge one Arsenal-format agent before the next dispatch"; title `:14` |
| 5 | `vantrilex-architect` | subagent | ABSENT (`:4`) | missing-color | dev | `#3B82F6` | `description:3` "Software architecture specialist for system design, scalability… refactoring" |
| 6 | `vantrilex-code-reviewer` | subagent | ABSENT (`:4`) | missing-color | review | `#F59E0B` | `description:3` "Expert code review specialist… the standards review lane" |
| 7 | `vantrilex-fixer` | subagent | ABSENT (`:4`) | missing-color | dev | `#3B82F6` | `description:3` "Diagnoses and repairs defects… a minimal verified fix" |
| 8 | `vantrilex-github` | subagent | ABSENT (`:4`) | missing-color | operate | `#8B5CF6` | `description:3` "Executes GitHub issue, branch, and pull-request work" |
| 9 | `vantrilex-guide` | subagent | ABSENT (`:4`) | missing-color | review | `#F59E0B` | `description:3` "Owns the specification, the quality gates and phase-exit sign-off" |
| 10 | `vantrilex-harness` | subagent | ABSENT (`:4`) | missing-color | audit | `#EF4444` | `description:3` "adversarial probe that proves exploitability… before any finding counts" |
| 11 | `vantrilex-implementer` | subagent | ABSENT (`:4`) | missing-color | dev | `#3B82F6` | `description:3` "Implements one specified concern… using TDD micro-cycles" |
| 12 | `vantrilex-kit-maintainer` | subagent | ABSENT (`:4`) | missing-color | operate | `#8B5CF6` | `description:3` "Sole maintainer of the Vantrilex kit's agent and skill definitions, the kit lock…" |
| 13 | `vantrilex-leader` | subagent | ABSENT (`:4`) | missing-color | operate `~تقديري` | `#8B5CF6` | `description:3` "Routes, sequences and dispatches Vantrilex workstreams…" — a subagent router, not the reserved triumvirate |
| 14 | `vantrilex-librarian` | subagent | ABSENT (`:4`) | missing-color | docs `~تقديري` | `#10B981` | `description:3` "catalog knowledge needs version-qualified curation, drift reporting" |
| 15 | `vantrilex-puller` | subagent | ABSENT (`:4`) | missing-color | operate | `#8B5CF6` | `description:3` "Crucible intake puller… stages vetted batches" |
| 16 | `vantrilex-python` | subagent | ABSENT (`:4`) | missing-color | dev | `#3B82F6` | `description:3` "Builds type-safe production Python with ruff, uv, and pytest" |
| 17 | `vantrilex-red-team` | subagent | ABSENT (`:4`) | missing-color | review `~تقديري` | `#F59E0B` | `description:3` "Adversarial attacker… returns ranked findings… never fixes" |
| 18 | `vantrilex-releaser` | subagent | ABSENT (`:4`) | missing-color | operate | `#8B5CF6` | `description:3` "release needs terminal prep that stages a versioned handoff package" |
| 19 | `vantrilex-reviewer` | subagent | ABSENT (`:4`) | missing-color | review | `#F59E0B` | `description:3` "read-only kit-law review that returns JSONL findings" |
| 20 | `vantrilex-scout` | subagent | ABSENT (`:4`) | missing-color | exploration | `#22D3EE` | `description:3` "Read-only scout that surveys a target project into a fixed-schema brief" |
| 21 | `vantrilex-scribe` | subagent | ABSENT (`:4`) | missing-color | docs | `#10B981` | `description:3` "project documentation must be drafted, mirrored into Arabic, or verified" |
| 22 | `vantrilex-security-auditor` | subagent | ABSENT (`:4`) | missing-color | audit | `#EF4444` | `description:3` "static security audit with JSONL findings" |
| 23 | `vantrilex-typescript` | subagent | ABSENT (`:4`) | missing-color | dev | `#3B82F6` | `description:3` "Strict TypeScript specialist… verified worker" |
| 24 | `vantrilex-ui-designer` | subagent | ABSENT (`:4`) | missing-color | design | `#EC4899` | `description:3` "interface design, layout, component specs, or buildable HTML and CSS" |
| 25 | `vantrilex-uploader` | subagent | ABSENT (`:4`) | missing-color | operate | `#8B5CF6` | `description:3` "SEND-only Crucible intake uploader" |
| 26 | `vantrilex-ux-designer` | subagent | ABSENT (`:4`) | missing-color | design | `#EC4899` | `description:3` "Translates user evidence into information architecture, user flows" |
| 27 | `vantrilex-verifier` | subagent | ABSENT (`:4`) | missing-color | audit | `#EF4444` | `description:3` "Independent gate-runner… tri-state verdicts with an evidence ledger" |

### 2.1 Counts by verdict and proposed group (مثبت from the table)

| Verdict | Count |
|---|---:|
| compliant | 3 |
| missing-color | 24 |
| wrong-color | 0 |
| **total** | **27** |

| Proposed group | Hex | Count | Compliant now |
|---|---|---:|---:|
| reserved | leader hues | 3 | 3 |
| dev | `#3B82F6` | 5 | 0 |
| design | `#EC4899` | 2 | 0 |
| review | `#F59E0B` | 4 | 0 |
| audit | `#EF4444` | 3 | 0 |
| docs | `#10B981` | 2 | 0 |
| operate | `#8B5CF6` | 7 | 0 |
| exploration | `#22D3EE` | 1 | 0 |
| **total** | | **27** | **3** |

No row is `wrong-color`: no present value contradicts the palette. `aether` stores `#14B8A6` (exact), `blazar` `#4169E1` (exact), `pulsar` `#C026D3` (exact). Case-only differences appear in the registry/theme files (`#14b8a6`, `#4169e1`), not in agent frontmatter.

---

## 3. Group-field evidence

**Question:** does any agent file or registry carry a group/category field?

**Agent files — NO (مثبت).** The anchored grep over all 27 files returns zero lines:

```text
$ cmd --% /c findstr /b /n /c:"group:" /c:"category:" .opencode\agents\*.md
(no output)
exit: 1
```

**Kit surfaces — NO (مثبت).** Recursive scan of `.opencode` excluding `node_modules` returns no match (`exit: 1`). The only `group:` hits under `.opencode` are dependency source in `node_modules/effect` and `node_modules/kubernetes-types`.

**Registry — YES, but not the Part-2 taxonomy (مثبت).** `registry/themes/vantrilex-atomic-switch.json` carries a per-row `category` key. Values observed: `reserved` (3), `code` (3), `external` (1), `kit` (4), `research` (1). That is five values, not the seven Part-2 groups, and it is a JSON key (`"category":"code"`), not a line-anchored frontmatter field.

**Kit lock — NO (مثبت).** No `"group"`, `"category"`, or `"color"` key is present in `kit/kit.lock`.

---

## 4. Palette-conflict documentation

### 4.1 Part-2 palette (authoritative per dispatch brief)

| Group | Hex |
|---|---|
| dev | `#3B82F6` |
| design | `#EC4899` |
| review | `#F59E0B` |
| audit | `#EF4444` |
| docs | `#10B981` |
| operate | `#8B5CF6` |
| exploration | `#22D3EE` |
| blazar (reserved) | `#4169E1` |
| aether (reserved) | `#14B8A6` |
| pulsar (reserved) | `#C026D3` |

**On-disk status (مثبت):** no file in the repo states this palette as a group definition. The hexes occur only incidentally (third-party `registry/design/*/DESIGN.md`, brand assets, leader plumbing). The palette is supplied by the dispatch brief, not resolvable from a repository source.

### 4.2 `registry/themes/vantrilex-atomic-switch.json` — `category` values

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

- **C1 — cardinality.** Part-2 defines **7 groups + 3 reserved leader hues** (10 values). `brand/IDENTITY.md` defines **4 values** and says "there is no fifth colour" (`:45`, `:56`). A 10-hue agent palette cannot be derived from the brand palette without an owner ruling on the boundary between brand identity and agent UI accent.
- **C2 — taxonomy mismatch.** Part-2 has 7 groups. The registry has 5 categories (`reserved`, `code`, `external`, `kit`, `research`). There is no mapping row anywhere between the two.
- **C3 — hex mismatch by category.** Every category hex differs from its nearest Part-2 group:
  - `code` `#3A86FF` / `#2F6BFF` / `#5B8DEF` ≠ dev `#3B82F6`.
  - `research` `#22C55E` ≠ docs `#10B981`.
  - `kit` `#E63E21` / `#FF4D2E` / `#C9331A` / `#A82A16` ≠ any Part-2 group (no group is flame red).
  - `external` `#8B5CF6` **equals** operate `#8B5CF6` — the same hex is assigned to a different bucket, so a value match here is a collision, not compliance.
  - `reserved` `#4169E1` / `#14b8a6` / `#C026D3` **does** match the three leader hues (the only agreement).
- **C4 — exploration color is absent.** `#22D3EE` occurs **0** times repo-wide (command 1.4). The exploration group has no color anywhere, including `brand/IDENTITY.md`.
- **C5 — group hexes exist only in third-party catalogs.** `#3B82F6` (9), `#EC4899` (2), `#F59E0B` (7), `#EF4444` (7), `#10B981` (4) occur only in `registry/design/*/DESIGN.md` reference documents. `#8B5CF6` (4) occurs in `registry/design/cal/DESIGN.md` (2), `.opencode/commands/V-Ai-Generated-Code-Security-Auditor.md:41` (the `external` accent), and the atomic-switch row. None of these is a group definition.
- **C6 — the palette has no on-disk home.** Part-2 is not written in any repo file. `docs/18-THEMES.md` (the doc `vantrilex-ui-designer.md:73` points to for "per-agent mapping") lists only `blazar` plus three `RESERVED` agents that do not exist (`plan-replacement`, `project-prep`, `exploration`) and omits `aether` and `pulsar`, which *are* installed.
- **C7 — doctrine conflict (the cause of the 24 absences).** 12 subagent files forbid a `color` field while `docs/18-THEMES.md:95` and `AGENT.md:106` require a per-agent color. Until one side is amended, no verifier can treat "24 missing colors" as worker error.

---

## 5. Stale registry rows

All 12 rows were parsed from `registry/themes/vantrilex-atomic-switch.json`. **9 are `pending`; 3 are `installed` and correct** (`blazar`, `aether`, `pulsar`).

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

The `agent` key matches a live stem, but `themeId` and `themeFile` carry `vantrilex-vantrilex-*`. There is no `registry/themes/vantrilex-vantrilex-*.json` on disk (`registry/themes` holds exactly `vantrilex-aether.json`, `vantrilex-atomic-switch.json`, `vantrilex-blazar.json`, `vantrilex-pulsar.json`, `_index.md`).

### 5.3 Dangling theme files (all 9 pending)

Every pending row's `themeFile` is `ABSENT` (command 1.6, `missing theme files: 9/12`). This is a second, independent drift: even after the stem fix, the rows would point at files that do not exist.

---

## 6. Findings routed (dossier, no repair)

| ID | Finding | Evidence | Label | Routes to |
|---|---|---|---|---|
| F-COLOR-01 | 24/27 agents have no `color:`; 0/27 have a group field. | §1.1, §1.2, §2 | مثبت | Guide / change author |
| F-COLOR-02 | The Part-2 palette has no on-disk definition; 7-group taxonomy exists only in the brief. | §4.1, §4.4 C6 | مثبت | Guide |
| F-COLOR-03 | Registry `category` is a 5-value taxonomy with hexes that do not match the palette; `#8B5CF6` collides across `external` and `operate`. | §1.5, §4.2, §4.4 C3 | مثبت | Kit maintainer |
| F-COLOR-04 | `#22D3EE` (exploration) occurs 0 times repo-wide. | §1.4 | مثبت | Kit maintainer |
| F-COLOR-05 | 9/12 registry rows are pending and dangle on absent theme files; 6 have stale stems, 3 have double-prefix ids. | §5 | مثبت | Kit maintainer |
| F-COLOR-06 | A live doctrine conflict: 12 subagent files forbid `color`, while `docs/18-THEMES.md:95` and `AGENT.md:106` require per-agent color. | §0, §4.4 C7 | مثبت | Guide (owner ruling) |
| F-COLOR-07 | `docs/18-THEMES.md` per-agent mapping is stale: only `blazar` + 3 nonexistent `RESERVED` agents; `aether` and `pulsar` omitted. | §4.4 C6 | مثبت | Scribe / kit maintainer |
| F-COLOR-08 | 4 of 7 proposed group assignments are estimations (`leader`, `librarian`, `red-team`; and the `guide` review/audit boundary). | §2 rows 9, 13, 14, 17 | ~تقديري | Guide |

No file was repaired. This dossier reports; it does not edit.

---

## 7. Method limits

- The palette is a dispatch-brief input. No repo file defines it, so its authority cannot be re-derived from disk; it is taken as authoritative per the brief.
- Group assignment is a reading of each agent's `description:` line. Where the lane straddles two groups, the row is marked `~تقديري` rather than asserted.
- The working tree is dirty (rename in progress). The audit measures the 27 live files, not `HEAD`; re-running against a clean checkout of `c7c762c` would measure 8 old stems, not these 27.
- Occurrence counting excluded `.git` and `node_modules`; third-party design catalogs were counted and attributed explicitly.

---

Ponytail: not bound as a coder (no code authored; this is a read-only audit + one Markdown report) — evidence: `findstr` color grep exit 0 with 3 matches, group grep exit 1, palette count exit 0, registry map exit 0; zero agent/registry writes.
