import { useState, useRef, useEffect } from 'react';
import {
  Send, Paperclip, Settings, MapPin, LogOut, Mail, User, Bell,
  CreditCard, Stethoscope, MessageSquare, Trash2, X, Menu,
  Pen, Camera, Check, Star, Shield, Calendar, BookOpen, Search,
  ChevronLeft, ChevronRight, Plus, ChevronDown
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { aiService, authService } from './services';
import { useAuth } from './context/AuthContext';
import { useToast, Toast } from './components/Toast';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SubscribeButton } from './components/SubscribeButton';

export function LoggedInChat({ onNavigate, onLogout }) {
  const { user, logout, updateProfile } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: "Welcome back! I'm your AI Doctor. I can see your previous conversations and provide personalized advice. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeConversation, setActiveConversation] = useState('1');
  const [conversations, setConversations] = useState([
    {
      id: '1',
      title: 'Current Conversation',
      lastMessage: 'Welcome back! I\'m your AI Doctor...',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    chatReminders: true,
    healthTips: false,
  });

  // Subscription Modal State
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

  // Plan Data
  const plans = [
    {
      name: 'Starter',
      price: '2,500',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      features: ['Save Chat History', 'Basic Health Tips', 'Email Support']
    },
    {
      name: 'Professional',
      price: '5,000',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      features: ['Everything in Starter', 'Personalized Therapy', 'Priority Response']
    },
    {
      name: 'Premium',
      price: '10,000',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      features: ['Everything in Pro', '24/7 AI Access', 'Medical Records Backup', 'Family Account']
    }
  ];

  const nextPlan = () => {
    setCurrentPlanIndex((prev) => (prev + 1) % plans.length);
  };

  const prevPlan = () => {
    setCurrentPlanIndex((prev) => (prev - 1 + plans.length) % plans.length);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const token = await authService.getToken();
        if (token) {
          const data = await aiService.getConversations(token);
          if (Array.isArray(data)) {
            setConversations(data);
          }
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
        addToast('Failed to load conversations', 'error');
      }
    };
    loadConversations();
  }, []);

  useEffect(() => {
    if (showSidebar || showSettings || showSubscriptionModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSidebar, showSettings, showSubscriptionModal]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setApiError(null);

    try {
      const token = await authService.getToken();
      const response = await aiService.sendMessage(inputText, activeConversation, token);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.reply || "I understand your concern. Based on your history and current symptoms, I recommend the following steps. Remember, this is general guidance and not a substitute for professional medical advice.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setApiError(error.message);
      addToast('Failed to get response. Please try again.', 'error');

      // Fallback response
      const fallbackMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I understand your concern. Based on your history and current symptoms, I recommend the following steps. Remember, this is general guidance and not a substitute for professional medical advice.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [filePurpose, setFilePurpose] = useState('attachment');

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      addToast('Voice input not supported in this browser', 'error');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText((prev) => prev + ' ' + transcript);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // If this file selection is for profile update
    if (filePurpose === 'profile') {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result;
        try {
          await updateProfile({ photoURL: dataUrl });
          addToast('Profile image updated', 'success');
        } catch (err) {
          console.error('Profile update failed', err);
          addToast('Failed to update profile image', 'error');
        }
      };
      reader.readAsDataURL(file);
      // reset purpose
      setFilePurpose('attachment');
      e.target.value = '';
      return;
    }

    // Default: treat as chat attachment
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: `📎 Uploaded file: ${file.name}`,
        timestamp: new Date(),
      },
    ]);

    e.target.value = '';
  };


  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - Conversation History */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-blue-900">AIDoctalk</span>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowSettings(true); setShowSidebar(false); }} className="p-0 rounded-full">
              {user?.photoURL ? (
                <ImageWithFallback
                  src={user.photoURL}
                  alt={user?.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 text-lg font-bold border-2 border-blue-200">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </button>
            <div className="flex-1">
              <h3 className="text-slate-900 text-sm">{user?.name || 'User'}</h3>
              <p className="text-xs text-slate-500">
                {user?.isSubscribed
                  ? `${user?.subscriptionPlan?.charAt(0).toUpperCase() + user?.subscriptionPlan?.slice(1)} Plan`
                  : 'Free Plan'}
              </p>
            </div>
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowSidebar(false);
              }}
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-slate-600 text-sm mb-3">Recent Conversations</h3>
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConversation(conv.id);
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${activeConversation === conv.id
                    ? 'bg-blue-100 border-2 border-blue-300'
                    : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-slate-900 mb-1 truncate">
                        {conv.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {conv.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="mb-3">
            <button
              onClick={() => {
                setShowSettings(false);
                setShowSubscriptionModal(true);
              }}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold shadow-lg hover:shadow-xl"
            >
              Subscribe Now
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-2 mb-3">
            <button
              onClick={() => {
                onNavigate('hospital-search');
                setShowSidebar(false);
              }}
              className="w-full flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors p-2 hover:bg-slate-50 rounded-lg"
            >
              <Search className="h-5 w-5" />
              <span className="text-sm">Find Hospitals</span>
            </button>
            <button
              onClick={() => {
                onNavigate('doctor-reservation');
                setShowSidebar(false);
              }}
              className="w-full flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors p-2 hover:bg-slate-50 rounded-lg"
            >
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Book Doctor</span>
            </button>
            <button
              onClick={() => {
                onNavigate('health-articles');
                setShowSidebar(false);
              }}
              className="w-full flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors p-2 hover:bg-slate-50 rounded-lg"
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-sm">Health Articles</span>
            </button>
          </div>

          <button
            onClick={async () => {
              try {
                await logout();
                onLogout();
              } catch (err) {
                addToast('Logout failed', 'error');
              }
            }}
            className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white pt-16">
        {/* Chat Header (fixed) */}
        <div className="fixed top-0 left-0 right-0 lg:left-80 bg-white border-b border-slate-200 px-4 py-4 shadow-sm z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Centered AI DocTalk Branding */}
            <div className="flex-1 flex items-center justify-center gap-3">
              <div className="text-center">
                <h2 className="text-slate-900 text-sm sm:text-base font-bold">AI DocTalk</h2>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">🏥 Medical Advisor & Therapist</p>
              </div>
            </div>

            {/* Profile Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="View Profile"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="h-8 w-8 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-slate-200 text-blue-600 font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 bg-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 backdrop-blur-sm transition-all hover:shadow-lg ${message.sender === 'user'
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-sm shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-sm shadow-sm'
                  }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-2 ${message.sender === 'user' ? 'text-cyan-700' : 'text-slate-500'
                    }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-900 rounded-2xl rounded-bl-sm px-4 py-3 border border-slate-200">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          {/* Scroll Anchor */}
          <div ref={messagesEndRef} />
        </div>

{/* INPUT AREA – GEMINI STYLE */}
<div className="bg-white border-t border-slate-200">
  <div className="px-2 sm:px-4 py-2 sm:py-4">
    <div className="max-w-full sm:max-w-2xl md:max-w-4xl mx-auto">

    {/* MAIN INPUT CONTAINER */}
    <div className="flex gap-2 items-end">
      
      {/* CENTER - TEXT INPUT AREA WITH EVERYTHING INSIDE BORDER */}
      <div className="flex-1">
        <div
          className="
            flex flex-col
            bg-white
            border border-slate-300
            rounded-2xl
            px-4 py-3
            shadow-sm
            focus-within:border-blue-500
            focus-within:shadow-md
            focus-within:border-2
            transition-all
          "
        >
          {/* TEXTAREA-LIKE INPUT */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything…"
            rows={2}
            className="
              flex-1
              bg-transparent
              outline-none
              border-none
              text-slate-900
              placeholder-slate-400
              text-sm
              resize-none
              max-h-48
            "
          />

          {/* BOTTOM ACTION BAR - INSIDE BORDER */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
            {/* LEFT: Plus Button */}
            <button
              onClick={() => { setFilePurpose('attachment'); fileInputRef.current.click(); }}
              className="
                h-8 w-8
                flex items-center justify-center
                rounded-full
                text-slate-500
                hover:bg-slate-100
                transition
              "
              title="Attach file"
            >
              <Plus className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* CENTER: Mic + Model Selector */}
            <div className="flex items-center gap-2">
              {/* Mic */}
              <button
                onClick={startVoiceInput}
                className={`
                  h-8 w-8
                  flex items-center justify-center
                  rounded-full
                  transition
                  ${isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-slate-500 hover:bg-slate-100'}
                `}
                title="Voice input"
              >
                🎤
              </button>

              {/* AI Model Selector */}
              <div className="relative flex items-center gap-2">
                <select
                  className="
                    appearance-none
                    bg-slate-100
                    border border-slate-200
                    rounded-full
                    px-3 py-1
                    pr-7
                    text-xs
                    text-slate-700
                    font-medium
                    focus:outline-none
                    focus:border-blue-400
                    hover:bg-slate-200
                    transition
                  "
                >
                  <option>AI Pro</option>
                  <option>AI Flash</option>
                  <option>AI Doctor</option>
                </select>
                <ChevronDown className="absolute right-2 h-3 w-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* RIGHT: Send Button - Only visible when text exists */}
            {inputText.trim() && (
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="
                  h-8 w-8
                  flex items-center justify-center
                  rounded-full
                  bg-gradient-to-r from-cyan-500 to-blue-600
                  text-white
                  hover:scale-110
                  active:scale-95
                  transition-all
                  disabled:opacity-50
                "
              >
                {isLoading ? <LoadingSpinner size="sm" /> : <Send className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
    </div>
  </div>
</div>

      </div>

      {/* Settings Panel (Slide-in) */}
      {showSettings && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSettings(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gradient-to-b from-slate-50 to-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Profile Settings Card */}
              <div className="mb-8">
                

                {/* Modern Profile Card UI */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group">

                  {/* Decorative Banner */}
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                  <div className="px-6 pb-6">
                    <div className="flex justify-between items-end -mt-10 mb-3">

                      {/* Avatar (DP) Container */}
                      <div
                        className="relative group/avatar cursor-pointer"
                        onClick={() => {                          setFilePurpose('profile');                          fileInputRef.current?.click();
                        }}
                      >
                        {/* Main Image Circle - show user's photo if available */}
                        <div className="relative z-10">
                          {user?.photoURL ? (
                            <ImageWithFallback
                              src={user.photoURL}
                              alt={user?.name}
                              className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center">
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Existing Camera Overlay on Hover */}
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity border-4 border-transparent z-20">
                          <Camera className="w-6 h-6 text-white" />
                        </div>

                        {/* Small Pen Icon at the bottom */}
                        <div className="absolute bottom-0 right-0 z-30 bg-white rounded-full p-1.5 shadow-sm border border-slate-100 text-slate-500 group-hover/avatar:text-blue-600 transition-colors">
                          <Pen className="h-3 w-3" />
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{user?.name || 'Guest User'}</h3>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                        <Mail className="h-3 w-4" />
                        {user?.email || 'guest@example.com'}
                      </p>
                      {/* Subscription Badge */}
                      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100">
                        <div className={`w-1.5 h-1.5 rounded-full ${user?.isSubscribed ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                        <span className="text-xs font-medium text-blue-700">
                          {user?.isSubscribed ? 'Premium Member' : 'Free Account'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="mb-8 pb-8 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer"
                    onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                      <p className="text-xs text-slate-500 mt-1">Receive updates via email</p>
                    </div>
                    <div className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${notifications.email ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <span className={`inline-block w-4 h-4 bg-white rounded-full transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`}></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer"
                    onClick={() => setNotifications({ ...notifications, chatReminders: !notifications.chatReminders })}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">Chat Reminders</p>
                      <p className="text-xs text-slate-500 mt-1">Get reminded about unread messages</p>
                    </div>
                    <div className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${notifications.chatReminders ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <span className={`inline-block w-4 h-4 bg-white rounded-full transition-transform ${notifications.chatReminders ? 'translate-x-6' : 'translate-x-1'}`}></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer"
                    onClick={() => setNotifications({ ...notifications, healthTips: !notifications.healthTips })}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">Health Tips</p>
                      <p className="text-xs text-slate-500 mt-1">Receive daily health recommendations</p>
                    </div>
                    <div className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${notifications.healthTips ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <span className={`inline-block w-4 h-4 bg-white rounded-full transition-transform ${notifications.healthTips ? 'translate-x-6' : 'translate-x-1'}`}></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Management */}
              <div className="mb-8 pb-8 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Subscription</h3>
                </div>
                <div className={`rounded-xl p-6 text-white ${user?.isSubscribed
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700'
                  : 'bg-gradient-to-br from-slate-600 to-slate-700'
                  }`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold opacity-90">
                      {user?.isSubscribed
                        ? `${user?.subscriptionPlan?.charAt(0).toUpperCase() + user?.subscriptionPlan?.slice(1)} Plan`
                        : 'Free Plan'}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${user?.isSubscribed
                      ? 'bg-green-400 text-green-900'
                      : 'bg-gray-400 text-gray-800'
                      }`}>
                      {user?.isSubscribed ? '✓ Active' : 'Inactive'}
                    </span>
                  </div>

                  {user?.isSubscribed ? (
                    <>
                      <p className="text-2xl font-bold mb-1">
                        {user?.subscriptionPlan === 'starter'
                          ? '₦2,500'
                          : user?.subscriptionPlan === 'professional'
                            ? '₦5,000'
                            : '₦10,000'}
                        <span className="text-sm opacity-75">/month</span>
                      </p>
                      <button className="w-full bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm font-semibold shadow-lg hover:shadow-xl mt-4">
                        Upgrade Plan
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-blue-50 text-sm mb-4">
                        Upgrade your account to unlock premium features.
                      </p>
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          setShowSubscriptionModal(true);
                        }}
                        className="w-full bg-white text-slate-600 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold shadow-lg hover:shadow-xl"
                      >
                        View Plans
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4">
                <button className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 py-3 rounded-lg transition-colors text-sm font-medium border border-red-200">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* FULL SCREEN SUBSCRIPTION MODAL */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-[60] bg-slate-50 overflow-y-auto animate-in fade-in duration-200">

          {/* Header */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg text-white">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <span className="font-bold text-slate-900 text-lg">Choose Your Plan</span>
            </div>
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="max-w-md mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-3">Upgrade to Premium</h1>
              <p className="text-slate-600">Unlock the full potential of your AI Doctor.</p>
            </div>

            {/* Carousel Card with Manual Shifting */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
              <div className="p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"></div>

              <div className="p-6 sm:p-8 relative">

                {/* PREVIOUS ARROW BUTTON (Left) */}
                <button
                  onClick={prevPlan}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-md text-slate-600 hover:bg-white hover:text-blue-600 transition-all"
                  aria-label="Previous Plan"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* NEXT ARROW BUTTON (Right) */}
                <button
                  onClick={nextPlan}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-md text-slate-600 hover:bg-white hover:text-blue-600 transition-all"
                  aria-label="Next Plan"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Sliding Window */}
                <div className="overflow-hidden px-4">
                  <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${currentPlanIndex * 100}%)` }}
                  >
                    {plans.map((plan, index) => (
                      <div key={index} className="w-full flex-shrink-0 px-2">
                        <div className="text-center mb-6">
                          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${plan.bg} ${plan.color}`}>
                            {plan.name}
                          </span>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold text-slate-900">₦{plan.price}</span>
                            <span className="text-slate-500">/mo</span>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 justify-center sm:justify-start">
                              <div className={`p-1 rounded-full ${plan.bg}`}>
                                <Check className={`h-4 w-4 ${plan.color}`} />
                              </div>
                              <span className="text-slate-700 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots Navigation (Still useful for quick jumps) */}
                <div className="flex justify-center gap-2 mb-8">
                  {plans.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPlanIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${currentPlanIndex === index
                          ? 'w-8 bg-slate-800'
                          : 'w-2 bg-slate-200'
                        }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => addToast(`Selected ${plans[currentPlanIndex].name} Plan`, 'success')}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Subscribe Now
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <Shield className="h-3 w-3" />
                  <span>Secured by Paystack</span>
                </div>
              </div>
            </div>
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