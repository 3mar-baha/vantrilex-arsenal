---
name: vs-asterism-muster
description: Use when a Vantrilex side agent (vantrilex-*) must open a task, to compile the per-task complement — at least 5 skills and 2 countable MCPs per task, measured cumulatively across the task's phases (D48) — into a compiled selection with the rank, priorities, and the paste-ready client config for the selected MCPs.
source: 3mar-baha/vantrilex-arsenal
---

# Asterism Muster

Naming truth, fixed verbatim: the name is Vantrilex, the rank is Asterism,
and the user-facing display is Vantrilex. Asterism
(/ˈæs.tə.rɪz.əm/ — a distinctive star pattern) is the rank of the side
agents: the `vantrilex-*` ids in `.opencode/agents/` (`vantrilex-implementer`,
`vantrilex-scout`, and the rest), lowercase (naming law stands). The
`vs-asterism-*` prefix derives from the rank Asterism and marks forcing
skills that belong to the Asterism rank alone, never a generic lead mark.
The `vs-asterism-muster` forcing skill is one of the three forcing skills
kept by decision D47 (G-01, 2026-11-10); D52 (G-06) fixes how it is consumed
— a skill file compiled into the dispatcher's prompt text at call time,
advisory only.

SPECIAL CONSTRAINT — depth-1 subagents. A side agent's session runs at
depth 1: it is dispatched by a leader and it does not dispatch further.
The whole selection must therefore be computable in ONE pass from the
catalogue plus `priority` alone, by the invoking side agent itself. No step
in this skill may ask another agent to shortlist, rank, refuse, or veto a
candidate — there is no "ask another agent to shortlist" step and never will
be. If the algorithm as written cannot be executed in one pass from the
catalogue and `priority`, the algorithm is wrong: rewrite it, do not work
around it, and never route the shortlist through a second agent. A revision
of this file that needs a second agent is a defect, not a feature.

There is no branch on the invoking caller. The invoking side agent's id is
recorded in the output; the rank, the floor, and the output shape do not
change with the caller.

## Purpose

Compile the per-task complement for an Asterism task from the catalogue.
Asterism (rank: `asterism`) needs at least 5 skills and 2 countable MCPs
per task, measured across the whole task's phases, cumulatively — not per
phase, and not per seat (decision D48, 2026-11-10). This skill runs once,
at the start of an Asterism task, and emits a compiled selection — never a
loose list of names: the rank, the selected skills with priorities, the
selected countable MCPs with priorities, and the paste-ready client config
for the selected MCPs. It is a config emitter, not a namer.

## When to Use

- Once, at the start of an Asterism task, after the task is dispatched to a
  side agent and before the first phase work begins — the moment the
  per-task complement is fixed.
- Whenever a side-agent task's phase kit must be reconciled with the
  per-task cumulative minimum (a new phase, a re-plan, a resumed
  checkpoint).
- When a selection was refused under D54 or came in below minimum and must
  be recompiled from the catalogue.

## Do NOT use

- For any rank other than asterism. The syzygy and zenith musters serve
  other ranks. Do not rename the rank, do not re-case it, do not alias it.
- For a caller whose dispatch names no invoking side agent, or names an id
  outside the lowercase `vantrilex-*` side agents. Such a dispatch is
  refused with the blocker stated; never default the caller to one side
  agent, and never emit a selection the dispatch did not ask for.
- To dispatch, spawn, or route work. This skill emits a selection and stops.
- To ask a second agent to shortlist, rank, or veto candidates. The
  depth-1 constraint above is absolute: one pass, from catalogue plus
  `priority`. A selection that needed a second agent is not emitted.
- To write the catalogue, edit `registry/data/*.jsonl`, or admit components
  to the registry. The registry changes through its own governance items.
- To declare the minimum met. The checker is separate and read-only (D50,
  2026-11-10): the verify-catalog selection gate against the selection
  record, then a read-only verifier on the runtime receipt once one exists.
  Never self-certify.
- To invent an `install_cmd`, a version pin, a transport, or a health check.
  Unverified stays unverified; unknown stays unknown.
- After a third failed selection. At that point the only correct move is the
  D51 report, not another pass.

## Inputs

- The task text and the task's phase list (scout, docs, plan, build, review,
  operate) as dispatched.
- The invoking side agent, named in the dispatch by its lowercase
  `vantrilex-*` id. It is recorded in the output; it selects nothing, and it
  is never inferred from the task text.
- The catalogue, read-only: `registry/data/skills.jsonl`,
  `registry/data/mcp.jsonl`, and the generated `registry/catalog.json`. This
  skill writes none of them.
- The selection context: `.opencode/equip.manifest.json`, read-only
  reference for what is currently selected; not edited here.
- The controlling rulings, all in `docs/15-DECISIONS.md`: D48 (per task =
  cumulative across phases; each rank's count counts that rank's own skills
  only; phase pruning does not reduce the per-task count), D50 (the checker
  is separate), D51 (re-select until success; three failed selections
  escalate to the leader), D54 (the countable-MCP definition), D47 (the
  forcing-skill family), D52 (the compiler pattern).
- The client MCP surface for the paste-ready config: the `mcp` object shape
  in the client's opencode.json — names, command or URL, args, transport, and
  environment variable NAMES only, never values.

## Procedure

1. **Fix the anchor and the rank.** Run once, at the start of the task. The
   rank is `asterism`. Every line of the output carries it; nothing widens
   or renames it. Resolve the invoking side agent from the dispatch's
   lowercase `vantrilex-*` id and record it. If the dispatch names no
   invoking side agent, or names an id outside `vantrilex-*`, STOP and
   report the blocker; the caller is never guessed.
2. **Derive the per-task requirement.** The floor is at least 5 skills and
   2 countable MCPs per task — the D48 bright-line minimum for the Asterism
   rank, cited here as D48 requires. Measurement is over the union of the
   task's phases, cumulatively: phases contribute to one shared count; there
   is no per-phase quota and no per-instant snapshot. Asterism's 5 counts
   only Asterism's own skills — the Asterism rank's forcing skills
   (`vs-asterism-muster`, and any future `vs-asterism-*` row) — never the
   Syzygy rank's skills (`vs-syzygy-muster`, `vs-at-plan-craft`,
   `vs-bl-build-craft`, `vs-pu-probe-craft`) and never Zenith's `vs-zenith-*`
   skills; both are excluded from that count (D48, 2026-11-10, "per task"
   = option (ii)).
3. **Select skills from the catalogue — one pass, no second agent.**
   Candidates are live catalogue rows of kind `skill` whose phase intersects
   the task's phases. Every candidate must resolve to a catalogue row; an
   installed skill with no row is never a candidate (see Failure Modes).
   Order candidates by `priority` ascending, 1 highest precedence; a row with
   a null `priority` is treated as 5 — the D48 bright-line midpoint — and the
   substitution is logged, never applied silently (D48 governs the minimum;
   the null-to-5 rule rides with it). Take the highest-precedence candidates
   until the floor is met. Every operation in this step is a read of the
   catalogue plus an ordering of rows by `priority` — a single pass,
   executable by the invoking depth-1 side agent alone. No shortlisting,
   ranking, refusal, or veto is ever delegated to another agent; if a
   candidate decision cannot be made from the catalogue row alone, the
   candidate is refused on its row's evidence, never on a second opinion.
4. **Select MCPs and apply the D54 test.** An MCP counts toward the minimum
   only when all four hold: (1) `version_pin` non-null; (2) resolvable
   package or URL — `install_cmd` non-null, or a `remoteUrl` for remote
   MCPs; (3) stated transport — `stdio`, `sse`, or `streamable-http`;
   (4) a passing last health check — recorded date plus result. The criteria
   are conjunctive: one failure makes the MCP not countable, and the first
   MCP required by the minimum must meet all four (D54, 2026-11-11).
   Candidates failing any criterion are refused and selection moves to the
   next candidate by priority. Honesty note: as of 2026-11-11 the registry
   records no transport field, no health-check record, and no `remoteUrl`
   anywhere, so the strict four-criterion countable count is 0 until the v5
   schema and health-check records land; the 7 rows that meet criteria 1+2
   (`filesystem`, `github`, `memory`, `sequential-thinking`, `context7`,
   `firecrawl`, `supabase-mcp`) must not be quoted as an all-four count. The
   muster reports the measured count, never rounds up.
5. **Wire each selected MCP.** For every selected MCP, emit its paste-ready
   client config block: name, transport, command or URL, args, environment
   variable NAMES (never values), and the source row id plus the evidence
   `checked_at` date that backs it. A selection whose MCP cannot be wired
   cannot be emitted at all.
6. **Count, gate, re-select.** Below 5 skills or below 2 countable MCPs —
   or any refused member — the selection is not emitted. Re-select from the
   catalogue, excluding refused candidates, up to 3 selections in total.
   Three failed selections: STOP, report "I chose a failed selection" to the
   leader (D51, 2026-11-10), listing the three attempts and the criterion
   each refused on. The leader — never this skill, and never the invoking
   side agent — dispatches a NEW side agent with the same name
   (`vs-asterism-muster`) to re-run the task with a fresh selection.
7. **Emit the compiled selection.** Emit rank, the invoking side agent,
   skill list, MCP list, and the config blocks (see Outputs). The emission
   states its own counts against the floor and ends with the D50
   disclaimer.
8. **Stop.** No dispatch, no registry writes, no admits, no minimum
   declaration, no further phases. The compiled selection is returned; the
   checker verifies it later, separately.

### Ladder

The in-band enforcement ladder for the per-task minimums (D64,
2026-11-11; the thresholds are the D48 bright-line minimums — Zenith
≥15 skills / ≥5 countable MCPs, Syzygy ≥10 / ≥4, Asterism ≥5 / ≥2 —
and the countable-MCP test is D54). Three rungs, in order:

1. **observe** — log which skills and MCPs the rank used, per task:
   the claim ledger (`.opencode/dispatch-log/<task-id>.jsonl`, D63)
   records the claims; what counts as "used" is D50's separate
   checker, never this ladder.
2. **warn** — at half the minimum reached, at the minimum reached, and
   at task closing below minimum, append one line to the tool output.
   The exact staple text:

   `[muster] rank <rank> has used <n>/<N> required skills, <m>/<M> required MCPs`

3. **handoff** — retry exhaustion per D51: after 3 failed selections,
   report to the leader, who dispatches a NEW side agent with the same
   name to re-run the task.

Wednesday runs at `warn`: **block is NOT active on Wednesday** — no
tool call is refused for a below-minimum count, and the ladder stays
advisory (D52). Promotion to `block` happens only after 10 measured
tasks show the receipt is accurate and the warn rung fires correctly
(D64). Until then the ladder informs; it never refuses. The checker
remains separate and read-only (D50): nothing in this ladder is a
verdict on the minimum.

## Outputs

- The compiled selection record, emitted as a text artifact in the side
  agent's output: rank `asterism`; the invoking side agent's `vantrilex-*`
  id; the selected skills in priority order — id, phase, tier, priority per
  line; the selected MCPs in priority order — id, transport, priority per
  line, each followed by its paste-ready client config block; the per-task
  count line (`skills selected: N (minimum 5, Asterism-own only, cumulative across phases per D48)` and
  `countable MCPs: M (minimum 2, D54 four-criterion test)`); the
  priority-null substitution log; the D54 verdict per selected MCP with the
  failing criterion named where one applied; and the note that the
  complement measures across the union of the task's phases, not per phase.
- The D50 line: the minimum is not declared met by this skill; the checker is
  separate (verify-catalog selection gate on the selection record now, a
  read-only verifier on the runtime receipt once it exists).
- When three selections fail: the D51 line "I chose a failed selection" with
  the three attempts and their refusal reasons.
- Nothing else. No dispatched agents, no catalog rows, no admits, no verdict
  on the minimum.

## Failure Modes

- **Invoking side agent missing or outside `vantrilex-*`**: refuse the
  selection, state the blocker, and escalate to the leader with the dispatch
  text; never guess the caller from the task text, and never emit a
  selection for an unnamed or non-side-agent caller.
- **Selection below minimum** (fewer than 5 skills, or fewer than 2
  countable MCPs in the union of the task's phases): not emitted. Re-select,
  excluding refused candidates, up to 3 selections; on the third failure,
  STOP and report "I chose a failed selection" to the leader (D51).
- **Selected MCP not countable** (any D54 criterion fails): refuse that MCP,
  name the failing criterion, and pick the next candidate by priority. No
  countable candidate left for an MCP slot means the selection is refused —
  never a partial complement, never an unwirable block.
- **A second agent was needed** (any step required a shortlist, ranking,
  refusal, or veto from another agent): refuse the selection and report the
  defect. The depth-1 constraint means the algorithm failed, not the side
  agent; the fix is a rewrite of the offending step to run from the
  catalogue plus `priority` alone — escalated as a blocker, never worked
  around by dispatching help.
- **Uncatalogued skill**: refuse it, never select it. The 16 installed
  skills with no catalogue row as measured 2026-11-11 (`.opencode/skills/`
  folders with no id in `registry/data/skills.jsonl`, unchanged by the W-09,
  W-10 and W-11 landings) must not be selected:
  `circuit-breaker-guard`, `github-release-packager`, `goal-discipline`,
  `relay-protocol`, `skill-maker`, `vantrilex-deep-understand`,
  `vantrilex-intake-fetch`, `vantrilex-intake-send`, `vantrilex-intake-triage`,
  `vs-circuit-breaker-guard`, `vs-github-release-packager`, `vs-ponytail`,
  `vs-preflight-system-doctor`, `vs-session-context-primer`,
  `vs-vantrilex-vanguard`, `vs-vantrilex-workflow-forge`. The row, not the
  disk, decides: a skill without a catalogue row can never enter a selection,
  however well known locally. The list rots; the rule does not — any future
  rowless folder is refused the same way.
- **Priority null**: treated as 5 and logged in the selection record;
  ordering uses the substituted value. A silent default is a defect.
- **Priority order violated**: the emitted order is the priority order,
  ascending, ties broken by catalogue id; the record states its ties. An
  impression-ordered list is refused.
- **Phase pruning conflicts** (a prune would drop the per-task union below
  the minimum): D48 governs — pruning happens for context economy, never to
  the per-task count; the minimum is measured over the union of the task's
  phases cumulatively, so a prune that would break the floor is refused for
  the components that carry it, and the conflict is flagged to the leader.
  Never prune the floor away to slim a phase kit.
- **Emitting an unwirable selection**: any selected MCP missing a stated
  transport or a passing health check blocks emission of the whole selection;
  the MCP is never quietly dropped (D54 is conjunctive).
- **Declaring the minimum met**: forbidden here — the checker is separate
  (D50). This skill emits counts and the selection, never the verdict.
- **Writing the catalogue**: this skill never writes `registry/`,
  `catalog.json`, `equip.manifest.json`, or any sidecar; a needed change is
  a governance item routed to the leader.
- **Role creep**: it does not dispatch, does not admit, does not rename the
  rank, and does not declare success. After three failed selections, or on
  any refusal path, escalation goes to the leader, never around it.
- **Stale catalogue**: if the catalogue cannot be read, or is older than
  the task anchor, the selection is refused with the blocker stated; never
  select from memory.
