import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CopyPrompt from './CopyPrompt';
import LoopPreview from './LoopPreview';
import { installPrompt, skillUrl, steps } from './lesson';
import styles from './lesson.module.css';

export const metadata: Metadata = {
  title: 'Make your artwork move | Ian McDonald AI',
  description: 'Turn reference artwork into a looping GIF. Learn the sprite-sheet process, copy the prompts, and download a portable skill for your AI agent.',
  alternates: { canonical: '/learn/animated-gifs' },
  openGraph: { title: 'Make your artwork move', description: 'Your artwork. A few good prompts. One useful loop.', url: '/learn/animated-gifs', images: [{ url: '/learn/animated-gifs/lockup-still.png', width: 960, height: 384, alt: 'Disruptiv Solutions animated logo lesson' }] },
};

export default function AnimatedGifsPage() {
  return <article className={styles.page}>
    <Link href="/learn" className={styles.back}>← All lessons</Link>
    <header className={styles.hero}>
      <div className={styles.heroCopy}><p className={styles.eyebrow}>Learn with Ian / a little motion goes a long way</p><h1>Your artwork.<br /><em>Now make it move.</em></h1><p className={styles.dek}>A logo that transforms. A paper crane that unfolds. Start with an image you love, then use AI to make a loop worth watching.</p><a className={styles.primary} href="#get-the-skill">Get the skill for your agent <span aria-hidden="true">↗</span></a><p className={styles.facts}>5 practical steps · Copyable prompts · Downloadable skill</p></div>
      <figure className={styles.heroArt}><div className={styles.artLabel}><span>FROM THE WORKBENCH</span><span>01 / LOGO MORPH</span></div><LoopPreview src="/learn/animated-gifs/cube-to-gemini.gif" still="/learn/animated-gifs/cube-still.png" width={384} height={384} alt="Disruptiv’s cube transforms into the Gemini star and returns" /><figcaption><strong>16 source poses.<br />One little loop.</strong><span>30 playback frames<br />4.52 seconds</span></figcaption></figure>
    </header>

    <section className={styles.method} aria-label="How the process works"><span className={styles.methodLabel}>The whole trick</span><ol><li><b>01</b> Reference artwork</li><li><b>02</b> Transformation poses</li><li><b>03</b> Inspect the frames</li><li><b>04</b> Assemble & loop <span aria-hidden="true">↻</span></li></ol></section>

    <section className={styles.breakdown} aria-labelledby="breakdown-title"><div><p className={styles.eyebrow}>What happens between A and B?</p><h2 id="breakdown-title">The shapes<br /><em>do the work.</em></h2><p>The image tool makes a sheet of poses. Your agent turns those poses into an animation. The interesting part is what happens in the middle.</p></div><div className={styles.poseStrip}>{['Start', 'Separate', 'Reshape', 'Settle'].map((label, i) => <figure key={label}><Image src={`/learn/animated-gifs/pose-${i}.png`} alt={`Transformation pose: ${label.toLowerCase()}`} width={192} height={192} /><figcaption><span>0{i + 1}</span>{label}</figcaption></figure>)}</div></section>

    <section id="get-the-skill" className={styles.install} aria-labelledby="skill-title"><div className={styles.installIntro}><p className={styles.eyebrow}>Take the process with you</p><h2 id="skill-title">Give your agent<br /><em>the playbook.</em></h2><p>Copy this into an agent that can download files and run code. It gets the skill, reads the instructions, and helps you make your own loop.</p><p className={styles.small}>Inside: generation prompts, frame assembly, timing, transparent exports, quality checks, and the fixed wordmark variation.</p><a href={skillUrl}>Download the skill ZIP directly <span aria-hidden="true">↓</span></a><span className={styles.version}>Version 1.0.0 · 12 KB · No API calls in the helper</span></div><CopyPrompt text={installPrompt} install /></section>

    <section className={styles.tools} aria-labelledby="tools-title"><h2 id="tools-title">Tools used</h2><dl><div><dt>Image creation</dt><dd>ChatGPT, or your available image tool<small>Makes the artwork and transformation poses.</small></dd></div><div><dt>File-capable AI agent</dt><dd>Your coding agent<small>Inspects, slices, assembles, and revises.</small></dd></div><div><dt>Assembly</dt><dd>Python + Pillow<small>The included helper exports GIF and WebP.</small></dd></div></dl><p>The helper runs locally with Python 3.10+ and Pillow. Image generation depends on your tool and account. If your agent cannot make images, it can give you the prompt to use in an image tool, then work with the sheet you bring back.</p></section>

    <section id="steps" className={styles.steps} aria-labelledby="steps-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Your turn</p><h2 id="steps-title">One image.<br /><em>Five moves.</em></h2></div><p>Start small. One clear action is enough. Keep the reference, the frames, and the timing so you can keep improving it.</p></div>{steps.map(step => <section key={step.number} className={styles.step} aria-labelledby={`step-${step.number}`}><span className={styles.number}>{step.number}</span><div><h3 id={`step-${step.number}`}>{step.title}</h3><p>{step.text}</p><CopyPrompt text={step.prompt} /><div className={styles.check}><strong>Before you move on</strong><p>{step.check}</p></div></div></section>)}</section>

    <section className={styles.lockup} aria-labelledby="lockup-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>One more variation</p><h2 id="lockup-title">Let the symbol move.<br /><em>Let the name stay put.</em></h2></div><p>For this version, the symbol transforms through a sequence of AI logos while the Disruptiv Solutions wordmark stays fixed. The lettering is composited once, with room to breathe.</p></div><div className={styles.lockupStage}><LoopPreview src="/learn/animated-gifs/lockup.gif" still="/learn/animated-gifs/lockup-still.png" width={960} height={384} alt="An animated symbol cycles from Disruptiv through ChatGPT, Claude, Gemini, and Muse by Meta, beside a fixed Disruptiv Solutions wordmark" /></div><p className={styles.caption}>75 playback frames · 10.6 seconds · Same wordmark in every frame</p></section>

    <section className={styles.finish}><span aria-hidden="true">↻</span><div><h2>Keep the character.<br /><em>Make the movement count.</em></h2><p>The best loop still feels like the artwork you started with.</p><a href="#get-the-skill">Copy the skill for your agent ↑</a></div></section>
    <Link href="/learn" className={styles.back}>← Back to Learn</Link>
  </article>;
}
