'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to protect admin-only routes
 * Redirects non-admin users or shows fallback
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-400">Please log in to continue.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Not an admin
  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // User is admin, show protected content
  return <>{children}</>;
};

/**
 * Hook to check if current user is admin
 */
export const useIsAdmin = () => {
  const { isAdmin } = useAuth();
  return isAdmin;
};

