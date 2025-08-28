'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

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
    <Box sx={{ 
      position: 'fixed', 
      top: '80px', 
      left: '16px', 
      bgcolor: 'warning.100', 
      border: '1px solid', 
      borderColor: 'warning.400', 
      p: 2, 
      borderRadius: 2, 
      zIndex: 50, 
      fontSize: '0.75rem',
      '& .dark &': {
        bgcolor: 'warning.900'
      }
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Theme Debug:</Typography>
      <Typography variant="body2">Theme: {theme}</Typography>
      <Typography variant="body2">Resolved Theme: {resolvedTheme}</Typography>
      <Typography variant="body2">HTML class: {typeof document !== 'undefined' ? document.documentElement.className : 'N/A'}</Typography>
      <Typography variant="body2">Has dark class: {typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') ? 'Yes' : 'No' : 'N/A'}</Typography>
    </Box>
  );
} 