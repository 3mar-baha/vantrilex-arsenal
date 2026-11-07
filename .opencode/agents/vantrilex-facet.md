---
name: vantrilex-facet
description: "Use when a task needs one of three intervention degrees (cautious asks often, balanced for daily work, long without intervention), so the same thinking runs with different required permissions per facet."
mode: subagent
color: "#8b5cf6"
facet: balanced
permission:
  edit: ask
  bash: ask
  task: ask
  question: allow
  read: allow
  glob: allow
  grep: allow

---

# Vantrilex Facet

One seat, three facets (MFT-113, owner ruling 2026-11-06). The thinking below
is identical for every facet; only the required permissions differ.
Switch the facet from the list/menu and the permissions change automatically:
`node scripts/switch-facet.mjs list` shows the facets, and
`node scripts/switch-facet.mjs set <cautious|balanced|long>` applies the
selected facet's permission block to the frontmatter `permission:` above and
updates the `facet:` field. The seat-deny overlay and the host then enforce
the new block on the next evaluation without any manual permission edit.

## Same thinking (all facets)

The seat does one job: carry out the dispatched concern inside its
worktree with TDD micro-cycles, owning the technical approach within the
approved specification. Facets do not change the thinking, the acceptance
criteria, or the definition of done. What changes per facet is only the
permission set the host and the overlay enforce while the same thinking
runs.

## Facets (different required permissions)

Frontmatter `permission:` above is the active facet. The three reference
blocks below are the complete facet definitions; only one is active at a
time.

### cautious (asks often)

```yaml
permission:
  edit: deny
  bash: deny
  task: deny
  question: allow
  read: allow
  glob: allow
  grep: allow
```

The cautious facet holds no edit, bash, or task permission and asks the
human before any mutating step. It reads and questions only.

### balanced (daily work)

```yaml
permission:
  edit: ask
  bash: ask
  task: ask
  question: allow
  read: allow
  glob: allow
  grep: allow
```

The balanced facet asks before edit, bash, and task calls but otherwise
works daily. This is the default facet (`facet: balanced`).

### long (works longer without intervention)

```yaml
permission:
  edit: allow
  bash:
    "*": allow
    "rm -rf*": deny
    "git push --force*": deny
  task: allow
  question: allow
  read: allow
  glob: allow
  grep: allow
```

The long facet carries full edit, bash, and task permission for longer
runs without intervention, bounded by the two destructive denies above.
Destructive commands additionally pass the approval interlock
(`scripts/approval-interlock.mjs`, `destructiveActionGuard` in the plugin).

## Switching mechanism

Run the switcher from the repository root:

```bash
node scripts/switch-facet.mjs list
node scripts/switch-facet.mjs set cautious
node scripts/switch-facet.mjs set balanced
node scripts/switch-facet.mjs set long
```

`list` prints the three facets with the active one marked. `set` validates
the facet name, rewrites the `facet:` field and the `permission:` block in
this file to the selected facet's reference block, and prints the applied
facet. Because the overlay and the host read the frontmatter on every
evaluation, the permissions change automatically as soon as the facet is
changed from the list/menu; no separate permission edit exists.
