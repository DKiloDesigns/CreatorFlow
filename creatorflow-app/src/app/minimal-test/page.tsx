'use client';

import { Box, Typography, Container, Paper } from '@mui/material';

export default function MinimalTestPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
        🚀 Minimal Test
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          ✅ Basic MUI Test
        </Typography>
        <Typography variant="body2">
          If you can see this, basic MUI is working!
        </Typography>
      </Paper>
    </Container>
  );
}
