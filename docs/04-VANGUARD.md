# Vantrilex Vanguard

Vantrilex Vanguard is the scout skill: it surveys the territory, detects the
project state, selects the kit, installs it, verifies it, and reports. Then it
builds the documentation foundation. Its contract is Part A of
`spec/VANTRILEX_SKILLS_SPEC.md`. The skill file itself is built under
`.opencode/skills/vantrilex-vanguard/`; this file describes the contract it
implements. It does not paste
the skill file, and it does not enumerate the 28 target-project files — that
list lives in section A.7 of the spec and is referenced here only.

Trigger phrases: equipping a project, new project setup, "vanguard".

## The six steps

Vanguard runs six numbered steps, 0 through 5. The concept-phase chatbot relay
runs between Step 1 and Step 2 for greenfield work.

### Step 0 — Preflight

Before anything else, run the preflight system check (the transplanted
`preflight-system-doctor` pattern, exposed to operators as
`.opencode/command/doctor.md` with the `preflight-system-doctor` and
`session-context-primer` skills behind it). Check environment, runtimes,
configuration, and workspace; emit a PASS / FAIL / SKIPPED table with
remediation commands. Block on any CRITICAL failure. Node-based checks only.

### Step 1 — Project-state detection

Scan the repository; do not ask the user which state it is in. Confirm the
verdict in one sentence. The decision inputs are: code present, docs present,
and whether the docs match the code on a three-file spot check.

| State | Code | Docs | What Vanguard does |
|---|---|---|---|
| State 1, greenfield | no | no | Concept phase, then equip as new |
| State 2, code without docs | yes | no (or incompatible) | Parallel recon subagents, then docs plus a temporary problems file; work starts with the fixes |
| State 3, docs without code | no | yes | Verify docs against code samples, archive replaced docs with a manifest, write new docs, continue as State 1 |
| State 4, docs with code | yes | yes | Deep recon of the code, then docs, then the problems file, then new additions as in State 1 |

Superseded target docs move to the archive directory with a manifest stating
why each was replaced; nothing is ever deleted silently.

### Concept phase — the chatbot relay

For greenfield work, Vanguard runs a relay with the owner as the bridge:

1. Ask the owner for a short text stating the project's core goal.
2. Return a prompt, written in Arabic, for the owner to give to a chatbot.
3. The Arabic prompt instructs the chatbot to hold a long, rigorous discussion
   of the idea (Socratic, steelmanning, realistic), research proven methods,
   knowledge sources, and useful open-source projects, and only then explain
   the complete idea in full detail.
4. The owner returns with the chatbot's researched concept, and Vanguard
   proceeds to Step 2.

The required sections of the Arabic prompt are: role, discussion methodology
(graduated questions, skepticism, steelmanning), research duties (proven
methods, knowledge sources, open-source projects), and output format (a simple
Arabic explanation plus a precise English directive for the coding agent).
This relay is the single exception to the repository's English-only rule: the
prompt Vanguard hands the owner is written in Arabic because the owner
conducts that discussion in Arabic. Everything the skills generate otherwise —
skill files, docs, lock entries, reports — stays in English.

After documentation, the execution relay continues in the same shape: the
coding agent executes, the chatbot interprets and verifies, the owner directs,
and each turn carries an Arabic explanation plus a precise English directive
back to the agent.

### Step 2 — Source surveying

Query sources in order: the local `catalog.json`; the skills.sh leaderboard
plus the `npx skills` CLI; `vercel-labs/find-skills`; the Smithery registry
CLI; the `agency-agents` roster; `awesome-design-md`; the `ecc` hooks. Every
candidate MCP or CLI must have its docs reachable via Context7 — if not, it is
rejected or flagged.

### Step 3 — Kit selection

The five-step selection algorithm:

1. Extract needs from the project type: stack, domain, whether it is UI-heavy.
2. Query the catalog.
3. Score candidates: installs and stars (prefer 1K+), activity (under 6
   months), license, non-overlap.
4. Apply the overlap rules (`supersedes` / `pairs_with` from
   `registry/data/overlaps.yaml`): never install both sides of a
   `supersedes` edge; where two reviewers collide, pick by recency and scope
   and record why.
5. Present a shortlist table. The owner approves it. Then install.

Tier 0 (36 specified components; 32 core records plus 2 conditional hooks plus
the 2 kit skills, all locked) is pre-approved. Tier 1 is per-project and always needs owner
approval.

### Step 4 — Install, verify, report

Install with real commands only — skills via
`npx skills add <repo> --skill <name>`, MCP servers via JSON snippets, never
an invented package name. Write the lock entries with pinned versions. Inject
phase-scoped: a component lives only in its phases, with the 8-MCP cap as the
backstop. Then verify per kind, six protocols:

| Kind | Verification protocol |
|---|---|
| MCP server | `list_tools` ping plus one smoke call |
| Skill | Load SKILL.md plus a dry run |
| Agent | Echo task dispatch |
| Plugin and hook | Fire a test event |
| LSP | Open a sample file and expect diagnostics |
| Formatting | Run on a sample and diff-check |

Report one table row per component: tool, kind, status (works or fails),
evidence, and how to fix. Proceed only after owner sign-off on failures.

### Step 5 — Documentation phase

Generate the target project's numbered documentation set defined by section
A.7 of the skills spec (the 28-file system, fixed numbers and fixed
filenames). The constitution file in that set carries the immutable laws from
Doctrine Part B; the main workflow file is left empty for Doctrine to fill;
the checkpoint file stays a living state file updated every session. Rules for
that set: English, detailed without stinginess, fixed numbers, archive with a
manifest, never delete.

## Vanguard laws

1. Request information before writing.
2. Never invent install commands.
3. Owner approval gates: the shortlist, verification failures, and docs each
   need explicit sign-off.
4. No stub sections and no invented content anywhere.
