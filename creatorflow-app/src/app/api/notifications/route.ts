/**
 * Notifications API Endpoint
 * Handle notification CRUD operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { NotificationSystem } from '@/lib/notifications/notification-system';

const notificationSystem = new NotificationSystem();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const category = searchParams.get('category') as any;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const notifications = notificationSystem.getNotifications(userId, {
      unreadOnly,
      category,
      limit,
      offset
    });

    const unreadCount = notificationSystem.getUnreadCount(userId, category);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      total: notifications.length
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get notifications',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, title, message, category, userId, options } = await request.json();

    if (!type || !title || !message || !category) {
      return NextResponse.json({
        success: false,
        message: 'Type, title, message, and category are required'
      }, { status: 400 });
    }

    const notification = notificationSystem.createNotification(
      type,
      title,
      message,
      category,
      userId || 'default',
      options || {}
    );

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Create notification error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notificationId, action, userId, preferences } = await request.json();

    if (action === 'markAsRead') {
      if (!notificationId) {
        return NextResponse.json({
          success: false,
          message: 'Notification ID is required'
        }, { status: 400 });
      }

      const success = notificationSystem.markAsRead(notificationId);
      
      return NextResponse.json({
        success,
        message: success ? 'Notification marked as read' : 'Notification not found'
      });
    }

    if (action === 'markAllAsRead') {
      const count = notificationSystem.markAllAsRead(userId || 'default');
      
      return NextResponse.json({
        success: true,
        count,
        message: `Marked ${count} notifications as read`
      });
    }

    if (action === 'setPreferences') {
      if (!userId || !preferences) {
        return NextResponse.json({
          success: false,
          message: 'User ID and preferences are required'
        }, { status: 400 });
      }

      notificationSystem.setPreferences(userId, preferences);
      
      return NextResponse.json({
        success: true,
        message: 'Preferences updated successfully'
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Update notification error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('notificationId');

    if (!notificationId) {
      return NextResponse.json({
        success: false,
        message: 'Notification ID is required'
      }, { status: 400 });
    }

    const success = notificationSystem.deleteNotification(notificationId);
    
    return NextResponse.json({
      success,
      message: success ? 'Notification deleted' : 'Notification not found'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 