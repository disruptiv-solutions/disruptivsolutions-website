import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/components/site/PublicPage.module.css';
import { WORKSHOP_KITS } from '@/lib/workshop-kits';

export const metadata: Metadata = {
  title: 'Learn | Ian McDonald AI',
  description:
    'Practical AI lessons, workshop kits, and copyable prompts from Ian McDonald. Learn a useful workflow, then put it to work in your business.',
  alternates: { canonical: '/learn' },
};

export default function LearnPage() {
  return <section className={styles.page}>
    <header><p className={styles.eyebrow}>Learn with Ian</p><h1>Learn it. Then put it to work.</h1><p className={styles.intro}>Practical AI lessons, workshop kits, and copyable prompts. Pick a workflow, follow along, and try it in your own business.</p></header>
    <div className={styles.cards}>
      {WORKSHOP_KITS.map((kit) => <Link key={kit.slug} href={`/learn/${kit.slug}`} className={styles.card}><span>{kit.eyebrow} / {kit.status}</span><h2>{kit.title}</h2><p>{kit.description}</p><p>{kit.audience}</p><span className={styles.textLink}>Open the lesson →</span></Link>)}
    </div>
  </section>;
}
