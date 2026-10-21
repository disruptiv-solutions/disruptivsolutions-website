# Find leads with AI workshop kit

- Public lesson: `https://www.ianmcdonald.ai/learn/find-leads`
- Listing: `https://www.ianmcdonald.ai/learn`
- Discovery: **Learn** in the site navigation → **Find leads with AI**.
- `/lead-finder` permanently redirects to `/learn/find-leads`.

The lesson uses the main site's navigation, footer, Rosario/Montserrat fonts, and analytics. The listing comes from `src/lib/workshop-kits.ts`. Its CSS Module scopes the migrated lesson styles so they cannot restyle other pages.

The complete reviewed lesson is included: the v3 narrated browser walkthrough, English captions, the Gemini and Sheets tool cards, eight steps, six copyable prompts, the interactive prompt breakdown, the verification checklist, and the tracker animation. The preview of Drive, Gmail, and Calendar remains clearly separated from the basic Gemini-to-Sheets workflow.

Media lives under `public/workshop-kits/find-leads/`. The MP4 is approximately 24 MB and plays on demand (`preload="none"`); no external video service or new environment variables are needed. `ASSET-SOURCES.md` records the Google icon sources. The original lesson ZIP was not modified.

## Local review

Run `npm ci`, then `npm run dev`. Open `http://localhost:3002/learn/find-leads` and `http://localhost:3002/learn`. Use a separate checkout for production builds while a development server is running, because both use `.next`.

## Vercel

This is part of the existing `disruptivsolutions-website` repository and its existing Vercel deployments. No new Vercel project or domain is required. Review the branch preview, then merge to `main` to trigger the configured production deployment. After deployment, verify both public routes, the `/lead-finder` redirect, video playback, and the copy buttons.

Validation: `npm run build`, targeted ESLint, `npx tsc --noEmit`, and `node --test tests/*.test.mjs`. Browser review covers the desktop and phone layouts, Learn navigation, copy buttons, prompt selection, verification checkboxes, and MP4 playback.
