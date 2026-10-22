"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import styles from "./ProjectInquiryForm.module.css";

type Status = "idle" | "sending" | "success" | "error";

export default function ProjectInquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success" || status === "error") messageRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || status === "success") return;
    const data = new FormData(event.currentTarget);
    const inquiry = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      interest: String(data.get("interest") ?? ""),
      note: String(data.get("note") ?? "").trim(),
    };
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/project-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
      });
      const result = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };
      if (!response.ok || result.success !== true) {
        setError(result.error || "Your inquiry couldn’t be sent. Please try again or email Ian directly.");
        setStatus("error");
        return;
      }
      trackEvent("generate_lead", {
        event_category: "form",
        form_name: "project_inquiry",
        form_location: "find_leads",
        interest: inquiry.interest,
      });
      setStatus("success");
    } catch {
      setError("We couldn’t connect. Your details are still here — try again or email Ian directly.");
      setStatus("error");
    }
  }

  return (
    <div className={styles.panel}>
      {status === "success" ? (
        <div className={styles.success} role="status" tabIndex={-1} ref={messageRef}>
          <span className={styles.eyebrow}>Message sent</span>
          <h3>Thanks for reaching out.</h3>
          <p>Your inquiry has been sent to Ian. He’ll reply to the email you provided.</p>
          <a href="#steps">Back to the lesson ↑</a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} aria-label="Tell Ian about your project" aria-busy={status === "sending"}>
          <fieldset disabled={status === "sending"} className={styles.fields}>
            <legend className={styles.eyebrow}>Tell me what you have in mind</legend>
            <div className={styles.row}>
              <label htmlFor="project-name">Your name
                <input id="project-name" name="name" autoComplete="name" required maxLength={200} />
              </label>
              <label htmlFor="project-email">Email
                <input id="project-email" name="email" type="email" autoComplete="email" required maxLength={254} />
              </label>
            </div>
            <label htmlFor="project-interest">What would you like help with?
              <select id="project-interest" name="interest" required defaultValue="">
                <option value="" disabled>Select one…</option>
                <option value="ai-training">AI training</option>
                <option value="workflow">A workflow</option>
                <option value="automation">An automation</option>
                <option value="social-media-content">Social media content</option>
              </select>
            </label>
            <label htmlFor="project-note">A little about your project <span>(optional)</span>
              <textarea id="project-note" name="note" rows={3} maxLength={5000} placeholder="What are you working on, or hoping to make easier?" />
            </label>
            {status === "error" && (
              <div className={styles.error} role="alert" tabIndex={-1} ref={messageRef}>
                {error} <a href="mailto:ian@ianmcdonald.ai">ian@ianmcdonald.ai</a>
              </div>
            )}
            <button type="submit" className={styles.submit}>
              {status === "sending" ? "Sending your inquiry…" : "Tell me about your project"}
            </button>
          </fieldset>
          <p className={styles.privacy}>I’ll use these details to respond to your inquiry. This won’t sign you up for a mailing list.</p>
        </form>
      )}
    </div>
  );
}
