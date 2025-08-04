import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PlatformPublishingService } from '@/lib/platform-publishers';

export async function POST(req: NextRequest) {
  try {
    // Verify cron secret to ensure this is called by the scheduler
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Get all scheduled posts that are due to be published
    const scheduledPosts = await prisma.scheduledPost.findMany({
      where: {
        scheduledAt: {
          gte: now,
          lte: fiveMinutesFromNow,
        },
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    console.log(`Processing ${scheduledPosts.length} scheduled posts`);

    const results = [];

    for (const scheduledPost of scheduledPosts) {
      try {
        // Update status to processing
        await prisma.scheduledPost.update({
          where: { id: scheduledPost.id },
          data: { status: 'processing' },
        });

        // Publish to platforms
        const publishResults = await PlatformPublishingService.publishToPlatforms(
          scheduledPost.userId,
          scheduledPost.content,
          scheduledPost.platforms,
          scheduledPost.scheduledAt,
          scheduledPost.metadata
        );

        // Create post records for successful publishes
        const successfulPosts = publishResults.filter(result => result.success);
        const postRecords = await Promise.all(
          successfulPosts.map(result => 
            prisma.post.create({
              data: {
                userId: scheduledPost.userId,
                platform: result.platform,
                content: scheduledPost.content,
                postId: result.postId,
                postUrl: result.postUrl,
                metadata: {
                  ...scheduledPost.metadata,
                  publishedAt: new Date(),
                  scheduledPostId: scheduledPost.id,
                  results: publishResults,
                },
              },
            })
          )
        );

        // Update scheduled post status
        await prisma.scheduledPost.update({
          where: { id: scheduledPost.id },
          data: {
            status: successfulPosts.length > 0 ? 'completed' : 'failed',
            publishedAt: successfulPosts.length > 0 ? new Date() : null,
            results: publishResults,
          },
        });

        // Track analytics
        if (successfulPosts.length > 0) {
          await prisma.analyticsEvent.create({
            data: {
              userId: scheduledPost.userId,
              eventType: 'SCHEDULED_POST_PUBLISHED',
              eventData: {
                scheduledPostId: scheduledPost.id,
                platforms: successfulPosts.map(p => p.platform),
                postCount: successfulPosts.length,
                totalPlatforms: scheduledPost.platforms.length,
              },
            },
          });
        }

        results.push({
          id: scheduledPost.id,
          success: successfulPosts.length > 0,
          publishedCount: successfulPosts.length,
          totalPlatforms: scheduledPost.platforms.length,
          errors: publishResults.filter(r => !r.success).map(r => r.error),
        });

      } catch (error) {
        console.error(`Error processing scheduled post ${scheduledPost.id}:`, error);
        
        // Update status to failed
        await prisma.scheduledPost.update({
          where: { id: scheduledPost.id },
          data: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });

        results.push({
          id: scheduledPost.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Process recurring schedules
    await processRecurringSchedules();

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processRecurringSchedules() {
  try {
    // Get all completed recurring schedules
    const completedRecurringSchedules = await prisma.scheduledPost.findMany({
      where: {
        scheduleType: 'recurring',
        status: 'completed',
        publishedAt: {
          not: null,
        },
      },
    });

    for (const schedule of completedRecurringSchedules) {
      const scheduleData = schedule.scheduleData as any;
      const { frequency, startDate, endDate, times } = scheduleData;

      // Check if we should create the next occurrence
      const lastScheduledAt = new Date(schedule.scheduledAt);
      const end = new Date(endDate);
      
      if (lastScheduledAt >= end) {
        continue; // Recurring schedule has ended
      }

      // Calculate next occurrence
      let nextScheduledAt = new Date(lastScheduledAt);
      switch (frequency) {
        case 'daily':
          nextScheduledAt.setDate(nextScheduledAt.getDate() + 1);
          break;
        case 'weekly':
          nextScheduledAt.setDate(nextScheduledAt.getDate() + 7);
          break;
        case 'monthly':
          nextScheduledAt.setMonth(nextScheduledAt.getMonth() + 1);
          break;
        default:
          continue;
      }

      // Create next scheduled post for each time slot
      for (const time of times) {
        const nextTime = new Date(nextScheduledAt);
        nextTime.setHours(time.hour, time.minute, 0, 0);

        if (nextTime <= end) {
          await prisma.scheduledPost.create({
            data: {
              userId: schedule.userId,
              content: schedule.content,
              platforms: schedule.platforms,
              scheduledAt: nextTime,
              metadata: schedule.metadata,
              scheduleType: 'recurring',
              scheduleData: scheduleData,
              status: 'pending',
            },
          });
        }
      }
    }

  } catch (error) {
    console.error('Error processing recurring schedules:', error);
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Scheduling cron job is running',
  });
} 