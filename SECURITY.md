# Security Policy

## Reporting a vulnerability

Report privately through GitHub's security advisory form for this repository:
**Security → Report a vulnerability**. Do not open a public issue for an unfixed
vulnerability.

Include the component id, the affected version, what an attacker gains, and a
reproduction if you have one. Expect an acknowledgement within 72 hours.

## Scope

This project ships **instructions and data, and an executable runtime**. The catalog and the
skills are instructions; `.opencode/plugin/arsenal.ts` is a real TypeScript runtime with seven
registered hook callbacks that write to disk and spawn processes, and `scripts/` is a set of
executable programs. Its blast radius is therefore about both what it tells an agent to do and
what it does itself:

| In scope | Out of scope |
|---|---|
| A catalog `install_cmd` that runs something other than what it claims | Vulnerabilities in upstream projects the catalog merely lists |
| A `SKILL.md` whose procedure causes an agent to exfiltrate credentials or destroy data | Vulnerabilities in `gh`, `git`, `node`, or `npx` themselves |
| A plugin callback that bypasses a guard the skill promises to enforce | Missing components in the catalog |
| Secrets committed to this repository | Weaknesses in a target project's own code |

## The threat model that matters most here

The Registry's `install_cmd` fields are the highest-value target in this repo. They are
instructions to an automated agent that will typically run them. Two failure modes:

1. **A command that looks right but is wrong**, causing an agent to install or execute
   something unintended.
2. **A command that was correct when written and has since changed upstream** — package
   names get squatted, repos get renamed, maintainers hand over ownership.

Mitigations already in place, and the ones you should hold us to:

- An install command is never invented. It is either verified against a real
  registry and marked `verification: verified`, or it is marked
  `verification: unverified`, which may still carry a command mechanically
  derived from the component's source repository, or it is `null`. Components
  that ship as agents, plugins, and hooks carry `null` plus
  `verification: unverified`. A derived command is never presented as checked,
  because a plausible-looking wrong command is worse than an admission of
  ignorance: an agent will run it.
- `verification: verified` records **that** a command was checked. It does not
  record **what** it was checked against — the catalog has no field for that, so
  the evidence trail does not exist yet. Treat a `verified` flag as an assertion
  to re-test, not as proof you can audit later.
- `kit/kit.lock` pins versions only where a pin exists. **2 of 52** entries carry
  a `version_pin` — `context7` and `firecrawl`. The other 50 are `null`, including
  all ten installable skills, so a floating upstream *can* silently change the kit
  today. Do not read a lock entry as immutable unless its `version_pin` is set.
- `scripts/verify-kit.mjs` re-proves that each Tier-0 component resolves.
- Known defect, closed: 36 records in `registry/data/skills.jsonl` named a
  skill with a multi-word, unquoted `--skill` value, so the shell split it and the
  command installed something other than what it named. All 36 turned out to
  describe skills the upstream repository does not publish — none of their ids
  exist among its 818 skill directories — so no rewrite could have made the
  commands honest. Each now carries `install_cmd: null` with
  `verification: unverified`. Every one of the 1,449 remaining skill commands
  now matches the `SKILL_CMD` shape the kit verifier enforces.
- Known defect, open: about 20 further records pass `--skill` a single-token
  *display name* rather than a directory slug — `Aegis`, `Dorothy`,
  `beautiful_prose`, `skill.color-expert`, `Adversary-in-the-Middle`. They are
  not multi-word, so the verifier accepts them, but they are not proven to resolve
  upstream and will likely fail at install time. Confirming them means resolving
  each against its own upstream repository.

If you find a command in the catalog that resolves somewhere unexpected, that is a
high-severity report.

## Destructive commands

Agents using this kit must scope destructive operations to their own worktree or an
explicitly named path inside the project — never a shared checkout, never anything
outside the project root. Force pushes, history rewrites, recursive deletions, and schema
or data drops require explicit approval recorded before execution.

Every deletion in `scripts/` is verified to resolve inside `${REPO_ROOT}`, and both
worktree scripts reject any concern slug outside `[a-z0-9]` before it reaches
`git worktree`. No force push or history rewrite exists in `scripts/` at all. Approval is
the weaker half of this promise: `teardown-stage.sh` deletes five target groups and
`dispatch-worktrees.sh` runs `git worktree remove --force` with no approval record
written anywhere. The paths are safe; the recorded-approval claim is not yet enforced.

## Secrets

Secrets live in environment variables or a secret manager, never in this repository.
The one environment variable the tooling reads is `VANTRILEX_STATE_DIR`, and the
pre-commit hook refuses a newly added `.env` file. An already-tracked `.env` that is then
modified is not refused by that name check, though the credential-shape scan still runs
on added lines of every file, so a real secret is still caught.

If a credential is committed: **revoke or rotate it first, then remove it.** Deleting the
text without rotating the credential is not remediation, and exposure duration is not a
reason to delay rotation.

## Supported versions

| Version | Supported |
|---|---|
| 0.2.x | Yes |
| 0.1.x | Yes |
| < 0.1.0 | No |

This project is pre-1.0. The Registry format may still change in a breaking way.
