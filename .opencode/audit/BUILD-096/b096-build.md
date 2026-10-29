# b096-build — LD-06 observability, tracing and cost governance (ledger)

Lane: build-release (AUTO-0.9-FULL 0.9.6) · Node: b096-build (wave 2 of 10) · Owner: vantrilex-typescript
Doctrine: FULL — core ponytail posture with FLOOR and CEILING below.
Date (UTC): 2026-10-29 · Seat: worker-only side agent (no lead/dispatch/declare-done; report is evidence)

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 1. Scope (from V3:3422–3470, Arabic original — implemented, never re-derived)

LD-06 makes task cost visible: trace spans per component, cost leaderboards,
budget ceilings, tiered-routing inputs, cost-per-success accounting. Consumes
native child accounting (children carry cost/tokens; session stats count
subagents separately — prior install check proved 845 subagent sessions) plus
the spawn ledger as a first-class entry (each spawn: granted/consumed/result).
Two fields only this slot ships: per-component cache hit-rate, and the
context-rot probe. Exit criteria: full-task cost from ledger evidence
(children included); hit-rate visible per component; ceiling stops overruns in
practice. Full treatment lives in `observability-spec.md` (sibling file, same
commit).

## 2. Fallback FBLD-06 honored

FBLD-06 (slot 0.9.6, source
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:18`): V3 slot
scope versus R2 sales-ready wording pressure — fallback is findings text only,
never applied as a docs change. Honored here: this build ships measurement
and governance only. Finding (text only, no docs change applied): no
sales-ready wording was introduced by this node; the spec carries measurement
language verbatim from V3 and the leaderboard stays internal-first per the
open question (external publish is a later owner decision).

## 3. Holder pattern (primary HEAD never moves)

All branch work ran in the detached holder
`C:/Users/omarb/AppData/Local/Temp/opencode/b096-build-holder` checked out at
`wt/0.9.6-observability`. Primary worktree (`O:/vantrilex-arsenal`) stayed on
`wt/0.9.0-zenith`; local `main` untouched.

Pre-proofs (before any mutation):

- Primary `git rev-parse HEAD` → `2a78995b88f9d0f5b89564397add338794b60c5f`
- Primary `git branch --show-current` → `wt/0.9.0-zenith`
- `git rev-parse refs/heads/main` → `68f8186ba18c825819e890de2ef694560655c4f2`
- Holder `git rev-parse HEAD` → `c2f11751fe5cf6cb2e43d34fb2c708f2bdbc8f46`
- Holder `git branch --show-current` → `wt/0.9.6-observability`
- Holder `git status --porcelain=v1` → clean (empty)
- `git ls-tree -r --name-only wt/0.9.6-observability -- .opencode/audit/BUILD-096/` → empty (0 committed paths before)

## 4. Before/after counts (committed paths under `.opencode/audit/BUILD-096/`)

- Before: 0 committed paths (ls-tree empty on branch tip `c2f1175`).
- After: exactly 3 new files, one commit, no other paths touched:
  1. `.opencode/audit/BUILD-096/observability-spec.md` (spec)
  2. `.opencode/audit/BUILD-096/cost-ledger.mjs` (measurement script)
  3. `.opencode/audit/BUILD-096/b096-build.md` (this ledger)
- No `.ts` product file touched. No file owned by another node touched
  (`b096-branch.md` is a prior node's untracked path in the primary worktree;
  it is absent from the holder and absent from this commit).

## 5. FAIL-first reproduction (measurement script, first run)

First run was GREEN, so no repair round was needed (one repair round was
reserved inside this node and stands unused):

- `node --check .opencode/audit/BUILD-096/cost-ledger.mjs` → no output / `CHECK_EXIT:0`
- `node .opencode/audit/BUILD-096/cost-ledger.mjs` → `RUN_EXIT:0`, output quoted:

```text
COST total=310 (children=200 spawns=110)
SPAWN spawn-1 granted=100 consumed=60 result=success
SPAWN spawn-2 granted=50 consumed=50 result=failed
CEILING ceiling=300 total=310 stopped=true overBy=10
HITRATE
component | hits/total | rate
registry | 90/100 | 0.90
rag | 30/100 | 0.30
LEADERBOARD (INTERNAL ONLY — do not publish)
1. rag: 180
2. registry: 130
SELFTEST PASS
```

Self-test proves, from a fixture ledger: full-task cost (310 = children 200 +
spawns 110, spawns validated with granted/consumed/result); the ceiling stops
a deliberate overrun in practice (310 vs 300 stops, overBy 10; control 400
does not stop); the per-component hit-rate table renders; the leaderboard
renders internal-first.

## 6. Must-run exits (all exit 0, outputs quoted)

Run in the holder unless noted:

- `node --check .opencode/audit/BUILD-096/cost-ledger.mjs` → (no output) / `CHECK_EXIT:0`
- `node .opencode/audit/BUILD-096/cost-ledger.mjs` → `RUN_EXIT:0` with the output quoted in §5
- Commit-shape proofs (post-commit, holder):
  - `git log -1 --format=%H` → new commit SHA (quoted in the node report; parent is exactly `c2f11751fe5cf6cb2e43d34fb2c708f2bdbc8f46`)
  - `git log -1 --format=%P` → `c2f11751fe5cf6cb2e43d34fb2c708f2bdbc8f46` (exactly one parent)
  - `git log -1 --format=%s` → `feat(0.9.6): LD-06 observability tracing and cost governance` (exact message)
  - `git show --name-only --format=` → exactly the 3 paths listed in §4
- Unmoved proofs (post-commit, primary worktree `O:/vantrilex-arsenal`):
  - `git rev-parse HEAD` → `2a78995b88f9d0f5b89564397add338794b60c5f` (identical to pre-proof)
  - `git branch --show-current` → `wt/0.9.0-zenith` (identical to pre-proof)
  - `git rev-parse refs/heads/main` → `68f8186ba18c825819e890de2ef694560655c4f2` (identical to pre-proof)

## 7. Refusals / guardrails honored

- No push, no merge, no tag, no publish, no release act of any kind.
- `main`, `wt/0.9.0-zenith`, other version branches, AGENT.md, WORKFLOW.md,
  tags/releases: none touched (state files leader-owned; this node never
  updates AGENT.md/WORKFLOW.md).
- No install command invented (node stdlib only; no `npm install`; zero
  dependencies in the new script).
- No `any` introduced (the new script is `.mjs` with JSDoc-narrowed
  `unknown` at the trust boundary; nothing to escalate).
- `tsc --noEmit` gate: not applicable to this commit — no `.ts` file is
  added or modified, so the TypeScript gate has no surface here; stated
  plainly instead of claimed.
- Single-writer: this node is the sole writer of the 3 paths plus the one
  commit; no other file written.
- Ponytail bound FULL held: FLOOR — risky logic (cost math, ceiling verdict,
  spawn validation) ships with a runnable self-test plus trust-boundary
  narrowing (`isValidSpawnEntry`, numeric guards); CEILING — smallest complete
  shape (one spec, one script, one ledger; no framework, no options, no
  wrappers nobody asked for).

## 8. Handoff summary (for the LEADER — not a ruling)

One commit on `wt/0.9.6-observability` with exactly the 3 new files above,
parent exactly `c2f11751fe5cf6cb2e43d34fb2c708f2bdbc8f46`, exact message
`feat(0.9.6): LD-06 observability tracing and cost governance`. Must-runs exit
0 with outputs quoted in §5. Primary HEAD and local main proven unmoved.
Verdict belongs to the LEADER.

Ponytail: FULL — self-test green first run (CHECK_EXIT:0, RUN_EXIT:0) with outputs quoted, no repair round needed.
