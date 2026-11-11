#!/usr/bin/env node
/*
 * verify-minimums — the read-only receipt verifier for the per-task minimums
 * (W-25, Wednesday build plan; layer 7, the (c) answer to G-04).
 *
 * Reads a task's dispatch-log trace (.opencode/dispatch-log/<task-id>.jsonl,
 * decision D63) and counts the tokens a verifier has confirmed against the
 * D48 bright-line per-task minimums for the trace's rank:
 *   zenith >= 15 skills / >= 5 MCPs; syzygy >= 10 / >= 4; asterism >= 5 / >= 2.
 *
 * Honesty rule (D63, enforced in code): only source === 'verifier-confirmed'
 * tokens count toward a minimum. brief-named and receipt-claimed tokens are
 * claims, not use, and are never upgraded here — no rank, rollup, or flag in
 * this script promotes them.
 *
 * The rank comes from the trace itself; the minimums are D48's, unchanged.
 * Scope is the task's single trace, not the selection record (that is
 * verify-catalog's min-skills / min-mcps gate, D61) and not a load proof
 * (the trace records claims, not load proof, D63).
 *
 * Usage:
 *   node scripts/verify-minimums.mjs --task <id>
 *
 * Output: prints APPROVED or REJECTED with the shortfall named on the
 * output. Exit status:
 *   0 — APPROVED (every D48 minimum met by verifier-confirmed tokens and no
 *       malformed line is present)
 *   1 — REJECTED (missing trace, empty trace, ambiguous rank, a minimum
 *       shortfall, or a malformed line). Failure rejects by default.
 *   2 — usage error (bad flags, missing/invalid --task)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOG_DIR = path.join(ROOT, ".opencode", "dispatch-log");

const MINIMUMS = new Map([
  ["zenith", { skills: 15, mcps: 5 }],
  ["syzygy", { skills: 10, mcps: 4 }],
  ["asterism", { skills: 5, mcps: 2 }]
]);
const RANKS = new Set(MINIMUMS.keys());
const SOURCES = new Set(["brief-named", "receipt-claimed", "verifier-confirmed"]);
const KINDS = new Set(["skill", "mcp"]);
const TASK_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,199}$/;
const AGENT_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

const usage = () => {
  process.stderr.write(
    "Usage:\n  node scripts/verify-minimums.mjs --task <id>\n"
  );
  process.exit(2);
};

const failUsage = (message) => {
  process.stderr.write("verify-minimums: " + message + "\n");
  usage();
};

const parseArgs = (argv) => {
  const flags = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--") === false) failUsage("unexpected argument " + JSON.stringify(arg));
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) failUsage("flag --" + key + " needs a value");
    if (flags.has(key)) failUsage("flag --" + key + " given twice");
    flags.set(key, value);
    i += 1;
  }
  return flags;
};

const logPath = (task) => path.join(LOG_DIR, task + ".jsonl");

// Validation mirrors scripts/dispatch-log.mjs readEvents (same enums, same
// checks) so a line this script accepts is a line the ledger accepts.
const readEvents = (file) => {
  const events = [];
  const malformed = [];
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i].trim();
    if (raw === "") continue;
    let entry = null;
    try {
      entry = JSON.parse(raw);
    } catch {
      malformed.push("line " + (i + 1) + ": not JSON");
      continue;
    }
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      malformed.push("line " + (i + 1) + ": not a JSON object");
      continue;
    }
    const at = typeof entry.at === "string" ? Date.parse(entry.at) : NaN;
    const checks = [
      ["task_id", typeof entry.task_id === "string" && entry.task_id.length > 0],
      ["agent", typeof entry.agent === "string" && AGENT_RE.test(entry.agent)],
      ["rank", typeof entry.rank === "string" && RANKS.has(entry.rank)],
      ["kind", typeof entry.kind === "string" && KINDS.has(entry.kind)],
      ["token", typeof entry.token === "string" && ID_RE.test(entry.token)],
      ["source", typeof entry.source === "string" && SOURCES.has(entry.source)],
      ["at", typeof entry.at === "string" && Number.isNaN(at) === false]
    ];
    const bad = checks.filter(([, ok]) => ok === false).map(([field]) => field);
    if (bad.length > 0) {
      malformed.push("line " + (i + 1) + ": invalid field(s) " + bad.join(", "));
      continue;
    }
    events.push({ ...entry, atMs: at });
  }
  return { events, malformed };
};

const sourceBreakdown = (events) =>
  [...SOURCES].map((s) => s + "=" + events.filter((e) => e.source === s).length).join(", ");

const missingTrace = (task) => {
  process.stdout.write(
    "task_id:      " + task + "\n" +
      "rank:         MISSING (no trace at .opencode/dispatch-log/" + task + ".jsonl)\n" +
      "skills:       MISSING\n" +
      "mcps:         MISSING\n" +
      "REJECTED — missing: rank, skills, mcps (no trace at .opencode/dispatch-log/" + task + ".jsonl)\n"
  );
  process.exit(1);
};

const main = () => {
  const flags = parseArgs(process.argv.slice(2));
  for (const key of flags.keys()) {
    if (key !== "task") failUsage("unknown flag --" + key);
  }
  const task = flags.get("task");
  if (typeof task !== "string" || TASK_RE.test(task) === false) {
    failUsage("--task must match " + TASK_RE.source + " (filename-safe; no separators)");
  }

  const file = logPath(task);
  if (fs.existsSync(file) === false) missingTrace(task);

  const { events, malformed } = readEvents(file);
  const lines = [];
  lines.push("task_id:      " + task);

  const ranks = [...new Set(events.map((e) => e.rank))];
  if (events.length > 0 && ranks.length === 1) {
    lines.push("rank:         " + ranks[0]);
  } else if (ranks.length === 0) {
    lines.push("rank:         MISSING");
  } else {
    lines.push("rank:         MISSING (ambiguous: " + ranks.join(", ") + ")");
  }

  const confirmed = events.filter((e) => e.source === "verifier-confirmed");
  const skills = new Set(confirmed.filter((e) => e.kind === "skill").map((e) => e.token));
  const mcps = new Set(confirmed.filter((e) => e.kind === "mcp").map((e) => e.token));

  const rank = ranks.length === 1 ? ranks[0] : null;
  const min = rank !== null ? MINIMUMS.get(rank) : null;
  const skillMin = min === null ? null : min.skills;
  const mcpMin = min === null ? null : min.mcps;

  lines.push(
    "skills:       " + skills.size +
      (skillMin === null ? " verifier-confirmed (min unmeasured — rank missing)" : " verifier-confirmed (min " + skillMin + ", D48)")
  );
  lines.push(
    "mcps:         " + mcps.size +
      (mcpMin === null ? " verifier-confirmed (min unmeasured — rank missing)" : " verifier-confirmed (min " + mcpMin + ", D48)")
  );
  lines.push("sources:      " + sourceBreakdown(events));
  lines.push("event_count:  " + events.length);
  if (malformed.length > 0) {
    lines.push("malformed:    " + malformed.length + " line(s) rejected: " + malformed.join("; "));
  }

  const missing = [];
  if (rank === null) missing.push("rank");
  if (skillMin === null) missing.push("skills (minimum unmeasured)");
  if (mcpMin === null) missing.push("mcps (minimum unmeasured)");

  const shortfalls = [];
  if (skillMin !== null && skills.size < skillMin) {
    shortfalls.push("skills " + skills.size + "/" + skillMin + " verifier-confirmed (deficit " + (skillMin - skills.size) + ")");
  }
  if (mcpMin !== null && mcps.size < mcpMin) {
    shortfalls.push("mcps " + mcps.size + "/" + mcpMin + " verifier-confirmed (deficit " + (mcpMin - mcps.size) + ")");
  }

  if (rank === null || shortfalls.length > 0 || malformed.length > 0) {
    const named = [...missing, ...shortfalls];
    if (malformed.length > 0) named.push("well-formed log lines (" + malformed.length + " malformed)");
    lines.push("REJECTED — shortfall: " + named.join("; "));
    process.stdout.write(lines.join("\n") + "\n");
    process.exit(1);
  }

  lines.push(
    "APPROVED — rank " + rank + " meets the D48 per-task minimums on verifier-confirmed tokens (skills " +
      skills.size + "/" + skillMin + ", mcps " + mcps.size + "/" + mcpMin + ")"
  );
  process.stdout.write(lines.join("\n") + "\n");
  process.exit(0);
};

main();
