# COMMS-SUPABASE-WAIT-SETUP — persistent wait-script run (owner action)

Status: SETUP-ONLY. The persistent run is an owner action and is NOT started by the lane.

Lane: VTA-COMMS-DASHBOARD-02, node `b-waitscript` (wave 3). Companion script: `COMMS-SUPABASE-WAIT.mjs` (root).

## What the script does

Polls the `messages` table over Supabase REST every 20s plus 0–5s jitter for rows addressed to blazar/vantrilex-comms. On a new row from vanbu it sends one ntfy POST (topic from `COMMS_NTFY_TOPIC` only, never logged, `Title` plus `Priority` headers, body capped at 1500 chars) and appends `{ ids, at }` to the wake file. It NEVER acts on rows: no claim, no ack, no insert, no update — alert only.

## Wake file

Path: `%USERPROFILE%\.config\comms-hub\wake.json` (for example `C:\Users\<name>\.config\comms-hub\wake.json`).

The session checks this file at startup: each entry carries the alerted message `ids` plus the `at` timestamp. Entries accumulate newest-last; triage then deletes or archives handled entries. The script never reads the wake file back — it is write-only from the script side.

## Environment (owner machine only, never in the repo)

Set these as user environment variables (names only — values stay on the owner machine):

- `COMMS_SUPABASE_URL` — Supabase project REST base (required).
- `COMMS_SUPABASE_ANON_KEY` — anon key, RLS-enforced role (required; service keys never).
- `COMMS_SUPABASE_PROJECT` — project filter (defaults to `vta-comms`).
- `COMMS_NTFY_TOPIC` — ntfy topic (optional; when unset the script still polls and writes wake entries, ntfy is skipped with a `wake-only` notice).
- `COMMS_WAIT_MAX_CYCLES` — optional loop cap for probe runs.

Example (values are placeholders, replace on the owner machine):

```powershell
setx COMMS_SUPABASE_URL "https://<ref>.supabase.co"
setx COMMS_SUPABASE_ANON_KEY "<anon-key>"
setx COMMS_SUPABASE_PROJECT "vta-comms"
setx COMMS_NTFY_TOPIC "<owner-topic>"
```

Verify scope before starting (fail-closed probe, zero network, zero writes):

```powershell
node COMMS-SUPABASE-WAIT.mjs --once --dry-run
```

Expected: a `wait-scope` line plus `wait-dry-run` intent lines, exit 0 when URL plus key plus project resolve, exit 2 otherwise with `zero-network-calls zero-files-written`.

## Persistent run: Task Scheduler start-on-logon plus restart-on-failure

1. Open Task Scheduler, Create Task (not the basic wizard, so failure restart is available).
2. General tab: name `comms-supabase-wait`, Run whether user is logged on or not OFF (this is a logon-session task), Hidden unchecked.
3. Triggers tab: New, Begin the task At log on, Specific user the owner account, Enabled checked.
4. Actions tab: New, Start a program: program `node.exe` (full path, for example `C:\Program Files\nodejs\node.exe`), arguments `O:\vantrilex-arsenal\COMMS-SUPABASE-WAIT.mjs`, Start in `O:\vantrilex-arsenal`.
5. Settings tab: check Run task as soon as possible after a scheduled start is missed; If the task fails, restart every 1 minute, Attempt to restart up to 3 times; Stop the task if it runs longer than 7 days (a fresh logon cycle restarts it); If the running task does not end when requested, force it to stop.
6. Conditions tab: Start the task only if the computer is on AC power OFF (alerts must survive on battery); Wake the computer to run this task OFF (alert-only, never wakes hardware).
7. Run the task once by hand (right-click, Run), then confirm: one `wait-scope` line in Task History plus a fresh poll cycle every ~20s, and stop it again until the owner wants it persistent.

Stop handle: ending the task (or `Ctrl+C` / SIGTERM on a console run) clears the timer and exits 0. `--once` runs a single poll cycle for probes. `COMMS_WAIT_MAX_CYCLES` caps loop iterations for bounded runs.

## RLS note

REST uses the anon key, an RLS-enforced role. The schema policy `messages_project_isolation` keys identity off the session GUC `app.project`, which REST cannot set — if the live poll returns zero rows while the dashboard shows pending rows for the project, the identity path is the cause and the owner confirms it before relying on alerts. The script re-filters client-side by project plus recipient regardless, and logs counts plus ids only.

## Verification quoted on the lane

- `node --check COMMS-SUPABASE-WAIT.mjs` exit 0.
- `--once --dry-run` with no env: fail-closed exit 2, zero network calls, zero files written.
- TEST wake entry round-trip through the shipped `appendWakeEntry` export, clearly marked test, removed after.
- Secret-pattern sweep over both new files: zero hits.
- `markdownlint` on this file exit 0.

Persistent run NOT started. No commits, no pushes.
