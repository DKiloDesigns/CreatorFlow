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
  Slide,
  Zoom,
  Grow,
  Chip,
  IconButton,
} from '@mui/material';
import { 
  Smartphone as SmartphoneIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ZoomIn as ZoomInIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon
} from '@mui/icons-material';

interface AnimationDemo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const ANIMATION_DEMOS: AnimationDemo[] = [
  {
    id: 'swipe',
    name: 'Swipe Animations',
    description: 'Smooth swipe transitions between content',
    icon: <ArrowBackIcon size={24} />,
    component: <SwipeAnimationDemo />
  },
  {
    id: 'pinch',
    name: 'Pinch & Zoom',
    description: 'Interactive zoom with pinch gestures',
    icon: <ZoomInIcon size={24} />,
    component: <PinchZoomDemo />
  },
  {
    id: 'fade',
    name: 'Fade Transitions',
    description: 'Elegant fade in/out animations',
    icon: <PlayArrowIcon size={24} />,
    component: <FadeTransitionDemo />
  },
  {
    id: 'slide',
    name: 'Slide Effects',
    description: 'Smooth sliding animations',
    icon: <SkipNextIcon size={24} />,
    component: <SlideAnimationDemo />
  }
];

function SwipeAnimationDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const items = [
    { id: 1, title: 'Feature 1', color: '#3B82F6' },
    { id: 2, title: 'Feature 2', color: '#8B5CF6' },
    { id: 3, title: 'Feature 3', color: '#10B981' },
    { id: 4, title: 'Feature 4', color: '#F59E0B' }
  ];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    setTimeout(() => {
      if (direction === 'left') {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      }
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.3s ease-in-out',
          height: '100%'
        }}
      >
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              minWidth: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: item.color,
              color: 'white',
              borderRadius: 2,
              position: 'relative'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {item.title}
            </Typography>
            
            {/* Swipe indicators */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1
              }}
            >
              {items.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Swipe Controls */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          px: 2,
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}
      >
        <IconButton
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
          sx={{
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            pointerEvents: 'auto',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
          }}
        >
          <ArrowForwardIcon size={20} />
        </IconButton>
        <IconButton
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
          sx={{
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            pointerEvents: 'auto',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
          }}
        >
          <ArrowBackIcon size={20} />
        </IconButton>
      </Box>

      {/* Swipe Direction Indicator */}
      {swipeDirection && (
        <Fade in={!!swipeDirection}>
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1,
              fontSize: '0.875rem'
            }}
          >
            Swiping {swipeDirection}...
          </Box>
        </Fade>
      )}
    </Box>
  );
}

function PinchZoomDemo() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePinch = (scale: number) => {
    setIsZooming(true);
    setZoomLevel(Math.max(0.5, Math.min(3, scale)));
    setTimeout(() => setIsZooming(false), 200);
  };

  // Simulate pinch gesture with buttons
  const zoomIn = () => handlePinch(zoomLevel * 1.2);
  const zoomOut = () => handlePinch(zoomLevel / 1.2);
  const resetZoom = () => handlePinch(1);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        ref={containerRef}
        sx={{
          width: 200,
          height: 150,
          mx: 'auto',
          bgcolor: 'grey.100',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${zoomLevel})`,
          transition: isZooming ? 'none' : 'transform 0.3s ease',
          border: '2px solid',
          borderColor: 'primary.main',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Pinch to Zoom
          <br />
          <Typography variant="caption" color="text.secondary">
            {Math.round(zoomLevel * 100)}%
          </Typography>
        </Typography>
      </Box>

      {/* Zoom Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
        <IconButton onClick={zoomOut} size="small">
          <ZoomInIcon size={16} style={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <IconButton onClick={resetZoom} size="small">
          <RefreshIcon size={16} />
        </IconButton>
        <IconButton onClick={zoomIn} size="small">
          <ZoomInIcon size={16} />
        </IconButton>
      </Box>
    </Box>
  );
}

function FadeTransitionDemo() {
  const [currentItem, setCurrentItem] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const items = [
    { text: 'Welcome to floai.studio', color: '#3B82F6' },
    { text: 'Create Amazing Content', color: '#8B5CF6' },
    { text: 'Grow Your Audience', color: '#10B981' },
    { text: 'Monetize Your Passion', color: '#F59E0B' }
  ];

  const nextItem = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentItem((prev) => (prev + 1) % items.length);
      setIsVisible(true);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(nextItem, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ position: 'relative', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Fade in={isVisible} timeout={300}>
        <Box
          sx={{
            bgcolor: items[currentItem].color,
            color: 'white',
            px: 3,
            py: 2,
            borderRadius: 2,
            textAlign: 'center',
            minWidth: 200
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {items[currentItem].text}
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
}

function SlideAnimationDemo() {
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down'>('left');
  const [isVisible, setIsVisible] = useState(true);

  const changeDirection = (newDirection: typeof direction) => {
    setIsVisible(false);
    setTimeout(() => {
      setDirection(newDirection);
      setIsVisible(true);
    }, 300);
  };

  return (
    <Box sx={{ position: 'relative', height: 100 }}>
      <Slide direction={direction} in={isVisible} timeout={300}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            px: 3,
            py: 2,
            borderRadius: 2,
            textAlign: 'center',
            position: 'absolute',
            width: '100%'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Sliding {direction}!
          </Typography>
        </Box>
      </Slide>

      {/* Direction Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
        {(['left', 'right', 'up', 'down'] as const).map((dir) => (
          <Button
            key={dir}
            size="small"
            variant={direction === dir ? 'contained' : 'outlined'}
            onClick={() => changeDirection(dir)}
          >
            {dir}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default function MobileAnimations() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeDemo, setActiveDemo] = useState<string>('swipe');

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <SmartphoneIcon size={32} />
          Mobile Animations
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Smooth, responsive animations designed for mobile touch interactions
        </Typography>
      </Box>

      {/* Animation Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {ANIMATION_DEMOS.map((demo) => (
          <Chip
            key={demo.id}
            label={demo.name}
            icon={demo.icon}
            onClick={() => setActiveDemo(demo.id)}
            variant={activeDemo === demo.id ? 'filled' : 'outlined'}
            sx={{
              bgcolor: activeDemo === demo.id ? 'primary.main' : 'transparent',
              color: activeDemo === demo.id ? 'white' : 'primary.main',
              '&:hover': {
                bgcolor: activeDemo === demo.id ? 'primary.dark' : 'primary.50'
              }
            }}
          />
        ))}
      </Box>

      {/* Demo Area */}
      <Card sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            {ANIMATION_DEMOS.find(d => d.id === activeDemo)?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            {ANIMATION_DEMOS.find(d => d.id === activeDemo)?.description}
          </Typography>
          
          <Box sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {ANIMATION_DEMOS.find(d => d.id === activeDemo)?.component}
          </Box>
        </CardContent>
      </Card>

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
