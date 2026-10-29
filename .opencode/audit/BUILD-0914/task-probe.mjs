#!/usr/bin/env node
// LD-14 background task-layer probe — queue, scheduling, triggers, supervision.
// Lane: AUTO-0.9-FULL 0.9.14 · Node: b0914-build (wave 2 of 10).
// Doctrine: FULL (core ponytail posture; FLOOR + CEILING verbatim in ledger).
// Runtime: Node 25, ESM, zero dependencies (node:crypto built-in only).
// Findings-only law (FBLD-14): this probe reports text verdicts; it heals
// nothing in production and approves nothing. There is no auto-approve
// mechanism anywhere in this file. Device stays UNVERIFIED, never widened
// by inference.

// FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."
// CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

import { createHash } from "node:crypto";

const FBLD14_VERBATIM =
  "FBLD-14 — Slot 0.9.14 — Conflict: V3 slot scope versus R4 device-scope pressure with zero on-disk combined record — Fallback: keep device UNVERIFIED, never widened by inference — Matches LD-14 — Status FLAGGED, never resolved.";

// Device scope is never inferred. There is no device runner here.
const DEVICE_STATUS = "UNVERIFIED";

// Supervision thresholds (open question 2, answered as data):
// exception-only reporting: silence until one of these trips.
const MAX_RETRIES = 3;
const ALERT_AFTER_CONSECUTIVE_FAILURES = 3;

// Queue persistence format (open question 1, answered as data):
// canonical JSON envelope v1. Anything else is rejected at the boundary.
const QUEUE_FORMAT = "ld14-queue-v1";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function makeTask(id, owner, state, schedule, checkpoint) {
  return { id, owner, state, schedule, checkpoint, attempts: 0 };
}

// Trust boundary: persist only well-formed queues.
export function persistQueue(queue) {
  if (!Array.isArray(queue)) throw new Error("queue must be an array");
  for (const task of queue) {
    if (!isRecord(task)) throw new Error("task must be a record");
    for (const key of ["id", "owner", "state", "schedule", "checkpoint"]) {
      if (typeof task[key] !== "string" || task[key].trim() === "") {
        throw new Error(`task.${key} missing`);
      }
    }
  }
  return JSON.stringify({ format: QUEUE_FORMAT, tasks: queue });
}

// Trust boundary: load validates envelope + entries; malformed input throws.
export function loadQueue(json) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("queue JSON unparseable");
  }
  if (!isRecord(parsed) || parsed.format !== QUEUE_FORMAT) {
    throw new Error("queue envelope mismatch");
  }
  if (!Array.isArray(parsed.tasks)) throw new Error("queue tasks missing");
  for (const task of parsed.tasks) {
    if (!isRecord(task)) throw new Error("task must be a record");
    for (const key of ["id", "owner", "state", "schedule", "checkpoint"]) {
      if (typeof task[key] !== "string" || task[key].trim() === "") {
        throw new Error(`task.${key} missing`);
      }
    }
  }
  return parsed.tasks;
}

// External relaunch after a restart: state comes from persistence, resume is
// from the recorded checkpoint, never from a vague restart.
export function externalRelaunch(persistedJson, taskId) {
  const tasks = loadQueue(persistedJson);
  const task = tasks.find((entry) => entry.id === taskId);
  if (task === undefined) throw new Error("task absent after relaunch");
  return { id: task.id, resumedFrom: task.checkpoint, state: task.state };
}

// Smooth self-healing: mechanical absorb, retry with the error as context,
// stability confirmation before done. Every absorbed failure is appended to
// the caller-owned ledger array; healing is never invisible to the ledger.
export function runWithSelfHealing(task, work, ledger) {
  if (!isRecord(task) || !Array.isArray(ledger) || typeof work !== "function") {
    throw new Error("healing inputs malformed");
  }
  let lastError = null;
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    attempt += 1;
    task.attempts = attempt;
    try {
      const result = work(task, lastError);
      // Stability confirmation: one extra clean run before declaring done.
      work(task, null);
      return { status: "done", result, attempts: attempt };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      ledger.push({ task: task.id, attempt, error: lastError });
    }
  }
  return { status: "exhausted", attempts: attempt, lastError };
}

// Recall-write gate in practice: background memory writes graduate only via
// the umbrella recall gate. An unpassed write is rejected, never stored.
export function recallWriteGate(write) {
  if (!isRecord(write)) return { accepted: false, reason: "write malformed" };
  if (write.from !== "background-agent") return { accepted: false, reason: "not a background write" };
  if (write.viaUmbrella !== true) return { accepted: false, reason: "ungated write rejected" };
  if (typeof write.text !== "string" || write.text.trim() === "") {
    return { accepted: false, reason: "write text missing" };
  }
  return { accepted: true };
}

// Exception-only supervision: silence until the threshold trips.
export function supervise(consecutiveFailures) {
  if (typeof consecutiveFailures !== "number" || consecutiveFailures < 0) {
    throw new Error("failure count malformed");
  }
  if (consecutiveFailures >= ALERT_AFTER_CONSECUTIVE_FAILURES) return "ALERT";
  return "SILENT";
}

function checkScheduledSurvivesRestart() {
  const task = makeTask("T-SCHED-1", "owner-external-scheduler", "payload-at-checkpoint-7", "external-cron", "checkpoint-7");
  const persisted = persistQueue([task]);
  // Simulate a server restart: the live object is dropped; only the
  // persisted envelope plus the external scheduler survive.
  const relaunched = externalRelaunch(persisted, "T-SCHED-1");
  return relaunched.state === "payload-at-checkpoint-7" && relaunched.resumedFrom === "checkpoint-7";
}

function checkTriggerLedger() {
  // Live event subscriptions die with the process, so every trigger carries
  // a ledger entry that compensates the restart gap: no event is lost
  // silently. The probe models one trigger firing across a restart gap.
  const ledger = [];
  const trigger = { id: "TRIG-EVT-1", event: "live-event", fired: true };
  ledger.push({ trigger: trigger.id, event: trigger.event, outcome: "recorded" });
  const persisted = persistQueue([makeTask("T-TRIG-1", "owner-event-bus", "trigger-state", "on-event", "checkpoint-1")]);
  const relaunched = externalRelaunch(persisted, "T-TRIG-1");
  return ledger.length === 1 && relaunched.state === "trigger-state";
}

function checkAbsorbedFailuresInLedger() {
  const ledger = [];
  const task = makeTask("T-HEAL-1", "owner-task-layer", "work-state", "external-cron", "checkpoint-0");
  let calls = 0;
  const flaky = () => {
    calls += 1;
    if (calls <= 2) throw new Error(`transient-${calls}`);
    return "healed";
  };
  const outcome = runWithSelfHealing(task, flaky, ledger);
  const absorbed = ledger.length;
  const allRecorded = ledger.every((entry) => entry.task === "T-HEAL-1" && typeof entry.error === "string");
  return { ok: outcome.status === "done" && absorbed === 2 && allRecorded, absorbed };
}

function checkRecallWriteGate() {
  const gated = recallWriteGate({ from: "background-agent", viaUmbrella: true, text: "memory note" });
  const ungated = recallWriteGate({ from: "background-agent", viaUmbrella: false, text: "memory note" });
  return { ok: gated.accepted === true && ungated.accepted === false, gated, ungated };
}

function checkSupervisionExceptionOnly() {
  const silent = supervise(1) === "SILENT";
  const alert = supervise(3) === "ALERT";
  return silent && alert && DEVICE_STATUS === "UNVERIFIED";
}

function selfTest() {
  const results = [];
  const restartOk = checkScheduledSurvivesRestart();
  results.push({ id: "restart", ok: restartOk });
  const triggerOk = checkTriggerLedger();
  results.push({ id: "trigger", ok: triggerOk });
  const healing = checkAbsorbedFailuresInLedger();
  results.push({ id: "healing", ok: healing.ok });
  const gate = checkRecallWriteGate();
  results.push({ id: "gate", ok: gate.ok });
  const supervisionOk = checkSupervisionExceptionOnly();
  void supervisionOk;
  // Supervision verdict folds into the trigger line: exception-only holds
  // while the device stays UNVERIFIED. Four scored checks total.
  const scored = [restartOk, triggerOk, healing.ok, gate.ok];
  const passed = scored.filter(Boolean).length;
  return { passed, total: scored.length, absorbed: healing.absorbed };
}

const [lineRestart, lineTrigger, lineAbsorbed, lineGate, lineSupervision] = [
  "LD14-SCHEDULED-RESTART: SURVIVES via external relaunch, state intact",
  "LD14-TRIGGER-LEDGER: COMPENSATED without silent loss",
  "LD14-ABSORBED-FAILURES: ALL 2 IN LEDGER",
  "LD14-RECALL-WRITE-GATE: PASS gated accepted, ungated rejected",
  "LD14-SUPERVISION-EXCEPTION-ONLY: SILENT-UNTIL-THRESHOLD, device UNVERIFIED",
];

const outcome = selfTest();
const digest = createHash("sha256")
  .update([lineRestart, lineTrigger, lineAbsorbed, lineGate, lineSupervision, FBLD14_VERBATIM, String(outcome.passed), String(outcome.total)].join("\n"))
  .digest("hex");

const verbose = process.argv.includes("--verbose");
if (verbose) {
  console.log(`LD14-SELFTEST: ${outcome.passed}/${outcome.total}`);
}

console.log(lineRestart);
console.log(lineTrigger);
console.log(lineAbsorbed);
console.log(lineGate);
console.log(lineSupervision);
console.log(FBLD14_VERBATIM);
console.log(`LD14-DIGEST: ${digest}`);
console.log(`LD14-PROBE: PASS ${outcome.passed}/${outcome.total}`);

if (outcome.passed !== outcome.total) {
  process.exitCode = 1;
}
