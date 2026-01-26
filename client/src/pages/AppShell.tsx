import { useEffect } from 'react';
import { useAuth, useAuthDispatch, logout } from '../store';
import { useRouter } from '@tanstack/react-router';

export default function AppShell() {
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  const router = useRouter();

  useEffect(() => {
    if (auth.status !== 'rehydrating' && (!auth.user || !auth.user.token)) {
      router.navigate({ to: '/login' });
    }
  }, [auth.status, auth.user, router]);

  if (auth.status === 'rehydrating') {
    return <div style={{ padding: 'var(--space-6)' }}>Loading…</div>;
  }

  if (!auth.user) return null;

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div
        style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}
      >
        <span>Signed in as {auth.user.email}</span>
        <button
          className="btn"
          onClick={() => {
            logout(dispatch);
            router.navigate({ to: '/login' });
          }}
        >
          Logout
        </button>
        {/* Pomodoro route will be added later */}
      </div>
      <div style={{ marginTop: 'var(--space-6)' }}>
        <p>Welcome to your app dashboard.</p>
      </div>
    </div>
  );
}
