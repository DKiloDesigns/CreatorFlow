/**
 * Optimal Timing API
 * Provides AI-powered optimal timing suggestions for content
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { schedulingEngine } from '@/lib/services/scheduling-engine';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, platforms, timezone } = await req.json();

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json({ 
        error: 'Content and platforms are required' 
      }, { status: 400 });
    }

    const optimalTimings = await schedulingEngine.calculateOptimalTiming(
      session.user.id,
      platforms,
      content,
      timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    return NextResponse.json({
      success: true,
      optimalTimings,
    });

  } catch (error) {
    console.error('Optimal timing error:', error);
    return NextResponse.json({ 
      error: 'Failed to calculate optimal timing' 
    }, { status: 500 });
  }
}
