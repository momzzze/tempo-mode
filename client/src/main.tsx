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

function decodeJwtPayload(token: string): { sub?: string; email?: string } {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(
      base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    );
    return JSON.parse(json) as { sub?: string; email?: string };
  } catch {
    return {};
  }
}

// Rehydrate auth from localStorage
try {
  const stored = localStorage.getItem('tempo-mode-auth');
  if (stored) {
    console.log('🔄 Rehydrating auth from localStorage');

    // Check for corrupted nested JSON (old bug)
    if (stored.includes('{\\')) {
      console.warn('⚠️ Detected corrupted localStorage, clearing...');
      localStorage.removeItem('tempo-mode-auth');
      throw new Error('Corrupted data');
    }

    if (stored.startsWith('eyJ')) {
      // Old format: just the JWT token
      const payload = decodeJwtPayload(stored);
      const user = {
        id: payload.sub ?? '',
        email: payload.email ?? '',
        token: stored,
      } as User;
      store.dispatch(rehydrate(user));
    } else {
      // New format: full user object
      const user = JSON.parse(stored) as User;

      // Validate token is not nested
      if (typeof user.token !== 'string' || !user.token.startsWith('eyJ')) {
        console.warn('⚠️ Invalid token format, clearing...');
        localStorage.removeItem('tempo-mode-auth');
        throw new Error('Invalid token');
      }

      store.dispatch(rehydrate(user));
    }
    console.log('✅ Auth rehydrated successfully');
  }
  // Clear old keys
  localStorage.removeItem('tempo-mode-auth-v1');
} catch (e) {
  console.error('Failed to rehydrate auth:', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </Provider>
  </StrictMode>
);
