/**
 * Performance Optimization Utilities
 * Tools and utilities for optimizing performance and user experience
 */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { debounce, throttle } from 'lodash';

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
}

// Memoized callback hook
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

// Memoized value hook
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

// Intersection Observer hook
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

// Virtual scrolling hook
export function useVirtualScrolling({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length - 1
    );

    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index,
    }));
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  };
}

// Lazy loading hook
export function useLazyLoading<T>(
  loadFunction: () => Promise<T[]>,
  initialData: T[] = [],
  pageSize: number = 20
) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newData = await loadFunction();
      setData(prev => [...prev, ...newData]);
      setPage(prev => prev + 1);
      setHasMore(newData.length === pageSize);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadFunction, loading, hasMore, pageSize]);

  return {
    data,
    loading,
    hasMore,
    loadMore,
    reset: () => {
      setData(initialData);
      setPage(0);
      setHasMore(true);
    },
  };
}

// Image lazy loading hook
export function useImageLazyLoading(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setIsError(true);
    };
    
    img.src = src;
  }, [src]);

  return { imageSrc, isLoaded, isError };
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
  });

  useEffect(() => {
    const startTime = performance.now();
    
    const measurePerformance = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Memory usage (if available)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      
      // FPS calculation
      let fps = 0;
      let lastTime = performance.now();
      let frameCount = 0;
      
      const calculateFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(calculateFPS);
      };
      
      calculateFPS();
      
      setMetrics({
        renderTime,
        memoryUsage,
        fps,
      });
    };

    const timeoutId = setTimeout(measurePerformance, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return metrics;
}

// Bundle size optimization
export function useBundleOptimization() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    
    // Simulate bundle loading
    const loadBundle = async () => {
      try {
        // This would be replaced with actual bundle loading logic
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsLoaded(true);
        setLoadTime(performance.now() - startTime);
      } catch (error) {
        console.error('Bundle loading failed:', error);
      }
    };

    loadBundle();
  }, []);

  return { isLoaded, loadTime };
}

// Memory optimization
export function useMemoryOptimization() {
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [isLowMemory, setIsLowMemory] = useState(false);

  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const used = memory.usedJSHeapSize;
        const total = memory.totalJSHeapSize;
        const percentage = (used / total) * 100;
        
        setMemoryUsage(percentage);
        setIsLowMemory(percentage > 80);
      }
    };

    const interval = setInterval(checkMemory, 5000);
    checkMemory();

    return () => clearInterval(interval);
  }, []);

  return { memoryUsage, isLowMemory };
}

// Network optimization
export function useNetworkOptimization() {
  const [connection, setConnection] = useState<any>(null);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      setConnection(conn);
      setIsSlowConnection(conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g');
    }
  }, []);

  return { connection, isSlowConnection };
}

// Cache optimization
export function useCacheOptimization() {
  const [cacheSize, setCacheSize] = useState(0);
  const [cacheHitRate, setCacheHitRate] = useState(0);

  useEffect(() => {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        let totalSize = 0;
        cacheNames.forEach(cacheName => {
          caches.open(cacheName).then(cache => {
            cache.keys().then(keys => {
              totalSize += keys.length;
              setCacheSize(totalSize);
            });
          });
        });
      });
    }
  }, []);

  return { cacheSize, cacheHitRate };
}

// Animation optimization
export function useAnimationOptimization() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationCount, setAnimationCount] = useState(0);

  useEffect(() => {
    const handleAnimationStart = () => {
      setIsAnimating(true);
      setAnimationCount(prev => prev + 1);
    };

    const handleAnimationEnd = () => {
      setAnimationCount(prev => Math.max(0, prev - 1));
      if (animationCount <= 1) {
        setIsAnimating(false);
      }
    };

    document.addEventListener('animationstart', handleAnimationStart);
    document.addEventListener('animationend', handleAnimationEnd);

    return () => {
      document.removeEventListener('animationstart', handleAnimationStart);
      document.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [animationCount]);

  return { isAnimating, animationCount };
}

// Scroll optimization
export function useScrollOptimization() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY;
      
      setScrollPosition(currentScrollY);
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setIsScrolling(true);
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    const handleScrollEnd = () => {
      setIsScrolling(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', debounce(handleScrollEnd, 150), { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollEnd);
    };
  }, []);

  return { scrollPosition, scrollDirection, isScrolling };
}

// Resize optimization
export function useResizeOptimization() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}

// Focus optimization
export function useFocusOptimization() {
  const [isFocused, setIsFocused] = useState(document.hasFocus());
  const [focusCount, setFocusCount] = useState(0);

  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
      setFocusCount(prev => prev + 1);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { isFocused, focusCount };
}

// Error boundary optimization
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<any>(null);

  const resetError = () => {
    setError(null);
    setErrorInfo(null);
  };

  const captureError = (error: Error, errorInfo: any) => {
    setError(error);
    setErrorInfo(errorInfo);
  };

  return { error, errorInfo, resetError, captureError };
}

// Performance metrics collection
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0, // Time to First Byte
  });

  useEffect(() => {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[0]?.startTime || 0;
        setMetrics(prev => ({ ...prev, fcp }));
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1]?.startTime || 0;
        setMetrics(prev => ({ ...prev, lcp }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fid = entries[0]?.processingStart - entries[0]?.startTime || 0;
        setMetrics(prev => ({ ...prev, fid }));
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const cls = entries.reduce((acc, entry) => acc + (entry as any).value, 0);
        setMetrics(prev => ({ ...prev, cls }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  return metrics;
}

// Export all hooks
export {
  useDebounce,
  useThrottle,
  useMemoizedCallback,
  useMemoizedValue,
  useIntersectionObserver,
  useVirtualScrolling,
  useLazyLoading,
  useImageLazyLoading,
  usePerformanceMonitoring,
  useBundleOptimization,
  useMemoryOptimization,
  useNetworkOptimization,
  useCacheOptimization,
  useAnimationOptimization,
  useScrollOptimization,
  useResizeOptimization,
  useFocusOptimization,
  useErrorBoundary,
  usePerformanceMetrics,
};
