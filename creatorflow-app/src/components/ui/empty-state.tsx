import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  variant?: 'default' | 'minimal' | 'illustrated';
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className,
  children
}: EmptyStateProps) {
  const variants = {
    default: 'p-8 text-center',
    minimal: 'p-4 text-center',
    illustrated: 'p-12 text-center'
  };

  const iconSizes = {
    default: 'h-12 w-12',
    minimal: 'h-8 w-8',
    illustrated: 'h-16 w-16'
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center rounded-lg border border-dashed',
      variants[variant],
      className
    )}>
      {Icon && (
        <Icon className={cn(
          'text-muted-foreground mb-4',
          iconSizes[variant]
        )} />
      )}
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
      )}

      {children}

      {(action || secondaryAction) && (
        <div className="flex gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'outline'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-built empty states for common scenarios
export function EmptyContentState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      title="No content yet"
      description="Start creating your first post to get your social media presence going."
      action={{
        label: "Create Post",
        onClick: onCreate
      }}
    />
  );
}

export function EmptyAccountsState({ onConnect }: { onConnect: () => void }) {
  return (
    <EmptyState
      title="No connected accounts"
      description="Connect your social media accounts to start scheduling and publishing content."
      action={{
        label: "Connect Account",
        onClick: onConnect
      }}
    />
  );
}

export function EmptyAnalyticsState() {
  return (
    <EmptyState
      title="No analytics data yet"
      description="Start posting content to see your performance metrics and insights."
    />
  );
}

export function EmptySearchState({ query }: { query: string }) {
  return (
    <EmptyState
      title="No results found"
      description={`No content found matching "${query}". Try adjusting your search terms.`}
      variant="minimal"
    />
  );
} 