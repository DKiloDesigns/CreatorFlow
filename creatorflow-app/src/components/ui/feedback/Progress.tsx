'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  valuePosition?: 'top' | 'bottom' | 'left' | 'right' | 'inside';
  animated?: boolean;
  striped?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100,
    variant = 'default',
    size = 'md',
    showValue = false,
    valuePosition = 'top',
    animated = false,
    striped = false,
    rounded = 'md',
    fullWidth = false,
    label,
    helperText,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const variantClasses = {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
      info: 'bg-info',
    };

    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    };

    const roundedClasses = {
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    const valuePositionClasses = {
      top: 'flex-col-reverse',
      bottom: 'flex-col',
      left: 'flex-row-reverse items-center gap-3',
      right: 'flex-row items-center gap-3',
      inside: 'relative',
    };

    const valueDisplay = (
      <div className="text-sm font-medium text-muted-foreground min-w-[3rem] text-right">
        {Math.round(percentage)}%
      </div>
    );

    const progressBar = (
      <div className={cn(
        'relative w-full bg-muted overflow-hidden',
        sizeClasses[size],
        roundedClasses[rounded],
        fullWidth && 'w-full'
      )}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            variantClasses[variant],
            roundedClasses[rounded],
            animated && 'animate-pulse',
            striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%] animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    );

    if (valuePosition === 'inside') {
      return (
        <div ref={ref} className={cn('space-y-2', fullWidth && 'w-full', className)} {...props}>
          {label && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{label}</span>
              {showValue && valueDisplay}
            </div>
          )}
          
          <div className="relative">
            {progressBar}
            {showValue && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">
                  {Math.round(percentage)}%
                </span>
              </div>
            )}
          </div>
          
          {helperText && (
            <p className="text-xs text-muted-foreground">{helperText}</p>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-2', fullWidth && 'w-full', className)} {...props}>
        {label && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{label}</span>
            {showValue && valuePosition === 'top' && valueDisplay}
          </div>
        )}
        
        <div className={cn('flex', valuePositionClasses[valuePosition])}>
          {valuePosition === 'left' && showValue && valueDisplay}
          {progressBar}
          {valuePosition === 'right' && showValue && valueDisplay}
        </div>
        
        {valuePosition === 'bottom' && showValue && (
          <div className="flex justify-end">
            {valueDisplay}
          </div>
        )}
        
        {helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
