'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Notification } from '@/lib/notifications/types';
import { NotificationToast } from '@/components/ui/notification-badge';

interface RealTimeNotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  isConnected: boolean;
  lastNotification: Notification | null;
}

const RealTimeNotificationContext = createContext<RealTimeNotificationContextType | null>(null);

interface RealTimeNotificationProviderProps {
  children: React.ReactNode;
}

export function RealTimeNotificationProvider({ children }: RealTimeNotificationProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotification, setLastNotification] = useState<Notification | null>(null);
  const [toast, setToast] = useState<{ title: string; message?: string; variant: 'success' | 'error' | 'info' } | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:4001', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('🔗 Connected to notification WebSocket');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from notification WebSocket');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Listen for new notifications
    newSocket.on('notification', (notification: Notification) => {
      console.log('📨 Received new notification:', notification);
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      setLastNotification(notification);

      // Show toast for new notifications
      if (notification.severity === 'critical' || notification.severity === 'high') {
        setToast({
          title: notification.title,
          message: notification.message,
          variant: notification.severity === 'critical' ? 'error' : 'info',
        });
      }
    });

    // Listen for notification updates
    newSocket.on('notification_update', (updatedNotification: Notification) => {
      setNotifications(prev => 
        prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
      );
    });

    // Listen for notification deletion
    newSocket.on('notification_delete', (notificationId: string) => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    });

    // Listen for bulk operations
    newSocket.on('notifications_mark_read', (notificationIds: string[]) => {
      setNotifications(prev => 
        prev.map(n => 
          notificationIds.includes(n.id) 
            ? { ...n, read: true, readAt: new Date() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications/enhanced?limit=50');
        if (!response.ok) throw new Error('Failed to fetch notifications');
        
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications?.filter((n: Notification) => !n.read).length || 0);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/enhanced', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', notificationId }),
      });

      if (!response.ok) throw new Error('Failed to mark notification as read');

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true, readAt: new Date() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Emit to WebSocket for real-time updates
      socket?.emit('mark_read', notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setToast({ title: 'Error', message: 'Failed to mark notification as read', variant: 'error' });
    }
  }, [socket]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/enhanced', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' }),
      });

      if (!response.ok) throw new Error('Failed to mark all notifications as read');

      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true, readAt: new Date() }))
      );
      setUnreadCount(0);

      // Emit to WebSocket for real-time updates
      socket?.emit('mark_all_read');

      setToast({ title: 'Success', message: 'All notifications marked as read', variant: 'success' });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      setToast({ title: 'Error', message: 'Failed to mark all notifications as read', variant: 'error' });
    }
  }, [socket]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/enhanced', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', notificationId }),
      });

      if (!response.ok) throw new Error('Failed to delete notification');

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.read ? Math.max(0, prev - 1) : prev;
      });

      // Emit to WebSocket for real-time updates
      socket?.emit('delete_notification', notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      setToast({ title: 'Error', message: 'Failed to delete notification', variant: 'error' });
    }
  }, [socket, notifications]);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const contextValue: RealTimeNotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isConnected,
    lastNotification,
  };

  return (
    <RealTimeNotificationContext.Provider value={contextValue}>
      {children}
      
      {toast && (
        <NotificationToast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </RealTimeNotificationContext.Provider>
  );
}

export function useRealTimeNotifications() {
  const context = useContext(RealTimeNotificationContext);
  if (!context) {
    throw new Error('useRealTimeNotifications must be used within a RealTimeNotificationProvider');
  }
  return context;
} 