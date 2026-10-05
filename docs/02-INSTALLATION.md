# Installation

This file covers working with the Arsenal repository itself: checking it out
and proving it is healthy. Equipping a target project is Vanguard's job and is
described in [04-VANGUARD.md](04-VANGUARD.md).

## Prerequisites

| Requirement | Minimum | Notes |
|---|---|---|
| `git` | any recent version | Worktrees are required for parallel work (see [11-WORKTREES.md](11-WORKTREES.md)) |
| Node | version 20 or later | CI pins Node 25; the tooling is dependency-free ESM and needs no install step |
| `gh` | authenticated | Needed only for the release lane (see [14-CI-RELEASE.md](14-CI-RELEASE.md)) |

There is deliberately nothing else: no Python, no package installation, no
bundler. If a step below appears to need a dependency, that is a bug in the
step, not a gap in the machine.

## Clone and prove healthy

Clone the repository, then run the two read-only gates. Both exit 0 on a
healthy tree and both are safe to run before changing anything:

```bash
node scripts/verify-registry.mjs
node scripts/generate-catalog-json.mjs --check
```

The first proves the registry is internally consistent (six checks, documented
in [08-VERIFICATION.md](08-VERIFICATION.md)). The second proves the generated
mirror matches the sources, so `registry/catalog.json` and every per-kind
`_index.md` are current. If either fails, fix the tree before starting work;
a red gate at clone time means the branch is mid-migration, not that the
gates are advisory.

Shell scripts are checked the same way CI checks them:

```bash
shellcheck scripts/*.sh .githooks/*
```

## What `registry/catalog.json` is for

`registry/catalog.json` is the machine mirror of the catalog. It is generated
from `registry/VANTRILEX_CATALOG.md` plus the six JSONL sidecars under
`registry/data/`, never hand-edited (see
[07-CATALOG-GENERATION.md](07-CATALOG-GENERATION.md)). Vanguard reads the JSON
at selection time; humans read the Markdown. The schema that both sides must
satisfy is `registry/schema/catalog-v2.schema.json`, documented in
[06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md).

## How a target project consumes the plugin

A target project does not clone this repository for its contents. It receives
the shipped surface under `.opencode/`: the plugin entry point, the role
agents, the operator commands, and the transplanted skills. At runtime,
Vanguard detects the project state, selects the Tier-0 core plus the Tier-1
components the stack requires, installs them with real commands, pins them in
the project's kit lock, and verifies each one loads. The operator entry points
are the four command files:

| Command file | Operator intent |
|---|---|
| `.opencode/command/equip.md` | Detect project state and equip the kit |
| `.opencode/command/doctor.md` | Run the preflight system check |
| `.opencode/command/prime.md` | Emit the session CONTEXT ANCHOR at session start |
| `.opencode/command/release.md` | Run the release lane |

Prime, Vanguard, and Doctrine ship as skill files under `.opencode/skills/`
and run in that order: orientation once per machine, equip once per target
project, then work. Their contracts are [01-OVERVIEW.md](01-OVERVIEW.md),
[04-VANGUARD.md](04-VANGUARD.md), and [05-DOCTRINE.md](05-DOCTRINE.md), with
Prime's own contract carried by
`.opencode/skills/vantrilex-prime/SKILL.md`. The `prime` command above is
unrelated to the Prime skill: it is the session-context primer.
