# P2 Polish Checklist

Agent-polish rules for the P2 cohorts. Every cohort applies every item
below to every agent row in its set, and records the verdict per agent
with evidence. A ledger-only pass renames nothing and writes no
registry rows: it checks, records, and stops. No model pin appears in
this file, and English only throughout.

## Identity rules

- [ ] The agent id is lowercase and matches `vantrilex-*`. Zero
  uppercase side-agent ids remain in the cohort set.
- [ ] Leader display names stay Title-case and untouched. Polish never
  renames, re-cases, or edits a leader display name.
- [ ] The file stem equals the frontmatter `name` for every agent
  definition (stem check green).
- [ ] The folder name equals the frontmatter `name` for every skill
  definition (folder check green).

## Mode and worker rules

- [ ] Every side agent carries `mode: subagent` in frontmatter.
- [ ] Every side agent carries a worker-only line: never leads, never
  dispatches, never approves its own report.
- [ ] No side agent plans missions, acts as primary, or accepts
  cross-role work.

## Pin and secret rules

- [ ] Zero model pins: no `model:` key and no model selector appears in
  any new or polished definition.
- [ ] Zero secrets: no committed file carries a real credential value.
- [ ] Zero unfinished-work markers: no `TODO`, no `FIXME`, no stub
  sections, no coming-soon prose.

## Intake cap rules

- [ ] Uploader count equals 1: `.opencode/agents/vantrilex-uploader.md`.
- [ ] Puller count equals 1: `.opencode/agents/vantrilex-puller.md`.
- [ ] Intake skill count is between 1 and 4 inclusive, each covering
  fetch, send, or handling with its own earned purpose.
- [ ] Intake direction is SEND-only with 0 receive paths stated in every
  intake definition.
- [ ] Human sign-off before admission is stated in every intake
  definition: the Omar review record precedes any admit step.

## Format rules

- [ ] Every `SKILL.md` carries frontmatter with exactly `name` plus
  `description`, then body sections Purpose, When to Use, Do NOT use,
  Inputs, Procedure, Outputs, Failure Modes, in that order.
- [ ] Every agent frontmatter carries `name`, `description`, and `mode:
  subagent` with the name identical to the file stem.
- [ ] Markdownlint on every new or polished file exits 0.
- [ ] Every relative link in every touched file resolves to a file that
  exists.

## Cohort recording rules

- [ ] One ledger row per agent with the check results quoted, not
  summarised.
- [ ] Every FAIL names its triggering path with file and line evidence.
- [ ] No rename applied and no registry write made by any eval cohort;
  the admit node owns all writes as single writer.
- [ ] The cohort totals reconcile: rows counted equal agents assigned,
  and cap counts are quoted (uploader equals 1, puller equals 1, skills
  between 1 and 4).
