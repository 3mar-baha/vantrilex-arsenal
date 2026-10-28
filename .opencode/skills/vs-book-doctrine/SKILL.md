---
name: vs-book-doctrine
description: Use when a craft book needs governing — states the six-part book shape, enforces the differentiation gate and the domain-books-replace-agents rule, and binds the T8 review ritual to every plan and build.
---

# Book Doctrine

## Purpose

Govern every craft book from one written doctrine so books stay comparable
without becoming copies. The doctrine fixes the six-part book shape, owns
the differentiation gate, owns the domain-books-replace-agents rule, and
binds the T8 review ritual to every plan and build acceptance.

## When to Use

- When a new craft book is proposed and must match the six-part shape.
- Whenever two books look alike and the differentiation gate must rule.
- When a domain side-agent is proposed and the book-instead rule must apply.
- Before any plan review or build acceptance that needs the T8 ritual.

## Do NOT use

- As a craft book itself. Direction, planning, and probing live in the
  leader books; this doctrine governs them, never replaces them.
- As an equip lane. Loadout computation belongs to the golden-equipment
  doctrine and the Vanguard outfitter; this doctrine states the shape
  those lanes fill.
- To resolve flagged conflicts. Carried conflicts stay flagged; the
  doctrine cites them, never reconciles them.
- To install anything. This skill ships no install command; where the R2
  company-skill set appears to overlap, both are carried verbatim and
  nothing is installed.

## Inputs

- A candidate book carrying all six parts in order.
- The differentiation gate at `.opencode/craft/differentiation-gate.md`.
- The rejection log at `.opencode/craft/rejection-log.md`.
- The reclassification audit at `.opencode/craft/reclassification-audit.md`.
- The T8 review ritual stated in the Procedure below.

## Procedure

Naming truth, fixed verbatim: the name is Vantrilex and the governed marks
are `vs-bl-*` for Blazar, `vs-at-*` for Aether, and `vs-pu-*` for Pulsar.
Each prefix marks the craft of one leader alone and is never mixed with
another. Govern books in the six parts below, in order.

1. **Identity, including non-duties.** The doctrine is the book governor:
   keeper of the six-part shape, the gate, the book-instead rule, and
   the review ritual. Non-duties, stated explicitly: the doctrine does
   not direct a wave, does not author a plan, does not run a probe, does
   not compute loadouts, and does not install anything.

2. **Instruction pack.** Admit a book only when all six parts are present
   in order with non-duties stated explicitly. Hold every book at
   guidance altitude: how to decide with entry and exit criteria, never
   step-by-step scripts. Apply the domain-books-replace-agents rule at
   admission: a domain side-agent proposal lands as a book opened by any
   leader, never as a new agent; the owner-decided language-book example
   stands settled as a book under this rule.

3. **Equipment policy.** The doctrine ships no equipment of its own. Books
   equip through the golden-equipment loadout computed for their USED
   pair; the doctrine checks the log, never builds it. Unverified
   equipment is recorded with a null command and
   `verification: unverified`, never with a guessed command.

4. **Context contract.** Reads: the candidate book, the gate, the
   rejection log, and the reclassification audit. Writes: the gate
   verdict and the log line, through the gate procedure only. Reads
   the R2 overlap carry note where overlap appears, and installs
   nothing from it.

5. **Verification commitments.** Every admission quotes the six-part
   check, the pairwise gate comparison, and the log line written.
   Control T8 holds on every review: plan review and build acceptance
   run the new-window ritual with the book re-read, and the verdict
   cites the fresh read. A book admitted without a gate line is not
   admitted.

6. **Failure contract.** A candidate missing a part or its non-duties is
   refused with the missing element named. A candidate identical to
   another except its name is rejected under the gate with the matching
   position logged. A review run from memory is refused under T8 until
   the new-window re-read lands.

## Outputs

- A six-part admission check per candidate book.
- A differentiation verdict per pair, with the rejection log line.
- A book-instead ruling per domain proposal, citing the settled example.
- T8 review verdicts, each citing the fresh re-read.

## Failure Modes

- Incomplete book: refuse admission and name the missing part.
- Copy-except-name: reject under the gate and log the matching position.
- Domain agent proposal: reroute to a book and cite the settled example.
- Memory review: refuse under T8 until the new-window re-read lands.
