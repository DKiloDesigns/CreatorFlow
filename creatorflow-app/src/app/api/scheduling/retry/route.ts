import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { PlatformPublishingService } from '@/lib/platform-publishers';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scheduledPostId, retryCount = 0 } = await req.json();

    // Get the failed scheduled post
    const scheduledPost = await prisma.scheduledPost.findFirst({
      where: {
        id: scheduledPostId,
        userId: session.user.id,
        status: 'failed',
      },
    });

    if (!scheduledPost) {
      return NextResponse.json({ error: 'Scheduled post not found or not failed' }, { status: 404 });
    }

    // Check retry limits
    const maxRetries = 3;
    const currentRetries = scheduledPost.metadata?.retryCount || 0;

    if (currentRetries >= maxRetries) {
      return NextResponse.json({ 
        error: 'Maximum retry attempts reached',
        retryCount: currentRetries,
      }, { status: 400 });
    }

    // Calculate exponential backoff delay
    const backoffDelay = Math.min(1000 * Math.pow(2, currentRetries), 30000); // Max 30 seconds
    const retryAt = new Date(Date.now() + backoffDelay);

    // Update scheduled post for retry
    await prisma.scheduledPost.update({
      where: { id: scheduledPostId },
      data: {
        status: 'pending',
        scheduledAt: retryAt,
        metadata: {
          ...scheduledPost.metadata,
          retryCount: currentRetries + 1,
          lastRetryAt: new Date(),
          backoffDelay,
        },
      },
    });

    // Track retry event
    await prisma.analyticsEvent.create({
      data: {
        userId: session.user.id,
        eventType: 'SCHEDULED_POST_RETRY',
        eventData: {
          scheduledPostId,
          retryCount: currentRetries + 1,
          backoffDelay,
          retryAt,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Scheduled post queued for retry',
      retryAt,
      retryCount: currentRetries + 1,
      backoffDelay,
    });

  } catch (error) {
    console.error('Retry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'failed';

    // Get failed scheduled posts for the user
    const failedPosts = await prisma.scheduledPost.findMany({
      where: {
        userId: session.user.id,
        status: status as any,
      },
      orderBy: { scheduledAt: 'desc' },
      take: 50,
    });

    // Group by retry count
    const retryStats = failedPosts.reduce((acc, post) => {
      const retryCount = post.metadata?.retryCount || 0;
      acc[retryCount] = (acc[retryCount] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return NextResponse.json({
      failedPosts,
      retryStats,
      total: failedPosts.length,
    });

  } catch (error) {
    console.error('Get failed posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 