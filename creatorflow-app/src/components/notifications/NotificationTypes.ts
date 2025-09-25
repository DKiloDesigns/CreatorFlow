// Notification Types and Interfaces

export type NotificationType = 
  | 'system'
  | 'social' 
  | 'marketing'
  | 'reminder'
  | 'achievement'
  | 'collaboration'
  | 'analytics'
  | 'tool_update';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationStatus = 'unread' | 'read' | 'archived' | 'dismissed';

export interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  icon?: string;
  action: () => void;
}

export interface NotificationData {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  description?: string;
  image?: string;
  avatar?: string;
  timestamp: Date;
  readAt?: Date;
  expiresAt?: Date;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  groupId?: string;
  relatedNotifications?: string[];
}

export interface NotificationGroup {
  id: string;
  type: NotificationType;
  title: string;
  count: number;
  latestNotification: NotificationData;
  notifications: NotificationData[];
  isCollapsed: boolean;
}

// Notification type configurations
export const NOTIFICATION_TYPE_CONFIG = {
  system: {
    color: '#6366f1',
    icon: 'Settings',
    bgColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
    label: 'System'
  },
  social: {
    color: '#10b981',
    icon: 'Users',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    label: 'Social'
  },
  marketing: {
    color: '#f59e0b',
    icon: 'Megaphone',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    label: 'Marketing'
  },
  reminder: {
    color: '#8b5cf6',
    icon: 'Clock',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    label: 'Reminder'
  },
  achievement: {
    color: '#f97316',
    icon: 'Trophy',
    bgColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.2)',
    label: 'Achievement'
  },
  collaboration: {
    color: '#06b6d4',
    icon: 'Handshake',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.2)',
    label: 'Collaboration'
  },
  analytics: {
    color: '#84cc16',
    icon: 'BarChart3',
    bgColor: 'rgba(132, 204, 22, 0.1)',
    borderColor: 'rgba(132, 204, 22, 0.2)',
    label: 'Analytics'
  },
  tool_update: {
    color: '#ec4899',
    icon: 'Wrench',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.2)',
    label: 'Tool Update'
  }
} as const;

// Priority configurations
export const NOTIFICATION_PRIORITY_CONFIG = {
  low: {
    color: '#6b7280',
    icon: 'ChevronDown',
    label: 'Low'
  },
  medium: {
    color: '#f59e0b',
    icon: 'Minus',
    label: 'Medium'
  },
  high: {
    color: '#ef4444',
    icon: 'ChevronUp',
    label: 'High'
  },
  urgent: {
    color: '#dc2626',
    icon: 'AlertTriangle',
    label: 'Urgent'
  }
} as const;

// Sample notification data
export const SAMPLE_NOTIFICATIONS: NotificationData[] = [] as any; /* [
  {
    id: '1',
    type: 'achievement',
    priority: 'high',
    status: 'unread',
    title: '🎉 New Achievement Unlocked!',
    message: 'You\'ve reached 100 posts this month!',
    description: 'Keep up the great work! Your content is performing exceptionally well.',
    image: '/images/achievements/100-posts.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    actions: [
      {
        id: 'view',
        label: 'View Achievement',
        type: 'primary',
        icon: 'Eye',
        action: () => console.log('View achievement')
      },
      {
        id: 'share',
        label: 'Share',
        type: 'secondary',
        icon: 'Share',
        action: () => console.log('Share achievement')
      }
    ],
    metadata: {
      achievementId: '100-posts',
      points: 100,
      category: 'content'
    }
  },
  {
    id: '2',
    type: 'social',
    priority: 'medium',
    status: 'unread',
    title: 'New Follower',
    message: 'Sarah Johnson started following you',
    description: 'Sarah is a content creator in the tech space. You might want to connect!',
    avatar: '/images/avatars/sarah-johnson.jpg',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    actions: [
      {
        id: 'follow_back',
        label: 'Follow Back',
        type: 'primary',
        icon: 'UserPlus',
        action: () => console.log('Follow back')
      },
      {
        id: 'view_profile',
        label: 'View Profile',
        type: 'secondary',
        icon: 'User',
        action: () => console.log('View profile')
      }
    ],
    metadata: {
      followerId: 'sarah-johnson',
      followerName: 'Sarah Johnson',
      followerBio: 'Tech Content Creator'
    }
  },
  {
    id: '3',
    type: 'analytics',
    priority: 'medium',
    status: 'unread',
    title: 'Weekly Analytics Report',
    message: 'Your posts gained 2.5K new views this week',
    description: 'That\'s a 15% increase from last week! Your engagement rate is up 8%.',
    image: '/images/analytics/weekly-report.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    actions: [
      {
        id: 'view_report',
        label: 'View Full Report',
        type: 'primary',
        icon: 'BarChart3',
        action: () => console.log('View report')
      },
      {
        id: 'export',
        label: 'Export Data',
        type: 'secondary',
        icon: 'Download',
        action: () => console.log('Export data')
      }
    ],
    metadata: {
      reportId: 'weekly-2024-01',
      views: 2500,
      engagementRate: 8.2,
      period: 'week'
    }
  },
  {
    id: '4',
    type: 'tool_update',
    priority: 'low',
    status: 'unread',
    title: 'New Tool Available',
    message: 'Content Predictor tool has been updated',
    description: 'New AI features added: trend prediction, hashtag suggestions, and optimal posting times.',
    image: '/images/tools/content-predictor.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    actions: [
      {
        id: 'try_tool',
        label: 'Try Tool',
        type: 'primary',
        icon: 'Play',
        action: () => console.log('Try tool')
      },
      {
        id: 'learn_more',
        label: 'Learn More',
        type: 'secondary',
        icon: 'Info',
        action: () => console.log('Learn more')
      }
    ],
    metadata: {
      toolId: 'content-predictor',
      version: '2.1.0',
      features: ['trend-prediction', 'hashtag-suggestions', 'optimal-timing']
    }
  },
  {
    id: '5',
    type: 'reminder',
    priority: 'high',
    status: 'unread',
    title: 'Content Due Soon',
    message: 'Your Instagram post is scheduled in 2 hours',
    description: 'Don\'t forget to review and publish your content for maximum engagement.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    actions: [
      {
        id: 'review',
        label: 'Review Content',
        type: 'primary',
        icon: 'Edit',
        action: () => console.log('Review content')
      },
      {
        id: 'reschedule',
        label: 'Reschedule',
        type: 'secondary',
        icon: 'Calendar',
        action: () => console.log('Reschedule')
      }
    ],
    metadata: {
      postId: 'instagram-post-123',
      platform: 'instagram',
      scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 2)
    }
  },
  {
    id: '6',
    type: 'collaboration',
    priority: 'medium',
    status: 'unread',
    title: 'Collaboration Invite',
    message: 'TechBrand wants to collaborate on a campaign',
    description: 'They\'re looking for content creators to promote their new product launch.',
    avatar: '/images/brands/techbrand-logo.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    actions: [
      {
        id: 'accept',
        label: 'Accept',
        type: 'primary',
        icon: 'Check',
        action: () => console.log('Accept collaboration')
      },
      {
        id: 'decline',
        label: 'Decline',
        type: 'danger',
        icon: 'X',
        action: () => console.log('Decline collaboration')
      },
      {
        id: 'view_details',
        label: 'View Details',
        type: 'secondary',
        icon: 'Info',
        action: () => console.log('View details')
      }
    ],
    metadata: {
      brandId: 'techbrand',
      brandName: 'TechBrand',
      campaignId: 'product-launch-2024',
      budget: '$5000',
      duration: '2 weeks'
    }
  }
]; */

// Utility functions
export const formatNotificationTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return timestamp.toLocaleDateString();
};

export const getNotificationTypeConfig = (type: NotificationType) => {
  return NOTIFICATION_TYPE_CONFIG[type];
};

export const getNotificationPriorityConfig = (priority: NotificationPriority) => {
  return NOTIFICATION_PRIORITY_CONFIG[priority];
};

export const groupNotifications = (notifications: NotificationData[]): NotificationGroup[] => {
  const groups = new Map<string, NotificationGroup>();
  
  notifications.forEach(notification => {
    const groupKey = notification.groupId || notification.type;
    
    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        id: groupKey,
        type: notification.type,
        title: getNotificationTypeConfig(notification.type).label,
        count: 0,
        latestNotification: notification,
        notifications: [],
        isCollapsed: false
      });
    }
    
    const group = groups.get(groupKey)!;
    group.count++;
    group.notifications.push(notification);
    
    // Update latest notification if this one is newer
    if (notification.timestamp > group.latestNotification.timestamp) {
      group.latestNotification = notification;
    }
  });
  
  return Array.from(groups.values()).sort((a, b) => 
    b.latestNotification.timestamp.getTime() - a.latestNotification.timestamp.getTime()
  );
};
