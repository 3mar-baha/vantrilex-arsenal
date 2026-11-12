#!/usr/bin/env node
'use strict';

/*
  Vantrilex mechanical polish scanner (W-26, standard w26-v1).

  Mechanical defect scanner over a skills directory or an explicit list of
  SKILL.md files. Reports, per file:

    line-count            file exceeds 500 lines (informational threshold)
    frontmatter-keys      frontmatter is absent, unreadable, or its keys are
                          not exactly [name, description, source]
    missing-section       one of the seven required body sections is absent
                          (## Purpose / ## When to Use / ## Do NOT use /
                          ## Inputs / ## Procedure / ## Outputs / ## Failure
                          Modes; the list is the verify-skills.mjs
                          REQUIRED_HEADINGS list, reused verbatim)
    absolute-path         a drive letter (C:\... / D:/...) or /home/... path
    placeholder           a TODO, FIXME or "coming soon" token
    duplicate-description the frontmatter description is shared with another
                          scanned file
    tools-wildcard        a tools wildcard (tools: ["*"] / "tools":["*"] /
                          tools: [*])

  Exit 0 when clean, 1 when any defect is found, 2 on usage error. The scan
  is read-only; it never writes a file. Node, ESM, zero dependencies,
  hand-rolled parsing (same conventions as scripts/verify-skills.mjs).

  Registry-card mode (tier 2, standard t2-v1, WS3 F-08, 2026-11-12):

    --registry <file.md ...>   scan explicit flat catalog-card files
    --registry-dir <dir>       scan every *.md directly inside <dir>
                               (non-recursive, bytewise order)

  The t2-v1 checks applied to flat cards are ONLY:

    read                    file unreadable
    hygiene                 strict UTF-8 (TextDecoder fatal), no BOM, no CR
                            byte (LF-only), exactly one trailing newline, no
                            hard tab anywhere, no trailing whitespace/tabs
                            on any line (mirrors verify-skills check 8)
    placeholder             TODO / FIXME / "coming soon" token
    absolute-path           drive-letter path or /home/... path
    empty / non-empty-body  zero non-whitespace content, or a body that
                            carries nothing beyond the H1 title line
    raw-url-scheme          a present **Raw URL:** line whose value does not
                            start with https:// (or carries no value)
    duplicate-description   REPORT ONLY, never a defect: two scanned cards
                            sharing a verbatim **Description:** line. Upstream
                            truth is never edited; pairs are printed and
                            recorded, and the exit code is unaffected.

  The seven-heading/frontmatter standard (w26-v1) does NOT apply to flat
  cards. Duplicate descriptions are reports, not defects, by design: the
  catalog treats byte-identical upstream descriptions as independent rows,
  and this mode never rewrites upstream prose. The DEFAULT (no-argument)
  path is byte-identical to the W-26 behaviour.

  Usage: node scripts/polish-scan.mjs [path ...]
    With no arguments: scan <repo>/.opencode/skills (all skill folders).
    Each argument may be either a skills-root directory (scanned for
    <dir>/<name>/SKILL.md) or an explicit SKILL.md file.
    With --registry/--registry-dir: see the t2-v1 note above; --registry
    takes explicit .md files, --registry-dir takes directories of .md cards.

  Defect class calibration (measured 2026-11-11 over the 46 installed skill
  folders): the drive-letter pattern requires a non-alphanumeric or line
  start before the letter, so "http://" and "p://" spellings do not match;
  /home/ requires a following path segment character. Both were verified
  against the live tree before adoption.
*/

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = dirname(dirname(SCRIPT_PATH));
const DEFAULT_SKILLS_DIR = join(DEFAULT_ROOT, '.opencode', 'skills');

const MAX_LINES = 500;

// Reused verbatim from scripts/verify-skills.mjs (REQUIRED_HEADINGS).
const REQUIRED_HEADINGS = [
  'Purpose',
  'When to Use',
  'Do NOT use',
  'Inputs',
  'Procedure',
  'Outputs',
  'Failure Modes',
];

const DRIVE_PATH_RE = /(^|[^A-Za-z0-9])([A-Za-z]:[\\/])/gu;
const HOME_PATH_RE = /\/home\/[A-Za-z0-9._~-]+/gu;
const PLACEHOLDER_RE = /\bTODO\b|\bFIXME\b|coming soon/giu;
const TOOLS_WILDCARD_RE = /"?tools"?\s*:\s*\[\s*"?\*"?\s*\]/gu;

function usageError(message) {
  process.stderr.write(`usage error: ${message}\n`);
  process.exitCode = 2;
}

function rel(from, absolute) {
  return relative(from, absolute).replace(/\\/gu, '/');
}

function collectTargets(args) {
  if (args.length === 0) {
    return { targets: discoverSkillsRoot(DEFAULT_SKILLS_DIR), via: 'default .opencode/skills' };
  }
  const targets = [];
  for (const arg of args) {
    const absolute = resolve(arg);
    if (!existsSync(absolute)) {
      throw new Error(`path "${arg}" does not exist`);
    }
    if (statSync(absolute).isDirectory()) {
      if (existsSync(join(absolute, 'SKILL.md'))) {
        targets.push({ file: join(absolute, 'SKILL.md'), via: arg });
      } else {
        targets.push(...discoverSkillsRoot(absolute));
      }
    } else if (statSync(absolute).isFile() && /SKILL\.md$/iu.test(absolute)) {
      targets.push({ file: absolute, via: arg });
    } else {
      throw new Error(`path "${arg}" is neither a skills-root directory nor a SKILL.md file`);
    }
  }
  return { targets, via: args.join(' ') };
}

function discoverSkillsRoot(dir) {
  const targets = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = join(dir, entry.name, 'SKILL.md');
    targets.push({ file, via: dir });
  }
  targets.sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
  return targets;
}

/* ---------- frontmatter parsing (hand-rolled, same shape as verify-skills.mjs) ---------- */

function decodeText(buffer) {
  let text = buffer.toString('utf8');
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  return text;
}

function parseFrontmatter(text) {
  const lines = text.split('\n').map((line) => (line.endsWith('\r') ? line.slice(0, -1) : line));
  if (lines[0] !== '---') return { ok: false, reason: 'file does not start with a --- frontmatter fence' };
  let close = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i] === '---') {
      close = i;
      break;
    }
  }
  if (close === -1) return { ok: false, reason: 'frontmatter fence --- is never closed' };
  const keys = [];
  const values = new Map();
  let current = null;
  for (let i = 1; i < close; i += 1) {
    const line = lines[i];
    if (line.trim() === '') return { ok: false, reason: `frontmatter line ${i + 1} is blank` };
    const field = /^([A-Za-z0-9_-]+)[ \t]*:[ \t]*(.*)$/u.exec(line);
    if (field) {
      current = field[1];
      keys.push(current);
      values.set(current, [...(values.get(current) ?? []), field[2]]);
    } else if (/^[ \t]+/u.test(line) && current !== null) {
      const parts = values.get(current);
      parts[parts.length - 1] += ` ${line.trim()}`;
    } else {
      return { ok: false, reason: `frontmatter line ${i + 1} is not a key: value pair` };
    }
  }
  return { ok: true, keys, values, bodyStart: close + 1, lines };
}

function countLines(text) {
  return text.endsWith('\n') ? text.split('\n').length - 1 : text.split('\n').length;
}

/* ---------- tier 2 (t2-v1) registry-card mode ---------- */

function collectRegistryTargets(args) {
  // args may mix --registry (files) and --registry-dir (dirs); at least one
  // is required here since the mode was requested. Order: directories first
  // (bytewise), then explicit files in argument order? No — keep one rail:
  // every --registry-dir directory yields its direct *.md children sorted
  // bytewise; every --registry file keeps argument order. Directories come
  // first, matching the option's grouping, and the summary shows the order.
  const dirs = [];
  const files = [];
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === '--registry') {
      i += 1;
      if (i >= args.length || args[i].startsWith('--')) throw new Error('--registry expects at least one .md file path');
      while (i < args.length && !args[i].startsWith('--')) {
        const absolute = resolve(args[i]);
        if (!existsSync(absolute)) throw new Error(`registry card "${args[i]}" does not exist`);
        if (!statSync(absolute).isFile()) throw new Error(`registry card "${args[i]}" is not a file`);
        if (!/\.md$/iu.test(absolute)) throw new Error(`registry card "${args[i]}" is not a .md file`);
        files.push({ file: absolute, via: '--registry' });
        i += 1;
      }
      continue;
    }
    if (arg === '--registry-dir') {
      i += 1;
      if (i >= args.length || args[i].startsWith('--')) throw new Error('--registry-dir expects a directory path');
      const absolute = resolve(args[i]);
      if (!existsSync(absolute)) throw new Error(`registry dir "${args[i]}" does not exist`);
      if (!statSync(absolute).isDirectory()) throw new Error(`registry dir "${args[i]}" is not a directory`);
      const children = readdirSync(absolute, { withFileTypes: true })
        .filter((entry) => entry.isFile() && /\.md$/iu.test(entry.name))
        .map((entry) => join(absolute, entry.name))
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      for (const file of children) dirs.push({ file, via: '--registry-dir' });
      i += 1;
      continue;
    }
    throw new Error(`unknown flag "${arg}" in registry mode (expected --registry or --registry-dir)`);
  }
  return { targets: [...dirs, ...files], via: args.join(' ') };
}

const REGISTRY_DESCRIPTION_RE = /^\*\*Description:\*\*[ \t]*(.*?)[ \t]*$/u;
const REGISTRY_RAW_URL_RE = /^\*\*Raw URL:\*\*[ \t]*(.*?)[ \t]*$/u;
const REGISTRY_H1_RE = /^#[ \t]+/u;

function registryHygieneDefects(buffer) {
  const problems = [];
  if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    problems.push('UTF-8 BOM present');
  }
  let strict = true;
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    strict = false;
  }
  if (!strict) problems.push('not strict UTF-8');
  if (buffer.includes(0x0D)) problems.push('CR byte present (file is not LF-only)');
  const text = buffer.toString('utf8');
  if (text.length === 0) {
    problems.push('file is empty');
  } else if (!text.endsWith('\n') || text.endsWith('\n\n')) {
    problems.push('must end with exactly one trailing newline');
  }
  if (text.includes('\t')) problems.push('hard tab present');
  const bad = [];
  text.split('\n').forEach((line, index) => {
    if (/[ \t]$/u.test(line)) bad.push(index + 1);
  });
  if (bad.length > 0) {
    problems.push(`trailing whitespace on line${bad.length === 1 ? '' : 's'} ${bad.slice(0, 5).join(', ')}${bad.length > 5 ? ', ...' : ''}`);
  }
  return problems;
}

function scanRegistryFile(file) {
  const defects = [];
  let buffer = null;
  let readError = null;
  try {
    buffer = readFileSync(file);
  } catch (error) {
    readError = error.message;
  }
  if (buffer === null) {
    return { defects: [`read: unreadable (${readError ?? 'not readable'})`], description: null };
  }
  for (const problem of registryHygieneDefects(buffer)) defects.push(`hygiene: ${problem}`);
  const text = decodeText(buffer);
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    const trimmed = line.replace(/\r$/u, '');
    DRIVE_PATH_RE.lastIndex = 0;
    const drive = DRIVE_PATH_RE.exec(trimmed);
    if (drive) defects.push(`absolute-path:${index + 1}: drive-letter path "${drive[2]}..."`);
    HOME_PATH_RE.lastIndex = 0;
    const home = HOME_PATH_RE.exec(trimmed);
    if (home) defects.push(`absolute-path:${index + 1}: /home/ path "${home[0]}"`);
    PLACEHOLDER_RE.lastIndex = 0;
    const placeholder = PLACEHOLDER_RE.exec(trimmed);
    if (placeholder) defects.push(`placeholder:${index + 1}: token "${placeholder[0]}"`);
  });
  const substantive = lines.filter((line) => line.trim().length > 0);
  if (substantive.length === 0) {
    defects.push('empty: file carries no non-whitespace content');
  } else if (substantive.filter((line) => !REGISTRY_H1_RE.test(line)).length === 0) {
    defects.push('non-empty-body: body beyond the H1 title line is empty');
  }
  const description = (() => {
    for (const line of lines) {
      const match = REGISTRY_DESCRIPTION_RE.exec(line.replace(/\r$/u, ''));
      if (match) return match[1].trim();
    }
    return null;
  })();
  lines.forEach((line, index) => {
    const match = REGISTRY_RAW_URL_RE.exec(line.replace(/\r$/u, ''));
    if (!match) return;
    const value = match[1].trim();
    if (!value.startsWith('https://')) defects.push(`raw-url-scheme:${index + 1}: expected https:// (got "${value.slice(0, 24)}")`);
  });
  return { defects, description };
}

/* ---------- per-file scan ---------- */

function scanFile(file) {
  const defects = [];
  let buffer = null;
  let readError = null;
  try {
    buffer = readFileSync(file);
  } catch (error) {
    readError = error.message;
  }
  if (buffer === null) {
    return { defects: [`frontmatter-keys: unreadable or missing SKILL.md (${readError ?? 'not readable'})`], description: null, lineCount: 0 };
  }
  const text = decodeText(buffer);
  const lineCount = countLines(text);
  if (lineCount > MAX_LINES) {
    defects.push(`line-count: ${lineCount} lines, limit is ${MAX_LINES}`);
  }
  const parsed = parseFrontmatter(text);
  let description = null;
  if (!parsed.ok) {
    defects.push(`frontmatter-keys: ${parsed.reason}`);
  } else {
    const seen = [...new Set(parsed.keys)];
    const exact = parsed.keys.length === 3 && seen.length === 3
      && seen.includes('name') && seen.includes('description') && seen.includes('source');
    if (!exact) {
      defects.push(`frontmatter-keys: [${parsed.keys.join(', ')}] — exactly [name, description, source] is required, no others`);
    }
    const rawDescription = parsed.values.get('description');
    description = rawDescription ? (rawDescription[0] ?? '').trim() : null;
    if (!description) defects.push('frontmatter-keys: description is absent or empty');
  }
  const bodyLines = parsed.ok ? parsed.lines.slice(parsed.bodyStart) : text.split('\n');
  const body = bodyLines.join('\n');
  const bodyLineOffset = parsed.ok ? parsed.bodyStart : 0;
  const headings = new Set();
  bodyLines.forEach((line) => {
    const match = /^##[ \t]+(.*?)[ \t]*$/u.exec(line.replace(/\r$/u, ''));
    if (match) headings.add(match[1]);
  });
  for (const required of REQUIRED_HEADINGS) {
    if (!headings.has(required)) defects.push(`missing-section: ## ${required} is absent`);
  }
  text.split('\n').forEach((line, index) => {
    const trimmed = line.replace(/\r$/u, '');
    DRIVE_PATH_RE.lastIndex = 0;
    const drive = DRIVE_PATH_RE.exec(trimmed);
    if (drive) defects.push(`absolute-path:${index + 1}: drive-letter path "${drive[2]}..."`);
    HOME_PATH_RE.lastIndex = 0;
    const home = HOME_PATH_RE.exec(trimmed);
    if (home) defects.push(`absolute-path:${index + 1}: /home/ path "${home[0]}"`);
    PLACEHOLDER_RE.lastIndex = 0;
    const placeholder = PLACEHOLDER_RE.exec(trimmed);
    if (placeholder) defects.push(`placeholder:${index + 1}: token "${placeholder[0]}"`);
    TOOLS_WILDCARD_RE.lastIndex = 0;
    if (TOOLS_WILDCARD_RE.test(trimmed)) defects.push(`tools-wildcard:${index + 1}: tools wildcard ["*"]`);
  });
  return { defects, description, lineCount };
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--registry') || args.includes('--registry-dir')) {
    let collected;
    try {
      collected = collectRegistryTargets(args);
    } catch (error) {
      usageError(error.message);
      return;
    }
    const { targets, via } = collected;
    if (targets.length === 0) {
      process.stderr.write('no .md registry cards found in the scanned scope\n');
      process.exitCode = 1;
      return;
    }
    const results = targets.map((target) => ({ target, scan: scanRegistryFile(target.file) }));
    const byDescription = new Map();
    for (const { target, scan } of results) {
      if (!scan.description) continue;
      if (!byDescription.has(scan.description)) byDescription.set(scan.description, []);
      byDescription.get(scan.description).push(target.file);
    }
    let reportCount = 0;
    let fileCount = 0;
    for (const { target, scan } of results) {
      const fileRel = rel(DEFAULT_ROOT, target.file);
      if (scan.defects.length > 0) {
        fileCount += 1;
        for (const defect of scan.defects) process.stdout.write(`${fileRel}: ${defect}\n`);
      }
      const twins = scan.description ? byDescription.get(scan.description).filter((f) => f !== target.file) : [];
      if (twins.length > 0) {
        reportCount += 1;
        process.stdout.write(`${fileRel}: duplicate-description (report, not a defect): shared with ${twins.map((f) => rel(DEFAULT_ROOT, f)).join(', ')}\n`);
      }
    }
    const defectCount = results.reduce((sum, { scan }) => sum + scan.defects.length, 0);
    process.stdout.write(`\npolish-scan: ${results.length} registry cards scanned (via ${via})\n`);
    if (reportCount > 0) {
      process.stdout.write(`duplicate-description reports: ${reportCount} card(s) sharing a verbatim **Description:** (not defects; upstream truth, recorded in docs/dev/tier-2-dispositions-2026-11-12.md)\n`);
    }
    if (defectCount === 0) {
      process.stdout.write(`polish-scan: CLEAN — 0 defects across ${results.length} registry cards\n`);
      process.exitCode = 0;
      return;
    }
    process.stdout.write(`polish-scan: ${defectCount} defect${defectCount === 1 ? '' : 's'} across ${fileCount} file${fileCount === 1 ? '' : 's'} — NOT clean\n`);
    process.exitCode = 1;
    return;
  }
  let collected;
  try {
    collected = collectTargets(args);
  } catch (error) {
    usageError(error.message);
    return;
  }
  const { targets, via } = collected;
  if (targets.length === 0) {
    process.stderr.write('no SKILL.md files found in the scanned scope\n');
    process.exitCode = 1;
    return;
  }
  const results = targets.map((target) => ({ target, scan: scanFile(target.file) }));
  const byDescription = new Map();
  for (const { target, scan } of results) {
    if (!scan.description) continue;
    if (!byDescription.has(scan.description)) byDescription.set(scan.description, []);
    byDescription.get(scan.description).push(target.file);
  }
  for (const { target, scan } of results) {
    if (scan.description && (byDescription.get(scan.description)?.length ?? 0) > 1) {
      scan.defects.push(`duplicate-description: shared with ${byDescription.get(scan.description).filter((f) => f !== target.file).map((f) => rel(DEFAULT_ROOT, f)).join(', ')}`);
    }
  }
  let defectCount = 0;
  let fileCount = 0;
  for (const { target, scan } of results) {
    const fileRel = rel(DEFAULT_ROOT, target.file);
    if (scan.defects.length > 0) {
      fileCount += 1;
      defectCount += scan.defects.length;
      for (const defect of scan.defects) {
        process.stdout.write(`${fileRel}: ${defect}\n`);
      }
    }
  }
  process.stdout.write(`\npolish-scan: ${results.length} files scanned (via ${via})\n`);
  if (defectCount === 0) {
    process.stdout.write(`polish-scan: CLEAN — 0 defects across ${results.length} files\n`);
    process.exitCode = 0;
    return;
  }
  process.stdout.write(`polish-scan: ${defectCount} defect${defectCount === 1 ? '' : 's'} across ${fileCount} file${fileCount === 1 ? '' : 's'} — NOT clean\n`);
  process.exitCode = 1;
}

main();
