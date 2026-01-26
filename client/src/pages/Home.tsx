import { Link } from '@tanstack/react-router';

export default function Home() {
  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <h2>Welcome</h2>
      <p>
        Please <Link to="/login">login</Link> or{' '}
        <Link to="/register">register</Link> to continue.
      </p>
    </div>
  );
}
