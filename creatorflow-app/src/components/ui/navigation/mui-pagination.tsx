'use client';

import React, { forwardRef } from 'react';
import { 
  Pagination as MuiPagination,
  PaginationProps as MuiPaginationProps,
  Box,
  BoxProps,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled MUI Pagination
const StyledPagination = styled(MuiPagination)<{
  variant?: 'default' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'standard';
}>(({ theme, variant = 'default', size = 'md', _color = 'primary' }) => ({
  '& .MuiPaginationItem-root': {
    ...(size === 'sm' && {
      minWidth: 32,
      height: 32,
      fontSize: '0.875rem',
    }),
    ...(size === 'md' && {
      minWidth: 40,
      height: 40,
      fontSize: '1rem',
    }),
    ...(size === 'lg' && {
      minWidth: 48,
      height: 48,
      fontSize: '1.125rem',
    }),
    
    ...(variant === 'outlined' && {
      border: `1px solid ${theme.palette.divider}`,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    }),
    
    ...(variant === 'minimal' && {
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected,
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    }),
  },
  
  '& .MuiPaginationItem-ellipsis': {
    ...(size === 'sm' && {
      minWidth: 32,
      height: 32,
    }),
    ...(size === 'md' && {
      minWidth: 40,
      height: 40,
    }),
    ...(size === 'lg' && {
      minWidth: 48,
      height: 48,
    }),
  },
}));

// Styled Select for page size
const StyledSelect = styled(Select)<{
  size?: 'sm' | 'md' | 'lg';
}>(({ _theme, size = 'md' }) => ({
  ...(size === 'sm' && {
    fontSize: '0.875rem',
    '& .MuiSelect-select': {
      padding: '4px 8px',
      minHeight: '24px',
    },
  }),
  ...(size === 'md' && {
    fontSize: '1rem',
    '& .MuiSelect-select': {
      padding: '6px 12px',
      minHeight: '32px',
    },
  }),
  ...(size === 'lg' && {
    fontSize: '1.125rem',
    '& .MuiSelect-select': {
      padding: '8px 16px',
      minHeight: '40px',
    },
  }),
}));

// Main Pagination component
export interface PaginationProps extends Omit<MuiPaginationProps, 'variant'> {
  variant?: 'default' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'standard';
  showFirstButton?: boolean;
  showLastButton?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
  shape?: 'circular' | 'rounded';
  disabled?: boolean;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ 
    variant = 'default',
    size = 'md',
    color = 'primary',
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1,
    boundaryCount = 1,
    shape = 'circular',
    disabled = false,
    ...props 
  }, ref) => {
    return (
      <StyledPagination
        ref={ref}
        variant={variant}
        size={size}
        color={color}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        shape={shape}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Pagination.displayName = 'Pagination';

// PaginationInfo component
export interface PaginationInfoProps extends BoxProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

export const PaginationInfo = forwardRef<HTMLDivElement, PaginationInfoProps>(
  ({ 
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    size = 'md',
    variant = 'default',
    ...props 
  }, ref) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    const variantStyles = {
      default: {
        backgroundColor: 'background.paper',
        padding: 2,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
      },
      minimal: {
        padding: 1,
      },
    };
    
    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          ...variantStyles[variant],
        }}
        {...props}
      >
        <Typography
          variant={size === 'sm' ? 'body2' : size === 'lg' ? 'body1' : 'body2'}
          color="text.secondary"
        >
          Showing {startItem}-{endItem} of {totalItems} results
        </Typography>
        
        {variant === 'default' && (
          <Typography
            variant={size === 'sm' ? 'body2' : size === 'lg' ? 'body1' : 'body2'}
            color="text.secondary"
          >
            Page {currentPage} of {totalPages}
          </Typography>
        )}
      </Box>
    );
  }
);

PaginationInfo.displayName = 'PaginationInfo';

// PageSizeSelector component
export interface PageSizeSelectorProps extends BoxProps {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions: number[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  label?: string;
}

export const PageSizeSelector = forwardRef<HTMLDivElement, PageSizeSelectorProps>(
  ({ 
    pageSize,
    onPageSizeChange,
    pageSizeOptions,
    size = 'md',
    variant = 'default',
    label = 'Items per page',
    ...props 
  }, ref) => {
    const variantStyles = {
      default: {
        backgroundColor: 'background.paper',
        padding: 2,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
      },
      minimal: {
        padding: 1,
      },
    };
    
    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          ...variantStyles[variant],
        }}
        {...props}
      >
        <FormControl size={size} variant="outlined">
          <InputLabel>{label}</InputLabel>
          <StyledSelect
            size={size}
            value={pageSize}
            onChange={(e) => onPageSizeChange(e.target.value as number)}
            label={label}
          >
            {pageSizeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
      </Box>
    );
  }
);

PageSizeSelector.displayName = 'PageSizeSelector';

// Enhanced Pagination component with all features
export interface EnhancedPaginationProps extends PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showPaginationInfo?: boolean;
  layout?: 'default' | 'compact' | 'detailed';
}

export const EnhancedPagination = forwardRef<HTMLDivElement, EnhancedPaginationProps>(
  ({ 
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50, 100],
    showPageSizeSelector = false,
    showPaginationInfo = false,
    layout = 'default',
    _variant = 'default',
    _size = 'md',
    ...props 
  }, ref) => {
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
      onPageChange(page);
    };
    
    const layoutStyles = {
      default: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
      },
      compact: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      },
      detailed: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      },
    };
    
    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          ...layoutStyles[layout],
        }}
      >
        {showPaginationInfo && (
          <PaginationInfo
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            size={_size}
            variant={_variant}
          />
        )}
        
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant={_variant}
          size={_size}
          {...props}
        />
        
        {showPageSizeSelector && onPageSizeChange && (
          <PageSizeSelector
            pageSize={itemsPerPage}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={pageSizeOptions}
            size={_size}
            variant={_variant}
          />
        )}
      </Box>
    );
  }
);

EnhancedPagination.displayName = 'EnhancedPagination';
