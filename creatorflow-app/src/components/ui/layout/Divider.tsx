'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  withLabel?: boolean;
  labelPosition?: 'left' | 'center' | 'right';
  labelContent?: React.ReactNode;
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ 
    className, 
    orientation = 'horizontal', 
    variant = 'solid', 
    size = 'md', 
    spacing = 'md',
    color = 'default',
    withLabel = false,
    labelPosition = 'center',
    labelContent,
    children,
    ...props 
  }, ref) => {
    const sizeClasses = {
      xs: orientation === 'horizontal' ? 'h-px' : 'w-px',
      sm: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
      md: orientation === 'horizontal' ? 'h-px' : 'w-px',
      lg: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
      xl: orientation === 'horizontal' ? 'h-1' : 'w-1',
    };

    const spacingClasses = {
      none: orientation === 'horizontal' ? 'my-0' : 'mx-0',
      sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
      md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
      lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
      xl: orientation === 'horizontal' ? 'my-8' : 'mx-8',
    };

    const variantClasses = {
      solid: 'border-current',
      dashed: 'border-dashed border-current',
      dotted: 'border-dotted border-current',
      gradient: 'bg-gradient-to-r from-transparent via-current to-transparent',
    };

    const colorClasses = {
      default: 'border-border text-border',
      muted: 'border-muted text-muted-foreground',
      primary: 'border-primary text-primary',
      secondary: 'border-secondary text-secondary',
      success: 'border-success text-success',
      warning: 'border-warning text-warning',
      error: 'border-error text-error',
    };

    const labelPositionClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    const baseClasses = cn(
      'flex items-center',
      orientation === 'horizontal' ? 'w-full' : 'h-full',
      spacingClasses[spacing],
      className
    );

    const lineClasses = cn(
      'flex-shrink-0',
      sizeClasses[size],
      variantClasses[variant],
      colorClasses[color],
      orientation === 'horizontal' ? 'flex-1' : 'h-full'
    );

    if (withLabel || labelContent || children) {
      return (
        <div ref={ref} className={baseClasses} {...props}>
          <div className={cn(lineClasses, labelPosition === 'left' && 'hidden')} />
          <div className={cn(
            'px-3 text-sm text-muted-foreground whitespace-nowrap',
            labelPositionClasses[labelPosition]
          )}>
            {labelContent || children}
          </div>
          <div className={cn(lineClasses, labelPosition === 'right' && 'hidden')} />
        </div>
      );
    }

    return (
      <div 
        ref={ref} 
        className={cn(
          baseClasses,
          orientation === 'horizontal' ? 'justify-center' : 'justify-center'
        )} 
        {...props}
      >
        <div className={cn(lineClasses, 'w-full')} />
      </div>
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };
