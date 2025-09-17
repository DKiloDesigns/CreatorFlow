/**
 * Animations and Transitions Utilities
 * Tools and utilities for smooth animations and transitions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';

// Animation presets
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  scaleOut: {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  slideInUp: {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  slideInDown: {
    initial: { opacity: 0, y: '-100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '-100%' },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  slideInLeft: {
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  slideInRight: {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100%' },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: { duration: 0.5, type: 'spring', bounce: 0.4 },
  },
  bounceOut: {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
    transition: { duration: 0.5, type: 'spring', bounce: 0.4 },
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 180 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  flipIn: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 90 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  zoomOut: {
    initial: { opacity: 0, scale: 1.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.5 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Stagger animation hook
export function useStaggerAnimation(delay: number = 0.1) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return {
    isVisible,
    containerVariants,
    itemVariants,
  };
}

// Scroll-triggered animation hook
export function useScrollAnimation(threshold: number = 0.1) {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
}

// Page transition hook
export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const startTransition = useCallback((dir: 'forward' | 'backward' = 'forward') => {
    setDirection(dir);
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0,
      x: direction === 'forward' ? '100%' : '-100%',
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: direction === 'forward' ? '-100%' : '100%',
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
  };

  return {
    isTransitioning,
    direction,
    startTransition,
    endTransition,
    pageVariants,
    pageTransition,
  };
}

// Loading animation hook
export function useLoadingAnimation() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  const updateProgress = useCallback((value: number) => {
    setProgress(Math.min(100, Math.max(0, value)));
  }, []);

  const endLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 500);
  }, []);

  const loadingVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return {
    isLoading,
    progress,
    startLoading,
    updateProgress,
    endLoading,
    loadingVariants,
  };
}

// Hover animation hook
export function useHoverAnimation() {
  const [isHovered, setIsHovered] = useState(false);

  const hoverVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.05, rotate: 2 },
    tap: { scale: 0.95 },
  };

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return {
    isHovered,
    hoverVariants,
    handleMouseEnter,
    handleMouseLeave,
  };
}

// Focus animation hook
export function useFocusAnimation() {
  const [isFocused, setIsFocused] = useState(false);

  const focusVariants = {
    rest: { scale: 1, boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' },
    focus: { scale: 1.02, boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.2)' },
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return {
    isFocused,
    focusVariants,
    handleFocus,
    handleBlur,
  };
}

// Gesture animation hook
export function useGestureAnimation() {
  const [gesture, setGesture] = useState<string | null>(null);

  const gestureVariants = {
    rest: { scale: 1, rotate: 0 },
    swipeLeft: { x: -20, rotate: -5 },
    swipeRight: { x: 20, rotate: 5 },
    swipeUp: { y: -20, rotate: -2 },
    swipeDown: { y: 20, rotate: 2 },
    tap: { scale: 0.95 },
  };

  const handleGesture = useCallback((gestureType: string) => {
    setGesture(gestureType);
    setTimeout(() => setGesture(null), 200);
  }, []);

  return {
    gesture,
    gestureVariants,
    handleGesture,
  };
}

// Parallax animation hook
export function useParallaxAnimation(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { offset };
}

// Morphing animation hook
export function useMorphingAnimation() {
  const [isMorphing, setIsMorphing] = useState(false);

  const morphVariants = {
    initial: { borderRadius: '50%', scale: 0.8 },
    morph: { borderRadius: '0%', scale: 1 },
    final: { borderRadius: '50%', scale: 0.8 },
  };

  const startMorph = useCallback(() => {
    setIsMorphing(true);
  }, []);

  const endMorph = useCallback(() => {
    setIsMorphing(false);
  }, []);

  return {
    isMorphing,
    morphVariants,
    startMorph,
    endMorph,
  };
}

// Particle animation hook
export function useParticleAnimation() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const animateParticles = useCallback(() => {
    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vx: particle.x <= 0 || particle.x >= window.innerWidth ? -particle.vx : particle.vx,
      vy: particle.y <= 0 || particle.y >= window.innerHeight ? -particle.vy : particle.vy,
    })));
  }, []);

  useEffect(() => {
    const interval = setInterval(animateParticles, 16);
    return () => clearInterval(interval);
  }, [animateParticles]);

  return { particles };
}

// Text animation hook
export function useTextAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
  }, []);

  const endAnimation = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return {
    isAnimating,
    textVariants,
    letterVariants,
    startAnimation,
    endAnimation,
  };
}

// Progress animation hook
export function useProgressAnimation() {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateProgress = useCallback((targetProgress: number, duration: number = 1000) => {
    setIsAnimating(true);
    const startProgress = progress;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      const currentProgress = startProgress + (targetProgress - startProgress) * easeOut;

      setProgress(currentProgress);

      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [progress]);

  return {
    progress,
    isAnimating,
    animateProgress,
  };
}

// Timeline animation hook
export function useTimelineAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  return {
    currentStep,
    isPlaying,
    play,
    pause,
    reset,
    nextStep,
    prevStep,
  };
}

// Export all hooks and presets
export {
  animationPresets,
  useStaggerAnimation,
  useScrollAnimation,
  usePageTransition,
  useLoadingAnimation,
  useHoverAnimation,
  useFocusAnimation,
  useGestureAnimation,
  useParallaxAnimation,
  useMorphingAnimation,
  useParticleAnimation,
  useTextAnimation,
  useProgressAnimation,
  useTimelineAnimation,
};
