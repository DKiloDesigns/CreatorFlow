'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  interactive?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    rounded = 'md',
    dismissible = false,
    onDismiss,
    icon,
    iconPosition = 'left',
    children,
    fullWidth = false,
    interactive = false,
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'bg-muted text-muted-foreground border-border',
      primary: 'bg-primary text-primary-foreground border-primary',
      secondary: 'bg-secondary text-secondary-foreground border-secondary',
      success: 'bg-success text-success-foreground border-success',
      warning: 'bg-warning text-warning-foreground border-warning',
      error: 'bg-error text-error-foreground border-error',
      info: 'bg-info text-info-foreground border-info',
      outline: 'bg-transparent border-border text-foreground',
      ghost: 'bg-transparent text-foreground',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const roundedClasses = {
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    const interactiveClasses = interactive ? 'cursor-pointer hover:scale-105 transition-transform' : '';

    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDismiss) {
        onDismiss();
      }
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 border font-medium transition-all duration-200',
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses[rounded],
          interactiveClasses,
          fullWidth && 'w-full justify-center',
          className
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        
        <span className="flex-1">
          {children}
        </span>
        
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={cn(
              'flex-shrink-0 ml-1 p-0.5 rounded-sm transition-colors',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current'
            )}
            aria-label="Remove badge"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
