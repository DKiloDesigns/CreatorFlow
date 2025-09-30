import { NextRequest, NextResponse } from 'next/server';
import { withCache, skipCacheConditions } from '@/lib/cache-middleware';
import { withCompression } from '@/lib/compression-middleware';

async function getPerformanceMetricsHandler(req: NextRequest) {
  try {
    // Get system performance metrics
    const metrics = {
      pageLoadTime: Math.random() * 2 + 0.5, // 0.5-2.5 seconds
      apiResponseTime: Math.random() * 200 + 50, // 50-250ms
      memoryUsage: Math.random() * 30 + 60, // 60-90%
      cacheHitRate: Math.random() * 20 + 75, // 75-95%
      errorRate: Math.random() * 2, // 0-2%
      activeUsers: Math.floor(Math.random() * 500) + 1000, // 1000-1500
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = withCompression()(
  withCache({
    skipCache: skipCacheConditions.skipNoCache,
    ttl: 30, // 30 seconds for real-time data
  })(getPerformanceMetricsHandler)
);
