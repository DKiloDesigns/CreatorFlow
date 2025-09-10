'use client';

import React from 'react';
import {
  Tooltip as MuiTooltip,
  Box,
  Typography,
  IconButton,
  Fade,
  Popper,
  ClickAwayListener,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { designTokens } from '@/lib/design-system';

export interface TooltipProps {
  title: React.ReactNode;
  children: React.ReactElement;
  placement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top';
  arrow?: boolean;
  open?: boolean;
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?: (event: React.SyntheticEvent) => void;
  disableHoverListener?: boolean;
  disableFocusListener?: boolean;
  disableTouchListener?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  enterTouchDelay?: number;
  leaveTouchDelay?: number;
  interactive?: boolean;
  followCursor?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  size?: 'small' | 'medium' | 'large';
  sx?: any;
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  placement = 'top',
  arrow = true,
  open,
  onOpen,
  onClose,
  disableHoverListener = false,
  disableFocusListener = false,
  disableTouchListener = false,
  enterDelay = 500,
  leaveDelay = 0,
  enterTouchDelay = 700,
  leaveTouchDelay = 1500,
  interactive = false,
  followCursor = false,
  color = 'default',
  size = 'medium',
  sx,
}) => {
  const getColorValue = (color: string) => {
    switch (color) {
      case 'primary': return designTokens.colors.primary[600];
      case 'secondary': return designTokens.colors.secondary[600];
      case 'error': return designTokens.colors.error[600];
      case 'warning': return designTokens.colors.warning[600];
      case 'info': return designTokens.colors.info[600];
      case 'success': return designTokens.colors.success[600];
      default: return designTokens.colors.neutral[800];
    }
  };

  const getSizeValue = (size: string) => {
    switch (size) {
      case 'small': return 12;
      case 'medium': return 14;
      case 'large': return 16;
      default: return 14;
    }
  };

  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      disableHoverListener={disableHoverListener}
      disableFocusListener={disableFocusListener}
      disableTouchListener={disableTouchListener}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      enterTouchDelay={enterTouchDelay}
      leaveTouchDelay={leaveTouchDelay}
      interactive={interactive}
      followCursor={followCursor}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 200 }}
      PopperComponent={interactive ? Popper : undefined}
      PopperProps={interactive ? {
        modifiers: [
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              boundary: 'viewport',
            },
          },
        ],
      } : undefined}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: getColorValue(color),
            color: 'white',
            fontSize: getSizeValue(size),
            fontWeight: 500,
            maxWidth: 300,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '& .MuiTooltip-arrow': {
              color: getColorValue(color),
            },
            ...sx,
          },
        },
      }}
    >
      {children}
    </MuiTooltip>
  );
};

// Specialized Tooltip Components
export const InfoTooltip: React.FC<Omit<TooltipProps, 'color'>> = (props) => (
  <Tooltip {...props} color="info" />
);

export const WarningTooltip: React.FC<Omit<TooltipProps, 'color'>> = (props) => (
  <Tooltip {...props} color="warning" />
);

export const ErrorTooltip: React.FC<Omit<TooltipProps, 'color'>> = (props) => (
  <Tooltip {...props} color="error" />
);

export const SuccessTooltip: React.FC<Omit<TooltipProps, 'color'>> = (props) => (
  <Tooltip {...props} color="success" />
);

export const QuickTooltip: React.FC<Omit<TooltipProps, 'enterDelay' | 'leaveDelay'>> = (props) => (
  <Tooltip {...props} enterDelay={0} leaveDelay={0} />
);

export const SlowTooltip: React.FC<Omit<TooltipProps, 'enterDelay' | 'leaveDelay'>> = (props) => (
  <Tooltip {...props} enterDelay={1000} leaveDelay={500} />
);

// Interactive Tooltip Component
export interface InteractiveTooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  placement?: TooltipProps['placement'];
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?: (event: React.SyntheticEvent) => void;
  sx?: any;
}

export const InteractiveTooltip: React.FC<InteractiveTooltipProps> = ({
  children,
  content,
  placement = 'bottom',
  onOpen,
  onClose,
  sx,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (event: React.SyntheticEvent) => {
    setOpen(true);
    onOpen?.(event);
  };

  const handleClose = (event: React.SyntheticEvent) => {
    setOpen(false);
    onClose?.(event);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box>
        <Tooltip
          title={content}
          placement={placement}
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          interactive
          disableHoverListener
          disableFocusListener
          disableTouchListener
          sx={sx}
        >
          {children}
        </Tooltip>
      </Box>
    </ClickAwayListener>
  );
};

// Tooltip with Actions
export interface ActionTooltipProps {
  children: React.ReactElement;
  title: string;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  }>;
  placement?: TooltipProps['placement'];
  sx?: any;
}

export const ActionTooltip: React.FC<ActionTooltipProps> = ({
  children,
  title,
  actions = [],
  placement = 'bottom',
  sx,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const tooltipContent = (
    <Paper sx={{ p: 1, minWidth: 200 }}>
      <Typography variant="body2" sx={{ mb: actions.length > 0 ? 1 : 0, fontWeight: 500 }}>
        {title}
      </Typography>
      {actions.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <List dense sx={{ py: 0 }}>
            {actions.map((action, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    action.onClick();
                    handleClose();
                  }}
                  sx={{ py: 0.5, px: 1 }}
                >
                  {action.icon && (
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {action.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={action.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.875rem',
                        color: action.color ? designTokens.colors[action.color][600] : 'text.primary',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Paper>
  );

  return (
    <Tooltip
      title={tooltipContent}
      placement={placement}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      interactive
      disableHoverListener
      disableFocusListener
      disableTouchListener
      sx={sx}
    >
      {children}
    </Tooltip>
  );
};

// Export individual components
export { MuiTooltip, Box, Typography, IconButton, Fade, Popper, ClickAwayListener, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Chip };
