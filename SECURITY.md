# Security Policy

## Reporting a vulnerability

Report privately through GitHub's security advisory form for this repository:
**Security → Report a vulnerability**. Do not open a public issue for an unfixed
vulnerability.

Include the component id, the affected version, what an attacker gains, and a
reproduction if you have one. Expect an acknowledgement within 72 hours.

## Scope

This project ships **instructions and data, not an executable runtime**. Its blast radius
is therefore mostly about what it tells an agent to do:

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

- Unverified commands are `null` plus `verification: unverified`. They are never guessed.
- Each verified command records what it was verified against.
- `kit/kit.lock` pins versions so a floating upstream cannot silently change a kit.
- `scripts/verify-kit.mjs` re-proves that each Tier-0 component resolves.

If you find a command in the catalog that resolves somewhere unexpected, that is a
high-severity report.

## Destructive commands

Agents using this kit must scope destructive operations to their own worktree or an
explicitly named path inside the project — never a shared checkout, never anything
outside the project root. Force pushes, history rewrites, recursive deletions, and schema
or data drops require explicit approval recorded before execution.

## Secrets

Secrets live in environment variables or a secret manager, never in this repository.
The one environment variable the tooling reads is `VANTRILEX_STATE_DIR`, and the
pre-commit hook refuses any staged `.env` file.

If a credential is committed: **revoke or rotate it first, then remove it.** Deleting the
text without rotating the credential is not remediation, and exposure duration is not a
reason to delay rotation.

## Supported versions

| Version | Supported |
|---|---|
| 0.1.x | Yes |
| < 0.1.0 | No |

This project is pre-1.0. The Registry format may still change in a breaking way.
