# Overview

This is a Next.js-based personal portfolio and business website for Ian McDonald (Disruptiv Solutions LLC). The site showcases AI products, consulting services, and the LaunchBox platform. It features scroll-based animations, 3D effects, and integrates with Replicate's AI video model API.

The primary purpose is to:
- Present Ian's story and work in AI product development
- Promote LaunchBox (a platform for non-technical builders to create AI apps)
- Offer consulting services
- Demonstrate integration with Replicate's video generation models

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: Next.js 15.5.4 with App Router
- Server and client components pattern
- TypeScript for type safety
- React 19.1.0

**Styling**: Tailwind CSS v4
- Custom CSS variables for theming (red/yellow brand colors)
- Dark-mode-first design
- Custom animations and gradients

**Animation Libraries**:
- **Framer Motion** (v12.23.24): Component-level animations, AnimatePresence for transitions
- **GSAP** (v3.13.0): Scroll-triggered animations via ScrollTrigger plugin
- **OGL** (v1.0.11): WebGL-based light ray effects

**Component Patterns**:
- Scroll-snap sections for full-viewport experiences
- Intersection Observer for video playback control
- Custom hooks for data fetching (`useVideoModels`)
- Refs and effect hooks for DOM manipulation with GSAP/OGL

**Key Architectural Decisions**:
- Snap scrolling for immersive single-page experience (trade-off: less traditional navigation, better storytelling)
- Mix of server and client components (server for static content, client for interactivity)
- Custom scroll progress calculations for parallax and reveal effects
- Reusable component library (ScrollReveal, RotatingText, LightRays)

## Backend Architecture

**API Routes**: Next.js API routes (`/api/*`)
- RESTful endpoint structure
- Server-side API token handling for security

**Data Flow**:
1. Client components use custom hooks (`useVideoModels`)
2. Hooks call Next.js API routes
3. API routes interact with external services (Replicate)
4. Responses formatted and returned to client

**Environment Configuration**:
- `.env.local` for sensitive tokens (REPLICATE_API_TOKEN)
- Token kept server-side only for security

## Data Storage

**Current State**: No persistent database
- All data is either static (component content) or fetched from external APIs
- No user data storage or authentication system implemented

**Future Consideration**: The codebase structure suggests Drizzle ORM may be added later if database needs arise (forms, waitlists, user accounts).

## Authentication & Authorization

**Current State**: No authentication implemented
- Public-facing portfolio site
- No protected routes or user sessions
- API tokens stored server-side only

# External Dependencies

## Third-Party APIs

**Replicate AI Platform**
- **Purpose**: Fetch official video generation models and their metadata
- **API Endpoint Used**: `https://api.replicate.com/v1/models/{owner}/{model}`
- **Authentication**: API token via `REPLICATE_API_TOKEN` environment variable
- **Models Retrieved**: 
  - minimax/video-01 (Hailuo)
  - luma/ray (Dream Machine)
  - haiper-ai/haiper-video-2
  - tencent/hunyuan-video
  - bytedance/seedance-1-pro
  - bytedance/seedance-1-lite
- **Integration Points**:
  - `/api/replicate/video-models` - Server-side proxy endpoint
  - `src/lib/replicate-video-models.ts` - Utility functions
  - `src/hooks/useVideoModels.ts` - React hook for client components
  - `replicate` npm package (v1.3.0)

## Key Dependencies

**Core Framework**:
- `next` (15.5.4) - React framework with App Router
- `react` (19.1.0) & `react-dom` (19.1.0)

**Animation & Graphics**:
- `framer-motion` (12.23.24) - Component animations
- `gsap` (3.13.0) - Scroll-based animations
- `ogl` (1.0.11) - WebGL rendering for light effects

**External Services**:
- `replicate` (1.3.0) - Official Replicate API client

**Styling**:
- `tailwindcss` (4.x) - Utility-first CSS
- `@tailwindcss/postcss` (4.x) - PostCSS integration

**Development**:
- `typescript` (5.x) - Type safety
- `eslint` (9.x) & `eslint-config-next` - Code quality
- Custom fonts: Inter (body), Rosario (headings) via next/font/google

## Hosting & Deployment

**Development Server**: Configured to run on port 5000 with 0.0.0.0 binding
- `npm run dev` - Development mode
- `npm run build` - Production build
- `npm start` - Production server

**Static Assets**: 
- Images stored in `/public` directory
- Logo files: logo-launchbox.png, logo-realai.png, logo-chattercard.png
- Profile images: ian-stage.jpg