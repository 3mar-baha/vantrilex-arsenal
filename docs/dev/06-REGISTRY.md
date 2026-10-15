# 06 — Registry

The registry has three layers: the catalog Markdown, which is the source of
truth; the JSONL sidecars under `registry/data/`, which enrich the parsed rows;
and `registry/catalog.json`, the generated mirror. Schema validation ties the
layers together.

## The sidecars

One JSONL file per kind under `registry/data/`. Each non-blank line is one JSON
object that must carry a non-empty string `id`; its keys are limited to the
generator's `RECORD_FIELDS`; and if it carries a `kind`, that kind must equal
the file's kind, so a record cannot be misfiled. A sidecar refines the base row
parsed from the Markdown and never replaces it, and `id` and `kind` are never
overwritten by the patch.

Line counts observed 2026-10-14:

| Sidecar | Lines | Sidecar | Lines |
|---|---|---|---|
| `skills.jsonl` | 1504 | `hooks.jsonl` | 20 |
| `mcp.jsonl` | 907 | `formatting.jsonl` | 13 |
| `agents.jsonl` | 284 | `plugins.jsonl` | 11 |
| `cli.jsonl` | 64 | `lsp.jsonl` | 1 |
| `themes.jsonl` | 1 | | |

The single-writer law applies here: each sidecar has exactly one owning branch
at a time. Two branches writing one file is how merges conflict and data is
lost.

## The overlap map

`registry/data/overlaps.yaml` holds the relations that stop two colliding
components being installed together. It is not a sidecar and not a per-kind
file. It carries `schema_version: 1` and `generated_for: vantrilex-arsenal`, and
two relation types:

- `supersedes` — the members are alternatives, so exactly one is chosen. Each
  group names a `winner`.
- `pairs_with` — the members are complementary, so both are installed when both
  apply.

A group carries a label, a `note` stating why the relation exists, the winner
where one applies, and `members`, each with an `id`, a `kind`, and a `reason`.

**Id resolution.** The first catalog row holding a slug keeps the plain id; a
later row with the same slug is addressed as `slug-row-N`. Only one id in the
catalog needs that form. Four slugs are reused across two different kinds, so
every member also carries an explicit kind, and the kind decides which row the
id resolves to.

Observed live: the registry verifier's `orphan-references` check resolves 48 id
references across 60 overlap entries.

## Schema validation

Two schema versions sit in `registry/schema/`:

- `catalog-v3.schema.json` — current. Its `kind` enum has nine values:
  `skill`, `mcp`, `plugin`, `hook`, `agent`, `formatting`, `lsp`, `cli`,
  `theme`.
- `catalog-v2.schema.json` — the previous version, with eight; no `theme`.

A record requires only `kind` and `verification`, and the schema sets
`additionalProperties: false`, so the field set is closed. The record fields
are the seventeen listed in `03-SCRIPTS-GENERATE.md`.

The invariant mirrors the lock's: a null `install_cmd` must carry
`verification: unverified`. A bare repository slug is not an install command, so
it never populates `install_cmd` on its own.

## Extending the kinds

The mechanism is versioned, not editable. A kind is added by publishing a
**new** schema version file, never by editing a published version in place. The
v3 schema's own comment lists exactly what a new kind touches: the new schema's
`kind` enum and description; the generator's `KINDS`, `SECTION_KINDS`,
`SECTION_LABELS`, `SIDECAR_FILES`, `INDEX_DIRS`, and schema pointer; a new `##`
section in the catalog Markdown plus the Summary counts and folder paths; the
new sidecar and component files; then regeneration through the generator.
`verify-registry.mjs` needs no change for a new kind, because its checks are
kind-agnostic. `theme` was the first kind added this way.

## The mirror

`registry/catalog.json` is derived, never hand-edited. Observed live:
`catalog_version` 3 carrying 2805 records — `skill` 1504, `mcp` 907, `agent`
284, `cli` 64, `hook` 20, `formatting` 13, `plugin` 11, `lsp` 1, `theme` 1.
`node scripts/generate-catalog-json.mjs --check` proves it byte-current.

## What proves it

`node scripts/verify-registry.mjs` runs seven checks over these layers —
UTF-8 validity, schema conformance, row-count integrity, the install-command
invariant, orphan references, duplicate ids, and MCP name normalization. The
check-by-check detail is in `02-SCRIPTS-VERIFY.md`.
