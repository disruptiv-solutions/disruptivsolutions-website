import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const RESEND_FROM = process.env.RESEND_FROM ?? 'Ian McDonald <ian@ianmcdonald.ai>';
const ALERT_TO = process.env.ALERT_EMAIL ?? 'ian@ianmcdonald.ai';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

type Worksheet = {
  overview: string;
  services: string;
  certifications: string;
  pastPerformance: string;
  differentiators: string;
  targets: string;
  swot: string;
  goals: string;
};

type KitLead = {
  kitSlug: string;
  source: string;
  contact: {
    firstName: string;
    email: string;
    company: string;
    businessType: string;
  };
  title: string;
  wantsAudit: boolean;
  painPoint: string;
  intent: string;
  selectedWorkflow: string;
  averageScore: number;
  worksheet: Worksheet;
  scoresText: string;
  manualChecksText: string;
  sessionId: string;
  authUid: string | null;
};

const WORKSHEET_FIELDS: { key: keyof Worksheet; label: string }[] = [
  { key: 'overview', label: 'Company overview' },
  { key: 'services', label: 'Core services' },
  { key: 'certifications', label: 'Certifications / categories' },
  { key: 'pastPerformance', label: 'Past performance' },
  { key: 'differentiators', label: 'Differentiators' },
  { key: 'targets', label: 'Target clients' },
  { key: 'swot', label: 'SWOT notes' },
  { key: 'goals', label: 'Top goals / KPIs' },
];

function parseWorksheet(data: Record<string, unknown>): Worksheet {
  const raw =
    data.worksheet && typeof data.worksheet === 'object'
      ? (data.worksheet as Record<string, unknown>)
      : {};
  return WORKSHEET_FIELDS.reduce((acc, { key }) => {
    acc[key] = typeof raw[key] === 'string' ? (raw[key] as string).trim().slice(0, 4000) : '';
    return acc;
  }, {} as Worksheet);
}

function cleanSessionId(value: unknown): string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{8,80}$/.test(value) ? value : '';
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateLead(body: unknown): KitLead | null {
  if (!body || typeof body !== 'object') return null;
  const data = body as Record<string, unknown>;
  const rawContact =
    data.contact && typeof data.contact === 'object'
      ? (data.contact as Record<string, unknown>)
      : {};
  const firstName = typeof rawContact.firstName === 'string' ? rawContact.firstName.trim() : '';
  const email = typeof rawContact.email === 'string' ? rawContact.email.trim() : '';
  if (!firstName || firstName.length > 120 || !validEmail(email)) return null;

  return {
    title: typeof data.title === 'string' ? data.title.trim().slice(0, 200) : '',
    worksheet: parseWorksheet(data),
    scoresText: typeof data.scoresText === 'string' ? data.scoresText.trim().slice(0, 2000) : '',
    manualChecksText:
      typeof data.manualChecksText === 'string' ? data.manualChecksText.trim().slice(0, 2000) : '',
    sessionId: cleanSessionId(data.sessionId),
    kitSlug:
      typeof data.kitSlug === 'string'
        ? data.kitSlug.trim().slice(0, 120)
        : 'unknown-kit',
    source:
      typeof data.source === 'string'
        ? data.source.trim().slice(0, 240)
        : 'ianmcdonald.ai/kits',
    contact: {
      firstName,
      email,
      company:
        typeof rawContact.company === 'string' ? rawContact.company.trim().slice(0, 200) : '',
      businessType:
        typeof rawContact.businessType === 'string'
          ? rawContact.businessType.trim().slice(0, 200)
          : '',
    },
    wantsAudit: Boolean(data.wantsAudit),
    painPoint:
      typeof data.painPoint === 'string' ? data.painPoint.trim().slice(0, 1000) : '',
    intent: typeof data.intent === 'string' ? data.intent.trim().slice(0, 40) : '',
    selectedWorkflow:
      typeof data.selectedWorkflow === 'string'
        ? data.selectedWorkflow.trim().slice(0, 120)
        : '',
    averageScore: typeof data.averageScore === 'number' ? data.averageScore : 0,
    authUid: typeof data.authUid === 'string' ? data.authUid : null,
  };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function intentMeta(intent: string): { label: string; temp: string } {
  switch (intent) {
    case 'session':
      return { label: 'Wants a working session on their growth plan', temp: 'HOT' };
    case 'build':
      return { label: 'Wants their AI systems built for them', temp: 'HOT' };
    case 'talk':
      return { label: 'Not sure yet, wants to talk', temp: 'WARM' };
    case 'diy':
      return { label: 'Plans to run with the kit themselves', temp: 'COLD' };
    default:
      return { label: 'Not answered', temp: '' };
  }
}

function worksheetHtml(lead: KitLead): string {
  const rows = WORKSHEET_FIELDS.filter(({ key }) => lead.worksheet[key])
    .map(
      ({ key, label }) =>
        `<p style="margin:0 0 8px"><strong>${label}:</strong><br>${escapeHtml(lead.worksheet[key]).replace(/\n/g, '<br>')}</p>`,
    )
    .join('');
  const scores = lead.scoresText
    ? `<p style="margin:0 0 8px"><strong>Readiness scorecard:</strong><br>${escapeHtml(lead.scoresText).replace(/\n/g, '<br>')}</p>`
    : '';
  const manual = lead.manualChecksText
    ? `<p style="margin:0 0 8px"><strong>What they keep manual:</strong><br>${escapeHtml(lead.manualChecksText).replace(/\n/g, '<br>')}</p>`
    : '';
  if (!rows && !scores && !manual) return '';
  return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0">
        <p style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#FF7A2F;margin:0 0 10px">Their worksheet answers</p>
        ${rows}${scores}${manual}`;
}

async function sendLeadAlert(lead: KitLead, id: string | null): Promise<void> {
  if (!resend) return;
  const { label: intentLabel, temp } = intentMeta(lead.intent);
  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: ALERT_TO,
      replyTo: lead.contact.email,
      subject: `${temp ? `[${temp}] ` : ''}New workshop kit lead: ${lead.contact.firstName}${lead.contact.company ? ` (${lead.contact.company})` : ''}`,
      html: `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:620px">
        <p style="color:#dc2626;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px">Workshop Kit Lead</p>
        <h2 style="margin:0 0 12px">${escapeHtml(lead.contact.firstName)} asked for follow-up from ${escapeHtml(lead.kitSlug)}</h2>
        ${temp ? `<p style="margin:0 0 10px;font-size:14px;font-weight:700">Lead temperature: <span style="color:${temp === 'HOT' ? '#dc2626' : temp === 'WARM' ? '#d97706' : '#6b7280'}">${temp}</span></p>` : ''}
        <p style="margin:0 0 6px"><strong>Intent:</strong> ${escapeHtml(intentLabel)}</p>
        <p style="margin:0 0 6px"><strong>Email:</strong> ${escapeHtml(lead.contact.email)}</p>
        <p style="margin:0 0 6px"><strong>Company:</strong> ${escapeHtml(lead.contact.company || 'Not provided')}</p>
        <p style="margin:0 0 6px"><strong>Title:</strong> ${escapeHtml(lead.title || 'Not provided')}</p>
        <p style="margin:0 0 6px"><strong>Business type:</strong> ${escapeHtml(lead.contact.businessType || 'Not provided')}</p>
        <p style="margin:0 0 6px"><strong>Biggest pain point:</strong> ${escapeHtml(lead.painPoint || 'Not provided')}</p>
        <p style="margin:0 0 6px"><strong>Average score:</strong> ${lead.averageScore.toFixed(1)}</p>
        <p style="margin:0 0 6px"><strong>Wants audit:</strong> ${lead.wantsAudit ? 'Yes' : 'No'}</p>
        <p style="margin:0 0 6px"><strong>Source:</strong> ${escapeHtml(lead.source)}</p>
        ${worksheetHtml(lead)}
        ${id ? `<p style="margin:18px 0 0;color:#6b7280">Firestore id: ${escapeHtml(id)}</p>` : ''}
      </div>`,
    });
  } catch (error) {
    console.error('[kits/leads] alert email failed:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const lead = validateLead(await request.json());
    if (!lead) {
      return NextResponse.json(
        { error: 'Please include a first name and valid email.' },
        { status: 400 },
      );
    }

    const record = {
      ...lead,
      submittedAtIso: new Date().toISOString(),
      submittedAt: new Date(),
      type: 'kit_follow_up_capture',
    };

    let id: string | null = null;
    const { adminDb, error: adminError } = initFirebaseAdmin();
    if (adminDb) {
      try {
        const ref = await adminDb.collection('workshop_kit_leads').add(record);
        id = ref.id;
      } catch (error) {
        console.error('[kits/leads] Firestore write failed:', error);
      }
    } else {
      console.error('[kits/leads] Firebase admin unavailable:', adminError);
    }

    await sendLeadAlert(lead, id);

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error('[kits/leads] POST error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

// Anonymous progress autosave. Captures everything a participant fills in across
// the slides, keyed to a per-browser session id, even if they never submit the
// opt-in form. No email is sent here; opt-ins still flow through POST.
export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json()) as Record<string, unknown>;
    const sessionId = cleanSessionId(data.sessionId);
    if (!sessionId) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    const rawContact =
      data.contact && typeof data.contact === 'object'
        ? (data.contact as Record<string, unknown>)
        : {};
    const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

    const snapshot = {
      sessionId,
      kitSlug:
        typeof data.kitSlug === 'string' ? data.kitSlug.trim().slice(0, 120) : 'supplier-readiness-builder',
      contact: {
        firstName: str(rawContact.firstName, 120),
        email: str(rawContact.email, 200),
        company: str(rawContact.company, 200),
        businessType: str(rawContact.businessType, 200),
      },
      title: str(data.title, 200),
      painPoint: str(data.painPoint, 1000),
      intent: str(data.intent, 40),
      wantsAudit: Boolean(data.wantsAudit),
      averageScore: typeof data.averageScore === 'number' ? data.averageScore : 0,
      worksheet: parseWorksheet(data),
      scoresText: str(data.scoresText, 2000),
      manualChecksText: str(data.manualChecksText, 2000),
      type: 'kit_session_autosave',
      updatedAt: new Date(),
      updatedAtIso: new Date().toISOString(),
    };

    const { adminDb } = initFirebaseAdmin();
    if (adminDb) {
      try {
        await adminDb.collection('workshop_kit_sessions').doc(sessionId).set(snapshot, { merge: true });
      } catch (error) {
        console.error('[kits/leads] session autosave failed:', error);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[kits/leads] PUT error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === 'string' ? body.id : '';
    const patch = {
      wantsAudit: Boolean(body.wantsAudit),
      selectedWorkflow:
        typeof body.selectedWorkflow === 'string' ? body.selectedWorkflow.slice(0, 120) : '',
      averageScore: typeof body.averageScore === 'number' ? body.averageScore : 0,
      company: typeof body.company === 'string' ? body.company.slice(0, 200) : '',
      businessType: typeof body.businessType === 'string' ? body.businessType.slice(0, 200) : '',
      auditRequestedAt: new Date(),
      auditRequestedAtIso: new Date().toISOString(),
    };

    if (id) {
      const { adminDb } = initFirebaseAdmin();
      if (adminDb) {
        try {
          await adminDb.collection('workshop_kit_leads').doc(id).set(patch, { merge: true });
        } catch (error) {
          console.error('[kits/leads] PATCH Firestore update failed:', error);
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[kits/leads] PATCH error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
