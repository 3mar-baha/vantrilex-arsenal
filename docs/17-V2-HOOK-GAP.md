# The V2 Hook Gap

Seven callbacks in `.opencode/plugin/arsenal.ts` still run on OpenCode V1 and are
inert on OpenCode V2. One — the task-dispatcher — was ported. This document
records, per callback, what it uses today, whether a V2 equivalent actually
exists in the published V2 plugin API, what the evidence is, and what the
consequence is. It is research only: nothing here is implemented.

**Read this first, because it is the part that is easiest to get backwards.**
The runtime on this machine is OpenCode **V1, version 1.18.34**. Verified with
`opencode --version` on 2026-10-11. On this host, every plugin hook the module
registers fires through the V1 `server()` surface and nothing is inert. The
gap this document describes is a *latent* gap: it bites on a V2 host, not here.

| Host runtime | Which surface fires | Which surface is ignored |
|---|---|---|
| OpenCode V1 `>= 1.18.29` (this machine) | `server()` | `setup()` |
| OpenCode V2 | `setup()` | `server()` |

The inaccuracy to avoid is therefore a runtime claim. It is wrong to say "six
hooks are inert" full stop. It is right to say "six hooks are inert *on a V2
host*", and to say that on this V1 host they ran all along.

## Which types were read

The strongest evidence available on this machine is the installed package set.

| Source | Version | Path |
|---|---|---|
| `@opencode-ai/plugin` (installed, V1 surface) | 1.18.34 | `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts` |
| `@opencode-ai/plugin` (installed, V2 surface) | 1.18.34 | `.opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/*.d.ts` |
| `@opencode-ai/sdk` (installed) | 1.18.34 | `.opencode/node_modules/@opencode-ai/sdk/dist/v2/gen/types.gen.d.ts` |
| `@opencode/plugin` (published V2, NOT installed here) | 2.0.26 | fetched from npm/unpkg, see quotes below |
| OpenCode CLI | 1.18.34 | `opencode --version` |

The pinned dependency in `.opencode/package.json` is `@opencode-ai/plugin` at
`1.18.34`. That package is V1-only: its `dist/index.d.ts` declares the `Hooks`
interface the `server()` surface returns. It does carry a `dist/v2/promise`
tree, but that tree is not the V2 API the repo mirrors — it is a six-domain
catalog (options, agent, aisdk, catalog, command, integration, reference, skill)
with no `session`, no `tool`, and no `event` domain at all. Reading
`dist/v2/promise/context.d.ts` in full confirms it: the `PluginContext` interface
lists exactly those eight members plus `plugin`, and nothing else.

The V2 API the module actually mirrors — the one carrying `ctx.session.hook`,
`ctx.tool.hook`, `ctx.event.subscribe` and `ctx.location` — lives in the
separate `@opencode/plugin` package, currently published at 2.0.26, which this
repository does not install and does not declare. The file header cites
`@opencode/plugin` 2.0.22 `dist/promise/session.d.ts`; that package and version
exist on npm. The 2.0.22 and 2.0.26 files quoted below were compared directly
and are byte-identical for `dist/promise/session.d.ts`,
`dist/promise/tool.d.ts` and `dist/promise/plugin.d.ts`, so the version quoted
here does not change the finding.

Recorded so the finding is dated: types read 2026-10-11, against the published
`@opencode/plugin` 2.0.26 and the installed `@opencode-ai/plugin` 1.18.34.

## The eight callbacks and their V1 surface

These are the real names and behaviours, read from
`.opencode/plugin/arsenal.ts`:

| Callback | Registered from | V1 hook | Behaviour |
|---|---|---|---|
| `sessionStart` | `server()` | `experimental.chat.system.transform` | Builds a CONTEXT ANCHOR once per session and pushes it onto `output.system` as a `string[]` entry |
| `preCompact` | `server()` | `experimental.session.compacting` | Writes a handoff file, then pushes its text onto `output.context` |
| `sessionEnd` | `server()` | `event` | On `session.idle`/`session.deleted`/`session.ended`/`session.closed`, persists a learnings Markdown file |
| `longRunningProcessGuard` | `server()` | `tool.execute.before` | On a foreground dev-server or watcher command with no log redirection, throws to block the call |
| `typescriptCheck` | `server()` | `tool.execute.after` | Appends a guard line onto `output.output` after a `.ts`/`.tsx` write |
| `prettierFormat` | `server()` | `tool.execute.after` | Appends a guard line onto `output.output` after a JS/TS write |
| `docsDisciplineGuard` | `server()` | `tool.execute.before` | Throws when a Markdown write lands outside the numbered docs series |
| `taskDispatcher` | `setup()` | session `prompt` | Appends the five-line task-classification instruction to `event.prompt.text` |

`taskDispatcher` was already migrated. How it binds matters because it is the
template for the rest: the module default-exports one object with `id`,
`setup` and `server`, so a V2 host reads `id` + `setup()` and a V1 host reads
`server()`. Inside `setup()` it resolves `ctx.location.directory` as the project
root, builds the shared `ArsenalContext`, and calls

```ts
const register = ctx?.session?.hook
await register.call(ctx.session, "prompt", (event: SessionPromptEvent): void => {
  const draft = event?.prompt
  // appends after a blank line; returns early on an empty draft
  draft.text = `${userText}\n\n${instruction}`
})
```

The hook name `"prompt"` and the `setup(context)` shape are real, and the cargo
is a prompt rewrite. Everything it needs is carried by V2.

## The three claims to test

The claim to research is that six hooks plus the docs-discipline guard are inert
under V2 because only task-dispatcher was ported. That claim rests on three
sub-claims about what V2 does *not* offer. Each one is tested below against the
types.

### 1. "There is no `experimental.chat.system.transform`"

**Not found — and correctly so.** The V2 `@opencode/plugin` 2.0.26 package
declares no such symbol. The V1 declaration, from the installed 1.18.34
`dist/index.d.ts` line 265, is:

```ts
"experimental.chat.system.transform"?: (input: {
    sessionID?: string;
    model: Model;
}, output: {
    system: string[];
}) => Promise<void>;
```

The name is V1-only. But the *capability* is not missing. `@opencode/plugin`
2.0.26 `dist/promise/session.d.ts` line 29 declares:

```ts
export interface SessionContext extends SessionRequest {
    readonly agent: Agent.ID;
    tools: Record<string, { description: string; input: JsonSchema.JsonSchema }>;
}
```

and line 22, its parent `SessionRequest`, carries:

```ts
export interface SessionRequest {
    readonly sessionID: Session.ID;
    readonly model: Model.Ref;
    system: Array<SystemPart>;
    messages: Array<Message>;
    options: SessionRequestOptions;
}
```

`system` is a mutable `Array<SystemPart>`, and `SessionHooks` (line 129) exposes
it on the `context` hook — so a plugin registered with
`ctx.session.hook("context", …)` receives the system array and can push onto
it. `SystemPart` is `{ type: "text"; text: string; cache?; metadata? }` with a
`make(text)` constructor, from `@opencode/ai@2.0.26` `dist/schema/messages.d.ts`
line 12. So the V1 *hook* has no V2 equivalent, the V1 *write* has one under a
different shape: a structured part, not a bare string.

**Consequence for `sessionStart`.** Portable. The anchor text becomes one
`SystemPart` pushed onto `context.system`, and it now fires once per model call
rather than once per session — which is a behaviour change the port must decide
about, not a blocker. `sessionStart` reads no other V1-only state.

### 2. "There is no `experimental.session.compacting`"

**Not found — correctly so.** The V1 declaration is at installed 1.18.34
`dist/index.d.ts` line 283:

```ts
"experimental.session.compacting"?: (input: {
    sessionID: string;
}, output: {
    context: string[];
    prompt?: string;
}) => Promise<void>;
```

Again the name is V1-only. The capability is not. `@opencode/plugin` 2.0.26
`dist/promise/session.d.ts` lines 36-45:

```ts
export interface SessionCompactionResult {
    summary: string;
    providerState?: SessionMessage.ProviderState;
    metadata?: Record<string, unknown>;
    tokens?: TokenUsage.Info;
}
export interface SessionCompaction extends SessionContext {
    /** Set to use this compaction and skip the model request. */
    result?: SessionCompactionResult;
}
```

with `readonly compaction: SessionCompaction;` at line 131. A plugin registered
on `ctx.session.hook("compaction", …)` can set `event.result` to bypass the
compaction model call entirely, and can push onto the inherited
`event.system` / `event.messages` arrays.

**Consequence for `preCompact`.** Portable, and with more power than V1. V2
carries the transcript as a structured `messages: Array<Message>` array instead
of a `context: string[]`, so the handoff goes in as a system part or message
rather than a raw string, and the handoff file write is unchanged.

### 3. "Tool output is no longer a mutable `{ title, output, metadata }`"

**Partially wrong, and the part that is wrong matters.** The V1 declaration,
installed 1.18.34 `dist/index.d.ts` line 235:

```ts
"tool.execute.before"?: (input: { tool: string; sessionID: string; callID: string },
                        output: { args: any }) => Promise<void>;
"tool.execute.after"?: (input: { tool: string; sessionID: string; callID: string; args: any },
                       output: { title: string; output: string; metadata: any }) => Promise<void>;
```

The V2 hook names are different but the mutability claim does not hold. From
`@opencode/plugin` 2.0.26 `dist/promise/tool.d.ts` lines 30-52:

```ts
interface ToolHooks {
    readonly "execute.before": {
        tool: string;
        readonly sessionID: Session.ID;
        readonly agent: Agent.ID;
        readonly messageID: SessionMessage.ID;
        readonly id: Tool.CallID;
        input: unknown;
    };
    readonly "execute.after": {
        readonly tool: string;
        readonly sessionID: Session.ID;
        readonly agent: Agent.ID;
        readonly messageID: SessionMessage.ID;
        readonly id: Tool.CallID;
        readonly input: unknown;
    } & ({
        readonly status: "completed";
        result: Tool.Result;
    } | {
        readonly status: "error";
        error: Tool.Error;
    });
}
export interface ToolDomain {
    readonly transform: Transform<ToolEditor>;
    readonly reload: () => Promise<void>;
    readonly list: () => Promise<readonly (Info & { readonly id: string })[]>;
    readonly hook: Hooks<ToolHooks>;
}
```

So `execute.before` gives a mutable `input` (readable and writable — the field is
not `readonly`), and `execute.after` gives a discriminated
`{ status, result | error }` union where `result` is a mutable `Tool.Result`. `Tool.Result` from
`@opencode/schema@2.0.26` `dist/tool.d.ts` is:

```ts
export interface Result<Output extends ValueSchema<any> | undefined = …> {
    readonly output?: OutputValue<Output>;
    readonly content?: string | ReadonlyArray<Content>;
    readonly metadata?: Metadata;
}
```

The union is the real difference: there is no single mutable output object, and
a guard must branch on `status` and, for `"error"`, has only `Tool.Error` to
read. The "read-only" claim in the module header is right about the *shape* and
wrong about the *writability*.

**Consequence for the three tool-output guards.** All three are portable:

- `typescriptCheck` and `prettierFormat` register the V2 `execute.after` hook
  and write to `event.result.content` or `event.result.metadata`. Both are
  declared and mutable. The V1 `output.output: string` becomes a
  `content: string | ReadonlyArray<Content>` — the guard line is rewritten as a
  text `Content`, which is a small, well-defined change.
- `longRunningProcessGuard` reads the mutable `event.input` at
  `execute.before`. Its V1 blocking behaviour — throwing to abort the tool call —
  is **not** portable. V2's `execute.before` has no throw-to-block channel
  declared in the promise API. The nearest declared mechanism is the effect-API
  `Hooks<Spec, Failures>` in `dist/effect/registration.d.ts`, which types a
  per-hook failure channel — but the repo is on the promise API, so that is out
  of reach without a second module surface. The guard can still *write* its
  verdict into `event.input`, but cannot abort the call.

## Per-callback verdict

| Callback | V1 surface | V2 equivalent | Evidence | Consequence |
|---|---|---|---|---|
| `sessionStart` | `experimental.chat.system.transform` | `ctx.session.hook("context", …)`, push `SystemPart` onto `event.system` | `@opencode/plugin` 2.0.26 `dist/promise/session.d.ts` lines 22, 29, 129; `@opencode/ai` `messages.d.ts` line 12 | **FOUND.** Portable with a per-call granularity change |
| `preCompact` | `experimental.session.compacting` | `ctx.session.hook("compaction", …)`, set `event.result` / push onto `event.system` | same file, lines 36, 42, 131 | **FOUND.** Portable; more power than V1 |
| `sessionEnd` | `event` | `ctx.event.subscribe(…)` | `@opencode/plugin` 2.0.26 `dist/promise/event.d.ts`: `EventDomain extends Pick<EventApi, "subscribe">`. `@opencode/schema@2.0.26` `session-event.d.ts` declares `"session.deleted"` (line 17 region), `"session.usage.recorded"`, and `"session.execution.succeeded"`/`"session.execution.interrupted"`; the literal `"session.idle"` is **not** declared | **FOUND with a rename.** `session.deleted` and the execution-terminal events are declared; the V1 `session.idle` literal is not. Port must remap the end detection |
| `longRunningProcessGuard` | `tool.execute.before` (throws to block) | `ctx.tool.hook("execute.before", …)` — reads and writes `event.input`, **cannot throw to block** | `@opencode/plugin` 2.0.26 `dist/promise/tool.d.ts` line 30; V1 block path `arsenal.ts` line 1518 `throw new Error(guardBlockMessage(segments))`; V2 failure typing only in `dist/effect/registration.d.ts` | **PARTIAL.** Verdict writes in; aborting the call does not |
| `typescriptCheck` | `tool.execute.after` (appends to `output.output`) | `ctx.tool.hook("execute.after", …)` branch on `status`, write `event.result.content` / `.metadata` | `tool.d.ts` lines 38-52; `@opencode/schema` `dist/tool.d.ts` `Result` | **FOUND.** Portable with a `string` → `Content` change |
| `prettierFormat` | `tool.execute.after` (appends to `output.output`) | as above | as above | **FOUND.** Portable with a `string` → `Content` change |
| `docsDisciplineGuard` | `tool.execute.before` (throws to block) | as `longRunningProcessGuard` | `arsenal.ts` line 1558 `throw new Error(guardDocsMessage(…))` | **PARTIAL.** Verdict writes in; blocking does not |
| `taskDispatcher` | `chat.message` | `ctx.session.hook("prompt", …)` | already ported, see [16-TASK-DISPATCH.md](16-TASK-DISPATCH.md) | Done |

Three of the eight — `sessionStart`, `preCompact`, `sessionEnd` — land on the
**session** domain (`ctx.session.hook`), which is the domain the repo already
uses for the one working hook. Three land on the **tool** domain
(`ctx.tool.hook`), which is a new domain the repo has never touched. Those two
facts are the whole shape of the remaining work.

## Where the existing claim is wrong

Three statements in the current documentation and in the module header are
inaccurate against the published V2 API, and this document supersedes them.

The module header states that V2 "has no equivalent of V1's
`experimental.chat.system.transform`, `experimental.session.compacting` or
mutable `tool.execute.*` output". The first two names are indeed absent, but
`SessionContext.system` and `SessionCompaction.result` are direct counterparts,
and `Tool.Result` is mutable. The claim that "tool output is no longer a mutable
`{ title, output, metadata }`" is right about the shape and wrong about
writability — `result`, `content` and `metadata` are all declared writable on
`execute.after`, and `input` is writable on `execute.before`.

`docs/16-TASK-DISPATCH.md` repeats the same three bullets under "Why this hook
migrated and the other six did not". Its reading that "a guard whose whole job
is appending a warning line to tool output has no correct V2 landing site" is
not supported by the types: `ctx.tool.hook("execute.after")` is such a site.

To be fair to the claim, the reason it survived is that the *installed* types
do not contradict it. The repo pins `@opencode-ai/plugin` 1.18.34, whose
`dist/v2/promise/context.d.ts` exposes no `session`, `tool` or `event` domain —
so a reader who checks only what is installed finds nothing, and reasonably
concludes nothing is there. The gap is in the dependency pin, not only in the
documentation. `@opencode/plugin` 2.x is a different package, and the file
header cites it as the mirror source, but nothing in the repo installs or
type-checks against it.

## What porting would require, precisely

Not implemented here. This is the shape of it, for whoever owns
`.opencode/plugin/arsenal.ts`.

The module needs a V2 `Context` mirror covering `session`, `tool` and `event`
in addition to `location` and `session.prompt`. `sessionStart` registers
`ctx.session.hook("context", …)` and pushes an `SystemPart`; `preCompact`
registers `ctx.session.hook("compaction", …)` and sets `event.result`;
`typescriptCheck` and `prettierFormat` register `ctx.tool.hook("execute.after", …)`
and branch on `event.status`; `longRunningProcessGuard` and
`docsDisciplineGuard` register `ctx.tool.hook("execute.before", …)` and record
their verdict into `event.input`.

The two real design decisions, neither of which this document resolves:

1. **The blocking pair loses its teeth.** `longRunningProcessGuard` and
   `docsDisciplineGuard` currently abort a tool call by throwing. V2 offers no
   declared throw-to-block on the promise API. Under V2 both become
   advisory — they can still write a verdict the model will see in the tool
   input, and both currently contribute to the circuit breaker and the
   session's recorded guard outcomes, so that bookkeeping survives. But a user
   who set `docsGuard.mode: "block"` gets warn-and-continue on a V2 host. That
   is a silent policy downgrade and it must be either stated in the docs or
   blocked on by a check.
2. **The context hook fires per model call.** V1's system-transform fired once
   per session and the anchor was cached per `sessionID`. The V2 `context` hook
   runs for every model request, so the anchor build is re-entered per call.
   The existing `ctx.anchors` cache plus the 10-second budget is what keeps
   that off the first-token path, and it is already built — but the port must
   decide whether to push the anchor on every context hook or to latch it, and
   that is a behavioural choice, not a mechanical translation.

## Verdict

**Portable, and the claim that it is not is wrong.** Every one of the eight
callbacks has a declared V2 landing site in `@opencode/plugin` 2.x. Six of them
translate with a shape change and no loss of function. Two — the blocking pair —
translate with a genuine loss of function, because V2 does not give a promise-
API plugin a way to abort a tool call.

The honest statement of the gap is therefore narrower than the one currently
written. It is not "V2 has no equivalent surface". It is:

- V2 landing sites exist for all seven, on the `session` and `tool` domains.
- Two guards lose their blocking behaviour, which is a real regression and the
  only substantive argument for keeping them on V1.
- Nothing in this repository installs or type-checks against
  `@opencode/plugin` 2.x, so any port is written blind until the pin changes —
  and the pin is what made the "no equivalent" reading look correct.

One further thing is unverified and is stated as such rather than guessed:
whether the installed `@opencode-ai/plugin@1.18.34` V1 `Hooks` interface is
byte-for-byte the surface the V1 runtime actually dispatches. The installed
`.d.ts` is the strongest evidence available on this machine, and it is used here
as the source for every V1 signature quoted, but it is a published type
declaration, not the running binary's behaviour.

## Consequences for the lock and the kit

The census does not change from research. `task-dispatcher` is still one `hook`
component among seven, still `tier core` at `phase scout`, and the lock still
holds the counts recorded in [09-KIT-LOCK.md](09-KIT-LOCK.md) and
[16-TASK-DISPATCH.md](16-TASK-DISPATCH.md). Porting a guard to a different API
is not a new component, and nothing in this document may be read as proposing
one. If a port lands, the registry entry's `verification` field stays
`unverified` unless the install command is separately verified — which, for a
callback that already lives inside the plugin, there is none to verify.
