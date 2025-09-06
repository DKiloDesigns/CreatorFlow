import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ErrorReport } from '@/lib/error-handler';

export async function POST(req: NextRequest) {
  try {
    const errorReport: ErrorReport = await req.json();

    // Validate error report
    if (!errorReport.id || !errorReport.message || !errorReport.type) {
      return NextResponse.json(
        { error: 'Invalid error report format' },
        { status: 400 }
      );
    }

    // Store error in database
    await prisma.errorLog.create({
      data: {
        id: errorReport.id,
        type: errorReport.type,
        severity: errorReport.severity,
        message: errorReport.message,
        stack: errorReport.stack || null,
        context: JSON.stringify(errorReport.context),
        timestamp: new Date(errorReport.timestamp),
        resolved: errorReport.resolved,
        retryable: errorReport.retryable,
      },
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', {
        id: errorReport.id,
        type: errorReport.type,
        severity: errorReport.severity,
        message: errorReport.message,
        context: errorReport.context,
      });
    }

    // Send alert for critical errors
    if (errorReport.severity === 'critical') {
      await sendCriticalErrorAlert(errorReport);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log error:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const severity = searchParams.get('severity');
    const type = searchParams.get('type');
    const resolved = searchParams.get('resolved');

    const where: any = {};
    if (severity) where.severity = severity;
    if (type) where.type = type;
    if (resolved !== null) where.resolved = resolved === 'true';

    const errors = await prisma.errorLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return NextResponse.json({ errors });
  } catch (error) {
    console.error('Failed to fetch errors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch errors' },
      { status: 500 }
    );
  }
}

async function sendCriticalErrorAlert(errorReport: ErrorReport) {
  try {
    // Send to admin notification system
    await prisma.notification.create({
      data: {
        userId: 'admin', // System user
        type: 'CRITICAL_ERROR',
        title: 'Critical Error Detected',
        message: `Critical error ${errorReport.id}: ${errorReport.message}`,
        data: JSON.stringify({
          errorId: errorReport.id,
          type: errorReport.type,
          severity: errorReport.severity,
          context: errorReport.context,
        }),
        priority: 'HIGH',
      },
    });

    // Log to console for immediate attention
    console.error('🚨 CRITICAL ERROR ALERT:', {
      id: errorReport.id,
      message: errorReport.message,
      type: errorReport.type,
      context: errorReport.context,
    });
  } catch (alertError) {
    console.error('Failed to send critical error alert:', alertError);
  }
}
