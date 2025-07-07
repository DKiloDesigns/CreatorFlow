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
  // Prevent impersonating another admin
  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (target?.role === 'ADMIN') {
    return NextResponse.json({ error: 'Cannot impersonate another admin' }, { status: 403 });
  }
  // Set impersonation cookie
  const res = NextResponse.json({ success: true });
  res.cookies.set('impersonate_user_id', id, { path: '/', httpOnly: true, sameSite: 'lax' });
  await logAudit({ action: 'impersonate.start', actorId: session.user.id, targetId: id, targetType: 'User' });
  return res;
} 