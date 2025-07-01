import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { action, payload } = await req.json();
  const userId = session.user.id;

  switch (action) {
    case 'changePassword': {
      const { newPassword } = payload;
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: 'Password too short' }, { status: 400 });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
      return NextResponse.json({ success: true });
    }
    case 'toggle2FA': {
      const { enable } = payload;
      await prisma.user.update({ where: { id: userId }, data: { twoFAEnabled: !!enable } });
      return NextResponse.json({ success: true });
    }
    case 'deleteAccount': {
      await prisma.user.delete({ where: { id: userId } });
      return NextResponse.json({ success: true });
    }
    // Session revoke would be handled by NextAuth session management
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
} 