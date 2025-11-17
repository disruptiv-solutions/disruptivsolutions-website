'use client';

import React, { useState, useEffect } from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  type: 'article' | 'ad-landing' | 'blog' | 'prompts' | 'tool' | 'guide' | 'video';
  icon: string;
  imageUrl?: string;
  imagePrompt?: string;
  tldr?: string;
  content: {
    sections: ResourceSection[];
  };
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

type ResourceType = 'article' | 'ad-landing' | 'blog' | 'prompts' | 'tool' | 'guide' | 'video';

export default function ResourceEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  const { user } = useAuth();
  
  const [, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [contentGenerated, setContentGenerated] = useState(false);
  
  // Initial form state for new resources
  const [initialForm, setInitialForm] = useState({
    resourceType: 'article' as ResourceType,
    includeWebResearch: false,
    deepResearch: false,
    topic: '',
    length: 50, // Default to medium length (50% = ~4000 tokens)
    createImage: false,
  });
  
  const [formData, setFormData] = useState<Omit<Resource, 'id'>>({
    title: '',
    description: '',
    type: 'article' as Resource['type'],
    icon: '📄',
    imageUrl: '',
    imagePrompt: '',
    tldr: '',
    published: false,
    content: {
      sections: [] as ResourceSection[],
    },
  });

  useEffect(() => {
    if (!isNew && id) {
      fetchResource(id);
    }
  }, [id, isNew]);

  const fetchResource = async (resourceId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resources/${resourceId}`);
      const data = await response.json();
      
      if (data.success && data.resource) {
        setResource(data.resource);
        setFormData({
          title: data.resource.title,
          description: data.resource.description,
          type: data.resource.type,
          icon: data.resource.icon,
          imageUrl: data.resource.imageUrl || '',
          imagePrompt: data.resource.imagePrompt || '',
          tldr: data.resource.tldr || '',
          published: data.resource.published,
          content: data.resource.content,
        });
      } else {
        setError('Resource not found');
      }
    } catch (error) {
      console.error('Error fetching resource:', error);
      setError('Failed to load resource');
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

  const generateImageFromContent = async (summary: {
    title: string;
    description: string;
    type: Resource['type'];
    content: Resource['content'];
  }): Promise<boolean> => {
    try {
      setGeneratingImage(true);
      const response = await fetch('/api/ai/generate-resource-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.imageUrl,
        imagePrompt: data.imagePrompt || '',
      }));
      return true;
    } catch (error: unknown) {
      console.error('Error generating image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
      setError(errorMessage);
      return false;
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleManualImageGeneration = async () => {
    if (!formData.title || formData.content.sections.length === 0) {
      setError('Please generate content before creating an image.');
      return;
    }

    await generateImageFromContent({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      content: formData.content,
    });
  };

  const handleGenerateWithAI = async () => {
    // Validate required fields
    if (!initialForm.topic.trim()) {
      setError('Please enter what you want the AI to write about');
      return;
    }

    try {
      setGeneratingAI(true);
      setError(null);

      const response = await fetch('/api/ai/generate-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType: initialForm.resourceType,
          topic: initialForm.topic,
          includeWebResearch: initialForm.includeWebResearch,
          deepResearch: initialForm.deepResearch,
          length: initialForm.length,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        const errorMsg = data.error || 'Failed to generate content';
        if (errorMsg.includes('API key')) {
          throw new Error('OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your .env.local file.');
        }
        throw new Error(errorMsg);
      }

      // Populate form with AI-generated content
      setFormData({
        title: data.title,
        description: data.description,
        type: initialForm.resourceType,
        icon: data.icon || '📄',
        imageUrl: '',
        imagePrompt: '',
        tldr: data.tldr || '',
        published: false,
        content: data.content,
      });

      setContentGenerated(true);

      if (initialForm.createImage) {
        const imageSuccess = await generateImageFromContent({
          title: data.title,
          description: data.description,
          type: initialForm.resourceType,
          content: data.content,
        });
        
        if (!imageSuccess) {
          // Image generation failed, but content was successfully generated
          // Update error message to clarify that content is ready
          setError((prevError) => {
            const baseMessage = prevError || 'Image generation failed';
            return `Content generated successfully! However, ${baseMessage.toLowerCase()}. You can generate the image manually using the "Generate Image" button.`;
          });
        }
      }
    } catch (error: unknown) {
      console.error('Error generating content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content with AI. Make sure OPENROUTER_API_KEY is set in .env.local';
      setError(errorMessage);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (isNew) {
        // Create new resource
        const payload = {
          ...formData,
          userId: user?.uid,
        };
        
        // Debug: Log what we're sending
        console.log('[Resource Save] Sending payload:', {
          title: payload.title,
          description: payload.description,
          type: payload.type,
          icon: payload.icon,
          contentSectionsCount: payload.content?.sections?.length || 0,
          published: payload.published,
        });
        
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        
        if (!response.ok) {
          const errorMsg = data.error || `Failed to create resource (${response.status})`;
          const missingFields = data.missingFields ? ` Missing: ${data.missingFields.join(', ')}` : '';
          throw new Error(errorMsg + missingFields);
        }
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to create resource');
        }
        
        // Redirect to edit page with new ID
        router.push(`/admin/resource-management/${data.resource.id}`);
      } else {
        // Update existing resource
        const payload = {
          ...formData,
          userId: user?.uid,
        };
        
        const response = await fetch(`/api/resources/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        
        if (!response.ok) {
          const errorMsg = data.error || `Failed to update resource (${response.status})`;
          const missingFields = data.missingFields ? ` Missing: ${data.missingFields.join(', ')}` : '';
          throw new Error(errorMsg + missingFields);
        }
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to update resource');
        }
        
        // Refresh resource data
        fetchResource(id);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-gray-400">Loading resource...</div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {isNew ? 'Create New Resource' : 'Edit Resource'}
                </h1>
                <p className="text-gray-400">
                  {isNew ? 'Fill in the form below to create a new resource' : 'Edit the resource details and preview'}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/admin/resource-management"
                  className="px-4 py-2 bg-zinc-900 border border-gray-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  ← Back to List
                </Link>
                {!isNew && (
                  <button
                    onClick={() => window.open(`/resources/${id}`, '_blank')}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-all"
                  >
                    Preview in New Tab
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-500/50 rounded-xl p-4 text-red-400 mb-6">
              {error}
            </div>
          )}

          {/* Initial Form for New Resources */}
          {isNew && !contentGenerated && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-zinc-900 border border-gray-800 rounded-xl p-8 md:p-12 space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Create Resource with AI
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Tell us what you want to create, and AI will generate it for you
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleGenerateWithAI(); }} className="space-y-6">
                  {/* Resource Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-4">
                      What type of resource do you want to create? *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {(['article', 'ad-landing', 'blog', 'prompts', 'tool', 'guide', 'video'] as ResourceType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setInitialForm({ ...initialForm, resourceType: type })}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            initialForm.resourceType === type
                              ? 'border-red-600 bg-red-600/20'
                              : 'border-gray-700 bg-zinc-800 hover:border-gray-600'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type === 'article' ? '📄' : type === 'ad-landing' ? '📢' : type === 'blog' ? '✍️' : type === 'prompts' ? '✨' : type === 'tool' ? '🛠️' : type === 'guide' ? '📚' : '🎥'}</div>
                          <div className="text-white font-semibold text-sm">
                            {typeLabels[type]}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Web Research Options */}
                  <div className="bg-zinc-800 border border-gray-700 rounded-xl p-6 space-y-4">
                    <label className="block text-sm font-semibold text-white mb-2">
                      Research Options
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={initialForm.includeWebResearch}
                          onChange={(e) => {
                            setInitialForm({
                              ...initialForm,
                              includeWebResearch: e.target.checked,
                              deepResearch: e.target.checked ? initialForm.deepResearch : false,
                            });
                          }}
                          className="w-5 h-5 text-red-600 bg-zinc-900 border-gray-700 rounded focus:ring-red-600"
                        />
                        <div>
                          <span className="text-white font-semibold">Include Web Research</span>
                          <p className="text-gray-400 text-sm">AI will search the web for current information on your topic</p>
                        </div>
                      </label>
                      
                      {initialForm.includeWebResearch && (
                        <label className="flex items-center gap-3 cursor-pointer ml-8">
                          <input
                            type="checkbox"
                            checked={initialForm.deepResearch}
                            onChange={(e) => setInitialForm({ ...initialForm, deepResearch: e.target.checked })}
                            className="w-5 h-5 text-red-600 bg-zinc-900 border-gray-700 rounded focus:ring-red-600"
                          />
                          <div>
                            <span className="text-white font-semibold">Deep Research</span>
                            <p className="text-gray-400 text-sm">Conduct more thorough research with multiple sources</p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Image Generation Option */}
                  <div className="bg-zinc-800 border border-gray-700 rounded-xl p-6 space-y-3">
                    <label className="block text-sm font-semibold text-white mb-2">
                      Featured Image
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={initialForm.createImage}
                        onChange={(e) => setInitialForm({ ...initialForm, createImage: e.target.checked })}
                        className="w-5 h-5 text-red-600 bg-zinc-900 border-gray-700 rounded focus:ring-red-600 mt-1"
                      />
                      <div>
                        <span className="text-white font-semibold block">Generate hero image with AI</span>
                        <p className="text-gray-400 text-sm">
                          Automatically creates an optimized image prompt and generates a GPT-Image-1 Mini featured image for this resource.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Topic Input */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      What do you want the AI to write about? *
                    </label>
                    <textarea
                      value={initialForm.topic}
                      onChange={(e) => setInitialForm({ ...initialForm, topic: e.target.value })}
                      placeholder="e.g., 'How to build AI-powered applications without coding experience' or 'Best practices for creating landing pages that convert'"
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-red-600 focus:border-red-600 text-lg"
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      Be specific about what you want. The more details you provide, the better the AI can generate content.
                    </p>
                  </div>

                  {/* Length Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-white">
                        Content Length
                      </label>
                      <span className="text-sm text-gray-400">
                        {initialForm.length <= 10 
                          ? 'Very Short (~200-500 words)' 
                          : initialForm.length <= 25 
                          ? 'Short (~500-1,000 words)' 
                          : initialForm.length <= 50 
                          ? 'Medium (~1,000-2,000 words)' 
                          : initialForm.length <= 75 
                          ? 'Long (~2,000-4,000 words)' 
                          : 'Very Long (~4,000+ words)'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={initialForm.length}
                      onChange={(e) => setInitialForm({ ...initialForm, length: parseInt(e.target.value) })}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                      style={{
                        background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${initialForm.length}%, #27272a ${initialForm.length}%, #27272a 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Brief</span>
                      <span>Comprehensive</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      {initialForm.length <= 10 
                        ? 'Brief overview with 2-3 sections' 
                        : initialForm.length <= 25 
                        ? 'Quick read with 3-5 sections' 
                        : initialForm.length <= 50 
                        ? 'Standard length with 5-8 sections' 
                        : initialForm.length <= 75 
                        ? 'Detailed content with 8-12 sections' 
                        : 'Extensive content with 12+ sections'}
                    </p>
                  </div>

                  {/* Generate Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={generatingAI || !initialForm.topic.trim()}
                      className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-purple-600/40"
                    >
                      {generatingAI ? (
                        <>
                          <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>
                            {initialForm.includeWebResearch 
                              ? initialForm.deepResearch 
                                ? 'Conducting deep research and generating content...' 
                                : 'Researching and generating content...'
                              : 'Generating content...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl">✨</span>
                          <span>Generate Content with AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Full Editor (shown after content is generated or when editing existing) */}
          {(contentGenerated || !isNew) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    TL;DR (Too Long; Didn't Read)
                  </label>
                  <textarea
                    value={formData.tldr || ''}
                    onChange={(e) => setFormData({ ...formData, tldr: e.target.value })}
                    placeholder="A concise 2-3 sentence summary of the key takeaways..."
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-red-600 focus:border-red-600"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Optional: A quick summary that appears beneath the hero image on the resource page.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Featured Image */}
                <div className="border border-gray-800 rounded-xl p-4 bg-zinc-900/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-semibold text-white">
                        Featured Image
                      </label>
                      <p className="text-xs text-gray-400">
                        Optional hero image displayed on the public resource page.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleManualImageGeneration}
                      disabled={generatingImage || formData.content.sections.length === 0}
                      className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingImage ? 'Generating Image...' : 'Generate Image'}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-red-600 focus:border-red-600"
                  />

                  {formData.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-800">
                      <img
                        src={formData.imageUrl}
                        alt="Resource featured"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {formData.imagePrompt && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Image Prompt</p>
                      <textarea
                        value={formData.imagePrompt}
                        readOnly
                        rows={3}
                        className="w-full px-3 py-2 bg-zinc-900 border border-gray-800 rounded text-gray-300 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* AI Generation Banner */}
                {formData.content.sections.length === 0 && (
                  <div className="bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent border border-purple-500/30 rounded-xl p-6 mb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">✨</span>
                          <h3 className="text-lg font-bold text-white">Generate Content with AI</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                          Fill in the title and description above, then click below to automatically generate well-structured content sections.
                        </p>
                        <button
                          type="button"
                          onClick={handleGenerateWithAI}
                          disabled={generatingAI || !formData.title || !formData.description}
                          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {generatingAI ? (
                            <>
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <span>🤖</span>
                              <span>Generate Content with AI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Sections */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-white">
                      Content Sections
                      {formData.content.sections.length > 0 && (
                        <span className="ml-2 text-xs text-gray-400">
                          ({formData.content.sections.length} {formData.content.sections.length === 1 ? 'section' : 'sections'})
                        </span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      {formData.content.sections.length > 0 && (
                        <button
                          type="button"
                          onClick={handleGenerateWithAI}
                          disabled={generatingAI || !formData.title || !formData.description}
                          className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          title="Regenerate content with AI"
                        >
                          {generatingAI ? (
                            <>
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <span>✨</span>
                              <span>Regenerate with AI</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleAddSection}
                        className="px-4 py-2 bg-zinc-800 border border-gray-700 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors"
                      >
                        + Add Section
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {formData.content.sections.map((section, index) => (
                      <div key={index} className="bg-zinc-800 border border-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-semibold text-sm">Section {index + 1}</span>
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
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-900 border border-gray-600 rounded text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Items (one per line)</label>
                          <textarea
                            value={section.items?.join('\n') || ''}
                            onChange={(e) => handleSectionChange(index, 'items', e.target.value.split('\n').filter(Boolean))}
                            placeholder="Item 1&#10;Item 2"
                            rows={3}
                            className="w-full px-3 py-2 bg-zinc-900 border border-gray-600 rounded text-white text-sm font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Code</label>
                          <textarea
                            value={section.code || ''}
                            onChange={(e) => handleSectionChange(index, 'code', e.target.value)}
                            placeholder="Code block content"
                            rows={3}
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

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : isNew ? 'Create Resource' : 'Save Changes'}
                  </button>
                  <Link
                    href="/admin/resource-management"
                    className="px-6 py-3 bg-zinc-800 border border-gray-700 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>

            {/* Right: Preview */}
            <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">
              <div className="sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">Live Preview</h2>
                <div className="bg-black border border-gray-700 rounded-lg p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Preview Content */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{formData.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-zinc-800 border border-gray-700 rounded-full text-xs font-semibold text-gray-400">
                            {typeLabels[formData.type]}
                          </span>
                          {!formData.published && (
                            <span className="px-2 py-1 bg-yellow-600/20 border border-yellow-600/50 rounded-full text-xs font-semibold text-yellow-400">
                              Draft
                            </span>
                          )}
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                          {formData.title || 'Resource Title'}
                        </h1>
                        <p className="text-gray-400">
                          {formData.description || 'Resource description will appear here...'}
                        </p>
                      </div>
                    </div>

                    {/* Content Sections */}
                    {formData.content.sections.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p>Add sections to see preview</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {formData.content.sections.map((section, index) => (
                          <div key={index} className="space-y-3">
                            {section.heading && (
                              <h2 className="text-xl font-bold text-white">
                                {section.heading}
                              </h2>
                            )}
                            
                            {section.text && (() => {
                              // Clean up citation markers and other artifacts from AI-generated content
                              const cleanText = section.text
                                // Remove Unicode private use area characters first (weird boxes like E000-EFFF)
                                .replace(/[\uE000-\uF8FF]/g, '')
                                // Remove citation markers in various formats
                                .replace(/cite turn\d+[a-z]+\d+/gi, '')
                                .replace(/cite turn\d+search\d+/gi, '')
                                .replace(/\[cite[^\]]*\]/gi, '')
                                .replace(/\(cite[^)]*\)/gi, '')
                                .replace(/\bcite\s+turn\d+[a-z]+\d+\b/gi, '')
                                // Clean up any double spaces that might have been left
                                .replace(/  +/g, ' ')
                                // Normalize line breaks (preserve markdown structure)
                                .replace(/\n{3,}/g, '\n\n')
                                // Remove spaces before punctuation that citation markers might have left
                                .replace(/\s+([.,;:!?])/g, '$1')
                                .trim();
                              
                              return (
                                <div className="text-gray-400 leading-relaxed prose prose-invert prose-headings:text-white prose-p:text-gray-400 prose-strong:text-white prose-code:text-red-400 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm max-w-none">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                      strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                      code: ({ children, ...props }: any) => {
                                        const inline = (props as { inline?: boolean }).inline;
                                        if (inline) {
                                          return (
                                            <code className="text-red-400 bg-zinc-900 px-1.5 py-0.5 rounded text-sm font-mono">
                                              {children}
                                            </code>
                                          );
                                        }
                                        return (
                                          <code className="text-gray-300 font-mono text-sm">
                                            {children}
                                          </code>
                                        );
                                      },
                                      pre: ({ children }) => (
                                        <pre className="bg-zinc-900 border border-gray-800 rounded-xl p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre-wrap my-4">
                                          {children}
                                        </pre>
                                      ),
                                      ul: ({ children }) => (
                                        <ul className="list-none space-y-2 my-4">
                                          {children}
                                        </ul>
                                      ),
                                      li: ({ children }) => (
                                        <li className="flex items-start gap-2">
                                          <span className="text-red-500 font-bold flex-shrink-0 mt-1">→</span>
                                          <span className="flex-1">{children}</span>
                                        </li>
                                      ),
                                      ol: ({ children }) => (
                                        <ol className="list-decimal list-inside space-y-2 my-4 ml-4">
                                          {children}
                                        </ol>
                                      ),
                                      h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-3 mt-6">{children}</h1>,
                                      h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-3 mt-4">{children}</h2>,
                                      h3: ({ children }) => <h3 className="text-lg font-bold text-white mb-2 mt-3">{children}</h3>,
                                      blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-red-500/50 pl-4 italic text-gray-300 my-4">
                                          {children}
                                        </blockquote>
                                      ),
                                    }}
                                  >
                                    {cleanText}
                                  </ReactMarkdown>
                                </div>
                              );
                            })()}
                            
                            {section.items && section.items.length > 0 && (
                              <ul className="space-y-2">
                                {section.items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="flex items-start gap-2 text-gray-400">
                                    <span className="text-red-500 font-bold flex-shrink-0 mt-1">→</span>
                                    <span className="leading-relaxed">
                                      <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                          p: ({ children }) => <span>{children}</span>,
                                          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                          code: ({ children }) => (
                                            <code className="text-red-400 bg-zinc-900 px-1.5 py-0.5 rounded text-sm font-mono">
                                              {children}
                                            </code>
                                          ),
                                        }}
                                      >
                                        {item}
                                      </ReactMarkdown>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            
                            {section.code && (
                              <div className="bg-zinc-900 border border-gray-800 rounded-xl p-4 overflow-x-auto">
                                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                                  {section.code}
                                </pre>
                              </div>
                            )}
                            
                            {section.note && (
                              <div className="bg-gradient-to-br from-red-600/20 via-red-500/10 to-transparent border border-red-500/30 rounded-xl p-4">
                                <p className="text-gray-300 text-sm">
                                  <span className="font-bold text-red-400">Note:</span>{' '}
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      p: ({ children }) => <span>{children}</span>,
                                      strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                      code: ({ children }) => (
                                        <code className="text-red-400 bg-zinc-900 px-1.5 py-0.5 rounded text-sm font-mono">
                                          {children}
                                        </code>
                                      ),
                                    }}
                                  >
                                    {section.note}
                                  </ReactMarkdown>
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}

