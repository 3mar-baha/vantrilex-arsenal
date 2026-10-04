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

const EXPECTED_PENDING = ["vantrilex-vanguard", "vantrilex-doctrine"];

const HOOK_FUNCTIONS = {
  "session-start": "sessionStart",
  "pre-compact": "preCompact",
  "persist-session-state-on-end": "sessionEnd",
  "long-running-process-guard": "longRunningProcessGuard",
  "typescript-check-after-editing-ts-tsx-files": "typescriptCheck",
  "auto-format-js-ts-files-with-prettier-after-edits": "prettierFormat"
};

const SKILL_CMD = /^npx skills add (\S+) --skill (\S+) -a opencode( -y)?$/;
const NPM_CMD = /^npx -y (\S+)$/;
const NETWORK_TIMEOUT_MS = 20000;

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
  } else {
    const skills = components.filter((c) => c.kind === "skill");
    const inRepo = skills.filter((c) => c.source === null || c.source === undefined);
    if (inRepo.length === 0) {
      record(
        "per-kind/skills-in-repo",
        "PASS",
        "0 in-repo skills locked; the two kit skills (vantrilex-vanguard, vantrilex-doctrine) are pending, not locked"
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

    const upstream = skills.filter((c) => typeof c.source === "string");
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
      const versioned = runCapture("npm", ["view", pkg + "@" + entry.version_pin, "version"]);
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
      const bin = runCapture("npm", ["view", pkg + "@" + entry.version_pin, "bin", "--json"]);
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
    const problems = [];
    for (const id of EXPECTED_PENDING) {
      if (pendingIds.includes(id) === false) problems.push("expected pending id missing: " + id);
    }
    for (const id of pendingIds) {
      if (EXPECTED_PENDING.includes(id) === false) problems.push("unexpected pending id: " + id);
      if (componentIds.has(id)) problems.push("pending id is also locked as a component: " + id);
    }
    if (problems.length > 0) {
      record("pending-integrity", "FAIL", problems.join("; "));
    } else {
      record(
        "pending-integrity",
        "PASS",
        "pending holds exactly " + EXPECTED_PENDING.join(", ") + "; both are absent from components"
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
