import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <Box className={className}>
      <CircularProgress 
        size={sizeMap[size]} 
        sx={{ 
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
    </Box>
  );
}
