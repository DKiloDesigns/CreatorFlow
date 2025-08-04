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

    const { type, platform, topic, tone, length, keywords, targetAudience } = await req.json();

    // Validate required fields
    if (!type || !platform || !topic || !tone || !length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate content using AI engine
    const content = await aiEngine.generateContent({
      type,
      platform,
      topic,
      tone,
      length,
      keywords,
      targetAudience,
    });

    // Log content generation
    await prisma.analyticsEvent.create({
      data: {
        userId: session.user.id,
        eventType: 'AI_CONTENT_GENERATED',
        eventData: JSON.stringify({
          type,
          platform,
          topic,
          tone,
          length,
          contentLength: content.length,
        }),
        timestamp: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      content,
      metadata: {
        type,
        platform,
        topic,
        tone,
        length,
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
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

    // Get user's generated content history
    const where: any = {
      userId: session.user.id,
      eventType: 'AI_CONTENT_GENERATED',
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
        content: data.content || 'Generated content',
        type: data.type,
        platform: data.platform,
        topic: data.topic,
        tone: data.tone,
        length: data.length,
        generatedAt: event.timestamp,
      };
    });

    return NextResponse.json({
      success: true,
      history: formattedHistory,
      count: formattedHistory.length,
    });

  } catch (error) {
    console.error('Get content history error:', error);
    return NextResponse.json({ error: 'Failed to get content history' }, { status: 500 });
  }
} 