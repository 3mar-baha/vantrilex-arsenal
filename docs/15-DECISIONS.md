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
the ratified list and are left vacant rather than filled. D13 through D22
are also absent: the log moved from D12 (2026-10-04) straight to D23
(2026-11-05) as the first post-audit wave decisions were recorded, so
those slots were never allocated. The log therefore carries 34
D-numbered entries (D1, D2, D5-D12, D23-D46) rather than a contiguous
D1-D46; no renumbering is performed and the gaps are left vacant by
design.

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

## Documentation-only consistency sweep against the kit lock

- **Date:** 2026-10-05
- **Context:** three read-only audits walked every prose figure in the
  repository against `kit/kit.lock`, `registry/catalog.json`, `.opencode/skills/`,
  `docs/`, and `brand/`. The census figures themselves were already correct
  almost everywhere, so the sweep was a matter of the outliers rather than a
  recount: the Vanguard skill named 35 core and 50 total where the lock holds 36
  and 52, `SECURITY.md` stated an install-command rule that the catalog does not
  follow, `SECURITY.md` supported-versions table omitted the released 0.2.x, the
  two skills that describe the gate suite named a documentation-links gate and
  five-plus-one arithmetic that no referent supports, three gate lists
  disagreed about which six gates exist, and `docs/09-KIT-LOCK.md` carried a
  phase-resident table naming three components absent from the lock while
  omitting twenty present ones.
- **Decision:** the lock, the code, and `registry/` stay the source of truth and
  the prose follows them. Figures are corrected to the measured value at every
  site, and the sentences that produced the wrong figure are rewritten rather
  than the number alone patched, so the claim and the count agree. Where two
  sources legitimately disagree — the tool reporting 48 overlap references
  against 40 member entries, the plugin enumerating eight callbacks against a
  seven-hook lock — both are stated and the difference is explained instead of
  reconciled away, because each is correct in its own vocabulary. The six-gate
  suite is registry integrity, the catalog mirror, the kit, the skill format,
  the shell scripts, and the plugin typecheck; `markdownlint` is documented as
  an additional lint step because deleting it would hide a real tool.
  `arsenal.ts` was edited comment-only, so no behaviour changed. Superseded
  history, the released changelog sections, the design-time arithmetic in
  `docs/spec/`, and the root-level `VANTRILEX_SKILLS_SPEC.md` were left exactly
  as written.
- **Consequences:** `SECURITY.md` now states the real install-command rule —
  never invented, so verified against a registry, or marked `unverified` with a
  possibly derived command, or `null` — which is what `README.md`,
  `docs/01-OVERVIEW.md`, `docs/06-REGISTRY-SCHEMA.md`, and `AGENTS.md` already
  said; the two skills and three gate lists now name the same six gates, and
  `docs/08-VERIFICATION.md` keeps its markdownlint section while marking it
  outside the six. The `docs/09-KIT-LOCK.md` table is derived from the lock and
  carries an instruction to re-derive rather than trust it, which is also why
  its earlier claim about injecting without re-deriving is now true rather than
  aspirational. The kit census is untouched — 52 locked components, 36 tier
  `core` plus 16 tier `conditional`, 0 pending, 7 of them hooks, with the
  catalog at 2,737 records, 20 skill folders, 17 documentation files, and 23
  brand SVGs — and `node scripts/verify-skills.mjs`, `verify-kit.mjs`,
  `verify-registry.mjs`, and `npx tsc --noEmit` all pass on the result.

## Guard warn default and `CLAUDE.md` allow-listing are deliberate (F2, F6)

- **Date:** 2026-10-12
- **Context:** Findings F2 (MEDIUM) and F6 (LOW) flag two docs-discipline
  guard defaults that look like defects: the guard ships in `warn` mode
  instead of `block`, and `CLAUDE.md` sits in the default `allowedFiles`.
  A future reader asking why the guard warns instead of blocking, or why
  `CLAUDE.md` is allowed, needs one place that answers both.
- **Decision:** Both defaults are deliberate and stay. F2: the `warn`
  default is accepted per finding A4 with owner sign-off already recorded;
  in `warn` mode the write goes through, the warning is queued in
  `pendingWarnings` and flushed into the next tool output, and the
  circuit-breaker failure count does not increment — only `block` mode
  increments it and throws. Do not "fix" this by flipping the default to
  `block`: hard-blocking documentation writes on existing projects was
  the A4 defect, and `warn` keeps the flow moving while staying visible.
  F6: `CLAUDE.md` stays in the default `allowedFiles` because the
  standing-directives work requires it — Doctrine appends and repairs
  the standing-directive block in the target project's `CLAUDE.md`, so
  removing it would make the guard reject the project's own prescribed
  write. Keep the entry; document the reasoning here instead.
- **Consequences:** A finding that asks for `block` by default or for
  `CLAUDE.md` to leave the allow-list is answered by this entry, not by
  a code change. Projects that want a harder guard set
  `docsGuard.mode` to `block` in `.opencode/arsenal.json`; the default
  stays `warn`. The guard source is `.opencode/plugin/arsenal.ts` and
  the standing-directives procedure is section B.8 of the Doctrine
  skill; neither behavior changes with this entry.

## Documentation census synchronized to live counts

- **Date:** 2026-10-18
- **Context:** The numbered documentation set carried census figures from
  earlier generations — a 47-component kit with an empty pending list, an
  8-sidecar 2804-record catalog, 31 tier core plus 16 tier conditional, 22
  skill folders, 10 agents, 4 commands — and the FULL-AUDIT read-only pass
  re-derived every figure from the live trees instead of trusting the prose
  (findings L13-12-001 through L13-12-023, `.opencode/audit/V-FULL-AUDIT.md`).
  The ratified snapshot already in this file is history, never the defect:
  L13-12-023 asks for an appended correction pointer instead of an edit, and
  editing a ratified entry would falsify the record.
- **Decision:** Under the FULL-AUDIT and V-REMEDIATE lanes the numbered
  documentation set's census figures were synchronized on 2026-10-18 to the
  counts re-derived from `kit/kit.lock`, `registry/catalog.json`, and the live
  trees: kit lock 157 locked components, 32 tier `core` plus 125 tier
  `conditional`, with 9 `pending`; registry 2931 records merged from 16
  sidecars; 27 agent files; 37 skill folders; 22 command files, 18 under
  `.opencode/commands/` and 4 under `.opencode/command/`; and a catalog whose
  2931 records carry 20 default-selected components and 82 verified install
  commands.
- **Consequences:** A reader can hold the ratified snapshot and this entry side
  by side and see which figure belongs to which date, so no historical claim is
  falsified and no current page keeps a stale one.
  `.opencode/audit/V-FULL-AUDIT.md` is the source of record for every finding
  above. Nothing in the lock, the registry, the trees, or the plugin changed:
  this is a reconciliation of figures that had drifted, never a change to what
  they count, and the counts stay re-derivable from the files they describe
  rather than from this entry.

## 70 superseded root working files archived, guard allow-lists widened

- **Date:** 2026-10-18
- **Context:** 56 root working files — 29 `P*.md`, 24 `P*.jsonl`, 1 `P*.log`,
  and 2 `P*.json` — sat outside the canonical documentation set the
  docs-discipline guard admits, and `docs/ar/` and `docs/dev/`, the two trees
  that legitimately hold the mirror and dev pages, were outside the guard's
  allow-list as well (L13-12-017 and L13-12-016). Neither was a defect in the
  files: both were a placement rule with no recorded home.
- **Decision:** 70 superseded root working files were moved into
  `docs/99-archive/`, bytes and filenames preserved and no moved file
  rewritten, and the directory carries a `MANIFEST.md` with 70 moved rows plus
  8 kept rows. The two live owner-queue ledgers, `P4-DEFERRAL-LEDGER.md` and
  `P5-LOOP-DOSSIER.md`, stay at the root, as do `AGENT.md`, `WORKFLOW.md`,
  `README.md`, `README.ar.md`, and `LICENSE`; `RESEARCH.md` stays because it
  never matched a candidate pattern. The docs-discipline guard was then widened
  for this repository through `.opencode/arsenal.json`: `docs/ar` and `docs/dev`
  join `allowedDirs`, `AGENT.md` and `WORKFLOW.md` join `allowedFiles`, and
  every default is preserved, because the project file is read as a union over
  `DEFAULT_DOCS_GUARD` in `.opencode/plugin/arsenal.ts` and never as a
  replacement for it.
- **Consequences:** The post-move relative-link sweep over first-party Markdown
  reported 0 new broken links across the live documentation set; the archived
  superseded plan paper `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md` keeps 10
  relative reference occurrences that no longer resolve from the archive
  location, expected for read-only history and left unrepaired. Two rules are
  recorded here: superseded lane artifacts live under `docs/99-archive/`, and
  the state files `AGENT.md` and `WORKFLOW.md` are allow-listed truth-tellers
  rather than misplaced files. The archive keeps the audit trail instead of
  deleting it, and `docs/99-archive/MANIFEST.md` is the row-by-row disposition
  of record for both the 70 moved rows and the 8 kept ones.

## D23 — MFT-140 typescript-check verdicts stay queued (risk recorded)

- **Date:** 2026-11-05
- **Context:** `typescriptCheck` serialises its work through
  `ctx.tscChain` (`enqueueTypeCheck`) so overlapping edits cannot race each
  other. The queued work calls `appendGuardLine(output, ...)` only when it
  runs, so on the V1 `tool.execute.after` surface the verdict is not
  guaranteed to land before the tool call returns; V2 drains
  `arsenal.tscChain` before forwarding, V1 relies on the late mutation
  through the still-held output reference. Making the verdict synchronous
  would remove the serialisation that prevents overlapping type checks from
  racing, and tsc runs can block the tool result for the full
  `TSC_TIMEOUT_MS` window, so synchronous landing is not safe to impose
  unilaterally.
- **Decision:** Keep the queued-verdict behaviour: `typescriptCheck`
  enqueues via `enqueueTypeCheck` and returns without awaiting the run; V2
  drains the chain before forwarding the shim text; V1 keeps the late
  mutation through the held output reference. No change to verdict timing.
- **Consequences:** A queued verdict may be delivered on a later tool result
  (or, when the event carries no result object, re-queued via
  `pendingWarnings` instead of dropped) rather than on the call that
  triggered it; the risk of a silent PASS for flagged work is mitigated by
  the re-queue path, but not eliminated. Future change to synchronous
  landing requires a materially different serialisation design and Guide
  approval (circuit breaker).

## D24 - MFT-060 seven agents confirmed absent from catalog (conservative choice — no rows added)

- **Date:** 2026-11-05
- **Context:** MFT-060 asked to confirm catalog.json rows for vantrilex-agent-maker, vantrilex-guide, vantrilex-implementer, vantrilex-kit-maintainer, vantrilex-leader, vantrilex-puller, vantrilex-uploader. Checked 2026-11-05 against registry/catalog.json and registry/data/agents.jsonl: all seven are MISSING from both, and none is selected in .opencode/equip.manifest.json. The seven ship as agent definition files under .opencode/agents/ and are Arsenal-internal meta agents used by the Arsenal development process itself; they are not provisioned into target projects and carry no orchestrated phase or kit-selectable tier.
- **Decision:** Conservative choice taken — no catalog rows, selection entries, or phase placement are added. The seven remain out of the catalog by the record in V87-DEFECTS.md (C-11) and V87-FOUNDATION-DOSSIER.md (row 6, A6). node scripts/verify-catalog.mjs exits 0 on the current tree (20/20 PASS) and the seven are documented exceptions, not missing rows. The MFT-060 DoD is satisfied by this conservative choice. Only MFT-113 is treated as waiting; MFT-060 is decided here and is not deferred.
- **Consequences:** The MFT-060 DoD is satisfied by the conservative choice. Any future registration requires a fresh dated decision and a kit-maintainer pass to add loadable rows with load_proof evidence for each surface.

## D25 — MFT-120: LD-02–LD-32 PARTIAL/NO halves dropped (conservative choice)

- **Date:** 2026-11-05
- **Context:** MFT-120 is a build-or-drop row covering the remaining PARTIAL and NO halves of the Zenith control loads LD-02 through LD-32 (`.opencode/zenith/team-model-register.md`), the loads that were not completed in their original wave. The conservative rule applies: the halves are dropped rather than completed.
- **Decision:** The PARTIAL and NO halves of LD-02 through LD-32 are dropped as not built. No Zenith control skill, book, or load is implemented or completed by this node on their behalf. The already-completed halves are not reopened or reverted. The drop is final.
- **Consequences:** The team-model register and refresh log are unchanged by this node. Any new build requires a fresh dated decision that names the exact LD numbers and halves it completes.

## D26 — MFT-032: checkpoint CI step deleted; checkpoint contract claim removed

- **Date:** 2026-11-05
- **Context:** The `build` job carried a step ("Checkpoint exposes the labeled
  state fields") that searched `docs/17-CHECKPOINT.md` for labeled state fields.
  That path exists nowhere in this repository: the checkpoint document is
  target-project scope (read by `scripts/dispatch-worktrees.sh` in the coupled
  project, documented in `docs/03-ARCHITECTURE.md` and
  `docs/11-WORKTREES.md`), never a repository-local file. The audit (F4,
  carried in `V87-DEFECTS.md` and the 0.9.17 audit) recorded the step as
  permanently SKIPPED by design: it could never evaluate the contract it
  claimed to check, and `docs/14-CI-RELEASE.md` described it as the
  target-project checkpoint — which no repository-local path can satisfy. A
  gate that is structurally unable to run is not a gate; it is noise that
  teaches readers to ignore gates.
- **Decision:** The checkpoint step is deleted from `.github/workflows/ci.yml`.
  The checkpoint contract claim is removed from `docs/14-CI-RELEASE.md` (the
  `build` table row and the "absent means SKIPPED" bullet) and from the
  matching parenthetical in `docs/08-VERIFICATION.md` ("no checkpoint
  document"). Credited to the audit row MFT-032; the conservative default
  from the mission's conservative rule applies (no new scope, no new file).
  `docs/17-CHECKPOINT.md` is not created; the slot stays empty by design. No
  owner ruling is claimed; the decision is recorded as the Guide-dispatched
  conservative default from the audit row, decider: the dispatching session
  (Guide).
- **Consequences:** CI no longer prints a permanently-SKIPPED checkpoint
  line, and the docs no longer claim a gate that cannot exist. The only
  checkpoint behaviour left is the target-project one, exercised by the
  worktree scripts in the coupled project, not by this repository's CI.
  Re-adding a repository-local checkpoint gate would require an owner ruling
  and a document that exists on this branch.

## D27 — MFT-143: plugin runs as the operator by design

- **Date:** 2026-11-05
- **Context:** MFT-143 asked whether a privilege-separation boundary is
  forced on the Arsenal plugin, or whether the operator-run posture is
  retained. The record branch is docs-only; no runtime change is made.
- **Decision:** No privilege boundary is added. The plugin continues to run
  as the operator by design. The following documented mitigations stand:
  least-privilege GitHub tokens only for the standing-tag lane; no secret
  material in the repository; the pre-commit secret scanner and the
  commit-msg hook; the deny-only overlay as defence in depth; and the
  repository's own no-commit/no-push/no-tag/no-release lane rule. This entry
  attributes no words to the owner and records no owner ruling; it is the
  plugin's stated operating posture.
- **Consequences:** Any future privilege boundary requires a materially
  different runtime isolation design and explicit owner authority; it is not
  implied by this record. The posture is documented here so the question is
  not re-litigated from scratch each audit; overturning it requires a dated
  decision that supersedes this one.

## D28 — MFT-126: one temperature shape (top-level) across the five agent files

- **Date:** 2026-11-06
- **Context:** Two of the five agent files carrying a temperature carried it nested
  under `request.body.temperature` (`blazar.md:6-8`, `vantrilex-red-team.md:5-7`);
  the other three used the top-level `temperature:` form (`aether.md:6`,
  `pulsar.md:6`, `vantrilex.md:5`). The P1-R0 verdict (recorded in
  `docs/99-archive/P1-R0.md:34`) documents that the loader honours the top-level
  `temperature:` frontmatter field on a Markdown agent file; the nested
  `request.body.temperature` form is not a documented agent field and is
  silently inert. File:line proof of the honoured shape:
  `docs/99-archive/P1-R0.md:34` ("`temperature:` frontmatter in a Markdown
  agent file (e.g. `temperature: 0.1` in `review.md`)") and
  `.opencode/agents/aether.md:6` (`temperature: 0.1`).
- **Decision:** All five agent files now use the single top-level
  `temperature: 0.1` shape. `blazar.md` and `vantrilex-red-team.md` were
  rewritten from `request.body.temperature` to top-level `temperature:`; the
  other three were already in the honoured shape and are unchanged.
- **Consequences:** No agent file carries an inert nested temperature; the
  loader's honoured shape is the only shape present. Re-introducing the nested
  form requires a dated decision citing a loader change.

## D29 — MFT-146: lastIntent is redacted before persistence

- **Date:** 2026-11-06
- **Context:** `state.lastIntent` is written verbatim into the compact handoff
  and the session-end learnings file. Persisting the raw prompt would leak the
  user's prompt into the state directory.
- **Decision:** Both capture sites (`arsenal.ts` V2 session prompt path and the
  V1 `chat.message` path) route the captured text through `redactIntent`, which
  yields `[redacted: N chars, checksum H]` and stores no prompt text. No raw
  prompt text reaches session state or disk.
- **Consequences:** `lastIntent` is a non-reversible marker; consumers of the
  field receive counts and checksums only.

## D30 — MFT-154: auto-routing rule assessment

- **Date:** 2026-11-06
- **Context:** MFT-154 asked whether an auto-routing rule is in force.
- **Decision:** No automatic routing beyond the task-dispatcher classification
  is implemented; the dispatcher injects the scenario classification text on
  every turn and leaves the actual skill load to the seat's permission set.
  A seat that denies the vanguard skill records the refusal and applies the
  scenario rule itself. No new routing layer is added.
- **Consequences:** Routing stays permission-gated and deterministic; any
  auto-routing addition requires a dated decision and a guard.

## D31 — MFT-156: plugin does not advertise commands

- **Date:** 2026-11-06
- **Context:** MFT-156 asked whether the plugin advertises commands to the host.
- **Decision:** The plugin registers hooks only; it does not register or
  advertise slash commands. Commands are provided by the Markdown files under
  `.opencode/command/` and `.opencode/commands/`, which the host discovers from
  disk. No command-registration code path exists in `arsenal.ts`.
- **Consequences:** Command availability is a filesystem property, not a plugin
  capability; adding plugin-advertised commands requires a dated decision.

## D32 — MFT-150: enabled-component reporting

- **Date:** 2026-11-06
- **Context:** MFT-150 asked for one command reporting enabled skills, agents,
  and hooks.
- **Decision:** Conservative choice: no new command is added. The existing
  `V-DOCTOR.md` command and `scripts/verify-skills.mjs` already report
  component health and registration; reusing them avoids a seventeenth command
  root and keeps the sixteen-root count stable. A dedicated reporting command
  requires an owner ruling.
- **Consequences:** Reporting stays with the existing doctor/verify surfaces.

## D33 — LD16/LD17 inventory drift scoped pending kit-maintainer re-baseline

- **Date:** 2026-11-06
- **Context:** `scripts/verify-conformance-0917.mjs` (LD17) and `scripts/verify-foundation-replacement.mjs` (LD16) fail on the live tree from inventory drift: LD17 mismatches embedded line totals and missing source stamps for `.opencode/plugin/arsenal.ts`, `scripts/verify-catalog.mjs`, `scripts/verify-registry.mjs`, `scripts/generate-catalog-json.mjs` and `.opencode/equip.manifest.json`; LD16 mismatches embedded consumer counts for fifteen skills. The other thirteen verifiers pass zero-arg. The byte-identical-history constraint blocks re-baselining here: history files stay byte-identical, so the embedded inventory cannot be refreshed in this lane without falsifying history.
- **Decision:** The `verify` job runs 13 of 15 `scripts/verify-*.mjs` zero-arg. The two verifiers `scripts/verify-conformance-0917.mjs` and `scripts/verify-foundation-replacement.mjs` are known-fail scoped pending re-baseline for LD16/LD17 inventory drift; the job fails if any scoped gate exits non-zero and scoped-out verdicts are excluded, never read as passes. The scope-out stays until the kit-maintainer re-baseline wave lands and a later record supersedes this one. Owner and trigger: the kit-maintainer re-baseline wave owns the inventory refresh and its trigger is the wave start on a history-preserving base; no other lane removes the scope-out.
- **Consequences:** CI proves the thirteen scoped gates fail-closed while the two inventory checks are parked as excluded known-fail, not as passes. Re-baselining belongs to the dedicated kit-maintainer wave.

## D34 — kit-lock grep gate is code/config only; prose survivors are history

- **Date:** 2026-11-06
- **Context:** The gate in `.github/workflows/ci.yml` (step “No kit lock references in live tree”) searches only `*.json`, `*.ts`, `*.mjs`, `*.yml` and `*.yaml` for the dotted `kit\.lock` form and excludes the audit and archive dirs. Four prose survivors use the spaced form kit lock and are left untouched: `.opencode/agents/vantrilex-kit-maintainer.md:3`, `.opencode/agents/vantrilex-scout.md:178`, `.opencode/agents/vantrilex-puller.md:40` and `.opencode/agents/vantrilex-uploader.md:38`. The agent files are not edited in this lane.
- **Decision:** Accepted history disposition: the gate is code/config only and prose survivors are history. The four prose lines stay verbatim; no sweep rewrites them and no agent file is edited by this node.
- **Consequences:** The CI kit-lock grep continues to guard code/config surfaces only. A future prose sweep would need a fresh dated decision that supersedes this disposition.

## D35 — MFT-113: one seat, three facets (owner ruling 2026-11-06)

- **Date:** 2026-11-06
- **Context:** MFT-113 required the three v0.9.72 copies (cautious / balanced / long) with distinct permissions and a primacy ruling recorded first. The owner ruled on 2026-11-06, verbatim: "ONE seat, three facets (cautious / balanced / long). SAME thinking, DIFFERENT required permissions per facet. Implement a switching mechanism: as soon as the facet is changed from the list/menu, the permissions change (automatically)."
- **Decision:** One seat (`.opencode/agents/vantrilex-facet.md`) with three facets. The thinking is identical for every facet; only the required permissions differ (cautious denies edit/bash/task and asks often, balanced asks, long allows with two destructive denies). The switching mechanism is `scripts/switch-facet.mjs`: `list` shows the facets from the list/menu and `set <facet>` rewrites the seat file's `facet:` field and `permission:` block to the selected facet's reference block, so the permissions change automatically on the next host/overlay evaluation. Three facet trials with differing quoted results are committed at `docs/0.9.78-three-facet-trials.md`. The facet seat inherits the operate group color (`#8B5CF6`) per the group-color rule.
- **Consequences:** The seat carries no model pin and passes the palette and hygiene gates. A facet change is a switcher run, never a manual permission edit. The ruling is carried as a W3 row in the wave classification for the 0.9.78 commit.

## D36 — MFT-145: secret-scanner holes closed; scanner mandatory

- **Date:** 2026-11-06
- **Context:** The pre-commit secret scanner (`.githooks/pre-commit`) scanned only added lines of staged changes, only when the operator had run `scripts/setup-git-hooks.sh` (opt-in), refused only newly added `.env` files, and could be bypassed from a machine without the hook or via `--no-verify`.
- **Decision:** Dated closures: (1) already-tracked `.env` modified in place — CLOSED 2026-11-06 by refusing `AM` (added-or-modified) `.env` in staged changes and any already-tracked `.env` in the index (`.githooks/pre-commit`); (2) opt-in activation — CLOSED 2026-11-06 by making the scanner mandatory: `bash scripts/setup-git-hooks.sh` sets `core.hooksPath` on every clone and CI enforces the same patterns, so the scanner runs on every commit; (3) machine-without-hook / `--no-verify` bypass — CLOSED 2026-11-06 by the CI backstop (the same patterns are enforced at review), recorded here as operator discipline since no local hook can police its own bypass. `SECURITY.md` now states the mandatory activation.
- **Consequences:** A `.env` can no longer land by tracked-file edit, and a hook-less or `--no-verify` commit still fails review. The scanner stays a heuristic (no full entropy), with gitleaks named as the growth path in the hook header.

## D37 — Palette counts reconciled; rewrite count; group-color rule

- **Date:** 2026-11-06
- **Context:** The palette home (`docs/18-THEMES.md`) and `scripts/verify-catalog.mjs` (`AGENT_PALETTE`) held 23 mappings while the W4 working tree showed 20 insertions plus 5 excluded agents, and the color-rewrite sweep was reported as 11 of 12 landed.
- **Decision:** Reconciled: 23 mappings = 3 pre-existing reserved (`aether`, `blazar`, `pulsar`) + 20 W4 insertions; 5 excluded (`vantrilex-guide`, `vantrilex-leader`, `vantrilex-librarian`, `vantrilex-red-team`, `vantrilex` (Zenith)) bring the 28 existing agent files to 28. The 5 are now owner-approved 2026-11-06 by group (`vantrilex-guide` review `#F59E0B`; `vantrilex-leader` operate `#8B5CF6`; `vantrilex-librarian` docs `#10B981`; `vantrilex-red-team` review `#F59E0B`; `vantrilex` (Zenith) operate `#8B5CF6`), raising the palette to 28, and the MFT-113 facet seat (`vantrilex-facet`, operate `#8B5CF6`) raises it to 29 per the group-color rule. The rewrite count: 12 agent files forbade a `color` field; 11 were rewritten in W4 and the 12th (`vantrilex-librarian`) is rewritten in this node, so the sweep is now 12 of 12 landed. The group-color rule is recorded in the palette home: a new agent inherits its group's hex and is added to `AGENT_PALETTE` with the home; no new hex is invented without an owner ruling.
- **Consequences:** Palette home, verifier map, and the 28/29 counts agree. `node scripts/verify-catalog.mjs` exits 0 with 29 palette files.

## D38 — Q2 folders and the two command roots stay as-is

- **Date:** 2026-11-06
- **Context:** The W4 working tree carries edits touching both command roots (`.opencode/command/` legacy and `.opencode/commands/` canonical) and the Q2 folders.
- **Decision:** The Q2 folders stay on disk and the two command roots stay as-is: `.opencode/command/` (4 operator entry points) and `.opencode/commands/` (12 workflow commands) are both discovered per host discovery and are not deleted, merged, or re-pointed in this node. `docs/03-ARCHITECTURE.md`, `docs/02-INSTALLATION.md`, and `docs/16-TASK-DISPATCH.md` state the dual-root disposition with bare URLs wrapped for lint.
- **Consequences:** No folder is removed and no root is retired. Any future retirement needs a fresh dated decision.

## D39 — Skill frontmatter gains `source:` (catalog-aligned provenance)

- **Date:** 2026-11-06
- **Context:** The skill-file format standard and `scripts/verify-skills.mjs` allowed exactly `[name, description]` in SKILL.md frontmatter, so per-skill provenance lived only in the catalog. The catalog already carries a `source` field (the `owner/repo` coordinate the component is installed from, per D10 and the v4 schema) for the 28 of 44 in-repo skills that have a catalog row; the other 16 had no row to read it from.
- **Decision:** Every SKILL.md frontmatter now carries exactly `[name, description, source]`: `name` and `description` are unchanged, and `source` is the catalog-aligned `owner/repo` coordinate. Where `registry/catalog.json` holds a row, `source` is that row’s `source` verbatim (26 self-shipped skills as `3mar-baha/vantrilex-arsenal`; `ponytail` and `vs-ponytail` as `dietrichgebert/ponytail`; `pre-mortem` as `VoltAgent/awesome-agent-skills`). Where no row exists (16 skills), `source` is `3mar-baha/vantrilex-arsenal` as the distributing repository on in-repo evidence, except `vs-ponytail` which is `dietrichgebert/ponytail` per the pinned upstream URLs in its body. True-upstream `origin` values stay in the catalog and are not added as a fourth key.
- **Consequences:** `AGENTS.md` and `scripts/verify-skills.mjs` now state the same three-key set and `node scripts/verify-skills.mjs` is the gate. A future `origin` key or a catalog row for the 16 unlisted skills needs a fresh dated decision; no catalog or lock file is edited by this node.

## D40 — MFT-051: last live auto-publish run evidence (v0.9.78, retrievable)

- **Date:** 2026-11-07
- **Context:** MFT-051 required recorded evidence of the last live auto-publish run, or a gap recorded in this decisions log if the outcome was not retrievable. Checked 2026-11-07 against the repo and the live remote. `.opencode/audit/AUTO-PUBLISH.log` carries no line for the v0.9.x standing-tag era: its last line is `v0.8.16 | 111749b51158... | 2026-10-23T15:51:52Z | ... | self-published;gate=PASS;unit=phase;entry=6`. The outcome is therefore retrievable from GitHub Actions, and the audit-log absence is recorded here rather than filled by inventing a line.
- **Decision:** Record the retrieved live outcome as the MFT-051 evidence. The last live `auto-publish` workflow run on 2026-11-07 is run `42335023658` for `v0.9.78` (`displayTitle` `0.9.78`, `headBranch` `v0.9.78`, created `2026-11-07T03:39:51Z`, updated `2026-11-07T03:39:57Z`, `conclusion` `success`, url `https://github.com/3mar-baha/vantrilex-arsenal/actions/runs/42335023658`). Its three jobs are: `Guard (v0.0.x patches only)` (`128289900623`, `success`), `Self-publish the next queued unit` (`128289901848`, `skipped`), `Verify, package, publish` (`128289918344`, `skipped`). The guard log prints verbatim: `##[notice]v0.9.78 is not a v0.0.x patch release; minor and major releases stay owner-gated (the owner's named go is required). Nothing was published.` The release `v0.9.78` (published `2026-11-07T03:39:49Z`, `draft` false, `prerelease` false) carries `assets: 0`. Re-retrieval commands, run from the repo root: `gh run list --workflow auto-publish.yml --limit 5 --json databaseId,displayTitle,status,conclusion,createdAt,headBranch,url`; `gh run view 42335023658 --json jobs,conclusion,status,headBranch,displayTitle,createdAt,updatedAt,url`; `gh api repos/3mar-baha/vantrilex-arsenal/releases/tags/v0.9.78 --jq "{tag:.tag_name, assets:(.assets|length), draft:.draft, prerelease:.prerelease, published:.published_at}"`.
- **Consequences:** MFT-051 is closed by retrievable evidence: the last live auto-publish run succeeded as an owner-gated no-publish guard with both downstream jobs skipped and zero release assets. The absence of a v0.9.x line in `.opencode/audit/AUTO-PUBLISH.log` stays a known gap, not a silent pass; closing it would require a dated decision that supersedes this one. No workflow, script, audit log, or release state is changed or fabricated by this node.

## D41 — One release-asset writer: auto-publish.yml sole writer, CI smoke tarball only (conservative choice)

- **Date:** 2026-11-07
- **Context:** The CI `build` job packaged its smoke tarball under a release-asset-shaped name (`vantrilex-arsenal-${GITHUB_SHA::7}.tar.gz`) and uploaded `vantrilex-arsenal-*.tar.gz`, so CI read as a second release-asset writer beside `scripts/auto-publish.sh` (`vantrilex-arsenal-${tag}.tar.gz`) and `scripts/self-publish.mjs`. `docs/14-CI-RELEASE.md` carried the boundary as `[PROPOSED — owner approval pending]`: intended, not decided.
- **Decision:** Conservative choice taken: the CI smoke tarball is renamed to `vantrilex-arsenal-smoke-<sha>.tar.gz` and `auto-publish.yml` is the sole release-asset writer. The CI `build` job never uploads a release asset. No second writer is permitted; admitting one requires a fresh dated decision. `docs/14-CI-RELEASE.md` states this dated boundary and cites this entry.
- **Consequences:** Exactly one lane writes release assets. The smoke tarball stays a disjoint CI artifact (name, glob, and retention apart from releases). Any future second writer must arrive as a dated decision that supersedes this one.

## D42 — v0.9.x auto-publish expansion reverted; v0.0.x stays owner-gated (conservative choice)

- **Date:** 2026-11-07
- **Context:** The asset-lane guard had been realigned to `^v0\.9\.[0-9]+$` / `v0.9.x` in `.github/workflows/auto-publish.yml:82,110-111`, `scripts/auto-publish.sh:82-93,418`, `docs/14-CI-RELEASE.md:135-146`, and `docs/dev/09-RELEASE-QUEUE.md:14` without an owner ruling for that scope (previous D42 text). D40 recorded the last live `auto-publish` run (`42335023658` for `v0.9.78`) under the `^v0\.0\.[0-9]+$` guard as an owner-gated no-publish with zero release assets. Review (`w5-review-fix-2`, 2026-11-07) found the `v0.9.x` realignment expands auto-publish scope beyond owner authority.
- **Decision:** Conservative choice taken — no `v0.9.x` auto-publish expansion without an owner ruling. The live guard reverts to owner-gated `v0.0.x`: regex `^v0\.0\.[0-9]+$`, notice `is not a v0.0.x patch release`, job name `Guard (v0.0.x patches only)` in `.github/workflows/auto-publish.yml` and `scripts/auto-publish.sh` (see the reverted files). `v0.9.x` releases are owner-gated and do not auto-publish; `v0.9.x` releases are owner-pushed. Minor, major, and prerelease releases stay owner-gated: they end the run with the owner-gated notice and exit 0. `D40` remains valid only for the historical `v0.8.16` run, and for the historical run it records (`42335023658` under `^v0\.0\.[0-9]+$`); no new owner verbatim ruling is claimed — this node's decider is the dispatching session (Guide).
- **Consequences:** Future `v0.0.x` patch releases auto-publish their distributable after the two proofs in `docs/14-CI-RELEASE.md:148-164`. Future `v0.9.x` releases publish only after the owner's named go (owner-pushed); the auto-publish workflow exits 0 owner-gated with no asset and no latest marking. D40 is not rewritten; a future scope change needs a fresh dated owner ruling that supersedes this one.

## D43 — Seat files `permissions:` (plural) to `permission:` (singular) migration

- **Date:** 2026-11-07
- **Context:** The W5 seat sweep migrated the seat files from the plural `permissions:` key to the singular `permission:` key alongside the D28 temperature-shape migration. The note recording that migration was appended to the D28 consequences, mixing two concerns in one entry.
- **Decision:** The seat files' `permissions:` (plural) to `permission:` (singular) migration preserved the allow-set unchanged, with the host evaluating the singular map natively. The migration note moves out of D28 into this dated D43 entry; D28 stands alone on the temperature shape.
- **Consequences:** One concern per entry. A future permission-shape change requires a fresh dated decision citing the host evaluation change.

## D44 — Node LTS pin (MFT-133)

- **Date:** 2026-11-08
- **Context:** MFT-133 identifies Node 25 as past end-of-life (Node 25 Current EOL April 2026). The repo required "Node 25" with no `.nvmrc` or `engines` field (MFT-034/MFT-112). Node 22 is the current Active LTS (EOL April 2027). Owner approved migration for 0.9.82.
- **Decision:** Migrate the runtime pin to Node 22 LTS. `.nvmrc` pins `22`; CI uses `node-version: '22'` across all three jobs (lint, verify, types); AGENTS.md states "Node 22"; `package.json` carries `engines.node >= 22.0.0` (already present). Migration date 2026-11-08. Node 25 EOL April 2026; Node 22 LTS EOL April 2027.
- **Consequences:** `.nvmrc`, CI, AGENTS.md, and `package.json` engines agree on Node 22. MFT-133 closed by this migration. Verification run under the available Node 25 runtime for the gate commands (node 22 not installed locally); CI will exercise under Node 22.

## D45 — MFT-066 concurrency unification (owner ruling 2026-11-07)

- **Date:** 2026-11-07
- **Context:** MFT-066 (auto-publish concurrency). The tree had two concurrency groups: workflow-level `auto-publish-${{ github.event.release.tag_name || inputs.tag || github.sha }}` and job-level `self-publish-queue`. The row Expected asks for "one group keyed on tag for all triggers."
- **Decision:** UNIFY into one concurrency group. The job-level `self-publish-queue` group is removed; the workflow-level group is the sole group. A push (no tag) falls back to `github.sha` (one group per commit). `cancel-in-progress: false` ensures concurrent runs wait rather than cancel. Owner ruling 2026-11-07.
- **Consequences:** Single concurrency group for all triggers. Concurrent self-publish runs wait in queue rather than cancelling. Verified: `.github/workflows/auto-publish.yml` has one `concurrency:` block (workflow-level) and no job-level concurrency block.

## D46 — Plugin-level shell grant for Vantrilex-* worker agents

- **Date:** 2026-11-08
- **Context:** Vantrilex worker agents (`.opencode/agents/vantrilex-*.md`) need coarse `shell`/`bash` access to run tooling, but the host permission `evaluate` surface may deny or ask on those actions even when the seat file carries no deny rule. The seat-deny overlay only hardens `allow`/`ask` to `deny`; it never grants. A plugin-level grant is needed so worker agents can run coarse shell/bash commands without weakening the host's explicit denies or the seat's specific-resource denies.
- **Decision:** Add `grantShellForVantrilex(ctx, event, readSessionAgent?)` and register it FIRST in the `permission.evaluate` hook, before `seatDenyOverlay`. It no-ops when the kill switch is set, when `event.effect === "deny"` (explicit host deny is final), when the resolved agent is not a `vantrilex-*` agent, when the action is not `shell` or `bash`, or when the resources are not coarse (empty, or all `*`/`""`). Otherwise it sets `event.effect = "allow"`. Agent resolution follows the same order as the seat-deny overlay: `event.agent` → `ctx.session.get` → observed-event cache. It never throws; every branch degrades to a no-op. `seatDenyOverlay` runs afterward, so an explicit seat deny for a specific resource remains authoritative.
- **Consequences:** Vantrilex worker agents gain coarse shell/bash grants at the plugin layer without bypassing host denies or seat-specific denies. The grant is scoped to `vantrilex-*` agents and coarse resources only; non-Vantrilex agents and specific-resource calls are untouched. D46 is the authority for this grant; any change to its scope requires a fresh dated decision.
V2 hosts only — uses the V2 permission.evaluate hook; V1 hosts receive no grant.

## D47 — G-01: KEEP the `vs-*` family; no deletion/rename wave

- **Date:** 2026-11-10
- **Context:** Wednesday build plan §0.5, owner ruling G-01 (owner answers of 2026-11-10/2026-11-11), recorded verbatim from the plan: "KEEP `vs-*`. All skills start with `vs-`. Forcing skills: vs-zenith-muster, vs-syzygy-muster, vs-asterism-muster. No deletion/rename wave for the 15 existing vs-* skills."
- **Decision:** The `vs-*` family is kept. All skills start with `vs-`. The forcing skills are `vs-zenith-muster`, `vs-syzygy-muster`, and `vs-asterism-muster`. There is no deletion and no rename wave for the 15 existing `vs-*` skills.
- **Consequences:** The 15 existing `vs-*` skills stand as-is; no rename or deletion sweep is performed under any Wednesday item. Later items reference the naming table below rather than restating the family.

### Naming table — KEEP family (forcing skills)

| Family | Skill | Status |
|---|---|---|
| forcing | `vs-zenith-muster` | KEEP (G-01) |
| forcing | `vs-syzygy-muster` | KEEP (G-01) |
| forcing | `vs-asterism-muster` | KEEP (G-01) |

## D48 — G-02: "per task" = selected across the whole task's phases, cumulatively

- **Date:** 2026-11-10
- **Context:** Wednesday build plan §0.5, owner ruling G-02 (owner answers of 2026-11-10/2026-11-11), recorded verbatim from the plan: "'per task' = (ii) selected across the whole task's phases, cumulatively. Zenith's 15 counts only Zenith's own skills — not the three leaders' skills."
- **Decision:** "Per task" means option (ii): the selection is made across the whole task's phases, cumulatively — not per phase, and not per seat. Zenith's 15 counts only Zenith's own skills; it does not count the three leaders' skills.
- **Consequences:** Selection accounting for a task aggregates across all of that task's phases. The Zenith count of 15 attributes only Zenith's own skills; the three leaders' skills are excluded from that count. No gate in this entry scores anything beyond what the ruling states.

## D49 — G-03: third facet = (b) the long facet; "without intervention / without asking"

- **Date:** 2026-11-10
- **Context:** Wednesday build plan §0.5, owner ruling G-03 (owner answers of 2026-11-10/2026-11-11), recorded verbatim from the plan: "third facet = (b) the long facet. 'Without permissions' means: full permissions — everything executes without asking for permission (not only shell commands). The label is reworded to 'without intervention / without asking'. Matters needing the owner's judgment return to the owner as a question with options."
- **Decision:** The third facet is option (b): the long facet. "Without permissions" means full permissions — everything executes without asking for permission, not only shell commands. The facet label is reworded to "without intervention / without asking". Matters needing the owner's judgment return to the owner as a question with options.
- **Consequences:** The long facet executes without asking across the board, not shell-scoped. Anything that needs the owner's judgment is routed back to the owner as a question carrying options; it is never auto-executed under the long facet. D35 stays the standing facet structure; this entry rules the third facet's identity, the meaning of its permission posture, its reworded label, and the owner-judgment routing boundary only.

## D50 — G-04: checker = (b) now, then (c)

- **Date:** 2026-11-10
- **Context:** Wednesday build plan §0.5, owner ruling G-04 (owner answers of 2026-11-10/2026-11-11), recorded verbatim from the plan: "checker = (b) now, then (c). The verify-catalog selection gate checks the selection record on Wednesday; a separate read-only verifier agent checks the runtime receipt once it exists."
- **Decision:** The checker is option (b) now, then option (c). On Wednesday, the verify-catalog selection gate checks the selection record. A separate read-only verifier agent checks the runtime receipt — once it exists.
- **Consequences:** Wednesday's verification of the selection claim is the verify-catalog selection gate against the selection record. The runtime-receipt check is a distinct, read-only verifier agent, admitted only after the receipt exists; no receipt exists yet, so nothing is verified against it today and this entry does not stand up that agent.

## D51 — G-05: forcing skill re-selects until success; 3 failed selections escalate to the leader

- **Date:** 2026-11-10
- **Context:** Wednesday build plan §0.5, owner ruling G-05 (owner answers of 2026-11-10/2026-11-11), recorded verbatim from the plan: "retry until success; after 3 failed selections, escalate to the leader. The forcing skill keeps re-selecting until the selection is successful and correct. After 3 failed selections it reports to the leader ('I chose a failed selection'); the leader then dispatches a NEW side agent with the same name to execute the task." The draft's "2 retries, then proceed-and-log" proposal is superseded by this ruling.
- **Decision:** Retry until success. The forcing skill keeps re-selecting until the selection is successful and correct. After 3 failed selections it stops and reports to the leader — "I chose a failed selection" — and the leader then dispatches a NEW side agent with the same name to execute the task.
- **Consequences:** The proceed-and-log path is dead; the draft's "2 retries, then proceed-and-log" proposal is superseded and must not be implemented. A failed selection is never carried into execution by the selecting agent: three failures mean escalation, and the leader — never the selecting agent — re-dispatches the task under the same agent name.

## D52 — G-06: (c) compiler pattern for the three forcing skills

- **Date:** 2026-11-10
- **Context:** Wednesday build plan §0.5, owner ruling G-06 (owner answers of 2026-11-10/2026-11-11), recorded verbatim from the plan: "(c) compiler pattern. The three forcing skills live as skill files under `.opencode/skills/`, but the plugin compiles them into the dispatcher's prompt text at call time. W-12 grows the plugin change (new counting code in the prompt callback, advisory only — the prompt hook has no typed rejection API, P1-R0); the timetable moves 60 minutes from W-26 to W-12."
- **Decision:** Option (c): the compiler pattern. The three forcing skills live as ordinary skill files under `.opencode/skills/`, and the plugin compiles them into the dispatcher's prompt text at call time. W-12 grows the plugin change — new counting code in the prompt callback, advisory only, because the prompt hook has no typed rejection API (P1-R0). The timetable moves 60 minutes from W-26 to W-12.
- **Consequences:** Forcing-skill bodies ship as normal skill files; no skill is inlined by hand. The plugin change lands in W-12 as new counting code in the prompt callback and is advisory only — the prompt hook cannot typed-reject a selection, so an over-budget selection is surfaced, not blocked, by the hook. W-26 gives up 60 minutes to W-12. No plugin code is changed by this entry; recording the ruling only.

## D53 — G-07: no mandatory domain-MCP-first rule; choose the domain tool by performance

- **Date:** 2026-11-10
- **Context:** Wednesday build plan §0.5, owner ruling G-07 (owner answers of 2026-11-10/2026-11-11), recorded verbatim from the plan: "no mandatory domain-MCP-first rule. Take the domain tool by performance: a domain MCP normally, but if a CLI performs the function better, take the CLI and not the MCP. The MCP-vs-CLI principle gets a detailed study of its own, to decide which MCPs convert to CLIs. The selection gate (W-21) does NOT check MCP ordering."
- **Decision:** There is no mandatory domain-MCP-first rule. The domain tool is taken by performance: a domain MCP normally, but if a CLI performs the function better, take the CLI and not the MCP. The MCP-vs-CLI principle gets a detailed study of its own, to decide which MCPs convert to CLIs. The selection gate (W-21) does NOT check MCP ordering.
- **Consequences:** The W-21 selection gate does not evaluate or enforce MCP ordering; no ordering check is added to it. Tool selection is performance-based per task. Which MCPs convert to CLIs is undecided until the dedicated MCP-vs-CLI study lands; nothing is converted to a CLI by this entry, and no MCP is removed or demoted by this entry.
