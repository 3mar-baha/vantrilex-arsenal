---
name: red-team
description: Use when a plan, design, or diff needs an adversarial attack before it ships, so the holes are found by someone whose job is to find them rather than by production.
---

# Red Team

## Purpose

Attack the work on purpose before it ships, from a role whose only output is the list of ways it
fails. The owner idea (وكيل الفريق الأحمر) is an adversary, not a reviewer: a reviewer asks
whether the work is good, an attacker asks what the work is assuming and then attacks each
assumption.

This skill has two halves. `.opencode/agent/red-team.md` is the adversarial **role** — it holds
no edit permission and produces findings only. This skill is the **procedure** that decides when
to run that role, what to hand it, and what to do with what comes back.

Interpretation, stated plainly: an attack is only useful if the attacker is independent of the
author and is rewarded for finding holes. So the attack is delegated to a subagent with `edit:
deny`, the findings are ranked by damage rather than listed flat, and every finding carries the
concrete path that makes it real.

## When to Use

- A plan or design is about to be approved, before implementation begins.
- A change is complete and passing its own tests, before merge or release.
- The change touches permissions, money, deletes, migrations, or anything irreversible.
- A third party consumes this output and misreading it has a cost.
- The author has already invested in the solution, which is exactly when blind spots peak.

## Do NOT use

- As a substitute for the owning reviewer's gate verdict. The red team finds holes; it does not
  pass or refuse a phase exit, and it cannot certify its own findings as accepted.
- On a change that is still being discovered. Attacking a half-formed idea wastes the attack.
- On mechanical work. A rename covered by a passing test does not need an adversary; name the
  test instead.
- As a budget for endless rounds. Two rounds is the default: one attack, one re-attack on the
  fixes. A third round is scope creep wearing a costume.
- On your own work, unreviewed by anyone else. Self-attack reliably finds style and reliably
  misses the assumption you cannot see.

## Inputs

- The artefact under attack: plan, design, diff, or spec, at a specific commit or path.
- The threat lens, chosen before the attack starts, not after. Pick at least one: misuse, data
  loss, concurrency, failure of a dependency, boundary condition, abuse of a trust assumption.
- What the change must never do, written as invariants.
- The verification that currently passes, so the attacker knows what has already been ruled out.

## Procedure

1. **Fix the target.** Name the exact artefact and commit. An attack on a moving target produces
   findings nobody can act on.
2. **Write the invariants first.** Three to five statements of what must hold when the work is
   done. The attacker attacks these before it attacks anything else, because violating an
   invariant is the finding that matters.
3. **List the assumptions.** Ask the author what the work assumes about scale, concurrency,
   ordering, permissions, third-party behaviour, and time. Each assumption is an attack surface.
4. **Choose the lens** and hand it to the subagent together with the target, the invariants, the
   assumptions, and the lens. Do not summarise the target; hand over the artefact itself, because
   a summary hides exactly what the attack needs.
5. **Dispatch the red-team subagent** (`.opencode/agent/red-team.md`). It holds `edit: deny`, so
   it can read, run, and observe but cannot change the work.
6. **Demand the finding shape.** Every finding names the invariant or assumption it breaks, the
   concrete path that triggers it, and the damage if it fires. A finding without a triggering
   path is a hunch and is returned.
7. **Rank by damage.** Order findings by what they cost when they fire, not by how interesting
   they read. Put the cheapest-to-fix, highest-damage finding first: that is the one worth doing
   next.
8. **Triage in public.** Each finding is **accepted** (fix it), **known** (recorded, deferred,
   with the condition that would revisit it), or **refuted** (with the evidence that refutes it).
   A finding is never silently dropped, which is how a real hole dies without ever being discussed.
9. **Re-attack once** on the accepted fixes, to confirm the hole closed and to check the fix did
   not open a neighbouring one.
10. **Archive the report.** Findings, triage, and the round count land in the change's own record
    so the next author inherits the attack history.

## Outputs

- An attack brief: target at a commit, invariants, assumptions, chosen lens.
- A findings report from the red-team subagent, each finding with a triggering path and a damage.
- A triage table: accepted, known, or refuted, with evidence for every refutation.
- The re-attack result on the accepted fixes, and the round count.

## Failure Modes

- **Style findings.** "Could be clearer" is not a finding. Without a triggering path and a
  damage, the attacker is doing code review badly. Return it.
- **Speculation.** "This might break under load" with no path is a hunch. Ask for the path or
  drop it; an unprovable finding costs triage time and buys nothing.
- **The attacker edits.** The role has `edit: deny` for a reason. An attacker that fixes what it
  finds has become the implementer and the review of that fix is now unreviewed.
- **Invariants never written.** Without them the attacker has no definition of failure and
  returns opinions. This is the most common cause of a hollow red-team round.
- **Findings ignored because they are inconvenient.** An unaccepted finding with no written
  reason is a defect in the change's record, not in the finding.
- **Endless rounds.** Two rounds. If the third is proposed, the change needs re-scoping, not
  another attack.
