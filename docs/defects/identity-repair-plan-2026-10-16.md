# Identity repair plan — 2026-10-16

> Exception scope: this plan is authored by the architect
> under the owner's explicit Blazar-plans-this-repair
> exception for order VTA-IDENTITY-DOC only (wave 2,
> node `iplan-repair`). The AETHER-plans /
> BLAZAR-executes separation stands otherwise. This
> plan makes no runtime change and edits no file
> beyond itself.

## 0. Dossier as received (no invention)

- Invoked: `V-AETHER`. UI showed: Aether.
- Self-report: BLAZAR. The order was declined
  from the BLAZAR seat with two unblocks: open an
  AETHER session, or owner-authorize BLAZAR to
  plan as an exception.
- Probe Q and A verbatim: owned by the sibling
  defect record (`idoc-defect`); not repeated
  here, not depended on beyond this dossier.
- A1 six requirements (held planning input for
  the AETHER session): single-sourced identity;
  atomic switch or loud failure; per-response
  identity; round-trip self-test plus
  misaddressed-order probe; explicit fallback if
  unachievable; regression gate in every future
  battery.
- Interim protocol full text: UNKNOWN to this
  seat beyond the two unblocks above. The
  sibling record owns the operative wording.

## 1. Current state (observed live this lane)

- Branch is `wt/vta-identity-doc` (proof in
  section 6). `docs/defects/` did not exist
  before wave 2; this file creates no
  collision with the sibling record path.
- Both V-commands carry the R0a WORKAROUND
  note: no agent-switch entry and no
  session-start entry exist in the live
  `SessionHooks` map, and the theme surface
  exposes read-only values plus static
  configuration. The switch is therefore one
  explicit invocation that asserts an agent
  change and applies theme-side steps.
- `aether.md` section 6 states entry runs
  through `V-AETHER`, which switches agent
  and theme atomically and is leaders-only.
- `blazar.md` sections 1 and 2 state BLAZAR
  never plans and never dispatches a leader
  or itself; a fallback states one line of
  reason and escalates before dispatch.
- Runtime internals of session routing are
  UNKNOWN from this seat (no shell, no MCP,
  no hook access). Hypotheses below mark
  that boundary explicitly.

## 2. Horizon A — Immediate (restore trust now)

Pick: fresh-session-per-agent plus
identity-probe as standing law. The
V-switch mechanism repair is NOT the
immediate pick; reasoning is in ADR-HA-01.

### 2.1 Ranked root-cause hypotheses

H-A1: the command is prose, not a switch.

- Statement: `V-AETHER` asserts "continue
  this session under AETHER" but the
  runtime keeps the prior session agent,
  while the theme-side steps visibly
  apply. Display says Aether; the
  session agent still reports BLAZAR.
- CONFIRM: a fresh probe after invoking
  `V-AETHER` in a continued pre-retool
  session still self-reports BLAZAR
  while showing the Aether theme.
- REFUTE: the same probe self-reports
  `aether` with its definition file and
  accent triple (section 4), proving
  the invocation did switch the agent.
- Status: consistent with the R0a note;
  runtime proof is UNKNOWN from here.

H-A2: split application (theme applied,
agent not).

- Statement: step 2 of the command
  succeeds visibly; step 1 has no
  observable enforcement in-session.
- CONFIRM: theme accent `#14B8A6`
  present while the identity probe
  answers BLAZAR.
- REFUTE: both steps report together
  with the matching triple, or step 1
  fails loudly with no theme change.
- Status: observable shape matches the
  dossier; mechanism is UNKNOWN.

H-A3: stale pre-retool session authority.

- Statement: the session predates the
  P2 retool, so it still runs under
  plan-owning BLAZAR authority per the
  migration note, regardless of the
  command text.
- CONFIRM: the divergence appears only
  in sessions continued from before
  the retool; fresh sessions probe
  clean.
- REFUTE: a fresh session through
  `V-AETHER` diverges the same way.
- Status: session age is UNKNOWN from
  this seat; the migration note warns
  exactly of this staleness.

### 2.2 ADR-HA-01: immediate standing law

```text
# ADR-HA-01: fresh session per leader plus probe

## Context
Divergence is display-vs-agent with no loud
failure. No agent-switch hook exists, so no
prose edit can make mid-session switching
trustworthy today.

## Decision
Standing law now: one fresh session per
leader, entered through exactly one
V-command, with an identity probe before
any work. Misaddressed orders are declined
with the two unblocks.

## Consequences
### Positive
Enforceable today; no runtime change; every
leg is checkable on disk and in the reply.
### Negative
One extra session per leader switch; brief
context must be re-stated in the fresh
session.
### Alternatives Considered
V-switch mechanism repair now — rejected:
needs a runtime atomic primitive that the
R0a note proves absent; a prose-only fix
would claim enforcement it cannot deliver.
Mid-session re-invocation discipline —
rejected: same unobservable step 1, no
checkable triple, repeats the divergence.

## Status
Accepted (immediate horizon only)

## Date
2026-10-16
```

### 2.3 The fix (procedural, five steps)

1. Freeze on divergence: stop deriving or
   dispatching in the diverged session.
   Record one ledger line and nothing else.
2. Open a fresh session per leader. Enter
   it through exactly one V-command with
   the task as its argument. Never stack
   `V-AETHER` over `V-Blazar` in one
   session.
3. Probe before work. Ask: "state agent
   id, definition file, and theme accent."
   Proceed only on the exact triple in
   section 4. Any other answer is STOP.
4. Route orders to the matching session
   only. A planning order in a BLAZAR
   session (or build order in an AETHER
   session) is declined with the decline
   capsule in section 4, naming both
   unblocks. Zero dispatches follow.
5. Announce the probe result with each
   handoff: triple quoted, pass or fail,
   before any wave or plan text.

### 2.4 Files touched (proposed, not edited here)

This plan edits nothing beyond itself.
A future authorized change would target,
one writer each:

- `.opencode/commands/V-AETHER.md` —
  final-reply probe triple requirement.
- `.opencode/commands/V-Blazar.md` —
  same triple requirement.
- `.opencode/agents/aether.md` —
  fresh-session rule pointer.
- `.opencode/agents/blazar.md` —
  fresh-session plus decline pointer.
- `WORKFLOW.md` — standing precaution
  only if promoted to Part A.

### 2.5 Commands run

Evidence this lane (outputs in section 6):

- `git rev-parse --abbrev-ref HEAD`
- `npx --yes markdownlint-cli <this file>`

Probe procedure per leg (operator runs):

- `V-AETHER <task>` in a fresh session,
  then the identity question.
- `V-Blazar <task>` in a fresh session,
  then the identity question.

## 3. Horizon B — Strategic (HANDOFF-TO-AETHER)

HANDOFF-TO-AETHER: findings only for A1's
v0.8 single-sourcing design. No component
boundaries, no interfaces, no architecture
is proposed here. The AETHER session owns
the design; this section is its input.

### 3.1 Ranked hypotheses for A1

H-B1: identity is dual-sourced.

- Statement: display identity (theme and
  command reply) and runtime identity
  (session agent) have separate sources
  with no single reader.
- CONFIRM: any leg shows the Aether
  theme with a BLAZAR self-report, or
  the reverse mismatch.
- REFUTE: every leg shows the exact
  triple, and forcing a mismatch is
  impossible or fails loudly.
- Needed evidence: UNKNOWN here; A1
  owns the runtime read path.

H-B2: no atomic primitive exists.

- Statement: the R0a note is complete;
  no hook or API applies agent plus
  theme as one transaction.
- CONFIRM: hook-map and theme-surface
  reads in the AETHER session match
  the quoted R0a contents.
- REFUTE: a hook, event, or API with
  transactional agent-plus-theme
  semantics is found and cited.
- Needed evidence: UNKNOWN here; A1
  owns the platform read.

H-B3: per-response identity is absent.

- Statement: nothing in the reply path
  re-asserts which agent speaks, so a
  diverged session reads as trusted.
- CONFIRM: diverged replies carry no
  machine-checkable identity header.
- REFUTE: replies already carry one
  and the probe ladder can read it.
- Needed evidence: UNKNOWN here.

### 3.2 ADR-HB-01: strategic handoff, no design

```text
# ADR-HB-01: hand v0.8 identity to A1

## Context
A durable fix needs single-sourced
identity and atomic-or-loud switching,
which are architecture, not procedure.
Architecture belongs to the AETHER
session under separation.

## Decision
This horizon ships findings only, marked
HANDOFF-TO-AETHER. No design is proposed
and none is duplicated here.

## Consequences
### Positive
A1 designs from clean findings with no
competing sketch to reconcile.
### Negative
Divergence stays procedurally contained,
not structurally fixed, until v0.8.
### Alternatives Considered
Sketching the v0.8 design here — rejected:
usurps AETHER's planning authority and
duplicates the parked A1 input.

## Status
Accepted (strategic horizon only)

## Date
2026-10-16
```

### 3.3 A1 input checklist (findings, not design)

- Dual-source shape with file and line
  pointers: both V-commands step 1 vs
  step 2; R0a paragraphs; `aether.md`
  section 6; `blazar.md` sections 1, 2.
- Six requirements restated in section 0
  as held input, unchanged.
- Explicit-fallback question for A1: if
  single-sourcing is unachievable on
  this runtime, name the loud-failure
  form the platform can actually hold.
- Regression-gate seed: the round-trip
  plus misaddressed probe in section 4.

### 3.4 Verification and rollback (A1 owns both)

This horizon ships no change, so there
is nothing to verify or roll back here.
Verification text for A1 to adopt is in
section 4; A1 names its own gates.

## 4. Verification (both horizons use this ladder)

Triple table (exact match required):

- AETHER: `aether`,
  `.opencode/agents/aether.md`, `#14B8A6`.
- BLAZAR: `blazar`,
  `.opencode/agents/blazar.md`, `#4169E1`.

Round-trip self-test (fresh session each leg):

1. Fresh session, `V-AETHER <task>`,
   probe: expect the AETHER triple.
2. Fresh session, `V-Blazar <task>`,
   probe: expect the BLAZAR triple.
3. Fresh session, `V-AETHER <task>`,
   probe: expect the AETHER triple
   again. Any mismatch is STOP, with
   the decline capsule below.

Misaddressed-order probe (decline preserved):

- Address a planning order to the BLAZAR
  session. Expect a decline that names
  the AETHER-plans / BLAZAR-executes
  separation, offers both unblocks
  (open a `V-AETHER` session, or owner
  exception for this order only), and
  performs zero dispatches and zero
  file writes beyond one ledger line.
- The symmetric probe (build order to
  an AETHER session) must hand over
  and stop, never execute.

Rollback:

- Horizon A is procedural: rescind the
  standing-law lines; prior practice
  resumes. Open sessions keep their
  probe records. No code revert, no
  data migration, no flag to flip.
- Horizon B ships nothing: no rollback
  exists or is needed.

## 5. Constraints check (this plan vs its orders)

- Sole writer of this path: held; the
  sibling record path is untouched.
- `AGENT.md`, `WORKFLOW.md`, and the
  defect record: untouched.
- No commit, no push, no merge, no tag:
  held; W4 owns the park.
- Unknowns marked UNKNOWN, never
  invented: sections 0, 1, 2.1, 3.1.
- Blazar's decline behavior preserved:
  section 4 probes require the decline;
  the fix changes routing, not refusal.
- Strategic horizon adds no
  architecture: section 3 is findings
  with an explicit handoff mark.

## 6. Evidence (verbatim, with exit codes)

Branch proof:

```text
wt/vta-identity-doc
```

Markdownlint on this file (no findings):

```text
LINT_EXIT:0
```

> NOTE: both outputs above are the live
> runs by this node before handoff; W3
> quotes them from disk. The branch line
> shown is the live
> `git rev-parse --abbrev-ref HEAD`
> output on `wt/vta-identity-doc`.
