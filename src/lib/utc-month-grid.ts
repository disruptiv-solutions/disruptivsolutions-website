import { formatUtcYmd } from '@/lib/daily-brief-date-slug';

export type UtcMonthCell = {
  ymd: string;
  inCurrentMonth: boolean;
  dayNum: number;
};

/** ISO week: Monday-first, 6 rows × 7 columns (UTC). */
export const buildUtcMonthWeeks = (year: number, monthIndex0: number): UtcMonthCell[][] => {
  const first = new Date(Date.UTC(year, monthIndex0, 1));
  const mondayOffset = (first.getUTCDay() + 6) % 7;
  const cursor = new Date(Date.UTC(year, monthIndex0, 1 - mondayOffset));
  const weeks: UtcMonthCell[][] = [];

  for (let w = 0; w < 6; w++) {
    const row: UtcMonthCell[] = [];
    for (let d = 0; d < 7; d++) {
      row.push({
        ymd: formatUtcYmd(cursor),
        inCurrentMonth:
          cursor.getUTCMonth() === monthIndex0 && cursor.getUTCFullYear() === year,
        dayNum: cursor.getUTCDate(),
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(row);
  }

  return weeks;
};

export const getUtcMonthStartEndYmd = (
  year: number,
  monthIndex0: number
): { start: string; end: string } => {
  const start = new Date(Date.UTC(year, monthIndex0, 1));
  const end = new Date(Date.UTC(year, monthIndex0 + 1, 0));
  return { start: formatUtcYmd(start), end: formatUtcYmd(end) };
};

export const formatUtcMonthTitle = (year: number, monthIndex0: number): string => {
  return new Date(Date.UTC(year, monthIndex0, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

/** First and last YYYY-MM-DD shown in the 6×7 UTC grid (includes adjacent-month cells). */
export const getUtcMonthGridStartEndYmd = (
  year: number,
  monthIndex0: number
): { start: string; end: string } => {
  const weeks = buildUtcMonthWeeks(year, monthIndex0);
  const cells = weeks.flat();
  return { start: cells[0].ymd, end: cells[cells.length - 1].ymd };
};
