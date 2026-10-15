# 01 — Plugin Surfaces

The runtime behaviour of the Arsenal is one TypeScript module plus a V2-only
carrier that wraps it. There is no hooks directory: OpenCode hooks are plugin
callbacks, so every guard lives in a plugin file.

## The files

| File | Role |
|---|---|
| `.opencode/plugin/arsenal.ts` | The guard module. Both surfaces. |
| `.opencode/plugins/vantrilex-guards.ts` | V2-only carrier wrapping it |
| `.opencode/plugin/arsenal.findings-probe.mjs` | Probe battery over it |

`arsenal.findings-probe.mjs` is a test, not a plugin: it runs with
`node .opencode/plugin/arsenal.findings-probe.mjs`, exits 0 when every probe
passes, keeps scratch state under the OS temp area, and reads the repository
without writing to it. It has no side effects on import, so a runtime that
imports every file in the plugin directory finds an inert module there.

## Dual-surface architecture

`arsenal.ts` default-exports **one** object carrying both surfaces, because the
two runtimes read disjoint parts of it:

- V1 reads `server()` and ignores the rest.
- V2 reads `id` plus `setup()` and never invokes a V1 plugin function.

That is why a single module can serve both without a compatibility shim. The
module obeys three rules without exception: zero dependencies beyond Node
built-ins, every guard degrades to SKIPPED with a stated reason rather than
crashing a session or reporting PASS for work it did not do, and nothing is
written outside the resolved state directory.

`@opencode-ai/plugin` is injected by the runtime and is not installed here, so
the published `Hooks` interface is mirrored structurally in the file instead of
imported. A literal import would fail `tsc --noEmit` in this dependency-free
checkout.

## V2 hook registration

`setup()` registers **four hook names**; five guards sit behind them.

| Hook | Guards registered on it |
|---|---|
| session `prompt` | `taskDispatcher` |
| tool `execute.before` | `longRunningProcessGuard`, `docsDisciplineGuard` |
| shell `create.before` | `longRunningProcessGuard`, `docsDisciplineGuard` |
| tool `execute.after` | `typescriptCheck`, `prettierFormat` |

The `execute.after` guards are conditional and append verdicts; they never
throw. The shell `create.before` event carries no session id, so its outcomes
are recorded under `anonymous` by design.

## V1 hook registration, and the V2 gap

`server()` carries all eight logical hooks. Three of them are inert under V2:

| Function | V1 callback | Under V2 |
|---|---|---|
| `sessionStart` | `experimental.chat.system.transform` | inert |
| `preCompact` | `experimental.session.compacting` | inert |
| `sessionEnd` | `event` | inert |
| `longRunningProcessGuard` | `tool.execute.before` | ported |
| `typescriptCheck` | `tool.execute.after` | ported |
| `prettierFormat` | `tool.execute.after` | ported |
| `docsDisciplineGuard` | `tool.execute.before` | ported |

The gap is deliberate, not unfinished: V2's `context` hook takes a
`SystemPart[]` where V1's transform took a `string[]`, and V2's `compaction`
hook takes an optional result object where V1 appended to a `context: string[]`.
Porting those three means reworking what each guard writes, which the module
records as a separate concern. `docsDisciplineGuard` is a guard but not a lock
component.

## The V2-only carrier

`.opencode/plugins/vantrilex-guards.ts` imports `definePlugin` and the default
plugin from `../plugin/arsenal.ts` and passes the host context straight through
to the proven `setup()`. It re-implements nothing. It declares its own hook
census, drops the V1 surface on purpose, and never touches `ctx.permission`,
because the owner policy is allow-all and a permission hook is forbidden.

It keeps the `.ts` extension on its relative import on purpose: Node's type
stripping resolves the sibling only in that form.

**Coexistence.** V2 discovers local plugins from both `.opencode/plugin/` and
`.opencode/plugins/`, so a host that loads both files registers the same four
hooks twice, in plugin order. The observed effects are benign: the dispatcher
append is idempotent, a blocking before-guard throws in the first hook so the
second never runs, and a warn-mode line may appear twice. No dedupe logic is
added, because the duplication degrades to noise and never to a false PASS.

## What proves this

`node scripts/verify-kit.mjs` runs `per-kind/hooks`, which maps every locked
`hook` id to its exported function in `arsenal.ts` and fails when a function is
not registered. See `02-SCRIPTS-VERIFY.md`.
