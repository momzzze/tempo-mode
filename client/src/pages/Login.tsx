import { useState } from 'react';
import { useAuthDispatch } from '../store';
import { performLogin } from '../store';
import * as authApi from '../api/auth';
import { useRouter } from '@tanstack/react-router';

export default function Login() {
  const dispatch = useAuthDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      await performLogin(dispatch, authApi.login, { email, password });
      router.navigate({ to: '/app' });
    } catch (e: any) {
      setError(e?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card card--overlay auth-card">
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {error && (
            <div className="terminal__line--warn" aria-live="polite">
              {error}
            </div>
          )}
          <div className="actions">
            <button className="btn btn--primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
