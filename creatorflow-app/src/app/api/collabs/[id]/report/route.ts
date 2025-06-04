import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

// Modified to use the correct Next.js App Router API route handler format
export async function GET(req: NextRequest) {
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
      const posts = await prisma.post.findMany({ where: { userId, brandCollabId: collabId } });
      const totalPosts = posts.length;
      const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalEngagements = posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);
      const avgEngagementRate = totalPosts ? (totalEngagements / totalPosts) : 0;
      return NextResponse.json({ totalPosts, totalViews, totalEngagements, avgEngagementRate });
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
    const posts = await prisma.post.findMany({ where: { userId, brandCollabId: collabId } });
    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalEngagements = posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0);
    const avgEngagementRate = totalPosts ? (totalEngagements / totalPosts) : 0;
    return NextResponse.json({ totalPosts, totalViews, totalEngagements, avgEngagementRate });
  } catch (error) {
    console.error('Collab report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}