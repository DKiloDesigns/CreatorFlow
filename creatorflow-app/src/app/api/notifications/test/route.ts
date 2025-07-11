import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { NotificationService } from '@/lib/notifications/service';
import { monitoring } from '@/lib/monitoring';

const notificationService = new NotificationService();

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type = 'system_alert', severity = 'info', category = 'system' } = body;

    // Send test notification
    await notificationService.sendCustomNotification(
      session.user.id,
      type,
      'Test Notification',
      'This is a test notification to verify the notification system is working properly.',
      {
        severity,
        category,
        channels: ['in_app'],
        priority: 'normal',
        metadata: {
          test: true,
          timestamp: new Date().toISOString(),
        },
      }
    );

    monitoring.info('Test notification sent', {
      userId: session.user.id,
      type,
      severity,
      category,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test notification sent successfully' 
    });
  } catch (error) {
    monitoring.error('Failed to send test notification', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json({ 
      error: 'Failed to send test notification' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Send a variety of test notifications
    const testNotifications = [
      {
        type: 'system_alert' as const,
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2 AM UTC.',
        severity: 'medium' as const,
        category: 'maintenance' as const,
      },
      {
        type: 'security_alert' as const,
        title: 'New Login Detected',
        message: 'A new login was detected from an unknown device.',
        severity: 'high' as const,
        category: 'security' as const,
      },
      {
        type: 'content_alert' as const,
        title: 'Post Scheduled Successfully',
        message: 'Your post "My Amazing Content" has been scheduled for Instagram.',
        severity: 'info' as const,
        category: 'content' as const,
      },
      {
        type: 'analytics_insight' as const,
        title: 'Engagement Milestone Reached!',
        message: 'Congratulations! You\'ve reached 10,000 followers on Instagram.',
        severity: 'info' as const,
        category: 'analytics' as const,
      },
      {
        type: 'billing_alert' as const,
        title: 'Subscription Expiring Soon',
        message: 'Your premium subscription expires in 7 days. Renew to continue enjoying all features.',
        severity: 'high' as const,
        category: 'billing' as const,
      },
    ];

    const promises = testNotifications.map((notification, index) => 
      new Promise(resolve => {
        setTimeout(async () => {
          try {
            await notificationService.sendCustomNotification(
              session.user.id,
              notification.type,
              notification.title,
              notification.message,
              {
                severity: notification.severity,
                category: notification.category,
                channels: ['in_app'],
                priority: 'normal',
                metadata: {
                  test: true,
                  testIndex: index,
                  timestamp: new Date().toISOString(),
                },
              }
            );
            resolve(true);
          } catch (error) {
            console.error(`Failed to send test notification ${index}:`, error);
            resolve(false);
          }
        }, index * 1000); // Send each notification 1 second apart
      })
    );

    await Promise.all(promises);

    monitoring.info('Multiple test notifications sent', {
      userId: session.user.id,
      count: testNotifications.length,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Sent ${testNotifications.length} test notifications` 
    });
  } catch (error) {
    monitoring.error('Failed to send test notifications', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json({ 
      error: 'Failed to send test notifications' 
    }, { status: 500 });
  }
} 