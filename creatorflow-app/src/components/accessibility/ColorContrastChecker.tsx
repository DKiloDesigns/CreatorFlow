'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Box, Typography, Alert, AlertTitle } from '@mui/material';

interface ColorContrastContextType {
  contrastIssues: Array<{
    element: string;
    foreground: string;
    background: string;
    ratio: number;
    level: 'AA' | 'AAA' | 'FAIL';
    description: string;
  }>;
  checkContrast: () => void;
  clearIssues: () => void;
}

const ColorContrastContext = createContext<ColorContrastContextType | null>(null);

export const useColorContrast = () => {
  const context = useContext(ColorContrastContext);
  if (!context) {
    throw new Error('useColorContrast must be used within a ColorContrastProvider');
  }
  return context;
};

interface ColorContrastProviderProps {
  children: React.ReactNode;
}

export const ColorContrastProvider: React.FC<ColorContrastProviderProps> = ({ children }) => {
  const [contrastIssues, setContrastIssues] = useState<Array<{
    element: string;
    foreground: string;
    background: string;
    ratio: number;
    level: 'AA' | 'AAA' | 'FAIL';
    description: string;
  }>>([]);

  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Get relative luminance
  const getRelativeLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Calculate contrast ratio
  const getContrastRatio = (color1: string, color2: string): number => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;

    const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  // Get computed color values
  const getComputedColor = (element: HTMLElement, property: string): string => {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.getPropertyValue(property);
    
    // Convert RGB to hex if needed
    if (color.startsWith('rgb')) {
      const rgb = color.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      }
    }
    
    return color;
  };

  // Check contrast for an element
  const checkElementContrast = (element: HTMLElement): void => {
    const textColor = getComputedColor(element, 'color');
    const backgroundColor = getComputedColor(element, 'background-color');
    
    // Skip if colors are the same or transparent
    if (textColor === backgroundColor || backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
      return;
    }

    const ratio = getContrastRatio(textColor, backgroundColor);
    let level: 'AA' | 'AAA' | 'FAIL';
    
    if (ratio >= 7) {
      level = 'AAA';
    } else if (ratio >= 4.5) {
      level = 'AA';
    } else {
      level = 'FAIL';
    }

    // Only report issues
    if (level === 'FAIL') {
      const elementDescription = element.tagName.toLowerCase() + 
        (element.className ? `.${element.className.split(' ').join('.')}` : '') +
        (element.id ? `#${element.id}` : '');
      
      setContrastIssues(prev => [...prev, {
        element: elementDescription,
        foreground: textColor,
        background: backgroundColor,
        ratio: Math.round(ratio * 100) / 100,
        level,
        description: `Contrast ratio ${Math.round(ratio * 100) / 100}:1 (${level})`
      }]);
    }
  };

  // Check all text elements for contrast issues
  const checkContrast = () => {
    setContrastIssues([]);
    
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, input, textarea, label, th, td');
    
    textElements.forEach(element => {
      if (element instanceof HTMLElement) {
        checkElementContrast(element);
      }
    });
  };

  const clearIssues = () => {
    setContrastIssues([]);
  };

  return (
    <ColorContrastContext.Provider value={{ contrastIssues, checkContrast, clearIssues }}>
      {children}
    </ColorContrastContext.Provider>
  );
};

// Component to display contrast issues
export const ContrastIssuesDisplay: React.FC = () => {
  const { contrastIssues, checkContrast, clearIssues } = useColorContrast();

  if (contrastIssues.length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <AlertTitle>Color Contrast Check</AlertTitle>
        No contrast issues found! All text meets WCAG AA standards.
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="error">
          Color Contrast Issues ({contrastIssues.length})
        </Typography>
        <Box>
          <button onClick={checkContrast} style={{ marginRight: '8px' }}>
            Recheck
          </button>
          <button onClick={clearIssues}>
            Clear
          </button>
        </Box>
      </Box>
      
      {contrastIssues.map((issue, index) => (
        <Alert key={index} severity="error" sx={{ mb: 1 }}>
          <AlertTitle>{issue.element}</AlertTitle>
          <Typography variant="body2">
            {issue.description}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: issue.foreground,
                  border: '1px solid #ccc',
                }}
              />
              <Typography variant="caption">Text: {issue.foreground}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: issue.background,
                  border: '1px solid #ccc',
                }}
              />
              <Typography variant="caption">Background: {issue.background}</Typography>
            </Box>
          </Box>
        </Alert>
      ))}
    </Box>
  );
};

// Hook for checking specific color combinations
export const useContrastChecker = () => {
  const { getContrastRatio } = useColorContrast();

  const checkColorContrast = (foreground: string, background: string) => {
    const ratio = getContrastRatio(foreground, background);
    
    let level: 'AA' | 'AAA' | 'FAIL';
    if (ratio >= 7) {
      level = 'AAA';
    } else if (ratio >= 4.5) {
      level = 'AA';
    } else {
      level = 'FAIL';
    }

    return {
      ratio: Math.round(ratio * 100) / 100,
      level,
      passes: level !== 'FAIL',
      description: `Contrast ratio ${Math.round(ratio * 100) / 100}:1 (${level})`
    };
  };

  return { checkColorContrast };
};
