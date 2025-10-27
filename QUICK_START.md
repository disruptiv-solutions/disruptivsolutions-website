# ⚡ Quick Start Guide - Replicate Video Models

Get up and running with Replicate's official AI video models in 3 minutes.

## 🚀 Setup (3 steps)

### 1. Get Your API Token
Visit [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) and copy your token.

### 2. Configure Environment
Create `.env.local` in the project root:
```bash
REPLICATE_API_TOKEN=r8_your_token_here
```

### 3. Run the App
```bash
npm run dev
```

## 🎬 View Video Models
Open [http://localhost:3000/video-models](http://localhost:3000/video-models)

## 📝 Usage Examples

### Example 1: Using the Hook (Client Component)
```typescript
'use client';

import { useVideoModels } from '@/hooks/useVideoModels';

export default function MyPage() {
  const { models, loading, error } = useVideoModels();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {models.map(model => (
        <div key={model.id}>
          <h3>{model.name}</h3>
          <p>{model.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Using the API Endpoint
```typescript
// Fetch from your frontend
const response = await fetch('/api/replicate/video-models');
const data = await response.json();

console.log(data.models); // Array of video models
```

### Example 3: Server-Side Usage
```typescript
import { fetchOfficialVideoModels } from '@/lib/replicate-video-models';

// In a server component or API route
const models = await fetchOfficialVideoModels(
  process.env.REPLICATE_API_TOKEN!
);
```

## 🎥 Available Official Video Models

1. **minimax/video-01** (Hailuo)
   - Realistic 5-second 720p videos
   - Text-to-video & image-to-video

2. **luma/ray** (Dream Machine)
   - Fast generation (~40 seconds)
   - Creative output with controls

3. **haiper-ai/haiper-video-2**
   - 4-6 second videos
   - Multiple aspect ratios

4. **tencent/hunyuan-video**
   - Open-source model
   - Configurable parameters

5. **bytedance/seedance-1-pro**
   - Professional quality
   - High-resolution output

6. **bytedance/seedance-1-lite**
   - Faster generation
   - Good quality-speed balance

## 📚 More Resources

- 📖 [Full Setup Guide](./REPLICATE_SETUP.md)
- 🔧 [API Reference](./API_REFERENCE.md)
- 💡 [Implementation Details](./IMPLEMENTATION_SUMMARY.md)

## 🆘 Troubleshooting

**Problem**: "REPLICATE_API_TOKEN environment variable is not set"
- **Solution**: Create `.env.local` file with your token

**Problem**: Models not loading
- **Solution**: Check browser console for errors, verify API token is valid

**Problem**: TypeScript errors
- **Solution**: Run `npm install` to ensure all dependencies are installed

## 🎉 That's It!

You're now ready to use Replicate's official AI video models in your application!

For more detailed information, check out the other documentation files:
- [REPLICATE_SETUP.md](./REPLICATE_SETUP.md) - Comprehensive setup guide
- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API documentation
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details


