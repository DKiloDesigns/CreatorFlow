import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  const userId = session.user.id;
  const isAdmin = user?.role === 'ADMIN';
  const announcements = await prisma.announcement.findMany({
    where: {
      published: true,
      OR: [
        { audience: null },
        { audience: 'all' },
        { audience: 'admins', ...(isAdmin ? {} : { id: '__never__' }) },
        { audience: `user:${userId}` },
      ],
    },
    orderBy: { publishedAt: 'desc' },
    include: { createdBy: { select: { id: true, name: true, email: true } }, readBy: { select: { id: true } } },
  });
  return NextResponse.json(announcements);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await prisma.announcement.update({
    where: { id },
    data: { readBy: { connect: { id: session.user.id } } },
  });
  return NextResponse.json({ success: true });
} 