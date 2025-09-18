'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useMinimalTheme } from '@/contexts/MinimalThemeContext';

export default function TestThemePage() {
  const { isDark, toggleMode } = useMinimalTheme();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Theme Toggle Test
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Current theme: {isDark ? 'Dark' : 'Light'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <ThemeToggle variant="icon" />
          <Button variant="outlined" onClick={toggleMode}>
            Toggle Theme (Button)
          </Button>
        </Box>
        
        <Box sx={{ 
          p: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          border: 1, 
          borderColor: 'divider' 
        }}>
          <Typography variant="h6" gutterBottom>
            Theme Test Card
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This card should change appearance when you toggle the theme.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
