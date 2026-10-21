import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CopyPrompt from './CopyPrompt';
import LoopPreview from './LoopPreview';
import FrameLab from './FrameLab';
import GifGallery from './GifGallery';
import { installPrompt, skillUrl, steps } from './lesson';
import styles from './lesson.module.css';

export const metadata: Metadata = {
  title: 'Make your artwork move | Ian McDonald AI',
  description: 'Browse Ian’s GIF gallery, inspect the transformation frames, and make your own looping animation with five practical moves and a downloadable agent skill.',
  alternates: { canonical: '/learn/animated-gifs' },
  openGraph: { title: 'Make your artwork move', description: 'Your artwork. A few good prompts. One useful loop.', url: '/learn/animated-gifs', images: [{ url: '/learn/animated-gifs/ian-lockup-still.png', width: 1100, height: 384, alt: 'Ian McDonald AI animated logo workshop' }] },
};

function StepArtwork({ number }: { number: string }) {
  if (number === '01') return <div className={styles.referenceArt}><span>THE STARTING POINT</span><Image src="/learn/animated-gifs/cube-still.png" alt="The original cube reference artwork" width={192} height={192} /><b>Your actual artwork.</b><small>Keep the shape. Keep the character.</small></div>;
  if (number === '02') return <div className={styles.miniSheet}><span>MAKE THE MIDDLE</span><div>{[0, 3, 6, 9, 12, 15].map(i => <Image key={i} src={`/learn/animated-gifs/frames/pose-${String(i).padStart(2, '0')}.png`} alt={`Source pose ${i + 1}`} width={90} height={90} />)}</div><b>Different poses.<br />Same point of view.</b></div>;
  if (number === '03') return <div className={styles.cropArt}><span>GIVE IT SOME ROOM</span><div><Image src="/learn/animated-gifs/pose-1.png" alt="Transformation artwork with clearance around its edges" width={192} height={192} /></div><b>All the tips.<br />All the fragments.</b></div>;
  if (number === '04') return <div className={styles.timingArt}><span>THE RHYTHM</span><div><b>Hold</b><i /><small>800 ms</small></div><div><b>Move</b><i /><small>80 ms / pose</small></div><div><b>Land</b><i /><small>800 ms</small></div><p>A starting rhythm.<br />Adjust until it feels right.</p></div>;
  return <div className={styles.exportArt}><span>TAKE IT WITH YOU</span><div><b>GIF</b><span>The handy loop ↗</span></div><div><b>WebP</b><span>Smoother alpha ↗</span></div><div><b>Source</b><span>Room to revise ↗</span></div></div>;
}

export default function AnimatedGifsPage() {
  return <article className={styles.page}>
    <div className={styles.topline}><Link href="/learn">← All lessons</Link><span>THE CREATIVE WORKBENCH / 01</span></div>
    <header className={styles.hero}>
      <div className={styles.heroTop}>
        <div><p className={styles.eyebrow}>Learn with Ian / from reference to repeat</p><h1>Make your<br /><em>artwork move.</em></h1></div>
        <div className={styles.heroNote}><span className={styles.handArrow} aria-hidden="true">↳</span><p>A logo that transforms.<br />A character with a little life.<br /><strong>A loop that still feels like you.</strong></p><a href="#get-the-skill">Give your agent the skill <span aria-hidden="true">↗</span></a></div>
      </div>
      <figure className={styles.heroFilm}>
        <div className={styles.filmTop}><span><i aria-hidden="true" /> THE FINISHED EXAMPLE</span><span>YOUR SYMBOL MOVES / YOUR NAME STAYS</span></div>
        <LoopPreview src="/learn/animated-gifs/ian-lockup.gif" still="/learn/animated-gifs/ian-lockup-still.png" width={1100} height={384} alt="The animated logo transforms through ChatGPT, Claude, Gemini, and Muse by Meta, with Ian McDonald AI fixed beside it" eager />
        <figcaption><span><b>75</b> frames <i> / </i> <b>10.6</b> seconds <i> / </i> one continuous loop</span><a href="/learn/animated-gifs/ian-lockup.gif" download="ian-mcdonald-ai-example.gif">Keep this example ↓</a></figcaption>
      </figure>
      <div className={styles.heroBottom}><span>ONE REFERENCE. A FEW GOOD PROMPTS. SOMETHING WORTH WATCHING.</span><a href="#frame-lab">Pull it apart <span aria-hidden="true">↓</span></a></div>
    </header>

    <GifGallery />

    <section id="frame-lab" className={styles.labSection} aria-labelledby="lab-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>01 / See what makes it work</p><h2 id="lab-title">The good stuff<br />is <em>in between.</em></h2></div><p>A transformation is a series of drawings. In this simpler cube-to-star example, each pose carries a little of the old shape into the new one.<br /><strong>Go on. Scrub through it.</strong></p></div>
      <FrameLab />
    </section>

    <section className={styles.method} aria-label="The reference-to-GIF workflow"><span className={styles.methodLabel}>Your route through the workshop</span><ol>{[['01', 'Bring the artwork'], ['02', 'Make the poses'], ['03', 'Check the cuts'], ['04', 'Find the rhythm'], ['05', 'Export the loop']].map(([n, text]) => <li key={n}><a href={`#step-${n}`}><b>{n}</b><span>{text}</span><i aria-hidden="true">↗</i></a></li>)}</ol></section>

    <section className={styles.tools} aria-labelledby="tools-title"><div><p className={styles.eyebrow}>The working stack</p><h2 id="tools-title">Three jobs.<br />A small toolkit.</h2></div><dl><div><span className={styles.toolIcon}><Image src="/logos/openai.svg" alt="" width={30} height={30} /></span><dt>Make the images</dt><dd>ChatGPT<small>Or your available image tool. This is where the transformation poses come from.</small></dd></div><div><span className={styles.toolGlyph} aria-hidden="true">↳</span><dt>Put it together</dt><dd>Your AI agent<small>An agent that can download files, inspect images, and run code.</small></dd></div><div><span className={styles.toolGlyph} aria-hidden="true">{`{ }`}</span><dt>Export the files</dt><dd>Python + Pillow<small>The included helper handles the GIF, WebP, still, and review sheet.</small></dd></div></dl><p className={styles.toolsNote}>The helper runs locally with Python 3.10+ and Pillow. Image generation depends on your tool and account. If your agent cannot generate images, it can write the prompt and work with the sheet you bring back.</p></section>

    <section id="steps" className={styles.steps} aria-labelledby="steps-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>02 / Make it yours</p><h2 id="steps-title">One clear action.<br /><em>Five useful moves.</em></h2></div><p>Start with one image and one action. These prompts give your agent the direction. You decide what feels right.</p></div>
      {steps.map(step => <section id={`step-${step.number}`} key={step.number} className={styles.step} aria-labelledby={`step-${step.number}-title`}>
        <div className={styles.stepAside}><span className={styles.number}>{step.number}<i aria-hidden="true">↘</i></span><StepArtwork number={step.number} /></div>
        <div className={styles.stepBody}><h3 id={`step-${step.number}-title`}>{step.title}</h3><p>{step.text}</p><CopyPrompt text={step.prompt} compact /><div className={styles.check}><span aria-hidden="true">✓</span><div><strong>Before you move on</strong><p>{step.check}</p></div></div></div>
      </section>)}
    </section>

    <section className={styles.lockup} aria-labelledby="lockup-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>A useful little variation</p><h2 id="lockup-title">Move the symbol.<br /><em>Leave the name alone.</em></h2></div><p>The name does not need to be redrawn with every pose. Keep the original lettering, composite it beside the animation, and give both some breathing room.</p></div><div className={styles.lockupDiagram}><div className={styles.movingPart}><span>THIS PART MOVES <i aria-hidden="true">↻</i></span><LoopPreview src="/learn/animated-gifs/cube-to-gemini.gif" still="/learn/animated-gifs/cube-still.png" width={384} height={384} alt="The cube-to-Gemini symbol animates inside its own area" /></div><div className={styles.fixedPart}><span>THIS PART STAYS</span><strong>Ian McDonald AI</strong><p>Same lettering. Every frame.</p></div></div></section>

    <section id="get-the-skill" className={styles.install} aria-labelledby="skill-title"><div className={styles.installIntro}><p className={styles.eyebrow}>03 / Take the workbench with you</p><span className={styles.skillStamp} aria-hidden="true">GIF<br /><i>WORKSHOP</i></span><h2 id="skill-title">Your agent.<br /><em>A better starting point.</em></h2><p>The skill carries the whole process: generation prompts, frame inspection, timing, exports, and the things we learned by making these loops.</p><a href={skillUrl}>Download the skill ZIP <span aria-hidden="true">↓</span></a><span className={styles.version}>Version 1.0.0 · 12 KB · No API calls in the helper</span></div><div className={styles.installAction}><span className={styles.installNumber}>COPY → PASTE → MAKE SOMETHING</span><h3>Let your agent<br />pick it up from here.</h3><p>Copy this prompt into an agent that can download files and run code. It gets the skill and asks for your artwork.</p><CopyPrompt text={installPrompt} install compact /><p className={styles.installFootnote}>The ZIP works on its own. No access to Ian’s files, accounts, or this conversation needed.</p></div></section>

    <footer className={styles.finish}><span aria-hidden="true">↻</span><div><p className={styles.eyebrow}>Make a small thing. Make it yours.</p><h2>Keep the character.<br /><em>Make the movement count.</em></h2><Link href="/learn">More things you can put to work ↗</Link></div></footer>
  </article>;
}
