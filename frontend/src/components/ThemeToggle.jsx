import { useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme);

  function flip() {
    const next = theme === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    setTheme(next);
  }

  return (
    <button
      onClick={flip}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-transparent text-[var(--tx2)] transition-colors hover:bg-[var(--solid2)] hover:text-[var(--tx)]"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}