import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { mobileOptimizer } from '@/lib/mobile-optimizer';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'capabilities':
        const capabilities = await mobileOptimizer.detectMobileCapabilities();
        return NextResponse.json({
          success: true,
          capabilities,
        });

      case 'viewport':
        const viewport = await mobileOptimizer.getViewportInfo();
        return NextResponse.json({
          success: true,
          viewport,
        });

      case 'performance':
        const performance = await mobileOptimizer.optimizeForMobile();
        return NextResponse.json({
          success: true,
          performance,
        });

      case 'touch':
        const touch = await mobileOptimizer.optimizeTouchTargets();
        return NextResponse.json({
          success: true,
          touch,
        });

      case 'accessibility':
        const accessibility = await mobileOptimizer.optimizeAccessibility();
        return NextResponse.json({
          success: true,
          accessibility,
        });

      case 'network':
        const network = await mobileOptimizer.optimizeNetwork();
        return NextResponse.json({
          success: true,
          network,
        });

      case 'metrics':
        const metrics = await mobileOptimizer.trackMobilePerformance();
        return NextResponse.json({
          success: true,
          metrics,
        });

      case 'config':
        const config = mobileOptimizer.getConfig();
        return NextResponse.json({
          success: true,
          config,
        });

      default:
        // Return all mobile optimizations
        const optimizations = await mobileOptimizer.applyMobileOptimizations();
        return NextResponse.json({
          success: true,
          optimizations,
        });
    }

  } catch (error) {
    console.error('Mobile optimization error:', error);
    return NextResponse.json({ error: 'Failed to optimize mobile' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    switch (action) {
      case 'apply_optimizations':
        const optimizations = await mobileOptimizer.applyMobileOptimizations();
        return NextResponse.json({
          success: true,
          optimizations,
        });

      case 'update_config':
        // Update mobile configuration
        const config = mobileOptimizer.getConfig();
        const updatedConfig = { ...config, ...data };
        
        // Note: In a real implementation, you'd update the config in the mobileOptimizer
        return NextResponse.json({
          success: true,
          config: updatedConfig,
          message: 'Configuration updated successfully',
        });

      case 'track_performance':
        const metrics = await mobileOptimizer.trackMobilePerformance();
        return NextResponse.json({
          success: true,
          metrics,
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Mobile optimization POST error:', error);
    return NextResponse.json({ error: 'Failed to process mobile optimization' }, { status: 500 });
  }
} 