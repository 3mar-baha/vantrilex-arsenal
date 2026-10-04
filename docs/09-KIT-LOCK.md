# Kit Lock

The kit lock is the pinned record of what a project actually received: every
provisioned component at an exact version, plus the approved-but-not-yet-fit
remainder. Its contract comes from Vanguard Step 4 in
[04-VANGUARD.md](04-VANGUARD.md). The lock manifest (`kit/kit.lock`) is
specified and pending on this branch; this file states what it pins and the
rules that govern it, so the manifest can land without renegotiation.

## What the lock pins

One entry per provisioned component:

| Pinned fact | Source field | Meaning |
|---|---|---|
| Identity | record `id` plus `kind` | Exactly which catalog row was installed |
| Version | `version_pin` | Exact tag or version; floating is not pinnable |
| Command | `install_cmd` | The real command that installed it, reproducible later |
| Verification | `verify_cmd` plus evidence | How Vanguard proved it loads, and what the proof was |
| Phase scope | `phase` | The lifecycle phases the component is injected into |

A floating version (null `version_pin`) cannot satisfy the lock: the entry
stays on the pending list until the version is pinned. The lock therefore
protects against silent upstream change — a squatted package name, a renamed
repository, a handed-over maintainership — because re-provisioning resolves
to the pinned version, not to whatever the name means today.

## The `pending` list semantics

The lock carries a `pending` list alongside the pinned entries. Pending means
approved but not provisioned: the shortlist named the component, the owner
approved it, and installation has not landed — or verification failed and the
owner has not signed off. Pending entries carry the reason they are pending
and the gate that clears them. A pending entry is never installed silently
later; it is either pinned on a later Vanguard pass or removed with the
owner's decision recorded in the ledger.

## The 8-MCP cap

At most 8 MCP servers sit in the Tier-0 set. The cap is a context-budget
backstop, not a target: fewer is better, and the specified eight are
filesystem, fetch, memory, sequential-thinking, github, context7, firecrawl,
and openrouter. The static cap is complemented by the dynamic budget below —
phase scoping is what keeps context spend near the work, the cap is what
stops the worst case.

## Phase-scoped injection and pruning

Install once centrally; inject per phase, prune after. Context spend tracks
the work being done:

| Phase | Resident components |
|---|---|
| docs | `grill-me`, `session-context-primer` |
| plan | `wayfinder`, `ask-matt` |
| build | `tdd`, `ponytail`, `preflight-system-doctor` |
| review | `code-review`, `ponytail-review` |
| operate | `ponytail-audit`, `ponytail-debt` |

Discovery and forging (`find-skills`, `skill-creator`) load on demand rather
than by phase. The phase map is normative in
[05-DOCTRINE.md](05-DOCTRINE.md); the lock records each component's scope so
the orchestrating scripts can inject and prune without re-deriving it.

## The cost guard

On ties, a Skill or CLI wins over an MCP server. An MCP server holds context
for the whole session; a skill loads as prose and unloads when the phase
ends. Selection therefore prefers the cheaper surface whenever two candidates
cover the same need, and the lock records the lighter choice so later passes
do not re-litigate it.
