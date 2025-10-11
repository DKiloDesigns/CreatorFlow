'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  SwipeableDrawer,
  IconButton,
  Chip,
} from '@mui/material';
import { 
  Smartphone as SmartphoneIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RotateCcwIcon,
  VolumeUp as Volume2Icon,
  VolumeOff as VolumeXIcon,
  Fullscreen as MaximizeIcon,
  FullscreenExit as MinimizeIcon,
  TouchApp as HandIcon,
  ArrowBack as ArrowLeftIcon,
  ArrowForward as ArrowRightIcon,
  ZoomIn as ZoomInIcon,
  Close as XIcon
} from '@mui/icons-material';

interface TouchGesture {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  demo: () => void;
}

const TOUCH_GESTURES: TouchGesture[] = [
  {
    id: 'tap',
    name: 'Tap to Interact',
    description: 'Tap any element to see it respond',
    icon: <HandIcon sx={{ fontSize: 24 }} />,
    demo: () => console.log('Tap gesture demo')
  },
  {
    id: 'swipe',
    name: 'Swipe Navigation',
    description: 'Swipe left/right to navigate between features',
    icon: <ArrowLeftIcon sx={{ fontSize: 24 }} />,
    demo: () => console.log('Swipe gesture demo')
  },
  {
    id: 'pinch',
    name: 'Pinch to Zoom',
    description: 'Pinch to zoom in/out on content',
    icon: <ZoomInIcon sx={{ fontSize: 24 }} />,
    demo: () => console.log('Pinch gesture demo')
  }
];

export default function InteractiveMobileDemo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string>('tap');
  const [showDemo, setShowDemo] = useState(false);
  const [touchCount, setTouchCount] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const demoRef = useRef<HTMLDivElement>(null);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchCount(prev => prev + 1);
    if (currentGesture === 'tap') {
      setShowDemo(true);
      setTimeout(() => setShowDemo(false), 1000);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => setSwipeDirection(''), 1000);
  };

  const handlePinch = (scale: number) => {
    setZoomLevel(Math.max(0.5, Math.min(2, scale)));
  };

  // Gesture detection
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        startDistance = distance;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && currentGesture === 'swipe') {
        const deltaX = e.touches[0].clientX - startX;
        if (Math.abs(deltaX) > 50) {
          handleSwipe(deltaX > 0 ? 'right' : 'left');
        }
      } else if (e.touches.length === 2 && currentGesture === 'pinch') {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = distance / startDistance;
        handlePinch(scale);
      }
    };

    const demoElement = demoRef.current;
    if (demoElement) {
      demoElement.addEventListener('touchstart', handleTouchStart);
      demoElement.addEventListener('touchmove', handleTouchMove);
      
      return () => {
        demoElement.removeEventListener('touchstart', handleTouchStart);
        demoElement.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [currentGesture]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <SmartphoneIcon sx={{ fontSize: 32 }} />
          Interactive Mobile Demo
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Experience CreatorFlow with real mobile gestures and interactions
        </Typography>
      </Box>

      {/* Gesture Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {TOUCH_GESTURES.map((gesture) => (
          <Chip
            key={gesture.id}
            label={gesture.name}
            icon={gesture.icon}
            onClick={() => setCurrentGesture(gesture.id)}
            variant={currentGesture === gesture.id ? 'filled' : 'outlined'}
            sx={{
              bgcolor: currentGesture === gesture.id ? 'primary.main' : 'transparent',
              color: currentGesture === gesture.id ? 'white' : 'primary.main',
              '&:hover': {
                bgcolor: currentGesture === gesture.id ? 'primary.dark' : 'primary.50'
              }
            }}
          />
        ))}
      </Box>

      {/* Interactive Demo Area */}
      <Card
        ref={demoRef}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transform: `scale(${zoomLevel})`,
          transition: 'transform 0.3s ease',
          border: '2px solid',
          borderColor: showDemo ? 'success.main' : 'primary.main',
          boxShadow: showDemo ? '0 0 20px rgba(76, 175, 80, 0.3)' : '0 4px 20px rgba(0,0,0,0.1)'
        }}
        onTouchStart={handleTouchStart}
      >
        <CardContent sx={{ p: 3, textAlign: 'center', minHeight: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {TOUCH_GESTURES.find(g => g.id === currentGesture)?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {TOUCH_GESTURES.find(g => g.id === currentGesture)?.description}
          </Typography>
          
          {/* Demo Content */}
          <Box sx={{ position: 'relative' }}>
            <Fade in={showDemo}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'success.main',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                Tapped! 🎉
              </Box>
            </Fade>

            {swipeDirection && (
              <Fade in={!!swipeDirection}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'info.main',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  Swiped {swipeDirection}! 👆
                </Box>
              </Fade>
            )}

            {/* Mobile App Preview */}
            <Box
              sx={{
                width: 200,
                height: 150,
                bgcolor: 'grey.100',
                borderRadius: 2,
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: 'grey.300'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Mobile App Preview
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main">
                {touchCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Touches
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main">
                {Math.round(zoomLevel * 100)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Zoom
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Try These Gestures:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HandIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2">Tap to interact</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArrowLeftIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2">Swipe to navigate</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ZoomInIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2">Pinch to zoom</Typography>
          </Box>
        </Box>
      </Box>

      {/* CTA */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
            color: 'white',
            fontWeight: 600,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            '&:hover': {
              background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Experience Full Mobile App
        </Button>
      </Box>
    </Container>
  );
}
