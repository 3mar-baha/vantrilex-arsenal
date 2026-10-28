/**
 * Vantrilex Arsenal - Tier-0 guards for OpenCode.
 *
 * OpenCode has no hooks directory. Hooks are plugin callbacks, so all eight
 * logical Tier-0 hooks live in this single module and are registered on the
 * callbacks that actually fire for them.
 *
 * The module default-exports ONE object carrying both plugin surfaces, because
 * the two runtimes read disjoint parts of it: V2 reads `id` + `setup()` from a
 * default export and never invokes a V1 plugin function, while V1 reads
 * `server()` and ignores the rest.
 *
 * V2 - `setup()`, six hooks plus the merged plan-guard append:
 *
 *   8. taskDispatcher            -> session "prompt"        (per user prompt)
 *   +  plan-guard append         -> session "prompt"        (same registration)
 *   9. seatDenyOverlay           -> permission "evaluate"   (deny-only overlay)
 *   4. longRunningProcessGuard   -> tool "execute.before" + shell "create.before"
 *   +  diffSizeGuard             -> tool "execute.before"   (write calls only)
 *   7. docsDisciplineGuard       -> tool "execute.before" + shell "create.before"
 *   5. typescriptCheck           -> tool "execute.after"    (conditional)
 *   6. prettierFormat            -> tool "execute.after"    (conditional)
 *
 * The plan-guard append (ق-6) is registered by the SAME `prompt` callback as the
 * dispatcher, so exactly one plugin file loads and no prompt hook runs twice.
 * Every registered callback checks the per-project kill switch (م-4) at its head
 * and no-ops entirely when a signal is set. `setup()` also probes the six
 * documented hooks once (م-3) and reports what it observed, never more.
 *
 * V1 - `server()`, all seven hooks (6 locked hook components plus the
 * docs-discipline guard, which is not a lock component); the eighth logical
 * hook, the dispatcher, rides the `chat.message` callback below:
 *
 *   1. sessionStart              -> experimental.chat.system.transform, event
 *   2. preCompact                -> experimental.session.compacting
 *   3. sessionEnd                -> event
 *   4. longRunningProcessGuard   -> tool.execute.before
 *   5. typescriptCheck           -> tool.execute.after   (conditional)
 *   6. prettierFormat            -> tool.execute.after   (conditional)
 *   +  docsDisciplineGuard       -> tool.execute.before   (docs discipline)
 *
 * The three session-lifecycle callbacks (`experimental.chat.system.transform`,
 * `experimental.session.compacting`, `event`) are carried through `server()`
 * unchanged and are INERT under V2. That gap is deliberate, not unfinished:
 * V2's `context` hook takes a `SystemPart[]` where V1's transform took a
 * `string[]`, and V2's `compaction` hook takes an optional
 * `SessionCompactionResult` where V1 appended to a `context: string[]`, so
 * porting those three means reworking what each guard writes, which is a
 * separate concern from the per-turn and per-tool guards ported here. V2's
 * `execute.after` hook reports a discriminated `{ status, result | error }`
 * union where V1 handed the guard a mutable `{ title, output, metadata }` to
 * append to: the V2 adapter reuses the V1 check functions against a shim
 * output and forwards the shim text into the V2 `result.content` (appended to
 * a string, pushed as a text part onto an array, set when absent), draining
 * the serialised type-check chain first so no queued verdict is lost. The
 * shell `create.before` hook carries no session id, so its guard outcomes are
 * recorded under `anonymous` by design.
 *
 * Rules this module obeys without exception:
 *
 *   - Zero dependencies. Nothing is imported that is not a Node built-in.
 *   - Node-only runtime. No foreign runtime assumptions.
 *   - Every guard degrades to SKIPPED with a stated reason. A guard never
 *     crashes a session and never reports PASS for work it did not do.
 *   - Hook callbacks mutate their output argument in place and return void.
 *   - Message parts are never synthesized. The host validates stored part
 *     identity (id/sessionID/messageID) before save, so a hook that needs
 *     words in the turn appends to an existing user text part instead of
 *     pushing a new one. (Proven 2026-10-11 on host 1.18.34: a bare
 *     `{ type: "text", text }` part fails validation and aborts the run.)
 *   - Nothing here writes outside the resolved state directory.
 */

/* ===========================================================================
 * 1. Optional-peer type surface
 * ===========================================================================
 *
 * `@opencode-ai/plugin` is injected by the OpenCode runtime, not installed in
 * this repository, and this repository adds no dependencies. A literal
 * `import type { Plugin } from "@opencode-ai/plugin"` therefore fails to
 * resolve under `tsc --noEmit`, and an in-file `declare module` block fails
 * differently: inside a module file that form is a module augmentation, so
 * TypeScript reports TS2664.
 *
 * The contract is therefore mirrored structurally below. The shapes match the
 * published Hooks interface one-to-one, so a consumer that *does* have the
 * package installed can assert compatibility with a single line of throwaway
 * type-checking; this module itself stays dependency-free and compiles clean.
 */

export type PluginLevel = "debug" | "info" | "warn" | "error"

export type PluginClientLike = {
  app?: {
    log?: (input: {
      body: { service: string; level: PluginLevel; message: string }
    }) => unknown
  }
}

export type PluginProjectLike = {
  id?: string
  worktree?: string
  vcs?: string
}

export type PluginInput = {
  client?: PluginClientLike
  project?: PluginProjectLike
  directory?: string
  worktree?: string
  $?: unknown
}

export type ToolExecuteBeforeInput = {
  tool: string
  sessionID: string
  callID: string
}

export type ToolExecuteBeforeOutput = {
  // The published surface types args as `any`; every read below narrows it
  // through a guard before use, so no unchecked value reaches the guards.
  args: unknown
}

export type ToolExecuteAfterInput = ToolExecuteBeforeInput & {
  args: unknown
}

export type ToolExecuteAfterOutput = {
  title: string
  output: string
  metadata: unknown
}

export type ChatMessageInput = {
  sessionID: string
  agent?: string
  model?: { providerID: string; modelID: string }
  messageID?: string
  variant?: string
}

export type ChatMessageOutput = {
  message: unknown
  parts: unknown
}

export type SystemTransformInput = {
  sessionID?: string
  model: unknown
}

export type SystemTransformOutput = {
  system: string[]
}

export type CompactingInput = {
  sessionID: string
  messageID?: string
}

export type CompactingOutput = {
  context: string[]
  prompt?: string
}

export type EventEnvelope = {
  event?: { type?: unknown; properties?: unknown }
}

export type Hooks = {
  event?: (input: EventEnvelope) => Promise<void>
  config?: (config: unknown) => void
  "chat.message"?: (input: ChatMessageInput, output: ChatMessageOutput) => Promise<void>
  "tool.execute.before"?: (
    input: ToolExecuteBeforeInput,
    output: ToolExecuteBeforeOutput,
  ) => Promise<void>
  "tool.execute.after"?: (
    input: ToolExecuteAfterInput,
    output: ToolExecuteAfterOutput,
  ) => Promise<void>
  "experimental.chat.system.transform"?: (
    input: SystemTransformInput,
    output: SystemTransformOutput,
  ) => Promise<void>
  "experimental.session.compacting"?: (
    input: CompactingInput,
    output: CompactingOutput,
  ) => Promise<void>
}

export type Plugin = (input: PluginInput) => Promise<Hooks>

/* ===========================================================================
 * 1b. V2 plugin surface
 * ===========================================================================
 *
 * The reasoning from the block above applies one release later. `@opencode/plugin`
 * is equally absent from this dependency-free repository, so the V2 contract is
 * mirrored structurally too.
 *
 * The mirror covers exactly the four V2 hook keys this module registers: `prompt`
 * from the twelve-entry `SessionHooks` map, `execute.before`/`execute.after`
 * from `ToolHooks`, and `create.before` from `ShellHooks`. Mirroring hooks
 * this module does not register (notably `context` and `compaction`) would be
 * a claim about the V2 contract that nothing in this file can check and that
 * would drift silently the next time the package changes shape.
 */

/**
 * The V2 `prompt` hook event, mirrored from `@opencode/plugin` 2.0.22
 * `dist/promise/session.d.ts`:
 *
 *   export interface SessionPrompt {
 *       readonly sessionID: Session.ID;
 *       readonly messageID: SessionMessage.ID;
 *       prompt: Types.DeepMutable<PromptInput.Prompt>;
 *       metadata?: Record<string, unknown>;
 *       delivery: SessionInbox.Delivery;
 *   }
 *
 * `Types.DeepMutable` is why `prompt.text` is assignable even though the
 * underlying `PromptInput.Prompt` schema declares every field `readonly`: V2
 * hands the hook an owned draft rather than the caller's argument. That is the
 * whole reason the V2 surface can write to the prompt at all.
 */
export type SessionPromptEvent = {
  readonly sessionID?: string
  prompt: { text: string }
}

/** V2 `Location.Info`, narrowed to the single field this module reads. */
export type PluginLocationLike = {
  directory?: string
}

/**
 * The V2 plugin `Context`, narrowed to the members this module uses. The
 * published context also carries agent, provider, model, permission, vcs
 * and more; none of them are reachable from a hook this module registers.
 */
/** V2 `tool.execute.before` event, narrowed to the fields this module reads. */
export type V2ToolBeforeEvent = {
  tool: string
  readonly sessionID?: string
  readonly agent?: string
  readonly messageID?: string
  readonly id?: string
  input: unknown
}

/** V2 `tool.execute.after` event, narrowed to the fields this module reads. */
export type V2ToolAfterEvent = {
  readonly tool: string
  readonly sessionID?: string
  readonly agent?: string
  readonly messageID?: string
  readonly id?: string
  readonly input: unknown
  readonly status: "completed" | "error"
  result?: unknown
  error?: unknown
}

/** V2 `shell.create.before` event, narrowed to the fields this module reads. */
export type V2ShellBeforeEvent = {
  command: string
  cwd: string
  timeout: number
  shell: string
  env: Record<string, string | undefined>
}

/**
 * V2 `permission.hook("evaluate")` event, mirrored from the published
 * `PermissionEvaluation` reference:
 *
 *   interface PermissionEvaluation {
 *     readonly sessionID: string
 *     readonly agent?: string
 *     readonly action: string
 *     readonly resources: readonly string[]
 *     readonly metadata?: Record<string, unknown>
 *     readonly source?: { type: "tool"; messageID: string; id: string }
 *     effect: "allow" | "ask" | "deny"
 *     message?: string
 *   }
 *
 * `agent` is optional, so every overlay must carry a session-agent fallback;
 * `resources` is a list, so one rule may match several resources of one call;
 * and `effect`/`message` are the only mutable fields. An explicit configured
 * deny is final and does not invoke the hook, so a hook can harden an `allow`
 * or an `ask` but can never soften a `deny`.
 */
export type PermissionEvaluation = {
  readonly sessionID: string
  readonly agent?: string
  readonly action: string
  readonly resources: readonly string[]
  readonly metadata?: Record<string, unknown>
  readonly source?: { type: "tool"; messageID: string; id: string }
  effect: "allow" | "ask" | "deny"
  message?: string
}

export type PluginContextLike = {
  location?: PluginLocationLike
  session?: {
    hook?: (
      name: "prompt",
      callback: (event: SessionPromptEvent) => Promise<void> | void,
    ) => Promise<unknown>
    /**
     * V2 `ctx.session.get`. Read only for the seat-deny overlay's session-agent
     * fallback: the permission evaluation's `agent` field is optional, and the
     * host documents that a missing `agent` "defaults to the session's agent".
     * A context without this method degrades to the overlay's event cache.
     */
    get?: (input: { sessionID: string }) => Promise<unknown>
  }
  tool?: {
    hook?: (
      name: "execute.before" | "execute.after",
      callback: (event: V2ToolBeforeEvent & V2ToolAfterEvent) => Promise<void> | void,
    ) => Promise<unknown>
  }
  shell?: {
    hook?: (
      name: "create.before",
      callback: (event: V2ShellBeforeEvent) => Promise<void> | void,
    ) => Promise<unknown>
  }
  permission?: {
    hook?: (
      name: "evaluate",
      callback: (event: PermissionEvaluation) => Promise<void> | void,
    ) => Promise<unknown>
  }
}

export type PluginCleanup = () => Promise<void> | void

/** Mirrors the published `Plugin` interface from `@opencode/plugin` V2. */
export type PluginDefinition = {
  readonly id: string
  readonly setup: (context: PluginContextLike) => Promise<PluginCleanup | void> | PluginCleanup | void
}

/**
 * Mirrors `Plugin.define`, which the published package declares as
 * `export declare function define(plugin: Plugin): Plugin`.
 *
 * Identity at runtime, typed at the call site, so the definition object below
 * is checked against the mirrored V2 contract exactly as `Plugin.define` would
 * check it - without adding the dependency this repository refuses to take.
 */
export const definePlugin = <T extends PluginDefinition>(plugin: T): T => plugin

/**
 * The single default export both runtimes accept.
 *
 * V2 reads `id` and `setup()` and ignores `server()`. OpenCode V1 `>= 1.18.29`
 * reads `server()` and ignores the rest. Neither runtime dispatches the other
 * runtime's hooks, so one file can carry both surfaces without either runtime
 * loading a hook it has no way to fire.
 */
export type ArsenalPluginModule = PluginDefinition & { server: Plugin }

/* ===========================================================================
 * 2. Node runtime shim
 * ===========================================================================
 *
 * `@types/node` is also absent from this dependency-free repository, so the
 * built-ins are loaded through a non-literal specifier and immediately narrowed
 * to a minimal local interface. The dynamic import is the single place where a
 * value is untyped; everything downstream is fully checked.
 */

type FsLike = {
  existsSync: (target: string) => boolean
  mkdirSync: (target: string, options: { recursive: true }) => unknown
  readFileSync: (target: string, encoding: "utf8") => string
  writeFileSync: (target: string, data: string, encoding: "utf8") => void
  statSync: (target: string) => { mtimeMs: number }
}

type PathLike = {
  join: (...parts: string[]) => string
  resolve: (...parts: string[]) => string
  dirname: (target: string) => string
  basename: (target: string, extension?: string) => string
  extname: (target: string) => string
  isAbsolute: (target: string) => boolean
}

type ChildProcessError = {
  code?: number | string
  killed?: boolean
  message?: string
}

type ExecFileLike = (
  file: string,
  args: readonly string[],
  options: {
    cwd: string
    timeout: number
    windowsHide: boolean
    maxBuffer: number
    encoding: string
  },
  callback: (error: ChildProcessError | null, stdout: string, stderr: string) => void,
) => void

type OsLike = {
  tmpdir: () => string
}

type ProcLike = {
  env: Record<string, string | undefined>
  platform: string
  execPath: string
  cwd: () => string
}

type Runtime = {
  fs: FsLike | null
  path: PathLike | null
  execFile: ExecFileLike | null
  os: OsLike | null
  proc: ProcLike
  loadErrors: string[]
}

const EMPTY_PATH: PathLike = {
  join: (...parts) => parts.filter((part) => part.length > 0).join("/").replace(/\/{2,}/g, "/"),
  resolve: (...parts) => parts.filter((part) => part.length > 0).join("/").replace(/\/{2,}/g, "/"),
  dirname: (target) => target.slice(0, Math.max(target.lastIndexOf("/"), 0)) || ".",
  basename: (target, extension) => {
    const name = target.slice(target.lastIndexOf("/") + 1)
    return extension && name.endsWith(extension) ? name.slice(0, name.length - extension.length) : name
  },
  extname: (target) => {
    const name = target.slice(target.lastIndexOf("/") + 1)
    const dot = name.lastIndexOf(".")
    return dot <= 0 ? "" : name.slice(dot).toLowerCase()
  },
  isAbsolute: (target) => target.startsWith("/") || /^[A-Za-z]:[\\/]/.test(target),
}

const readProcess = (): ProcLike => {
  const scope = globalThis as unknown as { process?: ProcLike }
  return scope.process ?? { env: {}, platform: "unknown", execPath: "node", cwd: () => "." }
}

const importBuiltIn = async <T>(specifier: string): Promise<T | null> => {
  // The specifier is a variable on purpose: a literal would demand a resolvable
  // ambient declaration, which a dependency-free checkout cannot provide.
  return (await import(specifier)) as T
}

let runtimePromise: Promise<Runtime> | null = null

const loadRuntime = (): Promise<Runtime> => {
  if (runtimePromise) return runtimePromise
  runtimePromise = (async (): Promise<Runtime> => {
    const loadErrors: string[] = []
    const attempt = async <T>(specifier: string): Promise<T | null> => {
      try {
        return await importBuiltIn<T>(specifier)
      } catch (error) {
        loadErrors.push(`${specifier}: ${error instanceof Error ? error.message : String(error)}`)
        return null
      }
    }
    const [fs, path, childProcess, os] = await Promise.all([
      attempt<FsLike>("node:fs"),
      attempt<PathLike>("node:path"),
      attempt<{ execFile?: ExecFileLike }>("node:child_process"),
      attempt<OsLike>("node:os"),
    ])
    return {
      fs,
      path,
      execFile: childProcess?.execFile ?? null,
      os,
      proc: readProcess(),
      loadErrors,
    }
  })()
  return runtimePromise
}

/* ===========================================================================
 * 3. Constants and tunables
 * ========================================================================= */

const SERVICE = "vantrilex-arsenal"

/** Total wall-clock budget for assembling one CONTEXT ANCHOR. */
const ANCHOR_READ_BUDGET_MS = 10_000

/** Conservative cost estimates, used to refuse a read before it is started. */
const COST_FILE_READ_MS = 400
const COST_STATE_READ_MS = 200
const COST_GIT_MS = 1_200

// The two doc paths below are the equipped TARGET project's numbering, not this
// repository's own docs series. This repo is 00-16; an equipped project follows
// the 28-file set Vanguard generates, where 25-AI-CONSTITUTION.md and
// 00-PROJECT-SUMMARY.md do exist. A missing file here is SKIPPED, never a FAIL.
const CONSTITUTION_PATH = "docs/25-AI-CONSTITUTION.md"
const SUMMARY_PATH = "docs/00-PROJECT-SUMMARY.md"
const CONFIG_PATH = ".opencode/arsenal.json"

/**
 * Per-project kill switch (م-4). Four signals, resolved in this order:
 *
 *   1. `VANTRILEX_DISABLED=1` in the process environment (read per hook).
 *   2. `vantrilex.enabled: false` in `.opencode/config.json` (read at setup).
 *   3. `excludedProjects` listing this project in the global OpenCode config
 *      (`$XDG_CONFIG_HOME/opencode/opencode.json`, else `$HOME/.config/...`).
 *   4. The file `.opencode/.vantrilex-disable` existing (read per hook).
 *
 * A missing, unreadable or malformed signal file never disables anything: the
 * switch fails towards armed, exactly like the docs-guard and dispatcher flags.
 */
const PROJECT_SWITCH_PATH = ".opencode/config.json"
const DISABLE_FILE_PATH = ".opencode/.vantrilex-disable"
const DISABLE_ENV_NAME = "VANTRILEX_DISABLED"

/** Diff Size Guard thresholds (blueprint `:200`): lines OR files, not both. */
const DIFF_LINE_LIMIT = 120
const DIFF_FILE_LIMIT = 4

const TSC_TIMEOUT_MS = 120_000
const PRETTIER_TIMEOUT_MS = 60_000
const GIT_TIMEOUT_MS = 15_000

const MAX_DIAGNOSTIC_LINES = 40
const MAX_ANCHOR_VALUE_CHARS = 400
const MAX_CAPTURED_INTENT_CHARS = 600

/**
 * The task-dispatch instruction injected ahead of every user message.
 *
 * The session `prompt` hook is the only per-turn write surface in this hook API,
 * so the instruction is re-sent on every single prompt and its cost is paid
 * again each time. The budget is therefore five lines, not five paragraphs: the
 * five scenarios are named, each with its one-clause obligation, and the
 * procedure itself is deferred to the vanguard skill that already owns it. A
 * longer injection would not add behaviour, it would only add tokens per prompt.
 *
 * One seat denies every skill outright (`vantrilex.md:9-11`), so an
 * unconditional order to load the vanguard skill would order a denied call.
 * The first line is therefore conditional, and it names the fallback: a seat
 * that denies the skill records the refusal and applies the scenario rule
 * itself instead of loading the playbook.
 */
const TASK_DISPATCH_INSTRUCTION = [
  "[arsenal] task-dispatcher: classify this prompt into exactly one scenario and run that scenario's playbook in the vantrilex-vanguard skill when the seat allows it; if the seat denies the skill, record it and apply the rule. If the prompt is genuinely ambiguous, ask the user one short clarifying question before proceeding.",
  "1 NEW TASK (no task in flight): Vanguard task-dispatch from scratch. 2 CONTINUATION (same task, unchanged): silent no-op; keep the existing phase-kit plan.",
  "3 TASK MODIFICATION (same task, changed): Vanguard re-dispatch on the modified task and state what changed.",
  "4 CONTINUATION WITH MODIFICATION: completed phases stay locked; re-plan the remaining phases only.",
  "5 CONTINUATION WITH NEW TASK: checkpoint and park the current task, fresh Vanguard dispatch for the new one; keep the lanes separate and always state which lane you are working.",
].join("\n")

const WRITE_TOOLS = new Set(["write", "edit", "patch", "multiedit", "create", "apply_patch"])

const SESSION_BEGIN_EVENTS = new Set([
  "session.created",
  "session.started",
  "session.resumed",
  "session.init",
])

const SESSION_END_EVENTS = new Set(["session.idle", "session.deleted", "session.ended", "session.closed"])

/**
 * Foreground processes that never return on their own. A backgrounding helper
 * is not available in this environment, so the only supported way to keep logs
 * reachable is to redirect the command's output to a file.
 */
const LONG_RUNNING_PATTERNS: readonly RegExp[] = [
  /\b(?:npm|pnpm|yarn|bun|deno|npx)\s+(?:run\s+|exec\s+)?(?:dev|start|serve|preview|watch)\b/,
  /\b(?:next|nuxt|astro|remix|svelte-kit|vite|ng|webpack|rollup|esbuild|parcel)\b[^\n]*\b(?:dev|serve|start|preview)\b/,
  /\b(?:node|bun|deno)\b[^\n]*(?:--watch|--watch-path|--inspect-brk=)\b/,
  /\bnodemon\b/,
  /\b(?:http-server|live-server|serve|watchpack)\b/,
  /\bdocker(?:\s+compose)?\s+up\b/,
  /\b(?:cargo|go|dotnet)\s+run\b/,
  /\b(?:jest|vitest)\b[^\n]*--watch\b/,
  /\btsc\b[^\n]*--watch\b/,
  /\b(?:eslint|stylelint|webpack|rollup|prettier)\b[^\n]*(?:--watch|-w)\b/,
  /\btail\b[^\n]*(?:\s-f\b|--follow\b)/,
  /\b(?:npm|pnpm|yarn|bun)\s+test\b[^\n]*--watch\b/,
]

/** Output-redirection forms that leave the log readable from another shell. */
const LOG_REDIRECT_PATTERNS: readonly RegExp[] = [
  /(?:^|[\s|&;(])(?:\d>>?|>)\s*("[^"]+"|'[^']+'|[^\s|&;)]+)/,
  /\|\s*(?:tee|tee\s+-a)\s+("[^"]+"|'[^']+'|[^\s|&;]+)/,
  /\bnohup\b/,
  /\bStart-Process\b/i,
]

/**
 * Docs-discipline allow-list. Extending it needs no code change: add a path to
 * `docsGuard.allowedDirs` or `docsGuard.allowedFiles`, or widen the numbered
 * series, in `.opencode/arsenal.json`.
 *
 * Allowed directories are prefix-matched against the repo-relative path after
 * the entry's trailing slashes are stripped and a single `/` is appended, so
 * `"brand"` admits `brand/IDENTITY.md`. An entry never admits itself and never
 * matches a same-named sibling such as `branding/notes.md`.
 */
export type DocsGuardConfig = {
  mode: "block" | "warn" | "off"
  /** Kill switch, equivalent to the task-dispatcher `enabled` flag. Explicit `false` disarms the guard. */
  enabled: boolean
  allowedDirs: string[]
  allowedFiles: string[]
  /** Numbered series such as docs/00-..27-. Series entries are `dir` + range. */
  series: { dir: string; from: number; to: number }[]
}

export const DEFAULT_DOCS_GUARD: DocsGuardConfig = {
  mode: "warn",
  enabled: true,
  allowedDirs: ["docs/99-archive", "docs/spec", "registry", ".opencode", "brand"],
  allowedFiles: [
    "CLAUDE.md",
    "README.md",
    "README.ar.md",
    "AI_GUIDE.md",
    "AGENTS.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
  ],
  series: [{ dir: "docs", from: 0, to: 27 }],
}

const MARKDOWN_EXTENSIONS = new Set([".md", ".markdown", ".mdx"])

/**
 * Task-dispatcher kill switch.
 *
 * The flag defaults to enabled and is honoured only on an explicit boolean
 * `false`, for the same reason the docs guard defaults to warn-but-armed: a
 * missing file, malformed JSON or a half-written config must never quietly
 * disarm a guard. It also means a config that cannot be parsed fails towards
 * the documented default in both directions instead of guessing.
 */
export type TaskDispatcherConfig = {
  enabled: boolean
}

export const DEFAULT_TASK_DISPATCHER: TaskDispatcherConfig = { enabled: true }

/**
 * Resolved per-project kill switch (م-4). `enabled` comes from the project's
 * `.opencode/config.json`; `excludedProjects` from the global config. The two
 * live signals (`VANTRILEX_DISABLED=1` and the disable file) are read at hook
 * time instead of being snapshotted here, so an emergency stop works mid-session.
 */
export type VantrilexSwitch = {
  enabled: boolean
  excludedProjects: string[]
}

export const DEFAULT_VANTRILEX_SWITCH: VantrilexSwitch = { enabled: true, excludedProjects: [] }

/* ===========================================================================
 * 4. Result plumbing
 * ========================================================================= */

type Attempt<T> = { status: "ok"; value: T } | { status: "fail"; reason: string }

const ok = <T>(value: T): Attempt<T> => ({ status: "ok", value })
const fail = <T>(reason: string): Attempt<T> => ({ status: "fail", reason })

type RunResult = {
  code: number
  stdout: string
  stderr: string
  timedOut: boolean
  spawnFailed: boolean
}

/* ===========================================================================
 * 5. Process-wide context
 * ========================================================================= */

type SessionState = {
  id: string
  openedAt: number
  lastIntent: string
  touchedFiles: Set<string>
  guardOutcomes: string[]
  circuit: { failures: number; openedAt?: number }
  /** HEAD the Diff Size Guard last warned about; a new commit re-arms it. */
  warnedDiffHead: string
  /**
   * Last agent observed on a V2 event of this session. The permission
   * evaluation's `agent` is optional; this is the cache the seat-deny overlay
   * falls back to when neither the event nor `ctx.session.get` names one.
   */
  agent: string
  /**
   * LD-01 pre-digested summary state. Built incrementally while the session
   * runs, so the compact-time summary is already shaped (plan plus error
   * traces plus tagged wrong turns plus recoverable pointers), never
   * assembled after the fact.
   */
  digest: SmartDigest
}

type ArsenalContext = {
  rt: Runtime
  root: string
  client: PluginClientLike | undefined
  sessions: Map<string, SessionState>
  anchors: Map<string, ContextAnchor>
  config: ArsenalConfig
  tscChain: Promise<void>
  pendingWarnings: string[]
  lastLogTarget: string | null
  /** One line per documented hook, from the setup-time capability probe. */
  capabilityLines: string[]
  capabilitiesFlushed: boolean
}

type ArsenalConfig = {
  docsGuard: DocsGuardConfig
  taskDispatcher: TaskDispatcherConfig
  vantrilex: VantrilexSwitch
}

type ContextAnchor = {
  sessionId: string
  fields: { label: string; value: string }[]
  unread: string[]
  elapsedMs: number
  text: string
}

const sessionState = (ctx: ArsenalContext, sessionId: string): SessionState => {
  const existing = ctx.sessions.get(sessionId)
  if (existing) return existing
  const created: SessionState = {
    id: sessionId,
    openedAt: Date.now(),
    lastIntent: "",
    touchedFiles: new Set<string>(),
    guardOutcomes: [],
    circuit: { failures: 0 },
    warnedDiffHead: "",
    agent: "",
    digest: newDigestState(),
  }
  ctx.sessions.set(sessionId, created)
  return created
}

/* ===========================================================================
 * 6. Logging
 * ========================================================================= */

const log = (ctx: ArsenalContext, level: PluginLevel, message: string): void => {
  const sink = ctx.client?.app?.log
  if (!sink) return
  try {
    void sink({ body: { service: SERVICE, level, message } })
  } catch {
    // A logger that throws must not take a guard down with it.
  }
}

/* ===========================================================================
 * 7. Path helpers
 * ========================================================================= */

const toPosix = (target: string): string => target.replace(/\\/g, "/")

const normalizeRelative = (root: string, target: string): string => {
  const posixRoot = toPosix(root).replace(/\/+$/, "")
  const posixTarget = toPosix(target)
  if (posixTarget === posixRoot) return ""
  if (posixTarget.startsWith(`${posixRoot}/`)) return posixTarget.slice(posixRoot.length + 1)
  const winDrive = /^[A-Za-z]:\//.exec(posixRoot)
  if (winDrive && posixTarget.startsWith(posixRoot)) return posixTarget.slice(posixRoot.length + 1)
  return posixTarget.replace(/^\.\//, "").replace(/^\/+/, "")
}

const extensionOf = (rt: Runtime, target: string): string => {
  const fromPath = rt.path?.extname(target)
  if (fromPath) return fromPath.toLowerCase()
  const name = target.slice(target.lastIndexOf("/") + 1)
  const dot = name.lastIndexOf(".")
  return dot <= 0 ? "" : name.slice(dot).toLowerCase()
}

const basenameOf = (target: string): string => target.slice(target.lastIndexOf("/") + 1) || target

/**
 * Contain a session id before it reaches path construction (F4).
 *
 * preCompact and sessionEnd build join(stateDir, handoff|sessions,
 * sessionId + .md) from an id the host supplies. A hostile id with
 * dot-dot-slash segments would otherwise escape the state directory. The
 * mapping keeps every byte outside [A-Za-z0-9._-] (both separators included)
 * as an underscore, strips leading dots so lone dot and dot-dot collapse,
 * caps length, and falls back to anonymous when nothing survives. ses_ style
 * ids pass through unchanged. In-memory session keys keep the raw id on
 * purpose: only the filesystem path is contained.
 */
export const sanitizeSessionId = (raw: unknown): string => {
  const text = typeof raw === "string" ? raw : ""
  const cleaned = text
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 128)
  return cleaned.length > 0 ? cleaned : "anonymous"
}

const isMarkdownPath = (rt: Runtime, target: string): boolean =>
  MARKDOWN_EXTENSIONS.has(extensionOf(rt, target))

const clip = (value: string, max: number): string => {
  const flat = value.replace(/\s+/g, " ").trim()
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).trimEnd()}…`
}

/** Narrow an untyped tool argument or event payload to an indexable record. */
const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {}

/* ===========================================================================
 * 8. Filesystem helpers
 * ========================================================================= */

type Deadline = {
  remaining: () => number
  expired: () => boolean
}

const createDeadline = (budgetMs: number): Deadline => {
  const limit = Date.now() + budgetMs
  return {
    remaining: () => Math.max(0, limit - Date.now()),
    expired: () => Date.now() >= limit,
  }
}

/** Refuse a read before it starts when its estimated cost would overrun. */
const budgetAllows = (deadline: Deadline, estimatedCostMs: number): boolean =>
  !deadline.expired() && deadline.remaining() >= estimatedCostMs

const readTextFile = (rt: Runtime, target: string, maxBytes = 512 * 1024): Attempt<string> => {
  if (!rt.fs) return fail("filesystem unavailable in this runtime")
  try {
    if (!rt.fs.existsSync(target)) return fail(`missing: ${toPosix(target)}`)
    const stat = rt.fs.statSync(target)
    if (stat.mtimeMs < 0) return fail(`unreadable: ${toPosix(target)}`)
    const text = rt.fs.readFileSync(target, "utf8")
    return ok(text.length > maxBytes ? text.slice(0, maxBytes) : text)
  } catch (error) {
    return fail(`read failed: ${toPosix(target)} (${error instanceof Error ? error.message : String(error)})`)
  }
}

const writeTextFile = (rt: Runtime, target: string, data: string): Attempt<string> => {
  if (!rt.fs) return fail("filesystem unavailable in this runtime")
  try {
    const dir = rt.path ? rt.path.dirname(target) : target.slice(0, target.lastIndexOf("/"))
    rt.fs.mkdirSync(dir, { recursive: true })
    rt.fs.writeFileSync(target, data, "utf8")
    return ok(target)
  } catch (error) {
    return fail(`write failed: ${toPosix(target)} (${error instanceof Error ? error.message : String(error)})`)
  }
}

/* ===========================================================================
 * 9. State directory resolution
 * ===========================================================================
 *
 * Order: explicit override, then a git-ignored cache inside the project, then
 * the OS temp directory. Never the working tree itself - a guard must not be
 * the reason a release is blocked for a dirty worktree.
 */

const resolveStateDir = (rt: Runtime, root: string): string => {
  const join = rt.path?.join ?? EMPTY_PATH.join
  const override = rt.proc.env.VANTRILEX_STATE_DIR
  if (override && override.trim().length > 0) return override.trim()
  if (rt.fs) {
    const cached = join(root, "node_modules", ".cache", "vantrilex-arsenal")
    try {
      rt.fs.mkdirSync(cached, { recursive: true })
      return cached
    } catch {
      // Fall through to the temp directory.
    }
  }
  const tmp = rt.os?.tmpdir()
  if (tmp && tmp.length > 0) return join(tmp, "vantrilex-arsenal")
  return join(root, ".opencode", "state")
}

/* ===========================================================================
 * 10. Subprocess helper
 * ========================================================================= */

const runCommand = (
  rt: Runtime,
  file: string,
  args: readonly string[],
  options: { cwd: string; timeoutMs: number },
): Promise<RunResult> =>
  new Promise((resolve) => {
    if (!rt.execFile) {
      resolve({ code: -1, stdout: "", stderr: "", timedOut: false, spawnFailed: true })
      return
    }
    let settled = false
    const settle = (result: RunResult): void => {
      if (settled) return
      settled = true
      resolve(result)
    }
    try {
      rt.execFile(
        file,
        args,
        { cwd: options.cwd, timeout: options.timeoutMs, windowsHide: true, maxBuffer: 8 * 1024 * 1024, encoding: "utf8" },
        (error, stdout, stderr) => {
          const out = typeof stdout === "string" ? stdout : ""
          const err = typeof stderr === "string" ? stderr : ""
          if (!error) {
            settle({ code: 0, stdout: out, stderr: err, timedOut: false, spawnFailed: false })
            return
          }
          const code = error.code
          if (typeof code === "number") {
            settle({ code, stdout: out, stderr: err, timedOut: false, spawnFailed: false })
            return
          }
          settle({ code: -1, stdout: out, stderr: err, timedOut: error.killed === true, spawnFailed: true })
        },
      )
    } catch (error) {
      settle({
        code: -1,
        stdout: "",
        stderr: error instanceof Error ? error.message : String(error),
        timedOut: false,
        spawnFailed: true,
      })
    }
  })

/** Resolve a project-local executable, Windows shims included. */
const resolveLocalBinary = (rt: Runtime, root: string, name: string): string | null => {
  if (!rt.fs || !rt.path) return null
  const base = rt.path.join(root, "node_modules", ".bin", name)
  const candidates =
    rt.proc.platform === "win32" ? [`${base}.cmd`, `${base}.exe`, `${base}.bat`, base] : [base]
  for (const candidate of candidates) {
    try {
      if (rt.fs.existsSync(candidate)) return candidate
    } catch {
      return null
    }
  }
  return null
}

/**
 * A toolchain entry point, plus the arguments that must precede the tool's own.
 *
 * The JavaScript entry point is preferred over the `node_modules/.bin` shim
 * because a `.cmd` shim cannot be spawned directly on Windows: `execFile`
 * rejects it with EINVAL. Running the entry point through the current Node
 * binary keeps the spawn shell-free and identical on every platform.
 */
type ResolvedTool = { command: string; prefixArgs: string[]; via: string }

const TOOLCHAIN_ENTRIES: Record<string, { bin: string; entries: string[] }> = {
  tsc: { bin: "tsc", entries: ["typescript/lib/tsc.js", "typescript/lib/tsc.mjs", "typescript/lib/tsc.cjs"] },
  prettier: {
    bin: "prettier",
    entries: ["prettier/bin/prettier.cjs", "prettier/bin/prettier.js", "prettier/bin-prettier.js"],
  },
}

const resolveTool = (rt: Runtime, root: string, name: string): ResolvedTool | null => {
  const join = rt.path?.join ?? EMPTY_PATH.join
  const spec = TOOLCHAIN_ENTRIES[name]
  if (!spec) return null
  for (const entry of spec.entries) {
    const candidate = join(root, "node_modules", entry)
    try {
      if (rt.fs?.existsSync(candidate)) {
        return {
          command: rt.proc.execPath.length > 0 ? rt.proc.execPath : "node",
          prefixArgs: [candidate],
          via: entry,
        }
      }
    } catch {
      return null
    }
  }
  const shim = resolveLocalBinary(rt, root, spec.bin)
  return shim ? { command: shim, prefixArgs: [], via: spec.bin } : null
}

/* ===========================================================================
 * 11. Git introspection
 * ========================================================================= */

type GitFacts = {
  branch: string
  worktrees: string
  dirty: string
  /** HEAD commit; present only when the caller asked for diff facts. */
  head?: string
  /** Changed path count; `null` when git status could not be read. */
  changedFiles?: number | null
  /** Tracked added+removed lines vs HEAD; `null` when git diff could not run. */
  changedLines?: number | null
}

const readGitFacts = async (
  rt: Runtime,
  root: string,
  deadline: Deadline,
  withDiff = false,
): Promise<Attempt<GitFacts>> => {
  if (!budgetAllows(deadline, COST_GIT_MS)) return fail("read budget exhausted before git state")
  const binary = resolveLocalBinary(rt, root, "git") ?? "git"
  const branchRun = await runCommand(rt, binary, ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd: root,
    timeoutMs: GIT_TIMEOUT_MS,
  })
  if (branchRun.spawnFailed) return fail("git is not executable in this environment")
  if (branchRun.code !== 0) return fail(`git rev-parse exited ${branchRun.code}: ${branchRun.stderr.trim()}`)
  const branch = branchRun.stdout.trim() || "unknown"

  if (!budgetAllows(deadline, COST_GIT_MS / 2)) {
    return ok({ branch, worktrees: "unknown", dirty: "unknown" })
  }
  const worktreeRun = await runCommand(rt, binary, ["worktree", "list", "--porcelain"], {
    cwd: root,
    timeoutMs: GIT_TIMEOUT_MS,
  })
  const worktreePaths =
    worktreeRun.spawnFailed || worktreeRun.code !== 0
      ? []
      : worktreeRun.stdout
          .split("\n")
          .filter((line) => line.startsWith("worktree "))
          .map((line) => toPosix(line.slice("worktree ".length).trim()))
          .filter((line) => line.length > 0)
  // The current worktree is named by the branch; the rest are listed by name.
  const worktrees =
    worktreePaths.length === 0
      ? "unknown"
      : worktreePaths
          .map((entry) => {
            const relative = normalizeRelative(root, entry)
            return relative.length > 0 && relative !== entry ? `…/${relative}` : basenameOf(entry)
          })
          .join(", ")

  if (!budgetAllows(deadline, COST_GIT_MS / 2)) {
    return ok({ branch, worktrees, dirty: "unknown" })
  }
  const statusRun = await runCommand(rt, binary, ["status", "--short"], {
    cwd: root,
    timeoutMs: GIT_TIMEOUT_MS,
  })
  // A non-zero exit means the state is unknown. Reporting it as clean would be a
  // false PASS, which is worse than an honest unknown.
  const statusLines = statusRun.spawnFailed || statusRun.code !== 0
    ? null
    : statusRun.stdout.split("\n").filter((line) => line.trim().length > 0)
  const dirty =
    statusLines === null ? "unknown" : statusLines.length === 0 ? "clean" : `${statusLines.length} changed path(s)`

  const facts: GitFacts = { branch, worktrees, dirty }
  if (!withDiff) return ok(facts)

  // Diff facts for the Diff Size Guard. File count comes from `git status`,
  // which includes untracked paths; line count comes from `git diff --numstat
  // HEAD`, which covers staged and unstaged tracked changes only. Untracked
  // files therefore count toward the four-file ceiling and contribute zero
  // lines: their size is not measured rather than guessed.
  facts.changedFiles = statusLines === null ? null : statusLines.length
  if (!budgetAllows(deadline, COST_GIT_MS / 2)) return ok(facts)
  const headRun = await runCommand(rt, binary, ["rev-parse", "HEAD"], { cwd: root, timeoutMs: GIT_TIMEOUT_MS })
  facts.head = headRun.spawnFailed || headRun.code !== 0 ? "" : headRun.stdout.trim()
  if (facts.head.length === 0 || !budgetAllows(deadline, COST_GIT_MS / 2)) {
    facts.changedLines = null
    return ok(facts)
  }
  const diffRun = await runCommand(rt, binary, ["diff", "--numstat", "HEAD"], { cwd: root, timeoutMs: GIT_TIMEOUT_MS })
  if (diffRun.spawnFailed || diffRun.code !== 0) {
    facts.changedLines = null
    return ok(facts)
  }
  let changedLines = 0
  for (const row of diffRun.stdout.split("\n")) {
    const columns = row.split("\t")
    if (columns.length < 2) continue
    const added = Number.parseInt(columns[0], 10)
    const removed = Number.parseInt(columns[1], 10)
    // Binary rows report "-" in both columns and carry no line count.
    if (Number.isNaN(added) || Number.isNaN(removed)) continue
    changedLines += added + removed
  }
  facts.changedLines = changedLines
  return ok(facts)
}

/* ===========================================================================
 * 12. Markdown field extraction
 * ========================================================================= */

const firstHeading = (markdown: string): string => {
  for (const line of markdown.split("\n")) {
    const match = /^#{1,6}\s+(.*\S)\s*$/.exec(line)
    if (match) return clip(match[1], MAX_ANCHOR_VALUE_CHARS)
  }
  return ""
}

const sectionBody = (markdown: string, names: readonly string[]): string => {
  const wanted = new Set(names.map((name) => name.toLowerCase()))
  const lines = markdown.split("\n")
  let capturing = false
  let depth = 0
  const collected: string[] = []
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.*?)\s*$/.exec(line)
    if (heading) {
      const level = heading[1].length
      const title = heading[2].toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
      if (capturing && level <= depth) break
      if (wanted.has(title)) {
        capturing = true
        depth = level
        continue
      }
    }
    if (capturing) collected.push(line)
  }
  return collected.join("\n").trim()
}

const labeledValue = (markdown: string, labels: readonly string[]): string => {
  for (const label of labels) {
    const pattern = new RegExp(`^[ \\t]*(?:\\*\\*)?${label}(?:\\*\\*)?[ \\t]*[:=-][ \\t]*(.+)$`, "im")
    const match = pattern.exec(markdown)
    if (match) return clip(match[1], MAX_ANCHOR_VALUE_CHARS)
  }
  return ""
}

const firstSentence = (markdown: string): string => {
  const prose = markdown
    .split("\n")
    .filter((line) => line.trim().length > 0 && !/^#{1,6}\s/.test(line) && !/^[-*|>]/.test(line.trim()))
  return prose.length === 0 ? "" : clip(prose.join(" "), MAX_ANCHOR_VALUE_CHARS)
}

/* ===========================================================================
 * 13. Configuration
 * ========================================================================= */

/** Parse a JSON config file into a record; any failure yields `{}`. */
const readJsonConfig = (rt: Runtime, target: string): Record<string, unknown> => {
  const attempt = readTextFile(rt, target, 64 * 1024)
  if (attempt.status !== "ok") return {}
  try {
    return asRecord(JSON.parse(attempt.value))
  } catch {
    return {}
  }
}

/**
 * The global OpenCode config directory, or `null` when no home directory is
 * resolvable. The path is the one the host documents and this repository
 * already cites: `$XDG_CONFIG_HOME/opencode/opencode.json`, falling back to
 * `$HOME/.config/opencode/opencode.json` (`USERPROFILE` on Windows).
 */
const globalConfigRoot = (rt: Runtime): string | null => {
  const env = rt.proc.env
  const xdg = typeof env.XDG_CONFIG_HOME === "string" ? env.XDG_CONFIG_HOME.trim() : ""
  if (xdg.length > 0) return xdg
  const home =
    typeof env.HOME === "string" && env.HOME.trim().length > 0
      ? env.HOME.trim()
      : typeof env.USERPROFILE === "string" && env.USERPROFILE.trim().length > 0
        ? env.USERPROFILE.trim()
        : ""
  return home.length > 0 ? `${toPosix(home).replace(/\/+$/, "")}/.config` : null
}

/**
 * Read both snapshotted kill-switch signals (م-4). Malformed or absent files
 * resolve to the armed default in both directions; only an explicit
 * `vantrilex.enabled === false` disarms, and only exact path matches exclude.
 */
const readVantrilexSwitch = (rt: Runtime, root: string): VantrilexSwitch => {
  const join = rt.path?.join ?? EMPTY_PATH.join
  const projectFlag = asRecord(readJsonConfig(rt, join(root, PROJECT_SWITCH_PATH)).vantrilex)
  const enabled = typeof projectFlag.enabled === "boolean" ? projectFlag.enabled : DEFAULT_VANTRILEX_SWITCH.enabled

  const configRoot = globalConfigRoot(rt)
  if (configRoot === null) return { enabled, excludedProjects: [] }
  const globalConfig = readJsonConfig(rt, join(configRoot, "opencode", "opencode.json"))
  const nested = asRecord(globalConfig.vantrilex).excludedProjects
  const flat = globalConfig.excludedProjects
  const declared = Array.isArray(nested) ? nested : Array.isArray(flat) ? flat : []
  return {
    enabled,
    excludedProjects: declared.filter((entry): entry is string => typeof entry === "string"),
  }
}

const readConfig = (rt: Runtime, root: string): ArsenalConfig => {
  const join = rt.path?.join ?? EMPTY_PATH.join
  const attempt = readTextFile(rt, join(root, CONFIG_PATH), 64 * 1024)
  let parsed: unknown = null
  if (attempt.status === "ok") {
    try {
      parsed = JSON.parse(attempt.value)
    } catch {
      parsed = null
    }
  }
  // Every section is resolved independently, so a config that sets only one of
  // them still honours the other. A single combined early return would drop the
  // task-dispatcher kill switch whenever the docs-guard section happened to be
  // absent, which is precisely the file a user edits to disable one hook.
  if (!parsed || typeof parsed !== "object") parsed = {}
  const raw = (parsed as { docsGuard?: unknown }).docsGuard
  const guard = raw && typeof raw === "object" ? (raw as Partial<DocsGuardConfig>) : {}
  const stringList = (value: unknown, fallback: string[]): string[] =>
    Array.isArray(value)
      ? value.filter((entry): entry is string => typeof entry === "string").map((entry) => toPosix(entry).replace(/^\/+|\/+$/g, ""))
      : fallback
  const mode = guard.mode === "warn" || guard.mode === "off" || guard.mode === "block" ? guard.mode : DEFAULT_DOCS_GUARD.mode
  const docsEnabled = typeof guard.enabled === "boolean" ? guard.enabled : DEFAULT_DOCS_GUARD.enabled
  const series = Array.isArray(guard.series)
    ? guard.series.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return []
        const candidate = entry as { dir?: unknown; from?: unknown; to?: unknown }
        if (typeof candidate.dir !== "string" || typeof candidate.from !== "number" || typeof candidate.to !== "number") {
          return []
        }
        return [{ dir: toPosix(candidate.dir).replace(/^\/+|\/+$/g, ""), from: candidate.from, to: candidate.to }]
      })
    : DEFAULT_DOCS_GUARD.series
  const dispatcher = (parsed as { taskDispatcher?: unknown }).taskDispatcher
  const declared =
    dispatcher && typeof dispatcher === "object" ? (dispatcher as { enabled?: unknown }).enabled : undefined
  const enabled = typeof declared === "boolean" ? declared : DEFAULT_TASK_DISPATCHER.enabled
  return {
    docsGuard: {
      mode,
      enabled: docsEnabled,
      allowedDirs: stringList(guard.allowedDirs, DEFAULT_DOCS_GUARD.allowedDirs),
      allowedFiles: stringList(guard.allowedFiles, DEFAULT_DOCS_GUARD.allowedFiles),
      series: series.length > 0 ? series : DEFAULT_DOCS_GUARD.series,
    },
    taskDispatcher: { enabled },
    vantrilex: readVantrilexSwitch(rt, root),
  }
}

/**
 * The kill switch, evaluated at the head of every registered hook (م-4).
 * Returns the observed signal, or `null` when the guard is armed.
 *
 * Signals are named so a probe can assert which one suppressed behaviour; a
 * reason string is not user-facing copy, it is evidence.
 */
export const killSwitchReason = (ctx: ArsenalContext): string | null => {
  const env = ctx.rt.proc.env
  if (env[DISABLE_ENV_NAME] === "1") return `${DISABLE_ENV_NAME}=1 in the environment`

  const project = ctx.config?.vantrilex
  if (!project) return null
  if (project.enabled === false) return `vantrilex.enabled=false in ${PROJECT_SWITCH_PATH}`

  const join = ctx.rt.path?.join ?? EMPTY_PATH.join
  const caseFold = ctx.rt.proc.platform === "win32"
  const normalize = (value: string): string => {
    const posix = toPosix(value).replace(/\/+$/, "")
    return caseFold ? posix.toLowerCase() : posix
  }
  const root = normalize(ctx.root)
  if (project.excludedProjects.some((entry) => normalize(entry) === root)) {
    return `excludedProjects lists ${toPosix(ctx.root)} in the global config`
  }

  if (ctx.rt.fs) {
    try {
      if (ctx.rt.fs.existsSync(join(ctx.root, DISABLE_FILE_PATH))) return `${DISABLE_FILE_PATH} exists`
    } catch {
      // An unreadable marker directory cannot prove exclusion: stay armed.
    }
  }
  return null
}

/* ===========================================================================
 * 14. Guard reporting
 * ========================================================================= */

type GuardStatus = "PASS" | "FAIL" | "SKIPPED" | "WARN" | "BLOCKED"

const formatGuardLine = (name: string, status: GuardStatus, detail: string): string =>
  `[arsenal] ${name}: ${status}${detail.length > 0 ? ` — ${detail}` : ""}`

const appendGuardLine = (output: ToolExecuteAfterOutput, line: string): void => {
  if (!output || typeof output.output !== "string") return
  output.output = `${output.output}\n${line}`
}

/* ===========================================================================
 * 15. Argument inspection
 * ========================================================================= */

const candidatePathsFrom = (root: string, args: unknown): string[] => {
  if (!args || typeof args !== "object") return []
  const found: string[] = []
  const push = (value: unknown): void => {
    if (typeof value === "string" && value.trim().length > 0) {
      found.push(normalizeRelative(root, value.trim()))
    }
  }
  const record = asRecord(args)
  for (const key of ["filePath", "file_path", "path", "file", "filename", "target", "notebook_path"]) {
    push(record[key])
  }
  for (const key of ["paths", "files"]) {
    const list = record[key]
    if (Array.isArray(list)) for (const entry of list) push(entry)
  }
  for (const key of ["edits", "patches"]) {
    const list = record[key]
    if (Array.isArray(list)) {
      for (const entry of list) {
        if (entry && typeof entry === "object") {
          const nested = entry as Record<string, unknown>
          push(nested.filePath)
          push(nested.file_path)
          push(nested.path)
        }
      }
    }
  }
  return Array.from(new Set(found.filter((entry) => entry.length > 0)))
}

/**
 * Shell write targets for the docs-discipline guard (F1).
 *
 * The bash tool carries no filePath argument, so candidatePathsFrom sees
 * nothing and the guard used to return before any verdict. Shell file writes
 * are recovered here with deliberately narrow patterns: output redirection
 * (greater-than, double greater-than, including heredoc redirects, which use
 * the same operator for their target file) and tee operands, with single,
 * double or no quoting. The result is normalised exactly like edit-tool
 * paths and flows through the same docsGuardVerdict logic.
 *
 * M-1 closed: privilege prefixes (sudo/doas/su with flags and sudo user
 * args), path-qualified tee, the pipe-merge operator (|&) and
 * newline separators are command position and verdict exactly like a bare
 * piped tee. Residual, documented rather than handled: this is not a shell
 * parser. Variable expansion, command substitution, brace expansion, dd of=,
 * install -D, interpreter-embedded writes such as python -c open(...), and
 * operator evasion through quoting all bypass detection. A bypass that hides
 * the operator hides the write; the guard flags detectable cases only.
 */
export const bashMarkdownTargets = (root: string, command: unknown): string[] => {
  if (typeof command !== "string" || command.trim().length === 0) return []
  const found: string[] = []
  const push = (token: string | undefined): void => {
    if (typeof token !== "string") return
    const cleaned = token.replace(/^["']|["']$/g, "").trim()
    if (cleaned.length === 0 || cleaned.startsWith("-") || cleaned.startsWith("/dev/")) return
    found.push(normalizeRelative(root, cleaned))
  }
  const TOKEN = "(\"[^\"]+\"|'[^']+'|[^\\s;&|()<>]+)"
  const redirect = new RegExp("(?:^|[\\s;&|()])\\d?>>?\\|?\\s*" + TOKEN, "g")
  for (const match of command.matchAll(redirect)) push(match[1])
  // M-1: tee at command position, including privilege (sudo/doas/su with flags
  // and sudo user args) and path-qualified (any */tee) prefixes, plus the
  // pipe-merge operator (|&) and newline separators. A bare word tee that is
  // an argument (echo tee, grep=tee, commit -m tee, prose about tee) is not at
  // command position and stays silent: the match must open at the start of the
  // input or just after a shell operator. The R2 negative pins guard this
  // boundary, so widening the gate here must keep them green.
  const teeCommand = /(?:^|[|&;()\n\r])\s*(?:(?:sudo|doas|su)\s+(?:[^\s|&;()<>]+\s+)*)?(?:[^\s|&;()<>]*\/)?tee(?=[\s|&;()<>]|$)/gi
  let teeMatch: RegExpExecArray | null
  while ((teeMatch = teeCommand.exec(command)) !== null) {
    const tail = command.slice(teeMatch.index + teeMatch[0].length)
    const segment = /^\s*[^|&;\n\r]*/.exec(tail)?.[0] ?? ""
    const tokens = segment.match(/("[^"]+"|'[^']+'|[^\s]+)/g) ?? []
    let flagsDone = false
    for (const token of tokens) {
      const cleaned = token.replace(/^["']|["']$/g, "")
      if (!flagsDone && cleaned === "--") {
        flagsDone = true
        continue
      }
      if (!flagsDone && cleaned.startsWith("-") && cleaned.length > 1) continue
      flagsDone = true
      push(token)
    }
  }
  return Array.from(new Set(found))
}

const recordTouchedFiles = (ctx: ArsenalContext, sessionId: string, paths: readonly string[]): void => {
  if (paths.length === 0) return
  const state = sessionState(ctx, sessionId)
  for (const entry of paths) state.touchedFiles.add(entry)
}

/* ===========================================================================
 * 16. Hook 1 - session start
 * ========================================================================= */

const buildAnchor = async (ctx: ArsenalContext, sessionId: string): Promise<ContextAnchor> => {
  const started = Date.now()
  const deadline = createDeadline(ANCHOR_READ_BUDGET_MS)
  const unread: string[] = []
  const fields: { label: string; value: string }[] = []

  let constitution = ""
  if (budgetAllows(deadline, COST_FILE_READ_MS)) {
    const attempt = readTextFile(ctx.rt, (ctx.rt.path ?? EMPTY_PATH).join(ctx.root, CONSTITUTION_PATH))
    if (attempt.status === "ok") constitution = attempt.value
    else unread.push(CONSTITUTION_PATH)
  } else {
    unread.push(CONSTITUTION_PATH)
  }

  let summary = ""
  if (budgetAllows(deadline, COST_FILE_READ_MS)) {
    const attempt = readTextFile(ctx.rt, (ctx.rt.path ?? EMPTY_PATH).join(ctx.root, SUMMARY_PATH))
    if (attempt.status === "ok") summary = attempt.value
    else unread.push(SUMMARY_PATH)
  } else {
    unread.push(SUMMARY_PATH)
  }

  let previous = ""
  const stateDir = resolveStateDir(ctx.rt, ctx.root)
  const previousPath = (ctx.rt.path ?? EMPTY_PATH).join(stateDir, "latest-session.md")
  if (budgetAllows(deadline, COST_STATE_READ_MS)) {
    const attempt = readTextFile(ctx.rt, previousPath, 64 * 1024)
    if (attempt.status === "ok") previous = attempt.value
  } else {
    unread.push("latest-session.md")
  }

  const gitAttempt = await readGitFacts(ctx.rt, ctx.root, deadline)
  const git = gitAttempt.status === "ok"
    ? gitAttempt.value
    : { branch: "unknown", worktrees: "unknown", dirty: "unknown" }
  if (gitAttempt.status !== "ok") unread.push("git")

  const state = sessionState(ctx, sessionId)

  const mission =
    labeledValue(summary, ["Mission"]) ||
    labeledValue(constitution, ["Mission"]) ||
    firstSentence(summary) ||
    firstHeading(summary) ||
    "unknown"

  const phase =
    labeledValue(summary, ["Phase", "Current phase", "Lifecycle phase"]) ||
    labeledValue(constitution, ["Phase", "Current phase"]) ||
    labeledValue(previous, ["Phase"]) ||
    "unknown"

  const branch = git.branch.length > 0 ? git.branch : "unknown"

  const worktrees = git.worktrees.length > 0 ? `${git.worktrees} (worktree: ${git.dirty})` : "unknown"

  const next =
    labeledValue(summary, ["Next", "Next step", "Next action"]) ||
    sectionBody(summary, ["next", "next steps", "what is next"]) ||
    sectionBody(constitution, ["next", "next steps"]) ||
    labeledValue(previous, ["Next"]) ||
    state.lastIntent ||
    "unknown"

  const guards = describeGuards(ctx)

  const circuitPrior = labeledValue(previous, ["Circuit"]) || "unknown"
  const circuit =
    state.circuit.failures > 0
      ? `open (${state.circuit.failures} consecutive guard failure${state.circuit.failures === 1 ? "" : "s"} this session)`
      : circuitPrior !== "unknown"
        ? circuitPrior
        : "closed (no failure recorded)"

  fields.push(
    { label: "Mission", value: mission },
    { label: "Phase", value: phase },
    { label: "Branch", value: branch },
    { label: "Worktrees", value: worktrees },
    { label: "Next", value: next },
    { label: "Guards", value: guards },
    { label: "Circuit", value: circuit },
  )

  const elapsedMs = Date.now() - started
  const lines = ["CONTEXT ANCHOR", ...fields.map((field) => `${field.label}: ${field.value}`)]
  lines.push(
    `Read budget: ${ANCHOR_READ_BUDGET_MS - elapsedMs}ms remaining; unread ${unread.length === 0 ? "none" : unread.join(", ")}`,
  )
  if (ctx.lastLogTarget) lines.push(`Last guard log: ${ctx.lastLogTarget}`)

  return {
    sessionId,
    fields,
    unread,
    elapsedMs,
    text: lines.join("\n"),
  }
}

const describeGuards = (ctx: ArsenalContext): string => {
  const parts = [
    "session-start",
    "pre-compact",
    "session-end",
    "long-running-process-guard",
    "docs-discipline-guard",
  ]
  parts.push(`typescript-check(${hasTypeScript(ctx) ? "on" : "skipped"})`)
  parts.push(`prettier-format(${hasPrettier(ctx) ? "on" : "skipped"})`)
  return parts.join(", ")
}

/* ===========================================================================
 * 17. Hook 4 - long-running process guard
 * ========================================================================= */

const detectLogTarget = (command: string): string | null => {
  for (const pattern of LOG_REDIRECT_PATTERNS) {
    const match = pattern.exec(command)
    if (!match) continue
    if (match[1]) return match[1].replace(/^["']|["']$/g, "")
    if (/nohup/i.test(match[0])) return "nohup.out"
    if (/start-process/i.test(match[0])) return "<detached process output>"
  }
  return null
}

const splitSegments = (command: string): string[] =>
  command
    .split(/\r?\n|\|\||&&|;|\|/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)

const offendingSegments = (command: string): string[] => {
  const lowered = command.toLowerCase()
  return splitSegments(command).filter((segment) =>
    LONG_RUNNING_PATTERNS.some((pattern) => pattern.test(lowered) && pattern.test(segment.toLowerCase())),
  )
}

const guardBlockMessage = (segments: readonly string[]): string => {
  const list = segments.map((segment) => `  - ${clip(segment, 160)}`).join("\n")
  const posix = '  <command> > logs/<name>.log 2>&1'
  const windows = "  <command> *> logs\\<name>.log"
  return [
    "[arsenal] long-running-process-guard: BLOCKED",
    "",
    "These commands hold the shell open for the rest of the session:",
    list,
    "",
    "No backgrounding helper is available in this environment, so the only way",
    "to keep the output readable after the command starts is to redirect it to a",
    "log file. Add the redirect, then read the log from another shell.",
    "",
    "POSIX shells:",
    posix,
    "PowerShell:",
    windows,
    "",
    "Then follow the output with:",
    "  tail -f logs/<name>.log              (POSIX)",
    "  Get-Content -Wait logs\\<name>.log   (PowerShell)",
    "",
    "A command that already redirects, pipes to tee, or detaches is accepted as-is;",
    "the guard then records the log path so it can be surfaced in the next anchor.",
  ].join("\n")
}

/* ===========================================================================
 * 18. Hook 5 and 6 - conditional toolchain guards
 * ========================================================================= */

const nearestTsconfig = (rt: Runtime, root: string, file: string): string | null => {
  const dirname = rt.path?.dirname ?? EMPTY_PATH.dirname
  const join = rt.path?.join ?? EMPTY_PATH.join
  let current = rt.path?.isAbsolute(file) === true ? dirname(file) : join(root, dirname(file))
  const stops = new Set([join(root, "node_modules"), root, dirname(root)])
  for (let depth = 0; depth < 24; depth += 1) {
    if (stops.has(current)) break
    const candidate = join(current, "tsconfig.json")
    if (rt.fs?.existsSync(candidate)) return candidate
    const parent = dirname(current)
    if (parent === current) break
    current = parent
  }
  const fallback = join(root, "tsconfig.json")
  return rt.fs?.existsSync(fallback) ? fallback : null
}

const packageJsonDependencies = (rt: Runtime, root: string): Record<string, string> => {
  const join = rt.path?.join ?? EMPTY_PATH.join
  const attempt = readTextFile(rt, join(root, "package.json"), 512 * 1024)
  if (attempt.status !== "ok") return {}
  try {
    const parsed = JSON.parse(attempt.value) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    return { ...(parsed.dependencies ?? {}), ...(parsed.devDependencies ?? {}) }
  } catch {
    return {}
  }
}

const hasTypeScript = (ctx: ArsenalContext): boolean =>
  resolveTool(ctx.rt, ctx.root, "tsc") !== null &&
  nearestTsconfig(ctx.rt, ctx.root, (ctx.rt.path ?? EMPTY_PATH).join(ctx.root, "package.json")) !== null

const hasPrettier = (ctx: ArsenalContext): boolean => {
  if (resolveTool(ctx.rt, ctx.root, "prettier") === null) return false
  const join = ctx.rt.path?.join ?? EMPTY_PATH.join
  const basename = ctx.rt.path?.basename ?? EMPTY_PATH.basename
  const names = [".prettierrc", ".prettierrc.json", ".prettierrc.jsonc", ".prettierrc.yml", ".prettierrc.yaml", ".prettierrc.toml", ".prettierrc.js", ".prettierrc.mjs", ".prettierrc.cjs", "prettier.config.js", "prettier.config.mjs", "prettier.config.cjs"]
  for (const name of names) {
    if (ctx.rt.fs?.existsSync(join(ctx.root, name))) return true
  }
  const configDir = join(ctx.root, ".config")
  if (ctx.rt.fs?.existsSync(join(configDir, basename(".prettierrc")))) return true
  return Object.prototype.hasOwnProperty.call(packageJsonDependencies(ctx.rt, ctx.root), "prettier")
}

/** Serialize the type check so overlapping edits cannot race each other. */
const enqueueTypeCheck = (ctx: ArsenalContext, work: () => Promise<void>): void => {
  const previous = ctx.tscChain
  ctx.tscChain = previous
    .then(work)
    .catch(() => {
      // A failed run already recorded its own verdict; the queue keeps moving.
    })
}

const diagnosticsFrom = (result: RunResult): string => {
  const combined = `${result.stdout}\n${result.stderr}`
  const lines = combined
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
  return lines.slice(0, MAX_DIAGNOSTIC_LINES).join("\n")
}

/* ===========================================================================
 * 19. Hook 7 - docs discipline guard
 * ========================================================================= */

const docsGuardVerdict = (ctx: ArsenalContext, relativePath: string): { allowed: boolean; reason: string } => {
  const guard = ctx.config.docsGuard
  const target = toPosix(relativePath).replace(/^\.\//, "").replace(/^\/+/, "")
  if (target.length === 0) return { allowed: true, reason: "empty path" }

  const lowered = target.toLowerCase()
  for (const file of guard.allowedFiles) {
    if (toPosix(file).toLowerCase() === lowered) return { allowed: true, reason: `allow-listed file ${file}` }
  }
  for (const dir of guard.allowedDirs) {
    const prefix = `${toPosix(dir).replace(/\/+$/, "")}/`
    if (lowered.startsWith(prefix.toLowerCase())) return { allowed: true, reason: `allow-listed directory ${dir}/` }
  }
  for (const series of guard.series) {
    const prefix = `${toPosix(series.dir).replace(/\/+$/, "")}/`
    if (!lowered.startsWith(prefix.toLowerCase())) continue
    const name = target.slice(prefix.length)
    const match = /^(\d{2})-[A-Za-z0-9][A-Za-z0-9._-]*$/.exec(name)
    if (!match) continue
    const index = Number.parseInt(match[1], 10)
    if (index >= series.from && index <= series.to) {
      return { allowed: true, reason: `canonical series ${series.dir}/${match[1]}-` }
    }
  }
  return {
    allowed: false,
    reason: `${target} is outside the canonical documentation set`,
  }
}

const describeAllowedSet = (ctx: ArsenalContext): string => {
  const guard = ctx.config.docsGuard
  const series = guard.series
    .map((entry) => `${entry.dir}/${String(entry.from).padStart(2, "0")}- through ${entry.dir}/${String(entry.to).padStart(2, "0")}-`)
    .join(", ")
  return [
    `mode: ${guard.mode}`,
    `numbered series: ${series}`,
    `directories: ${guard.allowedDirs.join(", ")}`,
    `files: ${guard.allowedFiles.join(", ")}`,
    `extend by editing docsGuard in ${CONFIG_PATH}`,
  ].join("; ")
}

const guardDocsMessage = (violations: readonly { path: string; reason: string }[], allowedSet: string): string =>
  [
    "[arsenal] docs-discipline-guard: BLOCKED",
    "",
    ...violations.map((entry) => `  - ${entry.path}: ${entry.reason}`),
    "",
    "Documentation lives in the canonical numbered set or an allow-listed directory",
    "(for example brand/, which owns the visual identity specification). Do the following instead:",
    "  - fold the content into the existing document that already owns the topic;",
    "  - extend the numbered series in the project summary and update the index;",
    "  - or move a superseded document to the archive directory.",
    "",
    "Currently allowed:",
    `  ${allowedSet}`,
    "",
    "To widen the allow-list for a legitimate location, add it to docsGuard in",
    `${CONFIG_PATH} and re-run the check.`,
  ].join("\n")

/* ===========================================================================
 * 20. Guard implementations
 * ========================================================================= */

const anchorFor = async (ctx: ArsenalContext, sessionId: string): Promise<ContextAnchor> => {
  const cached = ctx.anchors.get(sessionId)
  if (cached) return cached
  const anchor = await buildAnchor(ctx, sessionId)
  ctx.anchors.set(sessionId, anchor)
  return anchor
}

/**
 * HOOK 1 - session-start. Emits the CONTEXT ANCHOR once per session so the
 * model starts from prior context rather than from a blank prompt. Reads are
 * budgeted: an approximate anchor now beats a perfect anchor late.
 */
export const sessionStart = async (
  ctx: ArsenalContext,
  input: SystemTransformInput,
  output: SystemTransformOutput,
): Promise<void> => {
  const sessionId = typeof input?.sessionID === "string" && input.sessionID.length > 0 ? input.sessionID : "anonymous"
  const anchor = await anchorFor(ctx, sessionId)
  if (output?.system && Array.isArray(output.system) && !output.system.includes(anchor.text)) {
    output.system.push(anchor.text)
  }
}

/* ===========================================================================
 * 20b. LD-01 Smart compact (0.9.1)
 * ===========================================================================
 *
 * Hook-level summary synthesis plus continuous pre-digestion. The digest is
 * shaped while the session runs (plan plus error traces plus tagged wrong
 * turns plus recoverable pointers), so at compact time the summary already
 * exists instead of being assembled after the fact.
 *
 * Fixed hook mechanism, honoured literally (V3 0.9.1 slot): the hook may
 * edit messages, push system content, and set the event result to document
 * the compact and skip the model call. It must NOT replace the attached
 * summarizer prompt and must NOT pick a separate compact model. Nothing
 * below selects a model or rewrites a prompt: `preCompact` only appends the
 * synthesized summary and the pointer index to the V1 `context` array, the
 * same write the existing handoff already performs.
 *
 * Survivors: the organized summary plus the newest ~15k tokens.
 * Triggers: auto near the limit with a 15% margin and a 16k-token minimum,
 * one-time restore after a provider overflow, and manual/UI.
 * Stable-byte prefix: the leading STABLE_PREFIX_BYTES survive byte-identical
 * so compacting never invalidates the cache it exists to protect.
 * Exit gates: T5 (wrong turns kept, tagged) and T6 (every dropped span
 * restores byte-exactly from its pointer, else the gate FAILs).
 * Baseline law: no smarter compact is accepted on rhetoric; `compareWithBaseline`
 * admits the smart compact only when measurement beats simple truncation.
 * Digestion cost is measured (`digestionCostOf`), never assumed.
 * Input-safety minimum, pulled forward from the supply-chain slot: vendor
 * plus fingerprint at accept, MCP data baselines at accept, and executable
 * or credential-bearing components held at `candidate` until security gates
 * prove them (`admitComponent`).
 *
 * Ancestor: the `strategic-compact` registry skill (manual compaction at
 * logical phase boundaries) is accepted polished as the trigger-side
 * ancestor; this section adds the measured synthesis it never had.
 */

/** Newest transcript kept past the summary, in tokens (~15k per V3). */
export const SMART_COMPACT_SURVIVOR_TOKENS = 15_000

/** Minimum window considered for auto compact, in tokens (16k per V3). */
export const SMART_COMPACT_MIN_TOKENS = 16_000

/** Auto trigger fires within this fraction of the limit (15% per V3). */
export const SMART_COMPACT_TRIGGER_MARGIN = 0.15

/** Leading bytes that survive compact byte-identical (cache protection). */
export const STABLE_PREFIX_BYTES = 1_024

/** Conservative chars-per-token for the estimator; gates measure real chars. */
const CHARS_PER_TOKEN = 4

/** Compact trigger: auto near-limit, one-time provider-overflow restore, manual/UI. */
export type CompactTrigger = "auto" | "provider-overflow" | "manual"

/** Provenance required at accept: vendor plus fingerprint, never one alone. */
export type DigestProvenance = {
  vendor: string
  fingerprint: string
}

/** MCP datum accepted only against a recorded baseline hash. */
export type McpBaseline = {
  source: string
  baselineHash: string
}

/** Accept/reject verdict for one digest note; rejections are counted, never silent. */
export type DigestAccept = {
  accepted: boolean
  reason: string
}

/** Executable or credential-bearing content stays a candidate until proven. */
export type HeldComponent = {
  kind: "executable" | "credential" | "other"
  locator: string
  status: "candidate" | "admitted"
}

/** What a dropped span leaves behind: path, link, or preview plus proof. */
export type RecoverablePointer = {
  kind: "path" | "link" | "preview"
  locator: string
  preview: string
  /** Length in UTF-16 code units; restore equality is `===` (exact). */
  byteLength: number
  checksum: string
}

/** One dropped span with the pointer that recovers it. */
export type DroppedSpan = {
  text: string
  pointer: RecoverablePointer
}

/** The pre-digested session shape: plan, error traces, tagged wrong turns. */
export type SmartDigest = {
  plan: string[]
  errorTraces: string[]
  wrongTurns: string[]
  pointers: RecoverablePointer[]
  mcpBaselines: McpBaseline[]
  /** Measured digestion cost, in accepted chars; never assumed. */
  costChars: number
  /** Notes refused at the trust boundary (missing provenance or baseline). */
  rejected: number
}

/** Provenance a component carries when security gates have proven it. */
export type SecurityProof = {
  gate: string
  proof: string
}

/** Narrow an untyped provenance claim to vendor plus fingerprint, or refuse it. */
const asProvenance = (value: unknown): DigestProvenance | null => {
  const record = asRecord(value)
  const vendor = record.vendor
  const fingerprint = record.fingerprint
  if (typeof vendor !== "string" || vendor.length === 0) return null
  if (typeof fingerprint !== "string" || fingerprint.length === 0) return null
  return { vendor, fingerprint }
}

/** Narrow an untyped MCP baseline claim, or refuse it. */
const asMcpBaseline = (value: unknown): McpBaseline | null => {
  const record = asRecord(value)
  const source = record.source
  const baselineHash = record.baselineHash
  if (typeof source !== "string" || source.length === 0) return null
  if (typeof baselineHash !== "string" || baselineHash.length === 0) return null
  return { source, baselineHash }
}

/** Narrow untyped text at the trust boundary; empty or non-text is refused. */
const asDigestText = (value: unknown): string | null => {
  if (typeof value !== "string") return null
  const text = value.trim()
  return text.length > 0 ? text : null
}

/** Fresh pre-digestion state: nothing recorded, nothing spent. */
export const newDigestState = (): SmartDigest => ({
  plan: [],
  errorTraces: [],
  wrongTurns: [],
  pointers: [],
  mcpBaselines: [],
  costChars: 0,
  rejected: 0,
})

const noteEntry = (
  digest: SmartDigest,
  list: "plan" | "errorTraces" | "wrongTurns",
  line: unknown,
  provenance: unknown,
): DigestAccept => {
  const text = asDigestText(line)
  if (text === null) {
    digest.rejected += 1
    return { accepted: false, reason: "empty or non-text note refused" }
  }
  const proven = asProvenance(provenance)
  if (proven === null) {
    digest.rejected += 1
    return { accepted: false, reason: "vendor plus fingerprint required at accept" }
  }
  digest[list].push(text)
  digest.costChars += text.length
  return { accepted: true, reason: `${proven.vendor}:${proven.fingerprint}` }
}

/** Record a plan line; refused without vendor plus fingerprint. */
export const notePlan = (digest: SmartDigest, line: unknown, provenance: unknown): DigestAccept =>
  noteEntry(digest, "plan", line, provenance)

/** Record a wrong turn; kept and tagged at synthesis (T5), never dropped. */
export const noteWrongTurn = (digest: SmartDigest, line: unknown, provenance: unknown): DigestAccept =>
  noteEntry(digest, "wrongTurns", line, provenance)

/** Record an MCP baseline at accept so later MCP data has something to match. */
export const noteMcpBaseline = (digest: SmartDigest, source: unknown, baselineHash: unknown): DigestAccept => {
  const baseline = asMcpBaseline({ source, baselineHash })
  if (baseline === null) {
    digest.rejected += 1
    return { accepted: false, reason: "MCP baseline needs source plus baselineHash" }
  }
  const known = digest.mcpBaselines.some(
    (entry) => entry.source === baseline.source && entry.baselineHash === baseline.baselineHash,
  )
  if (!known) digest.mcpBaselines.push(baseline)
  digest.costChars += baseline.source.length + baseline.baselineHash.length
  return { accepted: true, reason: `baseline ${baseline.source}` }
}

/**
 * Record an error trace; MCP-sourced traces must cite a baseline that is
 * either already recorded or carried by this same note.
 */
export const noteErrorTrace = (
  digest: SmartDigest,
  line: unknown,
  provenance: unknown,
  mcp?: unknown,
): DigestAccept => {
  if (mcp !== undefined) {
    const baseline = asMcpBaseline(mcp)
    if (baseline === null) {
      digest.rejected += 1
      return { accepted: false, reason: "MCP-sourced trace needs a full baseline" }
    }
    const known = digest.mcpBaselines.some(
      (entry) => entry.source === baseline.source && entry.baselineHash === baseline.baselineHash,
    )
    if (!known) digest.mcpBaselines.push(baseline)
    digest.costChars += baseline.source.length + baseline.baselineHash.length
  }
  return noteEntry(digest, "errorTraces", line, provenance)
}

/**
 * Admit a component: executable or credential-bearing kinds stay `candidate`
 * until a security gate proves them; anything else admits with its reason.
 * Unknown-shaped input is never admitted: it is held as a candidate `other`.
 */
export const admitComponent = (candidate: unknown, proof: unknown): HeldComponent => {
  const record = asRecord(candidate)
  const locator = typeof record.locator === "string" && record.locator.length > 0 ? record.locator : "unknown"
  const kind = record.kind === "executable" || record.kind === "credential" ? record.kind : "other"
  if (kind === "other") return { kind, locator, status: "admitted" }
  const gate = asRecord(proof)
  const proven =
    typeof gate.gate === "string" && gate.gate.length > 0 && typeof gate.proof === "string" && gate.proof.length > 0
  return { kind, locator, status: proven ? "admitted" : "candidate" }
}

/** Deterministic FNV-1a checksum, zero dependencies; second factor for restore. */
export const checksumText = (text: string): string => {
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}

/** Conservative token estimate; gates measure real chars, never this alone. */
export const estimateTokens = (text: string): number =>
  typeof text === "string" ? Math.max(1, Math.ceil(text.length / CHARS_PER_TOKEN)) : 0

/**
 * Trigger law: manual always compacts; provider-overflow compacts exactly
 * once (a restored overflow never re-fires); auto compacts near the limit
 * inside the margin, but never below the 16k-token minimum.
 */
export const shouldCompact = (args: {
  windowTokens: number
  limitTokens: number
  trigger: CompactTrigger
  overflowRestored: boolean
}): boolean => {
  if (args.trigger === "manual") return true
  if (args.trigger === "provider-overflow") return args.overflowRestored === false
  if (args.windowTokens < SMART_COMPACT_MIN_TOKENS) return false
  return args.windowTokens >= args.limitTokens * (1 - SMART_COMPACT_TRIGGER_MARGIN)
}

/**
 * Synthesize the organized summary: plan, error traces, wrong turns kept
 * with their WRONG-TURN tag (T5), recoverable pointers. Empty sections are
 * omitted, so a present section always means present content.
 */
export const synthesizeSummary = (digest: SmartDigest): string => {
  const sections: string[] = []
  if (digest.plan.length > 0) sections.push(`## Plan\n${digest.plan.map((line) => `- ${line}`).join("\n")}`)
  if (digest.errorTraces.length > 0) {
    sections.push(`## Error traces\n${digest.errorTraces.map((line) => `- ${line}`).join("\n")}`)
  }
  if (digest.wrongTurns.length > 0) {
    sections.push(
      `## Wrong turns (kept: do not repeat)\n${digest.wrongTurns.map((line) => `- WRONG-TURN: ${line}`).join("\n")}`,
    )
  }
  if (digest.pointers.length > 0) {
    sections.push(
      `## Recoverable pointers\n${digest.pointers
        .map((pointer) => `- [${pointer.kind}] ${pointer.locator} (${pointer.byteLength} chars, checksum ${pointer.checksum}): ${pointer.preview}`)
        .join("\n")}`,
    )
  }
  return sections.join("\n\n")
}

/** Measured digestion cost of one session: chars spent plus token estimate. */
export const digestionCostOf = (digest: SmartDigest): { chars: number; tokens: number } => ({
  chars: digest.costChars,
  tokens: estimateTokens("x".repeat(digest.costChars)),
})

const DROPPED_CHUNK_CHARS = 4_000
const POINTER_PREVIEW_CHARS = 120

const pointerFor = (index: number, text: string): RecoverablePointer => ({
  kind: "preview",
  locator: `dropped-span-${index}`,
  preview: text.slice(0, POINTER_PREVIEW_CHARS),
  byteLength: text.length,
  checksum: checksumText(text),
})

/**
 * Smart compact: survivors are the stable-byte prefix, the organized summary,
 * and the newest ~15k tokens. Every dropped span leaves a pointer; a compact
 * that drops content without a pointer fails the T6 gate downstream.
 */
export const selectSurvivors = (
  prefix: string,
  body: string,
  summary: string,
): { survivors: string; dropped: DroppedSpan[]; recoveredKinds: string[] } => {
  const stable = typeof prefix === "string" ? prefix.slice(0, STABLE_PREFIX_BYTES) : ""
  const summaryBlock = summary.length > 0 ? `\n## Smart summary (LD-01)\n${summary}\n` : "\n"
  const tailChars = SMART_COMPACT_SURVIVOR_TOKENS * CHARS_PER_TOKEN
  const tail = body.length > tailChars ? body.slice(body.length - tailChars) : body
  const droppedText = body.slice(0, body.length - tail.length)
  const dropped: DroppedSpan[] = []
  for (let offset = 0, index = 0; offset < droppedText.length; offset += DROPPED_CHUNK_CHARS, index++) {
    const chunk = droppedText.slice(offset, offset + DROPPED_CHUNK_CHARS)
    dropped.push({ text: chunk, pointer: pointerFor(index, chunk) })
  }
  const survivors = `${stable}${summaryBlock}${tail}`
  const recoveredKinds: string[] = []
  if (summary.includes("## Plan")) recoveredKinds.push("plan")
  if (summary.includes("## Error traces")) recoveredKinds.push("errors")
  if (summary.includes("WRONG-TURN")) recoveredKinds.push("wrong-turns")
  if (summary.includes("## Recoverable pointers")) recoveredKinds.push("pointers")
  return { survivors, dropped, recoveredKinds }
}

/**
 * Simple baseline: newest-only truncation under the same survivor budget, no
 * summary. Recovers no structural kind by construction; the law below admits
 * the smart compact only when measurement beats exactly this.
 */
export const simpleBaseline = (
  prefix: string,
  body: string,
): { survivors: string; recoveredKinds: string[] } => {
  const stable = typeof prefix === "string" ? prefix.slice(0, STABLE_PREFIX_BYTES) : ""
  const tailChars = SMART_COMPACT_SURVIVOR_TOKENS * CHARS_PER_TOKEN
  const tail = body.length > tailChars ? body.slice(body.length - tailChars) : body
  return { survivors: `${stable}${tail}`, recoveredKinds: [] }
}

/**
 * Baseline law: the smart compact wins only when it recovers strictly more
 * structural kinds per token than truncation. A summary that recovers
 * nothing ties or loses; rhetoric never passes this function.
 */
export const compareWithBaseline = (
  smart: { tokens: number; recovered: string[] },
  baseline: { tokens: number; recovered: string[] },
): {
  smartWins: boolean
  smartTokens: number
  baselineTokens: number
  smartRecovered: string[]
  baselineRecovered: string[]
  smartDensity: number
  baselineDensity: number
} => {
  const smartDensity = smart.tokens > 0 ? smart.recovered.length / smart.tokens : 0
  const baselineDensity = baseline.tokens > 0 ? baseline.recovered.length / baseline.tokens : 0
  const strictlyMore = smart.recovered.length > baseline.recovered.length
  return {
    smartWins: strictlyMore && smartDensity > baselineDensity,
    smartTokens: smart.tokens,
    baselineTokens: baseline.tokens,
    smartRecovered: smart.recovered,
    baselineRecovered: baseline.recovered,
    smartDensity,
    baselineDensity,
  }
}

/**
 * Restore dropped spans from a locator-to-content store. Missing content is
 * reported, never invented; tampered content fails its checksum. Equality is
 * exact string identity, the byte-exact bar the T6 gate demands.
 */
export const restoreFromPointers = (
  pointers: readonly RecoverablePointer[],
  store: ReadonlyMap<string, string>,
): { locator: string; restored: string | null; checksumOk: boolean; byteLengthOk: boolean }[] =>
  pointers.map((pointer) => {
    const restored = store.get(pointer.locator) ?? null
    if (restored === null) return { locator: pointer.locator, restored, checksumOk: false, byteLengthOk: false }
    return {
      locator: pointer.locator,
      restored,
      checksumOk: checksumText(restored) === pointer.checksum,
      byteLengthOk: restored.length === pointer.byteLength,
    }
  })

/** Provenance the kit itself uses when it digests its own guard outcomes. */
const KIT_PROVENANCE: DigestProvenance = { vendor: "vantrilex-arsenal", fingerprint: "session" }

/**
 * HOOK 2 - pre-compact. The transcript is not assumed to survive compaction,
 * so the working state is written to the state directory first and only then
 * contributed to the continuation prompt.
 */
export const preCompact = async (
  ctx: ArsenalContext,
  input: CompactingInput,
  output: CompactingOutput,
): Promise<void> => {
  const sessionId = typeof input?.sessionID === "string" && input.sessionID.length > 0 ? input.sessionID : "anonymous"
  const state = sessionState(ctx, sessionId)
  const anchor = await anchorFor(ctx, sessionId)
  const stateDir = resolveStateDir(ctx.rt, ctx.root)
  const join = ctx.rt.path?.join ?? EMPTY_PATH.join

  const touched = Array.from(state.touchedFiles).sort()
  // LD-01 continuous pre-digestion, folded at compact time from already
  // tracked state: the last intent feeds the plan, failing guard outcomes
  // feed the error traces. No new hook surface, no new tracking.
  if (state.digest.plan.length === 0 && state.lastIntent.length > 0) {
    notePlan(state.digest, state.lastIntent, KIT_PROVENANCE)
  }
  for (const outcome of state.guardOutcomes) {
    if (/FAIL|BLOCKED|error/i.test(outcome)) noteErrorTrace(state.digest, outcome, KIT_PROVENANCE)
  }
  const smartSummary = synthesizeSummary(state.digest)
  const handoff = [
    anchor.text,
    "",
    "HANDOFF SNAPSHOT",
    `Session: ${sessionId}`,
    `Working set: ${touched.length === 0 ? "unknown" : touched.join(", ")}`,
    `Guard outcomes: ${state.guardOutcomes.length === 0 ? "none recorded" : state.guardOutcomes.join(" | ")}`,
    `Last user intent: ${state.lastIntent.length > 0 ? state.lastIntent : "unknown"}`,
    `Circuit: ${state.circuit.failures} consecutive guard failure(s) this session`,
    "",
    "SMART SUMMARY (LD-01)",
    smartSummary.length > 0 ? smartSummary : "(no digested content this session)",
    `Digestion cost: ${digestionCostOf(state.digest).chars} chars`,
  ].join("\n")

  const written = writeTextFile(ctx.rt, join(stateDir, "handoff", sanitizeSessionId(sessionId) + ".md"), handoff + "\n")
  if (written.status === "ok") {
    log(ctx, "info", `pre-compact: handoff written to ${toPosix(written.value)}`)
  } else {
    log(ctx, "warn", `pre-compact: ${written.reason}`)
  }

  if (output?.context && Array.isArray(output.context)) {
    output.context.push(handoff)
  }
}

/**
 * HOOK 3 - session-end. Persists learnings so the next session's first step has
 * something to load, closing the loop with hook 1.
 */
export const sessionEnd = async (
  ctx: ArsenalContext,
  eventType: string,
  properties: unknown,
): Promise<void> => {
  const props =
    properties && typeof properties === "object" ? (properties as Record<string, unknown>) : {}
  const candidate = typeof props.sessionID === "string" ? props.sessionID : typeof props.id === "string" ? props.id : "anonymous"
  const state = sessionState(ctx, candidate)
  const join = ctx.rt.path?.join ?? EMPTY_PATH.join
  const stateDir = resolveStateDir(ctx.rt, ctx.root)
  const anchor = ctx.anchors.get(candidate)

  const touched = Array.from(state.touchedFiles).sort()
  const durationMs = Date.now() - state.openedAt
  const markdown = [
    "# Session Learnings",
    "",
    `- Session: ${candidate}`,
    `- Ended: ${new Date().toISOString()}`,
    `- Reason: ${eventType}`,
    `- Duration: ${Math.round(durationMs / 1000)}s`,
    `- Branch: ${anchor ? fieldValue(anchor, "Branch") : "unknown"}`,
    `- Phase: ${anchor ? fieldValue(anchor, "Phase") : "unknown"}`,
    `- Mission: ${anchor ? fieldValue(anchor, "Mission") : "unknown"}`,
    `- Next: ${anchor ? fieldValue(anchor, "Next") : "unknown"}`,
    "",
    "## Working set",
    touched.length === 0 ? "No file writes were observed in this session." : touched.map((entry) => `- ${entry}`).join("\n"),
    "",
    "## Last user intent",
    state.lastIntent.length > 0 ? state.lastIntent : "Not captured.",
    "",
    "## Guard outcomes",
    state.guardOutcomes.length === 0 ? "No guard produced a verdict in this session." : state.guardOutcomes.map((entry) => `- ${entry}`).join("\n"),
    "",
    "## Circuit",
    state.circuit.failures === 0
      ? "Closed. No consecutive guard failure was recorded."
      : `Open. ${state.circuit.failures} consecutive guard failure(s).`,
    "",
  ].join("\n")

  const latest = writeTextFile(ctx.rt, join(stateDir, "latest-session.md"), markdown)
  const archived = writeTextFile(ctx.rt, join(stateDir, "sessions", sanitizeSessionId(candidate) + ".md"), markdown)
  if (latest.status === "ok") log(ctx, "info", `session-end: learnings persisted for ${candidate}`)
  else log(ctx, "warn", `session-end: ${latest.reason}`)
  if (archived.status !== "ok") log(ctx, "warn", `session-end: ${archived.reason}`)

  // The transcript's anchor is stale once the session ends.
  ctx.anchors.delete(candidate)
}

const fieldValue = (anchor: ContextAnchor, label: string): string =>
  anchor.fields.find((field) => field.label === label)?.value ?? "unknown"

/**
 * HOOK 4 - long-running process guard. A dev server or watcher started in the
 * foreground takes the shell hostage and its output becomes unreachable.
 * Requires a log file, and records the path so the operator can follow it.
 */
export const longRunningProcessGuard = async (
  ctx: ArsenalContext,
  input: ToolExecuteBeforeInput,
  output: ToolExecuteBeforeOutput,
): Promise<void> => {
  if (input?.tool !== "bash") return
  const args = asRecord(output?.args)
  const command = typeof args.command === "string" ? args.command : ""
  if (command.trim().length === 0) return

  const segments = offendingSegments(command)
  if (segments.length === 0) return

  const logTarget = detectLogTarget(command)
  if (logTarget) {
    ctx.lastLogTarget = logTarget
    log(ctx, "info", `long-running-process-guard: log target accepted — ${logTarget}`)
    return
  }

  const state = sessionState(ctx, input.sessionID)
  state.circuit.failures += 1
  state.guardOutcomes.push(formatGuardLine("long-running-process-guard", "BLOCKED", segments.join(" ; ")))
  ctx.pendingWarnings.push(formatGuardLine("long-running-process-guard", "BLOCKED", "no log redirection"))
  throw new Error(guardBlockMessage(segments))
}

/**
 * HOOK 7 - docs discipline guard. A Markdown file written outside the canonical
 * numbered documentation set is a violation, not a convenience.
 */
export const docsDisciplineGuard = async (
  ctx: ArsenalContext,
  input: ToolExecuteBeforeInput,
  output: ToolExecuteBeforeOutput,
): Promise<void> => {
  const guard = ctx.config.docsGuard
  if (guard.enabled === false || guard.mode === "off") return
  // The bash tool carries shell text rather than a filePath argument, so its
  // markdown write targets are recovered from redirections and tee operands
  // (F1) instead of being skipped by the edit-tool check below.
  if (!WRITE_TOOLS.has(input?.tool) && input?.tool !== "bash") return

  const rawCandidates =
    input?.tool === "bash"
      ? bashMarkdownTargets(ctx.root, asRecord(output?.args).command)
      : candidatePathsFrom(ctx.root, output?.args)
  const markdownCandidates = rawCandidates.filter((entry) => isMarkdownPath(ctx.rt, entry))
  if (markdownCandidates.length === 0) return

  // Each path is paired with its own verdict before filtering (F3): filtering
  // the verdicts first and re-indexing into the unfiltered candidate array
  // names the wrong file on multi-file calls.
  const violations = markdownCandidates
    .map((entry) => ({ path: entry, verdict: docsGuardVerdict(ctx, entry) }))
    .filter((entry) => !entry.verdict.allowed)
    .map((entry) => ({ path: entry.path, reason: entry.verdict.reason }))

  if (violations.length === 0) return

  const state = sessionState(ctx, input.sessionID)
  const line = formatGuardLine("docs-discipline-guard", guard.mode === "warn" ? "WARN" : "BLOCKED", violations.map((entry) => entry.path).join(", "))
  state.guardOutcomes.push(line)
  log(ctx, guard.mode === "warn" ? "warn" : "error", `${line} — allowed set: ${describeAllowedSet(ctx)}`)

  if (guard.mode === "warn") {
    ctx.pendingWarnings.push(`${line} — allowed set: ${describeAllowedSet(ctx)}`)
    return
  }

  state.circuit.failures += 1
  ctx.pendingWarnings.push(line)
  throw new Error(guardDocsMessage(violations, describeAllowedSet(ctx)))
}

/**
 * HOOK 5 - typescript-check (conditional). Runs the project's own type check
 * after a TypeScript file is written. Reports SKIPPED, never PASS, when the
 * project has no TypeScript.
 */
export const typescriptCheck = async (
  ctx: ArsenalContext,
  input: ToolExecuteAfterInput,
  output: ToolExecuteAfterOutput,
): Promise<void> => {
  const join = ctx.rt.path?.join ?? EMPTY_PATH.join
  const extensionOfFile = (target: string): string => extensionOf(ctx.rt, target)
  const touched = candidatePathsFrom(ctx.root, input?.args).filter((entry) => {
    const ext = extensionOfFile(entry)
    return ext === ".ts" || ext === ".tsx" || ext === ".mts" || ext === ".cts"
  })
  if (touched.length === 0) return

  recordTouchedFiles(ctx, input.sessionID, touched)

  const tsconfig = nearestTsconfig(ctx.rt, ctx.root, join(ctx.root, touched[0] ?? ""))
  if (!tsconfig) {
    appendGuardLine(output, formatGuardLine("typescript-check", "SKIPPED", "no tsconfig.json in this project"))
    return
  }
  const tsc = resolveTool(ctx.rt, ctx.root, "tsc")
  if (!tsc) {
    appendGuardLine(output, formatGuardLine("typescript-check", "SKIPPED", "typescript is not installed locally"))
    return
  }

  const paths = Array.from(new Set(touched)).slice(0, 50)
  enqueueTypeCheck(ctx, async () => {
    const result = await runCommand(
      ctx.rt,
      tsc.command,
      [...tsc.prefixArgs, "--noEmit", "--pretty", "false", "-p", tsconfig],
      { cwd: ctx.root, timeoutMs: TSC_TIMEOUT_MS },
    )
    const state = sessionState(ctx, input.sessionID)
    if (result.spawnFailed) {
      const line = formatGuardLine("typescript-check", "SKIPPED", "the type checker could not be executed")
      appendGuardLine(output, line)
      state.guardOutcomes.push(line)
      return
    }
    if (result.timedOut) {
      const line = formatGuardLine("typescript-check", "FAIL", `timed out after ${TSC_TIMEOUT_MS}ms`)
      appendGuardLine(output, line)
      state.guardOutcomes.push(line)
      state.circuit.failures += 1
      return
    }
    if (result.code === 0) {
      const line = formatGuardLine("typescript-check", "PASS", `${paths.length} TypeScript file(s) checked against ${toPosix(tsconfig)}`)
      appendGuardLine(output, line)
      state.guardOutcomes.push(line)
      return
    }
    const diagnostics = diagnosticsFrom(result)
    const line = formatGuardLine("typescript-check", "FAIL", `exit ${result.code}`)
    appendGuardLine(output, [line, diagnostics].filter((entry) => entry.length > 0).join("\n"))
    state.guardOutcomes.push(line)
    state.circuit.failures += 1
  })
}

/**
 * HOOK 6 - prettier-format (conditional). Formats with the project's own
 * formatter after a JavaScript or TypeScript file is written. Reports SKIPPED,
 * never PASS, when the project has no Prettier.
 */
export const prettierFormat = async (
  ctx: ArsenalContext,
  input: ToolExecuteAfterInput,
  output: ToolExecuteAfterOutput,
): Promise<void> => {
  const touched = candidatePathsFrom(ctx.root, input?.args).filter((entry) => {
    const ext = extensionOf(ctx.rt, entry)
    return ext === ".js" || ext === ".ts" || ext === ".tsx" || ext === ".mjs" || ext === ".cjs" || ext === ".mts" || ext === ".cts"
  })
  if (touched.length === 0) return

  recordTouchedFiles(ctx, input.sessionID, touched)

  if (!hasPrettier(ctx)) {
    appendGuardLine(output, formatGuardLine("prettier-format", "SKIPPED", "no prettier configuration or dependency in this project"))
    return
  }
  const prettier = resolveTool(ctx.rt, ctx.root, "prettier")
  if (!prettier) {
    appendGuardLine(output, formatGuardLine("prettier-format", "SKIPPED", "prettier is not installed locally"))
    return
  }

  const join = ctx.rt.path?.join ?? EMPTY_PATH.join
  const paths = Array.from(new Set(touched))
    .filter((entry) => !entry.includes("node_modules/"))
    .slice(0, 50)
    .map((entry) => join(ctx.root, entry))
  if (paths.length === 0) return

  const result = await runCommand(
    ctx.rt,
    prettier.command,
    [...prettier.prefixArgs, "--write", "--ignore-unknown", "--log-level", "warn", ...paths],
    { cwd: ctx.root, timeoutMs: PRETTIER_TIMEOUT_MS },
  )
  const state = sessionState(ctx, input.sessionID)
  if (result.spawnFailed) {
    const line = formatGuardLine("prettier-format", "SKIPPED", "the formatter could not be executed")
    appendGuardLine(output, line)
    state.guardOutcomes.push(line)
    return
  }
  if (result.timedOut) {
    const line = formatGuardLine("prettier-format", "FAIL", `timed out after ${PRETTIER_TIMEOUT_MS}ms`)
    appendGuardLine(output, line)
    state.guardOutcomes.push(line)
    state.circuit.failures += 1
    return
  }
  if (result.code !== 0) {
    const line = formatGuardLine("prettier-format", "FAIL", `exit ${result.code}`)
    appendGuardLine(output, [line, diagnosticsFrom(result)].filter((entry) => entry.length > 0).join("\n"))
    state.guardOutcomes.push(line)
    state.circuit.failures += 1
    return
  }
  const line = formatGuardLine("prettier-format", "PASS", `${paths.length} file(s) formatted`)
  appendGuardLine(output, line)
  state.guardOutcomes.push(line)
}

/**
 * HOOK 8 in this file's original V1 enumeration, which is not the catalog-hook
 * count: the seventh hook in the hook enumeration is `docsDisciplineGuard`
 * (HOOK 7 below), and it carries no catalog row, so the census every document
 * quotes is seven catalog hooks. The dispatcher is the eighth enumerated
 * callback and
 * one of the five guards that run on V2 (dispatcher, docs-discipline,
 * long-running, typescript-check, prettier-format); the three
 * session-lifecycle hooks remain V1-only by design (see the module header).
 *
 * The one decision every surface applies: hand back
 * the instruction to append to a turn, or null when the kill switch disarms it.
 *
 * Both runtime surfaces call this function, so V1 and V2 can never disagree
 * about whether the dispatcher is armed or about which five lines they send.
 * What differs between the surfaces is only how the returned string reaches the
 * model, and each adapter owns that.
 *
 * ONCE PER TASK IS THE EVENT, NOT A GUARD. Under V1, `chat.message` fired when a
 * user message was admitted and the runtime re-read `output.parts` afterwards.
 * Under V2 the `prompt` hook fires "once during admission, not before every
 * model call". Neither surface can be re-triggered from inside a task: a phase
 * transition is an assistant reply plus tool calls, which V2 reports as
 * `context` hooks and event-stream traffic, never as prompt admission. The
 * event granularity and the task boundary are the same boundary.
 *
 * One difference between the surfaces is deliberate, and is recorded here
 * rather than left for a reader to discover:
 *
 *   1. Placement. V1 has a parts array, but the host validates stored part
 *      identity before save, so pushing a synthetic `{ type: "text" }` part
 *      aborts the run (observed 2026-10-11 on host 1.18.34: "invalid user
 *      part before save", Missing key id/sessionID/messageID). The V1
 *      adapter therefore appends the instruction to the last existing user
 *      text part, which already carries valid identity. V2's hook event has
 *      no parts array, so the instruction is appended to `event.prompt.text`,
 *      and the V2 guide states that edits "become the canonical persisted
 *      user input". Under V2 the instruction therefore persists inside the
 *      user's own message. Ordering is unchanged on both surfaces - still
 *      after the user's own text, still ahead of the model's work.
 *   2. Appended, never prepended. V2 requires that "attachment `mention`
 *      offsets" be updated or removed when text is rewritten. Appending after
 *      the existing text shifts no offset, so the rewrite is offset-safe by
 *      construction; prepending would force every mention offset to be
 *      renumbered or dropped, which would silently break `@file` references.
 *
 * No per-session "already dispatched" flag is kept, deliberately. Every user
 * message may be a new task, a continuation, or a modification, so the
 * classification has to be present on each of them; a once-per-session latch
 * would suppress the instruction on exactly the messages that need it. The one
 * guard that is kept is idempotence within a single turn, because either
 * runtime may re-present the same draft.
 */
export const taskDispatcher = (ctx: ArsenalContext): string | null =>
  ctx.config.taskDispatcher.enabled === true ? TASK_DISPATCH_INSTRUCTION : null

/**
 * V2 idempotence check. The draft is a single string, so containment is the
 * exact analogue of the V1 part-equality test: after one append the
 * instruction is present verbatim, and a second pass finds it.
 */
const hasDispatchInstruction = (text: string): boolean => text.includes(TASK_DISPATCH_INSTRUCTION)

/* ===========================================================================
 * 20b. Seat deny overlay (permission "evaluate")
 * =========================================================================
 *
 * RUN-0.9.0-FIX cause (a), proven in `.opencode/audit/RUN-090-FIX/deny-cause.md`:
 * every shipped seat declares its rules under `permissions:` (plural) as a
 * list, and the host evaluates only the singular `permission:` map. Because
 * each declaring file also carries `name:`/`temperature:`, the block is demoted
 * to an agent "additional" option and forwarded to the provider instead of the
 * permission engine. Rewriting the 26 seat files is outside this lane's fixed
 * scope, so the overlay reads the shipped plural shape itself and applies it at
 * the one mutable surface: `permission.hook("evaluate")`.
 *
 * The overlay is deny-only. It never grants and never relaxes:
 *
 *   - it runs only for `allow` and `ask`, because an explicit configured deny
 *     is final and does not invoke the hook;
 *   - it flips `effect` to `deny` only when the seat's last matching rule is a
 *     deny, when the seat's block is malformed (fail-closed), or when a known
 *     seat file exists but cannot be read (fail-closed);
 *   - a seat with no block, an unknown agent, or no matching rule leaves the
 *     host's effect untouched, so the overlay can never widen a lane.
 * ========================================================================= */

const SEAT_AGENTS_DIR = ".opencode/agents"
const MAX_SEAT_MARKDOWN_BYTES = 256 * 1024
/**
 * A seat id is a plain file stem. Anything with a separator, a dot or an
 * escape sequence is not a seat this overlay will read; it degrades to
 * "no rule" rather than inventing a path outside `.opencode/agents`.
 */
const SEAT_AGENT_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/
const SEAT_RULE_KEYS: ReadonlySet<string> = new Set(["action", "resource", "effect"])
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
const PERMISSION_KEY_LINE = /^permissions:\s*(.*)$/
const PERMISSION_ITEM_LINE = /^\s*-\s+([A-Za-z][A-Za-z0-9_]*):\s*(.*?)\s*$/
const PERMISSION_FIELD_LINE = /^\s+([A-Za-z][A-Za-z0-9_]*):\s*(.*?)\s*$/

/** One declared seat rule, in frontmatter order. */
export type SeatPermissionRule = {
  readonly action: string
  readonly resource: string
  readonly effect: "allow" | "ask" | "deny"
}

/**
 * A parsed seat block. `absent` and `malformed` are deliberately distinct:
 * a seat that declares nothing keeps the host's policy, while a seat that
 * declares something unreadable fails closed.
 */
export type SeatPermissionParse =
  | { readonly status: "absent" }
  | { readonly status: "parsed"; readonly rules: readonly SeatPermissionRule[] }
  | { readonly status: "malformed"; readonly reason: string }

/** One evaluation's outcome. `none` means "leave the host's effect alone". */
export type SeatPermissionDecision =
  | { readonly status: "none"; readonly reason: string }
  | { readonly status: "matched"; readonly effect: "allow" | "ask" | "deny"; readonly rule: SeatPermissionRule }
  | { readonly status: "malformed"; readonly reason: string }

const seatEffectOf = (value: string | undefined): "allow" | "ask" | "deny" | null =>
  value === "allow" || value === "ask" || value === "deny" ? value : null

/** A YAML scalar in this block: quoted, bare, or bare with a trailing comment. */
const seatValueOf = (raw: string): string => {
  const trimmed = raw.trim()
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  const comment = trimmed.search(/\s#/)
  return (comment >= 0 ? trimmed.slice(0, comment) : trimmed).trim()
}

type SeatRuleDraft = { readonly values: Record<string, string>; readonly line: number }

const addSeatRuleField = (draft: SeatRuleDraft, key: string, raw: string): string | null => {
  if (!SEAT_RULE_KEYS.has(key)) {
    return `unknown permissions key "${key}" at frontmatter line ${draft.line}`
  }
  if (draft.values[key] !== undefined) {
    return `duplicate permissions key "${key}" at frontmatter line ${draft.line}`
  }
  draft.values[key] = seatValueOf(raw)
  return null
}

/**
 * Parse the shipped `permissions:` list out of a seat's YAML frontmatter.
 *
 * Only the frontmatter is read, so prose further down the file can never be
 * mistaken for a rule. The block ends at the first unindented line, the first
 * malformed entry is a `malformed` verdict, and a `permission:` (singular)
 * block is `absent` by design: that shape is evaluated natively by the host,
 * and overlaying it would apply the same rules twice.
 */
export const parseSeatPermissions = (markdown: unknown): SeatPermissionParse => {
  if (typeof markdown !== "string" || markdown.length === 0) return { status: "absent" }
  const frontmatter = FRONTMATTER.exec(markdown)
  if (frontmatter === null) return { status: "absent" }
  const lines = frontmatter[1].split(/\r?\n/)
  const keyline = lines.findIndex((line) => PERMISSION_KEY_LINE.test(line))
  if (keyline < 0) return { status: "absent" }
  const keyMatch = PERMISSION_KEY_LINE.exec(lines[keyline])
  const inline = keyMatch === null ? "" : keyMatch[1].trim()
  if (inline.length > 0 && !inline.startsWith("#")) {
    return { status: "malformed", reason: `permissions is an inline value ("${clip(inline, 48)}"), not a rule list` }
  }

  const drafts: SeatRuleDraft[] = []
  let draft: SeatRuleDraft | null = null
  for (let index = keyline + 1; index < lines.length; index += 1) {
    const line = lines[index]
    if (line.trim().length === 0 || line.trimStart().startsWith("#")) continue
    // An unindented line starts the next top-level key: the block is over.
    if (!/^\s/.test(line)) break
    const item = PERMISSION_ITEM_LINE.exec(line)
    if (item !== null) {
      draft = { values: {}, line: index + 1 }
      drafts.push(draft)
      const problem = addSeatRuleField(draft, item[1], item[2])
      if (problem !== null) return { status: "malformed", reason: problem }
      continue
    }
    const field = PERMISSION_FIELD_LINE.exec(line)
    if (field === null || draft === null) {
      return { status: "malformed", reason: `unreadable permissions entry at frontmatter line ${index + 1}` }
    }
    const problem = addSeatRuleField(draft, field[1], field[2])
    if (problem !== null) return { status: "malformed", reason: problem }
  }

  if (drafts.length === 0) return { status: "malformed", reason: "permissions block declares no rules" }
  const rules: SeatPermissionRule[] = []
  for (const entry of drafts) {
    const action = entry.values.action
    const resource = entry.values.resource
    const effect = seatEffectOf(entry.values.effect)
    if (action === undefined || action.length === 0 || resource === undefined || resource.length === 0) {
      return { status: "malformed", reason: `rule at frontmatter line ${entry.line} is missing action or resource` }
    }
    if (effect === null) {
      return {
        status: "malformed",
        reason: `rule at frontmatter line ${entry.line} has effect "${entry.values.effect ?? ""}"`,
      }
    }
    rules.push({ action, resource, effect })
  }
  return { status: "parsed", rules }
}

/** `*` matches any run of characters; every other character is literal. */
const seatGlobMatches = (pattern: string, value: string): boolean => {
  if (pattern === "*") return true
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`^${escaped.split("\\*").join(".*")}$`).test(value)
}

/**
 * One rule against one resource.
 *
 * `action: "_"` is the shipped namespace form (`resource: context7_*`): it
 * matches any action and its resource pattern is matched against the action
 * name, which is how the host lowers the native `<ns>_*` key.
 */
const seatRuleMatches = (rule: SeatPermissionRule, action: string, resource: string): boolean => {
  if (rule.action === "_") return seatGlobMatches(rule.resource, action)
  return seatGlobMatches(rule.action, action) && seatGlobMatches(rule.resource, resource)
}

/**
 * Resolve one evaluation against a seat's frontmatter: last matching rule
 * wins per resource, and a deny on any resource denies the call.
 */
export const resolveSeatPermission = (
  markdown: unknown,
  action: unknown,
  resources: readonly unknown[] | undefined,
): SeatPermissionDecision => {
  const parsed = parseSeatPermissions(markdown)
  if (parsed.status === "absent") return { status: "none", reason: "seat declares no permissions block" }
  if (parsed.status === "malformed") return { status: "malformed", reason: parsed.reason }
  const actionName = typeof action === "string" ? action.trim() : ""
  if (actionName.length === 0) return { status: "none", reason: "evaluation carries no action" }
  const targets = Array.isArray(resources)
    ? resources.filter((entry): entry is string => typeof entry === "string" && entry.length > 0)
    : []
  let fallback: SeatPermissionRule | null = null
  for (const resource of targets) {
    let last: SeatPermissionRule | null = null
    for (const rule of parsed.rules) if (seatRuleMatches(rule, actionName, resource)) last = rule
    if (last === null) continue
    if (last.effect === "deny") return { status: "matched", effect: "deny", rule: last }
    fallback = last
  }
  return fallback === null
    ? { status: "none", reason: `no rule matches ${actionName}` }
    : { status: "matched", effect: fallback.effect, rule: fallback }
}

/** How a seat file is read for one evaluation. */
type SeatSource =
  | { readonly status: "ok"; readonly markdown: string }
  | { readonly status: "absent" }
  | { readonly status: "unreadable"; readonly reason: string }

const readSeatSource = (ctx: ArsenalContext, agent: string): SeatSource => {
  const join = ctx.rt.path?.join ?? EMPTY_PATH.join
  const target = join(ctx.root, SEAT_AGENTS_DIR, `${agent}.md`)
  const attempt = readTextFile(ctx.rt, target, MAX_SEAT_MARKDOWN_BYTES)
  if (attempt.status === "ok") return { status: "ok", markdown: attempt.value }
  let present = false
  try {
    present = ctx.rt.fs ? ctx.rt.fs.existsSync(target) : false
  } catch {
    // An unreadable directory cannot prove the seat is unknown: fail closed.
    present = true
  }
  return present ? { status: "unreadable", reason: attempt.reason } : { status: "absent" }
}

/** A plain seat id, or null. Anything else is not a file this overlay reads. */
const seatAgentName = (value: unknown): string | null => {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 && SEAT_AGENT_PATTERN.test(trimmed) ? trimmed : null
}

const rememberSessionAgent = (ctx: ArsenalContext, sessionID: string, agent: string | null): void => {
  if (agent === null || sessionID.length === 0) return
  sessionState(ctx, sessionID).agent = agent
}

/**
 * The session-agent fallback: the evaluation event's `agent` is optional.
 * Strict order — the host reader (`ctx.session.get`) first, the observed-event
 * cache second — and null when neither names an agent, which leaves the host's
 * effect unchanged rather than guessing whose rules apply.
 */
export type SessionAgentReader = (sessionID: string) => Promise<string | null> | string | null

const sessionAgentOf = async (
  ctx: ArsenalContext,
  sessionID: string,
  reader: SessionAgentReader | undefined,
): Promise<string | null> => {
  if (reader !== undefined) {
    try {
      const fromHost = seatAgentName(await reader(sessionID))
      if (fromHost !== null) return fromHost
    } catch {
      // A reader that throws degrades to the cache, never to a guess.
    }
  }
  return seatAgentName(ctx.sessions.get(sessionID)?.agent)
}

const denyEvaluation = (event: PermissionEvaluation, reason: string): void => {
  event.effect = "deny"
  event.message = `[arsenal] seat-deny: ${reason}`
}

/**
 * The `permission.hook("evaluate")` callback.
 *
 * Hardening only: an `allow` or an `ask` whose seat rule says deny becomes a
 * deny with a reason. Any other effective decision is left exactly as the host
 * produced it, which is what keeps a no-rule or unknown-agent call unchanged.
 */
export const seatDenyOverlay = async (
  ctx: ArsenalContext,
  event: PermissionEvaluation,
  readSessionAgent?: SessionAgentReader,
): Promise<void> => {
  if (killSwitchReason(ctx) !== null) return
  if (event === null || typeof event !== "object") return
  // An explicit configured deny is final and never reaches the hook; leaving
  // it untouched guarantees this overlay can never resurrect a denied call.
  if (event.effect !== "allow" && event.effect !== "ask") return
  const action = typeof event.action === "string" ? event.action.trim() : ""
  if (action.length === 0) return
  const sessionID =
    typeof event.sessionID === "string" && event.sessionID.length > 0 ? event.sessionID : "anonymous"
  const noticed = seatAgentName(event.agent)
  if (noticed !== null) rememberSessionAgent(ctx, sessionID, noticed)
  const agent = noticed ?? (await sessionAgentOf(ctx, sessionID, readSessionAgent))
  if (agent === null) return

  const seat = readSeatSource(ctx, agent)
  if (seat.status === "absent") return
  if (seat.status === "unreadable") {
    denyEvaluation(event, `${agent}: seat file unreadable (${seat.reason}); failing closed`)
    return
  }
  const decision = resolveSeatPermission(seat.markdown, action, event.resources)
  if (decision.status === "malformed") {
    denyEvaluation(event, `${agent}: malformed permissions block (${decision.reason}); failing closed`)
    return
  }
  if (decision.status === "matched" && decision.effect === "deny") {
    const targets = Array.isArray(event.resources) ? event.resources.join(", ") : ""
    denyEvaluation(
      event,
      `${agent}: deny ${action} ${targets.length > 0 ? targets : "*"} (${decision.rule.action} ${decision.rule.resource})`,
    )
  }
}

/* ===========================================================================
 * 21. Plan-guard detective append (ق-6 merge)
 * ===========================================================================
 *
 * Merged from the retired `.opencode/plugins/vantrilex-guards.ts` carrier so
 * exactly one plugin file loads. Binding: P1-R0.md verdict (1) rules the hard
 * admission gate IMPOSSIBLE on the current host, so nothing here claims to
 * refuse a brief. The functions below compare the dispatch brief against the
 * plan excerpt attached to the same prompt and append a dated plan-drift
 * report when brief identifiers have no match in the plan. Findings are
 * observations for the leader, never verdicts, and the turn always proceeds.
 *
 * Prompt convention (attached by leader-discipline, read by `splitBriefAndPlan`):
 *
 *   Plan-Doc-Begin: <plan label, e.g. MISSION-PLAN.md>
 *   <actual plan doc lines, 1-based for citations>
 *   Plan-Doc-End
 *   <dispatch brief lines>
 *
 * A prompt without both markers is left untouched. A prompt that already
 * carries a report is left untouched, so the append stays idempotent within a
 * turn. An empty brief, an empty plan excerpt, and a brief whose tokens all
 * match are likewise left untouched.
 * ========================================================================= */

/** Tag heading every emitted report; also the idempotency marker. */
export const PLAN_DRIFT_TAG = "[plan-guard] plan-drift report"

/** Opening plan-attachment marker; the label follows the colon. */
export const PLAN_DOC_BEGIN = "Plan-Doc-Begin:"

/** Closing plan-attachment marker; the line must carry nothing else. */
export const PLAN_DOC_END = "Plan-Doc-End"

/**
 * The honestly-documented fallback: states the missing typed-rejection
 * surface and that enforcement is leader-discipline plus Verifier gates.
 */
export const PLAN_GUARD_FALLBACK =
  "Plan-guard fallback (detective-only, non-blocking): per P1-R0.md verdict (1) " +
  "the session prompt hook exposes no typed rejection API for prompt admission, " +
  "so this extension only observes the brief against the attached plan excerpt " +
  "and appends a dated plan-drift report; the turn always proceeds. Enforcement " +
  "stays with leader-discipline plus the Verifier gates, not with this hook."

/** A plan excerpt with its real label, so citations point at file:line. */
export type PlanDoc = {
  readonly label: string
  readonly lines: readonly string[]
}

/** One brief identifier with no match anywhere in the attached plan. */
export type PlanDriftFinding = {
  readonly briefLine: number
  readonly briefToken: string
  readonly planLabel: string
  readonly planLinesChecked: number
}

/** Identifier-shaped tokens: dash- or slash-joined runs carrying a digit. */
const IDENTIFIER_PATTERN = /[A-Za-z0-9]+(?:[-/][A-Za-z0-9]+)+/g

/** Pure digit-and-dash runs (UTC dates, numeric ranges) are never findings. */
const DATE_LIKE_PATTERN = /^\d+(?:-\d+)+$/

/**
 * Collects the distinct identifier tokens of a brief, in first-seen order.
 * Tokens without a digit are ordinary hyphenated words and are skipped, as
 * are date-like runs; both would otherwise read as drift on every brief.
 */
export const extractBriefTokens = (briefText: string): string[] => {
  if (typeof briefText !== "string" || briefText.length === 0) return []
  const seen = new Set<string>()
  const ordered: string[] = []
  for (const match of briefText.matchAll(IDENTIFIER_PATTERN)) {
    const token = match[0]
    if (!/\d/.test(token)) continue
    if (DATE_LIKE_PATTERN.test(token)) continue
    const key = token.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    ordered.push(token)
  }
  return ordered
}

/**
 * Splits a prompt into its brief and its attached plan excerpt. Returns a
 * null plan when either marker is absent, so the caller stays silent then.
 */
export const splitBriefAndPlan = (promptText: string): { briefText: string; plan: PlanDoc | null } => {
  if (typeof promptText !== "string" || promptText.length === 0) return { briefText: "", plan: null }
  const lines = promptText.split("\n")
  const beginIndex = lines.findIndex((line) => line.trimStart().startsWith(PLAN_DOC_BEGIN))
  if (beginIndex < 0) return { briefText: promptText, plan: null }
  const endIndex = lines.findIndex((line, index) => index > beginIndex && line.trim() === PLAN_DOC_END)
  if (endIndex < 0) return { briefText: promptText, plan: null }
  const rawLabel = lines[beginIndex].slice(PLAN_DOC_BEGIN.length).trim()
  const label = rawLabel.length > 0 ? rawLabel : "plan-doc"
  const plan: PlanDoc = { label, lines: lines.slice(beginIndex + 1, endIndex) }
  const briefText = [...lines.slice(0, beginIndex), ...lines.slice(endIndex + 1)].join("\n")
  return { briefText, plan }
}

/**
 * Reports every brief token with no case-insensitive match in the plan,
 * citing the brief line of first sighting and the plan line range checked.
 * An empty plan excerpt yields no findings: drift cannot be judged without it.
 */
export const detectPlanDrift = (briefText: string, plan: PlanDoc): PlanDriftFinding[] => {
  const findings: PlanDriftFinding[] = []
  if (plan === null || plan === undefined) return findings
  if (plan.lines.length === 0) return findings
  const haystack = plan.lines.join("\n").toLowerCase()
  const briefLines = briefText.split("\n")
  for (const token of extractBriefTokens(briefText)) {
    const lowered = token.toLowerCase()
    if (haystack.includes(lowered)) continue
    let briefLine = 0
    for (let index = 0; index < briefLines.length; index += 1) {
      if (briefLines[index].toLowerCase().includes(lowered)) {
        briefLine = index + 1
        break
      }
    }
    findings.push({ briefLine, briefToken: token, planLabel: plan.label, planLinesChecked: plan.lines.length })
  }
  return findings
}

/**
 * Formats the dated plan-drift report. Each finding cites its brief line and
 * the plan file:line range checked, and the fallback paragraph closes the
 * report so the non-blocking nature travels with every emission.
 */
export const formatPlanDriftReport = (
  plan: PlanDoc,
  findings: readonly PlanDriftFinding[],
  todayUtc: string,
): string => {
  const cited = findings
    .map((finding) => `- \`${finding.briefToken}\` (brief line ${finding.briefLine}) — no match in ${finding.planLabel}:1-${finding.planLinesChecked}`)
    .join("\n")
  return (
    `${PLAN_DRIFT_TAG} — ${todayUtc} (detective, non-blocking)\n` +
    `Plan checked: ${plan.label} (${plan.lines.length} lines)\n` +
    `Brief tokens with no plan match:\n` +
    `${cited}\n` +
    PLAN_GUARD_FALLBACK
  )
}

/**
 * Appends the drift report to a prompt when the brief drifts from the
 * attached plan, and returns the prompt unchanged otherwise. Append-only:
 * the input text is never shortened and admission is never touched.
 */
export const appendPlanDriftReport = (promptText: string, todayUtc?: string): string => {
  if (typeof promptText !== "string" || promptText.length === 0) return promptText
  if (promptText.includes(PLAN_DRIFT_TAG)) return promptText
  const { briefText, plan } = splitBriefAndPlan(promptText)
  if (plan === null) return promptText
  const findings = detectPlanDrift(briefText, plan)
  if (findings.length === 0) return promptText
  const today = typeof todayUtc === "string" && todayUtc.length > 0 ? todayUtc : new Date().toISOString().slice(0, 10)
  return `${promptText}\n\n${formatPlanDriftReport(plan, findings, today)}`
}

/* ===========================================================================
 * 22. Six-hook capability probe (م-3)
 * ===========================================================================
 *
 * Read-only: it inspects the setup context it was handed and reports what it
 * observed. It registers nothing, probes nothing twice, and never upgrades an
 * unobserved hook to available. The lines are emitted once at setup through the
 * plugin logger (a no-op under V2, which carries no client) and flushed once on
 * the first `execute.after` result, which is the only visible V2 surface.
 * ========================================================================= */

export type DocumentedHook =
  | "sessionStart"
  | "preCompact"
  | "sessionEnd"
  | "model.request"
  | "ctx.permission"
  | "ctx.storage"

export type HookCapability = {
  hook: DocumentedHook
  available: boolean
  evidence: string
  fallback: string
}

/**
 * Deterministic fallback gate: what runs when a hook is absent. Every entry is
 * a SKIPPED path, never a silent PASS.
 */
const CAPABILITY_FALLBACK: Record<DocumentedHook, string> = {
  sessionStart: "V1 transform only; under V2 no anchor is emitted and the guard degrades to SKIPPED",
  preCompact: "V1 compacting only; under V2 no handoff is written and the guard degrades to SKIPPED",
  sessionEnd: "V1 event only; under V2 no learnings are persisted and the guard degrades to SKIPPED",
  "model.request": "model requests run unwrapped; no guard depends on this surface",
  "ctx.permission": "no evaluate registrar on this host; the seat-deny overlay degrades to SKIPPED and the host policy stands",
  "ctx.storage": "guards stay stateless across runs; no durable key is read or written",
}

const hasHookRegistrar = (value: unknown): boolean => {
  const scope = asRecord(value)
  return typeof scope.hook === "function"
}

export const probeHookCapabilities = (host: unknown): HookCapability[] => {
  const scope = asRecord(host)
  const modelHook = hasHookRegistrar(scope.model)
  const permissionHook = hasHookRegistrar(scope.permission)
  const storage = asRecord(scope.storage)
  const storageObserved = typeof storage.get === "function" && typeof storage.set === "function"
  // The three lifecycle hooks have no V2 registrar in this context: the session
  // scope exposes `prompt` only. They are reported absent by observation, never
  // by assumption, and nothing here registers a name the host might drop.
  const lifecycle = "the V2 setup context exposes session \"prompt\" only; the V1 callback is inert under V2"
  const entry = (hook: DocumentedHook, available: boolean, evidence: string): HookCapability => ({
    hook,
    available,
    evidence,
    fallback: CAPABILITY_FALLBACK[hook],
  })
  return [
    entry("sessionStart", false, lifecycle),
    entry("preCompact", false, lifecycle),
    entry("sessionEnd", false, lifecycle),
    entry("model.request", modelHook, modelHook ? "ctx.model.hook is a function" : "no ctx.model.hook registrar"),
    entry("ctx.permission", permissionHook, permissionHook ? "ctx.permission.hook is a function" : "no ctx.permission.hook registrar"),
    entry("ctx.storage", storageObserved, storageObserved ? "ctx.storage exposes get and set" : "no ctx.storage get/set pair"),
  ]
}

/** One line per hook, then the gate line. Same report in, same lines out. */
export const formatCapabilityLines = (report: readonly HookCapability[]): string[] => {
  const lines = report.map(
    (entry) =>
      `[arsenal] capability-probe: ${entry.hook} = ${entry.available ? "available" : "absent"} — ${entry.evidence}; fallback: ${entry.fallback}`,
  )
  const available = report.filter((entry) => entry.available).length
  const absent = report.filter((entry) => !entry.available).map((entry) => entry.hook)
  lines.push(
    `[arsenal] capability-probe: gate = ${available}/${report.length} available — ${
      absent.length === 0
        ? "every documented hook observed on this host"
        : `${absent.join(", ")} unwired; absent hooks are never registered and their guards degrade to SKIPPED`
    }`,
  )
  return lines
}

/* ===========================================================================
 * 23. Diff Size Guard
 * =========================================================================
 *
 * Blueprint `:200`: uncommitted work above 120 lines or 4 files, with no
 * atomic commit in between, means the next edit piles onto an unverified
 * change. The guard warns before write-capable calls only, once per HEAD: a
 * commit re-arms it, which is exactly the atomic-commit behaviour it demands.
 * The warning travels through `pendingWarnings`, the same channel every other
 * non-throwing verdict uses, and is delivered on the next tool result.
 * ========================================================================= */

export const diffSizeGuard = async (
  arsenal: ArsenalContext,
  sessionId: string,
  toolName: string,
): Promise<void> => {
  if (killSwitchReason(arsenal) !== null) return
  if (!WRITE_TOOLS.has(toolName) && toolName !== "bash") return

  const state = sessionState(arsenal, sessionId)
  const deadline = createDeadline(GIT_TIMEOUT_MS)
  const attempt = await readGitFacts(arsenal.rt, arsenal.root, deadline, true)
  if (attempt.status !== "ok") return
  const facts = attempt.value
  if (typeof facts.changedFiles !== "number" || typeof facts.changedLines !== "number") return
  if (typeof facts.head !== "string" || facts.head.length === 0) return
  // One warning per HEAD: the same uncommitted pile does not nag every call,
  // while a new commit makes the next excess observable again.
  if (state.warnedDiffHead === facts.head) return
  if (facts.changedLines <= DIFF_LINE_LIMIT && facts.changedFiles <= DIFF_FILE_LIMIT) return

  state.warnedDiffHead = facts.head
  const line = formatGuardLine(
    "diff-size-guard",
    "BLOCKED",
    `${facts.changedLines} uncommitted line(s) across ${facts.changedFiles} file(s) exceed ${DIFF_LINE_LIMIT} lines / ${DIFF_FILE_LIMIT} files since ${facts.head.slice(0, 8)}`,
  )
  state.guardOutcomes.push(line)
  arsenal.pendingWarnings.push(
    `${line}. Verify this slice and land one atomic commit before starting new work; ` +
      "untracked files count toward the file ceiling and contribute no line count.",
  )
}

/* ===========================================================================
 * 24. Wiring
 * ========================================================================= */

/**
 * Locate the part the task dispatcher may extend in place (F8).
 *
 * When parts expose a string role, the last user text part wins. When no part
 * exposes a role, which is the only shape observed on host 1.18.34, the last
 * text part of any role is returned, preserving the legacy behaviour without
 * inventing a role the host never sent. Null is returned when no appendable
 * part exists, and also when roles are exposed but no user text part exists:
 * appending dispatcher text to an assistant part would misattribute the
 * instruction as model output, so the turn is left untouched.
 */
export const findDispatcherAppendTarget = (
  parts: readonly unknown[],
): ({ text: string } & Record<string, unknown>) | null => {
  let fallback: ({ text: string } & Record<string, unknown>) | null = null
  let userTarget: ({ text: string } & Record<string, unknown>) | null = null
  let exposesRoles = false
  for (const part of parts) {
    if (!part || typeof part !== "object" || Array.isArray(part)) continue
    const record = part as { type?: unknown; text?: unknown; role?: unknown } & Record<string, unknown>
    if (typeof record.role === "string") exposesRoles = true
    if (record.type !== "text" || typeof record.text !== "string") continue
    const writable = record as { text: string } & Record<string, unknown>
    fallback = writable
    if (typeof record.role === "string" && record.role.toLowerCase() === "user") userTarget = writable
  }
  if (!exposesRoles) return fallback
  return userTarget
}

const extractText = (parts: unknown): string => {
  if (!Array.isArray(parts)) return ""
  const collected: string[] = []
  for (const entry of parts) {
    if (!entry || typeof entry !== "object") continue
    const record = entry as { type?: unknown; text?: unknown }
    if (record.type === "text" && typeof record.text === "string") collected.push(record.text)
  }
  return collected.join("\n").trim()
}

/**
 * Per-plugin-instance state.
 *
 * The context is per plugin instance. Two instances in one process must not
 * share session memory, guard verdicts, or the recorded log target. It is built
 * by a helper rather than inline in each surface because `server()` and
 * `setup()` must not drift apart on how the config is read or where state
 * lives - the V2 dispatcher reads its kill switch out of the very same object
 * the V1 guards do.
 */
const createContext = (
  rt: Runtime,
  root: string,
  client: PluginClientLike | undefined,
): ArsenalContext => ({
  rt,
  root,
  client,
  sessions: new Map<string, SessionState>(),
  anchors: new Map<string, ContextAnchor>(),
  config: readConfig(rt, root),
  tscChain: Promise.resolve(),
  pendingWarnings: [],
  lastLogTarget: null,
  capabilityLines: [],
  capabilitiesFlushed: false,
})

const reportRuntimeDegradation = (ctx: ArsenalContext): void => {
  for (const failure of ctx.rt.loadErrors) {
    // Every guard degrades to SKIPPED from here; nothing throws at import time.
    log(ctx, "warn", `runtime degraded: ${failure}`)
  }
}

/**
 * V2 `tool.execute.before` adapter (HOOKS 4 + 7).
 *
 * V2 hands the guard one mutable event (`{ tool, sessionID, id, input }`)
 * where V1 handed it `(input, output)` with the arguments on `output.args`.
 * The event is re-paired into the V1 shape and the same two functions run, so
 * both surfaces block the same commands with the same message text. The write
 * is recorded into the session working set first, mirroring the V1
 * `tool.execute.before` hook, so pre-compact and session-end observe V2 tool
 * writes exactly like V1 ones.
 */
export const v2ToolBefore = async (arsenal: ArsenalContext, event: V2ToolBeforeEvent): Promise<void> => {
  if (killSwitchReason(arsenal) !== null) return
  const toolName = typeof event?.tool === "string" ? event.tool : ""
  if (toolName.length === 0) return
  const sessionId =
    typeof event?.sessionID === "string" && event.sessionID.length > 0 ? event.sessionID : "anonymous"
  const callId = typeof event?.id === "string" && event.id.length > 0 ? event.id : "v2-before"
  rememberSessionAgent(arsenal, sessionId, seatAgentName(event?.agent))
  recordTouchedFiles(arsenal, sessionId, candidatePathsFrom(arsenal.root, event?.input))
  await diffSizeGuard(arsenal, sessionId, toolName)
  const input: ToolExecuteBeforeInput = { tool: toolName, sessionID: sessionId, callID: callId }
  const output: ToolExecuteBeforeOutput = { args: event?.input }
  await longRunningProcessGuard(arsenal, input, output)
  await docsDisciplineGuard(arsenal, input, output)
}

/**
 * Append a guard line to a V2 tool result.
 *
 * V1 hands `execute.after` a mutable `{ title, output, metadata }` whose
 * `output` string the guards extend. V2 hands it a `Tool.Result` whose
 * `content` is `string | Content[] | undefined`, so the same line is appended
 * to a string, pushed as a text part onto an array, or set when content is
 * absent. Any other shape is left untouched: inventing a field the host never
 * reads would claim a verdict was delivered when it was not.
 */
const appendV2ResultLine = (result: unknown, line: string): void => {
  if (!result || typeof result !== "object" || line.length === 0) return
  const holder = result as { content?: unknown }
  if (typeof holder.content === "string") {
    holder.content = `${holder.content}\n${line}`
    return
  }
  if (Array.isArray(holder.content)) {
    (holder.content as unknown[]).push({ type: "text", text: line })
    return
  }
  if (holder.content === undefined) {
    holder.content = line
  }
}

/**
 * V2 `tool.execute.after` adapter (HOOKS 5 + 6, plus warn-mode flushing).
 *
 * The V1 check functions are reused against a shim output and the shim text is
 * then forwarded into the V2 `result.content`. The serialised type-check chain
 * is drained before forwarding so a queued verdict is delivered on the call it
 * belongs to rather than on a later one; V1 leaves the queue undrained and the
 * late mutation lands through the still-held output reference instead. Neither
 * surface throws here: the V2 contract types this hook's failure as `never`,
 * and neither check throws on V1 either. When the event carries no result
 * object (status `error`), the text is re-queued instead of dropped: dropping
 * a warning would be a silent PASS for work the guard actually flagged.
 */
const v2ToolAfter = async (arsenal: ArsenalContext, event: V2ToolAfterEvent): Promise<void> => {
  if (killSwitchReason(arsenal) !== null) return
  const sessionId =
    typeof event?.sessionID === "string" && event.sessionID.length > 0 ? event.sessionID : "anonymous"
  const callId = typeof event?.id === "string" && event.id.length > 0 ? event.id : "v2-after"
  rememberSessionAgent(arsenal, sessionId, seatAgentName(event?.agent))
  const toolName = typeof event?.tool === "string" ? event.tool : ""
  const shim: ToolExecuteAfterOutput = { title: "", output: "", metadata: {} }
  // First tool result of the session carries the capability probe lines once.
  // Under V2 the plugin logger has no client, so this is the only visible
  // surface; a second flush would duplicate lines nobody asked to see twice.
  if (!arsenal.capabilitiesFlushed && arsenal.capabilityLines.length > 0) {
    arsenal.capabilitiesFlushed = true
    shim.output = `${shim.output}\n${arsenal.capabilityLines.join("\n")}`
  }
  if (arsenal.pendingWarnings.length > 0) {
    shim.output = `${shim.output}\n${arsenal.pendingWarnings.join("\n")}`
    arsenal.pendingWarnings = []
  }
  const input: ToolExecuteAfterInput = {
    tool: toolName,
    sessionID: sessionId,
    callID: callId,
    args: event?.input,
  }
  await typescriptCheck(arsenal, input, shim)
  await prettierFormat(arsenal, input, shim)
  // Drain the serialised type-check queue (see enqueueTypeCheck): without this
  // the shim would be forwarded before a queued tsc run appends its verdict.
  await arsenal.tscChain
  const text = shim.output.trim()
  if (text.length === 0) return
  const result = (event as { result?: unknown })?.result
  if (!result || typeof result !== "object") {
    arsenal.pendingWarnings.push(text)
    return
  }
  const holder = result as { content?: unknown }
  if (typeof holder.content !== "string" && !Array.isArray(holder.content) && holder.content !== undefined) {
    arsenal.pendingWarnings.push(text)
    return
  }
  appendV2ResultLine(result, text)
}

/**
 * V2 `shell.create.before` adapter (HOOKS 4 + 7 for raw shell executions).
 *
 * The shell hook carries `{ command, cwd, ... }` with no tool name and no
 * session id. The command is re-paired as a `bash` tool call so the same two
 * before-guards run with the same message text; outcomes are recorded under
 * `anonymous` because attributing them to any other session would invent
 * provenance the event does not carry.
 */
const v2ShellBefore = async (arsenal: ArsenalContext, event: V2ShellBeforeEvent): Promise<void> => {
  if (killSwitchReason(arsenal) !== null) return
  const command = typeof event?.command === "string" ? event.command : ""
  if (command.trim().length === 0) return
  const input: ToolExecuteBeforeInput = { tool: "bash", sessionID: "anonymous", callID: "shell" }
  const output: ToolExecuteBeforeOutput = { args: { command } }
  await longRunningProcessGuard(arsenal, input, output)
  await docsDisciplineGuard(arsenal, input, output)
}

/**
 * V2 `setup()`. Registers the six hooks whose V2 shapes have a correct
 * landing place for an existing guard.
 *
 *   - session "prompt"       -> taskDispatcher (HOOK 8)
 *   - permission "evaluate"  -> seatDenyOverlay (HOOK 9; deny-only overlay
 *                               for the shipped `permissions:` blocks)
 *   - tool "execute.before"  -> longRunningProcessGuard (HOOK 4) +
 *                               docsDisciplineGuard (HOOK 7)
 *   - tool "execute.after"   -> typescriptCheck (HOOK 5) +
 *                               prettierFormat (HOOK 6)
 *   - shell "create.before"  -> longRunningProcessGuard + docsDisciplineGuard
 *                               for raw shell executions, which carry no tool
 *                               name and no session id
 *
 * Three V1 hooks are not registered, on purpose. V2 has no equivalent of V1's
 * `experimental.chat.system.transform`, `experimental.session.compacting` or
 * `event` session-end signal with a mutable string array to append to, so
 * session-start, pre-compact and session-end have nowhere correct to land yet.
 * Registering a stub that fired and did nothing would report coverage the
 * module does not have.
 *
 * V2 hook callbacks take a single mutable event object where V1 took an
 * `(input, output)` pair, so each registration below re-pairs the event into
 * the V1 shape and reuses the same guard core the V1 surface calls. Blocking
 * guards throw the same Error text on both surfaces; `execute.after` never
 * throws on either surface (its V2 failure type is `never`), it only appends.
 */
const setup: PluginDefinition["setup"] = async (ctx: PluginContextLike): Promise<void> => {
  const rt = await loadRuntime()

  // V2 exposes the plugin instance's own directory and no worktree field on it,
  // so `location.directory` is the root here and the cwd is the fallback. This
  // is the same precedence chain the V1 surface uses, minus the two V1-only
  // keys, and it resolves the kill-switch config by the identical path. Bare
  // filesystem roots are skipped via firstUsableRoot exactly like V1 (F5): a
  // bare root is never the project, so config, state and relative paths never
  // anchor on it.
  const root = firstUsableRoot(ctx?.location?.directory, rt.proc.cwd()) ?? rt.proc.cwd()
  const arsenal = createContext(rt, root, undefined)
  reportRuntimeDegradation(arsenal)

  // Six-hook capability probe (م-3): observe the context once, log one line per
  // hook, and queue the same lines for the first tool result. Registration
  // continues regardless: a probe never gates a guard, it only reports.
  arsenal.capabilityLines = formatCapabilityLines(probeHookCapabilities(ctx))
  for (const line of arsenal.capabilityLines) log(arsenal, "info", line)

  // Each domain registers independently: a context missing one domain still
  // arms the others. A guard that silently did nothing would be worse than one
  // that says so, so every callback below degrades to a no-op only for the
  // cases its own comments name (kill switch set, empty draft,
  // already-dispatched draft, unknown tool, empty command).
  //
  // One prompt callback carries both append-only rewrites: the dispatcher
  // instruction and then the plan-guard report. Two registrations would be two
  // append paths on one event; one path keeps ordering and idempotence obvious.
  const sessionRegister = ctx?.session?.hook
  if (typeof sessionRegister === "function") {
    await sessionRegister.call(ctx.session, "prompt", (event: SessionPromptEvent): void => {
      if (killSwitchReason(arsenal) !== null) return

      const draft = event?.prompt
      const userText = typeof draft?.text === "string" ? draft.text : ""
      // An empty draft carries no intent to classify, so injecting a five-line
      // instruction into it would add cost and teach the model nothing.
      if (userText.length === 0) return

      const instruction = taskDispatcher(arsenal)
      if (instruction !== null && !hasDispatchInstruction(userText)) {
        // Captured before the rewrite so `lastIntent` stays the user's own words
        // and never the instruction this hook appends.
        const state = sessionState(arsenal, event?.sessionID ?? "anonymous")
        state.lastIntent = clip(userText, MAX_CAPTURED_INTENT_CHARS)
        draft.text = `${userText}\n\n${instruction}`
      }
      // Plan-guard append runs on the resulting draft, exactly where the retired
      // carrier ran it, and only rewrites when the brief drifts from the plan.
      const annotated = appendPlanDriftReport(draft.text)
      if (annotated !== draft.text) draft.text = annotated
      // V2's plugin context has no `client.app.log`, so `log` is a no-op here by
      // design rather than by accident. The V1 surface still records the
      // injection; under V2 the persisted prompt is the evidence.
    })
  }

  const toolRegister = ctx?.tool?.hook
  if (typeof toolRegister === "function") {
    await toolRegister.call(ctx.tool, "execute.before", (event: V2ToolBeforeEvent & V2ToolAfterEvent): Promise<void> =>
      v2ToolBefore(arsenal, event),
    )
    await toolRegister.call(ctx.tool, "execute.after", (event: V2ToolBeforeEvent & V2ToolAfterEvent): Promise<void> =>
      v2ToolAfter(arsenal, event),
    )
  }

  const shellRegister = ctx?.shell?.hook
  if (typeof shellRegister === "function") {
    await shellRegister.call(ctx.shell, "create.before", (event: V2ShellBeforeEvent): Promise<void> =>
      v2ShellBefore(arsenal, event),
    )
  }

  // Seat-deny overlay (HOOK 9). `ctx.permission.hook` is observed at setup;
  // when the host does not expose it the capability probe already recorded the
  // absence and this registration is skipped, never faked. The session-agent
  // reader is built only from the documented `ctx.session.get`, because the
  // evaluation event's `agent` field is optional.
  const permissionRegister = ctx?.permission?.hook
  if (typeof permissionRegister === "function") {
    const sessionGet = ctx?.session?.get
    const readSessionAgent: SessionAgentReader | undefined =
      typeof sessionGet === "function"
        ? async (sessionID: string): Promise<string | null> => {
            try {
              const info = asRecord(await sessionGet.call(ctx.session, { sessionID }))
              const direct = seatAgentName(info.agent)
              if (direct !== null) return direct
              return seatAgentName(asRecord(info.agent).id)
            } catch {
              // The overlay falls back to the observed-event cache instead.
              return null
            }
          }
        : undefined
    await permissionRegister.call(ctx.permission, "evaluate", (event: PermissionEvaluation): Promise<void> =>
      seatDenyOverlay(arsenal, event, readSessionAgent),
    )
  }
}

/**
 * Project-root precedence.
 *
 * The host may hand a bare filesystem root (`"/"`) as the worktree when the
 * project is not a git checkout (observed 2026-10-11 on host 1.18.34: a
 * worktree of `"/"` for a plain directory). A bare root is never the
 * project: config, state and relative paths all resolve against it, so the
 * kill switches silently stop working and session state lands outside the
 * project. It is therefore skipped in favour of the next candidate, which
 * for a plain directory is the project directory itself. Git checkouts are
 * unaffected: a real worktree still wins.
 */
/**
 * A filesystem root that is never the project (F5): POSIX slash, a drive
 * root such as C colon backslash, a bare UNC prefix (two backslashes or two
 * slashes), or a bare UNC share root such as server share with an optional
 * trailing separator. Anything deeper than the share is a usable path.
 */
export const isBareRoot = (value: string): boolean => {
  const text = value.trim()
  if (/^[\\/]$/.test(text)) return true
  if (/^[A-Za-z]:[\\/]$/.test(text)) return true
  if (/^(?:\\\\|\/\/)$/.test(text)) return true
  if (/^\\\\[^\\/]+[\\/][^\\/]+[\\/]?$/.test(text)) return true
  if (/^\/\/[^\\/]+\/[^\\/]+\/?$/.test(text)) return true
  return false
}

export const firstUsableRoot = (...candidates: readonly unknown[]): string | null => {
  let fallback: string | null = null
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue
    // Trimmed once and reused: the bare-root test, the fallback and the
    // return value all observe the same string (F5).
    const trimmed = candidate.trim()
    if (trimmed.length === 0) continue
    if (fallback === null) fallback = trimmed
    if (!isBareRoot(trimmed)) return trimmed
  }
  return fallback
}

const server: Plugin = async (input: PluginInput): Promise<Hooks> => {
  const rt = await loadRuntime()
  const root =
    firstUsableRoot(input?.worktree, input?.project?.worktree, input?.directory) ?? rt.proc.cwd()

  const ctx = createContext(rt, root, input?.client)
  reportRuntimeDegradation(ctx)

  return {
    config: (cfg: unknown): void => {
      if (!cfg || typeof cfg !== "object") return
      ctx.config = readConfig(rt, root)
    },

    event: async (envelope: EventEnvelope): Promise<void> => {
      if (killSwitchReason(ctx) !== null) return
      const type = typeof envelope?.event?.type === "string" ? envelope.event.type : ""
      const properties = envelope?.event?.properties
      const props =
        properties && typeof properties === "object" ? (properties as Record<string, unknown>) : {}
      const info = asRecord(props.info)
      const sessionId =
        typeof props.sessionID === "string"
          ? props.sessionID
          : typeof info.id === "string"
            ? info.id
            : "anonymous"

      if (SESSION_BEGIN_EVENTS.has(type)) {
        await anchorFor(ctx, sessionId)
        return
      }
      if (SESSION_END_EVENTS.has(type)) {
        await sessionEnd(ctx, type, properties)
        return
      }
      if (type.startsWith("session.") && !ctx.anchors.has(sessionId)) {
        // Any other session event is the earliest reliable moment to warm the
        // anchor, which keeps the read budget off the first-token path.
        await anchorFor(ctx, sessionId)
      }
    },

    "chat.message": async (msgInput: ChatMessageInput, msgOutput: ChatMessageOutput): Promise<void> => {
      if (killSwitchReason(ctx) !== null) return
      const parts = msgOutput?.parts
      if (!Array.isArray(parts)) return
      const text = extractText(parts)
      if (text.length === 0) return
      // The kill switch disarms the dispatcher rather than only its text
      // (F7): a disabled dispatcher returns before any session state is
      // touched, which matches what the V2 prompt surface already does.
      const instruction = taskDispatcher(ctx)
      if (instruction === null) return
      const state = sessionState(ctx, msgInput?.sessionID ?? "anonymous")
      // After the intent is captured, so lastIntent stays the user-owned words
      // and never the instruction this hook adds.
      state.lastIntent = clip(text, MAX_CAPTURED_INTENT_CHARS)
      if (hasDispatchInstruction(text)) return

      // Append to the last existing user text part, which already carries the
      // host-validated identity. A synthetic part pushed here fails host-side
      // validation before save and aborts the run. When the host exposes a
      // string role on parts, only an explicit user part is extended; a turn
      // with no user text part is left untouched instead of misattributing
      // dispatcher text to an assistant part (F8).
      const target = findDispatcherAppendTarget(parts)
      if (!target) {
        // No text part to extend: injecting nothing is the only safe degradation.
        log(ctx, "debug", "task-dispatcher: skipped for " + (msgInput?.sessionID ?? "anonymous") + " (no user text part)")
        return
      }
      target.text = target.text + "\n\n" + instruction
      log(ctx, "debug", "task-dispatcher: instruction appended for " + (msgInput?.sessionID ?? "anonymous"))
    },

    "experimental.chat.system.transform": async (
      systemInput: SystemTransformInput,
      systemOutput: SystemTransformOutput,
    ): Promise<void> => {
      if (killSwitchReason(ctx) !== null) return
      await sessionStart(ctx, systemInput, systemOutput)
    },

    "experimental.session.compacting": async (
      compactInput: CompactingInput,
      compactOutput: CompactingOutput,
    ): Promise<void> => {
      if (killSwitchReason(ctx) !== null) return
      await preCompact(ctx, compactInput, compactOutput)
    },

    "tool.execute.before": async (
      toolInput: ToolExecuteBeforeInput,
      toolOutput: ToolExecuteBeforeOutput,
    ): Promise<void> => {
      if (killSwitchReason(ctx) !== null) return
      recordTouchedFiles(ctx, toolInput.sessionID, candidatePathsFrom(root, toolOutput?.args))
      await diffSizeGuard(ctx, toolInput.sessionID, toolInput.tool)
      await longRunningProcessGuard(ctx, toolInput, toolOutput)
      await docsDisciplineGuard(ctx, toolInput, toolOutput)
    },

    "tool.execute.after": async (
      toolInput: ToolExecuteAfterInput,
      toolOutput: ToolExecuteAfterOutput,
    ): Promise<void> => {
      if (killSwitchReason(ctx) !== null) return
      if (ctx.pendingWarnings.length > 0 && typeof toolOutput?.output === "string") {
        toolOutput.output = `${toolOutput.output}\n${ctx.pendingWarnings.join("\n")}`
        ctx.pendingWarnings = []
      }
      await typescriptCheck(ctx, toolInput, toolOutput)
      await prettierFormat(ctx, toolInput, toolOutput)
    },
  }
}

/**
 * One default export, two surfaces.
 *
 * The id is required by V2 and optional-but-tolerated by V1, and the two
 * runtimes never read each other's half. V1 1.18.34 resolves this module
 * through `readV1Plugin(mod, spec, "server", "detect")`, which reads
 * `mod.default`, requires `server` to be a function when present, and ignores
 * every other key (`packages/opencode/src/plugin/shared.ts`); `applyPlugin`
 * in `packages/opencode/src/plugin/index.ts` then awaits
 * `plugin.server(input, options)` (verified 2026-10-11: the export shape
 * loads, the crash was a malformed message part, not the export). V2
 * (`@opencode/plugin` 2.0.26 `dist/promise/plugin.d.ts`:
 * `Plugin { id; setup }`) reads `id` + `setup()` and ignores `server()`.
 * A bare function export would be loadable by V1 only, so the object form
 * is what makes the dispatcher and the tool/shell guards reachable on V2
 * without retiring the three session-lifecycle hooks that only V1 can fire.
 */
export default {
  ...definePlugin({ id: "vantrilex-arsenal", setup }),
  server,
} satisfies ArsenalPluginModule
