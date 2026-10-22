import type { Metadata } from 'next';
import { ProductFilm } from '@/components/site/ProductFilm';
import Link from 'next/link';
import DisruptivProjectLink from '@/components/site/DisruptivProjectLink';
import styles from './CaseStudy.module.css';

export const metadata: Metadata = {
  title: 'AI for Business Case Study | Ian McDonald',
  description: 'A look inside the AI for Business platform Ian built: multi-model chat, creative tools, and a workspace that supported more than 1,600 users.',
  alternates: { canonical: '/work/ai-for-business' },
  openGraph: {
    title: 'AI for Business — a platform built by Ian McDonald',
    description: 'The brief, the build, and the results from a 2025 platform engagement.',
    images: ['/films/ai4b-poster.jpg'],
  },
};

export default function AiForBusinessCaseStudy() {
  return <article className={styles.page}>
    <header className={styles.hero}>
      <div><p className={styles.eyebrow}>Selected work / 2025</p><h1>AI for Business.<br /><em>From idea to daily use.</em></h1><p className={styles.intro}>A shared AI workspace for a business community, built by Ian McDonald. Chat, creative tools, and business context in one platform.</p></div>
      <dl className={styles.projectMeta}><div><dt>Ian’s role</dt><dd>Solo platform builder</dd></div><div><dt>The work</dt><dd>Product development &amp; AI integration</dd></div><div><dt>The context</dt><dd>Historical engagement / 2025</dd></div></dl>
    </header>

    <figure className={styles.product}>
      <ProductFilm src="/films/ai4b-demo.mp4" poster="/films/ai4b-poster.jpg" title="AI for Business platform walkthrough" />
      <figcaption>A motion recreation of the platform I built in 2025, showing its connected workspace and creative tools.</figcaption>
    </figure>

    <div className={styles.story}>
      <section aria-labelledby="brief-heading"><p className={styles.eyebrow}>01 / The brief</p><h2 id="brief-heading">One place to put AI to work.</h2><p>The starting idea was a single platform for text and image generation, with tools such as web search alongside them. The work grew into a workspace for members using AI for content, creative work, and everyday business tasks.</p></section>
      <section aria-labelledby="build-heading"><p className={styles.eyebrow}>02 / What I built</p><h2 id="build-heading">A working product.<br />Several ways to create.</h2><ul className={styles.features}><li><strong>Multi-model chat</strong><span>Access to AI models in a shared workspace.</span></li><li><strong>Images, video &amp; content</strong><span>Creative generation and copy tools alongside chat.</span></li><li><strong>Business context</strong><span>Knowledge bases, brand voice tools, and a super-prompt builder.</span></li></ul></section>
    </div>

    <section className={styles.results} aria-labelledby="results-heading">
      <div><p className={styles.eyebrow}>03 / The results</p><h2 id="results-heading">Built for people<br /><em>who actually used it.</em></h2><p>The platform supported more than 1,600 users. Within nine months, the business it served reached $1.2M in annual recurring revenue.</p></div>
      <div><dl className={styles.metrics}><div><dt>1,600+</dt><dd>Users supported by the platform</dd></div><div><dt>$1.2M</dt><dd>Annual recurring revenue of the business the platform supported</dd></div></dl><p className={styles.note}>These figures describe the 2025 engagement. The user count relates to the platform; annual recurring revenue relates to the business the platform supported.</p></div>
    </section>

    <section className={styles.next} aria-labelledby="next-heading"><div><p className={styles.eyebrow}>Put the experience to work</p><h2 id="next-heading">Have something<br /><em>you want to build?</em></h2><p>Disruptiv is Ian’s company for helping businesses turn useful ideas into websites, apps, and AI workflows.</p><DisruptivProjectLink location="ai_for_business_case_study" className={styles.button} /></div><div className={styles.speaking}><h3>Bring the lessons to your room.</h3><p>Ian’s keynotes, workshops, and live builds draw on the work of making real products.</p><Link href="/speaking" className={styles.textLink}>Explore speaking &amp; workshops <span aria-hidden="true">↗</span></Link></div></section>
  </article>;
}
