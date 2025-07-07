import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

// GET: Get team details by ID
export async function GET(req: NextRequest, context: any) {
  const { id } = context.params;
  
  // API key auth
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const team = await prisma.team.findFirst({
        where: {
          id: id,
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
        include: {
          owner: { select: { id: true, name: true, email: true, image: true } },
          members: {
            include: {
              user: { select: { id: true, name: true, email: true, image: true } },
            },
          },
          invitations: true,
          workspaces: true,
        },
      });
      
      if (!team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }
      
      return NextResponse.json(team);
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
  const team = await prisma.team.findFirst({
    where: {
      id: id,
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      owner: { select: { id: true, name: true, email: true, image: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      invitations: true,
      workspaces: true,
    },
  });
  
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }
  
  return NextResponse.json(team);
}

// PUT: Update team details (owner only)
export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params;
  const data = await req.json();
  
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
        return NextResponse.json({ error: 'Forbidden - Only team owner can update' }, { status: 403 });
      }
      
      try {
        const updatedTeam = await prisma.team.update({
          where: { id: id },
          data: { name: data.name, description: data.description },
          include: {
            owner: { select: { id: true, name: true, email: true, image: true } },
            members: {
              include: {
                user: { select: { id: true, name: true, email: true, image: true } },
              },
            },
          },
        });
        
        return NextResponse.json(updatedTeam);
      } catch (error) {
        return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
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
    return NextResponse.json({ error: 'Forbidden - Only team owner can update' }, { status: 403 });
  }
  
  try {
    const updatedTeam = await prisma.team.update({
      where: { id: id },
      data: { name: data.name, description: data.description },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
      },
    });
    
    return NextResponse.json(updatedTeam);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
}

// DELETE: Delete team (owner only)
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;
  
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
        return NextResponse.json({ error: 'Forbidden - Only team owner can delete' }, { status: 403 });
      }
      
      try {
        await prisma.team.delete({ where: { id: id } });
        return NextResponse.json({ message: 'Team deleted successfully' });
      } catch (error) {
        return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
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
    return NextResponse.json({ error: 'Forbidden - Only team owner can delete' }, { status: 403 });
  }
  
  try {
    await prisma.team.delete({ where: { id: id } });
    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
  }
} 