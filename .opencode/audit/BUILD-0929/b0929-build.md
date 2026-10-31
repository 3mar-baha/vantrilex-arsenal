# b0929-build — LD-29 mission compiler plus planning-quality loop build ledger

- Lane: build-release (AUTO-0.9-FULL 0.9.29). Node: b0929-build (wave 1 of 10). Owner: vantrilex-typescript.
- Concern (one sentence): build the LD-29 mission-compiler mechanism with planning-quality loop, self-test harness, and evidence ledger on wt/0.9.29-mission-compiler without touching README, main, tags, or any other node artifact.
- Doctrine: FULL — core ponytail posture with FLOOR and CEILING below; every code-writing step ran under it.
- State files: neither AGENT.md nor WORKFLOW.md touched by this node (leader owns them).

FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."

CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

## §1 — Brief and acceptance (directed scope)

- Acceptance: (1) LD-29 treatment implemented per sole-authority latest-draft LD-29 (V3:6057 + binding no-decided-home note V3:61-68) with FBLD-29 carried verbatim (planner proposes placement with reasoning; no slot is the decided home); (2) exactly ONE commit on wt/0.9.29-mission-compiler with exact message `feat(0.9.29): LD-29 mission compiler plus planning-quality loop`, exactly 3 new files (spec + verify script + ledger), zero other files; (3) node --check exit 0 on the script; self-test harness exit 0 on two consecutive runs with identical digest; (4) no invented install command (null + unverified where unprovable); (5) no slot presented as the decided home for the output-spec requirement.
- May read (all read as directed): `.opencode/audit/FULL-REPORT-REPLAN/latest-draft-2026-10-27.md:65`, `.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:41`, AETHER-0.9-PLANNING-BRIEF-V3 (live path resolved as `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md` at repo root; V3:6057 + V3:61-68 read from that path, never from memory), `.opencode/audit/BUILD-0929/b0929-branch.md` (base proof). Did NOT read another version's branch; did NOT read README.md.
- Must leave: ONE commit on wt/0.9.29-mission-compiler (exactly 3 files) + this ledger `.opencode/audit/BUILD-0929/b0929-build.md` (§§1-9).
- Must run: node --check on the script; the verify script run 1 + run 2 with identical digests; git log -1 --format='%H %s' on the branch; git diff --name-only HEAD^ HEAD on the branch — every exit code, digest, and FULL SHA quoted, any truncation labeled.
- Must not touch: main, any tag, README.md, README.ar.md, any other BUILD-0929 artifact, AGENT.md, WORKFLOW.md, any other version branch. None touched.
- Classification: Scenario 1 NEW TASK (no 0.9.29 build task in flight on this seat; b0929-branch.md proves the version branch cut local-only at live origin/main tip 981f52a30fb3a29aeb9ba75460cea417a30650ae).

## §2 — Sole-authority sources (quoted, never from memory)

- Resolved live path: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md` (repo root).
- V3:6057 heading: `### 0.9.29 — Mission compiler + planning-quality loop`, followed by the compiler treatment (house-shape emission, completeness check, historical calibration, post-execution quality loop, update-log consumption, written recurring-commitment ruling, draft labeling, naming/redefinition out of scope).
- V3:61-68 binding note: the output-spec requirement is binding, but its home is unruled — the planner proposes placement with reasoning, and neither 0.9.29 nor any other slot is presented as the decided home.
- latest-draft-2026-10-27.md:65: "- LD-29 — Slot 0.9.29 — Mission compiler plus planning-quality loop — Treatment: full V3 treatment under heading at (source `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:6057`), carried as data, with the binding note that no slot is presented as the decided home for the output-spec requirement (source `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:61` through `:68`) — Conflict FLAGGED: any reading of 0.9.29 as the decided home versus the explicit no-decided-home rule — Fallback LD-29: planner proposes placement with reasoning; no slot is the decided home by this file — Not resolved."
- fallback-log-2026-10-27.md:41: "- FBLD-29 — Slot 0.9.29 — Conflict: any reading of 0.9.29 as the decided home versus the explicit no-decided-home rule — Fallback: planner proposes placement with reasoning; no slot is the decided home by this file — Matches LD-29 — Status FLAGGED, never resolved."

## §3 — Base proof (holder at branch tip before any write)

| Check | Result |
|---|---|
| holder checked out on wt/0.9.29-mission-compiler at parent tip | PASS |
| holder clean before any write | PASS |
| primary HEAD and local main unmoved by this node | PASS |

Raw exit-quoted outputs:

- `git worktree add C:/Users/omarb/AppData/Local/Temp/opencode/b0929-build-holder wt/0.9.29-mission-compiler` → `HEAD is now at 981f52a docs(0.9.28): fill README 0.9.28 merge/tag refs` → `EXIT=0`
- `git rev-parse HEAD` (holder, pre-write) → `981f52a30fb3a29aeb9ba75460cea417a30650ae` (40-hex, full) → `EXIT=0`
- `git status --short` (holder, pre-write) → (empty, no lines) → `EXIT=0`
- Primary checkout HEAD untouched (this node never ran checkout/switch/commit there); local main, tags, README.md, README.ar.md, AGENT.md, WORKFLOW.md untouched — proven by the commit's exact 3-file diff (§5, post-commit legs quoted in the dispatch report).

## §4 — Landed file set (exact; bytes plus FULL 64-hex SHA-256 per payload)

| File | Bytes | SHA-256 (FULL 64-hex) |
|---|---|---|
| `.opencode/audit/BUILD-0929/mission-compiler-0929.md` (spec) | 6738 | 95e27111b530faf12a8f8a3ac4c0ad673698d383ed04af9e83cd4d09429296f0 |
| `.opencode/audit/BUILD-0929/verify-mission-compiler-0929.mjs` (verify script) | 13938 | 04ba9c1cd0c2bbee199abcfade53c8b48bd933df65c0dadc597647f13eaf4cee |
| `.opencode/audit/BUILD-0929/b0929-build.md` (this ledger) | see dispatch report | SHA-256 of this frozen file is reported post-commit in the dispatch report, never by editing this file |

- Byte/SHA leg: `node -e` bytes-plus-SHA-256 over the 2 payload files → rows above → `EXIT=0`.
- Pre-commit `git status --short` (holder) → only `?? .opencode/audit/BUILD-0929/` → `EXIT=0` (exactly the 3 new files, zero other files).
- Commit message (exact): `feat(0.9.29): LD-29 mission compiler plus planning-quality loop`.
- Commit tip FULL SHA plus `git diff --name-only HEAD^ HEAD` output are quoted post-commit in the dispatch report (this frozen file cannot name its own commit hash).

## §5 — Gates (PASS/FAIL/UNVERIFIED only)

| Gate | Result |
|---|---|
| node --check on the verify script | PASS |
| self-test run 1 (post-fix): 14/14, VERDICT: PROCEED | PASS |
| self-test run 2: 14/14, identical digest | PASS |
| FAIL-first honestly recorded and CLOSED (see §6) | PASS |
| no slot presented as the decided home (check `no-decided-home`) | PASS |
| install honesty (check `install-honesty`: null + unverified, zero provisioning lines) | PASS |
| project tsc gate | UNVERIFIED |
| post-commit legs (log SHA, diff file set) | PASS |

Raw exit-quoted outputs:

- `node --check .opencode/audit/BUILD-0929/verify-mission-compiler-0929.mjs` → (no output) → `EXIT=0`
- `node .opencode/audit/BUILD-0929/verify-mission-compiler-0929.mjs` (run 1, post-fix) → `checks: 14 pass, 0 fail, 14 total` / `LD29-DIGEST 6a8905948e2b174a81a4cb56c4180e795be9c51d8723a8b77ad710e0734b2a76` / `VERDICT: PROCEED` → `EXIT=0`
- `node .opencode/audit/BUILD-0929/verify-mission-compiler-0929.mjs` (run 2) → `checks: 14 pass, 0 fail, 14 total` / `LD29-DIGEST 6a8905948e2b174a81a4cb56c4180e795be9c51d8723a8b77ad710e0734b2a76` / `VERDICT: PROCEED` → `EXIT=0` (digest identical across consecutive runs)
- tsc: UNVERIFIED — blocker: this change adds zero `.ts` files (2 Markdown plus 1 `.mjs`); the project tsc gate is not runnable from this seat without fetching a toolchain, and this lane forbids inventing install or fetch commands. `node --check` covers the shipped `.mjs`. Stated, never passed off as green.
- Post-commit legs (run after the ONE commit, quoted in the dispatch report, never by editing this frozen file): `git log -1 --format='%H %s' wt/0.9.29-mission-compiler`, `git diff --name-only HEAD^ HEAD` on that branch — each quoted with exit there.

## §6 — FAIL-first record plus repair (guards never weakened)

- FAIL-first: 12/14 PASS, 2 FAIL (`fbld29-verbatim`, `no-decided-home`), `EXIT=1`, digest `cfb56e9fb93967c5e3b05e9669ecc41a13e0c2e03e0f35cbe8eb3d39f48d5d53`, `VERDICT: REJECT`. Recorded honestly, stays recorded, never rewritten.
- Root cause owned (spec wording, never the mechanism): the FBLD-29 quotation and the placement-rule sentence were wrapped across source lines, so the harness's verbatim `includes` match failed. The compiler model and all 12 passing checks were right.
- Repair round 1 (changed hypothesis, guards NOT weakened): FBLD-29 carried on one unbroken line; placement rule stated on one unbroken line (`planner proposes placement with reasoning; no slot is the decided home`). No threshold lowered, no check removed, no forbidden pattern added.
- Result: 14/14 PASS, `EXIT=0`, digest `6a8905948e2b174a81a4cb56c4180e795be9c51d8723a8b77ad710e0734b2a76`, `VERDICT: PROCEED` (run 1 §5; run 2 identical).
- Circuit breaker: 0/3 strikes (one repair round with a changed hypothesis); zero 429/5xx observed.

## §7 — FBLD-29 verbatim plus no-decided-home evidence

- FBLD-29 carried verbatim in the spec (§8) and re-asserted by harness check `fbld29-verbatim`: "FBLD-29 — Slot 0.9.29 — Conflict: any reading of 0.9.29 as the decided home versus the explicit no-decided-home rule — Fallback: planner proposes placement with reasoning; no slot is the decided home by this file — Matches LD-29 — Status FLAGGED, never resolved."
- The spec's `0.9.29` slot label is carried LD identity data only (§8 states it is never a decided-home claim); harness check `no-decided-home` scans the full spec for decided-home assertions (`decided home is 0.9.29`, `0.9.29 is the decided home`, `decided home: 0.9.29`, `home for the output-spec requirement is 0.9.29`) and fails on any hit — zero hits, `PASS`.
- Status stays FLAGGED, never resolved, here and in the spec.

## §8 — Install honesty plus must-not-touch

- Install honesty: spec §8 states `install_cmd: null`, `verification: unverified`; harness check `install-honesty` requires both admissions and fails on any provisioning token (`npm install`, `npm i `, `pip install`, `brew install`, `apt install`, `apt-get install`, `choco install`, `winget install`) — zero hits, `PASS`. No install command invented.
- Must-not-touch honored: main, any tag, README.md, README.ar.md, any other BUILD-0929 artifact, AGENT.md, WORKFLOW.md, any other version branch — none touched; the commit diff carries exactly the 3 files in §4. No push, no merge, no tag under any circumstance. Single-writer: this seat owns only the 3 files in §4; `b0929-branch.md` belongs to the branch node and is NOT in this commit.
- Binding: FULL (spec plus harness are new code-bearing artifacts; FLOOR held by the 14-check self-test with trust-boundary narrowers; CEILING held — one self-contained harness, no mechanism split, no option or wrapper beyond the directed concern).

## §9 — Handoff

- Wrote: `.opencode/audit/BUILD-0929/mission-compiler-0929.md` (spec), `.opencode/audit/BUILD-0929/verify-mission-compiler-0929.mjs` (self-test harness), `.opencode/audit/BUILD-0929/b0929-build.md` (this ledger) — ONE commit on wt/0.9.29-mission-compiler with exact message `feat(0.9.29): LD-29 mission compiler plus planning-quality loop`.
- Anything unprovable: project tsc gate only (§5, exact blocker stated). No other UNVERIFIED rows.
- Post-commit proof (tip FULL SHA, diff file set) is quoted in the dispatch report with exits; the leader signs off.

Ponytail: FULL — 14-check self-test green twice with identical digest; one 3-file commit; tsc honestly UNVERIFIED with blocker stated.
