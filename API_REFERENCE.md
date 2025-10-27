# API Reference - Replicate Video Models

Quick reference guide for developers using the Replicate video models integration.

## 📡 REST API Endpoints

### GET `/api/replicate/video-models`

Fetches all official Replicate AI video models.

**Request**
```bash
GET /api/replicate/video-models
```

**Response** (200 OK)
```json
{
  "success": true,
  "count": 6,
  "models": [
    {
      "id": "minimax/video-01",
      "owner": "minimax",
      "name": "video-01",
      "description": "Generate realistic videos from text or images",
      "url": "https://replicate.com/minimax/video-01",
      "coverImage": "https://replicate.delivery/...",
      "runCount": 123456,
      "githubUrl": null,
      "paperUrl": null,
      "licenseUrl": null,
      "defaultExample": {
        "id": "abc123",
        "model": "minimax/video-01",
        "version": "...",
        "input": {...},
        "output": "https://..."
      }
    }
  ]
}
```

**Error Response** (500)
```json
{
  "error": "Failed to fetch video models",
  "details": "Error message"
}
```

## 🪝 React Hooks

### `useVideoModels()`

Hook to fetch and manage video models state in React components.

**Import**
```typescript
import { useVideoModels } from '@/hooks/useVideoModels';
```

**Returns**
```typescript
{
  models: VideoModel[];      // Array of video models
  loading: boolean;          // Loading state
  error: string | null;      // Error message if any
  refetch: () => Promise<void>; // Function to refetch models
}
```

**Usage Example**
```typescript
const VideoModelsComponent = () => {
  const { models, loading, error, refetch } = useVideoModels();

  if (loading) {
    return <div>Loading models...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

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
};
```

## 🛠️ Utility Functions

### `fetchOfficialVideoModels(apiToken: string)`

Fetches all official video models from Replicate's API.

**Import**
```typescript
import { fetchOfficialVideoModels } from '@/lib/replicate-video-models';
```

**Parameters**
- `apiToken` (string): Your Replicate API token

**Returns**
```typescript
Promise<ReplicateModel[]>
```

**Usage Example**
```typescript
// Server-side only (API routes, server components)
const models = await fetchOfficialVideoModels(
  process.env.REPLICATE_API_TOKEN!
);

console.log(`Found ${models.length} video models`);
```

### `fetchModelDetails(owner: string, name: string, apiToken: string)`

Fetches detailed information about a specific model.

**Import**
```typescript
import { fetchModelDetails } from '@/lib/replicate-video-models';
```

**Parameters**
- `owner` (string): Model owner username
- `name` (string): Model name
- `apiToken` (string): Your Replicate API token

**Returns**
```typescript
Promise<ReplicateModel>
```

**Usage Example**
```typescript
const model = await fetchModelDetails(
  'minimax',
  'video-01',
  process.env.REPLICATE_API_TOKEN!
);

console.log(model.description);
console.log(model.runCount);
```

### `isVideoModel(model: ReplicateModel)`

Checks if a model is a video generation model by analyzing its schema.

**Import**
```typescript
import { isVideoModel } from '@/lib/replicate-video-models';
```

**Parameters**
- `model` (ReplicateModel): The model object to check

**Returns**
```typescript
boolean
```

**Usage Example**
```typescript
const model = await fetchModelDetails('owner', 'model', token);

if (isVideoModel(model)) {
  console.log('This model generates videos!');
} else {
  console.log('This model does not generate videos.');
}
```

### `isOfficialVideoModel(modelIdentifier: string)`

Checks if a model ID is in the official video models list.

**Import**
```typescript
import { isOfficialVideoModel } from '@/lib/replicate-video-models';
```

**Parameters**
- `modelIdentifier` (string): Model ID in format `owner/name`

**Returns**
```typescript
boolean
```

**Usage Example**
```typescript
if (isOfficialVideoModel('minimax/video-01')) {
  console.log('Official video model!');
}

if (isOfficialVideoModel('random/model')) {
  console.log('Not an official video model');
}
```

## 📦 Components

### `<VideoModelCard />`

Reusable component to display a single video model.

**Import**
```typescript
import { VideoModelCard } from '@/components/VideoModelCard';
```

**Props**
```typescript
interface VideoModelCardProps {
  id: string;
  owner: string;
  name: string;
  description: string;
  url: string;
  coverImage: string | null;
  runCount: number;
  githubUrl: string | null;
}
```

**Usage Example**
```typescript
const MyComponent = () => {
  const { models } = useVideoModels();

  return (
    <div className="grid grid-cols-3 gap-4">
      {models.map(model => (
        <VideoModelCard
          key={model.id}
          id={model.id}
          owner={model.owner}
          name={model.name}
          description={model.description}
          url={model.url}
          coverImage={model.coverImage}
          runCount={model.runCount}
          githubUrl={model.githubUrl}
        />
      ))}
    </div>
  );
};
```

## 📋 TypeScript Types

### `ReplicateModel`

Complete model object from Replicate's API.

```typescript
interface ReplicateModel {
  url: string;
  owner: string;
  name: string;
  description: string;
  visibility: string;
  github_url: string | null;
  paper_url: string | null;
  license_url: string | null;
  run_count: number;
  cover_image_url: string | null;
  default_example: {
    id: string;
    model: string;
    version: string;
    input: Record<string, any>;
    output: any;
  } | null;
  latest_version: {
    id: string;
    created_at: string;
    cog_version: string;
    openapi_schema: {
      components: {
        schemas: {
          Input: Record<string, any>;
          Output: Record<string, any>;
        };
      };
    };
  } | null;
}
```

### `VideoModel`

Simplified model object returned by the API and hook.

```typescript
interface VideoModel {
  id: string;
  owner: string;
  name: string;
  description: string;
  url: string;
  coverImage: string | null;
  runCount: number;
  githubUrl: string | null;
  paperUrl: string | null;
  licenseUrl: string | null;
}
```

## 🎯 Constants

### `OFFICIAL_VIDEO_MODELS`

Array of official video model identifiers.

**Import**
```typescript
import { OFFICIAL_VIDEO_MODELS } from '@/lib/replicate-video-models';
```

**Value**
```typescript
const OFFICIAL_VIDEO_MODELS = [
  'minimax/video-01',
  'luma/ray',
  'haiper-ai/haiper-video-2',
  'tencent/hunyuan-video',
  'bytedance/seedance-1-pro',
  'bytedance/seedance-1-lite',
] as const;
```

**Usage Example**
```typescript
console.log(`There are ${OFFICIAL_VIDEO_MODELS.length} official video models`);

OFFICIAL_VIDEO_MODELS.forEach(modelId => {
  console.log(`Model: ${modelId}`);
});
```

## 🔐 Environment Variables

### `REPLICATE_API_TOKEN`

Your Replicate API token. Required for all API calls.

**Setup**

Create `.env.local`:
```bash
REPLICATE_API_TOKEN=r8_your_token_here
```

**Usage in Code**
```typescript
// Server-side only (API routes, server components)
const token = process.env.REPLICATE_API_TOKEN;

if (!token) {
  throw new Error('REPLICATE_API_TOKEN is not set');
}
```

**Get Token**
1. Go to [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Create or copy your API token
3. Add to `.env.local`

## 📝 Usage Patterns

### Pattern 1: Client Component with Hook

```typescript
'use client';

import { useVideoModels } from '@/hooks/useVideoModels';
import { VideoModelCard } from '@/components/VideoModelCard';

export default function VideoModelsPage() {
  const { models, loading, error } = useVideoModels();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {models.map(model => (
        <VideoModelCard key={model.id} {...model} />
      ))}
    </div>
  );
}
```

### Pattern 2: Server Component with Direct Fetch

```typescript
import { fetchOfficialVideoModels } from '@/lib/replicate-video-models';

export default async function VideoModelsPage() {
  const models = await fetchOfficialVideoModels(
    process.env.REPLICATE_API_TOKEN!
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      {models.map(model => (
        <VideoModelCard
          key={model.owner + '/' + model.name}
          id={`${model.owner}/${model.name}`}
          {...model}
          coverImage={model.cover_image_url}
          runCount={model.run_count}
          githubUrl={model.github_url}
        />
      ))}
    </div>
  );
}
```

### Pattern 3: API Route Handler

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { fetchOfficialVideoModels } from '@/lib/replicate-video-models';

export async function GET(request: NextRequest) {
  try {
    const models = await fetchOfficialVideoModels(
      process.env.REPLICATE_API_TOKEN!
    );
    
    return NextResponse.json({ success: true, models });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
```

## 🔄 Common Use Cases

### Filter by Owner

```typescript
const { models } = useVideoModels();
const minimaxModels = models.filter(m => m.owner === 'minimax');
```

### Sort by Popularity

```typescript
const { models } = useVideoModels();
const sortedModels = [...models].sort((a, b) => b.runCount - a.runCount);
```

### Find Specific Model

```typescript
const { models } = useVideoModels();
const dreamMachine = models.find(m => m.id === 'luma/ray');
```

### Check if Model Exists

```typescript
import { isOfficialVideoModel } from '@/lib/replicate-video-models';

const modelId = 'minimax/video-01';
if (isOfficialVideoModel(modelId)) {
  console.log('This model is available!');
}
```

## 🐛 Error Handling

### Handle Missing API Token

```typescript
const token = process.env.REPLICATE_API_TOKEN;

if (!token) {
  throw new Error(
    'REPLICATE_API_TOKEN environment variable is not set. ' +
    'Get your token from https://replicate.com/account/api-tokens'
  );
}
```

### Handle Fetch Errors

```typescript
try {
  const models = await fetchOfficialVideoModels(token);
  console.log(`Fetched ${models.length} models`);
} catch (error) {
  console.error('Failed to fetch models:', error);
  // Fallback behavior
}
```

### Handle Hook Errors

```typescript
const { models, error, refetch } = useVideoModels();

if (error) {
  return (
    <div>
      <p>Error: {error}</p>
      <button onClick={refetch}>Try Again</button>
    </div>
  );
}
```

## 📚 Additional Resources

- [Replicate API Documentation](https://replicate.com/docs/reference/http)
- [Official Models Guide](https://replicate.com/docs/topics/models/official-models)
- [Official Models Collection](https://replicate.com/collections/official)
- [Setup Guide](./REPLICATE_SETUP.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)


