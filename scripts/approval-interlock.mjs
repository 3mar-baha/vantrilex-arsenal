#!/usr/bin/env node
/*
 * Approval interlock (MFT-147) — destructive-action gate in code.
 *
 * A destructive shell command without human approval is refused with a
 * named error `APPROVAL_REQUIRED`. Approval is explicit and per-run:
 * `VANTRILEX_APPROVED=1` in the environment or a file
 * `.opencode/approval.enabled` existing at the repository root.
 *
 * The same pure predicates live in `.opencode/plugin/arsenal.ts` as
 * `isDestructiveShellCommand` / `approvalErrorFor` / `destructiveActionGuard`,
 * which refuse the same commands on the tool / shell hooks.
 *
 * Usage:
 *   node scripts/approval-interlock.mjs --check "<command>" [--approved]
 *   node scripts/approval-interlock.mjs --list-patterns
 * Exit status:
 *   0 — command is safe, or destructive but approved
 *   1 — command is destructive and not approved (APPROVAL_REQUIRED)
 *   2 — usage error
 */

const DESTRUCTIVE_SHELL_PATTERNS = [
  /^rm\s+-rf\b/,
  /^git\s+push\s+--force\b/,
  /^git\s+reset\s+--hard\b/,
  /^gh\s+release\s+create\b/,
];

export const isDestructiveShellCommand = (command) => {
  const cmd = typeof command === 'string' ? command.trim() : '';
  if (cmd.length === 0) return false;
  return DESTRUCTIVE_SHELL_PATTERNS.some((re) => re.test(cmd));
};

export const approvalErrorFor = (command, approved) => {
  if (!isDestructiveShellCommand(command)) return null;
  if (approved) return null;
  const shown = String(command).trim().slice(0, 120);
  return `[arsenal] APPROVAL_REQUIRED: destructive action "${shown}" requires human approval; set VANTRILEX_APPROVED=1 or create .opencode/approval.enabled to approve this run`;
};

const usage = () => {
  console.error('Usage: node scripts/approval-interlock.mjs --check "<command>" [--approved]');
  console.error('       node scripts/approval-interlock.mjs --list-patterns');
};

import { fileURLToPath } from 'node:url';
const isMain = (() => {
  try {
    return process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];
  } catch {
    return false;
  }
})();

if (isMain) {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    usage();
    process.exit(0);
  }
  if (argv.includes('--list-patterns')) {
    for (const re of DESTRUCTIVE_SHELL_PATTERNS) console.log(String(re));
    process.exit(0);
  }
  const idx = argv.indexOf('--check');
  if (idx === -1 || !argv[idx + 1]) {
    usage();
    process.exit(2);
  }
  const command = argv[idx + 1];
  const approved = argv.includes('--approved') || process.env.VANTRILEX_APPROVED === '1';
  const err = approvalErrorFor(command, approved);
  if (err !== null) {
    console.error(err);
    process.exit(1);
  }
  console.log('APPROVAL: ok');
  process.exit(0);
}
