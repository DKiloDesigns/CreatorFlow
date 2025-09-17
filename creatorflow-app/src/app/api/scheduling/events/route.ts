/**
 * Scheduling Events API
 * Handles CRUD operations for scheduled posts
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { schedulingEngine } from '@/lib/services/scheduling-engine';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const status = searchParams.get('status');

    const where: any = { userId: session.user.id };
    
    if (startDate || endDate) {
      where.scheduledTime = {};
      if (startDate) where.scheduledTime.gte = new Date(startDate);
      if (endDate) where.scheduledTime.lte = new Date(endDate);
    }
    
    if (status) {
      where.status = status;
    }

    const events = await prisma.scheduledPost.findMany({
      where,
      orderBy: { scheduledTime: 'asc' },
    });

    return NextResponse.json({
      success: true,
      events: events.map(event => ({
        id: event.id,
        title: event.content.substring(0, 50),
        content: event.content,
        platforms: event.platforms,
        scheduledTime: event.scheduledTime,
        status: event.status,
        isRecurring: false, // TODO: Add recurring support to schema
        mediaUrls: event.mediaUrls,
        hashtags: event.hashtags,
        location: event.location,
        results: event.results,
      })),
    });

  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch events' 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      content, 
      platforms, 
      scheduledTime, 
      isRecurring, 
      recurringPattern,
      mediaUrls = [],
      hashtags = [],
      location 
    } = await req.json();

    if (!content || !platforms || !scheduledTime) {
      return NextResponse.json({ 
        error: 'Content, platforms, and scheduled time are required' 
      }, { status: 400 });
    }

    if (isRecurring && recurringPattern) {
      // Generate recurring schedule
      const result = await schedulingEngine.generateRecurringSchedule(
        session.user.id,
        content,
        platforms,
        recurringPattern,
        new Date(scheduledTime),
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        { mediaUrls, hashtags, location }
      );

      return NextResponse.json({
        success: true,
        message: `Created ${result.scheduledPosts.length} scheduled posts`,
        events: result.scheduledPosts,
        conflicts: result.conflicts,
      });
    } else {
      // Single scheduled post
      const event = await prisma.scheduledPost.create({
        data: {
          userId: session.user.id,
          content,
          platforms,
          scheduledTime: new Date(scheduledTime),
          status: 'pending',
          mediaUrls,
          hashtags,
          location,
        },
      });

      return NextResponse.json({
        success: true,
        event: {
          id: event.id,
          title: event.content.substring(0, 50),
          content: event.content,
          platforms: event.platforms,
          scheduledTime: event.scheduledTime,
          status: event.status,
          isRecurring: false,
          mediaUrls: event.mediaUrls,
          hashtags: event.hashtags,
          location: event.location,
        },
      });
    }

  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ 
      error: 'Failed to create event' 
    }, { status: 500 });
  }
}
