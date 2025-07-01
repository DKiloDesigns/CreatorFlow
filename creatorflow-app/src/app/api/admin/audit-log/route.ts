import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

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
  const actorId = searchParams.get('actor');
  const action = searchParams.get('action');
  const date = searchParams.get('date');
  const where: any = {};
  if (actorId) where.actorId = actorId;
  if (action) where.action = action;
  if (date) {
    const d = new Date(date);
    const nextDay = new Date(d);
    nextDay.setDate(d.getDate() + 1);
    where.createdAt = { gte: d, lt: nextDay };
  }
  const logs = await prisma.auditLog.findMany({
    where,
    select: {
      id: true,
      action: true,
      actor: { select: { id: true, name: true, email: true } },
      targetId: true,
      targetType: true,
      details: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json(logs);
} 