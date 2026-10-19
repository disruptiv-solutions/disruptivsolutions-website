import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/components/site/PublicPage.module.css';
import { WORKSHOP_KITS } from '@/lib/workshop-kits';

export const metadata: Metadata = {
  title: 'Workshop Kits | Ian McDonald AI',
  description:
    'Practical AI workshop kits from Ian McDonald AI. Guided tools for operators, founders, teams, and small businesses.',
};

export default function WorkshopKitsPage() {
  return <section className={styles.page}>
    <header><p className={styles.eyebrow}>Practical AI workshops</p><h1>Leave with more than notes.</h1><p className={styles.intro}>Guided worksheets, prompts, and tools from the room. Pick up where the workshop left off and put the ideas to work.</p></header>
    <div className={styles.cards}>
      {WORKSHOP_KITS.map((kit) => <Link key={kit.slug} href={`/kits/${kit.slug}`} className={styles.card}><span>{kit.eyebrow} / {kit.status}</span><h2>{kit.title}</h2><p>{kit.description}</p><p>{kit.audience}</p><span className={styles.textLink}>Open the kit →</span></Link>)}
    </div>
  </section>;
}
