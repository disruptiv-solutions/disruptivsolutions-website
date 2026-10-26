"use client";

import { useEffect, useMemo, useRef } from 'react';
import { mountAndroidLesson } from './lesson-runtime';

export default function AndroidHomeLesson({ html }: { html: string }) {
  const root = useRef<HTMLDivElement>(null);
  const content = useMemo(() => ({ __html: html }), [html]);
  useEffect(() => {
    if (root.current) {
      const cleanup = mountAndroidLesson(root.current);
      root.current.dataset.lessonReady = 'true';
      root.current.setAttribute('aria-busy', 'false');
      return cleanup;
    }
  }, [html]);
  return <div ref={root} id="android-home-lesson" data-lesson-ready="false" aria-busy="true" dangerouslySetInnerHTML={content} />;
}
