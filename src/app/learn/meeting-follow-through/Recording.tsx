'use client';

import { useRef } from 'react';
import styles from './lesson.module.css';

const chapters = [
  [0, 'Good meeting. Now follow through.'],
  [88.458333, 'Understand the inquiry'],
  [215.458333, 'Bring the meeting context back'],
  [302.75, 'Gemini prepares. You approve.'],
  [327.833333, 'Review the proposal'],
  [402.125, 'Check the time'],
  [441.958333, 'Read it. Then approve sending.'],
  [488.583333, 'Give the next step a place'],
  [513.083333, 'One relationship. One clear next step.'],
] as const;

function timestamp(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

export default function Recording() {
  const video = useRef<HTMLVideoElement>(null);
  function seek(seconds: number) {
    if (!video.current) return;
    video.current.currentTime = seconds;
    void video.current.play().catch(() => { /* Native controls remain available. */ });
  }
  return <div>
    <div className={styles.player}>
      <video ref={video} controls playsInline preload="metadata" poster="/learn/meeting-follow-through/lesson-poster.jpg" aria-label="Ian’s meeting follow-through lesson">
        <source src="/learn/meeting-follow-through/meeting-follow-through-v1.mp4" type="video/mp4" />
        <track kind="captions" src="/learn/meeting-follow-through/meeting-follow-through.vtt" srcLang="en" label="English" />
        <track kind="chapters" src="/learn/meeting-follow-through/meeting-follow-through-chapters.vtt" srcLang="en" label="Lesson chapters" />
        <a href="/learn/meeting-follow-through/meeting-follow-through-v1.mp4">Download the lesson video</a>
      </video>
    </div>
    <p className={styles.playerHelp}>9:29 · Ian’s own narration · Use full screen for the details and CC for captions.</p>
    <details className={styles.chapters}>
      <summary>Jump to a chapter</summary>
      <ol className={styles.chapterList}>{chapters.map(([time, title]) => <li key={time}><button type="button" onClick={() => seek(time)}><span>{timestamp(time)}</span>{title}</button></li>)}</ol>
    </details>
    <details className={styles.sourceRecordings}>
      <summary>Original workshop recordings</summary>
      <p>The complete, unedited run-through is preserved in two parts: <a href="https://drive.google.com/file/d/1sMRuMqxURhZg4B_2DWqbLy-dclNppE38/view" target="_blank" rel="noreferrer">Part 1 ↗</a> · <a href="https://drive.google.com/file/d/1qmnvdztiz9KsK3drnMdovhqSvP_CdD87/view" target="_blank" rel="noreferrer">Part 2 ↗</a></p>
    </details>
  </div>;
}
