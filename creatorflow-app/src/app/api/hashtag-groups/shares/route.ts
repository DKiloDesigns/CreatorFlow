import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';

// GET: List shares for a group or for the user
export async function GET(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId, email;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) { userId = auth.user.id; email = auth.user.email; }
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
    email = session.user.email;
  }
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');
  const type = searchParams.get('type');
  let where: any = {};
  if (groupId && type) {
    where = { [`${type}GroupId`]: groupId };
  } else {
    where = { OR: [{ userId }, { sharedWithEmail: email }] };
  }
  const shares = await prisma.templateShare.findMany({ where });
  return NextResponse.json(shares);
}

// POST: Create a new share
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
  const { groupId, type, sharedWithEmail, permissions } = await req.json();
  if (!groupId || !type || !sharedWithEmail || !permissions) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const data: any = { userId, sharedWithEmail, permissions, type };
  if (type === 'hashtag') data.hashtagGroupId = groupId;
  else if (type === 'caption') data.captionTemplateId = groupId;
  else return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  const share = await prisma.templateShare.create({ data });
  return NextResponse.json(share, { status: 201 });
}

// PUT: Update permissions for a share
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
  const { id, permissions } = await req.json();
  if (!id || !permissions) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const share = await prisma.templateShare.update({ where: { id }, data: { permissions } });
  return NextResponse.json(share);
}

// DELETE: Remove a share
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
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.templateShare.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 