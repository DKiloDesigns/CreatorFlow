import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';

// notifications JSON: { prefs: {mentions, comments, system}, list: [{id, text, read}] }

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { notifications: true },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user.notifications || {});
}

export async function PUT(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { prefs } = await req.json();
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { notifications: true },
  });
  const currentNotifications = currentUser?.notifications as any || {};
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { notifications: { ...currentNotifications, prefs } },
    select: { notifications: true },
  });
  return NextResponse.json(user.notifications);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { markAllRead } = await req.json();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { notifications: true },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  let notifications: any = user.notifications || {};
  if (markAllRead && notifications.list) {
    notifications.list = notifications.list.map((n: any) => ({ ...n, read: true }));
  }
  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { notifications },
    select: { notifications: true },
  });
  return NextResponse.json(updated.notifications);
} 