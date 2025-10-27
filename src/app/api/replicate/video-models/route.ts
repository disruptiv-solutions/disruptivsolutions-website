import { NextRequest, NextResponse } from 'next/server';
import { fetchOfficialVideoModels } from '@/lib/replicate-video-models';

/**
 * API Route: GET /api/replicate/video-models
 * Fetches Replicate's official video generation models
 */
export const GET = async (_request: NextRequest) => {
  try {
    const apiToken = process.env.REPLICATE_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        { error: 'REPLICATE_API_TOKEN environment variable is not set' },
        { status: 500 }
      );
    }

    const models = await fetchOfficialVideoModels(apiToken);

    return NextResponse.json({
      success: true,
      count: models.length,
      models: models.map((model) => ({
        id: `${model.owner}/${model.name}`,
        owner: model.owner,
        name: model.name,
        description: model.description,
        url: model.url,
        coverImage: model.cover_image_url,
        runCount: model.run_count,
        githubUrl: model.github_url,
        paperUrl: model.paper_url,
        licenseUrl: model.license_url,
        defaultExample: model.default_example,
      })),
    });
  } catch (error) {
    console.error('Error fetching video models:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch video models',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};

