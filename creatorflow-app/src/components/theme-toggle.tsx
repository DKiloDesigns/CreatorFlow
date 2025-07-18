'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  isLandingPage?: boolean;
}

export function ThemeToggle({ isLandingPage = false }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Sun className="h-4 w-4 text-black" />;
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getTitle = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system preference';
      default:
        return 'Switch to light mode';
    }
  };

  const getTextColor = () => {
    // Always use high contrast colors for visibility
    if (theme === 'dark') {
      return 'text-black'; // Black icon on dark background
    }
    return 'text-black'; // Black icon on light background
  };

  return (
    <button
      onClick={toggleTheme}
      title={getTitle()}
      className={cn(
        "h-11 w-11 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors",
        getTextColor()
      )}
    >
      {getIcon()}
    </button>
  );
} 