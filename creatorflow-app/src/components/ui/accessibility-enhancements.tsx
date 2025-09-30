'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  VolumeUp,
  VolumeOff,
  Contrast,
  TextIncrease,
  TextDecrease,
  RestartAlt,
} from '@mui/icons-material';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: false,
};

export function AccessibilityEnhancements() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isVisible, setIsVisible] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applyAccessibilitySettings();
  }, [settings]);

  // Apply accessibility settings to the document
  const applyAccessibilitySettings = () => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--font-size-multiplier', getFontSizeMultiplier(settings.fontSize));
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Screen reader
    if (settings.screenReader) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
    
    // Keyboard navigation
    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  };

  const getFontSizeMultiplier = (size: string): string => {
    switch (size) {
      case 'small': return '0.875';
      case 'medium': return '1';
      case 'large': return '1.125';
      case 'xlarge': return '1.25';
      default: return '1';
    }
  };

  const announce = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 5000);
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    announce(`${key} ${value ? 'enabled' : 'disabled'}`);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    announce('Accessibility settings reset to default');
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    announce(isVisible ? 'Accessibility panel hidden' : 'Accessibility panel shown');
  };

  return (
    <>
      {/* Accessibility Panel Toggle - REMOVED */}

      {/* Accessibility Panel */}
      {isVisible && (
        <Box
          sx={{
            position: 'fixed',
            top: 80,
            right: 20,
            width: 300,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
            zIndex: 9998,
            boxShadow: 3,
          }}
          role="dialog"
          aria-labelledby="accessibility-panel-title"
        >
          <Typography id="accessibility-panel-title" variant="h6" gutterBottom>
            Accessibility Settings
          </Typography>

          {/* Font Size */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Font Size
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton
                size="small"
                onClick={() => updateSetting('fontSize', 'small')}
                color={settings.fontSize === 'small' ? 'primary' : 'default'}
              >
                <TextDecrease />
              </IconButton>
              <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center' }}>
                {settings.fontSize}
              </Typography>
              <IconButton
                size="small"
                onClick={() => updateSetting('fontSize', 'xlarge')}
                color={settings.fontSize === 'xlarge' ? 'primary' : 'default'}
              >
                <TextIncrease />
              </IconButton>
            </Box>
          </Box>

          {/* High Contrast */}
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant={settings.highContrast ? 'contained' : 'outlined'}
              startIcon={<Contrast />}
              onClick={() => updateSetting('highContrast', !settings.highContrast)}
            >
              High Contrast
            </Button>
          </Box>

          {/* Reduced Motion */}
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant={settings.reducedMotion ? 'contained' : 'outlined'}
              startIcon={<RestartAlt />}
              onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
            >
              Reduced Motion
            </Button>
          </Box>

          {/* Screen Reader Mode */}
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant={settings.screenReader ? 'contained' : 'outlined'}
              startIcon={<VolumeUp />}
              onClick={() => updateSetting('screenReader', !settings.screenReader)}
            >
              Screen Reader Mode
            </Button>
          </Box>

          {/* Keyboard Navigation */}
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant={settings.keyboardNavigation ? 'contained' : 'outlined'}
              startIcon={<KeyboardArrowUp />}
              onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
            >
              Keyboard Navigation
            </Button>
          </Box>

          {/* Reset Button */}
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={resetSettings}
            startIcon={<RestartAlt />}
          >
            Reset Settings
          </Button>
        </Box>
      )}

      {/* Screen Reader Announcements */}
      <Box
        ref={announcementRef}
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </Box>

      {/* Global Styles */}
      <style jsx global>{`
        :root {
          --font-size-multiplier: 1;
        }
        
        .high-contrast {
          filter: contrast(150%) brightness(120%);
        }
        
        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .screen-reader-mode {
          /* Enhanced focus indicators */
        }
        
        .keyboard-navigation *:focus {
          outline: 3px solid #0066cc !important;
          outline-offset: 2px !important;
        }
        
        /* Font size adjustments */
        html {
          font-size: calc(16px * var(--font-size-multiplier));
        }
        
        /* Skip to content link */
        .skip-to-content {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px;
          text-decoration: none;
          z-index: 10000;
        }
        
        .skip-to-content:focus {
          top: 6px;
        }
      `}</style>
    </>
  );
}

// Focus trap component
export function FocusTrap({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current || typeof window === 'undefined') return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return (
    <div ref={containerRef} tabIndex={-1}>
      {children}
    </div>
  );
}

// ARIA live region for announcements
export function AriaLiveRegion() {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleAnnouncement = (event: CustomEvent) => {
      setAnnouncements(prev => [...prev, event.detail.message]);
      setTimeout(() => {
        setAnnouncements(prev => prev.slice(1));
      }, 5000);
    };

    window.addEventListener('aria-announcement', handleAnnouncement as EventListener);
    return () => {
      window.removeEventListener('aria-announcement', handleAnnouncement as EventListener);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {announcements.map((announcement, index) => (
        <div key={index}>{announcement}</div>
      ))}
    </Box>
  );
}

// Utility function to announce messages
export function announce(message: string) {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent('aria-announcement', {
    detail: { message }
  });
  window.dispatchEvent(event);
}
