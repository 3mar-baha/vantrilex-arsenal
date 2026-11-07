#!/usr/bin/env node
// Usage: node scripts/probe-model-record.mjs
//
// Fixture-based probe for the model-choice recording hook (owner ruling 5,
// W5 w5-model-menu). Drives `modelChoiceFrom`, `formatModelChoice` and
// `recordModelChoice` from `.opencode/plugin/arsenal.ts` plus every
// shipped agent seat file, and asserts:
//   - extraction: providerID/modelID are never selected or pinned
//   - unknown-fallback: an unreadable model is recorded, never guessed
//   - on-disk write: one entry per observation in a temp state dir
//   - no-pin invariant: 0 hits for a `model:` key across `.opencode/agents/`
// The repository is only read except for the fixture state dir.
// Exit 0 when every probe passes, 1 otherwise.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatModelChoice, modelChoiceFrom, recordModelChoice } from "../.opencode/plugin/arsenal.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AGENTS_DIR = path.join(ROOT, ".opencode", "agents");

const rtFor = () => ({ fs, path, execFile: null, os, proc: process, loadErrors: [] });
const TMP = path.join(os.tmpdir(), "probe-model-record");
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });

// --- 1. extraction: a user-picked model round-trips, nothing pinned ---
const picked = modelChoiceFrom({ providerID: "opencode", modelID: "beam-free" }, "vantrilex-verifier");
assert.equal(picked.provider, "opencode");
assert.equal(picked.model, "beam-free");
assert.equal(picked.agent, "vantrilex-verifier");
assert.equal(picked.picked, true);
console.log("PASS extraction: {providerID, modelID, agent} round-trips");

// --- 2. unknown-fallback: unreadable model is recorded, never guessed ---
for (const bad of [undefined, null, {}, { providerID: "  ", modelID: "" }, "opencode/beam-free"]) {
  const fallback = modelChoiceFrom(bad, "vantrilex-verifier");
  assert.equal(fallback.picked, false, `fallback for ${JSON.stringify(bad)}`);
  assert.equal(fallback.provider, "unknown (host default)");
  assert.equal(fallback.model, "unknown (host default)");
}
console.log("PASS unknown-fallback: unreadable model becomes unknown (host default), never guessed");

// --- 3. format: same input, same line ---
const stamp = "2026-11-07T00:00:00.000Z";
assert.equal(
  formatModelChoice(picked, stamp, "ses_probe"),
  formatModelChoice(modelChoiceFrom({ providerID: "opencode", modelID: "beam-free" }, "vantrilex-verifier"), stamp, "ses_probe"),
);
console.log("PASS format: deterministic lines");

// --- 4. on-disk write: one entry per observation in a temp state dir ---
const rt = rtFor();
const first = recordModelChoice(rt, TMP, "ses_probe", picked, stamp);
assert.equal(first !== null && first.length > 0, true);
const fallback = modelChoiceFrom(undefined, "vantrilex-verifier");
const second = recordModelChoice(rt, TMP, "ses_probe", fallback, stamp);
assert.equal(second, first, "second observation appends to the same session file");
const text = fs.readFileSync(first, "utf8");
assert.match(text, /opencode/, "first observation persisted");
assert.match(text, /beam-free/, "first observation persisted");
assert.match(text, /unknown \(host default\)/, "fallback observation persisted");
console.log("PASS write: one entry per observation appended to <stateDir>/model-choices/<session>.md");

// --- 5. no-pin invariant: 0 hits for a `model:` key in shipped seats ---
const hits = [];
for (const file of fs.readdirSync(AGENTS_DIR).filter((f) => f.endsWith(".md")).sort()) {
  const raw = fs.readFileSync(path.join(AGENTS_DIR, file), "utf8");
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  const body = front ? front[1] : raw;
  if (/^\s*model\s*:/m.test(body)) hits.push(file);
}
assert.deepEqual(hits, [], `model: pin hits in ${hits.join(", ") || "none"}`);
console.log("PASS no-pin: 0 `model:` keys across all .opencode/agents/*.md");

console.log("MODEL-RECORD 5/5");
