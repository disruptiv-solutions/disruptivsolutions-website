'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import styles from './LessonMotion.module.css';
import lesson from './lesson.module.css';

function MotionFigure({ children, className = '', label }: { children: ReactNode; className?: string; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState('still');
  const [enabled, setEnabled] = useState(false);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    function configure() {
      observer?.disconnect();
      const animate = !preference.matches && 'IntersectionObserver' in window;
      setEnabled(animate);
      setPhase(animate ? 'armed' : 'still');
      if (!animate || !root.current) return;
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        setPhase('play');
        observer?.disconnect();
      }, { threshold: 0.2 });
      observer.observe(root.current);
    }
    configure();
    preference.addEventListener('change', configure);
    return () => { observer?.disconnect(); preference.removeEventListener('change', configure); };
  }, []);

  return <div ref={root} className={`${styles.figure} ${className}`} data-motion={phase}>
    <div key={replay}>{children}</div>
    {enabled && <button type="button" className={styles.replay} aria-label={`Replay ${label} animation`} onClick={() => { setPhase('play'); setReplay(value => value + 1); }}><span aria-hidden="true">↻</span> Replay</button>}
  </div>;
}

function timing(milliseconds: number): CSSProperties {
  return { '--delay': `${milliseconds}ms` } as CSSProperties;
}

function Arrow({ delay }: { delay: number }) {
  return <svg className={styles.arrow} style={timing(delay)} viewBox="0 0 36 24" fill="none" aria-hidden="true"><path className={styles.draw} pathLength="1" d="M1 12H32M24 4L32 12L24 20" /><circle className={styles.packet} cx="1" cy="12" r="3" /></svg>;
}

export function WorkflowMotion() {
  return <MotionFigure className={`${lesson.heroArtwork} ${styles.workflowFigure}`} label="follow-through workflow">
    <span className={`${lesson.paperLabel} ${styles.fileLabel}`}>THE FOLLOW-THROUGH FILE</span>
    <ol className={`${lesson.workflow} ${styles.workflow}`} aria-label="The follow-through workflow">
      {[
        ['01', 'Inquiry + website', 'Understand the business'],
        ['02', 'Discovery call', 'Capture what matters'],
        ['03', 'Proposal + follow-up', 'Make a useful draft'],
        ['04', 'Next appointment', 'Keep the work moving'],
      ].map(([number, title, description], index) => <li className={styles.arrive} style={timing(index * 480)} key={number}><span>{number}</span><strong>{title}</strong><small>{description}</small><i className={styles.rowLine} aria-hidden="true" style={timing(index * 480 + 250)} /></li>)}
    </ol>
    <div className={`${lesson.approvalSlip} ${styles.slip}`}><span>Your job in every step</span><strong>Gemini prepares.<br />You approve.</strong><span className={styles.tick} aria-hidden="true">✓</span></div>
  </MotionFigure>;
}

export function ContextMotion() {
  return <section id="workflow-map" className={styles.contextSection} aria-labelledby="context-motion-title">
    <div className={lesson.sectionIntro}><div><p className={lesson.eyebrow}>Keep the thread</p><h2 id="context-motion-title">The context stays.<br /><em>The work moves forward.</em></h2></div><p>Bring the inquiry, business research, and meeting notes into the same conversation. Each draft starts with what you already learned.</p></div>
    <MotionFigure className={styles.contextFigure} label="context into action">
      <div className={styles.flow}>
        <div className={styles.sourceStack}>
          <p className={styles.label}>01 / Bring the context</p>
          {[
            ['gmail.svg', 'The inquiry', 'What they’re asking for'],
            ['google-drive.svg', 'The research', 'Who they are + what they do'],
            ['google-meet.svg', 'The conversation', 'Priorities + commitments'],
          ].map(([icon, title, detail], index) => <div className={`${styles.paper} ${styles.arrive}`} key={title} style={timing(index * 240)}><Image src={`/learn/meeting-follow-through/${icon}`} width={25} height={25} alt="" /><div><strong>{title}</strong><small>{detail}</small></div></div>)}
        </div>
        <Arrow delay={750} />
        <div className={`${styles.contextCard} ${styles.arrive}`} style={timing(1050)}>
          <Image src="/workshop-kits/find-leads/google-gemini.png" width={40} height={40} alt="" />
          <p className={styles.label}>02 / Keep one conversation</p>
          <h3>Start with<br />what matters.</h3>
          <ul>{['Their priorities', 'Their constraints', 'Your commitments'].map((text, index) => <li className={styles.underline} style={timing(1400 + index * 200)} key={text}>{text}</li>)}</ul>
        </div>
        <Arrow delay={2050} />
        <div className={styles.resultStack}>
          <p className={styles.label}>03 / Prepare the next step</p>
          {[
            ['google-docs.svg', 'A proposal', 'Scope + deliverables'],
            ['gmail.svg', 'A personal follow-up', 'A message in your voice'],
            ['google-calendar.svg', 'A tentative hold', 'A real time to move forward'],
          ].map(([icon, title, detail], index) => <div className={`${styles.paper} ${styles.result} ${styles.arrive}`} key={title} style={timing(2400 + index * 300)}><Image src={`/learn/meeting-follow-through/${icon}`} width={25} height={25} alt="" /><div><strong>{title}</strong><small>{detail}</small></div></div>)}
        </div>
      </div>
      <p className={`${styles.caption} ${styles.arrive}`} style={timing(3450)}><span aria-hidden="true">↳</span> Connected context. Useful drafts. <strong>Your approval.</strong></p>
    </MotionFigure>
  </section>;
}

export function ApprovalMotion() {
  return <MotionFigure className={styles.approvalFigure} label="draft review decision">
    <h3>A draft is a decision point.</h3>
    <div className={styles.gate}>
      <div className={`${styles.draftNode} ${styles.arrive}`}>Gemini’s draft<small>A starting point for your review</small></div>
      <svg className={styles.gateArrow} viewBox="0 0 24 40" fill="none" aria-hidden="true"><path className={styles.draw} pathLength="1" d="M12 1V35M5 28L12 35L19 28" /></svg>
      <div className={`${styles.reviewNode} ${styles.arrive}`} style={timing(650)}><strong>You review.</strong><span>Facts · Voice · Next step</span></div>
      <svg className={styles.fork} viewBox="0 0 400 65" fill="none" aria-hidden="true"><path className={styles.draw} pathLength="1" d="M200 0V25H95V60M88 53L95 60L102 53" /><path className={styles.draw} pathLength="1" d="M200 25H305V60M298 53L305 60L312 53" /></svg>
      <div className={styles.branches}>
        <div className={`${styles.reviseNode} ${styles.arrive}`} style={timing(1700)}><small>Needs a change</small><strong>↶ Revise</strong><span>Bring the correction back into the conversation.</span></div>
        <div className={`${styles.actionNode} ${styles.arrive}`} style={timing(2100)}><small>Checked by you</small><strong>Take action</strong><span>Send · Share · Schedule</span></div>
      </div>
    </div>
    <p className={`${styles.gateCaption} ${styles.arrive}`} style={timing(2700)}>Nothing goes out without you.</p>
    <details className={styles.checks}><summary>Your five checks</summary><ul>{[
      'The proposal reflects the conversation.',
      'The email has the correct recipient and link.',
      'The full date, time, and time zone match.',
      'A tentative hold is marked tentative.',
      'You know who is doing what next.',
    ].map(text => <li key={text}>{text}</li>)}</ul></details>
    <a href="/learn/meeting-follow-through/prompts.txt" download>Download all six prompts ↓</a>
  </MotionFigure>;
}
