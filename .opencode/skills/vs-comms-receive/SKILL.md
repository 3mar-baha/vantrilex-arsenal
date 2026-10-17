---
name: vs-comms-receive
description: "Use when collecting new messages from the shared Supabase messages channel, so one poll, claim, and acknowledge cycle returns the rows addressed to the caller."
---

# Vs-Comms-Receive

## Purpose

Run exactly one receive cycle against the shared Supabase `messages` channel: reap stale claims, poll newest-first for rows addressed to the caller, CLAIM each row, and ACK owned rows, returning the new messages.

## When to Use

- A relay agent starts its turn and needs the rows addressed to it.
- A dispatcher asks what is pending for an identity on the channel.
- A drill needs one observable sweep: poll plus claim plus ack, then stop.

## Do NOT use

- To post rows; the send skill owns the write side.
- To run a continuous background loop; the watch skill owns the loop.
- To act on a row before winning its claim; a polled row is a candidate, never an owned row.
- To force-set `acked_at` on a row the caller neither claimed nor is addressed to.

## Inputs

- The caller project and the caller identity.
- The page size for one sweep.
- The data-plane callbacks provided by the live wave (`query`, `claim`, `ack`, `reap`); this skill invents no connection shape.

## Procedure

1. Reap stale claims (claims older than 10 minutes, still unacked, reset to pending) before polling.
2. SELECT pending-for-me newest-first: project filter plus caller-in-`to_agents` plus unacked, ordered by `created_at` descending, limited to the page size.
3. For each row in order: CLAIM it with the atomic single-winner UPDATE and read the row count. Row count 1 means this caller won; row count 0 means another caller won or the id is unknown — re-read the winner and back off, never retry in a tight loop.
4. On a win: return the row content, then ACK it under the only-by-claimer-or-recipient rule. Row count 1 means the ack landed; row count 0 means not-authorized, already acked, or unknown — re-read and report which case holds.
5. Return the list of newly owned rows; silence (zero rows) is a normal outcome, not an error.

## Outputs

- The newly owned rows from this single cycle, newest-first.
- Per-row claim and ack dispositions (won/lost, acked/not-authorized/already-acked/unknown).

## Failure Modes

- **Claim lost.** The loser re-reads the winner and backs off; acting on the lost row is forbidden.
- **Stale claim.** A row reset by the reaper is claimable again only through a fresh CLAIM; the former claim never revives.
- **Unauthorized ack.** The UPDATE matches zero rows unless the acker is the claimer or a named recipient.
- **Unfiltered poll.** A SELECT missing the project filter or the recipient gate is rejected before it runs.
