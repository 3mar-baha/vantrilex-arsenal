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
 *   - plan-guard detective append on session "prompt" (this carrier only):
 *     validates the dispatch brief against the attached plan excerpt and
 *     appends a dated plan-drift report. Observation-only: the turn always
 *     proceeds, so no admission claim is made here (see the fallback note).
 *
 * Hook census (all sections on https://opencode.ai/v2/docs/build/plugins/):
 *
 *   KEPT (registered by the wrapped setup, plus the plan-guard prompt hook
 *   registered by this carrier below):
 *   - session "prompt" — docs section Sessions, Prompt admission.
 *   - session "prompt" (plan-guard detective append) — same docs section
 *     Sessions, Prompt admission. Rewrite-only: appends the drift report and
 *     always lets the turn proceed.
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
  type SessionPromptEvent,
} from "../plugin/arsenal.ts";

/**
 * V2 `setup`. Delegates to the proven Stream-G setup first (four hooks, no
 * adaptation, no permission access), then registers the plan-guard detective
 * append on session "prompt" (same docs section Sessions, Prompt admission).
 * The five registrations named in the census above are the complete set this
 * registration can produce, and every callback degrades to a no-op for the
 * cases its own comments name.
 *
 * Plan-guard fallback (detective-only, non-blocking): per P1-R0.md verdict (1)
 * the session prompt hook exposes no typed rejection API for prompt admission,
 * so this extension only observes the brief against the attached plan excerpt
 * and appends a dated plan-drift report; the turn always proceeds. Enforcement
 * stays with leader-discipline plus the Verifier gates, not with this hook.
 */
const setup: PluginDefinition["setup"] = async (ctx: PluginContextLike): Promise<void> => {
  await arsenalPlugin.setup(ctx);
  const sessionRegister = ctx?.session?.hook;
  if (typeof sessionRegister !== "function") return;
  await sessionRegister.call(ctx.session, "prompt", (event: SessionPromptEvent): void => {
    try {
      const draft = event?.prompt;
      const text = typeof draft?.text === "string" ? draft.text : "";
      if (text.length === 0) return;
      const annotated = appendPlanDriftReport(text);
      if (annotated === text) return;
      draft.text = annotated;
    } catch {
      return;
    }
  });
};

/* ===========================================================================
 * Plan-guard fallback: detective plan-drift append (non-blocking).
 *
 * Binding: P1-R0.md verdict (1) rules the hard admission gate IMPOSSIBLE on
 * the current host, so nothing here claims to refuse a brief. The functions
 * below compare the dispatch brief against the plan excerpt attached to the
 * same prompt and append a dated plan-drift report when brief identifiers
 * have no match in the plan. Findings are observations for the leader, never
 * verdicts, and the turn always proceeds.
 *
 * Prompt convention (attached by leader-discipline, read by `extractPlanDoc`):
 *
 *   Plan-Doc-Begin: <plan label, e.g. MISSION-PLAN.md>
 *   <actual plan doc lines, 1-based for citations>
 *   Plan-Doc-End
 *   <dispatch brief lines>
 *
 * A prompt without both markers is left untouched. A prompt that already
 * carries a report is left untouched, so the append stays idempotent within
 * a turn. An empty brief, an empty plan excerpt, and a brief whose tokens all
 * match are likewise left untouched.
 *
 * Minimal fixture (illustrative only — not a real plan doc; no AETHER
 * MISSION-PLAN sample exists in this checkout):
 *
 *   Plan-Doc-Begin: MISSION-PLAN.md
 *   Lane VTA-EXPANSION-05 phase P1 opens with node p1-r0.
 *   Node p1-planguard carries the detective plan-guard fallback.
 *   Plan-Doc-End
 *   Brief: lane VTA-EXPANSION-05 P1 node p1-planguard plus extra p9-nowhere.
 *
 * Expected: one finding for `p9-nowhere` on brief line 1, cited against
 * MISSION-PLAN.md lines 1-2, under a header carrying the UTC date.
 * ===========================================================================
 */

/** Tag heading every emitted report; also the idempotency marker. */
export const PLAN_DRIFT_TAG = "[plan-guard] plan-drift report";

/** Opening plan-attachment marker; the label follows the colon. */
export const PLAN_DOC_BEGIN = "Plan-Doc-Begin:";

/** Closing plan-attachment marker; the line must carry nothing else. */
export const PLAN_DOC_END = "Plan-Doc-End";

/**
 * The honestly-documented fallback: states the missing typed-rejection
 * surface and that enforcement is leader-discipline plus Verifier gates.
 */
export const PLAN_GUARD_FALLBACK =
  "Plan-guard fallback (detective-only, non-blocking): per P1-R0.md verdict (1) " +
  "the session prompt hook exposes no typed rejection API for prompt admission, " +
  "so this extension only observes the brief against the attached plan excerpt " +
  "and appends a dated plan-drift report; the turn always proceeds. Enforcement " +
  "stays with leader-discipline plus the Verifier gates, not with this hook.";

/** A plan excerpt with its real label, so citations point at file:line. */
export type PlanDoc = {
  readonly label: string;
  readonly lines: readonly string[];
};

/** One brief identifier with no match anywhere in the attached plan. */
export type PlanDriftFinding = {
  readonly briefLine: number;
  readonly briefToken: string;
  readonly planLabel: string;
  readonly planLinesChecked: number;
};

/** Identifier-shaped tokens: dash- or slash-joined runs carrying a digit. */
const IDENTIFIER_PATTERN = /[A-Za-z0-9]+(?:[-/][A-Za-z0-9]+)+/g;

/** Pure digit-and-dash runs (UTC dates, numeric ranges) are never findings. */
const DATE_LIKE_PATTERN = /^\d+(?:-\d+)+$/;

/**
 * Collects the distinct identifier tokens of a brief, in first-seen order.
 * Tokens without a digit are ordinary hyphenated words and are skipped, as
 * are date-like runs; both would otherwise read as drift on every brief.
 */
export const extractBriefTokens = (briefText: string): string[] => {
  if (typeof briefText !== "string" || briefText.length === 0) return [];
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const match of briefText.matchAll(IDENTIFIER_PATTERN)) {
    const token = match[0];
    if (!/\d/.test(token)) continue;
    if (DATE_LIKE_PATTERN.test(token)) continue;
    const key = token.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    ordered.push(token);
  }
  return ordered;
};

/**
 * Splits a prompt into its brief and its attached plan excerpt. Returns a
 * null plan when either marker is absent, so the caller stays silent then.
 */
export const splitBriefAndPlan = (promptText: string): { briefText: string; plan: PlanDoc | null } => {
  if (typeof promptText !== "string" || promptText.length === 0) return { briefText: "", plan: null };
  const lines = promptText.split("\n");
  const beginIndex = lines.findIndex((line) => line.trimStart().startsWith(PLAN_DOC_BEGIN));
  if (beginIndex < 0) return { briefText: promptText, plan: null };
  const endIndex = lines.findIndex((line, index) => index > beginIndex && line.trim() === PLAN_DOC_END);
  if (endIndex < 0) return { briefText: promptText, plan: null };
  const rawLabel = lines[beginIndex].slice(PLAN_DOC_BEGIN.length).trim();
  const label = rawLabel.length > 0 ? rawLabel : "plan-doc";
  const plan: PlanDoc = { label, lines: lines.slice(beginIndex + 1, endIndex) };
  const briefText = [...lines.slice(0, beginIndex), ...lines.slice(endIndex + 1)].join("\n");
  return { briefText, plan };
};

/**
 * Reports every brief token with no case-insensitive match in the plan,
 * citing the brief line of first sighting and the plan line range checked.
 * An empty plan excerpt yields no findings: drift cannot be judged without it.
 */
export const detectPlanDrift = (briefText: string, plan: PlanDoc): PlanDriftFinding[] => {
  const findings: PlanDriftFinding[] = [];
  if (plan === null || plan === undefined) return findings;
  if (plan.lines.length === 0) return findings;
  const haystack = plan.lines.join("\n").toLowerCase();
  const briefLines = briefText.split("\n");
  for (const token of extractBriefTokens(briefText)) {
    const lowered = token.toLowerCase();
    if (haystack.includes(lowered)) continue;
    let briefLine = 0;
    for (let index = 0; index < briefLines.length; index += 1) {
      if (briefLines[index].toLowerCase().includes(lowered)) {
        briefLine = index + 1;
        break;
      }
    }
    findings.push({ briefLine, briefToken: token, planLabel: plan.label, planLinesChecked: plan.lines.length });
  }
  return findings;
};

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
    .join("\n");
  return (
    `${PLAN_DRIFT_TAG} — ${todayUtc} (detective, non-blocking)\n` +
    `Plan checked: ${plan.label} (${plan.lines.length} lines)\n` +
    `Brief tokens with no plan match:\n` +
    `${cited}\n` +
    PLAN_GUARD_FALLBACK
  );
};

/**
 * Appends the drift report to a prompt when the brief drifts from the
 * attached plan, and returns the prompt unchanged otherwise. Append-only:
 * the input text is never shortened and admission is never touched.
 */
export const appendPlanDriftReport = (promptText: string, todayUtc?: string): string => {
  if (typeof promptText !== "string" || promptText.length === 0) return promptText;
  if (promptText.includes(PLAN_DRIFT_TAG)) return promptText;
  const { briefText, plan } = splitBriefAndPlan(promptText);
  if (plan === null) return promptText;
  const findings = detectPlanDrift(briefText, plan);
  if (findings.length === 0) return promptText;
  const today = typeof todayUtc === "string" && todayUtc.length > 0 ? todayUtc : new Date().toISOString().slice(0, 10);
  return `${promptText}\n\n${formatPlanDriftReport(plan, findings, today)}`;
};

export default definePlugin({
  id: "vantrilex-guards",
  setup,
});
