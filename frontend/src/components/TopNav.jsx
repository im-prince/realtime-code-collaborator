import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, clearToken } from '../lib/api.js';
import ThemeToggle from './ThemeToggle.jsx';

export default function TopNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const signedIn = Boolean(getToken());

  function signOut() {
    clearToken();
    navigate('/');
  }

  if (pathname.startsWith('/room/')) return null;

  return (
    <header className="flex h-[67px] items-center justify-between border-b border-[var(--border)] px-6">
      <Link to="/" className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] text-[var(--accentInk)]">
          ◈
        </span>
        <span className="font-bold text-[var(--tx)]">Collaborator</span>
      </Link>

      <nav className="flex items-center gap-2">
        {signedIn && (
          <Link
            to="/rooms"
            className="rounded-lg px-3 py-2 text-sm text-[var(--tx2)] transition-colors hover:text-[var(--tx)]"
          >
            My Rooms
          </Link>
        )}

        <Link
          to="/new"
          className="rounded-lg px-3 py-2 text-sm text-[var(--tx2)] transition-colors hover:text-[var(--tx)]"
        >
          New Room
        </Link>

        <ThemeToggle />

        {signedIn ? (
          <button
            onClick={signOut}
            className="rounded-lg px-3 py-2 text-sm text-[var(--tx2)] transition-colors hover:text-[var(--tx)]"
          >
            Sign out
          </button>
        ) : (
          <>
            <Link
              to="/signin"
              className="rounded-lg px-3 py-2 text-sm text-[var(--tx2)] transition-colors hover:text-[var(--tx)]"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accentInk)] transition-opacity hover:opacity-90"
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}