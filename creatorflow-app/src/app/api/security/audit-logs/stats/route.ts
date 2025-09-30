import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { AuditLogger } from '@/lib/security/audit-logger';

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and has admin permissions
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // TODO: Add permission check for admin access
    // For now, allow all authenticated users

    const url = new URL(req.url);
    const timeframe = (url.searchParams.get('timeframe') as 'hour' | 'day' | 'week' | 'month') || 'day';

    const stats = await AuditLogger.getStats(timeframe);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to get audit stats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve audit stats' },
      { status: 500 }
    );
  }
}
