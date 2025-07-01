import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status');
  const where: any = {};
  if (q) {
    where.message = { contains: q, mode: 'insensitive' };
  }
  if (status === 'resolved') where.resolved = true;
  if (status === 'unresolved') where.resolved = false;
  const [feedback, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.feedback.count({ where }),
  ]);
  return NextResponse.json({ feedback, total });
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { action, ids } = await req.json();
  if (!Array.isArray(ids) || !action) return NextResponse.json({ error: 'Missing ids or action' }, { status: 400 });
  let result;
  switch (action) {
    case 'resolve':
      result = await prisma.feedback.updateMany({ where: { id: { in: ids } }, data: { resolved: true } });
      break;
    case 'unresolve':
      result = await prisma.feedback.updateMany({ where: { id: { in: ids } }, data: { resolved: false } });
      break;
    case 'delete':
      result = await prisma.feedback.deleteMany({ where: { id: { in: ids } } });
      break;
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
  return NextResponse.json({ success: true, result });
} 