import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit-log';
import { fork, ChildProcess } from 'child_process';

const SOCKET_SERVER_PATH = process.env.SOCKET_SERVER_PATH || './scripts/announcement-socket-server.js';
let socketProcess: ChildProcess | null = null;
function getSocketProcess(): ChildProcess {
  if (!socketProcess) {
    socketProcess = fork(SOCKET_SERVER_PATH);
  }
  return socketProcess;
}
function broadcastAnnouncement(announcement: any): void {
  try {
    getSocketProcess().send({ type: 'broadcastAnnouncement', announcement });
  } catch (e) { console.error('Socket broadcast error', e); }
}

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  const isAdmin = user?.role === 'ADMIN';
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    include: { createdBy: { select: { id: true, name: true, email: true } }, readBy: { select: { id: true } } },
  });
  return NextResponse.json(announcements);
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  const isAdmin = user?.role === 'ADMIN';
  if (!user || !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { title, body, audience } = await req.json();
  const announcement = await prisma.announcement.create({
    data: { title, body, audience, createdById: session.user.id },
    include: { createdBy: { select: { id: true, name: true, email: true } }, readBy: { select: { id: true } } },
  });
  await logAudit({ action: 'announcement.create', actorId: session.user.id, targetId: announcement.id, targetType: 'Announcement', details: { title } });
  if (announcement.published) broadcastAnnouncement(announcement);
  return NextResponse.json(announcement);
}

export async function PUT(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  const isAdmin = user?.role === 'ADMIN';
  if (!user || !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id, title, body, audience, published } = await req.json();
  const announcement = await prisma.announcement.update({
    where: { id },
    data: { title, body, audience, published, publishedAt: published ? new Date() : null },
    include: { createdBy: { select: { id: true, name: true, email: true } }, readBy: { select: { id: true } } },
  });
  await logAudit({ action: 'announcement.update', actorId: session.user.id, targetId: id, targetType: 'Announcement', details: { title, published } });
  if (published) broadcastAnnouncement(announcement);
  return NextResponse.json(announcement);
}

export async function DELETE(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  const isAdmin = user?.role === 'ADMIN';
  if (!user || !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.announcement.delete({ where: { id } });
  await logAudit({ action: 'announcement.delete', actorId: session.user.id, targetId: id, targetType: 'Announcement' });
  return NextResponse.json({ success: true });
} 