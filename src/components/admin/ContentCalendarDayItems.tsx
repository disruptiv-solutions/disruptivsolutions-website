'use client';

import React from 'react';
import Link from 'next/link';
import type { CalendarDay, CalendarItem } from '@/lib/content-calendar-types';

type ContentCalendarDayItemsProps = {
  day: CalendarDay;
  togglingId: string | null;
  onTogglePushed: (item: CalendarItem) => void;
  onKeyToggle: (e: React.KeyboardEvent, item: CalendarItem) => void;
  onOpenDailyBriefEmail?: (briefSlug: string) => void;
};

export const ContentCalendarDayItems: React.FC<ContentCalendarDayItemsProps> = ({
  day,
  togglingId,
  onTogglePushed,
  onKeyToggle,
  onOpenDailyBriefEmail,
}) => {
  return (
    <ul className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
      {day.items.map((item) => (
        <li
          key={item.id}
          className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-white font-medium truncate">{item.title}</span>
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-zinc-800 text-gray-300">
                {item.type.replace(/_/g, ' ')}
              </span>
              {item.kind === 'recurring' && (
                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-blue-950 text-blue-200 border border-blue-900/50">
                  Every day
                </span>
              )}
            </div>
            {item.notes ? (
              <p className="text-xs text-gray-500 truncate">{item.notes}</p>
            ) : null}
            {item.pushedAt ? (
              <p className="text-xs text-gray-600 mt-1">
                Last updated: {new Date(item.pushedAt).toLocaleString()}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span
              className={
                item.pushed
                  ? 'text-xs font-semibold px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-900/50'
                  : 'text-xs font-semibold px-2 py-1 rounded bg-amber-950 text-amber-200 border border-amber-900/50'
              }
            >
              {item.pushed ? 'Pushed' : 'Not pushed'}
            </span>
            {item.href ? (
              <Link
                href={item.href}
                className="text-xs font-medium text-red-400 hover:text-red-300 underline underline-offset-2"
              >
                Page view
              </Link>
            ) : null}
            {item.dailyBriefEmail && item.briefSlug && onOpenDailyBriefEmail ? (
              <button
                type="button"
                onClick={() => onOpenDailyBriefEmail(item.briefSlug as string)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-violet-600 text-violet-300 hover:bg-violet-950/50 transition-colors"
                aria-label="Preview and copy daily brief email HTML"
              >
                Email HTML
              </button>
            ) : null}
            {item.kind === 'custom' ? (
              <button
                type="button"
                onClick={() => void onTogglePushed(item)}
                onKeyDown={(e) => onKeyToggle(e, item)}
                disabled={togglingId === item.id}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-600 text-gray-200 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                aria-label={item.pushed ? 'Mark as not pushed' : 'Mark as pushed'}
              >
                {togglingId === item.id
                  ? '…'
                  : item.pushed
                    ? 'Mark not pushed'
                    : 'Mark pushed'}
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
};
