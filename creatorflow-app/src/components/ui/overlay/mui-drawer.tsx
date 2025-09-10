'use client';

import React from 'react';
import {
  Drawer as MuiDrawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

export interface DrawerItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  divider?: boolean;
  badge?: string | number;
  children?: DrawerItem[];
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  title?: string;
  subtitle?: string;
  items?: DrawerItem[];
  width?: number;
  variant?: 'permanent' | 'persistent' | 'temporary';
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  showCloseButton?: boolean;
  showHeader?: boolean;
  children?: React.ReactNode;
  sx?: any;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  onOpen,
  title,
  subtitle,
  items = [],
  width = 280,
  variant = 'temporary',
  anchor = 'left',
  showCloseButton = true,
  showHeader = true,
  children,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Auto-adjust variant for mobile
  const drawerVariant = isMobile ? 'temporary' : variant;

  const handleItemClick = (item: DrawerItem) => {
    if (item.disabled) return;
    item.onClick?.();
    if (drawerVariant === 'temporary') {
      onClose();
    }
  };

  const renderDrawerContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {showHeader && (title || subtitle) && (
        <>
          <Toolbar sx={{ minHeight: 64, px: 2 }}>
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
          </Toolbar>
          <Divider />
        </>
      )}

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {children ? (
          children
        ) : items.length > 0 ? (
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
                      <Box
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          borderRadius: '50%',
                          minWidth: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          px: 0.5,
                        }}
                      >
                        {item.badge}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
                {item.divider && index < items.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No items to display
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <MuiDrawer
      variant={drawerVariant}
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width,
          bgcolor: 'background.paper',
          borderRight: variant === 'permanent' ? `1px solid ${designTokens.colors.neutral[200]}` : 'none',
          ...sx,
        },
      }}
    >
      {renderDrawerContent()}
    </MuiDrawer>
  );
};

// Specialized Drawer Components
export const NavigationDrawer: React.FC<Omit<DrawerProps, 'variant' | 'anchor'>> = (props) => (
  <Drawer {...props} variant="temporary" anchor="left" />
);

export const SidebarDrawer: React.FC<Omit<DrawerProps, 'variant' | 'anchor'>> = (props) => (
  <Drawer {...props} variant="permanent" anchor="left" />
);

export const FilterDrawer: React.FC<Omit<DrawerProps, 'variant' | 'anchor'>> = (props) => (
  <Drawer {...props} variant="temporary" anchor="right" />
);

export const BottomDrawer: React.FC<Omit<DrawerProps, 'variant' | 'anchor'>> = (props) => (
  <Drawer {...props} variant="temporary" anchor="bottom" />
);

// Drawer Toggle Hook
export const useDrawer = (initialOpen = false) => {
  const [open, setOpen] = React.useState(initialOpen);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleToggle = () => setOpen(prev => !prev);

  return {
    open,
    handleOpen,
    handleClose,
    handleToggle,
  };
};

// Export individual components
export { MuiDrawer, Box, Typography, IconButton, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar };
