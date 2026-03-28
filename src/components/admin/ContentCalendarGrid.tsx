'use client';

import React from 'react';
import type { CalendarDay } from '@/lib/content-calendar-types';
import { buildUtcMonthWeeks, formatUtcMonthTitle } from '@/lib/utc-month-grid';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

type ContentCalendarGridProps = {
  year: number;
  monthIndex0: number;
  daysByYmd: Map<string, CalendarDay>;
  selectedYmd: string | null;
  onSelectYmd: (ymd: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

const getDayStatus = (day: CalendarDay | undefined): {
  label: string;
  allPushed: boolean;
  unpushedCount: number;
} => {
  if (!day || day.items.length === 0) {
    return { label: 'No data loaded', allPushed: false, unpushedCount: 0 };
  }
  const unpushed = day.items.filter((i) => !i.pushed).length;
  const allPushed = unpushed === 0;
  return {
    label: allPushed ? 'All items pushed' : `${unpushed} not pushed`,
    allPushed,
    unpushedCount: unpushed,
  };
};

export const ContentCalendarGrid: React.FC<ContentCalendarGridProps> = ({
  year,
  monthIndex0,
  daysByYmd,
  selectedYmd,
  onSelectYmd,
  onPrevMonth,
  onNextMonth,
}) => {
  const weeks = buildUtcMonthWeeks(year, monthIndex0);
  const title = formatUtcMonthTitle(year, monthIndex0);

  const handleKeyNav = (e: React.KeyboardEvent, ymd: string) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onSelectYmd(ymd);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <h2 className="text-lg font-semibold text-white">{title} (UTC)</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="px-3 py-1.5 rounded-lg border border-zinc-600 text-sm text-gray-200 hover:bg-zinc-800 transition-colors"
            aria-label="Previous month"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="px-3 py-1.5 rounded-lg border border-zinc-600 text-sm text-gray-200 hover:bg-zinc-800 transition-colors"
            aria-label="Next month"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="p-2 sm:p-4" role="grid" aria-label={`Content calendar for ${title}`}>
        <div
          className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
          role="row"
        >
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="py-1" role="columnheader">
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1 mb-1" role="row">
            {week.map((cell) => {
              const day = daysByYmd.get(cell.ymd);
              const status = getDayStatus(day);
              const isSelected = selectedYmd === cell.ymd;

              return (
                <button
                  key={cell.ymd}
                  type="button"
                  role="gridcell"
                  onClick={() => onSelectYmd(cell.ymd)}
                  onKeyDown={(e) => handleKeyNav(e, cell.ymd)}
                  aria-label={`${cell.ymd}, ${status.label}`}
                  aria-selected={isSelected}
                  className={[
                    'min-h-[4.5rem] sm:min-h-[5.5rem] rounded-lg border p-1.5 sm:p-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                    cell.inCurrentMonth
                      ? 'border-zinc-700 bg-zinc-950/80'
                      : 'border-zinc-800/60 bg-zinc-950/30 opacity-70',
                    isSelected ? 'ring-2 ring-violet-500 border-violet-500/50' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span
                    className={
                      cell.inCurrentMonth
                        ? 'text-sm font-semibold text-white'
                        : 'text-sm font-medium text-gray-500'
                    }
                  >
                    {cell.dayNum}
                  </span>
                  {day ? (
                    <div className="mt-1 flex flex-col gap-0.5">
                      <span
                        className={
                          status.allPushed
                            ? 'inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-medium text-emerald-400/90'
                            : 'inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-medium text-amber-300/90'
                        }
                      >
                        <span
                          className={
                            status.allPushed ? 'text-emerald-400' : 'text-amber-400'
                          }
                          aria-hidden
                        >
                          ●
                        </span>
                        {status.allPushed ? 'All pushed' : `${status.unpushedCount} open`}
                      </span>
                      <span className="text-[9px] text-gray-500 line-clamp-2">
                        {day.items.map((i) => i.title).join(' · ')}
                      </span>
                    </div>
                  ) : (
                    <span className="mt-1 block text-[9px] text-gray-600">—</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/40 flex flex-wrap gap-4 text-xs text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-emerald-400" aria-hidden>
            ●
          </span>
          All items pushed for that day
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-amber-400" aria-hidden>
            ●
          </span>
          Something still not pushed
        </span>
      </div>
    </div>
  );
};
