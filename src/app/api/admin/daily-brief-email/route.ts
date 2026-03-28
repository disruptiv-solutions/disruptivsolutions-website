import { NextRequest, NextResponse } from 'next/server';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { verifyAdminBearer } from '@/lib/verify-admin-request';
import {
  buildDailyBriefEmailContext,
  renderDailyBriefEmailHtml,
  type DailyBriefForEmail,
} from '@/lib/daily-brief-email-template';

export const dynamic = 'force-dynamic';

type FirestoreBriefDoc = DailyBriefForEmail & {
  emailHtml?: string;
  emailHtmlGeneratedAt?: string;
  date?: string;
  generatedAt?: string;
  tweetCount?: number;
};

const toEmailPayload = (data: FirestoreBriefDoc): DailyBriefForEmail => ({
  title: data.title,
  editorNote: data.editorNote,
  displayDate: data.displayDate,
  stories: data.stories ?? [],
  quickLinks: data.quickLinks ?? [],
  toolOfTheDay: data.toolOfTheDay ?? null,
});

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdminBearer(request);
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = new URL(request.url).searchParams.get('slug')?.trim();
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug query param' }, { status: 400 });
  }

  const { adminDb, error } = initFirebaseAdmin();
  if (!adminDb) {
    return NextResponse.json(
      { error: error || 'Firebase Admin not configured' },
      { status: 500 }
    );
  }

  try {
    const ref = adminDb.collection('daily-briefs').doc(slug);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }

    const data = snap.data() as FirestoreBriefDoc;

    if (data.emailHtml && typeof data.emailHtml === 'string') {
      const ctx = buildDailyBriefEmailContext(toEmailPayload(data));
      return NextResponse.json({
        success: true,
        slug,
        html: data.emailHtml,
        subject_line: ctx.subject_line,
        cached: true,
        emailHtmlGeneratedAt: data.emailHtmlGeneratedAt ?? null,
      });
    }

    const html = renderDailyBriefEmailHtml(toEmailPayload(data));
    const ctx = buildDailyBriefEmailContext(toEmailPayload(data));
    const emailHtmlGeneratedAt = new Date().toISOString();

    await ref.update({
      emailHtml: html,
      emailHtmlGeneratedAt,
    });

    return NextResponse.json({
      success: true,
      slug,
      html,
      subject_line: ctx.subject_line,
      cached: false,
      emailHtmlGeneratedAt,
    });
  } catch (e) {
    console.error('[admin/daily-brief-email]', e);
    return NextResponse.json({ error: 'Failed to build email HTML' }, { status: 500 });
  }
}
