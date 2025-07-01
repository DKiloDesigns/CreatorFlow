import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, notificationPreferences: true } as any,
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { name, image, notificationPreferences } = await req.json();
  let data: any = {};
  if (name !== undefined) data.name = name;
  if (image !== undefined) data.image = image;
  if (notificationPreferences !== undefined) {
    // Merge with existing
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { notificationPreferences: true } as any });
    data.notificationPreferences = { ...(user?.notificationPreferences || {}), ...notificationPreferences };
  }
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, name: true, email: true, image: true, notificationPreferences: true } as any,
  });
  return NextResponse.json(user);
} 