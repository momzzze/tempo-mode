import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, selectIsAuthed } from '../store';
import { loginUser } from '../store';
import { useRouter, Link } from '@tanstack/react-router';
import { toast } from '../components/toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthed = useAppSelector(selectIsAuthed);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success('Signed in successfully');
      router.navigate({ to: '/app' });
    } catch (e: any) {
      const message = e?.message ?? 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-w-lg p-4">
      <Card className="w-full max-w-2xl p-12">
        <CardHeader className="p-0 text-center space-y-3 mb-8">
          <div className="text-3xl uppercase tracking-[0.25em] text-white/90">
            Sign In
          </div>
          <CardDescription className="text-base text-white/70">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 flex justify-center">
          <form
            onSubmit={onSubmit}
            className="mx-auto w-full max-w-md space-y-8"
          >
            {/* Email */}
            <div className="flex flex-col gap-3">
              <label className="text-base uppercase tracking-widest text-white/90">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="
                
                w-full
                bg-transparent
                border-0
                border-b border-white/30
                focus:border-[var(--neon-400)]
                focus:outline-none
                py-3
                pl-2
                text-lg
                tracking-wide
                text-white
                
              "
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-3">
              <label className="text-base uppercase tracking-widest text-white/90">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="
                w-full
                bg-transparent
                border-0
                border-b border-white/30
                focus:border-[var(--neon-400)]
                focus:outline-none
                py-3
                pl-2
                text-lg
                tracking-wide
                text-white
              "
              />
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="
                rounded-md
                border border-white/15
                bg-black/20
                px-4 py-3
                text-sm tracking-wide
                text-white/80
                flex items-center gap-2
              "
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--status-bad)]/80" />
                <span>
                  <span className="uppercase tracking-widest text-white/60">
                    System:
                  </span>{' '}
                  {error}
                </span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full text-lg py-7"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>

            {/* Register Link */}
            <div className="text-center pt-4">
              <span className="text-white/60 text-base">
                Don't have an account?{' '}
              </span>
              <Link
                to="/register"
                className="text-[var(--neon-400)] hover:text-[var(--neon-300)] uppercase tracking-widest text-base transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
