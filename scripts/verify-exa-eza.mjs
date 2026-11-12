#!/usr/bin/env node
/*
 * verify-exa-eza — F-32 disambiguation gate: the `exa`/`eza` pair may never
 * be conflated in this tree.
 *
 * The rule, lifted VERBATIM from docs/15-DECISIONS.md (D68, decision 1,
 * curl-patterns / sequential-thinking entry, 2026-11-11):
 *
 *   "The Exa/`eza` disambiguation is stated loudly in the file (Do NOT use
 *    and Failure Modes): `exa` is the search API at `api.exa.ai` with
 *    `x-api-key`; `eza` is the unrelated Rust `ls` replacement; there is no
 *    Exa CLI in the registry and one must never be substituted."
 *
 * The dispatch brief asked for this rule to be lifted verbatim from D68
 * decision 8. It is NOT present there: D68 decision 8 is the curl-patterns
 * skill-row registration. The rule above lives in D68 decision 1; this is
 * recorded as the lift-site deviation. The companion statement "(b) the
 * `exa`/`eza` disambiguation is prose, no gate enforces it" closes D68's
 * consequences; this script is the gate that closes (b).
 *
 * WHAT THIS GATE CHECKS (mechanical approximation, deviation documented):
 *
 *   Scope: every git-tracked file (or, with --root, every scannable file
 *   under the fixture) whose path is under `docs/`, `.opencode/`, `agents/`
 *   or `skills/`, or is one of `CLAUDE.md`, `AGENTS.md`, `README.md`,
 *   `README.ar.md`. File types scanned: .md, .markdown, .mdx, .txt, .json,
 *   .jsonc, .jsonl, .yaml, .yml, .mjs, .cjs, .js, .ts, .sh. Registry
 *   `registry/` data cards and `registry/skills/*.md` are NOT scanned:
 *   they are upstream data authored by other parties, and the word `exa`
 *   is a legitimate search-API reference there.
 *
 *   For every occurrence of the bareword `exa` or `eza` (word-bounded,
 *   case-insensitive), a context window of 80 characters before and after
 *   is taken.
 *
 *   An `eza` occurrence PASSES only if its window contains at least one
 *   LS-DISAMBIGUATION MARKER:
 *     - /ls[-–`]?\s*replacement/i        e.g. "ls replacement", "`ls` replacement"
 *     - /replacement[^.]{0,24}\bls\b/i    e.g. "replacement for `ls`"
 *     - /modern ls/i
 *     - /file[- ]listing/i
 *     - /unrelated rust/i                the curl-patterns phrasing
 *     - /exa.{0,16}eza|eza.{0,16}exa/i   pair/joint context, e.g. "exa/eza"
 *     - /no\s+exa\s+cli\s+in\s+the\s+registry/i  the disambiguation bullet's
 *                                        invariant text (newlines allowed)
 *   otherwise it FAILS as a bare `eza` with no ls-replacement context.
 *
 *   An `exa` occurrence FAILS only if its window contains an
 *   LS-REPLACEMENT MARKER (the first four markers above) and NO SEARCH
 *   MARKER:
 *     - /api\.exa\.ai|x-api-key|EXA_API_KEY|dashboard\.exa\.ai/i
 *     - /semantic search|search api|search-api/i
 *     - /no\s+exa\s+cli\b/i              the same invariant, quoted in exa pass context
 *     - /exa.{0,16}eza|eza.{0,16}exa/i   pair/joint disambiguation context
 *     - /search client/i                 "expecting a search client" is disambiguation prose
 *   i.e. `exa` is read as the ls-replacement; otherwise it passes.
 *
 *   Deviation from the verbatim rule: the verbatim rule is semantic law; a
 *   mechanical gate cannot evaluate intent. The markers above are the closest
 *   faithful approximation, taken from the disambiguation prose that already
 *   ships in this tree (curl-patterns SKILL.md, D68). The "no exa cli in the
 *   registry" marker (newlines permitted inside it) matches the skill's own
 *   disambiguation sentence and is included because one legitimate `eza`
 *   occurrence (curl-patterns, "this file is the integration, and `eza` is
 *   never it.") is disambiguated solely by that sentence within the
 *   80-character window.
 *
 * Usage:
 *   node scripts/verify-exa-eza.mjs            scan this repo (exit 0 pass, 1 fail)
 *   node scripts/verify-exa-eza.mjs --root DIR scan a fixture directory (red-proof mode)
 *   node scripts/verify-exa-eza.mjs --help     usage (exit 0)
 *
 * Exit status:
 *   0 — no violations
 *   1 — violations found (each printed as `path:line: col: word context`)
 *   2 — usage error
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WINDOW = 80;
const SCAN_DIRS = ["docs", ".opencode", "agents", "skills"];
const SCAN_FILES = ["CLAUDE.md", "AGENTS.md", "README.md", "README.ar.md"];
const EXTENSIONS = new Set([".md", ".markdown", ".mdx", ".txt", ".json", ".jsonc", ".jsonl", ".yaml", ".yml", ".mjs", ".cjs", ".js", ".ts", ".sh"]);

const LS_REPLACEMENT_MARKERS = [
  /ls[-–`]?\s*replacement/i,
  /replacement[^.]{0,24}\bls\b/i,
  /modern ls/i,
  /file[- ]listing/i,
];
const LS_DISAMBIGUATION_MARKERS = [
  ...LS_REPLACEMENT_MARKERS,
  /unrelated rust/i,
  /exa.{0,16}eza|eza.{0,16}exa/i,
  /no\s+exa\s+cli\s+in\s+the\s+registry/i,
];
const SEARCH_MARKERS = [
  /api\.exa\.ai|x-api-key|EXA_API_KEY|dashboard\.exa\.ai/i,
  /semantic search|search api|search-api/i,
  /no\s+exa\s+cli\b/i,
  /exa.{0,16}eza|eza.{0,16}exa/i,
  /search client/i,
];

function usage() {
  console.log("Usage: node scripts/verify-exa-eza.mjs [--root DIR]");
  process.exit(0);
}

function walk(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
}

function trackedFiles(root) {
  const out = execSync("git ls-files", { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\n")
    .filter(Boolean);
  const picked = [];
  for (const rel of out) {
    const posix = rel.replace(/\\/g, "/");
    const underDir = SCAN_DIRS.some((d) => posix === d || posix.startsWith(d + "/"));
    const isFile = SCAN_FILES.includes(posix);
    if (!underDir && !isFile) continue;
    if (!EXTENSIONS.has(path.extname(posix).toLowerCase())) continue;
    picked.push(path.join(root, posix));
  }
  return picked;
}

function fixtureFiles(root) {
  const out = [];
  walk(root, out);
  return out;
}

function relOf(root, full) {
  const rel = path.relative(root, full).replace(/\\/g, "/");
  return rel || full;
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) usage();
let root = ROOT;
let fixture = false;
if (args.includes("--root")) {
  const i = args.indexOf("--root");
  const value = args[i + 1];
  if (!value || value.startsWith("--")) {
    console.error("verify-exa-eza: --root requires a directory argument");
    process.exit(2);
  }
  root = path.resolve(value);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    console.error(`verify-exa-eza: --root ${value} is not a readable directory`);
    process.exit(2);
  }
  fixture = true;
} else if (args.length > 0) {
  console.error(`verify-exa-eza: unknown argument ${args[0]}`);
  process.exit(2);
}

const files = fixture ? fixtureFiles(root) : trackedFiles(root);
const violations = [];
let occurrences = 0;

for (const full of files) {
  let text;
  try {
    text = fs.readFileSync(full, "utf8");
  } catch {
    violations.push({ file: full, line: 0, col: 0, word: "?", detail: "unreadable file (failed closed)" });
    continue;
  }
  const re = /\b(exa|eza)\b/gi;
  let match;
  while ((match = re.exec(text)) !== null) {
    occurrences++;
    const word = match[1].toLowerCase();
    const start = Math.max(0, match.index - WINDOW);
    const end = Math.min(text.length, match.index + match[0].length + WINDOW);
    const context = text.slice(start, end);
    const line = lineOf(text, match.index);
    const col = match.index - text.lastIndexOf("\n", match.index - 1);
    const lineText = (text.split("\n")[line - 1] || "").trim();
    ctx: {
      if (word === "eza") {
        if (LS_DISAMBIGUATION_MARKERS.some((m) => m.test(context))) break ctx;
        violations.push({ file: full, line, col, word, detail: `bare \`eza\` with no ls-replacement or disambiguation context: ${lineText.slice(0, 120)}` });
      } else {
        const lsHit = LS_REPLACEMENT_MARKERS.find((m) => m.test(context));
        const searchHit = SEARCH_MARKERS.find((m) => m.test(context));
        if (lsHit && !searchHit) {
          violations.push({ file: full, line, col, word, detail: `\`exa\` used as the ls-replacement (ls-replacement marker ${JSON.stringify(String(lsHit))} in window, no search-API marker): ${lineText.slice(0, 120)}` });
        }
      }
    }
  }
}

if (violations.length > 0) {
  console.log(`verify-exa-eza: FAIL — ${violations.length} violation(s) in ${files.length} file(s):`);
  for (const v of violations) {
    console.log(`  ${relOf(root, v.file)}:${v.line}: ${v.col}: ${v.word} — ${v.detail}`);
  }
  process.exit(1);
}
console.log(`verify-exa-eza: PASS — 0 violations over ${occurrences} occurrence(s) of \`exa\`/\`eza\` in ${files.length} tracked file(s)`);
process.exit(0);
