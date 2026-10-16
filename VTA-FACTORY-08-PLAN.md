# VTA-FACTORY-08-PLAN — Phased Plan: Self-Extending Arsenal v0.8 to v8.6

Lane: `VTA-FACTORY-08-PLAN` · Node: `d-plan` (wave 2 of 4) · Owner: `vantrilex-scribe`.
Date (UTC): 2026-10-16 · Branch: `wt/vta-factory-08` · Status: plan only, then STOP.
Language: English only per `AGENTS.md` hard rule 5; no Arabic mirror exists for this document.

This is the ONE phased plan required by Order §9. It covers every order element
(§1 ranks, §2 six meta-skills, §3 Crucible, §4 doctrine, §5 refresh, §6 twenty
MCPs plus vs-smithery, §7 profile gear, §8 version map, §9 deliverable,
§10 completion, Amendment A1 six requirements) and adds no scope beyond the
order. The arc v0.8 to v8.6 is fixed; only phase internals may adjust, each with
a written justification flag. No execution follows from this document.

## 0 — Governing laws (§0)

- Self-hosting per Arsenal: every factory capability is built with Arsenal
  workers, skills, and gates, on Arsenal branches.
- Session-agnostic: the Arsenal session is a reference environment, never a
  hard dependency of any phase.
- Scope is the full arc v0.8 to v8.6 only.
- Zero `model:` pins and zero secrets in any shipped file, every phase.
- §33B plan-once DAG: this ONE plan document, then STOP. No execution, no
  follow-up manufacture, no merge, tag, or release from any phase below.

## 1 — Ranks (§1, fixed names)

- Zenith: the supreme named Vantrilex, established at v0.8.
- Syzygy: the three leaders Blazar, Aether, Pulsar.
- Asterism: side agents with lowercase `vantrilex-*` ids. The naming law
  stands: every side agent id is lowercase `vantrilex-*`; any other form is
  rejected at admission.

## 2 — Ground truth carried from R1 (recounted live, never transcribed)

Source: `VTA-FACTORY-08-R1-inventory.md` (branch `wt/vta-factory-08`,
HEAD short `772c693`, 2026-10-16).

- Skills: 25 `SKILL.md` files under `.opencode/skills/`.
- Agents: 26 files under `.opencode/agents/`: 3 leaders
  (`aether.md`, `blazar.md`, `pulsar.md`), 17 `vantrilex-*` workers, 6 other
  named specialists.
- Commands: 18 files under `.opencode/commands/`, 4 under `.opencode/command/`.
- Lock census: 138 locked components (80 verified, 58 unverified),
  9 pending entries (all kind `theme`).
- Verify scripts present: `verify-kit.mjs`, `verify-registry.mjs`,
  `verify-skills.mjs`.
- Leader charters today: `mode: primary` on all three; accents `#14B8A6`
  (Aether), `#4169E1` (Blazar), `#C026D3` (Pulsar). No `model:` key observed.

## 3 — Caveats carried from R2 and R3 (preserved as caveats, not resolved)

- R2 §2.5: the 7-dimension audit shape is `unverified` — no seven-dimension
  audit was found in the fetched skill-creator material (the adjacent
  analyzer defines six suggestion categories, not seven). Order §2.3 requires
  the 7-dimension audit; its seven dimensions are order-given and verification
  is deferred to the build lane, which must name and evidence them before any
  `vs-*` certification that depends on them is granted.
- R2 §3: the Liu-2026 26.1% skill-vulnerability statistic is `unverified`
  (two live arXiv queries returned zero results; no paper URL was available).
  Scan-first in §2.6 stands on its own rationale regardless; the build lane
  must cite the paper URL itself before quoting the figure as fact.
- R2 §4.2 smithery drift: in-tree `npx @smithery/cli` spellings
  (`docs/spec/VANTRILEX_KIT_SPEC.md:154`,
  `.opencode/skills/vantrilex-vanguard/SKILL.md:235`) match no verified
  package. Verified live 2026-10-16: npm package `smithery` v1.2.0 with binary
  `smithery`, install `npm install -g smithery@latest` (Node 20+), and the
  documented search-vet-add loop on `https://smithery.ai/docs/concepts/cli`.
  This plan records the drift; repair belongs to the kit-maintainer lane with
  the R2 table attached. No lock, catalog, or generated Markdown is touched
  by this plan.
- R3: every `UNKNOWN` in `VTA-FACTORY-08-R3-trust.md` (uploader identities and
  authentication, scan tool and rule set, puller identity and handover, kill
  switch mechanism and operator, numeric cap values) stays `UNKNOWN` until
  quoted from live order text in the build lane; each fails closed to human
  disposition. Requirement IDs `TR-2.5-01` through `TR-5-04` are stable for
  rescan.

## 4 — Phase DAG (arc fixed)

```text
P0 v0.8 (foundational, v0.8-gated)
 └─ P1 v0.9–v2.x (vs-* skill polish over all 25 kit skills)
     └─ P2 v3.x–v5.x (agent-polisher + Crucible + auto-evaluator)
         └─ P3 v6.x–v8.4 (MCP admission + profile gear + hardening; assigned below)
             └─ P4 v8.5 (full Asterism polished, factory mature)
                 └─ P5 v8.6 (convergence, self-extending Arsenal)
```

Middle versions v6.x through v8.4 are assigned explicitly in P3, not parked:
v6.x admits the §6 MCP set through the auto-evaluator; v7.x executes the §7
profile gear; v8.0–v8.4 is the hardening soak (kill-switch drills, gate
regression, documentation parity). Justification flag J-MID: assigning rather
than parking keeps every version number owned by exactly one phase, so the
arc stays continuous and auditable.

## 5 — P0 v0.8: Zenith plus factory doctrine plus makers plus A1 identity fix

Covers: §1 (Zenith rank established), §4 (doctrine embedded in leader
charters), §2.1 skill-maker, §2.2 agent-maker, A1 requirements 1–6.

### 5.1 Rank charter updates (§1, §4, §5 embedded)

Leader charters (`.opencode/agents/aether.md`, `blazar.md`, `pulsar.md`) gain
three standing-law blocks, identical across all three leaders:

- Rank block (§1): Zenith named as supreme; Syzygy membership (Blazar, Aether,
  Pulsar); Asterism naming law (lowercase `vantrilex-*` only).
- Factory doctrine block (§4): leaders CREATE missing agents and skills on
  detection with no hesitation; anti-sprawl counterweight of RECURRENCE or
  COMPLEXITY justification; hard spawn caps plus recursion-depth caps; unique
  ids plus action ledger; recursive kill switch; human sign-off before
  admission (rationale recorded: 361-agent quota-burn).
- Daily refresh block (§5): leaders check for Arsenal updates at every day
  start and apply to OpenCode WITHOUT user approval or asking.

### 5.2 Skill-maker (§2.1) and agent-maker (§2.2)

Both adopted from the Anthropic skill-creator (Apache-2.0) loop evidenced in
R2 §1–§2: capture intent, research, draft `SKILL.md` (slightly pushy
imperative description, why-not-what, fewer than 500 lines), 2–3 test cases,
with-skill versus baseline same-turn evals, grade and iterate. Both target
the OpenCode frontmatter subset (`name` plus `description` required;
`allowed-tools` and equivalents silently ignored). Agent-maker emits
Arsenal-format agents (`.opencode/agents/`, lowercase `vantrilex-*`, `mode:`,
one theme per agent).

### 5.3 A1 identity fix design (v0.8-gated, foundational)

A1 inputs (identity triple table): AETHER `aether` /
`.opencode/agents/aether.md` / `#14B8A6`; BLAZAR `blazar` /
`.opencode/agents/blazar.md` / `#4169E1`; PULSAR `pulsar` /
`.opencode/agents/pulsar.md` / `#C026D3`. Mechanism hypotheses
(command-is-prose-not-switch, split theme/agent application, stale pre-retool
authority) are all UNKNOWN. Immediate standing law (Horizon A, procedural):
fresh-session-per-leader plus probe. Structural fix (Horizon B) lands in this
phase per A1 requirements 1–6:

1. Single source of truth for session agent identity: the UI label and the
   self-report read the same source.
2. `V-<Agent>` switch ATOMIC: everywhere or LOUD failure, never silent
   half-switch.
3. Every response carries identity from that source; the misaddressed-order
   decline is preserved.
4. Self-test: `V-AETHER` to `V-BLAZAR` to `V-AETHER` round-trip asserting
   reported identity at each step, plus a misaddressed-order probe (an
   Aether order in the Blazar seat must decline).
5. Explicit fallback if atomicity is unachievable (for example
   session-restart-per-switch as standing law).
6. Identity-assertion regression gate installed in EVERY future version
   battery from v0.8 onward.

Rollback: rescind the standing-law lines; the fresh-session-per-leader rule
is restored as the standing procedure.

### 5.4 P0 work order

```text
section_leader: blazar
Lane: VTA-FACTORY-P0-V08
Node: p0-zenith-makers-identity
Concern: Establish Zenith, embed doctrine and refresh law in leader charters,
  ship skill-maker and agent-maker, land the A1 structural identity fix.
Owner: vantrilex-implementer
Acceptance: Zenith charter exists; all three leader charters carry the §1,
  §4, and §5 blocks verbatim-identical; skill-maker and agent-maker pass
  with-skill versus baseline same-turn evals; A1 round-trip plus
  misaddressed-order probe green; identity-assertion regression gate present
  in the battery.
May read: .opencode/agents/aether.md, .opencode/agents/blazar.md,
  .opencode/agents/pulsar.md, VTA-FACTORY-08-R1-inventory.md,
  VTA-FACTORY-08-R2-method.md, live tree (read-only).
Must leave: leader charter revisions, Zenith charter, skill-maker skill,
  agent-maker skill, A1 self-test evidence.
Must run: node scripts/verify-registry.mjs, node
  scripts/generate-catalog-json.mjs, node scripts/verify-kit.mjs, node
  scripts/verify-skills.mjs, markdownlint-cli on touched docs, relative-link
  resolution, identity round-trip plus misaddressed probe.
Must not touch: main branch directly, kit/kit.lock by hand, generated
  catalog Markdown by hand, VTA-FACTORY-08-R1/R2/R3 briefs, docs/defects/.
State files: neither.
Refusals: refuse model pins; refuse secrets in any file; refuse invented
  install commands (null plus unverified); refuse English-only violations.
Ledger reason: v0.8-gated foundation — doctrine, makers, and identity must
  exist before any polish or intake machinery is built on them.
```

Gates P0: `verify-registry` exit 0; `generate-catalog-json` clean with entry
count unchanged-or-justified; `verify-kit` exit 0; `verify-skills` exit 0;
`markdownlint-cli` exit 0 on touched docs; capsule validation where the lane
defines capsules; relative-link resolution complete (resolved equals counted);
identity-assertion regression gate green (installed here, repeated every
phase after).

## 6 — P1 v0.9–v2.x: vs-* polish pipeline over every existing kit skill

Covers: §2.3 skill-polisher. Touches EVERY existing kit skill (R1: 25).

Method: eval-driven polish — EDD (baseline, 3 eval scenarios, minimal
instructions, iterate) plus trigger tests including FALSE FRIENDS
(must-NOT-trigger phrases, evidenced in R2 §2.4 as near-miss negatives) plus
the order-given 7-dimension audit (R2 caveat: dimensions order-given,
verification deferred to the build lane). Output is `vs-*` GATED
certification: only polished skills earn the prefix, recorded as a metadata
tag, with surgical classification per skill.

### 6.1 P1 work order

```text
section_leader: blazar
Lane: VTA-FACTORY-P1-POLISH
Node: p1-vs-skill-polish
Concern: Run the vs-* polish pipeline over all 25 existing kit skills with
  eval-driven polish, false-friends trigger tests, and the order-given
  7-dimension audit.
Owner: vantrilex-reviewer
Acceptance: All 25 R1 skills carry vs-* certification or a named deferral
  with justification; 7 dimensions evidenced or still marked unverified;
  false-friends suites green per skill.
May read: .opencode/skills/*/SKILL.md (all 25),
  VTA-FACTORY-08-R1-inventory.md, VTA-FACTORY-08-R2-method.md, live tree
  (read-only).
Must leave: polished skill revisions, per-skill eval evidence, vs-*
  certification metadata tags.
Must run: node scripts/verify-skills.mjs, node scripts/verify-kit.mjs,
  markdownlint-cli on touched docs, relative-link resolution,
  identity-assertion regression gate.
Must not touch: leader charters except by named amendment, kit/kit.lock by
  hand, generated catalog Markdown by hand, VTA-FACTORY-08-R1/R2/R3 briefs,
  docs/defects/.
State files: neither.
Refusals: refuse vs-* certification for any skill with red evals; refuse
  transcribed counts; refuse invented install commands.
Ledger reason: certification-gated quality — only polished skills earn vs-*,
  so downstream intake and admission trust the prefix.
```

Gates P1: `verify-skills` exit 0; `verify-kit` exit 0; `verify-registry`
exit 0; `markdownlint-cli` exit 0; relative-link resolution complete;
identity-assertion regression gate green.

## 7 — P2 v3.x–v5.x: agent-polisher plus Crucible plus auto-evaluator

Covers: §2.4 agent-polisher, §2.5 Crucible-uploader set, §2.6 auto-evaluator,
§3 Crucible, §4 admission doctrine (sign-off, kill switch, caps).

### 7.1 Agent-polisher (§2.4)

Same eval-driven loop as §2.3 applied to agents, yielding `vantrilex-*` ids
for every polished agent (R1 scope: 17 workers plus leaders). False-friends
and the order-given 7-dimension audit apply symmetrically.

### 7.2 Crucible-uploader set (§2.5) and Crucible (§3)

Working title Crucible (Omar may rename): GitHub-based for now. Users'
agents SEND only, automatic per their skill. ONE uploader side agent plus a
MAXIMUM of 4 intake skills (fetch, send, handle families). Intake is 24/7.
ONLY the Arsenal session OpenCode READS and pulls. Exactly ONE puller agent
(never 10): pulls, examines, stages. Omar reviews the pile, then admits.
Recorded future, NOT built in any phase: a skills.sh-like registry, then an
own website. Trust requirements TR-2.5-01 through TR-5-04 (R3) govern design;
every R3 `UNKNOWN` fails closed to human disposition.

Crucible repo layout (plan-level, build lane to instantiate):

```text
crucible/
  intake/      # SEND-only landing zone; submitters hold no READ authority
  staging/     # single-puller custody chain; one pull sequence
  pile/        # Omar review queue; human sign-off recorded here
  admitted/    # post-sign-off handoff into kit admission only
```

### 7.3 Auto-evaluator (§2.6)

Classifies, improves, and stages candidates for admission. SECURITY SCAN
FIRST for secrets and PII on every run before any evaluation, scoring,
ranking, or admission step; a scan hit quarantines the candidate. The
Liu-2026 26.1% figure stays `unverified` (R2 §3) and is never quoted as
fact until the build lane cites the paper URL. The evaluator is the trust
boundary for ALL external content including smithery.ai.

### 7.4 P2 work order

```text
section_leader: blazar
Lane: VTA-FACTORY-P2-CRUCIBLE
Node: p2-agents-crucible-evaluator
Concern: Ship agent-polisher, stand up the Crucible intake with its closed
  uploader set and single puller, and ship the scan-first auto-evaluator.
Owner: vantrilex-security-auditor
Acceptance: Agent-polisher certified over the 17 plus leaders scope;
  Crucible layout live with SEND-only intake and one puller; auto-evaluator
  scan-first proven with quarantine evidence; TR-2.5-01 through TR-5-04 each
  quoted against order text or still marked UNKNOWN failing closed.
May read: .opencode/agents/*.md, VTA-FACTORY-08-R1-inventory.md,
  VTA-FACTORY-08-R3-trust.md, live tree (read-only).
Must leave: agent-polisher skill, uploader agent plus at most 4 intake
  skills, puller agent, auto-evaluator skill, Crucible layout, TR traceability
  record.
Must run: node scripts/verify-registry.mjs, node
  scripts/generate-catalog-json.mjs, node scripts/verify-kit.mjs, node
  scripts/verify-skills.mjs, markdownlint-cli on touched docs, relative-link
  resolution, identity-assertion regression gate.
Must not touch: main branch directly, kit/kit.lock by hand, generated
  catalog Markdown by hand, VTA-FACTORY-08-R1/R2/R3 briefs, docs/defects/.
State files: neither.
Refusals: refuse admission without human sign-off; refuse scan-skipped
  evaluation; refuse second puller; refuse more than 4 intake skills; refuse
  building the recorded-future registry or website.
Ledger reason: trust-boundary phase — intake and evaluation machinery must be
  scan-first, SEND-only, and single-custody before any external content flows.
```

Gates P2: full battery (`verify-registry`, `generate-catalog-json`,
`verify-kit`, `verify-skills`) exit 0; `markdownlint-cli` exit 0;
capsule validation; relative-link resolution complete; identity-assertion
regression gate green.

## 8 — P3 v6.x–v8.4: MCP admission plus profile gear plus hardening

Covers: §6 (20 MCPs plus vs-smithery), §7 (profile gear), pre-convergence
hardening. Explicit assignment per version band:

- v6.x: conditional admission of the §6 MCP set through the auto-evaluator.
- v7.x: GitHub-profile gear in order: audit, identity, READMEs, proof,
  ordering, security, maintenance; 8 specialist subagents in Arsenal format
  from day one; every incoming skill and agent gets §2.3/§2.4 polish;
  destructive repo steps need named user approval always.
- v8.0–v8.4: hardening soak — kill-switch drills, spawn-cap enforcement
  evidence, gate-regression stability, documentation parity.

### 8.1 Twenty-MCP conditional lock-record spec (§6)

Each MCP ships as a CONDITIONAL kit-lock record, never core, each with a
redundancy pair, and each passes the auto-evaluator before admission
(especially community names). Counts observed 2026-10-16; counts fluctuate
and are re-observed at admission time, never transcribed from this plan.

| # | MCP (admission name) | Role | Redundancy pair | Observed count |
|---|---|---|---|---|
| 1 | github | git | none (git-native) | ~6,059 |
| 2 | neon | Postgres PRIMARY | supabase | ~1,350 |
| 3 | supabase | Postgres FALLBACK | neon | ~189 |
| 4 | vercel | hosting PRIMARY | cloudflare | ~549 |
| 5 | cloudflare | hosting FALLBACK | vercel | ~199 |
| 6 | browserbase | browser | none stated | ~433 |
| 7 | brave | search PRIMARY | exa | ~87,579 |
| 8 | exa | search FALLBACK | brave | ~9,181 |
| 9 | intake-triage/steadyfetch | fetch | none stated | ~9,227 |
| 10 | upstash/context7-mcp | docs | none stated | ~5,563 |
| 11 | googledrive | drive | none stated | ~8,569 |
| 12 | notion | notes | none stated | ~3,841 |
| 13 | deepwiki | wiki | none stated | ~2,356 |
| 14 | mem0ai/mem0-memory-mcp | memory | none stated | ~136 |
| 15 | kiennd/reference-servers | sequential thinking | none stated | ~0 |
| 16 | slack | comms PRIMARY | discord | ~12,110 |
| 17 | discord | comms FALLBACK | slack | ~82 |
| 18 | gmail | mail | none stated | ~57,738 |
| 19 | stripe | payments | none stated | ~48 |
| 20 | @Zwe1/figma-context-mcp | Figma | none stated | community name |

Plus: filesystem via the canonical local `npx` pattern, recorded as a lock
NOTE, not a registry entry. Plus the vs-smithery skill: search-vet-add loop
plus a curated starter set, NOT bulk install (R2 drift recorded; the
kit-maintainer lane owns the `@smithery/cli` spelling repair).

Lock-record rule: every MCP record carries `installation: null` with
`verification: unverified` until the auto-evaluator verifies its real
install command against a real registry. No install command is invented in
any phase; a plausible-looking wrong command is worse than the admission of
ignorance.

### 8.2 P3 work order

```text
section_leader: blazar
Lane: VTA-FACTORY-P3-ADMIT
Node: p3-mcp-profile-harden
Concern: Admit the 20 conditional MCPs through the auto-evaluator, execute
  the profile gear in order, and run the v8.0–v8.4 hardening soak.
Owner: vantrilex-librarian
Acceptance: Each MCP holds a conditional lock record with redundancy pair
  and auto-evaluator evidence (or a named deferral); vs-smithery ships
  search-vet-add with a curated starter set and no bulk install; profile
  gear completes in the §7 order with 8 Arsenal-format specialists;
  hardening evidence (kill-switch drills, cap enforcement, gate stability)
  recorded.
May read: kit/kit.lock, registry/data/mcp.jsonl,
  VTA-FACTORY-08-R2-method.md, VTA-FACTORY-08-R3-trust.md, live tree
  (read-only).
Must leave: conditional MCP lock-record proposals, vs-smithery skill,
  profile artifacts, hardening evidence.
Must run: node scripts/verify-registry.mjs, node
  scripts/generate-catalog-json.mjs, node scripts/verify-kit.mjs,
  markdownlint-cli on touched docs, relative-link resolution,
  identity-assertion regression gate.
Must not touch: registry/catalog.json by hand, generated catalog Markdown
  by hand, VTA-FACTORY-08-R1/R2/R3 briefs, docs/defects/.
State files: neither.
Refusals: refuse core promotion of any conditional MCP; refuse invented
  install commands; refuse bulk smithery install; refuse destructive repo
  steps without named user approval.
Ledger reason: conditional-admission phase — external capability enters only
  through evaluation with pairs, never as unverified core.
```

Gates P3: full battery exit 0; `markdownlint-cli` exit 0; capsule
validation; relative-link resolution complete; identity-assertion regression
gate green.

## 9 — P4 v8.5: full Asterism polished, factory mature

Covers: §8 v8.5 milestone. All Asterism agents polished through §2.4,
all kit skills vs-* certified through §2.3, Crucible and auto-evaluator in
routine operation, MCP conditionals resolved (admitted or deferred with
justification), profile gear complete.

### 9.1 P4 work order

```text
section_leader: blazar
Lane: VTA-FACTORY-P4-MATURE
Node: p4-asterism-mature
Concern: Close every remaining polish and admission deferral so the full
  Asterism is polished and the factory runs routinely.
Owner: vantrilex-verifier
Acceptance: Zero open polish deferrals; zero unresolved MCP conditionals;
  Crucible pile-to-admission flow demonstrated end to end with human
  sign-off evidence; full gate battery green three consecutive runs.
May read: all prior phase artifacts, kit/kit.lock, live tree (read-only).
Must leave: deferral-closure record, end-to-end admission demonstration
  evidence, triple-green gate ledger.
Must run: node scripts/verify-registry.mjs, node
  scripts/generate-catalog-json.mjs, node scripts/verify-kit.mjs, node
  scripts/verify-skills.mjs, markdownlint-cli on touched docs, relative-link
  resolution, identity-assertion regression gate.
Must not touch: main branch directly, kit/kit.lock by hand, generated
  catalog Markdown by hand, VTA-FACTORY-08-R1/R2/R3 briefs, docs/defects/.
State files: neither.
Refusals: refuse maturity declaration with open deferrals; refuse
  single-run green as stability evidence.
Ledger reason: maturity gate — v8.5 is declared only when nothing remains
  deferred and the battery holds across repeats.
```

Gates P4: full battery exit 0 across three consecutive runs;
`markdownlint-cli` exit 0; capsule validation; relative-link resolution
complete; identity-assertion regression gate green.

## 10 — P5 v8.6: convergence, self-extending Arsenal

Covers: §8 v8.6 milestone. The factory operates closed-loop: leaders create
agents and skills on detection under §4 doctrine, intake flows through the
Crucible, evaluation through the auto-evaluator, admission through human
sign-off, with caps, ledger, and kill switch holding. Convergence evidence:
a full cycle (detect, create, polish, submit, evaluate, admit) executed
under factory law with all gates green.

### 10.1 P5 work order

```text
section_leader: blazar
Lane: VTA-FACTORY-P5-CONVERGE
Node: p5-convergence
Concern: Demonstrate one closed-loop self-extension cycle under factory law
  and record convergence evidence.
Owner: vantrilex-leader
Acceptance: Closed-loop cycle demonstrated with ledger, caps, sign-off, and
  all gates green; factory declared self-extending; no new scope opened.
May read: all prior phase artifacts, live tree (read-only).
Must leave: convergence demonstration record, final gate ledger.
Must run: node scripts/verify-registry.mjs, node
  scripts/generate-catalog-json.mjs, node scripts/verify-kit.mjs, node
  scripts/verify-skills.mjs, markdownlint-cli on touched docs, relative-link
  resolution, identity-assertion regression gate.
Must not touch: main branch directly, kit/kit.lock by hand, generated
  catalog Markdown by hand, VTA-FACTORY-08-R1/R2/R3 briefs, docs/defects/.
State files: neither.
Refusals: refuse convergence without the ledger; refuse scope beyond the
  order, including the recorded-future registry and website.
Ledger reason: convergence proof — v8.6 is earned by a demonstrated loop,
  not by declaring readiness.
```

Gates P5: full battery exit 0; `markdownlint-cli` exit 0; capsule
validation; relative-link resolution complete; identity-assertion regression
gate green.

## 11 — Verification gates per phase (summary)

Every phase runs: `node scripts/verify-registry.mjs`,
`node scripts/generate-catalog-json.mjs`,
`node scripts/verify-kit.mjs`, `node scripts/verify-skills.mjs`,
`markdownlint-cli` on every touched doc, capsule validation where the lane
defines capsules, complete relative-link resolution, and the
identity-assertion regression gate installed in P0. A gate that cannot run
is a failed gate, never skipped. Green on a related command is not evidence:
each phase re-runs the exact verification over the files it touched.

## 12 — Completion (§10)

On completion of this plan document: announce `VTA-FACTORY-08 planned` with
the path `VTA-FACTORY-08-PLAN.md`; vanbu verifies; the owner releases. No
execution follows from this document.

## 13 — Sources used

- Single source plus order text as dispatched (order §§0–10 plus Amendment
  A1 with A1 inputs).
- `VTA-FACTORY-08-R1-inventory.md` (counts, charter states, mechanism
  quotes).
- `VTA-FACTORY-08-R2-method.md` (skill-creator loop, eval evidence,
  false-friends, smithery CLI facts, drift table, M5/M6/M10 caveats).
- `VTA-FACTORY-08-R3-trust.md` (requirements TR-2.5-01 through TR-5-04,
  UNKNOWN convention).
- `WORKFLOW.md` Part B (lane DAG, roles, precautions).
- No GONE source contributes anything; no wording, rule, or procedure is
  claimed from one.

## 14 — Uncertainties and follow-ups

- R2 M5 (7 dimensions) and M6 (Liu 26.1% URL) stay `unverified`; the build
  lane must resolve both before depending on them.
- Every R3 `UNKNOWN` (uploader identities, scan tooling, puller handover,
  kill-switch mechanism, cap numbers) fails closed to human disposition in
  the build lane.
- Smithery `@smithery/cli` drift is recorded with the R2 table attached for
  the kit-maintainer lane; this plan repairs nothing.
- `docs/defects/` is absent on this seat; A1 design rests on the dispatched
  A1 inputs alone, and the build lane re-verifies against the live defect
  files if present there.

Ponytail: EXEMPT for pure prose and translation — evidence: this node
authored prose only, no code written, no helper script created.
