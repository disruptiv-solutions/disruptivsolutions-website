'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './lesson.module.css';

const phases = ['Start with the reference', 'Open up the shape', 'Find the new silhouette', 'Settle into the star'];

export default function FrameLab() {
  const [frame, setFrame] = useState(0);
  const phase = frame === 0 ? 0 : frame < 5 ? 1 : frame < 12 ? 2 : 3;
  const number = String(frame + 1).padStart(2, '0');
  return <div className={styles.frameLab}>
    <div className={styles.frameViewer}>
      <div className={styles.viewerBar}><span>THE POSE INSPECTOR</span><output htmlFor="pose-scrubber">{number} <span>/ 16</span></output></div>
      <div className={styles.poseStage}>
        <span className={styles.poseWatermark} aria-hidden="true">{number}</span>
        {Array.from({ length: 16 }, (_, i) => <Image key={i} src={`/learn/animated-gifs/frames/pose-${String(i).padStart(2, '0')}.png`} width={384} height={384} alt={i === frame ? `Pose ${frame + 1}: ${phases[phase]}` : ''} aria-hidden={i !== frame} className={i === frame ? styles.activePose : styles.hiddenPose} unoptimized loading="eager" />)}
      </div>
      <div className={styles.scrubControls}>
        <label htmlFor="pose-scrubber">Drag to see what changes <span aria-hidden="true">↔</span></label>
        <input id="pose-scrubber" type="range" min="0" max="15" value={frame} onChange={event => setFrame(Number(event.target.value))} aria-valuetext={`Pose ${frame + 1} of 16: ${phases[phase]}`} />
        <div><button type="button" onClick={() => setFrame(value => Math.max(0, value - 1))} disabled={frame === 0} aria-label="Previous pose">←</button><span>{phases[phase]}</span><button type="button" onClick={() => setFrame(value => Math.min(15, value + 1))} disabled={frame === 15} aria-label="Next pose">→</button></div>
      </div>
    </div>
    <div className={styles.sheetPanel}>
      <div className={styles.sheetLabel}><span>ONE SHEET / SIXTEEN DRAWINGS</span><b>4 × 4</b></div>
      <div className={styles.poseGrid} role="group" aria-label="Choose a transformation pose">{Array.from({ length: 16 }, (_, i) => <button type="button" key={i} aria-label={`Show pose ${i + 1}`} aria-pressed={frame === i} onClick={() => setFrame(i)}><Image src={`/learn/animated-gifs/frames/pose-${String(i).padStart(2, '0')}.png`} alt="" width={88} height={88} unoptimized loading="eager" /><span>{String(i + 1).padStart(2, '0')}</span></button>)}</div>
      <div className={styles.sheetNote}><span aria-hidden="true">↳</span><p><strong>These are the in-between drawings.</strong> Read left to right, top to bottom. Click any pose to inspect it, or use the slider to move through the whole transformation.</p></div>
      <div className={styles.frameEquation}><span><b>16</b> source poses</span><i aria-hidden="true">→</i><span><b>30</b> playback frames</span><i aria-hidden="true">↻</i></div>
      <p className={styles.labFinePrint}>This cube-to-star example plays forward and back, with endpoint holds. The five-logo hero above uses a longer sequence of 75 frames.</p>
    </div>
  </div>;
}
