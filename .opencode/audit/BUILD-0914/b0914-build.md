# b0914-build — LD-14 background task layer with queue scheduling triggers supervision (worker evidence)

Seat: vantrilex-typescript (worker seat) · Lane: AUTO-0.9-FULL 0.9.14 · Node: b0914-build (wave 2 of 10) · Date (UTC): 2026-10-29

Concern: land one commit with the LD-14 background task-layer spec plus the verification probe plus this ledger.

Owner: vantrilex-typescript · Effort: HIGH. Single writer: only W2 writer on this branch.

Task-dispatcher: Scenario 1 NEW TASK (directed node `b0914-build` never dispatched to this seat before; no in-flight task). Vanguard playbook NOT run from this seat — worker seat denies the skill (worker-only: never lead, never dispatch, never equip); recorded here and the rule applied: execute exactly one directed node, report back. No second lane; no ambiguity question needed (brief names repository concern, node, branch name, parent, message, and permitted files explicitly).

Doctrine: FULL (this node writes code — probe script plus Markdown spec/ledger — under core `ponytail` posture with FLOOR and CEILING below, quoted verbatim from RESEARCH-03.md).

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 1. May-read (read-only, no execution)

- Base: `.opencode/audit/BUILD-0914/b0914-branch.md` — branch `wt/0.9.14-background-tasks` cut local-only at exactly live `origin/main` tip FULL `a33e086a81d3aafbb5be64d84c3254dca8e71eec` (0.9.13 merge included), ancestry exit `0`, HEAD `2a78995b88f9d0f5b89564397add338794b60c5f` unmoved. [CITED]
- LD-14: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3957-4031` (slot scope, how steps 1-10 at :3983-3992, exit criteria at :4024-4025, open questions queue-persistence format + supervision thresholds at :4028-4029). Read-only requirements, carried never re-derived. [CITED]
- FBLD-14: `FBLD-14 — Slot 0.9.14 — Conflict: V3 slot scope versus R4 device-scope pressure with zero on-disk combined record — Fallback: keep device UNVERIFIED, never widened by inference — Matches LD-14 — Status FLAGGED, never resolved.` [CITED verbatim]
- Locked reference: `.opencode/audit/BUILD-0913/verdict-0.9.13.md` (0.9.13 lock, read-only context). [CITED]
- Kit pattern: `.opencode/plugin/arsenal.ts` read before editing (zero dependencies, mirrored V2 plugin surface, narrowed event types, guards that degrade to SKIPPED). [CITED]

## 2. Plan inside the node (no mutating call ran before this plan)

1. Holder worktree bound to `wt/0.9.14-background-tasks` at parent FULL `a33e086a81d3aafbb5be64d84c3254dca8e71eec`; primary HEAD untouched.
2. Write exactly two slot files: `task-layer-spec.md`, `task-probe.mjs` under `.opencode/audit/BUILD-0914/`.
3. Run `node --check` (expect 0) then `node task-probe.mjs` twice (expect 0, 4/4 PASS, digest-identical); FAIL-first honestly reported, repaired minimally, threshold never weakened.
4. Grep slot files for invented install commands (expect only `install_cmd: null`) and probe for auto-approve mechanisms (expect zero hits); confirm zero `.ts` files.
5. Write this ledger `b0914-build.md` with pre-commit evidence (file bytes + SHA-256, exits, probe lines).
6. Land ONE commit on `wt/0.9.14-background-tasks` with the exact message, containing only the three new files under `.opencode/audit/BUILD-0914/`; record tip FULL; no push/merge/tag.
7. Remove the holder; report FULL hashes, bytes, SHAs, blob ids, exits, probe lines.

## 3. Slot coverage (LD-14 how 1-10, carried as data)

| # | Rule | Where it lands |
|---|------|----------------|
| 1 | Task queue above native background agents, every item with state + owner | `task-layer-spec.md` §3 + probe `makeTask`/`persistQueue` |
| 2 | Owner structure adopted: service-mode + external scheduler over the network interface, never re-invented | `task-layer-spec.md` §1 + probe `externalRelaunch` |
| 3 | Scheduled task survives server restart via external relaunch without state loss | `task-layer-spec.md` §3 + probe `LD14-SCHEDULED-RESTART` |
| 4 | Triggers on live events plus a ledger compensating the missing replay; no silent loss | `task-layer-spec.md` §4 + probe `LD14-TRIGGER-LEDGER` |
| 5 | Smooth self-healing: mechanical absorb, retry with error as context, stability detection before done | `task-layer-spec.md` §4 + probe `runWithSelfHealing` |
| 6 | Every absorbed failure in the ledger | `task-layer-spec.md` §4 + probe `LD14-ABSORBED-FAILURES` |
| 7 | Every background memory write via the umbrella recall write gate; unpassed writes rejected | `task-layer-spec.md` §5 + probe `recallWriteGate` / `LD14-RECALL-WRITE-GATE` |
| 8 | Exception-only supervision; alert thresholds shaped toward that form | `task-layer-spec.md` §4 + probe `supervise` / `LD14-SUPERVISION-EXCEPTION-ONLY` |
| 9 | Resumptions bound to checkpoints, from a known point | `task-layer-spec.md` §3 + probe `resumedFrom` |
| 10 | Scouting-track sensing bundle served from this slot if accepted as ruled | `task-layer-spec.md` §2 rule 10 (carried as data; no bundle decided here) |

Exit criteria V3:4024-4025 COVERED: scheduled-survives-restart via external relaunch without state loss (probe `LD14-SCHEDULED-RESTART: SURVIVES`) + all absorbed failures in ledger (probe `LD14-ABSORBED-FAILURES: ALL 2 IN LEDGER`) + background memory writes pass the recall-write gate in practice (probe `LD14-RECALL-WRITE-GATE: PASS`). Open questions V3:4028-4029 answered as data inside the spec §3 (queue-persistence format `ld14-queue-v1`) and §4 (`MAX_RETRIES = 3`, `ALERT_AFTER_CONSECUTIVE_FAILURES = 3`), never blocking.

## 4. Pre-commit proofs (holder `b0914-build-holder`, every exit quoted)

- `git rev-parse HEAD` → FULL `a33e086a81d3aafbb5be64d84c3254dca8e71eec`, `H_EXIT:0` — holder at branch tip == parent.
- `git status --porcelain=v1` → only `?? .opencode/audit/BUILD-0914/`, `S_EXIT:0` — holder clean except the two new slot files before writes.
- `node --check .opencode/audit/BUILD-0914/task-probe.mjs` → no output, `CHECK_CODE:0`.
- `node .opencode/audit/BUILD-0914/task-probe.mjs` run 1 → `PROBE1_CODE:0` with output:
  - `LD14-SCHEDULED-RESTART: SURVIVES via external relaunch, state intact`
  - `LD14-TRIGGER-LEDGER: COMPENSATED without silent loss`
  - `LD14-ABSORBED-FAILURES: ALL 2 IN LEDGER`
  - `LD14-RECALL-WRITE-GATE: PASS gated accepted, ungated rejected`
  - `LD14-SUPERVISION-EXCEPTION-ONLY: SILENT-UNTIL-THRESHOLD, device UNVERIFIED`
  - `FBLD-14 — Slot 0.9.14 — Conflict: V3 slot scope versus R4 device-scope pressure with zero on-disk combined record — Fallback: keep device UNVERIFIED, never widened by inference — Matches LD-14 — Status FLAGGED, never resolved.`
  - `LD14-DIGEST: c122fa78d8130566ace32dd4e88d7a5cd5d78e3d65acf0bc50ed17770e99df66`
  - `LD14-PROBE: PASS 4/4`
- `node .opencode/audit/BUILD-0914/task-probe.mjs` run 2 → `PROBE2_CODE:0`, byte-identical output, digest-identical FULL `c122fa78d8130566ace32dd4e88d7a5cd5d78e3d65acf0bc50ed17770e99df66`.
- FAIL-first record: no failure occurred. First `node --check` exit `0`, first probe exit `0` with 4/4 PASS. Nothing repaired, threshold never weakened, no guard touched.
- Auto-mechanism grep (`autoApprove|autoFix|applyFix|function approve` over probe): zero hits — no auto-fix, no auto-approve mechanism anywhere.
- Install-command grep over both slot files: only `install_cmd: null` in the spec; zero invented install commands (no `npm install`, no `pip install`, no `npx install`). Every component carries `install_cmd: null` with `verification: unverified`.
- Device grep: `DEVICE_STATUS = "UNVERIFIED"` asserted in the supervision check; device kept UNVERIFIED, never widened by inference.
- FBLD-14 carried verbatim in spec §1 + Sources, spec §4, probe output line, and this ledger §1. Device stays UNVERIFIED.

Pre-commit file bytes + FULL SHA-256 (content hashes, commit-independent):

- `.opencode/audit/BUILD-0914/task-probe.mjs` | bytes `9941` | sha256 FULL `18ed73f3ae02cfdcb5007491d9c1bb3218b454a2b496def9d359ea0832cebe69`
- `.opencode/audit/BUILD-0914/task-layer-spec.md` | bytes `7018` | sha256 FULL `6e29b3d3a44569f692ed4a42073e27d50330d20066a4b1cd1ca157b9552a6eed`
- This ledger byte count + SHA-256 recorded post-commit in the final report (ledger content fixed at commit time).

## 5. The commit (recorded post-landing; tip FULL in final report)

- Parent FULL `a33e086a81d3aafbb5be64d84c3254dca8e71eec` (holder `rev-parse HEAD` pre-commit proves tip == parent).
- Exact message: `feat(0.9.14): LD-14 background task layer with queue scheduling triggers supervision`.
- Content: only three new files under `.opencode/audit/BUILD-0914/` (`task-layer-spec.md`, `task-probe.mjs`, `b0914-build.md`); `git status` + `git show --name-only` + `git rev-list --count parent..tip == 1` quoted in the final report.
- No push, no merge, no tag by this node.

## 6. Gates (PASS / FAIL / UNVERIFIED only)

| Gate | Verdict |
|------|---------|
| ONE commit on `wt/0.9.14-background-tasks`, parent FULL `a33e086a81d3aafbb5be64d84c3254dca8e71eec`, exact message, only three new files under `.opencode/audit/BUILD-0914/` | PASS (post-landing proofs in final report) |
| `node --check` exit `0` | PASS (`CHECK_CODE:0`) |
| Probe self-test exit `0` twice digest-identical: restart SURVIVES, trigger COMPENSATED, absorbed ALL 2 IN LEDGER, recall gate PASS | PASS (`PROBE1_CODE:0`, `PROBE2_CODE:0`, `PASS 4/4`, digest FULL `c122fa78d8130566ace32dd4e88d7a5cd5d78e3d65acf0bc50ed17770e99df66`) |
| FBLD-14 carried verbatim; device UNVERIFIED never widened; no auto-approve mechanism anywhere | PASS (verbatim line in spec + probe + ledger; zero grep hits) |
| Zero invented install commands (null + `verification: unverified`) | PASS (only `install_cmd: null`) |
| Primary HEAD (`wt/0.9.0-zenith` @ `2a78995b…`) never moved; dirt untouched; holder removed after | PASS (post-landing proofs in final report) |
| No push/merge/tag | PASS |
| `tsc --noEmit` | UNVERIFIED — blocker: zero `.ts` files in the 3-file diff, so there is nothing to typecheck; carried per 0.9.13 precedent (Guide ruling or capable re-run before merge). Not scored as pass. |

Zero FAIL. One carried UNVERIFIED row (tsc) with exact blocker, never argued into a pass.

## 7. Review cycles (cap two; unbounded recursion refused)

- Cycle 1 (correctness): re-read parent FULL, exact message punctuation, three file names, probe five output lines + digest + 4/4, FBLD-14 verbatim, slot table 1-10, exit criteria, open-question answers — all MATCH the brief.
- Cycle 2 (safety): confirm holder-only writes, no `main`/HEAD checkout in primary, no push/merge/tag/force-push, no `AGENT.md`/`WORKFLOW.md`/other-ledger touch, no `registry/catalog.json` or lock touch, no state file touched, no second dispatch, no owner contact, no weakened threshold. Finding: none; no rework. Cap respected — no third cycle.

Rate limits: zero 429/5xx encountered; `circuit-breaker-guard` path armed, not engaged. Every quoted command is re-runnable (`documentation-as-tests`).

## 8. Handoff

- Files left (all under `.opencode/audit/BUILD-0914/` on branch `wt/0.9.14-background-tasks`): `task-layer-spec.md`, `task-probe.mjs`, `b0914-build.md` (this ledger).
- Return path: this ledger plus the final report to the LEADER; ruling belongs to the LEADER. Verdict belongs to the LEADER. Stop after landing; report back.

Refusals honored: no push, no merge, no commit beyond the single directed commit, no tag create/push/delete, no force-push, no branch/tag/release delete, no published-history rewrite, no repository settings/secrets/environments/access change, no operation on an unprimed repo, no blind retry, no lead/dispatch/done-declaring, no owner contact, no weakened guard, no invented install/token/approval/hash/exit, no `registry/catalog.json` edit, no generated-Markdown hand-edit, no `AGENT.md`/`WORKFLOW.md`/state-file/other-ledger touch.

Kit awareness: `session-context-primer` (orientation — collapsed here), `vantrilex-doctrine` (governing law), `circuit-breaker-guard` (armed, not engaged), `documentation-as-tests` (every command re-runnable). No `typescript-lsp` edit (Markdown + probe-JS only; tsc UNVERIFIED per §6); `knip`/`depcheck` not named by the brief, not run.

— Reported by: vantrilex-typescript, b0914-build · 2026-10-29 (UTC) · evidence only; ruling belongs to the LEADER.

Ponytail: FULL — probe self-test exit 0 twice digest-identical (4/4) plus node --check exit 0 with outputs quoted; FLOOR held (trust-boundary validation, recall-write gate, absorbed-failure ledger) and CEILING held (three files only, no abstraction, no option nobody asked for).
