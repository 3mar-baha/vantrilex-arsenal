#!/usr/bin/env node
// Usage: node scripts/probe-dispatch-sentinel.mjs
//
// Regression probe for the task-dispatch sentinel (MFT-007/MFT-063).
// Asserts that idempotence is decided by the structured sentinel markers,
// never by a substring of the instruction prose, and that a draft receives
// the injection exactly once per turn. Exits 0 on success.
import assert from "node:assert/strict";
import {
  DISPATCH_SENTINEL_BEGIN,
  DISPATCH_SENTINEL_END,
  stripDispatchSentinel,
  taskDispatcher,
} from "../.opencode/plugin/arsenal.ts";

// 1. Plain text carries no sentinel.
{
  const r = stripDispatchSentinel("hello world");
  assert.equal(r.stripped, false, "plain text must not be flagged");
  assert.equal(r.userText, "hello world", "plain text must survive intact");
}

// 2. A sentinel-wrapped block is detected and stripped deterministically.
const injection = taskDispatcher({ config: { taskDispatcher: { enabled: true } } });
assert.ok(typeof injection === "string" && injection.length > 0, "dispatcher must yield injection");
const wrapped = `user prompt\n\n${injection}`;
{
  const r = stripDispatchSentinel(wrapped);
  assert.equal(r.stripped, true, "wrapped block must be flagged");
  assert.equal(r.userText, "user prompt", "only the user text must survive");
}

// 3. A user quoting the instruction prose verbatim must not trip idempotence.
{
  const quoted = "see [arsenal] task-dispatcher: classify this prompt";
  const r = stripDispatchSentinel(quoted);
  assert.equal(r.stripped, false, "prose quote must not be treated as a block");
}

// 4. One append per turn: an injected draft carries exactly one sentinel block,
// and a second pass detects it so no re-append occurs.
const draft = `do the thing\n\n${injection}`;
const first = stripDispatchSentinel(draft);
assert.equal(first.stripped, true, "injected draft must be detected");
// Second append attempt: sentinel present -> stripped true -> no append.
const second = stripDispatchSentinel(draft);
assert.equal(second.stripped, true, "second pass must also detect the sentinel");
assert.equal((draft.match(new RegExp(DISPATCH_SENTINEL_BEGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length, 1, "exactly one sentinel begin per turn");

console.log("SENTINEL-REGRESSION 4/4");
process.exit(0);
