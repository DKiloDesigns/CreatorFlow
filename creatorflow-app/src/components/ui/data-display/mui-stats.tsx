'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  CircularProgress,
  Skeleton,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  MoreVert,
  Refresh,
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

export interface StatItem {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  avatar?: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'flat';
    period?: string;
  };
  progress?: {
    value: number;
    max?: number;
    label?: string;
  };
  status?: 'active' | 'inactive' | 'warning' | 'error';
  metadata?: {
    unit?: string;
    format?: 'number' | 'currency' | 'percentage' | 'duration';
    precision?: number;
  };
  actions?: React.ReactNode;
  onClick?: () => void;
}

export interface StatsProps {
  stats: StatItem[];
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  loading?: boolean;
  showTrends?: boolean;
  showProgress?: boolean;
  showActions?: boolean;
  onRefresh?: () => void;
  onStatClick?: (stat: StatItem) => void;
  sx?: any;
}

export const Stats: React.FC<StatsProps> = ({
  stats,
  columns = 4,
  loading = false,
  showTrends = true,
  showProgress = false,
  showActions = false,
  onRefresh,
  onStatClick,
  sx,
}) => {
  const formatValue = (value: string | number, metadata?: StatItem['metadata']) => {
    if (typeof value === 'string') return value;
    
    const { unit, format, precision = 0 } = metadata || {};
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: precision,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(precision)}%`;
      case 'duration':
        return `${value}${unit || 's'}`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(value);
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp sx={{ color: designTokens.colors.success[600] }} />;
      case 'down': return <TrendingDown sx={{ color: designTokens.colors.error[600] }} />;
      case 'flat': return <TrendingFlat sx={{ color: designTokens.colors.info[600] }} />;
      default: return <TrendingFlat />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getColorValue = (color?: string) => {
    switch (color) {
      case 'primary': return designTokens.colors.primary[500];
      case 'secondary': return designTokens.colors.secondary[500];
      case 'error': return designTokens.colors.error[500];
      case 'warning': return designTokens.colors.warning[500];
      case 'info': return designTokens.colors.info[500];
      case 'success': return designTokens.colors.success[500];
      default: return designTokens.colors.primary[500];
    }
  };

  if (loading) {
    return (
      <Grid container spacing={3} sx={sx}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} item xs={12} sm={6} md={12 / columns}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                </Box>
                <Skeleton variant="text" width="80%" height={32} />
                <Skeleton variant="text" width="50%" height={16} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={sx}>
      {stats.map((stat) => (
        <Grid key={stat.id} item xs={12} sm={6} md={12 / columns}>
          <Card
            sx={{
              height: '100%',
              cursor: stat.onClick || onStatClick ? 'pointer' : 'default',
              '&:hover': (stat.onClick || onStatClick) ? {
                elevation: 4,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
              } : {},
            }}
            onClick={() => {
              onStatClick?.(stat);
              stat.onClick?.();
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {stat.avatar && (
                    <Avatar
                      src={stat.avatar}
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        bgcolor: getColorValue(stat.color),
                      }}
                    />
                  )}
                  {stat.icon && !stat.avatar && (
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        bgcolor: getColorValue(stat.color),
                        color: 'white',
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {stat.title}
                    </Typography>
                    {stat.subtitle && (
                      <Typography variant="body2" color="text.secondary">
                        {stat.subtitle}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {stat.status && (
                    <Chip
                      label={stat.status}
                      color={getStatusColor(stat.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {showActions && stat.actions && (
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  )}
                </Box>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: getColorValue(stat.color),
                  mb: 1,
                }}
              >
                {formatValue(stat.value, stat.metadata)}
              </Typography>

              {showTrends && stat.trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {getTrendIcon(stat.trend.direction)}
                  <Typography
                    variant="body2"
                    sx={{
                      color: stat.trend.direction === 'up' ? 'success.main' :
                             stat.trend.direction === 'down' ? 'error.main' : 'info.main',
                      fontWeight: 500,
                    }}
                  >
                    {stat.trend.value > 0 ? '+' : ''}{stat.trend.value}%
                  </Typography>
                  {stat.trend.period && (
                    <Typography variant="caption" color="text.secondary">
                      {stat.trend.period}
                    </Typography>
                  )}
                </Box>
              )}

              {showProgress && stat.progress && (
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {stat.progress.label || 'Progress'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.progress.value} / {stat.progress.max || 100}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(stat.progress.value / (stat.progress.max || 100)) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getColorValue(stat.color),
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              )}

              {stat.actions && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  {stat.actions}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Specialized Stats Components
export const MetricCards: React.FC<Omit<StatsProps, 'showTrends' | 'showProgress'>> = (props) => (
  <Stats {...props} showTrends={false} showProgress={false} />
);

export const ProgressStats: React.FC<Omit<StatsProps, 'showProgress'>> = (props) => (
  <Stats {...props} showProgress />
);

export const TrendStats: React.FC<Omit<StatsProps, 'showTrends'>> = (props) => (
  <Stats {...props} showTrends />
);

export const CompactStats: React.FC<Omit<StatsProps, 'columns'>> = (props) => (
  <Stats {...props} columns={6} />
);

// Export individual components
export { Card, CardContent, Grid, Avatar, Chip, LinearProgress, CircularProgress };
