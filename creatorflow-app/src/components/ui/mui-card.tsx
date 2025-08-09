import * as React from "react";
import { Card as MuiCard, CardProps as MuiCardProps } from "@mui/material";
import { CardContent as MuiCardContent, CardContentProps as MuiCardContentProps } from "@mui/material";
import { CardHeader as MuiCardHeader, CardHeaderProps as MuiCardHeaderProps } from "@mui/material";
import { CardActions as MuiCardActions, CardActionsProps as MuiCardActionsProps } from "@mui/material";
import { Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled MUI Card with optimized variants and SACA compliance
const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => !['variant', 'elevation'].includes(prop as string),
})<MuiCardProps & { variant?: 'default' | 'elevated' | 'outlined' | 'flat' }>(({ theme, variant = 'default' }) => ({
  borderRadius: 12,
  transition: 'all 0.2s ease-in-out',
  // SACA: Ensure focus indicators are visible
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
  ...(variant === 'default' && {
    boxShadow: theme.palette.mode === 'light' 
      ? '0 1px 3px rgba(0, 0, 0, 0.1)' 
      : '0 1px 3px rgba(0, 0, 0, 0.3)',
    '&:hover': {
      boxShadow: theme.palette.mode === 'light'
        ? '0 4px 12px rgba(0, 0, 0, 0.15)'
        : '0 4px 12px rgba(0, 0, 0, 0.4)',
      transform: 'translateY(-1px)',
    },
  }),
  ...(variant === 'elevated' && {
    boxShadow: theme.palette.mode === 'light'
      ? '0 4px 12px rgba(0, 0, 0, 0.15)'
      : '0 4px 12px rgba(0, 0, 0, 0.4)',
    '&:hover': {
      boxShadow: theme.palette.mode === 'light'
        ? '0 8px 24px rgba(0, 0, 0, 0.2)'
        : '0 8px 24px rgba(0, 0, 0, 0.5)',
      transform: 'translateY(-2px)',
    },
  }),
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 2px 8px rgba(0, 0, 0, 0.1)`,
    },
  }),
  ...(variant === 'flat' && {
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
}));

// Styled Card Content with consistent spacing and SACA compliance
const StyledCardContent = styled(MuiCardContent, {
  shouldForwardProp: (prop) => !['spacing'].includes(prop as string),
})<MuiCardContentProps & { spacing?: 'compact' | 'default' | 'comfortable' }>(({ theme, spacing = 'default' }) => ({
  ...(spacing === 'compact' && {
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  }),
  ...(spacing === 'default' && {
    padding: theme.spacing(3),
    '&:last-child': {
      paddingBottom: theme.spacing(3),
    },
  }),
  ...(spacing === 'comfortable' && {
    padding: theme.spacing(4),
    '&:last-child': {
      paddingBottom: theme.spacing(4),
    },
  }),
}));

// Styled Card Header with optimized layout and SACA compliance
const StyledCardHeader = styled(MuiCardHeader, {
  shouldForwardProp: (prop) => !['variant'].includes(prop as string),
})<MuiCardHeaderProps & { variant?: 'default' | 'compact' | 'comfortable' }>(({ theme, variant = 'default' }) => ({
  ...(variant === 'compact' && {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  }),
  ...(variant === 'default' && {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(1.5),
  }),
  ...(variant === 'comfortable' && {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  }),
}));

// Styled Card Actions with consistent spacing and SACA compliance
const StyledCardActions = styled(MuiCardActions, {
  shouldForwardProp: (prop) => !['spacing'].includes(prop as string),
})<MuiCardActionsProps & { spacing?: 'compact' | 'default' | 'comfortable' }>(({ theme, spacing = 'default' }) => ({
  ...(spacing === 'compact' && {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
  }),
  ...(spacing === 'default' && {
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1.5),
  }),
  ...(spacing === 'comfortable' && {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(2),
  }),
}));

// Styled Typography for descriptions with SACA compliance
const StyledCardDescription = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  lineHeight: 1.5,
}));

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  /** SACA: ARIA label for screen readers */
  ariaLabel?: string;
  /** SACA: ARIA describedby for additional context */
  ariaDescribedBy?: string;
}

export function Card({ 
  className, 
  children, 
  variant = 'default', 
  ariaLabel,
  ariaDescribedBy,
  ...props 
}: CardProps) {
  return (
    <StyledCard 
      className={className} 
      variant={variant} 
      role="article"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={0}
      {...props}
    >
      {children}
    </StyledCard>
  );
}

export interface CardHeaderProps extends Omit<MuiCardHeaderProps, 'title' | 'subheader' | 'variant'> {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  variant?: 'default' | 'compact' | 'comfortable';
  /** SACA: ARIA label for screen readers */
  ariaLabel?: string;
}

export function CardHeader({ 
  className, 
  children, 
  variant = 'default', 
  ariaLabel,
  ...props 
}: CardHeaderProps) {
  return (
    <StyledCardHeader 
      className={className} 
      variant={variant} 
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </StyledCardHeader>
  );
}

export function CardDescription({ className, children, ...props }: TypographyProps) {
  return (
    <StyledCardDescription variant="body2" className={className} {...props}>
      {children}
    </StyledCardDescription>
  );
}

export interface CardContentProps extends Omit<MuiCardContentProps, 'spacing'> {
  spacing?: 'compact' | 'default' | 'comfortable';
  /** SACA: ARIA label for screen readers */
  ariaLabel?: string;
}

export function CardContent({ 
  className, 
  children, 
  spacing = 'default', 
  ariaLabel,
  ...props 
}: CardContentProps) {
  return (
    <StyledCardContent 
      className={className} 
      spacing={spacing} 
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </StyledCardContent>
  );
}

export interface CardFooterProps extends Omit<MuiCardActionsProps, 'spacing'> {
  spacing?: 'compact' | 'default' | 'comfortable';
  /** SACA: ARIA label for screen readers */
  ariaLabel?: string;
}

export function CardFooter({ 
  className, 
  children, 
  spacing = 'default', 
  ariaLabel,
  ...props 
}: CardFooterProps) {
  return (
    <StyledCardActions 
      className={className} 
      spacing={spacing} 
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </StyledCardActions>
  );
}

// Alias for backward compatibility
export const CardAction = CardFooter; 