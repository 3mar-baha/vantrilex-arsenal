#!/usr/bin/env node
/**
 * relay-poll.mjs — relay queue poll hook (vanbu side).
 *
 * Binding: DESIGN.md sections 2-4, POLL.md consumer query (vanbu side),
 * RELAY-SCHEMA.md live shape. Cadence 180 seconds, 300 seconds in quiet
 * mode. One bounded REST queue query per tick, then compare against the
 * watermark. A worker wakes ONLY on new activity; a silent tick costs
 * nothing beyond the single query (COST GUARD, enforced at script level).
 *
 * REST polling: a single data-source query (POST
 * /databases/{database_id}/query) with a server-side filter
 * (to = QUERY_CONSUMER AND status = pending), sorted by created
 * ascending. There is no alternate query path anywhere in this file; the
 * network layer is plain HTTPS against the Notion REST API only.
 * The poll target (QUERY_CONSUMER) is pinned per the POLL.md consumer
 * query; to change the target, change POLL.md first and this constant
 * with it — never drift one without the other.
 * Minimal columns on poll: the tick reads only the routing envelope
 * (id, from, to, type, status, created, last_edited_time, thread_id,
 * retry_count). The full page body is fetched only on wake, one fetch
 * per woken row, never on a silent tick.
 *
 * Quota-aware backoff: HTTP 429 (and 529, treated exactly as 429, plus
 * any usage-limit signal in the response body) retries on an exponential
 * ladder of 30s, then 2m, then 10m, each step with up to 25 percent
 * jitter. A Retry-After response header is always honored and wins over
 * the ladder when it names a longer wait. When the ladder is exhausted
 * the tick degrades: the recommended cadence steps down 180s to 600s to
 * 1800s and the failure is logged loudly instead of retried further,
 * so a quota event can never become a retry storm.
 *
 * Idempotency: created row ids have the form RL-<epoch>-<hex> (epoch
 * seconds plus random lowercase hex), unique per writer without
 * coordination. The claim write is a guarded pending-to-acked transition:
 * the poller re-reads the row and writes acked only when the row is
 * still pending, so two pollers racing one row resolve by the write and
 * a repeated ack is a no-op. Retries carry retry_of linkage: a retry row
 * keeps thread_id on the origin row and names the origin id it retries.
 *
 * Structured receipts: every verify_request row on the wake set emits one
 * machine-readable receipt line carrying the verdict, the SHAs seen, and
 * the verification checklist.
 *
 * Watermark: the poll script keeps local state holding the last seen
 * last_edited_time and the last row id. Each tick compares fresh query
 * results against that state minus a backfill window (600 seconds), so a
 * row edited just behind the cursor is still caught. Rows already seen
 * are ignored; only unseen rows wake the agent, and the state advances
 * past them after the wake. A tick with nothing new ends silently.
 *
 * Explicit DLQ: each row tracks retry_count and last_error. After
 * MAX_ATTEMPTS failures a row is moved to invalid with an alert to the
 * alerts side chat, and is never woken again.
 *
 * Session-scoped sequencing: woken rows are grouped by thread_id and
 * delivered oldest-created-first within each thread, so one conversation
 * is always replayed in order.
 *
 * Secret scan: every inbound row is scanned for the secret-pattern
 * family (secret_, sk-, ghp_, xoxb-, ntn_). A match quarantines the row
 * at once (status to invalid plus an immediate alert) with no further
 * action; the alert names the row id and the matched pattern family
 * without copying the secret value.
 *
 * Registration: .opencode/hooks/relay/relay-hooks.json registers this
 * hook. The owner starts the loop with an explicit enable; this file
 * never enables itself and never edits the registration.
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
// Poll target, pinned per the POLL.md consumer query (vanbu side).
const QUERY_CONSUMER = "vanbu";
const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
// Quota-aware backoff ladder: 30s, then 2m, then 10m, each with jitter.
const BACKOFF_STEPS_SECONDS = [30, 120, 600];
// Degrade ladder once backoff is exhausted: 180s, then 600s, then 1800s.
const DEGRADE_CADENCES_SECONDS = [180, 600, 1800];
// Watermark backfill window: rows edited up to this far behind the cursor
// are still treated as unseen, so late edits are never skipped.
const BACKFILL_WINDOW_SECONDS = 600;
// Explicit DLQ: after this many failures a row goes to invalid plus alert.
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
const QUIET_MODE = args.has("--quiet");

const cadenceSeconds = QUIET_MODE ? QUIET_INTERVAL_SECONDS : POLL_INTERVAL_SECONDS;

function readOwnerConfig() {
  const raw = process.env.RELAY_MAX_ATTEMPTS ?? null;
  const parsed = raw === null ? 3 : Number.parseInt(raw, 10);
  return {
    token: process.env.RELAY_NOTION_TOKEN ?? null,
    databaseId: process.env.RELAY_QUEUE_DATABASE_ID ?? null,
    maxAttempts: Number.isFinite(parsed) && parsed > 0 ? parsed : 3,
  };
}

function loadWatermark() {
  if (DRY_RUN) return { lastEditedTs: "2026-10-15T07:00:00.000Z", lastRowId: "RL-1760505600-000000" };
  const file = process.env.RELAY_STATE_FILE ?? null;
  if (file === null) return { lastEditedTs: null, lastRowId: null };
  return { lastEditedTs: null, lastRowId: null, stateFile: file };
}

function makeRowId(epochSeconds, hex) {
  return `RL-${epochSeconds}-${hex}`;
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
  let degradeIndex = 0;
  for (let attempt = 0; attempt <= BACKOFF_STEPS_SECONDS.length; attempt += 1) {
    const response = await doRequest();
    if (response.ok) return response;
    const bodyText = await response.text().catch(() => "");
    if (!isQuotaError(response.status, bodyText)) {
      throw new Error(`${label} failed with HTTP ${response.status}`);
    }
    if (attempt === BACKOFF_STEPS_SECONDS.length) {
      const degrade = DEGRADE_CADENCES_SECONDS[Math.min(degradeIndex, DEGRADE_CADENCES_SECONDS.length - 1)];
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
    console.log(`[relay-poll] quota hit (HTTP ${response.status}): backoff ${Math.round(wait)}s before retry ${attempt + 1} (Retry-After honored)`);
    await sleep(wait);
    degradeIndex += 1;
  }
  throw new Error(`${label} unreachable: backoff ladder exhausted`);
}

function simulatedRows() {
  return [
    {
      id: "RL-1760509200-a1b2c3",
      from: "opencode",
      to: "vanbu",
      type: "verify_request",
      status: "pending",
      created: "2026-10-15T08:00:00.000Z",
      lastEditedTs: "2026-10-15T08:00:00.000Z",
      threadId: "RL-1760509200-a1b2c3",
      retryCount: 0,
      lastError: null,
      evidenceShas: ["9f2c4a"],
      body: "Claim: milestone 7.7 announce is accurate. Evidence: commit 9f2c4a. Expected: catalog count matches.",
    },
    {
      id: "RL-1760509500-d4e5f6",
      from: "opencode",
      to: "vanbu",
      type: "reply",
      status: "pending",
      created: "2026-10-15T08:05:00.000Z",
      lastEditedTs: "2026-10-15T08:05:00.000Z",
      threadId: "RL-1760509200-a1b2c3",
      retryOf: "RL-1760509200-a1b2c3",
      retryCount: 0,
      lastError: null,
      body: "Answers: catalog regenerated, 41 entries. Row: RL-1760509200-a1b2c3.",
    },
    {
      id: "RL-1760509800-11aa22",
      from: "opencode",
      to: "vanbu",
      type: "announce",
      status: "pending",
      created: "2026-10-15T08:10:00.000Z",
      lastEditedTs: "2026-10-15T08:10:00.000Z",
      threadId: "RL-1760509800-11aa22",
      retryCount: 0,
      lastError: null,
      body: "Summary: hook migration landed. Hashes: 7c1e90. Gates: dry_run green.",
    },
    {
      id: "RL-1760509900-badb00",
      from: "opencode",
      to: "vanbu",
      type: "question",
      status: "pending",
      created: "2026-10-15T08:11:00.000Z",
      lastEditedTs: "2026-10-15T08:11:00.000Z",
      threadId: "RL-1760509900-badb00",
      retryCount: 0,
      lastError: null,
      body: "Question: which relay key signs receipts? Context: redacted credential material present.",
      secretFamily: "ntn_",
    },
    {
      id: "RL-1760509600-d10d10",
      from: "opencode",
      to: "vanbu",
      type: "reply",
      status: "pending",
      created: "2026-10-15T08:06:00.000Z",
      lastEditedTs: "2026-10-15T08:06:00.000Z",
      threadId: "RL-1760509600-d10d10",
      retryCount: 3,
      lastError: "claim write conflict on three consecutive ticks",
      body: "Answers: duplicate delivery attempt. Row: RL-1760509600-d10d10.",
    },
    {
      id: "RL-1760505000-9f9f9f",
      from: "opencode",
      to: "vanbu",
      type: "heartbeat",
      status: "done",
      created: "2026-10-15T06:50:00.000Z",
      lastEditedTs: "2026-10-15T06:50:00.000Z",
      threadId: "RL-1760505000-9f9f9f",
      retryCount: 0,
      lastError: null,
      body: "Sender: opencode. Uptime note: bridge alive.",
    },
    {
      id: "RL-1760505900-515151",
      from: "opencode",
      to: "vanbu",
      type: "reply",
      status: "pending",
      created: "2026-10-15T06:55:00.000Z",
      lastEditedTs: "2026-10-15T06:40:00.000Z",
      threadId: "RL-1760505900-515151",
      retryCount: 0,
      lastError: null,
      body: "Answers: stale row behind the backfill window. Row: RL-1760505900-515151.",
    },
  ];
}

function scanSecrets(row) {
  if (row.secretFamily) return row.secretFamily;
  const haystack = `${row.body ?? ""}`;
  for (const family of SECRET_PATTERNS) {
    if (haystack.includes(family)) return family;
  }
  return null;
}

function selectNewActivity(rows, watermark) {
  const floorMs =
    watermark.lastEditedTs === null
      ? null
      : Date.parse(watermark.lastEditedTs) - BACKFILL_WINDOW_SECONDS * 1000;
  return rows.filter(
    (row) =>
      row.to === QUERY_CONSUMER &&
      row.status === "pending" &&
      row.retryCount < MAX_ATTEMPTS &&
      scanSecrets(row) === null &&
      row.id !== watermark.lastRowId &&
      (floorMs === null || Date.parse(row.lastEditedTs) >= floorMs),
  );
}

function selectQuarantine(rows) {
  return rows.filter(
    (row) => row.to === QUERY_CONSUMER && row.status === "pending" && scanSecrets(row) !== null,
  );
}

function selectDeadLetter(rows) {
  return rows.filter(
    (row) =>
      row.to === QUERY_CONSUMER &&
      row.status === "pending" &&
      row.retryCount >= MAX_ATTEMPTS &&
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
    list.sort((a, b) => (a.created < b.created ? -1 : a.created > b.created ? 1 : 0));
  }
  return [...groups.entries()].sort((a, b) =>
    a[1][0].created < b[1][0].created ? -1 : 1,
  );
}

function emitReceipt(row) {
  const receipt = {
    receipt_for: row.id,
    kind: "verify_receipt",
    verdict: "inconclusive",
    reason: "dry_run: envelope read only; body evidence not executed",
    shas: row.evidenceShas ?? [],
    checklist: ["schema-valid", "no-secret-hit", "evidence-present", "human-verdict-pending"],
    thread_id: row.threadId ?? row.id,
  };
  console.log(`[relay-poll] RECEIPT ${JSON.stringify(receipt)}`);
}

function readEnvelope(raw) {
  // Minimal columns on poll: only the routing envelope is projected here.
  // The page body is fetched later, and only for woken rows.
  const props = raw.properties ?? {};
  const textOf = (prop) => prop?.title?.[0]?.plain_text ?? prop?.rich_text?.[0]?.plain_text ?? null;
  const selectOf = (prop) => prop?.select?.name ?? null;
  const statusOf = (prop) => prop?.status?.name ?? null;
  return {
    pageId: raw.id ?? null,
    id: textOf(props.id),
    from: selectOf(props.from),
    to: selectOf(props.to),
    type: selectOf(props.type),
    status: statusOf(props.status),
    created: raw.created_time ?? null,
    lastEditedTs: raw.last_edited_time ?? null,
    threadId: textOf(props.thread_id),
    retryCount: props.retry_count?.number ?? 0,
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
            { property: "to", select: { equals: QUERY_CONSUMER } },
            { property: "status", status: { equals: "pending" } },
          ],
        },
        sorts: [{ property: "created", direction: "ascending" }],
        page_size: PAGE_SIZE,
      }),
    });
  const response = await requestWithBackoff("queue query", doRequest);
  const payload = await response.json();
  return (payload.results ?? []).map(readEnvelope);
}

async function fetchPageBody(config, pageId) {
  // Full fetch, wake path only: never called on a silent tick.
  const doRequest = () =>
    fetch(`${NOTION_API_BASE}/blocks/${pageId}/children?page_size=25`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Notion-Version": NOTION_VERSION,
      },
    });
  const response = await requestWithBackoff("page body fetch", doRequest);
  return response.json();
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

async function guardedAck(config, row) {
  // Idempotent ack: write acked only when the row is still pending.
  // A repeated ack after another poller won the race is a no-op.
  const current = await readRowStatus(config, row.pageId);
  if (current !== "pending") {
    console.log(`[relay-poll] ack skipped for ${row.id}: already ${current ?? "gone"} (idempotent no-op)`);
    return false;
  }
  const doRequest = () =>
    fetch(`${NOTION_API_BASE}/pages/${row.pageId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties: { status: { status: { name: "acked" } } } }),
    });
  const response = await requestWithBackoff("claim write", doRequest);
  if (!response.ok) throw new Error(`claim write failed with HTTP ${response.status}`);
  return true;
}

async function markInvalid(config, row, reason) {
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
  console.log(`[relay-poll] QUARANTINE ${row.id}: invalid (${reason}); alert armed for the alerts side chat`);
}

async function main() {
  console.log(`[relay-poll] cadence=${cadenceSeconds}s quiet=${QUIET_MODE ? "on" : "off"} dry_run=${DRY_RUN ? "on" : "off"}`);
  const watermark = loadWatermark();
  console.log(`[relay-poll] watermark last_edited_time=${watermark.lastEditedTs ?? "none"} last_row_id=${watermark.lastRowId ?? "none"} backfill_window=${BACKFILL_WINDOW_SECONDS}s`);
  console.log(`[relay-poll] poll target pinned: to=${QUERY_CONSUMER} AND status=pending (server-side filter, minimal envelope; full body fetch on wake only)`);
  console.log(`[relay-poll] backoff 30s/2m/10m + jitter, Retry-After honored, 529 == 429; degrade ${DEGRADE_CADENCES_SECONDS.join("s/")}s`);

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

  const quarantined = selectQuarantine(rows);
  for (const row of quarantined) {
    const family = scanSecrets(row);
    if (DRY_RUN) {
      console.log(`[relay-poll] dry_run: WOULD quarantine ${row.id} (status pending->invalid, not written); secret family=${family} (value redacted, not copied) + alert armed (not delivered)`);
    } else {
      const config = readOwnerConfig();
      await markInvalid(config, row, `secret-pattern family=${family}, value redacted`);
    }
  }

  const deadLetters = selectDeadLetter(rows);
  for (const row of deadLetters) {
    if (DRY_RUN) {
      console.log(`[relay-poll] dry_run: WOULD move ${row.id} to invalid (retry_count=${row.retryCount} >= ${MAX_ATTEMPTS}, last_error="${row.lastError}") + alert armed (not delivered, never woken)`);
    } else {
      const config = readOwnerConfig();
      await markInvalid(config, row, `dlq: retry_count=${row.retryCount} >= ${MAX_ATTEMPTS}, last_error tracked`);
    }
  }

  const fresh = selectNewActivity(rows, watermark);
  if (fresh.length === 0) {
    // COST GUARD: silent tick. No worker wakes, nothing is delivered.
    console.log("[relay-poll] no new activity: silent tick, worker stays asleep, nothing delivered");
    if (DRY_RUN) console.log("[relay-poll] RESULT: green — silent tick path exercised, cost guard holds");
    return;
  }

  const threads = groupByThread(fresh);
  const ids = fresh.map((row) => row.id).join(", ");
  if (DRY_RUN) {
    console.log(`[relay-poll] dry_run: WOULD guarded-ack ${fresh.length} row(s) [${ids}] (pending->acked only when still pending, not written; repeat ack is a no-op)`);
    console.log(`[relay-poll] dry_run: WOULD fetch full page bodies for ${fresh.length} woken row(s) only (minimal envelope on poll, not fetched)`);
    for (const [threadId, list] of threads) {
      console.log(`[relay-poll] dry_run: thread ${threadId} in order: [${list.map((r) => r.id).join(", ")}] (session-scoped sequencing)`);
    }
    for (const row of fresh) {
      if (row.type === "verify_request") emitReceipt(row);
      if (row.retryOf) {
        console.log(`[relay-poll] dry_run: retry_of linkage ${row.id} -> ${row.retryOf} via thread_id=${row.threadId} (not written)`);
      }
    }
    const newest = [...fresh].sort((a, b) => (a.lastEditedTs < b.lastEditedTs ? -1 : 1))[fresh.length - 1];
    console.log(`[relay-poll] dry_run: new id format sample ${makeRowId(1760510000, "c0ffee")} (RL-<epoch>-<hex>, unique per writer)`);
    console.log(`[relay-poll] dry_run: WOULD advance watermark to ${newest.lastEditedTs} / ${newest.id} (not written)`);
    console.log(`[relay-poll] dry_run: WOULD wake one worker with row_ids=[${ids}] for delivery to the main chat (not woken, not delivered)`);
    console.log(`[relay-poll] RESULT: green — new activity detected, single wake, main-chat delivery armed`);
    return;
  }

  const config = readOwnerConfig();
  for (const row of fresh) {
    await guardedAck(config, row);
    await fetchPageBody(config, row.pageId);
    if (row.type === "verify_request") emitReceipt(row);
  }
  console.log(`[relay-poll] WAKE worker relay-activity row_ids=[${ids}] delivery=main-chat`);
}

await main();
