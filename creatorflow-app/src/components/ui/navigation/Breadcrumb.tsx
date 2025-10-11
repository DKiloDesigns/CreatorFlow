'use client';

import React, { forwardRef } from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import { ChevronRight as ChevronRightIcon, Home as HomeIcon } from '@mui/icons-material';

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
    separator = <ChevronRightIcon sx={{ width: 16, height: 16, color: 'var(--mui-palette-text-disabled)' }} />,
    showHome = true,
    homeIcon = <HomeIcon sx={{ width: 16, height: 16 }} />,
    homeLabel = 'Home',
    homeHref = '/',
    maxItems,
    _collapsed = false,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    ...props
  }, ref) => {
    const getVariantStyles = () => {
      const variantMap = {
        default: { bgcolor: 'background.paper', color: 'text.primary' },
        minimal: { bgcolor: 'transparent', color: 'text.primary' },
        outlined: { bgcolor: 'background.paper', border: 1, borderColor: 'divider', color: 'text.primary' },
      };
      return variantMap[variant];
    };

    const getSizeStyles = () => {
      const sizeMap = {
        sm: { px: 1, py: 0.5, fontSize: '0.875rem' },
        md: { px: 1.5, py: 1, fontSize: '1rem' },
        lg: { px: 2, py: 1.5, fontSize: '1.125rem' },
      };
      return sizeMap[size];
    };

    const allItems = showHome
      ? [{ label: homeLabel, href: homeHref, icon: homeIcon }, ...items]
      : items;

    const displayItems = maxItems && allItems.length > maxItems
      ? [...allItems.slice(0, 1), { label: '...', disabled: true }, ...allItems.slice(-1)]
      : allItems;

    const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
      const getItemStyles = () => ({
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        transition: 'color 0.2s',
        '&:hover': { color: 'primary.main' },
        '&:focus': { color: 'primary.main', outline: 'none', ring: 2, ringColor: 'primary.main', ringOffset: 2 },
        ...(isLast && { color: 'text.primary', fontWeight: 500 }),
        ...(!isLast && { color: 'text.disabled' }),
        ...(item.disabled && { color: 'text.disabled', cursor: 'not-allowed', '&:hover': { color: 'text.disabled' } }),
        ...(size === 'sm' && { fontSize: '0.875rem' }),
        ...(size === 'md' && { fontSize: '1rem' }),
        ...(size === 'lg' && { fontSize: '1.125rem' })
      });

      const content = (
        <>
          {item.icon && (
            <Box sx={{ flexShrink: 0 }}>
              {item.icon}
            </Box>
          )}
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</Box>
        </>
      );

      if (item.disabled || !item.href) {
        return (
          <Box key={index} sx={getItemStyles()}>
            {content}
          </Box>
        );
      }

      if (item.onClick) {
        return (
          <Button
            key={index}
            variant="text"
            onClick={item.onClick}
            sx={getItemStyles()}
          >
            {content}
          </Button>
        );
      }

      return (
        <Link
          key={index}
          href={item.href}
          sx={getItemStyles()}
        >
          {content}
        </Link>
      );
    };

    return (
      <Box
        component="nav"
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '6px',
          ...(fullWidth && { width: '100%' }),
          ...getVariantStyles(),
          ...getSizeStyles(),
          ...(className && { className })
        }}
        aria-label="Breadcrumb"
        {...props}
      >
        <Box component="ol" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {displayItems.map((item, index) => (
            <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'center' }}>
              {index > 0 && (
                <Box sx={{ mx: 1, flexShrink: 0 }}>
                  {separator}
                </Box>
              )}
              {renderItem(item, index, index === displayItems.length - 1)}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };
