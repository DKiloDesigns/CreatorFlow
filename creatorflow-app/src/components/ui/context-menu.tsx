/**
 * Context Menu Component
 * Right-click context menus for enhanced user experience
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Copy as CopyIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  hidden?: boolean;
  divider?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  onClick: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  onClose?: () => void;
  className?: string;
}

interface ContextMenuState {
  open: boolean;
  x: number;
  y: number;
  target?: HTMLElement;
}

export function ContextMenu({ items, onClose, className }: ContextMenuProps) {
  const [state, setState] = useState<ContextMenuState>({
    open: false,
    x: 0,
    y: 0,
  });
  const theme = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.filter(item => !item.hidden);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setState({
      open: true,
      x,
      y,
      target: event.currentTarget as HTMLElement,
    });
  }, []);

  const handleClose = useCallback(() => {
    setState(prev => ({ ...prev, open: false }));
    onClose?.();
  }, [onClose]);

  const handleItemClick = useCallback((item: ContextMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      handleClose();
    }
  }, [handleClose]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (state.open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [state.open, handleClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.open) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.open, handleClose]);

  return (
    <>
      <Box
        onContextMenu={handleContextMenu}
        className={className}
        sx={{ position: 'relative' }}
      >
        {/* This will be the trigger element */}
      </Box>

      <AnimatePresence>
        {state.open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: state.x,
              top: state.y,
              zIndex: 9999,
            }}
          >
            <Box
              ref={menuRef}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: theme.shadows[8],
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                minWidth: 200,
                maxWidth: 300,
                py: 0.5,
              }}
            >
              {visibleItems.map((item, index) => {
                if (item.divider) {
                  return <Divider key={`divider-${index}`} sx={{ my: 0.5 }} />;
                }

                return (
                  <MenuItem
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    sx={{
                      py: 1,
                      px: 2,
                      minHeight: 40,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                      '&.Mui-disabled': {
                        opacity: 0.5,
                      },
                    }}
                  >
                    {item.icon && (
                      <ListItemIcon sx={{ minWidth: 36, color: item.color ? `${item.color}.main` : 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: item.color ? `${item.color}.main` : 'text.primary',
                      }}
                    />
                    {item.shortcut && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 2, fontSize: '0.75rem' }}
                      >
                        {item.shortcut}
                      </Typography>
                    )}
                  </MenuItem>
                );
              })}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook for context menu functionality
export function useContextMenu(items: ContextMenuItem[]) {
  const [state, setState] = useState<ContextMenuState>({
    open: false,
    x: 0,
    y: 0,
  });

  const showContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setState({
      open: true,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const hideContextMenu = useCallback(() => {
    setState(prev => ({ ...prev, open: false }));
  }, []);

  return {
    showContextMenu,
    hideContextMenu,
    contextMenuProps: {
      open: state.open,
      x: state.x,
      y: state.y,
      onClose: hideContextMenu,
    },
  };
}

// Predefined context menu items for common actions
export const createContextMenuItems = {
  // File operations
  file: (onEdit?: () => void, onDelete?: () => void, onCopy?: () => void): ContextMenuItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      icon: <EditIcon />,
      shortcut: 'E',
      onClick: onEdit || (() => {}),
    },
    {
      id: 'copy',
      label: 'Copy',
      icon: <CopyIcon />,
      shortcut: 'Ctrl+C',
      onClick: onCopy || (() => {}),
    },
    { id: 'divider1', divider: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: <DeleteIcon />,
      shortcut: 'Del',
      color: 'error',
      onClick: onDelete || (() => {}),
    },
  ],

  // Content operations
  content: (
    onEdit?: () => void,
    onDuplicate?: () => void,
    onSchedule?: () => void,
    onDelete?: () => void
  ): ContextMenuItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      icon: <EditIcon />,
      shortcut: 'E',
      onClick: onEdit || (() => {}),
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <CopyIcon />,
      shortcut: 'Ctrl+D',
      onClick: onDuplicate || (() => {}),
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <SettingsIcon />,
      shortcut: 'S',
      onClick: onSchedule || (() => {}),
    },
    { id: 'divider1', divider: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: <DeleteIcon />,
      shortcut: 'Del',
      color: 'error',
      onClick: onDelete || (() => {}),
    },
  ],

  // Media operations
  media: (
    onView?: () => void,
    onDownload?: () => void,
    onEdit?: () => void,
    onDelete?: () => void
  ): ContextMenuItem[] => [
    {
      id: 'view',
      label: 'View',
      icon: <VisibilityIcon />,
      shortcut: 'V',
      onClick: onView || (() => {}),
    },
    {
      id: 'download',
      label: 'Download',
      icon: <DownloadIcon />,
      shortcut: 'Ctrl+D',
      onClick: onDownload || (() => {}),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <EditIcon />,
      shortcut: 'E',
      onClick: onEdit || (() => {}),
    },
    { id: 'divider1', divider: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: <DeleteIcon />,
      shortcut: 'Del',
      color: 'error',
      onClick: onDelete || (() => {}),
    },
  ],

  // List item operations
  listItem: (
    onEdit?: () => void,
    onToggleFavorite?: () => void,
    onToggleBookmark?: () => void,
    onDelete?: () => void
  ): ContextMenuItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      icon: <EditIcon />,
      shortcut: 'E',
      onClick: onEdit || (() => {}),
    },
    {
      id: 'favorite',
      label: 'Toggle Favorite',
      icon: <StarBorderIcon />,
      shortcut: 'F',
      onClick: onToggleFavorite || (() => {}),
    },
    {
      id: 'bookmark',
      label: 'Toggle Bookmark',
      icon: <BookmarkBorderIcon />,
      shortcut: 'B',
      onClick: onToggleBookmark || (() => {}),
    },
    { id: 'divider1', divider: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: <DeleteIcon />,
      shortcut: 'Del',
      color: 'error',
      onClick: onDelete || (() => {}),
    },
  ],
};

// Higher-order component for adding context menu to any element
interface WithContextMenuProps {
  contextMenuItems: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}

export function WithContextMenu({ 
  contextMenuItems, 
  children, 
  className 
}: WithContextMenuProps) {
  const { showContextMenu, hideContextMenu, contextMenuProps } = useContextMenu(contextMenuItems);

  return (
    <>
      <Box
        onContextMenu={showContextMenu}
        className={className}
        sx={{ position: 'relative' }}
      >
        {children}
      </Box>
      
      <ContextMenu
        items={contextMenuItems}
        onClose={hideContextMenu}
        {...contextMenuProps}
      />
    </>
  );
}

export default ContextMenu;
