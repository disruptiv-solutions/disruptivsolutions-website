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
          <p className={styles.eyebrow}>Ian McDonald / Builder. Founder. Speaker.</p>
          <h1 id="home-title">Make AI practical.<br />Build what’s <em>next.</em></h1>
          <p className={styles.heroDescription}>I build products and businesses with AI. Then I share what works, on stage, in workshops, and with people ready to try it themselves.</p>
          <a className={styles.heroAction} href="#speaking" onClick={() => trackButtonClick("bring_ian_to_event", "home_v2_hero")}><span>Let’s put the ideas to work</span><Arrow /></a>
        </div>
        <figure className={styles.heroArt}>
          <div className={styles.paperBack} aria-hidden="true" />
          <div className={styles.stageFragment}><Image src="/speaking/ian-speaker-aixp.jpg" alt="Ian speaking at AIXP Houston" fill sizes="(max-width: 760px) 60vw, 26vw" className={styles.stagePhoto} priority /></div>
          <div className={styles.portraitFragment}><Image src="/ian-mcdonald.png" alt="Ian McDonald" fill sizes="(max-width: 760px) 70vw, 34vw" priority /></div>
          <svg className={styles.paperArrow} viewBox="0 0 260 120" aria-hidden="true"><path d="m4 75 139-16-4-48 115 69-116 37 4-35L4 108Z" fill="currentColor" /><path d="m142 59 104 20-105 4" stroke="#16181b" strokeWidth="2" fill="none" /></svg>
          <span className={styles.tape}>Built. Tried. Shared.</span>
          <figcaption>Real work. Real rooms. Still building.</figcaption>
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
            <span className={styles.routeNumber}>02 / LEARNING</span><div><h3>Try it. Ask questions. Build.</h3><p>Join the free weekly call, work through a practical kit, or get notes from the workbench.</p></div><a className={styles.routeLink} href="#learn">Find your starting point <Arrow /></a>
          </article>
          <article id="disruptiv" className={styles.routeRow}>
            <span className={styles.routeNumber}>03 / BUILDING</span><div><h3>Make it work for your business.</h3><p>Disruptiv is my company for websites, apps, AI workflows, video, and campaigns. It’s where we build together.</p></div><a className={styles.routeLink} href={`${DISRUPTIV_URL}/contact`} onClick={() => trackDisruptivVisit(`${DISRUPTIV_URL}/contact`, "home_v2_project")}>Build with Disruptiv <Arrow /></a>
          </article>
        </div>
        <p className={styles.routeFoot}>This is where I teach and share. Disruptiv is where we put it to work in your business.</p>
      </div>
    </section>

    <section id="record" className={styles.proof} aria-labelledby="proof-title">
      <div className={styles.container}>
        <header className={styles.sectionHeading}><h2 id="proof-title">Built in real life.<br />Shared in <em>real rooms.</em></h2><Link className={styles.textLink} href="/speaking#stage">See the speaking record <Arrow /></Link></header>
        <div className={styles.proofGrid}>
          <figure className={styles.stageFilm}><video controls preload="none" poster="/speaking/ian-speaker-orlando-2025.png" aria-label="Watch Ian’s Orlando keynote"><source src="/ian.mp4" type="video/mp4" /></video><figcaption><strong>Orlando keynote</strong><span>May 2025 / 500+ in the room</span></figcaption></figure>
          <div id="about" className={styles.proofCopy}>
            <p className={styles.eyebrow}>From the builder’s seat</p><h3>I build first.<br />Then I teach from it.</h3><p>Self-taught, based in Houston, and building with AI every day. I share the lessons from shipping real products, including the parts that didn’t go to plan.</p>
            <dl className={styles.stats}><div><dt>1,600+</dt><dd>Users of the AI platform I built</dd></div><div><dt>$1.2M</dt><dd>Business ARR powered in 9 months</dd></div></dl>
            <Link href="/about" className={styles.textLink}>A little more about Ian <Arrow /></Link>
          </div>
        </div>
        <blockquote className={styles.quote}><p>“I enjoyed your speech, the hands-on coding presentation, your honesty and humble attitude, and your drive.”</p><footer><strong>Monika Mielnik</strong><span>Director, UX/UI Design & Development<br />AIXP Houston</span></footer></blockquote>
      </div>
    </section>

    <section id="learn" className={styles.learning} aria-labelledby="learn-title">
      <div className={`${styles.container} ${styles.learningGrid}`}>
        <div><p className={styles.eyebrow}>No stage. No ticket. Just start.</p><h2 id="learn-title">Bring a question.<br />Leave with <em>a next step.</em></h2><p>Launch & Learn is my free weekly call for practical AI building, live walkthroughs, and founder Q&A.</p><span className={styles.schedule}>Wednesdays / 1–2 PM Central / Google Meet</span><a className={styles.lightLink} href="https://meet.google.com/cgm-vcdg-hvh" target="_blank" rel="noreferrer">Join Launch & Learn <Arrow /></a></div>
        <div className={styles.learningLinks}>
          <Link href="/kits"><span>Work through it</span><strong>Practical workshop kits</strong><Arrow /></Link>
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
