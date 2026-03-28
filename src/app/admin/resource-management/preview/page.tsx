'use client';

import React, { useState, useEffect } from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import Link from 'next/link';
import { ResourcePreviewContent } from '@/components/admin/ResourcePreviewContent';
import type { ResourcePreviewData } from '@/components/admin/ResourcePreviewContent';

const PREVIEW_STORAGE_KEY = 'admin-resource-preview-draft';

export default function ResourcePreviewPage() {
  const [data, setData] = useState<ResourcePreviewData | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(PREVIEW_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ResourcePreviewData;
        setData(parsed);
      }
    } catch {
      setData(null);
    }
  }, []);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-black">
        {/* Preview Banner */}
        <div className="bg-yellow-600/20 border-b border-yellow-500/50 py-3 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">👁️</span>
              <p className="text-yellow-400 text-sm font-semibold">
                Full Page Preview — Shows how the resource will look when published
              </p>
            </div>
            <Link
              href="/admin/resource-management"
              className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold underline"
            >
              ← Back to Editor
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 pt-12 pb-20">
          {!data ? (
            <div className="text-center py-20 space-y-6">
              <p className="text-gray-400 text-lg">
                No preview data. Go back to the resource editor and click &quot;View Full Preview&quot; to see your content here.
              </p>
              <Link
                href="/admin/resource-management"
                className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
              >
                ← Back to Resource Management
              </Link>
            </div>
          ) : (
            <ResourcePreviewContent data={data} />
          )}
        </main>
      </div>
    </AdminRoute>
  );
}
