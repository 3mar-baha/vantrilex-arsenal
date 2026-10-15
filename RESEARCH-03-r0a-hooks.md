# R0a — Hooks probe: native per-agent auto theme switch

Scope: whether current OpenCode exposes any agent-switch, session-start, or
theme hook that could change the CLI theme automatically when the active agent
changes. Re-verified live on 2026-10-15; nothing below is cited from memory.
Prior claim under test: v0.5.0 said WORKAROUND.

## Live observation baseline

- Host runtime observed live via `opencode --version` on 2026-10-15: `v2.0.27`.
- Repo pin observed live in `.opencode/package.json`: `@opencode-ai/plugin`
  at `1.18.34` (V1-only package; its `dist/v2/promise/context.d.ts` exposes
  only `agent.transform`, `aisdk`, `catalog`, `command`, `integration`,
  `plugin`, `reference`, `skill` — no `session`, `tool`, `event`, `shell`,
  or theme domain).
- Canonical V2 server-plugin surface observed live at
  `https://opencode.ai/v2/docs/build/plugins/` (fetched 2026-10-15).
- CLI plugin surface observed live at
  `https://opencode.ai/v2/docs/build/plugins/cli/` (fetched 2026-10-15).
- Theme surface observed live at `https://opencode.ai/v2/docs/cli/theme/`
  and `https://opencode.ai/v2/docs/cli/config/` (both fetched 2026-10-15).
- Local V1 hook inventory observed live in
  `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts` (`Hooks`
  interface, lines 173–322) and the module mirror in
  `.opencode/plugin/arsenal.ts` (header lines 1–62, V1/V2 type mirrors).

## Candidate hooks examined

### 1. Agent-switch hook (sought — not found)

- Name sought: any `agent.switch`, `agent.change`, `session.agent`, or
  session-hook entry reacting to an agent change.
- Where observed: absent from the full `SessionHooks` reference on the live
  V2 plugin page. The declared session-hook map is exactly: `prompt`,
  `context`, `compaction`, `generate`, `title`, `model.request`,
  `http.request`, `http.response`, `experimental.ws.handshake`,
  `experimental.ws.send`, `experimental.ws.receive`, `retry`. No agent-switch
  entry appears in that map or anywhere else on the page.
- What it can do: nothing — it does not exist, so no plugin can register for
  an agent-change event.
- What it cannot do: fire on `ctx.session.switchAgent`, fire on a user
  `/agents` selection, or carry old-agent/new-agent payload. The closest live
  sentence is under prompt admission: "Agent mentions do not switch the
  session's active agent."

### 2. Session-start / session-created hook (sought — not found as a start trigger)

- Names sought: `session.created`, `session.start`, `session.init`, V1
  `experimental.chat.system.transform` as a start surrogate.
- Where observed: no `created`/`start`/`init` entry in the live V2
  `SessionHooks` map above. V1 `experimental.chat.system.transform`
  (observed in installed `dist/index.d.ts` lines 265–270, `system: string[]`)
  exists only on the V1 `server()` surface, which V2 ignores; the V2
  `context` hook fires per model call, not once per session. `ctx.event`
  `.subscribe` exposes the public server event stream, but no documented
  session-created admission hook with a mutable theme payload was observed.
- What it can do: `prompt` runs once per admission (can rewrite text/files,
  cannot redirect session or switch agent); `context` can push system parts
  per model call; `event.subscribe` can observe events and unsubscribe via
  abort on cleanup.
- What it cannot do: run once at session start with the ability to set or
  change the CLI theme; session/message IDs on the prompt hook are readonly.

### 3. Theme hook / theme-set API (sought — not found)

- Names sought: any `theme` hook, `theme.change`, `theme.set`, or plugin
  method registering/selecting a theme.
- Where observed: live theme page states verbatim, "The public CLI plugin
  API does not register themes. Add custom theme definitions with JSON files
  in the directories above." The live CLI plugin page shows theme access as
  read-only: `context.theme` (resolved color tokens) and
  `context.themeMode` (active mode) for rendering, with no setter. Theme
  selection observed live is static config (`theme.name`/`theme.mode` in
  `~/.config/opencode/cli.json`) plus interactive `/themes`, and theme
  definition files under `.opencode/themes/` or
  `~/.config/opencode/themes/` (`.json` only, filename becomes the name).
- What it can do: a CLI plugin can read tokens so its components follow the
  selected theme; an operator can install a theme JSON and pick it manually
  or pin it in `cli.json`.
- What it cannot do: register a theme from plugin code, set the active theme
  from a hook, or react to an agent change with a theme change. No
  theme-write path was observed on any hook or context.

### 4. Supporting surfaces checked (why they do not compose into native auto-switch)

- `ctx.session.switchAgent({ sessionID, agent })` — observed live on the V2
  plugin page under Sessions. It is an imperative action a command can call,
  not a hook; it changes the session's agent but carries no theme side
  effect and fires no theme hook (none exists).
- `ctx.agent.transform` — observed live on the V2 plugin page under Agent.
  Registration-time editor (`list`/`get`/`default`/`update`/`remove`) plus
  `reload()`; it edits agent definitions, it does not fire per switch and
  cannot touch the theme.
- `ctx.command.transform` (`editor.add({ name, description, execute })`) —
  observed live on the V2 plugin page under Commands. A command's `execute`
  can call `ctx.session.prompt`/`switchAgent`, which is the non-native
  (explicit-invocation) path, not an automatic hook.
- `ctx.tool.hook("execute.before"/"execute.after")`,
  `ctx.shell.hook("create.before")`, `ctx.permission.hook("evaluate")` —
  observed live on the V2 plugin page under Tools/Shell/Permissions. None
  observes agent identity changes for theming; tool `execute.after` can edit
  `result`/`metadata` and shell `create.before` can edit
  `command`/`cwd`/`timeout`/`env`, neither can set the CLI theme.

## Verdict

R0a verdict: WORKAROUND
