import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

process.env.MAILCHIMP_API_KEY = 'synthetic-us1';
const source = ts.transpileModule(readFileSync('src/lib/mailchimp-preferences.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { subscribeToNewsletter, GROUPS } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const response = (body, status = 200) => new Response(JSON.stringify(body), { status });

test('new signup requires confirmed audience membership and Ian topic', async () => {
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1 ? response({}, 404) : response({ status: 'subscribed', interests: { [GROUPS.ian]: true } });
  };
  assert.deepEqual(await subscribeToNewsletter('Analytics QA', 'qa@example.test', ''), { status: 'subscribed', newSignup: true });
  assert.equal(calls.length, 2);
  const sent = JSON.parse(calls[1].options.body);
  assert.equal(sent.interests[GROUPS.ian], true);
  assert.equal(sent.status, 'subscribed');
});

test('repeat subscribed contact produces no new conversion or audience write', async () => {
  let calls = 0;
  global.fetch = async () => { calls++; return response({ status: 'subscribed', interests: { [GROUPS.ian]: true } }); };
  assert.deepEqual(await subscribeToNewsletter('Analytics QA', 'qa@example.test', ''), { status: 'subscribed', newSignup: false });
  assert.equal(calls, 1);
});

test('audience errors and unconfirmed membership never report signup success', async () => {
  global.fetch = async () => response({}, 503);
  await assert.rejects(subscribeToNewsletter('Analytics QA', 'qa@example.test', ''));
  let calls = 0;
  global.fetch = async () => ++calls === 1 ? response({}, 404) : response({ status: 'pending' });
  await assert.rejects(subscribeToNewsletter('Analytics QA', 'qa@example.test', ''));
});
