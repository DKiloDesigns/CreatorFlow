'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

export default function EnterpriseTestPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3">Enterprise Test Page</Typography>
      <Typography variant="body1">This is a test page to isolate rendering issues.</Typography>
    </Box>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
