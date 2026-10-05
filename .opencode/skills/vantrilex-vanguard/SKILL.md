---
name: vantrilex-vanguard
description: Equips a project on demand — use when the owner says equip this project or set up this repo, surveying resources and installing plus verifying the kit before writing docs.
---

# Vantrilex Vanguard

## Purpose

Vantrilex Vanguard is the scout. It surveys the territory before anyone builds on it: detect the
project state, select a component kit that fits the project, install the kit with real commands,
verify that every component works, report the result, and then build the documentation foundation
the rest of the work stands on. Skipping this run is how projects end up with a kit that fights the
stack, docs that describe a different codebase, and failures discovered three phases too late.

Run the steps in order and never skip ahead: preflight, state detection, concept work, source
surveying, kit selection, install plus verification, then docs. Three laws bind every step: ask and
read before writing anything, never invent an install command, and pass the three owner gates
(shortlist, verification failures, docs) before proceeding. On a fresh machine `vantrilex-prime`
runs first and owns orientation; Vanguard starts at step 0 with the system already read.

This SKILL.md is written in English. The Arabic relay prompt in the concept phase is generated
output handed to the owner for use with a chatbot, and that is the intended exception to the
English rule, not a contradiction.

## When to Use

- When the owner says equip this project, set up this repo, vanguard, or asks for new project setup
  of any kind.
- At the start of a greenfield project, before any architecture or code exists.
- When inheriting a codebase with missing or untrustworthy docs, so Vanguard runs recon and rebuilds
  the documentation foundation first.
- When the owner arrives with a docs-only brief and no code, so Vanguard verifies the docs, archives
  what is superseded, and continues as a greenfield run.
- When the stack or domain changes enough that the installed kit no longer fits, so Vanguard
  re-surveys sources and re-equips the project.
- Before any other skill runs on a project Vanguard has not yet equipped, because phase-scoped
  injection depends on the kit Vanguard pins.
- On a machine `vantrilex-prime` has already oriented, so the system, the tree, and the next owner
  are known before the equip run starts. On a machine that has never been oriented, Prime runs first
  and this skill is not the entry point.

## Do NOT use

- As the entry point on a fresh machine. Orientation — what the Arsenal is, where the canonical
  repository lives, and which of the three top-level skills runs next — belongs to
  `vantrilex-prime`, which runs once per machine before any equip run. Vanguard names that hand-off
  and carries no copy of it.
- As a workflow runner. Feature, review, security-audit, bugfix, and release lanes belong to the
  doctrine skill; Vanguard only equips the project and writes the docs those lanes consume.
- As a substitute for the repository proof scripts. A green preflight says the machine is healthy; it
  says nothing about registry integrity, which is proven by `node scripts/verify-registry.mjs`, and
  nothing about the generated mirror, which is rebuilt by `node scripts/generate-catalog-json.mjs`.
- To ask the owner which project state applies. State detection is automatic; Vanguard detects and
  then confirms with one sentence. Asking outsources the scout's one job to the person who hired the
  scout.
- To author anything at the reserved workflow name. The file `18-WORKFLOW.md` is owned by the
  doctrine skill, so Vanguard creates nothing there, not even an empty file.
- To install Tier 1 components without owner approval, to install both sides of a `supersedes` pair,
  or to write an install command that was not verified against a real registry. An unverified
  component is recorded with a null command and `verification: unverified`, never with a guessed
  command — because a plausible-looking wrong command will be executed by an agent that trusts this
  skill.
- To keep running after a CRITICAL preflight failure or an unsigned-off verification failure. Both
  stop the run until the owner resolves them.

## Inputs

- A short owner statement of the project's core goal, collected in the concept phase.
- The target repository root, defaulting to the current working directory.
- The local machine mirror `registry/catalog.json`, which Vanguard reads but never hand-edits; the
  generated mirror is rebuilt, never patched by hand.
- The overlap map `registry/data/overlaps.yaml`, carrying the `supersedes` and `pairs_with` relations
  Vanguard must apply during selection.
- The preflight policy: minimum versions node >= 20, git >= 2.30, gh >= 2.40.0, plus an explicit
  operator override when a dirty workspace must be tolerated and logged.
- Owner decisions at the three gates: kit shortlist, verification failures, and the generated
  documentation set. No gate is ever assumed approved.
- Network access when available. When offline, Vanguard degrades to cached metadata and marks every
  network-dependent check SKIPPED with its reason.

## Procedure

Execute the six steps of Part A in order, then the documentation phase, then the execution relay,
under the standing laws. The map below keeps every section traceable:

```text
| A.1 | Step 0 — Preflight                | Environment to workspace, block on CRITICAL      |
| A.2 | Step 1 — Project-state detection  | Four-state tree, automatic, one-sentence confirm |
| A.3 | Concept phase                     | Chatbot relay with the Arabic prompt template    |
| A.4 | Step 2 — Source surveying         | Ordered sources, Context7 reachability rule      |
| A.5 | Step 3 — Kit selection            | Five-step algorithm, overlap rules, shortlist    |
| A.6 | Step 4 — Install, verify, report  | Real commands, kit.lock, per-kind protocols     |
| A.7 | Step 5 — Documentation phase      | 28 files in 8 folders, reserved workflow name    |
| A.8 | Execution relay                   | Owner as bridge between agent and chatbot        |
| A.9 | Vanguard laws                     | Request first, real commands, gates, no stubs    |
```

### Step 0 — Preflight (A.1)

Run the preflight check first, adapted from
`.opencode/skills/preflight-system-doctor/SKILL.md`. Defer to that skill rather than reimplementing
it: Vanguard invokes the same four areas in the same order, which are environment, then runtimes,
then configuration, then workspace. One definition of healthy beats two that can drift apart.

Keep every probe Node-based, with shell and git commands limited to what the doctor skill already
defines. There is no second language runtime and no pane-splitting session tool in the toolchain, so
Vanguard probes Node and its versioned companions and nothing else.

Emit one table with the columns check, status, detail, and remediation command. Assign every row a
severity, CRITICAL or WARN, before results are read — deciding severity after seeing the outcome is
how real failures get talked down to warnings. Statuses are PASS, FAIL, or SKIPPED. A CRITICAL row
that reads FAIL blocks execution immediately: print the report and stop. A CRITICAL row that reads
SKIPPED, for example a network probe while offline, needs explicit owner confirmation before the run
continues, because a skip is not a pass.

```text
| Check                                 | Status  | Detail                              | Remediation                        |
| OS and shell identity                 | PASS    | OS name and shell version recorded  | n/a                                |
| Network egress probe                  | SKIPPED | Offline, cached metadata in use     | Restore connectivity and re-run    |
| node >= 20                            | PASS    | Version meets the floor             | Install a supported Node release   |
| git >= 2.30                           | PASS    | Version meets the floor             | Install a supported git release    |
| gh >= 2.40.0 plus auth status         | PASS    | Authenticated account present       | Run the interactive login flow     |
| kit lock in sync with catalog phases  | PASS    | Every pinned id carries a phase     | Set the phase, then regenerate     |
| Stand-in secrets file clean           | PASS    | Stand-ins only, no real values      | Replace real values with stand-ins |
| Secret scan of tracked files          | PASS    | No credential-shaped strings found  | Revoke first, then remove          |
| Clean workspace or logged override    | PASS    | Tree clean                          | Commit, stash, or log an override  |
| Disk space on repo volume             | PASS    | Free space above the minimum        | Free space before dispatch         |
```

### Step 1 — Project-state detection (A.2)

Scan the repository and decide the state automatically. Never ask the owner which state applies;
detect it, then confirm with one sentence — for example: `Code present in src/ and tests/, docs
absent, spot check skipped for lack of docs: State 2, re-equipping from recon`. One sentence forces
the detection to be a claim about observed facts rather than a hedge.

Run three probes: is code present, are docs present, and do the docs match the code by spot-checking
three files against the implementation they describe. The outcome selects exactly one of four
states:

- State 1, greenfield, meaning no code and no docs: continue to the concept phase.
- State 2, code without usable docs, meaning no docs or docs that contradict the code: launch
  parallel recon subagents, one per major directory, then produce the documentation set plus a
  temporary `27-PROBLEMS.md` listing everything that must be fixed. Real work starts with those
  fixes through the bugfix workflow, and the temporary problems file is archived once it is empty.
- State 3, docs without code: skip research, verify the docs against code samples for accuracy, move
  superseded docs to `docs/99-archive/` with a manifest stating why each one was replaced, write the
  new documentation set, then continue as in State 1.
- State 4, docs plus code: run deep recon over the code, then write the documentation set, then
  record findings in `27-PROBLEMS.md`, then treat the owner's new additions as in State 1.

### Concept phase (A.3)

Ask the owner for a short text stating the project's core goal. Then return an Arabic prompt for the
owner to hand to a chatbot. The prompt instructs the chatbot to hold a long, rigorous, Socratic
discussion that steelmans the owner while staying realistic, then to research proven methods,
knowledge sources, and useful open-source projects, and only then to explain the complete idea in
full detail. The Socratic pass comes before the research pass on purpose: research without a
challenged goal optimises the wrong objective.

The template carries four sections: role, discussion methodology with graduated questions plus
scepticism plus steelmanning, research duties over proven methods plus knowledge sources plus
open-source projects, and output format as a simple Arabic explanation beside a precise English
directive for the coding agent. Copy it as-is and place the owner's goal in the «OBJECTIVE» slot.
Latin inside the template is limited to structural tokens and declared glosses: OBJECTIVE,
FIRST STEP, OUT OF SCOPE, OPEN QUESTIONS, PROBLEMS, USERS, CONSTRAINTS, SUCCESS, proven methods,
knowledge sources, open-source projects.

The prompt text itself is not inlined here. It lives in the skill asset
`assets/chatbot-brief-ar.md`, given relative to this skill folder. Read that file and hand its
contents to the owner unchanged. Exactly one full copy of the prompt exists in the repository, so
this flow and the asset can never diverge — and that is why the copy lives in exactly one file
instead of inside this procedure.

The owner returns with the chatbot's researched concept, and Vanguard proceeds to source surveying
with that concept as the needs baseline.

### Step 2 — Source surveying (A.4)

Query the sources in this fixed order and record what each one yields: the local
`registry/catalog.json` first, then the skills.sh leaderboard together with the `npx skills` CLI,
then vercel-labs/find-skills, then the Smithery registry CLI via `npx @smithery/cli`, then the
agency-agents roster at https://github.com/msitarzewski/agency-agents, then awesome-design-md at
https://github.com/voltagent/awesome-design-md, then the ecc hooks at
https://github.com/affaan-m/ecc. Fixed order keeps two runs comparable: the same project surveyed
twice yields the same evidence in the same places.

Apply the hard reachability rule to every candidate MCP or CLI: its docs must be reachable through
Context7 live lookup. A candidate whose docs are not reachable is rejected, or explicitly flagged
with the reason when the owner still wants to see it. The reasoning is simple: a component the
agent cannot read docs for at install time is a component the agent will misuse at work time. When
offline, mark the network-dependent sources SKIPPED with the reason and continue on cached catalog
metadata, never silently passing a source that was not queried.

### Step 3 — Kit selection (A.5)

Run the five-step algorithm without reordering it. First extract needs from the project type: stack,
domain, and whether the project is UI-heavy. Then query the catalog. Then score each candidate on
installs and stars with preference for proven adoption at or above one thousand, on activity within
the last six months, on a clear licence, and on non-overlap with stronger candidates. Then apply the
overlap rules. Then present the shortlist, wait for owner approval, and only then install. Tier 0 is
pre-approved for every project: it is the thirty-five core components of the fifty locked in
`kit/kit.lock`, with an empty pending list. Tier 1, the fifteen conditional components, is selected
per project and needs explicit approval — conditional exists so projects carry what they use and
nothing they do not.

Read catalog records by their real field names, exactly these fields:

```text
id, name, kind, description, source, origin, install_cmd, version_pin, category, tags, when_to_use, phase, tier, verify_cmd, cost_note, verification, default_selected
```

Apply `supersedes` and `pairs_with` from `registry/data/overlaps.yaml` as hard constraints: never
install both sides of a `supersedes` pair, for example `ponytail-review` against `code-review`, and
pick the winner by recency and scope while recording why in the selection note. Members of a
`pairs_with` group travel together when both apply. When the project is UI-heavy, the design-tokens
formatting document from awesome-design-md is mandatory kit, because interface work without shared
tokens drifts on every screen.

Present the shortlist in this shape and stop for approval:

```text
| Candidate        | Kind   | Tier        | Score note                          | Overlap ruling                  |
| grill-me         | skill  | core        | High adoption, active, clear licence| Kept, no conflict               |
| ponytail-review  | skill  | conditional | High adoption, active               | Kept over code-review, recorded |
| code-review      | skill  | conditional | Solid but overlapping              | Dropped, superseded, recorded   |
```

### Step 4 — Install, verify, report (A.6)

Install with real commands only. Skills install through the skills CLI, MCP servers through JSON
snippets placed in the client configuration, and every package name is checked against the live
registry first. Never invent a package name and never guess a repository path: an unrecognised
package is rejected, and an unverified component keeps a null command with
`verification: unverified`.

```sh
npx skills add <repo> --skill <name> -a opencode
node scripts/verify-registry.mjs
node scripts/generate-catalog-json.mjs
```

Write one pinned entry per installed component into `kit/kit.lock`, which the docs phase mirrors at
`docs/04-kit/15-kit.lock`:

```json
{
  "id": "ponytail-review",
  "kind": "skill",
  "version": "v1.4.2",
  "source": "dietrichgebert/ponytail",
  "install_cmd": "npx skills add dietrichgebert/ponytail --skill ponytail-review -a opencode",
  "phase": "review",
  "verify": "skill dry-run against a sample diff",
  "status": "verified"
}
```

Inject each component phase-scoped, meaning it is loaded only in the phases its `phase` field names,
and keep the eight-MCP cap as the backstop so context spend tracks the work instead of staying hot
everywhere. Prove every component with the per-kind protocol below, and record the same result the
kit verifier at `scripts/verify-kit.mjs` checks:

```text
| Kind                       | Protocol                                                              |
| `mcp` | Ping the server with a tool listing, then make one real smoke call.   |
| `skill` | Load the component's `SKILL.md`, then dry-run its procedure on a scratch input. |
| `agent` | Echo a task back to the agent and require a scoped, non-destructive answer. |
| `plugin`, `hook` | Fire the specific event the component subscribes to.           |
| LSP, exposed by a plugin | Open a sample file that contains a deliberate fault and require diagnostics. |
| `formatting` | Run the formatter over a sample file and diff the result.      |
```

A listing alone proves reachability, not behaviour — that is why every row pairs a load or ping
with one real exercise of the component. Report one row per component with the columns tool, kind,
status, evidence, and how to fix, in this shape, and proceed only after the owner signs off on the
failures:

```text
| Tool       | Kind  | Status | Evidence                  | How to fix                  |
| context7   | mcp   | works  | Tool listing plus one call| n/a                         |
| grill-me   | skill | works  | SKILL.md load plus dry-run| n/a                         |
| firecrawl  | mcp   | fails  | Connection refused, log L3| Rotate the key, then retry  |
```

### Step 5 — Documentation phase (A.7)

Generate the twenty-eight files with fixed numbers and fixed filenames in eight folders. The grouping
below is explicit and complete:

```text
| `docs/` | 00, 17 | Project summary and the living checkpoint file |
| `docs/01-vision/` | 01, 02, 05, 06, 23, 24 | Vision, language, people, scope, roadmap, risks |
| `docs/02-requirements/` | 03, 04, 07 | Functional, non-functional, and success criteria |
| `docs/03-architecture/` | 08, 09, 10, 11, 12, 13 | Architecture, stack, data, contracts, security, ADR |
| `docs/04-kit/` | 14, 15, 16 | Kit inventory, lockfile mirror, and agent registry |
| `docs/05-workflows/` | 18, 19, 20, 21, 22 | Main lane plus feature, review, audit, and bugfix lanes |
| `docs/06-governance/` | 25, 26, 27 | Constitution, antipatterns, and the problems ledger |
| `docs/99-archive/` | superseded docs plus manifest | Retired docs with reasons, never deleted |
```

Write one contract row per file, all twenty-eight, with no row added or removed:

```text
| 00 | `00-PROJECT-SUMMARY.md` | Project Summary |
| 01 | `01-VISION.md` | Vision |
| 02 | `02-GLOSSARY.md` | Glossary |
| 03 | `03-FUNCTIONAL-REQUIREMENTS.md` | Functional Requirements |
| 04 | `04-NON-FUNCTIONAL-REQUIREMENTS.md` | Non-Functional Requirements |
| 05 | `05-PERSONAS.md` | Personas |
| 06 | `06-SCOPE.md` | Scope |
| 07 | `07-SUCCESS-CRITERIA.md` | Success Criteria |
| 08 | `08-ARCHITECTURE-OVERVIEW.md` | Architecture Overview |
| 09 | `09-TECHNOLOGY-STACK.md` | Technology Stack |
| 10 | `10-DATA-MODEL.md` | Data Model |
| 11 | `11-API-CONTRACTS.md` | API Contracts |
| 12 | `12-SECURITY-MODEL.md` | Security Model |
| 13 | `13-ARCHITECTURE-DECISION-RECORD.md` | Architecture Decision Record |
| 14 | `14-KIT-INVENTORY.md` | Kit Inventory |
| 15 | `15-kit.lock` | kit.lock (lockfile, not Markdown) |
| 16 | `16-AGENT-REGISTRY.md` | Agent Registry |
| 17 | `17-CHECKPOINT.md` | Checkpoint (living state file, updated every session) |
| 18 | `18-WORKFLOW.md` | Main Workflow (left EMPTY for Doctrine to fill) |
| 19 | `19-FEATURE-WORKFLOW.md` | Feature Workflow |
| 20 | `20-REVIEW-WORKFLOW.md` | Review Workflow |
| 21 | `21-SECURITY-AUDIT-WORKFLOW.md` | Security Audit Workflow |
| 22 | `22-BUGFIX-WORKFLOW.md` | Bugfix Workflow |
| 23 | `23-ROADMAP.md` | Roadmap |
| 24 | `24-RISKS.md` | Risks |
| 25 | `25-AI-CONSTITUTION.md` | AI Constitution (immutable laws) |
| 26 | `26-AI-ANTIPATTERNS.md` | AI Antipatterns (what the agent must never do) |
| 27 | `27-PROBLEMS.md` | Problems |
```

Hold these documentation rules with no exceptions: English throughout, detailed without stinginess,
fixed numbers that never shift. The file `25-AI-CONSTITUTION.md` holds the immutable laws,
`26-AI-ANTIPATTERNS.md` states what the agent must never do, `00-PROJECT-SUMMARY.md` is the
comprehensive if-I-forgot-the-project reference, and `17-CHECKPOINT.md`, mirrored at
`docs/17-CHECKPOINT.md`, is the living per-session state file. Fixed numbers matter because every
later skill, gate, and ritual addresses these files by number; renumbering one file silently breaks
every reference to it.

On `18-WORKFLOW.md` the resolution is binding and Vanguard does not deviate: the name is reserved
and owned by the doctrine skill, so Vanguard creates nothing there, not empty, not a stub, nothing.
Vanguard records the name as reserved in the doc inventory so the next agent does not re-open the
question. The rationale is recorded alongside: an unauthored main workflow would stand as a second
unauthenticated source of process truth beside the one that owns it.

Superseded material is moved to `docs/99-archive/` with a manifest stating why each document was
replaced, and archive contents are never deleted — deletion destroys the evidence of what was
decided and why.

### Execution relay (A.8)

After the docs land, the owner becomes the bridge between the coding agent and the chatbot from the
concept phase. The agent executes, the chatbot interprets and verifies, and the owner directs. Every
turn follows the same loop: the agent replies, the owner carries the reply to the chatbot, the
chatbot returns an Arabic explanation plus a precise English directive, the owner carries the
directive back, and the agent continues. The loop looks slow, and that is the point: each directive
arrives challenged and researched instead of improvised. The agent uses each skill at its mapped
phase, so review skills run in review, build discipline runs in build, and nothing runs everywhere
by default.

### Vanguard laws (A.9)

First, request information before writing: Vanguard asks, probes, and reads before it creates a
single file, because an equip run that starts writing before it understands the project bakes its
first impression into twenty-eight files. Second, never invent install commands: every command is
verified against a real registry or recorded as null with `verification: unverified`. Third, the
owner gates are absolute: the shortlist, every verification failure, and the generated docs each
need explicit sign-off before Vanguard moves on. Fourth, no deferred or half-written sections of any
kind: every file Vanguard writes is complete on delivery, because a stub filed today becomes the
missing foundation of a failed gate next month. Vanguard additionally holds a BLOCKED checkpoint that
refuses dispatch into install and docs phases while any CRITICAL preflight row fails or any
verification failure still lacks owner sign-off.

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
field of every entry in `kit/kit.lock`. The phase enum in the lock is `scout`, `docs`, `plan`,
`build`, `review`, `operate`, `on-demand`, and `on-demand` sits outside every phase and is never
injected by phase. The assignment as the lock stands:

```text
| Phase | Components carrying this phase in `kit/kit.lock` |
|---|---|
| scout | fetch, context7 (mcp, plugin), firecrawl, session-start, task-dispatcher, vantrilex-prime, vantrilex-vanguard |
| docs | grill-me, technical-writer, documentation-as-tests |
| plan | ask-matt, wayfinder, sequential-thinking, architect, babel-bridge |
| build | tdd, ponytail, openrouter, typescript-lsp, feature-dev, long-running-process-guard, typescript-check-after-editing-ts-tsx-files, auto-format-js-ts-files-with-prettier-after-edits, lenis, og-image, open-graph-image, time-capsule-test, vantrilex-design-variations |
| review | code-review (skill, plugin), ponytail-review, github, security-guidance, code-reviewer, ai-generated-code-security-auditor, red-team (skill, agent), skill-shadow, a11y-audit |
| operate | ponytail-audit, filesystem, memory, commit-commands, pre-compact, persist-session-state-on-end, vantrilex-doctrine, kit-evaluation-journal, kit-evolution-log, kill-switch-document |
| on-demand | find-skills, skill-creator |
```

Read the lock at dispatch time instead of copying that table forward: a component absent from a row
is not thereby unassigned, a phase holding no row is not thereby empty, and the lock entry is what
gets injected, never the id alone. An id recorded at two kinds is injected as both entries.

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

## Outputs

- The kit shortlist table with candidate, kind, tier, score note, and overlap ruling, consumable as
  the approval ballot with no guessing about why each row survived or fell.
- The verification report table with tool, kind, status, evidence, and how to fix, consumable as the
  sign-off sheet for every installed component.
- The pinned `kit/kit.lock` entries with id, kind, version, source, install command, phase, verify
  note, and status, mirrored at `docs/04-kit/15-kit.lock` with the kit inventory beside it at
  `docs/04-kit/14-KIT-INVENTORY.md`.
- The generated twenty-eight-file documentation set in its eight folders, with the reserved workflow
  name recorded and the archive manifest written.
- The Arabic relay prompt with its four sections and the owner-goal slot, handed to the owner ready
  to paste, whose returned concept feeds the next Vanguard run.

## Failure Modes

- The owner is asked which project state applies. Vanguard must detect the state itself from code,
  docs, and the three-file spot check, then confirm in one sentence. Asking is a failure of the
  step, so re-run detection instead of polling.
- A candidate MCP or CLI has no docs reachable through Context7. Reject it, or flag it explicitly
  with the reason when the owner insists on seeing it. Installing it silently is a failure of the
  surveying rule.
- A verification protocol fails. Stop the install lane, record evidence and the fix in the report
  table, and proceed only after owner sign-off on that failure.
- The BLOCKED checkpoint is set. Dispatch into install or docs phases is refused while any CRITICAL
  preflight row fails or any verification failure lacks sign-off. Clearing the checkpoint needs the
  fixed evidence, not a reworded status.
- The machine is offline. Degrade every network-dependent query to SKIPPED with its reason and
  continue on cached metadata. A silent pass on a step that never ran is a failure of the report.
- A package name is unrecognised or unverifiable. Reject it rather than guessing a registry path,
  because a plausible-looking wrong command will be executed by an agent that trusts this skill.
