'use client';

import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material'; // Direct import from @mui/icons-material
import { useMinimalTheme } from '@/contexts/MinimalThemeContext';
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  _isLandingPage?: boolean;
}

export function ThemeToggle({ _isLandingPage = false }: ThemeToggleProps) {
  const [fallbackTheme, setFallbackTheme] = useState<'light' | 'dark'>('light');

  // Call hook unconditionally, it now returns undefined if no provider
  const context = useMinimalTheme();

  const theme = context ? (context.isDark ? 'dark' : 'light') : fallbackTheme;
  const toggleMode = context?.toggleMode;

  // Fallback theme toggle function
  const handleFallbackToggle = () => {
    const newTheme = fallbackTheme === 'light' ? 'dark' : 'light';
    setFallbackTheme(newTheme);
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('fallback-theme', newTheme);
    }
  };

  // Initialize fallback theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fallback-theme');
      if (stored === 'dark' || stored === 'light') {
        setFallbackTheme(stored);
      } else {
        // Default to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setFallbackTheme(prefersDark ? 'dark' : 'light');
      }
    }
  }, []);

  // Effect to manage body class when context is NOT available (i.e., on public pages outside the provider)
  useEffect(() => {
    if (!context && typeof window !== 'undefined') {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(fallbackTheme);
    }
  }, [context, fallbackTheme]);

  const getIcon = () => {
    return theme === 'dark' ? <LightMode /> : <DarkMode />;
  };

  const getTitle = () => {
    return theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  };

  const handleClick = () => {
    if (toggleMode) {
      toggleMode();
    } else {
      handleFallbackToggle();
    }
  };

  return (
    <Tooltip title={getTitle()} arrow>
      <IconButton
        onClick={handleClick}
        size="large"
        sx={{
          minWidth: 44,
          minHeight: 44,
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
} 