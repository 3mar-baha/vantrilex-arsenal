# Vantrilex Arsenal Documentation Index

This index maps the sixteen-file documentation set for the Vantrilex Arsenal
repository itself: the OpenCode plugin plus the component registry. It does not
document any target project. Target-project documentation is a separate,
runtime-generated set (the 28-file system described by reference in
[04-VANGUARD.md](04-VANGUARD.md)); nothing in this set duplicates it.

The two authoritative input specs live in `spec/` next to this set:
`spec/VANTRILEX_KIT_SPEC.md` and `spec/VANTRILEX_SKILLS_SPEC.md`. They are
provenance: read them, never rewrite them.

## File map

| File | What it answers |
|---|---|
| [00-INDEX.md](00-INDEX.md) | Where everything is, and in what order to read it |
| [01-OVERVIEW.md](01-OVERVIEW.md) | What Vantrilex Arsenal is, and what the honest component counts are |
| [02-INSTALLATION.md](02-INSTALLATION.md) | What to install and run to work with this repository |
| [03-ARCHITECTURE.md](03-ARCHITECTURE.md) | How the layers fit together and what reads what |
| [04-VANGUARD.md](04-VANGUARD.md) | What the Vanguard scout skill does, step by step |
| [05-DOCTRINE.md](05-DOCTRINE.md) | What the Doctrine law skill requires: laws, roles, phases, workflows, rituals |
| [06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md) | What a catalog v2 record carries, and what each field means |
| [07-CATALOG-GENERATION.md](07-CATALOG-GENERATION.md) | How the catalog mirror and indexes are generated, and the merge rules |
| [08-VERIFICATION.md](08-VERIFICATION.md) | Which gates must pass before any change is called done |
| [09-KIT-LOCK.md](09-KIT-LOCK.md) | What the kit lock pins, and how the kit is scoped per phase |
| [10-ROLE-MODEL.md](10-ROLE-MODEL.md) | Who decides what: Leader, Guide, Implementer |
| [11-WORKTREES.md](11-WORKTREES.md) | How parallel work is isolated, one concern per worktree |
| [12-QUALITY-GATES.md](12-QUALITY-GATES.md) | Which second-pass guards protect a release, and the halt rule |
| [13-CONTRIBUTING-WORKFLOW.md](13-CONTRIBUTING-WORKFLOW.md) | How to land a change: branches, commits, components, corrections |
| [14-CI-RELEASE.md](14-CI-RELEASE.md) | What CI runs, and how a version is tagged and published |
| [15-DECISIONS.md](15-DECISIONS.md) | Which decisions are already ratified, with date, context, and consequences |

## Reading paths

A newcomer reads for orientation:

1. [01-OVERVIEW.md](01-OVERVIEW.md) for what the repository is.
2. [03-ARCHITECTURE.md](03-ARCHITECTURE.md) for how it fits together.
3. [04-VANGUARD.md](04-VANGUARD.md) for what the scout skill does.
4. [05-DOCTRINE.md](05-DOCTRINE.md) for the laws that govern kit use.
5. [10-ROLE-MODEL.md](10-ROLE-MODEL.md) for who decides what.

An operator reads for running projects:

1. [02-INSTALLATION.md](02-INSTALLATION.md) for prerequisites and setup.
2. [04-VANGUARD.md](04-VANGUARD.md) for equipping a target project.
3. [09-KIT-LOCK.md](09-KIT-LOCK.md) for what is pinned and how the kit is scoped.
4. [08-VERIFICATION.md](08-VERIFICATION.md) for proving the kit works.
5. [11-WORKTREES.md](11-WORKTREES.md) for isolating parallel work.
6. [14-CI-RELEASE.md](14-CI-RELEASE.md) for shipping a version.

A contributor reads for landing changes:

1. [13-CONTRIBUTING-WORKFLOW.md](13-CONTRIBUTING-WORKFLOW.md) for branch and commit discipline.
2. [06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md) for the record contract.
3. [07-CATALOG-GENERATION.md](07-CATALOG-GENERATION.md) for the generator and merge rules.
4. [08-VERIFICATION.md](08-VERIFICATION.md) for the gates a change must pass.
5. [12-QUALITY-GATES.md](12-QUALITY-GATES.md) for the release guards.
6. [11-WORKTREES.md](11-WORKTREES.md) for the single-writer worktree rule.
7. [15-DECISIONS.md](15-DECISIONS.md) for decisions that are already settled.

## Conventions used across the set

- Counts are honest and checkable: 2719 catalog records, 34 records with tier
  `core` including the 2 Arsenal skills, 22 default-selected components,
  12 verified install commands, 6 merged sidecars. See [01-OVERVIEW.md](01-OVERVIEW.md).
- Every fenced command exists in this repository or in the CI workflows that
  run against it. No command is invented for illustration.
- Every relative link resolves to a file that exists. The `spec/` inputs are
  linked for provenance, not for editing.
