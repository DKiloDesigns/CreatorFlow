'use client';

import React from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  Monitor,
  Palette,
  Check,
} from '@mui/icons-material';
import { useMinimalTheme } from '@/contexts/MinimalThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'menu';
  size?: 'small' | 'medium' | 'large';
}

export function ThemeToggle({ variant = 'icon', size = 'medium' }: ThemeToggleProps) {
  const { isDark, toggleMode } = useMinimalTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const mode = isDark ? 'dark' : 'light';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
    if (newMode === 'dark') {
      if (!isDark) toggleMode();
    } else if (newMode === 'light') {
      if (isDark) toggleMode();
    }
    // Note: 'system' mode not supported in minimal theme
    handleClose();
  };

  const getIcon = () => {
    return isDark ? <LightMode /> : <DarkMode />;
  };

  const getTooltipText = () => {
    return isDark ? 'Switch to light mode' : 'Switch to dark mode';
  };

  if (variant === 'button') {
    return (
      <Box
        component="button"
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1.5,
          borderRadius: 2,
          border: 'none',
          bgcolor: 'background.paper',
          color: 'text.primary',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'action.hover',
            transform: 'translateY(-1px)',
          },
        }}
      >
        {getIcon()}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {mode === 'system' ? 'System' : isDark ? 'Dark' : 'Light'}
        </Typography>
      </Box>
    );
  }

  if (variant === 'menu') {
    return (
      <>
        <Tooltip title={getTooltipText()}>
          <IconButton
            onClick={handleClick}
            size={size}
            sx={{
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: 'action.hover',
              },
            }}
          >
            {getIcon()}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Theme
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => handleModeChange('light')} selected={mode === 'light'}>
            <ListItemIcon>
              <LightMode fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Light" />
            {mode === 'light' && <Check fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => handleModeChange('dark')} selected={mode === 'dark'}>
            <ListItemIcon>
              <DarkMode fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dark" />
            {mode === 'dark' && <Check fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => handleModeChange('system')} selected={mode === 'system'}>
            <ListItemIcon>
              <Monitor fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="System" />
            {mode === 'system' && <Check fontSize="small" />}
          </MenuItem>
        </Menu>
      </>
    );
  }

  // Default icon variant
  return (
    <Tooltip title={getTooltipText()}>
      <IconButton
        onClick={() => {
          console.log('ThemeToggle clicked! Current isDark:', isDark);
          toggleMode();
        }}
        size={size}
        sx={{
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            bgcolor: 'action.hover',
          },
        }}
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}

// Advanced theme customizer component
export function ThemeCustomizer() {
  const { isDark } = useMinimalTheme();

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Palette fontSize="small" />
        Theme Customizer
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ThemeToggle variant="button" />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Current Mode: {isDark ? 'Dark' : 'Light'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Customize your CreatorFlow experience with our advanced theming system.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
