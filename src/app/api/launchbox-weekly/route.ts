import { NextRequest, NextResponse } from 'next/server';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

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
      return NextResponse.json({ success: true, weekly: doc.data() });
    }

    const snapshot = await adminDb
      .collection(COLLECTION)
      .orderBy('generatedAt', 'desc')
      .limit(20)
      .get();

    const items = snapshot.docs.map((d) => d.data());
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('[LaunchboxWeekly API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch LaunchBox weekly issues' }, { status: 500 });
  }
}
