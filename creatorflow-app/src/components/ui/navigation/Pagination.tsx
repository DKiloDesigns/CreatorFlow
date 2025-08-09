'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

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
    const variantClasses = {
      default: 'bg-background border border-border',
      outlined: 'bg-background border-2 border-border',
      minimal: 'bg-transparent',
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const buttonClasses = cn(
      'flex items-center justify-center transition-all duration-200',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[size]
    );

    const pageButtonClasses = cn(
      buttonClasses,
      'min-w-[2.5rem] rounded-md',
      'border border-transparent'
    );

    const activePageClasses = cn(
      'bg-primary text-primary-foreground border-primary',
      'hover:bg-primary-dark'
    );

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
          <span
            key={`ellipsis-${index}`}
            className={cn(
              'flex items-center justify-center text-muted-foreground',
              sizeClasses[size]
            )}
          >
            <MoreHorizontal className="w-4 h-4" />
          </span>
        );
      }

      const pageNum = page as number;
      const isActive = pageNum === currentPage;

      return (
        <button
          key={pageNum}
          type="button"
          onClick={() => handlePageChange(pageNum)}
          disabled={disabled}
          className={cn(
            pageButtonClasses,
            isActive && activePageClasses,
            !isActive && 'hover:border-border'
          )}
          aria-current={isActive ? 'page' : undefined}
          aria-label={`Go to page ${pageNum}`}
        >
          {pageNum}
        </button>
      );
    };

    if (totalPages <= 1) return null;

    return (
      <nav
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-1',
          variantClasses[variant],
          'rounded-lg',
          fullWidth && 'w-full',
          className
        )}
        role="navigation"
        aria-label="Pagination"
        {...props}
      >
        {showFirstLast && (
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            className={cn(buttonClasses, 'rounded-md')}
            aria-label="Go to first page"
          >
            <span className="sr-only">First</span>
            <ChevronLeft className="w-4 h-4" />
            <ChevronLeft className="w-4 h-4 -ml-3" />
          </button>
        )}

        {showPrevNext && (
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            className={cn(buttonClasses, 'rounded-md')}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {generatePageNumbers().map(renderPageButton)}
          </div>
        )}

        {showPrevNext && (
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            className={cn(buttonClasses, 'rounded-md')}
            aria-label="Go to next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {showFirstLast && (
          <button
            type="button"
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            className={cn(buttonClasses, 'rounded-md')}
            aria-label="Go to last page"
          >
            <span className="sr-only">Last</span>
            <ChevronRight className="w-4 h-4" />
            <ChevronRight className="w-4 h-4 -ml-3" />
          </button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

export { Pagination };
