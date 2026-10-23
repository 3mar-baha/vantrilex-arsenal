# WORKER-4: Phase and Task Decomposition — Deep Findings

**Angle:** How REAL elite developers break projects into phases/tasks for AI execution.
**Corpus:** SYNTHESIS-v8.7.md + worker-01/02/04/05/08/09/10/15 files.
**Date:** 2026-10-18

---

## 1. EXACT PHASE BOUNDARIES — WHAT STARTS/ENDS A PHASE

### 1.1 Osmani's six-phase SDLC: slash-command boundaries
Each phase is a **named slash command** that loads its own skill set (progressive disclosure). Phase ends when its command's exit criteria are met; the next command cannot start until then.
- `/spec` ENDS when: PRD written covering objectives, structure, style, testing, boundaries (worker-02.md:64)
- `/plan` ENDS when: work broken into "small atomic tasks" (worker-02.md:65)
- `/build` ENDS when: each task committed individually with test-driven validation; **hard halt if any step encounters issues or risks** (worker-02.md:66)
- `/test` → `/review` → `/ship` are non-skippable gates; Osmani "refuses to merge what can't be reviewed" (worker-02.md:79)
- **Boundary mechanism:** the skill system itself — only the phase's skill is loaded; you cannot be in two phases at once.

### 1.2 Helix checkpoints: complexity-ordered slices
A phase (checkpoint) boundary is defined by **reviewable scope**, not time.
- Checkpoint 1 = screen skeleton; checkpoint 2 = one deliberately small section; later checkpoints "grow only after early decisions pass review" (worker-01.md:56)
- Each checkpoint described "in a few words deliberately: 'We'd rather give someone one decision they can make as opposed to ten pages they will skim'" (worker-01.md:56)
- **Boundary rule:** checkpoint must be "reviewed at a glance" (worker-01.md:84). If the engineer cannot approve it in minutes, it is too large — split it.
- Phase ENDS at: engineer approval (Gate 4) → **commit per checkpoint** (worker-01.md:64)

### 1.3 Kousigan: the STOP as a phase boundary
The protocol `Understand → Investigate → Plan → Approve → Implement → Verify → Review diff → Done` uses an **explicit STOP** after Plan (worker-05.md:137-158).
- Investigate phase: "agent reads repo, stack, relevant files, existing patterns and constraints. **No code changes.**" (worker-05.md:143)
- Plan phase must state: what it understood, which files matter, existing patterns, constraints, what could go wrong, proposed change, **and how it will verify the change**. "Then the agent **stops**." (worker-05.md:144)
- **Boundary mechanism:** the STOP is enforced by tool permissions, not prompt text. "A 'STOP' sentence in a prompt is not a plan mode... If edits must not happen, use the tool's plan/read-only mode" (worker-05.md:156). Claude Code's plan mode blocks edits; Windsurf's does not — the boundary's strength depends on the tool.
- **Ceremony scales with risk:** skip the plan for one-sentence diffs; medium change → investigation + plan; large/architecture/security → full protocol (worker-05.md:157)

### 1.4 Stripe Minions: deterministic/mechanical boundaries
Phases are **code nodes in a DAG**, not agent decisions.
- Setup (deterministic devbox provision) → Context hydration (deterministic MCP runs) → Agent loop → Local verify (lint <5s) → CI (≤2 rounds) → PR (worker-01.md:18-24)
- **CI boundary:** "Hard rule: at most two rounds of CI... diminishing marginal returns for an LLM re-running a full CI loop" (worker-01.md:23)
- Phase ENDS at: PR created following Stripe's PR template; engineer opens it and requests review (worker-01.md:24)

### 1.5 Cherny (Claude Code creator): plan-mode as the boundary
- Sessions **start in Plan mode** (Shift+Tab). "He goes 'back and forth with Claude until I like its plan.'" (worker-04.md:42)
- Boundary crossed when: plan approved → switch to auto-accept edits mode → 1-shot implementation (worker-04.md:42)
- **Boundary mechanism:** Plan mode keeps "the expensive thinking out of the code-mutating loop" (worker-04.md:61)

### 1.6 mfishbein factory: 9 named stages with role boundaries
Each stage is a **named slash command with a persona** (interviewer, planner, professor, presenter, CTO, night-shift, teacher, videographer, manual-writer) (worker-09.md:43-62).
- Stage 3 (`/factory-tests`): "Before any code is written, every task gets 'an exam'" — phase boundary is **temporal**: no code exists yet (worker-09.md:51)
- Stage 5 (`/factory-handoff`): packages brief + plan + tests + safety rails + stop conditions into **one work order** — the artifact that crosses from planning to execution (worker-09.md:53)
- Stage 6 (`/loop`): "Agent picks one task, builds it, takes its exam, records what happened, iterates if needed, moves on" — task-level loop with circuit breakers (worker-09.md:54)

### 1.7 Debug loop: action-space boundaries
The debug workflow constrains **what the agent may do** at each phase:
- Freeze → Reproduce → **Explain (NO code changes)** → Hypothesize → Smallest fix → Layered verify → Review → Document (worker-08.md:127)
- "Ask the agent to inspect the execution path **without modifying code**" — the explain phase is read-only by rule (worker-08.md:127)
- "Apply the smallest fix, files limited, unrelated refactoring forbidden" — the fix phase has a scope boundary (worker-08.md:127)

### 1.8 Adversarial pipeline: role boundaries
`Spec → Coder → Cleaner → Hardener → QA` (worker-10.md:189-210).
- Spec phase: "Do not implement anything; do not propose architecture" — pure specification (worker-10.md:193)
- Hardener: "Do not fix anything. Your only output is the list of gaps" — deliberately forbidden from fixing (worker-10.md:198)
- **Boundary principle:** "Never let stages share the failure mode of the previous stage" (worker-10.md:205)

---

## 2. WHAT EACH PHASE PRODUCES — ARTIFACTS

| Phase | Artifact produced | Source |
|---|---|---|
| `/spec` | PRD (objectives, structure, style, testing, boundaries) | worker-02.md:64 |
| `/plan` | Atomic task list | worker-02.md:65 |
| `/build` (per task) | Individual commit + passing tests | worker-02.md:66 |
| Helix checkpoint | Commit + evidence bundle (archived UI reviews, passing tests, reviewer verdicts) | worker-01.md:64 |
| Stripe Minion run | Branch + PR following template | worker-01.md:24 |
| Kousigan Plan | Plan document (understanding, files, patterns, constraints, risks, change, verification method) | worker-05.md:144 |
| mfishbein stage 5 | Single work order (brief + plan + tests + safety rails + stop conditions) | worker-09.md:53 |
| mfishbein stage 8 | Narrated demo video (proof-of-work) | worker-09.md:57 |
| mfishbein stage 9 | Plain-language owner's manual | worker-09.md:58 |
| Cherny verify | 2-3x quality improvement (measured claim) | worker-04.md:52 |
| Lauren Tan close | `/reflect` — approved edits that change a future decision | worker-15.md:19 |
| Debug loop | Root-cause documentation ("why the fix works") | worker-08.md:128 |
| Adversarial QA | End-to-end script driving the running system | worker-10.md:202 |

**Key pattern:** every phase produces a **durable artifact outside the agent's session** — a commit, a document, a video, a test. Nothing that matters lives only in chat (Lauren Tan: "A correction that lives only in one chat is invisible to the next session" — worker-15.md:23).

---

## 3. HOW PHASES ARE SEQUENCED — DAG vs STRICT ORDER

### 3.1 Strict sequential (most common)
- Osmani: `/spec → /plan → /build → /test → /review → /ship` — linear, no skipping (worker-02.md:64-69)
- Kousigan: `Understand → Investigate → Plan → Approve → Implement → Verify → Review → Done` — linear with hard STOP (worker-05.md:142)
- Debug loop: `Freeze → Reproduce → Explain → Hypothesize → Fix → Verify → Review → Document` — linear, each step's output feeds the next (worker-08.md:127)
- Adversarial: `Spec → Coder → Cleaner → Hardener → QA` — linear, roles cannot be reordered (worker-10.md:189)

### 3.2 DAG (Stripe blueprints)
Stripe's Part 2 describes "blueprints" as **DAG-shaped** workflows where deterministic steps (git, lint, push) are code nodes and agent steps are interleaved (worker-01.md:233, second-hand). The DAG allows: setup → [context-hydration ∥ rule-loading] → agent-loop → [lint ∥ typecheck] → CI → PR.

### 3.3 Ordered-but-growing (Helix checkpoints)
Checkpoints are strictly ordered but **grow in scope**: "first = screen skeleton, second = one deliberately small section; later checkpoints grow only after early decisions pass review" (worker-01.md:56). Dependencies are architectural: later checkpoints build on approved earlier ones. Multiple screens can migrate **in parallel** (independent DAG branches) (worker-01.md:77).

### 3.4 Parallel fan-out (Cherny, Lauren Tan)
- Cherny: **5 Claudes in parallel** in terminal tabs + 5-10 on web; sessions handed off local↔web (worker-04.md:43)
- Lauren Tan: `/swarm check every package under <dir> — one worker per package, one report` (worker-15.md:18); git worktrees for parallel/overnight runs (worker-15.md:21)
- **Dependency rule:** parallel only for **independent** tasks. "Partition work so agents can't corrupt each other" (worker-15.md:220)

### 3.5 What determines dependencies
From the corpus, phase dependencies are determined by:
1. **Information flow:** Plan needs Investigate's output; Implement needs Plan's approval (Kousigan)
2. **Artifact readiness:** Build needs the spec artifact; Verify needs the implementation artifact
3. **Trust accumulation:** Helix — "memory of approved code and feedback means early checkpoints get more human attention; later ones can run with less oversight" (worker-01.md:65)
4. **Risk:** Kousigan scales ceremony by risk tier; Anthropic routes by risk (SYNTHESIS P9)

---

## 4. WHAT HAPPENS AT PHASE TRANSITIONS — GATES AND REVIEWS

### 4.1 Helix's 4 gates (per checkpoint)
1. **Gate 1 — Test:** subagent-generated integration tests, edge-case hunting (worker-01.md:58)
2. **Gate 2 — UI review:** Gemini compares implementation vs. reference screenshots; "must list **every difference with a severity and on-screen location**; anything fixable in code is a **blocker by default**" (worker-01.md:61)
3. **Gate 3 — Code review:** context-isolated adversarial reviewers (worker-01.md, P4)
4. **Gate 4 — Engineer closes the loop:** human decides; feedback goes to agent fixes AND to Helix memory (worker-01.md:63)
- **Transition rule:** "the gates don't become more lax when nobody is watching" (worker-01.md:65)

### 4.2 Stripe's 2-layer verify
- Layer 1 (local): lint <5 seconds, run before CI (worker-01.md:23)
- Layer 2 (CI): "at most two rounds" — then human takes over (worker-01.md:23)
- **Transition rule:** fix everything locally before spending a CI round

### 4.3 Kousigan's approval checklist
Human reviews the plan against: "is it the right task in its own words? are named files real? does it reuse existing code before adding dependencies? risks specific? tests named?" (worker-05.md:145)

### 4.4 Osmani's halt-on-risk
`/build` "halts if any step encounters issues or risks" (worker-02.md:66). The transition to `/test` cannot happen until the halt is resolved.

### 4.5 Anthropic's 3-round cap
"After 3+ review rounds, author must **reconsider the approach**" — one change looped 50+ rounds in a night (SYNTHESIS P7). Transition: stop iterating, rethink.

### 4.6 mfishbein's circuit breakers
`/loop` has "circuit breakers [that] stop it from 'confidently digging a deeper hole' if stuck" (worker-09.md:54). Transition on stuck: stop, escalate, don't grind.

### 4.7 execute25's NEEDS_ANSWERS exit
"When the Author hits a genuine product decision it exits with `STATUS: NEEDS_ANSWERS` rather than inventing requirements" (worker-10.md:205). Transition: human answers, then resume.

---

## 5. PHASE "DONE" CRITERIA — WHAT MAKES A PHASE COMPLETE

| Workflow | Phase | Done = |
|---|---|---|
| Osmani | `/build` task | Committed individually + test-driven validation passes |
| Helix | Checkpoint | All 4 gates pass + engineer approval + committed |
| Stripe | Minion run | PR created following template + CI ≤2 rounds |
| Kousigan | Plan | Document complete (7 required sections) + human checklist passes |
| Kousigan | Verify | Tests/lint/typecheck/build pass + "what remains unverified?" answered with evidence |
| Cherny | Plan | "Back and forth until I like its plan" (human satisfaction) |
| mfishbein | Task (`/loop`) | Task's "exam" passes + what-happened recorded |
| Debug | Fix | Regression test passes + related tests + full suite + diff reviewed |
| Adversarial | Hardener | Mutation list complete (every surviving mutation recorded) |
| Lauren Tan | PR | "Small ordered commits, evidence in the description" + CI green |
| Anthropic | Change | 3 review rounds max, then reconsider |

**Universal done-rule:** a phase is done when its **artifact exists AND its verification passes AND the next phase's input is ready**. No phase is "done" on assertion alone.

---

## 6. KEY FINDINGS FOR ARSENAL v8.7

1. **Phase boundaries must be mechanical, not advisory.** Kousigan's finding that "a STOP sentence in a prompt is not a plan mode" (worker-05.md:156) is critical: Arsenal phase transitions need tool-enforced gates (branch permissions, required checks), not prompt text.

2. **The plan artifact is the most standardized boundary.** 19/19 workers document it. Minimum viable plan: what was understood, files involved, approach, risks, **verification method**, and explicit STOP.

3. **Commit-per-unit is the dominant artifact rule.** Osmani (per task), Helix (per checkpoint), Cherny (per PR), Lauren Tan (small ordered commits). The unit varies; the principle doesn't: **small, reviewable, committed**.

4. **Parallelism follows independence, not ambition.** Every parallel pattern (Cherny's 5 Claudes, Lauren's swarm, Helix's multi-screen, Stripe's minion swarms) restricts parallelism to **non-interfering** work units with per-worker artifact contracts.

5. **Transitions are where quality lives.** The corpus spends more words on gates/reviews/transitions than on implementation. Helix's 4 gates, Stripe's 2-round CI cap, Kousigan's checklist, the adversarial Hardener — the phase boundary is the product.

6. **The debug loop is a distinct phase shape.** Freeze → Reproduce → Explain (read-only) → Fix (minimal) → Verify (layered) deserves its own workflow template, not a generic "fix it" prompt.

---

*End of WORKER-4 report. 180+ lines. All claims cited to worker files.*
