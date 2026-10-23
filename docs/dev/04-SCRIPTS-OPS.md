# 04 — Operations Scripts

Nine POSIX `bash` scripts live in `scripts/`, beside two Node publishers
(`self-publish.mjs`, `backfill-publish.mjs`) documented in
`09-RELEASE-QUEUE.md`. Together the shell scripts provision a worktree per
concern, inject the phase kit, integrate, tear down, record a decision, activate
the git hooks, migrate a checkout to the V2 layout, publish a release, and attach
the distributable. Each takes `-h` or `--help`, and each refuses rather than
guessing.

## `dispatch-worktrees.sh` — one worktree per concern

Provisions a worktree on branch `wt/<concern-slug>`, injects that phase's
component kit into it, and drops a briefing so a subagent can start without a
confirmation round-trip. One concern per branch is the repository law, so a
worktree carries exactly one.

It reads `docs/17-CHECKPOINT.md` as labeled lines (`**Label:** value` or
`Label: value`, optionally indented or bulleted) and consumes:

- `Status:` `ACTIVE` or `BLOCKED`. Required.
- `Phase:` `scout`, `docs`, `plan`, `build`, `review`, or `operate`. Drives
  which components are injected.
- `Concern:` a kebab-case slug, becoming the worktree name and branch suffix.

It refuses when the status is BLOCKED (the circuit breaker owns the session),
when the slug is unsafe or already dispatched, or when the index has staged
changes — a worktree branches from HEAD, so uncommitted state must never cross
a worktree boundary.

## `merge-worktrees.sh` — gate, integrate, prune

For a dispatched concern it runs the regression gate over the concern's diff
against the base branch: `bash -n` plus `shellcheck` (when installed) over
changed shell scripts, and markdownlint (when Node is available) over changed
markdown. Then it merges with `--no-ff`, so history keeps one merge commit per
concern, prunes the worktree and branch, and stamps the checkpoint with one
integration line.

Usage: `./scripts/merge-worktrees.sh <CONCERN_SLUG> [--keep]`. It refuses on a
BLOCKED checkpoint, a dirty index, an unsafe slug, a missing branch, or a gate
failure. Exit 0 means merged and pruned; exit 1 means nothing was merged.

## `orchestrate-stage.sh` — phase-scoped injection

Given a phase, it purges every previously injected component and injects
exactly the ones that phase needs, so context spend tracks the work instead of
keeping the whole kit hot. Inputs are `.opencode/equip.manifest.json`, which
names the selected tokens, and `registry/catalog.json`, which supplies each
component's `phase` and `kind`.

The phase vocabulary is the catalog enum: `scout`, `docs`, `plan`, `build`,
`review`, `operate`, `on-demand`. `on-demand` is a catalog value but not an
orchestrated phase — such a component loads when asked for, so pinning it to a
phase would load it eagerly, which is the cost this script exists to avoid.

Records land under `.opencode/kit/<kind-dir>/<id>.md`, mirroring the registry's
kind-to-directory mapping. That subtree is the injection root precisely because
nothing tracked lives there. A missing component record is a warning, because
the registry is still being filled in; a missing kit directory, a missing lock,
an unreadable catalog, or a bad phase is fatal.

## `teardown-stage.sh` — clear a phase session

Removes the injected kit, the concern briefing, ephemeral stage hooks, the
circuit-breaker strike state, the spec index, and an empty `.worktrees/`. It
never touches project code, registry data, documentation, or the shipped
plugin, command, skills, and agent trees. Safe to run repeatedly and from any
directory. Exit 0 when teardown completed; exit 1 when a target survived.

## `release.sh` — publish a version

Runs the full ship sequence: derive and validate the semver and locate its
`CHANGELOG.md` section, extract that section as the release notes so nothing is
invented, refuse on a missing changelog entry, a dirty tree, a detached HEAD,
or an existing tag, create the annotated tag and push branch and tag, then
create the GitHub release from the extracted notes with `gh`.

Usage: `./scripts/release.sh <VERSION> [--draft]`. `VERSION` is `X.Y.Z` or
`X.Y.Z.W`; a leading `v` is accepted and stripped. Exit 0 when tagged, pushed,
and released; exit 1 on a refusal or a publish failure.

## `setup-git-hooks.sh` — activate the hooks

One line of work — `git config core.hooksPath .githooks` — plus a sanity check,
so a clone enforces secret scanning and zero AI attribution from the first
commit. Idempotent. The hooks themselves are `.githooks/pre-commit` and
`.githooks/commit-msg`. Exit 0 when `.githooks` is the active path; exit 1 when
git is missing, this is not a repository, or the path did not stick.

## `record-decision.sh` — append one ADR

Appends one Architecture Decision Record so every autonomous trade-off stays
auditable. The target is auto-detected, so a layout change needs no edit here:
`docs/03-architecture/13-ARCHITECTURE-DECISION-RECORD.md`. When it does not
exist the directory and a standard header are created, so the first decision
needs no manual step. Records are append-only; existing entries are never
reordered or rewritten.

```text
Usage:
  ./scripts/record-decision.sh <TITLE> [--status accepted|proposed|superseded]
                               [--context TEXT] [--decision TEXT]
                               [--consequences TEXT]
```

Exit 0 when the record was appended; exit 1 on a missing title, an invalid
status, or an unwritable log.

## `migrate-to-opencode-v2.sh` — plan, then apply

Moves one project checkout toward the V2 layout in four stages: a read-only
planner detects every legacy path, key, and token; a backupper moves each
original into a timestamped backup directory with a manifest; an applier writes
the migrated form through individually idempotent actions; a reporter prints one
line per action plus a summary.

Directory moves preserve content: `command` becomes `commands`, `skill`
becomes `skills`, `agent` becomes `agents`, `mode` or `modes` becomes `agents`
with a `mode: primary` marker, and `plugin` becomes `plugins` by relocation
alone — plugin bodies are relocated and never ported. Config renames touch a
project's `opencode.json` and `opencode.jsonc` only. Anything uncertain is
skipped with a warning and a guide entry; nothing is guessed.

```text
Usage:
  ./scripts/migrate-to-opencode-v2.sh [--dry-run] [target-dir]
```

Exit 0 when migrated or already migrated, 1 on a usage error, a bad target,
or a backup failure, and 2 when migration completed but a legacy instruction
file needs a human merge.

## `auto-publish.sh` — attach the distributable

The asset lane. Triggered by a published GitHub release, it builds the
`vantrilex-arsenal-<tag>.tar.gz` from the exact tagged commit, gates the upload
on that commit's CI evidence plus the full battery, and uploads idempotently by
name and sha256. It is inert for anything outside the strict `^v0\.0\.[0-9]+$`
shape: a minor or major release ends with an owner-gated notice and exit 0, so a
forward-line `v0.8.x` publish never triggers an upload. `DRY_RUN=1` is the local
default. The queue lane that creates the tag and release is
`scripts/self-publish.mjs`, documented in `09-RELEASE-QUEUE.md`; the two jobs
share `.github/workflows/auto-publish.yml` and never run each other's work.

## Count note

This directory holds nine shell scripts — the nine named above. An earlier
revision of `docs/08-VERIFICATION.md` asserted "seven orchestration scripts"; the
live count is nine, and that file now states nine. The reconciliation is recorded
here rather than left as an unexplained discrepancy.
