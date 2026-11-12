---
name: vantrilex-architect-craft
description: Use when a system is about to be built or refactored and its design is not yet fixed — constraints, interfaces, data flow, failure modes, rollout — so the V-Architect lane produces an auditable design before any build dispatch.
source: 3mar-baha/vantrilex-arsenal
---

# Vantrilex Architect Craft

## Purpose

Turn a dispatched design concern into a written, checkable design before any
build dispatch touches the tree. This skill is the procedure; the
`vantrilex-architect` agent is the mode. The agent holds no edit permission by
design — every artifact this procedure produces is a document, never a patch.

A design that survives this procedure names its constraints, its components
and their boundaries, the interface contracts between them, the data flow, the
failure modes and their blast radius, and the rollout story — and it carries
rejected alternatives for every significant decision, so the next reader can
tell whether a choice was reasoned or accidental.

This skill does not turn the architect into an implementer. It strengthens the
read-only boundary: the output is a design and ADRs, and the implementer
remains the only path from design to code.

## When to Use

- A feature, subsystem or refactor is about to be built and no agreed design
  exists yet — component boundaries, interfaces and data flow are undecided.
- A dispatch question is *how* something should be built, not *what* it should
  do ("how should the ledger reconcile" is design; "add the reconcile button"
  is implementation).
- A decision changes more than one component, or commits the tree to a pattern
  that outlives the dispatching lane, and an ADR is owed.
- An existing design is about to be built and needs a written red-team pass
  over its failure modes and rollout before the build starts.
- The `vantrilex-architect` agent is engaged; this is the procedure it runs.

## Do NOT use

- **Acceptance criteria or scope.** Those belong to the dispatcher and the
  Guide. A design that re-scopes the dispatch is a rejected design, however
  elegant it is.
- **Implementation.** No code, no patches, no "while we're here" edits. The
  agent holds no edit permission; this procedure never asks for one.
- **Gate verdicts.** Whether the design is *good enough to build* is the
  Guide's call, informed by the reviewer. This procedure produces the design
  for the gate to judge; it never certifies its own output.
- **Greenfield paving-stone work** with no boundary decision to make — a
  one-line config change is not a design.
- **When constraints are missing and cannot be obtained.** Return and name the
  missing constraint; never invent one silently.

## Inputs

- The dispatch: the concern, the acceptance criteria, the named constraints
  (functional and non-functional), the phase that will consume the design, and
  the verification the Guide will apply to the design itself.
- The tree and docs in scope: files the concern touches, patterns already in
  use, debt already carried, the RAG files and decision records the seat reads
  (`registry/rag/*.json`, `docs/15-DECISIONS.md`) — prior ratified decisions
  bind the design; they are not suggestions.
- The build-phase kit this design will be built with (`.opencode/equip.manifest.json`
  build phase) — a design that needs a component the kit cannot provision is a
  constraint failure, recorded as such, not a silent assumption.
- The ADR destination for significant decisions.

## Procedure

1. **Restate the design question in one sentence**, and name the non-goals.
   If the dispatch names no constraints at all, stop and return for
   constraints — an unstated requirement is an unmet one.
2. **Survey the current state before proposing anything.** Read the code and
   docs that exist; name the patterns already in use and the debt already
   carried; list the neighbors the design must integrate with. A design that
   ignores the system it lands in is a rewrite, not a design.
3. **Gather requirements explicitly, functional and non-functional.**
   Performance, security, scalability, availability, cost — each stated as a
   constraint with its value, or recorded as unstated with the reason.
   Unstated-and-material means the design cannot be verified; return and ask.
4. **Decompose the system.** Components with single responsibilities; the
   interfaces between them (contracts, not intentions); data models; integration
   patterns; the data flow end to end. Diagrams in text — tables and arrow
   prose, never a picture as the only artifact.
5. **Decide, and record the trade-offs per decision.** Pros, cons, alternatives
   considered, why each was rejected, final choice with its rationale. A
   decision stripped of its rejected alternatives cannot be revisited honestly.
6. **Design the failure modes.** For every component and interface: what breaks,
   how it is detected, how it fails (fail-open vs fail-closed), blast radius,
   rollback. If the design has no failure-mode table, the design is not done.
7. **Design the rollout.** Feature flag, migration order, cutover, verification
   steps, and the exact evidence that signals a successful cutover. A design
   that ends at "merge it" is half a design.
8. **Verify the design against every stated constraint.** Check each one
   explicitly, one by one, quoting it. If a constraint kills the design, say
   so and return — never ship a design that quietly violates its own brief.
   If the build kit lacks a required capability, record it as a constraint
   failure attributed to the kit, not as a gap the implementer will fill.
9. **Write the ADRs** for every significant decision (Context, Decision,
   Consequences, Alternatives Considered, Status, Date).
10. **Return the design and stop.** No implementation, no review, no
    declaration that it is buildable. The gate belongs to the Guide.

## Outputs

- The design document: component map, interface contracts, data model, end-to-end
  data flow, failure-mode table, rollout/cutover plan, and the verification
  plan the Guide can apply to the build.
- ADR entries (or ADR-shaped stubs if the tree's ADR convention differs) for
  every significant decision, each with its rejected alternatives.
- The constraint ledger: every stated constraint, and the design element that
  satisfies it or trades it — checkable line by line.
- The escalation, if any: the killing constraint, the missing requirement, the
  unverifiable assumption, or the kit gap — named plainly, never routed around.

## Failure Modes

- **Designing in a vacuum.** The host system's patterns and debt were not read;
  the design is a proposal for a system that does not exist.
- **Dropped or invented constraints.** The brief's constraints were narrowed,
  widened, or added to without a ruling; the Guide can no longer verify the
  design against its own brief.
- **Astronaut design.** A design more complex than the stated requirement
  justifies — extra services, extra indirection, extra failure surfaces, to
  look complete. Complexity is a liability, not a feature.
- **Golden hammer.** One pattern applied to every decision because it is
  familiar; the rejected alternatives say it was never evaluated against this
  problem.
- **Single-point blind spot.** No failure-mode table; the design works until it
  doesn't, and the rollout has no rollback story.
- **Alternatives-stripped decisions.** An ADR missing its rejected alternatives;
  the next reader cannot tell a reasoned choice from a habit.
- **Implementation creep.** Prose in the design disguised as code, patches
  "just this once", or a design so detailed the implementer has no judgment
  left. Stay on the design side of the boundary.
- **Self-certification.** The design declares itself buildable or verified;
  verification is not performed and the Guide reads a claim as a verdict.
- **Advisory posture.** Escalating to the dispatcher with "maybe we should"
  instead of one named constraint that kills or gates the design.
