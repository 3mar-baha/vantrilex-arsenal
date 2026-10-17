---
name: vs-comms-send
description: "Use when posting a message to the shared Supabase messages channel, so the envelope is validated and inserted as a pending row with its needs_user_action flag set."
---

# Vs-Comms-Send

## Purpose

Post one validated message to the shared Supabase `messages` channel as a pending row, carrying the caller's `needs_user_action` flag, without claiming or acknowledging it.

## When to Use

- A dispatcher hands down reply or notification content addressed to one or more agents.
- A watcher drain has won a claim and must post a follow-up envelope.
- Any lane needs a pending row created under the project filter with the action flag set or cleared.

## Do NOT use

- To read, claim, or acknowledge rows; the receive skill owns the read side.
- To edit, re-address, or re-flag a row already on the channel; post a new row instead.
- To relay content before the dispatcher supplies it; this skill never composes payload text.
- To bypass the secret scan or the required-field check for urgency; a rejected POST is re-submitted, never forced.

## Inputs

- The sender identity (`from_agent`), the recipient list (`to_agents`, at least one entry), and the caller project.
- The `title` and `body` text, plus the `needs_user_action` boolean.
- The data-plane INSERT path provided by the live wave (this skill invents no connection shape).

## Procedure

1. Secret-scan `title` and `body` against the denylist before building any INSERT. Any hit rejects the POST; the sender replaces the value with a reference (name only) and re-submits.
2. Required-field check: `from_agent`, `to_agents`, `project`, `title`, and `body` are present and non-empty; `project` equals the caller project; `claimed_by`, `claimed_at`, and `acked_at` are NULL on POST (a POST that pre-claims or pre-acks is rejected).
3. INSERT the row with explicit `from_agent`, `to_agents`, `project`, `title`, `body`, and `needs_user_action`; let `id` and `created_at` default unless a pre-assigned id is held; always insert NULL for `claimed_by`, `claimed_at`, and `acked_at`.
4. Return the new row id and its pending status; report a rejection with the rule name and row reference, never the offending value.

## Outputs

- The new pending row id, or a rejection naming the failed check.
- The `needs_user_action` flag value as posted.

## Failure Modes

- **Secret hit.** The POST is rejected before any INSERT is built; the value is never logged or stored.
- **Missing field.** Any absent or empty required field rejects the POST with no INSERT attempted.
- **Pre-claimed POST.** A POST carrying claim or ack values is rejected outright.
- **Project mismatch.** A `project` value differing from the caller project rejects the POST.
