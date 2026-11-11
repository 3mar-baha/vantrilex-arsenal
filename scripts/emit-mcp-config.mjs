#!/usr/bin/env node
/*
 * emit-mcp-config — W-29: config-first MCP emission for this kit selection.
 *
 * Reads `.opencode/equip.manifest.json` (the `mcp/` tokens, live, across all
 * phases; never a hardcoded list) plus `registry/catalog.json` (the `kind:
 * "mcp"` rows) and writes `.opencode/opencode.json` with a top-level
 * `mcpServers` block.
 *
 * For each selected MCP the catalog row is looked up for:
 *   - `version_pin`                      (required, D54 criterion 1)
 *   - `install_cmd` (stdio path) or a
 *     `remoteUrl` field (remote path)    (required, D54 criterion 2)
 *   - `transport`                        (reported for every row; never invented)
 *   - evidence (recorded `checked_at` only; reported, never acted on)
 *
 * D54 countability (this script implements the W-29 emission bar, NOT the full
 * four-criterion test):
 *   REFUSE to emit any MCP without `version_pin` + a resolvable package or
 *   URL. A refused MCP is NAMED on stdout with every failing criterion, its
 *   entry is NOT written, and the refusal is NOT silent. Refusal is the
 *   designed output, not an operational failure:
 *   - stdio: emitted only from `install_cmd` (command + args from a strict
 *     tokenizer); a non-null `transport` that disagrees with a command-line
 *     `install_cmd` fails closed.
 *   - remote: emitted only when `transport` is exactly "sse" and a `remoteUrl`
 *     field is set. Anything else (including `streamable-http`) is refused
 *     rather than typed with an invented value. No catalog row carries
 *     `remoteUrl` today.
 *   - `evidence.source_proof.target` is provenance evidence and is NEVER
 *     promoted to a remote entry: promoting it would invent a transport and
 *     skip the pin law.
 *   - the full D54 test additionally requires a stated transport (criterion
 *     3) and a passing recorded health check (criterion 4). Measured
 *     2026-11-11: no catalog row carries `transport` or any health-check
 *     record, so 0 of the selected MCPs are countable under full D54. An
 *     emission under the W-29 bar is recorded with that caveat, never as
 *     "D54-countable".
 *
 * Usage:
 *   node scripts/emit-mcp-config.mjs
 *
 * .opencode/opencode.json handling: if the file already exists and differs
 * from the emission, the script exits 1 and never clobbers an owner file;
 * if it already matches, the run is a no-op and prints "unchanged".
 *
 * Exit status:
 *   0 — emission completed (refusals, when any, are named on stdout) or the
 *       existing file already matched the emission.
 *   1 — operational failure (unreadable/malformed inputs, duplicate catalog
 *       rows for a selected MCP id, or an existing .opencode/opencode.json
 *       that differs from the emission).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = path.join(ROOT, ".opencode", "equip.manifest.json");
const CATALOG_PATH = path.join(ROOT, "registry", "catalog.json");
const OUT_PATH = path.join(ROOT, ".opencode", "opencode.json");

function fail(message) {
  console.error(`emit-mcp-config: FAIL — ${message}`);
  process.exit(1);
}

function readJson(file, label) {
  let raw;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch (error) {
    fail(`${label} unreadable at ${path.relative(ROOT, file)}: ${error.message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    fail(`${label} is malformed JSON at ${path.relative(ROOT, file)}: ${error.message}`);
  }
}

// Strict tokenizer: double-quoted, single-quoted or bare runs.
function tokenize(commandLine) {
  const tokens = [];
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let match;
  while ((match = pattern.exec(commandLine)) !== null) {
    tokens.push(match[1] ?? match[2] ?? match[3]);
  }
  return tokens;
}

function findHealthClaim(value, prefix = "row") {
  const hits = [];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (/health/i.test(key)) hits.push(`${prefix}.${key}`);
      hits.push(...findHealthClaim(child, `${prefix}.${key}`));
    }
  }
  return hits;
}

const manifest = readJson(MANIFEST_PATH, "equip manifest");
const catalog = readJson(CATALOG_PATH, "catalog");

if (!manifest || typeof manifest !== "object" || !manifest.phases || typeof manifest.phases !== "object") {
  fail("equip manifest has no `phases` object");
}
if (!catalog || typeof catalog !== "object" || !Array.isArray(catalog.components)) {
  fail("catalog has no `components` array");
}

// Selected MCP tokens, straight from the manifest, in manifest order.
const selected = [];
for (const [phase, tokens] of Object.entries(manifest.phases)) {
  if (!Array.isArray(tokens)) continue;
  for (const token of tokens) {
    if (typeof token === "string" && token.startsWith("mcp/")) {
      selected.push({ token, id: token.slice("mcp/".length), phase, suspended: false });
    }
  }
}
if (Array.isArray(manifest.suspended)) {
  for (const token of manifest.suspended) {
    if (typeof token === "string" && token.startsWith("mcp/")) {
      selected.push({ token, id: token.slice("mcp/".length), phase: "suspended", suspended: true });
    }
  }
}

// Index mcp rows by id; a duplicate for a selected id fails closed.
const mcpRows = new Map();
for (const row of catalog.components) {
  if (!row || row.kind !== "mcp" || typeof row.id !== "string") continue;
  if (!mcpRows.has(row.id)) mcpRows.set(row.id, []);
  mcpRows.get(row.id).push(row);
}
const duplicates = [];
for (const { id } of selected) {
  const rows = mcpRows.get(id);
  if (rows && rows.length > 1) duplicates.push(id);
}
if (duplicates.length > 0) {
  fail(`duplicate catalog rows (kind mcp) for selected ids: ${duplicates.join(", ")}`);
}

console.log("W-29 MCP emission — config-first, D54-gated");
console.log(`source: ${path.relative(ROOT, MANIFEST_PATH)} + ${path.relative(ROOT, CATALOG_PATH)}`);
console.log("");

const emitted = {};
const refused = [];

for (const { token, id, phase, suspended } of selected) {
  const row = mcpRows.get(id)?.[0] ?? null;
  const pin = row?.version_pin ?? null;
  const transport = row?.transport ?? null;
  const installCmd = row?.install_cmd ?? null;
  const remoteUrl = row?.remoteUrl ?? null;
  const verification = row?.verification ?? null;
  const tier = row?.tier ?? null;

  console.log(`${token}  (phase ${phase}; tier ${tier ?? "n/a"}; pin ${pin ?? "null"}; transport ${transport ?? "null"}; verification ${verification ?? "n/a"})`);

  const reasons = [];
  let entry = null;
  let assumption = null;

  if (suspended) {
    reasons.push("suspended in the manifest (not selected)");
  } else if (!row) {
    reasons.push("no catalog row (kind mcp) for the selected token");
  } else {
    if (!pin) reasons.push("version_pin is null (D54 criterion 1)");
    if (!installCmd && !remoteUrl) {
      reasons.push("no resolvable package or URL: install_cmd is null and no remoteUrl field is set (D54 criterion 2)");
    }

    if (reasons.length === 0) {
      if (remoteUrl && !installCmd) {
        if (transport === "sse") {
          entry = { type: "sse", url: remoteUrl };
        } else {
          reasons.push(`remoteUrl set but transport is ${JSON.stringify(transport)} — refusing to type the entry without inventing a transport`);
        }
      } else {
        if (transport && !/stdio/i.test(String(transport))) {
          reasons.push(`transport ${JSON.stringify(transport)} disagrees with a command-line install_cmd — refused fail-closed`);
        } else {
          const parts = tokenize(installCmd);
          if (parts.length === 0) {
            reasons.push("install_cmd could not be tokenized into a command");
          } else {
            entry = { type: "stdio", command: parts[0], args: parts.slice(1), env: [] };
            if (!transport) {
              assumption = "transport null in registry — inferred stdio from a command-line install_cmd (assumption recorded, never asserted as stated)";
            }
          }
        }
      }
    }
  }

  const healthClaims = row ? findHealthClaim(row) : [];
  const healthNote = healthClaims.length > 0
    ? `health-check-shaped fields present: ${healthClaims.join(", ")} (inspect; this script does not treat them as a pass)`
    : "no health-check record in the row (D54 criterion 4 unmet)";

  if (entry) {
    emitted[id] = entry;
    console.log(`  EMIT    mcpServers.${id} = ${JSON.stringify(entry)}`);
    console.log(`          ${pin ? `pin ${pin}` : "pin null"}; ${assumption ?? "transport " + transport}; ${healthNote}`);
    console.log("          W-29 pin+command bar only — NOT countable under full D54; the health-check criterion is unrecorded for every selected MCP");
  } else {
    refused.push({ id, reasons });
    console.log(`  REFUSED ${id} — ${reasons.join("; ")}`);
    console.log(`          ${healthNote}`);
  }
  console.log("");
}

const byPhase = new Map();
for (const { phase } of selected) byPhase.set(phase, (byPhase.get(phase) ?? 0) + 1);
const phaseSummary = [...byPhase.entries()].map(([phase, count]) => `${phase} ${count}`).join(", ");

console.log("──────────────────────────────────────────────────────────");
console.log(`selected: ${selected.length} (${phaseSummary}); emitted: ${Object.keys(emitted).length}; refused: ${refused.length}`);
console.log("");
if (refused.length > 0) {
  console.log(`REFUSED (${refused.length}) — unwirable under D54; not emitted, not silently skipped:`);
  for (const { id, reasons } of refused) {
    console.log(`  - ${id}: ${reasons.join("; ")}`);
  }
  console.log("");
}
console.log("note: evidence.source_proof targets and repo coordinates are provenance, not wiring;");
console.log("      no evidence URL was promoted to a remote entry anywhere above.");
console.log("note: no catalog row carries `transport` or a health-check record (measured 2026-11-11);");
console.log("      0 of the selected MCPs are countable under full D54.");

const serialized = JSON.stringify({ mcpServers: emitted }, null, 2) + "\n";
if (fs.existsSync(OUT_PATH)) {
  const current = fs.readFileSync(OUT_PATH, "utf8");
  if (current === serialized) {
    console.log(`unchanged: ${path.relative(ROOT, OUT_PATH)} already matches the emission`);
    process.exit(0);
  }
  fail(`.opencode/opencode.json exists and differs from the emission — refusing to overwrite an owner file (delete it explicitly to re-emit)`);
}
fs.writeFileSync(OUT_PATH, serialized);
console.log(`written: ${path.relative(ROOT, OUT_PATH)} (top-level mcpServers; ${Object.keys(emitted).length} entr${Object.keys(emitted).length === 1 ? "y" : "ies"}; an empty {} is correct when every selected MCP is refused)`);
process.exit(0);
