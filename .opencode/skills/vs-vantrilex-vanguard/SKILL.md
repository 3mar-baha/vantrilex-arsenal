---
name: vs-vantrilex-vanguard
description: Equips a project on demand from the Blazar seat — use when the owner says equip this project or set up this repo, surveying resources and installing plus verifying the kit before writing docs.
source: 3mar-baha/vantrilex-arsenal
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
  repository lives, and which of the four top-level skills runs next — belongs to
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
- To install anything from beyond the locked set without a separate explicit
  owner approval. The fallback serves proven needs the lock cannot meet, and
  the locked shortlist approval never covers a beyond-lock install.
- To select components from a mapping frozen in this file. Vanguard reads the
  lock and the generated mirror live at dispatch time, and a printed table is
  an example of the shape that never governs what installs.
- To dispatch a generic agent while a named roster member fits the role, or to
  fall back silently when none fits. A fallback states its reason in one line
  before it dispatches, never after the dispatch has already run.
- To author the standing methodology of the target project from memory. Part
  A of the target `WORKFLOW.md` is seeded from the canonical copy the forge
  skill carries, read live at seed time, and every later revision carries a
  dated note. An invented methodology is a second source of process truth.
- To overwrite the target `AGENT.md`, to clobber owner content in the target
  `AGENTS.md`, or to hand-edit the generated mirror. Vanguard creates only
  what is absent, merges additively into what exists, and regenerates the
  mirror from the merged source on every run.
- To install the fourth top-level skill from any path but its own. The forge
  skill id is its directory path, and the install section of this file states
  the one command that installs it. A copy written by hand is not installed.

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
- The generated mirror `registry/catalog.json` as the fallback source beyond
  the locked set, read live and scored with the same tests as locked rows.
- The live roster from `opencode agent list` as the only binding source for
  agent dispatch, searched before the kit agent and skill files are read.
- The target root files, read live when present: `AGENT.md`, `WORKFLOW.md`,
  `AGENTS.md`, and the generated mirror the doctrine skill names. Vanguard
  reads each file before touching it and never rebuilds one from memory.
- The forge source with its directory-path id `vantrilex-workflow-forge`,
  installed by the single command the install section states and proven by
  read-back before the run treats the four-skill set as complete.
- The companion-config key set the program brief fixes: the default agent,
  the disabled lanes, the subagent depth, and the compaction keeps. Vanguard
  merges those keys into the target companion config and proves the merge by
  reading the file back and reporting every key.

## Procedure

Execute the six steps of Part A in order, then the documentation phase, then
the execution relay, under the standing laws. The map below keeps every
section traceable. Root-file installs run in the docs lane; the forge install
and the companion config run in the install lane:

```text
| A.1 | Step 0 — Preflight                | Environment to workspace, block on CRITICAL      |
| A.2 | Step 1 — Project-state detection  | Four-state tree, automatic, one-sentence confirm |
| A.3 | Concept phase                     | Chatbot relay with the Arabic prompt template    |
| A.4 | Step 2 — Source surveying         | Ordered sources, Context7 reachability rule      |
| A.5 | Step 3 — Kit selection            | Five-step algorithm, overlap rules, shortlist    |
| A.6 | Step 4 — Install, verify, report  | Real commands, selection record, per-kind protocols |
| A.6b | Forge skill install              | Fourth skill, one command, read-back proof       |
| A.6c | Companion config                 | BLAZAR routing, merged keys, restart noted       |
| A.7 | Step 5 — Documentation phase      | 28 files in 8 folders, reserved workflow name    |
| A.7b | Root file AGENT.md               | Six sections, created once, repaired additively  |
| A.7c | Root file WORKFLOW.md            | Part A method plus Part B task, dated notes      |
| A.7d | Root directives and mirror       | Merged source, pointer line, generated mirror    |
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

Vanguard emits one initial report before any install begins. The report opens
with the project described from zero in its own words, then lists every
current problem beside the file and line that proves it, then lists possible
future problems with probability plus impact plus prevention stated for each,
then lists improvements ranked by impact against effort. Every claim traces
to code Vanguard actually read; a claim without a source file is not filed.
Every recon dispatch follows the binding protocol under task dispatch below.
Vanguard resolves each role from the live roster first, searches the kit agent
files next, records the role-to-agent mapping per lane, and never falls back
to a generic agent without stating the reason in one line before dispatch.

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

Source surveying and kit selection (mandatory): see [source-and-kit-selection.md](source-and-kit-selection.md) — the ordered source list, the Context7 reachability rule, and the five-step kit-selection algorithm with the overlap rules live there.
### Step 4 — Install, verify, report (A.6)

Install with real commands only. Skills install through the skills CLI, MCP servers through JSON
snippets placed in the client configuration, CLI tools through a package-manager invocation or the
vendor's official installer, and every package name is checked against the live registry first.
Never invent a package name and never guess a repository path or a binary: an unrecognised package
is rejected, and an
unverified component keeps a null command with `verification: unverified`.

Vanguard leaves installer hygiene clean behind it. It records no vestigial
deny entry against skills on any permission surface, and it warns the owner in
one line whenever a global-scope skill install would inject noise into every
project on the machine. Project-scoped phase injection stays the default, and
global scope proceeds only under its own explicit owner approval.

Verify a CLI tool with `<binary> --version` and nothing else. The entry is recorded as `verified`
only when that command actually exits 0; any other outcome keeps `verification: unverified` with
the reason, because an installed binary that cannot report its own version is not a tool the kit
can rely on.

```sh
npx skills add <repo> --skill <name> -a opencode
node scripts/verify-registry.mjs
node scripts/generate-catalog-json.mjs
```

Record one token per installed component in the project's selection record at
`.opencode/equip.manifest.json`, under the phase the catalog row declares, and let the docs phase
carry the same inventory at `docs/04-kit/15-SELECTION-RECORD.json`:

```json
{
  "schema_version": 1,
  "phases": {
    "review": ["skill/ponytail-review"]
  }
}
```

Inject each component phase-scoped, meaning it is loaded only in the phases its `phase` field names,
and keep the eight-MCP cap as the backstop so context spend tracks the work instead of staying hot
everywhere. Prove every component with the per-kind protocol below, and record the same result the
catalog verifier at `scripts/verify-catalog.mjs` checks:

```text
| Kind                       | Protocol                                                              |
| `mcp` | Ping the server with a tool listing, then make one real smoke call.   |
| `skill` | Load the component's `SKILL.md`, then dry-run its procedure on a scratch input. |
| `agent` | Echo a task back to the agent and require a scoped, non-destructive answer. |
| `cli` | Run `<binary> --version` and require exit 0. |
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

Before an agent installs or dispatches, Vanguard validates its definition
file. The frontmatter parses as valid syntax, the name is lowercase and
hyphenated and equals the filename stem, `mode: subagent` is present, no
`color` field and no model pin is present, and no tool reference from another
harness appears. A definition that fails validation is rejected with its file
and reason stated, and dispatch on it is refused until it is repaired.

### Forge skill install (A.6b)

Four top-level skills exist once the forge lands, in this fixed order:
`vantrilex-prime` orients the machine, `vantrilex-vanguard` equips the
project, `vantrilex-workflow-forge` authors the standing methodology, and
`vantrilex-doctrine` governs the work. Vanguard installs the forge in the
Step 4 lane under the same real-command law that binds every other install.

A skill id is its directory path, so the install path is fixed:

```text
.opencode/skills/vantrilex-workflow-forge/SKILL.md
```

Vanguard runs this command in the Step 4 lane and reports the exact string
for the CS node README block:

```text
npx skills add 3mar-baha/vantrilex-arsenal --skill vantrilex-workflow-forge
```

Vanguard proves the install by read-back: the file exists at the path above,
its frontmatter `name` equals `vantrilex-workflow-forge`, and
`node scripts/verify-skills.mjs` exits 0. Until that proof lands, the run
reports the forge as pending and the set as incomplete. A hand-written copy
at the path counts as absent, because a fabricated skill governs nothing.

### Companion config (A.6c)

Vanguard installs BLAZAR as the default agent and applies the V2 companion
config in the Step 4 lane, after the kit verifies and before the docs gate
closes. The program brief fixes the key set. Vanguard resolves the config
path live in the target tree, merges the keys, reads the file back, and
reports every key with its before and after values. No key is assumed from
a remembered path, and no routing claim is made before the read-back
matches.

| Key | Merged value |
|---|---|
| `default_agent` | `blazar` |
| `build` lane | disabled |
| `plan` lane | disabled |
| `experimental.subagent_depth` | `4` |
| `compaction` keeps | tokens and buffer only |

BLAZAR installs under the same law as every component: a verified vector
from the lock or the live catalog installs it, and a missing vector records
the entry with a null command and `verification: unverified`, never with a
guessed command.

The merged routing takes effect at the next runtime restart. Vanguard notes
the restart in the merge record and treats the new routing as pending until
the owner confirms the reload. A run that claims the new routing before the
restart certifies what never executed.

Documentation phase (mandatory): see [documentation-phase.md](documentation-phase.md) — the 28-file documentation contract, the AGENT.md/WORKFLOW.md root files, the standing-directive merge, and the execution relay live there.
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
verification failure still lacks owner sign-off. Vanguard treats the catalog
fallback as a gated lane of its own: beyond-lock candidates carry their own
evidence and their own owner approval, and the locked approval never covers
them. Binding stays roster-first on every single dispatch, recorded per lane,
with no silent generic lane anywhere.

Task dispatch (mandatory): see [task-dispatch.md](task-dispatch.md) — the phase-kit map contract, the dispatch scenarios, the announce-then-inject law, and the binding protocol live there.
## Outputs

- The kit shortlist table with candidate, kind, tier, score note, and overlap ruling, consumable as
  the approval ballot with no guessing about why each row survived or fell.
- The verification report table with tool, kind, status, evidence, and how to fix, consumable as the
  sign-off sheet for every installed component.
- The selected tokens with id, kind, source, install command, phase, verify
  note, and status read from `registry/catalog.json`, mirrored at `docs/04-kit/15-SELECTION-RECORD.json` with the kit inventory beside it at
  `docs/04-kit/14-KIT-INVENTORY.md`.
- For any proposed `cli` entry, the approval record with the tool's recorded pricing, free-tier
  limits, licence, and date recorded, so a later audit can tell what the terms were when the owner
  said yes.
- The generated twenty-eight-file documentation set in its eight folders, with the reserved workflow
  name recorded and the archive manifest written.
- The Arabic relay prompt with its four sections and the owner-goal slot, handed to the owner ready
  to paste, whose returned concept feeds the next Vanguard run.
- The OPEN CHOICE inventory with kind plus phase plus tier plus trigger shown
  for every candidate before the shortlist narrows anything, read live from
  the lock and the generated mirror rather than from a frozen mapping.
- The fallback shortlist with its separate explicit approval, naming every row
  accepted from beyond the locked set with its evidence and overlap ruling.
- The agent validation record with file, name check, and mode check stated for
  every agent installed or dispatched, and file plus reason for every reject.
- The installer hygiene note with vestigial denies removed and any global scope
  warning stated in one line beside the approval that scope still needs.
- The initial report with the from-zero summary, current problems with proof,
  future problems with probability plus impact plus prevention, improvements
  ranked by impact against effort, and every claim traced to the code read.
- The binding record naming role, agent, and dispatched target for every lane,
  with any generic fallback reason stated in one line beside that lane.
- The `AGENT.md` install record: the path, marked created or repaired, with
  each of the six sections marked created or kept beside the run date.
- The `WORKFLOW.md` seed record: the path, the Part A revision notes
  carried forward with the new note appended, and the task Part B was
  written for.
- The directives merge record: the `AGENTS.md` path with owner content
  marked preserved, the kit region marked wrote or replaced, the pointer
  line marked present, and the generated mirror marked regenerated with its
  read-back match stated.
- The forge install record: the directory path, the exact command run, and
  the read-back proof with the `verify-skills.mjs` exit code beside it.
- The companion-config merge record: every merged key with its before and
  after values, the config path resolved in the target tree, and the
  restart noted as pending until the owner confirms the reload.

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
- A CLI tool is installed without owner approval, or a replacement candidate that is not clearly and
  significantly better is surfaced as a proposal. Installing on Vanguard's own authority rewrites
  the owner's machine without consent, and a marginal replacement raised as a proposal produces the
  nagging the policy exists to stop; drop it silently instead.
- Vanguard installs from beyond the locked set on the locked approval alone.
  The fallback needs its own explicit approval naming its rows; without that
  approval the install lane stops before any beyond-lock row runs.
- Vanguard selects from a hardcoded mapping instead of the live lock and live
  mirror. Re-derive the map from the files in force and re-present the plan
  before anything injects.
- An agent definition fails validation at install time. Vanguard rejects it
  with file and reason stated, and refuses dispatch on it until repair lands.
- A vestigial deny entry against skills survives the install, or a global skill
  install lands without its one-line noise warning. Vanguard removes the entry,
  states the warning, and re-confirms scope with the owner before proceeding.
- The initial report ships without a mandated part, or a claim ships without
  its source file. The report returns unapproved until every part is present
  and every claim traces to code Vanguard actually read.
- A dispatch lands on a generic agent without a stated reason, or a role ships
  without its binding record. Vanguard rebinds through the roster-first rule
  and records role, agent, and dispatched target before running anything.
- Vanguard overwrites an existing `AGENT.md` instead of repairing it
  additively. The task log and the decisions it held are unrecoverable, so
  prevention is the only fix: create only what is absent and report each
  section as created or kept.
- A section of `AGENT.md` or a part of `WORKFLOW.md` is invented from
  memory. Vanguard re-seeds the section from the template asset, and Part A
  from the forge canonical copy, then re-verifies before the docs gate
  closes.
- Owner content in `AGENTS.md` is clobbered, or the pointer line is missing
  or reworded. Vanguard restores the owner content from the pre-merge read,
  rewrites the region from the canonical text, and holds the docs gate
  until the pointer line matches verbatim.
- The generated mirror is hand-edited or left stale. Vanguard regenerates
  it from the merged source and reads both files back. A hand edit is
  drift, and drift is repaired, never kept.
- Companion-config keys merge without a read-back, or the new routing is
  claimed before the restart. Vanguard re-reads the file, reports every key
  again, and keeps the routing pending until the reload is confirmed.
- The forge skill is installed from any path but its directory path, or a
  top-level enumeration still reads three. Vanguard reinstalls by the
  stated command and corrects the count to four wherever the four skills
  are named.
