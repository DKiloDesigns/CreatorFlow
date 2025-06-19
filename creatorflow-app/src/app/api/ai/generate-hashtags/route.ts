import { NextRequest, NextResponse } from 'next/server';
import { aiService, AIContentRequest } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: AIContentRequest = await request.json();
    
    if (!body.content && !body.industry) {
      return NextResponse.json(
        { error: 'Content or industry is required' },
        { status: 400 }
      );
    }

    const hashtags = await aiService.generateHashtags({
      type: 'hashtags',
      platform: body.platform,
      content: body.content,
      industry: body.industry,
      targetAudience: body.targetAudience
    });

    return NextResponse.json({
      success: true,
      data: hashtags
    });
  } catch (error) {
    console.error('Error generating hashtags:', error);
    return NextResponse.json(
      { error: 'Failed to generate hashtags' },
      { status: 500 }
    );
  }
} 