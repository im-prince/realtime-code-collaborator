import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme);

  useEffect(() => {
    const html = document.documentElement;
    const watcher = new MutationObserver(() => setTheme(html.dataset.theme));

    watcher.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => watcher.disconnect();
  }, []);

  return theme;
}