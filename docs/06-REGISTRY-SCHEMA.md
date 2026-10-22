# Registry Schema (Catalog v4)

Every component in the Vantrilex Registry is one catalog v4 record. A record
starts as a row parsed out of `registry/VANTRILEX_CATALOG.md` and becomes
authoritative once the matching `registry/data/*.jsonl` sidecar enriches it. The
machine-enforced contract is
`registry/schema/catalog-v4.schema.json`. This file explains the fields;
[07-CATALOG-GENERATION.md](07-CATALOG-GENERATION.md) explains how records are
built and merged, and `docs/dev/06-REGISTRY.md` carries the developer-level
detail.

## Record fields

| Field | Type | Meaning |
|---|---|---|
| `id` | string, required | Stable lowercase-hyphenated slug; the merge key against the sidecar and the record's identity |
| `name` | string | Display name exactly as authored, minus the default-selection marker |
| `kind` | string, required | One of the sixteen catalog kinds, from `skill` to `design.md` |
| `description` | string | One-line summary; truncated source rows keep their trailing mark as authored |
| `source` | string or null | The `owner/repo` collection the component installs from, or the canonical public repository for a self-shipped row |
| `origin` | string or null | The true upstream author repository when it differs from `source` |
| `install_cmd` | string or null | A real, runnable install command, or null when the class is command-free |
| `version_pin` | string or null | Exact version or tag; null means floating |
| `category` | string or null | Human grouping label used by the per-kind index |
| `tags` | string array | Lowercase hyphenated search keywords; empty array when unclassified |
| `when_to_use` | string or null | One-line trigger the model reads when deciding to load the component |
| `phase` | enum or null | `scout`, `docs`, `plan`, `build`, `review`, `operate`, `on-demand`, or null |
| `tier` | enum or null | `core`, `conditional`, `extended`, or null when untiered |
| `verify_cmd` | string or null | The command that proves the component works after installation |
| `cost_note` | enum or null | `light` or `heavy` context weight, null when unmeasured |
| `verification` | string, required | The constant `verified`: the record's class evidence exists and was checked |
| `class` | string, required | `loadable`, `installable`, `upstream`, or `data` — the class fixes which evidence proves the record |
| `evidence` | object, required | The proof the class demands: `source_proof`, `load_proof`, `command_registry` |
| `default_selected` | boolean | True when Vanguard provisions the component automatically |

Five fields are required: `id`, `kind`, `verification`, `class` and `evidence`.
The generator fills every field in the emitted mirror, and the schema rejects
unknown fields.

## The class-evidence model

`verification: verified` is no longer a claim about a command. It is a claim
that the record's **declared class evidence** exists:

| Class | Proven by |
|---|---|
| `upstream` | `source_proof` — the coordinate resolves |
| `data` | `source_proof` — the shipped file resolves; command-free |
| `loadable` | `load_proof` — the runtime surface exists |
| `installable` | `install_cmd` plus `command_registry` plus `load_proof` |

A class its kind does not admit is invalid: `hook`, `lsp` and `theme` are
`loadable` only, `cli` and `prompt` are `installable` only, and the data kinds
are `data` only. A `loadable` or `installable` record may never be verified on
source evidence alone, and a non-null `install_cmd` must name the registry that
proved it. Proofs are dated and expire — 90 days for a command, 180 for a load
surface, 365 for a source — after which the record becomes a candidate.

A record that cannot produce its class evidence is not carried here with a
weaker label. It becomes one row in `registry/candidates/<kind>.jsonl`, carrying
the failed class and one of six reason codes. The catalog holds 2,837 live rows
and 104 candidates.

## `origin` versus `source`

Catalog v1 conflated the aggregator with the author: a component redistributed
by an awesome-list lost its real home. v2 introduced both fields and v4 keeps
them. `source` names the collection the component installs from; `origin` names
the true upstream author repository when it differs, and stays null when
`source` is already the author.

A self-shipped component — one that ships inside this repository — cites the
canonical public repository that carries it rather than leaving `source` null.
That is why the twelve `theme` rows name `3mar-baha/vantrilex-arsenal` and
`mcp/github` names `modelcontextprotocol/servers`. The source is provenance, not
a substitute for the load proof.

## The `on-demand` phase

`phase` places a component in the lifecycle, but discovery and forging are not
lifecycle phases: `find-skills` and `skill-creator` load whenever the catalog
has no fit, not on a schedule. The `on-demand` value admits exactly that. A
null phase means the component spans phases or has not been placed yet — it
does not mean on-demand. The full phase map is in
[05-DOCTRINE.md](05-DOCTRINE.md).

## The evidence invariants

Three rules hold together, and the schema enforces each:

1. **A live record is `verified`.** The v3 `unverified` state is retired; an
   unproven record is a candidate.
2. **A command is never guessed.** A bare repository slug is not an install
   command and never populates the field. A plausible-looking wrong command is
   worse than an admitted gap, because an agent will run it.
3. **A command names its proof.** Any non-null `install_cmd` requires a
   `command_registry` whose `command` equals it byte for byte.

For the `cli` kind the command is additionally required to *install* the tool:
a package-manager invocation such as `npm i -g <pkg>` or `brew install
<formula>`, or the vendor's own official installer. A bare package name is not
an install command, and a `curl … | sh` pipe is refused outright because it
executes unreviewed remote code. The rule and its rationale are in
[09-KIT-LOCK.md](09-KIT-LOCK.md).

The verifier's `command-honesty/*` and `evidence/ttl` checks (see
[08-VERIFICATION.md](08-VERIFICATION.md)) fail the registry on any violation.

## Tier semantics

| Tier | Meaning | Index position |
|---|---|---|
| `core` | Tier-0: provisioned on every project, pre-approved | Leads the per-kind index |
| `conditional` | Tier-1: Vanguard adds only when the project requires it | Follows core |
| `extended` | Catalog depth beyond the conditional kit | After conditional |
| null | Untiered: carried as authored, not yet placed | Last |

38 records carry tier `core` today, including Prime, Vanguard, and Doctrine.
The 19 default-selected components are the provisioning set Vanguard installs
automatically. Tier-0-only guarantees apply: only the core set gets install and
verification promises (see [15-DECISIONS.md](15-DECISIONS.md)).

## Identity rules

- `id` matches `^[a-z0-9]+(?:-[a-z0-9]+)*$`: lowercase, hyphenated, no
  leading or trailing hyphens. An MCP row whose display name is already
  `owner/repo` slugs by joining both segments.
- `id` is required on every live record and on every candidate. A record that
  cannot be addressed cannot be live.
- `id` is unique within its kind, not across kinds. Four slugs are reused
  across two kinds, so overlap entries always carry an explicit kind to say
  which row an id resolves to.
- Within one kind, the first row keeps the plain slug and later collisions
  take a `-row-<N>` suffix. Exactly one id in the catalog needs that form
  today. The default-selection marker is a trailing mark in the source table
  and never part of the name or the id.
