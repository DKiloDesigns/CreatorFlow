/**
 * WebSocket Notifications Hook
 * Manages real-time notification connections and state
 */

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface NotificationData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

interface UseWebSocketNotificationsReturn {
  socket: Socket | null;
  isConnected: boolean;
  notifications: NotificationData[];
  unreadCount: number;
  sendNotification: (notification: Omit<NotificationData, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  lastNotification: NotificationData | null;
}

export function useWebSocketNotifications(): UseWebSocketNotificationsReturn {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialize WebSocket connection
  useEffect(() => {
    if (status === 'loading' || !session?.user?.id) return;

    // Add a small delay to ensure the server is ready
    const connectionTimeout = setTimeout(() => {
      console.log('🔌 Initializing WebSocket connection...');
      
      const newSocket = io(process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL || 'https://creatorflow.app'
        : 'http://localhost:3001', {
        path: '/api/socketio',
        transports: ['websocket', 'polling'],
        autoConnect: true,
        timeout: 20000, // 20 second timeout
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
      });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected:', newSocket.id);
      setIsConnected(true);
      
      // Identify user after connection
      newSocket.emit('identify_user', {
        userId: session.user.id,
        userEmail: session.user.email,
      });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.warn('⚠️ WebSocket connection error (this is normal if server is not ready):', error.message);
      setIsConnected(false);
    });

    newSocket.on('connect_timeout', () => {
      console.warn('⏰ WebSocket connection timeout (this is normal if server is not ready)');
      setIsConnected(false);
    });

    // User identification confirmation
    newSocket.on('user_identified', (data) => {
      console.log('👤 User identified:', data);
    });

    // New notification received
    newSocket.on('new_notification', (notification: NotificationData) => {
      console.log('📨 New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setLastNotification(notification);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id,
        });
      }
    });

    // System notification received
    newSocket.on('system_notification', (notification: Omit<NotificationData, 'userId'>) => {
      console.log('📢 System notification received:', notification);
      const fullNotification: NotificationData = {
        ...notification,
        userId: session.user.id,
        read: false,
      };
      setNotifications(prev => [fullNotification, ...prev]);
      setLastNotification(fullNotification);
    });

    // Notification read confirmation
    newSocket.on('notification_read', (data) => {
      console.log('✅ Notification marked as read:', data);
      setNotifications(prev => 
        prev.map(n => 
          n.id === data.notificationId 
            ? { ...n, read: true }
            : n
        )
      );
    });

    // All notifications read confirmation
    newSocket.on('all_notifications_read', (data) => {
      console.log('✅ All notifications marked as read:', data);
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    });

    // Error handlers
    newSocket.on('auth_error', (error) => {
      console.error('🔐 Authentication error:', error);
    });

    newSocket.on('notification_read_error', (error) => {
      console.error('❌ Notification read error:', error);
    });

    newSocket.on('bulk_action_error', (error) => {
      console.error('❌ Bulk action error:', error);
    });

      setSocket(newSocket);

      // Request notification permission
      if (typeof window !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }, 1000); // 1 second delay

    return () => {
      clearTimeout(connectionTimeout);
      console.log('🔌 Cleaning up WebSocket connection...');
      if (socket) {
        socket.close();
      }
    };
  }, [session?.user?.id, status]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    if (socket && isConnected) {
      socket.emit('mark_notification_read', { notificationId });
    }
  }, [socket, isConnected]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    if (socket && isConnected && session?.user?.id) {
      socket.emit('mark_all_read', { userId: session.user.id });
    }
  }, [socket, isConnected, session?.user?.id]);

  // Send notification (for testing purposes)
  const sendNotification = useCallback((notification: Omit<NotificationData, 'id' | 'createdAt' | 'read'>) => {
    if (socket && isConnected) {
      const fullNotification: NotificationData = {
        ...notification,
        id: `test_${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications(prev => [fullNotification, ...prev]);
      setLastNotification(fullNotification);
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    notifications,
    unreadCount,
    sendNotification,
    markAsRead,
    markAllAsRead,
    lastNotification,
  };
}
