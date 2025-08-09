import * as React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom props for our styled component
interface StyledButtonProps {
  customVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  customSize?: 'default' | 'sm' | 'lg' | 'icon';
}

// Styled MUI Button with custom variants and SACA compliance
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => !['customVariant', 'customSize'].includes(prop as string),
})<StyledButtonProps>(({ theme, customVariant = 'default', customSize = 'default' }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: 8,
  transition: 'all 0.2s ease-in-out',
  
  // SACA: Ensure focus indicators are visible and meet WCAG standards
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
    boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
  },
  
  // SACA: Ensure sufficient touch target size (minimum 44px)
  minHeight: '44px',
  minWidth: '44px',
  
  // Size variants (adjusted for SACA compliance)
  ...(customSize === 'sm' && {
    padding: '8px 16px',
    fontSize: '0.875rem',
    minHeight: '44px',
    minWidth: '44px',
  }),
  ...(customSize === 'default' && {
    padding: '12px 20px',
    fontSize: '0.875rem',
    minHeight: '44px',
    minWidth: '44px',
  }),
  ...(customSize === 'lg' && {
    padding: '16px 28px',
    fontSize: '1rem',
    minHeight: '48px',
    minWidth: '48px',
  }),
  ...(customSize === 'icon' && {
    padding: '12px',
    minWidth: '44px',
    minHeight: '44px',
  }),

  // Variant styles
  ...(customVariant === 'default' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    '&:focus-visible': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
    },
  }),
  ...(customVariant === 'destructive' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    '&:focus-visible': {
      backgroundColor: theme.palette.error.dark,
      boxShadow: `0 0 0 4px ${theme.palette.error.main}20`,
    },
  }),
  ...(customVariant === 'outline' && {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    border: `2px solid ${theme.palette.divider}`,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
    },
    '&:focus-visible': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
    },
  }),
  ...(customVariant === 'secondary' && {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    '&:focus-visible': {
      backgroundColor: theme.palette.secondary.dark,
      boxShadow: `0 0 0 4px ${theme.palette.secondary.main}20`,
    },
  }),
  ...(customVariant === 'ghost' && {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus-visible': {
      backgroundColor: theme.palette.action.hover,
      boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
    },
  }),
  ...(customVariant === 'link' && {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    textDecorationColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
      textDecorationColor: theme.palette.primary.main,
    },
    '&:focus-visible': {
      backgroundColor: 'transparent',
      textDecorationColor: theme.palette.primary.main,
      boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
    },
  }),
}));

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  /** SACA: ARIA label for screen readers */
  ariaLabel?: string;
  /** SACA: ARIA describedby for additional context */
  ariaDescribedBy?: string;
  /** SACA: ARIA pressed state for toggle buttons */
  ariaPressed?: boolean;
  /** SACA: ARIA expanded state for expandable buttons */
  ariaExpanded?: boolean;
  /** SACA: ARIA controls for buttons that control other elements */
  ariaControls?: string;
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  ariaLabel,
  ariaDescribedBy,
  ariaPressed,
  ariaExpanded,
  ariaControls,
  ...props
}: ButtonProps) {
  // Map our variants to MUI variants
  const muiVariant = variant === 'outline' ? 'outlined' : 
                     variant === 'ghost' || variant === 'link' ? 'text' : 
                     'contained';

  // SACA: Prepare ARIA attributes
  const ariaProps: Record<string, any> = {};
  if (ariaLabel) ariaProps['aria-label'] = ariaLabel;
  if (ariaDescribedBy) ariaProps['aria-describedby'] = ariaDescribedBy;
  if (ariaPressed !== undefined) ariaProps['aria-pressed'] = ariaPressed;
  if (ariaExpanded !== undefined) ariaProps['aria-expanded'] = ariaExpanded;
  if (ariaControls) ariaProps['aria-controls'] = ariaControls;

  return (
    <StyledButton
      variant={muiVariant}
      customVariant={variant}
      customSize={size}
      className={className}
      role="button"
      tabIndex={0}
      {...ariaProps}
      {...props}
    >
      {children}
    </StyledButton>
  );
}

export { StyledButton }; 