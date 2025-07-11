import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { PrismaClient, PostStatus } from '@prisma/client';
import { schedulePost } from '@/lib/publishing';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { posts, platforms, startDate, postingFrequency, postingTime } = body;

    // Validate required fields
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ error: 'Posts array is required' }, { status: 400 });
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ error: 'Platforms array is required' }, { status: 400 });
    }

    if (!startDate || !postingTime) {
      return NextResponse.json({ error: 'Start date and posting time are required' }, { status: 400 });
    }

    const scheduledPosts = [];
    const errors = [];

    // Calculate schedule based on frequency
    let currentDate = new Date(startDate);
    const [hours, minutes] = postingTime.split(':').map(Number);
    currentDate.setHours(hours, minutes, 0, 0);

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      try {
        // Create the post in database
        const postData = {
          userId,
          contentText: post.content,
          mediaUrls: post.media || [],
          platforms,
          status: PostStatus.SCHEDULED,
          scheduledAt: new Date(currentDate),
          hashtags: post.hashtags || [],
          mentions: post.mentions || [],
          location: post.location,
          isRepost: post.isRepost || false,
          repostInterval: post.repostInterval,
          repostCount: post.repostCount,
        };

        const newPost = await prisma.post.create({ data: postData });
        scheduledPosts.push(newPost);

        // Calculate next scheduled date based on frequency
        if (postingFrequency === 'hourly') {
          currentDate.setHours(currentDate.getHours() + 1);
        } else if (postingFrequency === 'daily') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (postingFrequency === 'weekly') {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (postingFrequency === 'custom') {
          // For custom, use the interval from the post or default to daily
          const interval = post.repostInterval || 1;
          currentDate.setDate(currentDate.getDate() + interval);
        }

      } catch (error) {
        console.error(`Failed to schedule post ${i + 1}:`, error);
        errors.push(`Post ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      scheduledPosts,
      totalScheduled: scheduledPosts.length,
      errors: errors.length > 0 ? errors : undefined,
      scheduleSummary: {
        totalPosts: posts.length,
        successfullyScheduled: scheduledPosts.length,
        failed: errors.length,
        startDate: new Date(startDate).toISOString(),
        postingFrequency,
        postingTime,
        platforms
      }
    });

  } catch (error) {
    console.error('Bulk schedule error:', error);
    return NextResponse.json(
      { error: 'Failed to bulk schedule posts' },
      { status: 500 }
    );
  }
} 