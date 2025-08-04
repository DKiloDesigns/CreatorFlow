'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useTheme } from 'next-themes';
import { createAppTheme } from '@/lib/mui-theme';
import { useEffect, useState } from 'react';

interface MuiThemeProviderProps {
  children: React.ReactNode;
}

export function MuiThemeProvider({ children }: MuiThemeProviderProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  // Determine the current theme mode
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const themeMode = currentTheme === 'dark' ? 'dark' : 'light';

  const muiTheme = createAppTheme(themeMode);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
} 