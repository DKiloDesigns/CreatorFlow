import { NextRequest, NextResponse } from 'next/server';
import { aiService, AIContentRequest } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: AIContentRequest = await request.json();
    
    if (!body.content && !body.imageDescription) {
      return NextResponse.json(
        { error: 'Content or image description is required' },
        { status: 400 }
      );
    }

    const captions = await aiService.generateCaptions({
      type: 'caption',
      platform: body.platform,
      content: body.content,
      tone: body.tone,
      imageDescription: body.imageDescription,
      targetAudience: body.targetAudience,
      industry: body.industry
    });

    return NextResponse.json({
      success: true,
      data: captions
    });
  } catch (error) {
    console.error('Error generating captions:', error);
    return NextResponse.json(
      { error: 'Failed to generate captions' },
      { status: 500 }
    );
  }
} 