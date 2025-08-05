'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { analyzeBundleSize } from '@/lib/performance-utils';

interface PerformanceMetrics {
  loadTime: number;
  bundleSize: string;
  memoryUsage: string;
  renderCount: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    bundleSize: '0 KB',
    memoryUsage: '0 MB',
    renderCount: 0,
  });

  useEffect(() => {
    // Track page load time
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));

    // Analyze bundle size
    analyzeBundleSize();

    // Track memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      }));
    }

    // Track render count
    let renderCount = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          renderCount++;
        }
      }
      setMetrics(prev => ({ ...prev, renderCount }));
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        p: 2,
        zIndex: 9999,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        maxWidth: 300,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Performance Monitor
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Load Time:</Typography>
          <Chip 
            label={`${metrics.loadTime.toFixed(2)}ms`} 
            size="small" 
            color={metrics.loadTime < 1000 ? 'success' : 'warning'}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Memory:</Typography>
          <Chip 
            label={metrics.memoryUsage} 
            size="small" 
            color="info"
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Renders:</Typography>
          <Chip 
            label={metrics.renderCount} 
            size="small" 
            color="secondary"
          />
        </Box>
      </Box>
    </Paper>
  );
} 