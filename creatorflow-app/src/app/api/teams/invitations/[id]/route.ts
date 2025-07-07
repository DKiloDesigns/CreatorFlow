import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

// PUT: Accept or decline team invitation
export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params;
  const { action } = await req.json(); // 'accept' or 'decline'
  
  if (!['accept', 'decline'].includes(action)) {
    return NextResponse.json({ error: 'Action must be "accept" or "decline"' }, { status: 400 });
  }
  
  // API key auth
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      
      // Find invitation and verify it's for the current user
      if (!auth.user.email) {
        return NextResponse.json({ error: 'Unauthorized: No email' }, { status: 401 });
      }
      const invitation = await prisma.teamInvitation.findFirst({
        where: {
          id: id,
          email: auth.user.email as string,
          status: 'PENDING',
        },
        include: {
          team: true,
        },
      });
      
      if (!invitation) {
        return NextResponse.json({ error: 'Invitation not found or already processed' }, { status: 404 });
      }
      
      // Check if invitation has expired
      if (invitation.expiresAt < new Date()) {
        await prisma.teamInvitation.update({
          where: { id: id },
          data: { status: 'EXPIRED' },
        });
        return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
      }
      
      if (action === 'accept') {
        try {
          // Add user to team and update invitation status
          await prisma.$transaction([
            prisma.teamMember.create({
              data: {
                teamId: invitation.teamId,
                userId,
                role: invitation.role,
                invitedBy: invitation.invitedBy,
                invitedAt: invitation.createdAt,
              },
            }),
            prisma.teamInvitation.update({
              where: { id: id },
              data: { 
                status: 'ACCEPTED',
                respondedAt: new Date(),
                acceptedAt: new Date(),
              },
            }),
          ]);
          
          return NextResponse.json({ message: 'Invitation accepted successfully' });
        } catch (error) {
          if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2002') {
            return NextResponse.json({ error: 'You are already a member of this team' }, { status: 400 });
          }
          return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 });
        }
      } else {
        // Decline invitation
        try {
          await prisma.teamInvitation.update({
            where: { id: id },
            data: { 
              status: 'DECLINED',
              respondedAt: new Date(),
            },
          });
          
          return NextResponse.json({ message: 'Invitation declined successfully' });
        } catch (error) {
          return NextResponse.json({ error: 'Failed to decline invitation' }, { status: 500 });
        }
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
  const userEmail = session.user.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized: No email' }, { status: 401 });
  }
  
  // Find invitation and verify it's for the current user
  const invitation = await prisma.teamInvitation.findFirst({
    where: {
      id: id,
      email: userEmail as string,
      status: 'PENDING',
    },
    include: {
      team: true,
    },
  });
  
  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found or already processed' }, { status: 404 });
  }
  
  // Check if invitation has expired
  if (invitation.expiresAt < new Date()) {
    await prisma.teamInvitation.update({
      where: { id: id },
      data: { status: 'EXPIRED' },
    });
    return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
  }
  
  if (action === 'accept') {
    try {
      // Add user to team and update invitation status
      await prisma.$transaction([
        prisma.teamMember.create({
          data: {
            teamId: invitation.teamId,
            userId,
            role: invitation.role,
            invitedBy: invitation.invitedBy,
            invitedAt: invitation.createdAt,
          },
        }),
        prisma.teamInvitation.update({
          where: { id: id },
          data: { 
            status: 'ACCEPTED',
            respondedAt: new Date(),
            acceptedAt: new Date(),
          },
        }),
      ]);
      
      return NextResponse.json({ message: 'Invitation accepted successfully' });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'You are already a member of this team' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 });
    }
  } else {
    // Decline invitation
    try {
      await prisma.teamInvitation.update({
        where: { id: id },
        data: { 
          status: 'DECLINED',
          respondedAt: new Date(),
        },
      });
      
      return NextResponse.json({ message: 'Invitation declined successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to decline invitation' }, { status: 500 });
    }
  }
}

// DELETE: Cancel invitation (team owner only)
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;
  
  // API key auth
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      
      // Find invitation and verify user is team owner
      const invitation = await prisma.teamInvitation.findFirst({
        where: {
          id: id,
          team: { ownerId: userId },
          status: 'PENDING',
        },
      });
      
      if (!invitation) {
        return NextResponse.json({ error: 'Invitation not found or already processed' }, { status: 404 });
      }
      
      try {
        await prisma.teamInvitation.update({
          where: { id: id },
          data: { 
            status: 'CANCELED',
            respondedAt: new Date(),
          },
        });
        
        return NextResponse.json({ message: 'Invitation cancelled successfully' });
      } catch (error) {
        return NextResponse.json({ error: 'Failed to cancel invitation' }, { status: 500 });
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
  
  // Find invitation and verify user is team owner
  const invitation = await prisma.teamInvitation.findFirst({
    where: {
      id: id,
      team: { ownerId: userId },
      status: 'PENDING',
    },
  });
  
  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found or already processed' }, { status: 404 });
  }
  
  try {
    await prisma.teamInvitation.update({
      where: { id: id },
      data: { 
        status: 'CANCELED',
        respondedAt: new Date(),
      },
    });
    
    return NextResponse.json({ message: 'Invitation cancelled successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel invitation' }, { status: 500 });
  }
} 