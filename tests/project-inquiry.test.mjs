import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const encode = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64');
const botModule = encode('export const bot = { isBot: false, fail: false }; export async function checkBotId(options) { if (options.advancedOptions.checkLevel !== "basic") throw Error("Unexpected check level"); if (bot.fail) throw Error("Verification unavailable"); return { isBot: bot.isBot }; }');
const mailModule = encode('export const mail = { sent: [], error: false, fail: false, empty: false }; export class Resend { emails = { send: async email => { mail.sent.push(email); if (mail.fail) throw Error("Provider unavailable"); return mail.error ? { error: { message: "Rejected" }, data: null } : { error: null, data: mail.empty ? null : { id: "test-message" } }; } }; }');
const { bot } = await import(botModule);
const { mail } = await import(mailModule);
const spamModule = encode(readFileSync('src/lib/inquiry-spam.ts', 'utf8'));
const source = readFileSync('src/app/api/project-inquiry/route.ts', 'utf8')
  .replace("'botid/server'", JSON.stringify(botModule))
  .replace("'resend'", JSON.stringify(mailModule))
  .replace("'@/lib/inquiry-spam'", JSON.stringify(spamModule))
  .replace("'next/server'", JSON.stringify(import.meta.resolve('next/server.js')));

let version = 0;
async function loadRoute(config = {}) {
  const values = { RESEND_API_KEY: 'synthetic-test-key', RESEND_FROM: undefined, ALERT_EMAIL: undefined, ...config };
  const previous = Object.fromEntries(Object.keys(values).map(key => [key, process.env[key]]));
  try {
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    return await import(encode(`${source}\n// Configuration variant ${version++}`));
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
}

const { POST } = await loadRoute();
const inquiry = { name: 'Test Organizer', email: 'organizer@example.test', interest: 'ai-training', note: 'A workshop for our team.' };
const req = (body = inquiry, headers = {}) => new Request('https://www.ianmcdonald.ai/api/project-inquiry', {
  method: 'POST', headers: { origin: 'https://www.ianmcdonald.ai', 'content-type': 'application/json', ...headers }, body: JSON.stringify(body),
});

beforeEach(() => {
  bot.isBot = false;
  bot.fail = false;
  mail.sent.length = 0;
  mail.error = false;
  mail.fail = false;
  mail.empty = false;
});

test('valid inquiries send one notification to Ian, with reply routing and escaped details', async () => {
  const body = { ...inquiry, name: 'Test <Organizer> & Co', note: '<script>alert("test")</script>\nA workshop & automation.' };
  const response = await POST(req(body));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(mail.sent.length, 1);
  const notification = mail.sent[0];
  assert.equal(notification.to, 'ian@ianmcdonald.ai');
  assert.equal(notification.from, 'Ian McDonald <ian@ianmcdonald.ai>');
  assert.equal(notification.replyTo, inquiry.email);
  assert.match(notification.subject, /AI training$/);
  assert.match(notification.html, /Test &lt;Organizer&gt; &amp; Co/);
  assert.match(notification.html, /&lt;script&gt;alert\(&quot;test&quot;\)&lt;\/script&gt;<br>/);
  assert.doesNotMatch(notification.html, /<script>/);
  assert.match(notification.text, /Source: Find Leads resource page/);
});

test('all four interests accept optional notes, while configured mail routing is respected', async () => {
  const { POST: configuredPost } = await loadRoute({ RESEND_FROM: 'Website <website@example.test>', ALERT_EMAIL: 'ian-inbox@example.test' });
  for (const interest of ['ai-training', 'workflow', 'automation', 'social-media-content']) {
    const { note: _note, ...body } = inquiry;
    assert.equal((await configuredPost(req({ ...body, interest }))).status, 200);
  }
  assert.equal(mail.sent.length, 4);
  assert.ok(mail.sent.every(email => email.to === 'ian-inbox@example.test' && email.from === 'Website <website@example.test>'));
});

test('contact and lesson inquiries identify the correct trusted source in both email formats', async () => {
  for (const [source, label, path] of [
    ['contact', 'Contact Ian page', '/contact'],
    ['find_leads', 'Find Leads resource page', '/learn/find-leads'],
  ]) {
    const response = await POST(req({ ...inquiry, source }));
    assert.equal(response.status, 200);
    const notification = mail.sent.at(-1);
    assert.ok(notification.text.includes(`Source: ${label}\nhttps://www.ianmcdonald.ai${path}`));
    assert.ok(notification.html.includes(`<a href="https://www.ianmcdonald.ai${path}">${label}</a>`));
    assert.equal(notification.replyTo, inquiry.email);
  }
  assert.equal(mail.sent.length, 2);
});

test('unknown or malformed sources cannot inject a link into the inquiry notification', async () => {
  for (const source of ['https://untrusted.example', 'constructor', '', null, {}, ['contact'], '<a href="https://untrusted.example">contact</a>']) {
    assert.equal((await POST(req({ ...inquiry, source }))).status, 400);
  }
  assert.equal(mail.sent.length, 0);
});

test('invalid inputs, spoofed origins, unsupported content types and malformed JSON send no email', async () => {
  assert.equal((await POST(req(inquiry, { origin: 'https://untrusted.example' }))).status, 403);
  assert.equal((await POST(req(inquiry, { 'content-type': 'text/plain' }))).status, 415);
  for (const body of [
    null, [], { ...inquiry, name: '' }, { ...inquiry, name: 'x'.repeat(201) },
    { ...inquiry, email: 'invalid' }, { ...inquiry, email: `${'x'.repeat(245)}@example.test` },
    { ...inquiry, email: `${inquiry.email}\r\n` }, { ...inquiry, interest: 'constructor' },
    { ...inquiry, interest: 'speaking-event' }, { ...inquiry, note: 'x'.repeat(5001) },
    { ...inquiry, note: { invalid: true } },
  ]) assert.equal((await POST(req(body))).status, 400);
  const malformed = new Request('https://www.ianmcdonald.ai/api/project-inquiry', {
    method: 'POST', headers: { origin: 'https://www.ianmcdonald.ai', 'content-type': 'application/json' }, body: '{broken',
  });
  assert.equal((await POST(malformed)).status, 400);
  assert.equal(mail.sent.length, 0);
});

test('bot detection and unavailable verification fail closed without sending mail', async () => {
  bot.isBot = true;
  assert.equal((await POST(req())).status, 403);
  bot.isBot = false;
  bot.fail = true;
  assert.equal((await POST(req())).status, 503);
  assert.equal(mail.sent.length, 0);
});

test('randomized-name spam sends no mail', async () => {
  assert.equal((await POST(req({ ...inquiry, name: 'qzABrSTuVwxYZaBc' }))).status, 400);
  assert.equal(mail.sent.length, 0);
});

test('provider failures never report success or send a second email', async () => {
  for (const failure of ['error', 'fail', 'empty']) {
    mail.sent.length = 0;
    mail[failure] = true;
    const response = await POST(req());
    assert.equal(response.status, 502);
    assert.ok((await response.json()).error.includes('ian@ianmcdonald.ai'));
    assert.equal(mail.sent.length, 1);
    mail[failure] = false;
  }
});

test('missing mail configuration returns a direct-email fallback without sending', async () => {
  const { POST: unconfiguredPost } = await loadRoute({ RESEND_API_KEY: undefined });
  const response = await unconfiguredPost(req());
  assert.equal(response.status, 503);
  assert.ok((await response.json()).error.includes('ian@ianmcdonald.ai'));
  assert.equal(mail.sent.length, 0);
});
