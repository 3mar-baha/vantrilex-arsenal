#!/usr/bin/env node
/**
 * Vantrilex kit verifier.
 *
 * Proves the pinned Tier-0 kit (kit/kit.lock) against its schema
 * (kit/kit.lock.schema.json), the machine-readable catalog mirror
 * (registry/catalog.json), and the live plugin surface
 * (.opencode/plugin/arsenal.ts).
 *
 * Runtime: Node 25, ESM, zero dependencies.
 * Exit 0 when the kit is proven, non-zero with an actionable report when not.
 * Network-dependent checks degrade to SKIPPED with a stated reason when the
 * network, the tool, or the credentials are unavailable. A check that cannot
 * be evaluated any other way is FAILED.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOCK_PATH = path.join(ROOT, "kit", "kit.lock");
const SCHEMA_PATH = path.join(ROOT, "kit", "kit.lock.schema.json");
const CATALOG_PATH = path.join(ROOT, "registry", "catalog.json");
const ARSENAL_PATH = path.join(ROOT, ".opencode", "plugin", "arsenal.ts");
const SKILLS_DIR = path.join(ROOT, ".opencode", "skills");
const AGENTS_DIR = path.join(ROOT, ".opencode", "agents");
const LSP_SIDECAR_PATH = path.join(ROOT, "registry", "data", "lsp.jsonl");

const EXPECTED_PENDING = [
  "vantrilex-architect",
  "vantrilex-code-reviewer",
  "vantrilex-ai-generated-code-security-auditor",
  "vantrilex-kit-maintainer",
  "vantrilex-red-team",
  "vantrilex-technical-writer",
  "vantrilex-vantrilex-guide",
  "vantrilex-vantrilex-implementer",
  "vantrilex-vantrilex-leader"
];
const EXPECTED_LOCKED_SKILLS = ["vantrilex-vanguard", "vantrilex-doctrine", "vantrilex-prime"];

const HOOK_FUNCTIONS = {
  "session-start": "sessionStart",
  "pre-compact": "preCompact",
  "persist-session-state-on-end": "sessionEnd",
  "long-running-process-guard": "longRunningProcessGuard",
  "typescript-check-after-editing-ts-tsx-files": "typescriptCheck",
  "auto-format-js-ts-files-with-prettier-after-edits": "prettierFormat",
  "task-dispatcher": "taskDispatcher"
};

const SKILL_CMD = /^npx skills add (\S+) --skill (\S+) -a opencode( -y)?$/;
const NPM_CMD = /^npx -y (\S+)$/;
const NETWORK_TIMEOUT_MS = 20000;

const LOCK_PHASES = ["scout", "docs", "plan", "build", "review", "operate", "on-demand"];
const LOCK_TIERS = ["core", "conditional", "extended"];
const CLI_VERIFICATIONS = ["verified", "unverified"];

// A cli entry must name a real, runnable installer. Anything else is refused
// here rather than trusted, because an agent downstream will execute the
// string verbatim.
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
// The vendor's own official installer. Anchored to a single known vendor
// command so a plausible-looking guess cannot pass as verified.
const CLI_VENDOR_INSTALLERS = [
  /^gh (\S+)$/,
  /^mise (?:install|use|exec) (\S+)$/,
  /^rustup-init\b.*$/,
  /^op install (\S+)$/,
  /^docker-plugin-install (\S+)$/
];
// A curl-piped installer is never acceptable: it executes unreviewed remote
// code as root-equivalent on the owner's machine.
const CLI_PIPE_FORBIDDEN = /\||\|\||&&|;|`|\$\(|\$\{/;
// A theme ships as a JSON file under registry/themes/ and installs by copying
// that file into a themes directory. Only that shape is accepted: a bare
// filename installs nothing, and a chained command runs code the reader did
// not review.
const THEME_COPY_RE = /^cp (registry\/themes\/[A-Za-z0-9._-]+\.json) (\S+)$/;
const THEME_PIPE_FORBIDDEN = /\||\|\||&&|;|`|\$\(|\$\{/;

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

const rows = [];

function record(check, status, detail) {
  rows.push({ check, status, detail });
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && Array.isArray(value) === false;
}

function checkType(value, name) {
  if (name === "null") return value === null;
  if (name === "array") return Array.isArray(value);
  if (name === "object") return isPlainObject(value);
  if (name === "string") return typeof value === "string";
  if (name === "integer") return typeof value === "number" && Number.isInteger(value);
  if (name === "number") return typeof value === "number";
  if (name === "boolean") return typeof value === "boolean";
  return false;
}

function validateAgainst(schema, value, atPath) {
  if (schema === null || typeof schema !== "object" || Array.isArray(schema)) return null;
  if (schema.type !== undefined) {
    const names = Array.isArray(schema.type) ? schema.type : [schema.type];
    let matched = false;
    for (const name of names) {
      if (checkType(value, name)) {
        matched = true;
        break;
      }
    }
    if (matched === false) return atPath + ": expected type " + names.join(" or ");
  }
  if (schema.const !== undefined && value !== schema.const) {
    return atPath + ": expected constant " + JSON.stringify(schema.const);
  }
  if (schema.enum !== undefined) {
    let found = false;
    for (const option of schema.enum) {
      if (value === option) {
        found = true;
        break;
      }
    }
    if (found === false) return atPath + ": value is not one of the allowed options";
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      return atPath + ": string is shorter than minLength " + schema.minLength;
    }
    if (schema.pattern !== undefined) {
      const re = new RegExp(schema.pattern);
      if (re.test(value) === false) {
        return atPath + ": string does not match pattern " + schema.pattern;
      }
    }
  }
  if (typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) {
    return atPath + ": number is below minimum " + schema.minimum;
  }
  if (isPlainObject(value)) {
    if (Array.isArray(schema.required)) {
      for (const key of schema.required) {
        if (Object.hasOwn(value, key) === false) {
          return atPath + ": missing required property " + JSON.stringify(key);
        }
      }
    }
    if (isPlainObject(schema.properties)) {
      for (const key of Object.keys(schema.properties)) {
        if (Object.hasOwn(value, key)) {
          const err = validateAgainst(schema.properties[key], value[key], atPath + "." + key);
          if (err !== null) return err;
        }
      }
    }
    if (schema.additionalProperties === false && isPlainObject(schema.properties)) {
      for (const key of Object.keys(value)) {
        if (Object.hasOwn(schema.properties, key) === false) {
          return atPath + ": unexpected property " + JSON.stringify(key);
        }
      }
    }
  }
  if (Array.isArray(value) && isPlainObject(schema.items)) {
    for (let i = 0; i < value.length; i++) {
      const err = validateAgainst(schema.items, value[i], atPath + "[" + i + "]");
      if (err !== null) return err;
    }
  }
  if (Array.isArray(schema.allOf)) {
    for (const part of schema.allOf) {
      if (isPlainObject(part) && part.if !== undefined) {
        const condErr = validateAgainst(part.if, value, atPath);
        if (condErr === null && part.then !== undefined) {
          const thenErr = validateAgainst(part.then, value, atPath);
          if (thenErr !== null) return thenErr;
        }
      } else {
        const err = validateAgainst(part, value, atPath);
        if (err !== null) return err;
      }
    }
  }
  return null;
}

function windowsSpawn(command, args) {
  const parts = [command].concat(args);
  for (const part of parts) {
    if (/[\s"]/.test(part)) {
      throw new Error("refusing to spawn a token carrying whitespace or quotes: " + part);
    }
  }
  return { command: "cmd.exe", args: ["/d", "/s", "/c", parts.join(" ")] };
}

function runCapture(command, args) {
  const spawn = process.platform === "win32" ? windowsSpawn(command, args) : { command, args };
  try {
    const out = execFileSync(spawn.command, spawn.args, {
      cwd: ROOT,
      timeout: NETWORK_TIMEOUT_MS,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    return { ok: true, stdout: typeof out === "string" ? out : String(out), stderr: "", code: "" };
  } catch (err) {
    const stderr = err && err.stderr ? String(err.stderr) : "";
    const stdout = err && err.stdout ? String(err.stdout) : "";
    const code = err && err.code !== undefined ? String(err.code) : "error";
    const message = err && err.message ? String(err.message) : "";
    return { ok: false, stdout, stderr, code, message };
  }
}

/**
 * Classify a cli install_cmd. Returns null when the command is a real
 * installer, otherwise a human-readable reason it is refused.
 */
function cliCommandReason(cmd) {
  if (typeof cmd !== "string" || cmd.trim() === "") {
    return "install_cmd is empty; a cli entry carries the command that installs the tool";
  }
  const text = cmd.trim();
  if (CLI_PIPE_FORBIDDEN.test(text) === true) {
    return "install_cmd chains shell operators or pipes remote code (" + JSON.stringify(cmd) + "); use a package-manager invocation or the vendor installer";
  }
  for (const pattern of CLI_PKG_MANAGERS) {
    const match = text.match(pattern);
    if (match !== null) {
      const target = match[1];
      if (target === undefined || /^[<>{}\[\]()|&;]$/.test(target)) {
        return "install_cmd names no package (" + JSON.stringify(cmd) + ")";
      }
      return null;
    }
  }
  for (const pattern of CLI_VENDOR_INSTALLERS) {
    if (pattern.test(text) === true) return null;
  }
  if (/\.sh\b|\.ps1\b|\.bat\b|\.cmd\b|\.py\b|\.rb\b/.test(text) === true) {
    return "install_cmd runs a script file (" + JSON.stringify(cmd) + "); use a package-manager invocation or the vendor installer";
  }
  return "install_cmd matches no package-manager invocation and no known vendor installer (" + JSON.stringify(cmd) + ")";
}

/**
 * Validate the shape of every locked cli entry. Zero entries is a legitimate
 * state: the kind is scaffolded and populated later, so it passes with the
 * count stated rather than as a silent vacuous pass.
 */
function checkCliEntries(components) {
  const clis = components.filter((c) => c.kind === "cli");
  if (clis.length === 0) {
    return { status: "PASS", detail: "0 cli entries locked; the kind is scaffolded and carries no entry yet" };
  }
  const failures = [];
  for (const entry of clis) {
    const id = entry.id;
    if (LOCK_PHASES.includes(entry.phase) === false) {
      failures.push(id + ": phase " + JSON.stringify(entry.phase) + " is outside the lock phase enum");
    }
    if (LOCK_TIERS.includes(entry.tier) === false) {
      failures.push(id + ": tier " + JSON.stringify(entry.tier) + " is outside the lock tier enum");
    }
    if (CLI_VERIFICATIONS.includes(entry.verification) === false) {
      failures.push(id + ": verification " + JSON.stringify(entry.verification) + " is not verified or unverified");
    }
    // Consistency with the schema's conditional rule: verified requires a
    // runnable command, and a null command is only honest as unverified.
    if (entry.verification === "verified" && (typeof entry.install_cmd !== "string" || entry.install_cmd === "")) {
      failures.push(id + ": verification is verified but install_cmd is null or empty");
    }
    if (entry.install_cmd === null || entry.install_cmd === undefined) {
      failures.push(id + ": install_cmd is null; a cli entry must carry a real installer command");
      continue;
    }
    const reason = cliCommandReason(entry.install_cmd);
    if (reason !== null) {
      failures.push(id + ": " + reason);
    }
  }
  if (failures.length > 0) {
    return { status: "FAIL", detail: failures.join("; ") };
  }
  const verified = clis.filter((c) => c.verification === "verified").length;
  return {
    status: "PASS",
    detail: clis.length + " cli entries carry a real installer command with valid phase, tier and verification (" + verified + " verified)"
  };
}

/**
 * Validate the shape of every locked lsp entry. Two honest states exist.
 * A provisioned entry installs through a package manager or a vendor
 * installer, never a chained shell or a piped remote script. A need-label
 * entry carries install_cmd null + verification unverified and points at
 * the project's own typecheck/lint commands through its sidecar
 * when_to_use, because OpenCode V2 accepts lsp configuration but runs no
 * language servers and produces no diagnostics. Anything else is refused
 * here rather than trusted, because an agent downstream will execute the
 * string verbatim.
 */
function checkLspEntries(components) {
  const lsps = components.filter((c) => c.kind === "lsp");
  if (lsps.length === 0) {
    return { status: "PASS", detail: "0 lsp entries locked; the kind is scaffolded and carries no entry yet" };
  }
  let sidecar = null;
  try {
    sidecar = new Map();
    const raw = fs.readFileSync(LSP_SIDECAR_PATH, "utf8");
    for (const line of raw.split("\n")) {
      if (line.trim() === "") continue;
      const record = JSON.parse(line);
      if (typeof record.id === "string") sidecar.set(record.id, record);
    }
  } catch (err) {
    sidecar = null;
  }
  const failures = [];
  let provisioned = 0;
  let needLabels = 0;
  for (const entry of lsps) {
    const id = entry.id;
    if (LOCK_PHASES.includes(entry.phase) === false) {
      failures.push(id + ": phase " + JSON.stringify(entry.phase) + " is outside the lock phase enum");
    }
    if (LOCK_TIERS.includes(entry.tier) === false) {
      failures.push(id + ": tier " + JSON.stringify(entry.tier) + " is outside the lock tier enum");
    }
    if (CLI_VERIFICATIONS.includes(entry.verification) === false) {
      failures.push(id + ": verification " + JSON.stringify(entry.verification) + " is not verified or unverified");
    }
    if (entry.verification === "verified" && (typeof entry.install_cmd !== "string" || entry.install_cmd === "")) {
      failures.push(id + ": verification is verified but install_cmd is null or empty");
    }
    if (entry.install_cmd === null || entry.install_cmd === undefined) {
      if (entry.verification !== "unverified") {
        failures.push(id + ": install_cmd is null but verification is not unverified; a null command is only honest as unverified");
        continue;
      }
      if (sidecar === null) {
        failures.push(id + ": need-label cannot be evaluated: registry/data/lsp.jsonl is unreadable");
        continue;
      }
      const side = sidecar.get(id);
      if (side === undefined) {
        failures.push(id + ": need-label has no matching record in registry/data/lsp.jsonl");
        continue;
      }
      if (typeof side.when_to_use !== "string" || side.when_to_use.trim() === "") {
        failures.push(id + ": need-label carries no when_to_use instruction pointing at the project's own typecheck/lint");
        continue;
      }
      needLabels++;
      continue;
    }
    const reason = cliCommandReason(entry.install_cmd);
    if (reason !== null) {
      failures.push(id + ": " + reason);
    } else {
      provisioned++;
    }
  }
  if (failures.length > 0) {
    return { status: "FAIL", detail: failures.join("; ") };
  }
  return {
    status: "PASS",
    detail: lsps.length + " lsp " + (lsps.length === 1 ? "entry valid" : "entries valid") + " with correct phase, tier and verification (" + provisioned + " provisioned with a real installer, " + needLabels + " " + (needLabels === 1 ? "need-label" : "need-labels") + " pointing at project typecheck/lint)"
  };
}

/**
 * Collect every object path in a theme JSON whose key names an image,
 * wallpaper or model. The V2 markdown token set legitimately carries
 * `markdown.image` and `markdown.imageText` as element colours, so those two
 * keys are not images and are excluded; any other image-shaped key, and any
 * `model` key, is a defect in a colour-only theme.
 */
function collectThemeKeyPaths(value, atPath, out) {
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
}

/**
 * Validate the shape of every locked theme entry. A theme is a V2-native
 * OpenCode CLI theme JSON (`base` plus a `light`/`dark` hue palette) shipped
 * under registry/themes/ and installed by copying that file into a themes
 * directory. Anything else is refused here rather than trusted, because the
 * JSON file is the whole component and a bare filename installs nothing.
 */
function checkThemeEntries(components) {
  const themes = components.filter((c) => c.kind === "theme");
  if (themes.length === 0) {
    return { status: "PASS", detail: "0 theme entries locked; the kind is scaffolded and carries no entry yet" };
  }
  const failures = [];
  for (const entry of themes) {
    const id = entry.id;
    if (LOCK_PHASES.includes(entry.phase) === false) {
      failures.push(id + ": phase " + JSON.stringify(entry.phase) + " is outside the lock phase enum");
    }
    if (LOCK_TIERS.includes(entry.tier) === false) {
      failures.push(id + ": tier " + JSON.stringify(entry.tier) + " is outside the lock tier enum");
    }
    if (CLI_VERIFICATIONS.includes(entry.verification) === false) {
      failures.push(id + ": verification " + JSON.stringify(entry.verification) + " is not verified or unverified");
    }
    if (entry.verification === "verified" && (typeof entry.install_cmd !== "string" || entry.install_cmd === "")) {
      failures.push(id + ": verification is verified but install_cmd is null or empty");
    }
    if (typeof entry.install_cmd !== "string" || entry.install_cmd.trim() === "") {
      failures.push(id + ": install_cmd is empty; a theme entry must carry the file-copy command that installs the JSON");
      continue;
    }
    const text = entry.install_cmd.trim();
    if (THEME_PIPE_FORBIDDEN.test(text) === true) {
      failures.push(id + ": install_cmd chains shell operators (" + JSON.stringify(entry.install_cmd) + "); use a plain file copy");
      continue;
    }
    const match = text.match(THEME_COPY_RE);
    if (match === null) {
      failures.push(id + ": install_cmd is not a `cp registry/themes/<id>.json <themes-dir>/<id>.json` file copy (" + JSON.stringify(entry.install_cmd) + ")");
      continue;
    }
    const src = match[1];
    const dest = match[2];
    const expectedSrc = "registry/themes/" + id + ".json";
    if (src !== expectedSrc) {
      failures.push(id + ": install_cmd copies " + JSON.stringify(src) + " but the theme ships at " + expectedSrc);
      continue;
    }
    if (dest.endsWith("/" + id + ".json") === false) {
      failures.push(id + ": install_cmd copies to " + JSON.stringify(dest) + " but the target filename must be " + id + ".json, which V2 turns into the theme name");
      continue;
    }
    const filePath = path.join(ROOT, src);
    if (fs.existsSync(filePath) === false) {
      failures.push(id + ": theme file " + src + " does not exist");
      continue;
    }
    let theme = null;
    try {
      theme = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      failures.push(id + ": " + src + " is not valid JSON (" + String(err) + ")");
      continue;
    }
    if (isPlainObject(theme) === false) {
      failures.push(id + ": " + src + " is not a JSON object");
      continue;
    }
    if (theme.defs !== undefined || theme.theme !== undefined) {
      failures.push(id + ": " + src + " carries V1 keys (defs/theme); a V2 theme is base plus light/dark");
      continue;
    }
    if (isPlainObject(theme.base) === false) {
      failures.push(id + ": " + src + " has no base object");
      continue;
    }
    const modes = ["dark", "light"].filter((mode) => isPlainObject(theme[mode]));
    if (modes.length === 0) {
      failures.push(id + ": " + src + " defines no dark or light mode palette");
      continue;
    }
    const missingHue = modes.find((mode) => isPlainObject(theme[mode].hue) === false);
    if (missingHue !== undefined) {
      failures.push(id + ": " + src + " mode " + missingHue + " carries no hue palette");
      continue;
    }
    const keyDefects = [];
    collectThemeKeyPaths(theme, "$", keyDefects);
    if (keyDefects.length > 0) {
      failures.push(id + ": " + src + " carries image or model keys: " + keyDefects.join(", "));
      continue;
    }
  }
  if (failures.length > 0) {
    return { status: "FAIL", detail: failures.join("; ") };
  }
  return {
    status: "PASS",
    detail: themes.length + " theme " + (themes.length === 1 ? "entry ships" : "entries ship") + " a V2-native JSON (base plus mode hue palette) installed by a real file copy; zero image keys, zero model keys"
  };
}

/**
 * Shared shape for the six file-copy kinds added after theme (prompt,
 * dataset, template, policy, benchmark, workflow). Each locked entry
 * installs by copying one shipped file to its destination: a plain
 * `cp <src> <dest>` with no shell operators, where <src> is exactly
 * registry/<dir>/<id>.<ext>. Anything else is refused here rather than
 * trusted, because an agent downstream will execute the string verbatim.
 * Kind-specific invariants run through `prove`, which receives the entry id
 * and the shipped file text and returns a failure string or null.
 */
const FILE_COPY_PIPE_FORBIDDEN = /\||\|\||&&|;|`|\$\(|\$\{/;

function checkFileCopyKind(components, { kind, dir, ext, prove }) {
  const entries = components.filter((c) => c.kind === kind);
  if (entries.length === 0) {
    return { status: "PASS", detail: "0 " + kind + " entries locked; the kind is scaffolded and carries no entry yet" };
  }
  const failures = [];
  for (const entry of entries) {
    const id = entry.id;
    if (LOCK_PHASES.includes(entry.phase) === false) {
      failures.push(id + ": phase " + JSON.stringify(entry.phase) + " is outside the lock phase enum");
    }
    if (LOCK_TIERS.includes(entry.tier) === false) {
      failures.push(id + ": tier " + JSON.stringify(entry.tier) + " is outside the lock tier enum");
    }
    if (CLI_VERIFICATIONS.includes(entry.verification) === false) {
      failures.push(id + ": verification " + JSON.stringify(entry.verification) + " is not verified or unverified");
    }
    if (entry.verification === "verified" && (typeof entry.install_cmd !== "string" || entry.install_cmd === "")) {
      failures.push(id + ": verification is verified but install_cmd is null or empty");
    }
    if (typeof entry.install_cmd !== "string" || entry.install_cmd.trim() === "") {
      failures.push(id + ": install_cmd is empty; a " + kind + " entry must carry the file-copy command that installs it");
      continue;
    }
    const text = entry.install_cmd.trim();
    if (FILE_COPY_PIPE_FORBIDDEN.test(text) === true) {
      failures.push(id + ": install_cmd chains shell operators (" + JSON.stringify(entry.install_cmd) + "); use a plain file copy");
      continue;
    }
    const match = text.match(/^cp (\S+) (\S+)$/);
    if (match === null) {
      failures.push(id + ": install_cmd is not a `cp <src> <dest>` file copy (" + JSON.stringify(entry.install_cmd) + ")");
      continue;
    }
    const expectedSrc = "registry/" + dir + "/" + id + "." + ext;
    if (match[1] !== expectedSrc) {
      failures.push(id + ": install_cmd copies " + JSON.stringify(match[1]) + " but the component ships at " + expectedSrc);
      continue;
    }
    const filePath = path.join(ROOT, expectedSrc);
    if (fs.existsSync(filePath) === false) {
      failures.push(id + ": shipped file " + expectedSrc + " does not exist");
      continue;
    }
    let shipped = null;
    try {
      shipped = fs.readFileSync(filePath, "utf8");
    } catch (err) {
      failures.push(id + ": " + expectedSrc + " is unreadable (" + String(err) + ")");
      continue;
    }
    const defect = prove(id, shipped, expectedSrc);
    if (defect !== null) {
      failures.push(id + ": " + defect);
    }
  }
  if (failures.length > 0) {
    return { status: "FAIL", detail: failures.join("; ") };
  }
  return {
    status: "PASS",
    detail: entries.length + " " + kind + " " + (entries.length === 1 ? "entry ships" : "entries ship") + " registry/" + dir + "/ file(s) installed by a real file copy with valid phase, tier and verification"
  };
}

function provePrompt(id, shipped, src) {
  for (const marker of ["[INSTALLED]", "[VERIFIED]", "[OPEN ITEMS]", "vantrilex-prime", "vantrilex-vanguard"]) {
    if (shipped.includes(marker) === false) return src + " carries no " + marker + " marker";
  }
  if (/^\s*model\s*:/m.test(shipped)) return src + " pins a model; prompts carry no model pins";
  if (/TODO|FIXME/.test(shipped)) return src + " carries a TODO or FIXME placeholder";
  return null;
}

function proveDataset(id, shipped, src) {
  let records = null;
  try {
    records = JSON.parse(shipped);
  } catch (err) {
    return src + " is not valid JSON (" + String(err) + ")";
  }
  if (Array.isArray(records) === false) return src + " is not a JSON array";
  if (records.length !== 45) return src + " carries " + records.length + " records, expected the 45 Stream-G probe checks";
  const seen = new Set();
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    for (const field of ["id", "category", "description", "assertion"]) {
      if (record === null || typeof record !== "object" || typeof record[field] !== "string" || record[field] === "") {
        return src + "[" + i + "] carries no non-empty " + JSON.stringify(field);
      }
    }
    if (seen.has(record.id)) return src + " repeats id " + JSON.stringify(record.id);
    seen.add(record.id);
  }
  return null;
}

function proveTemplate(id, shipped, src) {
  let manifest = null;
  try {
    manifest = JSON.parse(shipped);
  } catch (err) {
    return src + " is not valid JSON (" + String(err) + ")";
  }
  if (manifest === null || typeof manifest !== "object" || Array.isArray(manifest)) return src + " is not a JSON object";
  if (Array.isArray(manifest.files) === false || manifest.files.length !== 28) {
    return src + " lists " + (Array.isArray(manifest.files) ? manifest.files.length : "no") + " files, expected the fixed 28";
  }
  if (Array.isArray(manifest.folders) === false || manifest.folders.length !== 8) {
    return src + " lists " + (Array.isArray(manifest.folders) ? manifest.folders.length : "no") + " folders, expected 8";
  }
  const reserved = manifest.files.find((f) => f !== null && typeof f === "object" && f.number === 18);
  if (reserved === undefined || typeof reserved.note !== "string" || /reserved/i.test(reserved.note) === false) {
    return src + " file 18 carries no reserved-for-Doctrine marker";
  }
  if (shipped.includes("{{")) return src + " carries an unsubstituted {{...}} template variable";
  if (/<[^<>\n]*>/.test(shipped)) return src + " carries an unsubstituted <...> template variable";
  return null;
}

function provePolicy(id, shipped, src) {
  let pack = null;
  try {
    pack = JSON.parse(shipped);
  } catch (err) {
    return src + " is not valid JSON (" + String(err) + ")";
  }
  if (pack === null || typeof pack !== "object" || Array.isArray(pack.permissions) === false) {
    return src + " carries no permissions array";
  }
  if (pack.permissions.length === 0) return src + " carries an empty permissions array";
  for (let i = 0; i < pack.permissions.length; i++) {
    const rule = pack.permissions[i];
    if (rule === null || typeof rule !== "object" || rule.effect !== "allow") {
      return src + " rule " + i + " carries effect " + JSON.stringify(rule !== null && typeof rule === "object" ? rule.effect : rule) + "; the allow-all pack never becomes deny or ask by stealth";
    }
  }
  return null;
}

function proveBenchmark(id, shipped, src) {
  let spec = null;
  try {
    spec = JSON.parse(shipped);
  } catch (err) {
    return src + " is not valid JSON (" + String(err) + ")";
  }
  if (spec === null || typeof spec !== "object" || Array.isArray(spec.checks) === false) {
    return src + " carries no checks array";
  }
  if (spec.checks.length !== 1) return src + " carries " + spec.checks.length + " checks; the Goodhart guard keeps this benchmark at exactly one";
  if (typeof spec.goodhart_guard !== "string" || spec.goodhart_guard === "") {
    return src + " carries no Goodhart guard note";
  }
  if (typeof spec.output_note !== "string" || spec.output_note.includes("~") === false || /never a target metric/.test(spec.output_note) === false) {
    return src + " output_note does not state that outputs are illustrative (~) and never a target metric";
  }
  return null;
}

function proveWorkflow(id, shipped, src) {
  for (const field of ["id", "concern", "owner", "inputs", "acceptance", "verification", "artifact", "wave", "depends_on"]) {
    if (shipped.includes(field) === false) return src + " carries no BLAZAR node field " + JSON.stringify(field);
  }
  for (const section of ["Methodology", "Roles", "Precautions", "Repair states", "Research", "Expanded thinking", "Kit loadout"]) {
    if (shipped.includes(section) === false) return src + " carries no Forge section " + JSON.stringify(section);
  }
  if (shipped.includes("no native YAML workflow runner") === false) {
    return src + " states no BLAZAR consumption contract: OpenCode V2 has no native YAML workflow runner";
  }
  if (shipped.includes("subagent") === false) {
    return src + " names no subagent-dispatch execution path";
  }
  if (/^\s*model\s*:/m.test(shipped)) return src + " pins a model; workflows carry no model pins";
  return null;
}

/**
 * Validate the shape of every locked design.md entry. A design.md entry is an
 * unmodified MIT-licensed brand interface design document
 * (Copyright (c) 2026 VoltAgent) shipped under registry/design/<brand>/DESIGN.md
 * and installed by copying that file into the target project docs: a plain
 * `cp registry/design/<brand>/DESIGN.md <dest>` with no shell operators.
 * Dotted upstream slugs (linear.app, mistral.ai, opencode.ai, together.ai,
 * x.ai) are preserved exactly as directory names, so the entry id is the
 * slugified brand (dots become hyphens) and must satisfy designSlug(brand).
 * The shipped file must carry no model pin and no placeholder, because the
 * bundle rule ships third-party bytes unmodified and asserts no Vantrilex
 * authorship. Anything else is refused here rather than trusted, because an
 * agent downstream will execute the string verbatim.
 */
const DESIGN_COPY_RE = /^cp registry\/design\/([A-Za-z0-9._-]+)\/DESIGN\.md (\S+)$/;
const DESIGN_PIPE_FORBIDDEN = /\||\|\||&&|;|`|\$\(|\$\{/;

function designSlug(brand) {
  const folded = brand.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return folded.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function checkDesignEntries(components) {
  const entries = components.filter((c) => c.kind === "design.md");
  if (entries.length === 0) {
    return { status: "PASS", detail: "0 design.md entries locked; the kind is scaffolded and carries no entry yet" };
  }
  const failures = [];
  for (const entry of entries) {
    const id = entry.id;
    if (LOCK_PHASES.includes(entry.phase) === false) {
      failures.push(id + ": phase " + JSON.stringify(entry.phase) + " is outside the lock phase enum");
    }
    if (LOCK_TIERS.includes(entry.tier) === false) {
      failures.push(id + ": tier " + JSON.stringify(entry.tier) + " is outside the lock tier enum");
    }
    if (CLI_VERIFICATIONS.includes(entry.verification) === false) {
      failures.push(id + ": verification " + JSON.stringify(entry.verification) + " is not verified or unverified");
    }
    if (entry.verification === "verified" && (typeof entry.install_cmd !== "string" || entry.install_cmd === "")) {
      failures.push(id + ": verification is verified but install_cmd is null or empty");
    }
    if (typeof entry.install_cmd !== "string" || entry.install_cmd.trim() === "") {
      failures.push(id + ": install_cmd is empty; a design.md entry must carry the file-copy command that installs it");
      continue;
    }
    const text = entry.install_cmd.trim();
    if (DESIGN_PIPE_FORBIDDEN.test(text) === true) {
      failures.push(id + ": install_cmd chains shell operators (" + JSON.stringify(entry.install_cmd) + "); use a plain file copy");
      continue;
    }
    const match = text.match(DESIGN_COPY_RE);
    if (match === null) {
      failures.push(id + ": install_cmd is not a `cp registry/design/<brand>/DESIGN.md <dest>` file copy (" + JSON.stringify(entry.install_cmd) + ")");
      continue;
    }
    const brand = match[1];
    if (designSlug(brand) !== id) {
      failures.push(id + ": install_cmd names brand " + JSON.stringify(brand) + " but the slugified brand does not equal the entry id (dotted slugs become hyphens)");
      continue;
    }
    const expectedSrc = "registry/design/" + brand + "/DESIGN.md";
    const filePath = path.join(ROOT, expectedSrc);
    if (fs.existsSync(filePath) === false) {
      failures.push(id + ": shipped file " + expectedSrc + " does not exist");
      continue;
    }
    let shipped = null;
    try {
      shipped = fs.readFileSync(filePath, "utf8");
    } catch (err) {
      failures.push(id + ": " + expectedSrc + " is unreadable (" + String(err) + ")");
      continue;
    }
    if (/^\s*model\s*:/m.test(shipped)) {
      failures.push(id + ": " + expectedSrc + " pins a model; design documents carry no model pins");
      continue;
    }
    if (/TODO|FIXME/.test(shipped)) {
      failures.push(id + ": " + expectedSrc + " carries a TODO or FIXME placeholder");
      continue;
    }
    for (const companion of ["registry/design/LICENSE.voltagent-MIT", "registry/design/ATTRIBUTION.md"]) {
      if (fs.existsSync(path.join(ROOT, companion)) === false) {
        failures.push(id + ": MIT companion " + companion + " does not exist; the license travels with the content");
      }
    }
  }
  if (failures.length > 0) {
    return { status: "FAIL", detail: failures.join("; ") };
  }
  return {
    status: "PASS",
    detail: entries.length + " design.md " + (entries.length === 1 ? "entry ships" : "entries ship") + " unmodified MIT brand document(s) installed by a real file copy with valid phase, tier and verification; zero model pins, zero placeholders, MIT companions present"
  };
}

function offlineReason(result) {
  if (result.code === "ENOENT") return "tool not on PATH (ENOENT)";
  const hay = result.stderr + "\n" + result.stdout + "\n" + result.code + "\n" + (result.message || "");
  for (const marker of OFFLINE_MARKERS) {
    if (hay.includes(marker)) return "network or credentials unavailable (" + marker + ")";
  }
  return null;
}

function frontmatterName(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (match === null) return null;
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    if (/^\s*name\s*:/.test(line)) {
      return line.replace(/^\s*name\s*:\s*/, "").trim().replace(/^["']|["']$/g, "");
    }
  }
  return null;
}

function pad(value, width) {
  let out = value;
  while (out.length < width) out = out + " ";
  return out;
}

function main() {
  let lock = null;
  let schema = null;

  try {
    schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
  } catch (err) {
    record("schema-load", "FAIL", "cannot read " + SCHEMA_PATH + ": " + String(err));
  }

  try {
    lock = JSON.parse(fs.readFileSync(LOCK_PATH, "utf8"));
  } catch (err) {
    record("lockfile-load", "FAIL", "cannot read " + LOCK_PATH + ": " + String(err));
  }

  if (schema !== null && lock !== null) {
    const violation = validateAgainst(schema, lock, "$");
    if (violation === null) {
      record(
        "lockfile-validates",
        "PASS",
        lock.components.length + " components and " + lock.pending.length + " pending entries validate against kit.lock.schema.json"
      );
    } else {
      record("lockfile-validates", "FAIL", "first violation at " + violation);
    }
  } else {
    record("lockfile-validates", "FAIL", "cannot be evaluated: schema or lockfile unreadable");
  }

  const components = lock !== null && Array.isArray(lock.components) ? lock.components : null;

  if (components === null) {
    record("per-kind/skills-in-repo", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/skills-upstream", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/mcp-npm", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/mcp-builtin", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/plugins", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/hooks", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/agents", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/cli", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/lsp", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/theme", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/prompt", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/dataset", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/template", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/policy", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/benchmark", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/workflow", "FAIL", "cannot be evaluated: lockfile components unreadable");
    record("per-kind/design.md", "FAIL", "cannot be evaluated: lockfile components unreadable");
  } else {
    const skills = components.filter((c) => c.kind === "skill");
    const SELF_SOURCE = "3mar-baha/vantrilex-arsenal";
    const inRepo = skills.filter((c) => c.source === null || c.source === undefined || c.source === SELF_SOURCE);
    if (inRepo.length === 0) {
      record(
        "per-kind/skills-in-repo",
        "PASS",
        "0 in-repo skills locked; pending is empty"
      );
    } else {
      const failures = [];
      for (const entry of inRepo) {
        const skillFile = path.join(SKILLS_DIR, entry.id, "SKILL.md");
        if (fs.existsSync(skillFile) === false) {
          failures.push(entry.id + ": missing " + skillFile);
          continue;
        }
        const name = frontmatterName(fs.readFileSync(skillFile, "utf8"));
        if (name !== entry.id) {
          failures.push(entry.id + ": frontmatter name " + JSON.stringify(name) + " does not match folder");
        }
      }
      if (failures.length === 0) {
        record("per-kind/skills-in-repo", "PASS", inRepo.length + " in-repo skills carry .opencode/skills/<id>/SKILL.md with matching frontmatter name");
      } else {
        record("per-kind/skills-in-repo", "FAIL", failures.join("; "));
      }
    }

    const upstream = skills.filter((c) => typeof c.source === "string" && c.source !== SELF_SOURCE);
    // Without gh credentials owner/repo resolution cannot be evaluated; a
    // logged-out machine is an environment condition, not a kit defect.
    const ghAuth = runCapture("gh", ["auth", "status"]);
    if (ghAuth.ok === false) {
      record("per-kind/skills-upstream", "SKIPPED", "gh not authenticated — upstream resolution not evaluated");
    } else {
    const shapeFailures = [];
    const ghFailures = [];
    const ghSkipped = [];
    let ghPassed = 0;
    for (const entry of upstream) {
      const match = typeof entry.install_cmd === "string" ? entry.install_cmd.match(SKILL_CMD) : null;
      if (match === null || match[1] !== entry.source || match[2] !== entry.id) {
        shapeFailures.push(entry.id + ": install_cmd does not match the npx skills add <owner>/<repo> --skill <name> -a opencode shape for source " + entry.source);
        continue;
      }
      const result = runCapture("gh", ["repo", "view", entry.source, "--json", "nameWithOwner"]);
      if (result.ok) {
        let remote = "";
        try {
          remote = JSON.parse(result.stdout).nameWithOwner;
        } catch (err) {
          ghFailures.push(entry.source + ": gh output is not JSON (" + String(err) + ")");
          continue;
        }
        if (typeof remote === "string" && remote.toLowerCase() === entry.source.toLowerCase()) {
          ghPassed++;
        } else {
          ghFailures.push(entry.source + ": remote reports " + JSON.stringify(remote));
        }
      } else {
        const reason = offlineReason(result);
        if (reason === null) {
          const snippet = (result.stderr + " " + result.stdout).trim().slice(0, 160);
          ghFailures.push(entry.source + ": gh repo view failed: " + snippet);
        } else {
          ghSkipped.push(entry.source + " (" + reason + ")");
        }
      }
    }
    if (shapeFailures.length > 0) {
      record("per-kind/skills-upstream", "FAIL", shapeFailures.join("; "));
    } else if (ghFailures.length > 0) {
      record("per-kind/skills-upstream", "FAIL", ghFailures.join("; "));
    } else if (ghSkipped.length > 0) {
      record(
        "per-kind/skills-upstream",
        "SKIPPED",
        upstream.length + " install_cmd shapes hold; gh resolution skipped offline for " + ghSkipped.length + " repos (" + ghPassed + " resolved): " + ghSkipped.join("; ")
      );
    } else {
      record(
        "per-kind/skills-upstream",
        "PASS",
        upstream.length + " install_cmd shapes hold and gh resolves every owner/repo (" + ghPassed + " resolved)"
      );
    }
    }

    const npmMcps = components.filter((c) => c.kind === "mcp" && c.version_pin !== null && c.version_pin !== undefined);
    const npmFailures = [];
    const npmSkipped = [];
    let npmPassed = 0;
    for (const entry of npmMcps) {
      const match = typeof entry.install_cmd === "string" ? entry.install_cmd.match(NPM_CMD) : null;
      if (match === null) {
        npmFailures.push(entry.id + ": install_cmd is not an npx -y <pkg> command");
        continue;
      }
      const pkg = match[1];
      // --ignore-scripts blocks preinstall/postinstall RCE during npm metadata reads.
      const versioned = runCapture("npm", ["view", pkg + "@" + entry.version_pin, "version", "--ignore-scripts"]);
      if (versioned.ok === false) {
        const reason = offlineReason(versioned);
        if (reason === null) {
          npmFailures.push(entry.id + ": npm has no " + pkg + "@" + entry.version_pin);
        } else {
          npmSkipped.push(entry.id + " (" + reason + ")");
        }
        continue;
      }
      if (versioned.stdout.trim() !== entry.version_pin) {
        npmFailures.push(entry.id + ": registry reports " + versioned.stdout.trim() + ", lock pins " + entry.version_pin);
        continue;
      }
      // --ignore-scripts blocks preinstall/postinstall RCE during npm metadata reads.
      const bin = runCapture("npm", ["view", pkg + "@" + entry.version_pin, "bin", "--json", "--ignore-scripts"]);
      if (bin.ok === false) {
        const reason = offlineReason(bin);
        if (reason === null) {
          npmFailures.push(entry.id + ": npm reports no bin entry for " + pkg);
        } else {
          npmSkipped.push(entry.id + " (" + reason + ")");
        }
        continue;
      }
      let parsed = null;
      try {
        parsed = JSON.parse(bin.stdout);
      } catch (err) {
        npmFailures.push(entry.id + ": npm bin output is not JSON");
        continue;
      }
      const hasBin = typeof parsed === "string" ? parsed.length > 0 : isPlainObject(parsed) && Object.keys(parsed).length > 0;
      if (hasBin) {
        npmPassed++;
      } else {
        npmFailures.push(entry.id + ": npm reports an empty bin entry for " + pkg);
      }
    }
    if (npmFailures.length > 0) {
      record("per-kind/mcp-npm", "FAIL", npmFailures.join("; "));
    } else if (npmSkipped.length > 0) {
      record(
        "per-kind/mcp-npm",
        "SKIPPED",
        "npm resolution skipped offline for " + npmSkipped.length + " packages (" + npmPassed + " proven): " + npmSkipped.join("; ")
      );
    } else {
      record(
        "per-kind/mcp-npm",
        "PASS",
        npmPassed + " version-pinned npm MCPs match the registry and expose a bin entry"
      );
    }

    const builtin = components.filter((c) => c.kind === "mcp" && (c.install_cmd === null || c.install_cmd === undefined));
    const dishonest = builtin.filter((c) => c.verification !== "unverified");
    if (dishonest.length > 0) {
      record(
        "per-kind/mcp-builtin",
        "FAIL",
        "built-in/remote MCPs must stay install_cmd null + unverified: " + dishonest.map((c) => c.id).join(", ")
      );
    } else {
      record(
        "per-kind/mcp-builtin",
        "PASS",
        builtin.length + " built-in/remote MCPs honestly recorded (install_cmd null + unverified): " + builtin.map((c) => c.id).join(", ")
      );
    }

    const plugins = components.filter((c) => c.kind === "plugin");
    const pluginBad = plugins.filter((c) => c.install_cmd !== null || c.verification !== "unverified");
    if (pluginBad.length > 0) {
      record(
        "per-kind/plugins",
        "FAIL",
        "plugins must be unverified OpenCode-native records with null install_cmd; offending: " + pluginBad.map((c) => c.id).join(", ")
      );
    } else {
      record(
        "per-kind/plugins",
        "PASS",
        plugins.length + " plugins are unverified OpenCode-native records with null install_cmd; no specs invented"
      );
    }

    const hooks = components.filter((c) => c.kind === "hook");
    let arsenalText = null;
    try {
      arsenalText = fs.readFileSync(ARSENAL_PATH, "utf8");
    } catch (err) {
      record("per-kind/hooks", "FAIL", "cannot read " + ARSENAL_PATH + ": " + String(err));
    }
    if (arsenalText !== null) {
      const hookFailures = [];
      const pairs = [];
      for (const entry of hooks) {
        const fn = HOOK_FUNCTIONS[entry.id];
        if (fn === undefined) {
          hookFailures.push(entry.id + ": no function mapping defined");
          continue;
        }
        const declared = new RegExp("export\\s+const\\s+" + fn + "\\b").test(arsenalText);
        const uses = (arsenalText.match(new RegExp("\\b" + fn + "\\b", "g")) || []).length;
        if (declared === false || uses < 2) {
          hookFailures.push(entry.id + ": function " + fn + " is not registered in .opencode/plugin/arsenal.ts");
        } else {
          pairs.push(entry.id + " -> " + fn);
        }
      }
      if (hookFailures.length > 0) {
        record("per-kind/hooks", "FAIL", hookFailures.join("; "));
      } else {
        record("per-kind/hooks", "PASS", hooks.length + " hooks map to registered functions in .opencode/plugin/arsenal.ts: " + pairs.join("; "));
      }
    }

    const agents = components.filter((c) => c.kind === "agent");
    const agentBad = agents.filter((c) => c.install_cmd !== null || c.verification !== "unverified");
    if (agentBad.length > 0) {
      record(
        "per-kind/agents",
        "FAIL",
        "agents are upstream records with null install_cmd + unverified; fabricated spawn commands in: " + agentBad.map((c) => c.id).join(", ")
      );
    } else {
      record(
        "per-kind/agents",
        "PASS",
        agents.length + " agents are upstream records with null install_cmd + unverified; catalog agreement is proven by the catalog-agreement check"
      );
    }

    const cliResult = checkCliEntries(components);
    record("per-kind/cli", cliResult.status, cliResult.detail);

    const lspResult = checkLspEntries(components);
    record("per-kind/lsp", lspResult.status, lspResult.detail);

    const themeResult = checkThemeEntries(components);
    record("per-kind/theme", themeResult.status, themeResult.detail);

    const promptResult = checkFileCopyKind(components, { kind: "prompt", dir: "prompts", ext: "md", prove: provePrompt });
    record("per-kind/prompt", promptResult.status, promptResult.detail);

    const datasetResult = checkFileCopyKind(components, { kind: "dataset", dir: "datasets", ext: "json", prove: proveDataset });
    record("per-kind/dataset", datasetResult.status, datasetResult.detail);

    const templateResult = checkFileCopyKind(components, { kind: "template", dir: "templates", ext: "json", prove: proveTemplate });
    record("per-kind/template", templateResult.status, templateResult.detail);

    const policyResult = checkFileCopyKind(components, { kind: "policy", dir: "policies", ext: "json", prove: provePolicy });
    record("per-kind/policy", policyResult.status, policyResult.detail);

    const benchmarkResult = checkFileCopyKind(components, { kind: "benchmark", dir: "benchmarks", ext: "json", prove: proveBenchmark });
    record("per-kind/benchmark", benchmarkResult.status, benchmarkResult.detail);

    const workflowResult = checkFileCopyKind(components, { kind: "workflow", dir: "workflows", ext: "yaml", prove: proveWorkflow });
    record("per-kind/workflow", workflowResult.status, workflowResult.detail);

    const designResult = checkDesignEntries(components);
    record("per-kind/design.md", designResult.status, designResult.detail);

    // Every shipped agent file declares mode explicitly. OpenCode V2
    // defaults an omitted mode to primary, so a file without a mode line
    // would silently promote a subagent to session leadership. The check
    // reads .opencode/agents/ (canonical plural V2 location) and proves
    // each self-sourced lock agent resolves to one of those files.
    // Upstream agents carry no local file by design and are named, not checked.
    let agentFiles = null;
    try {
      agentFiles = fs.readdirSync(AGENTS_DIR).filter((f) => f.endsWith(".md")).sort();
    } catch (err) {
      record("agent-mode-explicit", "FAIL", "cannot read .opencode/agents/: " + String(err));
    }
    if (agentFiles !== null) {
      const modeFailures = [];
      let subagentCount = 0;
      for (const file of agentFiles) {
        let text = null;
        try {
          text = fs.readFileSync(path.join(AGENTS_DIR, file), "utf8");
        } catch (err) {
          modeFailures.push(file + ": unreadable (" + String(err) + ")");
          continue;
        }
        const fence = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (fence === null) {
          modeFailures.push(file + ": no frontmatter fence");
          continue;
        }
        const fenceLines = fence[1].split(/\r?\n/);
        const findKey = (key) => fenceLines.find((line) => new RegExp("^\\s*" + key + "\\s*:").test(line));
        const stem = file.replace(/\.md$/, "");
        const nameLine = findKey("name");
        const name = nameLine === undefined ? null : nameLine.replace(/^\s*name\s*:\s*/, "").trim().replace(/^["']|["']$/g, "");
        if (name !== stem) {
          modeFailures.push(file + ": frontmatter name " + JSON.stringify(name) + " does not match filename stem");
          continue;
        }
        const modeLine = findKey("mode");
        if (modeLine === undefined) {
          modeFailures.push(file + ": frontmatter declares no mode (V2 would default it to primary)");
          continue;
        }
        const mode = modeLine.replace(/^\s*mode\s*:\s*/, "").trim();
        if (mode !== "primary" && mode !== "subagent" && mode !== "all") {
          modeFailures.push(file + ": mode " + JSON.stringify(mode) + " is not primary, subagent or all");
          continue;
        }
        if (mode === "subagent") subagentCount++;
      }
      const selfAgents = agents.filter((c) => c.source === "3mar-baha/vantrilex-arsenal");
      for (const entry of selfAgents) {
        if (agentFiles.includes(entry.id + ".md") === false) {
          modeFailures.push(entry.id + ": self-sourced lock agent has no .opencode/agents/" + entry.id + ".md");
        }
      }
      const upstreamAgents = agents.filter((c) => c.source !== "3mar-baha/vantrilex-arsenal");
      if (modeFailures.length > 0) {
        record("agent-mode-explicit", "FAIL", modeFailures.join("; "));
      } else {
        record(
          "agent-mode-explicit",
          "PASS",
          agentFiles.length + " agent files declare mode explicitly (" + subagentCount + " subagent); " + selfAgents.length + " self-sourced lock agents resolve to files; " + upstreamAgents.length + " upstream agent (" + upstreamAgents.map((c) => c.id).join(", ") + ") carries no local file by design"
        );
      }
    }
  }

  if (components === null) {
    record("catalog-agreement", "FAIL", "cannot be evaluated: lockfile components unreadable");
  } else {
    let catalog = null;
    try {
      catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
    } catch (err) {
      record("catalog-agreement", "FAIL", "cannot read " + CATALOG_PATH + ": " + String(err));
    }
    if (catalog !== null) {
      const records = Array.isArray(catalog) ? catalog : catalog.components;
      if (Array.isArray(records) === false) {
        record("catalog-agreement", "FAIL", "catalog has no components array");
      } else {
        const byKey = new Map();
        for (const entry of records) {
          byKey.set(entry.id + "|" + entry.kind, entry);
        }
        const fields = ["kind", "phase", "tier", "install_cmd", "verification"];
        const drifts = [];
        for (const entry of components) {
          const hit = byKey.get(entry.id + "|" + entry.kind);
          if (hit === undefined) {
            drifts.push(entry.id + "|" + entry.kind + ": absent from registry/catalog.json");
            continue;
          }
          for (const field of fields) {
            if (hit[field] !== entry[field]) {
              drifts.push(entry.id + "|" + entry.kind + ": field " + field + " drifts (lock " + JSON.stringify(entry[field]) + " vs catalog " + JSON.stringify(hit[field]) + ")");
            }
          }
        }
        if (drifts.length > 0) {
          record("catalog-agreement", "FAIL", drifts.join("; "));
        } else {
          record(
            "catalog-agreement",
            "PASS",
            components.length + " lock entries agree with registry/catalog.json on kind, phase, tier, install_cmd, verification"
          );
        }
      }
    }
  }

  if (components === null || lock === null || typeof lock.mcp_cap !== "number") {
    record("mcp-cap", "FAIL", "cannot be evaluated: lockfile components or mcp_cap unreadable");
  } else {
    const coreMcps = components.filter((c) => c.kind === "mcp" && c.tier === "core");
    if (coreMcps.length <= lock.mcp_cap) {
      record("mcp-cap", "PASS", coreMcps.length + " tier-core MCP entries are within mcp_cap " + lock.mcp_cap);
    } else {
      record("mcp-cap", "FAIL", coreMcps.length + " tier-core MCP entries exceed mcp_cap " + lock.mcp_cap);
    }
  }

  if (lock === null || Array.isArray(lock.pending) === false || components === null) {
    record("pending-integrity", "FAIL", "cannot be evaluated: lockfile pending list or components unreadable");
  } else {
    const pendingIds = lock.pending.map((p) => p.id);
    const componentIds = new Set(components.map((c) => c.id));
    const componentKeys = new Set(components.map((c) => c.id + "|" + c.kind));
    const problems = [];
    for (const id of EXPECTED_LOCKED_SKILLS) {
      if (componentIds.has(id) === false) problems.push("expected locked component missing: " + id);
    }
    // The nine per-agent themes whose JSONs are not yet built stay pending:
    // a file-copy install command for a nonexistent file is never registered.
    const expectedPending = new Set(EXPECTED_PENDING);
    for (const id of EXPECTED_PENDING) {
      if (pendingIds.includes(id) === false) problems.push("expected pending entry missing: " + id);
    }
    for (const entry of lock.pending) {
      if (expectedPending.has(entry.id) === false) problems.push("unexpected pending entry: " + entry.id);
      if (typeof entry.reason !== "string" || entry.reason.trim() === "") problems.push("pending entry carries no reason: " + entry.id);
      if (entry.kind !== "theme") problems.push("pending entry is not kind theme: " + entry.id);
      if (componentKeys.has(entry.id + "|" + entry.kind)) problems.push("pending id is also locked as a component: " + entry.id);
    }
    if (problems.length > 0) {
      record("pending-integrity", "FAIL", problems.join("; "));
    } else {
      record(
        "pending-integrity",
        "PASS",
        lock.pending.length + " pending per-agent themes carry stated reasons (no theme JSON on disk, no install command registered); " + EXPECTED_LOCKED_SKILLS.join(", ") + " are locked as components (catalog-matching fields proven by the catalog-agreement check)"
      );
    }
  }

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

  let passed = 0;
  let skipped = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "PASS") passed++;
    else if (row.status === "SKIPPED") skipped++;
    else failed++;
  }
  if (failed === 0) {
    console.log("VERDICT: PASS - kit proven (" + passed + " passed, " + skipped + " skipped, 0 failed).");
  } else {
    console.log("VERDICT: FAIL - kit not proven (" + passed + " passed, " + skipped + " skipped, " + failed + " failed).");
  }
  process.exitCode = failed === 0 ? 0 : 1;
}

main();
