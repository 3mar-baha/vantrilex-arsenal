# 01 — Plugin Surfaces

The runtime behaviour of the Arsenal is **one** TypeScript module. There is no
hooks directory: OpenCode hooks are plugin callbacks, so every guard lives in a
plugin file.

## The files

| File | Role |
|---|---|
| `.opencode/plugin/arsenal.ts` | The guard module. Both surfaces, all hooks. |
| `.opencode/plugin/arsenal.findings-probe.mjs` | Probe battery over it |

`arsenal.findings-probe.mjs` is a test, not a plugin: it runs with
`node .opencode/plugin/arsenal.findings-probe.mjs`, exits 0 when every probe
passes, keeps scratch state under the OS temp area, and reads the repository
without writing to it. It has no side effects on import, so a runtime that
imports every file in the plugin directory finds an inert module there.

Exactly one plugin file exists. `.opencode/plugins/vantrilex-guards.ts` was the
V2-only carrier that wrapped this module for the plan-guard append; it is
retired, and the append now rides the same `prompt` registration as the task
dispatcher. One file means one emission set per tool call.

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

`setup()` registers **four hook names**; six guards plus one append-only
rewrite sit behind them.

| Hook | Registered behaviour |
|---|---|
| session `prompt` | `taskDispatcher`, then the plan-guard append |
| tool `execute.before` | `diffSizeGuard`, `longRunningProcessGuard`, `docsDisciplineGuard` |
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
| `diffSizeGuard` | `tool.execute.before` | ported |
| `typescriptCheck` | `tool.execute.after` | ported |
| `prettierFormat` | `tool.execute.after` | ported |
| `docsDisciplineGuard` | `tool.execute.before` | ported |

The gap is deliberate, not unfinished: V2's `context` hook takes a
`SystemPart[]` where V1's transform took a `string[]`, and V2's `compaction`
hook takes an optional result object where V1 appended to a `context: string[]`.
Porting those three means reworking what each guard writes, which the module
records as a separate concern. `docsDisciplineGuard` is a guard but not a lock
component.

## Plan-guard append (detective, non-blocking)

The `prompt` hook compares the dispatch brief against a plan excerpt attached to
the same prompt between `Plan-Doc-Begin:` and `Plan-Doc-End` markers. When a
brief identifier has no match in the plan, a dated `[plan-guard] plan-drift
report` is appended; the turn always proceeds. A prompt without both markers, or
one that already carries a report, is left untouched, so the append is
idempotent within a turn.

This is the fallback P1-R0.md verdict (1) requires: the prompt hook exposes no
typed rejection API for prompt admission, so enforcement stays with
leader-discipline plus the Verifier gates, never with this hook.

## Six-hook capability probe (م-3)

`setup()` inspects the context it was handed and reports one line per documented
hook — `sessionStart`, `preCompact`, `sessionEnd`, `model.request`,
`ctx.permission`, `ctx.storage` — plus a deterministic gate line. It registers
nothing and never claims a hook it did not observe:

- `model.request` is available only when `ctx.model.hook` is a function.
- `ctx.permission` is available only when `ctx.permission.hook` is a function;
  the owner allow-all policy still forbids registering it.
- `ctx.storage` is available only when it exposes `get` and `set`.
- The three lifecycle hooks are reported absent under V2, where the session
  scope exposes `prompt` only and the V1 callbacks are inert.

The lines travel through the plugin logger where the host provides one and are
flushed once, on the first V2 `execute.after` result, which is the only visible
V2 surface.

## Per-project kill switch (م-4)

Every registered callback checks the kill switch at its head and no-ops all
behaviour when any signal is set:

| Signal | Read |
|---|---|
| `VANTRILEX_DISABLED=1` | per hook, from the environment |
| `vantrilex.enabled: false` in `.opencode/config.json` | at setup |
| this project in the global `excludedProjects` list | at setup |
| `.opencode/.vantrilex-disable` exists | per hook |

The global list is read from `$XDG_CONFIG_HOME/opencode/opencode.json`, falling
back to `$HOME/.config/opencode/opencode.json`. A missing, unreadable or
malformed signal file never disables anything: the switch fails towards armed,
like every other flag in the module.

## Diff Size Guard

`tool.execute.before` measures uncommitted work before write-capable calls
(`write`, `edit`, `patch`, `multiedit`, `create`, `apply_patch`, `bash`). Above
**120 changed lines or 4 changed files** since the last commit, it pushes one
blocking warning through `pendingWarnings` demanding verification plus an atomic
commit before new work. It warns once per HEAD: the same uncommitted pile does
not nag every call, and a commit re-arms it.

Facts come from the same git reader the session anchor uses: file count from
`git status --short` (untracked paths included), line count from
`git diff --numstat HEAD` (staged and unstaged tracked changes). Untracked files
therefore count toward the file ceiling and contribute no line count; their size
is not measured rather than guessed.

## What proves this

`node scripts/verify-kit.mjs` runs `per-kind/hooks`, which maps every locked
`hook` id to its exported function in `arsenal.ts` and fails when a function is
not registered. See `02-SCRIPTS-VERIFY.md`.

`node .opencode/plugin/arsenal.findings-probe.mjs` carries the behavioural
battery, including the merge, probe, kill-switch and diff-guard cases. It exits
0 only when every case passes.
