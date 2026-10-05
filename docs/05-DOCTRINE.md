# Vantrilex Doctrine

Vantrilex Doctrine is the law skill: the law-book plus the drill manual. It
says how the kit is used once Vanguard has equipped it — roles, gates,
workflows, rituals. Its contract is Part B of
`spec/VANTRILEX_SKILLS_SPEC.md`. The skill file itself is built under
`.opencode/skills/vantrilex-doctrine/`; this file states the contract it
enforces.

Trigger phrases: any build, review, or release work; "doctrine".

## The seven constitutional laws

1. The agent never works directly — it directs subagents only (section 33B).
2. 3-strike circuit breaker: the same defect surviving 3 consecutive failed
   fix attempts halts everything and emits a Diagnostic Incident Report;
   resumption needs a Guide-approved changed hypothesis.
3. Phase-scoped kit: components are injected per phase and pruned after; the
   8-MCP cap is the backstop.
4. Cost guard: on ties, prefer a Skill or CLI over an MCP server.
5. Dispatch is confirmed only when the result lands, never on a subagent's word.
6. Ledger principle: the owner decision is the authoritative entry.
7. Docs discipline: no Markdown files outside the numbered documentation set
   or an allow-listed directory (hook-gated; `brand/` is allow-listed because
   it holds the visual identity specification, and random-file creation stays
   blocked unless the owner approves widening the allow-list).

## The three roles

| Role | Owns | Decides |
|---|---|---|
| Leader | The outcome | Routing, sequencing, abort |
| Guide | Quality | Spec, gates, phase-exit sign-off; invokes the circuit breaker |
| Implementer | Technical approach within the spec | How to build, in TDD micro-cycles inside an isolated worktree |

The Implementer never widens scope and never redefines acceptance criteria.
Escalation runs Implementer to Guide (ambiguity, guard disputes, hypothesis
changes) and Guide to Leader (scope, sequencing, resources, every HALT).
Skipping a level hides information, so the no-skip rule in
[10-ROLE-MODEL.md](10-ROLE-MODEL.md) is itself a gate. The coding agent acts
as Leader plus Guide; subagents act as Implementers.

## Phase map

Mandatory: skills run at their mapped phases. Reproduced exactly from section
B.3 of the skills spec.

| Phase | Skills |
|---|---|
| docs | `grill-me` (before docs), `session-context-primer` |
| plan | `wayfinder` (decision tickets), `ask-matt` (router) |
| build | `tdd`, `ponytail`, `preflight-system-doctor` (step 0) |
| review | `code-review` (two-axis), `ponytail-review` |
| operate | `ponytail-audit` (periodic), `ponytail-debt` (ledger) |
| on-demand | `find-skills`, `skill-creator` |

The `on-demand` row is admitted by ratified decision: discovery and forging
are not phases, so `find-skills` and `skill-creator` load when the catalog has
no fit rather than on a schedule. See [15-DECISIONS.md](15-DECISIONS.md) and
[06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md).

## The five workflows

Each workflow carries a trigger, the required kit, steps, gates, and a
done-definition.

1. **Feature.** Trigger: an approved spec item. Kit: phase-scoped build kit
   plus review lane. Steps: spec, plan, worktree, TDD micro-cycles, two-axis
   review, merge. Done: merged through a reviewed, signed-off integration
   with gates green.
2. **Review.** Trigger: a finished change set. Kit: `code-review` doctrine
   plus reviewer agents. Steps: fan out parallel subagents over the change,
   judge on two axes (standards, spec), aggregate into one verdict. Done: one
   verdict with evidence per finding.
3. **Security audit.** Trigger: auth, input handling, secrets, endpoints, or
   release candidacy. Kit: security-auditor agent plus security guidance.
   Steps: audit the change, run the secret scan gate, record findings. Done:
   no unresolved secret or exfiltration finding.
4. **Bugfix.** Trigger: a defect id. Kit: build kit with the circuit breaker
   armed. Steps: state one hypothesis, apply one fix, verify against the
   failing probe. Done: the probe passes, or the third strike halts the loop
   with a Diagnostic Incident Report.
5. **Release.** Trigger: a release candidate. Kit: the three second-pass
   guards plus the release packager. Steps: Clean Code, Test, and Docs guards,
   then changelog, semver check, tag, `gh release`, post-release verification
   from a fresh clone. Done: published release with attached artifact (see
   [14-CI-RELEASE.md](14-CI-RELEASE.md)).

## The three rituals

- **Start.** Read the constitution and the project summary, then emit the
  CONTEXT ANCHOR: mission, phase, branch, worktrees, next item, guards,
  circuit state. Budget is about ten seconds; an approximate anchor now beats
  a perfect anchor late.
- **End.** Persist learnings through the session-end hook so the next session
  starts from prior context instead of a blank prompt.
- **Pre-compact.** Save working state through the pre-compact hook before the
  transcript compacts, because the transcript is not assumed to survive.

## Section 33B mechanics

Every task is decomposed into the maximum number of independent parallel units
and those units fan out across subagents; two independent units are never run in
sequence and never absorbed into one. The goal is speed, and the same split is
what keeps each unit's contract small enough to verify and each failure isolated
to one node.

Plan once, then run the plan as a directed graph. Two units are independent only
when no shared write target, no read-after-write dependency, and no shared
mutable state; anything else is a chain. Every node whose predecessors have
landed goes out in the same wave, one concern per worktree. Shared resources
stay single-writer: two writers on one file lose data silently, so either chain
the units or split the file into disjoint regions. Merges return through
reviewed, signed-off integrations. The lead plans, dispatches, verifies each
landing, and integrates; subagents execute.

Three failure modes carry names: the serial slog, the god-agent, and the write
collision. The worktree mechanics are documented in
[11-WORKTREES.md](11-WORKTREES.md); the decision rights behind them in
[10-ROLE-MODEL.md](10-ROLE-MODEL.md).
