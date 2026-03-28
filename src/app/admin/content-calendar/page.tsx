'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminRoute } from '@/components/AdminRoute';
import { useAuth } from '@/contexts/AuthContext';
import { ContentCalendarGrid } from '@/components/admin/ContentCalendarGrid';
import { ContentCalendarDayItems } from '@/components/admin/ContentCalendarDayItems';
import { DailyBriefEmailModal } from '@/components/admin/DailyBriefEmailModal';
import type { CalendarDay, CalendarItem } from '@/lib/content-calendar-types';
import { formatUtcYmd } from '@/lib/daily-brief-date-slug';
import { getUtcMonthGridStartEndYmd } from '@/lib/utc-month-grid';

type ViewMode = 'list' | 'calendar';

const fetchCalendarList = async (token: string): Promise<CalendarDay[]> => {
  const res = await fetch('/api/admin/content-calendar?days=45', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load calendar');
  }
  return data.days as CalendarDay[];
};

const fetchCalendarRange = async (
  token: string,
  start: string,
  end: string
): Promise<CalendarDay[]> => {
  const params = new URLSearchParams({ start, end });
  const res = await fetch(`/api/admin/content-calendar?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load calendar');
  }
  return data.days as CalendarDay[];
};

const ContentCalendarPage = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formDate, setFormDate] = useState('');
  const [formType, setFormType] = useState<'newsletter' | 'social' | 'other'>('newsletter');
  const [formTitle, setFormTitle] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [utcMonth, setUtcMonth] = useState(() => {
    const now = new Date();
    return { y: now.getUTCFullYear(), m0: now.getUTCMonth() };
  });
  const [selectedYmd, setSelectedYmd] = useState<string | null>(null);
  const [emailModalSlug, setEmailModalSlug] = useState<string | null>(null);

  const getIdTokenForEmail = useCallback(async () => {
    if (!user) {
      throw new Error('Not signed in');
    }
    return user.getIdToken();
  }, [user]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoadError(null);
    setLoading(true);
    try {
      const token = await user.getIdToken();
      let nextDays: CalendarDay[];
      if (viewMode === 'list') {
        nextDays = await fetchCalendarList(token);
      } else {
        const { start, end } = getUtcMonthGridStartEndYmd(utcMonth.y, utcMonth.m0);
        nextDays = await fetchCalendarRange(token, start, end);
      }
      setDays(nextDays);
      if (viewMode === 'calendar') {
        setSelectedYmd((prev) => {
          if (prev && nextDays.some((d) => d.date === prev)) {
            return prev;
          }
          const today = formatUtcYmd(new Date());
          if (nextDays.some((d) => d.date === today)) {
            return today;
          }
          return nextDays[0]?.date ?? null;
        });
      }
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [user, viewMode, utcMonth.y, utcMonth.m0]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const daysByYmd = useMemo(() => {
    const m = new Map<string, CalendarDay>();
    for (const d of days) {
      m.set(d.date, d);
    }
    return m;
  }, [days]);

  const selectedDay = selectedYmd ? daysByYmd.get(selectedYmd) : undefined;

  const handleRefresh = () => {
    void loadData();
  };

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handlePrevMonth = () => {
    setUtcMonth((prev) => {
      if (prev.m0 <= 0) {
        return { y: prev.y - 1, m0: 11 };
      }
      return { y: prev.y, m0: prev.m0 - 1 };
    });
  };

  const handleNextMonth = () => {
    setUtcMonth((prev) => {
      if (prev.m0 >= 11) {
        return { y: prev.y + 1, m0: 0 };
      }
      return { y: prev.y, m0: prev.m0 + 1 };
    });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formDate.trim() || !formTitle.trim()) return;
    setSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/content-calendar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduledDate: formDate.trim(),
          type: formType,
          title: formTitle.trim(),
          notes: formNotes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Save failed');
      }
      setFormTitle('');
      setFormNotes('');
      await loadData();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePushed = async (item: CalendarItem) => {
    if (!user || item.kind === 'recurring') return;
    setTogglingId(item.id);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/content-calendar', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id, pushed: !item.pushed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Update failed');
      }
      await loadData();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setTogglingId(null);
    }
  };

  const handleKeyToggle = (e: React.KeyboardEvent, item: CalendarItem) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    void handleTogglePushed(item);
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Content calendar</h1>
              <p className="text-gray-400 text-sm max-w-xl">
                Planned content by day. The daily AI brief is scheduled every day; &quot;Pushed&quot; means a
                brief exists in Firestore for that UTC date (same as the cron). Add other slots below.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
                aria-label="Refresh calendar"
              >
                Refresh
              </button>
              <Link
                href="/admin"
                className="px-4 py-2 bg-zinc-900 border border-gray-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors inline-flex items-center justify-center"
              >
                ← Admin
              </Link>
            </div>
          </div>

          <div
            className="flex flex-wrap gap-2 mb-6"
            role="tablist"
            aria-label="Calendar display mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'list'}
              onClick={() => handleViewChange('list')}
              className={
                viewMode === 'list'
                  ? 'px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white'
                  : 'px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 border border-zinc-700 text-gray-300 hover:bg-zinc-800'
              }
            >
              List view
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'calendar'}
              onClick={() => handleViewChange('calendar')}
              className={
                viewMode === 'calendar'
                  ? 'px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white'
                  : 'px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 border border-zinc-700 text-gray-300 hover:bg-zinc-800'
              }
            >
              Calendar view
            </button>
          </div>

          <p className="text-xs text-amber-200/80 mb-6 border border-amber-900/40 bg-amber-950/20 rounded-lg px-3 py-2">
            Dates use <span className="font-semibold">UTC</span> (YYYY-MM-DD) to match Vercel cron and brief
            document IDs.
          </p>

          {loadError && (
            <div
              className="mb-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-red-200 text-sm"
              role="alert"
            >
              {loadError}
            </div>
          )}

          <section
            className="mb-10 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6"
            aria-labelledby="add-content-heading"
          >
            <h2 id="add-content-heading" className="text-lg font-semibold text-white mb-4">
              Add scheduled item
            </h2>
            <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="cc-date" className="text-xs text-gray-400">
                  Date (UTC YYYY-MM-DD)
                </label>
                <input
                  id="cc-date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                  className="rounded-lg bg-zinc-950 border border-zinc-700 text-white px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="cc-type" className="text-xs text-gray-400">
                  Type
                </label>
                <select
                  id="cc-type"
                  value={formType}
                  onChange={(e) =>
                    setFormType(e.target.value as 'newsletter' | 'social' | 'other')
                  }
                  className="rounded-lg bg-zinc-950 border border-zinc-700 text-white px-3 py-2 text-sm"
                >
                  <option value="newsletter">Newsletter</option>
                  <option value="social">Social</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-2">
                <label htmlFor="cc-title" className="text-xs text-gray-400">
                  Title
                </label>
                <input
                  id="cc-title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. LinkedIn thread — AI tools"
                  required
                  className="rounded-lg bg-zinc-950 border border-zinc-700 text-white px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-4">
                <label htmlFor="cc-notes" className="text-xs text-gray-400">
                  Notes (optional)
                </label>
                <input
                  id="cc-notes"
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="rounded-lg bg-zinc-950 border border-zinc-700 text-white px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Add to calendar'}
                </button>
              </div>
            </form>
          </section>

          {loading ? (
            <p className="text-gray-400">Loading calendar…</p>
          ) : viewMode === 'list' ? (
            <div className="space-y-3" role="tabpanel" aria-label="List view">
              {days.map((day) => (
                <article
                  key={day.date}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-white font-semibold">{day.displayLabel}</h3>
                    <span className="text-xs font-mono text-gray-500">{day.date}</span>
                  </div>
                  <ContentCalendarDayItems
                    day={day}
                    togglingId={togglingId}
                    onTogglePushed={handleTogglePushed}
                    onKeyToggle={handleKeyToggle}
                    onOpenDailyBriefEmail={setEmailModalSlug}
                  />
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-6" role="tabpanel" aria-label="Calendar view">
              <ContentCalendarGrid
                year={utcMonth.y}
                monthIndex0={utcMonth.m0}
                daysByYmd={daysByYmd}
                selectedYmd={selectedYmd}
                onSelectYmd={setSelectedYmd}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />

              <section aria-live="polite" className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-white mb-1">Selected day</h3>
                <p className="text-xs text-gray-500 mb-4 font-mono">{selectedYmd ?? 'None'}</p>
                {!selectedYmd ? (
                  <p className="text-sm text-gray-400">Select a day on the grid.</p>
                ) : !selectedDay ? (
                  <p className="text-sm text-gray-400">
                    No rows loaded for this date. Change month or refresh.
                  </p>
                ) : (
                  <ContentCalendarDayItems
                    day={selectedDay}
                    togglingId={togglingId}
                    onTogglePushed={handleTogglePushed}
                    onKeyToggle={handleKeyToggle}
                    onOpenDailyBriefEmail={setEmailModalSlug}
                  />
                )}
              </section>
            </div>
          )}

          <DailyBriefEmailModal
            isOpen={emailModalSlug !== null}
            briefSlug={emailModalSlug}
            onClose={() => setEmailModalSlug(null)}
            getIdToken={getIdTokenForEmail}
          />
        </div>
      </div>
    </AdminRoute>
  );
};

export default ContentCalendarPage;
