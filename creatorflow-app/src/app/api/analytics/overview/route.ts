import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

export async function GET(req: NextRequest) {
  // Mock data toggle for demo mode
  const { searchParams } = new URL(req.url);
  if (searchParams.get('mock') === '1') {
    return NextResponse.json({
      totalPosts: 42,
      totalViews: 12345,
      totalEngagements: 6789,
      avgEngagementRate: 161.64
    });
  }
  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const { searchParams } = new URL(req.url);
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
        select: {
          views: true,
          likes: true,
          comments: true,
          shares: true,
        },
      });
      const totalPosts = posts.length;
      const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalEngagements = posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);
      const avgEngagementRate = totalPosts ? (totalEngagements / totalPosts) : 0;
      return NextResponse.json({ totalPosts, totalViews, totalEngagements, avgEngagementRate });
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
      select: {
        views: true,
        likes: true,
        comments: true,
        shares: true,
      },
    });
    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalEngagements = posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);
    const avgEngagementRate = totalPosts ? (totalEngagements / totalPosts) : 0;
    return NextResponse.json({ totalPosts, totalViews, totalEngagements, avgEngagementRate });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 