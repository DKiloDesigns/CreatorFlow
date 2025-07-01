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
  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      select: { id: true, name: true, email: true, role: true, deactivated: true },
    }),
    prisma.user.count({ where }),
  ]);
  return NextResponse.json({ users, total });
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
    case 'promote':
      result = await prisma.user.updateMany({ where: { id: { in: ids } }, data: { role: 'ADMIN' } });
      break;
    case 'demote':
      result = await prisma.user.updateMany({ where: { id: { in: ids } }, data: { role: 'USER' } });
      break;
    case 'deactivate':
      result = await prisma.user.updateMany({ where: { id: { in: ids } }, data: { deactivated: true } });
      break;
    case 'reactivate':
      result = await prisma.user.updateMany({ where: { id: { in: ids } }, data: { deactivated: false } });
      break;
    case 'delete':
      result = await prisma.user.deleteMany({ where: { id: { in: ids } } });
      break;
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
  return NextResponse.json({ success: true, result });
} 