import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';

// Settings shape: { theme, language, notifications, dashboard, connected }

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { settings: true }, // TODO: Add 'settings' JSON field to User model if missing
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user.settings || {});
}

export async function PUT(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const settings = await req.json();
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { settings },
    select: { settings: true },
  });
  return NextResponse.json(user.settings);
} 