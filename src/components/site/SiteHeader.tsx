"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { trackButtonClick } from '@/lib/analytics';
import { IAN_COMMUNITY_PAGE_URL } from '@/lib/ian-community';
import styles from './Site.module.css';

export default function SiteHeader({ home = false, bookingHref }: { home?: boolean; bookingHref?: string }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  return <header className={styles.header}>
    <div className={styles.headerInner}>
      <Link href={home ? '#top' : '/'} className={styles.brand} aria-label="Ian McDonald AI home" onClick={() => setOpen(false)}>
        <Image src="/DS-Logo.svg" alt="" width={32} height={32} priority />Ian McDonald AI
      </Link>
      <Link className={styles.mobileCommunity} href={IAN_COMMUNITY_PAGE_URL} aria-label="Explore my free community" onClick={() => { setOpen(false); trackButtonClick('community_overview', 'site_mobile_header'); }}>Join free</Link>
      <button ref={menuButton} type="button" className={styles.menuButton} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}><span /><span /></button>
      <nav id="site-navigation" aria-label="Main navigation" className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
        <div className={styles.navLinks}>{[
          ['Speaking', '/speaking'], ['Learn', '/learn'],
          ['About', '/about'],
        ].map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</div>
        <Link href={IAN_COMMUNITY_PAGE_URL} className={styles.communityCta} onClick={() => { setOpen(false); trackButtonClick('community_overview', 'site_navigation'); }}>Free community <span aria-hidden="true">→</span></Link>
        <Link href={bookingHref || '/contact'} className={styles.navCta} onClick={() => { setOpen(false); trackButtonClick(bookingHref ? 'book_ian' : 'contact_ian', home ? 'home_v2_nav' : 'site_nav'); }}>{bookingHref ? 'Book Ian' : 'Contact Ian'} <span aria-hidden="true">↗</span></Link>
      </nav>
    </div>
  </header>;
}
