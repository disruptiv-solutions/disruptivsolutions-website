import { NextRequest, NextResponse } from 'next/server';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// Attaches booking-intake answers (role / timeline / company size) to an existing
// assessment lead. Always returns 200 so the client never blocks the actual booking.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = typeof body?.id === 'string' ? body.id : '';
    const raw =
      body?.intake && typeof body.intake === 'object'
        ? (body.intake as Record<string, unknown>)
        : {};
    const intake = {
      role: typeof raw.role === 'string' ? raw.role.slice(0, 50) : '',
      timeline: typeof raw.timeline === 'string' ? raw.timeline.slice(0, 50) : '',
      size: typeof raw.size === 'string' ? raw.size.slice(0, 50) : '',
    };

    if (id) {
      const { adminDb } = initFirebaseAdmin();
      if (adminDb) {
        try {
          await adminDb.collection('ai_assessments').doc(id).set(
            {
              bookingIntake: intake,
              bookedAt: new Date(),
              bookedAtIso: new Date().toISOString(),
            },
            { merge: true },
          );
        } catch (err) {
          console.error('[assessment/intake] update failed:', err);
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[assessment/intake] route error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
