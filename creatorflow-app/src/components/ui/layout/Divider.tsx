'use client';

import React, { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';

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
    const getSizeStyles = () => {
      const sizeMap = {
        xs: orientation === 'horizontal' ? { height: '1px' } : { width: '1px' },
        sm: orientation === 'horizontal' ? { height: '2px' } : { width: '2px' },
        md: orientation === 'horizontal' ? { height: '1px' } : { width: '1px' },
        lg: orientation === 'horizontal' ? { height: '2px' } : { width: '2px' },
        xl: orientation === 'horizontal' ? { height: '4px' } : { width: '4px' },
      };
      return sizeMap[size];
    };

    const getSpacingStyles = () => {
      const spacingMap = {
        none: orientation === 'horizontal' ? { my: 0 } : { mx: 0 },
        sm: orientation === 'horizontal' ? { my: 1 } : { mx: 1 },
        md: orientation === 'horizontal' ? { my: 2 } : { mx: 2 },
        lg: orientation === 'horizontal' ? { my: 3 } : { mx: 3 },
        xl: orientation === 'horizontal' ? { my: 4 } : { mx: 4 },
      };
      return spacingMap[spacing];
    };

    const getVariantStyles = () => {
      const variantMap = {
        solid: { borderStyle: 'solid' },
        dashed: { borderStyle: 'dashed' },
        dotted: { borderStyle: 'dotted' },
        gradient: { 
          background: 'linear-gradient(to right, transparent, currentColor, transparent)',
          border: 'none'
        },
      };
      return variantMap[variant];
    };

    const getColorStyles = () => {
      const colorMap = {
        default: { borderColor: 'divider', color: 'divider' },
        muted: { borderColor: 'action.disabled', color: 'text.disabled' },
        primary: { borderColor: 'primary.main', color: 'primary.main' },
        secondary: { borderColor: 'secondary.main', color: 'secondary.main' },
        success: { borderColor: 'success.main', color: 'success.main' },
        warning: { borderColor: 'warning.main', color: 'warning.main' },
        error: { borderColor: 'error.main', color: 'error.main' },
      };
      return colorMap[color];
    };

    const getLabelPositionStyles = () => {
      const positionMap = {
        left: { justifyContent: 'flex-start' },
        center: { justifyContent: 'center' },
        right: { justifyContent: 'flex-end' },
      };
      return positionMap[labelPosition];
    };

    const getBaseStyles = () => ({
      display: 'flex',
      alignItems: 'center',
      ...(orientation === 'horizontal' ? { width: '100%' } : { height: '100%' }),
      ...getSpacingStyles(),
    });

    const getLineStyles = () => ({
      flexShrink: 0,
      ...getSizeStyles(),
      ...getVariantStyles(),
      ...getColorStyles(),
      ...(orientation === 'horizontal' ? { flex: 1 } : { height: '100%' }),
    });

    if (withLabel || labelContent || children) {
      return (
        <Box 
          ref={ref} 
          sx={getBaseStyles()} 
          {...props}
        >
          <Box sx={{ ...getLineStyles(), ...(labelPosition === 'left' && { display: 'none' }) }} />
          <Box sx={{
            px: 1.5,
            fontSize: '0.875rem',
            color: 'text.disabled',
            whiteSpace: 'nowrap',
            ...getLabelPositionStyles()
          }}>
            {labelContent || children}
          </Box>
          <Box sx={{ ...getLineStyles(), ...(labelPosition === 'right' && { display: 'none' }) }} />
        </Box>
      );
    }

    return (
      <Box 
        ref={ref} 
        sx={{ ...getLineStyles(), ...getSpacingStyles() }} 
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };
