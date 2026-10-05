# Task Dispatch

`task-dispatcher` is the seventh hook in the kit and the only one that speaks
on every user message. It is a plugin callback, not a skill: it injects one
short instruction that forces the turn to name which of five task scenarios it
is before any work starts, then points at the Vanguard skill, which already
owns what to do about that answer.

**This hook targets OpenCode V2.** It is registered from the plugin module's
`setup()` surface — the V2 contract the plugin file mirrors from
`@opencode/plugin` 2.0.22 — against the session `prompt` hook, with
`ctx.session.hook("prompt", handler)`, and it mutates `event.prompt.text` in
place. It was previously bound to the V1 `chat.message` event, which needs
OpenCode V1 `>= 1.18.29`; that floor now applies only to the hooks that stayed
behind, named under
[The six hooks that did not migrate](#the-six-hooks-that-did-not-migrate).

It lives in `.opencode/plugin/arsenal.ts` as `export const taskDispatcher`,
because OpenCode has no standalone hooks directory — see
[03-ARCHITECTURE.md](03-ARCHITECTURE.md). Its identity in the Registry and in
the lock is `task-dispatcher`, unprefixed like every other hook id here; the
`vantrilex-` prefix is reserved for the three top-level skills.

| Field | Value |
|---|---|
| Registry id | `task-dispatcher` |
| Kind | `hook` |
| Function | `taskDispatcher` in `.opencode/plugin/arsenal.ts` |
| Runtime surface | OpenCode V2, `setup()` |
| Hook | session `prompt`, registered with `ctx.session.hook("prompt", …)` |
| Writes to | `event.prompt.text`, mutated in place |
| `phase` | `scout` |
| `tier` | `core` |
| `install_cmd` | null — it ships inside this plugin, nothing to install |
| `verification` | `unverified` |

The null command is not a gap. A hook that already lives in the plugin file
has no install command to verify, and the schema forbids claiming `verified`
while `install_cmd` is null — see
[06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md).

## The six hooks that did not migrate

Read this before assuming the plugin's guards all run. `task-dispatcher` is
the **only** hook on the V2 surface. The other six locked hooks — `sessionStart`,
`preCompact`, `sessionEnd`, `longRunningProcessGuard`, `typescriptCheck`,
`prettierFormat` — plus the `docsDisciplineGuard` that ships beside them are
still registered from the V1 `server()` surface, and under OpenCode V2 they are
**inert**: a V2 runtime reads `id` and `setup()` from the module and never
dispatches a V1 plugin function, so those seven callbacks never fire. They are
not failing guards and not degraded ones — they are never invoked.

That gap is deliberate and unfinished, not a completed port. Porting the six
means reworking what each guard writes and how it reads a verdict, which is a
separate concern from migrating the user-message hook and was deliberately not
bundled into it.

The module default-exports one object carrying both surfaces, because the two
runtimes read disjoint halves of it:

| Runtime | Reads | Ignores |
|---|---|---|
| OpenCode V2 | `id` and `setup()` | `server()` |
| OpenCode V1 `>= 1.18.29` | `server()` | `setup()` |

A function export would be loadable by V1 only. The object form is what lets
both halves live in one module without either runtime loading a hook it has no
way to fire.

## The hook it binds to, and why that one

The hook is the V2 session `prompt` hook, which fires once during admission of
a user message and hands the hook an owned draft of that prompt. The V2 guide
states that edits to it "become the canonical persisted user input", so the
append reaches the model exactly as the V1 push did — by a different route, to
the same place.

Why this hook migrated and the other six did not is the shape of the V2 API.
V2 offers no equivalent of three things the V1 guards were written against:

- there is no `experimental.chat.system.transform`, so nothing can rewrite the
  system prompt;
- there is no `experimental.session.compacting`, so nothing can observe
  compaction;
- tool output is no longer a mutable `{ title, output, metadata }` a guard can
  append to. V2's `execute.after` reports a discriminated
  `{ status, result | error }` union, and V2's `context` hook takes a
  `SystemPart[]` where V1's system transform took a `string[]`.

A guard whose whole job is appending a warning line to tool output has no
correct V2 landing site yet, because the shape it would have to write into
changed underneath it. Registering a stub that fired and did nothing would
report coverage the module does not have, so those six stayed on the V1 surface
instead of pretending.

What is left is a *user-message* write surface, and `prompt` is it. The seventh
hook needed a place to put text into a turn, and V2 still provides exactly one.

The event granularity is the task boundary, under both surfaces. Under V1,
`chat.message` fired when a user message was admitted and the runtime re-read
`output.parts` afterwards; under V2 the `prompt` hook fires "once during
admission, not before every model call". Neither can be re-triggered from
inside a task, because a phase transition is an assistant reply plus tool calls
— reported under V2 as `context` hooks and event-stream traffic — and never as
prompt admission. Choosing this event is therefore what makes the instruction
fire once per task rather than once per tool call, without any bookkeeping.

Three details of the wiring matter, and the first one differs from V1:

- The instruction is **appended to `event.prompt.text`** after a blank line,
  behind the user's own words. V1 pushed a synthetic `{ type, text }` part onto
  `output.parts`, so the instruction sat *beside* the user's message; under V2
  it sits inside the user's own message, because that is the only writable
  field the hook event carries. Ordering is unchanged — still after the user's
  text, still ahead of the model's work.
- The append goes at the end, never the front. V2 requires attachment `mention`
  offsets to be updated or removed when prompt text is rewritten, and appending
  shifts no offset, so `@file` references survive by construction. Prepending
  would force every mention offset to be renumbered or dropped.
- The handler returns early on a draft whose text is empty, so an
  attachment-only turn is not classified from nothing. An empty prompt carries
  no intent to classify, and injecting five lines into it would add cost and
  teach the model nothing.

It also captures the user's own intent into session state *before* the rewrite,
so `lastIntent` stays the user's words and never records the injected
instruction as something the owner typed.

There is deliberately no per-session "already dispatched" flag. Every user
message may be a new task, a continuation, or a modification, so the
classification has to be present on each of them; a once-per-session latch
would suppress the instruction on exactly the messages that need it. The one
guard that is kept is idempotence within a single turn: the draft is one
string, so after one append the instruction is present verbatim and a second
pass finds it.

## The five scenarios

| # | Scenario | What it commits the turn to |
|---|---|---|
| 1 | NEW TASK | Nothing is in flight: dispatch from scratch |
| 2 | CONTINUATION | The open task is unchanged: say nothing, change nothing |
| 3 | TASK MODIFICATION | The open task changed: re-dispatch, state what changed |
| 4 | CONTINUATION WITH MODIFICATION | Completed phases stay locked; re-plan only what has not run |
| 5 | CONTINUATION WITH NEW TASK | Checkpoint and park the open task; dispatch the new one as its own lane |

What each scenario *does* once it has been chosen is Vanguard's, not this
file's. The hook names the scenario and names where the answer lives; the
procedure for all five lives in the Task dispatch section of
`.opencode/skills/vantrilex-vanguard/SKILL.md`, which is its single home. This
document deliberately does not restate it — a second copy of a procedure drifts
from the first, and the first is the one an agent loads.

Scenario 2 is the one that reads like a bug in the injection: its correct
output is silence. A continuation that re-announces a plan burns context and
teaches the owner that dispatch is noisy.

## The compact injection

The injected text is five lines, built as the `TASK_DISPATCH_INSTRUCTION`
constant in the plugin file. The shape is:

```text
[arsenal] task-dispatcher: classify this prompt into exactly one scenario and
run that scenario's playbook in the vantrilex-vanguard skill; if the prompt is
genuinely ambiguous, ask the user one short clarifying question before
proceeding.
1 NEW TASK … 2 CONTINUATION … 3 TASK MODIFICATION …
4 CONTINUATION WITH MODIFICATION …
5 CONTINUATION WITH NEW TASK …
```

The budget is five lines — 780 characters — not five paragraphs, and the reason
is arithmetic: this instruction is re-sent on every single prompt, so its cost
is paid again each time. Each scenario gets one line carrying its single
obligation, and the procedure is deferred to the skill that already owns it. A
longer injection would not add behaviour, only tokens per prompt.

The text is deliberately unadorned, and that is where the V1 and V2 shapes
differ. V1 pushed the minimal `{ type, text }` shape and let the runtime own
message identity and timestamps when it re-read the array, because a synthetic
part carrying its own id would misreport the injection as something the owner
typed. Under V2 there is no part to shape: the instruction is appended to the
owner's own draft, so it carries no identity of its own either way. The
migration changes where the text lands, not what it says — five lines,
780 characters, same five scenarios.

## The kill switch

`taskDispatcher.enabled` in `.opencode/arsenal.json`, default `true`:

```json
{
  "taskDispatcher": {
    "enabled": false
  }
}
```

The config root resolves from `ctx.location.directory`, with the working
directory as the fallback, so the file is read from `.opencode/arsenal.json`
under the project the plugin instance was loaded for.

Setting it to `false` stops the injection and nothing else. The configuration
reader resolves each section independently, so a file that sets only
`taskDispatcher` still honours the docs-guard defaults, and a file that sets
only `docsGuard` still honours this switch — a combined early return would drop
the switch exactly in the file a user edits to turn one hook off.

The switch exists because the instruction is a behavioural policy, not a guard:
it blocks nothing, it only tells the model to classify the turn. A user who
disagrees with that policy can turn it off without unpacking the plugin.

## Its place against Vanguard's Task dispatch

The hook is the trigger; Vanguard's Task dispatch section is the response. The
hook fires before Vanguard is loaded, names one of five scenarios, and stops.
Vanguard then owns the single decision dispatch makes — which locked components
are injected in which phase — read from the `phase` field of every entry in
`kit/kit.lock` at dispatch time. The lock entry for this hook carries
`phase scout`, so it sits in the scout lane beside `session-start`,
`vantrilex-prime` and `vantrilex-vanguard`, and it is injected with them
rather than held across later phases.

That separation is the point. A hook that also carried the phase-kit map would
be a second home for the plan, and the two copies would disagree the first
time the lock changed. Nothing here injects a component, ranks a phase, or
restates Doctrine's phase map.

Verification of the wiring is mechanical and lives in
[08-VERIFICATION.md](08-VERIFICATION.md): `node scripts/verify-kit.mjs`
resolves every locked hook id against a registered function in the plugin file
and fails when one does not, and the lock-versus-catalog check requires the
two records to agree on `kind`, `phase`, `tier`, `install_cmd` and
`verification`. The census that follows from this entry is in
[09-KIT-LOCK.md](09-KIT-LOCK.md).

The migration to V2 changed which runtime surface registers this hook, not what
the lock records. `task-dispatcher` is still `tier core` at `phase scout`, and
the lock still holds 52 components — 36 `core` plus 16 `conditional`, 0 pending
— of which 7 are hooks. A guard moving onto a different API is not a new
component, and nothing here may be read as one.
