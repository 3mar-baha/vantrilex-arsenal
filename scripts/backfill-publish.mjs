#!/usr/bin/env node
/**
 * backfill-publish.mjs — the §4 backfill publisher: explicit versions from the
 * owner-approved map, one commit-anchored or evidence-anchored release at a time.
 *
 * The rule this script implements (owner release ruling §4 + the approved map):
 * the backfill publishes in ascending version order; each commit unit ships the
 * tree as it was at its own commit, and each no-commit unit ships the evidence
 * bundle the map enumerates. Release notes carry the scope plus the AS-CLOSED
 * verification evidence quoted from the closure record — never a battery re-run
 * today. A historical tree is never edited to pass today's battery, and today's
 * battery never blocks a historical release (map §8.4). Held units are refused.
 * A commit unit is tagged at its own commit. An evidence unit has no commit of
 * its own, so its tag names the publication point (HEAD) and the notes state
 * plainly that no source tree exists for the unit. A closure-record unit is the
 * same, except its bundle quotes the surviving ledger passage verbatim from the
 * uncommitted live state file at build time; nothing is re-run or reconstructed.
 *
 * Inputs, both read from disk:
 *   .opencode/audit/RELEASE-BACKFILL.json  the machine manifest derived from the
 *                                          approved map: explicit versions, mode,
 *                                          ref, assets, notes reference, status
 *                                          and the map's sha256 (drift guard).
 *   .opencode/audit/RELEASE-BACKFILL-MAP.md the owner-approved map itself; the
 *                                          run refuses when its sha256 differs
 *                                          from the one the manifest recorded.
 *
 * Usage:
 *   scripts/backfill-publish.mjs [--one <version>] [-h | --help]
 *
 *   --one <version>  Publish exactly one manifest entry (the §5 rule: the first
 *                    live publish runs monitored). A held version is refused.
 *                    Without it, every entry is processed in order.
 *
 * Environment:
 *   DRY_RUN=1|0  Default 1. A dry run verifies the map hash, validates the
 *                manifest, builds every asset in a temp directory, prints the
 *                per-version plan and the final plan, and reports the audit line
 *                it would write. It creates no tag, no release, no push, and it
 *                appends nothing to the audit log. Publishing needs DRY_RUN=0.
 *   PUBLISH_REPO=owner/name  Default: the origin remote's slug, recorded in the
 *                audit line's channels field only.
 *
 * Exit status:
 *   0  every ready entry was planned (dry run) or published, or a held entry was
 *      refused as part of a full run.
 *   1  refused or failed: unreadable manifest, map hash drift, non-ascending
 *      versions, a held entry targeted by --one, an absent commit or evidence
 *      file, a failed asset build, or a failed create. Fail closed.
 *
 * The audit-log change is deliberately not committed back: the log is tracked,
 * and the operator's scoped commit is the only thing allowed to sweep it.
 */

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  appendFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(SCRIPT_PATH));

const PATHS = {
  manifest: join(ROOT, '.opencode', 'audit', 'RELEASE-BACKFILL.json'),
  map: join(ROOT, '.opencode', 'audit', 'RELEASE-BACKFILL-MAP.md'),
  audit: join(ROOT, '.opencode', 'audit', 'AUTO-PUBLISH.log'),
};

const MODES = ['commit', 'evidence', 'closure-record'];
const STATUSES = ['ready', 'held'];
const VERSION_RE = /^(\d+)\.(\d+)\.(\d+)$/;
const COMMIT_RE = /^[0-9a-f]{40}$/;
const HEX64_RE = /^[0-9a-f]{64}$/;

/* ---------- process plumbing ---------- */

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error ? String(result.error.message ?? result.error) : null,
  };
}

function git(args, options = {}) {
  return run('git', ['-C', ROOT, ...args], options);
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function timestamp() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function errorText(error) {
  return error instanceof Error ? error.message : String(error);
}

/* ---------- the manifest ---------- */

export function compareVersions(a, b) {
  for (const index of [0, 1, 2]) {
    if (a[index] !== b[index]) return a[index] < b[index] ? -1 : 1;
  }
  return 0;
}

function parseVersion(version) {
  const match = VERSION_RE.exec(version);
  if (match === null) return null;
  return { text: version, parts: [Number(match[1]), Number(match[2]), Number(match[3])] };
}

/*
  parseManifest <text> — {ok: true, manifest} | {ok: false, error}.
  Strict on purpose: the version list is explicit and must already be strictly
  ascending, so a mis-ordered or duplicated manifest is refused rather than
  re-sorted into a plausible-looking plan.
*/
export function parseManifest(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    return { ok: false, error: `invalid JSON — ${error.message}` };
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'the manifest must be a JSON object' };
  }
  if (typeof parsed.approved_map !== 'string' || parsed.approved_map.trim() === '') {
    return { ok: false, error: 'the manifest must name "approved_map"' };
  }
  if (typeof parsed.map_sha256 !== 'string' || !HEX64_RE.test(parsed.map_sha256)) {
    return { ok: false, error: 'map_sha256 must be a lowercase 64-character hex digest' };
  }
  if (!Array.isArray(parsed.entries) || parsed.entries.length === 0) {
    return { ok: false, error: 'the manifest must carry a non-empty "entries" array' };
  }

  const entries = [];
  let previous = null;
  for (let index = 0; index < parsed.entries.length; index += 1) {
    const where = `entries[${index}]`;
    const raw = parsed.entries[index];
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
      return { ok: false, error: `${where}: each entry must be a JSON object` };
    }
    const parsedVersion = parseVersion(raw.version);
    if (parsedVersion === null) {
      return { ok: false, error: `${where}: version must be a strict X.Y.Z string, got ${JSON.stringify(raw.version)}` };
    }
    if (previous !== null && compareVersions(parsedVersion.parts, previous) <= 0) {
      return { ok: false, error: `${where}: versions must be strictly ascending; ${raw.version} follows ${entries[index - 1].version}` };
    }
    previous = parsedVersion.parts;
    if (typeof raw.unit !== 'string' || raw.unit.trim() === '') {
      return { ok: false, error: `${where}: unit must be a non-empty string` };
    }
    if (!MODES.includes(raw.mode)) {
      return { ok: false, error: `${where}: mode must be one of ${MODES.join(', ')}, got ${JSON.stringify(raw.mode)}` };
    }
    if (raw.mode === 'commit') {
      if (typeof raw.ref !== 'string' || !COMMIT_RE.test(raw.ref)) {
        return { ok: false, error: `${where}: a commit entry must carry a full 40-character lowercase ref` };
      }
    } else if (raw.ref !== null) {
      return { ok: false, error: `${where}: a ${raw.mode} entry must carry ref null; no commit is invented` };
    }
    if (raw.mode === 'closure-record') {
      const record = raw.record;
      if (record === null || typeof record !== 'object' || Array.isArray(record)) {
        return { ok: false, error: `${where}: a closure-record entry must carry a "record" object naming the surviving closure record` };
      }
      if (typeof record.file !== 'string' || record.file.trim() === '' || isAbsolute(record.file) || record.file.split('/').includes('..')) {
        return { ok: false, error: `${where}: record.file must be a repo-relative path` };
      }
      if (!Number.isInteger(record.line) || record.line < 1) {
        return { ok: false, error: `${where}: record.line must be a positive integer` };
      }
      if (typeof record.must_contain !== 'string' || record.must_contain.trim() === '') {
        return { ok: false, error: `${where}: record.must_contain must name the fingerprint the cited line must carry` };
      }
    } else if (Object.prototype.hasOwnProperty.call(raw, 'record')) {
      return { ok: false, error: `${where}: only a closure-record entry may carry "record"` };
    }
    if (!Array.isArray(raw.assets) || raw.assets.some((path) => typeof path !== 'string' || path.trim() === '')) {
      return { ok: false, error: `${where}: assets must be an array of non-empty repo-relative paths` };
    }
    for (const path of raw.assets) {
      if (isAbsolute(path) || path.split('/').includes('..') || path.includes('\\')) {
        return { ok: false, error: `${where}: asset path ${JSON.stringify(path)} must be repo-relative with forward slashes` };
      }
    }
    if (typeof raw.notes_ref !== 'string' || raw.notes_ref.trim() === '') {
      return { ok: false, error: `${where}: notes_ref must name the map section the notes come from` };
    }
    if (!STATUSES.includes(raw.status)) {
      return { ok: false, error: `${where}: status must be one of ${STATUSES.join(', ')}, got ${JSON.stringify(raw.status)}` };
    }
    if (raw.status === 'held') {
      if (typeof raw.hold_reason !== 'string' || raw.hold_reason.trim() === '') {
        return { ok: false, error: `${where}: a held entry must carry a non-empty hold_reason` };
      }
    } else {
      if (raw.hold_reason !== null) {
        return { ok: false, error: `${where}: a ready entry must carry hold_reason null` };
      }
      if (raw.assets.length === 0 && raw.mode !== 'closure-record') {
        return { ok: false, error: `${where}: a ready ${raw.mode} entry must enumerate at least one asset` };
      }
    }
    if (typeof raw.as_closed !== 'string' || raw.as_closed.trim() === '') {
      return { ok: false, error: `${where}: as_closed must quote the closure record's verification evidence` };
    }
    if (!Array.isArray(raw.gaps) || raw.gaps.some((gap) => typeof gap !== 'string')) {
      return { ok: false, error: `${where}: gaps must be an array of strings` };
    }
    entries.push({ ...raw });
  }
  return { ok: true, manifest: { ...parsed, entries } };
}

/* verifyMapHash <manifest> <actual> — the drift guard the executor enforces
   before it reads a single version. */
export function verifyMapHash(manifest, actual) {
  return { ok: manifest.map_sha256 === actual, expected: manifest.map_sha256, actual };
}

/*
  planAction <entry> <existingTags> — the pure idempotency and hold decision.
    publish             the tag does not exist; this run may publish it
    skip-existing-tag   the tag already exists; nothing is created twice
    refused-held        the map holds this unit; it is never published
*/
export function planAction(entry, existingTags) {
  if (entry.status === 'held') return 'refused-held';
  if (existingTags.includes(`v${entry.version}`)) return 'skip-existing-tag';
  return 'publish';
}

/* ---------- release notes ---------- */

/*
  renderNotes <entry> <mapHash> — the notes body: unit scope, the AS-CLOSED
  evidence quoted from the closure record, every gap the record stated, and the
  verification basis. The artifact/package section is added by the caller
  because only the caller knows the built asset's identity.
*/
export function renderNotes(entry, mapHash) {
  const lines = [`## v${entry.version} — ${entry.unit}`, ''];
  if (entry.mode === 'commit') {
    lines.push(`Commit-anchored release: the package is the tree as it was at \`${entry.ref}\`.`);
  } else if (entry.mode === 'closure-record') {
    lines.push('**Closure-record release.**');
    lines.push('');
    lines.push("This unit's report artifact was overwritten in place in its own era and no copy of that text survives. No source tree exists for this unit. Nothing was re-run or reconstructed: the package preserves the surviving closure record exactly as the ledger holds it.");
  } else {
    lines.push('No committed source tree exists for this unit; this package preserves its closure record.');
  }
  lines.push('', '### As-closed verification', '', `> ${entry.as_closed}`, '');
  lines.push('### Gaps stated at closure', '');
  for (const gap of entry.gaps) lines.push(`- ${gap}`);
  lines.push('');
  lines.push('### Verification basis', '');
  lines.push(`The evidence above is the record made when this unit closed (map reference: \`${entry.notes_ref}\`; file \`.opencode/audit/RELEASE-BACKFILL-MAP.md\`, sha256 \`${mapHash}\`).`);
  lines.push('It is not a battery re-run: a historical tree is never edited to pass today\'s battery, and today\'s battery never blocks a historical release (map §8.4).');
  lines.push('');
  lines.push('### Release record', '');
  lines.push(`- map reference: \`${entry.notes_ref}\` of the owner-approved backfill map`);
  lines.push(`- version: \`v${entry.version}\` (explicit value from the map, never computed)`);
  lines.push('');
  return lines.join('\n');
}

function renderArtifactSection(entry, asset) {
  const lines = [];
  if (entry.mode === 'commit') {
    lines.push('### Artifact', '');
    lines.push(`\`${asset.name}\` — built by \`git archive\` from \`${entry.ref}\`, sha256 \`${asset.sha256}\`, ${asset.bytes} bytes.`);
    if (asset.absent.length > 0) {
      lines.push('', `Paths in the release path set that this commit did not carry: ${asset.absent.map((path) => `\`${path}\``).join(', ')}.`);
    }
  } else if (entry.mode === 'evidence') {
    lines.push('### Package', '');
    lines.push(`\`${asset.name}\` — ${entry.assets.length} evidence file(s), sha256 \`${asset.sha256}\`, ${asset.bytes} bytes.`);
    lines.push('', `Layout: \`RELEASE-NOTES-v${entry.version}.md\`, \`CLOSURE-EVIDENCE/\` (repo-relative copies), \`MANIFEST.txt\` (per-file bytes + sha256).`);
  } else {
    lines.push('### Package', '');
    lines.push(`\`${asset.name}\` — closure-record bundle, sha256 \`${asset.sha256}\`, ${asset.bytes} bytes.`);
    lines.push('', `Layout: \`CLOSURE-RECORD.md\` (the ledger passage quoted verbatim from \`${entry.record.file}\` line ${entry.record.line}), \`RELEASE-NOTES-v${entry.version}.md\`, \`MANIFEST.txt\` (per-file bytes + sha256).`);
  }
  lines.push('');
  return lines.join('\n');
}

/* ---------- assets ---------- */

/*
  buildCommitAsset <entry> <scratch> — the tarball of the tree at that commit.
  The pathspec is the manifest's release path set (the repo's release set minus
  `kit`, which the line no longer carries). A path the commit did not carry is
  reported and skipped: history is not edited to match today's file list. An
  empty archive refuses.
*/
function buildCommitAsset(entry, scratch) {
  if (!git(['cat-file', '-e', `${entry.ref}^{commit}`]).ok) {
    throw new Error(`commit ${entry.ref} does not exist in this checkout`);
  }
  const present = [];
  const absent = [];
  for (const path of entry.assets) {
    if (git(['cat-file', '-e', `${entry.ref}:${path}`]).ok) present.push(path);
    else absent.push(path);
  }
  if (present.length === 0) {
    throw new Error(`none of the ${entry.assets.length} release path(s) exists at ${entry.ref}`);
  }
  const name = `vantrilex-arsenal-v${entry.version}.tar.gz`;
  const path = join(scratch, name);
  const archive = git(['archive', '--format=tar.gz', `--output=${path}`, entry.ref, '--', ...present]);
  if (!archive.ok) {
    throw new Error(`git archive failed for ${entry.ref}: ${archive.stderr.trim() || archive.error || 'unknown error'}`);
  }
  return { name, path, bytes: statSync(path).size, sha256: sha256File(path), present, absent };
}

/*
  buildEvidenceAsset <entry> <scratch> — the enumerated bundle. Files are read
  from the worktree, not from a commit: the whole point of an evidence release is
  that the closure artifacts were never committed. Every listed file must exist,
  so a bundle can never ship thinner than the notes claim.
*/
function buildEvidenceAsset(entry, scratch, notes) {
  const missing = entry.assets.filter((path) => !existsSync(join(ROOT, path)));
  if (missing.length > 0) {
    throw new Error(`evidence file(s) absent from the worktree: ${missing.join(' ')}`);
  }
  const stage = join(scratch, `bundle-v${entry.version}`);
  const evidenceDir = join(stage, 'CLOSURE-EVIDENCE');
  const rows = [];
  for (const relativePath of entry.assets) {
    const destination = join(evidenceDir, ...relativePath.split('/'));
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(join(ROOT, relativePath), destination);
    rows.push(`${sha256File(destination)}  ${statSync(destination).size}  ${relativePath}`);
  }
  const manifestText = [
    `# CLOSURE-EVIDENCE manifest — v${entry.version} (${entry.unit})`,
    '# Fields, in order: sha256 | bytes | repo-relative source path',
    ...rows,
    '',
  ].join('\n');
  writeFileSync(join(stage, 'MANIFEST.txt'), manifestText, 'utf8');
  writeFileSync(join(stage, `RELEASE-NOTES-v${entry.version}.md`), notes, 'utf8');

  const name = `vantrilex-arsenal-v${entry.version}-evidence.tar.gz`;
  const path = join(scratch, name);
  const archived = run('tar', ['-czf', path, '-C', stage, '.']);
  if (!archived.ok) {
    throw new Error(`tar failed to package the evidence bundle: ${archived.stderr.trim() || archived.error || 'unknown error'}`);
  }
  return { name, path, bytes: statSync(path).size, sha256: sha256File(path), present: entry.assets, absent: [] };
}

/*
  buildClosureRecordAsset <entry> <scratch> <notes> — the surviving closure
  record. The record is one ledger line in an uncommitted live state file, so it
  is quoted from the worktree at build time. The cited line must exist and carry
  the manifest's fingerprint, or the run refuses: a moved ledger is a refused
  record, never a guessed one. Nothing is reconstructed.
*/
function buildClosureRecordAsset(entry, scratch, notes) {
  const sourcePath = join(ROOT, entry.record.file);
  if (!existsSync(sourcePath)) {
    throw new Error(`closure-record source ${entry.record.file} is absent from the worktree`);
  }
  const buffer = readFileSync(sourcePath);
  const lines = buffer.toString('utf8').split('\n');
  const cited = lines[entry.record.line - 1];
  if (typeof cited !== 'string' || cited.trim() === '') {
    throw new Error(`${entry.record.file}:${entry.record.line} is empty; the closure record cannot be quoted`);
  }
  if (!cited.includes(entry.record.must_contain)) {
    throw new Error(`${entry.record.file}:${entry.record.line} does not carry the expected fingerprint ${JSON.stringify(entry.record.must_contain)}; the ledger moved, so the record is refused rather than guessed`);
  }

  const stage = join(scratch, `bundle-v${entry.version}`);
  mkdirSync(stage, { recursive: true });
  const sourceSha = createHash('sha256').update(buffer).digest('hex');
  const recordText = [
    `# CLOSURE-RECORD — v${entry.version} (${entry.unit})`,
    '',
    `Source: \`${entry.record.file}\`, line ${entry.record.line} — the citation the approved map records.`,
    'That file is an uncommitted live state file. This passage was quoted from the worktree at build time and is reproduced verbatim below: nothing was edited, re-run or reconstructed.',
    `Source identity at build time: sha256 \`${sourceSha}\`, ${buffer.length} bytes.`,
    '',
    '## Ledger passage (verbatim)',
    '',
    cited,
    '',
  ].join('\n');
  writeFileSync(join(stage, 'CLOSURE-RECORD.md'), recordText, 'utf8');
  writeFileSync(join(stage, `RELEASE-NOTES-v${entry.version}.md`), notes, 'utf8');

  const generated = ['CLOSURE-RECORD.md', `RELEASE-NOTES-v${entry.version}.md`];
  const rows = generated.map((name) => {
    const file = join(stage, name);
    return `${sha256File(file)}  ${statSync(file).size}  ${name}`;
  });
  writeFileSync(
    join(stage, 'MANIFEST.txt'),
    [
      `# CLOSURE-RECORD manifest — v${entry.version} (${entry.unit})`,
      '# Fields, in order: sha256 | bytes | file in this bundle',
      ...rows,
      `# source: ${entry.record.file} line ${entry.record.line} (uncommitted live state file, quoted at build time) sha256=${sourceSha} bytes=${buffer.length}`,
      '',
    ].join('\n'),
    'utf8',
  );

  const name = `vantrilex-arsenal-v${entry.version}-closure-record.tar.gz`;
  const path = join(scratch, name);
  const archived = run('tar', ['-czf', path, '-C', stage, '.']);
  if (!archived.ok) {
    throw new Error(`tar failed to package the closure-record bundle: ${archived.stderr.trim() || archived.error || 'unknown error'}`);
  }
  return { name, path, bytes: statSync(path).size, sha256: sha256File(path), present: generated, absent: [] };
}

/* ---------- the real create path (never reached by a dry run) ---------- */

const GIT_IDENTITY = [
  '-c', 'user.name=vantrilex-release',
  '-c', 'user.email=release@vantrilex.local',
];

function createTag(tag, ref) {
  const created = git([...GIT_IDENTITY, 'tag', '-a', tag, '-m', tag, ref]);
  if (!created.ok) return { ok: false, detail: created.stderr.trim() || created.error || 'git tag failed' };
  const pushed = git(['push', 'origin', `refs/tags/${tag}`]);
  if (!pushed.ok) return { ok: false, detail: `git push of the tag failed: ${pushed.stderr.trim() || pushed.error}` };
  return { ok: true, detail: `${tag} created and pushed` };
}

function createRelease(tag, notes, assetPath, scratch) {
  const notesPath = join(scratch, `${tag}-notes.md`);
  writeFileSync(notesPath, notes, 'utf8');
  const created = run('gh', ['release', 'create', tag, '--title', tag, '--notes-file', notesPath, '--latest', assetPath]);
  if (!created.ok) return { ok: false, detail: created.stderr.trim() || created.error || 'gh release create failed' };
  return { ok: true, detail: `release ${tag} created with one asset` };
}

/* auditLine <six fields> — the same machine-readable schema the other release
   lanes write, so one log answers for all of them. */
export function auditLine(fields) {
  return [fields.version, fields.commit, fields.timestamp, fields.artifacts, fields.channels, fields.result].join(' | ');
}

function appendAudit(line) {
  mkdirSync(dirname(PATHS.audit), { recursive: true });
  if (!existsSync(PATHS.audit)) {
    appendFileSync(
      PATHS.audit,
      [
        '# AUTO-PUBLISH.log — one machine-readable line per auto-publish run.',
        '# Fields, in order: version | commit | timestamp (UTC) | artifacts | channels | result',
        '# result carries the gate verdict as a subfield: result=<verdict>;gate=<verdict>',
        '# Written by scripts/auto-publish.sh, scripts/self-publish.mjs, scripts/backfill-publish.mjs and .github/workflows/auto-publish.yml.',
        '',
      ].join('\n'),
      'utf8',
    );
  }
  appendFileSync(PATHS.audit, `${line}\n`, 'utf8');
  process.stdout.write(`${line}\n`);
}

function repoSlug() {
  if (typeof process.env.PUBLISH_REPO === 'string' && process.env.PUBLISH_REPO.trim() !== '') {
    return process.env.PUBLISH_REPO.trim();
  }
  const remote = git(['remote', 'get-url', 'origin']).stdout.trim();
  const match = /github\.com[/:]([^/]+\/[^/\s]+?)(?:\.git)?$/.exec(remote);
  return match === null ? 'unknown/unknown' : match[1];
}

/* ---------- one entry ---------- */

/*
  processEntry <entry> <context> — plan or publish exactly one manifest entry.
  Returns {status, tag, asset?, reason?}. Statuses: would-publish, published,
  skipped, held, failed. Nothing here reads the map's prose or runs a battery.
*/
function processEntry(entry, context) {
  const { log, dryRun, tags, scratch, repo, mapHash } = context;
  const tag = `v${entry.version}`;
  const action = planAction(entry, tags);
  const refLabel = entry.mode === 'commit' ? entry.ref : 'null (no committed source tree)';

  log(`--- v${entry.version} | ${entry.unit}`);
  log(`    mode=${entry.mode} tag=${tag} ref=${refLabel}`);

  if (action === 'refused-held') {
    log(`    REFUSED — status=held: ${entry.hold_reason}`);
    log('    nothing built, nothing created, no audit line (a held unit is not a publish).');
    return { status: 'held', tag };
  }
  if (action === 'skip-existing-tag') {
    log(`    SKIP — tag ${tag} already exists; nothing is created twice.`);
    return { status: 'skipped', tag };
  }

  let tagTarget = entry.ref;
  if (entry.mode === 'commit') {
    const reachable = git(['merge-base', '--is-ancestor', entry.ref, 'origin/main']).ok;
    log(`    commit present: yes; ancestor of origin/main: ${reachable ? 'yes' : 'NO (informational — the tag push publishes the commit itself)'}`);
  } else {
    // A tag must name a commit. An evidence unit has no commit of its own, so
    // the tag names the publication point (HEAD) and the notes state plainly
    // that the unit has no source tree. Nothing is invented.
    tagTarget = git(['rev-parse', 'HEAD']).stdout.trim();
    if (tagTarget === '') {
      log('    FAILED — cannot resolve HEAD as the publication point for an evidence tag');
      return { status: 'failed', tag, reason: 'HEAD unresolved' };
    }
    log(`    tag target: HEAD ${tagTarget} (publication point; the unit carries no source tree)`);
  }

  let asset;
  try {
    const notes = renderNotes(entry, mapHash);
    if (entry.mode === 'commit') asset = buildCommitAsset(entry, scratch);
    else if (entry.mode === 'evidence') asset = buildEvidenceAsset(entry, scratch, notes);
    else asset = buildClosureRecordAsset(entry, scratch, notes);
    if (entry.mode === 'commit') {
      log(`    asset=${asset.name} bytes=${asset.bytes} sha256=${asset.sha256}`);
      log(`    pathspec: ${asset.present.length} present, ${asset.absent.length} absent at the commit${asset.absent.length > 0 ? ` (${asset.absent.join(', ')})` : ''}`);
    } else if (entry.mode === 'evidence') {
      log(`    asset=${asset.name} bytes=${asset.bytes} sha256=${asset.sha256}`);
      log(`    evidence files: ${asset.present.length}/${entry.assets.length} present and packaged`);
    } else {
      log(`    asset=${asset.name} bytes=${asset.bytes} sha256=${asset.sha256}`);
      log(`    closure record: ${entry.record.file}:${entry.record.line} quoted verbatim (fingerprint verified); ${asset.present.length} generated file(s)`);
    }
    log(`    notes source: map ${entry.notes_ref} — as-closed quote (${entry.as_closed.length} chars) + ${entry.gaps.length} stated gap(s)`);
  } catch (error) {
    log(`    FAILED — ${errorText(error)}`);
    return { status: 'failed', tag, reason: errorText(error) };
  }

  const artifacts = `${asset.name} sha256=${asset.sha256} bytes=${asset.bytes}`;
  const channels = `github-release:${repo},git-tag:${tag}`;

  if (dryRun) {
    const line = auditLine({
      version: tag,
      commit: tagTarget,
      timestamp: context.now,
      artifacts,
      channels,
      result: `dry-run-would-publish;gate=as-closed;mode=${entry.mode}`,
    });
    log('    WOULD create the tag, create the release with the notes above, and upload the asset.');
    log(`    audit line (not appended in a dry run): ${line}`);
    return { status: 'would-publish', tag, asset };
  }

  const body = `${renderNotes(entry, mapHash)}\n${renderArtifactSection(entry, asset)}`;
  const tagResult = createTag(tag, tagTarget);
  if (!tagResult.ok) {
    log(`    FAILED — ${tagResult.detail}`);
    appendAudit(auditLine({ version: tag, commit: tagTarget, timestamp: context.now, artifacts, channels, result: `failed-tag;gate=as-closed;mode=${entry.mode}` }));
    return { status: 'failed', tag, reason: tagResult.detail };
  }
  const releaseResult = createRelease(tag, body, asset.path, scratch);
  if (!releaseResult.ok) {
    log(`    FAILED — ${releaseResult.detail}. The tag exists; a re-run skips it loudly instead of publishing twice.`);
    appendAudit(auditLine({ version: tag, commit: tagTarget, timestamp: context.now, artifacts, channels, result: `failed-release;gate=as-closed;mode=${entry.mode}` }));
    return { status: 'failed', tag, reason: releaseResult.detail };
  }
  appendAudit(auditLine({ version: tag, commit: tagTarget, timestamp: context.now, artifacts, channels, result: `published;gate=as-closed;mode=${entry.mode}` }));
  log(`    PUBLISHED ${tag}.`);
  return { status: 'published', tag, asset };
}

/* ---------- main ---------- */

function usage() {
  process.stdout.write(
    [
      'backfill-publish.mjs — §4 backfill publisher from the owner-approved map.',
      '',
      'Usage:',
      '  scripts/backfill-publish.mjs [--one <version>]',
      '',
      '  --one <version>  Process exactly one manifest entry (monitored publish).',
      '                   A held version is refused.',
      '',
      'Environment:',
      '  DRY_RUN=1|0            Default 1: build, print the plan, create nothing.',
      '  PUBLISH_REPO=owner/name Default: the origin remote slug (audit line only).',
      '',
      'Exit status:',
      '  0  planned (dry run), published, skipped, or held-and-refused in a full run.',
      '  1  refused or failed. Fail closed.',
    ].join('\n') + '\n',
  );
}

function main(argv) {
  if (argv.includes('-h') || argv.includes('--help')) {
    usage();
    return 0;
  }

  let one = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--one') {
      if (index + 1 >= argv.length) {
        process.stderr.write('error: --one needs a version\n');
        return 1;
      }
      one = argv[index + 1];
      index += 1;
      continue;
    }
    process.stderr.write(`error: unexpected argument "${arg}"\n`);
    usage();
    return 1;
  }

  const dryRun = (process.env.DRY_RUN ?? '1') !== '0';
  const log = (message) => process.stdout.write(`[backfill] ${message}\n`);

  if (!existsSync(PATHS.manifest)) {
    process.stderr.write(`[backfill] ERROR: manifest absent at ${PATHS.manifest}\n`);
    return 1;
  }
  const parsed = parseManifest(readFileSync(PATHS.manifest, 'utf8'));
  if (!parsed.ok) {
    process.stderr.write(`[backfill] ERROR: manifest refused — ${parsed.error}\n`);
    return 1;
  }
  const { manifest } = parsed;

  if (!existsSync(PATHS.map)) {
    process.stderr.write(`[backfill] ERROR: approved map absent at ${PATHS.map}\n`);
    return 1;
  }
  const mapHash = sha256File(PATHS.map);
  const drift = verifyMapHash(manifest, mapHash);
  if (!drift.ok) {
    process.stderr.write(`[backfill] ERROR: map drift — the executor refuses.\n`);
    process.stderr.write(`[backfill]   manifest expects ${drift.expected}\n`);
    process.stderr.write(`[backfill]   map on disk is  ${drift.actual}\n`);
    return 1;
  }
  log(`map hash verified: ${mapHash}`);
  log(`manifest: ${manifest.entries.length} entries, ${manifest.entries.filter((entry) => entry.status === 'ready').length} ready, ${manifest.entries.filter((entry) => entry.status === 'held').length} held`);
  log(`DRY_RUN=${dryRun ? '1 (nothing is created)' : '0 (LIVE — publishes)'}`);

  const entries = one === null ? manifest.entries : manifest.entries.filter((entry) => entry.version === one);
  if (entries.length === 0) {
    process.stderr.write(`[backfill] ERROR: version ${one} is not in the manifest\n`);
    return 1;
  }
  if (one !== null && entries[0].status === 'held') {
    log(`REFUSED — v${entries[0].version} is held: ${entries[0].hold_reason}`);
    return 1;
  }

  const scratch = mkdtempSync(join(tmpdir(), 'backfill-publish-'));
  process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));

  const tags = git(['tag', '--list', 'v*']).stdout.split('\n').map((line) => line.trim()).filter((line) => line !== '');
  const context = {
    log,
    dryRun,
    tags,
    scratch,
    repo: repoSlug(),
    mapHash,
    now: timestamp(),
  };

  const results = [];
  let failed = 0;
  for (const entry of entries) {
    const result = processEntry(entry, context);
    results.push(result);
    if (result.status === 'failed') failed += 1;
  }

  const count = (status) => results.filter((result) => result.status === status).length;
  log('');
  log(`PLAN (${dryRun ? 'DRY_RUN=1' : 'LIVE'}, ascending, ${one === null ? 'whole manifest' : `single entry ${one}`})`);
  for (const result of results) {
    const asset = result.asset ? `${result.asset.name} ${result.asset.bytes} B` : '—';
    log(`  ${result.status.padEnd(13)} ${result.tag.padEnd(7)} ${asset}`);
  }
  log('');
  log(`summary: ${count('would-publish')} would-publish, ${count('published')} published, ${count('skipped')} skipped, ${count('held')} held (refused by design), ${failed} failed`);
  if (dryRun) {
    log(`zero creates: no git tag, no git push, no gh invocation, no audit-log append (DRY_RUN=1).`);
  }

  if (failed > 0) {
    process.stderr.write(`[backfill] ERROR: ${failed} entr${failed === 1 ? 'y' : 'ies'} failed; nothing else was attempted for it.\n`);
    return 1;
  }
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main(process.argv.slice(2));
}
