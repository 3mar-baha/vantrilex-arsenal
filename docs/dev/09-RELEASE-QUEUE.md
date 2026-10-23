# 09 — Release Queue and Self-Publish

The release system has three writers and one queue. This file documents the
queue lane: what a queue entry may contain, where the version number comes
from, how a run refuses, and what each of the three publication modes means.
The asset lane and the tag/release sequence are in
[14-CI-RELEASE.md](../14-CI-RELEASE.md).

## The three lanes, kept apart

| Lane | Writer | Trigger | Responsibility |
|---|---|---|---|
| Queue lane | `scripts/self-publish.mjs` | a push to the default branch with a pending entry, or a manual dispatch | compute the number, prove the commit, create the tag and release, consume the entry |
| Asset lane | `scripts/auto-publish.sh` | `release: types: [published]` | attach the distributable for a `v0.0.x` patch release |
| Backfill lane | `scripts/backfill-publish.mjs` | operator, per the approved map | publish historical units in ascending order, one at a time |

Both workflow jobs live in `.github/workflows/auto-publish.yml` and never run
each other's job. The backfill lane is a one-off historical executor and is not
part of the forward line.

## The queue file

`.opencode/release-queue.jsonl` — one JSON object per line, in closure order.

Six keys are required and closed (`QUEUE_KEYS`). One more key is optional and
deliberately outside that set, because its absence is a valid state.

| Field | Type | Rule |
|---|---|---|
| `unit_type` | string | One of `phase`, `mission`. Decides which policy increment applies |
| `scope` | string | Non-empty. **This text is the release notes**, verbatim — not a summary the operator retypes at publish time |
| `base_commit` | string | Lowercase hex commit id, 7–40 characters. The release point: the tree that gets tagged and archived |
| `status` | string | `pending` or `published` |
| `published_version` | string or null | `null` while pending; must be a `vX.Y.Z` tag once published |
| `published_at` | string or null | `null` while pending; a UTC timestamp once published |
| `intended_version` | string or null, **optional** | Canonical `vX.Y.Z`. A declared intent, not a hint — see the guard below |

A published entry must carry both `published_version` and `published_at`. An
entry that omits any required key, carries an unknown `unit_type`, or uses a
shorthand intent such as `0.8.11` fails the parse: the publisher never
normalises a human's shorthand, because a release number is not a guess.

Selection is FIFO: the oldest `pending` entry is the one a run acts on. A stuck
entry therefore surfaces rather than being skipped silently.

The live entry, as observed 2026-10-22:

```json
{"unit_type":"phase","scope":"Cluster 1 — lock abolition + replacement proofs: ...","base_commit":"d004330","status":"published","published_version":"v0.8.11","published_at":"2026-10-22T10:18:55Z","intended_version":"v0.8.11"}
```

## The policy file

`registry/policies/release-policy.json` is the **single source** of every
increment. No script and no workflow hard-codes one; the publisher applies
whatever the policy says.

```json
{
  "policy": "release-increments",
  "policy_version": 1,
  "description": "...",
  "increments": {
    "phase": { "patch": 1 },
    "mission": { "minor": 1 }
  },
  "cascade": true
}
```

| Key | Contract |
|---|---|
| `increments.phase` | Exactly one of `major`, `minor`, `patch`, with a positive integer |
| `increments.mission` | Same rule |
| `cascade` | Boolean, default `true`: a higher bump resets the components below it |

**What counts as a phase vs a mission.** A phase is a bounded unit of a
program — one cluster, one remediation pass, one audit round. A mission is a
named multi-phase campaign. The class is an owner ruling recorded on the unit,
never something the publisher infers from the diff.

**How a user changes it.** Edit the numbers in that one file, or swap which
component each unit type bumps. A `phase` set to `{"minor": 2}` with cascade on
turns `v0.7.7` into `v0.9.0`; `cascade: false` keeps the lower components
(`v0.7.7` plus `major` becomes `v1.7.7`). Both are proven in the self-test,
which is why the claim is testable rather than asserted. A malformed policy —
a missing unit type, two components, a zero bump, a non-boolean `cascade` —
fails the release closed instead of guessing.

The shipped defaults are the Arsenal increment law: completed phase `+0.0.1`,
completed mission `+0.1.0`, standard cascade.

## How the number is computed

1. Read every tag, keep only strict `vX.Y.Z`, and take the highest. The live tag
   list also carries `v7.5`, the 0.7.5 release under a two-component name;
   reading it as `7.5.0` would move the whole line, so it is ignored rather than
   guessed at.
2. Apply `increments[unit_type]` from the policy, honouring `cascade`.
3. If the entry declares `intended_version`, compare. Equal means publish;
   different means refuse (below).

The computed tag cannot already exist, because it is always higher than the
highest tag. The idempotency that matters is therefore *this commit is already
tagged*, which the already-released arm checks first.

## The three publication modes

The backfill manifest `.opencode/audit/RELEASE-BACKFILL.json` carries one entry
per historical unit, and every entry names its mode. The forward queue lane
always publishes in `commit` mode, because a queue entry's `base_commit` is by
definition a commit.

| Mode | `ref` | What ships | Notes statement |
|---|---|---|---|
| `commit` | A full 40-character commit id. Required | The source tree as it was at that commit, `git archive`d | "Commit-anchored release: the package is the tree as it was at `<ref>`" |
| `evidence` | `null` | The enumerated closure-evidence bundle: report paths, quoted as-closed output, closure-record references | "No committed source tree exists for this unit; this package preserves its closure record" |
| `closure-record` | `null` | The surviving ledger passage, quoted verbatim into a generated `CLOSURE-RECORD.md` | "Closure-record release" — the report artifact was overwritten in its own era and no copy survives |

Rules the manifest enforces:

- A `commit` entry must carry a full 40-character lowercase `ref`; an `evidence`
  or `closure-record` entry must carry `ref: null`. No commit is invented for a
  unit that has none.
- Only a `closure-record` entry may carry a `record` object naming the closure
  record it quotes.
- A ready entry must enumerate at least one asset, except a `closure-record`
  entry, whose asset is the transcript of the surviving record.
- `as_closed` must quote the closure record's verification evidence. A battery
  re-run today is never substituted for as-closed evidence.
- A held entry must carry a non-empty `hold_reason`; a ready entry must carry
  `hold_reason: null`.

The map that authorises the manifest is
`.opencode/audit/RELEASE-BACKFILL-MAP.md`, owner-approved 2026-10-21 on its
recorded terms. The manifest pins `map_sha256`, so a map edit without a manifest
update fails the executor rather than publishing against a map nobody approved.
The standing rule recorded there binds every later closure: **numbers assigned
at closure, in closure order; no retroactive renumbering, ever.**

## Verify before create

The gate runs against the extracted commit, never the worktree — `git archive`
into a temporary directory, then five named checks:

```text
generate-catalog-json --check
verify-registry
verify-skills
verify-catalog
tsc --noEmit
```

A missing checker is a `FAIL`, never a skip. Every check is evaluated so one
refusal names all failing checks, and a red gate creates nothing: no tag, no
release, no queue rewrite. The asset is built from the tagged commit, so a
shipped path missing at that commit refuses the run before a tag exists.

## The fail-closed intent guard

A closure record may assign a version number before the forward line can
produce it — `v0.8.11` was assigned at Cluster 1's S6 closure while the line's
highest tag was still `v0.7.7`. `intended_version` is how the entry carries that
number, and the guard is what makes it safe:

| Computed vs declared | Action |
|---|---|
| No intent declared | Publish the computed number |
| Equal | Publish the computed number |
| Different | **Refuse**: create nothing, consume nothing, leave the entry pending |

The mismatch refusal is ordered after the already-released arm and **before**
the commit check, the battery, the asset and every write. A mismatch therefore
costs exactly one audit line:

```text
refused-intent;gate=not-evaluated;intended=v0.8.11;computed=v0.7.8
```

The ordering is load-bearing twice. The already-released arm runs first because
a tag sitting on the queued commit creates nothing anyway, and refusing there
would hold the FIFO line on a number that was in fact published. The intent
guard runs before the battery so a refusal cannot be disguised as a red gate.

## The switch

`.opencode/auto-release.enabled` gates this path and nothing else:

- **Presence enables.** Absent or renamed disables the lane; there is no other
  override, and an empty file is still a present file.
- The file is **owner-created**. No script creates it, and the mechanism stages
  only the queue and the audit log, so a run can never enable itself.
- When absent, the lane does nothing at all: no tag, no release, no queue
  rewrite, and no audit line. That silence is the designed output, not a failure.
- Today it exists and is **local/untracked** by owner ruling: a CI run on the
  default branch does not see it, so the push-triggered queue lane stays disabled
  until the owner rules on tracking it. The forward line fires from a local seat,
  as `v0.8.11` did.

## The audit log

`.opencode/audit/AUTO-PUBLISH.log` — one machine-readable line per run, shared
by all three writers:

```text
version | commit | timestamp (UTC) | artifacts | channels | result
```

`result` carries the verdict as subfields, for example
`self-published;gate=PASS;unit=phase;entry=1` or
`refused-verification;gate=FAIL(verify-registry)`. The log is the record of
truth for what was published: a release whose line is missing is unproven.

## Refusal semantics

Every refusal is `exit 1`, creates nothing, and writes one audit line naming why.
Skips are `exit 0` and write nothing, because nothing was created.

| Action | Cause | Creates | Consumes entry |
|---|---|---|---|
| `disabled` | Switch absent | No | No |
| `no-pending-entry` | Queue holds no pending line | No | No |
| `skip-already-released` | A strict tag already sits on `base_commit` | No | No |
| `refused-queue` | Queue unreadable or malformed | No | No |
| `refused-policy` | Policy unreadable or malformed | No | No |
| `blocked` | No strict tag to compute from, or no increment for the unit type | No | No |
| `refused-intent` | `intended_version` ≠ computed number | No | **No** |
| `refused-commit` | `base_commit` not reachable from HEAD | No | No |
| `refused-verification` | Any battery check failed | No | No |
| `refused-package` | A packaged path is absent at the commit | No | No |
| `failed-tag` | Tag creation or push failed | No | No |
| `failed-release` | Release creation failed after the tag exists | Tag only | No — the next run skips it loudly |
| `queue-update-failed` | Published, but the queue commit-back failed | Yes | **Yes, on disk** — fix the queue by hand |

## What proves it

```bash
node scripts/self-publish.mjs --self-test
```

25 assertions across four §6 proofs (would publish on a green tree, refuses on a
red one, skips an existing tag, does nothing without the switch), the declared-
intent guard (match publishes, mismatch refuses with zero creates and zero
consumption), and the policy/input guards (malformed policy, incomplete entry,
`v7.5` not a base tag, non-canonical intent, missing packaged path). It uses
injected dependencies: no git, no `gh`, no network, no write.

The live lane was proven end to end on `v0.8.11` — the first forward-line
self-publish, monitored: guard matched, battery 5/5, asset built, tag created at
`d004330`, release published, one audit line, entry consumed, commit-back
pushed.

## Commands

```bash
# prove the mechanism without touching anything
node scripts/self-publish.mjs --self-test

# default is a dry run: reads, computes, runs the real battery, builds and
# hashes the asset, prints the plan, appends the audit line, creates nothing
node scripts/self-publish.mjs

# publish (owner go, switch present)
DRY_RUN=0 node scripts/self-publish.mjs

# historical units, one at a time, in ascending order
node scripts/backfill-publish.mjs --one 0.7.8
```

`DRY_RUN=1` is the default for both local scripts. Publishing requires `DRY_RUN=0`
explicitly.
