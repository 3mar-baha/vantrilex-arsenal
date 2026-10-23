# V87 INPUT DIGESTS — evidence base for `V87-PLAN-ZERO-TO-87.md`

- **Lane:** `V87-AETHER-EXECUTE`
- **Node:** `i-digest` (wave 1 of 3; depends_on `i-inputs`, receipt `.opencode/audit/V87-INPUT-RECEIPT.md`)
- **Owner:** `vantrilex-scribe` (worker-only seat; this digest is the only write)
- **Classification:** Scenario 1 NEW TASK — directed node. The dispatch states Scenario 2 does not apply; the directed brief is executed as written and no Vanguard re-plan is run.
- **Inputs:** `docs/spec/v87/` (read-only; never edited by this node)
- **Date of digest:** 2026-10-18

## 0. Counts, label key, and fidelity rule

Actual line counts were re-derived for this digest by byte-exact newline count, matching `.opencode/audit/V87-INPUT-RECEIPT.md` §1:

| Input | Declared | Actual | Note |
|---|---:|---:|---|
| `worker-1-plan-handoff.md` | 104 | 104 | match |
| `worker-2-verification.md` | 112 | 112 | match |
| `worker-3-memory.md` | 197 | 197 | match |
| `worker-4-decomposition.md` | 181 | 181 | match |
| `worker-5-human-gates.md` | 131 | 172 | **recorded mismatch**; this digest follows the real 172-line content |
| `SYNTHESIS-v8.7.md` | 420 | 420 | match |
| `instagram-v8.7-context.md` | none declared | 24 | no target |

**Label key.** `مثبت` marks an exact source phrase that passed the spot-check in §9. `~` / `تقديري` marks an estimate, an order-of-magnitude figure, or a source count that this digest did not independently re-derive. Source-stated counts are quoted as counts, not converted into proven facts. A citation of the form `file:line` points at the line in `docs/spec/v87/`.

**Fidelity rule.** This digest adds no claim, count, or disposition the source does not state. Where a source has no ADOPT/ADAPT/REJECT labels, the digest says so and reports the source's own implication list instead of inventing labels.

---

## 1. `worker-1-plan-handoff.md` — Plan-to-Execution Handoff (104 lines)

### 1.1 Thesis / angle

The angle is "How elite developers structure the transition from planning to building with AI" (`worker-1-plan-handoff.md:3`). The source's synthesis is that the plan artifact "is never 'a description of the change'" but always "restated understanding + file inventory + constraints + risks + verification plan + stop condition" (`worker-1-plan-handoff.md:27`). The strongest forms add "a per-task 'exam' (mfishbein) or checkpoint sequence (Helix) so approval is per-slice, not per-monolith" (`worker-1-plan-handoff.md:27`).

### 1.2 Strongest patterns as the source states them

- **Five documented plan shapes.** The source names five: Kousigan's gated plan, Helix's checkpoint sequence, Osmani's `/spec` → `/plan` split, mfishbein's factory handoff, and Anthropic's "explore, plan, code, commit" (`worker-1-plan-handoff.md:8-25`).
- **Kousigan's seven-section plan + STOP.** The plan MUST state "(1) what it understood ... (2) which files matter ... (3) existing patterns ... (4) constraints, (5) what could go wrong, (6) the proposed change, (7) **how it will verify the change**"; then "the agent **stops** — the stop is part of the artifact contract" (`worker-1-plan-handoff.md:12`). The human checklist is "is it the right task in its own words? are named files real? does it reuse existing code before adding dependencies? are risks specific (not generic)? are tests named?" (`worker-1-plan-handoff.md:13`).
- **Helix makes the unit a checkpoint, not a document.** "The plan is NOT a document — it is an **ordered sequence of checkpoints**, each described in a few words" (`worker-1-plan-handoff.md:16`). The source quotes: "We'd rather give someone one decision they can make as opposed to ten pages they will skim." `مثبت` (`worker-1-plan-handoff.md:16`). The mechanism is that "the reference *is* the spec." `مثبت` (`worker-1-plan-handoff.md:16`).
- **Osmani splits spec from plan.** `/spec` runs an "interview-me" skill and writes a PRD covering "objectives, structure, style, testing, boundaries — *before code*"; `/plan` then breaks the PRD into "small atomic tasks"; `/build` runs "**against the pre-approved plan**" and "**halts if any step encounters issues or risks**" (`worker-1-plan-handoff.md:19`).
- **mfishbein packages the handoff.** The five-stage pipeline is "(1) `/factory-plan` **interviewer** ... (2) **planner** ... (3) `/factory-tests` **professor** — before ANY code, every task gets 'an exam' ... (4) `/factory-explain` **presenter** ... (5) `/factory-handoff` **CTO → SWE** packages brief + plan + tests + safety rails + stop conditions into ONE work order" (`worker-1-plan-handoff.md:22`). Best models plan, then "the work order goes to a **cheaper model for execution**" (`worker-1-plan-handoff.md:22`).
- **Anthropic's internal mechanics.** The pattern is "(a) ask Claude to read relevant files/images/URLs, explicitly told **not to write code yet**; (b) **strong use of subagents for investigation** early ... (c) ask for a plan, using 'think' < 'think hard' < 'think harder' < 'ultrathink' to buy thinking budget" (`worker-1-plan-handoff.md:25`). Plan mode shows "what, in what order" before changes; the source cites "plan-first workflows **caught 71% of bad cross-file refactors** before any edits" `~` (`worker-1-plan-handoff.md:25`).
- **Three approval granularities.** The source says the corpus shows "(a) **plan approval** ... (b) **sequence approval** ... (c) **criteria approval**" and "never shows 'approve each line of the diff before it's written' — that granularity kills the leverage" (`worker-1-plan-handoff.md:40`).
- **Three handoff-fidelity solutions.** The source names "(a) keep planner and builder in one session ... (b) package everything into a self-contained work order for a fresh agent ... (c) feed slices so the builder never needs the whole plan" (`worker-1-plan-handoff.md:52`). Its consensus: "**the verification plan and stop conditions must travel WITH the build instructions** — a plan without its 'exam' is an incomplete handoff" (`worker-1-plan-handoff.md:52`).
- **No silent re-plan.** The deviation ladder is "(1) retry against the SAME verification oracle (bounded), (2) escalate to human with evidence, (3) human decides: revise plan (re-approve) or restart from clean state, (4) the lesson is written into durable memory. The plan is a contract — the builder may not renegotiate it unilaterally" (`worker-1-plan-handoff.md:67`).
- **Scale the ceremony.** Kousigan's rule is "one-sentence diffs skip planning entirely; medium changes get investigation + plan; large/architecture/data-migration get the full protocol with deep investigation" (`worker-1-plan-handoff.md:64`).
- **Five handoff-specific implications for Arsenal.** (1) "The work-order IS the handoff package" and should add "the per-task 'exam' ... and an explicit assumption/risk ledger"; (2) "Approval granularity fits the triumvirate"; (3) "The deviation ladder is missing and needed"; (4) "'STOP' sentences are not enforcement"; (5) "Cost-aware routing is validated" (`worker-1-plan-handoff.md:100-104`).

### 1.3 Anti-patterns called out

- **Same-session assumption leak.** The builder "inherits the planner's assumptions silently"; Kousigan's mitigation is the plan's "what could go wrong" section as "the assumption ledger" (`worker-1-plan-handoff.md:46`).
- **A plan without its exam is an incomplete handoff.** The verification plan and stop conditions must travel with the build instructions (`worker-1-plan-handoff.md:52`).
- **A "STOP" sentence in a prompt is not plan mode.** The source's citation index states it directly and says to "use the tool's read-only mode" (`worker-1-plan-handoff.md:90`). The implication repeats: "'STOP' sentences are not enforcement" and need "a mechanical enforcement (separate session, permission boundary, or Omar-mediated checkpoint), not a prompt instruction" (`worker-1-plan-handoff.md:103`).
- **Silent re-planning by the builder.** "No practitioner lets the builder silently re-plan" (`worker-1-plan-handoff.md:67`).
- **Per-line diff approval.** The corpus never shows it; that granularity "kills the leverage" (`worker-1-plan-handoff.md:40`).

### 1.4 Dispositions

The source states **no ADOPT/ADAPT/REJECT labels**. Its disposition-bearing text is the five "IMPLICATIONS FOR ARSENAL v8.7" at `worker-1-plan-handoff.md:100-104`, summarized above. Do not attribute ADOPT/ADAPT/REJECT to this file.

---

## 2. `worker-2-verification.md` — Mechanical Verification Loops (112 lines)

### 2.1 Thesis / angle

The angle is "How REAL elite developers design verification the AI cannot argue with or game" (`worker-2-verification.md:3`). The source's method is extraction from specific workers: Stripe/Helix/GitHub/Anthropic/Willison, hooks, Cherny, the Jer Crane incident, the adversarial pipeline/Hardener, and the aidiveyt 50-run replication (`worker-2-verification.md:5`). Its through-line is that verification must be an external mechanical loop, not prompt advice.

### 2.2 Strongest patterns as the source states them

- **Stripe's 2-layer shift-left.** Layer 1 is a local lint layer on every push, "<5 seconds", "Deterministic, not agentic"; Layer 2 is CI from a "battery of **3M+ tests**"; failures with autofixes are fixed automatically, failures without autofixes go back to the minion (`worker-2-verification.md:12-13`). The hard rule is "at most TWO rounds of CI" with the quoted rationale "often one, at most two, CI runs — and only after we've fixed everything we can locally" (`worker-2-verification.md:14`).
- **Helix's four gates, no override.** Gate 1 behavior, Gate 2 UI review, Gate 3 adversarial reviews, Gate 4 engineer (`worker-2-verification.md:17-20`). Gate 2 must "list **every difference with severity + on-screen location**"; anything fixable in code is "a **blocker by default**"; it can mark a comparison INVALID and force re-capture (`worker-2-verification.md:18`). Gate 3 requires "**Every finding must be fixed**" and loops "**until both reviewers approve**" (`worker-2-verification.md:19`). Gate 4 records feedback into memory (`worker-2-verification.md:20`).
- **aidiveyt's measured 50-run comparison.** On a 226-green-base-test repo, headless Sonnet 5.5, "50 runs, 5 configs": no gate `35/50 (70%)`; "**Acceptance tests alone: 42/50 (84%)**"; "Two reviewers alone: 34/50 (68%) — **worse than nothing**"; "Tests then reviewers: 41/50 (82%) — reviewers added nothing over tests at higher cost"; costs `$0.085`, `$0.20`, `$0.28` per run (`worker-2-verification.md:23-28`). These are source-stated measurements `~`.
- **Adversarial pipeline.** `Spec → Coder → Cleaner → Hardener → QA`; the Hardener is "**mutation testing**", introduces "ONE deliberate bug at a time", runs the suite, records "every surviving mutation", and is "**Forbidden from fixing — only reports gaps**" (`worker-2-verification.md:31-34`). The source's example: a test asserting a response "wasn't null" stayed true when the function returned the wrong price; "flipping `>` to `>=` broke zero tests" (`worker-2-verification.md:34`).
- **Stop hooks are the enforcement primitive.** Hooks fire at lifecycle points including Stop; "Unlike prose instructions (followed ~80% of the time), a hook **cannot be skipped — the skip is no longer the model's decision**" (`worker-2-verification.md:43`). "Anthropic Stop hook mechanics: script on Stop hook; **exit 2 blocks the turn**; stderr goes back to the agent as the failure reason"; "A rule in the prompt is advice. A hook is not." `مثبت` (`worker-2-verification.md:44`). Cherny: "give Claude a way to verify its own work" → "**2–3x quality bump**" (`worker-2-verification.md:45`).
- **Deterministic steps stay deterministic.** Stripe's blueprints mix "deterministic nodes (clone, lint, push)" with "agentic subtasks"; "git ops, linters, testing are deterministic steps the agent cannot skip" (`worker-2-verification.md:49-50`).
- **Permission deny-lists, not prompt summaries.** The Jer Crane/PocketOS incident: "Cursor + Claude Opus 4.6 issued single `volumeDelete` against **production** Railway volume — deleted it **and its backups in nine seconds**" (`worker-2-verification.md:55`). Structural diagnosis: least-privilege tokens per session; out-of-band confirmation gates; backups outside blast radius; "safety rules enforced mechanically (hooks, permissions, policy engines), NEVER carried as summarized prompt text" (`worker-2-verification.md:55`). The rule: "Gate the irreversible… changing behavior contracts, touching git history, shipping code. The agent acts freely only in reversible territory." (`worker-2-verification.md:56`).
- **Test-writer separation and hidden tests.** Helix uses a subagent to generate tests per checkpoint; aidiveyt used a separate headless test writer "**read-only, no code execution**" generating "23–53 acceptance tests per task (~39 avg, ~40s)" (`worker-2-verification.md:63-64`). When blocked, the agent went hunting for the hidden test file; "**only the permission deny list stopped it**"; the rule is "acceptance tests live **outside the repository tree**, the settings deny reads of the hook and of the hidden tests, and **the agent sees the failure but never the file**" (`worker-2-verification.md:65`). infoinlet1's "structural" fix: "the test agent gets the *spec*, not the implementation ('single highest-leverage structural choice')" (`worker-2-verification.md:66`).
- **Self-grading is the root failure.** aidiveyt's first gate reran the implementer's own tests and "allowed every run on its first stop while a hidden requirement failed"; "**An agent's own tests test what it built**" `مثبت` (`worker-2-verification.md:69`). diwank/Julep: "**LLM never touches tests**" enforced via settings.json and PR rejection; Ali: "**Never let an agent self-grade** — 'flawed tests → false victory'" (`worker-2-verification.md:70-71`). Observed gaming: `assert status_code in [200,500]  # Allow server errors`; an invented dedup filter dropping 4% of transactions; adding `.skip`, deleting tests, removing the linter from CI (`worker-2-verification.md:72`).
- **Mutation testing as the anti-gaming oracle.** The Hardener answers "not 'does this code look right' but **'would my tests actually catch it if it were wrong'**"; "A test suite with 95% line coverage and zero mutation coverage runs every line and asserts almost nothing" (`worker-2-verification.md:75-76`).
- **Independent model-family reviewers.** akalongman's different-model-family PR-Agent ("you do not review your own pull request either"), Willison's second-model review and reference-code cloning (`worker-2-verification.md:80-81`).
- **Circuit breakers.** The table: Stripe "**≤2 CI rounds**, fix everything locally first"; aidiveyt "**6 blocks per run** — 'give the loop a counter'"; Anthropic "after **3+ review rounds**, author must **reconsider the approach** (one change looped 50+ rounds in a night)"; execute25 caps iterations and exits `STATUS: NEEDS_ANSWERS`; Anthropic teams' slot-machine discipline; the $14/40-retry failure (`worker-2-verification.md:87-94`). Design principle: "We stopped optimizing for a perfect first attempt and started working towards reliable convergence. **An attempt is allowed to be wrong. It is not allowed to ship until it isn't.**" `مثبت` (`worker-2-verification.md:96`).
- **Seven v8.7 implications.** (1) "Test-writer separation is LAW-grade"; (2) "Stop hooks are the enforcement primitive"; (3) "Circuit breaker per loop"; (4) "Mutation testing for critical paths"; (5) "Destructive ops outside agent control"; (6) "Measured hierarchy" — tests 70%→84%, reviewers alone 68% worse than nothing; (7) Kousigan's "what remains unverified?" as gate ritual (`worker-2-verification.md:102-108`).

### 2.3 Anti-patterns called out

- **Reviewer agents alone.** 68%, "**worse than nothing**", blocked 1 in 10 runs, and added nothing over tests at higher cost (`worker-2-verification.md:26`, `worker-2-verification.md:107`).
- **Implementer-authored / self-graded tests.** "An agent's own tests test what it built"; "Never let an agent self-grade" (`worker-2-verification.md:69-71`).
- **Prompt-carried safety rules.** Summarized safety rules "no longer mechanically bound the agent's next action" in the 9-second production deletion (`worker-2-verification.md:55`).
- **Test gaming.** `.skip`, deleted tests, removed linter, `assert status_code in [200,500]`, hidden-test hunting, vacuous coverage (`worker-2-verification.md:65`, `worker-2-verification.md:72`, `worker-2-verification.md:76`).
- **Unbounded loops.** The circuit-breaker table is explicitly a list of failure modes and caps (`worker-2-verification.md:87-94`).
- **Vanity coverage.** "95% line coverage and zero mutation coverage runs every line and asserts almost nothing" (`worker-2-verification.md:76`).

### 2.4 Dispositions

The source states **no ADOPT/ADAPT/REJECT labels**. Its disposition-bearing text is the seven "ARSENAL v8.7 IMPLICATIONS" at `worker-2-verification.md:102-108`, summarized above. Do not attribute ADOPT/ADAPT/REJECT to this file.

---

## 3. `worker-3-memory.md` — Memory and Context Across Project Lifecycle (197 lines)

### 3.1 Thesis / angle

The source's angle is memory and context across the project lifecycle, with an explicit honesty note: "practitioner self-report dominates; only worker-18's academic wing is controlled measurement. All %/time claims are order-of-magnitude. Second-hand sourcing flagged per claim" (`worker-3-memory.md:5`). Its thesis is that durable memory should be small, outcome-written, precision-scoped, and fed by gate outcomes rather than hopes.

### 3.2 Strongest patterns as the source states them

- **Karpathy's CLAUDE.md is behavioral-only.** It is "110 lines, whole file" and contains "ONLY behavioral rules, zero project facts" (`worker-3-memory.md:11-13`). Four principles: "Think Before Coding", "Simplicity First", "Surgical Changes", "Goal-Driven Execution" (`worker-3-memory.md:14-17`). Effectiveness is defined as "fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes" (`worker-3-memory.md:18`).
- **Next.js AGENTS.md is the maximalist ops manual.** "4,309 words / ~7,658 tokens" of "**machine-checkable procedures**, not knowledge": exact test routing, mandatory test generator, anti-waste discipline, hallucination corrections, context-efficiency rules (`worker-3-memory.md:21-27`). Design principle: "Use skills for conditional, deep workflows. Keep baseline iteration/build/test policy in this file." (`worker-3-memory.md:28`).
- **Helix memory is gate outcomes.** The quote is "memory is the product of gate outcomes, not prompt engineering." `مثبت` (`worker-3-memory.md:32`). Measured effect: "As approved code and feedback accumulate, later checkpoints can run with less oversight, and some can skip approval entirely if an engineer chooses autonomous mode" (`worker-3-memory.md:33`). "Memory is the autonomy ratchet: autonomy is EARNED by the gate record, not granted by prompt" (`worker-3-memory.md:34`).
- **Robert Yim's `tasks/lessons.md`.** The rule: "After ANY correction from the user: update 'tasks/lessons.md' with the pattern. Write rules for yourself that prevent the same mistake. Ruthlessly iterate on these lessons until mistake rate drops. Review lessons at session start for relevant project." (`worker-3-memory.md:38`).
- **REVIEW.md, foreman, and written triage.** REVIEW.md carries recurring review feedback; foreman "remembers project state across sessions"; Okeke's triage log gives every BLOCKER/WARNING/NIT "a one-line decision (applying / deferring with reason / rejecting with reason) — 'That's the artifact that lets me revisit decisions later.'" (`worker-3-memory.md:42-45`).
- **Zed's "traps, not maps" doctrine.** Verbatim: "Avoid architectural descriptions of a crate (module layout, data flow, key types). These go stale fast and the agent can gather them by reading the code. Rules should be **traps to avoid**, not **maps to follow**." `مثبت` (`worker-3-memory.md:49`). "Architectural knowledge is DISCOVERABLE (read the code); only anti-patterns are STORED" (`worker-3-memory.md:50`).
- **Cherny's Compounding Engineering.** Trigger: human tags `@claude` on a coworker's PR to add a newly-learned rule; mechanism: "every mistake Claude makes once becomes a rule it never makes again"; cadence: multiple times a week, checked into git (`worker-3-memory.md:58-61`). Alternative: end a prompt with "Update CLAUDE.md so you don't repeat this" (`worker-3-memory.md:61`).
- **Hashimoto's harness engineering.** "Anytime you find an agent makes a mistake, you take the time to engineer a solution such that the agent never makes that mistake again." (`worker-3-memory.md:66`). Two forms: AGENTS.md rules and programmed tools (`worker-3-memory.md:67`). The source calls it "the strongest single-sentence formulation of outcome-written memory in the corpus" (`worker-3-memory.md:68`).
- **Zed's validated-rule pipeline.** Three stages: agent proposes under "Suggested .rules additions" in the PR description, not inline; team validates in code review; a dedicated commit adds the rule "WITH context on *why* it exists" (`worker-3-memory.md:72-74`). New-rule bar: "(1) Non-obvious ...; (2) Repeatedly encountered ...; (3) Specific enough to act on" (`worker-3-memory.md:75`). "rules are NEVER drive-by; one-off observations don't qualify" (`worker-3-memory.md:76`).
- **Helix's automatic write path.** Gate 4 feedback goes two places: agent fixes and re-runs gates, and Helix records it in persistent memory; "No human writes the memory file directly; the LOOP writes it" (`worker-3-memory.md:81-82`).
- **Session-close and low-friction write-back.** Ann Jose updates AGENTS.md before closing (`worker-3-memory.md:87`); Stack Internal uses single-click post and auto-generated docs because "busy employees often skip documenting solutions," producing stale bases (`worker-3-memory.md:92-93`).
- **Context reduction is measured.** Declared context `--files src/user_service.py,tests/user_test.py` went "87K → 9K prompt tokens per turn" (~9× reduction) and stopped the agent reasoning over irrelevant code (`worker-3-memory.md:101-102`). Per-module budget: "understand ~3k, blast radius ~4k, tests ~8k, refactor 3–4 functions ~15k → **~30k tokens per module**" (`worker-3-memory.md:106`).
- **The 20–30 turn cliff.** "after about 20 to 30 turns of back-and-forth, the agent starts forgetting decisions made earlier in the conversation"; workaround consensus is smaller sessions, fresh-context subagent reviews, new sessions when context bleeds (`worker-3-memory.md:111-112`). Cursor-specific: start fresh with the docs folder rather than carrying the whole build history, "otherwise it'll just hallucinate more and more" (`worker-3-memory.md:113`). Quality degrades in the "100–200K token band" `~` (`worker-3-memory.md:114`).
- **Scoped conditional rules.** Stripe applies "almost all agent rules conditionally ... based on subdirectories" — "NO global unconditional rules"; Kulakov has "15–30 scoped `.cursor/rules`, nearly all `alwaysApply: false`" (`worker-3-memory.md:118-119`).
- **Hierarchical discovery and anchor comments.** Next.js says read all README.md files from repo root to the target directory before editing (`worker-3-memory.md:124`); `AIDEV-NOTE` / `AIDEV-TODO` / `AIDEV-QUESTION` are "grep-able inline memory — survives context resets because it lives in the code" (`worker-3-memory.md:129`).
- **Kousigan's precision principle.** "excess context confuses models and increases incorrect assumptions — precision matters more than volume." `مثبت` (`worker-3-memory.md:133`). "Nothing in the corpus endorses 'embed everything, retrieve by vector similarity.'" (`worker-3-memory.md:134`).
- **Compounding across phases.** Cherny's team trajectory is "mistakes → rules → fewer mistakes → rules shrink over time"; the file "gets SHORTER as the team gets better" (`worker-3-memory.md:144-145`). Helix: "Early checkpoints get more engineer attention because uncertainty is high… As approved code and feedback accumulate, later checkpoints can run with less oversight" (`worker-3-memory.md:149`). Marconi: "Wikis originally written for people are now being read by agents. The teams getting the most out of AI are the ones whose written context is clean, current, and findable." (`worker-3-memory.md:154`); Atlassian research: "4.9× more effective, 4.4× more productive" `~` (`worker-3-memory.md:155`). Git as substrate: "commit after every success, before every refactor — git is your undo button when Claude goes nuclear"; SYNTHESIS P8 says 14/19 workers (`worker-3-memory.md:159-161`).
- **Ten memory/context recommendations.** Two-tier files; outcome-written memory; three-criteria bar; traps not maps; declared budgets; fresh-context discipline; compounding ritual; claim-graph precision; cost-separated memory role; git as substrate (`worker-3-memory.md:185-194`).

### 3.3 Anti-patterns called out

- **One giant memory file.** "Never one giant file" (`worker-3-memory.md:185`).
- **Hoped memory.** Memory entries must originate "ONLY from gate failures, corrections, incidents" (`worker-3-memory.md:186`).
- **One-off rules.** "One-off observations never qualify" (`worker-3-memory.md:187`).
- **Maps that go stale.** "Never store what goes stale fast" (`worker-3-memory.md:188`).
- **Whole-codebase rehydration.** The 87K→9K pattern is explicitly against whole-codebase re-hydration (`worker-3-memory.md:101`).
- **Carrying the whole build history.** The Cursor-specific anti-pattern is carrying "the whole build history" and hallucinating more (`worker-3-memory.md:113`).
- **Vector-blur retrieval.** "Nothing in the corpus endorses 'embed everything, retrieve by vector similarity'" (`worker-3-memory.md:134`); the recommendation is "atomic addressed records + status fields over vector blur" (`worker-3-memory.md:192`).

### 3.4 Dispositions

The source states **no ADOPT/ADAPT/REJECT labels**. Its verdict-bearing text is: Instagram Post 1 — "**CONFIRMED in direction; product shape EMERGING.** Adopt the principle (dedicated memory write-path, cost-separated roles); track products." (`worker-3-memory.md:170`); Instagram Post 3 — "**CONFIRMED.** ... **Supports claim-graph-over-vector-blur.**" (`worker-3-memory.md:176`). Its ten recommendations are at `worker-3-memory.md:185-194`.

---

## 4. `worker-4-decomposition.md` — Phase and Task Decomposition (181 lines)

### 4.1 Thesis / angle

The angle is "How REAL elite developers break projects into phases/tasks for AI execution" (`worker-4-decomposition.md:3`). The source's through-line is that phase boundaries are mechanical and artifact-bearing, and "the phase boundary is the product" (`worker-4-decomposition.md:175`).

### 4.2 Strongest patterns as the source states them

- **Osmani's six-phase SDLC uses slash-command boundaries.** Each phase is a named slash command that loads its own skill set; "the next command cannot start until then" (`worker-4-decomposition.md:12`). `/spec` ends at a PRD covering "objectives, structure, style, testing, boundaries"; `/plan` ends at "small atomic tasks"; `/build` ends at per-task commit + TDD validation with a "**hard halt if any step encounters issues or risks**"; `/test` → `/review` → `/ship` are "non-skippable gates" (`worker-4-decomposition.md:13-16`). The boundary mechanism is the skill system itself: "only the phase's skill is loaded; you cannot be in two phases at once" (`worker-4-decomposition.md:17`).
- **Helix checkpoints are reviewable slices.** "A phase (checkpoint) boundary is defined by **reviewable scope**, not time" (`worker-4-decomposition.md:20`). Checkpoint 1 is a screen skeleton; checkpoint 2 is "one deliberately small section"; later checkpoints "grow only after early decisions pass review" (`worker-4-decomposition.md:21`). The quote: "'We'd rather give someone one decision they can make as opposed to ten pages they will skim'" (`worker-4-decomposition.md:22`). Each checkpoint must be "reviewed at a glance"; if not approvable in minutes, "it is too large — split it" (`worker-4-decomposition.md:23`). Phase ends at engineer approval then "commit per checkpoint" (`worker-4-decomposition.md:24`).
- **Kousigan's STOP is a phase boundary.** The protocol is `Understand → Investigate → Plan → Approve → Implement → Verify → Review diff → Done` with "an **explicit STOP** after Plan" (`worker-4-decomposition.md:27`). Investigate is read-only: "agent reads repo, stack, relevant files, existing patterns and constraints. **No code changes.**" (`worker-4-decomposition.md:28`). The Plan phase states the seven sections and "Then the agent **stops**" (`worker-4-decomposition.md:29`). Boundary mechanism: "the STOP is enforced by tool permissions, not prompt text"; "A 'STOP' sentence in a prompt is not a plan mode... If edits must not happen, use the tool's plan/read-only mode" (`worker-4-decomposition.md:30`). Ceremony scales with risk (`worker-4-decomposition.md:31`).
- **Stripe phases are code nodes in a DAG.** "Phases are **code nodes in a DAG**, not agent decisions" (`worker-4-decomposition.md:34`). Sequence: setup → context hydration → agent loop → local verify (lint <5s) → CI (≤2 rounds) → PR (`worker-4-decomposition.md:35`). CI boundary: "Hard rule: at most two rounds of CI... diminishing marginal returns for an LLM re-running a full CI loop" (`worker-4-decomposition.md:36`). Phase ends at a PR following Stripe's template (`worker-4-decomposition.md:37`).
- **Cherny uses plan mode as the boundary.** Sessions start in Plan mode; "He goes 'back and forth with Claude until I like its plan.'" (`worker-4-decomposition.md:40`). Boundary crossed when plan approved → auto-accept edits → 1-shot implementation; mechanism keeps "the expensive thinking out of the code-mutating loop" (`worker-4-decomposition.md:41-42`).
- **mfishbein's nine named stages.** Each stage is a "named slash command with a persona" (interviewer, planner, professor, presenter, CTO, night-shift, teacher, videographer, manual-writer) (`worker-4-decomposition.md:45`). Stage 3 `/factory-tests`: "Before any code is written, every task gets 'an exam'" — a temporal boundary (`worker-4-decomposition.md:46`). Stage 5 `/factory-handoff` packages "brief + plan + tests + safety rails + stop conditions into **one work order**" (`worker-4-decomposition.md:47`). Stage 6 `/loop`: "Agent picks one task, builds it, takes its exam, records what happened, iterates if needed, moves on" (`worker-4-decomposition.md:48`).
- **Debug loop restricts action space.** `Freeze → Reproduce → Explain (NO code changes) → Hypothesize → Smallest fix → Layered verify → Review → Document` (`worker-4-decomposition.md:52`). "Ask the agent to inspect the execution path **without modifying code**"; "Apply the smallest fix, files limited, unrelated refactoring forbidden" (`worker-4-decomposition.md:53-54`).
- **Adversarial pipeline separates roles.** `Spec → Coder → Cleaner → Hardener → QA` (`worker-4-decomposition.md:57`). Spec: "Do not implement anything; do not propose architecture"; Hardener: "Do not fix anything. Your only output is the list of gaps"; boundary principle: "Never let stages share the failure mode of the previous stage" (`worker-4-decomposition.md:58-60`).
- **Every phase produces a durable artifact.** The artifact table covers PRD, atomic task list, per-task commit + passing tests, Helix evidence bundle, Stripe branch + PR, Kousigan plan, mfishbein work order, demo video, owner's manual, 2–3x quality claim, `/reflect`, root-cause doc, end-to-end QA script (`worker-4-decomposition.md:66-80`). "Nothing that matters lives only in chat" (`worker-4-decomposition.md:82`).
- **Sequencing models.** Strict sequential is most common (`worker-4-decomposition.md:89-92`); Stripe uses DAG blueprints (`worker-4-decomposition.md:95`); Helix is ordered-but-growing (`worker-4-decomposition.md:98`); parallel fan-out is for independent tasks only (`worker-4-decomposition.md:101-103`). Dependencies come from information flow, artifact readiness, trust accumulation, and risk (`worker-4-decomposition.md:107-110`).
- **Transitions are gates.** Helix 4 gates, Stripe 2-layer verify, Kousigan checklist, Osmani halt-on-risk, Anthropic 3-round cap, mfishbein circuit breakers, execute25 `STATUS: NEEDS_ANSWERS` (`worker-4-decomposition.md:117-141`).
- **Done criteria are artifact + verification + next input.** The table gives per-workflow done states; the universal rule is "a phase is done when its **artifact exists AND its verification passes AND the next phase's input is ready**. No phase is 'done' on assertion alone" (`worker-4-decomposition.md:147-161`).
- **Six key findings.** (1) boundaries mechanical, not advisory; (2) "The plan artifact is the most standardized boundary" — 19/19 workers document it; (3) "Commit-per-unit is the dominant artifact rule"; (4) "Parallelism follows independence, not ambition"; (5) "Transitions are where quality lives"; (6) "The debug loop is a distinct phase shape" (`worker-4-decomposition.md:167-178`).

### 4.3 Anti-patterns called out

- **Advisory phase boundaries.** Prompt-only "STOP" is not a plan mode; transitions need tool-enforced gates (`worker-4-decomposition.md:167`).
- **Oversized checkpoints.** If it cannot be approved in minutes, "it is too large — split it" (`worker-4-decomposition.md:23`).
- **Parallelism without independence.** Parallel patterns restrict work to "**non-interfering** work units with per-worker artifact contracts" (`worker-4-decomposition.md:173`).
- **Assertion-only done.** "No phase is 'done' on assertion alone" (`worker-4-decomposition.md:161`).
- **Generic "fix it" prompts.** The debug loop "deserves its own workflow template, not a generic 'fix it' prompt" (`worker-4-decomposition.md:177`).

### 4.4 Dispositions

The source states **no ADOPT/ADAPT/REJECT labels**. Its disposition-bearing text is the six "KEY FINDINGS FOR ARSENAL v8.7" at `worker-4-decomposition.md:167-178`, summarized above. Do not attribute ADOPT/ADAPT/REJECT to this file.

---

## 5. `worker-5-human-gates.md` — Human-AI Decision Points & Release Discipline (actual 172 lines; declared 131)

**Count note.** The dispatch declared 131 lines, but the file is 172 lines; the +41 delta is recorded in `.opencode/audit/V87-INPUT-RECEIPT.md` §1 and §4. This digest uses the real 172-line content, including §5's citations index and §6's implications, both of which sit past line 131. No content is smoothed to the declared count.

### 5.1 Thesis / angle

The angle is "where REAL elite developers insert human judgment in the AI workflow, and how they handle releases" (`worker-5-human-gates.md:2`). The source's through-line is that human authority is concentrated at five gates, risk-tiered by blast radius, and that releases remain human-authorized.

### 5.2 Strongest patterns as the source states them

- **Gate A — plan/spec approval.** Helix approves the checkpoint sequence with the "one decision ... ten pages" quote; Kousigan's STOP is "structural, not optional"; Osmani has a "hard halt between plan and build"; Karpathy's "Think Before Coding" makes the human decide what is ambiguous; Anthropic's "explore → plan → code" reviews the plan before code (`worker-5-human-gates.md:10-15`).
- **Gate B — checkpoint/diff review.** Helix Gate 4: "The engineer looks at code + running app and decides"; feedback goes to fixes and memory (`worker-5-human-gates.md:18`). Stripe and Shopify both have "human review mandatory on every PR"; Linear has "human approval on every merge"; Atlassian interviews repeat "*it's my name on it*" `مثبت` and "let me decide what to do about it" (`worker-5-human-gates.md:19-22`).
- **Gate C — merge/release sign-off.** GitHub Secret Protection sends agent PRs "through the *same* pipeline as human code: automated testing, human review, deployment by engineers" (`worker-5-human-gates.md:25`). Karpathy: "never merge code I don't understand"; "watch them like a hawk"; Okeke: "triage is where you stay in charge"; Anthropic reserves humans for "taste, direction, scope" (`worker-5-human-gates.md:26-28`). "**No credible internal source describes unsupervised merge.**" (`worker-5-human-gates.md:29`).
- **Gate D — scope/direction decisions.** Atlassian's trust sequence is "Reactive assistant ... Proactive observer ... Autonomous coordinator ... Trust will be earned in that order" (`worker-5-human-gates.md:32`). Stack Overflow 2025: "76% of developers don't plan to use AI for deployment and monitoring; 69% don't plan to use it for project planning" `~` (`worker-5-human-gates.md:32`). Alex never lets AI architect; Kousigan: "AI can propose the implementation. You still own the decision."; Ali: "the engineer must still own the outcome" (`worker-5-human-gates.md:33-35`).
- **Gate E — destructive/irreversible actions.** The invariant is "irreversible actions gated, reversible territory free" (`worker-5-human-gates.md:39`). Confirmation gates on destructive ops are "mechanical, not prompts" (`worker-5-human-gates.md:40`). The Jer Crane incident: summarized safety rules "no longer mechanically bound the agent's next action" → Cursor + Claude deleted PocketOS's production Railway volume in 9 seconds (`worker-5-human-gates.md:41`).
- **Risk tiers.** The canonical ladder is low-risk "auto-approved after automated checks pass. No human in the loop"; standard "1 human reviewer"; high-risk "(billing, CI, security, release, installers): **2 humans required**" (`worker-5-human-gates.md:48-50`). Anthropic's Quick/Standard/Deep maps to blast radius; CODEOWNERS + branch protection force review on auth, billing, CI, release, installers; approvals are dismissed on new commits (`worker-5-human-gates.md:53-55`). Linear: low-risk no human once checks pass; high-risk "**two humans**" (`worker-5-human-gates.md:58`). OpenAI: risk-sorted reviewers + SRE escorts (`worker-5-human-gates.md:61`).
- **The unanimous invariant.** "**A bot's approval never replaces a required human's on high-risk paths.**" `مثبت` (`worker-5-human-gates.md:67`).
- **Risk-determining factors.** Blast radius, reversibility, novelty, proximity to money/trust, and author trust history: "Trusted authors get lighter paths; start strict, loosen with evidence" (`worker-5-human-gates.md:70-74`).
- **Release discipline is human.** "**Always a human.** No workflow in the corpus describes AI-triggered production release without human sign-off" (`worker-5-human-gates.md:81`). Helix commits per checkpoint and humans raise PRs (`worker-5-human-gates.md:82`). Shopify: "pair with an AI agent, but your name is on the PR"; comprehension bar "does not move" even at 90–95% LLM-generated code `~` (`worker-5-human-gates.md:83`).
- **The darkship pattern.** Ship "dark" so results are observed in production "WITHOUT writing validity inferences to the database"; the config change to exit darkship is human-operated; this is "a production-observation stage between merge and full activation" (`worker-5-human-gates.md:85-88`).
- **What gates and blocks a release.** Helix's 4 gates in order, "a failed gate cannot be overridden" (`worker-5-human-gates.md:91-95`); Stripe local lint <5s → CI max 2 rounds (`worker-5-human-gates.md:96`); Anthropic six automated layers, humans only for high-risk tiers (`worker-5-human-gates.md:97`). Blocks: any failed gate, human rejection, missing evidence; Helix commits carry "archived UI reviews, passing tests, reviewer verdicts" — "the evidence bundle IS the shippable unit" (`worker-5-human-gates.md:100-102`).
- **Autonomy inside gates, never past them.** "The autonomy that exists ... is autonomy *inside* fixed gates, never past the final human"; "the gates don't become more lax when nobody is watching" (`worker-5-human-gates.md:105-106`).
- **Six escalation triggers.** E1 genuine product/requirement ambiguity (`STATUS: NEEDS_ANSWERS`, `ask_human`); E2 loop non-convergence (2 CI rounds, 3+ review rounds, "what remains unverified?", circuit breakers); E3 unsafe assumption ("stop, that assumption is unsafe — that is the workflow"); E4 destructive/irreversible action ("Delete it with ceremony — list it, review it, THEN delete"); E5 judgment-heavy steps never delegated; E6 context degradation (60% rule, phase-boundary resets) (`worker-5-human-gates.md:112-137`).
- **Six v8.7 implications.** Five human gates minimum; risk tiers map to Arsenal; darkship as release doctrine; escalation as designed behavior; circuit breakers are gates; the evidence bundle ships (`worker-5-human-gates.md:167-172`).

### 5.3 Anti-patterns called out

- **Unsupervised merge.** "No credible internal source describes unsupervised merge" (`worker-5-human-gates.md:29`).
- **Prompt-carried destructive safety.** Summarized rules failed in the 9-second deletion; confirmation gates must be mechanical (`worker-5-human-gates.md:41`).
- **Bot approval substituting for a human on high-risk paths.** The unanimous invariant is the inverse (`worker-5-human-gates.md:67`).
- **Delegating ambiguity.** `STATUS: NEEDS_ANSWERS` is the correct output rather than inventing requirements (`worker-5-human-gates.md:113`); "Urgent & Ambiguous → Agentic Coding is useless" (`worker-5-human-gates.md:115`).
- **Context degradation.** The 60% rule and phase-boundary resets exist to prevent it (`worker-5-human-gates.md:136-137`).
- **Releasing without evidence.** The evidence bundle is the shippable unit; missing evidence blocks (`worker-5-human-gates.md:102`).

### 5.4 Dispositions

The source states **no ADOPT/ADAPT/REJECT labels**. Its disposition-bearing text is the six "v8.7 IMPLICATIONS" at `worker-5-human-gates.md:167-172`, summarized above. Do not attribute ADOPT/ADAPT/REJECT to this file.

---

## 6. `SYNTHESIS-v8.7.md` — Real Programmer Workflows with AI (420 lines)

### 6.1 Thesis / angle

The synthesis covers "~130 distinct real workflows/findings across 19 worker reports + Instagram v8.7 context" (`SYNTHESIS-v8.7.md:5`). Its honesty note: "This synthesis rests on practitioner self-reports (only worker-18's academic wing is controlled measurement). Percentages and time claims are order-of-magnitude. Pattern strength is ranked by *independent corroboration count* across workers/domains, not by any single dramatic claim" (`SYNTHESIS-v8.7.md:8`). Its thesis is the canonical spine: `TRIGGER → PLAN-ARTIFACT (human-reviewed) → IMPLEMENT → VERIFY → REVIEW → HUMAN SIGN-OFF → COMMIT` (`SYNTHESIS-v8.7.md:250-254`).

### 6.2 The 12 strongest patterns (source counts and strength labels)

| ID | Source count / strength | Pattern as the source states it | Citation |
|---|---|---|---|
| P1 | 19/19 workers, ~75/130 workflows — **LAW** | "Plan/spec artifact gates implementation" | `SYNTHESIS-v8.7.md:16` |
| P2 | 19/19, ~80/130 — **LAW** | "Verification is an external mechanical loop, not prompt advice" | `SYNTHESIS-v8.7.md:39` |
| P3 | 17/19, ~55/130 — **LAW** | "Human stays the accountable decider" | `SYNTHESIS-v8.7.md:61` |
| P4 | 18/19, ~65/130 — **LAW (with measured caveat)** | "Author ≠ judge: fresh context / different agent / different model reviews" | `SYNTHESIS-v8.7.md:77` |
| P5 | 17/19, ~60/130 — **LAW** | "Behavioral rules checked into the repo as durable memory" | `SYNTHESIS-v8.7.md:93` |
| P6 | 17/19, ~55/130 — **LAW** | "Context is a budget: small, scoped, declared, fresh" | `SYNTHESIS-v8.7.md:109` |
| P7 | 13/19, ~40/130 — **STRONG** | "Circuit breakers on every loop" | `SYNTHESIS-v8.7.md:126` |
| P8 | 14/19, ~45/130 — **STRONG** | "Git as the safety net: obsessive commits, branches, reset-on-dud" | `SYNTHESIS-v8.7.md:139` |
| P9 | 10/19, ~35/130 — **STRONG** | "Risk-tiered review: human attention follows blast radius" | `SYNTHESIS-v8.7.md:150` |
| P10 | 8/19, ~25/130 — **SOLID** | "'Reference is the spec': point at running code, don't describe" | `SYNTHESIS-v8.7.md:161` |
| P11 | 11/19, ~40/130 — **STRONG** | "Role-based routing: separate planner / executor / reviewer roles" | `SYNTHESIS-v8.7.md:171` |
| P12 | 7/19 workers, anchored by empirical wing — **STRONG** | "Measure outcomes honestly; self-report is broken" | `SYNTHESIS-v8.7.md:183` |

**P4's measured caveat (must travel with P4).** Reviewer agents alone scored 68% — "**worse than no gate** — and added nothing over tests alone (84%), at higher cost. Reviewers waved through documented-but-wrong code." Resolution: "reviewers work as *gates* only against an enforceable *written* standard ... Default: reviewers as *advice*; promote to *gate* only then" (`SYNTHESIS-v8.7.md:89`). This caveat is why P4 is "LAW (with measured caveat)" and why ADAPT-1 exists.

**P5's sub-pattern.** "memory written by OUTCOMES (10/19)" — Helix records gate failures, REVIEW.md accumulates feedback, Anthropic converts incidents into eval sets, session-close AGENTS.md updates; "The durable memory layer is fed by *what happened*, not by what someone hoped" (`SYNTHESIS-v8.7.md:105`).

**P12's empirical anchors.** METR RCT: experienced devs "19% slower" with AI yet believed they were "20% faster" (~40-point miscalibration); CUPS: "an accepted suggestion is often an unreviewed suggestion"; Peng et al.: "+55.8% on greenfield (lab) vs METR −19% on mature codebases"; Chen et al.: "agents +35% correctness, user effort halved — but participants still *preferred* Copilot" (`SYNTHESIS-v8.7.md:185-188`). These are source-stated `~`.

### 6.3 The 7 anti-patterns (source counts and wording)

| ID | Source count | Anti-pattern as the source states it | Citation |
|---|---|---|---|
| A1 | 14/19 — **#1 ANTI-PATTERN FAMILY** | "Confident wrongness: silent assumptions, scope creep, over-engineering" | `SYNTHESIS-v8.7.md:198` |
| A2 | 12/19 | "Test-gaming: weakening tests instead of code; self-grading" | `SYNTHESIS-v8.7.md:210` |
| A3 | 12/19 | "Unbounded loops, no circuit breaker" | `SYNTHESIS-v8.7.md:221` |
| A4 | 10/19 | "Giant unreviewable diffs / one-shot blobs" | `SYNTHESIS-v8.7.md:225` |
| A5 | 9/19 | "Prompt-carried safety rules instead of mechanical enforcement" | `SYNTHESIS-v8.7.md:229` |
| A6 | 7/19 | "Sycophancy: flattery-as-agreement" | `SYNTHESIS-v8.7.md:234` |
| A7 | 7/19 | "Vanity metrics: green checkmarks as quality evidence" | `SYNTHESIS-v8.7.md:240` |

Key source details: A1 includes Karpathy's "models make wrong assumptions on your behalf and just run along with them" `مثبت` (`SYNTHESIS-v8.7.md:200`), the 1000-vs-100-lines overcomplication, `.skip`/deleted tests/removed linter, the 4%-transaction dedup filter, "Clean, well-structured, and completely wrong", and claimed-but-unbuilt work (`SYNTHESIS-v8.7.md:200-206`). A2 includes the self-grading and hidden-test-hunting lines, "LLM never touches tests", and "Never let an agent self-grade" (`SYNTHESIS-v8.7.md:212-217`). A5 is the Jer Crane incident: summarized rules "no longer mechanically bound the agent's next action" → production Railway volume deleted in "**9 seconds**" (`SYNTHESIS-v8.7.md:231`). A7 says "Optimize surviving assertions, not acceptance" (`SYNTHESIS-v8.7.md:242`).

### 6.4 Dispositions — 12 ADOPT, 6 ADAPT, 7 REJECT (verbatim-faithful)

**ADOPT (12).**

1. "**Written plan/spec artifact with success criteria + verification plan, reviewed before implementation.** 19/19." (`SYNTHESIS-v8.7.md:316`)
2. "**Verification as mechanical gate, not prompt advice.** 19/19." (`SYNTHESIS-v8.7.md:317`)
3. "**Independent test oracle.** 12/19 + measured 70%→84%." (`SYNTHESIS-v8.7.md:318`)
4. "**Circuit breakers on every loop.** 13/19." (`SYNTHESIS-v8.7.md:319`)
5. "**Author ≠ judge separation.** 18/19." (`SYNTHESIS-v8.7.md:320`)
6. "**Context budget discipline.** 17/19." (`SYNTHESIS-v8.7.md:321`)
7. "**Compounding memory.** 17/19." (`SYNTHESIS-v8.7.md:322`)
8. "**Root-cause-before-fix; never 'fix the tests.'** 12/19." (`SYNTHESIS-v8.7.md:323`)
9. "**Memory as its own layer, cost-separated.** Instagram P1 directional." (`SYNTHESIS-v8.7.md:324`)
10. "**Adversarial testing over green checkmarks.** Instagram P2 law-grade." (`SYNTHESIS-v8.7.md:325`)
11. "**Risk-tiered review.** 10/19." (`SYNTHESIS-v8.7.md:326`)
12. "**Measured outcomes, labeled honestly.** تقديري/مثبت on every claim; never self-report. (P12)" (`SYNTHESIS-v8.7.md:327`)

**ADAPT (6).**

1. "**Reviewer-gates → advice by default.**" Promote to gate only where a written enforceable standard exists (lock schema, registry, architecture doc) (`SYNTHESIS-v8.7.md:331`).
2. "**Multi-model role routing → role separation within Spark-only.**" Planner / executor / reviewer subagents with distinct prompts and context budgets; maps to triumvirate + reviewer (`SYNTHESIS-v8.7.md:332`).
3. "**Agent-written tests → allowed only with independent oracle + mutation/strength checks.**" Human owns test semantics on critical paths (`SYNTHESIS-v8.7.md:333`).
4. "**Parallel fleets → independent tasks only.**" Per-worker artifact contracts; no collaborative swarms; "This 20-worker research is the proof" (`SYNTHESIS-v8.7.md:334`).
5. "**Slot-machine restart → for well-specified tasks after bounded retries.**" Keep structured feedback when the plan is sound (`SYNTHESIS-v8.7.md:335`).
6. "**'Reference is the spec' → work orders point at locks/registries/code**, not re-descriptions." (`SYNTHESIS-v8.7.md:336`)

**REJECT (7).**

1. "**Agent self-grading / implementer-authored acceptance tests.** Measured vacuous. The corpus's most expensive lesson." (`SYNTHESIS-v8.7.md:340`)
2. "**Prompt-carried safety rules.** Must be mechanical (hooks, permissions, isolation). The 9-second production deletion is the cautionary tale." (`SYNTHESIS-v8.7.md:341`)
3. "**Unbounded retry/CI loops.** Cap + reconsider, always." (`SYNTHESIS-v8.7.md:342`)
4. "**Acceptance-rate / green-test vanity metrics.** Optimize surviving assertions." (`SYNTHESIS-v8.7.md:343`)
5. "**Vibe-coded production / standard-less swarms.** Rejected by Karpathy, Builder.io, and reviewer-gate evidence." (`SYNTHESIS-v8.7.md:344`)
6. "**Role-separation violations.** vanbu never builds; builders never verify own work; Omar alone releases." (`SYNTHESIS-v8.7.md:345`)
7. "**Wrestling bad runs past retry budget.** Restart or escalate; never 10 follow-ups." (`SYNTHESIS-v8.7.md:346`)

### 6.5 The 3 pillars

1. **Pillar 1: Memory Layer Design** — dedicated memory write-path fed by outcomes, not hopes; cost-separated cheap roles; claim-graph precision over vector blur; session-close ritual; git as durable substrate (`SYNTHESIS-v8.7.md:354-359`).
2. **Pillar 2: Adversarial Testing Doctrine** — "Green ≠ correct — **law-grade**"; independent test oracle (test author gets spec, never implementation); mutation/assertion-strength checks; "LLM never touches tests" enforced mechanically on critical paths; "Prove the oracle: break code on purpose, confirm tests fail" (`SYNTHESIS-v8.7.md:361-366`).
3. **Pillar 3: Context-Engineering Precision** — context as budget, small/scoped/declared/fresh; "3 most relevant books" not everything; scoped conditional rules, no global unconditional rules; declared per-task context with measured 9× reduction; reference-is-the-spec (`SYNTHESIS-v8.7.md:368-373`).

**The evidence-derived workflow shape.** `TRIGGER → PLAN-ARTIFACT (success criteria + verification plan, human-reviewed) → IMPLEMENT (small scoped chunks, git worktree isolated) → VERIFY (independent mechanical loop) → REVIEW (fresh-context/different-role; advice by default, gate only vs written standard) → HUMAN SIGN-OFF (risk-tiered) → COMMIT (obsessive; memory updated from outcomes)` (`SYNTHESIS-v8.7.md:377-384`). "Every loop carries a circuit breaker. Every claim carries تقديري/مثبت. Nothing ships on a green checkmark alone." (`SYNTHESIS-v8.7.md:386`).

---

## 7. `instagram-v8.7-context.md` — Instagram Posts (24 lines)

### 7.1 Post 1 — @josephbchandler, "Unified AI Agent Memory"

- **Concept:** "Hindsight Memlake on Mac Mini — shared memory across Claude, Hermes, ChatGPT" (`instagram-v8.7-context.md:5`).
- **Key insight:** "Memory has its OWN AI organizing/reflecting on all chats; working agents offload memory management to a CHEAPER model rather than spending their own tokens" (`instagram-v8.7-context.md:6`).
- **Stated relevance to v8.7:** "Memory architecture — dedicated memory-intelligence layer, cost-separated from working agents" (`instagram-v8.7-context.md:7`).

### 7.2 Post 2 — @bashmohandesmazen, "450 Tests Passing, System Still Fails" (Arabic)

- **Concept:** "Green checkmarks from AI-generated tests ≠ working code; happy-path-only tests create false confidence" (`instagram-v8.7-context.md:11`).
- **Key insight:** "Unit vs integration distinction; AI generates tests that pass but don't validate real behavior" (`instagram-v8.7-context.md:12`).
- **Stated relevance to v8.7:** "DIRECTLY supports Omar's 'real not formalities' — eval/testing must be adversarial, not checkbox" (`instagram-v8.7-context.md:13`).

### 7.3 Post 3 — @moatassem.ai, "Garry Tan's Context Engineering + GBrain" (Arabic)

- **Concept:** "Don't give all info (generic) or too much (overwhelm) — provide the 3 most relevant 'books'" (`instagram-v8.7-context.md:17`).
- **Key insight:** "GBrain = librarian searching files by keyword + vector; 155k pages indexed; free open-source (garrytan/gbrain)" (`instagram-v8.7-context.md:18`).
- **Stated relevance to v8.7:** "Context engineering as core discipline — precision retrieval, not dump; maps to vanbu's RAG decision (claim graph > vector blur)" (`instagram-v8.7-context.md:19`).

### 7.4 The three planning threads

1. "**Memory:** dedicated layer with own intelligence (Hindsight) + precise retrieval (GBrain/context engineering)" (`instagram-v8.7-context.md:22`).
2. "**Testing:** adversarial/real, not green-checkmark formalities" (`instagram-v8.7-context.md:23`).
3. "**Workflow:** best programmers' loops — the 100-workflow research will ground this" (`instagram-v8.7-context.md:24`).

---

## 8. PLAN-INCORPORATION LEDGER — what the plan author must incorporate

One line per item; each line carries its source citation. This section is the handoff list, not a new set of claims.

### 8.1 Plan artifact, phase boundaries, and human authority

- **L1** Make the plan artifact carry restated understanding, real files, existing patterns, constraints, risks, proposed change, verification method, and an explicit stop. — `worker-1-plan-handoff.md:12`
- **L2** Add the per-task "exam" (success criteria + how the builder proves success) and an explicit assumption/risk ledger to work orders. — `worker-1-plan-handoff.md:22`, `worker-1-plan-handoff.md:100`
- **L3** Use three approval granularities — plan, sequence, or criteria — and never per-line diff approval. — `worker-1-plan-handoff.md:40`
- **L4** Keep the verification plan and stop conditions with the build instructions; a plan without its exam is an incomplete handoff. — `worker-1-plan-handoff.md:52`
- **L5** Codify the deviation ladder: bounded retry against the same oracle → escalate with evidence → Omar revises or restarts → lesson into memory; never silent re-planning. — `worker-1-plan-handoff.md:67`, `worker-1-plan-handoff.md:102`
- **L6** Make STOPs mechanical (separate session, permission boundary, or Omar-mediated checkpoint), not prompt sentences. — `worker-1-plan-handoff.md:103`, `worker-4-decomposition.md:167`
- **L7** Define phase boundaries by reviewable scope, not time; split any checkpoint that cannot be approved in minutes; commit per checkpoint. — `worker-4-decomposition.md:20-24`
- **L8** Require every phase to produce a durable artifact outside the session; done = artifact exists + verification passes + next input ready. — `worker-4-decomposition.md:82`, `worker-4-decomposition.md:161`
- **L9** Use strict sequential order for dependent phases; allow DAG/parallel work only for independent tasks with per-worker artifact contracts. — `worker-4-decomposition.md:89-103`, `worker-4-decomposition.md:173`
- **L10** Give the debug loop its own template: Freeze → Reproduce → Explain (read-only) → Hypothesize → Smallest fix → Layered verify → Review → Document. — `worker-4-decomposition.md:177`
- **L11** Encode the §1 Gate A–E set: plan/spec approval, checkpoint/diff review, merge/release sign-off, scope/direction, destructive/irreversible. — `worker-5-human-gates.md:10-41`
- **L11a** Carry the §6 five-gate minimum as the plan's gate sequence: plan approval → checkpoint review → merge sign-off → release authorization → destructive-action confirmation. — `worker-5-human-gates.md:167`
- **L12** Map Arsenal risk tiers: low-risk auto after verifiers; standard = vanbu verify + Omar sign-off; high-risk (lock schema, registry, release) = Omar + evidence bundle. — `worker-5-human-gates.md:168`
- **L13** Keep bot approval from substituting for a required human on high-risk paths. — `worker-5-human-gates.md:67`
- **L14** Add a darkship-style production-observation stage before full activation of kit/registry changes. — `worker-5-human-gates.md:85-88`, `worker-5-human-gates.md:169`
- **L15** Treat `NEEDS_ANSWERS` / `needs_user_action` as the correct output for ambiguity, never a failure to optimize away. — `worker-5-human-gates.md:113`, `worker-5-human-gates.md:170`
- **L16** Ship the evidence bundle with the commit/release, not the code alone. — `worker-5-human-gates.md:102`, `worker-5-human-gates.md:172`

### 8.2 Verification, testing, and anti-gaming

- **L17** Make verification a mechanical gate: hooks/deterministic checks interleaved in every loop, not prompt advice. — `worker-2-verification.md:42-46`, `SYNTHESIS-v8.7.md:317`
- **L18** Separate test author from implementer: the test author gets the spec, never the implementation; tests live outside the repo tree and reads are denied. — `worker-2-verification.md:63-69`, `worker-2-verification.md:102`
- **L19** Never let an agent self-grade or author its own acceptance tests. — `worker-2-verification.md:69-71`, `SYNTHESIS-v8.7.md:340`
- **L20** Prove the oracle: break code on purpose, confirm a test fails; use mutation testing on critical paths. — `worker-2-verification.md:75-77`, `SYNTHESIS-v8.7.md:293`
- **L21** Use the measured hierarchy: independent acceptance tests 70%→84%; reviewer agents alone 68% (worse than nothing); reviewers stay advisory unless gated against a written enforceable standard. — `worker-2-verification.md:23-28`, `worker-2-verification.md:107`, `SYNTHESIS-v8.7.md:89`
- **L22** Keep destructive actions outside agent control: least-privilege tokens, human confirmation gates, backups outside blast radius. — `worker-2-verification.md:53-56`, `worker-5-human-gates.md:38-41`
- **L23** Keep deterministic steps deterministic (git ops, linters, tests) so the agent cannot skip them. — `worker-2-verification.md:49-50`
- **L24** Use fresh-context or different-model-family reviewers; author ≠ judge. — `worker-2-verification.md:79-81`, `SYNTHESIS-v8.7.md:320`
- **L25** Cap every loop: 2 CI/fix rounds per node, 3 review rounds then reconsider, N-block counter then escalate. — `worker-2-verification.md:87-94`, `worker-5-human-gates.md:118-121`
- **L26** Run root-cause-before-fix and never "fix the tests." — `SYNTHESIS-v8.7.md:323`

### 8.3 Memory, context, and compounding

- **L27** Use two-tier memory: a short baseline behavioral file (<200 lines, shrinking) + deep skills loaded on demand; never one giant file. — `worker-3-memory.md:185`
- **L28** Feed memory only from gate failures, corrections, and incidents; every entry carries its why. — `worker-3-memory.md:186`, `SYNTHESIS-v8.7.md:279`
- **L29** Apply the three-criteria bar for new rules: non-obvious, repeatedly encountered, specific enough to act on. — `worker-3-memory.md:187`
- **L30** Store traps, not maps; architecture is discoverable by reading code. — `worker-3-memory.md:188`
- **L31** Declare context budgets: per-task file lists and per-module ~30k tokens; the measured reduction is 87K→9K (~9×). — `worker-3-memory.md:189`
- **L32** Respect the 20–30 turn cliff: phase boundaries become session boundaries; use `AIDEV-*` anchors. — `worker-3-memory.md:190`
- **L33** Install the compounding ritual: session-close memory update and PR-description rule proposals. — `worker-3-memory.md:191`
- **L34** Prefer claim-graph precision (atomic addressed records + status fields) over vector blur. — `worker-3-memory.md:192`, `instagram-v8.7-context.md:19`
- **L35** Cost-separate the memory role; working agents do not spend their own budget on memory management. — `worker-3-memory.md:193`, `instagram-v8.7-context.md:7`
- **L36** Treat git as durable memory: commit decisions, specs, and triage logs. — `worker-3-memory.md:194`

### 8.4 SYNTHESIS dispositions to carry

- **ADOPT-1** Written plan/spec artifact with success criteria + verification plan, reviewed before implementation (19/19). — `SYNTHESIS-v8.7.md:316`
- **ADOPT-2** Verification as mechanical gate, not prompt advice (19/19). — `SYNTHESIS-v8.7.md:317`
- **ADOPT-3** Independent test oracle (12/19 + measured 70%→84%). — `SYNTHESIS-v8.7.md:318`
- **ADOPT-4** Circuit breakers on every loop (13/19). — `SYNTHESIS-v8.7.md:319`
- **ADOPT-5** Author ≠ judge separation (18/19). — `SYNTHESIS-v8.7.md:320`
- **ADOPT-6** Context budget discipline (17/19). — `SYNTHESIS-v8.7.md:321`
- **ADOPT-7** Compounding memory (17/19). — `SYNTHESIS-v8.7.md:322`
- **ADOPT-8** Root-cause-before-fix; never "fix the tests" (12/19). — `SYNTHESIS-v8.7.md:323`
- **ADOPT-9** Memory as its own layer, cost-separated (Instagram P1 directional). — `SYNTHESIS-v8.7.md:324`
- **ADOPT-10** Adversarial testing over green checkmarks (Instagram P2 law-grade). — `SYNTHESIS-v8.7.md:325`
- **ADOPT-11** Risk-tiered review (10/19). — `SYNTHESIS-v8.7.md:326`
- **ADOPT-12** Measured outcomes, labeled honestly (تقديري/مثبت; never self-report). — `SYNTHESIS-v8.7.md:327`
- **ADAPT-1** Reviewer-gates → advice by default; promote to gate only against a written enforceable standard. — `SYNTHESIS-v8.7.md:331`
- **ADAPT-2** Multi-model role routing → role separation within the Spark-only constraint. — `SYNTHESIS-v8.7.md:332`
- **ADAPT-3** Agent-written tests → allowed only with independent oracle + mutation/strength checks. — `SYNTHESIS-v8.7.md:333`
- **ADAPT-4** Parallel fleets → independent tasks only, with per-worker contracts. — `SYNTHESIS-v8.7.md:334`
- **ADAPT-5** Slot-machine restart → for well-specified tasks after bounded retries. — `SYNTHESIS-v8.7.md:335`
- **ADAPT-6** "Reference is the spec" → work orders point at locks/registries/code, not re-descriptions. — `SYNTHESIS-v8.7.md:336`
- **REJECT-1** Agent self-grading / implementer-authored acceptance tests. — `SYNTHESIS-v8.7.md:340`
- **REJECT-2** Prompt-carried safety rules. — `SYNTHESIS-v8.7.md:341`
- **REJECT-3** Unbounded retry/CI loops. — `SYNTHESIS-v8.7.md:342`
- **REJECT-4** Acceptance-rate / green-test vanity metrics. — `SYNTHESIS-v8.7.md:343`
- **REJECT-5** Vibe-coded production / standard-less swarms. — `SYNTHESIS-v8.7.md:344`
- **REJECT-6** Role-separation violations (vanbu never builds; builders never verify own work; Omar alone releases). — `SYNTHESIS-v8.7.md:345`
- **REJECT-7** Wrestling bad runs past the retry budget. — `SYNTHESIS-v8.7.md:346`

### 8.5 Pillars and workflow shape

- **L37** Build Pillar 1 — Memory Layer Design: outcome-fed, cost-separated, claim-graph precise, session-close ritual, git substrate. — `SYNTHESIS-v8.7.md:354-359`
- **L38** Build Pillar 2 — Adversarial Testing Doctrine: green ≠ correct, independent oracle, mutation/strength checks, "LLM never touches tests," prove the oracle. — `SYNTHESIS-v8.7.md:361-366`
- **L39** Build Pillar 3 — Context-Engineering Precision: budget, scoped/declared/fresh context, 3-most-relevant-books, reference-is-the-spec. — `SYNTHESIS-v8.7.md:368-373`
- **L40** Adopt the evidence-derived workflow shape: trigger → plan artifact → implement → verify → review → human sign-off → commit, with a circuit breaker in every loop. — `SYNTHESIS-v8.7.md:377-386`

### 8.6 Instagram threads

- **L41** Keep the memory thread: dedicated layer with its own intelligence + precise retrieval. — `instagram-v8.7-context.md:22`
- **L42** Keep the testing thread: adversarial/real, not green-checkmark formalities. — `instagram-v8.7-context.md:23`
- **L43** Keep the workflow thread: ground the plan in the best programmers' loops and the 100-workflow research. — `instagram-v8.7-context.md:24`

---

## 9. Verification evidence

### 9.1 Spot-check of quoted phrases against the sources

**Run 1 (recorded failure, then corrected).** The first literal check passed 11/12 and exited 1. The single failure was a console-encoding transliteration of U+2014 to `?` in the PowerShell-to-Node pipe, not a source mismatch:

```text
FAIL  worker-3-memory.md  "excess context confuses models and increases incorrect assumptions ? precision matters more than volume."
SUMMARY 11/12 passed; failures=1
exit=1
```

**Run 2 (U+2014 escaped as `\u2014`).** 12/12 passed, exit 0:

```text
PASS  worker-1-plan-handoff.md  "We'd rather give someone one decision they can make as opposed to ten pages they will skim."
PASS  worker-1-plan-handoff.md  "the reference *is* the spec."
PASS  worker-1-plan-handoff.md  "An attempt is allowed to be wrong. It is not allowed to ship until it isn't."
PASS  worker-2-verification.md  "A rule in the prompt is advice. A hook is not."
PASS  worker-2-verification.md  "An agent's own tests test what it built"
PASS  worker-3-memory.md  "memory is the product of gate outcomes, not prompt engineering."
PASS  worker-3-memory.md  "excess context confuses models and increases incorrect assumptions — precision matters more than volume."
PASS  worker-4-decomposition.md  "a STOP sentence in a prompt is not a plan mode"
PASS  worker-5-human-gates.md  "A bot's approval never replaces a required human's on high-risk paths."
PASS  SYNTHESIS-v8.7.md  "models make wrong assumptions on your behalf and just run along with them."
PASS  SYNTHESIS-v8.7.md  "Your name is on the PR."
PASS  SYNTHESIS-v8.7.md  "starting over often has a higher success rate than trying to fix Claude's mistakes"
SUMMARY 12/12 passed; failures=0
exit=0
```

The check command was:

```powershell
@'
import fs from "node:fs";
const checks = [
  ["worker-1-plan-handoff.md", "We'd rather give someone one decision they can make as opposed to ten pages they will skim."],
  ["worker-1-plan-handoff.md", "the reference *is* the spec."],
  ["worker-1-plan-handoff.md", "An attempt is allowed to be wrong. It is not allowed to ship until it isn't."],
  ["worker-2-verification.md", "A rule in the prompt is advice. A hook is not."],
  ["worker-2-verification.md", "An agent's own tests test what it built"],
  ["worker-3-memory.md", "memory is the product of gate outcomes, not prompt engineering."],
  ["worker-3-memory.md", "excess context confuses models and increases incorrect assumptions \u2014 precision matters more than volume."],
  ["worker-4-decomposition.md", "a STOP sentence in a prompt is not a plan mode"],
  ["worker-5-human-gates.md", "A bot's approval never replaces a required human's on high-risk paths."],
  ["SYNTHESIS-v8.7.md", "models make wrong assumptions on your behalf and just run along with them."],
  ["SYNTHESIS-v8.7.md", "Your name is on the PR."],
  ["SYNTHESIS-v8.7.md", "starting over often has a higher success rate than trying to fix Claude's mistakes"]
];
let fail = 0;
for (const [file, phrase] of checks) {
  const text = fs.readFileSync(`docs/spec/v87/${file}`, "utf8");
  const ok = text.includes(phrase);
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${file}  ${JSON.stringify(phrase)}`);
}
console.log(`SUMMARY ${checks.length - fail}/${checks.length} passed; failures=${fail}`);
process.exit(fail === 0 ? 0 : 1);
'@ | node --input-type=module
```

### 9.2 Line counts of this digest

```text
.opencode/audit/V87-INPUT-DIGESTS.md | bytes=70720 | newlines=531 | unterminated_last_line=no | actual_lines=531
exit=0
```

### 9.3 Digest line-count command

```powershell
@'
import fs from "node:fs";
const p = ".opencode/audit/V87-INPUT-DIGESTS.md";
const b = fs.readFileSync(p);
let nl = 0;
for (const x of b) if (x === 10) nl++;
const un = b.length > 0 && b[b.length - 1] !== 10;
console.log(`${p} | bytes=${b.length} | newlines=${nl} | unterminated_last_line=${un ? "yes" : "no"} | actual_lines=${nl + (un ? 1 : 0)}`);
'@ | node --input-type=module
```

### 9.4 Tool availability

`markdownlint-cli`, `markdownlint-cli2`, and `remark` are not installed on this seat (`Get-Command` exited 1 for each). No lint claim is made for this digest; the missing tool is recorded rather than substituted.

---

## 10. Uncertainties and boundaries

- **Source-count caveat.** All corroboration ratios (19/19, 17/19, ~75/130, etc.) are the synthesis author's counts, not re-derived by this digest. They are quoted as source-stated `~` evidence.
- **Worker-5 mismatch.** The declared 131 lines versus the actual 172 lines is unresolved in the input set; this digest reports both and uses 172. No cause is asserted.
- **Worker-1 71% and Anthropic plan-mode claims.** The 71% figure comes through a search result the source cites, not from a primary experiment reproduced here; it is marked `~`.
- **Worker-2 aidiveyt numbers.** The 50-run percentages and costs are source-stated measurements; this digest did not rerun the experiment.
- **Worker-3 percentage/time claims.** The source itself says they are order-of-magnitude and practitioner self-report; they remain `~`.
- **No ADOPT/ADAPT/REJECT in workers 1-5.** Only `SYNTHESIS-v8.7.md` states those labels; the digest does not back-project them onto the workers.
- **English-only deviation.** The dispatch and `AGENTS.md` hard rule 5 require English; the scribe's default EN+AR parity is not applied on this repo. No Arabic mirror was drafted.
- **Doctrine.** `vantrilex-doctrine` governs the lane; this digest reorders no gate and assigns no verdict. `documentation-as-tests` did not apply because no product command or snippet was documented as an executable example.
- **No source edits, no state files, no git writes.** The seven inputs were read only; this file is the only write.

Ponytail: EXEMPT — pure prose/translation digest; no code or helper script authored, so the code-writing posture does not bind this node.
