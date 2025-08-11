'use client';

import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useAppTheme } from '@/components/providers/mui-theme-provider';
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  _isLandingPage?: boolean;
}

export function ThemeToggle({ _isLandingPage = false }: ThemeToggleProps) {
  const [fallbackTheme, setFallbackTheme] = useState<'light' | 'dark'>('light');
  const [isContextAvailable, setIsContextAvailable] = useState(false);
  
  // Try to use the theme context, but fall back gracefully if not available
  let theme: 'light' | 'dark' = fallbackTheme;
  let toggleTheme: (() => void) | undefined;
  
  try {
    const context = useAppTheme();
    theme = context.theme;
    toggleTheme = context.toggleTheme;
    if (!isContextAvailable) setIsContextAvailable(true);
  } catch (_error) {
    // Context not available, use fallback
    if (isContextAvailable) setIsContextAvailable(false);
  }

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

  const getIcon = () => {
    return theme === 'dark' ? <LightMode /> : <DarkMode />;
  };

  const getTitle = () => {
    return theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  };

  const handleClick = () => {
    if (toggleTheme) {
      toggleTheme();
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