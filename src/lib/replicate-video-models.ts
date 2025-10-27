/**
 * Utility functions for fetching and filtering Replicate's official video models
 */

export interface ReplicateModel {
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
    input: Record<string, unknown>;
    output: unknown;
  } | null;
  latest_version: {
    id: string;
    created_at: string;
    cog_version: string;
    openapi_schema: {
      components: {
        schemas: {
          Input: Record<string, unknown>;
          Output: Record<string, unknown>;
        };
      };
    };
  } | null;
}

/**
 * List of known official video model identifiers
 * These are maintained by Replicate and guaranteed to be always-on with stable APIs
 */
export const OFFICIAL_VIDEO_MODELS = [
  'minimax/video-01',           // Hailuo - Realistic video generation
  'luma/ray',                   // Dream Machine - Fast text/image to video
  'haiper-ai/haiper-video-2',   // Haiper - Multi-aspect ratio videos
  'tencent/hunyuan-video',      // Hunyuan - Open-source video generation
  'bytedance/seedance-1-pro',   // SeedDance Pro - Professional video generation
  'bytedance/seedance-1-lite',  // SeedDance Lite - Faster video generation
] as const;

/**
 * Checks if a model's output schema indicates video generation
 */
export const isVideoModel = (model: ReplicateModel): boolean => {
  if (!model.latest_version?.openapi_schema) {
    return false;
  }

  const outputSchema = model.latest_version.openapi_schema.components?.schemas?.Output;
  
  if (!outputSchema) {
    return false;
  }

  // Check if output contains video-related fields
  const schemaString = JSON.stringify(outputSchema).toLowerCase();
  
  return (
    schemaString.includes('video') ||
    schemaString.includes('.mp4') ||
    schemaString.includes('video/') ||
    schemaString.includes('motion') ||
    schemaString.includes('frames') ||
    (model.description?.toLowerCase().includes('video') ?? false) ||
    (model.description?.toLowerCase().includes('text-to-video') ?? false) ||
    (model.description?.toLowerCase().includes('image-to-video') ?? false)
  );
};

/**
 * Checks if a model is in the official video models list
 */
export const isOfficialVideoModel = (modelIdentifier: string): boolean => {
  return (OFFICIAL_VIDEO_MODELS as readonly string[]).includes(modelIdentifier);
};

/**
 * Fetches model details from Replicate API
 */
export const fetchModelDetails = async (
  owner: string,
  name: string,
  apiToken: string
): Promise<ReplicateModel> => {
  const response = await fetch(
    `https://api.replicate.com/v1/models/${owner}/${name}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch model ${owner}/${name}: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetches all official video models from Replicate
 */
export const fetchOfficialVideoModels = async (
  apiToken: string
): Promise<ReplicateModel[]> => {
  const models = await Promise.all(
    OFFICIAL_VIDEO_MODELS.map(async (modelId) => {
      const [owner, name] = modelId.split('/');
      try {
        return await fetchModelDetails(owner, name, apiToken);
      } catch (error) {
        console.error(`Failed to fetch ${modelId}:`, error);
        return null;
      }
    })
  );

  return models.filter((model): model is ReplicateModel => model !== null);
};

/**
 * Fetches models from a specific collection
 * Note: This requires web scraping or the Replicate SDK as the REST API doesn't have a direct collections endpoint
 */
export const fetchCollectionModels = async (
  _collectionSlug: string,
  _apiToken: string
): Promise<string[]> => {
  // The Replicate API doesn't expose a direct collections endpoint via REST
  // You would need to use the replicate package or scrape the web page
  // For now, we'll use the known official video models list
  return OFFICIAL_VIDEO_MODELS as unknown as string[];
};

