#!/usr/bin/env node
'use strict';

// zenith-refresh-guard.mjs — LD-02 refresh-guard procedure (0.9.2).
//
// Usage:
//   node scripts/zenith-refresh-guard.mjs --before <file> --after <file> [--label <name>] [--json]
//
// What it does: diffs two real document texts line by line (LCS, no
// dependencies), groups runs of changed lines into hunks, and emits one
// numbered update task per hunk. Also exports refreshRegister, the
// register-refresh procedure the team-control book defines: reload the live
// fields at a session anchor and stamp the anchor id plus date.
//
// An empty diff yields zero tasks and a logged no-op, never padded work.
// A synthetic-only pair is refused by policy in the guard skill; this
// script diffs what it is given and labels both sides so the caller can
// prove the pair is real.
//
// Node 25, ESM, zero dependencies. One named export per rule.

import { readFileSync } from 'node:fs';

export const splitLines = (text) => text.replace(/\r\n/g, '\n').split('\n');

const truncate = (s, n = 120) => (s.length > n ? `${s.slice(0, n)}...` : s);

// LCS opcodes over two line arrays. Each opcode is one of:
// { op: 'equal'|'del'|'ins', before: <index|-1>, after: <index|-1> }.
export const diffLines = (beforeLines, afterLines) => {
  const m = beforeLines.length;
  const n = afterLines.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = beforeLines[i] === afterLines[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (beforeLines[i] === afterLines[j]) {
      ops.push({ op: 'equal', before: i, after: j });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ op: 'del', before: i, after: -1 });
      i++;
    } else {
      ops.push({ op: 'ins', before: -1, after: j });
      j++;
    }
  }
  while (i < m) {
    ops.push({ op: 'del', before: i, after: -1 });
    i++;
  }
  while (j < n) {
    ops.push({ op: 'ins', before: -1, after: j });
    j++;
  }
  return ops;
};

// Group consecutive non-equal opcodes into hunks with 1-based line starts.
export const hunksFromOps = (ops, beforeLines, afterLines) => {
  const hunks = [];
  let current = null;
  const flush = () => {
    if (current !== null) {
      hunks.push(current);
      current = null;
    }
  };
  for (const op of ops) {
    if (op.op === 'equal') {
      flush();
      continue;
    }
    if (current === null) {
      current = {
        beforeStart: op.before === -1 ? -1 : op.before + 1,
        afterStart: op.after === -1 ? -1 : op.after + 1,
        beforeLines: [],
        afterLines: [],
      };
    }
    if (op.op === 'del') {
      if (current.beforeStart === -1) current.beforeStart = op.before + 1;
      current.beforeLines.push(beforeLines[op.before]);
    } else {
      if (current.afterStart === -1) current.afterStart = op.after + 1;
      current.afterLines.push(afterLines[op.after]);
    }
  }
  flush();
  return hunks;
};

export const tasksFromDiff = (hunks, label) => hunks.map((h, index) => {
  const kind = h.beforeLines.length > 0 && h.afterLines.length > 0
    ? 'update'
    : (h.afterLines.length > 0 ? 'add' : 'remove');
  const witness = h.afterLines.length > 0 ? h.afterLines[0] : h.beforeLines[0];
  return {
    id: `T-${String(index + 1).padStart(2, '0')}`,
    kind,
    source: label,
    beforeStart: h.beforeStart,
    beforeCount: h.beforeLines.length,
    afterStart: h.afterStart,
    afterCount: h.afterLines.length,
    detail: truncate(witness),
  };
});

// Register-refresh procedure from the team-control book: reload the live
// fields at a session anchor and stamp the anchor id plus date. Throws when
// a marker line is absent or duplicated, so a refresh can never silently
// skip a field.
export const refreshRegister = (text, { anchorId, stamp, loadSignal }) => {
  const lines = splitLines(text);
  const replaceOnce = (prefix, replacement) => {
    const hits = [];
    lines.forEach((line, index) => {
      if (line.startsWith(prefix)) hits.push(index);
    });
    if (hits.length !== 1) {
      throw new Error(`expected exactly one line starting with ${prefix}, found ${hits.length}`);
    }
    lines[hits[0]] = replacement;
  };
  replaceOnce('- Anchor:', `- Anchor: ${anchorId}`);
  replaceOnce('- Refreshed:', `- Refreshed: ${stamp}`);
  replaceOnce('- Live load:', `- Live load: ${loadSignal}`);
  return lines.join('\n');
};

const usage = () => [
  'Usage:',
  '  node scripts/zenith-refresh-guard.mjs --before <file> --after <file> [--label <name>] [--json]',
].join('\n');

const main = () => {
  const args = process.argv.slice(2);
  const at = (flag) => {
    const i = args.indexOf(flag);
    return i === -1 ? null : args[i + 1] ?? null;
  };
  const beforePath = at('--before');
  const afterPath = at('--after');
  const label = at('--label') || `${beforePath} -> ${afterPath}`;
  if (!beforePath || !afterPath) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }
  let beforeText = '';
  let afterText = '';
  try {
    beforeText = readFileSync(beforePath, 'utf8');
  } catch (error) {
    process.stderr.write(`cannot read --before ${beforePath}: ${error.message}\n`);
    process.exit(2);
  }
  try {
    afterText = readFileSync(afterPath, 'utf8');
  } catch (error) {
    process.stderr.write(`cannot read --after ${afterPath}: ${error.message}\n`);
    process.exit(2);
  }
  const beforeLines = splitLines(beforeText);
  const afterLines = splitLines(afterText);
  const ops = diffLines(beforeLines, afterLines);
  const hunks = hunksFromOps(ops, beforeLines, afterLines);
  const tasks = tasksFromDiff(hunks, label);
  if (args.includes('--json')) {
    process.stdout.write(`${JSON.stringify({
      before: beforePath,
      after: afterPath,
      beforeLines: beforeLines.length,
      afterLines: afterLines.length,
      hunks: hunks.length,
      tasks,
    }, null, 2)}\n`);
    return;
  }
  process.stdout.write(`before: ${beforePath} (${beforeLines.length} lines)\n`);
  process.stdout.write(`after: ${afterPath} (${afterLines.length} lines)\n`);
  process.stdout.write(`hunks: ${hunks.length} tasks: ${tasks.length}\n`);
  if (tasks.length === 0) {
    process.stdout.write('no-op: diff is empty, zero tasks\n');
    return;
  }
  for (const task of tasks) {
    process.stdout.write(
      `${task.id} [${task.kind}] ${task.source} before@${task.beforeStart}x${task.beforeCount} after@${task.afterStart}x${task.afterCount} :: ${task.detail}\n`,
    );
  }
};

const invokedDirectly = process.argv[1] !== undefined
  && import.meta.url.endsWith('/zenith-refresh-guard.mjs')
  && process.argv[1].replace(/\\/g, '/').endsWith('/zenith-refresh-guard.mjs');
if (invokedDirectly) main();