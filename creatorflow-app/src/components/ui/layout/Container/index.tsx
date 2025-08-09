'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'custom';
  maxWidth?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  fluid?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      size = 'lg',
      maxWidth,
      padding = 'md',
      center = true,
      fluid = false,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'max-w-3xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
      custom: maxWidth ? `max-w-[${maxWidth}]` : 'max-w-6xl',
    };

    const paddingClasses = {
      none: 'px-0',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
      xl: 'px-12',
    };

    const baseClasses = cn(
      // Base styles
      'w-full',
      
      // Size constraints
      !fluid && sizeClasses[size],
      
      // Centering
      center && 'mx-auto',
      
      // Padding
      paddingClasses[padding],
      
      // Responsive padding adjustments
      'sm:px-6 lg:px-8',
      
      className
    );

    return (
      <div
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export { Container };
