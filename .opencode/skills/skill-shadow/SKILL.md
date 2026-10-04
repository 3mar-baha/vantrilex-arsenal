---
name: skill-shadow
description: Use when a component's procedure is about to be adopted or trusted but has never been run against real work, so it can be rehearsed in shadow mode and scored before it touches anything.
---

# Skill Shadow

## Purpose

Run another skill's procedure in shadow mode: same steps, real inputs, zero effect on real work,
and every output collected for comparison. The owner idea (ظل المهارة) is a rehearsal of a
procedure before the procedure is trusted with consequences.

Interpretation, stated plainly: the risk of an unfamiliar procedure is not that its steps look
wrong, it is that its steps are wrong in a way only real input exposes. So the shadow run uses
the actual artefact as input, executes the target skill's procedure as written, and writes every
result to a scratch location. Nothing the target procedure would have changed in the real system
is changed. The comparison the shadow exists to produce is: what the procedure produced, against
what the real work actually needed.

## When to Use

- A procedure is about to be adopted and has never been run on this project's data.
- A procedure has changed since it was last used, and its outputs must be trusted again.
- The procedure triggers irreversible or outward-facing effects: sends, publishes, deletes,
  merges, deploys, spends.
- A procedure's author claims it produces a specific artefact, and nobody has checked the claim.
- Two candidate procedures both claim the same job, and the tie-break needs evidence.

## Do NOT use

- To evaluate a component's fitness in general. `kit-evaluation-journal` is the ledger for that;
   this skill produces one comparison run, not a durable verdict.
- As a substitute for running the procedure for real once. A shadow run proves nothing about
  production behaviour; it defers the real run, it does not replace it.
- On a procedure whose steps cannot be executed without effect. Some procedures are all effect.
  For those, shadow the decision step and simulate the remainder on a copy.
- To justify skipping the real run because the shadow looked good.

## Inputs

- The target skill or procedure, by name, at a specific version. Its steps as written, not as
  remembered.
- A real input artefact: the actual document, diff, config, or dataset the procedure will face.
- The scratch location for shadow outputs. It must be outside the worktree of any live branch.
- The declared contract: what artefact the procedure claims to produce, and the acceptance test
  that would prove it.

### Shadow rules

These are what make it a shadow rather than a dry run with optimistic naming:

1. **Real input, copied.** The input is the real artefact, duplicated into the scratch location.
2. **Write only inside the scratch location.** Every file the procedure produces lands there.
3. **Simulate every effect.** Sends, publishes, merges, deletes, and network calls are logged as
   intended actions with their arguments, not executed.
4. **Record every deviation.** When the procedure has to bend to make progress, that bend is the
   most valuable thing the shadow produces. Never quietly repair it.
5. **No repair pass.** The shadow is not improved afterwards. What the procedure produced is the
   measurement.

## Procedure

1. **Name the target and the version.** A shadow of an unspecified procedure cannot be repeated.
2. **Copy the real input** into the scratch location and confirm the copy is what the procedure
   will actually be handed.
3. **Write the shadow rules down** in the run header, so the log says what was not executed.
4. **Execute the target procedure step by step, as written.** Follow it literally. If a step is
   wrong, wrong instruction, or ambiguous, execute it as best it can be read and mark it in the
   log; improving the procedure mid-shadow destroys the measurement.
5. **Log each intended effect** instead of performing it: the call, its arguments, and what it
   would have changed.
6. **Record every deviation** with the step number, what the procedure said, what it required, and
   which one was followed.
7. **Check the declared contract.** Run the acceptance test against the shadow output. This is the
   measurement: contract met, or contract missed.
8. **Diff against reality.** Compare the shadow output to what the real work needed. Where they
   differ, the difference is either a defect in the procedure or a defect in the task framing.
   Say which, with evidence.
9. **Score and file the run.** Record rubric scores with their evidence in the kit evaluation
   journal, under this component's registry id. The shadow run is the evidence the entry cites.
10. **Decide one of three outcomes.** Run for real on the next live task with a named watcher.
    Rewrite the procedure first, then shadow again. Retire it.

## Outputs

- A shadow run log: target, version, input copy, and the shadow rules in force.
- The shadow output artefacts, all inside the scratch location.
- An intended-effects log: each suppressed call with its arguments.
- A deviation list, each entry naming the step, the instruction, and what was actually done.
- The contract verdict: met or missed, with the acceptance test's output.
- A journal entry carrying the scores this run earned.

## Failure Modes

- **The shadow leaks.** A procedure that writes outside the scratch location has performed a real
  effect. Stop immediately, report what was touched, and treat the run as contaminated: its
  comparisons are not evidence of anything.
- **The procedure gets quietly improved** mid-run. The improved version was never measured, and
  the deviation is now invisible. Deviations are the output; repairing them destroys the reason
  for shadowing.
- **Simulated input instead of real input.** A hand-made clean fixture proves the procedure works
  on clean input, which was never in doubt.
- **Shadow used as a green light.** A green shadow authorises the first real run with a named
  watcher; it does not authorise skipping it.
- **The run has no contract to check.** Without a declared artefact and acceptance test, step 7
  has nothing to measure and the shadow degrades into a walkthrough.
- **Infinite shadowing.** Two runs. If a third is proposed, the procedure needs a rewrite rather
  than more rehearsals.
