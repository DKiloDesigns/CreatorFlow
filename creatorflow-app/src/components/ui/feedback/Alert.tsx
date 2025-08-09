'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  fullWidth?: boolean;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    dismissible = false,
    onDismiss,
    icon,
    title,
    description,
    actions,
    children,
    fullWidth = false,
    ...props 
  }, ref) => {
    const variantConfig = {
      default: {
        icon: Info,
        classes: 'bg-background border-border text-foreground',
        iconClasses: 'text-muted-foreground',
      },
      info: {
        icon: Info,
        classes: 'bg-info/10 border-info/20 text-info-foreground',
        iconClasses: 'text-info',
      },
      success: {
        icon: CheckCircle,
        classes: 'bg-success/10 border-success/20 text-success-foreground',
        iconClasses: 'text-success',
      },
      warning: {
        icon: AlertCircle,
        classes: 'bg-warning/10 border-warning/20 text-warning-foreground',
        iconClasses: 'text-warning',
      },
      error: {
        icon: XCircle,
        classes: 'bg-error/10 border-error/20 text-error-foreground',
        iconClasses: 'text-error',
      },
    };

    const sizeClasses = {
      sm: 'p-3 text-sm',
      md: 'p-4 text-base',
      lg: 'p-6 text-lg',
    };

    const config = variantConfig[variant];
    const IconComponent = icon || config.icon;

    const handleDismiss = () => {
      if (onDismiss) {
        onDismiss();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative border rounded-lg transition-all duration-200',
          config.classes,
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex items-start gap-3">
          {IconComponent && (
            <div className={cn('flex-shrink-0 mt-0.5', config.iconClasses)}>
              {React.isValidElement(icon) ? icon : <IconComponent className="w-5 h-5" />}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold leading-tight mb-1">
                {title}
              </h4>
            )}
            
            {(description || children) && (
              <div className="text-sm leading-relaxed">
                {description || children}
              </div>
            )}
            
            {actions && (
              <div className="mt-3 flex flex-wrap gap-2">
                {actions}
              </div>
            )}
          </div>

          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              className={cn(
                'flex-shrink-0 p-1 rounded-md transition-colors',
                'hover:bg-black/5 dark:hover:bg-white/5',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current'
              )}
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
