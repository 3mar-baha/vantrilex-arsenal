# 05 — Kit Selection Record

`registry/catalog.json` is the single catalog. `.opencode/equip.manifest.json` is
the selection record that names which catalog tokens a project carries, and
`node scripts/verify-catalog.mjs` is what proves the selection resolves. The
lockfile this file used to document is abolished; no schema file constrains a
lock any more.

## Top level

The record is an object; the verifier reads `phases` and refuses a file that has
none. Four keys:

| Key | Shape |
|---|---|
| `schema_version` | integer, currently `1` |
| `generated_from` | string — provenance, e.g. the pre-abolition parity baseline |
| `phases` | object of array values, keyed by orchestrated phase |
| `notes` | string — free text for whoever reads the record next |

## A selection entry

Each entry is a `kind/id` token string inside the array of its phase:

| Field | Allowed values |
|---|---|
| `kind` | any kind the catalog schema declares: `skill`, `mcp`, `plugin`, `hook`, `agent`, `lsp`, `cli`, `theme`, `formatting`, `prompt`, `template`, `workflow`, `design.md`, `benchmark`, `dataset`, `policy` |
| `id` | `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| phase key | `scout`, `docs`, `plan`, `build`, `review`, `operate` |

`on-demand` is a catalog value, never a selection key: the record carries the six
orchestrated phases, and a token whose catalog row says `on-demand` is dropped
by the verifier rather than injected.

## The one hard invariant

A catalog row may claim `verified` only with a non-null `install_cmd`, and a null
command forces `unverified`. The selection does not restate that rule; it
inherits it from the catalog row, because `verified` asserts the command was run
against a real registry.

## No `pending`

Neither file carries a `pending` state. A token either resolves to a catalog row
or the verifier reports it as dropped and fails; nothing waits between approval
and installation.

## Phase and tier scoping

`tier` decides provisioning: `core` is the pre-approved Tier 0 set, while
`conditional` is chosen per project and needs explicit owner approval.

`phase` decides injection: `scripts/orchestrate-stage.sh` reads the record
through `catalogPhaseSets()` and injects only the components the current phase
needs. An id may be selected at two kinds — `red-team` is selected as both a
skill and an agent — so the `(kind, id)` pair, not the id, is the entry's
identity.

## Live census

Observed 2026-10-21 with the recount command from `00-INDEX.md`: 146 tokens
across six phases (scout 23, docs 7, plan 7, build 56, review 17, operate 36),
30 tier `core` plus 116 tier `conditional`, no dropped tokens. Re-run the recount
rather than quoting this line.

## What proves it

Four `verify-catalog.mjs` checks cover this file: `loadability/registers` for
every token resolving in `registry/catalog.json` and its sidecar, `phase-sets`
for every token placing into an orchestrated phase, `mcp-cap` for the Tier-0 MCP
budget, and `selection/top-level-skills` for the three top-level skills being
carried. See `02-SCRIPTS-VERIFY.md`.
