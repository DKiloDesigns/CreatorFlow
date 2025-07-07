import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

// GET: List team members
export async function GET(req: NextRequest, context: any) {
  const { id } = context.params;
  
  // API key auth
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      
      // Check if user has access to team
      const team = await prisma.team.findFirst({
        where: {
          id: id,
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
      });
      
      if (!team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }
      
      const members = await prisma.teamMember.findMany({
        where: { teamId: id },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      });
      
      return NextResponse.json(members);
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
      id: id,
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
  });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }
  
  const members = await prisma.teamMember.findMany({
    where: { teamId: id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });
  
  return NextResponse.json(members);
}

// POST: Add member to team (owner only)
export async function POST(req: NextRequest, context: any) {
  const { id } = context.params;
  const { userId: newMemberId, role = 'MEMBER' } = await req.json();
  
  // API key auth
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      
      // Check if user is team owner
      const team = await prisma.team.findFirst({
        where: { id: id, ownerId: userId },
      });
      
      if (!team) {
        return NextResponse.json({ error: 'Forbidden - Only team owner can add members' }, { status: 403 });
      }
      
      try {
        const member = await prisma.teamMember.create({
          data: {
            teamId: id,
            userId: newMemberId,
            role,
          },
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        });
        
        return NextResponse.json(member);
      } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2002') {
          return NextResponse.json({ error: 'User is already a member of this team' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
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
    where: { id: id, ownerId: userId },
  });
  
  if (!team) {
    return NextResponse.json({ error: 'Forbidden - Only team owner can add members' }, { status: 403 });
  }
  
  try {
    const member = await prisma.teamMember.create({
      data: {
        teamId: id,
        userId: newMemberId,
        role,
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });
    
    return NextResponse.json(member);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2002') {
      return NextResponse.json({ error: 'User is already a member of this team' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}

// DELETE: Remove member from team (owner only)
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get('memberId');
  
  if (!memberId) {
    return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
  }
  
  // API key auth
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      
      // Check if user is team owner
      const team = await prisma.team.findFirst({
        where: { id: id, ownerId: userId },
      });
      
      if (!team) {
        return NextResponse.json({ error: 'Forbidden - Only team owner can remove members' }, { status: 403 });
      }
      
      try {
        await prisma.teamMember.delete({
          where: {
            teamId_userId: {
              teamId: id,
              userId: memberId,
            },
          },
        });
        
        return NextResponse.json({ message: 'Member removed successfully' });
      } catch (error) {
        return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
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
    where: { id: id, ownerId: userId },
  });
  
  if (!team) {
    return NextResponse.json({ error: 'Forbidden - Only team owner can remove members' }, { status: 403 });
  }
  
  try {
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: id,
          userId: memberId,
        },
      },
    });
    
    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
} 