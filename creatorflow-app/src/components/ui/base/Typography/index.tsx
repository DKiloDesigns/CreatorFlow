'use client';

import React, { forwardRef } from 'react';
import { 
  Typography as MuiTypography, 
  TypographyProps as MuiTypographyProps
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface TypographyProps extends Omit<MuiTypographyProps, 'variant' | 'color' | 'align'> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  noWrap?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

// Custom styled MUI Typography
const StyledTypography = styled(MuiTypography, {
  shouldForwardProp: (prop) => !['size', 'weight', 'color', 'align', 'truncate'].includes(prop as string),
})<TypographyProps>(({ theme, size = 'base', weight = 'normal', color = 'default', align = 'left', truncate = false }) => ({
  lineHeight: 1.6,
  
  // Size variants
  ...(size === 'xs' && {
    fontSize: theme.typography.caption.fontSize,
  }),
  ...(size === 'sm' && {
    fontSize: theme.typography.body2.fontSize,
  }),
  ...(size === 'base' && {
    fontSize: theme.typography.body1.fontSize,
  }),
  ...(size === 'lg' && {
    fontSize: theme.typography.h6.fontSize,
  }),
  ...(size === 'xl' && {
    fontSize: theme.typography.h5.fontSize,
  }),
  ...(size === '2xl' && {
    fontSize: theme.typography.h4.fontSize,
  }),
  ...(size === '3xl' && {
    fontSize: theme.typography.h3.fontSize,
  }),
  ...(size === '4xl' && {
    fontSize: theme.typography.h2.fontSize,
  }),
  ...(size === '5xl' && {
    fontSize: theme.typography.h1.fontSize,
  }),
  ...(size === '6xl' && {
    fontSize: '3.75rem', // 60px
  }),
  
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
  ...(weight === 'extrabold' && {
    fontWeight: 800,
  }),
  
  // Color variants
  ...(color === 'default' && {
    color: theme.palette.text.primary,
  }),
  ...(color === 'muted' && {
    color: theme.palette.text.secondary,
  }),
  ...(color === 'primary' && {
    color: theme.palette.primary.main,
  }),
  ...(color === 'secondary' && {
    color: theme.palette.secondary.main,
  }),
  ...(color === 'success' && {
    color: theme.palette.success.main,
  }),
  ...(color === 'warning' && {
    color: theme.palette.warning.main,
  }),
  ...(color === 'error' && {
    color: theme.palette.error.main,
  }),
  ...(color === 'info' && {
    color: theme.palette.info.main,
  }),
  
  // Alignment
  textAlign: align,
  
  // Text behavior
  ...(truncate && {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  
  // Heading specific styles
  '&.heading': {
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
  },
  
  // Paragraph specific styles
  '&.paragraph': {
    lineHeight: 1.7,
    '&:not(:first-of-type)': {
      marginTop: theme.spacing(3),
    },
  },
}));

const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'p',
      size = 'base',
      weight = 'normal',
      color = 'default',
      align = 'left',
      truncate = false,
      noWrap = false,
      as,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || variant;

    // Map custom variant to MUI variant
    const muiVariant = variant.startsWith('h') ? variant : 'body1';
    
    // Map custom color to MUI color
    const muiColor = color === 'default' ? 'textPrimary' : 
                     color === 'muted' ? 'textSecondary' : 
                     color === 'primary' ? 'primary' : 
                     color === 'secondary' ? 'secondary' : 
                     color === 'success' ? 'success' : 
                     color === 'warning' ? 'warning' : 
                     color === 'error' ? 'error' : 
                     color === 'info' ? 'info' : 'textPrimary';

    // Determine if it's a heading
    const isHeading = variant.startsWith('h');
    const isParagraph = variant === 'p';

    return (
      <StyledTypography
        ref={ref}
        variant={muiVariant as any}
        component={Component}
        color={muiColor as any}
        size={size}
        weight={weight}
        align={align}
        truncate={truncate}
        noWrap={noWrap}
        className={`
          ${isHeading ? 'heading' : ''}
          ${isParagraph ? 'paragraph' : ''}
        `}
        {...props}
      >
        {children}
      </StyledTypography>
    );
  }
);

Typography.displayName = 'Typography';

// Convenience components for common use cases
export const H1 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="h1" {...props} />
);
H1.displayName = 'H1';

export const H2 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="h2" {...props} />
);
H2.displayName = 'H2';

export const H3 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="h3" {...props} />
);
H3.displayName = 'H3';

export const H4 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="h4" {...props} />
);
H4.displayName = 'H4';

export const H5 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="h5" {...props} />
);
H5.displayName = 'H5';

export const H6 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="h6" {...props} />
);
H6.displayName = 'H6';

export const P = forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="p" {...props} />
);
P.displayName = 'P';

export const Span = forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => <Typography ref={ref} variant="span" {...props} />
);
Span.displayName = 'Span';

export { Typography };
