# Delete the old install, install the latest — never upgrade in place

> **2026-11-12 (F-36):** renamed from `docs/UPGRADE.md` to `docs/22-UPGRADE.md` to satisfy the docs-discipline-guard's allow-list (the top-level `docs/` root is not an allowed directory; the numbered `docs/00-`–`27-` series is, per `.opencode/arsenal.json` `docsGuard.series`). Content is unchanged; the rename resolves the WARN recorded in D72 decision 4. References in the decision log and CHANGELOG are dated records and were not rewritten.

This is the manual upgrade procedure for an existing Arsenal install. There is
no upgrade subcommand and no automated migrator: `CHANGELOG.md` records
what changed between releases, and this file records how to move a machine from
one release to the next by hand. This document introduces no release; no tag
and no release were created for it (GO-16 — no release without owner word).

## Procedure

### (a) Record the old HEAD

In the existing install:

```bash
git rev-parse HEAD
```

Write down the commit id. You will need it if the upgrade has to be rolled back
(GO back to the old checkout with `git checkout <recorded-commit>`).

### (b) Back up

Before deleting anything, save what is not in git: the clone's local edits
(`git status --short` and `git diff > <somewhere-safe>`), `.opencode/equip.manifest.json`
if it was customised, any untracked notes, and the global config under
`~/.config/opencode/`. A clone's `.git` is not a backup of your machine.

### (c) Delete the old install, or fetch and check out the tag

Two supported paths, never an in-place edit:

- **Delete the old install** — move the old clone out of the way
  (`mv vantrilex-arsenal vantrilex-arsenal.old`) or delete it if the backup in
  (b) covers what you need. Prefer this; it is the path this document exists for.
- **Fetch and check out the tag** — keep the clone and reset it onto the release:
  `git fetch --tags && git checkout v0.9.82`. Never `git pull` an arbitrary
  branch onto an existing install and call it an upgrade.

### (d) Clone the new release

Into the parent directory where the install will live:

```bash
git clone -b wt/v2-consolidation https://github.com/3mar-baha/vantrilex-arsenal.git
cd vantrilex-arsenal
git rev-parse HEAD
```

or check out the release tag instead:

```bash
git checkout v0.9.82
git rev-parse HEAD
```

Expected HEAD on `v0.9.82` (as of this writing, 2026-11-11):
`4024f9eb797b9e7bcebb82fbb55f7d71bb8fac85`. Expected HEAD on the branch tip
(as of this writing): `fa952b3573f1d6c68378ff11a72f14f0abfcda19`. The branch
moves; the tag does not. If HEAD is not the release tag, check out the release
rather than upgrading from the moving branch by accident.

Then — mandatory, not optional:

```bash
bash scripts/setup-git-hooks.sh
```

This arms the secret scanner, the `.env` guard and the AI-attribution gate for
every commit made from this clone from then on.

### (e) Run the four gates

```bash
node scripts/verify-registry.mjs
node scripts/generate-catalog-json.mjs --check
node scripts/verify-catalog.mjs
node scripts/verify-skills.mjs
```

`verify-registry.mjs` exits 0 on a healthy tree. `generate-catalog-json.mjs --check`
exits 0 when the generated mirror matches the sources. `verify-skills.mjs`
exits 0 on a healthy tree. `verify-catalog.mjs` is expected to exit 1 on this
revision with three known red checks (`min-skills` and `min-mcps`, D61, and
`load-proof/existence`, D70); read its output and compare the red set against
the decision log before treating any red as new. Any gate that fails for a
different reason means the clone is not the tree it claims to be — stop and
report, do not "fix the gate".

### (f) Re-run equip

Re-run `vantrilex-vanguard` equip against each project this install serves;
the equip flow re-detects project state, reinstalls the kit and re-verifies
loadability. Equip is Vanguard's job and is documented in
[04-VANGUARD.md](04-VANGUARD.md). Do not copy components by hand out of the
old clone; the equip flow exists so the kit is installed the way the catalog
verifies it.

### (g) Confirm the plugin version

```bash
grep PLUGIN_VERSION .opencode/plugin/arsenal.ts
```

Expect `PLUGIN_VERSION = "0.9.82"` (or the release you actually installed).
If the printed version is not the release you intended, the install is not the
release — repeat (d).

## What this document is not

It is not a release and it cuts no release; no tag and no publish are made by
it (GO-16 — no release without owner word). It is not an in-place upgrader;
the procedure above is deliberately manual. It does not replace the
[Installation](02-INSTALLATION.md) guide, which is for a fresh machine; it
assumes a machine that already installed the Arsenal once and is now behind.
