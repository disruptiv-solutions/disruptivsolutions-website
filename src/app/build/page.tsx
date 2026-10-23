import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductFilm } from '@/components/site/ProductFilm';
import BuildAction from './BuildAction';
import styles from './Build.module.css';

export const metadata: Metadata = {
  title: 'Build with Ian | Ian McDonald AI',
  description: 'Work with Ian McDonald on an AI workflow, automation, website, custom tool, or content for your business. Explore his work and start a project through Disruptiv Solutions.',
  alternates: { canonical: '/build' },
  openGraph: {
    title: 'Build with Ian — let’s build something useful',
    description: 'Practical consulting and implementation through Disruptiv Solutions, the company Ian founded.',
    images: ['/ian-mcdonald.png'],
  },
};

export default function BuildPage() {
  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="build-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Build with Ian</p>
        <h1 id="build-title">Let’s build<br /><em>something useful.</em></h1>
        <p className={styles.intro}>An AI workflow. An automation. A website or custom tool. Content that brings your expertise to life.</p>
        <p className={styles.connection}>My consulting and implementation work happens through <strong>Disruptiv Solutions</strong>—the company I founded. You’ll work directly with me to choose a practical starting point and put it into use.</p>
        <div className={styles.actions}>
          <BuildAction location="build_page_hero_project" className={styles.primary}>Start a project with Disruptiv</BuildAction>
          <BuildAction destination="services" location="build_page_hero_explore" className={styles.textLink}>Explore Disruptiv Solutions</BuildAction>
        </div>
        <p className={styles.note}>Have the idea, but not the technical brief? That’s a useful place to start.</p>
      </div>
      <aside className={styles.startingPoints} aria-labelledby="starting-points-title">
        <div className={styles.company}><Image src="/DS-Logo.svg" width={38} height={38} alt="" /><span>Disruptiv Solutions<small>Consulting &amp; implementation</small></span></div>
        <h2 id="starting-points-title">What could we<br />make work better?</h2>
        <ol>
          <li><span className={styles.number} aria-hidden="true">01</span><div><h3>Automate the repeat work.</h3><p>Connect your tools and simplify research, preparation, and follow-up.</p></div></li>
          <li><span className={styles.number} aria-hidden="true">02</span><div><h3>Build the tool you need.</h3><p>A website, client portal, or app shaped around how your business works.</p></div></li>
          <li><span className={styles.number} aria-hidden="true">03</span><div><h3>Turn expertise into content.</h3><p>Videos, social posts, and campaign creative that give your ideas a clear form.</p></div></li>
        </ol>
      </aside>
    </section>

    <section className={styles.work} aria-labelledby="work-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>From one workflow to a whole platform</p><h2 id="work-title">Experience you can see.</h2></div><p>You don’t need a whole platform to get started. A useful first project can tackle one repeat task in your day.</p></div>
      <article className={styles.workflow}>
        <div className={styles.workflowImage}><Image src="/learn/find-leads-tracker.png" width={1920} height={1144} alt="Ian’s real opportunity tracker, with review status and a next action for each lead" sizes="(max-width: 760px) 90vw, 520px" /></div>
        <div><p className={styles.projectType}>My own workflow / Research &amp; follow-up</p><h3>From scattered research<br />to a useful lead tracker.</h3><p>I used Gemini to research speaking opportunities, organize them in Google Sheets, and prepare outreach drafts. Each lead has a source and a next action; I check the details before contacting anyone.</p><p>That’s a practical starting point for a business project: take one repeat process, decide what AI can prepare, and keep the decisions that need you in your hands.</p><Link href="/learn/find-leads" className={styles.textLink}>See the actual workflow and prompts <span aria-hidden="true">→</span></Link></div>
      </article>
      <div className={styles.projects}>
        <article className={styles.project}>
          <figure className={styles.projectFilm}><ProductFilm src="/films/launchbox-demo-v1.mp4" poster="/films/launchbox-poster-v1.jpg" title="LaunchBox member learning journey" /><figcaption>A recreated member journey using sample learning material in the LaunchBox interface.</figcaption></figure>
          <div className={styles.projectCopy}><p className={styles.projectType}>My product / Community platform</p><h3>A home for people and their ideas.</h3><p>I designed and built LaunchBox, the platform that hosts my own community and several others. It brings learning, conversations, events, and AI tools together.</p><Link href="/community#the-platform" className={styles.textLink}>Meet the platform I built <span aria-hidden="true">→</span></Link></div>
        </article>
        <article className={styles.project}>
          <figure className={styles.projectFilm}><ProductFilm src="/films/command-center-demo-v1.mp4" poster="/films/command-center-poster-v1.jpg" title="Command Center agent-work walkthrough" /><figcaption>Recreated interface with sample records: review an assignment, inspect its recorded result, and choose a next action.</figcaption></figure>
          <div className={styles.projectCopy}><p className={styles.projectType}>My own operating system / Command Center</p><h3>Keep agent work connected to the business.</h3><p>I built Command Center to keep my business context, assignments, recorded results, and next actions together. Agents work through their connected tools; I can inspect what came back and decide what happens next.</p><a href="https://www.disruptiv.solutions/work#command-center" className={styles.textLink}>See how I use what I build <span aria-hidden="true">↗</span></a></div>
        </article>
        <article className={styles.project}>
          <div className={styles.workspaceVisual}><Image src="/speaking/ai-for-business-workspace.webp" width={1600} height={555} alt="The AI for Business workspace Ian built, with chat and creative tools" sizes="(max-width: 760px) 90vw, 580px" /></div>
          <div className={styles.projectCopy}><p className={styles.projectType}>Client platform / 2025</p><h3>AI for Business.</h3><p>I built this shared AI workspace solo. It brought chat, creative tools, and business context into one platform and supported more than 1,600 users.</p><Link href="/work/ai-for-business" className={styles.textLink}>See the project <span aria-hidden="true">→</span></Link></div>
        </article>
      </div>
    </section>

    <section className={styles.next} aria-labelledby="next-title">
      <div><p className={styles.eyebrow}>Your next useful step</p><h2 id="next-title">Tell me what<br /><em>you want to make easier.</em></h2></div>
      <div><p>Share what you’re working toward through Disruptiv. I’ll review your message, talk through the options with you, and agree on scope and cost before work begins.</p><BuildAction location="build_page_close_project" className={styles.primary}>Start a project with Disruptiv</BuildAction><a className={styles.email} href="mailto:ian@ianmcdonald.ai">Or email me: ian@ianmcdonald.ai</a></div>
    </section>
  </div>;
}
