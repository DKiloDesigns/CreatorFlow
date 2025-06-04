import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

export async function GET(req: NextRequest) {
  // Mock data toggle for demo mode
  const { searchParams } = new URL(req.url);
  if (searchParams.get('mock') === '1') {
    return NextResponse.json({
      facebook: { posts: 12, views: 3400, likes: 800, comments: 120, shares: 40 },
      instagram: { posts: 10, views: 2900, likes: 700, comments: 90, shares: 30 },
      tiktok: { posts: 8, views: 2100, likes: 600, comments: 60, shares: 20 }
    });
  }
  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const { searchParams } = new URL(req.url);
      const start = searchParams.get('start');
      const end = searchParams.get('end');
      const where: any = { userId };
      if (start || end) {
        where.publishedAt = {};
        if (start) where.publishedAt.gte = new Date(start);
        if (end) where.publishedAt.lte = new Date(end);
      }
      const posts = await prisma.post.findMany({ where });
      // Aggregate by platform
      const platformStats: Record<string, { posts: number, views: number, likes: number, comments: number, shares: number }> = {};
      for (const post of posts) {
        for (const platform of post.platforms) {
          if (!platformStats[platform]) platformStats[platform] = { posts: 0, views: 0, likes: 0, comments: 0, shares: 0 };
          platformStats[platform].posts += 1;
          platformStats[platform].views += post.views || 0;
          platformStats[platform].likes += post.likes || 0;
          platformStats[platform].comments += post.comments || 0;
          platformStats[platform].shares += post.shares || 0;
        }
      }
      return NextResponse.json(platformStats);
    } else {
      return auth; // Error response from requireApiKey
    }
  }
  // Fallback to session auth
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const where: any = { userId };
    if (start || end) {
      where.publishedAt = {};
      if (start) where.publishedAt.gte = new Date(start);
      if (end) where.publishedAt.lte = new Date(end);
    }
    const posts = await prisma.post.findMany({ where });
    // Aggregate by platform
    const platformStats: Record<string, { posts: number, views: number, likes: number, comments: number, shares: number }> = {};
    for (const post of posts) {
      for (const platform of post.platforms) {
        if (!platformStats[platform]) platformStats[platform] = { posts: 0, views: 0, likes: 0, comments: 0, shares: 0 };
        platformStats[platform].posts += 1;
        platformStats[platform].views += post.views || 0;
        platformStats[platform].likes += post.likes || 0;
        platformStats[platform].comments += post.comments || 0;
        platformStats[platform].shares += post.shares || 0;
      }
    }
    return NextResponse.json(platformStats);
  } catch (error) {
    console.error('Analytics platform-breakdown error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 