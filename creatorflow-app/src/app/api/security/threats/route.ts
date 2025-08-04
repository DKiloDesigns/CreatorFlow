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
    const status = searchParams.get('status') || 'active';
    const threatType = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: any = { status };
    
    if (threatType) {
      where.type = threatType;
    }
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    // Get threat detections
    const threats = await prisma.threatDetection.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    // Get threat statistics
    const stats = await prisma.threatDetection.groupBy({
      by: ['type', 'status'],
      _count: { type: true },
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    const threatStats = stats.reduce((acc, stat) => {
      if (!acc[stat.type]) acc[stat.type] = {};
      acc[stat.type][stat.status] = stat._count.type;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    return NextResponse.json({
      threats: threats.map(threat => ({
        id: threat.id,
        threatId: threat.threatId,
        type: threat.type,
        confidence: threat.confidence,
        indicators: JSON.parse(threat.indicators),
        affectedUsers: JSON.parse(threat.affectedUsers),
        timestamp: threat.timestamp,
        status: threat.status,
      })),
      stats: {
        total: threats.length,
        threatBreakdown: threatStats,
        timeRange: {
          start: startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          end: endDate || new Date().toISOString(),
        },
      },
    });

  } catch (error) {
    console.error('Threat detection error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin permissions
    if (session.user.email !== 'renee@creatorflow.com') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { threatId, action, notes } = await req.json();

    // Get the threat
    const threat = await prisma.threatDetection.findFirst({
      where: { threatId },
    });

    if (!threat) {
      return NextResponse.json({ error: 'Threat not found' }, { status: 404 });
    }

    // Update threat status based on action
    let newStatus = threat.status;
    switch (action) {
      case 'investigate':
        newStatus = 'investigating';
        break;
      case 'resolve':
        newStatus = 'resolved';
        break;
      case 'false_positive':
        newStatus = 'false_positive';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update threat status
    await prisma.threatDetection.update({
      where: { id: threat.id },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    // Log threat response
    await prisma.securityEvent.create({
      data: {
        eventType: 'THREAT_RESPONSE',
        severity: 'medium',
        description: `Threat ${threatId} ${action} by ${session.user.email}`,
        metadata: JSON.stringify({
          threatId,
          action,
          notes,
          previousStatus: threat.status,
          newStatus,
        }),
        timestamp: new Date(),
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Threat ${action} successfully`,
      threat: {
        id: threat.id,
        threatId: threat.threatId,
        type: threat.type,
        status: newStatus,
      },
    });

  } catch (error) {
    console.error('Threat response error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 