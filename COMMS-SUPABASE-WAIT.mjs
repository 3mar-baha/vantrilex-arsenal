#!/usr/bin/env node
/**
 * COMMS-SUPABASE-WAIT — background wait script for the live comms channel.
 *
 * Lane: VTA-COMMS-DASHBOARD-02, node `b-waitscript` (wave 3).
 * Doctrine binding: FULL (core ponytail posture).
 *
 * What it does: polls the `messages` table over Supabase REST every 20s plus
 * jitter for rows addressed to blazar/vantrilex-comms; on a new row from
 * vanbu it sends one ntfy POST (topic from `COMMS_NTFY_TOPIC` only, never
 * logged) and appends `{ ids, at }` to the wake file. Then it goes back to
 * waiting.
 *
 * What it NEVER does: act on rows. No CLAIM, no ACK, no INSERT, no UPDATE,
 * no DELETE against Supabase — alert only. Read-only: one REST SELECT per
 * cycle. The claim/ack/writeback protocol is owned by the watcher adapter
 * (COMMS-SUPABASE-WATCHERS.md) and the live wave, not by this script.
 *
 * Scope-first line (vs-supabase discipline): project filter is mandatory and
 * the run is fail-closed — without URL + key + project the script exits 2
 * before any network call. `read_only=true`; Storage off; Branching off;
 * zero MCP calls (this script uses HTTPS only, no MCP surface).
 *
 * RLS note (carried UNKNOWN): the schema policy `messages_project_isolation`
 * keys project identity off the session GUC `app.project`, which a REST call
 * cannot set — under an RLS-enforced role the SELECT may return zero rows
 * (fail-closed deny). The script always re-filters client-side by project
 * plus recipient as defense in depth and reports counts, never bodies.
 * Owner confirms the identity path before relying on live alerts.
 *
 * Secrets: `COMMS_SUPABASE_URL`, `COMMS_SUPABASE_ANON_KEY`, and
 * `COMMS_NTFY_TOPIC` arrive via environment only. Values are never logged,
 * never written to any file, and never appear in output — logs carry
 * presence (SET/UNSET), HTTP status codes, row ids, and counts only.
 *
 * Runtime: Node 25, ESM, zero dependencies (node:fs/os/path + fetch only).
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const POLL_MS = 20_000;
const JITTER_MS = 5_000;
const FETCH_TIMEOUT_MS = 15_000;
const NTFY_TIMEOUT_MS = 15_000;
const BODY_CAP = 1500;
/** Fixture precedent: comms-supabase-dashboard/fixtures/messages.json. */
const DEFAULT_PROJECT = "vta-comms";
const RECIPIENTS = ["blazar", "vantrilex-comms"];
const WATCH_FROM = "vanbu";
const NTFY_BASE = "https://ntfy.sh";
const PAGE_SIZE = 25;

/** Wake file the session checks at startup (USERPROFILE on Windows). */
export function defaultWakeFile() {
  return path.join(os.homedir(), ".config", "comms-hub", "wake.json");
}

/**
 * Narrowed env read: presence is reportable, values never leave this module
 * except into request headers / the request URL host.
 */
export function loadConfig(env) {
  const source = env ?? process.env;
  const get = (name) => {
    const value = source[name];
    return typeof value === "string" && value.length > 0 ? value : null;
  };
  const url = get("COMMS_SUPABASE_URL");
  const anonKey = get("COMMS_SUPABASE_ANON_KEY");
  const project = get("COMMS_SUPABASE_PROJECT") ?? DEFAULT_PROJECT;
  const topic = get("COMMS_NTFY_TOPIC");
  const maxCyclesRaw = get("COMMS_WAIT_MAX_CYCLES");
  const maxCycles = maxCyclesRaw !== null ? Number.parseInt(maxCyclesRaw, 10) : null;
  if (url === null || anonKey === null) {
    return {
      ok: false,
      reason: "missing-connection-scope",
      detail: `url=${url === null ? "UNSET" : "SET"} key=${anonKey === null ? "UNSET" : "SET"} project=${project}`,
    };
  }
  return {
    ok: true,
    url,
    anonKey,
    project,
    topic,
    maxCycles: maxCycles !== null && Number.isInteger(maxCycles) && maxCycles > 0 ? maxCycles : null,
  };
}

/** Scope line: quoted at startup; carries no secret value. */
export function scopeLine(config) {
  const project = config.ok ? config.project : "MISSING";
  return `project_ref=${project} read_only=true features=rest-select-only storage=off branching=off`;
}

/**
 * PostgREST SELECT over `messages`: project match, addressed to a watched
 * recipient, unacked, newest-first. Client-side re-filter still applies.
 */
export function buildPollUrl(base, project, limit = PAGE_SIZE) {
  const trimmed = base.replace(/\/+$/, "");
  const addressedToMe = `(${RECIPIENTS.map((r) => `to_agents.cs.{${r}}`).join(",")})`;
  const params = new URLSearchParams({
    select: "id,from_agent,to_agents,project,title,body,needs_user_action,created_at,acked_at",
    project: `eq.${project}`,
    or: addressedToMe,
    acked_at: "is.null",
    order: "created_at.desc",
    limit: String(limit),
  });
  return `${trimmed}/rest/v1/messages?${params.toString()}`;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

/**
 * Trust-boundary validation for one polled row. Returns `{ watch: true }`
 * only for a new-row-from-vanbu addressed to a watched recipient in the
 * caller project; otherwise `{ watch: false, reason }` with id plus rule
 * name — never a field value.
 */
export function isWatchedRow(row, callerProject) {
  if (row === null || typeof row !== "object" || Array.isArray(row)) {
    return { watch: false, reason: "not-a-row" };
  }
  const id = typeof row.id === "string" ? row.id : "unknown-id";
  if (!isNonEmptyString(row.from_agent)) return { watch: false, reason: `missing-from_agent:${id}` };
  if (!isNonEmptyString(row.project)) return { watch: false, reason: `missing-project:${id}` };
  if (row.project !== callerProject) return { watch: false, reason: `project-mismatch:${id}` };
  if (!isNonEmptyString(row.title)) return { watch: false, reason: `missing-title:${id}` };
  if (!isNonEmptyString(row.body)) return { watch: false, reason: `missing-body:${id}` };
  if (!Array.isArray(row.to_agents) || row.to_agents.length === 0 || !row.to_agents.every(isNonEmptyString)) {
    return { watch: false, reason: `bad-to_agents:${id}` };
  }
  if (row.from_agent !== WATCH_FROM) return { watch: false, reason: `not-from-vanbu:${id}` };
  if (!row.to_agents.some((entry) => RECIPIENTS.includes(entry))) {
    return { watch: false, reason: `not-addressed-to-me:${id}` };
  }
  if (row.acked_at !== null && row.acked_at !== undefined) {
    return { watch: false, reason: `already-acked:${id}` };
  }
  return { watch: true };
}

/** One read-only poll cycle. Never writes to Supabase. */
export async function pollOnce(config) {
  const response = await fetch(buildPollUrl(config.url, config.project), {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`poll-fetch status=${response.status}`);
  }
  const rows = await response.json();
  if (!Array.isArray(rows)) {
    throw new Error("poll-fetch payload-not-array");
  }
  return rows;
}

/**
 * Alert POST. Topic travels in the header from env only and is never logged;
 * the caller logs the status code only. Body capped per watcher contract.
 */
export async function postNtfy(topic, title, body) {
  const response = await fetch(NTFY_BASE, {
    method: "POST",
    headers: {
      Topic: topic,
      Title: String(title).slice(0, 120),
      Priority: "urgent",
    },
    body: `${String(title)}\n${String(body)}`.slice(0, BODY_CAP),
    signal: AbortSignal.timeout(NTFY_TIMEOUT_MS),
  });
  return { status: response.status, posted: response.ok };
}

/**
 * Append `{ ids, at }` to the wake file (created with parents as needed).
 * `wakeFile` override exists for the TEST-entry proof only; production calls
 * omit it and land on `defaultWakeFile()`.
 */
export function appendWakeEntry(ids, wakeFile = defaultWakeFile()) {
  const entry = { ids: Array.isArray(ids) ? ids : [ids], at: new Date().toISOString() };
  let entries = [];
  try {
    const raw = fs.readFileSync(wakeFile, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) entries = parsed;
  } catch {
    entries = [];
  }
  entries.push(entry);
  fs.mkdirSync(path.dirname(wakeFile), { recursive: true });
  fs.writeFileSync(wakeFile, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
  return entry;
}

/**
 * Single alert cycle: poll, validate, alert on new watched rows, record one
 * wake entry per cycle that alerted. `seen` is the in-memory id set (loop
 * mode); `hooks` injects ntfy/wake for the dry-run proof.
 */
export async function runOnce(config, seen = new Set(), hooks = {}) {
  const notify = hooks.notify ?? postNtfy;
  const recordWake = hooks.recordWake ?? appendWakeEntry;
  const rows = await pollOnce(config);
  let watched = 0;
  const fresh = [];
  for (const row of rows) {
    const verdict = isWatchedRow(row, config.project);
    if (!verdict.watch) continue;
    watched += 1;
    if (!seen.has(row.id)) {
      seen.add(row.id);
      fresh.push(row);
    }
  }
  if (fresh.length === 0) {
    return { polled: rows.length, watched, alerted: 0, ids: [] };
  }
  const ids = fresh.map((row) => row.id);
  if (config.topic !== null) {
    for (const row of fresh) {
      const outcome = await notify(config.topic, `comms: ${row.title}`, row.body);
      console.log(`alert id=${row.id} status=${outcome.status} posted=${outcome.posted}`);
    }
  } else {
    console.log(`alert-skipped-ntfy ids=${ids.join(",")} reason=no-topic wake-only`);
  }
  recordWake(ids);
  return { polled: rows.length, watched, alerted: fresh.length, ids };
}

/**
 * Cadence holder: 20s plus 0-5s jitter per cycle via chained timeouts.
 * Returns the stop handle. Stops on SIGINT/SIGTERM with exit 0.
 */
export function startWatcher(config, options = {}) {
  const log = options.log ?? console.log;
  const seen = new Set();
  let cycles = 0;
  let timer = null;
  let stopped = false;
  const stop = () => {
    stopped = true;
    if (timer !== null) clearTimeout(timer);
  };
  const tick = async () => {
    if (stopped) return;
    cycles += 1;
    try {
      const result = await runOnce(config, seen);
      log(`cycle=${cycles} polled=${result.polled} watched=${result.watched} alerted=${result.alerted}`);
    } catch (error) {
      log(`cycle=${cycles} error=${error instanceof Error ? error.message : String(error)}`);
    }
    if (config.maxCycles !== null && cycles >= config.maxCycles) {
      stop();
      if (typeof options.onDone === "function") options.onDone(cycles);
      return;
    }
    const delay = POLL_MS + Math.floor(Math.random() * (JITTER_MS + 1));
    timer = setTimeout(tick, delay);
  };
  const shutdown = () => {
    stop();
    log("wait-stopped");
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  timer = setTimeout(tick, 0);
  return { stop, cadenceMs: POLL_MS, jitterMs: JITTER_MS };
}

function printUsage() {
  console.log(
    [
      "usage: node COMMS-SUPABASE-WAIT.mjs [--once] [--dry-run]",
      "  --once     single poll cycle, then exit (proof / probe mode)",
      "  --dry-run  no network, no wake write; prints scope plus intent only",
      "env: COMMS_SUPABASE_URL, COMMS_SUPABASE_ANON_KEY (required),",
      "     COMMS_SUPABASE_PROJECT (default vta-comms), COMMS_NTFY_TOPIC (optional),",
      "     COMMS_WAIT_MAX_CYCLES (optional loop cap)",
    ].join("\n"),
  );
}

async function main(argv) {
  const once = argv.includes("--once");
  const dryRun = argv.includes("--dry-run");
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    return 0;
  }
  const config = loadConfig(process.env);
  console.log(`wait-scope ${scopeLine(config)}`);
  if (!config.ok) {
    console.log(`wait-abort reason=${config.reason} ${config.detail}`);
    console.log("wait-abort zero-network-calls zero-files-written");
    return 2;
  }
  if (dryRun) {
    console.log(
      `wait-dry-run project=${config.project} recipients=${RECIPIENTS.join(",")} from=${WATCH_FROM} ` +
        `topic=${config.topic === null ? "UNSET-wake-only" : "SET"} wake=${defaultWakeFile()}`,
    );
    console.log("wait-dry-run intent=single-SELECT-per-20s-plus-jitter alert-on-new-vanbu-rows never-claim-never-ack");
    console.log("wait-dry-run zero-network-calls zero-files-written");
    return 0;
  }
  if (once) {
    const result = await runOnce(config);
    console.log(`wait-once polled=${result.polled} watched=${result.watched} alerted=${result.alerted}`);
    return 0;
  }
  console.log(`wait-loop cadenceMs=${POLL_MS} jitterMs=${JITTER_MS} recipients=${RECIPIENTS.join(",")} from=${WATCH_FROM}`);
  startWatcher(config);
  return null;
}

const invoked = process.argv[1] !== undefined && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
if (invoked) {
  main(process.argv.slice(2))
    .then((code) => {
      if (code !== null) process.exit(code);
    })
    .catch((error) => {
      console.log(`wait-fatal error=${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    });
}
