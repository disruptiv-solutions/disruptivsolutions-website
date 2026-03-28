/**
 * Daily brief Firestore doc IDs match the cron job (Vercel UTC).
 * Same formula as `generate-daily-brief` route.
 */
export const utcDateToBriefSlug = (date: Date): string => {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month}-${day}-${String(year).slice(2)}`;
};

/** YYYY-MM-DD in UTC for a given instant */
export const formatUtcYmd = (date: Date): string => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/** UTC midnight for YYYY-MM-DD */
export const parseUtcYmd = (ymd: string): Date => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
};

/** Inclusive range of UTC calendar days as YYYY-MM-DD strings */
export const eachUtcYmdInRange = (startYmd: string, endYmd: string): string[] => {
  const start = parseUtcYmd(startYmd);
  const end = parseUtcYmd(endYmd);
  if (start.getTime() > end.getTime()) return [];

  const out: string[] = [];
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    out.push(formatUtcYmd(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
};
