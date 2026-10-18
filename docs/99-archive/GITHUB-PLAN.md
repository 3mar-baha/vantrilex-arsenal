# GITHUB-PLAN.md — Node p3-remove (Step 3: State the plan inside the node)

A mutating command that is not in this plan does not run. Plan written before any mutating call.

## Command list in order (exact, with rung)

1. `git rm .opencode/agents/ai-generated-code-security-auditor.md .opencode/agents/technical-writer.md`
   - Rung: Rung 2 (mutating inside the directed node, permitted as planned) WITH explicit owner destructive authorization quoted from brief: `DESTRUCTIVE explicitly authorized by owner order — this authorization covers these 2 files only`.
   - Why not higher: not a tag push / release publish / merge into release branch (Rung 3), not settings/secrets/environments/access (Rung 4, always refused). Not force-push / branch-delete / history-rewrite (always refused, never run under any token).
   - Effect: staged deletion only. NO commit, NO push, NO tag.

2. `git status --short -- .opencode/agents/ai-generated-code-security-auditor.md .opencode/agents/technical-writer.md`
   - Rung 1 (read-only, always permitted). Proves staged-deletion state (`D ` staged).

3. `git diff --cached --stat -- .opencode/agents/ai-generated-code-security-auditor.md .opencode/agents/technical-writer.md`
   - Rung 1 (read-only). Proves exactly 2 staged deletions, nothing else staged by this node.

4. `node scripts/verify-kit.mjs`
   - Rung 1 (read-only gate; writes no product file). Quote exit code + agent-mode lines proving no dangling refs.

5. `git grep -n "ai-generated-code-security-auditor" -- .`
   - Rung 1 (read-only). Quote hits or zero.

6. `git grep -n "technical-writer" -- .`
   - Rung 1 (read-only). Quote hits or zero. Live references reported as follow-up only — never chased (brief: do not chase them).

7. `git status --short` (full-worktree context, read-only)
   - Rung 1. Proves no commit/push happened and no file outside the node was touched by this node.

## What will NOT run

- No `git commit`, no `git push`, no `git tag`, no `gh release`, no merge (beyond what the node authorized — node authorizes zero merges/releases).
- No `git push --force`, no branch/tag/release deletion, no history rewrite, for any reason, under any token.
- No repository settings / secrets / environments / access changes (Rung 4, owner-only; escalate and stop — not needed here).
- No install command, no confirmation token invention, no review-approval invention.
- No `kit/kit.lock`, `registry/catalog.json`, or generated Markdown edits.
- No second agent, no dispatch, no owner contact. Escalation path ends at the LEADER.

## Authorization spent

Owner destructive authorization for exactly these 2 paths (quoted): `.opencode/agents/ai-generated-code-security-auditor.md` + `.opencode/agents/technical-writer.md` via `git rm` (staged, uncommitted). Authorization for the node is not authorization for its release; no release act is planned.

## Rate limits / circuit breaker

No GitHub API 429/5xx calls are planned (all commands are local). If any call returns 429/5xx: stop issuing calls, record status code with reset/retry evidence, back off, escalate to LEADER with journal attached via `circuit-breaker-guard`. No fourth call after three failures at the same endpoint; no unverified workaround substituted. A check that cannot be evaluated is a failed check, not a skipped one.

## Ponytail bound

Parked: this node writes no code (workflow files, scripts, automation configuration, or any executable text). Deletion + gate re-run only. Parked bound will be reported with trailer, never silently skipped.

---

## Transcripts (Step 4: appended as commands run — all planned commands ran, no unplanned mutating call)

### T1 — `git rm .opencode/agents/ai-generated-code-security-auditor.md .opencode/agents/technical-writer.md` (Rung 2 + owner destructive authorization for these 2 files only) — exit code 0

```text
rm '.opencode/agents/ai-generated-code-security-auditor.md'
rm '.opencode/agents/technical-writer.md'
EXITCODE=0
```

### T2 — `git status --short -- .opencode/agents/ai-generated-code-security-auditor.md .opencode/agents/technical-writer.md` (Rung 1) — exit code 0

```text
D  .opencode/agents/ai-generated-code-security-auditor.md
D  .opencode/agents/technical-writer.md
EXITCODE=0
```

Staged deletions (`D ` first column), uncommitted. No commit ran.

### T3 — `git diff --cached --stat -- .opencode/agents/ai-generated-code-security-auditor.md .opencode/agents/technical-writer.md` (Rung 1) — exit code 0

```text
 .../agents/ai-generated-code-security-auditor.md   | 32 ----------------------
 .opencode/agents/technical-writer.md               | 32 ----------------------
 2 files changed, 64 deletions(-)
EXITCODE=0
```

Exactly 2 staged deletions by this node.

### T4 — `node scripts/verify-kit.mjs` (Rung 1) — exit code 0

```text
check                     status  detail
lockfile-validates        PASS    138 components and 9 pending entries validate against kit.lock.schema.json
per-kind/skills-in-repo   PASS    17 in-repo skills carry .opencode/skills/<id>/SKILL.md with matching frontmatter name
per-kind/skills-upstream  PASS    10 install_cmd shapes hold and gh resolves every owner/repo (10 resolved)
per-kind/mcp-npm          PASS    6 version-pinned npm MCPs match the registry and expose a bin entry
per-kind/mcp-builtin      PASS    2 built-in/remote MCPs honestly recorded (install_cmd null + unverified): fetch, openrouter
per-kind/plugins          PASS    0 plugins are unverified OpenCode-native records with null install_cmd; no specs invented
per-kind/hooks            PASS    7 hooks map to registered functions in .opencode/plugin/arsenal.ts: session-start -> sessionStart; pre-compact -> preCompact; persist-session-state-on-end -> sessionEnd; long-running-process-guard -> longRunningProcessGuard; typescript-check-after-editing-ts-tsx-files -> typescriptCheck; auto-format-js-ts-files-with-prettier-after-edits -> prettierFormat; task-dispatcher -> taskDispatcher
per-kind/agents           PASS    21 agents carry null install_cmd + unverified; 20 self-sourced lock agents resolve to .opencode/agents/<id>.md with byte-equal name, zero model pins (non-leaders mode subagent with zero color fields; named leaders aether, pulsar, blazar mode primary plus color per triumvirate design D1 + owner ruling (a) 2026-10-15); catalog agreement is proven by the catalog-agreement check
per-kind/cli              PASS    64 cli entries carry a real installer command with valid phase, tier and verification (64 verified)
per-kind/lsp              PASS    1 lsp entry valid with correct phase, tier and verification (0 provisioned with a real installer, 1 need-label pointing at project typecheck/lint)
per-kind/theme            PASS    3 theme entries ship a V2-native JSON (base plus mode hue palette) installed by a real file copy; zero image keys, zero model keys
per-kind/prompt           PASS    1 prompt entry ships registry/prompts/ file(s) installed by a real file copy with valid phase, tier and verification
per-kind/dataset          PASS    1 dataset entry ships registry/datasets/ file(s) installed by a real file copy with valid phase, tier and verification
per-kind/template         PASS    1 template entry ships registry/templates/ file(s) installed by a real file copy with valid phase, tier and verification
per-kind/policy           PASS    1 policy entry ships registry/policies/ file(s) installed by a real file copy with valid phase, tier and verification
per-kind/benchmark        PASS    1 benchmark entry ships registry/benchmarks/ file(s) installed by a real file copy with valid phase, tier and verification
per-kind/workflow         PASS    1 workflow entry ships registry/workflows/ file(s) installed by a real file copy with valid phase, tier and verification
per-kind/design.md        PASS    1 design.md entry ships unmodified MIT brand document(s) installed by a real file copy with valid phase, tier and verification; zero model pins, zero placeholders, MIT companions present
agent-mode-explicit       PASS    27 agent files declare mode explicitly (24 subagent); 20 self-sourced lock agents resolve to files; 1 upstream agent (vantrilex-a11y-audit) carries no local file by design
catalog-agreement         PASS    138 lock entries agree with registry/catalog.json on kind, phase, tier, install_cmd, verification
mcp-cap                   PASS    8 tier-core MCP entries are within mcp_cap 8
pending-integrity         PASS    9 pending per-agent themes carry stated reasons (no theme JSON on disk, no install command registered); vantrilex-vanguard, vantrilex-doctrine, vantrilex-prime are locked as components (catalog-matching fields proven by the catalog-agreement check)
VERDICT: PASS - kit proven (22 passed, 0 skipped, 0 failed).
EXITCODE=0
```

No-dangling-refs evidence: `per-kind/agents PASS` (20 self-sourced lock agents resolve to files) + `agent-mode-explicit PASS` (27 agent files declare mode explicitly; 20 resolve; 1 upstream by design) + `VERDICT: PASS (22 passed, 0 skipped, 0 failed)`.

### T5 — `git grep -n "ai-generated-code-security-auditor" -- .` (Rung 1) — exit code 0 (hits present, reported as follow-up, not chased)

Hits include (full output in shell log; key excerpts): `.opencode/agents/vantrilex-security-auditor.md:54`, `.opencode/commands/V-Ai-Generated-Code-Security-Auditor.md` (6 lines), `.opencode/skills/vantrilex-doctrine/SKILL.md:372`, `.opencode/skills/vantrilex-vanguard/SKILL.md:646`, `AGENT.md:79,82,329`, `CHANGELOG.md:293,554,915,1199`, `P2-R0.md:51,57,207`, `SOURCES.md:59`, `docs/09-KIT-LOCK.md:61`, `kit/kit.lock:148`, `registry/*` (`vantrilex-ai-generated-code-security-auditor` theme/registry rows), `scripts/verify-kit.mjs:33`. No hit is the deleted file itself (both deleted paths absent from grep). All hits are historical/docs/registry references — follow-up for LEADER, not chased per brief.

### T6 — `git grep -n "technical-writer" -- .` (Rung 1) — exit code 0 (hits present, reported as follow-up, not chased)

Hits include: `.opencode/agents/vantrilex-scribe.md:36,37,50,60,61`, `.opencode/commands/V-Technical-Writer.md` (6 lines), `.opencode/skills/vantrilex-vanguard/SKILL.md:643`, `AGENT.md:79,82,264,326,329`, `CHANGELOG.md:293,552,915,1199`, `P2-R0.md:51,58,208`, `SOURCES.md:41,42`, `docs/09-KIT-LOCK.md:58`, `kit/kit.lock:151`, `registry/*` (`vantrilex-technical-writer` rows), `scripts/verify-kit.mjs:36`. No hit is the deleted file itself. Follow-up for LEADER, not chased per brief.

### T7 — `git status --short` full-worktree context (Rung 1) — exit code 0

Staged by this node (first-column `D `): `D  .opencode/agents/ai-generated-code-security-auditor.md`, `D  .opencode/agents/technical-writer.md` — uncommitted. Pre-existing unstaged worktree dirt (` M`, ` D` second column, `??`) from the P3 lane (e.g., unstaged ` D .opencode/agents/agent-maker.md` etc. plus untracked `P3-*`, `GITHUB-*`) was not touched by this node. No commit/push/tag ran.

Additional Rung 1 reads (kit awareness, always permitted): `registry/rag/01-doctrine.json`, `05-failure-modes.json`, `07-workflow-recipes.json`, `09-security-posture.json` (law/failure/recipe/posture consulted; no failure to diagnose, no security implication beyond deletion already authorized).
