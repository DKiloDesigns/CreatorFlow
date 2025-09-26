/**
 * Notification Test Triggers API
 * Endpoint to test different notification types
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { notificationTriggers } from '@/lib/notifications/notification-triggers';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { triggerType } = await req.json();

    let notification;

    switch (triggerType) {
      case 'post_created':
        notification = await notificationTriggers.onPostCreated(userId, {
          id: 'test-post-123',
          contentText: 'This is a test post created via notification trigger! 🚀',
          platforms: ['Twitter', 'LinkedIn'],
          status: 'DRAFT',
        });
        break;

      case 'post_scheduled':
        notification = await notificationTriggers.onPostScheduled(userId, {
          id: 'test-post-456',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          platforms: ['Instagram', 'Facebook'],
          contentText: 'Scheduled post for tomorrow! 📅',
        });
        break;

      case 'post_published':
        notification = await notificationTriggers.onPostPublished(userId, {
          id: 'test-post-789',
          platforms: ['Twitter'],
          contentText: 'Just published this amazing content! ✨',
          publishedAt: new Date(),
        });
        break;

      case 'post_engagement':
        notification = await notificationTriggers.onPostEngagement(userId, {
          postId: 'test-post-123',
          platform: 'Twitter',
          type: 'like',
          count: 42,
          contentText: 'Your viral post is getting engagement! 🔥',
        });
        break;

      case 'tool_used':
        notification = await notificationTriggers.onToolUsed(userId, {
          toolName: 'AI Content Generator',
          toolCategory: 'content',
          result: 'Generated 5 high-quality posts',
        });
        break;

      case 'bulk_operation':
        notification = await notificationTriggers.onBulkOperation(userId, {
          operationType: 'bulk_schedule',
          count: 10,
          platforms: ['Twitter', 'LinkedIn', 'Instagram'],
          successCount: 9,
          errorCount: 1,
        });
        break;

      case 'system_event':
        notification = await notificationTriggers.onSystemEvent(userId, {
          eventType: 'feature',
          title: 'New Feature Available!',
          message: 'Check out our new AI-powered hashtag generator in the Tools section.',
          priority: 'high',
        });
        break;

      case 'all':
        // Create multiple test notifications
        const notifications = [];
        
        notifications.push(await notificationTriggers.onPostCreated(userId, {
          id: 'test-1',
          contentText: 'Test post creation notification',
          platforms: ['Twitter'],
          status: 'DRAFT',
        }));

        notifications.push(await notificationTriggers.onPostScheduled(userId, {
          id: 'test-2',
          scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          platforms: ['LinkedIn'],
          contentText: 'Test scheduled post',
        }));

        notifications.push(await notificationTriggers.onPostEngagement(userId, {
          postId: 'test-3',
          platform: 'Instagram',
          type: 'comment',
          count: 15,
          contentText: 'Test engagement notification',
        }));

        notifications.push(await notificationTriggers.onToolUsed(userId, {
          toolName: 'Hashtag Generator',
          toolCategory: 'content',
          result: 'Generated 20 relevant hashtags',
        }));

        notifications.push(await notificationTriggers.onSystemEvent(userId, {
          eventType: 'update',
          title: 'System Update Complete',
          message: 'Your CreatorFlow dashboard has been updated with new features.',
          priority: 'medium',
        }));

        return NextResponse.json({
          success: true,
          message: 'Created 5 test notifications',
          notifications: notifications.filter(n => n !== null),
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid trigger type. Use: post_created, post_scheduled, post_published, post_engagement, tool_used, bulk_operation, system_event, or all'
        }, { status: 400 });
    }

    if (!notification) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create notification'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Created ${triggerType} notification`,
      notification
    });

  } catch (error) {
    console.error('Test notification trigger error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create test notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Notification Test Triggers API',
    availableTriggers: [
      'post_created',
      'post_scheduled', 
      'post_published',
      'post_engagement',
      'tool_used',
      'bulk_operation',
      'system_event',
      'all'
    ],
    usage: 'POST with { "triggerType": "trigger_name" }'
  });
}
