"use client";

import Link from 'next/link';
import { IAN_COMMUNITY_PAGE_URL, IAN_COMMUNITY_URL } from '@/lib/ian-community';
import { trackButtonClick, trackCommunityVisit } from '@/lib/analytics';
import styles from './CommunityInvitation.module.css';

export default function CommunityInvitation() {
  return <section className={styles.invitation} aria-labelledby="community-invitation-title">
    <div className={styles.inner}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}><span className={styles.free}>Free to join</span> Ian McDonald AI</p>
        <h2 id="community-invitation-title">Bring what<br /><em>you’re building.</em></h2>
        <p className={styles.description}>Join my free community for practical AI lessons, prompts, and the things I’m making. Bring an idea, a question, or something you’d like to make easier.</p>
        <a className={styles.join} href={IAN_COMMUNITY_URL} onClick={() => trackCommunityVisit('site_invitation')}>Join my free community <span aria-hidden="true">↗</span></a>
        <p className={styles.note}>Find us on LaunchBox. Start wherever you are.</p>
        <Link className={styles.overview} href={IAN_COMMUNITY_PAGE_URL} onClick={() => trackButtonClick('community_overview', 'site_invitation')}>Meet the community &amp; the platform I built <span aria-hidden="true">→</span></Link>
      </div>
      <div className={styles.inside}>
        <p className={styles.insideLabel}>A place to put AI into practice</p>
        <ol>
          <li><span className={styles.number} aria-hidden="true">01</span><div><h3>Try something useful.</h3><p>Explore lessons, examples, and prompts you can use in your own work.</p></div></li>
          <li><span className={styles.number} aria-hidden="true">02</span><div><h3>Bring your questions.</h3><p>Share what you’re trying and where you’re getting stuck.</p></div></li>
          <li><span className={styles.number} aria-hidden="true">03</span><div><h3>Build alongside others.</h3><p>Show what worked, compare approaches, and learn from each other.</p></div></li>
        </ol>
      </div>
    </div>
  </section>;
}
