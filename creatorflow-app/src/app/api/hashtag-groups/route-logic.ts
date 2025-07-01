import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface RouteContext {
  req: NextRequest;
  getSession: (req: NextRequest) => Promise<any>;
  prisma: PrismaClient;
}

export async function handleGetHashtagGroups({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  try {
    const groups = await prisma.hashtagGroup.findMany({ where: { userId: session.user.id } });
    return { status: 200, body: groups };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handleCreateHashtagGroup({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { name, hashtags, category = 'Uncategorized', tags = [] } = await req.json();
  if (!name || !Array.isArray(hashtags)) return { status: 400, body: { error: 'Name and hashtags are required' } };
  try {
    const group = await prisma.hashtagGroup.create({ data: { userId: session.user.id, name, hashtags, category, tags } });
    return { status: 201, body: group };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handleUpdateHashtagGroup({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { id, name, hashtags, category = 'Uncategorized', tags = [] } = await req.json();
  if (!id) return { status: 400, body: { error: 'ID is required' } };
  try {
    const group = await prisma.hashtagGroup.update({ where: { id, userId: session.user.id }, data: { name, hashtags, category, tags } });
    return { status: 200, body: group };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handleDeleteHashtagGroup({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { id } = await req.json();
  if (!id) return { status: 400, body: { error: 'ID is required' } };
  try {
    await prisma.hashtagGroup.delete({ where: { id, userId: session.user.id } });
    return { status: 200, body: { success: true } };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handlePatchHashtagGroup({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { id, isFavorite, isPinned } = await req.json();
  if (!id) return { status: 400, body: { error: 'ID is required' } };
  const data: { isFavorite?: boolean; isPinned?: boolean } = {};
  if (typeof isFavorite === 'boolean') data.isFavorite = isFavorite;
  if (typeof isPinned === 'boolean') data.isPinned = isPinned;
  if (!Object.keys(data).length) return { status: 400, body: { error: 'No fields to update' } };
  try {
    const group = await prisma.hashtagGroup.update({ where: { id, userId: session.user.id }, data });
    return { status: 200, body: group };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
} 