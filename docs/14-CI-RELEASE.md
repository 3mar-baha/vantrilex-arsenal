# CI and Release

Continuous integration proves every change; the release lane ships versions.
CI runs on `ubuntu-latest` with Node 25. The workflow files are
`.github/workflows/ci.yml` and `.github/workflows/auto-publish.yml`; the
publishing script is
`scripts/release.sh`, and the post-release publisher is
`scripts/auto-publish.sh`.

## What CI runs

| Job | Steps |
|---|---|
| `lint` | `bash -n` over `scripts/*.sh` and `.githooks/*`; `shellcheck` over the same; `node --check` over every `.mjs` file |
| `verify` | `node scripts/generate-catalog-json.mjs --check`; `node scripts/verify-registry.mjs`; `node scripts/verify-catalog.mjs` |
| `types` | Pinned `tsc --noEmit` when a `tsconfig.json` exists; SKIPPED with the reason when none exists, never PASS |
| `build` | Bash shebang plus executable bit on all seven orchestration scripts; checkpoint labeled-field contract when the checkpoint exists; tarball packaging smoke test |

Details that matter:

- The kit-verifier step is honest about absence: when the verifier script is
  not on the branch, the step reports a notice and continues. That is a SKIP,
  not a pass; the kit gate stays open per
  [08-VERIFICATION.md](08-VERIFICATION.md).
- The checkpoint step behaves the same way for the target-project checkpoint
  document: absent means SKIPPED with the reason, never a free pass.
- The tarball smoke test packages every listed path that exists on the branch
  and reports absent ones by name. The strict packaging gate is the release
  workflow, not CI.

## The release lane

Guards, then changelog, then semver, then tag, then publish, then verify:

1. The three second-pass guards (Clean Code, Test, Docs) pass — see
   [12-QUALITY-GATES.md](12-QUALITY-GATES.md).
2. `CHANGELOG.md` carries the version's entry; the notes ship verbatim.
3. The version is valid semver; a `!` commit or `BREAKING CHANGE:` footer
   forces a MAJOR bump.
4. An annotated tag `v<version>` is created and pushed with the branch.
5. `gh release` publishes from the extracted notes.
6. Post-release verification runs from a fresh clone.

The publishing script refuses on purpose rather than shipping half a release:
no changelog entry, dirty tree, detached HEAD, existing tag, or missing `gh`
authentication each exit non-zero before anything is pushed. Usage:

```bash
./scripts/release.sh <VERSION> [--draft]
```

`VERSION` is `X.Y.Z` or `X.Y.Z.W`, with an optional leading `v` that is
stripped. `--draft` creates the GitHub release as a draft for review.

## The tarball contents

The release workflow attaches one tarball per tag,
`vantrilex-arsenal-<tag>.tar.gz`, packaging exactly these paths — a missing
shipped path fails the job rather than producing a thinner archive than the
release notes describe:

```text
AGENTS.md AI_GUIDE.md CHANGELOG.md CONTRIBUTING.md LICENSE README.md
README.ar.md SECURITY.md
registry .opencode scripts kit docs
.editorconfig .gitattributes .gitignore .markdownlint.jsonc
```

If the tag landed before its release was created, the workflow creates the
release from the changelog notes first, then uploads the artifact with
overwrite enabled, so the upload always has a target.

## Auto-publish for v0.0.x patches

A published `v0.0.x` patch release publishes its own distributable. No manual
upload step follows the release. `.github/workflows/auto-publish.yml` triggers
on `release: types: [published]` and runs `scripts/auto-publish.sh`, which is
also the local entry point.

The guard is strictly `^v0\.0\.[0-9]+$`: no prerelease suffix, no build
metadata, no `0.x.0` minor, no `x.0.0` major. Anything outside that shape ends
the run with an owner-gated notice and exit 0, so a minor or major release
publishes only after the owner's named go. A release flagged prerelease is
treated the same way.

The gate is two proofs and both are required:

1. **CI evidence for the exact commit** — the `ci` workflow's runs for the
   tagged commit's SHA are all `completed` with conclusion `success`, and at
   least one exists. A commit with no `ci` run has no evidence and fails, and a
   commit the remote does not know is refused by name. Only
   `.github/workflows/ci.yml` runs are read, so the auto-publish workflow's own
   job on that commit is never counted against it.
2. **The battery, re-run at the tagged tree** — `git archive` extracts the
   exact commit into a temporary directory and runs
   `node scripts/generate-catalog-json.mjs --check`,
   `node scripts/verify-registry.mjs`, `node scripts/verify-skills.mjs`,
   `node scripts/verify-catalog.mjs`, and `tsc --noEmit -p tsconfig.json` there.

Both proofs are always evaluated, so one refusal names every failing check.
Missing tooling and an absent verifier are failures, never skips: a check that
cannot be evaluated is a failed check, and a failed gate uploads nothing.

The artifact is built from the tagged commit, not from a worktree, and carries
the established name and path set:

```text
vantrilex-arsenal-v<0.0.x>.tar.gz
```

`git archive` is deterministic for a commit, so a re-run rebuilds identical
bytes. The upload is idempotent by name and sha256: an identical asset is
skipped, a same-named asset with different bytes is replaced with `--clobber`,
and a new name is uploaded. Re-running therefore never leaves two copies of one
artifact. On success the release is marked latest.

Every run appends one machine-readable line to
`.opencode/audit/AUTO-PUBLISH.log`:

```text
version | commit | timestamp (UTC) | artifacts (name, sha256, bytes) | channels | result
```

`result` carries the gate verdict as a subfield, for example
`published;gate=PASS`. In CI the same line is written to the job summary and
the log file is kept as a run artifact; the workflow commits nothing back to
the repository.

Channels this plugin ships through, and what auto-publish does for each:

| Channel | Auto-publish action |
|---|---|
| GitHub release asset (`vantrilex-arsenal-v<tag>.tar.gz`) | Uploaded, or skipped when identical |
| Git tag (`refs/tags/v<tag>`, the clone channel) | Already published by the release itself; no upload step |

Dry-run is the default for the local script and for manual dispatches:

```bash
DRY_RUN=1 ./scripts/auto-publish.sh v0.0.99
```

`DRY_RUN=1` resolves the tag, builds the artifact, runs the full gate, and
prints the artifact identity, the decision per channel, and the audit line. It
uploads nothing and marks no release latest. Publishing requires `DRY_RUN=0`
explicitly.

`release.yml` is retired. `auto-publish.yml` is the sole asset writer: it runs
when a release is published, uploads exactly one artifact, and a `v*` tag push
starts no CI run.
