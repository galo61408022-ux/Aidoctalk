import { useState, useEffect } from 'react'; // Add useEffect
import { ArrowLeft, Stethoscope, Check, Shield, Clock, Heart, Star, Mail } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useToast, Toast } from './components/Toast';
import { LoadingSpinner } from './components/LoadingSpinner';

export function AuthScreen({ onLogin, onNavigate }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, signup, isLoading, error } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signup(name, email, password);
        addToast('Account created successfully!', 'success');
      } else {
        await login(email, password);
        addToast('Login successful!', 'success');
      }
      onLogin();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      addToast('Redirecting to Google...', 'info');
      // In a real app, this would use Firebase Google Auth
      // For now, just show a placeholder message
      setTimeout(() => {
        addToast('Google signup coming soon!', 'info');
      }, 500);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      addToast('Password reset link sent to your email', 'success');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // ... existing states ...

  // Pricing Carousel State
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

  const plans = [
    { name: 'Starter', price: '2,500', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Professional', price: '5,000', color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Premium', price: '10,000', color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  // Auto-scroll the pricing card every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlanIndex((prev) => (prev + 1) % plans.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <button
              onClick={() => onNavigate('logged-in')}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Back</span>
            </button>
           
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Left Side - Auth Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-slate-900 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                {isSignUp
                  ? 'Start your journey to better health'
                  : 'Continue your health journey'}
              </p>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-sm text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-sm sm:text-base disabled:opacity-50"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-sm sm:text-base disabled:opacity-50"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-sm sm:text-base disabled:opacity-50"
                  placeholder="••••••••"
                  required
                />
              </div>

              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-right text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Processing...</span>
                  </>
                ) : (
                  isSignUp ? 'Sign Up' : 'Sign In'
                )}
              </button>

              {isSignUp && (
                <div className="mt-4 sm:mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="hidden sm:inline">Google</span>
                  </button>
                </div>
              )}

              <div className="text-center mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm"
                >
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Sign Up"}
                </button>
              </div>
            </form>
            {/* Paystack Logo */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
              <div className="flex items-center justify-center gap-2 text-slate-500 text-xs sm:text-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Secured by GOOGLE</span>
              </div>
            </div>
          </div>
          {/* Right Side - Premium Benefits */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-white">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300" />
                <h2 className="text-lg sm:text-xl">Premium Benefits</h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-white/20 p-2 rounded-lg mt-1 flex-shrink-0">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm sm:text-base">Save Conversations</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">
                      Access your complete chat history anytime, anywhere
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-white/20 p-2 rounded-lg mt-1 flex-shrink-0">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm sm:text-base">Personalized Therapy</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">
                      Get tailored mental health support based on your history
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-white/20 p-2 rounded-lg mt-1 flex-shrink-0">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm sm:text-base">24/7 Priority Access</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">
                      Skip wait times and get immediate AI assistance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-white/20 p-2 rounded-lg mt-1 flex-shrink-0">
                    <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm sm:text-base">Advanced Medical Insights</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">
                      Access detailed health analysis and recommendations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-white/20 p-2 rounded-lg mt-1 flex-shrink-0">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm sm:text-base">Privacy & Security</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">
                      Your data is encrypted and completely confidential
                    </p>
                  </div>
                </div>
              </div>
            </div>
           {/* Pricing Info Carousel */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 overflow-hidden relative">
              
              <p className="text-slate-600 mb-4 text-center text-sm sm:text-base font-medium">
                Choose your plan
              </p>

              {/* The Slider Window */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out" 
                  style={{ transform: `translateX(-${currentPlanIndex * 100}%)` }}
                >
                  {plans.map((plan, index) => (
                    <div key={index} className="w-full flex-shrink-0 text-center px-2">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${plan.bg} ${plan.color}`}>
                        {plan.name}
                      </div>
                      <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-slate-900 text-3xl sm:text-4xl font-bold">
                          ₦{plan.price}
                        </span>
                        <span className="text-slate-500 text-sm sm:text-base">/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 text-center mt-2 mb-4">
                Cancel anytime. No hidden fees.
              </p>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2">
                {plans.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPlanIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentPlanIndex === index 
                        ? 'w-6 bg-blue-600' 
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`View ${plans[index].name} plan`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Reset Password</h2>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-sm sm:text-base"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 px-4 py-2.5 sm:py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-0 right-0 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto m-4">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}