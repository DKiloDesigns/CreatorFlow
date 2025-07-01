import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface RouteContext {
  req: NextRequest;
  getSession: (req: NextRequest) => Promise<any>;
  prisma: PrismaClient;
}

export async function handleGetSuggestions({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const recent = searchParams.get('recent') === 'true';
  let where: any = { userId: session.user.id };
  if (category) where.category = category;
  try {
    if (recent) {
      const recentUsages = await prisma.templateUsage.findMany({
        where: { userId: session.user.id, type: 'caption' },
        orderBy: { usedAt: 'desc' },
        take: 10,
        select: { captionTemplateId: true },
      });
      const ids = recentUsages.map((u: any) => u.captionTemplateId).filter(Boolean);
      if (ids.length) {
        const templates = await prisma.captionTemplate.findMany({ where: { id: { in: ids } } });
        return { status: 200, body: templates.slice(0, 5) };
      }
    }
    const templates = await prisma.captionTemplate.findMany({
      where,
      orderBy: [
        { updatedAt: 'desc' },
      ],
      take: 5,
    });
    return { status: 200, body: templates };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
} 