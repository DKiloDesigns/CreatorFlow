import * as React from "react";
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Typography with optimized variants
const StyledTypography = styled(MuiTypography, {
  shouldForwardProp: (prop) => !['variant', 'weight', 'spacing'].includes(prop as string),
})<MuiTypographyProps & { 
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  spacing?: 'compact' | 'default' | 'comfortable';
}>(({ theme, weight = 'normal', spacing = 'default' }) => ({
  // Weight variants
  ...(weight === 'light' && {
    fontWeight: 300,
  }),
  ...(weight === 'normal' && {
    fontWeight: 400,
  }),
  ...(weight === 'medium' && {
    fontWeight: 500,
  }),
  ...(weight === 'semibold' && {
    fontWeight: 600,
  }),
  ...(weight === 'bold' && {
    fontWeight: 700,
  }),
  
  // Spacing variants
  ...(spacing === 'compact' && {
    marginBottom: theme.spacing(0.5),
  }),
  ...(spacing === 'default' && {
    marginBottom: theme.spacing(1),
  }),
  ...(spacing === 'comfortable' && {
    marginBottom: theme.spacing(2),
  }),
}));

export interface TypographyProps extends Omit<MuiTypographyProps, 'variant'> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  spacing?: 'compact' | 'default' | 'comfortable';
}

export function Typography({ 
  className, 
  children, 
  variant = 'body1', 
  weight = 'normal',
  spacing = 'default',
  ...props 
}: TypographyProps) {
  return (
    <StyledTypography 
      className={className} 
      variant={variant} 
      weight={weight}
      spacing={spacing}
      {...props}
    >
      {children}
    </StyledTypography>
  );
}

// Predefined Typography components for common use cases
export function Heading1({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="h1" weight="bold" spacing="comfortable" {...props}>
      {children}
    </Typography>
  );
}

export function Heading2({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="h2" weight="semibold" spacing="comfortable" {...props}>
      {children}
    </Typography>
  );
}

export function Heading3({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="h3" weight="semibold" spacing="default" {...props}>
      {children}
    </Typography>
  );
}

export function Heading4({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="h4" weight="semibold" spacing="default" {...props}>
      {children}
    </Typography>
  );
}

export function Heading5({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="h5" weight="medium" spacing="default" {...props}>
      {children}
    </Typography>
  );
}

export function Heading6({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="h6" weight="medium" spacing="compact" {...props}>
      {children}
    </Typography>
  );
}

export function Subtitle1({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="subtitle1" weight="medium" spacing="compact" {...props}>
      {children}
    </Typography>
  );
}

export function Subtitle2({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="subtitle2" weight="medium" spacing="compact" {...props}>
      {children}
    </Typography>
  );
}

export function Body1({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="body1" weight="normal" spacing="default" {...props}>
      {children}
    </Typography>
  );
}

export function Body2({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="body2" weight="normal" spacing="compact" {...props}>
      {children}
    </Typography>
  );
}

export function Caption({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="caption" weight="normal" spacing="compact" {...props}>
      {children}
    </Typography>
  );
}

export function Overline({ children, ...props }: Omit<TypographyProps, 'variant' | 'weight'>) {
  return (
    <Typography variant="overline" weight="medium" spacing="compact" {...props}>
      {children}
    </Typography>
  );
}
