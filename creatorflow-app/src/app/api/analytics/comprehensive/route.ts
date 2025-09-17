/**
 * Comprehensive Analytics API
 * Provides detailed analytics data and insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { analyticsEngine } from '@/lib/services/analytics-engine';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const granularity = searchParams.get('granularity') || 'day';
    const platforms = searchParams.get('platforms')?.split(',');

    const timeRange = {
      startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: endDate ? new Date(endDate) : new Date(),
      granularity: granularity as 'hour' | 'day' | 'week' | 'month' | 'year',
    };

    const analytics = await analyticsEngine.getComprehensiveAnalytics(
      session.user.id,
      timeRange,
      platforms
    );

    return NextResponse.json({
      success: true,
      analytics,
      timeRange,
    });

  } catch (error) {
    console.error('Comprehensive analytics error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics' 
    }, { status: 500 });
  }
}
