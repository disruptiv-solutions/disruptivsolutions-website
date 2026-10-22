# Find leads with AI workshop kit

- Public lesson: `https://www.ianmcdonald.ai/learn/find-leads`
- Listing: `https://www.ianmcdonald.ai/learn`
- Discovery: **Learn** in the site navigation → **Find leads with AI**.
- `/lead-finder` permanently redirects to `/learn/find-leads`.

The lesson uses the main site's navigation, footer, Rosario/Montserrat fonts, and analytics. The listing comes from `src/lib/workshop-kits.ts`. Its CSS Module scopes the migrated lesson styles so they cannot restyle other pages.

The written resource follows the October 22, 2026 Cue workshop, revision 12: website-first context, four customizable search fields, official-source research, a native Sheet created through Gemini's Google Drive connection, formatting with Gemini inside Sheets, and the draft-only email bonus. The prepared workshop example also uses Workspace context; Workspace is optional for learners. Never link to Ian's private Gemini history, Sheet, or presenter view from this public resource.

The retained v4 narrated browser walkthrough (2 min 56 sec) and English captions are labeled as an earlier short walkthrough. That video uses an earlier short-bio/search/export sequence and is not a recording of the revised live presentation. Current instructions and copyable prompts are below it. The old Gmail/Calendar booked-call preview has been replaced with the current outreach bonus, including a chat fallback when Gmail draft creation is unavailable and a clearly labeled illustrative message.

Learners use `@Google Drive` to request the tracker and open the created-file card. Export to Sheets or copying a returned table is a fallback when file creation is unavailable. Step 7 uses the sheet's top-right Gemini sparkle and the tested formatting prompt. The October 22 Workspace example displayed a plan and Approve before applying changes; other versions can apply directly or use an Apply control. Learners review rows, data, and links afterward. The lesson notes account eligibility and keeps the tracker usable when the assistant is unavailable.

The contact sections show `ian@ianmcdonald.ai` and invite help with AI training, workflows, automation, and social media content. Labeled social links come from `src/lib/ian-social-links.ts`, the same verified profile map used by the site footer. Do not restore the older hardcoded handles.

The top contact block links directly to the optional project inquiry form at `#project-inquiry`. It collects a name, email, one of the four service interests, and an optional project note. Submissions use `/api/project-inquiry` and the site's existing Resend notification configuration; the notification includes the resource-page source and uses the visitor's email as Reply-To. This form does not enroll visitors in a mailing list or gate the lesson. It records a `generate_lead` analytics event only after the API confirms notification acceptance, with `form_name=project_inquiry`, `form_location=find_leads`, and the selected interest; no contact details or message text are included in analytics.

The tested formatting prompt is: “Give this tracker a clean, polished look: dark blue headers, subtle alternating rows, wrapped text, and readable column widths. Keep all data and links unchanged.”

Media lives under `public/workshop-kits/find-leads/`. The active files are `lead-finder-walkthrough-v4.mp4`, `lead-finder-walkthrough-v4.vtt`, and `lead-finder-walkthrough-v4.jpg`. The MP4 plays on demand (`preload="none"`); no external video service or new environment variables are needed. `ASSET-SOURCES.md` records the Google icon sources. The original lesson ZIP was not modified. This page has no chapter jump controls or downloadable SRT/source ZIP links.

## Local review

Run `npm ci`, then `npm run dev`. Open `http://localhost:3002/learn/find-leads` and `http://localhost:3002/learn`. Use a separate checkout for production builds while a development server is running, because both use `.next`.

## Vercel

This is part of the existing `disruptivsolutions-website` repository and its existing Vercel deployments. No new Vercel project or domain is required. Review the branch preview, then merge to `main` to trigger the configured production deployment. After deployment, verify both public routes, the `/lead-finder` redirect, video playback, and the copy buttons.

Validation: `npm run build`, targeted ESLint, `npx tsc --noEmit`, and `node --test tests/*.test.mjs`. Browser review covers the desktop and phone layouts, Learn navigation, copy buttons, prompt selection, verification checkboxes, and MP4 playback.
