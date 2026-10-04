# Changelog

All notable changes to Vantrilex Arsenal are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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
- **Vantrilex Vanguard scout skill** (merge pending owner release): six-step procedure
  (preflight, four-state detection, Arabic chatbot-relay prompt, source surveying,
  five-step selection, install-plus-verify-plus-report), the 28-file documentation
  contract with its 8-folder grouping, and per-kind verification protocols.
  (Committed on its branch; merge pending owner release.)
- **Vantrilex Doctrine law skill** (merge pending owner release): seven constitutional
  laws, Leader/Guide/Implementer decision rights with escalation ladder, mandatory
  phase map, five workflows with the three second-pass guards given substance, three
  session rituals, and §33B parallelism mechanics. (Committed on its branch; merge
  pending owner release.)
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
- **`kit/kit.lock`** (merge pending owner release): 34 pinned Tier-0 entries plus
  2 pending for the unmerged skills, its JSON schema, and `scripts/verify-kit.mjs`
  (11 per-kind checks).
- **`scripts/verify-skills.mjs`** (merge pending owner release): 10 skill-format
  checks including the mechanism single-home rule and the phase-map cross-check.
- **The 16-file Arsenal documentation set under `docs/`**
  (merge pending owner release).
- **Four kit skills registered in the catalog** (merge pending owner release):
  Vanguard and Doctrine as Tier-0 default-selected, session-context-primer and
  preflight-system-doctor as conditional; the catalog now carries 2,719 records with
  22 default-selected.

  Round 2a (mechanism skills, plugin, roles, orchestration) is on main; every other
  Round-2 entry above is branch-only until its owner release.

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
- Catalog sidecar corrections (merge pending owner release): the `github`
  default-selected flag set true (markdown said selected, sidecar said false),
  `ponytail-debt` phase set to operate per the mandatory phase map, and ten Tier-0
  skill phases/tiers corrected to that map with on-demand admitted as a phase.
- The Doctrine session-start ritual now delegates anchor mechanics to
  session-context-primer instead of duplicating its template (single-home rule)
  (merge pending owner release).
- **Tier-0 census note (ratified 2026-10-04):** Ratified counting: 32 core records + 2 conditional hooks = 34 locked entries (36 with the two kit skills now locked as built). The two conditional hooks (typescript-check-after-editing-ts-tsx-files, auto-format-js-ts-files-with-prettier-after-edits) are kept: they are part of the six hooks per kit spec §2.4 and explicitly conditional, and removing them would lose function. Ratified by owner 2026-10-04; no component was changed to resolve it.

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
- Generator `--markdown` is now idempotent (merge pending owner release): it was
  re-sorting rows case-sensitively and rewriting Install cells, producing output its
  own parser rejected.
- Generator `--indexes` now writes the plural kind directories and preserves
  the hand-authored formatting index instead of overwriting it
  (merge pending owner release).
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

[Unreleased]: https://github.com/3mar-baha/vantrilex-arsenal/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/3mar-baha/vantrilex-arsenal/releases/tag/v0.1.0