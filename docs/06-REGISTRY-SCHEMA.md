# Registry Schema (Catalog v2)

Every component in the Vantrilex Registry is one catalog v2 record. A record
starts as a row parsed out of `registry/VANTRILEX_CATALOG.md` and becomes
authoritative once the matching `registry/data/*.jsonl` sidecar enriches it.
The machine-enforced contract is
`registry/schema/catalog-v2.schema.json`. This file explains the fields;
[07-CATALOG-GENERATION.md](07-CATALOG-GENERATION.md) explains how records are
built and merged.

## Record fields

| Field | Type | Meaning |
|---|---|---|
| `id` | string, required | Stable lowercase-hyphenated slug; the merge key against the sidecar |
| `name` | string | Display name exactly as authored, minus the default-selection marker |
| `kind` | string, required | One of `skill`, `mcp`, `plugin`, `hook`, `agent`, `formatting`, `cli` |
| `description` | string | One-line summary; truncated source rows keep their trailing mark as authored |
| `source` | string or null | The `owner/repo` collection the component installs from |
| `origin` | string or null | The true upstream author repository when it differs from `source` |
| `install_cmd` | string or null | A real, runnable install command — or null when none is verified |
| `version_pin` | string or null | Exact version or tag; null means floating |
| `category` | string or null | Human grouping label used by the per-kind index |
| `tags` | string array | Lowercase hyphenated search keywords; empty array when unclassified |
| `when_to_use` | string or null | One-line trigger the model reads when deciding to load the component |
| `phase` | enum or null | `scout`, `docs`, `plan`, `build`, `review`, `operate`, `on-demand`, or null |
| `tier` | enum or null | `core`, `conditional`, `extended`, or null when untiered |
| `verify_cmd` | string or null | The command that proves the component works after installation |
| `cost_note` | enum or null | `light` or `heavy` context weight, null when unmeasured |
| `verification` | string, required | `verified` or `unverified`: the provenance of the record's claims |
| `default_selected` | boolean | True when Vanguard provisions the component automatically |

Only `kind` and `verification` are required at parse time; the generator fills
every field in the emitted mirror, and the schema rejects unknown fields.

## `origin` versus `source`

Catalog v1 conflated the aggregator with the author: a component redistributed
by an awesome-list lost its real home. Catalog v2 keeps both. `source` names
the collection the component installs from; `origin` names the true upstream
author repository when it differs, and stays null when `source` is already
the author. A record that claims `verified` must have had both its install
command and its origin checked against a real registry or repository. The
12 verified install commands in the 2737-record catalog carry that provenance;
everything else is `unverified`.

## The `on-demand` phase

`phase` places a component in the lifecycle, but discovery and forging are not
lifecycle phases: `find-skills` and `skill-creator` load whenever the catalog
has no fit, not on a schedule. The `on-demand` value admits exactly that. A
null phase means the component spans phases or has not been placed yet — it
does not mean on-demand. The full phase map is in
[05-DOCTRINE.md](05-DOCTRINE.md).

## The install-command invariant

A null `install_cmd` must carry verification `unverified`, enforced by the
schema itself: a record claiming `verified` with a null command is invalid,
because `verified` asserts the command was run against a real registry. A bare
repository slug is not an install command and never populates the field on
its own. A plausible-looking wrong command is worse than an admitted gap,
because an agent will run it — so unverified commands stay null rather than
guessed. The verifier's install-command check (see
[08-VERIFICATION.md](08-VERIFICATION.md)) fails the registry on any violation.

For the `cli` kind the command is additionally required to *install* the tool:
a package-manager invocation such as `npm i -g <pkg>` or `brew install
<formula>`, or the vendor's own official installer. A bare package name is not
an install command, and a `curl … | sh` pipe is refused outright because it
executes unreviewed remote code. The rule and its rationale are in
[09-KIT-LOCK.md](09-KIT-LOCK.md).

## Tier semantics

| Tier | Meaning | Index position |
|---|---|---|
| `core` | Tier-0: provisioned on every project, pre-approved | Leads the per-kind index |
| `conditional` | Tier-1: Vanguard adds only when the project requires it | Follows core |
| `extended` | Catalog depth beyond the conditional kit | After conditional |
| null | Untiered: carried as authored, not yet placed | Last |

36 records carry tier `core` today, including the 3 Arsenal skills.
The 22 default-selected components are the provisioning set Vanguard
installs automatically. Tier-0-only guarantees apply: only the core set gets
install and verification promises (see [15-DECISIONS.md](15-DECISIONS.md)).

## Identity rules

- `id` matches `^[a-z0-9]+(?:-[a-z0-9]+)*$`: lowercase, hyphenated, no
  leading or trailing hyphens. An MCP row whose display name is already
  `owner/repo` slugs by joining both segments.
- `id` is unique within its kind, not across kinds. Four slugs are reused
  across two kinds, so overlap entries always carry an explicit kind to say
  which row an id resolves to.
- Within one kind, the first row keeps the plain slug and later collisions
  take a `-row-<N>` suffix. Exactly one id in the catalog needs that form
  today. The default-selection marker is a trailing mark in the source table
  and never part of the name or the id.
