// Screen Reader Announcements Utility for Accessibility Support
// Implements WCAG 2.1 AA guidelines for screen reader announcements

import * as React from 'react';
import { Box } from '@mui/material';

export interface AnnouncementConfig {
  priority: 'low' | 'medium' | 'high';
  type: 'status' | 'alert' | 'log' | 'timer' | 'marquee';
  timeout?: number;
  clearOnNavigate?: boolean;
}

export interface Announcement {
  id: string;
  message: string;
  config: AnnouncementConfig;
  timestamp: number;
}

export class ScreenReaderAnnouncements {
  private announcements: Announcement[] = [];
  private listeners: Set<(announcements: Announcement[]) => void> = new Set();
  private liveRegions: Map<string, HTMLElement> = new Map();

  constructor() {
    this.initializeLiveRegions();
  }

  private initializeLiveRegions() {
    if (typeof window === 'undefined') return;

    // Create live regions for different announcement types
    const regions = [
      { id: 'status', type: 'status', priority: 'polite' },
      { id: 'alert', type: 'alert', priority: 'assertive' },
      { id: 'log', type: 'log', priority: 'polite' },
      { id: 'timer', type: 'timer', priority: 'polite' },
      { id: 'marquee', type: 'marquee', priority: 'polite' },
    ];

    regions.forEach(({ id, type, priority }) => {
      const region = document.createElement('div');
      region.id = `sr-announcement-${id}`;
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.setAttribute('role', type);
      region.className = 'sr-only';
      region.style.position = 'absolute';
      region.style.left = '-10000px';
      region.style.width = '1px';
      region.style.height = '1px';
      region.style.overflow = 'hidden';

      document.body.appendChild(region);
      this.liveRegions.set(id, region);
    });
  }

  public announce(message: string, config: Partial<AnnouncementConfig> = {}) {
    const announcement: Announcement = {
      id: `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      config: {
        priority: 'medium',
        type: 'status',
        timeout: 5000,
        clearOnNavigate: true,
        ...config,
      },
      timestamp: Date.now(),
    };

    this.announcements.push(announcement);
    this.updateLiveRegion(announcement);
    this.notifyListeners();

    // Auto-clear after timeout
    if (announcement.config.timeout && announcement.config.timeout > 0) {
      setTimeout(() => {
        this.clear(announcement.id);
      }, announcement.config.timeout);
    }

    return announcement.id;
  }

  private updateLiveRegion(announcement: Announcement) {
    const regionId = this.getRegionId(announcement.config.type);
    const region = this.liveRegions.get(regionId);

    if (region) {
      // Clear existing content
      region.textContent = '';
      
      // Add new announcement
      const announcementElement = document.createElement('div');
      announcementElement.textContent = announcement.message;
      announcementElement.setAttribute('data-announcement-id', announcement.id);
      region.appendChild(announcementElement);

      // Trigger screen reader announcement
      this.triggerAnnouncement(region, announcement.message);
    }
  }

  private getRegionId(type: string): string {
    switch (type) {
      case 'alert': return 'alert';
      case 'log': return 'log';
      case 'timer': return 'timer';
      case 'marquee': return 'marquee';
      default: return 'status';
    }
  }

  private triggerAnnouncement(region: HTMLElement, message: string) {
    // Force screen reader to announce by temporarily making content visible
    const originalStyle = region.style.cssText;
    region.style.position = 'absolute';
    region.style.left = '0';
    region.style.top = '0';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.opacity = '0';
    region.style.pointerEvents = 'none';

    // Trigger announcement
    region.focus();
    region.blur();

    // Restore original style
    setTimeout(() => {
      region.style.cssText = originalStyle;
    }, 100);
  }

  public clear(announcementId?: string) {
    if (announcementId) {
      this.announcements = this.announcements.filter(a => a.id !== announcementId);
    } else {
      this.announcements = [];
    }

    // Clear live regions
    this.liveRegions.forEach(region => {
      region.textContent = '';
    });

    this.notifyListeners();
  }

  public clearByType(type: string) {
    this.announcements = this.announcements.filter(a => a.config.type !== type);
    this.notifyListeners();
  }

  public getAnnouncements(): Announcement[] {
    return [...this.announcements];
  }

  public subscribe(listener: (announcements: Announcement[]) => void) {
    this.listeners.add(listener);
    listener(this.announcements);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      listener([...this.announcements]);
    });
  }

  public destroy() {
    this.liveRegions.forEach(region => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    });
    this.liveRegions.clear();
    this.announcements = [];
    this.listeners.clear();
  }
}

// Global screen reader announcements instance
export const screenReaderAnnouncements = new ScreenReaderAnnouncements();

// React hook for screen reader announcements
export function useScreenReaderAnnouncements() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);

  React.useEffect(() => {
    const unsubscribe = screenReaderAnnouncements.subscribe(setAnnouncements);
    return unsubscribe;
  }, []);

  return {
    announcements,
    announce: (message: string, config?: Partial<AnnouncementConfig>) => {
      return screenReaderAnnouncements.announce(message, config);
    },
    clear: (announcementId?: string) => {
      screenReaderAnnouncements.clear(announcementId);
    },
    clearByType: (type: string) => {
      screenReaderAnnouncements.clearByType(type);
    },
  };
}

// Utility functions for common announcements
export const announceUtils = {
  // Status announcements (polite)
  status: (message: string, timeout?: number) => {
    return screenReaderAnnouncements.announce(message, {
      type: 'status',
      priority: 'low',
      timeout,
    });
  },

  // Alert announcements (assertive)
  alert: (message: string, timeout?: number) => {
    return screenReaderAnnouncements.announce(message, {
      type: 'alert',
      priority: 'high',
      timeout,
    });
  },

  // Log announcements (polite)
  log: (message: string, timeout?: number) => {
    return screenReaderAnnouncements.announce(message, {
      type: 'log',
      priority: 'medium',
      timeout,
    });
  },

  // Timer announcements (polite)
  timer: (message: string, timeout?: number) => {
    return screenReaderAnnouncements.announce(message, {
      type: 'timer',
      priority: 'low',
      timeout,
    });
  },

  // Marquee announcements (polite)
  marquee: (message: string, timeout?: number) => {
    return screenReaderAnnouncements.announce(message, {
      type: 'marquee',
      priority: 'low',
      timeout,
    });
  },
};

// Component for rendering announcements
export function ScreenReaderAnnouncementsProvider({ children }: { children: React.ReactNode }) {
  const { announcements } = useScreenReaderAnnouncements();

  return (
    <>
      {children}
      {/* Hidden live regions for screen reader announcements */}
      <Box 
        id="sr-announcement-status" 
        aria-live="polite" 
        aria-atomic="true" 
        sx={{ 
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }} 
      />
      <Box 
        id="sr-announcement-alert" 
        aria-live="assertive" 
        aria-atomic="true" 
        sx={{ 
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }} 
      />
      <Box 
        id="sr-announcement-log" 
        aria-live="polite" 
        aria-atomic="true" 
        sx={{ 
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }} 
      />
      <Box 
        id="sr-announcement-timer" 
        aria-live="polite" 
        aria-atomic="true" 
        sx={{ 
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }} 
      />
      <Box 
        id="sr-announcement-marquee" 
        aria-live="polite" 
        aria-atomic="true" 
        sx={{ 
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }} 
      />
    </>
  );
}
