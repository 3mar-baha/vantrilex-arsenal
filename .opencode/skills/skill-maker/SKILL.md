---
name: skill-maker
description: Use when a repeated job needs a reusable skill, so stop improvising the procedure and forge it through small evals before the next run.
---

# Skill Maker

## Purpose

Skill Maker forges reusable OpenCode skills through the Anthropic
skill-creator loop, the sole method source for this skill. That source
is the `skill-creator` skill at `skills/skill-creator/SKILL.md` inside
the public Agent Skills repository, distributed under Apache-2.0. No
other method is admitted here; where this file ends, the work
escalates instead of inventing a second method.

A skill is a folder of instructions a model loads to do one recurring
job better. The loop this skill runs turns a rough intent into a
packaged skill through drafting, small evals, grading, iteration, and
a final trigger pass. The loop is the product: a skill that never ran
it is a draft, never a skill.

Targets are OpenCode-shaped. Every emitted `SKILL.md` carries the
OpenCode frontmatter subset: `name` plus `description` are required,
and `allowed-tools` and friends are silently ignored by the router.
The `description` states why the skill loads, never what it contains.
The file stays under 500 lines. The stem `skill-maker` is plan-given;
the naming-law tension is recorded for review, never improvised here.

## When to Use

- A job repeats with the same steps and the same mistakes each time.
- The owner asks for a new skill or for an existing skill to improve.
- A draft skill exists but has never been run against real prompts.
- A skill triggers at the wrong time or stays silent when needed.
- Grading shows the skill helps on some prompts and hurts on others.

## Do NOT use

- To equip a project or select a kit. That belongs to project setup;
  this skill consumes an equipped project and never selects it.
- To author agent definitions. That belongs to `agent-maker`; a maker
  run that emits an agent file has left scope.
- To invent method. The nine stages under Procedure are the method;
  a run that replaces them with a shorter loop is not a shortcut.
- To ship a draft without evals. An unevaluated skill is unfinished;
  packaging it anyway fails the close gate.
- To carry secrets, model pins, or install commands. A skill that
  needs a secret escalates; a command is verified or marked
  `unverified`, never guessed.
- To exceed 500 lines. A skill past that bound is split or cut;
  length is never the fix for weak triggering.

## Inputs

- The intent: what the skill must do and roughly how it should do
  it, in the owner's words.
- Two to three realistic test prompts: things a real user would say,
  saved with id, prompt, expected output, and files. Assertions come
  later, while the runs are in flight.
- The baseline rule for the run: a new skill runs against no skill
  at all; an improved skill runs against a snapshot of the old
  version. Both arms launch in the same turn.
- Grading assertions per test case, drafted while the runs proceed.
- The owner's qualitative verdict after each iteration, plus the
  quantitative grades the loop produces.

## Procedure

Run S.1 through S.9 in order. Each stage consumes the previous
stage's output; a stage with nothing to consume is reported, never
guessed at.

### S.1 — Decide what the skill does

Quote the source stage: "Decide what you want the skill to do and
roughly how it should do it". Record the intent in one paragraph:
the recurring job, the boundary of the skill, and the rough shape
of the procedure. A vague intent is returned for one more sentence
before anything is drafted.

### S.2 — Write a draft

Quote the source stage: "Write a draft of the skill". Draft the
`SKILL.md` in the repo eight-part shape this file uses: Purpose,
When to Use, Do NOT use, Inputs, Procedure, Outputs, Failure Modes,
plus the title. Keep the frontmatter to the OpenCode subset: `name`
equals the folder name, `description` is imperative, slightly pushy,
and states why the skill loads rather than what it contains. Stay
under 500 lines from the first draft.

### S.3 — Create test prompts and run with skill

Quote the source stage: "Create a few test prompts and run
claude-with-access-to-the-skill on them". Write two to three test
prompts a real user would say. For each prompt, launch both arms in
the same turn: one run with the skill, one baseline run without it
(or against the snapshotted old version when improving). Same-turn
launch matters because staggered runs finish under different
conditions and the comparison rots.

### S.4 — Help the user evaluate qualitatively and quantitatively

Quote the source stage: "Help the user evaluate the results both
qualitatively and quantitatively", including "Use the
`eval-viewer/generate_review.py` script to show the user the
results". Grade each run against the assertions, aggregate the
grades, and show both views: the owner's read of what felt wrong
and the numbers on what scored wrong. Neither view alone closes
the stage.

### S.5 — Rewrite from the evaluation

Quote the source stage: "Rewrite the skill based on feedback from
the user's evaluation of the results". Apply the feedback to the
skill: tighten instructions that misfired, add the missing example,
cut the section nobody used. One rewrite per iteration, attributed
to the feedback that caused it.

### S.6 — Repeat until satisfied

Quote the source stage: "Repeat until you're satisfied". Rerun all
test cases, including baselines, into a new iteration directory.
Grade again, show the viewer again, and rewrite again. Stop only
when the owner says the skill is good, the feedback comes back
empty, or further passes make no meaningful progress.

### S.7 — Expand the test set and try larger scale

Quote the source stage: "Expand the test set and try again at
larger scale". Widen beyond the first two to three prompts toward
edge cases and near-misses. Confirm the skill still helps where it
should and stays silent where it should not.

### S.8 — Run the description improver

Quote the source stage: "run the skill description improver ... to
optimize the triggering of the skill". Generate a mix of
should-trigger and should-not-trigger queries, with the
should-not-trigger half weighted toward near-misses that share
keywords but need something else. Rewrite the `description` until
it fires on the first half and stays quiet on the second. The
description carries the why, never the what.

### S.9 — Package the final skill and return it

Quote the source stage: "Package the final skill and return it to
the user." Ship the folder with its final `SKILL.md`, its test
set, and its last grades. State the method source, the iteration
count, and the final trigger result. A package without those three
is returned unfinished.

## Outputs

- The final skill folder with its `SKILL.md` in the eight-part
  shape, under 500 lines, frontmatter `name` equal to the folder.
- The test set of two to three prompts at minimum, with ids,
  prompts, expected outputs, files, and the assertions used.
- The with-skill versus baseline grades per iteration, plus the
  owner's qualitative verdict that closed each round.
- The trigger report from S.8: which queries fired, which stayed
  quiet, and what the final `description` changed.
- Nothing else. The maker forges the skill and its evidence; it
  registers no catalog entry and touches no lock.

### Worked example end to end

Task: forge a changelog-drafting skill for release notes.

S.1 records the intent: draft release notes from commits, roughly
by grouping conventional commits and flagging breaking changes.
S.2 drafts the `SKILL.md` in the eight-part shape with a pushy
why-line description. S.3 writes three prompts a releaser would
say and launches with-skill and baseline arms in the same turn.
S.4 grades the drafts and shows the review output beside the
owner's read. S.5 rewrites the grouping rule the grades blamed.
S.6 repeats twice until the owner accepts and the grades hold.
S.7 adds near-miss prompts about unrelated docs edits. S.8 tunes
the description until it fires on releases and stays quiet on
docs. S.9 packages the folder with tests and grades attached.

## Failure Modes

- **Vague intent accepted.** The draft solves three jobs at once and
  triggers on none cleanly; return S.1 for one more sentence.
- **Staggered baselines.** With-skill runs finish before baselines
  start and the comparison rots; relaunch both arms same-turn.
- **Assertions written too late.** Runs finish with nothing to grade
  them against; draft assertions while runs proceed, never after.
- **Numbers without the owner.** Grades pass and the skill still
  feels wrong in use; the qualitative verdict is missing, get it.
- **Owner approval without numbers.** The skill feels right and
  grades worse than baseline; both views must close S.4.
- **Iteration without attribution.** A rewrite lands with no linked
  feedback; name the feedback or revert the edit.
- **Scale skipped.** Three prompts pass and the fourth real prompt
  misfires; run S.7 before packaging.
- **Keyword description.** The description lists contents instead of
  purpose and fires everywhere; run S.8 until near-misses stay
  quiet.
- **Unverified command shipped.** An install line looks plausible
  but resolves nowhere; mark it `unverified` or cut it.
- **Overlong skill shipped.** The file passes 500 lines and the fix
  proposed is more text; split or cut instead.
