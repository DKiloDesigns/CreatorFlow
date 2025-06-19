import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'white';
  className?: string;
  text?: string;
  showText?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
  text,
  showText = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variantClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    white: 'text-white'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 
        className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )} 
      />
      {showText && text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

export function LoadingSkeleton({
  className,
  lines = 1,
  variant = 'text'
}: LoadingSkeletonProps) {
  const variants = {
    text: 'h-4 bg-muted rounded',
    card: 'h-32 bg-muted rounded-lg',
    avatar: 'h-10 w-10 bg-muted rounded-full',
    button: 'h-10 bg-muted rounded-md'
  };

  if (lines === 1) {
    return (
      <div className={cn('animate-pulse', variants[variant], className)} />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse',
            variants[variant],
            i === lines - 1 ? 'w-3/4' : 'w-full',
            className
          )}
        />
      ))}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  text = 'Loading...',
  className
}: LoadingOverlayProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <LoadingSpinner size="lg" text={text} showText />
      </div>
    </div>
  );
} 