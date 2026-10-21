"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";
import styles from "./LeadFinderLesson.module.css";

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
        <Link href="/kits">← Workshop kits</Link>
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
                "I use Gemini to find opportunities, research who to contact, and build a simple lead tracker in Google Sheets. My example is speaking gigs. As you read, think about who you'd use it for."
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
          </div>
          <figure
            className="lesson-video y7"
            id="lesson-video"
            aria-labelledby="lesson-video-title"
            style={{ flex: "1 1 480px", margin: 0 }}
          >
            <div className="lesson-video-heading">
              <h2 className="y6 y4 y1" id="lesson-video-title">
                Watch the workflow
              </h2>
              <span>2 min 46 sec</span>
            </div>
            <video
              className="lesson-video-player"
              width="1920"
              height="1080"
              controls
              playsInline
              preload="none"
              poster="/workshop-kits/find-leads/lead-finder-walkthrough-v3.jpg"
              aria-label="Find leads with AI: Gemini and Google Sheets walkthrough"
              aria-describedby="lesson-video-description"
            >
              <source
                src="/workshop-kits/find-leads/lead-finder-walkthrough-v3.mp4"
                type="video/mp4"
              />
              <track
                src="/workshop-kits/find-leads/lead-finder-walkthrough-v3.vtt"
                kind="captions"
                srcLang="en"
                label="English"
              />
              <p>
                <a href="/workshop-kits/find-leads/lead-finder-walkthrough-v3.mp4">
                  Watch or download the lesson video
                </a>.
              </p>
            </video>
            <figcaption id="lesson-video-description">
              Follow the real Gemini and Sheets demo, then use the prompts below.
              Use full screen for a closer look and CC for captions.
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
            Gemini <span aria-hidden="true">→</span> Export to Sheets <span aria-hidden="true">→</span> Google Sheets
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
                    {"Teach AI what you do"}
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
                    {"Pick what you're searching for"}
                  </a>
                </li>
                <li className="z5">
                  <span className="z7">{"04"}</span>
                  <a className="z8" href="#step-4">
                    {"Research first, export once"}
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
              <h2 className="z12">{"Teach AI what you do"}</h2>
              <p className="z11">
                {
                  "Give Gemini context on your business: what you offer and who you help. Paste a short bio, or point it at files you've already connected. Everything after this gets better because of it."
                }
              </p>
              <div
                className="y40 y36"
                role="img"
                aria-label="Google Drive, Gmail, and your bio all feed into one profile Gemini builds: your background, speaking topics, and target audience."
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
                  {"Google Drive"}
                </div>
                <div
                  className="y2 y35 y63 y64 y25 y65 y0 y3 y20 y21 y24 y10 y66 y22 y1"
                  style={{ top: "92px" }}
                >
                  {"Gmail"}
                </div>
                <div
                  className="y2 y35 y63 y64 y25 y65 y0 y3 y20 y21 y24 y10 y66 y22 y1"
                  style={{ top: "184px" }}
                >
                  {"Your bio"}
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
                    {"Speaking topics"}
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
                  "Search my Google Drive and my Gmail for [YOUR NAME] to understand my background, speaking topics, and target audience."
                }
              </p>
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
                  "Tell it exactly what you're looking for, then make it explain why each result fits your business. If it can't explain the fit, it isn't a lead."
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
              <h2 className="z12">{"Pick what you're searching for"}</h2>
              <p className="z11">
                {
                  "I'm searching for speaking opportunities. The same prompt works for clients, referral partners, sponsors, or businesses that need your services. Give the AI a role and a specific ask."
                }
              </p>
            </div>
            <div className="z21">
              <div className="z16">
                <div className="z15">{"You type"}</div>
                <CopyButton promptId="prompt-2" />
              </div>
              <p className="y6 y28" id="prompt-2" style={{ lineHeight: "2.1" }}>
                <span
                  className={
                    "sg" +
                    (activePart === null
                      ? ""
                      : activePart === 1
                        ? " sg-on"
                        : " sg-off")
                  }
                  data-seg="1"
                >
                  <span className="z42" data-marker="1" aria-hidden="true">
                    {"1"}
                  </span>
                  <span className="z35">
                    {"Act as an expert lead generator."}
                  </span>
                </span>{" "}
                <span
                  className={
                    "sg" +
                    (activePart === null
                      ? ""
                      : activePart === 2
                        ? " sg-on-y"
                        : " sg-off")
                  }
                  data-seg="2"
                >
                  <span className="z45" data-marker="1" aria-hidden="true">
                    {"2"}
                  </span>
                  <span className="z49">
                    {"Find five upcoming business, tech, or AI summits"}
                  </span>
                </span>{" "}
                <span
                  className={
                    "sg" +
                    (activePart === null
                      ? ""
                      : activePart === 3
                        ? " sg-on"
                        : " sg-off")
                  }
                  data-seg="3"
                >
                  <span className="z42" data-marker="1" aria-hidden="true">
                    {"3"}
                  </span>
                  <span className="z35">{"in the [YOUR CITY] area"}</span>
                </span>{" "}
                <span
                  className={
                    "sg" +
                    (activePart === null
                      ? ""
                      : activePart === 4
                        ? " sg-on-y"
                        : " sg-off")
                  }
                  data-seg="4"
                >
                  <span className="z45" data-marker="1" aria-hidden="true">
                    {"4"}
                  </span>
                  <span className="z49">
                    {"happening in Q4 2026 or early 2027"}
                  </span>
                </span>{" "}
                <span
                  className={
                    "sg" +
                    (activePart === null
                      ? ""
                      : activePart === 5
                        ? " sg-on"
                        : " sg-off")
                  }
                  data-seg="5"
                >
                  <span className="z42" data-marker="1" aria-hidden="true">
                    {"5"}
                  </span>
                  <span className="z35">
                    {"where I could pitch my [YOUR OFFER]."}
                  </span>
                </span>{" "}
                <span
                  className={
                    "sg" +
                    (activePart === null
                      ? ""
                      : activePart === 6
                        ? " sg-on-y"
                        : " sg-off")
                  }
                  data-seg="6"
                >
                  <span className="z45" data-marker="1" aria-hidden="true">
                    {"6"}
                  </span>
                  <span className="z49">
                    {"Provide the event name, date, and why it's a good fit."}
                  </span>
                </span>
              </p>
              <div
                className="y33 y1 y49"
                style={{
                  marginTop: "8px",
                  paddingTop: "14px",
                  borderTop: "1px solid #3A3734",
                }}
              >
                {"Tap a part to see it in the prompt"}
              </div>
              <ol
                className="y6 y59 y50 y68"
                style={{
                  padding: "0",
                  listStyle: "none",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "4px 8px",
                  lineHeight: "1.45",
                }}
              >
                <li>
                  <button
                    type="button"
                    data-pick="1"
                    aria-pressed={activePart === 1}
                    className={"lg z14" + (activePart === 1 ? " lg-on" : "")}
                    onClick={() =>
                      setActivePart((current) => (current === 1 ? null : 1))
                    }
                  >
                    <b className="z44">{"1"}</b>
                    <span>
                      <b className="z6">{"Role."}</b>
                      {" Tells it how to think."}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    data-pick="2"
                    aria-pressed={activePart === 2}
                    className={"lg z14" + (activePart === 2 ? " lg-on" : "")}
                    onClick={() =>
                      setActivePart((current) => (current === 2 ? null : 2))
                    }
                  >
                    <b className="z41">{"2"}</b>
                    <span>
                      <b className="z6">{"Task and count."}</b>
                      {" What to find, and how many."}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    data-pick="3"
                    aria-pressed={activePart === 3}
                    className={"lg z14" + (activePart === 3 ? " lg-on" : "")}
                    onClick={() =>
                      setActivePart((current) => (current === 3 ? null : 3))
                    }
                  >
                    <b className="z44">{"3"}</b>
                    <span>
                      <b className="z6">{"Where."}</b>
                      {" Keeps results local."}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    data-pick="4"
                    aria-pressed={activePart === 4}
                    className={"lg z14" + (activePart === 4 ? " lg-on" : "")}
                    onClick={() =>
                      setActivePart((current) => (current === 4 ? null : 4))
                    }
                  >
                    <b className="z41">{"4"}</b>
                    <span>
                      <b className="z6">{"When."}</b>
                      {" Rules out stale events."}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    data-pick="5"
                    aria-pressed={activePart === 5}
                    className={"lg z14" + (activePart === 5 ? " lg-on" : "")}
                    onClick={() =>
                      setActivePart((current) => (current === 5 ? null : 5))
                    }
                  >
                    <b className="z44">{"5"}</b>
                    <span>
                      <b className="z6">{"Your offer."}</b>
                      {" So it judges fit against what you sell."}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    data-pick="6"
                    aria-pressed={activePart === 6}
                    className={"lg z14" + (activePart === 6 ? " lg-on" : "")}
                    onClick={() =>
                      setActivePart((current) => (current === 6 ? null : 6))
                    }
                  >
                    <b className="z41">{"6"}</b>
                    <span>
                      <b className="z6">{"Output."}</b>
                      {" What to hand back."}
                    </span>
                  </button>
                </li>
              </ol>
            </div>
          </section>
          <section className="z63" id="step-4">
            <div className="z9">{"04"}</div>
            <div className="z13">
              <div className="z4">
                <span className="z3">{"In Gemini"}</span>
              </div>
              <h2 className="z12">{"Research first, export once"}</h2>
              <p className="z11">
                {
                  "Before you build anything, get what you need to act: who to contact, how to reach them, and how to open the conversation. A list without names is just a list."
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
                  "Before we export this, find the email and phone number for each event organizer, or the speaker submission link, and add a suggested pitch strategy for each event."
                }
              </p>
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
                  {"The contact person is current"}
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
                  {"The fit still holds when you read it yourself"}
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
                    {"Ready to reach out."}
                  </b>
                  {" Every detail checks out."}
                </span>
              </div>
            </fieldset>
            <div
              className="y7 y0 y5 y53"
              style={{ flex: "1 1 100%", paddingTop: "16px" }}
            >
              <div className="z58">{"What a miss looks like"}</div>
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
                    {"3. "}
                    <b>{"[EVENT NAME]"}</b>
                    <br />
                    {"Date: "}
                    <span className="z43">{"November 12"}</span>
                    <br />
                    {"Location: [CITY] convention center"}
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
                  {"Doesn't match"}
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
                      {"[event website]"}
                    </span>
                  </div>
                  <div
                    className="y0 y5"
                    style={{ padding: "20px 22px", gap: "6px" }}
                  >
                    <div className="z58">{"[EVENT NAME]"}</div>
                    <div className="z57">
                      {"Date: "}
                      <span
                        className="y29 y51 y9"
                        style={{
                          display: "inline-block",
                          border: "2px solid #E2202A",
                          padding: "0 10px",
                        }}
                      >
                        {"November 19"}
                      </span>
                    </div>
                    <div className="z57">
                      {"Location: [CITY] convention center"}
                    </div>
                  </div>
                </div>
              </div>
              <p className="y6 y22 y49">
                {
                  "Example only. The event moved a week, and Gemini had the old date. Pitch from the AI's answer and you'd look like you didn't do your homework."
                }
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
                <span className="z3">{"Export to Sheets"}</span>
              </div>
              <h2 className="z12">{"Give every lead a next step"}</h2>
              <p className="z11">
                {
                  "Pull it all into one table with contact details, a status, and a next action. Then click Export to Sheets under the table. That turns a list into a little CRM you can actually follow up from."
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
                  "Great. Now put all of this finalized data (event names, dates, contact info, and pitch strategies) into one table I can use as my lead tracker. Add a Status column and a Next action column."
                }
              </p>
            </div>
          </section>
          <section className="z20" id="step-7">
            <div className="z9">{"07"}</div>
            <div className="z13">
              <div className="z4">
                <span className="z3">{"In Gemini"}</span>
                <span className="z3">{"Then Google Sheets"}</span>
              </div>
              <h2 className="z12">{"Make it easy to use"}</h2>
              <p className="z11">
                {
                  "The data's all there. It's just not pretty. Ask Gemini exactly what to fix, then make the changes yourself in Sheets. It takes a few minutes, and clear headings and readable columns make it something you'll open again."
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
                  "I have a lead tracker in Google Sheets with these columns: event, date, location, contact, email or phone, why it fits, pitch angle, apply link, status, and next action. Give me step-by-step instructions to make it easier to read, including frozen bold headers, wrapped text, alternating row colors, and a dropdown for status."
                }
              </p>
            </div>
            <div
              className="y7 y0 y8 y55"
              style={{ flex: "1 1 100%", paddingTop: "8px" }}
            >
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
                          {"[A LONG SENTENCE THAT GETS CUT OFF HALFWAY]"}
                        </td>
                        <td className="z1">{"verify"}</td>
                      </tr>
                      <tr>
                        <td className="z26">{"3"}</td>
                        <td className="z1">{"[EVENT NAME]"}</td>
                        <td className="z1">{"[DATE]"}</td>
                        <td className="z1">
                          {"[A LONG SENTENCE THAT GETS CUT OFF HALFWAY]"}
                        </td>
                        <td className="z1">{"pitched"}</td>
                      </tr>
                      <tr>
                        <td className="z26">{"4"}</td>
                        <td className="z1">{"[EVENT NAME]"}</td>
                        <td className="z1">{"[DATE]"}</td>
                        <td className="z1">
                          {"[A LONG SENTENCE THAT GETS CUT OFF HALFWAY]"}
                        </td>
                        <td className="z1">{"booked"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="z53">
                <div className="y4 y60 y29 y51">
                  {"After a few minutes of formatting"}
                </div>
                <div className="y71 y10 y32" style={{ borderRadius: "12px" }}>
                  <table
                    className="y72 y41 y33"
                    style={{ minWidth: "440px", lineHeight: "1.45" }}
                  >
                    <thead>
                      <tr className="y23 y26" style={{ textAlign: "left" }}>
                        <th className="z27" scope="col">
                          {"Event"}
                        </th>
                        <th className="z27" scope="col">
                          {"Date"}
                        </th>
                        <th className="z27" scope="col">
                          {"Why it fits"}
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
                          {"[A LONG SENTENCE THAT NOW WRAPS AND READS IN FULL]"}
                        </td>
                        <td className="z39">
                          <span
                            className="y51 y9 y73 y1"
                            style={{ background: "#FBE3DF" }}
                          >
                            {"Verify"}
                          </span>
                        </td>
                      </tr>
                      <tr style={{ background: "#FAF7F3" }}>
                        <td className="z46">{"[EVENT NAME]"}</td>
                        <td className="z48">{"[DATE]"}</td>
                        <td className="z40">
                          {"[A LONG SENTENCE THAT NOW WRAPS AND READS IN FULL]"}
                        </td>
                        <td className="z39">
                          <span
                            className="y9 y73 y1"
                            style={{ background: "#FDF3C4", color: "#5C4A05" }}
                          >
                            {"Pitched"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="z46">{"[EVENT NAME]"}</td>
                        <td className="z48">{"[DATE]"}</td>
                        <td className="z40">
                          {"[A LONG SENTENCE THAT NOW WRAPS AND READS IN FULL]"}
                        </td>
                        <td className="z39">
                          <span className="y23 y26 y9 y73 y1">{"Booked"}</span>
                        </td>
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
                  "Same method, your offer and your audience. Swap two things in the prompts and the whole workflow is yours."
                }
              </p>
            </div>
            <div className="y67 y7 y0 y5 y34">
              <div className="z50">
                <span className="z59">{"Business and tech summits"}</span>
                <span className="z43">{"[YOUR IDEAL LEAD]"}</span>
              </div>
              <div className="z50">
                <span className="z59">{"My live demo and AI workshops"}</span>
                <span className="z43">{"[YOUR OFFER]"}</span>
              </div>
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
                  "These are the columns my sheet ended with. Status and next action matter most. Without them, it's a spreadsheet you forget about."
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
                  minWidth: "1000px",
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
                    <td className="z0">
                      <span
                        className="tk-pill y51 y9 y75 y1"
                        style={{
                          background: "#FBE3DF",
                          animationDelay: "760ms",
                        }}
                      >
                        {"Verify"}
                      </span>
                    </td>
                    <td className="z2">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "860ms" }}
                      >
                        {"Confirm date on the event site"}
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
                    <td className="z0">
                      <span
                        className="tk-pill y9 y75 y1"
                        style={{
                          background: "#FDF3C4",
                          color: "#5C4A05",
                          animationDelay: "1410ms",
                        }}
                      >
                        {"Pitched"}
                      </span>
                    </td>
                    <td className="z2">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "1510ms" }}
                      >
                        {"Follow up in 7 days"}
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
                    <td className="z0">
                      <span
                        className="tk-pill y23 y26 y9 y75 y1"
                        style={{ animationDelay: "2060ms" }}
                      >
                        {"Booked"}
                      </span>
                    </td>
                    <td className="z2">
                      <span
                        className="tk-c"
                        style={{ animationDelay: "2160ms" }}
                      >
                        {"Send talk outline"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section
          className="y12 y13"
          id="sneak-peek"
          style={{ padding: "0 24px 88px" }}
        >
          <div
            className="y24 y10 y30 y0 y5 y55"
            style={{ padding: "clamp(24px, 4vw, 48px)" }}
          >
            <div className="z4">
              <span
                className="y11 y9 y69 y33 y29"
                style={{ background: "#F5D23D" }}
              >
                {"Sneak peek"}
              </span>
            </div>
            <h2
              className="y6 y4 y1 y74 y43 y37"
              style={{ fontSize: "clamp(30px, 3.8vw, 44px)", maxWidth: "22ch" }}
            >
              {"From a tracker row to a booked call"}
            </h2>
            <p className="z62">
              {
                "Once your tracker is in place, the same Gemini conversation can take a lead the rest of the way. This is the more advanced version I use, with Gmail, Drive, and Calendar connected to Gemini. It all starts with the foundation above."
              }
            </p>
            <div className="y0 y8 y34">
              <div className="z34">
                <div className="z24">{"1"}</div>
                <div className="z22">{"Paste one lead"}</div>
                <div className="z10">{"A verified row from your tracker."}</div>
              </div>
              <svg
                className="z37"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="#96141A"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M7 4 L13 10 L7 16"></path>
              </svg>
              <div className="z34">
                <div className="z24">{"2"}</div>
                <div className="z22">{"Gemini drafts the pitch"}</div>
                <div className="z10">
                  {"Using your bio in Drive and the pitch angle."}
                </div>
              </div>
              <svg
                className="z37"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="#96141A"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M7 4 L13 10 L7 16"></path>
              </svg>
              <div className="z34">
                <div className="z24">{"3"}</div>
                <div className="z22">{"You review in Gmail"}</div>
                <div className="z10">
                  {"Nothing sends until you approve it."}
                </div>
              </div>
              <svg
                className="z37"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="#96141A"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M7 4 L13 10 L7 16"></path>
              </svg>
              <div className="z34">
                <div className="z24">{"4"}</div>
                <div className="z22">{"Hold time on Calendar"}</div>
                <div className="z10">
                  {"Gemini suggests open slots for the call."}
                </div>
              </div>
            </div>
            <div
              className="y23 y26 y27 y0 y5 y39"
              style={{ padding: "22px 24px" }}
            >
              <div className="z16">
                <div className="z15">{"You type"}</div>
                <CopyButton promptId="prompt-6" />
              </div>
              <p className="z19" id="prompt-6">
                {
                  "Here's the next lead from my tracker: [PASTE THE ROW]. Using my bio in Drive and the pitch angle, draft a short email to the organizer in Gmail. Check my Calendar for two open 30-minute slots next week and suggest them in the email. Don't send anything. I'll review it first."
                }
              </p>
            </div>
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
              <div className="y0 y8 y28 y1" style={{ gap: "10px 20px" }}>
                <a href="mailto:ian@ianmcdonald.ai">{"ian@ianmcdonald.ai"}</a>
                <a href="https://ianmcdonald.ai">{"ianmcdonald.ai"}</a>
                <a href="https://www.youtube.com/@IansDisruptivSolutions">
                  {"YouTube"}
                </a>
                <a href="https://www.instagram.com/disruptiv.solutions/">
                  {"Instagram"}
                </a>
                <a href="https://www.tiktok.com/@ianmcmonster">{"TikTok"}</a>
                <a href="https://www.facebook.com/ian.mcmonster/">
                  {"Facebook"}
                </a>
              </div>
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
            <Link className="z6" href="/kits">
              {"More workshop kits"}
            </Link>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
