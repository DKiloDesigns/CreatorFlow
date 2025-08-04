import { defaultCache as cache } from './cache';
import { performanceMonitor } from './performance-monitor';

interface MobileConfig {
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  touchTargets: {
    minSize: number;
    spacing: number;
  };
  performance: {
    imageOptimization: boolean;
    lazyLoading: boolean;
    codeSplitting: boolean;
    caching: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: number;
    touchFriendly: boolean;
  };
}

interface MobileMetrics {
  viewport: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
  };
  performance: {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
    batteryLevel: number;
  };
  interaction: {
    touchEvents: number;
    scrollEvents: number;
    gestureEvents: number;
    errors: number;
  };
  network: {
    connectionType: string;
    bandwidth: number;
    latency: number;
    offline: boolean;
  };
}

interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  columns: number;
  spacing: number;
  fontSize: number;
}

class MobileOptimizer {
  private cache: any;
  private performanceMonitor: any;
  private config: MobileConfig;
  private metrics: MobileMetrics;
  private breakpoints: ResponsiveBreakpoint[];

  constructor() {
    this.cache = cache;
    this.performanceMonitor = performanceMonitor;
    
    this.config = {
      breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
      touchTargets: {
        minSize: 44,
        spacing: 8,
      },
      performance: {
        imageOptimization: true,
        lazyLoading: true,
        codeSplitting: true,
        caching: true,
      },
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        fontSize: 16,
        touchFriendly: true,
      },
    };

    this.metrics = {
      viewport: { width: 0, height: 0, orientation: 'portrait' },
      performance: { loadTime: 0, renderTime: 0, memoryUsage: 0, batteryLevel: 100 },
      interaction: { touchEvents: 0, scrollEvents: 0, gestureEvents: 0, errors: 0 },
      network: { connectionType: 'unknown', bandwidth: 0, latency: 0, offline: false },
    };

    this.breakpoints = [
      { name: 'mobile', minWidth: 0, maxWidth: 640, columns: 1, spacing: 16, fontSize: 14 },
      { name: 'tablet', minWidth: 641, maxWidth: 1024, columns: 2, spacing: 24, fontSize: 16 },
      { name: 'desktop', minWidth: 1025, columns: 3, spacing: 32, fontSize: 18 },
    ];
  }

  // Mobile detection and capabilities
  async detectMobileCapabilities(): Promise<{
    isMobile: boolean;
    isTablet: boolean;
    isTouch: boolean;
    capabilities: string[];
  }> {
    try {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      const capabilities = [];
      if (isTouch) capabilities.push('touch');
      if ('serviceWorker' in navigator) capabilities.push('pwa');
      if ('geolocation' in navigator) capabilities.push('geolocation');
      if ('camera' in navigator) capabilities.push('camera');
      if ('vibrate' in navigator) capabilities.push('vibration');
      if ('accelerometer' in window) capabilities.push('accelerometer');

      return {
        isMobile,
        isTablet,
        isTouch,
        capabilities,
      };
    } catch (error) {
      console.error('Error detecting mobile capabilities:', error);
      return {
        isMobile: false,
        isTablet: false,
        isTouch: false,
        capabilities: [],
      };
    }
  }

  // Viewport management
  async getViewportInfo(): Promise<{
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
    pixelRatio: number;
    breakpoint: string;
  }> {
    try {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      const pixelRatio = window.devicePixelRatio || 1;

      const breakpoint = this.getBreakpoint(width);

      this.metrics.viewport = { width, height, orientation };

      return {
        width,
        height,
        orientation,
        pixelRatio,
        breakpoint,
      };
    } catch (error) {
      console.error('Error getting viewport info:', error);
      return {
        width: 0,
        height: 0,
        orientation: 'portrait',
        pixelRatio: 1,
        breakpoint: 'mobile',
      };
    }
  }

  private getBreakpoint(width: number): string {
    for (const breakpoint of this.breakpoints) {
      if (width >= breakpoint.minWidth && (!breakpoint.maxWidth || width <= breakpoint.maxWidth)) {
        return breakpoint.name;
      }
    }
    return 'desktop';
  }

  // Performance optimization
  async optimizeForMobile(): Promise<{
    imageOptimization: boolean;
    lazyLoading: boolean;
    codeSplitting: boolean;
    caching: boolean;
  }> {
    try {
      const capabilities = await this.detectMobileCapabilities();
      const viewport = await this.getViewportInfo();

      // Adjust optimization based on device capabilities
      const optimizations = {
        imageOptimization: capabilities.isMobile || viewport.pixelRatio > 1,
        lazyLoading: capabilities.isMobile || viewport.width < this.config.breakpoints.md,
        codeSplitting: true, // Always enable for mobile
        caching: capabilities.capabilities.includes('pwa'),
      };

      this.config.performance = optimizations;

      return optimizations;
    } catch (error) {
      console.error('Error optimizing for mobile:', error);
      return this.config.performance;
    }
  }

  // Touch-friendly interface optimization
  async optimizeTouchTargets(): Promise<{
    minSize: number;
    spacing: number;
    recommendations: string[];
  }> {
    try {
      const capabilities = await this.detectMobileCapabilities();
      const viewport = await this.getViewportInfo();

      let minSize = this.config.touchTargets.minSize;
      let spacing = this.config.touchTargets.spacing;

      // Adjust for high-DPI displays
      if (viewport.pixelRatio > 2) {
        minSize = Math.max(minSize, 48);
        spacing = Math.max(spacing, 12);
      }

      // Adjust for small screens
      if (viewport.width < 375) {
        minSize = Math.max(minSize, 52);
        spacing = Math.max(spacing, 16);
      }

      const recommendations = [];
      if (capabilities.isTouch) {
        recommendations.push('Ensure all interactive elements are at least 44px');
        recommendations.push('Add sufficient spacing between touch targets');
        recommendations.push('Use larger fonts for better readability');
      }

      return {
        minSize,
        spacing,
        recommendations,
      };
    } catch (error) {
      console.error('Error optimizing touch targets:', error);
      return {
        minSize: this.config.touchTargets.minSize,
        spacing: this.config.touchTargets.spacing,
        recommendations: [],
      };
    }
  }

  // Accessibility optimization
  async optimizeAccessibility(): Promise<{
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: number;
    touchFriendly: boolean;
  }> {
    try {
      const capabilities = await this.detectMobileCapabilities();
      const viewport = await this.getViewportInfo();

      // Check for user preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

      const accessibility = {
        highContrast: prefersHighContrast,
        reducedMotion: prefersReducedMotion,
        fontSize: Math.max(16, this.config.accessibility.fontSize),
        touchFriendly: capabilities.isTouch,
      };

      // Adjust font size for small screens
      if (viewport.width < 375) {
        accessibility.fontSize = Math.max(accessibility.fontSize, 18);
      }

      this.config.accessibility = accessibility;

      return accessibility;
    } catch (error) {
      console.error('Error optimizing accessibility:', error);
      return this.config.accessibility;
    }
  }

  // Network optimization
  async optimizeNetwork(): Promise<{
    connectionType: string;
    bandwidth: number;
    latency: number;
    recommendations: string[];
  }> {
    try {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      const networkInfo = {
        connectionType: connection?.effectiveType || 'unknown',
        bandwidth: connection?.downlink || 0,
        latency: connection?.rtt || 0,
        recommendations: [],
      };

      // Generate recommendations based on connection
      if (networkInfo.connectionType === 'slow-2g' || networkInfo.connectionType === '2g') {
        networkInfo.recommendations.push('Enable aggressive caching');
        networkInfo.recommendations.push('Reduce image quality');
        networkInfo.recommendations.push('Disable non-essential features');
      } else if (networkInfo.connectionType === '3g') {
        networkInfo.recommendations.push('Enable lazy loading');
        networkInfo.recommendations.push('Optimize image sizes');
        networkInfo.recommendations.push('Use progressive loading');
      }

      this.metrics.network = {
        ...networkInfo,
        offline: !navigator.onLine,
      };

      return networkInfo;
    } catch (error) {
      console.error('Error optimizing network:', error);
      return {
        connectionType: 'unknown',
        bandwidth: 0,
        latency: 0,
        recommendations: [],
      };
    }
  }

  // Performance monitoring
  async trackMobilePerformance(): Promise<MobileMetrics> {
    try {
      const startTime = performance.now();
      
      // Track viewport changes
      const viewport = await this.getViewportInfo();
      
      // Track performance metrics
      const performanceMetrics = {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        renderTime: performance.now() - startTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        batteryLevel: await this.getBatteryLevel(),
      };

      this.metrics.performance = performanceMetrics;

      // Track interaction metrics
      this.trackInteractions();

      return this.metrics;
    } catch (error) {
      console.error('Error tracking mobile performance:', error);
      return this.metrics;
    }
  }

  private async getBatteryLevel(): Promise<number> {
    try {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        return battery.level * 100;
      }
      return 100; // Default if battery API not available
    } catch (error) {
      return 100;
    }
  }

  private trackInteractions(): void {
    // Track touch events
    document.addEventListener('touchstart', () => {
      this.metrics.interaction.touchEvents++;
    });

    // Track scroll events
    document.addEventListener('scroll', () => {
      this.metrics.interaction.scrollEvents++;
    });

    // Track errors
    window.addEventListener('error', () => {
      this.metrics.interaction.errors++;
    });
  }

  // Responsive design utilities
  getResponsiveConfig(width: number): ResponsiveBreakpoint {
    return this.breakpoints.find(bp => 
      width >= bp.minWidth && (!bp.maxWidth || width <= bp.maxWidth)
    ) || this.breakpoints[0];
  }

  // Mobile-specific optimizations
  async applyMobileOptimizations(): Promise<{
    success: boolean;
    optimizations: string[];
    performance: any;
  }> {
    try {
      const optimizations = [];
      
      // Apply performance optimizations
      const perfOpts = await this.optimizeForMobile();
      if (perfOpts.imageOptimization) optimizations.push('Image optimization enabled');
      if (perfOpts.lazyLoading) optimizations.push('Lazy loading enabled');
      if (perfOpts.codeSplitting) optimizations.push('Code splitting enabled');
      if (perfOpts.caching) optimizations.push('Caching enabled');

      // Apply touch optimizations
      const touchOpts = await this.optimizeTouchTargets();
      optimizations.push(`Touch targets optimized (${touchOpts.minSize}px minimum)`);

      // Apply accessibility optimizations
      const accessibilityOpts = await this.optimizeAccessibility();
      if (accessibilityOpts.highContrast) optimizations.push('High contrast mode enabled');
      if (accessibilityOpts.reducedMotion) optimizations.push('Reduced motion enabled');
      optimizations.push(`Font size optimized (${accessibilityOpts.fontSize}px)`);

      // Apply network optimizations
      const networkOpts = await this.optimizeNetwork();
      optimizations.push(`Network optimized for ${networkOpts.connectionType}`);

      // Track performance
      const performance = await this.trackMobilePerformance();

      return {
        success: true,
        optimizations,
        performance,
      };
    } catch (error) {
      console.error('Error applying mobile optimizations:', error);
      return {
        success: false,
        optimizations: [],
        performance: null,
      };
    }
  }

  // Get current mobile configuration
  getConfig(): MobileConfig {
    return this.config;
  }

  // Get current mobile metrics
  getMetrics(): MobileMetrics {
    return this.metrics;
  }
}

// Export mobile optimizer instance
export const mobileOptimizer = new MobileOptimizer(); 