'use client';

import React, { useState, useEffect } from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'ad-landing' | 'blog' | 'prompts' | 'tool' | 'guide' | 'video';
  icon: string;
  imageUrl?: string;
  published: boolean;
}

const typeLabels = {
  article: 'Article',
  'ad-landing': 'Ad / Landing Page',
  blog: 'Blog Post',
  prompts: 'Prompts',
  tool: 'Tool',
  guide: 'Guide',
  video: 'Video',
};

export default function ResourceManagementPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resources');
      const data = await response.json();
      if (data.success) {
        setResources(data.resources || []);
      } else {
        setError('Failed to load resources');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (resource: Resource) => {
    try {
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          published: !resource.published,
          userId: user?.uid,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to update resource');
      }

      fetchResources();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update resource';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const response = await fetch(`/api/resources/${id}?userId=${user?.uid}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete resource');
      }

      fetchResources();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete resource';
      setError(errorMessage);
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Resource Management
                </h1>
                <p className="text-gray-400">
                  Create, edit, and manage all resources
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-zinc-900 border border-gray-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  ← Dashboard
                </Link>
                <Link
                  href="/admin/resource-management/new"
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/40"
                >
                  + New Resource
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-500/50 rounded-xl p-4 text-red-400 mb-6">
              {error}
            </div>
          )}

          {/* Resources List */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-400">Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="bg-zinc-900 border border-gray-800 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">No resources yet.</p>
              <Link
                href="/admin/resource-management/new"
                className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
              >
                Create Your First Resource
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-zinc-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{resource.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">{resource.title}</h3>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                              resource.published
                                ? 'bg-green-600/20 text-green-400 border border-green-600/50'
                                : 'bg-gray-600/20 text-gray-400 border border-gray-600/50'
                            }`}>
                              {resource.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">
                              {typeLabels[resource.type]}
                            </span>
                            <span className="text-xs text-gray-500">
                              ID: {resource.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/resource-management/${resource.id}`}
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-all"
                      >
                        Edit & Preview
                      </Link>
                      <button
                        onClick={() => togglePublished(resource)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                          resource.published
                            ? 'bg-gray-600 text-white hover:bg-gray-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {resource.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}

