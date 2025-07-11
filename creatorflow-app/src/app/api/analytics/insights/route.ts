import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { insightsGenerator } from '@/lib/analytics/insights-generator';
import { monitoring } from '@/lib/monitoring';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const insights = await insightsGenerator.getInsights(userId);

    if (!insights) {
      return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
    }

    monitoring.info('Insights retrieved', { userId, count: insights.insights.length });

    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    monitoring.error('Failed to get insights', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const insights = await insightsGenerator.generateInsights(userId);

    monitoring.info('Insights generated on demand', { userId, count: insights.insights.length });

    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    monitoring.error('Failed to generate insights', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 