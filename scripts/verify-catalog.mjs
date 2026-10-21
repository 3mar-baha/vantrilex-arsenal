#!/usr/bin/env node
/**
 * Vantrilex catalog verifier — the catalog-only replacement proofs (P1–P8).
 *
 * Proves the kit from registry/catalog.json and registry/data/*.jsonl without
 * reading kit/kit.lock. The lock's own proofs are what this script replaces;
 * reading the lock here would make the replacement circular.
 *
 * Proof inputs, and nothing else:
 *   registry/catalog.json            the generated machine mirror
 *   registry/data/<kind>.jsonl       the canonical per-kind registers
 *   .opencode/plugin/arsenal.ts      hook registrations            (P4)
 *   .opencode/agents/*.md            agent definitions             (P5)
 *   .opencode/skills/<id>/SKILL.md   skill folders                 (P6)
 *   .opencode/equip.manifest.json    the Q-25 selection record     (P5–P8)
 *
 * The deep SKILL.md parse (headings, frontmatter, forbidden patterns) belongs
 * to scripts/verify-skills.mjs and is not repeated here. This script only
 * asserts that every selected catalog id resolves to a real surface.
 *
 * Command honesty (P1–P3) — recorded direction
 * --------------------------------------------
 * P1: a `verified` claim requires an install command.
 * P2: a null command requires `unverified`.
 * P3: no row carries a value outside {verified, unverified}; no `pending`.
 * The opposite direction — every non-null command recorded `verified` — is NOT
 * asserted, because 1,159 rows carry a command recorded `unverified` as a
 * declared backfill. scripts/verify-registry.mjs:138-149 allows exactly that
 * during backfill, and marking those rows verified here would fabricate the
 * proof the v4 zero-unverified-live gate exists to demand. The ledger prints
 * the backfill count by kind, and names the selected rows inside it, so the
 * gap is measured rather than hidden.
 *
 * MCP cap (P7)
 * ------------
 * MCP_CAP is 8. When the selection record exists, the selected components of
 * kind `mcp` at catalog tier `core` must number at most MCP_CAP. The selection
 * comes from the record; the tier comes from the catalog, so the cap cannot be
 * satisfied by editing the record alone. The cap constrains the selection, not
 * the catalog: the catalog may list every MCP it knows.
 *
 * Phase sets (P8)
 * ---------------
 * catalogPhaseSets() returns { phase -> ["<kind>/<id>", ...] } for the six
 * phases scripts/orchestrate-stage.sh injects: scout, docs, plan, build,
 * review, operate. The component tokens come from the selection record; the
 * phase they land in and the tier gate come from the catalog. A token is placed
 * by its catalog phase, never by the key it was recorded under, so catalog
 * drift surfaces as a dropped token instead of hiding. `on-demand` is a
 * catalog value but not an orchestrated phase: such components never inject and
 * are absent from the sets by design.
 *
 * Component identity is `kind/id`, not a bare id: ids are unique within a kind,
 * not across kinds (`supabase` and `vercel` are both an mcp and a cli in the
 * `operate` phase), so an id-only set could hide a kind swap.
 *
 * Runtime: Node 25, ESM, zero dependencies.
 * Exit 0 when every proof holds, 1 when any proof fails.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG_PATH = path.join(ROOT, "registry", "catalog.json");
const DATA_DIR = path.join(ROOT, "registry", "data");
const MANIFEST_PATH = path.join(ROOT, ".opencode", "equip.manifest.json");
const ARSENAL_PATH = path.join(ROOT, ".opencode", "plugin", "arsenal.ts");
const AGENTS_DIR = path.join(ROOT, ".opencode", "agents");
const SKILLS_DIR = path.join(ROOT, ".opencode", "skills");

/** The context backstop: the selection may never hold more than this many core MCPs. */
export const MCP_CAP = 8;

const ORCHESTRATED_PHASES = ["scout", "docs", "plan", "build", "review", "operate"];
const KIT_TIERS = new Set(["core", "conditional"]);
const VERIFICATIONS = new Set(["verified", "unverified"]);
const AGENT_MODES = new Set(["primary", "subagent", "all"]);
const SELF_SOURCE = "3mar-baha/vantrilex-arsenal";

// kind -> canonical register. catalog.json is regenerated from these sidecars,
// so a selected token that is absent here has no register behind the mirror.
const SIDECAR_FILES = {
  agent: "agents.jsonl",
  benchmark: "benchmarks.jsonl",
  cli: "cli.jsonl",
  dataset: "datasets.jsonl",
  "design.md": "design.jsonl",
  formatting: "formatting.jsonl",
  hook: "hooks.jsonl",
  lsp: "lsp.jsonl",
  mcp: "mcp.jsonl",
  plugin: "plugins.jsonl",
  policy: "policies.jsonl",
  prompt: "prompts.jsonl",
  skill: "skills.jsonl",
  template: "templates.jsonl",
  theme: "themes.jsonl",
  workflow: "workflows.jsonl"
};

const rows = [];
const record = (check, status, detail) => rows.push({ check, status, detail });
const pad = (value, width) => String(value).padEnd(width, " ");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const componentToken = (kind, id) => kind + "/" + id;

const catalogIndex = (catalog) => {
  const byToken = new Map();
  for (const entry of catalog.components) {
    if (entry === null || typeof entry !== "object") continue;
    if (typeof entry.id !== "string" || typeof entry.kind !== "string") continue;
    byToken.set(componentToken(entry.kind, entry.id), entry);
  }
  return byToken;
};

const readSelection = () => {
  const manifest = readJson(MANIFEST_PATH);
  if (manifest === null || typeof manifest !== "object" || manifest.phases === null || typeof manifest.phases !== "object") {
    throw new Error(".opencode/equip.manifest.json carries no phases object");
  }
  return manifest.phases;
};

/**
 * Places every selected token in the phase the catalog declares, after the kit
 * tier gate. Returns the sets plus the tokens that could not be placed, so the
 * caller can fail loudly instead of reporting a smaller-but-green kit.
 */
const derivePhaseSets = (selection, index) => {
  const sets = {};
  const dropped = [];
  for (const phase of ORCHESTRATED_PHASES) sets[phase] = [];
  for (const key of Object.keys(selection)) {
    if (ORCHESTRATED_PHASES.includes(key) === false) {
      dropped.push(key + " (recorded under a phase orchestrate-stage.sh never injects)");
    }
  }
  for (const phase of ORCHESTRATED_PHASES) {
    const tokens = selection[phase];
    if (Array.isArray(tokens) === false) {
      dropped.push(phase + " (selection record carries no array for this phase)");
      continue;
    }
    const seen = new Set();
    for (const token of tokens) {
      if (typeof token !== "string") {
        dropped.push(phase + " (non-string selection entry)");
        continue;
      }
      if (seen.has(token)) {
        dropped.push(token + " (duplicate selection entry in " + phase + ")");
        continue;
      }
      seen.add(token);
      const entry = index.get(token);
      if (entry === undefined) {
        dropped.push(token + " (no catalog row)");
        continue;
      }
      if (KIT_TIERS.has(entry.tier) === false) {
        dropped.push(token + " (catalog tier " + JSON.stringify(entry.tier) + " is not kit-selectable)");
        continue;
      }
      if (ORCHESTRATED_PHASES.includes(entry.phase) === false) {
        dropped.push(token + " (catalog phase " + JSON.stringify(entry.phase) + " is not orchestrated)");
        continue;
      }
      sets[entry.phase].push(token);
    }
  }
  for (const phase of ORCHESTRATED_PHASES) sets[phase] = [...new Set(sets[phase])].sort();
  return { sets, dropped };
};

/** Phase set ledger — the shape scripts/orchestrate-stage.sh consumes. */
export const catalogPhaseSets = () =>
  derivePhaseSets(readSelection(), catalogIndex(readJson(CATALOG_PATH))).sets;

const loadSidecars = () => {
  const byKind = new Map();
  const problems = [];
  for (const [kind, file] of Object.entries(SIDECAR_FILES)) {
    let text = null;
    try {
      text = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
    } catch (error) {
      problems.push(file + " is unreadable (" + String(error.message) + ")");
      continue;
    }
    const ids = new Set();
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed === "") continue;
      let entry = null;
      try {
        entry = JSON.parse(trimmed);
      } catch (error) {
        problems.push(file + " carries an unparseable line (" + String(error.message) + ")");
        ids.clear();
        break;
      }
      if (entry !== null && typeof entry === "object" && typeof entry.id === "string") ids.add(entry.id);
    }
    if (ids.size > 0) byKind.set(kind, ids);
  }
  return { byKind, problems };
};

const frontmatterLines = (text) => {
  const fence = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return fence === null ? null : fence[1].split(/\r?\n/);
};

const frontmatterValue = (lines, key) => {
  const pattern = new RegExp("^\\s*" + key + "\\s*:");
  const hit = lines.find((line) => pattern.test(line));
  if (hit === undefined) return null;
  return hit.replace(new RegExp("^\\s*" + key + "\\s*:\\s*"), "").trim().replace(/^["']|["']$/g, "");
};

const camelTokens = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => token.toLowerCase());

const exportedNames = (text) => {
  const names = new Set();
  for (const match of text.matchAll(/export\s+(?:const|function|async\s+function)\s+([A-Za-z_$][\w$]*)/g)) {
    names.add(match[1]);
  }
  return [...names];
};

/**
 * Derives the hook -> callback pair from the catalog id and the plugin source:
 * the callback whose camel-case tokens are all drawn from the hook id, choosing
 * the most specific (longest) match. Ambiguity is a failure, never a pick.
 */
const hookCallback = (hookId, names) => {
  const vocabulary = new Set(hookId.split("-").filter((token) => token.length > 0));
  const candidates = names.filter((name) => {
    const tokens = camelTokens(name);
    return tokens.length > 0 && tokens.every((token) => vocabulary.has(token));
  });
  if (candidates.length === 0) return { callback: null, reason: "no exported callback draws only on this hook id" };
  const width = Math.max(...candidates.map((name) => camelTokens(name).length));
  const winners = candidates.filter((name) => camelTokens(name).length === width);
  if (winners.length > 1) {
    return { callback: null, reason: "ambiguous: " + winners.sort().join(", ") };
  }
  return { callback: winners[0], reason: null };
};

const samples = (items, key, limit = 8) => {
  const shown = items.slice(0, limit).map(key).join(", ");
  return items.length > limit ? shown + ", ...(" + (items.length - limit) + " more)" : shown;
};

const kindTally = (components) => {
  const tally = new Map();
  for (const entry of components) {
    const bucket = tally.get(entry.kind) ?? { rows: 0, verified: 0, unverified: 0, commands: 0 };
    bucket.rows += 1;
    if (entry.verification === "verified") bucket.verified += 1;
    if (entry.verification === "unverified") bucket.unverified += 1;
    if (entry.install_cmd !== null && entry.install_cmd !== undefined) bucket.commands += 1;
    tally.set(entry.kind, bucket);
  }
  return tally;
};

const main = () => {
  let catalog = null;
  try {
    catalog = readJson(CATALOG_PATH);
  } catch (error) {
    record("catalog", "FAIL", "cannot read registry/catalog.json: " + String(error.message));
  }
  if (catalog !== null && Array.isArray(catalog.components) === false) {
    record("catalog", "FAIL", "registry/catalog.json carries no components array");
    catalog = null;
  }
  if (catalog === null) {
    console.log("VERDICT: FAIL - catalog not proven (1 failed).");
    process.exitCode = 1;
    return;
  }

  const components = catalog.components.filter((entry) => entry !== null && typeof entry === "object");
  let selection = null;
  let selectionProblem = null;
  try {
    selection = readSelection();
  } catch (error) {
    selectionProblem = String(error.message);
  }

  // P1–P3: command honesty, in the direction the registers can prove today.
  const verifiedWithoutCommand = components.filter(
    (entry) => entry.verification === "verified" && (entry.install_cmd === null || entry.install_cmd === undefined)
  );
  record(
    "command-honesty/verified-requires-command",
    verifiedWithoutCommand.length === 0 ? "PASS" : "FAIL",
    verifiedWithoutCommand.length === 0
      ? components.filter((entry) => entry.verification === "verified").length +
        " verified rows all carry an install command"
      : verifiedWithoutCommand.length +
        " rows claim verified with no command: " +
        samples(verifiedWithoutCommand, (entry) => entry.kind + "/" + entry.id)
  );

  const nullWithoutUnverified = components.filter(
    (entry) => (entry.install_cmd === null || entry.install_cmd === undefined) && entry.verification !== "unverified"
  );
  record(
    "command-honesty/null-requires-unverified",
    nullWithoutUnverified.length === 0 ? "PASS" : "FAIL",
    nullWithoutUnverified.length === 0
      ? components.filter((entry) => entry.install_cmd === null || entry.install_cmd === undefined).length +
        " command-less rows are all recorded unverified"
      : nullWithoutUnverified.length +
        " rows carry no command without saying unverified: " +
        samples(nullWithoutUnverified, (entry) => entry.kind + "/" + entry.id)
  );

  const offVocabulary = components.filter((entry) => VERIFICATIONS.has(entry.verification) === false);
  const pending = components.filter((entry) => entry.verification === "pending");
  record(
    "command-honesty/no-pending",
    offVocabulary.length === 0 ? "PASS" : "FAIL",
    offVocabulary.length === 0
      ? components.length + " rows carry only verified or unverified; 0 pending"
      : offVocabulary.length +
        " rows carry a value outside the vocabulary (pending: " +
        pending.length +
        "): " +
        samples(offVocabulary, (entry) => entry.kind + "/" + entry.id + "=" + JSON.stringify(entry.verification))
  );

  // Selected tokens, in record order. Computed once: every loadability proof
  // below is scoped to the selection, because an unselected catalog row is not
  // promised to load (the catalog also carries design libraries and retired
  // records that ship no surface by design).
  const index = catalogIndex(catalog);
  const selectedTokens = [];
  if (selection !== null) {
    for (const phase of ORCHESTRATED_PHASES) {
      if (Array.isArray(selection[phase]) === false) continue;
      for (const token of selection[phase]) selectedTokens.push(token);
    }
  }

  // P4: every selected hook row maps to a callback the plugin exports and wires.
  let arsenalText = null;
  try {
    arsenalText = fs.readFileSync(ARSENAL_PATH, "utf8");
  } catch (error) {
    record("loadability/hooks", "FAIL", "cannot read .opencode/plugin/arsenal.ts: " + String(error.message));
  }
  if (arsenalText !== null && selection === null) {
    record("loadability/hooks", "FAIL", "cannot be evaluated: selection record unreadable (" + selectionProblem + ")");
  }
  if (arsenalText !== null && selection !== null) {
    const hooks = selectedTokens.map((token) => index.get(token)).filter((entry) => entry !== undefined && entry.kind === "hook");
    const names = exportedNames(arsenalText);
    const failures = [];
    const pairs = [];
    for (const hook of hooks) {
      const { callback, reason } = hookCallback(hook.id, names);
      if (callback === null) {
        failures.push(hook.id + ": " + reason);
        continue;
      }
      const uses = (arsenalText.match(new RegExp("\\b" + callback + "\\b", "g")) ?? []).length;
      if (uses < 2) {
        failures.push(hook.id + " -> " + callback + ": declared but not wired (one occurrence)");
        continue;
      }
      pairs.push(hook.id + " -> " + callback);
    }
    record(
      "loadability/hooks",
      failures.length === 0 ? "PASS" : "FAIL",
      failures.length === 0
        ? hooks.length + " hook rows map to exported, wired callbacks: " + pairs.join("; ")
        : failures.join("; ")
    );
  }

  // P5: agent definitions resolve locally and declare mode.
  let agentFiles = null;
  try {
    agentFiles = fs.readdirSync(AGENTS_DIR).filter((file) => file.endsWith(".md")).sort();
  } catch (error) {
    record("loadability/agents", "FAIL", "cannot read .opencode/agents/: " + String(error.message));
  }
  if (agentFiles !== null && selection !== null) {
    const failures = [];
    let declared = 0;
    for (const file of agentFiles) {
      let text = null;
      try {
        text = fs.readFileSync(path.join(AGENTS_DIR, file), "utf8");
      } catch (error) {
        failures.push(file + ": unreadable (" + String(error.message) + ")");
        continue;
      }
      const lines = frontmatterLines(text);
      if (lines === null) {
        failures.push(file + ": no frontmatter fence");
        continue;
      }
      const stem = file.replace(/\.md$/, "");
      const name = frontmatterValue(lines, "name");
      if (name !== stem) {
        failures.push(file + ": frontmatter name " + JSON.stringify(name) + " does not match the filename stem");
        continue;
      }
      const mode = frontmatterValue(lines, "mode");
      if (mode === null) {
        failures.push(file + ": declares no mode (V2 would default it to primary)");
        continue;
      }
      if (AGENT_MODES.has(mode) === false) {
        failures.push(file + ": mode " + JSON.stringify(mode) + " is not primary, subagent or all");
        continue;
      }
      declared += 1;
    }
    const selectedAgents = selectedTokens.map((token) => index.get(token)).filter((entry) => entry !== undefined && entry.kind === "agent");
    const upstreamOnly = [];
    let localAgents = 0;
    for (const entry of selectedAgents) {
      const local = entry.source === null || entry.source === SELF_SOURCE;
      if (local === false) {
        upstreamOnly.push(entry.id);
        continue;
      }
      if (agentFiles.includes(entry.id + ".md") === false) {
        failures.push(entry.id + ": selected agent has no .opencode/agents/" + entry.id + ".md");
        continue;
      }
      localAgents += 1;
    }
    record(
      "loadability/agents",
      failures.length === 0 ? "PASS" : "FAIL",
      failures.length === 0
        ? declared +
          " local agent files declare a valid mode; " +
          localAgents +
          " selected agents resolve to .opencode/agents/<id>.md; " +
          upstreamOnly.length +
          " upstream agent" +
          (upstreamOnly.length === 1 ? "" : "s") +
          " (" +
          upstreamOnly.join(", ") +
          ") " +
          (upstreamOnly.length === 1 ? "carries" : "carry") +
          " no local file by design"
        : failures.join("; ")
    );
  } else if (agentFiles !== null && selection === null) {
    record("loadability/agents", "FAIL", "cannot be evaluated: selection record unreadable (" + selectionProblem + ")");
  }

  // P6: every selected skill resolves to a folder or to a delivery command.
  let skillFolders = null;
  try {
    skillFolders = fs
      .readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    record("loadability/skills", "FAIL", "cannot read .opencode/skills/: " + String(error.message));
  }
  if (skillFolders !== null && selection !== null) {
    const failures = [];
    let local = 0;
    let delivered = 0;
    for (const entry of selectedTokens.map((token) => index.get(token))) {
      if (entry === undefined || entry.kind !== "skill") continue;
      if (skillFolders.includes(entry.id) && fs.existsSync(path.join(SKILLS_DIR, entry.id, "SKILL.md"))) {
        local += 1;
        continue;
      }
      if (entry.install_cmd !== null && entry.install_cmd !== undefined) {
        delivered += 1;
        continue;
      }
      failures.push(entry.id + ": no .opencode/skills/" + entry.id + "/SKILL.md and no install command");
    }
    record(
      "loadability/skills",
      failures.length === 0 ? "PASS" : "FAIL",
      failures.length === 0
        ? "every selected skill resolves: " +
          local +
          " to a local folder (deep parse delegated to scripts/verify-skills.mjs over " +
          skillFolders.length +
          " folders), " +
          delivered +
          " to an install command"
        : failures.join("; ")
    );
  } else if (skillFolders !== null && selection === null) {
    record("loadability/skills", "FAIL", "cannot be evaluated: selection record unreadable (" + selectionProblem + ")");
  }

  // Registers: every selected token exists in its canonical sidecar, not only
  // in the generated mirror.
  if (selection === null) {
    record("loadability/registers", "FAIL", "cannot be evaluated: selection record unreadable (" + selectionProblem + ")");
  } else {
    const { byKind, problems } = loadSidecars();
    const unresolved = [];
    for (const token of selectedTokens) {
      const entry = index.get(token);
      if (entry === undefined) {
        unresolved.push(token + " (no catalog row)");
        continue;
      }
      const ids = byKind.get(entry.kind);
      if (ids === undefined) {
        unresolved.push(token + " (no readable register for kind " + entry.kind + ")");
        continue;
      }
      if (ids.has(entry.id) === false) unresolved.push(token + " (absent from " + SIDECAR_FILES[entry.kind] + ")");
    }
    const failures = [...problems, ...unresolved];
    record(
      "loadability/registers",
      failures.length === 0 ? "PASS" : "FAIL",
      failures.length === 0
        ? selectedTokens.length + " selected tokens resolve in catalog.json and in registry/data/<kind>.jsonl"
        : failures.join("; ")
    );
  }

  // P7: MCP cap over the selected core-tier MCPs.
  if (selection === null) {
    record("mcp-cap", "FAIL", "cannot be evaluated: selection record unreadable (" + selectionProblem + ")");
  } else {
    const coreMcps = [];
    for (const token of selectedTokens) {
      const entry = index.get(token);
      if (entry !== undefined && entry.kind === "mcp" && entry.tier === "core") coreMcps.push(entry.id);
    }
    record(
      "mcp-cap",
      coreMcps.length <= MCP_CAP ? "PASS" : "FAIL",
      coreMcps.length +
        " selected tier-core MCP" +
        (coreMcps.length === 1 ? "" : "s") +
        (coreMcps.length <= MCP_CAP ? " within MCP_CAP " : " exceed MCP_CAP ") +
        MCP_CAP +
        (coreMcps.length === 0 ? "" : ": " + coreMcps.sort().join(", "))
    );
  }

  // P8: the selected ids survive the catalog-only derivation into phase sets.
  let phaseSets = null;
  if (selection === null) {
    record("phase-sets", "FAIL", "cannot be evaluated: selection record unreadable (" + selectionProblem + ")");
  } else {
    const { sets, dropped } = derivePhaseSets(selection, index);
    phaseSets = sets;
    const placed = ORCHESTRATED_PHASES.reduce((total, phase) => total + sets[phase].length, 0);
    record(
      "phase-sets",
      dropped.length === 0 && placed === selectedTokens.length ? "PASS" : "FAIL",
      dropped.length !== 0
        ? dropped.length + " selected token(s) cannot be placed from the catalog: " + dropped.join("; ")
        : placed === selectedTokens.length
          ? placed +
            " selected tokens place into " +
            ORCHESTRATED_PHASES.length +
            " orchestrated phases (" +
            ORCHESTRATED_PHASES.map((phase) => phase + " " + sets[phase].length).join(", ") +
            "); on-demand never injects and is absent by design"
          : "derivation placed " + placed + " of " + selectedTokens.length + " selected tokens"
    );
  }

  // Table.
  let checkWidth = "check".length;
  let statusWidth = "status".length;
  for (const row of rows) {
    if (row.check.length > checkWidth) checkWidth = row.check.length;
    if (row.status.length > statusWidth) statusWidth = row.status.length;
  }
  console.log(pad("check", checkWidth) + "  " + pad("status", statusWidth) + "  detail");
  for (const row of rows) {
    console.log(pad(row.check, checkWidth) + "  " + pad(row.status, statusWidth) + "  " + row.detail);
  }

  // Ledger 1: command tally by kind.
  const tally = kindTally(components);
  console.log("");
  console.log("command tally by kind (rows / verified / unverified / with command)");
  let kindWidth = "kind".length;
  for (const kind of tally.keys()) if (kind.length > kindWidth) kindWidth = kind.length;
  console.log(pad("kind", kindWidth) + "  rows  verified  unverified  with-command");
  for (const [kind, bucket] of [...tally.entries()].sort((left, right) => (left[0] < right[0] ? -1 : 1))) {
    console.log(
      pad(kind, kindWidth) +
        "  " +
        pad(bucket.rows, 4) +
        "  " +
        pad(bucket.verified, 8) +
        "  " +
        pad(bucket.unverified, 10) +
        "  " +
        bucket.commands
    );
  }

  // Ledger 2: the backfill gap the strict direction would have to close.
  const backfill = components.filter(
    (entry) =>
      (entry.install_cmd !== null && entry.install_cmd !== undefined) && entry.verification === "unverified"
  );
  const selectedBackfill =
    selection === null
      ? []
      : selectedTokens.filter((token) => {
          const entry = index.get(token);
          return (
            entry !== undefined &&
            entry.install_cmd !== null &&
            entry.install_cmd !== undefined &&
            entry.verification === "unverified"
          );
        });
  console.log("");
  console.log(
    "command-honesty/backfill (not a gate): " +
      backfill.length +
      " catalog rows carry a command recorded unverified — allowed during backfill by scripts/verify-registry.mjs:138-149; the strict direction lands at the v4 zero-unverified-live gate"
  );
  if (selectedTokens.length > 0) {
    console.log(
      "  inside the selection: " +
        selectedBackfill.length +
        " of " +
        selectedTokens.length +
        (selectedBackfill.length === 0 ? "" : " -> " + selectedBackfill.join(", "))
    );
  }

  // Ledger 3: phase -> count -> ids.
  if (phaseSets !== null) {
    console.log("");
    console.log("phase ledger (catalogPhaseSets()):");
    for (const phase of ORCHESTRATED_PHASES) {
      console.log("  " + phase + " [" + phaseSets[phase].length + "]: " + (phaseSets[phase].join(", ") || "(empty)"));
    }
  }

  let passed = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "PASS") passed += 1;
    else failed += 1;
  }
  console.log("");
  if (failed === 0) {
    console.log("VERDICT: PASS - catalog proven (" + passed + " passed, 0 failed).");
  } else {
    console.log("VERDICT: FAIL - catalog not proven (" + passed + " passed, " + failed + " failed).");
  }
  process.exitCode = failed === 0 ? 0 : 1;
};

const isDirectRun = () =>
  process.argv[1] !== undefined && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectRun()) main();
