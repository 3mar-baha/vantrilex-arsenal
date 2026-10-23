# V87 COMPAT FINDINGS — 4C compatibility audit

- Lane: `V87-AETHER-EXECUTE`
- Node: `c-compat` (wave 0, depends_on none)
- Owner: `vantrilex-verifier`
- Concern: vs-* skills interop, model-routing implementation state, triumvirate
  integrity, lock/registry/catalog agreement.
- Classification: DIRECTED node. Scenario 2 does not apply; executed as briefed.
- Written: 2026-10-18T15:27Z (UTC)

## Tree under test and fidelity note

`git rev-parse HEAD` → `c7c762c21f12e2dccba32611d990ad8a0f059b80`
(`2026-10-18 17:33:41 +0300`).

The working tree is **not** clean relative to that commit: `git status --porcelain`
reported 56 entries (18 modified, 7 deleted, 31 untracked). The battery therefore ran on
the tree `c7c762c` **plus uncommitted lane edits** — chiefly `.opencode/agents/*.md`,
`.opencode/commands/V-*.md`, `AGENT.md`, `WORKFLOW.md`, `kit/kit.lock`,
`kit/kit.lock.schema.json`, and `registry/VANTRILEX_CATALOG.md`. Verdicts below describe
that tree, not the bare commit. No commit was named in the dispatch, so
`git rev-parse HEAD` was recorded per protocol.

Merge base for delta: `git merge-base HEAD main` →
`772c693a5aa8e8ab4045d69ba46c745cef19bc85`.

## Headline

**FAIL — 8 PASS, 1 FAIL, 0 SKIPPED.** Nine-gate battery, gates 1–8 green, gate 9
(`markdownlint` over changed Markdown) exit 1 with 12 errors. No gate was skipped, so the
headline is FAIL rather than PASS WITH SKIPS.

## Delta headline

`new failures vs 772c693: markdownlint — AGENT.md:112 (MD037), AGENT.md:207 (MD037),
WORKFLOW.md:76 (MD032)`

`pre-existing (also failing at base): registry/VANTRILEX_CATALOG.md — 8×MD034 bare URL,
1×MD032 (generated file; identical content present at HEAD)`

Delta was **not** run as a clean checkout at the base commit: this node holds no write
permission and creating a checkout would write files. New-vs-pre-existing was proven
instead by testing the exact offending content for presence at HEAD (quoted in C-06 to
C-08), which is weaker than a base-commit run and is labelled accordingly
(~تقديري for the boundary, مثبت for the content test).

## Verdict ledger

| Gate | Command | Commit | Exit | Time (UTC) | Totals (verbatim) | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 1 — verify-kit | `node scripts/verify-kit.mjs` | `c7c762c21f12e2dccba32611d990ad8a0f059b80` | 0 | 2026-10-18T15:25:23Z | `VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).` | PASS |
| 2 — verify-registry | `node scripts/verify-registry.mjs` | `c7c762c21f12e2dccba32611d990ad8a0f059b80` | 0 | 2026-10-18T15:25:42Z | `totals: 7 checks — 7 passed, 0 failed, 0 skipped` · `VERDICT: PASS — all 7 checks ran and passed. The registry is clean.` | PASS |
| 3 — verify-skills | `node scripts/verify-skills.mjs` | `c7c762c21f12e2dccba32611d990ad8a0f059b80` | 0 | 2026-10-18T15:25:43Z | `totals: 10 checks — 10 passed, 0 failed, 0 skipped` | PASS |
| 4 — catalog mirror | `node scripts/generate-catalog-json.mjs --check` | `c7c762c21f12e2dccba32611d990ad8a0f059b80` | 0 | 2026-10-18T15:25:43Z | 17 `check: … — ok` lines, 1 declared `skip:` (`registry/formatting/_index.md`); no totals line emitted | PASS |
| 5 — TypeScript | `node_modules/.bin/tsc --noEmit` | `c7c762c21f12e2dccba32611d990ad8a0f059b80` | 0 | 2026-10-18T15:25:43Z | no output; exit 0 (no totals line emitted) | PASS |
| 6 — shell | `bash -n scripts/*.sh` + `shellcheck -S warning scripts/*.sh` | `c7c762c21f12e2dccba32611d990ad8a0f059b80` | 0 | 2026-10-18T15:25:44Z | 8 files, `failures=0` (my count; shellcheck emits no totals line) | PASS |
| 7 — node parse | `node --check scripts/*.mjs` | `c7c762c21f12e2dccba32611d990ad8a0f059b80` | 0 | 2026-10-18T15:25:53Z | `failures=0 of 7` (my count; `node --check` emits no totals line) | PASS |
| 8 — probe battery | probes P1–P4, quoted in Check 1–4 | `c7c762c21f12e2dccba32611d990ad8a0f059b80` | 0, 0, 0, 0 | 2026-10-18T15:26:31Z (P1, P3); 2026-10-18T15:26:23Z (P2); 2026-10-18T15:26:24Z (P4) | `probe-1 … failures: 0` · `probe-2 … model pins: 0` · `probe-3 … failures: 0` · `probe-4 agreement mismatches: 0` | PASS |
| 9 — markdownlint | `npx --yes markdownlint-cli` over the 11 existing changed files: `.opencode/agents/{vantrilex-guide,vantrilex-implementer,vantrilex-leader,vantrilex-verifier}.md`, `.opencode/commands/{V-Architect,V-Code-Reviewer,V-Kit-Maintainer,V-Red-Team}.md`, `AGENT.md`, `WORKFLOW.md`, `registry/VANTRILEX_CATALOG.md` | `c7c762c21f12e2dccba32611d990ad8a0f059b80` | 1 | 2026-10-18T15:25:53Z | 12 `error` lines (8×MD034, 2×MD037, 2×MD032); no totals line emitted | FAIL |

Gate 1 line detail quoted: `lockfile-validates PASS 157 components and 9 pending entries
validate against kit.lock.schema.json`. Gate 3 line detail quoted: `body-headings PASS 37
skills, all seven headings present in order exactly once`.

## Check 1 — VS-* interop

Command and result for the eight required skills (probe P1):

```text
probe-1 vs-* skills: 8 checked, failures: 0
exit=0
```

Per-skill evidence — frontmatter `name:` quoted, folder equality, body shape:

| Skill folder | `name:` value (verbatim) | `name` == folder | `##` headings |
| --- | --- | --- | --- |
| `vs-circuit-breaker-guard` | `vs-circuit-breaker-guard` | yes | 7 required, in order |
| `vs-github-release-packager` | `vs-github-release-packager` | yes | 7 required, in order |
| `vs-ponytail` | `vs-ponytail` | yes | 7 required, in order |
| `vs-preflight-system-doctor` | `vs-preflight-system-doctor` | yes | 7 required, in order |
| `vs-session-context-primer` | `vs-session-context-primer` | yes | 7 required, in order |
| `vs-smithery` | `vs-smithery` | yes | 7 required, in order |
| `vs-vantrilex-vanguard` | `vs-vantrilex-vanguard` | yes | 7 required, in order |
| `vs-vantrilex-workflow-forge` | `vs-vantrilex-workflow-forge` | yes | 7 required + 2 documented extras (`## Part A — Standing methodology`, `## Part B — Current-task workflow`) |

The seven required headings, quoted from the gate and confirmed by direct read:
`## Purpose`, `## When to Use`, `## Do NOT use`, `## Inputs`, `## Procedure`,
`## Outputs`, `## Failure Modes`. The workflow-forge extras are documented in
`.opencode/audit/V-FULL-AUDIT.md:228-229` ("5 files carrying documented extras … the
extras are documented, not violations"), so they are not a finding.

Cross-references, resolved by stem (each stem maps to an existing folder):

| Skill | References (stems found in body) | Resolve |
| --- | --- | --- |
| `vs-circuit-breaker-guard` | `circuit-breaker-guard` (self) | yes |
| `vs-github-release-packager` | `github-release-packager` (self) | yes |
| `vs-ponytail` | `ponytail` | yes |
| `vs-preflight-system-doctor` | `preflight-system-doctor` (self), `session-context-primer` | yes |
| `vs-session-context-primer` | `circuit-breaker-guard`, `preflight-system-doctor`, `session-context-primer` (self) | yes |
| `vs-smithery` | `smithery` (self) | yes |
| `vs-vantrilex-vanguard` | `ponytail`, `preflight-system-doctor`, `smithery`, `vantrilex-vanguard` (self), `vantrilex-workflow-forge` | yes |
| `vs-vantrilex-workflow-forge` | `circuit-breaker-guard`, `session-context-primer`, `vantrilex-vanguard`, `vantrilex-workflow-forge` (self) | yes |

Every stem resolves, but resolution is **ambiguous**: 7 of the 8 stems name two skills
(`X` and `vs-X` both exist on disk). Only `smithery` has no unprefixed twin. This is
C-02 and C-03 below.

Skill-format gate, quoted:

```text
skill-discovery          PASS     37 skill folders, every name lowercase-hyphenated and every folder holds exactly SKILL.md
frontmatter-name         PASS     37 skills, every name matches its folder and the hyphenated shape
body-headings            PASS     37 skills, all seven headings present in order exactly once
totals: 10 checks — 10 passed, 0 failed, 0 skipped
```

Exit 0. Expected 10/10, observed 10/10 — مثبت.

## Check 2 — Routing state

Config existence, verbatim PowerShell:

```text
Test-Path .opencode/opencode.json  → False
Test-Path .opencode/opencode.jsonc → False
Test-Path opencode.json            → False
repo-wide search for opencode.json / opencode.jsonc → (no output)
```

`model` pin scan across `.opencode`, `kit`, `registry` (`.md`, `.json`, `.ts`, `.jsonl`,
excluding `node_modules`), pattern `^\s*model\s*:`:

```text
O:\vantrilex-arsenal\.opencode\plugin\arsenal.ts:143: model: unknown
COUNT=1
```

That single hit is a TypeScript type member, not a pin — quoted in context:

```text
141: export type SystemTransformInput = {
142:   sessionID?: string
143:   model: unknown
144: }
```

Agent-frontmatter pin count (the definition that matters for dispatch) is **0**:
`probe-2 opencode.json exists: false | agent frontmatter model pins: 0`, exit 0.

Where the law is recorded, re-quoted verbatim:

- `WORKFLOW.md:104` — "Model routing (owner law 2026-10-18): side agents/workers dispatch
  on DeepSeek V4.1 FLASH (explicit dispatch parameter
  `opencode-go/deepseek-v4.1-flash`); leaders (Blazar/Aether/Pulsar seats) remain on Muse
  Spark 1.3 Contributor; zero `model:` file pins."
- `AGENT.md:230` — "MODEL LAW: side agents/workers → DeepSeek V4.1 FLASH (applied AT
  DISPATCH as explicit `opencode-go/deepseek-v4.1-flash`; ZERO file pins); leaders
  unchanged (Muse Spark 1.3 Contributor)."

**Verdict sentence:** the Spark/DeepSeek split is implemented **in dispatch convention
only, not in config** — no OpenCode config file exists anywhere in the repository, zero
agent frontmatter carries a model pin, and the only durable record is prose in
`WORKFLOW.md:104` and `AGENT.md:230`. (مثبت for file state; the leader seat's actual
model is not provable from this repository and is therefore ~تقديري.) This session itself
running on `deepseek-v4.1-flash` is live evidence the dispatch-parameter convention
holds, not evidence of configuration.

## Check 3 — Triumvirate integrity

Frontmatter, quoted:

```text
aether.md  → name: aether   mode: primary   color: "#14B8A6"
blazar.md  → name: blazar   mode: primary   color: "#4169E1"
pulsar.md  → name: pulsar   mode: primary   color: "#C026D3"
```

Role statements, quoted:

- `.opencode/agents/aether.md:90` — "AETHER is the Vantrilex Arsenal planning leader. It
  turns one owner brief"
- `.opencode/agents/blazar.md:185` — "BLAZAR is the Vantrilex Arsenal Build Leader. It
  takes a verified AETHER"
- `.opencode/agents/pulsar.md:78` — "PULSAR is the Vantrilex Arsenal exploration leader.
  It tests what a plan"

Probe P3, verbatim:

```text
aether name=aether mode=primary color=#14B8A6 match=true
blazar name=blazar mode=primary color=#4169E1 match=true
pulsar name=pulsar mode=primary color=#C026D3 match=true
probe-3 triumvirate failures: 0
exit=0
```

Stems equal names (3/3), all three `mode: primary`, and colors match the reserved palette
in `registry/themes/vantrilex-atomic-switch.json`:

```text
{"accentHex":"#4169E1","agent":"blazar","category":"reserved",...}
{"accentHex":"#14b8a6","agent":"aether","category":"reserved",...}
{"accentHex":"#C026D3","agent":"pulsar","category":"reserved",...}
```

Two shape notes, recorded as C-04 and C-05: `blazar.md` nests temperature under
`request.body` while `aether.md` / `pulsar.md` put it at top level; and the aether accent
is uppercase in the agent file but lowercase in the theme registry. Neither is a gate
failure (verify-kit 22/22 passes).

## Check 4 — Agreement

Gate exits, quoted:

```text
verify-kit.mjs            → VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).   exit 0
generate-catalog --check  → check: registry/catalog.json — ok · check: registry/VANTRILEX_CATALOG.md — ok   exit 0
verify-registry.mjs       → totals: 7 checks — 7 passed, 0 failed, 0 skipped              exit 0
```

Probe P4, verbatim:

```text
lock observed=157 expected=157 OK
core observed=32 expected=32 OK
conditional observed=125 expected=125 OK
pending observed=9 expected=9 OK
catalog observed=2931 expected=2931 OK
sidecars observed=16 expected=16 OK
agents observed=27 expected=27 OK
skills observed=37 expected=37 OK
commandsA observed=18 expected=18 OK
commandsB observed=4 expected=4 OK
probe-4 agreement mismatches: 0
exit=0
```

Cross-table as recounted (all مثبت):

| Surface | Observed | Expected by brief | Agrees |
| --- | --- | --- | --- |
| Lock components | 157 (core 32 + conditional 125) | 157 (32 + 125) | yes |
| Lock pending | 9 | 9 | yes |
| Catalog records | 2931 | 2931 | yes |
| Registry sidecars | 16 | 16 | yes |
| Agent files | 27 | 27 | yes |
| Skill folders | 37 | 37 | yes |
| Commands | 18 (`.opencode/commands`) + 4 (`.opencode/command`) | 18 + 4 | yes |

Lock kind split, quoted from the recount: `{"skill":27,"mcp":27,"lsp":1,"hook":7,
"agent":21,"cli":64,"theme":3,"prompt":1,"dataset":1,"template":1,"policy":1,
"benchmark":1,"workflow":1,"design.md":1}`.

Agreement holds **on the gate's scope**: every lock entry matches the catalog
(`catalog-agreement PASS 157 lock entries agree with registry/catalog.json on kind, phase,
tier, install_cmd, verification`). Check 4 also exposes a scope boundary: the gate proves
lock↔catalog, not disk↔lock. 19 of 37 skill folders and 7 of 27 agent files are absent
from the lock (C-10, C-11) — known-parked, not a regression.

## Defects for consolidation into `V87-DEFECTS.md`

Severity-ranked, one concern per row. Labels: مثبت = measured/observed; ~تقديري =
inferred, not proven by a gate.

| ID | Severity | Concern | Evidence (file:line) | Label | Owner |
| --- | --- | --- | --- | --- | --- |
| C-01 | MEDIUM | No named agent can load any `vs-*` skill by allow-list; 0 of 27 agent files grant one, while 3 leaders deny `skill "*"` and allow only unprefixed names | `.opencode/agents/aether.md:14-28` (deny `*`, allow `vantrilex-workflow-forge`), `.opencode/agents/blazar.md:59,65,86,92,98,116`; count `resource: vs-` = 0 | مثبت count / ~تقديري runtime effect | kit maintainer + Guide |
| C-02 | MEDIUM | Duplicate trigger surface: twin pairs carry byte-identical `description:` lines, so skill selection between `X` and `vs-X` cannot be deterministic | `SKILL.md:3` of `preflight-system-doctor`, `vs-preflight-system-doctor`, `vantrilex-vanguard`, `vs-vantrilex-vanguard`, `circuit-breaker-guard`, `vs-circuit-breaker-guard`, `github-release-packager`, `vs-github-release-packager` | مثبت bytes / ~تقديري effect | kit maintainer |
| C-03 | MEDIUM | No command entry point names a `vs-*` skill: 0 hits across all 22 command files; the 4 canonical commands describe the unprefixed flows in prose | `.opencode/command/doctor.md:2`, `equip.md:2`, `prime.md:2`, `release.md:2`; scan of `.opencode/commands/*.md` and `.opencode/command/*.md` for any `vs-` id = 0 | مثبت count | Guide |
| C-04 | LOW | Leader frontmatter uses two different temperature shapes: nested `request.body` on blazar, top-level on aether and pulsar; if V2 honours only one shape, the other is inert | `.opencode/agents/blazar.md:6-8` vs `.opencode/agents/aether.md:6`, `.opencode/agents/pulsar.md:6` | مثبت shapes / ~تقديري which is honoured | kit maintainer |
| C-05 | LOW | Aether accent case mismatch (`#14B8A6` agent vs `#14b8a6` registry) and reserved-category semantics conflict: `categories.reserved` says "BLAZAR only" while aether and pulsar rows carry `"category":"reserved"` | `.opencode/agents/aether.md:5`; `registry/themes/vantrilex-atomic-switch.json` (`agents[1].accentHex`, `categories.reserved`) | مثبت bytes / ~تقديري checker sensitivity | kit maintainer |
| C-06 | LOW | markdownlint MD037, two new errors from unescaped literal asterisks in prose (`RELAY_*`, `vs-* admissions`); lines absent at HEAD | `AGENT.md:112`, `AGENT.md:207`; `git show HEAD:AGENT.md` → `hub-preflight` 0, `W1 COMPLETE (all 8 ledgers` 0 | مثبت | docs author (this lane) |
| C-07 | LOW | markdownlint MD032, new error: list not surrounded by blank lines; line absent at HEAD | `WORKFLOW.md:76`; `git show HEAD:WORKFLOW.md` for `W0 (4 parallel` = 0 | مثبت | docs author (this lane) |
| C-08 | LOW | markdownlint MD034 ×8 bare URLs plus MD032 ×1 in a generated file; identical content exists at HEAD, so pre-existing and generator-caused | `registry/VANTRILEX_CATALOG.md:1604,1712,1855,1887,2014,2031,2117,2139,3026`; HEAD content present for `hauntapi`, `mcp.appwrite`, `Skills → registry/skills/` | مثبت pre-existing / ~تقديري fix path | kit maintainer (generator) |
| C-09 | LOW | Two command roots coexist: `.opencode/command` (4) and `.opencode/commands` (18); the `V-*` set is documented as parked to v0.8 and the installation doc names only the singular path. No gate asserts which root V2 loads | `.opencode/command/` vs `.opencode/commands/`; `docs/99-archive/P1-RENAME-CHECKLIST.md:41`; `docs/ar/02-INSTALLATION.md:61-63` | مثبت roots / ~تقديري loading | Guide |
| C-10 | INFO | 19 of 37 skill folders are absent from `kit.lock`, and all 8 `vs-*` ids are absent from `registry/catalog.json`; registration is explicitly parked, so known-open, not a regression | unlocked list: `circuit-breaker-guard`, `github-release-packager`, `pre-mortem`, `preflight-system-doctor`, `relay-protocol`, `session-context-primer`, `skill-maker`, `vantrilex-deep-understand`, `vantrilex-intake-fetch`, `vantrilex-intake-send`, `vantrilex-intake-triage`, and the 8 `vs-*`; `AGENT.md:158` items 5–6 | مثبت | owner (registration parked) |
| C-11 | INFO | 7 of 27 agent files are absent from the lock | `vantrilex-agent-maker`, `vantrilex-guide`, `vantrilex-implementer`, `vantrilex-kit-maintainer`, `vantrilex-leader`, `vantrilex-puller`, `vantrilex-uploader`; `AGENT.md:158` item 6 | مثبت | owner (registration parked) |

Resolved non-findings, recorded so the consolidator does not re-open them:

- verify-kit's "17 in-repo skills" versus 18 lock skill ids that have a folder is not a
  divergence: `ponytail` carries a non-null `install_cmd`
  (`npx skills add dietrichgebert/ponytail …`), so it is counted upstream, not in-repo.
- `vs-vantrilex-workflow-forge`'s 9 headings are 7 required plus 2 documented extras
  (`.opencode/audit/V-FULL-AUDIT.md:228-229`), not a shape violation.
- The 9 lock skill ids without a local folder (`find-skills`, `ask-matt`,
  `skill-creator`, `grill-me`, `wayfinder`, `tdd`, `code-review`, `ponytail-review`,
  `ponytail-audit`) all carry verified upstream install commands; absence of a folder is
  expected until install.

## Method notes

- Gate 6 and gate 7 totals are my own counters; neither tool emits a totals line, and
  both are labelled as counters rather than quoted tool output.
- Two probe invocations were malformed on first attempt (PowerShell stripped quotes when
  passing `node -e` native arguments: P1 truncated at the first `"`, P3 captured a leading
  quote). Those runs exited non-zero and were **discarded as harness defects, not kit
  failures**; both probes were re-run through stdin and are quoted from the clean run.
- No file was created, edited, or deleted except this artifact. No git write was issued.
- `docs/spec/v87/**`, agent/skill/registry sources, and state files were read only.
- No secrets appear in this report. No model pin is introduced: the single quoted
  `model` token is a TypeScript type member at `.opencode/plugin/arsenal.ts:143`.

Ponytail: FULL on code-writing nodes only — no production code authored here; four inline
Node probe snippets were executed read-only and each is verified by its own real run
(`probe-1 … failures: 0`, `probe-2 … model pins: 0`, `probe-3 … failures: 0`,
`probe-4 agreement mismatches: 0`, all exit 0).
