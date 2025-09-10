'use client';

import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
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

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const id = `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAnnouncement = {
      id,
      message,
      priority,
      timestamp: Date.now(),
    };

    setAnnouncements(prev => [...prev, newAnnouncement]);

    // Remove announcement after 5 seconds to prevent accumulation
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
    }, 5000);
  };

  const announceError = (message: string) => {
    announce(`Error: ${message}`, 'assertive');
  };

  const announceSuccess = (message: string) => {
    announce(`Success: ${message}`, 'polite');
  };

  const announceInfo = (message: string) => {
    announce(`Info: ${message}`, 'polite');
  };

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

  return {
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
  };
};
