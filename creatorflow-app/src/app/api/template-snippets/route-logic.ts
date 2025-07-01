import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface RouteContext {
  req: NextRequest;
  getSession: (req: NextRequest) => Promise<any>;
  prisma: PrismaClient;
}

export async function handleGetSnippets({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  try {
    const snippets = await prisma.templateSnippet.findMany({ where: { userId: session.user.id } });
    return { status: 200, body: snippets };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handleCreateSnippet({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { name, content } = await req.json();
  if (!name || !content) return { status: 400, body: { error: 'Name and content required' } };
  try {
    const snippet = await prisma.templateSnippet.create({ data: { userId: session.user.id, name, content } });
    return { status: 201, body: snippet };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handleUpdateSnippet({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { id, name, content } = await req.json();
  if (!id || !name || !content) return { status: 400, body: { error: 'Missing fields' } };
  try {
    const snippet = await prisma.templateSnippet.update({ where: { id, userId: session.user.id }, data: { name, content } });
    return { status: 200, body: snippet };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
}

export async function handleDeleteSnippet({ req, getSession, prisma }: RouteContext) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { id } = await req.json();
  if (!id) return { status: 400, body: { error: 'Missing id' } };
  try {
    await prisma.templateSnippet.delete({ where: { id, userId: session.user.id } });
    return { status: 200, body: { success: true } };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect?.();
  }
} 