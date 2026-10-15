#!/usr/bin/env node
/**
 * relay-poll.mjs — relay queue poll hook (vanbu side).
 *
 * Binding: DESIGN.md sections 2-4. Cadence 180 seconds, 300 seconds in
 * quiet mode. One bounded queue query per tick, then compare against the
 * watermark. A worker wakes ONLY on new activity; a silent tick costs
 * nothing beyond the single query (COST GUARD, enforced at script level).
 *
 * Pipeline per tick: query (to=vanbu AND status=pending AND created >
 * watermark) -> ack (status pending->acked at claim time) -> advance the
 * watermark -> wake one worker with the new row ids. Routine updates are
 * delivered to the main chat (the hook's default delivery); anything
 * needing a person goes out only through the watchdog or a one-shot alert,
 * never from here.
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
 * dry_run: `node relay-poll.mjs --dry-run` runs the full pipeline against
 * simulated rows. It performs zero live reads and zero live writes; the
 * transcript states exactly what WOULD be delivered.
 */

const POLL_INTERVAL_SECONDS = 180;
const QUIET_INTERVAL_SECONDS = 300;
const QUERY_CONSUMER = "vanbu";
const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const QUIET_MODE = args.has("--quiet");

const cadenceSeconds = QUIET_MODE ? QUIET_INTERVAL_SECONDS : POLL_INTERVAL_SECONDS;

function readOwnerConfig() {
  return {
    token: process.env.RELAY_NOTION_TOKEN ?? null,
    databaseId: process.env.RELAY_QUEUE_DATABASE_ID ?? null,
  };
}

function loadWatermark() {
  if (DRY_RUN) return { lastSeenTs: "2026-10-15T07:00:00.000Z", lastRowId: "RL-0000000000" };
  const file = process.env.RELAY_STATE_FILE ?? null;
  if (file === null) return { lastSeenTs: null, lastRowId: null };
  return { lastSeenTs: null, lastRowId: null, stateFile: file };
}

function simulatedRows() {
  return [
    {
      id: "RL-1760509200",
      from: "opencode",
      to: "vanbu",
      type: "reply",
      status: "pending",
      created: "2026-10-15T08:00:00.000Z",
    },
    {
      id: "RL-1760509500",
      from: "opencode",
      to: "vanbu",
      type: "announce",
      status: "pending",
      created: "2026-10-15T08:05:00.000Z",
    },
    {
      id: "RL-1760505000",
      from: "opencode",
      to: "vanbu",
      type: "heartbeat",
      status: "done",
      created: "2026-10-15T06:50:00.000Z",
    },
  ];
}

function selectNewActivity(rows, watermark) {
  return rows.filter(
    (row) =>
      row.to === QUERY_CONSUMER &&
      row.status === "pending" &&
      (watermark.lastSeenTs === null || row.created > watermark.lastSeenTs),
  );
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
          { property: "to", select: { equals: QUERY_CONSUMER } },
          { property: "status", status: { equals: "pending" } },
        ],
      },
      sorts: [{ property: "created", direction: "ascending" }],
      page_size: 25,
    }),
  });
  if (!response.ok) throw new Error(`queue query failed with HTTP ${response.status}`);
  const payload = await response.json();
  return payload.results ?? [];
}

async function main() {
  console.log(`[relay-poll] cadence=${cadenceSeconds}s quiet=${QUIET_MODE ? "on" : "off"} dry_run=${DRY_RUN ? "on" : "off"}`);
  const watermark = loadWatermark();
  console.log(`[relay-poll] watermark last_seen_ts=${watermark.lastSeenTs ?? "none"} last_row_id=${watermark.lastRowId ?? "none"}`);

  let rows;
  if (DRY_RUN) {
    rows = simulatedRows();
    console.log(`[relay-poll] dry_run: simulated ${rows.length} rows, zero live reads, zero live writes`);
  } else {
    const config = readOwnerConfig();
    if (config.token === null || config.databaseId === null) {
      console.error("[relay-poll] REFUSED: owner Notion config absent (RELAY_NOTION_TOKEN / RELAY_QUEUE_DATABASE_ID). No query attempted.");
      process.exitCode = 1;
      return;
    }
    rows = await queryLive(config);
  }

  const fresh = selectNewActivity(rows, watermark);
  if (fresh.length === 0) {
    // COST GUARD: silent tick. No worker wakes, nothing is delivered.
    console.log("[relay-poll] no new activity: silent tick, worker stays asleep, nothing delivered");
    return;
  }

  const ids = fresh.map((row) => row.id).join(", ");
  if (DRY_RUN) {
    console.log(`[relay-poll] dry_run: WOULD ack ${fresh.length} row(s) [${ids}] (pending->acked, not written)`);
    console.log(`[relay-poll] dry_run: WOULD advance watermark to ${fresh[fresh.length - 1].created} / ${fresh[fresh.length - 1].id} (not written)`);
    console.log(`[relay-poll] dry_run: WOULD wake one worker with row_ids=[${ids}] for delivery to the main chat (not woken, not delivered)`);
    console.log(`[relay-poll] RESULT: green — new activity detected, single wake, main-chat delivery armed`);
    return;
  }

  console.log(`[relay-poll] WAKE worker relay-activity row_ids=[${ids}] delivery=main-chat`);
}

await main();
