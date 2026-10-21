import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Prompt from './Prompt';
import Recording from './Recording';
import { WorkflowMotion, ContextMotion, ApprovalMotion } from './LessonMotion';
import { steps, tools } from './lesson';
import styles from './lesson.module.css';

const title = 'Turn meetings into follow-through | Ian McDonald AI';
const description = 'Turn a discovery call into a reviewed proposal, follow-up email, and next appointment. Ian’s edited Gemini walkthrough, six practical steps, and copyable prompts.';
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: '/learn/meeting-follow-through' },
  openGraph: { title, description, url: '/learn/meeting-follow-through', type: 'website', images: [{ url: '/learn/meeting-follow-through/lesson-poster.jpg', width: 1280, height: 720, alt: 'Good meeting. Now follow through. A lesson with Ian McDonald AI.' }] },
};

export default function MeetingFollowThroughPage() {
  return <article className={styles.page}>
    <Link href="/learn" className={styles.back}>← All lessons</Link>
    <header className={styles.hero}>
      <div>
        <p className={styles.eyebrow}>Learn with Ian / conversations into action</p>
        <h1>Good meeting.<br /><em>Now follow through.</em></h1>
        <p className={styles.dek}>Turn a discovery call into a proposal, a personal follow-up, and a clear next appointment—with Gemini helping you prepare each step.</p>
        <div className={styles.heroLinks}><a className={styles.primaryLink} href="#watch">Watch the demo <span aria-hidden="true">↗</span></a><a href="#steps">Get the six steps & prompts ↓</a></div>
        <p className={styles.facts}>9½-minute edited lesson · 6 practical steps · Copyable prompts</p>
      </div>
      <WorkflowMotion />
    </header>

    <section className={styles.outcome} aria-labelledby="outcome-title">
      <div><p className={styles.eyebrow}>What you’ll walk away with</p><h2 id="outcome-title">A conversation that<br /><em>actually goes somewhere.</em></h2></div>
      <ul><li>A brief and five questions for the call</li><li>A proposal grounded in the meeting</li><li>A follow-up ready for your approval</li><li>A verified time and a tracked next action</li></ul>
    </section>

    <section id="watch" className={styles.watch} aria-labelledby="watch-title">
      <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>Watch it happen</p><h2 id="watch-title">One relationship.<br />One Gemini conversation.</h2></div><p>One edited lesson from Ian’s August 25, 2026 workshop run-through with Maria Elena Duron. Follow the real app demonstration with close-ups, highlights, and notes beside the screen.</p></div>
      <Recording />
      <div className={styles.recordingNote}><strong>About this example</strong><p>The inquiry and meeting transcript were staged with Ariel Santos’s permission, using her real business as context. This is a demonstration, not a client case study. The two recordings have been combined, with long pauses, the restart, and navigation detours removed. Ian’s own voice carries the lesson.</p></div>

    </section>

    <section id="tools" className={styles.section} aria-labelledby="tools-title">
      <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>The working stack</p><h2 id="tools-title">Tools used</h2></div><p>Gemini carries the context. The Google apps give the information—and the next action—a place to live.</p></div>
      <div className={styles.toolGrid}>{tools.map(tool => <a href={tool.href} key={tool.name} target="_blank" rel="noreferrer" className={styles.toolCard}><span className={styles.toolIcon}><Image src={tool.icon} alt="" width={38} height={38} /></span><div><h3>{tool.name}</h3><span className={styles.toolRole}>{tool.role}</span><p>{tool.text}</p><small>by Google</small></div><span aria-hidden="true">↗</span></a>)}</div>
      <details className={styles.setup}><summary>Before you start: connections, transcripts, and a manual path</summary><div><p>Use the same Google account in Gemini and the apps you need. If you want Gemini to reference Drive or Calendar, check its Connected Apps settings and any settings managed by your organization. Availability and allowed actions vary by account and plan.</p><p>Google Meet transcription requires an eligible edition. This demo starts with an existing, staged transcript; it does not demonstrate recording or transcribing the call.</p><p><strong>No connector or transcript?</strong> Use your own meeting notes, paste the relevant text into Gemini, copy the proposal to Docs, check Calendar yourself, and draft the email in Gmail. You can still complete the lesson.</p><p>Use information you have permission to process and check your account’s data settings. The example’s privacy requirements are discussion points, not a guarantee about any product.</p><p><a href="https://support.google.com/gemini/answer/15229592?hl=en" target="_blank" rel="noreferrer">Google’s Connected Apps guidance ↗</a> · <a href="https://support.google.com/meet/answer/12849897?hl=en" target="_blank" rel="noreferrer">Google Meet transcription requirements ↗</a></p></div></details>
    </section>

    <ContextMotion />

    <section id="steps" className={styles.section} aria-labelledby="steps-title">
      <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>Your turn</p><h2 id="steps-title">Six moves.<br />Keep the context.</h2></div><p>Start with one inquiry or recent conversation. These prompts adapt the demonstrated workflow for your business; they are not verbatim transcripts of Ian’s prompts.</p></div>
      <nav className={styles.stepNav} aria-label="Lesson steps">{steps.map(step => <a key={step.id} href={`#${step.id}`}><b>{step.number}</b> {step.title.replace('.', '')}</a>)}</nav>
      {steps.map(step => <section id={step.id} key={step.id} className={styles.step} aria-labelledby={`${step.id}-title`}>
        <div className={styles.stepNumber}>{step.number}<span>{step.phase}</span></div>
        <div className={styles.stepBody}><h3 id={`${step.id}-title`}>{step.title}</h3><p>{step.description}</p><p className={styles.recorded}>{step.recorded}</p><Prompt id={`prompt-${step.id}`} text={step.prompt} /><div className={styles.check}><strong>Before you move on</strong><p>{step.check}</p></div><p className={styles.result}><span aria-hidden="true">↳</span> <strong>You now have:</strong> {step.result}</p></div>
      </section>)}
    </section>

    <section className={styles.finish} aria-labelledby="finish-title"><div><p className={styles.eyebrow}>Close the loop</p><h2 id="finish-title">Check the facts.<br />Check the voice.<br /><em>Check the next step.</em></h2><p>A transcript is business memory. The follow-through is what you do with it.</p></div><ApprovalMotion /></section>

    <section className={styles.resources} aria-labelledby="resources-title"><div><p className={styles.eyebrow}>Keep it handy</p><h2 id="resources-title">The lesson workbench</h2><p>Use the original teaching map, then apply the workflow to one relationship of your own.</p></div><div><a href="https://docs.google.com/presentation/d/1lFMst1oK5WP1perTlphQMQEE4vhYm66GiDgyXzJ1Ni0/edit" target="_blank" rel="noreferrer"><span>Original workshop slides<small>Nine slides / August 25, 2026</small></span><span aria-hidden="true">↗</span></a><a href="/learn/meeting-follow-through/practice.txt" download><span>Fictional practice scenario<small>Inquiry + meeting notes, ready to paste</small></span><span aria-hidden="true">↓</span></a><Link href="/learn/find-leads"><span>Find leads with AI<small>Need a conversation to start with? Try this lesson.</small></span><span aria-hidden="true">↗</span></Link></div></section>
    <Link href="/learn" className={styles.back}>← Back to Learn</Link>
  </article>;
}
