'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: keyof typeof LucideIcons;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inherit';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      size = 'md',
      color = 'default',
      weight = 'normal',
      className,
      ...props
    },
    ref
  ) => {
    const LucideIcon = LucideIcons[name];

    if (!LucideIcon) {
      console.warn(`Icon "${name}" not found in lucide-react`);
      return null;
    }

    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
      '2xl': 'w-10 h-10',
      '3xl': 'w-12 h-12',
      '4xl': 'w-16 h-16',
    };

    const colorClasses = {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      info: 'text-info',
      inherit: 'text-inherit',
    };

    const weightClasses = {
      thin: 'stroke-[1]',
      light: 'stroke-[1.5]',
      normal: 'stroke-[2]',
      medium: 'stroke-[2.5]',
      semibold: 'stroke-[3]',
      bold: 'stroke-[3.5]',
    };

    const baseClasses = cn(
      'inline-flex items-center justify-center',
      'transition-colors duration-200',
      sizeClasses[size],
      colorClasses[color],
      weightClasses[weight],
      className
    );

    return (
      <span
        ref={ref}
        className={baseClasses}
        {...props}
      >
        <LucideIcon />
      </span>
    );
  }
);

Icon.displayName = 'Icon';

// Convenience components for common icons
export const IconButton = forwardRef<
  HTMLButtonElement,
  IconProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'ghost' | 'outline' | 'solid';
    rounded?: 'sm' | 'md' | 'lg' | 'full';
  }
>(
  (
    {
      name,
      size = 'md',
      color = 'default',
      variant = 'ghost',
      rounded = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
      xl: 'p-3',
      '2xl': 'p-4',
      '3xl': 'p-5',
      '4xl': 'p-6',
    };

    const variantClasses = {
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline: 'border border-border hover:bg-accent hover:text-accent-foreground',
      solid: 'bg-primary text-primary-foreground hover:bg-primary-dark',
    };

    const roundedClasses = {
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    const baseClasses = cn(
      'inline-flex items-center justify-center',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[size],
      variantClasses[variant],
      roundedClasses[rounded],
      className
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        {...props}
      >
        <Icon name={name} size={size} color={color} />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

// Icon with text component
export const IconText = forwardRef<
  HTMLSpanElement,
  IconProps & {
    text: string;
    position?: 'left' | 'right';
    spacing?: 'sm' | 'md' | 'lg';
  }
>(
  (
    {
      name,
      size = 'md',
      color = 'default',
      text,
      position = 'left',
      spacing = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3',
    };

    const baseClasses = cn(
      'inline-flex items-center',
      spacingClasses[spacing],
      className
    );

    return (
      <span
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {position === 'left' && (
          <Icon name={name} size={size} color={color} />
        )}
        <span>{text}</span>
        {position === 'right' && (
          <Icon name={name} size={size} color={color} />
        )}
      </span>
    );
  }
);

IconText.displayName = 'IconText';

export { Icon };
