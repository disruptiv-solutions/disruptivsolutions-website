"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { trackButtonClick, trackDisruptivVisit, trackFormSubmission } from "@/lib/analytics";
import { IAN_COMMUNITY_URL } from "@/lib/ian-community";
import styles from "./HomeV2.module.css";
import { LAUNCH_AND_LEARN } from "@/lib/launch-and-learn";

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
        <label>Your name<input name="name" required autoComplete="name" placeholder="Jane Doe" disabled={status === "submitting"} /></label>
        <label>Email<input name="email" required type="email" autoComplete="email" placeholder="you@company.com" disabled={status === "submitting"} /></label>
      </div>
      <label>What are you interested in?
        <select name="interest" required defaultValue="" disabled={status === "submitting"}>
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
      {status === "error" && <p role="alert" className={styles.formError}>{error}</p>}
      {status === "success" && <p role="status" className={styles.formSuccess}>Got it. Check your inbox for confirmation—Ian will reply personally.</p>}
      <button type="submit" disabled={status === "submitting" || status === "success"}>{status === "submitting" ? "Sending…" : status === "success" ? "Inquiry sent" : "Send inquiry"}</button>
      <small>You’ll get an email confirmation. Ian replies personally.</small>
    </form>
  );
}

function Arrow({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M7 25 25 7M7 7h18v18" stroke="currentColor" strokeWidth="1.8" /></svg>;
}

export default function HomeV2() {
  return <div className={styles.page}>
    <section id="top" className={styles.hero} aria-labelledby="home-title">
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Ian McDonald / AI speaker & builder.</p>
          <h1 id="home-title">Practical AI.<br />For your <em>audience.</em></h1>
          <p className={styles.heroDescription}>Keynotes, workshops, and live builds for people ready to put AI to work. I share what I’m learning from building products and businesses, so your audience has something real to try.</p>
          <div className={styles.heroActions}><Link className={styles.heroAction} href="/speaking#book" onClick={() => trackButtonClick("speaking_inquiry", "home_v2_hero")}><span>Bring Ian to your event</span><Arrow /></Link>
          <a className={styles.heroLearning} href={IAN_COMMUNITY_URL} onClick={() => trackButtonClick("join_community", "home_v2_hero")}>Join free <Arrow /></a></div><p className={styles.communityNote}>Keep learning in my community on LaunchBox.</p>
        </div>
        <figure className={styles.heroArt}>
          <div className={styles.paperBack} aria-hidden="true" />
          <div className={styles.stageFragment}><Image src="/speaking/ian-speaker-aixp.jpg" alt="Ian speaking at AIXP Houston" fill sizes="(max-width: 760px) 100vw, 48vw" className={styles.stagePhoto} priority /></div>
          <span className={styles.tape}>Built. Tried. Shared.</span>
          <figcaption>On stage at AIXP Houston / April 2026</figcaption>
        </figure>
      </div>
    </section>

    <section id="speaking" className={styles.routes} aria-labelledby="routes-title">
      <div className={styles.container}>
        <header className={styles.routeHeading}><h2 id="routes-title">What brings you here?</h2><span>Three ways to work with Ian</span></header>
        <div className={styles.routeSheet}>
          <article id="talks" className={styles.routeRow}>
            <span className={styles.routeNumber}>01 / SPEAKING</span><div><h3>A room ready for something real.</h3><p>Keynotes, workshops, and live builds that make AI feel useful, possible, and worth trying.</p></div><Link className={styles.routeLink} href="/speaking">Bring Ian to your event <Arrow /></Link>
          </article>
          <article id="launchlearn" className={styles.routeRow}>
            <span className={styles.routeNumber}>02 / LEARNING</span><div><h3>Try it. Ask questions. Build.</h3><p>Start with a free lesson, bring a question to the weekly call, and keep building in the community.</p></div><Link className={styles.routeLink} href="/learn">Find your starting point <Arrow /></Link>
          </article>
          <article id="disruptiv" className={styles.routeRow}>
            <span className={styles.routeNumber}>03 / BUILDING</span><div><h3>Need it built?</h3><p>That’s what we do at Disruptiv Solutions. Websites, apps, AI workflows, video, and campaigns, built around your business.</p></div><Link className={styles.routeLink} href="/build" onClick={() => trackButtonClick("build_with_ian", "home_v2_routes")}>Build with Disruptiv <Arrow /></Link>
          </article>
        </div>
        <p className={styles.routeFoot}>This is where I teach and share. Disruptiv is where we put it to work in your business.</p>
      </div>
    </section>

    <section id="record" className={styles.proof} aria-labelledby="proof-title">
      <div className={styles.container}>
        <header className={styles.sectionHeading}><h2 id="proof-title">Built in real life.<br />Shared in <em>real rooms.</em></h2><Link className={styles.textLink} href="/speaking#stage">See the speaking record <Arrow /></Link></header>
        <div className={styles.proofGrid}>
          <figure className={styles.stageFilm}><video controls playsInline preload="metadata" poster="/speaking/orlando-2025-speaker-reel.jpg" aria-label="Watch Ian McDonald’s 3 minute 19 second speaker reel from Orlando, June 2025, with captions"><source src="/speaking/orlando-2025-speaker-reel.mp4" type="video/mp4" /></video><figcaption><strong>Orlando speaking highlights</strong><span>June 2025 / 3:19 speaker reel</span></figcaption></figure>
          <div id="about" className={styles.proofCopy}>
            <p className={styles.eyebrow}>The build behind the numbers / 2025</p><h3>AI for Business.<br />Built solo by Ian.</h3><p>I built the AI for Business platform myself. It supported more than 1,600 users, while the business it served reached $1.2M in annual recurring revenue within nine months.</p>
            <dl className={styles.stats}><div><dt>1,600+</dt><dd>Users supported by the AI for Business platform</dd></div><div><dt>$1.2M</dt><dd>Annual recurring revenue of the business the platform supported</dd></div></dl>
            <Link href="/work/ai-for-business" className={styles.textLink}>See the platform case study <Arrow /></Link>
          </div>
        </div>
        <blockquote className={styles.quote}><p>“I enjoyed your speech, the hands-on coding presentation, your honesty and humble attitude, and your drive.”</p><footer><strong>Monika Mielnik</strong><span>Director, UX/UI Design & Development<br />AIXP Houston</span></footer></blockquote>
      </div>
    </section>

    <section id="learn" className={styles.learning} aria-labelledby="learn-title">
      <div className={`${styles.container} ${styles.learningGrid}`}>
        <div><p className={styles.eyebrow}>No stage. No ticket. Just start.</p><h2 id="learn-title">Bring a question.<br />Leave with <em>a next step.</em></h2><p>Launch & Learn is my free weekly call for practical AI building, live walkthroughs, and founder Q&A.</p><span className={styles.schedule}>{LAUNCH_AND_LEARN.schedule}</span><a className={styles.lightLink} href={LAUNCH_AND_LEARN.meetingUrl} target="_blank" rel="noreferrer">View Launch & Learn on LaunchBox <Arrow /></a></div>
        <div className={styles.learningLinks}>
          <Link href="/learn"><span>Work through it</span><strong>Practical AI lessons & kits</strong><Arrow /></Link>
          <Link href="/assessment"><span>Find your starting point</span><strong>The free AI Snapshot</strong><Arrow /></Link>
          <Link href="/newsletter"><span>Notes from the workbench</span><strong>Get the builds and lessons</strong><Arrow /></Link>
          <Link href="/newsletter-directory" className={styles.archiveLink}>Read past notes <Arrow /></Link>
        </div>
      </div>
    </section>

    <section id="inquiry" className={styles.inquirySection} aria-labelledby="inquiry-title">
      <div className={`${styles.container} ${styles.inquiryGrid}`}>
        <div><p className={styles.eyebrow}>Let’s make it useful</p><h2 id="inquiry-title">What could we<br /><em>make happen?</em></h2><p>Have an event, workshop, or conversation in mind? Tell me about it. I’ll reply personally within a day or two.</p><div className={styles.contactLinks}><a href={CALENDAR_URL} target="_blank" rel="noreferrer">Use my calendar <Arrow /></a><a href="mailto:ian@ianmcdonald.ai">ian@ianmcdonald.ai <Arrow /></a></div><p className={styles.projectNote}>Need a website, app, or workflow built?<br /><a href={`${DISRUPTIV_URL}/contact`} onClick={() => trackDisruptivVisit(`${DISRUPTIV_URL}/contact`, "home_v2_inquiry")}>Start a project with Disruptiv <Arrow /></a></p></div>
        <InquiryForm />
      </div>
    </section>
  </div>;
}
