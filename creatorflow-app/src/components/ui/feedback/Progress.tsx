'use client';

import React, { forwardRef } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  valuePosition?: 'top' | 'bottom' | 'left' | 'right' | 'inside';
  animated?: boolean;
  striped?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100,
    variant = 'default',
    size = 'md',
    showValue = false,
    valuePosition = 'top',
    animated = false,
    striped = false,
    rounded = 'md',
    fullWidth = false,
    label,
    helperText,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const getVariantColor = () => {
      switch (variant) {
        case 'success': return 'success';
        case 'warning': return 'warning';
        case 'error': return 'error';
        case 'info': return 'info';
        default: return 'primary';
      }
    };

    const getSize = () => {
      switch (size) {
        case 'sm': return 4;
        case 'md': return 6;
        case 'lg': return 8;
        default: return 6;
      }
    };

    const valueDisplay = showValue ? (
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 500, 
          color: 'text.secondary', 
          minWidth: '3rem', 
          textAlign: 'right' 
        }}
      >
        {Math.round(percentage)}%
      </Typography>
    ) : null;

    const progressBar = (
      <Box sx={{ position: 'relative', width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={getVariantColor()}
          sx={{
            height: getSize(),
            borderRadius: rounded === 'full' ? '50px' : rounded === 'lg' ? 2 : rounded === 'sm' ? 0.5 : 1,
            backgroundColor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              borderRadius: rounded === 'full' ? '50px' : rounded === 'lg' ? 2 : rounded === 'sm' ? 0.5 : 1,
            }
          }}
        />
        {valuePosition === 'inside' && showValue && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                color: 'primary.contrastText',
                fontSize: '0.75rem',
              }}
            >
              {Math.round(percentage)}%
            </Typography>
          </Box>
        )}
      </Box>
    );

    if (valuePosition === 'inside') {
      return (
        <Box
          ref={ref}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: fullWidth ? '100%' : 'auto',
          }}
          className={cn(className)}
          {...props}
        >
          {label && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                {label}
              </Typography>
            </Box>
          )}
          {progressBar}
          {helperText && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {helperText}
            </Typography>
          )}
        </Box>
      );
    }

    const getFlexDirection = () => {
      switch (valuePosition) {
        case 'top': return 'column-reverse';
        case 'bottom': return 'column';
        case 'left': return 'row-reverse';
        case 'right': return 'row';
        default: return 'column';
      }
    };

    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          flexDirection: getFlexDirection(),
          gap: valuePosition === 'left' || valuePosition === 'right' ? 2 : 1,
          alignItems: valuePosition === 'left' || valuePosition === 'right' ? 'center' : 'stretch',
          width: fullWidth ? '100%' : 'auto',
        }}
        className={cn(className)}
        {...props}
      >
        {label && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {label}
            </Typography>
            {showValue && valuePosition !== 'left' && valuePosition !== 'right' && valueDisplay}
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {showValue && (valuePosition === 'left' || valuePosition === 'right') && valueDisplay}
          {progressBar}
        </Box>
        {helperText && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {helperText}
          </Typography>
        )}
      </Box>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };