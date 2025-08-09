'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = 'md',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // Base styles
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95',
      
      // Size variants
      size === 'sm' && 'px-3 py-1.5 text-sm',
      size === 'md' && 'px-4 py-2 text-sm',
      size === 'lg' && 'px-6 py-3 text-base',
      size === 'xl' && 'px-8 py-4 text-lg',
      
      // Width
      fullWidth && 'w-full',
      
      // Border radius
      rounded === 'sm' && 'rounded',
      rounded === 'md' && 'rounded-md',
      rounded === 'lg' && 'rounded-lg',
      rounded === 'full' && 'rounded-full',
      
      // Variant styles
      variant === 'primary' && [
        'bg-primary text-primary-foreground hover:bg-primary-dark',
        'focus:ring-primary shadow-sm hover:shadow-md',
        'border border-transparent'
      ],
      variant === 'secondary' && [
        'bg-secondary text-secondary-foreground hover:bg-secondary-dark',
        'focus:ring-secondary shadow-sm hover:shadow-md',
        'border border-transparent'
      ],
      variant === 'outline' && [
        'bg-transparent text-foreground border border-border',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:ring-border'
      ],
      variant === 'ghost' && [
        'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        'focus:ring-border'
      ],
      variant === 'destructive' && [
        'bg-error text-error-foreground hover:bg-error-dark',
        'focus:ring-error shadow-sm hover:shadow-md',
        'border border-transparent'
      ],
      variant === 'link' && [
        'bg-transparent text-primary underline-offset-4 hover:underline',
        'focus:ring-primary'
      ],
      
      className
    );

    return (
      <button
        className={baseClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        
        {!loading && leftIcon && (
          <span className="mr-2 flex items-center">
            {leftIcon}
          </span>
        )}
        
        <span className="flex items-center">
          {children}
        </span>
        
        {!loading && rightIcon && (
          <span className="ml-2 flex items-center">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
