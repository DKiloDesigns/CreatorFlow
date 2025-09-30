'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  SwipeableDrawer,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Tooltip,
  Fade,
  Zoom,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu,
  X,
  Hand,
  Swipe,
  Pinch,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Eye,
  EyeOff,
} from 'lucide-react';

interface MobileUXEnhancementsProps {
  children: React.ReactNode;
}

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  connectionType: 'slow' | 'fast' | 'offline';
  batteryLevel?: number;
  reducedMotion: boolean;
  highContrast: boolean;
}

export const MobileUXEnhancements: React.FC<MobileUXEnhancementsProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    orientation: 'landscape',
    touchSupport: false,
    connectionType: 'fast',
    reducedMotion: false,
    highContrast: false,
  });
  const [gestureMode, setGestureMode] = useState(false);
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);

  // Detect device capabilities
  useEffect(() => {
    const detectDevice = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
      
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      const connectionType = (navigator as any).connection?.effectiveType === 'slow-2g' || 
                           (navigator as any).connection?.effectiveType === '2g' ? 'slow' : 'fast';
      
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const highContrast = window.matchMedia('(prefers-contrast: high)').matches;

      setDeviceInfo({
        type: isTablet ? 'tablet' : isMobileDevice ? 'mobile' : 'desktop',
        orientation,
        touchSupport: isTouch,
        connectionType,
        batteryLevel: (navigator as any).getBattery?.() ? undefined : undefined,
        reducedMotion,
        highContrast,
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  // Gesture handling
  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (!gestureMode) return;
    
    // Implement swipe gestures for navigation
    switch (direction) {
      case 'left':
        // Navigate to next page
        break;
      case 'right':
        // Navigate to previous page
        break;
      case 'up':
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'down':
        // Scroll to bottom
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        break;
    }
  }, [gestureMode]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!gestureMode) return;
    // Implement touch gesture detection
  }, [gestureMode]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!gestureMode) return;
    // Implement touch gesture completion
  }, [gestureMode]);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        touchAction: gestureMode ? 'pan-x pan-y' : 'auto',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      
      {/* Mobile UX Controls - REMOVED: floating gesture/device buttons */}
      {/* UnifiedMobileControls will be rendered in this area by the parent layout. */}

      {/* Device Info Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={showDeviceInfo}
        onClose={() => setShowDeviceInfo(false)}
        onOpen={() => setShowDeviceInfo(true)}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '50vh',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Device Information</Typography>
            <IconButton onClick={() => setShowDeviceInfo(false)}>
              <X />
            </IconButton>
          </Box>
          
          <List>
            <ListItem>
              <ListItemIcon>
                {deviceInfo.type === 'mobile' ? <Smartphone /> : 
                 deviceInfo.type === 'tablet' ? <Tablet /> : <Monitor />}
              </ListItemIcon>
              <ListItemText 
                primary="Device Type" 
                secondary={deviceInfo.type.charAt(0).toUpperCase() + deviceInfo.type.slice(1)} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <RotateCcw />
              </ListItemIcon>
              <ListItemText 
                primary="Orientation" 
                secondary={deviceInfo.orientation.charAt(0).toUpperCase() + deviceInfo.orientation.slice(1)} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Hand />
              </ListItemIcon>
              <ListItemText 
                primary="Touch Support" 
                secondary={deviceInfo.touchSupport ? 'Yes' : 'No'} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                {deviceInfo.connectionType === 'offline' ? <WifiOff /> : <Wifi />}
              </ListItemIcon>
              <ListItemText 
                primary="Connection" 
                secondary={deviceInfo.connectionType.charAt(0).toUpperCase() + deviceInfo.connectionType.slice(1)} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                {deviceInfo.reducedMotion ? <EyeOff /> : <Eye />}
              </ListItemIcon>
              <ListItemText 
                primary="Reduced Motion" 
                secondary={deviceInfo.reducedMotion ? 'Enabled' : 'Disabled'} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                {deviceInfo.highContrast ? <Sun /> : <Moon />}
              </ListItemIcon>
              <ListItemText 
                primary="High Contrast" 
                secondary={deviceInfo.highContrast ? 'Enabled' : 'Disabled'} 
              />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>

      {/* Gesture Mode Indicator */}
      {gestureMode && (
        <Fade in={gestureMode}>
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              px: 2,
              py: 1,
              borderRadius: 2,
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Hand size={16} />
            <Typography variant="caption">Gesture Mode Active</Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
};
