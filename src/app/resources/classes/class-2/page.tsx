'use client';

import React from 'react';
import Link from 'next/link';

export default function Class2Page() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Class 2
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Free AI App Building Class
          </p>
        </div>

        {/* Content */}
        <div className="bg-zinc-900 border border-gray-800 rounded-2xl p-8 md:p-12">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 text-lg leading-relaxed">
              Welcome to Class 2. Content coming soon.
            </p>
          </div>
        </div>

        {/* Back to Resources */}
        <div className="mt-8 text-center">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-gray-800 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors"
          >
            ← Back to Resources
          </Link>
        </div>
      </div>
    </div>
  );
}







