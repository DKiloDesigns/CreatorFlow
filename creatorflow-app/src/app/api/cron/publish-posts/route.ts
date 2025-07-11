import { NextResponse } from 'next/server';
import { PrismaClient, PostStatus } from '@prisma/client';
import { publishPost } from '@/lib/publishing';

const prisma = new PrismaClient();

// Enhanced authorization with multiple security layers
function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const vercelCronSecret = process.env.VERCEL_CRON_SECRET;
  
  if (!cronSecret && !vercelCronSecret) {
    console.warn('No CRON_SECRET or VERCEL_CRON_SECRET set. Cron endpoint is not secure.');
    return process.env.NODE_ENV !== 'production'; 
  }

  const authHeader = request.headers.get('authorization');
  const userAgent = request.headers.get('user-agent');
  
  // Check for Vercel Cron signature
  if (vercelCronSecret && authHeader === `Bearer ${vercelCronSecret}`) {
    return true;
  }
  
  // Check for custom cron secret
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }
  
  // Check for Vercel Cron User-Agent
  if (userAgent?.includes('Vercel')) {
    return true;
  }

  return false;
}

// Retry logic for failed posts
async function retryPublishPost(postId: string, userId: string, maxRetries: number = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await publishPost(postId, userId);
      return true;
    } catch (error) {
      console.error(`Attempt ${attempt} failed for post ${postId}:`, error);
      
      if (attempt === maxRetries) {
        // Mark as failed after all retries
        await prisma.post.update({
          where: { id: postId },
          data: { 
            status: PostStatus.FAILED,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          }
        });
        return false;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  return false;
}

// Handle repost scheduling
async function handleReposts(): Promise<number> {
  let repostedCount = 0;
  
  try {
    // Find posts that are reposts and need to be rescheduled
    const repostPosts = await prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        isRepost: true,
        repostCount: {
          gt: 0
        },
        publishedAt: {
          not: null
        }
      }
    });

    for (const post of repostPosts) {
      if (post.repostInterval && post.repostCount && post.publishedAt) {
        const nextRepostDate = new Date(post.publishedAt);
        nextRepostDate.setDate(nextRepostDate.getDate() + post.repostInterval);
        
        // If it's time for the next repost
        if (nextRepostDate <= new Date()) {
          // Create new scheduled post
          await prisma.post.create({
            data: {
              userId: post.userId,
              contentText: post.contentText,
              mediaUrls: post.mediaUrls,
              platforms: post.platforms,
              status: PostStatus.SCHEDULED,
              scheduledAt: nextRepostDate,
              hashtags: post.hashtags,
              mentions: post.mentions,
              location: post.location,
              isRepost: true,
              repostInterval: post.repostInterval,
              repostCount: post.repostCount - 1,
              parentPostId: post.id // Link to original post
            }
          });
          
          // Update repost count on original post
          await prisma.post.update({
            where: { id: post.id },
            data: { repostCount: post.repostCount - 1 }
          });
          
          repostedCount++;
        }
      }
    }
  } catch (error) {
    console.error('Error handling reposts:', error);
  }
  
  return repostedCount;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    console.log('Cron job call unauthorized.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Cron job triggered: Checking for scheduled posts...');

  let processedCount = 0;
  let failedCount = 0;
  let repostedCount = 0;
  let errorOccurred = false;

  try {
    // Handle reposts first
    repostedCount = await handleReposts();
    console.log(`Scheduled ${repostedCount} reposts`);

    const now = new Date();
    const postsToPublish = await prisma.post.findMany({
      where: {
        status: PostStatus.SCHEDULED,
        scheduledAt: {
          lte: now, // Less than or equal to the current time
        },
      },
      select: { id: true, userId: true }, // Only select IDs initially
    });

    if (postsToPublish.length === 0) {
      console.log('No posts scheduled for publication at this time.');
      return NextResponse.json({ 
        message: 'No posts to publish.',
        repostedCount 
      });
    }

    console.log(`Found ${postsToPublish.length} posts potentially ready for publishing.`);

    // Process posts with enhanced error handling
    for (const postRef of postsToPublish) {
      console.log(`Processing post ID: ${postRef.id}, User ID: ${postRef.userId}`);
      try {
        // Update status to PUBLISHING with optimistic locking
        const updateResult = await prisma.post.updateMany({
          where: {
             id: postRef.id,
             status: PostStatus.SCHEDULED, // Ensure it wasn't picked up by another process
          },
          data: { status: PostStatus.PUBLISHING },
        });

        if (updateResult.count === 1) {
           console.log(`   -> Marked post ${postRef.id} as PUBLISHING.`);
           
           // Try to publish with retry logic
           const success = await retryPublishPost(postRef.id, postRef.userId);
           
           if (success) {
             processedCount++;
             console.log(`   -> Successfully published post ${postRef.id}`);
           } else {
             failedCount++;
             console.log(`   -> Failed to publish post ${postRef.id} after retries`);
           }
        } else {
            console.log(`   -> Post ${postRef.id} was likely already processed or status changed. Skipping.`);
        }

      } catch (individualError) {
        console.error(`   -> Failed to process post ${postRef.id}:`, individualError);
        errorOccurred = true;
        failedCount++;
        
        // Mark as failed
        await prisma.post.update({
          where: { id: postRef.id },
          data: { 
            status: PostStatus.FAILED,
            errorMessage: individualError instanceof Error ? individualError.message : 'Unknown error'
          }
        });
      }
    }

    console.log(`Cron job finished processing. Processed ${processedCount} posts, failed ${failedCount} posts.`);
    return NextResponse.json({
      message: `Processed ${processedCount} of ${postsToPublish.length} found posts.`,
      stats: {
        processed: processedCount,
        failed: failedCount,
        reposted: repostedCount,
        total: postsToPublish.length
      },
      errors: errorOccurred ? "Some errors occurred during processing. Check logs." : undefined
    });

  } catch (error) {
    console.error('Error fetching or processing scheduled posts batch:', error);
    return NextResponse.json(
      { error: 'Internal Server Error processing posts batch' },
      { status: 500 }
    );
  }
}

// Add basic configuration for Vercel Cron Job (add this to vercel.json)
/*
{
  "crons": [
    {
      "path": "/api/cron/publish-posts",
      "schedule": "* * * * *" // Run every minute
    }
  ]
}
*/

// Remember to set the CRON_SECRET environment variable in Vercel! 