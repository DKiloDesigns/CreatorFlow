import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NotificationService } from '@/lib/notifications/service';
import { NotificationManager } from '@/lib/notifications/manager';
import { monitoring } from '@/lib/monitoring';
import { z } from 'zod';

const notificationService = new NotificationService();
const notificationManager = NotificationManager.getInstance();

// Validation schemas
const createNotificationSchema = z.object({
  type: z.string(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']).optional(),
  category: z.enum(['system', 'security', 'performance', 'content', 'billing', 'team', 'analytics', 'platform', 'maintenance', 'feature', 'feedback', 'collaboration', 'data', 'api', 'storage', 'subscription']).optional(),
  channels: z.array(z.enum(['in_app', 'email', 'push', 'sms', 'webhook'])).optional(),
  priority: z.enum(['urgent', 'high', 'normal', 'low']).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  actionUrl: z.string().url().optional(),
  actionText: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

const updatePreferencesSchema = z.object({
  global: z.object({
    enabled: z.boolean(),
    channels: z.array(z.enum(['in_app', 'email', 'push', 'sms', 'webhook'])),
    quietHours: z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
      timezone: z.string(),
    }),
  }).optional(),
  types: z.record(z.string(), z.object({
    enabled: z.boolean(),
    channels: z.array(z.enum(['in_app', 'email', 'push', 'sms', 'webhook'])),
    priority: z.enum(['urgent', 'high', 'normal', 'low']),
  })).optional(),
  categories: z.record(z.string(), z.object({
    enabled: z.boolean(),
    channels: z.array(z.enum(['in_app', 'email', 'push', 'sms', 'webhook'])),
    priority: z.enum(['urgent', 'high', 'normal', 'low']),
  })).optional(),
});

const getNotificationsSchema = z.object({
  limit: z.string().transform(Number).pipe(z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100')).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0, 'Offset must be at least 0')).optional(),
  unreadOnly: z.string().transform(val => val === 'true').optional(),
  type: z.string().optional(),
  category: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validatedParams = getNotificationsSchema.parse(queryParams);
    
    const { notifications, total } = await notificationManager.getUserNotifications(
      session.user.id,
      {
        limit: validatedParams.limit,
        offset: validatedParams.offset,
        unreadOnly: validatedParams.unreadOnly,
        type: validatedParams.type as any,
        category: validatedParams.category as any,
      }
    );

    return NextResponse.json({
      notifications,
      total,
      hasMore: total > (validatedParams.offset || 0) + (validatedParams.limit || 50),
    });
  } catch (error) {
    monitoring.error('Failed to get notifications', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createNotificationSchema.parse(body);

    const notification = await notificationManager.createNotification(
      session.user.id,
      validatedData.type as any,
      validatedData.title,
      validatedData.message,
      {
        severity: validatedData.severity,
        category: validatedData.category,
        channels: validatedData.channels,
        priority: validatedData.priority,
        metadata: validatedData.metadata,
        actionUrl: validatedData.actionUrl,
        actionText: validatedData.actionText,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
      }
    );

    return NextResponse.json(notification);
  } catch (error) {
    monitoring.error('Failed to create notification', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updatePreferencesSchema.parse(body);

    await notificationManager.updateUserPreferences(session.user.id, validatedData as Partial<import('@/lib/notifications/types').NotificationPreferences>);

    return NextResponse.json({ success: true });
  } catch (error) {
    monitoring.error('Failed to update notification preferences', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, notificationId } = body;

    switch (action) {
      case 'mark_read':
        if (!notificationId) {
          return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
        }
        await notificationManager.markAsRead(notificationId, session.user.id);
        break;

      case 'mark_all_read':
        await notificationManager.markAllAsRead(session.user.id);
        break;

      case 'delete':
        if (!notificationId) {
          return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
        }
        await notificationManager.deleteNotification(notificationId, session.user.id);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    monitoring.error('Failed to update notification', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 