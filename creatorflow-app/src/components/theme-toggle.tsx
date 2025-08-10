'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode, Monitor } from '@mui/icons-material';

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
    return (
      <IconButton
        size="large"
        sx={{ minWidth: 44, minHeight: 44 }}
      >
        <LightMode />
      </IconButton>
    );
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
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      default:
        return <Monitor />;
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

  return (
    <Tooltip title={getTitle()} arrow>
      <IconButton
        onClick={toggleTheme}
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