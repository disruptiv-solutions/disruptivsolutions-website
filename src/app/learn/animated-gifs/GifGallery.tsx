'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { GALLERY_CATEGORIES, GIF_GALLERY, type GalleryCategory, type GalleryItem } from './gallery-data';
import styles from './Gallery.module.css';

function seconds(duration: number) {
  return (duration / 1000).toFixed(2).replace(/\.?0+$/, '');
}

function GifActions({ item }: { item: GalleryItem }) {
  const [status, setStatus] = useState('');
  const [manualLink, setManualLink] = useState('');
  const linkField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (manualLink) {
      linkField.current?.focus();
      linkField.current?.select();
    }
  }, [manualLink]);

  async function copyLink() {
    const url = new URL(item.gif, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setManualLink('');
      setStatus('GIF link copied. Ready to paste.');
    } catch {
      setManualLink(url);
      setStatus('Copy the selected GIF link below.');
    }
  }

  return <div className={styles.share}>
    <div className={styles.shareActions}>
      <a href={item.gif} download={`${item.id}.gif`}>Save GIF <span aria-hidden="true">↓</span></a>
      <button type="button" onClick={copyLink}>Copy GIF link <span aria-hidden="true">↗</span></button>
    </div>
    <p className={styles.shareStatus} role="status" aria-live="polite">{status || 'Save the animation, or copy a link to share it.'}</p>
    {manualLink && <input ref={linkField} className={styles.linkField} aria-label="GIF link to copy" value={manualLink} readOnly onFocus={event => event.currentTarget.select()} />}
  </div>;
}

export default function GifGallery() {
  const [category, setCategory] = useState<GalleryCategory | 'All'>('All');
  const [limit, setLimit] = useState(9);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [surface, setSurface] = useState('paper');
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => category === 'All' ? GIF_GALLERY : GIF_GALLERY.filter(item => item.category === category), [category]);
  const index = filtered.findIndex(item => item.id === activeId);
  const active = filtered[index];
  const isOpen = Boolean(active);

  useEffect(() => {
    if (!isOpen || !dialog.current) return;
    const modal = dialog.current;
    const overflow = document.body.style.overflow;
    if (!modal.open) modal.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      if (modal.open) modal.close();
      opener.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => { if (preference.matches) setPlaying(false); };
    preference.addEventListener('change', changed);
    return () => preference.removeEventListener('change', changed);
  }, []);

  useEffect(() => {
    const container = strip.current;
    const thumb = container?.children[index] as HTMLElement | undefined;
    if (container && thumb) container.scrollTo({ left: thumb.offsetLeft - (container.clientWidth - thumb.clientWidth) / 2, behavior: 'auto' });
  }, [index, isOpen]);

  function open(item: GalleryItem, button: HTMLButtonElement) {
    opener.current = button;
    setActiveId(item.id);
    setPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setSurface('paper');
  }

  function move(direction: number) {
    setActiveId(filtered[(index + direction + filtered.length) % filtered.length].id);
  }

  function keys(event: KeyboardEvent<HTMLDialogElement>) {
    if (!active || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  }

  return <section id="gif-gallery" className={styles.gallery} aria-labelledby="gallery-title">
    <div className={styles.heading}><div><p>THE GIF COLLECTION</p><h2 id="gallery-title">From Ian’s<br /><em>workbench.</em></h2></div><div className={styles.intro}><span className={styles.collectionCount}>{GIF_GALLERY.length}<small>LITTLE LOOPS / BIG PERSONALITY</small></span><p>Logo experiments. Folded paper. A panda and an otter. Pick a piece to play it, then click through the collection.</p></div></div>
    <div className={styles.filters} role="group" aria-label="Filter the GIF gallery">{(['All', ...GALLERY_CATEGORIES] as const).map(value => <button type="button" key={value} aria-pressed={category === value} onClick={() => { setCategory(value); setLimit(9); }}>{value}<span>{value === 'All' ? GIF_GALLERY.length : GIF_GALLERY.filter(item => item.category === value).length}</span></button>)}</div>
    <p className={styles.filterStatus} role="status" aria-live="polite">{filtered.length} {category === 'All' ? 'loops in the collection' : category.toLowerCase() + ' loops'}</p>
    <div className={styles.grid}>{filtered.slice(0, limit).map((item, i) => <button type="button" className={styles.card} key={item.id} onClick={event => open(item, event.currentTarget)} aria-label={`View ${item.title}`} aria-haspopup="dialog">
      <span className={styles.cardTop}><span>{String(i + 1).padStart(2, '0')} / {item.category}</span><span className={styles.openMark} aria-hidden="true">↗</span></span>
      <span className={styles.poster}><Image src={item.poster} alt="" width={480} height={360} unoptimized /></span>
      <span className={styles.cardBottom}><strong>{item.title}</strong><span>{seconds(item.durationMs)} s <i aria-hidden="true">▷</i></span></span>
    </button>)}</div>
    <div className={styles.collectionFooter}><span>{Math.min(limit, filtered.length)} of {filtered.length} shown <i> / </i> Open any piece. Use ← → to keep looking.</span>{limit < filtered.length && <button type="button" onClick={() => setLimit(filtered.length)}>Show all {filtered.length} loops <span aria-hidden="true">↓</span></button>}</div>

    <dialog ref={dialog} className={styles.dialog} aria-labelledby="gif-viewer-title" onClose={() => setActiveId(null)} onCancel={() => setActiveId(null)} onKeyDown={keys} onClick={event => { if (event.target === event.currentTarget) setActiveId(null); }}>
      {active && <div className={styles.viewer}>
        <div className={styles.viewerTop}><span>IAN’S GIF COLLECTION <i>/</i> {String(index + 1).padStart(2, '0')} OF {filtered.length}</span><button type="button" onClick={() => setActiveId(null)} autoFocus aria-label="Close GIF viewer">Close <span aria-hidden="true">×</span></button></div>
        <div className={styles.viewerBody}>
          <div className={styles.stage} data-surface={surface}><Image key={active.id + String(playing)} src={playing ? active.src : active.poster} alt={active.description} width={active.width} height={active.height} unoptimized loading="eager" /></div>
          <div className={styles.details}><span className={styles.category}>{active.category}</span><h3 id="gif-viewer-title">{active.title}</h3><p>{active.description}</p><dl><div><dt>Length</dt><dd>{seconds(active.durationMs)} seconds</dd></div><div><dt>Canvas</dt><dd>{active.width} × {active.height}</dd></div><div><dt>Frames</dt><dd>{active.frames}</dd></div></dl><button type="button" className={styles.play} aria-pressed={playing} onClick={() => setPlaying(value => !value)}>{playing ? 'Pause animation' : 'Play animation'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span></button><GifActions key={active.id} item={active} /><fieldset className={styles.surfaces}><legend>Try a background</legend>{['paper', 'white', 'dark'].map(value => <button type="button" key={value} data-swatch={value} aria-label={`Use ${value} background`} aria-pressed={surface === value} onClick={() => setSurface(value)}><span aria-hidden="true" />{value}</button>)}</fieldset><span className={styles.previewNote}>Animation plays here when you open it. The gallery stays still.</span></div>
        </div>
        <div className={styles.navigation}><button type="button" onClick={() => move(-1)} aria-label="Previous GIF">← <span>Previous</span></button><span aria-live="polite">{index + 1} / {filtered.length}</span><button type="button" onClick={() => move(1)} aria-label="Next GIF"><span>Next</span> →</button></div>
        <div className={styles.thumbStrip} ref={strip} role="group" aria-label="Choose a GIF in the viewer">{filtered.map(item => <button type="button" key={item.id} aria-label={`Show ${item.title}`} aria-pressed={item.id === active.id} onClick={() => setActiveId(item.id)}><Image src={item.poster} alt="" width={80} height={60} unoptimized /></button>)}</div>
      </div>}
    </dialog>
  </section>;
}
