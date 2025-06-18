import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';
import { mockDataService } from '@/lib/analytics/mockData';
import type { AnalyticsResponse, AnalyticsOverview, TimeRange } from '@/lib/analytics/types';

function parseTimeRange(searchParams: URLSearchParams): TimeRange {
  const now = new Date();
  const endDate = searchParams.get('end') ? new Date(searchParams.get('end')!) : now;
  const startDate = searchParams.get('start') 
    ? new Date(searchParams.get('start')!)
    : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
  
  return { startDate, endDate };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const useMock = searchParams.get('mock') === '1';
  const timeRange = parseTimeRange(searchParams);
  const platform = searchParams.get('platform');
  
  // Mock data toggle for demo mode
  if (useMock) {
    const mockData = mockDataService.generateOverviewData({
      timeRange,
      platforms: platform ? [platform] : ['instagram', 'twitter', 'tiktok'],
      dataDensity: 'normal',
      userId: 'mock-user'
    });
    
    return NextResponse.json({
      data: mockData,
      timestamp: new Date().toISOString(),
      cached: false
    } as AnalyticsResponse<AnalyticsOverview>);
  }

  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const where: any = { userId };
      if (platform) where.platforms = { has: platform };
      if (timeRange) {
        where.publishedAt = {};
        if (timeRange.startDate) where.publishedAt.gte = timeRange.startDate;
        if (timeRange.endDate) where.publishedAt.lte = timeRange.endDate;
      }

      const posts = await prisma.post.findMany({
        where,
        select: {
          views: true,
          likes: true,
          comments: true,
          shares: true,
          reach: true,
          impressions: true,
          engagementRate: true,
          clickThroughRate: true,
        },
      });

      const totalPosts = posts.length;
      const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalEngagements = posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);
      const totalReach = posts.reduce((sum, p) => sum + (p.reach || 0), 0);
      const totalImpressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
      const avgEngagementRate = totalPosts ? (totalEngagements / totalPosts) : 0;
      const avgClickThroughRate = totalPosts ? posts.reduce((sum, p) => sum + (p.clickThroughRate || 0), 0) / totalPosts : 0;

      return NextResponse.json({
        data: {
          totalPosts,
          totalViews,
          totalEngagements,
          avgEngagementRate,
          totalReach,
          totalImpressions,
          avgClickThroughRate
        },
        timestamp: new Date().toISOString(),
        cached: false
      } as AnalyticsResponse<AnalyticsOverview>);
    } else {
      return auth; // Error response from requireApiKey
    }
  }

  // Fallback to session auth
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const where: any = { userId };
    if (platform) where.platforms = { has: platform };
    if (timeRange) {
      where.publishedAt = {};
      if (timeRange.startDate) where.publishedAt.gte = timeRange.startDate;
      if (timeRange.endDate) where.publishedAt.lte = timeRange.endDate;
    }

    const posts = await prisma.post.findMany({
      where,
      select: {
        views: true,
        likes: true,
        comments: true,
        shares: true,
        reach: true,
        impressions: true,
        engagementRate: true,
        clickThroughRate: true,
      },
    });

    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalEngagements = posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);
    const totalReach = posts.reduce((sum, p) => sum + (p.reach || 0), 0);
    const totalImpressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
    const avgEngagementRate = totalPosts ? (totalEngagements / totalPosts) : 0;
    const avgClickThroughRate = totalPosts ? posts.reduce((sum, p) => sum + (p.clickThroughRate || 0), 0) / totalPosts : 0;

    return NextResponse.json({
      data: {
        totalPosts,
        totalViews,
        totalEngagements,
        avgEngagementRate,
        totalReach,
        totalImpressions,
        avgClickThroughRate
      },
      timestamp: new Date().toISOString(),
      cached: false
    } as AnalyticsResponse<AnalyticsOverview>);
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 