import cron from 'node-cron';
import { PrismaClient, PostStatus } from '@prisma/client';
import { publishPost } from '../src/lib/publishing';

const prisma = new PrismaClient();

async function processScheduledPosts() {
  const now = new Date();
  try {
    const posts = await prisma.post.findMany({
      where: {
        scheduledAt: { lte: now },
        status: PostStatus.SCHEDULED,
      },
    });
    if (posts.length === 0) {
      console.log(`[${now.toISOString()}] No scheduled posts to publish.`);
      return;
    }
    for (const post of posts) {
      try {
        await prisma.post.update({
          where: { id: post.id },
          data: { status: PostStatus.PUBLISHING },
        });
        await publishPost(post.id);
        console.log(`[${now.toISOString()}] Published post ${post.id}`);
      } catch (err) {
        console.error(`[${now.toISOString()}] Error publishing post ${post.id}:`, err);
      }
    }
  } catch (err) {
    console.error(`[${now.toISOString()}] Error fetching scheduled posts:`, err);
  }
}

// Run every minute
cron.schedule('* * * * *', processScheduledPosts);

console.log('Scheduled post publisher started. Running every minute.'); 