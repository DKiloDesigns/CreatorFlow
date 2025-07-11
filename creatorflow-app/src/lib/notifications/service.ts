import { NotificationManager } from './manager';
import { monitoring } from '@/lib/monitoring';
import { 
  NotificationType, 
  NotificationSeverity, 
  NotificationCategory,
  NotificationChannel,
  NotificationPriority 
} from './types';

export class NotificationService {
  private manager: NotificationManager;

  constructor() {
    this.manager = NotificationManager.getInstance();
  }

  /**
   * Send system maintenance notification
   */
  async sendMaintenanceNotification(
    userId: string,
    maintenanceDate: string,
    startTime: string,
    endTime: string
  ): Promise<void> {
    try {
      await this.manager.createNotificationFromTemplate(
        userId,
        'system_maintenance',
        {
          date: maintenanceDate,
          startTime,
          endTime,
        },
        {
          channels: ['in_app', 'email'],
          priority: 'normal',
        }
      );

      monitoring.info('Maintenance notification sent', {
        userId,
        maintenanceDate,
        startTime,
        endTime,
      });
    } catch (error) {
      monitoring.error('Failed to send maintenance notification', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send security alert for unusual login
   */
  async sendSecurityAlert(
    userId: string,
    location: string,
    time: string
  ): Promise<void> {
    try {
      await this.manager.createNotificationFromTemplate(
        userId,
        'security_login_attempt',
        {
          location,
          time,
        },
        {
          channels: ['in_app', 'email', 'push'],
          priority: 'high',
        }
      );

      monitoring.info('Security alert sent', {
        userId,
        location,
        time,
      });
    } catch (error) {
      monitoring.error('Failed to send security alert', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send performance alert
   */
  async sendPerformanceAlert(userId: string): Promise<void> {
    try {
      await this.manager.createNotificationFromTemplate(
        userId,
        'performance_slow_response',
        {},
        {
          channels: ['in_app'],
          priority: 'normal',
        }
      );

      monitoring.info('Performance alert sent', {
        userId,
      });
    } catch (error) {
      monitoring.error('Failed to send performance alert', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send scheduled post notification
   */
  async sendScheduledPostNotification(
    userId: string,
    postTitle: string,
    platform: string,
    scheduledTime: string
  ): Promise<void> {
    try {
      await this.manager.createNotificationFromTemplate(
        userId,
        'content_scheduled_post',
        {
          title: postTitle,
          platform,
          scheduledTime,
        },
        {
          channels: ['in_app', 'email'],
          priority: 'normal',
        }
      );

      monitoring.info('Scheduled post notification sent', {
        userId,
        postTitle,
        platform,
        scheduledTime,
      });
    } catch (error) {
      monitoring.error('Failed to send scheduled post notification', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send subscription expiry notification
   */
  async sendSubscriptionExpiryNotification(
    userId: string,
    plan: string,
    expiryDate: string
  ): Promise<void> {
    try {
      await this.manager.createNotificationFromTemplate(
        userId,
        'billing_subscription_expiring',
        {
          plan,
          expiryDate,
        },
        {
          channels: ['in_app', 'email', 'push'],
          priority: 'high',
        }
      );

      monitoring.info('Subscription expiry notification sent', {
        userId,
        plan,
        expiryDate,
      });
    } catch (error) {
      monitoring.error('Failed to send subscription expiry notification', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send analytics milestone notification
   */
  async sendAnalyticsMilestoneNotification(
    userId: string,
    milestone: string,
    metric: string,
    platform: string
  ): Promise<void> {
    try {
      await this.manager.createNotificationFromTemplate(
        userId,
        'analytics_milestone',
        {
          milestone,
          metric,
          platform,
        },
        {
          channels: ['in_app', 'email'],
          priority: 'low',
        }
      );

      monitoring.info('Analytics milestone notification sent', {
        userId,
        milestone,
        metric,
        platform,
      });
    } catch (error) {
      monitoring.error('Failed to send analytics milestone notification', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send team invitation notification
   */
  async sendTeamInvitationNotification(
    userId: string,
    inviterName: string,
    teamName: string
  ): Promise<void> {
    try {
      await this.manager.createNotificationFromTemplate(
        userId,
        'team_invitation',
        {
          inviterName,
          teamName,
        },
        {
          channels: ['in_app', 'email'],
          priority: 'normal',
        }
      );

      monitoring.info('Team invitation notification sent', {
        userId,
        inviterName,
        teamName,
      });
    } catch (error) {
      monitoring.error('Failed to send team invitation notification', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send feature announcement notification
   */
  async sendFeatureAnnouncementNotification(
    userId: string,
    featureName: string,
    benefit: string
  ): Promise<void> {
    try {
      await this.manager.createNotificationFromTemplate(
        userId,
        'feature_announcement',
        {
          featureName,
          benefit,
        },
        {
          channels: ['in_app', 'email'],
          priority: 'normal',
        }
      );

      monitoring.info('Feature announcement notification sent', {
        userId,
        featureName,
        benefit,
      });
    } catch (error) {
      monitoring.error('Failed to send feature announcement notification', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send custom notification
   */
  async sendCustomNotification(
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
  ): Promise<void> {
    try {
      await this.manager.createNotification(
        userId,
        type,
        title,
        message,
        options
      );

      monitoring.info('Custom notification sent', {
        userId,
        type,
        title,
        severity: options.severity || 'info',
        category: options.category || 'system',
      });
    } catch (error) {
      monitoring.error('Failed to send custom notification', {
        userId,
        type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send notification to all users
   */
  async sendToAllUsers(
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
  ): Promise<void> {
    try {
      // Get all active users
      const users = await this.manager['prisma'].user.findMany({
        where: { deactivated: false },
        select: { id: true },
      });

      const userIds = users.map(user => user.id);

      await this.manager.createBatchNotification(
        userIds,
        type,
        title,
        message,
        options
      );

      monitoring.info('Notification sent to all users', {
        type,
        title,
        userCount: userIds.length,
        severity: options.severity || 'info',
        category: options.category || 'system',
      });
    } catch (error) {
      monitoring.error('Failed to send notification to all users', {
        type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send notification to premium users only
   */
  async sendToPremiumUsers(
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
  ): Promise<void> {
    try {
      // Get premium users
      const users = await this.manager['prisma'].user.findMany({
        where: { 
          deactivated: false,
          plan: { not: 'FREE' },
        },
        select: { id: true },
      });

      const userIds = users.map(user => user.id);

      await this.manager.createBatchNotification(
        userIds,
        type,
        title,
        message,
        options
      );

      monitoring.info('Notification sent to premium users', {
        type,
        title,
        userCount: userIds.length,
        severity: options.severity || 'info',
        category: options.category || 'system',
      });
    } catch (error) {
      monitoring.error('Failed to send notification to premium users', {
        type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Send notification to admins only
   */
  async sendToAdmins(
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
  ): Promise<void> {
    try {
      // Get admin users
      const users = await this.manager['prisma'].user.findMany({
        where: { 
          deactivated: false,
          role: 'ADMIN',
        },
        select: { id: true },
      });

      const userIds = users.map(user => user.id);

      await this.manager.createBatchNotification(
        userIds,
        type,
        title,
        message,
        options
      );

      monitoring.info('Notification sent to admins', {
        type,
        title,
        userCount: userIds.length,
        severity: options.severity || 'info',
        category: options.category || 'system',
      });
    } catch (error) {
      monitoring.error('Failed to send notification to admins', {
        type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
} 