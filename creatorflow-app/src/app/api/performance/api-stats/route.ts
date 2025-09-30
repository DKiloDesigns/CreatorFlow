import { NextRequest, NextResponse } from 'next/server';
import { withCompression } from '@/lib/compression-middleware';

async function getApiStatsHandler(req: NextRequest) {
  try {
    // Mock API performance data
    const apiStats = [
      {
        endpoint: '/api/user',
        avgResponseTime: Math.floor(Math.random() * 100) + 80,
        requestsPerMinute: Math.floor(Math.random() * 30) + 30,
        errorRate: Math.random() * 1,
        lastUpdated: '2 minutes ago',
      },
      {
        endpoint: '/api/analytics/overview',
        avgResponseTime: Math.floor(Math.random() * 150) + 120,
        requestsPerMinute: Math.floor(Math.random() * 20) + 15,
        errorRate: Math.random() * 0.5,
        lastUpdated: '1 minute ago',
      },
      {
        endpoint: '/api/notifications',
        avgResponseTime: Math.floor(Math.random() * 80) + 60,
        requestsPerMinute: Math.floor(Math.random() * 40) + 40,
        errorRate: Math.random() * 1.5,
        lastUpdated: '30 seconds ago',
      },
      {
        endpoint: '/api/posts/calendar',
        avgResponseTime: Math.floor(Math.random() * 200) + 150,
        requestsPerMinute: Math.floor(Math.random() * 15) + 8,
        errorRate: Math.random() * 2,
        lastUpdated: '3 minutes ago',
      },
      {
        endpoint: '/api/ai/content',
        avgResponseTime: Math.floor(Math.random() * 300) + 200,
        requestsPerMinute: Math.floor(Math.random() * 10) + 5,
        errorRate: Math.random() * 1,
        lastUpdated: '5 minutes ago',
      },
    ];

    return NextResponse.json(apiStats);
  } catch (error) {
    console.error('Error fetching API stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = withCompression()(getApiStatsHandler);
