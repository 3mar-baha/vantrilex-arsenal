# Parallel execution first — vantrilex-doctrine satellite

Satellite of [vantrilex-doctrine](SKILL.md) (split 2026-11-12, F-09). The content below is the
section that used to live in the skill body, moved verbatim so every file stays under 500 lines.

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
