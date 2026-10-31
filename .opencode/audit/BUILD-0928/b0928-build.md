# b0928-build — LD-28 gap register plus continuous reconnaissance (wave 1 of 9)

Lane: build-release (AUTO-0.9-FULL 0.9.28, twenty-eighth of 33; this dispatch covers 0.9.28 ONLY, never 0.9.27 or 0.9.29)
Node: b0928-build (wave 1 of 9, parallel with r0928-readme-draft; disjoint write targets — this seat owns ONLY the three files below)
Owner: vantrilex-typescript (worker-only; never lead, never dispatch, never declare done)
Doctrine: FULL
Date (UTC): 2026-10-31. No model pin. State files: neither (leader-owned; this seat writes no state file).
Task-dispatcher: Scenario 1 NEW TASK (no 0.9.28 build in flight in this seat; no Vanguard equip run from worker seat — seat denies the skill, recorded per rule; executed the directed concern only).
May-read: live branch tip `edda4747c58f634d5160abb2877c8baba5b8ebcc` (base only, re-proven §S1, never assumed); V3 LD-28 treatment lines 5902-6055 (read at base in the holder, carried as data); LD-28 slot line 64 + FBLD-28 line 40 (parallel-lane paths, absent from this commit's tree per `git cat-file -e HEAD:<path>` fail — quoted as text in spec §9 with provenance, never linked as resolvable evidence, never resolved); `.opencode/audit/BUILD-0928/b0928-branch.md` (base refs only, read-only).
Acceptance: all hold per sole-authority V3:5902-6055 — (1) gap-register spec doc covering the V3 treatment: unified live register (platform/defect/field/failure unified with origin preserved), per-entry evidence-link requirement with technical refuse-on-missing-evidence, declared limited first watch-list with per-source budget+schedule, periodic gap report ordered by planning-readiness, compiler feed proven by a real task, regression memory with close-by-evidence (never delete), budget/schedule-overrun-as-event, conflicting-signals-recorded-conflicting (§S4, spec §§1-5); (2) verify harness `scripts/verify-gap-register.mjs` (`node --check` exit 0; run exit 0 PROCEED 22/22: every entry has reachable evidence link, every watched source has budget+schedule, one real-task feed proof, one closed-entry-with-evidence proof, one conflicting-pair-recorded proof, zero entry-without-evidence) (§S3-G1/G2); (3) this ledger with FULL SHA-256 per file + gate outputs (§S2/S3); LD-28 exit criteria V3:6020-6025 + V3:6045-6054 all COVERED with per-criterion evidence (spec §6); all 19 open questions V3:6026-6044 DECIDED inside W1 with evidence quoted (spec §7), never left open, never invented; conflict FLAGGED vs R2 deepdive zero-match scope with fallback FBLD-28 carried verbatim (spec §9, never widened, never resolved); (4) no invented installs (spec §10: null + unverified, zero registry/catalog/sidecar writes); (5) `tsc` N/A stated with reason + `node --check` exit 0 quoted (§S3-G4); no merge/tag/publish/push; primary HEAD/main unmoved (§S1, §S7).

## S1. Base proof + holder routing (primary HEAD and local main never moved, dirt untouched, no push)

- `git rev-parse wt/0.9.28-gap-register` (pre-work) — EXIT:0 — FULL `edda4747c58f634d5160abb2877c8baba5b8ebcc` (directed base = directed parent, never assumed).
- Holder: attached worktree at `C:/Users/omarb/AppData/Local/Temp/opencode/b0928-build-holder` created with `git worktree add <holder> wt/0.9.28-gap-register` — EXIT:0 — holder HEAD == base EXACT; primary checkout never entered here, no commit/push/merge/tag beyond the one directed commit, primary dirt untouched.
- Post-commit proofs (quoted in handoff): `git log -1 --format=%H/%P/%s` tip/parent/exact-message, `git status --porcelain=v1` (holder, pre-commit: exactly the 3 new files), `git show --stat HEAD` (exactly 3 files), primary `git rev-parse HEAD` + `refs/heads/main` unmoved, `git tag --list v0.9.28` empty, no push.

## S2. Payload inventory (exactly 3 NEW files, nothing else)

| File (in commit) | Bytes | SHA-256 |
|---|---|---|
| `.opencode/gaps/gap-register.md` | 22783 | `97020FDFCB221FC7B3307EC05982C88212DC3652C7D1F723999696CB52132F24` |
| `scripts/verify-gap-register.mjs` | 13319 | `34291AF7F0FD66B8C3F4D8824623941356B888E46E438BAE9D9FB6E6574C346D` |
| `.opencode/audit/BUILD-0928/b0928-build.md` (this ledger) | <ledger bytes + sha quoted in handoff; computed pre-commit, post-commit blob identity via `hash-object == HEAD:<path>`> | — |

`any` count: zero — no TypeScript file was added or touched (both payload files are `.md`/`.mjs`; the single prose `any` in a harness comment is not a type annotation), so there is nothing to justify and nothing to escalate (`tsc` N/A per §S3-G4, stated, never claimed as a pass).

## S3. Gate outputs (each run separately, exits quoted individually, no `&&` chains)

FAIL-first (honestly recorded; repair rounds 1-2 of max 2, guards never weakened):

Round 1 — 16 pass, 6 fail, VERDICT: REJECT (exit 1). Root causes, both on the
harness/spec seam, spec intent right: (1) `section X-02 absent` (5 knock-on
fails) — X-01/X-02 shared one `### X-01 / X-02` heading so the per-id section
split found no X-02; (2) `C-01 missing expected link ...:5983` — the deciding
close-rule line was cited bare (`V3:5983-5984`) instead of as an anchored
backticked link. Repaired by giving X-01 and X-02 their own `###` subsections
(spec) and anchoring the V3:5983 link in C-01 (spec) plus dropping a noisy
sub-count from one harness detail line (output only, semantics untouched).

Round 2 — 20 pass, 2 fail, VERDICT: REJECT (exit 1). One defect left: `B-01
origin not on the row` — the B-01 row carried `linked-prior` but not the
literal `origin:` token the gate requires. Repaired by adding
`origin: failure` to the B-01 row (spec, one line). No third round needed.

Re-run after round 2: 22/22 PROCEED (§S3-G2). Repair rounds consumed: 2 of max 2.

### G1. `node --check scripts/verify-gap-register.mjs` — EXIT:0 (no output; syntax clean)

### G2. `node scripts/verify-gap-register.mjs` (run) — EXIT:0 PROCEED, 22/22

```text
[gap-register] PASS doc-present: spec readable, register section present
[gap-register] PASS entry-evidence-present: 10/10 entries carry their expected links
[gap-register] PASS zero-entry-without-evidence: 0 entries without evidence
[gap-register] PASS evidence-reachable: 13 links resolve file+line
[gap-register] PASS evidence-anchored: 15 anchored path:line links, no general-only evidence admits an entry
[gap-register] PASS refuse-empty-evidence: empty evidence refused with record
[gap-register] PASS refuse-null-evidence: null evidence refused with record
[gap-register] PASS watchlist-limited: 4/4 sources, declared and limited
[gap-register] PASS source-budget-schedule: 4/4 sources carry budget+schedule+state before watching
[gap-register] PASS report-ordered-by-readiness: R-01 READY-first, D-01 flagged NEEDS-SEARCH
[gap-register] PASS ready-item-sufficient: 3/3 READY items carry entry+evidence+scope+routine-plan
[gap-register] PASS planning-record-proves-routine: PR-01: 2 routine items planned from R-01 alone, 0 extra searches
[gap-register] PASS compiler-feed-real-task: T-01 plan: G-01+G-02 in, X-01 out
[gap-register] PASS closed-entry-with-evidence: C-01 CLOSED with close-evidence, row preserved (never deleted)
[gap-register] PASS partial-patch-reclassified: P-01 RECLASSIFIED to G-04, both rows kept
[gap-register] PASS conflicting-pair-recorded: X-01+X-02 both CONFLICTING, none resolved
[gap-register] PASS overrun-recorded-as-event: EV-01: S-02 overrun recorded as event, none silent
[gap-register] PASS regression-memory-linked: B-01 reaches prior break G-01 without old-log search
[gap-register] PASS register-searchable-alone: lookup from this register alone returns G-01+G-02
[gap-register] PASS origin-preserved: 10/10 rows carry platform/defect/field/failure origin
[gap-register] PASS second-report-abridged: cycle-2 report is R-01-C2 abridged-cross-reference, never a duplicate
[gap-register] PASS seed-passes-all-gates: entries+watch-list+report+feed+memory+overrun+conflict, 0 exemptions
[gap-register] checks: 22 pass, 0 fail, 22 total
[gap-register] digest: 5205637494562be94e19e4a9e1e8254709058e08c50600ba93e6e7ed7018fb49
[gap-register] VERDICT: PROCEED
```

Run + re-run output-identical: SHA-256 `67F7E9FFC0D24B02609B937E21C60D684B7E957FA910A06F1277F2159481415F` both runs (full stdout captured to files, hashed).

### G3. Negative control (harness fails closed, not vacuous) — EXIT:1 REJECT with doc moved aside, then restored

With `gap-register.md` moved out of the tree: every doc-dependent check FAILs
(`ENOENT`, head: `FAIL doc-present ... no such file or directory`), VERDICT:
REJECT, exit 1. After restore: EXIT:0 PROCEED, 22/22, output hash-identical to
run and re-run (`67F7E9FF…` all three captures).

### G4. `tsc --noEmit` — N/A, stated with reason (never claimed as a pass)

Zero `.ts` files added or touched on this node (payload is `.md` + `.mjs` +
this ledger); `tsc` has no binary on this seat (`Get-Command tsc` absent, and
the repo is dependency-free by design so no install was attempted); the
tsconfig-covered file `.opencode/plugin/arsenal.ts` is byte-identical to base
(holder `git status` shows no tracked modification, only the 3 new files), so
no type failure is introduced. Stated, never claimed as a pass.

### G5. `git status --porcelain=v1` (holder, pre-commit) — exactly the 3 new files

```text
?? .opencode/audit/BUILD-0928/
?? .opencode/gaps/
?? scripts/verify-gap-register.mjs
```

(`.opencode/audit/BUILD-0928/` holds only `b0928-build.md`; `.opencode/gaps/`
holds only `gap-register.md`; sibling `r0928-readme-draft.md` untouched —
no such path staged or written.)

### G6. `git log --oneline -1` + `git status --porcelain` on the branch (post-commit) — tip/parent/exact-message/count quoted in handoff

## S4. Exit-criteria coverage (all 16 V3 criteria COVERED; spec file:line + harness check:line)

First set V3:6020-6025 (spec §6, first list):

- V3:6020 (periodic report; routine items planned without extra search) — COVERED: spec §3 R-01 + PR-01 (`zero-extra-search`); harness `planning-record-proves-routine` (harness §`planning-record-proves-routine`).
- V3:6021 (every entry evidenced; none without) — COVERED: spec §1 six-part formula + technical `REFUSED-ENTRY-WITHOUT-EVIDENCE`; harness `entry-evidence-present` + `zero-entry-without-evidence` + `refuse-empty-evidence` + `refuse-null-evidence`.
- V3:6022 (no source without budget+schedule) — COVERED: spec §2 table; harness `source-budget-schedule` + `watchlist-limited`.
- V3:6023 (relevant entry enters its task plan, proven by check) — COVERED: spec §4 T-01 both directions; harness `compiler-feed-real-task`.
- V3:6024 (failure log unified; memory checkable entry-to-prior) — COVERED: spec §1 C-01 + B-01 and §5; harness `closed-entry-with-evidence` + `regression-memory-linked`.
- V3:6025 (overrun recorded as event, never silent) — COVERED: spec §1 EV-01; harness `overrun-recorded-as-event`.

Second set V3:6045-6054 (spec §6, second list):

- V3:6045 (a report plans routine items, planning record proves it) — COVERED: R-01 + PR-01; harness `planning-record-proves-routine`.
- V3:6046 (one real task with a relevant entry in its plan, proven by check) — COVERED: T-01; harness `compiler-feed-real-task` (in-scope in, out-of-scope out).
- V3:6047 (every evidence reachable from its entry; no general evidence) — COVERED: spec §8 anchored-link bar; harness `evidence-reachable` (13 live file+line resolves) + `evidence-anchored` (15 anchored links).
- V3:6048 (every source budgeted+scheduled before watching; none unbounded) — COVERED: spec §2; harness `source-budget-schedule` (4/4).
- V3:6049 (a closed entry preserved with close evidence; neither deleted nor open) — COVERED: C-01; harness `closed-entry-with-evidence`.
- V3:6050 (two conflicting signals recorded conflicting; no silent pick) — COVERED: X-01/X-02; harness `conflicting-pair-recorded` (both CONFLICTING, none RESOLVED).
- V3:6051 (register searchable alone; no old-log return) — COVERED: G-02 routine plan + spec §3; harness `register-searchable-alone`.
- V3:6052 (every overrun an event; none silent) — COVERED: EV-01; harness `overrun-recorded-as-event`.
- V3:6053 (memory checked: break linked to similar prior break, with evidence) — COVERED: B-01 → G-01 with two deciding lines; harness `regression-memory-linked`.
- V3:6054 (first watch-list declared and limited; every source has a known state) — COVERED: spec §2 four sources all `watching`; harness `watchlist-limited`.

## S5. Open-question dispositions (all 19 V3:6026-6044 DECIDED inside W1)

Decisions live in spec §7 with per-question evidence; each is enforced by the
named harness check (re-stated one line each):

- V3:6026 (budget + recalibration) — DECIDED: budgets fixed §2; recalibration is an EV-recorded event, never silent. Harness: `overrun-recorded-as-event`.
- V3:6027 (first-list membership) — DECIDED: exactly S-01..S-04; rest deferred to W2. Harness: `watchlist-limited`.
- V3:6028 (close mechanics) — DECIDED: append close-evidence, flip CLOSED, row stays (C-01). Harness: `closed-entry-with-evidence`.
- V3:6029 (report ordering; who decides ready) — DECIDED: readiness is an admission field; R-01 sorts READY-first, checkably. Harness: `report-ordered-by-readiness`.
- V3:6030 (convincing entry without evidence) — DECIDED: final refuse; no holding pen (a pen is a rumor shelf). Harness: `refuse-empty-evidence`.
- V3:6031 (measuring report fitness) — DECIDED: PR-01 counts items planned and extra searches (zero). Harness: `planning-record-proves-routine`.
- V3:6032 (conflicting signals) — DECIDED: record both CONFLICTING (X-01/X-02). Harness: `conflicting-pair-recorded`.
- V3:6033 (top-source boundaries) — DECIDED: top while its change can change planning; moves are evidenced entries, next cycle only. Evidence: §2 states; V3:5910 boundary.
- V3:6034 (origin at unification) — DECIDED: origin is a mandatory forever field. Harness: `origin-preserved`.
- V3:6035 (partial patch) — DECIDED: reclassify with pointer (P-01 → G-04). Harness: `partial-patch-reclassified`.
- V3:6036 (who decides planning entry for conflicts) — DECIDED: evidence decides; neither signal plans until a third evidence rules. Evidence: X-01/X-02; V3:5997.
- V3:6037 (sufficiency bar) — DECIDED: proving = resolves to the deciding line; indicating ≠ admission (§8). Harness: `evidence-reachable` + `evidence-anchored`.
- V3:6038 (repeat over-budget) — DECIDED: two consecutive EV overruns suspend to `suspended` pending owner recalibration. Evidence: §2 states + EV-01.
- V3:6039 (register review cadence) — DECIDED: the release lane reviews every cycle before R+1; ended entries close per V3:6028. Evidence: §5; C-01 worked example.
- V3:6040 (proving the report is planned from) — DECIDED: only the planning record proves it; testimony proves nothing. Harness: `planning-record-proves-routine`.
- V3:6041 (signal vs evidence) — DECIDED: box/harvest items are signals on admission; register evidence only when deciding a fact at a line. Evidence: F-01; §8.
- V3:6042 (routine-fit gap needing a non-routine call) — DECIDED: ships NEEDS-SEARCH with the call named (D-01). Evidence: D-01; §3 item 4.
- V3:6043 (second report same vs abridged) — DECIDED: `R-01-C2` abridged-cross-reference + delta. Harness: `second-report-abridged`.
- V3:6044 (origin technically; unbreakable move) — DECIDED: origin travels in the row; links are live-resolved `path:line` anchors that fail loudly on move. Harness: `origin-preserved` + `evidence-reachable`.

## S6. FBLD-28 (carried verbatim, never resolved)

FBLD-28 — Slot 0.9.28 — Conflict: V3 slot scope versus R2 deepdive zero-match scope — Fallback: carry zero-match result verbatim — Matches LD-28 — Status FLAGGED, never resolved.

Provenance (honest, not a second copy): the dispatch brief names the conflict
and the fallback shape; the entry above is carried from
`.opencode/audit/FULL-REPORT-REPLAN/fallback-log-2026-10-27.md:40` verbatim —
that file is not in this commit's tree (parallel-lane path, read per may-read
in the primary worktree), so it is quoted as text here and in spec §9, never
linked as resolvable evidence. V3 gate text wins on any conflict; the
zero-match result is carried exactly as found, never widened.

## S7. Scope (what was NOT run)

- No checkout of main or any other version branch; no `git switch`, no primary-HEAD move (all work in the holder worktree).
- No push (remote branch stays untouched), no merge, no commit beyond the one directed commit, no tag (`v0.9.28` absent local+remote), no `gh release` publish.
- Touched only the three §S2 files; AGENT.md, WORKFLOW.md, every other BUILD-0928 path (incl. sibling `r0928-readme-draft.md`), README.md, README.ar.md, and all files outside the three owned paths untouched.
- No agent dispatched; no verdict declared; no owner contacted. This ledger is evidence for the LEADER.
- Zero invented install commands: this node adds no installable component; every `install_cmd` touched is `null` + `unverified` where unprovable (spec §10). Zero registry/catalog/sidecar writes.

---

Ponytail: FULL — unified register plus proven compiler feed plus checkable regression memory, no speculative abstraction.
