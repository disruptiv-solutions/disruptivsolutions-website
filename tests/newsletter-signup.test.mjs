import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const encode = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64');
const oldKey = process.env.MAILCHIMP_API_KEY;
process.env.MAILCHIMP_API_KEY = 'synthetic-us1';
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });
process.on('exit', () => { if (oldKey === undefined) delete process.env.MAILCHIMP_API_KEY; else process.env.MAILCHIMP_API_KEY = oldKey; });
const { subscribeToNewsletter, GROUPS } = await import(encode(readFileSync('src/lib/mailchimp-preferences.ts', 'utf8')));
const response = (body, status = 200) => new Response(JSON.stringify(body), { status });

test('new contact is create-only pending, never immediately subscribed', async () => {
  const calls = [];
  global.fetch = async (url, options) => { calls.push({ url, options }); return calls.length === 1 ? response({}, 404) : response({ status: 'pending' }); };
  assert.equal(await subscribeToNewsletter('Test Person', 'QA@example.test'), undefined);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].options.method, 'POST');
  assert.match(calls[1].url, /\/lists\/41ab191ed7\/members$/);
  assert.deepEqual(JSON.parse(calls[1].options.body), { email_address: 'qa@example.test', status: 'pending', merge_fields: { FNAME: 'Test Person' }, interests: { [GROUPS.ian]: true } });
});

test('all existing contacts remain untouched, including subscribed without Ian interest and pending retries', async () => {
  for (const status of ['subscribed', 'unsubscribed', 'cleaned', 'pending', 'transactional', 'archived', 'unknown']) {
    let calls = 0;
    global.fetch = async (_url, options) => { calls++; assert.equal(options.method, undefined); return response({ status, interests: {} }); };
    assert.equal(await subscribeToNewsletter('Changed Name', 'qa@example.test'), undefined);
    assert.equal(calls, 1);
  }
});

test('create race produces no upsert, retries or changes to the winning member', async () => {
  const methods = [];
  global.fetch = async (_url, options) => { methods.push(options?.method || 'GET'); return options?.method ? response({ title: 'Member Exists' }, 400) : response({}, 404); };
  assert.equal(await subscribeToNewsletter('Test Person', 'qa@example.test'), undefined);
  assert.deepEqual(methods, ['GET', 'POST']);
});

test('lookup failures never write; other create failures fail closed', async () => {
  let calls = 0;
  global.fetch = async () => { calls++; return response({}, 503); };
  await assert.rejects(subscribeToNewsletter('Test Person', 'qa@example.test'));
  assert.equal(calls, 1);
  for (const [payload, status] of [[{ title: 'Invalid Resource' }, 400], [{ status: 'subscribed' }, 200], [{}, 503]]) {
    global.fetch = async (_url, options) => options?.method ? response(payload, status) : response({}, 404);
    await assert.rejects(subscribeToNewsletter('Test Person', 'qa@example.test'));
  }
});

const botModule = encode('export const bot = { isBot: false, fail: false }; export async function checkBotId(options) { if (options.advancedOptions.checkLevel !== "basic") throw Error("Unexpected paid level"); if (bot.fail) throw Error("Unavailable"); return { isBot: bot.isBot }; }');
const serviceModule = encode('export const service = { calls: [], fail: false }; export async function subscribeToNewsletter(...args) { service.calls.push(args); if (service.fail) throw Error("Unavailable"); }');
const { bot } = await import(botModule);
const { service } = await import(serviceModule);
const routeSource = readFileSync('src/app/api/newsletter-signup/route.ts', 'utf8');
const { POST } = await import(encode(routeSource.replace("'botid/server'", JSON.stringify(botModule)).replace("'@/lib/mailchimp-preferences'", JSON.stringify(serviceModule)).replace("'next/server'", JSON.stringify(import.meta.resolve('next/server.js')))));
const req = (body = { name: 'Test Person', email: 'qa@example.test' }, headers = {}) => new Request('https://www.ianmcdonald.ai/api/newsletter-signup', { method: 'POST', headers: { origin: 'https://www.ianmcdonald.ai', 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });

test('route returns only generic success and has no custom welcome sender', async () => {
  service.calls.length = 0;
  const res = await POST(req());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true });
  assert.deepEqual(service.calls, [['Test Person', 'qa@example.test', '']]);
  assert.doesNotMatch(routeSource, /from 'resend'|emails\.send|newSignup/);
});

test('origin, content type and validation failures make no audience request', async () => {
  service.calls.length = 0;
  for (const [request, status] of [[req(undefined, { origin: '' }), 403], [req(undefined, { origin: 'https://other.test' }), 403], [req(undefined, { 'content-type': 'text/plain' }), 415], [req({ name: '', email: 'bad' }), 400], [req({ name: 'Test', email: 'bad\r\n@example.test' }), 400]]) {
    assert.equal((await POST(request)).status, status);
  }
  assert.equal(service.calls.length, 0);
});

test('basic BotID bot detection and unavailable verification fail closed without audience calls', async () => {
  service.calls.length = 0;
  bot.isBot = true;
  assert.equal((await POST(req())).status, 403);
  bot.isBot = false; bot.fail = true;
  assert.equal((await POST(req())).status, 503);
  bot.fail = false;
  assert.equal(service.calls.length, 0);
});

test('provider failure returns generic retry error, not member details', async () => {
  service.fail = true;
  assert.equal((await POST(req())).status, 502);
  service.fail = false;
});

test('both public newsletter UIs use generic response and no confirmed-signup conversion', () => {
  for (const path of ['src/components/NewsletterSignup.tsx', 'src/components/LaunchBox.tsx']) {
    const source = readFileSync(path, 'utf8');
    assert.match(source, /result.success !== true/);
    assert.match(source, /If your address is new/);
    assert.match(source, /preferences link in a newsletter/);
    assert.doesNotMatch(source, /trackFormSubmission\('newsletter_signup'|result.status|result.newSignup|Successfully subscribed/);
  }
  assert.match(readFileSync('src/instrumentation-client.ts', 'utf8'), /path: '\/api\/newsletter-signup', method: 'POST', advancedOptions: \{ checkLevel: 'basic' \}/);
});
