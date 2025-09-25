/**
 * Notification Triggers Service
 * Handles automatic notification creation based on user actions
 */

import { prisma } from '@/lib/prisma';
import { notificationWebSocket } from '@/lib/websocket/notification-server';

export interface NotificationTrigger {
  type: 'post_created' | 'post_scheduled' | 'post_published' | 'post_engagement' | 'tool_used' | 'system_event' | 'message_received' | 'conversation_created' | 'message_reaction';
  userId: string;
  title: string;
  message: string;
  category: 'content' | 'engagement' | 'system' | 'tool' | 'scheduling' | 'messaging';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
  actionUrl?: string;
  actionText?: string;
}

export class NotificationTriggerService {
  /**
   * Create a notification in the database
   */
  private async createNotification(trigger: NotificationTrigger) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: trigger.userId,
          type: trigger.type,
          title: trigger.title,
          message: trigger.message,
          category: trigger.category,
          priority: trigger.priority,
          channels: ['web'], // Default to web notifications
          actionUrl: trigger.actionUrl,
          actionText: trigger.actionText,
          metadata: trigger.metadata || {},
          read: false,
        },
      });

      console.log(`✅ Notification created: ${trigger.type} for user ${trigger.userId}`);
      
      // Send real-time notification via WebSocket
      if (notification) {
        await notificationWebSocket.sendNotificationToUser(trigger.userId, {
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          category: notification.category,
          priority: notification.priority,
          read: notification.read,
          createdAt: notification.createdAt.toISOString(),
          actionUrl: notification.actionUrl,
          actionText: notification.actionText,
          metadata: notification.metadata,
        });
      }
      
      return notification;
    } catch (error) {
      console.error('❌ Failed to create notification:', error);
      return null;
    }
  }

  /**
   * Trigger notification when a post is created
   */
  async onPostCreated(userId: string, postData: {
    id: string;
    contentText?: string;
    platforms: string[];
    status: string;
  }) {
    const platformText = postData.platforms.join(', ');
    const contentPreview = postData.contentText ? 
      (postData.contentText.length > 50 ? 
        postData.contentText.substring(0, 50) + '...' : 
        postData.contentText) : 
      'Media post';

    return this.createNotification({
      type: 'post_created',
      userId,
      title: 'New Post Created',
      message: `"${contentPreview}" scheduled for ${platformText}`,
      category: 'content',
      priority: 'medium',
      metadata: {
        postId: postData.id,
        platforms: postData.platforms,
        status: postData.status,
      },
      actionUrl: `/dashboard/content?post=${postData.id}`,
      actionText: 'View Post',
    });
  }

  /**
   * Trigger notification when a post is scheduled
   */
  async onPostScheduled(userId: string, postData: {
    id: string;
    scheduledAt: Date;
    platforms: string[];
    contentText?: string;
  }) {
    const platformText = postData.platforms.join(', ');
    const scheduledDate = postData.scheduledAt.toLocaleDateString();
    const scheduledTime = postData.scheduledAt.toLocaleTimeString();
    const contentPreview = postData.contentText ? 
      (postData.contentText.length > 30 ? 
        postData.contentText.substring(0, 30) + '...' : 
        postData.contentText) : 
      'Media post';

    return this.createNotification({
      type: 'post_scheduled',
      userId,
      title: 'Post Scheduled',
      message: `"${contentPreview}" scheduled for ${scheduledDate} at ${scheduledTime} on ${platformText}`,
      category: 'scheduling',
      priority: 'medium',
      metadata: {
        postId: postData.id,
        scheduledAt: postData.scheduledAt.toISOString(),
        platforms: postData.platforms,
      },
      actionUrl: `/dashboard/content?post=${postData.id}`,
      actionText: 'View Schedule',
    });
  }

  /**
   * Trigger notification when a post is published
   */
  async onPostPublished(userId: string, postData: {
    id: string;
    platforms: string[];
    contentText?: string;
    publishedAt: Date;
  }) {
    const platformText = postData.platforms.join(', ');
    const contentPreview = postData.contentText ? 
      (postData.contentText.length > 30 ? 
        postData.contentText.substring(0, 30) + '...' : 
        postData.contentText) : 
      'Media post';

    return this.createNotification({
      type: 'post_published',
      userId,
      title: 'Post Published Successfully',
      message: `"${contentPreview}" is now live on ${platformText}`,
      category: 'content',
      priority: 'high',
      metadata: {
        postId: postData.id,
        publishedAt: postData.publishedAt.toISOString(),
        platforms: postData.platforms,
      },
      actionUrl: `/dashboard/content?post=${postData.id}`,
      actionText: 'View Post',
    });
  }

  /**
   * Trigger notification for post engagement
   */
  async onPostEngagement(userId: string, engagementData: {
    postId: string;
    platform: string;
    type: 'like' | 'comment' | 'share' | 'view';
    count: number;
    contentText?: string;
  }) {
    const contentPreview = engagementData.contentText ? 
      (engagementData.contentText.length > 30 ? 
        engagementData.contentText.substring(0, 30) + '...' : 
        engagementData.contentText) : 
      'your post';

    const engagementText = {
      like: engagementData.count === 1 ? 'like' : 'likes',
      comment: engagementData.count === 1 ? 'comment' : 'comments',
      share: engagementData.count === 1 ? 'share' : 'shares',
      view: engagementData.count === 1 ? 'view' : 'views',
    }[engagementData.type];

    return this.createNotification({
      type: 'post_engagement',
      userId,
      title: 'New Engagement',
      message: `${engagementData.count} ${engagementText} on "${contentPreview}" from ${engagementData.platform}`,
      category: 'engagement',
      priority: 'medium',
      metadata: {
        postId: engagementData.postId,
        platform: engagementData.platform,
        engagementType: engagementData.type,
        count: engagementData.count,
      },
      actionUrl: `/dashboard/content?post=${engagementData.postId}`,
      actionText: 'View Analytics',
    });
  }

  /**
   * Trigger notification when a tool is used
   */
  async onToolUsed(userId: string, toolData: {
    toolName: string;
    toolCategory: string;
    result?: string;
  }) {
    return this.createNotification({
      type: 'tool_used',
      userId,
      title: 'Tool Used Successfully',
      message: `You used ${toolData.toolName} in the ${toolData.toolCategory} category`,
      category: 'tool',
      priority: 'low',
      metadata: {
        toolName: toolData.toolName,
        toolCategory: toolData.toolCategory,
        result: toolData.result,
      },
      actionUrl: `/tools/${toolData.toolCategory}`,
      actionText: 'Use Again',
    });
  }

  /**
   * Trigger notification for system events
   */
  async onSystemEvent(userId: string, eventData: {
    eventType: 'maintenance' | 'update' | 'feature' | 'warning' | 'error';
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }) {
    return this.createNotification({
      type: 'system_event',
      userId,
      title: eventData.title,
      message: eventData.message,
      category: 'system',
      priority: eventData.priority || 'medium',
      metadata: {
        eventType: eventData.eventType,
      },
    });
  }

  /**
   * Trigger notification for bulk operations
   */
  async onBulkOperation(userId: string, operationData: {
    operationType: 'bulk_schedule' | 'bulk_publish' | 'bulk_delete';
    count: number;
    platforms: string[];
    successCount: number;
    errorCount?: number;
  }) {
    const platformText = operationData.platforms.join(', ');
    const operationText = {
      bulk_schedule: 'scheduled',
      bulk_publish: 'published',
      bulk_delete: 'deleted',
    }[operationData.operationType];

    let message = `${operationData.successCount} posts ${operationText} on ${platformText}`;
    if (operationData.errorCount && operationData.errorCount > 0) {
      message += ` (${operationData.errorCount} failed)`;
    }

    return this.createNotification({
      type: 'system_event',
      userId,
      title: `Bulk ${operationData.operationType.replace('bulk_', '').charAt(0).toUpperCase() + operationData.operationType.replace('bulk_', '').slice(1)} Complete`,
      message,
      category: 'system',
      priority: operationData.errorCount && operationData.errorCount > 0 ? 'high' : 'medium',
      metadata: {
        operationType: operationData.operationType,
        totalCount: operationData.count,
        successCount: operationData.successCount,
        errorCount: operationData.errorCount || 0,
        platforms: operationData.platforms,
      },
      actionUrl: '/dashboard/content',
      actionText: 'View Posts',
    });
  }

  // MESSENGER NOTIFICATION TRIGGERS

  /**
   * Trigger notification when a message is received
   */
  async onMessageReceived(userId: string, messageData: {
    conversationId: string;
    messageId: string;
    senderName: string;
    content: string;
    conversationName?: string;
  }) {
    const contentPreview = messageData.content.length > 50 ? 
      messageData.content.substring(0, 50) + '...' : 
      messageData.content;

    const conversationTitle = messageData.conversationName || messageData.senderName;

    return this.createNotification({
      type: 'message_received',
      userId,
      title: `New message from ${messageData.senderName}`,
      message: `"${contentPreview}" in ${conversationTitle}`,
      category: 'messaging',
      priority: 'high',
      metadata: {
        conversationId: messageData.conversationId,
        messageId: messageData.messageId,
        senderName: messageData.senderName,
        conversationName: messageData.conversationName,
      },
      actionUrl: `/dashboard/messaging?conversation=${messageData.conversationId}`,
      actionText: 'View Message',
    });
  }

  /**
   * Trigger notification when a conversation is created
   */
  async onConversationCreated(userId: string, conversationData: {
    conversationId: string;
    conversationName?: string;
    participantNames: string[];
    createdByName: string;
  }) {
    const participantText = conversationData.participantNames.length > 2 
      ? `${conversationData.participantNames.slice(0, 2).join(', ')} and ${conversationData.participantNames.length - 2} others`
      : conversationData.participantNames.join(' and ');

    const conversationTitle = conversationData.conversationName || 'New conversation';

    return this.createNotification({
      type: 'conversation_created',
      userId,
      title: 'New Conversation Started',
      message: `${conversationData.createdByName} started "${conversationTitle}" with ${participantText}`,
      category: 'messaging',
      priority: 'medium',
      metadata: {
        conversationId: conversationData.conversationId,
        conversationName: conversationData.conversationName,
        participantNames: conversationData.participantNames,
        createdByName: conversationData.createdByName,
      },
      actionUrl: `/dashboard/messaging?conversation=${conversationData.conversationId}`,
      actionText: 'Join Conversation',
    });
  }

  /**
   * Trigger notification when a message receives a reaction
   */
  async onMessageReaction(userId: string, reactionData: {
    conversationId: string;
    messageId: string;
    messageContent: string;
    emoji: string;
    reactorName: string;
    conversationName?: string;
  }) {
    const contentPreview = reactionData.messageContent.length > 30 ? 
      reactionData.messageContent.substring(0, 30) + '...' : 
      reactionData.messageContent;

    const conversationTitle = reactionData.conversationName || 'a conversation';

    return this.createNotification({
      type: 'message_reaction',
      userId,
      title: `${reactionData.reactorName} reacted to your message`,
      message: `${reactionData.emoji} "${contentPreview}" in ${conversationTitle}`,
      category: 'messaging',
      priority: 'low',
      metadata: {
        conversationId: reactionData.conversationId,
        messageId: reactionData.messageId,
        emoji: reactionData.emoji,
        reactorName: reactionData.reactorName,
        conversationName: reactionData.conversationName,
      },
      actionUrl: `/dashboard/messaging?conversation=${reactionData.conversationId}`,
      actionText: 'View Message',
    });
  }
}

// Export singleton instance
export const notificationTriggers = new NotificationTriggerService();
