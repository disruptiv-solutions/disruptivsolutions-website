# Replicate Official Video Models Integration

This implementation fetches **only Replicate's official AI video models** using their REST API.

## 🎯 What Are Official Models?

Official models on Replicate are:
- ✅ Always-on (no cold starts)
- ✅ Stable API (no version pinning required)
- ✅ Predictably priced
- ✅ Actively maintained by Replicate

## 📹 Official Video Models Included

The implementation currently fetches these official video generation models:

1. **minimax/video-01** (Hailuo)
   - Generates realistic 5-second 720p videos
   - Supports text-to-video and image-to-video

2. **luma/ray** (Dream Machine)
   - Fast video generation (~40 seconds)
   - Supports start/end frames, interpolation, and loops

3. **haiper-ai/haiper-video-2**
   - 4-6 second 720p videos
   - Multiple aspect ratios

4. **tencent/hunyuan-video**
   - Open-source video generation
   - Configurable resolution and duration

5. **bytedance/seedance-1-pro** & **seedance-1-lite**
   - Professional and faster variants
   - High-quality video generation

## 🚀 Setup Instructions

### 1. Get Your API Token

1. Go to [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Create or copy your API token

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
REPLICATE_API_TOKEN=r8_your_token_here
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. View the Video Models

Navigate to: [http://localhost:3000/video-models](http://localhost:3000/video-models)

## 📁 File Structure

```
src/
├── lib/
│   └── replicate-video-models.ts    # Core utility functions
├── app/
│   ├── api/
│   │   └── replicate/
│   │       └── video-models/
│   │           └── route.ts         # API endpoint
│   └── video-models/
│       └── page.tsx                 # UI page to display models
```

## 🔧 API Usage

### Fetch All Official Video Models

```typescript
// GET /api/replicate/video-models
const response = await fetch('/api/replicate/video-models');
const data = await response.json();

console.log(data.models); // Array of official video models
```

### Response Format

```json
{
  "success": true,
  "count": 6,
  "models": [
    {
      "id": "minimax/video-01",
      "owner": "minimax",
      "name": "video-01",
      "description": "...",
      "url": "https://replicate.com/minimax/video-01",
      "coverImage": "https://...",
      "runCount": 123456,
      "githubUrl": null,
      "paperUrl": null,
      "licenseUrl": null,
      "defaultExample": {...}
    }
  ]
}
```

## 🛠️ Utility Functions

### `fetchOfficialVideoModels(apiToken: string)`

Fetches all official video models from Replicate's API.

```typescript
import { fetchOfficialVideoModels } from '@/lib/replicate-video-models';

const models = await fetchOfficialVideoModels(process.env.REPLICATE_API_TOKEN!);
```

### `fetchModelDetails(owner: string, name: string, apiToken: string)`

Fetches detailed information about a specific model.

```typescript
import { fetchModelDetails } from '@/lib/replicate-video-models';

const model = await fetchModelDetails('minimax', 'video-01', apiToken);
```

### `isVideoModel(model: ReplicateModel)`

Checks if a model is a video generation model by analyzing its schema.

```typescript
import { isVideoModel } from '@/lib/replicate-video-models';

if (isVideoModel(model)) {
  console.log('This is a video model!');
}
```

### `isOfficialVideoModel(modelIdentifier: string)`

Checks if a model ID is in the official video models list.

```typescript
import { isOfficialVideoModel } from '@/lib/replicate-video-models';

if (isOfficialVideoModel('minimax/video-01')) {
  console.log('Official video model!');
}
```

## 🎨 UI Features

The `/video-models` page includes:
- ✨ Beautiful grid layout with cards
- 🖼️ Model cover images
- 📊 Run count statistics
- 🔗 Direct links to model pages and GitHub repos
- 🌓 Dark mode support
- ⚡ Loading and error states
- 📱 Responsive design

## 🔍 How It Works

1. **Model List**: We maintain a curated list of official video models (`OFFICIAL_VIDEO_MODELS`)
2. **API Fetch**: The API route fetches details for each model using Replicate's REST API
3. **Filtering**: Models are verified to be video-generation models
4. **Display**: The UI page presents the models in an attractive grid layout

## 📚 Additional Resources

- [Replicate Official Models Documentation](https://replicate.com/docs/topics/models/official-models)
- [Replicate API Reference](https://replicate.com/docs/reference/http)
- [Official Models Collection](https://replicate.com/collections/official)

## 🔄 Updating the Model List

To add new official video models, update the `OFFICIAL_VIDEO_MODELS` array in `src/lib/replicate-video-models.ts`:

```typescript
export const OFFICIAL_VIDEO_MODELS = [
  'minimax/video-01',
  'luma/ray',
  'haiper-ai/haiper-video-2',
  'tencent/hunyuan-video',
  'bytedance/seedance-1-pro',
  'bytedance/seedance-1-lite',
  'new-owner/new-video-model', // Add new models here
] as const;
```

## 🐛 Troubleshooting

### "REPLICATE_API_TOKEN environment variable is not set"

Make sure you've created a `.env.local` file with your token:

```bash
REPLICATE_API_TOKEN=r8_your_actual_token
```

### "Failed to fetch model"

- Check your API token is valid
- Verify the model ID is correct
- Ensure you have internet connectivity

### Models not showing

- Check the browser console for errors
- Verify the API route is accessible at `/api/replicate/video-models`
- Check that the models are still available on Replicate


