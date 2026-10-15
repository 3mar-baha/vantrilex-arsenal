# P1 Rename Checklist — Lowercase Scope Check

- Lane: VTA-EXPANSION-05 P1. Node: `p1-rename` (wave 21 of 35).
- Branch: `wt/vta-expansion-03`. Date (UTC): 2026-10-15.
- Classification: Scenario 1 NEW TASK — no rename task was in flight; this note starts it.
- Status: checklist only. This file changes nothing; the rename itself belongs to its own sequenced wave.

## B2 Amendment Restated

Owner ruling 2026-10-15 (B2 plus phase and tier ruling, recorded in AGENT.md):

- Lowercase everywhere for machine-checked surfaces: file stem, frontmatter name, lock id, registry key. Never `Vantrilex-*` on those surfaces.
- Naming-law amendment: side agents display lowercase `vantrilex-*`; leaders display capitalized (Blazar, Aether, Pulsar) with lowercase machine ids (`blazar`, `aether`, `pulsar`).
- All 14 side agents are conditional with a group tag plus a parent group (dev and design groups parent to build; exploration and review groups parent to audit).
- Three leaders are core; leader files (P1 and P2) document catalog access.
- Commands stay omitted: the dedicated commands library is PARKED to v0.8.
- Prose history (CHANGELOG entries, ledger rows, prior doc mentions) is outside the B2 enumeration and stays as written.

## Leaders-Capitalized Rule

- Display form of a leader is capitalized: Blazar, Aether, Pulsar.
- Machine form of a leader is lowercase everywhere it is checked: file stem (`aether.md`), frontmatter name (`aether`), lock id, registry key.
- A capitalized leader display string in prose docs is correct and is not a rename target.
- A capitalized leader string in any machine-checked surface (filename, frontmatter, lock, sidecar) is a defect and is renamed to lowercase.

## Scope-Checked Surfaces

Every `Vantrilex-*` display reference must be lowercase on each surface below. Check them in this order; each row names its proof command.

| # | Surface | Rename target | Proof |
|---|---|---|---|
| 1 | Agent definition filenames under `.opencode/agents/` | `Vantrilex-*.md` stems become `vantrilex-*.md`; leader stems are already lowercase (`aether.md`, `pulsar.md`, `blazar.md`) | `ls .opencode/agents/` shows zero capitalized stems |
| 2 | Agent frontmatter `name` values | Each `name` is lowercase-hyphenated and identical to its filename stem | Grep frontmatter names and compare against stems; `node scripts/verify-kit.mjs` exits 0 |
| 3 | `kit/kit.lock` component ids | Every agent id matches `^[a-z0-9]+(?:-[a-z0-9]+)*$`; no capitalized id ships | `node scripts/verify-kit.mjs` exits 0 |
| 4 | Registry sidecar rows in `registry/data/agents.jsonl` | Every row key is lowercase and resolves to a definition file that exists | `node scripts/verify-registry.mjs` exits 0 |
| 5 | Generated catalog mirror and indexes | `registry/catalog.json`, `VANTRILEX_CATALOG.md`, and per-kind `_index.md` files carry the lowercase ids | Regenerate through the generator, never hand-edit; entry count matches the counted census |
| 6 | Canonical docs under `docs/` | Machine-checked references (ids, filenames, keys) are lowercase; capitalized leader display names in prose are correct and stay | Every relative link resolves; the census in the docs matches the counted numbers |

## Out of Scope (Explicitly Not Renamed Here)

- Shipped command files under `.opencode/commands/` (the `V-*` command set, including `V-FULL-AUDIT.md`): commands stay omitted per the B2 ruling and the dedicated commands library is PARKED to v0.8, so no command file is renamed by this checklist.
- Prose history: CHANGELOG entries, ledger rows, and prior doc mentions that record the old capitalized form stay as written.
- No frontmatter pin key is added to any file by this checklist; the standing zero-pin law holds across all touched files.

## Close-Out Proof Required

- `node scripts/verify-kit.mjs` exits 0 after any rename wave.
- `node scripts/verify-registry.mjs` exits 0 after any rename wave.
- `npx --yes markdownlint-cli` on any touched note file exits 0.
