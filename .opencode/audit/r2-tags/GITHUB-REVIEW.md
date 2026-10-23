# GITHUB-REVIEW.md — Node `r2-tags` (Step 5: capped review cycle — exactly two cycles)

Cap: two review cycles per node (§33B). Both are recorded below. No third cycle was run.

---

## Cycle 1 — correctness

Scope of review: the node's executed evidence and its rung ruling (the node produced no code diff,
so there is no diff to review against FLOOR/CEILING — see the parked-bound statement in
`GITHUB-HANDOFF.md`).

### C1-1 — BLOCKING, escalated: the node's objective was not executed

The concern was "DELETE the two local probe tags". Both tags are still present:

```text
$ git tag -l "v0.0.99-dryrun.1" "v0.0.98-dryrun.1"
v0.0.98-dryrun.1
v0.0.99-dryrun.1
```

`git tag -d` was not run because it is outside every rung open to this agent (never-do list:
"never … delete a … tag … for any reason, under any token"; rung 3's destructive enumeration does not
include deletion). This is a correct refusal, not a failed command — but it leaves §3(a) **open**.
Escalated to the LEADER with a single question (`GITHUB-PLAN.md` §3.2) and a verified copy-paste
completion block (§3.3). Not reworked a third time.

### C1-2 — CORRECTED: entry baseline went stale mid-node

`GITHUB-RECON.md` R6 records the status snapshot as it stood at entry. Sibling nodes committed
`e215cdc` while this node ran, so five entries changed state under it. Corrected in the same file by
addendum R8, with the exact set difference and explicit attribution. No claim in R6 is now
unqualified: R6 is labelled "at entry", R8 carries the drift.

### C1-3 — DISCLOSED: one read-only command failed, once, and was replaced correctly

An exploratory `git describe --tags --exact-match v0.0.99-dryrun.1^{commit}` was mangled by the
PowerShell host (the brace form and `--exact-match` split):

```text
git : error: unknown switch `e'
EXIT=129
```

It was **not** retried blindly and no substitute was passed off as equivalent. The fact it was meant
to establish (the peeled commit and its subject) was obtained with a different, still read-only,
correctly quoted command, `git log -1 --format=… 'v0.0.99-dryrun.1^{commit}'`, exit 0, recorded in
R2. This was an argument-quoting defect, not an API 429/5xx, so the circuit breaker was never
triggered; had a rate-limit or 5xx occurred, the breaker path would have applied, and none did.

### C1-4 — OBSERVED: `diff-size-guard` fired twice and cannot be cleared from this node

Verbatim, second firing:

> [arsenal] diff-size-guard: BLOCKED — 37850 uncommitted line(s) across 71 file(s) exceed 120 lines /
> 4 files since 20866d0c. Verify this slice and land one atomic commit before starting new work;
> untracked files count toward the file ceiling and contribute no line count.

The brief forbids commits, and the inherited tree is a known, owner-acknowledged condition. Nothing
was disabled, no threshold edited, no file deleted to lower the count. Recorded.

### Cycle 1 verdict

The rung ruling holds; the evidence is complete for every task this agent may execute; the node's
objective remains open by design and is escalated. One correction applied (C1-2), one failure
disclosed (C1-3), one guard condition reported (C1-4). No new defect introduced by this node.

---

## Cycle 2 — safety

Scope of review: did this node cross any line in `.opencode/agents/vantrilex-github.md`?

| Guard | Check performed | Result |
|---|---|---|
| No tag push / release publish / release-branch merge | command set contains no `git push`, no `gh release`, no merge | **PASS** — none run |
| No branch/tag/release deletion, no history rewrite | no `git tag -d`, no `git branch -D`, no `git push --force*`, no `filter-branch`, no `rebase` | **PASS** — none run |
| No force-push | no `--force`, no `--force-with-lease` anywhere in the session | **PASS** |
| No repository settings / secrets / environments / access | no `gh secret`, `gh api -X PATCH|PUT`, `gh repo edit`, `gh variable` | **PASS** — none run |
| No unprimed-repo operation | auth exit 0, slug resolved, node named — `GITHUB-PRIME.md` | **PASS** |
| No blind retry on 429/5xx | zero HTTP-level GitHub calls; `gh` only ran `auth status`; `git ls-remote` exit 0 first try | **PASS** (breaker never engaged) |
| No remote write of any kind | only `git ls-remote` (read) was issued against `origin` | **PASS** |
| No commit | `git rev-parse --short HEAD` before/after; the only HEAD advance (`e215cdc`) is a sibling's commit, dated `15:04:03 +0300`, not this session | **PASS** |
| No index write | `git status --short` at entry and exit; the index change observed (`vantrilex-guards.ts` staged→unstaged) is attributable to a sibling, and this node ran no index-mutating command | **PASS** |
| No lead / dispatch / done-declaration | no subagent dispatched; no "done" verdict issued; this file is evidence | **PASS** |
| No owner contact | no message, issue, comment, or mail sent | **PASS** |
| No guard weakened | diff-size-guard left firing; no config/threshold/`.gitignore` edit; the never-do list was strengthened in practice, not bent | **PASS** |
| No invented install command, token, or approval | no token claimed; the completion block is a *request*, explicitly awaiting LEADER/owner action | **PASS** |
| No edit to `kit/kit.lock`, `registry/catalog.json`, or generated Markdown | none opened for write | **PASS** |
| No pinned routing identity or color field | zero writes to agent/skill/manifest files | **PASS** |
| Zero secrets in output | `Select-String` over the five evidence files for `gho_…`, `ghp_…`, `Bearer …`, `api_key=` → **0 matches**; the one token line in `GITHUB-PRIME.md` is `gh`'s own redaction, `gho_****` | **PASS** |
| Zero `model:` pins | `Select-String -Pattern "model:"` over the five evidence files → **0 matches** | **PASS** |
| Writes confined to the node | the only path created is `.opencode/audit/r2-tags/` (5 files) | **PASS** |
| Ponytail bound | no code, workflow file, script, or automation config written → bound **PARKED**, stated in `GITHUB-HANDOFF.md` | **PASS (parked)** |

### Cycle 2 verdict

No refusal was crossed. The never-do list was honoured at cost of leaving the node's one mutating
task unexecuted, which is the intended trade: the guard is the guard, and the LEADER retains the
rung the owner's order actually requires.

---

## Cycle cap statement

Two cycles run, cap reached, stop. The single surviving finding is C1-1 — a rung question for the
LEADER, not a defect to rework — and it goes up with both cycles attached and one precise question.
