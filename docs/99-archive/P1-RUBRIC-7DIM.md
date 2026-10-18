# P1-RUBRIC-7DIM — 7-dimension audit rubric

Lane VTA-FACTORY-EXECUTE, phase P1. Node `p1-rubric` (wave 0; prose spec, no eval content). Owner `vantrilex-librarian`.
Date (UTC) 2026-10-17. Kit version not named in the dispatch; no version-qualified catalog claim is made below.
Inputs R2 bundle via `git show wt/vta-factory-08:VTA-FACTORY-08-R2-method.md` (read-only), `WORKFLOW.md` Part B, and a `vs-supabase EVALS.md` lookup (read-only attempt, absent — see Derivation).
No evals run here; cohorts apply this rubric. English only; zero secrets.

## Derivation

D1–D6 are found-in-source. Source R2 `§2.5` names the closest adjacent artifact as `skills/skill-creator/agents/analyzer.md` (REACHABLE, fetched 2026-10-16) and quotes its six suggestion categories as `instructions`, `tools`, `examples`, `error_handling`, `structure`, `references`, with three priority levels `high`, `medium`, and `low`. The same section records that no seven-dimension audit shape was found in any fetched skill-creator material, so the priorities are triage levels, not audit dimensions, and the seventh dimension below is not claimed as found-in-source.

D7 is ruled-by-lane, never found-in-source. It is defined by this lane as trigger-precision (false-friends resistance plus description-improver optimization), grounded in skill-creator loop step 3 (create a few test prompts and run with-skill versus baseline) and step 8 (run the skill description improver to optimize triggering), plus the brief-given `vs-supabase` 4/4 precedent. The `vs-supabase EVALS.md` file was looked up live on this seat on 2026-10-17 by filename search across the worktree and by branch-tree listing on `wt/vta-factory-08`, `wt/vta-factory-p0`, and `main`; no such path exists on any of them, so the 4/4 figure is carried as brief-given, not as fetched-live. D7 therefore ships as a lane rule with its derivation stated here, not as a source discovery.

## Dimensions

### D1 — instructions

Criteria: the skill tells the model what to do and how to do it in the order it will be done, with no missing step, no contradictory directive, and no placeholder where a decision is required. Scope, inputs, outputs, and failure behavior are stated in prose the grader can quote. Pass/Fail rule: PASS only if every quoted instruction is executable as written and no line defers a required choice to the reader; otherwise FAIL and quote the offending line.

### D2 — tools

Criteria: every tool, script, command, and MCP surface the skill needs is named by its exact path or exact invocation, with its precondition and its expected result, and nothing the procedure requires is left unnamed or named only by paraphrase. Pass/Fail rule: PASS only if each tool reference resolves to a real surface the grader can quote by line; otherwise FAIL and quote the unresolvable reference.

### D3 — examples

Criteria: the skill carries at least one realistic worked example showing a real prompt, the expected shape of a good result, and where a weak result goes wrong, so a grader can distinguish application from mimicry. Pass/Fail rule: PASS only if the example is concrete enough to grade against with quoted lines; otherwise FAIL and quote what is generic or missing.

### D4 — error_handling

Criteria: the skill names its foreseeable failure modes, states what the model must do when each occurs, and never leaves an error path silent, retried without limit, or escalated without a named recipient. Pass/Fail rule: PASS only if each named failure has a bounded recovery or an explicit stop with its evidence quoted; otherwise FAIL and quote the uncovered path.

### D5 — structure

Criteria: the skill follows the required `SKILL.md` shape with one top-level heading, the mandated sections in order, and progressive disclosure so the model loads detail only when the task needs it. Pass/Fail rule: PASS only if the file shape matches the format law and every section boundary is quotable; otherwise FAIL and quote the structural break.

### D6 — references

Criteria: every external claim, linked file, and cited surface in the skill resolves to a reachable source quoted by address and line, with no recalled URL, no paraphrased path, and no dangling pointer. Pass/Fail rule: PASS only if each reference was observed live or is marked `unverified` with its reason; otherwise FAIL and quote the unresolvable reference.

### D7 — trigger-precision

Criteria: the skill triggers exactly when it should and stays silent otherwise, demonstrated by near-miss negatives (false friends sharing keywords but needing something different) and by a description tuned through the description-improver loop, per the lane rule in Derivation above. Pass/Fail rule: PASS only if should-trigger queries fire, should-not-trigger near-misses stay silent, and the description line responsible is quoted; otherwise FAIL and quote the misfire or the untuned line.

## Scoring contract

Per-skill row shape is one row per skill with exactly these fields in order: skill id, D1 verdict, D2 verdict, D3 verdict, D4 verdict, D5 verdict, D6 verdict, D7 verdict, overall verdict. Each D-verdict is exactly `pass` or `fail` lowercase. Overall is exactly `green` or `non-green` lowercase. Overall is `green` ONLY if all seven D-verdicts are `pass`; any single `fail` forces `non-green` with no exception, no weighting, and no rounding.

| skill id | D1 | D2 | D3 | D4 | D5 | D6 | D7 | overall |
|---|---|---|---|---|---|---|---|---|
| `example-skill` | pass | pass | pass | pass | pass | pass | pass | green |
| `example-skill` | pass | pass | pass | pass | pass | pass | fail | non-green |

The table above is the shape contract only; no cohort skill is graded here.

## Grader instructions

Evidence over assertion on every verdict. The grader reads the skill file live, quotes the exact line that decides each dimension, and attaches the quote to the verdict. A dimension with no supporting quote is a failed dimension with the reason written, never a silent pass. A claim traced to memory is not evidence. When a required surface is absent, unrunnable, or denied on the grader seat, the grader stops that line of checking, records the check as failed with the missing surface and the exact command or path that could not run, marks the dependent claim `unverified` with the reason beside it, and escalates with the tool, the command, and its output. The grader never invents an id, a version pin, a command, a count, or a verification result.

## Iterate rule

Fail means minimal rewrite then re-grade, at most two rounds. Round 1 grades the cohort skill against D1–D7 and records one row per skill. Every `fail` cell names the quoted line and the smallest edit that would resolve it. The owner applies the smallest rewrite that resolves the finding and nothing more. Round 2 re-grades only the failed dimensions against the rewritten lines plus a full-trigger recheck on D7. If any dimension still fails after round 2, the skill ships as `non-green` with its row attached and escalates to the dispatcher; no third rewrite runs on this node. Cohorts apply this rubric; this file runs no evals.

## Evidence

R2 source fetch (read-only, quoted with exit):

```text
git show wt/vta-factory-08:VTA-FACTORY-08-R2-method.md
EXIT:0
OBSERVED: §2.5 defines six suggestion categories plus three priorities and records no seven-dimension shape as found
```

`vs-supabase EVALS.md` lookup (read-only attempt, quoted with result):

```text
worktree filename search plus branch-tree listing on wt/vta-factory-08, wt/vta-factory-p0, main
RESULT:absent on all three; carried as brief-given 4/4 precedent, not fetched-live
```

Lint gate for this file is quoted in the dispatch report (`npx --yes markdownlint-cli P1-RUBRIC-7DIM.md`, exit 0); no eval, no registry write, no commit or push.
