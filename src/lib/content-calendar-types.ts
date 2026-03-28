export type CalendarItem = {
  id: string;
  kind: 'recurring' | 'custom';
  type: string;
  title: string;
  pushed: boolean;
  pushedAt: string | null;
  href: string | null;
  notes: string | null;
  /** Firestore `daily-briefs` doc id (e.g. 3-23-26); set for daily_brief rows. */
  briefSlug?: string | null;
  /** Admin: show daily brief email preview when brief exists in Firestore. */
  dailyBriefEmail?: boolean;
};

export type CalendarDay = {
  date: string;
  displayLabel: string;
  items: CalendarItem[];
};
