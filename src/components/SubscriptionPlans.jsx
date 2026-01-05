import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { paystackService } from '../services/paystackService';
import { Toast, useToast } from './Toast';
import { Check, X } from 'lucide-react';

export function SubscriptionPlans() {
  const { user, isAuthenticated, isSubscribed } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const [processingPlan, setProcessingPlan] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 2500,
      priceNaira: '₦2,500',
      duration: '/month',
      description: 'Perfect for basic health consultations',
      features: [
        { name: 'Unlimited AI Chat', included: true },
        { name: 'Hospital Directory', included: true },
        { name: 'Basic Health Tips', included: true },
        { name: 'Priority Support', included: false },
        { name: 'Medical Records Storage', included: false },
        { name: 'Prescription History', included: false },
      ],
      buttonText: 'Subscribe Now',
      highlighted: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 5000,
      priceNaira: '₦5,000',
      duration: '/month',
      description: 'Best for regular health management',
      features: [
        { name: 'Unlimited AI Chat', included: true },
        { name: 'Hospital Directory', included: true },
        { name: 'Basic Health Tips', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Medical Records Storage', included: true },
        { name: 'Prescription History', included: false },
      ],
      buttonText: 'Most Popular',
      highlighted: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 10000,
      priceNaira: '₦10,000',
      duration: '/month',
      description: 'Complete healthcare management solution',
      features: [
        { name: 'Unlimited AI Chat', included: true },
        { name: 'Hospital Directory', included: true },
        { name: 'Basic Health Tips', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Medical Records Storage', included: true },
        { name: 'Prescription History', included: true },
      ],
      buttonText: 'Subscribe Now',
      highlighted: false,
    },
  ];

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      addToast('Please log in first to subscribe', 'error');
      return;
    }

    if (isSubscribed) {
      addToast('You are already subscribed!', 'info');
      return;
    }

    setProcessingPlan(plan.id);
    try {
      // Convert naira to kobo (₦2,500 = 250000 kobo)
      const amountInKobo = plan.price * 100;

      // Initialize payment with backend
      const paymentInit = await paystackService.initializePayment({
        plan: plan.id,
        amount: amountInKobo,
        features: plan.features
          .filter((f) => f.included)
          .map((f) => f.name.toLowerCase().replace(/\s+/g, '_')),
      });

      // Open Paystack popup
      const paystackResult = await paystackService.openPaystackPopup({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: paymentInit.amount,
        reference: paymentInit.reference,
      });

      // Verify payment
      const verification = await paystackService.verifyPayment(
        paystackResult.reference
      );

      if (verification.status === 'success') {
        addToast(
          `Welcome to ${plan.name}! Your subscription is now active.`,
          'success'
        );
        // Reload to update subscription status
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      addToast(error.message || `Failed to process ${plan.name} subscription`, 'error');
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Get access to premium health consultation features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-8 mb-12 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl ${
                plan.highlighted
                  ? 'ring-2 ring-blue-500'
                  : 'bg-white'
              }`}
            >
              {/* Highlighted Badge */}
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <div
                className={`p-6 sm:p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-white'
                }`}
              >
                {/* Plan Name */}
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                <p
                  className={`text-sm mb-6 ${
                    plan.highlighted ? 'text-blue-100' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.priceNaira}</span>
                    <span
                      className={`text-sm ${
                        plan.highlighted ? 'text-blue-100' : 'text-gray-600'
                      }`}
                    >
                      {plan.duration}
                    </span>
                  </div>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processingPlan === plan.id || isSubscribed}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all mb-8 text-sm sm:text-base ${
                    isSubscribed
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } ${processingPlan === plan.id ? 'opacity-75 cursor-wait' : ''}`}
                >
                  {processingPlan === plan.id
                    ? 'Processing...'
                    : isSubscribed
                    ? '✓ Already Subscribed'
                    : 'Subscribe Here'}
                </button>
              </div>

              {/* Features List */}
              <div className={`px-8 pb-8 ${plan.highlighted ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <h4 className="font-semibold text-gray-900 mb-4">What's Included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? 'text-gray-900'
                            : 'text-gray-400 line-through'
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-3xl mx-auto">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Need Help Choosing?
          </h3>
          <div className="space-y-2 text-sm sm:text-base text-gray-600">
            <p>
              ✓ <strong>Starter (₦2,500)</strong> - Great if you want basic AI
              health consultations and hospital information
            </p>
            <p>
              ✓ <strong>Professional (₦5,000)</strong> - Perfect for regular
              users who want priority support and medical records
            </p>
            <p>
              ✓ <strong>Premium (₦10,000)</strong> - Complete solution with
              full access to all features including prescription history
            </p>
          </div>
        </div>
      </div>

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
