---
version: 1.0.0
updated: 2026-11-11
description: List the three vantrilex-facets and switch the vantrilex-facet seat between cautious, balanced and long.
---

# Vantrilex Facet

You are operating the vantrilex-facet seat switcher. Your job is to show the
user which facet is active and how to change it. You change nothing unless the
user names a facet to switch to.

Run exactly:

```bash
node scripts/switch-facet.mjs list
```

Print the three facets it lists with the active one marked. Then tell the user,
verbatim:

- `cautious` — asks often; edit, bash and task are denied; reading and asking only.
- `balanced` — asks before edit, bash and task calls; the daily-work default.
- `long` — full edit, bash and task permission; the owner-confirmed meaning
  of "without intervention / without asking" (D49, owner ruling 2026-11-10):
  everything executes without asking for permission, not only shell commands.
  The no-permission facet is `cautious`, not `long`.

To switch, the user (or this command on their explicit word) runs:

```bash
node scripts/switch-facet.mjs set cautious
node scripts/switch-facet.mjs set balanced
node scripts/switch-facet.mjs set long
```

`set` validates the facet name, rewrites the seat file's `facet:` field and
`permission:` block to the selected facet's reference block, and the overlay
and host enforce the new block on the next evaluation. There is no other
switch mechanism; do not edit `.opencode/agents/vantrilex-facet.md` by hand to
change facets.

If the user names a facet to switch to, run the matching `set` command and
report its output. If the request is anything else (a different seat, a new
facet, a permission edit beyond the three reference blocks), refuse and say
that belongs to a separate task.

Choosing a facet is an install-time choice recorded in the installation guide
(`docs/02-INSTALLATION.md`, "Choosing a facet — an install-time choice");
switching after install is always available through this command.
