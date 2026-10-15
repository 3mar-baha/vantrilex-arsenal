# P3 OpenCode Install Pack — Owner-Run Steps

> Read this first. This pack is written FOR the owner to run on his own PC.
> NOTHING in it was executed from the agent seat. No step below was run by us,
> no file on the owner's machine was touched, and no live secret appears here.
> Work through the steps top to bottom on your own PC. Each step says how to confirm it.

## 0. What this pack covers

- Install scope is DESIGN.md Phase 1 to Phase 2, OpenCode side only:
  1. The official ClawHub Notion skill.
  2. The custom relay-protocol skill (built with skill-creater in Phase 1).
  3. The 60-second OpenCode poll loop defined by that skill.
- Out of scope here: the Notion database build, the vanbu-side hooks, and the live trial (Phase 3). Those land in their own packs.
- At the time of writing, the relay-protocol skill had not landed in this repo, so skill-internal paths below (SKILL.md, POLL.md, SEND.md) refer to the Phase 1 output described in DESIGN.md section 7. If a named path is missing, stop — do not improvise it.

## 1. Prerequisites

- OpenCode running on your PC with access to its skills list.
- A ClawHub account that can install the official Notion skill to OpenCode.
- Your alerts chat, created once by you in the app (DESIGN.md section 4). Keep it open — you need it in section 3.
- The relay-queue database already created (Phase 1 prerequisite). You only need its name to point the skills at it.

## 2. Install the official ClawHub Notion skill

1. Open the ClawHub listing for the official Notion skill.
2. Use its Install control and target your OpenCode instance on this PC.
3. Wait for ClawHub to report success, then open the OpenCode skills list and confirm an entry for the Notion skill is present.
4. Confirm with a read-only check: ask your OpenCode main agent to list the databases visible to the Notion connection. Your workspace objects should come back with no auth error.

Pass mark: the skill is listed and the read-only query succeeds.

## 3. Resolve your alerts-chat UUID

1. In your OpenCode main-agent context, list chats (DESIGN.md section 4 uses `chat.list` for this) and find your alerts chat.
2. Copy its UUID exactly — character for character, including hyphens.
3. Keep that value on your PC. It goes into the skill config file in section 4, and it lives only there — never in this document. This document carries no real UUID, only the `<ALERTS-CHAT-UUID>` token.

Pass mark: you hold a UUID copied from `chat.list` output.

## 4. Install the relay-protocol skill and enter the UUID

1. Take the Phase 1 relay-protocol skill bundle (SKILL.md plus RELAY-SCHEMA.md, MESSAGE-TYPES.md, POLL.md, SEND.md, TRIAGE.md, TIMEOUTS.md, SECURITY.md, and the scripts directory) as produced with skill-creater.
2. Install it into OpenCode through the same skills path as section 2 — a skill bundle install, not a file copy into another skill's folder.
3. Open the OpenCode skills list and confirm relay-protocol appears alongside the Notion skill.
4. Open the skill config file at the location SKILL.md names, and enter the UUID you copied in section 3 in the field SKILL.md names for the alerts chat. Schematic — the field name is whichever SKILL.md defines; the value is your UUID:

```text
alerts-chat UUID = <ALERTS-CHAT-UUID>
```

5. Save the file, then reload the skill surface per SKILL.md so the value takes effect.

Pass mark: relay-protocol is listed, and its config file holds your pasted UUID with no token text remaining.

## 5. Set up the 60-second poll loop

Per DESIGN.md section 2, the OpenCode poll is one query every 60 seconds with the filter `to` equal to opencode and `status` equal to pending, ordered by creation time. The exact loop, the ack protocol (ack on pickup, reply carrying the thread id, close to done), and the watermark live in the skill's POLL.md.

1. Follow the OpenCode loop section of POLL.md to enable the 60-second loop.
2. Leave every other interval alone: the 180-second vanbu poll and the 60-second watchdog belong to the vanbu side and ship disabled until you say start.
3. Confirm the loop's delivery target for routine updates is the main chat, and that anything bound for the alerts chat uses the UUID from section 3.

Pass mark: the loop is enabled per POLL.md with the 60-second rhythm and the correct delivery targets.

## 6. Prove each piece live

Run these in order on your PC. Each has a pass mark. If any check fails, stop and fix it before moving on.

| # | Piece | Check you run | Pass mark |
|---|---|---|---|
| 1 | Notion skill | Read-only list of databases through the main agent | Workspace objects return, no auth error |
| 2 | Skill config | Reopen the config file you saved in section 4 | Your pasted UUID is present, no token text remains |
| 3 | relay-protocol skill | Ask the main agent to run the POLL.md one-shot query once | Query returns cleanly (rows or an empty set, no error) |
| 4 | 60-second loop | Watch two consecutive poll cycles | Exactly one relay-queue query per cycle, roughly 60 seconds apart |
| 5 | Alerts-chat delivery | Create the one-shot alert cron from DESIGN.md section 4 addressed to your UUID with the body `relay install-pack test` | The test text lands in the alerts chat and nowhere else |
| 6 | Rate budget | Compare the loop rhythm against the DESIGN.md section 3 budget | Total traffic stays near 0.02 requests per second, far under the service limit |

## 7. If something fails

| Symptom | First action |
|---|---|
| Notion query returns an auth error | Reconnect the ClawHub Notion skill, then rerun check 1 |
| relay-protocol missing from the skills list | Repeat section 4 from the Phase 1 bundle — do not copy files by hand into other skills |
| Poll query errors on the filter | Open RELAY-SCHEMA.md, match the status values exactly, then rerun check 3 |
| Test text never reaches the alerts chat | Recompare the UUID character by character with the `chat.list` output, then rerun check 5 |
| Test text reaches the wrong chat | Stop the loop, fix the delivery target, then rerun checks 4 and 5 |

## 8. Done

- Checks 1 to 6 in section 6 all pass.
- The only copy of your alerts-chat UUID is in your local skill config.
- Nothing was run from the agent seat — every pass mark above was produced on your PC, by you.
