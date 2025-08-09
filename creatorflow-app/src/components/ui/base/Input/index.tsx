'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Search, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  state?: 'default' | 'success' | 'warning' | 'error';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  searchable?: boolean;
  password?: boolean;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      state = 'default',
      leftIcon,
      rightIcon,
      clearable = false,
      searchable = false,
      password = false,
      fullWidth = false,
      label,
      helperText,
      errorText,
      type,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value || '');
    const [isFocused, setIsFocused] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInputValue('');
      const event = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    const baseClasses = cn(
      // Base styles
      'w-full border bg-background text-foreground',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'transition-all duration-200',
      
      // Size variants
      size === 'sm' && 'px-3 py-1.5 text-sm',
      size === 'md' && 'px-4 py-2 text-sm',
      size === 'lg' && 'px-4 py-3 text-base',
      size === 'xl' && 'px-5 py-4 text-lg',
      
      // Width
      fullWidth && 'w-full',
      
      // Variant styles
      variant === 'default' && [
        'border-border rounded-md',
        'focus:border-primary focus:ring-primary',
        'hover:border-primary/50'
      ],
      variant === 'outlined' && [
        'border-2 border-border rounded-md',
        'focus:border-primary focus:ring-primary',
        'hover:border-primary/50'
      ],
      variant === 'filled' && [
        'border-transparent bg-muted rounded-md',
        'focus:bg-background focus:border-primary focus:ring-primary',
        'hover:bg-muted/80'
      ],
      variant === 'minimal' && [
        'border-transparent border-b-2 border-border rounded-none',
        'focus:border-primary focus:ring-0',
        'hover:border-primary/50'
      ],
      
      // State styles
      state === 'success' && [
        'border-success focus:ring-success',
        'focus:border-success'
      ],
      state === 'warning' && [
        'border-warning focus:ring-warning',
        'focus:border-warning'
      ],
      state === 'error' && [
        'border-error focus:ring-error',
        'focus:border-error'
      ],
      
      // Focus state
      isFocused && 'ring-2 ring-primary ring-offset-2',
      
      className
    );

    const inputType = password && showPassword ? 'text' : type || 'text';

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          {/* Input Element */}
          <input
            ref={ref}
            type={inputType}
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              baseClasses,
              leftIcon && 'pl-10',
              (rightIcon || clearable || password || searchable) && 'pr-10'
            )}
            {...props}
          />
          
          {/* Right Icons Container */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {/* Search Icon */}
            {searchable && (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
            
            {/* Password Toggle */}
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            
            {/* Clear Button */}
            {clearable && inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {/* Custom Right Icon */}
            {rightIcon && !clearable && !password && !searchable && (
              <div className="text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {/* Helper Text */}
        {helperText && !errorText && (
          <p className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
        
        {/* Error Text */}
        {errorText && (
          <p className="text-sm text-error">
            {errorText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
