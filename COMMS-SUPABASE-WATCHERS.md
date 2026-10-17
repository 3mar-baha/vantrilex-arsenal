# COMMS-SUPABASE-WATCHERS — Supabase-intake watcher adapter (PC) + vanbu-side spec

Status: SPEC-ONLY reviewed text DRAFT. Live execution HELD for owner OAuth (NOT-RUN).

Lane: VTA-COMMS-SUPABASE-01, node `d-watchers` (wave 3; SPEC-ONLY).

Scope-first line (proposed, not executed): `project_ref=<owner-confirmed>`, `read_only=true`, `features=<narrowest group for the concern>`; Storage stays off (the brief names no storage concern and gives no why); Branching stays off (experimental, paid-plan-gated; no gate named in the brief). Zero MCP calls were attempted on this node — see Skill discipline.

Sources: `COMMS-SUPABASE-SCHEMA.sql` (root, wave-0 draft, read live 2026-10-17, lines 1–88); `COMMS-SUPABASE-BUS.md` (root, wave-1 spec, read live 2026-10-17); `COMMS-SUPABASE-DASHBOARD.md` (root, wave-2 spec, read live 2026-10-17); `AGENT.md` task-log lines 133–134 plus 153 (POST-path contract plus gap record, read live 2026-10-17); `WORKFLOW.md` Part B (order DAG, read live 2026-10-17); `vs-supabase` SKILL.md on branch `wt/supabase-capability` (method, read-only via `git show`, 2026-10-17); `.githooks/pre-commit` (observed secret patterns, read live 2026-10-17). No live Supabase call ran; every live claim below is marked NOT-RUN or `unverified`.

Unknowns carried (not resolved here): RLS project-identity source is UNKNOWN (schema file carries this explicitly; owner confirmation required before apply). The `d-notifycheck` gap report lives in the session findings plus the `AGENT.md` record — no gap file exists in this tree and the comms repo holding the PC watcher is not checked out on this lane, so the `maybePostNtfyDirect` file:line is UNKNOWN here and the POST-path contract below is cited from the `AGENT.md` record instead (never invented). The ORDER §§1–2 text is not in this tree, so the ORDER-canonical field mapping is carried as UNKNOWN (owner or vanbu confirm before LIVE). The `~20s` cadence value is brief-stated; the PC watcher's own tick file:line is `unverified` here. `pgcrypto` availability is `unverified` (no live extension check ran).

## Required adapter (from the d-notifycheck gap)

Gap (quoted from the `AGENT.md` wave-2 record, 2026-10-17): the merged PC-watcher ntfy path covers git-sourced envelopes with file:line evidence, but NO Supabase adapter exists — the boolean check is source-agnostic, so an adapter feeding the same shape POSTs with zero POST-path change. The gap routes into this node as a required adapter, not an optional one.

Adapter duty: a Supabase intake that polls the `messages` table (project filter plus recipient-in-`to_agents` plus unacked, newest-first) on the same `~20s` cadence, validates each row through the ORDER-envelope rules, and feeds the identical shape `{id, needs_user_action, title, summary, from, project}` into the UNCHANGED existing `maybePostNtfyDirect(cfg, env)` POST path. No POST-path change is authorized on this node — the adapter ends where the POST path begins.

POST-path contract (cited from the `AGENT.md` record lines 133–134, not from a gap file — no gap file exists in this tree):

- Entry: `maybePostNtfyDirect(cfg, env)` — the adapter passes `cfg` through untouched and supplies `env` as the mapped shape `{id, needs_user_action, title, summary, from, project}`.
- Trigger: validated rows with `needs_user_action:true` only; the boolean check stays source-agnostic.
- Topic: read from the `COMMS_NTFY_TOPIC` environment name only, never logged and never written to any file.
- Headers: `Title` plus `Priority` on every POST.
- Body cap: 1500 characters — the POST path truncates, the adapter never widens it.
- Timeout: 15 seconds per POST attempt.
- Logging: status-code-only log per drain (a live `status=200` with `posted=true` was observed on the git-sourced drill path; the Supabase-sourced equivalent is NOT-RUN).
- Dedup: posted-ID dedup owned by the POST path; the adapter keeps only a local in-memory seen-set as a drain-equivalent guard and never redefines dedup.

Intake SELECT (draft proposal quoting the bus-spec poll shape, static text, NOT-RUN). `$1` = caller project (text), `$2` = caller identity (text), `$3` = page size:

```sql
SELECT id, from_agent, to_agents, project, title, body, needs_user_action, created_at, claimed_by, claimed_at, acked_at
FROM messages
WHERE project = $1 AND $2 = ANY(to_agents) AND acked_at IS NULL
ORDER BY created_at DESC
LIMIT $3;
```

Table choice (owned by this spec): poll the `messages` table, not the `messages_status` view — the view intentionally excludes `body` (dashboard spec), and the adapter needs `body` to build the `summary` field. The project filter is never omitted; ordering is newest-first per `ORDER BY created_at DESC`.

Row validation (ORDER-envelope rules as applicable from owned artifacts; ORDER-canonical mapping carried UNKNOWN):

1. Required-field check (bus spec POST step 2, applied on read): `from_agent`, `project`, `title`, and `body` are present and non-empty strings; `to_agents` is an array with at least one non-empty entry (array-length floor is a proposal — the schema constrains `NOT NULL` only); `project` equals the caller project; `needs_user_action` is a boolean. A row failing any check is skipped with its id plus reason logged — the offending value is never logged.
2. Secret-scan before map (bus spec POST step 1, interim denylist quoted from the observed `.githooks/pre-commit` hook): known API-key prefixes, credential-shaped `KEY` / `SECRET` / `TOKEN` / `PASSWORD` assignments to long literals, bearer tokens in `Authorization` values, embedded dotenv payloads. Any hit rejects the row for notify purposes (no INSERT exists on this path; the row stays for owner triage) and the value is never logged or stored beyond the rejection notice.
3. Lifecycle gate: `acked_at` must be NULL (the SELECT already filters; the check is defense in depth). A row whose claim is stale (`claimed_at` older than 10 minutes, still unacked) is claimable again only after the reaper runs — the adapter never force-clears a claim.
4. ORDER-canonical gate: UNKNOWN — the ORDER §§1–2 text is not in this tree, so conformance of the mapped shape to the canonical envelope (14-field schema, ORDER paths, canonical ACCEPT versus legacy REJECT) is carried for owner or vanbu confirmation before LIVE. The assumed 1:1 mapping is `body` to `summary` and `from_agent` to `from`; if ORDER refutes it, this spec re-scopes.

Row-to-shape mapper (static contract — implementation in the fenced code below):

```text
shape.id               = row.id
shape.needs_user_action = row.needs_user_action (boolean, strict)
shape.title            = row.title
shape.summary          = row.body
shape.from             = row.from_agent
shape.project          = row.project
```

## PC watcher wiring

Pipeline order (unchanged git-side drain stages preserved; only the source changes): poll, then validate, then drain-equivalent, then ack-writeback via `acked_at` plus claim with lease respect. One sweep (static pseudocode, not executed):

```text
every ~20s (brief-stated cadence; PC tick file:line unverified here):
  reap stale claims (reaper statement below)
  SELECT pending-for-me newest-first (intake SELECT above)
  for each row in order:
    validate through the envelope rules (section above)
    on invalid: log id + reason, continue (never log the value)
    CLAIM it (atomic UPDATE + row-count protocol below)
    on loss (row count 0): re-read winner, back off, continue
    on win (row count 1): map to the notify shape
    if shape.needs_user_action and id not in local seen-set:
      call UNCHANGED maybePostNtfyDirect(cfg, shape)
    ACK it (only-by-claimer-or-recipient rule below)
```

Claim statement (exact atomic-claim text quoted from `COMMS-SUPABASE-SCHEMA.sql` line 55, static, NOT-RUN). `$1` = claimer identity (text), `$2` = message id (uuid):

```sql
UPDATE messages SET claimed_by = $1, claimed_at = now() WHERE id = $2 AND claimed_by IS NULL;
```

Row-count protocol (bus spec): row count 1 means this watcher won the claim; row count 0 means another caller won or the id is UNKNOWN — re-read the row to see the winner and back off, never retry blindly in a tight loop.

Reaper statement (quoted from `COMMS-SUPABASE-SCHEMA.sql` line 62, static, NOT-RUN). Runs before each sweep (reap-then-claim):

```sql
UPDATE messages SET claimed_by = NULL, claimed_at = NULL WHERE claimed_at < now() - interval '10 minutes' AND acked_at IS NULL;
```

Lease respect: a claim older than 10 minutes that is still unacked is stale and returns to pending via the reaper. The reaper never sets `acked_at` and never touches acked rows. A CLAIM that follows a reap may win a previously stale id; the row-count protocol still decides the winner.

ACK statement (draft proposal quoting the bus spec, static, NOT-RUN). `$1` = message id (uuid), `$2` = acker identity (text):

```sql
UPDATE messages SET acked_at = now() WHERE id = $1 AND acked_at IS NULL AND (claimed_by = $2 OR $2 = ANY(to_agents));
```

Ack-writeback rule (only-by-claimer-or-recipient, bus spec): the UPDATE must match zero rows unless the acker is the current claimer or a named recipient; an already-acked row never re-acks. Caller protocol: row count 1 means this watcher recorded the ack; row count 0 means not-authorized, already acked, or id UNKNOWN — re-read the row and report which case holds, never force-set `acked_at`.

## Adapter code (fenced ESM drafts, NOT-RUN)

Three fenced ESM modules below (zero dependencies, Node 25). They are reviewed text only: no live execution of any kind occurred on this node. Data-plane callbacks (`query`, `claim`, `ack`, `reap`) are injected by the LIVE wave — this spec invents no MCP tool shape and redefines nothing in the POST path (`maybePostNtfyDirect` arrives as an injected reference to the UNCHANGED existing function). SQL strings quote the bus-spec drafts above. Syntax is proven by the temp-extract plus `node --check` run quoted in Verification runs (temp dir only, never landed as `.mjs` files).

Poll fragment — intake SELECT plus argument guard:

```js
// supabase-intake-poll (DRAFT, NOT-RUN) — poll fragment of the adapter.
export const INTAKE_POLL_SQL = [
  'SELECT id, from_agent, to_agents, project, title, body,',
  '  needs_user_action, created_at, claimed_by, claimed_at, acked_at',
  'FROM messages',
  'WHERE project = $1 AND $2 = ANY(to_agents) AND acked_at IS NULL',
  'ORDER BY created_at DESC',
  'LIMIT $3;',
].join('\n');

function assertNonEmptyString(name, value) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('pollSupabaseIntake: ' + name + ' must be a non-empty string');
  }
}

// query(sqlText, params) is provided by the LIVE wave (MCP path); it must
// resolve to the rows newest-first. This fragment never opens a connection.
export async function pollSupabaseIntake({ project, identity, limit, query }) {
  assertNonEmptyString('project', project);
  assertNonEmptyString('identity', identity);
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error('pollSupabaseIntake: limit must be a positive integer');
  }
  if (typeof query !== 'function') {
    throw new Error('pollSupabaseIntake: query callback is required (LIVE wave provides it)');
  }
  const rows = await query(INTAKE_POLL_SQL, [project, identity, limit]);
  if (!Array.isArray(rows)) {
    throw new Error('pollSupabaseIntake: query must resolve to a rows array');
  }
  return rows;
}
```

Validate-plus-map fragment — envelope rules then the identical notify shape:

```js
// supabase-intake-shape (DRAFT, NOT-RUN) — validate then map fragment.
const KEY_PREFIXES = ['sk-ant-', 'sk-or-v1-', 'github_pat_', 'ghp_', 'gho_', 'ghu_', 'ghs_', 'ghr_', 'xox', 'AKIA'];

function hasKnownKeyShape(text) {
  return KEY_PREFIXES.some((prefix) => text.includes(prefix));
}

function hasCredentialAssignmentShape(text) {
  const assignment = /(api[_-]?key|secret|token|password)["']?\s*[:=]\s*["']?[A-Za-z0-9+/_=-]{24,}/i;
  const bearer = /"authorization"\s*:\s*"bearer\s+[A-Za-z0-9+/_=-]{24,}"/i;
  return assignment.test(text) || bearer.test(text);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.length > 0;
}

// Returns { ok: true } or { ok: false, reason } — reason carries the rule
// name plus row id only, never a field value.
export function validateRowThroughEnvelopeRules(row, callerProject) {
  if (row === null || typeof row !== 'object') {
    return { ok: false, reason: 'not-a-row' };
  }
  if (!isNonEmptyString(row.from_agent)) return { ok: false, reason: 'missing-from_agent:' + String(row.id) };
  if (!isNonEmptyString(row.project)) return { ok: false, reason: 'missing-project:' + String(row.id) };
  if (row.project !== callerProject) return { ok: false, reason: 'project-mismatch:' + String(row.id) };
  if (!isNonEmptyString(row.title)) return { ok: false, reason: 'missing-title:' + String(row.id) };
  if (!isNonEmptyString(row.body)) return { ok: false, reason: 'missing-body:' + String(row.id) };
  if (!Array.isArray(row.to_agents) || row.to_agents.length === 0 || !row.to_agents.every(isNonEmptyString)) {
    return { ok: false, reason: 'bad-to_agents:' + String(row.id) };
  }
  if (typeof row.needs_user_action !== 'boolean') {
    return { ok: false, reason: 'bad-needs_user_action:' + String(row.id) };
  }
  if (row.acked_at !== null && row.acked_at !== undefined) {
    return { ok: false, reason: 'already-acked:' + String(row.id) };
  }
  const scanned = String(row.title) + '\n' + String(row.body);
  if (hasKnownKeyShape(scanned) || hasCredentialAssignmentShape(scanned)) {
    return { ok: false, reason: 'secret-hit:' + String(row.id) };
  }
  return { ok: true };
}

// Identical shape the git-sourced path feeds the POST path — no POST change.
export function mapRowToNotifyShape(row) {
  return {
    id: row.id,
    needs_user_action: row.needs_user_action,
    title: row.title,
    summary: row.body,
    from: row.from_agent,
    project: row.project,
  };
}
```

Drain-equivalent fragment — reap-then-claim sweep plus the `~20s` loop:

```js
// supabase-intake-drain (DRAFT, NOT-RUN) — drain-equivalent fragment.
// maybePostNtfyDirect is the UNCHANGED existing POST function, injected by
// reference at LIVE-wire time — this file never redefines it.
export async function runIntakeSweep({
  project,
  identity,
  limit,
  cfg,
  poll,
  reap,
  claim,
  ack,
  validateRow,
  mapRow,
  maybePostNtfyDirect,
  seen = new Set(),
  log = () => {},
}) {
  if (typeof reap === 'function') {
    await reap();
  }
  if (typeof validateRow !== 'function' || typeof mapRow !== 'function') {
    throw new Error('runIntakeSweep: validateRow and mapRow are required (shape fragment provides them)');
  }
  const rows = await poll({ project, identity, limit });
  for (const row of rows) {
    const verdict = validateRow(row, project);
    if (!verdict.ok) {
      log('skip:' + verdict.reason);
      continue;
    }
    const won = await claim(row.id, identity);
    if (!won) {
      log('claim-lost:' + String(row.id));
      continue;
    }
    const shape = mapRow(row);
    if (shape.needs_user_action === true && !seen.has(shape.id)) {
      await maybePostNtfyDirect(cfg, shape);
      seen.add(shape.id);
    }
    await ack(row.id, identity);
  }
  return { swept: rows.length };
}

// Cadence holder only — the interval value is brief-stated (~20s); the LIVE
// wave owns starting and stopping it. Returns a stop handle.
export function startSupabaseIntakeWatcher(sweep, options = {}) {
  const cadenceMs = options.cadenceMs ?? 20000;
  if (typeof sweep !== 'function') {
    throw new Error('startSupabaseIntakeWatcher: sweep function is required');
  }
  const timer = setInterval(() => {
    sweep().catch((error) => {
      const log = options.log ?? (() => {});
      log('sweep-error:' + String((error && error.message) || error));
    });
  }, cadenceMs);
  return { stop: () => clearInterval(timer), cadenceMs };
}
```

Wiring note (static, LIVE wave owns it): `poll` wraps `pollSupabaseIntake` with the MCP query callback; `validateRow` is the shape fragment's `validateRowThroughEnvelopeRules` and `mapRow` is its `mapRowToNotifyShape`; `claim(id, identity)` issues the atomic-claim UPDATE and resolves row-count 1 to `true`; `ack(id, identity)` issues the ACK UPDATE under the only-by-claimer-or-recipient rule; `reap()` issues the reaper UPDATE; `cfg` passes through to `maybePostNtfyDirect` untouched. No signature in the POST path changes.

## Vanbu-side spec

Vanbu implements the same logic against the same `messages` table: poll with the intake SELECT (project filter plus recipient-in-`to_agents` plus unacked, newest-first), validate every row through the envelope rules above, CLAIM with the atomic UPDATE plus row-count protocol, respect the 10-minute lease via reap-then-claim, and ACK under the only-by-claimer-or-recipient rule. Field mapping is identical (`body` to `summary`, `from_agent` to `from`); the ORDER-canonical confirmation is shared — if ORDER refutes the mapping, both sides re-scope together.

Ntfy on the vanbu side is optional, and the default is OFF: vanbu VM egress blocks `ntfy.sh` with a 403 (observed on the git-sourced path per the `AGENT.md` record), so the PC stays the designated notifier. Vanbu therefore implements poll, validate, claim, and ack, and leaves user-action notification to the PC watcher. Vanbu must not invent the project-identity source (RLS UNKNOWN is carried on both sides), must never log topic values or row bodies, and must quote its own scope line plus zero-or-live MCP posture in its report. If vanbu egress ever clears the 403, enabling its notify leg is a new decision with its own dedup review — never a silent switch-on, or duplicate phone buzzes follow.

## Skill discipline

Scope-first: the scope line above is proposed, not executed — no `project_ref` was set and no MCP tool was called on this node.

Zero MCP calls attempted. Why: this node is SPEC-ONLY by brief (`NO live execution of any kind`), and the LIVE wave is gated on owner OAuth (the shared unblocker with SUPABASE-MCP W4 — the recorded owner OAuth attempt EXPIRED with exit 1, browser approval not completed in time, per the `AGENT.md` wave-2 record). Reads (`list_tables`, `list_extensions`, `list_migrations`, `get_advisors`, `query_logs`, `search_docs`) and mutating calls (`execute_sql`, `apply_migration`, branching, storage config) were all deliberately not attempted; there is no confirmation flow to quote because nothing ran. No local `http://localhost:54321/mcp` run either — the brief provides no local stack, so local-vs-remote is: neither touched, both NOT-RUN.

Inspect-before-change and advisories-first are therefore `unverified` for this node (no probe ran) and are carried as LIVE-wave obligations, not claimed here. The procedural rules of the two agent-skills (`supabase`, `supabase-postgres-best-practices`) plus the `vs-supabase` method (scope-first, inspect-first, advisories-first, narrowest features, secrets owner-side, no OS via SQL) were read and observed as restraint: this spec proposes exact SQL as static text and waits for the owning lane.

Unknowns marked: RLS project-identity source UNKNOWN; `maybePostNtfyDirect` file:line UNKNOWN in this tree (contract cited from the `AGENT.md` record instead); ORDER §§1–2 canonical mapping UNKNOWN; `~20s` cadence brief-stated with the PC tick file:line `unverified`; `pgcrypto` availability `unverified`; array-length floor on `to_agents` is a proposal; ACK and intake SELECT statements are proposals (the schema file owns only the CLAIM and reaper statements plus the table, policy, and view); the local seen-set is a proposal (dedup ownership stays in the POST path).

## Secret sweep and self-review

Secret sweep: this file carries zero secrets by construction (no tokens, keys, bearer values, or credential-shaped assignments; key prefixes and pattern names appear only as short pattern references that match no hook rule). The node report quotes the secret-pattern grep output and exit code.

Spec self-review (author pass, 2026-10-17): adapter states the gap source plus intake SELECT with project plus recipient plus unacked plus newest-first plus `~20s` cadence plus envelope validation plus the identical notify shape into the UNCHANGED POST path with the six-point contract cited from the `AGENT.md` record and the missing file:line marked UNKNOWN; PC wiring covers poll plus validate plus drain-equivalent plus ack-writeback with the exact claim plus reaper plus ACK statements and the row-count protocols plus lease respect; code carries three fenced ESM modules (poll, validate-plus-map, drain-equivalent) with injected data-plane callbacks and no invented MCP shape; vanbu spec covers identical poll plus validate plus claim plus ack with ntfy default OFF plus the 403 egress reason plus PC as designated notifier; skill discipline carries the scope-first line, the zero-MCP-calls reason (SPEC-ONLY plus OAuth pending), local-vs-remote neither-touched, and the unknowns; RLS-identity UNKNOWN is carried, not resolved; English only; sole artifact is this file.

## Verification runs (quoted)

Temp-extract plus `node --check` (fences land in a temp dir only, never as `.mjs` files), secret-pattern grep, and markdownlint runs are quoted below with commands, outputs, and exits.

1. Fence extraction plus syntax proof (temp dir only):

```text
command: extract ```js fences from COMMS-SUPABASE-WATCHERS.md to
  $env:TEMP\watchers-fences\fence-N.mjs, `node --check` each, delete temp
output:
  js-fences-found=3
  node --check fence-1 exit=0
  node --check fence-2 exit=0
  node --check fence-3 exit=0
  temp-deleted=True
```

2. Secret-pattern grep (mirrors the `.githooks/pre-commit` rules 1a, 1b, 1c):

```text
output: key-formats=0 assignments=0 bearer=0
result: secret-sweep=PASS exit=0
```

3. Markdownlint (repo config `.markdownlint.jsonc`):

```text
command: npx --yes markdownlint-cli COMMS-SUPABASE-WATCHERS.md
output: (no findings)
exit: markdownlint exit=0
```

No live execution of any kind occurred: zero MCP calls, zero Supabase touches, zero ntfy POSTs. The only processes run were the static checks above.
