import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminBearer } from '@/lib/verify-admin-request';
import { runDailyBriefGeneration } from '@/lib/daily-brief-generation';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/**
 * Admin-only manual trigger for daily brief generation (e.g. newsletter directory).
 * Uses Firebase ID token — do not expose CRON_SECRET to the browser.
 */
export async function POST(request: NextRequest) {
  const adminUser = await verifyAdminBearer(request);
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return runDailyBriefGeneration();
}
