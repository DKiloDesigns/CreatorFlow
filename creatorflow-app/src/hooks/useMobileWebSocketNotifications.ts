/**
 * Mobile-Optimized WebSocket Notifications Hook
 * Enhanced for mobile devices with touch-friendly interactions and performance optimizations
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { useMediaQuery, useTheme } from '@mui/material';

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

interface UseMobileWebSocketNotificationsReturn {
  socket: Socket | null;
  isConnected: boolean;
  notifications: NotificationData[];
  unreadCount: number;
  sendNotification: (notification: Omit<NotificationData, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  lastNotification: NotificationData | null;
  isMobile: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  retryConnection: () => void;
}

export function useMobileWebSocketNotifications(): UseMobileWebSocketNotificationsReturn {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: session, status } = useSession();
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'offline'>('offline');
  
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 second

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Connection quality monitoring
  const updateConnectionQuality = useCallback((latency: number) => {
    if (latency < 100) {
      setConnectionQuality('excellent');
    } else if (latency < 300) {
      setConnectionQuality('good');
    } else {
      setConnectionQuality('poor');
    }
  }, []);

  // Retry connection function
  const retryConnection = useCallback(() => {
    if (socket) {
      socket.connect();
    }
  }, [socket]);

  // Initialize WebSocket connection with mobile optimizations
  useEffect(() => {
    if (status === 'loading' || !session?.user?.id) return;

    // Add a small delay to ensure the server is ready
    const connectionTimeout = setTimeout(() => {
      console.log('🔌 Initializing Mobile WebSocket connection...');
      
      const newSocket = io(process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL || 'https://creatorflow.app'
        : 'http://localhost:3001', {
        path: '/api/socketio',
        transports: ['websocket', 'polling'],
        autoConnect: true,
        // Mobile optimizations
        timeout: 10000, // 10 second timeout
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: baseReconnectDelay,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: maxReconnectAttempts,
      });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Mobile WebSocket connected:', newSocket.id);
      setIsConnected(true);
      setConnectionQuality('excellent');
      reconnectAttempts.current = 0;
      
      // Identify user after connection
      newSocket.emit('identify_user', {
        userId: session.user.id,
        userEmail: session.user.email,
      });

      // Measure connection latency
      const startTime = Date.now();
      newSocket.emit('ping', () => {
        const latency = Date.now() - startTime;
        updateConnectionQuality(latency);
      });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Mobile WebSocket disconnected:', reason);
      setIsConnected(false);
      setConnectionQuality('offline');
      
      // Auto-reconnect with exponential backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current++;
          newSocket.connect();
        }, delay);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.warn('⚠️ Mobile WebSocket connection error (this is normal if server is not ready):', error.message);
      setIsConnected(false);
      setConnectionQuality('offline');
    });

    newSocket.on('connect_timeout', () => {
      console.warn('⏰ Mobile WebSocket connection timeout (this is normal if server is not ready)');
      setIsConnected(false);
      setConnectionQuality('offline');
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Mobile WebSocket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Mobile WebSocket reconnection error:', error);
      setConnectionQuality('poor');
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Mobile WebSocket reconnection failed');
      setConnectionQuality('offline');
    });

    // User identification confirmation
    newSocket.on('user_identified', (data) => {
      console.log('👤 User identified on mobile:', data);
    });

    // New notification received
    newSocket.on('new_notification', (notification: NotificationData) => {
      console.log('📨 New mobile notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setLastNotification(notification);
      
      // Show browser notification if permission granted and on mobile
      if (isMobile && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id,
          requireInteraction: notification.priority === 'urgent',
          silent: notification.priority === 'low',
        });
      }
    });

    // System notification received
    newSocket.on('system_notification', (notification: Omit<NotificationData, 'userId'>) => {
      console.log('📢 System notification received on mobile:', notification);
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
      console.log('✅ Notification marked as read on mobile:', data);
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
      console.log('✅ All notifications marked as read on mobile:', data);
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    });

    // Error handlers
    newSocket.on('auth_error', (error) => {
      console.error('🔐 Mobile authentication error:', error);
    });

    newSocket.on('notification_read_error', (error) => {
      console.error('❌ Mobile notification read error:', error);
    });

    newSocket.on('bulk_action_error', (error) => {
      console.error('❌ Mobile bulk action error:', error);
    });

      setSocket(newSocket);

      // Request notification permission on mobile
      if (isMobile && typeof window !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }, 1000); // 1 second delay

    return () => {
      clearTimeout(connectionTimeout);
      console.log('🔌 Cleaning up Mobile WebSocket connection...');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [session?.user?.id, status, isMobile, updateConnectionQuality]);

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
        id: `mobile_test_${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications(prev => [fullNotification, ...prev]);
      setLastNotification(fullNotification);
    }
  }, [socket, isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    notifications,
    unreadCount,
    sendNotification,
    markAsRead,
    markAllAsRead,
    lastNotification,
    isMobile,
    connectionQuality,
    retryConnection,
  };
}
