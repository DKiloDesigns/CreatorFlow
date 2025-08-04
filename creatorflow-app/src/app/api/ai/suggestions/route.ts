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
    await prisma.analyticsEvent.create({
      data: {
        userId: session.user.id,
        eventType: 'AI_SUGGESTIONS_GENERATED',
        eventData: JSON.stringify({
          type,
          platform,
          context,
          suggestionsCount: suggestions.length,
          suggestions: suggestions.map(s => ({ type: s.type, title: s.title, impact: s.impact })),
        }),
        timestamp: new Date(),
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
      eventType: 'AI_SUGGESTIONS_GENERATED',
    };

    if (type) {
      where.eventData = {
        contains: `"type":"${type}"`,
      };
    }

    if (platform) {
      where.eventData = {
        contains: `"platform":"${platform}"`,
      };
    }

    const history = await prisma.analyticsEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    const formattedHistory = history.map(event => {
      const data = JSON.parse(event.eventData);
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