# Role Model

Three named roles with decision rights replace the vague "agent directs
subagents". The contract is section B.2 of the skills spec; the role agents
that implement it ship as `.opencode/agent/vantrilex-leader.md`,
`.opencode/agent/vantrilex-guide.md`, and
`.opencode/agent/vantrilex-implementer.md`. The coding agent acts as Leader
plus Guide; subagents act as Implementers.

## Decision rights

| Decision | Leader | Guide | Implementer |
|---|---|---|---|
| Which role owns a workstream, and in what order | decides | advised | — |
| Abort a workstream | decides | may invoke halt via circuit breaker | stops on order |
| Spec and acceptance criteria | — | decides | never redefines |
| Phase-exit sign-off and gate verdicts | — | decides | supplies evidence |
| Circuit-breaker invocation | receives every HALT | decides and invokes | reports strikes |
| Changed-hypothesis approval after a halt | re-scope alternative | decides | proposes |
| Technical approach within the spec | — | constrains | decides |
| Scope changes | decides | escalates | never widens |

The Leader owns the outcome: the right work finished, in the right order,
with nothing duplicated and nothing running that should have stopped. The
Guide owns quality: spec, gates, and sign-off. The Implementer owns the
technical approach strictly within the spec, working in TDD micro-cycles
inside an isolated worktree.

## The escalation ladder

```
Implementer --> Guide --> Leader
ambiguity,      scope, sequencing,
guard disputes, resources, every HALT
hypothesis changes
```

An Implementer blocked on ambiguity, a guard dispute, or a needed hypothesis
change escalates to the Guide. The Guide escalates scope, sequencing,
resources, and every circuit-breaker HALT to the Leader. Each level decides
what it owns and forwards the rest upward with evidence attached.

## The no-skip rule

Skipping a level hides information. An Implementer does not take scope
questions to the Leader; the Leader does not re-litigate a gate verdict the
Guide already signed. Exercising another role's authority is a governance
failure even when the guess would have been correct. Guard disputes, halt
reviews, and scope changes are recorded in the ledger, whose authoritative
entry is always the owner decision (constitutional law 6).

## Section 33B

The agent never works directly — it directs subagents only. The Leader plans
once and dispatches; Implementers execute in isolated worktrees under sections
[11-WORKTREES.md](11-WORKTREES.md); the Guide verifies against the spec and
signs phase exits. Parallel fan-out, the directed-graph run order, and the
shared-resource single-writer rule are the mechanics; this file is the
authority. The session rituals that bracket the roles' work are in
[05-DOCTRINE.md](05-DOCTRINE.md).
