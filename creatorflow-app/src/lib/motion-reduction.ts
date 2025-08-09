// Motion Reduction Utility for Accessibility Support
// Implements WCAG 2.1 AA guidelines for motion sensitivity

import * as React from 'react';

export interface MotionReductionConfig {
  enabled: boolean;
  reduceAnimations: boolean;
  reduceTransitions: boolean;
  reduceTransforms: boolean;
  reduceScrollBehavior: boolean;
  respectUserPreference: boolean;
}

export class MotionReductionManager {
  private config: MotionReductionConfig;
  private mediaQuery: MediaQueryList | null = null;
  private listeners: Set<(config: MotionReductionConfig) => void> = new Set();

  constructor(config: Partial<MotionReductionConfig> = {}) {
    this.config = {
      enabled: false,
      reduceAnimations: true,
      reduceTransitions: true,
      reduceTransforms: true,
      reduceScrollBehavior: true,
      respectUserPreference: true,
      ...config,
    };

    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined') {
      // Check for user's motion preference
      this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      // Set initial state
      this.updateConfig();
      
      // Listen for changes in user preference
      this.mediaQuery.addEventListener('change', () => {
        this.updateConfig();
      });
    }
  }

  private updateConfig() {
    if (this.mediaQuery && this.config.respectUserPreference) {
      this.config.enabled = this.mediaQuery.matches;
    }

    // Notify all listeners
    this.listeners.forEach(listener => listener(this.config));
  }

  public subscribe(listener: (config: MotionReductionConfig) => void) {
    this.listeners.add(listener);
    // Immediately call with current config
    listener(this.config);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getConfig(): MotionReductionConfig {
    return { ...this.config };
  }

  public setConfig(config: Partial<MotionReductionConfig>) {
    this.config = { ...this.config, ...config };
    this.updateConfig();
  }

  public isMotionReduced(): boolean {
    return this.config.enabled;
  }

  public shouldReduceAnimations(): boolean {
    return this.config.enabled && this.config.reduceAnimations;
  }

  public shouldReduceTransitions(): boolean {
    return this.config.enabled && this.config.reduceTransitions;
  }

  public shouldReduceTransforms(): boolean {
    return this.config.enabled && this.config.reduceTransforms;
  }

  public shouldReduceScrollBehavior(): boolean {
    return this.config.enabled && this.config.reduceScrollBehavior;
  }
}

// Global motion reduction manager instance
export const motionReductionManager = new MotionReductionManager();

// Utility functions for applying motion reduction
export function applyMotionReduction(element: HTMLElement, options: {
  animations?: boolean;
  transitions?: boolean;
  transforms?: boolean;
  scrollBehavior?: boolean;
} = {}) {
  const config = motionReductionManager.getConfig();
  
  if (!config.enabled) return;

  const {
    animations = config.reduceAnimations,
    transitions = config.reduceTransitions,
    transforms = config.reduceTransforms,
    scrollBehavior = config.reduceScrollBehavior,
  } = options;

  if (animations) {
    element.style.animation = 'none';
    element.style.animationDuration = '0s';
  }

  if (transitions) {
    element.style.transition = 'none';
    element.style.transitionDuration = '0s';
  }

  if (transforms) {
    element.style.transform = 'none';
  }

  if (scrollBehavior) {
    element.style.scrollBehavior = 'auto';
  }
}

// CSS utility classes for motion reduction
export const MOTION_REDUCTION_CSS = `
  /* Motion Reduction Styles */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    
    /* Disable specific animations */
    .animate-pulse,
    .animate-bounce,
    .animate-spin,
    .animate-ping {
      animation: none !important;
    }
    
    /* Disable transforms */
    .transform,
    .scale-105,
    .rotate-45,
    .translate-x-1,
    .translate-y-1 {
      transform: none !important;
    }
    
    /* Disable transitions */
    .transition,
    .transition-all,
    .transition-colors,
    .transition-transform {
      transition: none !important;
    }
    
    /* Disable scroll behavior */
    .scroll-smooth {
      scroll-behavior: auto !important;
    }
  }
  
  /* Custom motion reduction classes */
  .motion-reduce {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    scroll-behavior: auto !important;
  }
  
  .motion-reduce-animations {
    animation: none !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
  
  .motion-reduce-transitions {
    transition: none !important;
    transition-duration: 0.01ms !important;
  }
  
  .motion-reduce-transforms {
    transform: none !important;
  }
  
  .motion-reduce-scroll {
    scroll-behavior: auto !important;
  }
`;

// React hook for motion reduction
export function useMotionReduction() {
  const [config, setConfig] = React.useState<MotionReductionConfig>(
    motionReductionManager.getConfig()
  );

  React.useEffect(() => {
    const unsubscribe = motionReductionManager.subscribe(setConfig);
    return unsubscribe;
  }, []);

  return {
    ...config,
    applyMotionReduction: (element: HTMLElement, options?: Parameters<typeof applyMotionReduction>[1]) => {
      applyMotionReduction(element, options);
    },
  };
}

// Utility for conditional styling based on motion preference
export function getMotionAwareStyles(
  defaultStyles: React.CSSProperties,
  reducedMotionStyles: React.CSSProperties = {}
): React.CSSProperties {
  const config = motionReductionManager.getConfig();
  
  if (config.enabled) {
    return {
      ...defaultStyles,
      ...reducedMotionStyles,
      // Override animation and transition properties
      animation: reducedMotionStyles.animation || 'none',
      transition: reducedMotionStyles.transition || 'none',
      transform: reducedMotionStyles.transform || 'none',
    };
  }
  
  return defaultStyles;
}

// Utility for conditional className based on motion preference
export function getMotionAwareClassName(
  defaultClassName: string,
  reducedMotionClassName: string = ''
): string {
  const config = motionReductionManager.getConfig();
  
  if (config.enabled) {
    return `${defaultClassName} ${reducedMotionClassName}`.trim();
  }
  
  return defaultClassName;
}

// Export the CSS for use in global styles
export { MOTION_REDUCTION_CSS as motionReductionCSS };
