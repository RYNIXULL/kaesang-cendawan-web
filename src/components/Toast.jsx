import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

const TOAST_TYPES = {
  success: { icon: CheckCircle, color: 'bg-emerald-500', border: 'border-emerald-200' },
  error: { icon: XCircle, color: 'bg-red-500', border: 'border-red-200' },
  info: { icon: AlertCircle, color: 'bg-blue-500', border: 'border-blue-200' },
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, duration, exiting: false }]);

    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 400);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 400);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container" style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem', pointerEvents: 'none' }}>
        {toasts.map(toast => {
          const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
          const Icon = config.icon;
          return (
            <div
              key={toast.id}
              className={`
                flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border
                bg-white backdrop-blur-sm
                pointer-events-auto max-w-sm
                ${toast.exiting ? 'animate-slide-out' : 'animate-slide-in'}
              `}
              style={{
                animation: toast.exiting
                  ? 'toastSlideOut 0.4s ease-in forwards'
                  : 'toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              <div className={`${config.color} rounded-full p-1.5 flex-shrink-0 shadow-lg`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-800 flex-grow">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}