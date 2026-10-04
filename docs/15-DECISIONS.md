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
