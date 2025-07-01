import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

// GET: List team invitations
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const teamId = params.id;
  
  // API key auth
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      
      // Check if user has access to team
      const team = await prisma.team.findFirst({
        where: {
          id: teamId,
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
      });
      
      if (!team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }
      
      const invitations = await prisma.teamInvitation.findMany({
        where: { teamId },
        include: {
          invitedByUser: { select: { id: true, name: true, email: true } },
        },
      });
      
      return NextResponse.json(invitations);
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
  
  // Check if user has access to team
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
  });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }
  
  const invitations = await prisma.teamInvitation.findMany({
    where: { teamId },
    include: {
      invitedByUser: { select: { id: true, name: true, email: true } },
    },
  });
  
  return NextResponse.json(invitations);
}

// POST: Send team invitation (owner only)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const teamId = params.id;
  const { email, role = 'MEMBER' } = await req.json();
  
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  
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
        return NextResponse.json({ error: 'Forbidden - Only team owner can send invitations' }, { status: 403 });
      }
      
      try {
        // Check for existing pending invitation
        const existingInvitation = await prisma.teamInvitation.findFirst({
          where: {
            teamId,
            email,
            status: 'PENDING',
          },
        });
        
        if (existingInvitation) {
          return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 400 });
        }
        
        // Check if user is already a team member
        const existingMember = await prisma.teamMember.findFirst({
          where: {
            teamId,
            user: { email },
          },
        });
        
        if (existingMember) {
          return NextResponse.json({ error: 'User is already a member of this team' }, { status: 400 });
        }
        
        // Generate unique token
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        
        const invitation = await prisma.teamInvitation.create({
          data: {
            teamId,
            email,
            role,
            invitedBy: userId,
            token,
            expiresAt,
            status: 'PENDING',
          },
          include: {
            invitedByUser: { select: { id: true, name: true, email: true } },
          },
        });
        
        return NextResponse.json(invitation);
      } catch (error) {
        console.error('Failed to send invitation:', error);
        return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
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
    return NextResponse.json({ error: 'Forbidden - Only team owner can send invitations' }, { status: 403 });
  }
  
  try {
    // Check for existing pending invitation
    const existingInvitation = await prisma.teamInvitation.findFirst({
      where: {
        teamId,
        email,
        status: 'PENDING',
      },
    });
    
    if (existingInvitation) {
      return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 400 });
    }
    
    // Check if user is already a team member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        user: { email },
      },
    });
    
    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this team' }, { status: 400 });
    }
    
    // Generate unique token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId,
        email,
        role,
        invitedBy: userId,
        token,
        expiresAt,
        status: 'PENDING',
      },
      include: {
        invitedByUser: { select: { id: true, name: true, email: true } },
      },
    });
    
    return NextResponse.json(invitation);
  } catch (error) {
    console.error('Failed to send invitation:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
} 