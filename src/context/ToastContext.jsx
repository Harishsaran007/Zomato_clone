import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 2 seconds based on user request ("disappearing 2 seconds")
        setTimeout(() => {
            removeToast(id);
        }, 2000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5
                            ${toast.type === 'success' ? 'bg-foreground text-background border border-border' : 'bg-red-600 text-white'}
                        `}
                        role="alert"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{toast.message}</span>
                        </div>
                        {/* Option to close manually if needed, though 2s is short */}
                        {/* <button onClick={() => removeToast(toast.id)} className="text-zinc-400 hover:text-white">
                            <X size={16} />
                        </button> */}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
