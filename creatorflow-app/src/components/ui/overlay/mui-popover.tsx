'use client';

import React from 'react';
import {
  Popover as MuiPopover,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Button,
  TextField,
  Chip,
  Avatar,
  MenuList,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

export interface PopoverItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  divider?: boolean;
  badge?: string | number;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  children?: PopoverItem[];
}

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  title?: string;
  subtitle?: string;
  items?: PopoverItem[];
  children?: React.ReactNode;
  showCloseButton?: boolean;
  showHeader?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  maxWidth?: number | string;
  maxHeight?: number | string;
  variant?: 'menu' | 'card' | 'form' | 'content';
  sx?: any;
}

export const Popover: React.FC<PopoverProps> = ({
  open,
  onClose,
  anchorEl,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  title,
  subtitle,
  items = [],
  children,
  showCloseButton = true,
  showHeader = true,
  showBackButton = false,
  onBack,
  maxWidth = 320,
  maxHeight = 400,
  variant = 'menu',
  sx,
}) => {
  const handleItemClick = (item: PopoverItem) => {
    if (item.disabled) return;
    item.onClick?.();
    // Don't auto-close for menu items with children
    if (!item.children || item.children.length === 0) {
      onClose();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'menu':
        return {
          minWidth: 200,
          maxWidth,
          maxHeight,
          '& .MuiList-root': {
            py: 1,
          },
        };
      case 'card':
        return {
          minWidth: 300,
          maxWidth,
          maxHeight,
          p: 2,
        };
      case 'form':
        return {
          minWidth: 400,
          maxWidth,
          maxHeight,
          p: 3,
        };
      case 'content':
        return {
          minWidth: 500,
          maxWidth,
          maxHeight,
          p: 2,
        };
      default:
        return {
          minWidth: 200,
          maxWidth,
          maxHeight,
        };
    }
  };

  const renderContent = () => {
    if (children) {
      return children;
    }

    if (variant === 'menu' && items.length > 0) {
      return (
        <MenuList sx={{ py: 1 }}>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <MenuItem
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                sx={{
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                {item.icon && (
                  <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      color: item.disabled ? 'text.disabled' : 'text.primary',
                    },
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color={item.color || 'default'}
                    sx={{ ml: 1 }}
                  />
                )}
              </MenuItem>
              {item.divider && index < items.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </React.Fragment>
          ))}
        </MenuList>
      );
    }

    if (items.length > 0) {
      return (
        <List sx={{ py: 1 }}>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  {item.icon && (
                    <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: 500,
                        color: item.disabled ? 'text.disabled' : 'text.primary',
                      },
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      color={item.color || 'default'}
                      sx={{ ml: 1 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
              {item.divider && index < items.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </React.Fragment>
          ))}
        </List>
      );
    }

    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No items to display
        </Typography>
      </Box>
    );
  };

  return (
    <MuiPopover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      slotProps={{
        paper: {
          sx: {
            ...getVariantStyles(),
            bgcolor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            borderRadius: 2,
            border: `1px solid ${designTokens.colors.neutral[200]}`,
            overflow: 'hidden',
            ...sx,
          },
        },
      }}
    >
      {showHeader && (title || subtitle || showCloseButton || showBackButton) && (
        <>
          <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {showBackButton && (
                <IconButton
                  onClick={onBack}
                  size="small"
                  sx={{ mr: 1, color: 'text.secondary' }}
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Box sx={{ flex: 1 }}>
                {title && (
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
            {showCloseButton && (
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
          <Divider />
        </>
      )}

      <Box sx={{ maxHeight: maxHeight, overflow: 'auto' }}>
        {renderContent()}
      </Box>
    </MuiPopover>
  );
};

// Specialized Popover Components
export const MenuPopover: React.FC<Omit<PopoverProps, 'variant'>> = (props) => (
  <Popover {...props} variant="menu" />
);

export const CardPopover: React.FC<Omit<PopoverProps, 'variant'>> = (props) => (
  <Popover {...props} variant="card" />
);

export const FormPopover: React.FC<Omit<PopoverProps, 'variant'>> = (props) => (
  <Popover {...props} variant="form" />
);

export const ContentPopover: React.FC<Omit<PopoverProps, 'variant'>> = (props) => (
  <Popover {...props} variant="content" />
);

// Popover Hook
export const usePopover = (initialOpen = false) => {
  const [open, setOpen] = React.useState(initialOpen);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    if (open) {
      handleClose();
    } else {
      handleOpen(event);
    }
  };

  return {
    open,
    anchorEl,
    handleOpen,
    handleClose,
    handleToggle,
  };
};

// Export individual components
export { MuiPopover, Box, Typography, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Button, TextField, Chip, Avatar, MenuList, MenuItem };
