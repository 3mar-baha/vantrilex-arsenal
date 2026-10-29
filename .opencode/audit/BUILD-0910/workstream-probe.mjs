// LD-10 workstream isolation plus merge arbitration proof — Node stdlib only, ESM, zero deps.
//
// Executable proof for V3:3659-3730 (slot 0.9.10): one isolated workstream
// per write path with no direct cross-writes, a written merge-arbitration
// ladder with a decision ledger naming winner plus reason per conflict, a
// real conflicting-edit scenario with no silent overwrite, full workstream
// disposal with zero side effects, and conservative spawn-width ceilings
// that rise only after the proof runs green.
//
// Usage:
//   node .opencode/audit/BUILD-0910/workstream-probe.mjs   (self-test, exit 0 on PASS)

import { createHash } from "node:crypto";

const lines = [];
function emit(line) {
  lines.push(line);
  console.log(line);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`self-test FAIL: ${label}: expected ${expected}, got ${actual}`);
  }
}

// Trust-tier ranks (read from the trust level per LD-10 dependency V3:3719).
// Higher rank wins a same-path conflict; ties break on earlier sequence.
const TRUST_RANK = Object.freeze({ reviewer: 1, operator: 2 });

// Conservative spawn ceiling: at most this many live workstreams until the
// arbitration proof runs green (V3:3691, V3:3711). Raised only via
// raiseCeilingAfterGreen, never by optimism.
const CONSERVATIVE_CEILING = 2;

function createStore() {
  return {
    workstreams: new Map(),
    decisionLedger: [],
    refusalEvents: [],
    proofGreen: false,
    proofDigest: null,
    ceiling: CONSERVATIVE_CEILING,
    sequence: 0,
  };
}

// One isolated workstream per write path. Ownership is a frozen copy: a
// writer can only ever touch its own draft paths, never another writer's.
function spawnWorkstream(store, id, ownedPaths, claim) {
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("spawn refused: id must be a non-empty string");
  }
  if (store.workstreams.has(id)) {
    store.refusalEvents.push(`refused:duplicate-id:${id}`);
    throw new Error(`spawn refused as event: duplicate id ${id}`);
  }
  if (store.workstreams.size >= store.ceiling) {
    store.refusalEvents.push(`refused:ceiling-exceeded:${id}`);
    throw new Error(`spawn refused as event: ceiling ${store.ceiling} reached, ${id} not spawned`);
  }
  if (!Array.isArray(ownedPaths) || ownedPaths.length === 0) {
    throw new Error("spawn refused: ownedPaths must be a non-empty list");
  }
  store.workstreams.set(
    id,
    Object.freeze({
      id,
      ownedPaths: Object.freeze([...ownedPaths]),
      claim,
      files: new Map(),
    }),
  );
  return store.workstreams.get(id);
}

// Trust-boundary write: a direct cross-write (path outside the writer's own
// owned paths) is refused AS AN EVENT — recorded, never silent.
function writeDraft(store, wsId, path, content) {
  const ws = store.workstreams.get(wsId);
  if (ws === undefined) {
    throw new Error(`write refused: unknown workstream ${wsId}`);
  }
  if (!ws.ownedPaths.includes(path)) {
    store.refusalEvents.push(`refused:cross-write:${wsId}->${path}`);
    throw new Error(`write refused as event: ${wsId} may not write ${path} (outside its isolated paths)`);
  }
  ws.files.set(path, content);
  return true;
}

// Merge-arbitration ladder (written procedure lives in merge-arbitration.md):
//   Rule A (claim check): an edit whose writer lacks the capability claim
//     required by the logical path is rejected — reason unclaimed-capability.
//   Rule B (disjoint): edits on disjoint logical paths both apply — winner
//     "both", reason disjoint-paths.
//   Rule C (same-path conflict): higher trust-tier rank wins; a rank tie
//     breaks on the earlier sequence number — reasons higher-trust-tier /
//     earlier-sequence-tiebreak. The loser entry keeps the loser content
//     verbatim, so no edit is ever silently overwritten.
function arbitrateMerge(store, base, edits, requiredClaim) {
  if (typeof base !== "string") {
    throw new Error("arbitration refused: base must be a string");
  }
  const eligible = [];
  for (const edit of edits) {
    const ws = store.workstreams.get(edit.wsId);
    if (ws === undefined || ws.claim !== requiredClaim) {
      store.decisionLedger.push(
        Object.freeze({
          logicalPath: edit.logicalPath,
          winner: "none",
          loser: edit.wsId,
          rule: "A",
          reason: "unclaimed-capability",
          loserContentPreserved: edit.content,
        }),
      );
      continue;
    }
    eligible.push(edit);
  }
  const merged = new Map();
  const byPath = new Map();
  for (const edit of eligible) {
    if (!byPath.has(edit.logicalPath)) {
      byPath.set(edit.logicalPath, []);
    }
    byPath.get(edit.logicalPath).push(edit);
  }
  for (const [logicalPath, contenders] of byPath) {
    if (contenders.length === 1) {
      merged.set(logicalPath, contenders[0].content);
      store.decisionLedger.push(
        Object.freeze({
          logicalPath,
          winner: contenders[0].wsId,
          loser: "none",
          rule: "B",
          reason: "disjoint-paths",
          loserContentPreserved: null,
        }),
      );
      continue;
    }
    const ranked = [...contenders].sort((a, b) => {
      const rankGap = TRUST_RANK[b.trustTier] - TRUST_RANK[a.trustTier];
      if (rankGap !== 0) {
        return rankGap;
      }
      return a.seq - b.seq;
    });
    const winner = ranked[0];
    merged.set(logicalPath, winner.content);
    const tied = TRUST_RANK[ranked[0].trustTier] === TRUST_RANK[ranked[1].trustTier];
    for (let index = 1; index < ranked.length; index += 1) {
      store.decisionLedger.push(
        Object.freeze({
          logicalPath,
          winner: winner.wsId,
          loser: ranked[index].wsId,
          rule: "C",
          reason: tied ? "earlier-sequence-tiebreak" : "higher-trust-tier",
          loserContentPreserved: ranked[index].content,
        }),
      );
    }
  }
  return Object.freeze({ merged, decisions: store.decisionLedger.length });
}

function digestOfFiles(files) {
  const ordered = [...files.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return createHash("sha256")
    .update(ordered.map(([path, content]) => `${path}=${content}`).join("\n"))
    .digest("hex");
}

// Full workstream disposal: the removed workstream vanishes entirely while
// every other workstream's bytes hash identical before and after.
function disposeWorkstream(store, wsId) {
  const before = new Map();
  for (const [id, ws] of store.workstreams) {
    if (id !== wsId) {
      before.set(id, digestOfFiles(ws.files));
    }
  }
  const removed = store.workstreams.delete(wsId);
  if (!removed) {
    throw new Error(`disposal refused: unknown workstream ${wsId}`);
  }
  let sideEffects = 0;
  for (const [id, ws] of store.workstreams) {
    if (digestOfFiles(ws.files) !== before.get(id)) {
      sideEffects += 1;
    }
  }
  return Object.freeze({
    removed: wsId,
    survivors: store.workstreams.size,
    sideEffects,
    survivorDigest: before.size === 0 ? "no-survivors" : [...before.values()].join("+"),
  });
}

// Spawn-width ceilings stay conservative until the proof runs green: raising
// the ceiling without a recorded green digest is refused as an event.
function raiseCeilingAfterGreen(store, next) {
  if (store.proofGreen !== true || store.proofDigest === null) {
    store.refusalEvents.push("refused:proof-not-green");
    throw new Error("ceiling raise refused as event: arbitration proof has not run green");
  }
  if (!Number.isInteger(next) || next <= store.ceiling) {
    throw new Error("ceiling raise refused: next must be an integer above the current ceiling");
  }
  store.ceiling = next;
  return store.ceiling;
}

function runSelfTest() {
  const store = createStore();

  // 1. Isolated workstream per write path; direct cross-write refused.
  spawnWorkstream(store, "alpha", ["draft/alpha/plan.md"], "write:plan");
  spawnWorkstream(store, "beta", ["draft/beta/plan.md"], "write:plan");
  assertEqual(store.workstreams.size, 2, "spawn.two-live");
  writeDraft(store, "alpha", "draft/alpha/plan.md", "alpha line A\n");
  writeDraft(store, "beta", "draft/beta/plan.md", "beta line B\n");
  let crossRefused = false;
  try {
    writeDraft(store, "alpha", "draft/beta/plan.md", "silent overwrite attempt\n");
  } catch {
    crossRefused = true;
  }
  assertEqual(crossRefused, true, "isolation.cross-refused");
  assertEqual(store.refusalEvents[0], "refused:cross-write:alpha->draft/beta/plan.md", "isolation.refusal-event");
  assertEqual(store.workstreams.get("beta").files.get("draft/beta/plan.md"), "beta line B\n", "isolation.beta-untouched");
  emit(`ISOLATION cross-write refused=${crossRefused} event=${store.refusalEvents[0]}`);

  // 2. Real conflicting-edit scenario: both drafts target the same logical
  // file. Beta carries the higher trust tier, so beta wins with a named
  // reason and alpha's content survives verbatim in the ledger.
  store.sequence += 1;
  const alphaSeq = store.sequence;
  store.sequence += 1;
  const betaSeq = store.sequence;
  const outcome = arbitrateMerge(
    store,
    "base line 0\n",
    [
      { wsId: "alpha", logicalPath: "shared/plan.md", content: "alpha line A\n", seq: alphaSeq, trustTier: "reviewer" },
      { wsId: "beta", logicalPath: "shared/plan.md", content: "beta line B\n", seq: betaSeq, trustTier: "operator" },
    ],
    "write:plan",
  );
  assertEqual(outcome.merged.get("shared/plan.md"), "beta line B\n", "arbitration.merged-content");
  const conflict = store.decisionLedger[store.decisionLedger.length - 1];
  assertEqual(conflict.winner, "beta", "arbitration.winner");
  assertEqual(conflict.loser, "alpha", "arbitration.loser");
  assertEqual(conflict.rule, "C", "arbitration.rule");
  assertEqual(conflict.reason, "higher-trust-tier", "arbitration.reason");
  assertEqual(conflict.loserContentPreserved, "alpha line A\n", "arbitration.loser-preserved");
  emit(`ARBITRATION winner=${conflict.winner} loser=${conflict.loser} rule=${conflict.rule} reason=${conflict.reason}`);

  // 2b. Tie on trust tier breaks on earlier sequence; unclaimed capability rejected.
  store.sequence += 1;
  const firstSeq = store.sequence;
  store.sequence += 1;
  const secondSeq = store.sequence;
  const tie = arbitrateMerge(
    store,
    "base\n",
    [
      { wsId: "alpha", logicalPath: "shared/tie.md", content: "first\n", seq: firstSeq, trustTier: "reviewer" },
      { wsId: "beta", logicalPath: "shared/tie.md", content: "second\n", seq: secondSeq, trustTier: "reviewer" },
    ],
    "write:plan",
  );
  assertEqual(tie.merged.get("shared/tie.md"), "first\n", "arbitration.tie-content");
  const tieEntry = store.decisionLedger[store.decisionLedger.length - 1];
  assertEqual(tieEntry.winner, "alpha", "arbitration.tie-winner");
  assertEqual(tieEntry.reason, "earlier-sequence-tiebreak", "arbitration.tie-reason");
  emit(`ARBITRATION tie winner=${tieEntry.winner} reason=${tieEntry.reason}`);
  const ghost = arbitrateMerge(
    store,
    "base\n",
    [{ wsId: "ghost", logicalPath: "shared/ghost.md", content: "x\n", seq: 99, trustTier: "operator" }],
    "write:plan",
  );
  assertEqual(ghost.merged.has("shared/ghost.md"), false, "arbitration.ghost-rejected");
  const ghostEntry = store.decisionLedger[store.decisionLedger.length - 1];
  assertEqual(ghostEntry.reason, "unclaimed-capability", "arbitration.ghost-reason");
  emit(`ARBITRATION unclaimed rejected=${!ghost.merged.has("shared/ghost.md")} reason=${ghostEntry.reason}`);

  // 3. Full disposal of alpha with zero side effects on beta.
  const betaBefore = digestOfFiles(store.workstreams.get("beta").files);
  const disposal = disposeWorkstream(store, "alpha");
  assertEqual(disposal.sideEffects, 0, "disposal.zero-side-effects");
  assertEqual(disposal.survivors, 1, "disposal.survivors");
  assertEqual(digestOfFiles(store.workstreams.get("beta").files), betaBefore, "disposal.beta-identical");
  assertEqual(store.workstreams.has("alpha"), false, "disposal.alpha-gone");
  emit(`DISPOSAL removed=${disposal.removed} survivors=${disposal.survivors} sideEffects=${disposal.sideEffects}`);

  // 4. Spawn-width ceilings stay conservative until the proof runs green.
  let ceilingRefused = false;
  try {
    spawnWorkstream(store, "gamma", ["draft/gamma/plan.md"], "write:plan");
  } catch {
    ceilingRefused = true;
  }
  assertEqual(ceilingRefused, false, "ceiling.second-slot-open");
  let thirdRefused = false;
  try {
    spawnWorkstream(store, "delta", ["draft/delta/plan.md"], "write:plan");
  } catch {
    thirdRefused = true;
  }
  assertEqual(thirdRefused, true, "ceiling.third-refused");
  let raiseRefused = false;
  try {
    raiseCeilingAfterGreen(store, 3);
  } catch {
    raiseRefused = true;
  }
  assertEqual(raiseRefused, true, "ceiling.raise-before-green-refused");
  emit(`CEILING third-refused=${thirdRefused} raise-before-green-refused=${raiseRefused} ceiling=${store.ceiling}`);

  const digest = createHash("sha256").update(lines.join("\n")).digest("hex");
  emit(`DIGEST ${digest}`);
  store.proofGreen = true;
  store.proofDigest = digest;
  const raised = raiseCeilingAfterGreen(store, 3);
  assertEqual(raised, 3, "ceiling.raised-after-green");
  spawnWorkstream(store, "delta", ["draft/delta/plan.md"], "write:plan");
  assertEqual(store.workstreams.size, 3, "ceiling.delta-spawned-after-green");
  emit(`CEILING raised=${raised} after-green-spawn=delta`);
  return digest;
}

const invokedAsMain = process.argv[1] !== undefined && process.argv[1].endsWith("workstream-probe.mjs");

if (invokedAsMain) {
  runSelfTest();
}
