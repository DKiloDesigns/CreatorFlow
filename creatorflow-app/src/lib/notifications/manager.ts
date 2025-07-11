import { prisma } from '@/lib/prisma';
import { monitoring } from '@/lib/monitoring';
import { 
  Notification, 
  NotificationType, 
  NotificationSeverity, 
  NotificationCategory, 
  NotificationChannel, 
  NotificationPriority,
  NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_TEMPLATES
} from './types';

export class NotificationManager {
  private static instance: NotificationManager;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Create and send a notification to a single user
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options: {
      severity?: NotificationSeverity;
      category?: NotificationCategory;
      channels?: NotificationChannel[];
      priority?: NotificationPriority;
      metadata?: Record<string, any>;
      actionUrl?: string;
      actionText?: string;
      expiresAt?: Date;
    } = {}
  ): Promise<Notification> {
    const {
      severity = 'info',
      category = 'system',
      channels = ['in_app'],
      priority = 'normal',
      metadata = {},
      actionUrl,
      actionText,
      expiresAt,
    } = options;

    // Get user's notification preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true }
    });

    let preferences: NotificationPreferences = DEFAULT_NOTIFICATION_PREFERENCES;
    if (user?.notificationPreferences && typeof user.notificationPreferences === 'object' && 'global' in user.notificationPreferences) {
      preferences = user.notificationPreferences as unknown as NotificationPreferences;
    }

    // Check if notifications are globally enabled
    if (!preferences.global.enabled) {
      throw new Error('Notifications are disabled for this user');
    }

    // Check if this notification type is enabled
    const typePrefs = preferences.types[type];
    if (!typePrefs?.enabled) {
      throw new Error(`Notification type ${type} is disabled for this user`);
    }

    // Determine final channels based on user preferences
    const finalChannels = channels.filter(channel => 
      typePrefs.channels.includes(channel) && 
      preferences.global.channels.includes(channel)
    );

    if (finalChannels.length === 0) {
      throw new Error('No enabled channels for this notification');
    }

    // Check quiet hours
    if (this.isInQuietHours(preferences)) {
      // Only allow critical notifications during quiet hours
      if (severity !== 'critical') {
        throw new Error('Notification blocked by quiet hours');
      }
    }

    // Create the notification
    const dbNotification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        severity,
        category,
        metadata,
        channels: finalChannels,
        priority,
        actionUrl,
        actionText,
        expiresAt,
        read: false,
      },
    });

    // Convert Prisma notification to our custom type
    const notification: Notification = {
      id: dbNotification.id,
      userId: dbNotification.userId,
      type: dbNotification.type as NotificationType,
      title: dbNotification.title,
      message: dbNotification.message,
      severity: dbNotification.severity as NotificationSeverity,
      category: dbNotification.category as NotificationCategory,
      metadata: dbNotification.metadata as Record<string, any>,
      channels: dbNotification.channels as NotificationChannel[],
      priority: dbNotification.priority as NotificationPriority,
      read: dbNotification.read,
      createdAt: dbNotification.createdAt,
      actionUrl: dbNotification.actionUrl || undefined,
      actionText: dbNotification.actionText || undefined,
      expiresAt: dbNotification.expiresAt || undefined,
    };

    // Send notifications through enabled channels
    await this.sendNotification(notification, finalChannels);

    monitoring.info('Notification created', {
      notificationId: notification.id,
      userId,
      type,
      severity,
      category,
      channels: finalChannels,
    });

    return notification;
  }

  /**
   * Create and send notifications to multiple users
   */
  async createBatchNotification(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    options: {
      severity?: NotificationSeverity;
      category?: NotificationCategory;
      channels?: NotificationChannel[];
      priority?: NotificationPriority;
      metadata?: Record<string, any>;
      actionUrl?: string;
      actionText?: string;
      expiresAt?: Date;
    } = {}
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for (const userId of userIds) {
      try {
        const notification = await this.createNotification(userId, type, title, message, options);
        notifications.push(notification);
      } catch (error) {
        monitoring.error('Failed to create notification for user', {
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return notifications;
  }

  /**
   * Create notification from template
   */
  async createNotificationFromTemplate(
    userId: string,
    templateName: string,
    variables: Record<string, any>,
    options: {
      channels?: NotificationChannel[];
      priority?: NotificationPriority;
      metadata?: Record<string, any>;
      actionUrl?: string;
      actionText?: string;
      expiresAt?: Date;
    } = {}
  ): Promise<Notification> {
    const template = NOTIFICATION_TEMPLATES[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    if (!template.isActive) {
      throw new Error(`Template ${templateName} is not active`);
    }

    // Replace variables in title and message
    let title = template.title;
    let message = template.message;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      title = title.replace(new RegExp(placeholder, 'g'), String(value));
      message = message.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return this.createNotification(userId, template.type, title, message, {
      severity: template.severity,
      category: template.category,
      channels: options.channels || template.defaultChannels,
      priority: options.priority || template.defaultPriority,
      metadata: { ...(template as any).metadata || {}, ...options.metadata },
      actionUrl: options.actionUrl,
      actionText: options.actionText,
      expiresAt: options.expiresAt,
    });
  }

  /**
   * Send notification through specified channels
   */
  private async sendNotification(
    notification: Notification,
    channels: NotificationChannel[]
  ): Promise<void> {
    const deliveryPromises = channels.map(channel => 
      this.sendToChannel(notification, channel)
    );

    await Promise.allSettled(deliveryPromises);
  }

  /**
   * Send notification to a specific channel
   */
  private async sendToChannel(
    notification: Notification,
    channel: NotificationChannel
  ): Promise<void> {
    try {
      switch (channel) {
        case 'in_app':
          // In-app notifications are already created in the database
          // Real-time delivery is handled by WebSocket
          await this.deliverInApp(notification);
          break;

        case 'email':
          await this.deliverEmail(notification);
          break;

        case 'push':
          await this.deliverPush(notification);
          break;

        case 'sms':
          await this.deliverSMS(notification);
          break;

        case 'webhook':
          await this.deliverWebhook(notification);
          break;

        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }

      // Record successful delivery
      await this.recordDelivery(notification.id, channel, 'delivered');

    } catch (error) {
      monitoring.error('Failed to deliver notification', {
        notificationId: notification.id,
        channel,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Record failed delivery
      await this.recordDelivery(notification.id, channel, 'failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Deliver in-app notification (WebSocket)
   */
  private async deliverInApp(notification: Notification): Promise<void> {
    // This would typically emit to a WebSocket server
    // For now, we'll just log it
    monitoring.info('In-app notification delivered', {
      notificationId: notification.id,
      userId: notification.userId,
    });
  }

  /**
   * Deliver email notification
   */
  private async deliverEmail(notification: Notification): Promise<void> {
    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: notification.userId },
      select: { email: true, name: true }
    });

    if (!user?.email) {
      throw new Error('User email not found');
    }

    // Send email using your email service
    // This is a placeholder - implement with your email service
    monitoring.info('Email notification sent', {
      notificationId: notification.id,
      email: user.email,
    });
  }

  /**
   * Deliver push notification
   */
  private async deliverPush(notification: Notification): Promise<void> {
    // This would typically use a push notification service
    // For now, we'll just log it
    monitoring.info('Push notification sent', {
      notificationId: notification.id,
      userId: notification.userId,
    });
  }

  /**
   * Deliver SMS notification
   */
  private async deliverSMS(notification: Notification): Promise<void> {
    // This would typically use an SMS service
    // For now, we'll just log it
    monitoring.info('SMS notification sent', {
      notificationId: notification.id,
      userId: notification.userId,
    });
  }

  /**
   * Deliver webhook notification
   */
  private async deliverWebhook(notification: Notification): Promise<void> {
    // This would typically send to a configured webhook URL
    // For now, we'll just log it
    monitoring.info('Webhook notification sent', {
      notificationId: notification.id,
      userId: notification.userId,
    });
  }

  /**
   * Record notification delivery
   */
  private async recordDelivery(
    notificationId: string,
    channel: NotificationChannel,
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'opened',
    metadata?: Record<string, any>
  ): Promise<void> {
    // This would typically record in a delivery tracking table
    // For now, we'll just log it
    monitoring.info('Notification delivery recorded', {
      notificationId,
      channel,
      status,
      metadata,
    });
  }

  /**
   * Check if current time is in quiet hours
   */
  private isInQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.global.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: preferences.global.quietHours.timezone 
    });

    const start = preferences.global.quietHours.start;
    const end = preferences.global.quietHours.end;

    // Simple time comparison (assumes 24-hour format)
    return currentTime >= start || currentTime <= end;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.update({
      where: { 
        id: notificationId,
        userId, // Ensure user owns this notification
      },
      data: { 
        read: true,
      },
    });

    monitoring.info('Notification marked as read', {
      notificationId,
      userId,
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { 
        userId,
        read: false,
      },
      data: { 
        read: true,
      },
    });

    monitoring.info('All notifications marked as read', {
      userId,
    });
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.delete({
      where: { 
        id: notificationId,
        userId, // Ensure user owns this notification
      },
    });

    monitoring.info('Notification deleted', {
      notificationId,
      userId,
    });
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
      type?: NotificationType;
      category?: NotificationCategory;
    } = {}
  ): Promise<{ notifications: Notification[]; total: number }> {
    const {
      limit = 50,
      offset = 0,
      unreadOnly = false,
      type,
      category,
    } = options;

    const where: any = { userId };

    if (unreadOnly) {
      where.read = false;
    }

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    const [dbNotifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
    ]);

    // Map Prisma notifications to custom Notification type
    const notifications: Notification[] = dbNotifications.map((n) => ({
      id: n.id,
      userId: n.userId,
      type: n.type as NotificationType,
      title: n.title,
      message: n.message,
      severity: n.severity as NotificationSeverity,
      category: n.category as NotificationCategory,
      metadata: n.metadata as Record<string, any>,
      channels: n.channels as NotificationChannel[],
      priority: n.priority as NotificationPriority,
      read: n.read,
      createdAt: n.createdAt,
      actionUrl: n.actionUrl || undefined,
      actionText: n.actionText || undefined,
      expiresAt: n.expiresAt || undefined,
    }));

    return { notifications, total };
  }

  /**
   * Get notification statistics for a user
   */
  async getUserNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
    byCategory: Record<NotificationCategory, number>;
    bySeverity: Record<NotificationSeverity, number>;
  }> {
    const [total, unread, byType, byCategory, bySeverity] = await Promise.all([
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, read: false } }),
      prisma.notification.groupBy({
        by: ['type'],
        where: { userId },
        _count: { type: true },
      }),
      prisma.notification.groupBy({
        by: ['category'],
        where: { userId },
        _count: { category: true },
      }),
      prisma.notification.groupBy({
        by: ['severity'],
        where: { userId },
        _count: { severity: true },
      }),
    ]);

    return {
      total,
      unread,
      byType: byType.reduce((acc, item) => {
        acc[item.type as NotificationType] = item._count.type;
        return acc;
      }, {} as Record<NotificationType, number>),
      byCategory: byCategory.reduce((acc, item) => {
        acc[item.category as NotificationCategory] = item._count.category;
        return acc;
      }, {} as Record<NotificationCategory, number>),
      bySeverity: bySeverity.reduce((acc, item) => {
        acc[item.severity as NotificationSeverity] = item._count.severity;
        return acc;
      }, {} as Record<NotificationSeverity, number>),
    };
  }

  /**
   * Update user's notification preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true }
    });

    let currentPrefs: NotificationPreferences = DEFAULT_NOTIFICATION_PREFERENCES;
    if (user?.notificationPreferences && typeof user.notificationPreferences === 'object' && 'global' in user.notificationPreferences) {
      currentPrefs = user.notificationPreferences as unknown as NotificationPreferences;
    }
    const updatedPrefs = { ...currentPrefs, ...preferences };

    await prisma.user.update({
      where: { id: userId },
      data: { notificationPreferences: updatedPrefs },
    });

    monitoring.info('Notification preferences updated', {
      userId,
    });
  }

  /**
   * Clean up expired notifications
   */
  async cleanupExpiredNotifications(): Promise<number> {
    const result = await prisma.notification.deleteMany({
      where: {
        expiresAt: {
          not: null,
          lt: new Date(),
        },
      },
    });

    monitoring.info('Expired notifications cleaned up', {
      count: result.count,
    });

    return result.count;
  }
} 