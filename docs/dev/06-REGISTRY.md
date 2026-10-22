# 06 — Registry

The registry has three layers: the catalog Markdown, which is the source of
truth; the JSONL sidecars under `registry/data/`, which enrich the parsed rows;
and `registry/catalog.json`, the generated mirror. A fourth surface holds what
the catalog refuses: `registry/candidates/<kind>.jsonl`, one file per kind that
failed its class evidence.

Catalog v4 is live. `catalog_version` is `4` in the mirror, and every live row
is validated against `registry/schema/catalog-v4.schema.json`.

2026-10-22 — **New-kind onboarding stays FROZEN until the P6 sign-off.** v4
publishes with the same sixteen kinds v3 carried; no new kind is registered
before the P6 publish. The freeze is about kinds, not rows: existing kinds keep
gaining and losing records.

## The sixteen kinds

| Kind | Component files | Sidecar | Admitted classes (v4) |
|---|---|---|---|
| `skill` | `registry/skills/` | `skills.jsonl` | `loadable`, `installable`, `upstream` |
| `mcp` | `registry/mcp/` | `mcp.jsonl` | `loadable`, `upstream` |
| `plugin` | `registry/plugins/` | `plugins.jsonl` | `loadable`, `upstream` |
| `hook` | `registry/hooks/` | `hooks.jsonl` | `loadable` only |
| `agent` | `registry/agents/` | `agents.jsonl` | `loadable`, `upstream` |
| `formatting` | `registry/formatting/` | `formatting.jsonl` | `upstream` only |
| `lsp` | `registry/lsp/` | `lsp.jsonl` | `loadable` only |
| `cli` | `registry/cli/` | `cli.jsonl` | `installable` only |
| `theme` | `registry/themes/` | `themes.jsonl` | `loadable` only |
| `prompt` | `registry/prompts/` | `prompts.jsonl` | `installable` only |
| `dataset` | `registry/datasets/` | `datasets.jsonl` | `data` only |
| `template` | `registry/templates/` | `templates.jsonl` | `data` only |
| `policy` | `registry/policies/` | `policies.jsonl` | `data` only |
| `benchmark` | `registry/benchmarks/` | `benchmarks.jsonl` | `data` only |
| `workflow` | `registry/workflows/` | `workflows.jsonl` | `data` only |
| `design.md` | `registry/design/` | `design.jsonl` | `data` only |

The kind bound is applied before any evidence is judged: a record may not pick a
class its kind does not admit. That is why the eight command-carrying MCP rows
are `loadable` records with a command leg, never `installable` — an MCP server
is a process-resident surface, not a provisioned binary.

## The class-evidence model (V4-1)

Every live record declares a `class`, and the class fixes which evidence proves
it. `verification` is the constant `verified`: v3's carried `unverified` state is
retired, and a row that cannot produce its evidence is not a live row.

| Class | Proven by | Command |
|---|---|---|
| `upstream` | `source_proof` — the coordinate resolves | `install_cmd` is `null` by contract |
| `data` | `source_proof` — the shipped file resolves | `install_cmd` is `null` by contract (R3) |
| `loadable` | `load_proof` — the runtime surface exists | `null` when self-shipped, otherwise a registry-proven command |
| `installable` | `load_proof` plus `command_registry` plus a non-null `install_cmd` | required |

Three proof shapes, each a dated observation:

- `source_proof` carries `target`, `path`, `method` (`repo-resolves` or
  `file-resolves`) and `checked_at`.
- `load_proof` carries `surface`, `method` (`surface-exists`,
  `callback-wired`, `server-bin`, `frontmatter-valid`, or
  `file-copy-target`) and `checked_at`.
- `command_registry` carries `command`, `registry` (one of fifteen named
  families, from `npm` to `file-copy`) and `checked_at`. The command must equal
  the record's `install_cmd`; a reference to a different command proves nothing.

**No dilution.** A `loadable` record may not be verified on source evidence
alone, and any non-null `install_cmd` must name the registry that proved it.
`source_proof` may sit beside a `load_proof`, but it can never take its place.
The schema enforces the rule in `allOf`, so a diluted record fails validation
rather than passing quietly.

**Evidence TTL (R7).** A proof is a dated observation, and it ages:

| Proof | Window | Why |
|---|---|---|
| `command_registry` | 90 days | registries and package versions move fastest |
| `load_proof` | 180 days | a surface outlives a version but not a refactor |
| `source_proof` | 365 days | a repository coordinate is the slowest fact to change |

Past its window a record is **evidence-lapsed** and becomes a candidate at the
next audit. `scripts/verify-catalog.mjs` runs `evidence/ttl` on every pass; JSON
Schema carries no clock and does not pretend to.

## The candidate surface (V4-3)

A record that fails even the evidence its class demands is not carried as a live
row with a weaker label. It becomes one line in `registry/candidates/<kind>.jsonl`,
validated against the schema's `$defs.candidate` root:

```text
id  kind  name  class  reason {code, detail}  checked_at
source?  origin?  install_cmd?  attempted?
```

A candidate never carries `verification`, keeps the class it was assessed under
(a row can pass a weaker class later: an MCP with no provable executable fails
`loadable` and may still be carried as `upstream`), and keeps the probes it
actually ran in `attempted` so the next pass does not repeat them blindly.

The six reason codes are closed:

| Code | Means |
|---|---|
| `source-proof-failed` | The source or file did not resolve |
| `load-proof-failed` | No runtime surface could be proven |
| `command-registry-failed` | A command exists but no registry or installer resolves it |
| `install-command-absent` | The class requires a command and none was authored |
| `shape-invalid` | The row violates its kind's shape contract, such as a forbidden pipe in a `cli` command |
| `evidence-lapsed` | The proof existed but aged past its TTL window |

**Removal lifecycle.** A row leaves the live catalog only by becoming a
candidate, and it returns only by re-proving its class evidence and being
re-admitted as a new live row. There is no bulk delete, no silent drop, and no
automatic promotion: a recovered address arrives as evidence, is dated, and
enters through the generator like any other record.

## The version pointer

`catalog_version` is `4`. Two schema files sit in `registry/schema/`:

- `catalog-v4.schema.json` — current; sixteen kinds, the class-evidence
  contract, the candidate definition.
- `catalog-v3.schema.json` — retained as published history. It is never edited
  in place, and the generator does not read it.

A new kind is added by publishing a **new** schema version file, never by
editing a published version in place. The v4 file's own `$comment` lists
exactly what a future kind touches: the new schema's `kind` enum plus its entry
in the per-kind class mapping; `SCHEMA_PATH`, `KINDS`, `SECTION_KINDS`,
`SECTION_LABELS`, `SIDECAR_FILES` and `INDEX_DIRS` in
`scripts/generate-catalog-json.mjs`, plus `buildCatalog`'s `$schema` and
`catalog_version` pointer; a new `## <Label>` section in the catalog Markdown
plus the Summary counts and folder paths; the new sidecar and component files;
then regeneration. `verify-registry.mjs` needs no change, because its checks are
kind-agnostic.

## The generation chain

One direction, no hand edits:

```text
registry/VANTRILEX_CATALOG.md  ──┐
registry/data/<kind>.jsonl     ──┼──> scripts/generate-catalog-json.mjs
                                 │        ├──> registry/catalog.json      (mirror)
                                 │        ├──> VANTRILEX_CATALOG.md table (row order, counts)
                                 │        └──> registry/<dir>/_index.md   (per kind, per tier)
                                 └──> .opencode/equip.manifest.json  (consumer: selects kind/id tokens)
```

`registry/catalog.json` is derived, never hand-edited. The selection record is
a **consumer**: it names `kind/id` tokens and carries no copy of any record
field. There is no lockfile; the catalog rows plus `verify-catalog.mjs` are the
whole proof.

`node scripts/generate-catalog-json.mjs --check` proves every generated surface
byte-current. Detail is in `03-SCRIPTS-GENERATE.md`.

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
later row with the same slug is addressed as `slug-row-N`. Four slugs are reused
across two different kinds, so every member also carries an explicit kind, and
the kind decides which row the id resolves to.

Observed live 2026-10-22: `orphan-references` resolves 45 id references across
56 overlap entries.

## Live counts

Measured 2026-10-22 on branch `wt/vta-factory-p0`. Re-derive with the recount
commands in `00-INDEX.md`; a remembered figure is not a count.

| Kind | Live rows | | Kind | Live rows |
|---|---:|---|---|---:|
| `skill` | 1464 | | `theme` | 12 |
| `mcp` | 872 | | `plugin` | 11 |
| `agent` | 301 | | `hook` | 8 |
| `design.md` | 84 | | `policy` | 2 |
| `cli` | 64 | | `lsp` | 1 |
| `formatting` | 13 | | `prompt` | 1 |
| `dataset` | 1 | | `template` | 1 |
| `benchmark` | 1 | | `workflow` | 1 |
| **Total live** | **2837** | | **Candidates** | **104** |

Class split over the 2,837 live rows: `upstream` 1,497, `installable` 1,181,
`loadable` 69, `data` 90. Default-selected rows: 19. Null `install_cmd` rows:
1,635 (the command-free classes plus self-shipped surfaces).

The 104 candidates, by kind and reason:

| Kind | Reason code | Rows |
|---|---|---:|
| `mcp` | `source-proof-failed` | 50 |
| `skill` | `shape-invalid` | 25 |
| `skill` | `command-registry-failed` | 16 |
| `hook` | `load-proof-failed` | 12 |
| `mcp` | `load-proof-failed` | 1 |
| **Total** | | **104** |

Candidate totals by kind: `mcp` 51, `skill` 41, `hook` 12. Two reason codes are
unused — `install-command-absent` and `evidence-lapsed` — and
`command-registry-failed` appears only for skills (16 rows), because a dead
coordinate is a source failure while a missing artifact inside a live repository
is a command failure.

Two further live figures belong to the same census:

- **Themes: 12 catalogued components plus 1 runtime switch map.** `registry/themes/`
  holds 13 `.json` files. Twelve are V2 palette themes and appear in the catalog;
  `vantrilex-atomic-switch.json` is the atomic-switch map and is out of catalog
  by the P5a ruling below.
- **Selection: 146 tokens, 17 suspended.** The suspension is a selection-record
  disposition, not a catalog state; see `05-KIT-LOCK.md`.

## The self-shipped convention

Some components ship inside this repository and have no external origin. v3
expressed that as a null `source`. v4 accepts a stronger convention, ruled at
the P3 gate: a self-shipped row cites the canonical public repository that
actually carries the artifact, so a reader can resolve it.

| Row family | `source` | Why |
|---|---|---|
| The 12 `theme` rows | `3mar-baha/vantrilex-arsenal` | The palette JSON ships in this repository, and the repository is public at that coordinate |
| `mcp/github` | `modelcontextprotocol/servers` | The server binary is the upstream npm package, and the row names the repository that publishes it |

The convention does not weaken the evidence rule: those rows are `loadable`,
their proof is `load_proof` plus a real command, and the source is provenance,
never a substitute for the surface. A loadable row whose source is null is still
valid and still command-free — the schema's self-shipped rule stands. The
convention only says which form a row should prefer when a real public
coordinate exists. No schema amendment was made for it.

## The P5a ruling — the atomic-switch map is out of catalog

`registry/themes/vantrilex-atomic-switch.json` is the atomic-switch **map**: it
carries `agents`, `categories`, `registry` and `reserved` sections and names
which theme resolves for which agent. It is not a V2 palette theme and carries
no `base`/`dark` tree.

The gate `command-shape/theme` refused the prepared theme row, correctly: the
file cannot satisfy a palette shape it does not have. The leader ruling
disposition is **option (c)**:

- The map is an **out-of-catalog runtime artifact**. It is documented, not
  registered.
- The catalog counts **12 theme components**, and the directory holds **13
  files** — 12 themes plus the map. Neither number is a defect; they count
  different things.
- No schema discriminator was added, no file was moved, and no palette was
  invented to make the row fit. A fabricated palette would have been a
  documented lie about what the file contains.

Theme colour normalization (F-COLOR-09) landed separately at `790ef85`: all 12
theme files carry uppercase `accentHex` values, with `vantrilex-aether` at
`#14B8A6`. Zero lowercase values remain.

## The MISSING-ADDRESS flow

A row whose correct source coordinate cannot be found is neither re-pointed by
guess nor silently dropped. Two artifacts record it, and the flow between them
is standing for every migration and audit run:

1. **Candidate row.** The row leaves the live catalog and enters
   `registry/candidates/<kind>.jsonl` with its reason code — `source-proof-failed`
   when the coordinate does not resolve, `command-registry-failed` when the
   repository resolves but the named artifact is absent from its tree.
2. **Document entry.** The same row is entered in
   `.opencode/audit/MISSING-ADDRESS.md` with six fields: kind, id, name, the
   coordinate that is missing, the probes actually run, and the reason code. The
   document is append-only: a later run adds its own dated section and never
   rewrites an earlier one.
3. **Address hunt.** The owner passes the document to the verifier seat
   (VANZEN), which researches the correct address.
4. **Re-admission.** A recovered address returns as evidence, is re-proved, and
   re-enters as a new live row per V4-3.
5. **Owner ruling.** A row still unresolvable after the hunt returns to the
   owner for an explicit remove-or-keep ruling. Until that ruling it stays a
   candidate and stays documented.

The P3 section records 66 rows: 50 `mcp / source-proof-failed` and 16
`skill / command-registry-failed`. Seventeen of the 50 MCP rows sit inside the
146-token selection; those seventeen are the suspended entries below.

## Suspension and auto-restore

The selection record marks a selected token `SUSPENDED` while its catalog row is
missing, rather than deleting it or leaving the gate red:

```json
{"token": "mcp/brave", "reason": "missing-address", "since": "2026-10-22",
 "document": ".opencode/audit/MISSING-ADDRESS.md"}
```

- The token stays in its `phases` array; suspension adds a disposition, it does
  not remove the entry.
- `reason` is closed to `missing-address`. A suspension cannot stand in for a
  load, shape or command failure.
- `document` must name a file that exists, so a suspension cannot point at a
  document nobody wrote.
- An entry whose token is still absent from the catalog is **active**: held out
  of `loadability/registers` and `phase-sets`, counted, and reported as
  suspended — never as missing.
- An entry whose token is live again is **stale**: it stops applying
  automatically, becomes an ordinary selected token, and must resolve and place
  again. Recovery needs no manifest edit — address → evidence → re-proof →
  re-admission, and the suspension lapses on its own.

Observed live: 17 entries, all active, 0 stale. P4 proved the round trip
byte-identically: adding an 18th entry for a live token, running the gate, and
removing that line returns the manifest to its original SHA-256, with the stale
entry auto-restored and the other 17 unaffected.

## What proves it

`node scripts/verify-catalog.mjs` runs 20 checks. The ones that carry this
file's claims:

| Check | Proves |
|---|---|
| `command-honesty/installable-requires-command` | Every `installable` row carries an install command |
| `command-honesty/registry-matches-command` | Every non-null command equals its `command_registry` proof |
| `command-honesty/verified-only` | No live row carries a state other than `verified` |
| `selection/suspension` | Every suspension entry is well-formed, active or honestly stale |
| `candidates/schema` | Every candidate row validates against `$defs.candidate` |
| `evidence/ttl` | Every proof is inside its class window |
| `command-shape/theme` | Every theme row ships V2-native JSON, with no image or model keys |
| `file-copy/shape` | Every shipped file kind lands by plain copy and passes its kind invariant |

`node scripts/verify-registry.mjs` runs seven checks over the source layers —
UTF-8 validity, schema conformance, row-count integrity, the install-command
invariant, orphan references, duplicate ids, and MCP name normalization. The
check-by-check detail is in `02-SCRIPTS-VERIFY.md`.

## Where the audit trail lives

| Document | Holds |
|---|---|
| `.opencode/audit/C2-P1-CATALOG-V4-SCHEMA.md` | The v4 decision record: 18 choices, D1–D18 |
| `.opencode/audit/C2-P1-AMENDMENTS.md` | R3 (data command-free), R6 (`id` required), R7 (TTL and the sixth code) |
| `.opencode/audit/C2-P2-CLASSIFICATION.md` | The dry-run classification and the per-row evidence plan |
| `.opencode/audit/C2-P4-MANIFEST-SUSPENSION.md` | The suspension act, its semantics, and the reversibility proof |
| `.opencode/audit/MISSING-ADDRESS.md` | The standing, append-only address hunt |
| `registry/schema/catalog-v4.schema.json` | The contract itself, including both validation roots |

Audit records are history: they are appended to and cited, never rewritten.
