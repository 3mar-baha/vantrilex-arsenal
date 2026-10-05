# Catalog Generation

`registry/catalog.json` and the per-kind `_index.md` files are generated, never
hand-edited. The single command that builds them is the dependency-free Node
module `scripts/generate-catalog-json.mjs`. It reads the Markdown source plus
the sidecars, validates every record against
`registry/schema/catalog-v2.schema.json`, and writes byte-deterministic
output. This file documents its real flags and rules; the record contract it
enforces is in [06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md).

## CLI flags

```bash
node scripts/generate-catalog-json.mjs --check
node scripts/generate-catalog-json.mjs --markdown --indexes
node scripts/generate-catalog-json.mjs --stdout
```

| Invocation | Effect |
|---|---|
| no flags | Regenerate `registry/catalog.json` from sources; report sidecar merge counts and per-kind totals |
| `--markdown` | Also rewrite the `VANTRILEX_CATALOG.md` table (sorted, counts reconciled) |
| `--indexes` | Also rewrite each per-kind `_index.md` (Tier 0 first) |
| `--check` | Compare instead of writing; exit non-zero when any target is missing or differs |
| `--stdout` | Print the catalog JSON to stdout and write nothing |

Rules the parser enforces on flags: an unknown flag fails; a repeated flag
fails; `--check` and `--stdout` together fail because they are mutually
exclusive. `--check` names each drifted target and prints the exact
re-generation command that repairs it. Section heading counts are verified on
every run: a heading declaring N rows must parse to exactly N rows, and the
declared default-selected count must match the parsed flags.

## The JSONL sidecar merge rule

Six sidecars enrich the six kinds, with explicit plural filenames:

| Kind | Sidecar file |
|---|---|
| skill | `registry/data/skills.jsonl` |
| mcp | `registry/data/mcp.jsonl` |
| plugin | `registry/data/plugins.jsonl` |
| hook | `registry/data/hooks.jsonl` |
| agent | `registry/data/agents.jsonl` |
| formatting | `registry/data/formatting.jsonl` |

Merge rule, in precedence order:

1. A present sidecar field wins over the base row — including an explicit
   null, which clears the base value on purpose.
2. A field absent from the sidecar leaves the base value untouched.
3. An absent sidecar file is tolerated: the kind keeps its base values and
   the run reports the sidecar as absent.
4. A sidecar entry whose id matches no catalog row in its kind fails the run.
5. A duplicate id inside one sidecar fails the run.
6. An unknown field in a sidecar entry fails the run.

All 6 sidecars are present today and merge cleanly: 1503 skill, 905 MCP,
12 plugin, 19 hook, 284 agent, and 13 formatting entries, totaling 2736
records.

## The single-writer law

Each sidecar has exactly one owning branch at a time. Never two branches
writing one file — that is how merges conflict and registry data gets
silently lost. The law is social, not scripted: the generator cannot tell two
writers apart after the fact, so branch discipline in
[13-CONTRIBUTING-WORKFLOW.md](13-CONTRIBUTING-WORKFLOW.md) carries it.

## The id-disambiguation rule

Two distinct rows can slugify identically: the catalog carries two agents
whose names differ only by case. The rule is deterministic and needs no human
judgment: the first occurrence keeps the plain slug, and every later
collision takes a `-row-<N>` suffix derived from its own catalog row number.
Sidecars follow the same rule, so sidecar entries line up with catalog ids.
Three or more rows slugifying to one id fails the run rather than inventing a
deeper scheme.

## Determinism requirement

Output order is fully determined: records sort by kind, then by name on
codepoint order, then by id; object keys follow the schema field order. A
clean regeneration is byte-identical to the committed files, which is exactly
what `--check` asserts in CI. The per-kind index groups members into Tier 0
core, Tier 1 conditional, Tier 2 extended, then untiered, with install and
trigger cells truncated to fit. The formatting index additionally documents
the 12 vendored brands and the upstream catalogue; see
`registry/formatting/_index.md`.
