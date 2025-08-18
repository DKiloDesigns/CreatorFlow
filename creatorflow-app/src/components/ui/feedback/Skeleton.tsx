'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  width?: string | number;
  height?: string | number;
  lines?: number;
  lineHeight?: number;
  spacing?: number;
  animated?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    variant = 'text',
    size = 'md',
    width,
    height,
    lines = 1,

    spacing = 0.5,
    animated = true,
    fullWidth = false,
    fullHeight = false,
    ...props 
  }, ref) => {
    const sizeClasses = {
      xs: 'h-3',
      sm: 'h-4',
      md: 'h-5',
      lg: 'h-6',
      xl: 'h-8',
      '2xl': 'h-10',
      '3xl': 'h-12',
      '4xl': 'h-16',
    };

    const variantClasses = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-md',
    };

    const animationClasses = animated ? 'animate-pulse' : '';

    const baseClasses = cn(
      'bg-muted',
      variantClasses[variant],
      animationClasses,
      className
    );

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className="space-y-2" {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(
                baseClasses,
                sizeClasses[size],
                fullWidth && 'w-full',
                index === lines - 1 && 'w-3/4'
              )}
              style={{
                width: index === lines - 1 ? '75%' : '100%',
                height: `${sizeClasses[size].replace('h-', '') * 0.25}rem`,
                marginBottom: `${spacing}rem`,
              }}
            />
          ))}
        </div>
      );
    }

    const skeletonWidth = width || (fullWidth ? '100%' : 'auto');
    const skeletonHeight = height || (fullHeight ? '100%' : sizeClasses[size]);

    return (
      <div
        ref={ref}
        className={baseClasses}
        style={{
          width: skeletonWidth,
          height: skeletonHeight,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Convenience components for common skeleton patterns
export const SkeletonText = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'> & { lines?: number }>(
  (props, ref) => <Skeleton ref={ref} variant="text" {...props} />
);
SkeletonText.displayName = 'SkeletonText';

export const SkeletonCircle = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'> & { size?: 'sm' | 'md' | 'lg' | 'xl' }>(
  ({ size = 'md', ...props }, ref) => <Skeleton ref={ref} variant="circular" size={size} {...props} />
);
SkeletonCircle.displayName = 'SkeletonCircle';

export const SkeletonRectangle = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  (props, ref) => <Skeleton ref={ref} variant="rectangular" {...props} />
);
SkeletonRectangle.displayName = 'SkeletonRectangle';

export const SkeletonRounded = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  (props, ref) => <Skeleton ref={ref} variant="rounded" {...props} />
);
SkeletonRounded.displayName = 'SkeletonRounded';

export { Skeleton };
