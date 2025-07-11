import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { monitoring } from '@/lib/monitoring';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Mock analytics data - in production this would come from a real analytics service
    const analyticsData = {
      userId,
      overview: {
        totalPosts: 42,
        totalEngagement: 1250,
        avgEngagementRate: 8.5,
        followers: 1250,
        growthRate: 12.5,
      },
      performance: {
        topPosts: [
          { id: '1', engagement: 150, platform: 'instagram' },
          { id: '2', engagement: 120, platform: 'twitter' },
          { id: '3', engagement: 95, platform: 'linkedin' },
        ],
        platformBreakdown: {
          instagram: { posts: 20, engagement: 800 },
          twitter: { posts: 15, engagement: 300 },
          linkedin: { posts: 7, engagement: 150 },
        },
      },
      trends: {
        weeklyGrowth: [5, 8, 12, 15, 18, 22, 25],
        engagementTrend: [6.2, 7.1, 8.5, 8.8, 9.2, 8.9, 8.5],
      },
      lastUpdated: new Date().toISOString(),
    };

    monitoring.info('Analytics data retrieved', { userId });

    return NextResponse.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    monitoring.error('Failed to get analytics', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 