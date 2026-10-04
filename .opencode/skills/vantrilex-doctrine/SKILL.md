---
name: vantrilex-doctrine
description: Use when review and release work needs doctrine: states what are the rules, which workflow applies, and who decides each gate.
---

# Vantrilex Doctrine

## Purpose

Doctrine is the law-book and drill manual for every build, review, and release session. It states the seven constitutional laws, assigns decision rights across the Leader, Guide, and Implementer roles, binds each lifecycle phase to its kit, defines the five workflows with their gates and done-definitions, and fixes the session rituals and the parallelism mechanics. Vanguard equips the project; Doctrine governs how the work runs once the kit is installed.

## When to Use

- Any review and release work, and any build work that needs a ruling on what are the rules or which workflow applies.
- When dispatching, sequencing, or aborting work across roles, and when asking who decides a dispute, a gate verdict, or a HALT.
- At every phase transition, before injecting the next phase kit and pruning the last one.
- When a defect resists fixing and the breaker must be armed, or when a gate fails and the verdict must be held.

## Do NOT use

- To survey sources, select components, or install the kit on a fresh project — that equip run belongs to Vanguard.
- To restate the halt message or the report template of circuit-breaker-guard — point at that skill instead; its template has a single home there and this file never carries a second copy.
- To overrule a Guide verdict, waive a guard silently, or reopen a HALT under schedule pressure.
- To hand-edit generated artifacts (the catalog Markdown, the per-kind index files); change the generator or the data sidecar and regenerate.

## Inputs

- The current lifecycle phase (docs, plan, build, review, or operate) and the roadmap item in play.
- The dispatch brief: the concern, the Guide-approved acceptance criteria, the owning worktree and branch, the verification commands, and the artifact expected on disk.
- Gate evidence: the exact command run and its real output, never a summary of it.
- The strike ledger for any live defect id, and the owner's recorded decisions.

## Procedure

### B.1 — Constitutional laws

Laws 1 and 5 are the spine: the agent directs and never touches the work itself, and nothing counts as done until its result lands where the agent can verify it.

| Law | Statement | Consequence of breaking it |
| 1 | The agent never works directly — it directs subagents only. It plans, dispatches, verifies, and merges; Implementers write. | Work performed outside an Implementer worktree is discarded and redispatched through the ladder. |
| 2 | 3-strike circuit breaker: the same defect surviving three consecutive failed fix attempts HALTs the workstream and produces a Diagnostic Incident Report via circuit-breaker-guard; resume only on a Guide-approved changed hypothesis. | A fourth blind attempt is forbidden; any work after the third strike without approval is void. |
| 3 | Phase-scoped kit: inject per phase, prune after; the 8-MCP cap stays as a backstop. | Out-of-phase context spend is a planning defect; prune, then inject. |
| 4 | Cost guard: prefer Skill or CLI over MCP on ties. | A heavier transport chosen without a capability reason is sent back for substitution. |
| 5 | Dispatch confirmed only when its result lands on disk or on the remote — never on a subagent's word; the agent verifies it itself. | Reported-but-unlanded work counts as not done and is redispatched. |
| 6 | Ledger principle: the owner's decision is the authoritative entry, recorded per item. | Any action contradicting a recorded owner decision is reversed. |
| 7 | Docs discipline: no Markdown outside the numbered set (hook-gated, pending owner approval). | Stray files are folded into the document that already owns the topic, or removed. |

**Law 1 — The agent never works directly.**
The agent plans, dispatches, verifies, and merges; only Implementers write. **Consequence:** any edit made outside an Implementer worktree is discarded and redispatched through the ladder.

**Law 2 — 3-strike circuit breaker.**
The same defect surviving three consecutive failed fix attempts HALTs all execution on that workstream and produces a Diagnostic Incident Report via circuit-breaker-guard. Resume only on a Guide-approved changed hypothesis. **Consequence:** a fourth blind attempt is forbidden; work performed after the third strike without approval is void.

**Law 3 — Phase-scoped kit.**
Inject per phase, prune after; install once centrally. The 8-MCP cap stays as a backstop. **Consequence:** context spent on out-of-phase components is a planning defect; prune, then inject.

**Law 4 — Cost guard.**
Prefer Skill or CLI over MCP on ties. **Consequence:** a heavier transport chosen without a capability reason is sent back for substitution.

**Law 5 — Dispatch confirmed only when its result lands.**
A dispatch is confirmed only when its result lands on disk or on the remote — never on a subagent's word; the agent verifies it itself. **Consequence:** reported-but-unlanded work is treated as not done and redispatched.

**Law 6 — Ledger principle.**
The owner's decision is the authoritative entry; the ledger records it per item. **Consequence:** any action contradicting a recorded owner decision is reversed.

**Law 7 — Docs discipline.**
No Markdown outside the numbered set (hook-gated, pending owner approval). **Consequence:** stray files are folded into the document that already owns the topic, or removed.

### B.2 — Roles and decision rights

### Leader

Implemented as `.opencode/agent/vantrilex-leader.md`. Owns the outcome.
Decides: **Routing, sequencing**, and abort; which workstreams run, at what concurrency, in which worktrees; the dispatch shape.
**Does not decide:** the technical approach, code quality, guard verdicts, gate passage, or acceptance criteria. A decision made at the wrong level is a decision that will be redone.

### Guide

Implemented as `.opencode/agent/vantrilex-guide.md`. Owns quality.
Decides: the **specification and its acceptance criteria**, what each gate requires and what evidence proves it, phase-exit sign-off and its refusal; invokes the circuit breaker; escalates scope and sequencing decisions, unresolvable conflicts, resource and tooling gaps, and every circuit-breaker HALT to the Leader.
**Does not decide:** routing, sequencing, concurrency, abort, or the technical approach.

### Implementer

Implemented as `.opencode/agent/vantrilex-implementer.md`. Owns the build inside one concern.
Decides: the **technical approach and internal design within the spec**, the fix hypothesis for one attempt, refactoring inside the concern. Works TDD micro-cycles in an isolated worktree. **Never widen scope. Never redefine acceptance criteria.**
**Does not decide:** acceptance criteria, scope, guard validity, or sequencing against other workstreams.

### Escalation ladder

Problems travel up exactly one level at a time; resolutions travel back down carrying authority.

- **Implementer → Guide:** specification ambiguity, disputed guard findings, and hypothesis-change requests. Each arrives with one falsifiable hypothesis plus the evidence behind it.
- **Guide → Leader:** scope and sequencing decisions, cross-task conflicts unresolvable within the plan, resource and tooling gaps, and every circuit-breaker HALT.
- **Skipping a level hides information.** An escalation without its evidence, its attempt history, and the exact point of ambiguity is a complaint, not an escalation. **Escalations carry evidence, not blame.**

### Worktree mechanics

One concern per worktree, on branch `wt/<concern-slug>`; Implementers never work on the main checkout. Merges return reviewed and signed off back to `main`. Never two branches writing one file: two concerns touching the same file are not independent and must be chained, not fanned out.

### B.3 — Phase map (mandatory)

The phase map is mandatory. The `phase` field in `registry/catalog.json` is the injection and pruning mechanism (kit spec 6.4): install once centrally; inject per phase, prune after.

| Phase | Skills |
|---|---|
| docs | `grill-me` (before docs), `session-context-primer` |
| plan | `wayfinder` (decision tickets), `ask-matt` (router) |
| build | `tdd`, `ponytail`, `preflight-system-doctor` (step 0) |
| review | `code-review` (two-axis), `ponytail-review` |
| operate | `ponytail-audit` (periodic), `ponytail-debt` (ledger) |
| on-demand | `find-skills`, `skill-creator` |

`preflight-system-doctor` is step 0 of the build phase: it verifies the machine and session ground truth before any build dispatch. `on-demand` is outside any phase: `find-skills` and `skill-creator` are never injected by phase and stay available to every phase. At each phase transition: prune, then inject — never stack two phases of kit.

Catalog status, reported and never silent: `session-context-primer` and `preflight-system-doctor` are kit-local skills absent from `registry/catalog.json`; `ponytail-debt` is catalogued with a null `phase` while this map assigns it to operate. The map above governs regardless; the catalog backfill follows.

### B.4 — Workflows

Each workflow states its trigger, required kit, steps, gates, and done-definition. Target-project mirrors of these workflows live at `docs/19-FEATURE-WORKFLOW.md` through `docs/22-BUGFIX-WORKFLOW.md`, authored from this skill.

#### Workflow 1 — Feature

**Trigger:** an owner-approved spec and a roadmap item entering build.
**Required kit:** `session-context-primer` (start ritual), `wayfinder` and `ask-matt` (plan), `tdd` and `ponytail` (build), `code-review` and `ponytail-review` (review).
**Steps:** 1. The Guide writes the spec with observable acceptance criteria. 2. The Leader plans once and builds the dependency graph. 3. Implementers open one worktree per concern on `wt/<concern-slug>`. 4. TDD micro-cycles to green. 5. Two-axis review. 6. Guide sign-off and merge to `main`.
**Gates:** spec approval before any code; both review axes pass; the release guards re-check at the end.
**Done when:** the concern is merged to `main` with a recorded Guide sign-off, and the checkpoint carries the landing.

#### Workflow 2 — Review

**Trigger:** a diff or branch declared ready for review.
**Required kit:** `code-review` (two-axis), `ponytail-review`.
**Steps:** 1. Freeze the diff under review. 2. Fan out two parallel subagents, one per axis: axis A judges standards, axis B judges the specification. 3. Aggregate the findings without merging the axes — the two axes are distinct, and conflating them is the usual failure. 4. The Guide issues the verdict.
**Gates:** both axes report with evidence; disputed findings escalate to the Guide; nothing merges on a partial review.
**Done when:** a pass or fail verdict with its evidence is recorded against the diff.

#### Workflow 3 — Security audit

**Trigger:** a release candidate, a new dependency, or an owner-ordered audit.
**Required kit:** the ai-generated-code-security-auditor agent, the security-guidance plugin, and a secret scan gate.
**Steps:** 1. Inventory the attack surface. 2. Run the auditor lane over the diff. 3. Apply the security-guidance rules. 4. Run the secret scan. 5. Route every finding into the bugfix workflow under its own defect id.
**Gates:** the secret scan is clean; the auditor sign-off is recorded with its evidence.
**Done when:** the scan output and the auditor report are filed with zero open critical findings.

#### Workflow 4 — Bugfix

**Trigger:** a failing test or probe with an assigned defect id (`DEF-<NNN>`).
**Required kit:** `tdd` and circuit-breaker-guard; the breaker is armed throughout.
**Steps:** 1. Assign the defect id and reproduce the failure. 2. State one falsifiable hypothesis before touching code. 3. Apply **exactly one fix** per attempt. 4. Re-run the same verification. 5. Record the outcome in the ledger per defect id; repeat until green or HALT.
**Gates:** the original probe passes; at three strikes the workstream HALTs for a Diagnostic Incident Report, and only a Guide-approved changed hypothesis reopens it.
**Done when:** the root symptom is gone, the probe passes, and the ledger entry for the defect id is closed.

#### Workflow 5 — Release

**Trigger:** the operator runs the release command; the entry point is `.opencode/command/release.md`.
**Required kit:** the three second-pass guards below plus the release command itself.
**Steps:** 1. **Changelog.** Confirm `CHANGELOG.md` carries the pending version in the same change, under the right heading. 2. **Semver check.** Validate the version against Semantic Versioning: removed or renamed public surface forces MAJOR, added surface forces at least MINOR, fixes alone need only PATCH; the version must be strictly greater than the latest tag. 3. **Tag.** Create the annotated tag `v<version>` pointing at the release commit. 4. Publish with `gh release create`, taking the notes from the changelog entry. 5. Run fresh-clone verification from outside the worktree: clone the tag, run install, build, and test in order, and record each exit code.
**Gates:** **Clean Code** — no dead code and no duplication; names that state intent; shallow complexity on every path; no speculative abstraction; every error path has a defined outcome. **Test** — every requirement maps to a test asserting observable outcomes; the suite carries no flaky tests, using fixed clocks and seeded randomness with no network or wall-time dependence; the suite reads as a specification of the behaviour. **Docs** — docs match current behaviour; every relative link resolves; the changelog carries the change in the same commit; all commands run green on a clean checkout.
**Done when:** the tag is pushed, the release is published at the URL `gh` reports, and the fresh clone verifies with recorded exit codes.

### B.5 — Session rituals

#### Ritual 1 — Start

Read `docs/25-AI-CONSTITUTION.md` and `docs/00-PROJECT-SUMMARY.md`, then delegate the anchor mechanics to `session-context-primer` and consume the single anchor block it emits (~10s budget; an approximate anchor now beats a perfect anchor late). The anchor format has its single home in `session-context-primer`, which defines the seven fields the anchor carries — mission, phase, branch, worktrees, next item, guards, and circuit state — and Doctrine consumes the anchor rather than defining it.

#### Ritual 2 — End

Persist learnings to `docs/17-CHECKPOINT.md` (what changed, what is in flight, what is halted, what was deliberately not started). Record decisions with record-decision.sh into the ledger so the next session inherits every ruling instead of rediscovering it.

#### Ritual 3 — Pre-compact

Save state before compaction: the checkpoint, the strike ledger, the worktree list, and the pending item. A compacted session resumes from the saved state, never from memory.

### B.6 — Skill-file format standard

Every `SKILL.md` carries frontmatter with exactly `name` plus `description`, then the body sections Purpose, When to Use, Do NOT use, Inputs, Procedure, Outputs, Failure Modes, in that order. The `name` is lowercase-hyphenated and identical to the containing folder name; the description states what the skill does and when to trigger it. There are no unfinished-work markers and no stubs: every file is written in full on creation and never left empty.

### B.7 — Parallelism mechanics

Plan once, then build a dependency graph. Independent nodes fan out as concurrent worktree branches, one concern per worktree on `wt/<concern-slug>`; dependent nodes chain sequentially. Shared resources are single-writer — never two branches writing one file. Merges return reviewed and signed off back to `main`. A dispatch is confirmed only when its result lands on disk or on the remote — never on a subagent's word; the agent verifies it itself (branch exists, diff is one concern, the named command passed) before reporting.

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

- The Diagnostic Incident Report reference on every HALT, in this exact shape:

```text
Diagnostic Incident Report
Emitted by circuit-breaker-guard on strike 3; the template has its single home there and this file never carries a second copy. Doctrine records the HALT, the defect id, and the Guide sign-off that reopens the loop.
```

- A phase-injection manifest at every phase transition, in this exact shape:

```text
PHASE INJECTION MANIFEST
Phase   : <docs | plan | build | review | operate>
Injected: <skill names for this phase>
Pruned  : <skill names from the previous phase>
Cap     : <8-MCP backstop respected: yes>
```

- Authorship confirmation for the target-project workflow file: Vanguard generates 27 of the 28 target-project docs; `docs/18-WORKFLOW.md` is the one it does not generate. Doctrine authors it — written in full on creation and never left empty — so the handoff is unambiguous.

## Failure Modes

- **Implementer redefines acceptance criteria.** Escalate to the Guide and never comply; work stops until the spec is rewritten with observable criteria.
- **User pressure on a failed gate or HALT.** Hold the verdict. Only a Guide-approved changed hypothesis reopens the loop; pressure is logged as evidence, never treated as authority.
- **Two branches writing the same file.** Stop the second branch at once — single-writer is absolute — and let the Leader re-sequence so the shared file has exactly one owner.
- **A subagent claims success but nothing is on disk.** Not done. The agent verifies it itself: the branch exists, the diff carries that concern and nothing else, and the named command actually passed.
- **A gate that cannot be evaluated.** FAILED, never skipped. An unevaluatable check fails the phase exit by definition.
- **A phase transition where the kit is not pruned.** Stop the transition: prune, then inject. Never stack two phases of kit.
- **Skipping a level hides information.** A question that jumps the ladder is sent back down one level with the reason stated; the ledger records every escalation and every verdict.
