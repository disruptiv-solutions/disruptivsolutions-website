import type { Metadata } from "next";
import Link from "next/link";
import ProjectInquiryForm from "@/components/workshop-kits/find-leads/ProjectInquiryForm";
import { IAN_SOCIAL_URLS } from "@/lib/ian-social-links";
import styles from "./Contact.module.css";

export const metadata: Metadata = {
  title: "Contact Ian | Ian McDonald",
  description: "Talk with Ian McDonald about AI training, workflows, automation, or social media content. Share your project or email Ian directly.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Ian | Ian McDonald",
    description: "Have a project in mind? Let’s talk about AI training, workflows, automation, or social media content.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <section className={styles.page} aria-labelledby="contact-title">
      <div className={styles.layout}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Work with Ian</p>
          <h1 id="contact-title">Contact <em>Ian.</em></h1>
          <p className={styles.lead}>What would you like to make possible?</p>
          <p className={styles.copy}>AI training for your team. A workflow or automation that saves you time. Social media content that brings your ideas to life.</p>
          <p className={styles.copy}>Tell me what you have in mind—even if you’re still figuring it out.</p>
          <div className={styles.direct}>
            <p>Prefer email?</p>
            <a href="mailto:ian@ianmcdonald.ai">ian@ianmcdonald.ai <span aria-hidden="true">↗</span></a>
          </div>
        </header>

        <div className={styles.form} id="project-inquiry">
          <ProjectInquiryForm source="contact" />
        </div>

        <aside className={styles.details} aria-label="More ways to connect with Ian">
          <div className={styles.socials}>
            <p className={styles.eyebrow}>Find me around the web</p>
            <ul>{Object.entries(IAN_SOCIAL_URLS).map(([name, url]) => (
              <li key={name}><a href={url} target="_blank" rel="noopener noreferrer">{name}<span aria-hidden="true">↗</span></a></li>
            ))}</ul>
          </div>
          <div className={styles.speaking}>
            <h2>Planning an event?</h2>
            <p>For a keynote, workshop, or live build, share your audience and event details.</p>
            <Link href="/speaking#book">Book Ian to speak <span aria-hidden="true">↗</span></Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
