import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

// Modified to use the correct Next.js App Router API route handler format
export async function POST(req: NextRequest) {
  // Extract the ID from the URL
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const collabId = pathParts[pathParts.length - 3]; // Get the ID from the URL path
  
  // Check for API key first
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const { postId } = await req.json();
      // Ensure post belongs to user
      const post = await prisma.post.findUnique({ where: { id: postId, userId } });
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      const updated = await prisma.post.update({ where: { id: postId }, data: { brandCollabId: collabId } });
      return NextResponse.json(updated);
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
    const { postId } = await req.json();
    // Ensure post belongs to user
    const post = await prisma.post.findUnique({ where: { id: postId, userId } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    const updated = await prisma.post.update({ where: { id: postId }, data: { brandCollabId: collabId } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Link post to collab error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}