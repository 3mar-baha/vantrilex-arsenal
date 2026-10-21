# Dev Documentation Index

Microscopic developer notes for the Vantrilex Arsenal itself. They are separate
from the user-facing `docs/` series: these describe the tree the way a
maintainer needs it, one area per file. Every claim here is traced to a file
read live in this repository. Nothing here outranks the file it cites: when the
two disagree, the file wins and the note is stale.

## The nine documents

| # | File | Covers |
|---|---|---|
| 00 | `00-INDEX.md` | This map, the recount commands, the reading order |
| 01 | `01-PLUGIN.md` | Plugin surfaces and hook registration |
| 02 | `02-SCRIPTS-VERIFY.md` | The three verifier scripts, check by check |
| 03 | `03-SCRIPTS-GENERATE.md` | The catalog generation pipeline |
| 04 | `04-SCRIPTS-OPS.md` | The eight operations scripts |
| 05 | `05-KIT-LOCK.md` | Selection-record structure, invariants, phase scoping |
| 06 | `06-REGISTRY.md` | Sidecars, overlap map, schema validation |
| 07 | `07-SKILLS-AGENTS.md` | Skill contract and the agent roster |
| 08 | `08-WORKFLOWS-GATES.md` | Root files, the six gates, release |

## Live recount commands

Every figure in these notes is derived, never remembered. Run these from the
repository root with Node on `PATH`; the shell is `bash`.

```bash
node scripts/verify-registry.mjs
node scripts/verify-catalog.mjs
node scripts/verify-skills.mjs
node scripts/generate-catalog-json.mjs --check
```

Catalog census — the kind breakdown and the total:

```bash
node -p "JSON.stringify(require('./registry/catalog.json').counts)"
```

Selection census — how many tokens are selected, and the MCP cap:

```bash
MANIFEST=.opencode/equip.manifest.json
node -p "Object.values(JSON.parse(require('fs').readFileSync('$MANIFEST','utf8')).phases).flat().length"
```

Roster census — skill folders and entries in the agents directory:

```bash
node -p "require('fs').readdirSync('.opencode/skills').length"
node -p "require('fs').readdirSync('.opencode/agents').length"
```

Observed 2026-10-18 on branch `wt/vta-factory-p0`: catalog version 3 carrying
2931 records, the lock at 157 components and 9 pending with `mcp_cap` 8, and 37
skill folders against 27 agent entries. A sibling lane owns `kit/`, so the lock
figures move independently of this tree. Re-run the commands rather than trusting
those figures; they move with the branch.

## Reading order

Read this index first, then the one area the question is about. When a question
crosses areas, read them in the order below, because each one assumes the one
before it:

1. `05-KIT-LOCK.md` and `06-REGISTRY.md` — what the data is.
2. `03-SCRIPTS-GENERATE.md` — how the mirror is built from that data.
3. `02-SCRIPTS-VERIFY.md` — how the data and the mirror are proven.
4. `01-PLUGIN.md` — what runs at runtime.
5. `04-SCRIPTS-OPS.md` — how the work lanes are operated.
6. `07-SKILLS-AGENTS.md` and `08-WORKFLOWS-GATES.md` — who does the work, and
   what must pass before it is called done.

## The one rule

Read-only. These notes exist so an agent can understand the repository without
touching it. A reader that edits, regenerates, or reformats while using them has
left the scope, and the change is reverted and reported rather than kept.
