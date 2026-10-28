# LD-04 fixed question set — built BEFORE the system

This set was fixed before the retrieval system was built, so questions can
never be shaped to fit the system after the fact. Every question carries its
known answer and its known source. Sources cite only pre-existing material
(the registry and the planning brief), never the LD-04 system files.

Goal: precision-first retrieval over professional sources.
Statement: answers cite evidence, never an anonymous summary.

## Q1 — skill order

- Question: In what fixed order do the four top-level skills run?
- Known answer: vantrilex-prime orients the machine once, vantrilex-vanguard
  equips the project once per project, vantrilex-workflow-forge authors the
  standing methodology before execution, and vantrilex-doctrine governs how
  the work runs once the kit is installed.
- Source: `registry/rag/01-doctrine.json :: doctrine-four-skills-order`.

## Q2 — doctrine scope

- Question: What does doctrine assign across the Leader, Guide, and
  Implementer roles?
- Known answer: Doctrine states the seven constitutional laws, assigns
  decision rights across the Leader, Guide, and Implementer roles, binds each
  lifecycle phase to its kit, and defines the five workflows with their gates
  and done-definitions.
- Source: `registry/rag/01-doctrine.json :: doctrine-laws-roles-workflows`.

## Q3 — forge gate

- Question: What must happen before execution starts?
- Known answer: Execution never starts before the forge skill authors the
  standing methodology; a start without that invocation fails its gate and
  the run stops before the first dispatch.
- Source: `registry/rag/01-doctrine.json :: doctrine-forge-gate`.

## Q4 — dispatcher wiring

- Question: How is the task-dispatcher instruction delivered to the model?
- Known answer: The task-dispatch instruction is injected ahead of every user
  message through the session prompt hook on the V2 surface.
- Source: `registry/rag/08-opencode-v2-platform.json :: v2-dispatcher-wiring`.

## Q5 — memory source rule

- Question: What must every memory entry carry about its origin?
- Known answer: Every entry carries its source: who wrote it, on what
  evidence, and when.
- Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3329` (V3 0.9.4
  treatment: source on every entry).

## Q6 — contradiction rule

- Question: What does retrieval do when entries contradict each other?
- Known answer: Retrieval surfaces the contradiction instead of silently
  merging the conflicting entries into one coherent false answer.
- Source: `AETHER-0.9-PLANNING-BRIEF-V3-2026-10-24.md:3330` (V3 0.9.4
  treatment: contradiction surfaced at retrieval, no silent merge).

## Scoring

Precision is measured as the fraction of questions whose known-answer document
ranks first. The LD-04 harness runs this measure for real and enforces 1.0
on this set.
