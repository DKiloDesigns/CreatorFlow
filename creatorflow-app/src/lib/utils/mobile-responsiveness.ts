/**
 * Mobile Responsiveness Utilities
 * Tools and utilities for improving mobile responsiveness and touch interactions
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Touch gesture hook
export function useTouchGestures() {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [gesture, setGesture] = useState<string | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (isLeftSwipe) {
      setGesture('swipeLeft');
    } else if (isRightSwipe) {
      setGesture('swipeRight');
    } else if (isUpSwipe) {
      setGesture('swipeUp');
    } else if (isDownSwipe) {
      setGesture('swipeDown');
    } else {
      setGesture('tap');
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, minSwipeDistance]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    gesture,
    setGesture,
  };
}

// Device orientation hook
export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const handleOrientationChange = () => {
      const angle = window.orientation || 0;
      setAngle(angle);
      setOrientation(Math.abs(angle) === 90 ? 'landscape' : 'portrait');
    };

    // Initial check
    handleOrientationChange();

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return { orientation, angle };
}

// Viewport size hook
export function useViewportSize() {
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewportSize;
}

// Breakpoint hook
export function useBreakpoint() {
  const { width } = useViewportSize();

  const breakpoints = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  };

  const getBreakpoint = () => {
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const isBreakpoint = (bp: keyof typeof breakpoints) => {
    return width >= breakpoints[bp];
  };

  const isMobile = width < breakpoints.md;
  const isTablet = width >= breakpoints.sm && width < breakpoints.lg;
  const isDesktop = width >= breakpoints.lg;

  return {
    breakpoint: getBreakpoint(),
    isBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    width,
  };
}

// Touch device detection hook
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);
    };

    checkTouchDevice();
  }, []);

  return { isTouchDevice };
}

// Haptic feedback hook
export function useHapticFeedback() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const checkHapticSupport = () => {
      const hasHaptic = 'vibrate' in navigator;
      setIsSupported(hasHaptic);
    };

    checkHapticSupport();
  }, []);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (isSupported && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [isSupported]);

  const lightVibrate = useCallback(() => {
    vibrate(10);
  }, [vibrate]);

  const mediumVibrate = useCallback(() => {
    vibrate(50);
  }, [vibrate]);

  const heavyVibrate = useCallback(() => {
    vibrate(100);
  }, [vibrate]);

  return {
    isSupported,
    vibrate,
    lightVibrate,
    mediumVibrate,
    heavyVibrate,
  };
}

// Pull to refresh hook
export function usePullToRefresh(onRefresh: () => void) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  const threshold = 80;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isPulling && window.scrollY === 0) {
      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);
      setPullDistance(distance);
    }
  }, [isPulling]);

  const handleTouchEnd = useCallback(() => {
    if (isPulling) {
      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        onRefresh();
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 1000);
      } else {
        setPullDistance(0);
      }
      setIsPulling(false);
    }
  }, [isPulling, pullDistance, onRefresh]);

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    threshold,
  };
}

// Infinite scroll hook
export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  threshold: number = 100
) {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      await callback();
    } finally {
      setIsLoading(false);
    }
  }, [callback, isLoading, hasMore]);

  useEffect(() => {
    if (elementRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            loadMore();
          }
        },
        { rootMargin: `${threshold}px` }
      );

      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isLoading, threshold]);

  return {
    elementRef,
    isLoading,
  };
}

// Sticky header hook
export function useStickyHeader(threshold: number = 0) {
  const [isSticky, setIsSticky] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsSticky(currentScrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { isSticky, scrollY };
}

// Parallax scroll hook
export function useParallaxScroll(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.scrollY * speed;
      setOffset(currentOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { offset };
}

// Mobile menu hook
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openMenu = useCallback(() => {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const closeMenu = useCallback(() => {
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen, openMenu, closeMenu]);

  return {
    isOpen,
    isAnimating,
    openMenu,
    closeMenu,
    toggleMenu,
  };
}

// Bottom sheet hook
export function useBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);

  const openSheet = useCallback(() => {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const closeSheet = useCallback(() => {
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    setDragY(Math.max(0, deltaY));
  }, [startY]);

  const handleTouchEnd = useCallback(() => {
    if (dragY > 100) {
      closeSheet();
    }
    setDragY(0);
  }, [dragY, closeSheet]);

  return {
    isOpen,
    isAnimating,
    dragY,
    openSheet,
    closeSheet,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}

// Swipeable tabs hook
export function useSwipeableTabs(tabs: string[], initialTab: string = tabs[0]) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { onTouchStart, onTouchMove, onTouchEnd, gesture } = useTouchGestures();

  useEffect(() => {
    if (gesture === 'swipeLeft') {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setIsTransitioning(true);
        setActiveTab(tabs[currentIndex + 1]);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    } else if (gesture === 'swipeRight') {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        setIsTransitioning(true);
        setActiveTab(tabs[currentIndex - 1]);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    }
  }, [gesture, activeTab, tabs]);

  return {
    activeTab,
    setActiveTab,
    isTransitioning,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}

// Mobile keyboard hook
export function useMobileKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const initialHeight = window.screen.height;
      const heightDifference = initialHeight - currentHeight;

      if (heightDifference > 150) {
        setIsKeyboardOpen(true);
        setKeyboardHeight(heightDifference);
      } else {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isKeyboardOpen,
    keyboardHeight,
  };
}

// Mobile performance hook
export function useMobilePerformance() {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    const checkDevicePerformance = () => {
      // Check device memory
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory;
        setIsLowEndDevice(memory < 4);
      }

      // Check hardware concurrency
      const cores = navigator.hardwareConcurrency || 1;
      if (cores < 4) {
        setIsLowEndDevice(true);
      }

      // Check connection
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
          setIsLowEndDevice(true);
        }
      }
    };

    checkDevicePerformance();
  }, []);

  return {
    isLowEndDevice,
    memoryInfo,
  };
}

// Export all hooks
export {
  useTouchGestures,
  useDeviceOrientation,
  useViewportSize,
  useBreakpoint,
  useTouchDevice,
  useHapticFeedback,
  usePullToRefresh,
  useInfiniteScroll,
  useStickyHeader,
  useParallaxScroll,
  useMobileMenu,
  useBottomSheet,
  useSwipeableTabs,
  useMobileKeyboard,
  useMobilePerformance,
};
