/**
 * Vantrilex Guards — V2-only guard carrier for OpenCode.
 *
 * This module registers exactly the documented V2 hook names listed below and
 * nothing else. Every hook it uses cites its docs section in the census; any
 * hook without a citation never ships here.
 *
 * Relationship to Stream G (`../plugin/arsenal.ts`): that module already
 * carries guards proven by a 45/45 probe battery. This module does not
 * reimplement them. It imports and wraps the proven V2 `setup`, so both files
 * arm the same guards with the same verdict text. One-line reason per guard:
 *
 *   - task dispatcher on session "prompt": proven per-turn instruction append
 *     that is idempotent within a turn and offset-safe by appending.
 *   - long-running-process guard plus docs-discipline guard on tool
 *     "execute.before": proven block/warn pair, including shell-text write
 *     recovery for the bash tool.
 *   - typescript-check plus prettier-format on tool "execute.after":
 *     proven conditional toolchain guards that append verdicts and never throw.
 *   - long-running-process guard plus docs-discipline guard on shell
 *     "create.before": proven coverage for raw shell executions, recorded
 *     under anonymous because the event carries no session id.
 *
 * Hook census (all sections on https://opencode.ai/v2/docs/build/plugins/):
 *
 *   KEPT (registered by the wrapped setup):
 *   - session "prompt" — docs section Sessions, Prompt admission.
 *   - tool "execute.before" — docs section Hooks, Tools (ToolHooks interface).
 *   - tool "execute.after" — docs section Hooks, Tools (ToolHooks interface).
 *   - shell "create.before" — docs section Hooks, Shell (ShellHookContext).
 *
 *   DROPPED (documented, but no Tier-0 guard lands there):
 *   - session "context" and "compaction" — docs section Sessions, Model
 *     requests. Stuffing guard verdicts into every model call would tax each
 *     request for no per-call decision; admission-time dispatch plus tool
 *     verdicts already cover the Tier-0 set.
 *   - session "generate", "title", "model.request", "http.request",
 *     "http.response", experimental websocket hooks, "retry" — same page.
 *     Enumerated so the omission is deliberate, not an oversight.
 *   - ctx.permission.hook("evaluate", ...) — documented in Permissions and
 *     the migrate-v1 mapping table, but forbidden by the owner allow-all
 *     policy. This module never touches ctx.permission, in code or by
 *     delegation: the wrapped setup registers no permission hook either.
 *   - ctx.storage — documented in Storage. Dropped with intent: the guards
 *     are stateless across runs by design, so no durable key is needed.
 *   - The V1 server() surface — migrate-v1 documents the dual-surface shape,
 *     but this module is V2-only on purpose. V1 stays served by arsenal.ts
 *     on its own path; this file carries no V1 hook name.
 *
 * Shape notes:
 *
 *   - The runtime-visible shape matches the documented contract exactly: a
 *     default export carrying `id` plus `setup`. The `Plugin.define` helper
 *     is the Stream-G-proven structural mirror, imported rather than
 *     redeclared, because the `@opencode/plugin` package is injected by the
 *     OpenCode runtime and is absent from this dependency-free checkout
 *     (only the V1 peer is vendored). A literal bare import would fail the
 *     load smoke and the type check in this repo while behaving identically
 *     under the host.
 *   - The relative specifier keeps its `.ts` extension on purpose. Node
 *     type-stripping resolves the sibling only in that form, while tsc under
 *     nodenext accepts it with allowImportingTsExtensions. This file sits
 *     outside the repo tsconfig `files` list, so the repo gate does not
 *     cover it; the equivalent strict check is run with that flag stated.
 *   - Plugin id is stable and distinct from the Stream-G id so status output
 *     and storage scoping identify this carrier on their own.
 *
 * Coexistence note: V2 discovers local plugins from both `.opencode/plugin/`
 * and `.opencode/plugins/`, so a host that loads arsenal.ts and this carrier
 * registers the same four hooks twice, in plugin order. Observed effects are
 * benign: the dispatcher append is idempotent so the second prompt hook sees
 * the instruction already present and skips; a blocking before-guard throws
 * in the first hook so the second never runs for violations; warn-mode lines
 * may appear twice on one tool result and the serialised type check may run
 * twice per edit. No dedupe logic lives here: silencing a sibling instance
 * from inside setup would be behaviour nobody can see, and the duplication
 * degrades to noise, never to a false PASS.
 */

import arsenalPlugin, {
  definePlugin,
  type PluginContextLike,
  type PluginDefinition,
} from "../plugin/arsenal.ts";

/**
 * V2 `setup`. Passes the host context through to the proven Stream-G setup
 * untouched: no adaptation, no extra registration, no permission access.
 * The four hooks named in the census above are the complete set this
 * registration can produce, because the delegated setup registers exactly
 * those four and the guards behind them degrade to no-ops only for the cases
 * their own comments name.
 */
const setup: PluginDefinition["setup"] = async (ctx: PluginContextLike): Promise<void> => {
  await arsenalPlugin.setup(ctx);
};

export default definePlugin({
  id: "vantrilex-guards",
  setup,
});
