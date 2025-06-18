import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';
import { mockDataService } from '@/lib/analytics/mockData';
import type { AnalyticsResponse, TopPost, TimeRange } from '@/lib/analytics/types';

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
  const limit = parseInt(searchParams.get('limit') || '5');
  
  // Mock data toggle for demo mode
  if (useMock) {
    const mockData = mockDataService.generateTopPosts({
      timeRange,
      platforms: platform ? [platform] : ['instagram', 'twitter', 'tiktok'],
      dataDensity: 'normal',
      userId: 'mock-user'
    });
    
    return NextResponse.json({
      data: mockData.slice(0, limit),
      timestamp: new Date().toISOString(),
      cached: false
    } as AnalyticsResponse<TopPost[]>);
  }

  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const where: any = { 
        userId,
        publishedAt: {
          gte: timeRange.startDate,
          lte: timeRange.endDate
        }
      };
      if (platform) where.platforms = { has: platform };

      const posts = await prisma.post.findMany({
        where,
        orderBy: [
          { views: 'desc' },
          { likes: 'desc' },
          { comments: 'desc' }
        ],
        take: limit,
        select: {
          id: true,
          contentText: true,
          platforms: true,
          publishedAt: true,
          views: true,
          likes: true,
          comments: true,
          shares: true,
          reach: true,
          impressions: true,
          engagementRate: true
        }
      });

      const topPosts: TopPost[] = posts.map(post => ({
        id: post.id,
        content: post.contentText || '',
        platform: post.platforms[0], // Use first platform for now
        publishedAt: post.publishedAt?.toISOString() || '',
        metrics: {
          views: post.views || 0,
          likes: post.likes || 0,
          comments: post.comments || 0,
          shares: post.shares || 0,
          reach: post.reach || 0,
          impressions: post.impressions || 0,
          engagementRate: post.engagementRate || 0
        }
      }));

      return NextResponse.json({
        data: topPosts,
        timestamp: new Date().toISOString(),
        cached: false
      } as AnalyticsResponse<TopPost[]>);
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
    const where: any = { 
      userId,
      publishedAt: {
        gte: timeRange.startDate,
        lte: timeRange.endDate
      }
    };
    if (platform) where.platforms = { has: platform };

    const posts = await prisma.post.findMany({
      where,
      orderBy: [
        { views: 'desc' },
        { likes: 'desc' },
        { comments: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        contentText: true,
        platforms: true,
        publishedAt: true,
        views: true,
        likes: true,
        comments: true,
        shares: true,
        reach: true,
        impressions: true,
        engagementRate: true
      }
    });

    const topPosts: TopPost[] = posts.map(post => ({
      id: post.id,
      content: post.contentText || '',
      platform: post.platforms[0], // Use first platform for now
      publishedAt: post.publishedAt?.toISOString() || '',
      metrics: {
        views: post.views || 0,
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: post.shares || 0,
        reach: post.reach || 0,
        impressions: post.impressions || 0,
        engagementRate: post.engagementRate || 0
      }
    }));

    return NextResponse.json({
      data: topPosts,
      timestamp: new Date().toISOString(),
      cached: false
    } as AnalyticsResponse<TopPost[]>);
  } catch (error) {
    console.error('Analytics top posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 