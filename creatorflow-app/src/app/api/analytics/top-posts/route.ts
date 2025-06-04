import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

export async function GET(req: NextRequest) {
  // Mock data toggle for demo mode
  const { searchParams } = new URL(req.url);
  if (searchParams.get('mock') === '1') {
    return NextResponse.json([
      {
        id: 'post1',
        title: 'How to Grow on Instagram',
        platforms: ['instagram'],
        views: 3200,
        likes: 420,
        comments: 37,
        shares: 12,
        publishedAt: '2024-06-01T12:00:00Z'
      },
      {
        id: 'post2',
        title: 'TikTok Trends 2024',
        platforms: ['tiktok'],
        views: 2100,
        likes: 310,
        comments: 22,
        shares: 8,
        publishedAt: '2024-06-10T15:00:00Z'
      },
      {
        id: 'post3',
        title: 'Facebook Ads Secrets',
        platforms: ['facebook'],
        views: 1800,
        likes: 250,
        comments: 18,
        shares: 5,
        publishedAt: '2024-06-15T09:00:00Z'
      }
    ]);
  }
  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const { searchParams } = new URL(req.url);
      const limit = parseInt(searchParams.get('limit') || '5', 10);
      const platform = searchParams.get('platform');
      const start = searchParams.get('start');
      const end = searchParams.get('end');
      const where: any = { userId };
      if (platform) where.platforms = { has: platform };
      if (start || end) {
        where.publishedAt = {};
        if (start) where.publishedAt.gte = new Date(start);
        if (end) where.publishedAt.lte = new Date(end);
      }
      const posts = await prisma.post.findMany({
        where,
        orderBy: [
          { likes: 'desc' },
          { comments: 'desc' },
          { shares: 'desc' },
          { views: 'desc' },
        ],
        take: limit,
      });
      return NextResponse.json(posts);
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
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const platform = searchParams.get('platform');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const where: any = { userId };
    if (platform) where.platforms = { has: platform };
    if (start || end) {
      where.publishedAt = {};
      if (start) where.publishedAt.gte = new Date(start);
      if (end) where.publishedAt.lte = new Date(end);
    }
    const posts = await prisma.post.findMany({
      where,
      orderBy: [
        { likes: 'desc' },
        { comments: 'desc' },
        { shares: 'desc' },
        { views: 'desc' },
      ],
      take: limit,
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Analytics top-posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 