#!/usr/bin/env node
/**
 * Vantrilex catalog verifier — the catalog-only replacement proofs (P1–P8)
 * plus the per-kind shape proofs the retired lock verifier used to carry.
 *
 * Proves the kit from registry/catalog.json and registry/data/*.jsonl without
 * reading kit/kit.lock. The lock's own proofs are what this script replaces;
 * reading the lock here would make the replacement circular. S3 deleted the
 * lock, its schema and scripts/verify-kit.mjs, so this script is the sole
 * component gate; the per-kind checks below are the ported coverage map:
 *
 *   per-kind/cli           -> command-shape/cli
 *   per-kind/lsp           -> command-shape/lsp
 *   per-kind/theme         -> command-shape/theme
 *   per-kind/skills-upstream -> command-shape/skills-upstream
 *   per-kind/mcp-npm       -> command-shape/mcp-npm
 *   per-kind/prompt|dataset|template|policy|benchmark|workflow|design.md
 *                          -> file-copy/shape
 *   per-kind/agents        -> agent-hygiene (+ loadability/agents)
 *   pending-integrity      -> selection/top-level-skills
 *
 * The ported checks read catalog rows, not lock entries. Network legs keep the
 * retired verifier's contract: an unreachable registry or an unauthenticated gh
 * reports SKIPPED with the reason, and the verdict counts it as skipped rather
 * than passed.
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
 * Selection suspension (P4, owner ruling §1)
 * -------------------------------------------
 * A selected token whose correct source coordinate cannot be found is recorded
 * in the selection record's `suspended` list with its reason (`missing-address`),
 * the date the disposition was taken, and the document that carries the hunt.
 * The token stays in its phase array: nothing is deleted and nothing is
 * re-pointed. The gate holds a suspended token out of `loadability/registers`
 * and `phase-sets` and reports the count instead, so catalog and selection agree
 * that the component is not presently verified-equipped.
 *
 * The suspension is not a blanket allow-list. It is valid only while the token
 * has no catalog row; a token that is live again is no longer suspended, it is
 * treated as an ordinary selected token, and the gate reports the record as a
 * stale suspension (auto-restored). Recovery therefore needs no manifest edit:
 * the address hunt returns evidence, the row is re-admitted, and the suspension
 * stops applying on its own.
 *
 * Evidence TTL (P4, R7)
 * ---------------------
 * Every proof is a dated observation, so every proof ages out: command_registry
 * after 90 days, load_proof after 180, source_proof after 365. A proof past its
 * window fails with `evidence-lapsed` semantics instead of passing on a stale
 * date. A state with no checked_at is an evaluation failure, never a pass.
 *
 * Runtime: Node 25, ESM, zero dependencies.
 * Exit 0 when every proof holds, 1 when any proof fails.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { loadSchema, validateRecord } from "./generate-catalog-json.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG_PATH = path.join(ROOT, "registry", "catalog.json");
const DATA_DIR = path.join(ROOT, "registry", "data");
const CANDIDATES_DIR = path.join(ROOT, "registry", "candidates");
const MANIFEST_PATH = path.join(ROOT, ".opencode", "equip.manifest.json");
const ARSENAL_PATH = path.join(ROOT, ".opencode", "plugin", "arsenal.ts");
const AGENTS_DIR = path.join(ROOT, ".opencode", "agents");
const SKILLS_DIR = path.join(ROOT, ".opencode", "skills");

/** The context backstop: the selection may never hold more than this many core MCPs. */
export const MCP_CAP = 8;

const ORCHESTRATED_PHASES = ["scout", "docs", "plan", "build", "review", "operate"];
const KIT_TIERS = new Set(["core", "conditional"]);
const VERIFICATIONS = new Set(["verified"]);
const EVIDENCE_CLASSES = new Set(["loadable", "installable", "upstream", "data"]);
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
const recordResult = (check, result) => record(check, result.status, result.detail);
const pad = (value, width) => String(value).padEnd(width, " ");

// Per-kind shape vocabulary, ported verbatim from the retired lock verifier so
// the tightened command rules survive the lock's deletion.
const CATALOG_PHASES = new Set(["scout", "docs", "plan", "build", "review", "operate", "on-demand"]);
const CATALOG_TIERS = new Set(["core", "conditional", "extended"]);
const NETWORK_TIMEOUT_MS = 20000;
const SKILL_CMD = /^npx skills add (\S+) --skill (\S+) -a opencode( -y)?$/;
const NPM_CMD = /^npx -y (\S+)$/;
const CLI_PKG_MANAGERS = [
  /^npm (?:i|install) -g (\S+)(?:@\S+)?$/,
  /^pnpm (?:i|install) -g (\S+)(?:@\S+)?$/,
  /^yarn global add (\S+)(?:@\S+)?$/,
  /^bun (?:i|add) -g (\S+)(?:@\S+)?$/,
  /^brew install (\S+)$/,
  /^brew tap (\S+)$/,
  /^scoop install (\S+)$/,
  /^choco install (\S+)$/,
  /^winget install (?:--id )?(\S+)$/,
  /^apt(?:-get)? install (\S+)$/,
  /^dnf install (\S+)$/,
  /^pacman -S (\S+)$/,
  /^cargo install (\S+)$/,
  /^go install (\S+)$/,
  /^pipx install (\S+)$/,
  /^uv tool install (\S+)$/
];
const CLI_VENDOR_INSTALLERS = [/^gh (\S+)$/, /^mise (?:install|use|exec) (\S+)$/, /^rustup-init\b.*$/, /^op install (\S+)$/, /^docker-plugin-install (\S+)$/];
const CLI_PIPE_FORBIDDEN = /\||\|\||&&|;|`|\$\(|\$\{/;
const THEME_COPY_RE = /^cp (registry\/themes\/[A-Za-z0-9._-]+\.json) (\S+)$/;
const DESIGN_COPY_RE = /^cp registry\/design\/([A-Za-z0-9._-]+)\/DESIGN\.md (\S+)$/;
const FILE_COPY_PIPE_FORBIDDEN = /\||\|\||&&|;|`|\$\(|\$\{/;
const OFFLINE_MARKERS = [
  "ENOENT",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "timed out",
  "network",
  "Network",
  "offline",
  "Offline",
  "getaddrinfo",
  "proxy",
  "Proxy",
  "certificate",
  "CERTIFICATE",
  "SSL",
  "HTTP 401",
  "HTTP 403",
  "HTTP 429",
  "HTTP 5",
  "Bad credentials",
  "Not authenticated",
  "authentication required",
  "rate limit",
  "Rate limit",
  "connection reset",
  "Connection reset",
  "socket hang up",
  "is not recognized"
];
const TOP_LEVEL_SKILLS = ["skill/vantrilex-vanguard", "skill/vantrilex-doctrine", "skill/vantrilex-prime"];

// P4 suspension record (owner ruling §1). The fields are fixed so a suspension
// cannot be recorded as a free-form note nothing reads.
const SUSPENSION_REASON = "missing-address";
const SUSPENSION_FIELDS = ["token", "reason", "since", "document"];
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// P4 evidence TTL (R7): the window each proof leg stays valid.
export const EVIDENCE_TTL_DAYS = Object.freeze({ command_registry: 90, load_proof: 180, source_proof: 365 });

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
  if (manifest.suspended !== undefined && Array.isArray(manifest.suspended) === false) {
    throw new Error(".opencode/equip.manifest.json carries a suspended value that is not an array");
  }
  return { phases: manifest.phases, suspended: manifest.suspended === undefined ? [] : manifest.suspended };
};

/**
 * Validates the suspension record and splits it in two: tokens that are still
 * missing from the catalog (the suspension applies), and tokens that are live
 * again (the record is stale and the token is auto-restored). A malformed entry
 * is a failure — a suspension nobody can audit is not a disposition.
 */
const suspensionLedger = (suspended, phases, index) => {
  const failures = [];
  const active = [];
  const stale = [];
  const selectionTokens = new Set();
  for (const key of Object.keys(phases)) {
    if (Array.isArray(phases[key])) for (const token of phases[key]) selectionTokens.add(token);
  }
  const seen = new Set();
  for (let i = 0; i < suspended.length; i++) {
    const entry = suspended[i];
    const where = "suspended[" + i + "]";
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      failures.push(where + " is not an object");
      continue;
    }
    const unknown = Object.keys(entry).filter((key) => SUSPENSION_FIELDS.includes(key) === false);
    if (unknown.length > 0) failures.push(where + " carries unknown field(s): " + unknown.join(", "));
    if (typeof entry.token !== "string" || entry.token === "") {
      failures.push(where + " carries no token");
      continue;
    }
    if (seen.has(entry.token)) {
      failures.push(entry.token + " is suspended more than once");
      continue;
    }
    seen.add(entry.token);
    if (entry.reason !== SUSPENSION_REASON) {
      failures.push(entry.token + ": reason " + JSON.stringify(entry.reason) + " is not " + JSON.stringify(SUSPENSION_REASON));
    }
    if (typeof entry.since !== "string" || ISO_DATE_RE.test(entry.since) === false) {
      failures.push(entry.token + ": since " + JSON.stringify(entry.since) + " is not an ISO date");
    }
    if (typeof entry.document !== "string" || entry.document === "") {
      failures.push(entry.token + ": carries no document reference");
    } else if (fs.existsSync(path.join(ROOT, entry.document)) === false) {
      failures.push(entry.token + ": document " + entry.document + " does not exist");
    }
    if (selectionTokens.has(entry.token) === false) {
      failures.push(entry.token + " is suspended but is not a token in the selection record");
    }
    if (index.has(entry.token)) stale.push(entry.token);
    else active.push(entry.token);
  }
  return { failures, active, stale };
};

/**
 * Places every selected token in the phase the catalog declares, after the kit
 * tier gate. Returns the sets plus the tokens that could not be placed, so the
 * caller can fail loudly instead of reporting a smaller-but-green kit. Tokens
 * held by an active suspension are counted and left out: they have no catalog
 * row to place by, and the suspension is the recorded reason.
 */
const derivePhaseSets = (selection, index, suspendedSet) => {
  const sets = {};
  const dropped = [];
  let suspended = 0;
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
      if (suspendedSet !== undefined && suspendedSet.has(token)) {
        suspended += 1;
        continue;
      }
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
  return { sets, dropped, suspended };
};

/** Phase set ledger — the shape scripts/orchestrate-stage.sh consumes. */
export const catalogPhaseSets = () => {
  const selection = readSelection();
  const index = catalogIndex(readJson(CATALOG_PATH));
  const ledger = suspensionLedger(selection.suspended, selection.phases, index);
  return derivePhaseSets(selection.phases, index, new Set(ledger.active)).sets;
};

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

// --- ported per-kind shape proofs -------------------------------------------
// These helpers come from the retired scripts/verify-kit.mjs. Their inputs are
// catalog rows now, and their enum sets accept the catalog's vocabulary
// (`on-demand`, `extended`) because the catalog, not the lock, defines it.

const isPlainObject = (value) => typeof value === "object" && value !== null && Array.isArray(value) === false;

const windowsSpawn = (command, args) => {
  const parts = [command].concat(args);
  for (const part of parts) {
    if (/[\s"]/.test(part)) throw new Error("refusing to spawn a token carrying whitespace or quotes: " + part);
  }
  return { command: "cmd.exe", args: ["/d", "/s", "/c", parts.join(" ")] };
};

const runCapture = (command, args) => {
  const spawn = process.platform === "win32" ? windowsSpawn(command, args) : { command, args };
  try {
    const out = execFileSync(spawn.command, spawn.args, {
      cwd: ROOT,
      timeout: NETWORK_TIMEOUT_MS,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    return { ok: true, stdout: typeof out === "string" ? out : String(out), stderr: "", code: "" };
  } catch (error) {
    const stderr = error && error.stderr ? String(error.stderr) : "";
    const stdout = error && error.stdout ? String(error.stdout) : "";
    const code = error && error.code !== undefined ? String(error.code) : "error";
    const message = error && error.message ? String(error.message) : "";
    return { ok: false, stdout, stderr, code, message };
  }
};

const offlineReason = (result) => {
  if (result.code === "ENOENT") return "tool not on PATH (ENOENT)";
  const hay = result.stderr + "\n" + result.stdout + "\n" + result.code + "\n" + (result.message || "");
  const marker = OFFLINE_MARKERS.find((candidate) => hay.includes(candidate));
  return marker === undefined ? null : "network or credentials unavailable (" + marker + ")";
};

const cliCommandReason = (cmd) => {
  if (typeof cmd !== "string" || cmd.trim() === "") {
    return "install_cmd is empty; a cli entry carries the command that installs the tool";
  }
  const text = cmd.trim();
  if (CLI_PIPE_FORBIDDEN.test(text)) {
    return "install_cmd chains shell operators or pipes remote code (" + JSON.stringify(cmd) + "); use a package-manager invocation or the vendor installer";
  }
  for (const pattern of CLI_PKG_MANAGERS) {
    const match = text.match(pattern);
    if (match !== null) {
      const target = match[1];
      if (target === undefined || /^[<>{}\[\]()|&;]$/.test(target)) return "install_cmd names no package (" + JSON.stringify(cmd) + ")";
      return null;
    }
  }
  for (const pattern of CLI_VENDOR_INSTALLERS) {
    if (pattern.test(text)) return null;
  }
  if (/\.sh\b|\.ps1\b|\.bat\b|\.cmd\b|\.py\b|\.rb\b/.test(text)) {
    return "install_cmd runs a script file (" + JSON.stringify(cmd) + "); use a package-manager invocation or the vendor installer";
  }
  return "install_cmd matches no package-manager invocation and no known vendor installer (" + JSON.stringify(cmd) + ")";
};

const phaseReason = (entry) =>
  CATALOG_PHASES.has(entry.phase) ? null : entry.id + ": phase " + JSON.stringify(entry.phase) + " is outside the catalog phase enum";

const tierReason = (entry) =>
  CATALOG_TIERS.has(entry.tier) ? null : entry.id + ": tier " + JSON.stringify(entry.tier) + " is outside the catalog tier enum";

const verificationReason = (entry) => {
  if (VERIFICATIONS.has(entry.verification) === false) {
    return entry.id + ": verification " + JSON.stringify(entry.verification) + " is not verified; v4 retires every other live state";
  }
  if (EVIDENCE_CLASSES.has(entry.class) === false) {
    return entry.id + ": class " + JSON.stringify(entry.class) + " is outside the v4 class enum";
  }
  const registry = entry.evidence !== null && typeof entry.evidence === "object" ? entry.evidence.command_registry : null;
  if (entry.class === "installable" && (typeof entry.install_cmd !== "string" || entry.install_cmd === "")) {
    return entry.id + ": installable row carries no install_cmd";
  }
  if (typeof entry.install_cmd === "string" && (registry === null || registry === undefined)) {
    return entry.id + ": non-null install_cmd carries no evidence.command_registry";
  }
  if (registry !== null && registry !== undefined && registry.command !== entry.install_cmd) {
    return entry.id + ": evidence.command_registry.command does not equal install_cmd";
  }
  return null;
};

const collectThemeKeyPaths = (value, atPath, out) => {
  if (value === null || typeof value !== "object") return out;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) collectThemeKeyPaths(value[i], atPath + "[" + i + "]", out);
    return out;
  }
  for (const key of Object.keys(value)) {
    const lower = key.toLowerCase();
    const markdownImageToken = atPath.endsWith(".markdown") && (lower === "image" || lower === "imagetext");
    if (markdownImageToken === false && /image|wallpaper/.test(lower)) out.push(atPath + "." + key);
    if (lower === "model") out.push(atPath + "." + key);
    collectThemeKeyPaths(value[key], atPath + "." + key, out);
  }
  return out;
};

const checkCliRows = (components) => {
  const clis = components.filter((entry) => entry.kind === "cli");
  if (clis.length === 0) return { status: "PASS", detail: "0 cli rows; the kind carries no entry yet" };
  const failures = [];
  for (const entry of clis) {
    const reason = phaseReason(entry) ?? tierReason(entry) ?? verificationReason(entry);
    if (reason !== null) {
      failures.push(reason);
      if (typeof entry.install_cmd !== "string" || entry.install_cmd === "") continue;
    }
    if (typeof entry.install_cmd !== "string" || entry.install_cmd.trim() === "") {
      failures.push(entry.id + ": install_cmd is null; a cli entry must carry a real installer command");
      continue;
    }
    const commandReason = cliCommandReason(entry.install_cmd);
    if (commandReason !== null) failures.push(entry.id + ": " + commandReason);
  }
  if (failures.length > 0) return { status: "FAIL", detail: failures.join("; ") };
  return {
    status: "PASS",
    detail: clis.length + " cli rows carry a real installer command with valid phase, tier and verification (" + clis.filter((entry) => entry.verification === "verified").length + " verified)"
  };
};

const readLspSidecar = () => {
  try {
    const byId = new Map();
    for (const line of fs.readFileSync(path.join(DATA_DIR, "lsp.jsonl"), "utf8").split(/\r?\n/)) {
      if (line.trim() === "") continue;
      const parsed = JSON.parse(line);
      if (typeof parsed.id === "string") byId.set(parsed.id, parsed);
    }
    return byId;
  } catch (error) {
    return null;
  }
};

const checkLspRows = (components) => {
  const lsps = components.filter((entry) => entry.kind === "lsp");
  if (lsps.length === 0) return { status: "PASS", detail: "0 lsp rows; the kind carries no entry yet" };
  const sidecar = readLspSidecar();
  const failures = [];
  let provisioned = 0;
  let needLabels = 0;
  for (const entry of lsps) {
    const reason = phaseReason(entry) ?? tierReason(entry) ?? verificationReason(entry);
    if (reason !== null) failures.push(reason);
    if (entry.install_cmd === null || entry.install_cmd === undefined) {
      if (entry.class !== "loadable" || entry.evidence === null || typeof entry.evidence !== "object" || entry.evidence.load_proof === undefined) {
        failures.push(entry.id + ": null command is only honest for a loadable row carrying load_proof");
        continue;
      }
      if (sidecar === null) {
        failures.push(entry.id + ": need-label cannot be evaluated: registry/data/lsp.jsonl is unreadable");
        continue;
      }
      const side = sidecar.get(entry.id);
      if (side === undefined) {
        failures.push(entry.id + ": need-label has no matching record in registry/data/lsp.jsonl");
        continue;
      }
      if (typeof side.when_to_use !== "string" || side.when_to_use.trim() === "") {
        failures.push(entry.id + ": need-label carries no when_to_use instruction pointing at the project's own typecheck/lint");
        continue;
      }
      needLabels++;
      continue;
    }
    const commandReason = cliCommandReason(entry.install_cmd);
    if (commandReason !== null) failures.push(entry.id + ": " + commandReason);
    else provisioned++;
  }
  if (failures.length > 0) return { status: "FAIL", detail: failures.join("; ") };
  return {
    status: "PASS",
    detail: lsps.length + " lsp row(s) valid with correct phase, tier and verification (" + provisioned + " provisioned with a real installer, " + needLabels + " need-label pointing at project typecheck/lint)"
  };
};

const checkThemeRows = (components) => {
  const themes = components.filter((entry) => entry.kind === "theme");
  if (themes.length === 0) return { status: "PASS", detail: "0 theme rows; the kind carries no entry yet" };
  const failures = [];
  for (const entry of themes) {
    const reason = phaseReason(entry) ?? tierReason(entry) ?? verificationReason(entry);
    if (reason !== null) failures.push(reason);
    if (typeof entry.install_cmd !== "string" || entry.install_cmd.trim() === "") {
      failures.push(entry.id + ": install_cmd is empty; a theme entry must carry the file-copy command that installs the JSON");
      continue;
    }
    const text = entry.install_cmd.trim();
    if (FILE_COPY_PIPE_FORBIDDEN.test(text)) {
      failures.push(entry.id + ": install_cmd chains shell operators (" + JSON.stringify(entry.install_cmd) + "); use a plain file copy");
      continue;
    }
    const match = text.match(THEME_COPY_RE);
    if (match === null) {
      failures.push(entry.id + ": install_cmd is not a `cp registry/themes/<id>.json <themes-dir>/<id>.json` file copy (" + JSON.stringify(entry.install_cmd) + ")");
      continue;
    }
    const src = match[1];
    const dest = match[2];
    const expectedSrc = "registry/themes/" + entry.id + ".json";
    if (src !== expectedSrc) {
      failures.push(entry.id + ": install_cmd copies " + JSON.stringify(src) + " but the theme ships at " + expectedSrc);
      continue;
    }
    if (dest.endsWith("/" + entry.id + ".json") === false) {
      failures.push(entry.id + ": install_cmd copies to " + JSON.stringify(dest) + " but the target filename must be " + entry.id + ".json, which V2 turns into the theme name");
      continue;
    }
    const filePath = path.join(ROOT, src);
    if (fs.existsSync(filePath) === false) {
      failures.push(entry.id + ": theme file " + src + " does not exist");
      continue;
    }
    let theme = null;
    try {
      theme = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      failures.push(entry.id + ": " + src + " is not valid JSON (" + String(error.message) + ")");
      continue;
    }
    if (isPlainObject(theme) === false) {
      failures.push(entry.id + ": " + src + " is not a JSON object");
      continue;
    }
    if (theme.defs !== undefined || theme.theme !== undefined) {
      failures.push(entry.id + ": " + src + " carries V1 keys (defs/theme); a V2 theme is base plus light/dark");
      continue;
    }
    if (isPlainObject(theme.base) === false) {
      failures.push(entry.id + ": " + src + " has no base object");
      continue;
    }
    const modes = ["dark", "light"].filter((mode) => isPlainObject(theme[mode]));
    if (modes.length === 0) {
      failures.push(entry.id + ": " + src + " defines no dark or light mode palette");
      continue;
    }
    const missingHue = modes.find((mode) => isPlainObject(theme[mode].hue) === false);
    if (missingHue !== undefined) {
      failures.push(entry.id + ": " + src + " mode " + missingHue + " carries no hue palette");
      continue;
    }
    const keyDefects = [];
    collectThemeKeyPaths(theme, "$", keyDefects);
    if (keyDefects.length > 0) failures.push(entry.id + ": " + src + " carries image or model keys: " + keyDefects.join(", "));
  }
  if (failures.length > 0) return { status: "FAIL", detail: failures.join("; ") };
  return {
    status: "PASS",
    detail: themes.length + " theme row(s) ship a V2-native JSON (base plus mode hue palette) installed by a real file copy; zero image keys, zero model keys"
  };
};

/**
 * P4 restore of live resolution (owner ruling §2). The command coordinate and
 * the source coordinate are separate claims: a command naming `origin` does not
 * satisfy `source`, so when the command does not name the source, the source is
 * resolved on its own. A dated skills-registry proof is still required as the
 * record of the command, but it never substitutes for the live check.
 */
const skillCommandShape = (entry) => {
  const match = typeof entry.install_cmd === "string" ? entry.install_cmd.match(SKILL_CMD) : null;
  if (match === null) {
    return {
      failure: entry.id + ": install_cmd does not match the npx skills add <owner>/<repo> --skill <name> -a opencode shape",
      repos: []
    };
  }
  if (match[2] !== entry.id) {
    return {
      failure: entry.id + ": install_cmd installs skill " + JSON.stringify(match[2]) + " but the row id is " + JSON.stringify(entry.id),
      repos: []
    };
  }
  const commandRepo = match[1];
  const source = typeof entry.source === "string" && entry.source !== "" ? entry.source : null;
  const origin = typeof entry.origin === "string" && entry.origin !== "" ? entry.origin : null;
  if (source === null) {
    return {
      failure: entry.id + ": row carries no source coordinate; an install command naming " + JSON.stringify(commandRepo) + " cannot prove one",
      repos: []
    };
  }
  if (commandRepo !== source && commandRepo !== origin) {
    return {
      failure:
        entry.id +
        ": install_cmd names " +
        JSON.stringify(commandRepo) +
        " but the row's source/origin is " +
        JSON.stringify(source) +
        "/" +
        JSON.stringify(origin),
      repos: []
    };
  }
  const repos = [commandRepo];
  if (commandRepo !== source) repos.push(source);
  return { failure: null, commandRepo, source, origin, repos };
};

export const checkSkillsUpstream = (components) => {
  const skills = components.filter((entry) => entry.kind === "skill" && entry.class === "installable");
  if (skills.length === 0) return { status: "PASS", detail: "0 installable skill rows; nothing to resolve" };
  const failures = [];
  const repos = new Map();
  const commandRepos = new Set();
  const sourceOnly = new Set();
  for (const entry of skills) {
    const shape = skillCommandShape(entry);
    if (shape.failure !== null) {
      failures.push(shape.failure);
      continue;
    }
    const registry = entry.evidence !== null && typeof entry.evidence === "object" ? entry.evidence.command_registry : null;
    if (
      registry === null ||
      registry === undefined ||
      registry.registry !== "skills-registry" ||
      registry.command !== entry.install_cmd ||
      typeof registry.checked_at !== "string" ||
      ISO_DATE_RE.test(registry.checked_at) === false
    ) {
      failures.push(entry.id + ": evidence.command_registry does not carry this exact command under skills-registry with a dated proof");
      continue;
    }
    commandRepos.add(shape.commandRepo);
    if (shape.commandRepo !== shape.source) sourceOnly.add(shape.source);
    for (const repo of shape.repos) {
      if (repos.has(repo) === false) repos.set(repo, []);
      repos.get(repo).push(entry.id);
    }
  }
  if (failures.length > 0) {
    return { status: "FAIL", detail: failures.slice(0, 12).join("; ") + (failures.length > 12 ? "; ... and " + (failures.length - 12) + " more" : "") };
  }
  const auth = runCapture("gh", ["auth", "status"]);
  if (auth.ok === false) {
    const reason = offlineReason(auth) ?? "gh is not authenticated";
    return {
      status: "SKIPPED",
      detail:
        skills.length +
        " install_cmd shapes hold; " +
        repos.size +
        " coordinate(s) were not resolved live (" +
        reason +
        "). A dated proof alone never passes this check."
    };
  }
  const resolved = [];
  const redirects = [];
  const skipped = [];
  for (const repo of [...repos.keys()].sort()) {
    const result = runCapture("gh", ["repo", "view", repo, "--json", "nameWithOwner"]);
    if (result.ok) {
      let remote = "";
      try {
        remote = JSON.parse(result.stdout).nameWithOwner;
      } catch (error) {
        failures.push(repo + ": gh output is not JSON (" + String(error.message) + ")");
        continue;
      }
      if (typeof remote !== "string" || remote === "") {
        failures.push(repo + ": gh returned no nameWithOwner");
        continue;
      }
      if (remote.toLowerCase() === repo.toLowerCase()) resolved.push(repo);
      else {
        // GitHub answers a renamed repository with a redirect. The coordinate
        // is real (gh only succeeds for an existing repository), but the name
        // moved, so the redirect is reported rather than flattened into a pass.
        resolved.push(repo);
        redirects.push(repo + " -> " + remote);
      }
      continue;
    }
    const reason = offlineReason(result);
    if (reason === null) failures.push(repo + ": gh repo view failed: " + (result.stderr + " " + result.stdout).trim().slice(0, 160));
    else skipped.push(repo + " (" + reason + ")");
  }
  if (failures.length > 0) {
    return { status: "FAIL", detail: failures.slice(0, 12).join("; ") + (failures.length > 12 ? "; ... and " + (failures.length - 12) + " more" : "") };
  }
  if (skipped.length > 0) {
    return {
      status: "SKIPPED",
      detail:
        skills.length +
        " install_cmd shapes hold; gh resolution skipped offline for " +
        skipped.length +
        " coordinate(s) (" +
        resolved.length +
        " resolved): " +
        skipped.join("; ")
    };
  }
  return {
    status: "PASS",
    detail:
      skills.length +
      " installable skill commands name a source or origin coordinate and " +
      resolved.length +
      " coordinate(s) resolve live with gh (" +
      commandRepos.size +
      " command coordinates plus " +
      sourceOnly.size +
      " source coordinates no command names; " +
      redirects.length +
      " answered by a GitHub redirect" +
      (redirects.length === 0 ? "" : ": " + redirects.join(", ")) +
      "); every row carries a dated skills-registry proof, and the live resolution alone decides"
  };
};

const checkMcpNpm = (selected, index) => {
  const rows = [];
  for (const token of selected) {
    const entry = index.get(token);
    if (entry === undefined || entry.kind !== "mcp" || entry.version_pin === null || entry.version_pin === undefined) continue;
    rows.push(entry);
  }
  if (rows.length === 0) return { status: "PASS", detail: "0 selected version-pinned npm MCPs; nothing to resolve" };
  const failures = [];
  const skipped = [];
  let passed = 0;
  for (const entry of rows) {
    const match = typeof entry.install_cmd === "string" ? entry.install_cmd.match(NPM_CMD) : null;
    if (match === null) {
      failures.push(entry.id + ": install_cmd is not an npx -y <pkg> command");
      continue;
    }
    const pkg = match[1];
    const versioned = runCapture("npm", ["view", pkg + "@" + entry.version_pin, "version", "--ignore-scripts"]);
    if (versioned.ok === false) {
      const reason = offlineReason(versioned);
      if (reason === null) failures.push(entry.id + ": npm has no " + pkg + "@" + entry.version_pin);
      else skipped.push(entry.id + " (" + reason + ")");
      continue;
    }
    if (versioned.stdout.trim() !== entry.version_pin) {
      failures.push(entry.id + ": registry reports " + versioned.stdout.trim() + ", catalog pins " + entry.version_pin);
      continue;
    }
    const bin = runCapture("npm", ["view", pkg + "@" + entry.version_pin, "bin", "--json", "--ignore-scripts"]);
    if (bin.ok === false) {
      const reason = offlineReason(bin);
      if (reason === null) failures.push(entry.id + ": npm reports no bin entry for " + pkg);
      else skipped.push(entry.id + " (" + reason + ")");
      continue;
    }
    let parsed = null;
    try {
      parsed = JSON.parse(bin.stdout);
    } catch (error) {
      failures.push(entry.id + ": npm bin output is not JSON");
      continue;
    }
    const hasBin = typeof parsed === "string" ? parsed.length > 0 : isPlainObject(parsed) && Object.keys(parsed).length > 0;
    if (hasBin) passed++;
    else failures.push(entry.id + ": npm reports an empty bin entry for " + pkg);
  }
  if (failures.length > 0) return { status: "FAIL", detail: failures.join("; ") };
  if (skipped.length > 0) {
    return { status: "SKIPPED", detail: "npm resolution skipped offline for " + skipped.length + " package(s) (" + passed + " proven): " + skipped.join("; ") };
  }
  return { status: "PASS", detail: passed + " version-pinned npm MCPs match the registry and expose a bin entry" };
};

const provePrompt = (id, shipped, src) => {
  for (const marker of ["[INSTALLED]", "[VERIFIED]", "[OPEN ITEMS]", "vantrilex-prime", "vantrilex-vanguard"]) {
    if (shipped.includes(marker) === false) return src + " carries no " + marker + " marker";
  }
  if (/^\s*model\s*:/m.test(shipped)) return src + " pins a model; prompts carry no model pins";
  if (/TODO|FIXME/.test(shipped)) return src + " carries a TODO or FIXME placeholder";
  return null;
};

const proveDataset = (id, shipped, src) => {
  let records = null;
  try {
    records = JSON.parse(shipped);
  } catch (error) {
    return src + " is not valid JSON (" + String(error.message) + ")";
  }
  if (Array.isArray(records) === false) return src + " is not a JSON array";
  if (records.length !== 45) return src + " carries " + records.length + " records, expected the 45 Stream-G probe checks";
  const seen = new Set();
  for (let i = 0; i < records.length; i++) {
    const entry = records[i];
    for (const field of ["id", "category", "description", "assertion"]) {
      if (isPlainObject(entry) === false || typeof entry[field] !== "string" || entry[field] === "") {
        return src + "[" + i + "] carries no non-empty " + JSON.stringify(field);
      }
    }
    if (seen.has(entry.id)) return src + " repeats id " + JSON.stringify(entry.id);
    seen.add(entry.id);
  }
  return null;
};

const proveTemplate = (id, shipped, src) => {
  let manifest = null;
  try {
    manifest = JSON.parse(shipped);
  } catch (error) {
    return src + " is not valid JSON (" + String(error.message) + ")";
  }
  if (isPlainObject(manifest) === false) return src + " is not a JSON object";
  if (Array.isArray(manifest.files) === false || manifest.files.length !== 28) {
    return src + " lists " + (Array.isArray(manifest.files) ? manifest.files.length : "no") + " files, expected the fixed 28";
  }
  if (Array.isArray(manifest.folders) === false || manifest.folders.length !== 8) {
    return src + " lists " + (Array.isArray(manifest.folders) ? manifest.folders.length : "no") + " folders, expected 8";
  }
  const reserved = manifest.files.find((file) => isPlainObject(file) && file.number === 18);
  if (reserved === undefined || typeof reserved.note !== "string" || /reserved/i.test(reserved.note) === false) {
    return src + " file 18 carries no reserved-for-Doctrine marker";
  }
  if (shipped.includes("{{")) return src + " carries an unsubstituted {{...}} template variable";
  if (/<[^<>\n]*>/.test(shipped)) return src + " carries an unsubstituted <...> template variable";
  return null;
};

const provePolicy = (id, shipped, src) => {
  let pack = null;
  try {
    pack = JSON.parse(shipped);
  } catch (error) {
    return src + " is not valid JSON (" + String(error.message) + ")";
  }
  if (isPlainObject(pack) === false || Array.isArray(pack.permissions) === false) return src + " carries no permissions array";
  if (pack.permissions.length === 0) return src + " carries an empty permissions array";
  for (let i = 0; i < pack.permissions.length; i++) {
    const rule = pack.permissions[i];
    if (isPlainObject(rule) === false || rule.effect !== "allow") {
      return src + " rule " + i + " carries effect " + JSON.stringify(isPlainObject(rule) ? rule.effect : rule) + "; the allow-all pack never becomes deny or ask by stealth";
    }
  }
  return null;
};

const proveBenchmark = (id, shipped, src) => {
  let spec = null;
  try {
    spec = JSON.parse(shipped);
  } catch (error) {
    return src + " is not valid JSON (" + String(error.message) + ")";
  }
  if (isPlainObject(spec) === false || Array.isArray(spec.checks) === false) return src + " carries no checks array";
  if (spec.checks.length !== 1) return src + " carries " + spec.checks.length + " checks; the Goodhart guard keeps this benchmark at exactly one";
  if (typeof spec.goodhart_guard !== "string" || spec.goodhart_guard === "") return src + " carries no Goodhart guard note";
  if (typeof spec.output_note !== "string" || spec.output_note.includes("~") === false || /never a target metric/.test(spec.output_note) === false) {
    return src + " output_note does not state that outputs are illustrative (~) and never a target metric";
  }
  return null;
};

const proveWorkflow = (id, shipped, src) => {
  for (const field of ["id", "concern", "owner", "inputs", "acceptance", "verification", "artifact", "wave", "depends_on"]) {
    if (shipped.includes(field) === false) return src + " carries no node field " + JSON.stringify(field);
  }
  for (const section of ["Methodology", "Roles", "Precautions", "Repair states", "Research", "Expanded thinking", "Kit loadout"]) {
    if (shipped.includes(section) === false) return src + " carries no Forge section " + JSON.stringify(section);
  }
  if (shipped.includes("no native YAML workflow runner") === false) return src + " states no BLAZAR consumption contract: OpenCode V2 has no native YAML workflow runner";
  if (shipped.includes("subagent") === false) return src + " names no subagent-dispatch execution path";
  if (/^\s*model\s*:/m.test(shipped)) return src + " pins a model; workflows carry no model pins";
  return null;
};

const designSlug = (brand) =>
  brand
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const FILE_LAYOUT = {
  benchmark: { dir: "benchmarks", ext: "json" },
  dataset: { dir: "datasets", ext: "json" },
  policy: { dir: "policies", ext: "json" },
  prompt: { dir: "prompts", ext: "md" },
  template: { dir: "templates", ext: "json" },
  workflow: { dir: "workflows", ext: "yaml" }
};

const fileLayout = (kind) => FILE_LAYOUT[kind];

const checkFileCopyShape = (components, selectedSet, family) => {  const failures = [];
  let proven = 0;
  const dataMissingProof = (entry, expectedSrc, shippedPathExists, shippedText, checkKindInvariant) => {
    if (shippedPathExists === false) return "shipped file " + expectedSrc + " does not exist";
    if (shippedText === null) return expectedSrc + " is unreadable";
    if (checkKindInvariant) {
      const defect = PROVERS[entry.kind](entry.id, shippedText, expectedSrc);
      if (defect !== null) return defect;
    }
    const proof = entry.evidence !== null && typeof entry.evidence === "object" ? entry.evidence.source_proof : null;
    if (proof === null || proof === undefined || proof.target !== expectedSrc || proof.method !== "file-resolves") {
      return "data row carries no file-resolves source_proof for " + expectedSrc;
    }
    return null;
  };

  for (const kind of family) {
    for (const entry of components.filter((candidate) => candidate.kind === kind)) {
      const reason = phaseReason(entry) ?? tierReason(entry) ?? verificationReason(entry);
      if (reason !== null) failures.push(reason);
      const files = fileLayout(entry.kind);
      const expectedSrc = "registry/" + files.dir + "/" + entry.id + "." + files.ext;
      if (entry.install_cmd === null || entry.install_cmd === undefined) {
        // V4-3/R3: a data row is command-free; its proof is the shipped file.
        if (entry.class !== "data") {
          failures.push(entry.id + ": " + entry.kind + " row carries no install command");
          continue;
        }
        const filePath = path.join(ROOT, expectedSrc);
        const present = fs.existsSync(filePath);
        let shipped = null;
        if (present) {
          try {
            shipped = fs.readFileSync(filePath, "utf8");
          } catch (error) {
            failures.push(entry.id + ": " + expectedSrc + " is unreadable (" + String(error.message) + ")");
            continue;
          }
        }
        const defect = dataMissingProof(
          entry,
          expectedSrc,
          present,
          shipped,
          selectedSet.has(componentToken(entry.kind, entry.id))
        );
        if (defect !== null) failures.push(entry.id + ": " + defect);
        else proven++;
        continue;
      }
      const text = entry.install_cmd.trim();
      if (FILE_COPY_PIPE_FORBIDDEN.test(text)) {
        failures.push(entry.id + ": install_cmd chains shell operators (" + JSON.stringify(entry.install_cmd) + "); use a plain file copy");
        continue;
      }
      const match = text.match(/^cp (\S+) (\S+)$/);
      if (match === null) {
        failures.push(entry.id + ": install_cmd is not a `cp <src> <dest>` file copy (" + JSON.stringify(entry.install_cmd) + ")");
        continue;
      }
      if (match[1] !== expectedSrc) {
        failures.push(entry.id + ": install_cmd copies " + JSON.stringify(match[1]) + " but the component ships at " + expectedSrc);
        continue;
      }
      const filePath = path.join(ROOT, expectedSrc);
      if (fs.existsSync(filePath) === false) {
        failures.push(entry.id + ": shipped file " + expectedSrc + " does not exist");
        continue;
      }
      let shipped = null;
      try {
        shipped = fs.readFileSync(filePath, "utf8");
      } catch (error) {
        failures.push(entry.id + ": " + expectedSrc + " is unreadable (" + String(error.message) + ")");
        continue;
      }
      const defect = PROVERS[entry.kind](entry.id, shipped, expectedSrc);
      if (defect !== null) failures.push(entry.id + ": " + defect);
      else proven++;
    }
  }

  for (const entry of components.filter((candidate) => candidate.kind === "design.md")) {
    const reason = phaseReason(entry) ?? tierReason(entry) ?? verificationReason(entry);
    if (reason !== null) failures.push(reason);
    if (entry.install_cmd === null || entry.install_cmd === undefined) {
      const proof = entry.evidence !== null && typeof entry.evidence === "object" ? entry.evidence.source_proof : null;
      const target = proof === null || proof === undefined ? null : proof.target;
      const expected = typeof target === "string" && target.startsWith("registry/design/") && target.endsWith("/DESIGN.md") ? target : null;
      if (entry.class !== "data" || expected === null || proof.method !== "file-resolves") {
        failures.push(entry.id + ": design.md row carries no file-resolves data source_proof");
        continue;
      }
      const filePath = path.join(ROOT, expected);
      if (fs.existsSync(filePath) === false) {
        failures.push(entry.id + ": shipped file " + expected + " does not exist");
        continue;
      }
      const shipped = fs.readFileSync(filePath, "utf8");
      if (/^\s*model\s*:/m.test(shipped)) {
        failures.push(entry.id + ": " + expected + " pins a model; design documents carry no model pins");
        continue;
      }
      if (/TODO|FIXME/.test(shipped)) {
        failures.push(entry.id + ": " + expected + " carries a TODO or FIXME placeholder");
        continue;
      }
      proven++;
      continue;
    }
    const text = entry.install_cmd.trim();
    if (FILE_COPY_PIPE_FORBIDDEN.test(text)) {
      failures.push(entry.id + ": install_cmd chains shell operators (" + JSON.stringify(entry.install_cmd) + "); use a plain file copy");
      continue;
    }
    const match = text.match(DESIGN_COPY_RE);
    if (match === null) {
      failures.push(entry.id + ": install_cmd is not a `cp registry/design/<brand>/DESIGN.md <dest>` file copy (" + JSON.stringify(entry.install_cmd) + ")");
      continue;
    }
    const brand = match[1];
    if (designSlug(brand) !== entry.id) {
      failures.push(entry.id + ": install_cmd names brand " + JSON.stringify(brand) + " but the slugified brand does not equal the entry id");
      continue;
    }
    const expectedSrc = "registry/design/" + brand + "/DESIGN.md";
    const filePath = path.join(ROOT, expectedSrc);
    if (fs.existsSync(filePath) === false) {
      failures.push(entry.id + ": shipped file " + expectedSrc + " does not exist");
      continue;
    }
    const shipped = fs.readFileSync(filePath, "utf8");
    if (/^\s*model\s*:/m.test(shipped)) {
      failures.push(entry.id + ": " + expectedSrc + " pins a model; design documents carry no model pins");
      continue;
    }
    if (/TODO|FIXME/.test(shipped)) {
      failures.push(entry.id + ": " + expectedSrc + " carries a TODO or FIXME placeholder");
      continue;
    }
    let companions = 0;
    for (const companion of ["registry/design/LICENSE.voltagent-MIT", "registry/design/ATTRIBUTION.md"]) {
      if (fs.existsSync(path.join(ROOT, companion)) === false) {
        failures.push(entry.id + ": MIT companion " + companion + " does not exist; the license travels with the content");
      } else {
        companions++;
      }
    }
    if (companions === 2) proven++;
  }

  if (failures.length > 0) return { status: "FAIL", detail: failures.join("; ") };
  return {
    status: "PASS",
    detail: proven + " shipped " + family.concat("design.md").join("/") + " file(s) install by a plain file copy, land at registry/<kind>/<id>.<ext>, and pass their kind invariant"
  };
};

const checkAgentHygiene = (selected, index) => {
  const primaries = new Set(["vantrilex"]);
  const reservedSubordinateColors = new Set(["aether", "blazar", "pulsar"]);
  const failures = [];
  let local = 0;
  let primaryFiles = 0;
  let reservedSubordinateFiles = 0;

  // Sole-primary ruling 2026-10-24: no local agent file may pin a model,
  // whether it is selected or not. Scan the whole agent directory.
  let localAgentFiles = [];
  try {
    localAgentFiles = fs.readdirSync(AGENTS_DIR).filter((name) => name.endsWith(".md"));
  } catch (error) {
    failures.push("cannot read .opencode/agents: " + String(error.message));
  }
  for (const file of localAgentFiles) {
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
    if (frontmatterValue(lines, "model") !== null) {
      failures.push(file + ": frontmatter pins a model; agents carry no model pins");
    }
  }

  for (const token of selected) {
    const entry = index.get(token);
    if (entry === undefined || entry.kind !== "agent") continue;
    if (entry.install_cmd !== null && entry.install_cmd !== undefined) {
      failures.push(entry.id + ": agent rows carry null install_cmd; fabricated spawn commands are refused");
      continue;
    }
    if (entry.verification !== "verified") {
      failures.push(entry.id + ": agent row is not verified");
      continue;
    }
    const isLocal = entry.source === null || entry.source === undefined || entry.source === SELF_SOURCE;
    if (isLocal === false) continue;
    let text = null;
    try {
      text = fs.readFileSync(path.join(AGENTS_DIR, entry.id + ".md"), "utf8");
    } catch (error) {
      failures.push(entry.id + ": selected agent has no .opencode/agents/" + entry.id + ".md");
      continue;
    }
    const lines = frontmatterLines(text);
    if (lines === null) {
      failures.push(entry.id + ": no frontmatter fence");
      continue;
    }
    const mode = frontmatterValue(lines, "mode");
    const color = frontmatterValue(lines, "color");
    if (primaries.has(entry.id)) {
      if (mode !== "primary") {
        failures.push(entry.id + ": sole primary mode " + JSON.stringify(mode) + " is not primary per owner ruling 2026-10-24");
        continue;
      }
      // Zenith's theme/color remains open; a missing color is valid in 0.9.0.
      primaryFiles++;
    } else {
      if (mode !== "subagent") {
        failures.push(entry.id + ": mode " + JSON.stringify(mode) + " is not subagent under the sole-primary ruling 2026-10-24");
        continue;
      }
      if (color !== null && reservedSubordinateColors.has(entry.id) === false) {
        failures.push(entry.id + ": frontmatter carries a color field");
        continue;
      }
      if (color !== null && reservedSubordinateColors.has(entry.id)) reservedSubordinateFiles++;
    }
    local++;
  }
  for (const kind of ["hook", "plugin"]) {
    for (const token of selected) {
      const entry = index.get(token);
      if (entry === undefined || entry.kind !== kind) continue;
      if (entry.install_cmd !== null && entry.install_cmd !== undefined) failures.push(entry.id + ": " + kind + " rows carry null install_cmd");
      else if (entry.verification !== "verified") failures.push(entry.id + ": null-command " + kind + " row is not verified");
    }
  }
  if (failures.length > 0) return { status: "FAIL", detail: failures.join("; ") };
  return {
    status: "PASS",
    detail: local + " selected local agents resolve (" + primaryFiles + " sole primary vantrilex; " + reservedSubordinateFiles + " reserved subordinate seats retain color; the rest mode subagent with no color); " + localAgentFiles.length + " local agent files carry no model pin; selected agent, hook and plugin rows carry null install_cmd and are verified"
  };
};

const checkTopLevelSkills = (selectedSet) => {
  const missing = TOP_LEVEL_SKILLS.filter((token) => selectedSet.has(token) === false);
  if (missing.length > 0) {
    return { status: "FAIL", detail: "the selection record omits the top-level skills: " + missing.join(", ") };
  }
  return {
    status: "PASS",
    detail: "the selection record carries all three top-level skills: " + TOP_LEVEL_SKILLS.join(", ")
  };
};

const startOfDayMs = (value) =>
  value instanceof Date
    ? Date.parse(value.toISOString().slice(0, 10) + "T00:00:00Z")
    : Date.parse(String(value) + "T00:00:00Z");

/**
 * R7 TTL: a proof is a dated observation. Returns null while the proof is
 * inside its window, and an `evidence-lapsed` reason once it is past it. A
 * malformed date is a reason too, so an unreadable timestamp cannot pass.
 */
export const evidenceTtlReason = (leg, checkedAt, today = new Date()) => {
  const window = EVIDENCE_TTL_DAYS[leg];
  if (window === undefined) return "unknown evidence leg " + JSON.stringify(leg);
  if (typeof checkedAt !== "string" || ISO_DATE_RE.test(checkedAt) === false || Number.isNaN(startOfDayMs(checkedAt))) {
    return "evidence-lapsed: " + leg + " carries checked_at " + JSON.stringify(checkedAt) + ", which is not an ISO date, so its window cannot be evaluated";
  }
  const age = Math.floor((startOfDayMs(today) - startOfDayMs(checkedAt)) / 86400000);
  if (age > window) {
    return "evidence-lapsed: " + leg + " checked_at " + checkedAt + " is " + age + " days old, past the " + window + "-day window";
  }
  return null;
};

export const checkEvidenceTtl = (components, today = new Date()) => {
  const legs = Object.keys(EVIDENCE_TTL_DAYS);
  const counts = {};
  const oldest = {};
  for (const leg of legs) {
    counts[leg] = 0;
    oldest[leg] = 0;
  }
  const failures = [];
  for (const entry of components) {
    const evidence = entry.evidence !== null && typeof entry.evidence === "object" ? entry.evidence : null;
    if (evidence === null) continue;
    for (const leg of legs) {
      const proof = evidence[leg];
      if (proof === null || proof === undefined || typeof proof !== "object") continue;
      counts[leg] += 1;
      const reason = evidenceTtlReason(leg, proof.checked_at, today);
      if (reason !== null) {
        failures.push(entry.kind + "/" + entry.id + ": " + reason);
        continue;
      }
      const age = Math.floor((startOfDayMs(today) - startOfDayMs(proof.checked_at)) / 86400000);
      oldest[leg] = Math.max(oldest[leg], age);
    }
  }
  if (failures.length > 0) {
    return {
      status: "FAIL",
      detail:
        failures.length +
        " proof(s) lapsed and must become candidates at the next audit: " +
        samples(failures, (failure) => failure) +
        (failures.length > 8 ? " ...(" + (failures.length - 8) + " more)" : "")
    };
  }
  return {
    status: "PASS",
    detail:
      components.length +
      " records: " +
      legs
        .map((leg) => counts[leg] + " " + leg + " within " + EVIDENCE_TTL_DAYS[leg] + "d (oldest " + oldest[leg] + "d)")
        .join(", ") +
      "; 0 lapsed"
  };
};

/**
 * V4-3 candidate surface: every row in registry/candidates/<kind>.jsonl is
 * validated against $defs.candidate, the shape the schema publishes for a
 * record that failed even its class evidence. A candidate is never a live row;
 * validating it here keeps the rejected surface as honest as the live one.
 */
const checkCandidates = () => {
  let schema = null;
  try {
    schema = loadSchema();
  } catch (error) {
    return { status: "FAIL", detail: "cannot load registry/schema/catalog-v4.schema.json: " + String(error.message) };
  }
  const candidateDef = schema.$defs === undefined ? undefined : schema.$defs.candidate;
  if (candidateDef === undefined) {
    return { status: "FAIL", detail: "registry/schema/catalog-v4.schema.json carries no $defs.candidate" };
  }
  const candidateSchema = { ...candidateDef, $defs: schema.$defs };
  let files = [];
  try {
    files = fs.readdirSync(CANDIDATES_DIR).filter((file) => file.endsWith(".jsonl")).sort();
  } catch (error) {
    return { status: "FAIL", detail: "cannot read registry/candidates/: " + String(error.message) };
  }
  if (files.length === 0) {
    return { status: "FAIL", detail: "registry/candidates/ holds no .jsonl file, so the candidate surface evaluated nothing" };
  }
  const perKind = [];
  const failures = [];
  let rows = 0;
  let quiet = 0;
  for (const file of files) {
    let text = null;
    try {
      text = fs.readFileSync(path.join(CANDIDATES_DIR, file), "utf8");
    } catch (error) {
      failures.push(file + ": unreadable (" + String(error.message) + ")");
      continue;
    }
    let count = 0;
    for (const line of text.split(/\r?\n/)) {
      if (line.trim() === "") continue;
      let entry = null;
      try {
        entry = JSON.parse(line);
      } catch (error) {
        failures.push(file + ": unparseable line (" + String(error.message) + ")");
        continue;
      }
      count += 1;
      rows += 1;
      if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
        failures.push(file + ": row " + count + " is not an object");
        continue;
      }
      if (typeof entry.id !== "string" || entry.kind + ".jsonl" !== file) {
        failures.push(file + ": row " + JSON.stringify(entry.id ?? "<none>") + " carries kind " + JSON.stringify(entry.kind) + ", which does not match its file");
      }
      if (Array.isArray(entry.attempted) === false || entry.attempted.length === 0) quiet += 1;
      for (const problem of validateRecord(entry, candidateSchema)) failures.push(file + ": " + problem);
    }
    perKind.push(file.replace(/\.jsonl$/, "") + " " + count);
  }
  if (failures.length > 0) {
    return {
      status: "FAIL",
      detail: failures.slice(0, 12).join("; ") + (failures.length > 12 ? "; ... and " + (failures.length - 12) + " more" : "")
    };
  }
  return {
    status: "PASS",
    detail:
      rows +
      " candidate rows across " +
      files.length +
      " files (" +
      perKind.join(", ") +
      ") validate against $defs.candidate: id, kind, name, class, reason.code plus reason.detail and checked_at are present and well-formed; " +
      (rows - quiet) +
      " carry attempted probes and " +
      quiet +
      " carry none because nothing addressable was authored"
  };
};

const PROVERS = {
  benchmark: proveBenchmark,
  dataset: proveDataset,
  policy: provePolicy,
  prompt: provePrompt,
  template: proveTemplate,
  workflow: proveWorkflow
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

  // P1–P3 (v4): the class fixes the command contract, and any command must be
  // backed by the registry that proved it. A dated proof lives in the record;
  // TTL enforcement is P4.
  const installableWithoutCommand = components.filter(
    (entry) => entry.class === "installable" && (typeof entry.install_cmd !== "string" || entry.install_cmd === "")
  );
  record(
    "command-honesty/installable-requires-command",
    installableWithoutCommand.length === 0 ? "PASS" : "FAIL",
    installableWithoutCommand.length === 0
      ? components.filter((entry) => entry.class === "installable").length +
        " installable rows all carry an install command"
      : installableWithoutCommand.length +
        " installable rows carry no command: " +
        samples(installableWithoutCommand, (entry) => entry.kind + "/" + entry.id)
  );

  const commandWithoutRegistry = components.filter(
    (entry) =>
      typeof entry.install_cmd === "string" &&
      (entry.evidence === null ||
        typeof entry.evidence !== "object" ||
        entry.evidence.command_registry === undefined ||
        entry.evidence.command_registry.command !== entry.install_cmd)
  );
  record(
    "command-honesty/registry-matches-command",
    commandWithoutRegistry.length === 0 ? "PASS" : "FAIL",
    commandWithoutRegistry.length === 0
      ? components.filter((entry) => typeof entry.install_cmd === "string").length +
        " commands are backed by evidence.command_registry naming the same command"
      : commandWithoutRegistry.length +
        " commands carry no matching registry proof: " +
        samples(commandWithoutRegistry, (entry) => entry.kind + "/" + entry.id)
  );

  const offVocabulary = components.filter((entry) => VERIFICATIONS.has(entry.verification) === false);
  record(
    "command-honesty/verified-only",
    offVocabulary.length === 0 ? "PASS" : "FAIL",
    offVocabulary.length === 0
      ? components.length + " live rows are all verified; the v3 unverified state is retired"
      : offVocabulary.length +
        " rows carry a value outside the vocabulary: " +
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
      if (Array.isArray(selection.phases[phase]) === false) continue;
      for (const token of selection.phases[phase]) selectedTokens.push(token);
    }
  }

  // P4 (owner ruling §1): the suspension record is validated and reported, and
  // only its still-missing tokens are held out of the placement proofs.
  let suspension = null;
  if (selection !== null) {
    suspension = suspensionLedger(selection.suspended, selection.phases, index);
    const documents = [...new Set(selection.suspended.map((entry) => (entry !== null && typeof entry === "object" ? entry.document : null)).filter((value) => typeof value === "string"))];
    record(
      "selection/suspension",
      suspension.failures.length === 0 ? "PASS" : "FAIL",
      suspension.failures.length === 0
        ? suspension.active.length +
          " selected token(s) suspended with reason " +
          JSON.stringify(SUSPENSION_REASON) +
          " (document " +
          (documents.join(", ") || "(none)") +
          ") and reported, not missing: " +
          samples(suspension.active, (token) => token) +
          "; " +
          suspension.stale.length +
          " stale suspension(s) auto-restored (" +
          (suspension.stale.length === 0 ? "none" : "token is live again: " + samples(suspension.stale, (token) => token)) +
          ")"
        : suspension.failures.join("; ")
    );
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
  // in the generated mirror. A token held by an active suspension is not
  // missing: it is counted and reported, and the suspension record above is
  // what has to stay honest about it.
  if (selection === null) {
    record("loadability/registers", "FAIL", "cannot be evaluated: selection record unreadable (" + selectionProblem + ")");
  } else {
    const { byKind, problems } = loadSidecars();
    const suspendedSet = new Set(suspension === null ? [] : suspension.active);
    const unresolved = [];
    for (const token of selectedTokens) {
      if (suspendedSet.has(token)) continue;
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
    const placable = selectedTokens.length - suspendedSet.size;
    record(
      "loadability/registers",
      failures.length === 0 ? "PASS" : "FAIL",
      failures.length === 0
        ? placable +
          " of " +
          selectedTokens.length +
          " selected tokens resolve in catalog.json and in registry/data/<kind>.jsonl; " +
          suspendedSet.size +
          " suspended token(s) are held out with reason " +
          JSON.stringify(SUSPENSION_REASON) +
          " and are reported as suspended, not missing"
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
    const suspendedSet = new Set(suspension === null ? [] : suspension.active);
    const derived = derivePhaseSets(selection.phases, index, suspendedSet);
    const { sets, dropped } = derived;
    phaseSets = sets;
    const placed = ORCHESTRATED_PHASES.reduce((total, phase) => total + sets[phase].length, 0);
    const placeable = selectedTokens.length - derived.suspended;
    record(
      "phase-sets",
      dropped.length === 0 && placed === placeable ? "PASS" : "FAIL",
      dropped.length !== 0
        ? dropped.length + " selected token(s) cannot be placed from the catalog: " + dropped.join("; ")
        : placed === placeable
          ? placed +
            " of " +
            placeable +
            " placeable selected tokens place into " +
            ORCHESTRATED_PHASES.length +
            " orchestrated phases (" +
            ORCHESTRATED_PHASES.map((phase) => phase + " " + sets[phase].length).join(", ") +
            "); " +
            derived.suspended +
            " suspended token(s) never inject; on-demand never injects and is absent by design"
          : "derivation placed " + placed + " of " + placeable + " placeable selected tokens"
    );
  }

  // Per-kind shape proofs: the retired lock verifier's remaining checks, run
  // against catalog rows. Deterministic checks cover phase/tier honesty, real
  // installer shapes and shipped files; the upstream-resolution legs keep the
  // retired SKIPPED contract for network and gh authentication.
  const selectedSet = new Set(selectedTokens);
  recordResult("command-shape/cli", checkCliRows(components));
  recordResult("command-shape/lsp", checkLspRows(components));
  recordResult("command-shape/theme", checkThemeRows(components));
  recordResult(
    "file-copy/shape",
    checkFileCopyShape(components, selectedSet, ["benchmark", "dataset", "policy", "prompt", "template", "workflow"])
  );
  recordResult("command-shape/skills-upstream", checkSkillsUpstream(components));
  recordResult("candidates/schema", checkCandidates());
  recordResult("evidence/ttl", checkEvidenceTtl(components));
  if (selection === null) {
    for (const check of ["command-shape/mcp-npm", "agent-hygiene", "selection/top-level-skills"]) {
      record(check, "FAIL", "cannot be evaluated: selection record unreadable (" + selectionProblem + ")");
    }
  } else {
    recordResult("command-shape/mcp-npm", checkMcpNpm(selectedTokens, index));
    recordResult("agent-hygiene", checkAgentHygiene(selectedTokens, index));
    recordResult("selection/top-level-skills", checkTopLevelSkills(selectedSet));
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

  // Ledger 2: the v4 class split, so the evidence model is visible per catalog.
  const classCounts = {};
  for (const entry of components) classCounts[entry.class] = (classCounts[entry.class] || 0) + 1;
  console.log("");
  console.log(
    "class ledger (not a gate): " +
      Object.keys(classCounts)
        .sort()
        .map((key) => key + " " + classCounts[key])
        .join(" · ")
  );

  // Ledger 3: phase -> count -> ids.
  if (phaseSets !== null) {
    console.log("");
    console.log("phase ledger (catalogPhaseSets()):");
    for (const phase of ORCHESTRATED_PHASES) {
      console.log("  " + phase + " [" + phaseSets[phase].length + "]: " + (phaseSets[phase].join(", ") || "(empty)"));
    }
  }

  // Ledger 4: the suspension record, separated from the phase sets it holds out.
  if (suspension !== null) {
    const activeList = [...suspension.active].sort();
    console.log("");
    console.log(
      "suspension ledger: " +
        activeList.length +
        " active (" +
        (activeList.join(", ") || "none") +
        "); " +
        suspension.stale.length +
        " stale auto-restored (" +
        ([...suspension.stale].sort().join(", ") || "none") +
        ")"
    );
  }

  let passed = 0;
  let skipped = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "PASS") passed += 1;
    else if (row.status === "SKIPPED") skipped += 1;
    else failed += 1;
  }
  console.log("");
  if (failed === 0) {
    console.log("VERDICT: PASS - catalog proven (" + passed + " passed, " + skipped + " skipped, 0 failed).");
  } else {
    console.log("VERDICT: FAIL - catalog not proven (" + passed + " passed, " + skipped + " skipped, " + failed + " failed).");
  }
  process.exitCode = failed === 0 ? 0 : 1;
};

const isDirectRun = () =>
  process.argv[1] !== undefined && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectRun()) main();
