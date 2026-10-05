# Kit Lock

The kit lock is the pinned record of what a project actually received: every
provisioned component at an exact version, plus the approved-but-not-yet-fit
remainder. Its contract comes from Vanguard Step 4 in
[04-VANGUARD.md](04-VANGUARD.md). The lock manifest (`kit/kit.lock`) holds
52 components (36 tier core plus 16 tier conditional) with an empty pending
list; this file states what it pins and the rules that govern it.

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

Every locked component carries a `phase`, and that field is the whole of the
assignment. Read from `kit/kit.lock`, the 52 components group as:

| Phase | Resident components |
|---|---|
| scout | `fetch`, `context7` (mcp, plugin), `firecrawl`, `session-start`, `task-dispatcher`, `vantrilex-prime`, `vantrilex-vanguard` |
| docs | `grill-me`, `technical-writer`, `documentation-as-tests` |
| plan | `ask-matt`, `wayfinder`, `sequential-thinking`, `architect`, `babel-bridge` |
| build | `tdd`, `ponytail`, `openrouter`, `typescript-lsp`, `feature-dev`, `long-running-process-guard`, `typescript-check-after-editing-ts-tsx-files`, `auto-format-js-ts-files-with-prettier-after-edits`, `lenis`, `og-image`, `open-graph-image`, `time-capsule-test`, `vantrilex-design-variations` |
| review | `code-review` (skill, plugin), `ponytail-review`, `github`, `security-guidance`, `code-reviewer`, `ai-generated-code-security-auditor`, `red-team` (skill, agent), `skill-shadow`, `a11y-audit` |
| operate | `ponytail-audit`, `filesystem`, `memory`, `commit-commands`, `pre-compact`, `persist-session-state-on-end`, `vantrilex-doctrine`, `kit-evaluation-journal`, `kit-evolution-log`, `kill-switch-document` |
| on-demand | `find-skills`, `skill-creator` |

`on-demand` sits outside every phase and is never injected by phase: discovery
and forging load on demand instead. An id recorded at two kinds is injected as
both entries. The phase map is normative in [05-DOCTRINE.md](05-DOCTRINE.md);
the lock records each component's scope, so the orchestrating scripts inject and
prune by reading that field rather than re-deriving the assignment themselves.
This table is a copy of the lock and must be re-derived from it, not trusted in
place of it.

## The cost guard

On ties, a Skill or CLI wins over an MCP server. An MCP server holds context
for the whole session; a skill loads as prose and unloads when the phase
ends. Selection therefore prefers the cheaper surface whenever two candidates
cover the same need, and the lock records the lighter choice so later passes
do not re-litigate it.
