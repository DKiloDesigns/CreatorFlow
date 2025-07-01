const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create/update test user with full access and specific ID
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { 
      password: 'testpassword',
      name: 'Test User',
      plan: 'PRO',
      role: 'USER',
      twoFAEnabled: false,
      deactivated: false,
      settings: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      notificationPreferences: {
        announcements: { inApp: true, email: true },
        feedback: { inApp: true, email: false },
        posts: { inApp: true, email: true }
      }
    },
    create: {
      id: 'cmc8cqe1p0000rzhu0xg8jfxm', // Use the ID that NextAuth expects
      email: 'test@example.com',
      password: 'testpassword',
      name: 'Test User',
      plan: 'PRO',
      role: 'USER',
      twoFAEnabled: false,
      deactivated: false,
      settings: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      notificationPreferences: {
        announcements: { inApp: true, email: true },
        feedback: { inApp: true, email: false },
        posts: { inApp: true, email: true }
      }
    },
  });

  // Create some sample social accounts for the test user
  await prisma.socialAccount.upsert({
    where: { 
      userId_platform: { 
        userId: testUser.id, 
        platform: 'twitter' 
      } 
    },
    update: {},
    create: {
      userId: testUser.id,
      platform: 'twitter',
      platformUserId: '123456789',
      username: 'testuser_twitter',
      status: 'active'
    }
  });

  await prisma.socialAccount.upsert({
    where: { 
      userId_platform: { 
        userId: testUser.id, 
        platform: 'instagram' 
      } 
    },
    update: {},
    create: {
      userId: testUser.id,
      platform: 'instagram',
      platformUserId: '987654321',
      username: 'testuser_instagram',
      status: 'active'
    }
  });

  // Create some sample posts
  await prisma.post.createMany({
    data: [
      {
        userId: testUser.id,
        contentText: 'This is my first test post! 🎉',
        mediaUrls: [],
        platforms: ['twitter', 'instagram'],
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        views: 150,
        likes: 25,
        comments: 5,
        shares: 3,
        reach: 500,
        impressions: 750,
        engagementRate: 0.08
      },
      {
        userId: testUser.id,
        contentText: 'Working on some amazing content for CreatorFlow! 💪',
        mediaUrls: [],
        platforms: ['twitter'],
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 3600000), // 1 hour from now
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        impressions: 0,
        engagementRate: 0
      },
      {
        userId: testUser.id,
        contentText: 'Just finished setting up my CreatorFlow dashboard. This is going to be game-changing! 🚀',
        mediaUrls: [],
        platforms: ['instagram'],
        status: 'DRAFT',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        impressions: 0,
        engagementRate: 0
      }
    ],
    skipDuplicates: true
  });

  // Create some sample caption templates
  await prisma.captionTemplate.createMany({
    data: [
      {
        userId: testUser.id,
        name: 'Motivational Monday',
        content: 'Starting the week strong! 💪 What are your goals for this week? #MotivationMonday #Goals',
        category: 'Motivation',
        tags: ['motivation', 'monday', 'goals'],
        isFavorite: true
      },
      {
        userId: testUser.id,
        name: 'Behind the Scenes',
        content: 'Behind the scenes of creating amazing content! 🎬 Here\'s what goes into making it happen. #BehindTheScenes #ContentCreation',
        category: 'Behind the Scenes',
        tags: ['behind-the-scenes', 'content-creation', 'workflow']
      },
      {
        userId: testUser.id,
        name: 'Product Showcase',
        content: 'Check out this amazing product! 🔥 What do you think? #ProductShowcase #Review',
        category: 'Product',
        tags: ['product', 'showcase', 'review']
      }
    ],
    skipDuplicates: true
  });

  // Create some sample hashtag groups
  await prisma.hashtagGroup.createMany({
    data: [
      {
        userId: testUser.id,
        name: 'Tech & Innovation',
        hashtags: ['#tech', '#innovation', '#startup', '#entrepreneur', '#business'],
        category: 'Technology',
        isFavorite: true
      },
      {
        userId: testUser.id,
        name: 'Lifestyle & Wellness',
        hashtags: ['#lifestyle', '#wellness', '#health', '#fitness', '#mindfulness'],
        category: 'Lifestyle',
        isFavorite: false
      },
      {
        userId: testUser.id,
        name: 'Creative & Design',
        hashtags: ['#creative', '#design', '#art', '#inspiration', '#creativity'],
        category: 'Creative',
        isFavorite: true
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Test user and sample data created successfully!');
  console.log('📧 Email: test@example.com');
  console.log('🔑 Password: testpassword');
  console.log('👤 User ID:', testUser.id);
}

main().finally(() => prisma.$disconnect()); 