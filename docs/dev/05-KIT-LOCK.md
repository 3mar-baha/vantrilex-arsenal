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

A catalog row is live only with the evidence its class requires: `source_proof`
for `upstream` and `data`, `load_proof` for `loadable`, and `install_cmd` plus
`command_registry` plus `load_proof` for `installable`. The selection does not
restate that rule; it inherits it from the catalog row, because `verified` now
asserts that the class evidence exists and was checked. A token whose catalog row
is missing is either dropped (a gate failure) or suspended (below) — never
silently resolved.

## No `pending`

Neither file carries a `pending` state. A token either resolves to a catalog row
or it does not; nothing waits between approval and installation. The two honest
exceptions are a **suspension** on the selection side and a **candidate** on the
catalog side, and neither is a pending approval — both are recorded dispositions
with their own evidence.

## Suspended entries

The record may carry one extra top-level array, `suspended`, holding a
disposition per selected token whose catalog row is missing:

```json
"token": "mcp/brave",
"reason": "missing-address",
"since": "2026-10-22",
"document": ".opencode/audit/MISSING-ADDRESS.md"
```

| Field | Contract |
|---|---|
| `token` | A `kind/id` token exactly as it appears in a `phases` array. The token stays there; the suspension adds a disposition, it does not remove the entry |
| `reason` | Closed to `missing-address`. A suspension cannot absorb a load, shape or command failure |
| `since` | ISO `YYYY-MM-DD` date the disposition was taken |
| `document` | Repository-relative path that must exist, so a suspension cannot point at a document nobody wrote |

No other field is read and no other field is accepted. The gate fails an entry
carrying an unknown key.

Semantics, resolved on every `verify-catalog.mjs` run:

- **Active** — the token still has no catalog row. It is held out of
  `loadability/registers` and `phase-sets`, counted, and reported as suspended,
  never as missing.
- **Stale** — the token is live again. The entry stops applying automatically,
  the token becomes an ordinary selected token, and it must resolve and place
  again. Recovery needs no manifest edit: address → evidence → re-proof →
  re-admission, and the suspension lapses on its own.
- Reversibility was proven byte-identically at P4: adding an eighteenth entry,
  running the gate, and removing that line returned the manifest to its original
  SHA-256.

## Phase and tier scoping

`tier` decides provisioning: `core` is the pre-approved Tier 0 set, while
`conditional` is chosen per project and needs explicit owner approval.

`phase` decides injection: `scripts/orchestrate-stage.sh` reads the record
through `catalogPhaseSets()` and injects only the components the current phase
needs. An id may be selected at two kinds — `red-team` is selected as both a
skill and an agent — so the `(kind, id)` pair, not the id, is the entry's
identity.

## Live census

Observed 2026-10-22 with the recount command from `00-INDEX.md`: 146 tokens
across six phases (scout 23, docs 7, plan 7, build 56, review 17, operate 36),
of which 17 are suspended by missing address and 129 resolve to live catalog
rows (0 dangling, 0 stale suspensions). The pre-suspension tier split was 30
tier `core` plus 116 tier `conditional`; the 17 suspended tokens are among them
and restore automatically when their rows return. Re-run the recount rather than
quoting this line.

## What proves it

Five `verify-catalog.mjs` checks cover this file: `loadability/registers` for
every token resolving in `registry/catalog.json` and its sidecar (or being
suspended), `phase-sets` for every resolvable token placing into an orchestrated
phase, `selection/suspension` for the disposition record, `mcp-cap` for the
Tier-0 MCP budget, and `selection/top-level-skills` for the three top-level
skills being carried. See `02-SCRIPTS-VERIFY.md`.
