# Themes

This file documents the OpenCode CLI themes the Arsenal ships, the per-agent
mapping, how to install, select, and verify one, and what the atomic-switch map
is — and is not.

## What ships

`registry/themes/` holds **13 JSON files**: **12 catalogued V2 palette themes**
plus **1 atomic-switch map**.

| Theme | Shade | Mapped agent | Catalog |
|---|---|---|---|
| `vantrilex-blazar` | royal blue `#4169E1` | blazar | yes |
| `vantrilex-aether` | teal `#14B8A6` | aether | yes |
| `vantrilex-pulsar` | fuchsia `#C026D3` | pulsar | yes |
| `vantrilex-architect` | blue `#3A86FF` | vantrilex-architect | yes |
| `vantrilex-code-reviewer` | cobalt `#2F6BFF` | vantrilex-code-reviewer | yes |
| `vantrilex-security-auditor` | violet `#8B5CF6` | vantrilex-security-auditor | yes |
| `vantrilex-kit-maintainer` | flame orange `#E63E21` | vantrilex-kit-maintainer | yes |
| `vantrilex-red-team` | signal red `#FF4D2E` | vantrilex-red-team | yes |
| `vantrilex-scribe` | emerald `#22C55E` | vantrilex-scribe | yes |
| `vantrilex-guide` | brick red `#C9331A` | vantrilex-guide | yes |
| `vantrilex-implementer` | slate blue `#5B8DEF` | vantrilex-implementer | yes |
| `vantrilex-leader` | oxide red `#A82A16` | vantrilex-leader | yes |
| `vantrilex-atomic-switch` | — | (a map, not a palette) | **no** |

Every palette file ships its hex inside the `base`/`dark` trees, and that hex is
mixed-case rather than uniformly lowercase: ten palettes carry an uppercase
`dark.hue.*.500` value (`#3A86FF` in `vantrilex-architect`, `#8B5CF6` in
`vantrilex-security-auditor`) and the remaining two are lowercase. The one
`accentHex` surface in the directory is the **atomic-switch map**: thirteen
`accentHex` fields — twelve per-agent values plus a reserved duplicate of
blazar's royal blue — every one uppercase today; the normalization at `790ef85`
fixed the last lowercase one (`vantrilex-aether`, now `#14B8A6`). Do not expect
one casing across both: the map is normalized, the palettes are not.

## Agent palette

This is the palette home for agent frontmatter colours (MFT-024/MFT-025,
W4 w4-colour). The seven-group assignment is the verified set in
`V87-COLOR-AUDIT.md` §2. `scripts/verify-catalog.mjs` (`AGENT_PALETTE`)
mirrors this section for enforcement; update both together.

| Group | Hex | Agents |
|---|---|---|
| reserved | `#14B8A6`, `#4169E1`, `#C026D3` | `aether`, `blazar`, `pulsar` |
| dev | `#3B82F6` | `vantrilex-architect`, `vantrilex-fixer`, `vantrilex-implementer`, `vantrilex-python`, `vantrilex-typescript` |
| design | `#EC4899` | `vantrilex-ui-designer`, `vantrilex-ux-designer` |
| review | `#F59E0B` | `vantrilex-code-reviewer`, `vantrilex-guide`, `vantrilex-red-team`, `vantrilex-reviewer` |
| audit | `#EF4444` | `vantrilex-harness`, `vantrilex-security-auditor`, `vantrilex-verifier` |
| docs | `#10B981` | `vantrilex-librarian`, `vantrilex-scribe` |
| operate | `#8B5CF6` | `vantrilex-agent-maker`, `vantrilex-facet`, `vantrilex-github`, `vantrilex-kit-maintainer`, `vantrilex-leader`, `vantrilex-puller`, `vantrilex-releaser`, `vantrilex-uploader`, `vantrilex` (Zenith) |
| exploration | `#22D3EE` | `vantrilex-scout` |

Per-agent frontmatter colours: `aether` `#14B8A6`, `blazar` `#4169E1`,
`pulsar` `#C026D3`, `vantrilex-agent-maker` `#8B5CF6`,
`vantrilex-architect` `#3B82F6`, `vantrilex-code-reviewer` `#F59E0B`,
`vantrilex-facet` `#8B5CF6`, `vantrilex-fixer` `#3B82F6`, `vantrilex-github` `#8B5CF6`,
`vantrilex-guide` `#F59E0B`, `vantrilex-harness` `#EF4444`,
`vantrilex-implementer` `#3B82F6`, `vantrilex-kit-maintainer` `#8B5CF6`,
`vantrilex-leader` `#8B5CF6`, `vantrilex-librarian` `#10B981`,
`vantrilex-puller` `#8B5CF6`, `vantrilex-python` `#3B82F6`,
`vantrilex-red-team` `#F59E0B`, `vantrilex-releaser` `#8B5CF6`,
`vantrilex-reviewer` `#F59E0B`, `vantrilex-scout` `#22D3EE`,
`vantrilex-scribe` `#10B981`, `vantrilex-security-auditor` `#EF4444`,
`vantrilex-typescript` `#3B82F6`, `vantrilex-ui-designer` `#EC4899`,
`vantrilex-uploader` `#8B5CF6`, `vantrilex-ux-designer` `#EC4899`,
`vantrilex-verifier` `#EF4444`, `vantrilex` (Zenith) `#8B5CF6`.

Owner-approved 2026-11-06 (group assignment ratified, colours landed):
`vantrilex-guide` review `#F59E0B`, `vantrilex-leader` operate `#8B5CF6`,
`vantrilex-librarian` docs `#10B981`, `vantrilex-red-team` review `#F59E0B`,
`vantrilex` (Zenith) operate `#8B5CF6`.

### Group-colour rule

A new agent inherits its group's colour: assign the agent to one of the
seven groups above and carry that group's hex in the agent file's `color:`
frontmatter, then add the same row to `scripts/verify-catalog.mjs`
(`AGENT_PALETTE`) and to the table and per-agent list above. No new hex is
invented for a new agent; a new group requires an owner ruling recorded in
`docs/15-DECISIONS.md` before any hex lands.

Verify the palette from the repository root:

```bash
node -e "const fs=require('fs');const P={aether:'#14B8A6',blazar:'#4169E1',pulsar:'#C026D3','vantrilex-agent-maker':'#8B5CF6','vantrilex-architect':'#3B82F6','vantrilex-code-reviewer':'#F59E0B','vantrilex-facet':'#8B5CF6','vantrilex-fixer':'#3B82F6','vantrilex-github':'#8B5CF6','vantrilex-guide':'#F59E0B','vantrilex-harness':'#EF4444','vantrilex-implementer':'#3B82F6','vantrilex-kit-maintainer':'#8B5CF6','vantrilex-leader':'#8B5CF6','vantrilex-librarian':'#10B981','vantrilex-puller':'#8B5CF6','vantrilex-python':'#3B82F6','vantrilex-red-team':'#F59E0B','vantrilex-releaser':'#8B5CF6','vantrilex-reviewer':'#F59E0B','vantrilex-scout':'#22D3EE','vantrilex-scribe':'#10B981','vantrilex-security-auditor':'#EF4444','vantrilex-typescript':'#3B82F6','vantrilex-ui-designer':'#EC4899','vantrilex-uploader':'#8B5CF6','vantrilex-ux-designer':'#EC4899','vantrilex-verifier':'#EF4444','vantrilex':'#8B5CF6'};for(const [id,hex] of Object.entries(P)){const t=fs.readFileSync('.opencode/agents/'+id+'.md','utf8');const m=t.match(/^color:\s*\"([^\"]+)\"/m);if(!m||m[1]!==hex)throw new Error(id+' expected '+hex+' got '+(m?m[1]:'none'))}console.log('palette: 29 colours match')"
```

## Native shape

Themes are V2-native JSON with a `base` tree plus `light`/`dark` palettes, as
documented at `https://opencode.ai/v2/docs/cli/theme/`. Theme files live under
`.opencode/themes/` (project) or `~/.config/opencode/themes/` (global); the
filename becomes the theme name; only `.json` files are read; a closer
directory replaces a global theme with the same name. A theme that defines only
one mode is used as-is when the other mode is requested, which is why
`vantrilex-blazar` ships dark-only.

## The atomic-switch map is out of catalog

`registry/themes/vantrilex-atomic-switch.json` is the **map**, not a theme. It
carries four sections:

| Section | Holds |
|---|---|
| `agents` | One row per themed agent: `agent`, `themeId`, `themeFile`, `accentHex`, `category`, `status` |
| `categories` | The colour family per category — `code` blue shades, `design` gold (reserved), `external` purple, `kit` flame red, `research` green, `reserved` royal blue |
| `registry` | The map's own id, `vantrilex-atomic-switch` |
| `reserved` | The reserved default: blazar's royal blue |

It carries no `base`/`dark` tree, so it cannot satisfy a palette shape. The
`command-shape/theme` gate refused a prepared catalog row for it, and the leader
ruling at P5a was **option (c)**: the map is an **out-of-catalog runtime
artifact**, documented here, with no schema discriminator, no file move, and no
invented palette. The catalog therefore counts 12 theme components while the
directory holds 13 files; the two numbers count different things and neither is
a defect.

The map exists because the runtime cannot do this for us: no native hook or API
changes the theme when the active agent changes, so the mapping is static
configuration. It records which theme belongs to which agent; it does not switch
anything.

## Selection

Selection is static and manual. There is no automatic switch.

- Interactively, run `/themes` and pick the theme.
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

Restart OpenCode after adding the theme file, then select it. The catalog records
each theme with `phase: on-demand`, so no task phase injects it: the theme is
applied to the CLI surface, never to a session's context.

## Install

Project-only placement, from the repository root:

```bash
cp registry/themes/vantrilex-blazar.json .opencode/themes/vantrilex-blazar.json
```

Global placement, for every project on the machine:

```bash
cp registry/themes/vantrilex-blazar.json ~/.config/opencode/themes/vantrilex-blazar.json
```

The catalog row's `install_cmd` is the global copy, proven by a `file-copy`
command-registry entry, and its `load_proof` names the shipped file as the
surface.

## Verify

Parse-check the shipped file from the repository root:

```bash
node -e "const t=JSON.parse(require('fs').readFileSync('registry/themes/vantrilex-blazar.json','utf8')); if(!t.base||!t.dark||!t.dark.hue) throw new Error('missing base/dark'); console.log('vantrilex-blazar: JSON parses with base + dark')"
```

The catalog row's `verify_cmd` checks the installed copy when one is present and
falls back to the shipped file, so it evaluates after either install path:

```bash
node -e "const fs=require('fs'),os=require('os');const p=os.homedir()+'/.config/opencode/themes/vantrilex-blazar.json';const f=fs.existsSync(p)?p:'registry/themes/vantrilex-blazar.json';const t=JSON.parse(fs.readFileSync(f,'utf8'));if(!t.base||(!t.dark&&!t.light))throw new Error('not a V2 theme');console.log('vantrilex-blazar: V2 theme parses from '+f)"
```

What is proven is the shipped surface and the copy target. **Load-verification
through `/themes` remains unverified**: theme selection is interactive and there
is no non-interactive loader, so no claim is made that the CLI renders it.

## What the runtime does not support

Carried from `RESEARCH.md` §c, §d, §e, and the §g table.

| Capability | R0 verdict | What ships instead |
|---|---|---|
| Automatic per-agent theme switching | WORKAROUND | No agent-switch, session-start, or theme hook exists, and the public CLI plugin API does not register themes. The achievable surface is a distinct static `color` per agent plus manual `/themes` switching, and the atomic-switch map records the intended pairing. |
| Background image inside the UI | PARKED (native IMPOSSIBLE) | Neither theme schema has an image slot; color tokens are the whole surface. A terminal-emulator backdrop combined with a transparent theme background is the only candidate path, and it is an unvalidated terminal-level workaround, never a native OpenCode background image. Nothing of the kind ships here. |
| Per-agent icon or avatar | PARKED (native IMPOSSIBLE) | No `icon`, `avatar`, or image field appears on either agents surface, so no icon is referenced anywhere in this file. |

## Extensibility

To add a theme: author a new V2-native JSON file in `registry/themes/` (created
from the documented `base` + mode shape, never copied from an existing theme),
add one row to the `## Themes` section of `registry/VANTRILEX_CATALOG.md` with
matching heading counts, add one entry to `registry/data/themes.jsonl` with a
real copy command, a parse verify command, and the `loadable` class evidence,
then regenerate with `scripts/generate-catalog-json.mjs --markdown --indexes`
and extend the mapping table and the atomic-switch map. Kinds themselves are a
versioned mechanism: the general rule lives in the top-level `$comment` of
`registry/schema/catalog-v4.schema.json`, and new-kind onboarding stays frozen
until the P6 sign-off.
