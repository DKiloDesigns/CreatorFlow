import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const apiKeys = await prisma.apiKey.findMany({ where: { userId: session.user.id }, select: { id: true, key: true, name: true, createdAt: true, revokedAt: true } });
  return NextResponse.json(apiKeys);
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // Check if user has a paid plan
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true } });
  if (!user || user.plan === 'Free') {
    return NextResponse.json({ error: 'AI Agent API access requires a paid plan.' }, { status: 402 });
  }
  const { name } = await req.json();
  const key = crypto.randomBytes(32).toString('hex');
  const apiKey = await prisma.apiKey.create({ data: { userId: session.user.id, key, name } });
  return NextResponse.json({ id: apiKey.id, key: apiKey.key, name: apiKey.name, createdAt: apiKey.createdAt });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const apiKey = await prisma.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
  return NextResponse.json({ success: true });
} 