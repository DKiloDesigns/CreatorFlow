/**
 * Cron Job: Process Scheduled Posts
 * This endpoint should be called by a cron job to process scheduled posts
 */

import { NextRequest, NextResponse } from 'next/server';
import { contentPublishingService } from '@/lib/services/content-publishing-service';

export async function POST(req: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Process scheduled posts
    const result = await contentPublishingService.processScheduledPosts();

    return NextResponse.json({
      success: true,
      message: 'Scheduled posts processed successfully',
      result,
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: 'Failed to process scheduled posts' 
    }, { status: 500 });
  }
}

// Allow GET for testing purposes
export async function GET(req: NextRequest) {
  try {
    // Process scheduled posts
    const result = await contentPublishingService.processScheduledPosts();

    return NextResponse.json({
      success: true,
      message: 'Scheduled posts processed successfully',
      result,
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: 'Failed to process scheduled posts' 
    }, { status: 500 });
  }
}
