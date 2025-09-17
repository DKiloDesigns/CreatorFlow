'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  Box,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Contrast as HighContrastIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { createTheme, Theme } from '@mui/material/styles';
import { designTokens } from '@/lib/design-system';

// Theme Context
interface ThemeContextType {
  mode: 'light' | 'dark' | 'high-contrast';
  toggleMode: () => void;
  setMode: (mode: 'light' | 'dark' | 'high-contrast') => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: 'light' | 'dark' | 'high-contrast';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
}) => {
  const [mode, setModeState] = useState<'light' | 'dark' | 'high-contrast'>(defaultMode);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Load theme preferences from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | 'high-contrast';
    const savedHighContrast = localStorage.getItem('high-contrast') === 'true';
    
    if (savedMode) {
      setModeState(savedMode);
    }
    setIsHighContrast(savedHighContrast);
  }, []);

  // Save theme preferences to localStorage
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('high-contrast', isHighContrast.toString());
  }, [isHighContrast]);

  const toggleMode = () => {
    setModeState(prev => {
      switch (prev) {
        case 'light': return 'dark';
        case 'dark': return 'high-contrast';
        case 'high-contrast': return 'light';
        default: return 'light';
      }
    });
  };

  const setMode = (newMode: 'light' | 'dark' | 'high-contrast') => {
    setModeState(newMode);
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  // Create theme based on mode
  const theme = React.useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode: mode === 'high-contrast' ? 'dark' : mode,
        primary: {
          main: designTokens.colors.primary[500],
          light: designTokens.colors.primary[300],
          dark: designTokens.colors.primary[700],
          contrastText: '#ffffff',
        },
        secondary: {
          main: designTokens.colors.secondary[500],
          light: designTokens.colors.secondary[300],
          dark: designTokens.colors.secondary[700],
          contrastText: '#ffffff',
        },
        error: {
          main: designTokens.colors.error[500],
          light: designTokens.colors.error[300],
          dark: designTokens.colors.error[700],
          contrastText: '#ffffff',
        },
        warning: {
          main: designTokens.colors.warning[500],
          light: designTokens.colors.warning[300],
          dark: designTokens.colors.warning[700],
          contrastText: '#ffffff',
        },
        info: {
          main: designTokens.colors.info[500],
          light: designTokens.colors.info[300],
          dark: designTokens.colors.info[700],
          contrastText: '#ffffff',
        },
        success: {
          main: designTokens.colors.success[500],
          light: designTokens.colors.success[300],
          dark: designTokens.colors.success[700],
          contrastText: '#ffffff',
        },
        background: {
          default: mode === 'dark' ? designTokens.colors.neutral[900] : designTokens.colors.neutral[50],
          paper: mode === 'dark' ? designTokens.colors.neutral[800] : '#ffffff',
        },
        text: {
          primary: mode === 'dark' ? designTokens.colors.neutral[100] : designTokens.colors.neutral[900],
          secondary: mode === 'dark' ? designTokens.colors.neutral[400] : designTokens.colors.neutral[600],
        },
      },
      typography: {
        fontFamily: designTokens.typography.fontFamily,
        h1: {
          fontSize: designTokens.typography.h1.fontSize,
          fontWeight: designTokens.typography.h1.fontWeight,
          lineHeight: designTokens.typography.h1.lineHeight,
        },
        h2: {
          fontSize: designTokens.typography.h2.fontSize,
          fontWeight: designTokens.typography.h2.fontWeight,
          lineHeight: designTokens.typography.h2.lineHeight,
        },
        h3: {
          fontSize: designTokens.typography.h3.fontSize,
          fontWeight: designTokens.typography.h3.fontWeight,
          lineHeight: designTokens.typography.h3.lineHeight,
        },
        h4: {
          fontSize: designTokens.typography.h4.fontSize,
          fontWeight: designTokens.typography.h4.fontWeight,
          lineHeight: designTokens.typography.h4.lineHeight,
        },
        h5: {
          fontSize: designTokens.typography.h5.fontSize,
          fontWeight: designTokens.typography.h5.fontWeight,
          lineHeight: designTokens.typography.h5.lineHeight,
        },
        h6: {
          fontSize: designTokens.typography.h6.fontSize,
          fontWeight: designTokens.typography.h6.fontWeight,
          lineHeight: designTokens.typography.h6.lineHeight,
        },
      },
      spacing: designTokens.spacing.base,
      shape: {
        borderRadius: designTokens.borderRadius.base,
      },
    });

    // Apply high contrast overrides
    if (isHighContrast) {
      return createTheme(baseTheme, {
        palette: {
          primary: {
            main: '#00ff00',
            contrastText: '#000000',
          },
          secondary: {
            main: '#ffff00',
            contrastText: '#000000',
          },
          background: {
            default: '#000000',
            paper: '#000000',
          },
          text: {
            primary: '#ffffff',
            secondary: '#ffffff',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                border: '2px solid #ffffff',
                fontWeight: 'bold',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                border: '2px solid #ffffff',
              },
            },
          },
        },
      });
    }

    return baseTheme;
  }, [mode, isHighContrast]);

  return (
    <ThemeContext.Provider value={{
      mode,
      toggleMode,
      setMode,
      isHighContrast,
      toggleHighContrast,
    }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Color Scheme Toggle Component
export const ColorSchemeToggle: React.FC<{
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  sx?: any;
}> = ({ showLabel = true, size = 'medium', sx }) => {
  const { mode, toggleMode } = useThemeMode();

  const getIcon = () => {
    switch (mode) {
      case 'light': return <LightModeIcon />;
      case 'dark': return <DarkModeIcon />;
      case 'high-contrast': return <HighContrastIcon />;
      default: return <LightModeIcon />;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'high-contrast': return 'High Contrast';
      default: return 'Light Mode';
    }
  };

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : mode === 'dark' ? 'high contrast' : 'light'} mode`}>
      <IconButton
        onClick={toggleMode}
        size={size}
        sx={{
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'action.hover',
          },
          ...sx,
        }}
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
};

// High Contrast Toggle Component
export const HighContrastToggle: React.FC<{
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  sx?: any;
}> = ({ showLabel = true, size = 'medium', sx }) => {
  const { isHighContrast, toggleHighContrast } = useThemeMode();

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isHighContrast}
          onChange={toggleHighContrast}
          color="primary"
          size={size}
        />
      }
      label={showLabel ? 'High Contrast' : ''}
      sx={sx}
    />
  );
};

// Theme Settings Panel Component
export const ThemeSettingsPanel: React.FC<{
  open: boolean;
  onClose: () => void;
  sx?: any;
}> = ({ open, onClose, sx }) => {
  const { mode, setMode, isHighContrast, toggleHighContrast } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!open) return null;

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        width: isMobile ? 'calc(100vw - 32px)' : 320,
        maxHeight: 'calc(100vh - 32px)',
        overflow: 'auto',
        zIndex: 9999,
        ...sx,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaletteIcon />
            Theme Settings
          </Typography>
          <IconButton onClick={onClose} size="small">
            <SettingsIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List dense>
          <ListItem>
            <ListItemIcon>
              <LightModeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Color Scheme"
              secondary="Choose your preferred color scheme"
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => setMode('light')}
                  sx={{
                    bgcolor: mode === 'light' ? 'primary.main' : 'transparent',
                    color: mode === 'light' ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <LightModeIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setMode('dark')}
                  sx={{
                    bgcolor: mode === 'dark' ? 'primary.main' : 'transparent',
                    color: mode === 'dark' ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <DarkModeIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setMode('high-contrast')}
                  sx={{
                    bgcolor: mode === 'high-contrast' ? 'primary.main' : 'transparent',
                    color: mode === 'high-contrast' ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <HighContrastIcon />
                </IconButton>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <HighContrastIcon />
            </ListItemIcon>
            <ListItemText
              primary="High Contrast"
              secondary="Enhanced visibility for accessibility"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={isHighContrast}
                onChange={toggleHighContrast}
                color="primary"
                size="small"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Changes are saved automatically
        </Typography>
      </Box>
    </Paper>
  );
};

// Export individual components
export {
  MuiThemeProvider,
  CssBaseline,
  Box,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
};
