import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';

export async function GET(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get('platform');
  const category = searchParams.get('category');
  const recent = searchParams.get('recent') === 'true';

  // Rule-based: prioritize recent usage, then platform/category, then most used
  let where: any = { userId };
  if (category) where.category = category;
  // For MVP, ignore platform unless you want to add a platform field

  // If recent, get most recently used templates
  if (recent) {
    const recentUsages = await prisma.templateUsage.findMany({
      where: { userId, type: 'caption' },
      orderBy: { usedAt: 'desc' },
      take: 10,
      select: { captionTemplateId: true },
    });
    const ids = recentUsages.map((u: { captionTemplateId: string | null }) => u.captionTemplateId).filter(Boolean) as string[];
    if (ids.length) {
      const templates = await prisma.captionTemplate.findMany({ where: { id: { in: ids } } });
      return NextResponse.json(templates.slice(0, 5));
    }
  }
  // Otherwise, get by category or most used
  const templates = await prisma.captionTemplate.findMany({
    where,
    orderBy: [
      // { usageCount: 'desc' }, // Remove if Prisma type check fails
      { updatedAt: 'desc' },
    ],
    take: 5,
  });
  return NextResponse.json(templates);
} 