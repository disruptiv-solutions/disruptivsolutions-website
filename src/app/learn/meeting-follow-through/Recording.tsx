'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './lesson.module.css';

const parts = [
  { id: '1sMRuMqxURhZg4B_2DWqbLy-dclNppE38', title: 'Part 1 — prepare the call and draft the proposal', duration: '12:21', description: 'Why context matters → inquiry → research → discovery questions → transcript → proposal → availability.' },
  { id: '1qmnvdztiz9KsK3drnMdovhqSvP_CdD87', title: 'Part 2 — approve the follow-up and plan the next step', duration: '4:36', description: 'Review the Gmail draft → approve sending → create and check the calendar placeholder → recap.' },
];

export default function Recording() {
  const [selected, setSelected] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const part = parts[selected];
  return <div>
    <div className={styles.partButtons} role="group" aria-label="Choose recording part">
      {parts.map((p, i) => <button key={p.id} type="button" aria-pressed={i === selected} onClick={() => { setSelected(i); setLoaded(false); }}><b>Part {i + 1}</b><span>{p.duration}</span></button>)}
    </div>
    <div className={styles.player}>
      {loaded ? <iframe key={part.id} src={`https://drive.google.com/file/d/${part.id}/preview`} title={part.title} allow="autoplay; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button type="button" onClick={() => setLoaded(true)} aria-label={`Load ${part.title}`}>
        <Image src={`/learn/meeting-follow-through/part-${selected + 1}-poster.jpg`} alt="" fill sizes="(max-width: 760px) 100vw, 900px" />
        <span className={styles.playIcon} aria-hidden="true">▶</span><span className={styles.playLabel}>Watch part {selected + 1} <small>{part.duration} / Ian’s original run-through</small></span>
      </button>}
    </div>
    <h3 className={styles.partTitle}>{part.title}</h3><p className={styles.partDescription}>{part.description}</p>
    <p className={styles.playerHelp}>Use full screen to read the demo. <a href={`https://drive.google.com/file/d/${part.id}/view`} target="_blank" rel="noreferrer">Open this recording in Drive ↗</a></p>
  </div>;
}
