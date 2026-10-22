"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./product-film.module.css";

export function ProductFilm({ src, poster, title }: { src: string; poster: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const preference = useRef<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      const wanted = preference.current ?? !motion.matches;
      if (visible && !document.hidden && wanted) {
        void video.play().catch(() => { /* The play button remains available if autoplay is blocked. */ });
      } else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      sync();
    }, { threshold: 0.25 });
    observer.observe(video);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    preference.current = video.paused;
    if (video.paused) void video.play().catch(() => { /* Scrolling away can cancel a pending play; keep the controls available. */ });
    else video.pause();
  }

  return <div className={styles.film}>
    <video ref={videoRef} src={src} poster={poster} width={1920} height={1080}
      muted loop playsInline preload="none" aria-label={title}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}>
      <a href={src}>Watch {title}</a>
    </video>
    <div className={styles.controls}>
      <span>Product walkthrough · No sound</span>
      {failed ? <a href={src}>Open video ↗</a> : <button type="button" onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} ${title}`}>
        <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>{playing ? "Pause" : "Play"}
      </button>}
      <a href={src} target="_blank" rel="noreferrer" aria-label={`Open ${title} full size`}>Full size <span aria-hidden="true">↗</span></a>
    </div>
  </div>;
}
