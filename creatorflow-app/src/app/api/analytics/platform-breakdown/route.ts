import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';
import { mockDataService } from '@/lib/analytics/mockData';
import type { AnalyticsResponse, PlatformBreakdown, TimeRange } from '@/lib/analytics/types';

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
    const mockData = mockDataService.generatePlatformBreakdown({
      timeRange,
      platforms: platform ? [platform] : ['instagram', 'twitter', 'tiktok'],
      dataDensity: 'normal',
      userId: 'mock-user'
    });
    
    return NextResponse.json({
      data: mockData,
      timestamp: new Date().toISOString(),
      cached: false
    } as AnalyticsResponse<PlatformBreakdown>);
  }

  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const platforms = platform ? [platform] : ['instagram', 'twitter', 'tiktok'];
      const result: PlatformBreakdown = {};

      for (const platform of platforms) {
        const posts = await prisma.post.findMany({
          where: {
            userId,
            platforms: { has: platform },
            publishedAt: {
              gte: timeRange.startDate,
              lte: timeRange.endDate
            }
          },
          select: {
            id: true,
            contentText: true,
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

        const totalPosts = posts.length;
        const totalEngagement = posts.reduce((sum, p) => 
          sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0
        );

        // Get top performing post
        const topPost = posts.sort((a, b) => (b.views || 0) - (a.views || 0))[0];

        result[platform] = {
          totalPosts,
          totalEngagement,
          avgEngagementRate: totalPosts ? (totalEngagement / totalPosts) : 0,
          topPerformingPost: topPost ? {
            id: topPost.id,
            content: topPost.contentText || '',
            platform,
            publishedAt: topPost.publishedAt?.toISOString() || '',
            metrics: {
              views: topPost.views || 0,
              likes: topPost.likes || 0,
              comments: topPost.comments || 0,
              shares: topPost.shares || 0,
              reach: topPost.reach || 0,
              impressions: topPost.impressions || 0,
              engagementRate: topPost.engagementRate || 0
            }
          } : null,
          growth: 0, // This would need to be calculated from audience metrics
          audienceDemographics: {
            ageGroups: {
              '18-24': 0,
              '25-34': 0,
              '35-44': 0,
              '45+': 0
            },
            gender: {
              'male': 0,
              'female': 0,
              'other': 0
            },
            locations: {
              'United States': 0,
              'United Kingdom': 0,
              'Canada': 0,
              'Australia': 0,
              'Other': 0
            }
          }
        };
      }

      return NextResponse.json({
        data: result,
        timestamp: new Date().toISOString(),
        cached: false
      } as AnalyticsResponse<PlatformBreakdown>);
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
    const platforms = platform ? [platform] : ['instagram', 'twitter', 'tiktok'];
    const result: PlatformBreakdown = {};

    for (const platform of platforms) {
      const posts = await prisma.post.findMany({
        where: {
          userId,
          platforms: { has: platform },
          publishedAt: {
            gte: timeRange.startDate,
            lte: timeRange.endDate
          }
        },
        select: {
          id: true,
          contentText: true,
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

      const totalPosts = posts.length;
      const totalEngagement = posts.reduce((sum, p) => 
        sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0
      );

      // Get top performing post
      const topPost = posts.sort((a, b) => (b.views || 0) - (a.views || 0))[0];

      result[platform] = {
        totalPosts,
        totalEngagement,
        avgEngagementRate: totalPosts ? (totalEngagement / totalPosts) : 0,
        topPerformingPost: topPost ? {
          id: topPost.id,
          content: topPost.contentText || '',
          platform,
          publishedAt: topPost.publishedAt?.toISOString() || '',
          metrics: {
            views: topPost.views || 0,
            likes: topPost.likes || 0,
            comments: topPost.comments || 0,
            shares: topPost.shares || 0,
            reach: topPost.reach || 0,
            impressions: topPost.impressions || 0,
            engagementRate: topPost.engagementRate || 0
          }
        } : null,
        growth: 0, // This would need to be calculated from audience metrics
        audienceDemographics: {
          ageGroups: {
            '18-24': 0,
            '25-34': 0,
            '35-44': 0,
            '45+': 0
          },
          gender: {
            'male': 0,
            'female': 0,
            'other': 0
          },
          locations: {
            'United States': 0,
            'United Kingdom': 0,
            'Canada': 0,
            'Australia': 0,
            'Other': 0
          }
        }
      };
    }

    return NextResponse.json({
      data: result,
      timestamp: new Date().toISOString(),
      cached: false
    } as AnalyticsResponse<PlatformBreakdown>);
  } catch (error) {
    console.error('Analytics platform breakdown error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 