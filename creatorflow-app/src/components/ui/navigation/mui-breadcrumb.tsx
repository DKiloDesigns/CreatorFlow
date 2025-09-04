'use client';

import React, { forwardRef } from 'react';
import { 
  Breadcrumbs as MuiBreadcrumbs,
  BreadcrumbsProps as MuiBreadcrumbsProps,
  Link as MuiLink,
  LinkProps as MuiLinkProps,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

// Styled MUI Breadcrumbs
const StyledBreadcrumbs = styled(MuiBreadcrumbs)<{
  variant?: 'default' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}>(({ theme, variant = 'default', size = 'md' }) => ({
  '& .MuiBreadcrumbs-separator': {
    ...(size === 'sm' && {
      fontSize: '0.875rem',
      margin: '0 4px',
    }),
    ...(size === 'md' && {
      fontSize: '1rem',
      margin: '0 6px',
    }),
    ...(size === 'lg' && {
      fontSize: '1.125rem',
      margin: '0 8px',
    }),
    color: theme.palette.text.secondary,
  },
  ...(variant === 'outlined' && {
    padding: theme.spacing(1, 2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  }),
  ...(variant === 'minimal' && {
    '& .MuiBreadcrumbs-separator': {
      opacity: 0.5,
    },
  }),
}));

// Styled MUI Link
const StyledLink = styled(MuiLink)<{
  variant?: 'default' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}>(({ theme, variant = 'default', size = 'md', active = false }) => ({
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  transition: theme.transitions.create(['color', 'opacity']),
  
  ...(size === 'sm' && {
    fontSize: '0.875rem',
  }),
  ...(size === 'md' && {
    fontSize: '1rem',
  }),
  ...(size === 'lg' && {
    fontSize: '1.125rem',
  }),
  
  ...(variant === 'default' && {
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  }),
  ...(variant === 'outlined' && {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.primary.main,
    },
  }),
  ...(variant === 'minimal' && {
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
    opacity: active ? 1 : 0.7,
    '&:hover': {
      opacity: 1,
      color: theme.palette.primary.main,
    },
  }),
}));

// Main Breadcrumbs component
export interface BreadcrumbsProps extends Omit<MuiBreadcrumbsProps, 'variant'> {
  variant?: 'default' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  separator?: React.ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ 
    variant = 'default',
    size = 'md',
    separator = <ChevronRight size={16} />,
    maxItems,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
    children,
    ...props 
  }, ref) => {
    return (
      <StyledBreadcrumbs
        ref={ref}
        variant={variant}
        size={size}
        separator={separator}
        maxItems={maxItems}
        itemsBeforeCollapse={itemsBeforeCollapse}
        itemsAfterCollapse={itemsAfterCollapse}
        {...props}
      >
        {children}
      </StyledBreadcrumbs>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';

// BreadcrumbItem component
export interface BreadcrumbItemProps extends Omit<MuiLinkProps, 'variant'> {
  href?: string;
  variant?: 'default' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const BreadcrumbItem = forwardRef<HTMLAnchorElement, BreadcrumbItemProps>(
  ({ 
    href,
    variant = 'default',
    size = 'md',
    active = false,
    icon,
    children,
    ...props 
  }, ref) => {
    const content = (
      <>
        {icon}
        {children}
      </>
    );

    if (href && !active) {
      return (
        <StyledLink
          ref={ref}
          href={href}
          variant={variant as any}
          size={size}
          active={active}
          component={Link}
          {...props}
        >
          {content}
        </StyledLink>
      );
    }

    return (
      <Typography
        component="span"
        variant={size === 'sm' ? 'body2' : size === 'lg' ? 'h6' : 'body1'}
        color={active ? 'text.primary' : 'text.secondary'}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {content}
      </Typography>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

// HomeBreadcrumb component
export interface HomeBreadcrumbProps extends Omit<BreadcrumbItemProps, 'href' | 'icon'> {
  homeHref?: string;
}

export const HomeBreadcrumb = forwardRef<HTMLAnchorElement, HomeBreadcrumbProps>(
  ({ homeHref = '/', variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <BreadcrumbItem
        ref={ref}
        href={homeHref}
        variant={variant}
        size={size}
        icon={<Home size={16} />}
        {...props}
      >
        Home
      </BreadcrumbItem>
    );
  }
);

HomeBreadcrumb.displayName = 'HomeBreadcrumb';
