'use client';

import React, { useCallback, useEffect, useState } from 'react';

type DailyBriefEmailModalProps = {
  isOpen: boolean;
  briefSlug: string | null;
  onClose: () => void;
  getIdToken: () => Promise<string>;
};

export const DailyBriefEmailModal: React.FC<DailyBriefEmailModalProps> = ({
  isOpen,
  briefSlug,
  onClose,
  getIdToken,
}) => {
  const [html, setHtml] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadHtml = useCallback(async () => {
    if (!briefSlug) return;
    setLoading(true);
    setError(null);
    setHtml('');
    setSubjectLine('');
    setCopied(false);
    try {
      const token = await getIdToken();
      const res = await fetch(
        `/api/admin/daily-brief-email?slug=${encodeURIComponent(briefSlug)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load email HTML');
      }
      setHtml(data.html as string);
      setSubjectLine((data.subject_line as string) ?? '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [briefSlug, getIdToken]);

  useEffect(() => {
    if (!isOpen || !briefSlug) return;
    void loadHtml();
  }, [isOpen, briefSlug, loadHtml]);

  const handleCopyHtml = async () => {
    if (!html) return;
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard');
    }
  };

  const handleCopySubject = async () => {
    if (!subjectLine) return;
    try {
      await navigator.clipboard.writeText(subjectLine);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy subject');
    }
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75"
      role="presentation"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-brief-email-title"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl border border-zinc-700 bg-zinc-950 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-zinc-800 shrink-0">
          <div className="min-w-0">
            <h2 id="daily-brief-email-title" className="text-lg font-semibold text-white">
              Daily brief email
            </h2>
            <p className="text-xs text-gray-500 font-mono truncate mt-0.5">{briefSlug}</p>
            {subjectLine ? (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                Subject: <span className="text-gray-200">{subjectLine}</span>
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 px-3 py-1.5 rounded-lg border border-zinc-600 text-sm text-gray-300 hover:bg-zinc-800"
            aria-label="Close dialog"
          >
            Close
          </button>
        </div>

        <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={() => void handleCopySubject()}
            disabled={!subjectLine || loading}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-sm text-white hover:bg-zinc-700 disabled:opacity-40"
          >
            Copy subject
          </button>
          <button
            type="button"
            onClick={() => void handleCopyHtml()}
            disabled={!html || loading}
            className="px-3 py-1.5 rounded-lg bg-violet-700 text-sm text-white hover:bg-violet-600 disabled:opacity-40"
          >
            {copied ? 'Copied' : 'Copy HTML'}
          </button>
          <button
            type="button"
            onClick={() => void loadHtml()}
            disabled={loading || !briefSlug}
            className="px-3 py-1.5 rounded-lg border border-zinc-600 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
          >
            Refresh
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-auto p-4">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading HTML…</p>
          ) : error ? (
            <p className="text-red-300 text-sm" role="alert">
              {error}
            </p>
          ) : html ? (
            <iframe
              title="Daily brief email preview"
              srcDoc={html}
              sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              className="w-full min-h-[420px] h-[55vh] rounded-md border border-zinc-700 bg-white"
            />
          ) : (
            <p className="text-gray-500 text-sm">No HTML loaded.</p>
          )}
        </div>
      </div>
    </div>
  );
};
