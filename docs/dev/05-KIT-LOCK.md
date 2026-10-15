# 05 — Kit Lock

`kit/kit.lock` is the pinned kit. `kit/kit.lock.schema.json` is its shape, and
`node scripts/verify-kit.mjs` is what proves the two agree.

## Top level

The lock is an object with `additionalProperties: false`, so an unknown key is
a violation rather than an extension point. Five keys are required:

| Key | Shape |
|---|---|
| `lockfileVersion` | integer, `const: 1` — the only accepted version |
| `kit` | string, `const: "vantrilex-core"` |
| `mcp_cap` | integer, minimum 1 — the Tier-0 MCP budget |
| `components` | array of pinned entries |
| `pending` | array of not-yet-built members |

## A component entry

Required keys: `id`, `kind`, `source`, `install_cmd`, `version_pin`, `phase`,
`tier`, `verification`. Again `additionalProperties: false`.

| Key | Allowed values |
|---|---|
| `id` | `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| `kind` | `skill`, `mcp`, `plugin`, `hook`, `agent`, `lsp`, `cli`, `theme` |
| `source` | `owner/repo` shape, or null |
| `install_cmd` | non-empty string, or null |
| `version_pin` | non-empty string, or null |
| `phase` | `scout`, `docs`, `plan`, `build`, `review`, `operate`, `on-demand` |
| `tier` | `core`, `conditional`, `extended` |
| `verification` | `verified`, `unverified` |

The lock's `kind` enum holds eight kinds. The catalog's holds nine: the catalog
also carries `formatting`. `formatting` cannot be pinned in the lock today, so
the lock is the narrower authority on what may be locked. The two enums move
independently — `theme` was added to the lock schema while this note was being
written, and `per-kind/theme` appeared in the verifier with it.

## The one hard invariant

A `verified` entry must carry a non-null `install_cmd`. The schema states this
as an `if`/`then`: when `verification` is `verified`, `install_cmd` is required
and must be a non-empty string. The converse holds too, in the catalog schema:
a null command forces `unverified`. A `verified` entry with a null command is
the single thing this schema refuses outright, because `verified` asserts the
command was run against a real registry.

## `pending`

A pending entry requires `id`, `kind`, and `reason`. Every pending id must be
absent from `components`, and the verifier's `pending-integrity` check fails
when a name appears in both. A pending entry is never installed silently.

## Phase and tier scoping

`tier` decides provisioning: `core` is the pre-approved Tier 0 set, while
`conditional` is chosen per project and needs explicit owner approval.
`extended` is the third, later tier.

`phase` decides injection: `scripts/orchestrate-stage.sh` reads each entry's
phase and injects only the components the current phase needs. `on-demand` is a
catalog value that is never injected by phase, because eager loading is exactly
the context cost the phase scoping exists to avoid. An id may be pinned at two
kinds — `red-team` is locked as both a skill and an agent — so the `(id, kind)`
pair, not the id, is the entry's identity.

## Live census

Observed 2026-10-14 with the recount command from `00-INDEX.md`: 113
components, 0 pending, `mcp_cap` 8. By kind: `cli` 64, `skill` 26, `mcp` 8,
`hook` 7, `agent` 6, `lsp` 1, `theme` 1. The `cli` entries dominate the count
and are all `conditional`. This file is owned by another lane and moved from 112
to 113 components during this session, so re-run the recount rather than
quoting this line.

## What proves it

Four `verify-kit.mjs` checks cover this file: `lockfile-validates` against the
schema, `catalog-agreement` for kind, phase, tier, command, and verification
against the mirror, `mcp-cap` for the Tier-0 MCP budget, and
`pending-integrity` for the pending list. See `02-SCRIPTS-VERIFY.md`.
