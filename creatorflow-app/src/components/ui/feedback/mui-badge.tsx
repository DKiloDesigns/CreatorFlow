'use client';

import React, { forwardRef } from 'react';
import { 
  Badge as MuiBadge,
  BadgeProps as MuiBadgeProps,
  Chip,
  ChipProps,
  Box,
  BoxProps,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled MUI Badge
const StyledBadge = styled(MuiBadge)<{
  variant?: 'default' | 'dot' | 'standard' | 'outlined' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}>(({ theme, variant = 'default', size = 'md', color = 'primary' }) => ({
  '& .MuiBadge-badge': {
    ...(size === 'sm' && {
      fontSize: '0.75rem',
      minWidth: 16,
      height: 16,
      padding: '0 4px',
    }),
    ...(size === 'md' && {
      fontSize: '0.875rem',
      minWidth: 20,
      height: 20,
      padding: '0 6px',
    }),
    ...(size === 'lg' && {
      fontSize: '1rem',
      minWidth: 24,
      height: 24,
      padding: '0 8px',
    }),
    
    ...(variant === 'dot' && {
      width: 8,
      height: 8,
      borderRadius: '50%',
      minWidth: 'auto',
      padding: 0,
    }),
    
    ...(variant === 'outlined' && {
      backgroundColor: 'transparent',
      border: `2px solid ${theme.palette[color].main}`,
      color: theme.palette[color].main,
    }),
    
    ...(variant === 'pill' && {
      borderRadius: 12,
    }),
  },
}));

// Styled Chip for status badges
const StyledChip = styled(Chip)<{
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}>(({ theme, variant = 'default', size = 'md', color = 'primary' }) => ({
  ...(size === 'sm' && {
    fontSize: '0.75rem',
    height: 20,
    '& .MuiChip-label': {
      padding: '0 6px',
    },
  }),
  ...(size === 'md' && {
    fontSize: '0.875rem',
    height: 24,
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  }),
  ...(size === 'lg' && {
    fontSize: '1rem',
    height: 32,
    '& .MuiChip-label': {
      padding: '0 12px',
    },
  }),
  
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette[color].main}`,
    backgroundColor: 'transparent',
    color: theme.palette[color].main,
    '&:hover': {
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].contrastText,
    },
  }),
  
  ...(variant === 'filled' && {
    backgroundColor: theme.palette[color].main,
    color: theme.palette[color].contrastText,
    '&:hover': {
      backgroundColor: theme.palette[color].dark,
    },
  }),
}));

// Main Badge component
export interface BadgeProps extends Omit<MuiBadgeProps, 'variant' | 'color'> {
  variant?: 'default' | 'dot' | 'standard' | 'outlined' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  showZero?: boolean;
  max?: number;
  children: React.ReactNode;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    variant = 'default',
    size = 'md',
    color = 'primary',
    showZero = false,
    max,
    children,
    ...props 
  }, ref) => {
    // Map custom variants to MUI variants
    const muiVariant = variant === 'dot' ? 'dot' : 'standard';
    
    return (
      <StyledBadge
        ref={ref}
        variant={muiVariant}
        size={size}
        color={color}
        showZero={showZero}
        max={max}
        {...props}
      >
        {children}
      </StyledBadge>
    );
  }
);

Badge.displayName = 'Badge';

// Status Badge component
export interface StatusBadgeProps extends Omit<ChipProps, 'variant' | 'color'> {
  status: 'online' | 'offline' | 'away' | 'busy' | 'pending' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  children?: React.ReactNode;
}

export const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ 
    status,
    variant = 'default',
    size = 'md',
    showIcon = true,
    children,
    ...props 
  }, ref) => {
    const statusConfig = {
      online: { color: 'success' as const, label: 'Online', icon: '🟢' },
      offline: { color: 'default' as const, label: 'Offline', icon: '⚫' },
      away: { color: 'warning' as const, label: 'Away', icon: '🟡' },
      busy: { color: 'error' as const, label: 'Busy', icon: '🔴' },
      pending: { color: 'warning' as const, label: 'Pending', icon: '⏳' },
      success: { color: 'success' as const, label: 'Success', icon: '✅' },
      warning: { color: 'warning' as const, label: 'Warning', icon: '⚠️' },
      error: { color: 'error' as const, label: 'Error', icon: '❌' },
      info: { color: 'info' as const, label: 'Info', icon: 'ℹ️' },
    };
    
    const config = statusConfig[status];
    const label = children || config.label;
    
    return (
      <StyledChip
        ref={ref}
        variant={variant as any}
        size={size as any}
        color={config.color as any}
        icon={showIcon ? <span>{config.icon}</span> : undefined}
        label={label}
        {...props}
      />
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

// Notification Badge component
export interface NotificationBadgeProps extends Omit<MuiBadgeProps, 'variant'> {
  count: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  showZero?: boolean;
  children: React.ReactNode;
}

export const NotificationBadge = forwardRef<HTMLDivElement, NotificationBadgeProps>(
  ({ 
    count,
    max,
    size = 'md',
    color = 'error',
    showZero = false,
    children,
    ...props 
  }, ref) => {
    return (
      <StyledBadge
        ref={ref}
        badgeContent={count}
        max={max}
        size={size}
        color={color}
        showZero={showZero}
        {...props}
      >
        {children}
      </StyledBadge>
    );
  }
);

NotificationBadge.displayName = 'NotificationBadge';

// Avatar Badge component
export interface AvatarBadgeProps extends Omit<MuiBadgeProps, 'variant'> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  children?: React.ReactNode;
}

export const AvatarBadge = forwardRef<HTMLDivElement, AvatarBadgeProps>(
  ({ 
    src,
    alt,
    size = 'md',
    color = 'primary',
    children,
    ...props 
  }, ref) => {
    const avatarSizes = {
      sm: 32,
      md: 40,
      lg: 56,
    };
    
    return (
      <StyledBadge
        ref={ref}
        color={color}
        size={size}
        {...props}
      >
        <Avatar
          src={src}
          alt={alt}
          sx={{ width: avatarSizes[size], height: avatarSizes[size] }}
        >
          {children}
        </Avatar>
      </StyledBadge>
    );
  }
);

AvatarBadge.displayName = 'AvatarBadge';

// Counter Badge component
export interface CounterBadgeProps extends BoxProps {
  count: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'default' | 'outlined' | 'filled';
  showZero?: boolean;
}

export const CounterBadge = forwardRef<HTMLDivElement, CounterBadgeProps>(
  ({ 
    count,
    max,
    size = 'md',
    variant = 'default',
    showZero = false,
    ...props 
  }, ref) => {
    if (!showZero && count === 0) return null;
    
    const displayCount = max && count > max ? `${max}+` : count;
    
    const sizeStyles = {
      sm: { fontSize: '0.75rem', padding: '2px 6px', minWidth: 16 },
      md: { fontSize: '0.875rem', padding: '4px 8px', minWidth: 20 },
      lg: { fontSize: '1rem', padding: '6px 12px', minWidth: 24 },
    };
    
    const variantStyles = {
      default: {
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
      },
      outlined: {
        backgroundColor: 'transparent',
        border: 1,
        borderColor: 'primary.main',
        color: 'primary.main',
      },
      filled: {
        backgroundColor: 'background.paper',
        color: 'text.primary',
        border: 1,
        borderColor: 'divider',
      },
    };
    
    return (
      <Box
        ref={ref}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          fontWeight: 600,
          lineHeight: 1,
          ...sizeStyles[size],
          ...variantStyles[variant],
        }}
        {...props}
      >
        {displayCount}
      </Box>
    );
  }
);

CounterBadge.displayName = 'CounterBadge';
