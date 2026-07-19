import crypto from 'crypto';

/**
 * Email preference centre for the Ian McDonald audience.
 *
 * Mailchimp's own preference centre requires a second "email me a link" round
 * trip, which is too much friction for a topic toggle. This module backs a
 * lightweight replacement: the campaign carries a pre-generated signed token
 * (merge field PREFTOKEN), the page reads current group membership, and the
 * groups are only written when the subscriber explicitly saves.
 *
 * The token carries the Mailchimp subscriber hash (md5 of the lowercased
 * email), never the address itself, so no personal data lands in a URL.
 *
 * Signing prevents forgery, not forwarding — anyone holding the email holds the
 * token. That is an accepted trade for newsletter topic selection.
 */

const LIST_ID = '41ab191ed7';
const CATEGORY_ID = '49088a14f8';

export const GROUPS = {
  launchbox: '12632dd08f', // LaunchBox: Product + Partner Updates
  ian: '26239ebbe5', // Ian McDonald: Founder Log + AI Workshops
} as const;

export type Preferences = { launchbox: boolean; ian: boolean };

const b64url = (b: Buffer) => b.toString('base64url');

function secret(): string {
  const s = process.env.PREF_TOKEN_SECRET;
  if (!s) throw new Error('PREF_TOKEN_SECRET is not set');
  return s;
}

function sign(payload: string): string {
  return b64url(crypto.createHmac('sha256', secret()).update(payload).digest());
}

/** Build a signed token for one subscriber. Used by the backfill script. */
export function createToken(subscriberHash: string, expiresAt: Date): string {
  const payload = b64url(
    Buffer.from(JSON.stringify({ h: subscriberHash, x: Math.floor(expiresAt.getTime() / 1000) })),
  );
  return `${payload}.${sign(payload)}`;
}

/** Verify a token and return the subscriber hash, or null if invalid/expired. */
export function readToken(token: string | null | undefined): string | null {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.', 2);

  // Constant-time compare so a wrong signature can't be brute-forced by timing.
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;

  try {
    const { h, x } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (typeof h !== 'string' || typeof x !== 'number') return null;
    if (x * 1000 < Date.now()) return null;
    return h;
  } catch {
    return null;
  }
}

function mailchimp(path: string, init?: RequestInit) {
  const key = process.env.MAILCHIMP_API_KEY;
  if (!key) throw new Error('MAILCHIMP_API_KEY is not set');
  const dc = key.split('-').pop();
  return fetch(`https://${dc}.api.mailchimp.com/3.0${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${key}`).toString('base64')}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
}

/** Read current group membership. Never writes. */
export async function getPreferences(subscriberHash: string): Promise<Preferences | null> {
  const res = await mailchimp(`/lists/${LIST_ID}/members/${subscriberHash}?fields=interests,status`);
  if (!res.ok) return null;
  const data = (await res.json()) as { interests?: Record<string, boolean> };
  const interests = data.interests ?? {};
  return {
    launchbox: interests[GROUPS.launchbox] === true,
    ian: interests[GROUPS.ian] === true,
  };
}

/** Write group membership. Only ever called from an explicit save. */
export async function setPreferences(
  subscriberHash: string,
  prefs: Preferences,
): Promise<boolean> {
  const res = await mailchimp(`/lists/${LIST_ID}/members/${subscriberHash}`, {
    method: 'PATCH',
    body: JSON.stringify({
      interests: {
        [GROUPS.launchbox]: prefs.launchbox,
        [GROUPS.ian]: prefs.ian,
      },
    }),
  });
  return res.ok;
}

export const PREFERENCE_CATEGORY_ID = CATEGORY_ID;
