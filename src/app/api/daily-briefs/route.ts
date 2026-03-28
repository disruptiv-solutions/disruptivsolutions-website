import { NextRequest, NextResponse } from 'next/server';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const stripEmailFields = <T extends Record<string, unknown>>(doc: T): Omit<T, 'emailHtml' | 'emailHtmlGeneratedAt'> => {
  const { emailHtml: _e, emailHtmlGeneratedAt: _g, ...rest } = doc;
  return rest;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  const { adminDb } = initFirebaseAdmin();
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
  }

  try {
    if (date) {
      // Fetch single brief by date slug
      const doc = await adminDb.collection('daily-briefs').doc(date).get();
      if (!doc.exists) {
        return NextResponse.json({ success: false, brief: null });
      }
      return NextResponse.json({ success: true, brief: doc.data() });
    }

    // Fetch all briefs, newest first
    const snapshot = await adminDb
      .collection('daily-briefs')
      .orderBy('generatedAt', 'desc')
      .limit(30)
      .get();

    const briefs = snapshot.docs.map((doc) =>
      stripEmailFields(doc.data() as Record<string, unknown>)
    );
    return NextResponse.json({ success: true, briefs });
  } catch (error) {
    console.error('[DailyBriefs API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch briefs' }, { status: 500 });
  }
}
