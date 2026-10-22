"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackDisruptivVisit } from '@/lib/analytics';
import styles from './Site.module.css';
import { IAN_SOCIAL_URLS } from '@/lib/ian-social-links';

export default function SiteFooter({ home = false }: { home?: boolean }) {
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();
  const [accountError, setAccountError] = useState('');
  async function accountAction() {
    try { setAccountError(''); if (user) await signOut(); else await signInWithGoogle(); }
    catch { setAccountError('Couldn’t open your account. Please try again.'); }
  }
  return <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <div><Link href="/" className={styles.brand}><Image src="/DS-Logo.svg" alt="" width={32} height={32} />Ian McDonald</Link><p>Building useful things.<br />Sharing what I learn along the way.</p><span className={styles.eyebrow}>Houston, Texas</span></div>
      <nav aria-label="Explore"><span className={styles.eyebrow}>Explore</span><Link href="/speaking">Speaking & workshops</Link><Link href="/about">About Ian</Link><Link href="/assessment">Free AI Snapshot</Link><Link href="/learn">Learn</Link><Link href="/newsletter-directory">Notes & newsletters</Link><Link href="/newsletter">Get the newsletter</Link></nav>
      <nav aria-label="Work together"><span className={styles.eyebrow}>Work together</span><Link href="/build">Build with Ian</Link><Link href="/contact">Contact Ian</Link><a href="https://www.disruptiv.solutions/contact" onClick={() => trackDisruptivVisit('https://www.disruptiv.solutions/contact', home ? 'home_v2_footer' : 'site_footer')}>Build with Disruptiv <span aria-hidden="true">↗</span></a><a href="https://launchbox.space">Explore LaunchBox <span aria-hidden="true">↗</span></a><a href="mailto:ian@ianmcdonald.ai">ian@ianmcdonald.ai</a></nav>
    </div>
    <nav className={styles.socialLinks} aria-label="Follow Ian"><span className={styles.eyebrow}>Follow Ian</span>{Object.entries(IAN_SOCIAL_URLS).map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{name}</a>)}</nav>
    <div className={styles.footerBottom}><span>© {new Date().getFullYear()} Disruptiv Solutions LLC</span><Link href="/privacy">Privacy</Link><button type="button" onClick={accountAction}>{user ? 'Sign out' : 'Member sign in'}</button>{isAdmin && <Link href="/admin">Admin</Link>}{accountError && <p role="alert">{accountError}</p>}</div>
  </footer>;
}
