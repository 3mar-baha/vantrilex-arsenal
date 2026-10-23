# GITHUB-PLAN.md — Node `r2-tags` (Steps 3 and 4: plan, then humans/leader-gated execution)

Written **before** any mutating call. A command that is not in this plan does not run.

## 3.1 The plan, in order, with the rung of each command

| # | Command | Rung | Status |
|---|---|---|---|
| P1 | `git tag -l "v0.0.99-dryrun.1" "v0.0.98-dryrun.1"` | 1 read-only | **RUN** (exit 0, both listed) |
| P2 | `git for-each-ref refs/tags/…` (ref anatomy) | 1 read-only | **RUN** (exit 0, both annotated) |
| P3 | `git rev-list -1` / `git log -1` (peeled commits) | 1 read-only | **RUN** (exit 0, SHAs recorded) |
| P4 | `git branch -a --contains <sha>` (reversibility) | 1 read-only | **RUN** (exits 0, commits reachable) |
| P5 | `git ls-remote --tags origin` | 1 read-only | **RUN** (exit 0, neither probe tag on origin) |
| P6 | `git tag -d v0.0.99-dryrun.1` | **none open** — see 3.2 | **NOT RUN — REFUSED** |
| P7 | `git tag -d v0.0.98-dryrun.1` | **none open** — see 3.2 | **NOT RUN — REFUSED** |
| P8 | `git tag -l` (AFTER proof) | 1 read-only | **RUN** (both still present — state unchanged) |
| P9 | `git status --short` (+ hash/count) | 1 read-only | **RUN** (delta = evidence files only) |

No commit, no push, no remote write, no `gh` mutation, no branch move, no index write, no stash,
no config change appears anywhere in this plan. Nothing of the kind was run.

## 3.2 Rung ruling on P6/P7, stated before execution

The refusal ladder in `.opencode/agents/vantrilex-github.md` assigns every operation to exactly one
rung, and "a higher rung is never reached by rewording the request".

- **Rung 1 (read-only, always permitted):** view/diff/list, status and log reads. P1–P5, P8, P9 sit here.
- **Rung 2 (mutating inside the directed node):** branch creation, commits, node-branch pushes,
  comments, directed pull-request opens. `git tag -d` is none of these.
- **Rung 3 (destructive, only with a leader confirmation token naming the exact target):**
  > tag pushes, release publishes, and merges into release branches.
  The enumeration is closed. **Tag deletion is not on it.** A token naming
  `v0.0.99-dryrun.1` / `v0.0.98-dryrun.1` would therefore still not open this operation.
- **Rung 4 (always refused):** repository settings, secrets, environments, access changes. Not this.

And the never-do list, which is not token-reachable at all:

> Never force-push, delete a branch, tag, or release, or rewrite published history, for any reason,
> under any token.

**Ruling: `git tag -d` is refused to this agent. P6 and P7 do not run.** The brief's other three
tasks are rung-1 work and were completed in full, so the LEADER receives complete evidence plus the
exact commands that finish the node in one step at a rung the LEADER or the owner holds.

This refusal is not a finding against the owner's ruling. §3(a) of the ruling sheet is not disputed:
the tags are local-only (proved, R5), the tagged commits survive their removal (proved, R4), and the
deletion is trivially and exactly reversible (object ids recorded). The correct action is exactly the
one the owner ordered — it just cannot be executed by this agent under its own constitution.

**One-precision question for the LEADER:**
Does the LEADER (or the owner, directly) execute the two refused rung-1-verified deletions below, or
does the LEADER amend `.opencode/agents/vantrilex-github.md`'s ladder and never-do list so that
*local-only, never-pushed, commit-preserving tag deletion* is an explicitly permitted rung-3 act for
this agent — after which this node is re-dispatched and P6/P7 run as written?

## 3.3 The exact completion block (for the holder of that rung — verified, copy-paste ready)

```powershell
git tag -d v0.0.99-dryrun.1
git tag -d v0.0.98-dryrun.1
git tag -l                          # expect 12 tags, neither dryrun tag present
```

Exact reverses, if ever needed (refs are annotated; recreate the tag object, then verify):

```powershell
git tag -a v0.0.99-dryrun.1 93f5b4e762f03e767a3dcf246038c1aa8d7fbb5c -m "v0.0.99-dryrun.1"
git tag -a v0.0.98-dryrun.1 3d5d92aa99c2f3140372bc98aad816f1239f244a -m "v0.0.98-dryrun.1"
```

The original annotated tag-object ids were `5e8d4e1` (`v0.0.99-dryrun.1`) and `ca4863e`
(`v0.0.98-dryrun.1`); re-created tags get new object ids but identical targets and names, which is
sufficient for every consumer in this repo. No commit, branch, or remote state is involved.

## 4. Execution transcript (steps that ran)

### T1 — BEFORE (brief task 1)

```text
$ git tag -l "v0.0.99-dryrun.1" "v0.0.98-dryrun.1"
v0.0.98-dryrun.1
v0.0.99-dryrun.1
EXIT=0
```

### T2 — DELETE (brief task 2)

```text
$ git tag -d v0.0.99-dryrun.1
NOT RUN — refused under the never-do list ("never … delete a … tag … for any reason, under any token")
$ git tag -d v0.0.98-dryrun.1
NOT RUN — refused under the same guard
```

No exit code exists for a command that was not executed; no exit code was invented. Zero mutating
git commands were issued in this node.

### T3 — AFTER (brief task 3, read-only half)

```text
$ git tag -l
v0.0.98-dryrun.1
v0.0.99-dryrun.1
v0.1.0
v0.2.0
v0.3.0
v0.4.0
v0.4.1
v0.5.0
v0.6.0
v0.6.5
v0.7.0
v0.7.6
v0.7.7
v7.5
EXIT=0
```

14 tags, identical to the R4 baseline: **both probe tags remain, because the deletion was refused,
not because it failed.** Recorded plainly so no reader mistakes this for a successful deletion.

### T4 — Remote check (brief task 3, read-only half)

Full output in `GITHUB-RECON.md` R5. `EXIT=0`. Neither `v0.0.99-dryrun.1` nor `v0.0.98-dryrun.1`
exists under `refs/tags/` on `origin`. **"Never pushed" is confirmed by live evidence; no remote
operation of any kind was performed or needed.**

### T5 — Nothing else changed (brief task 4)

See `GITHUB-REVIEW.md` cycle 2 for the before/after status delta (the only change is this node's own
five evidence files under `.opencode/audit/r2-tags/`).
