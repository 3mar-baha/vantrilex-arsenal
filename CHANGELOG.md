# Changelog

All notable changes to Vantrilex Arsenal are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **The `cli` kind now reaches the catalog generator.** `generate-catalog-json.mjs`
  knows the kind in all five places it enumerates one — `KINDS`, `SECTION_KINDS`,
  `SECTION_LABELS`, `INDEX_DIRS`, `SIDECAR_FILES` — so a future `cli` lock entry no
  longer fails `catalog-agreement` with `cli: absent from registry/catalog.json`.
  Proven end to end with temporary fixtures (a markdown row, a sidecar, and a lock
  entry): `per-kind/cli` reported `1 cli entries carry a real installer command`
  and `catalog-agreement` passed at 53 entries. Every fixture was then removed and
  `kit/kit.lock`, the sidecar, and the markdown restored byte-for-byte, so the kit
  still locks 0 `cli` entries and the census is unchanged at 2737. Nothing about
  the toolchain's behaviour changed for the six existing kinds.

- **A `cli` kind — the place for command-line tools, holding zero entries.** The
  lock schema and the registry catalog schema both accept `cli`, and
  `scripts/verify-kit.mjs` grew a `per-kind/cli` check that validates a real
  package-manager invocation or vendor installer, rejects chained shell operators
  and piped remote code, and reports `0 cli entries locked` rather than passing
  vacuously. New `cli` entries default to `conditional` — per-project, owner
  approval — recorded as prose rather than a schema mechanism, since a hard-coded
  tier check would turn a legitimate promotion to `core` into an error.
  Selection criteria are owner-locked: free or a generous free tier for a solo
  developer with the terms recorded, no functional overlap with a locked
  component, best-of-breed among duplicates, a replacement surfaced only when
  clearly and significantly better with concrete differences stated and otherwise
  dropped silently, and licence recorded for information only, never a filter.
  Population happens later through the digest and review mechanism; nothing is
  locked now.
- **A direct install command under each of the three skills.** The README now
  carries a copy-pasteable `npx skills add` command beneath Prime, Vanguard, and
  Doctrine, so a reader can take one skill immediately instead of running the
  full Vanguard survey first. The commands follow the install pattern documented
  at `docs/04-VANGUARD.md`. Both READMEs carry the block at the same
  position: the English one under `Install directly:`, the Arabic one under
  `للتثبيت مباشرة:` with the command itself left in Latin script so the two
  files render identically. Documentation only: no new component, no registry or
  `kit.lock` change, no behavior change.
- **Those three commands are now proven, not assumed.** Each was executed for real
  in an isolated sandbox with a fresh `HOME` and its own working directory, with
  nothing written outside it. All three exited 0, each installed into
  `.agents/skills/<name>/SKILL.md`, and every installed file is byte-identical to
  its committed blob — matched with `git hash-object` and SHA-256 against
  `HEAD:<path>` rather than the working tree, so an unrelated uncommitted edit
  cannot manufacture a false pass. The CLI reports *Found 20 skills*, which
  matches the twenty directories under `.opencode/skills/`, so it does discover
  this repository's layout. The `-a opencode` flag that `kit.lock` uses for
  upstream skills is **not** required here: agent auto-detection already resolves
  to OpenCode, and adding the flag changes only the console echo, not where files
  land. The commands stay as written.
- **Third top-level skill: `vantrilex-prime`.** An orientation skill that runs once
  per machine, before Vanguard or Doctrine. It covers what the Arsenal is, the
  canonical repository URL, how to clone and pin it, the on-disk layout, how to
  confirm the three top-level skills exist, the order they run in, and the standing
  laws every later phase obeys. Registered in the Registry and locked in
  `kit/kit.lock` at `tier core`, `phase scout`, a null `install_cmd`, and
  `verification unverified`, matching the Vanguard and Doctrine precedent.
- **Kit component `vantrilex-design-variations`.** A procedure that fires when a
  design task arrives on a UI-bearing project: it produces four screenshot-able
  HTML variations, an owner approval gate, a linked ticket, and a verified build
  before any styling work is written. It is a catalog kit component, not a
  fourth top-level skill — the orchestration layer stays exactly three. Locked
  at `tier conditional`, `phase build`, a null `install_cmd`, and
  `verification unverified`, matching every other in-repo conditional skill.
- **Kit component `task-dispatcher`, the seventh hook.** A plugin callback in
  `.opencode/plugin/arsenal.ts` bound to the OpenCode V2 session `prompt` hook,
  so it fires once per user prompt — the event granularity and the task
  boundary are the same boundary, and nothing inside a task can re-trigger it.
  It appends a five-line instruction that classifies the turn into exactly one
  of five Vanguard task scenarios (new task, continuation, task modification,
  continuation with modification, continuation with new task) and points at the
  Vanguard skill, which owns what to do about each. It injects no component and
  carries no plan of its own. Locked at `phase scout`, `tier core`, a null
  `install_cmd`, and `verification unverified`, matching every other in-repo
  hook. Its kill switch is `taskDispatcher.enabled` in `.opencode/arsenal.json`,
  default `true`, so the policy can be turned off without unpacking the plugin.
  Documented in `docs/16-TASK-DISPATCH.md`.
- `README.ar.md`, the full Arabic counterpart to `README.md`, agreeing with it on
  every figure and fact.
- `AI_GUIDE.md`, an AI-facing operating manual: the three skills and their fixed
  order, the §33B orchestration law and the single-writer rule, announce-then-verify,
  the six gates, the on-disk map, and the mistakes to avoid.

### Changed

- `README.md` rewritten for the three-skill architecture, with a quickstart, the
  Registry description, the kit census, and the six gates. Its previous
  "two skills" and "2,699 components" figures were wrong and did not survive.
- **The census moves from 51 locked components to 52**, being 36 tier `core` and
  16 tier `conditional` with an empty pending list, of which 25 are skills and 7
  are hooks. The catalog recount moves from 2,736 to **2,737** records, 1,503
  of them skill records and 20 of them hook records. On disk `.opencode/skills/`
  holds 20 folders: 15 locked in-repo kit components, 3 top-level skills, and 5
  transplanted mechanisms still unlocked (`circuit-breaker-guard`,
  `github-release-packager`, `pre-mortem`, `preflight-system-doctor`,
  `session-context-primer`). The verification split is 12 `verified` and 40
  `unverified`. The 8-MCP cap and the 22 default-selected components are
  unchanged. This bullet supersedes the earlier unreleased 50-to-51 census
  bullet, which would otherwise leave two live figures in one unreleased section;
  the 49, 50 and 51 censuses stay on the record as superseded history, not
  rewritten, alongside the dated decision log in `docs/15-DECISIONS.md`.
- Every current-state document now describes a three-skill orchestration layer —
  Prime (orientation), Vanguard (equip), Doctrine (work) — instead of two.
  Released history and the dated decision log in `docs/15-DECISIONS.md` are
  unchanged; a new decision entry records the move. The design-time arithmetic in
  the draft specs stays as written, because it records the original
  specification's own set.
- `scripts/verify-kit.mjs` now asserts all three top-level skills are locked, so
  `vantrilex-prime` cannot silently go missing from the lock. It also resolves
  every locked hook id against a function exported by the plugin file, so
  `task-dispatcher` cannot be locked without a `taskDispatcher` callback behind it.
- **Vanguard gained a Task dispatch section and its five dispatch scenarios.** The
  scout skill now owns one decision — which locked components are injected in
  which phase, read from the `phase` field of `kit/kit.lock` at dispatch time —
  and states the rules for each scenario: a continuation is a silent no-op,
  completed phases are immutable under a modification, and two lanes never share
  a phase-kit map. The `task-dispatcher` hook above announces a scenario and points
  there; it restates none of that procedure, and neither does
  `docs/16-TASK-DISPATCH.md`.
- **Preflight makes the `.env.example` check conditional.** The preflight
  configuration check now confirms `.env.example` only when the target project
  actually declares required environment variables, and reports the check SKIPPED
  rather than FAIL when it declares none. A project with no env vars previously
  failed a check that had nothing to check.
- **Tier-0 census re-ratified at 49 locked components.** The owner-authorized
  figure for `kit/kit.lock` is now **49 = 34 tier core + 15 tier conditional,
  0 pending**. The earlier 36-component figure was ratified 2026-10-04 and is
  superseded by the 13 conditional components added by the digest-candidate and
  parked-idea work: twelve in-repo conditional skills (`lenis`, `og-image`,
  `vantrilex-design-variations`,
  `open-graph-image`, `time-capsule-test`, `kit-evaluation-journal`, `red-team`,
  `skill-shadow`, `documentation-as-tests`, `kit-evolution-log`,
  `kill-switch-document`, `babel-bridge`), the in-repo `red-team` agent, and the
  upstream `a11y-audit` agent. All 13 are `tier conditional` and
  `verification unverified` with a null `install_cmd`, so none of them raises
  the Tier-0 core count. The 8-MCP cap is unchanged, and the decision to keep
  both conditional hooks stands. That figure was itself superseded by the census
  bullet above and is kept here as the record of what was ratified at that step.
- Every current-state documentation site that asserted 36 components was moved
  to 49 by this change, then to 51, and then to 52 by the census bullet above:
  `README.md`, `README.ar.md`, `AI_GUIDE.md`, `docs/00-INDEX.md`,
  `docs/01-OVERVIEW.md`, `docs/03-ARCHITECTURE.md`, `docs/04-VANGUARD.md`,
  `docs/06-REGISTRY-SCHEMA.md`, `docs/07-CATALOG-GENERATION.md`,
  `docs/08-VERIFICATION.md`, `docs/09-KIT-LOCK.md`,
  `docs/13-CONTRIBUTING-WORKFLOW.md`, and `docs/spec/VANTRILEX_SKILLS_SPEC.md`.
  Released changelog history and the decision log in `docs/15-DECISIONS.md` are
  left as written; the design-time arithmetic in
  `docs/spec/VANTRILEX_KIT_SPEC.md` stays as the original specification's own
  record. One site still carries a stale census and is owned elsewhere: the
  root-level `VANTRILEX_SKILLS_SPEC.md` names 49. It is untracked and
  gitignored by exact path, so the stale figure cannot be corrected by
  committing, and the decision log records that state at
  `docs/15-DECISIONS.md`.
- **This repository's documentation set moves from 16 files to 17.**
  `docs/16-TASK-DISPATCH.md` joins the numbered series and is registered in the
  `docs/00-INDEX.md` file map; the file count, the `00` through `16` numbering, and
  the doc pointers in `README.md`, `README.ar.md` and `AI_GUIDE.md` moved together.
  The 28-file target-project set Vanguard generates is a different series and is
  untouched.
- The kit-census labels inside the existing SVG tables under `docs/assets/tables/`
  were updated to the new figures — `docs/assets/tables/kit-census.svg`,
  `locked-contents.svg`, `ar-locked-contents.svg`, `catalog-records.svg`,
  `elements-role.svg`, `ar-elements-role.svg`, and
  `compare-with-without-arsenal.svg`. Only numeric and tier label text changed:
  no SVG was added, removed, resized, restyled, or re-laid-out, the provenance and
  honesty lines are intact, every figure carrying a `~` is untouched, and the
  four-value brand palette is unchanged.
- **`task-dispatcher` migrated to the OpenCode V2 plugin surface.** The hook now
  registers from the plugin module's `setup()` — the V2 contract the plugin file
  mirrors from `@opencode/plugin` 2.0.22 — against the session `prompt` hook, and
  appends its instruction to `event.prompt.text` instead of pushing a
  `{ type, text }` part onto V1's `output.parts`. Behaviour is unchanged: the
  same five scenarios, the same five-line instruction, the same
  `taskDispatcher.enabled` kill switch defaulting to `true`, and the same
  once-per-task semantics, because prompt admission is the same task boundary
  `chat.message` was. Two differences are deliberate: an empty prompt is not
  annotated, since there is no intent to classify from it, and the captured
  `lastIntent` is read before the rewrite so it stays the user's own words. The
  config root resolves from `ctx.location.directory` with the working directory
  as the fallback, reading `.opencode/arsenal.json`.
- **The other six hooks and the docs-discipline guard remain V1-only, and are
  inert under OpenCode V2.** They are still registered from the `server()`
  surface, which a V2 runtime never dispatches, so on V2 those seven callbacks do
  not fire at all. This is a deliberate, unfinished gap rather than a completed
  port: V2 has no equivalent of `experimental.chat.system.transform`, no
  `experimental.session.compacting`, and no mutable `tool.execute.*` output, so
  porting those guards means reworking what each one writes and how it reads a
  verdict — a separate concern, deliberately not bundled into the user-message
  migration. The module default-exports one object carrying both surfaces,
  because V2 reads `id` plus `setup()` and ignores `server()`, while OpenCode V1
  `>= 1.18.29` reads `server()` and ignores `setup()`.
- The kit census is unchanged by that migration: 52 locked components, 36 tier
  `core` plus 16 tier `conditional`, 0 pending, 7 of them hooks. A guard moving
  to a different runtime surface is not a new component.

---

## [0.2.0] — 2026-10-04

### Added

- **Vantrilex Registry v2.** Catalog schema, generator, and verifier under `scripts/`,
  with per-kind JSONL sidecars under `registry/data/`. The catalog now carries a real
  `install_cmd`, a `when_to_use` trigger, a lifecycle `phase`, a `tier`, and a
  `verification` state for every component.
- `registry/catalog.json`, a generated machine mirror of the catalog for selection agents.
- `registry/data/overlaps.yaml` — 20 overlap groups covering `supersedes` and
  `pairs_with` relations, so a selection agent never installs two components that
  fight each other.
- **A new `formatting` kind.** Twelve design-system reference documents vendored from
  `voltagent/awesome-design-md` (MIT), curated as a Tier-1 conditional kit for UI-heavy
  projects. A project adopts exactly one; see `registry/formatting/ATTRIBUTION.md`.
- **Verified install commands.** 12 components carry commands verified against a real
  registry, including `npx -y @upstash/context7-mcp` (4.1.1) and
  `npx -y firecrawl-mcp` (3.27.3). The 1,475 remaining commands are mechanically derived
  from their source repository and are explicitly marked `unverified` rather than
  presented as checked.
- **Four transplanted mechanism skills in OpenCode format** (on main via Round 2a):
  `circuit-breaker-guard` (3-strike halt plus Diagnostic Incident Report),
  `preflight-system-doctor` (Node-only PASS/FAIL/SKIPPED gate, build phase step 0),
  `session-context-primer` (CONTEXT ANCHOR, read-only, ~10s budget),
  `github-release-packager` (Clean Code / Test / Docs guards, semver, annotated tag,
  `gh release`, fresh-clone verify).
- **Vantrilex Vanguard scout skill** (merged to main): six-step procedure
  (preflight, four-state detection, Arabic chatbot-relay prompt, source surveying,
  five-step selection, install-plus-verify-plus-report), the 28-file documentation
  contract with its 8-folder grouping, and per-kind verification protocols.
- **Vantrilex Doctrine law skill** (merged to main): seven constitutional
  laws, Leader/Guide/Implementer decision rights with escalation ladder, mandatory
  phase map, five workflows with the three second-pass guards given substance, three
  session rituals, and §33B parallelism mechanics.
- **Arsenal plugin `.opencode/plugin/arsenal.ts`** (on main via Round 2a): the six
  logical Tier-0 hooks as plugin callbacks (session-start, pre-compact, session-end,
  platform-neutral long-running-process guard, conditional TypeScript check,
  conditional Prettier format) plus a docs-discipline guard; four operator commands
  (`doctor`, `equip`, `prime`, `release`).
- **Leader, Guide and Implementer role agents** (on main via Round 2a) with decision
  rights, deny-edit permissions on Leader/Guide, and scoped bash on Implementer.
- **Worktree orchestration** (on main via Round 2a): seven adapted shell scripts, two
  git hooks, and rebuilt CI (registry verifiers plus shellcheck plus tsc) and release
  workflows.
- **`kit/kit.lock`** (merged to main): 36 pinned Tier-0 entries with an empty pending
  list, its JSON schema, and `scripts/verify-kit.mjs` (11 per-kind checks).
- **`scripts/verify-skills.mjs`** (merged to main): 10 skill-format
  checks including the mechanism single-home rule and the phase-map cross-check.
- **The 16-file Arsenal documentation set under `docs/`** (merged to main).
- **Four kit skills registered in the catalog** (merged to main):
  Vanguard and Doctrine as Tier-0 default-selected, session-context-primer and
  preflight-system-doctor as conditional; the catalog now carries 2,719 records with
  22 default-selected.
- **Fifteen components registered and thirteen locked**, taking the catalog to
  **2,734 records with 22 default-selected**: twelve in-repo skills (`lenis`,
  `og-image`, `open-graph-image`, `pre-mortem`, `time-capsule-test`,
  `kit-evaluation-journal`, `red-team`, `skill-shadow`, `documentation-as-tests`,
  `kit-evolution-log`, `kill-switch-document`, `babel-bridge`), the in-repo
  `red-team` agent, the upstream `a11y-audit` agent (`rksekar5/a11y-audit`, MIT,
  1 star, last push 2026-06-01 — a young project, so its findings are recorded
  unverified), and the `lenis-mcp-server` MCP. Every new record is `tier
  conditional` and `verification unverified` with a null `install_cmd`; none is
  default-selected, and the Tier-0 core count stays at 34. `lenis-mcp-server` is
  recorded unverified because **no such package is published on npm as of
  2026-10-04** (`lenis-mcp-server`, `@lenis/mcp-server`, `lenis-mcp`,
  `mcp-server-lenis` and `lenis-mcp-servers` all return E404), so it carries no
  invented install command and is deliberately absent from `kit.lock`. The
  in-repo `pre-mortem` is catalogued under the derived id `pre-mortem-row-1493`
  because row 1168 already holds the `pre-mortem` slug, and it is likewise not
  locked: its catalog id matches no `.opencode/skills/` folder, so a lock entry
  naming it would be a pin to nothing.

  Round 2a (mechanism skills, plugin, roles, orchestration) is on main, as is every
  other Round-2 entry above.

### Changed

- Catalog reconciled with the authoritative Tier-0 set: `github` promoted to
  default-selected, `context7` and `firecrawl` added as MCP servers, and the catalog
  recounted to **2,715 components with 20 default-selected**.
- Skill phases and tiers corrected against the Doctrine phase map. Four were wrong
  (`ask-matt`, `find-skills`, `skill-creator`, `ponytail-audit`) and `ponytail-audit`
  was `conditional` rather than `core`.
- Ids are now disambiguated deterministically when two rows in a kind slugify
  identically — the first keeps the plain slug, later collisions take a `-row-<N>`
  suffix. This separates `Code Reviewer` (row 47) from `code-reviewer` (row 48).
- Catalog sidecar corrections (merged to main): the `github`
  default-selected flag set true (markdown said selected, sidecar said false),
  `ponytail-debt` phase set to operate per the mandatory phase map, and ten Tier-0
  skill phases/tiers corrected to that map with on-demand admitted as a phase.
- The Doctrine session-start ritual now delegates anchor mechanics to
  session-context-primer instead of duplicating its template (single-home rule).
- **Tier-0 census note (RATIFIED AT 49):** The owner-authorized figure is 49 locked components = 34 tier core + 15 tier conditional, 0 pending. The earlier 36-component figure (32 core records + 2 conditional hooks + the 2 kit skills) was ratified 2026-10-04 and is superseded by the 13 conditional components added by the digest-candidate and parked-idea work — twelve in-repo conditional skills plus the in-repo `red-team` agent and the upstream `a11y-audit` agent, each `tier conditional` and `verification unverified` with a null `install_cmd`, so the Tier-0 core count is unchanged. The two conditional hooks (typescript-check-after-editing-ts-tsx-files, auto-format-js-ts-files-with-prettier-after-edits) remain KEPT: they are part of the six hooks per kit spec §2.4 and explicitly conditional, and removing them would lose function. No component was changed to resolve either count.

### Fixed

- **Seven malformed UTF-8 sequences repaired** in the catalog. Each truncated
  description cell was recovered from its per-item registry card using the catalog's own
  truncation rule, which 1,383 clean rows already follow. The kit specification had
  guessed these were truncated ellipses or arrows; the cards show they were em dashes
  and one arrow.
- The generator resolved sidecars as `<kind>.jsonl` while the files are plural, so all
  2,702 enrichment records were being silently discarded. Sidecar filenames are now
  mapped explicitly.
- The orphan-reference checker recognised only an `overlaps:` root key and did not
  unquote scalars, so it read 60 overlap entries and resolved none of them. It now reads
  `supersedes:` and `pairs_with:` and resolves all 48 id references.
- The generator rejected the new `formatting` section as an unknown heading.
- Generator `--markdown` is now idempotent (merged to main): it was
  re-sorting rows case-sensitively and rewriting Install cells, producing output its
  own parser rejected.
- Generator `--indexes` now writes the plural kind directories and preserves
  the hand-authored formatting index instead of overwriting it.
- The seven malformed UTF-8 sequences repaired in the catalog were already released
  in Round 1 (see the entry above); referenced here for traceability, not re-claimed.
- Leader/Guide agent files: removed the inert `write: deny` permission keys
  (`edit: deny` is the real control).

---

## [0.1.0] — 2026-10-04

### Added

- Repository foundation: MIT license (© 2026 3mar-baha), `.editorconfig`,
  `.gitattributes`, `.gitignore`, and `.markdownlint.jsonc`.
- `AGENTS.md` defining the repository's hard rules, the skill-file format standard,
  and the verification protocol each change must pass.
- `README.md` describing the two-skill model (Vanguard selects and equips, Doctrine
  governs), the Registry, the 36-component Tier-0 kit, and the Node-only toolchain.
- `CONTRIBUTING.md` and `SECURITY.md`.

### Notes

- Registry v2 (schema, generator, verifier, per-kind sidecars) and the Tier-0 kit are
  in progress and are tracked under `[Unreleased]`.

[Unreleased]: https://github.com/3mar-baha/vantrilex-arsenal/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/3mar-baha/vantrilex-arsenal/releases/tag/v0.2.0
[0.1.0]: https://github.com/3mar-baha/vantrilex-arsenal/compare/v0.1.0...v0.2.0

### Fixed

- **36 catalog records named skills that do not exist upstream.** Each carried a
  multi-word, unquoted `--skill` value, so the shell split it and the command
  installed something other than what it named — a direct instance of the
  failure mode `SECURITY.md` names as the top threat in this repo. Checking the
  upstream repository settled it: it publishes 818 skill directories, and *none*
  of the 36 ids is among them, nor does anything resembling a rename of them.
  These were phantom rows, not malformed commands, so quoting the name would not
  have fixed them — a quoted name still resolves to nothing. All 36 now carry
  `install_cmd: null` with `verification: unverified`, which is the honest state:
  an admission of ignorance rather than a command that looks right and is not.
  Only `install_cmd` was touched; `id`, `origin`, `verification`, and `tags` are
  unchanged. All 1,449 remaining skill commands now match the shape the kit
  verifier enforces.
- **`kit/kit.lock` pointed `firecrawl` at a repository that does not exist.** The
  entry carried `source: firecrawl/firecrawl-mcp` and `verification: verified`
  together. `git ls-remote` returns *Repository not found* for that path, so a
  verified entry asserted provenance on a dead repo — the exact
  plausible-looking-wrong-command failure this repo exists to prevent. The npm
  metadata for the pinned `firecrawl-mcp@3.27.3` names
  `firecrawl/firecrawl-mcp-server` as its repository, that path resolves, and the
  lock now says so. `install_cmd`, pin, phase, tier, and verification are
  unchanged; only `source` moved.
- **Four locked agents recorded no provenance at all.** `architect`,
  `code-reviewer`, `ai-generated-code-security-auditor`, and `technical-writer`
  carried `source: null` while the registry sidecar already held the upstream
  origin for each — `worldflowai/everything-claude-code` and
  `msitarzewski/agency-agents`. Both resolve. The lock now carries what the
  registry already knew instead of discarding it.

### Changed

- **`SECURITY.md` said three things the audit disproved.** It claimed the project
  ships "not an executable runtime" while `.opencode/plugin/arsenal.ts` is a
  runtime with seven hook callbacks that write and spawn; it claimed a verified
  entry records what it was verified against, and no such field exists among the
  twelve fields the catalog carries; and it claimed the lock pins versions, where
  2 of 52 entries carry a `version_pin` and all ten installable skills carry
  none. Each now states what is actually true, including that a `verified` flag
  is an assertion to re-test rather than auditable proof. Two weaker claims were
  corrected the same way: the pre-commit hook refuses a newly *added* `.env`
  rather than any staged one, and `scripts/` records no approval before its
  recursive deletions even though the paths themselves are verified inside the
  repository root. The 36 catalog records whose unquoted multi-word `--skill`
  values would install the wrong thing are documented as a known open defect
  rather than silently left for the next reader to trip over.
- **A lost warning came back.** Adding CLI install prose to the Vanguard skill
  reworded "never guess a repository path" down to "never guess a binary", which
  silently dropped the guard on `npx skills add <repo>` — the failure it exists to
  prevent. It now reads "a repository path or a binary".
- **The Vanguard skill's three bare source URLs are wrapped in backticks**, so
  markdownlint passes on a file this change touches. `docs/04-VANGUARD.md` now
  records that an MCP server may be installed as a JSON snippet *or* as
  `npx -y <package>`, which is what `verify-kit.mjs` actually accepts and what the
  two verified MCP entries already do.
