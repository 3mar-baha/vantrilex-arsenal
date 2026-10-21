#!/usr/bin/env node
/**
 * self-publish.mjs — queue-driven self-publishing for phase and mission
 * closures (owner release ruling §1, §2, §8).
 *
 * The rule this script implements: a closed unit appends one entry to
 * `.opencode/release-queue.jsonl`; the next push to the default branch computes
 * that unit's version from the increment policy and the highest existing tag,
 * proves the repository battery at the exact queued commit, and only then
 * creates the tag and the release. A red gate creates nothing.
 *
 * Two lanes share `.github/workflows/auto-publish.yml` and never each other's
 * job: the asset lane (`scripts/auto-publish.sh`, triggered by a published
 * release) and this queue lane. See the workflow header for how §0 places them.
 *
 * Inputs, all read from disk at release time:
 *   .opencode/release-queue.jsonl        one JSON object per closed unit:
 *                                        {unit_type, scope, base_commit,
 *                                         status, published_version,
 *                                         published_at}
 *   registry/policies/release-policy.json the increment policy — the ONLY place
 *                                        an increment value lives
 *   .opencode/auto-release.enabled       the kill switch; absent ⇒ this whole
 *                                        path does nothing
 *
 * Usage:
 *   scripts/self-publish.mjs [--self-test] [-h | --help]
 *
 *   --self-test  Prove the four §6 behaviours (would publish, refuses on a red
 *                gate, skips an existing tag, does nothing without the switch)
 *                against injected dependencies. No git, no gh, no network, no
 *                write of any kind.
 *
 * Environment:
 *   DRY_RUN=1|0              Default 1. Dry-run reads, computes, runs the real
 *                            battery, builds and hashes the tarball, prints the
 *                            plan and appends the audit line — it creates no
 *                            tag, no release, and rewrites no queue entry.
 *   PUBLISH_REPO=owner/name  Default: the origin remote's slug.
 *   AUDIT_LOG=<path>         Default .opencode/audit/AUTO-PUBLISH.log.
 *   RELEASE_QUEUE=<path>     Default .opencode/release-queue.jsonl.
 *   RELEASE_POLICY=<path>    Default registry/policies/release-policy.json.
 *   AUTO_RELEASE_SWITCH=<path> Default .opencode/auto-release.enabled.
 *                            The four path overrides exist so the §6 dry-run
 *                            proofs run against fixture inputs instead of
 *                            editing the shipped queue, policy or switch. The
 *                            defaults above are the only production values, and
 *                            a switch path is still a presence check: pointing
 *                            it somewhere empty keeps the path disabled.
 *
 * Exit status:
 *   0  published, skipped (existing tag / already released at that commit),
 *      disabled by the kill switch, no pending entry, or a dry-run whose gate
 *      passed
 *   1  refused or failed — no base tag, unreadable queue or policy, a commit
 *      that is not an ancestor of HEAD, a red battery, or a failed create.
 *      Fail closed: a check that cannot be evaluated is a failed check.
 */

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(SCRIPT_PATH));

/* ---------- the shipped input paths ---------- */

function pathFromEnv(name, fallback) {
  const value = process.env[name];
  if (typeof value !== 'string' || value.trim() === '') return fallback;
  return isAbsolute(value) ? value : resolve(ROOT, value);
}

const PATHS = {
  queue: pathFromEnv('RELEASE_QUEUE', join(ROOT, '.opencode', 'release-queue.jsonl')),
  policy: pathFromEnv('RELEASE_POLICY', join(ROOT, 'registry', 'policies', 'release-policy.json')),
  audit: pathFromEnv('AUDIT_LOG', join(ROOT, '.opencode', 'audit', 'AUTO-PUBLISH.log')),
  switch: pathFromEnv('AUTO_RELEASE_SWITCH', join(ROOT, '.opencode', 'auto-release.enabled')),
};

/*
  The release tarball has exactly one shape. PACKAGE_PATHS mirrors the list in
  scripts/auto-publish.sh: a missing shipped path fails the run rather than
  producing a thinner archive than the release notes describe.
  PACKAGE_OPTIONAL_PATHS are paths the line still documents but a later commit
  may have removed: `kit` was deleted in S3 (catalog proofs replaced the lock),
  so it is packaged when the released commit still carries it and skipped, with
  a log line, when it does not. Historical commits therefore keep their shape
  and current commits keep a working archive.
*/
export const PACKAGE_PATHS = [
  'AGENTS.md', 'AI_GUIDE.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE', 'README.md',
  'README.ar.md', 'SECURITY.md',
  'registry', '.opencode', 'scripts', 'docs',
  '.editorconfig', '.gitattributes', '.gitignore', '.markdownlint.jsonc',
];

export const PACKAGE_OPTIONAL_PATHS = ['kit'];

const UNIT_TYPES = ['phase', 'mission'];
const STATUSES = ['pending', 'published'];
const COMPONENTS = ['major', 'minor', 'patch'];
const SEMVER_TAG_RE = /^v(\d+)\.(\d+)\.(\d+)$/;
const BASE_COMMIT_RE = /^[0-9a-f]{7,40}$/;
const QUEUE_KEYS = ['unit_type', 'scope', 'base_commit', 'status', 'published_version', 'published_at'];

/* ---------- the increment policy (§8.2: the single source) ---------- */

/*
  parsePolicy <text> — {ok: true, policy} | {ok: false, error}.
  The publisher applies whatever the policy says and refuses to guess: every
  unit type must name exactly one component to bump by a positive integer, and
  `cascade` (default true) decides whether a higher bump resets the lower
  components. No increment value appears in this file or in the workflow.
*/
export function parsePolicy(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    return { ok: false, error: `invalid JSON — ${error.message}` };
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'the policy must be a JSON object' };
  }
  const increments = parsed.increments;
  if (increments === null || typeof increments !== 'object' || Array.isArray(increments)) {
    return { ok: false, error: 'the policy must carry an "increments" object naming the phase and mission increments' };
  }
  const normalized = {};
  for (const unit of UNIT_TYPES) {
    const spec = increments[unit];
    if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) {
      return { ok: false, error: `increments.${unit} must be an object such as {"patch": 1}` };
    }
    const keys = Object.keys(spec);
    const named = keys.filter((key) => COMPONENTS.includes(key));
    if (named.length !== 1 || keys.length !== 1) {
      return { ok: false, error: `increments.${unit} must name exactly one of ${COMPONENTS.join(', ')}, got ${JSON.stringify(spec)}` };
    }
    const by = spec[named[0]];
    if (!Number.isInteger(by) || by < 1) {
      return { ok: false, error: `increments.${unit}.${named[0]} must be a positive integer, got ${JSON.stringify(by)}` };
    }
    normalized[unit] = { component: named[0], by };
  }
  let cascade = true;
  if (Object.prototype.hasOwnProperty.call(parsed, 'cascade')) {
    if (typeof parsed.cascade !== 'boolean') {
      return { ok: false, error: `"cascade" must be true or false, got ${JSON.stringify(parsed.cascade)}` };
    }
    cascade = parsed.cascade;
  }
  return { ok: true, policy: { increments: normalized, cascade } };
}

/*
  nextVersion <version> <policy> <unitType> — {ok: true, version} | {ok: false, error}.
  The arithmetic the law names: bump the policy's component for this unit type,
  and with cascade on, reset every component below it to zero.
*/
export function nextVersion(version, policy, unitType) {
  const spec = policy.increments[unitType];
  if (!spec) {
    return { ok: false, error: `the policy has no increment for unit type "${unitType}"` };
  }
  const next = { major: version.major, minor: version.minor, patch: version.patch };
  next[spec.component] += spec.by;
  if (policy.cascade) {
    if (spec.component === 'major') {
      next.minor = 0;
      next.patch = 0;
    } else if (spec.component === 'minor') {
      next.patch = 0;
    }
  }
  return { ok: true, version: { ...next, tag: `v${next.major}.${next.minor}.${next.patch}` } };
}

/* ---------- the queue ---------- */

/*
  parseQueue <text> — {ok: true, entries} | {ok: false, error}.
  One JSON object per line, in closure order. A published entry must name the
  version and the UTC timestamp it was published with; anything else fails
  closed instead of being repaired by guesswork.
*/
export function parseQueue(text) {
  const lines = text.split('\n');
  const entries = [];
  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index].trim();
    if (raw === '') continue;
    const where = `line ${index + 1}`;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return { ok: false, error: `${where}: invalid JSON — ${error.message}` };
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ok: false, error: `${where}: each line must be a JSON object` };
    }
    for (const key of QUEUE_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(parsed, key)) {
        return { ok: false, error: `${where}: missing "${key}" (expected ${QUEUE_KEYS.join(', ')})` };
      }
    }
    if (!UNIT_TYPES.includes(parsed.unit_type)) {
      return { ok: false, error: `${where}: unit_type must be one of ${UNIT_TYPES.join(', ')}, got ${JSON.stringify(parsed.unit_type)}` };
    }
    if (typeof parsed.scope !== 'string' || parsed.scope.trim() === '') {
      return { ok: false, error: `${where}: scope must be a non-empty string — it is the release notes` };
    }
    if (typeof parsed.base_commit !== 'string' || !BASE_COMMIT_RE.test(parsed.base_commit)) {
      return { ok: false, error: `${where}: base_commit must be a lowercase hex commit id, got ${JSON.stringify(parsed.base_commit)}` };
    }
    if (!STATUSES.includes(parsed.status)) {
      return { ok: false, error: `${where}: status must be one of ${STATUSES.join(', ')}, got ${JSON.stringify(parsed.status)}` };
    }
    if (parsed.published_version !== null && (typeof parsed.published_version !== 'string' || !SEMVER_TAG_RE.test(parsed.published_version))) {
      return { ok: false, error: `${where}: published_version must be null or a vX.Y.Z tag, got ${JSON.stringify(parsed.published_version)}` };
    }
    if (parsed.published_at !== null && (typeof parsed.published_at !== 'string' || parsed.published_at.trim() === '')) {
      return { ok: false, error: `${where}: published_at must be null or a UTC timestamp string, got ${JSON.stringify(parsed.published_at)}` };
    }
    if (parsed.status === 'published' && (parsed.published_version === null || parsed.published_at === null)) {
      return { ok: false, error: `${where}: a published entry must carry both published_version and published_at` };
    }
    entries.push({ line: index + 1, entry: parsed });
  }
  return { ok: true, entries };
}

/* selectPending <entries> — the oldest pending entry, or null. FIFO: a stuck
   entry holds the line, so it surfaces instead of being skipped silently. */
export function selectPending(entries) {
  return entries.find(({ entry }) => entry.status === 'pending') ?? null;
}

/*
  markPublished <text> <record> <version> <at> — the queue text with exactly
  that one line re-serialised. Every other line stays byte-identical. The three
  fields already exist in a valid entry, so key order is preserved and any
  extra field a human added survives.
*/
export function markPublished(text, record, version, at) {
  const lines = text.split('\n');
  const updated = {
    ...record.entry,
    status: 'published',
    published_version: version,
    published_at: at,
  };
  lines[record.line - 1] = JSON.stringify(updated);
  return lines.join('\n');
}

/* ---------- versions and tags ---------- */

/* parseVersion <tag> — {major, minor, patch} for a strict vX.Y.Z tag, else null.
   Strict on purpose: the live tag list carries `v7.5` (the 0.7.5 release under
   a two-component name), and reading that as 7.5.0 would move the whole line. */
export function parseVersion(tag) {
  const match = SEMVER_TAG_RE.exec(tag);
  if (match === null) return null;
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
}

function compareVersions(a, b) {
  for (const component of COMPONENTS) {
    if (a[component] !== b[component]) return a[component] < b[component] ? -1 : 1;
  }
  return 0;
}

/* highestVersion <tags> — the highest strict vX.Y.Z tag, or null. This is the
   base the next number is computed from, never a hard-coded number. */
export function highestVersion(tags) {
  let best = null;
  for (const tag of tags) {
    const version = parseVersion(tag);
    if (version === null) continue;
    if (best === null || compareVersions(version, best.version) > 0) best = { tag, version };
  }
  return best;
}

/* ---------- the release decision ---------- */

/*
  planEntry <{entry, policy, tags, tagsAtCommit}> — the pure decision:
    publish                the next number, computed from the highest tag
    skip-already-released  a strict vX.Y.Z tag already points at this entry's
                           commit — a previous run tagged and then died before
                           marking the queue, or the commit was released
                           another way. Nothing is created twice.
    blocked                no base tag, or no policy increment for this unit type
  The computed tag itself cannot already exist: it is always higher than the
  highest tag, so the idempotency that matters is "this commit is tagged".
  Two runs racing the same computed number are stopped by the workflow's
  single-flight group, and then by git itself, which refuses a second tag with
  the same name.
*/
export function planEntry({ entry, policy, tags, tagsAtCommit }) {
  const highest = highestVersion(tags);
  if (highest === null) {
    return {
      action: 'blocked',
      reason: 'no-existing-tag',
      detail: 'no tag of the form vX.Y.Z exists, so the next number cannot be computed from the line',
    };
  }
  const released = tagsAtCommit(entry.base_commit).filter((tag) => parseVersion(tag) !== null);
  if (released.length > 0) {
    return { action: 'skip-already-released', tag: released[0], version: parseVersion(released[0]), highest };
  }
  const next = nextVersion(highest.version, policy, entry.unit_type);
  if (!next.ok) {
    return { action: 'blocked', reason: 'policy-incomplete', detail: next.error };
  }
  return { action: 'publish', tag: next.version.tag, version: next.version, highest, unit: entry.unit_type };
}

/* assetName <tag> — the one tarball name per release, same shape as the asset
   lane so both paths ship an identically named distributable. */
export function assetName(tag) {
  return `vantrilex-arsenal-${tag}.tar.gz`;
}

/*
  renderNotes — the release notes come from the queue entry's scope summary,
  never from a template the operator has to fill twice. The body is the scope
  verbatim plus the as-run evidence, so a release says what it was and how it
  was proven.
*/
export function renderNotes({ record, plan, sha, batteryLines, asset, repo }) {
  const { entry } = record;
  return [
    `## ${plan.tag} — ${entry.unit_type} closure`,
    '',
    entry.scope,
    '',
    '### Verification',
    '',
    `Battery re-run at \`${sha}\` (the queued closure commit) by the self-publish gate:`,
    '',
    ...batteryLines.map((line) => `- ${line}`),
    '',
    '### Artifact',
    '',
    `\`${asset.name}\` — sha256 \`${asset.sha256}\`, ${asset.bytes} bytes, built by \`git archive\` from the tagged commit.`,
    '',
    '### Release record',
    '',
    `- queue entry ${record.line}: unit_type=${entry.unit_type}, base_commit=${entry.base_commit}`,
    `- number computed from the highest existing tag \`${plan.highest.tag}\` by \`registry/policies/release-policy.json\``,
    `- channel: github-release:${repo}, git-tag:${plan.tag}`,
    '',
  ].join('\n');
}

/* auditLine <six fields> — the same machine-readable schema the asset lane
   writes, so one log answers for both lanes. */
export function auditLine(fields) {
  return [fields.version, fields.commit, fields.timestamp, fields.artifacts, fields.channels, fields.result].join(' | ');
}

/* ---------- the orchestrated run ---------- */

/*
  selfPublish <input> — the whole path as one testable function.
  input: {queueText, policyText, dryRun, switchPresent, repo, tags, now,
          tagsAtCommit, deps}
  deps:  {log, battery, buildAsset, createTag, createRelease, appendAudit,
          writeQueue, commitBack, commitReachable}
  Returns {exitCode, action, tag?, reason?}. Every side effect goes through
  deps, so --self-test can prove the four behaviours without touching git,
  gh, the network or the disk.
*/
export function selfPublish(input) {
  const { dryRun, switchPresent, repo, tags, now, tagsAtCommit, deps } = input;
  const log = deps.log;

  // 1. The kill switch gates this path and nothing else. Absent ⇒ nothing
  //    happens: no tag, no release, no queue rewrite, no audit line.
  if (!switchPresent) {
    log('self-publish disabled: .opencode/auto-release.enabled is absent (the owner enables this path; the file is never created by a script).');
    return { exitCode: 0, action: 'disabled' };
  }

  // 2. The queue. No pending entry is the normal steady state, not an error.
  const queue = parseQueue(input.queueText);
  if (!queue.ok) {
    log(`ERROR: queue unreadable — ${queue.error}`);
    deps.appendAudit(auditLine({ version: '-', commit: '-', timestamp: now(), artifacts: 'none', channels: `github-release:${repo}`, result: 'refused-queue;gate=not-evaluated' }));
    return { exitCode: 1, action: 'refused-queue', reason: queue.error };
  }
  const record = selectPending(queue.entries);
  if (record === null) {
    log('no pending queue entry; nothing to self-publish.');
    return { exitCode: 0, action: 'no-pending-entry' };
  }
  const entry = record.entry;
  log(`pending entry ${record.line}: unit_type=${entry.unit_type} base_commit=${entry.base_commit}`);

  // 3. The policy. It decides the number, so an unreadable policy refuses the
  //    release instead of falling back to anything.
  const policy = parsePolicy(input.policyText);
  if (!policy.ok) {
    log(`ERROR: release policy unreadable — ${policy.error}`);
    deps.appendAudit(auditLine({ version: '-', commit: entry.base_commit, timestamp: now(), artifacts: 'none', channels: `github-release:${repo}`, result: 'refused-policy;gate=not-evaluated' }));
    return { exitCode: 1, action: 'refused-policy', reason: policy.error };
  }

  // 4. Number, idempotency and the already-released arm. Skips are silent
  //    no-ops in the audit log: nothing was created, so nothing is recorded.
  const plan = planEntry({ entry, policy: policy.policy, tags, tagsAtCommit });
  if (plan.action === 'skip-already-released') {
    log(`skip: ${plan.tag} already sits on ${entry.base_commit}, so this entry was released before the queue caught up; nothing is created.`);
    return { exitCode: 0, action: 'skip-already-released', tag: plan.tag };
  }
  if (plan.action === 'blocked') {
    log(`ERROR: cannot compute the next number — ${plan.detail} (${plan.reason})`);
    deps.appendAudit(auditLine({ version: '-', commit: entry.base_commit, timestamp: now(), artifacts: 'none', channels: `github-release:${repo}`, result: `refused-number;gate=not-evaluated;reason=${plan.reason}` }));
    return { exitCode: 1, action: 'blocked', reason: plan.reason };
  }

  const sha = entry.base_commit;
  log(`plan: ${plan.tag} = ${plan.highest.tag} + policy.increments.${entry.unit_type} (cascade=${policy.policy.cascade})`);
  log(`plan: release point ${sha} (the queued closure commit), asset ${assetName(plan.tag)}`);
  log(`plan: release notes = queue entry ${record.line} scope, ${entry.scope.length} characters`);

  // 5. The exact commit: it must be in this checkout and reachable from the
  //    pushed HEAD, or the release would describe a tree nobody can fetch.
  if (!deps.commitReachable(sha)) {
    log(`ERROR: ${sha} is not a commit reachable from HEAD in this checkout; refusing to release it.`);
    deps.appendAudit(auditLine({ version: plan.tag, commit: sha, timestamp: now(), artifacts: 'none', channels: `github-release:${repo},git-tag:${plan.tag}`, result: 'refused-commit;gate=not-evaluated' }));
    return { exitCode: 1, action: 'refused-commit' };
  }

  // 6. Verify before create. The battery runs against the extracted commit,
  //    never the worktree, and every check is evaluated so a refusal names all
  //    of them.
  const battery = deps.battery(sha);
  for (const line of battery.lines) log(`battery: ${line}`);
  if (!battery.ok) {
    const failures = battery.lines.filter((line) => line.startsWith('FAIL')).map((line) => line.replace(/^FAIL\((.*)\)$/, '$1'));
    log(`ERROR: gate not proven — nothing is created: ${failures.join(', ')}`);
    deps.appendAudit(auditLine({ version: plan.tag, commit: sha, timestamp: now(), artifacts: 'none', channels: `github-release:${repo},git-tag:${plan.tag}`, result: `refused-verification;gate=FAIL(${failures.join(' ')})` }));
    return { exitCode: 1, action: 'refused-verification', reason: failures.join(', ') };
  }
  log('gate PASS');

  // 7. The asset, built from the tagged commit. Deterministic for a commit, so
  //    a re-run rebuilds identical bytes and an uploaded name stays unique. A
  //    shipped path missing at that commit refuses here, before any tag exists.
  let asset;
  try {
    asset = deps.buildAsset(sha, plan.tag);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    log(`ERROR: ${detail}. Nothing is created.`);
    deps.appendAudit(auditLine({ version: plan.tag, commit: sha, timestamp: now(), artifacts: 'none', channels: `github-release:${repo},git-tag:${plan.tag}`, result: 'refused-package;gate=PASS' }));
    return { exitCode: 1, action: 'refused-package', reason: detail };
  }
  log(`built ${asset.name} (${asset.bytes} bytes, sha256 ${asset.sha256})`);
  if (Array.isArray(asset.optional) && asset.optional.length > 0) {
    log(`packaged optional path(s) this commit still carries: ${asset.optional.join(', ')}`);
  }
  const notes = renderNotes({ record, plan, sha, batteryLines: battery.lines, asset, repo });
  const artifacts = `${asset.name} sha256=${asset.sha256} bytes=${asset.bytes}`;
  const channels = `github-release:${repo},git-tag:${plan.tag}`;

  // 8. Dry-run reports exactly what a live run would create.
  if (dryRun) {
    log(`DRY RUN — would create tag ${plan.tag} at ${sha}, create the release with the notes above, upload ${asset.name}, and mark queue entry ${record.line} published.`);
    deps.appendAudit(auditLine({ version: plan.tag, commit: sha, timestamp: now(), artifacts, channels, result: `dry-run-would-publish;gate=PASS;unit=${entry.unit_type};entry=${record.line}` }));
    return { exitCode: 0, action: 'dry-run-would-publish', tag: plan.tag };
  }

  // 9. Create. The tag first, then the release: a release is never allowed to
  //    exist without the tag that names its tree.
  const tagResult = deps.createTag(plan.tag, sha);
  if (!tagResult.ok) {
    log(`ERROR: tag ${plan.tag} was not created or pushed — ${tagResult.detail}. Nothing else was touched.`);
    deps.appendAudit(auditLine({ version: plan.tag, commit: sha, timestamp: now(), artifacts, channels, result: 'failed-tag;gate=PASS' }));
    return { exitCode: 1, action: 'failed-tag', reason: tagResult.detail };
  }
  const releaseResult = deps.createRelease(plan.tag, notes, asset.path ?? asset.name);
  if (!releaseResult.ok) {
    log(`ERROR: release ${plan.tag} failed — ${releaseResult.detail}. The tag exists; the queue entry stays pending so a re-run skips it loudly instead of publishing twice.`);
    deps.appendAudit(auditLine({ version: plan.tag, commit: sha, timestamp: now(), artifacts, channels, result: 'failed-release;gate=PASS' }));
    return { exitCode: 1, action: 'failed-release', reason: releaseResult.detail };
  }

  // 10. Record it: queue entry published, one audit line, then the scoped
  //     commit-back so the queue never drifts from the tags it produced.
  deps.writeQueue(markPublished(input.queueText, record, plan.tag, now()));
  deps.appendAudit(auditLine({ version: plan.tag, commit: sha, timestamp: now(), artifacts, channels, result: `self-published;gate=PASS;unit=${entry.unit_type};entry=${record.line}` }));
  const back = deps.commitBack(plan.tag, entry.unit_type);
  if (!back.ok) {
    log(`ERROR: ${plan.tag} is published, but the queue update could not be committed — ${back.detail}. The next run skips this entry as already released; fix the queue by hand.`);
    return { exitCode: 1, action: 'queue-update-failed', tag: plan.tag };
  }
  log(`published ${plan.tag}; queue entry ${record.line} marked published and committed back (${back.detail}).`);
  return { exitCode: 0, action: 'published', tag: plan.tag };
}

/* ---------- real dependencies ---------- */

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, ...options });
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

/* tscCommand — the pinned checker without a shell: the local typescript
   package's JS entry when it is installed, otherwise npx. Both are run through
   node so Windows and Linux behave the same. */
function tscCommand() {
  const local = join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc');
  if (existsSync(local)) return { command: process.execPath, prefix: [local] };
  return { command: 'npx', prefix: ['--yes', '-p', 'typescript@5', 'tsc'] };
}

/*
  battery <sha> <scratch> — the five named checks, re-run against the tree
  extracted from that commit. Prints one PASS(label)/FAIL(label) line per check
  and returns {ok, lines}. Absent tooling is a FAIL, never a skip: the publish
  gate may not read a skipped check as a passing one.
*/
function battery(sha, scratch) {
  const lines = [];
  const tree = join(scratch, 'tree');
  const logs = join(scratch, 'logs');
  mkdirSync(tree, { recursive: true });
  mkdirSync(logs, { recursive: true });

  const archive = run('git', ['-C', ROOT, 'archive', '--format=tar', '--output=' + join(scratch, 'tree.tar'), sha]);
  if (!archive.ok) {
    return { ok: false, lines: ['FAIL(extract-commit)'] };
  }
  const untar = run('tar', ['-xf', join(scratch, 'tree.tar'), '-C', tree]);
  if (!untar.ok) {
    return { ok: false, lines: ['FAIL(extract-commit:tar)'] };
  }

  const checks = [
    { label: 'generate-catalog', script: 'scripts/generate-catalog-json.mjs', args: ['--check'] },
    { label: 'verify-registry', script: 'scripts/verify-registry.mjs', args: [] },
    { label: 'verify-skills', script: 'scripts/verify-skills.mjs', args: [] },
    { label: 'verify-catalog', script: 'scripts/verify-catalog.mjs', args: [] },
  ];

  let ok = true;
  for (const check of checks) {
    const logPath = join(logs, `${check.label}.log`);
    if (!existsSync(join(tree, check.script))) {
      lines.push(`FAIL(${check.label}:absent)`);
      ok = false;
      continue;
    }
    const result = run(process.execPath, [check.script, ...check.args], { cwd: tree });
    writeFileSync(logPath, `${result.stdout}${result.stderr}`, 'utf8');
    if (result.ok) {
      lines.push(`PASS(${check.label})`);
      continue;
    }
    lines.push(`FAIL(${check.label})`);
    ok = false;
    const tail = `${result.stdout}${result.stderr}`.trim().split('\n').slice(-6).join('\n');
    if (tail !== '') process.stderr.write(`${tail}\n`);
  }

  const tscLog = join(logs, 'tsc.log');
  if (!existsSync(join(tree, 'tsconfig.json'))) {
    lines.push('FAIL(tsc:tsconfig-absent)');
    ok = false;
  } else {
    const tsc = tscCommand();
    const result = run(tsc.command, [...tsc.prefix, '--noEmit', '-p', 'tsconfig.json'], { cwd: tree });
    writeFileSync(tscLog, `${result.stdout}${result.stderr}`, 'utf8');
    if (result.ok) {
      lines.push('PASS(tsc)');
    } else {
      lines.push(result.error === null ? 'FAIL(tsc)' : 'FAIL(tsc:unavailable)');
      ok = false;
      const tail = `${result.stdout}${result.stderr}`.trim().split('\n').slice(-6).join('\n');
      if (tail !== '') process.stderr.write(`${tail}\n`);
    }
  }
  return { ok, lines };
}

/* buildAsset <sha> <tag> <scratch> — deterministic tarball, sha256 and size.
   Every required path must exist at that commit; an optional path is added
   only when the commit still carries it. */
function buildAsset(sha, tag, scratch) {
  const missing = PACKAGE_PATHS.filter((path) => !git(['cat-file', '-e', `${sha}:${path}`]).ok);
  if (missing.length > 0) {
    throw new Error(`packaged path(s) absent at ${sha}: ${missing.join(' ')}`);
  }
  const optional = PACKAGE_OPTIONAL_PATHS.filter((path) => git(['cat-file', '-e', `${sha}:${path}`]).ok);
  const name = assetName(tag);
  const path = join(scratch, name);
  const archive = run('git', ['-C', ROOT, 'archive', '--format=tar.gz', '--output=' + path, sha, '--', ...PACKAGE_PATHS, ...optional]);
  if (!archive.ok) {
    throw new Error(`git archive failed for ${sha}: ${archive.stderr.trim() || archive.error}`);
  }
  const bytes = statSync(path).size;
  const sha256 = createHash('sha256').update(readFileSync(path)).digest('hex');
  return { name, path, sha256, bytes, optional };
}

const GIT_IDENTITY = [
  '-c', 'user.name=github-actions[bot]',
  '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com',
];

function createTag(tag, sha) {
  const created = git([...GIT_IDENTITY, 'tag', '-a', tag, '-m', tag, sha]);
  if (!created.ok) return { ok: false, detail: created.stderr.trim() || created.error || 'git tag failed' };
  const pushed = git(['push', 'origin', `refs/tags/${tag}`]);
  if (!pushed.ok) return { ok: false, detail: `git push of the tag failed: ${pushed.stderr.trim() || pushed.error}` };
  return { ok: true, detail: `${tag} created and pushed` };
}

function createRelease(tag, notes, assetPath, scratch) {
  const notesPath = join(scratch, `${tag}-notes.md`);
  writeFileSync(notesPath, notes, 'utf8');
  const created = run('gh', ['release', 'create', tag, '--title', tag, '--notes-file', notesPath, assetPath]);
  if (!created.ok) return { ok: false, detail: created.stderr.trim() || created.error || 'gh release create failed' };
  const latest = run('gh', ['release', 'edit', tag, '--latest']);
  if (!latest.ok) return { ok: false, detail: `release created but marking it latest failed: ${latest.stderr.trim() || latest.error}` };
  return { ok: true, detail: `release ${tag} created with one asset` };
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
        '# Written by scripts/auto-publish.sh, scripts/self-publish.mjs and .github/workflows/auto-publish.yml.',
        '',
      ].join('\n'),
      'utf8',
    );
  }
  appendFileSync(PATHS.audit, `${line}\n`, 'utf8');
  process.stdout.write(`${line}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\`\`\`text\n${line}\n\`\`\`\n`, 'utf8');
  }
}

/* commitBack — the scoped queue commit. Only the queue and the audit log are
   staged, so the workflow token can never sweep unrelated work into main. */
function commitBack(tag, unitType) {
  const paths = [relative(ROOT, PATHS.queue).split('\\').join('/'), relative(ROOT, PATHS.audit).split('\\').join('/')];
  const staged = git(['add', '--', ...paths]);
  if (!staged.ok) return { ok: false, detail: staged.stderr.trim() || 'git add failed' };
  const committed = git([...GIT_IDENTITY, 'commit', '-m', `chore(release): mark ${unitType} closure ${tag} published`]);
  if (!committed.ok) return { ok: false, detail: committed.stderr.trim() || 'git commit failed' };
  const branch = process.env.GITHUB_REF_NAME
    || git(['rev-parse', '--abbrev-ref', 'HEAD']).stdout.trim();
  const pushed = git(['push', 'origin', `HEAD:${branch}`]);
  if (!pushed.ok) return { ok: false, detail: `git push failed: ${pushed.stderr.trim() || pushed.error}` };
  return { ok: true, detail: `pushed to ${branch}` };
}

function repoSlug() {
  if (typeof process.env.PUBLISH_REPO === 'string' && process.env.PUBLISH_REPO.trim() !== '') {
    return process.env.PUBLISH_REPO.trim();
  }
  const remote = git(['remote', 'get-url', 'origin']).stdout.trim();
  const match = /github\.com[/:]([^/]+\/[^/\s]+?)(?:\.git)?$/.exec(remote);
  return match === null ? 'unknown/unknown' : match[1];
}

/* ---------- the four §6 proofs ---------- */

const FIXTURE_POLICY = JSON.stringify({
  increments: { phase: { patch: 1 }, mission: { minor: 1 } },
  cascade: true,
});

const FIXTURE_QUEUE = `${JSON.stringify({
  unit_type: 'phase',
  scope: 'Phase 1 closes: catalog-only proofs, dual-run harness, and the first injected slice.',
  base_commit: '1111111111111111111111111111111111111111',
  status: 'pending',
  published_version: null,
  published_at: null,
})}\n`;

const FIXTURE_NOW = '2026-10-21T12:00:00Z';

function fakeDeps({ batteryOk = true } = {}) {
  const calls = [];
  const lines = [];
  const tagsAtCommit = (sha) => {
    calls.push(['tagsAtCommit', sha]);
    return [];
  };
  const deps = {
    log: (message) => lines.push(message),
    battery: (sha) => {
      calls.push(['battery', sha]);
      return {
        ok: batteryOk,
        lines: batteryOk
          ? ['PASS(generate-catalog)', 'PASS(verify-registry)', 'PASS(verify-skills)', 'PASS(verify-catalog)', 'PASS(tsc)']
          : ['PASS(generate-catalog)', 'FAIL(verify-registry)', 'PASS(verify-skills)', 'PASS(verify-catalog)', 'PASS(tsc)'],
      };
    },
    buildAsset: (sha, tag) => {
      calls.push(['buildAsset', tag]);
      return { name: assetName(tag), path: `${tag}.tar.gz`, sha256: 'a'.repeat(64), bytes: 4242 };
    },
    createTag: (tag, sha) => {
      calls.push(['createTag', tag, sha]);
      return { ok: true, detail: 'tag created and pushed' };
    },
    createRelease: (tag) => {
      calls.push(['createRelease', tag]);
      return { ok: true, detail: 'release created' };
    },
    appendAudit: (line) => calls.push(['appendAudit', line]),
    writeQueue: (text) => calls.push(['writeQueue', text]),
    commitBack: (tag) => {
      calls.push(['commitBack', tag]);
      return { ok: true, detail: 'pushed to main' };
    },
    commitReachable: (sha) => {
      calls.push(['commitReachable', sha]);
      return true;
    },
  };
  return { deps, calls, lines, tagsAtCommit };
}

function runFixture(overrides = {}, depsOptions = {}) {
  const fake = fakeDeps(depsOptions);
  const input = {
    queueText: FIXTURE_QUEUE,
    policyText: FIXTURE_POLICY,
    dryRun: true,
    switchPresent: true,
    repo: '3mar-baha/vantrilex-arsenal',
    tags: ['v0.7.7'],
    now: () => FIXTURE_NOW,
    tagsAtCommit: overrides.tagsAtCommit ?? fake.tagsAtCommit,
    ...overrides,
    deps: { ...fake.deps, ...(overrides.deps ?? {}) },
  };
  return { result: selfPublish(input), ...fake };
}

export function selfTest(log = (message) => process.stdout.write(`${message}\n`)) {
  const results = [];
  const check = (name, condition, detail) => {
    results.push({ name, ok: Boolean(condition), detail });
  };
  const creates = (calls) => calls.filter(([name]) => name === 'createTag' || name === 'createRelease');

  // (a) pending entry + green tree ⇒ WOULD publish.
  {
    const { result, calls, lines } = runFixture();
    const notes = lines.join('\n');
    log('[proof a] pending entry + green tree ⇒ WOULD publish');
    log(`  computed version : ${result.tag}`);
    log('  notes source     : queue entry 1 scope — the entry\'s scope summary IS the release notes');
    log(`  asset name       : ${assetName(result.tag)}`);
    log(`  creates          : ${creates(calls).length} (dry run: none)`);
    log(`  audit line       : ${calls.filter(([name]) => name === 'appendAudit').map(([, line]) => line).join('') || 'none'}`);
    log('  transcript:');
    for (const line of lines) log(`    ${line}`);
    check('(a) would publish v0.7.8', result.exitCode === 0 && result.action === 'dry-run-would-publish' && result.tag === 'v0.7.8', JSON.stringify(result));
    check('(a) names the notes source and the asset', notes.includes('queue entry 1 scope') && notes.includes('vantrilex-arsenal-v0.7.8.tar.gz'), 'transcript');
    check('(a) creates nothing in dry run', creates(calls).length === 0, `${creates(calls).length} create calls`);
  }

  // (b) red tree ⇒ refuses.
  {
    const { result, calls, lines } = runFixture({}, { batteryOk: false });
    log('');
    log('[proof b] red tree ⇒ refuses');
    log(`  action           : ${result.action}`);
    log(`  reason           : ${result.reason}`);
    log(`  creates          : ${creates(calls).length}`);
    log(`  queue writes     : ${calls.filter(([name]) => name === 'writeQueue').length}`);
    log(`  audit line       : ${calls.filter(([name]) => name === 'appendAudit').map(([, line]) => line).join('') || 'none'}`);
    for (const line of lines) log(`    ${line}`);
    check('(b) refuses with a failing battery', result.exitCode === 1 && result.action === 'refused-verification', JSON.stringify(result));
    check('(b) creates nothing and rewrites no queue', creates(calls).length === 0 && calls.filter(([name]) => name === 'writeQueue').length === 0, 'no side effects');
    check('(b) the audit line names the failing check', calls.some(([name, line]) => name === 'appendAudit' && String(line).includes('refused-verification;gate=FAIL(verify-registry)')), 'audit');
  }

  // (c) existing tag ⇒ skips.
  {
    const tagged = runFixture({
      tagsAtCommit: () => ['v0.7.7'],
    });
    log('');
    log('[proof c] existing tag ⇒ skips');
    log(`  action           : ${tagged.result.action} (${tagged.result.tag})`);
    log(`  creates          : ${creates(tagged.calls).length}`);
    log(`  queue writes     : ${tagged.calls.filter(([name]) => name === 'writeQueue').length}`);
    log(`  transcript       : ${tagged.lines.join(' | ')}`);
    const probe = runFixture({ tagsAtCommit: () => ['v0.0.99-dryrun.1'] });
    log(`  non-tag probe    : a dry-run tag on the commit does not block a release (${probe.result.action} ${probe.result.tag})`);
    check('(c) a tag on the queued commit skips the entry', tagged.result.exitCode === 0 && tagged.result.action === 'skip-already-released' && creates(tagged.calls).length === 0, JSON.stringify(tagged.result));
    check('(c) skipping rewrites no queue entry', tagged.calls.filter(([name]) => name === 'writeQueue').length === 0, 'no queue write');
    check('(c) a dry-run tag on the commit does not block', probe.result.action === 'dry-run-would-publish', probe.result.action);
  }

  // (d) switch absent ⇒ no self-publish.
  {
    const { result, calls, lines } = runFixture({ switchPresent: false });
    log('');
    log('[proof d] kill switch absent ⇒ nothing happens');
    log(`  action           : ${result.action}`);
    log(`  battery calls    : ${calls.filter(([name]) => name === 'battery').length}`);
    log(`  creates          : ${creates(calls).length}`);
    log(`  audit writes     : ${calls.filter(([name]) => name === 'appendAudit').length}`);
    log(`  transcript       : ${lines.join(' | ')}`);
    check('(d) absent switch disables the path', result.exitCode === 0 && result.action === 'disabled', JSON.stringify(result));
    check('(d) nothing is read, created or recorded', calls.length === 0, `${calls.length} dependency call(s)`);
  }

  // The policy is the only source of an increment: restyle it and the line moves.
  {
    const restyled = JSON.stringify({ increments: { phase: { minor: 2 }, mission: { major: 1 } }, cascade: true });
    const phase = runFixture({ policyText: restyled });
    const mission = runFixture({ policyText: restyled, queueText: JSON.stringify({ ...JSON.parse(FIXTURE_QUEUE.trim()), unit_type: 'mission' }) + '\n' });
    const flat = runFixture({ policyText: JSON.stringify({ increments: { phase: { major: 1 }, mission: { minor: 1 } }, cascade: false }) });
    log('');
    log('[proof e] a restyled policy moves the number (no increment is hard-coded)');
    log(`  phase  +minor 2, cascade : ${phase.result.tag}`);
    log(`  mission +major 1, cascade: ${mission.result.tag}`);
    log(`  phase  +major 1, cascade off from v0.7.7 : ${flat.result.tag}`);
    check('(e) restyled phase increment applies', phase.result.tag === 'v0.9.0', phase.result.tag);
    check('(e) restyled mission increment applies', mission.result.tag === 'v1.0.0', mission.result.tag);
    check('(e) cascade off keeps the lower components', flat.result.tag === 'v1.7.7', flat.result.tag);
  }

  // Malformed inputs and a broken package shape refuse instead of guessing.
  {
    const badPolicy = runFixture({ policyText: JSON.stringify({ increments: { phase: { patch: 1 } } }) });
    const badQueue = runFixture({ queueText: '{"unit_type":"phase"}\n' });
    const noTags = runFixture({ tags: ['v7.5'] });
    const badPackage = runFixture({
      deps: {
        buildAsset: () => {
          throw new Error('packaged path(s) absent at 1111111: kit');
        },
      },
    });
    log('');
    log('[proof f] malformed inputs fail closed');
    log(`  missing mission increment : ${badPolicy.result.action} — ${badPolicy.result.reason}`);
    log(`  incomplete queue entry    : ${badQueue.result.action} — ${badQueue.result.reason}`);
    log(`  no strict semver tag      : ${noTags.result.action} — ${noTags.result.reason}`);
    log(`  missing packaged path     : ${badPackage.result.action} — ${badPackage.result.reason}`);
    check('(f) policy without both units refuses', badPolicy.result.exitCode === 1 && badPolicy.result.action === 'refused-policy', badPolicy.result.action);
    check('(f) an incomplete queue entry refuses', badQueue.result.exitCode === 1 && badQueue.result.action === 'refused-queue', badQueue.result.action);
    check('(f) v7.5 is not a base tag', noTags.result.exitCode === 1 && noTags.result.action === 'blocked' && noTags.result.reason === 'no-existing-tag', noTags.result.action);
    check('(f) a missing packaged path refuses', badPackage.result.exitCode === 1 && badPackage.result.action === 'refused-package', badPackage.result.action);
  }

  const failures = results.filter((result) => !result.ok);
  log('');
  for (const result of results) log(`${result.ok ? 'PASS' : 'FAIL'} ${result.name} (${result.detail})`);
  if (failures.length === 0) {
    log(`self-test PASS: ${results.length} assertions across the four §6 proofs and the policy/input guards.`);
    return 0;
  }
  log(`self-test FAILED: ${failures.length} of ${results.length} assertion(s).`);
  return 1;
}

/* ---------- main ---------- */

function usage() {
  process.stdout.write(
    [
      'self-publish.mjs — queue-driven self-publishing for phase and mission closures.',
      '',
      'Usage:',
      '  scripts/self-publish.mjs [--self-test]',
      '',
      '  --self-test  Prove the four §6 behaviours offline. No git, gh, network or write.',
      '',
      'Environment:',
      '  DRY_RUN=1|0            Default 1: report the exact release, create nothing.',
      '  PUBLISH_REPO=owner/name Default: the origin remote slug.',
      '  AUDIT_LOG=<path>       Default .opencode/audit/AUTO-PUBLISH.log.',
      '  RELEASE_QUEUE=<path>   Default .opencode/release-queue.jsonl.',
      '  RELEASE_POLICY=<path>  Default registry/policies/release-policy.json.',
      '  AUTO_RELEASE_SWITCH=<path> Default .opencode/auto-release.enabled.',
      '',
      'Exit status:',
      '  0  published, skipped, disabled, no pending entry, or a dry run whose gate passed.',
      '  1  refused or failed. Fail closed: nothing is created when the gate is not proven.',
    ].join('\n') + '\n',
  );
}

function main(argv) {
  if (argv.includes('-h') || argv.includes('--help')) {
    usage();
    return 0;
  }
  for (const arg of argv) {
    if (arg !== '--self-test') {
      process.stderr.write(`error: unexpected argument "${arg}"\n`);
      usage();
      return 1;
    }
  }
  if (argv.includes('--self-test')) return selfTest();

  const dryRun = (process.env.DRY_RUN ?? '1') !== '0';
  const repo = repoSlug();
  const log = (message) => process.stdout.write(`[self-publish] ${message}\n`);

  const tags = git(['tag', '--list', 'v*']).stdout.split('\n').map((line) => line.trim()).filter((line) => line !== '');
  const tagsAtCommit = (sha) => git(['tag', '--list', 'v*', '--points-at', sha]).stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
  const scratch = mkdtempSync(join(tmpdir(), 'self-publish-'));
  process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));

  const deps = {
    log,
    battery: (sha) => battery(sha, scratch),
    buildAsset: (sha, tag) => buildAsset(sha, tag, scratch),
    createTag,
    createRelease: (tag, notes, asset) => createRelease(tag, notes, asset, scratch),
    appendAudit,
    writeQueue: (text) => writeFileSync(PATHS.queue, text, 'utf8'),
    commitBack,
    commitReachable: (sha) => {
      if (!git(['cat-file', '-e', `${sha}^{commit}`]).ok) return false;
      return git(['merge-base', '--is-ancestor', sha, 'HEAD']).ok;
    },
  };

  try {
    const result = selfPublish({
      queueText: existsSync(PATHS.queue) ? readFileSync(PATHS.queue, 'utf8') : '',
      policyText: existsSync(PATHS.policy) ? readFileSync(PATHS.policy, 'utf8') : '',
      dryRun,
      switchPresent: existsSync(PATHS.switch),
      repo,
      tags,
      now: () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
      tagsAtCommit,
      deps,
    });
    return result.exitCode;
  } catch (error) {
    process.stderr.write(`[self-publish] ERROR: ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main(process.argv.slice(2));
}
