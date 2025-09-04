import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { aiEngine } from '@/lib/ai-engine';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, platform, targetMetrics, currentPerformance } = await req.json();

    // Validate required fields
    if (!content || !platform || !targetMetrics) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Optimize content using AI engine
    const optimization = await aiEngine.optimizeContent({
      content,
      platform,
      targetMetrics,
      currentPerformance,
    });

    // Log content optimization
    await prisma.analyticsAggregation.create({
      data: {
        userId: session.user.id,
        type: 'AI_CONTENT_OPTIMIZED',
        platform: platform,
        startDate: new Date(),
        endDate: new Date(),
        data: {
          platform,
          targetMetrics,
          originalLength: content.length,
          optimizedLength: optimization.optimizedContent.length,
          suggestions: optimization.suggestions,
          predictedPerformance: optimization.predictedPerformance,
        },
      },
    });

    return NextResponse.json({
      success: true,
      optimization,
      metadata: {
        platform,
        targetMetrics,
        optimizedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Content optimization error:', error);
    return NextResponse.json({ error: 'Failed to optimize content' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get user's optimization history
    const where: any = {
      userId: session.user.id,
      type: 'AI_CONTENT_OPTIMIZED',
    };

    if (platform) {
      where.platform = platform;
    }

    const history = await prisma.analyticsAggregation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const formattedHistory = history.map((event: any) => {
      const data = event.data;
      return {
        id: event.id,
        platform: data.platform,
        targetMetrics: data.targetMetrics,
        suggestions: data.suggestions,
        predictedPerformance: data.predictedPerformance,
        optimizedAt: event.timestamp,
      };
    });

    return NextResponse.json({
      success: true,
      history: formattedHistory,
      count: formattedHistory.length,
    });

  } catch (error) {
    console.error('Get optimization history error:', error);
    return NextResponse.json({ error: 'Failed to get optimization history' }, { status: 500 });
  }
} 