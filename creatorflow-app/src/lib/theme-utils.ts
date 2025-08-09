import { accessibleColorPalette } from './accessible-color-palette';

/**
 * Theme Utilities for CreatorFlow
 * Provides easy access to accessible colors and theme helpers
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
}

export interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
  highContrast: ThemeColors;
}

/**
 * CSS Custom Properties for the accessible color system
 */
export const cssVariables = {
  light: {
    '--background': '#f8fafc',
    '--foreground': '#0f172a',
    '--card': '#ffffff',
    '--card-foreground': '#0f172a',
    '--primary': '#2563eb',
    '--primary-foreground': '#ffffff',
    '--secondary': '#7c3aed',
    '--secondary-foreground': '#ffffff',
    '--success': '#059669',
    '--success-foreground': '#ffffff',
    '--warning': '#d97706',
    '--warning-foreground': '#ffffff',
    '--error': '#dc2626',
    '--error-foreground': '#ffffff',
    '--info': '#2563eb',
    '--info-foreground': '#ffffff',
    '--border': '#e2e8f0',
    '--input': '#e2e8f0',
    '--ring': '#2563eb',
    '--muted': '#f1f5f9',
    '--muted-foreground': '#64748b',
    '--accent': '#f1f5f9',
    '--accent-foreground': '#475569',
  },
  dark: {
    '--background': '#0f172a',
    '--foreground': '#f8fafc',
    '--card': '#1e293b',
    '--card-foreground': '#f8fafc',
    '--primary': '#3b82f6',
    '--primary-foreground': '#ffffff',
    '--secondary': '#8b5cf6',
    '--secondary-foreground': '#ffffff',
    '--success': '#10b981',
    '--success-foreground': '#ffffff',
    '--warning': '#f59e0b',
    '--warning-foreground': '#ffffff',
    '--error': '#ef4444',
    '--error-foreground': '#ffffff',
    '--info': '#3b82f6',
    '--info-foreground': '#ffffff',
    '--border': 'rgba(255, 255, 255, 0.1)',
    '--input': 'rgba(255, 255, 255, 0.15)',
    '--ring': '#3b82f6',
    '--muted': '#334155',
    '--muted-foreground': '#94a3b8',
    '--accent': '#334155',
    '--accent-foreground': '#cbd5e1',
  },
  highContrast: {
    '--background': '#ffffff',
    '--foreground': '#000000',
    '--card': '#ffffff',
    '--card-foreground': '#000000',
    '--primary': '#000080',
    '--primary-foreground': '#ffffff',
    '--secondary': '#800080',
    '--secondary-foreground': '#ffffff',
    '--success': '#008000',
    '--success-foreground': '#ffffff',
    '--warning': '#808000',
    '--warning-foreground': '#000000',
    '--error': '#800000',
    '--error-foreground': '#ffffff',
    '--info': '#000080',
    '--info-foreground': '#ffffff',
    '--border': '#000000',
    '--input': '#000000',
    '--ring': '#000080',
    '--muted': '#c0c0c0',
    '--muted-foreground': '#000000',
    '--accent': '#c0c0c0',
    '--accent-foreground': '#000000',
  },
};

/**
 * Apply theme colors to the document root
 */
export function applyTheme(theme: 'light' | 'dark' | 'highContrast') {
  const root = document.documentElement;
  const colors = cssVariables[theme];
  
  Object.entries(colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Update body classes
  document.body.classList.remove('light', 'dark', 'high-contrast-mode');
  document.body.classList.add(theme === 'highContrast' ? 'high-contrast-mode' : theme);
  
  // Store theme preference
  localStorage.setItem('creatorflow-theme', theme);
}

/**
 * Get current theme from localStorage or system preference
 */
export function getCurrentTheme(): 'light' | 'dark' | 'highContrast' {
  const saved = localStorage.getItem('creatorflow-theme') as 'light' | 'dark' | 'highContrast';
  if (saved) return saved;
  
  if (typeof window !== 'undefined') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  
  return 'light';
}

/**
 * Initialize theme on app startup
 */
export function initializeTheme() {
  if (typeof window === 'undefined') return;
  
  const theme = getCurrentTheme();
  applyTheme(theme);
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    const currentTheme = getCurrentTheme();
    if (currentTheme === 'system') {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Get accessible color pair for a specific use case
 */
export function getAccessibleColorPair(
  category: 'primary' | 'secondary' | 'accent' | 'neutral' | 'semantic',
  theme: 'light' | 'dark' = 'light'
): { foreground: string; background: string; contrastRatio: number } {
  const colors = accessibleColorPalette[theme];
  const pair = colors.find(color => color.category === category);
  
  if (!pair) {
    // Fallback to primary colors
    return {
      foreground: theme === 'light' ? '#0f172a' : '#f8fafc',
      background: theme === 'light' ? '#ffffff' : '#1e293b',
      contrastRatio: 15.0, // High contrast fallback
    };
  }
  
  return {
    foreground: pair.foreground,
    background: pair.background,
    contrastRatio: pair.contrastRatio,
  };
}

/**
 * Generate CSS custom properties string for a theme
 */
export function generateThemeCSS(theme: 'light' | 'dark' | 'highContrast'): string {
  const colors = cssVariables[theme];
  return Object.entries(colors)
    .map(([property, value]) => `${property}: ${value};`)
    .join('\n  ');
}

/**
 * Get semantic color for a specific context
 */
export function getSemanticColor(
  context: 'success' | 'warning' | 'error' | 'info',
  theme: 'light' | 'dark' = 'light'
): { color: string; backgroundColor: string; textColor: string } {
  const colors = cssVariables[theme];
  
  switch (context) {
    case 'success':
      return {
        color: colors['--success'],
        backgroundColor: colors['--success'],
        textColor: colors['--success-foreground'],
      };
    case 'warning':
      return {
        color: colors['--warning'],
        backgroundColor: colors['--warning'],
        textColor: colors['--warning-foreground'],
      };
    case 'error':
      return {
        color: colors['--error'],
        backgroundColor: colors['--error'],
        textColor: colors['--error-foreground'],
      };
    case 'info':
      return {
        color: colors['--info'],
        backgroundColor: colors['--info'],
        textColor: colors['--info-foreground'],
      };
    default:
      return {
        color: colors['--primary'],
        backgroundColor: colors['--primary'],
        textColor: colors['--primary-foreground'],
      };
  }
}

/**
 * Get chart colors for data visualization
 */
export function getChartColors(theme: 'light' | 'dark' = 'light'): string[] {
  if (theme === 'light') {
    return [
      '#3b82f6', // Blue
      '#06b6d4', // Cyan
      '#8b5cf6', // Violet
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#10b981', // Emerald
      '#f97316', // Orange
      '#ec4899', // Pink
    ];
  } else {
    return [
      '#60a5fa', // Blue
      '#22d3ee', // Cyan
      '#a78bfa', // Violet
      '#fbbf24', // Amber
      '#f87171', // Red
      '#34d399', // Emerald
      '#fb923c', // Orange
      '#f472b6', // Pink
    ];
  }
}

/**
 * Get neutral color scale for backgrounds and text
 */
export function getNeutralColors(theme: 'light' | 'dark' = 'light'): Record<string, string> {
  if (theme === 'light') {
    return {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    };
  } else {
    return {
      50: '#0f172a',
      100: '#1e293b',
      200: '#334155',
      300: '#475569',
      400: '#64748b',
      500: '#94a3b8',
      600: '#cbd5e1',
      700: '#e2e8f0',
      800: '#f1f5f9',
      900: '#f8fafc',
    };
  }
}

/**
 * Check if current theme meets WCAG contrast requirements
 */
export function validateThemeContrast(theme: 'light' | 'dark'): {
  passes: boolean;
  violations: string[];
  score: number;
} {
  const colors = cssVariables[theme];
  const violations: string[] = [];
  let totalChecks = 0;
  let passingChecks = 0;
  
  // Check primary text on background
  totalChecks++;
  if (theme === 'light') {
    // Light theme: dark text on light background
    const ratio = getContrastRatio(colors['--foreground'], colors['--background']);
    if (ratio >= 4.5) {
      passingChecks++;
    } else {
      violations.push(`Primary text contrast: ${ratio.toFixed(2)}:1 (required: 4.5:1)`);
    }
  } else {
    // Dark theme: light text on dark background
    const ratio = getContrastRatio(colors['--foreground'], colors['--background']);
    if (ratio >= 4.5) {
      passingChecks++;
    } else {
      violations.push(`Primary text contrast: ${ratio.toFixed(2)}:1 (required: 4.5:1)`);
    }
  }
  
  // Check card text on card background
  totalChecks++;
  const cardRatio = getContrastRatio(colors['--card-foreground'], colors['--card']);
  if (cardRatio >= 4.5) {
    passingChecks++;
  } else {
    violations.push(`Card text contrast: ${cardRatio.toFixed(2)}:1 (required: 4.5:1)`);
  }
  
  // Check primary button text on primary background
  totalChecks++;
  const primaryRatio = getContrastRatio(colors['--primary-foreground'], colors['--primary']);
  if (primaryRatio >= 4.5) {
    passingChecks++;
  } else {
    violations.push(`Primary button contrast: ${primaryRatio.toFixed(2)}:1 (required: 4.5:1)`);
  }
  
  const score = (passingChecks / totalChecks) * 100;
  
  return {
    passes: violations.length === 0,
    violations,
    score: Math.round(score),
  };
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Theme toggle utility
 */
export function toggleTheme(): 'light' | 'dark' | 'highContrast' {
  const current = getCurrentTheme();
  let next: 'light' | 'dark' | 'highContrast';
  
  switch (current) {
    case 'light':
      next = 'dark';
      break;
    case 'dark':
      next = 'highContrast';
      break;
    case 'highContrast':
      next = 'light';
      break;
    default:
      next = 'light';
  }
  
  applyTheme(next);
  return next;
}

/**
 * Get theme metadata for display
 */
export function getThemeMetadata(theme: 'light' | 'dark' | 'highContrast') {
  const metadata = {
    light: {
      name: 'Light Theme',
      description: 'Clean, bright interface with excellent readability',
      icon: '☀️',
      wcagCompliance: 'AA',
    },
    dark: {
      name: 'Dark Theme',
      description: 'Easy on the eyes with reduced blue light emission',
      icon: '🌙',
      wcagCompliance: 'AA',
    },
    highContrast: {
      name: 'High Contrast',
      description: 'Maximum contrast for accessibility compliance',
      icon: '🎯',
      wcagCompliance: 'AAA',
    },
  };
  
  return metadata[theme];
}

/**
 * Export theme configuration for external use
 */
export function exportThemeConfig(): string {
  return JSON.stringify({
    cssVariables,
    accessibleColorPalette,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }, null, 2);
}
