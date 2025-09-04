'use client';

import { MinimalThemeToggle } from '@/components/ui/MinimalThemeToggle';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';

export default function SimpleTestPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
        🚀 Theme System Test
      </Typography>
      
      <Grid container spacing={4}>
        {/* Theme Toggle Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              🌙 Dark Mode 2.0
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Test the new theme system with smooth transitions
            </Typography>
            <MinimalThemeToggle />
          </Paper>
        </Grid>

        {/* Theme Toggle Variants */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              🎨 Theme Toggle Variants
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <MinimalThemeToggle />
              <MinimalThemeToggle />
              <MinimalThemeToggle />
            </Box>
          </Paper>
        </Grid>

        {/* Theme Colors Test */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              🎨 Theme Colors Test
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1 }}>
                Primary
              </Box>
              <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'secondary.contrastText', borderRadius: 1 }}>
                Secondary
              </Box>
              <Box sx={{ p: 2, bgcolor: 'success.main', color: 'success.contrastText', borderRadius: 1 }}>
                Success
              </Box>
              <Box sx={{ p: 2, bgcolor: 'warning.main', color: 'warning.contrastText', borderRadius: 1 }}>
                Warning
              </Box>
              <Box sx={{ p: 2, bgcolor: 'error.main', color: 'error.contrastText', borderRadius: 1 }}>
                Error
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
