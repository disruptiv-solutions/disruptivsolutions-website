# disruptivsolutions-website

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🎥 Replicate Video Models Integration

This project includes a complete implementation for fetching and displaying **Replicate's official AI video models**. Official models are production-ready, always-on, and have stable APIs.

### Quick Setup

1. **Get your Replicate API token** from [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)

2. **Create `.env.local` file** in the project root:
```bash
REPLICATE_API_TOKEN=r8_your_token_here
```

3. **Run the development server**:
```bash
npm run dev
```

4. **View the video models** at [http://localhost:3000/video-models](http://localhost:3000/video-models)

### Features

✨ **Official Video Models Only** - Curated list of Replicate's production-ready video AI models
- minimax/video-01 (Hailuo)
- luma/ray (Dream Machine)
- haiper-ai/haiper-video-2
- tencent/hunyuan-video
- bytedance/seedance-1-pro & seedance-1-lite

📦 **Complete API Integration**
- REST API endpoint: `/api/replicate/video-models`
- React hook: `useVideoModels()`
- Utility functions in `src/lib/replicate-video-models.ts`

🎨 **Beautiful UI**
- Responsive grid layout
- Dark mode support
- Loading and error states
- Model cards with cover images and stats

📚 **Full Documentation** - See [REPLICATE_SETUP.md](./REPLICATE_SETUP.md) for detailed documentation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
