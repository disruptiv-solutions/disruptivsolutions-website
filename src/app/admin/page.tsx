'use client';

import React from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <AdminRoute>
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">
                  Welcome back, {user?.displayName || 'Admin'}
                </p>
              </div>
              <Link
                href="/"
                className="px-4 py-2 bg-zinc-900 border border-gray-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
              >
                ← Back to Site
              </Link>
            </div>
          </div>

          {/* Content */}
          <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-white">-</p>
                  <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                </div>
                
                <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-gray-400 text-sm mb-2">Active Today</h3>
                  <p className="text-3xl font-bold text-white">-</p>
                  <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                </div>
                
                <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-gray-400 text-sm mb-2">Total Resources</h3>
                  <p className="text-3xl font-bold text-white">-</p>
                  <p className="text-xs text-gray-500 mt-1">Check Resources tab</p>
                </div>
                
                <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-gray-400 text-sm mb-2">Admin Users</h3>
                  <p className="text-3xl font-bold text-white">1</p>
                  <p className="text-xs text-gray-500 mt-1">Active</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <Link
                  href="/admin/resource-management"
                  className="bg-gradient-to-br from-red-600/20 via-red-500/10 to-transparent border border-red-500/30 rounded-xl p-6 hover:border-red-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-3xl">📚</div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                      Manage Resources
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    View, edit, and manage all resources on the site.
                  </p>
                </Link>

                <div className="bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-transparent border border-blue-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-3xl">👥</div>
                    <h3 className="text-xl font-bold text-white">
                      User Management
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    View and manage user accounts. Coming soon.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-600/20 via-green-500/10 to-transparent border border-green-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-3xl">📊</div>
                    <h3 className="text-xl font-bold text-white">
                      Analytics
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    View site analytics and reports. Coming soon.
                  </p>
                </div>
              </div>

              {/* Admin Info */}
              <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Admin Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-24">UID:</span>
                    <span className="text-white text-sm font-mono">{user?.uid}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-24">Email:</span>
                    <span className="text-white text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-24">Name:</span>
                    <span className="text-white text-sm">{user?.displayName || 'N/A'}</span>
                  </div>
                </div>
              </div>
          </>
        </div>
      </div>
    </AdminRoute>
  );
}

