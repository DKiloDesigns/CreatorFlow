import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client'; // Adjust import path if needed based on actual location
// import { PostStatus } from '@prisma/client';
import { PrismaClient, PostStatus } from '@prisma/client';
import { publishPost } from '@/lib/publishing'; // Assuming '@/' maps to 'src/' in tsconfig

const prisma = new PrismaClient();

// Recommended: Secure this endpoint!
// Vercel Cron Job Protection: https://vercel.com/docs/cron-jobs/security#securing-cron-jobs
// Check for a secret token passed in the Authorization header
function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.warn('CRON_SECRET is not set. Cron endpoint is not secure.');
    // In production, you should probably return false here or throw an error.
    // For development, we might allow it to proceed, but log a warning.
    return process.env.NODE_ENV !== 'production'; 
  }

  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
// ^ Using GET as it's simpler for Vercel Cron Jobs unless a body is needed.
// If using POST, change method and potentially how secret is passed/checked.

  if (!isAuthorized(request)) {
    console.log('Cron job call unauthorized.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Cron job triggered: Checking for scheduled posts...');

  let processedCount = 0;
  let errorOccurred = false;

  try {
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
      return NextResponse.json({ message: 'No posts to publish.' });
    }

    console.log(`Found ${postsToPublish.length} posts potentially ready for publishing.`);

    // Process posts one by one to avoid overwhelming resources or hitting function timeouts
    // In a production system, consider pushing these to a queue (e.g., BullMQ, Vercel Functions background tasks)
    for (const postRef of postsToPublish) {
      console.log(`Processing post ID: ${postRef.id}, User ID: ${postRef.userId}`);
      try {
        // Update status to PUBLISHING *before* calling publishPost
        // Use an updateMany with a condition to ensure we only update if it's still SCHEDULED
        const updateResult = await prisma.post.updateMany({
          where: {
             id: postRef.id,
             status: PostStatus.SCHEDULED, // Ensure it wasn't picked up by another process
          },
          data: { status: PostStatus.PUBLISHING },
        });

        // If the update affected 1 row, it means we successfully claimed this post for publishing
        if (updateResult.count === 1) {
           console.log(`   -> Marked post ${postRef.id} as PUBLISHING.`);
           // Now call the actual publishing logic (which handles final status updates)
           await publishPost(postRef.id); 
           processedCount++;
        } else {
            console.log(`   -> Post ${postRef.id} was likely already processed or status changed. Skipping.`);
        }

      } catch (individualError) {
        console.error(`   -> Failed to process post ${postRef.id}:`, individualError);
        errorOccurred = true;
        // The error inside publishPost should handle marking the specific post as FAILED
        // We just note here that *some* error occurred during the batch.
      }
    }

    console.log(`Cron job finished processing. Processed ${processedCount} posts.`);
    return NextResponse.json({
      message: `Processed ${processedCount} of ${postsToPublish.length} found posts.`,
      errors: errorOccurred ? "Some errors occurred during processing. Check logs." : undefined
    });

  } catch (error) {
    console.error('Error fetching or processing scheduled posts batch:', error);
    // Consider more specific error handling/logging
    return NextResponse.json(
      { error: 'Internal Server Error processing posts batch' },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma Client is disconnected
    // await prisma.$disconnect(); // Might not be necessary depending on deployment environment (e.g., serverless)
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