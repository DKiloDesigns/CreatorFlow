'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive' | 'highlight';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  loading?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  image?: {
    src: string;
    alt: string;
    position?: 'top' | 'bottom';
  };
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hover = false,
      clickable = false,
      loading = false,
      header,
      footer,
      image,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // Base styles
      'bg-card text-card-foreground border border-border',
      'transition-all duration-200',
      
      // Variant styles
      variant === 'default' && 'shadow-sm',
      variant === 'elevated' && 'shadow-lg',
      variant === 'outlined' && 'shadow-none border-2',
      variant === 'interactive' && [
        'shadow-sm cursor-pointer',
        'hover:shadow-md hover:border-primary/20',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      ],
      variant === 'highlight' && [
        'shadow-md ring-2 ring-primary/20',
        'border-primary/30'
      ],
      
      // Hover effects
      hover && 'hover:shadow-md hover:scale-[1.02]',
      
      // Clickable state
      clickable && 'cursor-pointer select-none',
      
      // Loading state
      loading && 'animate-pulse',
      
      className
    );

    const paddingClasses = cn(
      padding === 'none' && 'p-0',
      padding === 'sm' && 'p-3',
      padding === 'md' && 'p-6',
      padding === 'lg' && 'p-8',
      padding === 'xl' && 'p-10'
    );

    const contentClasses = cn(
      'flex flex-col',
      paddingClasses
    );

    return (
      <div
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {/* Header */}
        {header && (
          <div className="px-6 pt-6 pb-0 border-b border-border">
            {header}
          </div>
        )}
        
        {/* Top Image */}
        {image?.position !== 'bottom' && image && (
          <div className="relative">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </div>
        )}
        
        {/* Content */}
        <div className={contentClasses}>
          {children}
        </div>
        
        {/* Bottom Image */}
        {image?.position === 'bottom' && image && (
          <div className="relative">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover rounded-b-lg"
            />
          </div>
        )}
        
        {/* Footer */}
        {footer && (
          <div className="px-6 pb-6 pt-0 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components for better composition
export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card };
