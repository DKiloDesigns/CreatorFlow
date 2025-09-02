'use client';

import React, { forwardRef, createContext, useContext, useState } from 'react';
import { Box, Typography } from '@mui/material';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'outlined' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    className, 
    value: controlledValue,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    variant = 'default',
    size = 'md',
    fullWidth = false,
    disabled = false,
    children,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const value = controlledValue !== undefined ? controlledValue : internalValue;
    
    const handleValueChange = (newValue: string) => {
      if (disabled) return;
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const contextValue: TabsContextType = {
      value,
      onValueChange: handleValueChange,
      orientation,
    };

    const getVariantStyles = () => {
      const variantMap = {
        default: { borderBottom: 1, borderColor: 'divider' },
        outlined: { border: 1, borderColor: 'divider', borderRadius: '8px', p: 0.5 },
        pills: { '& > * + *': { ml: 0.5 } },
        underline: { borderBottom: 1, borderColor: 'divider' },
      };
      return variantMap[variant];
    };

    const getSizeStyles = () => {
      const sizeMap = {
        sm: { fontSize: '0.875rem' },
        md: { fontSize: '1rem' },
        lg: { fontSize: '1.125rem' },
      };
      return sizeMap[size];
    };

    return (
      <TabsContext.Provider value={contextValue}>
        <Box
          ref={ref}
          sx={{
            width: '100%',
            ...(orientation === 'vertical' ? { display: 'flex' } : { display: 'block' }),
            ...getVariantStyles(),
            ...getSizeStyles(),
            ...(disabled && { opacity: 0.5, pointerEvents: 'none' }),
            ...(className && { className })
          }}
          {...props}
        >
          {children}
        </Box>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, _fullWidth = false, children, ...props }, ref) => {
    const { orientation } = useTabsContext();
    
    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          ...(orientation === 'horizontal' ? { flexDirection: 'row' } : { flexDirection: 'column' }),
          ...(_fullWidth && { width: '100%' }),
          ...(className && { className })
        }}
        role="tablist"
        aria-orientation={orientation}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled = false, _fullWidth = false, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange, orientation, variant } = useTabsContext();
    const isSelected = value === selectedValue;
    
    const getVariantStyles = () => {
      const baseStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        '&:focus': { outline: 'none', ring: 2, ringColor: 'primary.main', ringOffset: 2 },
        '&.Mui-disabled': { opacity: 0.5, cursor: 'not-allowed' },
      };

      const variantMap = {
        default: {
          ...baseStyles,
          borderBottom: 2,
          borderColor: 'transparent',
          px: 1.5,
          py: 1,
          '&:hover': { color: 'text.primary', borderColor: 'divider' },
          ...(isSelected && { borderColor: 'primary.main', color: 'text.primary' }),
          ...(!isSelected && { color: 'text.disabled' })
        },
        outlined: {
          ...baseStyles,
          px: 1.5,
          py: 1,
          borderRadius: '6px',
          '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
          ...(isSelected && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
          ...(!isSelected && { color: 'text.primary' })
        },
        pills: {
          ...baseStyles,
          px: 2,
          py: 1,
          borderRadius: '9999px',
          '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
          ...(isSelected && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
          ...(!isSelected && { color: 'text.disabled' })
        },
        underline: {
          ...baseStyles,
          borderBottom: 2,
          borderColor: 'transparent',
          px: 1.5,
          py: 1,
          '&:hover': { color: 'text.primary', borderColor: 'divider' },
          ...(isSelected && { borderColor: 'primary.main', color: 'text.primary' }),
          ...(!isSelected && { color: 'text.disabled' })
        },
      };
      return variantMap[variant];
    };

    return (
      <Button
        ref={ref}
        variant="text"
        role="tab"
        aria-selected={isSelected}
        aria-disabled={disabled}
        disabled={disabled}
        sx={{
          ...getVariantStyles(),
          ...(_fullWidth && { flex: 1 }),
          ...(className && { className })
        }}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, orientation } = useTabsContext();
    const isSelected = value === selectedValue;
    
    if (!isSelected) return null;

    return (
      <Box
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        sx={{
          outline: 'none',
          ...(orientation === 'vertical' ? { ml: 2 } : { mt: 2 }),
          ...(className && { className })
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
