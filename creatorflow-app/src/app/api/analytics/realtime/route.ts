import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { analyticsEngine } from '@/lib/analytics-engine';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const timeRange = parseInt(searchParams.get('timeRange') || '60'); // Default 60 minutes

    // Get real-time metrics
    const metrics = await analyticsEngine.getRealTimeMetrics();

    // Get additional real-time data
    const now = new Date();
    const startTime = new Date(now.getTime() - timeRange * 60 * 1000);

    // Get recent events
    const recentEvents = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: { gte: startTime },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    // Get platform usage breakdown
    const platformUsage = await prisma.analyticsEvent.groupBy({
      by: ['platform'],
      _count: { platform: true },
      where: {
        timestamp: { gte: startTime },
        platform: { not: null },
      },
    });

    // Get top performing content
    const topContent = await prisma.post.findMany({
      where: {
        createdAt: { gte: startTime },
      },
      include: {
        analytics: true,
      },
      orderBy: {
        analytics: {
          engagement: 'desc',
        },
      },
      take: 5,
    });

    // Calculate engagement trends
    const engagementEvents = recentEvents.filter(e => e.eventType === 'USER_ENGAGEMENT');
    const engagementTrend = engagementEvents.length > 0 ? 'increasing' : 'stable';

    // Get user activity patterns
    const userActivity = await prisma.analyticsEvent.groupBy({
      by: ['userId'],
      _count: { userId: true },
      where: {
        timestamp: { gte: startTime },
      },
    });

    const activeUsers = userActivity.length;
    const averageEventsPerUser = activeUsers > 0 ? recentEvents.length / activeUsers : 0;

    return NextResponse.json({
      activeUsers,
      newUsers: await getNewUsersCount(startTime),
      totalEvents: recentEvents.length,
      platformUsage: platformUsage.reduce((acc, item) => {
        acc[item.platform!] = item._count.platform;
        return acc;
      }, {} as Record<string, number>),
      topContent: topContent.map(post => ({
        id: post.id,
        content: post.content,
        engagement: post.analytics?.engagement || 0,
        platform: post.platform,
        createdAt: post.createdAt,
      })),
      engagementTrend,
      averageEventsPerUser: Math.round(averageEventsPerUser * 100) / 100,
      timestamp: now.toISOString(),
      timeRange,
    });

  } catch (error) {
    console.error('Real-time analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getNewUsersCount(since: Date): Promise<number> {
  try {
    return await prisma.user.count({
      where: {
        createdAt: { gte: since },
      },
    });
  } catch (error) {
    console.error('Failed to get new users count:', error);
    return 0;
  }
} 