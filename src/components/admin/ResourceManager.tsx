'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ResourceSection {
  heading?: string;
  text?: string;
  items?: string[];
  code?: string;
  note?: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'prompts' | 'tool' | 'guide' | 'video';
  icon: string;
  imageUrl?: string;
  imagePrompt?: string;
  content: {
    sections: ResourceSection[];
  };
  lastUpdated?: string;
  createdAt?: string;
  published: boolean;
}

const typeLabels = {
  article: 'Article',
  prompts: 'Prompts',
  tool: 'Tool',
  guide: 'Guide',
  video: 'Video',
};

export const ResourceManager: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'article' as Resource['type'],
    icon: '📄',
    imageUrl: '',
    imagePrompt: '',
    published: false,
    content: {
      sections: [] as ResourceSection[],
    },
  });

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
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      content: {
        sections: [...formData.content.sections, {}],
      },
    });
  };

  const handleSectionChange = (index: number, field: keyof ResourceSection, value: string | string[]) => {
    const newSections = [...formData.content.sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      content: { sections: newSections },
    });
  };

  const handleRemoveSection = (index: number) => {
    const newSections = formData.content.sections.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      content: { sections: newSections },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingResource) {
        // Update existing resource
        const response = await fetch(`/api/resources/${editingResource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            userId: user?.uid,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to update resource');
        }
      } else {
        // Create new resource
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            userId: user?.uid,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to create resource');
        }
      }

      // Reset form and refresh list
      resetForm();
      fetchResources();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      icon: resource.icon,
      imageUrl: resource.imageUrl || '',
      imagePrompt: resource.imagePrompt || '',
      published: resource.published,
      content: resource.content,
    });
    setShowAddForm(true);
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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'article',
      icon: '📄',
      published: false,
      content: { sections: [] },
    });
    setEditingResource(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Resource Management</h2>
          <p className="text-gray-400">Manage all resources available on the site</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/40"
        >
          + Add Resource
        </button>
      </div>

      {error && (
        <div className="bg-red-600/20 border border-red-500/50 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-red-600 focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Resource['type'] })}
                  required
                  className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:ring-red-600 focus:border-red-600"
                >
                  {Object.keys(typeLabels).map((type) => (
                    <option key={type} value={type}>
                      {typeLabels[type as keyof typeof typeLabels]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📄"
                  className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-red-600 focus:border-red-600"
                />
              </div>

              <div className="flex items-center gap-4 pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-red-600 bg-zinc-800 border-gray-700 rounded focus:ring-red-600"
                  />
                  <span className="text-white font-semibold">Published</span>
                </label>
              </div>
            </div>

            {/* Content Sections */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-white">
                  Content Sections
                </label>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-4 py-2 bg-zinc-800 border border-gray-700 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  + Add Section
                </button>
              </div>

              <div className="space-y-4">
                {formData.content.sections.map((section, index) => (
                  <div key={index} className="bg-zinc-800 border border-gray-700 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">Section {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Heading</label>
                      <input
                        type="text"
                        value={section.heading || ''}
                        onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                        placeholder="Section heading"
                        className="w-full px-3 py-2 bg-zinc-900 border border-gray-600 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Text</label>
                      <textarea
                        value={section.text || ''}
                        onChange={(e) => handleSectionChange(index, 'text', e.target.value)}
                        placeholder="Paragraph text"
                        rows={3}
                        className="w-full px-3 py-2 bg-zinc-900 border border-gray-600 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Items (one per line)</label>
                      <textarea
                        value={section.items?.join('\n') || ''}
                        onChange={(e) => handleSectionChange(index, 'items', e.target.value.split('\n').filter(Boolean))}
                        placeholder="Item 1&#10;Item 2&#10;Item 3"
                        rows={4}
                        className="w-full px-3 py-2 bg-zinc-900 border border-gray-600 rounded text-white text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Code</label>
                      <textarea
                        value={section.code || ''}
                        onChange={(e) => handleSectionChange(index, 'code', e.target.value)}
                        placeholder="Code block content"
                        rows={4}
                        className="w-full px-3 py-2 bg-zinc-900 border border-gray-600 rounded text-white text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Note</label>
                      <input
                        type="text"
                        value={section.note || ''}
                        onChange={(e) => handleSectionChange(index, 'note', e.target.value)}
                        placeholder="Note text"
                        className="w-full px-3 py-2 bg-zinc-900 border border-gray-600 rounded text-white text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
              >
                {editingResource ? 'Update Resource' : 'Create Resource'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-zinc-800 border border-gray-700 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resources List */}
      <div className="space-y-4">
        {resources.length === 0 ? (
          <div className="bg-zinc-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-400">No resources yet. Create your first resource!</p>
          </div>
        ) : (
          resources.map((resource) => (
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
                  <button
                    onClick={() => window.open(`/resources/${resource.id}`, '_blank')}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-all"
                    title="Preview how this resource looks to users"
                  >
                    Preview
                  </button>
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
                    onClick={() => handleEdit(resource)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Edit
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
          ))
        )}
      </div>
    </div>
  );
};

