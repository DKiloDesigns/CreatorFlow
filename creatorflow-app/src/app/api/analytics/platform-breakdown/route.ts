import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock platform breakdown data since AnalyticsEvent model doesn't exist
    const mockPlatformData = {
      'Instagram': {
        impressions: Math.floor(Math.random() * 20000) + 50000,
        reach: Math.floor(Math.random() * 15000) + 30000,
        engagement: Math.floor(Math.random() * 5000) + 15000,
        clicks: Math.floor(Math.random() * 2000) + 8000,
        conversions: Math.floor(Math.random() * 500) + 2000,
        revenue: Math.floor(Math.random() * 10000) + 50000,
        ctr: (Math.random() * 5 + 3).toFixed(2),
        cpc: (Math.random() * 2 + 1).toFixed(2),
        roas: (Math.random() * 2 + 2).toFixed(2)
      },
      'LinkedIn': {
        impressions: Math.floor(Math.random() * 15000) + 30000,
        reach: Math.floor(Math.random() * 10000) + 20000,
        engagement: Math.floor(Math.random() * 3000) + 8000,
        clicks: Math.floor(Math.random() * 1500) + 5000,
        conversions: Math.floor(Math.random() * 300) + 1200,
        revenue: Math.floor(Math.random() * 8000) + 30000,
        ctr: (Math.random() * 4 + 2).toFixed(2),
        cpc: (Math.random() * 3 + 2).toFixed(2),
        roas: (Math.random() * 1.5 + 1.5).toFixed(2)
      },
      'Twitter': {
        impressions: Math.floor(Math.random() * 12000) + 25000,
        reach: Math.floor(Math.random() * 8000) + 15000,
        engagement: Math.floor(Math.random() * 2000) + 5000,
        clicks: Math.floor(Math.random() * 1000) + 3000,
        conversions: Math.floor(Math.random() * 200) + 800,
        revenue: Math.floor(Math.random() * 5000) + 20000,
        ctr: (Math.random() * 4 + 2).toFixed(2),
        cpc: (Math.random() * 2.5 + 1.5).toFixed(2),
        roas: (Math.random() * 1.8 + 1.2).toFixed(2)
      },
      'Facebook': {
        impressions: Math.floor(Math.random() * 10000) + 20000,
        reach: Math.floor(Math.random() * 6000) + 12000,
        engagement: Math.floor(Math.random() * 1500) + 4000,
        clicks: Math.floor(Math.random() * 800) + 2000,
        conversions: Math.floor(Math.random() * 150) + 600,
        revenue: Math.floor(Math.random() * 4000) + 15000,
        ctr: (Math.random() * 3 + 2).toFixed(2),
        cpc: (Math.random() * 2 + 1).toFixed(2),
        roas: (Math.random() * 1.5 + 1.5).toFixed(2)
      }
    };

    return NextResponse.json({
      success: true,
      data: mockPlatformData
    });

  } catch (error) {
    console.error('Platform breakdown error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 