#!/usr/bin/env node
'use strict';

/*
  Vantrilex skill-format verifier.

  Enforces the skill-file format standard (AGENTS.md, "Skill-file format
  standard"; docs/spec/VANTRILEX_SKILLS_SPEC.md B.6) across every
  .opencode/skills/<name>/SKILL.md file.

  Conventions mirror scripts/verify-registry.mjs: one named check per rule,
  PASS/FAIL/SKIPPED with detail, per-file findings on stderr, a checks table
  plus totals and an explicit verdict line on stdout, exit 0 only when no
  check fails. Node 25, ESM, zero dependencies, hand-rolled parsing.

  Discovery resolves the repo root from this script's own location, never
  from the cwd. The optional --root <dir> flag overrides the root for
  testing only (fixtures, sibling worktrees); every cited repo path is
  reported relative to the effective root.
*/

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = dirname(dirname(SCRIPT_PATH));

const MAX_REPORTED = 20;
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/u;
const MAX_NAME_LEN = 64;
const MIN_DESCRIPTION_LEN = 40;
const TRIGGER_RE = /use when/iu;
const TRIGGER_MAX_OFFSET = 80;
const FIRST_PERSON_RE = /(^|[\s("'])I(?=[\s,.;:'")?!\-]|$)/u;
const SENTENCE_END_RE = /[.!?]/u;

const REQUIRED_HEADINGS = [
  'Purpose',
  'When to Use',
  'Do NOT use',
  'Inputs',
  'Procedure',
  'Outputs',
  'Failure Modes',
];

const PLACEHOLDER_RE = /TODO|FIXME|coming soon|placeholder/giu;

const EXCLUDED_PATTERNS = [
  { label: 'CLAUDE.md', re: /\bCLAUDE\.md\b/ },
  { label: 'CLAUDE_TOOLKIT_DIR', re: /\bCLAUDE_TOOLKIT_DIR\b/ },
  { label: '16-file', re: /\b16-file\b/ },
  { label: 'Madaar', re: /\bMadaar\b/i },
  { label: 'README.ar', re: /\bREADME\.ar\b/ },
  { label: 'devcontainer', re: /\bdevcontainer\b/i },
  { label: 'tmux', re: /\btmux\b/ },
  { label: 'jq', re: /\bjq\b/ },
  { label: 'python/python3', re: /\bpython3?\b/ },
];

const SINGLE_HOME_MARKERS = [
  { label: '[CIRCUIT BREAKER] HALT', home: 'circuit-breaker-guard', token: '[CIRCUIT BREAKER] HALT' },
  { label: '=== DIAGNOSTIC INCIDENT REPORT ===', home: 'circuit-breaker-guard', token: '=== DIAGNOSTIC INCIDENT REPORT ===' },
  { label: 'CONTEXT ANCHOR', home: 'session-context-primer', token: 'CONTEXT ANCHOR' },
];

const DOCTRINE_SKILL = 'vantrilex-doctrine';
const PHASE_MAP_HEADING_RE = /^#{1,6}\s+.*phase map/iu;
const TABLE_ROW_RE = /^\s*\|.*\|\s*$/u;
const TABLE_SEPARATOR_RE = /^[\s|:-]+$/u;
const BACKTICK_RE = /`([^`]+)`/gu;

/* ---------- root resolution ---------- */

function resolveRoot(argv) {
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--root') {
      const value = argv[i + 1];
      if (!value) throw new Error('missing value for --root <dir>');
      return { root: resolve(value), via: '--root' };
    }
    throw new Error(`unknown argument "${argv[i]}" (only --root <dir> is supported)`);
  }
  return { root: DEFAULT_ROOT, via: 'script-location' };
}

/* ---------- loading ---------- */

function rel(root, absolute) {
  return relative(root, absolute).replace(/\\/gu, '/');
}

function discoverSkills(root) {
  const skillsDir = join(root, '.opencode', 'skills');
  if (!existsSync(skillsDir) || !statSync(skillsDir).isDirectory()) {
    return { skillsDir, skills: [], missing: true };
  }
  const entries = readdirSync(skillsDir, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const folder = entry.name;
    const file = join(skillsDir, folder, 'SKILL.md');
    let buffer = null;
    let readError = null;
    if (existsSync(file) && statSync(file).isFile()) {
      try {
        buffer = readFileSync(file);
      } catch (error) {
        readError = error.message;
      }
    }
    skills.push({ folder, file, repoPath: `.opencode/skills/${folder}/SKILL.md`, buffer, readError });
  }
  skills.sort((a, b) => (a.folder < b.folder ? -1 : a.folder > b.folder ? 1 : 0));
  return { skillsDir, skills, missing: false };
}

function decodeText(buffer) {
  let text = buffer.toString('utf8');
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  return text;
}

/* ---------- check 1: skill discovery ---------- */

function checkDiscovery(discovery) {
  if (discovery.missing) {
    return {
      status: 'FAIL',
      detail: '.opencode/skills/ does not exist, so no skill could be discovered',
      lines: ['.opencode/skills/ is absent: the check evaluated nothing and therefore fails'],
    };
  }
  const problems = [];
  if (discovery.skills.length === 0) {
    problems.push('.opencode/skills/ holds no skill folder: the check evaluated nothing and therefore fails');
  }
  for (const skill of discovery.skills) {
    if (!NAME_RE.test(skill.folder)) {
      problems.push(`.opencode/skills/${skill.folder}/: folder name is not lowercase-hyphenated`);
    }
    if (skill.folder.length > MAX_NAME_LEN) {
      problems.push(`.opencode/skills/${skill.folder}/: folder name is ${skill.folder.length} chars, limit is ${MAX_NAME_LEN}`);
    }
    if (skill.buffer === null) {
      problems.push(
        skill.readError
          ? `${skill.repoPath}: could not be read (${skill.readError})`
          : `${skill.repoPath}: missing — the file must be named exactly SKILL.md inside its own folder`,
      );
    }
  }
  if (problems.length > 0) {
    return {
      status: 'FAIL',
      detail: `${problems.length} discovery problem${problems.length === 1 ? '' : 's'} across ${discovery.skills.length} skill folders`,
      lines: problems.slice(0, MAX_REPORTED),
    };
  }
  return {
    status: 'PASS',
    detail: `${discovery.skills.length} skill folders, every name lowercase-hyphenated and every folder holds exactly SKILL.md`,
  };
}

/* ---------- frontmatter parsing (hand-rolled) ---------- */

function parseFrontmatter(text) {
  // Content checks evaluate content: a trailing CR is a hygiene defect
  // (check 8), never a reason to misread the frontmatter itself.
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

/* ---------- check 2: frontmatter keys ---------- */

function checkFrontmatterKeys(skills) {
  const failures = [];
  let clean = 0;
  for (const skill of skills) {
    if (skill.buffer === null) {
      failures.push(`${skill.repoPath}: unreadable or missing, so frontmatter keys cannot be evaluated`);
      continue;
    }
    const parsed = parseFrontmatter(decodeText(skill.buffer));
    if (!parsed.ok) {
      failures.push(`${skill.repoPath}: ${parsed.reason}`);
      continue;
    }
    const seen = [...new Set(parsed.keys)];
    const exact = parsed.keys.length === 2 && seen.length === 2 && seen.includes('name') && seen.includes('description');
    if (!exact) {
      failures.push(`${skill.repoPath}: frontmatter keys [${parsed.keys.join(', ')}] — exactly [name, description] is required, no others`);
      continue;
    }
    clean += 1;
  }
  if (skills.length === 0) {
    return { status: 'FAIL', detail: 'no skills discovered, so frontmatter keys evaluated nothing' };
  }
  if (failures.length > 0) {
    return {
      status: 'FAIL',
      detail: `${failures.length} of ${skills.length} skills have wrong frontmatter keys`,
      lines: failures.slice(0, MAX_REPORTED),
    };
  }
  return { status: 'PASS', detail: `${clean} skills, every frontmatter holds exactly name and description` };
}

/* ---------- check 3: frontmatter name ---------- */

function checkFrontmatterName(skills) {
  const failures = [];
  let clean = 0;
  for (const skill of skills) {
    if (skill.buffer === null) {
      failures.push(`${skill.repoPath}: unreadable or missing, so the name cannot be evaluated`);
      continue;
    }
    const parsed = parseFrontmatter(decodeText(skill.buffer));
    if (!parsed.ok || !parsed.values.has('name')) {
      failures.push(`${skill.repoPath}: no parseable frontmatter name`);
      continue;
    }
    const name = (parsed.values.get('name')[0] ?? '').trim();
    if (name !== skill.folder) {
      failures.push(`${skill.repoPath}: name "${name}" does not equal the folder name "${skill.folder}"`);
      continue;
    }
    if (!NAME_RE.test(name)) {
      failures.push(`${skill.repoPath}: name "${name}" is not lowercase-hyphenated`);
      continue;
    }
    if (name.length > MAX_NAME_LEN) {
      failures.push(`${skill.repoPath}: name is ${name.length} chars, limit is ${MAX_NAME_LEN}`);
      continue;
    }
    clean += 1;
  }
  if (skills.length === 0) {
    return { status: 'FAIL', detail: 'no skills discovered, so names evaluated nothing' };
  }
  if (failures.length > 0) {
    return {
      status: 'FAIL',
      detail: `${failures.length} of ${skills.length} skills have a bad name`,
      lines: failures.slice(0, MAX_REPORTED),
    };
  }
  return { status: 'PASS', detail: `${clean} skills, every name matches its folder and the hyphenated shape` };
}

/* ---------- check 4: frontmatter description ---------- */

function checkDescriptionProblem(description) {
  const trimmed = description.trim();
  if (trimmed.length < MIN_DESCRIPTION_LEN) {
    return `description is ${trimmed.length} chars, minimum is ${MIN_DESCRIPTION_LEN}`;
  }
  const last = trimmed[trimmed.length - 1];
  if (!SENTENCE_END_RE.test(last) || SENTENCE_END_RE.test(trimmed.slice(0, -1))) {
    return 'description must be exactly one sentence ending in a single . ! or ?';
  }
  if (FIRST_PERSON_RE.test(trimmed)) {
    return 'description is not third person (contains a first-person "I")';
  }
  const at = trimmed.search(TRIGGER_RE);
  if (at === -1) {
    return 'description never states its trigger ("Use when" is absent)';
  }
  if (at > TRIGGER_MAX_OFFSET) {
    return `description states "Use when" only at char ${at} — the trigger must be front-loaded within the first ${TRIGGER_MAX_OFFSET} chars`;
  }
  return null;
}

function checkFrontmatterDescription(skills) {
  const failures = [];
  let clean = 0;
  for (const skill of skills) {
    if (skill.buffer === null) {
      failures.push(`${skill.repoPath}: unreadable or missing, so the description cannot be evaluated`);
      continue;
    }
    const parsed = parseFrontmatter(decodeText(skill.buffer));
    if (!parsed.ok || !parsed.values.has('description')) {
      failures.push(`${skill.repoPath}: no parseable frontmatter description`);
      continue;
    }
    const problem = checkDescriptionProblem((parsed.values.get('description')[0] ?? '').trim());
    if (problem) {
      failures.push(`${skill.repoPath}: ${problem}`);
      continue;
    }
    clean += 1;
  }
  if (skills.length === 0) {
    return { status: 'FAIL', detail: 'no skills discovered, so descriptions evaluated nothing' };
  }
  if (failures.length > 0) {
    return {
      status: 'FAIL',
      detail: `${failures.length} of ${skills.length} skills have a bad description`,
      lines: failures.slice(0, MAX_REPORTED),
    };
  }
  return { status: 'PASS', detail: `${clean} skills, every description is one third-person sentence with a front-loaded trigger` };
}

/* ---------- check 5: body headings ---------- */

function checkBodyHeadings(skills) {
  const failures = [];
  let clean = 0;
  for (const skill of skills) {
    if (skill.buffer === null) {
      failures.push(`${skill.repoPath}: unreadable or missing, so body headings cannot be evaluated`);
      continue;
    }
    const text = decodeText(skill.buffer);
    const parsed = parseFrontmatter(text);
    const body = parsed.ok ? parsed.lines.slice(parsed.bodyStart).join('\n') : text;
    const found = [];
    body.split('\n').forEach((line, index) => {
      const match = /^##[ \t]+(.*?)[ \t]*$/u.exec(line.replace(/\r$/u, ''));
      if (match) found.push({ heading: match[1], line: (parsed.ok ? parsed.bodyStart : 0) + index + 1 });
    });
    const fileProblems = [];
    const positions = [];
    for (const required of REQUIRED_HEADINGS) {
      const hits = found.filter((h) => h.heading === required);
      if (hits.length === 0) fileProblems.push(`missing ## ${required}`);
      else if (hits.length > 1) fileProblems.push(`## ${required} appears ${hits.length} times, exactly once is required`);
      else positions.push(hits[0].line);
    }
    let ordered = true;
    for (let i = 1; i < positions.length; i += 1) {
      if (positions[i] <= positions[i - 1]) {
        ordered = false;
        break;
      }
    }
    if (fileProblems.length === 0 && !ordered) fileProblems.push('headings are out of order');
    if (fileProblems.length > 0) {
      failures.push(`${skill.repoPath}: ${fileProblems.join('; ')}`);
      continue;
    }
    clean += 1;
  }
  if (skills.length === 0) {
    return { status: 'FAIL', detail: 'no skills discovered, so body headings evaluated nothing' };
  }
  if (failures.length > 0) {
    return {
      status: 'FAIL',
      detail: `${failures.length} of ${skills.length} skills have bad body headings`,
      lines: failures.slice(0, MAX_REPORTED),
    };
  }
  return { status: 'PASS', detail: `${clean} skills, all seven headings present in order exactly once` };
}

/* ---------- check 6: placeholders ---------- */

function checkPlaceholders(skills) {
  const hits = [];
  for (const skill of skills) {
    if (skill.buffer === null) continue;
    const lines = decodeText(skill.buffer).split('\n');
    lines.forEach((line, index) => {
      PLACEHOLDER_RE.lastIndex = 0;
      const match = PLACEHOLDER_RE.exec(line);
      if (match) hits.push(`${skill.repoPath}:${index + 1}: banned placeholder token "${match[0]}"`);
    });
  }
  if (skills.length === 0) {
    return { status: 'FAIL', detail: 'no skills discovered, so placeholder scanning evaluated nothing' };
  }
  if (hits.length > 0) {
    return {
      status: 'FAIL',
      detail: `${hits.length} banned placeholder match${hits.length === 1 ? '' : 'es'}`,
      lines: hits.slice(0, MAX_REPORTED),
    };
  }
  return { status: 'PASS', detail: `${skills.length} skills, zero TODO/FIXME/coming-soon/placeholder matches` };
}

/* ---------- check 7: excluded toolchains ---------- */

function checkExcludedToolchains(skills) {
  const hits = [];
  for (const skill of skills) {
    if (skill.buffer === null) continue;
    const lines = decodeText(skill.buffer).split('\n');
    lines.forEach((line, index) => {
      for (const pattern of EXCLUDED_PATTERNS) {
        pattern.re.lastIndex = 0;
        if (pattern.re.test(line)) {
          hits.push(`${skill.repoPath}:${index + 1}: excluded reference "${pattern.label}"`);
        }
      }
    });
  }
  if (skills.length === 0) {
    return { status: 'FAIL', detail: 'no skills discovered, so toolchain scanning evaluated nothing' };
  }
  if (hits.length > 0) {
    return {
      status: 'FAIL',
      detail: `${hits.length} excluded-toolchain reference${hits.length === 1 ? '' : 's'}`,
      lines: hits.slice(0, MAX_REPORTED),
    };
  }
  return { status: 'PASS', detail: `${skills.length} skills, zero references to excluded toolchains and the prior project` };
}

/* ---------- check 8: file hygiene ---------- */

function checkHygieneProblem(buffer) {
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
  const text = decodeText(buffer);
  if (text.length === 0) problems.push('file is empty');
  else if (!text.endsWith('\n') || text.endsWith('\n\n')) problems.push('must end with exactly one trailing newline');
  if (text.includes('\t')) problems.push('hard tab present');
  const bad = [];
  text.split('\n').forEach((line, index) => {
    if (/[ \t]$/u.test(line)) bad.push(index + 1);
  });
  if (bad.length > 0) problems.push(`trailing whitespace on line${bad.length === 1 ? '' : 's'} ${bad.slice(0, 5).join(', ')}${bad.length > 5 ? ', ...' : ''}`);
  return problems;
}

function checkFileHygiene(skills) {
  const failures = [];
  let clean = 0;
  for (const skill of skills) {
    if (skill.buffer === null) {
      failures.push(`${skill.repoPath}: unreadable or missing, so hygiene cannot be evaluated`);
      continue;
    }
    const problems = checkHygieneProblem(skill.buffer);
    if (problems.length > 0) {
      failures.push(`${skill.repoPath}: ${problems.join('; ')}`);
      continue;
    }
    clean += 1;
  }
  if (skills.length === 0) {
    return { status: 'FAIL', detail: 'no skills discovered, so hygiene evaluated nothing' };
  }
  if (failures.length > 0) {
    return {
      status: 'FAIL',
      detail: `${failures.length} of ${skills.length} skills fail file hygiene`,
      lines: failures.slice(0, MAX_REPORTED),
    };
  }
  return { status: 'PASS', detail: `${clean} skills, all LF, strict UTF-8 without BOM, single trailing newline, no trailing whitespace or tabs` };
}

/* ---------- check 9: mechanism single-home ---------- */

function checkSingleHome(skills) {
  const byFolder = new Map(skills.map((s) => [s.folder, s]));
  const failures = [];
  for (const marker of SINGLE_HOME_MARKERS) {
    const home = byFolder.get(marker.home);
    if (!home) {
      failures.push(`home skill "${marker.home}" is absent, so the single-home rule for "${marker.label}" cannot be evaluated`);
      continue;
    }
    if (home.buffer === null) {
      failures.push(`${home.repoPath}: unreadable, so the single-home rule for "${marker.label}" cannot be evaluated`);
      continue;
    }
    if (!decodeText(home.buffer).includes(marker.token)) {
      failures.push(`${home.repoPath}: home copy of "${marker.label}" is missing`);
    }
    for (const skill of skills) {
      if (skill.folder === marker.home || skill.buffer === null) continue;
      if (decodeText(skill.buffer).includes(marker.token)) {
        failures.push(`${skill.repoPath}: second copy of "${marker.label}" — it may live only in ${marker.home}`);
      }
    }
  }
  if (skills.length === 0) {
    return { status: 'FAIL', detail: 'no skills discovered, so the single-home rule evaluated nothing' };
  }
  if (failures.length > 0) {
    return {
      status: 'FAIL',
      detail: `${failures.length} single-home violation${failures.length === 1 ? '' : 's'}`,
      lines: failures.slice(0, MAX_REPORTED),
    };
  }
  return { status: 'PASS', detail: 'halt block, incident template and context anchor each live in exactly one home skill' };
}

/* ---------- check 10: phase-map cross-check ---------- */

function loadCatalogIds(root) {
  const catalogPath = join(root, 'registry', 'catalog.json');
  if (!existsSync(catalogPath)) return { ok: false, reason: 'registry/catalog.json does not exist' };
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(catalogPath, 'utf8'));
  } catch (error) {
    return { ok: false, reason: `registry/catalog.json could not be parsed: ${error.message}` };
  }
  if (!Array.isArray(parsed.components)) return { ok: false, reason: 'registry/catalog.json has no components array' };
  return { ok: true, ids: new Set(parsed.components.map((c) => String(c.id))) };
}

function checkPhaseMap(root, skills) {
  const doctrineFile = join(root, '.opencode', 'skills', DOCTRINE_SKILL, 'SKILL.md');
  if (!existsSync(doctrineFile)) {
    return {
      status: 'SKIPPED',
      detail: `.opencode/skills/${DOCTRINE_SKILL}/SKILL.md is absent, so no phase map could be parsed. A skipped check is not a passing check.`,
    };
  }
  let text;
  try {
    text = decodeText(readFileSync(doctrineFile));
  } catch (error) {
    return { status: 'FAIL', detail: `doctrine SKILL.md could not be read: ${error.message}` };
  }
  const lines = text.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (PHASE_MAP_HEADING_RE.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start === -1) {
    return { status: 'FAIL', detail: 'doctrine SKILL.md has no phase-map section, so the cross-check evaluated nothing' };
  }
  const rows = [];
  let collecting = false;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (TABLE_ROW_RE.test(lines[i])) {
      collecting = true;
      if (!TABLE_SEPARATOR_RE.test(lines[i])) rows.push(lines[i]);
    } else if (collecting && lines[i].trim() === '') {
      break;
    } else if (collecting) {
      break;
    }
  }
  const names = [];
  for (const row of rows) {
    BACKTICK_RE.lastIndex = 0;
    let match;
    while ((match = BACKTICK_RE.exec(row)) !== null) {
      if (!names.includes(match[1])) names.push(match[1]);
    }
  }
  if (names.length === 0) {
    return { status: 'FAIL', detail: 'phase-map table yielded zero backticked skill names, so the cross-check evaluated nothing' };
  }
  const catalog = loadCatalogIds(root);
  if (!catalog.ok) {
    return { status: 'FAIL', detail: `phase map names ${names.length} but ${catalog.reason}, so the cross-check evaluated nothing` };
  }
  const folders = new Set(skills.map((s) => s.folder));
  const missing = names.filter((name) => !folders.has(name) && !catalog.ids.has(name));
  if (missing.length > 0) {
    return {
      status: 'FAIL',
      detail: `${missing.length} phase-map name${missing.length === 1 ? '' : 's'} resolve neither as a skill folder nor as a catalog id`,
      lines: missing.map((name) => `phase-map name "${name}" is missing from .opencode/skills/ and registry/catalog.json`),
    };
  }
  const local = names.filter((name) => folders.has(name)).length;
  return { status: 'PASS', detail: `${names.length} phase-map names all resolve (${local} local skill folders, ${names.length - local} catalog ids)` };
}

/* ---------- report ---------- */

function report(results) {
  const out = process.stdout;
  const err = process.stderr;

  for (const result of results) {
    for (const line of result.lines ?? []) err.write(`  ! ${line}\n`);
  }

  const nameWidth = Math.max(...results.map((r) => r.name.length));
  out.write('Vantrilex skill-format verification\n\n');
  out.write(`${'check'.padEnd(nameWidth)}  ${'status'.padEnd(7)}  detail\n`);
  out.write(`${'-'.repeat(nameWidth)}  ${'-'.repeat(7)}  ${'-'.repeat(64)}\n`);
  for (const result of results) {
    out.write(`${result.name.padEnd(nameWidth)}  ${result.status.padEnd(7)}  ${result.detail}\n`);
  }

  const failed = results.filter((r) => r.status === 'FAIL').length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const skipped = results.filter((r) => r.status === 'SKIPPED').length;
  out.write(`\ntotals: ${results.length} checks — ${passed} passed, ${failed} failed, ${skipped} skipped\n`);

  if (failed > 0) {
    out.write(`VERDICT: FAIL — ${failed} of ${results.length} checks did not pass. The skills are NOT clean.\n`);
    return 1;
  }
  if (skipped > 0) {
    out.write(`VERDICT: PASS WITH SKIPS — ${skipped} of ${results.length} checks skipped. A skipped check is not a passing check.\n`);
    return 0;
  }
  out.write(`VERDICT: PASS — all ${results.length} checks ran and passed. The skills are clean.\n`);
  return 0;
}

function main() {
  let root;
  try {
    root = resolveRoot(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`usage error: ${error.message}\n`);
    process.exitCode = 2;
    return;
  }
  if (!existsSync(root.root) || !statSync(root.root).isDirectory()) {
    process.stderr.write(`usage error: root "${root.root}" does not exist or is not a directory\n`);
    process.exitCode = 2;
    return;
  }

  const discovery = discoverSkills(root.root);
  const skills = discovery.skills;
  const results = [
    { name: 'skill-discovery', ...checkDiscovery(discovery) },
    { name: 'frontmatter-keys', ...checkFrontmatterKeys(skills) },
    { name: 'frontmatter-name', ...checkFrontmatterName(skills) },
    { name: 'frontmatter-description', ...checkFrontmatterDescription(skills) },
    { name: 'body-headings', ...checkBodyHeadings(skills) },
    { name: 'no-placeholders', ...checkPlaceholders(skills) },
    { name: 'no-excluded-toolchains', ...checkExcludedToolchains(skills) },
    { name: 'file-hygiene', ...checkFileHygiene(skills) },
    { name: 'mechanism-single-home', ...checkSingleHome(skills) },
    { name: 'phase-map-cross-check', ...checkPhaseMap(root.root, skills) },
  ];

  process.exitCode = report(results);
}

main();
