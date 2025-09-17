/**
 * Real-time Notification System
 * Handles all types of notifications for CreatorFlow
 */

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'post' | 'oauth' | 'system' | 'scheduled' | 'general';
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  categories: {
    post: boolean;
    oauth: boolean;
    system: boolean;
    scheduled: boolean;
    general: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export class NotificationSystem {
  private notifications: Map<string, Notification> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();
  private listeners: Set<(notification: Notification) => void> = new Set();

  constructor() {
    this.initializeDefaultPreferences();
  }

  private initializeDefaultPreferences() {
    // Default preferences for all users
    const defaultPrefs: NotificationPreferences = {
      userId: 'default',
      email: true,
      push: true,
      inApp: true,
      categories: {
        post: true,
        oauth: true,
        system: true,
        scheduled: true,
        general: true
      },
      frequency: 'immediate'
    };
    this.preferences.set('default', defaultPrefs);
  }

  // Create a new notification
  createNotification(
    type: Notification['type'],
    title: string,
    message: string,
    category: Notification['category'],
    userId: string = 'default',
    options: {
      actionUrl?: string;
      actionText?: string;
      metadata?: Record<string, any>;
    } = {}
  ): Notification {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      category,
      ...options
    };

    this.notifications.set(notification.id, notification);
    this.notifyListeners(notification);
    
    return notification;
  }

  // Post-related notifications
  createPostNotification(
    type: 'success' | 'error' | 'warning',
    title: string,
    message: string,
    userId: string = 'default',
    metadata: {
      platform?: string;
      postId?: string;
      scheduledTime?: string;
    } = {}
  ): Notification {
    return this.createNotification(
      type,
      title,
      message,
      'post',
      userId,
      {
        actionUrl: metadata.postId ? `/dashboard/content/${metadata.postId}` : '/dashboard/content',
        actionText: 'View Post',
        metadata
      }
    );
  }

  // OAuth-related notifications
  createOAuthNotification(
    type: 'success' | 'error' | 'warning',
    title: string,
    message: string,
    userId: string = 'default',
    metadata: {
      platform?: string;
      action?: 'connect' | 'disconnect' | 'refresh';
    } = {}
  ): Notification {
    return this.createNotification(
      type,
      title,
      message,
      'oauth',
      userId,
      {
        actionUrl: '/dashboard/settings',
        actionText: 'Manage Connections',
        metadata
      }
    );
  }

  // System-related notifications
  createSystemNotification(
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    userId: string = 'default',
    metadata: Record<string, any> = {}
  ): Notification {
    return this.createNotification(
      type,
      title,
      message,
      'system',
      userId,
      {
        actionUrl: '/dashboard',
        actionText: 'View Dashboard',
        metadata
      }
    );
  }

  // Scheduled post notifications
  createScheduledNotification(
    type: 'success' | 'warning' | 'info',
    title: string,
    message: string,
    userId: string = 'default',
    metadata: {
      scheduledTime?: string;
      postId?: string;
      platform?: string;
    } = {}
  ): Notification {
    return this.createNotification(
      type,
      title,
      message,
      'scheduled',
      userId,
      {
        actionUrl: metadata.postId ? `/dashboard/content/${metadata.postId}` : '/dashboard/content',
        actionText: 'View Schedule',
        metadata
      }
    );
  }

  // Get notifications for a user
  getNotifications(userId: string = 'default', options: {
    unreadOnly?: boolean;
    category?: Notification['category'];
    limit?: number;
    offset?: number;
  } = {}): Notification[] {
    let notifications = Array.from(this.notifications.values())
      .filter(notif => notif.category === options.category || !options.category);

    if (options.unreadOnly) {
      notifications = notifications.filter(notif => !notif.read);
    }

    // Sort by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply pagination
    if (options.offset) {
      notifications = notifications.slice(options.offset);
    }
    if (options.limit) {
      notifications = notifications.slice(0, options.limit);
    }

    return notifications;
  }

  // Mark notification as read
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  // Mark all notifications as read for a user
  markAllAsRead(userId: string = 'default'): number {
    let count = 0;
    this.notifications.forEach(notification => {
      if (!notification.read) {
        notification.read = true;
        count++;
      }
    });
    return count;
  }

  // Delete notification
  deleteNotification(notificationId: string): boolean {
    return this.notifications.delete(notificationId);
  }

  // Get unread count for a user
  getUnreadCount(userId: string = 'default', category?: Notification['category']): number {
    return this.getNotifications(userId, { unreadOnly: true, category }).length;
  }

  // Set notification preferences
  setPreferences(userId: string, preferences: Partial<NotificationPreferences>): void {
    const existing = this.preferences.get(userId) || this.preferences.get('default')!;
    this.preferences.set(userId, { ...existing, ...preferences });
  }

  // Get notification preferences
  getPreferences(userId: string = 'default'): NotificationPreferences {
    return this.preferences.get(userId) || this.preferences.get('default')!;
  }

  // Subscribe to notifications
  subscribe(listener: (notification: Notification) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  private notifyListeners(notification: Notification): void {
    this.listeners.forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('Notification listener error:', error);
      }
    });
  }

  // Predefined notification templates
  static readonly TEMPLATES = {
    POST_SUCCESS: (platform: string, postId?: string) => ({
      title: 'Post Published Successfully!',
      message: `Your post has been published to ${platform}`,
      metadata: { platform, postId }
    }),
    POST_ERROR: (platform: string, error: string) => ({
      title: 'Post Failed',
      message: `Failed to publish to ${platform}: ${error}`,
      metadata: { platform, error }
    }),
    OAUTH_CONNECTED: (platform: string) => ({
      title: 'Account Connected',
      message: `Successfully connected to ${platform}`,
      metadata: { platform, action: 'connect' }
    }),
    OAUTH_DISCONNECTED: (platform: string) => ({
      title: 'Account Disconnected',
      message: `Disconnected from ${platform}`,
      metadata: { platform, action: 'disconnect' }
    }),
    SCHEDULED_REMINDER: (platform: string, scheduledTime: string) => ({
      title: 'Post Scheduled',
      message: `Post scheduled for ${platform} at ${scheduledTime}`,
      metadata: { platform, scheduledTime }
    }),
    SYSTEM_UPDATE: (version: string) => ({
      title: 'System Update',
      message: `CreatorFlow has been updated to version ${version}`,
      metadata: { version }
    })
  };
}
