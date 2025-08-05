"use client";

import React from 'react';
import { Box } from '@mui/material';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <AnalyticsDashboard />
    </Box>
  );
} 