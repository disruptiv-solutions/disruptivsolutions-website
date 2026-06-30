import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const RESEND_FROM = process.env.RESEND_FROM ?? 'Ian McDonald <ian@ianmcdonald.ai>';
const ALERT_TO = process.env.ALERT_EMAIL ?? 'ian@ianmcdonald.ai';
const DIGEST_KEY = process.env.KIT_DIGEST_KEY ?? '';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const WORKSHEET_FIELDS: { key: string; label: string }[] = [
  { key: 'overview', label: 'Company overview' },
  { key: 'services', label: 'Core services' },
  { key: 'certifications', label: 'Certifications / categories' },
  { key: 'pastPerformance', label: 'Past performance' },
  { key: 'differentiators', label: 'Differentiators' },
  { key: 'targets', label: 'Target clients' },
  { key: 'swot', label: 'SWOT notes' },
  { key: 'goals', label: 'Top goals / KPIs' },
];

function escapeHtml(value: string): string {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function intentMeta(intent: string): { label: string; temp: string } {
  switch (intent) {
    case 'session':
      return { label: 'Wants a working session', temp: 'HOT' };
    case 'build':
      return { label: 'Wants it built for them', temp: 'HOT' };
    case 'talk':
      return { label: 'Wants to talk', temp: 'WARM' };
    case 'diy':
      return { label: 'Plans to DIY', temp: 'COLD' };
    default:
      return { label: 'Not answered', temp: '' };
  }
}

function sessionHtml(data: Record<string, unknown>): string {
  const contact = (data.contact as Record<string, unknown>) ?? {};
  const worksheet = (data.worksheet as Record<string, unknown>) ?? {};
  const name = String(contact.firstName || 'Anonymous');
  const email = String(contact.email || 'no email');
  const company = String(contact.company || '');
  const { label: intentLabel, temp } = intentMeta(String(data.intent || ''));
  const tempColor = temp === 'HOT' ? '#dc2626' : temp === 'WARM' ? '#d97706' : '#6b7280';

  const line = (label: string, value: unknown) =>
    value && String(value).trim()
      ? `<p style="margin:0 0 4px"><strong>${label}:</strong> ${escapeHtml(String(value)).replace(/\n/g, '<br>')}</p>`
      : '';

  const worksheetRows = WORKSHEET_FIELDS.map(({ key, label }) => line(label, worksheet[key])).join('');

  return `<div style="border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;margin:0 0 14px">
    <p style="margin:0 0 4px;font-size:15px;font-weight:700">${escapeHtml(name)}${company ? ` &middot; ${escapeHtml(company)}` : ''}
      ${temp ? `<span style="color:${tempColor};font-size:12px;font-weight:700"> [${temp}]</span>` : ''}</p>
    ${line('Email', email)}
    ${line('Title', data.title)}
    ${line('Intent', intentLabel)}
    ${line('Pain point', data.painPoint)}
    ${line('Average score', typeof data.averageScore === 'number' ? data.averageScore.toFixed(1) : '')}
    ${line('Wants audit', data.wantsAudit ? 'Yes' : '')}
    ${worksheetRows}
    ${line('Scorecard', data.scoresText)}
    ${line('Keeps manual', data.manualChecksText)}
    ${line('Last updated', data.updatedAtIso)}
  </div>`;
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key') ?? '';
  if (!DIGEST_KEY || key !== DIGEST_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!resend) {
    return NextResponse.json({ error: 'Email is not configured.' }, { status: 500 });
  }

  const { adminDb, error: adminError } = initFirebaseAdmin();
  if (!adminDb) {
    return NextResponse.json({ error: `Database unavailable: ${adminError ?? 'unknown'}` }, { status: 500 });
  }

  try {
    const snap = await adminDb
      .collection('workshop_kit_sessions')
      .orderBy('updatedAt', 'desc')
      .limit(300)
      .get();

    const sessions = snap.docs.map((doc) => doc.data() as Record<string, unknown>);
    const withContent = sessions.filter((s) => {
      const c = (s.contact as Record<string, unknown>) ?? {};
      return c.firstName || c.email || s.painPoint || s.scoresText;
    });

    const body = withContent.length
      ? withContent.map(sessionHtml).join('')
      : '<p>No sessions captured yet.</p>';

    await resend.emails.send({
      from: RESEND_FROM,
      to: ALERT_TO,
      subject: `Workshop kit sessions digest — ${withContent.length} ${withContent.length === 1 ? 'entry' : 'entries'}`,
      html: `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:680px">
        <p style="color:#FF7A2F;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px">Workshop Kit — All Sessions</p>
        <p style="margin:0 0 16px;color:#6b7280">${withContent.length} of ${sessions.length} captured sessions had content.</p>
        ${body}
      </div>`,
    });

    return NextResponse.json({ success: true, total: sessions.length, withContent: withContent.length });
  } catch (error) {
    console.error('[kits/sessions/digest] error:', error);
    return NextResponse.json({ error: 'Could not build digest.' }, { status: 500 });
  }
}
