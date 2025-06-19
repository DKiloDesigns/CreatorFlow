import React from 'react';
import { cn } from '@/lib/utils';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationBadgeProps {
  count?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  showDot?: boolean;
}

export function NotificationBadge({
  count = 0,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  showDot = false
}: NotificationBadgeProps) {
  const sizeClasses = {
    sm: 'h-5 w-5 text-xs',
    md: 'h-6 w-6 text-sm',
    lg: 'h-8 w-8 text-base'
  };

  const variantStyles = {
    default: 'bg-primary text-primary-foreground',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  if (count === 0 && !showDot) {
    return null;
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={onClick}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105',
          sizeClasses[size],
          variantStyles[variant],
          className
        )}
      >
        {count > 0 ? (
          <span className="font-medium">
            {count > 99 ? '99+' : count}
          </span>
        ) : (
          <Bell className={iconSizes[size]} />
        )}
      </button>
      {showDot && count === 0 && (
        <div className={cn(
          'absolute -top-1 -right-1 h-2 w-2 rounded-full animate-pulse',
          variantStyles[variant]
        )} />
      )}
    </div>
  );
}

interface NotificationToastProps {
  title: string;
  message?: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function NotificationToast({
  title,
  message,
  variant = 'info',
  onClose,
  autoClose = true,
  duration = 5000
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const variantStyles = {
    success: 'border-green-200 bg-green-50 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-200',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-200',
    error: 'border-red-200 bg-red-50 text-red-800 dark:bg-red-950/20 dark:border-red-800 dark:text-red-200',
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-200'
  };

  const icons = {
    success: CheckCircle,
    warning: AlertCircle,
    error: AlertCircle,
    info: Info
  };

  const Icon = icons[variant];

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg transition-all duration-300',
      variantStyles[variant],
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    )}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium">{title}</h4>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(), 300);
            }}
            className="ml-2 p-1 rounded hover:bg-black/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
} 