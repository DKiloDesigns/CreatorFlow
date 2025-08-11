'use client';

import React, { useState, useEffect } from 'react';
import { Switch } from '@mui/material';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Chip, Alert } from '@mui/material';
import { 
  Visibility, 
  Contrast, 
  Palette,
  CheckCircle,
  Warning
} from '@mui/icons-material';

interface HighContrastModeProps {
  onToggle?: (enabled: boolean) => void;
  onContrastLevelChange?: (level: 'standard' | 'high' | 'maximum') => void;
  onThemeAdjustment?: (adjustment: 'auto' | 'manual') => void;
}

interface ContrastLevel {
  name: string;
  ratio: number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const contrastLevels: ContrastLevel[] = [
  {
    name: 'Standard',
    ratio: 4.5,
    description: 'WCAG 2.1 AA compliant',
    icon: <CheckCircle fontSize="small" />,
    color: '#4caf50'
  },
  {
    name: 'High',
    ratio: 7.0,
    description: 'WCAG 2.1 AAA compliant',
    icon: <CheckCircle fontSize="small" />,
    color: '#2196f3'
  },
  {
    name: 'Maximum',
    ratio: 21.0,
    description: 'Maximum contrast for severe visual impairments',
    icon: <CheckCircle fontSize="small" />,
    color: '#ff9800'
  }
];

export default function HighContrastMode({
  onToggle,
  onContrastLevelChange,
  onThemeAdjustment
}: HighContrastModeProps) {
  const [enabled, setEnabled] = useState(false);
  const [contrastLevel, setContrastLevel] = useState<'standard' | 'high' | 'maximum'>('standard');
  const [themeAdjustment, setThemeAdjustment] = useState<'auto' | 'manual'>('auto');
  const [currentContrast, setCurrentContrast] = useState<number>(4.5);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedEnabled = localStorage.getItem('creatorflow-high-contrast-enabled');
    const savedLevel = localStorage.getItem('creatorflow-contrast-level');
    const savedAdjustment = localStorage.getItem('creatorflow-theme-adjustment');

    if (savedEnabled) setEnabled(JSON.parse(savedEnabled));
    if (savedLevel) setContrastLevel(savedLevel as any);
    if (savedAdjustment) setThemeAdjustment(savedAdjustment as any);

    // Apply high contrast mode if enabled
    if (savedEnabled === 'true') {
      applyHighContrastMode();
    }
  }, [applyHighContrastMode]);

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem('creatorflow-high-contrast-enabled', JSON.stringify(enabled));
    localStorage.setItem('creatorflow-contrast-level', contrastLevel);
    localStorage.setItem('creatorflow-theme-adjustment', themeAdjustment);

    // Apply or remove high contrast mode
    if (enabled) {
      applyHighContrastMode();
    } else {
      removeHighContrastMode();
    }

    onToggle?.(enabled);
  }, [enabled, contrastLevel, themeAdjustment, onToggle]);

  const applyHighContrastMode = () => {
    const root = document.documentElement;
    const body = document.body;

    // Add high contrast class
    body.classList.add('high-contrast-mode');
    
    // Set CSS custom properties for high contrast
    const contrastMultiplier = contrastLevel === 'high' ? 1.5 : contrastLevel === 'maximum' ? 2.0 : 1.0;
    
    root.style.setProperty('--hc-contrast-multiplier', contrastMultiplier.toString());
    root.style.setProperty('--hc-border-width', contrastLevel === 'maximum' ? '2px' : '1px');
    root.style.setProperty('--hc-focus-width', contrastLevel === 'maximum' ? '4px' : '2px');
    
    // Apply high contrast styles
    const style = document.createElement('style');
    style.id = 'high-contrast-styles';
    style.textContent = `
      .high-contrast-mode {
        --hc-text-primary: #000000 !important;
        --hc-text-secondary: #333333 !important;
        --hc-background: #ffffff !important;
        --hc-surface: #f0f0f0 !important;
        --hc-border: #000000 !important;
        --hc-focus: #0066cc !important;
        --hc-error: #cc0000 !important;
        --hc-success: #006600 !important;
        --hc-warning: #cc6600 !important;
        --hc-info: #0066cc !important;
      }
      
      .high-contrast-mode.dark {
        --hc-text-primary: #ffffff !important;
        --hc-text-secondary: #cccccc !important;
        --hc-background: #000000 !important;
        --hc-surface: #1a1a1a !important;
        --hc-border: #ffffff !important;
        --hc-focus: #66ccff !important;
        --hc-error: #ff6666 !important;
        --hc-success: #66ff66 !important;
        --hc-warning: #ffcc66 !important;
        --hc-info: #66ccff !important;
      }
      
      .high-contrast-mode * {
        border-color: var(--hc-border) !important;
        border-width: var(--hc-border-width) !important;
      }
      
      .high-contrast-mode button,
      .high-contrast-mode input,
      .high-contrast-mode textarea,
      .high-contrast-mode select,
      .high-contrast-mode a {
        border: var(--hc-border-width) solid var(--hc-border) !important;
        background-color: var(--hc-surface) !important;
        color: var(--hc-text-primary) !important;
      }
      
      .high-contrast-mode button:focus,
      .high-contrast-mode input:focus,
      .high-contrast-mode textarea:focus,
      .high-contrast-mode select:focus,
      .high-contrast-mode a:focus {
        outline: var(--hc-focus-width) solid var(--hc-focus) !important;
        outline-offset: 2px !important;
      }
      
      .high-contrast-mode .card,
      .high-contrast-mode .surface {
        background-color: var(--hc-surface) !important;
        border: var(--hc-border-width) solid var(--hc-border) !important;
      }
      
      .high-contrast-mode .text-primary {
        color: var(--hc-text-primary) !important;
      }
      
      .high-contrast-mode .text-secondary {
        color: var(--hc-text-secondary) !important;
      }
      
      .high-contrast-mode .bg-primary {
        background-color: var(--hc-surface) !important;
      }
      
      .high-contrast-mode .bg-secondary {
        background-color: var(--hc-background) !important;
      }
    `;
    
    document.head.appendChild(style);
  };

  const removeHighContrastMode = () => {
    const body = document.body;
    const root = document.documentElement;
    const style = document.getElementById('high-contrast-styles');
    
    body.classList.remove('high-contrast-mode');
    root.style.removeProperty('--hc-contrast-multiplier');
    root.style.removeProperty('--hc-border-width');
    root.style.removeProperty('--hc-focus-width');
    
    if (style) {
      style.remove();
    }
  };

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
  };

  const handleContrastLevelChange = (level: 'standard' | 'high' | 'maximum') => {
    setContrastLevel(level);
    onContrastLevelChange?.(level);
    
    // Update current contrast ratio
    const levelData = contrastLevels.find(l => l.name.toLowerCase() === level);
    if (levelData) {
      setCurrentContrast(levelData.ratio);
    }
  };

  const handleThemeAdjustmentChange = (adjustment: 'auto' | 'manual') => {
    setThemeAdjustment(adjustment);
    onThemeAdjustment?.(adjustment);
  };

  const _getCurrentContrastLevel = () => {
    return contrastLevels.find(l => l.name.toLowerCase() === contrastLevel);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Contrast color="primary" />
        High Contrast Mode
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Enhance visual accessibility with high contrast themes and customizable contrast levels.
      </Typography>

      {/* Main Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6">Enable High Contrast Mode</Typography>
          <Typography variant="body2" color="text.secondary">
            Switch to high contrast theme for better visibility
          </Typography>
        </Box>
        <Switch
          checked={enabled}
          onChange={(e) => handleToggle(e.target.checked)}
          color="primary"
          size="large"
        />
      </Box>

      {enabled && (
        <>
          {/* Contrast Level Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Contrast Level</Typography>
            <FormControl fullWidth>
              <InputLabel>Select Contrast Level</InputLabel>
              <Select
                value={contrastLevel}
                onChange={(e) => handleContrastLevelChange(e.target.value as any)}
                label="Select Contrast Level"
              >
                {contrastLevels.map((level) => (
                  <MenuItem key={level.name} value={level.name.toLowerCase()}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: level.color }}>
                        {level.icon}
                      </Box>
                      <Box>
                        <Typography variant="body1">{level.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {level.description} ({level.ratio}:1 ratio)
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Current Contrast Display */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Current Contrast Ratio</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`${currentContrast}:1`}
                color={currentContrast >= 7.0 ? 'success' : currentContrast >= 4.5 ? 'primary' : 'warning'}
                icon={currentContrast >= 4.5 ? <CheckCircle /> : <Warning />}
              />
              <Typography variant="body2" color="text.secondary">
                {currentContrast >= 7.0 ? 'WCAG 2.1 AAA Compliant' : 
                 currentContrast >= 4.5 ? 'WCAG 2.1 AA Compliant' : 
                 'Below WCAG Standards'}
              </Typography>
            </Box>
          </Box>

          {/* Theme Adjustment */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Theme Adjustment</Typography>
            <FormControl fullWidth>
              <InputLabel>Adjustment Mode</InputLabel>
              <Select
                value={themeAdjustment}
                onChange={(e) => handleThemeAdjustmentChange(e.target.value as any)}
                label="Adjustment Mode"
              >
                <MenuItem value="auto">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Palette fontSize="small" />
                    <Box>
                      <Typography variant="body1">Automatic</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Automatically adjust colors for optimal contrast
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="manual">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Visibility fontSize="small" />
                    <Box>
                      <Typography variant="body1">Manual</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Manual control over color adjustments
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Status Alert */}
          <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
            High Contrast Mode is now active with {contrastLevel} contrast level.
          </Alert>

          {/* Preview */}
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Preview</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderRadius: 1 }}>
                <Typography variant="body1">Sample Text</Typography>
                <Typography variant="body2" color="text.secondary">Secondary Text</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1 }}>
                <Typography variant="body1">Primary Button</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'secondary.contrastText', borderRadius: 1 }}>
                <Typography variant="body1">Secondary Button</Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* Information */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
        <Typography variant="body2" color="info.main">
          <strong>Note:</strong> High Contrast Mode automatically adjusts colors, borders, and focus indicators 
          to meet accessibility standards. Changes are applied immediately and saved to your preferences.
        </Typography>
      </Box>
    </Box>
  );
}
