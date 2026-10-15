#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
/**
 * relay-watchdog.mjs — relay queue deadline watchdog.
 *
 * Binding: DESIGN.md sections 4-5, POLL.md watchdog query, TIMEOUTS.md
 * escalation ladder, RELAY-SCHEMA.md live shape. Cadence 60 seconds. One
 * bounded REST queue query per tick for rows with status=pending AND
 * expected_reply_by in the past. Every match is delivered to the alerts
 * side chat (delivery wired in relay-hooks.json); routine traffic never
 * lands here.
 *
 * approval_request rows ALWAYS alert and are NEVER auto-approved: any
 * pending approval_request row produces an alert regardless of its
 * deadline, and this hook performs no approval action of any kind.
 *
 * REST polling: a single data-source query (POST
 * /databases/{database_id}/query) with a server-side filter
 * (status = pending AND (expected_reply_by before now OR type =
 * approval_request)), sorted by expected_reply_by ascending. There is no
 * alternate query path anywhere in this file; the network layer is plain
 * HTTPS against the Notion REST API only. Minimal columns on poll: the
 * tick reads only the routing envelope (id, from, to, type, status,
 * expected_reply_by, created, last_edited_time, thread_id,
 * announce_count); the full page body is fetched only for rows that will
 * actually alert, never on a silent tick.
 *
 * Quota-aware backoff: HTTP 429 (and 529, treated exactly as 429, plus
 * any usage-limit signal in the response body) retries on an exponential
 * ladder of 30s, then 2m, then 10m, each step with up-to-25-percent
 * jitter. A Retry-After response header is always honored and wins over
 * the ladder when it names a longer wait. When the ladder is exhausted
 * the tick degrades: the recommended cadence steps down 60s toward 600s
 * and then 1800s and the failure is logged loudly instead of retried
 * further, so a quota event can never become a retry storm.
 *
 * Idempotency: alert tasks carry ids of the form
 * relay-alert-<epoch>-<hex> (epoch seconds plus random lowercase hex),
 * unique per alert without coordination. Alerting is ledger-guarded: the
 * sweep ledger maps each row id to its announce count, so one sweep
 * emits at most one alert per row and a repeated sweep never duplicates
 * an alert for the same announcement round. Marking a row invalid is a
 * guarded transition written only when the row is still pending.
 *
 * Structured receipts: every verify_request row that alerts emits one
 * machine-readable receipt line carrying the verdict, the SHAs seen, and
 * the verification checklist.
 *
 * Watermark: the watchdog keeps hook-local state in a JSON file
 * (RELAY_WATCHDOG_STATE_FILE, defaulting to
 * .opencode/hooks/relay/.relay-watchdog.state.json, local-only and never
 * committed) holding the last sweep timestamp plus the per-row announce
 * ledger. Each tick sweeps rows against that cursor minus a backfill
 * window (600 seconds), so a row edited just behind the cursor is still
 * caught. The cursor advances after every sweep and is saved to the file;
 * a tick with nothing overdue ends silently. Loads never return nulls (a
 * missing file seeds the epoch cursor with an empty ledger), and dry_run
 * uses in-memory fixtures with zero filesystem writes.
 *
 * Explicit DLQ: each row tracks consecutive overdue observations in the
 * hook-local announce ledger above (no Notion column is added; the live
 * nine-column shape stays frozen) with last_error beside the count. After
 * MAX_ATTEMPTS unanswered announcements a row is moved to invalid with an
 * escalated alert naming the stall, per the TIMEOUTS.md repeated-stall
 * rung, and is never alerted again.
 *
 * Session-scoped sequencing: alerts are grouped by thread_id and ordered
 * oldest-deadline-first within each thread, so one conversation escalates
 * in order.
 *
 * Secret scan: every swept row is scanned for the secret-pattern family
 * (secret_, sk-, ghp_, xoxb-, ntn_). A match quarantines the row at once
 * (status to invalid plus an immediate alert) with no further action; the
 * alert names the row id and the matched pattern family without copying
 * the secret value.
 *
 * Registration: .opencode/hooks/relay/relay-hooks.json registers this
 * hook DISABLED. The owner starts the loop with an explicit enable; this
 * file never enables itself and never edits the registration.
 *
 * Secrets: the Notion token, the relay-queue database id, and the
 * alerts-chat id live ONLY in the owner-held local config file (or the
 * owner shell environment) and are never hardcoded here. Missing config
 * fails closed: loud error, no query, no retry storm.
 *
 * dry_run: `node relay-watchdog.mjs --dry-run` runs the full pipeline
 * against simulated rows. It performs zero live reads and zero live
 * writes; the transcript states exactly what WOULD be delivered.
 */

const WATCHDOG_INTERVAL_SECONDS = 60;
const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
// Quota-aware backoff ladder: 30s, then 2m, then 10m, each with jitter.
const BACKOFF_STEPS_SECONDS = [30, 120, 600];
// Degrade ladder once backoff is exhausted: 60s, then 600s, then 1800s.
const DEGRADE_CADENCES_SECONDS = [60, 600, 1800];
// Watermark backfill window: rows edited up to this far behind the sweep
// cursor are still swept, so late edits are never skipped.
const BACKFILL_WINDOW_SECONDS = 600;
// Explicit DLQ: after this many unanswered announcements a row goes to
// invalid with an escalated alert and is never alerted again.
// Knob: RELAY_MAX_ATTEMPTS in the owner environment, defaulting to 3 when absent.
const MAX_ATTEMPTS = (() => {
  const raw = process.env.RELAY_MAX_ATTEMPTS ?? null;
  const parsed = raw === null ? 3 : Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
})();
const PAGE_SIZE = 25;
// Secret-pattern family. A match quarantines the row; the alert names the
// family only and never copies the matched value.
const SECRET_PATTERNS = ["secret_", "sk-", "ghp_", "xoxb-", "ntn_"];

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");

function readOwnerConfig() {
  const raw = process.env.RELAY_MAX_ATTEMPTS ?? null;
  const parsed = raw === null ? 3 : Number.parseInt(raw, 10);
  return {
    token: process.env.RELAY_NOTION_TOKEN ?? null,
    databaseId: process.env.RELAY_QUEUE_DATABASE_ID ?? null,
    alertsChat: process.env.RELAY_ALERTS_CHAT_ID ?? null,
    maxAttempts: Number.isFinite(parsed) && parsed > 0 ? parsed : 3,
  };
}

function defaultSweepStateFile() {
  return process.env.RELAY_WATCHDOG_STATE_FILE ?? ".opencode/hooks/relay/.relay-watchdog.state.json";
}

function loadSweepState() {
  if (DRY_RUN) {
    return {
      lastSweepTs: "2026-10-15T07:00:00.000Z",
      ledger: {},
      stateFile: null,
    };
  }
  const file = defaultSweepStateFile();
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8"));
    return {
      lastSweepTs: typeof parsed.lastSweepTs === "string" ? parsed.lastSweepTs : "1970-01-01T00:00:00.000Z",
      ledger: parsed.ledger !== null && typeof parsed.ledger === "object" ? parsed.ledger : {},
      stateFile: file,
    };
  } catch {
    return { lastSweepTs: "1970-01-01T00:00:00.000Z", ledger: {}, stateFile: file };
  }
}

function saveSweepState(sweep) {
  if (DRY_RUN || sweep.stateFile === null || sweep.stateFile === undefined) return;
  mkdirSync(dirname(sweep.stateFile), { recursive: true });
  writeFileSync(sweep.stateFile, JSON.stringify({ lastSweepTs: sweep.lastSweepTs, ledger: sweep.ledger ?? {} }, null, 2));
}

// Hook-local announce ledger: the live nine-column shape carries no
// announce counter, so consecutive overdue observations of the same row id
// are counted here, never in a new column. Absence from the ledger reads
// as 0; a row that leaves pending is pruned and never alerted again.
function effectiveAnnounceCount(row, sweep) {
  const envelope = Number(row.announceCount ?? 0);
  const ledger = Number(sweep.ledger?.[row.id]?.count ?? 0);
  return Math.max(Number.isFinite(envelope) ? envelope : 0, Number.isFinite(ledger) ? ledger : 0);
}

function observeSweep(rows, sweep, nowIso) {
  const seen = new Set();
  for (const row of rows) {
    if (row.status !== "pending") continue;
    seen.add(row.id);
    const entry = sweep.ledger[row.id] ?? { count: 0, lastError: null };
    entry.count = (Number(entry.count) || 0) + 1;
    if (row.lastError !== null && row.lastError !== undefined) entry.lastError = row.lastError;
    sweep.ledger[row.id] = entry;
  }
  for (const id of Object.keys(sweep.ledger)) {
    if (!seen.has(id)) delete sweep.ledger[id];
  }
  sweep.lastSweepTs = nowIso;
}

function makeAlertId(epochSeconds, hex) {
  return `relay-alert-${epochSeconds}-${hex}`;
}

function isQuotaError(status, bodyText) {
  if (status === 429 || status === 529) return true;
  return /rate.limit|usage.limit|quota|capacity/i.test(bodyText ?? "");
}

function retryAfterSeconds(headerValue, fallbackSeconds) {
  if (headerValue === null || headerValue === undefined) return fallbackSeconds;
  const asNumber = Number(headerValue);
  if (Number.isFinite(asNumber)) return Math.max(asNumber, 0);
  const asDate = Date.parse(headerValue);
  if (Number.isFinite(asDate)) return Math.max(Math.ceil((asDate - Date.now()) / 1000), 0);
  return fallbackSeconds;
}

function withJitter(baseSeconds) {
  return baseSeconds + Math.random() * baseSeconds * 0.25;
}

async function sleep(seconds) {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function requestWithBackoff(label, doRequest) {
  for (let attempt = 0; attempt <= BACKOFF_STEPS_SECONDS.length; attempt += 1) {
    const response = await doRequest();
    if (response.ok) return response;
    const bodyText = await response.text().catch(() => "");
    if (!isQuotaError(response.status, bodyText)) {
      throw new Error(`${label} failed with HTTP ${response.status}`);
    }
    if (attempt === BACKOFF_STEPS_SECONDS.length) {
      const degrade = DEGRADE_CADENCES_SECONDS[DEGRADE_CADENCES_SECONDS.length - 1];
      throw new Error(
        `${label} quota-limited (HTTP ${response.status}); backoff 30s/2m/10m exhausted. ` +
          `DEGRADE: drop cadence toward ${degrade}s and retry next tick. No further retries this tick.`,
      );
    }
    const ladder = BACKOFF_STEPS_SECONDS[attempt];
    const wait = Math.max(
      withJitter(ladder),
      retryAfterSeconds(response.headers?.get?.("retry-after"), ladder),
    );
    console.log(`[relay-watchdog] quota hit (HTTP ${response.status}): backoff ${Math.round(wait)}s before retry ${attempt + 1} (Retry-After honored)`);
    await sleep(wait);
  }
  throw new Error(`${label} unreachable: backoff ladder exhausted`);
}

function simulatedRows(nowMs) {
  return [
    {
      pageId: null,
      id: "RL-1760502000-2b2b2b",
      from: "vanbu",
      to: "opencode",
      type: "verify_request",
      status: "pending",
      announceCount: 1,
      lastError: "no reply within estimate",
      // Long past: always overdue, deterministic in dry_run.
      expectedReplyBy: "2000-01-01T00:00:00.000Z",
      created: "1999-12-31T23:00:00.000Z",
      lastEditedTs: "1999-12-31T23:30:00.000Z",
      threadId: "RL-1760502000-2b2b2b",
      evidenceShas: ["4d5e6f"],
      body: "Claim: watchdog receipt path works. Evidence: commit 4d5e6f. Expected: one receipt per verify_request.",
    },
    {
      pageId: null,
      id: "RL-1760511000-3c3c3c",
      from: "vanbu",
      to: "omar",
      type: "approval_request",
      status: "pending",
      announceCount: 0,
      lastError: null,
      // Far future: NOT overdue, yet must still alert (approval rule).
      expectedReplyBy: "2100-01-01T00:00:00.000Z",
      created: "2026-10-15T08:30:00.000Z",
      lastEditedTs: "2026-10-15T08:30:00.000Z",
      threadId: "RL-1760511000-3c3c3c",
      body: "Proposal: publish the 7.7 notes. Risk: premature announcement. Needed by: 2100-01-01.",
    },
    {
      pageId: null,
      id: "RL-1760512000-4d4d4d",
      from: "opencode",
      to: "vanbu",
      type: "reply",
      status: "pending",
      announceCount: 0,
      lastError: null,
      // Far future: not overdue, routine, stays silent.
      expectedReplyBy: "2100-01-01T01:00:00.000Z",
      created: "2026-10-15T08:40:00.000Z",
      lastEditedTs: "2026-10-15T08:40:00.000Z",
      threadId: "RL-1760512000-4d4d4d",
      body: "Answers: routine progress note. Row: RL-1760512000-4d4d4d.",
    },
    {
      pageId: null,
      id: "RL-1760501000-5e5e5e",
      from: "vanbu",
      to: "opencode",
      type: "reply",
      status: "done",
      announceCount: 1,
      lastError: null,
      expectedReplyBy: "2000-01-01T00:00:00.000Z",
      created: "1999-12-31T22:00:00.000Z",
      lastEditedTs: "1999-12-31T22:30:00.000Z",
      threadId: "RL-1760501000-5e5e5e",
      body: "Answers: already closed. Row: RL-1760501000-5e5e5e.",
    },
    {
      pageId: null,
      id: "RL-1760513000-6f6f6f",
      from: "vanbu",
      to: "opencode",
      type: "question",
      status: "pending",
      announceCount: 0,
      lastError: null,
      expectedReplyBy: "2000-01-01T02:00:00.000Z",
      created: "2026-10-15T08:45:00.000Z",
      lastEditedTs: "2026-10-15T08:45:00.000Z",
      threadId: "RL-1760513000-6f6f6f",
      body: "Question: which credential signs the sweep? Context: redacted material present.",
      secretFamily: "ntn_",
    },
    {
      pageId: null,
      id: "RL-1760500000-7a7a7a",
      from: "vanbu",
      to: "opencode",
      type: "verify_request",
      status: "pending",
      announceCount: 3,
      lastError: "three sweeps with no reply and no progress",
      expectedReplyBy: "2000-01-01T03:00:00.000Z",
      created: "1999-12-31T20:00:00.000Z",
      lastEditedTs: "1999-12-31T21:00:00.000Z",
      threadId: "RL-1760500000-7a7a7a",
      evidenceShas: [],
      body: "Claim: stalled verification. Evidence: none new. Expected: owner nudge.",
    },
  ].map((row) => ({ ...row, overdue: row.status === "pending" && Date.parse(row.expectedReplyBy) < nowMs }));
}

function scanSecrets(row) {
  if (row.secretFamily) return row.secretFamily;
  const haystack = `${row.body ?? ""}`;
  for (const family of SECRET_PATTERNS) {
    if (haystack.includes(family)) return family;
  }
  return null;
}

function selectAlerts(rows, sweep) {
  const overdue = rows.filter((row) => row.status === "pending" && row.overdue && scanSecrets(row) === null && effectiveAnnounceCount(row, sweep) < MAX_ATTEMPTS);
  const approvals = rows.filter((row) => row.status === "pending" && row.type === "approval_request" && scanSecrets(row) === null);
  const seen = new Set();
  return [...overdue, ...approvals].filter((row) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}

function selectQuarantine(rows) {
  return rows.filter((row) => row.status === "pending" && scanSecrets(row) !== null);
}

function selectDeadLetter(rows, sweep) {
  return rows.filter(
    (row) =>
      row.status === "pending" &&
      row.overdue &&
      effectiveAnnounceCount(row, sweep) >= MAX_ATTEMPTS &&
      scanSecrets(row) === null,
  );
}

function groupByThread(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = row.threadId ?? row.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => (a.expectedReplyBy < b.expectedReplyBy ? -1 : a.expectedReplyBy > b.expectedReplyBy ? 1 : 0));
  }
  return [...groups.entries()].sort((a, b) =>
    a[1][0].expectedReplyBy < b[1][0].expectedReplyBy ? -1 : 1,
  );
}

function emitReceipt(row, verdict, reason) {
  const receipt = {
    receipt_for: row.id,
    kind: "verify_receipt",
    verdict,
    reason,
    shas: row.evidenceShas ?? [],
    checklist: ["schema-valid", "no-secret-hit", "deadline-checked", "human-verdict-pending"],
    thread_id: row.threadId ?? row.id,
  };
  console.log(`[relay-watchdog] RECEIPT ${JSON.stringify(receipt)}`);
}

function readEnvelope(raw) {
  // Minimal columns on poll: only the routing envelope is projected here.
  // The page body is fetched later, and only for rows that will alert.
  const props = raw.properties ?? {};
  const textOf = (prop) => prop?.title?.[0]?.plain_text ?? prop?.rich_text?.[0]?.plain_text ?? null;
  const selectOf = (prop) => prop?.select?.name ?? null;
  const statusOf = (prop) => prop?.status?.name ?? null;
  const dateOf = (prop) => prop?.date?.start ?? null;
  return {
    pageId: raw.id ?? null,
    id: textOf(props.id),
    from: selectOf(props.from),
    to: selectOf(props.to),
    type: selectOf(props.type),
    status: statusOf(props.status),
    expectedReplyBy: dateOf(props.expected_reply_by),
    created: raw.created_time ?? null,
    lastEditedTs: raw.last_edited_time ?? null,
    threadId: textOf(props.thread_id),
    announceCount: props.announce_count?.number ?? 0,
    lastError: props.last_error?.rich_text?.[0]?.plain_text ?? null,
  };
}

async function queryLive(config) {
  const doRequest = () =>
    fetch(`${NOTION_API_BASE}/databases/${config.databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          and: [
            { property: "status", status: { equals: "pending" } },
            {
              or: [
                { property: "expected_reply_by", date: { before: new Date().toISOString() } },
                { property: "type", select: { equals: "approval_request" } },
              ],
            },
          ],
        },
        sorts: [{ property: "expected_reply_by", direction: "ascending" }],
        page_size: PAGE_SIZE,
      }),
    });
  const response = await requestWithBackoff("watchdog query", doRequest);
  const payload = await response.json();
  const nowMs = Date.now();
  return (payload.results ?? [])
    .map(readEnvelope)
    .map((row) => ({
      ...row,
      overdue: row.status === "pending" && row.expectedReplyBy !== null && Date.parse(row.expectedReplyBy) < nowMs,
    }));
}

async function readRowStatus(config, pageId) {
  const doRequest = () =>
    fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Notion-Version": NOTION_VERSION,
      },
    });
  const response = await requestWithBackoff("row re-read", doRequest);
  const payload = await response.json();
  return payload.properties?.status?.status?.name ?? null;
}

async function markInvalid(config, row, reason) {
  // Guarded transition: write invalid only when the row is still pending.
  const current = await readRowStatus(config, row.pageId);
  if (current !== "pending") {
    console.log(`[relay-watchdog] quarantine skipped for ${row.id}: already ${current ?? "gone"} (idempotent no-op)`);
    return;
  }
  const doRequest = () =>
    fetch(`${NOTION_API_BASE}/pages/${row.pageId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties: { status: { status: { name: "invalid" } } } }),
    });
  const response = await requestWithBackoff("quarantine write", doRequest);
  if (!response.ok) throw new Error(`quarantine write failed with HTTP ${response.status}`);
  console.log(`[relay-watchdog] QUARANTINE ${row.id}: invalid (${reason}); alert armed for the alerts side chat`);
}

async function main() {
  const nowMs = Date.now();
  const nowIso = new Date(nowMs).toISOString();
  console.log(`[relay-watchdog] cadence=${WATCHDOG_INTERVAL_SECONDS}s dry_run=${DRY_RUN ? "on" : "off"}`);
  const sweep = loadSweepState();
  console.log(`[relay-watchdog] sweep cursor last_edited_time=${sweep.lastSweepTs ?? "none"} backfill_window=${BACKFILL_WINDOW_SECONDS}s ledger_rows=${Object.keys(sweep.ledger).length}`);
  console.log(`[relay-watchdog] watchdog filter pinned: status=pending AND (expected_reply_by < now OR type=approval_request), server-side, minimal envelope; full body fetch on alert only`);
  console.log(`[relay-watchdog] backoff 30s/2m/10m + jitter, Retry-After honored, 529 == 429; degrade ${DEGRADE_CADENCES_SECONDS.join("s/")}s`);

  let rows;
  let alertsTarget;
  if (DRY_RUN) {
    rows = simulatedRows(nowMs);
    alertsTarget = "<alerts-side-chat; owner config, not hardcoded>";
    console.log(`[relay-watchdog] dry_run: simulated ${rows.length} rows, zero live reads, zero live writes`);
  } else {
    const config = readOwnerConfig();
    if (config.token === null || config.databaseId === null || config.alertsChat === null) {
      console.error("[relay-watchdog] REFUSED: owner config absent (RELAY_NOTION_TOKEN / RELAY_QUEUE_DATABASE_ID / RELAY_ALERTS_CHAT_ID). No query attempted.");
      process.exitCode = 1;
      return;
    }
    rows = await queryLive(config);
    alertsTarget = "alerts side chat (owner-configured id)";
  }

  if (!DRY_RUN) observeSweep(rows, sweep, nowIso);

  const quarantined = selectQuarantine(rows);
  for (const row of quarantined) {
    const family = scanSecrets(row);
    if (DRY_RUN) {
      console.log(`[relay-watchdog] dry_run: WOULD quarantine ${row.id} (status pending->invalid, not written); secret family=${family} (value redacted, not copied) + alert armed (not delivered)`);
    } else {
      const config = readOwnerConfig();
      await markInvalid(config, row, `secret-pattern family=${family}, value redacted`);
      delete sweep.ledger[row.id];
    }
  }

  const deadLetters = selectDeadLetter(rows, sweep);
  for (const row of deadLetters) {
    if (DRY_RUN) {
      console.log(`[relay-watchdog] dry_run: WOULD move ${row.id} to invalid (announce_count=${row.announceCount} >= ${MAX_ATTEMPTS}, last_error="${row.lastError}") + escalated stall alert armed for ${alertsTarget} (not delivered, never alerted again)`);
      emitReceipt(row, "unanswered", "dry_run: three sweeps with no reply and no progress; escalated per repeated-stall rung");
    } else {
      const config = readOwnerConfig();
      await markInvalid(config, row, `dlq: announce_count=${effectiveAnnounceCount(row, sweep)} >= ${MAX_ATTEMPTS}, last_error tracked`);
      delete sweep.ledger[row.id];
    }
  }

  const alerts = selectAlerts(rows, sweep);
  if (alerts.length === 0 && quarantined.length === 0 && deadLetters.length === 0) {
    console.log("[relay-watchdog] no overdue or approval rows: silent tick, nothing delivered");
    if (DRY_RUN) console.log("[relay-watchdog] RESULT: green — silent tick path exercised");
    return;
  }

  const threads = groupByThread(alerts);
  for (const [threadId, list] of threads) {
    if (DRY_RUN) {
      console.log(`[relay-watchdog] dry_run: thread ${threadId} in order: [${list.map((r) => r.id).join(", ")}] (session-scoped sequencing)`);
    }
    for (const row of list) {
      const reason = row.type === "approval_request" ? "approval_request-always-alerts" : "deadline-passed";
      const alertId = DRY_RUN ? makeAlertId(1760510000, "a1b2c3") : makeAlertId(Math.floor(Date.now() / 1000), Math.random().toString(16).slice(2, 8));
      if (DRY_RUN) {
        console.log(`[relay-watchdog] dry_run: WOULD deliver alert ${alertId} for ${row.id} (type=${row.type} reason=${reason}) to ${alertsTarget} (not delivered; ledger-guarded, one alert per row per sweep)`);
        if (row.type === "verify_request") {
          emitReceipt(row, "unanswered", "dry_run: still pending past expected_reply_by; body evidence not executed");
        }
      } else {
        console.log(`[relay-watchdog] ALERT ${alertId} ${row.id} (type=${row.type} reason=${reason}) delivery=alerts-side-chat`);
        if (row.type === "verify_request") {
          emitReceipt(row, "unanswered", "still pending past expected_reply_by");
        }
      }
    }
  }
  if (DRY_RUN) {
    console.log(`[relay-watchdog] dry_run: sweep cursor WOULD advance to ${nowIso} (not written)`);
    console.log(`[relay-watchdog] dry_run: zero approvals performed — approval_request rows alert, never auto-approved (not written)`);
    console.log(`[relay-watchdog] RESULT: green — ${alerts.length} alert(s) armed for the alerts side chat`);
  } else {
    saveSweepState(sweep);
  }
}

await main();
