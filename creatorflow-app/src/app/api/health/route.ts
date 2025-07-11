import { NextRequest, NextResponse } from 'next/server';
import { monitoring } from '@/lib/monitoring';

export async function GET(req: NextRequest) {
  try {
    const health = await monitoring.healthCheck();
    
    return NextResponse.json({
      status: health.status,
      timestamp: new Date().toISOString(),
      checks: health.checks,
      metrics: health.metrics,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 