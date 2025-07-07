import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit-log';

export async function POST(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = context.params;
  const feedback = await prisma.feedback.update({ where: { id }, data: { resolved: true } });
  await logAudit({ action: 'feedback.resolve', actorId: session.user.id, targetId: id, targetType: 'Feedback' });
  return NextResponse.json({ success: true, feedback });
} 