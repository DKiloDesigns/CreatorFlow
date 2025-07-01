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
  const userId = searchParams.get('user');
  const where: any = {};
  if (userId) where.userId = userId;
  const sessions = await prisma.session.findMany({
    where,
    select: {
      id: true,
      sessionToken: true,
      expires: true,
      user: { select: { id: true, name: true, email: true, role: true, deactivated: true, createdAt: true } },
    },
    orderBy: { expires: 'desc' },
  });
  return NextResponse.json(sessions);
} 