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

    const { content, platforms, scheduledAt, metadata } = await req.json();

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate platforms
    const invalidPlatforms = platforms.filter((p: string) => !PlatformPublishingService.isPlatformSupported(p));
    if (invalidPlatforms.length > 0) {
      return NextResponse.json({ 
        error: `Unsupported platforms: ${invalidPlatforms.join(', ')}` 
      }, { status: 400 });
    }

    // Check if user has connected accounts for all platforms
    const userAccounts = await prisma.socialAccount.findMany({
      where: {
        userId: session.user.id,
        platform: { in: platforms },
      },
    });

    const connectedPlatforms = userAccounts.map(account => account.platform);
    const missingPlatforms = platforms.filter(p => !connectedPlatforms.includes(p));

    if (missingPlatforms.length > 0) {
      return NextResponse.json({ 
        error: `Missing connected accounts for: ${missingPlatforms.join(', ')}` 
      }, { status: 400 });
    }

    // If scheduled for future, save to database
    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      const scheduledPost = await prisma.scheduledPost.create({
        data: {
          userId: session.user.id,
          content: content,
          platforms: platforms,
          scheduledAt: new Date(scheduledAt),
          metadata: metadata || {},
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Post scheduled successfully',
        scheduledPostId: scheduledPost.id,
        scheduledAt: scheduledPost.scheduledAt,
      });
    }

    // Publish immediately
    const results = await PlatformPublishingService.publishToPlatforms(
      session.user.id,
      content,
      platforms,
      scheduledAt ? new Date(scheduledAt) : undefined,
      metadata
    );

    // Save post records to database
    const postRecords = await Promise.all(
      results
        .filter(result => result.success)
        .map(result => 
          prisma.post.create({
            data: {
              userId: session.user.id,
              platform: result.platform,
              content: content,
              postId: result.postId,
              postUrl: result.postUrl,
              metadata: {
                ...metadata,
                publishedAt: new Date(),
                results: results,
              },
            },
          })
        )
    );

    // Track analytics
    const successfulPosts = results.filter(r => r.success);
    if (successfulPosts.length > 0) {
      await prisma.analyticsEvent.create({
        data: {
          userId: session.user.id,
          eventType: 'POST_PUBLISHED',
          eventData: {
            platforms: successfulPosts.map(p => p.platform),
            postCount: successfulPosts.length,
            totalPlatforms: platforms.length,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      results: results,
      posts: postRecords,
      summary: {
        total: platforms.length,
        successful: successfulPosts.length,
        failed: results.filter(r => !r.success).length,
      },
    });

  } catch (error) {
    console.error('Publishing error:', error);
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
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get user's published posts
    const where: any = { userId: session.user.id };
    if (platform) where.platform = platform;

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        analytics: {
          select: {
            impressions: true,
            engagement: true,
            reach: true,
          },
        },
      },
    });

    // Get scheduled posts
    const scheduledPosts = await prisma.scheduledPost.findMany({
      where: { userId: session.user.id },
      orderBy: { scheduledAt: 'asc' },
      take: limit,
    });

    return NextResponse.json({
      posts,
      scheduledPosts,
      summary: {
        total: posts.length,
        scheduled: scheduledPosts.length,
        byPlatform: posts.reduce((acc, post) => {
          acc[post.platform] = (acc[post.platform] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    });

  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 