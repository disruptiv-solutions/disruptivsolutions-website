import { NextRequest, NextResponse } from 'next/server';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { sanitizeLaunchboxWeeklyForPublic } from '@/lib/launchbox-weekly-public';

export const dynamic = 'force-dynamic';

const COLLECTION = 'launchbox-weekly';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  const { adminDb } = initFirebaseAdmin();
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
  }

  try {
    if (date) {
      const doc = await adminDb.collection(COLLECTION).doc(date.trim()).get();
      if (!doc.exists) {
        return NextResponse.json({ success: false, weekly: null });
      }
      const weekly = sanitizeLaunchboxWeeklyForPublic(doc.data());
      return NextResponse.json({ success: true, weekly });
    }

    const snapshot = await adminDb
      .collection(COLLECTION)
      .orderBy('generatedAt', 'desc')
      .limit(20)
      .get();

    const items = snapshot.docs
      .map((d) => sanitizeLaunchboxWeeklyForPublic(d.data()))
      .filter((w): w is NonNullable<typeof w> => w != null);
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('[LaunchboxWeekly API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch LaunchBox weekly issues' }, { status: 500 });
  }
}
