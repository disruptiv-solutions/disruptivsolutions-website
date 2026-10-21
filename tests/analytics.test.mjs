import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync('src/lib/analytics.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { trackEvent, trackFormSubmission, trackDisruptivVisit } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

test('an event before the tag loads is queued once with its source URL', () => {
  global.window = { location: { href: 'https://www.ianmcdonald.ai/?utm_source=verification', search: '?utm_source=verification' } };
  trackFormSubmission('speaking_inquiry', { page_location: 'home_v2' });
  assert.equal(window.dataLayer.length, 1);
  const command = Array.from(window.dataLayer[0]);
  assert.equal(command[0], 'event');
  assert.equal(command[1], 'speaking_inquiry');
  assert.equal(command[2].page_location, window.location.href);
  assert.equal(command[2].transport_type, 'beacon');
  assert.equal(command[2].debug_mode, undefined);
});

test('a loaded tag receives exactly one event and test visits are labeled', () => {
  const sent = [];
  global.window = { dataLayer: [], gtag: (...args) => sent.push(args),
    location: { href: 'https://www.ianmcdonald.ai/newsletter?analytics_test=qa', search: '?analytics_test=qa' } };
  trackFormSubmission('newsletter_signup');
  assert.equal(sent.length, 1);
  assert.equal(sent[0][2].debug_mode, true);
  assert.equal(sent[0][2].test_run_id, 'qa');
  assert.equal(window.dataLayer.length, 0);
});

test('server rendering does not emit browser events', () => {
  delete global.window;
  assert.doesNotThrow(() => trackEvent('page_view'));
});

test('a Disruptiv link counts one handoff with its source placement, not a lead', () => {
  const sent = [];
  global.window = { dataLayer: [], gtag: (...args) => sent.push(args),
    location: { href: 'https://www.ianmcdonald.ai/', search: '' } };
  trackDisruptivVisit('https://www.disruptiv.solutions/contact', 'home_v2_project');
  assert.equal(sent.length, 1);
  assert.equal(sent[0][1], 'disruptiv_visit');
  assert.equal(sent[0][2].link_url, 'https://www.disruptiv.solutions/contact');
  assert.equal(sent[0][2].link_location, 'home_v2_project');
  assert.equal(sent[0][2].page_location, window.location.href);
});
