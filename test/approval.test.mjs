import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDestructiveShellCommand, approvalErrorFor } from '../scripts/approval-interlock.mjs';

test('destructive patterns are destructive', () => {
  assert.equal(isDestructiveShellCommand('rm -rf /tmp/x'), true);
  assert.equal(isDestructiveShellCommand('git push --force origin main'), true);
  assert.equal(isDestructiveShellCommand('git reset --hard HEAD~1'), true);
  assert.equal(isDestructiveShellCommand('gh release create v0.9.78'), true);
});

test('safe commands are not destructive', () => {
  assert.equal(isDestructiveShellCommand('node scripts/verify-skills.mjs'), false);
  assert.equal(isDestructiveShellCommand('git status --short'), false);
  assert.equal(isDestructiveShellCommand(''), false);
});

test('unapproved destructive action is refused with APPROVAL_REQUIRED', () => {
  const err = approvalErrorFor('rm -rf /tmp/x', false);
  assert.match(err, /APPROVAL_REQUIRED/);
});

test('approved destructive action passes', () => {
  assert.equal(approvalErrorFor('rm -rf /tmp/x', true), null);
});

test('safe action never refuses', () => {
  assert.equal(approvalErrorFor('node scripts/verify-skills.mjs', false), null);
});
