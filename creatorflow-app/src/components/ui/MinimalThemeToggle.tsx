'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useMinimalTheme } from '@/contexts/MinimalThemeContext';

export function MinimalThemeToggle() {
  const { isDark, toggleMode } = useMinimalTheme();

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton onClick={toggleMode}>
        {isDark ? '🌙' : '☀️'}
      </IconButton>
    </Tooltip>
  );
}
