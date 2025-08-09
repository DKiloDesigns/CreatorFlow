'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number };
  gap?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number };
  rowGap?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number };
  colGap?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number };
  autoFit?: boolean;
  autoFill?: boolean;
  center?: boolean;
  stretch?: boolean;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      cols = 1,
      gap = 4,
      rowGap,
      colGap,
      autoFit = false,
      autoFill = false,
      center = false,
      stretch = false,
      children,
      ...props
    },
    ref
  ) => {
    // Helper function to generate responsive classes
    const generateResponsiveClasses = (
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

    // Generate grid column classes
    const gridColsClasses = autoFit
      ? 'grid-cols-auto-fit'
      : autoFill
      ? 'grid-cols-auto-fill'
      : generateResponsiveClasses(cols, 'grid-cols');

    // Generate gap classes
    const gapClasses = generateResponsiveClasses(gap, 'gap');
    const rowGapClasses = rowGap ? generateResponsiveClasses(rowGap, 'gap-y') : '';
    const colGapClasses = colGap ? generateResponsiveClasses(colGap, 'gap-x') : '';

    const baseClasses = cn(
      // Base grid styles
      'grid',
      gridColsClasses,
      
      // Gap classes
      gapClasses,
      rowGapClasses,
      colGapClasses,
      
      // Alignment
      center && 'place-items-center',
      stretch && 'items-stretch',
      
      // Custom grid utilities
      autoFit && 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
      autoFill && 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
      
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

Grid.displayName = 'Grid';

// Grid item component for better composition
export const GridItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    span?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number };
    start?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number };
    end?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number };
    center?: boolean;
    stretch?: boolean;
  }
>(
  (
    {
      className,
      span,
      start,
      end,
      center = false,
      stretch = false,
      children,
      ...props
    },
    ref
  ) => {
    // Helper function to generate responsive span classes
    const generateSpanClasses = (
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

    const spanClasses = span ? generateSpanClasses(span, 'col-span') : '';
    const startClasses = start ? generateSpanClasses(start, 'col-start') : '';
    const endClasses = end ? generateSpanClasses(end, 'col-end') : '';

    const baseClasses = cn(
      // Base styles
      'min-w-0',
      
      // Span classes
      spanClasses,
      startClasses,
      endClasses,
      
      // Alignment
      center && 'place-self-center',
      stretch && 'self-stretch',
      
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

GridItem.displayName = 'GridItem';

export { Grid };
