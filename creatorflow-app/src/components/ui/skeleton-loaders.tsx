'use client';

import React from 'react';
import { Skeleton, Box, Card, CardContent, CardHeader, Grid } from '@mui/material';

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardHeader
              avatar={<Skeleton variant="circular" width={40} height={40} />}
              title={<Skeleton variant="text" width="60%" />}
              subheader={<Skeleton variant="text" width="40%" />}
            />
            <CardContent>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

// Analytics Skeleton
export function AnalyticsSkeleton() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="30%" height={40} />
        <Skeleton variant="text" width="50%" height={24} />
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="rectangular" height={8} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title={<Skeleton variant="text" width="40%" />} />
            <CardContent>
              <Skeleton variant="rectangular" height={300} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title={<Skeleton variant="text" width="50%" />} />
            <CardContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="text" width="30%" height={32} />
      </Box>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            {Array.from({ length: columns }).map((_, index) => (
              <Grid item xs key={index}>
                <Skeleton variant="text" width="80%" />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Box key={rowIndex} sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Grid container spacing={2}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Grid item xs key={colIndex}>
                  <Skeleton variant="text" width="70%" />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// List Skeleton
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <Box>
      {Array.from({ length: items }).map((_, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </Box>
      ))}
    </Box>
  );
}

// Chart Skeleton
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card>
      <CardHeader
        title={<Skeleton variant="text" width="40%" />}
        subheader={<Skeleton variant="text" width="60%" />}
      />
      <CardContent>
        <Skeleton variant="rectangular" height={height} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="text" width="20%" />
        </Box>
      </CardContent>
    </Card>
  );
}

// Form Skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <Box>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
      {Array.from({ length: fields }).map((_, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} />
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Skeleton variant="rectangular" width={100} height={36} />
        <Skeleton variant="rectangular" width={100} height={36} />
      </Box>
    </Box>
  );
}

// Page Skeleton
export function PageSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="40%" height={48} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
      <DashboardSkeleton />
    </Box>
  );
}
