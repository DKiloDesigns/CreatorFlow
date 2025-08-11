'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeIcon?: React.ReactNode;
  homeLabel?: string;
  homeHref?: string;
  maxItems?: number;
  collapsed?: boolean;
  variant?: 'default' | 'minimal' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ 
    className, 
    items,
    separator = <ChevronRight className="w-4 h-4 text-muted-foreground" />,
    showHome = true,
    homeIcon = <Home className="w-4 h-4" />,
    homeLabel = 'Home',
    homeHref = '/',
    maxItems,
    _collapsed = false,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'bg-background text-foreground',
      minimal: 'bg-transparent text-foreground',
      outlined: 'bg-background border border-border text-foreground',
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const allItems = showHome 
      ? [{ label: homeLabel, href: homeHref, icon: homeIcon }, ...items]
      : items;

    const displayItems = maxItems && allItems.length > maxItems
      ? [...allItems.slice(0, 1), { label: '...', disabled: true }, ...allItems.slice(-1)]
      : allItems;

    const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
      const itemClasses = cn(
        'flex items-center gap-2 transition-colors duration-200',
        'hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isLast && 'text-foreground font-medium',
        !isLast && 'text-muted-foreground',
        item.disabled && 'text-muted-foreground cursor-not-allowed hover:text-muted-foreground',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg'
      );

      const content = (
        <>
          {item.icon && (
            <span className="flex-shrink-0">
              {item.icon}
            </span>
          )}
          <span className="truncate">{item.label}</span>
        </>
      );

      if (item.disabled || !item.href) {
        return (
          <span key={index} className={itemClasses}>
            {content}
          </span>
        );
      }

      if (item.onClick) {
        return (
          <button
            key={index}
            type="button"
            onClick={item.onClick}
            className={itemClasses}
          >
            {content}
          </button>
        );
      }

      return (
        <a
          key={index}
          href={item.href}
          className={itemClasses}
        >
          {content}
        </a>
      );
    };

    return (
      <nav
        ref={ref}
        className={cn(
          'flex items-center',
          variantClasses[variant],
          sizeClasses[size],
          'rounded-md',
          fullWidth && 'w-full',
          className
        )}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flex items-center gap-2">
          {displayItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 flex-shrink-0">
                  {separator}
                </span>
              )}
              {renderItem(item, index, index === displayItems.length - 1)}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };
