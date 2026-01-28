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

const variantStyles: Record<
  ToastVariant,
  { bg: string; border: string; text: string; icon: string }
> = {
  success: {
    bg: 'bg-[var(--neon-400)]/15',
    border: 'border-[var(--neon-400)]/30',
    text: 'text-[var(--neon-400)]',
    icon: 'text-[var(--neon-400)]',
  },
  error: {
    bg: 'bg-[var(--status-bad)]/20',
    border: 'border-[var(--status-bad)]/40',
    text: 'text-[var(--status-bad)]',
    icon: 'text-[var(--status-bad)]',
  },
  warning: {
    bg: 'bg-[var(--status-warn)]/20',
    border: 'border-[var(--status-warn)]/40',
    text: 'text-[var(--status-warn)]',
    icon: 'text-[var(--status-warn)]',
  },
  info: {
    bg: 'bg-white/10',
    border: 'border-white/20',
    text: 'text-white/80',
    icon: 'text-white/60',
  },
};

type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

const positionStyles: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

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
              className={`fixed z-50 flex flex-col gap-3 pointer-events-none ${positionStyles[position]}`}
              role="status"
              aria-live="polite"
            >
              {toasts.map((t) => {
                const styles = variantStyles[t.variant];
                return (
                  <div
                    key={t.id}
                    className={`
                      relative flex items-center gap-3 rounded-md border
                      px-4 py-3 backdrop-blur-sm pointer-events-auto
                      animate-in fade-in slide-in-from-top-2 duration-300
                      ${styles.bg} ${styles.border} ${styles.text}
                    `}
                  >
                    <div className={styles.icon}>{icons[t.variant]}</div>
                    <span
                      className="text-sm font-medium flex-1"
                      title={t.message}
                    >
                      {t.message}
                    </span>
                    <button
                      onClick={() =>
                        setToasts((prev) => prev.filter((x) => x.id !== t.id))
                      }
                      aria-label="Dismiss notification"
                      className="text-current hover:opacity-70 transition-opacity flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-current opacity-60"
                      style={{
                        animation: `shrink ${t.durationMs}ms linear forwards`,
                      }}
                    />
                    <style>{`
                      @keyframes shrink {
                        from { width: 100%; }
                        to { width: 0%; }
                      }
                    `}</style>
                  </div>
                );
              })}
            </div>,
            document.body
          )
        : null}
    </>
  );
}

// Re-export for convenience
export { toast };
