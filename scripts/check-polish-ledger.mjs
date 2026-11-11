#!/usr/bin/env node
'use strict';

/*
  Vantrilex polish re-polish guard (W-26).

  Exits 1 (non-zero) when a skill in scope already has a ledger line in
  registry/polish-ledger.jsonl whose id matches the skill's folder AND whose
  sha256 matches the file's current sha256 — i.e. a polish attempt against an
  already-polished, unchanged skill. Exits 0 otherwise.

  Malformed ledger lines (unparseable JSON, missing id/sha256 fields) are
  reported and also produce a non-zero exit: a check that cannot be evaluated
  is a failed check.

  Usage: node scripts/check-polish-ledger.mjs [path ...]
    With no arguments: guard <repo>/.opencode/skills.
    Each argument may be a skills-root directory (scanned for
    <dir>/<name>/SKILL.md) or an explicit SKILL.md file, mirroring
    scripts/polish-scan.mjs.

  Decision (recorded per the W-26 brief, which allowed either shape): this
  guard is a standalone script, not a flag on polish-scan. polish-scan's
  exit-0 contract is "the scan found no mechanical defects"; this guard's
  contract is "no in-scope skill is an already-polished unchanged skill".
  Separate concerns, separate exit semantics, mirroring the repo's
  verify-registry / verify-skills / verify-catalog separation.

  Expected state after the 2026-11-11 W-26 landing: this guard exits 1
  listing every polished skill, because every in-scope file matches its
  ledger line. That is the anti-re-polish signal working, not a failure;
  a future polish lane must find this guard red BEFORE it touches a file.
*/

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = dirname(dirname(SCRIPT_PATH));
const DEFAULT_SKILLS_DIR = join(REPO_ROOT, '.opencode', 'skills');
const LEDGER_PATH = join(REPO_ROOT, 'registry', 'polish-ledger.jsonl');

function usageError(message) {
  process.stderr.write(`usage error: ${message}\n`);
  process.exitCode = 2;
}

function rel(from, absolute) {
  return relative(from, absolute).replace(/\\/gu, '/');
}

function collectTargets(args) {
  if (args.length === 0) return discoverSkillsRoot(DEFAULT_SKILLS_DIR);
  const targets = [];
  for (const arg of args) {
    const absolute = resolve(arg);
    if (!existsSync(absolute)) throw new Error(`path "${arg}" does not exist`);
    const stat = statSync(absolute);
    if (stat.isDirectory()) {
      if (existsSync(join(absolute, 'SKILL.md'))) {
        targets.push(join(absolute, 'SKILL.md'));
      } else {
        targets.push(...discoverSkillsRoot(absolute));
      }
    } else if (stat.isFile() && /SKILL\.md$/iu.test(absolute)) {
      targets.push(absolute);
    } else {
      throw new Error(`path "${arg}" is neither a skills-root directory nor a SKILL.md file`);
    }
  }
  return targets;
}

function discoverSkillsRoot(dir) {
  const targets = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    targets.push(join(dir, entry.name, 'SKILL.md'));
  }
  targets.sort();
  return targets;
}

function sha256OfFile(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function main() {
  const args = process.argv.slice(2);
  let targets;
  try {
    targets = collectTargets(args);
  } catch (error) {
    usageError(error.message);
    return;
  }
  if (targets.length === 0) {
    process.stderr.write('no SKILL.md files found in the guarded scope\n');
    process.exitCode = 1;
    return;
  }
  if (!existsSync(LEDGER_PATH)) {
    process.stdout.write(`check-polish-ledger: PASS — no ledger at registry/polish-ledger.jsonl; nothing is recorded as polished\n`);
    process.exitCode = 0;
    return;
  }
  const ledgerBytes = readFileSync(LEDGER_PATH, 'utf8');
  const ledgerLines = ledgerBytes.split('\n').filter((line) => line.trim().length > 0);
  const byId = new Map();
  const malformed = [];
  ledgerLines.forEach((line, index) => {
    let entry = null;
    try {
      entry = JSON.parse(line);
    } catch (error) {
      malformed.push(`line ${index + 1}: unparseable JSON (${error.message})`);
      return;
    }
    if (!entry || typeof entry.id !== 'string' || typeof entry.sha256 !== 'string' || entry.id.length === 0 || entry.sha256.length === 0) {
      malformed.push(`line ${index + 1}: missing non-empty id/sha256 fields`);
      return;
    }
    if (!byId.has(entry.id)) byId.set(entry.id, []);
    byId.get(entry.id).push(entry.sha256);
  });
  if (malformed.length > 0) {
    for (const problem of malformed) process.stderr.write(`check-polish-ledger: malformed ledger line ${problem}\n`);
    process.stderr.write('check-polish-ledger: FAIL — the ledger cannot be evaluated, so the guard fails\n');
    process.exitCode = 1;
    return;
  }
  const hits = [];
  for (const target of targets) {
    const folder = dirname(target).split(/[\\/]/u).pop();
    const id = folder;
    const hashes = byId.get(id);
    if (!hashes) continue;
    const sha = sha256OfFile(target);
    if (hashes.includes(sha)) hits.push(`${rel(REPO_ROOT, target)}: re-polish attempt — ledger line with identical sha256 exists (id ${id})`);
  }
  if (hits.length > 0) {
    for (const hit of hits) process.stdout.write(`${hit}\n`);
    process.stdout.write(`check-polish-ledger: FAIL — ${hits.length} of ${targets.length} in-scope skill${hits.length === 1 ? '' : 's'} already polished and unchanged\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`check-polish-ledger: PASS — ${targets.length} in-scope skills, none matches a ledger line (nothing is an already-polished unchanged skill)\n`);
  process.exitCode = 0;
}

main();
