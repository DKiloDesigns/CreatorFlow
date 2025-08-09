'use client';

import React, { forwardRef, createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

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

    const variantClasses = {
      default: 'border-b border-border',
      outlined: 'border border-border rounded-lg p-1',
      pills: 'space-x-1',
      underline: 'border-b border-border',
    };

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            'w-full',
            orientation === 'vertical' ? 'flex' : 'block',
            variantClasses[variant],
            sizeClasses[size],
            disabled && 'opacity-50 pointer-events-none',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, fullWidth = false, children, ...props }, ref) => {
    const { orientation } = useTabsContext();
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          fullWidth && 'w-full',
          className
        )}
        role="tablist"
        aria-orientation={orientation}
        {...props}
      >
        {children}
      </div>
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
  ({ className, value, disabled = false, fullWidth = false, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange, orientation, variant } = useTabsContext();
    const isSelected = value === selectedValue;
    
    const variantClasses = {
      default: cn(
        'border-b-2 border-transparent px-3 py-2',
        'hover:text-foreground hover:border-border',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isSelected && 'border-primary text-foreground',
        !isSelected && 'text-muted-foreground'
      ),
      outlined: cn(
        'px-3 py-2 rounded-md transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isSelected && 'bg-primary text-primary-foreground',
        !isSelected && 'text-foreground'
      ),
      pills: cn(
        'px-4 py-2 rounded-full transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isSelected && 'bg-primary text-primary-foreground',
        !isSelected && 'text-muted-foreground'
      ),
      underline: cn(
        'border-b-2 border-transparent px-3 py-2',
        'hover:text-foreground hover:border-border',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isSelected && 'border-primary text-foreground',
        !isSelected && 'text-muted-foreground'
      ),
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        aria-disabled={disabled}
        disabled={disabled}
        className={cn(
          'flex items-center justify-center transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          fullWidth && 'flex-1',
          variantClasses[variant],
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </button>
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
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn(
          'outline-none',
          orientation === 'vertical' ? 'ml-4' : 'mt-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
