'use client';

import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  useTheme,
} from '@mui/material';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  icon,
  actions 
}: PageHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 3,
        pb: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<ChevronRight size={16} />}
          sx={{ mb: 2 }}
        >
          <Link
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline',
              },
            }}
          >
            <Home size={16} />
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              href={crumb.href}
              sx={{
                color: index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary',
                textDecoration: index === breadcrumbs.length - 1 ? 'none' : 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}

      {/* Title and Actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: subtitle ? 0.5 : 0,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: '1rem' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Actions */}
        {actions && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}
