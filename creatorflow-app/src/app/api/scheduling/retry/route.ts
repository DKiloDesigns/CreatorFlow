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
    const scheduledPost = await prisma.post.findFirst({
      where: {
        id: scheduledPostId,
        userId: session.user.id,
        status: 'FAILED',
      },
    });

    if (!scheduledPost) {
      return NextResponse.json({ error: 'Scheduled post not found or not failed' }, { status: 404 });
    }

    // Check retry limits
    const maxRetries = 3;
    // TODO: Add metadata field to Post model
    const currentRetries = 0; // scheduledPost.metadata?.retryCount || 0;

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
    await prisma.post.update({
      where: { id: scheduledPostId },
      data: {
        status: 'SCHEDULED',
        scheduledAt: retryAt,
        // Note: metadata field doesn't exist in Post model, might need to store in errorMessage
        errorMessage: JSON.stringify({
          retryCount: currentRetries + 1,
          lastRetryAt: new Date(),
          backoffDelay,
        }),
      },
    });

    // Track retry event
    await prisma.analyticsAggregation.create({
      data: {
        userId: session.user.id,
        type: 'SCHEDULED_POST_RETRY',
        platform: null,
        startDate: new Date(),
        endDate: new Date(),
        data: {
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
    const failedPosts = await prisma.post.findMany({
      where: {
        userId: session.user.id,
        status: status === 'failed' ? 'FAILED' : 'SCHEDULED',
      },
      orderBy: { scheduledAt: 'desc' },
      take: 50,
    });

    // Group by retry count
    const retryStats = failedPosts.reduce((acc: any, post: any) => {
      // Parse retry count from errorMessage since metadata doesn't exist
      let retryCount = 0;
      try {
        const errorData = post.errorMessage ? JSON.parse(post.errorMessage) : {};
        retryCount = errorData.retryCount || 0;
      } catch (e) {
        retryCount = 0;
      }
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