import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isServiceRoleKey, loadConfig } from '../scripts/COMMS-SUPABASE-WAIT.mjs';

// Test-only JWT shapes: header is irrelevant to the check, payload carries role.
const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const jwtWithRole = (role) => `test-header.${b64url({ role })}.test-signature`;
const SERVICE_JWT = jwtWithRole('service_role');
const ANON_JWT = jwtWithRole('anon');
const BASE_ENV = {
  COMMS_SUPABASE_URL: 'https://example.supabase.co',
};

test('isServiceRoleKey detects service_role JWTs only', () => {
  assert.equal(isServiceRoleKey(SERVICE_JWT), true);
  assert.equal(isServiceRoleKey(`header.${b64url({ role: 'service_role' })}`), true);
  assert.equal(isServiceRoleKey(ANON_JWT), false);
  assert.equal(isServiceRoleKey(jwtWithRole('authenticated')), false);
  assert.equal(isServiceRoleKey('not-a-jwt'), false);
  assert.equal(isServiceRoleKey('abc'), false);
  assert.equal(isServiceRoleKey('a.not-json.c'), false);
  assert.equal(isServiceRoleKey(''), false);
  assert.equal(isServiceRoleKey(null), false);
  assert.equal(isServiceRoleKey(undefined), false);
  assert.equal(isServiceRoleKey(123), false);
  assert.equal(isServiceRoleKey({}), false);
});

test('loadConfig refuses a service_role JWT in the anon key', () => {
  const config = loadConfig({ ...BASE_ENV, COMMS_SUPABASE_ANON_KEY: SERVICE_JWT });
  assert.equal(config.ok, false);
  assert.equal(config.reason, 'service-role-refused');
  assert.match(config.detail, /service-role-key=UNSET/);
  assert.match(config.detail, /key-role=service_role/);
});

test('loadConfig allows a non-service JWT', () => {
  const config = loadConfig({ ...BASE_ENV, COMMS_SUPABASE_ANON_KEY: ANON_JWT });
  assert.equal(config.ok, true);
  assert.equal(config.anonKey, ANON_JWT);
  assert.equal(config.url, BASE_ENV.COMMS_SUPABASE_URL);
});

test('loadConfig allows an undecodable anon key string', () => {
  const config = loadConfig({ ...BASE_ENV, COMMS_SUPABASE_ANON_KEY: 'opaque-anon-key-value' });
  assert.equal(config.ok, true);
  assert.equal(config.anonKey, 'opaque-anon-key-value');
});

test('loadConfig refuses when the service-role env var is SET', () => {
  const config = loadConfig({
    ...BASE_ENV,
    COMMS_SUPABASE_ANON_KEY: ANON_JWT,
    COMMS_SUPABASE_SERVICE_ROLE_KEY: 'anything-non-empty',
  });
  assert.equal(config.ok, false);
  assert.equal(config.reason, 'service-role-refused');
  assert.match(config.detail, /service-role-key=SET/);
  assert.match(config.detail, /key-role=not-service_role/);
});

test('loadConfig refusal leaks no secret value, presence only', () => {
  const secretSentinel = 'SENTINEL-service-role-value-must-not-leak';
  const anonSentinel = 'SENTINEL-anon-value-must-not-leak';
  const fromEnvVar = loadConfig({
    ...BASE_ENV,
    COMMS_SUPABASE_ANON_KEY: ANON_JWT,
    COMMS_SUPABASE_SERVICE_ROLE_KEY: secretSentinel,
  });
  assert.equal(fromEnvVar.ok, false);
  assert.ok(!JSON.stringify(fromEnvVar).includes(secretSentinel));
  assert.match(fromEnvVar.detail, /service-role-key=SET/);

  const serviceJwtItself = jwtWithRole('service_role');
  const fromAnonKey = loadConfig({ ...BASE_ENV, COMMS_SUPABASE_ANON_KEY: serviceJwtItself });
  assert.equal(fromAnonKey.ok, false);
  assert.ok(!JSON.stringify(fromAnonKey).includes(serviceJwtItself));
  assert.ok(!JSON.stringify(fromAnonKey).includes(b64url({ role: 'service_role' })));
  assert.match(fromAnonKey.detail, /service-role-key=UNSET/);
  assert.match(fromAnonKey.detail, /key-role=service_role/);

  // Allowed path also carries the key value only in the config field that
  // request headers use, never in a refusal/detail string (no detail on ok).
  const allowed = loadConfig({ ...BASE_ENV, COMMS_SUPABASE_ANON_KEY: anonSentinel });
  assert.equal(allowed.ok, true);
  assert.equal('detail' in allowed, false);
  assert.ok(!JSON.stringify(allowed).includes('service-role-refused'));
});
