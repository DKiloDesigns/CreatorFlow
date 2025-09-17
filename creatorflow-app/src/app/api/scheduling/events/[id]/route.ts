/**
 * Individual Scheduling Event API
 * Handles individual event operations (GET, PUT, DELETE)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = await prisma.scheduledPost.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

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
        results: event.results,
      },
    });

  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch event' 
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      content, 
      platforms, 
      scheduledTime, 
      mediaUrls, 
      hashtags, 
      location 
    } = await req.json();

    const event = await prisma.scheduledPost.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Cannot modify published or failed events' 
      }, { status: 400 });
    }

    const updatedEvent = await prisma.scheduledPost.update({
      where: { id: params.id },
      data: {
        content: content || event.content,
        platforms: platforms || event.platforms,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : event.scheduledTime,
        mediaUrls: mediaUrls || event.mediaUrls,
        hashtags: hashtags || event.hashtags,
        location: location || event.location,
      },
    });

    return NextResponse.json({
      success: true,
      event: {
        id: updatedEvent.id,
        title: updatedEvent.content.substring(0, 50),
        content: updatedEvent.content,
        platforms: updatedEvent.platforms,
        scheduledTime: updatedEvent.scheduledTime,
        status: updatedEvent.status,
        isRecurring: false,
        mediaUrls: updatedEvent.mediaUrls,
        hashtags: updatedEvent.hashtags,
        location: updatedEvent.location,
        results: updatedEvent.results,
      },
    });

  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json({ 
      error: 'Failed to update event' 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = await prisma.scheduledPost.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Cannot delete published or failed events' 
      }, { status: 400 });
    }

    await prisma.scheduledPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });

  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete event' 
    }, { status: 500 });
  }
}
