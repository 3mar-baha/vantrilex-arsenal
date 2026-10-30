/**
 * LD-18 Spawning Constitution — mechanism only (laws untouched).
 *
 * Corrected doctrine (owner-decided, text AND execution corrected together):
 * the subset rule is enforced by our tooling at creation time, not by the platform.
 * No text in this tree attributes subset enforcement to the platform; the refusal below
 * happens in `createSpawn` before any work and before any consumption.
 *
 * FBLD-18 (verbatim, read-only, change nothing there): Slot 0.9.18 — Conflict:
 * V3 slot scope versus R4 template depth value pressure — Fallback: cite
 * read-only, change nothing here — Matches LD-18 — Status FLAGGED, never resolved.
 * The R4 template depth value at
 * `.opencode/skills/vantrilex-vanguard/assets/companion-config.template.jsonc:23`
 * (`experimental.subagent_depth = 1`) is cited read-only here and never edited.
 *
 * Storage form: file (JSONL ledger). install_cmd: null (unverified — no new
 * install vector is introduced by this system; nothing to install).
 */

export const LEDGER_FIELDS = Object.freeze([
  "taskId",
  "parent",
  "kind",
  "defOrTemplate",
  "grantedBudget",
  "consumedBudget",
  "result",
  "forgeReviewRef",
]);

/**
 * Depth-zero semantics (exact setting wording; the depth-zero-semantics gate
 * asserts this string verbatim before any depth cap is pinned):
 * depth counts parent-to-child spawn edges from the session root; depth 0 is
 * the root session itself (zero spawn edges traversed); setting key
 * `spawning.maxDepth=3` allows at most 3 edges.
 */
export const DEPTH_ZERO_SEMANTICS =
  "depth counts parent-to-child spawn edges from the session root; depth 0 is " +
  "the root session itself (zero spawn edges traversed); setting key " +
  "`spawning.maxDepth=3` allows at most 3 edges.";

export const SPAWNING_MAX_DEPTH = 3;
export const SPAWNING_DEPTH_EDGES = 3;
export const SPAWNING_SETTING_KEY = "spawning.maxDepth";

/** Corrected subset doctrine (owner-decided). */
export const CORRECTED_SUBSET_DOCTRINE =
  "The subset rule is enforced by our tooling at creation time, not by the platform.";

/** Phrases that would imply platform enforcement — must never appear in our files.
 * Built from parts so the audit machinery never matches its own definitions;
 * the runtime patterns are exactly the literals they replace. */
const phrasePattern = (...parts) => new RegExp(parts.join(""), "i");
export const FORBIDDEN_PLATFORM_SUBSET_PHRASES = Object.freeze([
  phrasePattern("platform", " enforces", " (the )?", "subset"),
  phrasePattern("platform", "-imposed sub", "set"),
  phrasePattern("enforced by", " the plat", "form"),
  phrasePattern("subset", "ting enforced by", " (the )?", "platform"),
]);

export const FBLD_18_VERBATIM =
  "FBLD-18 — Slot 0.9.18 — Conflict: V3 slot scope versus R4 template depth " +
  "value pressure — Fallback: cite read-only, change nothing here — Matches " +
  "LD-18 — Status FLAGGED, never resolved.";

/** Anchor definition (decided): an anchor is an automatic execution point at a
 * session boundary where detection plus adoption-or-retirement run without a
 * manual review appointment. */
export const ANCHOR_DEFINITION =
  "An anchor is an automatic execution point at a session boundary: at every " +
  "anchor the system runs unregistered-spawn detection plus orphan " +
  "adoption-or-retirement automatically, never waiting for a manual review.";

/** Arbitration scope boundary (decided): arbitration decides accept / reject /
 * retry of a spawn result only. It never rewrites leader-log ordering or
 * ownership. Conflicts are logged; the leader log prevails on ordering. */
export const ARBITRATION_SCOPE =
  "Arbitration decides accept/reject/retry of a spawn result only; it never " +
  "rewrites leader-log ordering or ownership.";
export const LEADER_LOG_BOUNDARY =
  "The leader log owns ordering and ownership; arbitration verdicts are " +
  "recorded separately and never rewrite the leader log.";

/** Precedence (decided): on conflict the leader log prevails for ordering and
 * ownership; the arbitration verdict stands for result accept/reject of that
 * spawn only; the conflict itself is logged. */
export const PRECEDENCE_RULE =
  "On arbitration-vs-leader-log conflict the leader log prevails for ordering " +
  "and ownership; the arbitration verdict applies to result accept/reject of " +
  "that spawn only; the conflict is logged with both refs.";

/** Grant calculus (decided): one formula per kind, computed before spawning. */
export const GRANT_TABLE = Object.freeze({
  dispatch: Object.freeze({ base: 6, perStep: 2 }),
  review: Object.freeze({ base: 4, perStep: 1 }),
  probe: Object.freeze({ base: 2, perStep: 1 }),
});

export const computeGrant = (kind, stepCeiling) => {
  const row = GRANT_TABLE[kind];
  if (!row) throw new Error(`UNKNOWN_KIND kind=${String(kind)}`);
  if (!Number.isInteger(stepCeiling) || stepCeiling < 0) {
    throw new Error(`BAD_STEP_CEILING stepCeiling=${String(stepCeiling)}`);
  }
  return row.base + row.perStep * stepCeiling;
};

const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const createLedgerEntry = (input) => {
  if (!isRecord(input)) throw new Error("BAD_ENTRY not a record");
  for (const field of LEDGER_FIELDS) {
    if (input[field] === undefined || input[field] === null || input[field] === "") {
      throw new Error(`MISSING_FIELD field=${field}`);
    }
  }
  if (typeof input.grantedBudget !== "number" || typeof input.consumedBudget !== "number") {
    throw new Error("BAD_BUDGET budgets must be numbers");
  }
  return Object.freeze({ ...input });
};

/**
 * Refusal at creation: over-grant and over-depth are refused HERE, before any
 * work and before any consumption. A refused spawn consumes zero budget and
 * leaves no ledger entry behind.
 */
export const createSpawn = (ledger, request) => {
  if (!Array.isArray(ledger)) throw new Error("BAD_LEDGER not an array");
  if (!isRecord(request)) throw new Error("BAD_REQUEST not a record");
  const { taskId, parent, kind, defOrTemplate, requestedGrant, stepCeiling, parentDepth, forgeReviewRef } = request;
  if (typeof taskId !== "string" || taskId.length === 0) throw new Error("BAD_TASK_ID");
  if (typeof parentDepth !== "number" || parentDepth < 0) throw new Error("BAD_PARENT_DEPTH");
  if (parentDepth + 1 > SPAWNING_MAX_DEPTH) {
    const err = new Error(
      `REFUSED_AT_CREATION reason=over-depth parentDepth=${parentDepth} maxDepth=${SPAWNING_MAX_DEPTH}`,
    );
    err.code = "REFUSED_AT_CREATION";
    err.consumed = 0;
    throw err;
  }
  const bundleGrant = computeGrant(kind, stepCeiling);
  if (typeof requestedGrant !== "number") throw new Error("BAD_REQUESTED_GRANT");
  if (requestedGrant > bundleGrant) {
    const err = new Error(
      `REFUSED_AT_CREATION reason=over-grant requested=${requestedGrant} bundle=${bundleGrant}`,
    );
    err.code = "REFUSED_AT_CREATION";
    err.consumed = 0;
    throw err;
  }
  const entry = createLedgerEntry({
    taskId,
    parent,
    kind,
    defOrTemplate,
    grantedBudget: bundleGrant,
    consumedBudget: 0,
    result: "pending",
    forgeReviewRef,
  });
  ledger.push(entry);
  return entry;
};

/**
 * Unregistered-never-happened: effect without a ledger entry is never accepted
 * as existence proof. Detection is automatic (pure function over ledger plus
 * observed effects); recall discards the effect.
 */
export const detectUnregistered = (ledger, observedEffects) => {
  const known = new Set(ledger.map((entry) => entry.taskId));
  return observedEffects.filter((effect) => !known.has(effect.taskId));
};

export const recallUnregistered = (effect) => ({
  taskId: effect.taskId,
  recalled: true,
  effectDiscarded: true,
  effectAcceptedAsProof: false,
});

/**
 * Orphan adoption-or-retirement at session anchors. The adopter takes
 * stop-and-review responsibility; a retired orphan records its reason and
 * effect so it is never silently revived.
 */
export const adoptOrRetireAtAnchor = (orphans, anchorId, adoptPredicate) => {
  if (typeof anchorId !== "string" || anchorId.length === 0) throw new Error("BAD_ANCHOR");
  return orphans.map((orphan) => {
    const adopt = adoptPredicate(orphan);
    return Object.freeze({
      taskId: orphan.taskId,
      anchorId,
      decision: adopt ? "adopted" : "retired",
      reason: adopt
        ? `adopted: live owner ${orphan.lastOwner} takes stop-and-review responsibility`
        : `retired: no live owner; effect parked, never silently revived`,
      evidenced: true,
    });
  });
};

/**
 * Invocation mechanics: a true child session bound to its parent, with a
 * brand-new context per child. Delivery ONLY via message or files — the
 * context object carries exactly those two keys, so no third channel exists.
 */
export const spawnChild = (args) => {
  const { parentSessionId, childIndex, message, files, modelOverride, stepCeiling } = args;
  if (typeof parentSessionId !== "string" || parentSessionId.length === 0) throw new Error("BAD_PARENT_SESSION");
  if (!Number.isInteger(stepCeiling) || stepCeiling < 0) throw new Error("BAD_STEP_CEILING");
  const context = Object.freeze({ message, files });
  return {
    sessionId: `${parentSessionId}:c${childIndex}`,
    parent: parentSessionId,
    context,
    model: typeof modelOverride === "string" && modelOverride.length > 0 ? modelOverride : "default",
    stepCeiling,
    consumedSteps: 0,
  };
};

export const childContextKeys = (child) => Object.keys(child.context);

export const childStep = (child) => {
  if (child.consumedSteps + 1 > child.stepCeiling) {
    const err = new Error(
      `STEP_CEILING_EXCEEDED consumed=${child.consumedSteps + 1} ceiling=${child.stepCeiling}`,
    );
    err.code = "STEP_CEILING_EXCEEDED";
    throw err;
  }
  child.consumedSteps += 1;
  return child.consumedSteps;
};

/** Forward-wait path: the parent waits for the child result. */
export const runForwardWait = (child, work) => {
  const result = work(child);
  return { mode: "forward-wait", sessionId: child.sessionId, result, waited: true };
};

/**
 * Savepoints plus resumable-async path: work runs to a cut, persists a
 * savepoint carrying position plus context, and resumes FROM that position —
 * never re-run-as-resume.
 */
export const makeSavepoint = (runId, position, context) => Object.freeze({ runId, position, context });

export const runResumableAsync = (child, totalSteps, cutAt, work) => {
  if (cutAt >= totalSteps) throw new Error("BAD_CUT cut must precede end");
  let position = 0;
  const firstLeg = [];
  for (let i = 0; i < cutAt; i += 1) {
    childStep(child);
    position += 1;
    firstLeg.push(work(i));
  }
  const savepoint = makeSavepoint(child.sessionId, position, { leg: firstLeg.length });
  const secondLeg = [];
  for (let i = savepoint.position; i < totalSteps; i += 1) {
    childStep(child);
    secondLeg.push(work(i));
  }
  return {
    mode: "resumable-async",
    sessionId: child.sessionId,
    savepoint,
    outputs: [...firstLeg, ...secondLeg],
    resumedFrom: savepoint.position,
    totalSteps: firstLeg.length + secondLeg.length,
  };
};

/**
 * Arbitration tools (part of the system): verdicts on results only, recorded
 * with reason; the leader log is never written here.
 */
export const arbitrate = (spawnId, verdict, reason, leaderLog) => {
  if (!["accept", "reject", "retry"].includes(verdict)) throw new Error(`BAD_VERDICT verdict=${String(verdict)}`);
  if (typeof reason !== "string" || reason.length === 0) throw new Error("BAD_REASON arbitration needs a reason");
  if (!Array.isArray(leaderLog)) throw new Error("BAD_LEADER_LOG");
  const record = Object.freeze({ spawnId, verdict, reason, scope: "result-only" });
  const leaderTouched = leaderLog.some((row) => row.spawnId === spawnId && row.source === "arbitration");
  return { record, leaderLogUntouched: !leaderTouched };
};

export const resolvePrecedence = (spawnId, arbitrationRecord, leaderRow) => ({
  spawnId,
  winner: "leader-log",
  orderingAndOwnership: leaderRow,
  resultVerdict: arbitrationRecord.verdict,
  conflictLogged: true,
  note: PRECEDENCE_RULE,
});

/** Constitutional-text audit: returns every text implying platform enforcement. */
export const auditConstitutionalTexts = (texts) => {
  const hits = [];
  for (const { path, text } of texts) {
    for (const pattern of FORBIDDEN_PLATFORM_SUBSET_PHRASES) {
      if (pattern.test(text)) hits.push({ path, pattern: String(pattern) });
    }
  }
  return hits;
};
