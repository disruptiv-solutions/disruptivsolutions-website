'use client';

import { useState } from 'react';
import type { SpeakingVideoTranscript } from '@/content/speaking/transcripts';
import { cn } from '@/lib/cn';

const VideoTestimonialsFolder = ({
  items,
  className,
  headingId = 'video-testimonials-heading',
}: {
  items: SpeakingVideoTranscript[];
  className?: string;
  headingId?: string;
}) => {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const active =
    items.find((item) => item.id === activeId) ?? items[0];

  if (!active) {
    return null;
  }

  return (
    <div
      className={cn(
        'mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/50',
        className
      )}
      aria-labelledby={headingId}
    >
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <aside className="border-b border-white/[0.08] bg-black/30 lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="p-4 sm:p-5">
            <p
              id={headingId}
              className="text-red-500/95 text-xs font-semibold tracking-[0.25em] uppercase"
            >
              Transcripts
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              {items.length} clip
              {items.length === 1 ? '' : 's'}
            </p>
          </div>
          <ul className="list-none p-0 m-0 pb-2 lg:pb-4" role="listbox" aria-label="Video transcripts">
            {items.map((item) => (
              <li key={item.id} role="option" aria-selected={item.id === active.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    'flex w-full flex-col gap-1 border-l-2 px-4 py-3 text-left transition',
                    item.id === active.id
                      ? 'border-red-500 bg-red-500/10 text-white'
                      : 'border-transparent text-zinc-400 hover:border-zinc-600 hover:bg-white/[0.03] hover:text-zinc-200'
                  )}
                >
                  <span className="font-mono text-[10px] text-zinc-500">
                    {item.filename}
                  </span>
                  <span className="text-sm font-medium leading-snug line-clamp-2">
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <TranscriptPanel item={active} />
      </div>
    </div>
  );
};

const TranscriptPanel = ({ item }: { item: SpeakingVideoTranscript }) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
      <div className="flex shrink-0 justify-center border-b border-white/[0.08] bg-black/50 p-6 sm:p-8 lg:w-[280px] lg:border-b-0 lg:border-r lg:p-6">
        <div className="w-full max-w-[240px] overflow-hidden rounded-xl border border-white/[0.1] bg-black shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.06]">
          <video
            key={item.videoSrc}
            src={item.videoSrc}
            aria-label={item.videoLabel}
            controls
            playsInline
            preload="metadata"
            className="aspect-[9/16] w-full bg-black object-cover"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8 lg:py-8 lg:pr-8">
        <p className="text-red-500/95 text-xs font-semibold tracking-[0.3em] uppercase mb-2">
          {item.kicker}
        </p>
        <h3 className="text-xl font-bold text-white tracking-tight leading-snug [text-wrap:balance]">
          {item.title}
        </h3>
        {(item.attendee || item.event) && (
          <p className="mt-2 text-xs text-zinc-500">
            {[item.attendee, item.event].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed [text-wrap:pretty]">
          {item.summary}
        </p>

        <details className="group mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] open:bg-white/[0.03]">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-zinc-200 marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-2">
              Read transcript
              <span
                aria-hidden
                className="text-zinc-500 transition group-open:rotate-180"
              >
                ▾
              </span>
            </span>
          </summary>
          <div className="border-t border-white/[0.08] px-4 pb-4 pt-3">
            <ol className="space-y-3 list-none p-0 m-0">
              {item.lines.map((line, index) => (
                <li
                  key={`${item.id}-line-${index}`}
                  className="text-sm text-zinc-300 leading-relaxed"
                >
                  {line.at && (
                    <span className="mr-2 font-mono text-[11px] text-red-400/90 tabular-nums">
                      {line.at}
                    </span>
                  )}
                  {line.text}
                </li>
              ))}
            </ol>
          </div>
        </details>
      </div>
    </div>
  );
};

export default VideoTestimonialsFolder;
