# 07 — Skills and Agents

Two component kinds carry the agent-facing instructions: skills under
`.opencode/skills/`, and agent definitions under `.opencode/agents/`. A skill id
is its directory path, so the folder name and the frontmatter name must agree.

## The skill-file format contract

`AGENTS.md` states the shape; `node scripts/verify-skills.mjs` enforces it.

**Frontmatter.** Exactly two keys, `name` and `description`, and no others.

- `name` is lowercase-hyphenated and identical to the containing folder name.
- `description` is one sentence, in the third person, ending in a single `.`,
  `!`, or `?`. It must be at least 40 characters, must contain a trigger, and
  the trigger must be front-loaded: `Use when` within the first 80 characters.
  A first-person `I` fails it.

**Body.** One top-level heading, then exactly these seven second-level headings,
in this order, each appearing exactly once:

```text
Purpose   When to Use   Do NOT use   Inputs
Procedure   Outputs   Failure Modes
```

**Hygiene.** LF line endings only, strict UTF-8 without a BOM, exactly one
trailing newline, no hard tabs, no trailing whitespace, and no placeholder token
(`TODO`, `FIXME`, `coming soon`, `placeholder`). No reference to an excluded
toolchain, and no second copy of a shared mechanism block.

**Single-home markers.** Three tokens may live in exactly one skill: the circuit
breaker halt block and its incident-report banner live only in
`circuit-breaker-guard`, and `CONTEXT ANCHOR` lives only in
`session-context-primer`. A second copy anywhere is a violation.

**Phase-map cross-check.** The phase map inside
`.opencode/skills/vantrilex-doctrine/SKILL.md` names skills in backticks; every
name must resolve either as a local skill folder or as a catalog id.

Observed live: 22 skill folders, and `verify-skills.mjs` passing 10 of 10
checks.

## The four top-level skills

| Skill | Role |
|---|---|
| `vantrilex-prime` | Orients a fresh machine to the Arsenal |
| `vantrilex-vanguard` | Equips a project: survey, install, verify, docs |
| `vantrilex-workflow-forge` | Authors the standing methodology per task |
| `vantrilex-doctrine` | Governs all work: laws, phases, gates |

## The agent roster

Ten files in `.opencode/agents/`. Each declares `name` equal to its filename
stem, a `description`, and an explicit `mode`. Nine are `subagent`; one is
`primary`.

| Agent | Role |
|---|---|
| `blazar` | Primary, manager-only orchestrator |
| `architect` | System design and technical decisions |
| `code-reviewer` | Standards review lane |
| `ai-generated-code-security-auditor` | Security review of AI-written code |
| `technical-writer` | Developer documentation |
| `red-team` | Adversarial attack on a plan or diff |
| `kit-maintainer` | Kit, lock, and schema maintenance |
| `vantrilex-leader` | Routes and sequences workstreams |
| `vantrilex-guide` | Spec, gates, sign-off, circuit breaker |
| `vantrilex-implementer` | One concern, one worktree, TDD |

**Mode must be explicit.** OpenCode V2 defaults an omitted `mode` to `primary`,
so a file without a mode line would silently promote a subagent to session
leadership. `verify-kit.mjs`'s `agent-mode-explicit` check requires `primary`,
`subagent`, or `all` in every file and proves each self-sourced lock agent
resolves to a file. Observed live: 10 files declare mode, 9 as subagent.

## BLAZAR, the primary orchestrator

`blazar.md` is the only primary agent and the default orchestrator. Its stated
job is to plan once, decompose into a DAG, dispatch every node to a named
Arsenal specialist, verify, integrate, and maintain `AGENT.md` and
`WORKFLOW.md` — and never to execute node work itself.

Its permission block is deny-then-allow on both surfaces: `subagent: *` is
denied and then named subagents are allowed individually, and `skill: *` is
denied and then named skills are allowed individually. That shape is what makes
"general is the last resort" enforceable rather than advisory.

## Slash commands

Four command files sit in `.opencode/command/`: `prime`, `equip`, `doctor`, and
`release`. They wrap the matching skill or script — orientation, equipping, the
preflight doctor, and the release lane — as one-line entry points.
