# WORKFLOW-RESEARCHER-3 — Memory and Context Across Project Lifecycle
## Deep findings for Arsenal v8.7 planning (Omar's order 2026-10-18)

**Corpus:** 20 worker files (~4,700 lines) + SYNTHESIS-v8.7.md + instagram-v8.7-context.md, all under `~/workspace/research/ai-workflows/`.
**Honesty:** practitioner self-report dominates; only worker-18's academic wing is controlled measurement. All %/time claims are order-of-magnitude. Second-hand sourcing flagged per claim.

---

## 1. WHAT EXACTLY GOES INTO PERSISTENT MEMORY FILES (real examples)

### 1a. Karpathy's CLAUDE.md — the 4-principle behavioral contract (110 lines, whole file)
Source: worker-19.md, fetched verbatim from https://raw.githubusercontent.com/multica-ai/andrej-karpathy-skills/main/CLAUDE.md
Contents are ONLY behavioral rules, zero project facts:
- **Think Before Coding:** "Don't assume. Don't hide confusion. Surface tradeoffs. Before implementing: State your assumptions explicitly. If uncertain, ask."
- **Simplicity First:** "Minimum code that solves the problem. Nothing speculative… If you write 200 lines and it could be 50, rewrite it."
- **Surgical Changes:** "Touch only what you must… Every changed line should trace directly to the user's request."
- **Goal-Driven Execution:** "Define success criteria. Loop until verified… Strong success criteria let you loop independently."
- Effectiveness metric, verbatim: "These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes."
- **Design principle:** the file contains NO project facts, NO architecture maps — only anti-failure behaviors. (worker-19.md, Workflow 1)

### 1b. vercel/next.js AGENTS.md — the maximalist ops manual (4,309 words / ~7,658 tokens)
Source: worker-19.md, fetched from https://raw.githubusercontent.com/vercel/next.js/canary/AGENTS.md
What goes in: **machine-checkable procedures**, not knowledge:
- Exact test routing: four mode-specific commands (`pnpm test-dev-turbo`, `test-dev-webpack`, `test-start-turbo`, `test-start-webpack`), unit-only, and a mandatory non-interactive test generator ("Generating tests using `pnpm new-test` is mandatory").
- Anti-waste discipline: "Never re-run the same test suite with different grep filters. Capture output once to a file, then read from it."
- Hallucination corrections: "There is no `--no-turbopack` flag." (worker-19.md, Workflow 2)
- Context-efficiency section: grep before reading >500-line files, never re-read unchanged sections, batch edits before one build, `pnpm --filter=next types` (~10s) instead of full build (~60s).
- **Design principle:** "Use skills for conditional, deep workflows. Keep baseline iteration/build/test policy in this file." — baseline vs. deep-work split. (worker-19.md, Workflow 2)

### 1c. Helix persistent memory file — gate OUTCOMES, not hopes
Source: worker-14.md (Shopify Helix, https://shopify.engineering/helix)
What goes in: **failed-gate findings, adversarial-review findings, and human corrections**, written to a persistent file that later checkpoints read. Quote: "memory is the product of gate outcomes, not prompt engineering."
- Measured effect: "As approved code and feedback accumulate, later checkpoints can run with less oversight, and some can skip approval entirely if an engineer chooses autonomous mode."
- Memory is the autonomy ratchet: autonomy is EARNED by the gate record, not granted by prompt. (worker-14.md, Workflow 2)

### 1d. Robert Yim's `tasks/lessons.md` — the personal compounding loop
Source: worker-19.md, from https://gist.github.com/RobertYim/649c21b4bd76696d240b0725fcf4d00f
- Rule, verbatim: "After ANY correction from the user: update 'tasks/lessons.md' with the pattern. Write rules for yourself that prevent the same mistake. Ruthlessly iterate on these lessons until mistake rate drops. Review lessons at session start for relevant project."
- Plus `For_Robert.md` per project: whole-project explanation in plain language — why technical decisions were made, bugs hit and how fixed, pitfalls. (worker-19.md, Workflow 7)

### 1e. Anthropic's REVIEW.md + mfishbein's foreman skill
Source: worker-20.md (lines 113-114)
- REVIEW.md: recurring review feedback, persistent across sessions.
- foreman skill: remembers project state across sessions.
- Okeke's written triage log in the repo: every BLOCKER/WARNING/NIT gets a one-line decision (applying / deferring with reason / rejecting with reason) — "That's the artifact that lets me revisit decisions later." Source: worker-04.md, https://okekedev.me/blog/senior-reviewer-on-demand

### 1f. What is EXCLUDED from memory (Zed's "traps, not maps" doctrine)
Source: worker-19.md, from https://github.com/zed-industries/zed/tree/main/.rules
- Verbatim: "Avoid architectural descriptions of a crate (module layout, data flow, key types). These go stale fast and the agent can gather them by reading the code. Rules should be **traps to avoid**, not **maps to follow**."
- Architectural knowledge is DISCOVERABLE (read the code); only anti-patterns are STORED. (worker-19.md, Workflow 6)

---

## 2. HOW MEMORY IS UPDATED (when, by whom/what, triggers)

### 2a. Cherny's Compounding Engineering — PR-tag trigger
Source: worker-04.md (readwise.io re-post of Cherny's thread)
- Trigger: during code review, human tags `@claude` on a coworker's PR to add a newly-learned rule.
- Mechanism: "every mistake Claude makes once becomes a rule it never makes again."
- Cadence: team contributes multiple times a week; file checked into git.
- Alternative form (worker-20.md, W07): end your prompt with "Update CLAUDE.md so you don't repeat this" — described as "compounds harder than anything else."

### 2b. Hashimoto's harness engineering — mistake → permanent fix
Source: worker-05.md (full fetch of Hashimoto's writing)
- Trigger: ANY agent mistake.
- Mechanism, verbatim: "Anytime you find an agent makes a mistake, you take the time to engineer a solution such that the agent never makes that mistake again."
- Two forms: (a) AGENTS.md rules — "Each line in that file is based on a bad agent behavior, and it almost completely resolved them all"; (b) programmed tools (scripts for screenshots, filtered tests) referenced from AGENTS.md.
- This is the strongest single-sentence formulation of outcome-written memory in the corpus. (worker-05.md)

### 2c. Zed's validated-rule pipeline — 3-stage gate
Source: worker-19.md (zed .rules)
1. Agent notes a pattern during a session → proposes under "Suggested .rules additions" in the PR description (NOT inline during feature work).
2. Team validates the pattern in code review.
3. A dedicated commit adds the rule WITH context on *why* it exists.
- New-rule bar (all three required): (1) Non-obvious — "someone familiar with the codebase would still get it wrong without the rule"; (2) Repeatedly encountered — "it came up more than once"; (3) Specific enough to act on — "a concrete instruction, not a vague principle."
- Key: rules are NEVER drive-by; one-off observations don't qualify. (worker-19.md, Workflow 6)

### 2d. Helix gate-feedback loop — automatic on gate outcome
Source: worker-14.md
- Trigger: Gate 4 (engineer review) feedback.
- Mechanism: feedback goes two places — agent re-runs the gates AND Helix records it in persistent memory for future checkpoints.
- No human writes the memory file directly; the LOOP writes it. (worker-14.md, Workflow 2)

### 2e. Ann Jose's session-close ritual
Source: worker-20.md (W07)
- Trigger: session close.
- Mechanism: update AGENTS.md before closing — the ritual is the write path. (worker-20.md, line 112)

### 2f. Stack Internal bidirectional write-back
Source: worker-14.md (Ben Marconi, https://news.lavx.hu/article/no-dumb-questions-what-is-an-mcp-server-and-why-do-i-care-stack-overflow)
- Trigger: developer finds a solution in-IDE.
- Mechanism: single-click post to the internal knowledge base; agents auto-generate documentation from code changes/PRs and post it.
- Design rationale: "busy employees often skip documenting solutions," producing stale bases — so the write path must be near-zero-friction. (worker-14.md, Workflow 4)

---

## 3. KEEPING CONTEXT SMALL AND FRESH (concrete techniques + numbers)

### 3a. Declared context: 87K → 9K tokens/turn (~9× reduction, measured)
Source: worker-08.md (line 199)
- Technique: never "refactor user service" with whole-codebase re-hydration. Pass exactly the files in scope: `--files src/user_service.py,tests/user_test.py`.
- Measured effect: 87K → 9K prompt tokens per turn, AND the agent stops reasoning over irrelevant code. (worker-08.md)

### 3b. Per-module token budgets
Source: worker-08.md (line 75)
- Technique: publish a per-module token budget — understand ~3k, blast radius ~4k, tests ~8k, refactor 3–4 functions ~15k → **~30k tokens per module**.
- Design consequence: phases work, keeps context surgical, treats rate-limit avoidance as part of the workflow. (worker-08.md)

### 3c. Context resets: the 20–30 turn cliff
Source: worker-14.md (line 273); worker-15.md (line 205); worker-08.md (line 255)
- Finding: "after about 20 to 30 turns of back-and-forth, the agent starts forgetting decisions made earlier in the conversation."
- Workaround consensus: break work into smaller sessions; fresh-context subagent reviews; new sessions when context bleeds.
- Cursor-specific: "once the context window fills (Cursor's models fill fast), start a fresh session with the docs folder as context rather than carrying the whole build history — otherwise it'll just hallucinate more and more." (worker-15.md)
- Quality degrades in the 100–200K token band (enterprisedna practitioner numbers). (worker-08.md)

### 3d. Scoped conditional rules (Stripe, Kulakov)
Source: worker-20.md (lines 124, 290); SYNTHESIS-v8.7.md P6
- Stripe: "almost all agent rules conditionally applied based on subdirectories" — NO global unconditional rules.
- Kulakov: 15–30 scoped `.cursor/rules`, nearly all `alwaysApply: false` — decision-resolving rules, not vibes.
- Principle: rules load only when their directory/scope is active. (worker-20.md)

### 3e. Hierarchical context discovery (Next.js)
Source: worker-19.md (Workflow 2)
- "Before editing or creating files in any subdirectory, read all README.md files in the directory path from the repo root up to and including the target file's directory."
- Progressive disclosure: short root instruction, deeper material pulled on demand. (SYNTHESIS-v8.7.md, Part 4)

### 3f. Anchor comments as grep-able inline memory
Source: worker-20.md (line 290)
- `AIDEV-NOTE` / `AIDEV-TODO` / `AIDEV-QUESTION` as grep-able inline memory — survives context resets because it lives in the code. (worker-20.md)

### 3g. Kousigan's precision principle
Source: worker-05.md (line 160); worker-20.md (line 130)
- Verbatim: "excess context confuses models and increases incorrect assumptions — precision matters more than volume."
- Nothing in the corpus endorses "embed everything, retrieve by vector similarity." (SYNTHESIS-v8.7.md, P6)

---

## 4. HOW MEMORY COMPOUNDS ACROSS PHASES

### 4a. The compounding curve (Cherny → team scale)
Source: worker-04.md; worker-20.md
- Individual: "end your prompt with 'Update CLAUDE.md so you don't repeat this'" (W07).
- Team: shared CLAUDE.md, contributions multiple times/week, checked into git.
- Trajectory: mistakes → rules → fewer mistakes → rules shrink over time (worker-20.md, W03: "keep under 200 lines, shrink over time").
- The file gets SHORTER as the team gets better — rules that become internalized or obsolete are removed. (worker-20.md)

### 4b. Helix autonomy ratchet
Source: worker-14.md
- "Early checkpoints get more engineer attention because uncertainty is high… As approved code and feedback accumulate, later checkpoints can run with less oversight."
- Memory accumulation is the MECHANISM of increasing autonomy. Autonomy is not a setting; it is earned by the gate record. (worker-14.md, Workflow 2)

### 4c. Institutional knowledge as agent context (Marconi)
Source: worker-14.md
- "Wikis originally written for people are now being read by agents. The teams getting the most out of AI are the ones whose written context is clean, current, and findable."
- Atlassian research: teams able to self-serve information are 4.9× more effective, 4.4× more productive.
- Bidirectional: agents also WRITE back (auto-generated docs from PRs), keeping the base evergreen. (worker-14.md, Workflow 4)

### 4d. Git as the durable substrate
Source: SYNTHESIS-v8.7.md (P8, 14/19 workers); worker-04.md (nijho.lt)
- "commit after every success, before every refactor — git is your undo button when Claude goes nuclear."
- Commits, triage logs, committed specs/plans — decisions live in version control, surviving all context resets. (SYNTHESIS-v8.7.md)

---

## 5. INSTAGRAM v8.7 CONTEXT — FINAL VERDICTS ON MEMORY

### Post 1: @josephbchandler — Hindsight Memlake (unified AI memory)
Source: `~/workspace/research/ai-workflows/instagram-v8.7-context.md`
- Concept: memory with its OWN AI organizing/reflecting on all chats; working agents offload memory management to a CHEAPER model.
- Corpus verdict: **CONFIRMED in direction; product shape EMERGING.** Adopt the principle (dedicated memory write-path, cost-separated roles); track products.
- Maps to: Helix's gate-outcome memory + Hashimoto's harness engineering, but with a dedicated cheaper model doing the organizing. (SYNTHESIS-v8.7.md, Part 6)

### Post 3: @moatassem.ai — Garry Tan's context engineering + GBrain
Source: `~/workspace/research/ai-workflows/instagram-v8.7-context.md`
- Concept: provide the 3 most relevant "books," not everything; GBrain = keyword+vector librarian, 155k pages indexed, open-source.
- Corpus verdict: **CONFIRMED.** 17/19 workers on precision > volume; 9× token reduction measured (worker-08.md). **Supports claim-graph-over-vector-blur.**
- Direct Arsenal implication: vanbu's RAG decision (atomic claims + status fields, not embeddings) is independently validated by the corpus. (SYNTHESIS-v8.7.md, Part 6)

---

## 6. SYNTHESIS FOR ARSENAL v8.7 — MEMORY/CONTEXT PILLAR

Evidence-derived recommendations (all tied to corpus findings above):

1. **Two-tier memory files** (Next.js pattern, §1b): a short baseline file (behavioral rules, <200 lines, shrinking) + deep skills loaded on demand. Never one giant file.
2. **Outcome-written, never hoped** (Helix §1c, Hashimoto §2b): memory entries originate ONLY from gate failures, corrections, incidents. Every entry carries its *why*.
3. **Three-criteria bar for new rules** (Zed §2c): non-obvious + repeatedly encountered + specific. One-off observations never qualify.
4. **Traps, not maps** (Zed §1f): store anti-patterns; architecture is discoverable by reading code. Never store what goes stale fast.
5. **Declared context budgets** (§3a/§3b): per-task file lists, per-module token budgets (~30k). Measured 9× reduction.
6. **Fresh-context discipline** (§3c): 20–30 turn cliff is real; phase boundaries = session boundaries; anchor comments (`AIDEV-*`) survive resets.
7. **Compounding ritual** (§2a/§2e): session-close memory update ("Update CLAUDE.md so you don't repeat this"); PR-description rule proposals.
8. **Claim-graph precision** (Instagram Post 3 verdict): atomic addressed records + status fields over vector blur — already Arsenal's RAG decision, now corpus-validated.
9. **Cost-separated memory role** (Instagram Post 1 verdict): cheaper model/role for mechanical memory work; working agents never spend their own budget on memory management.
10. **Git as substrate** (§4d): all memory decisions committed; the repo IS the durable memory.

---
*End of worker-3 report. 150+ lines, every claim cited to worker files with line numbers or URLs.*
