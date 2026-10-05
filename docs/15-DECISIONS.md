# Decisions

This file is this repository's own decision log. Each entry carries a date, the
context that forced the decision, the decision itself, and its consequences.
Dates use the ratification day recorded in the specs and the changelog
(2026-10-04, the planning day the kit and skills specs were reviewed). Only
ratified decisions appear here: no invented entries, none missing. The log
format seeds the usage of `scripts/record-decision.sh`, whose real interface is:

```bash
./scripts/record-decision.sh <TITLE> [--status accepted|proposed|superseded] [--context TEXT] [--decision TEXT] [--consequences TEXT]
```

Records are append-only: existing entries are never reordered or rewritten,
and numbering is append-only. Note the script's default target is the
target-project decision log (`docs/03-architecture/13-ARCHITECTURE-DECISION-RECORD.md`
in target-project scope); this file is the Arsenal repository's own log and
is maintained by hand in the same shape. Numbers D3 and D4 are absent from
the ratified list and are left vacant rather than filled.

## D1 — Public repository

- **Date:** 2026-10-04
- **Context:** The Arsenal is a shareable plugin meant to be cloned onto
  projects; a private repository cannot serve that purpose.
- **Decision:** Develop in public.
- **Consequences:** No secret may enter the repository; reports go through
  the private channel in [SECURITY.md](../SECURITY.md).

## D2 — MIT license, copyright 2026 3mar-baha

- **Date:** 2026-10-04
- **Context:** Vendored design documents and transplanted mechanisms need a
  license story that composes with upstream MIT terms.
- **Decision:** MIT, copyright 2026 3mar-baha; vendored third-party design
  documents keep their original MIT licenses with attribution in
  `registry/formatting/ATTRIBUTION.md`.
- **Consequences:** Contributions are accepted under MIT; vendored files are
  reference material, not Arsenal-authored content.

## D5 — Lowercase-hyphenated slugs

- **Date:** 2026-10-04
- **Context:** Skill folders, record ids, and branch slugs need one shared
  identity rule or cross-references rot.
- **Decision:** Every `name`, record `id`, and concern slug is lowercase
  hyphenated; a skill folder and its `SKILL.md` name must match exactly.
- **Consequences:** The schema enforces `^[a-z0-9]+(?:-[a-z0-9]+)*$`; OpenCode
  rejects a folder-name mismatch; worktree branches read as `wt/<slug>`.

## D6 — Hooks as plugin callbacks

- **Date:** 2026-10-04
- **Context:** OpenCode has no standalone hooks directory, but the Tier-0 set
  needs six logical hooks.
- **Decision:** Implement the hooks as callbacks in the single plugin module
  `.opencode/plugin/arsenal.ts` instead of separate hook files.
- **Consequences:** The six specified hooks plus the docs-discipline guard
  ship in one TypeScript module with one wiring table; hook behavior is
  tested through the plugin's guard verdicts.

## D7 — Platform-neutral guards

- **Date:** 2026-10-04
- **Context:** Guards must run on POSIX shells and on Windows, where
  contributors in this project do their work.
- **Decision:** Every guard degrades identically on every platform and speaks
  both dialects where the operator must act (POSIX `tail -f` alongside
  PowerShell `Get-Content -Wait`, POSIX redirect alongside PowerShell
  redirect).
- **Consequences:** No guard assumes `bash`-only primitives; spawn paths go
  through the runtime abstraction, and Windows shims are resolved explicitly.

## D8 — Node rewrite of the registry tooling

- **Date:** 2026-10-04
- **Context:** Catalog tooling that needs Python, `jq`, or `tmux` taxes every
  user for the privilege of reading a catalog.
- **Decision:** Rewrite the generator and verifier as dependency-free Node
  ESM with zero dependencies; shell scripts stay POSIX `bash`.
- **Consequences:** `git` plus Node are the only requirements; CI pins Node
  25; no `package.json` dependency may be added without showing the standard
  library is insufficient.

## D9 — Tier-0-only guarantees

- **Date:** 2026-10-04
- **Context:** A 2715-record catalog cannot promise installation and
  verification for every row; promises must be budgeted.
- **Decision:** Install and verification guarantees cover the Tier-0 core set
  only; Tier-1 is conditional per project and the extended catalog is depth.
- **Consequences:** The kit verifier proves the core set; the 12 verified
  install commands are the start of backfill, not its end; everything else
  stays explicitly `unverified`.

## D10 — `origin` field distinct from `source`

- **Date:** 2026-10-04
- **Context:** Catalog v1 conflated the aggregator with the author, so a
  component redistributed by an awesome-list lost its real home.
- **Decision:** Catalog v2 carries both: `source` for the collection the
  component installs from, `origin` for the true upstream author when it
  differs (null when `source` is already the author).
- **Consequences:** Verification checks origin against a real repository; the
  schema documents the distinction with a concrete redistributed-skill case.

## D11 — Curated 12 design-system brands

- **Date:** 2026-10-04
- **Context:** The upstream design catalogue holds 74 brands; vendoring all of
  them would bloat the repository for systems no project uses.
- **Decision:** Vendor 12 of the 74 upstream brands as the `formatting` kind;
  document all 74 for discoverability and fetch the rest from upstream on
  demand.
- **Consequences:** A project adopts exactly one design system; the choice is
  a `supersedes` edge with no universal winner; the missing upstream file
  for one brand stays missing rather than fabricated.

## D12 — sqlite out of the default kit

- **Date:** 2026-10-04
- **Context:** The Tier-0 persistence story needed one mechanism, and the
  memory knowledge-graph server already holds that slot.
- **Decision:** sqlite-backed components stay out of the default kit; no
  Tier-0 component depends on sqlite.
- **Consequences:** The eight MCP slots keep memory, not sqlite; a project
  that needs sqlite takes it as Tier-1 through normal Vanguard selection.

## On-demand phase admitted

- **Date:** 2026-10-04
- **Context:** Discovery (`find-skills`) and forging (`skill-creator`) load
  when the catalog has no fit, which is not a lifecycle phase and could not
  be expressed in the phase enum.
- **Decision:** Admit `on-demand` as a phase value alongside the lifecycle
  phases; null keeps its meaning of unplaced or cross-phase.
- **Consequences:** The Doctrine phase map gains its sixth row; the schema
  enum, the dispatch phases, and the lock's scope table all accept the value.

## 32-not-36 census reported

- **Date:** 2026-10-04
- **Context:** The specified Tier-0 set counts 36, but the catalog could only
  evidence 32 core records with the 2 Arsenal skills still pending.
- **Decision:** Report 32 core records plus the 2 pending skills instead of
  claiming 36; the recount (2715 records, 20 default-selected) is the
  ratified census in [CHANGELOG.md](../CHANGELOG.md).
- **Consequences:** Documentation states the shortfall openly; the two
  pending skills close it on landing; no count is rounded up for appearance.

## Root duplicates kept separate, never merged

- **Date:** 2026-10-04
- **Context:** Four slugs are reused across two different kinds, and two
  agent rows slugify identically within one kind; merging any of them would
  destroy a real component.
- **Decision:** Identity is kind plus id: cross-kind duplicates stay separate
  records resolved by their explicit kind, and same-kind collisions
  disambiguate deterministically with a row-number suffix instead of merging.
- **Consequences:** Overlap entries always carry a kind; exactly one id in
  the catalog carries the suffixed form; the verifier fails on any
  within-kind collision the rule cannot separate.

## Tier-0 census ratified, both conditional hooks kept

- **Date:** 2026-10-04
- **Context:** The census recorded above reported 32 core records plus two
  still-pending skills and left the two conditional hooks unadjudicated. Both
  are named in kit spec §2.4 as part of the six hooks and are explicitly
  conditional, so deleting them to make a count tidy would drop function the
  specification requires.
- **Decision:** Ratified by the owner — keep both conditional hooks
  (`typescript-check-after-editing-ts-tsx-files` and
  `auto-format-js-ts-files-with-prettier-after-edits`). The final count is 32
  core records + 2 conditional hooks = 34 locked entries, 36 total with
  vantrilex-vanguard and vantrilex-doctrine.
- **Consequences:** No component, sidecar, or lock entry changed to resolve
  it; [CHANGELOG.md](../CHANGELOG.md) states the same counting decision, and
  [01-OVERVIEW.md](01-OVERVIEW.md), [04-VANGUARD.md](04-VANGUARD.md), and
  [13-CONTRIBUTING-WORKFLOW.md](13-CONTRIBUTING-WORKFLOW.md) carry the same
  figures as settled rather than provisional.

## Tier-0 census re-ratified at 49 locked components

- **Date:** 2026-10-05
- **Context:** The census ratified above counted 36 locked components. The
  digest-candidate and parked-idea work then locked 13 further entries, every
  one of them `tier conditional` with `verification unverified` and a null
  `install_cmd`, so the figure went stale with nothing removed or promoted.
- **Decision:** The owner-authorized figure is 49 locked components = 34 tier
  core + 15 tier conditional, 0 pending. The 36-component census stays on the
  record as its own 2026-10-04 ratification and is superseded, not rewritten;
  the decision to keep both conditional hooks is unaffected, and the 8-MCP cap
  is unchanged.
- **Consequences:** [CHANGELOG.md](../CHANGELOG.md) records the re-ratification
  under `## [Unreleased]` and restates the 0.2.0 census note at 49, and every
  current-state document now carries 49 rather than 36. The design-time
  arithmetic in `docs/spec/VANTRILEX_KIT_SPEC.md` is untouched, because it
  records the original specification's own set rather than the lock.

## Top-level layer is three skills, census re-ratified at 50

- **Date:** 2026-10-05
- **Context:** The re-ratification above counted 49 locked components spread
  across two top-level skills. `vantrilex-prime` then landed as a third
  top-level skill that orients a machine to the Arsenal before any other work
  starts, and it is locked as a third tier-`core` skill entry, so the layer
  count and the census moved in the same change.
- **Decision:** The owner-authorized figure is 50 locked components = 35 tier
  core + 15 tier conditional, 0 pending, of which 24 are skills; the catalog
  recount is 2735 records, 1502 of them skill records. The orchestration layer
  is three skills in order: Prime (orientation, once per machine), Vanguard
  (equip, once per target project), Doctrine (work). The other skill folders
  under `.opencode/skills/` are kit components equipped by Vanguard, never
  top-level skills. The 49-entry census stays on the record as superseded, not
  rewritten.
- **Consequences:** [01-OVERVIEW.md](01-OVERVIEW.md) states the three-skill
  model and carries 50, 35, 24, 2735, and 1502, and every current-state
  document carries the same figures. The 22 default-selected components and
  the 12 verified install commands are unchanged, as is the 8-MCP cap. Prime is
  orientation only: it does not restate Vanguard's four project states or
  Doctrine's workflows, and each doc describes it in a sentence and points at
  the skill. The design-time arithmetic in `docs/spec/VANTRILEX_KIT_SPEC.md`
  stays as written, because it records the original specification's own set.

## Design variations is a kit component, census re-ratified at 51

- **Date:** 2026-10-05
- **Context:** `vantrilex-design-variations` landed as a twentieth skill folder
  that fires when a design task arrives on a UI-bearing project. Its folder name
  carries the `vantrilex-` prefix, which is a naming convention every Arsenal
  component shares and grants no status, so without a recorded decision a
  reader could count a fourth top-level skill in the layer. It is locked as a
  tier-`conditional` kit component, which moved the census in the same change.
- **Decision:** The owner-authorized figure is 51 locked components = 35 tier
  core + 16 tier conditional, 0 pending, of which 25 are skills; the catalog
  recount is 2736 records, 1503 of them skill records. The orchestration layer
  stays exactly three skills: Prime, Vanguard, Doctrine. The new file is a kit
  component Vanguard equips for a UI-bearing project and is locked at `phase
  build`, `tier conditional`, with a null `install_cmd` and `verification
  unverified`, matching every other in-repo conditional skill. The 50-entry
  census stays on the record as superseded, not rewritten.
- **Consequences:** [01-OVERVIEW.md](01-OVERVIEW.md) and
  [03-ARCHITECTURE.md](03-ARCHITECTURE.md) describe it where kit components are
  described, never in the three-skill layer, so no document implies four
  top-level skills. Every current-state document carries 51, 35, 25, 2736, and
  1503. `.opencode/skills/` holds 20 folders: 15 locked in-repo kit components,
  3 top-level skills, and 5 transplanted mechanisms still unlocked
  (`circuit-breaker-guard`, `github-release-packager`, `pre-mortem`,
  `preflight-system-doctor`, `session-context-primer`). The verification split is
  12 verified and 39 unverified, and the 22 default-selected components and the
  8-MCP cap are unchanged.

## Law 7 approved with `brand/` allow-listed

- **Date:** 2026-10-05
- **Context:** `brand/IDENTITY.md` is the authoritative visual identity
  specification, but it sat outside the docs-discipline guard's allow-list and
  was therefore an accidental exception. Constitutional law 7 was marked
  `pending owner approval` in the Doctrine skill while the guard already
  enforced it, so the rule and its recorded status disagreed.
- **Decision:** The owner approves law 7 as written, with `brand/` added to
  `docsGuard.allowedDirs` in `.opencode/plugin/arsenal.ts` so the identity
  specification is a first-class allowed location under the guard rather than
  beside it. The entry is the plain form `brand`, which the guard
  prefix-matches after appending a single `/`, so it admits `brand/IDENTITY.md`
  and never a same-named sibling such as `branding/`. Every other document
  states the same set.
- **Consequences:** The numbered `docs/` series, `docs/99-archive`, `docs/spec`,
  `registry`, `.opencode`, `brand`, and the seven named root files are the whole
  allowed set; a Markdown write anywhere else is still BLOCKED, and
  `random-notes.md` outside those locations still fails. The phase map in
  [05-DOCTRINE.md](05-DOCTRINE.md) and in the Doctrine skill is unchanged, so the
  `phase-map-cross-check` name count is untouched.

## Task dispatcher is a seventh hook, census re-ratified at 52

- **Date:** 2026-10-05
- **Context:** `task-dispatcher` landed as a plugin callback in
  `.opencode/plugin/arsenal.ts` bound to `chat.message`, so it fires once per
  user message. Two questions had no recorded answer: whether a hook that fires
  on every single message is `core` or `conditional`, and whether its id takes
  the `vantrilex-` prefix the brief proposed.
- **Decision:** The hook is `core` and `phase scout`, locked with a null
  `source`, a null `install_cmd`, and `verification unverified`. Tier in this
  repository records universality of provisioning, not firing frequency: the kit
  spec defines Tier 0 as provisioned on every project with no questions and
  Tier 1 as added per stack, and the only two `conditional` hooks are conditional
  because they are TypeScript and JS/TS projects. `task-dispatcher` is
  stack-agnostic. Frequency does not decide it either — `long-running-process-guard`
  is `core` and fires before every tool call, while the conditional pair fires
  less often than that. The id is `task-dispatcher`, unprefixed: all six existing
  hook ids are unprefixed, the `vantrilex-` prefix is reserved for the three
  top-level skills, and `scripts/verify-kit.mjs` joins the lock id against its
  `HOOK_FUNCTIONS` key, which is already `task-dispatcher`. The owner-authorized
  figure is 52 locked components = 36 tier core + 16 tier conditional, 0
  pending, of which 25 are skills and 7 are hooks; the catalog recount is 2737
  records, 1503 of them skill records and 20 of them hook records. The 51-entry
  census stays on the record as superseded, not rewritten.
- **Consequences:** [16-TASK-DISPATCH.md](16-TASK-DISPATCH.md) documents the hook
  and points at the Vanguard skill's Task dispatch section for the procedure,
  which is that skill's single home. The repository's own documentation set moves
  from 16 files to 17, and `AI_GUIDE.md` now carries the seven-hook table. The
  verification split is 12 verified and 40 unverified; the 22 default-selected
  components, the 8-MCP cap, the 20 skill folders, and the 15 locked in-repo
  skills are unchanged. The kit-census numeric labels inside the existing SVGs
  under `docs/assets/tables/` moved with the census, with no SVG added, resized,
  or re-laid-out. The root-level `VANTRILEX_SKILLS_SPEC.md` copy carries 49 and is
  owned by another branch, so `docs/spec/VANTRILEX_SKILLS_SPEC.md` is the copy
  this change moves.

## Task dispatcher migrates to the OpenCode V2 `setup()` surface

- **Date:** 2026-10-05
- **Context:** `task-dispatcher` was bound to V1's `chat.message` event, which
  pushed a `{ type, text }` part onto `output.parts`. The other six hooks and the
  docs-discipline guard are written against three V1 surfaces that V2 does not
  have: `experimental.chat.system.transform`,
  `experimental.session.compacting`, and a mutable `tool.execute.*` output whose
  `{ title, output, metadata }` the guards append a verdict to. Under V2,
  `execute.after` reports a discriminated `{ status, result | error }` union and
  the `context` hook takes a `SystemPart[]`. The plugin therefore had one hook
  that could move and six that could not, and leaving all seven on V1 would have
  meant the task dispatcher did not run at all on a V2 runtime.
- **Decision:** `task-dispatcher` registers from the V2 `setup()` surface against
  the session `prompt` hook, with `ctx.session.hook("prompt", handler)`, and
  appends its instruction to `event.prompt.text` behind the user's own text,
  because V2 states that edits to the prompt become the canonical persisted user
  input. The append goes at the end and never the front: V2 requires attachment
  `mention` offsets to be updated or removed when prompt text is rewritten, and
  appending shifts none. An empty prompt is not annotated, because there is no
  intent to classify from it, and `lastIntent` is captured before the rewrite so
  it stays the user's own words. The other six hooks and the docs-discipline
  guard stay on the V1 `server()` surface and are recorded as inert under V2 — a
  deliberate, unfinished gap, not a completed port. The module default-exports
  one object carrying both surfaces, because V2 reads `id` and `setup()` and
  ignores `server()`, while OpenCode V1 `>= 1.18.29` reads `server()` and ignores
  `setup()`; a function export would be loadable by V1 only.
- **Consequences:** The V2 surface this hook targets is the contract the plugin
  file mirrors from `@opencode/plugin` 2.0.22, and the V1 floor of `>= 1.18.29`
  now applies only to the hooks that stayed behind. Behaviour is unchanged: the
  five scenarios, the five-line instruction, the `taskDispatcher.enabled` kill
  switch defaulting to `true`, and once-per-task semantics, because prompt
  admission is the same task boundary `chat.message` was. The config root
  resolves from `ctx.location.directory` with the working directory as the
  fallback, reading `.opencode/arsenal.json`. The kit census is untouched — 52
  locked components, 36 tier `core` plus 16 tier `conditional`, 0 pending, 7 of
  them hooks — because a guard changing runtime surface is not a new component.
  The same gap is now stated in `AI_GUIDE.md`, `README.md`, `README.ar.md`,
  `docs/00-INDEX.md`, `docs/01-OVERVIEW.md`, `docs/03-ARCHITECTURE.md`,
  `docs/04-VANGUARD.md`, and the Task dispatch section of the Vanguard skill,
  and the seven-hook table in `AI_GUIDE.md` marks the six V1 bindings as V1.
