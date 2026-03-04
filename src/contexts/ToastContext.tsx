import { createContext, useContext, type ReactNode } from 'react';
import { useToast, ToastContainer } from '../components/Toast';
import type { ToastItem, ToastType, ToastAction } from '../components/Toast';

// Re-export types consumers might need
export type { ToastItem, ToastType, ToastAction };

// ─── Context shape ───────────────────────────────────────────────────────────

interface ToastContextValue {
  toast: ReturnType<typeof useToast>['toast'];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, toast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} position="bottom-right" />
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within a <ToastProvider>');
  return ctx;
}
