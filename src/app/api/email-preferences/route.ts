import { NextRequest, NextResponse } from 'next/server';
import {
  getPreferences,
  missingConfig,
  readToken,
  setPreferences,
} from '@/lib/mailchimp-preferences';

export const dynamic = 'force-dynamic';

/**
 * GET is read-only by design. Link scanners and email security gateways fetch
 * URLs before a human ever sees them, so loading this page must never change a
 * subscriber's groups — only the explicit POST below does that.
 */
export async function GET(request: NextRequest) {
  // Surface misconfiguration as itself. Without this, a missing env var throws
  // and the page renders "this link isn't valid" — pointing at the token when
  // the real fault is deployment config.
  const missing = missingConfig();
  if (missing.length) {
    console.error('[API:email-preferences] not configured:', missing.join(', '));
    return NextResponse.json({ error: 'not_configured', missing }, { status: 503 });
  }

  const hash = readToken(request.nextUrl.searchParams.get('t'));
  if (!hash) {
    console.warn('[API:email-preferences] GET rejected: invalid or expired token');
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  try {
    const prefs = await getPreferences(hash);
    if (!prefs) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    console.error('[API:email-preferences] GET failed:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const missing = missingConfig();
  if (missing.length) {
    console.error('[API:email-preferences] not configured:', missing.join(', '));
    return NextResponse.json({ error: 'not_configured', missing }, { status: 503 });
  }

  let body: { token?: string; launchbox?: unknown; ian?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const hash = readToken(body.token);
  if (!hash) {
    console.warn('[API:email-preferences] POST rejected: invalid or expired token');
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  if (typeof body.launchbox !== 'boolean' || typeof body.ian !== 'boolean') {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  try {
    const ok = await setPreferences(hash, { launchbox: body.launchbox, ian: body.ian });
    if (!ok) {
      console.error('[API:email-preferences] Mailchimp rejected the update');
      return NextResponse.json({ error: 'update_failed' }, { status: 502 });
    }
    console.log('[API:email-preferences] saved', {
      launchbox: body.launchbox,
      ian: body.ian,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API:email-preferences] POST failed:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
