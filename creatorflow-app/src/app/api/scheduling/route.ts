import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { PlatformPublishingService } from '@/lib/platform-publishers';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    switch (action) {
      case 'create_schedule':
        return await handleCreateSchedule(session.user.id, data);
      
      case 'bulk_schedule':
        return await handleBulkSchedule(session.user.id, data);
      
      case 'update_schedule':
        return await handleUpdateSchedule(session.user.id, data);
      
      case 'delete_schedule':
        return await handleDeleteSchedule(session.user.id, data);
      
      case 'get_optimal_times':
        return await handleGetOptimalTimes(session.user.id, data);
      
      case 'get_schedule_analytics':
        return await handleGetScheduleAnalytics(session.user.id, data);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Scheduling API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleCreateSchedule(userId: string, data: any) {
  const { content, platforms, scheduleType, scheduleData, metadata } = data;

  try {
    // Validate required fields
    if (!content || !platforms || !scheduleType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let scheduledPosts: any[] = [];

    switch (scheduleType) {
      case 'single':
        scheduledPosts = [{
          content,
          platforms,
          scheduledAt: new Date(scheduleData.scheduledAt),
          metadata,
        }];
        break;

      case 'recurring':
        scheduledPosts = generateRecurringSchedule(content, platforms, scheduleData, metadata);
        break;

      case 'bulk':
        scheduledPosts = scheduleData.posts.map((post: any) => ({
          content: post.content,
          platforms: post.platforms || platforms,
          scheduledAt: new Date(post.scheduledAt),
          metadata: { ...metadata, ...post.metadata },
        }));
        break;

      default:
        return NextResponse.json({ error: 'Invalid schedule type' }, { status: 400 });
    }

    // Create scheduled posts in database
    const createdPosts = await Promise.all(
      scheduledPosts.map(post => 
        prisma.post.create({
          data: {
            userId,
            contentText: post.content,
            platforms: post.platforms,
            scheduledAt: post.scheduledAt,
            status: 'SCHEDULED',
            // Note: metadata, scheduleType, scheduleData fields don't exist in Post model
            // Might need to store in errorMessage or create separate scheduling table
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      scheduledPosts: createdPosts,
      count: createdPosts.length,
    });

  } catch (error) {
    console.error('Create schedule error:', error);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}

async function handleBulkSchedule(userId: string, data: any) {
  const { posts, scheduleStrategy, metadata } = data;

  try {
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ error: 'Invalid posts data' }, { status: 400 });
    }

    let scheduledPosts: any[] = [];

    switch (scheduleStrategy) {
      case 'optimal_times':
        // Use AI to determine optimal posting times
        const optimalTimes = await getOptimalPostingTimes(userId, posts.length);
        scheduledPosts = posts.map((post: any, index: number) => ({
          content: post.content,
          platforms: post.platforms,
          scheduledAt: optimalTimes[index] || new Date(Date.now() + (index * 24 * 60 * 60 * 1000)),
          metadata: { ...metadata, ...post.metadata },
        }));
        break;

      case 'frequency_based':
        // Schedule based on frequency settings
        const { frequency, startDate, endDate } = data;
        scheduledPosts = generateFrequencyBasedSchedule(posts, frequency, startDate, endDate, metadata);
        break;

      case 'manual_times':
        // Use manually specified times
        scheduledPosts = posts.map((post: any) => ({
          content: post.content,
          platforms: post.platforms,
          scheduledAt: new Date(post.scheduledAt),
          metadata: { ...metadata, ...post.metadata },
        }));
        break;

      default:
        return NextResponse.json({ error: 'Invalid schedule strategy' }, { status: 400 });
    }

    // Create scheduled posts
    const createdPosts = await Promise.all(
      scheduledPosts.map(post => 
        prisma.post.create({
          data: {
            userId,
            contentText: post.content,
            platforms: post.platforms,
            scheduledAt: post.scheduledAt,
            status: 'SCHEDULED',
            // Note: metadata, scheduleType, scheduleData fields don't exist in Post model
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      scheduledPosts: createdPosts,
      count: createdPosts.length,
    });

  } catch (error) {
    console.error('Bulk schedule error:', error);
    return NextResponse.json({ error: 'Failed to create bulk schedule' }, { status: 500 });
  }
}

async function handleUpdateSchedule(userId: string, data: any) {
  const { scheduleId, updates } = data;

  try {
    const scheduledPost = await prisma.post.findFirst({
      where: { id: scheduleId, userId, status: 'SCHEDULED' },
    });

    if (!scheduledPost) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: scheduleId },
      data: updates,
    });

    return NextResponse.json({
      success: true,
      scheduledPost: updatedPost,
    });

  } catch (error) {
    console.error('Update schedule error:', error);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}

async function handleDeleteSchedule(userId: string, data: any) {
  const { scheduleId } = data;

  try {
    const scheduledPost = await prisma.post.findFirst({
      where: { id: scheduleId, userId, status: 'SCHEDULED' },
    });

    if (!scheduledPost) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id: scheduleId },
    });

    return NextResponse.json({
      success: true,
      message: 'Schedule deleted successfully',
    });

  } catch (error) {
    console.error('Delete schedule error:', error);
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
  }
}

async function handleGetOptimalTimes(userId: string, data: any) {
  const { platform, count = 5, dateRange } = data;

  try {
    // Get user's historical posting data
    const historicalPosts = await prisma.post.findMany({
      where: {
        userId,
        platforms: platform ? (Array.isArray(platform) ? platform.filter((p): p is string => typeof p === 'string') : [platform as string]) as any : undefined,
        createdAt: dateRange ? {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        } : undefined,
      },
      include: {
        // TODO: Add analytics relation to Post model
        // analytics: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Analyze engagement patterns
    const engagementByHour = analyzeEngagementByHour(historicalPosts);
    const optimalTimes = calculateOptimalTimes(engagementByHour, count);

    return NextResponse.json({
      success: true,
      optimalTimes,
      analysis: {
        totalPosts: historicalPosts.length,
        averageEngagement: calculateAverageEngagement(historicalPosts),
        bestPerformingHours: getBestPerformingHours(engagementByHour),
      },
    });

  } catch (error) {
    console.error('Get optimal times error:', error);
    return NextResponse.json({ error: 'Failed to get optimal times' }, { status: 500 });
  }
}

async function handleGetScheduleAnalytics(userId: string, data: any) {
  const { dateRange } = data;

  try {
    const scheduledPosts = await prisma.post.findMany({
      where: {
        userId,
        status: 'SCHEDULED',
        scheduledAt: dateRange ? {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        } : undefined,
      },
      orderBy: { scheduledAt: 'asc' },
    });

    const publishedPosts = await prisma.post.findMany({
      where: {
        userId,
        createdAt: dateRange ? {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        } : undefined,
      },
      include: {
        // TODO: Add analytics relation to Post model
        // analytics: true,
      },
    });

    const analytics = {
      scheduled: {
        total: scheduledPosts.length,
        byPlatform: groupByPlatform(scheduledPosts),
        byScheduleType: groupByScheduleType(scheduledPosts),
      },
      published: {
        total: publishedPosts.length,
        byPlatform: groupByPlatform(publishedPosts),
        averageEngagement: calculateAverageEngagement(publishedPosts),
      },
      performance: {
        scheduledVsPublished: scheduledPosts.length / Math.max(publishedPosts.length, 1),
        engagementTrend: calculateEngagementTrend(publishedPosts),
      },
    };

    return NextResponse.json({
      success: true,
      analytics,
    });

  } catch (error) {
    console.error('Get schedule analytics error:', error);
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
}

// Helper functions
function generateRecurringSchedule(content: any, platforms: string[], scheduleData: any, metadata: any) {
  const { frequency, startDate, endDate, times } = scheduleData;
  const posts: any[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  let currentDate = new Date(start);
  let postIndex = 0;

  while (currentDate <= end) {
    for (const time of times) {
      const scheduledAt = new Date(currentDate);
      scheduledAt.setHours(time.hour, time.minute, 0, 0);

      if (scheduledAt >= start && scheduledAt <= end) {
        posts.push({
          content,
          platforms,
          scheduledAt,
          metadata: { ...metadata, frequency, timeSlot: time },
        });
        postIndex++;
      }
    }

    // Move to next occurrence based on frequency
    switch (frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }

  return posts;
}

function generateFrequencyBasedSchedule(posts: any[], frequency: any, startDate: string, endDate: string, metadata: any) {
  const scheduledPosts: any[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDuration = end.getTime() - start.getTime();
  const interval = totalDuration / posts.length;

  posts.forEach((post, index) => {
    const scheduledAt = new Date(start.getTime() + (interval * index));
    scheduledPosts.push({
      content: post.content,
      platforms: post.platforms,
      scheduledAt,
      metadata: { ...metadata, ...post.metadata, frequency },
    });
  });

  return scheduledPosts;
}

async function getOptimalPostingTimes(userId: string, count: number) {
  // This would integrate with AI service for optimal time prediction
  // For now, return evenly distributed times over the next week
  const times: Date[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000));
    time.setHours(9 + (i % 8), 0, 0, 0); // Spread across business hours
    times.push(time);
  }

  return times;
}

function analyzeEngagementByHour(posts: any[]) {
  const hourlyEngagement: Record<number, number> = {};
  
  posts.forEach(post => {
    const hour = new Date(post.createdAt).getHours();
    const engagement = post.analytics?.engagement || 0;
    hourlyEngagement[hour] = (hourlyEngagement[hour] || 0) + engagement;
  });

  return hourlyEngagement;
}

function calculateOptimalTimes(hourlyEngagement: Record<number, number>, count: number) {
  const sortedHours = Object.entries(hourlyEngagement)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([hour]) => parseInt(hour));

  return sortedHours.map(hour => {
    const time = new Date();
    time.setHours(hour, 0, 0, 0);
    return time;
  });
}

function calculateAverageEngagement(posts: any[]) {
  if (posts.length === 0) return 0;
  const totalEngagement = posts.reduce((sum, post) => sum + (post.analytics?.engagement || 0), 0);
  return totalEngagement / posts.length;
}

function getBestPerformingHours(hourlyEngagement: Record<number, number>) {
  return Object.entries(hourlyEngagement)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour, engagement]) => ({ hour: parseInt(hour), engagement }));
}

function groupByPlatform(posts: any[]) {
  return posts.reduce((acc, post) => {
    const platform = post.platform || post.platforms?.[0];
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function groupByScheduleType(posts: any[]) {
  return posts.reduce((acc, post) => {
    const type = post.scheduleType || 'single';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function calculateEngagementTrend(posts: any[]) {
  // Calculate engagement trend over time
  const sortedPosts = posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const recentPosts = sortedPosts.slice(-10);
  const olderPosts = sortedPosts.slice(-20, -10);

  const recentAvg = calculateAverageEngagement(recentPosts);
  const olderAvg = calculateAverageEngagement(olderPosts);

  return {
    trend: recentAvg > olderAvg ? 'increasing' : 'decreasing',
    change: ((recentAvg - olderAvg) / Math.max(olderAvg, 1)) * 100,
  };
} 