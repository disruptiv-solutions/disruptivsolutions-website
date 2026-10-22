"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { trackButtonClick, trackCommunityVisit } from '@/lib/analytics';
import { IAN_COMMUNITY_URL } from '@/lib/ian-community';
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
      <Link href={home ? '#top' : '/'} className={styles.brand} aria-label="Ian McDonald home" onClick={() => setOpen(false)}>
        <Image src="/DS-Logo.svg" alt="" width={32} height={32} priority />Ian McDonald
      </Link>
      <a className={styles.mobileCommunity} href={IAN_COMMUNITY_URL} aria-label="Join my free community" onClick={() => trackCommunityVisit('site_mobile_header')}>Join free</a>
      <button ref={menuButton} type="button" className={styles.menuButton} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}><span /><span /></button>
      <nav id="site-navigation" aria-label="Main navigation" className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
        <div className={styles.navLinks}>{[
          ['Speaking', '/speaking'], ['Learn', '/learn'],
          ['Notes', '/newsletter-directory'], ['About', '/about'],
        ].map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</div>
        <a href={IAN_COMMUNITY_URL} className={styles.communityCta} onClick={() => { setOpen(false); trackCommunityVisit('site_navigation'); }}>Free community <span aria-hidden="true">↗</span></a>
        <Link href={bookingHref || '/contact'} className={styles.navCta} onClick={() => { setOpen(false); trackButtonClick(bookingHref ? 'book_ian' : 'contact_ian', home ? 'home_v2_nav' : 'site_nav'); }}>{bookingHref ? 'Book Ian' : 'Contact Ian'} <span aria-hidden="true">↗</span></Link>
      </nav>
    </div>
  </header>;
}
