# Design, theme, and typography

This document describes how visual design is applied across the site, with emphasis on the **LaunchBox platform update** experience (`/launchbox-weekly/*`), which uses a dedicated brand kit. The rest of the marketing site follows a separate, darker “Ian McDonald / Disruptiv” direction.

---

## 1. Site-wide (default marketing site)

**Role:** Homepage, resources, daily briefs, newsletter directory (except where noted), admin, etc.

| Aspect | Choice |
|--------|--------|
| **Mood** | Dark, high-contrast, editorial / product hybrid |
| **Background** | Near-black (`#0a0a0a` via CSS `--background`) |
| **Foreground** | Light gray text (`#ededed`) |
| **Accent** | Red / amber system (`--primary-red`, `--primary-yellow`, `--accent-red`) — used in gradients, CTAs, highlights |
| **Body font** | **Montserrat** (Google Fonts, variable `--font-montserrat`) |
| **Heading font** | **Rosario** (Google Fonts, variable `--font-rosario`) |
| **Satoshi** | Loaded globally (Fontshare) for LaunchBox sections and utilities; class `.font-satoshi` forces Satoshi with cascade overrides |

**Files:** `src/app/layout.tsx` (font variables), `src/app/globals.css` (`:root`, `@theme inline`, `body`, default `h1–h6`).

**Navigation & footer:** Fixed dark nav and site footer wrap most routes. They are **hidden** on `/launchbox-weekly` so the light LaunchBox theme is not framed by black chrome.

---

## 2. LaunchBox platform updates only (`/launchbox-weekly/*`)

This is the **only** newsletter-style surface that uses the full LaunchBox product palette and light “Cloud White” world. Daily briefs (`/brief/*`) and long-form issues (`/newsletter/*`) remain on the dark site theme.

### 2.1 Brand direction (product kit)

| Token | Hex | Role |
|-------|-----|------|
| **Signal Orange** | `#F3701E` | Primary emphasis: CTAs, badges, highlight rail, section labels, selection tint |
| **Cloud White** | `#F7F2EC` | Page background; airy, premium base |
| **Launch Blue** | `#4B607F` | Structure: nav text, body copy on light, footer band, subtle tints |
| **Tan Relay** | `#E8D8C9` | Warmth: borders, dashed “callout” borders, dividers, soft separation |
| **Ink** | `#2A3442` | Headings and strong body on Cloud White (contrast without pure black) |

**Source of truth in code:** `src/lib/launchbox-brand.ts` (`LAUNCHBOX_BRAND`).

**CSS variables (scoped):** `.launchbox-weekly-theme` in `src/app/globals.css` mirrors the same hex values as `--lb-*` for use in plain CSS.

### 2.2 Typography

| Role | Typeface | Notes |
|------|----------|--------|
| **Primary** | **Satoshi** | Headings and paragraphs inside `.launchbox-weekly-theme`; weights 400–900 from Fontshare (see root `layout.tsx` link + `globals.css` import). |
| **Secondary / accents** | **Avenir Next Arabic** → **Avenir Next** → system stack | Applied via class `.font-lb-secondary` for small caps labels (e.g. week line, “THIS WEEK”, “What this means for you” label). Licensed fonts are **not** bundled; if absent, the stack falls back to Helvetica Neue / system UI. |

**Rules we follow:**

- Orange + white lead first impression; blue structures the page; tan is **sparing** (borders, callouts).
- Avoid generic gray-on-gray SaaS panels; prefer white cards on Cloud White with Tan borders.
- Text alignment for this route is **left-aligned** (theme + layout set `text-left`).

### 2.3 Layout & shell

- **Parent layout:** `src/app/launchbox-weekly/layout.tsx` wraps children with `launchbox-weekly-theme` and selection colors (orange tint / ink text).
- **Date layout:** `src/app/launchbox-weekly/[date]/layout.tsx` — metadata and `themeColor: #F7F2EC` for mobile browser chrome.
- **Page:** `src/app/launchbox-weekly/[date]/page.tsx` implements:
  - Sticky top bar: Cloud White + blur, Tan bottom border, orange dot + LaunchBox wordmark, Launch Blue “Archive” link.
  - Hero: week label (secondary font), “Platform update” pill (white + Tan border + orange type), ink title, blue intro, orange primary button.
  - **This week:** White cards, Tan border, orange vertical rail, ink headlines, blue body.
  - **“What this means for you”** (when present in data): dashed Tan border, light blue wash, orange label, ink copy — layman outcome block per highlight.
  - Sidebar (lg+): soft Launch Blue tint panel, Tan border; author + promo cards on white.
  - Footer: solid Launch Blue band, Cloud/off-white text, orange subscribe CTA, Tan-bordered secondary card.

### 2.4 Content model (for writers / generators)

Weekly docs are generated and stored in Firestore; the public API sanitizes fields. Each **highlight** includes:

- `headline` — scannable title  
- `blurb` — what changed (plain language)  
- `whatItMeansForYou` — short “so what?” for the reader in **you**-voice  

Generation logic and prompts live in `src/lib/launchbox-weekly-generation.ts`.

---

## 3. Quick file map

| Concern | Location |
|---------|----------|
| LaunchBox color constants | `src/lib/launchbox-brand.ts` |
| Scoped LaunchBox weekly CSS | `src/app/globals.css` (`.launchbox-weekly-theme`, `.font-lb-secondary`) |
| LaunchBox weekly layouts + page | `src/app/launchbox-weekly/` |
| Hide global nav/footer on weekly route | `src/components/NavigationWrapper.tsx`, `src/components/Footer.tsx` |
| Global site tokens & fonts | `src/app/globals.css`, `src/app/layout.tsx` |

---

## 4. Extending the system

- **New LaunchBox-branded surfaces:** Prefer importing `LAUNCHBOX_BRAND` and wrapping in a scoped class similar to `launchbox-weekly-theme`, or extend that class name pattern to avoid bleeding styles into the dark site.
- **Avenir Next Arabic:** To guarantee the secondary face, add a licensed webfont (Adobe Fonts, self-hosted `@font-face`) and restrict it to `.font-lb-secondary` or `.launchbox-weekly-theme` only.
- **Do not** apply `.launchbox-weekly-theme` at the root `layout` unless the entire product is moving to this light system.

---

*Last updated to match the codebase structure and LaunchBox weekly reader implementation.*
