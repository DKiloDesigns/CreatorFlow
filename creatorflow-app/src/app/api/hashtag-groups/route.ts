import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';

// GET: List all hashtag groups for the user
export async function GET(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const groups = await prisma.hashtagGroup.findMany({ where: { userId } });
  return NextResponse.json(groups);
}

// POST: Create a new hashtag group
export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const { name, hashtags, category = 'Uncategorized', tags = [] } = await req.json();
  if (!name || !Array.isArray(hashtags)) return NextResponse.json({ error: 'Name and hashtags are required' }, { status: 400 });
  const group = await prisma.hashtagGroup.create({ data: { userId, name, hashtags, category, tags } });
  return NextResponse.json(group, { status: 201 });
}

// PUT: Update a hashtag group
export async function PUT(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const { id, name, hashtags, category = 'Uncategorized', tags = [] } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  const group = await prisma.hashtagGroup.update({ where: { id, userId }, data: { name, hashtags, category, tags } });
  return NextResponse.json(group);
}

// DELETE: Delete a hashtag group
export async function DELETE(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  await prisma.hashtagGroup.delete({ where: { id, userId } });
  return NextResponse.json({ success: true });
}

// PATCH: Toggle isFavorite or isPinned
export async function PATCH(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const { id, isFavorite, isPinned } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  const data: any = {};
  if (typeof isFavorite === 'boolean') data.isFavorite = isFavorite;
  if (typeof isPinned === 'boolean') data.isPinned = isPinned;
  if (!Object.keys(data).length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  const group = await prisma.hashtagGroup.update({ where: { id, userId }, data });
  return NextResponse.json(group);
} 