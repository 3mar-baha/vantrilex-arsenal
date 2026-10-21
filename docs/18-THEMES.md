# Themes

This file maps agents to OpenCode CLI themes and documents how to install,
select, and verify them. The mapping is static configuration, not an automatic
switcher: no native hook or API changes the theme when the active agent
changes, so this file ships only the mapping itself. Every verdict below is
carried from `RESEARCH.md` (R0, 2026-10-14), the binding source for this lane.

## Native shape

Themes are V2-native JSON with a `base` tree plus `light`/`dark` palettes, as
documented at `https://opencode.ai/v2/docs/cli/theme/`. Theme files live under
`.opencode/themes/` (project) or `~/.config/opencode/themes/` (global); the
filename becomes the theme name; only `.json` files are read; a closer
directory replaces a global theme with the same name. A theme that defines only
one mode is used as-is when the other mode is requested, which is why
`vantrilex-blazar` ships dark-only.

## Per-agent mapping

| Agent | Theme | Status |
|---|---|---|
| blazar | vantrilex-blazar | ACTIVE NOW |
| plan-replacement | none yet | RESERVED |
| project-prep | none yet | RESERVED |
| exploration | none yet | RESERVED |

`blazar` is the manager-only orchestrator in `.opencode/agents/blazar.md`. Its
agent `color` is `#4169E1`, which conforms to the V2 six-digit hex shape, and
the theme's `blue.500` step carries that same value, so the agent colour and
the theme agree by construction. A row marked RESERVED names an agent whose
definition does not exist yet: the theme name is reserved for it and nothing
installs until that agent lands.

## Selection

Selection is static and manual. There is no automatic switch.

- Interactively, run `/themes` and pick `vantrilex-blazar`.
- Durably, set it in global CLI settings at `~/.config/opencode/cli.json`:

```json
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "theme": {
    "name": "vantrilex-blazar",
    "mode": "dark"
  }
}
```

Restart OpenCode after adding the theme file, then select it. The lock records
this component with `phase: on-demand`, so no task phase injects it: the theme
is applied to the CLI surface, never to a session's context.

## Install

Project-only placement, from the repository root:

```bash
cp registry/themes/vantrilex-blazar.json .opencode/themes/vantrilex-blazar.json
```

Global placement, for every project on the machine:

```bash
cp registry/themes/vantrilex-blazar.json ~/.config/opencode/themes/vantrilex-blazar.json
```

## Verify

Parse-check the shipped file from the repository root:

```bash
node -e "const t=JSON.parse(require('fs').readFileSync('registry/themes/vantrilex-blazar.json','utf8')); if(!t.base||!t.dark||!t.dark.hue) throw new Error('missing base/dark'); console.log('vantrilex-blazar: JSON parses with base + dark')"
```

The sidecar's `verify_cmd` checks the installed copy when one is present and
falls back to the shipped file, so it evaluates after either install path:

```bash
node -e "const fs=require('fs'),os=require('os');const p=os.homedir()+'/.config/opencode/themes/vantrilex-blazar.json';const f=fs.existsSync(p)?p:'registry/themes/vantrilex-blazar.json';const t=JSON.parse(fs.readFileSync(f,'utf8'));if(!t.base||(!t.dark&&!t.light))throw new Error('not a V2 theme');console.log('vantrilex-blazar: V2 theme parses from '+f)"
```

Load-verification through `/themes` is UNVERIFIED: theme selection is
interactive and there is no non-interactive loader, so no load claim is made
here. The sidecar record carries verification `unverified` for the same reason.

## What the runtime does not support

Carried from `RESEARCH.md` §c, §d, §e, and the §g table.

| Capability | R0 verdict | What ships instead |
|---|---|---|
| Automatic per-agent theme switching | WORKAROUND | No agent-switch, session-start, or theme hook exists, and the public CLI plugin API does not register themes. The achievable surface is a distinct static `color` per agent plus manual `/themes` switching. |
| Background image inside the UI | PARKED (native IMPOSSIBLE) | Neither theme schema has an image slot; color tokens are the whole surface. A terminal-emulator backdrop combined with a transparent theme background is the only candidate path, and it is an unvalidated terminal-level workaround, never a native OpenCode background image. Nothing of the kind ships here. |
| Per-agent icon or avatar | PARKED (native IMPOSSIBLE) | No `icon`, `avatar`, or image field appears on either agents surface, so no icon is referenced anywhere in this file. |

## Extensibility

To add a second theme: author a new V2-native JSON file in `registry/themes/`
(created from the documented `base` + mode shape, never copied from an existing
theme), add one row to the `## Themes` section of
`registry/VANTRILEX_CATALOG.md` with matching heading counts, add one entry to
`registry/data/themes.jsonl` with a real copy command and a parse verify
command, add one `theme` row to `registry/data/themes.jsonl`, regenerate
`registry/catalog.json` and the themes index through
`scripts/generate-catalog-json.mjs --indexes`, and extend the mapping table
above. The general mechanism for plugging in future kinds lives in the
top-level `$comment` of `registry/schema/catalog-v3.schema.json`; `theme` was
its first use.
