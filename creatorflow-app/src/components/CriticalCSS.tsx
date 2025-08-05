'use client';

import { useEffect } from 'react';
import { injectCriticalCSS, preloadCriticalResources } from '@/lib/critical-css';

export function CriticalCSS() {
  useEffect(() => {
    // Inject critical CSS immediately
    injectCriticalCSS();
    
    // Preload critical resources
    preloadCriticalResources();
  }, []);

  return null; // This component doesn't render anything
} 