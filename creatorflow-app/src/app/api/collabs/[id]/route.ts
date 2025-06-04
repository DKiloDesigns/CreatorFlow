import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

// Helper function to extract ID from URL
function getIdFromUrl(req: NextRequest): string {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  // The ID is the last segment in the path for this route
  return pathParts[pathParts.length - 1];
}

// Modified to use the correct Next.js App Router API route handler format
export async function GET(req: NextRequest) {
  const collabId = getIdFromUrl(req);
  
  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const collab = await prisma.brandCollab.findUnique({ 
        where: { id: collabId, userId }, 
        include: { posts: { include: { user: { select: { id: true, name: true, image: true } } } } } 
      });
      if (!collab) return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
    const collab = await prisma.brandCollab.findUnique({ 
      where: { id: collabId, userId }, 
      include: { posts: { include: { user: { select: { id: true, name: true, image: true } } } } } 
    });
    if (!collab) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(collab);
  } catch (error) {
    console.error('Collab GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const collabId = getIdFromUrl(req);
  
  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const data = await req.json();
      const collab = await prisma.brandCollab.update({ where: { id: collabId, userId }, data });
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
    const collab = await prisma.brandCollab.update({ where: { id: collabId, userId }, data });
    return NextResponse.json(collab);
  } catch (error) {
    console.error('Collab PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const collabId = getIdFromUrl(req);
  
  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      await prisma.brandCollab.delete({ where: { id: collabId, userId } });
      return NextResponse.json({ success: true });
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
    await prisma.brandCollab.delete({ where: { id: collabId, userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Collab DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}