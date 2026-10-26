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

`setup()` registers **five hook names**; seven guards plus one append-only
rewrite sit behind them.

| Hook | Registered behaviour |
|---|---|
| session `prompt` | `taskDispatcher`, then the plan-guard append |
| tool `execute.before` | `diffSizeGuard`, `longRunningProcessGuard`, `docsDisciplineGuard` |
| shell `create.before` | `longRunningProcessGuard`, `docsDisciplineGuard` |
| tool `execute.after` | `typescriptCheck`, `prettierFormat` |
| permission `evaluate` | `seatDenyOverlay` |

The `execute.after` guards are conditional and append verdicts; they never
throw. The shell `create.before` event carries no session id, so its outcomes
are recorded under `anonymous` by design.

The fifth hook is `permission.hook("evaluate")`, carrying `seatDenyOverlay`: it is
the only registration in this module that binds a permission decision, and it
registers only when the host exposes the evaluate registrar. The overlay itself is
in the seat-deny section below.

## V1 hook registration, and the V2 gap

`server()` carries the eight hooks in this table. Three of them are inert under V2:

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

## Seat-deny overlay (deny-only)

`setup()` registers `permission.hook("evaluate")`, carrying `seatDenyOverlay`.
It exists because the seat files declare their rules under `permissions:`
(plural) as a list — 26 of the 28 agent files — while the host evaluates only the
singular `permission:` map. The declaring files also carry agent fields such as
`name:` and `temperature:`, so the block is demoted to an agent option and
forwarded to the provider instead of reaching the permission engine; this is the
recorded cause (a) of RUN-0.9.0-FIX. Rewriting the seat files belongs to a
separate concern, so the overlay reads the shipped plural shape at the one
mutable surface.

The overlay is deny-only by construction:

| Host effect on entry | What the overlay may do |
|---|---|
| `deny` | nothing: an explicit configured deny is final and never reaches the hook |
| `ask` | flip to `deny` when the seat's last matching rule denies; never to `allow` |
| `allow` | flip to `deny` when the seat's last matching rule denies; never to `allow` |

It never grants, never relaxes an `ask`, never raises an `allow` to `ask`, and
never rewrites a host `deny`. A call with no matching rule, an unknown agent, or
a seat that declares no block keeps the host effect exactly as produced, so no
overlay path can widen a lane. A singular `permission:` block is treated as no
block: the host already evaluates that shape, and overlaying it would apply the
same rules twice.

Resolution follows the file: for each requested resource the last matching rule
wins, `*` matches any run of characters, and a deny on any one resource denies
the call. An `action: "_"` rule — the shipped `resource: context7_*` namespace
form — matches any action and matches its resource pattern against the action
name. An evaluation with an empty action or no resources has nothing to match and
is left unchanged.

Malformed input fails closed; absent input does not:

| Observed | Effect |
|---|---|
| seat file missing | untouched: nothing is declared to enforce |
| seat file exists but cannot be read | `deny`, with the agent and the read failure in the message |
| `permissions:` block malformed: inline value, unknown or duplicate key, unreadable entry, no rules, missing `action` or `resource`, invalid `effect` | `deny`, with the parse reason in the message |
| no `permissions:` block, or a singular `permission:` block | untouched |
| agent id that is not a plain file stem | ignored: it is never turned into a path, and resolution continues with the session lookups |

The agent is resolved in one strict order — the evaluation's optional `agent`
field, then `ctx.session.get`, then the observed-event cache — and a call where
none of the three names an agent is left alone rather than guessed.

Kill switch: the callback checks it at its head like every other registered
callback, so the four per-project signals disable the overlay with the rest of the
module. When the host exposes no `ctx.permission.hook`, the registration is
skipped and never faked: the capability probe records the absence, and its
fallback line states that the host policy stands.

### Dispatcher reconciliation

The overlay and the dispatcher change together because either alone is a defect.
The `vantrilex` seat denies `skill: *` and repeats the deny for
`vantrilex-vanguard`, so an unconditional order to load that playbook orders a
denied call. Before the overlay the declaration was inert; with the overlay the
deny is enforced, so the dispatcher's first line now reads "run that scenario's
playbook in the vantrilex-vanguard skill when the seat allows it; if the seat
denies the skill, record it and apply the rule". The probe holds the pair:
`SEAT dispatcher no longer orders a denied skill`.

## Six-hook capability probe (م-3)

`setup()` inspects the context it was handed and reports one line per documented
hook — `sessionStart`, `preCompact`, `sessionEnd`, `model.request`,
`ctx.permission`, `ctx.storage` — plus a deterministic gate line. It registers
nothing and never claims a hook it did not observe:

- `model.request` is available only when `ctx.model.hook` is a function.
- `ctx.permission` is available only when `ctx.permission.hook` is a function;
  when it is, the seat-deny overlay registers `evaluate` on it, and when it is
  not, the overlay is skipped and the host policy stands.
- `ctx.storage` is available only when it exposes `get` and `set`.
- The three lifecycle hooks are reported absent under V2, where the session
  scope exposes `prompt` only and the V1 callbacks are inert.

The six counted here are the documented host hooks, not the five registered hook
names above: `ctx.permission` is one documented hook, and it now carries one
registration.

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

`node scripts/verify-catalog.mjs` runs `loadability/hooks`, which maps every
`hook` row to its exported, wired function in `arsenal.ts` and fails when a
function is not registered. See `02-SCRIPTS-VERIFY.md`.

`node .opencode/plugin/arsenal.findings-probe.mjs` carries the behavioural
battery, including the merge, probe, kill-switch, diff-guard and seat-denial
cases. It exits 0 only when every case passes.
