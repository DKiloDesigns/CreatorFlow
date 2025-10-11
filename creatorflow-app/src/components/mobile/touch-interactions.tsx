'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TouchApp as HandIcon,
  Swipe as SwipeIcon,
  ZoomOutMap as PinchIcon,
  Refresh as RotateCcwIcon,
  Mouse as MousePointerIcon,
} from '@mui/icons-material';

interface TouchInteractionsProps {
  children: React.ReactNode;
  enableSwipeNavigation?: boolean;
  enablePinchZoom?: boolean;
  enablePullToRefresh?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchIn?: () => void;
  onPinchOut?: () => void;
  onPullToRefresh?: () => void;
}

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
  isDragging: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

export const TouchInteractions: React.FC<TouchInteractionsProps> = ({
  children,
  enableSwipeNavigation = true,
  enablePinchZoom = false,
  enablePullToRefresh = true,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinchIn,
  onPinchOut,
  onPullToRefresh,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startTime: 0,
    isDragging: false,
    direction: null,
    distance: 0,
    velocity: 0,
  });
  const [showTouchIndicator, setShowTouchIndicator] = useState(false);
  const [pullToRefreshActive, setPullToRefreshActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchTime = useRef(0);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    const now = Date.now();
    
    // Prevent double-tap zoom
    if (now - lastTouchTime.current < 300) {
      e.preventDefault();
    }
    lastTouchTime.current = now;

    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      startTime: now,
      isDragging: true,
      direction: null,
      distance: 0,
      velocity: 0,
    });

    setShowTouchIndicator(true);
  }, [isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !touchState.isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const now = Date.now();
    const velocity = distance / (now - touchState.startTime);

    // Determine direction
    let direction: 'left' | 'right' | 'up' | 'down' | null = null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    setTouchState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
      direction,
      distance,
      velocity,
    }));

    // Pull to refresh
    if (enablePullToRefresh && direction === 'down' && window.scrollY === 0 && distance > 50) {
      setPullToRefreshActive(true);
    }
  }, [isMobile, touchState.isDragging, touchState.startX, touchState.startY, enablePullToRefresh]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !touchState.isDragging) return;

    const { direction, distance, velocity } = touchState;
    const minSwipeDistance = 50;
    const minSwipeVelocity = 0.3;

    // Handle swipe gestures
    if (enableSwipeNavigation && distance > minSwipeDistance && velocity > minSwipeVelocity) {
      switch (direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
    }

    // Handle pull to refresh
    if (enablePullToRefresh && pullToRefreshActive && direction === 'down') {
      onPullToRefresh?.();
      setPullToRefreshActive(false);
    }

    setTouchState(prev => ({
      ...prev,
      isDragging: false,
      direction: null,
      distance: 0,
      velocity: 0,
    }));

    setShowTouchIndicator(false);
  }, [isMobile, touchState, enableSwipeNavigation, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, enablePullToRefresh, pullToRefreshActive, onPullToRefresh]);

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isMobile) return;

    switch (e.key) {
      case 'ArrowLeft':
        onSwipeRight?.();
        break;
      case 'ArrowRight':
        onSwipeLeft?.();
        break;
      case 'ArrowUp':
        onSwipeDown?.();
        break;
      case 'ArrowDown':
        onSwipeUp?.();
        break;
    }
  }, [isMobile, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        touchAction: enablePinchZoom ? 'pan-x pan-y pinch-zoom' : 'pan-x pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {children}

      {/* Touch Indicator */}
      {showTouchIndicator && (
        <Fade in={showTouchIndicator}>
          <Box
            sx={{
              position: 'fixed',
              top: touchState.currentY - 20,
              left: touchState.currentX - 20,
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
              pointerEvents: 'none',
              opacity: 0.7,
            }}
          >
            <HandIcon sx={{ fontSize: 20 }} />
          </Box>
        </Fade>
      )}

      {/* Pull to Refresh Indicator */}
      {pullToRefreshActive && (
        <Fade in={pullToRefreshActive}>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
            }}
          >
            <RotateCcwIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Pull to refresh
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Touch Controls - REMOVED floating Hand IconButton */}
    </Box>
  );
};
