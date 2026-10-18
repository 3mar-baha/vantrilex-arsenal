# VTA-FACTORY-PLAN-SURGICAL — Factory Program P0 to v8.6, Surgical-Detailed Phased Plan

Lane: `VTA-FACTORY-PLAN-SURGICAL`. Node: `d-plan`. Status: plan only, then STOP.
No execution is ordered by this document. No merge, no tag, no release is ordered
by this document. This file stays untracked until the orchestrator orders otherwise.

All other lanes are parked or closed. This plan touches no parked lane.

## 1 — Situation

1. The comms loop is PARKED. The Supabase channel stays basic-messaging-only.
   The dashboard is REJECTED and parked. No further comms work and no further
   dashboard work appear in any phase of this plan.
2. The factory program P0 to v8.6 is the SOLE focus, executed on existing repo
   state. Factory work is create, polish, evaluate, admit — nothing else.
3. The post-v8.6 integrated comms channel is a SEPARATE future project and is
   EXCLUDED from every phase of this plan.

## 2 — Scope: recounted exacts only

The counts below are the W0 `c-recount` live recount exacts. They SUPERSEDE the
order's `~` figures. No `~` figure from the order is transcribed anywhere in
this plan as an exact number.

| Kind | Installed | Registry | Total |
|---|---|---|---|
| Skills | 25 | 1505 | 1530 |
| Agents | 26 (3 leaders + 17 vantrilex-* + 6 specialists) | 301 | 327 |
| Commands | 18 | 4 | 22 |
| Lock records | 138 (80 verified + 58 unverified) | pending 9 | 138 + 9 pending |

Corroboration paths observed read-only from this seat: `.opencode/agents`,
`.opencode/skills`, `.opencode/commands`, `kit/kit.lock`, `registry/`,
`registry/catalog.json`. Standalone governance: [AGENTS.md](AGENTS.md),
[WORKFLOW.md](WORKFLOW.md), [kit/kit.lock](kit/kit.lock),
[registry/catalog.json](registry/catalog.json).

## 3 — What each phase section below contains

Every phase P0 to P5 carries exactly these fields, in this order, with zero
ambiguity: exact lane name; node name; section_leader; owner agent; COMPLETE
May-read list; COMPLETE Must-leave list; COMPLETE Must-NEVER-touch list; EXACT
verification commands with expected exit codes and what each command proves;
EXACT measurable acceptance with no adjectives; EXACT refusal list with a reason
per refusal; DAG fan-out (named subagents, no write collisions) versus chain
(real dependencies only); one-sentence ledger reason.

## 4 — Section 0: governing laws (embedded verbatim)

The following laws govern every phase. They are reproduced verbatim from the
order and are not paraphrased:

1. Free models only.
2. Zero model: pins.
3. Full permission preserved.
4. BLAZAR manages only.
5. Honesty (~/تقديري, never invent).
6. Section 33B.
7. Announce-verify-release.
8. Park rule.
9. No manufactured follow-up.
10. Owner identity RAG-verbatim.

Plus, verbatim as listed:

- Polish doctrine: `vs-*` = polished ONLY; polish touches every skill literally.
- Naming law: side agents lowercase vantrilex-* always; leaders Title-case display.
- Session-agnostic design.
- Daily refresh without asking.
- Factory doctrine: create on detection; recurrence/complexity justification;
  caps; kill switch.
- Max-fanout: largest sufficient agents; no serial slog; no waste.

## 5 — Phase P0 v0.8: charter + makers + A1 identity fix

- Lane: `VTA-FACTORY-P0-V08`. Node: `p0-charter`.
- Section_leader: `blazar`. Owner agent: `vantrilex-scribe`.
- Objective: Zenith rank plus Section 1, Section 4, Section 5 charter blocks
  verbatim in all 3 leaders, plus skill-maker plus agent-maker built on the
  Anthropic skill-creator loop, plus the A1 identity fix meeting all 6
  requirements.
- A1 identity fix, 6 requirements: (1) single source of truth for identity;
  (2) atomic V-Agent switch; (3) identity stated per response; (4) round-trip
  plus misaddressed probe green; (5) explicit fallback named; (6) regression
  gate present in every future battery.
- May-read: the order full text; all 3 leader definition files; the Anthropic
  skill-creator loop source named in the order; `docs/defects/identity-*.md`
  background; [WORKFLOW.md](WORKFLOW.md) Part B; live tree read-only.
- Must-leave: charter blocks Section 1, Section 4, Section 5 byte-identical in
  all 3 leader files; skill-maker definition file; agent-maker definition file;
  A1 fix with round-trip probe script plus misaddressed probe script plus
  regression gate entry in the battery definition.
- Must-NEVER-touch: `AGENTS.md`; `WORKFLOW.md`; `kit/kit.lock`;
  `registry/catalog.json`; `VANTRILEX_CATALOG.md`; any comms file
  (`COMMS-*`, `comms-supabase-dashboard/`); any dashboard file; git history
  (no commit, no push, no tag); any parked lane file.
- Verification commands, expected exit 0, what each proves:
  - `node scripts/verify-registry.mjs` — exit 0 — proves registry data valid
    after the charter/maker additions.
  - `node scripts/verify-kit.mjs` — exit 0 — proves each kit component loads
    including the 2 new makers.
  - `npx --yes markdownlint-cli <each touched markdown file>` — exit 0 —
    proves touched prose is lint-clean.
  - `<round-trip probe command> && <misaddressed probe command>` — exit 0 —
    proves A1 requirements 4 and 5 on live paths.
- Measurable acceptance: 3 of 3 leader files contain Section 1, Section 4,
  Section 5 blocks byte-identical to the charter source; Zenith rank string
  present in 3 of 3 leader files; skill-maker file exists (1) and agent-maker
  file exists (1); 6 of 6 A1 requirements green; round-trip probe exit 0;
  misaddressed probe exit 0; regression gate entry present in 1 battery
  definition; `verify-registry.mjs` exit 0; `verify-kit.mjs` exit 0.
- Refusal list plus why: (1) refuse comms/dashboard/own-channel scope — parked
  by Section 1; (2) refuse to execute beyond authoring — this phase authors
  definitions, execution belongs to a later ordered lane; (3) refuse
  merge/tag/release — no release is ordered; (4) refuse to transcribe counts —
  only W0 recounted exacts are used; (5) refuse model pins — law 2.
- DAG fan-out versus chain: fan-out — charter-block insertion (scribe) and
  maker authorship (implementer) and probe scripting (implementer) run in
  parallel, each writing disjoint paths, no write collisions; chain — the
  regression gate entry depends on the probes existing; verification depends
  on all writes landing.
- Ledger reason: P0 installs the charter, the makers, and the identity guard
  that every later phase assumes.

## 6 — Phase P1 v0.9 to v2.x: eval-driven polish over all 1530 skills

- Lane: `VTA-FACTORY-P1-POLISH`. Node: `p1-polish`.
- Section_leader: `blazar`. Owner agent: `vantrilex-verifier`.
- Objective: eval-driven polish over ALL 1530 skills through the pipeline
  baseline, then 3 scenarios, then false-friends, then 7-dimension audit, then
  iterate; only green-eval skills earn the `vs-*` prefix.
- May-read: the order full text; the P0 makers; all 1530 skill definitions
  (25 installed + 1505 registry rows); the eval battery definition;
  [AGENTS.md](AGENTS.md) change discipline; live tree read-only.
- Must-leave: baseline score per skill (1530 rows); 3 scenario results per
  skill; false-friends result per skill; 7-dimension audit row per skill;
  polished `vs-*` file only for each green-eval skill; updated battery rows.
- Must-NEVER-touch: `AGENTS.md`; `WORKFLOW.md`; `kit/kit.lock`;
  `registry/catalog.json` except through its generator; generated Markdown
  by hand; any comms or dashboard file; git history (no commit, no push,
  no tag); the `vs-*` prefix on any skill with a non-green eval.
- Verification commands, expected exit 0, what each proves:
  - `node scripts/verify-registry.mjs` — exit 0 — proves registry rows valid
    after polish admissions.
  - `node scripts/generate-catalog-json.mjs` — exit 0 — proves the catalog
    mirror regenerates and the entry count is recorded.
  - `npx --yes markdownlint-cli <each touched markdown file>` — exit 0 —
    proves polished prose is lint-clean.
  - `<eval battery command> --phase p1` — exit 0 — proves the recorded
    green verdicts reproduce.
- Measurable acceptance: 1530 of 1530 skills carry a baseline row; 1530 of 1530
  carry 3 scenario results; 1530 of 1530 carry a false-friends result; 1530 of
  1530 carry a 7-dimension audit row; count of `vs-*` files equals count of
  green-eval skills exactly; 0 `vs-*` files exist for non-green skills; battery
  exit 0; `verify-registry.mjs` exit 0.
- Refusal list plus why: (1) refuse comms/dashboard/own-channel scope — parked
  by Section 1; (2) refuse the `vs-*` prefix for any non-green skill — polish
  doctrine; (3) refuse bulk `vs-*` admission without per-skill eval rows —
  polish touches every skill literally; (4) refuse merge/tag/release — no
  release is ordered; (5) refuse to transcribe counts — only W0 recounted
  exacts are used.
- DAG fan-out versus chain: fan-out — skill cohorts evaluated in parallel by
  N verifier workers over disjoint skill sets, largest sufficient count per
  max-fanout, no serial slog, no waste; chain — audit depends on baseline
  plus scenarios plus false-friends; `vs-*` admission depends on green audit;
  catalog regeneration depends on admissions.
- Ledger reason: P1 converts the full 1530-skill inventory from unverified
  stock into measured, auditable, prefix-earning assets.

## 7 — Phase P2 v3.x to v5.x: agent polishing plus Crucible intake

- Lane: `VTA-FACTORY-P2-CRUCIBLE`. Node: `p2-crucible`.
- Section_leader: `blazar`. Owner agent: `vantrilex-implementer`.
- Objective: run agent-polisher over ALL 327 agents to vantrilex-* ids; run
  Crucible GitHub intake SEND-only with ONE uploader plus MAX 4 intake skills
  plus ONE puller; Omar reviews then admits; auto-evaluator runs SCAN-FIRST
  with secrets/PII quarantine.
- May-read: the order full text; all 327 agent definitions (26 installed +
  301 registry rows); Crucible intake specification; the auto-evaluator
  definition; [SECURITY.md](SECURITY.md); live tree read-only.
- Must-leave: 327 polished agent definitions under lowercase vantrilex-* ids;
  ONE uploader definition; 1 to 4 intake skill definitions; ONE puller
  definition; Omar review record per admission; SCAN-FIRST quarantine log
  per intake batch.
- Must-NEVER-touch: `AGENTS.md`; `WORKFLOW.md`; `kit/kit.lock`;
  `registry/catalog.json` except through its generator; leader Title-case
  display names; any comms or dashboard file; git history (no commit, no push,
  no tag); any second uploader or second puller or fifth intake skill.
- Verification commands, expected exit 0, what each proves:
  - `node scripts/verify-registry.mjs` — exit 0 — proves the 327 agent rows
    are valid after id migration.
  - `node scripts/verify-kit.mjs` — exit 0 — proves each polished agent loads.
  - `<auto-evaluator scan command> --scan-first <batch>` — exit 0 — proves
    SCAN-FIRST ran and the quarantine log matches the batch.
  - `npx --yes markdownlint-cli <each touched markdown file>` — exit 0 —
    proves touched prose is lint-clean.
- Measurable acceptance: 327 of 327 agents carry lowercase vantrilex-* ids;
  0 uppercase side-agent ids remain; uploader count equals 1; intake skill
  count is between 1 and 4 inclusive; puller count equals 1; intake direction
  is SEND-only with 0 receive paths; Omar review record exists per admission;
  quarantine log entries equal quarantined items; battery exit 0.
- Refusal list plus why: (1) refuse comms/dashboard/own-channel scope — parked
  by Section 1; (2) refuse a second uploader, second puller, or fifth intake
  skill — the order caps them; (3) refuse any receive path — intake is
  SEND-only; (4) refuse admission without an Omar review record — the order
  requires Omar reviews then admits; (5) refuse merge/tag/release — no release
  is ordered; (6) refuse to transcribe counts — only W0 recounted exacts
  are used.
- DAG fan-out versus chain: fan-out — agent cohorts polished in parallel over
  disjoint agent sets; intake batches scanned in parallel over disjoint
  batches; chain — polishing depends on P1 eval precedent; admission depends
  on SCAN-FIRST green plus the Omar review record; verification depends on
  all writes landing.
- Ledger reason: P2 turns the full 327-agent inventory into uniformly named,
  safely sourced factory stock under a capped single-path intake.

## 8 — Phase P3 v6.x to v8.4: MCP admission plus profile gear plus soak

- Lane: `VTA-FACTORY-P3-ADMIT`. Node: `p3-admit`.
- Section_leader: `blazar`. Owner agent: `vantrilex-implementer`.
- Objective: admit 20 MCPs as CONDITIONAL lock records with redundancy pairs
  and one auto-evaluator each; ship vs-smithery with no bulk admission; ship
  v7.x profile gear for the 8 specialists in order; run the v8.0 to v8.4
  hardening soak.
- May-read: the order full text; the 20 MCP candidate specifications;
  `kit/kit.lock.schema.json`; the vs-smithery specification; the 8 specialist
  definitions; [kit/kit.lock](kit/kit.lock); live tree read-only.
- Must-leave: 20 CONDITIONAL lock records each naming its redundancy pair and
  its auto-evaluator; vs-smithery definition with per-item (no bulk) admission
  log; 8 specialist profile gear files in the ordered sequence; soak log
  covering v8.0 to v8.4.
- Must-NEVER-touch: `AGENTS.md`; `WORKFLOW.md`; `kit/kit.lock` except through
  its owning node (this phase proposes records, the owning node writes them);
  `registry/catalog.json`; any comms or dashboard file; git history (no
  commit, no push, no tag); bulk admission paths.
- Verification commands, expected exit 0, what each proves:
  - `node scripts/verify-kit.mjs` — exit 0 — proves each admitted component
    loads under its lock record.
  - `tsc --noEmit` — exit 0 — proves plugin TypeScript is clean after gear
    changes.
  - `shellcheck <each touched shell script>` — exit 0 — proves touched shell
    is clean.
  - `npx --yes markdownlint-cli <each touched markdown file>` — exit 0 —
    proves touched prose is lint-clean.
- Measurable acceptance: CONDITIONAL lock records equal 20; 20 of 20 name a
  redundancy pair; 20 of 20 name an auto-evaluator; bulk admissions equal 0;
  profile gear files equal 8 in the ordered sequence; soak log covers v8.0,
  v8.1, v8.2, v8.3, v8.4 with 0 uncovered versions; `verify-kit.mjs` exit 0.
- Refusal list plus why: (1) refuse comms/dashboard/own-channel scope — parked
  by Section 1; (2) refuse unconditional lock records — the order requires
  CONDITIONAL; (3) refuse bulk smithery admission — the order forbids bulk;
  (4) refuse out-of-order profile gear — v7.x gear is ordered; (5) refuse
  merge/tag/release — no release is ordered; (6) refuse to transcribe counts —
  only W0 recounted exacts are used.
- DAG fan-out versus chain: fan-out — MCP evaluations run in parallel over
  disjoint candidate pairs; specialist gear ships in the ordered sequence
  with parallel authorship over disjoint gear files; chain — lock records
  depend on auto-evaluator green; soak depends on all 20 records plus all 8
  gear files landing; verification depends on the soak log.
- Ledger reason: P3 gates every external capability behind conditional,
  paired, evaluated records before the factory is allowed to harden.

## 9 — Phase P4 v8.5: maturity gate

- Lane: `VTA-FACTORY-P4-MATURE`. Node: `p4-mature`.
- Section_leader: `blazar`. Owner agent: `vantrilex-verifier`.
- Objective: reach zero deferrals with the full battery green 3 consecutive runs.
- May-read: the order full text; the full battery definition; the deferral
  ledger; all P0 to P3 artifacts read-only; [WORKFLOW.md](WORKFLOW.md) Part B.
- Must-leave: deferral ledger showing 0 open deferrals; 3 consecutive battery
  run logs, each exit 0, with run identifiers 1, 2, 3 in order.
- Must-NEVER-touch: `AGENTS.md`; `WORKFLOW.md`; `kit/kit.lock`;
  `registry/catalog.json`; `VANTRILEX_CATALOG.md`; any source or prose file
  (read-only phase except the 3 run logs); any comms or dashboard file;
  git history (no commit, no push, no tag).
- Verification commands, expected exit 0, what each proves:
  - `<battery command> --run 1` — exit 0 — proves run 1 green.
  - `<battery command> --run 2` — exit 0 — proves run 2 green, consecutive.
  - `<battery command> --run 3` — exit 0 — proves run 3 green, consecutive.
  - `node scripts/verify-registry.mjs` — exit 0 — proves registry still valid.
  - `node scripts/verify-kit.mjs` — exit 0 — proves kit still loads.
- Measurable acceptance: open deferrals equal 0; green battery runs equal 3
  consecutive with identifiers 1, 2, 3; 0 red runs interleave the 3; all 5
  listed commands exit 0.
- Refusal list plus why: (1) refuse comms/dashboard/own-channel scope — parked
  by Section 1; (2) refuse to count non-consecutive greens — the order requires
  3 consecutive; (3) refuse to close with any open deferral — the order
  requires zero deferrals; (4) refuse merge/tag/release — no release is
  ordered; (5) refuse to transcribe counts — only W0 recounted exacts
  are used.
- DAG fan-out versus chain: chain — run 2 depends on run 1 green; run 3
  depends on run 2 green; no fan-out exists because consecutiveness is a real
  dependency; registry and kit verification run in parallel after run 3.
- Ledger reason: P4 proves the factory holds green under repetition instead of
  asserting maturity from a single passing run.

## 10 — Phase P5 v8.6: convergence demonstration

- Lane: `VTA-FACTORY-P5-CONVERGE`. Node: `p5-converge`.
- Section_leader: `blazar`. Owner agent: `vantrilex-guide`.
- Objective: demonstrate exactly one closed-loop cycle through detect, create,
  polish, submit, evaluate, admit in order, then declare the factory
  self-extending.
- May-read: the order full text; all P0 to P4 artifacts read-only; the battery
  definition; [WORKFLOW.md](WORKFLOW.md) Part B.
- Must-leave: one loop dossier with 6 timestamped stage records (detect,
  create, polish, submit, evaluate, admit) referencing the same item id;
  self-extending declaration naming the loop dossier id.
- Must-NEVER-touch: `AGENTS.md`; `WORKFLOW.md`; `kit/kit.lock`;
  `registry/catalog.json`; `VANTRILEX_CATALOG.md`; any P0 to P4 artifact
  (read-only inputs); any comms or dashboard file; git history (no commit,
  no push, no tag).
- Verification commands, expected exit 0, what each proves:
  - `<battery command> --loop <dossier-id>` — exit 0 — proves the loop item
    passes the battery at admit stage.
  - `node scripts/verify-registry.mjs` — exit 0 — proves the admitted loop
    item left the registry valid.
  - `npx --yes markdownlint-cli <dossier files>` — exit 0 — proves the
    dossier prose is lint-clean.
- Measurable acceptance: stage records equal 6 in the order detect, create,
  polish, submit, evaluate, admit; all 6 carry the same item id; loop cycles
  demonstrated equal 1; declaration names the dossier id; battery exit 0.
- Refusal list plus why: (1) refuse comms/dashboard/own-channel scope — parked
  by Section 1; (2) refuse a second loop — the order demonstrates one cycle;
  (3) refuse out-of-order stages — the loop order is the claim; (4) refuse
  merge/tag/release — no release is ordered; (5) refuse to transcribe counts —
  only W0 recounted exacts are used.
- DAG fan-out versus chain: chain — each stage depends on the previous
  stage's record for the same item id; no fan-out exists because a single
  item traverses a single ordered loop.
- Ledger reason: P5 replaces the self-extending claim with one witnessed loop
  before the factory is declared convergent.

## 11 — Plan-level refusals

1. Refuse comms, dashboard, and own-channel scope in every phase — the comms
   loop is parked, the dashboard is rejected, and the post-v8.6 channel is a
   separate future project.
2. Refuse to execute — this document is a plan; execution requires a separate
   ordered lane.
3. Refuse merge, tag, and release — none is ordered by this plan.
4. Refuse to transcribe counts — the Section 2 recounted exacts are the only
   counts; the order's `~` figures are never copied as exact numbers.
5. Refuse model pins — law 2 binds every phase.
6. Refuse secrets in any artifact — no committed file carries a real value.
7. Refuse invented install commands — an install command is verified against
   a real registry or explicitly recorded as unverified.

## 12 — Handoff

The sole writer of this path (`vantrilex-scribe`, node `d-plan`, wave 1) leaves
`VTA-FACTORY-PLAN-SURGICAL.md` at the `O:\vantrilex-arsenal` root for the
orchestrator to integrate. Review (`v-review`) and gates (`v-gates`) read this
file read-only. Then the orchestrator announces `VTA-FACTORY-PLAN-SURGICAL
planned` with path plus override flag, then STOP.
