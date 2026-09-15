import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describeBuildError } from './lib/build-error.mjs';

test('CMS build errors expose the HTTP cause without credentials or request details', () => {
  for (const status of [401, 403, 404, 429, 503]) {
    const error = new Error(JSON.stringify({ status, message: 'private-token-value', request: { headers: { Authorization: 'Bearer private-token-value' }, url: 'private-request-url' } }));
    error.name = 'AccessTokenInvalid';
    const message = describeBuildError(error);
    assert.ok(message.includes(`HTTP ${status}`));
    assert.ok(!message.includes('private-token-value') && !message.includes('private-request-url'));
  }
});

test('known build validation remains actionable while unknown errors stay sanitized', () => {
  assert.equal(describeBuildError(new Error('VITE_SITE_URL must be an HTTPS origin.')), 'VITE_SITE_URL must be an HTTPS origin.');
  assert.ok(!describeBuildError(new Error('request failed with private-token-value')).includes('private-token-value'));
  assert.ok(describeBuildError(null).startsWith('BuildError'));
});
