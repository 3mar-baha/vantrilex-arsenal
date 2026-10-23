# GITHUB-HANDOFF.md — Node `r2-tags` (Step 6: Hand off the evidence)

- Lane: `POST87-APPLY` — Phase 1 build wave (owner ruling sheet 2026-10-21)
- Node: `r2-tags` (owner ruling §3(a) — the two local probe tags)
- Agent: `vantrilex-github` (side agent)
- Date: 2026-10-21
- Verdict: **NOT DECLARED.** This file is evidence for the LEADER, who rules.

## Outcome in one line

Read-only work: complete and green. The one mutating task (`git tag -d` ×2): **refused on a rung
this agent does not hold**, escalated with a verified one-step completion block.

## File list (all under `.opencode/audit/r2-tags/`)

| file | contents |
|---|---|
| `GITHUB-PRIME.md` | auth (`gh auth status` exit 0, `3mar-baha`), slug `3mar-baha/vantrilex-arsenal`, branch `wt/vta-factory-p0`, node quoted verbatim, the governing guard quoted before any call |
| `GITHUB-RECON.md` | R1 BEFORE listing · R2 ref anatomy (both annotated) · R3 reversibility (both commits reachable from pushed branches) · R4 14-tag baseline · R5 `git ls-remote --tags origin` (neither probe present) · R6 entry status snapshot + hash · R7 guard notice · R8 addendum on concurrent sibling writes |
| `GITHUB-PLAN.md` | P1–P9 with the rung of each, the rung ruling on P6/P7 written before execution, the one question for the LEADER, the exact completion + exact reverse blocks, and the execution transcript with every exit |
| `GITHUB-REVIEW.md` | cycle 1 (correctness: 4 findings) and cycle 2 (safety: 19-guard table), cap reached, stop |
| `GITHUB-HANDOFF.md` | this file |

## Answers to the brief's four tasks

1. **BEFORE** — `git tag -l "v0.0.99-dryrun.1" "v0.0.98-dryrun.1"` → both listed, `EXIT=0`. ✅
2. **DELETE** — `git tag -d …` ×2 → **NOT RUN — REFUSED**. No exit code exists and none was invented. ❌ escalated
3. **AFTER** — `git tag -l` → 14 tags, both probes still present (state unchanged, because the
   deletion was refused). `git ls-remote --tags origin` → `EXIT=0`, neither probe under
   `refs/tags/`; the parenthetical "never pushed" is **confirmed by live evidence**; no remote
   operation was performed or needed. ⚠️ half-green
4. **Nothing else changed** — `git status --short` shows this node's only write is
   `?? .opencode/audit/r2-tags/`. Every other delta in the session is a sibling node's (`u3b-census`
   landed `e215cdc`; later anchors `c57d9a84`; tree carried the known inherited dirty state).
   Attribution table in `GITHUB-RECON.md` R8. ✅

## Authorization spent

| rung | act | spent? |
|---|---|---|
| 1 read-only | `git tag -l`, `for-each-ref`, `rev-list`, `log`, `branch --contains`, `status`, `rev-parse`, `ls-remote`, `gh auth status` | yes, as planned |
| 2 mutating | none requested, none run | **no** |
| 3 destructive | `git tag -d` ×2 requested — not on rung 3's closed list, refused | **no** |
| 4 owner-only | untouched — settings, secrets, environments, access | **no** |

Zero commits. Zero pushes. Zero remote writes. Zero index writes. Zero `gh` mutations.

## The one question for the LEADER

> Does the LEADER (or the owner directly) run the two rung-1-verified deletions in
> `GITHUB-PLAN.md` §3.3 — or does the LEADER amend `.opencode/agents/vantrilex-github.md` so that
> *local-only, never-pushed, commit-preserving tag deletion* becomes an explicitly permitted rung-3
> act — after which `r2-tags` is re-dispatched and P6/P7 run as written?

Everything needed to answer it in one step is in `GITHUB-PLAN.md` §3.2–§3.3: the two commands, the
expected post-state (12 tags), and the exact reverses with both peeled commit SHAs
(`93f5b4e762f03e767a3dcf246038c1aa8d7fbb5c`, `3d5d92aa99c2f3140372bc98aad816f1239f244a`) and both
original annotated tag-object ids (`5e8d4e1`, `ca4863e`).

## Safety facts the LEADER may need

- The deletion, if executed, destroys **two tag refs and no commit**: both tagged commits stay
  reachable from `origin/wt/vta-factory-p0` (`93f5b4e`) and `main` + many branches (`3d5d92a`).
- It touches **nothing remote**: neither tag exists on `origin`.
- It is **exactly reversible** at ref level from the recorded SHAs.
- So §3(a) is safe to complete, and equally safe to defer. Nothing degrades by waiting.

## Two observations reported, not repaired (not mine to fix)

1. **Single-writer interference is live.** Five nodes share one worktree and one index; mid-node the
   index state of `.opencode/plugins/vantrilex-guards.ts` flipped and `HEAD` advanced three times
   (`0c23c7f4` → `20866d0c` → `e215cdc7` → `c57d9a84`). `AGENTS.md` hard rule 4 governs sidecars, but
   the same hazard now applies to the working tree itself. Reported for the LEADER's routing.
2. **`diff-size-guard` fires on every write from this node** (BLOCKED, ~36–37k uncommitted lines) and
   cannot be cleared by an agent forbidden to commit. Matches the owner-acknowledged inherited-tree
   condition; flagged so it is not read later as an `r2-tags` defect.

## Kit components used (named per doctrine)

`session-context-primer` (orientation via `AGENT.md` / `WORKFLOW.md`) · `vantrilex-deep-understand`
(repo orientation from `docs/dev/`) · `vantrilex-doctrine` (governing law for the rung ruling) ·
`documentation-as-tests` (every quoted command in these files was executed and its exit recorded) ·
`circuit-breaker-guard` (engaged as a standing check; **never triggered** — no 429/5xx occurred) ·
`red-team` (C1-2 / C1-3 / sibling-interference findings raised, none fixed here) ·
`preflight-system-doctor` (not invoked; no build or long-running work in this node) ·
`vantrilex-workflow-forge` (not used — no workflow authorship in this node) ·
registry PR-body template, `wayfinder`, `workflow-lint`: not applicable (no PR, no ticket graph, no
Actions file in this node).

## Ponytail bound — PARKED

No code was written. This node wrote no workflow file, script, agent/skill definition, automation
config, or any executable text; it wrote five Markdown evidence files under
`.opencode/audit/r2-tags/` and ran read-only `git` commands. FLOOR and CEILING therefore did not
engage — stated here rather than silently skipped.

Ponytail: FULL on code-writing nodes only — PARKED, zero code written (5 Markdown evidence files
only; `Select-String` "model:" = 0 matches, secret scan = 0 matches).
