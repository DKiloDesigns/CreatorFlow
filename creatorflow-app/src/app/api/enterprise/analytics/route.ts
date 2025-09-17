/**
 * Enterprise Analytics API
 * Advanced analytics and reporting for enterprise teams
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { enterpriseAnalyticsService } from '@/lib/services/enterprise-analytics';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('team_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!teamId) {
      return NextResponse.json({ 
        error: 'Team ID is required' 
      }, { status: 400 });
    }

    const timeRange = {
      startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: endDate ? new Date(endDate) : new Date(),
    };

    const metrics = await enterpriseAnalyticsService.getEnterpriseMetrics(teamId, timeRange);

    return NextResponse.json({
      success: true,
      metrics,
      timeRange,
    });

  } catch (error) {
    console.error('Get enterprise analytics error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch enterprise analytics' 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, type, timeRange, recipients } = await req.json();

    if (!teamId || !type || !timeRange) {
      return NextResponse.json({ 
        error: 'Team ID, type, and time range are required' 
      }, { status: 400 });
    }

    const report = await enterpriseAnalyticsService.generateEnterpriseReport(
      teamId,
      type,
      timeRange,
      session.user.id,
      recipients || []
    );

    return NextResponse.json({
      success: true,
      report,
    });

  } catch (error) {
    console.error('Generate enterprise report error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate enterprise report' 
    }, { status: 500 });
  }
}
