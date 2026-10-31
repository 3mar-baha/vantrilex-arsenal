# b0932-build — LD-32 gated self-improvement build ledger

Doctrine: FULL
Seat: b0932-build (wave 1 of 10, lane build-release AUTO-0.9-FULL 0.9.32, BLAZAR seat). Owner: vantrilex-typescript.
Task-dispatcher: Scenario 1 NEW TASK (W0 branch verified). No Vanguard equip run from this worker seat — recorded, proceeding with directed node only.
D5 carried: owner overrides direct work but NEVER suppresses gate verdicts.
Precedence: V3 wins on any collision with memory; conflicts are FLAGGED, never resolved here.

## F1 branch and commit

- branch: wt/0.9.32-self-improvement
- parent: bfc9cf977cfcf5dcc7c5450b7455185de45cf425
- message: feat(0.9.32): LD-32 gated self-improvement discipline with shipped-baseline measure
- tip: observed post single-commit via git rev-parse wt/0.9.32-self-improvement and quoted in the dispatch report with its exit code. A committed file cannot embed its own commit hash, so no tip literal is pre-filled here. The report carries the observed tip.

## F2 count and file set

- git rev-list --count parent..branch: 1
- git diff-tree --no-commit-id --name-only -r branch lists exact-3 files:
- .opencode/audit/BUILD-0932/self-improvement-0932.md
- .opencode/audit/BUILD-0932/verify-self-improvement-0932.mjs
- .opencode/audit/BUILD-0932/b0932-build.md

## F3 bytes per file

- self-improvement-0932.md bytes=9974
- verify-self-improvement-0932.mjs bytes=4977
- b0932-build.md ledger-bytes: 5756

## F4 SHA-256 per file

- self-improvement-0932.md sha256=4993342e6039bdc6749fc44709edeb4f8a95e4db2581701eb94c82e704c85b41
- verify-self-improvement-0932.mjs sha256=0c7f3cd5e2ea270fe6e3ca104375706ebbb14cfc9f2818781297c8b852e1dcdc
- b0932-build.md ledger-sha256: 0435bd162cc18da0347337b9cf43ff504c2a22f99665c86e90c549cd33362c04
- Recipe: SHA-256 over the ledger file bytes with the ledger-sha256 value blanked, meaning the line reads exactly `b0932-build.md ledger-sha256:` with no value. Verification blanks that line the same way and re-hashes. The filled value is quoted in the dispatch report, never pre-filled here beyond the recipe.

## F5 node syntax gate

- node --check .opencode/audit/BUILD-0932/verify-self-improvement-0932.mjs exit 0.

## F6 self-test runs gate (twice, identical digest)

- run 1: node .opencode/audit/BUILD-0932/verify-self-improvement-0932.mjs exit 0 with PROCEED digest=4993342e6039bdc6749fc44709edeb4f8a95e4db2581701eb94c82e704c85b41.
- run 2: node .opencode/audit/BUILD-0932/verify-self-improvement-0932.mjs exit 0 with PROCEED digest=4993342e6039bdc6749fc44709edeb4f8a95e4db2581701eb94c82e704c85b41.
- The digest equals the spec file SHA-256 in F4. Stable across two runs.
- Probes proven on committed bytes: (a) unmeasured proposal REFUSED, checkless proposal REFUSED, measured proposal ACCEPTED; (b) only the gate-passed evidenced candidate accumulates; (c) budget 2 over C3/other/C1/C2 checks C1 then C2, other deferred by default-deny; (d) frame adoption attempt returns HELD-RESERVED.

## F7 tag absent and local only

- git rev-parse --verify refs/tags/v0.9.32 exits 128 with Needed a single revision, absent local.
- git ls-remote origin refs/tags/v0.9.32 returns empty, absent remote.
- No push, no merge, no tag, no publish by this seat.

## F8 HEAD unmoved and zero mutations beyond the commit

- Work executed in a linked worktree of wt/0.9.32-self-improvement; primary checkout HEAD 2a78995b88f9d0f5b89564397add338794b60c5f before and after. Unmoved.
- Local main 03c077fa117dd1128527c982f7ef92cdc6639a14 before and after. Untouched.
- AGENT.md, WORKFLOW.md, README.md, README.ar.md, and r0932-readme-draft.md untouched (no such readme draft path written by this seat). CHANGELOG.md untouched under the exact-3 scope.
- Zero .ts files touched by this change, so tsc --noEmit has no target here and is not applicable. The .mjs self-test is gated by node --check in F5.
- The single commit is the only mutation.

## F9 FBLD-32 carried verbatim (FLAGGED — never resolved)

- FBLD-32 — Slot 0.9.32 — Conflict: method reuse versus frame adoption without a new owner decision — Fallback: methods operate early in harvest plus overlays plus check mechanism; frame waits for explicit owner decision — Matches LD-32 — Status FLAGGED, never resolved.
- Source: .opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:44. LD-32 line: .opencode/audit/FULL-REPORT-REPLAN/latest-draft-2026-10-27.md:68.

## F10 open questions carried OPEN per reserve (V3:6488-6490 — never invented)

- class-value-measure: OPEN. How a recurring task class's value is measured, to earn check budget before others.
- lesson-distillation-bound: OPEN. How the lesson is distilled from a check result without turning into a general rule without evidence.
- Source: AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:6488-6490. Exit criteria V3:6484-6487 carried as to-define in the spec, NOT decided here. Binding constraint V3:6439-6442 carried in the spec, never re-derived.

## F11 seat notes

- Zero installs. Node 25 only, zero dependencies, no install command invented or run (null plus unverified where unproven — nothing here needed proving: no install surface exists in any of the three files).
- Spec carries LD-32 honestly: propose/evaluate/synthesize measured against the shipped baseline; gate-survivor-only accumulation with no change without evidence; governed C1-C3 check budget with classes named and no check for every task by default; frame re-evaluation RESERVED for this slot's design time with the reservation recorded, never adopted, auto-adoption refused by name.
- V3 wins on any collision with memory; conflicts FLAGGED never resolved here.

Ponytail: FULL — one commit with exact-3 files, node --check exit 0, self-test exit 0 twice with identical digest, zero installs.
