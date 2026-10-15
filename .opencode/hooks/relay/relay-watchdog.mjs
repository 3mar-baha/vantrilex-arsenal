#!/usr/bin/env node
/**
 * relay-watchdog.mjs — relay queue deadline watchdog.
 *
 * Binding: DESIGN.md sections 4-5. Cadence 60 seconds. One bounded queue
 * query per tick for rows with status=pending AND expected_reply_by in the
 * past. Every match is delivered to the alerts side chat (delivery wired
 * in relay-hooks.json); routine traffic never lands here.
 *
 * approval_request rows ALWAYS alert and are NEVER auto-approved: any
 * pending approval_request row produces an alert regardless of its
 * deadline, and this hook performs no approval action of any kind.
 *
 * Registration: .opencode/hooks/relay/relay-hooks.json registers this hook
 * DISABLED. The owner starts the loop with an explicit enable; this file
 * never enables itself.
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

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");

function readOwnerConfig() {
  return {
    token: process.env.RELAY_NOTION_TOKEN ?? null,
    databaseId: process.env.RELAY_QUEUE_DATABASE_ID ?? null,
    alertsChat: process.env.RELAY_ALERTS_CHAT_ID ?? null,
  };
}

function simulatedRows(nowMs) {
  return [
    {
      id: "RL-1760502000",
      from: "vanbu",
      to: "opencode",
      type: "verify_request",
      status: "pending",
      etaMinutes: 30,
      // Long past: always overdue, deterministic in dry_run.
      expectedReplyBy: "2000-01-01T00:00:00.000Z",
      created: "1999-12-31T23:00:00.000Z",
    },
    {
      id: "RL-1760511000",
      from: "vanbu",
      to: "omar",
      type: "approval_request",
      status: "pending",
      etaMinutes: 60,
      // Far future: NOT overdue, yet must still alert (approval rule).
      expectedReplyBy: "2100-01-01T00:00:00.000Z",
      created: "2026-10-15T08:30:00.000Z",
    },
    {
      id: "RL-1760512000",
      from: "opencode",
      to: "vanbu",
      type: "reply",
      status: "pending",
      etaMinutes: 45,
      // Far future: not overdue, routine, stays silent.
      expectedReplyBy: "2100-01-01T01:00:00.000Z",
      created: "2026-10-15T08:40:00.000Z",
    },
    {
      id: "RL-1760501000",
      from: "vanbu",
      to: "opencode",
      type: "reply",
      status: "done",
      etaMinutes: 20,
      expectedReplyBy: "2000-01-01T00:00:00.000Z",
      created: "1999-12-31T22:00:00.000Z",
    },
  ].map((row) => ({ ...row, overdue: row.status === "pending" && Date.parse(row.expectedReplyBy) < nowMs }));
}

function selectAlerts(rows) {
  const overdue = rows.filter((row) => row.status === "pending" && row.overdue);
  const approvals = rows.filter((row) => row.status === "pending" && row.type === "approval_request");
  const seen = new Set();
  return [...overdue, ...approvals].filter((row) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}

async function queryLive(config) {
  const response = await fetch(`${NOTION_API_BASE}/databases/${config.databaseId}/query`, {
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
      page_size: 25,
    }),
  });
  if (!response.ok) throw new Error(`watchdog query failed with HTTP ${response.status}`);
  const payload = await response.json();
  return payload.results ?? [];
}

async function main() {
  const nowMs = Date.now();
  console.log(`[relay-watchdog] cadence=${WATCHDOG_INTERVAL_SECONDS}s dry_run=${DRY_RUN ? "on" : "off"}`);

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

  const alerts = selectAlerts(rows);
  if (alerts.length === 0) {
    console.log("[relay-watchdog] no overdue or approval rows: silent tick, nothing delivered");
    return;
  }

  for (const row of alerts) {
    const reason = row.type === "approval_request" ? "approval_request-always-alerts" : "deadline-passed";
    if (DRY_RUN) {
      console.log(`[relay-watchdog] dry_run: WOULD deliver alert for ${row.id} (type=${row.type} reason=${reason}) to ${alertsTarget} (not delivered)`);
    } else {
      console.log(`[relay-watchdog] ALERT ${row.id} (type=${row.type} reason=${reason}) delivery=alerts-side-chat`);
    }
  }
  if (DRY_RUN) {
    console.log(`[relay-watchdog] dry_run: zero approvals performed — approval_request rows alert, never auto-approved (not written)`);
    console.log(`[relay-watchdog] RESULT: green — ${alerts.length} alert(s) armed for the alerts side chat`);
  }
}

await main();
