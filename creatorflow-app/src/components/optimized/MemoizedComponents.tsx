'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  MoreVert,
  Edit,
  Delete
} from '@/lib/mui-optimized-imports';

// Memoized Stats Card
export const MemoizedStatsCard = memo(({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon 
}: {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}) => {
  const changeColor = useMemo(() => {
    switch (changeType) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      default: return 'default';
    }
  }, [changeType]);

  const changeIcon = useMemo(() => {
    if (changeType === 'positive') return <TrendingUp fontSize="small" />;
    if (changeType === 'negative') return <TrendingDown fontSize="small" />;
    return null;
  }, [changeType]);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                {changeIcon}
                <Chip 
                  label={change} 
                  color={changeColor as any}
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
          {icon && (
            <Box sx={{ color: 'primary.main' }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

MemoizedStatsCard.displayName = 'MemoizedStatsCard';

// Memoized User Avatar
export const MemoizedUserAvatar = memo(({ 
  name, 
  image, 
  size = 'medium',
  onClick 
}: {
  name: string;
  image?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}) => {
  const avatarSize = useMemo(() => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 56;
      default: return 40;
    }
  }, [size]);

  const initials = useMemo(() => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, [name]);

  return (
    <Avatar
      src={image}
      alt={name}
      sx={{ 
        width: avatarSize, 
        height: avatarSize,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      {!image && initials}
    </Avatar>
  );
});

MemoizedUserAvatar.displayName = 'MemoizedUserAvatar';

// Memoized Action Button
export const MemoizedActionButton = memo(({ 
  action, 
  icon, 
  label, 
  color = 'primary',
  onClick 
}: {
  action: string;
  icon: React.ReactNode;
  label: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  onClick: () => void;
}) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <Tooltip title={label}>
      <IconButton
        color={color}
        onClick={handleClick}
        size="small"
        sx={{ 
          '&:hover': {
            backgroundColor: `${color}.light`,
            color: `${color}.contrastText`
          }
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
});

MemoizedActionButton.displayName = 'MemoizedActionButton';

// Memoized List Item
export const MemoizedListItem = memo(({ 
  title, 
  subtitle, 
  avatar, 
  actions,
  onClick 
}: {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  actions?: React.ReactNode[];
  onClick?: () => void;
}) => {
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const actionButtons = useMemo(() => {
    return actions?.map((action, index) => (
      <Box key={index} sx={{ ml: 1 }}>
        {action}
      </Box>
    ));
  }, [actions]);

  return (
    <Card 
      sx={{ 
        mb: 1,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          backgroundColor: 'action.hover',
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out'
        } : {}
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {avatar && (
              <Box sx={{ mr: 2 }}>
                {avatar}
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          {actionButtons && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {actionButtons}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

MemoizedListItem.displayName = 'MemoizedListItem';

// Memoized Loading Skeleton
export const MemoizedLoadingSkeleton = memo(({ 
  variant = 'card',
  count = 1 
}: {
  variant?: 'card' | 'list' | 'table';
  count?: number;
}) => {
  const skeletons = useMemo(() => {
    return Array.from({ length: count }, (_, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        {variant === 'card' && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'grey.200' }} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ width: '60%', height: 20, mb: 1, bgcolor: 'grey.200' }} />
                  <Box sx={{ width: '40%', height: 16, bgcolor: 'grey.200' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
        {variant === 'list' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'grey.200' }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ width: '70%', height: 18, mb: 0.5, bgcolor: 'grey.200' }} />
              <Box sx={{ width: '50%', height: 14, bgcolor: 'grey.200' }} />
            </Box>
          </Box>
        )}
        {variant === 'table' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'grey.200' }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ width: '80%', height: 16, bgcolor: 'grey.200' }} />
            </Box>
          </Box>
        )}
      </Box>
    ));
  }, [variant, count]);

  return <>{skeletons}</>;
});

MemoizedLoadingSkeleton.displayName = 'MemoizedLoadingSkeleton'; 