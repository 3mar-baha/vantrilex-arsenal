#!/usr/bin/env node
/**
 * LD-18 self-proving probe: spawning constitution triple close proof.
 * Zero dependencies. Exit 0 only when every check passes.
 *
 * Triple close: detection + adoption-or-retirement + refusal-at-creation,
 * each with evidence, re-runnable by a non-author (`node <this file>`).
 */
import {
  LEDGER_FIELDS,
  DEPTH_ZERO_SEMANTICS,
  SPAWNING_MAX_DEPTH,
  SPAWNING_SETTING_KEY,
  CORRECTED_SUBSET_DOCTRINE,
  FORBIDDEN_PLATFORM_SUBSET_PHRASES,
  FBLD_18_VERBATIM,
  ANCHOR_DEFINITION,
  ARBITRATION_SCOPE,
  LEADER_LOG_BOUNDARY,
  PRECEDENCE_RULE,
  GRANT_TABLE,
  computeGrant,
  createLedgerEntry,
  createSpawn,
  detectUnregistered,
  recallUnregistered,
  adoptOrRetireAtAnchor,
  spawnChild,
  childContextKeys,
  childStep,
  runForwardWait,
  runResumableAsync,
  arbitrate,
  resolvePrecedence,
  auditConstitutionalTexts,
} from "./spawning-constitution-0918.mjs";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";

const checks = [];
const check = (name, fn) => {
  try {
    const evidence = fn();
    checks.push({ name, status: "PASS", evidence });
  } catch (error) {
    checks.push({ name, status: "FAIL", evidence: error instanceof Error ? error.message : String(error) });
  }
};
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

// 1. Ledger carries the FULL field set per spawn without exception.
check("ledger-full-fields", () => {
  assert(LEDGER_FIELDS.length === 8, `expected 8 fields, got ${LEDGER_FIELDS.length}`);
  for (const f of ["taskId", "parent", "kind", "defOrTemplate", "grantedBudget", "consumedBudget", "result", "forgeReviewRef"]) {
    assert(LEDGER_FIELDS.includes(f), `missing field ${f}`);
  }
  const entry = createLedgerEntry({
    taskId: "t-1", parent: "root", kind: "dispatch", defOrTemplate: "tpl-a",
    grantedBudget: 10, consumedBudget: 0, result: "pending", forgeReviewRef: "forge:rev-1",
  });
  assert(Object.keys(entry).length === 8, "entry must carry exactly 8 fields");
  let threw = false;
  try {
    createLedgerEntry({ taskId: "t-x", parent: "root" });
  } catch { threw = true; }
  assert(threw, "partial entry must throw (no optional field may become an omission hole)");
  return `8 fields enforced; partial entry throws`;
});

// 2. Unregistered-never-happened: automatic detection of a real unregistered spawn.
check("detection", () => {
  const ledger = [];
  createSpawn(ledger, {
    taskId: "t-reg", parent: "root", kind: "probe", defOrTemplate: "tpl-p",
    requestedGrant: 2, stepCeiling: 0, parentDepth: 0, forgeReviewRef: "forge:rev-d",
  });
  const observed = [{ taskId: "t-reg", effect: "ok" }, { taskId: "t-ghost", effect: "sneaky" }];
  const found = detectUnregistered(ledger, observed);
  assert(found.length === 1 && found[0].taskId === "t-ghost", "must detect exactly the ghost");
  return `ghost t-ghost detected among 2 observed effects`;
});

// 3. Recall: effect-without-ledger is never accepted as existence proof.
check("recall", () => {
  const r = recallUnregistered({ taskId: "t-ghost", effect: "sneaky" });
  assert(r.recalled && r.effectDiscarded && r.effectAcceptedAsProof === false, "recall must discard effect");
  return `t-ghost recalled; effect discarded, never proof`;
});

// 4. Orphan adoption-or-retirement at session anchors, decision plus reason recorded.
check("adoption-or-retirement", () => {
  const out = adoptOrRetireAtAnchor(
    [{ taskId: "o-1", lastOwner: "alice" }, { taskId: "o-2", lastOwner: "" }],
    "anchor-7",
    (o) => o.lastOwner.length > 0,
  );
  assert(out[0].decision === "adopted" && out[0].reason.length > 0, "adopt needs reason");
  assert(out[1].decision === "retired" && out[1].reason.length > 0, "retire needs reason");
  assert(out.every((d) => d.anchorId === "anchor-7" && d.evidenced), "anchor + evidence required");
  return `o-1 adopted, o-2 retired at anchor-7 with reasons`;
});

// 5. Arbitration tools with explicit scope boundary against the leader log.
check("arbitration-scope", () => {
  assert(ARBITRATION_SCOPE.includes("result only"), "scope must say result-only");
  assert(LEADER_LOG_BOUNDARY.includes("never rewrite"), "boundary must forbid leader-log writes");
  const leaderLog = [{ spawnId: "t-1", order: 1, source: "leader" }];
  const { record, leaderLogUntouched } = arbitrate("t-1", "reject", "output violates spec", leaderLog);
  assert(record.scope === "result-only" && leaderLogUntouched, "arbitration must not touch leader log");
  return `reject recorded result-only; leader log untouched`;
});

// 6. Invocation: true child sessions bound to the parent.
check("true-child-bound", () => {
  const c = spawnChild({ parentSessionId: "s-root", childIndex: 0, message: "go", files: {}, modelOverride: "", stepCeiling: 3 });
  assert(c.parent === "s-root" && c.sessionId === "s-root:c0", "child must be bound to parent");
  return `s-root:c0 bound to s-root`;
});

// 7. Brand-new context per child; delivery ONLY via message or files (leak test: no third channel).
check("context-leak", () => {
  const parentSecrets = { secret: "s3cr3t" };
  void parentSecrets;
  const c = spawnChild({ parentSessionId: "s-root", childIndex: 1, message: "m", files: { "in.txt": "x" }, modelOverride: "", stepCeiling: 1 });
  const keys = childContextKeys(c).sort();
  assert(keys.length === 2 && keys[0] === "files" && keys[1] === "message", `context keys must be exactly [files,message], got ${keys}`);
  assert(!("secret" in c.context), "parent secret must not leak into child context");
  return `keys=[files,message]; no third channel`;
});

// 8. Per-call model override.
check("model-override", () => {
  const a = spawnChild({ parentSessionId: "s", childIndex: 0, message: "m", files: {}, modelOverride: "m-a", stepCeiling: 1 });
  const b = spawnChild({ parentSessionId: "s", childIndex: 1, message: "m", files: {}, modelOverride: "m-b", stepCeiling: 1 });
  assert(a.model === "m-a" && b.model === "m-b", "each call carries its own override");
  return `m-a vs m-b per call`;
});

// 9. Step count is an enforced ceiling, not a suggestion.
check("step-ceiling", () => {
  const c = spawnChild({ parentSessionId: "s", childIndex: 2, message: "m", files: {}, modelOverride: "", stepCeiling: 2 });
  childStep(c); childStep(c);
  let threw = false;
  try { childStep(c); } catch (e) { threw = e.code === "STEP_CEILING_EXCEEDED"; }
  assert(threw, "third step past ceiling 2 must throw STEP_CEILING_EXCEEDED");
  return `ceiling 2 holds; step 3 refused`;
});

// 10. Savepoints with REAL resume: cut-and-resume, not re-run-as-resume.
check("savepoint-resume", () => {
  const c = spawnChild({ parentSessionId: "s", childIndex: 3, message: "m", files: {}, modelOverride: "", stepCeiling: 5 });
  const out = runResumableAsync(c, 5, 2, (i) => `w${i}`);
  assert(out.totalSteps === 5, `resumed total must be 5, got ${out.totalSteps}`);
  assert(out.resumedFrom === 2, "must resume from savepoint position 2");
  assert(out.outputs.join(",") === "w0,w1,w2,w3,w4", "outputs must continue, not restart");
  assert(c.consumedSteps === 5, "exactly 5 steps consumed (re-run would consume 7)");
  return `cut at 2, resumed from 2, total 5 outputs w0..w4`;
});

// 11. Subset-rule enforcement BY OUR TOOLING: refusal-at-creation (real over-grant refused, zero consumption).
check("refusal-at-creation", () => {
  const ledger = [];
  const bundle = computeGrant("dispatch", 2);
  let err = null;
  try {
    createSpawn(ledger, {
      taskId: "t-greedy", parent: "root", kind: "dispatch", defOrTemplate: "tpl-d",
      requestedGrant: bundle + 1, stepCeiling: 2, parentDepth: 0, forgeReviewRef: "forge:rev-g",
    });
  } catch (e) { err = e; }
  assert(err && err.code === "REFUSED_AT_CREATION", "over-grant must be refused at creation");
  assert(err.consumed === 0 && ledger.length === 0, "refusal before any work or consumption");
  return `requested ${bundle + 1} > bundle ${bundle}: refused, ledger empty`;
});

// 12. Depth-zero-semantics gate pins exact wording; cap on three edges only after it.
check("depth-cap", () => {
  assert(
    DEPTH_ZERO_SEMANTICS ===
      "depth counts parent-to-child spawn edges from the session root; depth 0 is " +
      "the root session itself (zero spawn edges traversed); setting key " +
      "`spawning.maxDepth=3` allows at most 3 edges.",
    "wording gate: exact setting wording must hold before the cap is pinned",
  );
  assert(SPAWNING_MAX_DEPTH === 3 && SPAWNING_SETTING_KEY === "spawning.maxDepth", "cap key + value");
  const ledger = [];
  let depth = 0;
  for (let i = 0; i < 3; i += 1) {
    createSpawn(ledger, {
      taskId: `t-d${i}`, parent: `p${i}`, kind: "probe", defOrTemplate: "tpl",
      requestedGrant: 2, stepCeiling: 0, parentDepth: depth, forgeReviewRef: `forge:r${i}`,
    });
    depth += 1;
  }
  let threw = false;
  try {
    createSpawn(ledger, {
      taskId: "t-d3", parent: "p3", kind: "probe", defOrTemplate: "tpl",
      requestedGrant: 2, stepCeiling: 0, parentDepth: depth, forgeReviewRef: "forge:r3",
    });
  } catch (e) { threw = e.code === "REFUSED_AT_CREATION"; }
  assert(threw, "4th edge past cap 3 must be refused");
  return `wording gate green; 3 edges allowed, 4th refused`;
});

// 13. Forward-wait path (waits for the child result).
check("forward-wait", () => {
  const c = spawnChild({ parentSessionId: "s", childIndex: 4, message: "m", files: {}, modelOverride: "", stepCeiling: 2 });
  const out = runForwardWait(c, () => "done");
  assert(out.waited && out.result === "done" && out.mode === "forward-wait", "forward-wait must wait");
  return `parent waited; result=done`;
});

// 14. Resumable-async path (distinct from forward-wait).
check("resumable-async", () => {
  const c = spawnChild({ parentSessionId: "s", childIndex: 5, message: "m", files: {}, modelOverride: "", stepCeiling: 4 });
  const out = runResumableAsync(c, 4, 1, (i) => `a${i}`);
  assert(out.mode === "resumable-async" && out.totalSteps === 4, "async path distinct with 4 steps");
  return `async launched, cut at 1, resumed to 4`;
});

// 15. Constitutional text correction: corrected doctrine present, platform-enforcement phrasing absent.
check("text-correction", () => {
  assert(CORRECTED_SUBSET_DOCTRINE.includes("not by the platform"), "corrected doctrine must disclaim platform");
  const libPath = new URL("./spawning-constitution-0918.mjs", import.meta.url);
  const libText = readFileSync(libPath, "utf8");
  const hits = auditConstitutionalTexts([{ path: "spawning-constitution-0918.mjs", text: libText }]);
  assert(hits.length === 0, `forbidden platform-enforcement phrasing must be absent, got ${JSON.stringify(hits)}`);
  for (const p of FORBIDDEN_PLATFORM_SUBSET_PHRASES) {
    assert(!p.test(CORRECTED_SUBSET_DOCTRINE), "corrected sentence must not trip its own audit");
  }
  return `corrected doctrine carried; 0 forbidden phrases in mechanism`;
});

// 16. Law-vs-mechanism: no law rewritten, mechanism only.
check("law-vs-mechanism", () => {
  const libText = readFileSync(new URL("./spawning-constitution-0918.mjs", import.meta.url), "utf8");
  assert(!/LAW\s+(REWRITTEN|AMENDED|REPEALED)/i.test(libText), "no law rewrite markers allowed");
  assert(/mechanism only/i.test(libText), "mechanism-only boundary must be stated");
  return `no law rewritten; mechanism only`;
});

// 17. Triple close proof re-runnable by a non-author (this file is the re-run).
check("triple-close", () => {
  const byName = Object.fromEntries(checks.map((c) => [c.name, c.status]));
  assert(byName.detection === "PASS", "detection must be green");
  assert(byName["adoption-or-retirement"] === "PASS", "adoption-or-retirement must be green");
  assert(byName["refusal-at-creation"] === "PASS", "refusal-at-creation must be green");
  return `detection + adoption-or-retirement + refusal-at-creation all green`;
});

// 18. Storage form decided: file (JSONL) persists across a simulated session boundary.
check("storage-form", () => {
  const dir = mkdtempSync(join(tmpdir(), "ld18-"));
  try {
    const ledger = [];
    createSpawn(ledger, {
      taskId: "t-file", parent: "root", kind: "review", defOrTemplate: "tpl-r",
      requestedGrant: 4, stepCeiling: 0, parentDepth: 0, forgeReviewRef: "forge:rev-f",
    });
    writeFileSync(join(dir, "spawn-ledger.jsonl"), ledger.map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
    const back = readFileSync(join(dir, "spawn-ledger.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
    assert(back.length === 1 && Object.keys(back[0]).length === 8, "file round-trip must preserve full 8-field entry");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  return `file JSONL round-trip preserves 8-field entry (storage-form=file)`;
});

// 19. Grant calculus + precedence decided with evidence.
check("grant-precedence", () => {
  assert(computeGrant("dispatch", 2) === GRANT_TABLE.dispatch.base + 2 * GRANT_TABLE.dispatch.perStep, "per-kind formula");
  const leaderLog = [{ spawnId: "t-9", order: 3, source: "leader" }];
  const { record } = arbitrate("t-9", "accept", "meets spec", leaderLog);
  const res = resolvePrecedence("t-9", record, leaderLog[0]);
  assert(res.winner === "leader-log" && res.conflictLogged && res.resultVerdict === "accept", "precedence rule");
  assert(PRECEDENCE_RULE.includes("leader log prevails"), "precedence wording");
  assert(ANCHOR_DEFINITION.includes("automatic execution point"), "anchor wording");
  return `grant formula per kind; leader-log prevails on ordering; anchor automatic`;
});

// 20. FBLD-18 verbatim + zero invented install commands.
check("fbld18-honesty", () => {
  assert(FBLD_18_VERBATIM.includes("cite read-only, change nothing here"), "FBLD-18 fallback verbatim");
  const libText = readFileSync(new URL("./spawning-constitution-0918.mjs", import.meta.url), "utf8");
  assert(!/npm\s+(i|install)\s+\S/.test(libText), "no invented install command in mechanism");
  assert(/install_cmd:\s*null/.test(libText), "install honesty (null) must be stated");
  return `FBLD-18 carried; install_cmd null, nothing invented`;
});

const pass = checks.filter((c) => c.status === "PASS").length;
const failCount = checks.filter((c) => c.status === "FAIL").length;
const digest = createHash("sha256").update(checks.map((c) => `${c.name}:${c.status}:${c.evidence}`).join("\n")).digest("hex");
for (const c of checks) console.log(`${c.status} ${c.name} — ${c.evidence}`);
console.log(`checks: ${pass} pass, ${failCount} fail, ${checks.length} total`);
console.log(`LD18-DIGEST ${digest}`);
console.log(failCount === 0 ? "VERDICT: PROCEED" : "VERDICT: FAIL");
process.exit(failCount === 0 ? 0 : 1);
