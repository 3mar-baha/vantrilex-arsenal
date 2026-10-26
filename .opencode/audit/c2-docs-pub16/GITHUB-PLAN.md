# GITHUB-PLAN — c2-docs-pub16

Date: 2026-10-23
Order of execution: fixed. A mutating command not listed here does not run.

## Rungs

| # | Command (exact) | Rung | Notes |
|---|---|---|---|
| P1 | `git status --porcelain` | 1 | record dirty tree |
| P2 | `git stash push -- AGENT.md` | local | preserve uncommitted task memory (carried over by prior beats) |
| P3 | `git checkout main` | 2 | local branch switch, directed |
| P4 | `git merge --no-ff wt/docs-truth -m "merge: docs-truth live-census correction (closure 31d8d8c) — v0.8.16"` | 2 | directed. Conflict ⇒ STOP |
| P5 | `git log -1 --format=%H` · `git status --porcelain` · `git ls-tree -r --name-only HEAD -- .opencode/auto-release.enabled` | 1 | merge SHA + switch absence on merge tree |
| P6 | append ONE JSON line to `.opencode/release-queue.jsonl` (unit_type `phase`, base_commit `<merge SHA>`, status `pending`, `published_version`/`published_at` null, intended `v0.8.16`) | 2 | state file only; no pre-marking |
| P7 | `node -e "<parseQueue-equivalent JSON/shape validation>"` | 1 | schema-validate before firing |
| P8 | `$env:GIT_TERMINAL_PROMPT="0"; $env:DRY_RUN="0"; node scripts/self-publish.mjs` | **3** | tag push + release publish. Confirmation token = the dispatch's exact target: "publish **v0.8.16** monitored", `intended_version: v0.8.16`. Capture COMPLETE output |
| P9 | `git rev-parse v0.8.16` · `git rev-parse v0.8.16^{}` · `git cat-file -s` / `sha256sum` on the downloaded asset · `gh release view v0.8.16` · tail audit · queue line · `git log -1` | 1 | per-element verification |
| P10 | `git fetch origin` · `git rev-parse origin/main` · `git merge-base --is-ancestor 31d8d8c origin/main` | 1 | ancestry gate BEFORE deletion |
| P11 | `gh pr list --head wt/docs-truth --state open --json number` | 1 | zero open PRs required |
| P12 | `git push origin --delete wt/docs-truth` | 2 (destructive, explicitly directed) | only after P8 and P10 pass |
| P13 | `git ls-remote --heads origin` (targeted) · `git branch -vv` | 1 | absence proof; local ref left, reported |
| P14 | `git stash pop` | local | restore AGENT.md dirt identical |

## Stop conditions

- Switch tracked in any tree → STOP before merge.
- Switch absent from disk → STOP (never create it).
- Remote main moved from `f5e6d3f` and merge is no longer fast-forwardable → STOP.
- Merge conflict → STOP, report, create nothing.
- Guard refusal from `self-publish.mjs` → STOP, create nothing further, report.
- Computed version ≠ `v0.8.16` → STOP is the script's own intent guard.
- Ancestry of `31d8d8c` in remote main unproven → no branch deletion.

## Doctrine note

Branch deletion is normally on the never-list; the owner §2 order for this node
names it explicitly, and the prior two beats of this same lane executed it under
the same hard ancestry gate. I proceed on that recorded precedent, ancestry
proven first, local ref left in place.

---

## Transcripts (appended after execution)

### P4 merge
```
Merge made by the 'ort' strategy.
 16 files changed, 111 insertions(+), 114 deletions(-)
```
Merge SHA:
```
111749b511581227b86be1060090491dcafb0d8a
parents: f5e6d3f2373c1531cc78f1060524470804ccfefc 31d8d8c7df27c03ad021fd114e64715cce526702
git diff --stat wt/docs-truth..HEAD -> (empty)
git ls-tree -r --name-only HEAD -- .opencode/auto-release.enabled -> (empty)
```

### P6 queue line appended
```
{"unit_type":"phase","scope":"Docs truth — live census true (closure 31d8d8c)","base_commit":"111749b511581227b86be1060090491dcafb0d8a","status":"pending","published_version":null,"published_at":null,"intended_version":"v0.8.16"}
```
P7 schema validation via the publisher's own `parseQueue`: `ok=true`, `entries=6`,
`pending-line=6`, entry pending (not pre-marked).

### P8 live run (complete output, exit 0)
```
[self-publish] pending entry 6: unit_type=phase base_commit=111749b511581227b86be1060090491dcafb0d8a
[self-publish] plan: v0.8.16 = v0.8.15 + policy.increments.phase (cascade=true); declared intended_version v0.8.16 matches
[self-publish] plan: release point 111749b511581227b86be1060090491dcafb0d8a (the queued closure commit), asset vantrilex-arsenal-v0.8.16.tar.gz
[self-publish] plan: release notes = queue entry 6 scope, 47 characters
[self-publish] battery: PASS(generate-catalog)
[self-publish] battery: PASS(verify-registry)
[self-publish] battery: PASS(verify-skills)
[self-publish] battery: PASS(verify-catalog)
[self-publish] battery: PASS(tsc)
[self-publish] gate PASS
[self-publish] built vantrilex-arsenal-v0.8.16.tar.gz (3485519 bytes, sha256 e0dea18fd28fa1e68ac50c7f52b184ef498defa9ee6b391618ac52fdfd0cb1e1)
v0.8.16 | 111749b511581227b86be1060090491dcafb0d8a | 2026-10-23T15:51:52Z | vantrilex-arsenal-v0.8.16.tar.gz sha256=e0dea18fd28fa1e68ac50c7f52b184ef498defa9ee6b391618ac52fdfd0cb1e1 bytes=3485519 | github-release:3mar-baha/vantrilex-arsenal,git-tag:v0.8.16 | self-published;gate=PASS;unit=phase;entry=6
[self-publish] published v0.8.16; queue entry 6 marked published and committed back (pushed to main).
```

### P9 verification
```
tag object  : 2de5ea1a90cd1e5c1eb23fb852fce66d8449de8e (type: tag)
peel        : 111749b511581227b86be1060090491dcafb0d8a  == merge SHA  (MATCH)
asset       : 3485519 bytes / e0dea18fd28fa1e68ac50c7f52b184ef498defa9ee6b391618ac52fdfd0cb1e1
re-download : 3485519 bytes / e0dea18fd28fa1e68ac50c7f52b184ef498defa9ee6b391618ac52fdfd0cb1e1  (MATCH)
release     : isDraft=false isPrerelease=false, 1 asset, releases/latest = v0.8.16
queue       : line 6 published / v0.8.16 / 2026-10-23T15:51:52Z; entries=6 pending=0
audit       : v0.8.16 | 111749b… | 2026-10-23T15:51:52Z | … | self-published;gate=PASS;unit=phase;entry=6
commit-back : 5d2ba1d76aebc9cc761e40cd2c9190f4f5972614 (2 files, +2)
origin/main : 5d2ba1d76aebc9cc761e40cd2c9190f4f5972614  (divergence 0 0)
switch      : absent from HEAD tree and origin/main tree; disk 507 B untouched
```

### P10-P13 deletion
```
merge-base --is-ancestor 31d8d8c origin/main -> exit 0
merge-base --is-ancestor 111749b origin/main -> exit 0
gh pr list --head wt/docs-truth --state open -> []
git push origin --delete wt/docs-truth -> - [deleted] wt/docs-truth (exit 0)
ls-remote refs/heads/wt/docs-truth -> EMPTY
remote heads -> 9
local wt/docs-truth -> 31d8d8c [origin/wt/docs-truth: gone] (left in place)
cat-file -e 31d8d8c -> exit 0 (tip still reachable)
```
