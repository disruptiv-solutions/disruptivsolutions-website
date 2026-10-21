'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/components/site/PublicPage.module.css';
import DisruptivProjectLink from '@/components/site/DisruptivProjectLink';
import { trackButtonClick, trackExternalLink } from '@/lib/analytics';

const AI_OPS_URL = 'https://calendar.app.google/okpHPUV8TA85GBaA6';

const Consulting: React.FC = () => {
  const handleBookCall = () => {
    trackButtonClick('book_ai_ops_call', {
      page_location: 'consulting_section',
    });
    trackExternalLink(AI_OPS_URL, 'AI Ops Call');
    window.open(AI_OPS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="consulting" className={styles.page}>
      <div className={styles.split}>
        <header><p className={styles.eyebrow}>AI Ops with Ian</p><h1>Less friction.<br />More useful work.</h1><p className={styles.intro}>Tool sprawl, workflow chaos, or automation that never quite works. Let’s find where AI can actually help your business.</p><Link href="/assessment" className={styles.textLink}>Start with the free AI Snapshot →</Link></header>
        <div className={styles.panel}><h2>Find the right next step.</h2><p className={styles.intro}>We’ll look at the work you do, the tools you use, and the places your time disappears.</p><button type="button" onClick={handleBookCall} className={styles.button}>Book an AI Ops call →</button><p className={styles.note}>Need someone to build it? Disruptiv is Ian’s company for putting websites, apps, and AI workflows into practice.<br /><DisruptivProjectLink location="consulting_page" className={styles.textLink} /></p></div>
      </div>
    </section>
  );
};
export default Consulting;
