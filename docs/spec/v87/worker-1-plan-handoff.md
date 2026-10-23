# WORKFLOW-RESEARCHER-1 — Plan-to-Execution Handoff

**Angle:** How elite developers structure the transition from planning to building with AI.
**Date:** 2026-10-18. **Corpus:** ~/workspace/research/ai-workflows/ worker-01..20 + SYNTHESIS-v8.7.md + one fresh web search (Anthropic plan-mode mechanics).

---

## 1. WHAT THE PLAN ARTIFACT CONTAINS — five documented shapes

### 1a. Kousigan's gated plan (most explicit section list)
Source: worker-05.md:143-146 (primary fetch https://www.kousigan.com/blog/ai-coding-agent-workflow-investigate-plan-implement-verify/, 2026-10-02).
The plan MUST state, in order: (1) what it understood (task restated in its own words), (2) which files matter (named, real), (3) existing patterns it will follow, (4) constraints, (5) what could go wrong, (6) the proposed change, (7) **how it will verify the change**. Then the agent **stops** — the stop is part of the artifact contract.
Approval checklist (human, before build): is it the right task in its own words? are named files real? does it reuse existing code before adding dependencies? are risks specific (not generic)? are tests named?

### 1b. Helix's checkpoint sequence (reviewable-in-minutes)
Source: worker-01.md:56 (https://shopify.engineering/helix). The plan is NOT a document — it is an **ordered sequence of checkpoints**, each described in a few words *deliberately*: "We'd rather give someone one decision they can make as opposed to ten pages they will skim." First checkpoint = screen skeleton, second = one deliberately small section; later checkpoints grow only after early decisions pass review. The smallness is the mechanism: checkpoints fit in a small context window so the agent reads the relevant part of the reference directly — **"the reference *is* the spec."**

### 1c. Osmani's /spec → /plan split (two artifacts, two commands)
Source: worker-02.md:63-66 (https://addyosmani.com/blog/agent-skills/, 2026-05-03). `/spec` runs an "interview-me" skill that grills the human one question at a time until the ask is specified, then writes a PRD covering objectives, structure, style, testing, boundaries — *before code*. `/plan` then breaks the PRD into small atomic tasks. Two artifacts: the PRD (what/why/boundaries) and the task list (what-order). `/build` automates task execution **against the pre-approved plan** and **halts if any step encounters issues or risks**.

### 1d. mfishbein's factory handoff (CTO → SWE package)
Source: worker-09.md:49-53 (Thread Reader https://threadreaderapp.com/thread/2081331938228232360.html). Five-stage planning pipeline: (1) `/factory-plan` **interviewer** reads the codebase, extracts missing context from the human via interview, writes a product brief; (2) `/factory-plan` **planner** turns the approved brief into small testable features and tasks; (3) `/factory-tests` **professor** — before ANY code, every task gets "an exam": success criteria + how the coding agent proves to itself the work succeeds; (4) `/factory-explain` **presenter** explains the plan "like I'm 10" with visual metaphors — rationale: agents write code faster than humans can understand it, so human comprehension is the new bottleneck; (5) `/factory-handoff` **CTO → SWE** packages brief + plan + tests + safety rails + stop conditions into ONE work order. Distinctive: best models do planning, then the work order goes to a **cheaper model for execution** (cost-aware routing by task type).

### 1e. Anthropic's own "explore, plan, code, commit" (primary-source mechanics)
Source: web search 2026-10-18 — https://www.anthropic.com/engineering/claude-code-best-practices (via slideshare mirror) + https://learnaiwithmariah.com/guides/how-anthropic-uses-claude-code/. The canonical internal pattern: (a) ask Claude to read relevant files/images/URLs, explicitly told **not to write code yet**; (b) **strong use of subagents for investigation** early ("telling Claude to use subagents to verify details or investigate particular questions it might have, especially early on in a conversation or task, tends to preserve context availability"); (c) ask for a plan, using "think" < "think hard" < "think harder" < "ultrathink" to buy thinking budget. Plan mode (Shift+Tab / `/plan` / `claude --permission-mode plan`) makes Claude **show a plan before making any actual changes** — "what, in what order" — approve or reject. Production testing cited: plan-first workflows **caught 71% of bad cross-file refactors** before any edits (https://gentic.news/article/how-to-build-ai-workflows-that).

**Synthesis of §1:** The plan artifact is never "a description of the change." It is always: restated understanding + file inventory + constraints + risks + verification plan + stop condition. The strongest form adds a per-task "exam" (mfishbein) or checkpoint sequence (Helix) so approval is per-slice, not per-monolith.

---

## 2. WHO APPROVES AND WHAT APPROVAL MEANS

- **Kousigan:** human reviews against the checklist (§1a). Approval = "you still own the decision" — the human is accountable for the plan's correctness, the agent is accountable for executing it faithfully. Source: worker-05.md:146.
- **Helix:** engineer approves the checkpoint *sequence*, not the code. Approval is cheap by design (minutes, one decision). Critically, approval is **revocable per checkpoint** — later checkpoints grow only after early decisions pass review. Source: worker-01.md:56.
- **Cherny (Claude Code creator):** conversational iteration — "go back and forth with Claude until I like its plan," THEN switch to auto-accept mode and let it 1-shot. Approval = the moment the human stops iterating. Source: worker-04.md:42-43 (readwise.io re-post of his thread).
- **Karpathy:** declarative approval — "Don't tell it what to do, give it success criteria and watch it go." Approval attaches to **outcomes**, not steps. Source: worker-05.md:21 (X thread 2026-01-26, 6.06M views).
- **Osmani:** the `/plan` output is the approval artifact; `/build` runs "against the pre-approved plan." Approval = plan exists and is unchanged since review. Source: worker-02.md:66.
- **Stripe Minions:** approval is *implicit in the trigger* — the Slack thread IS the approved context ("Implement this task completely" + thread). Deterministic context hydration runs before the agent loop. For high-stakes work the engineer still reviews the PR. Source: worker-01.md (https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents).

**Synthesis of §2:** Three approval granularities exist: (a) **plan approval** (Kousigan/Cherny/Osmani — approve the whole plan, then build), (b) **sequence approval** (Helix — approve the slice order, then build slice-by-slice with per-slice gates), (c) **criteria approval** (Karpathy — approve success criteria, let the agent loop). The corpus never shows "approve each line of the diff before it's written" — that granularity kills the leverage.

---

## 3. HOW THE PLAN IS HANDED TO THE BUILDER

- **Same-session handoff (Cherny, Kousigan, Anthropic plan mode):** the plan lives in the conversation; the human says "go" (or flips auto-accept). Context is shared — no re-hydration needed. Risk: the builder inherits the planner's assumptions silently. Kousigan's mitigation: the plan's "what could go wrong" section is the assumption ledger. Source: worker-04.md:42-43; worker-05.md:143-146.
- **Packaged work order (mfishbein):** brief + plan + tests + safety rails + stop conditions bundled into ONE artifact, handed to a **different (cheaper) model**. The handoff is explicit and the package is self-contained — the executor never saw the interview. Source: worker-09.md:53.
- **Checkpoint feed (Helix):** the builder receives ONE checkpoint at a time, not the whole plan. The reference code is the context ("the reference *is* the spec"). The orchestrator holds the sequence; the builder sees only its slice. Source: worker-01.md:57.
- **Spec-to-agent (Willison):** brainstorm with a chat model → **write a spec** → feed the spec to the coding agent asynchronously (Claude Code for web against a dedicated repo). The spec is the entire handoff. Source: worker-02.md:111-114 (https://simonwillison.net/2024/Sep/20/using-llms-for-code/).
- **Deterministic hydration (Stripe):** MCP tools run over links in the prompt BEFORE the agent loop — the handoff includes machine-fetched context, not just human prose. Source: worker-01.md (Minions setup step).

**Synthesis of §3:** The handoff fidelity problem is real and solved three ways: (a) keep planner and builder in one session (cheap, assumption-leak risk), (b) package everything into a self-contained work order for a fresh agent (mfishbein/Willison — cleanest separation, needs the best spec), (c) feed slices so the builder never needs the whole plan (Helix — smallest context, needs a strong orchestrator). The corpus consensus: **the verification plan and stop conditions must travel WITH the build instructions** — a plan without its "exam" is an incomplete handoff.

---

## 4. WHEN THE PLAN MEETS REALITY — deviation protocols

- **Osmani:** `/build` **halts if any step encounters issues or risks**. The halt is mechanical, not advisory. Anti-rationalization tables inside skills list excuses the agent is forbidden from using to skip steps — "encode that discipline as something the agent cannot talk itself out of." Source: worker-02.md:66,84-85.
- **Helix:** unlimited retries but **no override** — "it can't override a failed check just because it thinks the result is good enough." The UI gate can mark a comparison INVALID (states don't match), forcing re-capture rather than proceeding on bad data. The loop optimizes for **reliable convergence, not a perfect first shot**: "An attempt is allowed to be wrong. It is not allowed to ship until it isn't." Source: worker-01.md:75,77.
- **Kousigan:** the killer follow-up after verification — **"what remains unverified?"** — demanding evidence, not "looks right." Deviation is handled by re-verification, not re-planning, unless the evidence contradicts the plan's assumptions. Source: worker-05.md:148.
- **Lawson:** falsification loop — agent claimed a SQL perf fix; benchmark + EXPLAIN proved it made things SLOWER. Response: "try 3 different variants of the solution, testing each against the benchmark, and only then deciding." Deviation → generate alternatives against the SAME benchmark, don't argue with the oracle. Source: worker-05.md:72.
- **mfishbein:** circuit breakers stop the agent from "confidently digging a deeper hole" if stuck. The `/loop` records what happened per task — the deviation log IS the memory. Source: worker-09.md:54.
- **Slot-machine discipline (corpus-wide):** "starting over often has a higher success rate than trying to fix Claude's mistakes" — after bounded retries, `git reset --hard` and restart from the plan (or a revised plan), never wrestle a corrupted run. Source: worker-05.md:74; SYNTHESIS-v8.7.md P7.
- **Scale-the-ceremony rule (Kousigan):** the deviation protocol scales with blast radius — one-sentence diffs skip planning entirely; medium changes get investigation + plan; large/architecture/data-migration get the full protocol with deep investigation. A deviation on a small task = fix and move on; on a large task = stop and re-approve. Source: worker-05.md:152.
- **Cherny compounding:** every deviation that was a mistake becomes a checked-in rule ("every mistake Claude makes once becomes a rule it never makes again") — the deviation protocol's output is durable memory, not just a fixed bug. Source: worker-04.md:48.

**Synthesis of §4:** No practitioner lets the builder silently re-plan. The deviation ladder is: (1) retry against the SAME verification oracle (bounded), (2) escalate to human with evidence, (3) human decides: revise plan (re-approve) or restart from clean state, (4) the lesson is written into durable memory. The plan is a contract — the builder may not renegotiate it unilaterally.

---

## 5. CONCRETE CITATION INDEX (plan-handoff claims)

| # | Claim | Source |
|---|---|---|
| 1 | Plan must contain: understanding, files, patterns, constraints, risks, change, verification plan — then STOP | worker-05.md:143-146 (kousigan.com, 2026-10-02) |
| 2 | Approval checklist: right task in own words? files real? reuse before deps? risks specific? tests named? | worker-05.md:146 |
| 3 | Checkpoint sequence > document: "one decision they can make vs ten pages they will skim" | worker-01.md:56 (shopify.engineering/helix) |
| 4 | "The reference *is* the spec" — builder reads reference code directly, no giant spec file | worker-01.md:57 |
| 5 | /spec interviews human → PRD (objectives, structure, style, testing, boundaries) before code | worker-02.md:64 (addyosmani.com/blog/agent-skills/) |
| 6 | /build halts on issues/risks; anti-rationalization tables forbid excuse-skipping | worker-02.md:66,84-85 |
| 7 | Per-task "exam" before code: success criteria + how agent proves success to itself | worker-09.md:51 (mfishbein thread) |
| 8 | CTO→SWE package: brief + plan + tests + safety rails + stop conditions, to a cheaper model | worker-09.md:53 |
| 9 | Anthropic internal: explore (subagents) → plan ("think" budget ladder) → code → commit | anthropic.com/engineering/claude-code-best-practices (via search 2026-10-18) |
| 10 | Plan mode catches 71% of bad cross-file refactors pre-edit | gentic.news/article/how-to-build-ai-workflows-that (search 2026-10-18) |
| 11 | Cherny: iterate on plan conversationally, THEN auto-accept 1-shot — "a good plan is really important" | worker-04.md:42-43 |
| 12 | Karpathy: "Don't tell it what to do, give it success criteria and watch it go" | worker-05.md:21 (X 2026-01-26) |
| 13 | Unlimited retries, no override: "can't override a failed check just because it thinks the result is good enough" | worker-01.md:75 |
| 14 | "An attempt is allowed to be wrong. It is not allowed to ship until it isn't." | worker-01.md:77 |
| 15 | "What remains unverified?" — demand evidence, not "looks right" | worker-05.md:148 |
| 16 | A "STOP" sentence in a prompt is NOT plan mode — use the tool's read-only mode | worker-05.md:151 |
| 17 | Scale the ceremony: skip plan for trivial diffs; full protocol for architecture/data-migration | worker-05.md:152 |
| 18 | Fresh reviewer catches what builder talked itself into: "use a subagent to review against requirements" | learnaiwithmariah.com (Anthropic team tips, search 2026-10-18) |
| 19 | Every mistake once → checked-in rule ("compounding engineering") | worker-04.md:48 |
| 20 | Verification skills had the strongest effect on output quality (Anthropic internal finding) | SYNTHESIS-v8.7.md P2 (worker-13) |

---

## 6. IMPLICATIONS FOR ARSENAL v8.7 (handoff-specific)

1. **The work-order IS the handoff package** — Omar's prompt-forge orders already bundle trigger + context + non-negotiables + DAG + verification + completion contract. The corpus says: add the per-task "exam" (success criteria the builder proves to itself) and an explicit assumption/risk ledger. (mfishbein §1d, Kousigan §1a)
2. **Approval granularity fits the triumvirate** — Aether produces the plan artifact; Omar approves the plan (or checkpoint sequence); Blazar builds. The corpus validates this exact separation and warns against merging planner+builder in one session without a written artifact between them. (Helix §2, Cherny §2)
3. **The deviation ladder is missing and needed** — v8.7 should codify: bounded retry vs same oracle → escalate with evidence → Omar revises or restarts → lesson into memory. Never silent re-planning. (Osmani §4, Helix §4, slot-machine §4)
4. **"STOP" sentences are not enforcement** — Kousigan's finding (worker-05.md:151) directly applies: any v8.7 phase gate that must actually stop the builder needs a mechanical enforcement (separate session, permission boundary, or Omar-mediated checkpoint), not a prompt instruction.
5. **Cost-aware routing is validated** — mfishbein's best-model-plans / cheap-model-executes matches Omar's DeepSeek-for-side-agents decision (D-2026-10-18-001). The corpus independently arrived at the same routing.
