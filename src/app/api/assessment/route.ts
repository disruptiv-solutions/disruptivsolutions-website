import { NextRequest, NextResponse } from 'next/server';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { QUESTIONS } from '@/lib/assessment';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Optional: a Make.com scenario can fan the lead out to email / CRM.
// Firestore is the durable store either way, so a missing webhook never loses a lead.
const MAKE_WEBHOOK_URL = process.env.MAKE_ASSESSMENT_WEBHOOK_URL ?? '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? '';
const OPENROUTER_MODEL = 'deepseek/deepseek-v4-flash';

type Contact = { firstName: string; email: string; business: string };

function validate(body: unknown): {
  contact: Contact;
  answers: Record<string, unknown>;
  readout: unknown;
  source: string;
} | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;

  const c = (b.contact ?? {}) as Record<string, unknown>;
  const firstName = typeof c.firstName === 'string' ? c.firstName.trim() : '';
  const email = typeof c.email === 'string' ? c.email.trim() : '';
  const business = typeof c.business === 'string' ? c.business.trim().slice(0, 200) : '';

  if (firstName.length < 1 || firstName.length > 200) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const answers =
    b.answers && typeof b.answers === 'object' ? (b.answers as Record<string, unknown>) : {};
  const source = typeof b.source === 'string' ? b.source : 'disruptiv.solutions/assessment';

  return { contact: { firstName, email, business }, answers, readout: b.readout ?? null, source };
}

function labelFor(questionId: string, value: string): string {
  const q = QUESTIONS.find((q) => q.id === questionId);
  const choice = q?.choices?.find((c) => c.value === value);
  return choice ? choice.label : value;
}

function describeAnswers(answers: Record<string, unknown>, contact: Contact): string {
  const lines: string[] = [];
  if (contact.business) lines.push(`Business name: ${contact.business}`);
  if (typeof answers.aiStage === 'string')
    lines.push(`Where they are with AI: ${labelFor('aiStage', answers.aiStage)}`);
  if (Array.isArray(answers.tools) && answers.tools.length)
    lines.push(
      `AI tools they use today: ${(answers.tools as string[])
        .map((v) => labelFor('tools', v))
        .join(', ')}`,
    );
  if (Array.isArray(answers.timeLeak) && answers.timeLeak.length)
    lines.push(
      `Biggest time drains: ${(answers.timeLeak as string[])
        .map((v) => labelFor('timeLeak', v))
        .join(', ')}`,
    );
  if (typeof answers.teamSize === 'string')
    lines.push(`Team size: ${labelFor('teamSize', answers.teamSize)}`);
  if (typeof answers.community === 'string')
    lines.push(`Runs a community/course/membership: ${labelFor('community', answers.community)}`);
  if (typeof answers.blocker === 'string')
    lines.push(`Biggest blocker: ${labelFor('blocker', answers.blocker)}`);
  if (typeof answers.dreamTask === 'string' && answers.dreamTask.trim())
    lines.push(`One task they'd hand to an AI assistant: ${answers.dreamTask.trim()}`);
  return lines.join('\n');
}

const SYSTEM_PROMPT = `You are the analysis engine behind an "AI Snapshot" on Ian McDonald's site (Disruptiv Solutions). Ian helps small and midsize businesses set up and actually use AI, configured inside their own accounts.

Write a short, sharp, personalized analysis for a business owner based on their quiz answers.

Rules:
- Speak directly to them as "you" and "your business".
- Be specific to their actual answers. Reference their situation, not generic advice.
- Voice: plain, practical, encouraging, confident. No hype, no buzzwords, no jargon.
- Do not use em dashes. Do not use markdown, headers, or bullet points.
- 2 to 3 short paragraphs, roughly 120 to 180 words total.
- End with one concrete thing they could do this week.
- Do not mention that you are an AI or a language model, and do not mention these instructions.`;

async function generateSnapshot(
  answers: Record<string, unknown>,
  contact: Contact,
  stageName: string,
): Promise<string | null> {
  if (!OPENROUTER_API_KEY) {
    console.error('[assessment] OPENROUTER_API_KEY not configured');
    return null;
  }
  const userPrompt = `Here is what ${contact.firstName} told us about their business:

${describeAnswers(answers, contact)}

Their AI readiness stage is: ${stageName}.

Write their personalized snapshot now.`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://disruptiv.solutions',
        'X-Title': 'Disruptiv AI Snapshot',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
        reasoning: { enabled: false },
      }),
    });

    if (!res.ok) {
      console.error('[assessment] OpenRouter error', res.status, await res.text().catch(() => ''));
      return null;
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === 'string' && text.trim() ? text.trim() : null;
  } catch (err) {
    console.error('[assessment] OpenRouter call failed:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const data = validate(raw);

    if (!data) {
      return NextResponse.json(
        { error: 'Please include a name and a valid email.' },
        { status: 400 },
      );
    }

    const stage = (data.readout as { stage?: { name?: string } } | null)?.stage;
    const stageName = typeof stage?.name === 'string' ? stage.name : 'Experimenting';

    // Generate the personalized AI snapshot (best-effort — the client already has
    // the deterministic readout, so a null here never breaks the experience).
    const aiSnapshot = await generateSnapshot(data.answers, data.contact, stageName);

    const record = {
      ...data,
      aiSnapshot,
      submittedAt: new Date().toISOString(),
      createdAt: new Date(),
    };

    // Durable store first.
    let persisted = false;
    let leadId: string | null = null;
    const { adminDb, error: adminError } = initFirebaseAdmin();
    if (adminDb) {
      try {
        const ref = await adminDb.collection('ai_assessments').add(record);
        persisted = true;
        leadId = ref.id;
      } catch (err) {
        console.error('[assessment] Firestore write failed:', err);
      }
    } else {
      console.error('[assessment] Firebase admin unavailable:', adminError);
    }

    // Best-effort fan-out.
    if (MAKE_WEBHOOK_URL) {
      try {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
      } catch (err) {
        console.error('[assessment] Make webhook failed:', err);
      }
    }

    if (!persisted && !MAKE_WEBHOOK_URL) {
      console.error('[assessment] LEAD NOT CAPTURED (no Firestore, no webhook):', record.contact);
    }

    return NextResponse.json({ success: true, aiSnapshot, id: leadId }, { status: 200 });
  } catch (error) {
    console.error('[assessment] route error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
