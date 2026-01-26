import { useEffect } from 'react';
import { useAuth, useAppDispatch, logout } from '../store';
import { useRouter } from '@tanstack/react-router';
import { toast } from '../components/toast';

export default function AppShell() {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (auth.status !== 'loading' && (!auth.user || !auth.user.token)) {
      router.navigate({ to: '/login' });
    }
  }, [auth.status, auth.user, router]);

  if (auth.status === 'loading') {
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
            dispatch(logout());
            toast.info('Signed out');
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
