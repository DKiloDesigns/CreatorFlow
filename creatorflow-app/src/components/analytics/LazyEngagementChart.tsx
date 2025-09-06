'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

// Lazy load the chart component
const EngagementChart = dynamic(() => import('./EngagementChart'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  ),
  ssr: false
});

export default EngagementChart;
