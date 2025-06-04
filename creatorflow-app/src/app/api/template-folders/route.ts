import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';

// GET: List all folders for the user (flat)
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
  const folders = await prisma.templateFolder.findMany({ where: { userId } });
  return NextResponse.json(folders);
}

// POST: Create a new folder
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
  const { name, parentId } = await req.json();
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  const folder = await prisma.templateFolder.create({ data: { userId, name, parentId } });
  return NextResponse.json(folder, { status: 201 });
}

// PUT: Rename or move a folder
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
  const { id, name, parentId } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const folder = await prisma.templateFolder.update({ where: { id, userId }, data: { name, parentId } });
  return NextResponse.json(folder);
}

// DELETE: Delete a folder
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
  await prisma.templateFolder.delete({ where: { id, userId } });
  return NextResponse.json({ success: true });
}

// Move the helper functions to a separate file if needed
// These are not valid route handlers in Next.js App Router
export async function handleGetFolders({ req, getSession, prisma }: { req: any, getSession: any, prisma: any }) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  try {
    const folders = await prisma.templateFolder.findMany({ where: { userId: session.user.id } });
    return { status: 200, body: folders };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}
export async function handleCreateFolder({ req, getSession, prisma }: { req: any, getSession: any, prisma: any }) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { name, parentId } = await req.json();
  if (!name) return { status: 400, body: { error: 'Name required' } };
  try {
    const folder = await prisma.templateFolder.create({ data: { userId: session.user.id, name, parentId } });
    return { status: 201, body: folder };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}
export async function handleUpdateFolder({ req, getSession, prisma }: { req: any, getSession: any, prisma: any }) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { id, name, parentId } = await req.json();
  if (!id) return { status: 400, body: { error: 'Missing id' } };
  try {
    const folder = await prisma.templateFolder.update({ where: { id, userId: session.user.id }, data: { name, parentId } });
    return { status: 200, body: folder };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}
export async function handleDeleteFolder({ req, getSession, prisma }: { req: any, getSession: any, prisma: any }) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { id } = await req.json();
  if (!id) return { status: 400, body: { error: 'Missing id' } };
  try {
    await prisma.templateFolder.delete({ where: { id, userId: session.user.id } });
    return { status: 200, body: { success: true } };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}