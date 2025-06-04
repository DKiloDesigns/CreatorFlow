import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

export async function GET(req: NextRequest) {
  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const collabs = await prisma.brandCollab.findMany({ where: { userId }, include: { posts: { include: { user: { select: { id: true, name: true, image: true } } } } } });
      return NextResponse.json(collabs);
    } else {
      return auth; // Error response from requireApiKey
    }
  }
  // Fallback to session auth
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const collabs = await prisma.brandCollab.findMany({ where: { userId }, include: { posts: { include: { user: { select: { id: true, name: true, image: true } } } } } });
  return NextResponse.json(collabs);
}

export async function POST(req: NextRequest) {
  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const data = await req.json();
      const collab = await prisma.brandCollab.create({ data: { ...data, userId } });
      return NextResponse.json(collab);
    } else {
      return auth; // Error response from requireApiKey
    }
  }
  // Fallback to session auth
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    const data = await req.json();
    const collab = await prisma.brandCollab.create({ data: { ...data, userId } });
    return NextResponse.json(collab);
  } catch (error) {
    console.error('Collab POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 