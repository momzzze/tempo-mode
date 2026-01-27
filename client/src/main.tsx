import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { AppRouter } from './router';
import { store } from './store';
import { rehydrate } from './store';
import { initThemeOnce } from './theme/useTheme';
import { ToastProvider } from './components/ToastProvider';
import type { User } from './store';

initThemeOnce();

// Rehydrate auth from localStorage
try {
  const stored = localStorage.getItem('tempo-mode-auth');
  if (stored) {
    const user = JSON.parse(stored) as User;
    store.dispatch(rehydrate(user));
  }
  // Clear old keys
  localStorage.removeItem('tempo-mode-auth-v1');
} catch {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </Provider>
  </StrictMode>
);
