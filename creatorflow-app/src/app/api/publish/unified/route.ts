/**
 * Unified Content Publishing API
 * Handles cross-platform content publishing and scheduling
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { contentPublishingService } from '@/lib/services/content-publishing-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    if (!action) {
      return NextResponse.json({ 
        error: 'Action is required' 
      }, { status: 400 });
    }

    switch (action) {
      case 'publish_now':
        if (!data.content || !data.platforms || data.platforms.length === 0) {
          return NextResponse.json({ 
            error: 'Content and platforms are required' 
          }, { status: 400 });
        }

        const publishResult = await contentPublishingService.publishContent({
          ...data,
          userId: session.user.id,
        });

        return NextResponse.json({
          success: true,
          action: 'publish_now',
          result: publishResult,
        });

      case 'schedule':
        if (!data.content || !data.platforms || data.platforms.length === 0 || !data.scheduledTime) {
          return NextResponse.json({ 
            error: 'Content, platforms, and scheduled time are required' 
          }, { status: 400 });
        }

        const scheduleResult = await contentPublishingService.scheduleContent({
          ...data,
          userId: session.user.id,
          scheduledTime: new Date(data.scheduledTime),
        });

        return NextResponse.json({
          success: true,
          action: 'schedule',
          result: scheduleResult,
        });

      case 'process_scheduled':
        // This should typically be called by a cron job
        const processResult = await contentPublishingService.processScheduledPosts();
        
        return NextResponse.json({
          success: true,
          action: 'process_scheduled',
          result: processResult,
        });

      default:
        return NextResponse.json({ 
          error: `Invalid action: ${action}. Supported actions: publish_now, schedule, process_scheduled` 
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Unified publishing API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'scheduled_posts':
        const status = searchParams.get('status') as 'pending' | 'published' | 'failed' | null;
        const scheduledPosts = await contentPublishingService.getScheduledPosts(
          session.user.id, 
          status || undefined
        );

        return NextResponse.json({
          success: true,
          action: 'scheduled_posts',
          result: scheduledPosts,
        });

      case 'analytics':
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');
        
        const analytics = await contentPublishingService.getPublishingAnalytics(
          session.user.id,
          startDate ? new Date(startDate) : undefined,
          endDate ? new Date(endDate) : undefined
        );

        return NextResponse.json({
          success: true,
          action: 'analytics',
          result: analytics,
        });

      default:
        return NextResponse.json({ 
          error: `Invalid action: ${action}. Supported actions: scheduled_posts, analytics` 
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Unified publishing API GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('post_id');

    if (!postId) {
      return NextResponse.json({ 
        error: 'Post ID is required' 
      }, { status: 400 });
    }

    const result = await contentPublishingService.cancelScheduledPost(postId, session.user.id);

    return NextResponse.json({
      success: true,
      action: 'cancel_scheduled',
      result,
    });

  } catch (error) {
    console.error('Unified publishing API DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
