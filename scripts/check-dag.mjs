#!/usr/bin/env node
/*
 * check-dag — the Layer 3 brief gate (W-23, Wednesday build plan).
 *
 * A dispatch whose brief omits any required field is not dispatched. This is
 * the cheap, naive text check behind that rule: it scans plain text, never a
 * YAML/JSON library, and reports which required fields are absent.
 *
 * Required fields (concern, acceptance, worktree/branch, verification,
 * artifact, skills, mcps, dispatch-log line):
 *   - skills (>=N, from the muster selection) and mcps (>=M, countable per
 *     D54) carry the D48 rank numbers (Zenith >=15/>=5, Syzygy >=10/>=4,
 *     Asterism >=5/>=2), measured cumulatively across the task's phases.
 *   - the dispatch-log line cites .opencode/dispatch-log/<task-id>.jsonl
 *     written by scripts/dispatch-log.mjs (D63).
 *
 * Usage:
 *   node scripts/check-dag.mjs --brief <file>
 *   node scripts/check-dag.mjs --workflow <file>
 *
 * --workflow scans the "Plan-once DAG" section of a WORKFLOW.md-style file
 * (from the marker line to the next heading, or EOF).
 *
 * Exit status:
 *   0 — ALL FIELDS PRESENT
 *   1 — one or more fields missing (named on the output), or the --workflow
 *       file carries no "Plan-once DAG" section
 *   2 — usage error (bad flags, unreadable file)
 */
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const value = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 && i + 1 < args.length ? args[i + 1] : null;
};
const brief = value("--brief");
const workflow = value("--workflow");

if ((brief ? 1 : 0) + (workflow ? 1 : 0) !== 1) {
  console.error("Usage: node scripts/check-dag.mjs --brief <file> | --workflow <file>");
  process.exit(2);
}

const target = brief ?? workflow;
let text;
try {
  text = readFileSync(target, "utf8");
} catch (err) {
  console.error(`check-dag: cannot read ${target}: ${err.message}`);
  process.exit(2);
}

if (workflow) {
  const start = text.search(/Plan-once DAG/);
  if (start === -1) {
    console.error('check-dag: --workflow file carries no "Plan-once DAG" section');
    process.exit(1);
  }
  const rest = text.slice(start);
  const nextHeading = rest.slice(1).search(/^#{1,6} /m);
  text = nextHeading === -1 ? rest : rest.slice(0, nextHeading + 1);
}

const FIELDS = [
  ["concern/task", /concern|task/i],
  ["acceptance criteria", /acceptance/i],
  ["worktree/branch", /worktree|branch|wt\/[a-z0-9-]+/i],
  ["verification commands", /verification|verify-/i],
  ["artifact", /artifact/i],
  ["skills", /skills\s*\(/i],
  ["mcps", /mcps?\s*\(/i],
  ["dispatch-log line", /dispatch-log/i],
];

const missing = FIELDS.filter(([, re]) => !re.test(text)).map(([name]) => name);

if (missing.length > 0) {
  console.error(`MISSING FIELDS: ${missing.join(", ")}`);
  process.exit(1);
}
console.log("ALL FIELDS PRESENT");
process.exit(0);
