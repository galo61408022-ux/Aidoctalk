import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Heart, Stethoscope, MapPin, LogIn } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { aiService } from './services';
import { useToast, Toast } from './components/Toast';
import { LoadingSpinner } from './components/LoadingSpinner';

export function GuestChat({ onNavigate }) {
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm AI Doctor, your virtual medical advisor and therapist. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setApiError(null);

    try {
      const response = await aiService.sendGuestMessage(textToSend);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.reply || "I understand your concern. However, for personalized advice and to save our conversation history, please consider logging in or subscribing. In guest mode, I can provide general information only.",
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
        text: "I understand your concern. However, for personalized advice and to save our conversation history, please consider logging in or subscribing.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-blue-900 font-semibold text-sm sm:text-base">AI Doctalk</span>
            </div>
            {/* Navigation Items */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => onNavigate('hospital')}
                className="flex items-center gap-1 sm:gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-sm font-medium">Find Hospitals</span>
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
              >
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Login / Subscribe</span>
                <span className="sm:hidden">Login</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Guest Mode Warning Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 text-amber-900">
            <div className="bg-amber-400 rounded-full p-1 flex-shrink-0">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-medium">
              <span>Guest Mode: Chat history is not saved.</span>
              <button
                onClick={() => onNavigate('auth')}
                className="ml-2 underline hover:text-amber-700 decoration-amber-700/50"
              >
                Login to save
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-8 flex flex-col min-h-0">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col flex-1 h-[600px]">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1645066928295-2506defde470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBhdmF0YXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY1OTczMTU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="AI Doctor"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 sm:border-4 border-blue-400 shadow-lg"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-white font-bold text-sm sm:text-base">AI Doctor</h2>
                <p className="text-blue-100 text-xs sm:text-sm">Medical Advisor & Therapist</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-slate-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-[10px] mt-1 text-right ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
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
            
            {/* Typing Indicator */}
            {isTyping && (
               <div className="flex justify-start animate-pulse">
                 <div className="bg-white border border-slate-200 text-slate-500 rounded-xl rounded-bl-sm px-4 py-3 text-xs">
                    AI is typing...
                 </div>
               </div>
            )}
            
            {/* Invisible div for auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="text-slate-400 hover:text-blue-600 transition-colors hidden sm:block">
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm"
              />
              <button
                onClick={() => handleSend()}
                className="bg-blue-600 text-white p-2 sm:p-3 rounded-full hover:bg-blue-700 transition-colors flex-shrink-0 shadow-sm"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions (Now Interactive) */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
          <button 
            onClick={() => handleSend("I have a medical question regarding symptoms I'm feeling.")}
            className="text-left bg-white p-4 sm:p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
                <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-800 mb-1 text-sm sm:text-base font-semibold">Medical Advisor</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Click to start a consultation about physical health
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleSend("I'm feeling overwhelmed and need someone to talk to.")}
            className="text-left bg-white p-4 sm:p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-800 mb-1 text-sm sm:text-base font-semibold">Personal Therapist</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Click to start a session for mental support
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

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