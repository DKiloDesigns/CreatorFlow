'use client';

import React, { forwardRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
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
      <Box
        ref={ref}
        className={className}
        sx={{
          position: 'relative',
          border: '1px solid',
          borderRadius: 2,
          transition: 'all 0.2s ease',
          width: fullWidth ? '100%' : 'auto',
          ...(variant === 'default' && {
            bgcolor: 'background.paper',
            borderColor: 'divider',
            color: 'text.primary'
          }),
          ...(variant === 'info' && {
            bgcolor: 'info.50',
            borderColor: 'info.200',
            color: 'info.foreground'
          }),
          ...(variant === 'success' && {
            bgcolor: 'success.50',
            borderColor: 'success.200',
            color: 'success.foreground'
          }),
          ...(variant === 'warning' && {
            bgcolor: 'warning.50',
            borderColor: 'warning.200',
            color: 'warning.foreground'
          }),
          ...(variant === 'error' && {
            bgcolor: 'error.50',
            borderColor: 'error.200',
            color: 'error.foreground'
          }),
          ...(size === 'sm' && { p: 1.5, fontSize: '0.875rem' }),
          ...(size === 'md' && { p: 2, fontSize: '1rem' }),
          ...(size === 'lg' && { p: 3, fontSize: '1.125rem' })
        }}
        role="alert"
        {...props}
      >
        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
          {IconComponent && (
            <Box sx={{ 
              flexShrink: 0, 
              mt: 0.25,
              color: variant === 'default' ? 'text.primary' :
                     variant === 'info' ? 'info.main' :
                     variant === 'success' ? 'success.main' :
                     variant === 'warning' ? 'warning.main' :
                     variant === 'error' ? 'error.main' : 'text.primary'
            }}>
              {React.isValidElement(icon) ? icon : <IconComponent style={{ width: 20, height: 20 }} />}
            </Box>
          )}
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {title && (
              <Typography component="h4" sx={{ fontWeight: 600, lineHeight: 1.25, mb: 0.5 }}>
                {title}
              </Typography>
            )}
            
            {(description || children) && (
              <Box sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                {description || children}
              </Box>
            )}
            
            {actions && (
              <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {actions}
              </Box>
            )}
          </Box>

          {dismissible && (
            <IconButton
              onClick={handleDismiss}
              sx={{
                flexShrink: 0,
                p: 0.5,
                borderRadius: 1,
                transition: 'colors 0.2s ease',
                '&:hover': {
                  bgcolor: 'action.hover'
                },
                '&:focus': {
                  outline: 'none',
                  ring: '2px solid currentColor',
                  ringOffset: '2px'
                }
              }}
              aria-label="Dismiss alert"
            >
              <X style={{ width: 16, height: 16 }} />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
