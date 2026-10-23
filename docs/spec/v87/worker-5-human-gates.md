# WORKER-5 — Human-AI Decision Points & Release Discipline
**Angle:** where REAL elite developers insert human judgment in the AI workflow, and how they handle releases.
**Corpus:** 20 worker files + SYNTHESIS-v8.7.md, ~/workspace/research/ai-workflows/
**Date:** 2026-10-18

---

## 1. EXACT HUMAN DECISION POINTS (the gates where a human MUST act)

### Gate A — Plan/spec approval (pre-implementation)
- **Helix (Shopify):** engineer approves the *checkpoint sequence* — deliberately a few words per checkpoint: "We'd rather give someone one decision they can make as opposed to ten pages they will skim." (worker-01.md:56)
- **Kousigan protocol:** Understand → Investigate → Plan → **STOP/Approve** → Implement. The STOP is structural, not optional. (SYNTHESIS-v8.7.md Part 3)
- **Osmani SDLC:** `/spec` → `/plan` → `/build` with hard halt between plan and build. (worker-02.md:67-69)
- **Karpathy:** "Think Before Coding" — state assumptions, ask when ambiguous. The human decides what is ambiguous. (SYNTHESIS-v8.7.md P1)
- **Anthropic internal:** "explore → plan → code" — plan reviewed before code. (SYNTHESIS-v8.7.md P1)

### Gate B — Checkpoint/diff review (per unit of work)
- **Helix Gate 4:** "The engineer looks at code + running app and decides." Feedback goes TWO places: the agent fixes and re-runs the gates, AND Helix records it in memory to improve every checkpoint that follows. (worker-01.md:63)
- **Stripe Minions:** human review mandatory on every PR. (worker-14.md:297)
- **Shopify:** human review mandatory on every PR; engineer closes the loop. (worker-14.md:297)
- **Linear:** human approval on every merge. (worker-20.md:74)
- **Atlassian (interviews, 2026):** "The phrase that came up in interview after interview: *it's my name on it*." Engineers want AI that "observes and alerts… Then let me decide what to do about it." Human decides on every consequential action. (worker-14.md:203)

### Gate C — Merge/release sign-off (terminal)
- **GitHub Secret Protection:** "Agent-generated PRs go through the *same* pipeline as human code: automated testing, human review, deployment by engineers. Requesting changes is streamlined — just add comments to a pull request." (worker-01.md:105)
- **Karpathy:** "never merge code I don't understand" (abu_shahed variant); Karpathy: "watch them like a hawk" — mistakes are now *subtle conceptual errors*, not syntax. (worker-20.md:67)
- **Okeke:** triage *in writing* — "triage is where you stay in charge." (worker-20.md:66)
- **Anthropic:** humans reserved for high-risk tiers — "taste, direction, scope." (worker-20.md:74)
- **No credible internal source describes unsupervised merge.** (worker-14.md:297)

### Gate D — Scope/direction decisions (strategic, never delegated)
- **Atlassian trust sequencing:** "Reactive assistant is where everyone is today. Proactive observer is what people want next. Autonomous coordinator is something most engineers said they might trust later, in narrow contexts, with strong guardrails. Trust will be earned in that order." Stack Overflow 2025 survey: 76% of developers don't plan to use AI for deployment and monitoring; 69% don't plan to use it for project planning — "The highest-responsibility tasks are the last to earn trust." (worker-14.md:194)
- **Alex (W06):** never lets AI architect. (worker-20.md:68)
- **Kousigan:** "AI can propose the implementation. You still own the decision." (worker-20.md:67)
- **Ali:** "the engineer must still own the outcome." (worker-20.md:76)
- **HN Eisenhower triage:** "Urgent & Ambiguous → Agentic Coding is useless, an act of desperation. Can wait and at least non-ambiguous → Agentic Coding is perfect fit." (worker-11.md:173)

### Gate E — Destructive/irreversible actions
- **Corpus invariant:** "irreversible actions gated, reversible territory free." (worker-20.md:213)
- **akonlongman:** confirmation gates on destructive ops — mechanical, not prompts. (worker-20.md:213)
- **Jer Crane incident (cautionary):** summarized safety rules "no longer mechanically bound the agent's next action" → Cursor + Claude deleted PocketOS's production Railway volume in 9 seconds. (SYNTHESIS-v8.7.md A5)

---

## 2. HOW RISK IS TIERED (what determines review depth)

### The canonical tier ladder (Anthropic, from worker-02.md:202 and worker-20.md:182)
- **Low-risk:** auto-approved after automated checks pass. No human in the loop.
- **Standard:** 1 human reviewer.
- **High-risk (billing, CI, security, release, installers):** 2 humans required.

### Anthropic's Quick/Standard/Deep tiers (worker-08.md:267)
- **Quick / Standard / Deep** matched to blast radius.
- CODEOWNERS + branch protection force human review on: auth, billing, CI, release, installers.
- Approvals dismissed on new commits (re-review required).

### Linear's model (worker-13.md:56)
- Humans intervene **only by risk tier**: low-risk changes need no human approval once automated checks pass; high-risk areas (billing, CI workflows) require **two humans**.

### OpenAI factory (worker-17.md:191)
- Risk-sorted reviewers; per-change SRE escort agents for infrastructure-touching changes.

### Trust sequencing (Atlassian, worker-14.md:194)
- Reactive assistant (today) → Proactive observer (next) → Autonomous coordinator (later, narrow contexts, strong guardrails). "Earned in that order."

### The unanimous invariant
**"A bot's approval never replaces a required human's on high-risk paths."** (worker-08.md:237; worker-20.md:182)

### Risk-determining factors (synthesized)
1. **Blast radius:** who/what breaks if wrong (billing > docs).
2. **Reversibility:** can it be undone (config change > data migration).
3. **Novelty:** first-of-kind vs routine pattern.
4. **Proximity to money/trust:** payments, auth, user data, production infra.
5. **Author trust history:** "Trusted authors get lighter paths; start strict, loosen with evidence." (worker-08.md:235)

---

## 3. RELEASE DISCIPLINE (who releases, what checks, what blocks)

### Who releases
- **Always a human.** No workflow in the corpus describes AI-triggered production release without human sign-off. GitHub: "deployment by engineers." (worker-01.md:105)
- **Helix:** "Commit per checkpoint. Most engineers then branch and raise PRs." Autonomous runs yield committed checkpoints with evidence — PRs still human-raised. (worker-01.md:64)
- **Shopify culture (Thawar):** "pair with an AI agent, but your name is on the PR." The releaser owns comprehension: "the bar for comprehension does not move" even when 90–95% of code is LLM-generated. (worker-14.md:89-94)

### The darkship pattern (GitHub Secret Protection, worker-01.md:103-113)
- **Darkship:** ship "dark" — results observed in production WITHOUT writing validity inferences to the database — so engineers catch drift between API docs and actual behavior before going live.
- The darkship config change itself is a human operation; the agent only makes the small config change to exit darkship mode when the human says ready.
- This is the corpus's most sophisticated release discipline: a production-observation stage between merge and full activation.

### What checks gate a release
- **Helix 4 gates, in order; a failed gate cannot be overridden** (worker-01.md:59-63):
  1. Behavior (generated integration tests, user-perspective)
  2. UI review (separate model family, every difference with severity + location)
  3. Adversarial reviews (two context-isolated agents, unanimous approval, every finding fixed)
  4. Engineer closes the loop (human decision)
- **Stripe:** local lint <5s → CI with hard cap of 2 rounds max. (SYNTHESIS-v8.7.md P2)
- **Anthropic:** six automated layers before/at PR; humans only for high-risk tiers. (worker-13.md:70)

### What blocks a release
- Any failed gate (mechanical, non-overridable): "it can't override a failed check just because it thinks the result is good enough." (worker-01.md:75)
- Human rejection at Gate 4 / PR review.
- Missing evidence: Helix commits carry "archived UI reviews, passing tests, reviewer verdicts" — the evidence bundle IS the shippable unit. (worker-01.md:64)

### Autonomy inside gates, never past them
- "The autonomy that exists (Stripe's unattended runs, Shopify's overnight mode) is autonomy *inside* fixed gates, never past the final human." (worker-01.md:217)
- Helix: "the gates don't become more lax when nobody is watching." (worker-01.md:65)

---

## 4. ESCALATION TRIGGERS (when the AI stops and asks)

### E1 — Genuine product/requirement ambiguity
- **execute25 pattern:** when the Author hits a genuine product decision it exits with `STATUS: NEEDS_ANSWERS` rather than inventing requirements. (worker-10.md:207)
- **Headless worker pattern (HN):** workers call an `ask_human` MCP tool to ask the operator questions; Telegram integration for async Q&A. (worker-11.md:86)
- **HN Eisenhower:** ambiguity is the #1 no-delegate signal — "Urgent & Ambiguous → Agentic Coding is useless." (worker-11.md:173)

### E2 — Loop non-convergence (circuit breaker trips)
- **Stripe:** max 2 CI rounds — then human. (SYNTHESIS-v8.7.md P7)
- **Anthropic:** after 3+ review rounds, author must reconsider the approach (one change looped 50+ rounds in a night). (SYNTHESIS-v8.7.md P7)
- **Kousigan:** the killer follow-up "what remains unverified?" — demanding evidence, and escalation when the answer is "I don't know." (SYNTHESIS-v8.7.md P2)
- **mfishbein:** circuit breakers "stop it from confidently digging a deeper hole." (SYNTHESIS-v8.7.md P7)

### E3 — Assumption required on unsafe ground
- **MadDogWarner:** "stop, that assumption is unsafe — that is the workflow." The stop itself is the designed behavior. (worker-20.md:76)
- **Karpathy's #1 failure mode:** "models make wrong assumptions on your behalf and just run along with them" — the countermeasure is a hard rule to surface assumptions, not proceed. (SYNTHESIS-v8.7.md A1)

### E4 — Destructive or irreversible action
- Confirmation gates on destructive ops, mechanical not prompt-based. (worker-20.md:213)
- **Ceremony rule (W08):** "Delete it with ceremony — list it, review it, THEN delete." (worker-08.md:35)

### E5 — Judgment-heavy steps (never delegated in the first place)
- GitHub Secret Protection: research/judgment steps (least-intrusive endpoint choice, live token testing, interpreting API changes) "remained tasks best handled by experienced engineers" — they tried delegating and it failed. (worker-01.md:101)
- Architecture/API design stays human; AI owns mechanical surface. (worker-08.md:275)

### E6 — Context degradation
- 60%-context rule: "If context hits 60%, stop and ask yourself: 'What can I save to a file and reference later?'" (worker-07.md:178)
- Phase-boundary resets: "Research → clear context; Plan (iterate) → clear context; Implement (one phase) → clear context; Validate → clear context." (worker-07.md:178)

---

## 5. CONCRETE CITATIONS INDEX

| Claim | Source |
|---|---|
| "your name is on the PR" (Shopify) | worker-14.md:87-94 |
| "it's my name on it" (Atlassian interviews) | worker-14.md:203 |
| Helix 4 gates, no override | worker-01.md:59-63 |
| Gates don't lax when unwatched | worker-01.md:65 |
| Anthropic low/standard/high-risk tiers | worker-20.md:182; worker-13.md:56 |
| Quick/Standard/Deep + CODEOWNERS | worker-08.md:235-237 |
| Bot approval never replaces human (high-risk) | worker-08.md:237 |
| Darkship release pattern | worker-01.md:103-113 |
| STATUS: NEEDS_ANSWERS exit | worker-10.md:207 |
| ask_human MCP tool | worker-11.md:86 |
| "stop, that assumption is unsafe" | worker-20.md:76 |
| Trust earned in that order | worker-14.md:194 |
| 76%/69% won't trust AI for deploy/planning | worker-14.md:194 |
| 2-round CI cap (Stripe) | SYNTHESIS-v8.7.md P7 |
| 3-round review cap (Anthropic) | worker-13.md:57 |
| Delete with ceremony | worker-08.md:35 |
| 9-second production deletion (Crane) | SYNTHESIS-v8.7.md A5 |

---

## 6. v8.7 IMPLICATIONS (for Aether's planning)

1. **Five human gates minimum:** plan approval → checkpoint review → merge sign-off → release authorization → destructive-action confirmation. None skippable, none delegable to the agent's judgment.
2. **Risk tiers map to Arsenal:** low-risk (docs, formatting) → auto after verifiers; standard → vanbu verify + Omar sign-off; high-risk (lock schema, registry, release) → Omar + evidence bundle.
3. **Darkship as release doctrine:** every release gets a production-observation stage before full activation — directly applicable to Arsenal kit/registry changes.
4. **Escalation as designed behavior:** `NEEDS_ANSWERS` / needs_user_action is the CORRECT output for ambiguity — never a failure, never to be "optimized away."
5. **Circuit breakers are gates, not suggestions:** 2-round fix cap per node, 3-round review cap, then mandatory human reconsideration.
6. **The evidence bundle ships, not the code alone:** every commit/release carries its verification evidence (test results, reviewer verdicts, gate outputs) — matching Omar's announce→verify→release.
