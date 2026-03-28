import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminBearer } from '@/lib/verify-admin-request';
import { runLaunchboxWeeklyGeneration } from '@/lib/launchbox-weekly-generation';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/**
 * Admin-only manual trigger for LaunchBox weekly platform update digest.
 */
export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAdminBearer(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return await runLaunchboxWeeklyGeneration();
  } catch (e) {
    console.error('[admin/generate-launchbox-weekly] unhandled:', e);
    return NextResponse.json(
      {
        error: 'Unhandled server error',
        details: e instanceof Error ? e.message : String(e),
        step: 'admin',
      },
      { status: 500 }
    );
  }
}
