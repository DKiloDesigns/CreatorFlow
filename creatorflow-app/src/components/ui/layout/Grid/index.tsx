'use client';

import React, { forwardRef } from 'react';
import { Box } from '@mui/material';

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
    // Helper function to generate responsive grid styles
    const generateResponsiveGridStyles = (
      value: number | Record<string, number>
    ): any => {
      if (typeof value === 'number') {
        return { gridTemplateColumns: `repeat(${value}, 1fr)` };
      }
      
      const styles: any = {};
      Object.entries(value).forEach(([breakpoint, val]) => {
        if (breakpoint === 'base') {
          styles.gridTemplateColumns = `repeat(${val}, 1fr)`;
        } else {
          styles[`@media (min-width: ${getBreakpointWidth(breakpoint)})`] = {
            gridTemplateColumns: `repeat(${val}, 1fr)`
          };
        }
      });
      
      return styles;
    };

    // Helper function to get breakpoint widths
    const getBreakpointWidth = (breakpoint: string): string => {
      const breakpoints: Record<string, string> = {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      };
      return breakpoints[breakpoint] || '0px';
    };

    // Generate gap styles
    const generateGapStyles = (gapValue: number | Record<string, number>): any => {
      if (typeof gapValue === 'number') {
        return { gap: gapValue * 4 }; // Convert to MUI spacing units
      }
      
      const styles: any = {};
      Object.entries(gapValue).forEach(([breakpoint, val]) => {
        if (breakpoint === 'base') {
          styles.gap = val * 4;
        } else {
          styles[`@media (min-width: ${getBreakpointWidth(breakpoint)})`] = {
            gap: val * 4
          };
        }
      });
      
      return styles;
    };

    const getGridStyles = () => ({
      display: 'grid',
      ...(autoFit && { gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }),
      ...(autoFill && { gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }),
      ...(!autoFit && !autoFill && generateResponsiveGridStyles(cols)),
      ...generateGapStyles(gap),
      ...(rowGap && generateGapStyles(rowGap)),
      ...(colGap && generateGapStyles(colGap)),
      ...(center && { placeItems: 'center' }),
      ...(stretch && { alignItems: 'stretch' }),
    });

    return (
      <Box
        ref={ref}
        sx={getGridStyles()}
        {...props}
      >
        {children}
      </Box>
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
    // Helper function to generate responsive span styles
    const generateSpanStyles = (
      value: number | Record<string, number>,
      property: string
    ): any => {
      if (typeof value === 'number') {
        return { [property]: value };
      }
      
      const styles: any = {};
      Object.entries(value).forEach(([breakpoint, val]) => {
        if (breakpoint === 'base') {
          styles[property] = val;
        } else {
          styles[`@media (min-width: ${getBreakpointWidth(breakpoint)})`] = {
            [property]: val
          };
        }
      });
      
      return styles;
    };

    const getGridItemStyles = () => ({
      minWidth: 0,
      ...(span && generateSpanStyles(span, 'gridColumn')),
      ...(start && generateSpanStyles(start, 'gridColumnStart')),
      ...(end && generateSpanStyles(end, 'gridColumnEnd')),
      ...(center && { placeSelf: 'center' }),
      ...(stretch && { alignSelf: 'stretch' })
    });

    return (
      <Box
        ref={ref}
        sx={getGridItemStyles()}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

GridItem.displayName = 'GridItem';

export { Grid };
