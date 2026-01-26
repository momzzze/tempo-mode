import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { AppRouter } from './router';
import { store } from './store';
import { initThemeOnce } from './theme/useTheme';
import { ToastProvider } from './components/ToastProvider';

initThemeOnce();

// Clear any old localStorage auth data
try {
  window.localStorage.removeItem('tempo-mode-auth-v1');
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
