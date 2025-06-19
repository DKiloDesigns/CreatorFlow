import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnalyticsChartProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie' | 'donut';
  className?: string;
  loading?: boolean;
}

export function AnalyticsChart({
  title,
  data,
  type = 'bar',
  className,
  loading = false
}: AnalyticsChartProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === 'bar' && (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all duration-500',
                      item.color || 'bg-primary'
                    )}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {type === 'line' && (
          <div className="h-64 flex items-end justify-between gap-1">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={cn(
                    'w-full rounded-t transition-all duration-500',
                    item.color || 'bg-primary'
                  )}
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {type === 'pie' && (
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
                {data.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const circumference = 2 * Math.PI * 14; // radius = 14
                  const strokeDasharray = (percentage / 100) * circumference;
                  const strokeDashoffset = index === 0 ? 0 : 
                    data.slice(0, index).reduce((sum, d) => 
                      sum + ((d.value / total) * circumference), 0
                    );
                  
                  return (
                    <circle
                      key={index}
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke={item.color || '#3b82f6'}
                      strokeWidth="4"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium">{total}</span>
              </div>
            </div>
          </div>
        )}

        {type === 'donut' && (
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
                {data.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const circumference = 2 * Math.PI * 12; // radius = 12
                  const strokeDasharray = (percentage / 100) * circumference;
                  const strokeDashoffset = index === 0 ? 0 : 
                    data.slice(0, index).reduce((sum, d) => 
                      sum + ((d.value / total) * circumference), 0
                    );
                  
                  return (
                    <circle
                      key={index}
                      cx="16"
                      cy="16"
                      r="12"
                      fill="none"
                      stroke={item.color || '#3b82f6'}
                      strokeWidth="3"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold">{total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-1 text-xs">
              <div
                className={cn(
                  'w-3 h-3 rounded-full',
                  item.color || 'bg-primary'
                )}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  className
}: MetricCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={cn(
                'text-sm',
                change.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {change.isPositive ? '+' : ''}{change.value}%
              </p>
            )}
          </div>
          {Icon && (
            <Icon className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  );
} 