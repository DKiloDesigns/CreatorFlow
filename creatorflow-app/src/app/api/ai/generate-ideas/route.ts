import { NextRequest, NextResponse } from 'next/server';
import { aiService, AIContentRequest } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: AIContentRequest = await request.json();

    const ideas = await aiService.generateContentIdeas({
      type: 'ideas',
      platform: body.platform,
      industry: body.industry,
      targetAudience: body.targetAudience
    });

    return NextResponse.json({
      success: true,
      data: ideas
    });
  } catch (error) {
    console.error('Error generating content ideas:', error);
    return NextResponse.json(
      { error: 'Failed to generate content ideas' },
      { status: 500 }
    );
  }
} 