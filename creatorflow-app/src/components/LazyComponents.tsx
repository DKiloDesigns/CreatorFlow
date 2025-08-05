'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

// Lazy load heavy components
export const LazyAnalyticsDashboard = dynamic(
  () => import('./analytics/AnalyticsDashboard'),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false
  }
);

export const LazyDataTable = dynamic(
  () => import('./ui/mui-data-table').then(mod => ({ default: mod.MuiDataTable })),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    ),
    ssr: false
  }
);

export const LazyEnhancedNavigation = dynamic(
  () => import('./ui/mui-enhanced-nav').then(mod => ({ default: mod.MuiEnhancedNavigation })),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }
);

export const LazyNotificationCenter = dynamic(
  () => import('./ui/mui-notification').then(mod => ({ default: mod.NotificationCenter })),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    ),
    ssr: false
  }
);

// Lazy load pages
export const LazyAIToolsPage = dynamic(
  () => import('../app/dashboard/ai-tools/page'),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false
  }
);

export const LazyTeamsPage = dynamic(
  () => import('../app/dashboard/teams/page'),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false
  }
);

export const LazyCollabsPage = dynamic(
  () => import('../app/dashboard/collabs/page'),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false
  }
);

// Generic loading component
export const LoadingFallback = ({ size = 24 }: { size?: number }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
    <CircularProgress size={size} />
  </Box>
);

// Suspense wrapper
export const withSuspense = (Component: React.ComponentType<any>, fallback?: React.ReactNode) => {
  return (props: any) => (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
}; 