import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface RouteContext {
  req: NextRequest;
  getSession: (req: NextRequest) => Promise<any>;
  prisma: PrismaClient;
}

export async function handleGetCaptionTemplates({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  try {
    const templates = await prisma.captionTemplate.findMany({ where: { userId: session.user.id } });
    return { status: 200, body: templates };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handleCreateCaptionTemplate({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { name, content, category = 'Uncategorized', tags = [] } = await req.json();
  if (!name || !content) return { status: 400, body: { error: 'Name and content are required' } };
  try {
    const template = await prisma.captionTemplate.create({ data: { userId: session.user.id, name, content, category, tags } });
    return { status: 201, body: template };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handleUpdateCaptionTemplate({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { id, name, content, category = 'Uncategorized', tags = [] } = await req.json();
  if (!id) return { status: 400, body: { error: 'ID is required' } };
  try {
    const template = await prisma.captionTemplate.update({ where: { id, userId: session.user.id }, data: { name, content, category, tags } });
    return { status: 200, body: template };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handleDeleteCaptionTemplate({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { id } = await req.json();
  if (!id) return { status: 400, body: { error: 'ID is required' } };
  try {
    await prisma.captionTemplate.delete({ where: { id, userId: session.user.id } });
    return { status: 200, body: { success: true } };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handlePatchCaptionTemplate({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { id, isFavorite, isPinned } = await req.json();
  if (!id) return { status: 400, body: { error: 'ID is required' } };
  const data: { isFavorite?: boolean; isPinned?: boolean } = {};
  if (typeof isFavorite === 'boolean') data.isFavorite = isFavorite;
  if (typeof isPinned === 'boolean') data.isPinned = isPinned;
  if (!Object.keys(data).length) return { status: 400, body: { error: 'No fields to update' } };
  try {
    const template = await prisma.captionTemplate.update({ where: { id, userId: session.user.id }, data });
    return { status: 200, body: template };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
} 