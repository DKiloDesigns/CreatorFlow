'use client';

import React, { forwardRef } from 'react';
import { 
  Button as MuiButton, 
  ButtonProps as MuiButtonProps,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

// Custom styled MUI Button
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => !['rounded'].includes(prop as string),
})<ButtonProps>(({ theme, variant, size, rounded = 'md' }) => ({
  // Base styles
  transition: 'all 0.2s ease-in-out',
  '&:active': {
    transform: 'scale(0.95)',
  },
  
  // Border radius
  borderRadius: rounded === 'sm' ? theme.shape.borderRadius * 0.5 : 
               rounded === 'md' ? theme.shape.borderRadius : 
               rounded === 'lg' ? theme.shape.borderRadius * 1.5 : 
               '50px',
  
  // Size variants
  ...(size === 'sm' && {
    padding: theme.spacing(1, 1.5),
    fontSize: theme.typography.body2.fontSize,
  }),
  ...(size === 'md' && {
    padding: theme.spacing(1.5, 2),
    fontSize: theme.typography.body2.fontSize,
  }),
  ...(size === 'lg' && {
    padding: theme.spacing(2, 3),
    fontSize: theme.typography.body1.fontSize,
  }),
  ...(size === 'xl' && {
    padding: theme.spacing(2.5, 4),
    fontSize: theme.typography.h6.fontSize,
  }),
  
  // Variant styles
  ...(variant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: theme.shadows[4],
    },
    '&:focus': {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
      boxShadow: theme.shadows[4],
    },
    '&:focus': {
      boxShadow: `0 0 0 2px ${theme.palette.secondary.main}40`,
    },
  }),
  ...(variant === 'outline' && {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
    },
    '&:focus': {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
    },
  }),
  ...(variant === 'ghost' && {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus': {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
    },
  }),
  ...(variant === 'destructive' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
      boxShadow: theme.shadows[4],
    },
    '&:focus': {
      boxShadow: `0 0 0 2px ${theme.palette.error.main}40`,
    },
  }),
  ...(variant === 'link' && {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
    '&:focus': {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
    },
  }),
}));

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = 'md',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Map custom variants to MUI variants
    const muiVariant = variant === 'outline' ? 'outlined' : 
                       variant === 'ghost' ? 'text' : 
                       variant === 'link' ? 'text' : 'contained';
    
    // Map custom sizes to MUI sizes
    const muiSize = size === 'sm' ? 'small' : 
                    size === 'md' ? 'medium' : 
                    size === 'lg' ? 'large' : 'large';

    return (
      <StyledButton
        ref={ref}
        variant={muiVariant as any}
        size={muiSize as any}
        disabled={disabled || loading}
        fullWidth={fullWidth}
        rounded={rounded}
        startIcon={!loading && leftIcon}
        endIcon={!loading && rightIcon}
        {...props}
      >
        {loading && (
          <CircularProgress 
            size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} 
            sx={{ mr: 1 }} 
          />
        )}
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
