#!/usr/bin/env node
/*
 * dispatch-log — the runtime receipt trace (W-20, Wednesday build plan).
 *
 * Per-agent-per-task trace of which components a dispatch claimed to use.
 * The trace records what was selected or claimed at dispatch time; it is not
 * model load proof and never upgrades a claim by itself (decision D63,
 * docs/15-DECISIONS.md): a brief-named token is not "used"; only a
 * verifier-confirmed token, checked against a landed artifact, is "used".
 *
 * Storage: one JSONL file per task at .opencode/dispatch-log/<task-id>.jsonl.
 * One line per event. Each line carries:
 *   task_id  string   the task the event belongs to (matches the file name)
 *   agent    string   the agent the event is attributed to
 *   rank     string   zenith | syzygy | asterism
 *   kind     string   skill | mcp           (the kind of `token`)
 *   token    string   the component id (skill or mcp id)
 *   source   string   brief-named | receipt-claimed | verifier-confirmed
 *                     (defaults to brief-named on append)
 *   at       string   ISO 8601 timestamp (set by append at write time)
 *
 * The nine receipt fields (defined pragmatically; see D63):
 *   1 task_id  2 agent  3 rank  4 skills[]  5 mcps[]  6 source breakdown
 *   7 first_seen  8 last_seen  9 event_count
 *
 * Usage:
 *   node scripts/dispatch-log.mjs append --task <id> --agent <name> --rank <zenith|syzygy|asterism> (--skill <id> | --mcp <id>) [--source brief-named|receipt-claimed|verifier-confirmed]
 *   node scripts/dispatch-log.mjs receipt --task <id>
 *
 * append: writes ONE line to .opencode/dispatch-log/<task-id>.jsonl.
 * receipt: prints the nine-field receipt for the task; skills[] and mcps[]
 *   must each carry at least one token. Exit status:
 *   0 — receipt complete (all nine fields established, no malformed lines)
 *   1 — receipt incomplete: the missing fields are named on the output
 *   2 — usage error (bad subcommand, bad flags, unreadable arguments)
 *
 * Exit status: 0 on success, 1 on incomplete/failure, 2 on usage error.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOG_DIR = path.join(ROOT, ".opencode", "dispatch-log");

const RANKS = new Set(["zenith", "syzygy", "asterism"]);
const SOURCES = new Set(["brief-named", "receipt-claimed", "verifier-confirmed"]);
const KINDS = new Set(["skill", "mcp"]);
const TASK_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,199}$/;
const AGENT_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

const usage = () => {
  process.stderr.write(
    "Usage:\n" +
      "  node scripts/dispatch-log.mjs append --task <id> --agent <name> --rank <zenith|syzygy|asterism> (--skill <id> | --mcp <id>) [--source brief-named|receipt-claimed|verifier-confirmed]\n" +
      "  node scripts/dispatch-log.mjs receipt --task <id>\n"
  );
  process.exit(2);
};

const failUsage = (message) => {
  process.stderr.write("dispatch-log: " + message + "\n");
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

const cmdAppend = (argv) => {
  const flags = parseArgs(argv);
  for (const key of flags.keys()) {
    if (["task", "agent", "rank", "skill", "mcp", "source"].includes(key) === false) {
      failUsage("unknown flag --" + key);
    }
  }
  const task = flags.get("task");
  const agent = flags.get("agent");
  const rank = flags.get("rank");
  const skill = flags.get("skill");
  const mcp = flags.get("mcp");
  const source = flags.get("source") ?? "brief-named";

  if (typeof task !== "string" || TASK_RE.test(task) === false) {
    failUsage("--task must match " + TASK_RE.source + " (filename-safe; no separators)");
  }
  if (typeof agent !== "string" || AGENT_RE.test(agent) === false) {
    failUsage("--agent must match " + AGENT_RE.source);
  }
  if (typeof rank !== "string" || RANKS.has(rank) === false) {
    failUsage("--rank must be one of zenith|syzygy|asterism");
  }
  if ((typeof skill === "string") === (typeof mcp === "string")) {
    failUsage("exactly one of --skill or --mcp is required");
  }
  const kind = typeof skill === "string" ? "skill" : "mcp";
  const token = kind === "skill" ? skill : mcp;
  if (ID_RE.test(token) === false) {
    failUsage("--" + kind + " must match " + ID_RE.source);
  }
  if (SOURCES.has(source) === false) {
    failUsage("--source must be one of brief-named|receipt-claimed|verifier-confirmed");
  }

  const line = {
    task_id: task,
    agent,
    rank,
    kind,
    token,
    source,
    at: new Date().toISOString()
  };
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(logPath(task), JSON.stringify(line) + "\n", "utf8");
  process.stdout.write(JSON.stringify(line) + "\n");
  process.exit(0);
};

const readEvents = (file) => {
  const events = [];
  const malformed = [];
  const problems = [];
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
  return { events, malformed, problems };
};

const cmdReceipt = (argv) => {
  const flags = parseArgs(argv);
  for (const key of flags.keys()) {
    if (key !== "task") failUsage("unknown flag --" + key);
  }
  const task = flags.get("task");
  if (typeof task !== "string" || TASK_RE.test(task) === false) {
    failUsage("--task must match " + TASK_RE.source + " (filename-safe; no separators)");
  }

  const file = logPath(task);
  if (fs.existsSync(file) === false) {
    process.stdout.write(
      "task_id:      " + task + "\n" +
        "agent:        MISSING (no log at .opencode/dispatch-log/" + task + ".jsonl)\n" +
        "rank:         MISSING\n" +
        "skills:       MISSING (none recorded)\n" +
        "mcps:         MISSING (none recorded)\n" +
        "source:       MISSING (no events)\n" +
        "first_seen:   MISSING\n" +
        "last_seen:    MISSING\n" +
        "event_count:  MISSING\n" +
        "RECEIPT: INCOMPLETE — missing: agent, rank, skills, mcps, source breakdown, first_seen, last_seen, event_count\n"
    );
    process.exit(1);
  }

  const { events, malformed } = readEvents(file);
  const missing = [];
  const lines = [];

  lines.push("task_id:      " + task);

  const agents = [...new Set(events.map((e) => e.agent))];
  const ranks = [...new Set(events.map((e) => e.rank))];
  const skills = [...new Set(events.filter((e) => e.kind === "skill").map((e) => e.token))].sort();
  const mcps = [...new Set(events.filter((e) => e.kind === "mcp").map((e) => e.token))].sort();
  const sourceCounts = new Map([...SOURCES].map((s) => [s, 0]));
  for (const e of events) sourceCounts.set(e.source, (sourceCounts.get(e.source) ?? 0) + 1);
  const breakdown = [...SOURCES].map((s) => s + "=" + (sourceCounts.get(s) ?? 0)).join(", ");
  const firstSeen = events.length === 0 ? null : new Date(Math.min(...events.map((e) => e.atMs))).toISOString();
  const lastSeen = events.length === 0 ? null : new Date(Math.max(...events.map((e) => e.atMs))).toISOString();

  if (agents.length === 1) lines.push("agent:        " + agents[0]);
  else if (agents.length === 0) { lines.push("agent:        MISSING"); missing.push("agent"); }
  else { lines.push("agent:        MISSING (ambiguous: " + agents.join(", ") + ")"); missing.push("agent (ambiguous: " + agents.join(", ") + ")"); }

  if (ranks.length === 1) lines.push("rank:         " + ranks[0]);
  else if (ranks.length === 0) { lines.push("rank:         MISSING"); missing.push("rank"); }
  else { lines.push("rank:         MISSING (ambiguous: " + ranks.join(", ") + ")"); missing.push("rank (ambiguous: " + ranks.join(", ") + ")"); }

  if (skills.length > 0) lines.push("skills:       " + skills.join(", ") + " (" + skills.length + ")");
  else { lines.push("skills:       MISSING (no skill token recorded)"); missing.push("skills"); }

  if (mcps.length > 0) lines.push("mcps:         " + mcps.join(", ") + " (" + mcps.length + ")");
  else { lines.push("mcps:         MISSING (no mcp token recorded)"); missing.push("mcps"); }

  if (events.length > 0) lines.push("source:       " + breakdown);
  else { lines.push("source:       MISSING"); missing.push("source breakdown"); }

  if (firstSeen !== null) lines.push("first_seen:   " + firstSeen);
  else { lines.push("first_seen:   MISSING"); missing.push("first_seen"); }

  if (lastSeen !== null) lines.push("last_seen:    " + lastSeen);
  else { lines.push("last_seen:    MISSING"); missing.push("last_seen"); }

  if (events.length > 0) lines.push("event_count:  " + events.length);
  else { lines.push("event_count:  MISSING"); missing.push("event_count"); }

  if (malformed.length > 0) {
    lines.push("malformed:    " + malformed.length + " line(s) rejected: " + malformed.join("; "));
  }

  if (missing.length === 0 && malformed.length === 0) {
    lines.push("RECEIPT: PASS");
    process.stdout.write(lines.join("\n") + "\n");
    process.exit(0);
  }
  const allMissing = [...missing];
  if (malformed.length > 0) allMissing.push("well-formed log lines (" + malformed.length + " malformed)");
  lines.push("RECEIPT: INCOMPLETE — missing: " + allMissing.join(", "));
  process.stdout.write(lines.join("\n") + "\n");
  process.exit(1);
};

const subcommand = process.argv[2];
const rest = process.argv.slice(3);
if (subcommand === "append") cmdAppend(rest);
else if (subcommand === "receipt") cmdReceipt(rest);
else usage();
