"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { trackButtonClick } from '@/lib/analytics';
import styles from './Site.module.css';

export default function SiteHeader({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const section = (hash: string) => home ? hash : `/${hash}`;
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  return <header className={styles.header}>
    <div className={styles.headerInner}>
      <Link href={home ? '#top' : '/'} className={styles.brand} aria-label="Ian McDonald home" onClick={() => setOpen(false)}>
        <Image src="/DS-Logo.svg" alt="" width={32} height={32} priority />Ian McDonald
      </Link>
      <button ref={menuButton} type="button" className={styles.menuButton} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}><span /><span /></button>
      <nav id="site-navigation" aria-label="Main navigation" className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
        {[
          ['Speaking', section('#speaking')], ['Work', section('#record')],
          ['Notes', '/newsletter-directory'], ['About', section('#about')],
          ['Build with me', section('#disruptiv')],
        ].map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link href={section('#inquiry')} className={styles.navCta} onClick={() => { setOpen(false); trackButtonClick('book_ian', home ? 'home_v2_nav' : 'site_nav'); }}>Book Ian <span aria-hidden="true">↗</span></Link>
      </nav>
    </div>
  </header>;
}
