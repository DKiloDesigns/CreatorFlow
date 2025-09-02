'use client';

import React, { forwardRef } from 'react';
import { Box } from '@mui/material';

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
    const getSizeStyles = () => {
      const sizeMap = {
        sm: { maxWidth: '48rem' }, // max-w-3xl
        md: { maxWidth: '56rem' }, // max-w-4xl
        lg: { maxWidth: '72rem' }, // max-w-6xl
        xl: { maxWidth: '80rem' }, // max-w-7xl
        full: { maxWidth: '100%' },
        custom: maxWidth ? { maxWidth } : { maxWidth: '72rem' },
      };
      return !fluid ? sizeMap[size] : {};
    };

    const getPaddingStyles = () => {
      const paddingMap = {
        none: { px: 0 },
        sm: { px: 2 },
        md: { px: 3 },
        lg: { px: 4 },
        xl: { px: 6 },
      };
      return paddingMap[padding];
    };

    const getResponsivePaddingStyles = () => ({
      px: { xs: 3, sm: 3, lg: 4 }
    });

    return (
      <Box
        ref={ref}
        sx={{
          width: '100%',
          ...(center && { mx: 'auto' }),
          ...getSizeStyles(),
          ...getPaddingStyles(),
          ...getResponsivePaddingStyles(),
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Container.displayName = 'Container';

export { Container };
