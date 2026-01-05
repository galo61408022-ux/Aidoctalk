import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SubscriptionPlans } from './SubscriptionPlans';

export function SubscribeButton() {
  const { isAuthenticated, isSubscribed } = useAuth();
  const [showPlans, setShowPlans] = useState(false);

  if (showPlans) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
        <div className="relative">
          <button
            onClick={() => setShowPlans(false)}
            className="fixed top-4 right-4 z-50 bg-white hover:bg-gray-100 text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg"
          >
            ✕
          </button>
          <SubscriptionPlans />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowPlans(true)}
      disabled={isSubscribed}
      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
        isSubscribed
          ? 'bg-green-100 text-green-700 cursor-not-allowed'
          : isAuthenticated
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-gray-400 hover:bg-gray-500 text-white'
      }`}
    >
      {isSubscribed ? '✓ Subscribed' : 'Subscribe Now'}
    </button>
  );
}
