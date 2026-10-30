# LD-18 Spawning Constitution — mechanism spec (worker evidence)

Lane: build-release (AUTO-0.9-FULL 0.9.18 ONLY).
Node: b0918-build. Owner: vantrilex-typescript (worker-only; never lead,
never dispatch, never declare; verdict belongs to the LEADER). No second-agent
dispatch. STOP after commit plus proofs. No push, no merge, no tag.

Doctrine: FULL — core ponytail posture with FLOOR and CEILING below; every
code-writing step ran under it.

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

Base: `db96ce862f25792b7dfeac44831f38947397c81b` (live `origin/main` tip incl
0.9.17), re-proven in the holder worktree before any write (never assumed).

Holder worktree: `C:/Users/omarb/AppData/Local/Temp/opencode/b0918-build-holder`
(primary checkout HEAD at `wt/0.9.0-zenith` never moved; no push, no merge, no tag).

## 1. What this system is (mechanism only, laws untouched)

This spec plus `scripts/spawning-constitution-0918.mjs` plus
`scripts/verify-spawning-0918.mjs` build the LD-18 mechanism the constitution
law points at: ledger, unregistered-spawn detection plus recall, orphan
adoption-or-retirement at session anchors, arbitration tools with a scope
boundary, invocation mechanics with brand-new child context, savepoints with
real resume, subset-rule enforcement by our tooling at creation time, and a
depth cap pinned only after the depth-zero-semantics wording gate. No law is
rewritten: the mechanism file states `mechanism only (laws untouched)`
(`scripts/spawning-constitution-0918.mjs:1`) and the probe fails on any
`LAW REWRITTEN|AMENDED|REPEALED` marker.

Corrected doctrine (owner-decided, text AND execution corrected together):
`The subset rule is enforced by our tooling at creation time, not by the
platform.` (`scripts/spawning-constitution-0918.mjs:48`). Execution matches:
`createSpawn` refuses over-grants before any work
(`scripts/spawning-constitution-0918.mjs:144-150`). A tree grep for
`platform.*enforce` returns one hit only —
`.opencode/audit/BUILD-098/b0918-build.md:31`, which already states the
platform does NOT enforce — so zero constitutional texts remain that imply
platform enforcement, and this system adds none (probe check `text-correction`).

## 2. Ledger (FULL field set, no exceptions)

Fields (`scripts/spawning-constitution-0918.mjs:20`): taskId, parent, kind,
defOrTemplate, grantedBudget, consumedBudget, result, forgeReviewRef.
`createLedgerEntry` throws on any missing field
(`scripts/spawning-constitution-0918.mjs:114`); every spawn in the probe
carries all 8 (probe check `ledger-full-fields`).

Storage form DECIDED: file (JSONL ledger). Evidence: probe check
`storage-form` writes a ledger to a temp JSONL file and reads it back across a
simulated session boundary with all 8 fields intact.

## 3. Unregistered-never-happened (automatic detection plus recall)

`detectUnregistered` (`scripts/spawning-constitution-0918.mjs:173`) finds
every observed effect with no ledger entry; `recallUnregistered`
(`scripts/spawning-constitution-0918.mjs:179`) discards the effect and records
`effectAcceptedAsProof: false`. Discovered-effect DECIDED: an effect without a
ledger entry is never accepted as existence proof; the discovered spawn is
recalled (invalidated), not adopted. Evidence: probe checks `detection` plus
`recall` (ghost `t-ghost` detected among 2 effects, recalled, effect discarded).

## 4. Orphan adoption-or-retirement at session anchors

`adoptOrRetireAtAnchor` (`scripts/spawning-constitution-0918.mjs:190`)
records per orphan: taskId, anchorId, decision (adopted|retired), reason,
evidenced flag. The adopter takes stop-and-review responsibility; a retired
orphan records its reason so it is never silently revived.

Anchor-definition DECIDED: `An anchor is an automatic execution point at a
session boundary` (`scripts/spawning-constitution-0918.mjs:70`) — detection
plus adoption-or-retirement run automatically, never waiting for a manual
review. Evidence: probe check `adoption-or-retirement` (`o-1` adopted,
`o-2` retired at `anchor-7` with reasons).

## 5. Arbitration tools with scope boundary (part of the system)

`arbitrate` (`scripts/spawning-constitution-0918.mjs:282`) records
accept|reject|retry with reason under scope `result-only` and never writes the
leader log (`leaderLogUntouched` asserted).

Arbitration-scope DECIDED: `Arbitration decides accept/reject/retry of a spawn
result only; it never rewrites leader-log ordering or ownership.`
(`scripts/spawning-constitution-0918.mjs:77`).

Precedence DECIDED: `On arbitration-vs-leader-log conflict the leader log
prevails for ordering and ownership; the arbitration verdict applies to result
accept/reject of that spawn only; the conflict is logged with both refs.`
(`scripts/spawning-constitution-0918.mjs:88`). Evidence: probe checks
`arbitration-scope` plus `grant-precedence` (`resolvePrecedence` returns
winner `leader-log` with the conflict logged).

## 6. Invocation mechanics

`spawnChild` (`scripts/spawning-constitution-0918.mjs:211`): true child
session bound to the parent (`sessionId = parent:cN`), brand-new context per
child carrying exactly `message` plus `files` (leak test: no third channel),
per-call model override, step count as an enforced ceiling (`STEP_CEILING_EXCEEDED`
past the ceiling). Evidence: probe checks `true-child-bound`,
`context-leak`, `model-override`, `step-ceiling`.

Forward-wait vs resumable-async are two separately tested paths:
`runForwardWait` (`scripts/spawning-constitution-0918.mjs:241`, probe check
`forward-wait`) vs `runResumableAsync` (`scripts/spawning-constitution-0918.mjs:253`,
probe check `resumable-async`).

Savepoints carry position plus context and resume FROM that position:
cut at 2 of 5 resumes from 2 for a total of 5 outputs `w0..w4` with exactly 5
steps consumed (re-run-as-resume would consume 7). Evidence: probe check
`savepoint-resume`.

## 7. Subset-rule enforcement BY OUR TOOLING (refusal at creation)

The bundle carries the computed grant (`computeGrant`, per-kind formula at
`scripts/spawning-constitution-0918.mjs:100`); creation-time evaluation refuses
every over-grant BEFORE any work or consumption
(`scripts/spawning-constitution-0918.mjs:144-150`, `consumed = 0`, ledger
unchanged). Evidence: probe check `refusal-at-creation` (requested 11 >
bundle 10 refused, ledger empty).

Grant-calculus DECIDED: one formula per kind —
`grant = base[kind] + perStep[kind] * stepCeiling` with
`dispatch {6,2}`, `review {4,1}`, `probe {2,1}`
(`scripts/spawning-constitution-0918.mjs:93-98`). Evidence: probe check
`grant-precedence` asserts the formula per kind.

## 8. Depth cap (three edges, pinned only after the wording gate)

Depth-zero semantics (exact setting wording,
`scripts/spawning-constitution-0918.mjs:38`): depth counts parent-to-child
spawn edges from the session root; depth 0 is the root session itself (zero
spawn edges traversed); setting key `spawning.maxDepth=3` allows at most 3
edges. The probe wording gate asserts this string verbatim before the cap test
runs; a cap pinned before the wording gate is reopened, not shipped. Cap:
`SPAWNING_MAX_DEPTH = 3` (`scripts/spawning-constitution-0918.mjs:43`); the
4th edge is refused at creation (`scripts/spawning-constitution-0918.mjs:136`).
Evidence: probe check `depth-cap` (3 edges allowed, 4th refused).

FBLD-18 carried verbatim wherever the R4 template-depth overlap appears:

FBLD-18 — Slot 0.9.18 — Conflict: V3 slot scope versus R4 template depth
value pressure — Fallback: cite read-only, change nothing here — Matches
LD-18 — Status FLAGGED, never resolved.

The R4 template depth value at
`.opencode/skills/vantrilex-vanguard/assets/companion-config.template.jsonc:23`
(`experimental.subagent_depth = 1`) is cited read-only here
(`scripts/spawning-constitution-0918.mjs:8-14`) and never edited by this lane:
no write to that path in this commit (proven by the commit file set).

## 9. Exit criteria V3:4458-4463 — all COVERED

- 4458 unregistered spawn detected plus recalled, evidenced, re-runnable:
  probe checks `detection`, `recall`, `triple-close`; mechanism
  `scripts/spawning-constitution-0918.mjs:173-184`.
- 4459 orphan adopted or retired at the next anchor with decision plus reason:
  probe check `adoption-or-retirement`; mechanism
  `scripts/spawning-constitution-0918.mjs:190`.
- 4460 over-bundle grant refused at creation, not after work or consumption:
  probe check `refusal-at-creation`; mechanism
  `scripts/spawning-constitution-0918.mjs:144-150`.
- 4461 depth cap pinned with exact setting wording, depth-zero semantics fixed
  by the gate before pinning: probe check `depth-cap`; mechanism
  `scripts/spawning-constitution-0918.mjs:38-43`.
- 4462 every spawn in the test carries full fields: probe check
  `ledger-full-fields`; mechanism
  `scripts/spawning-constitution-0918.mjs:20-32,114`.
- 4463 no constitutional text left implying the platform enforces subsetting:
  probe check `text-correction`; tree grep evidence in section 1 above.

## 10. Open questions V3:4464-4469 — all DECIDED with evidence

- 4464 storage-form: DECIDED file (JSONL). Evidence: probe `storage-form`.
- 4465 arbitration-scope: DECIDED result-only, leader log owns ordering.
  Evidence: probe `arbitration-scope`.
- 4466 discovered-effect: DECIDED recalled/invalidated, never proof.
  Evidence: probe `recall`.
- 4467 anchor-definition: DECIDED automatic execution point at session
  boundary. Evidence: probe `adoption-or-retirement` plus
  `scripts/spawning-constitution-0918.mjs:70`.
- 4468 grant-calculus: DECIDED one formula per kind. Evidence: probe
  `grant-precedence`.
- 4469 precedence: DECIDED leader log prevails on ordering, verdict stands
  for result only, conflict logged. Evidence: probe `grant-precedence`.

## 11. UNVERIFIED with exact blockers (never silently resolved)

- Combined device-install coordinate: UNVERIFIED — blocker: no on-disk
  combined record exists (source
  `.opencode/audit/FULL-REPORT-REPLAN/research-findskills-device-2026-10-27.md:25`);
  cited, never invented. install_cmd for this system: null (unverified — no
  install vector introduced; nothing to install).
- Live platform session-boundary drill: UNVERIFIED — blocker: no live child
  sessions were spawned on this node; anchors are exercised in-probe only.
- Arabic mirror: UNVERIFIED — blocker: repo hard rule (English only; sole
  on-disk exception is the README pair). All outputs English.

## 12. Install honesty

Zero invented install commands. No new file contains an install command
pattern (probe check `fbld18-honesty` greps the mechanism); install_cmd is
null plus unverified wherever unproven (see section 11).
