import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

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

export function StatsCard({
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
  const variantStyles = {
    default: 'border-border hover:border-primary/50',
    success: 'border-green-200 hover:border-green-300 bg-green-50/50 dark:bg-green-950/20',
    warning: 'border-yellow-200 hover:border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/20',
    danger: 'border-red-200 hover:border-red-300 bg-red-50/50 dark:bg-red-950/20'
  };

  const iconColors = {
    default: 'text-primary',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400'
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md cursor-pointer group',
        variantStyles[variant],
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn('h-4 w-4 transition-colors', iconColors[variant])} />
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 bg-muted animate-pulse rounded" />
            {description && (
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">
              {value}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={cn(
                  'font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-muted-foreground">
                  vs {trend.period}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 