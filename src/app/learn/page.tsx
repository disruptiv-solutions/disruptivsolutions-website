import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Learn.module.css';
import { WORKSHOP_KITS } from '@/lib/workshop-kits';
import { LAUNCH_AND_LEARN } from '@/lib/launch-and-learn';

export const metadata: Metadata = {
  title: 'Learn | Ian McDonald AI',
  description:
    'Practical AI lessons, workshop kits, and copyable prompts from Ian McDonald. Learn a useful workflow, then put it to work in your business.',
  alternates: { canonical: '/learn' },
};

function Arrow({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}

function ReadinessArtwork() {
  return <div className={styles.readinessArt} aria-hidden="true">
    <div className={styles.paperBack} />
    <div className={styles.readinessSheet}>
      <span className={styles.sheetLabel}>YOUR BUSINESS / NEXT STEPS</span>
      <span><b>01</b> Organize what you know</span>
      <span><b>02</b> Find your starting point</span>
      <span><b>03</b> Draft your next move <i>↗</i></span>
    </div>
  </div>;
}

function MeetingArtwork() {
  return <div className={styles.meetingArt} aria-hidden="true"><span>THE FOLLOW-THROUGH FILE</span><div><b>01</b> The conversation</div><div><b>02</b> The proposal</div><div><b>03</b> The next appointment</div><strong>Gemini prepares.<br />You approve. <i>✓</i></strong></div>;
}

function GifArtwork() {
  return <div className={styles.gifArt} aria-hidden="true"><span>YOUR ARTWORK / IN MOTION</span><div>{[0, 2, 3].map(i => <Image key={i} src={`/learn/animated-gifs/pose-${i}.png`} width={90} height={90} alt="" />)}</div><strong>Make it move. <i>↻</i></strong></div>;
}

export default function LearnPage() {
  const lessons = WORKSHOP_KITS.filter((kit) => kit.status === 'live');
  const featured = lessons.find((kit) => kit.slug === 'find-leads');
  const moreLessons = lessons.filter((kit) => kit !== featured);

  return <div className={styles.page}>
    <header className={styles.intro}>
      <div>
        <p className={styles.eyebrow}>Learn with Ian</p>
        <h1>Less theory.<br /><em>More doing.</em></h1>
      </div>
      <div className={styles.introNote}>
        <span className={styles.noteMark} aria-hidden="true">↳</span>
        <p>Real demos. Useful prompts.<br />Something you can put to work.</p>
        <span>Start with a lesson. Bring your questions. Keep building.</span>
      </div>
    </header>

    <nav className={styles.startingPath} aria-label="Choose how to learn">
      <a href="#lessons"><span>01 / Try it yourself</span><strong>Start with a free lesson <Arrow /></strong></a>
      <a href="#learn-live"><span>02 / Work through a question</span><strong>Join the weekly call <Arrow /></strong></a>
      <Link href="/community"><span>03 / Keep building together</span><strong>Explore the free community <Arrow /></strong></Link>
    </nav>

    <section id="lessons" aria-label="Lessons and workshop kits" className={styles.library}>
      <div className={styles.libraryHeading}>
        <span>The practical collection</span>
        <span>{String(lessons.length).padStart(2, '0')} {lessons.length === 1 ? 'resource' : 'resources'} / ready when you are</span>
      </div>

      {featured && <Link href={`/learn/${featured.slug}`} className={styles.featured} aria-labelledby="featured-lesson-title">
        <div className={styles.featuredVisual} aria-hidden="true">
          <div className={styles.tools}>
            <span><Image src="/workshop-kits/find-leads/google-gemini.png" alt="" width={24} height={24} />Gemini</span>
            <span className={styles.toolArrow}>→</span>
            <span><Image src="/workshop-kits/find-leads/google-sheets.svg" alt="" width={24} height={24} />Google Sheets</span>
          </div>
          <div className={styles.trackerFrame}>
            <Image src="/learn/find-leads-tracker.png" alt="" width={1920} height={1144} sizes="(max-width: 760px) 100vw, 660px" priority />
          </div>
          <div className={styles.resultSlip}><span>What you’ll make</span><strong>A lead tracker.<br />With a next action.</strong><Arrow /></div>
          <span className={styles.visualIndex}>01 / IN PRACTICE</span>
        </div>

        <div className={styles.featuredCopy}>
          <div className={styles.featuredMeta}><span className={styles.startHere}>Start here</span><span>Video + copyable prompts</span></div>
          <h2 id="featured-lesson-title">{featured.title}.<br /><em>Then follow up.</em></h2>
          <p>Find the right opportunities, check the details, and turn a list into a tracker you’ll actually use.</p>
          <div className={styles.lessonFacts}><span>Short walkthrough</span><span>8 practical steps</span></div>
          <span className={styles.featuredAction}>Get the walkthrough & prompts <Arrow /></span>
        </div>
      </Link>}

      {moreLessons.map((kit, index) => <Link key={kit.slug} href={`/learn/${kit.slug}`} className={styles.workshop} aria-labelledby={`lesson-${kit.slug}`}>
        {kit.slug === 'meeting-follow-through' ? <MeetingArtwork /> : kit.slug === 'animated-gifs' ? <GifArtwork /> : kit.slug === 'supplier-readiness-builder' ? <ReadinessArtwork /> : <div className={styles.genericArt} aria-hidden="true">{String(index + 2).padStart(2, '0')}<span>LEARN / DO / REPEAT</span></div>}
        <div className={styles.workshopCopy}>
          <p className={styles.resourceType}>{String(index + 2).padStart(2, '0')} / {kit.slug === 'meeting-follow-through' ? 'Video lesson + copyable prompts' : kit.slug === 'animated-gifs' ? 'GIF lesson + downloadable agent skill' : 'Interactive workshop kit'}</p>
          <h2 id={`lesson-${kit.slug}`}>{kit.title}</h2>
          <p>{kit.description}</p>
          <span className={styles.workshopAudience}>{kit.eyebrow}</span>
        </div>
        <span className={styles.workshopAction}><span>{kit.slug === 'animated-gifs' ? 'Make a GIF' : kit.slug === 'meeting-follow-through' ? 'Start the lesson' : 'Open the kit'}</span><Arrow /></span>
      </Link>)}
    </section>

    <section id="learn-live" className={styles.liveSession} aria-labelledby="live-title">
      <div><p className={styles.eyebrow}>Free / Launch &amp; Learn</p><h2 id="live-title">Bring what you’re<br /><em>working on.</em></h2></div>
      <div><p>Join my weekly call for practical AI building, live walkthroughs, and founder Q&amp;A. Bring a question from a lesson, a project you’re trying, or something you want to make easier.</p><p className={styles.schedule}>{LAUNCH_AND_LEARN.schedule}</p><a className={styles.liveLink} href={LAUNCH_AND_LEARN.meetingUrl} target="_blank" rel="noopener noreferrer">Join Launch &amp; Learn <Arrow /></a><Link className={styles.communityLink} href="/community">Keep the conversation going in my free community <span aria-hidden="true">→</span></Link></div>
    </section>
    <aside className={styles.extraResources} aria-label="More ways to learn"><p>Still choosing a starting point? <Link href="/assessment">Try the free AI Snapshot.</Link></p><p>Prefer to follow along? <Link href="/newsletter">Get notes from my workbench.</Link></p></aside>

  </div>;
}
