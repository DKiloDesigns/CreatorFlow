'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  noWrap?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
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

    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    };

    const weightClasses = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    };

    const colorClasses = {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      info: 'text-info',
    };

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };

    const baseClasses = cn(
      // Base styles
      'leading-relaxed',
      
      // Size
      sizeClasses[size],
      
      // Weight
      weightClasses[weight],
      
      // Color
      colorClasses[color],
      
      // Alignment
      alignClasses[align],
      
      // Text behavior
      truncate && 'truncate',
      noWrap && 'whitespace-nowrap',
      
      // Heading specific styles
      variant.startsWith('h') && [
        'tracking-tight',
        variant === 'h1' && 'scroll-m-20 text-4xl font-extrabold lg:text-5xl',
        variant === 'h2' && 'scroll-m-20 border-b pb-2 text-3xl font-semibold first:mt-0',
        variant === 'h3' && 'scroll-m-20 text-2xl font-semibold',
        variant === 'h4' && 'scroll-m-20 text-xl font-semibold',
        variant === 'h5' && 'scroll-m-20 text-lg font-semibold',
        variant === 'h6' && 'scroll-m-20 text-base font-semibold',
      ],
      
      // Paragraph specific styles
      variant === 'p' && 'leading-7 [&:not(:first-child)]:mt-6',
      
      className
    );

    return (
      <Component
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {children}
      </Component>
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
