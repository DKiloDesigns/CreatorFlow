import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { Notifications as NotificationsIcon, Close as CloseIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, Info as InfoIcon } from '@mui/icons-material';

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
  const getSizeStyles = () => {
    const sizeMap = {
      sm: { height: 20, width: 20, fontSize: '0.75rem' },
      md: { height: 24, width: 24, fontSize: '0.875rem' },
      lg: { height: 32, width: 32, fontSize: '1rem' }
    };
    return sizeMap[size];
  };

  const getVariantStyles = () => {
    const variantMap = {
      default: { bgcolor: 'primary.main', color: 'primary.contrastText' },
      success: { bgcolor: 'success.main', color: 'white' },
      warning: { bgcolor: 'warning.main', color: 'white' },
      error: { bgcolor: 'error.main', color: 'white' }
    };
    return variantMap[variant];
  };

  const getIconSizes = () => {
    const iconSizeMap = {
      sm: 'small',
      md: 'small',
      lg: 'medium',
    };
    return iconSizeMap[size];
  };

  if (count === 0 && !showDot) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Button
        onClick={onClick}
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'all 0.2s',
          '&:hover': { transform: 'scale(1.05)' },
          ...getSizeStyles(),
          ...getVariantStyles(),
          ...(className && { className })
        }}
        aria-label={count > 0 ? `${count} notifications` : 'Notifications'}
      >
        {count > 0 ? (
          <Typography sx={{ fontWeight: 500 }}>
            {count > 99 ? '99+' : count}
          </Typography>
        ) : (
          <NotificationsIcon sx={{ fontSize: getIconSizes() }} />
        )}
      </Button>
      {showDot && count === 0 && (
        <Box sx={{
          position: 'absolute',
          top: -4,
          right: -4,
          height: 8,
          width: 8,
          borderRadius: '50%',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          ...getVariantStyles()
        }} />
      )}
    </Box>
  );
}

interface NotificationToastProps {
  title: string;
  message?: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  priority?: 'low' | 'medium' | 'high';
}

export function NotificationToast({
  title,
  message,
  variant = 'info',
  onClose,
  autoClose = true,
  duration = 5000,
  priority = 'medium'
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
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: WarningIcon,
    info: InfoIcon
  };

  const Icon = icons[variant];

  // ARIA live region for screen reader announcements
  const getAriaLive = () => {
    switch (priority) {
      case 'high': return 'assertive';
      case 'medium': return 'polite';
      case 'low': return 'polite';
      default: return 'polite';
    }
  };

  const getAriaLabel = () => {
    const variantText = variant.charAt(0).toUpperCase() + variant.slice(1);
    return `${variantText} notification: ${title}${message ? ` - ${message}` : ''}`;
  };

  if (!isVisible) return null;

  return (
    <>
      {/* ARIA Live Region for Screen Reader Announcements */}
      <div
        aria-live={getAriaLive()}
        aria-atomic="true"
        className="sr-only"
        role="status"
        aria-label={getAriaLabel()}
      >
        {getAriaLabel()}
      </div>
      
      {/* Visual Toast Notification */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 50,
          maxWidth: '24rem',
          width: '100%',
          p: 2,
          borderRadius: '8px',
          border: '1px solid',
          boxShadow: 3,
          transition: 'all 0.3s ease',
          ...(variant === 'success' && {
            borderColor: 'success.200',
            bgcolor: 'success.50',
            color: 'success.800'
          }),
          ...(variant === 'warning' && {
            borderColor: 'warning.200',
            bgcolor: 'warning.50',
            color: 'warning.800'
          }),
          ...(variant === 'error' && {
            borderColor: 'error.200',
            bgcolor: 'error.50',
            color: 'error.800'
          }),
          ...(variant === 'info' && {
            borderColor: 'info.200',
            bgcolor: 'info.50',
            color: 'info.800'
          }),
          transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
          opacity: isVisible ? 1 : 0
        }}
        role="alert"
        aria-labelledby="toast-title"
        aria-describedby={message ? "toast-message" : undefined}
      >
        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
          <Icon sx={{ fontSize: 20, marginTop: '2px', flexShrink: 0 }} aria-hidden="true" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography id="toast-title" variant="h6" sx={{ fontWeight: 500 }}>{title}</Typography>
            {message && (
              <Typography id="toast-message" variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>{message}</Typography>
            )}
          </Box>
          {onClose && (
            <IconButton
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(), 300);
              }}
              sx={{ ml: 1, p: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' }, transition: 'colors 0.2s ease' }}
              aria-label="Close notification"
            >
              <CloseIcon sx={{ fontSize: 16 }} aria-hidden="true" />
            </IconButton>
          )}
                </Box>
      </Box>
    </>
  );
} 