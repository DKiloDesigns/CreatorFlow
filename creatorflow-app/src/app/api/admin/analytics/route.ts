import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { subDays, startOfDay } from 'date-fns';

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
}

function parseRange(range: string | null) {
  if (!range) return 30;
  if (range.endsWith('d')) return parseInt(range.replace('d', ''), 10);
  if (range.endsWith('w')) return parseInt(range.replace('w', ''), 10) * 7;
  if (range.endsWith('m')) return parseInt(range.replace('m', ''), 10) * 30;
  return 30;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const range = parseRange(searchParams.get('range'));
  const metric = searchParams.get('metric');
  const now = new Date();
  const start = startOfDay(subDays(now, range - 1));

  // Time series for users, feedback, posts, audience
  const userSeries = await prisma.$queryRawUnsafe<any[]>(`
    SELECT DATE_TRUNC('day', "createdAt") AS day, COUNT(*) AS count
    FROM "User"
    WHERE "createdAt" >= $1
    GROUP BY day ORDER BY day ASC
  `, start);
  const feedbackSeries = await prisma.$queryRawUnsafe<any[]>(`
    SELECT DATE_TRUNC('day', "createdAt") AS day, COUNT(*) AS count
    FROM "Feedback"
    WHERE "createdAt" >= $1
    GROUP BY day ORDER BY day ASC
  `, start);
  const postSeries = await prisma.$queryRawUnsafe<any[]>(`
    SELECT DATE_TRUNC('day', "createdAt") AS day, COUNT(*) AS count
    FROM "Post"
    WHERE "createdAt" >= $1
    GROUP BY day ORDER BY day ASC
  `, start);
  const audienceSeries = await prisma.audienceMetric.groupBy({
    by: ['date'],
    _sum: { followers: true },
    where: { date: { gte: start } },
    orderBy: { date: 'asc' },
  });

  // Top users by posts
  const topUsers = await prisma.user.findMany({
    orderBy: [{ posts: { _count: 'desc' } }],
    take: 5,
    select: { id: true, name: true, email: true, posts: { select: { id: true } } },
  });
  // Top users by engagement (sum of likes+comments+shares on posts)
  const topEngagement = await prisma.user.findMany({
    take: 5,
    select: {
      id: true, name: true, email: true,
      posts: { select: { likes: true, comments: true, shares: true } },
    },
  });
  const topEngagementUsers = topEngagement.map(u => ({
    ...u,
    engagement: u.posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0),
  })).sort((a, b) => b.engagement - a.engagement).slice(0, 5);

  // Platform breakdown (posts per platform)
  const platformBreakdown = await prisma.$queryRawUnsafe<any[]>(`
    SELECT unnest("platforms") AS platform, COUNT(*) AS count
    FROM "Post"
    WHERE "createdAt" >= $1
    GROUP BY platform
    ORDER BY count DESC
  `, start);

  // Totals (for summary cards)
  const [totalUsers, newUsers, totalFeedback, newFeedback, totalPosts, newPosts] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfDay(subDays(now, 6)) } } }),
    prisma.feedback.count(),
    prisma.feedback.count({ where: { createdAt: { gte: startOfDay(subDays(now, 6)) } } }),
    prisma.post.count(),
    prisma.post.count({ where: { createdAt: { gte: startOfDay(subDays(now, 6)) } } }),
  ]);

  return NextResponse.json({
    totalUsers,
    newUsersThisWeek: newUsers,
    totalFeedback,
    newFeedbackThisWeek: newFeedback,
    totalPosts,
    newPostsThisWeek: newPosts,
    userSeries,
    feedbackSeries,
    postSeries,
    audienceSeries,
    topUsers,
    topEngagementUsers,
    platformBreakdown,
  });
} 