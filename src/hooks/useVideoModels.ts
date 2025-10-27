'use client';

import { useState, useEffect } from 'react';

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

interface UseVideoModelsReturn {
  models: VideoModel[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch Replicate's official video models
 * 
 * @example
 * ```tsx
 * const { models, loading, error, refetch } = useVideoModels();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * 
 * return (
 *   <div>
 *     {models.map(model => (
 *       <div key={model.id}>{model.name}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useVideoModels = (): UseVideoModelsReturn => {
  const [models, setModels] = useState<VideoModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/replicate/video-models');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch models');
      }

      setModels(data.models);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return {
    models,
    loading,
    error,
    refetch: fetchModels,
  };
};


