'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './lesson.module.css';

export default function LoopPreview({ src, still, alt, width, height, eager = false }: { src: string; still: string; alt: string; width: number; height: number; eager?: boolean }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPlaying(!preference.matches);
    const changed = () => setPlaying(!preference.matches);
    preference.addEventListener('change', changed);
    return () => preference.removeEventListener('change', changed);
  }, []);
  return <div className={styles.loopPreview}>
    <Image src={playing ? src : still} alt={alt} width={width} height={height} unoptimized loading={eager ? 'eager' : 'lazy'} />
    <button type="button" aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? 'Pause animation' : 'Play animation'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span></button>
  </div>;
}
