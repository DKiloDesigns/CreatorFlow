import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { AnalyticsMonitoring } from '@/lib/analytics/monitoring';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || session.user.id;
    const endpoint = searchParams.get('endpoint');
    const type = searchParams.get('type') || 'all';

    const monitoring = AnalyticsMonitoring.getInstance();
    const metrics: Record<string, any> = {};

    if (type === 'all' || type === 'cache') {
      if (endpoint) {
        metrics.cache = await monitoring.getCacheMetrics(userId, endpoint);
      } else {
        // Get metrics for all endpoints
        const endpoints = ['overview', 'growth', 'top-posts', 'platform-breakdown'];
        metrics.cache = {};
        for (const ep of endpoints) {
          metrics.cache[ep] = await monitoring.getCacheMetrics(userId, ep);
        }
      }
    }

    if (type === 'all' || type === 'ratelimit') {
      if (endpoint) {
        metrics.ratelimit = await monitoring.getRateLimitMetrics(userId, endpoint);
      } else {
        // Get metrics for all endpoints
        const endpoints = ['overview', 'growth', 'top-posts', 'platform-breakdown'];
        metrics.ratelimit = {};
        for (const ep of endpoints) {
          metrics.ratelimit[ep] = await monitoring.getRateLimitMetrics(userId, ep);
        }
      }
    }

    return NextResponse.json({
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching monitoring metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const monitoring = AnalyticsMonitoring.getInstance();
    await monitoring.clearMetrics();

    return NextResponse.json({
      message: 'Monitoring metrics cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing monitoring metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 