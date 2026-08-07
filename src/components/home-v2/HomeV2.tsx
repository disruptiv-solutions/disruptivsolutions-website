"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { trackButtonClick, trackFormSubmission } from "@/lib/analytics";
import styles from "./HomeV2.module.css";

const CALENDAR_URL = "https://calendar.app.google/J6uMiKkf3AM4zS9MA";
const LAUNCH_AND_LEARN_URL = "https://meet.google.com/cgm-vcdg-hvh";

const pillars = [
  { title: "AI Ops", body: "Audits and implementation for time savings, tool consolidation, and automation." },
  { title: "Speaking", body: "Keynotes, workshops, live builds, panels, and fireside chats." },
  { title: "Disruptiv Solutions", body: "White-label AI products and practical delivery for operators who need to ship." },
  { title: "Launch & Learn", body: "Free education that turns AI curiosity into practical action." },
];

const principles = [
  { title: "Start messy.", body: "There’s nothing you can imagine that you can’t start building. It doesn’t need to be perfect or a billion-dollar idea. Ship something today." },
  { title: "Build real solutions.", body: "Products non-technical people actually use. Ship features, fix bugs, and teach people to build real apps. No jargon, no fluff." },
  { title: "Compound your skills.", body: "Weekend projects become portfolio pieces. Portfolio pieces become confidence. Confidence becomes momentum." },
  { title: "Learn in public.", body: "Every project taught me something I used in the next. Share the journey, and other people can skip your mistakes." },
];

const fitList = [
  "AI and innovation conferences",
  "Founder and startup communities",
  "Chambers of commerce and business councils",
  "Workforce boards and employer networks",
  "Coach, consultant, and creator communities",
  "Community-led businesses and membership groups",
];

const gigs: Array<{ number: string; title: string; date: string; body: string; logo: string; logoAlt: string; href?: string; linkLabel?: string }> = [
  { number: "01", title: "Houston AI Club — Agent Ops live demo", date: "August 2026", body: "Returned for a Lightning Lesson to demonstrate a three-layer AI workforce: persistent-memory agents, a custom operating system, and a live gamified dashboard running real ventures.", logo: "/speaking/logos/houston-ai-club-landscape.png", logoAlt: "Houston AI Club" },
  { number: "02", title: "HMSDC MBE Leadership Academy", date: "2026", body: "Designed and led the AI Supplier Readiness Builder—a hands-on workshop and take-home system that helps minority business owners score readiness, build prompts, and draft growth-plan deliverables.", logo: "/speaking/logos/hmsdc-landscape.png", logoAlt: "Houston Minority Supplier Development Council", href: "/kits/supplier-readiness-builder", linkLabel: "Explore the workshop kit" },
  { number: "03", title: "Small & Diverse Business Inclusion Summit", date: "June 26, 2026", body: "Led a practical AI and automation breakout for small-business owners and industry leaders—researching real opportunities, organizing them, and drafting outreach live.", logo: "/speaking/logos/precinct-one-landscape.png", logoAlt: "Rodney Ellis, Harris County Commissioner Precinct One" },
  { number: "04", title: "Houston AI Club — AI Lightning Lesson", date: "May 21, 2026", body: "From AI Consumer to AI Builder, with a live LaunchBox build for 50+ attendees and an active operator Q&A.", logo: "/speaking/logos/houston-ai-club-landscape.png", logoAlt: "Houston AI Club" },
  { number: "05", title: "AIXP Houston 2026", date: "April 2026", body: "Four speaking slots, including the Founder Stories panel, sharing the LaunchBox build story with an operator audience.", logo: "/speaking/logos/aixp-landscape.png", logoAlt: "AIXP, The AI Experience" },
  { number: "06", title: "Chase pitch event", date: "2026", body: "Pitched LaunchBox to a room of bankers and operators, leading to measurable partner conversations.", logo: "/speaking/logos/chase-landscape.svg", logoAlt: "Chase" },
  { number: "07", title: "Orlando keynote", date: "May 2025", body: "Spoke to a room of 500+ people about building AI products as a self-taught operator.", logo: "/speaking/logos/ai-for-business-landscape.png", logoAlt: "AI for Business" },
  { number: "08", title: "Jacksonville keynote", date: "March 2025", body: "Spoke to a room of 250+ people about practical AI for non-technical founders.", logo: "/speaking/logos/ai-for-business-landscape.png", logoAlt: "AI for Business" },
];

const stageShots = [
  { src: "/speaking/ian-speaker-aixp.jpg", title: "AIXP Houston", meta: "April 2026" },
  { src: "/speaking/ian-speaker-summit-2026.jpg", title: "Inclusion Summit", meta: "June 2026 · ~100 audience" },
  { src: "/speaking/ian-speaker-orlando-2025.png", title: "Orlando keynote", meta: "May 2025 · 500+ audience" },
  { src: "/speaking/ian-speaker-jacksonville-2025.png", title: "Jacksonville keynote", meta: "March 2025 · 250+ audience" },
];

const talks = [
  { number: "01", title: "If I Can Build This, You Can Build Yours", body: "A founder story, practical AI lessons, and live show-and-tell from the builder’s seat.", bestFor: "Founder events, AI conferences, small-business communities, workforce groups", outcome: "People leave believing they can build real business assets now—even without a technical background." },
  { number: "02", title: "AI for Employers", body: "What AI adoption actually looks like inside a 5–50 person business right now. Tools, workflows, what fails, and what sticks.", bestFor: "Workforce boards, chambers, employer networks", outcome: "Practical ways small teams can use AI in marketing, operations, content, and customer workflows—starting Monday." },
  { number: "03", title: "From Idea to Platform in 30 Minutes — Live", body: "Ian takes an idea from the room and turns it into a platform concept, launch page, lead magnet, and first-invite path.", bestFor: "Workshops, founder meetups, business communities", outcome: "A working example of moving from a vague idea to something people can actually join." },
  { number: "04", title: "Turn Your Expertise Into a Platform", body: "A practical model for packaging what you already know into a branded, AI-powered experience.", bestFor: "Coaches, consultants, creators, and membership groups", outcome: "A clearer offer and a first-10-members path instead of another giant course to build." },
];

const quotes = [
  { text: "If these tools would have been available 10 years ago, I already would have been doing millions of dollars a year. People like Ian are gonna help you attract that with your marketing.", who: "Pat Hilton", role: "Headlining keynote · Orlando, May 2025" },
  { text: "I enjoyed your speech, the hands-on coding presentation, your honesty and humble attitude, and your drive.", who: "Monika Mielnik", role: "Director, UX/UI Design & Development · AIXP Houston" },
  { text: "Ian is doing something that I have yet to accomplish with NextShiftIQ. He is doing this with a fraction of the experience I have as a developer.", who: "Joseph Bankole", role: "Senior Data Engineer · public LinkedIn post" },
  { text: "Great story buddy! I wish my son joined this call. Your story is inspiring.", who: "Frank Huang", role: "Houston AI Club · May 2026" },
  { text: "I’m going to put you in as our expert AI.", who: "Nancy Smith", role: "Workforce Solutions East End" },
  { text: "I loved your presentation and can’t wait to implement it.", who: "Debbie H Page", role: "Orlando keynote attendee" },
];

const formats = ["20–30 minute keynote", "45–60 minute workshop", "Live build session", "Panel guest", "Fireside chat", "Community activation"];

function Brand() {
  return (
    <span className={styles.brand}>
      <Image src="/DS-Logo.svg" alt="" width={34} height={34} priority />
      <span>Ian McDonald</span>
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className={styles.eyebrow}>{children}</div>;
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className={styles.sectionHeading}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      interest: String(data.get("interest") || ""),
      note: String(data.get("note") || ""),
    };

    if (!payload.name || !payload.email || !payload.interest) {
      setError("Please fill in your name, email, and what you’re interested in.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      const response = await fetch("/api/speaking-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not send your inquiry.");
      trackFormSubmission("speaking_inquiry", { page_location: "home_v2" });
      form.reset();
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send your inquiry. Please email Ian directly.");
      setStatus("error");
    }
  }

  return (
    <form className={styles.inquiryForm} onSubmit={submit}>
      <div className={styles.formGrid}>
        <label>Your name<input name="name" autoComplete="name" placeholder="Jane Doe" disabled={status === "submitting"} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@company.com" disabled={status === "submitting"} /></label>
      </div>
      <label>What are you interested in?
        <select name="interest" defaultValue="" disabled={status === "submitting"}>
          <option value="" disabled>Select one…</option>
          <option value="speaking-event">Keynote</option>
          <option value="corporate-workshop">Workshop / training</option>
          <option value="live-build">Live build session</option>
          <option value="panel">Panel or fireside chat</option>
          <option value="community-partnership">Community activation partnership</option>
          <option value="other">Something else</option>
        </select>
      </label>
      <label>Anything to add? <span>(optional)</span><textarea name="note" rows={4} maxLength={5000} placeholder="Event date, audience, format — whatever helps." disabled={status === "submitting"} /></label>
      {status === "error" && <p className={styles.formError}>{error}</p>}
      {status === "success" && <p className={styles.formSuccess}>Got it. Check your inbox for confirmation—Ian will reply personally.</p>}
      <button type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending…" : "Send inquiry"}</button>
      <small>You’ll get an email confirmation. Ian replies personally.</small>
    </form>
  );
}

export default function HomeV2() {
  const [principle, setPrinciple] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setPrinciple((current) => (current + 1) % principles.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="#top" aria-label="Ian McDonald home" onClick={closeMenu}><Brand /></a>
          <button className={styles.menuButton} type="button" aria-expanded={menuOpen} aria-controls="home-navigation" onClick={() => setMenuOpen((open) => !open)}>
            <span /><span /><span />
            <span className={styles.srOnly}>Toggle navigation</span>
          </button>
          <nav id="home-navigation" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Homepage">
            <a href="#speaking" onClick={closeMenu}>Speaking</a>
            <a href="#talks" onClick={closeMenu}>Talks</a>
            <a href="#record" onClick={closeMenu}>Record</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a className={styles.navCta} href="#inquiry" onClick={() => { closeMenu(); trackButtonClick("book_ian", "home_v2_nav"); }}>→ Book Ian</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="top" className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <p className={styles.kicker}>Practical. Self-taught. Evidence-led.</p>
                <div className={styles.redRuleShort} />
                <h1>Ian<br />McDonald</h1>
                <div className={styles.redRule} />
                <h2>Practical AI builder for operators</h2>
                <p className={styles.heroDescription}>From ideas to shipped platforms, automations, and communities.</p>
                <div className={styles.heroActions}>
                  <a className={styles.primaryButton} href="#inquiry" onClick={() => trackButtonClick("bring_ian_to_event", "home_v2_hero")}>Bring Ian to your event</a>
                  <a className={styles.secondaryButton} href="#launchlearn">Saw me speak? Start here</a>
                </div>
                <div className={styles.liveNote}><span /> Wednesdays @ 1 PM CT — Launch & Learn</div>
              </div>
              <div className={styles.heroImage}>
                <Image src="/ian-stage.jpg" alt="Ian McDonald speaking on stage" fill sizes="(max-width: 760px) 100vw, 48vw" priority />
                <div className={styles.imageLabel}>Builder · Founder · Speaker</div>
              </div>
            </div>
            <blockquote className={styles.manifesto}>“I build <strong>practical AI</strong> systems operators can run—not theories they can’t.”</blockquote>
          </div>
        </section>

        <section className={styles.pillarWrap}>
          <div className={`${styles.container} ${styles.pillarPanel}`}>
            <div className={styles.pillarGrid}>{pillars.map((item) => <article key={item.title}><span /><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
            <a className={styles.panelCta} href="#inquiry">→ ianmcdonald.ai</a>
          </div>
        </section>

        <section className={styles.statsSection} aria-label="Results">
          <div className={`${styles.container} ${styles.statsGrid}`}>
            <div><strong>1,600+</strong><span>Platform users</span></div>
            <div><strong>$1.2M</strong><span>ARR in 9 months</span></div>
            <div><strong>500+</strong><span>Largest room</span></div>
          </div>
        </section>

        <div className={styles.marquee} aria-label="Organizations and events">
          <div>{[0, 1].map((copy) => <span key={copy}>HMSDC MBE Leadership Academy <b>◆</b> Houston AI Club <b>◆</b> Agent Ops Live Demo <b>◆</b> AIXP Houston <b>◆</b> Harris County Precinct One <b>◆</b> Chase <b>◆</b> Orlando Keynote <b>◆</b> Jacksonville Keynote <b>◆</b></span>)}</div>
        </div>

        <section className={styles.principlesSection}>
          <div className={styles.container}>
            <Eyebrow>The through-line</Eyebrow>
            <div className={styles.principleRow}>
              <div key={principle} className={styles.principleCopy}><h2>{principles[principle].title}</h2><p>{principles[principle].body}</p></div>
              <div className={styles.principleDots}>{principles.map((item, index) => <button key={item.title} className={index === principle ? styles.activeDot : ""} aria-label={`Show principle ${index + 1}`} onClick={() => setPrinciple(index)} />)}</div>
            </div>
          </div>
        </section>

        <section id="speaking" className={styles.section}>
          <div className={`${styles.container} ${styles.fitGrid}`}>
            <div><SectionHeading eyebrow="For organizers" title="Best fit for" copy="Rooms where the audience doesn’t just want to hear about AI—they want to leave believing they can build something Monday morning." /><blockquote>If your audience wants a polished futurist, I’m probably not your guy. If they want someone who’s shipping AI products and showing the messy middle—that’s where I’m useful.</blockquote></div>
            <div className={styles.fitList}>{fitList.map((item) => <div key={item}><span>✓</span>{item}</div>)}</div>
          </div>
        </section>

        <section id="launchlearn" className={styles.section}>
          <div className={`${styles.container} ${styles.launchPanel}`}>
            <div><Eyebrow>Free weekly open call</Eyebrow><h2>Launch and Learn with Ian</h2><p>A recurring Google Meet for practical AI building, founder Q&A, and real-time walkthroughs. Drop in live on Wednesdays at 1 PM CT.</p><div className={styles.launchActions}><a href={LAUNCH_AND_LEARN_URL} target="_blank" rel="noreferrer" className={styles.primaryButton}>Join the open call</a><span>Google Meet · Wed · 1:00–2:00 PM CT</span></div></div>
            <div className={styles.launchImage}><Image src="/launch-and-learn-workshop.png" alt="A live online AI-building workshop with a collaborative workflow on screen" fill sizes="(max-width: 760px) 100vw, 40vw" /></div>
          </div>
        </section>

        <section id="record" className={styles.section}>
          <div className={styles.container}>
            <SectionHeading eyebrow="Track record" title="Recent work, on stage and in the room" copy="Live builds, working systems, hands-on workshops, and keynotes—the through-line is proof people can use after the session ends." />
            <div className={styles.gigList}>{gigs.map((gig) => <article key={gig.number}><div className={styles.gigNumber}>{gig.number}</div><div className={styles.gigLogo}><Image src={gig.logo} alt={gig.logoAlt} width={132} height={48} /></div><div><div className={styles.gigTitle}><h3>{gig.title}</h3><span>{gig.date}</span></div><p>{gig.body}</p>{gig.href && <Link className={styles.gigLink} href={gig.href}>{gig.linkLabel} <span aria-hidden="true">→</span></Link>}</div></article>)}</div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.headingSplit}><SectionHeading eyebrow="Proof, not B-roll" title="On stage" /><p>Real rooms. Real audiences. No green screen.</p></div>
            <div className={styles.shotGrid}>{stageShots.map((shot) => <figure key={shot.title}><div><Image src={shot.src} alt={`Ian McDonald at ${shot.title}`} fill sizes="(max-width: 760px) 50vw, 25vw" /></div><figcaption><strong>{shot.title}</strong><span>{shot.meta}</span></figcaption></figure>)}</div>
            <div className={styles.mediaGrid}>
              <article><Eyebrow>Keynote</Eyebrow><h3>Watch a talk</h3><p>Orlando, May 2025—500+ in the room. The same builder energy Ian brings to every stage.</p><video controls preload="metadata" poster="/speaking/ian-speaker-orlando-2025.png"><source src="/ian.mp4" type="video/mp4" /></video></article>
              <article><Eyebrow>Attendee reaction</Eyebrow><h3>Hear it from someone in the room</h3><p>A short, real reaction from a live speaking event.</p><video controls preload="metadata"><source src="/speaking/ian-instagram-testimonial.mp4" type="video/mp4" /></video></article>
            </div>
          </div>
        </section>

        <section id="talks" className={styles.section}>
          <div className={styles.container}>
            <SectionHeading eyebrow="Pick the talk" title="Talks I can bring to your audience" copy="Each one is mapped to the room it’s built for—clear outcomes, not abstract trends." />
            <div className={styles.talkGrid}>{talks.map((talk) => <article key={talk.number}><span>Session {talk.number}</span><h3>{talk.title}</h3><i /><p>{talk.body}</p><dl><div><dt>Best for</dt><dd>{talk.bestFor}</dd></div><div><dt>Outcome</dt><dd>{talk.outcome}</dd></div></dl></article>)}</div>
            <div className={styles.formats}><Eyebrow>Available formats</Eyebrow><div>{formats.map((format) => <span key={format}>{format}</span>)}</div><p>Every session can include a practical next step into Launch & Learn, a private workshop, or LaunchBox.</p></div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHeading eyebrow="Operators" title="What people have said" copy="Pull quotes from stages, inboxes, and the messy middle of real work." />
            <div className={styles.quoteGrid}>{quotes.map((quote) => <blockquote key={quote.who}><p>“{quote.text}”</p><strong>{quote.who}</strong><span>{quote.role}</span></blockquote>)}</div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHeading eyebrow="Builder record" title="What I’ve actually built" copy="I don’t talk about AI in theory. I talk from the build." />
            <div className={styles.buildGrid}>
              <article className={styles.buildDark}><div><h3>2025 — AI for Business platform, built solo</h3><span>9 months</span></div><p>Built the platform supporting 1,600+ users—the business reached $1.2M ARR in 9 months.</p><dl><div><dt>1,600+</dt><dd>Active users</dd></div><div><dt>$1.2M</dt><dd>ARR powered</dd></div><div><dt>9 mo</dt><dd>Self-taught, zero team</dd></div></dl></article>
              <article className={styles.buildLight}><div><h3>Now — LaunchBox</h3><span>● Shipping</span></div><p>A working platform that turns an idea into a branded AI-powered community, launch pages, content, and first invites.</p><dl><div><dt>$1,250</dt><dd>MRR, still solo</dd></div><div><dt>35</dt><dd>Subscribers · 14 communities</dd></div><div><dt>80%+</dt><dd>Margin per partner</dd></div></dl></article>
            </div>
          </div>
        </section>

        <section id="about" className={styles.section}>
          <div className={`${styles.container} ${styles.aboutGrid}`}>
            <div><div className={styles.portrait}><Image src="/ian-profile.png" alt="Portrait of Ian McDonald" fill sizes="(max-width: 760px) 100vw, 38vw" /></div><div className={styles.tags}><span>Houston, TX</span><span>Disruptiv Solutions</span><span>LaunchBox</span></div></div>
            <div><SectionHeading eyebrow="The story" title="About Ian" /><div className={styles.aboutCopy}><p>Pensacola native. Ian moved to Colorado at nineteen looking for a different life—and stayed eleven years, eight of them working in addiction and recovery treatment.</p><p>After years of moving between Colorado and Pensacola while his dad battled cancer, Ian went all-in on building in December 2023 with $5,000 and no safety net. He now lives in Houston.</p><p>No CS degree. No bootcamp. No co-founder. By 2025 he had built an AI for Business platform solo, supporting 1,600+ users and powering $1.2M ARR in nine months.</p><p>That experience revealed a bigger gap: operators don’t need more AI features. They need an easier way to launch, own their audience, and build something people can use. That became LaunchBox.</p></div><blockquote className={styles.builderQuote}>He talks from the builder’s seat, not from theory.</blockquote><div className={styles.positioning}><Eyebrow>Positioning</Eyebrow><h3>Who I speak for</h3><p>I speak for rooms where the audience wants to leave believing they can build something with AI Monday morning. Founder groups, employer networks, chambers, workforce boards, and operator conferences.</p></div></div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHeading eyebrow="Partnership" title="Ways to structure a session" copy="Every event is different. Pick the format that fits your room—or tell me what you have in mind below." />
            <div className={styles.dealGrid}>{[
              ["Keynote", "A focused talk with practical frameworks, founder story, and a clear next step."],
              ["Workshop", "A deeper hands-on session where the audience builds during the event."],
              ["Live build", "A real idea from the room turned into a working path in front of the audience."],
              ["Activation", "An event-specific follow-up through LaunchBox, Launch & Learn, or a private cohort."],
            ].map(([title, body]) => <article key={title}><span /><h3>{title}</h3><p>{body}</p></article>)}</div>
          </div>
        </section>

        <section id="inquiry" className={styles.inquirySection}>
          <div className={`${styles.container} ${styles.inquiryGrid}`}>
            <div><SectionHeading eyebrow="Next step" title="Bring Ian to your event" /><div className={styles.redRule} /><p>Tell me about your event or what you have in mind. I’ll reply personally within a day or two.</p><div className={styles.contactLinks}><a href={CALENDAR_URL} target="_blank" rel="noreferrer">Use my calendar ↗</a><a href="mailto:ian@ianmcdonald.ai">ian@ianmcdonald.ai</a></div></div>
            <InquiryForm />
          </div>
        </section>
      </main>

      <footer className={styles.footer}><div className={styles.container}><Brand /><span>Houston, TX</span><nav><a href="#speaking">Speaking</a><a href="#talks">Talks</a><a href="#launchlearn">Launch & Learn</a><Link href="/newsletter">Newsletter</Link><a href="mailto:ian@ianmcdonald.ai">Email Ian</a></nav></div></footer>
    </div>
  );
}
