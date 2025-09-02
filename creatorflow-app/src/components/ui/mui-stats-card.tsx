import React from 'react';
import { Card, CardContent, CardHeader } from './mui-card';
import { Typography, Skeleton, Stack } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  onClick?: () => void;
  loading?: boolean;
}

export function MuiStatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  onClick,
  loading = false
}: StatsCardProps) {
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'danger':
        return 'error.main';
      default:
        return 'primary.main';
    }
  };

  const getTrendColor = () => {
    return trend?.isPositive ? 'success.main' : 'error.main';
  };

  return (
    <Card 
      className={className}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: onClick ? '0 4px 12px rgba(0, 0, 0, 0.15)' : undefined,
          transform: onClick ? 'translateY(-2px)' : undefined,
        },
        borderColor: variant !== 'default' ? getVariantColor() : undefined,
        backgroundColor: variant === 'danger' ? 'error.50' : undefined,
      }}
    >
      <CardHeader
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>
        {Icon && (
          <Icon 
            style={{ width: 16, height: 16, color: getVariantColor() }}
          />
        )}
      </CardHeader>
      
      <CardContent sx={{ pt: 0 }}>
        {loading ? (
          <Stack spacing={1}>
            <Skeleton variant="text" width="60%" height={32} />
            {description && (
              <Skeleton variant="text" width="75%" height={16} />
            )}
          </Stack>
        ) : (
          <Stack spacing={1}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
            
            {description && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                }}
              >
                {description}
              </Typography>
            )}
            
            {trend && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                {trend.isPositive ? (
                  <TrendingUp style={{ width: 12, height: 12, color: getTrendColor() }} />
                ) : (
                  <TrendingDown style={{ width: 12, height: 12, color: getTrendColor() }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: getTrendColor(),
                    fontSize: '0.75rem',
                  }}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                  }}
                >
                  vs {trend.period}
                </Typography>
              </Stack>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
} 