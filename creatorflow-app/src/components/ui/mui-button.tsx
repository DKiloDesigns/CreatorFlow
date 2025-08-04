import * as React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled MUI Button with custom variants
const StyledButton = styled(MuiButton)<{ variant?: string; size?: string }>(
  ({ theme, variant, size }) => ({
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: 8,
    transition: 'all 0.2s ease-in-out',
    
    // Size variants
    ...(size === 'sm' && {
      padding: '6px 12px',
      fontSize: '0.875rem',
      minHeight: '32px',
    }),
    ...(size === 'default' && {
      padding: '8px 16px',
      fontSize: '0.875rem',
      minHeight: '36px',
    }),
    ...(size === 'lg' && {
      padding: '12px 24px',
      fontSize: '1rem',
      minHeight: '40px',
    }),
    ...(size === 'icon' && {
      padding: '8px',
      minWidth: '36px',
      minHeight: '36px',
    }),

    // Variant styles
    ...(variant === 'default' && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
    ...(variant === 'destructive' && {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
    ...(variant === 'outline' && {
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
      border: `2px solid ${theme.palette.divider}`,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderColor: theme.palette.primary.main,
      },
    }),
    ...(variant === 'secondary' && {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
    ...(variant === 'ghost' && {
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    }),
    ...(variant === 'link' && {
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
      textDecoration: 'underline',
      textDecorationColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
        textDecorationColor: theme.palette.primary.main,
      },
    }),
  })
);

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  // Map our variants to MUI variants
  const muiVariant = variant === 'outline' ? 'outlined' : 
                     variant === 'ghost' || variant === 'link' ? 'text' : 
                     'contained';

  return (
    <StyledButton
      variant={muiVariant}
      size={size}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
}

export { StyledButton }; 