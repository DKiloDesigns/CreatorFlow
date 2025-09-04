'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom color palette for CreatorFlow
const lightPalette = {
  primary: {
    main: '#6366f1', // Indigo
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ec4899', // Pink
    light: '#f472b6',
    dark: '#db2777',
    contrastText: '#ffffff',
  },
  success: {
    main: '#10b981', // Emerald
    light: '#34d399',
    dark: '#059669',
  },
  warning: {
    main: '#f59e0b', // Amber
    light: '#fbbf24',
    dark: '#d97706',
  },
  error: {
    main: '#ef4444', // Red
    light: '#f87171',
    dark: '#dc2626',
  },
  background: {
    default: '#ffffff',
    paper: '#f8fafc',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
};

const darkPalette = {
  primary: {
    main: '#818cf8', // Lighter indigo for dark mode
    light: '#a5b4fc',
    dark: '#6366f1',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#f472b6', // Lighter pink for dark mode
    light: '#f9a8d4',
    dark: '#ec4899',
    contrastText: '#ffffff',
  },
  success: {
    main: '#34d399', // Lighter emerald for dark mode
    light: '#6ee7b7',
    dark: '#10b981',
  },
  warning: {
    main: '#fbbf24', // Lighter amber for dark mode
    light: '#fcd34d',
    dark: '#f59e0b',
  },
  error: {
    main: '#f87171', // Lighter red for dark mode
    light: '#fca5a5',
    dark: '#ef4444',
  },
  background: {
    default: '#0f172a', // Slate 900
    paper: '#1e293b', // Slate 800
  },
  text: {
    primary: '#f1f5f9', // Slate 100
    secondary: '#cbd5e1', // Slate 300
  },
};

const createCustomTheme = (mode: 'light' | 'dark') => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;
  
  return createTheme({
    palette: {
      mode,
      ...palette,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.4,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: (mode === 'dark' 
      ? [
          'none',
          '0px 2px 4px rgba(0, 0, 0, 0.3)',
          '0px 4px 8px rgba(0, 0, 0, 0.3)',
          '0px 8px 16px rgba(0, 0, 0, 0.3)',
          '0px 16px 32px rgba(0, 0, 0, 0.3)',
          '0px 32px 64px rgba(0, 0, 0, 0.3)',
          ...Array(19).fill('0px 32px 64px rgba(0, 0, 0, 0.3)'),
        ]
      : undefined) as any,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: mode === 'dark' 
                ? '0 4px 12px rgba(129, 140, 248, 0.3)'
                : '0 4px 12px rgba(99, 102, 241, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'dark'
                ? '0 8px 25px rgba(0, 0, 0, 0.4)'
                : '0 8px 25px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.2s ease',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? '#818cf8' : '#6366f1',
                },
              },
            },
          },
        },
      },
    },
  });
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);

  // Get system preference
  const getSystemPreference = (): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  // Load saved theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem('creatorflow-theme') as ThemeMode;
    if (savedMode) {
      setModeState(savedMode);
    }
  }, []);

  // Update dark mode based on current mode
  useEffect(() => {
    const updateDarkMode = () => {
      if (mode === 'system') {
        setIsDark(getSystemPreference());
      } else {
        setIsDark(mode === 'dark');
      }
    };

    updateDarkMode();

    // Listen for system theme changes
    if (mode === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateDarkMode();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('creatorflow-theme', newMode);
  };

  const toggleMode = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
  };

  const theme = createCustomTheme(isDark ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode, isDark }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
