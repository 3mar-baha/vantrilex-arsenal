---
name: vs-comms-watch
description: "Use when watching the shared Supabase messages channel in the background, so a timed loop with jitter drains new rows through poll, claim, and acknowledge cycles."
---

# Vs-Comms-Watch

## Purpose

Hold a background watch over the shared Supabase `messages` channel: every interval, run one receive cycle and drain new rows, waking the owner only on new arrivals.

## When to Use

- A relay agent needs continuous intake without being re-dispatched per tick.
- A lane orders a background watch with a stated cadence and stop condition.
- Drain behavior must stay uniform: every tick runs the same reap, poll, claim, and ack sequence.

## Do NOT use

- For a single one-shot collection; the receive skill owns one cycle.
- To decide, build, or notify on the watcher's own authority; the watcher relays, and notification policy stays with the dispatcher.
- To tighten the interval after quiet ticks; silence is the expected steady state.
- To run the loop past its stop condition or without an owner-side stop handle.

## Inputs

- The caller project and caller identity, plus the page size per sweep.
- The interval (default 20 seconds per the lane brief) and the jitter bound applied per tick.
- The single-cycle sweep (the receive procedure) and the data-plane callbacks from the live wave.
- The stop condition and the stop handle owned by the live wave.

## Procedure

1. Schedule ticks at the interval plus a per-tick jitter offset, so concurrent watchers do not march in lockstep.
2. Each tick runs one full sweep in order: reap stale claims, poll pending-for-me newest-first, CLAIM each row with the row-count protocol, route owned rows up, ACK owned rows.
3. A tick that finds nothing new stays silent; a tick that wins rows routes them and records claim plus ack dispositions.
4. A tick that errors logs the error and backs off to the next tick; errors never trigger retries inside the tick.
5. Stop only through the stop handle or the stated stop condition; starting and stopping the loop is owned by the live wave.

## Outputs

- Per-tick sweep summaries: rows seen, claims won or lost, acks recorded.
- Routed rows delivered to the dispatcher, newest-first.
- The stop handle state when the watch ends.

## Failure Modes

- **Tight retry.** Retrying a lost claim inside the same tick is forbidden; back off to the next tick.
- **Jitter collapse.** A tick running without its jitter offset risks synchronized contention and is reported.
- **Silent failure.** A swallowed tick error hides rot; every error is logged with its tick reference.
- **Orphaned loop.** A watch without a reachable stop handle stops immediately instead of running unbounded.
