import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/site/PublicPage.module.css';
import DisruptivProjectLink from '@/components/site/DisruptivProjectLink';

export const metadata: Metadata = { title: 'About Ian McDonald | Builder, Founder & Speaker', description: 'A self-taught builder in Houston. The story behind Ian McDonald, LaunchBox, and Disruptiv Solutions.' };

export default function AboutPage() {
  return <section className={styles.page}>
    <div className={styles.split}>
      <div><p className={styles.eyebrow}>A little about Ian</p><h1>I build first.<br />Then I share what works.</h1><p className={styles.intro}>I’m Ian McDonald, a self-taught builder, founder, and speaker based in Houston.</p><p className={styles.bodyCopy}>I grew up in Pensacola and spent eight years working in addiction and recovery treatment in Colorado. In December 2023, I went all-in on building with $5,000 and no safety net. No CS degree, bootcamp, or co-founder.</p><p className={styles.bodyCopy}>In 2025, I built the AI for Business platform solo. The platform supported 1,600+ users; the business it served reached $1.2M in annual recurring revenue within nine months. That experience is where my talks and workshops start: the actual work of making something useful.</p><Link href="/speaking" className={styles.textLink}>Explore speaking and workshops →</Link></div>
      <figure className={styles.portrait}><Image src="/ian-mcdonald.png" alt="Ian McDonald" width={1024} height={1024} priority sizes="(max-width:760px) 100vw, 45vw" /><figcaption>Houston, Texas / Still learning. Still building.</figcaption></figure>
    </div>
    <div className={styles.cards}>
      <article className={styles.card}><span>TEACHING & SHARING</span><h2>Ian McDonald AI</h2><p>This is where I share what I’m building, teach practical AI, and take speaking and workshop bookings.</p><Link href="/learn" className={styles.textLink}>Learn with me →</Link></article>
      <article className={styles.card}><span>BUILDING FOR BUSINESSES</span><h2>Disruptiv Solutions</h2><p>My company for custom websites, apps, AI workflows, video, and campaigns. Work directly with me to choose a useful first project.</p><DisruptivProjectLink location="about_page" className={styles.textLink} /></article>
      <article className={styles.card}><span>COMMUNITIES & PLATFORMS</span><h2>LaunchBox</h2><p>The product I’m building for people turning their expertise into branded AI-powered communities.</p><a href="https://launchbox.space" className={styles.textLink}>Explore LaunchBox →</a></article>
    </div>
  </section>;
}
