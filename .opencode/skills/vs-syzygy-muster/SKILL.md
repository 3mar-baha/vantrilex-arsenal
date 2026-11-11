---
name: vs-syzygy-muster
description: Use when one of the three leaders (Aether, Blazar, or Pulsar) must open a task, to compile the per-task complement — at least 10 skills and 4 countable MCPs per task, measured cumulatively across the task's phases (D48) — into a compiled selection with the rank, priorities, and the paste-ready client config for the selected MCPs.
source: 3mar-baha/vantrilex-arsenal
---

# Syzygy Muster

Naming truth, fixed verbatim: the name is Vantrilex, the rank is Syzygy, and
the user-facing display is Vantrilex. Syzygy (/ˈsɪz.ɪ.dʒi/ — alignment of three
celestial bodies) is the rank of the three leaders: Aether, Blazar, and Pulsar
(see `.opencode/agents/aether.md`, `.opencode/agents/blazar.md`, and
`.opencode/agents/pulsar.md`). The `vs-syzygy-*` prefix derives from the rank
Syzygy and marks forcing skills that belong to the Syzygy rank alone, never a
generic lead mark. The `vs-syzygy-muster` forcing skill is one of the three
forcing skills kept by decision D47 (G-01, 2026-11-10); D52 (G-06) fixes how
it is consumed — a skill file compiled into the dispatcher's prompt text at
call time, advisory only.

The skill branches on which leader invokes it. Aether invokes the plan-craft
line (`vs-at-plan-craft`). Blazar invokes the build-craft line
(`vs-bl-build-craft`). Pulsar invokes the probe-craft line
(`vs-pu-probe-craft`). The branch selects the craft line only — the rank, the
minimum, and the output shape do not change with the caller.

## Purpose

Compile the per-task complement for a Syzygy task from the catalogue. Syzygy
(rank: `syzygy`) needs at least 10 skills and 4 countable MCPs per task,
measured across the whole task's phases, cumulatively — not per phase, and
not per seat (decision D48, 2026-11-10). This skill runs once, at the start of
a Syzygy task, and emits a compiled selection — never a loose list of names:
the rank, the selected skills with priorities, the selected countable MCPs
with priorities, and the paste-ready client config for the selected MCPs. It
is a config emitter, not a namer.

## When to Use

- Once, at the start of a Syzygy task, after the task is classified and
  before the first phase work begins — the moment the per-task complement is
  fixed.
- Whenever a Syzygy task's phase kit must be reconciled with the per-task
  cumulative minimum (a new phase, a re-plan, a resumed checkpoint).
- When a selection was refused under D54 or came in below minimum and must be
  recompiled from the catalogue.

## Do NOT use

- For any rank other than syzygy. The zenith and asterism musters serve other
  ranks. Do not rename the rank, do not re-case it, do not alias it.
- For a caller other than Aether, Blazar, or Pulsar. A dispatch that names no
  invoking leader, or names a seat outside the three leaders, is refused
  with the blocker stated; never default the branch to one leader.
- To dispatch, spawn, or route work. This skill emits a selection and stops.
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
- The invoking leader, named in the dispatch: `aether`, `blazar`, or `pulsar`.
  The branch (plan-craft, build-craft, or probe-craft) is derived from this
  name; it is never inferred from the task text.
- The catalogue, read-only: `registry/data/skills.jsonl`,
  `registry/data/mcp.jsonl`, and the generated `registry/catalog.json`. This
  skill writes none of them.
- The selection context: `.opencode/equip.manifest.json`, read-only
  reference for what is currently selected; not edited here.
- The controlling rulings, all in `docs/15-DECISIONS.md`: D48 (per task =
  cumulative across phases; Syzygy's 10 counts Syzygy's own skills only;
  phase pruning does not reduce the per-task count), D50 (the checker is
  separate), D51 (re-select until success; three failed selections escalate
  to the leader), D54 (the countable-MCP definition), D47 (the forcing-skill
  family), D52 (the compiler pattern).
- The client MCP surface for the paste-ready config: the `mcp` object shape
  in the client's opencode.json — names, command or URL, args, transport, and
  environment variable NAMES only, never values.

## Procedure

1. **Fix the anchor and the rank.** Run once, at the start of the task. The
   rank is `syzygy`. Every line of the output carries it; nothing widens or
   renames it. Resolve the invoking leader from the dispatch: `aether` →
   the plan-craft line, `blazar` → the build-craft line, `pulsar` → the
   probe-craft line. If the invoking leader is absent or outside the three,
   STOP and report the blocker; the branch is never guessed.
2. **Derive the per-task requirement.** The floor is at least 10 skills and
   4 countable MCPs per task — the D48 bright-line minimum for the Syzygy
   rank, cited here as D48 requires. Measurement is over the union of the
   task's phases, cumulatively: phases contribute to one shared count; there
   is no per-phase quota and no per-instant snapshot. Syzygy's 10 counts only
   Syzygy's own skills — the skills of the three leaders' rank
   (`vs-at-plan-craft`, `vs-bl-build-craft`, `vs-pu-probe-craft`,
   `vs-syzygy-muster`); Zenith's `vs-zenith-*` skills and Asterism's
   `vs-asterism-*` skills are excluded from that count (D48, 2026-11-10,
   "per task" = option (ii)).
3. **Select skills from the catalogue.** Candidates are live catalogue rows
   of kind `skill` whose phase intersects the task's phases. Every candidate
   must resolve to a catalogue row; an installed skill with no row is never a
   candidate (see Failure Modes). Order candidates by `priority` ascending,
   1 highest precedence; a row with a null `priority` is treated as 5 — the
   D48 bright-line midpoint — and the substitution is logged, never applied
   silently (D48 governs the minimum; the null-to-5 rule rides with it).
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
6. **Count, gate, re-select.** Below 10 skills or below 4 countable MCPs —
   or any refused member — the selection is not emitted. Re-select from the
   catalogue, excluding refused candidates, up to 3 selections in total.
   Three failed selections: STOP, report "I chose a failed selection" to the
   leader (D51, 2026-11-10), listing the three attempts and the criterion
   each refused on. The leader — never this skill — dispatches a NEW side
   agent with the same name (`vs-syzygy-muster`) to re-run the task with a
   fresh selection.
7. **Emit the compiled selection.** Emit rank, the invoking leader and its
   branch, skill list, MCP list, and the config blocks (see Outputs). The
   emission states its own counts against the floor and ends with the D50
   disclaimer.
8. **Stop.** No dispatch, no registry writes, no admits, no minimum
   declaration, no further phases. The compiled selection is returned; the
   checker verifies it later, separately.

## Outputs

- The compiled selection record, emitted as a text artifact in the lead
  output: rank `syzygy`; the invoking leader and its branch (`aether` →
  plan-craft, `blazar` → build-craft, `pulsar` → probe-craft); the selected
  skills in priority order — id, phase, tier, priority per line; the
  selected MCPs in priority order — id, transport, priority per line, each
  followed by its paste-ready client config block; the per-task count line
  (`skills selected: N (minimum 10, Syzygy-own only, cumulative across phases per D48)` and
  `countable MCPs: M (minimum 4, D54 four-criterion test)`); the
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

- **Invoking leader missing or outside the three**: refuse the selection,
  state the blocker, and escalate to the leader with the dispatch text;
  never guess `aether`, `blazar`, or `pulsar` from the task text, and never
  emit a branch the dispatch did not name.
- **Selection below minimum** (fewer than 10 skills, or fewer than 4
  countable MCPs in the union of the task's phases): not emitted. Re-select,
  excluding refused candidates, up to 3 selections; on the third failure,
  STOP and report "I chose a failed selection" to the leader (D51).
- **Selected MCP not countable** (any D54 criterion fails): refuse that MCP,
  name the failing criterion, and pick the next candidate by priority. No
  countable candidate left for an MCP slot means the selection is refused —
  never a partial complement, never an unwirable block.
- **Uncatalogued skill**: refuse it, never select it. The 16 installed
  skills with no catalogue row as measured 2026-11-11 (`.opencode/skills/`
  folders with no id in `registry/data/skills.jsonl`, unchanged by the W-09
  and W-10 landings) must not be selected:
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
- **Stale catalogue**: if the catalogue cannot be read, or is older than the
  task anchor, the selection is refused with the blocker stated; never select
  from memory.
