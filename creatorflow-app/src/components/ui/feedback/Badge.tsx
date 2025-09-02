'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Box } from '@mui/material';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  interactive?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    rounded = 'md',
    dismissible = false,
    onDismiss,
    icon,
    iconPosition = 'left',
    children,
    fullWidth = false,
    interactive = false,
    ...props 
  }, ref) => {
    const variantStyles = {
      default: { bgcolor: 'grey.100', color: 'text.secondary', borderColor: 'grey.300' },
      primary: { bgcolor: 'primary.main', color: 'primary.contrastText', borderColor: 'primary.main' },
      secondary: { bgcolor: 'secondary.main', color: 'secondary.contrastText', borderColor: 'secondary.main' },
      success: { bgcolor: 'success.main', color: 'success.contrastText', borderColor: 'success.main' },
      warning: { bgcolor: 'warning.main', color: 'warning.contrastText', borderColor: 'warning.main' },
      error: { bgcolor: 'error.main', color: 'error.contrastText', borderColor: 'error.main' },
      info: { bgcolor: 'info.main', color: 'info.contrastText', borderColor: 'info.main' },
      outline: { bgcolor: 'transparent', color: 'text.primary', borderColor: 'grey.300' },
      ghost: { bgcolor: 'transparent', color: 'text.primary' },
    };

    const sizeStyles = {
      sm: { px: 1, py: 0.25, fontSize: '0.75rem' },
      md: { px: 1.25, py: 0.5, fontSize: '0.875rem' },
      lg: { px: 1.5, py: 0.75, fontSize: '1rem' },
    };

    const roundedStyles = {
      sm: { borderRadius: 1 },
      md: { borderRadius: 2 },
      lg: { borderRadius: 3 },
      full: { borderRadius: '50%' },
    };

    const interactiveStyles = interactive ? { 
      cursor: 'pointer', 
      transition: 'transform 0.2s ease-in-out',
      '&:hover': { transform: 'scale(1.05)' }
    } : {};

    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDismiss) {
        onDismiss();
      }
    };

    return (
      <Box
        component="span"
        ref={ref}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          border: 1,
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...roundedStyles[rounded],
          ...interactiveStyles,
          ...(fullWidth && { width: '100%', justifyContent: 'center' }),
        }}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <Box sx={{ flexShrink: 0 }}>
            {icon}
          </Box>
        )}
        
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
        
        {icon && iconPosition === 'right' && (
          <Box sx={{ flexShrink: 0 }}>
            {icon}
          </Box>
        )}
        
        {dismissible && (
          <Box
            component="button"
            type="button"
            onClick={handleDismiss}
            sx={{
              flexShrink: 0,
              ml: 0.5,
              p: 0.25,
              borderRadius: 0.5,
              transition: 'colors',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.1)',
                '& .dark &': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              },
              '&:focus': {
                outline: 'none',
                ring: 2,
                ringOffset: 1,
                ringColor: 'currentColor'
              }
            }}
            aria-label="Remove badge"
          >
            <X style={{ width: 12, height: 12 }} />
          </Box>
        )}
      </Box>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
