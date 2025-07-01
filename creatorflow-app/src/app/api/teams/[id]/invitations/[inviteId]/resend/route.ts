import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

// POST: Resend team invitation (team owner only)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; inviteId: string } }
) {
  const teamId = params.id;
  const invitationId = params.inviteId;
  
  // API key auth
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      
      // Check if user is team owner
      const team = await prisma.team.findFirst({
        where: { id: teamId, ownerId: userId },
      });
      
      if (!team) {
        return NextResponse.json({ error: 'Forbidden - Only team owner can resend invitations' }, { status: 403 });
      }
      
      // Find the invitation
      const invitation = await prisma.teamInvitation.findFirst({
        where: {
          id: invitationId,
          teamId,
          status: 'PENDING',
        },
      });
      
      if (!invitation) {
        return NextResponse.json({ error: 'Invitation not found or already processed' }, { status: 404 });
      }
      
      try {
        // Generate new token and expiration
        const newToken = crypto.randomUUID();
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        
        const updatedInvitation = await prisma.teamInvitation.update({
          where: { id: invitationId },
          data: {
            token: newToken,
            expiresAt: newExpiresAt,
            createdAt: new Date(), // Reset creation time
          },
          include: {
            invitedByUser: { select: { id: true, name: true, email: true } },
          },
        });
        
        return NextResponse.json(updatedInvitation);
      } catch (error) {
        console.error('Failed to resend invitation:', error);
        return NextResponse.json({ error: 'Failed to resend invitation' }, { status: 500 });
      }
    } else {
      return auth;
    }
  }
  
  // Session auth
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = session.user.id;
  
  // Check if user is team owner
  const team = await prisma.team.findFirst({
    where: { id: teamId, ownerId: userId },
  });
  
  if (!team) {
    return NextResponse.json({ error: 'Forbidden - Only team owner can resend invitations' }, { status: 403 });
  }
  
  // Find the invitation
  const invitation = await prisma.teamInvitation.findFirst({
    where: {
      id: invitationId,
      teamId,
      status: 'PENDING',
    },
  });
  
  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found or already processed' }, { status: 404 });
  }
  
  try {
    // Generate new token and expiration
    const newToken = crypto.randomUUID();
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const updatedInvitation = await prisma.teamInvitation.update({
      where: { id: invitationId },
      data: {
        token: newToken,
        expiresAt: newExpiresAt,
        createdAt: new Date(), // Reset creation time
      },
      include: {
        invitedByUser: { select: { id: true, name: true, email: true } },
      },
    });
    
    return NextResponse.json(updatedInvitation);
  } catch (error) {
    console.error('Failed to resend invitation:', error);
    return NextResponse.json({ error: 'Failed to resend invitation' }, { status: 500 });
  }
} 