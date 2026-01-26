import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, selectIsAuthed } from '../store';
import { registerUser } from '../store';
import { useRouter } from '@tanstack/react-router';
import { toast } from '../components/toast';

export default function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthed = useAppSelector(selectIsAuthed);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthed) {
      router.navigate({ to: '/' });
    }
  }, [isAuthed, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password || !confirmPassword) {
      setError('Email and password are required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await dispatch(registerUser({ email, password })).unwrap();
      toast.success('Account created');
      router.navigate({ to: '/app' });
    } catch (e: any) {
      const message = e?.message ?? 'Register failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card card--overlay auth-card">
        <h2>Register</h2>
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
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
          {error && (
            <div className="terminal__line--warn" aria-live="polite">
              {error}
            </div>
          )}
          <div className="actions">
            <button className="btn btn--primary" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
