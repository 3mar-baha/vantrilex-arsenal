# b091-build — LD-01 Smart compact implementation (nine-field report)

1. Lane: build-release (AUTO-0.9-FULL 0.9.1)
2. Node: b091-build (wave 1 of 8) — owner `vantrilex-typescript`
3. Concern: Implement LD-01 Smart compact: hook-level summary synthesis plus
   continuous pre-digestion that preserves plan plus error traces plus
   recoverable pointers and beats the simple baseline by measurement.
4. Branch: `wt/0.9.1-smart-compact` — worktree
   `C:/Users/omarb/AppData/Local/Temp/opencode/wt-091-smart-compact`, HEAD
   `df97f9e7f527aefd0d5149700591ac27bc590450` (== `refs/heads/main` tip at
   cut time; `git status` in worktree showed exactly the two intended
   mutations, zero carryover dirt — the main-checkout dirt never entered this
   worktree). Task-dispatcher classification: Scenario 1 NEW TASK.
5. Base: `df97f9e7f527aefd0d5149700591ac27bc590450`, re-proven by
   `git rev-parse HEAD` inside the worktree.
6. Refs: implementation lands on `wt/0.9.1-smart-compact` only (branch-local
   commit, see §8); `main` untouched; no merge/tag/push/publish/activation.
7. Exits: `tsc --noEmit` exit 0; `node --check` exit 0 over the new `.mjs`;
   harness `node scripts/verify-smart-compact.mjs` exit 0
   (28 PASS, 0 FAIL, 2 UNVERIFIED with exact blockers, §9).
8. Mutations: exactly two files (hashes SHA256, post-edit pre-commit):

   | File | Lines | SHA256 |
   | --- | --- | --- |
   | `.opencode/plugin/arsenal.ts` (+432, §20b LD-01 + `digest` state field + `preCompact` wiring) | +432 | `8369B9A9946D2CC2EE7BFAC604198D205D3452F8AC42B790E3F702A3014B32A3` |
   | `scripts/verify-smart-compact.mjs` (new, LD-01 gate harness, Node 25 ESM zero-deps) | new | `5835F39C2695AAA50EBE923ACF734893321EEF0573CCF3809BCF8D2F34A2C459` |

   No `any` in either file (`: any|as any` grep count 0; pre-existing prose
   uses of the word "any" untouched). No new hook registration, no new
   config option, no summarizer-prompt swap, no compact-model pick. No other
   version branch, smoke/field/rollback/verify/publish artifact touched;
   `AGENT.md`/`WORKFLOW.md` untouched.
9. Evidence: this file; failing-first run pre-implementation
   (1 PASS, 17 FAIL of 18, `HARNESS_EXIT:1`, exports absent); post-
   implementation runs quoted below; `tsc` via repo-locked TypeScript 5.9.3
   at `O:/vantrilex-arsenal/node_modules/typescript/lib/tsc.js`.

## Gate tables (evidence, not claims)

`node --check` + `tsc --noEmit` (exact):

| Check | Result |
| --- | --- |
| `node --check scripts/verify-smart-compact.mjs` (pre + post) | PASS — `CHECK_EXIT:0` both runs |
| `tsc --noEmit` baseline (pre-change, worktree) | PASS — `TSC_BASELINE_EXIT:0` |
| `tsc --noEmit` final (post-change, worktree) | PASS — `TSC_FINAL:0` |
| `: any\|as any` count, both files | PASS — 0 and 0 (nothing to justify, nothing to escalate) |

Harness post-implementation (28 PASS, 0 FAIL, 2 UNVERIFIED of 30):

| Check | Result | Detail |
| --- | --- | --- |
| source | PASS | 155245 chars read |
| export:newDigestState + 17 exports/constants | PASS | all present |
| compile | PASS | tsc emit + import of shipped module ok |
| T5-wrong-turns | PASS | wrong turn kept with WRONG-TURN tag |
| T6-recoverable | PASS | 8 dropped spans, pointers complete, byte-exact restore; lost + tampered stores detected |
| baseline-law | PASS | smart=15037t [plan,errors] beats baseline=15009t [] by density |
| digestion-cost | PASS | cost=15t chars=57, saved=7771t |
| stable-prefix | PASS | first 1024 bytes identical |
| hook-limits | PASS | session hooks=[prompt] only; no model pick, no prompt swap |
| trigger-law | PASS | auto@85010=true belowMin=false overflowOnce=false overflowFirst=true manual=true |
| input-safety | PASS | noProv/noFp refused, MCP accepted, exec/cred held candidate, proven admitted |
| live-v2-firing | UNVERIFIED | blocker: V2 setup exposes session "prompt" only; no compaction registrar on this host |
| live-provider-overflow | UNVERIFIED | blocker: needs a real provider-overflow event; fixture is simulated |

## Gaps (UNVERIFIED with exact blocker, never green-by-association)

- Live V2 compact firing: UNVERIFIED — V2 `setup()` registers no
  compaction hook by platform truth (only `prompt` observed); pure
  functions ship V2-ready, firing awaits a host registrar.
- Live provider-overflow restore: UNVERIFIED — one-time-restore logic is
  unit-gated (`trigger-law`); a live overflow signal was never observed here.
- `strategic-compact` ancestor: acceptance states the skill is "accepted
  polished as ancestor" — on disk only `registry/skills/strategic-compact.md`
  (external pointer, 12 lines) exists; no polished in-repo skill to inherit
  trigger text from. Carried as ancestor-by-reference; trigger semantics
  (manual/UI) implemented from the V3 slot text instead.
- T5/T6 definitions: no prior repo artifact defines them beyond the V3
  amendments; implemented exactly as the brief's acceptance glosses them
  (T5 = wrong-turns kept tagged; T6 = recoverable compact, restore-or-FAIL).
- Owner conflicts: FBLD-01 recorded (V3-wins fallback, FLAGGED never
  resolved, carried by reference from
  `.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:13`);
  no new conflict introduced by this node.
- Observed, not lane-resolved: the live main-checkout session emits
  `[arsenal] typescript-check: FAIL — exit 1` (`opencode --noEmit`
  unrecognized flag) on tool calls; authoritative direct `tsc` runs in this
  worktree are exit 0. Cause not investigated (cross-role work refused).

## Handoff for LEADER

Implementation complete on `wt/0.9.1-smart-compact`; all gates from the
brief's Must-run set pass with quoted exits; two live-fire items stay
UNVERIFIED with blockers. Verdict belongs to LEADER; this report is
evidence, not a ruling. No merge/tag/push/publish performed.

Ponytail: FULL — tsc --noEmit exit 0 plus harness 28 PASS / 0 FAIL with 2 blocker-named UNVERIFIED; zero `any`; no new surface beyond the two mandated files.
