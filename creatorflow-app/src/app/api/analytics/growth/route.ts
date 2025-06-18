import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';
import { mockDataService } from '@/lib/analytics/mockData';
import type { AnalyticsResponse, GrowthData, TimeRange } from '@/lib/analytics/types';

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
    const mockData = mockDataService.generateGrowthData({
      timeRange,
      platforms: platform ? [platform] : ['instagram', 'twitter', 'tiktok'],
      dataDensity: 'normal',
      userId: 'mock-user'
    });
    
    return NextResponse.json({
      data: mockData,
      timestamp: new Date().toISOString(),
      cached: false
    } as AnalyticsResponse<GrowthData>);
  }

  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const platforms = platform ? [platform] : ['instagram', 'twitter', 'tiktok'];
      const result: GrowthData = {};

      for (const platform of platforms) {
        const metrics = await prisma.audienceMetric.findMany({
          where: {
            userId,
            platform,
            date: {
              gte: timeRange.startDate,
              lte: timeRange.endDate
            }
          },
          orderBy: {
            date: 'asc'
          }
        });

        result[platform] = metrics.map(m => ({
          date: m.date.toISOString().split('T')[0],
          followers: m.followers,
          following: Math.floor(m.followers * 0.8), // Estimate following count
          engagement: Math.floor(m.followers * 0.05) // Estimate engagement
        }));
      }

      return NextResponse.json({
        data: result,
        timestamp: new Date().toISOString(),
        cached: false
      } as AnalyticsResponse<GrowthData>);
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
    const result: GrowthData = {};

    for (const platform of platforms) {
      const metrics = await prisma.audienceMetric.findMany({
        where: {
          userId,
          platform,
          date: {
            gte: timeRange.startDate,
            lte: timeRange.endDate
          }
        },
        orderBy: {
          date: 'asc'
        }
      });

      result[platform] = metrics.map(m => ({
        date: m.date.toISOString().split('T')[0],
        followers: m.followers,
        following: Math.floor(m.followers * 0.8), // Estimate following count
        engagement: Math.floor(m.followers * 0.05) // Estimate engagement
      }));
    }

    return NextResponse.json({
      data: result,
      timestamp: new Date().toISOString(),
      cached: false
    } as AnalyticsResponse<GrowthData>);
  } catch (error) {
    console.error('Analytics growth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 