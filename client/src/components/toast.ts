export type ToastVariant = 'info' | 'success' | 'error' | 'warning';

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
}

let pushToast: ((toast: ToastOptions) => void) | null = null;

export function registerToastEmitter(fn: (toast: ToastOptions) => void) {
  pushToast = fn;
  return () => {
    if (pushToast === fn) pushToast = null;
  };
}

function show(toast: ToastOptions) {
  pushToast?.(toast);
}

export const toast = {
  show,
  info: (message: string, durationMs?: number) =>
    show({ message, variant: 'info', durationMs }),
  success: (message: string, durationMs?: number) =>
    show({ message, variant: 'success', durationMs }),
  error: (message: string, durationMs?: number) =>
    show({ message, variant: 'error', durationMs }),
  warning: (message: string, durationMs?: number) =>
    show({ message, variant: 'warning', durationMs }),
};
