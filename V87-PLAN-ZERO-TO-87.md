# V87-PLAN-ZERO-TO-87.md — the complete 0 → 8.7 plan

| Field | Value |
|---|---|
| Deliverable | `V87-PLAN-ZERO-TO-87.md` — output #3 of the owner package (§V87-AETHER-PACKAGE §5) |
| Lane | `V87-AETHER-EXECUTE` (owner-commissioned execution of the amended AETHER MISSION-PLAN; all other lanes parked) |
| Node | `d-plan` (wave 2 of 3; depends_on `i-digest` + `v-enum` + `c-colors` + `c-compat` + `v-features-1/2` — all landed) |
| Author | `vantrilex-scribe` (worker-only seat; this file is the node's only write) |
| Date | 2026-10-18 |
| Status | Draft returned for wave-3 review + independent verification. **No v8.7 execution is ordered or performed by this file.** |
| Evidence base | The seven audit artifacts enumerated in §10.2, read live on 2026-10-18 |
| Hierarchy | Project → Tasks; Task → Phases → release; Phase → commit(s) (§2) |

## 0. How to read this plan

**0.1 Honesty labels.** `مثبت` marks a claim proven by a command quoted in the audit artifacts or by an exact `file:line` read of the live tree. `~تقديري` marks an estimate, a proposal, an order-of-magnitude figure, or a source-stated count this plan did not re-derive. Every proposed artifact or command that does not exist on disk today is marked `~تقديري` and is a **proposal, never a capability claim**.

**0.2 Provenance rule.** Every research rule in this plan traces to a line in `docs/spec/v87/*` through `.opencode/audit/V87-INPUT-DIGESTS.md` (§5 gives the full map). Every defect in this plan traces to a `file:line` in the Phase-0 audit set (§6). Nothing here is reconstructed from memory.

**0.3 Language.** `AGENTS.md` hard rule 5 makes this repository English-only, so this node drafts **no Arabic mirror** — the scribe's default EN+AR parity is not applied on this repo (recorded, not silently dropped; the same deviation is recorded at `V87-INPUT-DIGESTS.md:527`). The lane's mandated honesty labels (`مثبت` / `~تقديري`) are retained verbatim because acceptance item 8 names them.

**0.4 Label of this artifact.** This plan is a **draft**: it is planned-under-verification until wave-3 `r-review` (kit-law findings) and `r-verify` (independent re-derivation) return. Where the plan names a value the owner must rule on, it names the decision and the options and stops — it does not guess (§9.2).

## 1. Vision and scope — what 8.7 must be

### 1.1 The vision

**v8.7 is the release that makes the Arsenal able to govern its own execution with mechanisms instead of prose.** It ships three pillars as installed, gated machinery; closes (or explicitly carries) the whole Phase-0 defect census; and hardens the surface where the kit meets OpenCode (skills interop, CI coverage, hook wiring, permissions, command roots). The evidence-derived workflow shape it must realize is:

> `TRIGGER → PLAN-ARTIFACT → IMPLEMENT → VERIFY → REVIEW → HUMAN SIGN-OFF → COMMIT`, with a circuit breaker in every loop and an honesty label on every claim (`SYNTHESIS-v8.7.md:377-386`, via `V87-INPUT-DIGESTS.md:305`).

Three laws travel with that shape and are non-negotiable in this plan:

- **Pillar 1 — Memory Layer Design:** a dedicated, outcome-fed, cost-separated memory write-path; claim-graph precision over vector blur (`SYNTHESIS-v8.7.md:354-359`).
- **Pillar 2 — Adversarial Testing Doctrine:** "Green ≠ correct — **law-grade**"; independent test oracle; prove the oracle by breaking code on purpose (`SYNTHESIS-v8.7.md:361-366`).
- **Pillar 3 — Context-Engineering Precision:** context is a budget — small, scoped, declared, fresh; "3 most relevant books", not everything; reference-is-the-spec (`SYNTHESIS-v8.7.md:368-373`).

### 1.2 Baseline the plan is measured against (measured 2026-10-18, `مثبت`)

| Surface | Observed | Source |
|---|---:|---|
| Shipped tags | 12 (newest `v0.7.7`; the `v7.5` alias carries the `[0.7.5]` heading) | `V87-ENUM.md:20-34`, `:234` |
| Program labels | v0.8 → v8.6, **plan-only**, zero tags, zero changelog entries | `V87-ENUM.md:240-253` |
| Kit lock | 157 components + 9 pending (32 core / 125 conditional; 80 verified / 77 unverified) | `V87-COMPAT-FINDINGS.md:226-238` |
| Catalog mirror | 2,931 records across 16 kinds; 16 sidecars | `V87-FEATURE-AUDIT-2.md:192-203` |
| Agents | 27 files (3 primary leaders, 24 subagents) | `V87-COLOR-FINDINGS.md:126-133` |
| Skills | 37 folders | `V87-COMPAT-FINDINGS.md:113-116` |
| Commands | 18 in `.opencode/commands/` + 4 in `.opencode/command/` | `V87-COMPAT-FINDINGS.md:232-235` |
| Six gates | all exit 0 (`verify-registry` 7/7 · catalog `--check` ok · `verify-kit` 22/22 · `verify-skills` 10/10 · `tsc` · `shellcheck`) | `AI_GUIDE.md:212-224`, `V87-COMPAT-FINDINGS.md:51-59` |
| Model routing | split implemented **in dispatch convention only** — zero config file, zero frontmatter pins | `V87-COMPAT-FINDINGS.md:152-168` |

**No shipped tag exists above `v0.7.7`** (`V87-ENUM.md:234`). "8.7" is therefore a **program label** today, not a shipped version, and the archived program stops at v8.6 (`V87-ENUM.md:249`). Resolving what the `8.7` label means as a version identity is PH-A's first deliverable (§4.1), because the lock carries no kit semver at all (`V87-ENUM.md:305`, defect D10).

### 1.3 The stop boundary

**At v8.7, stop.** The task ends when the v8.7 release exists (Omar-authored tag + published release) and its evidence bundle is archived. Explicitly out of scope:

- The post-v8.6 integrated comms channel is a **separate future project** and is not planned here (`V87-ENUM.md:249`, quoting `docs/99-archive/VTA-FACTORY-PLAN-SURGICAL.md:16`).
- No phase in this plan merges, tags, or releases anything on its own authority; the park rule (§3.2) holds at every level.
- No phase retro-fits v8.0–v8.6: those labels never shipped and this plan does not manufacture release history for them.

### 1.4 Non-goals

- This document plans; it does not execute. Zero code, zero installs, zero dispatches, zero git writes were performed to author it.
- No new dependency is proposed for the Node-only toolchain (`AGENTS.md` hard rule 1).
- No component is pinned to a model in a file: the owner routing law stands as a **dispatch parameter** (`WORKFLOW.md:105`, `AGENT.md:226`).
- No generated surface (catalog mirror, per-kind index, lock mirror) is hand-edited by any phase (`AGENTS.md` hard rules 2–4).

## 2. The hierarchy spec (owner-defined)

### 2.1 Level 0 — Project (the Arsenal)

| Field | Definition |
|---|---|
| Identity | Vantrilex Arsenal: an OpenCode plugin plus a component Registry (`AGENT.md:9-16`) |
| Owner and sole mediator | Omar. Omar alone approves plans at high risk, alone authorizes release, and is the only mediator on cross-role conflict (`SYNTHESIS-v8.7.md:345`) |
| Contents | an ordered ledger of **Tasks**, a milestone view over them, and a **compound layer** (memory fed by outcomes) |
| Success condition | "the kit staying honest" — verifiers exit 0, every locked component resolves, docs describe the tree as it is (`AGENT.md:14-16`) |
| Artifact | `AGENT.md` (live memory) + `WORKFLOW.md` (standing methodology + current task); both orchestrator-only |

### 2.2 Level 1 — Task (for this plan: `v8.7`)

A Task is one release-sized outcome with its own plan, its own phase list, and exactly **one** release at the end.

| Field | Definition |
|---|---|
| id | release label, e.g. `v8.7` |
| release target | the tag/release the task produces; a Task with no release target is not a Task |
| task plan | the MISSION-PLAN-class artifact; for this plan, **this document** |
| phase list | ordered phases, each dependency-declared (§4.0) |
| entry criteria | prior task's release closed; owner commission recorded; inputs present and authenticated |
| exit criteria | release published, audit passed, evidence bundle archived, memory updated, `AGENT.md`/`WORKFLOW.md` true |
| gates | the five human gates + risk tiering of §3.4, applied once per task |
| park behaviour | on halt: branch alive, work preserved, nothing merged/tagged/released, halt announced with evidence |

### 2.3 Level 2 — Phase

A Phase is the **unit of reviewable scope**: if a phase cannot be approved at a glance, it is too large and splits (`worker-4-decomposition.md:20-23`; ledger L7).

| Field | Definition |
|---|---|
| id + mission | one sentence of outcome, e.g. `PH-C` — install the adversarial testing doctrine |
| inputs | named files/artifacts + the previous phase's exit evidence |
| declared context budget | the exact file list this phase may read and edit (Pillar 3 / L31) |
| deliverables | the artifacts the phase produces, each with a path |
| commit(s) | one or more Conventional Commits, one concern each |
| verification gates | the mechanical gates this phase must pass, with commands |
| rollback / park | the revert path and the park condition |
| actors | which named agent does which step |
| exit criteria | **artifact exists AND its verification passes AND the next phase's input is ready** (`worker-4-decomposition.md:161`); no phase is done on assertion |

### 2.4 Level 3 — commit(s) and release

| Field | Definition |
|---|---|
| commit | one concern, Conventional Commit type, on the task branch; carries a reference to its evidence bundle; update-in-place (version history lives in git, never in forked filenames) |
| evidence bundle | the artifacts that travel with the commit/release: gate output, verdict ledger, census re-count (`worker-5-human-gates.md:100-102`) |
| release | annotated tag + published release + CHANGELOG section; authored only by Omar's authority through the release workflow (`scripts/release.sh:128`, `.github/workflows/release.yml:3-5`) |

### 2.5 Rules binding the hierarchy

1. **One writer per file per wave** (Arsenal single-writer law, `AGENTS.md` hard rule 4). Two phases that share a path are serialized.
2. **Serial by default, parallel by proof of independence.** Parallel work is allowed only for non-interfering units with per-worker artifact contracts (`worker-4-decomposition.md:173`; ledger L9, ADAPT-4).
3. **Every boundary is mechanical.** A `STOP` in a prompt is not a plan mode (`worker-4-decomposition.md:30`, `:167`); boundaries are enforced by permissions, separate sessions, or an Omar-mediated checkpoint (ledger L6).
4. **No silent re-planning.** The plan is a contract; only the deviation ladder of §3.4 may change it (ledger L5).

## 3. The three workflow levels, complete

### 3.1 Level 1 — Phase workflow → commit(s)

Canonical order: **Trigger → Plan → Implement → Verify → (Review) → Commit.**

| # | Step | Actor | Entry criteria | What happens | Exit criteria | Gate that closes it |
|---|---|---|---|---|---|---|
| 1 | Trigger | task orchestrator (leader seat) | previous phase exit verified; inputs present; work order drafted | dispatch the phase as a work order naming id, mission, files, exam, risk tier | a work order exists with all §2.3 fields | dispatch gate: a work order missing any field is not dispatched (`WORKFLOW.md:84-98` pattern) |
| 2 | Plan | orchestrator authors; Omar approves at standard/high risk | work order drafted | restate understanding, name real files, existing patterns, constraints, risks, proposed change, **verification method**, then **stop** (`worker-1-plan-handoff.md:12`) | plan artifact + exam + assumption/risk ledger accepted | **Human Gate A** (plan/spec approval) |
| 3 | Implement | named worker (`vantrilex-implementer` and specialists) in an isolated worktree | Gate A passed; context budget declared | small scoped chunks; TDD micro-cycles; read-only investigation before any edit; **debug work uses its own shape**: Freeze → Reproduce → Explain (read-only) → Hypothesize → Smallest fix → Layered verify → Review → Document (`worker-4-decomposition.md:52-54`) | diff limited to the declared file list; root cause stated before any fix (L26) | implementation gate: scope check + root-cause statement |
| 4 | Verify | `vantrilex-verifier` / `vantrilex-harness`, never the implementer | implementation gate passed | run the six gates + the phase's own oracle; prove the oracle by breaking code on purpose; re-run the exact check that covers the touched files | every gate exit 0; oracle-proof recorded; no SKIPPED claimed as PASS | **mechanical verify gate** (§3.4) |
| 5 | Review | `vantrilex-reviewer`, fresh context, different role | verify gate passed | review against a **written** standard only; findings with `file:line` | findings adjudicated (apply / defer with reason / reject with reason) | **Human Gate B** (checkpoint/diff review) at standard/high risk |
| 6 | Commit | worker commits, orchestrator integrates | review clean | one commit per concern; attach the evidence bundle; write the memory delta **from the outcome** | commit exists, evidence attached, memory updated | **Human Gate C** (merge sign-off) at task level |

**Artifacts of a phase.** Work order · plan with exam + risk ledger · the diff · gate output · verdict ledger · evidence bundle · memory delta · the commit(s). No phase artifact may live only in chat (`worker-4-decomposition.md:82`).

**Circuit breakers inside a phase.** Bounded retry against the same oracle (max 2 rounds per node) → escalate with evidence → Omar revises the plan or the phase restarts from a clean state → the lesson enters memory (L5). A third fix attempt on the same defect id trips the 3-strike halt and produces an incident report instead of a fourth attempt.

**Declared context budget.** Every work order carries the exact read/edit file list and a token ceiling for the phase (Pillar 3). Baseline evidence for why: a declared file list cut prompt tokens `87K → 9K` in the corpus (`worker-3-memory.md:101-102`).

**Where the phase boundary is a session boundary.** The 20–30 turn cliff is a hard reason to close a phase session and open a fresh one for the next phase (`worker-3-memory.md:111-112`; ledger L32).

### 3.2 Level 2 — Task workflow → release

Canonical order: **Plan → Phases → Integrate → Audit → Release.**

| # | Step | Actor | Entry | Exit | Gate |
|---|---|---|---|---|---|
| 1 | Plan | AETHER authors the task plan; Omar approves | owner brief + inputs authenticated | a task plan with phase list, per-phase acceptance, release target, and stop boundary | **Human Gate A** at task level |
| 2 | Phases | orchestrator runs §3.1 once per phase | task plan approved | every phase exit criterion met; per-phase commits on the task branch | gate C per phase |
| 3 | Integrate | orchestrator, dependency order | all phases landed | integrated tree; census re-counted live; no phase's artifact contradicts another | integration gate |
| 4 | Audit | independent `vantrilex-verifier` + `vantrilex-reviewer` (author ≠ judge) | integration complete | tri-state verdict ledger; every number re-derived; findings routed | **audit gate** |
| 5 | Release prep | `vantrilex-releaser` (prep-only) then `github-release-packager` (sole executor) | audit passed; tree clean; CHANGELOG section present | a versioned handoff package; nothing published | **Human Gate D** (release authorization) |
| 6 | Release | **Omar alone** | Omar's word | annotated tag pushed, release published, workflow `v*` green | release gate |
| 7 | Park/announce | orchestrator | release verified | announce → independent verify → memory updated; branch closed per protocol | **Human Gate E** applies if anything irreversible remains |

**The park rule, stated exactly.** No merge, no tag, no release without Omar. Phases and tasks park by leaving the branch alive with the work preserved and the halt announced with evidence — a blocked gate stops the run before the next dispatch; a failed gate returns the work to its owner with the evidence attached (`WORKFLOW.md:115-119`).

**Audit is not review.** Review is advice by default; audit re-derives numbers independently. The measured hierarchy is what fixes their weight: independent acceptance tests lifted gate pass rates 70% → 84%, while reviewer agents alone scored 68% — worse than no gate — at higher cost (`worker-2-verification.md:23-28`, `:107`; `SYNTHESIS-v8.7.md:89`). Therefore reviewers are **advisory** unless a written enforceable standard exists (lock schema, registry schema, doctrine text), and tests are the primary gate.

**Evidence bundle ships with the release**, never the code alone (`worker-5-human-gates.md:100-102`): gate output with exit codes, the census re-count, the verdict ledger, the oracle-proof record.

### 3.3 Level 3 — Project workflow → the Arsenal

Canonical order: **Vision → Tasks → Milestones → Compound.**

| # | Step | Actor | Entry | Exit | Gate |
|---|---|---|---|---|---|
| 1 | Vision | Omar states the brief; AETHER runs PREPARE → PLAN → STOP | an owner brief exists | a MISSION-PLAN-class plan with a stop boundary | Gate A; AETHER stops and hands off (`aether.md:91-128`) |
| 2 | Tasks | Omar commissions; BLAZAR intakes and executes | an intaken plan that passes the 10-field check (`blazar.md:277`) | each task's release published | Gates A–E of §3.4 per task |
| 3 | Milestones | owner + orchestrator | tasks landed | a milestone is a **series of released tags**, never a plan label; plan-only labels are labelled plan-only | milestone gate: no milestone claim without its tag (`V87-ENUM.md:253`) |
| 4 | Compound | the memory layer | each release closes | outcomes become rules; the baseline file shrinks as the kit improves (`worker-3-memory.md:144-145`) | memory gate: every new rule passes the three-criteria bar (L29) |

**Human authority is concentrated, not distributed.** Five gates carry it (plan approval, checkpoint review, merge sign-off, release authorization, destructive-action confirmation — `worker-5-human-gates.md:167`), risk-tiered by blast radius (§3.4), and "no credible internal source describes unsupervised merge" (`worker-5-human-gates.md:29`).

**PULSAR's place.** PULSAR explores plan assumptions through hypothesis-first investigation and returns capsules to AETHER only; it never revises the plan and never hands raw findings to the build lane (`pulsar.md:214-225`).

### 3.4 Gates, circuit breakers, and risk tiers (shared across all three levels)

**A. The five human gates (Omar's authority).**

| Gate | Name | Trigger | Omar's decision |
|---|---|---|---|
| A | Plan/spec approval | a task plan or a standard/high-risk phase plan is complete | approve, revise, restart |
| B | Checkpoint/diff review | a phase's diff + evidence exist | accept, return with findings |
| C | Merge sign-off | phase commits are integrated and verified | merge, or park |
| D | Release authorization | release prep complete, audit passed | release, or hold |
| E | Destructive/irreversible confirmation | the action cannot be undone (delete, history rewrite, publish) | confirm, or refuse |

**B. Risk tiers (Arsenal-mapped).**

| Tier | Examples | Required path |
|---|---|---|
| Low | docs, formatting, comments | auto-approved after the mechanical gates pass; no human in the loop |
| Standard | code, skills, agent text, command text | mechanical gates + independent verify + Omar sign-off |
| High | `kit/kit.lock`, lock schema, `registry/*`, release, CI permissions | Omar + evidence bundle; **a bot's approval never substitutes for the required human** (`worker-5-human-gates.md:67`) |

**C. Mechanical gates.** The six enforced gates must each exit `0` before a change is claimed done (`AI_GUIDE.md:216`), plus: the adversarial probe battery (`node .opencode/plugin/arsenal.findings-probe.mjs`, 45/45), the skill-format gate (already inside `verify-skills`), and `markdownlint-cli` as an **additional** gate that CI does not run (`docs/08-VERIFICATION.md:99-100`). A skipped check is never a pass; a gate that cannot run is a failed gate.

**D. Circuit breakers (every loop).**

| Loop | Cap | On cap |
|---|---|---|
| Fix rounds per node | 2 | escalate with brief + attempts + outputs |
| CI rounds | 2 | fix everything locally first, then stop |
| Review rounds | 3 | the author must reconsider the approach, not iterate |
| Same defect id | 3 consecutive failed fixes | halt; emit an incident report instead of a fourth attempt |
| Task-level follow-ups on a bad run | 0 beyond budget | restart from a clean state or escalate; never a tenth follow-up (REJECT-7) |

**E. Escalation ladder (no silent re-planning).** (1) retry against the same verification oracle, bounded; (2) escalate to Omar with evidence; (3) Omar decides: revise the plan (re-approve) or restart from clean state; (4) the lesson is written into durable memory (`worker-1-plan-handoff.md:67`; ledger L5).

**F. Escalation triggers (designed behaviour, not failure).** E1 genuine ambiguity → `STATUS: NEEDS_ANSWERS` / `requires_user_action` is the **correct output**; E2 loop non-convergence; E3 an unsafe assumption; E4 a destructive/irreversible action; E5 judgment-heavy steps never delegated; E6 context degradation (phase-boundary reset) (`worker-5-human-gates.md:112-137`).

**G. Darkship stage.** Kit/registry-visible changes activate through a production-observation stage between merge and full activation, with the exit from darkship human-operated (`worker-5-human-gates.md:85-88`; ledger L14). In Arsenal terms: the change lands on the branch and is observed in a live run (target project or probe) before the release tag.

## 4. The v8.7 Task — the phase program

### 4.0 Phase index and DAG

| Phase | Mission (one line) | Depends on | Writes (single-writer paths) |
|---|---|---|---|
| `PH-A` | Establish release truth and version identity | — | `CHANGELOG.md`, `AGENT.md` current-state block, `README.md` census, `docs/09-*`, `docs/16-*`, `kit/kit.lock` identity block |
| `PH-B` | Install the Memory Layer (Pillar 1) | `PH-A` | `AGENTS.md`, `AI_GUIDE.md` memory section, memory docs, memory skill (proposed) |
| `PH-C` | Install the Adversarial Testing Doctrine (Pillar 2) | `PH-A` | `scripts/` (oracle harness, proposed), testing docs, testing skill (proposed) |
| `PH-D` | Install Context-Engineering Precision (Pillar 3) | `PH-A` | context docs, work-order template assets, skill asset templates |
| `PH-E` | Defect remediation (registration + colour regime + docs truth) | `PH-A`, `PH-B`, `PH-C`, `PH-D` | `.opencode/agents/*.md` frontmatter, `registry/`, `kit/kit.lock` rows, `.opencode/commands/*`, `docs/18-*`, themes (proposed) |
| `PH-F` | Compat and CI hardening | `PH-C`, `PH-E` | `.github/workflows/ci.yml`, `.opencode/plugin/arsenal.ts` (hook resolution), `.opencode/skills/*/SKILL.md` descriptions, command-root decision |
| `PH-G` | Convergence, soak, and release candidacy | all | convergence docs, provenance decision record, evidence bundle |

**DAG:** `PH-A → (PH-B ∥ PH-C ∥ PH-D) → PH-E → PH-F → PH-G → integrate → audit → release`.

The three middle phases run in parallel **because their write sets are disjoint** and each carries a per-worker artifact contract (§2.5 rule 2). `PH-E` is serialized after all three because it edits agent frontmatter and registry rows that the pillars' outputs feed, and `PH-F` after `PH-E` because CI assertions must match the post-remediation census.

Every phase below states: mission · inputs · deliverables · commit(s) · verification gates · rollback/park · actors · declared context budget. Proposed paths are marked `~تقديري`.

### 4.1 `PH-A` — Release truth and version identity

- **Mission.** Make "v8.7" mean exactly one thing: reconcile the shipped series with the CHANGELOG status lines, close the naming defect, and give the kit a machine-readable version identity.
- **Inputs.** `V87-ENUM.md` §1 and §3 (D1–D11), `V87-FEATURE-AUDIT-2.md` B4/B6, `AGENT.md:20` (live state), `CHANGELOG.md:12-18`, `:167-173`, `:367-373`, `:1344-1353`, `kit/kit.lock:1-5`, `README.md:252-263`, `docs/16-*`, `docs/09-KIT-LOCK.md:7`.
- **Deliverables.**
  1. A **version-identity ruling request** to Omar with two options and their consequences (below) — a decision, not a guess.
  2. `CHANGELOG.md` repaired: the three `PARKED, UNRELEASED` status lines corrected against `git tag` + `AGENT.md:301-303` (line drift: ENUM measured `AGENT.md:288-290`; live file +13 → `:301-303`); link references for `[0.7.5]`, `[0.7.6]`, `[0.7.7]` added; `[Unreleased]` baseline moved off `v0.7.0` (D1, D2, D3, D6, D7).
  3. `AGENT.md` current-state block refreshed (branch, HEAD, newest tag) — orchestrator-only write (D5).
  4. `README.md` census corrected to 157 / 32+125 / 80+77 (D8) and `docs/16-*` to the same census (D11).
  5. A kit **version identity field** in the lock chain (D10) — schema-validated, generating a `verify-kit` row.
- **The version-identity decision (owner gate, §9.2).** Option A: 8.7 ships as an ordinary continuation of the shipped 0.x series (a `v0.8.x` tag family) and "8.7" is recorded as a **program label** mapped to it. Option B: 8.7 ships as the literal tag `v8.7`. Consequence of B without a mapping rule: the shipped series becomes unsortable a second time, exactly as `v0.7.0 → v7.5 → v0.7.6 → v0.7.7` already is (`V87-ENUM.md:299`, D4). This plan does not choose.
- **Commit(s)** `~تقديري`: `docs(changelog): reconcile parked status with released tags`; `fix(docs): correct README and dispatch census to 157/9`; `feat(kit): add kit version identity to the lock chain`.
- **Verification gates.** `node scripts/generate-catalog-json.mjs --check` exit 0 (if any indexed doc is touched) → `node scripts/verify-registry.mjs` exit 0 → `node scripts/verify-kit.mjs` exit 0 (must include the new identity row) → `npx --no-install markdownlint-cli` on every touched file, exit 0.
- **Rollback / park.** Every change here is text in tracked files: `git revert` of the phase commits. If Omar has not ruled on version identity, the phase **parks after deliverable 1** and the rest waits; a parked phase announces with evidence and suppresses nothing.
- **Actors.** `vantrilex-scribe` (docs drafts), `vantrilex-librarian` (census + identity row, version-qualified), `vantrilex-kit-maintainer` (lock/schema write), orchestrator (state block), Omar (the ruling).
- **Declared context budget.** Read: `CHANGELOG.md`, `AGENT.md`, `README.md`, `docs/09-*`, `docs/16-*`, `kit/kit.lock`, `kit/kit.lock.schema.json`, `V87-ENUM.md`. Edit: the six listed deliverables only.

### 4.2 `PH-B` — Memory Layer Design (Pillar 1)

- **Mission.** Replace hoped-for memory with an outcome-fed, cost-separated, claim-graph-precise memory layer whose write-path is automatic and whose rules must earn their place.
- **Inputs.** `V87-INPUT-DIGESTS.md:301-305` (pillar text), `worker-3-memory.md:185-194` (the ten recommendations), `instagram-v8.7-context.md:5-7`, `:22`, `AGENTS.md` (current constitution), `AGENT.md` (live memory), `kit/kit.lock` RAG entries (`registry/rag/01-*` … `10-*`).
- **Deliverables.**
  1. **Baseline behavioural file, tightened**: a short baseline (`< 200` lines, shrinking) holding behavioural rules only, zero project facts — the corpus's own shape (`worker-3-memory.md:11-18`, `:185`). Per repo law that file's edits land through `AGENTS.md` + `AI_GUIDE.md`, and only the owner may ratify a new rule.
  2. **Outcome-fed write path**: a written procedure that memory entries originate **only** from gate failures, corrections, and incidents, each carrying its *why* (`worker-3-memory.md:186`; `SYNTHESIS-v8.7.md:279`). Automatic, not human-authored: the loop writes it (`worker-3-memory.md:81-82`).
  3. **Three-criteria admission bar** for new rules: non-obvious · repeatedly encountered · specific enough to act on (`worker-3-memory.md:187`).
  4. **Traps, not maps**: store anti-patterns; architecture stays discoverable by reading the code (`worker-3-memory.md:188`).
  5. **Claim-graph representation**: atomic addressed records with status fields; **no** vector-blur retrieval (L34, `worker-3-memory.md:192`).
  6. **Cost separation**: the memory role is a separate, cheaper seat that never spends a working agent's token budget (`worker-3-memory.md:193`).
  7. **Session-close ritual** + `AIDEV-*`-style grep-able inline anchors for memory that must survive a context reset (`worker-3-memory.md:87`, `:129`).
  8. Git-as-substrate rule: decisions, specs, and triage logs are committed, not chat-borne (`worker-3-memory.md:194`).
- **Commit(s)** `~تقديري`: `docs(memory): specify outcome-fed memory write path`; `feat(memory): add claim-graph memory records`; `docs(agents): tighten baseline behavioural file`.
- **Verification gates.** `node scripts/verify-kit.mjs` exit 0 (any `registry/rag` or lock row touched) → `node scripts/verify-skills.mjs` exit 0 (any skill touched) → markdownlint exit 0 on touched files → the phase **own oracle**: an injected gate failure must produce a memory record, proven by breaking a gate on purpose and observing the record (adversarial standard, Pillar 2 applied to Pillar 1).
- **Rollback / park.** Revert the phase commits; memory rows are additive and independently revertible. Park if the write-path cannot be made automatic — a human-written memory rule is the REJECTed pattern (`worker-3-memory.md:186`) and must not ship as if it were the doctrine.
- **Actors.** `vantrilex-kit-maintainer` (RAG + lock rows), `vantrilex-scribe` (docs), `vantrilex-verifier` (oracle proof), orchestrator (state files), Omar (ratifies any new standing rule).
- **Declared context budget.** Read: the digest §3.4 pillar block, `worker-3-memory.md`, `AGENTS.md`, `AGENT.md`, `registry/rag/*.json`, `kit/kit.lock`. Edit: the memory docs + rag rows + memory skill only.

### 4.3 `PH-C` — Adversarial Testing Doctrine (Pillar 2)

- **Mission.** Make "green" stop meaning "correct": an independent oracle, mechanically enforced, with mutation/strength proof on critical paths.
- **Inputs.** `SYNTHESIS-v8.7.md:361-366`, `worker-2-verification.md:63-77`, `:102-108`, `instagram-v8.7-context.md:11-13`, `AI_GUIDE.md:212-224` (the six gates), `scripts/verify-*.mjs`, `.opencode/plugin/arsenal.findings-probe.mjs`.
- **Deliverables.**
  1. **Test-author separation, mechanized**: the test author receives the *spec* and never the implementation; acceptance tests live **outside the repository tree**; reads of them are denied by permission, not by prompt (`worker-2-verification.md:63-69`).
  2. **Oracle-proof step** in every phase gate: break the code on purpose, confirm a test fails (`SYNTHESIS-v8.7.md:364`).
  3. **Mutation/strength check** on critical paths — the Hardener's rule: one deliberate mutation at a time, records every survivor, **forbidden from fixing** (`worker-2-verification.md:31-34`).
  4. **"LLM never touches tests"** on critical paths, enforced mechanically (settings/allow-list), not by prose (`worker-2-verification.md:70`).
  5. **Anti-gaming checks** named in the gate: `.skip`, deleted tests, removed linter, vacuous assertions (`assert status_code in [200,500]`), hidden-test hunting (`worker-2-verification.md:65`, `:72`, `:76`).
  6. **Surviving-assertion metric** replacing acceptance-rate/green-checkmark vanity metrics (REJECT-4).
- **Commit(s)** `~تقديري`: `feat(scripts): add independent test oracle harness`; `feat(verify): add oracle-proof and mutation-strength checks`; `docs(verification): specify adversarial testing doctrine`.
- **Verification gates.** `node scripts/verify-skills.mjs` exit 0 → `bash -n` + `shellcheck` on any new script → `node --check` on any new `.mjs` → `node scripts/verify-kit.mjs` exit 0 (new components) → the harness must **fail** on a deliberately broken test and **pass** on the control (a two-sided probe: a check that cannot fail is not a gate).
- **Rollback / park.** Remove the harness commit; no production path depends on it until `PH-F` wires it into CI. Park if permission enforcement cannot be expressed on the host — then say **unverified** and carry the gap to §9, never claim the mechanism.
- **Actors.** `vantrilex-harness` (adversarial probe), `vantrilex-verifier` (gate wiring), `vantrilex-implementer` (the oracle harness), `vantrilex-kit-maintainer` (component rows).
- **Declared context budget.** Read: `worker-2-verification.md`, `SYNTHESIS-v8.7.md` pillar 2, `AI_GUIDE.md` §4, `scripts/*`, `tsconfig.json`. Edit: new oracle harness + testing docs + testing skill only.

### 4.4 `PH-D` — Context-Engineering Precision (Pillar 3)

- **Mission.** Turn context into a declared, budgeted, scoped resource: precision over volume.
- **Inputs.** `SYNTHESIS-v8.7.md:368-373`, `worker-3-memory.md:101-134`, `:189-192`, `instagram-v8.7-context.md:17-19`, `WORKFLOW.md` §7 (kit loadout), `.opencode/skills/vantrilex-workflow-forge/assets/workflow-md-template.md`.
- **Deliverables.**
  1. **Declared context budget** in the work-order template: exact file list per task, token ceiling per module (corpus baseline ~30k tokens per module; measured `87K → 9K` on a declared list — `worker-3-memory.md:106`, `:101-102`).
  2. **Scoped conditional rules**: no global unconditional rules; rules apply by subdirectory (`worker-3-memory.md:118-119`).
  3. **"Three most relevant books" retrieval rule** — precision retrieval, not dump (`instagram-v8.7-context.md:17`).
  4. **Reference-is-the-spec**: work orders point at the lock, the registry, and the code instead of re-describing them (ADAPT-6).
  5. **Fresh-context discipline**: phase boundary = session boundary; context resets at the 20–30 turn cliff (`worker-3-memory.md:111-113`).
- **Commit(s)** `~تقديري`: `docs(context): declare per-task context budgets`; `feat(skills): add reference-is-the-spec work-order template`.
- **Verification gates.** `node scripts/verify-skills.mjs` exit 0 (template lives in a skill's `assets/`) → markdownlint exit 0 on touched docs → a worked example: one real work order produced from the template, with its declared list and measured size recorded (fixture-only proof never closes a live gate — `WORKFLOW.md:67`).
- **Rollback / park.** Revert the template commit; nothing consumes the template until `PH-E`/`PH-F` reference it.
- **Actors.** `vantrilex-scribe` (docs), `vantrilex-kit-maintainer` (skill assets), `vantrilex-verifier` (worked example).
- **Declared context budget.** Read: `worker-3-memory.md`, `SYNTHESIS-v8.7.md` pillar 3, `WORKFLOW.md`, skill assets. Edit: context docs + work-order template + skill assets only.

### 4.5 `PH-E` — Defect remediation (registration, colour regime, docs truth)

- **Mission.** Close the Phase-0 defect census: unregistered components registered, the colour regime ruled and applied, broken surfaces repaired, stale docs made true.
- **Inputs.** The whole §6 table: `V87-ENUM.md` D1–D11, `V87-COLOR-FINDINGS.md` F-COLOR-01…08 + C1–C7, `V87-COMPAT-FINDINGS.md` C-01…C-11, `V87-FEATURE-AUDIT-1.md` F-A1…F-A7, `V87-FEATURE-AUDIT-2.md` F1–F5, plus `V87-DEFECTS.md` (the sibling consolidation — referenced by category, never a blocker).
- **Deliverables.**
  1. **Registration:** 7 agent files (`vantrilex-agent-maker`, `-guide`, `-implementer`, `-kit-maintainer`, `-leader`, `-puller`, `-uploader`) and 19 skill folders given lock + sidecar rows, **or** an explicit `relay-protocol`-style deliberate-unregistered statement (F-A3, F-A4; `kit/kit.lock:164-173` is the precedent for a declared reason).
  2. **Two BROKEN consult commands repaired**: `V-Technical-Writer.md` → `vantrilex-scribe`, `V-Ai-Generated-Code-Security-Auditor.md` → `vantrilex-security-auditor` (F-A1; the four sibling commands were already remediated, `V87-FEATURE-AUDIT-1.md:250`).
  3. **Role-switch themes:** author `registry/themes/vantrilex-{guide,implementer,leader}.json` or re-point the three `V-Vantrilex-*` commands at an existing theme (F-A2, and the double-prefixed ids of `V87-COLOR-FINDINGS.md:302-304`).
  4. **The colour regime, per Oman's ruling (§9.2)**: either the no-colour rule that 12 subagent files already enforce stands and `docs/18-THEMES.md:95` is amended, or the 7-group palette is written to disk as the group definition and applied to all 27 agents (F-COLOR-01, F-COLOR-02, F-COLOR-06, C1, C6, C7). Note `#22D3EE` (exploration) occurs **zero** times outside the V87 deliverables, the audit set, and AGENT.md (the SC-4 exclusion set) today (F-COLOR-04), and `#8B5CF6` is already a collision between `external` and `operate` (F-COLOR-03).
  5. **Stale docs made true:** `docs/18-THEMES.md` mapping (`blazar` + three non-existent RESERVED agents; `aether`/`pulsar` omitted — F-COLOR-07), the `relay-protocol` census drift (8 documented, 9 on disk — F-A6), the `CHANGELOG`/archive link breaks (F2), truncated URLs in the generated mirror (F3) — the last two through their **generator/sidecar**, never by hand.
- **Commit(s)** `~تقديري`: `fix(agents): repair two consult commands to live agent files`; `feat(registry): register 7 agents and 19 skills or declare them unregistered`; `feat(themes): author the three pending role themes`; `fix(docs): refresh theme mapping and census`.
- **Verification gates.** `node scripts/generate-catalog-json.mjs --check` exit 0 → `node scripts/verify-registry.mjs` exit 0 → `node scripts/verify-kit.mjs` exit 0 → `node scripts/verify-skills.mjs` exit 0 → a **reference scan** proving zero command points at a non-existent agent file (the check that found the two BROKEN commands, re-run) → markdownlint exit 0 on touched files.
- **Rollback / park.** Registry/lock changes revert as one commit set; **generated surfaces revert by regenerating**, never by editing. Park if the colour ruling has not arrived: the phase must not pick a palette on the builder's authority.
- **Actors.** `vantrilex-kit-maintainer` (lock, registry, themes), `vantrilex-scribe` (docs), `vantrilex-verifier` (reference scan + gates), Omar (colour and naming rulings).
- **Declared context budget.** Read: the four audit artifacts + `registry/data/*`, `kit/kit.lock`, `registry/themes/*`, `.opencode/commands/*`, `docs/18-*`. Edit: those paths only, and generated files only through `scripts/generate-catalog-json.mjs`.

### 4.6 `PH-F` — Compat and CI hardening

- **Mission.** Close every place where the kit meets OpenCode and the guarantee is ambiguous: skill twins, skill allow-lists, command roots, hook resolution, and CI coverage.
- **Inputs.** `V87-COMPAT-FINDINGS.md` C-01…C-11 (quoted in §6), `V87-FEATURE-AUDIT-2.md` F4 and F1, `V87-FEATURE-AUDIT-1.md` F-A5 and F-A7/D8, `.github/workflows/ci.yml`, `vantrilex-guards.ts`, `.opencode/plugin/arsenal.ts`.
- **Deliverables.**
  1. **`vs-*` interop closed:** either an agent/command surface that can load a `vs-*` skill (today **0 of 27** agent files grant one, C-01) or a written statement that they are not agent-loadable; and **distinct `description:` lines** for the 5 twin pairs with byte-identical sentences, since skill selection between `X` and `vs-X` cannot be deterministic as-is (C-02, F-A5).
  2. **Command entry points name real skills:** 0 of 22 command files name any `vs-*` id today (C-03) — decide and write down which surface owns them.
  3. **One command root or a declared loader:** `.opencode/command` (4) and `.opencode/commands` (18) coexist with no gate asserting which one the host loads (C-09).
  4. **CI coverage closed** (F4): the permanently skipped checkpoint step (`ci.yml:141` tests `docs/17-CHECKPOINT.md`, which does not exist — the file is `docs/17-V2-HOOK-GAP.md`) resolved to target-project scope or dropped; `verify-skills.mjs` wired into CI; the mode assertion extended to `scripts/migrate-to-opencode-v2.sh` (100644 today) and `.githooks/*`.
  5. **Documentation lint wired or declared:** the two new MD037 errors and one MD032 error (`AGENT.md:108/203`, `WORKFLOW.md:76`) are state-file prose owned by the orchestrator (C-06, C-07, F1) — fixed by the owner of those files, and the lint step either enters CI or is documented as deliberately CI-excluded.
  6. **`[arsenal] typescript-check` resolved** (F-A7, D8): the hook's exact resolved command exits 0 while the live emission reports FAIL; a dedicated host-side probe must classify it as host-command-resolution vs plugin logic vs environment before any fix.
  7. **Leader frontmatter shapes unified or documented:** `blazar.md` nests `temperature` under `request.body`; `aether.md`/`pulsar.md` place it at top level (C-04); the aether accent case differs between agent file and registry (C-05).
- **Commit(s)** `~تقديري`: `fix(skills): differentiate 5 twin skill descriptions`; `feat(ci): wire verify-skills and repair the checkpoint step`; `fix(plugin): resolve typescript-check command resolution`; `docs(commands): declare the canonical command root`.
- **Verification gates.** `node scripts/verify-skills.mjs` exit 0 → `node scripts/verify-kit.mjs` exit 0 → `npx --no-install tsc --noEmit -p tsconfig.json` exit 0 → guards strict check exit 0 → `bash -n` + `shellcheck` → `node --check` → the probe battery 45/45 → a **CI dry run** (workflow lint) or an honest "cannot run here" with the gap carried.
- **Rollback / park.** CI changes revert as one commit; the plugin fix reverts independently. Park if the host-side probe cannot run on this seat: record the check as failed-not-skipped and escalate to the Guide (§9.3).
- **Actors.** `vantrilex-kit-maintainer` (skills, plugin), `vantrilex-verifier` (probes, gates), `vantrilex-reviewer` (kit-law on the allow-list), orchestrator (state-file prose), Omar (any permission change).
- **Declared context budget.** Read: `V87-COMPAT-FINDINGS.md`, `V87-FEATURE-AUDIT-1/2.md`, `ci.yml`, `vantrilex-guards.ts`, `arsenal.ts`, `.opencode/commands/*`. Edit: CI, plugin, skill frontmatter, command text only.

### 4.7 `PH-G` — Convergence, soak, and release candidacy

- **Mission.** Prove the phases compose: census re-counted, contradictions zero, soak observed, evidence bundle assembled, release candidacy handed to Omar.
- **Inputs.** All phase exit evidence, `V87-FEATURE-AUDIT-2.md` F5 (the `docs/spec/v87` provenance set is untracked), the D5 intake gap `V87-SPEC-01` (`AGENT.md:250`).
- **Deliverables.**
  1. **Full battery re-run** on the integrated tree, exits quoted.
  2. **Census re-count** matching §1.2's baseline shape with the intended deltas named.
  3. **Provenance decision recorded** (F5): version `docs/spec/v87/**` or declare it session-local — a decision for Omar, not the builder.
  4. **Spec-coherence item `V87-SPEC-01` closed**: the plan carries no `section_leader: blazar` labels and no per-role state-files cells (`aether.md` §2 anatomy vs `blazar.md` §3/§4 intake) — the conflict is amended in whichever file loses, on the owner's ruling.
  5. **Darkship observation** of kit-visible changes before the tag (L14).
  6. **Evidence bundle** for the release: gate output, verdict ledger, census, oracle-proof records, findings dispositions.
- **Commit(s)** `~تقديري`: `docs(convergence): record v8.7 census and battery evidence`; `fix(spec): resolve V87-SPEC-01 intake field conflict`.
- **Verification gates.** All six gates + probe battery + skill gate + markdownlint, each exit 0, each quoted; the independent audit (`vantrilex-verifier`) re-derives every number in the bundle.
- **Rollback / park.** Release candidacy is not a release. If any gate is red, the task **parks** in place; Omar's release gate is never opened on a red battery.
- **Actors.** `vantrilex-verifier` (audit), `vantrilex-reviewer` (kit-law), `vantrilex-scribe` (bundle), `vantrilex-releaser` (prep-only), Omar (release).
- **Declared context budget.** Read: the four deliverables + all phase evidence. Edit: convergence/provenance docs only.

## 5. Research incorporation map

Paths below abbreviate `docs/spec/v87/<file>`; the digest that consolidates them is `.opencode/audit/V87-INPUT-DIGESTS.md` §8, whose lines are given per item range.

### 5.1 Ledger items (43 numbered L1–L43 + 1 lettered addendum L11a = 44 rows)

| Item | Where it lands in this plan | Source file:line |
|---|---|---|
| L1 — plan carries restated understanding, real files, patterns, constraints, risks, change, verification, stop | §3.1 step 2; §2.3 | `worker-1-plan-handoff.md:12` |
| L2 — per-task exam + assumption/risk ledger in the work order | §3.1 step 2; §2.3 | `worker-1-plan-handoff.md:22`, `:100` |
| L3 — three approval granularities, never per-line diff approval | §3.4 A | `worker-1-plan-handoff.md:40` |
| L4 — verification plan and stop conditions travel with the build instructions | §3.1 steps 2–3 | `worker-1-plan-handoff.md:52` |
| L5 — deviation ladder; no silent re-planning | §3.4 E | `worker-1-plan-handoff.md:67`, `:102` |
| L6 — STOPs are mechanical, not prompt sentences | §3.1 step 1; §7 | `worker-1-plan-handoff.md:103`, `worker-4-decomposition.md:167` |
| L7 — phase boundary = reviewable scope; commit per checkpoint | §2.3; §3.1 step 6 | `worker-4-decomposition.md:20-24` |
| L8 — durable artifact per phase; done = artifact + verification + next input | §2.3; §3.1 exit criteria | `worker-4-decomposition.md:82`, `:161` |
| L9 — strict sequence for dependents; DAG only for independent units | §2.5; §8.1 | `worker-4-decomposition.md:89-103`, `:173` |
| L10 — debug loop has its own template | §3.1 step 3; §4.5 | `worker-4-decomposition.md:177` |
| L11 — Gate A–E set encoded | §3.4 A | `worker-5-human-gates.md:10-41` |
| L11a — five-gate minimum as the gate sequence | §3.4 A | `worker-5-human-gates.md:167` |
| L12 — Arsenal risk tiers mapped | §3.4 B | `worker-5-human-gates.md:168` |
| L13 — bot approval never substitutes on high-risk paths | §3.4 B | `worker-5-human-gates.md:67` |
| L14 — darkship observation before full activation | §3.4 G; §4.7 deliverable 5 | `worker-5-human-gates.md:85-88`, `:169` |
| L15 — NEEDS_ANSWERS is the correct output for ambiguity | §3.4 F; §9 | `worker-5-human-gates.md:113`, `:170` |
| L16 — evidence bundle ships with the commit/release | §3.1 step 6; §3.2 audit | `worker-5-human-gates.md:102`, `:172` |
| L17 — verification is a mechanical gate in every loop | §3.1 step 4; §7 | `worker-2-verification.md:42-46`, `SYNTHESIS-v8.7.md:317` |
| L18 — test author gets the spec, never the implementation | §4.3 deliverable 1 | `worker-2-verification.md:63-69`, `:102` |
| L19 — no self-grading, no implementer-authored acceptance tests | §4.3; §3.4 B | `worker-2-verification.md:69-71`, `SYNTHESIS-v8.7.md:340` |
| L20 — prove the oracle; mutation testing on critical paths | §4.3 deliverables 2–3 | `worker-2-verification.md:75-77`, `SYNTHESIS-v8.7.md:293` |
| L21 — measured gate hierarchy and reviewer-advisory rule | §3.4 C; §3.2 audit; §4.3 | `worker-2-verification.md:23-28`, `:107`, `SYNTHESIS-v8.7.md:89` |
| L22 — destructive actions outside agent control | §3.4 B (high tier); §7 | `worker-2-verification.md:53-56`, `worker-5-human-gates.md:38-41` |
| L23 — deterministic steps stay deterministic and unskippable | §3.1 step 4; §7 | `worker-2-verification.md:49-50` |
| L24 — fresh-context / different-family reviewers; author ≠ judge | §3.1 step 5; §3.2 audit | `worker-2-verification.md:79-81`, `SYNTHESIS-v8.7.md:320` |
| L25 — cap every loop | §3.4 D | `worker-2-verification.md:87-94`, `worker-5-human-gates.md:118-121` |
| L26 — root-cause-before-fix; never "fix the tests" | §3.1 step 3; §4.5 | `SYNTHESIS-v8.7.md:323` |
| L27 — two-tier memory; never one giant file | §4.2 deliverable 1 | `worker-3-memory.md:185` |
| L28 — memory fed only by gate failures, corrections, incidents | §4.2 deliverable 2 | `worker-3-memory.md:186`, `SYNTHESIS-v8.7.md:279` |
| L29 — three-criteria bar for new rules | §4.2 deliverable 3 | `worker-3-memory.md:187` |
| L30 — traps, not maps | §4.2 deliverable 4 | `worker-3-memory.md:188` |
| L31 — declared context budgets; measured 87K→9K | §4.4 deliverable 1; §3.1 declared budget | `worker-3-memory.md:189` |
| L32 — 20–30 turn cliff; phase = session boundary; AIDEV anchors | §3.1; §4.4 deliverable 5 | `worker-3-memory.md:190` |
| L33 — compounding ritual (session close, PR rule proposals) | §4.2 deliverable 7 | `worker-3-memory.md:191` |
| L34 — claim-graph precision over vector blur | §4.2 deliverable 5 | `worker-3-memory.md:192`, `instagram-v8.7-context.md:19` |
| L35 — cost-separate the memory role | §4.2 deliverable 6; §8.2 | `worker-3-memory.md:193`, `instagram-v8.7-context.md:7` |
| L36 — git as durable memory | §4.2 deliverable 8; §3.1 step 6 | `worker-3-memory.md:194` |
| L37 — build Pillar 1 | §4.2 (whole phase); §1.1 | `SYNTHESIS-v8.7.md:354-359` |
| L38 — build Pillar 2 | §4.3 (whole phase); §1.1 | `SYNTHESIS-v8.7.md:361-366` |
| L39 — build Pillar 3 | §4.4 (whole phase); §1.1 | `SYNTHESIS-v8.7.md:368-373` |
| L40 — adopt the evidence-derived workflow shape | §3.1 canonical order; §1.1 | `SYNTHESIS-v8.7.md:377-386` |
| L41 — memory thread: dedicated layer + precise retrieval | §4.2 | `instagram-v8.7-context.md:22` |
| L42 — testing thread: adversarial, not green-checkmark | §4.3 | `instagram-v8.7-context.md:23` |
| L43 — workflow thread: ground the plan in real loops | §1.1; §3 (all three levels) | `instagram-v8.7-context.md:24` |

### 5.2 SYNTHESIS dispositions (25)

| Item | Where it lands in this plan | Source file:line |
|---|---|---|
| ADOPT-1 — written plan/spec artifact with success criteria + verification plan, reviewed before implementation | §3.1 step 2; §2.3 | `SYNTHESIS-v8.7.md:316` |
| ADOPT-2 — verification as mechanical gate, not prompt advice | §3.4 C; §3.1 step 4 | `SYNTHESIS-v8.7.md:317` |
| ADOPT-3 — independent test oracle | §4.3 deliverables 1–2 | `SYNTHESIS-v8.7.md:318` |
| ADOPT-4 — circuit breakers on every loop | §3.4 D | `SYNTHESIS-v8.7.md:319` |
| ADOPT-5 — author ≠ judge separation | §3.1 step 4; §3.2 audit | `SYNTHESIS-v8.7.md:320` |
| ADOPT-6 — context budget discipline | §4.4; §3.1 declared budget | `SYNTHESIS-v8.7.md:321` |
| ADOPT-7 — compounding memory | §4.2; §3.3 step 4 | `SYNTHESIS-v8.7.md:322` |
| ADOPT-8 — root-cause-before-fix; never "fix the tests" | §3.1 step 3; §4.5 | `SYNTHESIS-v8.7.md:323` |
| ADOPT-9 — memory as its own layer, cost-separated | §4.2 deliverable 6 | `SYNTHESIS-v8.7.md:324` |
| ADOPT-10 — adversarial testing over green checkmarks | §4.3 (whole phase) | `SYNTHESIS-v8.7.md:325` |
| ADOPT-11 — risk-tiered review | §3.4 B | `SYNTHESIS-v8.7.md:326` |
| ADOPT-12 — measured outcomes labelled honestly | §0.1; §9; every table's label column | `SYNTHESIS-v8.7.md:327` |
| ADAPT-1 — reviewer gates → advice by default; gate only against a written standard | §3.1 step 5; §3.2 audit | `SYNTHESIS-v8.7.md:331` |
| ADAPT-2 — multi-model role routing → role separation within the owner routing law | §8.2; §3.1 actors | `SYNTHESIS-v8.7.md:332` |
| ADAPT-3 — agent-written tests only with an independent oracle + strength checks | §4.3 deliverables 1–5 | `SYNTHESIS-v8.7.md:333` |
| ADAPT-4 — parallel fleets → independent tasks only, per-worker contracts | §2.5 rule 2; §8.1 | `SYNTHESIS-v8.7.md:334` |
| ADAPT-5 — slot-machine restart for well-specified tasks after bounded retries | §3.4 D/E | `SYNTHESIS-v8.7.md:335` |
| ADAPT-6 — "reference is the spec" → work orders point at lock/registry/code | §3.1 step 2; §4.4 deliverable 4; §7 | `SYNTHESIS-v8.7.md:336` |
| REJECT-1 — agent self-grading / implementer-authored acceptance tests | §3.4 B; §4.3 gate list | `SYNTHESIS-v8.7.md:340` |
| REJECT-2 — prompt-carried safety rules | §7 (mechanical surfaces); §3.4 B | `SYNTHESIS-v8.7.md:341` |
| REJECT-3 — unbounded retry/CI loops | §3.4 D | `SYNTHESIS-v8.7.md:342` |
| REJECT-4 — acceptance-rate / green-test vanity metrics | §4.3 deliverable 6; §3.2 audit | `SYNTHESIS-v8.7.md:343` |
| REJECT-5 — vibe-coded production / standard-less swarms | §1.4; §3.4 B (no path without a written standard) | `SYNTHESIS-v8.7.md:344` |
| REJECT-6 — role-separation violations (vanbu never builds; builders never verify own work; Omar alone releases) | §8.2 cast; §3.2 step 6 | `SYNTHESIS-v8.7.md:345` |
| REJECT-7 — wrestling bad runs past the retry budget | §3.4 D (last row) | `SYNTHESIS-v8.7.md:346` |

### 5.3 Count check (quoted from the command that ran)

```text
$ node --input-type=module <counts V87-PLAN-ZERO-TO-87.md §5>
ledger_rows=43
disposition_rows=25
total=68
expected=68
exit=0
```

The command and its raw output are recorded in §10.3.

Note (W3): the count commands match numbered ids L1–L43; lettered L11a is an extra physical row — 44 physical ledger rows; 44 + 25 dispositions = 69 physical (68 = 43 numbered + 25).

### 5.4 Source-pattern index (the digest's own pattern sets)

| Source pattern | Landing | Source file:line |
|---|---|---|
| P1 plan artifact gates implementation (19/19, LAW) | §3.1 step 2 | `SYNTHESIS-v8.7.md:16` |
| P2 verification is external and mechanical (19/19, LAW) | §3.4 C | `SYNTHESIS-v8.7.md:39` |
| P3 human stays the accountable decider (17/19, LAW) | §3.4 A | `SYNTHESIS-v8.7.md:61` |
| P4 author ≠ judge, **with the measured caveat** | §3.2 audit; §3.4 C | `SYNTHESIS-v8.7.md:77`, `:89` |
| P5 behavioural rules checked into the repo (17/19, LAW) | §4.2 deliverable 1 | `SYNTHESIS-v8.7.md:93`, `:105` |
| P6 context is a budget (17/19, LAW) | §4.4 | `SYNTHESIS-v8.7.md:109` |
| P7 circuit breakers on every loop (13/19, STRONG) | §3.4 D | `SYNTHESIS-v8.7.md:126` |
| P8 git as the safety net (14/19, STRONG) | §3.1 step 6; §4.2 deliverable 8 | `SYNTHESIS-v8.7.md:139` |
| P9 risk-tiered review (10/19, STRONG) | §3.4 B | `SYNTHESIS-v8.7.md:150` |
| P10 "reference is the spec" (8/19, SOLID) | §4.4 deliverable 4 | `SYNTHESIS-v8.7.md:161` |
| P11 role-based routing (11/19, STRONG) | §8.2 | `SYNTHESIS-v8.7.md:171` |
| P12 measure outcomes honestly (STRONG) | §9; every label | `SYNTHESIS-v8.7.md:183` |
| A1 confident wrongness (14/19, #1 family) | §3.1 step 2 risk ledger; §3.4 E | `SYNTHESIS-v8.7.md:198` |
| A2 test-gaming (12/19) | §4.3 deliverables 5–6 | `SYNTHESIS-v8.7.md:210` |
| A3 unbounded loops (12/19) | §3.4 D | `SYNTHESIS-v8.7.md:221` |
| A4 giant unreviewable diffs (10/19) | §2.3 (scope rule); §3.1 step 3 | `SYNTHESIS-v8.7.md:225` |
| A5 prompt-carried safety (9/19) | §7; §3.4 B | `SYNTHESIS-v8.7.md:229` |
| A6 sycophancy (7/19) | §3.1 step 5 (findings carry reasons, not approval) | `SYNTHESIS-v8.7.md:234` |
| A7 vanity metrics (7/19) | §4.3 deliverable 6 | `SYNTHESIS-v8.7.md:240` |

## 6. Phase-0 findings folded — defect-driven workstreams

**Folding rule.** The three pillars shape the phases; the defect sets seed the workstreams. Each row names the source finding, the phase that owns it, and what changes. This table references the categories of the sibling consolidation `V87-DEFECTS.md` (authored by `d-defects` in the same wave); that file is **not** a dependency of this plan and this plan does not wait on it.

### 6.1 Defect-driven workstream table

| Source id | Plan phase | What changes |
|---|---|---|
| `V87-ENUM` D1 — `[0.7.7]` says PARKED while the tag exists | `PH-A` | status line corrected against `git tag` + `AGENT.md:301` |
| `V87-ENUM` D2 — `[0.7.6]` same contradiction | `PH-A` | same repair |
| `V87-ENUM` D3 — `[0.7.5]` "no tag" while `v7.5` released | `PH-A` | status line corrected; the `v0.7.5`/`v7.5` distinction stated |
| `V87-ENUM` D4 — `v7.5` breaks the semver sequence | `PH-A` | naming ruling; the sequence becomes sortable or the label is declared an alias |
| `V87-ENUM` D5 — stale `AGENT.md` current-state block | `PH-A` | block refreshed (orchestrator-only write) |
| `V87-ENUM` D6 — CHANGELOG link references stop at `0.7.0` | `PH-A` | three link references added; `[Unreleased]` baseline advanced |
| `V87-ENUM` D7 — four post-release commits undocumented | `PH-A` | `[Unreleased]` gains its entries |
| `V87-ENUM` D8 — README census stale (112 vs 157) | `PH-A` | census corrected to 157 / 32+125 / 80+77 |
| `V87-ENUM` D9 — `docs/18-THEMES.md` stale mapping and BLAZAR role | `PH-E` | mapping rebuilt from `registry/themes/*`; BLAZAR role corrected to Build Leader |
| `V87-ENUM` D10 — lock carries no kit semver | `PH-A` | version identity field added to the lock chain, schema-validated |
| `V87-ENUM` D11 — `docs/16-*` 112-era figures | `PH-A` | figures corrected to the live census |
| `V87-COLOR` F-COLOR-01 — 24/27 agents carry no `color:`, 0/27 carry a group field | `PH-E` | regime ruled, then applied or the rule amended |
| `V87-COLOR` F-COLOR-02 — the 7-group palette has no on-disk home | `PH-E` | palette written as a definition file, or the regime abandoned on the record |
| `V87-COLOR` F-COLOR-03 — registry `category` is a 5-value taxonomy; `#8B5CF6` collides `external`/`operate` | `PH-E` | mapping row authored; collision resolved |
| `V87-COLOR` F-COLOR-04 — `#22D3EE` (exploration) occurs 0 times outside the V87 deliverables, the audit set, and AGENT.md (the SC-4 exclusion set) | `PH-E` | colour assigned or the group dropped |
| `V87-COLOR` F-COLOR-05 — 9/12 registry rows pending on absent theme files | `PH-E` | theme files authored; ids de-double-prefixed |
| `V87-COLOR` F-COLOR-06 — 12 files forbid `color:` while docs require it | `PH-E` | doctrine conflict closed by Omar's ruling |
| `V87-COLOR` F-COLOR-07 — `docs/18-*` per-agent mapping stale | `PH-E` | `aether`/`pulsar` added; the three non-existent RESERVED agents removed |
| `V87-COLOR` F-COLOR-08 — 4 group assignments are estimates | `PH-E` | each estimated row re-graded or left explicitly `~تقديري` |
| `V87-COLOR` C1 — cardinality conflict (10 hues vs brand's 4, "no fifth colour") | `PH-E` | owner ruling on the brand/UI-accent boundary |
| `V87-COLOR` C2 — 7 groups vs 5 categories, no mapping row | `PH-E` | mapping row authored |
| `V87-COLOR` C3 — every category hex differs from its nearest group | `PH-E` | hexes reconciled or the divergence documented |
| `V87-COLOR` C4 — exploration colour absent outside the V87 deliverables, the audit set, and AGENT.md (the SC-4 exclusion set) | `PH-E` | see F-COLOR-04 |
| `V87-COLOR` C5 — group hexes exist only in third-party design catalogs | `PH-E` | group definition becomes the single home |
| `V87-COLOR` C6 — the palette has no on-disk home; themes doc omits installed leaders | `PH-E` | see F-COLOR-02 / F-COLOR-07 |
| `V87-COLOR` C7 — doctrine conflict is the cause of the 24 absences | `PH-E` | same ruling as F-COLOR-06; no verifier may call the 24 an error before it |
| `V87-COMPAT` C-01 — 0 of 27 agents can load a `vs-*` skill | `PH-F` | allow-list added, or non-loadability declared |
| `V87-COMPAT` C-02 — twin pairs share byte-identical descriptions | `PH-F` | descriptions differentiated |
| `V87-COMPAT` C-03 — 0 of 22 commands name a `vs-*` skill | `PH-F` | entry point named, or the class declared command-less |
| `V87-COMPAT` C-04 — two temperature shapes across leaders | `PH-F` | one shape, or both documented as tolerated |
| `V87-COMPAT` C-05 — accent case mismatch; `categories.reserved` says "BLAZAR only" while three rows are reserved | `PH-F` | case normalized; category semantics corrected |
| `V87-COMPAT` C-06 — two new MD037 errors in `AGENT.md` | `PH-F` | prose repaired by the state-file owner |
| `V87-COMPAT` C-07 — new MD032 error in `WORKFLOW.md` | `PH-F` | list spacing repaired by the state-file owner |
| `V87-COMPAT` C-08 — 8×MD034 + 1×MD032 in the generated mirror | `PH-F` | fixed through the generator/sidecar, never by hand |
| `V87-COMPAT` C-09 — two command roots, no gate asserts which loads | `PH-F` | one root, or a declared loader rule |
| `V87-COMPAT` C-10 — 19 skill folders absent from the lock; all 8 `vs-*` absent from the catalog | `PH-E` | registered, or declared unregistered with a reason |
| `V87-COMPAT` C-11 — 7 agent files absent from the lock | `PH-E` | registered, or declared unregistered with a reason |
| `V87-FEATURE-1` F-A1 — two consult commands point at deleted agent files | `PH-E` | re-pointed to `vantrilex-scribe` / `vantrilex-security-auditor` |
| `V87-FEATURE-1` F-A2 — three role-switch commands target unbuilt themes | `PH-E` | themes authored, or commands re-pointed |
| `V87-FEATURE-1` F-A3 — 7 agent files carry no lock row and no catalog record | `PH-E` | registered or declared |
| `V87-FEATURE-1` F-A4 — 19 skill folders unregistered (16 with no catalog record) | `PH-E` | registered or declared; `relay-protocol` stays deliberate |
| `V87-FEATURE-1` F-A5 — 5 `vs-*` twin pairs share a description byte-for-byte | `PH-F` | see C-02 |
| `V87-FEATURE-1` F-A6 — `relay-protocol` census drift (8 documented, 9 on disk) | `PH-E` | census corrected (`SESSIONS.md` is the extra file) |
| `V87-FEATURE-1` F-A7 — `[arsenal] typescript-check` misfire, unclassified | `PH-F` | dedicated host-side probe classifies it before any fix |
| `V87-FEATURE-2` F1 — markdownlint FAIL: 3 issues in 2 files | `PH-F` | see C-06/C-07 |
| `V87-FEATURE-2` F2 — 11 link breaks (10 archive-internal, 1 generated) + stale CHANGELOG refs | `PH-E` | archive links repaired; generated link fixed at source |
| `V87-FEATURE-2` F3 — truncated URLs in generated mirror text | `PH-E` | fixed in the sidecar/table source |
| `V87-FEATURE-2` F4 — CI gaps: dead checkpoint step, `verify-skills` absent, mode assertion covers 7 of 8 | `PH-F` | all three resolved |
| `V87-FEATURE-2` F5 — `docs/spec/v87/**` untracked | `PH-G` | versioned, or declared session-local by Omar |
| `V87-ENUM` §2 row 16 / `V87-FEATURE-2` B6 — `v7.5` tag discipline | `PH-A` | see D3/D4 |
| `AGENT.md:250` — `V87-SPEC-01` intake field conflict (`aether.md` §2 vs `blazar.md` §3/§4) | `PH-G` | spec amended on the losing side by owner ruling |

### 6.2 Count check (quoted)

```text
$ node --input-type=module <counts §6.1 rows>
defect_rows=51
sources=5 audit artifacts (+1 spec-conflict row from AGENT.md)
exit=0
```

## 7. OpenCode and Arsenal match

Every research mechanism is mapped to a surface that exists on this host or repository. "Ideal degree" means: use the real extension point, do not simulate it in prose.

| Research mechanism | OpenCode surface | Arsenal artifact today | v8.7 change |
|---|---|---|---|
| Plan/read-only gate before edits | OpenCode plan/read-only mode + tool permissions | `vantrilex-guards.ts` plan-guard, shipped **detective-only** (`AGENT.md:86`, W19 D4 = IMPOSSIBLE→PARKED) | `PH-F`: keep the honest detective label; no HARD claim without enforcement |
| Stop-hook enforcement (a hook cannot be skipped) | V2 `tool.execute.before/after`, `shell "create.before"`, `session "prompt"`; V1 `chat.message`, `experimental.chat.system.transform`, `experimental.session.compacting`, `event` | 7 lock hooks mapped to registered functions (`V87-FEATURE-AUDIT-1.md:59`), plus non-lock docs guard and relay pair (disabled) | `PH-C`/`PH-F`: verification steps ride the hook surface, not the prompt |
| Permission deny-lists instead of summarized rules | agent `permission`/allow-deny frontmatter | `aether.md:14-28` denies `*` and allow-lists; 12 subagent files forbid a `color:` field | `PH-C`: read-denial for hidden tests; `PH-F`: allow-list decision for `vs-*` |
| Test writer gets the spec, never the implementation | separate agent + denied reads + tests outside the tree | not present (no test-author role in the roster) | `PH-C` deliverable 1 |
| Deterministic steps unskippable (git ops, lint, tests) | hook + CI job | six gates in CI; `bash -n`, `shellcheck`, `node --check`, `tsc` | `PH-F`: close the three CI gaps of F4 |
| Circuit breakers | dispatch policy + node counters | Arsenal rule: 2 rounds per node then escalate (`WORKFLOW.md:117`) | `PH-F`: counters recorded in the evidence bundle |
| Command entry points as phase boundaries | `.opencode/command` + `.opencode/commands` | 4 + 18 files, two roots, no gate asserts which loads (C-09) | `PH-F`: one root or a declared loader rule |
| Dual-surface plugin | `setup()` (V2) + `server()` (V1) | both exported by `arsenal.ts`; load smoke green | keep dual; `PH-F` fixes only the hook resolution fault |
| Skills as conditional deep workflows | `.opencode/skills/*/SKILL.md` | 37 folders, format gate 10/10 | `PH-B`/`PH-C`/`PH-D` add the pillar skills |
| "Reference is the spec" | lock + registry as machine-readable reference | `kit/kit.lock`, `registry/catalog.json`, 16 sidecars | `PH-E` makes the reference complete (registration) |
| Cost-separated memory role | dispatch-time routing (no file pins) | routing recorded in prose only (`WORKFLOW.md:105`) | `PH-B` deliverable 6 + `PH-F` routing statement |
| Hostile-input safety | capability/permission model | not audited in this plan's inputs | carried to §9 as an open item, never assumed |

## 8. Rollout sequencing to 8.7, and the task workflow applied

### 8.1 Wave plan (BLAZAR-executable)

| Wave | Nodes | Proves it may start | Closes with |
|---|---|---|---|
| `W1` | `PH-A` | inputs present; owner-ruling request drafted | version identity ruled or the phase parked |
| `W2` | `PH-B` ∥ `PH-C` ∥ `PH-D` (disjoint write sets) | `PH-A` exit verified | each pillar's oracle/worked example |
| `W3` | `PH-E` | `PH-A`…`PH-D` exits verified | registry/lock/catalog/skills gates green |
| `W4` | `PH-F` | `PH-E` census frozen; `PH-C` checks exist | CI + plugin + interop gates green |
| `W5` | `PH-G` | all phase exits verified | battery + census + evidence bundle |
| `W6` | integrate → audit → release prep | `PH-G` bundle accepted | output package staged, nothing published |
| `W7` | **Omar releases** | Omar's word | annotated tag + published release + `v*` workflow green |

**Why W2 may fan out and nothing else may:** the three pillars touch disjoint paths and each carries its own artifact contract (§2.5 rule 2, ADAPT-4). Parallelism never follows ambition (`worker-4-decomposition.md:173`).

### 8.2 Cast and routing

| Seat | Who | Model route (owner law, dispatch parameter, zero file pins) |
|---|---|---|
| Planning authority | AETHER | leader seat — Muse Spark 1.3 Contributor |
| Build leader / orchestrator | BLAZAR | leader seat — Muse Spark 1.3 Contributor |
| Assumption exploration | PULSAR | leader seat — Muse Spark 1.3 Contributor |
| Workers | `vantrilex-implementer`, `vantrilex-verifier`, `vantrilex-harness`, `vantrilex-scribe`, `vantrilex-reviewer`, `vantrilex-kit-maintainer`, `vantrilex-librarian`, `vantrilex-releaser`, `vantrilex-security-auditor` | side agents — DeepSeek V4.1 FLASH as an explicit dispatch parameter |
| Independent counterpart | vanbu | **never builds**; verify/audit only |
| Owner and sole mediator | Omar | all five human gates; alone releases |

Role separation is a hard boundary, not a preference: builders never verify their own work; the counterpart never builds; Omar alone releases (REJECT-6).

### 8.3 The release path (task workflow applied)

1. `PH-G` hands the evidence bundle to the orchestrator.
2. `vantrilex-releaser` stages a **versioned handoff package** (prep-only; it publishes nothing).
3. `github-release-packager` is the **sole executor** of the publish step (`CHANGELOG.md:567-578`).
4. `scripts/release.sh` refuses a dirty tree (`:105`), creates the **annotated** tag (`:128`), pushes, then `gh release create` (`:140`).
5. The `v*` release workflow runs (`.github/workflows/release.yml:3-5`).
6. Darkship observation precedes full activation of kit-visible changes (§3.4 G).
7. **Omar's word opens gate D.** Until then the task is parked with the branch alive.

### 8.4 Done state (the release is done when all six hold)

1. Every phase's exit criteria met: artifact exists, verification passes, next input ready.
2. The six gates + probe battery + skill gate exit 0 on the integrated tree, quoted.
3. The census re-count matches the intended delta and names it.
4. The evidence bundle is archived with the release.
5. The memory layer recorded what the outcomes taught — new rules pass the three-criteria bar.
6. `AGENT.md` and `WORKFLOW.md` describe the tree as it is (orchestrator-only writes).

## 9. Honesty labels, unknowns, and the stop boundary

### 9.1 Honesty ledger of this plan

- **Measured (`مثبت`, from the audit artifacts):** the baseline census of §1.2; the six gates' exits; the defect ids of §6; the model-routing state (convention only, no config file); the citation set of §5.
- **Estimated (`~تقديري`):** every proposed commit subject; every proposed new path (memory skill, testing skill, oracle harness, theme files, version-identity field); the wave durations; the colour group assignments that `V87-COLOR-FINDINGS.md:326` already marks as estimates; any figure this plan did not re-run.
- **Not claimed at all:** that any v8.7 mechanism exists today; that any proposed file is authored; that the host honours either leader temperature shape; that the `[arsenal] typescript-check` fault has a known cause.

### 9.2 Decisions this plan routes to Omar (it does not guess)

1. **Version identity (PH-A):** does 8.7 ship as a continuation of the 0.x series with "8.7" as a program label, or as the literal tag `v8.7`? The answer fixes every downstream tag, CHANGELOG heading, and release note.
2. **Colour regime (PH-E, F-COLOR-06/C7):** does the per-agent `color:` requirement stand (then 12 files' no-colour rule is amended and the palette is written to disk), or does the no-colour rule win (then `docs/18-THEMES.md:95` and `AGENT.md:106` are amended)? Both are one-line amendments; leaving it open makes 24 agents permanently "wrong" by construction.
3. **Provenance set (PH-G, F5):** is `docs/spec/v87/**` versioned or session-local?
4. **`V87-SPEC-01` (PH-G):** which spec wins the intake-field conflict — `aether.md` §2 or `blazar.md` §3/§4?
5. **Brand boundary (PH-E, C1):** can a 10-hue agent palette coexist with `brand/IDENTITY.md`'s "there is no fifth colour"?

### 9.3 Missing-tooling protocol applied

Where a named check cannot run on the executing seat, the phase records it as **failed, never skipped**, names the tool and the exact command, marks dependent claims `unverified`, and escalates to the Guide. No adjacent tool is substituted. Known instance in the Phase-0 set: `markdownlint` was absent on one seat (`V87-FEATURE-AUDIT-1.md:183-184`) while a sibling ran it through `npx` (`V87-COMPAT-FINDINGS.md:59`) — the plan requires the CI-or-declared resolution of `PH-F` rather than a per-seat improvisation.

### 9.4 Stop boundary restated

This plan ends at the v8.7 release. It orders no execution, plans no post-8.7 channel, and manufactures no release history for v8.0–v8.6.

## 10. Provenance and verification of this plan

### 10.1 What this node did and did not do

Wrote exactly one file, `V87-PLAN-ZERO-TO-87.md`. Read the seven audit artifacts and the live tree read-only. No git write, no state-file write, no audit-artifact edit, no registry/lock/catalog touch, no install, no dispatch, no execution of v8.7.

### 10.2 Evidence base (read live 2026-10-18)

| Artifact | Role in this plan |
|---|---|
| `.opencode/audit/V87-INPUT-DIGESTS.md` | primary: the 43-numbered-item ledger (44 rows incl. L11a), the 25 dispositions, the three pillars, the workflow shape |
| `.opencode/audit/V87-ENUM.md` | version series, superseded map, defects D1–D11 |
| `.opencode/audit/V87-COLOR-FINDINGS.md` | colour compliance, palette conflicts C1–C7, findings F-COLOR-01…08 |
| `.opencode/audit/V87-COMPAT-FINDINGS.md` | vs-* interop, routing state, triumvirate, lock/registry/catalog agreement, C-01…C-11 |
| `.opencode/audit/V87-FEATURE-AUDIT-1.md` | surfaces feature ledger, F-A1…F-A7 |
| `.opencode/audit/V87-FEATURE-AUDIT-2.md` | data/process feature ledger, F1–F5 |
| `.opencode/audit/V87-INPUT-RECEIPT.md` | input authentication and the recorded count mismatch |

Supporting reads for Arsenal-native facts: `WORKFLOW.md` (A1–A7, Part B), `AGENT.md` (identity, current state), `AI_GUIDE.md:212-224` (the six gates), `.markdownlint.jsonc`, `.github/workflows/ci.yml` facts as quoted by the audit artifacts.

### 10.3 Verification runs (verbatim, with exit codes)

**Coverage count check** — 43 ledger rows + 25 dispositions in §5:

```text
ledger_rows=43 ledger_unique=43 contiguous_L1_L43=true
disposition_rows=25 (ADOPT=12 ADAPT=6 REJECT=7)
total=68  expected=68
defect_rows=51 (audit-derived=50 + spec_conflict=1)
COUNT CHECK: PASS
exit=0
```

**Spot-check of quoted phrases** — 12 checks (11 against the digests' sources and artifacts, 1 confirming this plan carries the same quote):

```text
PASS  docs/spec/v87/worker-1-plan-handoff.md  "the reference *is* the spec."
PASS  docs/spec/v87/worker-2-verification.md  "An agent's own tests test what it built"
PASS  docs/spec/v87/worker-3-memory.md  "memory is the product of gate outcomes, not prompt engineering."
PASS  docs/spec/v87/worker-5-human-gates.md  "A bot's approval never replaces a required human's on high-risk paths."
PASS  docs/spec/v87/SYNTHESIS-v8.7.md  "Green \u2260 correct \u2014 **law-grade**"
PASS  .opencode/audit/V87-INPUT-DIGESTS.md  "TRIGGER \u2192 PLAN-ARTIFACT"
PASS  .opencode/audit/V87-COMPAT-FINDINGS.md  "probe-4 agreement mismatches: 0"
PASS  .opencode/audit/V87-ENUM.md  "No shipped tag exists above `v0.7.7`"
PASS  .opencode/audit/V87-COLOR-FINDINGS.md  "missing theme files: 9/12"
PASS  .opencode/audit/V87-FEATURE-AUDIT-1.md  "`--noEmit` handed to a non-tsc binary"
PASS  .opencode/audit/V87-FEATURE-AUDIT-2.md  "Summary: 3 issues in 2 files"
PASS  V87-PLAN-ZERO-TO-87.md  "Green \u2260 correct \u2014 **law-grade**"
SUMMARY 12/12 passed; failures=0
exit=0
```

**Markdownlint** — verbatim, no output emitted, exit code is the claim:

```text
$ npx --no-install markdownlint-cli V87-PLAN-ZERO-TO-87.md
exit=0
```

**Pin and field scans** — the plan introduces no routing pin and no colour field:

```text
model_pin_lines=0   (pattern ^\s*model\s*:)
color_field_lines=0 (pattern ^color:)
V87-PLAN-ZERO-TO-87.md | bytes=75286 | lines=718 | unterminated_last_line=no
```

Exit codes are the claim; the readings of them are analysis.

### 10.4 Uncertainties and follow-ups

1. **Sibling deliverable.** `V87-DEFECTS.md` (node `d-defects`) had not landed when this plan was authored; §6 references its categories from the audit artifacts directly and does not depend on it. If its severity ranking differs, §6's phase assignment stands — the assignment is by surface, not by severity.
2. **Source-stated counts.** Every corroboration ratio quoted in §5.4 (19/19, 17/19, ~75/130, the 50-run percentages) is the digest's own quoted figure; this plan re-derived none of them and labels them as source-stated.
3. **Counting method.** §5.3 and §6.2 count the rows of this file; they do not re-verify the underlying research, which is the digest's job and the W3 verifier's.
4. **Boundary.** If any Phase-0 artifact is contradicted by a later re-run, the audit artifact wins and this plan's row is corrected in place; nothing here is frozen against measurement.
5. **Live host observation, recorded not suppressed.** Writing this file at the repository root triggered the `[arsenal] docs-discipline-guard` hook twice with `mode: warn`: the root `V87-*.md` deliverables are outside the guard's allow-list (numbered `docs/` series, the named directories, and the ten named root files). The warning is non-blocking and the mission plan mandates the root paths, so the write proceeded. The item routes to `PH-F`/`PH-G`: either the guard's allow-list is extended to the V87 deliverables on the owner's word, or the deliverables move into the numbered series — today the guard is honest about a real gap between the docs-discipline rule and the owner-package paths.
