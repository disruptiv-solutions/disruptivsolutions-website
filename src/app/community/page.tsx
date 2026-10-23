import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CommunityAction from './CommunityAction';
import styles from './Community.module.css';
import { LAUNCH_AND_LEARN } from '@/lib/launch-and-learn';
import { ProductFilm } from '@/components/site/ProductFilm';

export const metadata: Metadata = {
  title: 'My Community & the Platform I Built | Ian McDonald AI',
  description: 'Join Ian McDonald’s free community for practical AI lessons and projects. Meet LaunchBox, the community platform he built, and explore creating a community of your own.',
  alternates: { canonical: '/community' },
};

export default function CommunityPage() {
  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="community-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Ian McDonald AI / Free community</p>
        <h1 id="community-title">I built the platform.<br /><em>Come build<br className={styles.desktopBreak} /> with me.</em></h1>
        <p className={styles.intro}>My free community is where I share practical AI lessons, useful prompts, and the things I’m making. Bring something you want to learn, try, or figure out.</p>
        <p className={styles.heroDetail}>It lives on <strong>LaunchBox</strong>, the platform I designed and built. My community is one of several that call it home.</p>
        <div className={styles.actions}>
          <CommunityAction location="community_page_hero" className={styles.primary}>Join my free community</CommunityAction>
          <a href="#the-platform" className={styles.textLink}>See the platform I built <span aria-hidden="true">↓</span></a>
        </div>
        <p className={styles.smallNote}>Free to join. Start wherever you are.</p>
      </div>
      <figure className={styles.founder}>
        <div className={styles.portraitFrame}><Image src="/ian-mcdonald.png" alt="Ian McDonald, founder and builder of LaunchBox" width={1254} height={1254} priority sizes="(max-width: 760px) 90vw, 40vw" /></div>
        <div className={styles.founderStamp}><Image src="/launchbox-no-text.png" width={62} height={62} alt="" /><div><span>I built this.</span><strong>LaunchBox</strong></div></div>
        <figcaption>Ian McDonald <span>Founder. Builder. Still learning.</span></figcaption>
      </figure>
    </section>

    <section className={styles.inside} aria-labelledby="inside-title">
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>Your first steps inside</p>
        <h2 id="inside-title">Come with an idea.<br /><em>Try something real.</em></h2>
        <p>You don’t need a technical background or a finished project. Start with one thing you’d like to make easier, then use the examples to find your next step.</p>
        <ol className={styles.practices}>
          <li><span aria-hidden="true">01</span><div><h3>Try one small project.</h3><p>Start with the lead tracker or animated GIF lesson. Use the prompts with your own information and make something you can use.</p><Link className={styles.textLink} href="/learn">Choose a free lesson <span aria-hidden="true">→</span></Link></div></li>
          <li><span aria-hidden="true">02</span><div><h3>Show what you’re trying.</h3><p>Introduce yourself in the community. Share your result or the step where you got stuck so there’s something concrete to work through.</p></div></li>
          <li><span aria-hidden="true">03</span><div><h3>Bring it to Launch &amp; Learn.</h3><p>My free weekly call is a place for live walkthroughs and questions.<br />{LAUNCH_AND_LEARN.schedule}.</p><Link className={styles.textLink} href="/learn#learn-live">Get the call details <span aria-hidden="true">→</span></Link></div></li>
        </ol>
      </div>
      <div className={styles.workbench}>
        <div className={styles.workbenchHeading}><span>From my workbench</span><span aria-hidden="true">↙</span></div>
        <Link href="/learn/animated-gifs" className={styles.example}>
          <div className={styles.gifVisual}><Image src="/learn/animated-gifs/ian-lockup-still.png" width={960} height={540} alt="Ian McDonald AI logo from the animated GIF lesson" sizes="(max-width: 760px) 90vw, 480px" /></div>
          <div className={styles.exampleLabel}><span><strong>Give a still image some life.</strong><small>GIF lesson + downloadable agent skill</small></span><span aria-hidden="true">↗</span></div>
        </Link>
        <Link href="/learn/find-leads" className={`${styles.example} ${styles.trackerExample}`}>
          <div className={styles.trackerVisual}><Image src="/learn/find-leads-tracker.png" width={1920} height={1144} alt="An opportunity tracker created with Gemini and Google Sheets" sizes="(max-width: 760px) 90vw, 480px" /></div>
          <div className={styles.exampleLabel}><span><strong>Turn research into a next action.</strong><small>Gemini + Google Sheets walkthrough</small></span><span aria-hidden="true">↗</span></div>
        </Link>
        <CommunityAction location="community_page_workbench" className={styles.textLink}>Join me inside</CommunityAction>
      </div>
    </section>

    <section className={styles.story} aria-labelledby="story-title">
      <div className={styles.storyHeading}>
        <p className={styles.eyebrow}>The story behind the place</p>
        <h2 id="story-title">I learned by building.<br /><em>Then I built a place<br /> for other people.</em></h2>
        <p>I’m a self-taught builder. The things I teach come from the work of making software, using it with real people, and improving it when something needs to work better.</p>
        <Link href="/about" className={styles.textLink}>A little more about me <span aria-hidden="true">→</span></Link>
      </div>
      <ol className={styles.timeline}>
        <li><span className={styles.year}>2023</span><div><h3>I went all-in.</h3><p>In December 2023, I went all-in on building with $5,000. No computer science degree, bootcamp, or co-founder. I learned by making things and working through what broke.</p></div></li>
        <li><span className={styles.year}>2025</span><div><h3>I built for real users.</h3><p>I built the AI for Business platform solo. It supported more than 1,600 users and gave me hands-on experience turning AI tools into something people could use.</p><Link href="/work/ai-for-business" className={styles.textLink}>See that project <span aria-hidden="true">→</span></Link></div></li>
        <li><span className={styles.year}>Today</span><div><h3>LaunchBox is home to multiple communities.</h3><p>I built LaunchBox so people can turn their expertise and ideas into a community under their own brand. Conversations, courses, events, paid offers, and AI tools live together. I run my own community on it, too.</p></div></li>
      </ol>
    </section>

    <section id="the-platform" className={styles.platform} aria-labelledby="platform-title">
      <figure className={styles.platformFilm}>
        <ProductFilm src="/films/launchbox-demo-v1.mp4" poster="/films/launchbox-poster-v1.jpg" title="LaunchBox member learning journey" />
        <figcaption>A recreated member journey using sample learning material in the LaunchBox interface.</figcaption>
      </figure>
      <div className={styles.platformCopy}>
        <div className={styles.platformBrand}><Image src="/launchbox-no-text.png" alt="" width={48} height={48} /><span>LaunchBox</span></div>
        <h2 id="platform-title">Have a community<br />of your own in mind?</h2>
        <p>Turn your workshop, expertise, or idea into a place for your people. Start a private preview on LaunchBox, with your own audience and brand.</p>
        <CommunityAction action="build" location="community_page_build" className={styles.buildButton}>Build my community preview</CommunityAction>
        <p className={styles.planNote}>Start without a card. A free account saves your preview. Publishing and inviting members requires a paid Business plan.</p>
        <a className={styles.platformLink} href="https://www.launchbox.space/">Explore LaunchBox and its plans <span aria-hidden="true">↗</span></a>
      </div>
      <div className={styles.platformNote}>
        <span className={styles.noteLabel}>Your community / Your brand</span>
        <h3>Start by being<br />part of mine.</h3>
        <p className={styles.memberFirst}>You don’t need to build a community to join mine. Come for the lessons, questions, and things we can make together.</p>
        <CommunityAction location="community_page_platform_member" className={styles.textLink}>Join Ian McDonald AI free</CommunityAction>
        <a href="https://www.youtube.com/watch?v=t4WRiGmD630" className={styles.storyVideo}><span aria-hidden="true">▷</span><span>Watch why I built LaunchBox<small>My founder story · 3:14</small></span><span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section className={styles.close} aria-labelledby="join-title">
      <div><p className={styles.eyebrow}>Start with my community</p><h2 id="join-title">Come see what<br /><em>we can make.</em></h2></div>
      <div><p>Join me in Ian McDonald AI. Explore a lesson, bring a question, or share something you’re working on.</p><CommunityAction location="community_page_close" className={styles.primary}>Join my free community</CommunityAction></div>
    </section>
  </div>;
}
