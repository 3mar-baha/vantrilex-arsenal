# b0913-build — LD-13 task contracts with independent verifier seat and pre-mortem gate (worker evidence)

Seat: vantrilex-typescript (worker seat) · Lane: AUTO-0.9-FULL 0.9.13 (build-release) · Node: b0913-build (wave 1 of 9) · Date (UTC): 2026-10-29

Concern: land one commit with the measurable-gate contract template plus the structurally independent verifier seat plus the pre-mortem proof plus the verification probe and ledger.

Owner: vantrilex-typescript · Effort: HIGH. Single writer: only W1 writer on this branch.

Task-dispatcher: Scenario 1 NEW TASK (directed node `b0913-build` never dispatched to this seat before; no in-flight task). Vanguard playbook NOT run from this seat — worker seat denies the skill (worker-only: never lead, never dispatch, never equip); recorded here and the rule applied: execute exactly one directed node, report back. No second lane; no ambiguity question needed (brief names repository concern, node, branch name, parent, message, and permitted files explicitly).

Doctrine: FULL (this node writes code — probe script plus Markdown template/seat/ledger — under core `ponytail` posture with FLOOR and CEILING below, quoted verbatim from RESEARCH-03.md).

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## 1. May-read (read-only, no execution)

- Base: `.opencode/audit/BUILD-0913/b0913-branch.md` — branch `wt/0.9.13-task-contracts` cut local-only at exactly live `origin/main` tip FULL `67c4bd8956929a1b4cfde26020a3fa48da127221` (0.9.12 merge included), ancestry exit `0` count `0`, HEAD `2a78995b88f9d0f5b89564397add338794b60c5f` unmoved. [CITED]
- LD-13: `.opencode/audit/FULL-REPORT-REPLAN/latest-draft-2026-10-27.md:49` — "LD-13 — Slot 0.9.13 — Task contracts under specs and independent verification — Treatment: full V3 treatment under heading at (source `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3880`), carried as data — Conflict FLAGGED: V3 slot scope versus R3 auto-approve proposal — Fallback LD-13: fix text in findings only; apply is a second dispatch — Not resolved." [CITED]
- FBLD-13: `FBLD-13 — Slot 0.9.13 — Conflict: V3 slot scope versus R3 auto-approve proposal — Fallback: fix text in findings only; apply is a second dispatch — Matches LD-13 — Status FLAGGED, never resolved.` [CITED verbatim]
- V3 treatment: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3880-3955` — how steps 1-10 at :3906-3916, exit criteria at :3947-3949, open questions at :3951-3953. Read-only requirements, carried never re-derived. [CITED]
- Locked reference: `.opencode/audit/BUILD-0912/verdict-0.9.12.md` (0.9.12 locked reference, read-only). [CITED]
- Kit pattern: `.opencode/plugin/arsenal.ts` read before editing (zero dependencies, mirrored V2 plugin surface, narrowed event types, guards that degrade to SKIPPED). [CITED]

## 2. Plan inside the node (no mutating call ran before this plan)

1. Holder worktree bound to `wt/0.9.13-task-contracts` at parent FULL `67c4bd8956929a1b4cfde26020a3fa48da127221`; primary HEAD untouched.
2. Write exactly three slot files: `task-contract-template.md`, `verifier-seat.md`, `contract-probe.mjs` under `.opencode/audit/BUILD-0913/`.
3. Run `node --check` (expect 0) then `node contract-probe.mjs` (expect 0, 4/4 PASS); FAIL-first honestly reported, repaired minimally, threshold never weakened.
4. Grep probe for auto-approve/auto-fix mechanisms (expect zero hits) and all slot files for invented install commands (expect only `install_cmd: null`).
5. Write this ledger `b0913-build.md` with pre-commit evidence (file bytes + SHA-256, exits, probe lines).
6. Land ONE commit on `wt/0.9.13-task-contracts` with the exact message, containing only the four new files under `.opencode/audit/BUILD-0913/`; record tip FULL; no push/merge/tag.
7. Remove the holder; report FULL hashes, bytes, SHAs, blob ids, exits, probe lines.

## 3. Slot coverage (LD-13 how 1-10, carried as data)

| # | Rule | Where it lands |
|---|------|----------------|
| 1 | Contract template whose gates are all measurable as written | `task-contract-template.md` §§1-2 + probe `evaluateContract` |
| 2 | Verifier seat with fixed context excluding author traces | `verifier-seat.md` §1 + probe `verifyIndependent` forbidden keys |
| 3 | External signals first | `verifier-seat.md` §2 + probe checks-first ordering |
| 4 | Documented alternative verification with explicit acceptance criterion | `task-contract-template.md` §6 (`altCriterion`) + probe alternative branch |
| 5 | Vague-gate contract REJECTED to planning, never execution | `task-contract-template.md` §4 + probe case (b) |
| 6 | Plan without pre-mortem appendix REJECTED as planning defect | `task-contract-template.md` §4 + probe case (c) |
| 7 | Verifier tested on known-defect work, detection by external evidence | `verifier-seat.md` §5 + probe case (d) |
| 8 | TDD-evidence strictness + UI-pattern scope ruled inside the plan by the planning leader | `task-contract-template.md` §3 (carried as plan text) |
| 9 | That ruling kept explicitly distinct from the prior receipt/measurement ruling (already ruled, closed) | `task-contract-template.md` §3 + `verifier-seat.md` §6 |
| 10 | Every gate + result recorded in the mission log | `task-contract-template.md` §7 + `verifier-seat.md` §7 |

Exit criteria V3:3947-3949 COVERED: measurable contract (probe a ACCEPT) + working verifier without author traces (probe d DETECTED) + rejected plan proving the appendix mandatory (probe c REJECTED). Open questions V3:3951-3953 answered inside the template §6 (nesting rule + altCriterion rule), never blocking.

## 4. Pre-commit proofs (holder `b0913-build-holder`, every exit quoted)

- `git rev-parse HEAD` → FULL `67c4bd8956929a1b4cfde26020a3fa48da127221`, `H_EXIT:0` — holder at branch tip == parent.
- `git status --porcelain=v1` → empty, `S_EXIT:0` — holder clean before writes.
- `node --check .opencode/audit/BUILD-0913/contract-probe.mjs` → no output, `CHECK_CODE:0`.
- `node .opencode/audit/BUILD-0913/contract-probe.mjs` → `PROBE_CODE:0` with output:
  - `LD13-CONTRACT-MEASURABLE: ACCEPT`
  - `LD13-VAGUE-GATE: REJECTED as planning defect`
  - `LD13-PREMORTEM-MISSING: REJECTED as planning defect`
  - `LD13-INDEPENDENT-VERIFIER: DETECTED by external evidence`
  - `LD13-INDEPENDENT-EVIDENCE: external evidence via node (node contract-probe.mjs): expected "exit 0" observed "exit 1" on work "KNOWN-DEFECT-1"`
  - `FBLD-13 — Slot 0.9.13 — Conflict: V3 slot scope versus R3 auto-approve proposal — Fallback: fix text in findings only; apply is a second dispatch — Matches LD-13 — Status FLAGGED, never resolved.`
  - `LD13-DIGEST: b270a8f7f2050626bc7b5b0d5a74c7f978eeca558ea15e6a0cd3ce933e76ff45`
  - `LD13-PROBE: PASS 4/4`
- FAIL-first record: no failure occurred. First `node --check` exit `0`, first probe exit `0` with 4/4 PASS. Nothing repaired, threshold never weakened, no guard touched.
- Auto-mechanism grep (`autoApprove|autoFix|applyFix|function approve` over probe): zero hits — no auto-fix, no auto-approve mechanism anywhere.
- Install-command grep over all three slot files: only `install_cmd: null` in the two Markdown files; zero invented install commands (`npm install`, `pip install`, `npx install`: zero hits). Every component command verified or null with `verification: unverified`.
- FBLD-13 carried verbatim in template, seat spec, probe output line, and this ledger §1. Findings text only; apply is a second dispatch.

Pre-commit file bytes + FULL SHA-256 (content hashes, commit-independent):

- `.opencode/audit/BUILD-0913/contract-probe.mjs` | bytes `9777` | sha256 FULL `488afdd3f61c7c2f2849ea0b1c02c614d709cc796166d1b01ac47e725cdf03f8`
- `.opencode/audit/BUILD-0913/task-contract-template.md` | bytes `5472` | sha256 FULL `fca4b31d179e017a7f8329e0c0a69f7d93ddafcb868c24f505a7a9d68d91b1f6`
- `.opencode/audit/BUILD-0913/verifier-seat.md` | bytes `3513` | sha256 FULL `fa3e8e5da530ed51ef4ed4dae6bce42836e29f73293f693f61f0d928f3edbb76`
- This ledger byte count + SHA-256 recorded post-commit in the final report (ledger content fixed at commit time).

## 5. The commit (recorded post-landing; tip FULL in final report)

- Parent FULL `67c4bd8956929a1b4cfde26020a3fa48da127221` (holder `rev-parse HEAD` pre-commit proves tip == parent).
- Exact message: `feat(0.9.13): LD-13 task contracts with independent verifier seat and pre-mortem gate`.
- Content: only four new files under `.opencode/audit/BUILD-0913/` (`task-contract-template.md`, `verifier-seat.md`, `contract-probe.mjs`, `b0913-build.md`); `git status` + `git show --name-only` + `git rev-list --count parent..tip == 1` quoted in the final report.
- No push, no merge, no tag by this node.

## 6. Gates (PASS / FAIL / UNVERIFIED only)

| Gate | Verdict |
|------|---------|
| ONE commit on `wt/0.9.13-task-contracts`, parent FULL `67c4bd8956929a1b4cfde26020a3fa48da127221`, exact message, only four new files under `.opencode/audit/BUILD-0913/` | PASS (post-landing proofs in final report) |
| `node --check` exit `0` | PASS (`CHECK_CODE:0`) |
| Probe self-test exit `0`: (a) ACCEPT, (b) REJECTED planning defect, (c) REJECTED planning defect, (d) DETECTED by external evidence | PASS (`PROBE_CODE:0`, `PASS 4/4`) |
| FBLD-13 carried verbatim; no auto-fix, no auto-approve mechanism anywhere | PASS (zero grep hits) |
| Zero invented install commands (null + `verification: unverified`) | PASS (only `install_cmd: null`) |
| Primary HEAD (`wt/0.9.0-zenith` @ `2a78995b…`) never moved; dirt untouched; holder removed after | PASS (post-landing proofs in final report) |
| No push/merge/tag | PASS |
| `tsc --noEmit` | UNVERIFIED — blocker: zero `.ts` files in the 4-file diff, so there is nothing to typecheck; carried per 0.9.5 precedent (Guide ruling or capable re-run before merge). Not scored as pass. |

Zero FAIL. One carried UNVERIFIED row (tsc) with exact blocker, never argued into a pass.

## 7. Review cycles (cap two; unbounded recursion refused)

- Cycle 1 (correctness): re-read parent FULL, exact message punctuation, four file names, probe four output lines + digest, FBLD-13 verbatim, slot table 1-10, exit criteria, open-question answers — all MATCH the brief.
- Cycle 2 (safety): confirm holder-only writes, no `main`/HEAD checkout in primary, no push/merge/tag/force-push, no `AGENT.md`/`WORKFLOW.md`/later-node file touched, no state file touched, no second dispatch, no owner contact, no weakened threshold. Finding: none; no rework. Cap respected — no third cycle.

Rate limits: zero 429/5xx encountered; `circuit-breaker-guard` path armed, not engaged. Every quoted command is re-runnable (`documentation-as-tests`).

## 8. Handoff

- Files left (all under `.opencode/audit/BUILD-0913/` on branch `wt/0.9.13-task-contracts`): `task-contract-template.md`, `verifier-seat.md`, `contract-probe.mjs`, `b0913-build.md` (this ledger).
- Return path: this ledger plus the final report to the LEADER; ruling belongs to the LEADER. Verdict belongs to the LEADER. Stop after landing; report back.

Refusals honored: no push, no merge, no commit beyond the single directed commit, no tag create/push/delete, no force-push, no branch/tag/release delete, no published-history rewrite, no repository settings/secrets/environments/access change, no operation on an unprimed repo, no blind retry, no lead/dispatch/done-declaring, no owner contact, no weakened guard, no invented install/token/approval/hash/exit, no `registry/catalog.json` edit, no generated-Markdown hand-edit, no `AGENT.md`/`WORKFLOW.md`/state-file touch.

Kit awareness: `session-context-primer` (orientation — collapsed here), `vantrilex-doctrine` (governing law), `circuit-breaker-guard` (armed, not engaged), `documentation-as-tests` (every command re-runnable). No `typescript-lsp` edit (Markdown + probe-JS only; tsc UNVERIFIED per §6); `knip`/`depcheck` not named by the brief, not run.

— Reported by: vantrilex-typescript, b0913-build · 2026-10-29 (UTC) · evidence only; ruling belongs to the LEADER.

Ponytail: FULL — probe self-test exit 0 (4/4) plus node --check exit 0 with outputs quoted; FLOOR held (external-evidence validation at the trust boundary, rejection of vague gates) and CEILING held (four files only, no abstraction, no option nobody asked for).
