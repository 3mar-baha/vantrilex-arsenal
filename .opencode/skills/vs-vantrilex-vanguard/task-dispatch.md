# Task dispatch — vs-vantrilex-vanguard satellite

Satellite of [vs-vantrilex-vanguard](SKILL.md) (split 2026-11-12, F-09). The content below is the Task dispatch section
that used to live in the skill body, moved verbatim so every file stays under 500 lines.

### Task dispatch

The task-dispatcher hook — bound to the OpenCode V2 session `prompt` hook, and the only one of the seven
hooks that fires on V2 — announces one of five scenarios and points here. It injects no kit and
carries no plan of its own, so everything an agent needs in order to act lives in this section.
Dispatch owns exactly one decision — the phase-kit map, meaning which locked components are injected
in which phase — and it takes that decision before anything is injected. It never restates
doctrine's laws or phase map; it names them as the governance this dispatch serves.

**Input.** The task description as the owner phrased it. For scenarios 3, 4 and 5, also the phase-kit
plan already in effect on the open task: its ordered phase list, the components assigned per phase,
and which of those phases are already complete.

**Output.** One ordered phase list with the kit components assigned per phase, read from the `phase`
field of every catalog row and the tokens in `.opencode/equip.manifest.json`. The phase enum is
`scout`, `docs`, `plan`,
`build`, `review`, `operate`, `on-demand`, and `on-demand` sits outside every phase and is never
injected by phase. An illustrative sample of the selection as it stands:

```text
| Phase | Components carrying this phase in the selection record (sample) |
|---|---|
| scout | fetch, context7 (mcp, plugin), firecrawl, session-start, task-dispatcher, vantrilex-prime, vantrilex-vanguard |
| docs | grill-me, technical-writer, documentation-as-tests |
| plan | ask-matt, wayfinder, sequential-thinking, architect, babel-bridge |
| build | tdd, ponytail, openrouter, typescript-lsp, feature-dev, long-running-process-guard, typescript-check-after-editing-ts-tsx-files, auto-format-js-ts-files-with-prettier-after-edits, lenis, og-image, og-image, time-capsule-test, vantrilex-design-variations |
| review | code-review (skill, plugin), ponytail-review, github, security-guidance, code-reviewer, ai-generated-code-security-auditor, red-team (skill, agent), skill-shadow, a11y-audit |
| operate | ponytail-audit, filesystem, memory, commit-commands, pre-compact, persist-session-state-on-end, vantrilex-doctrine, kit-evaluation-journal, kit-evolution-log, kill-switch-document |
| on-demand | find-skills, skill-creator |
```

Read the catalog and the selection record at dispatch time instead of copying that table forward: a
component absent from a row is not thereby unassigned, a phase holding no row is not thereby empty,
and the catalog entry behind a selected token is what gets injected, never the id alone. An id
recorded at two kinds is injected as both entries.
The fourth top-level skill enters this map under its directory-path id when
the catalog and the selection carry matching rows. Until then the live files decide the map,
never a printed row.

No mapping printed in this skill governs a dispatch. Vanguard derives the
phase-kit map from the lock entries in force on every run, and a mismatch
between a printed table and the lock resolves in favour of the lock file.

**Announce, then inject.** Print the phase-kit map before the first injection and let the owner read
it. A plan presented after the kit is already in context cannot be course-corrected without spending
the injection to get there, so the announce is the last cheap moment to change the plan.

Emit the plan in this shape, so two dispatches of different tasks yield comparable plans:

```text
| # | Phase | Components to inject | State | Note |
|---|-------|----------------------|-------|------|
| 1 | scout | context7, firecrawl, vantrilex-prime | pending | Reads sources, writes nothing |
| 2 | plan | wayfinder, ask-matt | pending | Decision tickets before any build |
| 3 | build | tdd, ponytail | pending | Injecting prunes scout and plan kit |
```

### Dispatch scenarios

| # | Scenario | Behaviour |
|---|---|---|
| 1 | **NEW TASK** | Full Vanguard dispatch from scratch on the task description: derive the phase-kit map, announce it, then run the equip sequence this skill already defines, preflight through documentation phase. |
| 2 | **CONTINUATION** | Silent no-op. The open task already holds a plan, so nothing is re-derived and nothing is announced, and the existing phase-kit plan stands unchanged. Silence is the correct output here, not a missing answer. |
| 3 | **TASK MODIFICATION** | Vanguard re-dispatch on the modified task: re-derive the map from the modified description against the plan in effect, then state in one sentence what changed and which phases moved as a result. |
| 4 | **CONTINUATION WITH MODIFICATION** | Re-plan the remaining phases only, against the plan already in effect. Completed phases stay locked, unchanged and never re-derived, and the re-plan covers exactly the phases that have not run. |
| 5 | **CONTINUATION WITH NEW TASK** | Checkpoint the open task, park it, then run a fresh Vanguard dispatch on the new one. The two lanes keep separate phase-kit maps and separate checkpoints, and the parked lane is not resumed. |

**Scenario 4 rule.** Completed phases are immutable. Only the remaining phases are re-planned, and a
completed phase is never re-scoped, re-derived or re-injected. The reason: a completed phase is
verified work whose evidence is already recorded, so re-planning it is not a correction, it is
unearned loss of proof.

**Scenario 5 rule.** The checkpoint records what is done against what is pending, phase by phase, and
the two lanes never share a phase-kit map. A shared map makes it impossible to say which lane a result
belongs to, which is exactly the confusion two lanes exist to prevent. Every turn of a two-lane
session names the lane being worked before the turn takes its first action.

**Ambiguity rule.** When a prompt genuinely reads as more than one scenario, the agent asks the owner
one short clarifying question naming the scenarios in play, then waits for the answer. This is the
agent asking the owner at runtime, not a check performed in advance. One question, then the answer
decides; guessing a scenario is the failure, not asking.

**Binding protocol.** Every dispatch binds each role to a real agent before
anything runs. Vanguard reads the live roster from `opencode agent list` as
the only source of truth, searches the kit agent and skill files next, authors
a replacement only through the authoring procedure the spec defines when no
member fits, then dispatches. The dispatch record names role, agent, and the
dispatched target for every lane. Silent fallback to a generic agent never
happens: when no roster member fits, Vanguard states the reason in one line
first, then proceeds on that stated reason.

