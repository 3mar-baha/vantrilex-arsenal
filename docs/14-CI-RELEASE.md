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

## The self-publish queue

A closure does not need a human at a terminal to become a release. The unit
appends one entry to `.opencode/release-queue.jsonl` at its closure commit; the
queue lane computes the version, proves the commit, and publishes:

```json
{"unit_type":"phase","scope":"the release notes, verbatim","base_commit":"<40-hex>",
 "status":"pending","published_version":null,"published_at":null,
 "intended_version":"v0.8.11"}
```

`unit_type` is `phase` or `mission`; `scope` is the release notes; `base_commit`
is the tree that gets tagged; `intended_version` is optional and, when present,
acts as a guard rather than a hint. Full field rules, the refusal table, and the
three publication modes are in `docs/dev/09-RELEASE-QUEUE.md`.

### The increment policy

The number is not hard-coded anywhere. `registry/policies/release-policy.json`
is the single source:

```json
{
  "increments": { "phase": { "patch": 1 }, "mission": { "minor": 1 } },
  "cascade": true
}
```

- A completed **phase** (one cluster, one remediation pass, one audit round)
  bumps `patch` once.
- A completed **mission** (a named multi-phase campaign) bumps `minor` once.
- `cascade: true` resets the lower components when a higher one moves.

The shipped values are the Arsenal defaults, and this repository runs them
unchanged. To restyle the line, edit that one file: change the component, the
amount, or both, or set `cascade` to `false` to keep lower components. The
publisher applies whatever the policy says and refuses a malformed policy
rather than guessing. No script and no workflow carries an increment value, so a
grep for a hard-coded increment is expected to return nothing.

### Fail-closed behaviour

Every run proves the exact queued commit with the battery (`generate-catalog
--check`, `verify-registry`, `verify-skills`, `verify-catalog`, `tsc`) before
anything is created. A refusal creates nothing and consumes nothing: a red gate,
an unreachable commit, a missing packaged path, or an `intended_version` that
does not match the number the policy computes all exit 1 with one audit line.
The absence of `.opencode/auto-release.enabled` disables the lane entirely.

## The tarball contents

The release workflow attaches one tarball per tag,
`vantrilex-arsenal-<tag>.tar.gz`, packaging exactly these paths — a missing
shipped path fails the job rather than producing a thinner archive than the
release notes describe:

```text
AGENTS.md AI_GUIDE.md CHANGELOG.md CONTRIBUTING.md LICENSE README.md
README.ar.md SECURITY.md
registry .opencode scripts docs
.editorconfig .gitattributes .gitignore .markdownlint.jsonc
```

`kit` is an **optional** path, not a required one: `scripts/self-publish.mjs`
declares it in `PACKAGE_OPTIONAL_PATHS`, so it is packaged when the released
commit still carries it and left out when it does not. Leaving it out is silent:
the log line that names packaged optional paths prints only when
`asset.optional.length > 0` (`scripts/self-publish.mjs:533`), and a commit with
no `kit` yields an empty list, so no line is emitted. The lock era ended at S3,
so current commits do not carry it while historical commits keep their original
shape.

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

## Publish accounting - v0.9.34 through v0.9.74

Lane key: standing-tag lane - one GitHub release per tag that already exists, created from the tag with no re-tagging and no asset upload. No publish gate runs on this lane; the only automated gate is the CI run on the push that landed the tag commit, and it exited success for every row below. The auto-publish workflow also fires on each of these releases and exits 0 with an owner-gated notice, because the guard is strictly ^v0.0.[0-9]+$ and none of these versions match; no asset is published and no release is marked latest by that workflow.

Approver of record for every row is the tagger and release author 3mar-baha (GitHub login). Gate result is quoted from the CI run for the tag commit SHA; the auto-publish guard outcome is recorded alongside it.

| Version | Tag date (UTC) | Commit | Lane | Gate result | Approver | Release published (UTC) |
|---|---|---|---|---|---|---|
| v0.9.34 | 2026-11-02 09:36:19Z | 5cb696080ece | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 09:36:24Z |
| v0.9.35 | 2026-11-02 10:04:49Z | 4924f74c66df | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 10:04:57Z |
| v0.9.36 | 2026-11-02 10:30:29Z | 1991a40ff0cb | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 10:30:31Z |
| v0.9.37 | 2026-11-02 13:53:10Z | 55a7da4adaa8 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 13:53:42Z |
| v0.9.38 | 2026-11-02 14:57:54Z | a4cabbb95747 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 14:58:22Z |
| v0.9.39 | 2026-11-02 16:05:14Z | c7e33cdd1cab | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 16:05:29Z |
| v0.9.40 | 2026-11-02 16:36:59Z | 678253d52985 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 16:37:09Z |
| v0.9.41 | 2026-11-02 17:09:54Z | e84f02c1ee15 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 17:10:02Z |
| v0.9.42 | 2026-11-02 17:41:04Z | 10cbc68017c7 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 17:41:15Z |
| v0.9.43 | 2026-11-02 18:02:40Z | b98c102f5713 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 18:02:48Z |
| v0.9.44 | 2026-11-02 18:25:50Z | 96f2fd4f681f | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 18:25:57Z |
| v0.9.45 | 2026-11-02 18:50:41Z | 46a53cafe44b | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 18:50:48Z |
| v0.9.46 | 2026-11-02 19:12:14Z | 0c61da843e89 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 19:12:23Z |
| v0.9.47 | 2026-11-02 19:39:30Z | 41e4b4063f0c | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 19:39:46Z |
| v0.9.48 | 2026-11-02 20:03:21Z | d3cef29638eb | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 20:03:30Z |
| v0.9.49 | 2026-11-02 20:28:36Z | d019603969de | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 20:28:46Z |
| v0.9.50 | 2026-11-02 20:56:40Z | 7e5aa873ea54 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 20:56:48Z |
| v0.9.51 | 2026-11-02 21:20:58Z | c9a0395e4674 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 21:21:09Z |
| v0.9.52 | 2026-11-02 21:43:39Z | 1934c8e02379 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 21:43:48Z |
| v0.9.53 | 2026-11-02 22:09:38Z | 7119b24383fc | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 22:09:48Z |
| v0.9.54 | 2026-11-02 22:32:51Z | 699dc3f3d206 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 22:33:00Z |
| v0.9.55 | 2026-11-02 22:52:24Z | 063f80c302b9 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 22:52:36Z |
| v0.9.56 | 2026-11-02 23:19:04Z | cd59a92d543c | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 23:19:11Z |
| v0.9.57 | 2026-11-02 23:40:41Z | ea29d45d0f3d | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-02 23:40:50Z |
| v0.9.58 | 2026-11-03 00:05:57Z | 9be335b90d95 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 00:06:08Z |
| v0.9.59 | 2026-11-03 00:21:52Z | c053b82a3289 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 00:22:02Z |
| v0.9.60 | 2026-11-03 00:42:42Z | bff487bccb73 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 00:42:47Z |
| v0.9.61 | 2026-11-03 01:05:31Z | 264afc917926 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 01:05:36Z |
| v0.9.62 | 2026-11-03 01:30:14Z | cbeb8659585e | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 01:30:18Z |
| v0.9.63 | 2026-11-03 01:57:54Z | c9ff68a48058 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 01:58:02Z |
| v0.9.64 | 2026-11-03 02:22:24Z | 9d7a1aed3896 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 02:22:34Z |
| v0.9.65 | 2026-11-03 02:45:01Z | d2e800b7c168 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 02:45:10Z |
| v0.9.66 | 2026-11-03 03:12:40Z | 9542c4fff0e0 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 03:12:51Z |
| v0.9.67 | 2026-11-03 03:37:35Z | fd3b84d711ac | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 03:37:39Z |
| v0.9.68 | 2026-11-03 04:01:11Z | caa510b6780d | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 04:01:20Z |
| v0.9.69 | 2026-11-03 04:25:57Z | 329e57cb0bb4 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 04:26:05Z |
| v0.9.70 | 2026-11-03 04:50:37Z | 03a712a1832c | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 04:50:45Z |
| v0.9.71 | 2026-11-03 05:19:42Z | 78a18c1456f5 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 05:19:51Z |
| v0.9.72 | 2026-11-03 05:43:13Z | dcd7b801c259 | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 05:43:22Z |
| v0.9.73 | 2026-11-03 06:15:50Z | c585be7d56bf | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-03 06:16:00Z |
| v0.9.74 | 2026-11-04 07:07:32Z | b0c005b23dba | standing-tag lane | CI success; auto-publish guard: owner-gated (no asset) | 3mar-baha | 2026-11-04 07:07:40Z |

## The switch: .opencode/auto-release.enabled

.opencode/auto-release.enabled is an owner-created, machine-local gate by design. It is never committed, never tracked, and never generated by the repository: a checkout cannot tell whether it is present, and no commit can assert its state. The repository therefore can never prove the switch state, and any claim about it from inside the repo is unverifiable.

What CI can and does enforce is the repo half: for every tag, either a queue entry in .opencode/release-queue.jsonl (self-publish lane) or an asset-lane release record (standing-tag lane) must exist. That is the repo-side proof; the switch itself stays outside repo scope. Absence of the file disables the self-publish lane entirely and fail-closed.

No process in this repository may create, commit, or infer the file. Its presence or absence is an owner decision made on the machine that runs the publisher, and the publisher refuses the lane when it is absent.
