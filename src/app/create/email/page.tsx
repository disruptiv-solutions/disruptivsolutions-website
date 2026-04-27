'use client';

import React from 'react';
import Link from 'next/link';
import { AdminRoute } from '@/components/AdminRoute';

export default function CreateEmailPage() {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <Link
              href="/emails"
              className="inline-flex items-center text-gray-400 hover:text-white text-sm font-medium mb-6 transition-colors"
              tabIndex={0}
              aria-label="Back to Emails"
            >
              ← Emails
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Create email</h1>
            <p className="text-gray-400">Compose a new email. Editor and workflow can be wired here next.</p>
          </div>

          <div className="rounded-xl border border-dashed border-gray-700 bg-zinc-900/30 p-10 text-center">
            <p className="text-gray-500 text-sm">Email builder placeholder — add form, preview, and send logic when ready.</p>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
