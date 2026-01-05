import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export function Toast({ message, type = 'info', duration = 4000, onClose }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      text: 'text-green-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      text: 'text-red-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-600" />,
      text: 'text-blue-800',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`fixed bottom-4 right-4 ${config.bg} border ${config.border} rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-sm animate-in slide-in-from-bottom-4 duration-300`}
    >
      {config.icon}
      <p className={`text-sm ${config.text} flex-1`}>{message}</p>
      <button
        onClick={onClose}
        className={`text-${type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'}-600 hover:opacity-75`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
}
