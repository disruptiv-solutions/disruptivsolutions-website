import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SpeakingInquiryForm from "@/components/SpeakingInquiryForm";
import SpeakingStickyCta from "@/components/speaking/SpeakingStickyCta";
import SpeakingPageSubnav from "@/components/speaking/SpeakingPageSubnav";
import styles from "./Speaking.module.css";

export const metadata: Metadata = {
  title: "Speaking & Workshops | Ian McDonald",
  description: "Practical AI keynotes, workshops, and live builds for founders, business owners, and teams. Explore Ian’s talks, watch a keynote, and inquire about your event.",
  openGraph: { title: "Speaking & Workshops | Ian McDonald", description: "Give your audience something to build on. Practical AI sessions from a founder who builds and uses the tools himself.", type: "website", images: ["/ian-stage.jpg"] },
};

const CALENDAR_URL = "https://calendar.app.google/J6uMiKkf3AM4zS9MA";
const TALKS = [
  { number: "01", format: "Keynote / 20–30 minutes", title: "If I Can Build This, You Can Build Yours", audience: "Founder events, AI conferences, and small-business communities", outcome: "A self-taught founder’s story, working products, and live show-and-tell. Your audience leaves with a practical path from an idea to a first build." },
  { number: "02", format: "Workshop / 45–60 minutes", title: "AI for Employers", audience: "Employer networks, chambers, workforce groups, and small teams", outcome: "Explore where AI fits in marketing, operations, and customer workflows. Leave with useful starting points your team can try in its own work." },
  { number: "03", format: "Live build / 30 minutes", title: "From Idea to Platform — Live", audience: "Founder meetups, business communities, coaches, and consultants", outcome: "Bring an idea from the room. Ian uses LaunchBox to turn it into a platform concept, launch page, and first-invite path in front of the audience." },
];
const EVENTS = [
  { title: "Grow with Google", date: "August 2026 / Virtual", copy: "Guest workshop on automating business workflows with Gemini, Gmail, Meet, Drive, and Calendar." },
  { title: "Small & Diverse Business Inclusion Summit", date: "June 2026 / Houston", copy: "Live opportunity research and follow-up workflows for small-business owners at Commissioner Rodney Ellis’ summit." },
  { title: "Houston AI Club", date: "May 2026 / Virtual", copy: "From AI Consumer to AI Builder: a live LaunchBox build and Q&A for 50+ attendees." },
  { title: "AIXP Houston", date: "April 2026 / Houston", copy: "Four speaking slots, including the Founder Stories panel, sharing lessons from building LaunchBox." },
  { title: "Orlando keynote", date: "May 2025 / 500+ attendees", copy: "Building AI products as a self-taught operator. Watch the keynote above." },
  { title: "Jacksonville keynote", date: "March 2025 / 250+ attendees", copy: "Practical AI for founders building without a technical background." },
];

export default function SpeakingPage() {
  return <div className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: "Ian McDonald", jobTitle: "AI product builder and speaker", url: "https://www.ianmcdonald.ai/speaking", image: "https://www.ianmcdonald.ai/ian-mcdonald.png", email: "mailto:ian@ianmcdonald.ai", description: "Self-taught AI builder delivering practical keynotes, workshops, and live builds." }) }} />
    <SpeakingStickyCta />
    <SpeakingPageSubnav />

    <section className={`${styles.container} ${styles.hero}`} aria-labelledby="speaking-title">
      <div><p className={styles.eyebrow}>Speaking & workshops</p><h1 id="speaking-title">Give your audience something to <em>build on.</em></h1><p className={styles.heroCopy}>Practical AI keynotes, workshops, and live builds from someone doing the work. For founder groups, business owners, and teams ready to put the ideas into practice.</p><div className={styles.actions}><a className={styles.button} href="#book">Bring Ian to your event <span aria-hidden="true">↗</span></a><a className={styles.textLink} href="#proof">Watch Ian speak <span aria-hidden="true">↓</span></a></div><p id="fit" className={styles.location}>Based in Houston. Available to travel.</p></div>
      <figure className={styles.portrait}><div><Image src="/speaking/ian-speaker-aixp.jpg" alt="Ian McDonald speaking at AIXP Houston" fill sizes="(max-width:760px) 100vw, 42vw" priority /></div><figcaption>AIXP Houston / April 2026</figcaption></figure>
    </section>

    <section id="talks" className={styles.talkSection} aria-labelledby="talks-title"><div className={styles.container}>
      <header className={styles.sectionHeading}><p className={styles.eyebrow}>Choose the session</p><h2 id="talks-title">What does your room<br /><em>need next?</em></h2></header>
      <div className={styles.talkList}>{TALKS.map(talk => <article key={talk.number} className={styles.talk}><span className={styles.number}>{talk.number}</span><div><p className={styles.format}>{talk.format}</p><h3>{talk.title}</h3><p className={styles.audience}>{talk.audience}</p><p className={styles.outcome}>{talk.outcome}</p></div></article>)}</div>
      <details className={styles.additionalTopic}><summary>Another topic: Turn Your Expertise Into a Platform <span aria-hidden="true">+</span></summary><p>For coaches, consultants, creators, and community hosts: package what you know into a branded AI-powered experience, with a clear offer and a path to your first members.</p></details>
      <p className={styles.sectionNote}>Tell me about your audience when you inquire. We’ll shape the session and format around the room.</p>
    </div></section>

    <section id="proof" className={`${styles.container} ${styles.proof}`} aria-labelledby="proof-title">
      <header className={styles.sectionHeading}><p className={styles.eyebrow}>See the work behind the talk</p><h2 id="proof-title">A working builder.<br /><em>A real room.</em></h2></header>
      <div className={styles.proofGrid}>
        <figure className={styles.film}><video controls preload="none" poster="/speaking/ian-speaker-orlando-2025.png" aria-label="Ian McDonald’s Orlando keynote, May 2025"><source src="/ian.mp4" type="video/mp4" /></video><figcaption><strong>Watch the Orlando keynote</strong><span>May 2025 / 500+ in the room</span></figcaption></figure>
        <article className={styles.caseStudy}><p className={styles.eyebrow}>Builder record / 2025</p><h3>AI for Business.<br />Built solo by Ian.</h3><p>Ian built the AI for Business platform himself. The platform supported more than 1,600 users; the business it served reached $1.2M in annual recurring revenue within nine months.</p><dl className={styles.stats}><div><dt>1,600+</dt><dd>Users supported by the platform</dd></div><div><dt>$1.2M</dt><dd>Annual recurring revenue of the business the platform supported</dd></div></dl><p className={styles.caseNote}>These figures describe the 2025 AI for Business engagement.</p><Link href="/about" className={styles.textLink}>More about Ian’s background <span aria-hidden="true">↗</span></Link></article>
      </div>
      <blockquote className={styles.quote}><p>“I enjoyed your speech, the hands-on coding presentation, your honesty and humble attitude, and your drive.”</p><footer><strong>Monika Mielnik</strong><span>Director, UX/UI Design & Development<br />AIXP Houston</span></footer></blockquote>
    </section>

    <section id="stage" className={styles.record} aria-labelledby="stage-title"><div className={styles.container}>
      <header className={styles.recordHeading}><div><p className={styles.eyebrow}>Selected speaking record</p><h2 id="stage-title">Different rooms.<br /><em>Practical AI.</em></h2></div><p>Keynotes, hands-on workshops, and live builds for business and founder audiences.</p></header>
      <ul className={styles.events}>{EVENTS.map(event => <li key={event.title}><span>{event.date}</span><h3>{event.title}</h3><p>{event.copy}</p></li>)}</ul>
    </div></section>

    <section id="book" className={`${styles.container} ${styles.booking}`} aria-labelledby="book-heading">
      <div><p className={styles.eyebrow}>Plan your session</p><h2 id="book-heading">Bring Ian<br /><em>to your event.</em></h2><p className={styles.bookingCopy}>Share your event date, audience, and the session you have in mind. I’ll reply personally within a day or two to discuss fit, availability, and fees.</p><a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Check my calendar <span aria-hidden="true">↗</span></a><a className={styles.email} href="mailto:ian@ianmcdonald.ai">ian@ianmcdonald.ai</a></div>
      <div className={styles.formPanel}><SpeakingInquiryForm /></div>
    </section>
  </div>;
}
