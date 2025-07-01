import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit-log';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = params;
  const user = await prisma.user.update({ where: { id }, data: { role: 'USER' } });
  await logAudit({ action: 'user.demote', actorId: session.user.id, targetId: id, targetType: 'User' });
  return NextResponse.json({ success: true, user });
} 