'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeDebug() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 p-4 rounded-lg z-50 text-xs">
      <h3 className="font-bold mb-2">Theme Debug:</h3>
      <p>Theme: {theme}</p>
      <p>Resolved Theme: {resolvedTheme}</p>
      <p>HTML class: {typeof document !== 'undefined' ? document.documentElement.className : 'N/A'}</p>
      <p>Has dark class: {typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') ? 'Yes' : 'No' : 'N/A'}</p>
    </div>
  );
} 