---
name: vantrilex-doctrine
description: Governs all project work — use when the owner asks which workflow applies or who decides a gate, or how a task should be split across subagents, stating the laws and phases for every build and review and release lane.
---

# Vantrilex Doctrine

## Purpose

Doctrine is the law-book and drill manual for every build, review, and release session. It states
the seven constitutional laws, assigns decision rights across the Leader, Guide, and Implementer
roles, binds each lifecycle phase to its kit, defines the five workflows with their gates and
done-definitions, fixes the session rituals, and states the parallel-execution law that the rest of
the book assumes. Read it when the question is what the rules are, which workflow applies, or who
decides; it answers all three, and it answers them the same way every session. Four top-level
skills exist and they run in one fixed order: `vantrilex-prime` orients the machine once,
`vantrilex-vanguard` equips the project once per project, `vantrilex-workflow-forge` authors
the standing methodology before execution, and `vantrilex-doctrine` governs how the work runs
once the kit is installed. It also owns one artifact inside every project it governs: the
canonical standing-directive text merged into that project's `AGENTS.md` and mirrored into
the generated `CLAUDE.md`, re-verified on every later run, so the permanent rules are stated
once in the file the OpenCode V2 runtime auto-loads instead of being repeated in work orders.

## When to Use

- Any review and release work, and any build work that needs a ruling on what the rules are or which
  workflow applies.
- When dispatching, sequencing, or aborting work across roles, when decomposing a task into its
  maximum number of independent units, and when asking who decides a dispute, a gate verdict, or a
  halt.
- At every phase transition, before injecting the next phase kit and pruning the last one.
- When a defect resists fixing and the breaker must be armed, or when a gate fails and the verdict
  must be held.
- At every equip run and every later run on an equipped project, to merge the standing-directive
  region into the target project's `AGENTS.md` when it is absent and to repair it when it has
  drifted, then to regenerate the generated `CLAUDE.md` mirror from it, following B.8.

## Do NOT use

- To survey sources, select components, or install the kit on a fresh project — that equip run
  belongs to Vanguard, which already pinned the kit this skill injects per phase.
- To carry the standing directives inside a work order. The region under B.8 is their single home
  once it is on disk, and a directive restated inside a brief is a second copy that will drift
  from the one the target project's agents actually read.
- To write the region into `docs/25-AI-CONSTITUTION.md` or to merge it with the laws that file
  holds. The constitution holds the project's own immutable laws and the region holds the permanent
  Arsenal directives; one file carrying both makes it impossible to change one without rewriting
  the other.
- To orient a machine or restate the Arsenal itself — that is `vantrilex-prime`, which runs before
  Vanguard and before this skill on a fresh machine. Doctrine names that hand-off and never expands
  it.
- To restate the halt message or the report template of circuit-breaker-guard — point at that skill
  instead; its template has a single home there and this file never carries a second copy, because
  two copies of a halt procedure will disagree at the worst possible moment.
- To overrule a Guide verdict, waive a guard silently, or reopen a halt under schedule pressure.
  Pressure is logged as evidence, never treated as authority.
- To hand-edit generated artifacts (the catalog Markdown, the per-kind index files, the `CLAUDE.md`
  mirror); change the generator or the data sidecar and regenerate, so the source and the mirror
  can never disagree.
- To start execution before the forge skill has authored the standing methodology. The run invokes
  the forge by its skill id `vantrilex-workflow-forge` at each task start and seeds Part A of the
  target `WORKFLOW.md` from the canonical copy it carries; a start without that invocation fails
  its gate and the run stops before the first dispatch.
- To close a task without the two landings the close gate requires: a dated revision note on Part A
  of the target `WORKFLOW.md` when the methodology changed, and the per-task `AGENT.md` update
  beside it. A close without both landings fails the gate and the run stays open.
- To let anyone but the orchestrator write the target `AGENT.md`, or to leave it unrotated when the
  task log outgrows one file. Only the orchestrator writes it, after every task, rotating closed
  entries into `docs/agent-log-YYYY-MM.md`; any other writer fails the close gate.
- To provision, install, or configure a language server on the kit's authority. The lock's `lsp`
  entry is a need-label pointing at the project's own typecheck and lint commands, and the run
  executes those commands and records their exit codes instead of installing a server.

## Inputs

- The current lifecycle phase (docs, plan, build, review, or operate) and the roadmap item in play.
- The dispatch brief: the concern, the Guide-approved acceptance criteria, the owning worktree and
  branch, the verification commands, and the artifact expected on disk.
- Gate evidence: the exact command run and its real output, never a summary of it. A summary is an
  interpretation, and gates rule on observations, not interpretations.
- The strike ledger for any live defect id, and the owner's recorded decisions.
- For the standing-directive run: the target project's root directory, the current contents of that
  project's `AGENTS.md` and its generated `CLAUDE.md` mirror when each file exists, and the deployed
  kit stated in `.opencode/equip.manifest.json` plus the catalog version in `registry/catalog.json`,
  read there rather than remembered.

## Parallel execution first

Every task is decomposed into the maximum number of independent parallel units, and those units fan
out across subagents. Never run two independent units in sequence, and never absorb them into one
unit. The goal is stated plainly and is not a preference: split the task as far as it will split, so
the work finishes while one agent is still on the first unit. A dispatch shape narrower than the
dependency graph allows is a planning defect, corrected by re-slicing before work starts rather
than by proceeding.

The reasoning is not only speed, and a reader who holds only the speed argument will drop this law
at the first deadline. A maximally decomposed task is a task whose units each carry a contract small
enough to state in one dispatch brief and check in one pass: one concern, one acceptance criterion,
one named verification command, one expected artifact. The same split is what makes a failure
survivable — a rejected unit fails alone, its neighbours keep the results they landed, and the
Leader redispatches one node instead of restarting a chain. Serial execution concentrates every
dependency in the longest chain and pays for it at the end, where the cost is highest and the
context is coldest.

### Rule 1 — Spot the independent nodes

Independence is a property of a pair of units, never of the task as a whole. Two units are
independent when all three of these hold, and any one of them failing makes the pair a chain:

- **No shared write target.** No file, artifact, or branch that both units would write.
- **No read-after-write dependency.** Neither unit reads what the other writes. Reading a shape the
  other unit is still changing is a chain, even when the two units never touch the same line.
- **No shared mutable state.** No shared index, lock file, port, cache, scratch directory, or
  in-memory handoff where one unit's progress is visible to the other.

Apply the test as a list, not a judgement call: write down every unit's write targets and read
targets, then chain every pair that shares one. A pair that shares nothing is a fan-out, and the
absence of a shared target is a fact you can point at — which is what makes it a rule rather than a
judgement. A unit with no artifact expected on disk is not a unit at all; it has no verifiable
contract, so keep splitting until each one names what it lands.

### Rule 2 — Build the graph: plan once, fan out, then chain

Plan once, into a directed graph, before the first dispatch. Then run it in one direction: every
node whose predecessors have landed goes out in the same wave, and every node with a live
predecessor waits. **Plan once** forbids three things: replanning mid-flight after seeing partial
results, dispatching a dependent node while its predecessor is still in flight, and adding a node
the graph never contained without going back through the Leader's sequencing decision. Partial
results inform the next wave; they never redraw the current one.

The **fan-out boundary** is the ready set: every node whose predecessors are landed, capped only by
the concurrency the Leader sets. One concern per worktree, one worktree per node, on branch
`wt/<concern-slug>`. The Leader owns the graph, so the boundary is a decision it makes and records —
never a number inherited from how the task happened to be written down.

### Rule 3 — One owner per shared resource

Exactly one branch owns a file, a sidecar, a generated mirror, a ledger, or the checkpoint at a
time. Two writers on one file lose data, and they lose it silently: both units read the same base,
each produces a whole-file result, and the merge keeps one side while the other unit's work
disappears with no error anywhere. A conflict is the lucky case, because a conflict is visible.

Resolve a shared target in one of two ways, never by coordinating at merge time:

- **Chain the units.** A lands and is merged; B then reads A's result and rewrites the file, carrying
  A's content forward deliberately rather than by luck.
- **Split the file** so each unit owns a disjoint region, and record the ownership in the dispatch
  brief so neither can drift into the other's region.

Merging two writers and repairing the result afterwards is forbidden: the repair is a rewrite from
memory of what was lost, which is exactly the guess Law 5 exists to prevent.

### Rule 4 — The orchestration pattern

This is §33B in its concrete form, and the coding agent never performs project work itself. The lead
agent plans the graph once, dispatches it, verifies every landing itself, and integrates the
results; subagents execute and nothing else. One turn of the loop: build the graph → dispatch the
whole ready set at once → await the wave → verify each landing (the branch exists, the diff carries
that one concern and nothing else, the named command actually ran) → merge it through review →
open the next wave. Work performed by the lead outside a dispatched subagent's worktree is discarded
and redispatched, which is why the lead's own loop contains no editing step.

### Named anti-patterns

**The serial slog.** Signature: a brief that reads step after step with each step waiting on the
last, one concern in flight at a time, and wall-clock time equal to the sum of the unit times when
the steps share nothing. Wrong because it presents a planning failure as caution, and because it
buries the fact that most steps touch disjoint files. Correction: list every step's write and read
targets, chain only the pairs that share one, and dispatch the rest in one wave.

**The god-agent.** Signature: one subagent brief covering several concerns, one worktree holding an
unbounded diff, a verification step that says only "review the output". Wrong on three counts —
nothing in it can be verified against a criterion, nothing in it can run concurrently with anything,
and one rejected concern invalidates the whole diff. It also defeats Law 5, because a landing that
large cannot be checked in one pass. Correction: re-split until every brief is one concern, one
acceptance criterion, one named command, one artifact. A unit that genuinely cannot be split is a
specification defect and goes to the Guide, not into a larger brief.

**The write collision.** Signature: two branches touching one file, a merge conflict on a file
neither concern claimed, a regenerated mirror that silently reverts another branch's rows. Wrong
because the loss is invisible until the content is needed, and because it is the single-writer law
broken outright. Correction: stop the second branch at once, let the Leader re-sequence so the file
has exactly one owner, or split the file into disjoint regions before either branch proceeds.

Parallelism without the graph is only simultaneous editing. The graph is what makes it safe, and
every landing is confirmed when its result is on disk or on the remote — never on a subagent's word.

## Procedure

### B.1 — Constitutional laws

Laws 1 and 5 are the spine: the agent directs and never touches the work itself, and nothing counts
as done until its result lands where the agent can verify it. The other five exist to protect those
two — the breaker stops blind repetition, phase scoping and the cost guard keep context spend
honest, the ledger keeps decisions authoritative, and docs discipline keeps the record findable.

| Law | Statement | Consequence of breaking it |
| 1 | The agent never works directly — it directs subagents only. It plans, dispatches, verifies, and merges; Implementers write. | Work performed outside an Implementer worktree is discarded and redispatched through the ladder. |
| 2 | 3-strike circuit breaker: the same defect surviving three consecutive failed fix attempts halts the workstream and produces an incident report via circuit-breaker-guard; resume only on a Guide-approved changed hypothesis. | A fourth blind attempt is forbidden; any work after the third strike without approval is void. |
| 3 | Phase-scoped kit: inject per phase, prune after; the 8-MCP cap stays as a backstop. | Out-of-phase context spend is a planning defect; prune, then inject. |
| 4 | Cost guard: prefer Skill or CLI over MCP on ties. | A heavier transport chosen without a capability reason is sent back for substitution. |
| 5 | Dispatch confirmed only when its result lands on disk or on the remote — never on a subagent's word; the agent verifies it itself. | Reported-but-unlanded work counts as not done and is redispatched. |
| 6 | Ledger principle: the owner's decision is the authoritative entry, recorded per item. | Any action contradicting a recorded owner decision is reversed. |
| 7 | Docs discipline: no Markdown outside the numbered set or an allow-listed directory — `brand/` is allowed because it holds the visual identity specification (hook-gated). | Stray files are folded into the document that already owns the topic, or removed. |

**Law 1 — The agent never works directly.**
The agent plans, dispatches, verifies, and merges; only Implementers write. Direct edits bypass the
worktree, the review, and the ledger all at once, which is why the consequence is discard rather
than retroactive approval: **Consequence:** any edit made outside an Implementer worktree is
discarded and redispatched through the ladder.

**Law 2 — 3-strike circuit breaker.**
The same defect surviving three consecutive failed fix attempts halts all execution on that
workstream and produces an incident report via circuit-breaker-guard. Three identical failures carry
information — the hypothesis is wrong, not the effort — so resume needs a Guide-approved changed
hypothesis, not a fourth attempt at the same one. **Consequence:** a fourth blind attempt is
forbidden; work performed after the third strike without approval is void.

**Law 3 — Phase-scoped kit.**
Inject per phase, prune after; install once centrally. The 8-MCP cap stays as a backstop.
**Consequence:** context spent on out-of-phase components is a planning defect; prune, then inject.

**Law 4 — Cost guard.**
Prefer Skill or CLI over MCP on ties. A lighter transport that does the job leaves context for the
work itself. **Consequence:** a heavier transport chosen without a capability reason is sent back
for substitution.

**Law 5 — Dispatch confirmed only when its result lands.**
A dispatch is confirmed only when its result lands on disk or on the remote — never on a subagent's
word; the agent verifies it itself. Trusting a success claim without the artifact is how phantom
progress enters the checkpoint. **Consequence:** reported-but-unlanded work is treated as not done
and redispatched.

**Law 6 — Ledger principle.**
The owner's decision is the authoritative entry; the ledger records it per item. **Consequence:** any
action contradicting a recorded owner decision is reversed.

**Law 7 — Docs discipline.**
No Markdown outside the numbered set or an allow-listed directory (hook-gated). `brand/` is
allow-listed because the visual identity specification lives there. Scattered notes rot
because nobody knows which one is current; one numbered home per topic stays findable.
**Consequence:** stray files are folded into the document that already owns the topic, or removed.

### B.2 — Roles and decision rights

Decide at the right level or decide twice: a routing call made by an Implementer gets re-planned by
the Leader, and a verdict made under pressure gets re-litigated by the Guide. The three roles below
draw the lines so each decision is made once, by its owner.

### Leader

Implemented as `.opencode/agents/vantrilex-leader.md`. Owns the outcome.
Decides: **routing, sequencing**, and abort; which workstreams run, at what concurrency, in which
worktrees; the dispatch shape.
**Does not decide:** the technical approach, code quality, guard verdicts, gate passage, or
acceptance criteria. A decision made at the wrong level is a decision that will be redone.

### Guide

Implemented as `.opencode/agents/vantrilex-guide.md`. Owns quality.
Decides: the **specification and its acceptance criteria**, what each gate requires and what evidence
proves it, phase-exit sign-off and its refusal; invokes the circuit breaker; escalates scope and
sequencing decisions, unresolvable conflicts, resource and tooling gaps, and every circuit-breaker
halt to the Leader.
**Does not decide:** routing, sequencing, concurrency, abort, or the technical approach.

### Implementer

Implemented as `.opencode/agents/vantrilex-implementer.md`. Owns the build inside one concern.
Decides: the **technical approach and internal design within the spec**, the fix hypothesis for one
attempt, refactoring inside the concern. Works TDD micro-cycles in an isolated worktree. **Never
widen scope. Never redefine acceptance criteria.**
**Does not decide:** acceptance criteria, scope, guard validity, or sequencing against other
workstreams.

### Escalation ladder

Problems travel up exactly one level at a time; resolutions travel back down carrying authority.

- **Implementer → Guide:** specification ambiguity, disputed guard findings, and hypothesis-change
  requests. Each arrives with one falsifiable hypothesis plus the evidence behind it.
- **Guide → Leader:** scope and sequencing decisions, cross-task conflicts unresolvable within the
  plan, resource and tooling gaps, and every circuit-breaker halt.
- **Skipping a level hides information.** An escalation without its evidence, its attempt history,
  and the exact point of ambiguity is a complaint, not an escalation. **Escalations carry evidence,
  not blame.**

### Worktree mechanics

One concern per worktree, on branch `wt/<concern-slug>`; Implementers never work on the main
checkout. Merges return reviewed and signed off back to `main`. Never two branches writing one
file: two concerns touching the same file are not independent and must be chained, not fanned out —
parallel writes to one file merge into exactly the conflict this discipline exists to prevent.

### B.3 — Phase map (mandatory)

The phase map is mandatory. The `phase` field in `registry/catalog.json` is the injection and
pruning mechanism (kit spec 6.4): install once centrally; inject per phase, prune after. A phase
that keeps the previous phase's kit pays for context it no longer uses while the new phase starves.

| Phase | Skills |
|---|---|
| docs | `grill-me` (before docs), `session-context-primer` |
| plan | `wayfinder` (decision tickets), `ask-matt` (router) |
| build | `tdd`, `ponytail`, `preflight-system-doctor` (step 0) |
| review | `code-review` (two-axis), `ponytail-review` |
| operate | `ponytail-audit` (periodic), `ponytail-debt` (ledger) |
| on-demand | `find-skills`, `skill-creator` |

`preflight-system-doctor` is step 0 of the build phase: it verifies the machine and session ground
truth before any build dispatch. `on-demand` is outside any phase: `find-skills` and
`skill-creator` are never injected by phase and stay available to every phase. At each phase
transition: prune, then inject — never stack two phases of kit.

Catalog status, reported and never silent: `session-context-primer` (tier `conditional`, phase
`docs`) and `preflight-system-doctor` (tier `conditional`, phase `build`) are catalogued and their
phases match this map; `ponytail-debt` is catalogued with phase `operate`, also matching this map,
but carries a null `tier` where its peers carry `core` or `conditional`. The map above governs
regardless; the tier backfill follows.

Language-server state, read from the lock rather than remembered: the lock carries one entry of
kind `lsp`, `typescript-lsp`, in phase `build` and tier `core`, with a null install command and
`verification: unverified`. The OpenCode V2 runtime runs no language servers and produces no
diagnostics, so the entry is a need-label pointing at the project's own typecheck and lint
commands, never a provisioning record. No run installs or configures a server on its authority:
the run executes the project's typecheck and lint commands and records their exit codes instead.

### B.4 — Workflows

Each workflow states its trigger, required kit, steps, gates, and done-definition — the same five
headings every time, so a reader who knows one workflow can read them all. Target-project mirrors
of these workflows live at `docs/19-FEATURE-WORKFLOW.md` through `docs/22-BUGFIX-WORKFLOW.md`,
authored from this skill.

Two forge laws bind every workflow below. No execution starts before the forge skill authors the
standing methodology: the orchestrator invokes the forge by its skill id `vantrilex-workflow-forge`
at each task start, seeds Part A of the target `WORKFLOW.md` from the canonical copy it carries,
and only then dispatches. No task closes without its two landings: a dated revision note on Part A
when the methodology changed, and the per-task `AGENT.md` update from Ritual 2 beside it. Part B
of `WORKFLOW.md` turns over freely with the work; Part A changes only with a dated note stating
what changed and why. A start without the forge invocation, or a close without both landings,
fails its gate and the run stops.

#### Workflow 1 — Feature

**Trigger:** an owner-approved spec and a roadmap item entering build.
**Required kit:** `session-context-primer` (start ritual), `wayfinder` and `ask-matt` (plan), `tdd`
and `ponytail` (build), `code-review` and `ponytail-review` (review).
**Steps:** 1. The Guide writes the spec with observable acceptance criteria. 2. The Leader plans once
and builds the dependency graph. 3. Implementers open one worktree per concern on
`wt/<concern-slug>`. 4. TDD micro-cycles to green. 5. Two-axis review. 6. Guide sign-off and merge
to `main`.
**Gates:** spec approval before any code; both review axes pass; the release guards re-check at the
end. Code before spec approval is the failure this gate exists to catch.
**Done when:** the concern is merged to `main` with a recorded Guide sign-off, and the checkpoint
carries the landing.

#### Workflow 2 — Review

**Trigger:** a diff or branch declared ready for review.
**Required kit:** `code-review` (two-axis), `ponytail-review`.
**Steps:** 1. Freeze the diff under review. 2. Fan out two parallel subagents, one per axis: axis A
judges standards, axis B judges the specification. 3. Aggregate the findings without merging the
axes — the two axes are distinct, and conflating them is the usual failure. 4. The Guide issues the
verdict.
**Gates:** both axes report with evidence; disputed findings escalate to the Guide; nothing merges on
a partial review. A moving diff under review means the verdict certifies code nobody froze.
**Done when:** a pass or fail verdict with its evidence is recorded against the diff.

#### Workflow 3 — Security audit

**Trigger:** a release candidate, a new dependency, or an owner-ordered audit.
**Required kit:** the ai-generated-code-security-auditor agent, the security-guidance plugin, and a
secret scan gate.
**Steps:** 1. Inventory the attack surface. 2. Run the auditor lane over the diff. 3. Apply the
security-guidance rules. 4. Run the secret scan. 5. Route every finding into the bugfix workflow
under its own defect id, because an audit finding without a defect id is a note that will be lost.
**Gates:** the secret scan is clean; the auditor sign-off is recorded with its evidence.
**Done when:** the scan output and the auditor report are filed with zero open critical findings.

#### Workflow 4 — Bugfix

**Trigger:** a failing test or probe with an assigned defect id (`DEF-<NNN>`).
**Required kit:** `tdd` and circuit-breaker-guard; the breaker is armed throughout, because a fix
loop without a strike count is a loop without an exit.
**Steps:** 1. Assign the defect id and reproduce the failure. 2. State one falsifiable hypothesis
before touching code. 3. Apply **exactly one fix** per attempt. 4. Re-run the same verification. 5.
Record the outcome in the ledger per defect id; repeat until green or halt.
**Gates:** the original probe passes; at three strikes the workstream halts for an incident report,
and only a Guide-approved changed hypothesis reopens it.
**Done when:** the root symptom is gone, the probe passes, and the ledger entry for the defect id
is closed.

#### Workflow 5 — Release

**Trigger:** the operator runs the release command; the entry point is
`.opencode/command/release.md`.
**Required kit:** the three second-pass guards below plus the release command itself.
**Steps:** 1. **Changelog.** Confirm `CHANGELOG.md` carries the pending version in the same change,
under the right heading. 2. **Semver check.** Validate the version against Semantic Versioning:
removed or renamed public surface forces MAJOR, added surface forces at least MINOR, fixes alone
need only PATCH; the version must be strictly greater than the latest tag. 3. **Tag.** Create the
annotated tag `v<version>` pointing at the release commit. 4. Publish with `gh release create`,
taking the notes from the changelog entry. 5. Run fresh-clone verification from outside the
worktree: clone the tag, run install, build, and test in order, and record each exit code. The
fresh clone matters because the worktree carries state the tag does not — verifying the worktree
proves the wrong artifact.
**Gates:** **Clean Code** — no dead code and no duplication; names that state intent; shallow
complexity on every path; no speculative abstraction; every error path has a defined outcome.
**Test** — every requirement maps to a test asserting observable outcomes; the suite carries no
flaky tests, using fixed clocks and seeded randomness with no network or wall-time dependence; the
suite reads as a specification of the behaviour. **Docs** — docs match current behaviour; every
relative link resolves; the changelog carries the change in the same commit; all commands run green
on a clean checkout.
**Done when:** the tag is pushed, the release is published at the URL `gh` reports, and the fresh
clone verifies with recorded exit codes.

### B.5 — Session rituals

#### Ritual 1 — Start

Read `docs/25-AI-CONSTITUTION.md` and `docs/00-PROJECT-SUMMARY.md`, then delegate the anchor
mechanics to `session-context-primer` and consume the single anchor block it emits (~10s budget; an
approximate anchor now beats a perfect anchor late). The anchor format has its single home in
`session-context-primer`, which defines the seven fields the anchor carries — mission, phase,
branch, worktrees, next item, guards, and circuit state — and Doctrine consumes the anchor rather
than defining it. At the start of every task, the orchestrator then reads `AGENT.md` and
`WORKFLOW.md` in the project root before planning or dispatching anything, as the pointer line in
the `AGENTS.md` kit region states verbatim, and invokes the forge by its skill id
`vantrilex-workflow-forge` so Part A of `WORKFLOW.md` is authored before execution begins.

#### Ritual 2 — End

Persist learnings to `docs/17-CHECKPOINT.md` (what changed, what is in flight, what is halted, what
was deliberately not started). Record decisions with record-decision.sh into the ledger so the next
session inherits every ruling instead of rediscovering it. Then the orchestrator updates the target
root `AGENT.md` itself, in the fixed entry shape below: no task closes without this update, and no
Implementer writes it. The update appends one dated entry per unit of work, refreshes the
current-state section to the landing, and files decisions, open items, and defects beside their
dates. When the task log outgrows one file, the orchestrator rotates closed entries into
`docs/agent-log-YYYY-MM.md` for the month in which they closed, keeping the live file short and
the archive dated. A close without the update, or an update written by anyone but the
orchestrator, fails the close gate and the run stays open.

```text
YYYY-MM-DD — <unit of work>: <outcome observed> (<evidence: commit, command, or file>)
```

#### Ritual 3 — Pre-compact

Save state before compaction: the checkpoint, the strike ledger, the worktree list, and the pending
item. A compacted session resumes from the saved state, never from memory — memory is exactly what
compaction just discarded.

### B.6 — Skill-file format standard

Every `SKILL.md` carries frontmatter with exactly `name` plus `description`, then the body sections
Purpose, When to Use, Do NOT use, Inputs, Procedure, Outputs, Failure Modes, in that order. The
`name` is lowercase-hyphenated and identical to the containing folder name; the description states
what the skill does and when to trigger it, front-loading the trigger so the router sees it first.
There are no unfinished-work markers and no stubs: every file is written in full on creation and
never left empty, because a stub filed today becomes the missing foundation of a failed gate next
month.

### B.7 — Parallelism mechanics

The four rules, the ready-set fan-out boundary, single-writer on every shared target, the
lead-plans-and-integrates loop, and the three named anti-patterns are stated once, above, under
Parallel execution first. This entry exists so a reader arriving at the B-series can find them
without reading the whole file, and it deliberately carries no second copy: two versions of the
same law will disagree at the worst possible moment.

### B.8 — Standing directives in the target project's `AGENTS.md`

Six directives are permanent. They used to be restated in every work order, which
meant the cost was paid again on each dispatch and any edit had to be replayed
into every brief already sent. They now live in one place instead: a delimited
region inside the target project's `AGENTS.md`, merged once and re-verified
forever after, with the generated `CLAUDE.md` mirror rebuilt from it on every
run. This section states where the region lives, what it says, when Doctrine
writes and verifies it, and how it is extended without touching a word the owner
wrote.

The region is read every session, so it carries no Arsenal internals and no
version numbers of its own: it states the six rules, carries the pointer line
that opens every task, names the owner, and stops. Everything an implementing
agent needs in order to place and repair the region sits in the prose around
it, never inside it.

#### B.8.1 — Where the region lives

One file, one region, one owner. The region lives at the repository root of the
equipped project, in `AGENTS.md`, merged after whatever the owner already wrote
there. The OpenCode V2 runtime auto-loads that file and that file alone: not the
generated mirror, not `AGENT.md`, and not the accepted-but-inert instructions
array. The merge never clobbers: every owner line outside the sentinels stays
exactly as written, and only the text between the sentinels is kit content. The
region is never written into the project's `docs/` series and is never merged
into `docs/25-AI-CONSTITUTION.md`: the constitution holds the project's own
immutable laws, the region holds the permanent Arsenal directives, and mixing
them makes it impossible to change one without rewriting the other. A directive
restated inside a work order is a second copy of a permanent rule, and two
copies of a permanent rule will disagree.

Two HTML comment sentinels delimit the region, so the region is findable by exact
string match and an agent can never mistake the owner's prose for kit content:

```text
<!-- vantrilex:agents-directives:begin spec=agents-directives@v1 -->
<!-- vantrilex:agents-directives:end -->
```

The opening sentinel carries the spec marker. The closing sentinel closes the
region and carries nothing else. `agents-directives` is the name and `v1` is
the revision; the marker exists so a later revision of the region can be told
apart from an edited or damaged one by reading a single line.

The generated mirror is `CLAUDE.md`, named here as the single authority for that
name. Vanguard carries no copy of it: it regenerates that file from the merged
`AGENTS.md` region on every run and never hand-edits it, so the source and the
mirror can never describe different rules.

#### B.8.2 — The canonical region

The region below is the exact text Doctrine merges. Copy it verbatim, including
both sentinels, the pointer line, and the blank line that separates the region
from the owner's content. The kit is the only writer: an agent that finds the
region missing writes it from here, and an agent that finds it drifted restores
it from here.

```text
<!-- vantrilex:agents-directives:begin spec=agents-directives@v1 -->

<!-- Written by the Vantrilex Arsenal. This region is maintained by the kit. To
     change it, edit the canonical copy in the Arsenal's doctrine skill; to add
     your own instructions, put them outside the sentinels above and below. -->

## Standing directives

These rules are permanent. They are set by the Vantrilex Arsenal and they are
not preferences, defaults, or suggestions.

At the start of every task, read AGENT.md and WORKFLOW.md in this project root before planning or dispatching anything.

1. **Plan once, then fan out.** Every task is planned once, up front, into a
   dependency graph. Independent tasks go to named subagents and run in parallel.
   Only a real dependency is chained. Exactly one writer owns each shared file,
   branch, or resource.
2. **Management only.** The orchestrator plans, dispatches, reviews, and
   integrates. Subagents execute the work. The orchestrator never executes node
   work itself.
3. **No commit, no push to main.** The kit never commits to `main` and never
   pushes to `main`. Work lands on a branch and merges into `main` only after it
   is verified.
4. **Announce, then verify.** Completion is announced explicitly, with real
   commit hashes. An independent verifier checks the result from a fresh clone.
   The owner releases.
5. **Free models only.** Every agent uses the free model tier. A paid model is
   never used, on any agent, for any task. A model pin that is paid or
   unavailable is auto-corrected: the agent inherits the default, or an
   available free model.
6. **General is the last resort.** Never dispatch the generic agent when a named
   specialist fits. When no roster member fits the assignment, state the reason
   in one line, then proceed.

### Shared infrastructure

The Vantrilex Arsenal plugin provides the guard infrastructure for this
project: the session task-dispatcher that classifies each turn, the
documentation-discipline guard that keeps Markdown inside its allowed set, and
the versioned component kit installed per phase. Those guards are configured in
the Arsenal config file. They are infrastructure, not permission: nothing they
do, and no setting in them, overrides a directive above.

`docs/25-AI-CONSTITUTION.md` holds this project's own immutable laws and stands
beside this region. It is not replaced by it and does not restate it.

<!-- vantrilex:agents-directives:end -->
```

The region text has one canonical home: here. Each equipped project carries its merged copy
inside `AGENTS.md`, restored from here whenever it drifts, and the `CLAUDE.md` mirror is
generated from that merged copy on every run, never written by hand. The canonical copy is
changed only here, so the three can never describe different rules.

#### B.8.3 — When Doctrine writes and verifies the region

The region is written and checked at two moments, by one procedure:

- **At equip, when the kit is already installed and the project is about to be
  documented.** The kit writes or verifies the region before the documentation
  phase closes, then regenerates the mirror from it, so no project leaves an
  equip run without both.
- **On every later run on an equipped project.** The region is re-verified before
  the run's own gates, a drifted region is repaired at the start of that run
  rather than left for the owner to notice, and the mirror is regenerated from
  the repaired source before the run proceeds.

#### B.8.4 — When a directive is missing: repair, and block

A missing region is repaired, and the repair is a gate:

- **A directive missing from the region, or the region missing from `AGENTS.md`
  entirely.** Doctrine restores the region from the canonical copy in B.8.2.
  This is a **block**, not a warning: the equip run does not close and the later
  run does not proceed to its own gates until the region is on disk and verified.
  A warning would let a project that lost the region keep working, and every
  later work order in that project would pay the repetition cost again.
- **A directive edited, reordered, or weakened.** The same repair and the same
  region. The owner's own words outside the sentinels are preserved; anything
  inside the sentinels is kit content and the kit decides it.
- **The opening sentinel present with the closing sentinel absent, or prose
  written after the region.** Drift. The region is replaced through the end of
  the file, which trims whatever was written after the kit content.
- **The owner's own instructions inside the sentinels.** Also drift, and restored
  the same way. Custom instructions belong outside the sentinels, and the region
  says so in its own header comment.
- **The spec marker in `AGENTS.md` disagrees with the spec this skill carries.**
  Drift. The region is restored, which brings the marker with it.
- **The mirror disagrees with the merged region.** Drift. The mirror is
  regenerated from the source and read back; it is never patched by hand to
  match, because a hand edit is a second copy that will disagree again.

Verification checks four things and reports all four: the opening sentinel is
present, the closing sentinel follows it, the region between them matches
the canonical copy character for character, and the mirror matches the region it
was generated from. The check is a guard, so it is never
evaluated from a summary: both files are read and compared. When either file or
the canonical copy cannot be read, the check reports `unverified` with the reason
and is treated as failed, never skipped.

#### B.8.5 — Extending an existing `AGENTS.md` without destroying it

An equipped project usually has an `AGENTS.md` the owner wrote. The region is
appended to it, never written over it:

- **The file does not exist.** Create it holding the region, with no header
  invented above it, then generate the mirror from it.
- **The file exists without the opening sentinel.** Append one blank line, then
  the region, then generate the mirror. Nothing above the region is read, moved,
  or reflowed.
- **The file exists with the opening sentinel.** Replace exactly the region
  between the sentinels, and nothing above or below it that the owner wrote,
  then regenerate the mirror from the merged source.

The mirror is never written by hand under any branch above: every branch ends by
regenerating it from the merged source, reading both files back, and reporting
drift instead of editing the mirror to match.

Idempotence is a property of that algorithm, not a convention. The opening
sentinel decides which branch runs, so a second run over an already-correct
`AGENTS.md` takes the replace branch, produces a region identical to the
canonical copy, regenerates an identical mirror, and writes the same files it
read. Re-running never duplicates the region, never appends a second copy below
the first, and never touches the owner's text.

#### B.8.6 — The region and the kill-switch config

The six directives are not switchable. `.opencode/arsenal.json` is the
kill-switch config for the Arsenal's own guards, and as it stands it resolves
exactly two switches: `docsGuard`, which configures the documentation
discipline guard and carries `mode`, `allowedDirs`, `allowedFiles`, and
`series`, and `taskDispatcher.enabled`, which turns the session
task-dispatcher instruction off. Neither key reaches the directive region, and no
key in that file weakens a directive, because a permanent rule that a config
file can quietly turn off is not permanent.

The two config switches do bound the region's own mechanics. `AGENTS.md` and the
generated `CLAUDE.md` mirror sit in the docs-guard's `allowedFiles` default, so
merging the region and regenerating the mirror pass the guard on every project
that left `allowedFiles` at its default. A project that narrowed `allowedFiles`
must list both files there for the write to pass, and a `docsGuard.mode` of
`block` refuses the write until it does.

## Outputs

- A role-assignment record for every dispatch, in this exact shape:

```text
ROLE ASSIGNMENT RECORD
Concern : <one concern, named>
Owner   : <Leader | Guide | Implementer — exactly one>
Worktree: <path> (wt/<concern-slug>)
Brief   : <acceptance criteria + verification commands + expected artifact>
Decided : <date>
```

- A gate verdict for every gate, in this exact shape:

```text
GATE VERDICT
Gate    : <gate name>
Command : <exact command run>
Output  : <real output, never a summary>
Verdict : <PASS | FAIL | HALT>
Signed  : Guide (<name>), <date>
```

- The incident-report reference on every halt, in this exact shape:

```text
Diagnostic Incident Report
Emitted by circuit-breaker-guard on strike 3; the template has its single home there and this file never carries a second copy. Doctrine records the halt, the defect id, and the Guide sign-off that reopens the loop.
```

- A phase-injection manifest at every phase transition, in this exact shape:

```text
PHASE INJECTION MANIFEST
Phase   : <docs | plan | build | review | operate>
Injected: <skill names for this phase>
Pruned  : <skill names from the previous phase>
Cap     : <8-MCP backstop respected: yes>
```

- A standing-directive record for every run that writes or verifies the region, in this exact shape:

```text
STANDING DIRECTIVE RECORD
Source : <path to the target project's AGENTS.md>
Mirror : <path to the generated CLAUDE.md mirror>
Marker : <absent | present | present, drifted | unverified, reason>
Action : <wrote region | replaced region between sentinels | created file | regenerated mirror | none, already canonical>
Gate   : <PASS | FAIL — blocks the equip close and every later gate>
Spec   : <agents-directives@v1, matches the Arsenal doctrine skill: yes | no>
```

- An `AGENT.md` update record for every task close, in this exact shape:

```text
AGENT UPDATE RECORD
File   : <path to the target project's AGENT.md>
Writer : <orchestrator — no other writer passes the close gate>
Entries: <dated entries appended, one per unit of work>
Rotated: <none | docs/agent-log-YYYY-MM.md with the closed entries moved>
Gate   : <PASS | FAIL — a close without the update stays open>
```

- Authorship confirmation for the target-project workflow file: Vanguard generates 27 of the 28
  target-project docs; `docs/18-WORKFLOW.md` is the one it does not generate. Doctrine authors it —
  written in full on creation and never left empty — so the handoff is unambiguous.

## Failure Modes

- **Implementer redefines acceptance criteria.** Escalate to the Guide and never comply; work stops
  until the spec is rewritten with observable criteria. Complying once teaches the ladder that
  criteria are negotiable.
- **User pressure on a failed gate or halt.** Hold the verdict. Only a Guide-approved changed
  hypothesis reopens the loop; pressure is logged as evidence, never treated as authority.
- **Two branches writing the same file.** Stop the second branch at once — single-writer is absolute
  — and let the Leader re-sequence so the shared file has exactly one owner.
- **A subagent claims success but nothing is on disk.** Not done. The agent verifies it itself: the
  branch exists, the diff carries that concern and nothing else, and the named command actually
  passed.
- **A gate that cannot be evaluated.** FAILED, never skipped. An unevaluatable check fails the phase
  exit by definition.
- **A phase transition where the kit is not pruned.** Stop the transition: prune, then inject. Never
  stack two phases of kit.
- **Skipping a level hides information.** A question that jumps the ladder is sent back down one
  level with the reason stated; the ledger records every escalation and every verdict.
- **The standing-directive region is missing or a directive is gone from it.** Restore the region
  from B.8.2, regenerate the mirror from the restored source, and hold the run at its gate until
  both files on disk match the canonical copy. Passing a gate on a repaired-in-memory region is
  the same failure as a dispatch confirmed on a subagent's word.
- **The generated mirror is hand-edited or left stale.** Regenerate it from the merged `AGENTS.md`
  source and read both files back. A hand edit is drift, and drift is repaired, never kept.
- **Owner content in `AGENTS.md` is clobbered, or the pointer line is missing or reworded.**
  Restore the owner content from the pre-merge read, rewrite the region from the canonical text,
  and hold the docs gate until the pointer line matches verbatim.
- **Execution starts without the forge invocation.** Stop before the first dispatch and invoke the
  forge by its skill id `vantrilex-workflow-forge`; Part A of `WORKFLOW.md` is seeded from the
  canonical copy it carries, never written from memory.
- **A task closes without the Part A revision note or the `AGENT.md` update.** The close gate fails
  and the run stays open until the dated note states what changed and why and the orchestrator
  lands the per-task update, rotating closed entries into `docs/agent-log-YYYY-MM.md`.
- **Anyone but the orchestrator writes `AGENT.md`.** The write is discarded and rewritten by the
  orchestrator, because a task log with two writers loses entries the same way any shared file
  does under two writers.
- **A top-level enumeration still reads three.** The count is four — prime, vanguard, workflow-forge,
  doctrine — and every enumeration is corrected to four wherever the four skills are named.
- **A run provisions a language server or claims one is installed.** The lock carries no installer
  for its single `lsp` entry; the run executes the project's own typecheck and lint commands and
  records their exit codes instead.
