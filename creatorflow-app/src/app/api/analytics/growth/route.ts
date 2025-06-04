import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

export async function GET(req: NextRequest) {
  // Mock data toggle for demo mode
  const { searchParams } = new URL(req.url);
  if (searchParams.get('mock') === '1') {
    return NextResponse.json({
      facebook: [
        { date: '2024-05-01', followers: 1200 },
        { date: '2024-06-01', followers: 1350 },
        { date: '2024-07-01', followers: 1500 }
      ],
      instagram: [
        { date: '2024-05-01', followers: 800 },
        { date: '2024-06-01', followers: 950 },
        { date: '2024-07-01', followers: 1100 }
      ],
      tiktok: [
        { date: '2024-05-01', followers: 400 },
        { date: '2024-06-01', followers: 600 },
        { date: '2024-07-01', followers: 900 }
      ]
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
      if (platform) where.platform = platform;
      if (start || end) {
        where.date = {};
        if (start) where.date.gte = new Date(start);
        if (end) where.date.lte = new Date(end);
      }
      const metrics = await prisma.audienceMetric.findMany({ where, orderBy: { date: 'asc' } });
      // Group by platform
      const grouped: Record<string, { date: string, followers: number }[]> = {};
      for (const m of metrics) {
        if (!grouped[m.platform]) grouped[m.platform] = [];
        grouped[m.platform].push({ date: m.date.toISOString(), followers: m.followers });
      }
      return NextResponse.json(grouped);
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
    if (platform) where.platform = platform;
    if (start || end) {
      where.date = {};
      if (start) where.date.gte = new Date(start);
      if (end) where.date.lte = new Date(end);
    }
    const metrics = await prisma.audienceMetric.findMany({ where, orderBy: { date: 'asc' } });
    // Group by platform
    const grouped: Record<string, { date: string, followers: number }[]> = {};
    for (const m of metrics) {
      if (!grouped[m.platform]) grouped[m.platform] = [];
      grouped[m.platform].push({ date: m.date.toISOString(), followers: m.followers });
    }
    return NextResponse.json(grouped);
  } catch (error) {
    console.error('Analytics growth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 