'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal' | 'vertical-reverse' | 'horizontal-reverse';
  spacing?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number };
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  divider?: React.ReactNode;
  center?: boolean;
}

const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = 'vertical',
      spacing = 4,
      align = 'start',
      justify = 'start',
      wrap = false,
      divider,
      center = false,
      children,
      ...props
    },
    ref
  ) => {
    // Helper function to generate responsive spacing classes
    const generateSpacingClasses = (
      value: number | Record<string, number>,
      prefix: string
    ): string => {
      if (typeof value === 'number') {
        return `${prefix}-${value}`;
      }
      
      const classes: string[] = [];
      Object.entries(value).forEach(([breakpoint, val]) => {
        if (breakpoint === 'base') {
          classes.push(`${prefix}-${val}`);
        } else {
          classes.push(`${breakpoint}:${prefix}-${val}`);
        }
      });
      
      return classes.join(' ');
    };

    // Direction classes
    const directionClasses = {
      vertical: 'flex flex-col',
      horizontal: 'flex flex-row',
      'vertical-reverse': 'flex flex-col-reverse',
      'horizontal-reverse': 'flex flex-row-reverse',
    };

    // Spacing classes
    const spacingClasses = direction === 'vertical' || direction === 'vertical-reverse'
      ? generateSpacingClasses(spacing, 'space-y')
      : generateSpacingClasses(spacing, 'space-x');

    // Alignment classes
    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    };

    // Justify classes
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    const baseClasses = cn(
      // Base styles
      directionClasses[direction],
      
      // Spacing
      spacingClasses,
      
      // Alignment
      alignClasses[align],
      justifyClasses[justify],
      
      // Wrapping
      wrap && 'flex-wrap',
      
      // Centering
      center && 'items-center justify-center',
      
      className
    );

    // Process children to add dividers
    const renderChildren = () => {
      if (!divider || !children) return children;
      
      const childrenArray = React.Children.toArray(children);
      const result = [];
      
      childrenArray.forEach((child, index) => {
        result.push(child);
        if (index < childrenArray.length - 1) {
          result.push(
            <div key={`divider-${index}`} className="flex-shrink-0">
              {divider}
            </div>
          );
        }
      });
      
      return result;
    };

    return (
      <div
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {renderChildren()}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

// Convenience components for common use cases
export const VStack = forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'direction'>
>(
  (props, ref) => <Stack ref={ref} direction="vertical" {...props} />
);
VStack.displayName = 'VStack';

export const HStack = forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'direction'>
>(
  (props, ref) => <Stack ref={ref} direction="horizontal" {...props} />
);
HStack.displayName = 'HStack';

// Stack item component for better composition
export const StackItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    flex?: boolean | 'auto' | 'initial' | 'none' | number;
    grow?: boolean | number;
    shrink?: boolean | number;
    basis?: string | number;
    center?: boolean;
  }
>(
  (
    {
      className,
      flex = false,
      grow = false,
      shrink = false,
      basis,
      center = false,
      children,
      ...props
    },
    ref
  ) => {
    const flexClasses = cn(
      // Flex properties
      flex && (typeof flex === 'boolean' ? 'flex-1' : `flex-${flex}`),
      grow && (typeof grow === 'boolean' ? 'flex-grow' : `flex-grow-${grow}`),
      shrink && (typeof shrink === 'boolean' ? 'flex-shrink' : `flex-shrink-${shrink}`),
      basis && `flex-basis-${basis}`,
      
      // Centering
      center && 'flex items-center justify-center',
      
      className
    );

    return (
      <div
        ref={ref}
        className={flexClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StackItem.displayName = 'StackItem';

export { Stack };
