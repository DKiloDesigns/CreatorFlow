'use client';

import { useEffect } from 'react';
import { registerServiceWorker, requestNotificationPermission } from '@/lib/service-worker';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Request notification permission
    requestNotificationPermission();
  }, []);

  return null; // This component doesn't render anything
} 