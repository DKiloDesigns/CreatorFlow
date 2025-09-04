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

    const { context, type, platform } = await req.json();

    // Generate AI suggestions
    const suggestions = await aiEngine.generateSuggestions(session.user.id, {
      context,
      type,
      platform,
    });

    // Log suggestions generation
    await prisma.analyticsAggregation.create({
      data: {
        userId: session.user.id,
        type: 'AI_SUGGESTIONS_GENERATED',
        platform: platform,
        startDate: new Date(),
        endDate: new Date(),
        data: {
          type,
          platform,
          context,
          suggestionsCount: suggestions.length,
          suggestions: suggestions.map(s => ({ type: s.type, title: s.title, impact: s.impact })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      suggestions,
      metadata: {
        type,
        platform,
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Suggestions generation error:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get user's suggestions history
    const where: any = {
      userId: session.user.id,
      type: 'AI_SUGGESTIONS_GENERATED',
    };

    if (type) {
      where.data = {
        path: ['type'],
        equals: type,
      };
    }

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
        type: data.type,
        platform: data.platform,
        context: data.context,
        suggestions: data.suggestions,
        generatedAt: event.timestamp,
      };
    });

    return NextResponse.json({
      success: true,
      history: formattedHistory,
      count: formattedHistory.length,
    });

  } catch (error) {
    console.error('Get suggestions history error:', error);
    return NextResponse.json({ error: 'Failed to get suggestions history' }, { status: 500 });
  }
} 