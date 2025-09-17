/**
 * Bulk Schedule API
 * Handles bulk scheduling operations for multiple posts
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

    const { 
      content, 
      platforms, 
      startDate, 
      endDate, 
      pattern, 
      timezone,
      mediaUrls = [],
      hashtags = [],
      location 
    } = await req.json();

    if (!content || !platforms || !startDate || !endDate || !pattern) {
      return NextResponse.json({ 
        error: 'Content, platforms, start date, end date, and pattern are required' 
      }, { status: 400 });
    }

    const result = await schedulingEngine.bulkSchedule(session.user.id, {
      content,
      platforms,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pattern,
      timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      mediaUrls,
      hashtags,
      location,
    });

    return NextResponse.json({
      success: true,
      message: `Created ${result.scheduledPosts.length} scheduled posts`,
      scheduledPosts: result.scheduledPosts,
      conflicts: result.conflicts,
    });

  } catch (error) {
    console.error('Bulk schedule error:', error);
    return NextResponse.json({ 
      error: 'Failed to bulk schedule posts' 
    }, { status: 500 });
  }
}
