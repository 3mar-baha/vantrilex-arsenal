# NODE R0 — Theme / Per-Agent-Theming / Background-Image Research

- Repo: `O:\vantrilex-arsenal`, branch `wt/vta-expansion-02`, tip `012e449` (verified `git branch --show-current` + `git rev-parse --short HEAD`, 2026-10-14).
- Runtime on PATH: `opencode v2.0.27` (verified `opencode --version`). V2-first: V2 claims are authoritative for this lane.
- Rule: every factual claim is tagged **[V1]**, **[V2]**, or **[BOTH]**; doc claims cite the exact page + section. Anything not covered by the sources is written **UNKNOWN** — never guessed. Design output in §f is tagged **[Proposed]**, never [Verified].

## Verdict table

| Item | Verdict (one line) |
|---|---|
| a — official theme docs / JSON schema / themable surface | **POSSIBLE** — native JSON theming exists on both surfaces; schemas differ V1-flat vs V2 base+modes |
| b — GitHub survey, esp. background-image mechanism | **WORKAROUND** — native-JSON color themes verified POSSIBLE; no native background-image mechanism found (terminal-level only) |
| c — per-agent theming / agent-switch / session-start events | **WORKAROUND** — agent string is observable, theme is switchable by hand; no native auto-per-agent-theme event or API |
| d — background images inside the OpenCode UI | **IMPOSSIBLE** (native) → PARKED; terminal-background + transparent-theme workaround only |
| e — switcher rendering of `color`, per-agent icon | **POSSIBLE** for `color` itself (exact Tab-switcher rendering **UNKNOWN**); per-agent icon **IMPOSSIBLE** → PARKED |
| f — versioned RAG file schema | Design output **[Proposed]**, unimplemented — no verdict beyond implementability |

---

## a. Official theme docs: which page covers what

### a.1 V1 page — `https://opencode.ai/docs/themes/` [V1]

Sections observed (in page order): **Overview** → **Terminal requirements** → **Built-in themes** → **System theme** → **Using a theme** → **Custom themes** (Hierarchy / Creating a theme / JSON format / Color definitions / Terminal defaults / Example).

- Truecolor requirement: "your terminal must support **truecolor** (24-bit color)… `COLORTERM=truecolor`" (§Terminal requirements) **[V1]**.
- Built-ins listed include `system, tokyonight, everforest, ayu, catppuccin, catppuccin-macchiato, gruvbox, kanagawa, nord, matrix, one-dark` (§Built-in themes) **[V1]**.
- Selection: `/theme` command **or** `tui.json`: `{ "$schema": "https://opencode.ai/tui.json", "theme": "tokyonight" }` (§Using a theme) **[V1]**.
- Hierarchy (later wins): 1. built-in → 2. `~/.config/opencode/themes/*.json` (or `$XDG_CONFIG_HOME`) → 3. `<project-root>/.opencode/themes/*.json` → 4. `./.opencode/themes/*.json` (§Hierarchy) **[V1]**.
- Value forms: hex `"#ffffff"`, ANSI `0–255`, color references (`"primary"` or custom defs), dark/light variants `{"dark": …, "light": …}`, `"none"` (§JSON format) **[V1]**.
- `defs` section is optional reusable-color definitions (§Color definitions) **[V1]**.
- `"none"` inherits the terminal default for any color, e.g. `"text": "none"`, `"background": "none"` (§Terminal defaults) **[V1]**.
- Example shape: `{ "$schema": "https://opencode.ai/theme.json", "defs": { nord0…nord15 }, "theme": { primary, secondary, accent, error, warning, success, info, text, textMuted, background, backgroundPanel, backgroundElement, border, borderActive, borderSubtle, diffAdded, diffRemoved, diffContext, diffHunkHeader, diffHighlightAdded, diffHighlightRemoved, diffAddedBg, diffRemovedBg, diffContextBg, diffLineNumber, diffAddedLineNumberBg, diffRemovedLineNumberBg, markdownText, markdownHeading, markdownLink, markdownLinkText, markdownCode, markdownBlockQuote, markdownEmph, markdownStrong, markdownHorizontalRule, markdownListItem, markdownListEnumeration, markdownImage, markdownImageText, markdownCodeBlock, syntaxComment, syntaxKeyword, syntaxFunction, syntaxVariable, syntaxString, syntaxNumber, syntaxType, syntaxOperator, syntaxPunctuation } }` (§Example) **[V1]**.
- So the **V1 native schema = flat `theme` map of `{dark, light}` token pairs + optional `defs`** [V1].

### a.2 V2 page (CLI theme surface) — `https://opencode.ai/v2/docs/cli/theme/` [V2]

Sections observed: **Choose a theme** → **System colors** → **Mode** → **Adding a Theme** → **Using Themes in Plugins** → **Creating a Theme** (Structure / Colors and references / Hues / Semantic tokens / Actions and states / Dialog surface).

- Selection: `Ctrl+P → Open settings → Theme` (default `opencode`), or global CLI settings `~/.config/opencode/cli.json`: `{ "$schema": "https://opencode.ai/v2/cli.json", "theme": { "name": "tokyonight", "mode": "dark" } }`; `/themes` command changes without settings (§Choose a theme) **[V2]**.
- `mode`: `system` (follow terminal) / `dark` / `light`; single-mode custom themes are used as-is when the other is requested (§Mode) **[V2]**.
- Adding: `cp theme.json ~/.config/opencode/themes/` (global) or project `.opencode/themes/`; **filename becomes the theme name**; restart, then `/themes`; **`.json` only**; closer-to-cwd wins (§Adding a Theme) **[V2]**.
- Plugins: "CLI plugins read resolved colors through `context.theme` and the active mode through `context.themeMode`… **The public CLI plugin API does not register themes. Add custom theme definitions with JSON files**" (§Using Themes in Plugins) **[V2]**.
- Schema: `base` = complete shared token tree; `light`/`dark` = complete hue palette + optional overrides; "Modes inherit from the file's `base`; they do not inherit from the built-in OpenCode theme or from each other" (§Creating a Theme / Structure) **[V2]**.
- Colors: hex, `"transparent"`, or `$`-references (`$hue.neutral.400`, `$text.muted`) (§Colors and references) **[V2]**.
- Hues: 8 base (`gray, red, orange, yellow, green, cyan, blue, purple`) + 3 aliases (`accent, interactive, neutral`) × 9 steps (`100–900`); `categorical` array "sets the ordered hues used to distinguish agents and other repeated items" (§Hues) **[V2]**.
- Tokens: `text, background, border, scrollbar, diff, syntax, markdown`; syntax keys `comment, keyword, function, variable, string, number, type, operator, punctuation`; markdown keys `text, heading, link, linkText, code, blockQuote, emphasis, strong, horizontalRule, listItem, listEnumeration, image, imageText, codeBlock` (§Semantic tokens) **[V2]**.
- States: `$hovered, $focused, $pressed, $selected, $disabled`; actions `primary, secondary, destructive` (§Actions and states) **[V2]**.
- `@dialog` contextual surface; TUI re-resolves references after applying it (§Dialog surface) **[V2]**.
- So the **V2 native schema = `base` + `light`/`dark` hue palettes + overrides; no `defs`, no flat `theme` map** [V2].

### a.3 V2 short page — `https://opencode.ai/v2/docs/themes/` [V2]

Covers the same V2 surface in brief: theme selection belongs in `cli.json`, **not** `opencode.json`; built-ins (`aura, ayu, carbonfox, cobalt2, cursor, dracula, everforest, flexoki, catppuccin(-frappe/-macchiato), github, gruvbox, kanagawa, material, matrix, mercury, monokai, nightowl, nord, one-dark, opencode, orng, lucent-orng, osaka-jade, palenight, rosepine, solarized, synthwave84, tokyonight, vercel, vesper, zenburn`, plus `system` when the terminal palette is readable); `categorical` "must contain at least one base hue or alias"; hex may be 3/4/6/8 digits **[V2]**.

### a.4 Which covers what

- **V1 runtime behavior** (flat `defs`+`theme` JSON, `tui.json` selection, `/theme`, ANSI values, `"none"`): only the V1 page (§a.1) **[V1]**.
- **V2 runtime behavior** (`base`/`light`/`dark` JSON, `cli.json` selection, `/themes`, `"transparent"`, `context.theme` plugin reads): only the V2 pages (§a.2–a.3) **[V2]**.
- Both examples reuse the literal `$schema` URL `https://opencode.ai/theme.json` (observed in V1 §Example, V2 §Structure excerpt, and all three raw theme files in §b) **[BOTH]** — the URL alone does **not** distinguish versions; the top-level keys do (`defs`+`theme` = V1 shape; `base`+`light`/`dark` = V2 shape).
- Migration hazard (report, not independently verified): `anomalyco/opencode#44469` — "V1 custom themes silently fall back to default" in V2 (found via web search; tagged report, **UNKNOWN** whether fixed).

**§a verdict: POSSIBLE** — full native JSON theming on both surfaces; the natively themable surface is colors-only tokens (no image/background slots anywhere in either schema).

---

## b. GitHub survey: real custom themes, esp. background images

Method: web search (GitHub code search needs auth; used repo pages + `raw.githubusercontent.com` file fetches + one `api.github.com` directory listing — all read-only GETs). Three theme repos verified at the raw-file level; **zero** themes with a background image found.

### b.1 `ajaxdude/opencode-ai-poimandres-theme` (16 stars, 1 fork) — native V1 JSON [V1]

- Files live at `.opencode/themes/` in-repo: `poimandres.json`, `poimandres-turquoise-expanded.json`, `poimandres-accessible.json` (README file tree + install section).
- Install = `curl -o ~/.config/opencode/themes/poimandres.json https://raw.githubusercontent.com/ajaxdude/opencode-ai-poimandres-theme/main/.opencode/themes/poimandres.json` (README §Installation) — **plain file copy, no plugin, no terminal setting**.
- Select via `/theme` or `opencode.json` `"theme"` (README §Usage).
- Raw file verified (`…/main/.opencode/themes/poimandres.json`): top-level keys **`$schema`, `defs`, `theme`** = V1 flat shape; `defs` keys `poimandresBg, poimandresFocus, poimandresGray, …`; `theme` keys `primary, secondary, accent, error, warning, success, info, text, textMuted, background, backgroundPanel, backgroundElement, border, borderActive, borderSubtle, diffAdded, diffRemoved, diffContext, diffHunkHeader, diffHighlightAdded, diffHighlightRemoved, diffAddedBg, diffRemovedBg, diffContextBg, diffLineNumber, diffAddedLineNumberBg, diffRemovedLineNumberBg, markdownText, markdownHeading, markdownLink, markdownLinkText, markdownCode, markdownBlockQuote, markdownEmph, markdownStrong, markdownHorizontalRule, markdownListItem, markdownListEnumeration, markdownImage, markdownImageText, markdownCodeBlock, syntaxComment, syntaxKeyword, syntaxFunction, syntaxVariable, syntaxString, syntaxNumber, syntaxType, syntaxOperator, syntaxPunctuation` **plus** `inputBackground, InputBorder, InputBorderActive, inputPrompt, inputCursor, inputText`. **No image/background-image key present.**
- Mechanism: **native JSON** (V1 schema).

### b.2 `tbutkiewicz/omni-theme-opencode` (0 stars) — native V1 JSON [V1]

- Single file `omni.json` at repo root; install `cp omni.json ~/.config/opencode/themes/omni.json` (user-wide) or `.opencode/themes/omni.json` (project); select via `tui.json` `{ "$schema": "https://opencode.ai/tui.json", "theme": "omni" }` or `/theme` (README §§Installation) — **native JSON, V1-era selection file**.
- Raw file verified: top-level keys **`$schema`, `defs`, `theme`**; `defs` keys `background, currentLine, selection, foreground, comment, purple, green, orange, pink, cyan, red, yellow, darker, darkest, mid, muted`; `theme` token family identical to §b.1 (incl. `markdownImage`, `markdownImageText` — element colors, not images). **No image key present.**
- Mechanism: **native JSON** (V1 schema).

### b.3 `scaryrawr/base16-opencode` (7 stars) — native V1 JSON, generated [V1]

- `themes/*.json` (directory listing via `api.github.com` confirmed e.g. `themes/base16-3024.json`, `themes/base16-0x96f.json`, `themes/base16-apathy.json`, ~3.5 KB each); generated from base16/base24 schemes with `base16-builder-go` + repo templates, refreshed by a weekly GitHub Action (README §§How it works, Automation).
- Install: clone into `~/.config/opencode` or symlink `themes/` → `~/.config/opencode/themes`; select via `/theme` (README §§Installation, Usage) — **native JSON**.
- Raw file verified (`themes/base16-3024.json`): top-level keys **`$schema`, `defs`, `theme`**; `defs` keys `base00–base0F`; same V1 token family. **No image key present.**
- Mechanism: **native JSON** (V1 schema); notable as a **generation-pipeline analogue** for §f (template → many JSONs + scheduled refresh).

### b.4 Background images: search result

- Targeted searches (`opencode theme background image / background-image / wallpaper`, `site:github.com opencode theme json`) surfaced **no OpenCode custom theme with a background image** — only color-JSON themes, transparent-background issues, and unrelated hits (terminal wallpaper guides, VS Code marketplace entries).
- Neither schema documents any image slot: V1 values are hex / ANSI 0–255 / reference / dark-light / `"none"` (§a.1); V2 values are hex / `"transparent"` / `$`-reference (§a.2). The only `*image*` tokens (`markdownImage`, `markdownImageText`) are **markdown-element colors**, not background images [BOTH].
- The only documented transparency hooks: `"background": "none"` inherits the terminal default **[V1]** (§a.1 Terminal defaults); `"background": { "base": "transparent" }` **[V2]** (§a.2 Colors; §a.3); corroborated by reports `anomalyco/opencode#23573` (custom transparent theme), `#4669` (`"background": {"dark": "none", "light": "none"}`), `#16121` (all found via search; reports, not verified end-to-end).
- Terminal-emulator background images (Kitty `background_image`, Alacritty/Windows Terminal equivalents) were **not** verified in this lane — no emulator docs were fetched. Any such mechanism is therefore a **proposed workaround by analogy** (transparent theme lets terminal chrome show through), not a verified recipe.

**§b verdict: WORKAROUND** — color themes via native JSON: POSSIBLE (three repos, raw-verified); background image via native JSON: no mechanism exists (see PARKED §g.1); terminal-level backdrop + transparent theme is the only candidate path, unverified.

---

## c. Per-agent theming

### c.1 Is per-agent theming a native concept? No [BOTH]

- V1 agents doc (`/docs/agents/`, §Color): "`color`… affects how the agent appears in the interface" — hex or theme-color name (`primary, secondary, accent, success, warning, error, info`). No per-agent *theme* concept documented **[V1]**.
- V2 agents doc (`/v2/docs/agents/`, §Color): "`color` sets the agent's UI color using a six-digit hex value" (`color: "#ff6b6b"`). No per-agent theme concept; legacy fields (`temperature, top_p, prompt, permission, tools, disable, maxSteps`) are explicitly banned in new V2 agent config, `color` survives **[V2]**.
- Repo evidence: `.opencode/agents/blazar.md` frontmatter carries `color: "#4169E1"` (six-digit hex — V2-conformant shape) **[V2]**.

### c.2 Does the V2 plugin API expose agent-switch or session-start events? No [V2]

Source: `https://opencode.ai/v2/docs/build/plugins/` (§§Sessions, Events, Hooks) plus repo `docs/17-V2-HOOK-GAP.md` (V2 hook inventory vs `@opencode/plugin` 2.0.26 types, read 2026-10-11).

- Declared `ctx.session.hook` names (exhaustive per §Session reference): `prompt, context, compaction, generate, title, model.request, http.request, http.response, experimental.ws.handshake, experimental.ws.send, experimental.ws.receive, retry`. **No `agent-switch`, no `session-start`, no theme hook** [V2].
- `ctx.session.switchAgent({ sessionID, agent })` is a documented **action**, not an event/hook (§Sessions) [V2].
- Observability that does exist: `SessionContextHook` carries `readonly agent: string` (per-model-call visibility); `ctx.event.subscribe` streams the public server event stream (`V2EventEncoded`); CLI plugins can `context.data.on(...)` / `listen(...)` (only `permission.asked` exemplified) and read `context.theme` / `context.themeMode` (read-only) with the explicit rule "**The public CLI plugin API does not register themes**" [V2].
- `ctx.agent.transform` can inspect/update/remove agents (§Agent) — the example edits `description` only; no theme application shown [V2].
- Repo inventory (17-V2-HOOK-GAP.md): session landing sites `context` + `compaction`; event domain declares `session.deleted` and execution-terminal events (`session.execution.succeeded/interrupted`, `session.usage.recorded`) while the literal `session.idle` is **not** declared; blocking tool hooks have no promise-API abort channel. Consistent with: **events observe sessions; none switch themes** [V2].
- V1 side (`/docs/plugins/`, §Events): session events `session.created/compacted/deleted/diff/error/idle/status/updated` exist as *notifications* (e.g. notify on `session.idle`), but no theme-set API pairs with them — V1 theme changes only via `/theme` or `tui.json` file (§a.1) **[V1]**.

**§c verdict: WORKAROUND** — a plugin can *observe* the agent string per model call (`context` hook) or session events (`event.subscribe`), but no documented hook or API applies a theme per agent. Achievable today: distinct static `color` per agent + manual `/theme(s)` switching. Native automatic per-agent theming → PARKED (§g.3).

---

## d. Background images INSIDE the OpenCode UI

- Native support: **none found**. Both schemas are colors-only (§a.1 value forms; §a.2 Colors); no `image`, `backgroundImage`, `wallpaper`, or file-path token is documented on either page [BOTH]. Raw-verified theme files (§b.1–b.3) contain no such key [V1].
- Documented workaround: **none** — no docs page describes a background-image workaround. The closest *documented* primitives (composable into an unverified workaround) are: `"background": "none"` → terminal default **[V1]**; `"background": { "base": "transparent" }` **[V2]**; truecolor terminal requirement **[BOTH]**; transparency-issue reports #23573/#4669/#16121 (reports only).
- Note: OpenCode TUI renders inside the terminal; any "background image" would be terminal-emulator chrome showing through transparency, not an OpenCode surface. Emulator docs were out of scope and **not** fetched → the exact recipe is UNKNOWN.

**§d verdict: IMPOSSIBLE** (native) → PARKED (§g.1). Workaround candidate (terminal backdrop + transparent theme) is unvalidated.

---

## e. Switcher rendering: what `color` renders as; per-agent icon?

- What the docs say `color` does: "affects how the agent appears in the interface" **[V1]** (`/docs/agents/` §Color, which also allows theme-color names); "sets the agent's UI color" **[V2]** (`/v2/docs/agents/` §Color, six-digit hex only). V2 theme docs add that `cataegorical` hues "distinguish agents and other repeated items" (`/v2/docs/cli/theme/` §Hues; `/v2/docs/themes/` §Hues) **[V2]**.
- What `color: "#4169E1"` (blazar) renders as **in the Tab/agent switcher specifically** (dot? name tint? border? active-row highlight?): **UNKNOWN** — neither agents page nor any fetched page describes switcher rendering Dress. Not guessed.
- Per-agent icon/avatar/image: **no `icon`, `avatar`, `glyph`, or image field** appears in either agents doc's Options/Frontmatter surface (V1 fields enumerated through §Additional; V2 fields: description/mode/model/system/permissions/steps/hidden/color/disabled/request). Absent from both → **IMPOSSIBLE natively** → PARKED (§g.4). Whether the switcher renders any default glyph is UNKNOWN.

**§e verdict: POSSIBLE** for setting `color` (field exists both versions; blazar's six-digit hex is V2-conformant); rendering specifics UNKNOWN; per-agent icon IMPOSSIBLE → PARKED.

---

## f. RAG file schema design [Proposed] (not [Verified])

Everything in this section is **[Proposed]** design output. Cited analogues are observed patterns, not endorsements.

### f.1 Proposed versioned JSON envelope [Proposed]

```jsonc
{
  "$schema": "https://example.invalid/arsenal-rag.json", // [Proposed] mirror of the "$schema" pattern observed in every theme/config example (§a.1, §a.2, §b.1–b.3)
  "version": 1,                                          // [Proposed] integer, bump on breaking shape change
  "release": "2026-10-14",                               // [Proposed] source-release stamp for per-release refresh
  "updated_at": "2026-10-14T00:00:00Z",                   // [Proposed] fetch timestamp (ISO-8601)
  "source": "https://opencode.ai/docs/",                 // [Proposed] fetch origin (URL)
  "entries": [                                           // [Proposed] payload array
    { "id": "v2-cli-theme-mode", "url": "https://opencode.ai/v2/docs/cli/theme/", "section": "Mode", "version_tag": "v2.0.27", "text": "…" }
  ],
  "hotfixes": [                                          // [Proposed] hand-merge overlay, applied over entries
    { "id": "…", "reason": "…", "text": "…" }
  ]
}
```

### f.2 Design decisions and their analogues

| Decision [Proposed] | Analogous observed pattern (citation, not proof) |
|---|---|
| `version` integer + `$schema` URL | `$schema` keys on all theme/config files: `https://opencode.ai/theme.json`, `https://opencode.ai/tui.json`, `https://opencode.ai/v2/cli.json` (§a.1, §a.2, §b.1–b.3) [BOTH-observed] |
| Per-release refresh job | `scaryrawr/base16-opencode` weekly regeneration Action over templates (§b.3, README §§How it works/Automation) [observed] |
| Local fetch + file cache, global + project layers with closer-wins | Theme hierarchy global `~/.config/opencode/themes/` vs project `.opencode/themes/`, closer directory wins (§a.1 Hierarchy; §a.2 Adding a Theme) [BOTH-observed] |
| Hotfix merge: overlay array applied last, last-write-wins with `reason` provenance | V2 agent merging: "Later scalar values replace earlier values… permission rules append" (`/v2/docs/agents/` §Merging) [V2-observed]; provenance field itself is [Proposed] |
| Durable local JSON store | CLI-plugin `context.storage.store` durable JSON (`/v2/docs/build/plugins/cli/` §Storage) [V2-observed] |
| Payload keyed by doc URL + section | This document's own per-section citations (§a–§e) [Proposed convention] |

### f.3 Explicit non-goals / unknowns

- Refresh cadence, retention, eviction policy, entry size limits: **UNKNOWN / [Proposed]** — no source prescribes them.
- Whether hotfixes should be a separate file vs inline array: **[Proposed]** either way; no analogue dictates it.

---

## g. PARKED (IMPOSSIBLE items with reasons)

| # | Item | Reason (cited) |
|---|---|---|
| g.1 | Native background image in an OpenCode theme (V1 or V2) | No image-typed token in either schema: values are hex/ANSI-0–255/reference/dark-light/`"none"` [V1] (§a.1) and hex-3/4/6/8/`"transparent"`/`$`-ref [V2] (§a.2); three raw-verified community themes contain zero image keys (§b.1–b.3) |
| g.2 | Background-image mechanism from any surveyed community theme | Survey found file-copy-only installs (`curl`/`cp`/symlink into `~/.config/opencode/themes/` or `.opencode/themes/`, select via `/theme`, `tui.json`, or `opencode.json`) — no plugin, terminal-setting, or image mechanism in any of the three repos (§b.1–b.3) |
| g.3 | Native automatic per-agent theming (theme follows active agent) | No agent-switch/session-start/theme hook in the V2 `SessionHooks` inventory; `switchAgent` is an action; CLI plugin API "does not register themes" (§c.2). V1 has session notification events but no theme-set API (§c.2) |
| g.4 | Per-agent icon/avatar in the switcher | No icon/avatar/glyph field in either agents surface (V1 Options through §Additional; V2 description/mode/model/system/permissions/steps/hidden/color/disabled/request) (§e) |

---

## h. Sources fetched (read-only)

1. `https://opencode.ai/docs/themes/` (V1 themes) — full page.
2. `https://opencode.ai/v2/docs/cli/theme/` (V2 CLI theme) — full page.
3. `https://opencode.ai/v2/docs/themes/` (V2 themes brief) — full page.
4. `https://opencode.ai/docs/agents/` (V1 agents, incl. §Color) — full page.
5. `https://opencode.ai/docs/plugins/` (V1 plugins, incl. §Events) — full page.
6. `https://opencode.ai/v2/docs/agents/` (V2 agents, incl. §Color) — full page.
7. `https://opencode.ai/v2/docs/build/plugins/` (V2 server plugin API: Agent/Session/Event/Hooks) — full page incl. saved tail.
8. `https://opencode.ai/v2/docs/build/plugins/cli/` (V2 CLI plugin: context.theme, storage, data.on) — full page.
9. `https://opencode.ai/v2/docs/cli/config/` (V2 cli.json settings) — full page.
10. `https://raw.githubusercontent.com/ajaxdude/opencode-ai-poimandres-theme/main/.opencode/themes/poimandres.json` — full file (V1 shape).
11. `https://raw.githubusercontent.com/tbutkiewicz/omni-theme-opencode/main/omni.json` — full file (V1 shape).
12. `https://raw.githubusercontent.com/scaryrawr/base16-opencode/main/themes/base16-3024.json` — full file (V1 shape).
13. `https://api.github.com/repos/scaryrawr/base16-opencode/contents/themes?per_page=5` — directory listing (file names/sizes).
14. Repo `docs/17-V2-HOOK-GAP.md` — V2 hook inventory (read in full).
15. Repo `.opencode/agents/blazar.md` frontmatter — `color: "#4169E1"` (lines 1–30).
16. Web searches (GitHub/transparent-theme issues #23573/#4669/#16121, V1→V2 issue #44469) — treated as **reports**, not verified findings, per §a.4/§b.4.
17. `https://opencode.ai/theme.json` — fetched; returns 404 (no machine-readable schema published there). Noted so nobody cites it as a schema source.
