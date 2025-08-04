import React from 'react';
import {
  CircularProgress,
  LinearProgress,
  Skeleton,
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'inherit';
  message?: string;
}

export function LoadingSpinner({ size = 'medium', color = 'primary', message }: LoadingSpinnerProps) {
  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 48;
      default: return 32;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={getSize()} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}

interface LoadingBarProps {
  variant?: 'determinate' | 'indeterminate';
  value?: number;
  color?: 'primary' | 'secondary' | 'inherit';
  message?: string;
}

export function LoadingBar({ variant = 'indeterminate', value, color = 'primary', message }: LoadingBarProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress variant={variant} value={value} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

interface SkeletonCardProps {
  variant?: 'card' | 'list' | 'table';
  count?: number;
}

export function SkeletonCard({ variant = 'card', count = 1 }: SkeletonCardProps) {
  const renderCardSkeleton = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Box>
        <Skeleton variant="rectangular" height={100} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
      <Skeleton variant="circular" width={32} height={32} />
      <Box sx={{ ml: 2, flexGrow: 1 }}>
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="50%" />
      </Box>
    </Box>
  );

  const renderTableSkeleton = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
      <Skeleton variant="rectangular" width={40} height={20} sx={{ mr: 2 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="60%" />
      </Box>
      <Skeleton variant="text" width="20%" />
    </Box>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'list':
        return renderListSkeleton();
      case 'table':
        return renderTableSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index}>
          {renderSkeleton()}
        </Box>
      ))}
    </Stack>
  );
}

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({ open, message, children }: LoadingOverlayProps) {
  if (!open) return <>{children}</>;

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <LoadingSpinner size="large" />
          {message && (
            <Typography variant="body1" color="text.secondary">
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
}

export function LoadingState({ 
  loading, 
  error, 
  children, 
  loadingMessage = 'Loading...', 
  errorMessage = 'An error occurred' 
}: LoadingStateProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <LoadingSpinner size="large" message={loadingMessage} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {errorMessage}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
}

interface ProgressIndicatorProps {
  current: number;
  total: number;
  message?: string;
  showPercentage?: boolean;
}

export function ProgressIndicator({ current, total, message, showPercentage = true }: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
        {showPercentage && (
          <Typography variant="body2" color="text.secondary">
            {percentage}%
          </Typography>
        )}
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={percentage} 
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
} 