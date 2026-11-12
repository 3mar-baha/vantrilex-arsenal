# Installation

This file covers working with the Arsenal repository itself: checking it out
and proving it is healthy. Equipping a target project is Vanguard's job and is
described in [04-VANGUARD.md](04-VANGUARD.md).

## Prerequisites

| Requirement | Minimum | Notes |
|---|---|---|
| `git` | any recent version | Worktrees are required for parallel work (see [11-WORKTREES.md](11-WORKTREES.md)) |
| Node | version 22 or later | CI pins Node 25; the tooling is dependency-free ESM and needs no install step |
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

The first proves the registry is internally consistent (seven checks, documented
in [08-VERIFICATION.md](08-VERIFICATION.md)). The second proves the generated
mirror matches the sources, so `registry/catalog.json` and every per-kind
`_index.md` are current. If either fails, fix the tree before starting work;
a red gate at clone time means the branch is mid-migration, not that the
gates are advisory.

Install from the `wt/v2-consolidation` branch, never from `main`: main is
behind the release until the branch merges. The full clone command lives in
the Quickstart of `README.md` / `README.ar.md`. Expected HEAD at the time of
writing (2026-11-11): branch tip `fa952b3573f1d6c68378ff11a72f14f0abfcda19`;
the release tag `v0.9.82` (annotated, tag object `1ae75f924064005de9086724babcbc3e239e03a4`)
checks out commit `4024f9eb797b9e7bcebb82fbb55f7d71bb8fac85`. The
branch tip moves and the tag does not, so `git checkout v0.9.82` is the
supported alternative to the moving branch — after the checkout, the expected
HEAD is the tag commit. Installing the git hooks is a mandatory step after
every clone, not an optional one: `bash scripts/setup-git-hooks.sh` arms the
secret scanner, the `.env` guard and the AI-attribution gate for every commit
from then on. The Node floor is 22 — not 20 — and the schema both sides must
satisfy is now `registry/schema/catalog-v6.schema.json` (`catalog_version` is
`6` in `registry/catalog.json`), documented in
[06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md). Upgrading an existing install
is a different procedure, documented in [UPGRADE.md](UPGRADE.md) — it is a
delete-old-install-latest procedure, never an in-place edit.

## Choosing a facet — an install-time choice

The Arsenal ships one seat, `vantrilex-facet`, whose three facets differ only
in required permissions; the thinking is identical for every facet. `cautious`
asks often and holds no edit, bash or task permission. `balanced` asks before
edit, bash and task calls and is the default. `long` carries full edit, bash
and task permission for longer runs — "without intervention / without asking",
the owner-confirmed meaning of D49 (2026-11-10), not only shell commands. Which
facet to install under is an install-time choice, not a per-task toggle; it is
switchable at any time with `node scripts/switch-facet.mjs list` and
`node scripts/switch-facet.mjs set <cautious|balanced|long>`. The command file
is `.opencode/commands/vantrilex-facet.md`.

Shell scripts are checked the same way CI checks them:

```bash
shellcheck scripts/*.sh .githooks/*
```

To disarm the plugin mid-session, set `VANTRILEX_DISABLED=1` or create `.opencode/.vantrilex-disable`; to disarm the dispatcher only, set `taskDispatcher.enabled: false` in `.opencode/arsenal.json`.

## What `registry/catalog.json` is for

`registry/catalog.json` is the machine mirror of the catalog. It is generated
from `registry/VANTRILEX_CATALOG.md` plus the eight JSONL sidecars under
`registry/data/`, never hand-edited (see
[07-CATALOG-GENERATION.md](07-CATALOG-GENERATION.md)). Vanguard reads the JSON
at selection time; humans read the Markdown. The schema that both sides must
satisfy is `registry/schema/catalog-v6.schema.json`, documented in
[06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md).

## How a target project consumes the plugin

A target project does not clone this repository for its contents. It receives
the shipped surface under `.opencode/`: the plugin entry point, the role
agents, the operator commands, the workflow commands, and the transplanted skills. At runtime,
Vanguard detects the project state, selects the Tier-0 core plus the Tier-1
components the stack requires, installs them with real commands, pins them in
the project's selection record (`.opencode/equip.manifest.json`), and verifies each one loads. The operator entry points
are the four command files under `.opencode/command/` (singular), and the
seventeen command roots in total also include the thirteen workflow commands under
`.opencode/commands/` (plural):

| Command file | Operator intent |
|---|---|
| `.opencode/command/equip.md` | Detect project state and equip the kit |
| `.opencode/command/doctor.md` | Run the preflight system check |
| `.opencode/command/prime.md` | Emit the session CONTEXT ANCHOR at session start |
| `.opencode/command/release.md` | Run the release lane |

The thirteen workflow commands under `.opencode/commands/` (plural root):

| Command file | Operator intent |
|---|---|
| `.opencode/commands/V-DOCTOR.md` | Triage environment, runtimes, configuration, and workspace into PASS/WARN/FAIL rows, with safe automatic repair behind an opt-in flag |
| `.opencode/commands/V-FULL-AUDIT.md` | Run the full repository audit by fanning out read-only subagents and emitting exactly one cited 1000-plus-line report |
| `.opencode/commands/V-CATALOG.md` | Search the kit catalog by task keywords and suggest the stack-fitting components |
| `.opencode/commands/V-PROFILE.md` | Manage install profiles (list, apply, diff, new, validation) so every profile id resolves against the catalog |
| `.opencode/commands/V-RAG.md` | Answer natural-language questions over the knowledge domains plus the hotfix overlay, with every fact cited |
| `.opencode/commands/V-HTML_DESIGN.md` | Render a single-file showcase page from a content record plus one brand visual language |
| `.opencode/commands/V-Ai-Generated-Code-Security-Auditor.md` | Consult the ai-generated-code-security-auditor specialist in read-only Q&A |
| `.opencode/commands/V-Architect.md` | Consult the architect specialist in read-only Q&A |
| `.opencode/commands/V-Code-Reviewer.md` | Consult the code-reviewer specialist in read-only Q&A |
| `.opencode/commands/V-Kit-Maintainer.md` | Consult the kit-maintainer specialist in read-only Q&A |
| `.opencode/commands/V-Red-Team.md` | Consult the red-team specialist in read-only Q&A |
| `.opencode/commands/V-Technical-Writer.md` | Consult the technical-writer specialist in read-only Q&A |
| `.opencode/commands/vantrilex-facet.md` | List the three facets and switch the vantrilex-facet seat between cautious, balanced and long |

The two roots are deliberately distinct: `.opencode/command/` carries the four
operator entry points, and `.opencode/commands/` carries the thirteen workflow
commands. A fresh clone can therefore reach every one of the seventeen roots.

Host discovery (<https://opencode.ai/v2/docs/commands/>): project commands live in
`.opencode/commands/`; "The legacy singular directory `command/` is also
discovered, but use `commands/` for new files." The plural root is therefore
canonical for all new commands, the singular root is legacy but still discovered,
and no name-clash winner is needed: the two roots carry distinct stems
(`doctor` vs `V-DOCTOR`).

Prime, Vanguard, and Doctrine ship as skill files under `.opencode/skills/`;
Workflow-Forge joins them at equip time, when Vanguard installs it in the
Step 4 lane and proves the install by read-back. They run in the order Prime,
Vanguard, Workflow-Forge, Doctrine: orientation once per machine, equip once per target
project, workflow design at each task start, then work. Their contracts are [01-OVERVIEW.md](01-OVERVIEW.md),
[04-VANGUARD.md](04-VANGUARD.md), and [05-DOCTRINE.md](05-DOCTRINE.md), with
Prime's own contract carried by
`.opencode/skills/vantrilex-prime/SKILL.md`. The `prime` command above is
unrelated to the Prime skill: it is the session-context primer.
