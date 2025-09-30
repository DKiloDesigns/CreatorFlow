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
    const query = {
      userId: url.searchParams.get('userId') || undefined,
      action: url.searchParams.get('action') || undefined,
      resource: url.searchParams.get('resource') || undefined,
      severity: url.searchParams.get('severity') || undefined,
      outcome: url.searchParams.get('outcome') || undefined,
      startDate: url.searchParams.get('startDate') ? new Date(url.searchParams.get('startDate')!) : undefined,
      endDate: url.searchParams.get('endDate') ? new Date(url.searchParams.get('endDate')!) : undefined,
      limit: parseInt(url.searchParams.get('limit') || '20'),
      offset: parseInt(url.searchParams.get('offset') || '0'),
    };

    const events = await AuditLogger.query(query);
    const total = events.length; // This is simplified - in production, you'd want a separate count query

    return NextResponse.json({
      events,
      total,
      page: Math.floor(query.offset / query.limit) + 1,
      limit: query.limit,
    });
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve audit logs' },
      { status: 500 }
    );
  }
}
