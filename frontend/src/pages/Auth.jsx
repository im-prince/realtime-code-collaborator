import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, login, saveToken } from '../lib/api.js';

export default function Auth({ mode }) {
  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const res = isSignup
        ? await signup(username.trim(), email.trim(), password)
        : await login(email.trim(), password);

      saveToken(res.token);
      navigate('/rooms');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="relative grid min-h-[calc(100vh-67px)] place-items-center px-6">
      <div className="blob" style={{ '--blobTint': 'rgba(245,165,36,.16)', top: 60, left: '18%' }} />
      <div className="blob" style={{ '--blobTint': 'rgba(167,139,250,.14)', bottom: 40, right: '20%', animationDelay: '.9s' }} />

      <form onSubmit={submit} className="glass relative w-full max-w-[400px] p-7">
        <h1 className="text-2xl font-bold text-[var(--tx)]">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-2 text-sm text-[var(--tx2)]">
          {isSignup
            ? 'Keep your interview rooms, snapshots, and history in one place.'
            : 'Sign in to reach your saved rooms.'}
        </p>

        {isSignup && (
          <>
            <label className="mt-6 block text-sm text-[var(--tx2)]">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="mayachen"
              maxLength={50}
              required
              className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-3.5 text-[var(--tx)] outline-none placeholder:text-[var(--tx3)] focus:border-[var(--accent)]"
            />
          </>
        )}

        <label className="mt-5 block text-sm text-[var(--tx2)]">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="maya@example.com"
          required
          className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-3.5 text-[var(--tx)] outline-none placeholder:text-[var(--tx3)] focus:border-[var(--accent)]"
        />

        <label className="mt-5 block text-sm text-[var(--tx2)]">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
          minLength={isSignup ? 8 : undefined}
          required
          className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-3.5 text-[var(--tx)] outline-none placeholder:text-[var(--tx3)] focus:border-[var(--accent)]"
        />

        {error && <p className="mt-4 text-sm text-[var(--danger)]">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 h-12 w-full rounded-xl bg-[var(--accent)] font-semibold text-[var(--accentInk)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
        </button>

        <p className="mt-5 text-center text-sm text-[var(--tx2)]">
          {isSignup ? 'Already have one? ' : 'New here? '}
          <Link to={isSignup ? '/signin' : '/signup'} className="text-[var(--accent)]">
            {isSignup ? 'Sign in' : 'Create an account'}
          </Link>
        </p>

        <p className="mt-2 text-center text-sm">
          <Link to="/new" className="text-[var(--tx3)] hover:text-[var(--tx2)]">
            or continue as a guest →
          </Link>
        </p>
      </form>
    </div>
  );
}