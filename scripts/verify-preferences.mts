/**
 * Exercises the real preference-centre lib against the live Mailchimp audience.
 * Read-only unless run with --write.
 *
 *   npx tsx scripts/verify-preferences.mts
 *   npx tsx scripts/verify-preferences.mts --write
 */
import crypto from 'crypto';
import { createToken, getPreferences, readToken, setPreferences } from '../src/lib/mailchimp-preferences.ts';

const EMAIL = 'ian@ianmcdonald.ai';
const hash = crypto.createHash('md5').update(EMAIL.toLowerCase()).digest('hex');
const ok = (label: string, pass: boolean) => console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${label}`);

const hour = new Date(Date.now() + 3600_000);
const token = createToken(hash, hour);

console.log('TOKEN SECURITY');
ok('valid token round-trips to the subscriber hash', readToken(token) === hash);
ok('token contains no email address', !token.includes('@') && !Buffer.from(token.split('.')[0], 'base64url').toString().includes('@'));
ok('tampered payload rejected', readToken('x' + token) === null);
ok('tampered signature rejected', readToken(token.split('.')[0] + '.' + 'A'.repeat(43)) === null);
ok('expired token rejected', readToken(createToken(hash, new Date(Date.now() - 1000))) === null);
ok('garbage rejected', readToken('not-a-token') === null);
ok('empty rejected', readToken('') === null);

console.log('\nMAILCHIMP READ (live)');
const before = await getPreferences(hash);
console.log('  current:', JSON.stringify(before));
ok('read returned a result', before !== null);
ok('unknown subscriber returns null', (await getPreferences('0'.repeat(32))) === null);

if (process.argv.includes('--write')) {
  console.log('\nMAILCHIMP WRITE (live)');
  const target = { launchbox: !before!.launchbox, ian: before!.ian };
  console.log('  writing:', JSON.stringify(target));
  ok('write accepted', await setPreferences(hash, target));
  const after = await getPreferences(hash);
  console.log('  now    :', JSON.stringify(after));
  ok('change persisted', after!.launchbox === target.launchbox);
} else {
  console.log('\n(skipping write test — pass --write to exercise it)');
}
