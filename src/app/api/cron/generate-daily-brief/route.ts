import { NextRequest, NextResponse } from 'next/server';
import { runDailyBriefGeneration } from '@/lib/daily-brief-generation';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/* ─── Cron window (8:00 America/Chicago) ───
 * Vercel crons are UTC-only. Two schedules (13:00 and 14:00 UTC) cover
 * 8am CT during CDT (UTC-5 → 13:00 UTC) and CST (UTC-6 → 14:00 UTC).
 * The handler exits early unless the current hour in Chicago is 8.
 */

const getHourInTimeZone = (date: Date, timeZone: string): number => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    hour12: false,
  }).formatToParts(date);
  const hour = parts.find((p) => p.type === 'hour')?.value;
  return hour ? parseInt(hour, 10) : -1;
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isVercel = process.env.VERCEL === '1';

  if (isVercel && !cronSecret) {
    return NextResponse.json(
      { error: 'CRON_SECRET must be set in Vercel project settings' },
      { status: 500 }
    );
  }

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  /* Only enforce the 8am CT window on Vercel so local/manual tests can run anytime */
  if (isVercel) {
    const chicagoHour = getHourInTimeZone(new Date(), 'America/Chicago');
    if (chicagoHour !== 8) {
      return NextResponse.json({
        skipped: true,
        reason: 'Not the 8:00 AM America/Chicago run window',
        chicagoHour,
      });
    }
  }

  return runDailyBriefGeneration();
}
