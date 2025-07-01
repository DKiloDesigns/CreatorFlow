import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { message } = await req.json();
  if (!message || message.length < 3) {
    return NextResponse.json({ error: 'Message too short' }, { status: 400 });
  }
  const feedback = await prisma.feedback.create({
    data: {
      userId: session.user.id,
      message,
    },
  });
  return NextResponse.json({ success: true, feedback });
} 