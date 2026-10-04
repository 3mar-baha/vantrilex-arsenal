---
description: Drive the release workflow end to end - second-pass guards, changelog entry, semver check, annotated tag, GitHub release, then fresh-clone verification.
---

# Release

You are releasing a version of this project. Every step below is a gate. A gate
that does not pass stops the release; it is never worked around.

Operator intent for this run:

$ARGUMENTS

If that is empty, release the version the changelog already declares as pending.
If it names a version, treat it as the requested version and validate it against
the changelog. If it says `dry-run`, run every gate, print every command you
*would* run, and stop before the tag.

## Gate 0 - Refuse a dirty worktree

Run `git status --short`.

If it prints anything, **stop immediately** and print exactly this shape:

```
BLOCKED: the worktree is not clean, so no release can be cut from it.

Remediation, pick one:
  git add -A && git commit -m "<type>: <summary>"
  git stash push -u -m "pre-release WIP"
  git restore --staged --worktree .

Then re-run: /release
```

Do not offer to clean it up yourself. Do not proceed to any later gate. Do not
create a branch to make the tree look clean — a release is cut from a tree the
operator has already committed.

Also confirm, before continuing:

- the current branch is the one the operator intends to release from, and name
  it;
- the branch is up to date with its remote (`git status -sb` shows no ahead or
  behind), otherwise print the fetch-and-rebase remediation and stop.

## Gate 1 - The three second-pass guards

These run last, right before the release, over the tree as it stands. All three
must pass. Report each as `PASS`, `FAIL`, or `SKIPPED` with the reason.

**1a. Clean Code guard.** The code is reviewable, not merely working.

- No debugging residue: search the diff against the merge base for leftover
  breakpoints, commented-out blocks, and stray writes to the console in
  library code.
- No dead code introduced by this change.
- Every error path has a defined outcome.
- No secret, token, or credential appears anywhere in the diff. Never print a
  suspected secret; report the file and line only.
- The project's own static analysis passes: the type check, the linter, and the
  formatter check, whichever the project configures. A project that configures
  none reports `SKIPPED`, not `PASS`.

**1b. Test guard.** The tests exist, they run, and they are honest.

- Run the project's test command as declared in `package.json`.
- Any new behaviour in this change is covered by a test that fails without the
  change.
- Run `node scripts/verify-registry.mjs` when that script exists.
- A skipped test is a `FAIL` unless the skip is asserted in the test itself.
- Zero tests for a behaviour change is a `FAIL`.

**1c. Docs guard.**

- Every relative link in the changed Markdown resolves to a file that exists.
  Check it; do not assume.
- `CHANGELOG.md` is handled by gate 2, not here.
- No Markdown file was added outside the canonical documentation set: the
  numbered series under `docs/`, the archive directory, `docs/spec/`,
  `registry/`, `.opencode/`, or the repo-root `README.md`, `AGENTS.md`,
  `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`. Anything else is a `FAIL` —
  fold it into the document that already owns the topic, or extend the numbered
  series and update the index.
- The generated catalog mirror is in sync: run the catalog generator and confirm
  it produced no diff. A generated file that differs is a `FAIL`, and the fix is
  to regenerate and commit, never to hand-edit.

If any of the three fails, stop and print the failing guard, the evidence, and
the remediation. Do not tag a release that a guard rejected.

## Gate 2 - Changelog carries this version

The pending version needs an entry **in the same change as the code**, not in a
follow-up commit.

1. Determine the pending version: the first released heading under
   `## [Unreleased]` in `CHANGELOG.md`, or the version in the project's manifest.
2. Confirm the changelog has an entry for it under the appropriate
   `### Added`, `### Changed`, `### Fixed`, or `### Removed` heading.
3. Confirm the working tree already carries it. If the changelog entry is
   missing or uncommitted, stop and print:

```
BLOCKED: CHANGELOG.md has no entry for <version> in this change.

Remediation:
  1. Add the entry under the right heading in CHANGELOG.md.
  2. git add CHANGELOG.md
  3. git commit -m "docs: changelog for <version>"
  4. Re-run: /release
```

## Gate 3 - Semver check

Validate the pending version against the project's declared version and against
Semantic Versioning 2.0.0.

- It must match `MAJOR.MINOR.PATCH` with numeric components, no `v` prefix in
  the manifest, and no leading zeroes.
- Read the changelog diff between the last tag and `HEAD`:
  - any removed or renamed public API, or a changed default, forces a MAJOR bump;
  - any added public API or a backwards-incompatible behaviour change forces at
    least a MINOR bump;
  - fixes and internal changes alone need only a PATCH bump.
- The chosen version must be the smallest bump the change justifies, and it must
  be strictly greater than the latest tag.
- The commit subjects since the last tag must follow Conventional Commits:
  `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`. A `!` after the
  type, or a `BREAKING CHANGE:` footer, forces a MAJOR bump.

Print the evidence: the last tag, the version chosen, the bump rule that fired,
and the commits that justified it. A mismatch is a `FAIL`; stop and print the
correction.

## Gate 4 - Annotated tag

Create the tag only after gates 1 through 3 pass.

```
git tag -a v<version> -m "v<version>: <one-line summary>"
```

Use an annotated tag, never a lightweight one. Verify it with
`git cat-file -t v<version>`, which must print `tag`, and confirm it points at
the current `HEAD` with `git rev-parse v<version>^{commit}`.

If the tag already exists, stop. Never move or overwrite an existing tag.

## Gate 5 - Publish the GitHub release

```
git push origin <branch>
git push origin v<version>
gh release create v<version> --title "v<version>" --notes-file <path>
```

Take the release notes from the changelog entry for this version — the same text
the operator approved in gate 2, not a freshly written summary.

If `gh` is not installed or not authenticated, stop and print the remediation:
install the GitHub CLI, run `gh auth login`, then re-run. Never fabricate a
release URL. Report the release URL only from the output of `gh release create`.

## Gate 6 - Post-release fresh-clone verification

A release is not done until a clean clone of the tag works. Verify from outside
the working tree.

1. Clone into a fresh directory outside this worktree:
   `git clone --depth 1 --branch v<version> <remote-url> <temp-dir>`
2. In the clone, run the project's install, build, and test commands in that
   order. Record each exit code.
3. Confirm the clone contains what the release promised: the version in the
   manifest matches the tag, and the generated artifacts are present.
4. Confirm the installed kit loads from the clone — the plugin module compiles
   under the project's type check, and the operator commands are present in the
   command directory.
5. Delete the temporary clone.

Report each step with its exit code. A non-zero exit code is a `FAIL` and the
release is not verified — print it plainly, with the failing command and its
output, and recommend a patch release rather than a re-tag.

## Final report

Print, in this order:

1. **Version** — the tag, and the bump rule that justified it.
2. **Gates** — one line per gate with its verdict.
3. **Published** — the tag, the pushed refs, and the release URL from `gh`.
4. **Verified** — the fresh-clone results with exit codes.
5. **Remaining** — anything skipped, with its reason.

If you stopped at a gate, print only that gate, its evidence, and its
remediation, then stop. Do not continue to later gates and do not suggest
skipping the gate you failed.
