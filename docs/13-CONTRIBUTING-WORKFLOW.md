# Contributing Workflow

How to land a change in Vantrilex Arsenal. The contributor-facing companion
is [CONTRIBUTING.md](../CONTRIBUTING.md); the hard rules underneath are
[AGENTS.md](../AGENTS.md). This file is the workflow view: branches, commits,
changelog, components, and corrections.

## Branch discipline

One concern per branch. Branch name: `wt/<concern-slug>`. Never commit to
`main` directly, never force-push, never rewrite published history. Parallel
work fans out as worktrees under [11-WORKTREES.md](11-WORKTREES.md), one
concern per worktree, with reviewed signed-off merges back.

## Conventional Commits

Commit messages follow Conventional Commits:

```text
feat: add when_to_use backfill for Tier-0 skills
fix: correct firecrawl-mcp install command scope
docs: add the 16-file Arsenal documentation set
```

Valid types include `feat`, `fix`, `docs`, `refactor`, `chore`, and `test`.
A `!` after the type, or a `BREAKING CHANGE:` footer, forces a MAJOR version
bump at release.

## CHANGELOG in the same change

Any user-visible edit updates [CHANGELOG.md](../CHANGELOG.md) in the same
change — same branch, same pull request. The format follows Keep a Changelog
and versioning follows Semantic Versioning. The Docs guard fails a release
without the entry, because release notes are extracted verbatim from the
changelog (see [14-CI-RELEASE.md](14-CI-RELEASE.md)).

## How to add a component

1. Find or create the record in the owning `registry/data/*.jsonl` sidecar,
   respecting the single-writer law: no two branches write one sidecar.
2. Verify the install command against the real registry — `npm view <pkg>`,
   the GitHub repository, or the vendor's own docs. Record what was checked.
   If it cannot be verified, set `install_cmd` to null with verification
   `unverified` (see [06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md)).
3. Fill `when_to_use`, `phase`, and `tier`. Tier `core` is Tier-0 only and
   needs a slot in the 52-component budget (36 tier core records plus 16
   tier conditional entries, all locked).
4. If the component overlaps an existing one, record `supersedes` or
   `pairs_with` in `registry/data/overlaps.yaml`.
5. Update `CHANGELOG.md` in the same change.
6. Run the gates that apply (see [08-VERIFICATION.md](08-VERIFICATION.md)):

```bash
node scripts/verify-registry.mjs
node scripts/generate-catalog-json.mjs --check
shellcheck scripts/*.sh .githooks/*
npx tsc --noEmit
npx markdownlint-cli "**/*.md"
```

A check that could not be run is a failed check: say so in the pull request
description rather than leaving it green-looking.

## How to report a wrong install command

Open an issue with the component id, the command that is wrong, and the
registry output that proves it. Wrong commands are correctness bugs at the
highest severity — they are the one class of error in this repository that an
agent will execute. The install-command invariant that guards them is
documented in [06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md), and the threat
model behind it in [SECURITY.md](../SECURITY.md).

## Skill-file format standard

Every `SKILL.md` follows one shape, because deviation breaks the registry:

```text
---
name: <lowercase-hyphenated, matches the containing folder name>
description: <third person, one sentence, what it does AND when to trigger it>
---

# <Title>

## Purpose
## When to Use
## Do NOT use
## Inputs
## Procedure
## Outputs
## Failure Modes
```

`name` must be lowercase-hyphenated and identical to the folder name —
OpenCode rejects a mismatch. `description` is what the model reads when
deciding whether to load the skill: front-load concrete trigger keywords and
write when to use it, never first-person offers of help.
