'use client';

import React from 'react';
import Link from 'next/link';
import { AdminRoute } from '@/components/AdminRoute';

export default function EmailsPage() {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Emails</h1>
              <p className="text-gray-400 text-lg">Manage and compose email content.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/create/email"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                tabIndex={0}
                aria-label="Create new email"
              >
                Create
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center px-4 py-3 bg-zinc-900 border border-gray-800 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors"
                tabIndex={0}
                aria-label="Back to admin dashboard"
              >
                ← Admin
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-zinc-900/50 p-8 md:p-10">
            <p className="text-gray-500 text-sm">
              No emails listed yet. Use <span className="text-gray-400 font-medium">Create</span> to start a new
              draft.
            </p>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
