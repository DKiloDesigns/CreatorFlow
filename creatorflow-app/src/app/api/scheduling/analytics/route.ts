/**
 * Scheduling Analytics API
 * Provides analytics for scheduled posts and performance
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { schedulingEngine } from '@/lib/services/scheduling-engine';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    const analytics = await schedulingEngine.getSchedulingAnalytics(
      session.user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    return NextResponse.json({
      success: true,
      analytics,
    });

  } catch (error) {
    console.error('Scheduling analytics error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch scheduling analytics' 
    }, { status: 500 });
  }
}
