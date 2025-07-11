export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  metadata: Record<string, any>;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
  actionUrl?: string;
  actionText?: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  defaultChannels: NotificationChannel[];
  defaultPriority: NotificationPriority;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  global: {
    enabled: boolean;
    channels: NotificationChannel[];
    quietHours: {
      enabled: boolean;
      start: string; // HH:mm format
      end: string; // HH:mm format
      timezone: string;
    };
  };
  types: Record<NotificationType, {
    enabled: boolean;
    channels: NotificationChannel[];
    priority: NotificationPriority;
  }>;
  categories: Record<NotificationCategory, {
    enabled: boolean;
    channels: NotificationChannel[];
    priority: NotificationPriority;
  }>;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<NotificationCategory, number>;
  bySeverity: Record<NotificationSeverity, number>;
  recentActivity: {
    sent: number;
    read: number;
    clicked: number;
  };
}

export type NotificationType = 
  | 'system_alert'
  | 'security_alert'
  | 'performance_alert'
  | 'content_alert'
  | 'billing_alert'
  | 'team_invitation'
  | 'content_approval'
  | 'analytics_insight'
  | 'scheduled_post'
  | 'engagement_milestone'
  | 'platform_update'
  | 'maintenance_notice'
  | 'feature_announcement'
  | 'feedback_response'
  | 'collaboration_request'
  | 'data_export_ready'
  | 'api_rate_limit'
  | 'storage_warning'
  | 'subscription_expiry'
  | 'trial_ending';

export type NotificationSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type NotificationCategory = 
  | 'system'
  | 'security'
  | 'performance'
  | 'content'
  | 'billing'
  | 'team'
  | 'analytics'
  | 'platform'
  | 'maintenance'
  | 'feature'
  | 'feedback'
  | 'collaboration'
  | 'data'
  | 'api'
  | 'storage'
  | 'subscription';

export type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms' | 'webhook';

export type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface NotificationAction {
  id: string;
  notificationId: string;
  type: 'click' | 'dismiss' | 'snooze' | 'custom';
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface NotificationDelivery {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'opened';
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface NotificationBatch {
  id: string;
  name: string;
  description?: string;
  notifications: Omit<Notification, 'id' | 'userId' | 'createdAt' | 'read'>[];
  targetUsers: string[] | 'all' | 'admins' | 'premium';
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  createdAt: Date;
  sentAt?: Date;
  metadata?: Record<string, any>;
}

export interface NotificationSettings {
  userId: string;
  preferences: NotificationPreferences;
  stats: NotificationStats;
  lastReadAt?: Date;
  lastNotificationAt?: Date;
  updatedAt: Date;
}

// Notification templates for common scenarios
export const NOTIFICATION_TEMPLATES: Record<string, Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>> = {
  // System alerts
  system_maintenance: {
    name: 'System Maintenance',
    type: 'system_alert',
    title: 'Scheduled Maintenance',
    message: 'System maintenance is scheduled for {date} from {startTime} to {endTime}. Some features may be temporarily unavailable.',
    severity: 'medium',
    category: 'maintenance',
    defaultChannels: ['in_app', 'email'],
    defaultPriority: 'normal',
    variables: ['date', 'startTime', 'endTime'],
    isActive: true,
  },

  // Security alerts
  security_login_attempt: {
    name: 'Unusual Login Attempt',
    type: 'security_alert',
    title: 'Unusual Login Attempt Detected',
    message: 'We detected a login attempt from {location} at {time}. If this wasn\'t you, please secure your account.',
    severity: 'high',
    category: 'security',
    defaultChannels: ['in_app', 'email', 'push'],
    defaultPriority: 'high',
    variables: ['location', 'time'],
    isActive: true,
  },

  // Performance alerts
  performance_slow_response: {
    name: 'Performance Issue Detected',
    type: 'performance_alert',
    title: 'Performance Issue Detected',
    message: 'We detected slower than usual response times. Our team is investigating and working to resolve this.',
    severity: 'medium',
    category: 'performance',
    defaultChannels: ['in_app'],
    defaultPriority: 'normal',
    variables: [],
    isActive: true,
  },

  // Content alerts
  content_scheduled_post: {
    name: 'Scheduled Post Reminder',
    type: 'scheduled_post',
    title: 'Post Scheduled Successfully',
    message: 'Your post "{title}" has been scheduled for {platform} at {scheduledTime}.',
    severity: 'info',
    category: 'content',
    defaultChannels: ['in_app', 'email'],
    defaultPriority: 'normal',
    variables: ['title', 'platform', 'scheduledTime'],
    isActive: true,
  },

  // Billing alerts
  billing_subscription_expiring: {
    name: 'Subscription Expiring',
    type: 'subscription_expiry',
    title: 'Subscription Expiring Soon',
    message: 'Your {plan} subscription expires on {expiryDate}. Renew to continue enjoying all features.',
    severity: 'high',
    category: 'billing',
    defaultChannels: ['in_app', 'email', 'push'],
    defaultPriority: 'high',
    variables: ['plan', 'expiryDate'],
    isActive: true,
  },

  // Analytics insights
  analytics_milestone: {
    name: 'Analytics Milestone',
    type: 'analytics_insight',
    title: 'Congratulations! You\'ve reached a milestone',
    message: 'You\'ve achieved {milestone} with {metric} on {platform}. Keep up the great work!',
    severity: 'info',
    category: 'analytics',
    defaultChannels: ['in_app', 'email'],
    defaultPriority: 'normal',
    variables: ['milestone', 'metric', 'platform'],
    isActive: true,
  },

  // Team notifications
  team_invitation: {
    name: 'Team Invitation',
    type: 'team_invitation',
    title: 'You\'ve been invited to join a team',
    message: '{inviterName} has invited you to join the team "{teamName}". Click to accept or decline.',
    severity: 'medium',
    category: 'team',
    defaultChannels: ['in_app', 'email'],
    defaultPriority: 'normal',
    variables: ['inviterName', 'teamName'],
    isActive: true,
  },

  // Feature announcements
  feature_announcement: {
    name: 'New Feature Available',
    type: 'feature_announcement',
    title: 'New Feature: {featureName}',
    message: 'We\'ve added {featureName} to help you {benefit}. Try it out now!',
    severity: 'info',
    category: 'feature',
    defaultChannels: ['in_app', 'email'],
    defaultPriority: 'normal',
    variables: ['featureName', 'benefit'],
    isActive: true,
  },
};

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  global: {
    enabled: true,
    channels: ['in_app', 'email'],
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
      timezone: 'UTC',
    },
  },
  types: {
    system_alert: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    security_alert: { enabled: true, channels: ['in_app', 'email', 'push'], priority: 'high' },
    performance_alert: { enabled: true, channels: ['in_app'], priority: 'normal' },
    content_alert: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    billing_alert: { enabled: true, channels: ['in_app', 'email', 'push'], priority: 'high' },
    team_invitation: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    content_approval: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    analytics_insight: { enabled: true, channels: ['in_app', 'email'], priority: 'low' },
    scheduled_post: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    engagement_milestone: { enabled: true, channels: ['in_app', 'email'], priority: 'low' },
    platform_update: { enabled: true, channels: ['in_app'], priority: 'normal' },
    maintenance_notice: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    feature_announcement: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    feedback_response: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    collaboration_request: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    data_export_ready: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    api_rate_limit: { enabled: true, channels: ['in_app'], priority: 'high' },
    storage_warning: { enabled: true, channels: ['in_app', 'email'], priority: 'medium' },
    subscription_expiry: { enabled: true, channels: ['in_app', 'email', 'push'], priority: 'high' },
    trial_ending: { enabled: true, channels: ['in_app', 'email', 'push'], priority: 'high' },
  },
  categories: {
    system: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    security: { enabled: true, channels: ['in_app', 'email', 'push'], priority: 'high' },
    performance: { enabled: true, channels: ['in_app'], priority: 'normal' },
    content: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    billing: { enabled: true, channels: ['in_app', 'email', 'push'], priority: 'high' },
    team: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    analytics: { enabled: true, channels: ['in_app', 'email'], priority: 'low' },
    platform: { enabled: true, channels: ['in_app'], priority: 'normal' },
    maintenance: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    feature: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    feedback: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    collaboration: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    data: { enabled: true, channels: ['in_app', 'email'], priority: 'normal' },
    api: { enabled: true, channels: ['in_app'], priority: 'high' },
    storage: { enabled: true, channels: ['in_app', 'email'], priority: 'medium' },
    subscription: { enabled: true, channels: ['in_app', 'email', 'push'], priority: 'high' },
  },
}; 