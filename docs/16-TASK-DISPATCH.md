# Task Dispatch

`task-dispatcher` is the seventh hook in the kit and the only one that speaks
on every user message. It is a plugin callback, not a skill: it injects one
short instruction that forces the turn to name which of five task scenarios it
is before any work starts, then points at the Vanguard skill, which already
owns what to do about that answer.

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
| Event | `chat.message` |
| `phase` | `scout` |
| `tier` | `core` |
| `install_cmd` | null — it ships inside this plugin, nothing to install |
| `verification` | `unverified` |

The null command is not a gap. A hook that already lives in the plugin file
has no install command to verify, and the schema forbids claiming `verified`
while `install_cmd` is null — see
[06-REGISTRY-SCHEMA.md](06-REGISTRY-SCHEMA.md).

## The event it binds to, and why that one

`chat.message` fires when a user message is admitted, and the runtime re-reads
`output.parts` afterwards, so a part pushed into that array genuinely reaches
the model. It is also the only per-turn write surface in this hook API: an
event callback observes, `chat.message` is the one place a plugin can add text
to the turn that is about to run.

The event granularity is the task boundary. Nothing inside a task can
re-trigger the hook, because a phase transition is an assistant reply or a tool
call, and those arrive as `message.updated` or `tool.execute.*` — not as
user-message admission. Choosing this event is therefore what makes the
instruction fire once per task rather than once per tool call, without any
bookkeeping.

Two details of the wiring matter:

- The handler captures the user's own intent into session state *before* it
  calls the dispatcher, so `lastIntent` stays the user's words and never
  records the injected instruction as something the owner typed.
- The handler returns early on a message whose extracted text is empty, so an
  attachment-only turn is not classified from nothing.

There is deliberately no per-session "already dispatched" flag. Every user
message may be a new task, a continuation, or a modification, so the
classification has to be present on each of them; a once-per-session latch
would suppress the instruction on exactly the messages that need it. The one
guard that is kept is idempotence within a single parts array, because the
runtime may re-present the same output object.

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

The budget is five lines, not five paragraphs, and the reason is arithmetic:
this instruction is re-sent on every single prompt, so its cost is paid again
each time. Each scenario gets one line carrying its single obligation, and the
procedure is deferred to the skill that already owns it. A longer injection
would not add behaviour, only tokens per prompt.

The pushed part is deliberately the minimal `{ type, text }` shape. The
runtime owns message identity and timestamps and fills them in when it re-reads
the array, and a synthetic part carrying its own id would misreport this text
as something the owner typed.

## The kill switch

`taskDispatcher.enabled` in `.opencode/arsenal.json`, default `true`:

```json
{
  "taskDispatcher": {
    "enabled": false
  }
}
```

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
