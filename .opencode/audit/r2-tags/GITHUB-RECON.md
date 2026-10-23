# GITHUB-RECON.md — Node `r2-tags` (Step 2: Read-only reconnaissance)

All calls below are rung 1 (read-only). Every command is quoted with its output and exit code.
The target is a local ref set, not an issue or pull request; no `gh issue view` / `gh pr view` /
`gh pr diff` target exists for this node, so none was invented.

## R1 — BEFORE listing (brief task 1)

```text
$ git tag -l "v0.0.99-dryrun.1" "v0.0.98-dryrun.1"
v0.0.98-dryrun.1
v0.0.99-dryrun.1
EXIT=0
```

Both tags are present, exactly as the brief expected.

## R2 — Ref anatomy (annotated vs lightweight, object ids)

```text
$ git for-each-ref refs/tags/v0.0.99-dryrun.1 refs/tags/v0.0.98-dryrun.1 --format="%(refname:short) type=%(objecttype) object=%(objectname:short) target=%(objectname:short)"
v0.0.98-dryrun.1 type=tag object=ca4863e target=ca4863e
v0.0.99-dryrun.1 type=tag object=5e8d4e1 target=5e8d4e1
EXIT=0
```

Both are **annotated** tag objects (`type=tag`):

| tag | tag object | peeled commit | commit date | commit subject |
|---|---|---|---|---|
| `v0.0.99-dryrun.1` | `5e8d4e1` | `93f5b4e762f03e767a3dcf246038c1aa8d7fbb5c` | 2026-10-21 | docs(post87): file the owner-verified post-v8.7 blueprint + intake structure map |
| `v0.0.98-dryrun.1` | `ca4863e` | `3d5d92aa99c2f3140372bc98aad816f1239f244a` | 2026-10-15 | merge: v0.7.7 program |

```text
$ git log -1 --format="%h %ad %s" --date=short 'v0.0.99-dryrun.1^{commit}'
93f5b4e 2026-10-21 docs(post87): file the owner-verified post-v8.7 blueprint + intake structure map
EXIT=0
$ git log -1 --format="%h %ad %s" --date=short 'v0.0.98-dryrun.1^{commit}'
3d5d92a 2026-10-15 merge: v0.7.7 program
EXIT=0
```

Both are full object ids, so both refs are exactly recreatable (no data needs to be reconstructed).

## R3 — Reversibility check: are the tagged commits reachable elsewhere?

```text
$ git branch -a --contains 93f5b4e762f03e767a3dcf246038c1aa8d7fbb5c
* wt/vta-factory-p0
EXIT-A=0
```

```text
$ git branch -a --contains 3d5d92aa99c2f3140372bc98aad816f1239f244a
  main
+ wt/comms-dash02
  wt/comms-supabase
  wt/relay-skill-v2
  wt/supabase-capability
  wt/vta-factory-08
* wt/vta-factory-p0
  wt/vta-identity-doc
  wt/vta-relay-03
  remotes/origin/HEAD -> origin/main
  remotes/origin/main
  remotes/origin/wt/comms-dash02
  remotes/origin/wt/comms-supabase
  remotes/origin/wt/relay-skill-v2
  remotes/origin/wt/supabase-capability
  remotes/origin/wt/vta-factory-08
  remotes/origin/wt/vta-factory-p0
  remotes/origin/wt/vta-identity-doc
  remotes/origin/wt/vta-relay-03
EXIT-B=0
```

Both tagged commits stay reachable from pushed branches (`wt/vta-factory-p0` for `93f5b4e`;
`main` plus many branches, local and `origin`, for `3d5d92a`). Deleting the two tag refs would
therefore remove two tag objects and **no commit and no history**.

## R4 — Local tag inventory (baseline for the AFTER proof)

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
---count---
14
EXIT=0
```

14 local tags, of which exactly 2 are the dry-run probes.

```text
$ Select-String -Path .git/packed-refs -Pattern "dryrun"
(no output)
EXIT=0
```

The two refs are loose files under `.git/refs/tags/` (confirmed by directory listing:
`v0.0.98-dryrun.1`, `v0.0.99-dryrun.1`); they are absent from `packed-refs`.

## R5 — Remote tag inventory (read-only; brief task 3 precondition)

```text
$ git ls-remote --tags origin
92e79c6ffd4e69e5f7d37986ca49a80923346bd2    refs/tags/v0.1.0
15e27e1fb7b7b6bb44abf8bc305ac9398b08a0b7    refs/tags/v0.1.0^{}
d1a3f990cef3c180980f86d4082162c80203670d    refs/tags/v0.2.0
8060f654e72487fc33f2ac5885c0644ba4b1191d    refs/tags/v0.2.0^{}
a221ec5a94af3d0656d7a552aa45cba82a3e7167    refs/tags/v0.3.0
53275ec40b3fdb478d397e44049e002016b95ee5    refs/tags/v0.3.0^{}
30142c5e4d92b35bc9b2f417f8cee330e2de87ed    refs/tags/v0.4.0
f9c7a6a370baf132bbce81d026adef8d1a6c9dda    refs/tags/v0.4.0^{}
eed3165362ecc9f1226d934ad4d1d71783be4716    refs/tags/v0.4.1
012e449be308f218a16a8ca4ddc07c23921e9b67    refs/tags/v0.4.1^{}
8f8382b44a0b8ebd95de0fb84b3ecb3d012f5e56    refs/tags/v0.5.0
3ecaa2ab934486b4afc0e8644f8df0d7b39f234f    refs/tags/v0.5.0^{}
76c7d8c29d96b5cd6847b5135f5b02c7d9feedea    refs/tags/v0.6.0
7bee280ee70cbc4a38eee5af6a5ca7948c0fb820    refs/tags/v0.6.0^{}
6609014c1970d74d7e9c332ed5892620c44226ce    refs/tags/v0.6.5
cac1179d7c3d4df1543cd07933dcd77399a548e5    refs/tags/v0.6.5^{}
addda5cea7899bffe6a596ee6a073cfa1a4dcd7b    refs/tags/v0.7.0
343b3be53455cc07f61778942064492427308250    refs/tags/v0.7.0^{}
6a06d249d6c939fab316dbd842e208f4a8d44532    refs/tags/v0.7.6
6e6bb801a36ee47441a001cd724bc68b0a320863    refs/tags/v0.7.6^{}
0ca84b4c37432420836c587669e38465ccb3b48e    refs/tags/v0.7.7
3d5d92aa99c2f3140372bc98aad816f1239f244a    refs/tags/v0.7.7^{}
53b91d6ca9d37527d2b98297f07aeca254197c97    refs/tags/v7.5
e0f2be14e5b37069a6a5a53a53f08ab3491016f3    refs/tags/v7.5^{}
EXIT=0
```

**Finding:** `refs/tags/v0.0.99-dryrun.1` and `refs/tags/v0.0.98-dryrun.1` are **absent from
`origin`**. The owner's parenthetical "never pushed" is confirmed by live evidence. No remote
write, remote deletion, or push is required by this node — and none was attempted.

## R6 — Working-tree state at entry (baseline for brief task 4)

```text
$ git status --short
 M .gitignore
 D .opencode/agents/agent-maker.md
 D .opencode/agents/ai-generated-code-security-auditor.md
 D .opencode/agents/architect.md
 D .opencode/agents/code-reviewer.md
 D .opencode/agents/kit-maintainer.md
 D .opencode/agents/red-team.md
 D .opencode/agents/technical-writer.md
 M .opencode/agents/vantrilex-guide.md
 M .opencode/agents/vantrilex-implementer.md
 M .opencode/agents/vantrilex-leader.md
 M .opencode/agents/vantrilex-verifier.md
 M .opencode/audit/V-FULL-AUDIT.md
 M .opencode/commands/V-Architect.md
 M .opencode/commands/V-Code-Reviewer.md
 M .opencode/commands/V-Kit-Maintainer.md
 M .opencode/commands/V-Red-Team.md
 M .opencode/plugin/arsenal.findings-probe.mjs
 M .opencode/plugin/arsenal.ts
D  .opencode/plugins/vantrilex-guards.ts
 M .opencode/skills/vantrilex-vanguard/SKILL.md
 M AGENT.md
 M CHANGELOG.md
 M WORKFLOW.md
 M kit/kit.lock
 M kit/kit.lock.schema.json
 M registry/VANTRILEX_CATALOG.md
 M registry/catalog.json
 M registry/data/agents.jsonl
 M registry/data/mcp.jsonl
 M registry/data/overlaps.yaml
 M registry/rag/04-component-deepdives.json
 M registry/rag/10-user-faq.json
?? .agents/
?? .opencode/agents/vantrilex-agent-maker.md
?? .opencode/agents/vantrilex-architect.md
?? .opencode/agents/vantrilex-code-reviewer.md
?? .opencode/agents/vantrilex-kit-maintainer.md
?? .opencode/agents/vantrilex-puller.md
?? .opencode/agents/vantrilex-red-team.md
?? .opencode/agents/vantrilex-uploader.md
?? .opencode/audit/V87-COLOR-FINDINGS.md
?? .opencode/audit/V87-COMPAT-FINDINGS.md
?? .opencode/audit/V87-ENUM.md
?? .opencode/audit/V87-FEATURE-AUDIT-1.md
?? .opencode/audit/V87-FEATURE-AUDIT-2.md
?? .opencode/audit/V87-INPUT-DIGESTS.md
?? .opencode/audit/V87-INPUT-RECEIPT.md
?? .opencode/skills/vantrilex-intake-fetch/
?? .opencode/skills/vantrilex-intake-send/
?? .opencode/skills/vantrilex-intake-triage/
?? .opencode/skills/vs-circuit-breaker-guard/
?? .opencode/skills/vs-github-release-packager/
?? .opencode/skills/vs-ponytail/
?? .opencode/skills/vs-preflight-system-doctor/
?? .opencode/skills/vs-session-context-primer/
?? .opencode/skills/vs-smithery/
?? .opencode/skills/vs-vantrilex-vanguard/
?? .opencode/skills/vantrilex-workflow-forge/
?? COMMS-SUPABASE-WAIT.mjs
?? P4-DEFERRAL-LEDGER.md
?? P5-LOOP-DOSSIER.md
?? V87-COLOR-AUDIT.md
?? V87-DEFECTS.md
?? V87-FOUNDATION-DOSSIER.md
?? V87-PLAN-ZERO-TO-87.md
?? comms-supabase-dashboard/
?? docs/99-archive/P1-EVAL-7.jsonl
?? docs/comms-hub-01-escalation.capsule.json
?? docs/factory-p0-escalation.capsule.json
?? docs/spec/v87/
?? skills-lock.json
EXIT=0
```

Snapshot hash and count at entry, captured before any evidence file was written:

```text
files=71
sha256=ada00010a79edc8770777213120764a074d9c96909778faae82f49e9f05022dc
```

This is the inherited dirty tree the lane already carries (`AGENT.md` 2026-10-21, OWNER ACK #2,
§3: "§3 INHERITED DIRTY TREE (37,186 uncommitted lines / 66 files) … DELETE NOTHING"). It is
pre-existing, not produced by this node.

## R7 — Guard notice observed (recorded, not worked around)

Writing the first evidence file triggered the kit `diff-size-guard`:

> [arsenal] diff-size-guard: BLOCKED — 37850 uncommitted line(s) across 71 file(s) exceed 120 lines /
> 4 files since 20866d0c. Verify this slice and land one atomic commit before starting new work …

This is the known inherited-tree condition (`AGENT.md` 2026-10-21 OWNER ACK #2: "the Diff Size Guard
keeps warning on them — expected, not a slice defect"). This node is forbidden to commit ("No
commits, no other writes"), so the warning cannot be cleared from here. It is reported, not silenced,
and no guard threshold or config was touched.

## R8 — Addendum: the tree moved under this node (sibling writers, same worktree)

`AGENT.md` line 318/319 records five nodes in flight at once (`u1-arsenal`, `u3b-census`, `r2-tags`,
`r2-changelog`, `r2-erratum`) — all in the one worktree `O:\vantrilex-arsenal` on `wt/vta-factory-p0`.
That is observable in the guard footer, which advanced its "since <sha>" anchor while this node ran:

| guard emission | anchor sha |
|---|---|
| first `git ls-remote` call | `since 0c23c7f4` |
| first evidence write | `since 20866d0c` |
| second evidence write | `since e215cdc7` |

`HEAD` at the end of this node:

```text
$ git rev-parse --short HEAD
e215cdc
$ git log -1 --format="%h %ad %s" --date=iso
e215cdc 2026-10-21 15:04:03 +0300 fix(census): sync vanguard skill + RAG answers to live lock counts (157 · 32/125 · 9 pending)
EXIT=0
```

That commit is the sibling `u3b-census` landing, not this node. Session delta against the R6 entry
snapshot (computed by set difference over the two `git status --short` listings):

```text
--- in ENTRY not in AFTER ---
D  .opencode/plugins/vantrilex-guards.ts        → now unstaged (index reset by a sibling)
 M .opencode/skills/vantrilex-vanguard/SKILL.md → committed by e215cdc
 M CHANGELOG.md                                 → committed by e215cdc
 M registry/rag/04-component-deepdives.json     → committed by e215cdc
 M registry/rag/10-user-faq.json                → committed by e215cdc
?? .opencode/skills/vantrilex-workflow-forge/   → renamed to vs-vantrilex-workflow-forge/
--- in AFTER not in ENTRY ---
?? .opencode/audit/r2-tags/                     → THIS node's five evidence files (only write I made)
?? .opencode/skills/vs-vantrilex-workflow-forge/ → sibling rename
 M docs/dev/01-PLUGIN.md                        → sibling edit
```

Attribution: **every delta above is a sibling writer's**, except `?? .opencode/audit/r2-tags/`, which
is this node's evidence directory and nothing more. Confirmable by inspection: this node issued no
`git add`, `git commit`, `git reset`, `git restore`, `git checkout`, `git stash`, or file rename.

Consequence recorded for the LEADER, not repaired here: five writers share one worktree and one
index while `AGENTS.md` hard rule 4 (single-writer law) governs the sidecar files — a mid-node index
reset of `.opencode/plugins/vantrilex-guards.ts` is exactly the interference the law is meant to
prevent. Escalated as an observation; this node did not act on it.

