/**
 * Vantrilex Arsenal - Tier-0 guards for OpenCode.
 *
 * OpenCode has no hooks directory. Hooks are plugin callbacks, so all eight
 * logical Tier-0 hooks live in this single module and are registered on the
 * callbacks that actually fire for them:
 *
 *   1. sessionStart              -> experimental.chat.system.transform, event
 *   2. preCompact                -> experimental.session.compacting
 *   3. sessionEnd                -> event
 *   4. longRunningProcessGuard   -> tool.execute.before
 *   5. typescriptCheck           -> tool.execute.after   (conditional)
 *   6. prettierFormat            -> tool.execute.after   (conditional)
 *   +  docsDisciplineGuard       -> tool.execute.before   (docs discipline)
 *   +  taskDispatcher            -> chat.message          (per user message)
 *
 * Rules this module obeys without exception:
 *
 *   - Zero dependencies. Nothing is imported that is not a Node built-in.
 *   - Node-only runtime. No foreign runtime assumptions.
 *   - Every guard degrades to SKIPPED with a stated reason. A guard never
 *     crashes a session and never reports PASS for work it did not do.
 *   - Hook callbacks mutate their output argument in place and return void.
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
 * `chat.message` is the only per-turn write surface in this hook API, so the
 * instruction is re-sent on every single prompt and its cost is paid again each
 * time. The budget is therefore five lines, not five paragraphs: the five
 * scenarios are named, each with its one-clause obligation, and the procedure
 * itself is deferred to the vanguard skill that already owns it. A longer
 * injection would not add behaviour, it would only add tokens per prompt.
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
  allowedDirs: string[]
  allowedFiles: string[]
  /** Numbered series such as docs/00-..27-. Series entries are `dir` + range. */
  series: { dir: string; from: number; to: number }[]
}

export const DEFAULT_DOCS_GUARD: DocsGuardConfig = {
  mode: "block",
  allowedDirs: ["docs/99-archive", "docs/spec", "registry", ".opencode", "brand"],
  allowedFiles: [
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
 * `false`, for the same reason the docs guard defaults to blocking: a missing
 * file, malformed JSON or a half-written config must never quietly disarm a
 * guard. It also means a config that cannot be parsed fails towards the
 * documented default in both directions instead of guessing.
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

  const written = writeTextFile(ctx.rt, join(stateDir, "handoff", `${sessionId}.md`), `${handoff}\n`)
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
  const archived = writeTextFile(ctx.rt, join(stateDir, "sessions", `${candidate}.md`), markdown)
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
  if (guard.mode === "off") return
  if (!WRITE_TOOLS.has(input?.tool)) return

  const markdownCandidates = candidatePathsFrom(ctx.root, output?.args).filter((entry) =>
    isMarkdownPath(ctx.rt, entry),
  )
  if (markdownCandidates.length === 0) return

  const violations = markdownCandidates
    .map((entry) => docsGuardVerdict(ctx, entry))
    .filter((verdict) => !verdict.allowed)
    .map((verdict, index) => ({ path: markdownCandidates[index] ?? "unknown", reason: verdict.reason }))

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
 * HOOK 8 - task dispatcher. Injects the scenario-classification instruction
 * ahead of every user message so the turn starts by deciding which of the five
 * task scenarios it is, instead of by improvising.
 *
 * ONCE PER TASK IS THE EVENT, NOT A GUARD. `chat.message` fires when a user
 * message is admitted, and the runtime re-reads `output.parts` afterwards, so a
 * part pushed here genuinely reaches the model. Nothing inside a task can
 * re-trigger it: phase transitions are assistant replies and tool calls, and
 * those are `message.updated` / `tool.execute.*`, not user-message admission.
 * The event granularity and the task boundary are the same boundary.
 *
 * No per-session "already dispatched" flag is kept, deliberately. Every user
 * message may be a new task, a continuation, or a modification, so the
 * classification has to be present on each of them; a once-per-session latch
 * would suppress the instruction on exactly the messages that need it. The one
 * guard that is kept is idempotence within a single parts array, because the
 * runtime may re-present the same output object.
 */
export const taskDispatcher = async (
  ctx: ArsenalContext,
  input: ChatMessageInput,
  output: ChatMessageOutput,
): Promise<void> => {
  if (ctx.config.taskDispatcher.enabled !== true) return
  const parts = output?.parts
  if (!Array.isArray(parts)) return
  const alreadyPresent = parts.some(
    (entry) => asRecord(entry).type === "text" && asRecord(entry).text === TASK_DISPATCH_INSTRUCTION,
  )
  if (alreadyPresent) return

  // The minimal `{ type, text }` shape is deliberate: the runtime owns message
  // identity and timestamps and fills them in when it re-reads the array, and a
  // synthetic marker would misreport this text as something the user typed.
  parts.push({ type: "text", text: TASK_DISPATCH_INSTRUCTION })
  log(ctx, "debug", `task-dispatcher: instruction injected for ${input?.sessionID ?? "anonymous"}`)
}

/* ===========================================================================
 * 21. Wiring
 * ========================================================================= */

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

export default (async (input: PluginInput): Promise<Hooks> => {
  const rt = await loadRuntime()
  const root =
    input?.worktree ??
    input?.project?.worktree ??
    input?.directory ??
    rt.proc.cwd()

  // The context is per plugin instance. Two instances in one process must not
  // share session memory, guard verdicts, or the recorded log target.
  const ctx: ArsenalContext = {
    rt,
    root,
    client: input?.client,
    sessions: new Map<string, SessionState>(),
    anchors: new Map<string, ContextAnchor>(),
    config: readConfig(rt, root),
    tscChain: Promise.resolve(),
    pendingWarnings: [],
    lastLogTarget: null,
  }

  for (const failure of rt.loadErrors) {
    // Every guard degrades to SKIPPED from here; nothing throws at import time.
    log(ctx, "warn", `runtime degraded: ${failure}`)
  }

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
      const text = extractText(msgOutput?.parts)
      if (text.length === 0) return
      const state = sessionState(ctx, msgInput?.sessionID ?? "anonymous")
      state.lastIntent = clip(text, MAX_CAPTURED_INTENT_CHARS)
      // After the intent is captured, so `lastIntent` stays the user's own words
      // and never the instruction this hook adds.
      await taskDispatcher(ctx, msgInput, msgOutput)
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
}) satisfies Plugin
