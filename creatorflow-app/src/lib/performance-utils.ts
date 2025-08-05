import React from 'react';

// Performance utilities for optimization

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Resource preloader
export function preloadResource(url: string, type: 'image' | 'script' | 'style' = 'image'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (type === 'image') {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    } else if (type === 'script') {
      const script = document.createElement('script');
      script.onload = () => resolve();
      script.onerror = reject;
      script.src = url;
      document.head.appendChild(script);
    } else if (type === 'style') {
      const link = document.createElement('link');
      link.onload = () => resolve();
      link.onerror = reject;
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  });
}

// Bundle size analyzer
export function analyzeBundleSize(): void {
  if (typeof window !== 'undefined') {
    const performance = window.performance;
    if (performance && performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const totalSize = resources.reduce((acc, resource) => {
        return acc + (resource.transferSize || 0);
      }, 0);
      
      console.log('Bundle Analysis:', {
        totalResources: resources.length,
        totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
        resources: resources.map(r => ({
          name: r.name,
          size: `${(r.transferSize || 0 / 1024).toFixed(2)} KB`
        }))
      });
    }
  }
}

// Component performance tracker
export function trackComponentPerformance(componentName: string) {
  return function <T extends React.ComponentType<any>>(Component: T): T {
    const WrappedComponent = (props: any) => {
      const startTime = performance.now();
      
      React.useEffect(() => {
        const endTime = performance.now();
        console.log(`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
      });
      
      return React.createElement(Component, props);
    };
    
    return WrappedComponent as T;
  };
} 