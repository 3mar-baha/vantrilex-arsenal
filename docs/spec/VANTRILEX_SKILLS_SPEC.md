# Vantrilex Skills — Behavioral Specification v1.0

**Status:** owner-reviewed design → input #3 for the Vantrilex Arsenal build.
**Companions:** `VANTRILEX_KIT_SPEC.md` (naming, Tier-0 set, catalog v2) +
`VANTRILEX_CATALOG.md` (component registry).
**Language rule:** all skill files, docs, and prompts the skills generate are in **English**.
The owner communicates in Arabic; the chatbot relay (below) bridges the two.

---

## PART A — Vantrilex Vanguard (`vantrilex-vanguard`)

**Role:** the scout. Surveys the territory, detects the project state, selects the kit,
installs it, verifies it, reports. Then builds the documentation foundation.
**Trigger:** "equip this project" / new project setup / "vanguard".

### A.1 Step 0 — Preflight (system doctor)
Before anything else, run the preflight check (adapted `preflight-system-doctor`):
environment → runtimes → configuration → workspace. Emit a PASS/FAIL/SKIPPED table
with remediation commands. **Block on any CRITICAL failure.** Node-based checks only
(no python, no jq, no tmux assumptions).

### A.2 Step 1 — Project-state detection (decision tree, automatic)
Scan the repo; do NOT ask the user which state it is in. Confirm with one sentence.
- Code present? Docs present? Do the docs match the code (spot-check 3 files)?
- **State 1 — greenfield** (no code, no docs): go to A.3.
- **State 2 — code, no docs (or incompatible docs):** launch parallel recon subagents
  (one per major directory), produce the docs (A.7) **plus** a temporary `27-PROBLEMS.md`
  listing everything that must be fixed. Work starts with the fixes (bugfix workflow).
  Archive `27-PROBLEMS.md` when empty.
- **State 3 — docs, no code:** skip research; verify docs against code samples for accuracy;
  move old docs to `docs/99-archive/` with a manifest stating why each was replaced;
  write the new docs (A.7); continue as State 1.
- **State 4 — docs + code:** deep recon of the code → docs (A.7) → `27-PROBLEMS.md` →
  then the owner's new additions as in State 1.

### A.3 State-1 concept phase — the chatbot relay
1. Ask the owner for a short text stating the project's core goal.
2. Return an **Arabic prompt** for the owner to give to a chatbot. The prompt must instruct
   the chatbot to: (a) conduct a long, rigorous discussion of the idea (Socratic, steelmanning,
   realistic); (b) research proven methods, knowledge sources, and useful open-source projects;
   (c) only then, explain the complete idea in full detail.
3. Required sections of the Arabic prompt: role · discussion methodology (graduated questions,
   skepticism, steelmanning) · research duties (proven methods, knowledge sources, open-source
   projects) · output format (simple Arabic explanation + precise English directive for the
   coding agent).
4. The owner returns with the chatbot's researched concept → Vanguard proceeds to A.4.

### A.4 Step 2 — Source surveying
Query, in order: the local `catalog.json`; `skills.sh` leaderboard + `npx skills` CLI;
`vercel-labs/find-skills`; Smithery registry CLI (`npx @smithery/cli`);
`agency-agents` roster; `awesome-design-md`; `ecc` hooks. Every candidate MCP/CLI must
have its docs reachable via Context7 — if not, it is rejected or flagged.

### A.5 Step 3 — Kit selection (5-step algorithm)
1. Extract needs from project type (stack, domain, UI-heavy?).
2. Query the catalog.
3. Score: installs/stars (prefer 1K+), activity (<6 months), license, non-overlap.
4. Apply overlap rules (`supersedes`/`pairs_with`): never install both sides of `supersedes`
   (e.g. `ponytail-review` vs `code-review` → pick by recency/scope, record why).
5. Present a shortlist table → **owner approves** → install.
Tier 0 (50 components) is pre-approved; Tier 1 is per-project.

### A.6 Step 4 — Install + verify + report
- Install with REAL commands only (`npx skills add <repo> --skill <name> -a opencode`,
  MCP JSON snippets, etc.). Never invent a package name — check npm/GitHub first.
- Write `kit.lock` entries (pinned versions).
- Inject **phase-scoped**: a component lives only in its phases (grill-me→docs,
  wayfinder→plan, tdd→build, review skills→review). 8-MCP cap is the backstop.
- Verify per kind: MCP = `list_tools` ping + smoke call; skill = load SKILL.md + dry-run;
  agent = echo task; plugin/hook = fire test event; LSP = open sample file, expect
  diagnostics; formatting = run on sample, diff check.
- Report table: tool | kind | status (works/fails) | evidence | how to fix.
  Proceed only after owner sign-off on failures.

### A.7 Step 5 — Documentation phase (28 files, `docs/`)
Generate the numbered docs in 8 folders. Canonical list 00–27 (fixed numbers,
fixed filenames — this list is authoritative; the "kit spec §2.7" pointer in
earlier drafts was a stale reference and is superseded by this list):
- `00-PROJECT-SUMMARY.md` — Project Summary
- `01-VISION.md` — Vision
- `02-GLOSSARY.md` — Glossary
- `03-FUNCTIONAL-REQUIREMENTS.md` — Functional Requirements
- `04-NON-FUNCTIONAL-REQUIREMENTS.md` — Non-Functional Requirements
- `05-PERSONAS.md` — Personas
- `06-SCOPE.md` — Scope
- `07-SUCCESS-CRITERIA.md` — Success Criteria
- `08-ARCHITECTURE-OVERVIEW.md` — Architecture Overview
- `09-TECHNOLOGY-STACK.md` — Technology Stack
- `10-DATA-MODEL.md` — Data Model
- `11-API-CONTRACTS.md` — API Contracts
- `12-SECURITY-MODEL.md` — Security Model
- `13-ARCHITECTURE-DECISION-RECORD.md` — Architecture Decision Record
- `14-KIT-INVENTORY.md` — Kit Inventory
- `15-kit.lock` — kit.lock (lockfile, not Markdown)
- `16-AGENT-REGISTRY.md` — Agent Registry
- `17-CHECKPOINT.md` — Checkpoint (living state file, updated every session)
- `18-WORKFLOW.md` — Main Workflow (left EMPTY for Doctrine to fill)
- `19-FEATURE-WORKFLOW.md` — Feature Workflow
- `20-REVIEW-WORKFLOW.md` — Review Workflow
- `21-SECURITY-AUDIT-WORKFLOW.md` — Security Audit Workflow
- `22-BUGFIX-WORKFLOW.md` — Bugfix Workflow
- `23-ROADMAP.md` — Roadmap
- `24-RISKS.md` — Risks
- `25-AI-CONSTITUTION.md` — AI Constitution (immutable laws, see Doctrine Part B)
- `26-AI-ANTIPATTERNS.md` — AI Antipatterns (what the agent must never do)
- `27-PROBLEMS.md` — Problems
Archive location for superseded docs: `docs/99-archive/` with a manifest (never delete).
Rules: English, detailed without stinginess, fixed numbers.
- `25-AI-CONSTITUTION.md` — immutable laws (see Doctrine Part B).
- `26-AI-ANTIPATTERNS.md` — what the agent must never do.
- `00-PROJECT-SUMMARY.md` — the comprehensive "if I forgot the project" reference.
- `18-WORKFLOW.md` — left EMPTY for Doctrine to fill.
- `17-CHECKPOINT.md` — living state file, updated every session.

### A.8 Execution relay (post-docs)
The owner becomes the bridge: the coding agent executes, the chatbot (per the A.3 prompt)
interprets and verifies, the owner directs. Each turn: agent reply → owner → chatbot →
chatbot returns (Arabic explanation + precise English directive) → owner → agent.
The agent must use skills at their mapped phases (see Doctrine phase map).

### A.9 Vanguard laws
1. Request information before writing. 2. Never invent install commands.
3. Owner approval gates: shortlist, verification failures, docs. 4. No placeholders.

---

## PART B — Vantrilex Doctrine (`vantrilex-doctrine`)

**Role:** the law-book + drill manual. Workflows, roles, gates, rituals.
**Trigger:** any build/review/release work / "doctrine".

### B.1 Constitutional laws
1. **The agent never works directly — it directs subagents only** (§33B).
2. **3-strike circuit breaker:** same defect, 3 failed attempts → HALT + Diagnostic
   Incident Report; resume only on Guide-approved changed hypothesis.
3. **Phase-scoped kit:** inject per phase, prune after; 8-MCP cap as backstop.
4. **Cost guard:** prefer Skill/CLI over MCP on ties.
5. **Dispatch confirmed only when the result lands**, not on a subagent's word.
6. **Ledger principle:** the owner decision is the authoritative entry.
7. **Docs discipline:** no random `.md` files outside the numbered docs
   (hook-gated, pending owner approval).

### B.2 Roles (decision rights)
- **Leader:** routing, sequencing, abort; owns the outcome.
- **Guide:** spec, gates, phase-exit sign-off; owns quality; invokes the circuit breaker.
- **Implementer:** TDD micro-cycles in an isolated worktree; owns technical approach
  *within* the spec — never widens scope or redefines acceptance criteria.
- **Escalation:** Implementer → Guide (ambiguity, guard disputes, hypothesis changes);
  Guide → Leader (scope, sequencing, resources, every HALT). Skipping a level hides information.

### B.3 Phase map (skill × phase) — mandatory
| Phase | Skills |
|---|---|
| docs | `grill-me` (before docs), `session-context-primer` |
| plan | `wayfinder` (decision tickets), `ask-matt` (router) |
| build | `tdd`, `ponytail`, `preflight-system-doctor` (step 0) |
| review | `code-review` (two-axis), `ponytail-review` |
| operate | `ponytail-audit` (periodic), `ponytail-debt` (ledger) |
| on-demand | `find-skills`, `skill-creator` |

### B.4 Workflows (each: trigger → required kit → steps → gates → done-definition)
1. **Feature:** spec → plan → worktree → TDD → review (two-axis) → merge.
2. **Review:** two-axis (standards × spec), parallel subagents, aggregate.
3. **Security audit:** security-auditor agent + security-guidance; secret scan gate.
4. **Bugfix:** defect id → hypothesis → one fix → verify; circuit breaker armed.
5. **Release:** three second-pass guards (Clean Code / Test / Docs) → changelog →
   semver check → tag → `gh release` → post-release verification (fresh clone).

### B.5 Session rituals
- **Start:** read `25-AI-CONSTITUTION.md` + `00-PROJECT-SUMMARY.md` → emit CONTEXT ANCHOR
  (mission, phase, branch, worktrees, next item, guards, circuit state). ~10s budget.
- **End:** persist learnings (session-end hook).
- **Pre-compact:** save state (pre-compact hook).

### B.6 Skill-file format standard
Every SKILL.md: frontmatter (`name`, `description`) → Purpose → When to Use /
Do NOT use → Inputs → Procedure → Outputs → Failure Modes.

### B.7 Parallelism mechanics (§33B)
Plan once → DAG. Independent nodes fan out as concurrent worktree branches
(one concern per worktree); dependent nodes chain sequentially. Shared resources
single-writer. Reviewed, signed-off merges back to main.
