import { NextRequest, NextResponse } from 'next/server';
import { aiService, AIContentRequest } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: AIContentRequest = await request.json();

    const postingTimes = await aiService.getOptimalPostingTimes({
      type: 'scheduling',
      platform: body.platform
    });

    return NextResponse.json({
      success: true,
      data: postingTimes
    });
  } catch (error) {
    console.error('Error getting posting times:', error);
    return NextResponse.json(
      { error: 'Failed to get posting times' },
      { status: 500 }
    );
  }
} 