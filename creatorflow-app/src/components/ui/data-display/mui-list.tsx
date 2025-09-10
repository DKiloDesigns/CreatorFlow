'use client';

import React from 'react';
import {
  List as MuiList,
  ListItem as MuiListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
  Divider,
  Box,
  Typography,
  IconButton,
  Checkbox,
  Avatar,
  Chip,
  Skeleton,
} from '@mui/material';
import { designTokens } from '@/lib/design-system';

export interface ListItemProps {
  id: string;
  primary: string;
  secondary?: string;
  icon?: React.ReactNode;
  avatar?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  divider?: boolean;
  checkbox?: boolean;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  chip?: {
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    size?: 'small' | 'medium';
  };
}

export interface ListProps {
  items: ListItemProps[];
  dense?: boolean;
  disablePadding?: boolean;
  subheader?: string;
  loading?: boolean;
  emptyMessage?: string;
  onItemClick?: (item: ListItemProps) => void;
  onItemCheck?: (item: ListItemProps, checked: boolean) => void;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  sx?: any;
}

export const List: React.FC<ListProps> = ({
  items,
  dense = false,
  disablePadding = false,
  subheader,
  loading = false,
  emptyMessage = 'No items to display',
  onItemClick,
  onItemCheck,
  selectable = false,
  multiSelect = false,
  selectedItems = [],
  onSelectionChange,
  sx,
}) => {
  const handleItemClick = (item: ListItemProps) => {
    if (item.disabled) return;
    
    if (selectable) {
      if (multiSelect) {
        const newSelection = selectedItems.includes(item.id)
          ? selectedItems.filter(id => id !== item.id)
          : [...selectedItems, item.id];
        onSelectionChange?.(newSelection);
      } else {
        onSelectionChange?.([item.id]);
      }
    }
    
    onItemClick?.(item);
    item.onClick?.();
  };

  const handleItemCheck = (item: ListItemProps, checked: boolean) => {
    onItemCheck?.(item, checked);
    item.onCheck?.(checked);
  };

  if (loading) {
    return (
      <MuiList dense={dense} disablePadding={disablePadding} sx={sx}>
        {subheader && <ListSubheader>{subheader}</ListSubheader>}
        {[1, 2, 3].map((i) => (
          <MuiListItem key={i} divider>
            <ListItemIcon>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemIcon>
            <ListItemText
              primary={<Skeleton variant="text" width="60%" />}
              secondary={<Skeleton variant="text" width="40%" />}
            />
          </MuiListItem>
        ))}
      </MuiList>
    );
  }

  if (items.length === 0) {
    return (
      <MuiList dense={dense} disablePadding={disablePadding} sx={sx}>
        {subheader && <ListSubheader>{subheader}</ListSubheader>}
        <MuiListItem>
          <ListItemText
            primary={
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 2 }}
              >
                {emptyMessage}
              </Typography>
            }
          />
        </MuiListItem>
      </MuiList>
    );
  }

  return (
    <MuiList dense={dense} disablePadding={disablePadding} sx={sx}>
      {subheader && <ListSubheader>{subheader}</ListSubheader>}
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <MuiListItem
            disablePadding
            secondaryAction={
              item.action && (
                <ListItemSecondaryAction>
                  {item.action}
                </ListItemSecondaryAction>
              )
            }
          >
            <ListItemButton
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              selected={selectable ? selectedItems.includes(item.id) : item.selected}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: designTokens.colors.primary[50],
                  '&:hover': {
                    backgroundColor: designTokens.colors.primary[100],
                  },
                },
                '&:hover': {
                  backgroundColor: designTokens.colors.neutral[50],
                },
              }}
            >
              {selectable && (
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => handleItemCheck(item, e.target.checked)}
                    disabled={item.disabled}
                    size="small"
                  />
                </ListItemIcon>
              )}
              
              {item.checkbox && !selectable && (
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Checkbox
                    checked={item.checked || false}
                    onChange={(e) => handleItemCheck(item, e.target.checked)}
                    disabled={item.disabled}
                    size="small"
                  />
                </ListItemIcon>
              )}
              
              {item.icon && !item.avatar && (
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
              )}
              
              {item.avatar && (
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar
                    src={item.avatar}
                    sx={{ width: 32, height: 32 }}
                  />
                </ListItemIcon>
              )}
              
              <ListItemText
                primary={item.primary}
                secondary={item.secondary}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: item.selected ? 600 : 400,
                    color: item.disabled ? 'text.disabled' : 'text.primary',
                  },
                  '& .MuiListItemText-secondary': {
                    color: item.disabled ? 'text.disabled' : 'text.secondary',
                  },
                }}
              />
              
              {item.chip && (
                <Chip
                  label={item.chip.label}
                  color={item.chip.color || 'default'}
                  size={item.chip.size || 'small'}
                  sx={{ ml: 1 }}
                />
              )}
            </ListItemButton>
          </MuiListItem>
          {item.divider && index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </MuiList>
  );
};

// Specialized List Components
export const SimpleList: React.FC<Omit<ListProps, 'selectable' | 'multiSelect' | 'selectedItems' | 'onSelectionChange'>> = (props) => (
  <List {...props} />
);

export const SelectableList: React.FC<ListProps> = (props) => (
  <List {...props} selectable />
);

export const MultiSelectList: React.FC<ListProps> = (props) => (
  <List {...props} selectable multiSelect />
);

export const CheckboxList: React.FC<Omit<ListProps, 'checkbox'>> = (props) => (
  <List {...props} checkbox />
);

// Export individual components
export { MuiList, MuiListItem, ListItemButton, ListItemIcon, ListItemText, ListItemSecondaryAction, ListSubheader };
