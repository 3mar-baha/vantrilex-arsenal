# CI and Release

Continuous integration proves every change; the release lane ships versions.
CI runs on `ubuntu-latest` with Node 25. The workflow files are
`.github/workflows/ci.yml` and `.github/workflows/release.yml`; the
publishing script is `scripts/release.sh`.

## What CI runs

| Job | Steps |
|---|---|
| `lint` | `bash -n` over `scripts/*.sh` and `.githooks/*`; `shellcheck` over the same; `node --check` over every `.mjs` file |
| `verify` | `node scripts/generate-catalog-json.mjs --check`; `node scripts/verify-registry.mjs`; the kit verifier when its script has landed |
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
