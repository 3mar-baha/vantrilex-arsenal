---
name: github-release-packager
description: Use when cutting a release — governs the release lane end to end by requiring the Clean Code, Test and Docs second-pass guards, deriving the semantic version from conventional commits, refusing to publish from a dirty worktree or a missing changelog entry, tagging, publishing with gh release, and verifying from a fresh clone.
---

# GitHub Release Packager

## Purpose

Govern the release path end to end: guard sign-off, changelog entry, semantic version
derivation, annotated tag, publication, and post-release verification. This is the
executable form of the Release workflow, whose order is fixed — three second-pass guards,
then changelog, then semver check, then tag, then publish, then verify.

A release is the one moment where the repository's history becomes immutable, so every
step here is a refusal point first and an action second. The packager declines to publish
on any missing precondition rather than publishing and repairing afterwards.

## When to Use

- Cutting a version from a guarded, passing codebase.
- Deriving the next semantic version from commit history and checking it against the
  latest tag.
- Publishing a tagged GitHub release and verifying it afterwards.
- Deciding whether a pending set of changes is releasable at all.

## Do NOT use

- To retroactively justify a version already chosen. The version is derived from commit
  history; if the derived version is inconvenient, the commits are wrong, not the rule.
- On a dirty worktree, or with a missing `CHANGELOG.md` entry. Both are refusals, not
  warnings.
- To publish a hotfix straight from a feature branch. Merge through the review phase
  first, so the tag points at reviewed code.
- To rewrite or move an existing published tag. A published `vX.Y.Z` is permanent; a
  correction ships as a new version.

## Inputs

- `CHANGELOG.md`, which must contain an entry for the pending version in the same change.
- Conventional commits since the last `vX.Y.Z` tag.
- The guard results for the three second-pass guards: Clean Code, Test, Docs.
- Authenticated `gh` CLI and a clean git worktree.
- A `RELEASE_NOTES.md` staging file for the composed release notes.

## Procedure

### Part 1 — Guard sign-off

1. Confirm the three second-pass guards passed on the exact commit being released. All
   three must be green before a release is cut:
   - **Clean Code guard** — lint and typecheck clean.
   - **Test guard** — the full test suite passes; no skipped or quarantined test is
     riding along in the release commit.
   - **Docs guard** — every user-visible change has a `CHANGELOG.md` entry and every
     relative link resolves. This guard fails a release without a changelog entry.
2. Refuse to continue if any guard is red or was not run. Name the failing guard and stop.

### Part 2 — Release governance

3. Check the mandatory preconditions and refuse to proceed if either fails:

   ```
   git status --porcelain                     # must print nothing
   grep -n "<pending-version>" CHANGELOG.md   # must match
   ```

4. Derive release notes by merging the `CHANGELOG.md` entry for the pending version with
   the conventional commits since the last tag:

   ```
   git log "$(git describe --tags --abbrev=0)..HEAD" --pretty=format:"- %s"
   ```

5. Run the semver check: a breaking change (`feat!` or a `BREAKING CHANGE` footer)
   requires a MAJOR bump, new features require MINOR, fixes and chores require PATCH.
   Compare the result against the latest `vX.Y.Z` tag and block on any mismatch.
6. Publish using this checklist, in this order — the annotated tag is pushed first, so
   the release can never exist without its tag:

   ```
   gh auth status                                                # must show a logged-in account
   git tag -a vX.Y.Z -m "vX.Y.Z" && git push origin vX.Y.Z       # annotated tag, pushed
   gh release create vX.Y.Z --title "vX.Y.Z" --notes-file RELEASE_NOTES.md
   ```

7. Post-release verification: confirm badge URLs resolve against live endpoints; run the
   clone-from-scratch test — fresh clone, install per Quick Start, execute the documented
   command; confirm the release page renders the notes.

## Outputs

- Guard sign-off recorded for Clean Code, Test and Docs against the released commit.
- Drafted release notes derived from `CHANGELOG.md` plus conventional commits.
- Annotated tag `vX.Y.Z` pushed to origin, with a published GitHub release.
- Post-release verification report covering badge URLs, fresh-clone behavior and the
  rendered release page.
- The released version recorded in `docs/17-CHECKPOINT.md`.

## Failure Modes

- **Dirty worktree**: refuse to release; instruct the operator to commit or stash and
  re-run from step 3.
- **Unauthenticated `gh` CLI**: emit the exact remediation command `gh auth login`, then
  re-run `gh auth status` before continuing.
- **Missing changelog entry**: block the release and offer to draft the missing entry from
  the conventional commits since the last tag, subject to Guide approval before proceeding.
- **Semver mismatch**: a breaking change paired with a non-major bump blocks the release;
  require the correct major bump and an updated `CHANGELOG.md` in the same change.
- **A second-pass guard never ran**: treat an unrun guard exactly as a failed guard. A
  release cut without recorded guard evidence is a release cut without proof.
- **Fresh clone fails**: the release is defective regardless of what `gh release` reported.
  Cut a PATCH release with the fix; never amend or move the published tag.
