import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';

// GET: List all caption templates for the user
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
  const templates = await prisma.captionTemplate.findMany({ where: { userId } });
  return NextResponse.json(templates);
}

// POST: Create a new caption template
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
  const { name, content, category = 'Uncategorized', tags = [] } = await req.json();
  if (!name || !content) return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
  const template = await prisma.captionTemplate.create({ data: { userId, name, content, category, tags } });
  return NextResponse.json(template, { status: 201 });
}

// PUT: Update a caption template
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
  const { id, name, content, category = 'Uncategorized', tags = [] } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  const template = await prisma.captionTemplate.update({ where: { id, userId }, data: { name, content, category, tags } });
  return NextResponse.json(template);
}

// DELETE: Delete a caption template
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
  await prisma.captionTemplate.delete({ where: { id, userId } });
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
  const template = await prisma.captionTemplate.update({ where: { id, userId }, data });
  return NextResponse.json(template);
} 