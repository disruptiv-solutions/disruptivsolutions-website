import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const encode = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64');
const botModule = encode('export const bot = { isBot: false, fail: false }; export async function checkBotId(options) { if (options.advancedOptions.checkLevel !== "basic") throw Error("Unexpected check level"); if (bot.fail) throw Error("Verification unavailable"); return { isBot: bot.isBot }; }');
const mailModule = encode('export const sent = []; export class Resend { emails = { send: async email => { sent.push(email); return { error: null }; } }; }');
const { bot } = await import(botModule);
const { sent } = await import(mailModule);
process.env.RESEND_API_KEY = 'synthetic-test-key';
const source = readFileSync('src/app/api/speaking-inquiry/route.ts', 'utf8')
  .replace("'botid/server'", JSON.stringify(botModule))
  .replace("'resend'", JSON.stringify(mailModule))
  .replace("'next/server'", JSON.stringify(import.meta.resolve('next/server.js')));
const { POST } = await import(encode(source));
delete process.env.RESEND_API_KEY;
const inquiry = { name: 'Test Organizer', email: 'organizer@example.test', interest: 'speaking-event', note: 'A workshop for our team.' };
const req = (body = inquiry, headers = {}) => new Request('https://www.ianmcdonald.ai/api/speaking-inquiry', {
  method: 'POST', headers: { origin: 'https://www.ianmcdonald.ai', 'content-type': 'application/json', ...headers }, body: JSON.stringify(body),
});

test('bots and verification failures send neither notification nor confirmation', async () => {
  sent.length = 0;
  try {
    bot.isBot = true;
    assert.equal((await POST(req())).status, 403);
    bot.isBot = false; bot.fail = true;
    assert.equal((await POST(req())).status, 503);
    assert.equal(sent.length, 0);
  } finally { bot.isBot = false; bot.fail = false; }
});

test('cross-site and malformed submissions do not send email', async () => {
  sent.length = 0;
  assert.equal((await POST(req(inquiry, { origin: 'https://untrusted.example' }))).status, 403);
  assert.equal((await POST(req(inquiry, { 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await POST(req({ ...inquiry, email: 'invalid' }))).status, 400);
  assert.equal(sent.length, 0);
});

test('verified valid visitors retain both expected emails and reply routing', async () => {
  sent.length = 0;
  const response = await POST(req());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(sent.length, 2);
  assert.equal(sent[0].to, 'ian@ianmcdonald.ai');
  assert.equal(sent[0].replyTo, inquiry.email);
  assert.equal(sent[1].to, inquiry.email);
  assert.equal(sent[1].replyTo, 'ian@ianmcdonald.ai');
});
