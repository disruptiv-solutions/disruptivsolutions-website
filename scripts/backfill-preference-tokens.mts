/**
 * Creates the PREFTOKEN merge field (if absent) and writes a signed, one-year
 * preference token onto every subscribed member.
 *
 * Re-runnable — run it annually, or after rotating PREF_TOKEN_SECRET, to reissue
 * every token. Old tokens stop working as soon as the secret changes.
 *
 *   npx tsx --env-file=.env.local scripts/backfill-preference-tokens.mts --dry
 *   npx tsx --env-file=.env.local scripts/backfill-preference-tokens.mts --go
 */
import crypto from 'crypto';
import { createToken } from '../src/lib/mailchimp-preferences.ts';

const LIST_ID = '41ab191ed7';
const KEY = process.env.MAILCHIMP_API_KEY;
if (!KEY) throw new Error('MAILCHIMP_API_KEY is not set');
const BASE = `https://${KEY.split('-').pop()}.api.mailchimp.com/3.0`;
const AUTH = `Basic ${Buffer.from(`anystring:${KEY}`).toString('base64')}`;
const GO = process.argv.includes('--go');

async function mc(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { Authorization: AUTH, 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  return { ok: res.ok, status: res.status, body: await res.json().catch(() => ({})) };
}

// 1. Ensure the merge field exists. Hidden from signup forms — it is plumbing.
const fields = await mc(`/lists/${LIST_ID}/merge-fields?count=100&fields=merge_fields.tag`);
const tags: string[] = (fields.body.merge_fields ?? []).map((f: { tag: string }) => f.tag);
console.log('existing merge tags:', tags.join(', '));

if (!tags.includes('PREFTOKEN')) {
  if (!GO) {
    console.log('WOULD CREATE merge field PREFTOKEN');
  } else {
    const created = await mc(`/lists/${LIST_ID}/merge-fields`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Preference token', tag: 'PREFTOKEN', type: 'text', public: false, required: false }),
    });
    console.log(created.ok ? 'created merge field PREFTOKEN' : `FAILED to create: ${JSON.stringify(created.body).slice(0, 200)}`);
    if (!created.ok) process.exit(1);
  }
} else {
  console.log('merge field PREFTOKEN already present');
}

// 2. Issue a token for every subscribed member.
const members = await mc(`/lists/${LIST_ID}/members?count=1000&status=subscribed&fields=members.email_address`);
const emails: string[] = (members.body.members ?? []).map((m: { email_address: string }) => m.email_address);
const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000);
console.log(`\n${GO ? 'WRITING' : 'DRY RUN'} tokens for ${emails.length} members, expiring ${expires.toISOString().slice(0, 10)}`);

if (!GO) {
  const sample = emails[0];
  const h = crypto.createHash('md5').update(sample.toLowerCase()).digest('hex');
  console.log(`  sample token length: ${createToken(h, expires).length} chars`);
  console.log('  re-run with --go to write.');
  process.exit(0);
}

let ok = 0;
let failed = 0;
for (const email of emails) {
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  const res = await mc(`/lists/${LIST_ID}/members/${hash}`, {
    method: 'PATCH',
    body: JSON.stringify({ merge_fields: { PREFTOKEN: createToken(hash, expires) } }),
  });
  if (res.ok) ok++;
  else {
    failed++;
    console.log(`  FAIL ${email} (${res.status})`);
  }
}
console.log(`\nwrote ok=${ok} failed=${failed}`);
