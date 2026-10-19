"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { trackButtonClick, trackDisruptivVisit, trackFormSubmission } from "@/lib/analytics";
import styles from "./HomeV2.module.css";

const CALENDAR_URL = "https://calendar.app.google/J6uMiKkf3AM4zS9MA";
const DISRUPTIV_URL = "https://www.disruptiv.solutions";

function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting" || status === "success") return;
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
      trackFormSubmission("speaking_inquiry", { form_location: "home_v2" });
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
      <button type="submit" disabled={status === "submitting" || status === "success"}>{status === "submitting" ? "Sending…" : status === "success" ? "Inquiry sent" : "Send inquiry"}</button>
      <small>You’ll get an email confirmation. Ian replies personally.</small>
    </form>
  );
}

export default function HomeV2() {
  return <div className={styles.page}>
    <section id="top" className={styles.hero}>
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Builder. Founder. Speaker.</p>
          <h1>Ian<br />McDonald<span className={styles.redPeriod}>.</span></h1>
          <div className={styles.redRule} />
          <h2>Practical AI.<br />Built from experience.</h2>
          <p className={styles.heroDescription}>I build products, platforms, and business systems with AI—and help other people turn their ideas into something useful.</p>
          <div className={styles.heroActions}><a className={styles.primaryButton} href="#inquiry" onClick={() => trackButtonClick("bring_ian_to_event", "home_v2_hero")}>Bring Ian to your event <span aria-hidden="true">↗</span></a><a className={styles.secondaryButton} href="#launchlearn">Learn with me <span aria-hidden="true">↓</span></a></div>
          <p className={styles.projectLink}>Have something to build? <a href={`${DISRUPTIV_URL}/contact`} onClick={() => trackDisruptivVisit(`${DISRUPTIV_URL}/contact`, "home_v2_hero")}>Work with Disruptiv ↗</a></p>
        </div>
        <figure className={styles.heroFigure}><div className={styles.heroImage}><Image src="/ian-mcdonald.png" alt="Ian McDonald, builder and speaker" fill sizes="(max-width: 760px) 100vw, 46vw" priority /></div><figcaption><span>Self-taught. Still building.</span><span>Houston, TX</span></figcaption></figure>
      </div>
      <div className={`${styles.container} ${styles.statsGrid}`} aria-label="Track record">
        <div><strong>1,600+</strong><span>Users of the AI platform I built</span></div><div><strong>$1.2M</strong><span>Business ARR powered in 9 months</span></div><div><strong>500+</strong><span>People in my largest keynote room</span></div>
      </div>
    </section>

    <section id="record" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>The work, in the room</p><h2>Things I’ve built.<br />Rooms I’ve shared them in.</h2></div>
        <div className={styles.proofGrid}>
          <figure className={styles.stageFilm}><video controls preload="none" poster="/speaking/ian-speaker-orlando-2025.png" aria-label="Watch Ian's Orlando keynote"><source src="/ian.mp4" type="video/mp4" /></video><figcaption><strong>Orlando keynote</strong><span>May 2025 · 500+ in the room</span></figcaption></figure>
          <div className={styles.gigList}>{[
            ["01", "Grow with Google", "August 2026", "A hands-on workshop on automating everyday business workflows with Gemini."],
            ["02", "Houston AI Club", "May 2026", "From AI consumer to AI builder, with a live LaunchBox build and open Q&A."],
            ["03", "AIXP Houston", "April 2026", "Four speaking slots on building from the operator’s seat."],
          ].map(([number,title,date,copy]) => <article key={number}><span>{number}</span><div><div className={styles.gigTitle}><h3>{title}</h3><span>{date}</span></div><p>{copy}</p></div></article>)}<Link className={styles.textLink} href="/speaking#stage">See the full speaking record <span aria-hidden="true">↗</span></Link></div>
        </div>
      </div>
    </section>

    <section id="speaking" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headingSplit}><div className={styles.sectionHeading}><p className={styles.eyebrow}>For your next event</p><h2 id="talks">Send people home<br />ready to build.</h2></div><p>Keynotes, workshops, and live builds for founders, business owners, and teams putting AI to work. Practical lessons from someone doing the work.</p></div>
        <div className={styles.talkGrid}>{[
          ["01 / Founder story", "If I Can Build This, You Can Build Yours", "From a self-taught start to working AI products. A founder story and live show-and-tell that make the first step feel possible."],
          ["02 / Business & teams", "AI for Employers", "Where AI helps in a small business, what gets in the way, and practical workflows your team can try on Monday."],
        ].map(([label,title,copy]) => <article key={label}><span className={styles.eyebrow}>{label}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        <div className={styles.sectionLinks}><Link className={styles.textLink} href="/speaking#talks">All talks & formats ↗</Link><Link className={styles.textLink} href="/kits/supplier-readiness-builder">Try a workshop kit ↗</Link></div>
        <blockquote className={styles.featuredQuote}><p>“I enjoyed your speech, the hands-on coding presentation, your honesty and humble attitude, and your drive.”</p><footer><strong>Monika Mielnik</strong><span>Director, UX/UI Design & Development · AIXP Houston</span></footer></blockquote>
      </div>
    </section>

    <section id="disruptiv" className={`${styles.section} ${styles.projectSection}`} aria-labelledby="disruptiv-heading">
      <div className={`${styles.container} ${styles.projectGrid}`}>
        <div><p className={styles.eyebrow}>Build with me / Disruptiv Solutions</p><h2 id="disruptiv-heading">Let’s build it<br />for your business.</h2><p>Disruptiv Solutions is my company for websites, apps, AI workflows, video, and campaigns. Work directly with me to choose a practical starting point and put it into use.</p><div className={styles.heroActions}><a className={styles.primaryButton} href={`${DISRUPTIV_URL}/contact`} onClick={() => trackDisruptivVisit(`${DISRUPTIV_URL}/contact`, "home_v2_project")}>Start a project <span aria-hidden="true">↗</span></a><a className={styles.secondaryButton} href={`${DISRUPTIV_URL}/work`} onClick={() => trackDisruptivVisit(`${DISRUPTIV_URL}/work`, "home_v2_project")}>See the work ↗</a></div></div>
        <aside className={styles.projectExample}><p className={styles.eyebrow}>From the workbench</p><h3>A business, connected.</h3><p>One founder’s business knowledge, relationships, and daily workflows, brought into a private operating system.</p><a className={styles.textLink} href={`${DISRUPTIV_URL}/work/inclusioneer`} onClick={() => trackDisruptivVisit(`${DISRUPTIV_URL}/work/inclusioneer`, "home_v2_project")}>Explore Inclusioneer OS ↗</a><p className={styles.ecosystemNote}>Here, I teach and share what I’m building. At Disruptiv, I help put it to work in your business.</p></aside>
      </div>
    </section>

    <section id="about" className={styles.section}>
      <div className={`${styles.container} ${styles.aboutGrid}`}>
        <figure><div className={styles.aboutImage}><Image src="/speaking/ian-speaker-aixp.jpg" alt="Ian McDonald speaking at AIXP Houston" fill sizes="(max-width:760px) 100vw, 42vw" /></div><figcaption>AIXP Houston · April 2026</figcaption></figure>
        <div><p className={styles.eyebrow}>A little about me</p><h2>I build first.<br />Then I teach from it.</h2><div className={styles.aboutCopy}><p>I’m a Pensacola native, now in Houston. Before building software, I spent eight years working in addiction and recovery treatment in Colorado.</p><p>In December 2023, I went all-in on building with $5,000 and no safety net. No CS degree, bootcamp, or co-founder. By 2025, I’d built an AI platform supporting 1,600+ users and powering $1.2M ARR in nine months.</p><p>Today I’m building <a href="https://launchbox.space">LaunchBox ↗</a>, a platform for branded AI-powered communities, and helping business owners build through Disruptiv.</p></div><p className={styles.signature}>Still learning. Still shipping.</p></div>
      </div>
    </section>

    <section id="launchlearn" className={styles.section}>
      <div className={`${styles.container} ${styles.learningGrid}`}>
        <div className={styles.learningCall}><p className={styles.eyebrow}>Learn with me / Free weekly call</p><h2>Bring a question.<br />Build something.</h2><p>Launch & Learn is an open call for practical AI building, founder Q&A, and live walkthroughs.</p><span className={styles.schedule}>Wednesdays · 1–2 PM Central · Google Meet</span><a className={styles.primaryButton} href="https://meet.google.com/cgm-vcdg-hvh" target="_blank" rel="noreferrer">Join Launch & Learn ↗</a></div>
        <div className={styles.newsletterCard}><p className={styles.eyebrow}>Notes from the workbench</p><h3>The builds.<br />The lessons.<br />The messy middle.</h3><p>What I’m making, what I’m learning, and practical ideas to try in your own work.</p><Link className={styles.textLink} href="/newsletter">Get the newsletter ↗</Link><Link className={styles.archiveLink} href="/newsletter-directory">Read past notes</Link></div>
      </div>
    </section>

    <section id="inquiry" className={styles.inquirySection}>
      <div className={`${styles.container} ${styles.inquiryGrid}`}><div><p className={styles.eyebrow}>Let’s make it useful</p><h2>Bring Ian<br />to your event.</h2><p>Tell me about your audience, your event, or the session you have in mind. I’ll reply personally within a day or two.</p><div className={styles.contactLinks}><a href={CALENDAR_URL} target="_blank" rel="noreferrer">Use my calendar ↗</a><a href="mailto:ian@ianmcdonald.ai">ian@ianmcdonald.ai</a></div></div><InquiryForm /></div>
    </section>
  </div>;
}
