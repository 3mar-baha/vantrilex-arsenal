#!/usr/bin/env node
// LD-13 task-contract probe — measurable gates, independent verifier seat, pre-mortem gate.
// Lane: AUTO-0.9-FULL 0.9.13 (build-release) · Node: b0913-build (wave 1 of 9).
// Doctrine: FULL (core ponytail posture; FLOOR + CEILING verbatim in ledger).
// Runtime: Node 25, ESM, zero dependencies (node:crypto built-in only).
// Findings-only law (FBLD-13): this probe reports text verdicts; it fixes
// nothing and approves nothing. There is no auto-fix and no auto-approve
// mechanism anywhere in this file.

// FLOOR: "Be lazy about the solution, never reckless about the change: include tests for risky logic, keep error handling and validation at trust boundaries, and never skip safety for brevity."
// CEILING: "Be senior, never astronaut: no gold-plating, no speculative abstraction, no framework-for-one-use, and no option, config, or wrapper nobody asked for."

import { createHash } from "node:crypto";

const FBLD13_VERBATIM =
  "FBLD-13 — Slot 0.9.13 — Conflict: V3 slot scope versus R3 auto-approve proposal — Fallback: fix text in findings only; apply is a second dispatch — Matches LD-13 — Status FLAGGED, never resolved.";

// Whole-word vague terms. Any gate text containing one of these as written
// is not measurable as written and the contract is a planning defect.
const VAGUE_TERMS = [
  "good",
  "fast",
  "nice",
  "robust",
  "clean",
  "quality",
  "reasonable",
  "proper",
  "adequate",
  "well",
  "intuitive",
  "seamless",
  "efficient",
  "effective",
  "user-friendly",
];

function findVagueTerms(text) {
  const hits = [];
  if (typeof text !== "string") return hits;
  for (const term of VAGUE_TERMS) {
    const pattern = new RegExp(`\\b${term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}\\b`, "i");
    if (pattern.test(text)) hits.push(term);
  }
  return hits;
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// Gate shape: { id: string, text: string,
//   measure: { tool: string, command: string, expected: string },
//   altCriterion?: string }
// A gate is measurable as written when: id/text/measure.tool/
// measure.command/measure.expected are all non-empty strings, no vague term
// appears in text, and (where measure.tool === "alternative") altCriterion
// is a non-empty explicit acceptance criterion recorded in the contract.
export function isGateMeasurable(gate) {
  const reasons = [];
  if (!isRecord(gate)) return { ok: false, reasons: ["gate is not a record"] };
  if (typeof gate.id !== "string" || gate.id.trim() === "") {
    reasons.push("gate id missing");
  }
  if (typeof gate.text !== "string" || gate.text.trim() === "") {
    reasons.push("gate text missing");
  } else {
    const hits = findVagueTerms(gate.text);
    if (hits.length > 0) reasons.push(`vague term(s) as written: ${hits.join(", ")}`);
  }
  const measure = gate.measure;
  if (!isRecord(measure)) {
    reasons.push("measure missing");
  } else {
    for (const key of ["tool", "command", "expected"]) {
      if (typeof measure[key] !== "string" || measure[key].trim() === "") {
        reasons.push(`measure.${key} missing`);
      }
    }
    if (measure.tool === "alternative") {
      if (typeof gate.altCriterion !== "string" || gate.altCriterion.trim() === "") {
        reasons.push("alternative verification lacks explicit altCriterion");
      }
    }
  }
  return { ok: reasons.length === 0, reasons };
}

// Contract shape: { gates: Gate[] }.
// ACCEPT when every gate is measurable as written.
// Otherwise REJECTED and recorded as a planning defect, never sent to execution.
export function evaluateContract(contract) {
  if (!isRecord(contract) || !Array.isArray(contract.gates) || contract.gates.length === 0) {
    return { verdict: "REJECTED", defect: "planning defect", reasons: ["contract has no gates"] };
  }
  const reasons = [];
  contract.gates.forEach((gate, index) => {
    const checked = isGateMeasurable(gate);
    if (!checked.ok) {
      const label = (isRecord(gate) && typeof gate.id === "string" && gate.id !== "") ? gate.id : `#${index}`;
      reasons.push(`gate ${label}: ${checked.reasons.join("; ")}`);
    }
  });
  if (reasons.length > 0) {
    return { verdict: "REJECTED", defect: "planning defect", reasons };
  }
  return { verdict: "ACCEPT", defect: null, reasons: [] };
}

// Plan shape: { preMortem: { appendix: string } }.
// A plan without a pre-mortem appendix is REJECTED as a planning defect.
export function evaluatePlan(plan) {
  if (!isRecord(plan) || !isRecord(plan.preMortem)) {
    return { verdict: "REJECTED", defect: "planning defect", reasons: ["pre-mortem appendix missing"] };
  }
  const appendix = plan.preMortem.appendix;
  if (typeof appendix !== "string" || appendix.trim() === "") {
    return { verdict: "REJECTED", defect: "planning defect", reasons: ["pre-mortem appendix empty"] };
  }
  return { verdict: "ACCEPT", defect: null, reasons: [] };
}

const FORBIDDEN_SEAT_KEYS = ["thoughtChain", "selfJustifications", "impressions", "authorNotes"];

// Verifier seat shape: fixed context { evidence: [], toolOutputs: [] }.
// Any author-trace key present means the seat is not independent.
// Detection is proven by external evidence: checks[] entries of
// { tool, command, expected, actual }; a mismatch is a detected defect.
export function verifyIndependent(work, seatContext, checks) {
  if (!isRecord(seatContext)) {
    return { verdict: "NOT-INDEPENDENT", evidence: "seat context missing" };
  }
  const leaks = FORBIDDEN_SEAT_KEYS.filter((key) => key in seatContext);
  if (leaks.length > 0) {
    return { verdict: "NOT-INDEPENDENT", evidence: `author traces present: ${leaks.join(", ")}` };
  }
  if (!Array.isArray(checks) || checks.length === 0) {
    return { verdict: "UNVERIFIED", evidence: "no external checks supplied" };
  }
  for (const check of checks) {
    if (!isRecord(check)) continue;
    if (
      typeof check.expected === "string" &&
      typeof check.actual === "string" &&
      check.expected !== check.actual
    ) {
      const tool = typeof check.tool === "string" ? check.tool : "external-tool";
      const command = typeof check.command === "string" ? check.command : "external-command";
      return {
        verdict: "DETECTED",
        evidence: `external evidence via ${tool} (${command}): expected ${JSON.stringify(check.expected)} observed ${JSON.stringify(check.actual)} on work ${JSON.stringify(work && work.id ? work.id : "unknown")}`,
      };
    }
  }
  return { verdict: "NOT-DETECTED", evidence: "all external checks matched" };
}

function sha256Hex(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function runSelfTest() {
  const lines = [];
  let pass = 0;
  const total = 4;

  // (a) All-measurable contract: ACCEPT.
  const goodContract = {
    gates: [
      {
        id: "G1",
        text: "node --check contract-probe.mjs exits 0",
        measure: { tool: "node", command: "node --check contract-probe.mjs", expected: "exit 0" },
      },
      {
        id: "G2",
        text: "probe self-test exits 0 with 4/4 cases passing",
        measure: { tool: "node", command: "node contract-probe.mjs", expected: "exit 0" },
      },
    ],
  };
  const good = evaluateContract(goodContract);
  const goodOk = good.verdict === "ACCEPT";
  if (goodOk) pass += 1;
  lines.push(`LD13-CONTRACT-MEASURABLE: ${good.verdict}${goodOk ? "" : ` (${good.reasons.join("; ")})`}`);

  // (b) Vague-gate contract: REJECTED as planning defect.
  const vagueContract = {
    gates: [
      {
        id: "G1",
        text: "Improve quality reasonably fast",
        measure: { tool: "judgment", command: "reviewer impression", expected: "looks good" },
      },
    ],
  };
  const vague = evaluateContract(vagueContract);
  const vagueOk = vague.verdict === "REJECTED" && vague.defect === "planning defect";
  if (vagueOk) pass += 1;
  lines.push(`LD13-VAGUE-GATE: ${vague.verdict} as ${vague.defect}${vagueOk ? "" : ` (${vague.reasons.join("; ")})`}`);

  // (c) Plan without pre-mortem appendix: REJECTED as planning defect.
  const barePlan = { title: "plan without appendix" };
  const bare = evaluatePlan(barePlan);
  const bareOk = bare.verdict === "REJECTED" && bare.defect === "planning defect";
  if (bareOk) pass += 1;
  lines.push(`LD13-PREMORTEM-MISSING: ${bare.verdict} as ${bare.defect}`);

  // (d) Independent verifier detects a known defect without author traces,
  // proven by external evidence.
  const knownDefectWork = { id: "KNOWN-DEFECT-1", summary: "gate G2 lacks expected value" };
  const seatContext = { evidence: ["tool-output"], toolOutputs: ["exit=1"] };
  const checks = [
    { tool: "node", command: "node contract-probe.mjs", expected: "exit 0", actual: "exit 1" },
  ];
  const found = verifyIndependent(knownDefectWork, seatContext, checks);
  const foundOk = found.verdict === "DETECTED" && typeof found.evidence === "string" && found.evidence.includes("external evidence");
  if (foundOk) pass += 1;
  lines.push(`LD13-INDEPENDENT-VERIFIER: ${found.verdict} by external evidence`);
  lines.push(`LD13-INDEPENDENT-EVIDENCE: ${found.evidence}`);

  lines.push(FBLD13_VERBATIM);
  const digest = sha256Hex(lines.join("\n"));
  lines.push(`LD13-DIGEST: ${digest}`);
  lines.push(`LD13-PROBE: ${pass === total ? "PASS" : "FAIL"} ${pass}/${total}`);
  return { lines, pass, total };
}

const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").endsWith("contract-probe.mjs");

if (invokedDirectly) {
  const result = runSelfTest();
  for (const line of result.lines) console.log(line);
  process.exit(result.pass === result.total ? 0 : 1);
}
