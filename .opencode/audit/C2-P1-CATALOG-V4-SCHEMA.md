# C2-P1 — Catalog v4 Schema Decision Record

Lane `POST87-APPLY`, Cluster 2, node `c2-schema` (P1 of 6). Owner `vantrilex-typescript`.
Classification DIRECTED: the brief is executed as dispatched; no Vanguard re-derivation.

This record answers one question: **what exactly did the schema encode, and which choices did the
absent design leave to this node?** It is written for the P1 gate, so the owner can approve or
overrule each choice before P2 migrates 2,941 live records.

Deliverables under this node:

- `registry/schema/catalog-v4.schema.json` — new schema version file.
- This record.

Nothing else was touched: `catalog-v3.schema.json`, every `registry/data/*.jsonl`, and
`scripts/generate-catalog-json.mjs` / `scripts/verify-catalog.mjs` / `scripts/verify-registry.mjs`
are byte-unchanged (`git diff --exit-code` in the proofs section).

## 1. What was measured

All numbers below come from `registry/catalog.json` (the generated mirror) and the sixteen
`registry/data/*.jsonl` sidecars, read on 2026-10-22. Nothing is estimated.

### 1.1 Rows, verification and command presence per kind

| kind | rows | verified | unverified | command present | command null |
|---|---|---|---|---|---|
| skill | 1505 | 10 | 1495 | 1159 | 346 |
| mcp | 923 | 8 | 915 | 8 | 915 |
| agent | 301 | 0 | 301 | 0 | 301 |
| design.md | 84 | 0 | 84 | 1 | 83 |
| cli | 64 | 64 | 0 | 64 | 0 |
| hook | 20 | 0 | 20 | 0 | 20 |
| formatting | 13 | 0 | 13 | 0 | 13 |
| theme | 12 | 9 | 3 | 12 | 0 |
| plugin | 11 | 0 | 11 | 0 | 11 |
| policy | 2 | 0 | 2 | 1 | 1 |
| lsp | 1 | 0 | 1 | 0 | 1 |
| prompt | 1 | 0 | 1 | 1 | 0 |
| dataset | 1 | 0 | 1 | 1 | 0 |
| template | 1 | 0 | 1 | 1 | 0 |
| benchmark | 1 | 0 | 1 | 1 | 0 |
| workflow | 1 | 0 | 1 | 1 | 0 |
| **total** | **2941** | **91** | **2850** | **1250** | **1691** |

The sidecar line counts equal the mirror counts for every kind, so no row is enriched by a sidecar
that does not exist and no sidecar line lacks a catalog row.

Two derived facts drive the whole class model:

- **1,159 rows carry a command recorded `unverified`** — the declared backfill. They are honest
  commands with an unproven claim, not missing commands.
- **1,691 rows carry no command at all.** They cannot become `verified` under v3 semantics without
  inventing a command, which the hard rules forbid. Under v4 they must either prove a class that
  does not need a command (`upstream`, `data`, self-shipped `loadable`) or leave the live catalog
  for the candidate surface.

### 1.2 Which command families actually appear

Measured by matching each live `install_cmd` against the command families the verifier already
recognises:

| kind | command families present |
|---|---|
| skill | npm-shaped `npx skills add` 1159 |
| mcp | npm-shaped `npx -y` 8 |
| cli | npm 63, homebrew 1 |
| theme | plain `cp` 12 |
| prompt, dataset, template, benchmark, workflow | plain `cp` 1 each |
| policy | plain `cp` 1 |
| design.md | plain `cp` 1 |
| agent, hook, plugin, formatting, lsp | none |

No command in the corpus falls outside the families the schema's `commandRegistry.registry` enum
names. That enum is therefore descriptive of the corpus, not speculative.

### 1.3 Live local surfaces (what a load proof can actually point at)

| surface | count |
|---|---|
| `.opencode/skills/*/SKILL.md` | 37 |
| `.opencode/agents/*.md` | 27 |
| `.opencode/plugin/*.ts` | 1 |
| `registry/themes/*.json` | 13 |
| `registry/design/*/DESIGN.md` | 84 |
| `registry/prompts`, `datasets`, `templates`, `benchmarks`, `workflows` | 1 file each |
| `registry/policies` | 2 files |

Two measured discrepancies worth naming, neither fixed here because neither is P1 scope:

- 13 theme JSON files exist but only 12 theme rows are catalogued; one theme file is unregistered.
- Only 41 catalog rows join to a local surface by id (21 skills, 20 agents), although 37 skill
  folders and 27 agent files exist. The kit ships more surfaces than the catalog names, mostly
  `vs-` prefixed skill folders. A class assignment must therefore read the sidecar and the shipped
  file, never infer from a name.

### 1.4 The published v3 shape this file mirrors

- 17 record properties, `additionalProperties: false`, `required: ["kind", "verification"]`.
- `kind` enum of exactly 16 values, in a fixed order.
- One `allOf` invariant: a null `install_cmd` forces `verification: unverified`.

`registry/schema/catalog-v2.schema.json` and `catalog-v3.schema.json` both remain on disk
untouched. `catalog-v4.schema.json` is the third version file, which is the only permitted way to
change the contract.

## 2. The design gap, stated plainly

The owner ruling cites three design items "as designed": **V4-1** (class-evidence model), **V4-3**
(candidate surface) and **V4-5** (the catalog-only protocol for Item 4). Those artifacts exist in
**no repository file**. A whole-tree search for the labels returns only the two verbatim ruling
quotations (`AGENT.md:354`, `WORKFLOW.md:85-86`) and no design body. The corresponding concepts
(`source-proof`, `load-proof`, `command-registry`, `registry/candidates/`) likewise appear only
inside those quotations.

Consequences, accepted honestly rather than papered over:

1. This node encoded **only the invariants the ruling states in words**: source proof is valid for
   upstream and data records; load proof and a command-registry reference are mandatory for
   loadable and installable records, with no dilution; a record failing even its class evidence
   goes to `registry/candidates/<kind>.jsonl` with a reason; the 16-kind enum is frozen.
2. Every structural decision the missing design would have fixed is listed in section 4 and left
   open for the P1 gate.
3. **No V4-5 content is encoded.** The ruling names it but does not describe it, so the schema
   asserts nothing about a catalog-only protocol. Inventing one would have been the exact failure
   the brief forbids.
4. No candidate file was created. `registry/candidates/` does not exist, because creating it with
   placeholder rows would fabricate data. Its shape is defined; P2 populates it only if a real
   record fails.

## 3. The class-evidence model as encoded

### 3.1 The four classes

The labels are the ruling's own words, used unchanged:

| class | what the record claims | evidence the schema demands |
|---|---|---|
| `upstream` | an external artifact exists at a named source, and nothing is provisioned locally | `evidence.source_proof`; `install_cmd` must be null |
| `data` | a data artifact (dataset, template, policy pack, benchmark spec, workflow spec, design document) whose provenance is the claim | `evidence.source_proof`; `install_cmd` optional |
| `loadable` | a runtime surface exists that OpenCode or its host consumes | `evidence.load_proof`; `install_cmd` non-null only when there is something to install, and then `evidence.command_registry` too |
| `installable` | a command provisions the component, and the provisioned surface exists | `install_cmd` (non-null) + `evidence.command_registry` + `evidence.load_proof` |

The no-dilution rule is structural, not advisory: the `loadable` and `installable` branches require
`load_proof` by name, so a `source_proof` sitting beside it cannot stand in for it. The reverse
direction is closed too: any non-null `install_cmd` requires `command_registry`, whatever the class.

### 3.2 Evidence shapes

`evidence` is a closed object with exactly three permitted members. All three proof objects carry a
`checked_at` ISO date, because a proof is a dated observation and not a standing claim.

`sourceProof`:

- `target` (required) — an `owner/repo` coordinate, or a repository-relative path for a first-party
  artifact such as `registry/design/voltagent/DESIGN.md`.
- `path` — a path inside the target repository, or null when the target itself is the artifact.
- `method` (required) — `repo-resolves` (the remote answered for the coordinate) or
  `file-resolves` (the named file was fetched or read and found).
- `checked_at` (required) — `YYYY-MM-DD`.

`loadProof`:

- `surface` (required) — the concrete surface proven: a shipped path, a provisioned path, or the
  package spec whose executable is the surface.
- `method` (required) — one of `surface-exists`, `callback-wired`, `server-bin`,
  `frontmatter-valid`, `file-copy-target`. Each maps to a proof the verifier already implements:
  shipped file or folder, hook-to-exported-callback, package executable, agent frontmatter and mode,
  and the copy source-and-destination check. The vocabulary adds no new mechanism.
- `checked_at` (required).

`commandRegistry`:

- `command` (required) — the command as proven. It must equal the record's `install_cmd`.
  JSON Schema cannot compare two sibling properties, so that equality is a **verifier duty**, not a
  schema one; it is flagged for P2 in section 5.
- `registry` (required) — one of `npm`, `pypi`, `crates`, `go`, `homebrew`, `scoop`, `chocolatey`,
  `winget`, `apt`, `dnf`, `pacman`, `github-releases`, `vendor-installer`, `skills-registry`,
  `file-copy`. Each value corresponds to a command family `scripts/verify-catalog.mjs` already
  recognises today (section 1.2 confirms the corpus uses eight of them and none outside them).
- `checked_at` (required).

### 3.3 The per-kind mapping

`class` is a per-record field, because one kind can legitimately hold different classes: `skill`
holds 21 locally shipped surfaces, 1,157 installed-by-command rows and 327 upstream references.
The **kind bounds the allowed set**, and the schema enforces that bound with one `allOf` rule per
kind. A `cli` row therefore cannot declare itself `upstream` to avoid the command requirement, and
a `hook` row cannot claim to be data.

| kind | allowed classes | why |
|---|---|---|
| skill | loadable, installable, upstream | ships locally, installs by `npx skills add`, or is referenced upstream |
| mcp | loadable, upstream | a process-resident server, or an upstream entry with no proof yet |
| plugin | loadable, upstream | a plugin loads into the harness, or names an upstream artifact |
| hook | loadable | a hook exists only as a wired callback in the plugin |
| agent | loadable, upstream | a frontmatter definition the harness loads, or an upstream definition |
| formatting | upstream | guidance about an external tool; ships no surface and carries no command |
| lsp | loadable | a provisioned server, or a need-label pointing at the project's own typecheck |
| cli | installable | the kind's contract is a real installer command |
| theme | loadable | JSON the CLI loads; its `cp` command is install evidence, not the claim |
| prompt | installable | pasted after a file-copy install |
| dataset | data | golden evaluation data |
| template | data | a scaffold manifest |
| policy | data | a permission pack whose effect set is proven |
| benchmark | data | a one-check gate specification |
| workflow | data | specification input read by a leader; no native runner exists |
| design.md | data | third-party MIT reference material shipped verbatim |

Forecast under a starting rule (not a ruling, and not applied to any file):
`loadable` 85, `installable` 1230, `upstream` 1536, `data` 90 — total 2941.

### 3.4 The verification contract

`verification` is `const: "verified"` and has no enum. This is the strongest honest encoding of the
cluster's stated final gate, zero unverified live: a v4 live record is verified or it is not a live
record. V3's `unverified` is retired rather than narrowed, because narrowing a label while keeping
its name invites exactly the dilution the ruling forbids.

The practical consequence must be stated up front: **2,850 live rows do not satisfy v4 today.**
That is the migration's work, not a defect in the schema.

## 4. Encoding choices the absent design would have fixed

Each row is a decision this node had to make. Recommended = what the schema now does.

| # | choice | decision encoded | rationale | owner may overrule to |
|---|---|---|---|---|
| D1 | class labels | `loadable`, `installable`, `upstream`, `data` | the ruling's own four nouns; no new vocabulary | any four-name split |
| D2 | class granularity | per record; kind bounds the allowed set | one kind demonstrably holds three classes (section 3.3) | a fixed class per kind |
| D3 | allowed-set width | widest set each kind's contract supports | narrowing would silently pre-decide which of 2,850 rows P2 kills | narrower sets |
| D4 | evidence container | one closed `evidence` object with three members | one place to look; unknown proof names are rejected | per-class top-level fields |
| D5 | source proof identity | `target` accepts a repo coordinate **or** a repo-relative path | 90 data rows are first-party shipped files with no external repo | external repos only |
| D6 | source proof method | `repo-resolves`, `file-resolves` | both are already implemented by the skill and file-copy checks | free-text method |
| D7 | load proof method | five values, each an existing verifier mechanism | no invented proof machinery | fewer or more methods |
| D8 | command registry vocabulary | 15 registries, all present in `verify-catalog.mjs` today | descriptive of the corpus, not speculative | a smaller closed set |
| D9 | `verification` | `const: "verified"`, `unverified` retired | encodes zero-unverified-live directly | `enum: [verified, unverified]` with a deadline |
| D10 | install_cmd per class | required for `installable`; null for `upstream`; optional for `data`; nullable for `loadable` only when `source` is null | keeps agent, hook and plugin rows legal without a fabricated command, and stops an upstream row smuggling in a command | a stricter or looser rule |
| D11 | self-shipped detection | keyed on `source: null` | v3 already defines null source as "ships inside Vantrilex" | an explicit boolean field |
| D12 | required set | `kind`, `class`, `verification`, `evidence`; `id` stays optional | v3 requires only the invariant fields, and the generator always emits `id` | add `id` to required |
| D13 | candidate location | `registry/candidates/<kind>.jsonl`, one JSON object per line | the ruling names that exact path | a single candidates file |
| D14 | candidate schema home | `$defs.candidate` in the same v4 file | one version file, two roots; no second file to version | a separate candidate schema file |
| D15 | candidate reason | object with `code` (5 values) plus `detail` | auditable failure family, with the specific finding kept | free-text reason |
| D16 | candidate extra fields | `source`, `origin`, `install_cmd`, `attempted`, `checked_at` | enough to re-assess without re-deriving the row; `attempted` stops blind re-probing | a minimal `id`+`reason` row |
| D17 | V4-5 content | none encoded | the ruling names it and never defines it | supply the design, then a v5 or an amendment |
| D18 | v3 file | untouched, third version file added | the versioned-kind mechanism is explicit about this | n/a |

## 5. What P2 (migration) will need

1. **Generator schema pointer.** `scripts/generate-catalog-json.mjs:13` (`SCHEMA_PATH`) and
   `buildCatalog` (`:646-648`, which emits `$schema` and `catalog_version: 3`) both hard-code v3.
   Both must move together, or the mirror and its declared schema disagree.
2. **Two new record fields.** `RECORD_FIELDS` (`:75-93`) has 17 names and drives output order,
   sidecar key validation and the merge. `class` and `evidence` must be added there, in a position
   that keeps generated output stable, or `orderRecord` will drop them silently.
3. **Validator depth.** `loadSchema` (`:593-611`) already requires every `RECORD_FIELDS` name to be
   declared. Two limits block v4: `checkProperty` (`:509-546`) does not recurse into object
   schemas, so `$ref`d evidence members are never checked; and `applySchema` (`:580-586`) demands
   that **every declared property be present** whenever `additionalProperties` is false. Pointing
   the generator at v4 today would therefore fail all 2,941 records on the two missing fields —
   which is the correct signal for a migration target and the wrong signal for CI. The generator
   keeps v3 until P2/P3 lands both changes.
4. **Nested required enforcement.** The `allOf` rules that require `evidence.load_proof` and
   `evidence.command_registry` express their requirement through a nested `required` inside `then`.
   `applySchema` applies `then` one level deep and ignores a `required` it finds inside a property
   spec. P2 needs either a recursive validator or a check in `verify-catalog.mjs` that reads the
   same table.
5. **Class assignment for 2,941 rows.** Each sidecar line gains `class` and `evidence`. The 1,691
   null-command rows must take a class that permits null or move to candidates. The 1,159
   unverified-with-command rows must acquire a real `command_registry` proof, since the command
   alone no longer verifies anything.
6. **Cross-field check.** `command_registry.command` must equal `install_cmd`. JSON Schema cannot
   state that; the verifier must.
7. **Candidate directory.** `registry/candidates/` does not exist. P2 creates a `<kind>.jsonl` file
   only when at least one real record fails, and never an empty placeholder.
8. **Second schema consumer.** `verify-registry.mjs:8-14` imports the generator's loader, so it
   inherits both schema-path and validator changes with no edit of its own; its
   `install-command-invariant` check (`:127-159`) is v3-shaped and needs a v4 counterpart rather
   than a reinterpretation.
9. **Docs.** `docs/dev/06-REGISTRY.md` is already stale against the live registry: it says the
   schema has nine kinds (`:61-64`) and the mirror carries 2,805 records naming nine kinds
   (`:88-91`), while the live mirror has 16 kinds and 2,941 records. P2 must rewrite that page
   rather than append to it.

## 6. Open choices for the P1 gate

These are the questions the missing design would have answered. Each is encoded as the table in
section 4 says, and each can be changed without touching a live record yet.

1. **D3 — allowed-set width.** A narrow reading makes every `mcp` row without a command a
   candidate (915 rows). The wide reading, now encoded, treats them as upstream entries until a
   command is proven. Which is the intent of "no dilution"?
2. **D9 — retirement of `unverified`.** The schema admits no unverified live record. Confirm that
   the 2,850 unverified rows are to be verified or demoted, and that no intermediate
   `unverified`-carrying v4 record is wanted during the migration.
3. **D10 — `data` with a command.** Six data rows carry a `cp` command today. The schema permits a
   data record to hold one, provided `command_registry` names `file-copy`. The alternative is that
   a data record must be command-free and any installed artifact is `installable`.
4. **D13/D14 — candidate lifecycle.** A candidate row whose source Markdown row stays in
   `VANTRILEX_CATALOG.md` creates a conflict: the generator requires one live record per row. Does
   the row leave the catalog when it becomes a candidate, and is the candidate list therefore a
   record of removals rather than a parallel register?
5. **D15 — reason codes.** Five codes are defined (`source-proof-failed`, `load-proof-failed`,
   `command-registry-failed`, `install-command-absent`, `shape-invalid`). Are these the failure
   families the migration should report, or should the code stay free-text?
6. **D12 — `id` requiredness.** v3 leaves `id` optional because the generator always emits it. If
   v4 live records are meant to be validated as standalone documents, `id` should become required.
7. **Evidence freshness.** Every proof carries `checked_at`, but no window is enforced. Is a stale
   proof (say, older than the release cycle) still evidence, or must the verifier re-check on a
   schedule?

## 7. Proofs run

All commands executed in `O:\vantrilex-arsenal` on 2026-10-22. Exit codes are the ones printed.

| proof | command | result |
|---|---|---|
| v4 JSON parse | `node -e "require('./registry/schema/catalog-v4.schema.json')"` | parsed, exit 0 |
| v3 JSON parse | `node -e "require('./registry/schema/catalog-v3.schema.json')"` | parsed, exit 0 |
| structural assertions | throwaway script over both schema files | 32 assertions pass, exit 0 |
| v3 untouched | `git diff --exit-code registry/schema/catalog-v3.schema.json` | exit 0 |
| sidecars untouched | `git diff --exit-code --stat registry/data/` | exit 0 |
| scripts untouched | `git diff --exit-code --stat scripts/` | exit 0 |
| catalog proofs | `node scripts/verify-catalog.mjs` | 17 passed, 0 skipped, 0 failed, exit 0 |
| registry proofs | `node scripts/verify-registry.mjs` | 7 passed, 0 failed, 0 skipped, exit 0 |
| mirror currency | `node scripts/generate-catalog-json.mjs --check` | every generated surface `ok`, exit 0 |
| skill format | `node scripts/verify-skills.mjs` | 10 passed, 0 failed, 0 skipped, exit 0 |
| plugin typecheck | `npx tsc --noEmit -p tsconfig.json` | no output, exit 0 |
| this record | `npx markdownlint-cli2@0.24.0 ".opencode/audit/C2-P1-CATALOG-V4-SCHEMA.md"` | 0 issues, exit 0 |

The structural assertions prove, mechanically: the `kind` enum equals v3's 16 values in the same
order; `class`, `evidence` and `$defs.candidate` exist; the class enum is the four ruled labels;
`evidence` is closed and declares the three proof members; every internal `$ref` resolves; the
per-kind mapping names all 16 kinds exactly once; the required set is
`["kind", "class", "verification", "evidence"]`; `verification` is `const: "verified"` with no
enum; the record root is `additionalProperties: false`; and every one of v3's 17 fields is carried
forward.

The new schema file does not perturb any gate, because no consumer points at it yet: the generator's
`SCHEMA_PATH` and the registry verifier's inherited loader both still read
`catalog-v3.schema.json`. That is the intended state until P2 moves them together.

**Explicitly not verified.** The v4 file was not validated against the draft 2020-12 metaschema by
a JSON Schema validator, because this repository ships zero dependencies and carries none. The 32
assertions cover the properties this node controls — enum identity, property presence, `$ref`
resolution, required sets, the per-kind mapping — but they cannot prove the file is a legal
2020-12 document. A validator run (`ajv-cli`, npm, MIT) is proposed for P2 under the missing-tooling
protocol: it is a dev-only invocation, adds no `package.json` dependency, and whatever it finds
lands before any record is migrated. Until then this is `unverified`, not passed.
