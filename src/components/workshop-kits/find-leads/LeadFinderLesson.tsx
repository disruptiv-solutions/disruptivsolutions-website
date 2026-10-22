"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";
import ProjectInquiryForm from "./ProjectInquiryForm";
import { IAN_SOCIAL_URLS } from "@/lib/ian-social-links";
import styles from "./LeadFinderLesson.module.css";

function SocialLinks() {
  return (
    <div className="resource-socials" aria-label="Follow Ian">
      {Object.entries(IAN_SOCIAL_URLS).map(([label, href]) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
      ))}
    </div>
  );
}

export default function LeadFinderLesson() {
  const [activePart, setActivePart] = useState<number | null>(null);
  const [verified, setVerified] = useState<number[]>([]);
  const [animationsReady, setAnimationsReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const tracker = document.getElementById("tracker");
    const loop = document.getElementById("loop");
    if (!tracker || !loop) return;
    const configure = () => {
      observer?.disconnect();
      tracker.classList.remove("tk-armed", "tk-play");
      loop.classList.remove("lp-armed", "lp-play");
      const enabled = !media.matches && "IntersectionObserver" in window;
      setAnimationsReady(enabled);
      if (!enabled) return;
      tracker.classList.add("tk-armed");
      loop.classList.add("lp-armed");
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add(
              entry.target === tracker ? "tk-play" : "lp-play",
            );
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.15 },
      );
      observer.observe(tracker);
      observer.observe(loop);
    };
    configure();
    media.addEventListener("change", configure);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", configure);
      tracker.classList.remove("tk-armed", "tk-play");
      loop.classList.remove("lp-armed", "lp-play");
    };
  }, []);

  function replayTracker() {
    const tracker = document.getElementById("tracker");
    if (!tracker) return;
    tracker.classList.remove("tk-play");
    void tracker.offsetWidth;
    tracker.classList.add("tk-play");
  }

  return (
    <div className={styles.lesson}>
    <div
      className="y11 y36 y52"
      style={{ background: "#EFE7E0", lineHeight: "1.6" }}
    >
      <nav className="kit-breadcrumb" aria-label="Breadcrumb">
        <Link href="/learn">← Learn</Link>
        <span aria-current="page">Find leads with AI</span>
      </nav>
      <div>
        <section
          className="y12 y13 y0 y8 y3"
          style={{ padding: "64px 24px 72px", gap: "48px" }}
        >
          <div className="y7 y0 y5" style={{ flex: "1 1 440px", gap: "22px" }}>
            <h1
              className="y6 y4 y1 y56 y37"
              style={{
                fontSize: "clamp(40px, 5.2vw, 64px)",
                lineHeight: "1.04",
              }}
            >
              {"Find leads with AI. Then actually "}
              <span className="z65">{"follow up."}</span>
            </h1>
            <p
              className="y6 y38"
              style={{ maxWidth: "52ch", fontSize: "18px" }}
            >
              {
                "Use Gemini to find relevant opportunities, check the sources, and create a Google Sheet with a status and next action for every lead. Ask Gemini inside Sheets to format it. Back in the Gemini conversation, draft your first outreach message. My example is speaking opportunities for hands-on AI workshops."
              }
            </p>
            <div className="y0 y8 y39">
              <span className="z32">{"Clients"}</span>
              <span className="z32">{"Referral partners"}</span>
              <span className="z32">{"Sponsors"}</span>
              <span className="z32">{"Speaking gigs"}</span>
            </div>
            <a
              className="y4 y1"
              href="#steps"
              style={{ alignSelf: "flex-start", fontSize: "20px" }}
            >
              {"Jump to the eight steps"}
            </a>
            <aside className="resource-contact" aria-label="Contact Ian and follow along">
              <p className="resource-contact-label">Work with Ian</p>
              <p>Need help with AI training, a workflow or automation built, or social media content?</p>
              <a className="resource-inquiry-link" href="#project-inquiry">Tell me about your project →</a>
              <a className="resource-email" href="mailto:ian@ianmcdonald.ai">ian@ianmcdonald.ai</a>
              <p className="resource-social-label">Follow along</p>
              <SocialLinks />
            </aside>
          </div>
          <figure
            className="lesson-video y7"
            id="lesson-video"
            aria-labelledby="lesson-video-title"
            style={{ flex: "1 1 480px", margin: 0 }}
          >
            <div className="lesson-video-heading">
              <h2 className="y6 y4 y1" id="lesson-video-title">
                Watch the earlier walkthrough
              </h2>
              <span>2 min 56 sec</span>
            </div>
            <video
              className="lesson-video-player"
              width="1920"
              height="1080"
              controls
              playsInline
              preload="none"
              poster="/workshop-kits/find-leads/lead-finder-walkthrough-v4.jpg"
              aria-label="Find leads with AI: Gemini and Google Sheets walkthrough"
              aria-describedby="lesson-video-description"
            >
              <source
                src="/workshop-kits/find-leads/lead-finder-walkthrough-v4.mp4"
                type="video/mp4"
              />
              <track
                src="/workshop-kits/find-leads/lead-finder-walkthrough-v4.vtt"
                kind="captions"
                srcLang="en"
                label="English"
              />
              <p>
                <a href="/workshop-kits/find-leads/lead-finder-walkthrough-v4.mp4">
                  Watch or download the lesson video
                </a>.
              </p>
            </video>
            <figcaption id="lesson-video-description">
              This earlier, short recording shows a real Gemini and Sheets run.
              The October 22, 2026 workshop uses a newer Workspace example, creates the
              Sheet through Drive, and adds the outreach bonus. Use the updated
              prompts and instructions below to follow the current presentation.
              Full screen and CC are available.
            </figcaption>
          </figure>
        </section>
        <section
          className="lesson-tools y12 y13"
          id="tools-used"
          aria-labelledby="tools-used-title"
        >
          <h2 className="y6 y4 y1" id="tools-used-title">Tools used</h2>
          <ul className="lesson-tools-list">
            <li>
              <a className="lesson-tool" href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer">
                <span className="lesson-tool-icon" aria-hidden="true">
                  <img src="/workshop-kits/find-leads/google-gemini.png" width="40" height="40" alt="" />
                </span>
                <div className="lesson-tool-content">
                  <h3>Google Gemini</h3>
                  <span className="lesson-tool-role">LLM / AI assistant</span>
                  <p>Find opportunities, research the details, and draft your next step.</p>
                  <span className="lesson-tool-provider">by Google</span>
                </div>
                <svg className="lesson-tool-open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </li>
            <li>
              <a className="lesson-tool" href="https://sheets.google.com/" target="_blank" rel="noopener noreferrer">
                <span className="lesson-tool-icon" aria-hidden="true">
                  <img src="/workshop-kits/find-leads/google-sheets.svg" width="40" height="40" alt="" />
                </span>
                <div className="lesson-tool-content">
                  <h3>Google Sheets</h3>
                  <span className="lesson-tool-role">Spreadsheet / Lead tracker</span>
                  <p>Organize your leads, track their status, and plan the follow-up.</p>
                  <span className="lesson-tool-provider">by Google</span>
                </div>
                <svg className="lesson-tool-open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </li>
          </ul>
          <p className="lesson-tools-connection">
            <span>How they connect</span>
            Gemini <span aria-hidden="true">→</span> Create a Sheet with Google Drive <span aria-hidden="true">→</span> Ask Gemini in Sheets
          </p>
        </section>
        <section
          className="y24 y11"
          style={{
            borderTop: "1px solid #DDD7CB",
            borderBottom: "1px solid #DDD7CB",
          }}
        >
          <div
            className="y12 y13 y0 y8"
            style={{ padding: "56px 24px", gap: "40px" }}
          >
            <div className="y7 y0 y5 y42" style={{ flex: "1 1 300px" }}>
              <h2
                className="y6 y4 y1 y43"
                style={{
                  fontSize: "clamp(30px, 3.6vw, 42px)",
                  lineHeight: "1.08",
                }}
              >
                {"The whole method fits in four moves."}
              </h2>
              <p className="y6 y38" style={{ maxWidth: "40ch" }}>
                {
                  "Give AI context once. Then find, verify, and organize on repeat. Your follow-ups tell you what to search for next."
                }
              </p>
              <div
                className="y40 y4"
                id="loop"
                role="img"
                aria-label="The method: give AI context, then a loop of find leads, verify details, organize follow-ups, and back to find leads."
                style={{ width: "320px", height: "292px", marginTop: "16px" }}
              >
                <svg
                  className="lp-d y2 y44 y14 y15 y16 y17 y18 y19"
                  width="8"
                  height="47"
                  viewBox="0 0 8 47"
                  preserveAspectRatio="none"
                  style={{
                    animationDelay: "300ms",
                    left: "64px",
                    top: "64px",
                    height: "47px",
                  }}
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="dc-arrow-head-filled-2"
                      orient="auto"
                      markerWidth="5"
                      markerHeight="5"
                      refX="2"
                      refY="2"
                      overflow="visible"
                    >
                      <path
                        className="z18"
                        d="M0 0 L4 2 L0 4 Z"
                        fill="#5B5653"
                        stroke="none"
                      ></path>
                    </marker>
                  </defs>
                  <path
                    d="M 4 0 L 4 43"
                    markerEnd="url(#dc-arrow-head-filled-2)"
                  ></path>
                </svg>
                <svg
                  className="lp-r y2 y31 y14 y15 y16 y17 y18 y19"
                  width="47"
                  height="8"
                  viewBox="0 0 47 8"
                  preserveAspectRatio="none"
                  style={{
                    animationDelay: "750ms",
                    left: "136px",
                    top: "140px",
                    width: "47px",
                  }}
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="dc-arrow-head-filled-3"
                      orient="auto"
                      markerWidth="5"
                      markerHeight="5"
                      refX="2"
                      refY="2"
                      overflow="visible"
                    >
                      <path
                        className="z18"
                        d="M0 0 L4 2 L0 4 Z"
                        fill="#5B5653"
                        stroke="none"
                      ></path>
                    </marker>
                  </defs>
                  <path
                    d="M 0 4 L 43 4"
                    markerEnd="url(#dc-arrow-head-filled-3)"
                  ></path>
                </svg>
                <svg
                  className="lp-d y2 y44 y14 y15 y16 y17 y18 y19"
                  width="8"
                  height="47"
                  viewBox="0 0 8 47"
                  preserveAspectRatio="none"
                  style={{
                    animationDelay: "1200ms",
                    left: "248px",
                    top: "176px",
                    height: "47px",
                  }}
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="dc-arrow-head-filled-4"
                      orient="auto"
                      markerWidth="5"
                      markerHeight="5"
                      refX="2"
                      refY="2"
                      overflow="visible"
                    >
                      <path
                        className="z18"
                        d="M0 0 L4 2 L0 4 Z"
                        fill="#5B5653"
                        stroke="none"
                      ></path>
                    </marker>
                  </defs>
                  <path
                    d="M 4 0 L 4 43"
                    markerEnd="url(#dc-arrow-head-filled-4)"
                  ></path>
                </svg>
                <svg
                  className="lp-l y2 y31 y14 y15 y16 y17 y18 y19"
                  width="116"
                  height="8"
                  viewBox="0 0 116 8"
                  preserveAspectRatio="none"
                  style={{
                    animationDelay: "1650ms",
                    left: "68px",
                    top: "252px",
                    width: "116px",
                    strokeDasharray: "6 6",
                  }}
                  aria-hidden="true"
                >
                  <path d="M 0 4 L 116 4"></path>
                </svg>
                <svg
                  className="lp-u y2 y44 y14 y15 y16 y17 y18 y19"
                  width="8"
                  height="79"
                  viewBox="0 0 8 79"
                  preserveAspectRatio="none"
                  style={{
                    animationDelay: "2000ms",
                    left: "64px",
                    top: "177px",
                    height: "79px",
                  }}
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="dc-arrow-head-filled-5"
                      orient="auto"
                      markerWidth="5"
                      markerHeight="5"
                      refX="2"
                      refY="2"
                      overflow="visible"
                    >
                      <path
                        className="z18"
                        d="M0 0 L4 2 L0 4 Z"
                        fill="#5B5653"
                        stroke="none"
                      ></path>
                    </marker>
                  </defs>
                  <path
                    d="M 4 79 L 4 4"
                    markerEnd="url(#dc-arrow-head-filled-5)"
                  ></path>
                </svg>
                <div
                  className="lp-card y2 y35 y45 y46 y25 y47 y0 y3 y20 y21 y23 y26 y27 y28 y1 y48"
                  style={{ animationDelay: "0ms", top: "0px" }}
                >
                  {"Give AI context"}
                </div>
                <div
                  className="lp-card y2 y35 y45 y46 y25 y47 y0 y3 y20 y21 y32 y11 y10 y27 y28 y1 y48"
                  style={{ animationDelay: "450ms", top: "112px" }}
                >
                  {"Find leads"}
                </div>
                <div
                  className="lp-card y2 y45 y46 y25 y47 y0 y3 y20 y21 y32 y11 y10 y27 y28 y1 y48"
                  style={{
                    animationDelay: "900ms",
                    left: "184px",
                    top: "112px",
                  }}
                >
                  {"Verify details"}
                </div>
                <div
                  className="lp-card y2 y45 y46 y25 y47 y0 y3 y20 y21 y32 y11 y10 y27 y28 y1 y48"
                  style={{
                    animationDelay: "1350ms",
                    left: "184px",
                    top: "224px",
                  }}
                >
                  {"Organize follow-ups"}
                </div>
                <div
                  className="lp-label y2 y21 y36 y33 y1"
                  style={{
                    animationDelay: "2150ms",
                    left: "78px",
                    top: "268px",
                    width: "96px",
                    lineHeight: "16px",
                    color: "#5B5653",
                  }}
                >
                  {"next search"}
                </div>
              </div>
            </div>
            <nav
              className="y7"
              aria-label="Lesson steps"
              style={{ flex: "2 1 520px" }}
            >
              <ol
                className="y6 y59 y4 y60 y1 lesson-step-list"
                style={{
                  padding: "0",
                  listStyle: "none",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  columnGap: "32px",
                  gridTemplateRows: "repeat(4, auto)",
                  gridAutoFlow: "column",
                }}
              >
                <li className="z5">
                  <span className="z7">{"01"}</span>
                  <a className="z8" href="#step-1">
                    {"Start with your website"}
                  </a>
                </li>
                <li className="z5">
                  <span className="z7">{"02"}</span>
                  <a className="z8" href="#step-2">
                    {"Find leads that fit"}
                  </a>
                </li>
                <li className="z5">
                  <span className="z7">{"03"}</span>
                  <a className="z8" href="#step-3">
                    {"Personalize four search fields"}
                  </a>
                </li>
                <li className="z5">
                  <span className="z7">{"04"}</span>
                  <a className="z8" href="#step-4">
                    {"Research the gaps"}
                  </a>
                </li>
                <li className="z5">
                  <span className="z7">{"05"}</span>
                  <a className="z8" href="#step-5">
                    {"Check the source"}
                  </a>
                </li>
                <li className="z5">
                  <span className="z7">{"06"}</span>
                  <a className="z8" href="#step-6">
                    {"Give every lead a next step"}
                  </a>
                </li>
                <li className="z5">
                  <span className="z7">{"07"}</span>
                  <a className="z8" href="#step-7">
                    {"Make it easy to use"}
                  </a>
                </li>
                <li className="z5">
                  <span className="z7">{"08"}</span>
                  <a className="z8" href="#step-8">
                    {"Run it for your business"}
                  </a>
                </li>
              </ol>
              <p style={{ margin: "24px 0 0" }}><a href="#email-bonus">Bonus: draft the first message →</a></p>
            </nav>
          </div>
        </section>
        <div
          className="y12 y13 y0 y5"
          id="steps"
          style={{ padding: "80px 24px 40px" }}
        >
          <section className="z20" id="step-1">
            <div className="z9">{"01"}</div>
            <div className="z13">
              <div className="z4">
                <span className="z3">{"In Gemini"}</span>
              </div>
              <h2 className="z12">{"Start with your website"}</h2>
              <p className="z11">
                {
                  "Start with your website, then name your audience and offer. Read Gemini’s summary and correct anything it misses before searching. If it cannot open a page—or you do not have a website—paste the relevant text or a short business bio."
                }
              </p>
              <div
                className="y40 y36"
                role="img"
                aria-label="Your website, audience, and offer give Gemini a business brief: your background, expertise, and target audience."
                style={{ width: "320px", height: "228px", marginTop: "12px" }}
              >
                <svg
                  className="y2 y61 y62 y31 y14 y15 y16 y17 y18 y19"
                  width="24"
                  height="8"
                  viewBox="0 0 24 8"
                  preserveAspectRatio="none"
                  style={{ top: "18px" }}
                  aria-hidden="true"
                >
                  <path d="M 0 4 L 24 4"></path>
                </svg>
                <svg
                  className="y2 y61 y62 y31 y14 y15 y16 y17 y18 y19"
                  width="24"
                  height="8"
                  viewBox="0 0 24 8"
                  preserveAspectRatio="none"
                  style={{ top: "110px" }}
                  aria-hidden="true"
                >
                  <path d="M 0 4 L 24 4"></path>
                </svg>
                <svg
                  className="y2 y61 y62 y31 y14 y15 y16 y17 y18 y19"
                  width="24"
                  height="8"
                  viewBox="0 0 24 8"
                  preserveAspectRatio="none"
                  style={{ top: "202px" }}
                  aria-hidden="true"
                >
                  <path d="M 0 4 L 24 4"></path>
                </svg>
                <svg
                  className="y2 y44 y14 y15 y16 y17 y18 y19"
                  width="8"
                  height="184"
                  viewBox="0 0 8 184"
                  preserveAspectRatio="none"
                  style={{ left: "140px", top: "22px", height: "184px" }}
                  aria-hidden="true"
                >
                  <path d="M 4 0 L 4 184"></path>
                </svg>
                <svg
                  className="y2 y31 y14 y15 y16 y17 y18 y19"
                  width="23"
                  height="8"
                  viewBox="0 0 23 8"
                  preserveAspectRatio="none"
                  style={{ left: "144px", top: "110px", width: "23px" }}
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="dc-arrow-head-filled-1"
                      orient="auto"
                      markerWidth="5"
                      markerHeight="5"
                      refX="2"
                      refY="2"
                      overflow="visible"
                    >
                      <path
                        className="z18"
                        d="M0 0 L4 2 L0 4 Z"
                        fill="#5B5653"
                        stroke="none"
                      ></path>
                    </marker>
                  </defs>
                  <path
                    d="M 0 4 L 19 4"
                    markerEnd="url(#dc-arrow-head-filled-1)"
                  ></path>
                </svg>
                <div
                  className="y2 y35 y63 y64 y25 y65 y0 y3 y20 y21 y24 y10 y66 y22 y1"
                  style={{ top: "0px" }}
                >
                  {"Your website"}
                </div>
                <div
                  className="y2 y35 y63 y64 y25 y65 y0 y3 y20 y21 y24 y10 y66 y22 y1"
                  style={{ top: "92px" }}
                >
                  {"Your audience"}
                </div>
                <div
                  className="y2 y35 y63 y64 y25 y65 y0 y3 y20 y21 y24 y10 y66 y22 y1"
                  style={{ top: "184px" }}
                >
                  {"Your offer"}
                </div>
                <div
                  className="y2 y25 y0 y3 y20 y21 y23 y26 y27 y22"
                  style={{
                    left: "168px",
                    top: "44px",
                    width: "152px",
                    height: "140px",
                    padding: "12px",
                    lineHeight: "1.55",
                  }}
                >
                  <span>
                    <b className="y4 y52" style={{ color: "#FB8078" }}>
                      {"Your profile"}
                    </b>
                    <br />
                    {"Background"}
                    <br />
                    {"Expertise"}
                    <br />
                    {"Target audience"}
                  </span>
                </div>
              </div>
            </div>
            <div className="z21">
              <div className="z16">
                <div className="z15">{"You type"}</div>
                <CopyButton promptId="prompt-1" />
              </div>
              <p className="z19" id="prompt-1">
                {
                  "Review my website(s): [WEBSITE]. I help [AUDIENCE] with [OFFER]. Use the website context to summarize my expertise, audience, and what makes a good opportunity for me. Ask about anything important that is missing. If you cannot access a page, tell me so I can paste the relevant text."
                }
              </p>
            </div>
            <div className="resource-note">
              <p><strong>Optional, recommended context:</strong> connect Google Workspace to draw on relevant business files or messages you choose. This prepared workshop example uses that connection too. You can still start with your website or a short bio.</p>
              <p><strong>Ian’s example:</strong> ianmcdonald.ai and disruptiv.solutions; small-business owners; hands-on AI workshops. The prepared conversation began with a short bio, so this website prompt is the reusable template, not a transcript of that first message.</p>
            </div>
          </section>
          <section className="z20" id="step-2">
            <div className="z9">{"02"}</div>
            <div className="z13">
              <div className="z4">
                <span className="z3">{"In Gemini"}</span>
              </div>
              <h2 className="z12">{"Find leads that fit"}</h2>
              <p className="z11">
                {
                  "Use your business brief to decide what a useful opportunity looks like. Gemini should explain why each candidate fits. A search result is a candidate to investigate, not a confirmed client or an available speaking slot."
                }
              </p>
            </div>
            <div
              className="y67 y7 y59 y34"
              style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
            >
              <div className="z38">
                <div className="z36">{"Audience"}</div>
                <div className="z10">{"Who's in the room"}</div>
              </div>
              <div className="z38">
                <div className="z36">{"Location"}</div>
                <div className="z10">{"Your city or region"}</div>
              </div>
              <div className="z38">
                <div className="z36">{"Timing"}</div>
                <div className="z10">{"When you can take it on"}</div>
              </div>
            </div>
          </section>
          <section className="z20" id="step-3">
            <div className="z9">{"03"}</div>
            <div className="z13">
              <div className="z4">
                <span className="z3">{"In Gemini"}</span>
              </div>
              <h2 className="z12">{"Personalize four search fields"}</h2>
              <p className="z11">
                {
                  "Now that Gemini has your context, personalize four fields: opportunity type, location, dates, and offer. The expert role, five-result count, output columns, and source instructions stay fixed. Tap a field to find its place in the prompt, then replace every bracketed value before sending."
                }
              </p>
            </div>
            <div className="z21">
              <div className="z16">
                <div className="z15">{"You type"}</div>
                <CopyButton promptId="prompt-2" />
              </div>
              <p className="y6 y28" id="prompt-2" style={{ lineHeight: "2.1" }}>
                {"Act as an expert lead generator. Find five upcoming "}
                <span className={"sg" + (activePart === 1 ? " sg-on-y" : "")}>[OPPORTUNITY TYPE]</span>
                {" in "}<span className={"sg" + (activePart === 2 ? " sg-on-y" : "")}>[LOCATION]</span>
                {", happening "}<span className={"sg" + (activePart === 3 ? " sg-on-y" : "")}>[DATES]</span>
                {", where I could offer a "}<span className={"sg" + (activePart === 4 ? " sg-on-y" : "")}>[OFFER]</span>
                {". Return the event name, audience, location, date, why it fits, and official source URL. Use official organizer sources. If a date or speaker call is not published, say so. Do not invent contacts or imply that a speaking slot is available."}
              </p>
              <div className="resource-search-fields" aria-label="Four fields to personalize">
                {["Opportunity type", "Location", "Dates", "Offer"].map((label, index) => (
                  <button key={label} type="button" className={"lg z14" + (activePart === index + 1 ? " lg-on" : "")}
                    aria-pressed={activePart === index + 1}
                    onClick={() => setActivePart(activePart === index + 1 ? null : index + 1)}>
                    <span aria-hidden="true">0{index + 1} </span>{label}
                  </button>
                ))}
              </div>
              <details className="resource-example">
                <summary>See Ian’s filled-in example</summary>
                <p className="z19">Business, tech, or AI events · greater Houston or online · November 2026 through January 2027 · hands-on AI workshop for small-business owners.</p>
              </details>
            </div>
          </section>
          <section className="z63" id="step-4">
            <div className="z9">{"04"}</div>
            <div className="z13">
              <div className="z4">
                <span className="z3">{"In Gemini"}</span>
              </div>
              <h2 className="z12">{"Research the gaps"}</h2>
              <p className="z11">
                {
                  "Research the organizer, a public contact route or submission form, the pitch angle, and the official sources. Missing contact details should stay missing. A form-only lead can still have a useful next action; Gemini must not invent an email address."
                }
              </p>
              <div className="y0 y5 y53" style={{ marginTop: "10px" }}>
                <div className="z61">
                  <div className="z54">{"Thin lead"}</div>
                  <div className="z51">
                    <div className="z33">{"Event"}</div>
                    <div className="z33">{"Date"}</div>
                    <div className="z28">{"No contact"}</div>
                    <div className="z28">{"No email"}</div>
                    <div className="z28">{"No apply link"}</div>
                    <div className="z28">{"No pitch"}</div>
                  </div>
                </div>
                <div className="z61">
                  <div className="z54">{"Researched lead"}</div>
                  <div className="z51">
                    <div className="z33">{"Event"}</div>
                    <div className="z33">{"Date"}</div>
                    <div className="z30">{"Contact"}</div>
                    <div className="z30">{"Email"}</div>
                    <div className="z30">{"Apply link"}</div>
                    <div className="z30">{"Pitch angle"}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="z21">
              <div className="z16">
                <div className="z15">{"You type"}</div>
                <CopyButton promptId="prompt-3" />
              </div>
              <p className="z19" id="prompt-3">
                {
                  "Before we export this conduct some deeper research, find the event organizer and a public contact route or speaker submission link. Add a suggested pitch angle and the official source for each detail. Mark missing information as not found. Separate confirmed opportunities from organizations worth contacting."
                }
              </p>
              <p className="resource-small-note">“Confirmed” still needs a source check. A real event or published application route does not establish available speaking space.</p>
            </div>
          </section>
        </div>
        <section className="z56" id="step-5">
          <div
            className="y12 y13 y0 y8"
            style={{
              padding: "80px 24px",
              gap: "32px 64px",
              alignItems: "flex-start",
            }}
          >
            <div
              className="y7 y0 y5"
              style={{ flex: "1 1 420px", gap: "18px" }}
            >
              <div
                className="y4 y1"
                style={{
                  fontSize: "40px",
                  lineHeight: "1",
                  color: "#F64F45",
                  fontVariantNumeric: "lining-nums tabular-nums",
                }}
              >
                {"05"}
              </div>
              <div className="z4">
                <span
                  className="y9 y69 y33 y1 y68"
                  style={{ background: "#232528", border: "1px solid #494541" }}
                >
                  {"On the event's own website"}
                </span>
              </div>
              <h2
                className="y6 y4 y1 y56 y37"
                style={{
                  fontSize: "clamp(34px, 4.4vw, 54px)",
                  lineHeight: "1.04",
                }}
              >
                {"Check the source. "}
                <span className="z47">{"Every time."}</span>
              </h2>
              <p className="y6 y68" style={{ maxWidth: "46ch" }}>
                {
                  "AI can hand you outdated or flat wrong information. Dates move and contacts leave. Open every source link and confirm the details yourself before you reach out."
                }
              </p>
              <p className="y6 y4 y1 y26" style={{ fontSize: "24px" }}>
                {"Gemini prepares. "}
                <span className="z47">{"You approve."}</span>
              </p>
            </div>
            <fieldset
              className="y67 y7 y6 y30 y0 y5 y70"
              style={{ border: "1px solid #494541", padding: "28px" }}
            >
              <legend
                className="y4 y29"
                style={{ padding: "0 8px", fontSize: "20px" }}
              >
                {"Before you send anything"}
              </legend>
              <label className="z29">
                <span className="z23">
                  <input
                    type="checkbox"
                    className="ckbox"
                    data-check="1"
                    checked={verified.includes(1)}
                    onChange={() =>
                      setVerified((current) =>
                        current.includes(1)
                          ? current.filter((value) => value !== 1)
                          : [...current, 1],
                      )
                    }
                  />
                  <svg
                    className={
                      "ck z31" + (verified.includes(1) ? " ck-on" : "")
                    }
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5.5 11.5 L9.5 15.5 L16.5 7"
                      stroke="#16181A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                <span
                  className={"ck-t" + (verified.includes(1) ? " ck-dim" : "")}
                >
                  {"The event is real and still happening"}
                </span>
              </label>
              <label className="z29">
                <span className="z23">
                  <input
                    type="checkbox"
                    className="ckbox"
                    data-check="2"
                    checked={verified.includes(2)}
                    onChange={() =>
                      setVerified((current) =>
                        current.includes(2)
                          ? current.filter((value) => value !== 2)
                          : [...current, 2],
                      )
                    }
                  />
                  <svg
                    className={
                      "ck z31" + (verified.includes(2) ? " ck-on" : "")
                    }
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5.5 11.5 L9.5 15.5 L16.5 7"
                      stroke="#16181A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                <span
                  className={"ck-t" + (verified.includes(2) ? " ck-dim" : "")}
                >
                  {"The date matches the official site"}
                </span>
              </label>
              <label className="z29">
                <span className="z23">
                  <input
                    type="checkbox"
                    className="ckbox"
                    data-check="3"
                    checked={verified.includes(3)}
                    onChange={() =>
                      setVerified((current) =>
                        current.includes(3)
                          ? current.filter((value) => value !== 3)
                          : [...current, 3],
                      )
                    }
                  />
                  <svg
                    className={
                      "ck z31" + (verified.includes(3) ? " ck-on" : "")
                    }
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5.5 11.5 L9.5 15.5 L16.5 7"
                      stroke="#16181A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                <span
                  className={"ck-t" + (verified.includes(3) ? " ck-dim" : "")}
                >
                  {"The public contact or submission route is current"}
                </span>
              </label>
              <label className="z29">
                <span className="z23">
                  <input
                    type="checkbox"
                    className="ckbox"
                    data-check="4"
                    checked={verified.includes(4)}
                    onChange={() =>
                      setVerified((current) =>
                        current.includes(4)
                          ? current.filter((value) => value !== 4)
                          : [...current, 4],
                      )
                    }
                  />
                  <svg
                    className={
                      "ck z31" + (verified.includes(4) ? " ck-on" : "")
                    }
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5.5 11.5 L9.5 15.5 L16.5 7"
                      stroke="#16181A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                <span
                  className={"ck-t" + (verified.includes(4) ? " ck-dim" : "")}
                >
                  {"I have reviewed the terms and know what availability still needs confirming"}
                </span>
              </label>
              <div
                id="ready"
                hidden={verified.length !== 4}
                className="ck-ready y11 y27 y0 y42 y3"
                role="status"
                style={{
                  marginTop: "6px",
                  background: "#F64F45",
                  padding: "14px 18px",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  stroke="#16181A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5.5 11.5 L9.5 15.5 L16.5 7"></path>
                </svg>
                <span>
                  <b className="y4" style={{ fontSize: "18px" }}>
                    {"Choose your next action."}
                  </b>
                  {" Keep unresolved details marked Needs review."}
                </span>
              </div>
            </fieldset>
            <div
              className="y7 y0 y5 y53"
              style={{ flex: "1 1 100%", paddingTop: "16px" }}
            >
              <div className="z58">{"Why the source changes the next action"}</div>
              <div className="y0 y8 y70" style={{ alignItems: "stretch" }}>
                <div
                  className="y7 y30 y0 y5 y42"
                  style={{
                    flex: "1 1 320px",
                    background: "#232528",
                    padding: "24px",
                  }}
                >
                  <div className="y0 y34 y3 y50 y1 y49">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="#B8B4AB"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <path d="M2.5 3.5 H15.5 V12 H7 L3.5 15 V12 H2.5 Z"></path>
                    </svg>
                    {"Gemini said"}
                  </div>
                  <div
                    className="y28"
                    style={{
                      background: "#2E3034",
                      borderRadius: "4px 16px 16px 16px",
                      padding: "16px 18px",
                      lineHeight: "1.6",
                    }}
                  >
                    <b>Houston Small Business Expo</b>
                    <br />
                    The prepared response called it a “Confirmed Event Opportunity” and described the speaker application as open.
                  </div>
                </div>
                <div
                  className="y11 y9 y50"
                  style={{
                    flex: "0 0 auto",
                    alignSelf: "center",
                    background: "#F64F45",
                    padding: "6px 14px",
                    fontWeight: "750",
                  }}
                >
                  {"Check the terms"}
                </div>
                <div
                  className="y7 y24 y11 y30 y57 y0 y5"
                  style={{ flex: "1 1 320px" }}
                >
                  <div
                    className="y0 y39 y3"
                    style={{ background: "#E8E0D7", padding: "10px 16px" }}
                  >
                    <span className="z55"></span>
                    <span className="z55"></span>
                    <span
                      className="y24 y9 y69 y33"
                      style={{ flex: "1", marginLeft: "8px", color: "#5B5653" }}
                    >
                      {"Official speaker application"}
                    </span>
                  </div>
                  <div
                    className="y0 y5"
                    style={{ padding: "20px 22px", gap: "6px" }}
                  >
                    <div className="z58">A real route, with conditions</div>
                    <div className="z57">Unpaid speaking · placement not guaranteed · last-minute openings.</div>
                    <div className="z57"><strong>Next action:</strong> decide whether the terms work for you and confirm availability before submitting.</div>
                  </div>
                </div>
              </div>
              <p className="y6 y22 y49">
                Workshop example checked October 22, 2026. Read the current <a className="z6" href="https://www.thesmallbusinessexpo.com/city/houston/" target="_blank" rel="noopener noreferrer">official event page</a> and <a className="z6" href="https://www.thesmallbusinessexpo.com/speaker-submission/" target="_blank" rel="noopener noreferrer">speaker submission terms</a> yourself. A confirmed event or an application form does not confirm an available Houston speaking slot. Keep this row marked Needs review until your decision is made.
              </p>
            </div>
          </div>
        </section>
        <section
          className="y12 y13 y0 y5"
          style={{ padding: "40px 24px 40px" }}
        >
          <section className="z20" id="step-6">
            <div className="z9">{"06"}</div>
            <div className="z13">
              <div className="z4">
                <span className="z3">{"In Gemini"}</span>
                <span className="z3">{"@Google Drive"}</span>
              </div>
              <h2 className="z12">{"Give every lead a next step"}</h2>
              <p className="z11">
                {
                  "Choose @Google Drive in Gemini and use the prompt below in the same conversation. In the workshop run, Gemini created a native Google Sheet and returned a file card with an Open button. Open that created file, then check its sources, Status, and Next action."
                }
              </p>
            </div>
            <div className="z21">
              <div className="z16">
                <div className="z15">{"You type"}</div>
                <CopyButton promptId="prompt-4" />
              </div>
              <p className="z19" id="prompt-4">
                {
                  "@Google Drive Put the researched leads into one table. Include opportunity, date, location, contact, public email or phone, why it fits, pitch angle, apply link, and official source URL. Add Status and Next action. Mark unverified items Needs review and give each row a specific next action. Do not treat an unpublished date as confirmed."
                }
              </p>
            </div>
            <p className="resource-note">If your account returns only a table, use Export to Sheets when offered, or copy it into a new Sheet. This is a fallback; the prepared workshop uses the created-file card and Open button. Keep unpublished dates unconfirmed and check suggested next actions against the terms you found.</p>
          </section>
          <section className="z20" id="step-7">
            <div className="z9">{"07"}</div>
            <div className="z13">
              <div className="z4">
                <span className="z3">{"In Google Sheets"}</span>
                <span className="z3">{"Ask Gemini"}</span>
              </div>
              <h2 className="z12">{"Make it easy to use"}</h2>
              <p className="z11">
                {
                  "Open the created tracker in Google Sheets. Click the Gemini sparkle button at the top right of the sheet, then paste this tested prompt into the side panel. Use the Gemini button inside Sheets; Chrome’s separate Ask Gemini control is a different interface."
                }
              </p>
            </div>
            <div className="z21">
              <div className="z16">
                <div className="z15">{"You type"}</div>
                <CopyButton promptId="prompt-5" />
              </div>
              <p className="z19" id="prompt-5">
                {
                  "Give this tracker a clean, polished look: dark blue headers, subtle alternating rows, wrapped text, and readable column widths. Keep all data and links unchanged."
                }
              </p>
            </div>
            <p className="z11" style={{ flex: "1 1 100%" }}>
              Review the formatting plan and choose Approve if your interface
              offers it. Let Gemini finish, then check that the rows, details,
              and links are intact. The prepared Workspace example showed a
              “Format Lead Tracker Layout” plan, approval, and a completed
              result with dark blue headers, alternating rows, wrapped text,
              and readable widths. It is already formatted in the presentation.
              Other interfaces may offer Apply or make the changes directly;
              review the result either way.
            </p>
            <p className="y6 y22 y49" style={{ flex: "1 1 100%" }}>
              Gemini in Sheets is available to eligible Google accounts. If you
              do not see the sparkle button in Sheets, keep using your tracker;
              you can still complete the research and organize your next actions.
            </p>
            <div
              className="y7 y0 y8 y55"
              style={{ flex: "1 1 100%", paddingTop: "8px" }}
            >
              <p className="resource-note">Simplified before/after illustration. The workshop’s actual Sheet has eleven columns and five lead rows; formatting should leave their content unchanged.</p>
              <div className="z53">
                <div className="y4 y60 y29">{"Before"}</div>
                <div
                  className="y71 y32"
                  style={{ border: "1px solid #C8C8C8" }}
                >
                  <table
                    className="y72 y41"
                    style={{
                      minWidth: "440px",
                      tableLayout: "fixed",
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "12px",
                      color: "#202124",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#F8F9FA", color: "#5F6368" }}>
                        <th
                          style={{
                            width: "28px",
                            border: "1px solid #E0E0E0",
                            padding: "3px",
                            fontWeight: "400",
                          }}
                        >
                          <span
                            className="y2 y57"
                            style={{
                              width: "1px",
                              height: "1px",
                              clip: "rect(0 0 0 0)",
                            }}
                          >
                            {"Row"}
                          </span>
                        </th>
                        <th className="z25">{"A"}</th>
                        <th className="z25">{"B"}</th>
                        <th className="z25">{"C"}</th>
                        <th className="z25">{"D"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="z26">{"1"}</td>
                        <td className="z1">{"Event Name"}</td>
                        <td className="z1">{"Date"}</td>
                        <td className="z1">{"Why it's a good fit"}</td>
                        <td className="z1">{"Status"}</td>
                      </tr>
                      <tr>
                        <td className="z26">{"2"}</td>
                        <td className="z1">{"[EVENT NAME]"}</td>
                        <td className="z1">{"[DATE]"}</td>
                        <td className="z1">
                          {"[A LONG SENTENCE ABOUT WHY THIS EVENT FITS YOUR OFFER]"}
                        </td>
                        <td className="z1">{"Needs review"}</td>
                      </tr>
                      <tr>
                        <td className="z26">{"3"}</td>
                        <td className="z1">{"[EVENT NAME]"}</td>
                        <td className="z1">{"[DATE]"}</td>
                        <td className="z1">
                          {"[A LONG SENTENCE ABOUT WHY THIS EVENT FITS YOUR OFFER]"}
                        </td>
                        <td className="z1">{"Needs review"}</td>
                      </tr>
                      <tr>
                        <td className="z26">{"4"}</td>
                        <td className="z1">{"[EVENT NAME]"}</td>
                        <td className="z1">{"[DATE]"}</td>
                        <td className="z1">
                          {"[A LONG SENTENCE ABOUT WHY THIS EVENT FITS YOUR OFFER]"}
                        </td>
                        <td className="z1">{"Needs review"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="z53">
                <div className="y4 y60 y29 y51">
                  {"After Gemini formats it (illustration)"}
                </div>
                <div className="y71 y10 y32" style={{ borderRadius: "12px" }}>
                  <table
                    className="y72 y41 y33"
                    style={{ minWidth: "440px", lineHeight: "1.45" }}
                  >
                    <thead>
                      <tr style={{ background: "#17365D", color: "#FFFFFF", textAlign: "left" }}>
                        <th className="z27" scope="col">
                          {"Event Name"}
                        </th>
                        <th className="z27" scope="col">
                          {"Date"}
                        </th>
                        <th className="z27" scope="col">
                          {"Why it's a good fit"}
                        </th>
                        <th className="z27" scope="col">
                          {"Status"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="z46">{"[EVENT NAME]"}</td>
                        <td className="z48">{"[DATE]"}</td>
                        <td className="z40">
                          {"[A LONG SENTENCE ABOUT WHY THIS EVENT FITS YOUR OFFER]"}
                        </td>
                        <td className="z39">{"Needs review"}</td>
                      </tr>
                      <tr style={{ background: "#EEF3F8" }}>
                        <td className="z46">{"[EVENT NAME]"}</td>
                        <td className="z48">{"[DATE]"}</td>
                        <td className="z40">
                          {"[A LONG SENTENCE ABOUT WHY THIS EVENT FITS YOUR OFFER]"}
                        </td>
                        <td className="z39">{"Needs review"}</td>
                      </tr>
                      <tr>
                        <td className="z46">{"[EVENT NAME]"}</td>
                        <td className="z48">{"[DATE]"}</td>
                        <td className="z40">
                          {"[A LONG SENTENCE ABOUT WHY THIS EVENT FITS YOUR OFFER]"}
                        </td>
                        <td className="z39">{"Needs review"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
          <section className="z63" id="step-8">
            <div className="z9">{"08"}</div>
            <div className="z13">
              <div className="z4">
                <span className="z3">{"In Gemini"}</span>
              </div>
              <h2 className="z12">{"Run it for your business"}</h2>
              <p className="z11">
                {
                  "Use your website, audience, and offer for the brief. Then replace opportunity type, location, dates, and offer in the search prompt. Find five candidates, check one against an official source, and choose its next action."
                }
              </p>
            </div>
            <div className="y67 y7 y0 y5 y34">
              {["Opportunity type", "Location", "Dates", "Offer"].map((field) => (
                <div className="z50" key={field}><span className="z59">{field}</span><span className="z43">Your information</span></div>
              ))}
            </div>
          </section>
        </section>
        <section className="y12 y13" style={{ padding: "40px 24px 88px" }}>
          <div
            className="y24 y10 y30 y0 y5 y70"
            style={{ padding: "clamp(24px, 4vw, 48px)" }}
          >
            <h2
              className="y6 y4 y1 y74 y43"
              style={{ fontSize: "clamp(30px, 3.8vw, 44px)" }}
            >
              {"What your tracker "}
              <span className="z65">{"looks like"}</span>
            </h2>
            <div
              className="y0 y8 y54"
              style={{ gap: "12px 32px", alignItems: "flex-end" }}
            >
              <p className="y6 y38" style={{ maxWidth: "60ch" }}>
                {
                  "Keep all eleven columns, including the official source URL. This is a template with three illustrative rows, not the prepared five-lead Sheet. Start unverified rows at Needs review and give each a specific next action."
                }
              </p>
              <button
                className="y36 y22 y1 y11 y10 y9 y0 y39 y3"
                type="button"
                id="replay"
                hidden={!animationsReady}
                style={{
                  background: "transparent",
                  padding: "10px 18px",
                  minHeight: "44px",
                  cursor: "pointer",
                }}
                onClick={replayTracker}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="#16181A"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M13.5 8 A5.5 5.5 0 1 1 11.9 4.1"></path>
                  <path d="M12.5 1.5 L12.2 4.6 L9.1 4.3"></path>
                </svg>
                {"Fill it again"}
              </button>
            </div>
            <div
              className="y71 y10 y27 y32"
              id="tracker"
              style={{ marginTop: "8px" }}
            >
              <table
                className="y72 y41 y50"
                style={{
                  minWidth: "1220px",
                  fontVariantNumeric: "lining-nums tabular-nums",
                }}
              >
                <thead>
                  <tr className="y23 y26" style={{ textAlign: "left" }}>
                    <th className="z2" scope="col">
                      {"Event"}
                    </th>
                    <th className="z2" scope="col">
                      {"Date"}
                    </th>
                    <th className="z2" scope="col">
                      {"Location"}
                    </th>
                    <th className="z2" scope="col">
                      {"Contact"}
                    </th>
                    <th className="z2" scope="col">
                      {"Email or phone"}
                    </th>
                    <th className="z2" scope="col">
                      {"Why it fits"}
                    </th>
                    <th className="z2" scope="col">
                      {"Pitch angle"}
                    </th>
                    <th className="z2" scope="col">
                      {"Apply link"}
                    </th>
                    <th className="z2" scope="col">Official source URL</th>
                    <th className="z64" scope="col">
                      {"Status"}
                    </th>
                    <th className="z64" scope="col">
                      {"Next action"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className="tk-row"
                    style={{
                      borderBottom: "1px solid #EEE8DD",
                      animationDelay: "300ms",
                    }}
                  >
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "300ms" }}
                      >
                        {"[EVENT NAME]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "350ms" }}
                      >
                        {"[DATE]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "400ms" }}
                      >
                        {"[CITY]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "450ms" }}
                      >
                        {"[ORGANIZER]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "500ms" }}
                      >
                        {"[EMAIL]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "550ms" }}
                      >
                        {"[ONE LINE]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "600ms" }}
                      >
                        {"[YOUR ANGLE]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "650ms" }}
                      >
                        {"[LINK]"}
                      </span>
                    </td>
                    <td className="z0"><span className="tk-c" style={{ animationDelay: "700ms" }}>[OFFICIAL URL]</span></td>
                    <td className="z0">
                      <span
                        className="tk-pill y51 y9 y75 y1"
                        style={{
                          background: "#FBE3DF",
                          animationDelay: "760ms",
                        }}
                      >
                        {"Needs review"}
                      </span>
                    </td>
                    <td className="z2">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "860ms" }}
                      >
                        {"Confirm the date on the official site"}
                      </span>
                    </td>
                  </tr>
                  <tr
                    className="tk-row"
                    style={{
                      borderBottom: "1px solid #EEE8DD",
                      animationDelay: "950ms",
                    }}
                  >
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "950ms" }}
                      >
                        {"[EVENT NAME]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1000ms" }}
                      >
                        {"[DATE]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1050ms" }}
                      >
                        {"[CITY]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1100ms" }}
                      >
                        {"[ORGANIZER]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1150ms" }}
                      >
                        {"[EMAIL]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1200ms" }}
                      >
                        {"[ONE LINE]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1250ms" }}
                      >
                        {"[YOUR ANGLE]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1300ms" }}
                      >
                        {"[LINK]"}
                      </span>
                    </td>
                    <td className="z0"><span className="tk-c" style={{ animationDelay: "700ms" }}>[OFFICIAL URL]</span></td>
                    <td className="z0">
                      <span
                        className="tk-pill y9 y75 y1"
                        style={{
                          background: "#FDF3C4",
                          color: "#5C4A05",
                          animationDelay: "1410ms",
                        }}
                      >
                        {"Needs review"}
                      </span>
                    </td>
                    <td className="z2">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1510ms" }}
                      >
                        {"Check speaker terms and availability"}
                      </span>
                    </td>
                  </tr>
                  <tr className="tk-row z52">
                    <td className="z0">
                      <span className="tk-c z52">{"[EVENT NAME]"}</span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1650ms" }}
                      >
                        {"[DATE]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1700ms" }}
                      >
                        {"[CITY]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1750ms" }}
                      >
                        {"[ORGANIZER]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1800ms" }}
                      >
                        {"[EMAIL]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1850ms" }}
                      >
                        {"[ONE LINE]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1900ms" }}
                      >
                        {"[YOUR ANGLE]"}
                      </span>
                    </td>
                    <td className="z0">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1950ms" }}
                      >
                        {"[LINK]"}
                      </span>
                    </td>
                    <td className="z0"><span className="tk-c" style={{ animationDelay: "700ms" }}>[OFFICIAL URL]</span></td>
                    <td className="z0">
                      <span
                        className="tk-pill y23 y26 y9 y75 y1"
                        style={{ animationDelay: "2060ms" }}
                      >
                        {"Needs review"}
                      </span>
                    </td>
                    <td className="z2">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "2160ms" }}
                      >
                        {"Find a current public contact route"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section className="y12 y13" id="email-bonus" style={{ padding: "0 24px 88px" }}>
          <div className="y24 y10 y30 y0 y5 y55" style={{ padding: "clamp(24px, 4vw, 48px)" }}>
            <div className="z4"><span className="y11 y9 y69 y33 y29" style={{ background: "#F5D23D" }}>Bonus</span></div>
            <h2 className="y6 y4 y1 y74 y43" style={{ fontSize: "clamp(30px, 3.8vw, 44px)" }}>Draft the first message</h2>
            <p className="z62">With your tracker organized, use the business context and researched leads in the same Gemini conversation to prepare outreach. Review the recipient, facts, fit, and availability before you send anything.</p>
            <div className="z21">
              <div className="z16"><div className="z15">You type</div><CopyButton promptId="prompt-6" /></div>
              <p className="z19" id="prompt-6">@Gmail Use the lead tracker and business context in this chat to draft a personalized outreach email for each lead. Include a specific subject, relevant workshop angle, and one easy question. Keep each email under 150 words, warm and direct. Use only sourced facts and public contact emails; don’t guess. Ask about availability when unconfirmed. Save drafts only—do not send. For form-only leads, show a pasteable message. If Gmail draft creation is unavailable, show recipient, subject, and body here.</p>
            </div>
            <p className="z62">Gmail draft creation depends on the account and mode. Standard work or school connections may return the message in chat instead. Review that text and copy it into Gmail or the official form; use Share &amp; export → Draft in Gmail only if offered. This workshop does not demonstrate saved Gmail drafts.</p>
            <details className="resource-draft" open>
              <summary>Illustrative draft · not sent</summary>
              <p><strong>Route:</strong> Houston Small Business Expo speaker submission form. No recipient email is assumed.</p>
              <p><strong>Subject:</strong> Hands-on AI workshop for Houston business owners</p>
              <blockquote>
                <p>Hi Small Business Expo team,</p>
                <p>I’m Ian McDonald, a Houston-based AI builder and educator. I teach small-business owners practical AI workflows through hands-on workshops.</p>
                <p>Would a session on using Gemini and Google Sheets to research prospects and organize follow-up fit your Houston programming? Attendees would leave with a source-linked lead tracker and a clear next action.</p>
                <p>Are you considering workshop proposals, or is there someone I should contact about future dates?</p>
                <p>Thanks,<br />Ian</p>
              </blockquote>
              <p className="resource-small-note">Prepared teaching example, not a claim that Gemini generated or saved this exact message. It asks about availability rather than assuming a slot is open.</p>
            </details>
          </div>
        </section>
        <section
          className="y12 y13"
          id="about"
          style={{ padding: "0 24px 96px" }}
        >
          <div
            className="y0 y8 y3"
            style={{
              gap: "32px 48px",
              borderTop: "2px solid #16181A",
              paddingTop: "48px",
            }}
          >
            <div className="y7 y0 y5 y42" style={{ flex: "1 1 420px" }}>
              <h2
                className="y6 y4 y1 y43"
                style={{
                  fontSize: "clamp(28px, 3.4vw, 38px)",
                  lineHeight: "1.08",
                }}
              >
                {"About Ian"}
              </h2>
              <p className="z62">
                {
                  "Ian McDonald is an AI workflow consultant and developer who helps small business owners save hours every week using the tools they already have. He adds AI in ways that save real time while keeping the owner in the approval seat."
                }
              </p>
              <a className="resource-email" href="mailto:ian@ianmcdonald.ai">ian@ianmcdonald.ai</a>
              <SocialLinks />
            </div>
          </div>
        </section>
      </div>
      <section className="z56" aria-label="Keep building relationships">
        <div
          className="y12 y13 y0 y5"
          style={{ padding: "64px 24px 44px", gap: "32px" }}
        >
          <p
            className="y6 y4 y1 y74 y56 y37"
            style={{ fontSize: "clamp(28px, 3.8vw, 44px)", maxWidth: "20ch" }}
          >
            {"The list is your starting point. "}
            <span className="z47">{"The relationship comes next."}</span>
          </p>
          <section className="resource-project-grid" id="project-inquiry" aria-labelledby="project-inquiry-title">
            <div className="resource-closing-cta">
              <h2 id="project-inquiry-title">Need help putting AI to work?</h2>
              <p>AI training, a workflow or automation built for your business, or social media content. Tell me what you have in mind, and let’s figure out the next step.</p>
              <p>Prefer email? Reach me directly:</p>
              <a className="resource-email" href="mailto:ian@ianmcdonald.ai">ian@ianmcdonald.ai</a>
              <SocialLinks />
            </div>
            <ProjectInquiryForm />
          </section>
          <div
            className="y0 y8 y54 y22 y49"
            style={{
              borderTop: "1px solid #3A3734",
              paddingTop: "22px",
              gap: "12px 24px",
            }}
          >
            <span>
              {"Questions about this lesson? "}
              <a className="z6" href="mailto:ian@ianmcdonald.ai">
                {"ian@ianmcdonald.ai"}
              </a>
            </span>
            <Link className="z6" href="/learn">
              {"More lessons"}
            </Link>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
