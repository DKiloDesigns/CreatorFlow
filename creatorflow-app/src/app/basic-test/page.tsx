'use client';

import { Box, Typography, Container, Paper } from '@mui/material';

export default function BasicTestPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
        🚀 Basic Test Page
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          ✅ Basic MUI Components Working
        </Typography>
        <Typography variant="body2">
          If you can see this page, the basic MUI setup is working correctly.
        </Typography>
      </Paper>
    </Container>
  );
}
