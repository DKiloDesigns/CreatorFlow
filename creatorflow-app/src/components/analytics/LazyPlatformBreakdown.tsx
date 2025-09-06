'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

// Lazy load the platform breakdown chart
const PlatformBreakdown = dynamic(() => import('./PlatformBreakdown'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false
});

export default PlatformBreakdown;
