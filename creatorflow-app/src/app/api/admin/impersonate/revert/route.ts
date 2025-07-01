import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit-log';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Clear impersonation cookie
  const res = NextResponse.json({ success: true });
  res.cookies.set('impersonate_user_id', '', { path: '/', httpOnly: true, maxAge: 0, sameSite: 'lax' });
  await logAudit({ action: 'impersonate.revert', actorId: session.user.id });
  return res;
} 