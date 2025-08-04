import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { securityManager } from '@/lib/security-manager';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin permissions
    if (session.user.email !== 'renee@creatorflow.com') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const severity = searchParams.get('severity');
    const eventType = searchParams.get('eventType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build where clause
    const where: any = {};
    
    if (severity) {
      where.severity = severity;
    }
    
    if (eventType) {
      where.eventType = eventType;
    }
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    // Get security events
    const events = await prisma.securityEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    // Get event statistics
    const stats = await prisma.securityEvent.groupBy({
      by: ['severity'],
      _count: { severity: true },
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    const severityStats = stats.reduce((acc, stat) => {
      acc[stat.severity] = stat._count.severity;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      events: events.map(event => ({
        id: event.id,
        userId: event.userId,
        eventType: event.eventType,
        severity: event.severity,
        description: event.description,
        metadata: JSON.parse(event.metadata),
        timestamp: event.timestamp,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
      })),
      stats: {
        total: events.length,
        severityBreakdown: severityStats,
        timeRange: {
          start: startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          end: endDate || new Date().toISOString(),
        },
      },
    });

  } catch (error) {
    console.error('Security events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, resource, context } = await req.json();

    // Validate access
    const accessCheck = await securityManager.validateAccess(
      session.user.id,
      resource,
      action,
      context
    );

    if (!accessCheck.allowed) {
      return NextResponse.json({ 
        error: 'Access denied', 
        reason: accessCheck.reason 
      }, { status: 403 });
    }

    // Detect threats
    const threats = await securityManager.detectThreats(session.user.id, action, context);

    if (threats.length > 0) {
      return NextResponse.json({
        error: 'Security threat detected',
        threats: threats.map(threat => ({
          type: threat.type,
          confidence: threat.confidence,
          indicators: threat.indicators,
        })),
      }, { status: 429 });
    }

    // Log successful action
    await prisma.securityAudit.create({
      data: {
        userId: session.user.id,
        action,
        resource,
        success: true,
        timestamp: new Date(),
        ipAddress: req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: JSON.stringify(context || {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Action completed successfully',
    });

  } catch (error) {
    console.error('Security action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 