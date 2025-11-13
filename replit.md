# Overview

This is a Next.js-based personal portfolio and business website for Ian McDonald / Disruptiv Solutions LLC. The site showcases Ian's journey from struggling entrepreneur to AI product builder, featuring consulting services, the Launchbox training platform, and a portfolio of AI projects. The site includes an integration with Replicate's API to showcase official AI video generation models.

**Primary Purpose**: Personal brand + consulting services + Launchbox product marketing + portfolio showcase

**Key Features**:
- Scroll-based narrative storytelling with snap sections
- Replicate AI video models integration (fetch and display official models)
- Consulting booking system (20-min free, 90-min paid)
- Launchbox product marketing with waitlist/class signup
- Interactive portfolio carousel
- Custom animations using GSAP and Framer Motion

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: Next.js 15.5.4 with App Router
- Server and client components mixed architecture
- TypeScript for type safety
- React 19 for UI rendering

**Styling**: Tailwind CSS v4 with custom theme
- CSS variables for brand colors (red #ef4444, yellow #fbbf24)
- Custom fonts: Inter (body), Rosario (headings)
- Dark mode as default theme
- Custom animations and gradient utilities

**Animation Libraries**:
- **GSAP** with ScrollTrigger plugin for scroll-based animations
- **Framer Motion** for component-level animations and transitions
- **OGL (WebGL library)** for custom light ray effects
- Scroll-snapping navigation with smooth scrolling

**Component Architecture**:
- Section-based layout with snap scrolling (Hero, WhoThisIsFor, ImageSection, Consulting, Launchbox, Portfolio)
- Reusable components: Navigation, Footer, ScrollReveal, RotatingText, LightRays
- Custom hooks pattern for data fetching (`useVideoModels`)
- Ref-based scroll progress tracking for parallax and animation effects

**State Management**: React hooks (useState, useEffect, useRef)
- Local component state for forms and UI interactions
- No global state management library (unnecessary for current scope)

## Backend Architecture

**API Routes**: Next.js API routes (App Router pattern)
- `/api/replicate/video-models` - Server-side proxy for Replicate API

**Rationale**: Server-side API routes keep sensitive API tokens secure and prevent CORS issues. The backend acts as a proxy layer between the client and third-party services.

**Pros**:
- API tokens never exposed to client
- Can add caching/rate limiting easily
- Consistent error handling

**Cons**:
- Adds server load for data fetching
- Slightly increased latency vs direct client calls

## Data Storage Solutions

**Current State**: No database implementation
- Environment variables for configuration (`.env.local`)
- Static content served from Next.js app

**Consulting/Waitlist Forms**: Currently client-side only (no persistence shown in code)
- Forms collect data but implementation for submission is incomplete
- **Future consideration**: Would need database (likely Firebase/Firestore based on portfolio projects) or email service integration

**Alternative Considered**: Could use serverless functions with database for form submissions, but not currently implemented.

## Authentication & Authorization

**Current State**: No authentication system implemented
- Public website with no user accounts
- API token authentication only for server-to-Replicate communication

**API Security**: Replicate API token stored in environment variables (`REPLICATE_API_TOKEN`)
- Server-side only access pattern
- Never exposed to client

## External Dependencies

### Third-Party Services

**Replicate API** (Primary Integration)
- **Purpose**: Fetch official AI video generation models
- **Authentication**: API token (server-side)
- **Endpoint Used**: REST API for models collection
- **Models Fetched**: minimax/video-01, luma/ray, haiper-ai/haiper-video-2, tencent/hunyuan-video, bytedance/seedance-1-pro, bytedance/seedance-1-lite
- **Rate Limiting**: Not implemented (consider adding)

### NPM Packages

**Core Framework**:
- `next@15.5.4` - React framework with App Router
- `react@19.1.0` & `react-dom@19.1.0` - UI library

**Animation**:
- `gsap@3.13.0` - Scroll animations and timeline control
- `framer-motion@12.23.24` - Component animations and transitions
- `ogl@1.0.11` - WebGL for custom light ray effects

**API Client**:
- `replicate@1.3.0` - Official Replicate API client (though REST API used directly in implementation)

**Styling**:
- `tailwindcss@4` - Utility-first CSS framework
- `@tailwindcss/postcss@4` - PostCSS integration

**Development**:
- `typescript@5` - Type checking
- `eslint@9` with `eslint-config-next` - Code linting

### Asset Dependencies

**Fonts**: Google Fonts (Inter, Rosario) loaded via next/font
**Images**: Local static assets in `/public` directory
- Logo files (logo-launchbox.png, logo-realai.png, logo-chattercard.png)
- ian-stage.jpg for ImageSection component

### Future Database Consideration

Based on portfolio mentions (Real AI uses Firebase/Firestore), future database integration would likely use:
- **Firebase/Firestore** for forms, user data, waitlist management
- **Rationale**: Matches existing expertise, serverless, real-time capabilities
- Not currently implemented in this codebase