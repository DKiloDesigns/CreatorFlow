import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    const platform = searchParams.get('platform') || 'all';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Build where clause
    const whereClause: any = {
      userId,
      status: 'PUBLISHED',
      publishedAt: {
        gte: startDate,
        lte: endDate
      }
    };

    if (platform !== 'all') {
      whereClause.platforms = { has: platform };
    }

    // Get posts for analysis
    const posts = await prisma.post.findMany({
      where: whereClause,
      select: {
        id: true,
        contentText: true,
        platforms: true,
        publishedAt: true,
        engagementRate: true,
        likes: true,
        comments: true,
        shares: true,
        views: true,
        reach: true,
        impressions: true
      }
    });

    // Calculate metrics
    const totalPosts = posts.length;
    const totalEngagement = posts.reduce((sum, post) => 
      sum + (post.likes || 0) + (post.comments || 0) + (post.shares || 0), 0
    );
    const avgEngagementRate = posts.length > 0 
      ? posts.reduce((sum, post) => sum + (post.engagementRate || 0), 0) / posts.length 
      : 0;
    const totalReach = posts.reduce((sum, post) => sum + (post.reach || 0), 0);
    const totalImpressions = posts.reduce((sum, post) => sum + (post.impressions || 0), 0);

    // Platform breakdown
    const platformStats: { [key: string]: { posts: number; engagement: number; reach: number } } = {};
    
    posts.forEach(post => {
      post.platforms.forEach((platform: string) => {
        if (!platformStats[platform]) {
          platformStats[platform] = { posts: 0, engagement: 0, reach: 0 };
        }
        platformStats[platform].posts++;
        platformStats[platform].engagement += (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
        platformStats[platform].reach += post.reach || 0;
      });
    });

    const platformBreakdown = Object.entries(platformStats).map(([platform, stats]) => ({
      platform,
      ...stats
    }));

    // Recent performance (last 7 days)
    const recentStartDate = new Date();
    recentStartDate.setDate(recentStartDate.getDate() - 7);
    
    const recentPosts = posts.filter(post => 
      post.publishedAt && new Date(post.publishedAt) >= recentStartDate
    );

    const recentPerformance = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayPosts = recentPosts.filter(post => 
        post.publishedAt && post.publishedAt.toISOString().startsWith(dateStr)
      );
      
      recentPerformance.push({
        date: dateStr,
        posts: dayPosts.length,
        engagement: dayPosts.reduce((sum, post) => 
          sum + (post.likes || 0) + (post.comments || 0) + (post.shares || 0), 0
        ),
        reach: dayPosts.reduce((sum, post) => sum + (post.reach || 0), 0)
      });
    }

    // Top performing posts
    const topPerformingPosts = posts
      .sort((a, b) => (b.engagementRate || 0) - (a.engagementRate || 0))
      .slice(0, 10)
      .map(post => ({
        id: post.id,
        content: post.contentText || '',
        platform: post.platforms[0] || 'unknown',
        engagement: (post.likes || 0) + (post.comments || 0) + (post.shares || 0),
        reach: post.reach || 0,
        publishedAt: post.publishedAt?.toISOString().split('T')[0] || ''
      }));

    // Mock audience growth data (in real app, this would come from platform APIs)
    const audienceGrowth = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      audienceGrowth.push({
        date: date.toISOString().split('T')[0],
        followers: Math.floor(Math.random() * 1000) + 5000,
        growth: Math.floor(Math.random() * 50) - 25
      });
    }

    return NextResponse.json({
      totalPosts,
      totalEngagement,
      avgEngagementRate,
      totalReach,
      totalImpressions,
      platformBreakdown,
      recentPerformance,
      topPerformingPosts,
      audienceGrowth
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 