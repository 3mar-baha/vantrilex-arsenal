---
name: vs-golden-equipment
description: Use when a leader needs doctrine-fitted equipment — computes the loadout from USED origin-by-task-class pairs, cites the matching payload template, and ships zero invented install commands.
---

# Golden Equipment

## Purpose

Fit every leader with doctrine-computed equipment so outfitting stops
depending on picker taste. The doctrine fixes the USED origin-by-task-class
pairs, owns the payload templates for those pairs first, and computes one
logged loadout per run that the origin confirms by dispatch.

## When to Use

- When a wave, plan, or probe needs its equipment loadout computed.
- Whenever a USED pair must resolve to its payload template first.
- When a loadout log must be written before the origin confirms by dispatch.
- Before any run that claims doctrine-fitted equipment.

## Do NOT use

- As a picker by feel. Scoring by adoption or taste belongs to the old
  intuition lane; this doctrine computes from USED pairs and templates.
- As a template for an unused pair. A pair with no observed use gets no
  template until use is proven, because theory templates rot unread.
- To invent a command. A missing install vector is recorded with a null
  command and `verification: unverified`, never guessed.
- To install anything. This skill ships no install command; where the R2
  company-skill set appears to overlap, both are carried verbatim and
  nothing is installed.

## Inputs

- The USED pair table in the Procedure below.
- The payload template matching the run pair under `.opencode/craft/payloads/`.
- The selected seat from `.opencode/craft/seats/`, carrying model plus
  variables.
- The origin dispatch confirm that closes the loadout.

## Procedure

Naming truth, fixed verbatim: USED pairs are observed origin-by-task-class
pairs with proven runs behind them. Templates exist for USED pairs first
only. Compute loadouts in the six parts below, in order.

1. **Identity, including non-duties.** The doctrine is the equipment
   fitter: keeper of the USED table, the templates, and the loadout log
   shape. Non-duties, stated explicitly: the doctrine does not direct a
   wave, does not author a plan, does not run a probe, does not govern
   books, and does not install anything.

2. **Instruction pack.** Resolve the run to one USED pair first: Blazar
   with build, Aether with plan, Pulsar with probe. Load the matching
   payload template and fill it from the book, the seat, and live state.
   Write the computed loadout log, then hold: the origin confirms by
   dispatch before anything equips. An unlogged loadout never equips.

3. **Equipment policy.** Equipment comes from the kit already on the
   machine, verified by read-back before use. The doctrine carries zero
   install commands of its own; a template field without a verified
   vector records a null command with `verification: unverified`.
   A guessed command is a failed loadout.

4. **Context contract.** Reads: the USED table, the matching template,
   the book, and the seat. Writes: the computed loadout log only.
   Reads the R2 overlap carry note where overlap appears, and installs
   nothing from it.

5. **Verification commitments.** Every loadout quotes its USED pair, its
   template name, its book, and its seat with model plus variables. The
   origin dispatch confirm is quoted beside the log. A run that cannot
   name its pair is refused before computation starts.

6. **Failure contract.** An unused pair gets no template: record the
   request and stop, never draft theory. A loadout without a log is
   refused. A log without origin dispatch confirm stays pending and
   equips nothing. A guessed command fails the loadout on the spot.

## Outputs

- One computed loadout log per run, quoting pair, template, book, seat,
  and equipment.
- A USED-pair resolution line naming the run pair.
- An origin dispatch confirm closing the log.
- A pending record for any unused-pair request, with no template drafted.

## Failure Modes

- Unused pair: no template, request logged, computation stopped.
- Log-less loadout: refused before anything equips.
- Unconfirmed log: pending, nothing equips until the origin dispatches.
- Guessed command: loadout failed, vector recorded null with its reason.
