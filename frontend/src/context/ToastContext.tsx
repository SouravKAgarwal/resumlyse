import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = `toast-${++counterRef.current}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-700" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-700" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-700" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-stone-600" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200';
      case 'error':
        return 'border-rose-200';
      case 'warning':
        return 'border-amber-200';
      case 'info':
      default:
        return 'border-stone-200';
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast Container — bottom-right, non-blocking */}
      <div className="fixed bottom-4 right-4 z-60 flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none sm:max-w-xs">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto bg-white border ${getBorderColor(t.type)} rounded-lg shadow-lg p-3 flex items-start gap-2.5 animate-in slide-in-from-bottom-2 fade-in duration-200`}
          >
            <div className="shrink-0 mt-0.5">{getIcon(t.type)}</div>
            <p className="text-xs text-stone-700 font-sans leading-relaxed flex-1">
              {t.message}
            </p>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-stone-400 hover:text-stone-700 p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
