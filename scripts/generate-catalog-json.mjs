#!/usr/bin/env node
'use strict';

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(SCRIPT_PATH));

const CATALOG_MD = join(ROOT, 'registry', 'VANTRILEX_CATALOG.md');
const CATALOG_JSON = join(ROOT, 'registry', 'catalog.json');
const SCHEMA_PATH = join(ROOT, 'registry', 'schema', 'catalog-v2.schema.json');
const DATA_DIR = join(ROOT, 'registry', 'data');

export const KINDS = ['skill', 'mcp', 'plugin', 'hook', 'agent', 'formatting'];

const SECTION_KINDS = new Map([
  ['Skills', 'skill'],
  ['MCP Servers', 'mcp'],
  ['Plugins', 'plugin'],
  ['Hooks', 'hook'],
  ['Agents', 'agent'],
]);

const SECTION_LABELS = new Map([
  ['skill', 'Skills'],
  ['mcp', 'MCP Servers'],
  ['plugin', 'Plugins'],
  ['hook', 'Hooks'],
  ['agent', 'Agents'],
  ['formatting', 'Formatting'],
]);

export const RECORD_FIELDS = [
  'id',
  'name',
  'kind',
  'description',
  'source',
  'origin',
  'install_cmd',
  'version_pin',
  'category',
  'tags',
  'when_to_use',
  'phase',
  'tier',
  'verify_cmd',
  'cost_note',
  'verification',
  'default_selected',
];

const LINE_OF = new WeakMap();

export function lineOf(record) {
  return LINE_OF.get(record);
}

const DEFAULT_MARKER = '✅';
const HEADING_RE = /^##\s+(.+?)\s+\((\d+)\s+[—–-]\s+(\d+)\s+default-selected\)\s*$/u;
const SEPARATOR_RE = /^\|[\s|:-]+\|$/u;
const OWNER_REPO_RE = /^@?[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/u;
const INSTALL_CELL_MAX = 72;

export class RegistryError extends Error {}

function fail(message) {
  throw new RegistryError(message);
}

/* ---------- encoding ---------- */

export function findMalformedUtf8(buffer) {
  const defects = [];
  let i = 0;
  while (i < buffer.length) {
    const lead = buffer[i];
    let width = 1;
    let ok = true;
    if (lead < 0x80) width = 1;
    else if (lead >= 0xc2 && lead <= 0xdf) width = 2;
    else if (lead >= 0xe0 && lead <= 0xef) width = 3;
    else if (lead >= 0xf0 && lead <= 0xf4) width = 4;
    else ok = false;

    if (ok) {
      for (let k = 1; k < width; k += 1) {
        if (i + k >= buffer.length || (buffer[i + k] & 0xc0) !== 0x80) {
          width = k;
          ok = false;
          break;
        }
      }
    }
    if (ok && width === 3) {
      const b1 = buffer[i + 1];
      if ((lead === 0xe0 && b1 < 0xa0) || (lead === 0xed && b1 > 0x9f)) ok = false;
    }
    if (ok && width === 4) {
      const b1 = buffer[i + 1];
      if ((lead === 0xf0 && b1 < 0x90) || (lead === 0xf4 && b1 > 0x8f)) ok = false;
    }

    if (ok) {
      i += width;
      continue;
    }
    const consumed = Math.max(1, Math.min(width, buffer.length - i));
    defects.push({
      offset: i,
      length: consumed,
      bytes: [...buffer.subarray(i, i + consumed)].map((b) => b.toString(16).padStart(2, '0')),
    });
    i += consumed;
  }
  return defects;
}

export function byteOffsetToLine(buffer, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < buffer.length; i += 1) {
    if (buffer[i] === 0x0a) line += 1;
  }
  return line;
}

/* ---------- deterministic comparison ---------- */

export function compareCodeUnits(a, b) {
  const shared = Math.min(a.length, b.length);
  for (let i = 0; i < shared; i += 1) {
    const ca = a.charCodeAt(i);
    const cb = b.charCodeAt(i);
    if (ca !== cb) return ca < cb ? -1 : 1;
  }
  if (a.length === b.length) return 0;
  return a.length < b.length ? -1 : 1;
}

/* ---------- slug ---------- */

export function slugify(raw) {
  const folded = raw.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return folded.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/* ---------- markdown table parsing ---------- */

export function splitTableRow(line) {
  const cells = [];
  let current = '';
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '\\' && line[i + 1] === '|') {
      current += '|';
      i += 1;
      continue;
    }
    if (ch === '|') {
      cells.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current);
  if (cells.length > 0 && cells[0] === '' && line.startsWith('|')) cells.shift();
  if (cells.length > 0 && cells[cells.length - 1].trim() === '') cells.pop();
  return cells.map((cell) => cell.trim());
}

function splitDefaultMarker(rawName) {
  const at = rawName.indexOf(DEFAULT_MARKER);
  if (at === -1) return { name: rawName.trim(), defaultSelected: false };
  return {
    name: rawName.slice(0, at).concat(rawName.slice(at + DEFAULT_MARKER.length)).trim(),
    defaultSelected: true,
  };
}

export function parseCatalogMarkdown(text, { path = CATALOG_MD } = {}) {
  const lines = text.split('\n');
  const sections = [];
  const records = [];
  let index = 0;

  while (index < lines.length) {
    const heading = HEADING_RE.exec(lines[index]);
    if (!heading) {
      index += 1;
      continue;
    }
    const kind = SECTION_KINDS.get(heading[1]);
    if (!kind) {
      fail(`${path}:${index + 1}: unknown section heading "${heading[1]}" (expected one of ${[...SECTION_KINDS.keys()].join(', ')})`);
    }

    const headingLine = index + 1;
    const declaredCount = Number(heading[2]);
    const declaredDefaultCount = Number(heading[3]);

    let cursor = index + 1;
    while (cursor < lines.length && lines[cursor].trim() === '') cursor += 1;
    if (cursor >= lines.length || !lines[cursor].startsWith('|')) {
      fail(`${path}:${cursor + 1}: section "${heading[1]}" has no component table`);
    }
    const headerLine = cursor + 1;
    const headerCells = splitTableRow(lines[cursor]);
    if (headerCells.length !== 5 || headerCells[0] !== '#' || headerCells[1] !== 'Name') {
      fail(`${path}:${headerLine}: expected table header "| # | Name | Description | Source | Install |", got "${lines[cursor]}"`);
    }
    cursor += 1;
    if (cursor >= lines.length || !SEPARATOR_RE.test(lines[cursor])) {
      fail(`${path}:${cursor + 1}: expected a table separator row under the "${heading[1]}" header`);
    }
    cursor += 1;

    const tableStartLine = cursor + 1;
    const sectionRecords = [];
    while (cursor < lines.length && lines[cursor].startsWith('|')) {
      const lineNumber = cursor + 1;
      const cells = splitTableRow(lines[cursor]);
      if (cells.length !== 5) {
        fail(`${path}:${lineNumber}: malformed row in section "${heading[1]}": expected 5 cells, got ${cells.length}`);
      }
      const ordinal = cells[0];
      if (!/^\d+$/.test(ordinal)) {
        fail(`${path}:${lineNumber}: malformed row in section "${heading[1]}": first cell "${ordinal}" is not a row number`);
      }
      if (Number(ordinal) !== sectionRecords.length + 1) {
        fail(`${path}:${lineNumber}: section "${heading[1]}" numbering is out of order: expected ${sectionRecords.length + 1}, got ${ordinal}`);
      }

      const { name, defaultSelected } = splitDefaultMarker(cells[1]);
      if (name === '') {
        fail(`${path}:${lineNumber}: section "${heading[1]}" row ${ordinal} has an empty name`);
      }
      const id = slugify(name);
      if (id === '') {
        fail(`${path}:${lineNumber}: cannot derive an id from name "${name}" — it contains no ASCII letters or digits`);
      }

      const source = cells[3] === '' ? null : cells[3];
      if (source !== null && !OWNER_REPO_RE.test(source)) {
        fail(`${path}:${lineNumber}: source "${source}" is not an owner/repo coordinate`);
      }

      const record = {
        id,
        name,
        kind,
        description: cells[2],
        source,
        origin: null,
        install_cmd: null,
        version_pin: null,
        category: null,
        tags: [],
        when_to_use: null,
        phase: null,
        tier: null,
        verify_cmd: null,
        cost_note: null,
        verification: 'unverified',
        default_selected: defaultSelected,
      };

      sectionRecords.push(record);
      LINE_OF.set(record, lineNumber);
      cursor += 1;
    }

    const tableEndLine = cursor;
    const parsedDefaultCount = sectionRecords.filter((r) => r.default_selected).length;
    sections.push({
      kind,
      title: heading[1],
      headingLine,
      headingText: lines[index],
      tableStartLine,
      tableEndLine,
      declaredCount,
      declaredDefaultCount,
      records: sectionRecords,
    });
    records.push(...sectionRecords);
    index = cursor;
  }

  for (const kind of SECTION_KINDS.values()) {
    if (!sections.some((s) => s.kind === kind)) {
      fail(`${path}: section "${SECTION_LABELS.get(kind)}" is missing from the catalog`);
    }
  }

  return { lines, sections, records };
}

/* ---------- sidecars ---------- */

export function loadSidecar(kind, dataDir = DATA_DIR) {
  const path = join(dataDir, `${kind}.jsonl`);
  if (!existsSync(path)) return { path, present: false, entries: [] };

  const entries = [];
  const text = readFileSync(path, 'utf8');
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line === '') continue;
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch (error) {
      fail(`${path}:${i + 1}: invalid JSON — ${error.message}`);
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      fail(`${path}:${i + 1}: each line must be a JSON object, got ${Array.isArray(parsed) ? 'an array' : typeof parsed}`);
    }
    if (typeof parsed.id !== 'string' || parsed.id === '') {
      fail(`${path}:${i + 1}: record is missing a non-empty string "id"`);
    }
    for (const key of Object.keys(parsed)) {
      if (!RECORD_FIELDS.includes(key)) {
        fail(`${path}:${i + 1}: unknown field "${key}" (allowed: ${RECORD_FIELDS.join(', ')})`);
      }
    }
    if (parsed.kind !== undefined && parsed.kind !== kind) {
      fail(`${path}:${i + 1}: id "${parsed.id}" declares kind "${parsed.kind}" inside ${kind}.jsonl`);
    }
    entries.push({ id: parsed.id, patch: parsed, line: i + 1, path });
  }
  return { path, present: true, entries };
}

function applyPatch(base, patch) {
  const merged = { ...base };
  LINE_OF.set(merged, lineOf(base));
  for (const field of RECORD_FIELDS) {
    if (field === 'id' || field === 'kind') continue;
    if (Object.prototype.hasOwnProperty.call(patch, field)) merged[field] = patch[field];
  }
  return merged;
}

function copyWithLine(base) {
  const copy = { ...base };
  LINE_OF.set(copy, lineOf(base));
  return copy;
}

export function enrich(records, { dataDir = DATA_DIR } = {}) {
  const byKind = new Map();
  for (const record of records) {
    if (!byKind.has(record.kind)) byKind.set(record.kind, []);
    byKind.get(record.kind).push(record);
  }

  const sidecars = [];
  const enriched = [];

  for (const [kind, kindRecords] of byKind) {
    const sidecar = loadSidecar(kind, dataDir);
    sidecars.push({ kind, ...sidecar });
    if (!sidecar.present) {
      for (const record of kindRecords) enriched.push(copyWithLine(record));
      continue;
    }
    const patches = new Map();
    for (const entry of sidecar.entries) {
      if (patches.has(entry.id)) {
        fail(`${entry.path}:${entry.line}: duplicate id "${entry.id}" — a sidecar must contribute at most one record per id`);
      }
      patches.set(entry.id, entry);
    }
    for (const record of kindRecords) {
      const entry = patches.get(record.id);
      enriched.push(entry ? applyPatch(record, entry.patch) : copyWithLine(record));
      patches.delete(record.id);
    }
    for (const entry of patches.values()) {
      fail(`${entry.path}:${entry.line}: id "${entry.id}" does not match any ${kind} row in registry/VANTRILEX_CATALOG.md`);
    }
  }

  return { records: enriched, sidecars };
}

/* ---------- validation ---------- */

function typeMatches(value, type) {
  const types = Array.isArray(type) ? type : [type];
  return types.some((candidate) => {
    switch (candidate) {
      case 'string':
        return typeof value === 'string';
      case 'null':
        return value === null;
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return value !== null && typeof value === 'object' && !Array.isArray(value);
      case 'integer':
        return Number.isInteger(value);
      case 'number':
        return typeof value === 'number';
      default:
        return true;
    }
  });
}

function describeType(type) {
  return (Array.isArray(type) ? type : [type]).join(' or ');
}

function describeEnum(values) {
  return values.map((value) => JSON.stringify(value)).join(', ');
}

function checkProperty(where, key, value, spec) {
  const problems = [];

  if (spec.type !== undefined && !typeMatches(value, spec.type)) {
    problems.push(`${where}: ${key} must be ${describeType(spec.type)}, got ${JSON.stringify(value)}`);
    return problems;
  }
  if (spec.enum !== undefined && !spec.enum.some((allowed) => allowed === value)) {
    problems.push(`${where}: ${key} must be one of ${describeEnum(spec.enum)}, got ${JSON.stringify(value)}`);
    return problems;
  }
  if (spec.const !== undefined && value !== spec.const) {
    problems.push(`${where}: ${key} must be ${JSON.stringify(spec.const)}, got ${JSON.stringify(value)}`);
    return problems;
  }
  if (typeof value === 'string') {
    if (spec.minLength !== undefined && value.length < spec.minLength) {
      problems.push(`${where}: ${key} must be at least ${spec.minLength} character${spec.minLength === 1 ? '' : 's'}, got ${JSON.stringify(value)}`);
    }
    if (spec.pattern !== undefined && !new RegExp(spec.pattern, 'u').test(value)) {
      problems.push(`${where}: ${key} must match ${spec.pattern}, got ${JSON.stringify(value)}`);
    }
  }
  if (Array.isArray(value)) {
    const itemType = spec.items?.type;
    if (itemType !== undefined) {
      value.forEach((item, index) => {
        if (!typeMatches(item, itemType)) {
          problems.push(`${where}: ${key}[${index}] must be ${describeType(itemType)}, got ${JSON.stringify(item)}`);
        }
      });
    }
    if (spec.uniqueItems === true && new Set(value).size !== value.length) {
      problems.push(`${where}: ${key} must not repeat an item`);
    }
  }
  return problems;
}

function conditionHolds(condition, record) {
  for (const field of condition.required ?? []) {
    if (!Object.prototype.hasOwnProperty.call(record, field)) return false;
  }
  for (const [key, spec] of Object.entries(condition.properties ?? {})) {
    if (checkProperty('condition', key, record[key], spec).length > 0) return false;
  }
  return true;
}

function applySchema(where, record, schema, problems) {
  if (schema.type !== undefined && !typeMatches(record, schema.type)) {
    problems.push(`${where}: value must be ${describeType(schema.type)}`);
    return;
  }
  if (schema.required) {
    for (const field of schema.required) {
      if (!Object.prototype.hasOwnProperty.call(record, field)) {
        problems.push(`${where}: required property "${field}" is missing`);
      }
    }
  }
  for (const [key, value] of Object.entries(record)) {
    const spec = schema.properties?.[key];
    if (spec === undefined) {
      if (schema.additionalProperties === false) {
        problems.push(`${where}: property "${key}" is not declared in the schema`);
      }
      continue;
    }
    problems.push(...checkProperty(where, key, value, spec));
  }
  if (schema.properties && !schema.additionalProperties) {
    for (const key of Object.keys(schema.properties)) {
      if (!Object.prototype.hasOwnProperty.call(record, key)) {
        problems.push(`${where}: property "${key}" must be present in generated output`);
      }
    }
  }
  for (const rule of schema.allOf ?? []) {
    if (rule.if === undefined) continue;
    if (conditionHolds(rule.if, record)) applySchema(where, record, rule.then ?? {}, problems);
  }
}

export function loadSchema(path = SCHEMA_PATH) {
  if (!existsSync(path)) {
    fail(`${path}: record schema not found — the catalog cannot be validated without it`);
  }
  let schema;
  try {
    schema = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`${path}: invalid JSON — ${error.message}`);
  }
  if (schema.type !== 'object' || typeof schema.properties !== 'object') {
    fail(`${path}: expected a JSON Schema object with "type": "object" and a "properties" map`);
  }
  const missing = RECORD_FIELDS.filter((field) => schema.properties[field] === undefined);
  if (missing.length > 0) {
    fail(`${path}: schema does not declare ${missing.join(', ')} — every generated record field must be described`);
  }
  return schema;
}

export function validateRecord(record, schema) {
  const problems = [];
  const where = `id=${record.id ?? '<none>'} line=${lineOf(record) ?? '<unknown>'}`;
  applySchema(where, record, schema, problems);
  return problems;
}

/* ---------- output shaping ---------- */

export function sortRecords(records) {
  const rank = new Map(KINDS.map((kind, index) => [kind, index]));
  return [...records].sort((a, b) => {
    const byKind = rank.get(a.kind) - rank.get(b.kind);
    if (byKind !== 0) return byKind;
    const byName = compareCodeUnits(a.name, b.name);
    if (byName !== 0) return byName;
    return compareCodeUnits(a.id, b.id);
  });
}

function orderRecord(record) {
  const ordered = {};
  for (const field of RECORD_FIELDS) ordered[field] = record[field];
  return ordered;
}

export function buildCatalog(records) {
  const components = sortRecords(records).map(orderRecord);
  const counts = {};
  for (const kind of KINDS) counts[kind] = 0;
  for (const record of components) counts[record.kind] += 1;
  counts.total = components.length;
  return {
    $schema: './schema/catalog-v2.schema.json',
    generated_by: 'scripts/generate-catalog-json.mjs',
    catalog_version: 2,
    counts,
    components,
  };
}

export function loadCatalog({ dataDir = DATA_DIR, schemaPath = SCHEMA_PATH } = {}) {
  const buffer = readFileSync(CATALOG_MD);
  const defects = findMalformedUtf8(buffer);
  const schema = loadSchema(schemaPath);
  const parsed = parseCatalogMarkdown(buffer.toString('utf8'));
  const { records, sidecars } = enrich(parsed.records, { dataDir });
  return { buffer, defects, parsed, records, sidecars, schema };
}

/* ---------- rendering ---------- */

function escapeCell(text) {
  return String(text).replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ').trim();
}

function codeCell(text) {
  const escaped = escapeCell(text);
  if (escaped === '') return '';
  return escaped.includes('`') ? escaped : `\`${escaped}\``;
}

function truncate(text, max = INSTALL_CELL_MAX) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function renderSectionTable(records) {
  const rows = [
    '| # | Name | Description | Source | Install |',
    '|---|------|-------------|--------|--------|',
  ];
  records.forEach((record, i) => {
    const name = record.default_selected ? `${record.name} ${DEFAULT_MARKER}` : record.name;
    rows.push(
      `| ${i + 1} | ${escapeCell(name)} | ${escapeCell(record.description)} | ${escapeCell(record.source ?? '')} | ${codeCell(record.install_cmd ?? '')} |`,
    );
  });
  return rows;
}

export function renderHeading(kind, records) {
  const defaults = records.filter((r) => r.default_selected).length;
  return `## ${SECTION_LABELS.get(kind)} (${records.length} — ${defaults} default-selected)`;
}

export function renderMarkdownDocument(parsed, records) {
  const byKind = new Map();
  for (const record of records) {
    if (!byKind.has(record.kind)) byKind.set(record.kind, []);
    byKind.get(record.kind).push(record);
  }

  const out = [];
  const { lines, sections } = parsed;
  let i = 0;
  while (i < lines.length) {
    const section = sections.find((s) => s.headingLine === i + 1);
    if (!section) {
      out.push(lines[i]);
      i += 1;
      continue;
    }
    const sectionRecords = sortRecords(byKind.get(section.kind) ?? []);
    out.push(renderHeading(section.kind, sectionRecords));
    out.push('');
    out.push(...renderSectionTable(sectionRecords));
    i = section.tableEndLine;
  }
  return `${out.join('\n').replace(/\n+$/u, '')}\n`;
}

const TIER_ORDER = [
  ['core', 'Tier 0 — Core'],
  ['conditional', 'Tier 1 — Conditional'],
  ['extended', 'Tier 2 — Extended'],
];

export function renderIndex(kind, records) {
  const lines = [
    `# ${SECTION_LABELS.get(kind)} Index`,
    '',
    '<!-- Generated by scripts/generate-catalog-json.mjs from registry/VANTRILEX_CATALOG.md. Do not edit by hand. -->',
    '',
    `${records.length} component${records.length === 1 ? '' : 's'}.`,
    '',
  ];

  const groups = [
    ...TIER_ORDER.map(([tier, label]) => [tier, label]),
    [null, 'Untiered'],
  ];

  for (const [tier, label] of groups) {
    const members = records.filter((r) => r.tier === tier);
    lines.push(`## ${label} (${members.length})`, '');
    if (members.length === 0) {
      lines.push('_None._', '');
      continue;
    }
    lines.push('| Name | Kind | Tier | When to use | Install |');
    lines.push('|------|------|------|-------------|---------|');
    for (const record of members) {
      lines.push(
        `| ${escapeCell(record.name)} | ${record.kind} | ${record.tier ?? ''} | ${escapeCell(truncate(record.when_to_use ?? ''))} | ${codeCell(truncate(record.install_cmd ?? ''))} |`,
      );
    }
    lines.push('');
  }

  return `${lines.join('\n').replace(/\n+$/u, '')}\n`;
}

/* ---------- CLI ---------- */

function parseFlags(argv) {
  const flags = new Set(['--markdown', '--indexes', '--check', '--stdout']);
  const seen = new Set();
  for (const arg of argv) {
    if (!flags.has(arg)) fail(`unknown flag "${arg}" (expected one of ${[...flags].join(', ')})`);
    if (seen.has(arg)) fail(`flag "${arg}" was given more than once`);
    seen.add(arg);
  }
  if (seen.has('--check') && seen.has('--stdout')) fail('--check and --stdout are mutually exclusive');
  return seen;
}

function printCounts(counts, stream) {
  const width = Math.max(...KINDS.map((k) => k.length));
  for (const kind of KINDS) {
    stream.write(`${kind.padEnd(width)}  ${String(counts[kind]).padStart(5)}\n`);
  }
  stream.write(`${'total'.padEnd(width)}  ${String(counts.total).padStart(5)}\n`);
}

function compareOrWrite(path, contents, { check }) {
  if (!check) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, contents, 'utf8');
    return 'wrote';
  }
  if (!existsSync(path)) return 'missing';
  return readFileSync(path, 'utf8') === contents ? 'ok' : 'differs';
}

function run(argv, { stdout, log }) {
  const flags = parseFlags(argv);
  const check = flags.has('--check');

  const { buffer, defects, parsed, records, sidecars, schema } = loadCatalog();

  for (const defect of defects) {
    const line = byteOffsetToLine(buffer, defect.offset);
    log(`warning: VANTRILEX_CATALOG.md: byte ${defect.offset} (line ${line}) is a malformed UTF-8 sequence [${defect.bytes.join(' ')}] — decoded lossily as U+FFFD. Fix the source file; verify-registry.mjs check 1 fails on this.`);
  }

  const problems = [];
  for (const record of records) problems.push(...validateRecord(record, schema));
  if (problems.length > 0) {
    fail(`generated records violate catalog-v2 schema:\n  ${problems.slice(0, 20).join('\n  ')}${problems.length > 20 ? `\n  ... and ${problems.length - 20} more` : ''}`);
  }

  for (const section of parsed.sections) {
    const count = section.records.length;
    const defaults = section.records.filter((r) => r.default_selected).length;
    if (count !== section.declaredCount) {
      fail(`VANTRILEX_CATALOG.md: section "${section.title}" heading declares ${section.declaredCount} rows but ${count} were parsed`);
    }
    if (defaults !== section.declaredDefaultCount) {
      fail(`VANTRILEX_CATALOG.md: section "${section.title}" heading declares ${section.declaredDefaultCount} default-selected but ${defaults} were parsed`);
    }
  }

  const catalog = buildCatalog(records);
  const json = `${JSON.stringify(catalog, null, 2)}\n`;

  if (flags.has('--stdout')) {
    stdout.write(json);
    return 0;
  }

  const targets = [[CATALOG_JSON, json]];

  if (flags.has('--markdown')) {
    targets.push([CATALOG_MD, renderMarkdownDocument(parsed, records)]);
  }

  if (flags.has('--indexes')) {
    for (const kind of KINDS) {
      const kindRecords = sortRecords(records.filter((r) => r.kind === kind));
      if (kindRecords.length === 0) {
        log(`skip: registry/${kind}/_index.md — no ${kind} components to index`);
        continue;
      }
      targets.push([join(ROOT, 'registry', kind, '_index.md'), renderIndex(kind, kindRecords)]);
    }
  }

  const drifted = [];
  for (const [path, contents] of targets) {
    const result = compareOrWrite(path, contents, { check });
    const label = relative(ROOT, path).split('\\').join('/');
    log(`${check ? 'check' : 'write'}: ${label} — ${result}`);
    if (check && result !== 'ok') drifted.push(`${label} (${result})`);
  }

  if (drifted.length > 0) {
    fail(`generated output is out of date: ${drifted.join(', ')}. Run: node scripts/generate-catalog-json.mjs${flags.has('--markdown') ? ' --markdown' : ''}${flags.has('--indexes') ? ' --indexes' : ''}`);
  }

  if (!check) {
    for (const sidecar of sidecars) {
      if (!sidecar.present) log(`sidecar: registry/data/${sidecar.kind}.jsonl — absent, base values used`);
      else log(`sidecar: registry/data/${sidecar.kind}.jsonl — ${sidecar.entries.length} entr${sidecar.entries.length === 1 ? 'y' : 'ies'} merged`);
    }
    printCounts(catalog.counts, stdout);
  }

  return 0;
}

function main() {
  const argv = process.argv.slice(2);
  try {
    process.exitCode = run(argv, {
      stdout: process.stdout,
      log: (message) => process.stderr.write(`${message}\n`),
    });
  } catch (error) {
    if (error instanceof RegistryError) {
      process.stderr.write(`error: ${error.message}\n`);
    } else {
      process.stderr.write(`error: ${error.stack ?? error.message}\n`);
    }
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}