import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import {
  registerToastEmitter,
  toast,
  type ToastOptions,
  type ToastVariant,
} from './toast';

interface ActiveToast {
  id: number;
  message: string;
  variant: ToastVariant;
  durationMs: number;
}

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export function ToastProvider({
  children,
  position = 'top-center',
}: {
  children: React.ReactNode;
  position?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    const unregister = registerToastEmitter(
      ({ message, variant = 'info', durationMs = 3200 }: ToastOptions) => {
        const id = Number(new Date()) + Math.floor(Math.random() * 1000);
        const next: ActiveToast = { id, message, variant, durationMs };
        setToasts((prev) => [...prev, next]);
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, durationMs);
      }
    );

    return unregister;
  }, []);

  return (
    <>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div
              className={`toast-stack toast-stack--${position}`}
              role="status"
              aria-live="polite"
            >
              {toasts.map((t) => (
                <div key={t.id} className={`toast toast--${t.variant}`}>
                  <div className="toast__icon">{icons[t.variant]}</div>
                  <span className="toast__message" title={t.message}>
                    {t.message}
                  </span>
                  <button
                    className="toast__close"
                    onClick={() =>
                      setToasts((prev) => prev.filter((x) => x.id !== t.id))
                    }
                    aria-label="Dismiss notification"
                  >
                    <X size={16} />
                  </button>
                  <div
                    className="toast__progress"
                    style={{
                      ['--toast-duration' as string]: `${t.durationMs}ms`,
                    }}
                  />
                </div>
              ))}
            </div>,
            document.body
          )
        : null}
    </>
  );
}

// Re-export for convenience
export { toast };
