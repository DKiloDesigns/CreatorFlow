'use client';

import React, { createContext, useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';

interface ARIALiveRegionContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  announceError: (message: string) => void;
  announceSuccess: (message: string) => void;
  announceInfo: (message: string) => void;
}

const ARIALiveRegionContext = createContext<ARIALiveRegionContextType | null>(null);

export const useARIALiveRegion = () => {
  const context = useContext(ARIALiveRegionContext);
  if (!context) {
    throw new Error('useARIALiveRegion must be used within an ARIALiveRegionProvider');
  }
  return context;
};

interface ARIALiveRegionProviderProps {
  children: React.ReactNode;
}

export const ARIALiveRegionProvider: React.FC<ARIALiveRegionProviderProps> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Array<{
    id: string;
    message: string;
    priority: 'polite' | 'assertive';
    timestamp: number;
  }>>([]);

  // Use ref to track recent announcements without causing re-renders
  const recentAnnouncements = useRef<Map<string, number>>(new Map());

  // Clean up old entries from the ref periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      const entries = Array.from(recentAnnouncements.current.entries());
      entries.forEach(([key, timestamp]) => {
        if (now - timestamp > 10000) { // Remove entries older than 10 seconds
          recentAnnouncements.current.delete(key);
        }
      });
    }, 5000); // Run cleanup every 5 seconds

    return () => clearInterval(cleanup);
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const now = Date.now();
    const announcementKey = `${message}-${priority}`;
    
    // Check if we've already announced this recently using ref
    const lastAnnouncement = recentAnnouncements.current.get(announcementKey);
    if (lastAnnouncement && now - lastAnnouncement < 2000) {
      return; // Skip duplicate announcement
    }

    // Update the ref with current timestamp
    recentAnnouncements.current.set(announcementKey, now);

    const id = `announcement-${now}-${Math.random().toString(36).substr(2, 9)}`;
    const newAnnouncement = {
      id,
      message,
      priority,
      timestamp: now,
    };

    setAnnouncements(prev => [...prev, newAnnouncement]);

    // Remove announcement after 5 seconds to prevent accumulation
    setTimeout(() => {
      setAnnouncements(current => current.filter(announcement => announcement.id !== id));
    }, 5000);
  }, []);

  const announceError = useCallback((message: string) => {
    announce(`Error: ${message}`, 'assertive');
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(`Success: ${message}`, 'polite');
  }, [announce]);

  const announceInfo = useCallback((message: string) => {
    announce(`Info: ${message}`, 'polite');
  }, [announce]);

  return (
    <ARIALiveRegionContext.Provider value={{ announce, announceError, announceSuccess, announceInfo }}>
      {children}
      
      {/* Polite announcements */}
      <Box
        component="div"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {announcements
          .filter(announcement => announcement.priority === 'polite')
          .map(announcement => (
            <div key={announcement.id}>
              {announcement.message}
            </div>
          ))}
      </Box>

      {/* Assertive announcements */}
      <Box
        component="div"
        aria-live="assertive"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {announcements
          .filter(announcement => announcement.priority === 'assertive')
          .map(announcement => (
            <div key={announcement.id}>
              {announcement.message}
            </div>
          ))}
      </Box>
    </ARIALiveRegionContext.Provider>
  );
};

// Hook for common accessibility announcements
export const useAccessibilityAnnouncements = () => {
  const { announce, announceError, announceSuccess, announceInfo } = useARIALiveRegion();

  return useMemo(() => ({
    // Form announcements
    announceFormError: (fieldName: string, error: string) => {
      announceError(`${fieldName}: ${error}`);
    },
    announceFormSuccess: (message: string) => {
      announceSuccess(message);
    },
    
    // Navigation announcements
    announcePageChange: (pageName: string) => {
      announceInfo(`Navigated to ${pageName}`);
    },
    announceTabChange: (tabName: string) => {
      announceInfo(`Switched to ${tabName} tab`);
    },
    
    // Action announcements
    announceAction: (action: string, result: 'success' | 'error' | 'info') => {
      const message = `${action} ${result === 'success' ? 'completed successfully' : result === 'error' ? 'failed' : 'in progress'}`;
      if (result === 'success') announceSuccess(message);
      else if (result === 'error') announceError(message);
      else announceInfo(message);
    },
    
    // Data announcements
    announceDataLoad: (dataType: string, count?: number) => {
      const message = count ? `${dataType} loaded: ${count} items` : `${dataType} loaded`;
      announceInfo(message);
    },
    
    // Modal announcements
    announceModalOpen: (modalName: string) => {
      announceInfo(`${modalName} dialog opened`);
    },
    announceModalClose: (modalName: string) => {
      announceInfo(`${modalName} dialog closed`);
    },
  }), [announce, announceError, announceSuccess, announceInfo]);
};
