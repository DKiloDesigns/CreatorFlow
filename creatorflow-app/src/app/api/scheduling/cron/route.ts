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
    const scheduledPosts = await prisma.post.findMany({
      where: {
        scheduledAt: {
          gte: now,
          lte: fiveMinutesFromNow,
        },
        status: 'SCHEDULED',
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
        await prisma.post.update({
          where: { id: scheduledPost.id },
          data: { status: 'PUBLISHING' },
        });

        // Publish to platforms
        const publishResults = await PlatformPublishingService.publishToPlatforms(
          scheduledPost.userId,
          { text: scheduledPost.contentText || '' },
          scheduledPost.platforms,
          scheduledPost.scheduledAt || undefined,
          {} // TODO: Add metadata field to Post model
        );

        // Create post records for successful publishes
        const successfulPosts = publishResults.filter(result => result.success);
        const postRecords = await Promise.all(
          successfulPosts.map(result => 
            prisma.post.create({
              data: {
                userId: scheduledPost.userId,
                platforms: [result.platform],
                contentText: scheduledPost.contentText || '',
                // TODO: Add postId field to Post model
                // postId: result.postId,
                // TODO: Add postUrl field to Post model
                // postUrl: result.postUrl,
                // TODO: Add metadata field to Post model
                // metadata: {
                //   publishedAt: new Date(),
                //   scheduledPostId: scheduledPost.id,
                //   results: publishResults,
                // },
              },
            })
          )
        );

        // Update scheduled post status
        await prisma.post.update({
          where: { id: scheduledPost.id },
          data: {
            status: successfulPosts.length > 0 ? 'PUBLISHED' : 'FAILED',
            publishedAt: successfulPosts.length > 0 ? new Date() : null,
            // Note: results field doesn't exist in Post model, might need to store in errorMessage
            errorMessage: successfulPosts.length === 0 ? JSON.stringify(publishResults) : null,
          },
        });

        // Track analytics
        if (successfulPosts.length > 0) {
          await prisma.analyticsAggregation.create({
            data: {
              userId: scheduledPost.userId,
              type: 'SCHEDULED_POST_PUBLISHED',
              platform: successfulPosts.map(p => p.platform).join(','),
              startDate: new Date(),
              endDate: new Date(),
              data: {
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
        await prisma.post.update({
          where: { id: scheduledPost.id },
          data: {
            status: 'FAILED',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
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
    // TODO: Implement recurring schedules with Post model
    // Get all completed recurring schedules
    const completedRecurringSchedules: any[] = []; // await prisma.post.findMany({
    //   where: {
    //     // scheduleType: 'recurring', // This field doesn't exist in Post model
    //     status: 'PUBLISHED',
    //     publishedAt: {
    //       not: null,
    //     },
    //   },
    // });

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
          // TODO: Create recurring post with Post model
          // await prisma.post.create({
          //   data: {
          //     userId: schedule.userId,
          //     contentText: schedule.content,
          //     platforms: schedule.platforms,
          //     scheduledAt: nextTime,
          //     status: 'SCHEDULED',
          //     // metadata: schedule.metadata, // This field doesn't exist in Post model
          //     // scheduleType: 'recurring', // This field doesn't exist in Post model
          //     // scheduleData: scheduleData, // This field doesn't exist in Post model
          //     // status: 'pending', // This field doesn't exist in Post model
          //   },
          // });
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