// LD-08 policy hooks as code — Node stdlib only, ESM, zero dependencies.
//
// Veto point: evaluatePermission (permission-evaluation). Fail-closed:
// unknown levels, unknown actions, and any internal error all deny.
// The subset rule (child grant narrower than parent grant) is enforced by
// mechanism in enforceSpawnGrant, because the platform itself does not
// enforce narrowing. The lethal-triad check runs on a FULL agent path,
// never on a single tool.
//
// Usage:
//   node .opencode/audit/BUILD-098/trust-probe.mjs   (self-test, exit 0 on PASS)

const RANKS = {
  operator: 4,
  collaborator: 3,
  advisor: 2,
  approver: 1,
  observer: 0,
};

const GRANTS = {
  operator: new Set(["read:registry"]),
  collaborator: new Set(["read:registry"]),
  advisor: new Set([]),
  approver: new Set(["verdict:approval-queue"]),
  observer: new Set([]),
};

const APPROVAL_GATED = new Set(["write", "network", "control"]);

/**
 * Narrow an untrusted value to a known trust level, or null.
 * @param {unknown} value
 */
export function asLevel(value) {
  return typeof value === "string" && value in RANKS ? value : null;
}

/**
 * Permission evaluation — the documented veto point. Every act passes
 * through here; anything not explicitly granted is denied, and any
 * evaluation error denies too (fail-closed, deny-default).
 * @param {unknown} request
 */
export function evaluatePermission(request) {
  try {
    if (request === null || typeof request !== "object" || Array.isArray(request)) {
      return { effect: "deny", reason: "malformed-request" };
    }
    const { level, action, resource, approved } = /** @type {{level:unknown,action:unknown,resource:unknown,approved:unknown}} */ (request);
    const known = asLevel(level);
    if (known === null) return { effect: "deny", reason: "unknown-level" };
    if (typeof action !== "string" || action.length === 0) return { effect: "deny", reason: "unknown-action" };
    if (typeof resource !== "string" || resource.length === 0) return { effect: "deny", reason: "unknown-resource" };
    const grantKey = `${action}:${resource}`;
    const granted = GRANTS[known] !== undefined && GRANTS[known].has(grantKey);
    if (!granted) return { effect: "deny", reason: "not-granted" };
    if (APPROVAL_GATED.has(action) && approved !== true) return { effect: "deny", reason: "needs-approval" };
    return { effect: "allow", reason: "granted" };
  } catch {
    return { effect: "deny", reason: "evaluation-error" };
  }
}

/**
 * Narrow an untrusted grant list to action:resource pairs, or null.
 * @param {unknown} grant
 */
function asPairs(grant) {
  if (!Array.isArray(grant)) return null;
  const pairs = new Set();
  for (const entry of grant) {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) return null;
    const { action, resource } = /** @type {{action:unknown,resource:unknown}} */ (entry);
    if (typeof action !== "string" || typeof resource !== "string") return null;
    pairs.add(`${action}:${resource}`);
  }
  return pairs;
}

/**
 * Spawn-authority enforcement (subset rule by mechanism). A parent at rank
 * R may spawn a child at rank <= R, and the child grant must be a subset of
 * the parent grant — a wider child grant fails by code, not by prose.
 * @param {unknown} parent
 * @param {unknown} child
 */
export function enforceSpawnGrant(parent, child) {
  try {
    if (parent === null || typeof parent !== "object" || Array.isArray(parent)) {
      return { effect: "deny", reason: "malformed-parent" };
    }
    if (child === null || typeof child !== "object" || Array.isArray(child)) {
      return { effect: "deny", reason: "malformed-child" };
    }
    const { level: parentLevel, grant: parentGrant } = /** @type {{level:unknown,grant:unknown}} */ (parent);
    const { level: childLevel, grant: childGrant } = /** @type {{level:unknown,grant:unknown}} */ (child);
    const parentRank = asLevel(parentLevel) === null ? -1 : RANKS[asLevel(parentLevel)];
    const childRank = asLevel(childLevel) === null ? -1 : RANKS[asLevel(childLevel)];
    if (parentRank < 0 || childRank < 0) return { effect: "deny", reason: "unknown-level" };
    if (childRank > parentRank) return { effect: "deny", reason: "rank-escalation" };
    const parentPairs = asPairs(parentGrant);
    const childPairs = asPairs(childGrant);
    if (parentPairs === null || childPairs === null) return { effect: "deny", reason: "malformed-grant" };
    for (const pair of childPairs) {
      if (!parentPairs.has(pair)) return { effect: "deny", reason: "not-a-subset" };
    }
    return { effect: "allow", reason: "subset" };
  } catch {
    return { effect: "deny", reason: "evaluation-error" };
  }
}

/**
 * Lethal-triad full-path data check. A complete agent path that is fully
 * triad-loaded (untrusted input + external egress + consequential act
 * across its steps) cannot be sent — the data check fires. A path missing
 * any one leg is not triad-loaded.
 * @param {unknown} fullPath
 */
export function lethalTriadPathCheck(fullPath) {
  try {
    if (!Array.isArray(fullPath)) return { send: false, reason: "malformed-path" };
    let untrustedInput = false;
    let externalEgress = false;
    let consequentialAct = false;
    for (const step of fullPath) {
      if (step === null || typeof step !== "object" || Array.isArray(step)) {
        return { send: false, reason: "malformed-step" };
      }
      const flags = /** @type {{untrustedInput:unknown,externalEgress:unknown,consequentialAct:unknown}} */ (step);
      if (flags.untrustedInput === true) untrustedInput = true;
      if (flags.externalEgress === true) externalEgress = true;
      if (flags.consequentialAct === true) consequentialAct = true;
    }
    if (untrustedInput && externalEgress && consequentialAct) {
      return { send: false, reason: "triad-loaded-path-blocked" };
    }
    return { send: true, reason: "not-triad-loaded" };
  } catch {
    return { send: false, reason: "evaluation-error" };
  }
}

/**
 * Self-promotion check. A level change without a genuine out-of-scope owner
 * act is denied — including from the confined (observer) tier, whose only
 * promotion path is the owner act outside the scope. No in-scope call can
 * mint an owner act: it must arrive as { by: "owner", outOfBand: true }.
 * @param {unknown} request
 */
export function requestLevelChange(request) {
  try {
    if (request === null || typeof request !== "object" || Array.isArray(request)) {
      return { effect: "deny", reason: "malformed-request" };
    }
    const { from, to, ownerAct } = /** @type {{from:unknown,to:unknown,ownerAct:unknown}} */ (request);
    const fromLevel = asLevel(from);
    const toLevel = asLevel(to);
    if (fromLevel === null || toLevel === null) return { effect: "deny", reason: "unknown-level" };
    if (RANKS[toLevel] <= RANKS[fromLevel]) return { effect: "allow", reason: "no-promotion" };
    const act =
      ownerAct !== null && typeof ownerAct === "object" && !Array.isArray(ownerAct)
        ? /** @type {{by:unknown,outOfBand:unknown}} */ (ownerAct)
        : null;
    if (act !== null && act.by === "owner" && act.outOfBand === true) {
      return { effect: "allow", reason: "owner-act-out-of-scope" };
    }
    return { effect: "deny", reason: "self-promotion-denied" };
  } catch {
    return { effect: "deny", reason: "evaluation-error" };
  }
}
