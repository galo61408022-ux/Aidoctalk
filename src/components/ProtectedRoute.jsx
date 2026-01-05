import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component
 * Only renders children if user is authenticated and subscribed (optional)
 */
export function ProtectedRoute({ children, requireSubscription = false }) {
  const { isAuthenticated, isSubscribed, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h2>
          <p className="text-red-600 mb-4">Please log in to access this feature</p>
          <a
            href="/login"
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Authenticated but not subscribed (if subscription required)
  if (requireSubscription && !isSubscribed) {
    return (
      <div className="flex items-center justify-center h-screen bg-yellow-50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4">Subscription Required</h2>
          <p className="text-yellow-600 mb-4">Please subscribe to access premium features</p>
          <button
            onClick={() => window.location.href = '/subscribe'}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  // All checks passed
  return children;
}

/**
 * Example: Only for logged-in users
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */

/**
 * Example: Only for subscribed users
 * <ProtectedRoute requireSubscription={true}>
 *   <PremiumFeatures />
 * </ProtectedRoute>
 */
