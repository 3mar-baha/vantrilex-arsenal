# Changelog

All notable changes to Vantrilex Arsenal are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed

- **Tier-0 census re-ratified at 49 locked components.** The owner-authorized
  figure for `kit/kit.lock` is now **49 = 34 tier core + 15 tier conditional,
  0 pending**. The earlier 36-component figure was ratified 2026-10-04 and is
  superseded by the 13 conditional components added by the digest-candidate and
  parked-idea work: twelve in-repo conditional skills (`lenis`, `og-image`,
  `open-graph-image`, `time-capsule-test`, `kit-evaluation-journal`, `red-team`,
  `skill-shadow`, `documentation-as-tests`, `kit-evolution-log`,
  `kill-switch-document`, `babel-bridge`), the in-repo `red-team` agent, and the
  upstream `a11y-audit` agent. All 13 are `tier conditional` and
  `verification unverified` with a null `install_cmd`, so none of them raises
  the Tier-0 core count. The 8-MCP cap is unchanged, and the decision to keep
  both conditional hooks stands.
- Every current-state documentation site that asserted 36 components now reads
  49: `README.md`, `docs/03-ARCHITECTURE.md`, `docs/04-VANGUARD.md`,
  `docs/08-VERIFICATION.md`, `docs/09-KIT-LOCK.md`,
  `docs/13-CONTRIBUTING-WORKFLOW.md`, `CONTRIBUTING.md`, and both
  `VANTRILEX_SKILLS_SPEC.md` copies. Released changelog history and the
  decision log in `docs/15-DECISIONS.md` are left as written; the design-time
  arithmetic in `docs/spec/VANTRILEX_KIT_SPEC.md` stays as the original
  specification's own record.

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