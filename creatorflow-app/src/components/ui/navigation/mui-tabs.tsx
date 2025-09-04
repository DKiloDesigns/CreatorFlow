'use client';

import React, { forwardRef } from 'react';
import { 
  Tabs as MuiTabs, 
  TabsProps as MuiTabsProps,
  Tab as MuiTab,
  TabProps as MuiTabProps,
  Box,
  BoxProps
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled MUI Tabs with custom variants
const StyledTabs = styled(MuiTabs)<{
  variant?: 'default' | 'outlined' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
}>(({ theme, variant = 'default', size = 'md' }) => ({
  '& .MuiTabs-indicator': {
    ...(variant === 'default' && {
      backgroundColor: theme.palette.primary.main,
      height: 2,
    }),
    ...(variant === 'outlined' && {
      backgroundColor: theme.palette.primary.main,
      height: 2,
    }),
    ...(variant === 'pills' && {
      backgroundColor: theme.palette.primary.main,
      borderRadius: theme.shape.borderRadius,
      height: '100%',
      zIndex: 0,
    }),
    ...(variant === 'underline' && {
      backgroundColor: theme.palette.primary.main,
      height: 2,
    }),
  },
  '& .MuiTab-root': {
    ...(size === 'sm' && {
      fontSize: '0.875rem',
      padding: '6px 12px',
      minHeight: 36,
    }),
    ...(size === 'md' && {
      fontSize: '1rem',
      padding: '8px 16px',
      minHeight: 48,
    }),
    ...(size === 'lg' && {
      fontSize: '1.125rem',
      padding: '12px 20px',
      minHeight: 56,
    }),
    ...(variant === 'outlined' && {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      margin: '0 4px',
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    }),
    ...(variant === 'pills' && {
      borderRadius: theme.shape.borderRadius,
      margin: '0 2px',
      '&.Mui-selected': {
        color: theme.palette.primary.contrastText,
      },
    }),
  },
}));

const StyledTab = styled(MuiTab)<{
  variant?: 'default' | 'outlined' | 'pills' | 'underline';
}>(({ theme, variant = 'default' }) => ({
  textTransform: 'none',
  fontWeight: 500,
  ...(variant === 'outlined' && {
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  }),
  ...(variant === 'pills' && {
    '&.Mui-selected': {
      color: theme.palette.primary.contrastText,
    },
  }),
}));

// Main Tabs component
export interface TabsProps extends Omit<MuiTabsProps, 'variant'> {
  variant?: 'default' | 'outlined' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    variant = 'default',
    _size = 'md',
    _fullWidth = false,
    disabled = false,
    children,
    ...props 
  }, ref) => {
    // Map custom variants to MUI variants
    const muiVariant = variant === 'outlined' ? 'fullWidth' : 'standard';
    
    return (
      <StyledTabs
        ref={ref}
        variant={muiVariant as any}
        size={size as any}
        disabled={disabled}
        {...(props as any)}
      >
        {children}
      </StyledTabs>
    );
  }
);

Tabs.displayName = 'Tabs';

// TabsList component (maps to MUI Tabs)
export interface TabsListProps extends BoxProps {
  variant?: 'default' | 'outlined' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ 
    variant = 'default',
    size = 'md',
    fullWidth = false,
    children,
    ...props 
  }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          ...(variant === 'outlined' && {
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 0.5,
          }),
          ...(variant === 'pills' && {
            gap: 0.5,
          }),
          ...(fullWidth && {
            width: '100%',
          }),
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

TabsList.displayName = 'TabsList';

// TabsTrigger component (maps to MUI Tab)
export interface TabsTriggerProps extends Omit<MuiTabProps, 'variant'> {
  value: string;
  variant?: 'default' | 'outlined' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ 
    value,
    variant = 'default',
    _size = 'md',
    _fullWidth = false,
    children,
    ...props 
  }, ref) => {
    return (
      <StyledTab
        ref={ref as any}
        label={children}
        value={value}
        variant={variant}
        size={size}
        sx={{
          ...(fullWidth && {
            flex: 1,
          }),
        }}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

// TabsContent component (maps to MUI TabPanel)
export interface TabsContentProps extends BoxProps {
  value: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        role="tabpanel"
        hidden={false} // This will be controlled by parent Tabs component
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${value}`}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

TabsContent.displayName = 'TabsContent';
