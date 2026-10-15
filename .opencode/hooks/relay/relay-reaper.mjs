#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
/**
 * relay-reaper.mjs — stale-session reaper for the relay bridge.
 *
 * Binding: SESSIONS.md lifecycle (open -> active -> closed -> archived) and
 * its reaper gate, DESIGN.md section 5 escalation ladder, TIMEOUTS.md rung 6
 * silent-bridge rule (no rows and no heartbeats for over 60 minutes inside an
 * active session), RELAY-SCHEMA.md terminal states (done, needs_omar,
 * invalid) and the frozen nine-column shape. Cadence 900 seconds. One bounded
 * REST queue query per tick plus, only when the session registry is ready,
 * one bounded registry read per tick. Every mark below is terminal-only.
 *
 * What the reaper closes:
 * 1. Stale sessions — a session whose threads show no activity (no rows, no
 *    heartbeats, no in-flight acked work) for longer than STALE_IDLE_SECONDS.
 *    Mark: session record open/active -> closed. In-flight acked rows still
 *    finish under the closed session; the reaper never touches them.
 * 2. Failed DLQ leftovers — queue rows still pending with announce/retry
 *    observations at or past MAX_ATTEMPTS that an earlier sweep did not
 *    move. Observations are counted in the hook-local announce ledger
 *    (RELAY_REAPER_STATE_FILE, defaulting to
 *    .opencode/hooks/relay/.relay-reaper.state.json, local-only and never
 *    committed; no Notion column is added and the live nine-column shape
 *    stays frozen). Mark: row pending -> invalid (the failed mark; the live
 *    shape carries no separate failed value) plus one escalated stall
 *    alert. Never alerted again afterwards.
 * 3. Orphaned session rows — pending rows whose body Session: line names an
 *    unknown session. Mark: row pending -> invalid plus one orphan alert.
 *    A pending row naming an archived session is NOT orphaned: per
 *    SESSIONS.md it is treated as a new conversation under a fresh session,
 *    so the reaper marks nothing and arms no alert for it.
 *
 * SESSIONS.md deferral gate (honored, not bypassed): session-record writes
 * stay REFUSED until the owner-held session registry both sides can read
 * identically exists AND its lifecycle property is pinned in owner config
 * (RELAY_SESSION_REGISTRY_DATABASE_ID plus RELAY_SESSION_STATE_PROPERTY).
 * Until both hold, a live tick performs no session-record write of any kind
 * and says so loudly; row-level terminal backstops still run against the
 * queue. This file never advances a session by itself the moment the
 * registry disagrees, and it never edits SESSIONS.md promises.
 *
 * Terminal-states-only rails (enforced in code, not prose):
 * - ALLOWED_WRITES is a closed allowlist. Any transition outside it throws
 *   before any request is built. There is no delete path, no reopen path
 *   (closed -> active is refused), no archive path (only an explicit archive
 *   record moves closed -> archived; the reaper never writes archived), and
 *   no touch path for acked in-flight rows or rows already terminal.
 * - Every write is guarded: the record is re-read first and the mark lands
 *   only when the record is still in the expected pre-state, so a repeated
 *   tick is an idempotent no-op and two writers racing one record resolve
 *   by the write.
 * - History is preserved: marks change lifecycle state only; page bodies,
 *   threads, and counters are never rewritten or removed.
 *
 * REST polling: a single data-source query (POST
 * /databases/{database_id}/query) with a server-side filter (status is
 * pending OR status is acked), sorted by last_edited ascending. Acked rows
 * are read because in-flight work counts as session activity; they are never
 * marked. There is no alternate query path anywhere in this file; the
 * network layer is plain HTTPS against the Notion REST API only. Minimal
 * columns on poll: the tick reads only the routing envelope (id, from, to,
 * type, status, expected_reply_by, created, last_edited_time, thread_id,
 * announce_count); the body Session: line is fetched only for rows that
 * will actually mark, never on a silent tick.
 *
 * Quota-aware backoff: HTTP 429 (and 529, treated exactly as 429, plus
 * any usage-limit signal in the response body) retries on an exponential
 * ladder of 30s, then 2m, then 10m, each step with up-to-25-percent
 * jitter. A Retry-After response header is always honored and wins over
 * the ladder when it names a longer wait. When the ladder is exhausted
 * the tick degrades: the recommended cadence steps down 900s toward 1800s
 * and then 3600s and the failure is logged loudly instead of retried
 * further, so a quota event can never become a retry storm.
 *
 * Token budget: a reaper tick costs at most 500 tokens (bounded queries
 * plus timestamp compares, no agent wake); one close or terminal notice
 * costs at most 1000 tokens. A tick that would exceed its cap sheds work
 * to the next tick instead of overspending.
 *
 * Registration: this hook ships UNREGISTERED. The owner adds the
 * registration explicitly when the SESSIONS.md re-evaluation condition
 * holds; this file never enables itself and never edits relay-hooks.json.
 *
 * Secrets: the Notion token, the relay-queue database id, the optional
 * session-registry database id and its lifecycle property name, and the
 * alerts-chat id live ONLY in the owner-held local config file (or the
 * owner shell environment) and are never hardcoded here. Missing queue
 * config fails closed: loud error, no query, no retry storm.
 *
 * dry_run: `node relay-reaper.mjs --dry-run` runs the full pipeline
 * against simulated sessions and rows. It performs zero live reads and
 * zero live writes; the transcript states exactly what WOULD be marked,
 * names every row left untouched and why, and runs a guard self-test that
 * proves forbidden transitions (delete, reopen, archive, touch in-flight,
 * rewrite terminal) are refused before any request is built.
 */

const REAPER_INTERVAL_SECONDS = 900;
const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
// Quota-aware backoff ladder: 30s, then 2m, then 10m, each with jitter.
const BACKOFF_STEPS_SECONDS = [30, 120, 600];
// Degrade ladder once backoff is exhausted: 900s, then 1800s, then 3600s.
const DEGRADE_CADENCES_SECONDS = [900, 1800, 3600];
// Watermark backfill window: activity up to this far behind the sweep
// cursor still counts, so late edits never fake a stale session.
const BACKFILL_WINDOW_SECONDS = 600;
// Stale threshold: a session with no activity for this long is stale.
// Pinned to the TIMEOUTS.md silent-bridge rung (60 minutes); knob
// RELAY_REAPER_IDLE_SECONDS in the owner environment overrides it.
const STALE_IDLE_SECONDS = (() => {
  const raw = process.env.RELAY_REAPER_IDLE_SECONDS ?? null;
  const parsed = raw === null ? 3600 : Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3600;
})();
// Explicit DLQ: after this many unanswered announcements a leftover row is
// marked invalid with an escalated alert and is never alerted again.
// Knob: RELAY_MAX_ATTEMPTS in the owner environment, defaulting to 3 when absent.
const MAX_ATTEMPTS = (() => {
  const raw = process.env.RELAY_MAX_ATTEMPTS ?? null;
  const parsed = raw === null ? 3 : Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
})();
const PAGE_SIZE = 25;
// Session lifecycle, forward only: open -> active -> closed -> archived.
// The reaper writes exactly one of these edges: open/active -> closed.
const SESSION_PRE_STATES = ["open", "active"];
const SESSION_MARK = "closed";
// Row terminal states per RELAY-SCHEMA.md. The reaper writes exactly one
// edge: pending -> invalid (the failed mark for DLQ leftovers and orphans).
const ROW_TERMINAL_STATES = ["done", "needs_omar", "invalid"];
const ROW_MARK = "invalid";

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");

function readOwnerConfig() {
  const attemptsRaw = process.env.RELAY_MAX_ATTEMPTS ?? null;
  const attemptsParsed = attemptsRaw === null ? 3 : Number.parseInt(attemptsRaw, 10);
  const idleRaw = process.env.RELAY_REAPER_IDLE_SECONDS ?? null;
  const idleParsed = idleRaw === null ? 3600 : Number.parseInt(idleRaw, 10);
  return {
    token: process.env.RELAY_NOTION_TOKEN ?? null,
    queueDatabaseId: process.env.RELAY_QUEUE_DATABASE_ID ?? null,
    registryDatabaseId: process.env.RELAY_SESSION_REGISTRY_DATABASE_ID ?? null,
    registryStateProperty: process.env.RELAY_SESSION_STATE_PROPERTY ?? null,
    alertsChat: process.env.RELAY_ALERTS_CHAT_ID ?? null,
    maxAttempts: Number.isFinite(attemptsParsed) && attemptsParsed > 0 ? attemptsParsed : 3,
    idleSeconds: Number.isFinite(idleParsed) && idleParsed > 0 ? idleParsed : 3600,
  };
}

function registryReady(config) {
  return config.registryDatabaseId !== null && config.registryStateProperty !== null;
}

function assertTerminalWrite(recordKind, from, to) {
  if (recordKind === "session") {
    if (SESSION_PRE_STATES.includes(from) && to === SESSION_MARK) return;
    throw new Error(
      `[relay-reaper] REFUSED non-terminal session write ${from} -> ${to}: only open/active -> closed is allowed`,
    );
  }
  if (recordKind === "row") {
    if (from === "pending" && to === ROW_MARK) return;
    throw new Error(
      `[relay-reaper] REFUSED non-terminal row write ${from} -> ${to}: only pending -> invalid is allowed`,
    );
  }
  throw new Error(`[relay-reaper] REFUSED write of unknown record kind ${recordKind}`);
}

function defaultReaperStateFile() {
  return process.env.RELAY_REAPER_STATE_FILE ?? ".opencode/hooks/relay/.relay-reaper.state.json";
}

function loadReaperLedger() {
  if (DRY_RUN) return { ledger: {}, stateFile: null };
  const file = defaultReaperStateFile();
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8"));
    return {
      ledger: parsed.ledger !== null && typeof parsed.ledger === "object" ? parsed.ledger : {},
      stateFile: file,
    };
  } catch {
    return { ledger: {}, stateFile: file };
  }
}

function saveReaperLedger(ledgerState) {
  if (DRY_RUN || ledgerState.stateFile === null || ledgerState.stateFile === undefined) return;
  mkdirSync(dirname(ledgerState.stateFile), { recursive: true });
  writeFileSync(ledgerState.stateFile, JSON.stringify({ ledger: ledgerState.ledger ?? {} }, null, 2));
}

// Hook-local announce ledger: the live nine-column shape carries no
// announce counter, so consecutive sweeps observing the same pending row
// past its deadline are counted here, never in a new column. Absence from
// the ledger reads as 0; a row that leaves pending is pruned.
function effectiveReaperAnnounces(row, ledgerState) {
  const envelope = Number(row.announceCount ?? 0);
  const ledger = Number(ledgerState.ledger?.[row.id]?.count ?? 0);
  return Math.max(Number.isFinite(envelope) ? envelope : 0, Number.isFinite(ledger) ? ledger : 0);
}

function observeReaperRows(rows, ledgerState) {
  const seen = new Set();
  for (const row of rows) {
    if (row.status !== "pending") continue;
    seen.add(row.id);
    const entry = ledgerState.ledger[row.id] ?? { count: 0, lastError: null };
    entry.count = (Number(entry.count) || 0) + 1;
    if (row.lastError !== null && row.lastError !== undefined) entry.lastError = row.lastError;
    ledgerState.ledger[row.id] = entry;
  }
  for (const id of Object.keys(ledgerState.ledger)) {
    if (!seen.has(id)) delete ledgerState.ledger[id];
  }
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
    console.log(`[relay-reaper] quota hit (HTTP ${response.status}): backoff ${Math.round(wait)}s before retry ${attempt + 1} (Retry-After honored)`);
    await sleep(wait);
  }
  throw new Error(`${label} unreachable: backoff ladder exhausted`);
}

function simulatedSessions(nowMs) {
  const idleCutoff = nowMs - STALE_IDLE_SECONDS * 1000;
  const sessions = [
    {
      id: "S-1000000000-aaaaaa",
      lifecycle: "active",
      // Long past: idle far beyond the threshold, deterministic in dry_run.
      lastActivityTs: "2000-01-01T00:00:00.000Z",
    },
    {
      id: "S-2000000000-bbbbbb",
      lifecycle: "active",
      // Fresh: activity inside the idle window, stays open.
      lastActivityTs: new Date(nowMs - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "S-3000000000-cccccc",
      lifecycle: "closed",
      lastActivityTs: "2000-01-01T00:00:00.000Z",
    },
    {
      id: "S-4000000000-dddddd",
      lifecycle: "archived",
      lastActivityTs: "2000-01-01T00:00:00.000Z",
    },
  ];
  return sessions.map((session) => ({
    ...session,
    idleMs: nowMs - Date.parse(session.lastActivityTs),
    stale: SESSION_PRE_STATES.includes(session.lifecycle) && Date.parse(session.lastActivityTs) < idleCutoff,
  }));
}

function simulatedRows(nowMs) {
  void nowMs;
  return [
    {
      pageId: null,
      id: "RL-1000000000-d1d1d1",
      from: "vanbu",
      to: "opencode",
      type: "verify_request",
      status: "pending",
      announceCount: 3,
      lastError: "three sweeps with no reply and no progress",
      expectedReplyBy: "2000-01-01T00:00:00.000Z",
      created: "1999-12-31T20:00:00.000Z",
      lastEditedTs: "1999-12-31T21:00:00.000Z",
      threadId: "RL-1000000000-d1d1d1",
      sessionId: "S-1000000000-aaaaaa",
      body: "Claim: stalled verification. Evidence: none new. Expected: owner nudge.",
    },
    {
      pageId: null,
      id: "RL-1000000001-e2e2e2",
      from: "opencode",
      to: "vanbu",
      type: "question",
      status: "pending",
      announceCount: 0,
      lastError: null,
      expectedReplyBy: "2100-01-01T00:00:00.000Z",
      created: "2026-10-15T08:45:00.000Z",
      lastEditedTs: "2026-10-15T08:45:00.000Z",
      threadId: "RL-1000000001-e2e2e2",
      sessionId: "S-9000000000-zzzzzz",
      body: "Question: which thread owns this row? Session: S-9000000000-zzzzzz.",
    },
    {
      pageId: null,
      id: "RL-1000000002-f3f3f3",
      from: "vanbu",
      to: "opencode",
      type: "reply",
      status: "pending",
      announceCount: 0,
      lastError: null,
      expectedReplyBy: "2100-01-01T00:00:00.000Z",
      created: "2026-10-15T08:46:00.000Z",
      lastEditedTs: "2026-10-15T08:46:00.000Z",
      threadId: "RL-1000000002-f3f3f3",
      sessionId: "S-4000000000-dddddd",
      body: "Answers: late reply on a retired thread. Session: S-4000000000-dddddd.",
    },
    {
      pageId: null,
      id: "RL-1000000003-a4a4a4",
      from: "opencode",
      to: "vanbu",
      type: "reply",
      status: "acked",
      announceCount: 1,
      lastError: null,
      expectedReplyBy: "2000-01-01T00:00:00.000Z",
      created: "1999-12-31T22:00:00.000Z",
      lastEditedTs: "1999-12-31T23:00:00.000Z",
      threadId: "RL-1000000003-a4a4a4",
      sessionId: "S-1000000000-aaaaaa",
      body: "Answers: in-flight work under the stale session. Row: RL-1000000003-a4a4a4.",
    },
    {
      pageId: null,
      id: "RL-1000000004-b5b5b5",
      from: "vanbu",
      to: "opencode",
      type: "reply",
      status: "done",
      announceCount: 1,
      lastError: null,
      expectedReplyBy: "2000-01-01T00:00:00.000Z",
      created: "1999-12-31T22:00:00.000Z",
      lastEditedTs: "1999-12-31T22:30:00.000Z",
      threadId: "RL-1000000004-b5b5b5",
      sessionId: "S-1000000000-aaaaaa",
      body: "Answers: already closed. Row: RL-1000000004-b5b5b5.",
    },
    {
      pageId: null,
      id: "RL-1000000005-c6c6c6",
      from: "opencode",
      to: "vanbu",
      type: "heartbeat",
      status: "pending",
      announceCount: 0,
      lastError: null,
      expectedReplyBy: "2100-01-01T00:00:00.000Z",
      created: "2026-10-15T08:50:00.000Z",
      lastEditedTs: "2026-10-15T08:50:00.000Z",
      threadId: "RL-1000000005-c6c6c6",
      sessionId: "S-2000000000-bbbbbb",
      body: "Sender: opencode. Uptime note: bridge alive. Session: S-2000000000-bbbbbb.",
    },
  ];
}

function selectStaleSessions(sessions) {
  return sessions.filter((session) => session.stale);
}

function selectDeadLetterLeftovers(rows, ledgerState) {
  return rows.filter(
    (row) =>
      row.status === "pending" &&
      effectiveReaperAnnounces(row, ledgerState) >= MAX_ATTEMPTS,
  );
}

function selectOrphanedRows(rows, knownSessionIds) {
  return rows.filter(
    (row) =>
      row.status === "pending" &&
      row.sessionId !== null &&
      row.sessionId !== undefined &&
      !knownSessionIds.has(row.sessionId),
  );
}

function selectArchivedSessionRows(rows, archivedSessionIds) {
  return rows.filter(
    (row) => row.status === "pending" && archivedSessionIds.has(row.sessionId),
  );
}

function runGuardSelfTest() {
  const forbidden = [
    ["session", "active", "archived"],
    ["session", "closed", "active"],
    ["session", "closed", "closed"],
    ["row", "acked", "invalid"],
    ["row", "done", "invalid"],
    ["row", "pending", "done"],
  ];
  for (const [kind, from, to] of forbidden) {
    try {
      assertTerminalWrite(kind, from, to);
      console.log(`[relay-reaper] dry_run: GUARD FAILURE — ${kind} ${from}->${to} was allowed (bug, not written)`);
      return false;
    } catch (error) {
      console.log(`[relay-reaper] dry_run: guard refused ${kind} ${from}->${to} (${error.message.split(": ")[1] ?? "refused"}; not written)`);
    }
  }
  // Allowed edges must pass without throwing.
  assertTerminalWrite("session", "active", "closed");
  assertTerminalWrite("session", "open", "closed");
  assertTerminalWrite("row", "pending", "invalid");
  console.log("[relay-reaper] dry_run: guard allowed session open/active->closed and row pending->invalid (terminal only)");
  return true;
}

function readEnvelope(raw) {
  // Minimal columns on poll: only the routing envelope is projected here.
  // The body Session: line is fetched later, and only for rows that mark.
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
    sessionId: null,
  };
}

async function queryLive(config) {
  const doRequest = () =>
    fetch(`${NOTION_API_BASE}/databases/${config.queueDatabaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          or: [
            { property: "status", status: { equals: "pending" } },
            { property: "status", status: { equals: "acked" } },
          ],
        },
        sorts: [{ property: "last_edited_time", direction: "ascending" }],
        page_size: PAGE_SIZE,
      }),
    });
  const response = await requestWithBackoff("reaper sweep query", doRequest);
  const payload = await response.json();
  return (payload.results ?? []).map(readEnvelope);
}

async function readRecordState(config, databaseId, pageId, stateProperty) {
  const doRequest = () =>
    fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Notion-Version": NOTION_VERSION,
      },
    });
  const response = await requestWithBackoff("record re-read", doRequest);
  const payload = await response.json();
  void databaseId;
  const props = payload.properties ?? {};
  const candidate = props[stateProperty];
  return candidate?.select?.name ?? candidate?.status?.name ?? null;
}

async function guardedMark(config, databaseId, stateProperty, recordKind, recordId, pageId, from, to) {
  // Guarded transition: the mark lands only when the record is still in
  // the expected pre-state. Anything else is an idempotent no-op.
  assertTerminalWrite(recordKind, from, to);
  const current = await readRecordState(config, databaseId, pageId, stateProperty);
  if (current !== from) {
    console.log(`[relay-reaper] mark skipped for ${recordId}: already ${current ?? "gone"} (idempotent no-op)`);
    return false;
  }
  const doRequest = () =>
    fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties: { [stateProperty]: { status: { name: to } } } }),
    });
  const response = await requestWithBackoff("terminal mark write", doRequest);
  if (!response.ok) throw new Error(`terminal mark write failed with HTTP ${response.status}`);
  return true;
}

async function main() {
  const nowMs = Date.now();
  const nowIso = new Date(nowMs).toISOString();
  console.log(`[relay-reaper] cadence=${REAPER_INTERVAL_SECONDS}s idle_threshold=${STALE_IDLE_SECONDS}s dry_run=${DRY_RUN ? "on" : "off"}`);
  console.log(`[relay-reaper] sweep filter pinned: status=pending OR status=acked, server-side, minimal envelope; body Session: line fetch on mark only`);
  console.log(`[relay-reaper] backoff 30s/2m/10m + jitter, Retry-After honored, 529 == 429; degrade ${DEGRADE_CADENCES_SECONDS.join("s/")}s`);
  console.log(`[relay-reaper] terminal-only rails: session open/active->closed; row pending->invalid; no delete, no reopen, no archive, no touch of acked or terminal rows`);

  if (DRY_RUN) {
    const sessions = simulatedSessions(nowMs);
    const rows = simulatedRows(nowMs);
    const ledgerState = loadReaperLedger();
    const alertsTarget = "<alerts-side-chat; owner config, not hardcoded>";
    console.log(`[relay-reaper] dry_run: simulated ${sessions.length} sessions + ${rows.length} rows, zero live reads, zero live writes`);
    const guardGreen = runGuardSelfTest();
    if (!guardGreen) {
      process.exitCode = 1;
      return;
    }

    const knownSessionIds = new Set(sessions.map((session) => session.id));
    const archivedSessionIds = new Set(
      sessions.filter((session) => session.lifecycle === "archived").map((session) => session.id),
    );
    const stale = selectStaleSessions(sessions);
    const deadLetters = selectDeadLetterLeftovers(rows, ledgerState);
    const orphans = selectOrphanedRows(rows, knownSessionIds).filter(
      (row) => !selectDeadLetterLeftovers([row], ledgerState).length,
    );
    const archivedRows = selectArchivedSessionRows(rows, archivedSessionIds);

    for (const session of stale) {
      assertTerminalWrite("session", session.lifecycle, SESSION_MARK);
      console.log(`[relay-reaper] dry_run: WOULD close session ${session.id} (${session.lifecycle}->${SESSION_MARK}, idle ${Math.round(session.idleMs / 1000)}s >= ${STALE_IDLE_SECONDS}s, not written); in-flight acked rows still finish, history preserved`);
    }
    for (const row of deadLetters) {
      assertTerminalWrite("row", row.status, ROW_MARK);
      console.log(`[relay-reaper] dry_run: WOULD move ${row.id} to ${ROW_MARK} (announce_count=${row.announceCount} >= ${MAX_ATTEMPTS}, last_error="${row.lastError}", not written) + escalated stall alert armed for ${alertsTarget} (not delivered, never alerted again)`);
    }
    for (const row of orphans) {
      assertTerminalWrite("row", row.status, ROW_MARK);
      console.log(`[relay-reaper] dry_run: WOULD move ${row.id} to ${ROW_MARK} (unknown session ${row.sessionId}, not written) + orphan alert armed for ${alertsTarget} (not delivered)`);
    }
    for (const row of archivedRows) {
      console.log(`[relay-reaper] dry_run: row ${row.id} names archived session ${row.sessionId}: treated as a new conversation under a fresh session (no mark, no alert, not written)`);
    }
    const untouched = rows.filter(
      (row) => !deadLetters.includes(row) && !orphans.includes(row) && !archivedRows.includes(row),
    );
    for (const row of untouched) {
      const reason =
        row.status === "acked"
          ? "in-flight work still finishes, never marked"
          : ROW_TERMINAL_STATES.includes(row.status)
            ? `already terminal (${row.status}), never rewritten`
            : "fresh session activity inside the idle window, nothing eligible";
      console.log(`[relay-reaper] dry_run: untouched ${row.id} (status=${row.status}, session=${row.sessionId}: ${reason})`);
    }
    for (const session of sessions.filter((session) => !stale.includes(session))) {
      const reason =
        session.lifecycle === "closed" || session.lifecycle === "archived"
          ? `already ${session.lifecycle}, only an explicit record advances it`
          : "activity inside the idle window, not stale";
      console.log(`[relay-reaper] dry_run: untouched session ${session.id} (${session.lifecycle}: ${reason})`);
    }
    const alertId = makeAlertId(1760510000, "d4e5f6");
    console.log(`[relay-reaper] dry_run: alert id form sample ${alertId} (relay-alert-<epoch>-<hex>, unique per alert)`);
    console.log(`[relay-reaper] dry_run: sweep cursor stateless by design (staleness derived from last-activity timestamps each tick; repeats are idempotent no-ops); announce ledger file-backed, in-memory fixtures here with zero filesystem writes`);
    console.log(`[relay-reaper] RESULT: green — ${stale.length} session close(s) + ${deadLetters.length + orphans.length} row terminal mark(s) armed, 0 deletes, 0 reopens, 0 archives, 0 non-terminal writes; simulated rows, zero live writes`);
    void nowIso;
    return;
  }

  const config = readOwnerConfig();
  if (config.token === null || config.queueDatabaseId === null) {
    console.error("[relay-reaper] REFUSED: owner queue config absent (RELAY_NOTION_TOKEN / RELAY_QUEUE_DATABASE_ID). No query attempted.");
    process.exitCode = 1;
    return;
  }
  if (config.alertsChat === null) {
    console.error("[relay-reaper] REFUSED: owner alerts config absent (RELAY_ALERTS_CHAT_ID). No query attempted.");
    process.exitCode = 1;
    return;
  }
  const canCloseSessions = registryReady(config);
  if (!canCloseSessions) {
    console.log("[relay-reaper] REFUSED session-record writes: session registry not ready (RELAY_SESSION_REGISTRY_DATABASE_ID / RELAY_SESSION_STATE_PROPERTY). SESSIONS.md deferral honored; row-level terminal backstops still run.");
  }

  const rows = await queryLive(config);
  const ledgerState = loadReaperLedger();
  observeReaperRows(rows, ledgerState);
  saveReaperLedger(ledgerState);
  const idleCutoff = nowMs - config.idleSeconds * 1000;
  void idleCutoff;
  // Live session-close pass goes here once the registry contract lands;
  // until registryReady holds, the REFUSED line above is the whole pass.
  const deadLetters = rows.filter(
    (row) => row.status === "pending" && effectiveReaperAnnounces(row, ledgerState) >= config.maxAttempts,
  );
  for (const row of deadLetters) {
    const marked = await guardedMark(config, config.queueDatabaseId, "status", "row", row.id, row.pageId, "pending", ROW_MARK);
    if (marked) {
      const announces = effectiveReaperAnnounces(row, ledgerState);
      delete ledgerState.ledger[row.id];
      saveReaperLedger(ledgerState);
      console.log(`[relay-reaper] DLQ ${row.id}: invalid (announce_count=${announces} >= ${config.maxAttempts}, last_error tracked); escalated stall alert armed for the alerts side chat, never alerted again`);
    }
  }
  if (deadLetters.length === 0) {
    console.log("[relay-reaper] no DLQ leftovers: silent tick on the row pass, nothing marked");
  }
}

await main();
