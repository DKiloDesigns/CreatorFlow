import * as React from 'react';
import { useScreenReaderAnnouncements, announceUtils, AnnouncementConfig } from '@/lib/screen-reader-announcements';

interface ScreenReaderAnnouncementProps {
  message: string;
  type?: 'status' | 'alert' | 'log' | 'timer' | 'marquee';
  priority?: 'low' | 'medium' | 'high';
  timeout?: number;
  clearOnNavigate?: boolean;
  children?: React.ReactNode;
  trigger?: 'mount' | 'unmount' | 'update' | 'manual';
  dependencies?: any[];
}

export function ScreenReaderAnnouncement({
  message,
  type = 'status',
  priority = 'medium',
  timeout = 5000,
  clearOnNavigate = true,
  children,
  trigger = 'mount',
  dependencies = [],
}: ScreenReaderAnnouncementProps) {
  const { announce, clear } = useScreenReaderAnnouncements();
  const announcementIdRef = React.useRef<string | null>(null);

  const announceMessage = React.useCallback(() => {
    if (announcementIdRef.current) {
      clear(announcementIdRef.current);
    }
    
    announcementIdRef.current = announce(message, {
      type,
      priority,
      timeout,
      clearOnNavigate,
    });
  }, [message, type, priority, timeout, clearOnNavigate, announce, clear]);

  React.useEffect(() => {
    if (trigger === 'mount') {
      announceMessage();
    }
  }, [trigger, announceMessage]);

  React.useEffect(() => {
    if (trigger === 'update' && dependencies.length > 0) {
      announceMessage();
    }
  }, [...dependencies, trigger, announceMessage]);

  React.useEffect(() => {
    return () => {
      if (trigger === 'unmount' && announcementIdRef.current) {
        clear(announcementIdRef.current);
      }
    };
  }, [trigger, clear]);

  if (children) {
    return <>{children}</>;
  }

  return null;
}

interface ScreenReaderStatusProps {
  message: string;
  timeout?: number;
  children?: React.ReactNode;
}

export function ScreenReaderStatus({ message, timeout, children }: ScreenReaderStatusProps) {
  return (
    <ScreenReaderAnnouncement
      message={message}
      type="status"
      priority="low"
      timeout={timeout}
      trigger="mount"
    >
      {children}
    </ScreenReaderAnnouncement>
  );
}

interface ScreenReaderAlertProps {
  message: string;
  timeout?: number;
  children?: React.ReactNode;
}

export function ScreenReaderAlert({ message, timeout, children }: ScreenReaderAlertProps) {
  return (
    <ScreenReaderAnnouncement
      message={message}
      type="alert"
      priority="high"
      timeout={timeout}
      trigger="mount"
    >
      {children}
    </ScreenReaderAnnouncement>
  );
}

interface ScreenReaderLogProps {
  message: string;
  timeout?: number;
  children?: React.ReactNode;
}

export function ScreenReaderLog({ message, timeout, children }: ScreenReaderLogProps) {
  return (
    <ScreenReaderAnnouncement
      message={message}
      type="log"
      priority="medium"
      timeout={timeout}
      trigger="mount"
    >
      {children}
    </ScreenReaderAnnouncement>
  );
}

interface ScreenReaderTimerProps {
  message: string;
  timeout?: number;
  children?: React.ReactNode;
}

export function ScreenReaderTimer({ message, timeout, children }: ScreenReaderTimerProps) {
  return (
    <ScreenReaderAnnouncement
      message={message}
      type="timer"
      priority="low"
      timeout={timeout}
      trigger="mount"
    >
      {children}
    </ScreenReaderAnnouncement>
  );
}

interface ScreenReaderMarqueeProps {
  message: string;
  timeout?: number;
  children?: React.ReactNode;
}

export function ScreenReaderMarquee({ message, timeout, children }: ScreenReaderMarqueeProps) {
  return (
    <ScreenReaderAnnouncement
      message={message}
      type="marquee"
      priority="low"
      timeout={timeout}
      trigger="mount"
    >
      {children}
    </ScreenReaderAnnouncement>
  );
}

// Hook for manual announcements
export function useScreenReaderAnnouncement() {
  const { announce, clear, clearByType } = useScreenReaderAnnouncements();

  return {
    announce,
    clear,
    clearByType,
    announceStatus: (message: string, timeout?: number) => {
      return announceUtils.status(message, timeout);
    },
    announceAlert: (message: string, timeout?: number) => {
      return announceUtils.alert(message, timeout);
    },
    announceLog: (message: string, timeout?: number) => {
      return announceUtils.log(message, timeout);
    },
    announceTimer: (message: string, timeout?: number) => {
      return announceUtils.timer(message, timeout);
    },
    announceMarquee: (message: string, timeout?: number) => {
      return announceUtils.marquee(message, timeout);
    },
  };
}
