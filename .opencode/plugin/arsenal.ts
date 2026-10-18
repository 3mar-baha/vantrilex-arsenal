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
 * V2 - `setup()`, five hooks:
 *
 *   8. taskDispatcher            -> session "prompt"        (per user prompt)
 *   4. longRunningProcessGuard   -> tool "execute.before" + shell "create.before"
 *   7. docsDisciplineGuard       -> tool "execute.before" + shell "create.before"
 *   5. typescriptCheck           -> tool "execute.after"    (conditional)
 *   6. prettierFormat            -> tool "execute.after"    (conditional)
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

export type PluginContextLike = {
  location?: PluginLocationLike
  session?: {
    hook?: (
      name: "prompt",
      callback: (event: SessionPromptEvent) => Promise<void> | void,
    ) => Promise<unknown>
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
 */
const TASK_DISPATCH_INSTRUCTION = [
  "[arsenal] task-dispatcher: classify this prompt into exactly one scenario and run that scenario's playbook in the vantrilex-vanguard skill; if the prompt is genuinely ambiguous, ask the user one short clarifying question before proceeding.",
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
}

type ArsenalConfig = {
  docsGuard: DocsGuardConfig
  taskDispatcher: TaskDispatcherConfig
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
}

const readGitFacts = async (rt: Runtime, root: string, deadline: Deadline): Promise<Attempt<GitFacts>> => {
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
  const dirty =
    statusRun.spawnFailed || statusRun.code !== 0
      ? "unknown"
      : statusRun.stdout.split("\n").filter((line) => line.trim().length > 0).length === 0
        ? "clean"
        : `${statusRun.stdout.split("\n").filter((line) => line.trim().length > 0).length} changed path(s)`

  return ok({ branch, worktrees, dirty })
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
  }
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
  const handoff = [
    anchor.text,
    "",
    "HANDOFF SNAPSHOT",
    `Session: ${sessionId}`,
    `Working set: ${touched.length === 0 ? "unknown" : touched.join(", ")}`,
    `Guard outcomes: ${state.guardOutcomes.length === 0 ? "none recorded" : state.guardOutcomes.join(" | ")}`,
    `Last user intent: ${state.lastIntent.length > 0 ? state.lastIntent : "unknown"}`,
    `Circuit: ${state.circuit.failures} consecutive guard failure(s) this session`,
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
 * HOOK 8 in this file's original V1 enumeration, which is not the locked-hook
 * count: the seventh hook in `kit/kit.lock` is `docsDisciplineGuard` (HOOK 7
 * below), and it is not a lock component, so the census every document quotes
 * is seven locked hooks. The dispatcher is the eighth enumerated callback and
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
 * 21. Wiring
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
  const toolName = typeof event?.tool === "string" ? event.tool : ""
  if (toolName.length === 0) return
  const sessionId =
    typeof event?.sessionID === "string" && event.sessionID.length > 0 ? event.sessionID : "anonymous"
  const callId = typeof event?.id === "string" && event.id.length > 0 ? event.id : "v2-before"
  recordTouchedFiles(arsenal, sessionId, candidatePathsFrom(arsenal.root, event?.input))
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
  const sessionId =
    typeof event?.sessionID === "string" && event.sessionID.length > 0 ? event.sessionID : "anonymous"
  const callId = typeof event?.id === "string" && event.id.length > 0 ? event.id : "v2-after"
  const toolName = typeof event?.tool === "string" ? event.tool : ""
  const shim: ToolExecuteAfterOutput = { title: "", output: "", metadata: {} }
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
  const command = typeof event?.command === "string" ? event.command : ""
  if (command.trim().length === 0) return
  const input: ToolExecuteBeforeInput = { tool: "bash", sessionID: "anonymous", callID: "shell" }
  const output: ToolExecuteBeforeOutput = { args: { command } }
  await longRunningProcessGuard(arsenal, input, output)
  await docsDisciplineGuard(arsenal, input, output)
}

/**
 * V2 `setup()`. Registers the five hooks whose V2 shapes have a correct
 * landing place for an existing guard.
 *
 *   - session "prompt"       -> taskDispatcher (HOOK 8)
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

  // Each domain registers independently: a context missing one domain still
  // arms the others. A guard that silently did nothing would be worse than one
  // that says so, so every callback below degrades to a no-op only for the
  // cases its own comments name (kill switch off, empty draft,
  // already-dispatched draft, unknown tool, empty command).
  const sessionRegister = ctx?.session?.hook
  if (typeof sessionRegister === "function") {
    await sessionRegister.call(ctx.session, "prompt", (event: SessionPromptEvent): void => {
      const instruction = taskDispatcher(arsenal)
      if (instruction === null) return

      const draft = event?.prompt
      const userText = typeof draft?.text === "string" ? draft.text : ""
      // An empty draft carries no intent to classify, so injecting a five-line
      // instruction into it would add cost and teach the model nothing.
      if (userText.length === 0) return
      if (hasDispatchInstruction(userText)) return

      // Captured before the rewrite so `lastIntent` stays the user's own words
      // and never the instruction this hook appends.
      const state = sessionState(arsenal, event?.sessionID ?? "anonymous")
      state.lastIntent = clip(userText, MAX_CAPTURED_INTENT_CHARS)

      draft.text = `${userText}\n\n${instruction}`
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
      await sessionStart(ctx, systemInput, systemOutput)
    },

    "experimental.session.compacting": async (
      compactInput: CompactingInput,
      compactOutput: CompactingOutput,
    ): Promise<void> => {
      await preCompact(ctx, compactInput, compactOutput)
    },

    "tool.execute.before": async (
      toolInput: ToolExecuteBeforeInput,
      toolOutput: ToolExecuteBeforeOutput,
    ): Promise<void> => {
      recordTouchedFiles(ctx, toolInput.sessionID, candidatePathsFrom(root, toolOutput?.args))
      await longRunningProcessGuard(ctx, toolInput, toolOutput)
      await docsDisciplineGuard(ctx, toolInput, toolOutput)
    },

    "tool.execute.after": async (
      toolInput: ToolExecuteAfterInput,
      toolOutput: ToolExecuteAfterOutput,
    ): Promise<void> => {
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
