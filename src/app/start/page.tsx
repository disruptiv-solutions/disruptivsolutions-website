import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/site/PublicPage.module.css";
import DisruptivProjectLink from "@/components/site/DisruptivProjectLink";

export const metadata: Metadata = {
  title: "Start Here | Ian McDonald",
  description: "Learn practical AI, bring Ian to your event, or build with Disruptiv Solutions.",
};

export default function StartPage() {
  return <section className={styles.page}>
    <header><p className={styles.eyebrow}>Start here</p><h1>What would you like to build?</h1><p className={styles.intro}>A new skill. A better business. A room full of possibility. Pick the next step that fits.</p></header>
    <div className={styles.cards}>
      <article className={styles.card}><span>01 / LEARN</span><h2>Put AI to work.</h2><p>Find a useful starting point with the free AI Snapshot, then explore practical tools and workshop kits.</p><Link href="/assessment" className={styles.textLink}>Take the AI Snapshot →</Link></article>
      <article className={styles.card}><span>02 / SPEAKING</span><h2>Bring Ian to your room.</h2><p>Keynotes, workshops, and live builds that help people leave ready to try something real.</p><Link href="/speaking" className={styles.textLink}>Explore speaking →</Link></article>
      <article className={styles.card}><span>03 / BUILD</span><h2>Make the idea real.</h2><p>Disruptiv is Ian’s company for custom websites, business apps, and AI workflows. Bring the problem; we’ll work out what to build.</p><DisruptivProjectLink className={styles.textLink} /></article>
    </div>
    <p className={styles.note}>Looking for a community or course platform? <a href="https://launchbox.space" target="_blank" rel="noopener noreferrer">Explore LaunchBox</a>.<br />Already planning an AI Ops call? <Link href="/intake">Share your business context</Link>.</p>
  </section>;
}
