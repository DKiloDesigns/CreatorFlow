'use client';

import React, { forwardRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, MoreHoriz as MoreHorizIcon } from '@mui/icons-material';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  disabled?: boolean;
  fullWidth?: boolean;
}

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({
    className,
    currentPage,
    totalPages,
    onPageChange,
    variant = 'default',
    size = 'md',
    showFirstLast = true,
    showPrevNext = true,
    showPageNumbers = true,
    maxVisiblePages = 5,
    disabled = false,
    fullWidth = false,
    ...props
  }, ref) => {
    const getVariantStyles = () => {
      const variantMap = {
        default: { bgcolor: 'background.paper', border: 1, borderColor: 'divider' },
        outlined: { bgcolor: 'background.paper', border: 2, borderColor: 'divider' },
        minimal: { bgcolor: 'transparent' },
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

    const getButtonStyles = () => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      '&:hover': { bgcolor: 'action.hover' },
      '&:focus': { outline: 'none', ring: 2, ringColor: 'primary.main', ringOffset: 2 },
      '&.Mui-disabled': { opacity: 0.5, cursor: 'not-allowed' },
      ...getSizeStyles()
    });

    const getPageButtonStyles = () => ({
      ...getButtonStyles(),
      minWidth: '2.5rem',
      borderRadius: '6px',
      border: 1,
      borderColor: 'transparent'
    });

    const getActivePageStyles = () => ({
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      borderColor: 'primary.main',
      '&:hover': { bgcolor: 'primary.dark' }
    });

    const generatePageNumbers = () => {
      if (totalPages <= maxVisiblePages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      const pages: (number | string)[] = [];
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }

      return pages;
    };

    const handlePageChange = (page: number) => {
      if (disabled || page < 1 || page > totalPages || page === currentPage) return;
      onPageChange(page);
    };

    const renderPageButton = (page: number | string, index: number) => {
      if (page === '...') {
        return (
          <Box
            key={`ellipsis-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.disabled',
              ...getSizeStyles()
            }}
          >
            <MoreHorizIcon sx={{ width: 16, height: 16 }} />
          </Box>
        );
      }

      const pageNum = page as number;
      const isActive = pageNum === currentPage;

      return (
        <Button
          key={pageNum}
          variant="outlined"
          onClick={() => handlePageChange(pageNum)}
          disabled={disabled}
          sx={{
            ...getPageButtonStyles(),
            ...(isActive && getActivePageStyles()),
            ...(!isActive && { '&:hover': { borderColor: 'divider' } })
          }}
          aria-current={isActive ? 'page' : undefined}
          aria-label={`Go to page ${pageNum}`}
        >
          {pageNum}
        </Button>
      );
    };

    if (totalPages <= 1) return null;

    return (
      <Box
        component="nav"
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          borderRadius: '8px',
          ...(fullWidth && { width: '100%' }),
          ...getVariantStyles(),
          ...(className && { className })
        }}
        role="navigation"
        aria-label="Pagination"
        {...props}
      >
        {showFirstLast && (
          <Button
            variant="outlined"
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            sx={{ ...getButtonStyles(), borderRadius: '6px' }}
            aria-label="Go to first page"
          >
            <Box component="span" sx={{ srOnly: 'First' }}>First</Box>
            <ChevronLeftIcon sx={{ width: 16, height: 16 }} />
            <ChevronLeftIcon sx={{ width: 16, height: 16, marginLeft: -12 }} />
          </Button>
        )}

        {showPrevNext && (
          <Button
            variant="outlined"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            sx={{ ...getButtonStyles(), borderRadius: '6px' }}
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon sx={{ width: 16, height: 16 }} />
          </Button>
        )}

        {showPageNumbers && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {generatePageNumbers().map(renderPageButton)}
          </Box>
        )}

        {showPrevNext && (
          <Button
            variant="outlined"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            sx={{ ...getButtonStyles(), borderRadius: '6px' }}
            aria-label="Go to next page"
          >
            <ChevronRightIcon sx={{ width: 16, height: 16 }} />
          </Button>
        )}

        {showFirstLast && (
          <Button
            variant="outlined"
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            sx={{ ...getButtonStyles(), borderRadius: '6px' }}
            aria-label="Go to last page"
          >
            <Box component="span" sx={{ srOnly: 'Last' }}>Last</Box>
            <ChevronRightIcon sx={{ width: 16, height: 16 }} />
            <ChevronRightIcon sx={{ width: 16, height: 16, marginLeft: -12 }} />
          </Button>
        )}
      </Box>
    );
  }
);

Pagination.displayName = 'Pagination';

export { Pagination };
